/**
 * NProgress Plugin for Vue Router
 *
 * Provides a slim progress bar at the top of the page during route transitions.
 * Integrates cleanly with Vue Router navigation guards and handles edge cases.
 *
 * @version 1.0.0
 * @author HRMS Team
 *
 * Features:
 * - Automatic start/stop with route navigation
 * - Configurable appearance to match theme colors
 * - Timeout protection for stuck progress bars
 * - Error handling for failed route transitions
 * - Memory leak prevention with proper cleanup
 * - Does not interfere with WebSocket connections
 */

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * NProgress configuration options
 * @see https://ricostacruz.com/nprogress/
 */
const NPROGRESS_CONFIG = {
  // Minimum percentage to start at (0.0 - 1.0)
  minimum: 0.1,

  // How much to increase per trickle (slower = smoother for heavy loads)
  trickleSpeed: 200,

  // Show spinner alongside the progress bar
  showSpinner: false,

  // Easing animation
  easing: 'ease',

  // Animation speed in ms
  speed: 400,

  // Parent element to attach progress bar to
  parent: 'body',
};

/**
 * Timeout in ms to force-finish progress bar if navigation takes too long
 * Prevents stuck progress bars from slow API calls or failed navigations
 */
const PROGRESS_TIMEOUT = 30000; // 30 seconds

/**
 * Routes that should skip the progress bar (instant transitions)
 * Useful for routes that don't need loading indication
 */
const SKIP_PROGRESS_ROUTES = [
  '/login',
  '/logout',
];

// ============================================================================
// STATE
// ============================================================================

let progressTimer = null;
let isNavigating = false;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a route should skip the progress bar
 * @param {string} path - Route path
 * @returns {boolean}
 */
function shouldSkipProgress(path) {
  return SKIP_PROGRESS_ROUTES.some(route => path === route || path.startsWith(route + '/'));
}

/**
 * Clear the progress timeout timer
 */
function clearProgressTimer() {
  if (progressTimer) {
    clearTimeout(progressTimer);
    progressTimer = null;
  }
}

/**
 * Start the progress bar with timeout protection
 */
function startProgress() {
  // Prevent multiple starts
  if (isNavigating) return;

  isNavigating = true;
  clearProgressTimer();

  // Start the progress bar
  NProgress.start();

  // Set timeout to force-finish if navigation takes too long
  progressTimer = setTimeout(() => {
    console.warn('[NProgress] Navigation timeout - forcing progress bar to complete');
    finishProgress();
  }, PROGRESS_TIMEOUT);
}

/**
 * Finish the progress bar and cleanup
 */
function finishProgress() {
  clearProgressTimer();
  isNavigating = false;
  NProgress.done();
}

/**
 * Increment progress manually (for heavy routes that load data)
 * Can be called from components to show intermediate progress
 */
function incrementProgress() {
  if (isNavigating) {
    NProgress.inc();
  }
}

// ============================================================================
// ROUTER INTEGRATION
// ============================================================================

/**
 * Install NProgress with Vue Router
 * Sets up beforeEach and afterEach hooks for automatic progress tracking
 *
 * @param {Router} router - Vue Router instance
 * @param {Object} options - Optional configuration overrides
 */
export function setupNProgress(router, options = {}) {
  // Merge custom options with defaults
  const config = { ...NPROGRESS_CONFIG, ...options };

  // Configure NProgress
  NProgress.configure(config);

  // Before each route navigation - start progress
  router.beforeEach((to, from, next) => {
    // Skip progress for certain routes
    if (shouldSkipProgress(to.path)) {
      return next();
    }

    // Skip if navigating to the same route (hash changes, query updates)
    if (to.path === from.path) {
      return next();
    }

    // Start the progress bar
    startProgress();

    next();
  });

  // After each route navigation - finish progress
  router.afterEach((to, from, failure) => {
    // Handle navigation failures
    if (failure) {
      console.warn('[NProgress] Navigation failed:', failure);
    }

    // Always finish progress (even on failure)
    // Use setTimeout to allow the page to render first
    setTimeout(() => {
      finishProgress();
    }, 0);
  });

  // Handle navigation errors (e.g., network failures during lazy loading)
  router.onError((error) => {
    console.error('[NProgress] Router error:', error);
    finishProgress();
  });

  console.log('[NProgress] Route progress tracking initialized');
}

// ============================================================================
// MANUAL CONTROL API
// ============================================================================

/**
 * Manually start the progress bar
 * Useful for non-route transitions (e.g., API calls, file uploads)
 */
export function start() {
  startProgress();
}

/**
 * Manually finish the progress bar
 */
export function done() {
  finishProgress();
}

/**
 * Manually set progress to a specific value (0.0 - 1.0)
 * @param {number} value - Progress value
 */
export function set(value) {
  NProgress.set(value);
}

/**
 * Increment progress by a small amount
 */
export function inc() {
  incrementProgress();
}

/**
 * Check if progress bar is currently active
 * @returns {boolean}
 */
export function isStarted() {
  return NProgress.isStarted();
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  install: (app, { router, options = {} } = {}) => {
    if (!router) {
      console.error('[NProgress] Router instance is required');
      return;
    }

    setupNProgress(router, options);

    // Provide NProgress methods globally via injection
    app.provide('nprogress', {
      start,
      done,
      set,
      inc,
      isStarted,
    });

    // Also add to global properties for Options API access
    app.config.globalProperties.$nprogress = {
      start,
      done,
      set,
      inc,
      isStarted,
    };
  },
};

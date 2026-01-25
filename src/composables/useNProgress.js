/**
 * useNProgress Composable
 *
 * A Vue 3 composable for managing NProgress loading bar state.
 * Follows the recommended VueUse pattern for NProgress integration.
 *
 * @see https://vueuse.org/integrations/usenprogress/
 *
 * Features:
 * - Reactive loading state management
 * - Automatic Vue Router integration
 * - Manual control for data fetching operations
 * - Configurable options
 *
 * @example
 * ```js
 * // In a component
 * import { useNProgress } from '@/composables/useNProgress';
 *
 * const { isLoading, start, done } = useNProgress();
 *
 * // Toggle loading state
 * isLoading.value = true;
 *
 * // Or use methods
 * start();
 * await fetchData();
 * done();
 * ```
 */

import { ref, computed, watch } from 'vue';
import NProgress from 'nprogress';
// Note: nprogress.css is NOT imported here
// Custom styles are imported in main.js via '@/assets/css/nprogress-custom.css'
// This ensures our custom styling takes precedence

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Default NProgress configuration
 * @see https://github.com/rstacruz/nprogress#configuration
 */
const DEFAULT_OPTIONS = {
  minimum: 0.08,
  easing: 'ease',
  speed: 350,
  trickle: true,
  trickleSpeed: 200,
  showSpinner: false,
  parent: 'body',
};

// ============================================================================
// SINGLETON STATE
// ============================================================================

// Shared state across all composable instances
let isConfigured = false;
const progress = ref(null);
const isLoadingInternal = ref(false);
let timeoutId = null;

/**
 * Timeout in ms to auto-finish progress bar if it gets stuck
 * Prevents infinite loading states
 */
const PROGRESS_TIMEOUT = 30000; // 30 seconds

// ============================================================================
// COMPOSABLE
// ============================================================================

/**
 * NProgress composable for reactive loading bar management
 *
 * @param {number|null} initialProgress - Initial progress value (0-1), null for auto
 * @param {Object} options - NProgress configuration options
 * @returns {Object} Reactive loading state and control methods
 */
export function useNProgress(initialProgress = null, options = {}) {
  // Configure NProgress only once
  if (!isConfigured) {
    NProgress.configure({ ...DEFAULT_OPTIONS, ...options });
    isConfigured = true;
  }

  // Set initial progress if provided
  if (initialProgress !== null && typeof initialProgress === 'number') {
    progress.value = initialProgress;
    NProgress.set(initialProgress);
  }

  /**
   * Computed property for loading state
   * Setting this to true starts the progress bar, false stops it
   */
  const isLoading = computed({
    get: () => isLoadingInternal.value,
    set: (value) => {
      isLoadingInternal.value = value;
      if (value) {
        NProgress.start();
      } else {
        NProgress.done();
      }
    },
  });

  /**
   * Clear the timeout timer
   */
  function clearTimer() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  /**
   * Start the progress bar
   * Includes timeout protection to auto-finish if stuck
   */
  function start() {
    clearTimer();
    isLoadingInternal.value = true;
    NProgress.start();

    // Set timeout to auto-finish if stuck
    timeoutId = setTimeout(() => {
      console.warn('[NProgress] Timeout - auto-finishing stuck progress bar');
      done(true);
    }, PROGRESS_TIMEOUT);
  }

  /**
   * Complete the progress bar
   * @param {boolean} force - Force complete even if not started
   */
  function done(force = false) {
    clearTimer();
    isLoadingInternal.value = false;
    NProgress.done(force);
  }

  /**
   * Set progress to a specific value
   * @param {number} value - Progress value between 0 and 1
   */
  function set(value) {
    progress.value = value;
    NProgress.set(value);
  }

  /**
   * Increment progress by a random amount
   * @param {number} amount - Optional specific amount to increment
   */
  function inc(amount) {
    NProgress.inc(amount);
  }

  /**
   * Remove the progress bar from DOM
   */
  function remove() {
    isLoadingInternal.value = false;
    NProgress.remove();
  }

  // Sync progress value with NProgress state
  watch(progress, (newValue) => {
    if (newValue !== null && typeof newValue === 'number') {
      NProgress.set(newValue);
    }
  });

  return {
    // Reactive state
    isLoading,
    progress,

    // Methods
    start,
    done,
    set,
    inc,
    remove,
  };
}

// ============================================================================
// ROUTER INTEGRATION
// ============================================================================

/**
 * Setup NProgress with Vue Router
 * Call this once in your app initialization
 *
 * @param {Router} router - Vue Router instance
 * @param {Object} options - Configuration options
 * @param {string[]} options.skipRoutes - Routes to skip progress bar
 *
 * @example
 * ```js
 * // In main.js or router setup
 * import { setupRouterNProgress } from '@/composables/useNProgress';
 * import { router } from './router';
 *
 * setupRouterNProgress(router);
 * ```
 */
export function setupRouterNProgress(router, options = {}) {
  const {
    skipRoutes = ['/login', '/logout'],
  } = options;

  const { isLoading } = useNProgress();

  // Before each navigation - start progress
  router.beforeEach((to, from) => {
    // Skip for certain routes
    if (skipRoutes.some(route => to.path === route || to.path.startsWith(route + '/'))) {
      return;
    }

    // Skip if same route (query/hash changes only)
    if (to.path === from.path) {
      return;
    }

    isLoading.value = true;
  });

  // After navigation resolves - stop progress
  router.afterEach(() => {
    isLoading.value = false;
  });

  // On navigation error - stop progress
  router.onError(() => {
    isLoading.value = false;
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default useNProgress;

/**
 * Advanced Caching Utilities for Dropdown Data Optimization
 *
 * Features:
 * - Request Deduplication: Prevents duplicate API calls
 * - Stale-While-Revalidate (SWR): Serves stale data while fetching fresh data
 * - TTL-based Cache Management: Automatic expiration
 * - Performance Monitoring: Track cache efficiency
 *
 * @author HRMS Team
 * @version 2.0.0
 */

/**
 * Cache entry structure
 * @typedef {Object} CacheEntry
 * @property {*} data - Cached data
 * @property {number} timestamp - When data was cached
 * @property {number} maxAge - Cache TTL in milliseconds
 * @property {boolean} isStale - Whether data is stale but usable
 */

/**
 * Performance metrics for monitoring
 * @typedef {Object} PerformanceMetrics
 * @property {number} hits - Cache hit count
 * @property {number} misses - Cache miss count
 * @property {number} revalidations - Background revalidation count
 * @property {number} duplicatePrevented - Duplicate requests prevented
 */

class CacheManager {
  constructor() {
    // Cache storage: Map<string, CacheEntry>
    this.cache = new Map();

    // Pending requests: Map<string, Promise>
    this.pendingRequests = new Map();

    // AbortControllers: Map<string, AbortController>
    this.abortControllers = new Map();

    // Performance metrics
    this.metrics = {
      hits: 0,
      misses: 0,
      revalidations: 0,
      duplicatePrevented: 0,
      staleSeries: 0
    };

    // Debug mode (set to false in production)
    // Use process.env for webpack compatibility
    this.debug = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') || false;

    this.log('CacheManager initialized');
  }

  /**
   * Debug logging
   */
  log(message, ...args) {
    if (this.debug) {
      console.log(`[CacheManager] ${message}`, ...args);
    }
  }

  /**
   * Generate cache key from resource and params
   */
  getCacheKey(resource, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    return `${resource}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Check if cached data is still fresh
   */
  isFresh(entry) {
    if (!entry) return false;
    const age = Date.now() - entry.timestamp;
    return age < entry.maxAge;
  }

  /**
   * Check if cached data exists but is stale
   */
  isStale(entry) {
    if (!entry) return false;
    const age = Date.now() - entry.timestamp;
    return age >= entry.maxAge && age < entry.maxAge * 2; // Stale window = maxAge to maxAge*2
  }

  /**
   * Get cached data if available
   */
  get(resource, params = {}) {
    const key = this.getCacheKey(resource, params);
    const entry = this.cache.get(key);

    if (!entry) {
      this.metrics.misses++;
      this.log(`Cache MISS: ${key}`);
      return null;
    }

    if (this.isFresh(entry)) {
      this.metrics.hits++;
      this.log(`Cache HIT (fresh): ${key}`, { age: Date.now() - entry.timestamp });
      return { data: entry.data, fresh: true, stale: false };
    }

    if (this.isStale(entry)) {
      this.metrics.staleSeries++;
      this.log(`Cache HIT (stale): ${key}`, { age: Date.now() - entry.timestamp });
      return { data: entry.data, fresh: false, stale: true };
    }

    // Data is too old, treat as miss
    this.metrics.misses++;
    this.log(`Cache EXPIRED: ${key}`);
    this.cache.delete(key);
    return null;
  }

  /**
   * Set cached data with TTL
   */
  set(resource, params = {}, data, maxAge = 5 * 60 * 1000) {
    const key = this.getCacheKey(resource, params);

    const entry = {
      data,
      timestamp: Date.now(),
      maxAge,
      isStale: false
    };

    this.cache.set(key, entry);
    this.log(`Cache SET: ${key}`, { maxAge: `${maxAge / 1000}s` });

    return entry;
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(resource, params = {}) {
    const key = this.getCacheKey(resource, params);
    const deleted = this.cache.delete(key);

    if (deleted) {
      this.log(`Cache INVALIDATED: ${key}`);
    }

    return deleted;
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern) {
    let count = 0;

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }

    this.log(`Cache INVALIDATED (pattern): ${pattern}`, { count });
    return count;
  }

  /**
   * Clear all cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.log(`Cache CLEARED`, { entries: size });
  }

  /**
   * Request Deduplication: Prevent duplicate concurrent API calls
   */
  async deduplicate(resource, params = {}, fetchFn) {
    const key = this.getCacheKey(resource, params);

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      this.metrics.duplicatePrevented++;
      this.log(`Request DEDUPLICATED: ${key}`);
      return this.pendingRequests.get(key);
    }

    // Create AbortController for this request
    const controller = new AbortController();
    this.abortControllers.set(key, controller);

    // Execute fetch and store promise
    const promise = fetchFn(controller.signal)
      .finally(() => {
        // Clean up after request completes
        this.pendingRequests.delete(key);
        this.abortControllers.delete(key);
      });

    this.pendingRequests.set(key, promise);
    this.log(`Request STARTED: ${key}`);

    return promise;
  }

  /**
   * Abort pending request
   */
  abort(resource, params = {}) {
    const key = this.getCacheKey(resource, params);
    const controller = this.abortControllers.get(key);

    if (controller) {
      controller.abort();
      this.pendingRequests.delete(key);
      this.abortControllers.delete(key);
      this.log(`Request ABORTED: ${key}`);
      return true;
    }

    return false;
  }

  /**
   * Stale-While-Revalidate (SWR) Pattern
   * Returns cached data immediately if available, triggers background revalidation if stale
   */
  async fetchWithSWR(resource, params = {}, fetchFn, options = {}) {
    const {
      maxAge = 5 * 60 * 1000, // 5 minutes default
      forceRefresh = false
    } = options;

    const key = this.getCacheKey(resource, params);

    // Force refresh bypasses cache
    if (forceRefresh) {
      this.log(`SWR: Force refresh for ${key}`);
      const data = await this.deduplicate(resource, params, fetchFn);
      this.set(resource, params, data, maxAge);
      return { data, source: 'network', fresh: true };
    }

    // Check cache
    const cached = this.get(resource, params);

    // Cache hit with fresh data
    if (cached && cached.fresh) {
      return { data: cached.data, source: 'cache', fresh: true };
    }

    // Cache hit with stale data - serve stale, revalidate in background
    if (cached && cached.stale) {
      this.log(`SWR: Serving stale data for ${key}, revalidating...`);
      this.metrics.revalidations++;

      // Background revalidation (don't await)
      this.deduplicate(resource, params, fetchFn)
        .then(data => {
          this.set(resource, params, data, maxAge);
          this.log(`SWR: Background revalidation complete for ${key}`);
        })
        .catch(error => {
          this.log(`SWR: Background revalidation failed for ${key}`, error);
        });

      return { data: cached.data, source: 'cache', fresh: false, revalidating: true };
    }

    // Cache miss - fetch fresh data
    this.log(`SWR: Cache miss for ${key}, fetching...`);
    const data = await this.deduplicate(resource, params, fetchFn);
    this.set(resource, params, data, maxAge);
    return { data, source: 'network', fresh: true };
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    const hitRate = total > 0 ? ((this.metrics.hits / total) * 100).toFixed(2) : 0;

    return {
      ...this.metrics,
      total,
      hitRate: `${hitRate}%`,
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      hits: 0,
      misses: 0,
      revalidations: 0,
      duplicatePrevented: 0,
      staleSeries: 0
    };
    this.log('Metrics reset');
  }

  /**
   * Cleanup old cache entries
   */
  cleanup() {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      // Remove entries older than 2x maxAge
      if (age > entry.maxAge * 2) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.log(`Cleanup: Removed ${cleaned} expired entries`);
    }

    return cleaned;
  }
}

// Singleton instance
const cacheManager = new CacheManager();

// Auto-cleanup every 10 minutes
setInterval(() => {
  cacheManager.cleanup();
}, 10 * 60 * 1000);

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  marks: new Map(),

  /**
   * Start performance measurement
   */
  start(label) {
    const mark = `${label}-start`;
    if (performance && performance.mark) {
      performance.mark(mark);
      this.marks.set(label, Date.now());
    }
  },

  /**
   * End performance measurement and log duration
   */
  end(label) {
    const startTime = this.marks.get(label);
    if (!startTime) return null;

    const duration = Date.now() - startTime;
    this.marks.delete(label);

    if (performance && performance.mark && performance.measure) {
      const startMark = `${label}-start`;
      const endMark = `${label}-end`;
      performance.mark(endMark);

      try {
        performance.measure(label, startMark, endMark);
      } catch (e) {
        // Ignore if marks don't exist
      }
    }

    // Log in development mode
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${label}: ${duration}ms`);
    }

    return duration;
  },

  /**
   * Log cache statistics
   */
  logCacheStats() {
    const metrics = cacheManager.getMetrics();
    console.table(metrics);
  }
};

/**
 * Data categorization helpers
 */
export const CacheStrategy = {
  // Static data: Cache indefinitely during session (until page refresh)
  STATIC: {
    maxAge: Infinity,
    label: 'static'
  },

  // Semi-static: Cache for 30 minutes
  SEMI_STATIC: {
    maxAge: 30 * 60 * 1000,
    label: 'semi-static'
  },

  // Dynamic: Cache for 5 minutes, use SWR
  DYNAMIC: {
    maxAge: 5 * 60 * 1000,
    label: 'dynamic'
  },

  // Real-time: Cache for 1 minute, always revalidate
  REALTIME: {
    maxAge: 60 * 1000,
    label: 'realtime'
  }
};

export { cacheManager };
export default cacheManager;

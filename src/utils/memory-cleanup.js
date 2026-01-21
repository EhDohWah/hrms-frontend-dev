/**
 * Memory Cleanup Utilities
 * Helps prevent memory leaks in Vue components
 * 
 * @module utils/memory-cleanup
 */

// Track global event listeners for cleanup
const globalListeners = new Map();

/**
 * Add a tracked event listener that will be automatically cleaned up
 * @param {string} componentId - Unique identifier for the component
 * @param {Element} element - DOM element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 */
export function addTrackedListener(componentId, element, event, handler) {
  if (!globalListeners.has(componentId)) {
    globalListeners.set(componentId, []);
  }
  
  element.addEventListener(event, handler);
  globalListeners.get(componentId).push({ element, event, handler });
}

/**
 * Remove all tracked event listeners for a component
 * @param {string} componentId - Unique identifier for the component
 */
export function cleanupListeners(componentId) {
  const listeners = globalListeners.get(componentId);
  if (listeners) {
    listeners.forEach(({ element, event, handler }) => {
      try {
        element.removeEventListener(event, handler);
      } catch (e) {
        // Element may have been removed from DOM
      }
    });
    globalListeners.delete(componentId);
  }
}

/**
 * Cleanup mixin for Vue components
 * Provides automatic cleanup of event listeners, intervals, timeouts, and observers
 * 
 * @example
 * import { cleanupMixin } from '@/utils/memory-cleanup';
 * 
 * export default {
 *   mixins: [cleanupMixin],
 *   mounted() {
 *     this.$addListener(document, 'click', this.handleClick);
 *     this.$setInterval(this.poll, 5000);
 *   }
 * };
 */
export const cleanupMixin = {
  data() {
    return {
      _componentId: null,
      _intervals: [],
      _timeouts: [],
      _observers: [],
    };
  },
  
  created() {
    this._componentId = `${this.$options.name || 'component'}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  
  beforeUnmount() {
    // Clean up event listeners
    cleanupListeners(this._componentId);
    
    // Clear intervals
    if (this._intervals) {
      this._intervals.forEach(id => clearInterval(id));
      this._intervals = [];
    }
    
    // Clear timeouts
    if (this._timeouts) {
      this._timeouts.forEach(id => clearTimeout(id));
      this._timeouts = [];
    }
    
    // Disconnect observers
    if (this._observers) {
      this._observers.forEach(observer => {
        try {
          observer.disconnect();
        } catch (e) {
          // Observer may already be disconnected
        }
      });
      this._observers = [];
    }
  },
  
  methods: {
    /**
     * Add an event listener that will be automatically cleaned up
     * @param {Element} element - DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    $addListener(element, event, handler) {
      addTrackedListener(this._componentId, element, event, handler);
    },
    
    /**
     * Set an interval that will be automatically cleared
     * @param {Function} handler - Interval callback
     * @param {number} delay - Delay in milliseconds
     * @returns {number} Interval ID
     */
    $setInterval(handler, delay) {
      const id = setInterval(handler, delay);
      this._intervals.push(id);
      return id;
    },
    
    /**
     * Clear a tracked interval
     * @param {number} id - Interval ID
     */
    $clearInterval(id) {
      clearInterval(id);
      const index = this._intervals.indexOf(id);
      if (index > -1) {
        this._intervals.splice(index, 1);
      }
    },
    
    /**
     * Set a timeout that will be automatically cleared
     * @param {Function} handler - Timeout callback
     * @param {number} delay - Delay in milliseconds
     * @returns {number} Timeout ID
     */
    $setTimeout(handler, delay) {
      const id = setTimeout(handler, delay);
      this._timeouts.push(id);
      return id;
    },
    
    /**
     * Clear a tracked timeout
     * @param {number} id - Timeout ID
     */
    $clearTimeout(id) {
      clearTimeout(id);
      const index = this._timeouts.indexOf(id);
      if (index > -1) {
        this._timeouts.splice(index, 1);
      }
    },
    
    /**
     * Add an observer that will be automatically disconnected
     * @param {MutationObserver|ResizeObserver|IntersectionObserver} observer
     */
    $addObserver(observer) {
      this._observers.push(observer);
    },
  },
};

/**
 * Force garbage collection hint (for debugging only - requires Chrome with --expose-gc flag)
 */
export function suggestGC() {
  if (typeof window !== 'undefined' && window.gc) {
    window.gc();
  }
}

/**
 * Get current memory usage (if available)
 * @returns {Object|null} Memory info or null if not available
 */
export function getMemoryInfo() {
  if (typeof performance !== 'undefined' && performance.memory) {
    return {
      usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
    };
  }
  return null;
}

export default {
  cleanupMixin,
  addTrackedListener,
  cleanupListeners,
  suggestGC,
  getMemoryInfo,
};


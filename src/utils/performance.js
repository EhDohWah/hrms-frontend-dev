/**
 * Performance utilities for optimizing Vue.js applications
 */

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {boolean} immediate - Execute on leading edge
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Chunk large arrays for processing without blocking UI
 * @param {Array} array - Array to process
 * @param {number} chunkSize - Size of each chunk
 * @param {Function} processor - Function to process each chunk
 * @returns {Promise} Promise that resolves when all chunks are processed
 */
export function processInChunks(array, chunkSize = 100, processor) {
    return new Promise((resolve) => {
        let index = 0;

        function processChunk() {
            const chunk = array.slice(index, index + chunkSize);
            if (chunk.length === 0) {
                resolve();
                return;
            }

            processor(chunk, index);
            index += chunkSize;

            // Use setTimeout to yield control back to browser
            setTimeout(processChunk, 0);
        }

        processChunk();
    });
}

/**
 * Create a memoized version of a function with LRU cache
 * @param {Function} fn - Function to memoize
 * @param {number} maxSize - Maximum cache size
 * @returns {Function} Memoized function
 */
export function memoize(fn, maxSize = 100) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            // Move to end (most recently used)
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }

        const result = fn.apply(this, args);

        // Remove oldest entry if cache is full
        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        cache.set(key, result);
        return result;
    };
}

/**
 * Request animation frame wrapper for smooth DOM updates
 * @param {Function} callback - Function to execute on next frame
 * @returns {number} Animation frame ID
 */
export function nextFrame(callback) {
    return requestAnimationFrame(callback);
}

/**
 * Batch DOM updates to minimize reflows
 * @param {Function} updates - Function containing DOM updates
 */
export function batchDOMUpdates(updates) {
    requestAnimationFrame(() => {
        updates();
    });
}

/**
 * Create a virtual scrolling helper
 * @param {Array} items - All items to virtualize
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of the container
 * @param {number} scrollTop - Current scroll position
 * @param {number} buffer - Number of items to render outside viewport
 * @returns {Object} Virtual scroll data
 */
export function createVirtualScrollData(items, itemHeight, containerHeight, scrollTop, buffer = 5) {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endIndex = Math.min(items.length, startIndex + visibleCount + buffer * 2);

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;
    const totalHeight = items.length * itemHeight;

    return {
        visibleItems,
        startIndex,
        endIndex,
        offsetY,
        totalHeight,
        visibleCount
    };
}

/**
 * Deep freeze object to prevent Vue reactivity on static data
 * @param {Object} obj - Object to freeze
 * @returns {Object} Frozen object
 */
export function deepFreeze(obj) {
    if (obj === null || typeof obj !== 'object') return obj;

    Object.freeze(obj);

    Object.values(obj).forEach(value => {
        if (typeof value === 'object' && value !== null) {
            deepFreeze(value);
        }
    });

    return obj;
}

/**
 * Cleanup utility for removing event listeners and clearing timers
 */
export class PerformanceCleanup {
    constructor() {
        this.timers = new Set();
        this.listeners = new Set();
        this.observers = new Set();
    }

    addTimer(timerId) {
        this.timers.add(timerId);
        return timerId;
    }

    addListener(element, event, handler, options) {
        const listener = { element, event, handler, options };
        this.listeners.add(listener);
        element.addEventListener(event, handler, options);
        return listener;
    }

    addObserver(observer) {
        this.observers.add(observer);
        return observer;
    }

    cleanup() {
        // Clear timers
        this.timers.forEach(timerId => clearTimeout(timerId));
        this.timers.clear();

        // Remove event listeners
        this.listeners.forEach(({ element, event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
        this.listeners.clear();

        // Disconnect observers
        this.observers.forEach(observer => {
            if (observer.disconnect) observer.disconnect();
        });
        this.observers.clear();
    }
}

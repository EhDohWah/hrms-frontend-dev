/**
 * Dropdown Data Management Composable
 *
 * Features:
 * - Smart data categorization (static, semi-static, dynamic)
 * - Intelligent prefetching based on user actions
 * - Progressive data loading
 * - Automatic cache management
 *
 * @author HRMS Team
 * @version 2.0.0
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { useLookupStore } from '@/stores/lookupStore';
import { cacheManager, CacheStrategy, performanceMonitor } from '@/utils/cache';

/**
 * Data categorization based on change frequency
 */
const DataCategory = {
  // Static: Rarely changes (e.g., gender, marital status)
  STATIC: {
    resources: ['genders', 'marital_status'],
    strategy: CacheStrategy.STATIC,
    priority: 'critical'
  },

  // Semi-static: Changes occasionally (e.g., departments, positions, subsidiaries)
  SEMI_STATIC: {
    resources: ['departments', 'subsidiaries', 'grants', 'work_locations'],
    strategy: CacheStrategy.SEMI_STATIC,
    priority: 'high'
  },

  // Dynamic: Changes frequently (e.g., employees, positions by department)
  DYNAMIC: {
    resources: ['employees', 'positions_by_department', 'grant_items'],
    strategy: CacheStrategy.DYNAMIC,
    priority: 'medium'
  },

  // Real-time: Always fetch fresh (e.g., allocation calculations)
  REALTIME: {
    resources: ['allocation_calculation', 'salary_calculation'],
    strategy: CacheStrategy.REALTIME,
    priority: 'low'
  }
};

/**
 * Get category for a resource
 */
function getResourceCategory(resource) {
  for (const [category, config] of Object.entries(DataCategory)) {
    if (config.resources.includes(resource)) {
      return { category, ...config };
    }
  }
  // Default to dynamic
  return { category: 'DYNAMIC', ...DataCategory.DYNAMIC };
}

/**
 * Main composable for dropdown data management
 */
export function useDropdownData() {
  const sharedStore = useSharedDataStore();
  const lookupStore = useLookupStore();

  // Loading states
  const loadingStates = ref({
    critical: false,
    high: false,
    medium: false,
    low: false
  });

  // Data ready flags
  const dataReady = ref({
    critical: false,
    high: false,
    medium: false,
    all: false
  });

  // Prefetch queue
  const prefetchQueue = ref([]);
  const prefetchAbortController = ref(null);

  /**
   * Load data with appropriate caching strategy
   */
  async function loadData(resource, params = {}, options = {}) {
    const { forceRefresh = false, priority = 'medium' } = options;
    const categoryInfo = getResourceCategory(resource);

    performanceMonitor.start(`load-${resource}`);

    try {
      // Set loading state
      loadingStates.value[priority] = true;

      let result;

      // Use shared store methods with caching
      switch (resource) {
        case 'departments':
          result = await sharedStore.fetchDepartments(forceRefresh);
          break;

        case 'positions_by_department':
          result = await sharedStore.fetchPositions(forceRefresh, params);
          break;

        case 'employees':
          result = await sharedStore.fetchEmployees(forceRefresh, params);
          break;

        case 'subsidiaries':
          result = await lookupStore.fetchLookupsByType('organization', forceRefresh);
          break;

        case 'grants':
          result = await sharedStore.fetchGrants(forceRefresh);
          break;

        case 'work_locations':
          result = await sharedStore.fetchWorkLocations(forceRefresh);
          break;

        default:
          console.warn(`[useDropdownData] Unknown resource: ${resource}`);
          result = null;
      }

      performanceMonitor.end(`load-${resource}`);

      return result;
    } catch (error) {
      console.error(`[useDropdownData] Error loading ${resource}:`, error);
      throw error;
    } finally {
      loadingStates.value[priority] = false;
    }
  }

  /**
   * Progressive data loading: Critical -> High -> Medium -> Low
   */
  async function loadProgressively(dataNeeds = {}) {
    const {
      critical = [],
      high = [],
      medium = [],
      low = []
    } = dataNeeds;

    performanceMonitor.start('progressive-load-total');

    try {
      // Phase 1: Critical data (blocking)
      if (critical.length > 0) {
        performanceMonitor.start('progressive-load-critical');
        console.log('[useDropdownData] Loading critical data...', critical);

        await Promise.all(
          critical.map(({ resource, params }) =>
            loadData(resource, params, { priority: 'critical' })
          )
        );

        dataReady.value.critical = true;
        performanceMonitor.end('progressive-load-critical');
        console.log('[useDropdownData] ✅ Critical data loaded');
      }

      // Phase 2: High priority data (blocking)
      if (high.length > 0) {
        performanceMonitor.start('progressive-load-high');
        console.log('[useDropdownData] Loading high priority data...', high);

        await Promise.all(
          high.map(({ resource, params }) =>
            loadData(resource, params, { priority: 'high' })
          )
        );

        dataReady.value.high = true;
        performanceMonitor.end('progressive-load-high');
        console.log('[useDropdownData] ✅ High priority data loaded');
      }

      // Phase 3: Medium priority data (background)
      if (medium.length > 0) {
        // Use requestIdleCallback for non-blocking load
        scheduleIdleTask(() => {
          performanceMonitor.start('progressive-load-medium');
          console.log('[useDropdownData] Loading medium priority data...', medium);

          Promise.all(
            medium.map(({ resource, params }) =>
              loadData(resource, params, { priority: 'medium' })
            )
          ).then(() => {
            dataReady.value.medium = true;
            performanceMonitor.end('progressive-load-medium');
            console.log('[useDropdownData] ✅ Medium priority data loaded');
          });
        });
      }

      // Phase 4: Low priority data (deferred background)
      if (low.length > 0) {
        scheduleIdleTask(() => {
          console.log('[useDropdownData] Loading low priority data...', low);

          Promise.all(
            low.map(({ resource, params }) =>
              loadData(resource, params, { priority: 'low' })
            )
          ).then(() => {
            console.log('[useDropdownData] ✅ Low priority data loaded');
          });
        }, { timeout: 5000 });
      }

      dataReady.value.all = true;
      performanceMonitor.end('progressive-load-total');

    } catch (error) {
      console.error('[useDropdownData] Progressive loading error:', error);
      throw error;
    }
  }

  /**
   * Intelligent prefetching based on user actions
   */
  function prefetchNextLikelyData(trigger, context = {}) {
    console.log(`[useDropdownData] Prefetch triggered: ${trigger}`, context);

    switch (trigger) {
      case 'employee_selected':
        // When employee is selected, likely to need positions and grants
        addToPrefetchQueue([
          { resource: 'grants', params: {} },
          { resource: 'work_locations', params: {} }
        ]);
        break;

      case 'department_selected':
        // When department is selected, prefetch positions for that department
        if (context.departmentId) {
          addToPrefetchQueue([
            { resource: 'positions_by_department', params: { department_id: context.departmentId } }
          ]);
        }
        break;

      case 'grant_selected':
        // When grant is selected, prefetch grant items
        if (context.grantId) {
          addToPrefetchQueue([
            { resource: 'grant_items', params: { grant_id: context.grantId } }
          ]);
        }
        break;

      case 'modal_hover':
        // When hovering over "Add Employment" button, preload all modal data
        addToPrefetchQueue([
          { resource: 'departments', params: {} },
          { resource: 'grants', params: {} },
          { resource: 'subsidiaries', params: {} }
        ]);
        break;

      case 'modal_opening':
        // When modal is about to open, prioritize critical data
        addToPrefetchQueue([
          { resource: 'departments', params: {}, priority: 'high' }
        ]);
        break;
    }

    // Process prefetch queue
    processPrefetchQueue();
  }

  /**
   * Add items to prefetch queue
   */
  function addToPrefetchQueue(items) {
    prefetchQueue.value.push(...items);
  }

  /**
   * Process prefetch queue using idle callback
   */
  function processPrefetchQueue() {
    if (prefetchQueue.value.length === 0) return;

    scheduleIdleTask(async () => {
      // Cancel any existing prefetch
      if (prefetchAbortController.value) {
        prefetchAbortController.value.abort();
      }

      prefetchAbortController.value = new AbortController();
      const items = [...prefetchQueue.value];
      prefetchQueue.value = [];

      console.log('[useDropdownData] Processing prefetch queue:', items.length, 'items');

      for (const item of items) {
        try {
          // Check if already aborted
          if (prefetchAbortController.value.signal.aborted) {
            break;
          }

          await loadData(item.resource, item.params, {
            priority: item.priority || 'low'
          });
        } catch (error) {
          // Silent fail for prefetch
          console.warn(`[useDropdownData] Prefetch failed for ${item.resource}:`, error);
        }
      }

      console.log('[useDropdownData] ✅ Prefetch queue processed');
    });
  }

  /**
   * Smart position caching by department
   */
  const positionCache = new Map();
  const positionCacheTTL = 30 * 60 * 1000; // 30 minutes

  async function getPositionsByDepartment(departmentId, forceRefresh = false) {
    const cacheKey = `dept_${departmentId}`;
    const now = Date.now();

    // Check cache
    if (!forceRefresh && positionCache.has(cacheKey)) {
      const cached = positionCache.get(cacheKey);
      if (now - cached.timestamp < positionCacheTTL) {
        console.log(`[useDropdownData] Positions cache HIT for department ${departmentId}`);
        return cached.data;
      }
    }

    // Fetch fresh data
    console.log(`[useDropdownData] Fetching positions for department ${departmentId}`);
    const positions = await loadData('positions_by_department', { department_id: departmentId });

    // Update cache
    positionCache.set(cacheKey, {
      data: positions,
      timestamp: now
    });

    return positions;
  }

  /**
   * Invalidate position cache for specific department
   */
  function invalidatePositionCache(departmentId = null) {
    if (departmentId) {
      const cacheKey = `dept_${departmentId}`;
      positionCache.delete(cacheKey);
      console.log(`[useDropdownData] Position cache invalidated for department ${departmentId}`);
    } else {
      positionCache.clear();
      console.log(`[useDropdownData] All position caches invalidated`);
    }
  }

  /**
   * Schedule task using requestIdleCallback or setTimeout fallback
   */
  function scheduleIdleTask(callback, options = {}) {
    const { timeout = 3000 } = options;

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(callback, { timeout });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(callback, 0);
    }
  }

  /**
   * Get all loading states
   */
  const isLoading = computed(() => {
    return Object.values(loadingStates.value).some(state => state === true);
  });

  /**
   * Get critical data ready state
   */
  const isCriticalDataReady = computed(() => dataReady.value.critical);

  /**
   * Cleanup on unmount
   */
  onUnmounted(() => {
    // Cancel any pending prefetch
    if (prefetchAbortController.value) {
      prefetchAbortController.value.abort();
    }

    // Clear position cache
    positionCache.clear();
  });

  return {
    // Data loading
    loadData,
    loadProgressively,

    // Prefetching
    prefetchNextLikelyData,

    // Position caching
    getPositionsByDepartment,
    invalidatePositionCache,

    // States
    loadingStates,
    dataReady,
    isLoading,
    isCriticalDataReady,

    // Utilities
    scheduleIdleTask,

    // Cache management
    invalidateCache: (resource, params) => cacheManager.invalidate(resource, params),
    clearAllCache: () => cacheManager.clear(),
    getCacheMetrics: () => cacheManager.getMetrics()
  };
}

/**
 * Hook for employment modal specific data needs
 */
export function useEmploymentModalData() {
  const dropdown = useDropdownData();

  /**
   * Load all employment modal data progressively
   */
  async function loadEmploymentModalData() {
    return dropdown.loadProgressively({
      // Critical: User sees the form immediately
      critical: [
        { resource: 'departments', params: {} }
      ],

      // High: Needed soon for form completion
      high: [
        { resource: 'subsidiaries', params: {} },
        { resource: 'work_locations', params: {} }
      ],

      // Medium: Background loading
      medium: [
        { resource: 'grants', params: {} }
      ],

      // Low: Deferred loading
      low: [
        { resource: 'employees', params: { status: 'active', per_page: 1000 } }
      ]
    });
  }

  /**
   * Prefetch when hovering over "Add Employment" button
   */
  function prefetchOnHover() {
    dropdown.prefetchNextLikelyData('modal_hover');
  }

  /**
   * Prefetch when modal is opening
   */
  function prefetchOnOpening() {
    dropdown.prefetchNextLikelyData('modal_opening');
  }

  return {
    ...dropdown,
    loadEmploymentModalData,
    prefetchOnHover,
    prefetchOnOpening
  };
}

export default useDropdownData;

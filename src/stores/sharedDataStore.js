// src/stores/sharedDataStore.js
import { defineStore } from 'pinia';
import { employeeService } from '@/services/employee.service';
import { departmentService } from '@/services/department.service';
import { positionService } from '@/services/position.service';
import { workLocationService } from '@/services/worklocation.service';
import { employeeFundingAllocationService } from '@/services/employee-funding-allocation.service';
import { useLookupStore } from '@/stores/lookupStore';
import { cacheManager, performanceMonitor } from '@/utils/cache';

/**
 * Shared data store for common dropdown data used across multiple components
 * Enhanced with:
 * - Request deduplication
 * - Stale-While-Revalidate (SWR) pattern
 * - Smart position caching by department
 * - Performance monitoring
 *
 * This helps avoid redundant API calls and improves performance
 */
export const useSharedDataStore = defineStore('sharedData', {
    state: () => ({
        // Employee data
        employees: [],
        employeeTreeData: [],
        employeesLoaded: false,
        employeesLoading: false,

        // Separate departments and positions
        departments: [],
        departmentsLoaded: false,
        departmentsLoading: false,
        positions: [],
        positionsLoaded: false,
        positionsLoading: false,

        // Work locations
        workLocations: [],
        workLocationsLoaded: false,
        workLocationsLoading: false,

        // Grant structure for funding allocations
        grantStructure: [],
        grantOptions: [],
        grantPositions: {},
        grantStructureLoaded: false,
        grantStructureLoading: false,

        // Cache timestamps for invalidation (24 hours)
        cacheTimestamps: {
            employees: null,
            departments: null,
            positions: null,
            workLocations: null,
            grantStructure: null
        },

        // Smart position caching by department
        positionsByDepartment: new Map(),
        positionAbortControllers: new Map(),

        // CRITICAL: Promise tracking to prevent polling loop memory leaks
        // Stores active loading promises to enable proper request deduplication
        loadingPromises: {
            employees: null,
            departments: null,
            positions: null,
            workLocations: null,
            grantStructure: null
        },

        // CRITICAL: Prefetch callback tracking to prevent orphaned callbacks
        // Stores requestIdleCallback/setTimeout IDs for cleanup on logout/reset
        pendingPrefetches: [],

        // Loading and error states
        error: null
    }),

    getters: {
        // Employee getters
        getEmployeeTreeData: (state) => state.employeeTreeData,
        getEmployees: (state) => state.employees,
        isEmployeesLoaded: (state) => state.employeesLoaded && !state.isEmployeesExpired,

        // Getters for departments and positions
        getDepartments: (state) => state.departments,
        isDepartmentsLoaded: (state) => state.departmentsLoaded && !state.isDepartmentsExpired,
        getPositions: (state) => state.positions,
        isPositionsLoaded: (state) => state.positionsLoaded && !state.isPositionsExpired,

        // Work location getters
        getWorkLocations: (state) => state.workLocations,
        isWorkLocationsLoaded: (state) => state.workLocationsLoaded && !state.isWorkLocationsExpired,

        // Grant structure getters
        getGrantOptions: (state) => state.grantOptions,
        getGrantPositions: (state) => state.grantPositions,
        isGrantStructureLoaded: (state) => state.grantStructureLoaded && !state.isGrantStructureExpired,

        // Cache expiration getters (24 hours)
        isEmployeesExpired: (state) => {
            if (!state.cacheTimestamps.employees) return true;
            const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - state.cacheTimestamps.employees > expirationTime;
        },

        isDepartmentsExpired: (state) => {
            if (!state.cacheTimestamps.departments) return true;
            const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - state.cacheTimestamps.departments > expirationTime;
        },

        isPositionsExpired: (state) => {
            if (!state.cacheTimestamps.positions) return true;
            const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - state.cacheTimestamps.positions > expirationTime;
        },

        isWorkLocationsExpired: (state) => {
            if (!state.cacheTimestamps.workLocations) return true;
            const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - state.cacheTimestamps.workLocations > expirationTime;
        },

        isGrantStructureExpired: (state) => {
            if (!state.cacheTimestamps.grantStructure) return true;
            const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - state.cacheTimestamps.grantStructure > expirationTime;
        },

        // Combined loading state
        isAnyLoading: (state) => {
            return state.employeesLoading ||
                state.departmentsLoading ||
                state.positionsLoading ||
                state.workLocationsLoading ||
                state.grantStructureLoading;
        }
    },

    actions: {
        /**
         * Fetch employees tree data for dropdowns
         * FIXED: No more polling loop - uses promise deduplication
         */
        async fetchEmployees(force = false) {
            // Skip if already loaded and not expired, unless forced
            if (this.isEmployeesLoaded && !force) {
                console.log('✅ Employees already loaded from cache');
                return this.employeeTreeData;
            }

            // CRITICAL FIX: Return existing promise if already loading
            // This prevents multiple simultaneous calls from creating polling loops
            if (this.loadingPromises.employees) {
                console.log('⏳ Employees already loading, returning existing promise');
                return this.loadingPromises.employees;
            }

            this.employeesLoading = true;
            this.error = null;

            // Store the promise for deduplication
            this.loadingPromises.employees = (async () => {
                try {
                    console.log('🔄 Fetching employees tree data...');
                    const response = await employeeService.treeSearch();

                    this.employeeTreeData = response.data || [];
                    this.employees = this.flattenEmployeeTree(response.data || []);
                    this.employeesLoaded = true;
                    this.cacheTimestamps.employees = Date.now();

                    console.log(`✅ Loaded ${this.employeeTreeData.length} employee tree nodes`);
                    return this.employeeTreeData;
                } catch (error) {
                    console.error('❌ Error fetching employees:', error);
                    this.error = `Failed to load employees: ${error.message}`;
                    this.employeeTreeData = [];
                    this.employees = [];
                    throw error;
                } finally {
                    this.employeesLoading = false;
                    this.loadingPromises.employees = null; // Clear promise when done
                }
            })();

            return this.loadingPromises.employees;
        },


        /**
         * Fetch departments
         * FIXED: No more polling loop - uses promise deduplication
         */
        async fetchDepartments(force = false, params = {}) {
            if (this.isDepartmentsLoaded && !force) {
                console.log('✅ Departments already loaded from cache');
                return this.departments;
            }

            // CRITICAL FIX: Return existing promise if already loading
            if (this.loadingPromises.departments) {
                console.log('⏳ Departments already loading, returning existing promise');
                return this.loadingPromises.departments;
            }

            this.departmentsLoading = true;
            this.error = null;

            // Store the promise for deduplication
            this.loadingPromises.departments = (async () => {
                try {
                    // Prefer options endpoint for dropdowns
                    console.log('🔍 Calling departmentService.getDepartmentOptions()...');
                    const response = await departmentService.getDepartmentOptions(params);
                    console.log('📦 Department response:', response);

                    // Handle the new API response format with success wrapper
                    let data;
                    if (response.success && response.data) {
                        data = response.data;
                    } else {
                        data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                    }
                    console.log('🔍 Processed department data:', data);
                    this.departments = data;
                    console.log('🏢 Departments stored:', this.departments);
                    this.departmentsLoaded = true;
                    this.cacheTimestamps.departments = Date.now();
                    return this.departments;
                } catch (error) {
                    console.error('❌ Error fetching departments:', error);
                    this.error = `Failed to load departments: ${error.message}`;
                    this.departments = [];
                    throw error;
                } finally {
                    this.departmentsLoading = false;
                    this.loadingPromises.departments = null; // Clear promise when done
                }
            })();

            return this.loadingPromises.departments;
        },

        /**
         * Fetch positions (optionally by department)
         * FIXED: No more polling loop - uses promise deduplication
         */
        async fetchPositions(force = false, params = {}) {
            if (this.isPositionsLoaded && !force) {
                console.log('✅ Positions already loaded from cache');
                return this.positions;
            }

            // CRITICAL FIX: Return existing promise if already loading
            if (this.loadingPromises.positions) {
                console.log('⏳ Positions already loading, returning existing promise');
                return this.loadingPromises.positions;
            }

            this.positionsLoading = true;
            this.error = null;

            // Store the promise for deduplication
            this.loadingPromises.positions = (async () => {
                try {
                    // Prefer options endpoint for dropdowns
                    console.log('🔍 Calling positionService.getPositionOptions() with params:', params);
                    const response = await positionService.getPositionOptions(params);
                    console.log('📦 Position response:', response);
                    const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                    console.log('🔍 Processed position data:', data);
                    this.positions = data;
                    console.log('💼 Positions stored:', this.positions);
                    this.positionsLoaded = true;
                    this.cacheTimestamps.positions = Date.now();
                    return this.positions;
                } catch (error) {
                    console.error('❌ Error fetching positions:', error);
                    this.error = `Failed to load positions: ${error.message}`;
                    this.positions = [];
                    throw error;
                } finally {
                    this.positionsLoading = false;
                    this.loadingPromises.positions = null; // Clear promise when done
                }
            })();

            return this.loadingPromises.positions;
        },

        /**
         * Fetch work locations
         * FIXED: No more polling loop - uses promise deduplication
         */
        async fetchWorkLocations(force = false) {
            // Skip if already loaded and not expired, unless forced
            if (this.isWorkLocationsLoaded && !force) {
                console.log('✅ Work locations already loaded from cache');
                return this.workLocations;
            }

            // CRITICAL FIX: Return existing promise if already loading
            if (this.loadingPromises.workLocations) {
                console.log('⏳ Work locations already loading, returning existing promise');
                return this.loadingPromises.workLocations;
            }

            this.workLocationsLoading = true;
            this.error = null;

            // Store the promise for deduplication
            this.loadingPromises.workLocations = (async () => {
                try {
                    console.log('🔄 Fetching work locations...');
                    const response = await workLocationService.getAllWorkLocations();

                    this.workLocations = response.data || [];
                    this.workLocationsLoaded = true;
                    this.cacheTimestamps.workLocations = Date.now();

                    console.log(`✅ Loaded ${this.workLocations.length} work locations`);
                    return this.workLocations;
                } catch (error) {
                    console.error('❌ Error fetching work locations:', error);
                    this.error = `Failed to load work locations: ${error.message}`;
                    this.workLocations = [];
                    throw error;
                } finally {
                    this.workLocationsLoading = false;
                    this.loadingPromises.workLocations = null; // Clear promise when done
                }
            })();

            return this.loadingPromises.workLocations;
        },

        /**
         * Fetch grant structure for funding allocations
         * FIXED: No more polling loop - uses promise deduplication
         */
        async fetchGrantStructure(force = false) {
            // Skip if already loaded and not expired, unless forced
            if (this.isGrantStructureLoaded && !force) {
                return { grantOptions: this.grantOptions, grantPositions: this.grantPositions };
            }

            // CRITICAL FIX: Return existing promise if already loading
            if (this.loadingPromises.grantStructure) {
                console.log('⏳ Grant structure already loading, returning existing promise');
                return this.loadingPromises.grantStructure;
            }

            this.grantStructureLoading = true;
            this.error = null;

            // Store the promise for deduplication
            this.loadingPromises.grantStructure = (async () => {
                try {
                console.log('🔍 Calling employeeFundingAllocationService.getGrantStructure()...');
                const response = await employeeFundingAllocationService.getGrantStructure();
                console.log('📦 Grant structure response:', response);

                let grantData;
                console.log('🔍 Grant response format check:', {
                    hasSuccess: !!response?.success,
                    hasData: !!response?.data,
                    isArray: Array.isArray(response),
                    responseType: typeof response
                });

                if (response && response.success && response.data) {
                    grantData = response.data;
                    console.log('📋 Using response.data format');
                    console.log('🔍 Grant data structure:', grantData);

                    // Handle case where data might be an object containing an array
                    if (!Array.isArray(grantData) && grantData.grants) {
                        grantData = grantData.grants;
                        console.log('📋 Extracted grants array from data object');
                    } else if (!Array.isArray(grantData) && typeof grantData === 'object') {
                        // If it's an object, convert to array or find the array property
                        const arrayKeys = Object.keys(grantData).filter(key => Array.isArray(grantData[key]));
                        if (arrayKeys.length > 0) {
                            grantData = grantData[arrayKeys[0]];
                            console.log(`📋 Extracted array from property: ${arrayKeys[0]}`);
                        } else {
                            console.error('❌ No array found in grant data object:', grantData);
                            throw new Error('Grant data object does not contain an array');
                        }
                    }
                } else if (response && Array.isArray(response)) {
                    grantData = response;
                    console.log('📋 Using direct array format');
                } else {
                    console.error('❌ Invalid response format:', response);
                    throw new Error('Invalid grant structure response format');
                }

                if (!Array.isArray(grantData)) {
                    console.error('❌ Final grant data is not an array:', grantData);
                    throw new Error('Grant data is not an array');
                }

                // Build flat grantOptions for select dropdown
                this.grantOptions = grantData.map(grant => ({
                    id: grant.id,
                    name: grant.name,
                    code: grant.code
                }));
                console.log('🎯 Grant options built:', this.grantOptions);

                // Build mapping for dependent dropdowns with position_slots
                const positionsMap = {};
                grantData.forEach(grant => {
                    if (grant.grant_items && Array.isArray(grant.grant_items)) {
                        positionsMap[grant.id] = grant.grant_items.map(item => {
                            const positionSlots = (item.position_slots || []).map(slot => ({
                                id: slot.id,
                                slot_number: slot.slot_number
                            }));

                            return {
                                id: item.id,
                                name: item.name,
                                grant_salary: item.grant_salary,
                                grant_benefit: item.grant_benefit,
                                grant_level_of_effort: item.grant_level_of_effort,
                                budgetline_code: item.budgetline_code,
                                grant_position_number: item.grant_position_number,
                                position_slots: positionSlots
                            };
                        });
                    } else {
                        positionsMap[grant.id] = [];
                    }
                });

                this.grantPositions = positionsMap;
                this.grantStructure = grantData;
                this.grantStructureLoaded = true;
                this.cacheTimestamps.grantStructure = Date.now();

                console.log(`✅ Loaded ${this.grantOptions.length} grants with position structure`);
                return { grantOptions: this.grantOptions, grantPositions: this.grantPositions };
            } catch (error) {
                console.error('❌ Error fetching grant structure:', error);
                this.error = `Failed to load grant structure: ${error.message}`;
                this.grantOptions = [];
                this.grantPositions = {};
                this.grantStructure = [];
                throw error;
            } finally {
                this.grantStructureLoading = false;
                this.loadingPromises.grantStructure = null; // Clear promise when done
            }
            })();

            return this.loadingPromises.grantStructure;
        },

        /**
         * Load all essential dropdown data in parallel
         */
        async loadAllDropdownData(options = {}) {
            const {
                includeEmployees = true,
                includeDepartments = true,
                includePositions = true,
                includeWorkLocations = true,
                includeGrantStructure = false, // Only load when needed for funding allocations
                force = false
            } = options;

            console.log('🚀 Loading all dropdown data...');
            const startTime = Date.now();

            const promises = [];

            if (includeEmployees) {
                promises.push(this.fetchEmployees(force));
            }
            if (includeDepartments) {
                promises.push(this.fetchDepartments(force));
            }
            if (includePositions) {
                promises.push(this.fetchPositions(force));
            }
            if (includeWorkLocations) {
                promises.push(this.fetchWorkLocations(force));
            }
            if (includeGrantStructure) {
                promises.push(this.fetchGrantStructure(force));
            }

            try {
                await Promise.all(promises);
                const loadTime = Date.now() - startTime;
                console.log(`✅ All dropdown data loaded in ${loadTime}ms`);
                return true;
            } catch (error) {
                console.error('❌ Error loading dropdown data:', error);
                throw error;
            }
        },

        /**
         * Helper method to flatten employee tree for easier searching
         */
        flattenEmployeeTree(treeData) {
            const flattened = [];

            const flatten = (nodes) => {
                for (const node of nodes) {
                    if (node.value && node.title) {
                        flattened.push({
                            id: node.value,
                            name: node.title,
                            staff_id: node.staff_id,
                            organization: node.organization,
                            status: node.status
                        });
                    }
                    if (node.children && node.children.length > 0) {
                        flatten(node.children);
                    }
                }
            };

            flatten(treeData);
            return flattened;
        },

        /**
         * Find employee in tree by ID
         */
        findEmployeeInTree(employeeId) {
            const findInTree = (nodes, id) => {
                for (const node of nodes) {
                    if (node.value === id) {
                        return node;
                    }
                    if (node.children && node.children.length > 0) {
                        const found = findInTree(node.children, id);
                        if (found) return found;
                    }
                }
                return null;
            };

            return findInTree(this.employeeTreeData, employeeId);
        },

        /**
         * Get employee organization from tree structure
         */
        getEmployeeSubsidiary(employeeId) {
            for (const organizationNode of this.employeeTreeData) {
                if (organizationNode.children && organizationNode.children.length > 0) {
                    const employee = organizationNode.children.find(emp => emp.value === employeeId);
                    if (employee) {
                        return organizationNode.title; // Parent node title is the organization name
                    }
                }
            }
            return null;
        },

        /**
         * Get employee organization from tree structure (alias for getEmployeeSubsidiary)
         */
        getEmployeeOrganization(employeeId) {
            return this.getEmployeeSubsidiary(employeeId);
        },

        /**
         * Invalidate cache for specific data type
         */
        invalidateCache(dataType) {
            if (dataType === 'employees') {
                this.employeesLoaded = false;
                this.cacheTimestamps.employees = null;
                this.employees = [];
                this.employeeTreeData = [];
            } else if (dataType === 'departments') {
                this.departmentsLoaded = false;
                this.cacheTimestamps.departments = null;
                this.departments = [];
            } else if (dataType === 'positions') {
                this.positionsLoaded = false;
                this.cacheTimestamps.positions = null;
                this.positions = [];
            } else if (dataType === 'workLocations') {
                this.workLocationsLoaded = false;
                this.cacheTimestamps.workLocations = null;
                this.workLocations = [];
            } else if (dataType === 'grantStructure') {
                this.grantStructureLoaded = false;
                this.cacheTimestamps.grantStructure = null;
                this.grantStructure = [];
                this.grantOptions = [];
                this.grantPositions = {};
            }
        },

        /**
         * Invalidate all cache
         */
        invalidateAllCache() {
            this.invalidateCache('employees');
            this.invalidateCache('departments');
            this.invalidateCache('positions');
            this.invalidateCache('workLocations');
            this.invalidateCache('grantStructure');
        },

        /**
         * Reset store state
         */
        resetState() {
            this.employees = [];
            this.employeeTreeData = [];
            this.employeesLoaded = false;
            this.employeesLoading = false;

            this.departments = [];
            this.departmentsLoaded = false;
            this.departmentsLoading = false;

            this.positions = [];
            this.positionsLoaded = false;
            this.positionsLoading = false;

            this.workLocations = [];
            this.workLocationsLoaded = false;
            this.workLocationsLoading = false;

            this.grantStructure = [];
            this.grantOptions = [];
            this.grantPositions = {};
            this.grantStructureLoaded = false;
            this.grantStructureLoading = false;

            this.cacheTimestamps = {
                employees: null,
                departments: null,
                positions: null,
                workLocations: null,
                grantStructure: null
            };

            // Clear position cache
            this.positionsByDepartment.clear();
            this.positionAbortControllers.forEach(controller => controller.abort());
            this.positionAbortControllers.clear();

            // CRITICAL: Clear all loading promises to prevent memory leaks
            this.loadingPromises = {
                employees: null,
                departments: null,
                positions: null,
                workLocations: null,
                grantStructure: null
            };

            // CRITICAL: Cancel all pending prefetch callbacks to prevent orphaned callbacks
            this.pendingPrefetches.forEach(({ id, type }) => {
                try {
                    if (type === 'idle' && typeof cancelIdleCallback !== 'undefined') {
                        cancelIdleCallback(id);
                    } else {
                        clearTimeout(id);
                    }
                } catch (error) {
                    console.warn('[sharedDataStore] Failed to cancel prefetch callback:', error);
                }
            });
            this.pendingPrefetches = [];
            console.log('[sharedDataStore] Cleared all pending prefetch callbacks');

            this.error = null;
        },

        // ============================================
        // OPTIMIZATION FEATURES (v2.0)
        // ============================================

        /**
         * Fetch departments with SWR pattern
         * Returns cached data immediately if stale, revalidates in background
         */
        async fetchDepartmentsWithSWR(force = false) {
            performanceMonitor.start('fetchDepartments-SWR');

            const result = await cacheManager.fetchWithSWR(
                'departments',
                {},
                async (signal) => {
                    const response = await departmentService.getDepartmentOptions({}, signal);
                    let data;
                    if (response.success && response.data) {
                        data = response.data;
                    } else {
                        data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                    }
                    return data;
                },
                {
                    maxAge: 30 * 60 * 1000, // 30 minutes for semi-static data
                    forceRefresh: force
                }
            );

            // Update store state
            if (result.data) {
                this.departments = result.data;
                this.departmentsLoaded = true;
                this.cacheTimestamps.departments = Date.now();
            }

            performanceMonitor.end('fetchDepartments-SWR');

            return result.data;
        },

        /**
         * Fetch grants with SWR pattern
         */
        async fetchGrants(force = false) {
            return this.fetchGrantStructure(force);
        },

        /**
         * Smart position caching by department
         * Implements:
         * - Department-specific caching
         * - Request cancellation when department changes
         * - 30-minute TTL
         */
        async fetchPositionsByDepartment(departmentId, force = false) {
            if (!departmentId) {
                console.warn('[sharedDataStore] fetchPositionsByDepartment: No department ID provided');
                return [];
            }

            const cacheKey = `dept_${departmentId}`;
            const now = Date.now();
            const cacheTTL = 30 * 60 * 1000; // 30 minutes

            performanceMonitor.start(`fetchPositions-dept-${departmentId}`);

            // Abort any existing request for this department
            if (this.positionAbortControllers.has(cacheKey)) {
                console.log(`[sharedDataStore] Aborting previous request for department ${departmentId}`);
                this.positionAbortControllers.get(cacheKey).abort();
                this.positionAbortControllers.delete(cacheKey);
            }

            // Check cache
            if (!force && this.positionsByDepartment.has(cacheKey)) {
                const cached = this.positionsByDepartment.get(cacheKey);
                if (now - cached.timestamp < cacheTTL) {
                    console.log(`[sharedDataStore] ✅ Position cache HIT for department ${departmentId}`);
                    performanceMonitor.end(`fetchPositions-dept-${departmentId}`);
                    return cached.data;
                } else {
                    console.log(`[sharedDataStore] Position cache EXPIRED for department ${departmentId}`);
                }
            }

            // Fetch with abort support
            const controller = new AbortController();
            this.positionAbortControllers.set(cacheKey, controller);

            try {
                console.log(`[sharedDataStore] Fetching positions for department ${departmentId}...`);

                const response = await positionService.getPositionOptions(
                    { department_id: departmentId },
                    controller.signal
                );

                const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);

                // Update cache
                this.positionsByDepartment.set(cacheKey, {
                    data,
                    timestamp: now
                });

                console.log(`[sharedDataStore] ✅ Cached ${data.length} positions for department ${departmentId}`);
                performanceMonitor.end(`fetchPositions-dept-${departmentId}`);

                return data;
            } catch (error) {
                // Don't throw on abort
                if (error.name === 'AbortError' || error.name === 'CanceledError') {
                    console.log(`[sharedDataStore] Request aborted for department ${departmentId}`);
                    return [];
                }
                console.error(`[sharedDataStore] Error fetching positions for department ${departmentId}:`, error);
                throw error;
            } finally {
                this.positionAbortControllers.delete(cacheKey);
            }
        },

        /**
         * Invalidate position cache for specific department
         */
        invalidatePositionCache(departmentId = null) {
            if (departmentId) {
                const cacheKey = `dept_${departmentId}`;
                this.positionsByDepartment.delete(cacheKey);
                console.log(`[sharedDataStore] Position cache invalidated for department ${departmentId}`);
            } else {
                this.positionsByDepartment.clear();
                console.log(`[sharedDataStore] All position caches invalidated`);
            }
        },

        /**
         * Prefetch data for likely next user action
         * Uses low-priority requests that don't block UI
         * FIXED: Now tracks and cancels callbacks to prevent memory leaks
         */
        async prefetchLikelyData(context = {}) {
            const { departmentId, grantId, employeeId } = context;

            // CRITICAL FIX: Track callback IDs for cleanup
            const scheduleIdlePrefetch = (callback) => {
                let callbackId;
                const wrappedCallback = (deadline) => {
                    // Remove from tracking when executed
                    const index = this.pendingPrefetches.findIndex(p => p.id === callbackId);
                    if (index > -1) {
                        this.pendingPrefetches.splice(index, 1);
                    }
                    callback(deadline);
                };

                if (typeof requestIdleCallback !== 'undefined') {
                    callbackId = requestIdleCallback(wrappedCallback, { timeout: 3000 });
                    this.pendingPrefetches.push({ id: callbackId, type: 'idle' });
                } else {
                    callbackId = setTimeout(wrappedCallback, 0);
                    this.pendingPrefetches.push({ id: callbackId, type: 'timeout' });
                }

                return callbackId;
            };

            // Prefetch positions if department is known
            if (departmentId) {
                scheduleIdlePrefetch(() => {
                    console.log(`[sharedDataStore] Prefetching positions for department ${departmentId}...`);
                    this.fetchPositionsByDepartment(departmentId).catch(err => {
                        console.warn('[sharedDataStore] Prefetch failed (positions):', err);
                    });
                });
            }

            // Prefetch grant structure if grants are likely needed
            if (grantId || context.needsGrants) {
                scheduleIdlePrefetch(() => {
                    console.log('[sharedDataStore] Prefetching grant structure...');
                    this.fetchGrantStructure().catch(err => {
                        console.warn('[sharedDataStore] Prefetch failed (grants):', err);
                    });
                });
            }

            // Prefetch work locations
            if (context.needsWorkLocations) {
                scheduleIdlePrefetch(() => {
                    console.log('[sharedDataStore] Prefetching work locations...');
                    this.fetchWorkLocations().catch(err => {
                        console.warn('[sharedDataStore] Prefetch failed (work locations):', err);
                    });
                });
            }
        },

        /**
         * Get cache performance metrics
         */
        getCacheMetrics() {
            return cacheManager.getMetrics();
        },

        /**
         * Log performance statistics
         */
        logPerformanceStats() {
            console.log('=== Shared Data Store Performance ===');
            console.table({
                'Departments Loaded': this.departmentsLoaded,
                'Positions Loaded': this.positionsLoaded,
                'Employees Loaded': this.employeesLoaded,
                'Grants Loaded': this.grantStructureLoaded,
                'Work Locations Loaded': this.workLocationsLoaded,
                'Position Cache Size': this.positionsByDepartment.size
            });

            console.log('\n=== Cache Manager Metrics ===');
            performanceMonitor.logCacheStats();
        }
    }
});

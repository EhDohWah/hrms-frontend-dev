// src/stores/sharedDataStore.js
import { defineStore } from 'pinia';
import { employeeService } from '@/services/employee.service';
import { departmentService } from '@/services/department.service';
import { positionService } from '@/services/position.service';
import { workLocationService } from '@/services/worklocation.service';
import { employeeFundingAllocationService } from '@/services/employee-funding-allocation.service';
import { useLookupStore } from '@/stores/lookupStore';

/**
 * Shared data store for common dropdown data used across multiple components
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
         */
        async fetchEmployees(force = false) {
            // Skip if already loaded and not expired, unless forced
            if (this.isEmployeesLoaded && !force) {
                console.log('✅ Employees already loaded from cache');
                return this.employeeTreeData;
            }

            if (this.employeesLoading) {
                console.log('⏳ Employees already loading, waiting...');
                // Wait for current loading to complete
                while (this.employeesLoading) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return this.employeeTreeData;
            }

            this.employeesLoading = true;
            this.error = null;

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
            }
        },


        /**
         * Fetch departments
         */
        async fetchDepartments(force = false, params = {}) {
            if (this.isDepartmentsLoaded && !force) {
                console.log('✅ Departments already loaded from cache');
                return this.departments;
            }
            if (this.departmentsLoading) {
                while (this.departmentsLoading) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return this.departments;
            }
            this.departmentsLoading = true;
            this.error = null;
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
            }
        },

        /**
         * Fetch positions (optionally by department)
         */
        async fetchPositions(force = false, params = {}) {
            if (this.isPositionsLoaded && !force) {
                console.log('✅ Positions already loaded from cache');
                return this.positions;
            }
            if (this.positionsLoading) {
                while (this.positionsLoading) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return this.positions;
            }
            this.positionsLoading = true;
            this.error = null;
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
            }
        },

        /**
         * Fetch work locations
         */
        async fetchWorkLocations(force = false) {
            // Skip if already loaded and not expired, unless forced
            if (this.isWorkLocationsLoaded && !force) {
                console.log('✅ Work locations already loaded from cache');
                return this.workLocations;
            }

            if (this.workLocationsLoading) {
                console.log('⏳ Work locations already loading, waiting...');
                while (this.workLocationsLoading) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return this.workLocations;
            }

            this.workLocationsLoading = true;
            this.error = null;

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
            }
        },

        /**
         * Fetch grant structure for funding allocations
         */
        async fetchGrantStructure(force = false) {
            // Skip if already loaded and not expired, unless forced
            if (this.isGrantStructureLoaded && !force) {
                return { grantOptions: this.grantOptions, grantPositions: this.grantPositions };
            }

            if (this.grantStructureLoading) {
                while (this.grantStructureLoading) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return { grantOptions: this.grantOptions, grantPositions: this.grantPositions };
            }

            this.grantStructureLoading = true;
            this.error = null;

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
            }
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
                            subsidiary: node.subsidiary,
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
         * Get employee subsidiary from tree structure
         */
        getEmployeeSubsidiary(employeeId) {
            for (const subsidiaryNode of this.employeeTreeData) {
                if (subsidiaryNode.children && subsidiaryNode.children.length > 0) {
                    const employee = subsidiaryNode.children.find(emp => emp.value === employeeId);
                    if (employee) {
                        return subsidiaryNode.title; // Parent node title is the subsidiary name
                    }
                }
            }
            return null;
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

            this.error = null;
        }
    }
});

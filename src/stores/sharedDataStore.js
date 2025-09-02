// src/stores/sharedDataStore.js
import { defineStore } from 'pinia';
import { employeeService } from '@/services/employee.service';
import { departmentPositionService } from '@/services/department-position.service';
import { workLocationService } from '@/services/worklocation.service';
import { employeeGrantAllocationService } from '@/services/employee-grant-allocation.service';
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

        // Department positions
        departmentPositions: [],
        departmentPositionsLoaded: false,
        departmentPositionsLoading: false,

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
            departmentPositions: null,
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

        // Department position getters
        getDepartmentPositions: (state) => state.departmentPositions,
        isDepartmentPositionsLoaded: (state) => state.departmentPositionsLoaded && !state.isDepartmentPositionsExpired,

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

        isDepartmentPositionsExpired: (state) => {
            if (!state.cacheTimestamps.departmentPositions) return true;
            const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - state.cacheTimestamps.departmentPositions > expirationTime;
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
                state.departmentPositionsLoading ||
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
         * Fetch department positions
         */
        async fetchDepartmentPositions(force = false) {
            // Skip if already loaded and not expired, unless forced
            if (this.isDepartmentPositionsLoaded && !force) {
                console.log('✅ Department positions already loaded from cache');
                return this.departmentPositions;
            }

            if (this.departmentPositionsLoading) {
                console.log('⏳ Department positions already loading, waiting...');
                while (this.departmentPositionsLoading) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return this.departmentPositions;
            }

            this.departmentPositionsLoading = true;
            this.error = null;

            try {
                console.log('🔄 Fetching department positions...');
                const response = await departmentPositionService.getAllDepartmentPositions();

                this.departmentPositions = response.data || [];
                this.departmentPositionsLoaded = true;
                this.cacheTimestamps.departmentPositions = Date.now();

                console.log(`✅ Loaded ${this.departmentPositions.length} department positions`);
                return this.departmentPositions;
            } catch (error) {
                console.error('❌ Error fetching department positions:', error);
                this.error = `Failed to load department positions: ${error.message}`;
                this.departmentPositions = [];
                throw error;
            } finally {
                this.departmentPositionsLoading = false;
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
                console.log('✅ Grant structure already loaded from cache');
                return { grantOptions: this.grantOptions, grantPositions: this.grantPositions };
            }

            if (this.grantStructureLoading) {
                console.log('⏳ Grant structure already loading, waiting...');
                while (this.grantStructureLoading) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return { grantOptions: this.grantOptions, grantPositions: this.grantPositions };
            }

            this.grantStructureLoading = true;
            this.error = null;

            try {
                console.log('🔄 Fetching grant structure...');
                const response = await employeeGrantAllocationService.getGrantStructure();

                let grantData;
                if (response && response.success && response.data) {
                    grantData = response.data;
                } else if (response && Array.isArray(response)) {
                    grantData = response;
                } else {
                    throw new Error('Invalid grant structure response format');
                }

                if (!Array.isArray(grantData)) {
                    throw new Error('Grant data is not an array');
                }

                // Build flat grantOptions for select dropdown
                this.grantOptions = grantData.map(grant => ({
                    id: grant.id,
                    name: grant.name,
                    code: grant.code
                }));

                // Build mapping for dependent dropdowns with position_slots
                const positionsMap = {};
                grantData.forEach(grant => {
                    if (grant.grant_items && Array.isArray(grant.grant_items)) {
                        positionsMap[grant.id] = grant.grant_items.map(item => {
                            const positionSlots = (item.position_slots || []).map(slot => ({
                                id: slot.id,
                                slot_number: slot.slot_number,
                                budget_line: {
                                    id: slot.budget_line.id,
                                    name: slot.budget_line.name,
                                    description: slot.budget_line.description
                                }
                            }));

                            return {
                                id: item.id,
                                name: item.name,
                                grant_salary: item.grant_salary,
                                grant_benefit: item.grant_benefit,
                                grant_level_of_effort: item.grant_level_of_effort,
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
                includeDepartmentPositions = true,
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
            if (includeDepartmentPositions) {
                promises.push(this.fetchDepartmentPositions(force));
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
            } else if (dataType === 'departmentPositions') {
                this.departmentPositionsLoaded = false;
                this.cacheTimestamps.departmentPositions = null;
                this.departmentPositions = [];
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
            this.invalidateCache('departmentPositions');
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

            this.departmentPositions = [];
            this.departmentPositionsLoaded = false;
            this.departmentPositionsLoading = false;

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
                departmentPositions: null,
                workLocations: null,
                grantStructure: null
            };

            this.error = null;
        }
    }
});

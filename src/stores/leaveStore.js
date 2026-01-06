import { defineStore } from 'pinia';
import { leaveService } from '@/services/leave.service';

export const useLeaveStore = defineStore('leave', {
    state: () => ({
        // Leave Requests data
        leaveRequests: [],
        currentLeaveRequest: null,
        statistics: {
            totalRequests: 0,
            pendingRequests: 0,
            approvedRequests: 0,
            declinedRequests: 0,
            cancelledRequests: 0,
            thisMonth: 0,
            thisWeek: 0
        },

        // Leave Types data
        leaveTypes: [],
        currentLeaveType: null,

        // Leave Balances data
        leaveBalances: [],
        currentLeaveBalance: null,

        // Cache for leave balances by employee/leave type combination
        leaveBalanceCache: new Map(), // key: "employeeId-leaveTypeId-year", value: balance data

        // UI state
        loading: false,
        submitting: false,
        searchLoading: false,
        error: null,

        // Pagination state (following employees-list pattern)
        currentPage: 1,
        pageSize: 10,
        total: 0,

        // Filter and sorting state
        filteredInfo: {},
        sortedInfo: {},
        searchStaffId: '',
        dateRange: null,

        // Cache timestamp for leave types (24 hours)
        leaveTypesTimestamp: null,

        // Request deduplication - prevents multiple simultaneous identical API calls
        pendingLeaveTypesRequest: null
    }),

    getters: {
        /**
         * Get leave request by ID from cached data
         */
        getLeaveRequestById: (state) => (id) => {
            return state.leaveRequests.find(request => request.id === parseInt(id));
        },

        /**
         * Get leave type by ID
         */
        getLeaveTypeById: (state) => (id) => {
            return state.leaveTypes.find(type => type.id === parseInt(id));
        },

        /**
         * Get filtered leave requests (server-side filtering)
         */
        filteredLeaveRequests: (state) => {
            return state.leaveRequests;
        },

        /**
         * Check if leave types are loaded and not expired
         */
        hasLeaveTypes: (state) => {
            if (!state.leaveTypesTimestamp) return false;
            const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - state.leaveTypesTimestamp <= expirationTime;
        },

        /**
         * Get leave types as options for dropdowns
         */
        leaveTypeOptions: (state) => {
            return state.leaveTypes.map(type => ({
                value: type.id,
                label: type.name,
                requiresAttachment: type.requiresAttachment,
                defaultDuration: type.defaultDuration
            }));
        },

        /**
         * Get statistics for dashboard
         */
        getStatistics: (state) => state.statistics,

        /**
         * Check pagination state
         */
        hasMorePages: (state) => {
            return state.currentPage * state.pageSize < state.total;
        },

        /**
         * Calculate total pages
         */
        totalPages: (state) => {
            return Math.ceil(state.total / state.pageSize);
        }
    },

    actions: {
        /**
         * Build API parameters for requests
         */
        buildApiParams(additionalParams = {}) {
            const params = {
                page: this.currentPage,
                per_page: this.pageSize,
                ...additionalParams
            };

            // Add search filter
            if (this.searchStaffId?.trim()) {
                params.search = this.searchStaffId.trim();
            }

            // Add date range filter
            if (this.dateRange && this.dateRange.length === 2) {
                params.from = this.dateRange[0];
                params.to = this.dateRange[1];
            }

            // Add other filters
            if (this.filteredInfo.status) {
                params.status = this.filteredInfo.status;
            }

            if (this.filteredInfo.leaveTypes && this.filteredInfo.leaveTypes.length > 0) {
                params.leave_types = this.filteredInfo.leaveTypes.join(',');
            }

            // Add sorting
            if (this.sortedInfo.field) {
                params.sort_by = this.sortedInfo.field;
                params.sort_order = this.sortedInfo.order === 'descend' ? 'desc' : 'asc';
            }

            return params;
        },

        /**
         * Fetch leave requests with pagination and filtering - Following employees-list pattern
         */
        async fetchLeaveRequests(params = {}) {
            this.loading = true;
            this.error = null;

            try {
                const queryParams = {
                    page: params.page || this.currentPage || 1,
                    per_page: params.per_page || this.pageSize,
                    ...params
                };

                const response = await leaveService.getLeaveRequests(queryParams);

                if (response.success && response.data) {
                    this.leaveRequests = response.data || [];

                    // Update pagination properties from server response
                    if (response.pagination) {
                        this.total = response.pagination.total;
                        this.currentPage = response.pagination.current_page;
                        this.pageSize = response.pagination.per_page;
                    } else {
                        this.total = response.data.length;
                        this.currentPage = 1;
                    }

                    // Update statistics from server response
                    if (response.statistics) {
                        this.statistics = {
                            totalRequests: response.statistics.totalRequests || 0,
                            pendingRequests: response.statistics.pendingRequests || 0,
                            approvedRequests: response.statistics.approvedRequests || 0,
                            declinedRequests: response.statistics.declinedRequests || 0,
                            cancelledRequests: response.statistics.cancelledRequests || 0,
                            thisMonth: response.statistics.thisMonthRequests || 0,
                            thisWeek: response.statistics.thisWeekRequests || 0,
                            thisYear: response.statistics.thisYearRequests || 0
                        };
                    }

                    return { success: true, data: this.leaveRequests };
                } else {
                    this.leaveRequests = [];
                    this.total = 0;
                    this.error = response.message || 'Failed to fetch leave requests';
                    return { success: false, error: this.error };
                }
            } catch (error) {
                console.error('Error fetching leave requests:', error);
                this.leaveRequests = [];
                this.total = 0;
                this.error = error.message || 'Failed to fetch leave requests';
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Create a new leave request
         */
        async createLeaveRequest(leaveRequestData) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await leaveService.createLeaveRequest(leaveRequestData);

                if (response.success) {
                    // Add to local state
                    this.leaveRequests.unshift(response.data);
                    this.total += 1;

                    // Update current request
                    this.currentLeaveRequest = response.data;

                    // Invalidate leave balance cache for this employee/leave type (balance might have changed)
                    const employeeId = response.data.employeeId || response.data.employee_id;
                    const leaveTypeId = response.data.leaveTypeId || response.data.leave_type_id;

                    if (employeeId && leaveTypeId) {
                        this.invalidateEmployeeLeaveCache(employeeId, leaveTypeId);
                        console.log(`🔄 Cache invalidated for employee ${employeeId}, leave type ${leaveTypeId} after create`);
                    }

                    return { success: true, data: response.data };
                } else {
                    this.error = response.message || 'Failed to create leave request';
                    return { success: false, error: this.error };
                }
            } catch (error) {
                console.error('Error creating leave request:', error);
                this.error = error.message || 'Failed to create leave request';
                return { success: false, error: this.error };
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Update an existing leave request
         */
        async updateLeaveRequest(id, leaveRequestData) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await leaveService.updateLeaveRequest(id, leaveRequestData);

                if (response.success) {
                    // Store the old request data for cache invalidation
                    const oldRequest = this.leaveRequests.find(req => req.id === parseInt(id));

                    // Update in local state
                    const index = this.leaveRequests.findIndex(req => req.id === parseInt(id));
                    if (index !== -1) {
                        this.leaveRequests[index] = response.data;
                    }

                    // Update current request if it's the one being edited
                    if (this.currentLeaveRequest?.id === parseInt(id)) {
                        this.currentLeaveRequest = response.data;
                    }

                    // Always invalidate cache for updates since any change might affect balance calculation
                    // (e.g., total days changed, dates changed, status changed, etc.)
                    const oldEmployeeId = oldRequest?.employeeId || oldRequest?.employee_id;
                    const oldLeaveTypeId = oldRequest?.leaveTypeId || oldRequest?.leave_type_id;
                    const newEmployeeId = response.data.employeeId || response.data.employee_id;
                    const newLeaveTypeId = response.data.leaveTypeId || response.data.leave_type_id;

                    // Invalidate cache for old employee/leave type combination
                    if (oldEmployeeId && oldLeaveTypeId) {
                        this.invalidateEmployeeLeaveCache(oldEmployeeId, oldLeaveTypeId);
                        console.log(`🔄 Cache invalidated for old employee ${oldEmployeeId}, leave type ${oldLeaveTypeId} after update`);
                    }

                    // Invalidate cache for new employee/leave type combination (if different)
                    if (newEmployeeId && newLeaveTypeId &&
                        (newEmployeeId !== oldEmployeeId || newLeaveTypeId !== oldLeaveTypeId)) {
                        this.invalidateEmployeeLeaveCache(newEmployeeId, newLeaveTypeId);
                        console.log(`🔄 Cache invalidated for new employee ${newEmployeeId}, leave type ${newLeaveTypeId} after update`);
                    } else if (newEmployeeId && newLeaveTypeId) {
                        // Same employee/leave type, but still invalidate since balance might have changed
                        this.invalidateEmployeeLeaveCache(newEmployeeId, newLeaveTypeId);
                        console.log(`🔄 Cache invalidated for employee ${newEmployeeId}, leave type ${newLeaveTypeId} after update (same employee)`);
                    }

                    return { success: true, data: response.data };
                } else {
                    this.error = response.message || 'Failed to update leave request';
                    return { success: false, error: this.error };
                }
            } catch (error) {
                console.error('Error updating leave request:', error);
                this.error = error.message || 'Failed to update leave request';
                return { success: false, error: this.error };
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Delete a leave request
         */
        async deleteLeaveRequest(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await leaveService.deleteLeaveRequest(id);

                if (response.success) {
                    // Store the request data before deletion for cache invalidation
                    const deletedRequest = this.leaveRequests.find(req => req.id === parseInt(id));

                    // Remove from local state
                    this.leaveRequests = this.leaveRequests.filter(req => req.id !== parseInt(id));
                    this.total -= 1;

                    // Clear current request if it was deleted
                    if (this.currentLeaveRequest?.id === parseInt(id)) {
                        this.currentLeaveRequest = null;
                    }

                    // Invalidate leave balance cache for this employee/leave type (balance might have changed)
                    const employeeId = deletedRequest?.employeeId || deletedRequest?.employee_id;
                    const leaveTypeId = deletedRequest?.leaveTypeId || deletedRequest?.leave_type_id;

                    if (employeeId && leaveTypeId) {
                        this.invalidateEmployeeLeaveCache(employeeId, leaveTypeId);
                        console.log(`🔄 Cache invalidated for employee ${employeeId}, leave type ${leaveTypeId} after delete`);
                    }

                    return { success: true };
                } else {
                    this.error = response.message || 'Failed to delete leave request';
                    return { success: false, error: this.error };
                }
            } catch (error) {
                console.error('Error deleting leave request:', error);
                this.error = error.message || 'Failed to delete leave request';
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Fetch leave types with request deduplication
         * Note: Fetches ALL leave types (no pagination) for use in dropdowns
         */
        async fetchLeaveTypes(forceRefresh = false) {
            // Check cache first
            if (!forceRefresh && this.hasLeaveTypes && this.leaveTypes.length > 0) {
                return { success: true, data: this.leaveTypes, fromCache: true };
            }

            // Request deduplication - if a request is already pending, return that promise
            if (this.pendingLeaveTypesRequest && !forceRefresh) {
                console.log('⚡ Reusing pending leave types request (request deduplication)');
                return this.pendingLeaveTypesRequest;
            }

            this.loading = true;
            this.error = null;

            // Create and store the pending request promise
            this.pendingLeaveTypesRequest = (async () => {
                try {
                    // Fetch ALL leave types using non-paginated dropdown endpoint
                    const response = await leaveService.getLeaveTypesForDropdown();

                    if (response.success) {
                        this.leaveTypes = response.data || [];
                        this.leaveTypesTimestamp = Date.now();

                        console.log(`✅ LeaveStore: Fetched ${this.leaveTypes.length} leave types for dropdowns (non-paginated)`);
                        return { success: true, data: this.leaveTypes, fromCache: false };
                    } else {
                        this.error = response.message || 'Failed to fetch leave types';
                        return { success: false, error: this.error };
                    }
                } catch (error) {
                    console.error('Error fetching leave types:', error);
                    this.error = error.message || 'Failed to fetch leave types';
                    return { success: false, error: this.error };
                } finally {
                    this.loading = false;
                    // Clear the pending request after completion
                    this.pendingLeaveTypesRequest = null;
                }
            })();

            return this.pendingLeaveTypesRequest;
        },

        /**
         * Fetch leave balances
         */
        async fetchLeaveBalances(params = {}) {
            this.loading = true;
            this.error = null;

            try {
                const response = await leaveService.getLeaveBalances(params);

                if (response.success) {
                    this.leaveBalances = response.data || [];

                    return { success: true, data: this.leaveBalances };
                } else {
                    this.error = response.message || 'Failed to fetch leave balances';
                    return { success: false, error: this.error };
                }
            } catch (error) {
                console.error('Error fetching leave balances:', error);
                this.error = error.message || 'Failed to fetch leave balances';
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Get employee leave balance for a specific leave type
         */
        async getEmployeeLeaveBalance(employeeId, leaveTypeId, year = null) {
            try {
                const response = await leaveService.getEmployeeLeaveBalance(employeeId, leaveTypeId, year);
                return response;
            } catch (error) {
                console.error('Error fetching employee leave balance:', error);
                this.error = error.message || 'Failed to fetch employee leave balance';
                return { success: false, error: this.error };
            }
        },

        /**
         * Pagination actions
         */
        setPage(page) {
            this.currentPage = page;
        },

        setPageSize(size) {
            this.pageSize = size;
            this.currentPage = 1; // Reset to first page when changing page size
        },

        /**
         * Helper method to build complete API parameters - Following employees-list pattern
         */
        buildCompleteApiParams(baseParams = {}) {
            const params = {
                page: this.currentPage,
                per_page: this.pageSize,
                ...baseParams
            };

            // Add search parameter
            if (this.searchStaffId && this.searchStaffId.trim()) {
                params.search = this.searchStaffId.trim();
            }

            // Add date range filters
            if (this.dateRange && this.dateRange.length === 2) {
                params.from = this.dateRange[0];
                params.to = this.dateRange[1];
            }

            // Add leave type filters
            if (this.filteredInfo?.leaveTypes && this.filteredInfo.leaveTypes.length > 0) {
                params.leave_types = this.filteredInfo.leaveTypes.join(',');
            }

            // Add status filter
            if (this.filteredInfo?.status) {
                params.status = this.filteredInfo.status;
            }

            // Add sorting - map frontend sort values to backend values
            if (this.sortedInfo?.field) {
                params.sort_by = this.mapSortField(this.sortedInfo.field);
            }

            return params;
        },

        /**
         * Map frontend sort field names to backend sort values
         */
        mapSortField(field) {
            const fieldMapping = {
                'employee': 'recently_added',
                'leaveType': 'recently_added',
                'dateRange': 'ascending',
                'totalDays': 'recently_added',
                'status': 'recently_added'
            };
            return fieldMapping[field] || 'recently_added';
        },

        nextPage() {
            if (this.hasMorePages) {
                this.currentPage += 1;
            }
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage -= 1;
            }
        },

        /**
         * Filter and search actions
         */
        setSearch(staffId) {
            this.searchStaffId = staffId;
            this.currentPage = 1; // Reset to first page when searching
        },

        setDateRange(range) {
            this.dateRange = range;
            this.currentPage = 1; // Reset to first page when filtering
        },

        setFilters(filters) {
            this.filteredInfo = { ...filters };
            this.currentPage = 1; // Reset to first page when filtering
        },

        setSorting(sorting) {
            this.sortedInfo = { ...sorting };
            this.currentPage = 1; // Reset to first page when sorting
        },

        /**
         * Clear all filters and reset to default state
         */
        clearFilters() {
            this.filteredInfo = {};
            this.sortedInfo = {};
            this.searchStaffId = '';
            this.dateRange = null;
            this.currentPage = 1;
        },

        /**
         * Set current leave request for editing
         */
        setCurrentLeaveRequest(leaveRequest) {
            this.currentLeaveRequest = leaveRequest;
        },

        /**
         * Clear current leave request
         */
        clearCurrentLeaveRequest() {
            this.currentLeaveRequest = null;
        },

        /**
         * Fetch detailed leave request by ID (for editing)
         */
        async fetchLeaveRequestById(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await leaveService.getLeaveRequest(id);

                if (response.success && response.data) {
                    this.currentLeaveRequest = response.data;

                    // Cache the leave balance from the detailed request if available
                    if (response.data.employee && response.data.leaveType) {
                        const year = new Date().getFullYear();
                        const cacheKey = `${response.data.employee.id}-${response.data.leaveType.id}-${year}`;

                        // If the response includes balance data, cache it
                        if (response.data.leaveBalance) {
                            this.leaveBalanceCache.set(cacheKey, {
                                ...response.data.leaveBalance,
                                lastUpdated: Date.now()
                            });
                        }
                    }

                    return { success: true, data: response.data };
                } else {
                    this.error = response.message || 'Failed to fetch leave request details';
                    return { success: false, error: this.error };
                }
            } catch (error) {
                console.error('Error fetching leave request details:', error);
                this.error = error.message || 'Failed to fetch leave request details';
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Get cached leave balance or fetch if not available
         */
        async getOrFetchLeaveBalance(employeeId, leaveTypeId, year = null) {
            const currentYear = year || new Date().getFullYear();
            const cacheKey = `${employeeId}-${leaveTypeId}-${currentYear}`;

            // Check cache first (valid for 5 minutes)
            const cached = this.leaveBalanceCache.get(cacheKey);
            if (cached && (Date.now() - cached.lastUpdated) < 300000) { // 5 minutes
                return { success: true, data: cached, fromCache: true };
            }

            // Fetch from API if not cached or expired
            try {
                const response = await leaveService.getEmployeeLeaveBalance(employeeId, leaveTypeId, currentYear);

                if (response.success && response.data) {
                    // Cache the result
                    this.leaveBalanceCache.set(cacheKey, {
                        ...response.data,
                        lastUpdated: Date.now()
                    });

                    return { success: true, data: response.data, fromCache: false };
                } else {
                    return { success: false, error: response.message || 'Failed to fetch leave balance' };
                }
            } catch (error) {
                console.error('Error fetching leave balance:', error);
                return { success: false, error: error.message || 'Failed to fetch leave balance' };
            }
        },

        /**
         * Clear leave balance cache (call when balances might have changed)
         */
        clearLeaveBalanceCache() {
            this.leaveBalanceCache.clear();
        },

        /**
         * Invalidate specific employee's leave balance cache
         */
        invalidateEmployeeLeaveCache(employeeId, leaveTypeId = null, year = null) {
            const currentYear = year || new Date().getFullYear();

            if (leaveTypeId) {
                // Invalidate specific employee + leave type combination
                const cacheKey = `${employeeId}-${leaveTypeId}-${currentYear}`;
                this.leaveBalanceCache.delete(cacheKey);
                console.log(`🗑️ Invalidated cache for employee ${employeeId}, leave type ${leaveTypeId}`);
            } else {
                // Invalidate all leave types for this employee
                const keysToDelete = [];
                for (const key of this.leaveBalanceCache.keys()) {
                    if (key.startsWith(`${employeeId}-`) && key.endsWith(`-${currentYear}`)) {
                        keysToDelete.push(key);
                    }
                }
                keysToDelete.forEach(key => this.leaveBalanceCache.delete(key));
                console.log(`🗑️ Invalidated all cache entries for employee ${employeeId}`);
            }
        },

        /**
         * Force refresh specific leave balance (invalidate + fetch)
         */
        async refreshLeaveBalance(employeeId, leaveTypeId, year = null) {
            const currentYear = year || new Date().getFullYear();

            // Invalidate the cache first
            this.invalidateEmployeeLeaveCache(employeeId, leaveTypeId, currentYear);

            // Fetch fresh data
            return await this.getOrFetchLeaveBalance(employeeId, leaveTypeId, currentYear);
        },

        /**
         * Set current leave request (for editing)
         */
        setCurrentLeaveRequest(leaveRequest) {
            this.currentLeaveRequest = leaveRequest;
        },

        /**
         * Clear current leave request
         */
        clearCurrentLeaveRequest() {
            this.currentLeaveRequest = null;
        },

        /**
         * Reset store state
         */
        resetState() {
            this.leaveRequests = [];
            this.currentLeaveRequest = null;
            this.statistics = {
                totalRequests: 0,
                pendingRequests: 0,
                approvedRequests: 0,
                declinedRequests: 0,
                cancelledRequests: 0,
                thisMonth: 0,
                thisWeek: 0
            };
            this.leaveTypes = [];
            this.currentLeaveType = null;
            this.leaveBalances = [];
            this.currentLeaveBalance = null;
            this.leaveBalanceCache.clear();
            this.loading = false;
            this.submitting = false;
            this.searchLoading = false;
            this.error = null;
            this.currentPage = 1;
            this.pageSize = 10;
            this.total = 0;
            this.filteredInfo = {};
            this.sortedInfo = {};
            this.searchStaffId = '';
            this.dateRange = null;
            this.leaveTypesTimestamp = null;
            this.pendingLeaveTypesRequest = null;
        }
    }
});

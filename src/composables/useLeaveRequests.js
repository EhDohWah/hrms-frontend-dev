/**
 * Leave Requests Composable - Updated for Simplified Backend Structure
 * Uses the new Pinia store and handles the simplified approval structure
 */

import { computed } from 'vue';
import { useLeaveStore } from '@/stores/leaveStore';
import { useToast } from './useToast';

export function useLeaveRequests() {
    // Store instance
    const leaveStore = useLeaveStore();
    const { showToast } = useToast();

    // Computed properties from store state
    const leaveRequests = computed(() => leaveStore.leaveRequests);
    const currentLeaveRequest = computed(() => leaveStore.currentLeaveRequest);
    const statistics = computed(() => leaveStore.statistics);
    const loading = computed(() => leaveStore.loading);
    const submitting = computed(() => leaveStore.submitting);
    const error = computed(() => leaveStore.error);

    // Pagination computed properties
    const pagination = computed(() => {
        const current = leaveStore.currentPage || 1;
        const size = leaveStore.pageSize || 10;
        const totalRecords = leaveStore.total || 0;
        const totalPagesCount = leaveStore.totalPages || 1;

        // Calculate from and to for display
        const from = totalRecords > 0 ? ((current - 1) * size) + 1 : 0;
        const to = Math.min(current * size, totalRecords);

        return {
            currentPage: current,
            pageSize: size,
            total: totalRecords,
            totalPages: totalPagesCount,
            lastPage: totalPagesCount, // Alias for backward compatibility
            hasMorePages: leaveStore.hasMorePages,
            from,
            to
        };
    });

    // Filter computed properties
    const filters = computed(() => ({
        search: leaveStore.searchStaffId,
        dateRange: leaveStore.dateRange,
        filteredInfo: leaveStore.filteredInfo,
        sortedInfo: leaveStore.sortedInfo
    }));

    // Stats computed (alias for statistics for backward compatibility)
    const stats = computed(() => leaveStore.statistics);

    // Convenience computed properties
    const hasLeaveRequests = computed(() => leaveStore.leaveRequests.length > 0);
    const isFirstPage = computed(() => leaveStore.currentPage === 1);
    const isLastPage = computed(() => !leaveStore.hasMorePages);

    // Methods

    /**
     * Fetch detailed leave request by ID (for editing)
     */
    const fetchLeaveRequestById = async (id) => {
        try {
            const result = await leaveStore.fetchLeaveRequestById(id);

            if (!result.success) {
                showToast(result.error || 'Failed to fetch leave request details', 'error');
            }

            return result;
        } catch (error) {
            console.error('Error in fetchLeaveRequestById composable:', error);
            showToast('Failed to fetch leave request details', 'error');
            return { success: false, error: error.message };
        }
    };

    /**
     * Get cached leave balance or fetch if needed
     */
    const getCachedLeaveBalance = async (employeeId, leaveTypeId, year = null) => {
        try {
            const result = await leaveStore.getOrFetchLeaveBalance(employeeId, leaveTypeId, year);

            if (!result.success) {
                showToast(result.error || 'Failed to fetch leave balance', 'error');
            } else if (result.fromCache) {
                console.log('✅ Leave balance loaded from cache');
            } else {
                console.log('🌐 Leave balance fetched from API and cached');
            }

            return result;
        } catch (error) {
            console.error('Error in getCachedLeaveBalance composable:', error);
            showToast('Failed to fetch leave balance', 'error');
            return { success: false, error: error.message };
        }
    };

    /**
     * Force refresh leave balance (invalidate cache and fetch fresh)
     */
    const refreshLeaveBalance = async (employeeId, leaveTypeId, year = null) => {
        try {
            const result = await leaveStore.refreshLeaveBalance(employeeId, leaveTypeId, year);

            if (!result.success) {
                showToast(result.error || 'Failed to refresh leave balance', 'error');
            } else {
                console.log('🔄 Leave balance refreshed from API');
            }

            return result;
        } catch (error) {
            console.error('Error in refreshLeaveBalance composable:', error);
            showToast('Failed to refresh leave balance', 'error');
            return { success: false, error: error.message };
        }
    };

    /**
     * Invalidate employee's leave cache
     */
    const invalidateEmployeeCache = (employeeId, leaveTypeId = null, year = null) => {
        leaveStore.invalidateEmployeeLeaveCache(employeeId, leaveTypeId, year);
    };

    /**
     * Clear all leave balance cache
     */
    const clearLeaveCache = () => {
        leaveStore.clearLeaveBalanceCache();
    };

    /**
     * Fetch leave requests with current filters and pagination
     */
    const fetchLeaveRequests = async (resetPage = false, additionalParams = {}) => {
        if (resetPage) {
            leaveStore.setPage(1);
        }

        try {
            const result = await leaveStore.fetchLeaveRequests(additionalParams);

            if (!result.success) {
                showToast(result.error || 'Failed to fetch leave requests', 'error');
            }

            return result;
        } catch (error) {
            console.error('Error in fetchLeaveRequests composable:', error);
            showToast('Failed to fetch leave requests', 'error');
            return { success: false, error: error.message };
        }
    };

    /**
     * Create a new leave request
     */
    const createLeaveRequest = async (leaveRequestData) => {
        try {
            const result = await leaveStore.createLeaveRequest(leaveRequestData);

            if (result.success) {
                showToast('Leave request created successfully', 'success');
            } else {
                showToast(result.error || 'Failed to create leave request', 'error');
            }

            return result;
        } catch (error) {
            console.error('Error in createLeaveRequest composable:', error);
            showToast('Failed to create leave request', 'error');
            return { success: false, error: error.message };
        }
    };

    /**
     * Update an existing leave request
     */
    const updateLeaveRequest = async (id, leaveRequestData) => {
        try {
            const result = await leaveStore.updateLeaveRequest(id, leaveRequestData);

            if (result.success) {
                showToast('Leave request updated successfully', 'success');
            } else {
                showToast(result.error || 'Failed to update leave request', 'error');
            }

            return result;
        } catch (error) {
            console.error('Error in updateLeaveRequest composable:', error);
            showToast('Failed to update leave request', 'error');
            return { success: false, error: error.message };
        }
    };

    /**
     * Delete a leave request
     */
    const deleteLeaveRequest = async (id) => {
        try {
            const result = await leaveStore.deleteLeaveRequest(id);

            if (result.success) {
                showToast('Leave request deleted successfully', 'success');
            } else {
                showToast(result.error || 'Failed to delete leave request', 'error');
            }

            return result;
        } catch (error) {
            console.error('Error in deleteLeaveRequest composable:', error);
            showToast('Failed to delete leave request', 'error');
            return { success: false, error: error.message };
        }
    };

    /**
     * Update request status (approval/rejection) - simplified for new structure
     */
    const updateRequestStatus = async (id, status, approvalData = {}) => {
        try {
            // In the simplified structure, status updates are just regular updates
            const updateData = {
                status,
                ...approvalData
            };

            const result = await leaveStore.updateLeaveRequest(id, updateData);

            if (result.success) {
                showToast(`Leave request ${status} successfully`, 'success');
            } else {
                showToast(result.error || `Failed to ${status} leave request`, 'error');
            }

            return result;
        } catch (error) {
            console.error('Error in updateRequestStatus composable:', error);
            showToast(`Failed to ${status} leave request`, 'error');
            return { success: false, error: error.message };
        }
    };

    /**
     * Get employee leave balance
     */
    const getEmployeeLeaveBalance = async (employeeId, leaveTypeId, year = null) => {
        try {
            return await leaveStore.getEmployeeLeaveBalance(employeeId, leaveTypeId, year);
        } catch (error) {
            console.error('Error in getEmployeeLeaveBalance composable:', error);
            showToast('Failed to fetch leave balance', 'error');
            return { success: false, error: error.message };
        }
    };

    // Pagination methods
    const goToPage = (page) => {
        leaveStore.setPage(page);
        return fetchLeaveRequests();
    };

    const nextPage = () => {
        if (leaveStore.hasMorePages) {
            leaveStore.nextPage();
            return fetchLeaveRequests();
        }
        return Promise.resolve({ success: true });
    };

    const previousPage = () => {
        if (leaveStore.currentPage > 1) {
            leaveStore.previousPage();
            return fetchLeaveRequests();
        }
        return Promise.resolve({ success: true });
    };

    const changePerPage = (size) => {
        leaveStore.setPageSize(size);
        return fetchLeaveRequests();
    };

    // Filter and search methods
    const updateFilters = (newFilters) => {
        leaveStore.setFilters(newFilters);
        return fetchLeaveRequests(true); // Reset to first page when filtering
    };

    const setDateRange = (range) => {
        leaveStore.setDateRange(range);
        return fetchLeaveRequests(true); // Reset to first page when filtering
    };

    const updateSearch = (staffId) => {
        leaveStore.setSearch(staffId);
        return fetchLeaveRequests(true); // Reset to first page when searching
    };

    const updateSorting = (sorting) => {
        leaveStore.setSorting(sorting);
        return fetchLeaveRequests(true); // Reset to first page when sorting
    };

    const clearFilters = () => {
        leaveStore.clearFilters();
        return fetchLeaveRequests(true);
    };

    // Statistics methods
    const calculateStatistics = () => {
        // Statistics are automatically calculated by the store when fetching requests
        // This method is kept for backward compatibility
        return leaveStore.statistics;
    };

    const updateStatisticsUI = () => {
        // UI updates are handled by reactivity
        // This method is kept for backward compatibility
        return Promise.resolve();
    };

    // Current request management
    const setCurrentLeaveRequest = (leaveRequest) => {
        leaveStore.setCurrentLeaveRequest(leaveRequest);
    };

    const clearCurrentLeaveRequest = () => {
        leaveStore.clearCurrentLeaveRequest();
    };

    // Reset store
    const resetStore = () => {
        leaveStore.resetState();
    };

    return {
        // State
        leaveRequests,
        currentLeaveRequest,
        statistics,
        stats, // alias for backward compatibility
        loading,
        submitting,
        error,
        pagination,
        filters,

        // Computed convenience properties
        hasLeaveRequests,
        isFirstPage,
        isLastPage,

        // Core CRUD methods
        fetchLeaveRequests,
        fetchLeaveRequestById,
        createLeaveRequest,
        updateLeaveRequest,
        deleteLeaveRequest,
        updateRequestStatus,

        // Balance methods
        getEmployeeLeaveBalance,
        getCachedLeaveBalance,
        refreshLeaveBalance,
        invalidateEmployeeCache,
        clearLeaveCache,

        // Pagination methods
        goToPage,
        nextPage,
        previousPage,
        changePerPage,

        // Filter and search methods
        updateFilters,
        setDateRange,
        updateSearch,
        updateSorting,
        clearFilters,

        // Statistics methods (backward compatibility)
        calculateStatistics,
        updateStatisticsUI,

        // Current request management
        setCurrentLeaveRequest: (leaveRequest) => leaveStore.setCurrentLeaveRequest(leaveRequest),
        clearCurrentLeaveRequest: () => leaveStore.clearCurrentLeaveRequest(),

        // Utility methods
        resetStore
    };
}

// Additional composable for leave types
export function useLeaveTypes() {
    const leaveStore = useLeaveStore();
    const { showToast } = useToast();

    const leaveTypes = computed(() => leaveStore.leaveTypes);
    const leaveTypeOptions = computed(() => leaveStore.leaveTypeOptions);
    const loading = computed(() => leaveStore.loading);

    const fetchLeaveTypes = async (forceRefresh = false) => {
        try {
            const result = await leaveStore.fetchLeaveTypes(forceRefresh);

            if (!result.success) {
                showToast(result.error || 'Failed to fetch leave types', 'error');
            }

            return result;
        } catch (error) {
            console.error('Error in fetchLeaveTypes composable:', error);
            showToast('Failed to fetch leave types', 'error');
            return { success: false, error: error.message };
        }
    };

    return {
        leaveTypes,
        leaveTypeOptions,
        loading,
        fetchLeaveTypes
    };
}

// Additional composable for leave balances
export function useLeaveBalances() {
    const leaveStore = useLeaveStore();
    const { showToast } = useToast();

    const leaveBalances = computed(() => leaveStore.leaveBalances);
    const loading = computed(() => leaveStore.loading);

    const fetchLeaveBalances = async (params = {}) => {
        try {
            const result = await leaveStore.fetchLeaveBalances(params);

            if (!result.success) {
                showToast(result.error || 'Failed to fetch leave balances', 'error');
            }

            return result;
        } catch (error) {
            console.error('Error in fetchLeaveBalances composable:', error);
            showToast('Failed to fetch leave balances', 'error');
            return { success: false, error: error.message };
        }
    };

    const getEmployeeLeaveBalance = async (employeeId, leaveTypeId, year = null) => {
        try {
            return await leaveStore.getEmployeeLeaveBalance(employeeId, leaveTypeId, year);
        } catch (error) {
            console.error('Error in getEmployeeLeaveBalance composable:', error);
            showToast('Failed to fetch employee leave balance', 'error');
            return { success: false, error: error.message };
        }
    };

    return {
        leaveBalances,
        loading,
        fetchLeaveBalances,
        getEmployeeLeaveBalance
    };
}
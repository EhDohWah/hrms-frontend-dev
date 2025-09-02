/**
 * Leave Requests Composable
 * Handles state management and operations for leave requests using Vue 3 Composition API
 */

import { ref, reactive, computed, watch } from 'vue';
import { leaveService } from '@/services/leave.service';
import { validationUtils, dateUtils } from '@/utils/leave.utils';
import { useToast } from './useToast';
import { useLoading } from './useLoading';

export function useLeaveRequests() {
    // State
    const leaveRequests = ref([]);
    const currentLeaveRequest = ref(null);
    const pagination = reactive({
        currentPage: 1,
        perPage: 10,
        total: 0,
        lastPage: 1,
        from: 0,
        to: 0,
        hasMorePages: false
    });

    const stats = reactive({
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        declinedRequests: 0,
        cancelledRequests: 0,
        thisMonth: 0,
        thisWeek: 0
    });

    const filters = reactive({
        page: 1,
        perPage: 10,
        search: '',
        from: null,
        to: null,
        leaveTypes: [],
        status: '',
        sortBy: 'recently_added'
    });

    // Composables
    const { showToast } = useToast();
    const { loading, setLoading } = useLoading();

    // Computed
    const hasLeaveRequests = computed(() => leaveRequests.value.length > 0);
    const isFirstPage = computed(() => pagination.currentPage === 1);
    const isLastPage = computed(() => pagination.currentPage === pagination.lastPage);

    const filteredRequests = computed(() => {
        if (!filters.search) return leaveRequests.value;

        const searchTerm = filters.search.toLowerCase();
        return leaveRequests.value.filter(request => {
            const employeeName = request.employee?.name?.toLowerCase() || '';
            const staffId = request.employee?.staffId?.toLowerCase() || '';
            const leaveType = request.leaveType?.name?.toLowerCase() || '';

            return employeeName.includes(searchTerm) ||
                staffId.includes(searchTerm) ||
                leaveType.includes(searchTerm);
        });
    });

    // Methods
    const fetchLeaveRequests = async (resetPage = false) => {
        try {
            setLoading('leaveRequests', true);

            if (resetPage) {
                filters.page = 1;
                pagination.currentPage = 1;
            }

            const response = await leaveService.getLeaveRequests(filters);

            if (response.success) {
                leaveRequests.value = response.data || [];

                // Update pagination
                if (response.pagination) {
                    Object.assign(pagination, response.pagination);
                }

                // Update stats
                if (response.stats) {
                    Object.assign(stats, response.stats);
                }
            } else {
                showToast('Failed to fetch leave requests', 'error');
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            showToast('Error fetching leave requests', 'error');
        } finally {
            setLoading('leaveRequests', false);
        }
    };

    const fetchLeaveRequest = async (id) => {
        try {
            setLoading('currentLeaveRequest', true);

            const response = await leaveService.getLeaveRequestDetails(id);

            if (response.success) {
                currentLeaveRequest.value = response.data;
                return response.data;
            } else {
                showToast('Failed to fetch leave request details', 'error');
                return null;
            }
        } catch (error) {
            console.error('Error fetching leave request:', error);
            showToast('Error fetching leave request details', 'error');
            return null;
        } finally {
            setLoading('currentLeaveRequest', false);
        }
    };

    const createLeaveRequest = async (data) => {
        try {
            setLoading('createLeaveRequest', true);

            // Validate data
            const validation = validationUtils.validateLeaveRequest(data);
            if (!validation.isValid) {
                showToast('Please fix validation errors', 'error');
                return { success: false, errors: validation.errors };
            }

            // Calculate total days if not provided
            if (!data.totalDays && data.startDate && data.endDate) {
                data.totalDays = dateUtils.calculateDays(data.startDate, data.endDate);
            }

            const response = await leaveService.createLeaveRequest(data);

            if (response.success) {
                showToast('Leave request created successfully', 'success');
                await fetchLeaveRequests(true); // Refresh the list
                return { success: true, data: response.data };
            } else {
                showToast(response.message || 'Failed to create leave request', 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error creating leave request:', error);
            const message = error.response?.data?.message || 'Error creating leave request';
            showToast(message, 'error');
            return { success: false, error: message };
        } finally {
            setLoading('createLeaveRequest', false);
        }
    };

    const updateLeaveRequest = async (id, data) => {
        try {
            setLoading('updateLeaveRequest', true);

            const response = await leaveService.updateLeaveRequest(id, data);

            if (response.success) {
                showToast('Leave request updated successfully', 'success');

                // Update the local list
                const index = leaveRequests.value.findIndex(req => req.id === id);
                if (index !== -1) {
                    leaveRequests.value[index] = response.data;
                }

                // Update current request if it matches
                if (currentLeaveRequest.value?.id === id) {
                    currentLeaveRequest.value = response.data;
                }

                return { success: true, data: response.data };
            } else {
                showToast(response.message || 'Failed to update leave request', 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error updating leave request:', error);
            const message = error.response?.data?.message || 'Error updating leave request';
            showToast(message, 'error');
            return { success: false, error: message };
        } finally {
            setLoading('updateLeaveRequest', false);
        }
    };

    const deleteLeaveRequest = async (id) => {
        try {
            setLoading('deleteLeaveRequest', true);

            const response = await leaveService.deleteLeaveRequest(id);

            if (response.success) {
                showToast('Leave request deleted successfully', 'success');

                // Remove from local list
                leaveRequests.value = leaveRequests.value.filter(req => req.id !== id);

                // Clear current request if it matches
                if (currentLeaveRequest.value?.id === id) {
                    currentLeaveRequest.value = null;
                }

                return { success: true };
            } else {
                showToast(response.message || 'Failed to delete leave request', 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error deleting leave request:', error);
            const message = error.response?.data?.message || 'Error deleting leave request';
            showToast(message, 'error');
            return { success: false, error: message };
        } finally {
            setLoading('deleteLeaveRequest', false);
        }
    };

    const updateRequestStatus = async (id, status, approverData = {}) => {
        try {
            setLoading('updateStatus', true);

            const response = await leaveService.updateLeaveRequest(id, { status });

            if (response.success && approverData.approverName) {
                // Create approval record
                await leaveService.createLeaveApproval(id, {
                    status,
                    approverName: approverData.approverName,
                    approverRole: approverData.approverRole || 'HR Manager',
                    approverSignature: approverData.approverSignature
                });
            }

            if (response.success) {
                showToast(`Leave request ${status} successfully`, 'success');
                await fetchLeaveRequests(); // Refresh the list
                return { success: true };
            } else {
                showToast(response.message || `Failed to ${status} leave request`, 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error(`Error ${status} leave request:`, error);
            const message = error.response?.data?.message || `Error ${status} leave request`;
            showToast(message, 'error');
            return { success: false, error: message };
        } finally {
            setLoading('updateStatus', false);
        }
    };

    const bulkUpdateRequests = async (ids, data) => {
        try {
            setLoading('bulkUpdate', true);

            const response = await leaveService.bulkUpdateLeaveRequests(ids, data);

            if (response.success) {
                showToast('Leave requests updated successfully', 'success');
                await fetchLeaveRequests(); // Refresh the list
                return { success: true };
            } else {
                showToast(response.message || 'Failed to update leave requests', 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error bulk updating leave requests:', error);
            const message = error.response?.data?.message || 'Error updating leave requests';
            showToast(message, 'error');
            return { success: false, error: message };
        } finally {
            setLoading('bulkUpdate', false);
        }
    };

    // Pagination methods
    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.lastPage) {
            filters.page = page;
            fetchLeaveRequests();
        }
    };

    const nextPage = () => {
        if (pagination.hasMorePages) {
            goToPage(pagination.currentPage + 1);
        }
    };

    const previousPage = () => {
        if (pagination.currentPage > 1) {
            goToPage(pagination.currentPage - 1);
        }
    };

    const changePerPage = (perPage) => {
        filters.perPage = perPage;
        filters.page = 1;
        fetchLeaveRequests();
    };

    // Filter methods
    const updateFilters = (newFilters) => {
        Object.assign(filters, newFilters);
        fetchLeaveRequests(true);
    };

    const clearFilters = () => {
        Object.assign(filters, {
            page: 1,
            perPage: 10,
            search: '',
            from: null,
            to: null,
            leaveTypes: [],
            status: '',
            sortBy: 'recently_added'
        });
        fetchLeaveRequests(true);
    };

    const setDateRange = (from, to) => {
        filters.from = from;
        filters.to = to;
        fetchLeaveRequests(true);
    };

    // Watchers
    watch(() => filters.search, (newSearch) => {
        // Debounce search
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        let searchTimeout = setTimeout(() => {
            fetchLeaveRequests(true);
        }, 500);
    });

    return {
        // State
        leaveRequests,
        currentLeaveRequest,
        pagination,
        stats,
        filters,
        loading,

        // Computed
        hasLeaveRequests,
        isFirstPage,
        isLastPage,
        filteredRequests,

        // Methods
        fetchLeaveRequests,
        fetchLeaveRequest,
        createLeaveRequest,
        updateLeaveRequest,
        deleteLeaveRequest,
        updateRequestStatus,
        bulkUpdateRequests,

        // Pagination
        goToPage,
        nextPage,
        previousPage,
        changePerPage,

        // Filters
        updateFilters,
        clearFilters,
        setDateRange
    };
}


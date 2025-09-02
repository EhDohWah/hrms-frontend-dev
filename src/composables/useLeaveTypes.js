/**
 * Leave Types Composable
 * Handles state management and operations for leave types using Vue 3 Composition API
 */

import { ref, reactive, computed } from 'vue';
import { leaveService } from '@/services/leave.service';
import { validationUtils } from '@/utils/leave.utils';
import { useToast } from './useToast';
import { useLoading } from './useLoading';

export function useLeaveTypes() {
    // State
    const leaveTypes = ref([]);
    const currentLeaveType = ref(null);
    const pagination = reactive({
        currentPage: 1,
        perPage: 10,
        total: 0,
        lastPage: 1
    });

    const filters = reactive({
        page: 1,
        perPage: 10,
        search: ''
    });

    // Composables
    const { showToast } = useToast();
    const { loading, setLoading } = useLoading();

    // Computed
    const hasLeaveTypes = computed(() => leaveTypes.value.length > 0);
    const isFirstPage = computed(() => pagination.currentPage === 1);
    const isLastPage = computed(() => pagination.currentPage === pagination.lastPage);

    const activeLeaveTypes = computed(() => {
        return leaveTypes.value.filter(type => !type.isDeleted);
    });

    const leaveTypeOptions = computed(() => {
        return activeLeaveTypes.value.map(type => ({
            value: type.id,
            label: type.name,
            requiresAttachment: type.requiresAttachment,
            defaultDuration: type.defaultDuration
        }));
    });

    // Methods
    const fetchLeaveTypes = async (resetPage = false) => {
        try {
            setLoading('leaveTypes', true);

            if (resetPage) {
                filters.page = 1;
                pagination.currentPage = 1;
            }

            const response = await leaveService.getLeaveTypes(filters);

            if (response.success) {
                leaveTypes.value = response.data || [];

                // Update pagination
                if (response.pagination) {
                    Object.assign(pagination, response.pagination);
                }
            } else {
                showToast('Failed to fetch leave types', 'error');
            }
        } catch (error) {
            console.error('Error fetching leave types:', error);
            showToast('Error fetching leave types', 'error');
        } finally {
            setLoading('leaveTypes', false);
        }
    };

    const fetchLeaveType = async (id) => {
        try {
            setLoading('currentLeaveType', true);

            const response = await leaveService.getLeaveTypeDetails(id);

            if (response.success) {
                currentLeaveType.value = response.data;
                return response.data;
            } else {
                showToast('Failed to fetch leave type details', 'error');
                return null;
            }
        } catch (error) {
            console.error('Error fetching leave type:', error);
            showToast('Error fetching leave type details', 'error');
            return null;
        } finally {
            setLoading('currentLeaveType', false);
        }
    };

    const createLeaveType = async (data) => {
        try {
            setLoading('createLeaveType', true);

            // Validate data
            const validation = validationUtils.validateLeaveType(data);
            if (!validation.isValid) {
                showToast('Please fix validation errors', 'error');
                return { success: false, errors: validation.errors };
            }

            const response = await leaveService.createLeaveType(data);

            if (response.success) {
                showToast('Leave type created successfully', 'success');
                await fetchLeaveTypes(true); // Refresh the list
                return { success: true, data: response.data };
            } else {
                showToast(response.message || 'Failed to create leave type', 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error creating leave type:', error);
            const message = error.response?.data?.message || 'Error creating leave type';
            showToast(message, 'error');
            return { success: false, error: message };
        } finally {
            setLoading('createLeaveType', false);
        }
    };

    const updateLeaveType = async (id, data) => {
        try {
            setLoading('updateLeaveType', true);

            // Validate data
            const validation = validationUtils.validateLeaveType(data);
            if (!validation.isValid) {
                showToast('Please fix validation errors', 'error');
                return { success: false, errors: validation.errors };
            }

            const response = await leaveService.updateLeaveType(id, data);

            if (response.success) {
                showToast('Leave type updated successfully', 'success');

                // Update the local list
                const index = leaveTypes.value.findIndex(type => type.id === id);
                if (index !== -1) {
                    leaveTypes.value[index] = response.data;
                }

                // Update current type if it matches
                if (currentLeaveType.value?.id === id) {
                    currentLeaveType.value = response.data;
                }

                return { success: true, data: response.data };
            } else {
                showToast(response.message || 'Failed to update leave type', 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error updating leave type:', error);
            const message = error.response?.data?.message || 'Error updating leave type';
            showToast(message, 'error');
            return { success: false, error: message };
        } finally {
            setLoading('updateLeaveType', false);
        }
    };

    const deleteLeaveType = async (id) => {
        try {
            setLoading('deleteLeaveType', true);

            const response = await leaveService.deleteLeaveType(id);

            if (response.success) {
                showToast('Leave type deleted successfully', 'success');

                // Remove from local list
                leaveTypes.value = leaveTypes.value.filter(type => type.id !== id);

                // Clear current type if it matches
                if (currentLeaveType.value?.id === id) {
                    currentLeaveType.value = null;
                }

                return { success: true };
            } else {
                showToast(response.message || 'Failed to delete leave type', 'error');
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error('Error deleting leave type:', error);
            const message = error.response?.data?.message || 'Error deleting leave type';
            showToast(message, 'error');
            return { success: false, error: message };
        } finally {
            setLoading('deleteLeaveType', false);
        }
    };

    // Pagination methods
    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.lastPage) {
            filters.page = page;
            fetchLeaveTypes();
        }
    };

    const nextPage = () => {
        if (pagination.currentPage < pagination.lastPage) {
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
        fetchLeaveTypes();
    };

    // Filter methods
    const updateFilters = (newFilters) => {
        Object.assign(filters, newFilters);
        fetchLeaveTypes(true);
    };

    const clearFilters = () => {
        Object.assign(filters, {
            page: 1,
            perPage: 10,
            search: ''
        });
        fetchLeaveTypes(true);
    };

    // Utility methods
    const getLeaveTypeById = (id) => {
        return leaveTypes.value.find(type => type.id === id);
    };

    const getLeaveTypeByName = (name) => {
        return leaveTypes.value.find(type =>
            type.name.toLowerCase() === name.toLowerCase()
        );
    };

    const isLeaveTypeNameUnique = (name, excludeId = null) => {
        return !leaveTypes.value.some(type =>
            type.name.toLowerCase() === name.toLowerCase() &&
            type.id !== excludeId
        );
    };

    return {
        // State
        leaveTypes,
        currentLeaveType,
        pagination,
        filters,
        loading,

        // Computed
        hasLeaveTypes,
        isFirstPage,
        isLastPage,
        activeLeaveTypes,
        leaveTypeOptions,

        // Methods
        fetchLeaveTypes,
        fetchLeaveType,
        createLeaveType,
        updateLeaveType,
        deleteLeaveType,

        // Pagination
        goToPage,
        nextPage,
        previousPage,
        changePerPage,

        // Filters
        updateFilters,
        clearFilters,

        // Utilities
        getLeaveTypeById,
        getLeaveTypeByName,
        isLeaveTypeNameUnique
    };
}


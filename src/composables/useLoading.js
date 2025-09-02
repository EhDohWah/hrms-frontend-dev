/**
 * Loading State Composable
 * Provides centralized loading state management using Vue 3 Composition API
 */

import { ref, reactive, computed } from 'vue';

const loadingStates = reactive({});

export function useLoading() {
    const setLoading = (key, isLoading) => {
        loadingStates[key] = isLoading;
    };

    const isLoading = (key) => {
        return loadingStates[key] || false;
    };

    const clearLoading = (key) => {
        delete loadingStates[key];
    };

    const clearAllLoading = () => {
        Object.keys(loadingStates).forEach(key => {
            delete loadingStates[key];
        });
    };

    // Computed properties for common loading states
    const loading = computed(() => loadingStates);
    const isAnyLoading = computed(() => Object.values(loadingStates).some(state => state));

    // Specific loading states for leave management
    const isLeaveRequestsLoading = computed(() => loadingStates.leaveRequests || false);
    const isLeaveTypesLoading = computed(() => loadingStates.leaveTypes || false);
    const isLeaveBalancesLoading = computed(() => loadingStates.leaveBalances || false);
    const isCreatingLeaveRequest = computed(() => loadingStates.createLeaveRequest || false);
    const isUpdatingLeaveRequest = computed(() => loadingStates.updateLeaveRequest || false);
    const isDeletingLeaveRequest = computed(() => loadingStates.deleteLeaveRequest || false);

    return {
        loading,
        loadingStates,
        isAnyLoading,
        setLoading,
        isLoading,
        clearLoading,
        clearAllLoading,

        // Specific loading states
        isLeaveRequestsLoading,
        isLeaveTypesLoading,
        isLeaveBalancesLoading,
        isCreatingLeaveRequest,
        isUpdatingLeaveRequest,
        isDeletingLeaveRequest
    };
}


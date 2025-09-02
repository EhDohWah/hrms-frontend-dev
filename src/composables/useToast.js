/**
 * Toast Composable
 * Provides toast notification functionality using Vue 3 Composition API
 */

import { ref, reactive } from 'vue';

const toasts = ref([]);
let toastId = 0;

export function useToast() {
    const showToast = (message, type = 'info', duration = 5000, options = {}) => {
        const id = ++toastId;
        const toast = {
            id,
            message,
            type, // 'success', 'error', 'warning', 'info'
            duration,
            timestamp: Date.now(),
            ...options
        };

        toasts.value.push(toast);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    };

    const removeToast = (id) => {
        const index = toasts.value.findIndex(toast => toast.id === id);
        if (index > -1) {
            toasts.value.splice(index, 1);
        }
    };

    const clearAllToasts = () => {
        toasts.value = [];
    };

    // Convenience methods
    const showSuccess = (message, duration = 4000, options = {}) => {
        return showToast(message, 'success', duration, options);
    };

    const showError = (message, duration = 6000, options = {}) => {
        return showToast(message, 'error', duration, options);
    };

    const showWarning = (message, duration = 5000, options = {}) => {
        return showToast(message, 'warning', duration, options);
    };

    const showInfo = (message, duration = 4000, options = {}) => {
        return showToast(message, 'info', duration, options);
    };

    // For handling API responses
    const handleApiResponse = (response, successMessage = null, errorMessage = null) => {
        if (response.success) {
            if (successMessage) {
                showSuccess(successMessage);
            } else if (response.message) {
                showSuccess(response.message);
            }
        } else {
            if (errorMessage) {
                showError(errorMessage);
            } else if (response.message) {
                showError(response.message);
            } else {
                showError('An error occurred');
            }
        }
    };

    return {
        toasts,
        showToast,
        removeToast,
        clearAllToasts,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        handleApiResponse
    };
}


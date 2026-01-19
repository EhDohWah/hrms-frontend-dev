import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class DashboardService extends BaseService {
    /**
     * Get current user's dashboard widgets
     * @returns {Promise} User's dashboard widget configuration
     */
    async getMyWidgets() {
        return await this.handleApiResponse(
            () => apiService.get(API_ENDPOINTS.DASHBOARD.MY_WIDGETS),
            'fetch dashboard widgets'
        );
    }

    /**
     * Update current user's dashboard widget configuration
     * @param {Array} widgets - Array of widget configurations
     * @returns {Promise} Update result
     */
    async updateMyWidgets(widgets) {
        return await this.handleApiResponse(
            () => apiService.put(API_ENDPOINTS.DASHBOARD.UPDATE_WIDGETS, { widgets }),
            'update dashboard widgets'
        );
    }

    /**
     * Get available widgets for current user based on permissions
     * @returns {Promise} Available widgets
     */
    async getAvailableWidgets() {
        return await this.handleApiResponse(
            () => apiService.get(API_ENDPOINTS.DASHBOARD.AVAILABLE_WIDGETS),
            'fetch available widgets'
        );
    }

    /**
     * Add a widget to user's dashboard
     * @param {number} widgetId - Widget ID to add
     * @returns {Promise} Add result
     */
    async addWidget(widgetId) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.DASHBOARD.ADD_WIDGET, { widget_id: widgetId }),
            'add widget'
        );
    }

    /**
     * Remove a widget from user's dashboard
     * @param {number} widgetId - Widget ID to remove
     * @returns {Promise} Remove result
     */
    async removeWidget(widgetId) {
        const endpoint = API_ENDPOINTS.DASHBOARD.REMOVE_WIDGET.replace(':widgetId', widgetId);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            'remove widget'
        );
    }

    /**
     * Toggle widget visibility
     * @param {number} widgetId - Widget ID
     * @returns {Promise} Toggle result
     */
    async toggleWidgetVisibility(widgetId) {
        const endpoint = API_ENDPOINTS.DASHBOARD.TOGGLE_VISIBILITY.replace(':widgetId', widgetId);
        return await this.handleApiResponse(
            () => apiService.post(endpoint),
            'toggle widget visibility'
        );
    }

    /**
     * Toggle widget collapse state
     * @param {number} widgetId - Widget ID
     * @returns {Promise} Toggle result
     */
    async toggleWidgetCollapse(widgetId) {
        const endpoint = API_ENDPOINTS.DASHBOARD.TOGGLE_COLLAPSE.replace(':widgetId', widgetId);
        return await this.handleApiResponse(
            () => apiService.post(endpoint),
            'toggle widget collapse'
        );
    }

    /**
     * Reorder widgets on dashboard
     * @param {Array} widgetOrder - Array of widget IDs in desired order
     * @returns {Promise} Reorder result
     */
    async reorderWidgets(widgetOrder) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.DASHBOARD.REORDER_WIDGETS, { widget_order: widgetOrder }),
            'reorder widgets'
        );
    }

    /**
     * Reset dashboard to default widgets
     * @returns {Promise} Reset result
     */
    async resetToDefaults() {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.DASHBOARD.RESET_DEFAULTS),
            'reset dashboard'
        );
    }

    // ========== Admin endpoints for user management ==========

    /**
     * Get all available widgets (admin)
     * @returns {Promise} All widgets
     */
    async getAllWidgets() {
        return await this.handleApiResponse(
            () => apiService.get(API_ENDPOINTS.ADMIN.DASHBOARD.ALL_WIDGETS),
            'fetch all widgets'
        );
    }

    /**
     * Get widgets for a specific user (admin)
     * @param {number} userId - User ID
     * @returns {Promise} User's widgets
     */
    async getUserWidgets(userId) {
        const endpoint = API_ENDPOINTS.ADMIN.DASHBOARD.USER_WIDGETS.replace(':userId', userId);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch widgets for user ${userId}`
        );
    }

    /**
     * Set widgets for a specific user (admin)
     * @param {number} userId - User ID
     * @param {Array} widgetIds - Array of widget IDs
     * @returns {Promise} Update result
     */
    async setUserWidgets(userId, widgetIds) {
        const endpoint = API_ENDPOINTS.ADMIN.DASHBOARD.USER_WIDGETS.replace(':userId', userId);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, { widget_ids: widgetIds }),
            `set widgets for user ${userId}`
        );
    }

    /**
     * Get available widgets for a specific user based on their permissions (admin)
     * @param {number} userId - User ID
     * @returns {Promise} Available widgets for user
     */
    async getAvailableWidgetsForUser(userId) {
        const endpoint = API_ENDPOINTS.ADMIN.DASHBOARD.USER_AVAILABLE_WIDGETS.replace(':userId', userId);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch available widgets for user ${userId}`
        );
    }

    /**
     * Get widget categories
     * @returns {Object} Widget categories
     */
    getWidgetCategories() {
        return {
            general: 'General',
            hr: 'Human Resources',
            payroll: 'Payroll',
            leave: 'Leave Management',
            attendance: 'Attendance',
            recruitment: 'Recruitment',
            training: 'Training',
            reports: 'Reports',
        };
    }

    /**
     * Get widget sizes
     * @returns {Object} Widget sizes
     */
    getWidgetSizes() {
        return {
            small: 'Small (1/4 width)',
            medium: 'Medium (1/2 width)',
            large: 'Large (3/4 width)',
            full: 'Full width',
        };
    }

    /**
     * Get CSS class for widget size
     * @param {string} size - Widget size
     * @returns {string} CSS class
     */
    getWidgetSizeClass(size) {
        const sizeClasses = {
            small: 'col-lg-3 col-md-6',
            medium: 'col-lg-6 col-md-6',
            large: 'col-lg-9 col-md-12',
            full: 'col-12',
        };
        return sizeClasses[size] || sizeClasses.medium;
    }
}

export const dashboardService = new DashboardService();
export default dashboardService;

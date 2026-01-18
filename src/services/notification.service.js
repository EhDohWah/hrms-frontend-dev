import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class NotificationService {
    /**
     * Get notifications with pagination and filtering
     * @param {Object} params - Query parameters
     * @param {number} params.per_page - Items per page (default: 20, max: 100)
     * @param {number} params.page - Page number
     * @param {string} params.category - Filter by category
     * @param {string} params.read_status - Filter by read status (read, unread, all)
     * @param {string} params.search - Search in notification message
     */
    async getNotifications(params = {}) {
        return apiService.get(API_ENDPOINTS.NOTIFICATION.LIST, { params });
    }

    /**
     * Get a single notification by ID
     */
    async getNotificationById(id) {
        return apiService.get(`${API_ENDPOINTS.NOTIFICATION.LIST}/${id}`);
    }

    /**
     * Mark a single notification as read
     */
    async markAsRead(id) {
        const endpoint = API_ENDPOINTS.NOTIFICATION.MARK_READ.replace(':id', id);
        return apiService.post(endpoint);
    }

    /**
     * Mark all notifications as read
     */
    async markAllNotificationsRead() {
        return apiService.post(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ);
    }

    /**
     * Delete a single notification
     */
    async deleteNotification(id) {
        return apiService.delete(`${API_ENDPOINTS.NOTIFICATION.LIST}/${id}`);
    }

    /**
     * Delete multiple notifications
     * @param {Array} ids - Array of notification IDs to delete
     */
    async bulkDelete(ids) {
        return apiService.post(API_ENDPOINTS.NOTIFICATION.BULK_DELETE, { ids });
    }

    /**
     * Clear all read notifications
     */
    async clearRead() {
        return apiService.post(API_ENDPOINTS.NOTIFICATION.CLEAR_READ);
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount() {
        return apiService.get(API_ENDPOINTS.NOTIFICATION.UNREAD_COUNT);
    }

    /**
     * Get notification statistics
     */
    async getStats() {
        return apiService.get(API_ENDPOINTS.NOTIFICATION.STATS);
    }

    /**
     * Get filter options (categories and priorities)
     */
    async getFilterOptions() {
        return apiService.get(API_ENDPOINTS.NOTIFICATION.FILTER_OPTIONS);
    }
}

export const notificationService = new NotificationService();


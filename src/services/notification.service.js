import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class NotificationService {
    async getNotifications(params = {}) {
        return apiService.get(API_ENDPOINTS.NOTIFICATION.LIST, { params });
    }

    async getNotificationById(id) {
        return apiService.get(`${API_ENDPOINTS.NOTIFICATION.LIST}/${id}`);
    }

    async markAsRead(id) {
        const endpoint = API_ENDPOINTS.NOTIFICATION.MARK_READ.replace(':id', id);
        return apiService.post(endpoint);
    }

    async markAllNotificationsRead() {
        return apiService.post(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ);
    }
}

export const notificationService = new NotificationService();


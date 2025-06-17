import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class NotificationService {
    async getNotifications() {
        return apiService.get(API_ENDPOINTS.NOTIFICATION.LIST);
    }

    async markAllNotificationsRead() {
        return apiService.post(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ);
    }
}

export const notificationService = new NotificationService();
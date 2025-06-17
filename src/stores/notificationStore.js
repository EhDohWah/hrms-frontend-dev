import { defineStore } from 'pinia'
import { notificationService } from '@/services/notification.service'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: []
    }),
    actions: {
        async fetchNotifications() {
            this.notifications = await notificationService.getNotifications();
        },
        async markAllNotificationsRead() {
            await notificationService.markAllNotificationsRead();
            // Mark all as read in state
            this.notifications = this.notifications.map(n => ({
                ...n,
                read_at: new Date().toISOString()
            }));
        },
        // Add notification (from websocket)
        addNotification(notification) {
            // Prevent duplicate notifications
            if (!this.notifications.some(n => n.id === notification.id)) {
                this.notifications.unshift(notification);
            }
        }
    },
    getters: {
        getNotifications: state => state.notifications,
        getUnreadNotifications: state => state.notifications.filter(n => !n.read_at),
        unreadCount: state => state.notifications.filter(n => !n.read_at).length
    },
    persist: {
        key: 'notification-store',
        storage: localStorage
    }
});

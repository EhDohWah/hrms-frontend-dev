import { defineStore } from 'pinia'
import { notificationService } from '@/services/notification.service'

// Maximum number of notifications to keep in memory and localStorage
// Prevents unbounded array growth and localStorage pollution
const MAX_NOTIFICATIONS = 100;

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: []
    }),
    actions: {
        async fetchNotifications() {
            try {
                const response = await notificationService.getNotifications();
                const data = response.data || response;
                this.notifications = Array.isArray(data) ? data : (data.data || []);
                // Apply limit even when fetching
                this.trimNotifications();
            } catch (error) {
                console.error('Error fetching notifications:', error);
                this.notifications = [];
            }
        },
        async markAllNotificationsRead() {
            try {
                await notificationService.markAllNotificationsRead();
                // Mark all as read in state
                this.notifications = this.notifications.map(n => ({
                    ...n,
                    read_at: new Date().toISOString()
                }));
            } catch (error) {
                console.error('Error marking all notifications as read:', error);
                throw error;
            }
        },
        /**
         * Add notification (from websocket)
         * CRITICAL: Limits array size to prevent unbounded growth
         */
        addNotification(notification) {
            // Prevent duplicate notifications
            if (!this.notifications.some(n => n.id === notification.id)) {
                this.notifications.unshift(notification);

                // CRITICAL: Trim to MAX_NOTIFICATIONS to prevent memory leak
                this.trimNotifications();
            }
        },
        /**
         * Trim notifications array to MAX_NOTIFICATIONS
         * Prevents unbounded array growth in both memory and localStorage
         */
        trimNotifications() {
            if (this.notifications.length > MAX_NOTIFICATIONS) {
                const removedCount = this.notifications.length - MAX_NOTIFICATIONS;
                this.notifications = this.notifications.slice(0, MAX_NOTIFICATIONS);
                console.log(`[NotificationStore] Trimmed ${removedCount} old notifications (keeping ${MAX_NOTIFICATIONS} most recent)`);
            }
        },
        /**
         * Reset store state - CRITICAL for logout cleanup
         * Prevents notification data from persisting across user sessions
         */
        resetState() {
            this.notifications = [];
            console.log('[NotificationStore] State reset - all notifications cleared');
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

import { defineStore } from 'pinia'
import { notificationService } from '@/services/notification.service'

// Maximum number of notifications to keep in memory and localStorage
// Prevents unbounded array growth and localStorage pollution
const MAX_NOTIFICATIONS = 100;

// Default notification preferences
const DEFAULT_PREFERENCES = {
    playSound: true,
    showToast: true,
    categories: {
        dashboard: { enabled: true },
        grants: { enabled: true },
        recruitment: { enabled: true },
        employee: { enabled: true },
        holidays: { enabled: true },
        leaves: { enabled: true },
        travel: { enabled: true },
        attendance: { enabled: true },
        training: { enabled: true },
        resignation: { enabled: true },
        termination: { enabled: true },
        payroll: { enabled: true },
        lookups: { enabled: true },
        organization: { enabled: true },
        user_management: { enabled: true },
        reports: { enabled: true },
        file_uploads: { enabled: true },
        recycle_bin: { enabled: true },
        import: { enabled: true },
        system: { enabled: true },
        general: { enabled: true },
    }
};

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
        loading: false,
        error: null,
        meta: {
            currentPage: 1,
            lastPage: 1,
            perPage: 20,
            total: 0,
        },
        filters: {
            category: null,
            readStatus: 'all', // 'all', 'read', 'unread'
            search: '',
        },
        preferences: { ...DEFAULT_PREFERENCES },
    }),
    actions: {
        async fetchNotifications(params = {}) {
            this.loading = true;
            this.error = null;
            try {
                const queryParams = {
                    per_page: params.perPage || this.meta.perPage,
                    page: params.page || 1,
                    category: params.category || this.filters.category,
                    read_status: params.readStatus || this.filters.readStatus,
                    search: params.search || this.filters.search,
                };

                // Remove null/undefined values
                Object.keys(queryParams).forEach(key => {
                    if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
                        delete queryParams[key];
                    }
                });

                const response = await notificationService.getNotifications(queryParams);

                // Handle both old and new API response formats
                if (response.data && response.meta) {
                    // New format with pagination
                    this.notifications = response.data;
                    this.meta = {
                        currentPage: response.meta.current_page,
                        lastPage: response.meta.last_page,
                        perPage: response.meta.per_page,
                        total: response.meta.total,
                        unreadCount: response.meta.unread_count || 0,
                    };
                } else {
                    // Old format (array directly)
                    const data = response.data || response;
                    this.notifications = Array.isArray(data) ? data : (data.data || []);
                }

                // Apply limit even when fetching
                this.trimNotifications();
            } catch (error) {
                console.error('Error fetching notifications:', error);
                this.error = error.message;
                this.notifications = [];
            } finally {
                this.loading = false;
            }
        },

        async fetchUnreadCount() {
            try {
                const response = await notificationService.getUnreadCount();
                if (response.data?.count !== undefined) {
                    this.meta.unreadCount = response.data.count;
                }
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        },

        async markNotificationRead(notificationId) {
            try {
                await notificationService.markAsRead(notificationId);
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.read_at = new Date().toISOString();
                }
            } catch (error) {
                console.error('Error marking notification as read:', error);
                throw error;
            }
        },

        async markAllNotificationsRead() {
            try {
                await notificationService.markAllNotificationsRead();
                // Mark all as read in state
                this.notifications = this.notifications.map(n => ({
                    ...n,
                    read_at: n.read_at || new Date().toISOString()
                }));
            } catch (error) {
                console.error('Error marking all notifications as read:', error);
                throw error;
            }
        },

        async deleteNotification(notificationId) {
            try {
                await notificationService.deleteNotification(notificationId);
                this.notifications = this.notifications.filter(n => n.id !== notificationId);
            } catch (error) {
                console.error('Error deleting notification:', error);
                throw error;
            }
        },

        async clearReadNotifications() {
            try {
                await notificationService.clearRead();
                this.notifications = this.notifications.filter(n => !n.read_at);
            } catch (error) {
                console.error('Error clearing read notifications:', error);
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
         * Set filters and optionally fetch
         */
        setFilters(filters, fetchAfter = false) {
            this.filters = { ...this.filters, ...filters };
            if (fetchAfter) {
                this.fetchNotifications({ page: 1 });
            }
        },

        /**
         * Clear all filters
         */
        clearFilters() {
            this.filters = {
                category: null,
                priority: null,
                readStatus: 'all',
                search: '',
            };
        },

        /**
         * Update notification preferences
         */
        updatePreferences(newPreferences) {
            this.preferences = { ...this.preferences, ...newPreferences };
            this.savePreferencesToStorage();
        },

        /**
         * Load preferences from localStorage
         */
        loadPreferences() {
            const saved = localStorage.getItem('notificationPreferences');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    this.preferences = { ...DEFAULT_PREFERENCES, ...parsed };
                } catch (e) {
                    console.error('[NotificationStore] Failed to parse preferences:', e);
                }
            }
        },

        /**
         * Save preferences to localStorage
         */
        savePreferencesToStorage() {
            localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
        },

        /**
         * Reset store state - CRITICAL for logout cleanup
         * Prevents notification data from persisting across user sessions
         */
        resetState() {
            this.notifications = [];
            this.loading = false;
            this.error = null;
            this.meta = {
                currentPage: 1,
                lastPage: 1,
                perPage: 20,
                total: 0,
            };
            this.filters = {
                category: null,
                priority: null,
                readStatus: 'all',
                search: '',
            };
            console.log('[NotificationStore] State reset - all notifications cleared');
        }
    },
    getters: {
        getNotifications: state => state.notifications,

        getUnreadNotifications: state => state.notifications.filter(n => !n.read_at),

        unreadCount: state => state.notifications.filter(n => !n.read_at).length,

        /**
         * Get notifications filtered by category
         */
        getNotificationsByCategory: (state) => (category) => {
            return state.notifications.filter(n => {
                const notifCategory = n.data?.category || n.category || 'general';
                return notifCategory === category;
            });
        },

        /**
         * Check if should show toast for a category
         */
        shouldShowToast: (state) => (category) => {
            const pref = state.preferences.categories[category];
            return state.preferences.showToast && pref?.enabled;
        },

        /**
         * Check if should play sound for a category
         */
        shouldPlaySound: (state) => (category) => {
            return state.preferences.playSound;
        },

        /**
         * Get notification stats
         */
        getStats: (state) => {
            const stats = {
                total: state.notifications.length,
                unread: 0,
                byCategory: {},
            };

            state.notifications.forEach(n => {
                if (!n.read_at) stats.unread++;

                const category = n.data?.category || n.category || 'general';
                stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
            });

            return stats;
        },

        isLoading: state => state.loading,
        hasError: state => !!state.error,
        getError: state => state.error,
        getMeta: state => state.meta,
        getFilters: state => state.filters,
        getPreferences: state => state.preferences,
    },
    persist: {
        key: 'notification-store',
        storage: localStorage,
        // Only persist notifications and preferences, not loading/error states
        paths: ['notifications', 'preferences'],
    }
});

<template>
  <div class="system-notifications-widget">
    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border spinner-border-sm" role="status"></div>
    </div>
    <div v-else>
      <div v-if="notifications.length === 0" class="text-center py-4 text-muted">
        <i class="ti ti-bell-off fs-1 mb-2 d-block"></i>
        <p class="mb-0">No new notifications</p>
      </div>
      <div v-else class="notification-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item d-flex align-items-start p-2 rounded mb-2"
          :class="{ 'unread': !notification.read_at }"
        >
          <div class="notification-icon me-3">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>
          <div class="notification-content flex-grow-1">
            <p class="mb-1">{{ notification.message }}</p>
            <small class="text-muted">{{ formatTime(notification.created_at) }}</small>
          </div>
          <button 
            v-if="!notification.read_at"
            class="btn btn-link btn-sm p-0"
            @click="markAsRead(notification.id)"
            title="Mark as read"
          >
            <i class="ti ti-check text-success"></i>
          </button>
        </div>
      </div>
      <div v-if="notifications.length > 0" class="text-center mt-3">
        <router-link to="/notifications" class="btn btn-outline-primary btn-sm">
          View All Notifications
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { notificationService } from '@/services/notification.service';

export default {
  name: 'SystemNotificationsWidget',
  props: {
    widget: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: true,
      notifications: [],
    };
  },
  async mounted() {
    await this.loadNotifications();
  },
  methods: {
    async loadNotifications() {
      this.loading = true;
      try {
        const response = await notificationService.getNotifications({ 
          per_page: 5,
          unread_only: false 
        });
        
        const data = response.data || response;
        this.notifications = (data.data || data || []).slice(0, 5).map(n => ({
          id: n.id,
          type: n.type || 'info',
          message: n.data?.message || n.message || n.title || 'Notification',
          read_at: n.read_at,
          created_at: n.created_at,
        }));
      } catch (error) {
        console.error('Error loading notifications:', error);
        this.notifications = [];
      } finally {
        this.loading = false;
      }
    },
    
    async markAsRead(id) {
      try {
        await notificationService.markAsRead(id);
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.read_at = new Date().toISOString();
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    
    getNotificationIcon(type) {
      const icons = {
        info: 'ti ti-info-circle text-info',
        success: 'ti ti-check-circle text-success',
        warning: 'ti ti-alert-triangle text-warning',
        error: 'ti ti-alert-circle text-danger',
        leave: 'ti ti-calendar-event text-primary',
        payroll: 'ti ti-currency-dollar text-success',
        employee: 'ti ti-user text-info',
        employee_action: 'ti ti-user text-info',
        grant_action: 'ti ti-file-dollar text-primary',
        grant_item_action: 'ti ti-briefcase text-primary',
        import_completed: 'ti ti-check-circle text-success',
        import_failed: 'ti ti-alert-circle text-danger',
      };
      return icons[type] || icons.info;
    },
    
    formatTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      // Less than 1 minute
      if (diff < 60000) return 'Just now';
      // Less than 1 hour
      if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
      // Less than 24 hours
      if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
      // Less than 7 days
      if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
  },
};
</script>

<style scoped>
.notification-item {
  background-color: #f8f9fa;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #e9ecef;
}

.notification-item.unread {
  background-color: #e7f1ff;
  border-left: 3px solid #0d6efd;
}

.notification-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.notification-content p {
  font-size: 0.875rem;
  line-height: 1.4;
}
</style>

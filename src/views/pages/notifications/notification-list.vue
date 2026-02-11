<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <div class="d-flex align-items-center">
          <index-breadcrumb :title="title" :text="text" :text1="text1" />
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="btn btn-primary d-flex align-items-center"
            :disabled="markingAllAsRead">
            <i class="ti ti-check me-2"></i>
            {{ markingAllAsRead ? 'Marking...' : 'Mark All as Read' }}
          </button>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            Notifications
            <span v-if="unreadCount > 0" class="badge bg-primary ms-2">{{ unreadCount }} unread</span>
          </h5>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading notifications...</p>
          </div>

          <div v-else-if="notifications.length === 0" class="text-center py-5">
            <div class="avatar avatar-lg mx-auto mb-3">
              <div
                class="avatar-initial bg-light rounded-circle d-flex align-items-center justify-content-center">
                <i class="ti ti-bell-off text-muted" style="font-size: 24px;"></i>
              </div>
            </div>
            <p class="text-muted mb-0">No notifications yet</p>
            <small class="text-muted">We'll notify you when something arrives!</small>
          </div>

          <div v-else class="notification-list">
            <router-link
              v-for="notification in notifications"
              :key="notification.id"
              :to="`/notifications/${notification.id}`"
              class="notification-item d-flex align-items-start p-3 mb-3 rounded border"
              :class="{ 'bg-light border-primary': !notification.read_at, 'bg-white': notification.read_at }"
              @click="handleNotificationClick(notification)">
              <div class="avatar avatar-sm me-3 flex-shrink-0">
                <div
                  class="avatar-initial rounded-circle d-flex align-items-center justify-content-center"
                  :class="getNotificationIconClass(notification.type || notification.data?.type)">
                  <i :class="getNotificationIcon(notification.type || notification.data?.type)"></i>
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <p class="mb-0 fw-medium text-dark">{{ getNotificationMessage(notification) }}</p>
                  <span v-if="!notification.read_at" class="badge bg-primary ms-2" style="font-size: 10px;">New</span>
                </div>
                <small class="text-muted">{{ formatNotificationDate(notification) }}</small>
                <div v-if="notification.data?.performed_by_name" class="mt-1">
                  <small class="text-muted">
                    <i class="ti ti-user me-1"></i>
                    By: {{ notification.data.performed_by_name }}
                  </small>
                </div>
              </div>
              <div class="ms-2">
                <i class="ti ti-chevron-right text-muted"></i>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { notificationService } from '@/services/notification.service';
import { formatDateTime } from '@/utils/date.utils';
import { useNotificationStore } from '@/stores/notificationStore';
import { message } from 'ant-design-vue';

export default {
  name: 'NotificationList',
  components: {
    indexBreadcrumb,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  },
  setup() {
    const notificationStore = useNotificationStore();
    return { notificationStore };
  },
  data() {
    return {
      title: 'Notifications',
      text: 'Notifications',
      text1: 'All Notifications',
      notifications: [],
      loading: true,
      markingAllAsRead: false,
    };
  },
  computed: {
    unreadCount() {
      return this.notifications.filter((n) => !n.read_at).length;
    },
  },
  async mounted() {
    await this.loadNotifications();
  },
  methods: {
    async loadNotifications() {
      this.loading = true;
      try {
        const response = await notificationService.getNotifications({ per_page: 50 });
        const data = response.data || response;
        this.notifications = Array.isArray(data) ? data : data.data || [];
      } catch (error) {
        console.error('Error loading notifications:', error);
        message.error('Failed to load notifications');
        this.notifications = [];
      } finally {
        this.loading = false;
      }
    },

    async markAllAsRead() {
      this.markingAllAsRead = true;
      try {
        await notificationService.markAllNotificationsRead();
        // Update local state
        this.notifications.forEach((notification) => {
          notification.read_at = new Date().toISOString();
        });
        message.success('All notifications marked as read');
        // Refresh notification store
        await this.notificationStore.fetchNotifications();
      } catch (error) {
        console.error('Error marking all as read:', error);
        message.error('Failed to mark all notifications as read');
      } finally {
        this.markingAllAsRead = false;
      }
    },

    handleNotificationClick(notification) {
      // Notification will be marked as read when viewing detail page
    },

    getNotificationMessage(notification) {
      if (notification.data && notification.data.message) {
        return notification.data.message;
      }
      if (notification.message) {
        return notification.message;
      }
      return 'New notification received';
    },

    formatNotificationDate(notification) {
      const date = notification.created_at || notification.finished_at;
      if (!date) return 'Just now';

      const notificationDate = new Date(date);
      const now = new Date();
      const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;

      return formatDateTime(notificationDate);
    },

    getNotificationIcon(type) {
      const icons = {
        info: 'ti ti-info-circle',
        success: 'ti ti-check-circle',
        warning: 'ti ti-alert-triangle',
        error: 'ti ti-alert-circle',
        leave: 'ti ti-calendar-event',
        payroll: 'ti ti-currency-dollar',
        employee: 'ti ti-user',
        employee_action: 'ti ti-user',
        grant_action: 'ti ti-file-dollar',
        grant_item_action: 'ti ti-briefcase',
        import_completed: 'ti ti-check-circle',
        import_failed: 'ti ti-alert-circle',
      };
      return icons[type] || 'ti ti-bell';
    },

    getNotificationIconClass(type) {
      const classes = {
        info: 'bg-info text-white',
        success: 'bg-success text-white',
        warning: 'bg-warning text-white',
        error: 'bg-danger text-white',
        leave: 'bg-primary text-white',
        payroll: 'bg-success text-white',
        employee: 'bg-info text-white',
        employee_action: 'bg-info text-white',
        grant_action: 'bg-primary text-white',
        grant_item_action: 'bg-primary text-white',
        import_completed: 'bg-success text-white',
        import_failed: 'bg-danger text-white',
      };
      return classes[type] || 'bg-primary text-white';
    },
  },
};
</script>

<style scoped>
.notification-item {
  text-decoration: none;
  transition: all 0.2s ease;
  display: block;
}

.notification-item:hover {
  background-color: #f8f9fa !important;
  transform: translateX(4px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-item-link {
  text-decoration: none;
  transition: all 0.2s ease;
  display: block;
}

.notification-item-link:hover {
  background-color: #f8f9fa !important;
  text-decoration: none;
}

.notification-item-link:hover .text-dark {
  color: var(--primary-color, #4a7fff) !important;
}
</style>


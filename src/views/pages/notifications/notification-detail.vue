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
          <router-link to="/notifications" class="btn btn-primary d-flex align-items-center">
            <i class="ti ti-arrow-left me-2"></i>Back to Notifications
          </router-link>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">Notification Details</h5>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading notification...</p>
          </div>

          <div v-else-if="error" class="alert alert-danger">
            <i class="ti ti-alert-circle me-2"></i>
            {{ error }}
          </div>

          <div v-else-if="notification" class="notification-detail">
            <!-- Notification Header -->
            <div class="d-flex align-items-start mb-4 pb-4 border-bottom">
              <div class="avatar avatar-lg me-3 flex-shrink-0">
                <div
                  class="avatar-initial rounded-circle d-flex align-items-center justify-content-center"
                  :class="getNotificationIconClass(notification.type)">
                  <i :class="getNotificationIcon(notification.type)"></i>
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <h4 class="mb-0">{{ getNotificationTitle(notification) }}</h4>
                  <span v-if="!notification.read_at" class="badge bg-primary">New</span>
                  <span v-else class="badge bg-secondary">Read</span>
                </div>
                <div class="d-flex align-items-center text-muted mb-2">
                  <i class="ti ti-clock me-1"></i>
                  <span>{{ formatNotificationDate(notification) }}</span>
                </div>
                <div v-if="notification.data?.performed_by_name" class="d-flex align-items-center text-muted">
                  <i class="ti ti-user me-1"></i>
                  <span>Action performed by: <strong>{{ notification.data.performed_by_name }}</strong></span>
                </div>
              </div>
            </div>

            <!-- Notification Message -->
            <div class="notification-message mb-4">
              <h6 class="mb-3">Message</h6>
              <p class="fs-16 mb-0">{{ getNotificationMessage(notification) }}</p>
            </div>

            <!-- Notification Details -->
            <div class="notification-details mb-4" v-if="hasAdditionalDetails(notification)">
              <h6 class="mb-3">Details</h6>
              <div class="row">
                <div v-if="notification.data?.type" class="col-md-6 mb-3">
                  <div class="detail-item">
                    <label class="text-muted small">Type</label>
                    <p class="mb-0 fw-medium">{{ formatNotificationType(notification.data.type) }}</p>
                  </div>
                </div>
                <div v-if="notification.data?.action" class="col-md-6 mb-3">
                  <div class="detail-item">
                    <label class="text-muted small">Action</label>
                    <p class="mb-0 fw-medium">{{ formatAction(notification.data.action) }}</p>
                  </div>
                </div>
                <div v-if="notification.data?.grant_code" class="col-md-6 mb-3">
                  <div class="detail-item">
                    <label class="text-muted small">Grant Code</label>
                    <p class="mb-0 fw-medium">{{ notification.data.grant_code }}</p>
                  </div>
                </div>
                <div v-if="notification.data?.grant_name" class="col-md-6 mb-3">
                  <div class="detail-item">
                    <label class="text-muted small">Grant Name</label>
                    <p class="mb-0 fw-medium">{{ notification.data.grant_name }}</p>
                  </div>
                </div>
                <div v-if="notification.data?.grant_item_position" class="col-md-6 mb-3">
                  <div class="detail-item">
                    <label class="text-muted small">Position Title</label>
                    <p class="mb-0 fw-medium">{{ notification.data.grant_item_position }}</p>
                  </div>
                </div>
                <div v-if="notification.data?.grant_item_id" class="col-md-6 mb-3">
                  <div class="detail-item">
                    <label class="text-muted small">Grant Item ID</label>
                    <p class="mb-0 fw-medium">{{ notification.data.grant_item_id }}</p>
                  </div>
                </div>
                <div v-if="notification.data?.employee_name" class="col-md-6 mb-3">
                  <div class="detail-item">
                    <label class="text-muted small">Employee Name</label>
                    <p class="mb-0 fw-medium">{{ notification.data.employee_name }}</p>
                  </div>
                </div>
                <div v-if="notification.data?.employee_staff_id" class="col-md-6 mb-3">
                  <div class="detail-item">
                    <label class="text-muted small">Staff ID</label>
                    <p class="mb-0 fw-medium">{{ notification.data.employee_staff_id }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="notification-actions d-flex gap-2">
              <router-link
                v-if="notification.data?.grant_id"
                :to="`/grant/details/${notification.data.grant_id}`"
                class="btn btn-primary">
                <i class="ti ti-eye me-2"></i>View Grant
              </router-link>
              <router-link
                v-if="notification.data?.employee_id"
                :to="`/employees/details/${notification.data.employee_id}`"
                class="btn btn-primary">
                <i class="ti ti-user me-2"></i>View Employee
              </router-link>
              <router-link
                v-if="notification.data?.grant_item_id && notification.data?.grant_id"
                :to="`/grant/details/${notification.data.grant_id}`"
                class="btn btn-primary">
                <i class="ti ti-briefcase me-2"></i>View Grant Position
              </router-link>
              <button
                v-if="!notification.read_at"
                @click="markAsRead"
                class="btn btn-success"
                :disabled="markingAsRead">
                <i class="ti ti-check me-2"></i>
                {{ markingAsRead ? 'Marking...' : 'Mark as Read' }}
              </button>
            </div>
          </div>

          <div v-else class="text-center py-5">
            <div class="avatar avatar-lg mx-auto mb-3">
              <div
                class="avatar-initial bg-light rounded-circle d-flex align-items-center justify-content-center">
                <i class="ti ti-alert-circle text-muted" style="font-size: 24px;"></i>
              </div>
            </div>
            <p class="text-muted mb-0">Notification not found</p>
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
import { message } from 'ant-design-vue';

export default {
  name: 'NotificationDetail',
  components: {
    indexBreadcrumb,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  },
  data() {
    return {
      title: 'Notifications',
      text: 'Notifications',
      text1: 'Notification Detail',
      notification: null,
      loading: true,
      error: null,
      markingAsRead: false,
      notificationId: null,
    };
  },
  async mounted() {
    await this.loadNotification();
  },
  methods: {
    async loadNotification() {
      this.loading = true;
      this.error = null;

      try {
        this.notificationId = this.$route.params.id;
        
        if (!this.notificationId) {
          throw new Error('Notification ID is required');
        }

        const response = await notificationService.getNotificationById(this.notificationId);
        
        const data = response.data || response;
        this.notification = data;

        // Ensure notification has an ID (Laravel notifications use 'id' field)
        if (!this.notification.id) {
          // If the response structure is different, try to extract ID
          this.notification.id = this.notificationId;
        }

        // Mark as read if not already read
        if (!this.notification.read_at) {
          await this.markAsRead();
        }
      } catch (error) {
        console.error('Error loading notification:', error);
        this.error = error.message || 'Failed to load notification';
        message.error('Failed to load notification');
      } finally {
        this.loading = false;
      }
    },

    async markAsRead() {
      // Always use notificationId from route params (most reliable)
      const idToUse = this.notificationId || this.notification?.id;
      
      if (!idToUse) {
        console.error('Cannot mark as read: notification ID is missing');
        return;
      }

      if (this.notification?.read_at || this.markingAsRead) return;

      this.markingAsRead = true;
      try {
        await notificationService.markAsRead(idToUse);
        if (this.notification) {
          this.notification.read_at = new Date().toISOString();
        }
        message.success('Notification marked as read');
        
        // Emit event to update notification store
        this.$root.$emit('notification-read', idToUse);
      } catch (error) {
        console.error('Error marking notification as read:', error);
        message.error('Failed to mark notification as read');
      } finally {
        this.markingAsRead = false;
      }
    },

    getNotificationMessage(notification) {
      if (notification.data && notification.data.message) {
        return notification.data.message;
      }
      if (notification.message) {
        return notification.message;
      }
      return 'No message available';
    },

    getNotificationTitle(notification) {
      if (notification.data && notification.data.title) {
        return notification.data.title;
      }
      return this.getNotificationMessage(notification);
    },

    formatNotificationDate(notification) {
      const date = notification.created_at || notification.finished_at;
      if (!date) return 'Just now';

      const notificationDate = new Date(date);
      const now = new Date();
      const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

      return notificationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    getNotificationIcon(type) {
      const icons = {
        info: 'ti ti-info-circle',
        success: 'ti ti-check-circle',
        warning: 'ti ti-alert-triangle',
        error: 'ti ti-alert-circle',
        leave: 'ti ti-calendar-event',
        grant_item_action: 'ti ti-briefcase',
        payroll: 'ti ti-currency-dollar',
        employee: 'ti ti-user',
        employee_action: 'ti ti-user',
        grant_action: 'ti ti-file-dollar',
        import_completed: 'ti ti-check-circle',
        import_failed: 'ti ti-alert-circle',
      };
      return icons[type] || icons.info;
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
        import_completed: 'bg-success text-white',
        import_failed: 'bg-danger text-white',
      };
      return classes[type] || 'bg-primary text-white';
    },

    formatNotificationType(type) {
      if (!type) return 'N/A';
      return type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    formatAction(action) {
      if (!action) return 'N/A';
      return action.charAt(0).toUpperCase() + action.slice(1);
    },

    hasAdditionalDetails(notification) {
      return (
        notification.data?.type ||
        notification.data?.action ||
        notification.data?.grant_code ||
        notification.data?.grant_name ||
        notification.data?.grant_item_position ||
        notification.data?.grant_item_id ||
        notification.data?.employee_name ||
        notification.data?.employee_staff_id
      );
    },
  },
};
</script>

<style scoped>
.notification-detail {
  max-width: 800px;
  margin: 0 auto;
}

.notification-message {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color, #4a7fff);
}

.notification-details {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.detail-item label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.detail-item p {
  font-size: 1rem;
}

.notification-actions {
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.avatar-lg {
  width: 64px;
  height: 64px;
}

.avatar-initial {
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
}
</style>


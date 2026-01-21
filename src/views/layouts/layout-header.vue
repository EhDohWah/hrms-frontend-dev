<template>
  <div class="header">
    <div class="main-header">
      <div class="header-left">
        <!-- New Normal Logo -->
        <div class="logo-wrapper">
          <router-link :to="dashboardRoute" class="logo logo-normal">
            <div class="logo-container">
              <h1 class="logo-title">HRMS</h1>
              <span class="logo-tagline">SMRU / BHF</span>
            </div>
          </router-link>
        </div>

        <router-link :to="dashboardRoute" class="dark-logo">
          <span class="logo-text">HRMS</span>
        </router-link>
      </div>

      <a id="mobile_btn" class="mobile_btn" @click="toggleSidebar1" href="javascript:void(0);">
        <span class="bar-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </a>

      <div class="header-user">
        <div class="nav user-menu nav-list">
          <div class="me-auto d-flex align-items-center" id="header-search">
            <a id="toggle_btn" href="javascript:void(0);" @click="toggleSidebar" class="btn btn-menubar me-1">
              <i class="ti ti-arrow-bar-to-left"></i>
            </a>
            <!-- Search -->
            <div class="input-group input-group-flat d-inline-flex me-1">
              <span class="input-icon-addon">
                <i class="ti ti-search"></i>
              </span>
              <input type="text" class="form-control" placeholder="Search in HRMS" />
              <span class="input-group-text">
                <kbd>CTRL + / </kbd>
              </span>
            </div>
            <!-- /Search -->

          </div>

          <div class="d-flex align-items-center">
            <div class="me-1">
              <a href="javascript:void(0);" class="btn btn-menubar btnFullscreen" @click="initFullScreen">
                <i class="ti ti-maximize"></i>
              </a>
            </div>

            <!-- Notification Dropdown - Desktop Only -->
            <div class="me-1 notification_item">
              <a href="javascript:void(0);"
                 class="btn btn-menubar notif-bell-btn"
                 id="notification_popup"
                 data-bs-toggle="dropdown"
                 aria-label="Notifications">
                <i class="ti ti-bell"></i>
                <span v-if="unreadCount > 0" class="notif-badge">
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
              </a>

              <!-- Redesigned Notification Dropdown -->
              <div class="dropdown-menu dropdown-menu-end notification-dropdown">
                <!-- Header -->
                <div class="notif-header">
                  <div class="notif-header-top">
                    <h4 class="notif-title">Notifications</h4>
                    <button
                      v-if="unreadCount > 0"
                      type="button"
                      class="notif-mark-read"
                      @click.stop="markAllAsRead"
                      :disabled="isMarkingAllRead">
                      {{ isMarkingAllRead ? 'Marking...' : 'Mark all as read' }}
                    </button>
                  </div>

                  <!-- Tabs -->
                  <div class="notif-tabs">
                    <button
                      type="button"
                      class="notif-tab"
                      :class="{ active: activeNotifTab === 'all' }"
                      @click.stop="activeNotifTab = 'all'">
                      All
                    </button>
                    <button
                      type="button"
                      class="notif-tab"
                      :class="{ active: activeNotifTab === 'unread' }"
                      @click.stop="activeNotifTab = 'unread'">
                      Unread
                      <span v-if="unreadCount > 0" class="tab-count">{{ unreadCount }}</span>
                    </button>
                  </div>
                </div>

                <!-- Content -->
                <div class="notif-content">
                  <!-- Notification List -->
                  <ul v-if="filteredNotifications.length" class="notif-list">
                    <li v-for="notification in filteredNotifications" :key="notification.id">
                      <router-link
                        :to="`/notifications/${notification.id}`"
                        class="notif-item"
                        :class="{ unread: !notification.read_at }"
                        @click="handleNotificationClick(notification)">
                        <div class="notif-item-inner">
                          <!-- User Avatar -->
                          <div class="notif-avatar">
                            <img
                              :src="getUserAvatar(notification)"
                              :alt="getPerformedByName(notification)"
                              class="avatar-img"
                              @error="handleAvatarError($event, notification)" />
                            <!-- Category Badge on Avatar -->
                            <span
                              class="category-badge"
                              :class="getNotificationCategory(notification)">
                              <i :class="getCategoryIcon(notification)"></i>
                            </span>
                          </div>

                          <!-- Content -->
                          <div class="notif-body">
                            <p class="notif-text" v-html="formatNotificationText(notification)"></p>
                            <span class="notif-time">
                              <i class="ti ti-clock"></i>
                              {{ formatNotificationDate(notification) }}
                            </span>
                          </div>

                          <!-- Unread Dot -->
                          <span v-if="!notification.read_at" class="notif-unread-dot"></span>
                        </div>
                      </router-link>
                    </li>
                  </ul>

                  <!-- Empty State -->
                  <div v-else class="notif-empty">
                    <div class="notif-empty-icon">
                      <i class="ti ti-bell-off"></i>
                    </div>
                    <h5 class="notif-empty-title">
                      {{ activeNotifTab === 'unread' ? 'All caught up!' : 'No notifications yet' }}
                    </h5>
                    <p class="notif-empty-text">
                      {{ activeNotifTab === 'unread' ? 'You have no unread notifications.' : "We'll notify you when something arrives!" }}
                    </p>
                  </div>
                </div>

                <!-- Footer -->
                <div v-if="notifications.length" class="notif-footer">
                  <router-link
                    to="/notifications"
                    class="notif-view-all"
                    @click="closeDropdown">
                    View all notifications
                  </router-link>
                </div>
              </div>
            </div>

            <div class="dropdown profile-dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                <span class="avatar avatar-sm online">
                  <img :src="profilePictureUrl || defaultAvatarUrl" alt="Profile" class="img-fluid rounded-circle" @error="handleImageError" />
                </span>
              </a>
              <div class="dropdown-menu shadow-none">
                <div class="card mb-0">
                  <div class="card-header">
                    <div class="d-flex align-items-center">
                      <span class="avatar avatar-lg me-2 avatar-rounded">
                        <img :src="profilePictureUrl || defaultAvatarUrl" alt="Profile" @error="handleImageError" />
                      </span>
                      <div>
                        <h5 class="mb-0">{{ username }}</h5>
                        <p class="fs-12 fw-medium mb-0">{{ email }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <router-link class="dropdown-item d-inline-flex align-items-center p-0 py-2" to="/pages/profile">
                      <i class="ti ti-user-circle me-1"></i>My Profile
                    </router-link>
                    <router-link class="dropdown-item d-inline-flex align-items-center p-0 py-2"
                      to="/general-settings/profile-settings">
                      <i class="ti ti-settings me-1"></i>Settings
                    </router-link>
                  </div>
                  <div class="card-footer">
                    <a class="dropdown-item d-inline-flex align-items-center p-0 py-2" href="#"
                      @click.prevent="handleLogout">
                      <i class="ti ti-login me-2"></i>Logout
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="dropdown mobile-user-menu">
        <a href="javascript:void(0);" class="nav-link dropdown-toggle" data-bs-toggle="dropdown"
          aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
        <div class="dropdown-menu dropdown-menu-end">
          <!-- Notifications Link with Badge (Mobile Only) -->
          <router-link class="dropdown-item mobile-notif-link" to="/notifications">
            <span><i class="ti ti-bell me-2"></i>Notifications</span>
            <span v-if="unreadCount > 0" class="mobile-notif-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
          </router-link>
          <div class="dropdown-divider"></div>
          <router-link class="dropdown-item" to="/pages/profile">My Profile</router-link>
          <router-link class="dropdown-item" to="/general-settings/profile-settings">Settings</router-link>
          <a class="dropdown-item" href="#" @click.prevent="handleLogout">Logout</a>
        </div>
      </div>
      <!-- /Mobile Menu -->
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import sideBarData from "@/assets/json/sidebar-menuone.json";
import { Modal, notification } from 'ant-design-vue'
import { notification as antNotification } from 'ant-design-vue';
import eventBus from '@/plugins/eventBus';
import { disconnectEcho, getEcho } from '@/plugins/echo';

export default {
  data() {
    return {
      sideBarData: sideBarData,
      openMenuItem: null,
      openSubmenuOneItem: null,
      route_array: [],
      notificationStore: null, // Pinia store instance
      // Notification dropdown state
      activeNotifTab: 'all', // 'all' or 'unread'
      isMarkingAllRead: false,
    };
  },
  setup() {
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();
    // Use computed properties to reactively access user data from the store
    const username = computed(() => {
      return authStore.user && authStore.user.name ? authStore.user.name : 'User';
    });

    const email = computed(() => {
      return authStore.user && authStore.user.email ? authStore.user.email : 'user@example.com';
    });

    const profilePictureUrl = computed(() => {
      if (authStore.user && authStore.user.profile_picture) {
        // Add cache-busting timestamp to force reload after update
        const timestamp = authStore.user.profile_picture_updated_at || '';
        const baseUrl = `${import.meta.env.VITE_PUBLIC_URL}/storage/${authStore.user.profile_picture}`;
        return timestamp ? `${baseUrl}?t=${timestamp}` : baseUrl;
      }
      return null; // Fallback handled in template
    });

    // Default avatar URL for fallback
    const defaultAvatarUrl = computed(() => {
      // Generate initials-based placeholder or use default image
      const name = authStore.user?.name || 'User';
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      // Return a data URI for a simple avatar with initials
      return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect fill="%236366f1" width="40" height="40" rx="20"/><text x="50%" y="50%" dy=".35em" fill="white" font-family="Arial" font-size="16" text-anchor="middle">${initials}</text></svg>`)}`;
    });

    // Make sure the store has loaded the user data
    if (!authStore.user) {
      authStore.updateUserData();
    }

    return { username, email, profilePictureUrl, defaultAvatarUrl, authStore, notificationStore };
  },

  created() {
    // Initialize notification store and fetch notifications
    this.notificationStore.fetchNotifications();

    // Setup WebSocket listener for real-time notifications
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    if (userId && getEcho()) {
      getEcho().private(`App.Models.User.${userId}`)
        .notification((notif) => {
          console.log('[Echo] Notification received:', notif);

          // Ensure the notification has the proper structure for Laravel notifications
          const formattedNotif = {
            id: notif.id || Date.now().toString(),
            data: notif.data || { message: notif.message },
            read_at: null,
            created_at: new Date().toISOString(),
            ...notif
          };

          // Add to store
          this.notificationStore.addNotification(formattedNotif);

          // Get category-specific configuration
          const category = this.getNotificationCategory(formattedNotif);
          const categoryConfig = this.getCategoryConfig()[category] || this.getCategoryConfig().general;

          // Show toast notification
          notification.open({
            message: `${categoryConfig.icon} ${categoryConfig.label}`,
            description: this.getNotificationMessage(formattedNotif),
            placement: 'topRight',
            duration: 5,
            style: {
              borderLeft: `4px solid ${categoryConfig.color}`,
            },
            onClick: () => {
              console.log('Notification Clicked!');
              // Navigate to notification detail
              this.$router.push(`/notifications/${formattedNotif.id}`);
              notification.destroy();
            },
          });

          console.log('Notification Event Fired!');
          eventBus.emit('notification-clicked', formattedNotif);
        });
    }
  },

  beforeUnmount() {
    // Clean up Echo listener
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;
    if (userId && window.Echo) {
      window.Echo.leave(`private-App.Models.User.${userId}`);
    }

    // Clean up event listeners
    document.removeEventListener("mouseover", this.handleMouseover);
  },

  mounted() {
    this.initMouseoverListener();

    // Check the persisted flag and show notification if it's true
    if (this.authStore.justLoggedIn) {
      notification.success({
        message: `Welcome back, ${this.username}!`,
        description: 'Glad to see you again.',
        placement: 'topRight',
      });
      // Reset the flag in both the store and localStorage
      this.authStore.justLoggedIn = false;
    }

    // NOTE: No custom animation JavaScript needed - using native Bootstrap
    // dropdown with CSS transitions for better performance and consistency
  },

  computed: {
    // Use store getters for notifications
    notifications() {
      return this.notificationStore.getNotifications;
    },
    unreadCount() {
      return this.notificationStore.unreadCount;
    },
    // Filter notifications based on active tab
    filteredNotifications() {
      if (this.activeNotifTab === 'unread') {
        return this.notifications.filter(n => !n.read_at);
      }
      return this.notifications;
    },
    dashboardRoute() {
      return '/dashboard/';
    }
  },

  methods: {
    /**
     * Handle image load error - fallback to default avatar
     * This catches 404s and other loading failures
     */
    handleImageError(event) {
      const name = this.authStore.user?.name || 'User';
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      event.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect fill="#6366f1" width="40" height="40" rx="20"/><text x="50%" y="50%" dy=".35em" fill="white" font-family="Arial" font-size="16" text-anchor="middle">${initials}</text></svg>`)}`;
    },

    // Use store action for marking all as read
    async markAllAsRead() {
      if (this.isMarkingAllRead) return;

      this.isMarkingAllRead = true;
      try {
        await this.notificationStore.markAllNotificationsRead();
        notification.success({
          message: 'Success',
          description: 'All notifications marked as read',
          placement: 'topRight',
        });
      } catch (error) {
        console.error('Failed to mark all as read:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to mark notifications as read',
          placement: 'topRight',
        });
      } finally {
        this.isMarkingAllRead = false;
      }
    },

    getNotificationMessage(notification) {
      // Try different possible message fields
      if (notification.data && notification.data.message) {
        return notification.data.message;
      }
      if (notification.message) {
        return notification.message;
      }
      if (notification.data && notification.data.title) {
        return notification.data.title;
      }
      if (notification.type) {
        // Convert notification type to readable format
        return notification.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      }
      return 'New notification received';
    },

    /**
     * Get notification category configuration
     * Aligned with backend NotificationCategory enum
     */
    getCategoryConfig() {
      return {
        dashboard: { label: 'Dashboard', icon: '📊', color: '#1890ff' },
        grants: { label: 'Grants', icon: '🎯', color: '#52c41a' },
        recruitment: { label: 'Recruitment', icon: '👔', color: '#722ed1' },
        employee: { label: 'Employee', icon: '👤', color: '#1890ff' },
        holidays: { label: 'Holidays', icon: '🏖️', color: '#13c2c2' },
        leaves: { label: 'Leaves', icon: '📅', color: '#1890ff' },
        travel: { label: 'Travel', icon: '✈️', color: '#2f54eb' },
        attendance: { label: 'Attendance', icon: '⏰', color: '#52c41a' },
        training: { label: 'Training', icon: '📚', color: '#fa8c16' },
        resignation: { label: 'Resignation', icon: '🚪', color: '#faad14' },
        termination: { label: 'Termination', icon: '⛔', color: '#f5222d' },
        payroll: { label: 'Payroll', icon: '💰', color: '#52c41a' },
        lookups: { label: 'Lookups', icon: '📋', color: '#8c8c8c' },
        organization: { label: 'Organization', icon: '🏢', color: '#1890ff' },
        user_management: { label: 'User Management', icon: '👥', color: '#722ed1' },
        reports: { label: 'Reports', icon: '📈', color: '#52c41a' },
        file_uploads: { label: 'File Uploads', icon: '📁', color: '#52c41a' },
        recycle_bin: { label: 'Recycle Bin', icon: '🗑️', color: '#8c8c8c' },
        import: { label: 'Import', icon: '📊', color: '#52c41a' },
        system: { label: 'System', icon: '⚠️', color: '#faad14' },
        general: { label: 'Notification', icon: '🔔', color: '#8c8c8c' },
      };
    },

    /**
     * Get notification category from notification data
     */
    getNotificationCategory(notification) {
      // Check data.category first (from backend)
      if (notification.data?.category) {
        return notification.data.category;
      }
      // Check top-level category
      if (notification.category) {
        return notification.category;
      }
      // Infer from type field
      const type = notification.data?.type || notification.type || '';
      if (type.includes('employee')) return 'employee';
      if (type.includes('grant')) return 'grants';
      if (type.includes('import')) return 'import';
      if (type.includes('payroll')) return 'payroll';
      if (type.includes('leave')) return 'leaves';
      return 'general';
    },

    /**
     * Get notification icon emoji
     */
    getNotificationIcon(notification) {
      const category = this.getNotificationCategory(notification);
      // First check if backend provided the icon
      if (notification.data?.category_icon) {
        return notification.data.category_icon;
      }
      const config = this.getCategoryConfig()[category] || this.getCategoryConfig().general;
      return config.icon;
    },

    /**
     * Get notification color
     */
    getNotificationColor(notification) {
      const category = this.getNotificationCategory(notification);
      // First check if backend provided the color
      if (notification.data?.category_color) {
        return notification.data.category_color;
      }
      const config = this.getCategoryConfig()[category] || this.getCategoryConfig().general;
      return config.color;
    },

    /**
     * Get notification category label
     */
    getNotificationCategoryLabel(notification) {
      const category = this.getNotificationCategory(notification);
      // First check if backend provided the label
      if (notification.data?.category_label) {
        return notification.data.category_label;
      }
      const config = this.getCategoryConfig()[category] || this.getCategoryConfig().general;
      return config.label;
    },

    /**
     * Get user avatar URL for notification
     * Prioritizes: performed_by_avatar > UI Avatars API > system default
     */
    getUserAvatar(notification) {
      // Try to get avatar from notification data (if backend provides it)
      if (notification.data?.performed_by_avatar) {
        return `${import.meta.env.VITE_PUBLIC_URL}/storage/${notification.data.performed_by_avatar}`;
      }

      // Generate avatar using UI Avatars API with user's name
      const name = this.getPerformedByName(notification);
      if (name && name !== 'System') {
        const encodedName = encodeURIComponent(name);
        return `https://ui-avatars.com/api/?name=${encodedName}&background=6366f1&color=fff&size=96&font-size=0.4&bold=true`;
      }

      // System avatar for automated notifications
      return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect fill="#6b7280" width="48" height="48" rx="24"/><path fill="white" d="M24 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 18c-4.42 0-8-1.79-8-4v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2c0 2.21-3.58 4-8 4z"/></svg>`)}`;
    },

    /**
     * Extract who performed the action from notification
     */
    getPerformedByName(notification) {
      // Try different possible fields
      if (notification.data?.performed_by_name) {
        return notification.data.performed_by_name;
      }
      if (notification.data?.user_name) {
        return notification.data.user_name;
      }
      if (notification.data?.actor_name) {
        return notification.data.actor_name;
      }
      // System notification
      return 'System';
    },

    /**
     * Format notification text with highlighted user and object names
     * Returns HTML string for v-html binding
     */
    formatNotificationText(notification) {
      const userName = this.getPerformedByName(notification);
      const action = this.getActionVerb(notification);
      const objectInfo = this.getObjectInfo(notification);

      // Build formatted message
      let text = '';

      // Add user name (highlighted)
      if (userName && userName !== 'System') {
        text += `<span class="notif-user">${this.escapeHtml(userName)}</span> `;
      }

      // Add action verb
      text += action;

      // Add object info if available
      if (objectInfo) {
        text += ` <span class="notif-object">${this.escapeHtml(objectInfo)}</span>`;
      }

      return text || this.getNotificationMessage(notification);
    },

    /**
     * Convert action type to human-readable verb
     */
    getActionVerb(notification) {
      const action = notification.data?.action || '';
      const type = notification.data?.type || '';

      // Map common actions to verbs
      const actionMap = {
        created: 'created',
        updated: 'updated',
        deleted: 'deleted',
        approved: 'approved',
        rejected: 'rejected',
        submitted: 'submitted',
        assigned: 'assigned',
        completed: 'completed',
        cancelled: 'cancelled',
        restored: 'restored',
      };

      if (actionMap[action]) {
        return actionMap[action];
      }

      // Try to infer from type
      if (type.includes('created')) return 'created';
      if (type.includes('updated')) return 'updated';
      if (type.includes('deleted')) return 'deleted';

      return 'made changes to';
    },

    /**
     * Get object info (grant name, employee name, etc.)
     */
    getObjectInfo(notification) {
      const data = notification.data || {};

      // Grant notifications
      if (data.grant_name) {
        const code = data.grant_code ? ` (${data.grant_code})` : '';
        return `grant ${data.grant_name}${code}`;
      }

      // Employee notifications
      if (data.employee_name) {
        return `employee ${data.employee_name}`;
      }

      // Leave notifications
      if (data.leave_type) {
        return `${data.leave_type} leave request`;
      }

      // Generic object
      if (data.object_name) {
        return data.object_name;
      }

      return '';
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /**
     * Get Tabler icon class for category badge
     */
    getCategoryIcon(notification) {
      const category = this.getNotificationCategory(notification);

      const iconMap = {
        grants: 'ti ti-target',
        employee: 'ti ti-user',
        payroll: 'ti ti-cash',
        leaves: 'ti ti-calendar',
        attendance: 'ti ti-clock',
        recruitment: 'ti ti-briefcase',
        training: 'ti ti-book',
        system: 'ti ti-settings',
        general: 'ti ti-bell',
      };

      return iconMap[category] || iconMap.general;
    },

    /**
     * Handle avatar load error - fallback to generated avatar
     */
    handleAvatarError(event, notification) {
      const name = this.getPerformedByName(notification);
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      event.target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect fill="#6366f1" width="48" height="48" rx="24"/><text x="50%" y="50%" dy=".35em" fill="white" font-family="Arial" font-size="18" text-anchor="middle">${initials}</text></svg>`)}`;
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

      // For older notifications, show the actual date
      return notificationDate.toLocaleDateString();
    },

    handleNotificationClick(notification) {
      // Close the dropdown when a notification is clicked
      this.closeDropdown();
    },

    closeDropdown() {
      // Close Bootstrap dropdown
      const notificationButton = document.getElementById('notification_popup');
      if (notificationButton) {
        const dropdown = window.bootstrap?.Dropdown?.getInstance(notificationButton);
        if (dropdown) {
          dropdown.hide();
          // Remove focus to prevent stuck hover state
          notificationButton.blur();
        }
      }
    },

    /**
     * Play notification sound for high priority notifications
     */
    playNotificationSound() {
      try {
        // Use Web Audio API for better browser support
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const audioCtx = new AudioContext();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          oscillator.frequency.value = 440; // A4 note
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.3);
        }
      } catch (error) {
        console.warn('[Notification] Sound play failed:', error);
      }
    },

    toggleSidebar1() {
      const body = document.body;
      body.classList.toggle("slide-nav");
    },
    toggleSidebar() {
      const body = document.body;
      body.classList.toggle("mini-sidebar");
    },

    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },

    initMouseoverListener() {
      document.addEventListener("mouseover", this.handleMouseover);
    },
    handleMouseover(e) {
      e.stopPropagation();

      const body = document.body;
      const toggleBtn = document.getElementById("toggle_btn");

      if (body.classList.contains("mini-sidebar") && this.isElementVisible(toggleBtn)) {
        const target = e.target.closest(".sidebar, .header-left");

        if (target) {
          body.classList.add("expand-menu");
          this.slideDownSubmenu();
        } else {
          body.classList.remove("expand-menu");
          this.slideUpSubmenu();
        }

        e.preventDefault();
      }
    },
    isElementVisible(element) {
      return element.offsetWidth > 0 || element.offsetHeight > 0;
    },
    slideDownSubmenu() {
      const subdropPlusUl = document.getElementsByClassName("subdrop");
      for (let i = 0; i < subdropPlusUl.length; i++) {
        const submenu = subdropPlusUl[i].nextElementSibling;
        if (submenu && submenu.tagName.toLowerCase() === "ul") {
          submenu.style.display = "block";
        }
      }
    },
    slideUpSubmenu() {
      const subdropPlusUl = document.getElementsByClassName("subdrop");
      for (let i = 0; i < subdropPlusUl.length; i++) {
        const submenu = subdropPlusUl[i].nextElementSibling;
        if (submenu && submenu.tagName.toLowerCase() === "ul") {
          submenu.style.display = "none";
        }
      }
    },
    expandSubMenus(menu) {
      this.sideBarData.forEach((item) => {
        item.menu.forEach((subMenu) => {
          if (subMenu !== menu) {
            subMenu.showSubRoute = false;
          }
        });
      });
      menu.showSubRoute = !menu.showSubRoute;
    },
    openMenu(menu) {
      this.openMenuItem = this.openMenuItem === menu ? null : menu;
    },
    openSubmenuOne(subMenus) {
      this.openSubmenuOneItem = this.openSubmenuOneItem === subMenus ? null : subMenus;
    },
    async handleLogout() {
      try {
        await new Promise((resolve) => {
          Modal.confirm({
            title: 'Are you sure?',
            content: 'You will be logged out of the system',
            centered: true,
            okText: 'Yes, logout',
            cancelText: 'Cancel',
            onOk: async () => {
              disconnectEcho();
              const authStore = useAuthStore();
              await authStore.logout();
              localStorage.removeItem('intendedRoute');
              this.$router.push('/login');
              resolve();
            },
            onCancel: () => {
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect to login page even if API call fails
        localStorage.removeItem('intendedRoute');
        this.$router.push('/login');
      }
    }
  },
};
</script>

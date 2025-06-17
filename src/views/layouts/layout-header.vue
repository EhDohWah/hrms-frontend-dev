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

            <div class="me-1 notification_item">
              <a href="javascript:void(0);" class="btn btn-menubar position-relative me-1" id="notification_popup"
                data-bs-toggle="dropdown">
                <i class="ti ti-bell"></i>
                <!-- Badge with count for unread notifications -->
                <span v-if="unreadCount > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style="font-size: 10px; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
              </a>
              <div class="dropdown-menu dropdown-menu-end notification-dropdown p-4">
                <div class="d-flex align-items-center justify-content-between border-bottom p-0 pb-3 mb-3">
                  <h4 class="notification-title">Notifications ({{ unreadCount }})</h4>
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="text-primary fs-15 me-3 lh-1" @click="markAllAsRead"
                      v-if="unreadCount > 0">Mark all as read</a>
                    <div class="dropdown">
                      <a href="javascript:void(0);" class="bg-white dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="ti ti-calendar-due me-1"></i>Today
                      </a>
                      <ul class="dropdown-menu mt-2 p-3">
                        <li>
                          <a href="javascript:void(0);" class="dropdown-item rounded-1">
                            This Week
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" class="dropdown-item rounded-1">
                            Last Week
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" class="dropdown-item rounded-1">
                            Last Month
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="noti-content">
                  <div v-if="notifications.length" class="d-flex flex-column">
                    <div v-for="(notification, idx) in notifications" :key="idx" class="border-bottom mb-3 pb-3"
                      :class="{ 'bg-light': !notification.read_at }">
                      <div class="d-flex">
                        <div class="avatar avatar-sm me-3 flex-shrink-0">
                          <div
                            class="avatar-initial bg-primary rounded-circle d-flex align-items-center justify-content-center">
                            <i class="ti ti-bell text-white"></i>
                          </div>
                        </div>
                        <div class="flex-grow-1">
                          <p class="mb-1 fw-medium">{{ getNotificationMessage(notification) }}</p>
                          <small class="text-muted">{{ formatNotificationDate(notification) }}</small>
                          <span v-if="!notification.read_at" class="badge bg-primary ms-2"
                            style="font-size: 10px;">New</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-4">
                    <div class="avatar avatar-lg mx-auto mb-3">
                      <div
                        class="avatar-initial bg-light rounded-circle d-flex align-items-center justify-content-center">
                        <i class="ti ti-bell-off text-muted" style="font-size: 24px;"></i>
                      </div>
                    </div>
                    <p class="text-muted mb-0">No notifications yet</p>
                    <small class="text-muted">We'll notify you when something arrives!</small>
                  </div>
                </div>

                <div class="d-flex p-0" v-if="notifications.length">
                  <a href="javascript:void(0);" class="btn btn-light w-100 me-2" data-bs-toggle="collapse"
                    data-bs-target="#notification-dropdown">Close</a>
                  <router-link to="/crm/activity" class="btn btn-primary w-100">View All</router-link>
                </div>
              </div>
            </div>

            <div class="dropdown profile-dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                <span class="avatar avatar-sm online">
                  <img :src="profilePictureUrl" alt="Img" class="img-fluid rounded-circle" />
                </span>
              </a>
              <div class="dropdown-menu shadow-none">
                <div class="card mb-0">
                  <div class="card-header">
                    <div class="d-flex align-items-center">
                      <span class="avatar avatar-lg me-2 avatar-rounded">
                        <img :src="profilePictureUrl" alt="img" />
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
          <router-link class="dropdown-item" to="/pages/profile">My Profile</router-link>
          <router-link class="dropdown-item" to="/general-settings/profile-settings">Settings</router-link>
          <a class="dropdown-item" href="#" @click.prevent="handleLogout">Logout</a>
        </div>
      </div>
      <!-- /Mobile Menu -->
    </div>
  </div>
  <theme-settings></theme-settings>

</template>
<script>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import sideBarData from "@/assets/json/sidebar-menuone.json";
import { Modal, notification } from 'ant-design-vue'
import { notification as antNotification } from 'ant-design-vue';
import eventBus from '@/plugins/eventBus';
import { disconnectEcho, getEcho  } from '@/plugins/echo';

export default {
  data() {
    return {
      notificationClass: "pe-1",
      sideBarData: sideBarData,
      openMenuItem: null,
      openSubmenuOneItem: null,
      route_array: [],
      notificationStore: null, // Pinia store instance
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
        return `${process.env.VUE_APP_PUBLIC_URL}/storage/${authStore.user.profile_picture}`;
      }
      return null; // Fallback handled in template
    });

    // Make sure the store has loaded the user data
    if (!authStore.user) {
      authStore.updateUserData();
    }

    return { username, email, profilePictureUrl, authStore, notificationStore };
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

          // Show toast notification
          notification.open({
            message: 'New Notification',
            description: this.getNotificationMessage(formattedNotif),
            placement: 'topRight',
            onClick: () => {
              console.log('Notification Clicked!');
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
    document.removeEventListener("click", this.handleOutsideClick);
  },

  mounted() {
    this.initMouseoverListener();
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

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

  },

  computed: {
    // Use store getters for notifications
    notifications() {
      return this.notificationStore.getNotifications;
    },
    unreadCount() {
      return this.notificationStore.unreadCount;
    },
    dashboardRoute() {
      return '/dashboard/';
    }
  },

  methods: {
    // Use store action for marking all as read
    async markAllAsRead() {
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

    handleClick(event) {
      event.stopPropagation();

      if (this.notificationClass === "pe-1 notification-item-show") {
        // If the class is already present, remove it
        this.notificationClass = "";
        document.removeEventListener("click", this.handleOutsideClick);
      } else {
        // If the class is not present, add it
        this.notificationClass = "pe-1 notification-item-show";
        document.addEventListener("click", this.handleOutsideClick);
      }
    },
    handleOutsideClick(event) {
      // Check if the click was outside the notification item
      const notificationItem = event.target.closest(".notification-item");
      if (!notificationItem) {
        this.notificationClass = "";
        // Remove the event listener
        document.removeEventListener("click", this.handleOutsideClick);
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

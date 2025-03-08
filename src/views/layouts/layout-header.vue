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
            <a
              id="toggle_btn"
              href="javascript:void(0);"
              @click="toggleSidebar"
              class="btn btn-menubar me-1"
            >
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
              <a
                href="javascript:void(0);"
                class="btn btn-menubar btnFullscreen"
                @click="initFullScreen"
              >
                <i class="ti ti-maximize"></i>
              </a>
            </div>
            
            <div class="me-1 notification_item">
              <a
                href="javascript:void(0);"
                class="btn btn-menubar position-relative me-1"
                id="notification_popup"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-bell"></i>
                <span class="notification-status-dot"></span>
              </a>
              <div class="dropdown-menu dropdown-menu-end notification-dropdown p-4">
                <div
                  class="d-flex align-items-center justify-content-between border-bottom p-0 pb-3 mb-3"
                >
                  <h4 class="notification-title">Notifications (2)</h4>
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="text-primary fs-15 me-3 lh-1"
                      >Mark all as read</a
                    >
                    <div class="dropdown">
                      <a
                        href="javascript:void(0);"
                        class="bg-white dropdown-toggle"
                        data-bs-toggle="dropdown"
                      >
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
                  <div class="d-flex flex-column">
                    <div class="border-bottom mb-3 pb-3">
                      <router-link to="/crm/activity">
                        <div class="d-flex">
                          <span class="avatar avatar-lg me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/profiles/avatar-27.jpg"
                              alt="Profile"
                            />
                          </span>
                          <div class="flex-grow-1">
                            <p class="mb-1">
                              <span class="text-dark fw-semibold">Shawn</span> performance
                              in Math is below the threshold.
                            </p>
                            <span>Just Now</span>
                          </div>
                        </div>
                      </router-link>
                    </div>
                    <div class="border-bottom mb-3 pb-3">
                      <router-link to="/crm/activity" class="pb-0">
                        <div class="d-flex">
                          <span class="avatar avatar-lg me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/profiles/avatar-23.jpg"
                              alt="Profile"
                            />
                          </span>
                          <div class="flex-grow-1">
                            <p class="mb-1">
                              <span class="text-dark fw-semibold">Sylvia</span> added
                              appointment on 02:00 PM
                            </p>
                            <span>10 mins ago</span>
                            <div
                              class="d-flex justify-content-start align-items-center mt-1"
                            >
                              <span class="btn btn-light btn-sm me-2">Deny</span>
                              <span class="btn btn-primary btn-sm">Approve</span>
                            </div>
                          </div>
                        </div>
                      </router-link>
                    </div>
                    <div class="border-bottom mb-3 pb-3">
                      <router-link to="/crm/activity">
                        <div class="d-flex">
                          <span class="avatar avatar-lg me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/profiles/avatar-25.jpg"
                              alt="Profile"
                            />
                          </span>
                          <div class="flex-grow-1">
                            <p class="mb-1">
                              New student record
                              <span class="text-dark fw-semibold"> George</span> is
                              created by
                              <span class="text-dark fw-semibold">Teressa</span>
                            </p>
                            <span>2 hrs ago</span>
                          </div>
                        </div>
                      </router-link>
                    </div>
                    <div class="border-0 mb-3 pb-0">
                      <router-link to="/crm/activity">
                        <div class="d-flex">
                          <span class="avatar avatar-lg me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/profiles/avatar-01.jpg"
                              alt="Profile"
                            />
                          </span>
                          <div class="flex-grow-1">
                            <p class="mb-1">
                              A new teacher record for
                              <span class="text-dark fw-semibold">Elisa</span>
                            </p>
                            <span>09:45 AM</span>
                          </div>
                        </div>
                      </router-link>
                    </div>
                  </div>
                </div>
                <div class="d-flex p-0">
                  <a href="javascript:void(0);" class="btn btn-light w-100 me-2"
                    >Cancel</a
                  >
                  <router-link to="/crm/activity" class="btn btn-primary w-100"
                    >View All</router-link
                  >
                </div>
              </div>
            </div>

            <div class="dropdown profile-dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle d-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <span class="avatar avatar-sm online">
                  <img
                    :src="profile_picture"
                    alt="Img"
                    class="img-fluid rounded-circle"
                  />
                </span>
              </a>
              <div class="dropdown-menu shadow-none">
                <div class="card mb-0">
                  <div class="card-header">
                    <div class="d-flex align-items-center">
                      <span class="avatar avatar-lg me-2 avatar-rounded">
                        <img :src="profile_picture" alt="img" />
                      </span>
                      <div>
                        <h5 class="mb-0">{{ username}}</h5>
                        <p class="fs-12 fw-medium mb-0">{{ email}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <router-link
                      class="dropdown-item d-inline-flex align-items-center p-0 py-2"
                      to="/pages/profile"
                    >
                      <i class="ti ti-user-circle me-1"></i>My Profile
                    </router-link>
                    <router-link
                      class="dropdown-item d-inline-flex align-items-center p-0 py-2"
                      to="/general-settings/profile-settings"
                    >
                      <i class="ti ti-settings me-1"></i>Settings
                    </router-link>
                  </div>
                  <div class="card-footer">
                    <a 
                      class="dropdown-item d-inline-flex align-items-center p-0 py-2" 
                      href="#" 
                      @click.prevent="handleLogout"
                    >
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
        <a
          href="javascript:void(0);"
          class="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          ><i class="fa fa-ellipsis-v"></i
        ></a>
        <div class="dropdown-menu dropdown-menu-end">
          <router-link class="dropdown-item" to="/pages/profile">My Profile</router-link>
          <router-link class="dropdown-item" to="/general-settings/profile-settings"
            >Settings</router-link
          >
          <a 
            class="dropdown-item" 
            href="#" 
            @click.prevent="handleLogout"
          >Logout</a>
        </div>
      </div>
      <!-- /Mobile Menu -->
    </div>
  </div>
  <theme-settings></theme-settings>

</template>
<script>
import { authService } from '@/services/auth.service';
import sideBarData from "@/assets/json/sidebar-menuone.json";
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      notificationClass: "pe-1",
      sideBarData: sideBarData,
      openMenuItem: null,
      openSubmenuOneItem: null,
      route_array: [],
      username: null,
      email: null,
      profile_picture: null,
    };
  },

  mounted() {
    this.initMouseoverListener();
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.fetchUserDetails(); // Call fetchUserDetails when component is mounted
  },
  methods: {

    fetchUserDetails() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          this.username = userData.name || 'User';
          this.email = userData.email || 'user@example.com';
          this.profile_picture = `${process.env.VUE_APP_PUBLIC_URL}/storage/${userData.profile_picture}`;
        } catch (e) {
          this.username = 'User';
          this.email = 'user@example.com';
        }
      } else {
        this.username = 'User';
        this.email = 'user@example.com';
      }
      return {
        username: this.username,
        email: this.email
      };
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
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You will be logged out of the system",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, logout',
          cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
          const logoutResult = await authService.logout();
          if (logoutResult.success) {
            localStorage.removeItem('intendedRoute');
            this.$router.push('/login');
          }
        }
      } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect to login page even if API call fails
        localStorage.removeItem('intendedRoute');
        this.$router.push('/login');
      }
    }
  },
  beforeUnmount() {
    document.removeEventListener("mouseover", this.handleMouseover);
    document.removeEventListener("click", this.handleOutsideClick);
  },
  computed: {
    dashboardRoute() {
      return '/dashboard/';
    }
  },
};
</script>

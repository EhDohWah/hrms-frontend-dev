<template>
  <div class="col-xl-3 theiaStickySidebar">
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-column list-group settings-list">
          <router-link
            to="/general-settings/profile-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/general-settings/profile-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Profile Settings</router-link
          >
          <router-link
            to="/general-settings/security-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/general-settings/security-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Security Settings</router-link
          >
          <router-link
            to="/general-settings/notification-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/general-settings/notification-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Notifications</router-link
          >
          <router-link
            to="/general-settings/connected-apps"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/general-settings/connected-apps')"
              class="ti ti-arrow-badge-right me-2"
            ></i
            >Connected Apps</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
  },
};
</script>

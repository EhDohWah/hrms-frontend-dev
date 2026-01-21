<template>
  <div class="col-xl-3 theiaStickySidebar">
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-column list-group settings-list">
          <router-link
            to="/others-settings/custom-css"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/others-settings/custom-css')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Custom CSS</router-link
          >
          <router-link
            to="/others-settings/custom-js"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/others-settings/custom-js')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Custom JS</router-link
          >
          <router-link
            to="/others-settings/cronjob"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/others-settings/cronjob')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Cronjob</router-link
          >
          <router-link
            to="/others-settings/storage-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/others-settings/storage-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Storage</router-link
          >
          <router-link
            to="/others-settings/ban-ip-address"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/others-settings/ban-ip-address')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Ban IP Address</router-link
          >
          <router-link
            to="/others-settings/backup"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/others-settings/backup')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Backup</router-link
          >
          <router-link
            to="/others-settings/clear-cache"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/others-settings/clear-cache')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Clear Cache</router-link
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

<template>
  <div class="col-xl-3 theiaStickySidebar">
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-column list-group settings-list">
          <router-link
            to="/system-settings/email-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/system-settings/email-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Email Settings
          </router-link>
          <router-link
            to="/system-settings/email-template"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/system-settings/email-template')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Email Templates
          </router-link>
          <router-link
            to="/system-settings/sms-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/system-settings/sms-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            SMS Settings</router-link
          >
          <router-link
            to="/system-settings/sms-template"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/system-settings/sms-template')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            SMS Templates</router-link
          >
          <router-link
            to="/system-settings/otp-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/system-settings/otp-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            OTP</router-link
          >
          <router-link
            to="/system-settings/gdpr"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/system-settings/gdpr')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            GDPR Cookies</router-link
          >
          <router-link
            to="/system-settings/maintenance-mode"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/system-settings/maintenance-mode')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Maintenance Mode</router-link
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

<template>
  <ul class="nav nav-tabs nav-tabs-solid bg-transparent border-bottom mb-3">
    <li class="nav-item">
      <router-link
        v-bind:class="{
          active:
            currentPath.includes('general-settings/security-settings') ||
            currentPath.includes('general-settings/notification-settings') ||
            currentPath.includes('general-settings/connected-apps'),
        }"
        class="nav-link"
        to="/general-settings/profile-settings"
        ><i class="ti ti-settings me-2"></i>General Settings</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        v-bind:class="{
          active:
            currentPath.includes('website-settings/seo-settings') ||
            currentPath.includes('website-settings/localization-settings') ||
            currentPath.includes('website-settings/prefixes') ||
            currentPath.includes('website-settings/preferences') ||
            currentPath.includes('website-settings/appearance') ||
            currentPath.includes('website-settings/language') ||
            currentPath.includes('website-settings/add-language') ||
            currentPath.includes('website-settings/language-web') ||
            currentPath.includes('website-settings/authentication-settings') ||
            currentPath.includes('website-settings/ai-settings'),
        }"
        class="nav-link"
        to="/website-settings/bussiness-settings"
        ><i class="ti ti-world-cog me-2"></i>Website Settings</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        v-bind:class="{
          active:
            currentPath.includes('app-settings/leave-type') ||
            currentPath.includes('app-settings/approval-settings') ||
            currentPath.includes('app-settings/invoice-settings') ||
            currentPath.includes('app-settings/custom-fields'),
        }"
        class="nav-link"
        to="/app-settings/salary-settings"
        ><i class="ti ti-device-ipad-horizontal-cog me-2"></i>App Settings</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        v-bind:class="{
          active:
            currentPath.includes('system-settings/otp-settings') ||
            currentPath.includes('system-settings/email-settings') ||
            currentPath.includes('system-settings/email-template') ||
            currentPath.includes('system-settings/sms-settings') ||
            currentPath.includes('system-settings/sms-template') ||
            currentPath.includes('system-settings/gdpr') ||
            currentPath.includes('system-settings/maintenance-mode'),
        }"
        class="nav-link"
        to="/system-settings/email-settings"
        ><i class="ti ti-server-cog me-2"></i>System Settings</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        v-bind:class="{
          active:
            currentPath.includes('financial-settings/tax-rates') ||
            currentPath.includes('financial-settings/currencies'),
        }"
        class="nav-link"
        to="/financial-settings/payment-gateways"
        ><i class="ti ti-settings-dollar me-2"></i>Financial Settings</router-link
      >
    </li>
    <li class="nav-item">
      <router-link
        v-bind:class="{
          active:
            currentPath.includes('others-settings/custom-js') ||
            currentPath.includes('others-settings/cronjob') ||
            currentPath.includes('others-settings/storage-settings') ||
            currentPath.includes('others-settings/ban-ip-address') ||
            currentPath.includes('others-settings/backup') ||
            currentPath.includes('others-settings/clear-cache'),
        }"
        class="nav-link"
        to="/others-settings/custom-css"
        ><i class="ti ti-settings-2 me-2"></i>Other Settings</router-link
      >
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      currentPath: this.$route.path,
    };
  },
};
</script>

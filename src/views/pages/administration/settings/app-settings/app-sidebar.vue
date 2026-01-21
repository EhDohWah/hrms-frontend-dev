<template>
  <div class="col-xl-3 theiaStickySidebar">
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-column list-group settings-list">
          <router-link
            to="/app-settings/salary-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/app-settings/salary-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i
            >Salary Settings</router-link
          >
          <router-link
            to="/app-settings/approval-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/app-settings/approval-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i
            >Approval Settings</router-link
          >
          <router-link
            to="/app-settings/invoice-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/app-settings/invoice-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i
            >Invoice Settings</router-link
          >
          <router-link
            to="/app-settings/leave-type"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/app-settings/leave-type')"
              class="ti ti-arrow-badge-right me-2"
            ></i
            >Leave Type</router-link
          >
          <router-link
            to="/app-settings/custom-fields"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/app-settings/custom-fields')"
              class="ti ti-arrow-badge-right me-2"
            ></i
            >Custom Fields</router-link
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

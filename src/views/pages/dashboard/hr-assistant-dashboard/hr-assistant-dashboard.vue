<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown">
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                      class="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                      class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-2">
            <div class="input-icon w-120 position-relative">
              <span class="input-icon-addon">
                <i class="ti ti-calendar text-gray-9"></i>
              </span>
              <a-date-picker class="form-control yearpicker" v-model:value="value5" picker="year" value="2025"
                placeholder="2025" />
            </div>
          </div>
          <div class="ms-2 head-icons">
            <a href="javascript:void(0);" :class="{ active: isCollapsed }" @click="toggleCollapse"
              id="collapse-header">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <welcome-hr-assistant></welcome-hr-assistant>

      <!-- <employee-status></employee-status>

      <job-applicants></job-applicants>

      <sales-overview></sales-overview>

      <project-table></project-table>

      <schedules-index></schedules-index> -->
    </div>
    <layout-footer></layout-footer>
  </div>
  <hr-assistant-dashboard-modal></hr-assistant-dashboard-modal>
</template>
<script>
import { ref } from "vue";
const value5 = ref();
export default {
  data() {
    return {
      title: "HR Assistant Dashboard",
      text: "Dashboard",
      text1: "HR Assistant Dashboard",
      value5,
      isCollapsed: false,
    };
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        document.body.classList.add("header-collapse");
      } else {
        document.body.classList.remove("header-collapse");
      }
    },
  },
};
</script>
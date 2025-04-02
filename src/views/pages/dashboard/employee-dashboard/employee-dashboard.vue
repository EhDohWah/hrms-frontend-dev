<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-pdf me-1"></i>Export as PDF</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="input-icon w-120 position-relative mb-2">
            <span class="input-icon-addon">
              <i class="ti ti-calendar text-gray-9"></i>
            </span>
            <date-picker
              v-model="startdate"
              class="form-control datetimepicker"
              placeholder="dd/mm/yyyy"
              :editable="true"
              :clearable="false"
              :input-format="dateFormat"
            />
          </div>
          <div class="ms-2 head-icons">
            <a
              href="javascript:void(0);"
              :class="{ active: isCollapsed }"
              @click="toggleCollapse"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-original-title="Collapse"
              id="collapse-header"
            >
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <employee-top></employee-top>

      <attendence-employee></attendence-employee>

      <employee-task></employee-task>

      <employee-performance></employee-performance>

      <team-member></team-member>
    </div>
    <layout-footer></layout-footer>
  </div>
  <employee-dashboard-modal></employee-dashboard-modal>
  <!-- /Page Wrapper -->
</template>
<script>
import { ref } from "vue";
const currentDate = ref(new Date());

export default {
  data() {
    return {

      startdate: currentDate,
      dateFormat: "dd-MM-yyyy",
      title: "Employee Dashboard",
      text: "Dashboard",
      text1: "Employee Dashboard",
      isCollapsed: false,
    };
  },
  methods: {
    toggleCollapse() {
      // Toggle the collapsed state
      this.isCollapsed = !this.isCollapsed;

      // Optionally add/remove class on body to collapse header globally
      if (this.isCollapsed) {
        document.body.classList.add("header-collapse");
      } else {
        document.body.classList.remove("header-collapse");
      }
    },
  },
};
</script>

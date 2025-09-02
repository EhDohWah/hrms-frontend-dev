<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Breadcrumb -->
        <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
          <breadcrumb :title="title" :text="text" :text1="text1" />
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
                <span class="input-icon-addon"> </span>
                <a-date-picker v-model:value="value5" picker="year" placeholder="2025" />
              </div>
            </div>
            <div class="ms-2 head-icons">
              <a href="javascript:void(0);" :class="{ active: isCollapsed }" @click="toggleCollapse"
                data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
                <i class="ti ti-chevrons-up"></i>
              </a>
            </div>
          </div>
        </div>
        <!-- /Breadcrumb -->

        <welcome-wrap></welcome-wrap>

        <employee-status></employee-status>

        <job-applicants></job-applicants>

        <sales-overview></sales-overview>

        <project-table></project-table>

        <schedules-index></schedules-index>
      </div>
      <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
        <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
        <p>
          Designed &amp; Developed By
          <a href="javascript:void(0);" class="text-primary">Dreams</a>
        </p>
      </div>
    </div>
  </div>
  <admin-dashboard-modal></admin-dashboard-modal>
</template>

<script>
import { ref, computed, onBeforeUnmount, watch, onBeforeRouteUpdate } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const value5 = ref();
    const route = useRoute();

    // Computed properties for layout type and layout width
    const layoutType = computed(() =>
      route.path === "/layouts/layout-box" ? "hovered" : "vertical"
    );

    const layoutWidth = computed(() =>
      route.path === "/layouts/layout-box" ? "box" : "default"
    );

    // Function to update <html> and <body> dynamically
    const updateHtmlAndBody = () => {
      // Update <html> element's data-width attribute
      document.documentElement.setAttribute("data-width", layoutWidth.value);

      // Add or remove classes from <body> based on the route path
      if (route.path === "/layouts/layout-box") {
        document.body.classList.add("mini-sidebar", "layout-box-mode");
      } else {
        document.body.classList.remove("mini-sidebar", "layout-box-mode");
      }
    };

    // Watch route.path specifically and update HTML and body when it changes
    watch(
      () => route.path,
      () => {
        updateHtmlAndBody();
      },
      { immediate: true }
    );

    // Cleanup attributes and classes on component unmount
    onBeforeUnmount(() => {
      document.documentElement.removeAttribute("data-width");
      document.body.classList.remove("mini-sidebar", "layout-box-mode");
    });

    // Cleanup on route update
    onBeforeRouteUpdate((to, from, next) => {
      // Remove previous attributes and classes when route changes
      document.documentElement.removeAttribute("data-width");
      document.body.classList.remove("mini-sidebar", "layout-box-mode");
      next();
    });

    return {
      title: "Admin Dashboard",
      text: "Dashboard",
      text1: "Admin Dashboard",
      value5,
      isCollapsed: false,
      layoutType,
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

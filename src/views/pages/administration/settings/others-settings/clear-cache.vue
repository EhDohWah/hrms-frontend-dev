<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div
        class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3"
      >
        <breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="head-icons ms-2">
          <a
            href="javascript:void(0);"
            class=""
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-original-title="Collapse"
            id="collapse-header"
            @click="toggleHeader"
          >
            <i class="ti ti-chevrons-up"></i>
          </a>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <settings-tab></settings-tab>
      <div class="row">
        <others-sidebar></others-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-header px-0 mx-3">
              <div class="d-flex align-items-center justify-content-between">
                <h4>Clear Cache</h4>
              </div>
            </div>
            <div class="card-body pb-0">
              <div class="cache-content">
                <p class="fs-14 text-dark mb-3">
                  <span class="me-2"><i class="ti ti-info-circle text-danger"></i></span
                  >Clearing the cache may improve performance but will remove temporary
                  files, stored preferences, and cached data from websites and
                  applications.
                </p>
                <div class="d-flex align-items-center justify-content-end mb-3">
                  <a href="javascript:void(0);" class="btn btn-outline-primary me-3"
                    >Cancel</a
                  >
                  <a href="javascript:void(0);" class="btn btn-primary">Clear Cache</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <clear-modal></clear-modal>
</template>
<script>
export default {
  data() {
    return {
      title: "Settings",
      text: "Administration",
      text1: "Settings",
    };
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

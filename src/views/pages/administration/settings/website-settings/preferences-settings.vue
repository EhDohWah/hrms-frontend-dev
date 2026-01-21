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
        <website-sidebar></website-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body pb-1">
              <div class="border-bottom mb-3 pb-3">
                <h4>Preferences</h4>
              </div>
              <div class="row">
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Employees</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user1" class="check" checked />
                      <label for="user1" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Clients</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user2" class="check" checked />
                      <label for="user2" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Projects</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user3" class="check" checked />
                      <label for="user3" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Contacts</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user4" class="check" checked />
                      <label for="user4" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Companies</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user5" class="check" checked />
                      <label for="user5" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Deals</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user6" class="check" checked />
                      <label for="user6" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Leads</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user12" class="check" checked />
                      <label for="user12" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Pipeline</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user7" class="check" checked />
                      <label for="user7" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Activities</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user8" class="check" checked />
                      <label for="user8" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Sales</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user9" class="check" checked />
                      <label for="user9" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Accounting</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user10" class="check" checked />
                      <label for="user10" class="checktoggle"> </label>
                    </div>
                  </div>
                </div>
                <div class="col-xxl-4 col-xl-4 col-sm-6">
                  <div
                    class="d-md-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3"
                  >
                    <h5 class="fw-medium fs-14">Reports</h5>
                    <div class="status-toggle modal-status">
                      <input type="checkbox" id="user11" class="check" checked />
                      <label for="user11" class="checktoggle"> </label>
                    </div>
                  </div>
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

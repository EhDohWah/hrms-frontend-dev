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
                <h4>Ban IP Address</h4>
                <a
                  href="javascript:void(0);"
                  class="btn btn-primary btn-sm d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#add_ban"
                  ><i class="ti ti-circle-plus me-2"></i>Add IP Address</a
                >
              </div>
            </div>
            <div class="card-body pb-0">
              <div class="row bx-3">
                <div class="col-lg-6">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div
                        class="d-flex align-items-center justify-content-between border-bottom mb-2 pb-2"
                      >
                        <div class="d-flex align-items-center">
                          <span class="d-inline-flex me-2"
                            ><i class="ti ti-ban"></i
                          ></span>
                          <p class="fs-14 fw-medium text-dark">198.120.16.01</p>
                        </div>
                        <div class="d-flex align-items-center">
                          <a
                            href="javascript:void(0);"
                            class="link-default me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_ban"
                            ><i class="ti ti-edit"></i
                          ></a>
                          <a
                            href="javascript:void(0);"
                            class="link-default"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_modal"
                            ><i class="ti ti-trash"></i
                          ></a>
                        </div>
                      </div>
                      <div>
                        <p>
                          <span class="me-2"><i class="ti ti-info-circle"></i></span
                          >Temporarily block to protect user accounts from internet
                          fraudsters
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div
                        class="d-flex align-items-center justify-content-between border-bottom mb-2 pb-2"
                      >
                        <div class="d-flex align-items-center">
                          <span class="d-inline-flex me-2"
                            ><i class="ti ti-ban"></i
                          ></span>
                          <p class="fs-14 fw-medium text-dark">198.160.11.20</p>
                        </div>
                        <div class="d-flex align-items-center">
                          <a
                            href="javascript:void(0);"
                            class="link-default me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_ban"
                            ><i class="ti ti-edit"></i
                          ></a>
                          <a
                            href="javascript:void(0);"
                            class="link-default"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_modal"
                            ><i class="ti ti-trash"></i
                          ></a>
                        </div>
                      </div>
                      <div>
                        <p>
                          <span class="me-2"><i class="ti ti-info-circle"></i></span
                          >Unauthorized access attempts, or other signs of a potential
                          security
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div
                        class="d-flex align-items-center justify-content-between border-bottom mb-2 pb-2"
                      >
                        <div class="d-flex align-items-center">
                          <span class="d-inline-flex me-2"
                            ><i class="ti ti-ban"></i
                          ></span>
                          <p class="fs-14 fw-medium text-dark">198.123.10.2</p>
                        </div>
                        <div class="d-flex align-items-center">
                          <a
                            href="javascript:void(0);"
                            class="link-default me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_ban"
                            ><i class="ti ti-edit"></i
                          ></a>
                          <a
                            href="javascript:void(0);"
                            class="link-default"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_modal"
                            ><i class="ti ti-trash"></i
                          ></a>
                        </div>
                      </div>
                      <div>
                        <p>
                          <span class="me-2"><i class="ti ti-info-circle"></i></span
                          >Attempts to scrape large amounts of HR data from the system
                          without authorization.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="card mb-3">
                    <div class="card-body">
                      <div
                        class="d-flex align-items-center justify-content-between border-bottom mb-2 pb-2"
                      >
                        <div class="d-flex align-items-center">
                          <span class="d-inline-flex me-2"
                            ><i class="ti ti-ban"></i
                          ></span>
                          <p class="fs-14 fw-medium text-dark">198.110.01.05</p>
                        </div>
                        <div class="d-flex align-items-center">
                          <a
                            href="javascript:void(0);"
                            class="link-default me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_ban"
                            ><i class="ti ti-edit"></i
                          ></a>
                          <a
                            href="javascript:void(0);"
                            class="link-default"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_modal"
                            ><i class="ti ti-trash"></i
                          ></a>
                        </div>
                      </div>
                      <div>
                        <p>
                          <span class="me-2"><i class="ti ti-info-circle"></i></span>Found
                          downloading or uploading inappropriate content
                        </p>
                      </div>
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
  <ban-modal></ban-modal>
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

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
            <div class="card-body pb-0">
              <div class="border-bottom mb-3 pb-3">
                <h4>Storage</h4>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                          <span class="avatar avatar-lg bg-gray-100 me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/icons/storage-icon-03.svg"
                              class="w-auto h-auto"
                              alt="Img"
                            />
                          </span>
                          <h5>Local Storage</h5>
                        </div>
                        <div class="d-flex align-items-center">
                          <a href="javascript:void(0);" class="btn btn-icon btn-sm me-2"
                            ><i class="ti ti-settings fs-20"></i
                          ></a>
                          <div class="form-check form-check-md form-switch">
                            <input
                              class="form-check-input me-2"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                          <span class="avatar avatar-lg bg-gray-100 me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/icons/aws.svg"
                              class="w-auto h-auto"
                              alt="Img"
                            />
                          </span>
                          <h5>AWS</h5>
                        </div>
                        <div class="d-flex align-items-center">
                          <a
                            href="javascript:void(0);"
                            class="btn btn-icon btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#aws_settings"
                            ><i class="ti ti-settings fs-20"></i
                          ></a>
                          <div class="form-check form-check-md form-switch">
                            <input
                              class="form-check-input me-2"
                              type="checkbox"
                              role="switch"
                            />
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

  <!--Add Cronjob -->
  <div class="modal fade" id="aws_settings">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">AWS</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">AWS Access Key</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">AWS Secret Key</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Bucket Name</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Region</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">AWS Base URL</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Cronjob -->
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
    submitForm() {
      this.$router.push("/others-settings/storage-settings");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

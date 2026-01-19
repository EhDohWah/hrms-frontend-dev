<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar
  ><!-- Page Wrapper -->
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
            <div class="card-body">
              <div class="border-bottom mb-3 pb-3">
                <h4>Authentication Settings</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-8">
                      <div class="row row-gap-2 mb-3">
                        <div class="col-md-6">
                          <h6 class="fw-medium">Allow Registration</h6>
                        </div>
                        <div class="col-md-6 d-flex align-items-center">
                          <div class="form-check form-switch me-2">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                          <div class="form-check form-check-md">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="checkebox-md"
                            />
                            <label class="form-check-label" for="checkebox-md">
                              Invite Only
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="row row-gap-2 mb-3">
                        <div class="col-md-6">
                          <h6 class="fw-medium">Verification Required</h6>
                        </div>
                        <div class="col-md-6">
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row row-gap-2 mb-3">
                        <div class="col-md-6 d-flex">
                          <div class="d-flex align-items-center">
                            <h6 class="fw-medium">Verification Expired</h6>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                      <div class="row row-gap-2 mb-3">
                        <div class="col-md-6">
                          <h6 class="fw-medium">Referral System</h6>
                        </div>
                        <div class="col-md-6">
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row row-gap-2 mb-3">
                        <div class="col-md-6 d-flex">
                          <div class="d-flex align-items-center">
                            <h6 class="fw-medium">Login Type</h6>
                          </div>
                        </div>
                        <div class="col-md-6 d-flex align-items-center">
                          <div class="form-check me-2">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="Radio"
                              id="Radio-sm"
                            />
                            <label class="form-check-label" for="Radio-sm">
                              Mobile
                            </label>
                          </div>
                          <div class="form-check me-2">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="Radio"
                              id="Radio-smone"
                            />
                            <label class="form-check-label" for="Radio-smone">
                              Email
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="row row-gap-2 mb-3">
                        <div class="col-md-6">
                          <h6 class="fw-medium">Password</h6>
                        </div>
                        <div class="col-md-6">
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row row-gap-2 mb-3">
                        <div class="col-md-6">
                          <h6 class="fw-medium">OTP System</h6>
                        </div>
                        <div class="col-md-6">
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row row-gap-2 mb-3">
                        <div class="col-md-6 d-flex">
                          <div class="d-flex align-items-center">
                            <h6 class="fw-medium">OTP Type</h6>
                          </div>
                        </div>
                        <div class="col-md-6 d-flex align-items-center">
                          <div class="form-check me-2">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="Radio1"
                              id="Radio-smtwo"
                            />
                            <label class="form-check-label" for="Radio-smtwo">
                              SMS OTP
                            </label>
                          </div>
                          <div class="form-check me-2">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="Radio1"
                              id="Radio-smthree"
                            />
                            <label class="form-check-label" for="Radio-smthree">
                              Email OTP
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex align-items-center justify-content-end">
                  <button type="button" class="btn btn-outline-light border me-3">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary">Save</button>
                </div>
              </form>
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
    submitForm() {
      this.$router.push("/website-settings/authentication-settings");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

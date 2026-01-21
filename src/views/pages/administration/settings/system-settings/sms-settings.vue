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
        <system-sidebar></system-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-3">
                <h4>SMS Settings</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="card mb-3">
                        <div class="card-body p-3">
                          <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                              <span>
                                <img
                                  src="@/assets/img/settings/nexmo.svg"
                                  alt="Profile"
                                />
                              </span>
                            </div>
                            <div class="d-flex align-items-center">
                              <div class="form-check form-switch">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault"
                                />
                              </div>
                              <a
                                href="javascript:void(0);"
                                class="btn btn-icon btn-sm text-gray-5 fs-20"
                                data-bs-toggle="modal"
                                data-bs-target="#nexmosettings"
                                ><i class="ti ti-settings"></i
                              ></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="card mb-3">
                        <div class="card-body p-3">
                          <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                              <span>
                                <img
                                  src="@/assets/img/settings/sms-gateway.svg"
                                  alt="Profile"
                                />
                              </span>
                            </div>
                            <div class="d-flex align-items-center">
                              <div class="form-check form-switch">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault2"
                                />
                              </div>
                              <a
                                href="javascript:void(0);"
                                class="btn btn-icon btn-sm text-gray-5 fs-20"
                                data-bs-toggle="modal"
                                data-bs-target="#smssettings"
                                ><i class="ti ti-settings"></i
                              ></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="card mb-3">
                        <div class="card-body p-3">
                          <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                              <span>
                                <img
                                  src="@/assets/img/settings/twilio.svg"
                                  alt="Profile"
                                />
                              </span>
                            </div>
                            <div class="d-flex align-items-center">
                              <div class="form-check form-switch">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault3"
                                />
                              </div>
                              <a
                                href="javascript:void(0);"
                                class="btn btn-icon btn-sm text-gray-5 fs-20"
                                data-bs-toggle="modal"
                                data-bs-target="#twiliosettings"
                                ><i class="ti ti-settings"></i
                              ></a>
                            </div>
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
  <sms-settings-modal></sms-settings-modal>
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
      this.$router.push("/system-settings/sms-settings");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

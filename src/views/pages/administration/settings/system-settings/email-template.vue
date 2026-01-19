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
              <div
                class="border-bottom d-flex align-items-center justify-content-between pb-3 mb-3"
              >
                <h4>Email Templates</h4>
                <a
                  href="javascript:void(0);"
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#addtemplate"
                  ><i class="ti ti-circle-plus me-2"></i>Add Template</a
                >
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="mb-3">
                        <div class="card">
                          <div class="card-body p-3">
                            <div
                              class="d-flex align-items-center justify-content-between"
                            >
                              <h6>Email Verification</h6>
                              <div class="d-flex align-items-center">
                                <a
                                  href="javascript:void(0);"
                                  class="btn btn-sm btn-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edittemplate"
                                  ><i class="ti ti-edit"></i
                                ></a>
                                <a
                                  href="javascript:void(0);"
                                  class="btn btn-sm btn-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete_modal"
                                  ><i class="ti ti-trash"></i
                                ></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <div class="card">
                          <div class="card-body p-3">
                            <div
                              class="d-flex align-items-center justify-content-between"
                            >
                              <h6>Welcome Email</h6>
                              <div class="d-flex align-items-center">
                                <a
                                  href="javascript:void(0);"
                                  class="btn btn-sm btn-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edittemplate"
                                  ><i class="ti ti-edit"></i
                                ></a>
                                <a
                                  href="javascript:void(0);"
                                  class="btn btn-sm btn-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete_modal"
                                  ><i class="ti ti-trash"></i
                                ></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="mb-3">
                        <div class="card">
                          <div class="card-body p-3">
                            <div
                              class="d-flex align-items-center justify-content-between"
                            >
                              <h6>Leave Request</h6>
                              <div class="d-flex align-items-center">
                                <a
                                  href="javascript:void(0);"
                                  class="btn btn-sm btn-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edittemplate"
                                  ><i class="ti ti-edit"></i
                                ></a>
                                <a
                                  href="javascript:void(0);"
                                  class="btn btn-sm btn-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete_modal"
                                  ><i class="ti ti-trash"></i
                                ></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="row">
                        <div class="col-md-4">
                          <div class="mb-3">
                            <div class="card">
                              <div class="card-body p-3">
                                <div
                                  class="d-flex align-items-center justify-content-between"
                                >
                                  <h6>Performance Review</h6>
                                  <div class="d-flex align-items-center">
                                    <a
                                      href="javascript:void(0);"
                                      class="btn btn-sm btn-icon"
                                      data-bs-toggle="modal"
                                      data-bs-target="#edittemplate"
                                      ><i class="ti ti-edit"></i
                                    ></a>
                                    <a
                                      href="javascript:void(0);"
                                      class="btn btn-sm btn-icon"
                                      ><i class="ti ti-trash"></i
                                    ></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="mb-3">
                            <div class="card">
                              <div class="card-body p-3">
                                <div
                                  class="d-flex align-items-center justify-content-between"
                                >
                                  <h6>Training Session</h6>
                                  <div class="d-flex align-items-center">
                                    <a
                                      href="javascript:void(0);"
                                      class="btn btn-sm btn-icon"
                                      data-bs-toggle="modal"
                                      data-bs-target="#edittemplate"
                                      ><i class="ti ti-edit"></i
                                    ></a>
                                    <a
                                      href="javascript:void(0);"
                                      class="btn btn-sm btn-icon"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete_modal"
                                      ><i class="ti ti-trash"></i
                                    ></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="mb-3">
                            <div class="card">
                              <div class="card-body p-3">
                                <div
                                  class="d-flex align-items-center justify-content-between"
                                >
                                  <h6>Password Reset</h6>
                                  <div class="d-flex align-items-center">
                                    <a
                                      href="javascript:void(0);"
                                      class="btn btn-sm btn-icon"
                                      data-bs-toggle="modal"
                                      data-bs-target="#edittemplate"
                                      ><i class="ti ti-edit"></i
                                    ></a>
                                    <a
                                      href="javascript:void(0);"
                                      class="btn btn-sm btn-icon"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete_modal"
                                      ><i class="ti ti-trash"></i
                                    ></a>
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
  <email-modal></email-modal>
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
      this.$router.push("/system-settings/email-template");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

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
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
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
                <h4>Email Settings</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row"></div>
                  <div class="row">
                    <div class="col-md-6 d-flex">
                      <div class="card flex-fill">
                        <div class="card-body">
                          <div class="border-bottom pb-3 mb-3">
                            <div
                              class="d-flex justify-content-between align-items-center mb-2"
                            >
                              <div class="d-flex align-items-center">
                                <span
                                  class="avatar avatar-xl p-2 me-2 bg-light flex-shrink-0"
                                >
                                  <img
                                    src="@/assets/img/settings/phpmail.svg"
                                    alt="Profile"
                                  />
                                </span>
                                <h5>PHP Mailer</h5>
                              </div>
                              <div class="form-check form-switch">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault"
                                />
                              </div>
                            </div>
                            <p>
                              Used to send emails safely and easily via PHP code from a
                              web server.
                            </p>
                          </div>
                          <div class="d-flex align-items-center justify-content-between">
                            <span
                              class="btn btn-sm d-inline-flex align-items-center btn-dark"
                            >
                              <i class="ti ti-checks me-1"></i>Connected
                            </span>
                            <a
                              href="javascript:void(0);"
                              data-bs-toggle="modal"
                              data-bs-target="#phpmailersettings"
                              class="btn btn-icon btn-sm text-gray-5 fs-20"
                              ><i class="ti ti-settings"></i
                            ></a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 d-flex">
                      <div class="card flex-fill">
                        <div class="card-body">
                          <div class="border-bottom pb-3 mb-3">
                            <div
                              class="d-flex justify-content-between align-items-center mb-2"
                            >
                              <div class="d-flex align-items-center">
                                <span
                                  class="avatar avatar-xl me-2 p-2 bg-light flex-shrink-0"
                                >
                                  <img
                                    src="@/assets/img/settings/smtp.svg"
                                    alt="Profile"
                                  />
                                </span>
                                <h5>SMTP</h5>
                              </div>
                              <div class="form-check form-switch">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckDefault2"
                                />
                              </div>
                            </div>
                            <p>
                              SMTP is used to send, relay or forward messages from a mail
                              client.
                            </p>
                          </div>
                          <div class="d-flex align-items-center justify-content-between">
                            <span
                              class="btn btn-sm d-inline-flex align-items-center btn-light"
                            >
                              <i class="ti ti-checks me-1"></i>Connected
                            </span>
                            <a
                              href="javascript:void(0);"
                              data-bs-toggle="modal"
                              data-bs-target="#smtpsettings"
                              class="btn btn-icon btn-sm text-gray-5 fs-20"
                              ><i class="ti ti-settings"></i
                            ></a>
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
  <!-- Add php mailer -->
  <div class="modal fade" id="phpmailersettings">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">PHP Mailer</h4>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">From Email Address</label>
                  <input class="form-control" type="text" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Email Password</label>
                  <input class="form-control" type="text" />
                </div>
              </div>

              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">From Email Name</label>
                  <input class="form-control" type="text" />
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
  <!-- /Add php mailer -->

  <!-- Add SMTP -->
  <div class="modal fade" id="smtpsettings">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">SMTP</h4>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">From Email Address</label>
                  <input class="form-control" type="text" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Email Password</label>
                  <input class="form-control" type="text" />
                </div>
              </div>

              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Email Host</label>
                  <input class="form-control" type="text" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Port</label>
                  <input class="form-control" type="text" />
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
  <!-- /Add  SMTP -->
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
      this.$router.push("/system-settings/email-settings");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

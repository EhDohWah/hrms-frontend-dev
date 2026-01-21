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
        <app-sidebar></app-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-3">
                <h4>Salary Settings</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row"></div>
                  <div class="row">
                    <div class="col-md-4 d-flex">
                      <div class="card flex-fill">
                        <div class="card-body pb-1">
                          <div
                            class="content-head d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"
                          >
                            <h5>DA & HRA</h5>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                              />
                            </div>
                          </div>
                          <div class="mb-3">
                            <label class="form-label">DA (%)</label>
                            <input type="text" class="form-control" />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">HRA (%)</label>
                            <input type="text" class="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 d-flex">
                      <div class="card flex-fill">
                        <div class="card-body pb-1">
                          <div
                            class="content-head d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"
                          >
                            <h5>Provident Fund</h5>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault2"
                              />
                            </div>
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Employee Share (%)</label>
                            <input type="text" class="form-control" />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Organization Share (%)</label>
                            <input type="text" class="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 d-flex">
                      <div class="card flex-fill">
                        <div class="card-body pb-1">
                          <div
                            class="content-head d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"
                          >
                            <h5>ESI</h5>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault3"
                              />
                            </div>
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Employee Share (%)</label>
                            <input type="text" class="form-control" />
                          </div>
                          <div class="mb-3">
                            <label class="form-label">Organization Share (%)</label>
                            <input type="text" class="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="card">
                        <div class="card-body pb-1">
                          <div
                            class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"
                          >
                            <h5>TDS <span> Annual Salary</span></h5>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault4"
                              />
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="add-salary-info">
                                <div class="row">
                                  <div class="col-md-4">
                                    <div class="mb-3">
                                      <label class="form-label">Salary From</label>
                                      <input type="text" class="form-control" />
                                    </div>
                                  </div>
                                  <div class="col-md-4">
                                    <div class="mb-3">
                                      <label class="form-label">Salary To</label>
                                      <input type="text" class="form-control" />
                                    </div>
                                  </div>
                                  <div class="col-md-4">
                                    <div class="d-flex align-items-center">
                                      <div class="mb-3 flex-fill">
                                        <label class="form-label">Percentage</label>
                                        <input type="text" class="form-control" />
                                      </div>
                                      <div class="d-flex align-items-center pt-3 ms-3">
                                        <a
                                          href="javascript:void(0);"
                                          class="avatar avatar-md rounded bg-gray add-salary-btn text-primary"
                                          ><i class="ti ti-plus"></i
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
      this.$router.push("/app-settings/salary-settings");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

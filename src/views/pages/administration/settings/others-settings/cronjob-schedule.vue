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
              <div class="row g-3 align-items-center">
                <div class="col-md-6 col-sm-4">
                  <h6 class="fw-medium d-inline-flex align-items-center mb-3 mb-sm-0">
                    <router-link to="/others-settings/cronjob">
                      <i class="ti ti-arrow-left me-2"></i>Cron Schedule</router-link
                    >
                  </h6>
                </div>
                <div class="col-md-6 col-sm-8">
                  <div
                    class="d-flex justify-content-sm-end align-items-center flex-wrap row-gap-2"
                  >
                    <router-link
                      to="/website-settings/add-language"
                      class="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#add_cronjobschedule"
                      ><i class="ti ti-circle-plus me-2"></i>Add Schedule</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body pb-0">
              <div class="card mb-3">
                <div class="card-header">
                  <div class="row align-items-center g-3">
                    <div class="col-sm-8">
                      <h6>Cron Schedule List</h6>
                    </div>
                    <div class="col-sm-4">
                      <div class="position-relative search-input">
                        <input type="text" class="form-control" placeholder="Search" />
                        <div class="search-addon">
                          <span><i class="ti ti-search"></i></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table">
                      <thead class="thead-light">
                        <tr>
                          <th class="no-sort">
                            <div class="form-check form-check-md">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="select-all"
                              />
                            </div>
                          </th>
                          <th>Name</th>
                          <th>Interval</th>
                          <th>Enable</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div class="form-check form-check-md">
                              <input class="form-check-input" type="checkbox" />
                            </div>
                          </td>
                          <td>
                            <h6 class="fw-medium">5 minutes</h6>
                          </td>
                          <td>5 seconds</td>
                          <td>
                            <div class="form-check form-check-md form-switch me-2">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_cronjobschedule"
                                ><i class="ti ti-edit"></i
                              ></a>
                              <a
                                href="javascript:void(0);"
                                data-bs-toggle="modal"
                                data-bs-target="#delete_modal"
                                ><i class="ti ti-trash"></i
                              ></a>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="form-check form-check-md">
                              <input class="form-check-input" type="checkbox" />
                            </div>
                          </td>
                          <td>
                            <h6 class="fw-medium">3 minutes</h6>
                          </td>
                          <td>3 seconds</td>
                          <td>
                            <div class="form-check form-check-md form-switch me-2">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_cronjobschedule"
                                ><i class="ti ti-edit"></i
                              ></a>
                              <a
                                href="javascript:void(0);"
                                data-bs-toggle="modal"
                                data-bs-target="#delete_modal"
                                ><i class="ti ti-trash"></i
                              ></a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
  <cronjob-schedule-modal></cronjob-schedule-modal>
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

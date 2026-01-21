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
            <div class="card-header px-0 mx-3">
              <h4>Language</h4>
            </div>
            <div class="card-body pb-0">
              <div class="card mb-3">
                <div class="card-header">
                  <div class="row align-items-center g-3">
                    <div class="col-lg-6 col-sm-4">
                      <h6>Language</h6>
                    </div>
                    <div class="col-lg-6 col-sm-8">
                      <div class="d-flex align-items-center justify-content-sm-end">
                        <router-link
                          to="/website-settings/language"
                          class="btn btn-sm btn-primary d-inline-flex align-items-center me-3"
                        >
                          <i class="ti ti-arrow-left me-2"></i>
                          Back to Translations
                        </router-link>
                        <a
                          href="javascript:void(0);"
                          class="btn btn-sm btn-outline-dark d-inline-flex align-items-center"
                        >
                          <img
                            src="@/assets/img/flags/ae.png"
                            class="me-2 avatar avatar-sm avatar-rounded"
                            alt="Img"
                          />
                          Arabic
                        </a>
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
                          <th>Module Name</th>
                          <th>Total</th>
                          <th>Complete</th>
                          <th>Progress</th>
                          <th>Action</th>
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
                            <h6 class="fw-medium fs-14">Employees</h6>
                          </td>
                          <td>1620</td>
                          <td>1296</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="progress progress-xs" style="width: 120px">
                                <div
                                  class="progress-bar bg-success rounded"
                                  role="progressbar"
                                  style="width: 100%"
                                  aria-valuenow="100"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span class="d-inline-flex fs-12 ms-2">100%</span>
                            </div>
                          </td>
                          <td>
                            <router-link
                              to="/website-settings/add-language"
                              class="btn btn-sm btn-icon border btn-light"
                              ><i class="ti ti-edit"></i
                            ></router-link>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="form-check form-check-md">
                              <input class="form-check-input" type="checkbox" />
                            </div>
                          </td>
                          <td>
                            <h6 class="fw-medium fs-14">Clients</h6>
                          </td>
                          <td>1620</td>
                          <td>972</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="progress progress-xs" style="width: 120px">
                                <div
                                  class="progress-bar bg-pink rounded"
                                  role="progressbar"
                                  style="width: 70%"
                                  aria-valuenow="80"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span class="d-inline-flex fs-12 ms-2">70%</span>
                            </div>
                          </td>
                          <td>
                            <router-link
                              to="/website-settings/add-language"
                              class="btn btn-sm btn-icon border btn-light"
                              ><i class="ti ti-edit"></i
                            ></router-link>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="form-check form-check-md">
                              <input class="form-check-input" type="checkbox" />
                            </div>
                          </td>
                          <td>
                            <h6 class="fw-medium fs-14">Projects</h6>
                          </td>
                          <td>1620</td>
                          <td>810</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="progress progress-xs" style="width: 120px">
                                <div
                                  class="progress-bar bg-purple rounded"
                                  role="progressbar"
                                  style="width: 40%"
                                  aria-valuenow="40"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span class="d-inline-flex fs-12 ms-2">40%</span>
                            </div>
                          </td>
                          <td>
                            <router-link
                              to="/website-settings/add-language"
                              class="btn btn-sm btn-icon border btn-light"
                              ><i class="ti ti-edit"></i
                            ></router-link>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="form-check form-check-md">
                              <input class="form-check-input" type="checkbox" />
                            </div>
                          </td>
                          <td>
                            <h6 class="fw-medium fs-14">Tasks</h6>
                          </td>
                          <td>1620</td>
                          <td>324</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="progress progress-xs" style="width: 120px">
                                <div
                                  class="progress-bar bg-skyblue rounded"
                                  role="progressbar"
                                  style="width: 60%"
                                  aria-valuenow="40"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span class="d-inline-flex fs-12 ms-2">60%</span>
                            </div>
                          </td>
                          <td>
                            <router-link
                              to="/website-settings/add-language"
                              class="btn btn-sm btn-icon border btn-light"
                              ><i class="ti ti-edit"></i
                            ></router-link>
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

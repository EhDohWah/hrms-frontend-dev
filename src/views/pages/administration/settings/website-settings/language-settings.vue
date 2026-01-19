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
              <div class="row g-3 align-items-center">
                <div class="col-md-6 col-sm-4">
                  <h4>Language</h4>
                </div>
                <div class="col-md-6 col-sm-8">
                  <div
                    class="d-flex justify-content-sm-end align-items-center flex-wrap row-gap-2"
                  >
                    <div class="me-3">
                      <vue-select
                        :options="WerSel"
                        id="wersel"
                        placeholder="Select Language"
                      />
                    </div>
                    <a href="javascript:void(0);" class="btn btn-primary">Add Language</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body pb-0">
              <div class="card mb-3">
                <div class="card-header">
                  <div class="row align-items-center g-3">
                    <div class="col-sm-8">
                      <h6>Language List</h6>
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
                          <th>Language</th>
                          <th>Code</th>
                          <th>RTL</th>
                          <th>Default</th>
                          <th>Total</th>
                          <th>Done</th>
                          <th>Progress</th>
                          <th>Status</th>
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
                            <h6 class="d-flex align-items-center fw-medium">
                              <img
                                src="@/assets/img/flags/us.png"
                                class="me-2 avatar avatar-sm avatar-rounded"
                                alt="Img"
                              />
                              English
                            </h6>
                          </td>
                          <td>en</td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked
                              />
                            </div>
                          </td>
                          <td>1620</td>
                          <td>1296</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="circle-progress" data-value="80">
                                <span class="progress-left">
                                  <span class="progress-bar border-warning"></span>
                                </span>
                                <span class="progress-right">
                                  <span class="progress-bar border-warning"></span>
                                </span>
                              </div>
                              <div class="progress-value ms-2">80%</div>
                            </div>
                          </td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="d-flex align-items-center">
                              <a
                                href="javascript:void(0);"
                                class="btn btn-sm btn-icon btn-light border me-2"
                              >
                                <i class="ti ti-download"></i>
                              </a>
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >Web</router-link
                              >
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >App</router-link
                              >
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >Admin</router-link
                              >
                              <a href="javascript:void(0);" class="btn btn-sm btn-icon btn-light border">
                                <i class="ti ti-trash"></i>
                              </a>
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
                            <h6 class="d-flex align-items-center fw-medium">
                              <img
                                src="@/assets/img/flags/ae.png"
                                class="me-2 avatar avatar-sm avatar-rounded"
                                alt="Img"
                              />
                              Arabic
                            </h6>
                          </td>
                          <td>ar</td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>1620</td>
                          <td>810</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="circle-progress" data-value="50">
                                <span class="progress-left">
                                  <span class="progress-bar border-purple"></span>
                                </span>
                                <span class="progress-right">
                                  <span class="progress-bar border-purple"></span>
                                </span>
                              </div>
                              <div class="progress-value ms-2">50%</div>
                            </div>
                          </td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="d-flex align-items-center">
                              <a
                                href="javascript:void(0);"
                                class="btn btn-sm btn-icon btn-light border me-2"
                              >
                                <i class="ti ti-download"></i>
                              </a>
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >Web</router-link
                              >
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >App</router-link
                              >
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >Admin</router-link
                              >
                              <a href="javascript:void(0);" class="btn btn-sm btn-icon btn-light border">
                                <i class="ti ti-trash"></i>
                              </a>
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
                            <h6 class="d-flex align-items-center fw-medium">
                              <img
                                src="@/assets/img/flags/de.png"
                                class="me-2 avatar avatar-sm avatar-rounded"
                                alt="Img"
                              />
                              German
                            </h6>
                          </td>
                          <td>de</td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>1620</td>
                          <td>972</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="circle-progress" data-value="70">
                                <span class="progress-left">
                                  <span class="progress-bar border-skyblue"></span>
                                </span>
                                <span class="progress-right">
                                  <span class="progress-bar border-skyblue"></span>
                                </span>
                              </div>
                              <div class="progress-value ms-2">70%</div>
                            </div>
                          </td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="d-flex align-items-center">
                              <a
                                href="javascript:void(0);"
                                class="btn btn-sm btn-icon btn-light border me-2"
                              >
                                <i class="ti ti-download"></i>
                              </a>
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >Web</router-link
                              >
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >App</router-link
                              >
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >Admin</router-link
                              >
                              <a href="javascript:void(0);" class="btn btn-sm btn-icon btn-light border">
                                <i class="ti ti-trash"></i>
                              </a>
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
                            <h6 class="d-flex align-items-center fw-medium">
                              <img
                                src="@/assets/img/flags/fr.png"
                                class="me-2 avatar avatar-sm avatar-rounded"
                                alt="Img"
                              />
                              French
                            </h6>
                          </td>
                          <td>fr</td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>1620</td>
                          <td>324</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="circle-progress" data-value="20">
                                <span class="progress-left">
                                  <span class="progress-bar border-danger"></span>
                                </span>
                                <span class="progress-right">
                                  <span class="progress-bar border-danger"></span>
                                </span>
                              </div>
                              <div class="progress-value ms-2">20%</div>
                            </div>
                          </td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="d-flex align-items-center">
                              <a
                                href="javascript:void(0);"
                                class="btn btn-sm btn-icon btn-light border me-2"
                              >
                                <i class="ti ti-download"></i>
                              </a>
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >Web</router-link
                              >
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >App</router-link
                              >
                              <router-link
                                to="/website-settings/language-web"
                                class="btn btn-sm border me-2"
                                >Admin</router-link
                              >
                              <a href="javascript:void(0);" class="btn btn-sm btn-icon btn-light border">
                                <i class="ti ti-trash"></i>
                              </a>
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
</template>
<script>
export default {
  data() {
    return {
      title: "Settings",
      text: "Administration",
      text1: "Settings",
      WerSel: ["Spanish", "English", "Spanish"],
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

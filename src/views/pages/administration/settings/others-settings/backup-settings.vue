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
                <h4>Backup</h4>
              </div>
            </div>
            <div class="card-body pb-0">
              <div class="d-flex align-items-center justify-content-between">
                <nav class="nav nav-pills flex-column flex-sm-row" role="tablist">
                  <a
                    class="flex-sm-fill text-sm-center nav-link tab-dark active"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-current="page"
                    href="#system-backup"
                    aria-selected="true"
                    >System Backup</a
                  >
                  <a
                    class="flex-sm-fill text-sm-center nav-link tab-dark"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-current="page"
                    href="#database-backup"
                    aria-selected="false"
                    >Database Backup</a
                  >
                </nav>
                <a
                  href="javascript:void(0);"
                  class="btn btn-sm btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#generate_backup"
                  >Generate Backup</a
                >
              </div>
              <div class="tab-content mt-3">
                <div
                  class="tab-pane show active text-muted"
                  id="system-backup"
                  role="tabpanel"
                >
                  <div class="card mb-3">
                    <div
                      class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                    >
                      <h5>System Backup List</h5>
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
                              <th>File Name</th>
                              <th>Date</th>
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
                                <p class="fs-14 fw-medium text-dark">
                                  Transaction_Logs_Backup_2024_09_Weekly.txt
                                </p>
                              </td>
                              <td>11 Sep 2024</td>
                              <td>
                                <div class="action-icon d-inline-flex">
                                  <a href="javascript:void(0);" class="me-2"
                                    ><i class="ti ti-download"></i
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
                                <p class="fs-14 fw-medium text-dark">
                                  Scheduled_Tasks_Backup_Sep_2024.txt
                                </p>
                              </td>
                              <td>11 Sep 2024</td>
                              <td>
                                <div class="action-icon d-inline-flex">
                                  <a href="javascript:void(0);" class="me-2"
                                    ><i class="ti ti-download"></i
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
                                <p class="fs-14 fw-medium text-dark">
                                  Employee_Session_Log_Sep_2024.txt
                                </p>
                              </td>
                              <td>11 Sep 2024</td>
                              <td>
                                <div class="action-icon d-inline-flex">
                                  <a href="javascript:void(0);" class="me-2"
                                    ><i class="ti ti-download"></i
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
                <div
                  class="tab-pane show text-muted"
                  id="database-backup"
                  role="tabpanel"
                >
                  <div class="card mb-3">
                    <div
                      class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                    >
                      <h5>Datebase Backup List</h5>
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
                                    id="select-all2"
                                  />
                                </div>
                              </th>
                              <th>File Name</th>
                              <th>Date</th>
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
                                <p class="fs-14 fw-medium text-dark">
                                  Full_Database_Backup_2024-09-11.sql
                                </p>
                              </td>
                              <td>11 Sep 2024</td>
                              <td>
                                <div class="action-icon d-inline-flex">
                                  <a href="javascript:void(0);" class="me-2"
                                    ><i class="ti ti-download"></i
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
                                <p class="fs-14 fw-medium text-dark">
                                  Full_Database_Backup_2024-09-11.sql
                                </p>
                              </td>
                              <td>11 Sep 2024</td>
                              <td>
                                <div class="action-icon d-inline-flex">
                                  <a href="javascript:void(0);" class="me-2"
                                    ><i class="ti ti-download"></i
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
                                <p class="fs-14 fw-medium text-dark">
                                  Full_Database_Backup_2024-09-11.sql
                                </p>
                              </td>
                              <td>11 Sep 2024</td>
                              <td>
                                <div class="action-icon d-inline-flex">
                                  <a href="javascript:void(0);" class="me-2"
                                    ><i class="ti ti-download"></i
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
  <backup-modal></backup-modal>
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

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
        <app-sidebar></app-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body">
              <div
                class="border-bottom d-flex align-items-center justify-content-between pb-3 mb-3"
              >
                <h4>Leave Type</h4>
                <div>
                  <a
                    href="javascript:void(0);"
                    data-bs-toggle="modal"
                    data-bs-target="#add_leaves"
                    class="btn btn-primary d-flex align-items-center"
                    ><i class="ti ti-circle-plus me-2"></i>Add Leave Type</a
                  >
                </div>
              </div>
              <div class="card-body p-0">
                <div class="card mb-0">
                  <div
                    class="card-header d-flex align-items-center justify-content-between"
                  >
                    <h6>Leave Type List</h6>
                  </div>
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
                          <th>Leave Type</th>
                          <th>Leave Days</th>
                          <th>Status</th>
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
                          <td class="text-dark">Annual Leave</td>
                          <td>12</td>

                          <td>
                            <span class="badge badge-success"
                              ><i class="ti ti-point-filled"></i>Active</span
                            >
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_leaves"
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
                          <td class="text-dark">Medical Leave</td>
                          <td>12</td>

                          <td>
                            <span class="badge badge-success"
                              ><i class="ti ti-point-filled"></i>Active</span
                            >
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_leaves"
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
                          <td class="text-dark">Casual Leave</td>
                          <td>12</td>

                          <td>
                            <span class="badge badge-success"
                              ><i class="ti ti-point-filled"></i>Active</span
                            >
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_leaves"
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
                          <td class="text-dark">Other Leave</td>
                          <td>12</td>

                          <td>
                            <span class="badge badge-success"
                              ><i class="ti ti-point-filled"></i>Active</span
                            >
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_leaves"
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
  <leave-type-modal></leave-type-modal>
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

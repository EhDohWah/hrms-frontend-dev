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
        <financial-sidebar></financial-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-header px-0 mx-3">
              <div class="row g-3 align-items-center">
                <div class="col-md-6 col-sm-4">
                  <h4>Tax Rates</h4>
                </div>
                <div class="col-md-6 col-sm-8">
                  <div
                    class="d-flex justify-content-sm-end align-items-center flex-wrap row-gap-2"
                  >
                    <a
                      href="javascript:void(0);"
                      class="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#add_tax_rate"
                      ><i class="ti ti-circle-plus me-2"></i>Add Tax Rate</a
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body pb-0">
              <div class="card mb-3">
                <div
                  class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                >
                  <h5>Tax Rate List</h5>
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
                          <th>Tax Rate</th>
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
                          <td>
                            <h6 class="d-flex align-items-center fw-medium">VAT</h6>
                          </td>
                          <td>16%</td>
                          <td>
                            <span
                              class="badge badge-success d-inline-flex align-items-center badge-xs"
                            >
                              <i class="ti ti-point-filled me-1"></i>Active
                            </span>
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_tax_rate"
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
                            <h6 class="d-flex align-items-center fw-medium">GST</h6>
                          </td>
                          <td>14%</td>
                          <td>
                            <span
                              class="badge badge-success d-inline-flex align-items-center badge-xs"
                            >
                              <i class="ti ti-point-filled me-1"></i>Active
                            </span>
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_tax_rate"
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
                            <h6 class="d-flex align-items-center fw-medium">HST</h6>
                          </td>
                          <td>12%</td>
                          <td>
                            <span
                              class="badge badge-success d-inline-flex align-items-center badge-xs"
                            >
                              <i class="ti ti-point-filled me-1"></i>Active
                            </span>
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_tax_rate"
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

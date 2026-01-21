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
        <general-sidebar></general-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-3">
                <h4>Notifications</h4>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th class="w-75 ps-2 border-0">Modules</th>
                      <th class="border-0">Push</th>
                      <th class="border-0">SMS</th>
                      <th class="pe-0 border-0">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="ps-0">
                        <h5 class="mb-1 fw-medium">
                          New Hire and Onboarding Notifications
                        </h5>
                        <p>Alerts when a new hire is added to the system.</p>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td class="pe-0">
                        <div class="form-check form-check-md form-switch">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="ps-0">
                        <h5 class="mb-1 fw-medium">Time Off and Leave Requests</h5>
                        <p>Notifications when leave requests are approved or rejected.</p>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td class="pe-0">
                        <div class="form-check form-check-md form-switch">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="ps-0">
                        <h5 class="mb-1 fw-medium">
                          Employee Performance and Review Updates
                        </h5>
                        <p>Notifications when leave requests are approved or rejected.</p>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td class="pe-0">
                        <div class="form-check form-check-md form-switch">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="ps-0">
                        <h5 class="mb-1 fw-medium">Payroll and Compensation</h5>
                        <p>Alerts when payroll is processed or pending approval.</p>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td class="pe-0">
                        <div class="form-check form-check-md form-switch">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="ps-0">
                        <h5 class="mb-1 fw-medium">Job Applications and Recruitment</h5>
                        <p>Alerts for new applications or stage updates.</p>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td>
                        <div class="form-check form-check-md form-switch me-2">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
                        </div>
                      </td>
                      <td class="pe-0">
                        <div class="form-check form-check-md form-switch">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                            checked
                          />
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

<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";

export default {
  data() {
    return {
      title: "Jobs",
      text: "Administration",
      text1: "Jobs",
    };
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
  setup() {
    const dateRangeInput = ref(null);

    // Move the function declaration outside of the onMounted callback
    function booking_range(start, end) {
      return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
    }

    onMounted(() => {
      if (dateRangeInput.value) {
        const start = moment().subtract(6, "days");
        const end = moment();

        new DateRangePicker(
          dateRangeInput.value,
          {
            startDate: start,
            endDate: end,
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              "Last 7 Days": [moment().subtract(6, "days"), moment()],
              "Last 30 Days": [moment().subtract(29, "days"), moment()],
              "This Month": [moment().startOf("month"), moment().endOf("month")],
              "Last Month": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
              ],
            },
          },
          booking_range
        );

        booking_range(start, end);
      }
    });

    return {
      dateRangeInput,
    };
  },
};
</script>

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
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <div class="d-flex align-items-center border bg-white rounded p-1 me-2">
              <router-link to="/recuritment/job-list" class="btn btn-icon btn-sm me-1"
                ><i class="ti ti-list-tree"></i
              ></router-link>
              <router-link
                to="/recuritment/job-grid"
                class="btn btn-icon btn-sm active bg-primary text-white"
                ><i class="ti ti-layout-grid"></i
              ></router-link>
            </div>
          </div>
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-pdf me-1"></i>Export as PDF</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-2">
            <a
              href="javascript:void(0);"
              data-bs-toggle="modal"
              data-bs-target="#add_post"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Post Job</a
            >
          </div>
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
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-body p-3">
          <div class="d-flex align-items-center justify-content-between">
            <h5>Job Grid</h5>
            <div
              class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3"
            >
              <div class="me-3">
                <div class="input-icon-end position-relative">
                  <input
                    type="text"
                    class="form-control date-range bookingrange"
                    placeholder="dd/mm/yyyy - dd/mm/yyyy"
                  />
                  <span class="input-icon-addon">
                    <i class="ti ti-chevron-down"></i>
                  </span>
                </div>
              </div>
              <div class="dropdown me-3">
                <a
                  href="javascript:void(0);"
                  class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Role
                </a>
                <ul class="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Senior IOS Developer</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Junior PHP Developer</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Network Engineer</a
                    >
                  </li>
                </ul>
              </div>
              <div class="dropdown me-3">
                <a
                  href="javascript:void(0);"
                  class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Status
                </a>
                <ul class="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Active</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Inactive</a
                    >
                  </li>
                </ul>
              </div>
              <div class="dropdown">
                <a
                  href="javascript:void(0);"
                  class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Sort By : Last 7 Days
                </a>
                <ul class="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Recently Added</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Ascending</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Desending</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Last Month</a
                    >
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                      >Last 7 Days</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/apple.svg"
                          class="w-auto h-auto"
                          alt="icon"
                      /></span>
                    </a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">Senior IOS Developer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  New York, USA
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  30, 000 - 35, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  2 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/php.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">Junior PHP Developer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  Los Angeles, USA
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  20, 000 - 25, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  4 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/black.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">Network Engineer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  Bristol, UK
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  30, 000 - 35, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  1 year of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/react.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">React Developer </a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  Birmingham, UK
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  28, 000 - 32, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  3 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/laravel.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">Laravel Developer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  Washington, USA
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  32, 000 - 36, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  1 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/devops.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">DevOps Engineer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  Coventry, UK
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  25, 000 - 35, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  6 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/android.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">Android Developer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  Chicago, USA
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  28, 000 - 32, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  5 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/html.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">HTML Developer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  Carlisle, UK
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  25, 000 - 28, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  3 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/ui.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">UI/UX Designer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  UI/UX Designer
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  20, 000 - 25, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  4 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/grafic.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">Senior IOS Developer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  San Diego, USA
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  22, 000 - 28, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  3 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray"
                        ><img
                          src="@/assets/img/icons/angular.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">Angular Developer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  Sheffield, UK
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  28, 000 - 30, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  2 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="card bg-light">
                <div class="card-body p-3">
                  <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="me-2">
                      <span class="avatar avatar-lg bg-gray-100"
                        ><img
                          src="@/assets/img/icons/nodejs.svg"
                          class="w-auto h-auto"
                          alt="icon" /></span
                    ></a>
                    <div>
                      <h6 class="fw-medium mb-1 text-truncate">
                        <a href="javascript:void(0);">Node js Developer</a>
                      </h6>
                      <p class="fs-12 text-gray fw-normal">25 Applicants</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-3">
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-map-pin-check text-gray-5 me-2"></i>
                  Boston, USA
                </p>
                <p class="text-dark d-inline-flex align-items-center mb-2">
                  <i class="ti ti-currency-dollar text-gray-5 me-2"></i>
                  25, 000 - 28, 000 / month
                </p>
                <p class="text-dark d-inline-flex align-items-center">
                  <i class="ti ti-briefcase text-gray-5 me-2"></i>
                  3 years of experience
                </p>
              </div>
              <div class="mb-3">
                <span class="badge badge-pink-transparent me-1">Full Time</span>
                <span class="badge bg-secondary-transparent">Expert</span>
              </div>
              <div class="progress progress-xs mb-2">
                <div
                  class="progress-bar bg-warning"
                  role="progressbar"
                  style="width: 30%"
                ></div>
              </div>
              <div>
                <p class="fs-12 text-gray fw-normal">10 of 25 filled</p>
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

  <job-grid-modal></job-grid-modal>
</template>

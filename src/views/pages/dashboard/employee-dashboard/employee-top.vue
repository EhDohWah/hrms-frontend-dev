<template>
  <div class="alert bg-secondary-transparent alert-dismissible fade show mb-4">
    Your Leave Request on“24th April 2024”has been Approved!!!
    <button
      type="button"
      class="btn-close fs-14"
      data-bs-dismiss="alert"
      aria-label="Close"
    >
      <i class="ti ti-x"></i>
    </button>
  </div>
  <div class="row">
    <div class="col-xl-4 d-flex">
      <div class="card position-relative flex-fill">
        <div class="card-header bg-dark">
          <div class="d-flex align-items-center">
            <span
              class="avatar avatar-lg avatar-rounded border border-white border-2 flex-shrink-0 me-2"
            >
              <img src="@/assets/img/users/user-01.jpg" alt="Img" />
            </span>
            <div>
              <h5 class="text-white mb-1">Stephan Peralt</h5>
              <div class="d-flex align-items-center">
                <p class="text-white fs-12 mb-0">Senior Product Designer</p>
                <span class="mx-1"><i class="ti ti-point-filled text-primary"></i></span>
                <p class="fs-12">UI/UX Design</p>
              </div>
            </div>
          </div>
          <a href="javascript:void(0);" class="btn btn-icon btn-sm text-white rounded-circle edit-top"
            ><i class="ti ti-edit"></i
          ></a>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <span class="d-block mb-1 fs-13">Phone Number</span>
            <p class="text-gray-9">+1 324 3453 545</p>
          </div>
          <div class="mb-3">
            <span class="d-block mb-1 fs-13">Email Address</span>
            <p class="text-gray-9">Steperde124@example.com</p>
          </div>
          <div class="mb-3">
            <span class="d-block mb-1 fs-13">Report Office</span>
            <p class="text-gray-9">Doglas Martini</p>
          </div>
          <div>
            <span class="d-block mb-1 fs-13">Joined on</span>
            <p class="text-gray-9">15 Jan 2024</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-5 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Leave Details</h5>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="btn btn-white border btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-calendar me-1"></i>2024
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">2024</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">2023</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">2022</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="mb-3">
                <div class="mb-3">
                  <p class="d-flex align-items-center">
                    <i class="ti ti-circle-filled fs-8 text-dark me-1"></i>
                    <span class="text-gray-9 fw-semibold me-1">1254</span>
                    on time
                  </p>
                </div>
                <div class="mb-3">
                  <p class="d-flex align-items-center">
                    <i class="ti ti-circle-filled fs-8 text-success me-1"></i>
                    <span class="text-gray-9 fw-semibold me-1">32</span>
                    Late Attendance
                  </p>
                </div>
                <div class="mb-3">
                  <p class="d-flex align-items-center">
                    <i class="ti ti-circle-filled fs-8 text-primary me-1"></i>
                    <span class="text-gray-9 fw-semibold me-1">658</span>
                    Work From Home
                  </p>
                </div>
                <div class="mb-3">
                  <p class="d-flex align-items-center">
                    <i class="ti ti-circle-filled fs-8 text-danger me-1"></i>
                    <span class="text-gray-9 fw-semibold me-1">14</span>
                    Absent
                  </p>
                </div>
                <div>
                  <p class="d-flex align-items-center">
                    <i class="ti ti-circle-filled fs-8 text-warning me-1"></i>
                    <span class="text-gray-9 fw-semibold me-1">68</span>
                    Sick Leave
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3 d-flex justify-content-md-end">
                <div id="leaves_chart">
                  <apexchart
                    type="donut"
                    height="200"
                    :options="leaveChart.leave"
                    :series="leaveChart.series"
                  >
                  </apexchart>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox" id="todo1" />
                <label class="form-check-label" for="todo1"
                  >Better than <span class="text-gray-9">85%</span> of Employees</label
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-3 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Leave Details</h5>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="btn btn-white border btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-calendar me-1"></i>2024
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">2024</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">2023</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">2022</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-sm-6">
              <div class="mb-4">
                <span class="d-block mb-1">Total Leaves</span>
                <h4>16</h4>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="mb-4">
                <span class="d-block mb-1">Taken</span>
                <h4>10</h4>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="mb-4">
                <span class="d-block mb-1">Absent</span>
                <h4>2</h4>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="mb-4">
                <span class="d-block mb-1">Request</span>
                <h4>0</h4>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="mb-4">
                <span class="d-block mb-1">Worked Days</span>
                <h4>240</h4>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="mb-4">
                <span class="d-block mb-1">Loss of Pay</span>
                <h4>2</h4>
              </div>
            </div>
            <div class="col-sm-12">
              <div>
                <a
                  href="javascript:void(0);"
                  class="btn btn-dark w-100"
                  data-bs-toggle="modal"
                  data-bs-target="#add_leaves"
                  >Apply New Leave</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { leaveChart } from "./data";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      leaveChart: leaveChart,
    };
  },
};
</script>

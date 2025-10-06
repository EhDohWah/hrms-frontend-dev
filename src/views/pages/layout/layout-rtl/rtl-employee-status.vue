<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import { attendancejs } from "./data";

export default {
  data() {
    return {
      attendancejs: attendancejs,
    };
  },
  components: {
    Vue3ChartJs,
  },
};
</script>

<template>
  <div class="row">
    <!-- Total Employee -->
    <div class="col-xxl-4 d-flex">
      <div class="card flex-fill">
        <div class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 class="mb-2">Employee Status</h5>
          <div class="dropdown mb-2">
            <a href="javascript:void(0);" class="btn btn-white border btn-sm d-inline-flex align-items-center"
              data-bs-toggle="dropdown">
              <i class="ti ti-calendar ms-1"></i>This Week
            </a>
            <ul class="dropdown-menu dropdown-menu-end p-3">
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">This Month</a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">This Week</a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">Today</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <p class="fs-13 mb-3">Total Employee</p>
            <h3 class="mb-3">154</h3>
          </div>
          <div class="progress-stacked emp-stack mb-3">
            <div class="progress" role="progressbar" aria-label="Segment one" aria-valuenow="15" aria-valuemin="0"
              aria-valuemax="100" style="width: 40%">
              <div class="progress-bar bg-warning"></div>
            </div>
            <div class="progress" role="progressbar" aria-label="Segment two" aria-valuenow="30" aria-valuemin="0"
              aria-valuemax="100" style="width: 20%">
              <div class="progress-bar bg-secondary"></div>
            </div>
            <div class="progress" role="progressbar" aria-label="Segment three" aria-valuenow="20" aria-valuemin="0"
              aria-valuemax="100" style="width: 10%">
              <div class="progress-bar bg-danger"></div>
            </div>
            <div class="progress" role="progressbar" aria-label="Segment four" aria-valuenow="20" aria-valuemin="0"
              aria-valuemax="100" style="width: 30%">
              <div class="progress-bar bg-pink"></div>
            </div>
          </div>
          <div class="border mb-3">
            <div class="row gx-0">
              <div class="col-6">
                <div class="p-2 flex-fill border-end border-bottom">
                  <p class="fs-13 mb-2">
                    <i class="ti ti-square-filled text-primary fs-12 ms-2"></i>Fulltime
                    <span class="text-gray-9">(48%)</span>
                  </p>
                  <h2 class="display-1">112</h2>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 flex-fill border-bottom">
                  <p class="fs-13 mb-2">
                    <i class="ti ti-square-filled ms-2 text-secondary fs-12"></i>Contract
                    <span class="text-gray-9">(20%)</span>
                  </p>
                  <h2 class="display-1">112</h2>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 flex-fill border-end">
                  <p class="fs-13 mb-2">
                    <i class="ti ti-square-filled ms-2 text-danger fs-12"></i>Probation
                    <span class="text-gray-9">(22%)</span>
                  </p>
                  <h2 class="display-1">12</h2>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 flex-fill">
                  <p class="fs-13 mb-2">
                    <i class="ti ti-square-filled text-pink ms-2 fs-12"></i>WFH
                    <span class="text-gray-9">(20%)</span>
                  </p>
                  <h2 class="display-1">04</h2>
                </div>
              </div>
            </div>
          </div>
          <h6 class="mb-2">Top Performer</h6>
          <div
            class="p-2 d-flex align-items-center justify-content-between border border-primary bg-primary-100 br-5 mb-4">
            <div class="d-flex align-items-center overflow-hidden">
              <span class="ms-2">
                <i class="ti ti-award-filled text-primary fs-24"></i>
              </span>
              <router-link to="/employee/employee-details" class="avatar avatar-md ms-2">
                <img src="@/assets/img/profiles/avatar-24.jpg" class="rounded-circle border border-white" alt="img" />
              </router-link>
              <div>
                <h6 class="text-truncate mb-1 fs-14 fw-medium">
                  <router-link to="/employee/employee-details">Daniel Esbella</router-link>
                </h6>
                <p class="fs-13">IOS Developer</p>
              </div>
            </div>
            <div>
              <p class="fs-13 mb-1">Performance</p>
              <h5 class="text-primary">99%</h5>
            </div>
          </div>
          <router-link to="/employee/employee-list" class="btn btn-light btn-md w-100">View All Employees</router-link>
        </div>
      </div>
    </div>
    <!-- /Total Employee -->

    <!-- Attendance Overview -->
    <div class="col-xxl-4 col-xl-6 d-flex">
      <div class="card flex-fill">
        <div class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 class="mb-2">Attendance Overview</h5>
          <div class="dropdown mb-2">
            <a href="javascript:void(0);" class="btn btn-white border btn-sm d-inline-flex align-items-center"
              data-bs-toggle="dropdown">
              <i class="ti ti-calendar ms-1"></i>Today
            </a>
            <ul class="dropdown-menu dropdown-menu-end p-3">
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">This Month</a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">This Week</a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">Today</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body">
          <div class="chartjs-wrapper-demo position-relative mb-4">
            <vue3-chart-js id="attendance" height="200" class="chartjs-chart"
              v-bind="{ ...attendancejs }"></vue3-chart-js>
            <div class="position-absolute text-center attendance-canvas">
              <p class="fs-13 mb-1">Total Attendance</p>
              <h3>120</h3>
            </div>
          </div>
          <h6 class="mb-3">Status</h6>
          <div class="d-flex align-items-center justify-content-between">
            <p class="f-13 mb-2">
              <i class="ti ti-circle-filled text-success ms-1"></i>Present
            </p>
            <p class="f-13 fw-medium text-gray-9 mb-2">59%</p>
          </div>
          <div class="d-flex align-items-center justify-content-between">
            <p class="f-13 mb-2">
              <i class="ti ti-circle-filled text-secondary ms-1"></i>Late
            </p>
            <p class="f-13 fw-medium text-gray-9 mb-2">21%</p>
          </div>
          <div class="d-flex align-items-center justify-content-between">
            <p class="f-13 mb-2">
              <i class="ti ti-circle-filled text-warning ms-1"></i>Permission
            </p>
            <p class="f-13 fw-medium text-gray-9 mb-2">2%</p>
          </div>
          <div class="d-flex align-items-center justify-content-between mb-2">
            <p class="f-13 mb-2">
              <i class="ti ti-circle-filled text-danger ms-1"></i>Absent
            </p>
            <p class="f-13 fw-medium text-gray-9 mb-2">15%</p>
          </div>
          <div class="bg-light br-5 box-shadow-xs p-2 pb-0 d-flex align-items-center justify-content-between flex-wrap">
            <div class="d-flex align-items-center">
              <p class="mb-2 ms-2">Total Absenties</p>
              <div class="avatar-list-stacked avatar-group-sm mb-2">
                <span class="avatar avatar-rounded">
                  <img class="border border-white" src="@/assets/img/profiles/avatar-27.jpg" alt="img" />
                </span>
                <span class="avatar avatar-rounded">
                  <img class="border border-white" src="@/assets/img/profiles/avatar-30.jpg" alt="img" />
                </span>
                <span class="avatar avatar-rounded">
                  <img src="@/assets/img/profiles/avatar-14.jpg" alt="img" />
                </span>
                <span class="avatar avatar-rounded">
                  <img src="@/assets/img/profiles/avatar-29.jpg" alt="img" />
                </span>
                <a class="avatar bg-primary avatar-rounded text-fixed-white fs-10" href="javascript:void(0);">
                  +1
                </a>
              </div>
            </div>
            <router-link to="/leave/admin/leaves-admin" class="fs-13 link-primary text-decoration-underline mb-2">View
              Details</router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- /Attendance Overview -->

    <!-- Clock-In/Out -->
    <div class="col-xxl-4 col-xl-6 d-flex">
      <div class="card flex-fill">
        <div class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 class="mb-2">Clock-In/Out</h5>
          <div class="d-flex align-items-center">
            <div class="dropdown mb-2">
              <a href="javascript:void(0);"
                class="dropdown-toggle btn btn-white btn-sm d-inline-flex align-items-center border-0 fs-13 ms-2"
                data-bs-toggle="dropdown">
                All Departments
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Finance</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Development</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Marketing</a>
                </li>
              </ul>
            </div>
            <div class="dropdown mb-2">
              <a href="javascript:void(0);" class="btn btn-white border btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown">
                <i class="ti ti-calendar ms-1"></i>Today
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">This Month</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">This Week</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Today</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div>
            <div class="d-flex align-items-center justify-content-between mb-3 p-2 border border-dashed br-5">
              <div class="d-flex align-items-center">
                <a href="javascript:void(0);" class="avatar flex-shrink-0">
                  <img src="@/assets/img/profiles/avatar-24.jpg" class="rounded-circle border border-2" alt="img" />
                </a>
                <div class="me-2">
                  <h6 class="fs-14 fw-medium text-truncate">Daniel Esbella</h6>
                  <p class="fs-13">UI/UX Designer</p>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <a href="javascript:void(0);" class="link-default ms-2"><i class="ti ti-clock-share"></i></a>
                <span class="fs-10 fw-medium d-inline-flex align-items-center badge badge-success"><i
                    class="ti ti-circle-filled fs-5 ms-1"></i>09:15</span>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between mb-3 p-2 border br-5">
              <div class="d-flex align-items-center">
                <a href="javascript:void(0);" class="avatar flex-shrink-0">
                  <img src="@/assets/img/profiles/avatar-23.jpg" class="rounded-circle border border-2" alt="img" />
                </a>
                <div class="me-2">
                  <h6 class="fs-14 fw-medium">Doglas Martini</h6>
                  <p class="fs-13">Project Manager</p>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <a href="javascript:void(0);" class="link-default ms-2"><i class="ti ti-clock-share"></i></a>
                <span class="fs-10 fw-medium d-inline-flex align-items-center badge badge-success"><i
                    class="ti ti-circle-filled fs-5 ms-1"></i>09:36</span>
              </div>
            </div>
            <div class="mb-3 p-2 border br-5">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <a href="javascript:void(0);" class="avatar flex-shrink-0">
                    <img src="@/assets/img/profiles/avatar-27.jpg" class="rounded-circle border border-2" alt="img" />
                  </a>
                  <div class="me-2">
                    <h6 class="fs-14 fw-medium text-truncate">Brian Villalobos</h6>
                    <p class="fs-13">PHP Developer</p>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <a href="javascript:void(0);" class="link-default ms-2"><i class="ti ti-clock-share"></i></a>
                  <span class="fs-10 fw-medium d-inline-flex align-items-center badge badge-success"><i
                      class="ti ti-circle-filled fs-5 ms-1"></i>09:15</span>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-between flex-wrap mt-2 border br-5 p-2 pb-0">
                <div>
                  <p class="mb-1 d-inline-flex align-items-center">
                    <i class="ti ti-circle-filled text-success fs-5 ms-1"></i>Clock In
                  </p>
                  <h6 class="fs-13 fw-normal mb-2">10:30 AM</h6>
                </div>
                <div>
                  <p class="mb-1 d-inline-flex align-items-center">
                    <i class="ti ti-circle-filled text-danger fs-5 ms-1"></i>Clock Out
                  </p>
                  <h6 class="fs-13 fw-normal mb-2">09:45 AM</h6>
                </div>
                <div>
                  <p class="mb-1 d-inline-flex align-items-center">
                    <i class="ti ti-circle-filled text-warning fs-5 ms-1"></i>Production
                  </p>
                  <h6 class="fs-13 fw-normal mb-2">09:21 Hrs</h6>
                </div>
              </div>
            </div>
          </div>
          <h6 class="mb-2">Late</h6>
          <div class="d-flex align-items-center justify-content-between mb-3 p-2 border border-dashed br-5">
            <div class="d-flex align-items-center">
              <span class="avatar flex-shrink-0">
                <img src="@/assets/img/profiles/avatar-29.jpg" class="rounded-circle border border-2" alt="img" />
              </span>
              <div class="me-2">
                <h6 class="fs-14 fw-medium text-truncate">
                  Anthony Lewis
                  <span class="fs-10 fw-medium d-inline-flex align-items-center badge badge-success"><i
                      class="ti ti-clock-hour-11 ms-1"></i>30 Min</span>
                </h6>
                <p class="fs-13">Marketing Head</p>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="link-default ms-2"><i class="ti ti-clock-share"></i></a>
              <span class="fs-10 fw-medium d-inline-flex align-items-center badge badge-danger"><i
                  class="ti ti-circle-filled fs-5 ms-1"></i>08:35</span>
            </div>
          </div>
          <router-link to="/reports/attendance-report" class="btn btn-light btn-md w-100">View All
            Attendance</router-link>
        </div>
      </div>
    </div>
    <!-- /Clock-In/Out -->
  </div>
</template>

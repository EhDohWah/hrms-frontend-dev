<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import { mySemiDonutChartjs } from "./data";

export default {
  data() {
    return {
      mySemiDonutChartjs: mySemiDonutChartjs,
    };
  },
  components: {
    Vue3ChartJs,
  },
};
</script>

<template>
  <div class="row">
    <!-- Projects -->
    <div class="col-xxl-8 col-xl-7 d-flex">
      <div class="card flex-fill">
        <div
          class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap"
        >
          <h5 class="mb-2">Projects</h5>
          <div class="d-flex align-items-center">
            <div class="dropdown mb-2">
              <a
                href="javascript:void(0);"
                class="btn btn-white border btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-calendar me-1"></i>This Week
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >This Month</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >This Week</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Today</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-nowrap mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Team</th>
                  <th>Hours</th>
                  <th>Deadline</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <router-link to="/projects/projects-details" class="link-default"
                      >PRO-001</router-link
                    >
                  </td>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/projects/projects-details"
                        >Office Management App</router-link
                      >
                    </h6>
                  </td>
                  <td>
                    <div class="avatar-list-stacked avatar-group-sm">
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-02.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-03.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-05.jpg"
                          alt="img"
                        />
                      </span>
                    </div>
                  </td>
                  <td>
                    <p class="mb-1">15/255 Hrs</p>
                    <div
                      class="progress progress-xs w-100"
                      role="progressbar"
                      aria-valuenow="40"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div class="progress-bar bg-primary" style="width: 40%"></div>
                    </div>
                  </td>
                  <td>12 Sep 2024</td>
                  <td>
                    <span
                      class="badge badge-danger d-inline-flex align-items-center badge-xs"
                    >
                      <i class="ti ti-point-filled me-1"></i>High
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <router-link to="/projects/projects-details" class="link-default"
                      >PRO-002</router-link
                    >
                  </td>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/projects/projects-details"
                        >Clinic Management
                      </router-link>
                    </h6>
                  </td>
                  <td>
                    <div class="avatar-list-stacked avatar-group-sm">
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-06.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-07.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-08.jpg"
                          alt="img"
                        />
                      </span>
                      <a
                        class="avatar bg-primary avatar-rounded text-fixed-white fs-10 fw-medium"
                        href="javascript:void(0);"
                      >
                        +1
                      </a>
                    </div>
                  </td>
                  <td>
                    <p class="mb-1">15/255 Hrs</p>
                    <div
                      class="progress progress-xs w-100"
                      role="progressbar"
                      aria-valuenow="40"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div class="progress-bar bg-primary" style="width: 40%"></div>
                    </div>
                  </td>
                  <td>24 Oct 2024</td>
                  <td>
                    <span
                      class="badge badge-success d-inline-flex align-items-center badge-xs"
                    >
                      <i class="ti ti-point-filled me-1"></i>Low
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <router-link to="/projects/projects-details" class="link-default"
                      >PRO-003</router-link
                    >
                  </td>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/projects/projects-details"
                        >Educational Platform</router-link
                      >
                    </h6>
                  </td>
                  <td>
                    <div class="avatar-list-stacked avatar-group-sm">
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-06.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-08.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-09.jpg"
                          alt="img"
                        />
                      </span>
                    </div>
                  </td>
                  <td>
                    <p class="mb-1">40/255 Hrs</p>
                    <div
                      class="progress progress-xs w-100"
                      role="progressbar"
                      aria-valuenow="50"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div class="progress-bar bg-primary" style="width: 50%"></div>
                    </div>
                  </td>
                  <td>18 Feb 2024</td>
                  <td>
                    <span
                      class="badge badge-pink d-inline-flex align-items-center badge-xs"
                    >
                      <i class="ti ti-point-filled me-1"></i>Medium
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <router-link to="/projects/projects-details" class="link-default"
                      >PRO-004</router-link
                    >
                  </td>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/projects/projects-details"
                        >Chat & Call Mobile App</router-link
                      >
                    </h6>
                  </td>
                  <td>
                    <div class="avatar-list-stacked avatar-group-sm">
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-11.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-12.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-13.jpg"
                          alt="img"
                        />
                      </span>
                    </div>
                  </td>
                  <td>
                    <p class="mb-1">35/155 Hrs</p>
                    <div
                      class="progress progress-xs w-100"
                      role="progressbar"
                      aria-valuenow="50"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div class="progress-bar bg-primary" style="width: 50%"></div>
                    </div>
                  </td>
                  <td>19 Feb 2024</td>
                  <td>
                    <span
                      class="badge badge-danger d-inline-flex align-items-center badge-xs"
                    >
                      <i class="ti ti-point-filled me-1"></i>High
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <router-link to="/projects/projects-details" class="link-default"
                      >PRO-005</router-link
                    >
                  </td>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/projects/projects-details"
                        >Travel Planning Website</router-link
                      >
                    </h6>
                  </td>
                  <td>
                    <div class="avatar-list-stacked avatar-group-sm">
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-17.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-18.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-19.jpg"
                          alt="img"
                        />
                      </span>
                    </div>
                  </td>
                  <td>
                    <p class="mb-1">50/235 Hrs</p>
                    <div
                      class="progress progress-xs w-100"
                      role="progressbar"
                      aria-valuenow="50"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div class="progress-bar bg-primary" style="width: 50%"></div>
                    </div>
                  </td>
                  <td>18 Feb 2024</td>
                  <td>
                    <span
                      class="badge badge-pink d-inline-flex align-items-center badge-xs"
                    >
                      <i class="ti ti-point-filled me-1"></i>Medium
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <router-link to="/projects/projects-details" class="link-default"
                      >PRO-006</router-link
                    >
                  </td>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/projects/projects-details"
                        >Service Booking Software</router-link
                      >
                    </h6>
                  </td>
                  <td>
                    <div class="avatar-list-stacked avatar-group-sm">
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-06.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-08.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-09.jpg"
                          alt="img"
                        />
                      </span>
                    </div>
                  </td>
                  <td>
                    <p class="mb-1">40/255 Hrs</p>
                    <div
                      class="progress progress-xs w-100"
                      role="progressbar"
                      aria-valuenow="50"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div class="progress-bar bg-primary" style="width: 50%"></div>
                    </div>
                  </td>
                  <td>20 Feb 2024</td>
                  <td>
                    <span
                      class="badge badge-success d-inline-flex align-items-center badge-xs"
                    >
                      <i class="ti ti-point-filled me-1"></i>Low
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="border-0">
                    <router-link to="/projects/projects-details" class="link-default"
                      >PRO-008</router-link
                    >
                  </td>
                  <td class="border-0">
                    <h6 class="fw-medium">
                      <router-link to="/projects/projects-details"
                        >Travel Planning Website</router-link
                      >
                    </h6>
                  </td>
                  <td class="border-0">
                    <div class="avatar-list-stacked avatar-group-sm">
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-15.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-16.jpg"
                          alt="img"
                        />
                      </span>
                      <span class="avatar avatar-rounded">
                        <img
                          class="border border-white"
                          src="@/assets/img/profiles/avatar-17.jpg"
                          alt="img"
                        />
                      </span>
                      <a
                        class="avatar bg-primary avatar-rounded text-fixed-white fs-10 fw-medium"
                        href="javascript:void(0);"
                      >
                        +2
                      </a>
                    </div>
                  </td>
                  <td class="border-0">
                    <p class="mb-1">15/255 Hrs</p>
                    <div
                      class="progress progress-xs w-100"
                      role="progressbar"
                      aria-valuenow="45"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div class="progress-bar bg-primary" style="width: 45%"></div>
                    </div>
                  </td>
                  <td class="border-0">17 Oct 2024</td>
                  <td class="border-0">
                    <span
                      class="badge badge-pink d-inline-flex align-items-center badge-xs"
                    >
                      <i class="ti ti-point-filled me-1"></i>Medium
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- /Projects -->

    <!-- Tasks Statistics -->
    <div class="col-xxl-4 col-xl-5 d-flex">
      <div class="card flex-fill">
        <div
          class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap"
        >
          <h5 class="mb-2">Tasks Statistics</h5>
          <div class="d-flex align-items-center">
            <div class="dropdown mb-2">
              <a
                href="javascript:void(0);"
                class="btn btn-white border btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-calendar me-1"></i>This Week
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >This Month</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >This Week</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Today</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="chartjs-wrapper-demo position-relative mb-4">
            <vue3-chart-js
              id="mySemiDonutChart"
              class="chartjs-chart"
              height="200"
              v-bind="{ ...mySemiDonutChartjs }"
            ></vue3-chart-js>
            <div class="position-absolute text-center attendance-canvas">
              <p class="fs-13 mb-1">Total Tasks</p>
              <h3>124/165</h3>
            </div>
          </div>
          <div class="d-flex align-items-center flex-wrap">
            <div class="border-end text-center me-2 pe-2 mb-3">
              <p class="fs-13 d-inline-flex align-items-center mb-1">
                <i class="ti ti-circle-filled fs-10 me-1 text-warning"></i>Ongoing
              </p>
              <h5>24%</h5>
            </div>
            <div class="border-end text-center me-2 pe-2 mb-3">
              <p class="fs-13 d-inline-flex align-items-center mb-1">
                <i class="ti ti-circle-filled fs-10 me-1 text-info"></i>On Hold
              </p>
              <h5>10%</h5>
            </div>
            <div class="border-end text-center me-2 pe-2 mb-3">
              <p class="fs-13 d-inline-flex align-items-center mb-1">
                <i class="ti ti-circle-filled fs-10 me-1 text-danger"></i>Overdue
              </p>
              <h5>16%</h5>
            </div>
            <div class="text-center me-2 pe-2 mb-3">
              <p class="fs-13 d-inline-flex align-items-center mb-1">
                <i class="ti ti-circle-filled fs-10 me-1 text-success"></i>Ongoing
              </p>
              <h5>40%</h5>
            </div>
          </div>
          <div
            class="bg-dark br-5 p-3 pb-0 d-flex align-items-center justify-content-between"
          >
            <div class="mb-2">
              <h4 class="text-success">389/689 hrs</h4>
              <p class="fs-13 mb-0">Spent on Overall Tasks This Week</p>
            </div>
            <router-link
              to="/projects/tasks"
              class="btn btn-sm btn-light mb-2 text-nowrap"
              >View All</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <!-- /Tasks Statistics -->
  </div>
</template>

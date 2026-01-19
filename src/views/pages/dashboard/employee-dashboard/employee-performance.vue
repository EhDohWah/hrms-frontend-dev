<template>
  <div class="row">
    <div class="col-xl-5 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Performance</h5>
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
          <div>
            <div class="bg-light d-flex align-items-center rounded p-2">
              <h3 class="me-2">98%</h3>
              <span
                class="badge badge-outline-success bg-success-transparent rounded-pill me-1"
                >12%</span
              >
              <span>vs last years</span>
            </div>
            <div id="performance_chart2">
              <apexchart
                type="area"
                height="273"
                :options="performanceCharts.performance"
                :series="performanceCharts.series"
              >
              </apexchart>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-4 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>My Skills</h5>
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
          <div>
            <div class="border border-dashed bg-transparent-light rounded p-2 mb-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <span
                    class="d-block border border-2 h-12 border-primary rounded-5 me-2"
                  ></span>
                  <div>
                    <h6 class="fw-medium mb-1">Figma</h6>
                    <p>Updated : 15 May 2025</p>
                  </div>
                </div>
                <div class="circle-progress circle-progress-md" data-value="95">
                  <circle-progress :percent="95" />
                  <span class="progress-left">
                    <span class="progress-bar border-primary"></span>
                  </span>
                  <span class="progress-right">
                    <span class="progress-bar border-primary"></span>
                  </span>
                  <div class="progress-value">95%</div>
                </div>
              </div>
            </div>
            <div class="border border-dashed bg-transparent-light rounded p-2 mb-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <span
                    class="d-block border border-2 h-12 border-success rounded-5 me-2"
                  ></span>
                  <div>
                    <h6 class="fw-medium mb-1">HTML</h6>
                    <p>Updated : 12 May 2025</p>
                  </div>
                </div>
                <div class="circle-progress circle-progress-md" data-value="85">
                  <circle-progress :percent="85" />
                  <span class="progress-left">
                    <span class="progress-bar border-success"></span>
                  </span>
                  <span class="progress-right">
                    <span class="progress-bar border-success"></span>
                  </span>
                  <div class="progress-value">85%</div>
                </div>
              </div>
            </div>
            <div class="border border-dashed bg-transparent-light rounded p-2 mb-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <span
                    class="d-block border border-2 h-12 border-purple rounded-5 me-2"
                  ></span>
                  <div>
                    <h6 class="fw-medium mb-1">CSS</h6>
                    <p>Updated : 12 May 2025</p>
                  </div>
                </div>
                <div class="circle-progress circle-progress-md" data-value="70">
                  <circle-progress :percent="70" />
                  <span class="progress-left">
                    <span class="progress-bar border-purple"></span>
                  </span>
                  <span class="progress-right">
                    <span class="progress-bar border-purple"></span>
                  </span>
                  <div class="progress-value">70%</div>
                </div>
              </div>
            </div>
            <div class="border border-dashed bg-transparent-light rounded p-2 mb-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <span
                    class="d-block border border-2 h-12 border-info rounded-5 me-2"
                  ></span>
                  <div>
                    <h6 class="fw-medium mb-1">Wordpress</h6>
                    <p>Updated : 15 May 2025</p>
                  </div>
                </div>
                <div class="circle-progress circle-progress-md" data-value="61">
                  <circle-progress :percent="61" />
                  <span class="progress-left">
                    <span class="progress-bar border-info"></span>
                  </span>
                  <span class="progress-right">
                    <span class="progress-bar border-info"></span>
                  </span>
                  <div class="progress-value">61%</div>
                </div>
              </div>
            </div>
            <div class="border border-dashed bg-transparent-light rounded p-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <span
                    class="d-block border border-2 h-12 border-dark rounded-5 me-2"
                  ></span>
                  <div>
                    <h6 class="fw-medium mb-1">Javascript</h6>
                    <p>Updated : 13 May 2025</p>
                  </div>
                </div>
                <div class="circle-progress circle-progress-md" data-value="58">
                  <circle-progress :percent="58" />
                  <span class="progress-left">
                    <span class="progress-bar border-dark"></span>
                  </span>
                  <span class="progress-right">
                    <span class="progress-bar border-dark"></span>
                  </span>
                  <div class="progress-value">58%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-3 d-flex">
      <div class="flex-fill">
        <div class="card card-bg-5 bg-dark mb-3">
          <div class="card-body">
            <div class="text-center">
              <h5 class="text-white mb-4">Team Birthday</h5>
              <span class="avatar avatar-xl avatar-rounded mb-2">
                <img src="@/assets/img/users/user-35.jpg" alt="Img" />
              </span>
              <div class="mb-3">
                <h6 class="text-white fw-medium mb-1">Andrew Jermia</h6>
                <p>IOS Developer</p>
              </div>
              <a href="javascript:void(0);" class="btn btn-sm btn-primary">Send Wishes</a>
            </div>
          </div>
        </div>
        <div class="card bg-secondary mb-3">
          <div class="card-body d-flex align-items-center justify-content-between p-3">
            <div>
              <h5 class="text-white mb-1">Leave Policy</h5>
              <p class="text-white">Last Updated : Today</p>
            </div>
            <a href="javascript:void(0);" class="btn btn-white btn-sm px-3">View All</a>
          </div>
        </div>
        <div class="card bg-warning">
          <div class="card-body d-flex align-items-center justify-content-between p-3">
            <div>
              <h5 class="mb-1">Next Holiday</h5>
              <p class="text-gray-9">Diwali, 15 Sep 2025</p>
            </div>
            <router-link to="/hrm/holidays" class="btn btn-white btn-sm px-3"
              >View All</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { performanceCharts } from "./data";
export default {
  data() {
    return {
      performanceCharts: performanceCharts,
    };
  },
};
</script>

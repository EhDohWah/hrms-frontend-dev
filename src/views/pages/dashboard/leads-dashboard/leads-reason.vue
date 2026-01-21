<template>
  <div class="row">
    <div class="col-xl-4 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Lost Leads By Reason</h5>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="btn btn-white border-0 dropdown-toggle btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Sales Pipeline
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
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Last Week</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body py-0">
          <div>
            <div id="leads_stage">
              <apexchart
                type="bar"
                height="320"
                :options="leadsStageChart.stageLead"
                :series="leadsStageChart.series"
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
            <h5>Leads By Companies</h5>
            <div class="dropdown">
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
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Last Week</a
                  >
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
                  <a
                    href="javascript:void(0);"
                    class="avatar avatar-md rounded-circle bg-gray-100 flex-shrink-0 me-2"
                  >
                    <img
                      src="@/assets/img/company/company-24.svg"
                      class="w-auto h-auto"
                      alt="Img"
                    />
                  </a>
                  <div>
                    <h6 class="fw-medium mb-1">Pitch</h6>
                    <p class="text-truncate">Value : $45,985</p>
                  </div>
                </div>
                <span class="badge badge-purple d-inline-flex align-items-center">
                  <i class="ti ti-point-filled me-1"></i> Not Contacted
                </span>
              </div>
            </div>
            <div class="border border-dashed bg-transparent-light rounded p-2 mb-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar avatar-md rounded-circle bg-gray-100 flex-shrink-0 me-2"
                  >
                    <img
                      src="@/assets/img/company/company-25.svg"
                      class="w-auto h-auto"
                      alt="Img"
                    />
                  </a>
                  <div>
                    <h6 class="fw-medium mb-1">Initech</h6>
                    <p class="text-truncate">Value : $21,145</p>
                  </div>
                </div>
                <span class="badge badge-success d-inline-flex align-items-center">
                  <i class="ti ti-point-filled me-1"></i>Closed
                </span>
              </div>
            </div>
            <div class="border border-dashed bg-transparent-light rounded p-2 mb-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar avatar-md rounded-circle bg-gray-100 flex-shrink-0 me-2"
                  >
                    <img
                      src="@/assets/img/company/company-26.svg"
                      class="w-auto h-auto"
                      alt="Img"
                    />
                  </a>
                  <div>
                    <h6 class="fw-medium mb-1">Umbrella Corp</h6>
                    <p class="text-truncate">Value : $15,685</p>
                  </div>
                </div>
                <span class="badge badge-secondary d-inline-flex align-items-center">
                  <i class="ti ti-point-filled me-1"></i>Contacted
                </span>
              </div>
            </div>
            <div class="border border-dashed bg-transparent-light rounded p-2 mb-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar avatar-md rounded-circle bg-gray-100 flex-shrink-0 me-2"
                  >
                    <img
                      src="@/assets/img/company/company-27.svg"
                      class="w-auto h-auto"
                      alt="Img"
                    />
                  </a>
                  <div>
                    <h6 class="fw-medium mb-1">Capital Partners</h6>
                    <p class="text-truncate">Value : $12,105</p>
                  </div>
                </div>
                <span class="badge badge-secondary d-inline-flex align-items-center">
                  <i class="ti ti-point-filled me-1"></i>Contacted
                </span>
              </div>
            </div>
            <div class="border border-dashed bg-transparent-light rounded p-2">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar avatar-md rounded-circle bg-gray-100 flex-shrink-0 me-2"
                  >
                    <img
                      src="@/assets/img/company/company-28.svg"
                      class="w-auto h-auto"
                      alt="Img"
                    />
                  </a>
                  <div>
                    <h6 class="fw-medium mb-1">Massive Dynamic</h6>
                    <p class="text-truncate">Value : $2,546</p>
                  </div>
                </div>
                <span class="badge badge-danger d-inline-flex align-items-center">
                  <i class="ti ti-point-filled me-1"></i>Lost
                </span>
              </div>
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
            <h5>Leads by Source</h5>
            <div class="dropdown">
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
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Last Week</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div id="donut-chart-2">
            <apexchart
              type="donut"
              height="250"
              :options="donutChart.dount"
              :series="donutChart.series"
            >
            </apexchart>
          </div>
          <div>
            <h6 class="mb-3">Status</h6>
            <div class="d-flex align-items-center justify-content-between mb-2">
              <p class="f-13 mb-0">
                <i class="ti ti-circle-filled text-secondary me-1"></i>Google
              </p>
              <p class="f-13 fw-medium text-gray-9">40%</p>
            </div>
            <div class="d-flex align-items-center justify-content-between mb-2">
              <p class="f-13 mb-0">
                <i class="ti ti-circle-filled text-warning me-1"></i>Paid
              </p>
              <p class="f-13 fw-medium text-gray-9">35%</p>
            </div>
            <div class="d-flex align-items-center justify-content-between mb-2">
              <p class="f-13 mb-0">
                <i class="ti ti-circle-filled text-pink me-1"></i>Campaigns
              </p>
              <p class="f-13 fw-medium text-gray-9">15%</p>
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <p class="f-13 mb-0">
                <i class="ti ti-circle-filled text-purple me-1"></i>Referals
              </p>
              <p class="f-13 fw-medium text-gray-9">10%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { leadsStageChart, donutChart } from "./data";
export default {
  data() {
    return {
      leadsStageChart: leadsStageChart,
      donutChart: donutChart,
    };
  },
};
</script>

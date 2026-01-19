<template>
  <div class="row">
    <div class="col-xl-4 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Deals by Stage</h5>
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
        <div class="card-body pb-0">
          <div>
            <div class="d-flex align-items-center">
              <h3 class="me-2">98%</h3>
              <span
                class="badge badge-outline-success bg-success-transparent rounded-pill me-1"
                >12%</span
              >
              <span>vs last years</span>
            </div>
            <div id="deals_stage">
              <apexchart
                type="bar"
                height="280"
                :options="dealsStage.stages"
                :series="dealsStage.series"
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
            <h5>Deals By Companies</h5>
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
                    <p class="text-truncate">Closing Deal date 05 April, 2025</p>
                  </div>
                </div>
                <div>
                  <h6>$3655</h6>
                </div>
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
                    <p class="text-truncate">Closing Deal date 05 May, 2025</p>
                  </div>
                </div>
                <div>
                  <h6>$2185</h6>
                </div>
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
                    <p class="text-truncate">Closing Deal date 29 April, 2025</p>
                  </div>
                </div>
                <div>
                  <h6>$1583</h6>
                </div>
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
                    <p class="text-truncate">Closing Deal date 23 Mar, 2025</p>
                  </div>
                </div>
                <div>
                  <h6>$6584</h6>
                </div>
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
                    <p class="text-truncate">Closing Deal date 23 Feb, 2025</p>
                  </div>
                </div>
                <div>
                  <h6>$2153</h6>
                </div>
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
            <h5>Top Deals</h5>
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
          <div class="text-center">
            <apexchart
              type="radar"
              height="200"
              :options="topDeals.dealsCharts"
              :series="topDeals.series"
            >
            </apexchart>
          </div>
          <div>
            <h6 class="mb-3">Status</h6>
            <div class="d-flex align-items-center justify-content-between mb-2">
              <p class="f-13 mb-0">
                <i class="ti ti-circle-filled text-primary me-1"></i>Marketing
              </p>
              <p class="f-13 fw-medium text-gray-9">$5,69,877</p>
            </div>
            <div class="d-flex align-items-center justify-content-between mb-2">
              <p class="f-13 mb-0">
                <i class="ti ti-circle-filled text-purple me-1"></i>Chat
              </p>
              <p class="f-13 fw-medium text-gray-9">$4,84,575</p>
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <p class="f-13 mb-0">
                <i class="ti ti-circle-filled text-success me-1"></i>Email
              </p>
              <p class="f-13 fw-medium text-gray-9">$1,84,575</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { dealsStage, topDeals } from "./data";

export default {
  data() {
    return {
      dealsStage: dealsStage,
      topDeals: topDeals,
    };
  },
};
</script>

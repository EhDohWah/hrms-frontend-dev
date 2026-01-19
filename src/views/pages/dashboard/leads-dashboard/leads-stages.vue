<template>
  <div class="row">
    <div class="col-xl-8 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Pipeline Stages</h5>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="btn btn-white border btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-calendar me-1"></i>2023 - 2024
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >2023 - 2024</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >2022 - 2023</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >2021 - 2023</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body pb-0">
          <div class="row g-2 justify-content-center mb-3">
            <div class="col-md col-sm-4 col-6">
              <div class="border rounded p-2">
                <p class="mb-1">
                  <i class="ti ti-point-filled text-primary"></i>Contacted
                </p>
                <h6>50000</h6>
              </div>
            </div>
            <div class="col-md col-sm-4 col-6">
              <div class="border rounded p-2">
                <p class="mb-1">
                  <i class="ti ti-point-filled text-primary"></i>Oppurtunity
                </p>
                <h6>25985</h6>
              </div>
            </div>
            <div class="col-md col-sm-4 col-6">
              <div class="border rounded p-2">
                <p class="mb-1">
                  <i class="ti ti-point-filled text-primary"></i>Not Contacted
                </p>
                <h6>12566</h6>
              </div>
            </div>
            <div class="col-md col-sm-4 col-6">
              <div class="border rounded p-2">
                <p class="mb-1"><i class="ti ti-point-filled text-primary"></i>Closed</p>
                <h6>8965</h6>
              </div>
            </div>
            <div class="col-md col-sm-4 col-6">
              <div class="border rounded p-2">
                <p class="mb-1"><i class="ti ti-point-filled text-primary"></i>Lost</p>
                <h6>2452</h6>
              </div>
            </div>
          </div>
          <div id="revenue-income">
            <apexchart
              type="bar"
              height="230"
              :options="revenueCharts.income"
              :series="revenueCharts.series"
            >
            </apexchart>
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
            <h5>New Leads</h5>
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
                    >This Week</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >This Month</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >This Year</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body pb-0">
          <div id="heat_chart">
            <apexchart
              type="heatmap"
              height="300"
              :options="heatChart.heat"
              :series="heatChart.series"
            >
            </apexchart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { revenueCharts, heatChart } from "./data";
export default {
  data() {
    return {
      revenueCharts: revenueCharts,
      heatChart: heatChart,
    };
  },
};
</script>

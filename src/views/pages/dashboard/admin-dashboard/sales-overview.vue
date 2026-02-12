<template>
  <div class="row">
    <!-- Sales Overview -->
    <div class="col-xl-7 d-flex">
      <div class="card flex-fill">
        <div
          class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap"
        >
          <h5 class="mb-2">Sales Overview</h5>
          <div class="d-flex align-items-center">
            <div class="dropdown mb-2">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white border-0 btn-sm d-inline-flex align-items-center fs-13 me-2"
                data-bs-toggle="dropdown"
              >
                All Departments
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >UI/UX Designer</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >HR Manager</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Junior Tester</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body pb-0">
          <div class="d-flex align-items-center justify-content-between flex-wrap">
            <div class="d-flex align-items-center mb-1">
              <p class="fs-13 text-gray-9 me-3 mb-0">
                <i class="ti ti-square-filled me-2 text-primary"></i>Income
              </p>
              <p class="fs-13 text-gray-9 mb-0">
                <i class="ti ti-square-filled me-2 text-gray-2"></i>Expenses
              </p>
            </div>
            <p class="fs-13 mb-1">Last Updated at 11:30PM</p>
          </div>
          <div id="sales-income">
            <apexchart
              type="bar"
              height="290"
              :options="salesIncome.inCome"
              :series="salesIncome.series"
            >
            </apexchart>
          </div>
        </div>
      </div>
    </div>
    <!-- /Sales Overview -->

    <!-- Invoices -->
    <div class="col-xl-5 d-flex">
      <div class="card flex-fill">
        <div
          class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap"
        >
          <h5 class="mb-2">Invoices</h5>
          <div class="d-flex align-items-center">
            <div class="dropdown mb-2">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white btn-sm d-inline-flex align-items-center fs-13 me-2 border-0"
                data-bs-toggle="dropdown"
              >
                Invoices
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Invoices</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Paid</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Unpaid</a>
                </li>
              </ul>
            </div>
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
        <div class="card-body pt-2">
          <div class="table-responsive pt-1">
            <table class="table table-nowrap table-borderless mb-0">
              <tbody>
                <tr>
                  <td class="px-0">
                    <div class="d-flex align-items-center">
                      <router-link to="/sales/invoice-details" class="avatar avatar-md">
                        <img
                          src="@/assets/img/users/user-39.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/sales/invoice-details"
                            >Redesign Website</router-link
                          >
                        </h6>
                        <span class="fs-13 d-inline-flex align-items-center"
                          >#INVOO2<i
                            class="ti ti-circle-filled fs-4 mx-1 text-primary"
                          ></i
                          >Logistics</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="fs-13 mb-1">Payment</p>
                    <h6 class="fw-medium">$3560</h6>
                  </td>
                  <td class="px-0 text-end">
                    <span
                      class="badge badge-danger-transparent badge-xs d-inline-flex align-items-center"
                      ><i class="ti ti-circle-filled fs-5 me-1"></i>Unpaid</span
                    >
                  </td>
                </tr>
                <tr>
                  <td class="px-0">
                    <div class="d-flex align-items-center">
                      <router-link to="/sales/invoice-details" class="avatar avatar-md">
                        <img
                          src="@/assets/img/users/user-40.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/sales/invoice-details"
                            >Module Completion</router-link
                          >
                        </h6>
                        <span class="fs-13 d-inline-flex align-items-center"
                          >#INVOO5<i
                            class="ti ti-circle-filled fs-4 mx-1 text-primary"
                          ></i
                          >Yip Corp</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="fs-13 mb-1">Payment</p>
                    <h6 class="fw-medium">$4175</h6>
                  </td>
                  <td class="px-0 text-end">
                    <span
                      class="badge badge-danger-transparent badge-xs d-inline-flex align-items-center"
                      ><i class="ti ti-circle-filled fs-5 me-1"></i>Unpaid</span
                    >
                  </td>
                </tr>
                <tr>
                  <td class="px-0">
                    <div class="d-flex align-items-center">
                      <router-link to="/sales/invoice-details" class="avatar avatar-md">
                        <img
                          src="@/assets/img/users/user-55.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/sales/invoice-details"
                            >Change on Emp Module</router-link
                          >
                        </h6>
                        <span class="fs-13 d-inline-flex align-items-center"
                          >#INVOO3<i
                            class="ti ti-circle-filled fs-4 mx-1 text-primary"
                          ></i
                          >Ignis LLP</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="fs-13 mb-1">Payment</p>
                    <h6 class="fw-medium">$6985</h6>
                  </td>
                  <td class="px-0 text-end">
                    <span
                      class="badge badge-danger-transparent badge-xs d-inline-flex align-items-center"
                      ><i class="ti ti-circle-filled fs-5 me-1"></i>Unpaid</span
                    >
                  </td>
                </tr>
                <tr>
                  <td class="px-0">
                    <div class="d-flex align-items-center">
                      <router-link to="/sales/invoice-details" class="avatar avatar-md">
                        <img
                          src="@/assets/img/users/user-42.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/sales/invoice-details"
                            >Changes on the Board</router-link
                          >
                        </h6>
                        <span class="fs-13 d-inline-flex align-items-center"
                          >#INVOO2<i
                            class="ti ti-circle-filled fs-4 mx-1 text-primary"
                          ></i
                          >Ignis LLP</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="fs-13 mb-1">Payment</p>
                    <h6 class="fw-medium">$1457</h6>
                  </td>
                  <td class="px-0 text-end">
                    <span
                      class="badge badge-danger-transparent badge-xs d-inline-flex align-items-center"
                      ><i class="ti ti-circle-filled fs-5 me-1"></i>Unpaid</span
                    >
                  </td>
                </tr>
                <tr>
                  <td class="px-0">
                    <div class="d-flex align-items-center">
                      <router-link to="/sales/invoice-details" class="avatar avatar-md">
                        <img
                          src="@/assets/img/users/user-44.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/sales/invoice-details"
                            >Hospital Management</router-link
                          >
                        </h6>
                        <span class="fs-13 d-inline-flex align-items-center"
                          >#INVOO6<i
                            class="ti ti-circle-filled fs-4 mx-1 text-primary"
                          ></i
                          >HCL Corp</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="fs-13 mb-1">Payment</p>
                    <h6 class="fw-medium">$6458</h6>
                  </td>
                  <td class="px-0 text-end">
                    <span
                      class="badge badge-success-transparent badge-xs d-inline-flex align-items-center"
                      ><i class="ti ti-circle-filled fs-5 me-1"></i>Paid</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <router-link to="/sales/invoices" class="btn btn-light btn-md w-100 mt-2"
            >View All</router-link
          >
        </div>
      </div>
    </div>
    <!-- /Invoices -->
  </div>
</template>
<script>
import { salesIncome } from "./data";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      salesIncome: salesIncome,
    };
  },
};
</script>

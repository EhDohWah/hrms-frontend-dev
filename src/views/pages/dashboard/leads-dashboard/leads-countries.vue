<template>
  <div class="row">
    <div class="col-xl-5 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Top Countries</h5>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="btn btn-white border-0 dropdown-toggle btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Referrals
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Referrals</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Sales Pipeline</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-xxl-5 col-sm-6">
              <div class="pe-3 border-end">
                <div class="d-flex align-items-center mb-4">
                  <span class="me-2"
                    ><i class="ti ti-point-filled text-primary fs-16"></i
                  ></span>
                  <router-link
                    to="/location/countries"
                    class="avatar rounded-circle flex-shrink-0 border border-2"
                  >
                    <img
                      src="@/assets/img/payment-gateway/country-03.svg"
                      class="img-fluid rounded-circle"
                      alt="img"
                    />
                  </router-link>
                  <div class="ms-2">
                    <h6 class="fw-medium text-truncate mb-1">
                      <router-link to="/location/countries">Singapore</router-link>
                    </h6>
                    <span class="fs-13 text-truncate">Leads : 236</span>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-4">
                  <span class="me-2"
                    ><i class="ti ti-point-filled text-secondary fs-16"></i
                  ></span>
                  <router-link
                    to="/location/countries"
                    class="avatar rounded-circle flex-shrink-0 border border-2"
                  >
                    <img
                      src="@/assets/img/payment-gateway/country-04.svg"
                      class="img-fluid rounded-circle"
                      alt="img"
                    />
                  </router-link>
                  <div class="ms-2">
                    <h6 class="fw-medium text-truncate mb-1">
                      <router-link to="/location/countries">France</router-link>
                    </h6>
                    <span class="fs-13 text-truncate">Leads : 589</span>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-4">
                  <span class="me-2"
                    ><i class="ti ti-point-filled text-info fs-16"></i
                  ></span>
                  <router-link
                    to="/location/countries"
                    class="avatar rounded-circle flex-shrink-0 border border-2"
                  >
                    <img
                      src="@/assets/img/payment-gateway/country-05.svg"
                      class="img-fluid rounded-circle"
                      alt="img"
                    />
                  </router-link>
                  <div class="ms-2">
                    <h6 class="fw-medium text-truncate mb-1">
                      <router-link to="/location/countries">Norway</router-link>
                    </h6>
                    <span class="fs-13 text-truncate">Leads : 221</span>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-4">
                  <span class="me-2"
                    ><i class="ti ti-point-filled text-danger fs-16"></i
                  ></span>
                  <router-link
                    to="/location/countries"
                    class="avatar rounded-circle flex-shrink-0 border border-2"
                  >
                    <img
                      src="@/assets/img/payment-gateway/country-01.svg"
                      class="img-fluid rounded-circle"
                      alt="img"
                    />
                  </router-link>
                  <div class="ms-2">
                    <h6 class="fw-medium text-truncate mb-1">
                      <router-link to="/location/countries">USA</router-link>
                    </h6>
                    <span class="fs-13 text-truncate">Leads : 350</span>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <span class="me-2"
                    ><i class="ti ti-point-filled text-warning fs-16"></i
                  ></span>
                  <router-link
                    to="/location/countries"
                    class="avatar rounded-circle flex-shrink-0 border border-2"
                  >
                    <img
                      src="@/assets/img/payment-gateway/country-02.svg"
                      class="img-fluid rounded-circle"
                      alt="img"
                    />
                  </router-link>
                  <div class="ms-2">
                    <h6 class="fw-medium text-truncate mb-1">
                      <router-link to="/location/countries">UAE</router-link>
                    </h6>
                    <span class="fs-13 text-truncate">Leads : 221</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xxl-7 col-sm-6">
              <div id="donut-chart-3">
                <apexchart
                  type="donut"
                  height="250"
                  :options="donutChart3.dount3"
                  :series="donutChart3.series"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-7 d-flex">
      <div class="card flex-fill">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-2"
        >
          <h5>Recent Leads</h5>
          <div class="d-flex align-items-center">
            <div>
              <router-link to="/crm/leads-list" class="btn btn-sm btn-light px-3"
                >View All</router-link
              >
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-nowrap dashboard-table mb-0">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Company Name</th>
                  <th>Stage</th>
                  <th>Created Date</th>
                  <th>Lead Owner</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/leads-details">Collins</router-link>
                    </h6>
                  </td>
                  <td>
                    <div class="d-flex align-items-center file-name-icon">
                      <router-link
                        to="/crm/companies-details"
                        class="avatar border rounded-circle"
                      >
                        <img
                          src="@/assets/img/company/company-01.svg"
                          class="img-fluid"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/crm/companies-details"
                            >BrightWave Innovations</router-link
                          >
                        </h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-secondary d-inline-flex align-items-center">
                      <i class="ti ti-point-filled me-1"></i>
                      Contacted
                    </span>
                  </td>
                  <td>14 Jan 2024</td>
                  <td>Hendry</td>
                </tr>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/leads-details">Konopelski</router-link>
                    </h6>
                  </td>
                  <td>
                    <div class="d-flex align-items-center file-name-icon">
                      <router-link
                        to="/crm/companies-details"
                        class="avatar border rounded-circle"
                      >
                        <img
                          src="@/assets/img/company/company-02.svg"
                          class="img-fluid"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/crm/companies-details"
                            >Stellar Dynamics</router-link
                          >
                        </h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-success d-inline-flex align-items-center">
                      <i class="ti ti-point-filled me-1"></i>
                      Closed
                    </span>
                  </td>
                  <td>21 Jan 2024</td>
                  <td>Guilory</td>
                </tr>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/leads-details">Adams</router-link>
                    </h6>
                  </td>
                  <td>
                    <div class="d-flex align-items-center file-name-icon">
                      <router-link
                        to="/crm/companies-details"
                        class="avatar border rounded-circle"
                      >
                        <img
                          src="@/assets/img/company/company-03.svg"
                          class="img-fluid"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/crm/companies-details"
                            >Quantum Nexus</router-link
                          >
                        </h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-danger d-inline-flex align-items-center">
                      <i class="ti ti-point-filled me-1"></i>
                      Lost
                    </span>
                  </td>
                  <td>20 Feb 2024</td>
                  <td>Jami</td>
                </tr>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/leads-details">Schumm</router-link>
                    </h6>
                  </td>
                  <td>
                    <div class="d-flex align-items-center file-name-icon">
                      <router-link
                        to="/crm/companies-details"
                        class="avatar border rounded-circle"
                      >
                        <img
                          src="@/assets/img/company/company-04.svg"
                          class="img-fluid"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/crm/companies-details"
                            >EcoVision Enterprises</router-link
                          >
                        </h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-purple d-inline-flex align-items-center">
                      <i class="ti ti-point-filled me-1"></i>
                      Not Contacted
                    </span>
                  </td>
                  <td>15 Mar 2024</td>
                  <td>Theresa</td>
                </tr>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/leads-details">Wisozk</router-link>
                    </h6>
                  </td>
                  <td>
                    <div class="d-flex align-items-center file-name-icon">
                      <router-link
                        to="/crm/companies-details"
                        class="avatar border rounded-circle"
                      >
                        <img
                          src="@/assets/img/company/company-05.svg"
                          class="img-fluid"
                          alt="img"
                        />
                      </router-link>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link to="/crm/companies-details"
                            >Aurora Technologies</router-link
                          >
                        </h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-success d-inline-flex align-items-center">
                      <i class="ti ti-point-filled me-1"></i>
                      Closed
                    </span>
                  </td>
                  <td>12 Apr 2024</td>
                  <td>Smith</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { donutChart3 } from "./data";
export default {
  data() {
    return {
      donutChart3: donutChart3,
    };
  },
};
</script>

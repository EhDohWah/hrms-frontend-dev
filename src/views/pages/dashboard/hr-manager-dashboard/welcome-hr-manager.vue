<template>
  <!-- Welcome Wrap -->
  <div class="card border-0">
    <div class="card-body d-flex align-items-center justify-content-between flex-wrap pb-1">
      <div class="d-flex align-items-center mb-3">
        <span class="avatar avatar-xl flex-shrink-0">
          <img src="@/assets/img/profiles/avatar-31.jpg" class="rounded-circle" alt="img" />
        </span>
        <div class="ms-3">
          <h3 class="mb-2">
            Welcome Back, {{ username }}
            <a href="javascript:void(0);" class="edit-icon"><i class="ti ti-edit fs-14"></i></a>
          </h3>
          <!-- <p>
            You have
            <span class="text-primary text-decoration-underline">21</span> Pending
            Approvals &
            <span class="text-primary text-decoration-underline">14</span> Leave Requests
          </p> -->
        </div>
      </div>

    </div>
  </div>
  <!-- /Welcome Wrap -->

  <div class="row">

    <!-- Employee By Subsidiary -->
    <div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12 d-flex">
      <div class="card flex-fill">
        <div class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 class="mb-2">Employee By Subsidiary</h5>
          <div class="dropdown mb-2">
            <a href="javascript:void(0);" class="btn btn-white border btn-sm d-inline-flex align-items-center"
              data-bs-toggle="dropdown">
              <i class="ti ti-calendar me-1"></i>This Month
            </a>
            <ul class="dropdown-menu dropdown-menu-end p-3">
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">This Month</a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">This Quarter</a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">This Year</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <p class="fs-13 mb-3">Total Employees</p>
            <h3 class="mb-3">{{ employeeStore.statistics.totalEmployees }}</h3>
          </div>
          <div class="progress-stacked emp-stack mb-3">
            <div class="progress" role="progressbar" aria-label="SMRU" :aria-valuenow="smruPercentage" aria-valuemin="0"
              aria-valuemax="100" :style="{ width: smruPercentage + '%' }">
              <div class="progress-bar bg-primary"></div>
            </div>
            <div class="progress" role="progressbar" aria-label="BHF" :aria-valuenow="bhfPercentage" aria-valuemin="0"
              aria-valuemax="100" :style="{ width: bhfPercentage + '%' }">
              <div class="progress-bar bg-secondary"></div>
            </div>
          </div>
          <div class="border mb-3">
            <div class="row gx-0">
              <div class="col-6">
                <div class="p-3 flex-fill border-end border-bottom">
                  <h6 class="mb-2">SMRU</h6>
                  <p class="fs-13 mb-1">
                    <i class="ti ti-square-filled text-primary fs-12 me-2"></i>Total Employees
                  </p>
                  <h4 class="text-primary">{{ employeeStore.statistics.subsidiaryCount.SMRU_count }}</h4>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 flex-fill border-bottom">
                  <h6 class="mb-2">BHF</h6>
                  <p class="fs-13 mb-1">
                    <i class="ti ti-square-filled text-secondary fs-12 me-2"></i>Total Employees
                  </p>
                  <h4 class="text-secondary">{{ employeeStore.statistics.subsidiaryCount.BHF_count }}</h4>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 flex-fill border-end">
                  <h6 class="mb-2">SMRU Changes</h6>
                  <div class="d-flex justify-content-between">
                    <div>
                      <p class="fs-13 mb-1">
                        <i class="ti ti-user-plus text-success fs-14 me-1"></i>New Recruits
                      </p>
                      <h4 class="text-success">N/A</h4>
                    </div>
                    <div>
                      <p class="fs-13 mb-1">
                        <i class="ti ti-user-minus text-danger fs-14 me-1"></i>Resignations
                      </p>
                      <h4 class="text-danger">N/A</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="p-3 flex-fill">
                  <h6 class="mb-2">BHF Changes</h6>
                  <div class="d-flex justify-content-between">
                    <div>
                      <p class="fs-13 mb-1">
                        <i class="ti ti-user-plus text-success fs-14 me-1"></i>New Recruits
                      </p>
                      <h4 class="text-success">N/A</h4>
                    </div>
                    <div>
                      <p class="fs-13 mb-1">
                        <i class="ti ti-user-minus text-danger fs-14 me-1"></i>Resignations
                      </p>
                      <h4 class="text-danger">N/A</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <router-link to="/employee/employee-list" class="btn btn-light btn-md w-100">View All Employees</router-link>
        </div>
      </div>
    </div>
    <!-- /Employee By Subsidiary -->

    <!-- Total Employee -->
    <div class="col-xxl-4 d-flex">
      <div class="card flex-fill">
        <div class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 class="mb-2">Employee Status</h5>
          <div class="dropdown mb-2">
            <a href="javascript:void(0);" class="btn btn-white border btn-sm d-inline-flex align-items-center"
              data-bs-toggle="dropdown">
              <i class="ti ti-calendar me-1"></i>This Week
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
            <h3 class="mb-3">{{ employeeStore.statistics.totalEmployees }}</h3>
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
                    <i class="ti ti-square-filled text-primary fs-12 me-2"></i>Fulltime
                    <span class="text-gray-9">N/A</span>
                  </p>
                  <h2 class="display-1">N/A</h2>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 flex-fill border-bottom text-end">
                  <p class="fs-13 mb-2">
                    <i class="ti ti-square-filled me-2 text-secondary fs-12"></i>Contract
                    <span class="text-gray-9">N/A</span>
                  </p>
                  <h2 class="display-1">N/A</h2>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 flex-fill border-end">
                  <p class="fs-13 mb-2">
                    <i class="ti ti-square-filled me-2 text-danger fs-12"></i>Probation
                    <span class="text-gray-9">N/A</span>
                  </p>
                  <h2 class="display-1">N/A</h2>
                </div>
              </div>
              <div class="col-6">
                <div class="p-2 flex-fill text-end">
                  <p class="fs-13 mb-2">
                    <i class="ti ti-square-filled text-pink me-2 fs-12"></i>WFH
                    <span class="text-gray-9">N/A</span>
                  </p>
                  <h2 class="display-1">N/A</h2>
                </div>
              </div>
            </div>
          </div>

          <router-link to="/employee/employee-list" class="btn btn-light btn-md w-100">View All Employees</router-link>
        </div>
      </div>
    </div>
    <!-- /Total Employee -->


    <!-- Employees By Department -->
    <div class="col-xxl-4 d-flex">
      <div class="card flex-fill">
        <div class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 class="mb-2">Employees By Department</h5>
          <div class="dropdown mb-2">
            <a href="javascript:void(0);" class="btn btn-white border btn-sm d-inline-flex align-items-center"
              data-bs-toggle="dropdown">
              <i class="ti ti-calendar me-1"></i>This Week
            </a>
            <ul class="dropdown-menu dropdown-menu-end p-3">
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">This Month</a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">This Week</a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">Last Week</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body">
          <div id="emp-department">
            <apexchart type="bar" height="220" :options="empDepartment.department" :series="empDepartment.series">
            </apexchart>
          </div>
          <!-- <p class="fs-13">
            <i class="ti ti-circle-filled me-2 fs-8 text-primary"></i>No of Employees
            increased by <span class="text-success fw-bold">+20%</span> from last Week
          </p> -->
        </div>
      </div>
    </div>
    <!-- /Employees By Department -->
  </div>
</template>
<script>
import { empDepartment } from "./data";
import { useEmployeeStore } from '@/stores/employeeStore';
import { computed, onMounted } from 'vue';

export default {
  setup() {
    const employeeStore = useEmployeeStore();

    // Calculate percentages for the progress bars
    const smruPercentage = computed(() => {
      const total = employeeStore.statistics.totalEmployees;
      if (total === 0) return 0;
      return Math.round((employeeStore.statistics.subsidiaryCount.SMRU_count / total) * 100);
    });

    const bhfPercentage = computed(() => {
      const total = employeeStore.statistics.totalEmployees;
      if (total === 0) return 0;
      return Math.round((employeeStore.statistics.subsidiaryCount.BHF_count / total) * 100);
    });

    // Fetch employees data when component is mounted
    onMounted(async () => {
      try {
        await employeeStore.fetchEmployees();
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    });

    return {
      employeeStore,
      smruPercentage,
      bhfPercentage,
      empDepartment
    };
  },
  data() {
    return {
      username: '',
    };
  },
  created() {
    this.getUserDetails(); // Call getUserDetails when component is created
  },
  methods: {
    getUserDetails() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          this.username = userData.name || 'User';
        } catch (e) {
          this.username = 'User';
        }
      } else {
        this.username = 'User';
      }
    },
  },
};
</script>
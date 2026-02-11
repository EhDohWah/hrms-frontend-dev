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
                </div>
            </div>
        </div>
    </div>
    <!-- /Welcome Wrap -->

    <div class="row">
        <!-- Employee By Organization -->
        <div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12 d-flex">
            <div class="card flex-fill">
                <div class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
                    <h5 class="mb-2">Employee By Organization</h5>
                    <div class="dropdown mb-2">
                        <a href="javascript:void(0);"
                            class="btn btn-white border btn-sm d-inline-flex align-items-center"
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
                        <div class="progress" role="progressbar" aria-label="SMRU" :aria-valuenow="smruPercentage"
                            aria-valuemin="0" aria-valuemax="100" :style="{ width: smruPercentage + '%' }">
                            <div class="progress-bar bg-primary"></div>
                        </div>
                        <div class="progress" role="progressbar" aria-label="BHF" :aria-valuenow="bhfPercentage"
                            aria-valuemin="0" aria-valuemax="100" :style="{ width: bhfPercentage + '%' }">
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
                                    <h4 class="text-primary">{{ employeeStore.statistics.organizationCount.SMRU_count }}
                                    </h4>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-3 flex-fill border-bottom">
                                    <h6 class="mb-2">BHF</h6>
                                    <p class="fs-13 mb-1">
                                        <i class="ti ti-square-filled text-secondary fs-12 me-2"></i>Total Employees
                                    </p>
                                    <h4 class="text-secondary">{{ employeeStore.statistics.organizationCount.BHF_count }}
                                    </h4>
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
                    <router-link to="/employee/employee-list" class="btn btn-light btn-md w-100">View All
                        Employees</router-link>
                </div>
            </div>
        </div>
        <!-- /Employee By Organization -->

        <!-- Upcoming Interviews -->
        <div class="col-xxl-4 d-flex">
            <div class="card flex-fill">
                <div class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
                    <h5 class="mb-2">Upcoming Interviews</h5>
                    <div class="dropdown mb-2">
                        <a href="javascript:void(0);"
                            class="btn btn-white border btn-sm d-inline-flex align-items-center"
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
                    <div class="upcoming-interviews-list">
                        <div v-if="upcomingInterviews.length === 0" class="text-center py-4">
                            <p>No upcoming interviews scheduled</p>
                        </div>
                        <div v-else v-for="(interview, index) in upcomingInterviews" :key="index"
                            class="interview-item border-bottom pb-3 mb-3">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="mb-1">{{ interview.candidate_name }}</h6>
                                    <p class="text-muted mb-1">{{ interview.job_position }}</p>
                                </div>
                                <div class="text-end">
                                    <span class="badge bg-light-primary">{{ interview.interview_mode }}</span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <div>
                                    <i class="ti ti-calendar me-1 text-muted"></i>
                                    <span class="text-muted">{{ formatDate(interview.interview_date) }}</span>
                                </div>
                                <div>
                                    <i class="ti ti-clock me-1 text-muted"></i>
                                    <span class="text-muted">{{ interview.start_time }} - {{ interview.end_time
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <router-link to="/recruitment/interviews" class="btn btn-light btn-md w-100 mt-2">View All
                        Interviews</router-link>
                </div>
            </div>
        </div>
        <!-- /Upcoming Interviews -->

        <!-- Employees By Department -->
        <div class="col-xxl-4 d-flex">
            <div class="card flex-fill">
                <div class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
                    <h5 class="mb-2">Employees By Department</h5>
                    <div class="dropdown mb-2">
                        <a href="javascript:void(0);"
                            class="btn btn-white border btn-sm d-inline-flex align-items-center"
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
                        <apexchart type="bar" height="220" :options="empDepartment.department"
                            :series="empDepartment.series">
                        </apexchart>
                    </div>
                </div>
            </div>
        </div>
        <!-- /Employees By Department -->
    </div>
</template>
<script>
import { empDepartment } from "../hr-manager-dashboard/data";
import { useEmployeeStore } from '@/stores/employeeStore';
import { computed, onMounted, ref } from 'vue';
import moment from 'moment';

export default {
    setup() {
        const employeeStore = useEmployeeStore();
        const employees = ref([]);
        const upcomingInterviews = ref([
            // Sample data - replace with actual API call
            {
                candidate_name: "John Smith",
                job_position: "Frontend Developer",
                interview_mode: "Virtual",
                interview_date: "2023-06-15",
                start_time: "10:00 AM",
                end_time: "11:00 AM"
            },
            {
                candidate_name: "Sarah Johnson",
                job_position: "HR Specialist",
                interview_mode: "In-person",
                interview_date: "2023-06-16",
                start_time: "2:00 PM",
                end_time: "3:00 PM"
            }
        ]);

        // Calculate percentages for the progress bars
        const smruPercentage = computed(() => {
            const total = employeeStore.statistics.totalEmployees;
            if (total === 0) return 0;
            return Math.round((employeeStore.statistics.organizationCount.SMRU_count / total) * 100);
        });

        const bhfPercentage = computed(() => {
            const total = employeeStore.statistics.totalEmployees;
            if (total === 0) return 0;
            return Math.round((employeeStore.statistics.organizationCount.BHF_count / total) * 100);
        });

        // Fetch employees data when component is mounted
        onMounted(async () => {
            try {
                await employeeStore.fetchEmployees({
                    page: 1,
                    per_page: 10
                });
                // Here you would also fetch upcoming interviews from your API
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        });

        const formatDate = (dateString) => {
            return moment(dateString).format('DD/MM/YYYY');
        };

        return {
            employeeStore,
            employees,
            upcomingInterviews,
            smruPercentage,
            bhfPercentage,
            empDepartment,
            formatDate
        };
    },
    data() {
        return {
            username: '',
            error: null
        };
    },
    created() {
        this.getUserDetails();
    },
    methods: {
        getUserDetails() {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const userData = JSON.parse(userStr);
                    this.username = userData.name || 'HR Assistant';
                } catch (e) {
                    this.username = 'HR Assistant';
                }
            } else {
                this.username = 'HR Assistant';
            }
        }
    }
};
</script>

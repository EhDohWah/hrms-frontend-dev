<script>
import { ref } from "vue";
import { usePermissions } from '@/composables/usePermissions';

const currentDate = ref(new Date());

export default {
    setup() {
        // Initialize permission checks for attendance_employee module
        const { 
            canRead, 
            canEdit, 
            isReadOnly, 
            accessLevelText, 
            accessLevelBadgeClass 
        } = usePermissions('attendance_employee');

        return {
            canRead,
            canEdit,
            isReadOnly,
            accessLevelText,
            accessLevelBadgeClass
        };
    },
    data() {
        return {
            title: "Attendance",
            text: "Employee",
            text1: "My Attendance",
            startdate: currentDate,
            dateFormat: "dd-MM-yyyy",
        }
    },
    computed: {
        // Permission checks - primary source for reactivity
        canEditAttendanceEmployee() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasEdit = Array.isArray(permissions) && permissions.includes('attendance_employee.edit');
                return hasEdit || (this.canEdit?.value ?? false);
            } catch (e) {
                console.error('[AttendanceEmployee] Error checking permissions:', e);
                return this.canEdit?.value ?? false;
            }
        },
        canReadAttendanceEmployee() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasRead = Array.isArray(permissions) && permissions.includes('attendance_employee.read');
                return hasRead || (this.canRead?.value ?? false);
            } catch (e) {
                return this.canRead?.value ?? false;
            }
        },
        isReadOnlyAttendanceEmployee() {
            return this.canReadAttendanceEmployee && !this.canEditAttendanceEmployee;
        },
    },
    methods: {
        toggleHeader() {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
        },
    },
}
</script>

<template>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>

    <!-- Page Wrapper -->
    <div class="page-wrapper">
        <div class="content">

            <!-- Breadcrumb -->
            <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                <div class="d-flex align-items-center">
                    <index-breadcrumb :title="title" :text="text" :text1="text1" />
                    <!-- Read-Only Badge -->
                    <span 
                        v-if="isReadOnlyAttendanceEmployee" 
                        class="badge bg-warning text-dark ms-3 d-flex align-items-center"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="You have view-only access to this module"
                    >
                        <i class="ti ti-eye me-1"></i> Read Only
                    </span>
                </div>
                <div class="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                    <div class="me-2 mb-2">
                        <div class="d-flex align-items-center border bg-white rounded p-1 me-2">
                            <router-link to="/attendance/attendance-admin" class="btn btn-icon btn-sm active bg-primary text-white me-1"><i class="ti ti-brand-days-counter"></i></router-link>
                            <router-link to="/attendance/attendance-admin" class="btn btn-icon btn-sm"><i class="ti ti-calendar-event"></i></router-link>
                        </div>
                    </div>
                    <div class="me-2 mb-2">
                        <div class="dropdown">
                            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                <i class="ti ti-file-export me-1"></i>Export
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"><i class="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"><i class="ti ti-file-type-xls me-1"></i>Export as Excel </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div v-if="canEditAttendanceEmployee" class="mb-2">
                        <a href="javascript:void(0);" class="btn btn-primary d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#attendance_report"><i class="ti ti-file-analytics me-2"></i>Report</a>
                    </div>
                    <div class="ms-2 head-icons">
                        <a href="javascript:void(0);" class="" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
                            <i class="ti ti-chevrons-up"></i>
                        </a>
                    </div>
                </div>
            </div>
            <!-- /Breadcrumb -->

            <div class="row">
                <div class="col-xl-3 col-lg-4 d-flex">
                    <div class="card flex-fill">
                        <div class="card-body">
                            <div class="mb-3 text-center">
                                <h6 class="fw-medium text-gray-5 mb-2">Good Morning, Adrian</h6>
                                <h4>08:35 AM, 11 Mar 2025</h4>
                            </div>
                            <div class="attendance-circle-progress mx-auto mb-3"  data-value='65'>
                                <span class="progress-left">
                                    <span class="progress-bar border-success"></span>
                                </span>
                                <span class="progress-right">
                                    <span class="progress-bar border-success"></span>
                                </span>
                                <div class="avatar avatar-xxl avatar-rounded">
                                    <img src="@/assets/img/profiles/avatar-27.jpg" alt="Img">
                                </div>
                            </div>
                            <div class="text-center">
                                <div class="badge badge-md badge-primary mb-3">Production :  3.45 hrs</div>
                                <h6 class="fw-medium d-flex align-items-center justify-content-center mb-3">
                                    <i class="ti ti-fingerprint text-primary me-1"></i>
                                    Punch In at  10.00 AM
                                </h6>
                                <a href="javascript:void(0);" class="btn btn-dark w-100">Punch Out</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-9 col-lg-8 d-flex">
                    <div class="row flex-fill">
                        <div class="col-xl-3 col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <div class="border-bottom mb-2 pb-2">
                                        <span class="avatar avatar-sm bg-primary mb-2"><i class="ti ti-clock-stop"></i></span>
                                        <h2 class="mb-2">8.36 / <span class="fs-20 text-gray-5"> 9</span></h2>
                                        <p class="fw-medium text-truncate">Total Hours Today</p>
                                    </div>
                                    <div>
                                        <p class="d-flex align-items-center fs-13">
                                            <span class="avatar avatar-xs rounded-circle bg-success flex-shrink-0 me-2">
                                                <i class="ti ti-arrow-up fs-12"></i>
                                            </span>
                                            <span>5% This Week</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <div class="border-bottom mb-2 pb-2">
                                        <span class="avatar avatar-sm bg-dark mb-2"><i class="ti ti-clock-up"></i></span>
                                        <h2 class="mb-2">10 / <span class="fs-20 text-gray-5"> 40</span></h2>
                                        <p class="fw-medium text-truncate">Total Hours Week</p>
                                    </div>
                                    <div>
                                        <p class="d-flex align-items-center fs-13">
                                            <span class="avatar avatar-xs rounded-circle bg-success flex-shrink-0 me-2">
                                                <i class="ti ti-arrow-up fs-12"></i>
                                            </span>
                                            <span>7% Last Week</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <div class="border-bottom mb-2 pb-2">
                                        <span class="avatar avatar-sm bg-info mb-2"><i class="ti ti-calendar-up"></i></span>
                                        <h2 class="mb-2">75 / <span class="fs-20 text-gray-5"> 98</span></h2>
                                        <p class="fw-medium text-truncate">Total Hours Month</p>
                                    </div>
                                    <div>
                                        <p class="d-flex align-items-center fs-13 text-truncate">
                                            <span class="avatar avatar-xs rounded-circle bg-danger flex-shrink-0 me-2">
                                                <i class="ti ti-arrow-down fs-12"></i>
                                            </span>
                                            <span>8% Last Month</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6">
                            <div class="card">
                                <div class="card-body">
                                    <div class="border-bottom mb-2 pb-2">
                                        <span class="avatar avatar-sm bg-pink mb-2"><i class="ti ti-calendar-star"></i></span>
                                        <h2 class="mb-2">16 / <span class="fs-20 text-gray-5"> 28</span></h2>
                                        <p class="fw-medium text-truncate">Overtime this Month</p>
                                    </div>
                                    <div>
                                        <p class="d-flex align-items-center fs-13 text-truncate">
                                            <span class="avatar avatar-xs rounded-circle bg-danger flex-shrink-0 me-2">
                                                <i class="ti ti-arrow-down fs-12"></i>
                                            </span>
                                            <span>6% Last Month</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-xl-3">
                                            <div class="mb-3">
                                                <p class="d-flex align-items-center mb-1"><i class="ti ti-point-filled text-dark-transparent me-1"></i>Total Working hours</p>
                                                <h3>12h 36m</h3>
                                            </div>
                                        </div>
                                        <div class="col-xl-3">
                                            <div class="mb-3">
                                                <p class="d-flex align-items-center mb-1"><i class="ti ti-point-filled text-success me-1"></i>Productive Hours</p>
                                                <h3>08h 36m</h3>
                                            </div>
                                        </div>
                                        <div class="col-xl-3">
                                            <div class="mb-3">
                                                <p class="d-flex align-items-center mb-1"><i class="ti ti-point-filled text-warning me-1"></i>Break hours</p>
                                                <h3>22m 15s</h3>
                                            </div>
                                        </div>
                                        <div class="col-xl-3">
                                            <div class="mb-3">
                                                <p class="d-flex align-items-center mb-1"><i class="ti ti-point-filled text-info me-1"></i>Overtime</p>
                                                <h3>02h 15m</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="progress bg-transparent-dark mb-3" style="height: 24px;">
                                                <div class="progress-bar bg-white rounded" role="progressbar" style="width: 18%;"></div>
                                                <div class="progress-bar bg-success rounded me-2" role="progressbar" style="width: 18%;"></div>
                                                <div class="progress-bar bg-warning rounded me-2" role="progressbar" style="width: 5%;"></div>
                                                <div class="progress-bar bg-success rounded me-2" role="progressbar" style="width: 28%;"></div>
                                                <div class="progress-bar bg-warning rounded me-2" role="progressbar" style="width: 17%;"></div>
                                                <div class="progress-bar bg-success rounded me-2" role="progressbar" style="width: 22%;"></div>
                                                <div class="progress-bar bg-warning rounded me-2" role="progressbar" style="width: 5%;"></div>
                                                <div class="progress-bar bg-info rounded me-2" role="progressbar" style="width: 3%;"></div>
                                                <div class="progress-bar bg-info rounded" role="progressbar" style="width: 2%;"></div>
                                                <div class="progress-bar bg-white rounded" role="progressbar" style="width: 18%;"></div>
                                            </div>
                                            
                                        </div>
                                        <div class="co-md-12">
                                            <div class="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                                                <span class="fs-10">06:00</span>
                                                <span class="fs-10">07:00</span>
                                                <span class="fs-10">08:00</span>
                                                <span class="fs-10">09:00</span>
                                                <span class="fs-10">10:00</span>
                                                <span class="fs-10">11:00</span>
                                                <span class="fs-10">12:00</span>
                                                <span class="fs-10">01:00</span>
                                                <span class="fs-10">02:00</span>
                                                <span class="fs-10">03:00</span>
                                                <span class="fs-10">04:00</span>
                                                <span class="fs-10">05:00</span>
                                                <span class="fs-10">06:00</span>
                                                <span class="fs-10">07:00</span>
                                                <span class="fs-10">08:00</span>
                                                <span class="fs-10">09:00</span>
                                                <span class="fs-10">10:00</span>
                                                <span class="fs-10">11:00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Employee Attendance</h5>
                    <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                        <div class="me-3">
                            <div class="input-icon w-120 position-relative">
                                <span class="input-icon-addon">
                                    <i class="ti ti-calendar"></i>
                                </span>
                                <date-picker
                                    v-model="startdate"
                                    class="form-control datetimepicker"
                                    placeholder="dd/mm/yyyy"
                                    :editable="true"
                                    :clearable="false"
                                    :input-format="dateFormat"
                                />
                            </div>
                        </div>
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                Select Status
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Present</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Absent</a>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown">
                            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                Sort By : Last 7 Days
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Recently Added</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Ascending</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Desending</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Last Month</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Last 7 Days</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="custom-datatable-filter table-responsive">
                       <attendence-employee-table></attendence-employee-table>
                    </div>
                </div>
            </div>

        </div>

        <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
            <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
            <p>Designed &amp; Developed By <a href="javascript:void(0);" class="text-primary">Dreams</a></p>
        </div>

    </div>
    <!-- /Page Wrapper -->

    <attendance-employee-modal></attendance-employee-modal>
</template>
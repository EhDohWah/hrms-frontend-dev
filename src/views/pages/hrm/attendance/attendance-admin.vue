<script>
import { ref } from "vue";
import { usePermissions } from '@/composables/usePermissions';

const currentDate = ref(new Date());

export default {
    setup() {
        // Initialize permission checks for attendance_admin module
        const { 
            canRead, 
            canEdit, 
            isReadOnly, 
            accessLevelText, 
            accessLevelBadgeClass 
        } = usePermissions('attendance_admin');

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
            title: "Attendance Admin",
            text: "Employee",
            text1: "Attendance Admin",
            startdate: currentDate,
            dateFormat: "dd-MM-yyyy",
        }
    },
    computed: {
        // Permission checks - primary source for reactivity
        canEditAttendanceAdmin() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasEdit = Array.isArray(permissions) && permissions.includes('attendance_admin.edit');
                return hasEdit || (this.canEdit?.value ?? false);
            } catch (e) {
                console.error('[AttendanceAdmin] Error checking permissions:', e);
                return this.canEdit?.value ?? false;
            }
        },
        canReadAttendanceAdmin() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasRead = Array.isArray(permissions) && permissions.includes('attendance_admin.read');
                return hasRead || (this.canRead?.value ?? false);
            } catch (e) {
                return this.canRead?.value ?? false;
            }
        },
        isReadOnlyAttendanceAdmin() {
            return this.canReadAttendanceAdmin && !this.canEditAttendanceAdmin;
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
                        v-if="isReadOnlyAttendanceAdmin" 
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
                            <router-link to="/attendance/attendance-employee" class="btn btn-icon btn-sm me-1"><i
                                    class="ti ti-brand-days-counter"></i></router-link>
                            <router-link to="/attendance/attendance-admin" class="btn btn-icon btn-sm active bg-primary text-white"><i
                                    class="ti ti-calendar-event"></i></router-link>
                        </div>
                    </div>
                    <div class="me-2 mb-2">
                        <div class="dropdown">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                <i class="ti ti-file-export me-1"></i>Export
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                                            class="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                                            class="ti ti-file-type-xls me-1"></i>Export as Excel </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div v-if="canEditAttendanceAdmin" class="mb-2">
                        <a href="javascript:void(0);" class="btn btn-primary d-flex align-items-center"
                            data-bs-target="#attendance_report" data-bs-toggle="modal"><i
                                class="ti ti-file-analytics me-2"></i>Report</a>
                    </div>
                    <div class="ms-2 head-icons">
                        <a href="javascript:void(0);" class="" id="collapse-header" @click="toggleHeader">
                            <i class="ti ti-chevrons-up"></i>
                        </a>
                    </div>
                </div>
            </div>
            <!-- /Breadcrumb -->

            <div class="card border-0">
                <div class="card-body">
                    <div class="row align-items-center mb-4">
                        <div class="col-md-5">
                            <div class="mb-3 mb-md-0">
                                <h4 class="mb-1">Attendance Details Today</h4>
                                <p>Data from the 800+ total no of employees</p>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <div class="d-flex align-items-center justify-content-md-end">
                                <h6>Total Absenties today</h6>
                                <div class="avatar-list-stacked avatar-group-sm ms-4">
                                    <span class="avatar avatar-rounded">
                                        <img class="border border-white" src="@/assets/img/profiles/avatar-02.jpg"
                                            alt="img">
                                    </span>
                                    <span class="avatar avatar-rounded">
                                        <img class="border border-white" src="@/assets/img/profiles/avatar-03.jpg"
                                            alt="img">
                                    </span>
                                    <span class="avatar avatar-rounded">
                                        <img class="border border-white" src="@/assets/img/profiles/avatar-05.jpg"
                                            alt="img">
                                    </span>
                                    <span class="avatar avatar-rounded">
                                        <img class="border border-white" src="@/assets/img/profiles/avatar-06.jpg"
                                            alt="img">
                                    </span>
                                    <span class="avatar avatar-rounded">
                                        <img class="border border-white" src="@/assets/img/profiles/avatar-07.jpg"
                                            alt="img">
                                    </span>
                                    <a class="avatar bg-primary avatar-rounded text-fixed-white fs-12"
                                        href="javascript:void(0);">
                                        +1
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="border rounded">
                        <div class="row gx-0">
                            <div class="col-md col-sm-4 border-end">
                                <div class="p-3">
                                    <span class="fw-medium mb-1 d-block">Present</span>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h5>250</h5>
                                        <span class="badge badge-success d-inline-flex align-items-center">
                                            <i class="ti ti-arrow-wave-right-down me-1"></i>
                                            +1%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md col-sm-4 border-end">
                                <div class="p-3">
                                    <span class="fw-medium mb-1 d-block">Late Login</span>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h5>45</h5>
                                        <span class="badge badge-danger d-inline-flex align-items-center">
                                            <i class="ti ti-arrow-wave-right-down me-1"></i>
                                            -1%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md col-sm-4 border-end">
                                <div class="p-3">
                                    <span class="fw-medium mb-1 d-block">Uninformed</span>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h5>15</h5>
                                        <span class="badge badge-danger d-inline-flex align-items-center">
                                            <i class="ti ti-arrow-wave-right-down me-1"></i>
                                            -12%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md col-sm-4 border-end">
                                <div class="p-3">
                                    <span class="fw-medium mb-1 d-block">Permisson</span>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h5>03</h5>
                                        <span class="badge badge-success d-inline-flex align-items-center">
                                            <i class="ti ti-arrow-wave-right-down me-1"></i>
                                            +1%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md col-sm-4">
                                <div class="p-3">
                                    <span class="fw-medium mb-1 d-block">Absent</span>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h5>12</h5>
                                        <span class="badge badge-danger d-inline-flex align-items-center">
                                            <i class="ti ti-arrow-wave-right-down me-1"></i>
                                            -19%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Admin Attendance</h5>
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
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                Department
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Finance</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Application
                                        Development</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">IT Management</a>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
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
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
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
                        <attendence-admin-table></attendence-admin-table>
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

    <attendence-admin-modal></attendence-admin-modal>
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";

import {
    userChart
} from "./data";

export default {
    data() {
        return {
            title: "User Report",
            text: "HR",
            text1: "User Report",
            userChart: userChart,
        }
    },
    methods: {
        toggleHeader() {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
        },
    },
    setup() {
        const dateRangeInput = ref(null);

        // Move the function declaration outside of the onMounted callback
        function booking_range(start, end) {
        return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
        }

        onMounted(() => {
        if (dateRangeInput.value) {
            const start = moment().subtract(6, "days");
            const end = moment();

            new DateRangePicker(
            dateRangeInput.value,
            {
                startDate: start,
                endDate: end,
                ranges: {
                Today: [moment(), moment()],
                Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
                "Last 7 Days": [moment().subtract(6, "days"), moment()],
                "Last 30 Days": [moment().subtract(29, "days"), moment()],
                "This Month": [moment().startOf("month"), moment().endOf("month")],
                "Last Month": [
                    moment().subtract(1, "month").startOf("month"),
                    moment().subtract(1, "month").endOf("month"),
                ],
                },
            },
            booking_range
            );

            booking_range(start, end);
        }
        });

        return {
        dateRangeInput,
        };
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
                <index-breadcrumb :title="title" :text="text" :text1="text1" />
                <div class="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                    <div class="mb-2">
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
                    <div class="head-icons ms-2">
                        <a href="javascript:void(0);" class="" id="collapse-header" @click="toggleHeader">
                            <i class="ti ti-chevrons-up"></i>
                        </a>
                    </div>
                </div>
            </div>
            <!-- /Breadcrumb -->
            <div class="row">
                <div class="col-xl-6 d-flex">
                    <div class="row flex-fill">
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <div class="d-flex align-items-center">
                                            <div>
                                                <p class="fs-12 fw-medium mb-1 text-truncate">Total Users</p>
                                                <h4>800</h4>
                                            </div>
                                        </div>
                                        <div class="leave-report-icon">
                                            <a href="javascript:void(0);">
                                                <span class="p-2 border border-primary bg-transparent-primary rounded-3 d-flex align-items-center justify-content-center">
                                                    <i class="ti ti-user text-primary"></i>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                    <p class="fs-12 fw-normal d-flex align-items-center text-truncate">
                                        <span class="text-success fs-12 d-flex align-items-center me-1">
                                            <i class="ti ti-arrow-wave-right-up me-1"></i>+20.01% 
                                        </span> from last week
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <div class="d-flex align-items-center">
                                            <div>
                                                <p class="fs-12 fw-medium mb-1 text-truncate">Active Users</p>
                                                <h4>750</h4>
                                            </div>
                                        </div>
                                        <div class="leave-report-icon">
                                            <a href="javascript:void(0);">
                                                <span class="p-2 border border-success bg-transparent-success rounded-3 d-flex align-items-center justify-content-center">
                                                    <i class="ti ti-user-check text-success"></i>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                    <p class="fs-12 fw-normal d-flex align-items-center text-truncate">
                                        <span class="text-success fs-12 d-flex align-items-center me-1">
                                            <i class="ti ti-arrow-wave-right-up me-1"></i>+17.02% 
                                        </span> from last week
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <div class="d-flex align-items-center">
                                            <div>
                                                <p class="fs-12 fw-medium mb-1 text-truncate">New Users</p>
                                                <h4>100</h4>
                                            </div>
                                        </div>
                                        <div class="leave-report-icon">
                                            <a href="javascript:void(0);">
                                                <span class="p-2 border border-skyblue bg-transparent-skyblue rounded-3 d-flex align-items-center justify-content-center">
                                                    <i class="ti ti-user-up text-skyblue"></i>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                    <p class="fs-12 fw-normal d-flex align-items-center text-truncate">
                                        <span class="text-success fs-12 d-flex align-items-center me-1">
                                            <i class="ti ti-arrow-wave-right-up me-1"></i>+10.01% 
                                        </span> from last week
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <div class="d-flex align-items-center">
                                            <div>
                                                <p class="fs-12 fw-medium mb-1 text-truncate">Inactive Users</p>
                                                <h4>50</h4>
                                            </div>
                                        </div>
                                        <div class="leave-report-icon">
                                            <a href="javascript:void(0);">
                                                <span class="p-2 border border-danger bg-transparent-danger rounded-3 d-flex align-items-center justify-content-center">
                                                    <i class="ti ti-user-pause text-danger"></i>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                    <p class="fs-12 fw-normal d-flex align-items-center text-truncate">
                                        <span class="text-danger fs-12 d-flex align-items-center me-1">
                                            <i class="ti ti-arrow-wave-right-up me-1"></i>-10.01% 
                                        </span> from last week
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-header border-0 pb-0">
                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                                <div class="d-flex align-items-center ">
                                    <span class="me-2"><i class="ti ti-chart-bar text-danger"></i></span>
                                    <h5>Users</h5>
                                </div>
                                <div class="d-flex align-items-center">
                                    <p class="d-inline-flex align-items-center me-2 mb-0">
                                        <i class="ti ti-square-filled fs-12 text-success me-2"></i>
                                        Active Users
                                    </p>
                                    <p class="d-inline-flex align-items-center mb-0 me-2">
                                        <i class="ti ti-square-filled fs-12 text-light me-2"></i>
                                        Inactive Users
                                    </p>
                                </div>
                                <div class="dropdown">
                                    <a href="javascript:void(0);" class="dropdown-toggle btn btn-sm fs-12 btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                        This Year
                                    </a>
                                    <ul class="dropdown-menu  dropdown-menu-end p-2">
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
                        <div class="card-body py-0">
                            <div id="user-chart">
                                <apexchart
                                    type="bar"
                                    height="185"
                                    :options="userChart.sline"
                                    :series="userChart.series"
                                ></apexchart>
                             </div>
                        </div>
                    </div>
                </div>					
            </div>

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Users List</h5>
                    <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                        <div class="me-3">
                            <div class="input-icon-end position-relative">
                                <input type="text" class="form-control date-range bookingrange" ref="dateRangeInput" placeholder="dd/mm/yyyy - dd/mm/yyyy">
                                <span class="input-icon-addon">
                                    <i class="ti ti-chevron-down"></i>
                                </span>
                            </div>
                        </div>
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                Role
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Employee</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Client</a>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                Status
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Active</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Inactive</a>
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
                        <user-report-table></user-report-table>
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
</template>
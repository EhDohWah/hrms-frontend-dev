<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";

import {
    leaveReport
} from "./data";

export default {
    data() {
        return {
            title: "Leave Report",
            text: "HR",
            text1: "Leave Report",
            leaveReport: leaveReport,
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
                        <!-- Total Companies -->
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2 overflow-hidden">
                                        <div>
                                            <p class="fs-12 fw-normal mb-1 text-truncate">Total Leaves</p>
                                            <h4>15</h4>
                                        </div>
                                        <div class="leave-report-icon">
                                            <a href="javascript:void(0);"><span class="p-2 border border-primary bg-transparent-primary rounded-circle d-flex align-items-center justify-content-center"><i class="ti ti-calendar-x text-primary"></i></span></a>
                                        </div>
                                    </div>
                                    <div class="p-2 bg-gray-100 br-5">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <p class="fs-12 fw-normal mb-0">Last Month</p>
                                            <span class="fs-12 fw-normal text-success d-flex align-items-center"><i class="ti ti-arrow-wave-right-up text-success me-1"></i>+17.02%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- /Total Companies -->

                            <!-- Total Companies -->
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2 overflow-hidden">
                                        <div>
                                            <p class="fs-12 fw-normal mb-1 text-truncate">Approved Leaves</p>
                                            <h4>15</h4>
                                        </div>
                                        <div class="leave-report-icon">
                                            <a href="javascript:void(0);"><span class="p-2 border border-success bg-transparent-success rounded-circle d-flex align-items-center justify-content-center"><i class="ti ti-calendar-x text-success"></i></span></a>
                                        </div>
                                    </div>
                                    <div class="p-2 bg-gray-100 br-5">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <p class="fs-12 fw-normal mb-0">Last Month</p>
                                            <span class="fs-12 fw-normal text-success d-flex align-items-center"><i class="ti ti-arrow-wave-right-up text-success me-1"></i>+17.02%</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <!-- /Total Companies -->

                        <!-- Inactive Companies -->
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2 overflow-hidden">
                                        <div>
                                            <p class="fs-12 fw-normal mb-1 text-truncate">Pending Requests</p>
                                            <h4>5</h4>
                                        </div>
                                        <div class="leave-report-icon">
                                            <a href="javascript:void(0);"><span class="p-2 border border-skyblue bg-transparent-skyblue rounded-circle d-flex align-items-center justify-content-center"><i class="ti ti-calendar-x text-skyblue"></i></span></a>
                                        </div>
                                    </div>
                                    <div class="p-2 bg-gray-100 br-5">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <p class="fs-12 fw-normal mb-0">Last Month</p>
                                            <span class="fs-12 fw-normal text-success d-flex align-items-center"><i class="ti ti-arrow-wave-right-up text-success me-1"></i>+17.02%</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <!-- /Inactive Companies -->

                        <!-- Company Location -->
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2 overflow-hidden">
                                        <div>
                                            <p class="fs-12 fw-normal mb-1 text-truncate">Rejected Leaves</p>
                                            <h4>5</h4>
                                        </div>
                                        <div class="leave-report-icon">
                                            <a href="javascript:void(0);"><span class="p-2 border border-danger bg-transparent-danger rounded-circle d-flex align-items-center justify-content-center"><i class="ti ti-calendar-x text-danger"></i></span></a>
                                        </div>
                                    </div>
                                    <div class="p-2 bg-gray-100 br-5">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <p class="fs-12 fw-normal mb-0">Last Month</p>
                                            <span class="fs-12 fw-normal text-success d-flex align-items-center"><i class="ti ti-arrow-wave-right-up text-success me-1"></i>+17.02%</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <!-- /Company Location -->
                    </div>
                </div>
                <div class="col-xl-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-header border-0 pb-0">
                            <div class="d-flex flex-wrap justify-content-between align-items-center row-gap-2">
                                <div class="d-flex align-items-center ">
                                    <span class="me-2"><i class="ti ti-chart-bar text-danger"></i></span>
                                    <h5>Leaves </h5>
                                </div>
                                <div class="d-flex align-items-center">
                                    <p class="d-inline-flex align-items-center me-2 mb-0">
                                        <i class="ti ti-square-filled fs-12 text-success me-2"></i>
                                        Annual 
                                    </p>
                                    <p class="d-inline-flex align-items-center mb-0 me-2">
                                        <i class="ti ti-square-filled fs-12 text-warning me-2"></i>
                                        Casual
                                    </p>
                                    <p class="d-inline-flex align-items-center mb-0 me-2">
                                        <i class="ti ti-square-filled fs-12 text-dark me-2"></i>
                                        Medical
                                    </p>
                                    <p class="d-inline-flex align-items-center">
                                        <i class="ti ti-square-filled fs-12 text-primary me-2"></i>
                                        Others
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
                            <div id="leave-report">
                                <apexchart
                                    type="bar"
                                    height="210"
                                    :options="leaveReport.sline"
                                    :series="leaveReport.series"
                                ></apexchart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Invoice List</h5>
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
                                $0.00 - $0.00
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">$3000</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">$2500</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">$2800</a>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                Select Status
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Paid</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Sent</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Partially Paid</a>
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
                       <leave-report-table></leave-report-table>
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
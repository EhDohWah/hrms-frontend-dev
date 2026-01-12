<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";

import {
    taskReports,
    donutAreaChart,
    donutAreaChartOne,
    donutAreaChartTwo,
    donutAreaChartThree,
} from "./data";

export default {
    data() {
        return {
            title: "Task Report",
            text: "HR",
            text1: "Task Report",
            taskReports: taskReports,
            donutAreaChart: donutAreaChart,
            donutAreaChartOne: donutAreaChartOne,
            donutAreaChartTwo: donutAreaChartTwo,
            donutAreaChartThree: donutAreaChartThree,
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

                <!-- Total Exponses -->
                <div class="col-lg-6 col-md-6 d-flex">
                    <div class="row flex-fill">
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body ">
                                    <div class="row align-items-center">
                                        <div class="col-8">
                                            <div>
                                                <span class="fs-14 fw-normal text-truncate mb-1">Total Tasks</span>
                                                <h5>800</h5>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <apexchart
                                                type="donut"
                                                height="200"
                                                :options="donutAreaChart.sline"
                                                :series="donutAreaChart.series"
                                            ></apexchart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body ">
                                    <div class="row align-items-center">
                                        <div class="col-8">
                                            <div>
                                                <span class="fs-14 fw-normal text-truncate mb-1">Total Tasks</span>
                                                <h5>800</h5>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <apexchart
                                                type="donut"
                                                height="200"
                                                :options="donutAreaChartOne.sline"
                                                :series="donutAreaChartOne.series"
                                            ></apexchart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-8">
                                            <div>
                                                <span class="fs-14 fw-normal text-truncate mb-1">Total Tasks</span>
                                                <h5>800</h5>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <apexchart
                                                type="donut"
                                                height="200"
                                                :options="donutAreaChartTwo.sline"
                                                :series="donutAreaChartTwo.series"
                                            ></apexchart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body ">
                                    <div class="row align-items-center">
                                        <div class="col-8">
                                            <div>
                                                <span class="fs-14 fw-normal text-truncate mb-1">Total Tasks</span>
                                                <h5>800</h5>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <apexchart
                                                type="donut"
                                                height="200"
                                                :options="donutAreaChartThree.sline"
                                                :series="donutAreaChartThree.series"
                                            ></apexchart>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Total Exponses -->

                <!-- Total Exponses -->
                <div class="col-lg-6 col-md-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-header border-0">
                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                                <div class="d-flex align-items-center ">
                                    <span class="me-2"><i class="ti ti-chart-pie text-danger"></i></span>
                                    <h5>Tasks</h5>
                                </div>
                                <div class="dropdown">
                                    <a href="javascript:void(0);" class="dropdown-toggle btn btn-sm fs-12 btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                        Office Management App
                                    </a>
                                    <ul class="dropdown-menu  dropdown-menu-end p-2">
                                        <li>
                                            <a href="javascript:void(0);" class="dropdown-item rounded-1">PRO-001</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);" class="dropdown-item rounded-1">PRO-002</a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);" class="dropdown-item rounded-1">PRO-004</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card-body pt-0">
                            <div class="row align-items-center">
                                <div class="col-md-6 d-flex align-items-center justify-content-center">
                                    <div class="position-relative payment-total">
                                        <div id="task-reports">
                                            <apexchart
                                                type="donut"
                                                height="180"
                                                :options="taskReports.sline"
                                                :series="taskReports.series"
                                            ></apexchart>
                                        </div>
                                        <div class="task-total-content ">
                                            <p class="fs-16 fw-normal mb-0">Pending</p>
                                            <span class="display-3 fs-24 fw-bold text-skyblue">30%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row gy-4">
                                        <div class="col-md-6">
                                            <div class="d-flex task-report-icons">
                                                <span class="me-2"><i class="ti ti-arrow-badge-right-filled text-success"></i></span>
                                                <h6 class="fs-16">Completed <span class="fs-14 fw-normal">40%</span></h6>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="d-flex task-report-icons">
                                                <span class="me-2"><i class="ti ti-arrow-badge-right-filled text-skyblue"></i></span>
                                                <h6 class="fs-16">Pending <span class="fs-14 fw-normal">30 %</span></h6>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="d-flex task-report-icons">
                                                <span class="me-2"><i class="ti ti-arrow-badge-right-filled text-warning"></i></span>
                                                <h6 class="fs-16">Inprogress  <span class="fs-14 fw-normal">20 %</span></h6>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="d-flex task-report-icons">
                                                <span class="me-2"><i class="ti ti-arrow-badge-right-filled text-purple"></i></span>
                                                <h6 class="fs-16">On Hold <span class="fs-14 fw-normal">10 %</span></h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Total Exponses -->
            </div>
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Tasks List</h5>
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
                                Select Priority
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Low</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Medium</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">High</a>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                Select Status
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
                        <task-report-table></task-report-table>
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
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";

import {
    projectReport
} from "./data";

export default {
    data() {
        return {
            title: "Project Report",
            text: "HR",
            text1: "Project Report",
            projectReport: projectReport,
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
                                    <div>
                                            <div class="mb-2">
                                                <span class="fs-14 fw-normal text-truncate mb-1">Total Projects</span>
                                                <h5>300</h5>
                                            </div>
                                            <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%;height: 5px;">
                                                <div class="progress-bar bg-pink" style="width: 70%"></div>
                                            </div>
                                    </div>
                                    <div class="d-flex mt-2">
                                        <p class="fs-12 fw-normal d-flex align-items-center text-truncate"><span class="text-success fs-12 d-flex align-items-center me-1"><i class="ti ti-arrow-wave-right-up me-1"></i>+10.54%</span>from last month</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body ">
                                    <div>
                                            <div class="mb-2">
                                                <span class="fs-14 fw-normal text-truncate mb-1">Completed Projects</span>
                                                <h5>250</h5>
                                            </div>
                                            <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%;height: 5px;">
                                                <div class="progress-bar bg-success" style="width: 80%"></div>
                                            </div>
                                    </div>
                                    <div class="d-flex mt-2">
                                        <p class="fs-12 fw-normal d-flex align-items-center text-truncate"><span class="text-success fs-12 d-flex align-items-center me-1"><i class="ti ti-arrow-wave-right-up me-1"></i>+12.84%</span>from last month</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body ">
                                    <div>
                                            <div class="mb-2">
                                                <span class="fs-14 fw-normal text-truncate mb-1">Pending Projects</span>
                                                <h5>50</h5>
                                            </div>
                                            <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%;height: 5px;">
                                                <div class="progress-bar bg-danger" style="width: 20%"></div>
                                            </div>
                                    </div>
                                    <div class="d-flex mt-2">
                                        <p class="fs-12 fw-normal d-flex align-items-center text-truncate"><span class="text-danger fs-12 d-flex align-items-center me-1"><i class="ti ti-arrow-wave-right-up me-1"></i>-10.75%</span>from last month</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 d-flex">
                            <div class="card flex-fill">
                                <div class="card-body ">
                                    <div>
                                            <div class="mb-2">
                                                <span class="fs-14 fw-normal text-truncate mb-1">New Projects</span>
                                                <h5>30</h5>
                                            </div>
                                            <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%;height: 5px;">
                                                <div class="progress-bar bg-purple" style="width: 60%"></div>
                                            </div>
                                    </div>
                                    <div class="d-flex mt-2">
                                        <p class="fs-12 fw-normal d-flex align-items-center text-truncate"><span class="text-success fs-12 d-flex align-items-center me-1"><i class="ti ti-arrow-wave-right-up me-1"></i>+15.74%</span>from last month</p>
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
                                    <h5>Projects By Tasks</h5>
                                </div>
                                <div class="dropdown">
                                    <a href="javascript:void(0);"
                                        class="dropdown-toggle btn btn-sm fs-12 btn-white d-inline-flex align-items-center"
                                        data-bs-toggle="dropdown">
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
                                <div class="col-md-6 d-flex justify-content-center">
                                    <div id="project-report">
                                        <apexchart
                                            type="pie"
                                            height="190"
                                            :options="projectReport.sline"
                                            :series="projectReport.series"
                                        ></apexchart>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row gy-4">
                                        <div class="col-md-6">
                                            <p class="fs-16 project-report-badge-blue fw-normal mb-0 text-gray-5">Pending </p>
                                            <p class="fs-20 fw-bold text-dark ">30%</p>
                                        </div>
                                        <div class="col-md-6">
                                            <p class="fs-16 project-report-badge-purple mb-0  fw-normal text-gray-5">On Hold</p>
                                            <p class="fs-20 fw-bold text-dark ">10%</p>
                                        </div>
                                        <div class="col-md-6">
                                            <p class="fs-16 project-report-badge-warning  mb-0 fw-normal text-gray-5">Inprogress </p>
                                            <p class="fs-20 fw-bold text-dark ">20%</p>
                                        </div>
                                        <div class="col-md-6">
                                            <p class="fs-16 project-report-badge-success  mb-0 fw-normal text-gray-5">Completed</p>
                                            <p class="fs-20 fw-bold text-dark ">40%</p>
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
                    <h5>Project List</h5>
                    <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                        <div class="me-3">
                            <div class="input-icon-end position-relative">
                                <input type="text" class="form-control date-range bookingrange" ref="dateRangeInput"
                                    placeholder="dd/mm/yyyy - dd/mm/yyyy">
                                <span class="input-icon-addon">
                                    <i class="ti ti-chevron-down"></i>
                                </span>
                            </div>
                        </div>
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
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
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
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
                        <project-report-table></project-report-table>
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

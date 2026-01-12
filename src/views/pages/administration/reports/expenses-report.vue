<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";

import {
    expenseAnalysis
} from "./data";

export default {
    data(){
        return {
            title :"Expense Report",
            text: "HR",
            text1: "Expense Report",
            expenseAnalysis: expenseAnalysis,
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
                <div class="col-xl-6 d-flex">
                    <div class="row flex-fill">
                        <div class="col-md-6 d-flex">
                            <div class="card flex-fill position-relative">
                                <span class="position-absolute start-0 bottom-0">
                                    <img src="@/assets/img/reports-img/total-expense.svg" alt="img" class="img-fluid">		
                                </span>
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <span class="fs-14 fw-normal text-truncate mb-1">Total Expense</span>
                                            <h5>$45,221</h5>
                                        </div>
                                        <a href="javascript:void(0);" class="avatar avatar-md avatar-rounded bg-transparent-primary border border-primary">
                                            <span class="text-primary"><i class="ti ti-brand-shopee"></i></span>
                                        </a>
                                    </div>
                                    <p class="fs-12 fw-normal d-flex align-items-center text-truncate">
                                        <span class="text-success fs-12 d-flex align-items-center me-1">
                                            <i class="ti ti-arrow-wave-right-up me-1"></i>+20.01% 
                                        </span> from last week
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 d-flex">
                            <div class="card flex-fill position-relative">
                                <span class="position-absolute start-0 bottom-0">
                                    <img src="@/assets/img/reports-img/approved-expense.svg" alt="img" class="img-fluid">		
                                </span>
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <span class="fs-14 fw-normal text-truncate mb-1">Approved Expense</span>
                                            <h5>$45,221</h5>
                                        </div>
                                        <a href="javascript:void(0);" class="avatar avatar-md avatar-rounded bg-transparent-success border border-success">
                                            <span class="text-success"><i class="ti ti-brand-shopee"></i></span>
                                        </a>
                                    </div>
                                    <p class="fs-12 fw-normal d-flex align-items-center text-truncate">
                                        <span class="text-success fs-12 d-flex align-items-center me-1">
                                            <i class="ti ti-arrow-wave-right-up me-1"></i>+17.01% 
                                        </span> from last week
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 d-flex">
                            <div class="card flex-fill position-relative">
                                <span class="position-absolute start-0 bottom-0">
                                    <img src="@/assets/img/reports-img/pending-expense.svg" alt="img" class="img-fluid">		
                                </span>
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <span class="fs-14 fw-normal text-truncate mb-1">Net Pay</span>
                                            <h5>$45,221,45</h5>
                                        </div>
                                        <a href="javascript:void(0);" class="avatar avatar-md avatar-rounded bg-transparent-skyblue border border-skyblue">
                                            <span class="text-skyblue"><i class="ti ti-brand-shopee"></i></span>
                                        </a>
                                    </div>
                                    <p class="fs-12 fw-normal d-flex align-items-center text-truncate">
                                        <span class="text-success fs-12 d-flex align-items-center me-1">
                                            <i class="ti ti-arrow-wave-right-up me-1"></i>+10.13% 
                                        </span> from last week
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 d-flex">
                            <div class="card flex-fill position-relative">
                                <span class="position-absolute start-0 bottom-0">
                                    <img src="@/assets/img/reports-img/reject-expense.svg" alt="img" class="img-fluid">		
                                </span>
                                <div class="card-body">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                            <span class="fs-14 fw-normal text-truncate mb-1">Allowances</span>
                                            <h5>$45,221,45</h5>
                                        </div>
                                        <a href="javascript:void(0);" class="avatar avatar-md avatar-rounded bg-transparent-danger border border-danger">
                                            <span class="text-danger"><i class="ti ti-brand-shopee"></i></span>
                                        </a>
                                    </div>
                                    <p class="fs-12 fw-normal d-flex align-items-center text-truncate">
                                        <span class="text-danger fs-12 d-flex align-items-center me-1">
                                            <i class="ti ti-arrow-wave-right-up me-1"></i>-10.17% 
                                        </span> from last week
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Total Exponses -->

                <!-- Total Exponses -->
                <div class="col-xl-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-header border-0 pb-0">
                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                                <div class="d-flex align-items-center ">
                                    <span class="me-2"><i class="ti ti-chart-area-line text-danger"></i></span>
                                    <h5>Expense </h5>
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
                            <div id="expense-analysis">
                                <apexchart
                                    type="line"
                                    height="130"
                                    :options="expenseAnalysis.sline"
                                    :series="expenseAnalysis.series"
                                ></apexchart>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Total Exponses -->
                    
            </div>
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Expense List</h5>
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
                                $0.00 - $00
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">$3800</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">$4500</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">$3400</a>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                Payment Type
                            </a>
                            <ul class="dropdown-menu  dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Cash</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">Cheque</a>
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
                        <expenses-report-table></expenses-report-table>
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
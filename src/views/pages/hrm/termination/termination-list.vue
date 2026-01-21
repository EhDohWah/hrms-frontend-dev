<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";

export default {
  data() {
    return {
      title: "Termination",
      text: "Performance",
      text1: "Termination",
    };
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
};
</script>

<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div
        class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3"
      >
        <breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="mb-2">
            <a
              href="javascript:void(0);"
              class="btn btn-primary d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#new_termination"
              ><i class="ti ti-circle-plus me-2"></i>Add Termination</a
            >
          </div>
          <div class="head-icons ms-2">
            <a
              href="javascript:void(0);"
              class=""
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-original-title="Collapse"
              id="collapse-header"
              @click="toggleHeader"
            >
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Resignation List -->
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div
              class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
            >
              <h5 class="d-flex align-items-center">Termination List</h5>
              <div class="d-flex align-items-center flex-wrap row-gap-3">
                <div class="input-icon position-relative me-2">
                  <span class="input-icon-addon">
                    <i class="ti ti-calendar"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control date-range bookingrange"
                    ref="dateRangeInput"
                    placeholder="dd/mm/yyyy - dd/mm/yyyy "
                  />
                </div>
                <div class="dropdown">
                  <a
                    href="javascript:void(0);"
                    class="dropdown-toggle btn btn-white d-inline-flex align-items-center fs-12"
                    data-bs-toggle="dropdown"
                  >
                    <p class="fs-12 d-inline-flex me-1">Sort By :</p>
                    Last 7 Days
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end p-3">
                    <li>
                      <a href="javascript:void(0);" class="dropdown-item rounded-1"
                        >Last 7 Days</a
                      >
                    </li>
                    <li>
                      <a href="javascript:void(0);" class="dropdown-item rounded-1"
                        >Created Date</a
                      >
                    </li>
                    <li>
                      <a href="javascript:void(0);" class="dropdown-item rounded-1"
                        >Due Date</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="card-body p-0">
              <div class="custom-datatable-filter table-responsive">
                <termination-table></termination-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Resignation List  -->
    </div>

    <!-- Footer -->
    <div
      class="footer d-sm-flex align-items-center justify-content-between bg-white border-top p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
    <!-- /Footer -->
  </div>
  <!-- /Page Wrapper -->

  <termination-modal></termination-modal>
</template>

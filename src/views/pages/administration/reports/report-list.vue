<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref, onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      title: "Reports List",
      text: "Administration",
      text1: "Reports List",
      loading: false,
      reports: [
        {
          id: 1,
          name: "Employee Report",
          description: "View detailed employee statistics and demographics",
          path: "/administration/reports/employee-report",
          icon: "user-group"
        },
        {
          id: 2,
          name: "User Report",
          description: "System user activity and access statistics",
          path: "/administration/reports/user-report",
          icon: "user"
        },
        {
          id: 3,
          name: "Attendance Report",
          description: "Employee attendance and time tracking",
          path: "/administration/reports/attendance-report",
          icon: "clock"
        },
        {
          id: 4,
          name: "Payroll Report",
          description: "Salary and compensation analytics",
          path: "/administration/reports/payroll-report",
          icon: "wallet"
        },
        {
          id: 5,
          name: "Leave Report",
          description: "Employee leave and time-off statistics",
          path: "/administration/reports/leave-report",
          icon: "calendar"
        }
      ]
    };
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
    previewReport(reportId) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        message.success(`Report ${reportId} preview generated successfully`);
        console.log(`Previewing report ${reportId}`);
      }, 800);
    },
    exportPDF(reportId) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        message.success(`Report ${reportId} exported as PDF successfully`);
        console.log(`Exporting report ${reportId} as PDF`);
      }, 800);
    },
    exportExcel(reportId) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        message.success(`Report ${reportId} exported as Excel successfully`);
        console.log(`Exporting report ${reportId} as Excel`);
      }, 800);
    },
    exportCSV(reportId) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        message.success(`Report ${reportId} exported as CSV successfully`);
        console.log(`Exporting report ${reportId} as CSV`);
      }, 800);
    },
    navigateToReport(path) {
      this.$router.push(path);
    }
  },
  setup() {
    const dateRangeInputs = ref([]);
    const activeTab = ref("all");

    function booking_range(start, end) {
      return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
    }

    onMounted(() => {
      setTimeout(() => {
        document.querySelectorAll(".date-range").forEach((element) => {
          const start = moment().subtract(29, "days");
          const end = moment();

          new DateRangePicker(
            element,
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
                  moment().subtract(1, "month").endOf("month")
                ],
                "Last Quarter": [
                  moment().subtract(3, "month").startOf("month"),
                  moment().endOf("month")
                ],
                Annual: [moment().startOf("year"), moment().endOf("year")]
              }
            },
            booking_range
          );
        });
      }, 100);
    });

    return {
      dateRangeInputs,
      activeTab
    };
  }
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
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="head-icons ms-2">
            <a
              href="javascript:void(0);"
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

      <div class="card">
        <div class="card-header">
          <h5>Report Generators</h5>
          <p class="text-muted">Generate and export various reports</p>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table custom-table mb-0">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Report Period</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in reports" :key="report.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar avatar-sm me-2 flex-shrink-0">
                        <span class="avatar-text rounded-circle bg-primary">
                          <i class="ti ti-file-report text-white"></i>
                        </span>
                      </div>
                      <div>
                        <h6 class="mb-0">{{ report.name }}</h6>
                        <p class="text-muted fs-12 mb-0">
                          {{ report.description }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-icon-end position-relative">
                      <input
                        type="text"
                        class="form-control date-range"
                        placeholder="Select date range"
                      />
                      <span class="input-icon-addon">
                        <i class="ti ti-calendar"></i>
                      </span>
                    </div>
                  </td>
                  <td class="text-end">
                    <div class="d-flex justify-content-end">
                      <a
                        href="javascript:void(0);"
                        class="btn btn-sm btn-primary me-2"
                        @click="previewReport(report.id)"
                      >
                        <i class="ti ti-eye me-1"></i> Preview
                      </a>

                      <!-- Updated actions dropdown with click trigger -->
                      <a-dropdown :trigger="['click']">
                        <a-button type="default" size="small">
                          <i class="ti ti-file-export me-1"></i>
                          Export <i class="ti ti-arrow-down"></i>
                        </a-button>
                        <template #overlay>
                          <a-menu>
                            <a-menu-item key="pdf" @click="exportPDF(report.id)">
                              <i class="ti ti-file-type-pdf me-1"></i>
                              Export as PDF
                            </a-menu-item>
                            <a-menu-item key="excel" @click="exportExcel(report.id)">
                              <i class="ti ti-file-type-xls me-1"></i>
                              Export as Excel
                            </a-menu-item>
                            <a-menu-item key="csv" @click="exportCSV(report.id)">
                              <i class="ti ti-file me-1"></i>
                              Export as CSV
                            </a-menu-item>
                          </a-menu>
                        </template>
                      </a-dropdown>
                      <!-- End updated dropdown -->
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
</template>

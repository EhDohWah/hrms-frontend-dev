<template>
  <layout-header />
  <layout-sidebar />
  <div class="page-wrapper">
    <div class="content">
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h5>Report Generators</h5>
          <p class="text-muted">Generate and export various reports</p>
        </div>
        <div class="card-body p-0">
          <!-- Recruitment Reports Section -->
          <div class="report-category">
            <div class="category-header">
              <h6 class="mb-0"><i class="ti ti-users"></i> Recruitment</h6>
            </div>
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
                  <InterviewReport />
                  <JobOfferReport />
                </tbody>
              </table>
            </div>
          </div>



          <!-- Grant Reports Section -->
          <div class="report-category">
            <div class="category-header">
              <h6 class="mb-0"><i class="ti ti-coins"></i> Grant</h6>
            </div>
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
                  <GrantHeadcountReport />
                  <TotalGrantReport />
                </tbody>
              </table>
            </div>
          </div>

          <!-- HRM Reports Section -->
          <div class="report-category">
            <div class="category-header">
              <h6 class="mb-0"><i class="ti ti-briefcase"></i> HRM</h6>
            </div>
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
                  <EmployeePersonalDataReport />
                  <EmploymentDataReport />
                  <EmployeeTrainingHistoryReport />
                  <TrainingAttendanceReport />
                  <LeaveReport />
                  <IndividualLeaveRequestReport />
                  <TravelReport />
                  <ResignationReport />
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payroll Reports Section -->
          <div class="report-category">
            <div class="category-header">
              <h6 class="mb-0"><i class="ti ti-calculator"></i> Payroll</h6>
            </div>
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
                  <PayrollReport />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <layout-footer />
  </div>
</template>

<script>
import InterviewReport from '@/components/reports/interview-report.vue';
import JobOfferReport from '@/components/reports/joboffer-report.vue';
import GrantHeadcountReport from '@/components/reports/grant-headcount-report.vue';
import LeaveReport from '@/components/reports/leave-report.vue';
import EmployeePersonalDataReport from '@/components/reports/employee-personal-data-report.vue';
import EmploymentDataReport from '@/components/reports/employment-data-report.vue';
import TotalGrantReport from '@/components/reports/total-grant-report.vue';
import TrainingAttendanceReport from '@/components/reports/training-attendance-report.vue';
import EmployeeTrainingHistoryReport from '@/components/reports/employee-training-history-report.vue';
import PayrollReport from '@/components/reports/payroll-report.vue';
import IndividualLeaveRequestReport from '@/components/reports/individual-leave-request-report.vue';
import TravelReport from '@/components/reports/travel-report.vue';
import ResignationReport from '@/components/reports/resignation-report.vue';

export default {
  components: { InterviewReport, JobOfferReport, GrantHeadcountReport, LeaveReport, EmployeePersonalDataReport, EmploymentDataReport, TotalGrantReport, TrainingAttendanceReport, EmployeeTrainingHistoryReport, PayrollReport, IndividualLeaveRequestReport, TravelReport, ResignationReport },
  data() {
    return {
      title: "Reports List",
      text: "Administration",
      text1: "Reports List"
    };
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    }
  }
};
</script>

<style scoped>
.report-category {
  margin-bottom: 2rem;
}

.report-category:last-child {
  margin-bottom: 0;
}

.category-header {
  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem 1.5rem;
  border-left: 4px solid #007bff;
  margin-bottom: 0;
  border-top: 1px solid #dee2e6;
}

.category-header h6 {
  color: #495057;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-header i {
  color: #007bff;
  font-size: 1.1rem;
}

.report-category .table {
  margin-bottom: 0;
}

.report-category .table thead th {
  background-color: #f8f9fa;
  border-top: none;
  font-weight: 600;
  color: #6c757d;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
}

/* Consistent column widths */
.report-category .table thead th:nth-child(1) {
  width: 35%;
}

.report-category .table thead th:nth-child(2) {
  width: 40%;
}

.report-category .table thead th:nth-child(3) {
  width: 25%;
}

.report-category .table tbody tr {
  border-bottom: 1px solid #f1f3f4;
}

.report-category .table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Custom styling for each category */
.report-category:nth-child(1) .category-header {
  border-left-color: #28a745;
}

.report-category:nth-child(1) .category-header i {
  color: #28a745;
}

.report-category:nth-child(2) .category-header {
  border-left-color: #ffc107;
}

.report-category:nth-child(2) .category-header i {
  color: #ffc107;
}

.report-category:nth-child(3) .category-header {
  border-left-color: #17a2b8;
}

.report-category:nth-child(3) .category-header i {
  color: #17a2b8;
}

.report-category:nth-child(4) .category-header {
  border-left-color: #6f42c1;
}

.report-category:nth-child(4) .category-header i {
  color: #6f42c1;
}
</style>
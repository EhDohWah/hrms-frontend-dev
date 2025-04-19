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
                <GrantHeadcountReport />
              </tbody>
            </table>
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

export default {
  components: { InterviewReport, JobOfferReport, GrantHeadcountReport },
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
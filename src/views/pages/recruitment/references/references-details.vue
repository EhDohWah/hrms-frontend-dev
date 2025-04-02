<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="mb-2">
            <a href="javascript:void(0);" @click="$router.push('/recruitment/references')" class="btn btn-secondary d-flex align-items-center">
              <i class="ti ti-arrow-left me-2"></i>Back to List
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Reference Details -->
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h4 class="mb-4">Reference Information</h4>
              <div class="table-responsive">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <td>Reference Name:</td>
                      <td>{{ reference.name }}</td>
                    </tr>
                    <tr>
                      <td>Job Title:</td>
                      <td>{{ reference.jobTitle }}</td>
                    </tr>
                    <tr>
                      <td>Candidate Name:</td>
                      <td>{{ reference.candidateName }}</td>
                    </tr>
                    <tr>
                      <td>Status:</td>
                      <td>
                        <span :class="'badge ' + getStatusClass(reference.status)">
                          <i class="ti ti-point-filled me-1"></i>
                          {{ reference.status }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Date Added:</td>
                      <td>{{ formatDate(reference.dateAdded) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Reference Details -->
    </div>
    <layout-footer></layout-footer>
  </div>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';

export default {
  name: 'ReferencesDetails',
  components: {
    indexBreadcrumb
  },
  data() {
    return {
      title: 'Reference Details',
      text: 'Recruitment',
      text1: 'Reference Details',
      reference: {
        id: '',
        name: '',
        jobTitle: '',
        candidateName: '',
        status: '',
        dateAdded: ''
      }
    };
  },
  methods: {
    getStatusClass(status) {
      const statusClasses = {
        'Completed': 'bg-success-light',
        'Pending': 'bg-warning-light',
        'Declined': 'bg-danger-light'
      };
      return statusClasses[status] || 'bg-secondary-light';
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    },
    async fetchReferenceDetails() {
      try {
        const referenceId = this.$route.params.id;
        console.log(referenceId);
        // Implement API call to fetch reference details
        // const response = await referenceService.getReferenceDetails(referenceId);
        // this.reference = response.data;
      } catch (error) {
        console.error('Error fetching reference details:', error);
      }
    }
  },
  mounted() {
    this.fetchReferenceDetails();
  }
};
</script>

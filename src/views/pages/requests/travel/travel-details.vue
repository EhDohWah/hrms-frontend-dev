<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <router-link :to="'/requests/travel/edit/' + travelId" class="btn btn-primary">
              <i class="ti ti-pencil me-1"></i>Edit Travel Request
            </router-link>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Travel Details -->
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <div class="project-details">
                <h5 class="card-title">{{ travel.purpose }}</h5>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="project-info">
                      <label>Start Date</label>
                      <p>{{ travel.startDate }}</p>
                    </div>
                    <div class="project-info">
                      <label>End Date</label>
                      <p>{{ travel.endDate }}</p>
                    </div>
                    <div class="project-info">
                      <label>Duration</label>
                      <p>{{ travel.duration }}</p>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="project-info">
                      <label>Status</label>
                      <p>
                        <span :class="'badge ' + getStatusClass(travel.status)">
                          {{ travel.status }}
                        </span>
                      </p>
                    </div>
                    <div class="project-info">
                      <label>Destination</label>
                      <p>{{ travel.destination }}</p>
                    </div>
                    <div class="project-info">
                      <label>Travel Mode</label>
                      <p>{{ travel.travelMode }}</p>
                    </div>
                  </div>
                </div>
                <div class="project-info">
                  <label>Description</label>
                  <p>{{ travel.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Travel Details -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Travel Request Details',
      text: 'Requests',
      text1: 'Travel Request Details',
      travelId: this.$route.params.id,
      travel: {
        purpose: 'Business Meeting',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        duration: '5 days',
        status: 'Pending',
        destination: 'New York',
        travelMode: 'Flight',
        description: 'Travel for quarterly business meeting with clients'
      }
    }
  },
  methods: {
    getStatusClass(status) {
      switch(status.toLowerCase()) {
        case 'approved':
          return 'badge-success';
        case 'pending':
          return 'badge-warning';
        case 'rejected':
          return 'badge-danger';
        default:
          return 'badge-primary';
      }
    }
  }
}
</script>

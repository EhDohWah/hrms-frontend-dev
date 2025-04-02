<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <button class="btn btn-primary" @click="openAddTravelModal" data-bs-toggle="modal" data-bs-target="#add_travel">
              <i class="ti ti-plus me-1"></i>Create Travel Request
            </button>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Travel List Table -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped custom-table mb-0">
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Destination</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="travel in travels" :key="travel.id">
                  <td>{{ travel.purpose }}</td>
                  <td>{{ travel.destination }}</td>
                  <td>{{ travel.startDate }}</td>
                  <td>{{ travel.endDate }}</td>
                  <td>
                    <span :class="'badge ' + getStatusClass(travel.status)">
                      {{ travel.status }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="dropdown dropdown-action">
                      <a href="javascript:void(0);" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="ti ti-dots-vertical"></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <router-link :to="'/requests/travel/details/' + travel.id" class="dropdown-item">
                          <i class="ti ti-eye me-2"></i>View
                        </router-link>
                        <a href="javascript:void(0);" class="dropdown-item" @click="openEditTravelModal(travel)">
                          <i class="ti ti-pencil me-2"></i>Edit
                        </a>
                        <a href="javascript:void(0);" class="dropdown-item" @click="deleteTravel(travel.id)">
                          <i class="ti ti-trash me-2"></i>Delete
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- /Travel List Table -->
    </div>
    <layout-footer></layout-footer>
  </div>

  <!-- Travel Modal -->
  <travel-employee-modal></travel-employee-modal>
</template>

<script>

export default {
  name: 'TravelList',
  data() {
    return {
      title: 'Travel Requests',
      text: 'Requests',
      text1: 'Travel Requests',
      travels: [
        {
          id: 1,
          purpose: 'Client Meeting',
          destination: 'New York',
          startDate: '01/15/2024',
          endDate: '01/18/2024',
          status: 'Pending'
        },
        {
          id: 2,
          purpose: 'Conference',
          destination: 'London',
          startDate: '02/20/2024',
          endDate: '02/25/2024',
          status: 'Approved'
        }
      ]
    };
  },
  methods: {
    getStatusClass(status) {
      switch (status.toLowerCase()) {
        case 'approved':
          return 'bg-success';
        case 'pending':
          return 'bg-warning';
        case 'rejected':
          return 'bg-danger';
        default:
          return 'bg-secondary';
      }
    }
  }
};
</script> 
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
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">
                    <i class="ti ti-file-type-pdf me-1"></i>Export as PDF
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">
                    <i class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddGrantPositionModal">
              <i class="ti ti-circle-plus me-2"></i>Add Grant Position
            </button>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Grant Positions List</h5>
          <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
            <div class="me-3">
              <div class="input-icon-end position-relative">
                <input type="text" class="form-control date-range bookingrange" ref="dateRangeInput" placeholder="dd/mm/yyyy - dd/mm/yyyy" />
                <span class="input-icon-addon">
                  <i class="ti ti-chevron-down"></i>
                </span>
              </div>
            </div>
            <div class="dropdown me-3">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                Status
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Active</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Pending</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Completed</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Cancelled</a>
                </li>
              </ul>
            </div>
            <div class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                Sort By : Last 7 Days
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Ascending</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Descending</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive" style="overflow: visible;">
            <table class="table table-striped custom-table mb-0">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Grant Name</th>
                  <th>Budget Line</th>
                  <th>Grant Position</th>
                  <th>ManPower</th>
                  <th>Recruited</th>
                  <th>Finding</th>
                  <th class="text-start">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="position in grantPositions" :key="position.id">
                  <td>{{ position.code }}</td>
                  <td>{{ position.grantName }}</td>
                  <td>{{ position.budgetLine }}</td>
                  <td>{{ position.positionName }}</td>
                  <td>{{ position.manPower }}</td>
                  <td>{{ position.recruited }}</td>
                  <td>{{ position.finding }}</td>
                  <td class="text-start">
                    <div class="action-icon d-inline-flex">
                      <router-link :to="`/grant/position-details/${position.id}`" class="me-2">
                        <i class="ti ti-eye"></i>
                      </router-link>
                      <a href="javascript:void(0);" class="me-2" @click="openEditGrantPositionModal(position)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a href="javascript:void(0);" @click="deleteGrantPosition(position.id)">
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Grant Position Modal -->
  <grant-position-modal ref="grantPositionModal" @submit="handleGrantPositionSubmit" />
</template>

<script>
import GrantPositionModal from '@/components/modal/grant-position-modal.vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useGrantStore } from '@/stores/grantStore';
import { ref } from 'vue';
import { onMounted } from 'vue';
import moment from 'moment';
import DateRangePicker from 'daterangepicker';

export default {
  name: 'GrantPositionList',
  components: {
    GrantPositionModal,
    indexBreadcrumb
  },
  data() {
    return {
      title: 'Grant Positions',
      text: 'Grants',
      text1: 'Grant Positions',
      grantPositions: [
        {
          id: 1,
          code: 'GP001',
          grantName: 'Health Initiative Fund',
          budgetLine: 'BL-2023-001',
          positionName: 'Project Manager',
          manPower: 3,
          recruited: 2,
          finding: 1,
          status: 'Active'
        },
        {
          id: 2,
          code: 'GP002',
          grantName: 'Education Support Program',
          budgetLine: 'BL-2023-002',
          positionName: 'Field Coordinator',
          manPower: 5,
          recruited: 3,
          finding: 2,
          status: 'Active'
        },
        {
          id: 3,
          code: 'GP003',
          grantName: 'Community Development Grant',
          budgetLine: 'BL-2023-003',
          positionName: 'Finance Officer',
          manPower: 2,
          recruited: 1,
          finding: 1,
          status: 'Pending'
        },
        {
          id: 4,
          code: 'GP004',
          grantName: 'Agricultural Support Fund',
          budgetLine: 'BL-2023-004',
          positionName: 'Technical Advisor',
          manPower: 4,
          recruited: 4,
          finding: 0,
          status: 'Completed'
        },
        {
          id: 5,
          code: 'GP005',
          grantName: 'Water Sanitation Project',
          budgetLine: 'BL-2023-005',
          positionName: 'Project Engineer',
          manPower: 3,
          recruited: 0,
          finding: 3,
          status: 'Pending'
        },
        {
          id: 6,
          code: 'GP006',
          grantName: 'Youth Empowerment Initiative',
          budgetLine: 'BL-2023-006',
          positionName: 'Program Coordinator',
          manPower: 2,
          recruited: 1,
          finding: 1,
          status: 'Active'
        },
        {
          id: 7,
          code: 'GP007',
          grantName: 'Disaster Relief Fund',
          budgetLine: 'BL-2023-007',
          positionName: 'Logistics Manager',
          manPower: 6,
          recruited: 3,
          finding: 3,
          status: 'Active'
        }
      ],
      currentPage: 1,
      pageSize: 10,
      totalPositions: 0,
      searchTerm: '',
      grantStore: useGrantStore()
    };
  },
  setup() {
    const dateRangeInput = ref(null);

    function booking_range(start, end) {
      return start.format('M/D/YYYY') + ' - ' + end.format('M/D/YYYY');
    }

    onMounted(() => {
      if (dateRangeInput.value) {
        const start = moment().subtract(6, 'days');
        const end = moment();

        new DateRangePicker(dateRangeInput.value, {
          startDate: start,
          endDate: end,
          ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [
              moment().subtract(1, 'month').startOf('month'),
              moment().subtract(1, 'month').endOf('month')
            ]
          }
        }, booking_range);

        booking_range(start, end);
      }
    });

    return {
      dateRangeInput
    };
  },
  mounted() {
    // Set the total positions from the dummy data
    this.totalPositions = this.grantPositions.length;
    
    // Comment out the API fetch since we're using dummy data
    // this.fetchGrantPositions();
  },
  methods: {
    async fetchGrantPositions() {
      try {
        // Assuming there's a method in the grant store to fetch positions
        await this.grantStore.fetchGrantPositions();
        // Uncomment this when using real API data
        // this.grantPositions = this.grantStore.grantPositions || [];
        // this.totalPositions = this.grantPositions.length;
      } catch (error) {
        console.error('Error fetching grant positions:', error);
      }
    },

    openAddGrantPositionModal() {
      this.$refs.grantPositionModal.openModal();
    },

    openEditGrantPositionModal(position) {
      this.$refs.grantPositionModal.openModal(position);
    },

    async handleGrantPositionSubmit(formData) {
      try {
        if (formData.id) {
          // Update existing grant position
          // await this.grantStore.updateGrantPosition(formData.id, formData);
          
          // For dummy data, update the local array
          const index = this.grantPositions.findIndex(pos => pos.id === formData.id);
          if (index !== -1) {
            this.grantPositions[index] = { ...formData };
          }
        } else {
          // Add new grant position
          // await this.grantStore.createGrantPosition(formData);
          
          // For dummy data, add to the local array
          const newId = Math.max(...this.grantPositions.map(pos => pos.id)) + 1;
          this.grantPositions.push({
            ...formData,
            id: newId
          });
        }
        // Refresh the grant positions list
        // await this.fetchGrantPositions();
        this.totalPositions = this.grantPositions.length;
      } catch (error) {
        console.error('Error handling grant position submission:', error);
      }
    },

    async deleteGrantPosition(id) {
      if (confirm('Are you sure you want to delete this grant position?')) {
        try {
          // await this.grantStore.deleteGrantPosition(id);
          
          // For dummy data, remove from the local array
          this.grantPositions = this.grantPositions.filter(pos => pos.id !== id);
          this.totalPositions = this.grantPositions.length;
          
          // Refresh the grant positions list
          // await this.fetchGrantPositions();
        } catch (error) {
          console.error('Error deleting grant position:', error);
        }
      }
    }
  }
};
</script>

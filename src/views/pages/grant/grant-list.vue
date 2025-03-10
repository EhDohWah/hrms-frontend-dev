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
            <button class="btn btn-primary d-flex align-items-center" @click="openAddGrantModal">
              <i class="ti ti-circle-plus me-2"></i>Add Grant
            </button>
          </div>
          <div class="mb-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openGrantUploadModal">
              <i class="ti ti-upload me-2"></i>Upload Grant Excel File
            </button>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Grants List</h5>
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
                  <!-- Add a column for the expand/collapse button -->
                  <th style="width: 40px;"></th>
                  <th>Grant Code</th>
                  <th>Grant Name</th>
                  <th>End Date</th>
                  <th>Description</th>
                  <th class="text-start">Actions</th>
                </tr>
              </thead>
              <tbody>
                <!-- Loop over each grant -->
                <template v-for="grant in grants" :key="grant.id">
                  <tr>
                    <!-- Expand/collapse toggle button -->
                    <td>
                      <button class="btn btn-link btn-sm" @click="toggleGrant(grant)">
                        <i :class="grant.expanded ? 'ti ti-chevron-down' : 'ti ti-chevron-right'"></i>
                      </button>
                    </td>
                    <td>{{ grant.code }}</td>
                    <td>{{ grant.name }}</td>
                    <td>{{ grant.endDate }}</td>
                    <td>
                      {{ grant.description ? grant.description : 'No description' }}
                    </td>
                    <td class="text-start">
                      <div class="action-icon d-inline-flex">
                        <router-link :to="`/grant/details/${grant.id}`" class="me-2">
                          <i class="ti ti-eye"></i>
                        </router-link>
                        <a href="javascript:void(0);" class="me-2" @click="openEditGrantModal(grant)">
                          <i class="ti ti-edit"></i>
                        </a>
                        <a href="javascript:void(0);" @click="deleteGrant(grant.id)">
                          <i class="ti ti-trash"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                  <!-- Expandable sub-row for grant items -->
                  <tr v-if="grant.expanded">
                    <td colspan="6" class="p-0">
                      <div class="p-2 bg-light">
                        <!-- Sub-table for grant items -->
                        <div class="table-responsive">
                          <table class="table table-sm mb-0">
                            <thead>
                              <tr>
                                <th>BG Line</th>
                                <th>Position</th>
                                <th>Salary</th>
                                <th>Benefit</th>
                                <th>Effort</th>
                                <th>Position Number</th>
                                <th>Cost Monthly</th>
                                <th>Total Cost By Person</th>
                                <th>Total Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="item in grant.items" :key="item.id">
                                <td>{{ item.bg_line }}</td>
                                <td>{{ item.grant_position }}</td>
                                <td>{{ item.grant_salary }}</td>
                                <td>{{ item.grant_benefit }}</td>
                                <td>{{ item.grant_level_of_effort }}</td>
                                <td>{{ item.grant_position_number }}</td>
                                <td>{{ item.grant_cost_by_monthly }}</td>
                                <td>{{ item.grant_total_cost_by_person }}</td>
                                <td>{{ item.grant_total_amount }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Grant Modal -->
  <grant-modal ref="grantModal" @submit="handleGrantSubmit" />
  <!-- Grant Upload Modal -->
  <grant-upload-modal ref="grantUploadModal" @submit="handleGrantUploadSubmit" />
</template>

<script>
import GrantModal from '@/components/modal/grant-modal.vue';
import GrantUploadModal from '@/components/modal/grant-upload-modal.vue';
import { Modal } from 'bootstrap';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useGrantStore } from '@/stores/grantStore';
import { ref } from 'vue';
import { onMounted } from 'vue';
import moment from 'moment';
import DateRangePicker from 'daterangepicker';

export default {
  name: 'GrantList',
  components: {
    GrantModal,
    GrantUploadModal,
    indexBreadcrumb
  },
  data() {
    return {
      title: 'Grants',
      text: 'Grants',
      text1: 'Grant List',
      grants: [],
      currentPage: 1,
      pageSize: 10,
      totalGrants: 0,
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
    this.fetchGrants();
  },
  methods: {
    async fetchGrants() {
      try {
        await this.grantStore.fetchGrants();
        const grantsData = this.grantStore.grants;
        
        this.grants = grantsData.map(grant => ({
          id: grant.id,
          code: grant.code,
          name: grant.name,
          amount: grant.amount || this.calculateTotalAmount(grant.grant_items),
          startDate: grant.startDate || new Date().toLocaleDateString(),
          endDate: grant.end_date || 
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
          status: grant.status || 'Pending',
          items: (grant.grant_items || []).map(item => ({
            id: item.id,
            bg_line: item.bg_line,
            grant_position: item.grant_position,
            grant_salary: item.grant_salary,
            grant_benefit: item.grant_benefit,
            grant_level_of_effort: item.grant_level_of_effort,
            grant_position_number: item.grant_position_number,
            grant_cost_by_monthly: item.grant_cost_by_monthly,
            grant_total_cost_by_person: item.grant_total_cost_by_person,
            grant_total_amount: item.grant_total_amount,
            position_id: item.position_id
          })),
          expanded: false
        }));

        this.totalGrants = this.grants.length;
      } catch (error) {
        console.error('Error fetching grants:', error);
      }
    },

    calculateTotalAmount(items) {
      if (!items || !items.length) return '0';
      const total = items.reduce((sum, item) => sum + Number(item.grant_total_amount || 0), 0);
      return `${total.toFixed(2)}`;
    },

    toggleGrant(grant) {
      // Toggle the expanded property for the selected grant.
      grant.expanded = !grant.expanded;
    },

    getStatusClass(status) {
      const statusClasses = {
        'Active': 'bg-success-light',
        'Pending': 'bg-warning-light',
        'Completed': 'bg-info-light',
        'Cancelled': 'bg-danger-light'
      };
      return statusClasses[status] || 'bg-secondary-light';
    },

    openAddGrantModal() {
      this.$refs.grantModal.resetForm();
      new Modal(document.getElementById('grant_modal')).show();
    },

    openGrantUploadModal() {
      this.$refs.grantUploadModal.resetForm();
      new Modal(document.getElementById('grantUploadModal')).show();
    },

    openEditGrantModal(grant) {
      const grantData = {
        id: grant.id,
        code: grant.code,
        name: grant.name,
        budget_line: grant.budget_line || '',
        end_date: grant.endDate || ''
      };
      this.$refs.grantModal.setEditData(grantData);
      new Modal(document.getElementById('grant_modal')).show();
    },

    async handleGrantSubmit(formData) {
      try {
        if (formData.id) {
          // Update existing grant
          await this.grantStore.updateGrant(formData.id, formData);
        } else {
          // Add new grant
          await this.grantStore.createGrant(formData);
        }
        // Refresh the grants list
        await this.fetchGrants();
      } catch (error) {
        console.error('Error handling grant submission:', error);
      }
    },

    async deleteGrant(id) {
      if (confirm('Are you sure you want to delete this grant?')) {
        try {
          await this.grantStore.deleteGrant(id);
          // Refresh the grants list
          await this.fetchGrants();
        } catch (error) {
          console.error('Error deleting grant:', error);
        }
      }
    },

    async handleGrantUploadSubmit(formData) {
      try {
        await this.grantStore.uploadGrantFile(formData);
        // Refresh the grants list
        await this.fetchGrants();
      } catch (error) {
        console.error('Error uploading grant file:', error);
      }
    }
  }
};
</script>
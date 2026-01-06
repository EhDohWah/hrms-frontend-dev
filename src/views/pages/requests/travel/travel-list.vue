<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <div class="d-flex align-items-center">
          <index-breadcrumb :title="title" :text="text" :text1="text1" />
          <!-- Read-Only Badge -->
          <span 
            v-if="isReadOnlyTravel" 
            class="badge bg-warning text-dark ms-3 d-flex align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div v-if="canEditTravel" class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddTravelRequestModal"
              :disabled="openingAddTravelRequest">
              <template v-if="openingAddTravelRequest">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading form...
              </template>
              <template v-else>
                <i class="ti ti-circle-plus me-2"></i>Add New Travel Request
              </template>
            </button>
          </div>

          <div class="head-icons ms-2">
            <a href="javascript:void(0);" class="" data-bs-toggle="tooltip" data-bs-placement="top"
              data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Travel Request Statistics -->
      <div class="row statistics-row">
        <!-- Total Requests -->
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="card bg-comman w-100">
            <div class="card-body">
              <div class="db-widgets d-flex justify-content-between align-items-center">
                <div class="db-info">
                  <h6>Total Requests</h6>
                  <h3>{{ statistics.total }}</h3>
                </div>
                <div class="db-icon">
                  <i class="ti ti-plane-departure"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Requests -->
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="card bg-comman w-100">
            <div class="card-body">
              <div class="db-widgets d-flex justify-content-between align-items-center">
                <div class="db-info">
                  <h6>Pending</h6>
                  <h3>{{ statistics.pending }}</h3>
                </div>
                <div class="db-icon">
                  <i class="ti ti-clock-hour-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Approved Requests -->
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="card bg-comman w-100">
            <div class="card-body">
              <div class="db-widgets d-flex justify-content-between align-items-center">
                <div class="db-info">
                  <h6>Approved</h6>
                  <h3>{{ statistics.approved }}</h3>
                </div>
                <div class="db-icon">
                  <i class="ti ti-check-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rejected Requests -->
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="card bg-comman w-100">
            <div class="card-body">
              <div class="db-widgets d-flex justify-content-between align-items-center">
                <div class="db-info">
                  <h6>Rejected</h6>
                  <h3>{{ statistics.rejected }}</h3>
                </div>
                <div class="db-icon">
                  <i class="ti ti-x-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Search & Filter Travel Requests</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <!-- Employee Search -->
                <div class="col-md-4">
                  <label class="form-label">Search by Staff ID</label>
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="searchStaffId" placeholder="Enter staff ID"
                      @keyup.enter="searchByStaffId">
                    <button class="btn btn-outline-secondary" type="button" @click="searchByStaffId"
                      :disabled="searchLoading">
                      <i class="ti ti-search" v-if="!searchLoading"></i>
                      <span class="spinner-border spinner-border-sm" v-else></span>
                    </button>
                  </div>
                </div>

                <!-- Department Filter -->
                <div class="col-md-3">
                  <label class="form-label">Department</label>
                  <select class="form-select" v-model="departmentFilter" @change="applyFilters">
                    <option value="">All Departments</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.name">
                      {{ dept.name }}
                    </option>
                  </select>
                </div>

                <!-- Transportation Filter -->
                <div class="col-md-3">
                  <label class="form-label">Transportation</label>
                  <select class="form-select" v-model="transportationFilter" @change="applyFilters">
                    <option value="">All Transportation</option>
                    <option value="smru_vehicle">SMRU Vehicle</option>
                    <option value="public_transportation">Public Transportation</option>
                    <option value="air">Air</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <!-- Actions -->
                <div class="col-md-2">
                  <label class="form-label">&nbsp;</label>
                  <div class="d-grid">
                    <button class="btn btn-outline-secondary" @click="clearFilters">
                      <i class="ti ti-refresh me-1"></i>Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Travel Requests Table -->
      <div class="row">
        <div class="col-sm-12">
          <div class="card card-table comman-shadow">
            <div class="card-body">
              <div class="page-header">
                <div class="row align-items-center">
                  <div class="col">
                    <h3 class="page-title">Travel Requests</h3>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading travel requests...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="alert alert-danger" role="alert">
                <i class="ti ti-alert-circle me-2"></i>
                {{ error }}
                <button class="btn btn-sm btn-outline-danger ms-2" @click="fetchTravelRequests">
                  <i class="ti ti-refresh me-1"></i>Retry
                </button>
              </div>

              <!-- Table -->
              <div v-else class="table-responsive">
                <a-table :columns="columns" :data-source="travelRequests" :pagination="false" :loading="loading"
                  :scroll="{ x: 1200 }" row-key="id" size="middle" class="table-striped">

                  <!-- Employee Column -->
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'employee'">
                      <div class="d-flex align-items-center">
                        <div>
                          <h6 class="mb-0">{{ getEmployeeName(record) }}</h6>
                          <small class="text-muted">{{ record.employee?.staff_id || 'N/A' }}</small>
                        </div>
                      </div>
                    </template>

                    <!-- Department Column -->
                    <template v-else-if="column.key === 'department'">
                      <span class="badge bg-light text-dark">
                        {{ record.department?.name || 'N/A' }}
                      </span>
                    </template>

                    <!-- Travel Dates Column -->
                    <template v-else-if="column.key === 'travel_dates'">
                      <div v-if="record.start_date || record.to_date">
                        <div><strong>From:</strong> {{ formatDate(record.start_date) }}</div>
                        <div><strong>To:</strong> {{ formatDate(record.to_date) }}</div>
                      </div>
                      <span v-else class="text-muted">N/A</span>
                    </template>

                    <!-- Transportation Column -->
                    <template v-else-if="column.key === 'transportation'">
                      <div>
                        <span class="badge bg-info text-white">
                          {{ getTransportationLabel(record.transportation) }}
                        </span>
                        <div v-if="record.transportation === 'other' && record.transportation_other_text"
                          class="small text-muted mt-1">
                          {{ record.transportation_other_text }}
                        </div>
                      </div>
                    </template>

                    <!-- Accommodation Column -->
                    <template v-else-if="column.key === 'accommodation'">
                      <div>
                        <span class="badge bg-success text-white">
                          {{ getAccommodationLabel(record.accommodation) }}
                        </span>
                        <div v-if="record.accommodation === 'other' && record.accommodation_other_text"
                          class="small text-muted mt-1">
                          {{ record.accommodation_other_text }}
                        </div>
                      </div>
                    </template>

                    <!-- Actions Column -->
                    <template v-else-if="column.key === 'actions'">
                      <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary" @click="viewTravelRequest(record)"
                          data-bs-toggle="tooltip" title="View Details">
                          <i class="ti ti-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" @click="editTravelRequest(record)"
                          data-bs-toggle="tooltip" title="Edit">
                          <i class="ti ti-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="deleteTravelRequest(record)"
                          data-bs-toggle="tooltip" title="Delete">
                          <i class="ti ti-trash"></i>
                        </button>
                      </div>
                    </template>
                  </template>
                </a-table>

                <!-- Pagination -->
                <div class="pagination-wrapper mt-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="pagination-info">
                      <span class="text-muted">
                        Showing {{ ((currentPage - 1) * pageSize) + 1 }} to
                        {{ Math.min(currentPage * pageSize, total) }} of {{ total }} entries
                      </span>
                    </div>
                    <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="total"
                      :show-size-changer="true" :show-quick-jumper="true" :page-size-options="['10', '20', '50', '100']"
                      :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                      @change="handlePaginationChange" @show-size-change="handleSizeChange" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>

  <!-- Travel Request Modal -->
  <travel-request-modal @travel-request-added="fetchTravelRequests" @travel-request-updated="fetchTravelRequests"
    ref="travelRequestModalRef">
  </travel-request-modal>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import TravelRequestModal from '@/components/modal/travel-request-modal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { useTravelRequestStore } from '@/stores/travelRequestStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import moment from 'moment';
import { Modal, message } from 'ant-design-vue';
import { usePermissions } from '@/composables/usePermissions';

export default {
  name: 'TravelList',
  components: {
    indexBreadcrumb,
    TravelRequestModal,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  },
  setup() {
    // Initialize permission checks for travel module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('travel');

    return {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    };
  },
  data() {
    return {
      title: "Travel Requests",
      text: "Requests",
      text1: "Travel List",

      // Search and filter
      searchStaffId: '',
      departmentFilter: '',
      transportationFilter: '',

      // Data properties
      travelRequests: [],
      loading: false,
      searchLoading: false,
      error: null,

      // Statistics
      statistics: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      },

      // Pagination
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // UI loading states
      openingAddTravelRequest: false,
    };
  },

  computed: {
    // Permission checks - primary source for reactivity
    canEditTravel() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasEdit = Array.isArray(permissions) && permissions.includes('travel.edit');
        return hasEdit || (this.canEdit?.value ?? false);
      } catch (e) {
        console.error('[TravelList] Error checking permissions:', e);
        return this.canEdit?.value ?? false;
      }
    },
    canReadTravel() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasRead = Array.isArray(permissions) && permissions.includes('travel.read');
        return hasRead || (this.canRead?.value ?? false);
      } catch (e) {
        return this.canRead?.value ?? false;
      }
    },
    isReadOnlyTravel() {
      return this.canReadTravel && !this.canEditTravel;
    },
    columns() {
      return [
        {
          title: 'Employee',
          key: 'employee',
          width: 200,
          fixed: 'left',
        },
        {
          title: 'Department',
          key: 'department',
          width: 150,
        },
        {
          title: 'Destination',
          dataIndex: 'destination',
          key: 'destination',
          width: 150,
        },
        {
          title: 'Travel Dates',
          key: 'travel_dates',
          width: 180,
        },
        {
          title: 'Purpose',
          dataIndex: 'purpose',
          key: 'purpose',
          width: 200,
          ellipsis: true,
        },
        {
          title: 'Transportation',
          key: 'transportation',
          width: 150,
        },
        {
          title: 'Accommodation',
          key: 'accommodation',
          width: 150,
        },
        {
          title: 'Grant/Project',
          dataIndex: 'grant',
          key: 'grant',
          width: 120,
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 120,
          fixed: 'right',
        }
      ];
    },

    departments() {
      const sharedDataStore = useSharedDataStore();
      return sharedDataStore.departments || [];
    }
  },

  async mounted() {
    await this.loadInitialData();
  },

  methods: {
    async loadInitialData() {
      try {
        const sharedDataStore = useSharedDataStore();
        await Promise.all([
          this.fetchTravelRequests(),
          sharedDataStore.fetchDepartments?.() || Promise.resolve()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        this.error = 'Failed to load initial data';
      }
    },

    async fetchTravelRequests() {
      this.loading = true;
      this.error = null;

      try {
        const travelRequestStore = useTravelRequestStore();
        const params = {
          page: this.currentPage,
          per_page: this.pageSize
        };

        // Add filters if set
        if (this.departmentFilter) {
          params.filter_department = this.departmentFilter;
        }
        if (this.transportationFilter) {
          params.filter_transportation = this.transportationFilter;
        }

        await travelRequestStore.fetchTravelRequests(params);

        this.travelRequests = travelRequestStore.travelRequests;
        this.total = travelRequestStore.total;
        this.currentPage = travelRequestStore.currentPage;
        this.pageSize = travelRequestStore.pageSize;
        this.statistics = travelRequestStore.statistics;

      } catch (error) {
        console.error('Error fetching travel requests:', error);
        this.error = error.message || 'Failed to fetch travel requests';
        this.travelRequests = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    async searchByStaffId() {
      if (!this.searchStaffId.trim()) {
        message.warning('Please enter a staff ID to search');
        return;
      }

      this.searchLoading = true;
      try {
        const travelRequestStore = useTravelRequestStore();
        await travelRequestStore.searchTravelRequestsByStaffId(this.searchStaffId.trim());

        this.travelRequests = travelRequestStore.travelRequests;
        this.total = travelRequestStore.total;
        this.currentPage = 1;

        if (this.travelRequests.length === 0) {
          message.info(`No travel requests found for staff ID: ${this.searchStaffId}`);
        } else {
          message.success(`Found ${this.travelRequests.length} travel request(s) for staff ID: ${this.searchStaffId}`);
        }
      } catch (error) {
        console.error('Error searching by staff ID:', error);
        message.error(error.message || 'Failed to search travel requests');
        this.travelRequests = [];
        this.total = 0;
      } finally {
        this.searchLoading = false;
      }
    },

    applyFilters() {
      this.currentPage = 1;
      this.fetchTravelRequests();
    },

    clearFilters() {
      this.searchStaffId = '';
      this.departmentFilter = '';
      this.transportationFilter = '';
      this.currentPage = 1;
      this.fetchTravelRequests();
    },

    handlePaginationChange(page, size) {
      this.currentPage = page;
      this.pageSize = size;
      this.fetchTravelRequests();
    },

    handleSizeChange(current, size) {
      this.currentPage = 1;
      this.pageSize = size;
      this.fetchTravelRequests();
    },

    async openAddTravelRequestModal() {
      this.openingAddTravelRequest = true;
      try {
        await this.$refs.travelRequestModalRef?.openAddTravelRequestModal();
      } catch (error) {
        console.error('Error opening add modal:', error);
        message.error('Failed to open travel request form');
      } finally {
        this.openingAddTravelRequest = false;
      }
    },

    viewTravelRequest(record) {
      // TODO: Implement view modal or navigate to detail page
      message.info('View functionality will be implemented');
    },

    async editTravelRequest(record) {
      try {
        await this.$refs.travelRequestModalRef?.openEditTravelRequestModal(record);
      } catch (error) {
        console.error('Error opening edit modal:', error);
        message.error('Failed to open edit form');
      }
    },

    deleteTravelRequest(record) {
      Modal.confirm({
        title: 'Delete Travel Request',
        content: `Are you sure you want to delete the travel request to ${record.destination || 'N/A'}?`,
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            const travelRequestStore = useTravelRequestStore();
            await travelRequestStore.deleteTravelRequest(record.id);
            message.success('Travel request deleted successfully');
            this.fetchTravelRequests();
          } catch (error) {
            console.error('Error deleting travel request:', error);
            message.error('Failed to delete travel request');
          }
        }
      });
    },

    getEmployeeName(record) {
      if (record.employee) {
        if (record.employee.first_name_en && record.employee.last_name_en) {
          return `${record.employee.first_name_en} ${record.employee.last_name_en}`;
        }
        return record.employee.name || 'N/A';
      }
      return 'N/A';
    },

    getTransportationLabel(value) {
      const options = {
        'smru_vehicle': 'SMRU Vehicle',
        'public_transportation': 'Public Transportation',
        'air': 'Air',
        'other': 'Other'
      };
      return options[value] || value || 'N/A';
    },

    getAccommodationLabel(value) {
      const options = {
        'smru_arrangement': 'SMRU Arrangement',
        'self_arrangement': 'Self Arrangement',
        'other': 'Other'
      };
      return options[value] || value || 'N/A';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return moment(dateString).format('DD/MM/YYYY');
    },

    toggleHeader() {
      // Header collapse functionality
      const header = document.getElementById('collapse-header');
      if (header) {
        header.classList.toggle('collapsed');
      }
    }
  }
};
</script>

<style scoped>
.statistics-row {
  margin-bottom: 2rem;
}

.card.bg-comman {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.db-widgets .db-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
}

.pagination-wrapper {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.text-muted {
  color: #6c757d !important;
}

.card-table {
  box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15);
  border: 1px solid #e9ecef;
}

.page-header h3 {
  color: #495057;
  font-weight: 600;
}

.input-group .btn {
  border-left: 0;
}

.form-select:focus,
.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
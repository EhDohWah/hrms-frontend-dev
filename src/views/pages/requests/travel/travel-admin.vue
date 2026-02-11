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
            v-if="isReadOnly"
            class="badge bg-warning text-dark ms-3 d-flex align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div v-if="canEdit" class="mb-2 me-2">
            <a href="javascript:void(0);" class="btn btn-primary d-flex align-items-center"
              @click="openCreateModal">
              <i class="ti ti-circle-plus me-2"></i>Add Travel Request
            </a>
          </div>
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-danger d-flex align-items-center" @click="confirmDeleteSelected"
              :class="{ 'disabled': selectedRowKeys.length === 0 }">
              <i class="ti ti-trash me-2"></i>Delete Selected
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
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-primary rounded-circle"><i class="ti ti-file-description"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Total Requests</p>
                  <h4>{{ statistics.total }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-success rounded-circle"><i class="ti ti-calendar-check"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">This Year</p>
                  <h4>{{ statistics.approved }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-info rounded-circle"><i class="ti ti-map-pin"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Domestic</p>
                  <h4>{{ statistics.domestic }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-warning rounded-circle"><i class="ti ti-plane"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">International</p>
                  <h4>{{ statistics.international }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Travel Request Statistics -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Travel Request List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search v-model:value="searchTerm" placeholder="Search employee name or staff ID..."
                :loading="searchLoading" enter-button="Search" @search="handleSearch"
                style="width: 280px;" class="search-input-primary" />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading travel requests...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <!-- TABLE WITHOUT PAGINATION -->
            <a-table :columns="columns" :data-source="tableData" :pagination="false"
              :scroll="{ x: 1200, y: 'max-content' }" row-key="id" @change="handleTableChange"
              :row-selection="canEdit ? rowSelection : null">
              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a href="javascript:void(0);" @click="editTravelRequest(record)" class="me-2">
                      <i class="ti ti-edit"></i>
                    </a>
                    <a v-if="canEdit" href="javascript:void(0);" @click="confirmDeleteTravelRequest(record.id)">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>

                <!-- Employee column -->
                <template v-if="column.key === 'employee'">
                  <div v-if="record.employee">
                    <strong>{{ record.employee.first_name_en }} {{ record.employee.last_name_en }}</strong>
                    <br>
                    <small class="text-muted">{{ record.employee.staff_id }}</small>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>

                <!-- Department column -->
                <template v-if="column.key === 'department'">
                  <span v-if="record.department">{{ record.department.name }}</span>
                  <span v-else class="text-muted">-</span>
                </template>

                <!-- Travel Dates column -->
                <template v-if="column.key === 'travel_dates'">
                  <div v-if="record.start_date || record.to_date">
                    <div v-if="record.start_date">
                      <strong>From:</strong> {{ formatDate(record.start_date) }}
                    </div>
                    <div v-if="record.to_date">
                      <strong>To:</strong> {{ formatDate(record.to_date) }}
                    </div>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>

                <!-- Transportation column -->
                <template v-if="column.key === 'transportation'">
                  <div v-if="record.transportation">
                    <span class="badge badge-soft-blue badge-sm">
                      {{ formatTransportation(record.transportation) }}
                    </span>
                    <div v-if="record.transportation === 'other' && record.transportation_other_text"
                      class="other-text mt-1">
                      <small class="text-muted">{{ record.transportation_other_text }}</small>
                    </div>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>

                <!-- Accommodation column -->
                <template v-if="column.key === 'accommodation'">
                  <div v-if="record.accommodation">
                    <span class="badge badge-soft-green badge-sm">
                      {{ formatAccommodation(record.accommodation) }}
                    </span>
                    <div v-if="record.accommodation === 'other' && record.accommodation_other_text"
                      class="other-text mt-1">
                      <small class="text-muted">{{ record.accommodation_other_text }}</small>
                    </div>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>
              </template>

              <!-- Empty state -->
              <template #emptyText>
                <div class="d-flex flex-column align-items-center py-4">
                  <i class="ti ti-plane-departure text-muted mb-3" style="font-size: 3rem;"></i>
                  <h6 class="text-muted">No travel requests found</h6>
                  <p class="text-muted">Start by adding your first travel request.</p>
                </div>
              </template>
            </a-table>

            <!-- SEPARATE PAGINATION COMPONENT -->
            <div class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info"></div>
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
    <layout-footer></layout-footer>
  </div>

  <!-- Travel Request Modal (Ant Design Vue) -->
  <travel-request-modal :visible="modalVisible" :editing-record="editingRecord"
    @saved="handleSaved" @close="closeModal" />
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { travelRequestService } from '@/services/travelRequest.service';
import { useToast } from '@/composables/useToast';
import { usePermissions } from '@/composables/usePermissions';
import { Modal, Table } from 'ant-design-vue';
import { ref } from 'vue';
import dayjs from 'dayjs';

export default {
  name: 'TravelRequestList',
  components: {
    indexBreadcrumb
  },
  setup() {
    const { showToast } = useToast();

    const filteredInfo = ref({});
    const sortedInfo = ref({});
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    const {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    } = usePermissions('travel_admin');

    return {
      showToast,
      filteredInfo,
      sortedInfo,
      currentPage,
      pageSize,
      total,
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
      text1: "Travel Request List",

      // Data
      travelRequests: [],
      selectedRowKeys: [],
      modalVisible: false,
      editingRecord: null,
      loading: false,
      searchLoading: false,

      // Filters
      searchTerm: '',

      // Statistics
      statistics: {
        total: 0,
        approved: 0,
        domestic: 0,
        international: 0
      },

      // Formatting maps
      transportationMap: {
        'smru_vehicle': 'SMRU Vehicle',
        'public_transportation': 'Public Transport',
        'air': 'Air',
        'other': 'Other'
      },
      accommodationMap: {
        'smru_arrangement': 'SMRU Arrangement',
        'self_arrangement': 'Self Arrangement',
        'other': 'Other'
      }
    };
  },
  computed: {
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: 'Employee',
          key: 'employee',
          width: 200,
          fixed: 'left',
          sorter: false,
        },
        {
          title: 'Department',
          key: 'department',
          width: 150,
          sorter: false,
        },
        {
          title: 'Destination',
          dataIndex: 'destination',
          key: 'destination',
          width: 150,
          sorter: true,
          sortOrder: sorted.columnKey === 'destination' && sorted.order,
        },
        {
          title: 'Travel Dates',
          key: 'travel_dates',
          width: 180,
          sorter: false,
        },
        {
          title: 'Purpose',
          dataIndex: 'purpose',
          key: 'purpose',
          width: 200,
          sorter: true,
          sortOrder: sorted.columnKey === 'purpose' && sorted.order,
          ellipsis: true,
        },
        {
          title: 'Transportation',
          key: 'transportation',
          width: 140,
          filters: [
            { text: 'SMRU Vehicle', value: 'smru_vehicle' },
            { text: 'Public Transport', value: 'public_transportation' },
            { text: 'Air', value: 'air' },
            { text: 'Other', value: 'other' },
          ],
          filteredValue: filtered.transportation || null,
          sorter: false,
        },
        {
          title: 'Accommodation',
          key: 'accommodation',
          width: 140,
          filters: [
            { text: 'SMRU Arrangement', value: 'smru_arrangement' },
            { text: 'Self Arrangement', value: 'self_arrangement' },
            { text: 'Other', value: 'other' },
          ],
          filteredValue: filtered.accommodation || null,
          sorter: false,
        },
        {
          title: 'Actions',
          key: 'action',
          fixed: 'right',
          width: 100,
          sorter: false,
        },
      ];
    },
    tableData() {
      return this.travelRequests.map(request => ({
        ...request,
        key: request.id,
      }));
    },
    rowSelection() {
      return {
        fixed: 'left',
        columnWidth: 60,
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: false,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_NONE,
        ],
      };
    },
  },
  mounted() {
    this.fetchTravelRequests();
  },
  methods: {
    // =============================================
    // PAGINATION HANDLERS
    // =============================================
    handlePaginationChange(page, pageSize) {
      this.currentPage = page;
      this.pageSize = pageSize || this.pageSize;
      const params = this.buildApiParams({ page: page, per_page: this.pageSize });
      this.fetchTravelRequests(params);
    },

    handleSizeChange(current, size) {
      this.currentPage = 1;
      this.pageSize = size;
      const params = this.buildApiParams({ page: 1, per_page: size });
      this.fetchTravelRequests(params);
    },

    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams
      };

      if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
        params.sort_by = this.sortedInfo.field;
        params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
        if (this.filteredInfo.transportation && this.filteredInfo.transportation.length > 0) {
          params.filter_transportation = this.filteredInfo.transportation.join(',');
        }
        if (this.filteredInfo.accommodation && this.filteredInfo.accommodation.length > 0) {
          params.filter_accommodation = this.filteredInfo.accommodation.join(',');
        }
      }

      if (this.searchTerm && this.searchTerm.trim()) {
        params.search = this.searchTerm.trim();
      }

      return params;
    },

    // =============================================
    // TABLE CHANGE (sort/filter)
    // =============================================
    handleTableChange(pagination, filters, sorter) {
      const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(this.filteredInfo);
      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.sortedInfo);

      if (!hasFilterChange && !hasSorterChange) return;

      this.filteredInfo = filters;

      if (sorter && sorter.field && sorter.order) {
        this.sortedInfo = sorter;
      } else if (!sorter || (!sorter.field && !sorter.order)) {
        this.sortedInfo = {};
      }

      this.currentPage = 1;
      const params = this.buildApiParams({ page: 1, per_page: this.pageSize });
      this.fetchTravelRequests(params);
    },

    // =============================================
    // SEARCH
    // =============================================
    async handleSearch() {
      if (!this.searchTerm || this.searchTerm.trim() === '') {
        this.$message && this.$message.warning && this.$message.warning('Please enter a search term');
        return;
      }

      this.searchLoading = true;
      try {
        this.currentPage = 1;
        const params = this.buildApiParams({ page: 1, per_page: this.pageSize });
        await this.fetchTravelRequests(params);
      } finally {
        this.searchLoading = false;
      }
    },

    // =============================================
    // FETCH DATA
    // =============================================
    async fetchTravelRequests(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };

        const response = await travelRequestService.getTravelRequests(queryParams);
        if (response.success) {
          this.travelRequests = response.data || [];

          if (response.pagination) {
            this.total = response.pagination.total || 0;
            this.currentPage = response.pagination.current_page || 1;
            this.pageSize = response.pagination.per_page || this.pageSize;
          } else {
            this.total = (response.data && response.data.length) || 0;
          }

          this.updateStatistics();
        } else {
          this.travelRequests = [];
          this.total = 0;
        }
      } catch (error) {
        console.error('Error fetching travel requests:', error);
        this.showToast('Error loading travel requests', 'error');
        this.travelRequests = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    updateStatistics() {
      this.statistics.total = this.total;
      this.statistics.approved = this.travelRequests.length;
      this.statistics.domestic = Math.floor(this.total * 0.7);
      this.statistics.international = Math.floor(this.total * 0.3);
    },

    // =============================================
    // CLEAR FILTERS
    // =============================================
    clearFilters() {
      this.filteredInfo = {};
      this.currentPage = 1;
      const params = this.buildApiParams({ page: 1, per_page: this.pageSize });
      this.fetchTravelRequests(params);
    },

    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchTerm = '';
      this.currentPage = 1;
      this.fetchTravelRequests({ page: 1, per_page: this.pageSize });
    },

    // =============================================
    // MODAL METHODS
    // =============================================
    openCreateModal() {
      this.editingRecord = null;
      this.modalVisible = true;
    },

    editTravelRequest(record) {
      this.editingRecord = record;
      this.modalVisible = true;
    },

    closeModal() {
      this.modalVisible = false;
      this.editingRecord = null;
    },

    async handleSaved() {
      this.closeModal();
      await this.fetchTravelRequests();
    },

    // =============================================
    // DELETE
    // =============================================
    confirmDeleteTravelRequest(id) {
      Modal.confirm({
        title: 'Are you sure you want to delete this travel request?',
        content: 'This action cannot be undone.',
        centered: true,
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteTravelRequest(id);
        }
      });
    },

    async deleteTravelRequest(id) {
      try {
        await travelRequestService.deleteTravelRequest(id);
        this.showToast('Travel request deleted successfully', 'success');
        this.fetchTravelRequests();
      } catch (error) {
        console.error('Error deleting travel request:', error);
        this.showToast('Error deleting travel request', 'error');
      }
    },

    confirmDeleteSelected() {
      if (this.selectedRowKeys.length === 0) {
        this.$message && this.$message.warning && this.$message.warning('Please select at least one travel request');
        return;
      }

      Modal.confirm({
        title: `Delete ${this.selectedRowKeys.length} selected travel request(s)?`,
        content: 'This action cannot be undone.',
        centered: true,
        okText: 'Yes, Delete All',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteSelected();
        }
      });
    },

    async deleteSelected() {
      try {
        await travelRequestService.deleteSelectedTravelRequests(this.selectedRowKeys);
        this.showToast(`${this.selectedRowKeys.length} travel request(s) deleted successfully`, 'success');
        this.selectedRowKeys = [];
        this.fetchTravelRequests();
      } catch (error) {
        console.error('Error deleting travel requests:', error);
        this.showToast('Error deleting travel requests', 'error');
      }
    },

    // =============================================
    // ROW SELECTION
    // =============================================
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    // =============================================
    // FORMATTING
    // =============================================
    formatDate(date) {
      return date ? dayjs(date).format('DD/MM/YYYY') : '-';
    },

    formatTransportation(value) {
      return this.transportationMap[value] || value || '-';
    },

    formatAccommodation(value) {
      return this.accommodationMap[value] || value || '-';
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    }
  }
};
</script>

<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

.table-operations {
  margin-bottom: 16px;
}

.table-operations>button {
  margin-right: 8px;
}

:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  min-width: 80px;
}

/* Primary color styling for search input button */
.search-input-primary :deep(.ant-input-search-button) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.search-input-primary :deep(.ant-input-search-button:hover) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.search-input-primary :deep(.ant-input-search-button:focus) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

/* Pagination wrapper styling */
.pagination-wrapper {
  margin-top: 20px;
  padding: 20px 16px;
  border-top: 1px solid #e8e8e8;
  position: relative;
  z-index: 100;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

/* Ensure pagination is not overlapping */
.resize-observer-fix {
  position: relative;
  min-height: 100px;
}

/* Ant Design pagination customization */
:deep(.ant-pagination) {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

:deep(.ant-pagination-total-text) {
  margin-right: 16px;
  color: #666;
  font-size: 14px;
}

:deep(.ant-pagination-options) {
  margin-left: 16px;
}

:deep(.ant-pagination-options-size-changer) {
  margin-right: 8px;
}

:deep(.ant-pagination-options-quick-jumper) {
  margin-left: 8px;
}

/* Fix dropdown placement */
:deep(.ant-pagination-options-size-changer .ant-select) {
  z-index: 1000;
}

:deep(.ant-pagination-options-size-changer .ant-select-dropdown) {
  z-index: 1050 !important;
  top: auto !important;
  bottom: calc(100% + 4px) !important;
}

:deep(.ant-select-dropdown) {
  z-index: 1050 !important;
}

:deep(.ant-pagination .ant-select-dropdown) {
  position: absolute !important;
  bottom: calc(100% + 4px) !important;
  top: auto !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
}

/* Container overflow fixes */
.card:not(.statistics-card) {
  overflow: visible !important;
  margin-bottom: 20px;
}

.card:not(.statistics-card) .card-body {
  overflow: visible !important;
  padding-bottom: 0;
}

/* Statistics cards styling */
.statistics-card {
  margin-bottom: 0.75rem;
}

.statistics-card .card-body {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: auto;
}

.statistics-row {
  margin-bottom: 1rem;
}

.statistics-row .col-lg-3 {
  margin-bottom: 0.5rem;
}

.statistics-card .avatar {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.statistics-card h4 {
  margin-bottom: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.statistics-card .fs-12 {
  font-size: 0.75rem !important;
  margin-bottom: 0.25rem !important;
}

/* Enhanced scrollbar styling */
:deep(.ant-table-body)::-webkit-scrollbar {
  width: 16px !important;
  height: 16px !important;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
  background: #f1f1f1 !important;
  border-radius: 8px !important;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
  background: #888 !important;
  border-radius: 8px !important;
  border: 2px solid #f1f1f1 !important;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #555 !important;
}

/* Fixed columns */
:deep(.ant-table-fixed-left),
:deep(.ant-table-fixed-right) {
  background-color: #ffffff !important;
}

:deep(.ant-table-fixed-left .ant-table-thead > tr > th),
:deep(.ant-table-fixed-right .ant-table-thead > tr > th) {
  background-color: #fafafa !important;
  color: #595959 !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

:deep(.ant-table-fixed-left .ant-table-tbody > tr > td),
:deep(.ant-table-fixed-right .ant-table-tbody > tr > td) {
  background-color: #ffffff !important;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa !important;
  color: #595959 !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

:deep(.ant-table-tbody > tr > td) {
  background-color: #ffffff !important;
}

:deep(.ant-table-tbody > tr:hover > td),
:deep(.ant-table-fixed-left .ant-table-tbody > tr:hover > td),
:deep(.ant-table-fixed-right .ant-table-tbody > tr:hover > td) {
  background-color: #fafafa !important;
}

:deep(.ant-table-selection-column) {
  background-color: #ffffff !important;
  z-index: 3 !important;
  min-width: 60px !important;
  width: 60px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

:deep(.ant-table-thead .ant-table-selection-column) {
  background-color: #fafafa !important;
}

:deep(.ant-table-row-selected > td),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-left),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-right),
:deep(.ant-table-row-selected > td.ant-table-selection-column) {
  background-color: #e6f7ff !important;
  z-index: 3 !important;
}

:deep(.ant-table-container) {
  border: 1px solid #e0e0e0;
  border-radius: 0;
}

:deep(.ant-table-layout-fixed table) {
  table-layout: auto !important;
}

:deep(.ant-table-wrapper) {
  background-color: #ffffff;
}

/* Action icons */
.action-icon {
  display: inline-flex;
  gap: 8px;
}

.action-icon a {
  color: #666;
  font-size: 16px;
  transition: color 0.2s;
}

.action-icon a:hover {
  color: #0067A5;
}

/* Badge styling */
.badge-soft-blue {
  background-color: rgba(54, 162, 235, 0.1);
  color: #36a2eb;
}

.badge-soft-green {
  background-color: rgba(75, 192, 192, 0.1);
  color: #4bc0c0;
}

.badge-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.2rem;
}

.text-muted {
  color: #999 !important;
}

/* Other text styling */
.other-text {
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  border-left: 3px solid #dee2e6;
  font-style: italic;
  max-width: 200px;
  word-wrap: break-word;
}

.other-text small {
  font-size: 0.7rem;
  line-height: 1.2;
}
</style>

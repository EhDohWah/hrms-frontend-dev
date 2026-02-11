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
          <!-- Add Holiday Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddModal">
              <i class="ti ti-circle-plus me-2"></i>Add Holiday
            </button>
          </div>
          <!-- Delete Selected Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2 me-2">
            <button
              class="btn btn-danger d-flex align-items-center"
              @click="confirmDeleteSelected"
              :class="{ 'disabled': selectedRowKeys.length === 0 }"
            >
              <i class="ti ti-trash me-2"></i>Delete Selected
            </button>
          </div>
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" class="" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Holidays List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <!-- Filter Dropdowns -->
            <div class="me-2">
              <a-select
                v-model:value="filterYear"
                placeholder="Filter by Year"
                style="width: 140px;"
                allow-clear
                @change="handleFilterChange"
              >
                <a-select-option v-for="year in yearOptions" :key="year.value" :value="year.value">
                  {{ year.label }}
                </a-select-option>
              </a-select>
            </div>
            <div class="me-2">
              <a-select
                v-model:value="filterStatus"
                placeholder="Status"
                style="width: 120px;"
                allow-clear
                @change="handleFilterChange"
              >
                <a-select-option v-for="status in statusOptions" :key="status.value" :value="status.value">
                  {{ status.label }}
                </a-select-option>
              </a-select>
            </div>
            <div class="me-2">
              <a-select
                v-model:value="sortBy"
                placeholder="Sort By"
                style="width: 160px;"
                @change="handleFilterChange"
              >
                <a-select-option v-for="sort in sortOptions" :key="sort.value" :value="sort.value">
                  {{ sort.label }}
                </a-select-option>
              </a-select>
            </div>
            <!-- Clear buttons -->
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <!-- Search input -->
            <div class="input-icon-end">
              <a-input-search
                v-model:value="searchText"
                placeholder="Search holidays..."
                :loading="searchLoading"
                enter-button="Search"
                @search="handleSearch"
                style="width: 250px;"
                class="search-input-primary"
              />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading holidays...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <!-- TABLE WITHOUT PAGINATION -->
            <a-table
              :columns="columns"
              :data-source="tableData"
              :pagination="false"
              :scroll="{ x: 1000, y: 'max-content' }"
              row-key="id"
              @change="handleTableChange"
              :row-selection="rowSelection"
            >
              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <!-- Name Column -->
                <template v-if="column.key === 'name'">
                  <div class="d-flex align-items-center">
                    <i class="ti ti-calendar me-2 text-primary"></i>
                    <strong>{{ record.name }}</strong>
                  </div>
                </template>

                <!-- Name Thai Column -->
                <template v-else-if="column.key === 'name_th'">
                  {{ record.name_th || '-' }}
                </template>

                <!-- Date Column -->
                <template v-else-if="column.key === 'date'">
                  {{ formatDate(record.date) }}
                </template>

                <!-- Description Column -->
                <template v-else-if="column.key === 'description'">
                  {{ record.description || '-' }}
                </template>

                <!-- Status Column -->
                <template v-else-if="column.key === 'is_active'">
                  <span :class="[
                    'badge',
                    record.is_active ? 'bg-success' : 'bg-secondary'
                  ]">
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </template>

                <!-- Actions Column -->
                <template v-else-if="column.key === 'actions'">
                  <div v-if="canEdit" class="action-icon d-inline-flex">
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      @click="openEditModal(record)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Edit Holiday"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <a
                      href="javascript:void(0);"
                      @click="confirmDeleteHoliday(record)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Delete Holiday"
                    >
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>
              </template>

              <!-- Empty State -->
              <template #emptyText>
                <div class="text-center py-4">
                  <i class="ti ti-calendar-off" style="font-size: 48px; color: #d9d9d9;"></i>
                  <p class="text-muted mt-2 mb-0">No holidays found</p>
                  <p class="text-muted small">Try adjusting your search or filters</p>
                </div>
              </template>
            </a-table>

            <!-- SEPARATE PAGINATION COMPONENT -->
            <div class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info">
                  <!-- Optional: Additional info can go here -->
                </div>
                <a-pagination
                  v-model:current="currentPage"
                  v-model:page-size="pageSize"
                  :total="total"
                  :show-size-changer="true"
                  :show-quick-jumper="true"
                  :page-size-options="['10', '20', '50', '100']"
                  :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                  @change="handlePaginationChange"
                  @show-size-change="handleSizeChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>

  <!-- Holiday Modal (for add/edit) -->
  <holidays-modal
    :visible="showModal"
    :editing-holiday="editingHoliday"
    @saved="onHolidaySaved"
    @close="handleModalClose"
  ></holidays-modal>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import HolidaysModal from '@/components/modal/holidays-modal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { holidayService } from '@/services/holiday.service';
import moment from 'moment';
import { Modal, Table } from 'ant-design-vue';
import { usePermissions } from '@/composables/usePermissions';
import { ref } from 'vue';

export default {
  name: 'HolidaysList',
  components: {
    indexBreadcrumb,
    HolidaysModal,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  },
  setup() {
    // Server-side pagination, filtering, and sorting state
    const filteredInfo = ref({});
    const sortedInfo = ref({});
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    // Initialize permission checks for holidays module
    const {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    } = usePermissions('holidays');

    return {
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
      title: 'Holidays',
      text: 'Employee',
      text1: 'Holidays',
      searchText: '',

      // Data properties
      holidays: [],
      loading: false,
      searchLoading: false,
      selectedRowKeys: [],

      // Filter properties
      filterYear: undefined,
      filterStatus: undefined,
      sortBy: 'date_asc',

      // Modal state
      showModal: false,
      editingHoliday: null,

      // Static options
      yearOptions: holidayService.getYearOptions(),
      statusOptions: holidayService.getStatusOptions(),
      sortOptions: holidayService.getSortOptions(),
    };
  },
  computed: {
    columns() {
      const sorted = this.sortedInfo || {};
      return [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 200,
          sorter: true,
          sortOrder: sorted.columnKey === 'name' && sorted.order,
        },
        {
          title: 'Name (Thai)',
          dataIndex: 'name_th',
          key: 'name_th',
          width: 200,
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          width: 150,
          sorter: true,
          sortOrder: sorted.columnKey === 'date' && sorted.order,
        },
        {
          title: 'Year',
          dataIndex: 'year',
          key: 'year',
          width: 100,
          align: 'center',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true,
        },
        {
          title: 'Status',
          dataIndex: 'is_active',
          key: 'is_active',
          width: 100,
          align: 'center',
        },
        {
          title: 'Actions',
          key: 'actions',
          fixed: 'right',
          width: 100,
        },
      ];
    },
    tableData() {
      return this.holidays.map(holiday => ({
        ...holiday,
        key: holiday.id,
      }));
    },
    rowSelection() {
      // Only show row selection if user has edit permission
      if (!this.canEdit) {
        return null;
      }

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
    this.fetchHolidays();
  },
  methods: {
    // PAGINATION EVENT HANDLERS
    handlePaginationChange(page, pageSize) {
      console.log('Pagination change:', page, pageSize);
      this.currentPage = page;
      this.pageSize = pageSize || this.pageSize;

      const params = this.buildApiParams({
        page: page,
        per_page: this.pageSize
      });

      this.fetchHolidays(params);
    },

    handleSizeChange(current, size) {
      console.log('Size change:', current, size);
      this.currentPage = 1;
      this.pageSize = size;

      const params = this.buildApiParams({
        page: 1,
        per_page: size
      });

      this.fetchHolidays(params);
    },

    // Helper method to build complete API parameters
    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams
      };

      // Add sorting parameters
      if (this.sortBy) {
        params.sort_by = this.sortBy;
      }

      // Add sorting from table column clicks
      if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
        const sortField = this.sortedInfo.field;
        const sortOrder = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
        params.sort_by = `${sortField}_${sortOrder}`;
      }

      // Add filter parameters
      if (this.filterYear) {
        params.year = this.filterYear;
      }
      if (this.filterStatus !== undefined && this.filterStatus !== null) {
        params.is_active = this.filterStatus;
      }
      if (this.searchText?.trim()) {
        params.search = this.searchText.trim();
      }

      return params;
    },

    // TABLE CHANGE HANDLER (for sorting)
    handleTableChange(pagination, filters, sorter) {
      console.log('Table change (sorting):', sorter);

      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.sortedInfo);

      if (!hasSorterChange) {
        console.log('No meaningful change detected, skipping reload');
        return;
      }

      if (sorter && sorter.field && sorter.order) {
        console.log('Applying sort:', sorter);
        this.sortedInfo = sorter;
        // Update sortBy dropdown to match
        const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
        this.sortBy = `${sorter.field}_${sortOrder}`;
      } else if (!sorter || (!sorter.field && !sorter.order)) {
        console.log('Clearing sort');
        this.sortedInfo = {};
        this.sortBy = 'date_asc';
      }

      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchHolidays(params);
    },

    handleFilterChange() {
      console.log('Filter changed:', {
        year: this.filterYear,
        status: this.filterStatus,
        sortBy: this.sortBy
      });

      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchHolidays(params);
    },

    handleSearch() {
      if (!this.searchText?.trim()) {
        // If search is cleared, fetch all holidays
        this.currentPage = 1;
        this.fetchHolidays(this.buildApiParams({ page: 1, per_page: this.pageSize }));
        return;
      }

      this.searchLoading = true;
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchHolidays(params).finally(() => {
        this.searchLoading = false;
      });
    },

    clearFilters() {
      this.filterYear = undefined;
      this.filterStatus = undefined;
      this.searchText = '';
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchHolidays(params);
    },

    clearAll() {
      this.filterYear = undefined;
      this.filterStatus = undefined;
      this.sortBy = 'date_asc';
      this.sortedInfo = {};
      this.searchText = '';
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchHolidays(params);
    },

    async fetchHolidays(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };

        const response = await holidayService.getHolidays(queryParams);

        if (response.success && response.data) {
          this.holidays = response.data;

          // Update pagination from server response
          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
            this.pageSize = response.pagination.per_page;
          } else {
            this.total = response.data.length;
            this.currentPage = 1;
          }

          this.$message.success('Holidays loaded successfully');
        } else {
          this.holidays = [];
          this.total = 0;
          this.$message.error(response.message || 'No holidays data received');
        }
      } catch (error) {
        console.error('Error fetching holidays:', error);
        this.holidays = [];
        this.total = 0;
        this.$message.error('Failed to load holidays');
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return '-';
      return moment(dateString).format('DD/MM/YYYY');
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    // Row selection change handler
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      console.log('selectedRowKeys changed:', selectedRowKeys);
    },

    // Modal handlers
    openAddModal() {
      this.editingHoliday = null;
      this.showModal = true;
    },

    openEditModal(record) {
      this.editingHoliday = { ...record };
      this.showModal = true;
    },

    handleModalClose() {
      this.showModal = false;
      this.editingHoliday = null;
    },

    onHolidaySaved(result) {
      console.log('Holiday saved:', result);
      this.showModal = false;
      this.editingHoliday = null;
      this.fetchHolidays();
    },

    // Delete handlers
    confirmDeleteHoliday(record) {
      Modal.confirm({
        title: 'Delete Holiday',
        content: `Are you sure you want to delete "${record.name}"?`,
        centered: true,
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteHoliday(record.id);
        }
      });
    },

    async deleteHoliday(id) {
      try {
        const response = await holidayService.deleteHoliday(id);
        if (response.success) {
          this.$message.success('Holiday deleted successfully');
          this.fetchHolidays();
        } else {
          this.$message.error(response.message || 'Failed to delete holiday');
        }
      } catch (error) {
        console.error('Error deleting holiday:', error);
        this.$message.error(error.message || 'Failed to delete holiday');
      }
    },

    confirmDeleteSelected() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('Please select at least one holiday to delete');
        return;
      }

      Modal.confirm({
        title: `Delete ${this.selectedRowKeys.length} Selected Holiday(s)?`,
        content: 'This will delete all selected holidays. This action cannot be undone.',
        centered: true,
        okText: 'Yes, Delete All',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteSelectedHolidays();
        }
      });
    },

    async deleteSelectedHolidays() {
      try {
        // Delete one by one (or implement bulk delete endpoint if available)
        for (const id of this.selectedRowKeys) {
          await holidayService.deleteHoliday(id);
        }
        this.$message.success(`${this.selectedRowKeys.length} holiday(s) deleted successfully`);
        this.selectedRowKeys = [];
        this.fetchHolidays();
      } catch (error) {
        console.error('Error deleting holidays:', error);
        this.$message.error('Failed to delete some holidays');
        this.fetchHolidays();
      }
    },
  }
};
</script>

<style scoped>
/* ===========================================
   HOLIDAYS LIST PAGE - SCOPED STYLES
   =========================================== */

/* Table operations */
.table-operations {
  margin-bottom: 16px;
}

.table-operations > button {
  margin-right: 8px;
}

/* Filter select styling */
:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  font-size: 14px;
  min-width: 80px;
}

/* Primary search button */
.search-input-primary :deep(.ant-input-search-button) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.search-input-primary :deep(.ant-input-search-button:hover),
.search-input-primary :deep(.ant-input-search-button:focus) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  opacity: 0.9;
}

/* ===========================================
   PAGINATION WRAPPER
   =========================================== */
.pagination-wrapper {
  margin-top: 16px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.resize-observer-fix {
  position: relative;
  min-height: 100px;
}

:deep(.ant-pagination) {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

:deep(.ant-pagination-total-text) {
  margin-right: 16px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

/* ===========================================
   CARD CONTAINERS
   =========================================== */
.card {
  overflow: visible;
  margin-bottom: 20px;
}

.card .card-body {
  overflow: visible;
  padding-bottom: 0;
}

/* ===========================================
   ANT DESIGN TABLE - FIXED COLUMN FIXES
   =========================================== */

/* Table container */
:deep(.ant-table-container) {
  border: 1px solid #f0f0f0;
  border-radius: 2px;
}

/* Fixed column headers - opaque background */
:deep(.ant-table-thead > tr > th.ant-table-cell-fix-left),
:deep(.ant-table-thead > tr > th.ant-table-cell-fix-right),
:deep(.ant-table-thead .ant-table-selection-column) {
  background-color: #fafafa !important;
}

/* Fixed column body cells - opaque white background */
:deep(.ant-table-tbody > tr > td.ant-table-cell-fix-left),
:deep(.ant-table-tbody > tr > td.ant-table-cell-fix-right),
:deep(.ant-table-tbody > tr > td.ant-table-selection-column) {
  background-color: #ffffff !important;
}

/* Row hover - Fixed columns must stay opaque */
:deep(.ant-table-tbody > tr:hover > td.ant-table-cell-fix-left),
:deep(.ant-table-tbody > tr:hover > td.ant-table-cell-fix-right),
:deep(.ant-table-tbody > tr:hover > td.ant-table-selection-column) {
  background-color: #fafafa !important;
}

/* Non-fixed columns can use any hover color */
:deep(.ant-table-tbody > tr:hover > td:not(.ant-table-cell-fix-left):not(.ant-table-cell-fix-right):not(.ant-table-selection-column)) {
  background-color: #fafafa;
}

/* Selected row - fixed columns (OPAQUE light blue) */
:deep(.ant-table-tbody > tr.ant-table-row-selected > td.ant-table-cell-fix-left),
:deep(.ant-table-tbody > tr.ant-table-row-selected > td.ant-table-cell-fix-right),
:deep(.ant-table-tbody > tr.ant-table-row-selected > td.ant-table-selection-column) {
  background-color: #f0f7ff !important;
}

/* Selected row - non-fixed columns */
:deep(.ant-table-tbody > tr.ant-table-row-selected > td:not(.ant-table-cell-fix-left):not(.ant-table-cell-fix-right):not(.ant-table-selection-column)) {
  background-color: #f0f7ff;
}

/* Selected row hover - fixed columns */
:deep(.ant-table-tbody > tr.ant-table-row-selected:hover > td.ant-table-cell-fix-left),
:deep(.ant-table-tbody > tr.ant-table-row-selected:hover > td.ant-table-cell-fix-right),
:deep(.ant-table-tbody > tr.ant-table-row-selected:hover > td.ant-table-selection-column) {
  background-color: #e6f4ff !important;
}

/* Selected row hover - non-fixed columns */
:deep(.ant-table-tbody > tr.ant-table-row-selected:hover > td:not(.ant-table-cell-fix-left):not(.ant-table-cell-fix-right):not(.ant-table-selection-column)) {
  background-color: #e6f4ff;
}

/* ===========================================
   ACTION ICONS
   =========================================== */
.action-icon a {
  color: #6c757d;
  transition: color 0.2s;
  padding: 0.25rem;
}

.action-icon a:hover {
  color: #3b82f6;
}

.action-icon a:last-child {
  color: #dc3545;
}

.action-icon a:last-child:hover {
  color: #bb2d3b;
}

/* ===========================================
   SCROLLBAR STYLING
   =========================================== */
:deep(.ant-table-body)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

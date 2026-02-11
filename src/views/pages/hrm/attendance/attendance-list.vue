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
          <!-- Add Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddModal">
              <i class="ti ti-circle-plus me-2"></i>Add Attendance
            </button>
          </div>
          <div class="ms-2 head-icons">
            <a
              href="javascript:void(0);"
              :class="{ active: isCollapsed }"
              @click="toggleCollapse"
              id="collapse-header"
            >
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Attendance List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-select
                v-model:value="filterStatus"
                placeholder="Filter by Status"
                style="width: 160px"
                allowClear
                @change="handleFilterChange"
              >
                <a-select-option value="Present">Present</a-select-option>
                <a-select-option value="Absent">Absent</a-select-option>
                <a-select-option value="Late">Late</a-select-option>
                <a-select-option value="Half Day">Half Day</a-select-option>
                <a-select-option value="On Leave">On Leave</a-select-option>
              </a-select>
            </div>
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search
                v-model:value="searchQuery"
                placeholder="Search employee name or ID..."
                :loading="searchLoading"
                enter-button="Search"
                @search="handleSearch"
                style="width: 280px"
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
            <p class="mt-2">Loading attendance records...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <!-- TABLE WITHOUT PAGINATION -->
            <a-table
              :columns="columns"
              :data-source="tableData"
              :pagination="false"
              :scroll="{ x: 1200, y: 'max-content' }"
              row-key="id"
              @change="handleTableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'employee_name'">
                  {{ record.employee_name }}
                </template>

                <template v-if="column.dataIndex === 'staff_id'">
                  {{ record.staff_id }}
                </template>

                <template v-if="column.dataIndex === 'date'">
                  {{ record.date }}
                </template>

                <template v-if="column.dataIndex === 'clock_in'">
                  {{ record.clock_in || '--' }}
                </template>

                <template v-if="column.dataIndex === 'clock_out'">
                  {{ record.clock_out || '--' }}
                </template>

                <template v-if="column.dataIndex === 'status'">
                  <span :class="getStatusBadgeClass(record.status)">
                    {{ record.status }}
                  </span>
                </template>

                <template v-if="column.dataIndex === 'total_hours'">
                  {{ record.total_hours ? `${record.total_hours} hrs` : '--' }}
                </template>

                <template v-if="column.dataIndex === 'actions'">
                  <div class="action-icon d-inline-flex">
                    <!-- Edit - Only visible if user can edit -->
                    <a
                      v-if="canEdit"
                      href="javascript:void(0);"
                      class="me-2"
                      @click="openEditModal(record)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Edit Record"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <!-- Delete - Only visible if user can edit -->
                    <a
                      v-if="canEdit"
                      href="javascript:void(0);"
                      @click="deleteRecord(record.id)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Delete Record"
                    >
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>
              </template>
            </a-table>

            <!-- SEPARATE PAGINATION COMPONENT -->
            <div class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info"></div>
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

  <!-- Attendance Modal (Ant Design Vue - props-based) -->
  <attendance-modal
    :visible="modalVisible"
    :editingRecord="editingRecord"
    @saved="onModalSaved"
    @close="onModalClose"
  />
</template>

<script>
import { Modal as AntModal } from 'ant-design-vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import AttendanceModal from '@/components/modal/attendance-modal.vue';
import { attendanceService } from '@/services/attendance.service';
import { usePermissions } from '@/composables/usePermissions';
import { ref } from 'vue';
import dayjs from 'dayjs';

export default {
  name: 'AttendanceList',
  components: {
    indexBreadcrumb,
    AttendanceModal,
  },
  setup() {
    const sortedInfo = ref({});
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    // Permission checks for attendance_admin module
    const { canRead, canEdit, isReadOnly } = usePermissions('attendance_admin');

    return {
      sortedInfo,
      currentPage,
      pageSize,
      total,
      canRead,
      canEdit,
      isReadOnly,
    };
  },
  data() {
    return {
      title: 'Attendance',
      text: 'HRM',
      text1: 'Attendance List',
      records: [],
      loading: false,
      searchLoading: false,
      searchQuery: '',
      filterStatus: undefined,
      isCollapsed: false,

      // Modal state (props-based pattern)
      modalVisible: false,
      editingRecord: null,

      // Field mapping for server-side sorting
      fieldMapping: {
        employee_name: 'employee_name',
        date: 'date',
        clock_in: 'clock_in',
        clock_out: 'clock_out',
        status: 'status',
        total_hours: 'total_hours',
      },
    };
  },
  computed: {
    columns() {
      const sorted = this.sortedInfo || {};

      return [
        {
          title: '#',
          dataIndex: 'index',
          key: 'index',
          width: 60,
          customRender: ({ index }) => index + 1 + (this.currentPage - 1) * this.pageSize,
        },
        {
          title: 'Employee Name',
          dataIndex: 'employee_name',
          key: 'employee_name',
          width: 180,
          sorter: true,
          sortOrder: sorted.columnKey === 'employee_name' && sorted.order,
        },
        {
          title: 'Staff ID',
          dataIndex: 'staff_id',
          key: 'staff_id',
          width: 110,
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          width: 120,
          sorter: true,
          sortOrder: sorted.columnKey === 'date' && sorted.order,
        },
        {
          title: 'Clock In',
          dataIndex: 'clock_in',
          key: 'clock_in',
          width: 100,
          sorter: true,
          sortOrder: sorted.columnKey === 'clock_in' && sorted.order,
        },
        {
          title: 'Clock Out',
          dataIndex: 'clock_out',
          key: 'clock_out',
          width: 100,
          sorter: true,
          sortOrder: sorted.columnKey === 'clock_out' && sorted.order,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 110,
          sorter: true,
          sortOrder: sorted.columnKey === 'status' && sorted.order,
        },
        {
          title: 'Total Hours',
          dataIndex: 'total_hours',
          key: 'total_hours',
          width: 110,
          sorter: true,
          sortOrder: sorted.columnKey === 'total_hours' && sorted.order,
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          fixed: 'right',
          width: 100,
        },
      ];
    },
    tableData() {
      return this.records.map((record) => ({
        ...record,
        key: record.id,
      }));
    },
  },
  mounted() {
    this.fetchRecords();
  },
  methods: {
    // Build API params preserving current state
    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage || 1,
        per_page: this.pageSize || 10,
        ...baseParams,
      };

      // Add sorting parameters
      const sorted = this.sortedInfo || {};
      if (sorted.field) {
        const sortField = this.mapSortField(sorted.field);
        params.sort_by = sortField;
        params.sort_order = sorted.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add status filter
      if (this.filterStatus) {
        params.filter_status = this.filterStatus;
      }

      // Add search query
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        params.search = this.searchQuery.trim();
      }

      return params;
    },

    // Map frontend field names to backend field names
    mapSortField(field) {
      return this.fieldMapping[field] || field;
    },

    // Pagination change handler
    handlePaginationChange(page, pageSize) {
      this.currentPage = page;
      this.pageSize = pageSize || this.pageSize;

      const params = this.buildApiParams({
        page: page,
        per_page: this.pageSize,
      });

      this.fetchRecords(params);
    },

    // Page size change handler
    handleSizeChange(current, size) {
      this.currentPage = 1;
      this.pageSize = size;

      const params = this.buildApiParams({
        page: 1,
        per_page: size,
      });

      this.fetchRecords(params);
    },

    // Table change handler (sorting)
    handleTableChange(pagination, filters, sorter) {
      const sorted = this.sortedInfo || {};
      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(sorted);

      if (!hasSorterChange) {
        return;
      }

      this.sortedInfo = sorter;
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize,
      });

      this.fetchRecords(params);
    },

    // Filter change handler
    handleFilterChange() {
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize,
      });

      this.fetchRecords(params);
    },

    // Search handler
    handleSearch() {
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize,
      });

      this.searchLoading = true;
      this.fetchRecords(params).finally(() => {
        this.searchLoading = false;
      });
    },

    // Clear filters
    clearFilters() {
      this.filterStatus = undefined;
      this.searchQuery = '';
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize,
      });

      this.fetchRecords(params);
    },

    // Clear all filters and sorters
    clearAll() {
      this.filterStatus = undefined;
      this.searchQuery = '';
      this.sortedInfo = {};
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize,
      });

      this.fetchRecords(params);
    },

    // Fetch records from API
    async fetchRecords(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize || 10,
          ...params,
        };

        const response = await attendanceService.getAll(queryParams);

        if (response.success && response.data) {
          this.records = response.data.map((item) => ({
            id: item.id,
            employee_id: item.employee_id,
            employee_name: item.employee
              ? `${item.employee.first_name_en} ${item.employee.last_name_en || ''}`.trim()
              : 'N/A',
            staff_id: item.employee ? item.employee.staff_id : 'N/A',
            date: item.date ? dayjs(item.date).format('DD/MM/YYYY') : '',
            raw_date: item.date,
            clock_in: item.clock_in ? item.clock_in.substring(0, 5) : null,
            clock_out: item.clock_out ? item.clock_out.substring(0, 5) : null,
            status: item.status || 'N/A',
            total_hours: item.total_hours,
            notes: item.notes,
          }));

          // Update pagination from server response
          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
            this.pageSize = response.pagination.per_page;
          } else {
            this.total = response.data.length;
            this.currentPage = 1;
          }
        } else {
          this.records = [];
          this.total = 0;
        }
      } catch (error) {
        console.error('Error fetching attendance records:', error);
        this.records = [];
        this.total = 0;

        if (error.status) {
          switch (error.status) {
            case 401:
              this.$message.error(error.message || 'Authentication required. Please log in again.');
              break;
            case 403:
              this.$message.error(error.message || 'You don\'t have permission to view attendance records.');
              break;
            case 500:
              this.$message.error(error.message || 'Server error occurred. Please try again later.');
              break;
            case 422:
              this.$message.warning(error.message || 'Invalid request parameters.');
              break;
            default:
              this.$message.error(error.message || 'Failed to load attendance records');
          }
        } else {
          this.$message.error(error.message || 'Network connection error. Please check your connection and try again.');
        }
      } finally {
        this.loading = false;
      }
    },

    // Refresh records preserving current state
    refreshRecords() {
      const params = this.buildApiParams();
      this.fetchRecords(params);
    },

    // Get status badge class
    getStatusBadgeClass(status) {
      switch (status) {
        case 'Present':
          return 'badge bg-success';
        case 'Absent':
          return 'badge bg-danger';
        case 'Late':
          return 'badge bg-warning';
        case 'Half Day':
          return 'badge bg-info';
        case 'On Leave':
          return 'badge bg-secondary';
        default:
          return 'badge bg-secondary';
      }
    },

    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        document.body.classList.add('header-collapse');
      } else {
        document.body.classList.remove('header-collapse');
      }
    },

    // Modal handlers (Ant Design Vue props-based pattern)
    openAddModal() {
      this.editingRecord = null;
      this.modalVisible = true;
    },

    openEditModal(record) {
      this.editingRecord = {
        id: record.id,
        employee_id: record.employee_id,
        date: record.raw_date,
        clock_in: record.clock_in,
        clock_out: record.clock_out,
        status: record.status,
        notes: record.notes,
      };
      this.modalVisible = true;
    },

    onModalSaved() {
      this.modalVisible = false;
      this.editingRecord = null;
      this.refreshRecords();
    },

    onModalClose() {
      this.modalVisible = false;
      this.editingRecord = null;
    },

    // Delete record
    async deleteRecord(id) {
      try {
        await new Promise((resolve) => {
          AntModal.confirm({
            title: 'Delete Attendance Record?',
            content: 'Are you sure you want to delete this attendance record? This action cannot be undone.',
            centered: true,
            okText: 'Yes, delete',
            cancelText: 'Cancel',
            onOk: async () => {
              this.loading = true;
              try {
                const response = await attendanceService.delete(id);

                if (response && response.success !== false) {
                  this.$message.success('Attendance record deleted successfully');
                  this.refreshRecords();
                } else if (response && response.success === false) {
                  this.$message.error(response.message || 'Failed to delete attendance record');
                }
                resolve();
              } catch (error) {
                console.error('Error deleting attendance record:', error);

                if (error.status) {
                  switch (error.status) {
                    case 404:
                      this.$message.warning(error.message || 'Record not found. It may have already been deleted.');
                      break;
                    case 401:
                      this.$message.error(error.message || 'Authentication required. Please log in again.');
                      break;
                    case 403:
                      this.$message.error(error.message || 'You don\'t have permission to delete this record.');
                      break;
                    default:
                      this.$message.error(error.message || 'Failed to delete attendance record');
                  }
                } else {
                  this.$message.error(error.message || 'Network connection error. Please check your connection.');
                }
                resolve();
              } finally {
                this.loading = false;
              }
            },
            onCancel: () => {
              resolve();
            },
          });
        });
      } catch (error) {
        console.error('Delete confirmation failed:', error);
        this.$message.error('Failed to show delete confirmation dialog');
      }
    },
  },
};
</script>

<style scoped>
.table-operations {
  margin-bottom: 16px;
}

.table-operations > button {
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

/* Fix dropdown placement - force dropdown to appear above */
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
.card-body {
  overflow: visible !important;
  padding-bottom: 0;
}

.card {
  overflow: visible !important;
  margin-bottom: 20px;
}
</style>

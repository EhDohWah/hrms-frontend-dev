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
          <div class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddEmploymentModal">
              <i class="ti ti-circle-plus me-2"></i>Add Employment
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

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Employment List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search v-model:value="searchStaffId" placeholder="Enter staff ID..." :loading="searchLoading"
                enter-button="Search" @search="handleStaffIdSearch" style="width: 250px;"
                class="search-input-primary" />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading employments...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <!-- TABLE WITHOUT PAGINATION -->
            <a-table :columns="columns" :data-source="tableData" :pagination="false" :scroll="{ x: 'max-content' }"
              row-key="id" @change="handleTableChange">
              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'actions'">
                  <div class="action-icon d-inline-flex">
                    <a href="javascript:void(0);" class="me-2 edit-button" @click="openEditEmploymentModal(record)"
                      :class="{ 'loading': editingEmploymentId === record.id }"
                      :disabled="editingEmploymentId === record.id">
                      <span class="button-content">
                        <i class="ti ti-edit edit-icon" :class="{ 'fade-out': editingEmploymentId === record.id }"></i>
                        <div v-if="editingEmploymentId === record.id" class="loading-dots">
                          <div class="dot"></div>
                          <div class="dot"></div>
                          <div class="dot"></div>
                        </div>
                      </span>
                    </a>
                    <a href="javascript:void(0);" class="text-danger" @click="confirmDeleteEmployment(record.id)">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>

                <template v-else-if="column.dataIndex === 'department_position'">
                  <span v-if="record.department_position">
                    {{ record.department_position.department }} - {{ record.department_position.position }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </template>
                <template v-else-if="column.dataIndex === 'work_location'">
                  {{ record.work_location || '-' }}
                </template>
                <template v-else-if="column.dataIndex === 'employee_name'">
                  <span v-if="record.employee">
                    {{ record.employee.first_name_en }} {{ record.employee.last_name_en }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </template>
                <template v-else-if="column.dataIndex === 'staff_id'">
                  <span v-if="record.employee">
                    {{ record.employee.staff_id }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </template>
                <template v-else-if="column.dataIndex === 'subsidiary'">
                  <span v-if="record.employee" :class="[
                    'badge badge-sm fw-normal',
                    record.employee.subsidiary === 'SMRU' ? 'badge-primary' :
                      record.employee.subsidiary === 'BHF' ? 'badge-soft-primary fw-bold' :
                        'badge-secondary'
                  ]">
                    {{ record.employee.subsidiary }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </template>
                <template v-else-if="column.dataIndex === 'salary' || column.dataIndex === 'probation_salary'">
                  {{ formatCurrency(record[column.dataIndex]) }}
                </template>
                <template
                  v-else-if="column.dataIndex === 'start_date' || column.dataIndex === 'end_date' || column.dataIndex === 'probation_pass_date'">
                  {{ formatDate(record[column.dataIndex]) }}
                </template>
                <template v-else-if="column.dataIndex === 'status'">
                  <span :class="[
                    'badge',
                    record.status === 'Active' ? 'bg-success' :
                      record.status === 'Pending' ? 'bg-warning' :
                        record.status === 'Expired' ? 'bg-danger' :
                          'bg-secondary'
                  ]">
                    {{ record.status }}
                  </span>
                </template>
              </template>
            </a-table>

            <!-- SEPARATE PAGINATION COMPONENT -->
            <div class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info">
                  <!-- Optional: Additional info can go here -->
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
    <layout-footer></layout-footer>
  </div>

  <!-- Employment Modal Components -->
  <employment-modal ref="employmentModal" @employment-added="onEmploymentAdded" />
  <employment-edit-modal ref="employmentEditModal" @employment-updated="onEmploymentUpdated" />

  <!-- Notification Toast -->
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <div id="notificationToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header" :class="notificationClass">
        <strong class="me-auto">{{ notificationTitle }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{ notificationMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import EmploymentModal from '@/components/modal/employment-modal.vue';
import EmploymentEditModal from '@/components/modal/employment-edit-modal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { employmentService } from '@/services/employment.service';
import moment from 'moment';
import { Modal } from 'ant-design-vue';

export default {
  name: 'EmploymentList',
  components: {
    indexBreadcrumb,
    EmploymentModal,
    EmploymentEditModal,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  },
  data() {
    return {
      title: 'Employments',
      text: 'HR Management',
      text1: 'Employment List',
      searchStaffId: '',
      notificationTitle: '',
      notificationMessage: '',
      notificationClass: '',

      // Data properties matching grant-list
      filteredInfo: {},
      sortedInfo: {},
      employments: [],
      loading: false,
      searchLoading: false,

      // SEPARATE PAGINATION PROPERTIES
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // Loading states for individual actions
      editingEmploymentId: null, // Track which employment is being edited
    };
  },
  computed: {
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: 'Subsidiary',
          dataIndex: 'subsidiary',
          key: 'subsidiary',
          width: 150,
          filters: [
            { text: 'SMRU', value: 'SMRU' },
            { text: 'BHF', value: 'BHF' },
          ],
          filteredValue: filtered.subsidiary || null,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'subsidiary' && sorted.order,
          filterSearch: true
        },
        {
          title: 'Staff ID',
          dataIndex: 'staff_id',
          key: 'staff_id',
          width: 150,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'staff_id' && sorted.order
        },
        {
          title: 'Employee Name',
          dataIndex: 'employee_name',
          key: 'employee_name',
          width: 200,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'employee_name' && sorted.order
        },
        {
          title: 'Employment Type',
          dataIndex: 'employment_type',
          key: 'employment_type',
          width: 150,
          filters: [
            { text: 'Full-Time', value: 'Full-Time' },
            { text: 'Part-Time', value: 'Part-Time' },
            { text: 'Contract', value: 'Contract' },
            { text: 'Temporary', value: 'Temporary' },
            { text: 'Internship', value: 'Internship' },
          ],
          filteredValue: filtered.employment_type || null,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'employment_type' && sorted.order,
          filterSearch: true
        },
        {
          title: 'Department Position',
          dataIndex: 'department_position',
          key: 'department_position',
          width: 200,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'department_position' && sorted.order
        },
        {
          title: 'Work Location',
          dataIndex: 'work_location',
          key: 'work_location',
          width: 150,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'work_location' && sorted.order
        },
        {
          title: 'Start Date',
          dataIndex: 'start_date',
          key: 'start_date',
          width: 120,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'start_date' && sorted.order
        },
        {
          title: 'End Date',
          dataIndex: 'end_date',
          key: 'end_date',
          width: 120,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'end_date' && sorted.order
        },
        {
          title: 'Probation Pass Date',
          dataIndex: 'probation_pass_date',
          key: 'probation_pass_date',
          width: 150,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'probation_pass_date' && sorted.order
        },
        {
          title: 'Salary',
          dataIndex: 'salary',
          key: 'salary',
          width: 120,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'salary' && sorted.order
        },
        {
          title: 'Probation Salary',
          dataIndex: 'probation_salary',
          key: 'probation_salary',
          width: 120,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'probation_salary' && sorted.order
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          filters: [
            { text: 'Active', value: 'Active' },
            { text: 'Pending', value: 'Pending' },
            { text: 'Expired', value: 'Expired' },
          ],
          filteredValue: filtered.status || null,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'status' && sorted.order
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          fixed: 'right',
          width: 120
        }
      ];
    },
    tableData() {
      // With server-side pagination, just return the employments as-is
      return this.employments.map(emp => ({
        ...emp,
        key: emp.id,
        subsidiary: emp.employee?.subsidiary || 'N/A',
        staff_id: emp.employee?.staff_id || 'N/A',
        employee_name: emp.employee ? `${emp.employee.first_name_en} ${emp.employee.last_name_en}` : 'N/A',
        employment_type: emp.employment_type,
        work_location: emp.work_location?.name || 'N/A',
        start_date: emp.start_date,
        end_date: emp.end_date,
        salary: emp.position_salary,
        status: this.calculateEmploymentStatus(emp.start_date, emp.end_date),
      }));
    }
  },
  mounted() {
    this.fetchEmployments();
  },
  methods: {
    // PAGINATION EVENT HANDLERS - PRESERVE FILTERS AND SORTING
    handlePaginationChange(page, pageSize) {
      console.log('Pagination change:', page, pageSize);
      this.currentPage = page;
      this.pageSize = pageSize || this.pageSize;

      // Build complete parameters preserving current filters and sorting
      const params = this.buildApiParams({
        page: page,
        per_page: this.pageSize
      });

      this.fetchEmployments(params);
    },

    handleSizeChange(current, size) {
      console.log('Size change:', current, size);
      this.currentPage = 1; // Reset to first page when changing page size
      this.pageSize = size;

      // Build complete parameters preserving current filters and sorting
      const params = this.buildApiParams({
        page: 1,
        per_page: size
      });

      this.fetchEmployments(params);
    },

    // Helper method to build complete API parameters
    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams
      };

      // Add sorting parameters
      if (this.sortedInfo && this.sortedInfo.field) {
        const sortField = this.mapSortField(this.sortedInfo.field);
        params.sort_by = sortField;
        params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add filter parameters
      if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
        if (this.filteredInfo.subsidiary && this.filteredInfo.subsidiary.length > 0) {
          params.filter_subsidiary = this.filteredInfo.subsidiary.join(',');
        }
        if (this.filteredInfo.employment_type && this.filteredInfo.employment_type.length > 0) {
          params.filter_employment_type = this.filteredInfo.employment_type.join(',');
        }
        if (this.filteredInfo.status && this.filteredInfo.status.length > 0) {
          params.filter_status = this.filteredInfo.status.join(',');
        }
      }

      return params;
    },

    // TABLE CHANGE HANDLER (for sorting/filtering only)
    handleTableChange(pagination, filters, sorter) {
      console.log('Table change (sorting/filtering):', filters, sorter);

      // Check if there's actually a meaningful change
      const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(this.filteredInfo);
      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.sortedInfo);

      // Only proceed if there's an actual filter or sort change
      if (!hasFilterChange && !hasSorterChange) {
        console.log('No meaningful change detected, skipping reload');
        return;
      }

      // Update filter and sort state
      this.filteredInfo = filters;
      this.sortedInfo = sorter;

      // Reset to first page when filter/sort changes
      this.currentPage = 1;

      // Build complete parameters
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      // Fetch employments with new parameters
      this.fetchEmployments(params);
    },

    // Map frontend table field names to backend field names
    mapSortField(field) {
      const fieldMapping = {
        'staff_id': 'staff_id',
        'employee_name': 'employee_name',
        'employment_type': 'employment_type',
        'work_location': 'work_location',
        'start_date': 'start_date',
        'end_date': 'end_date',
        'salary': 'salary',
        'subsidiary': 'subsidiary'
      };
      return fieldMapping[field] || field;
    },

    clearFilters() {
      this.filteredInfo = {};
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchEmployments(params);
    },

    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchStaffId = '';
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchEmployments(params);
    },

    async handleStaffIdSearch() {
      // Validation: Check if search input is empty
      if (!this.searchStaffId || this.searchStaffId.trim() === '') {
        this.$message.warning('Please enter a staff ID to search');
        return;
      }

      this.searchLoading = true;
      try {
        const response = await employmentService.searchEmploymentsByStaffId(this.searchStaffId);

        // Check if the API returned success
        if (response.success === true && response.data) {
          // Handle array of employments from search response
          const employmentData = response.data;

          // Use the same mapping approach as fetchEmployments
          this.employments = employmentData.map(emp => ({
            // Map employment data structure consistently
            id: emp.id,
            employee: emp.employee,
            employment_type: emp.employment_type,
            work_location: emp.work_location,
            start_date: emp.start_date,
            end_date: emp.end_date,
            position_salary: emp.position_salary,
            probation_pass_date: emp.probation_pass_date,
            probation_salary: emp.probation_salary,
            fte: emp.fte,
            department_position: emp.department_position,
            pay_method: emp.pay_method,
            health_welfare: emp.health_welfare,
            pvd: emp.pvd,
            saving_fund: emp.saving_fund,
            employee_funding_allocations: emp.employee_funding_allocations,
            // Keep original object for editing
            ...emp
          }));

          // Update pagination for search results
          this.total = employmentData.length;
          this.currentPage = 1;

          // Show success message with employee summary if available
          if (response.employee_summary) {
            const summary = response.employee_summary;
            this.$message.success(`Found ${employmentData.length} employment(s) for ${summary.full_name} (${summary.staff_id})`);
          } else {
            this.$message.success(response.message || 'Employment found successfully');
          }

          // Log statistics if available
          if (response.statistics) {
            console.log('Search Statistics:', response.statistics);
          }
        } else {
          // Handle API response with success: false (404 - Employment not found)
          this.$message.warning(response.message || 'No employment found with this staff ID');
          // Clear employments when no results found
          this.employments = [];
          this.total = 0;
        }

        return response;
      } catch (error) {
        // Only network errors, auth errors, or parsing errors reach here
        console.error('Error fetching employment by staff ID:', error);
        this.$message.error('Network error: Failed to fetch employment by staff ID');
        // Clear employments on error
        this.employments = [];
        this.total = 0;
      } finally {
        this.searchLoading = false;
      }
    },

    async fetchEmployments(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };

        const response = await employmentService.getAllEmployments(queryParams);

        if (response.success && response.data) {
          this.employments = response.data.map(emp => ({
            // Map employment data structure
            id: emp.id,
            employee: emp.employee,
            employment_type: emp.employment_type,
            work_location: emp.work_location,
            start_date: emp.start_date,
            end_date: emp.end_date,
            position_salary: emp.position_salary,
            department_position: emp.department_position,
            active: emp.active,
            // Keep original object for editing
            ...emp
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

          this.$message.success('Employments loaded successfully');
        } else {
          this.employments = [];
          this.total = 0;

          this.$message.error('No employments data received');
        }
      } catch (error) {
        console.error('Error fetching employments:', error);
        this.employments = [];
        this.total = 0;
        this.$message.error('Failed to load employments');
      } finally {
        this.loading = false;
      }
    },

    // Calculate employment status based on start_date and end_date
    calculateEmploymentStatus(startDate, endDate) {
      if (!startDate) {
        return 'Pending'; // No start date means not started yet
      }

      const today = new Date();
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : null;

      // Remove time component for accurate date comparison
      today.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      if (end) {
        end.setHours(0, 0, 0, 0);
      }

      // Future start date
      if (start > today) {
        return 'Pending';
      }

      // No end date and start date is today or in the past
      if (!end) {
        return 'Active';
      }

      // Has end date - check if expired
      if (end < today) {
        return 'Expired';
      }

      // Currently active (start date passed, end date not reached)
      return 'Active';
    },

    toggleHeader() {
      console.log('toggleHeader');
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    formatCurrency(value) {
      if (!value) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return moment(dateString).format('YYYY-MM-DD');
    },

    openAddEmploymentModal() {
      this.$refs.employmentModal.openModal();
    },

    async openEditEmploymentModal(record) {
      console.log('Opening edit modal for employment:', record.id);

      try {
        // Show loading state on the specific edit button
        this.editingEmploymentId = record.id;

        // Fetch complete employment details with all related data
        const response = await employmentService.getEmploymentById(record.id);

        if (response.success && response.data) {
          console.log('Employment details loaded:', response.data);

          // Set the employment data to the edit modal
          this.$refs.employmentEditModal.employmentData = response.data;

          // Open the modal
          this.$refs.employmentEditModal.openModal();
        } else {
          console.error('Failed to load employment details:', response);
          this.$message.error('Failed to load employment details');
        }
      } catch (error) {
        console.error('Error loading employment details:', error);
        this.$message.error('Failed to load employment details');
      } finally {
        // Clear loading state
        this.editingEmploymentId = null;
      }
    },

    // Confirm delete employment
    confirmDeleteEmployment(id) {
      Modal.confirm({
        title: 'Are you sure you want to delete this employment?',
        content: 'This action cannot be undone.',
        centered: true,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          this.deleteEmployment(id);
        }
      });
    },

    async deleteEmployment(id) {
      this.loading = true;
      try {
        await employmentService.deleteEmployment(id);
        this.$message.success('Employment deleted successfully');
        // Refresh the employments list
        this.fetchEmployments();
      } catch (error) {
        console.error('Error deleting employment:', error);
        this.$message.error('Failed to delete employment');
      } finally {
        this.loading = false;
      }
    },

    // Event handlers for modal operations
    onEmploymentAdded(result) {
      console.log('Employment added:', result);
      if (result.success) {
        this.$message.success(result.message || 'Employment added successfully');
        // Refresh the employments list to show the new employment
        this.fetchEmployments();
      } else {
        this.$message.error(result.message || 'Failed to add employment');
      }
    },

    onEmploymentUpdated(result) {
      console.log('Employment updated:', result);
      if (result.success) {
        this.$message.success(result.message || 'Employment updated successfully');
        // Refresh the employments list to show the updated employment
        this.fetchEmployments();
      } else {
        this.$message.error(result.message || 'Failed to update employment');
      }
    }
  }
};
</script>

<style scoped>
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

/* Fix dropdown placement - force dropdown to appear above */
:deep(.ant-pagination-options-size-changer .ant-select) {
  z-index: 1000;
}

:deep(.ant-pagination-options-size-changer .ant-select-dropdown) {
  z-index: 1050 !important;
  top: auto !important;
  bottom: calc(100% + 4px) !important;
}

/* Force dropdown to appear above the trigger */
:deep(.ant-select-dropdown) {
  z-index: 1050 !important;
}

/* Ensure pagination dropdowns appear above */
.pagination-wrapper {
  position: relative;
  z-index: 100;
}

/* Override Ant Design dropdown placement */
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

/* Action icons styling */
.action-icon a {
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  min-height: 2rem;
  text-decoration: none;
  border: 1px solid transparent;
}

.action-icon a:hover {
  background-color: rgba(0, 123, 255, 0.08);
  border-color: rgba(0, 123, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Edit button specific styling */
.edit-button {
  color: #495057;
}

.edit-button:hover {
  color: #007bff;
}

.edit-button .button-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Loading state */
.edit-button.loading {
  background-color: rgba(0, 123, 255, 0.1);
  border-color: rgba(0, 123, 255, 0.3);
  pointer-events: none;
  cursor: not-allowed;
}

.edit-button.loading:hover {
  transform: none;
  box-shadow: none;
}

/* Icon fade out animation */
.edit-icon {
  transition: opacity 0.2s ease-in-out;
}

.edit-icon.fade-out {
  opacity: 0;
}

/* Loading dots animation */
.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-dots .dot {
  width: 3px;
  height: 3px;
  background-color: #007bff;
  border-radius: 50%;
  animation: loadingDots 1.4s infinite ease-in-out both;
}

.loading-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-dots .dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes loadingDots {

  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }

  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Disabled state */
.edit-button[disabled] {
  opacity: 0.8;
}
</style>
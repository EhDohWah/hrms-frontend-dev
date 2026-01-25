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
            <button class="btn btn-primary d-flex align-items-center" @click="openAddEmploymentModal"
              @mouseenter="preloadEmploymentModal" :disabled="openingAddModal">
              <template v-if="openingAddModal">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading form...
              </template>
              <template v-else>
                <i class="ti ti-circle-plus me-2"></i>Add Employment
              </template>
            </button>
          </div>
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-outline-primary d-flex align-items-center" @click="openActionChangeModal">
              <i class="ti ti-exchange me-2"></i>Action Change
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
          <h5>Employment List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search v-model:value="searchStaffId" placeholder="Enter staff ID..." :loading="searchLoading"
                enter-button="Search" @search="handleStaffIdSearch" @input="debouncedSearch" style="width: 250px;"
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
            <!-- TABLE WITH EXPANDABLE ROWS FOR FUNDING ALLOCATIONS -->
            <!-- Note: Virtual scrolling disabled to support expandable rows -->
            <a-table
              :columns="columns"
              :data-source="tableData"
              :pagination="false"
              :scroll="{ x: 'max-content', y: 600 }"
              row-key="id"
              @change="handleTableChange"
              :scrollToFirstRowOnChange="false"
              v-model:expandedRowKeys="expandedRowKeys"
              @expand="handleRowExpand"
            >
              <!-- Expandable row for funding allocations -->
              <template #expandedRowRender="{ record }">
                <EmployeeFundingAllocationPanel
                  :employment-id="record.id"
                  :employee-id="record.employee?.id || record.employee_id"
                  :readonly="!canEditAllocations"
                  @allocation-changed="onAllocationChanged"
                />
              </template>

              <!-- Custom cell rendering with v-memo for performance -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'actions'">
                  <div class="action-icon d-inline-flex" v-memo="[record.id, editingEmploymentId]">
                    <a v-if="canEdit" href="javascript:void(0);" class="me-2 edit-button" @click="openEditEmploymentModal(record)"
                      @mouseenter="preloadEmploymentEditModal" :class="{ 'loading': editingEmploymentId === record.id }"
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
                    <a v-if="canEdit" href="javascript:void(0);" class="text-danger" @click="confirmDeleteEmployment(record.id)">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>

                <template v-else-if="column.dataIndex === 'department'">
                  <span v-if="record.department">
                    {{ record.department }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </template>
                <template v-else-if="column.dataIndex === 'position'">
                  <span v-if="record.position">
                    {{ record.position }}
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
                <template v-else-if="column.dataIndex === 'organization'">
                  <span v-if="record.employee" :class="[
                    'badge badge-sm fw-normal',
                    record.employee.organization === 'SMRU' ? 'badge-primary' :
                      record.employee.organization === 'BHF' ? 'badge-soft-primary fw-bold' :
                        'badge-secondary'
                  ]">
                    {{ record.employee.organization }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </template>
                <template v-else-if="column.dataIndex === 'salary' || column.dataIndex === 'probation_salary'">
                  {{ formatCurrency(record[column.dataIndex]) }}
                </template>
                <template
                  v-else-if="column.dataIndex === 'start_date' || column.dataIndex === 'end_date' || column.dataIndex === 'pass_probation_date'">
                  {{ formatDate(record[column.dataIndex]) }}
                </template>
                <template v-else-if="column.dataIndex === 'status'">
                  <span :class="[
                    'badge',
                    record.status === true ? 'bg-success' : 'bg-secondary'
                  ]">
                    {{ record.status === true ? 'Active' : 'Inactive' }}
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

  <!-- FIXED: True lazy loading - modals only render when needed -->
  <employment-modal v-if="isEmploymentModalMounted" ref="employmentModal" @employment-added="onEmploymentAdded"
    @modal-closed="handleEmploymentModalClosed" />
  <employment-edit-modal v-if="isEditModalMounted" ref="employmentEditModal" @employment-updated="onEmploymentUpdated"
    @modal-closed="handleEditModalClosed" />

  <!-- Notification Toast - z-index 2000 to appear above modals -->
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 2000">
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
import { defineAsyncComponent, shallowRef, markRaw, ref, computed } from 'vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
// Lazy load Add modal (doesn't need direct method access during load)
const EmploymentModal = defineAsyncComponent({
  loader: () => import('@/components/modal/employment-modal.vue'),
  timeout: 10000,
  onError(error, retry, fail, attempts) {
    console.error('❌ Failed to load EmploymentModal:', error, 'Attempt:', attempts);
    if (attempts <= 2) {
      retry();
    } else {
      fail();
    }
  }
});
// FIXED: Use regular import for Edit modal - defineAsyncComponent wraps component
// and prevents direct method access via refs (Vue 3 limitation)
import EmploymentEditModal from '@/components/modal/employment-edit-modal.vue';
// Funding allocation panel for expandable rows
import EmployeeFundingAllocationPanel from '@/components/panel/EmployeeFundingAllocationPanel.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { employmentService } from '@/services/employment.service';
import moment from 'moment';
import { Modal } from 'ant-design-vue';
import { debounce } from '@/utils/performance.js';
import { usePermissions } from '@/composables/usePermissions';

export default {
  name: 'EmploymentList',
  components: {
    indexBreadcrumb,
    EmploymentModal,
    EmploymentEditModal,
    EmployeeFundingAllocationPanel,
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

    // Expandable rows state - only one row expanded at a time
    const expandedRowKeys = ref([]);

    // Initialize permission checks for employment module
    const {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    } = usePermissions('employment');

    // Initialize permission checks for employee-funding-allocation module
    // Falls back to employment edit permission if allocation-specific permission not granted
    const { canEdit: canEditAllocationsSpecific } = usePermissions('employee-funding-allocation');
    const canEditAllocations = computed(() => canEditAllocationsSpecific.value || canEdit.value);

    return {
      filteredInfo,
      sortedInfo,
      currentPage,
      pageSize,
      total,
      expandedRowKeys,
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass,
      canEditAllocations
    };
  },
  data() {
    return {
      // Static configuration marked as raw for performance
      title: markRaw('Employments'),
      text: markRaw('Employee'),
      text1: markRaw('Employment List'),
      searchStaffId: '',
      notificationTitle: '',
      notificationMessage: '',
      notificationClass: '',

      // Data properties optimized for performance
      employments: shallowRef([]), // Use shallowRef to prevent deep reactivity
      loading: false,
      searchLoading: false,

      // Loading states for individual actions
      editingEmploymentId: null,

      // Performance optimization properties
      lastSearchTerm: '',
      searchDebounceTimer: null,
      filterDebounceTimer: null,
      isComponentDestroyed: false,

      // Cached calculations
      statusCache: new WeakMap(),
      displayCache: new Map(),

      // Preloading flags
      employmentModalPreloaded: false,
      employmentEditModalPreloaded: false,

      // FIXED: True lazy loading flags - modals only mount when needed
      isEmploymentModalMounted: false,
      isEditModalMounted: false,
      openingAddModal: false,
    };
  },
  computed: {
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      // Return cached columns configuration to prevent recreation
      // Column widths optimized for readability without header text wrapping
      return markRaw([
        {
          title: 'Org',
          dataIndex: 'organization',
          key: 'organization',
          width: 90,
          filters: [
            { text: 'SMRU', value: 'SMRU' },
            { text: 'BHF', value: 'BHF' },
          ],
          filteredValue: filtered.organization || null,
          sorter: true,
          sortOrder: sorted.columnKey === 'organization' && sorted.order,
          filterSearch: true
        },
        {
          title: 'Staff ID',
          dataIndex: 'staff_id',
          key: 'staff_id',
          width: 100,
          sorter: true,
          sortOrder: sorted.columnKey === 'staff_id' && sorted.order
        },
        {
          title: 'Employee',
          dataIndex: 'employee_name',
          key: 'employee_name',
          width: 160,
          ellipsis: true,
          sorter: true,
          sortOrder: sorted.columnKey === 'employee_name' && sorted.order
        },
        {
          title: 'Type',
          dataIndex: 'employment_type',
          key: 'employment_type',
          width: 100,
          filters: [
            { text: 'Full-Time', value: 'Full-Time' },
            { text: 'Part-Time', value: 'Part-Time' },
            { text: 'Contract', value: 'Contract' },
            { text: 'Temporary', value: 'Temporary' },
            { text: 'Internship', value: 'Internship' },
          ],
          filteredValue: filtered.employment_type || null,
          sorter: true,
          sortOrder: sorted.columnKey === 'employment_type' && sorted.order,
          filterSearch: true
        },
        {
          title: 'Department',
          dataIndex: 'department',
          key: 'department',
          width: 130,
          ellipsis: true,
          sorter: true,
          sortOrder: sorted.columnKey === 'department' && sorted.order
        },
        {
          title: 'Position',
          dataIndex: 'position',
          key: 'position',
          width: 130,
          ellipsis: true,
          sorter: true,
          sortOrder: sorted.columnKey === 'position' && sorted.order
        },
        {
          title: 'Site',
          dataIndex: 'work_location',
          key: 'work_location',
          width: 100,
          ellipsis: true,
          sorter: true,
          sortOrder: sorted.columnKey === 'work_location' && sorted.order
        },
        {
          title: 'Start Date',
          dataIndex: 'start_date',
          key: 'start_date',
          width: 110,
          sorter: true,
          sortOrder: sorted.columnKey === 'start_date' && sorted.order
        },
        {
          title: 'Pass Prob. Date',
          dataIndex: 'pass_probation_date',
          key: 'pass_probation_date',
          width: 130,
          sorter: true,
          sortOrder: sorted.columnKey === 'pass_probation_date' && sorted.order
        },
        {
          title: 'Salary',
          dataIndex: 'pass_probation_salary',
          key: 'pass_probation_salary',
          width: 120,
          align: 'right',
          sorter: true,
          sortOrder: sorted.columnKey === 'pass_probation_salary' && sorted.order
        },
        {
          title: 'Prob. Salary',
          dataIndex: 'probation_salary',
          key: 'probation_salary',
          width: 120,
          align: 'right',
          sorter: true,
          sortOrder: sorted.columnKey === 'probation_salary' && sorted.order
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 90,
          filters: [
            { text: 'Active', value: true },
            { text: 'Inactive', value: false },
          ],
          filteredValue: filtered.status || null,
          sorter: true,
          sortOrder: sorted.columnKey === 'status' && sorted.order
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          fixed: 'right',
          width: 100
        }
      ]);
    },
    tableData() {
      // Optimized table data computation with caching
      const cacheKey = `${this.employments.length}-${this.currentPage}-${this.pageSize}`;

      if (this.displayCache.has(cacheKey)) {
        return this.displayCache.get(cacheKey);
      }

      const result = this.employments.map(emp => {
        // ✅ Use backend-provided boolean status directly (no calculation needed)
        // Backend manages status based on business logic
        const status = emp.status !== undefined ? emp.status : true; // Default to active if not provided

        return Object.freeze({
          ...emp,
          key: emp.id,
          employee_id: emp.employee_id || emp.employee?.id, // Ensure employee_id is available for allocation panel
          organization: emp.employee?.organization || 'N/A',
          staff_id: emp.employee?.staff_id || 'N/A',
          employee_name: emp.employee ? `${emp.employee.first_name_en || ''} ${emp.employee.last_name_en || ''}`.trim() : 'N/A',
          employment_type: emp.employment_type,
          department: emp.department?.name || 'N/A',
          position: emp.position?.title || 'N/A',
          // Use site field from backend (work_location is alias for backward compatibility)
          work_location: emp.site?.name || emp.work_location?.name || 'N/A',
          start_date: emp.start_date,
          pass_probation_salary: emp.pass_probation_salary,
          probation_salary: emp.probation_salary,
          status: status, // Boolean from backend: true = Active, false = Inactive
        });
      });

      // Cache the result
      this.displayCache.set(cacheKey, result);
      return result;
    }
  },
  mounted() {
    this.fetchEmployments();

    // Setup performance optimizations
    this.setupPerformanceOptimizations();
  },

  beforeUnmount() {
    // Critical cleanup to prevent memory leaks
    this.isComponentDestroyed = true;

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    if (this.filterDebounceTimer) {
      clearTimeout(this.filterDebounceTimer);
    }

    // Clear caches
    this.statusCache = null;
    this.displayCache.clear();
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
        if (this.filteredInfo.organization && this.filteredInfo.organization.length > 0) {
          params.filter_organization = this.filteredInfo.organization.join(',');
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

    // OPTIMIZED TABLE CHANGE HANDLER with debouncing
    handleTableChange(pagination, filters, sorter) {
      console.log('Table change (sorting/filtering):', filters, sorter);

      // Early return if component is destroyed
      if (this.isComponentDestroyed) return;

      // Check if there's actually a meaningful change
      const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(this.filteredInfo);
      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.sortedInfo);

      // Only proceed if there's an actual filter or sort change
      if (!hasFilterChange && !hasSorterChange) {
        console.log('No meaningful change detected, skipping reload');
        return;
      }

      // Clear previous debounce timer
      if (this.filterDebounceTimer) {
        clearTimeout(this.filterDebounceTimer);
      }

      // Show loading state immediately for better UX
      this.loading = true;

      // Debounce the actual filter/sort operation
      this.filterDebounceTimer = setTimeout(() => {
        if (this.isComponentDestroyed) return;

        // Update filter and sort state
        this.filteredInfo = filters;
        this.sortedInfo = sorter;

        // Reset to first page when filter/sort changes
        this.currentPage = 1;

        // Clear cache when filters change
        this.displayCache.clear();
        this.statusCache = new WeakMap();

        // Build complete parameters
        const params = this.buildApiParams({
          page: 1,
          per_page: this.pageSize
        });

        // Fetch employments with new parameters
        this.fetchEmployments(params);
      }, 300); // 300ms debounce
    },

    // Map frontend table field names to backend field names
    mapSortField(field) {
      const fieldMapping = {
        'staff_id': 'staff_id',
        'employee_name': 'employee_name',
        'employment_type': 'employment_type',
        'department': 'department',
        'position': 'position',
        'work_location': 'work_location',
        'start_date': 'start_date',
        'probation_salary': 'probation_salary',
        'pass_probation_salary': 'pass_probation_salary',
        'organization': 'organization'
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

    // OPTIMIZED SEARCH with debouncing
    async handleStaffIdSearch() {
      const searchTerm = this.searchStaffId?.trim() || '';

      // Validation: Check if search input is empty
      if (!searchTerm) {
        this.$message.warning('Please enter a staff ID to search');
        return;
      }

      // Avoid duplicate searches
      if (searchTerm === this.lastSearchTerm) {
        return;
      }

      this.lastSearchTerm = searchTerm;
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
            employee_id: emp.employee_id,
            employment_type: emp.employment_type,
            // Map site to work_location for backward compatibility
            site: emp.site,
            work_location: emp.site,
            start_date: emp.start_date,
            pass_probation_salary: emp.pass_probation_salary,
            pass_probation_date: emp.pass_probation_date,
            probation_salary: emp.probation_salary,
            department: emp.department,
            position: emp.position,
            status: emp.status,
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
      // Early return if component is destroyed
      if (this.isComponentDestroyed) return;

      this.loading = true;

      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };

        const response = await employmentService.getAllEmployments(queryParams);

        // Check if component was destroyed during request
        if (this.isComponentDestroyed) return;

        if (response.success && response.data) {
          // Use Object.freeze to prevent Vue from making data reactive
          // This significantly improves performance with large datasets
          const processedData = response.data.map(emp => Object.freeze({
            // Map employment data structure
            id: emp.id,
            employee: Object.freeze(emp.employee || {}),
            employee_id: emp.employee_id,
            employment_type: emp.employment_type,
            // Map site to work_location for backward compatibility
            site: Object.freeze(emp.site || {}),
            work_location: Object.freeze(emp.site || {}),
            start_date: emp.start_date,
            pass_probation_date: emp.pass_probation_date,
            pass_probation_salary: emp.pass_probation_salary,
            probation_salary: emp.probation_salary,
            // Map separate department and position objects
            department: Object.freeze(emp.department || {}),
            position: Object.freeze(emp.position || {}),
            status: emp.status,
            // Keep original object for editing
            ...emp
          }));

          // Update employments with batch operation
          this.employments = processedData;

          // Clear caches when new data arrives
          this.displayCache.clear();
          this.statusCache = new WeakMap();

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
        if (!this.isComponentDestroyed) {
          this.employments = [];
          this.total = 0;
          this.$message.error('Failed to load employments');
        }
      } finally {
        if (!this.isComponentDestroyed) {
          this.loading = false;
        }
      }
    },

    // Calculate employment status based on start_date and end_date
    // ⚠️ DEPRECATED: Backend now provides boolean status field directly
    // This method is kept for backward compatibility but is no longer used
    calculateEmploymentStatus(startDate, endDate) {
      // Backend returns boolean: true = Active, false = Inactive
      // Status is managed on backend based on business logic
      console.warn('⚠️ calculateEmploymentStatus is deprecated. Use backend status field directly.');

      if (!startDate) {
        return false; // Inactive if no start date
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

      // Future start date = Inactive
      if (start > today) {
        return false;
      }

      // Has end date and past end date = Inactive
      if (end && end < today) {
        return false;
      }

      // Currently active
      return true;
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

    // Handle row expand/collapse - only one row expanded at a time
    handleRowExpand(expanded, record) {
      if (expanded) {
        // Collapse any previously expanded row, expand new one
        this.expandedRowKeys = [record.id];
      } else {
        // Collapse the current row
        this.expandedRowKeys = [];
      }
    },

    // Handle allocation changes from the panel
    onAllocationChanged() {
      // Optionally refresh the employment list or show notification
      console.log('Allocation changed, data may need refresh');
      // Note: We don't need to refresh the full list since allocations
      // are loaded separately in the expanded panel
    },

    // FIXED: True lazy loading - mount modal component only when needed
    async openAddEmploymentModal() {
      try {
        this.openingAddModal = true;
        // Ensure async component chunk is loaded (handles first-click cold load)
        if (!this.employmentModalPreloaded) {
          try {
            await import('@/components/modal/employment-modal.vue');
            this.employmentModalPreloaded = true;
          } catch (e) {
            // ignore preload error; we'll still attempt to mount
          }
        }

        if (!this.isEmploymentModalMounted) {
          this.isEmploymentModalMounted = true;
          await this.$nextTick();
        }
        // On first mount with async component, ref may not be ready immediately; wait briefly
        let attempts = 0;
        while (
          (!this.$refs.employmentModal || typeof this.$refs.employmentModal.openModal !== 'function') &&
          attempts < 40
        ) {
          await new Promise(resolve => setTimeout(resolve, 25));
          attempts++;
        }

        if (this.$refs.employmentModal && typeof this.$refs.employmentModal.openModal === 'function') {
          await this.$refs.employmentModal.openModal();
        } else {
          this.$message && this.$message.warning && this.$message.warning('Form is loading, please try again.');
        }
      } catch (error) {
        console.error('Error opening Add Employment modal:', error);
        this.$message.error('Failed to open employment form');
      } finally {
        this.openingAddModal = false;
      }
    },

    async openEditEmploymentModal(record) {
      console.log('Opening edit modal for employment:', record.id);

      try {
        // Show loading state on the specific edit button
        this.editingEmploymentId = record.id;

        // Ensure async component chunk is loaded (handles first-click cold load)
        if (!this.employmentEditModalPreloaded) {
          try {
            await import('@/components/modal/employment-edit-modal.vue');
            this.employmentEditModalPreloaded = true;
          } catch (e) {
            // ignore preload error; we'll still attempt to mount
          }
        }

        // Mount the edit modal component if not already mounted
        if (!this.isEditModalMounted) {
          this.isEditModalMounted = true;
          await this.$nextTick();
        }

        // With regular import (not defineAsyncComponent), ref should be ready immediately
        // Just wait one tick for Vue to update the DOM
        await this.$nextTick();

        // Fetch complete employment details with all related data
        const response = await employmentService.getEmploymentById(record.id);

        if (response.success && response.data) {
          console.log('Employment details loaded:', response.data);

          const modalRef = this.$refs.employmentEditModal;
          if (modalRef && typeof modalRef.openModal === 'function') {
            // Set the employment data to the edit modal
            modalRef.employmentData = response.data;
            
            // Wait for next tick to ensure component is fully rendered
            await this.$nextTick();
            
            // Open the modal
            console.log('🚀 Opening employment edit modal...');
            await modalRef.openModal();
          } else {
            console.error('❌ Modal ref not ready:', {
              ref: modalRef,
              refType: typeof modalRef,
              hasOpenModal: modalRef ? typeof modalRef.openModal : 'undefined'
            });
            this.$message && this.$message.warning && this.$message.warning('Edit form is not available. Please refresh the page.');
          }
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
    // PERFORMANCE OPTIMIZATION SETUP
    setupPerformanceOptimizations() {
      // Create debounced search function
      this.debouncedSearch = debounce(this.performSearch, 300);

      // Setup intersection observer for lazy loading if needed
      this.setupIntersectionObserver();
    },

    setupIntersectionObserver() {
      // Future enhancement for infinite scroll
      if ('IntersectionObserver' in window) {
        // Implementation for future virtual scrolling
      }
    },

    performSearch() {
      if (this.isComponentDestroyed) return;
      this.handleStaffIdSearch();
    },

    // OPTIMIZED EVENT HANDLERS
    onEmploymentAdded(result) {
      console.log('Employment added:', result);
      if (this.isComponentDestroyed) return;

      if (result.success) {
        this.$message.success(result.message || 'Employment added successfully');
        // Clear caches before refresh
        this.displayCache.clear();
        this.statusCache = new WeakMap();
        // Refresh the employments list to show the new employment
        this.fetchEmployments();
      } else {
        this.$message.error(result.message || 'Failed to add employment');
      }
    },

    onEmploymentUpdated(result) {
      console.log('Employment updated:', result);
      if (this.isComponentDestroyed) return;

      if (result.success) {
        this.$message.success(result.message || 'Employment updated successfully');
        // Clear caches before refresh
        this.displayCache.clear();
        this.statusCache = new WeakMap();
        // Refresh the employments list to show the updated employment
        this.fetchEmployments();
      } else {
        this.$message.error(result.message || 'Failed to update employment');
      }
    },

    // PRELOADING METHODS FOR BETTER PERCEIVED PERFORMANCE
    async preloadEmploymentModal() {
      if (this.employmentModalPreloaded) return;

      try {
        // Dynamically import the modal component to start loading it
        await import('@/components/modal/employment-modal.vue');
        this.employmentModalPreloaded = true;
        console.log('📦 Employment modal preloaded on hover');
      } catch (error) {
        console.warn('Failed to preload employment modal:', error);
      }
    },

    async preloadEmploymentEditModal() {
      if (this.employmentEditModalPreloaded) return;

      try {
        // Dynamically import the edit modal component
        await import('@/components/modal/employment-edit-modal.vue');
        this.employmentEditModalPreloaded = true;
        console.log('📦 Employment edit modal preloaded on hover');
      } catch (error) {
        console.warn('Failed to preload employment edit modal:', error);
      }
    },

    // FIXED: Modal close handlers to unmount components for memory efficiency
    handleEmploymentModalClosed() {
      this.isEmploymentModalMounted = false;
      console.log('📦 Employment modal unmounted to free memory');
    },

    handleEditModalClosed() {
      this.isEditModalMounted = false;
      console.log('📦 Employment edit modal unmounted to free memory');
    },

    // Action Change Modal Handler
    openActionChangeModal() {
      console.log('Opening Action Change modal');
      // TODO: Implement action change modal functionality
      this.$message.info('Action Change functionality will be implemented soon');
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
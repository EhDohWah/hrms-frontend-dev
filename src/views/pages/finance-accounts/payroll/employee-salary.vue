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
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown">
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                      class="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                      class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="mb-2">
            <button type="button" class="btn btn-primary d-flex align-items-center" data-bs-toggle="modal"
              data-bs-target="#bulk-payroll-modal">
              <i class="ti ti-cash-banknote me-2"></i>Bulk Payroll Creation
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
          <h5>Employee Salary List</h5>
          <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
            <div class="me-3">
              <div class="input-icon-end position-relative">
                <input type="text" class="form-control" v-model="searchQuery" placeholder="Search employees..."
                  @input="handleSearch" />
                <span class="input-icon-addon">
                  <i class="ti ti-search"></i>
                </span>
              </div>
            </div>
            <div class="me-3">
              <div class="input-icon-end position-relative">
                <input type="text" class="form-control date-range bookingrange" ref="dateRangeInput"
                  placeholder="dd/mm/yyyy - dd/mm/yyyy" />
                <span class="input-icon-addon">
                  <i class="ti ti-chevron-down"></i>
                </span>
              </div>
            </div>
            <!-- Subsidiary Filter -->
            <div class="dropdown me-3">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown">
                {{ selectedSubsidiary || 'All Subsidiaries' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    @click="selectedSubsidiary = null; handleFilterChange()">
                    All Subsidiaries
                  </a>
                </li>
                <li v-for="subsidiary in availableSubsidiaries" :key="subsidiary">
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    @click="selectedSubsidiary = subsidiary; handleFilterChange()">
                    {{ subsidiary }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- Department Filter -->
            <div class="dropdown me-3">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown">
                {{ selectedDepartment || 'All Departments' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    @click="selectedDepartment = null; handleFilterChange()">
                    All Departments
                  </a>
                </li>
                <li v-for="department in availableDepartments" :key="department">
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    @click="selectedDepartment = department; handleFilterChange()">
                    {{ department }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- Sort Filter -->
            <div class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown">
                Sort By : {{ currentSortLabel }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li v-for="option in sortOptions" :key="option.key">
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    @click="selectedSortBy = option.key; handleFilterChange()"
                    :class="{ 'active': selectedSortBy === option.key }">
                    {{ option.label }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <!-- Loading State -->
          <div v-if="loading" class="text-center p-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading payroll data...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="alert alert-danger m-3" role="alert">
            <i class="ti ti-alert-circle me-2"></i>
            {{ error }}
            <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="fetchPayrolls">
              <i class="ti ti-refresh me-1"></i>Retry
            </button>
          </div>

          <!-- Data Table -->
          <div v-else class="resize-observer-fix">
            <div class="table-responsive">
              <a-table class="table datatable thead-light" :columns="columns" :data-source="tableData"
                :row-selection="rowSelection" :pagination="false" :loading="loading" :scroll="{ x: 'max-content' }"
                @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'subsidiary'">
                    <span :class="[
                      'badge badge-sm fw-normal',
                      record.subsidiary === 'SMRU' ? 'badge-primary' :
                        record.subsidiary === 'BHF' ? 'badge-soft-primary fw-bold' :
                          'badge-secondary'
                    ]">
                      {{ record.subsidiary }}
                    </span>
                  </template>

                  <template v-if="column.key === 'employeeName'">
                    <div class="d-flex align-items-center file-name-icon">
                      <a href="javascript:void(0);" class="avatar avatar-md">
                        <img :src="require(`@/assets/img/users/${record.Image}`)" class="img-fluid rounded-circle"
                          alt="img" />
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <a href="javascript:void(0);">{{ record.employeeName }}</a>
                        </h6>
                        <span class="d-block mt-1">{{ record.department }}</span>
                      </div>
                    </div>
                  </template>

                  <template v-if="column.key === 'department'">
                    <span class="text-muted">{{ record.department }}</span>
                  </template>

                  <template v-if="column.key === 'position'">
                    <span class="text-muted">{{ record.position }}</span>
                  </template>

                  <template v-if="column.key === 'funding_sources'">
                    <span :class="[
                      'badge badge-sm fw-normal',
                      record.allocation_type === 'grant' ? 'badge-success' :
                        record.allocation_type === 'org_funded' ? 'badge-info' :
                          'badge-secondary'
                    ]">
                      {{ record.funding_sources }}
                    </span>
                  </template>

                  <template v-if="column.key === 'level_of_effort'">
                    <span class="text-primary fw-medium">{{ (parseFloat(record.level_of_effort) * 100).toFixed(0)
                      }}%</span>
                  </template>

                  <template v-if="column.key === 'pay_period_date'">
                    <span class="text-muted">{{ formatDate(record.pay_period_date) }}</span>
                  </template>

                  <template v-if="column.key === 'payslip'">
                    <div>
                      <span class="badge badge-dark badge-md">{{ record.payslip }}</span>
                    </div>
                  </template>

                  <template v-if="column.key === 'action'">
                    <div class="action-icon d-inline-flex">
                      <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal"
                        data-bs-target="#view-employee-salary" :title="`View ${record.employeeName} salary details`"><i
                          class="ti ti-eye"></i></a>
                      <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal"
                        data-bs-target="#edit-employee-salary" :title="`Edit ${record.employeeName} salary`"><i
                          class="ti ti-edit"></i></a>
                      <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"
                        :title="`Delete ${record.employeeName} salary record`"><i class="ti ti-trash"></i></a>
                    </div>
                  </template>
                </template>

                <!-- Empty State -->
                <template #emptyText>
                  <div class="text-center p-4">
                    <i class="ti ti-database-off display-4 text-muted"></i>
                    <h5 class="mt-3">No Payroll Records Found</h5>
                    <p class="text-muted">
                      {{ emptyStateMessage }}
                    </p>
                    <button v-if="searchQuery" type="button" class="btn btn-outline-primary" @click="clearFilters">
                      <i class="ti ti-filter-off me-1"></i>Clear Filters
                    </button>
                  </div>
                </template>
              </a-table>
            </div>

            <!-- SEPARATE PAGINATION COMPONENT -->
            <div class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info">
                  <!-- Optional: Additional info can go here -->
                </div>
                <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="total"
                  :show-size-changer="true" :show-quick-jumper="true" :page-size-options="['10', '20', '50', '100']"
                  :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                  @change="handlePaginationChange" @show-size-change="handlePageSizeChange" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <layout-footer></layout-footer>
  </div>
  <!-- /Page Wrapper -->
  <bulk-payroll-modal @refresh="fetchPayrolls" @payroll-created="handlePayrollCreated"></bulk-payroll-modal>
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { payrollService } from '@/services/payroll.service';
import { useLookupStore } from "@/stores/lookupStore";
import { useSharedDataStore } from "@/stores/sharedDataStore";

// Import Bootstrap or use global Bootstrap if available
let bootstrap;
try {
  bootstrap = require('bootstrap');
} catch (e) {
  // Fallback to global Bootstrap
  bootstrap = window.bootstrap || {};
}

// Helper function to parse currency strings for sorting
const parseCurrency = (value) => {
  if (!value || typeof value !== 'string') return 0;
  return parseFloat(value.replace(/[$,฿]/g, '')) || 0;
};

// Helper function to format currency
const formatCurrency = (value) => {
  if (!value) return '฿0.00';
  return `฿${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

import BulkPayrollModal from '@/components/modal/bulk-payroll-modal.vue';

export default {
  name: 'EmployeeSalary',
  components: {
    BulkPayrollModal,
  },
  data() {
    return {
      // Page metadata
      title: "Employee Salary",
      text: "HR",
      text1: "Employee Salary",

      // Reactive state
      payrolls: [],
      loading: false,
      error: null,

      // Search and filters
      searchQuery: "",
      selectedSubsidiary: null,
      selectedDepartment: null,
      selectedDateRange: null,
      selectedSortBy: 'created_at',
      selectedSortOrder: 'desc',

      // Pagination
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // Table selection
      selectedRowKeys: [],

      // Available filter options (will be populated from lookup data)
      availableSubsidiaries: [],
      availableDepartments: [],
      subsidiaries: [],
      departments: [],

      // Sort options
      sortOptions: [
        { key: 'created_at', label: 'Recently Added' },
        { key: 'employee_name', label: 'Employee Name' },
        { key: 'staff_id', label: 'Staff ID' },
        { key: 'basic_salary', label: 'Basic Salary' },
        { key: 'subsidiary', label: 'Subsidiary' },
        { key: 'department', label: 'Department' },
        { key: 'last_7_days', label: 'Last 7 Days' },
        { key: 'last_month', label: 'Last Month' },
      ],
    };
  },

  computed: {
    // Dynamic table columns based on API response structure
    columns() {
      return [
        {
          title: 'Subsidiary',
          dataIndex: 'subsidiary',
          key: 'subsidiary',
          fixed: 'left',
          sorter: false, // Server-side sorting
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Department',
          dataIndex: 'department',
          key: 'department',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Position',
          dataIndex: 'position',
          key: 'position',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Staff ID',
          dataIndex: 'staff_id',
          key: 'staff_id',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Employee Name',
          dataIndex: 'employeeName',
          key: 'employeeName',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Gross Salary',
          dataIndex: 'basic_salary',
          key: 'basic_salary',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Total Income',
          dataIndex: 'taxableIncome',
          key: 'taxableIncome',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Total Deductions',
          dataIndex: 'total_deduction',
          key: 'total_deduction',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Net Salary',
          dataIndex: 'net_paid',
          key: 'net_paid',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Funding Type',
          dataIndex: 'funding_sources',
          key: 'funding_sources',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'LOE',
          dataIndex: 'level_of_effort',
          key: 'level_of_effort',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Pay Period',
          dataIndex: 'pay_period_date',
          key: 'pay_period_date',
          sorter: false,
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Actions',
          key: 'action',
          fixed: 'right',
        },
      ];
    },

    // Map API data to table format
    tableData() {
      return this.payrolls.map(payroll => ({
        key: payroll.id,
        id: payroll.id,
        subsidiary: payroll.employment?.employee?.subsidiary || 'N/A',
        staff_id: payroll.employment?.employee?.staff_id || 'N/A',
        employeeName: this.getEmployeeName(payroll),
        department: payroll.employment?.department?.name || 'N/A',
        position: payroll.employment?.position?.title || 'N/A',
        basic_salary: formatCurrency(payroll.gross_salary),
        funding_sources: this.getFundingSources(payroll),
        payslip: 'Generate Slip',
        Image: this.getEmployeeImage(payroll),
        // Additional fields for compatibility
        taxableIncome: formatCurrency(payroll.total_income),
        net_paid: formatCurrency(payroll.net_salary),
        pay_period_date: payroll.pay_period_date,
        // Additional fields from API response
        employment_id: payroll.employment_id,
        employee_funding_allocation_id: payroll.employee_funding_allocation_id,
        total_deduction: formatCurrency(payroll.total_deduction),
        allocation_type: payroll.employee_funding_allocation?.allocation_type || 'N/A',
        level_of_effort: payroll.employee_funding_allocation?.level_of_effort || 'N/A',
      }));
    },

    // Row selection configuration
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
        },
        onSelect: (record, selected, selectedRows) => {
          console.log('Selected row:', record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log('Select all:', selected, selectedRows, changeRows);
        },
      };
    },

    // Current sort label
    currentSortLabel() {
      const option = this.sortOptions.find(opt => opt.key === this.selectedSortBy);
      return option ? option.label : 'Recently Added';
    },

    // Empty state message
    emptyStateMessage() {
      return this.searchQuery
        ? 'No records match your search criteria.'
        : 'There are no payroll records to display.';
    },
  },

  async mounted() {
    // Initialize Bootstrap components after Vue component is mounted
    await this.$nextTick();
    this.initializeBootstrapComponents();
    this.initializeDateRangePicker();

    // Load lookup and department data
    await this.initializeFilterData();

    // Fetch initial data
    await this.fetchPayrolls();
  },

  methods: {
    // =================== API METHODS ===================

    // Build API parameters from current state
    buildApiParams() {
      // Ensure 1-based pagination and valid sizes
      const current = Number(this.currentPage) || 1;
      const perPage = Number(this.pageSize) || 10;
      const params = {
        page: current < 1 ? 1 : current,
        per_page: perPage < 1 ? 10 : perPage,
      };

      // Add search parameter
      if (this.searchQuery?.trim()) {
        params.search = this.searchQuery.trim();
      }

      // Add filter parameters
      if (this.selectedSubsidiary) {
        params.filter_subsidiary = this.selectedSubsidiary;
      }

      if (this.selectedDepartment) {
        params.filter_department = this.selectedDepartment;
      }

      if (this.selectedDateRange) {
        params.filter_date_range = this.selectedDateRange;
      }

      // Add sorting parameters
      if (this.selectedSortBy) {
        params.sort_by = this.selectedSortBy;
        params.sort_order = this.selectedSortOrder;
      }

      return params;
    },

    // Fetch payrolls from API
    async fetchPayrolls() {
      this.loading = true;
      this.error = null;

      try {
        const params = this.buildApiParams();
        const response = await payrollService.getPayrolls(params);

        if (response.success) {
          this.payrolls = response.data || [];

          // Update pagination info from API response
          if (response.pagination) {
            this.currentPage = response.pagination.current_page || 1;
            this.pageSize = response.pagination.per_page || 10;
            this.total = response.pagination.total || 0;
          }

          // Update available filter options if provided
          if (response.filters && response.filters.available_options) {
            this.updateFilterOptions(response.filters.available_options);
          }
        } else {
          throw new Error(response.message || 'Failed to fetch payrolls');
        }
      } catch (error) {
        console.error('Error fetching payrolls:', error);
        this.error = error.message || 'An error occurred while fetching payrolls';
        this.payrolls = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    // Search payrolls by staff ID
    async handleStaffIdSearch(staffId) {
      this.loading = true;
      this.error = null;

      try {
        const params = {
          staff_id: staffId,
          page: 1,
          per_page: this.pageSize,
        };

        const response = await payrollService.searchPayrolls(params);

        if (response.success) {
          this.payrolls = response.data || [];
          this.currentPage = 1;

          if (response.pagination) {
            this.total = response.pagination.total;
          }
        } else {
          throw new Error(response.message || 'No payrolls found for this staff ID');
        }
      } catch (error) {
        console.error('Error searching payrolls:', error);
        this.error = error.message || 'An error occurred while searching payrolls';
        this.payrolls = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    // =================== EVENT HANDLERS ===================

    // Handle pagination change
    handlePaginationChange(page, pageSize) {
      this.currentPage = Number(page) > 0 ? Number(page) : 1;
      this.pageSize = Number(pageSize) > 0 ? Number(pageSize) : this.pageSize;
      this.fetchPayrolls();
    },

    // Handle page size change
    handlePageSizeChange(current, size) {
      this.currentPage = 1; // Reset to first page when changing page size
      this.pageSize = size;
      this.fetchPayrolls();
    },

    // Handle table sorting and filtering changes
    handleTableChange(pagination, filters, sorter) {
      // Update pagination
      if (pagination) {
        const nextPage = Number(pagination.current);
        const nextSize = Number(pagination.pageSize);
        this.currentPage = nextPage > 0 ? nextPage : 1;
        this.pageSize = nextSize > 0 ? nextSize : this.pageSize;
      }

      // Update sorting
      if (sorter && sorter.field) {
        this.selectedSortBy = sorter.field;
        this.selectedSortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
      }

      // Fetch updated data
      this.fetchPayrolls();
    },

    // Handle search input
    async handleSearch() {
      // Reset to first page when searching
      this.currentPage = 1;
      await this.fetchPayrolls();
    },

    // Handle filter changes
    async handleFilterChange() {
      this.currentPage = 1; // Reset to first page
      await this.fetchPayrolls();
    },

    // Clear all filters
    async clearFilters() {
      this.searchQuery = "";
      this.selectedSubsidiary = null;
      this.selectedDepartment = null;
      this.selectedDateRange = null;
      this.selectedSortBy = 'created_at';
      this.selectedSortOrder = 'desc';
      this.currentPage = 1;

      await this.fetchPayrolls();
    },

    // =================== DATA TRANSFORMATION METHODS ===================

    // Get formatted employee name
    getEmployeeName(payroll) {
      if (payroll.employment?.employee) {
        const firstName = payroll.employment.employee.first_name_en || '';
        const lastName = payroll.employment.employee.last_name_en || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
      }
      return 'N/A';
    },

    // Get department and position
    getDepartmentPosition(payroll) {
      const dept = payroll.employment?.department?.name || '';
      const pos = payroll.employment?.position?.title || '';
      return dept && pos ? `${dept}/${pos}` : dept || pos || 'N/A';
    },

    // Get funding sources from employee funding allocation
    getFundingSources(payroll) {
      if (payroll.employee_funding_allocation) {
        const allocation = payroll.employee_funding_allocation;
        if (allocation.allocation_type === 'org_funded') {
          return 'Organization Funded';
        } else if (allocation.allocation_type === 'grant') {
          return 'Grant Funded';
        }
        return allocation.allocation_type;
      }
      return 'General Fund';
    },

    // Get employee image
    getEmployeeImage(payroll) {
      // Return a default image or map from employee data
      return 'user-32.jpg';
    },

    // Format date for display
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    // Update filter options from API response
    updateFilterOptions(options) {
      if (options.subsidiaries) {
        this.availableSubsidiaries = options.subsidiaries;
      }
      if (options.departments) {
        this.availableDepartments = options.departments;
      }
    },

    // =================== UI METHODS ===================

    initializeBootstrapComponents() {
      try {
        // Check if Bootstrap is available
        const Bootstrap = window.bootstrap || bootstrap;

        if (Bootstrap && Bootstrap.Dropdown) {
          // Initialize all dropdowns
          const dropdownElementList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
          dropdownElementList.forEach(dropdownToggleEl => {
            if (!Bootstrap.Dropdown.getInstance(dropdownToggleEl)) {
              new Bootstrap.Dropdown(dropdownToggleEl);
            }
          });
        }

        if (Bootstrap && Bootstrap.Tooltip) {
          // Initialize all tooltips
          const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
          tooltipTriggerList.forEach(tooltipTriggerEl => {
            if (!Bootstrap.Tooltip.getInstance(tooltipTriggerEl)) {
              new Bootstrap.Tooltip(tooltipTriggerEl);
            }
          });
        }
      } catch (error) {
        console.warn('Bootstrap initialization failed:', error);
        // Fallback: Try to manually trigger dropdowns using jQuery if available
        if (window.$ && window.$.fn.dropdown) {
          window.$('[data-bs-toggle="dropdown"]').dropdown();
        }
      }
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    initializeDateRangePicker() {
      const dateRangeInput = this.$refs.dateRangeInput;

      if (dateRangeInput) {
        const start = moment().subtract(6, "days");
        const end = moment();

        const booking_range = (start, end) => {
          return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
        };

        new DateRangePicker(
          dateRangeInput,
          {
            startDate: start,
            endDate: end,
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              "Last 7 Days": [moment().subtract(6, "days"), moment()],
              "Last 30 Days": [moment().subtract(29, "days"), moment()],
              "This Month": [moment().startOf("month"), moment().endOf("month")],
              "Last Month": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
              ],
            },
          },
          booking_range
        );

        // Handle date range selection
        dateRangeInput.addEventListener('apply.daterangepicker', (ev, picker) => {
          const startDate = picker.startDate.format('YYYY-MM-DD');
          const endDate = picker.endDate.format('YYYY-MM-DD');
          this.selectedDateRange = `${startDate},${endDate}`;
          this.handleFilterChange();
        });
      }
    },

    // =================== LOOKUP AND DEPARTMENT DATA METHODS ===================

    // Initialize filter data from lookups and department positions
    async initializeFilterData() {
      await this.initSubsidiaries();
      await this.initDepartments();
    },

    // Get subsidiary data from lookups
    async fetchSubsidiaries() {
      try {
        const lookupStore = useLookupStore();
        const subsidiaries = lookupStore.getLookupsByType('subsidiary');
        return subsidiaries || [];
      } catch (error) {
        console.error('Error fetching subsidiaries:', error);
        return [];
      }
    },

    // Initialize subsidiary data
    async initSubsidiaries() {
      const lookupStore = useLookupStore();
      // If lookups aren't loaded yet, fetch them first
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookupLists();
      }
      this.subsidiaries = lookupStore.getLookupsByType('subsidiary');
      this.availableSubsidiaries = this.subsidiaries.map(sub => sub.value).filter(Boolean);
    },

    // Get departments from shared data store
    async fetchDepartments() {
      try {
        const sharedStore = useSharedDataStore();
        return await sharedStore.fetchDepartments(false, {});
      } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
      }
    },

    // Initialize department data
    async initDepartments() {
      const sharedStore = useSharedDataStore();
      // If departments aren't loaded yet, fetch them first
      if (!sharedStore.isDepartmentsLoaded) {
        await sharedStore.fetchDepartments(false, {});
      }
      this.departments = sharedStore.getDepartments || [];
      this.availableDepartments = this.departments.map(dept => dept.name).filter(Boolean);
    },

    // Handle payroll created event from modal
    handlePayrollCreated(data) {
      console.log('Payroll created:', data);
      // Refresh the payroll list
      this.fetchPayrolls();
    },
  },

  // Expose refs for template access
  setup() {
    const dateRangeInput = ref(null);

    return {
      dateRangeInput,
    };
  },
};
</script>

<style scoped>
:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  min-width: 80px;
}

/* Ensure dropdown menus are properly positioned and visible */
.dropdown-menu {
  z-index: 1050;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #dee2e6 transparent;
}

/* Custom scrollbar styling for webkit browsers */
.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background-color: #dee2e6;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background-color: #adb5bd;
}

/* Ensure dropdowns work properly with Bootstrap */
.dropdown.show .dropdown-menu {
  display: block;
}

/* Loading spinner styling */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Active dropdown item styling */
.dropdown-item.active {
  background-color: #0d6efd;
  color: #fff;
}

/* Dropdown item hover and focus styling */
.dropdown-item:hover,
.dropdown-item:focus {
  background-color: #f8f9fa;
  color: #495057;
  transition: background-color 0.15s ease-in-out;
}

/* Ensure dropdown items have consistent padding */
.dropdown-item {
  padding: 0.5rem 1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* Empty state styling */
.display-4 {
  font-size: 3rem;
  opacity: 0.5;
}

/* Error state styling */
.alert {
  border-radius: 0.5rem;
}

/* Table loading overlay */
.ant-table-loading .ant-spin-nested-loading>div>.ant-spin {
  max-height: none;
}

/* Pagination styling */
.ant-pagination {
  margin: 1rem;
  text-align: center;
}

/* Badge styling for subsidiaries */
.badge-primary {
  background-color: #0d6efd;
}

.badge-soft-primary {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.badge-secondary {
  background-color: #6c757d;
}

/* Filter button styling */
.btn-white {
  background-color: #fff;
  border-color: #dee2e6;
  color: #495057;
}

.btn-white:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
}

/* Responsive table improvements */
@media (max-width: 768px) {
  .custom-datatable-filter {
    overflow-x: auto;
  }

  .d-flex.flex-wrap {
    flex-direction: column;
  }

  .me-3 {
    margin-bottom: 0.5rem;
  }
}

/* Action icons styling */
.action-icon a {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.action-icon a:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Pagination wrapper styling - FIXED POSITION */
.pagination-wrapper {
  margin-top: 20px;
  padding: 20px 16px;
  border-top: 1px solid #e8e8e8;
  position: relative;
  z-index: 100;
  background-color: #fff;
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
</style>

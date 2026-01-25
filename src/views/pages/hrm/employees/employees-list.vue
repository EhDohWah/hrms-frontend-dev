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
          <!-- Add Employee Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddEmployeeModal"
              :disabled="openingAddEmployee">
              <template v-if="openingAddEmployee">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading form...
              </template>
              <template v-else>
                <i class="ti ti-circle-plus me-2"></i>Add New Employee
              </template>
            </button>
          </div>
          <!-- Delete Selected Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-danger d-flex align-items-center" @click="confirmDeleteSelectedEmployees"
              :class="{ 'disabled': selectedRowKeys.length === 0 }">
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

      <!-- Employee Statistics -->
      <div class="row statistics-row">
        <!-- SMRU Employees -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-primary rounded-circle">SMRU</span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">SMRU Employees</p>
                  <h4>{{ statistics.organizationCount.SMRU_count }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-purple badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((statistics.activeCount / statistics.totalEmployees) * 100).toFixed(1) }}% Active
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /SMRU Employees -->

        <!-- BHF Employees -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg rounded-circle" style="background-color: #3157a5 !important;">BHF</span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">BHF Employees</p>
                  <h4>{{ statistics.organizationCount.BHF_count }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-primary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((statistics.activeCount / statistics.totalEmployees) * 100).toFixed(1) }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /BHF Employees -->

        <!-- New Joiners -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-success rounded-circle"><i class="ti ti-user-plus"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">New Joiners</p>
                  <h4>{{ statistics.newJoinerCount }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-secondary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((statistics.newJoinerCount / statistics.totalEmployees) * 100).toFixed(1) }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /New Joiners -->

        <!-- Resigned Employees -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-danger rounded-circle"><i class="ti ti-user-pause"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Resigned</p>
                  <h4>{{ statistics.inactiveCount }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-dark badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((statistics.inactiveCount / statistics.totalEmployees) * 100).toFixed(1) }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Resigned Employees -->
      </div>
      <!-- /Employee Statistics -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Employee List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <!-- Filter Dropdowns -->
            <div class="me-2">
              <a-select v-model:value="filterOrganization" placeholder="Organization" style="width: 150px;" allow-clear
                @change="handleFilterChange">
                <a-select-option value="SMRU">SMRU</a-select-option>
                <a-select-option value="BHF">BHF</a-select-option>
              </a-select>
            </div>
            <div class="me-2">
              <a-select v-model:value="filterStatus" placeholder="Status" style="width: 150px;" allow-clear
                @change="handleFilterChange">
                <a-select-option value="Expats">Expats</a-select-option>
                <a-select-option value="Local ID">Local ID</a-select-option>
                <a-select-option value="Local non ID">Local non ID</a-select-option>
              </a-select>
            </div>
            <div class="me-2">
              <a-select v-model:value="filterGender" placeholder="Gender" style="width: 120px;" allow-clear
                @change="handleFilterChange">
                <a-select-option value="Male">Male</a-select-option>
                <a-select-option value="Female">Female</a-select-option>
              </a-select>
            </div>
            <div class="me-2">
              <a-select v-model:value="filterIdType" placeholder="ID Type" style="width: 180px;" allow-clear
                @change="handleFilterChange">
                <a-select-option value="Passport">Passport</a-select-option>
                <a-select-option value="ThaiID">ThaiID</a-select-option>
                <a-select-option value="National ID Card">National ID Card</a-select-option>
                <a-select-option value="Work Permit">Work Permit</a-select-option>
              </a-select>
            </div>
            <!-- Clear buttons -->
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <!-- Search input -->
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
            <p class="mt-2">Loading employees...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <!-- TABLE WITHOUT PAGINATION -->
            <a-table :columns="columns" :data-source="tableData" :pagination="false"
              :scroll="{ x: 1000, y: 'max-content' }" row-key="id" @change="handleTableChange"
              :row-selection="rowSelection">
              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <!-- View Employee - Always visible -->
                    <router-link 
                      :to="`/employee/employee-details/${record.id}`" 
                      class="me-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="View Details"
                    >
                      <i class="ti ti-eye"></i>
                    </router-link>
                    <!-- Delete Employee - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      @click="confirmDeleteEmployee(record.id)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Delete Employee"
                    >
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>

                <!-- Organization column -->
                <template v-if="column.key === 'organization'">
                  <span :class="[
                    'badge badge-sm fw-normal',
                    record.organization === 'SMRU' ? 'badge-primary' :
                      record.organization === 'BHF' ? 'badge-soft-primary fw-bold' :
                        'badge-secondary'
                  ]">
                    {{ record.organization }}
                  </span>
                </template>

                <!-- Status column -->
                <template v-if="column.key === 'status'">
                  <a-badge :status="record.status === 'Local ID'
                    ? 'success'
                    : record.status === 'Expats'
                      ? 'processing'
                      : record.status === 'Local non ID'
                        ? 'warning'
                        : 'default'" :text="record.status" />
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

  <!-- Add Employee Modal -->
  <employee-list-modal ref="employeeListModal" @employee-added="fetchEmployees"></employee-list-modal>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import EmployeeListModal from '@/components/modal/employee-list-modal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { employeeService } from '@/services/employee.service';
import moment from 'moment';
import { Modal, Table } from 'ant-design-vue';
import { Modal as BootstrapModal } from 'bootstrap';
import { usePermissions } from '@/composables/usePermissions';
import { ref } from 'vue';

export default {
  name: 'EmployeesList',
  components: {
    indexBreadcrumb,
    EmployeeListModal,
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
    
    // Initialize permission checks for employees module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('employees');
    
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
      title: 'Employee',
      text: 'Employee',
      text1: 'Employee List',
      searchStaffId: '',

      // Data properties (no store dependencies)
      employees: [],
      loading: false,
      searchLoading: false,
      selectedRowKeys: [],

      // Separate filter properties for dropdowns
      filterOrganization: undefined,
      filterStatus: undefined,
      filterGender: undefined,
      filterIdType: undefined,

      // Statistics (local instead of store)
      statistics: {
        totalEmployees: 0,
        activeCount: 0,
        inactiveCount: 0,
        newJoinerCount: 0,
        organizationCount: { SMRU_count: 0, BHF_count: 0 },
      },

      // UI loading states for opening modals
      openingAddEmployee: false,
    };
  },
  computed: {
    columns() {
      const sorted = this.sortedInfo || {};
      // Column widths optimized for readability without header text wrapping
      return [
        {
          title: 'Org',
          dataIndex: 'organization',
          key: 'organization',
          width: 80,
          fixed: 'left',
          sorter: true,
          sortOrder: sorted.columnKey === 'organization' && sorted.order,
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
          title: 'Init.',
          dataIndex: 'initials',
          key: 'initials',
          width: 70,
          sorter: false,
        },
        {
          title: 'First Name',
          dataIndex: 'first_name_en',
          key: 'first_name_en',
          width: 130,
          ellipsis: true,
          sorter: true,
          sortOrder: sorted.columnKey === 'first_name_en' && sorted.order,
        },
        {
          title: 'Last Name',
          dataIndex: 'last_name_en',
          key: 'last_name_en',
          width: 130,
          ellipsis: true,
          sorter: true,
          sortOrder: sorted.columnKey === 'last_name_en' && sorted.order,
        },
        {
          title: 'Gender',
          dataIndex: 'gender',
          key: 'gender',
          width: 85,
          sorter: true,
          sortOrder: sorted.columnKey === 'gender' && sorted.order,
        },
        {
          title: 'DOB',
          dataIndex: 'date_of_birth',
          key: 'date_of_birth',
          width: 110,
          sorter: true,
          sortOrder: sorted.columnKey === 'date_of_birth' && sorted.order,
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
          width: 65,
          align: 'center',
          sorter: true,
          sortOrder: sorted.columnKey === 'age' && sorted.order,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 120,
          ellipsis: true,
          sorter: true,
          sortOrder: sorted.columnKey === 'status' && sorted.order,
        },
        {
          title: 'ID Type',
          dataIndex: 'id_type',
          key: 'id_type',
          width: 140,
          ellipsis: true,
          sorter: true,
          sortOrder: sorted.columnKey === 'id_type' && sorted.order,
        },
        {
          title: 'ID Number',
          dataIndex: 'id_number',
          key: 'id_number',
          width: 140,
          ellipsis: true,
          sorter: false,
        },
        {
          title: 'SSN',
          dataIndex: 'social_security_number',
          key: 'social_security_number',
          width: 130,
          ellipsis: true,
          sorter: false,
        },
        {
          title: 'Tax No.',
          dataIndex: 'tax_number',
          key: 'tax_number',
          width: 130,
          ellipsis: true,
          sorter: false,
        },
        {
          title: 'Phone',
          dataIndex: 'mobile_phone',
          key: 'mobile_phone',
          width: 120,
          ellipsis: true,
          sorter: false,
        },
        {
          title: 'Actions',
          key: 'action',
          fixed: 'right',
          width: 90,
          sorter: false,
        },
      ];
    },
    tableData() {
      // With server-side pagination, just return the employees as-is
      return this.employees.map(employee => ({
        ...employee,
        key: employee.id,
      }));
    },
    rowSelection() {
      // Only show row selection if user has edit permission
      if (!this.canEdit) {
        return null;
      }
      
      return {
        // fix the column to the left
        fixed: 'left',
        // give it a more appropriate width for checkboxes
        columnWidth: 60,
        // your existing config
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: false,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_NONE,
          {
            key: 'smru',
            text: 'Select SMRU Employees',
            onSelect: () => {
              const smruEmployees = this.employees
                .filter(e => e.organization === 'SMRU')
                .map(e => e.id);
              this.selectedRowKeys = smruEmployees;
            },
          },
          {
            key: 'bhf',
            text: 'Select BHF Employees',
            onSelect: () => {
              const bhfEmployees = this.employees
                .filter(e => e.organization === 'BHF')
                .map(e => e.id);
              this.selectedRowKeys = bhfEmployees;
            },
          },
        ],
      }
    },
  },
  mounted() {
    this.fetchEmployees();
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

      this.fetchEmployees(params);
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

      this.fetchEmployees(params);
    },

    // Helper method to build complete API parameters
    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams
      };

      // Add sorting parameters ONLY when user has explicitly clicked on a column to sort
      if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
        const sortField = this.mapSortField(this.sortedInfo.field);
        params.sort_by = sortField;
        params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add filter parameters from dropdown filters
      if (this.filterOrganization) {
        params.filter_organization = this.filterOrganization;
      }
      if (this.filterStatus) {
        params.filter_status = this.filterStatus;
      }
      if (this.filterGender) {
        params.filter_gender = this.filterGender;
      }
      if (this.filterIdType) {
        params.filter_id_type = this.filterIdType;
      }

      return params;
    },

    // TABLE CHANGE HANDLER (for sorting only - filters are handled separately)
    handleTableChange(pagination, filters, sorter) {
      console.log('Table change (sorting):', sorter);

      // Check if there's actually a meaningful sort change
      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.sortedInfo);

      // Only proceed if there's an actual sort change
      if (!hasSorterChange) {
        console.log('No meaningful change detected, skipping reload');
        return;
      }

      // Only update sorter if it's a real sort operation (has field and order)
      if (sorter && sorter.field && sorter.order) {
        console.log('Applying sort:', sorter);
        this.sortedInfo = sorter;
      } else if (!sorter || (!sorter.field && !sorter.order)) {
        console.log('Clearing sort');
        this.sortedInfo = {};
      }

      // Reset to first page when sort changes
      this.currentPage = 1;

      // Build complete parameters
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      // Fetch employees with new parameters
      this.fetchEmployees(params);
    },

    // Map frontend table field names to backend field names
    mapSortField(field) {
      const fieldMapping = {
        'organization': 'organization',
        'staff_id': 'staff_id',
        'fullName': 'first_name_en',
        'first_name_en': 'first_name_en',
        'last_name_en': 'last_name_en',
        'gender': 'gender',
        'age': 'age',
        'date_of_birth': 'date_of_birth',
        'status': 'status',
        'id_type': 'id_type'
      };
      return fieldMapping[field] || field;
    },

    clearFilters() {
      // Clear dropdown filters
      this.filterOrganization = undefined;
      this.filterStatus = undefined;
      this.filterGender = undefined;
      this.filterIdType = undefined;
      this.filteredInfo = {};
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchEmployees(params);
    },

    clearAll() {
      // Clear dropdown filters
      this.filterOrganization = undefined;
      this.filterStatus = undefined;
      this.filterGender = undefined;
      this.filterIdType = undefined;
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchStaffId = '';
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchEmployees(params);
    },

    // Handle filter change from dropdown filters
    handleFilterChange() {
      console.log('Filter changed:', {
        organization: this.filterOrganization,
        status: this.filterStatus,
        gender: this.filterGender,
        idType: this.filterIdType
      });

      // Reset to first page when filter changes
      this.currentPage = 1;

      // Build complete parameters with new filters
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      // Fetch employees with new filter parameters
      this.fetchEmployees(params);
    },

    async handleStaffIdSearch() {
      // Validation: Check if search input is empty
      if (!this.searchStaffId || this.searchStaffId.trim() === '') {
        this.$message.warning('Please enter a staff ID to search');
        return;
      }

      this.searchLoading = true;
      try {
        const response = await employeeService.getSingleEmployee(this.searchStaffId);

        // Check if the API returned success
        if (response.success === true && response.data) {
          // Handle the case where response.data is an array
          const employeeArray = Array.isArray(response.data) ? response.data : [response.data];

          // Format the employee data similar to fetchEmployees method
          const formattedEmployees = this.mapEmployeeData(employeeArray);

          // Debug: Log the formatted data
          console.log('🔍 Raw employee data:', employeeArray);
          console.log('🔍 Formatted employees:', formattedEmployees);

          // Update the employees array with the formatted employees
          this.employees = formattedEmployees;
          this.total = 1;
          this.currentPage = 1;
          this.$message.success(response.message || 'Employee found successfully');
        } else {
          // Handle API response with success: false (404 - Employee not found)
          this.$message.warning(response.message || 'No employee found with this staff ID');
        }

        return response;
      } catch (error) {
        // Only network errors, auth errors, or parsing errors reach here
        console.error('Error fetching employee by staff ID:', error);
        this.$message.error('Network error: Failed to fetch employee by staff ID');
        // Clear employees on error
        this.employees = [];
        this.total = 0;
      } finally {
        this.searchLoading = false;
      }
    },

    async fetchEmployees(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };

        const response = await employeeService.getEmployees(queryParams);

        if (response.success && response.data) {
          const employeesData = response.data;

          this.employees = this.mapEmployeeData(employeesData);

          // Update pagination properties from server response
          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
            this.pageSize = response.pagination.per_page;
          } else {
            this.total = response.data.length;
            this.currentPage = 1;
          }

          // Update statistics from server response
          if (response.statistics) {
            this.statistics = {
              totalEmployees: response.statistics.totalEmployees || 0,
              activeCount: response.statistics.activeCount || 0,
              inactiveCount: response.statistics.inactiveCount || 0,
              newJoinerCount: response.statistics.newJoinerCount || 0,
              organizationCount: {
                SMRU_count: response.statistics.organizationCount?.SMRU_count || 0,
                BHF_count: response.statistics.organizationCount?.BHF_count || 0
              }
            };
          } else {
            this.updateLocalStatistics();
          }

          this.$message.success('Employees loaded successfully');
        } else {
          this.employees = [];
          this.total = 0;
          this.$message.error('No employees data received');
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        this.employees = [];
        this.total = 0;
        this.$message.error('Failed to load employees');
      } finally {
        this.loading = false;
      }
    },

    mapEmployeeData(data) {
      return data.map(emp => ({
        key: emp.id,
        id: emp.id,
        organization: emp.organization || 'N/A',
        staff_id: emp.staff_id || 'N/A',
        initials: emp.initial_en || 'N/A',
        first_name_en: emp.first_name_en || 'N/A',
        last_name_en: emp.last_name_en || 'N/A',
        gender: emp.gender || 'N/A',
        date_of_birth: emp.date_of_birth ? moment(emp.date_of_birth).format("DD MMM YYYY") : 'N/A',
        age: emp.date_of_birth ? moment().diff(moment(emp.date_of_birth), 'years') : 'N/A',
        status: emp.status || 'N/A',
        id_type: emp.identification_type || 'N/A',
        id_number: emp.identification_number || 'N/A',
        social_security_number: emp.social_security_number || 'N/A',
        tax_number: emp.tax_number || 'N/A',
        mobile_phone: emp.mobile_phone || 'N/A',
        joiningDate: emp.employment?.start_date ? moment(emp.employment.start_date).format("DD MMM YYYY") : "N/A",
        created_at: moment(emp.created_at).format("DD MMM YYYY"),
        active: emp.employment?.active === 1
      }));
    },

    updateLocalStatistics() {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);

      // Calculate statistics from current employees array
      this.statistics.totalEmployees = this.total;
      this.statistics.activeCount = this.employees.filter(e => e.active).length;
      this.statistics.inactiveCount = this.employees.filter(e => !e.active).length;
      this.statistics.newJoinerCount = this.employees.filter(e => {
        const joiningDate = e.joiningDate && new Date(e.joiningDate);
        return joiningDate && joiningDate >= threeMonthsAgo && joiningDate <= now;
      }).length;
      this.statistics.organizationCount = {
        SMRU_count: this.employees.filter(e => e.organization === 'SMRU').length,
        BHF_count: this.employees.filter(e => e.organization === 'BHF').length
      };
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    // Row selection change handler
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      console.log('selectedRowKeys changed: ', selectedRowKeys);
    },

    // Confirm delete selected employees
    confirmDeleteSelectedEmployees() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('Please select at least one employee to delete');
        return;
      }

      Modal.confirm({
        title: `Are you sure you want to delete ${this.selectedRowKeys.length} selected employee(s)?`,
        content: 'This will delete all selected employees and their associated data. This action cannot be undone.',
        centered: true,
        okText: 'Yes, Delete All',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteSelectedEmployees();
        }
      });
    },

    // Delete selected employees
    async deleteSelectedEmployees() {
      try {
        console.log('Sending IDs to delete:', this.selectedRowKeys);
        await employeeService.deleteSelectedEmployees(this.selectedRowKeys);
        this.$message.success(`${this.selectedRowKeys.length} employee(s) deleted successfully`);
        this.selectedRowKeys = [];
        this.fetchEmployees();
      } catch (error) {
        this.$message.error('Failed to delete employees');
        console.error("Error deleting employees:", error);
      }
    },

    // Confirm delete single employee
    confirmDeleteEmployee(id) {
      Modal.confirm({
        title: 'Are you sure you want to delete this employee?',
        content: 'This will delete the employee and all associated data. This action cannot be undone.',
        centered: true,
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteEmployee(id);
        }
      });
    },

    // Delete single employee
    async deleteEmployee(id) {
      try {
        await employeeService.deleteEmployee(id);
        this.$message.success('Employee deleted successfully');
        this.fetchEmployees();
      } catch (error) {
        this.$message.error('Failed to delete employee');
        console.error("Error deleting employee:", error);
      }
    },

    async openAddEmployeeModal() {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/bbbca396-2230-41be-a2ce-0555c1ae62b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'employees-list.vue:980',message:'openAddEmployeeModal called',data:{componentExists:!!this.$refs.employeeListModal},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
      // #endregion
      try {
        this.openingAddEmployee = true;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/bbbca396-2230-41be-a2ce-0555c1ae62b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'employees-list.vue:985',message:'Starting element search',data:{initialCheck:!!document.getElementById('add_employee')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
        // #endregion
        // Wait for modal DOM to be available in case of first-time load
        let attempts = 0;
        while (!document.getElementById('add_employee') && attempts < 40) {
          await new Promise(resolve => setTimeout(resolve, 25));
          attempts++;
          // #region agent log
          if (attempts % 10 === 0) fetch('http://127.0.0.1:7242/ingest/bbbca396-2230-41be-a2ce-0555c1ae62b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'employees-list.vue:990',message:'Still waiting for element',data:{attempts,elementFound:!!document.getElementById('add_employee')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
          // #endregion
        }
        const el = document.getElementById('add_employee');
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/bbbca396-2230-41be-a2ce-0555c1ae62b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'employees-list.vue:993',message:'Element search completed',data:{elementFound:!!el,attempts,allModals:document.querySelectorAll('.modal').length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
        // #endregion
        if (el) {
          const modal = new BootstrapModal(el);
          modal.show();
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/bbbca396-2230-41be-a2ce-0555c1ae62b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'employees-list.vue:996',message:'Modal shown successfully',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/bbbca396-2230-41be-a2ce-0555c1ae62b5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'employees-list.vue:999',message:'Element not found after wait',data:{attempts,allModals:document.querySelectorAll('.modal').length,modalIds:Array.from(document.querySelectorAll('.modal')).map(m=>m.id)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
          // #endregion
          this.$message && this.$message.warning && this.$message.warning('Form is loading, please try again.');
        }
      } finally {
        this.openingAddEmployee = false;
      }
    },

    // Get unique values for filter dropdowns
    getUniqueValues(field) {
      if (!this.employees || this.employees.length === 0) return [];

      const uniqueValues = [...new Set(this.employees.map(item => item[field]))].filter(Boolean);
      return uniqueValues.map(value => ({ text: value, value }));
    },
  }
};
</script>

<style scoped>
/* ===========================================
   EMPLOYEE LIST PAGE - SCOPED STYLES
   =========================================== */

/* Highlight for search results */
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0;
}

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
.card:not(.statistics-card) {
  overflow: visible;
  margin-bottom: 20px;
}

.card:not(.statistics-card) .card-body {
  overflow: visible;
  padding-bottom: 0;
}

/* ===========================================
   STATISTICS CARDS
   =========================================== */
.statistics-row {
  margin-bottom: 1rem;
}

.statistics-row .col-lg-3 {
  margin-bottom: 0.5rem;
}

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
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.statistics-card .badge {
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
}

/* ===========================================
   ANT DESIGN TABLE - FIXED COLUMN FIXES
   Critical: Fixed columns MUST have OPAQUE backgrounds
   to prevent content from showing through when scrolling
   =========================================== */

/* Table container */
:deep(.ant-table-container) {
  border: 1px solid #f0f0f0;
  border-radius: 2px;
}

/* ===========================================
   FIXED COLUMNS - MUST BE OPAQUE
   This is the key fix for the transparency issue
   =========================================== */

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

/* ===========================================
   ROW HOVER - Fixed columns must stay opaque
   =========================================== */
:deep(.ant-table-tbody > tr:hover > td.ant-table-cell-fix-left),
:deep(.ant-table-tbody > tr:hover > td.ant-table-cell-fix-right),
:deep(.ant-table-tbody > tr:hover > td.ant-table-selection-column) {
  background-color: #fafafa !important;
}

/* Non-fixed columns can use any hover color */
:deep(.ant-table-tbody > tr:hover > td:not(.ant-table-cell-fix-left):not(.ant-table-cell-fix-right):not(.ant-table-selection-column)) {
  background-color: #fafafa;
}

/* ===========================================
   ROW SELECTION - Fixed columns MUST be opaque
   Use solid colors, NOT rgba transparency!
   =========================================== */

/* Selected row - fixed columns (OPAQUE light blue) */
:deep(.ant-table-tbody > tr.ant-table-row-selected > td.ant-table-cell-fix-left),
:deep(.ant-table-tbody > tr.ant-table-row-selected > td.ant-table-cell-fix-right),
:deep(.ant-table-tbody > tr.ant-table-row-selected > td.ant-table-selection-column) {
  background-color: #f0f7ff !important;
}

/* Selected row - non-fixed columns (can be subtle) */
:deep(.ant-table-tbody > tr.ant-table-row-selected > td:not(.ant-table-cell-fix-left):not(.ant-table-cell-fix-right):not(.ant-table-selection-column)) {
  background-color: #f0f7ff;
}

/* Selected row hover - fixed columns (OPAQUE) */
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
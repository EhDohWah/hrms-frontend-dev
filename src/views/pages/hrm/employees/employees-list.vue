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
          <!-- Add Employee Button -->
          <div class="mb-2 me-2">
            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_employee"
              class="btn btn-primary d-flex align-items-center">
              <i class="ti ti-circle-plus me-2"></i>Add New Employee
            </a>
          </div>

          <!-- Upload Employee Excel File Button -->
          <div class="mb-2 me-2">
            <a href="javascript:void(0);" class="btn btn-primary d-flex align-items-center" data-bs-toggle="modal"
              data-bs-target="#employeeUploadModal">
              <i class="ti ti-upload me-2"></i>Upload Employee Excel File
            </a>
          </div>

          <!-- Delete Selected Employees Button -->
          <div class="mb-2 me-2">
            <a href="javascript:void(0);" class="btn btn-danger d-flex align-items-center"
              @click="confirmDeleteSelectedEmployees" :class="{ 'disabled': selectedRowKeys.length === 0 }">
              <i class="ti ti-trash me-2"></i>Delete Selected
            </a>
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

      <!-- Employee Statistics -->
      <div class="row">
        <!-- SMRU Employees -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-primary rounded-circle">SMRU</span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">SMRU Employees</p>
                  <h4>{{ employeeStore.statistics.subsidiaryCount.SMRU_count }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-purple badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((employeeStore.statistics.activeCount / employeeStore.statistics.totalEmployees) * 100).toFixed(1)
                  }}% Active
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /SMRU Employees -->

        <!-- BHF Employees -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg rounded-circle" style="background-color: #3157a5 !important;">BHF</span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">BHF Employees</p>
                  <h4>{{ employeeStore.statistics.subsidiaryCount.BHF_count }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-primary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((employeeStore.statistics.activeCount / employeeStore.statistics.totalEmployees) * 100).toFixed(1)
                  }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /BHF Employees -->

        <!-- New Joiners -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-success rounded-circle"><i class="ti ti-user-plus"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">New Joiners</p>
                  <h4>{{ employeeStore.statistics.newJoinerCount }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-secondary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((employeeStore.statistics.newJoinerCount / employeeStore.statistics.totalEmployees) *
                    100).toFixed(1) }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /New Joiners -->

        <!-- Resigned Employees -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-danger rounded-circle"><i class="ti ti-user-pause"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Resigned</p>
                  <h4>{{ employeeStore.statistics.inactiveCount }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-dark badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((employeeStore.statistics.inactiveCount / employeeStore.statistics.totalEmployees) *
                    100).toFixed(1) }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Resigned Employees -->
      </div>
      <!-- /Employee Statistics -->

      <!-- Employee List Table -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Employee List</h5>
          <!-- Table Operations -->
          <div class="table-operations d-flex align-items-center">
            <span v-if="selectedRowKeys.length > 0" class="me-3">
              <strong>{{ selectedRowKeys.length }}</strong> {{ selectedRowKeys.length === 1 ? 'item' : 'items' }}
              selected
            </span>
            <a-button @click="clearFilters">Clear filters</a-button>
            <a-button @click="clearAll">Clear filters and sorters</a-button>
          </div>
          <!-- /Table Operations -->
        </div>

        <!-- Table -->
        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <div id="DataTables_Table_0_wrapper" class="dataTables_wrapper dt-bootstrap5 no-footer">
              <div class="row">
                <div class="col-sm-12 col-md-6">
                  <div class="dataTables_length" id="DataTables_Table_0_length">
                    <label>
                      Row Per Page
                      <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0"
                        class="form-select form-select-sm" v-model.number="perPage"
                        @change="handlePerPageChange($event)">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option :value="totalEmployees">All</option>
                      </select>
                      Entries
                    </label>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
                  <div id="DataTables_Table_0_filter" class="dataTables_filter text-end me-3">
                    <label>
                      STAFF ID SEARCH:
                      <input type="search" class="form-control form-control-sm d-inline-block w-auto"
                        placeholder="Search" aria-controls="DataTables_Table_0" v-model="searchStaffId">
                      <button class="btn btn-sm btn-primary ms-2" @click="handleStaffIdSearch">Search</button>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading Indicator -->
            <div v-if="employeeStore.loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading employees...</p>
            </div>

            <!-- Employee Table -->
            <div v-else>
              <a-table :rowKey="id" :columns="columns" :scroll="{ x: 1500 }" :data-source="employees"
                :row-selection="rowSelection" :pagination="pagination" @change="handleChange"
                class="table datatable thead-light">
                <!-- Name column with highlighting -->
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'fullName'">
                    <div class="d-flex align-items-center file-name-icon">
                      <a href="javascript:void(0);" class="avatar avatar-md">
                        <!-- <img :src="require(`@/assets/img/users/${record.Image}`)" class="img-fluid rounded-circle" alt="img" /> -->
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <router-link :to="`/employee/employee-details/${record.id}`">
                            {{ record.first_name_en }} {{ record.last_name_en }}
                          </router-link>
                        </h6>
                        <router-link :to="`/employee/employee-details/${record.id}`">
                          <span class="d-block mt-1">{{ record.staff_id }}</span>
                        </router-link>
                      </div>
                    </div>
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

                  <!-- Subsidiary column -->
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

                  <!-- Action column -->
                  <template v-if="column.key === 'action'">
                    <div class="action-icon d-inline-flex">
                      <!-- View Employee -->
                      <router-link :to="`/employee/employee-details/${record.id}`" class="me-2">
                        <i class="ti ti-eye"></i>
                      </router-link>
                      <!-- Edit Employee -->
                      <!-- <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal" data-bs-target="#edit_employee">
                        <i class="ti ti-edit"></i>
                      </a> -->
                      <!-- Delete Employee -->
                      <a href="javascript:void(0);" @click="confirmDeleteEmployee(record.id)">
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </div>
        <!-- /Table -->
      </div>
    </div>
  </div>

  <!-- Add Employee Modal -->
  <employee-list-modal @employee-added="fetchEmployees"></employee-list-modal>

  <!-- Employee Upload Modal -->
  <employee-upload-modal @refresh-employee-list="fetchEmployees"></employee-upload-modal>
</template>


<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { useEmployeeStore } from '@/stores/employeeStore';
import { mapStores } from 'pinia';
import { Modal, Table } from 'ant-design-vue';
import { employeeService } from '@/services/employee.service';
import eventBus from '@/plugins/eventBus';

export default {
  name: 'EmployeesList',
  data() {
    return {
      title: 'Employees',
      text: 'Employees',
      text1: 'Employees List',
      employees: [],
      selectedSite: null,
      selectedDepartment: null,
      selectedPosition: null,
      siteId: null,
      departmentId: null,
      positionId: null,
      dateRangeInput: null,
      employeeToDelete: null,
      selectedRowKeys: [],

      // Pagination
      page: 1,
      perPage: 10,
      currentPage: 1,
      pageSize: 10,

      searchTerm: '',

      // Column visibility control
      visibleColumns: ['subsidiary', 'staff_id', 'initials', 'first_name_en', 'last_name_en', 'gender', 'date_of_birth', 'age', 'status', 'id_type', 'id_number', 'social_security_number', 'tax_number', 'mobile_phone', 'action'],

      // Filter and sort info
      filteredInfo: {},
      sortedInfo: {},
    };
  },
  mounted() {
    this.fetchEmployees();
    this.$nextTick(() => {
      this.dateRangeInput = document.getElementById('booking-date');
      this.initializeDateRangePicker();
    });

    eventBus.on('notification-clicked', (notif) => {
      console.log('Notification clicked:', notif);
      this.fetchEmployees();
    });
  },

  beforeUnmount() {
    eventBus.off('notification-clicked');
  },

  computed: {
    ...mapStores(useEmployeeStore),

    totalEmployees() {
      return this.employeeStore.statistics.totalEmployees;
    },

    // Get staff IDs based on selected subsidiary
    filteredStaffIds() {
      if (!this.filteredInfo || !this.filteredInfo.subsidiary || this.filteredInfo.subsidiary.length === 0) {
        return this.getUniqueValues('staff_id');
      }

      const selectedSubsidiaries = this.filteredInfo.subsidiary;
      const filteredEmployees = this.employees.filter(emp =>
        selectedSubsidiaries.includes(emp.subsidiary)
      );

      const uniqueStaffIds = [...new Set(filteredEmployees.map(item => item.staff_id))].filter(Boolean);
      return uniqueStaffIds.map(value => ({ text: value, value }));
    },

    // Define columns with filters and sorters
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: 'Subsidiary',
          dataIndex: 'subsidiary',
          key: 'subsidiary',
          width: 150,
          fixed: 'left',
          filters: this.getUniqueValues('subsidiary'),
          filteredValue: filtered.subsidiary || null,
          onFilter: (value, record) => record.subsidiary === value,
          sorter: (a, b) => {
            a = (a.subsidiary || '').toLowerCase();
            b = (b.subsidiary || '').toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'subsidiary' && sorted.order,
        },
        {
          title: 'Staff ID',
          dataIndex: 'staff_id',
          key: 'staff_id',
          width: 120,
          filters: this.filteredStaffIds,
          filteredValue: filtered.staff_id || null,
          onFilter: (value, record) => record.staff_id === value,
          sorter: (a, b) => {
            a = a.staff_id.toLowerCase();
            b = b.staff_id.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'staff_id' && sorted.order,
        },

        {
          title: 'Initials',
          dataIndex: 'initials',
          key: 'initials',
          width: 150,
          filters: this.getUniqueValues('initials'),
          filteredValue: filtered.initials || null,
          onFilter: (value, record) => record.initials === value,
          sorter: (a, b) => {
            a = a.initials.toLowerCase();
            b = b.initials.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'initials' && sorted.order,
        },
        {
          title: 'First Name',
          dataIndex: 'first_name_en',
          key: 'first_name_en',
          width: 150,
          filters: this.getUniqueValues('first_name_en'),
          filteredValue: filtered.first_name_en || null,
          onFilter: (value, record) => record.first_name_en === value,
          sorter: (a, b) => {
            a = a.first_name_en.toLowerCase();
            b = b.first_name_en.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'first_name_en' && sorted.order,
        },

        {
          title: 'Last Name',
          dataIndex: 'last_name_en',
          key: 'last_name_en',
          width: 150,
          filters: this.getUniqueValues('last_name_en'),
          filteredValue: filtered.last_name_en || null,
          onFilter: (value, record) => record.last_name_en === value,
          sorter: (a, b) => {
            a = a.last_name_en.toLowerCase();
            b = b.last_name_en.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'last_name_en' && sorted.order,
        },

        {
          title: 'Gender',
          dataIndex: 'gender',
          key: 'gender',
          width: 120,
          filters: this.getUniqueValues('gender'),
          filteredValue: filtered.gender || null,
          onFilter: (value, record) => record.gender === value,
          sorter: (a, b) => {
            a = a.gender.toLowerCase();
            b = b.gender.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'gender' && sorted.order,
        },

        {
          title: 'Date of Birth',
          dataIndex: 'date_of_birth',
          key: 'date_of_birth',
          width: 120,
          sorter: (a, b) => {
            a = a.date_of_birth.toLowerCase();
            b = b.date_of_birth.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'date_of_birth' && sorted.order,
        },

        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
          width: 100,
          filters: this.getUniqueValues('age'),
          filteredValue: filtered.age || null,
          onFilter: (value, record) => record.age === value,
          sorter: (a, b) => {
            a = a.age.toLowerCase();
            b = b.age.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'age' && sorted.order,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 150,
          filters: this.getUniqueValues('status'),
          filteredValue: filtered.status || null,
          onFilter: (value, record) => record.status === value,
          sorter: (a, b) => {
            a = a.status.toLowerCase();
            b = b.status.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'status' && sorted.order,
        },

        {
          title: 'ID Type',
          dataIndex: 'id_type',
          key: 'id_type',
          width: 200,
          filters: this.getUniqueValues('id_type'),
          filteredValue: filtered.id_type || null,
          onFilter: (value, record) => record.id_type === value,
          sorter: (a, b) => {
            a = a.id_type.toLowerCase();
            b = b.id_type.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'id_type' && sorted.order,
        },
        {
          title: 'ID Number',
          dataIndex: 'id_number',
          key: 'id_number',
          width: 150,
          filters: this.getUniqueValues('id_number'),
          filteredValue: filtered.id_number || null,
          onFilter: (value, record) => record.id_number === value,
          sorter: (a, b) => {
            a = a.id_number.toLowerCase();
            b = b.id_number.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'id_number' && sorted.order,
        },

        {
          title: 'Social Security Number',
          dataIndex: 'social_security_number',
          key: 'social_security_number',
          width: 180,
          filters: this.getUniqueValues('social_security_number'),
          filteredValue: filtered.social_security_number || null,
          onFilter: (value, record) => record.social_security_number === value,
          sorter: (a, b) => {
            a = a.social_security_number.toLowerCase();
            b = b.social_security_number.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'social_security_number' && sorted.order,
        },

        {
          title: 'Tax Number',
          dataIndex: 'tax_number',
          key: 'tax_number',
          width: 200,
          filters: this.getUniqueValues('tax_number'),
          filteredValue: filtered.tax_number || null,
          onFilter: (value, record) => record.tax_number === value,
          sorter: (a, b) => {
            a = a.tax_number.toLowerCase();
            b = b.tax_number.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'tax_number' && sorted.order,
        },

        {
          title: 'Phone',
          dataIndex: 'mobile_phone',
          key: 'mobile_phone',
          width: 120,
          sorter: (a, b) => {
            a = a.mobile_phone.toLowerCase();
            b = b.mobile_phone.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'mobile_phone' && sorted.order,
        },
        {
          title: 'Active',
          dataIndex: 'active',
          key: 'active',
          width: 100,
          filters: [
            { text: 'Active', value: true },
            { text: 'Inactive', value: false },
          ],
          filteredValue: filtered.active || null,
          onFilter: (value, record) => record.active === value,
          sorter: (a, b) => a.active - b.active,
          sortOrder: sorted.columnKey === 'active' && sorted.order,
        },
        {
          title: 'Actions',
          key: 'action',
          fixed: 'right',
          width: 150,
          sorter: false,
        },
      ].filter(col => this.visibleColumns.includes(col.key));
    },

    rowSelection() {
      return {
        // fix the column to the left
        fixed: 'left',

        // give it a custom width
        columnWidth: 100,

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
                .filter(e => e.subsidiary === 'SMRU')
                .map(e => e.id);
              this.selectedRowKeys = smruEmployees;
            },
          },
          {
            key: 'bhf',
            text: 'Select BHF Employees',
            onSelect: () => {
              const bhfEmployees = this.employees
                .filter(e => e.subsidiary === 'BHF')
                .map(e => e.id);
              this.selectedRowKeys = bhfEmployees;
            },
          },
        ],
      }
    },
  },
  methods: {
    async handleStaffIdSearch() {
      if (!this.searchStaffId) {
        await this.fetchEmployees()
        return
      }

      try {
        await this.employeeStore.fetchSingleEmployee(this.searchStaffId)
        // At this point `this.employeeStore.employees` has either [ employee ] or []
        // console.log('🔍 this.employeeStore.employees:', this.employeeStore.employees);
        console.log('🔍 this.employees:', this.employeeStore.employees);
        this.employees = this.mapEmployeeData(this.employeeStore.employees)
        // this.totalEmployees = this.employeeStore.pagination.total


        if (this.employees.length === 0) {
          this.$message.info('No employee found with that Staff ID')
        }
      } catch {
        this.$message.error('Error searching for employee')
        this.employees = []

      }
    },
    handleChange(pagination, filters, sorter) {
      // Update pagination state
      this.page = pagination.current;
      this.pageSize = pagination.pageSize;

      // Update filtered info state
      this.filteredInfo = filters;

      // Update sorted info state
      this.sortedInfo = sorter;

      // Apply filters and sorting to the existing data without making API calls
      let filteredData = [...this.employeeStore.employees];

      // Apply filters
      Object.entries(filters).forEach(([key, values]) => {
        if (values && values.length) {
          filteredData = filteredData.filter(record => {
            return values.includes(record[key]);
          });
        }
      });

      // Apply sorting
      if (sorter.columnKey && sorter.order) {
        filteredData.sort((a, b) => {
          const valueA = a[sorter.columnKey];
          const valueB = b[sorter.columnKey];

          if (sorter.order === 'ascend') {
            return valueA > valueB ? 1 : -1;
          } else {
            return valueA < valueB ? 1 : -1;
          }
        });
      }

      // Update the displayed data
      this.employees = this.mapEmployeeData(filteredData);
    },

    handlePerPageChange(event) {
      const val = event.target.value;
      // if "all", pick up the true total; otherwise parse the number
      this.perPage = val === 'totalEmployees'
        ? this.totalEmployees
        : parseInt(val, 10);

      // reset back to page 1
      this.page = 1;

      this.fetchEmployees();
    },

    async fetchEmployees(page = this.page, perPage = this.perPage) {
      console.group('fetchEmployees');
      console.log('this.page =', this.page, 'this.perPage =', this.perPage);
      console.trace();
      console.groupEnd();
      try {
        // Prepare parameters for API request
        const params = {
          page: page,
          per_page: perPage,
          sort_by: this.sortedInfo?.columnKey,
          sort_order: this.sortedInfo?.order === 'ascend' ? 'asc' : this.sortedInfo?.order === 'descend' ? 'desc' : ''
        };

        // Add any active filters
        if (this.searchTerm) params.search = this.searchTerm;

        // Add filter parameters from filteredInfo
        Object.entries(this.filteredInfo).forEach(([key, value]) => {
          if (value && value.length) {
            params[key] = value[0];
          }
        });

        // Get current page and page size from table if available
        const currentPage = page || this.page;
        const pageSize = perPage || this.perPage;

        // Fetch employees from store
        await this.employeeStore.fetchEmployees(params);
        console.log('🔍 this.employeeStore.employees:', this.employeeStore.employees);
        // Map the employee data
        this.employees = this.mapEmployeeData(this.employeeStore.employees);

        // Update pagination info if available
        if (this.employeeStore.pagination) {
          this.totalEmployees = this.employeeStore.pagination.total;
          this.currentPage = currentPage;
          this.pageSize = pageSize;
        }

        this.$message.success('Employees loaded successfully');
      } catch (error) {
        this.$message.error('Failed to fetch employees');
        console.error("Error fetching employees:", error);
      }
    },

    // Clear all filters
    clearFilters() {
      this.filteredInfo = {};
      this.page = 1;
      this.fetchEmployees();
    },

    // Clear all filters and sorters
    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.page = 1;
      this.fetchEmployees();
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    booking_range(start, end) {
      return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
    },

    initializeDateRangePicker() {
      if (this.dateRangeInput) {
        const start = moment().subtract(6, "days");
        const end = moment();

        this.daterangepicker = new DateRangePicker(
          this.dateRangeInput,
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
          this.booking_range
        );

        this.booking_range(start, end);
      }
    },

    mapEmployeeData(data) {
      return data.map(emp => ({
        key: emp.id,
        id: emp.id,
        subsidiary: emp.subsidiary || 'N/A',
        staff_id: emp.staff_id || 'N/A',
        initials: emp.initial_en || 'N/A',
        first_name_en: emp.first_name_en || 'N/A',
        last_name_en: emp.last_name_en || 'N/A',
        gender: emp.gender || 'N/A',
        date_of_birth: emp.date_of_birth ? moment(emp.date_of_birth).format("DD MMM YYYY") : 'N/A',
        age: emp.date_of_birth ? moment().diff(moment(emp.date_of_birth), 'years') : 'N/A',
        status: emp.status || 'N/A',
        id_type: emp.id_type || 'N/A',
        id_number: emp.employee_identification && emp.employee_identification.document_number
          ? emp.employee_identification.document_number
          : 'N/A',
        social_security_number: emp.social_security_number || 'N/A',
        tax_number: emp.tax_number || 'N/A',
        mobile_phone: emp.mobile_phone || 'N/A',
        joiningDate: emp.employment?.start_date ? moment(emp.employment.start_date).format("DD MMM YYYY") : "N/A",
        created_at: moment(emp.created_at).format("DD MMM YYYY"),
        active: emp.employment?.active === 1
      }));
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
        // Use the employee service directly instead of going through the store
        console.log('🔍 this.selectedRowKeys:', this.selectedRowKeys);
        // Convert selectedRowKeys array to the expected format for the API

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
        await this.employeeStore.deleteEmployee(id);
        this.$message.success('Employee deleted successfully');
        this.fetchEmployees();
      } catch (error) {
        this.$message.error('Failed to delete employee');
        console.error("Error deleting employee:", error);
      }
    },

    // Handle table change (pagination, filters, sorter)
    handleTableChange(pagination, filters, sorter) {
      console.log('Table params changed:', { pagination, filters, sorter });

      // Update page and perPage
      this.page = pagination.current;
      this.perPage = pagination.pageSize;

      // Update filter and sort info
      this.filteredInfo = filters || {};
      this.sortedInfo = sorter || {};

      // Fetch employees with the updated parameters
      this.fetchEmployees(this.page, this.perPage);
    },

    // Get unique values for filter dropdowns
    getUniqueValues(field) {
      if (!this.employees || this.employees.length === 0) return [];

      const uniqueValues = [...new Set(this.employees.map(item => item[field]))].filter(Boolean);
      return uniqueValues.map(value => ({ text: value, value }));
    },
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


.table-operations>button {
  margin-right: 8px;
}

/* :deep(.ant-table-bordered .ant-table-thead > tr > th),
:deep(.ant-table-bordered .ant-table-tbody > tr > td) {
  border-right: 1px solid #8d8c8c;
} */

/* :deep(.ant-table-bordered .ant-table-thead > tr > th) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
} */

/* Make scrollbar bigger and more visible */
:deep(.ant-table-body)::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 7px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 7px;
  border: 1px solid #f1f1f1;
}

/* Fix for bleeding edges and selection column */
:deep(.ant-table) {
  border-radius: 0;
  overflow: hidden;
}

/* Fix for fixed columns */
:deep(.ant-table-cell-fix-left),
:deep(.ant-table-cell-fix-right) {
  background-color: #ffffff !important;
  z-index: 2 !important;
  box-shadow: 0 0 0 1px #e0e0e0;
}

/* Fix for selection column */
:deep(.ant-table-selection-column) {
  background-color: #ffffff !important;
  z-index: 3 !important;
  min-width: 60px !important;
  width: 60px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Fix for selected rows with fixed columns */
:deep(.ant-table-row-selected > td.ant-table-cell-fix-left),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-right),
:deep(.ant-table-row-selected > td.ant-table-selection-column) {
  background-color: #e6f7ff !important;
  z-index: 3 !important;
}

/* Fix for table borders */
:deep(.ant-table-container) {
  border: 1px solid #e0e0e0;
  border-radius: 0;
}

/* Fix for table header */
:deep(.ant-table-thead > tr > th) {
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

/* Fix for table cell padding */
:deep(.ant-table-cell) {
  padding: 8px 8px !important;
}
</style>

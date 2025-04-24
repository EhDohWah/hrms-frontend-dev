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
          <!-- <div class="me-2 mb-2">
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
          </div> -->

          <div class="mb-2 me-2">
            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_employee"
              class="btn btn-primary d-flex align-items-center"><i class="ti ti-circle-plus me-2"></i>Add New
              Employee</a>
          </div>

          <!-- upload employee excel file -->
          <div class="mb-2 me-2">
            <a href="javascript:void(0);" class="btn btn-primary d-flex align-items-center" data-bs-toggle="modal"
              data-bs-target="#employeeUploadModal"><i class="ti ti-upload me-2"></i>Upload Employee Excel File</a>
          </div>

          <!-- upload employment excel file -->
          <!-- <div class="mb-2">
            <a href="javascript:void(0);" class="btn btn-primary d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#employmentUploadModal"
              ><i class="ti ti-upload me-2"></i>Upload Employment Excel File</a
            >
          </div> -->

          <!-- Delete selected employees button -->
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

      <div class="row">
        <!-- Total Plans -->
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
        <!-- /Total Plans -->

        <!-- Total Plans -->
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
        <!-- /Total Plans -->

        <!-- No of Plans  -->
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
        <!-- /No of Plans -->

        <!-- Inactive Plans -->
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
        <!-- /Inactive Companies -->


      </div>

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Employee List</h5>

          <div class="table-operations">
            <a-button @click="clearFilters">Clear filters</a-button>
            <a-button @click="clearAll">Clear filters and sorters</a-button>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <div v-if="employeeStore.loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading employees...</p>
            </div>

            <a-table v-else class="table datatable thead-light bordered-table" :rowKey="id" :columns="columns"
              :scroll="{ x: 'max-content', y: 500 }" :data-source="employees" :row-selection="rowSelection"
              :pagination="pagination" :animate-rows="false" @change="handleChange" :bordered="true">
              <!-- Name column with highlighting -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'fullName'">
                  <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md">
                      <!-- <img :src="require(`@/assets/img/users/${record.Image}`)" class="img-fluid rounded-circle"
                        alt="img" /> -->
                    </a>
                    <div class="ms-2">
                      <h6 class="fw-medium">
                        <router-link :to="`/employee/employee-details/${record.id}`">
                          {{ record.fullName }}
                        </router-link>
                      </h6>
                      <router-link :to="`/employee/employee-details/${record.id}`">
                        <span class="d-block mt-1">{{ record.position }}</span>
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
                        : 'default'
                    " :text="record.status" />
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
                    <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal" data-bs-target="#edit_employee"><i
                        class="ti ti-edit"></i></a>
                    <a href="javascript:void(0);" @click="confirmDeleteEmployee(record.id)"><i
                        class="ti ti-trash"></i></a>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>





  </div>
  <!-- /Page Wrapper -->
  <employee-list-modal></employee-list-modal>
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

export default {
  data() {
    return {
      employees: [],
      title: "Employee",
      text: "Employee",
      text1: "Employee List",
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

      searchTerm: '',

      // Column visibility control
      visibleColumns: ['subsidiary', 'staff_id', 'initials', 'first_name_en', 'last_name_en', 'gender', 'date_of_birth', 'age', 'status', 'id_type', 'id_number', 'social_security_number', 'tax_number', 'mobile_phone', 'action'],

      // Filter and sort info
      filteredInfo: {},
      sortedInfo: {},
    };
  },

  computed: {
    ...mapStores(useEmployeeStore),

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
          width: 100,
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
          width: 80,
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
          width: 200,
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
          width: 120,
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
          title: 'Actions',
          key: 'action',
          fixed: 'right',
          width: 150,
          sorter: false,
        },
      ].filter(col => this.visibleColumns.includes(col.key));
    },

    pagination() {
      return {
        current: this.page,
        pageSize: this.perPage,
        total: this.employeeStore.statistics.totalEmployees || 0,
        showTotal: total => `Total ${total} employees`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50', '100'],
        onChange: (page, size) => {
          this.page = page;
          this.perPage = size;
          this.fetchEmployees(page, size);
        },
        onShowSizeChange: (page, size) => {
          this.page = page;
          this.perPage = size;
          this.fetchEmployees(page, size);
        }
      };
    },

    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: false,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_INVERT,
          Table.SELECTION_NONE,
          {
            key: 'smru',
            text: 'Select SMRU Employees',
            onSelect: () => {
              const smruEmployees = this.employees
                .filter(employee => employee.subsidiary === 'SMRU')
                .map(employee => employee.id);
              this.selectedRowKeys = smruEmployees;
            },
          },
          {
            key: 'bhf',
            text: 'Select BHF Employees',
            onSelect: () => {
              const bhfEmployees = this.employees
                .filter(employee => employee.subsidiary === 'BHF')
                .map(employee => employee.id);
              this.selectedRowKeys = bhfEmployees;
            },
          },
          {
            key: 'active',
            text: 'Select Active Employees',
            onSelect: () => {
              const activeEmployees = this.employees
                .filter(employee => employee.active)
                .map(employee => employee.id);
              this.selectedRowKeys = activeEmployees;
            },
          },
        ],
      };
    }
  },

  beforeUnmount() {
    // Cleanup DateRangePicker when component is destroyed
    if (this.daterangepicker) {
      this.daterangepicker.remove();
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initializeDateRangePicker();
    });
    this.fetchEmployees(this.page, this.perPage);
    console.log('employees: ', this.employees);
  },

  methods: {

    async fetchEmployees(page = this.page, perPage = this.perPage) {
      try {
        const params = {
          page: page || this.page,
          per_page: perPage || this.perPage,
          sort_by: this.sortedInfo?.columnKey,
          sort_order: this.sortedInfo?.order === 'ascend' ? 'asc' : this.sortedInfo?.order === 'descend' ? 'desc' : ''
        };

        // Add any active filters
        if (this.searchTerm) params.staff_id = this.searchTerm;
        if (this.filteredInfo?.status?.length) params.status = this.filteredInfo.status[0];
        if (this.filteredInfo?.subsidiary?.length) params.subsidiary = this.filteredInfo.subsidiary[0];
        if (this.filteredInfo?.gender?.length) params.gender = this.filteredInfo.gender[0];

        await this.employeeStore.fetchEmployees(params);
        this.employees = this.mapEmployeeData(this.employeeStore.employees);
        console.log('employees: ', this.employees.length);
        this.$message.success('Employees loaded successfully');
      } catch (error) {
        console.error("Error fetching employees:", error);
        this.$message.error('Failed to load employees');
      }
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
        // Create a promise for each employee deletion
        const deletePromises = this.selectedRowKeys.map(id =>
          this.employeeStore.deleteEmployee(id)
        );

        // Wait for all deletions to complete
        await Promise.all(deletePromises);

        this.$message.success(`Successfully deleted ${this.selectedRowKeys.length} employee(s)`);
        this.selectedRowKeys = []; // Clear selection
        this.fetchEmployees(); // Refresh the list
      } catch (error) {
        this.$message.error('Failed to delete some or all employees');
        console.error("Error deleting employees:", error);
      }
    },

    // Get unique values for filter dropdowns
    getUniqueValues(field) {
      if (!this.employees || this.employees.length === 0) return [];

      const uniqueValues = [...new Set(this.employees.map(item => item[field]))].filter(Boolean);
      return uniqueValues.map(value => ({ text: value, value }));
    },

    // Confirm delete grant
    confirmDeleteEmployee(id) {
      Modal.confirm({
        title: 'Are you sure you want to delete this employee?',
        content: 'This will delete the employee and all associated items. This action cannot be undone.',
        centered: true,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          this.deleteEmployee(id);
        }
      });
    },

    async deleteEmployee(id) {
      if (!id) return;

      try {
        await this.employeeStore.deleteEmployee(id);
        this.$message.success('Employee deleted successfully');
        this.fetchEmployees();
      } catch (error) {
        this.$message.error('Failed to delete employee');
        console.error("Error deleting employee:", error);
      } finally {
        this.employeeToDelete = null;
      }
    },

    // Handle table change (pagination, filters, sorter)
    async handleChange(pagination, filters, sorter) {
      try {
        // Ensure pagination values are properly set
        const currentPage = pagination.current || this.page;
        const pageSize = pagination.pageSize || this.perPage;

        const params = {
          page: currentPage,
          per_page: pageSize,
        };

        // Add filter parameters if they exist
        if (filters) {
          if (filters.staff_id && filters.staff_id.length) params.staff_id = filters.staff_id[0];
          if (filters.status && filters.status.length) params.status = filters.status[0];
          if (filters.subsidiary && filters.subsidiary.length) params.subsidiary = filters.subsidiary[0];
          if (filters.gender && filters.gender.length) params.gender = filters.gender[0];

        }

        // Add sort parameters if sorting is applied
        if (sorter && sorter.order) {
          params.sort_by = sorter.columnKey;
          params.sort_order = sorter.order === 'ascend' ? 'asc' : 'desc';
        }

        // Update local state for filters and sorters
        this.filteredInfo = filters || {};
        this.sortedInfo = sorter || {};

        // Fetch employees with the updated parameters
        await this.employeeStore.fetchEmployees(params);

        // Map the employee data
        this.employees = this.mapEmployeeData(this.employeeStore.employees);

        // Update pagination info if available
        if (this.employeeStore.pagination) {
          this.totalEmployees = this.employeeStore.pagination.total;
          this.currentPage = currentPage;
          this.pageSize = pageSize;
        }
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
        initials: emp.initials || 'N/A',
        first_name_en: emp.first_name_en || 'N/A',
        last_name_en: emp.last_name_en || 'N/A',
        gender: emp.gender || 'N/A',
        date_of_birth: emp.date_of_birth ? moment(emp.date_of_birth).format("DD MMM YYYY") : 'N/A',
        age: emp.age || 'N/A',
        status: emp.status || 'N/A',
        id_type: emp.id_type || 'N/A',
        id_number: emp.id_number || 'N/A',
        social_security_number: emp.social_security_number || 'N/A',
        tax_number: emp.tax_number || 'N/A',
        mobile_phone: emp.mobile_phone || 'N/A',
        joiningDate: emp.employment?.start_date ? moment(emp.employment.start_date).format("DD MMM YYYY") : "N/A",
        created_at: moment(emp.created_at).format("DD MMM YYYY"),
        active: emp.employment?.active === 1
      }));
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

.table-operations {
  margin-bottom: 16px;
}

.table-operations>button {
  margin-right: 8px;
}

.bordered-table {
  border: 1px solid #e0e0e0;
}

:deep(.ant-table-bordered .ant-table-thead > tr > th),
:deep(.ant-table-bordered .ant-table-tbody > tr > td) {
  border-right: 1px solid #e0e0e0;
}

:deep(.ant-table-bordered .ant-table-thead > tr > th) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

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
  border: 3px solid #f1f1f1;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

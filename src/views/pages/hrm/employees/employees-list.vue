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

            <a-table v-else class="table datatable thead-light bordered-table" :columns="columns"
              :scroll="{ x: 'max-content' }" :data-source="employees" :row-selection="rowSelection"
              :pagination="pagination" @change="handleChange" :bordered="true">
              <!-- Name column with highlighting -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'fullName'">
                  <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md">
                      <img :src="require(`@/assets/img/users/${record.Image}`)" class="img-fluid rounded-circle"
                        alt="img" />
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

    <layout-footer></layout-footer>
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
import { departmentPositionService } from '@/services/department-position.service';
import { workLocationService } from '@/services/worklocation.service';
import { Modal } from 'ant-design-vue';

export default {


  data() {
    return {
      employees: [],
      title: "Employee",
      text: "Employee",
      text1: "Employee List",
      sites: [],
      departments: [],
      positions: [],
      selectedSite: null,
      selectedDepartment: null,
      selectedPosition: null,
      siteId: null,
      departmentId: null,
      positionId: null,
      dateRangeInput: null,
      employeeToDelete: null,

      // Pagination
      currentPage: 1,
      pageSize: 10,
      paginationSettings: {
        pageSizeOptions: ['5', '10', '20', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: false,
      },

      searchTerm: '',

      // Column visibility control
      visibleColumns: ['subsidiary', 'staff_id', 'status', 'fullName', 'mobile_phone', 'location', 'department', 'position', 'action'],

      // Filter and sort info
      filteredInfo: {},
      sortedInfo: {},

      // Row selection configuration
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows);
        },
      },
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
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
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
          title: 'Name',
          dataIndex: 'fullName',
          key: 'fullName',
          sorter: (a, b) => {
            a = a.fullName.toLowerCase();
            b = b.fullName.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'fullName' && sorted.order,
        },
        {
          title: 'Phone',
          dataIndex: 'mobile_phone',
          key: 'mobile_phone',
          sorter: (a, b) => {
            a = a.mobile_phone.toLowerCase();
            b = b.mobile_phone.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'mobile_phone' && sorted.order,
        },
        {
          title: 'Location',
          dataIndex: 'location',
          key: 'location',
          filters: this.sites.map(site => ({ text: site.name, value: site.name })),
          filteredValue: filtered.location || null,
          onFilter: (value, record) => record.location === value,
          sorter: (a, b) => {
            a = (a.location || '').toLowerCase();
            b = (b.location || '').toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'location' && sorted.order,
        },
        {
          title: 'Department',
          dataIndex: 'department',
          key: 'department',
          filters: this.departments.map(dept => ({ text: dept.name, value: dept.name })),
          filteredValue: filtered.department || null,
          onFilter: (value, record) => record.department === value,
          sorter: (a, b) => {
            a = a.department.toLowerCase();
            b = b.department.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'department' && sorted.order,
        },
        {
          title: 'Position',
          dataIndex: 'position',
          key: 'position',
          filters: this.getUniqueValues('position'),
          filteredValue: filtered.position || null,
          onFilter: (value, record) => record.position === value,
          sorter: (a, b) => {
            a = (a.position || '').toLowerCase();
            b = (b.position || '').toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'position' && sorted.order,
        },
        {
          title: 'Actions',
          key: 'action',
          sorter: false,
        },
      ].filter(col => this.visibleColumns.includes(col.key));
    },

    pagination() {
      return {
        ...this.paginationSettings,
        current: this.currentPage,
        pageSize: this.pageSize,
        total: this.employeeStore.statistics.totalEmployees,
        showTotal: (total) => `Total ${total} employees`,
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
    this.fetchEmployees();
    this.fetchSites();
    this.fetchDepartments();
    this.fetchPositions();
  },

  methods: {
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
    handleChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter);
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      this.currentPage = pagination.current;
      this.pageSize = pagination.pageSize;
    },

    // Clear all filters
    clearFilters() {
      this.filteredInfo = {};
    },

    // Clear all filters and sorters
    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
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
        id: emp.id,
        subsidiary: emp.subsidiary || 'N/A',
        staff_id: emp.staff_id || 'N/A',
        fullName: `${emp.first_name_en} ${emp.last_name_en}`.trim(),
        email: emp.user?.email || emp.email || "N/A",
        mobile_phone: emp.mobile_phone || "N/A",
        position: emp.employment?.department_position?.position || "N/A",
        department: emp.employment?.department_position?.department || "N/A",
        joiningDate: emp.employment?.start_date ? moment(emp.employment.start_date).format("DD MMM YYYY") : "N/A",
        status: emp.status || 'inactive',
        Image: "user-32.jpg", // Default image
        location: emp.employment?.work_location?.name || "N/A",
        work: emp.employment?.position?.title || "N/A",
        created_at: moment(emp.created_at).format("DD MMM YYYY"),
        active: emp.employment?.active === 1
      }));
    },

    async fetchEmployees() {
      try {
        await this.employeeStore.fetchEmployees();
        this.employees = this.mapEmployeeData(this.employeeStore.employees);
        this.$message.success('Employees loaded successfully');
      } catch (error) {
        console.error("Error fetching employees:", error);
        this.$message.error('Failed to load employees');
      }
    },

    async fetchSites() {
      try {
        const response = await workLocationService.getAllWorkLocations();
        this.sites = response.data.map(site => ({
          id: site.id,
          name: site.name,
          type: site.type
        }));
      } catch (error) {
        console.error("Error fetching sites:", error);
        this.$message.error('Failed to load sites');
      }
    },

    async fetchDepartmentsAndPositions() {
      try {
        const response = await departmentPositionService.getAllDepartmentPositions();

        // Extract unique departments from the response
        const uniqueDepartments = [...new Set(response.data.map(item => item.department))];
        this.departments = uniqueDepartments.map(dept => ({
          name: dept,
          id: dept // Using department name as ID for simplicity
        }));

        // Process positions based on department selection
        if (this.selectedDepartment) {
          this.positions = response.data
            .filter(item => item.department === this.selectedDepartment)
            .map(item => ({
              id: item.id,
              name: item.position,
              department: item.department
            }));
        } else {
          // Otherwise, get all positions
          this.positions = response.data.map(item => ({
            id: item.id,
            name: item.position,
            department: item.department
          }));
        }

      } catch (error) {
        console.error("Error fetching departments and positions:", error);
        this.$message.error('Failed to load departments and positions');
      }
    },

    // Keeping these methods for backward compatibility
    async fetchDepartments() {
      await this.fetchDepartmentsAndPositions();
    },

    async fetchPositions() {
      await this.fetchDepartmentsAndPositions();
    },

    selectSite(siteName, siteId) {
      this.selectedSite = siteName;
      this.siteId = siteId;
      this.fetchEmployees();
    },

    selectDepartment(departmentName, departmentId) {
      this.selectedDepartment = departmentName;
      this.departmentId = departmentId;
      this.fetchEmployees();
    },

    selectPosition(positionName, positionId) {
      this.selectedPosition = positionName;
      this.positionId = positionId;
      this.fetchEmployees();
    },

    resetSite() {
      this.selectedSite = null;
      this.siteId = null;
      this.fetchEmployees();
    },

    resetDepartment() {
      this.selectedDepartment = null;
      this.departmentId = null;
      this.fetchEmployees();
    },

    resetPosition() {
      this.selectedPosition = null;
      this.positionId = null;
      this.fetchEmployees();
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

/* Persistent hover effect - keeps the background color until cursor leaves the row */
:deep(.ant-table-tbody > tr:hover)>td {
  background-color: #f0f7ff !important;
  transition: background-color 0.1s ease;
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

<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div
        class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3"
      >
        <index-breadcrumb :title="title" :text="text" :text1="text1" />

        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-pdf me-1"></i>Export as PDF</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="mb-2">
            <a
              href="javascript:void(0);"
              data-bs-toggle="modal"
              data-bs-target="#add_employee"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Add New Employee</a
            >
          </div>

          <div class="head-icons ms-2">
            <a
              href="javascript:void(0);"
              class=""
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-original-title="Collapse"
              id="collapse-header"
              @click="toggleHeader"
            >
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
                  <span class="avatar avatar-lg bg-dark rounded-circle"
                    ><i class="ti ti-users"></i
                  ></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Total Employee</p>
                  <h4>{{ totalEmployees }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-purple badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((activeCount / totalEmployees) * 100).toFixed(1) }}% Active
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
                  <span class="avatar avatar-lg bg-success rounded-circle"
                    ><i class="ti ti-user-share"></i
                  ></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Active</p>
                  <h4>{{ activeCount }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-primary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((activeCount / totalEmployees) * 100).toFixed(1) }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Total Plans -->

        <!-- Inactive Plans -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-danger rounded-circle"
                    ><i class="ti ti-user-pause"></i
                  ></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">InActive</p>
                  <h4>{{ inactiveCount }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-dark badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((inactiveCount / totalEmployees) * 100).toFixed(1) }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Inactive Companies -->

        <!-- No of Plans  -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-info rounded-circle"
                    ><i class="ti ti-user-plus"></i
                  ></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">New Joiners</p>
                  <h4>{{ newJoinerCount }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-secondary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((newJoinerCount / totalEmployees) * 100).toFixed(1) }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /No of Plans -->
      </div>

      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>Employee List</h5>
          
          <div class="table-operations">
            <a-button @click="clearFilters">Clear filters</a-button>
            <a-button @click="clearAll">Clear filters and sorters</a-button>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading employees...</p>
            </div>

            <a-table
              v-else
              class="table datatable thead-light"
              :columns="columns"
              :data-source="employees"
              :row-selection="rowSelection"
              :pagination="pagination"
              @change="handleChange"
            >
              <!-- Name column with highlighting -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'fullName'">
                  <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md">
                      <img
                        :src="require(`@/assets/img/users/${record.Image}`)"
                        class="img-fluid rounded-circle"
                        alt="img"
                      />
                    </a>
                    <div class="ms-2">
                      <h6 class="fw-medium">
                        <router-link :to="`/employee/employee-details/${record.id}`">
                          {{ record.fullName }}
                        </router-link>
                      </h6>
                      <span class="d-block mt-1">{{ record.work }}</span>
                    </div>
                  </div>
                </template>

                <!-- Status column -->
                <template v-if="column.key === 'status'">
                  <span
                    :class="[
                      'badge',
                      record.status === 'Local ID'
                        ? 'badge-success'
                        : record.status === 'Expat'
                        ? 'badge-primary'
                        : record.status === 'Non Local'
                        ? 'badge-warning'
                        : 'd-inline-flex',
                      'align-items-center',
                      'badge-xs',
                    ]"
                  >
                    <i class="ti ti-point-filled me-1"></i>
                    {{ record.status }}
                  </span>
                </template>

                <!-- Action column -->
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_employee"
                      ><i class="ti ti-edit"></i
                    ></a>
                    <a
                      href="javascript:void(0);"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                      @click="prepareDelete(record.id)"
                      ><i class="ti ti-trash"></i
                    ></a>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>

    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; HRMS</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <employee-list-modal></employee-list-modal>
</template>

<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { employeeService } from '@/services/employee.service';


export default {
  
  
  data() {
    return {
      employees: [],
      title: "Employee",
      text: "Employee",
      text1: "Employee List",
      sites: [
        { name: "MKT", id: 1, code: 'MKT'},
        { name: "WPA", id: 2, code: 'WPA'},
        { name: "MSL", id: 3, code: 'MSL'},
        { name: "MRM", id: 4, code: 'MRM'},
        { name: "MRMTB", id: 5, code: 'MRMTB'},
        { name: "KKTB", id: 6, code: 'KKTB'},
      ],
      departments: [
        { name: "Admin", id: 1, code: 'Admin'},
        { name: "HR", id: 2, code: 'HR'},
        { name: "DataManagement", id: 3, code: 'DataManagement'},
        { name: "IT", id: 4, code: 'IT'},
        { name: "Finance", id: 5, code: 'Finance'},
        { name: "Lab", id: 6, code: 'Lab'},
      ],
      selectedSite: null,
      selectedDepartment: null,
      siteId: null,
      departmentId: null,
      dateRangeInput: null,
      loading: false,
      employeeToDelete: null,

      // Statistics
      totalEmployees: 0,
      activeCount: 0,
      inactiveCount: 0,
      newJoinerCount: 0,

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

  beforeUnmount() {
    // Cleanup DateRangePicker when component is destroyed
    if (this.daterangepicker) {
      this.daterangepicker.remove();
    }
  },

  computed: {
    // Define columns with filters and sorters
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};
      
      return [
        {
          title: 'Subsidiary',
          dataIndex: 'subsidiary',
          key: 'subsidiary',
          filters: [
            { text: 'SMRU', value: 'SMRU' },
            { text: 'BHF', value: 'BHF' },
          ],
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
          filters: [
            { text: 'Active', value: 'active' },
            { text: 'Inactive', value: 'inactive' },
            { text: 'Local ID', value: 'Local ID' },
            { text: 'Expat', value: 'Expat' },
            { text: 'Non Local', value: 'Non Local' },
          ],
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
          sorter: (a, b) => {
            a = (a.position || '').toLowerCase();
            b = (b.position || '').toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'position' && sorted.order,
        },
        {
          title: '',
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
        total: this.totalEmployees,
        showTotal: (total) => `Total ${total} employees`,
      };
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initializeDateRangePicker();
    });
    this.fetchEmployees();
  },
  
  methods: {
    prepareDelete(id) {
      this.employeeToDelete = id;
    },
    
    async deleteEmployee() {
      if (!this.employeeToDelete) return;
      
      try {
        this.loading = true;
        await employeeService.deleteEmployee(this.employeeToDelete);
        this.fetchEmployees(); // Refresh the list
        this.$message.success('Employee deleted successfully');
      } catch (error) {
        this.$message.error('Failed to delete employee');
        console.error("Error deleting employee:", error);
      } finally {
        this.loading = false;
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
      
      // If using server-side pagination, call your API here
      // this.fetchEmployees();
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
        fullName: `${emp.first_name} ${emp.middle_name || ''} ${emp.last_name}`.trim(),
        email: emp.user?.email || emp.email || "N/A",
        mobile_phone: emp.mobile_phone || "N/A",
        position: emp.employments && emp.employments.length > 0 ? emp.employments[0].position?.title : "N/A",
        joiningDate: emp.employments && emp.employments.length > 0 ? moment(emp.employments[0].start_date).format("DD MMM YYYY") : "N/A",
        status: emp.status || 'inactive',
        Image: "user-32.jpg", // Default image
        department: emp.employments && emp.employments.length > 0 ? emp.employments[0].department?.name : "N/A",
        location: emp.site?.name || "N/A",
        work: emp.employments && emp.employments.length > 0 ? emp.employments[0].position?.title : "N/A",
        created_at: moment(emp.created_at).format("DD MMM YYYY"),
      }));
    },

    async fetchEmployees() {
      this.loading = true;
      
      try {
        const response = await employeeService.getEmployees();
        
        if (response && response.data) {
          this.employees = this.mapEmployeeData(response.data);
          this.totalEmployees = response.meta?.total || this.employees.length;
          this.updateStatistics();
          this.$message.success('Employees loaded successfully');
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        this.$message.error('Failed to load employees');
      } finally {
        this.loading = false;
      }
    },

    // Extract statistics update to reusable method
    updateStatistics() {
      this.activeCount = this.employees.filter(emp => emp.status === 'active').length;
      this.inactiveCount = this.employees.filter(emp => emp.status === 'inactive').length;
      
      const thirtyDaysAgo = moment().subtract(30, 'days');
      this.newJoinerCount = this.employees.filter(emp => 
        moment(emp.created_at, "DD MMM YYYY").isAfter(thirtyDaysAgo)
      ).length;
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

.table-operations > button {
  margin-right: 8px;
}
</style>

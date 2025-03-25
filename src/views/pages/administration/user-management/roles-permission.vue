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
              data-bs-target="#add_role"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Add Roles</a
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

      <!-- Assets Lists -->
      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>Roles List</h5>
          <div
            class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3"
          >
            <div class="ms-3">
              <a-button @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll" class="ms-2">Clear filters and sorters</a-button>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading roles...</p>
            </div>
            
            <a-table
              v-else
              class="table datatable thead-light"
              :columns="columns"
              :data-source="data"
              :row-selection="rowSelection"
              @change="handleChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'Role'">{{ record.Role }}</template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <router-link to="/user-management/permission" class="me-2"
                      ><i class="ti ti-shield"></i
                    ></router-link>
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_role"
                      ><i class="ti ti-edit"></i
                    ></a>
                    <a
                      href="javascript:void(0);"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
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
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <roles-modal></roles-modal>
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { adminService } from "@/services/admin.service";

export default {
  data() {
    return {
      title: "Roles & Permissions",
      text: "Administration",
      text1: "Roles",
      data: [],
      rowSelection: {
        onChange: () => {},
        onSelect: () => {},
        onSelectAll: () => {},
      },
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
    };
  },
  setup() {
    const dateRangeInput = ref(null);

    // Move the function declaration outside of the onMounted callback
    function booking_range(start, end) {
      return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
    }

    onMounted(() => {
      if (dateRangeInput.value) {
        const start = moment().subtract(6, "days");
        const end = moment();

        new DateRangePicker(
          dateRangeInput.value,
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

        booking_range(start, end);
      }
    });

    return {
      dateRangeInput,
    };
  },
  computed: {
    columns() {
      const { filteredInfo, sortedInfo } = this;
      const filtered = filteredInfo || {};
      const sorted = sortedInfo || {};

      return [
        {
          sorter: false,
        },
        {
          title: "Role",
          dataIndex: "Role",
          key: "Role",
          filters: this.getRoleFilters(),
          filteredValue: filtered.Role || null,
          filterSearch: true,
          onFilter: (value, record) => record.Role.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.Role.toLowerCase();
              b = b.Role.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Role" && sorted.order,
        },
        {
          title: "Created Date",
          dataIndex: "CreatedDate",
          sorter: {
            compare: (a, b) => {
              a = a.CreatedDate.toLowerCase();
              b = b.CreatedDate.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "CreatedDate" && sorted.order,
        },
        {
          title: "Action",
          key: "action",
          sorter: false,
        },
      ];
    }
  },
  async mounted() {
    this.loading = true;
    try {
      // Fetch roles from API
      await this.fetchRoles();
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
    handleChange(pagination, filters, sorter) {
      console.log("Various parameters", pagination, filters, sorter);
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
    },
    clearFilters() {
      this.filteredInfo = null;
    },
    clearAll() {
      this.filteredInfo = null;
      this.sortedInfo = null;
    },
    getRoleFilters() {
      // For now, generate filters from the static data
      // In a real app, this would come from the API
      const roles = [
        "Admin", "HR Manager", "Recruitment Manager", "Payroll Manager",
        "Leave Manager", "Performance Manager", "Reports Analyst", "Employee",
        "Client", "Department Head"
      ];
      return roles.map(role => ({ text: role, value: role }));
    },
    async fetchRoles() {
      try {
        // In a real implementation, you would use the adminService
        const response = await adminService.getAllRoles();
        this.data = response.data.map(role => ({
          key: role.id.toString(),
          Role: role.name,
          CreatedDate: moment(role.created_at).format('DD MMM YYYY')
        }));
        
        this.$message.success('Roles loaded successfully');
        
        // For now, use the static data with keys added
        // this.data = [
        //   {
        //     key: "1",
        //     Role: "Admin",
        //     CreatedDate: "12 Sep 2024",
        //   },
        //   {
        //     key: "2",
        //     Role: "HR Manager",
        //     CreatedDate: "24 Oct 2024",
        //   },
        //   {
        //     key: "3",
        //     Role: "Recruitment Manager",
        //     CreatedDate: "18 Feb 2024",
        //   },
        //   {
        //     key: "4",
        //     Role: "Payroll Manager",
        //     CreatedDate: "17 Oct 2024",
        //   },
        //   {
        //     key: "5",
        //     Role: "Leave Manager",
        //     CreatedDate: "20 Jul 2024",
        //   },
        //   {
        //     key: "6",
        //     Role: "Performance Manager",
        //     CreatedDate: "10 Apr 2024",
        //   },
        //   {
        //     key: "7",
        //     Role: "Reports Analyst",
        //     CreatedDate: "29 Aug 2024",
        //   },
        //   {
        //     key: "8",
        //     Role: "Employee",
        //     CreatedDate: "22 Feb 2024",
        //   },
        //   {
        //     key: "9",
        //     Role: "Client",
        //     CreatedDate: "03 Nov 2024",
        //   },
        //   {
        //     key: "10",
        //     Role: "Department Head",
        //     CreatedDate: "17 Dec 2024",
        //   },
        // ];
      } catch (error) {
        console.error('Error fetching roles:', error);
        this.$message.error('Failed to load roles');
        throw error;
      }
    }
  },
};
</script>

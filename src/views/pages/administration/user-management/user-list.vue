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
              data-bs-target="#add_users"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Add User</a
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

      <!-- Users List -->
      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>Users List</h5>
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
              <p class="mt-2">Loading users...</p>
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
                <template v-if="column.key === 'Name'">
                  <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md avatar-rounded">
                      <img
                        :src="record.profile_picture ? record.profile_picture : require('@/assets/img/users/user-01.jpg')"
                        class="img-fluid"
                        alt="img"
                      />
                    </a>
                    <div class="ms-2">
                      <h6 class="fw-medium">
                        <a href="javascript:void(0);">{{ record.name }}</a>
                      </h6>
                    </div>
                  </div>
                </template>
                <template v-if="column.key === 'Role'">
                  <span
                    :class="[
                      'badge',
                      record.roles && record.roles.length > 0 && record.roles[0].name === 'admin'
                        ? 'badge-danger'
                        : record.roles && record.roles.length > 0 && record.roles[0].name === 'hr-manager'
                        ? 'badge-info'
                        : record.roles && record.roles.length > 0 && record.roles[0].name === 'hr-assistant'
                        ? 'badge-warning'
                        : record.roles && record.roles.length > 0 && record.roles[0].name === 'hr-assistant-junior'
                        ? 'badge-primary'
                        : record.roles && record.roles.length > 0 && record.roles[0].name === 'hr-assistant-senior'
                        ? 'badge-dark'
                        : record.roles && record.roles.length > 0 && record.roles[0].name === 'site-admin'
                        ? 'badge-purple'
                        : record.roles && record.roles.length > 0 && record.roles[0].name === 'employee'
                        ? 'badge-success'
                        : 'badge-secondary',
                      'p-2 fs-10',
                    ]"
                  >
                    {{ record.roles && record.roles.length > 0 ? record.roles[0].name : 'No Role' }}
                  </span>
                </template>
                <template v-if="column.key === 'Status'">
                  <span
                    :class="[
                      'badge',
                      record.status === 'active'
                        ? 'badge-success'
                        : record.status === 'inactive'
                        ? 'badge-danger'
                        : 'd-inline-flex',
                      'align-items-center',
                      'badge-xs',
                    ]"
                  >
                    <i class="ti ti-point-filled me-1"></i>
                    {{ record.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_user"
                      title="Edit User"
                      @click="editUser(record)"
                      ><i class="ti ti-edit"></i
                    ></a>
                    <a
                      href="javascript:void(0);"
                      title="Delete User"
                      @click="confirmDeleteUser(record.id)"
                      ><i class="ti ti-trash"></i
                    ></a>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <!-- /Users List -->
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
  <user-list-modal ref="userListModal" @user-added="fetchUsers" @user-updated="fetchUsers" @user-deleted="fetchUsers"></user-list-modal>
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { useAdminStore } from "@/stores/adminStore";
import UserListModal from "@/components/modal/user-list-modal.vue";

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};

export default {
  components: {
    UserListModal
  },
  data() {
    return {
      title: "Users",
      text: "Administration",
      text1: "Users",
      data: [],
      rowSelection,
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      adminStore: useAdminStore()
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
          title: "Name",
          dataIndex: "name",
          key: "Name",
          filters: this.getNameFilters(),
          filteredValue: filtered.Name || null,
          filterSearch: true,
          onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.name.toLowerCase();
              b = b.name.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Name" && sorted.order,
        },
        {
          title: "Email",
          dataIndex: "email",
          sorter: {
            compare: (a, b) => {
              a = a.email.toLowerCase();
              b = b.email.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Email" && sorted.order,
        },
        {
          title: "Created Date",
          dataIndex: "created_at",
          render: (text) => {
            return moment(text).format('DD MMM YYYY');
          },
          sorter: {
            compare: (a, b) => {
              return moment(a.created_at).unix() - moment(b.created_at).unix();
            },
          },
          sortOrder: sorted.columnKey === "CreatedDate" && sorted.order,
        },
        {
          title: "Role",
          dataIndex: "roles",
          key: "Role",
          filters: [
            { text: "Admin", value: "admin" },
            { text: "HR Manager", value: "hr-manager" },
            { text: "HR Assistant", value: "hr-assistant" },
            { text: "HR Assistant Junior", value: "hr-assistant-junior" },
            { text: "HR Assistant Senior", value: "hr-assistant-senior" },
            { text: "Site Admin", value: "site-admin" },
            { text: "Employee", value: "employee" },
          ],
          filteredValue: filtered.Role || null,
          onFilter: (value, record) => 
            record.roles && 
            record.roles.length > 0 && 
            record.roles[0].name === value,
          sorter: {
            compare: (a, b) => {
              const roleA = a.roles && a.roles.length > 0 ? a.roles[0].name.toLowerCase() : '';
              const roleB = b.roles && b.roles.length > 0 ? b.roles[0].name.toLowerCase() : '';
              return roleA > roleB ? -1 : roleB > roleA ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Role" && sorted.order,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "Status",
          filters: [
            { text: "Active", value: "active" },
            { text: "Inactive", value: "inactive" },
          ],
          filteredValue: filtered.Status || null,
          onFilter: (value, record) => record.status === value,
          sorter: {
            compare: (a, b) => {
              a = a.status.toLowerCase();
              b = b.status.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Status" && sorted.order,
        },
        {
          title: "Action",
          key: "action",
          sorter: false,
        },
      ];
    },
  },
  created() {
    // Fetch users in created hook instead of mounted
    this.fetchUsers();
  },
  mounted() {
    // Initialize date range picker in mounted
    this.initDateRangePicker();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        await this.adminStore.fetchUsers();
        this.data = this.adminStore.users.map(user => ({
          key: user.id.toString(),
          id: user.id,
          name: user.name || 'Unknown',
          email: user.email || '',
          phone: user.phone || '',
          roles: user.roles || [],
          status: user.status || 'inactive',
          created_at: user.created_at ? moment(user.created_at).format('DD/MM/YYYY') : '',
          updated_at: user.updated_at ? moment(user.updated_at).format('DD/MM/YYYY') : '',
          profile_picture: user.profile_picture || null,
          permissions: user.permissions || []
        }));
        this.$message.success('Users loaded successfully');
      } catch (error) {
        console.error('Error loading users:', error);
        this.$message.error('Failed to load users');
      } finally {
        this.loading = false;
      }
    },
    async editUser(record) {
      // Pass the user data to the modal component (async to load user widgets)
      await this.$refs.userListModal.setEditUser(record);
    },
    confirmDeleteUser(userId) {
      // Pass the user ID to the modal component's confirmDelete method
      this.$refs.userListModal.confirmDelete(userId);
    },
    initDateRangePicker() {
      const dateRangeInput = document.getElementById('daterange');
      if (dateRangeInput) {
        const start = moment().subtract(6, "days");
        const end = moment();

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
          this.booking_range
        );

        this.booking_range(start, end);
      }
    },
    booking_range(start, end) {
      return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
    },
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
    getNameFilters() {
      // Generate filters from unique names
      if (!this.adminStore.users || this.adminStore.users.length === 0) {
        return [];
      }
      const names = [...new Set(this.adminStore.users.map(user => user.name))];
      return names.map(name => ({ text: name, value: name }));
    },
  },
};
</script>

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
              ><i class="ti ti-circle-plus me-2"></i>Add Role</a
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

      <!-- Roles List -->
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
                <template v-if="column.key === 'Role'">
                  <div>
                    <strong>{{ record.displayName }}</strong>
                    <br>
                    <small class="text-muted">{{ record.Role }}</small>
                  </div>
                </template>
                <template v-if="column.key === 'Type'">
                  <span
                    :class="[
                      'badge',
                      record.isProtected ? 'badge-warning' : 'badge-success',
                      'd-inline-flex align-items-center'
                    ]"
                  >
                    <i :class="record.isProtected ? 'ti ti-lock me-1' : 'ti ti-check me-1'"></i>
                    {{ record.isProtected ? 'Protected' : 'Custom' }}
                  </span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a
                      v-if="!record.isProtected"
                      href="javascript:void(0);"
                      class="me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_role"
                      title="Edit Role"
                      @click="openEditModal(record)"
                      ><i class="ti ti-edit"></i
                    ></a>
                    <span v-else class="text-muted me-2" title="Protected role cannot be edited">
                      <i class="ti ti-lock"></i>
                    </span>
                    <a
                      v-if="!record.isProtected"
                      href="javascript:void(0);"
                      title="Delete Role"
                      @click="confirmDeleteRole(record)"
                      ><i class="ti ti-trash"></i
                    ></a>
                    <span v-else class="text-muted" title="Protected role cannot be deleted">
                      <i class="ti ti-lock"></i>
                    </span>
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
  <role-list-modal 
    ref="roleListModal" 
    @role-added="fetchRoles" 
    @role-updated="fetchRoles"
  ></role-list-modal>
</template>
<script>
import moment from "moment";
import { roleService } from "@/services/role.service";
import RoleListModal from "@/components/modal/role-list-modal.vue";

export default {
  components: {
    RoleListModal,
  },
  data() {
    return {
      title: "Roles",
      text: "Administration",
      text1: "Roles",
      data: [],
      selectedRole: null,
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
          title: "Type",
          dataIndex: "isProtected",
          key: "Type",
          filters: [
            { text: "Protected", value: true },
            { text: "Custom", value: false },
          ],
          filteredValue: filtered.Type || null,
          onFilter: (value, record) => record.isProtected === value,
        },
        {
          title: "Created Date",
          dataIndex: "CreatedDate",
          sorter: {
            compare: (a, b) => {
              return moment(a.created_at).unix() - moment(b.created_at).unix();
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
    await this.fetchRoles();
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
    handleChange(pagination, filters, sorter) {
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
      const roles = [...new Set(this.data.map(item => item.Role))];
      return roles.map(role => ({ text: role, value: role }));
    },
    openEditModal(record) {
      if (this.$refs.roleListModal) {
        this.$refs.roleListModal.openEdit({
          id: record.id,
          name: record.Role,
        });
      }
    },
    async confirmDeleteRole(record) {
      if (confirm(`Are you sure you want to delete the role "${record.displayName}"?`)) {
        await this.deleteRole(record.id);
      }
    },
    async deleteRole(id) {
      try {
        const response = await roleService.deleteRole(id);
        // BaseService returns response directly
        if (response && (response.success !== false)) {
          this.$message.success(response.message || 'Role deleted successfully');
          await this.fetchRoles();
        } else {
          this.$message.error(response?.message || 'Failed to delete role');
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        // Handle structured errors from BaseService
        const errorMessage = error.message || 'Failed to delete role';
        this.$message.error(errorMessage);
      }
    },
    async fetchRoles() {
      this.loading = true;
      try {
        const response = await roleService.getRoles();
        // BaseService returns response directly - data may be nested or not
        const rolesData = response.data || response || [];
        
        this.data = rolesData.map(role => ({
          key: role.id.toString(),
          id: role.id,
          Role: role.name,
          displayName: role.display_name || this.getDisplayName(role.name),
          isProtected: role.is_protected || ['admin', 'hr-manager'].includes(role.name),
          created_at: role.created_at,
          CreatedDate: moment(role.created_at).format('DD MMM YYYY')
        }));
        
      } catch (error) {
        console.error('Error fetching roles:', error);
        const errorMessage = error.message || 'Failed to load roles';
        this.$message.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    getDisplayName(name) {
      const displayNames = {
        'admin': 'System Administrator',
        'hr-manager': 'HR Manager',
        'employee': 'Employee',
      };
      return displayNames[name] || name.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  },
};
</script>

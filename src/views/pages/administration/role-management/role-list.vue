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
              <i :class="isHeaderCollapsed ? 'ti ti-chevrons-down' : 'ti ti-chevrons-up'"></i>
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
                <template v-if="column.key === 'Name'">
                  <div class="d-flex align-items-center">
                    <div>
                      <h6 class="fw-medium">{{ record.display_name }}</h6>
                      <small class="text-muted">{{ record.name }}</small>
                    </div>
                  </div>
                </template>
                <template v-if="column.key === 'Status'">
                  <span
                    :class="[
                      'badge',
                      record.is_protected ? 'badge-danger' : 'badge-success',
                      'p-2 fs-10',
                    ]"
                  >
                    {{ record.is_protected ? 'Protected' : 'Custom' }}
                  </span>
                </template>
                <template v-if="column.key === 'UsersCount'">
                  <span class="badge badge-info p-2">
                    {{ record.users_count || 0 }} user(s)
                  </span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a
                      v-if="!record.is_protected"
                      href="javascript:void(0);"
                      class="me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_role"
                      title="Edit Role"
                      @click="editRole(record)"
                      ><i class="ti ti-edit"></i
                    ></a>
                    <span v-else class="text-muted me-2" title="Protected role cannot be edited">
                      <i class="ti ti-lock"></i>
                    </span>
                    <a
                      v-if="!record.is_protected"
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
      <!-- /Roles List -->
    </div>

    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 © SmartHR.</p>
      <p>
        Designed & Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <role-list-modal ref="roleListModal" @role-added="fetchRoles" @role-updated="fetchRoles" @role-deleted="fetchRoles"></role-list-modal>
</template>

<script>
import moment from "moment";
import { roleService } from "@/services/role.service";
import RoleListModal from "@/components/modal/role-list-modal.vue";

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};

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
      rowSelection,
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      isHeaderCollapsed: false,
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
          title: "Role Name",
          dataIndex: "display_name",
          key: "Name",
          filters: this.getNameFilters(),
          filteredValue: filtered.Name || null,
          filterSearch: true,
          onFilter: (value, record) =>
            record.display_name.toLowerCase().includes(value.toLowerCase()) ||
            record.name.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.display_name.toLowerCase();
              b = b.display_name.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Name" && sorted.order,
        },
        {
          title: "Created Date",
          dataIndex: "created_at",
          render: (text) => {
            return text ? moment(text).format('DD MMM YYYY') : '-';
          },
          sorter: {
            compare: (a, b) => {
              return moment(a.created_at).unix() - moment(b.created_at).unix();
            },
          },
          sortOrder: sorted.columnKey === "CreatedDate" && sorted.order,
        },
        {
          title: "Type",
          dataIndex: "is_protected",
          key: "Status",
          filters: [
            { text: "Protected", value: true },
            { text: "Custom", value: false },
          ],
          filteredValue: filtered.Status || null,
          onFilter: (value, record) => record.is_protected === value,
          sorter: {
            compare: (a, b) => {
              return a.is_protected === b.is_protected ? 0 : a.is_protected ? -1 : 1;
            },
          },
          sortOrder: sorted.columnKey === "Status" && sorted.order,
        },
        {
          title: "Users Count",
          dataIndex: "users_count",
          key: "UsersCount",
          sorter: {
            compare: (a, b) => a.users_count - b.users_count,
          },
          sortOrder: sorted.columnKey === "UsersCount" && sorted.order,
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
    this.fetchRoles();
  },
  methods: {
    async fetchRoles() {
      this.loading = true;
      try {
        const response = await roleService.getRoles();
        this.data = response.data.map(role => ({
          key: role.id.toString(),
          id: role.id,
          name: role.name,
          display_name: role.display_name,
          is_protected: role.is_protected,
          users_count: role.users_count || 0,
          created_at: role.created_at,
          updated_at: role.updated_at,
        }));
        this.$message.success('Roles loaded successfully');
      } catch (error) {
        console.error('Error loading roles:', error);
        this.$message.error('Failed to load roles');
      } finally {
        this.loading = false;
      }
    },
    editRole(record) {
      this.$refs.roleListModal.openEdit(record);
    },
    async confirmDeleteRole(record) {
      if (record.users_count > 0) {
        this.$message.warning(`Cannot delete role "${record.display_name}". ${record.users_count} user(s) are assigned to this role.`);
        return;
      }

      const confirmed = await this.$confirm({
        title: 'Delete Role?',
        content: `Are you sure you want to delete the role "${record.display_name}"? This action cannot be undone.`,
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
      });

      if (confirmed) {
        this.deleteRole(record.id);
      }
    },
    async deleteRole(id) {
      try {
        const response = await roleService.deleteRole(id);
        if (response.data.success) {
          this.$message.success('Role deleted successfully');
          await this.fetchRoles();
        } else {
          this.$message.error(response.data.message || 'Failed to delete role');
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete role';
        this.$message.error(errorMessage);
      }
    },
    getNameFilters() {
      const uniqueNames = [...new Set(this.data.map(item => item.display_name))];
      return uniqueNames.map(name => ({ text: name, value: name }));
    },
    toggleHeader() {
      const collapseBtn = document.getElementById('collapse-header');
      
      if (collapseBtn) {
        collapseBtn.classList.toggle('active');
        document.body.classList.toggle('header-collapse');
        this.isHeaderCollapsed = !this.isHeaderCollapsed;
      }
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
  },
};
</script>

<style scoped>
.action-icon a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.3s;
}

.action-icon a:hover {
  background-color: #f5f5f5;
}

.action-icon .text-muted {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

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
          <!-- Add Department Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2">
            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_department_modal"
              class="btn btn-primary d-flex align-items-center">
              <i class="ti ti-circle-plus me-2"></i>Add Department
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

      <!-- Departments List -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Departments List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search
                v-model:value="searchValue"
                placeholder="Search by name..."
                enter-button="Search"
                @search="handleSearch"
                @change="onSearchChange"
                style="width: 250px;"
                class="search-input-primary"
              />
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading departments...</p>
            </div>

            <a-table v-else class="table datatable thead-light" :columns="columns" :data-source="data"
              :row-selection="canEdit ? rowSelection : null" 
              :pagination="paginationConfig"
              @change="handleChange">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'id'">
                  <span>{{ record.id }}</span>
                </template>
                <template v-if="column.key === 'name'">
                  <span class="fw-medium">{{ record.name }}</span>
                </template>
                <template v-if="column.key === 'description'">
                  <span>{{ record.description || '-' }}</span>
                </template>
                <template v-if="column.key === 'status'">
                  <span :class="record.is_active ? 'badge badge-success' : 'badge badge-danger'">
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </template>
                <template v-if="column.key === 'positions'">
                  <span>{{ record.active_positions_count || 0 }} / {{ record.positions_count || 0 }}</span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <!-- View - Always visible -->
                    <a href="javascript:void(0);" class="me-2" title="View Department" @click="editDepartment(record)">
                      <i class="ti ti-eye"></i>
                    </a>
                    <!-- Edit - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      class="me-2" 
                      title="Edit Department" 
                      @click="editDepartment(record)"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <!-- Delete - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      title="Delete Department" 
                      @click="confirmDeleteDepartment(record.id)"
                    >
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <!-- /Departments List -->
    </div>

    <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>Designed &amp; Developed By <a href="javascript:void(0);" class="text-primary">Dreams</a></p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <DepartmentModal ref="departmentModal" @department-added="fetchDepartments" @department-updated="fetchDepartments"></DepartmentModal>
</template>

<script>
import moment from "moment";
import { useDepartmentStore } from "@/stores/departmentStore";
import DepartmentModal from "@/components/modal/department-modal.vue";
import { usePermissions } from '@/composables/usePermissions';

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};

export default {
  components: {
    DepartmentModal
  },
  setup() {
    // Initialize permission checks for departments module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('departments');
    
    return {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    };
  },
  data() {
    return {
      title: "Departments",
      text: "Administration",
      text1: "Departments",
      data: [],
      rowSelection,
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      departmentStore: useDepartmentStore(),
      searchValue: '',
      searchTimeout: null,
    };
  },
  computed: {
    paginationConfig() {
      return {
        current: this.departmentStore.currentPage,
        pageSize: this.departmentStore.pageSize,
        total: this.departmentStore.total,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        pageSizeOptions: ['10', '20', '50', '100'],
      };
    },
    columns() {
      const { filteredInfo, sortedInfo } = this;
      const filtered = filteredInfo || {};
      const sorted = sortedInfo || {};

      return [
        {
          sorter: false,
        },
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          sorter: {
            compare: (a, b) => a.id - b.id,
          },
          sortOrder: sorted.columnKey === "id" && sorted.order,
        },
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          filters: this.getNameFilters(),
          filteredValue: filtered.name || null,
          filterSearch: true,
          onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.name.toLowerCase();
              b = b.name.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "name" && sorted.order,
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
        },
        {
          title: "Status",
          dataIndex: "is_active",
          key: "status",
          filters: [
            { text: 'Active', value: true },
            { text: 'Inactive', value: false },
          ],
          filteredValue: filtered.status || null,
          onFilter: (value, record) => record.is_active === value,
        },
        {
          title: "Positions (Active/Total)",
          dataIndex: "positions_count",
          key: "positions",
          sorter: {
            compare: (a, b) => (a.positions_count || 0) - (b.positions_count || 0),
          },
          sortOrder: sorted.columnKey === "positions" && sorted.order,
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
          title: "Action",
          key: "action",
          sorter: false,
        },
      ];
    },
  },
  created() {
    this.fetchDepartments();
  },
  methods: {
    async fetchDepartments() {
      this.loading = true;
      try {
        await this.departmentStore.fetchDepartments();
        this.data = this.departmentStore.departments.map(dept => ({
          key: dept.id.toString(),
          id: dept.id,
          name: dept.name || '',
          description: dept.description || '',
          is_active: dept.is_active,
          positions_count: dept.positions_count || 0,
          active_positions_count: dept.active_positions_count || 0,
          created_at: dept.created_at ? moment(dept.created_at).format('DD/MM/YYYY') : '',
          updated_at: dept.updated_at ? moment(dept.updated_at).format('DD/MM/YYYY') : '',
        }));
        this.$message.success('Departments loaded successfully');
      } catch (error) {
        console.error('Error loading departments:', error);
        this.$message.error('Failed to load departments');
      } finally {
        this.loading = false;
      }
    },

    editDepartment(record) {
      this.$refs.departmentModal.setEditDepartment(record);
    },

    confirmDeleteDepartment(departmentId) {
      this.$refs.departmentModal.confirmDeleteDepartment(departmentId);
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    handleChange(pagination, filters, sorter) {
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      
      // Handle pagination changes
      if (pagination.current !== this.departmentStore.currentPage || pagination.pageSize !== this.departmentStore.pageSize) {
        this.departmentStore.setPage(pagination.current);
        if (pagination.pageSize !== this.departmentStore.pageSize) {
          this.departmentStore.setPageSize(pagination.pageSize);
        }
        this.fetchDepartments();
      }
    },

    clearFilters() {
      this.filteredInfo = null;
    },

    clearAll() {
      this.filteredInfo = null;
      this.sortedInfo = null;
      this.searchValue = '';
      this.departmentStore.setSearchValue('');
      this.fetchDepartments();
    },

    handleSearch(value) {
      this.departmentStore.setSearchValue(value);
      this.fetchDepartments();
    },

    onSearchChange(e) {
      const value = e.target.value;
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.departmentStore.setSearchValue(value);
        this.fetchDepartments();
      }, 500);
    },

    getNameFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      const names = [...new Set(this.data.map(item => item.name))];
      return names.map(name => ({ text: name, value: name }));
    },
  },
};
</script>

<style scoped>
/* Pagination dropdown fixes */
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

/* Ensure select selector is properly displayed */
:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

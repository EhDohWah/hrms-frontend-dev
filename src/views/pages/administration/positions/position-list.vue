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
          <!-- Add Position Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2">
            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_position_modal"
              class="btn btn-primary d-flex align-items-center">
              <i class="ti ti-circle-plus me-2"></i>Add Position
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

      <!-- Positions List -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Positions List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search
                v-model:value="searchValue"
                placeholder="Search by title..."
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
              <p class="mt-2">Loading positions...</p>
            </div>

            <a-table v-else class="table datatable thead-light" :columns="columns" :data-source="data"
              :row-selection="canEdit ? rowSelection : null" 
              :pagination="paginationConfig"
              @change="handleChange">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'id'">
                  <span>{{ record.id }}</span>
                </template>
                <template v-if="column.key === 'title'">
                  <span class="fw-medium">{{ record.title }}</span>
                </template>
                <template v-if="column.key === 'department'">
                  <span class="badge badge-primary p-2 fs-10">{{ record.department_name }}</span>
                </template>
                <template v-if="column.key === 'reportsTo'">
                  <span>{{ record.reports_to_title || 'None' }}</span>
                </template>
                <template v-if="column.key === 'level'">
                  <span>Level {{ record.level }}</span>
                </template>
                <template v-if="column.key === 'isManager'">
                  <span :class="record.is_manager ? 'badge badge-info' : 'badge badge-secondary'">
                    {{ record.is_manager ? 'Manager' : 'Staff' }}
                  </span>
                </template>
                <template v-if="column.key === 'status'">
                  <span :class="record.is_active ? 'badge badge-success' : 'badge badge-danger'">
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <!-- View - Always visible -->
                    <a href="javascript:void(0);" class="me-2" title="View Position" @click="editPosition(record)">
                      <i class="ti ti-eye"></i>
                    </a>
                    <!-- Edit - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      class="me-2" 
                      title="Edit Position" 
                      @click="editPosition(record)"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <!-- Delete - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      title="Delete Position" 
                      @click="confirmDeletePosition(record.id)"
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
      <!-- /Positions List -->
    </div>

    <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>Designed &amp; Developed By <a href="javascript:void(0);" class="text-primary">Dreams</a></p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <PositionModal ref="positionModal" @position-added="fetchPositions" @position-updated="fetchPositions"></PositionModal>
</template>

<script>
import moment from "moment";
import { usePositionStore } from "@/stores/positionStore";
import { useDepartmentStore } from "@/stores/departmentStore";
import PositionModal from "@/components/modal/position-modal.vue";
import { usePermissions } from '@/composables/usePermissions';

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};

export default {
  components: {
    PositionModal
  },
  setup() {
    // Initialize permission checks for positions module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('positions');
    
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
      title: "Positions",
      text: "Administration",
      text1: "Positions",
      data: [],
      rowSelection,
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      positionStore: usePositionStore(),
      departmentStore: useDepartmentStore(),
      searchValue: '',
      searchTimeout: null,
    };
  },
  computed: {
    paginationConfig() {
      return {
        current: this.positionStore.currentPage,
        pageSize: this.positionStore.pageSize,
        total: this.positionStore.total,
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
          title: "Title",
          dataIndex: "title",
          key: "title",
          filters: this.getTitleFilters(),
          filteredValue: filtered.title || null,
          filterSearch: true,
          onFilter: (value, record) => record.title.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.title.toLowerCase();
              b = b.title.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "title" && sorted.order,
        },
        {
          title: "Department",
          dataIndex: "department_name",
          key: "department",
          filters: this.getDepartmentFilters(),
          filteredValue: filtered.department || null,
          filterSearch: true,
          onFilter: (value, record) => record.department_name.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.department_name.toLowerCase();
              b = b.department_name.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "department" && sorted.order,
        },
        {
          title: "Reports To",
          dataIndex: "reports_to_title",
          key: "reportsTo",
          filters: this.getReportsToFilters(),
          filteredValue: filtered.reportsTo || null,
          onFilter: (value, record) => {
            if (value === "none") {
              return !record.reports_to_title;
            }
            return record.reports_to_title === value;
          },
        },
        {
          title: "Level",
          dataIndex: "level",
          key: "level",
          sorter: {
            compare: (a, b) => (a.level || 0) - (b.level || 0),
          },
          sortOrder: sorted.columnKey === "level" && sorted.order,
        },
        {
          title: "Type",
          dataIndex: "is_manager",
          key: "isManager",
          filters: [
            { text: 'Manager', value: true },
            { text: 'Staff', value: false },
          ],
          filteredValue: filtered.isManager || null,
          onFilter: (value, record) => record.is_manager === value,
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
    this.fetchPositions();
  },
  methods: {
    async fetchPositions() {
      this.loading = true;
      try {
        await this.positionStore.fetchPositions();
        this.data = this.positionStore.positions.map(pos => ({
          key: pos.id.toString(),
          id: pos.id,
          title: pos.title || '',
          department_id: pos.department_id,
          department_name: pos.department_name || '',
          reports_to_position_id: pos.reports_to_position_id,
          reports_to_title: pos.reports_to_title || '',
          level: pos.level || 1,
          is_manager: pos.is_manager || false,
          is_active: pos.is_active,
          direct_reports_count: pos.direct_reports_count || 0,
          created_at: pos.created_at ? moment(pos.created_at).format('DD/MM/YYYY') : '',
          updated_at: pos.updated_at ? moment(pos.updated_at).format('DD/MM/YYYY') : '',
        }));
        this.$message.success('Positions loaded successfully');
      } catch (error) {
        console.error('Error loading positions:', error);
        this.$message.error('Failed to load positions');
      } finally {
        this.loading = false;
      }
    },

    editPosition(record) {
      this.$refs.positionModal.setEditPosition(record);
    },

    confirmDeletePosition(positionId) {
      this.$refs.positionModal.confirmDeletePosition(positionId);
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    handleChange(pagination, filters, sorter) {
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      
      // Handle pagination changes
      if (pagination.current !== this.positionStore.currentPage || pagination.pageSize !== this.positionStore.pageSize) {
        this.positionStore.setPage(pagination.current);
        if (pagination.pageSize !== this.positionStore.pageSize) {
          this.positionStore.setPageSize(pagination.pageSize);
        }
        this.fetchPositions();
      }
    },

    clearFilters() {
      this.filteredInfo = null;
    },

    clearAll() {
      this.filteredInfo = null;
      this.sortedInfo = null;
      this.searchValue = '';
      this.positionStore.setSearchValue('');
      this.fetchPositions();
    },

    handleSearch(value) {
      this.positionStore.setSearchValue(value);
      this.fetchPositions();
    },

    onSearchChange(e) {
      const value = e.target.value;
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.positionStore.setSearchValue(value);
        this.fetchPositions();
      }, 500);
    },

    getTitleFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      const titles = [...new Set(this.data.map(item => item.title))];
      return titles.map(title => ({ text: title, value: title }));
    },

    getDepartmentFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      const departments = [...new Set(this.data.map(item => item.department_name).filter(d => d))];
      return departments.map(dept => ({ text: dept, value: dept }));
    },

    getReportsToFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      
      const filters = [{ text: 'None', value: 'none' }];
      const reportsTos = [...new Set(this.data.map(item => item.reports_to_title).filter(r => r))];
      reportsTos.forEach(r => {
        filters.push({ text: r, value: r });
      });
      
      return filters;
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

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
          <!-- Add Site Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2">
            <a href="javascript:void(0);" @click="openCreateModal"
              class="btn btn-primary d-flex align-items-center">
              <i class="ti ti-circle-plus me-2"></i>Add Site
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

      <!-- Sites List -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Sites List</h5>
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
              <p class="mt-2">Loading sites...</p>
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
                <template v-if="column.key === 'code'">
                  <span class="badge badge-primary p-2 fs-10">{{ record.code }}</span>
                </template>
                <template v-if="column.key === 'status'">
                  <span :class="record.is_active ? 'badge badge-success' : 'badge badge-danger'">
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </template>
                <template v-if="column.key === 'employments'">
                  <span>{{ record.active_employments_count || 0 }}</span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <!-- View - Always visible -->
                    <a href="javascript:void(0);" class="me-2" title="View Site" @click="editSite(record)">
                      <i class="ti ti-eye"></i>
                    </a>
                    <!-- Edit - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      class="me-2" 
                      title="Edit Site" 
                      @click="editSite(record)"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <!-- Delete - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      title="Delete Site" 
                      @click="confirmDeleteSite(record.id)"
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
      <!-- /Sites List -->
    </div>

    <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>Designed &amp; Developed By <a href="javascript:void(0);" class="text-primary">Dreams</a></p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <site-modal :visible="modalVisible" :editing-record="editingRecord" @saved="handleSaved" @close="closeModal" />
</template>

<script>
import moment from "moment";
import { useSiteStore } from "@/stores/siteStore";
import { siteService } from "@/services/site.service";
import { usePermissions } from '@/composables/usePermissions';
import { Modal, message } from 'ant-design-vue';

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};

export default {
  setup() {
    // Initialize permission checks for sites module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('sites');
    
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
      title: "Sites",
      text: "Administration",
      text1: "Sites",
      data: [],
      rowSelection,
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      siteStore: useSiteStore(),
      searchValue: '',
      searchTimeout: null,
      modalVisible: false,
      editingRecord: null,
    };
  },
  computed: {
    paginationConfig() {
      return {
        current: this.siteStore.currentPage,
        pageSize: this.siteStore.pageSize,
        total: this.siteStore.total,
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
          title: "Code",
          dataIndex: "code",
          key: "code",
          sorter: {
            compare: (a, b) => {
              a = a.code.toLowerCase();
              b = b.code.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "code" && sorted.order,
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
          title: "Active Employments",
          dataIndex: "active_employments_count",
          key: "employments",
          sorter: {
            compare: (a, b) => (a.active_employments_count || 0) - (b.active_employments_count || 0),
          },
          sortOrder: sorted.columnKey === "employments" && sorted.order,
        },
        {
          title: "Created Date",
          dataIndex: "created_at",
          render: (text) => {
            return moment(text).format('DD/MM/YYYY');
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
    this.fetchSites();
  },
  methods: {
    async fetchSites() {
      this.loading = true;
      try {
        await this.siteStore.fetchSites();
        this.data = this.siteStore.sites.map(site => ({
          key: site.id.toString(),
          id: site.id,
          name: site.name || '',
          code: site.code || '',
          description: site.description || '',
          address: site.address || '',
          contact_person: site.contact_person || '',
          contact_phone: site.contact_phone || '',
          contact_email: site.contact_email || '',
          is_active: site.is_active,
          employments_count: site.employments_count || 0,
          active_employments_count: site.active_employments_count || 0,
          created_at: site.created_at ? moment(site.created_at).format('DD/MM/YYYY') : '',
          updated_at: site.updated_at ? moment(site.updated_at).format('DD/MM/YYYY') : '',
        }));
        this.$message.success('Sites loaded successfully');
      } catch (error) {
        console.error('Error loading sites:', error);
        this.$message.error('Failed to load sites');
      } finally {
        this.loading = false;
      }
    },

    openCreateModal() {
      this.editingRecord = null;
      this.modalVisible = true;
    },

    editSite(record) {
      this.editingRecord = record;
      this.modalVisible = true;
    },

    closeModal() {
      this.modalVisible = false;
      this.editingRecord = null;
    },

    handleSaved() {
      this.closeModal();
      this.fetchSites();
    },

    confirmDeleteSite(siteId) {
      Modal.confirm({
        title: 'Delete Site',
        content: 'Are you sure you want to delete this site? This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
        onOk: async () => {
          try {
            const response = await siteService.deleteSite(siteId);
            if (response.success) {
              message.success('Site deleted successfully');
              this.fetchSites();
            } else {
              message.error(response.message || 'Failed to delete site');
            }
          } catch (error) {
            message.error(error.message || 'Failed to delete site');
          }
        },
      });
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    handleChange(pagination, filters, sorter) {
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      
      // Handle pagination changes
      if (pagination.current !== this.siteStore.currentPage || pagination.pageSize !== this.siteStore.pageSize) {
        this.siteStore.setPage(pagination.current);
        if (pagination.pageSize !== this.siteStore.pageSize) {
          this.siteStore.setPageSize(pagination.pageSize);
        }
        this.fetchSites();
      }
    },

    clearFilters() {
      this.filteredInfo = null;
    },

    clearAll() {
      this.filteredInfo = null;
      this.sortedInfo = null;
      this.searchValue = '';
      this.siteStore.setSearchValue('');
      this.fetchSites();
    },

    handleSearch(value) {
      this.siteStore.setSearchValue(value);
      this.fetchSites();
    },

    onSearchChange(e) {
      const value = e.target.value;
      // Clear any existing timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      // Debounce search - wait 500ms after user stops typing
      this.searchTimeout = setTimeout(() => {
        this.siteStore.setSearchValue(value);
        this.fetchSites();
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

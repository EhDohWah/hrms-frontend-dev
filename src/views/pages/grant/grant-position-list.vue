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
              v-if="isReadOnlyGrantPositions" 
              class="badge bg-warning text-dark ms-3 d-flex align-items-center"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="You have view-only access to this module"
            >
              <i class="ti ti-eye me-1"></i> Read Only
            </span>
          </div>
          <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <!-- <div class="mb-2 me-2">
              <button class="btn btn-primary d-flex align-items-center" @click="openAddGrantPositionModal">
                <i class="ti ti-circle-plus me-2"></i>Add Grant Position
              </button>
            </div> -->
            <div class="ms-2 head-icons">
              <a href="javascript:void(0);" :class="{ active: isCollapsed }" @click="toggleCollapse" id="collapse-header">
                <i class="ti ti-chevrons-up"></i>
              </a>
            </div>
          </div>
        </div>
        <!-- /Breadcrumb -->

        <div class="card">
          <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h5>Grant Positions List</h5>
            <div class="d-flex align-items-center flex-wrap row-gap-2">
              <!-- Table Operations -->
              <div class="me-2">
                <a-dropdown>
                  <a-button>
                    View: <strong>{{ viewMode === 'all' ? ' All' : ' Vacant' }}</strong>
                    <i class="ti ti-chevron-down ms-1"></i>
                  </a-button>
                  <template #overlay>
                    <a-menu @click="onViewModeChange">
                      <a-menu-item key="all">All Positions</a-menu-item>
                      <a-menu-item key="vacant">Vacant Positions</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
                <a-button class="ms-2" @click="clearFilters">Clear filters</a-button>
                <a-button class="ms-2" @click="clearAll">Clear filters and sorters</a-button>
              </div>
              <!-- Search Input -->
              <div class="input-icon-end">
                <a-input-search v-model:value="searchTerm" placeholder="Search grant code or position..."
                  :loading="searchLoading" enter-button="Search" @search="handleSearch" style="width: 280px;"
                  class="search-input-primary" />
              </div>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading grant positions...</p>
            </div>
            <div v-else class="resize-observer-fix">
              <a-table :columns="columns" :data-source="tableData" :pagination="false"
                :scroll="{ x: 'max-content' }" row-key="id" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'actions'">
                    <div class="action-icon d-inline-flex">
                      <router-link :to="`/grant/grant-position-details/${record.id}`" class="me-2">
                        <i class="ti ti-eye"></i>
                      </router-link>
                    </div>
                  </template>
                </template>
              </a-table>

              <!-- Separate Pagination Component -->
              <div class="pagination-wrapper">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="pagination-info"></div>
                  <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="total"
                    :show-size-changer="true" :show-quick-jumper="true" :page-size-options="['10', '20', '50', '100']"
                    :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                    @change="handlePaginationChange" @show-size-change="handleSizeChange" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <layout-footer></layout-footer>
    </div>

    <!-- Grant Position Modal -->
    <grant-position-modal ref="grantPositionModal" @childSubmit="handleGrantPositionSubmit" />

    <!-- Notification Toast - z-index 2000 to appear above modals -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 2000">
      <div id="notificationToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header" :class="notificationClass">
          <strong class="me-auto">{{ notificationTitle }}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ notificationMessage }}
        </div>
      </div>
    </div>
  </template>

<script>
import { Toast } from 'bootstrap';
import { Modal as AntModal } from 'ant-design-vue';
import GrantPositionModal from '@/components/modal/grant-position-modal.vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useGrantStore } from '@/stores/grantStore';
import { ref } from 'vue';
import { usePermissions } from '@/composables/usePermissions';

export default {
  name: 'GrantPositionList',
  components: {
    GrantPositionModal,
    indexBreadcrumb
  },
  setup() {
    // Initialize permission checks for grant_positions module
    const {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    } = usePermissions('grant_positions');

    const filteredInfo = ref({});
    const sortedInfo = ref({});
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const grantStore = useGrantStore();

    return {
      filteredInfo,
      sortedInfo,
      currentPage,
      pageSize,
      total,
      grantStore,
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    };
  },
  data() {
    return {
      title: 'Grant Positions',
      text: 'Grants',
      text1: 'Grant Positions',
      grantPositions: [],
      loading: false,
      searchLoading: false,
      searchTerm: '',
      notificationTitle: '',
      notificationMessage: '',
      notificationClass: '',
      viewMode: 'all',
      isCollapsed: false
    };
  },
  computed: {
    // Permission checks - primary source for reactivity
    canEditGrantPositions() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasEdit = Array.isArray(permissions) && permissions.includes('grant_positions.edit');
        return hasEdit || (this.canEdit?.value ?? false);
      } catch (e) {
        console.error('[GrantPositionsList] Error checking permissions:', e);
        return this.canEdit?.value ?? false;
      }
    },
    canReadGrantPositions() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasRead = Array.isArray(permissions) && permissions.includes('grant_positions.read');
        return hasRead || (this.canRead?.value ?? false);
      } catch (e) {
        return this.canRead?.value ?? false;
      }
    },
    isReadOnlyGrantPositions() {
      return this.canReadGrantPositions && !this.canEditGrantPositions;
    },
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: 'Grant Code',
          dataIndex: 'code',
          key: 'code',
          filters: this.getUniqueValues('code'),
          filteredValue: filtered.code || null,
          onFilter: (value, record) => record.code.includes(value),
          sorter: (a, b) => a.code.localeCompare(b.code),
          sortOrder: sorted.columnKey === 'code' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Grant Name',
          dataIndex: 'grantName',
          key: 'grantName',
          sorter: (a, b) => a.grantName.localeCompare(b.grantName),
          sortOrder: sorted.columnKey === 'grantName' && sorted.order,
        },
        {
          title: 'Budget Line',
          dataIndex: 'budgetLine',
          key: 'budgetLine',
          filters: this.getUniqueValues('budgetLine'),
          filteredValue: filtered.budgetLine || null,
          onFilter: (value, record) => record.budgetLine.includes(value),
          sorter: (a, b) => a.budgetLine.localeCompare(b.budgetLine),
          sortOrder: sorted.columnKey === 'budgetLine' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Grant Position',
          dataIndex: 'positionName',
          key: 'positionName',
          filters: this.getUniqueValues('positionName'),
          filteredValue: filtered.positionName || null,
          onFilter: (value, record) => record.positionName.includes(value),
          sorter: (a, b) => a.positionName.localeCompare(b.positionName),
          sortOrder: sorted.columnKey === 'positionName' && sorted.order,
        },
        {
          title: 'ManPower',
          dataIndex: 'manPower',
          key: 'manPower',
          sorter: (a, b) => a.manPower - b.manPower,
          sortOrder: sorted.columnKey === 'manPower' && sorted.order,
        },
        {
          title: 'Recruited',
          dataIndex: 'recruited',
          key: 'recruited',
          sorter: (a, b) => a.recruited - b.recruited,
          sortOrder: sorted.columnKey === 'recruited' && sorted.order,
        },
        {
          title: 'Finding',
          dataIndex: 'finding',
          key: 'finding',
          sorter: (a, b) => a.finding - b.finding,
          sortOrder: sorted.columnKey === 'finding' && sorted.order,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: 'Active', value: 'Active' },
            { text: 'Pending', value: 'Pending' },
            { text: 'Completed', value: 'Completed' },
          ],
          filteredValue: filtered.status || null,
          onFilter: (value, record) => record.status === value,
          sorter: (a, b) => a.status.localeCompare(b.status),
          sortOrder: sorted.columnKey === 'status' && sorted.order,
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
        },
      ];
    },
    filteredPositions() {
      if (this.viewMode === 'vacant') {
        return this.grantPositions.filter(pos => pos.manPower > pos.recruited);
      }
      return this.grantPositions;
    },
    tableData() {
      return this.filteredPositions.map(position => ({
        ...position,
        key: position.id
      }));
    }
  },
  mounted() {
    this.fetchGrantPositions();
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        document.body.classList.add("header-collapse");
      } else {
        document.body.classList.remove("header-collapse");
      }
    },

    getUniqueValues(field) {
      const values = [...new Set(this.grantPositions.map(item => item[field]))];
      return values.map(value => ({ text: value, value }));
    },

    // Build API params preserving current search and pagination state
    buildApiParams(overrides = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...overrides
      };

      // Add search parameter if present
      if (this.searchTerm && this.searchTerm.trim()) {
        params.search = this.searchTerm.trim();
      }

      return params;
    },

    // Handle table sorting/filtering changes (client-side column filters still work)
    handleTableChange(pagination, filters, sorter) {
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
    },

    // Server-side pagination: page change
    handlePaginationChange(page, pageSize) {
      this.currentPage = page;
      this.pageSize = pageSize || this.pageSize;
      this.fetchGrantPositions(this.buildApiParams({ page, per_page: this.pageSize }));
    },

    // Server-side pagination: page size change
    handleSizeChange(current, size) {
      this.currentPage = 1;
      this.pageSize = size;
      this.fetchGrantPositions(this.buildApiParams({ page: 1, per_page: size }));
    },

    // Search handler - triggered by search button or Enter key
    handleSearch() {
      this.searchLoading = true;
      this.currentPage = 1;
      this.filteredInfo = {};
      this.sortedInfo = {};

      this.fetchGrantPositions(this.buildApiParams({ page: 1 }));
    },

    clearFilters() {
      this.filteredInfo = {};
    },

    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchTerm = '';
      this.currentPage = 1;
      this.fetchGrantPositions(this.buildApiParams({ page: 1 }));
    },

    async fetchGrantPositions(params = {}) {
      this.loading = true;

      try {
        // Build default params if none provided (initial load)
        const queryParams = Object.keys(params).length > 0
          ? params
          : this.buildApiParams();

        const response = await this.grantStore.fetchGrantPositions(queryParams);

        if (this.grantStore.grantPositions) {
          // Transform the API response to match our table structure
          const positions = [];

          this.grantStore.grantPositions.forEach(grant => {
            grant.positions.forEach(position => {
              positions.push({
                id: position.id,
                code: grant.grant_code,
                grantName: grant.grant_name,
                budgetLine: position.budgetline_code,
                positionName: position.position,
                manPower: parseInt(position.manpower),
                recruited: position.recruited,
                finding: position.finding,
                status: grant.status || 'Active',
                grant_id: grant.grant_id
              });
            });
          });

          this.grantPositions = positions;

          // Update pagination from server response
          if (response && response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
            this.pageSize = response.pagination.per_page;
          } else {
            this.total = positions.length;
          }

          this.$message.success('Grant positions loaded successfully');
        }
      } catch (error) {
        console.error('Error fetching grant positions:', error);
        this.grantPositions = [];
        this.total = 0;
        this.$message.error('Failed to load grant positions');
      } finally {
        this.loading = false;
        this.searchLoading = false;
      }
    },

    openAddGrantPositionModal() {
      this.$refs.grantPositionModal.openModal();
    },

    openEditGrantPositionModal(position) {
      this.$refs.grantPositionModal.openModal(position);
    },

    async handleGrantPositionSubmit(response) {
      this.loading = true;
      try {
        if (response.success) {
          this.$message.success(response.message || 'Grant position saved successfully');
          try {
            await this.fetchGrantPositions();
          } catch (fetchError) {
            this.$message.warning('Position saved but could not refresh the list');
          }
        } else {
          this.$message.error(response.message || 'Failed to save grant position');
        }
      } catch (error) {
        this.$message.error('An unexpected error occurred while processing your request');
      } finally {
        this.loading = false;
      }
    },

    async deleteGrantPosition(id) {
      try {
        await new Promise((resolve) => {
          AntModal.confirm({
            title: 'Are you sure?',
            content: 'You are about to delete this grant position. This action cannot be undone.',
            centered: true,
            okText: 'Yes, delete',
            cancelText: 'Cancel',
            onOk: async () => {
              this.loading = true;
              try {
                this.grantPositions = this.grantPositions.filter(pos => pos.id !== id);
                this.total = this.grantPositions.length;
                this.$message.success('Grant position deleted successfully');
                resolve();
              } catch (error) {
                console.error('Error deleting grant position:', error);
                this.$message.error('Failed to delete grant position');
                resolve();
              } finally {
                this.loading = false;
              }
            },
            onCancel: () => {
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Delete confirmation failed:', error);
      }
    },

    showNotification(title, message, className) {
      this.notificationTitle = title;
      this.notificationMessage = message;
      this.notificationClass = className;

      const toastEl = document.getElementById('notificationToast');
      const toast = new Toast(toastEl);
      toast.show();
    },

    onViewModeChange({ key }) {
      this.viewMode = key;
      // Reset filters when changing view mode
      this.filteredInfo = {};
    }
  }
};
</script>

<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  min-width: 80px;
}

/* Primary color styling for search input button */
.search-input-primary :deep(.ant-input-search-button) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.search-input-primary :deep(.ant-input-search-button:hover) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.search-input-primary :deep(.ant-input-search-button:focus) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

/* Pagination wrapper styling */
.pagination-wrapper {
  margin-top: 20px;
  padding: 20px 16px;
  border-top: 1px solid #e8e8e8;
  position: relative;
  z-index: 100;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

/* Ensure pagination is not overlapping */
.resize-observer-fix {
  position: relative;
  min-height: 100px;
}

/* Ant Design pagination customization */
:deep(.ant-pagination) {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

:deep(.ant-pagination-total-text) {
  margin-right: 16px;
  color: #666;
  font-size: 14px;
}

:deep(.ant-pagination-options) {
  margin-left: 16px;
}

/* Container overflow fixes */
.card-body {
  overflow: visible !important;
  padding-bottom: 0;
}

.card {
  overflow: visible !important;
  margin-bottom: 20px;
}
</style>
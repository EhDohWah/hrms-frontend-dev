<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <div class="d-flex align-items-center">
          <index-breadcrumb :title="'Benefit Settings'" :text="'Payroll'" :text1="'Benefit Settings'" />
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
          <!-- Add New Setting Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddBenefitSettingModal">
              <i class="ti ti-circle-plus me-2"></i>Add New Setting
            </button>
          </div>
          <!-- Delete Selected Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-danger d-flex align-items-center" @click="confirmDeleteSelected"
              :class="{ 'disabled': selectedRowKeys.length === 0 }">
              <i class="ti ti-trash me-2"></i>Delete Selected
            </button>
          </div>
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top"
              data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
              <i :class="isHeaderCollapsed ? 'ti ti-chevrons-down' : 'ti ti-chevrons-up'"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Benefit Settings Statistics -->
      <div class="row statistics-row">
        <!-- Total Settings -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-primary rounded-circle">
                    <i class="ti ti-settings"></i>
                  </span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Total Settings</p>
                  <h4>{{ statistics.totalSettings }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-primary badge-sm fw-normal">
                  <i class="ti ti-database"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Total Settings -->

        <!-- Active Settings -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-success rounded-circle">
                    <i class="ti ti-circle-check"></i>
                  </span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Active Settings</p>
                  <h4>{{ statistics.activeSettings }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-success badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ getPercentage(statistics.activeSettings, statistics.totalSettings) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Active Settings -->

        <!-- Percentage Settings -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-info rounded-circle">
                    <i class="ti ti-percentage"></i>
                  </span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Percentage Type</p>
                  <h4>{{ statistics.percentageSettings }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-info badge-sm fw-normal">
                  <i class="ti ti-calculator"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Percentage Settings -->

        <!-- Numeric Settings -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-warning rounded-circle">
                    <i class="ti ti-123"></i>
                  </span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Numeric Type</p>
                  <h4>{{ statistics.numericSettings }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-warning badge-sm fw-normal">
                  <i class="ti ti-hash"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Numeric Settings -->
      </div>
      <!-- /Benefit Settings Statistics -->

      <!-- Benefit Settings Table Card -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Benefit Settings List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search
                v-model:value="searchValue"
                placeholder="Search by setting key or description..."
                :loading="searchLoading"
                enter-button="Search"
                @search="handleSearch"
                style="width: 300px;"
                class="search-input-primary"
              />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading benefit settings...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <!-- Ant Design Table -->
            <a-table
              :columns="columns"
              :data-source="tableData"
              :pagination="false"
              :scroll="{ x: 1000, y: 'max-content' }"
              row-key="id"
              @change="handleTableChange"
              :row-selection="canEdit ? rowSelection : null"
            >
              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <!-- Setting Key Column -->
                <template v-if="column.key === 'setting_key'">
                  <span class="fw-semibold text-dark">{{ record.setting_key }}</span>
                </template>

                <!-- Value Column -->
                <template v-if="column.key === 'setting_value'">
                  <span class="badge bg-info-subtle text-info px-3 py-2" style="font-size: 0.95rem; font-weight: 600;">
                    {{ formatSettingValue(record) }}
                  </span>
                </template>

                <!-- Type Column -->
                <template v-if="column.key === 'setting_type'">
                  <span class="badge px-3 py-2" :class="getTypeClass(record.setting_type)">
                    {{ record.setting_type }}
                  </span>
                </template>

                <!-- Description Column -->
                <template v-if="column.key === 'description'">
                  <span class="text-muted">{{ record.description || 'N/A' }}</span>
                </template>

                <!-- Effective Date Column -->
                <template v-if="column.key === 'effective_date'">
                  <span class="text-muted">
                    <i class="ti ti-calendar me-1"></i>{{ formatDate(record.effective_date) }}
                  </span>
                </template>

                <!-- Status Column -->
                <template v-if="column.key === 'is_active'">
                  <span class="badge px-3 py-2" :class="record.is_active ? 'bg-success-subtle text-success' : 'bg-secondary'">
                    <i class="ti me-1" :class="record.is_active ? 'ti-circle-check' : 'ti-circle-x'"></i>
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </template>

                <!-- Action Column -->
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <!-- View Details - Always visible -->
                    <a href="javascript:void(0);" @click="openEditBenefitSettingModal(record)" class="me-2"
                       data-bs-toggle="tooltip" title="View Details">
                      <i class="ti ti-eye"></i>
                    </a>
                    <!-- Edit - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      @click="openEditBenefitSettingModal(record)" 
                      class="me-2"
                      data-bs-toggle="tooltip" 
                      title="Edit Setting"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <!-- Delete - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      @click="confirmDelete(record)"
                      data-bs-toggle="tooltip" 
                      title="Delete Setting"
                    >
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>
              </template>
            </a-table>

            <!-- Ant Design Pagination -->
            <div class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info">
                  <!-- Optional: Additional info can go here -->
                </div>
                <a-pagination
                  v-model:current="currentPage"
                  v-model:page-size="pageSize"
                  :total="total"
                  :show-size-changer="true"
                  :show-quick-jumper="true"
                  :page-size-options="['10', '20', '50', '100']"
                  :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                  @change="handlePaginationChange"
                  @show-size-change="handleSizeChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>

  <!-- Benefit Setting Modal -->
  <benefit-setting-modal ref="benefitSettingModalRef"
    @benefit-setting-added="handleBenefitSettingAdded"
    @benefit-setting-updated="handleBenefitSettingUpdated" />
</template>

<script>
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import IndexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import BenefitSettingModal from '@/components/modal/benefit-setting-modal.vue';
import { benefitSettingService } from '@/services/benefitSetting.service';
import { Modal } from 'ant-design-vue';
import Swal from 'sweetalert2';
import moment from 'moment';
import { usePermissions } from '@/composables/usePermissions';

export default {
  name: 'BenefitSettingsList',
  components: {
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
    IndexBreadcrumb,
    BenefitSettingModal
  },
  setup() {
    // Initialize permission checks for benefit_settings module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('benefit_settings');
    
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
      // Search and filters
      searchValue: '',
      searchLoading: false,
      filteredInfo: {},
      sortedInfo: {},

      // Data
      benefitSettings: [],
      loading: false,
      selectedRowKeys: [],

      // Header collapse state
      isHeaderCollapsed: false,

      // Statistics
      statistics: {
        totalSettings: 0,
        activeSettings: 0,
        inactiveSettings: 0,
        percentageSettings: 0,
        numericSettings: 0,
        booleanSettings: 0
      },

      // Pagination
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // Ant Design table columns
      columns: [
        {
          title: 'Setting Key',
          dataIndex: 'setting_key',
          key: 'setting_key',
          sorter: true,
          width: 200,
        },
        {
          title: 'Value',
          dataIndex: 'setting_value',
          key: 'setting_value',
          width: 120,
        },
        {
          title: 'Type',
          dataIndex: 'setting_type',
          key: 'setting_type',
          filters: [
            { text: 'Percentage', value: 'percentage' },
            { text: 'Numeric', value: 'numeric' },
            { text: 'Boolean', value: 'boolean' },
          ],
          width: 130,
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true,
        },
        {
          title: 'Effective Date',
          dataIndex: 'effective_date',
          key: 'effective_date',
          sorter: true,
          width: 150,
        },
        {
          title: 'Status',
          dataIndex: 'is_active',
          key: 'is_active',
          filters: [
            { text: 'Active', value: true },
            { text: 'Inactive', value: false },
          ],
          width: 120,
        },
        {
          title: 'Actions',
          key: 'action',
          width: 100,
        },
      ],
    };
  },
  computed: {
    tableData() {
      return this.benefitSettings;
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedKeys) => {
          this.selectedRowKeys = selectedKeys;
        },
      };
    },
  },
  mounted() {
    document.title = 'Benefit Settings - HRMS';
    this.fetchBenefitSettings();
  },
  methods: {
    toggleHeader() {
      const collapseBtn = document.getElementById('collapse-header');
      
      if (collapseBtn) {
        collapseBtn.classList.toggle('active');
        document.body.classList.toggle('header-collapse');
        this.isHeaderCollapsed = !this.isHeaderCollapsed;
      }
    },

    async fetchBenefitSettings() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          per_page: this.pageSize,
        };

        // Add search
        if (this.searchValue) {
          params.search = this.searchValue;
        }

        // Add filters
        if (this.filteredInfo.setting_type && this.filteredInfo.setting_type.length > 0) {
          params.filter_setting_type = this.filteredInfo.setting_type.join(',');
        }
        if (this.filteredInfo.is_active && this.filteredInfo.is_active.length > 0) {
          params.filter_is_active = this.filteredInfo.is_active[0];
        }

        // Add sorting
        if (this.sortedInfo.columnKey) {
          params.sort_by = this.sortedInfo.columnKey;
          params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
        }

        const response = await benefitSettingService.getBenefitSettings(params);

        if (response && response.data) {
          const settings = response.data.data || response.data;
          this.benefitSettings = Array.isArray(settings) ? settings : [];

          // Update pagination
          if (response.data.total !== undefined) {
            this.total = response.data.total;
          } else {
            this.total = this.benefitSettings.length;
          }

          // Calculate statistics
          this.calculateStatistics();
        }
      } catch (error) {
        console.error('Error fetching benefit settings:', error);
        this.$toast.error('Failed to load benefit settings');
      } finally {
        this.loading = false;
      }
    },

    calculateStatistics() {
      this.statistics.totalSettings = this.benefitSettings.length;
      this.statistics.activeSettings = this.benefitSettings.filter(s => s.is_active).length;
      this.statistics.inactiveSettings = this.benefitSettings.filter(s => !s.is_active).length;
      this.statistics.percentageSettings = this.benefitSettings.filter(s => s.setting_type === 'percentage').length;
      this.statistics.numericSettings = this.benefitSettings.filter(s => s.setting_type === 'numeric').length;
      this.statistics.booleanSettings = this.benefitSettings.filter(s => s.setting_type === 'boolean').length;
    },

    getPercentage(value, total) {
      if (total === 0) return 0;
      return ((value / total) * 100).toFixed(1);
    },

    handleTableChange(pagination, filters, sorter) {
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      this.fetchBenefitSettings();
    },

    handleSearch() {
      this.currentPage = 1;
      this.searchLoading = true;
      this.fetchBenefitSettings().finally(() => {
        this.searchLoading = false;
      });
    },

    clearFilters() {
      this.filteredInfo = {};
      this.fetchBenefitSettings();
    },

    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchValue = '';
      this.fetchBenefitSettings();
    },

    handlePaginationChange(page, pageSize) {
      this.currentPage = page;
      this.pageSize = pageSize;
      this.fetchBenefitSettings();
    },

    handleSizeChange(current, size) {
      this.currentPage = 1;
      this.pageSize = size;
      this.fetchBenefitSettings();
    },

    openAddBenefitSettingModal() {
      this.$refs.benefitSettingModalRef.openAddBenefitSettingModal();
    },

    openEditBenefitSettingModal(setting) {
      this.$refs.benefitSettingModalRef.openEditBenefitSettingModal(setting);
    },

    handleBenefitSettingAdded() {
      this.fetchBenefitSettings();
      this.$toast.success('Benefit setting created successfully');
    },

    handleBenefitSettingUpdated() {
      this.fetchBenefitSettings();
      this.$toast.success('Benefit setting updated successfully');
    },

    async confirmDelete(setting) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Delete benefit setting "${setting.setting_key}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await this.deleteBenefitSetting(setting.id);
      }
    },

    async confirmDeleteSelected() {
      if (this.selectedRowKeys.length === 0) return;

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Delete ${this.selectedRowKeys.length} selected benefit setting(s)?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete them!'
      });

      if (result.isConfirmed) {
        await this.deleteSelectedSettings();
      }
    },

    async deleteBenefitSetting(id) {
      try {
        const response = await benefitSettingService.deleteBenefitSetting(id);

        if (response.success) {
          this.$toast.success('Benefit setting deleted successfully');
          this.fetchBenefitSettings();
        } else {
          this.$toast.error(response.message || 'Failed to delete benefit setting');
        }
      } catch (error) {
        console.error('Error deleting benefit setting:', error);
        this.$toast.error('Failed to delete benefit setting');
      }
    },

    async deleteSelectedSettings() {
      try {
        const deletePromises = this.selectedRowKeys.map(id =>
          benefitSettingService.deleteBenefitSetting(id)
        );

        await Promise.all(deletePromises);
        this.$toast.success('Selected benefit settings deleted successfully');
        this.selectedRowKeys = [];
        this.fetchBenefitSettings();
      } catch (error) {
        console.error('Error deleting selected benefit settings:', error);
        this.$toast.error('Failed to delete some benefit settings');
      }
    },

    formatSettingValue(setting) {
      if (setting.setting_type === 'percentage') {
        return `${setting.setting_value}%`;
      } else if (setting.setting_type === 'boolean') {
        return setting.setting_value ? 'Yes' : 'No';
      } else {
        return setting.setting_value;
      }
    },

    getTypeClass(type) {
      const classes = {
        'percentage': 'bg-primary',
        'numeric': 'bg-success',
        'boolean': 'bg-warning'
      };
      return classes[type] || 'bg-secondary';
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return moment(date).format('DD/MM/YYYY');
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Ant Design Dropdown Fix */
:deep(.ant-select-dropdown) {
  z-index: 9999 !important;
}

/* ResizeObserver Fix */
.resize-observer-fix {
  overflow: visible;
  position: relative;
}

/* Statistics Card Styling */
.statistics-card {
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.statistics-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.statistics-row {
  margin-bottom: 24px;
}

/* Pagination Wrapper */
.pagination-wrapper {
  margin-top: 20px;
  padding: 15px 0;
}

/* Search Input Styling */
:deep(.search-input-primary .ant-input-search-button) {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

:deep(.search-input-primary .ant-input-search-button:hover) {
  background-color: var(--bs-primary-dark);
}

/* Action Icons Styling */
.action-icon a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: #6c757d;
  transition: all 0.3s ease;
}

.action-icon a:hover {
  background-color: #f8f9fa;
  color: var(--bs-primary);
}

/* Card Styling */
.card {
  border-radius: 0.5rem;
  border: none;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

/* Table Styling - Ant Design Overrides */
:deep(.ant-table) {
  font-size: 0.875rem;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #f8f9fa;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: rgba(13, 110, 253, 0.05);
}

/* Badge Styling */
.badge {
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
  border-radius: 0.375rem;
}

/* Avatar Styling */
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-size: 18px;
  font-weight: 600;
}

.avatar-lg {
  width: 48px;
  height: 48px;
  font-size: 20px;
}

/* Pagination Alignment Fix */
.pagination-wrapper .d-flex {
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center;
}

:deep(.ant-pagination) {
  display: flex !important;
  justify-content: flex-end;
  align-items: center;
}

/* Table Checkbox Alignment Fixes */
:deep(.ant-table-selection-column) {
  vertical-align: middle;
}

:deep(.ant-table-thead .ant-table-selection-column .ant-checkbox-wrapper) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-table-tbody .ant-table-selection-column .ant-checkbox-wrapper) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-checkbox) {
  top: 0;
  vertical-align: middle;
}

:deep(.ant-checkbox-wrapper) {
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
}

/* Improve checkbox hover state */
:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner) {
  border-color: var(--bs-primary);
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

/* Table header cell alignment */
:deep(.ant-table-thead > tr > th) {
  vertical-align: middle;
}
</style>

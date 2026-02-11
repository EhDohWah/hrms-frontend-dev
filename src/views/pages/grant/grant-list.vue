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
            v-if="isReadOnlyGrants" 
            class="badge bg-warning text-dark ms-3 d-flex align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div v-if="canEditGrants" class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddGrantModal">
              <i class="ti ti-circle-plus me-2"></i>Add Grant
            </button>
          </div>
          <!-- Delete Selected Button - Only visible if user can edit -->
          <div v-if="canEditGrants" class="mb-2">
            <button class="btn btn-danger d-flex align-items-center" @click="confirmDeleteSelectedGrants"
              :class="{ 'disabled': selectedRowKeys.length === 0 }">
              <i class="ti ti-trash me-2"></i>Delete Selected
            </button>
          </div>
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" class="" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Grants List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search v-model:value="searchGrantCode" placeholder="Enter full grant code..."
                :loading="searchLoading" enter-button="Search" @search="handleGrantCodeSearch" style="width: 250px;"
                class="search-input-primary" />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading grants...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <!-- TABLE WITHOUT PAGINATION -->
            <a-table :columns="columns" :data-source="tableData" :pagination="false" :scroll="{ x: 'max-content' }"
              row-key="id" @change="handleTableChange" :row-selection="rowSelection">
              <!-- Expandable row for grant items -->
              <template #expandedRowRender="{ record }">
                <div>
                  <div class="d-flex justify-content-between align-items-center" style="margin-bottom: 8px;">
                    <div class="d-flex align-items-center">
                      <p style="margin-bottom: 0; font-weight: bold">Grant Position</p>
                      <div v-if="Object.keys(editableData).length > 0" class="editing-mode-indicator ms-2">
                        <span class="badge badge-soft-warning">
                          <i class="ti ti-edit me-1"></i>Editing Mode
                        </span>
                        <small class="text-muted ms-2">Calculated columns are hidden during editing</small>
                      </div>
                    </div>
                    <a-button v-if="canEditGrants" class="editable-add-btn" @click="handleAddItem(record.id)"
                      :disabled="Object.keys(editableData).length > 0">
                      Add Position
                    </a-button>
                  </div>
                  <a-table :columns="innerColumns" :data-source="record.items || []" :pagination="false" row-key="id"
                    bordered size="small" :key="`inner-table-${record.id}-${Object.keys(editableData).length}`">

                    <template #bodyCell="{ column, text, record: itemRecord }">
                      <template v-if="column.dataIndex === 'grant_position'">
                        <div>
                          <template v-if="editableData[itemRecord.id]">
                            <div style="display: flex; align-items: center; margin: -5px 0;">
                              <a-input v-model:value="editableData[itemRecord.id][column.dataIndex]"
                                placeholder="Enter position title" style="flex: 1;" />
                              <span data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Enter the job position or title for this grant (e.g., Research Assistant, Project Manager)"
                                style="margin-left: 8px;">
                                <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                              </span>
                            </div>
                          </template>
                          <template v-else>
                            {{ text || ' ' }}
                          </template>
                        </div>
                      </template>

                      <template v-else-if="column.dataIndex === 'budgetline_code'">
                        <div>
                          <template v-if="editableData[itemRecord.id]">
                            <div style="display: flex; align-items: center; margin: -5px 0;">
                              <a-input v-model:value="editableData[itemRecord.id][column.dataIndex]"
                                placeholder="Enter budget line code" style="flex: 1;" />
                              <span data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Enter the budget line code for this grant item (e.g., BL001, BL002). This code is used for budget tracking and payroll allocation."
                                style="margin-left: 8px;">
                                <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                              </span>
                            </div>
                          </template>
                          <template v-else>
                            <span :class="[
                              'badge badge-sm fw-normal',
                              text ? 'badge-soft-info' : 'badge-soft-secondary'
                            ]">
                              {{ text || 'No Budget Line' }}
                            </span>
                          </template>
                        </div>
                      </template>

                      <template v-else-if="column.dataIndex === 'grant_salary'">
                        <div>
                          <template v-if="editableData[itemRecord.id]">
                            <div style="display: flex; align-items: center; margin: -5px 0;">
                              <a-input-number v-model:value="editableData[itemRecord.id][column.dataIndex]"
                                placeholder="Enter salary amount" style="flex: 1;" />
                              <span data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Enter the monthly salary amount in THB for this position"
                                style="margin-left: 8px;">
                                <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                              </span>
                            </div>
                          </template>
                          <template v-else>
                            {{ formatCurrency(text) }}
                          </template>
                        </div>
                      </template>

                      <template v-else-if="column.dataIndex === 'grant_benefit'">
                        <div>
                          <template v-if="editableData[itemRecord.id]">
                            <div style="display: flex; align-items: center; margin: -5px 0;">
                              <a-input-number v-model:value="editableData[itemRecord.id][column.dataIndex]"
                                placeholder="Enter benefit amount" style="flex: 1;" />
                              <span data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Enter the monthly benefit amount in THB (insurance, allowances, etc.)"
                                style="margin-left: 8px;">
                                <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                              </span>
                            </div>
                          </template>
                          <template v-else>
                            {{ formatCurrency(text) }}
                          </template>
                        </div>
                      </template>

                      <template v-else-if="column.dataIndex === 'grant_level_of_effort'">
                        <div>
                          <template v-if="editableData[itemRecord.id]">
                            <div style="display: flex; align-items: center; margin: -5px 0;">
                              <a-input-number v-model:value="editableData[itemRecord.id][column.dataIndex]"
                                placeholder="Enter percentage" style="flex: 1;" :min="0" :max="100" addon-after="%" />
                              <span data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Enter the level of effort as a percentage (0-100%). This represents how much time is allocated to this grant"
                                style="margin-left: 8px;">
                                <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                              </span>
                            </div>
                          </template>
                          <template v-else>
                            {{ (text || 0) * 100 }}%
                          </template>
                        </div>
                      </template>

                      <template v-else-if="column.dataIndex === 'grant_position_number'">
                        <div>
                          <template v-if="editableData[itemRecord.id]">
                            <div style="display: flex; align-items: center; margin: -5px 0;">
                              <a-input v-model:value="editableData[itemRecord.id][column.dataIndex]"
                                placeholder="Enter position number" style="flex: 1;" />
                              <span data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Enter the position number or identifier for this grant position"
                                style="margin-left: 8px;">
                                <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                              </span>
                            </div>
                          </template>
                          <template v-else>
                            {{ text || ' ' }}
                          </template>
                        </div>
                      </template>

                      <template
                        v-else-if="['grant_cost_by_monthly', 'grant_total_amount', 'grant_total_cost_by_person'].includes(column.dataIndex)">
                        {{ formatCurrency(text) }}
                      </template>

                      <template v-else-if="column.dataIndex === 'actions'">
                        <div class="editable-row-operations">
                          <span v-if="editableData[itemRecord.id]" class="d-flex align-items-center gap-3">
                            <a-typography-link @click="save(itemRecord.id)" :disabled="savingItemId === itemRecord.id">
                              <span v-if="savingItemId === itemRecord.id" class="d-inline-flex align-items-center">
                                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                Saving...
                              </span>
                              <span v-else>Save</span>
                            </a-typography-link>
                            <a-popconfirm title="Sure to cancel?" @confirm="cancel(itemRecord.id)"
                              :destroyTooltipOnHide="true" :disabled="savingItemId === itemRecord.id">
                              <a :class="{ 'text-muted': savingItemId === itemRecord.id }">Cancel</a>
                            </a-popconfirm>
                          </span>
                          <span v-else-if="canEditGrants">
                            <a @click="edit(itemRecord.id)">Edit</a>
                            <a href="javascript:void(0);" class="text-danger ms-2"
                              @click="confirmDeleteItem(itemRecord)">
                              <i class="ti ti-trash"></i>
                            </a>
                          </span>
                        </div>
                      </template>
                    </template>
                  </a-table>
                </div>
              </template>

              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'actions'">
                  <div class="action-icon d-inline-flex">
                    <router-link :to="`/grant/details/${record.id}`" class="me-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="View Details">
                      <i class="ti ti-eye"></i>
                    </router-link>
                    <a v-if="canEditGrants" href="javascript:void(0);" class="me-2" @click="openEditGrantModal(record)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Edit">
                      <i class="ti ti-edit"></i>
                    </a>
                    <a v-if="canEditGrants" href="javascript:void(0);" class="text-danger" @click="confirmDeleteGrant(record.id)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Delete">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>
                <template v-if="column.dataIndex === 'organization'">
                  <span :class="[
                    'badge badge-sm fw-normal',
                    record.organization === 'SMRU' ? 'badge-primary' :
                      record.organization === 'BHF' ? 'badge-soft-primary fw-bold' :
                        'badge-secondary'
                  ]">
                    {{ record.organization }}
                  </span>
                </template>

                <template v-if="column.dataIndex === 'description'">
                  <a-tooltip :title="record.description" placement="topLeft">
                    <span class="text-muted">
                      {{ truncateText(record.description, 60) }}
                    </span>
                  </a-tooltip>
                </template>

              </template>
            </a-table>

            <!-- SEPARATE PAGINATION COMPONENT -->
            <div class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info">
                  <!-- Optional: Additional info can go here -->
                </div>
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

  <!-- Grant Modal (Add/Edit) -->
  <grant-modal
    :visible="grantModalVisible"
    :editingGrant="editingGrant"
    @saved="handleGrantSaved"
    @close="handleGrantModalClose"
  />


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
import { Toast, Tooltip as BootstrapTooltip } from 'bootstrap';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import GrantModal from '@/components/modal/grant-modal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { grantService } from '@/services/grant.service';
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import { cloneDeep } from 'lodash-es';
import { Modal, Table } from 'ant-design-vue';
import { usePermissions } from '@/composables/usePermissions';

export default {
  name: 'GrantList',
  components: {
    indexBreadcrumb,
    GrantModal,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
    InfoCircleOutlined,
  },
  setup() {
    // Initialize permission checks for grants module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('grants_list');

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
      title: 'Grants',
      text: 'Grants',
      text1: 'Grant List',
      searchTerm: '',
      searchGrantCode: '',
      notificationTitle: '',
      notificationMessage: '',
      notificationClass: '',
      // Grant modal state (Ant Design pattern)
      grantModalVisible: false,
      editingGrant: null,
      // Data properties from setup()
      dateRangeInput: null,
      filteredInfo: {},
      sortedInfo: {},
      grants: [],
      loading: false,
      searchLoading: false,
      editableData: {},
      savingItemId: null, // Track which grant item is being saved
      grantService,
      selectedRowKeys: [],

      // SEPARATE PAGINATION PROPERTIES
      currentPage: 1,
      pageSize: 10,
      total: 0,
      baseInnerColumns: [
        {
          title: 'Position Title',
          dataIndex: 'grant_position',
          key: 'grant_position',
          width: 200
        },
        {
          title: 'Budget Line Code',
          dataIndex: 'budgetline_code',
          key: 'budgetline_code',
          width: 150
        },
        {
          title: 'Salary (THB)',
          dataIndex: 'grant_salary',
          key: 'grant_salary',
          width: 150
        },
        {
          title: 'Benefit (THB)',
          dataIndex: 'grant_benefit',
          key: 'grant_benefit',
          width: 150
        },
        {
          title: 'Effort (%)',
          dataIndex: 'grant_level_of_effort',
          key: 'grant_level_of_effort',
          width: 150
        },
        {
          title: 'Position No.',
          dataIndex: 'grant_position_number',
          key: 'grant_position_number',
          width: 120
        },
        {
          title: 'Cost Monthly',
          dataIndex: 'grant_cost_by_monthly',
          key: 'grant_cost_by_monthly',
          width: 150
        },
        {
          title: 'Total Cost (Year)',
          dataIndex: 'grant_total_amount',
          key: 'grant_total_amount',
          width: 150
        },
        {
          title: 'Total Cost By Person',
          dataIndex: 'grant_total_cost_by_person',
          key: 'grant_total_cost_by_person',
          width: 180
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          width: 120,
          fixed: 'right'
        }
      ]
    };
  },
  computed: {
    // Permission checks - primary source for reactivity
    canEditGrants() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasEdit = Array.isArray(permissions) && permissions.includes('grants_list.edit');
        return hasEdit || (this.canEdit?.value ?? false);
      } catch (e) {
        console.error('[GrantsList] Error checking permissions:', e);
        return this.canEdit?.value ?? false;
      }
    },
    canReadGrants() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasRead = Array.isArray(permissions) && permissions.includes('grants_list.read');
        return hasRead || (this.canRead?.value ?? false);
      } catch (e) {
        return this.canRead?.value ?? false;
      }
    },
    isReadOnlyGrants() {
      return this.canReadGrants && !this.canEditGrants;
    },
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: 'Organization',
          dataIndex: 'organization',
          key: 'organization',
          width: 150,
          filters: [
            {
              text: 'SMRU',
              value: 'SMRU',
            },
            {
              text: 'BHF',
              value: 'BHF',
            },
          ],
          filteredValue: filtered.organization || null,
          // Remove onFilter for server-side filtering
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'organization' && sorted.order,
          filterSearch: true
        },

        {
          title: 'Grant Code',
          dataIndex: 'code',
          key: 'code',
          width: 150,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'code' && sorted.order
        },
        {
          title: 'Grant Name',
          dataIndex: 'name',
          key: 'name',
          width: 200,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'name' && sorted.order
        },

        {
          title: 'End Date',
          dataIndex: 'endDate',
          key: 'endDate',
          width: 150,
          sorter: false
        },

        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: 180,
          ellipsis: {
            showTitle: true
          }
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          fixed: 'right',
          width: 120
        }
      ];
    },
    tableData() {
      // With server-side pagination, just return the grants as-is
      return this.grants.map(grant => ({
        ...grant,
        key: grant.id,
        description: grant.description || 'No description'
      }));
    },

    // Dynamic inner columns based on editing state
    innerColumns() {
      const hasEditingItems = Object.keys(this.editableData).length > 0;

      if (hasEditingItems) {
        // When editing, hide calculated columns and show only editable fields
        return this.baseInnerColumns.filter(col =>
          ['grant_position', 'budgetline_code', 'grant_salary', 'grant_benefit', 'grant_level_of_effort', 'grant_position_number', 'actions'].includes(col.dataIndex)
        );
      } else {
        // When not editing, show all columns
        return this.baseInnerColumns;
      }
    },

    // Row selection configuration for bulk operations
    rowSelection() {
      // Only show row selection if user has edit permission
      if (!this.canEditGrants) {
        return null;
      }
      
      return {
        // fix the column to the left
        fixed: 'left',
        // give it a more appropriate width for checkboxes
        columnWidth: 60,
        // your existing config
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: false,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_NONE,
          {
            key: 'smru',
            text: 'Select SMRU Grants',
            onSelect: () => {
              const smruGrants = this.grants
                .filter(g => g.organization === 'SMRU')
                .map(g => g.id);
              this.selectedRowKeys = smruGrants;
            },
          },
          {
            key: 'bhf',
            text: 'Select BHF Grants',
            onSelect: () => {
              const bhfGrants = this.grants
                .filter(g => g.organization === 'BHF')
                .map(g => g.id);
              this.selectedRowKeys = bhfGrants;
            },
          },
        ],
      }
    },
  },
  mounted() {
    // Initialize DateRangePicker
    if (this.dateRangeInput) {
      const start = moment().subtract(6, 'days');
      const end = moment();

      new DateRangePicker(this.dateRangeInput, {
        startDate: start,
        endDate: end,
        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month')
          ]
        }
      }, (start, end) => {
        return start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');
      });
    }

    this.fetchGrants();

    // Initialize tooltips on component mount
    this.initializeTooltips();
  },
  methods: {
    // Initialize Bootstrap tooltips
    initializeTooltips() {
      this.$nextTick(() => {
        // Dispose of existing tooltips to prevent duplicates
        const existingTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        existingTooltips.forEach(tooltipTriggerEl => {
          const existingTooltip = BootstrapTooltip.getInstance(tooltipTriggerEl);
          if (existingTooltip) {
            existingTooltip.dispose();
          }
        });

        // Initialize all tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new BootstrapTooltip(tooltipTriggerEl);
        });
      });
    },

    // PAGINATION EVENT HANDLERS - PRESERVE FILTERS AND SORTING
    handlePaginationChange(page, pageSize) {
      console.log('Pagination change:', page, pageSize);
      this.currentPage = page;
      this.pageSize = pageSize || this.pageSize;

      // Build complete parameters preserving current filters and sorting
      const params = this.buildApiParams({
        page: page,
        per_page: this.pageSize
      });

      this.fetchGrants(params);
    },

    handleSizeChange(current, size) {
      console.log('Size change:', current, size);
      this.currentPage = 1; // Reset to first page when changing page size
      this.pageSize = size;

      // Build complete parameters preserving current filters and sorting
      const params = this.buildApiParams({
        page: 1,
        per_page: size
      });

      this.fetchGrants(params);
    },

    // Helper method to build complete API parameters
    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams
      };

      // Add sorting parameters
      if (this.sortedInfo && this.sortedInfo.field) {
        const sortField = this.mapSortField(this.sortedInfo.field);
        params.sort_by = sortField;
        params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add filter parameters
      if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
        if (this.filteredInfo.organization && this.filteredInfo.organization.length > 0) {
          params.filter_organization = this.filteredInfo.organization.join(',');
        }
        if (this.filteredInfo.status && this.filteredInfo.status.length > 0) {
          params.filter_status = this.filteredInfo.status.join(',');
        }
      }

      // // Add search parameter if exists
      // if (this.searchGrantCode && this.searchGrantCode.trim()) {
      //   params.search = this.searchGrantCode.trim();
      // }

      return params;
    },

    // TABLE CHANGE HANDLER (for sorting/filtering only)
    handleTableChange(pagination, filters, sorter) {
      console.log('Table change (sorting/filtering):', filters, sorter);

      // Check if there's actually a meaningful change
      const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(this.filteredInfo);
      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.sortedInfo);

      // Only proceed if there's an actual filter or sort change
      if (!hasFilterChange && !hasSorterChange) {
        console.log('No meaningful change detected, skipping reload');
        return;
      }

      // Update filter and sort state
      this.filteredInfo = filters;
      this.sortedInfo = sorter;

      // Reset to first page when filter/sort changes
      this.currentPage = 1;

      // Build complete parameters
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      // Fetch grants with new parameters
      this.fetchGrants(params);
    },

    // Add grant item
    handleAddItem(grantId) {
      // Create a new grant item with default values
      console.log('grantId', grantId);
      const newItem = {
        id: Date.now(), // Temporary ID for the new item
        grant_id: grantId,
        grant_position: '',
        budgetline_code: '',
        grant_salary: 0,
        grant_benefit: 0,
        grant_level_of_effort: 0,
        grant_position_number: 0,
        grant_cost_by_monthly: 0,
        grant_total_amount: 0,
        grant_total_cost_by_person: 0,
        __isNew: true // <-- mark this as a new item
      };

      // Find the grant in the tableData and add the new item to its items array
      const grant = this.tableData.find(g => g.id === grantId);
      if (grant) {
        if (!grant.items) {
          grant.items = [];
        }
        grant.items.push(newItem);

        // Set the item in edit mode
        this.editableData[newItem.id] = { ...newItem };

        // Initialize tooltips after adding new item
        this.initializeTooltips();
      }
    },

    // Edit row
    edit(id) {
      const item = this.tableData.flatMap(grant => grant.items || []).find(item => item.id === id);
      if (item) {
        // Convert DB decimal to percent
        this.editableData[id] = {
          ...cloneDeep(item),
          grant_level_of_effort: item.grant_level_of_effort ? Math.round(parseFloat(item.grant_level_of_effort) * 100) : 0
        };

        // Initialize tooltips after entering edit mode
        this.initializeTooltips();

        // Force table re-render to show/hide columns
        this.$forceUpdate();
      }
    },

    // Save changes
    async save(id) {
      if (!this.editableData[id]) return;
      if (this.savingItemId) return; // Prevent double-click

      const itemData = { ...this.editableData[id] };

      // UI/DB Conversion: percent ➔ decimal (save as string to 2 decimals)
      itemData.grant_level_of_effort = (itemData.grant_level_of_effort / 100).toFixed(2);

      // Basic validation
      if (
        !itemData.grant_position ||
        itemData.grant_salary == null ||
        itemData.grant_level_of_effort == null ||
        itemData.grant_position_number == null
      ) {
        this.$message.error('Please fill in all fields');
        return;
      }

      // Set loading state
      this.savingItemId = id;

      try {
        let updatedItem;

        if (itemData.__isNew) {
          const response = await this.grantService.createGrantItem(itemData);
          updatedItem = response.data || response;
        } else {
          await this.grantService.updateGrantItem(id, itemData);
          updatedItem = itemData;
        }

        // Find the grant and update or insert the item
        for (const grant of this.tableData) {
          if (grant.items) {
            const index = grant.items.findIndex(item => item.id === id);

            if (index !== -1) {
              // Update existing item
              grant.items[index] = { ...grant.items[index], ...updatedItem };
            } else if (itemData.__isNew && grant.id === itemData.grant_id) {
              // Add newly created item (replace temp ID with real one if needed)
              grant.items.push({ ...updatedItem });
            }
          }
        }

        delete this.editableData[id];
        this.$message.success(itemData.__isNew ? 'Grant item created' : 'Grant item updated');

        // Force table re-render to show/hide columns
        this.$forceUpdate();

        // Invalidate shared data cache to ensure employment modal gets fresh data
        try {
          const { useSharedDataStore } = await import('@/stores/sharedDataStore');
          const sharedStore = useSharedDataStore();
          sharedStore.invalidateCache('grantStructure');
          console.log('🗑️ Grant structure cache invalidated after grant item save');
        } catch (error) {
          console.warn('⚠️ Failed to invalidate cache after grant item save:', error);
        }

        this.fetchGrants();
      } catch (error) {
        console.error('Error saving grant item:', error);
        // Display specific error message if available
        const errorMessage = error.error || error.message || 'Failed to save grant item';
        this.$message.error(errorMessage);
      } finally {
        // Clear loading state
        this.savingItemId = null;
      }
    },


    cancel(id) {
      // Find the grant and the item
      for (const grant of this.tableData) {
        const itemIndex = grant.items?.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
          const item = grant.items[itemIndex];
          if (item.__isNew) {
            // Remove new item from the list
            grant.items.splice(itemIndex, 1);
          }
          break;
        }
      }

      // Remove from editable data
      delete this.editableData[id];

      // Force table re-render to show/hide columns
      this.$forceUpdate();
    },

    // Confirm delete grant item
    confirmDeleteItem(record) {
      Modal.confirm({
        title: 'Are you sure you want to delete this grant item?',
        content: 'This action cannot be undone.',
        centered: true,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          this.deleteItem(record);
        }
      });
    },

    // Delete grant item
    async deleteItem(record) {
      try {
        // Delete the grant item through the service
        await this.grantService.deleteGrantItem(record.id);

        // Refresh the grants list to get latest state
        this.fetchGrants();

        // Show success message
        this.$message.success('Grant item deleted successfully');

      } catch (error) {
        console.error('Error deleting grant item:', error);
        this.$message.error('Failed to delete grant item');
      }
    },

    // Confirm delete grant
    confirmDeleteGrant(id) {
      Modal.confirm({
        title: 'Are you sure you want to delete this grant?',
        content: 'The grant and all associated items will be moved to the Recycle Bin and can be restored within 30 days.',
        centered: true,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          this.deleteGrant(id);
        }
      });
    },

    getUniqueFilters(field) {
      if (!this.grants || !this.grants.length) return [];

      const uniqueValues = [...new Set(this.grants.map(grant => grant[field]))];
      return uniqueValues.map(value => ({
        text: value,
        value: value
      }));
    },



    // Map frontend table field names to backend field names
    mapSortField(field) {
      const fieldMapping = {
        'code': 'code',
        'name': 'name',
        'organization': 'organization'
      };
      return fieldMapping[field] || field;
    },

    clearFilters() {
      this.filteredInfo = {};
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchGrants(params);
    },

    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchGrantCode = '';
      this.searchTerm = '';
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchGrants(params);
    },

    mapGrantItems(items) {
      if (!items || !items.length) return [];

      return items.map(item => {
        // Calculate cost by monthly
        const salary = parseFloat(item.grant_salary || 0);
        const benefit = parseFloat(item.grant_benefit || 0);
        const effort = parseFloat(item.grant_level_of_effort || 0);

        const costByMonthly = (salary + benefit) * effort;
        const totalAmountYear = costByMonthly * 12 * item.grant_position_number;
        const totalCostByPerson = totalAmountYear / item.grant_position_number; // Assuming 12 months

        return {
          id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`,
          grant_position: item.grant_position,
          budgetline_code: item.budgetline_code,
          grant_salary: item.grant_salary,
          grant_benefit: item.grant_benefit,
          grant_level_of_effort: item.grant_level_of_effort,
          grant_position_number: item.grant_position_number,
          grant_cost_by_monthly: costByMonthly,
          grant_total_cost_by_person: totalCostByPerson,
          grant_total_amount: totalAmountYear,
          position_id: item.position_id,
          grant_id: item.grant_id
        };
      });
    },
    async handleGrantCodeSearch() {
      // Validation: Check if search input is empty
      if (!this.searchGrantCode || this.searchGrantCode.trim() === '') {
        this.$message.warning('Please enter a grant code to search');
        return;
      }

      this.searchLoading = true;
      try {
        const response = await this.grantService.searchGrantByCode(this.searchGrantCode);

        // Check if the API returned success
        if (response.success === true && response.data) {
          const grantData = response.data;

          // Format the grant data similar to fetchGrants method
          const isoEndDate = grantData.end_date || moment(new Date(new Date().setFullYear(new Date().getFullYear() + 1))).format('YYYY-MM-DD');

          const formattedGrant = {
            id: grantData.id,
            code: grantData.code,
            name: grantData.name,
            organization: grantData.organization,
            description: grantData.description,
            startDate: grantData.startDate || moment(new Date()).format('DD/MM/YYYY'),
            endDate: moment(isoEndDate).format('DD/MM/YYYY'),
            isoEndDate,
            items: this.mapGrantItems(grantData.grant_items)
          };

          // Update the grants array with just this grant
          this.grants = [formattedGrant];
          this.total = 1;
          this.currentPage = 1;
          this.$message.success(response.message || 'Grant found successfully');
        } else {
          // Handle API response with success: false (404 - Grant not found)

          this.$message.warning(response.message || 'No grant found with this code');
        }

        return response;
      } catch (error) {
        // Only network errors, auth errors, or parsing errors reach here
        console.error('Error fetching grant by code:', error);
        this.$message.error('Network error: Failed to fetch grant by code');
        // Clear grants on error
        this.grants = [];
        this.total = 0;
      } finally {
        this.searchLoading = false;
      }
    },
    async fetchGrants(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };

        const response = await this.grantService.getAllGrants(queryParams);

        if (response.success && response.data) {
          const grantsData = response.data;

          this.grants = grantsData.map(grant => {
            const isoEndDate = grant.end_date || moment(new Date(new Date().setFullYear(new Date().getFullYear() + 1))).format('YYYY-MM-DD');

            return {
              id: grant.id,
              code: grant.code,
              name: grant.name,
              organization: grant.organization,
              description: grant.description,
              startDate: grant.startDate || moment(new Date()).format('DD/MM/YYYY'),
              endDate: grant.end_date ? moment(grant.end_date).format('DD/MM/YYYY') : '',
              isoEndDate,
              items: this.mapGrantItems(grant.grant_items)
            };
          });

          // Update pagination properties from server response
          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
            this.pageSize = response.pagination.per_page;
          } else {
            this.total = response.data.length;
            this.currentPage = 1;
          }

          this.$message.success('Grants loaded successfully');
        } else {
          this.grants = [];
          this.total = 0;
          this.$message.error('No grants data received');
        }
      } catch (error) {
        console.error('Error fetching grants:', error);
        this.grants = [];
        this.total = 0;
        this.$message.error('Failed to load grants');
      } finally {
        this.loading = false;
      }
    },

    async handleSearch() {
      this.currentPage = 1;

      if (!this.searchTerm.trim()) {
        this.searchTerm = '';
      }

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      await this.fetchGrants(params);
    },

    formatCurrency(value) {
      if (!value) return '฿0.00';
      return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2
      }).format(value);
    },

    truncateText(text, maxLength = 60) {
      if (!text) return 'No description';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },

    toggleHeader() {
      console.log('toggleHeader');
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    showNotification(title, message, className) {
      this.notificationTitle = title;
      this.notificationMessage = message;
      this.notificationClass = className;

      const toastEl = document.getElementById('notificationToast');
      const toast = new Toast(toastEl);
      toast.show();
    },

    calculateTotalAmount(items) {
      if (!items || !items.length) return '0';
      const total = items.reduce((sum, item) => sum + Number(item.grant_total_amount || 0), 0);
      return `${total.toFixed(2)}`;
    },

    openAddGrantModal() {
      this.editingGrant = null;
      this.grantModalVisible = true;
    },

    openEditGrantModal(grant) {
      this.editingGrant = {
        id: grant.id,
        organization: grant.organization,
        code: grant.code,
        name: grant.name,
        description: grant.description,
        end_date: grant.isoEndDate
      };
      this.grantModalVisible = true;
    },

    handleGrantModalClose() {
      this.grantModalVisible = false;
      this.editingGrant = null;
    },

    async handleGrantSaved() {
      // Refresh the grants list after successful save
      this.loading = true;
      try {
        await this.fetchGrants();
      } catch (error) {
        console.error('Error refreshing grants list:', error);
        this.$message.error('Failed to refresh grants list');
      } finally {
        this.loading = false;
      }
    },

    async deleteGrant(id) {
      this.loading = true;
      try {
        const response = await this.grantService.deleteGrant(id);
        const count = response.deleted_records_count || 1;
        this.$message.success(`Grant moved to Recycle Bin (${count} record${count > 1 ? 's' : ''} archived)`);
        this.fetchGrants();
      } catch (error) {
        console.error('Error deleting grant:', error);
        const responseData = error.response?.data || error;
        if (responseData.blockers && responseData.blockers.length > 0) {
          Modal.error({
            title: 'Cannot delete grant',
            content: responseData.blockers.join('\n'),
            centered: true,
          });
        } else {
          this.$message.error(responseData.message || 'Failed to delete grant');
        }
      } finally {
        this.loading = false;
      }
    },

    // Row selection change handler
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      console.log('selectedRowKeys changed: ', selectedRowKeys);
    },

    // Confirm delete selected grants
    confirmDeleteSelectedGrants() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('Please select at least one grant to delete');
        return;
      }

      Modal.confirm({
        title: `Are you sure you want to delete ${this.selectedRowKeys.length} selected grant(s)?`,
        content: 'The selected grants and their items will be moved to the Recycle Bin and can be restored within 30 days.',
        centered: true,
        okText: 'Yes, Delete All',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteSelectedGrants();
        }
      });
    },

    // Delete selected grants (bulk safe delete)
    async deleteSelectedGrants() {
      this.loading = true;
      try {
        console.log('Sending IDs to delete:', this.selectedRowKeys);
        const response = await this.grantService.deleteSelectedGrants(this.selectedRowKeys);

        if (response.succeeded && response.failed) {
          const successCount = response.succeeded.length;
          const failedCount = response.failed.length;

          if (successCount > 0) {
            this.$message.success(`${successCount} grant(s) moved to Recycle Bin`);
          }
          if (failedCount > 0) {
            const blockerMessages = response.failed
              .map(f => `ID ${f.id}: ${f.blockers?.join(', ') || f.error}`)
              .join('\n');
            Modal.warning({
              title: `${failedCount} grant(s) could not be deleted`,
              content: blockerMessages,
              centered: true,
            });
          }
        } else {
          this.$message.success(`${this.selectedRowKeys.length} grant(s) moved to Recycle Bin`);
        }

        this.selectedRowKeys = [];
        this.fetchGrants();
      } catch (error) {
        console.error("Error deleting grants:", error);
        const responseData = error.response?.data || error;
        this.$message.error(responseData.message || 'Failed to delete grants');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

.table-operations {
  margin-bottom: 16px;
}

.table-operations>button {
  margin-right: 8px;
}


:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  min-width: 80px;
}

.editable-row-operations a {
  margin-right: 8px;
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

/* Ensure pagination dropdowns appear above */
.pagination-wrapper {
  position: relative;
  z-index: 100;
}

/* Override Ant Design dropdown placement */
:deep(.ant-pagination .ant-select-dropdown) {
  position: absolute !important;
  bottom: calc(100% + 4px) !important;
  top: auto !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
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

/* Bootstrap Tooltip styling enhancements */
:deep(.tooltip) {
  z-index: 9999 !important;
}

:deep(.tooltip-inner) {
  background-color: rgba(0, 0, 0, 0.85) !important;
  color: white !important;
  border-radius: 4px !important;
  padding: 8px 12px !important;
  font-size: 12px !important;
  line-height: 1.4 !important;
  max-width: 250px !important;
  text-align: left !important;
}

:deep(.tooltip.bs-tooltip-top .tooltip-arrow::before) {
  border-top-color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.tooltip.bs-tooltip-bottom .tooltip-arrow::before) {
  border-bottom-color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.tooltip.bs-tooltip-start .tooltip-arrow::before) {
  border-left-color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.tooltip.bs-tooltip-end .tooltip-arrow::before) {
  border-right-color: rgba(0, 0, 0, 0.85) !important;
}

/* Table cell overflow fixes for tooltips */
:deep(.ant-table-tbody > tr > td) {
  overflow: visible !important;
}

:deep(.ant-table-thead > tr > th) {
  overflow: visible !important;
}

/* Ensure tooltip icons don't interfere with input functionality */
.tooltip-icon {
  pointer-events: auto;
  z-index: 1;
}

/* Input field container styling */
.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Ensure proper spacing and alignment */
:deep(.ant-input-number) {
  width: 100% !important;
}

:deep(.ant-input-number-group-addon) {
  background-color: #fafafa !important;
  border-color: #d9d9d9 !important;
}

/* Editing mode indicator styling */
.editing-mode-indicator .badge {
  font-size: 11px;
  padding: 4px 8px;
}

.editing-mode-indicator small {
  font-size: 10px;
}

/* Improved inline editing experience */
:deep(.ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td) {
  padding: 8px 4px !important;
}

/* Better input field spacing in editing mode */
:deep(.ant-input),
:deep(.ant-input-number) {
  min-height: 32px !important;
}

/* Ensure tooltip icons are properly positioned */
.tooltip-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Responsive table improvements */
:deep(.ant-table-small) {
  font-size: 13px;
}

:deep(.ant-table-small .ant-table-thead > tr > th) {
  padding: 8px 6px !important;
  font-weight: 600;
  background-color: #fafafa;
  border-bottom: 2px solid #e8e8e8;
}

/* Disable "Add Position" button styling when editing */
.editable-add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Better visual separation for editing rows */
:deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background-color: #f0f9ff !important;
}

/* Improved action buttons spacing */
.editable-row-operations {
  display: flex;
  gap: 8px;
  align-items: center;
}

.editable-row-operations a {
  margin-right: 0 !important;
}

/* Badge styling for editing mode */
.badge-soft-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

/* Budget line code badge styling */
.badge-soft-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.badge-soft-secondary {
  background-color: #e2e3e5;
  color: #6c757d;
  border: 1px solid #ced4da;
}

/* Ensure budget line code badges are properly sized */
.badge-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.2rem;
}
</style>

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
            v-if="isReadOnlyLeavesAdmin" 
            class="badge bg-warning text-dark ms-3 d-flex align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown">
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="exportData('pdf')"><i
                      class="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="exportData('excel')"><i
                      class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="canEditLeavesAdmin" class="mb-2">
            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_leaves"
              class="btn btn-primary d-flex align-items-center" @click="openCreateModal"><i
                class="ti ti-circle-plus me-2"></i>Add Leave</a>
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

      <!-- Leaves Info -->
      <div class="row statistics-row">
        <!-- Total Requests -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-success rounded-circle"><i class="ti ti-calendar-check"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Total Requests</p>
                  <h4>{{ stats.totalRequests || 0 }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-success badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ stats.totalRequests > 0 ? '100%' : '0%' }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Total Requests -->

        <!-- Approved Requests -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-primary rounded-circle"><i class="ti ti-check"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Approved</p>
                  <h4>{{ stats.approvedRequests || 0 }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-primary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ stats.totalRequests > 0 ? Math.round((stats.approvedRequests / stats.totalRequests) * 100) : 0 }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Approved Requests -->

        <!-- Pending Requests -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-warning rounded-circle"><i class="ti ti-clock"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Pending</p>
                  <h4>{{ stats.pendingRequests || 0 }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-warning badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ stats.totalRequests > 0 ? Math.round((stats.pendingRequests / stats.totalRequests) * 100) : 0 }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Pending Requests -->

        <!-- Declined Requests -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-danger rounded-circle"><i class="ti ti-x"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Declined</p>
                  <h4>{{ stats.declinedRequests || 0 }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-danger badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ stats.totalRequests > 0 ? Math.round((stats.declinedRequests / stats.totalRequests) * 100) : 0 }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Declined Requests -->
      </div>
      <!-- /Leaves Info -->

      <!-- Leaves list -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Leave List</h5>
          <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
            <!-- Ant Design Clear Buttons -->
            <div class="me-3">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>

            <!-- Date Range Filter -->
            <div class="me-3">
              <div class="input-icon-end position-relative">
                <input type="text" class="form-control date-range bookingrange" ref="dateRangeInput"
                  placeholder="dd/mm/yyyy - dd/mm/yyyy" readonly />
                <span class="input-icon-addon">
                  <i class="ti ti-chevron-down"></i>
                </span>
              </div>
            </div>

            <!-- Leave Type Filter -->
            <div class="dropdown me-3">
              <a href="javascript:void(0);"
                class="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                {{ selectedLeaveTypeName || 'Leave Type' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="setLeaveTypeFilter(null)"
                    :class="{ 'active': !filters?.filteredInfo?.leaveTypes?.length }">All Types</a>
                </li>
                <li v-for="leaveType in leaveTypeOptions" :key="leaveType.value">
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    @click="setLeaveTypeFilter(leaveType.value)"
                    :class="{ 'active': filters?.filteredInfo?.leaveTypes?.includes(leaveType.value) }">{{
                      leaveType.label }}</a>
                </li>
              </ul>
            </div>

            <!-- Status Filter -->
            <div class="dropdown me-3">
              <a href="javascript:void(0);"
                class="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                {{ selectedStatusName || 'Status' }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="setStatusFilter('')"
                    :class="{ 'active': !filters?.filteredInfo?.status }">All Status</a>
                </li>
                <li v-for="status in statusOptions" :key="status.value">
                  <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="setStatusFilter(status.value)"
                    :class="{ 'active': filters?.filteredInfo?.status === status.value }">
                    <span class="rounded-circle d-flex justify-content-center align-items-center me-2"
                      :class="`bg-transparent-${status.color}`" style="width: 16px; height: 16px;">
                      <i class="ti ti-point-filled" :class="`text-${status.color}`"></i>
                    </span>
                    {{ status.label }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- Sort Filter -->
            <div class="dropdown me-3">
              <a href="javascript:void(0);"
                class="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                Sort By: {{ selectedSortName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li v-for="sort in sortOptions" :key="sort.value">
                  <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="setSortFilter(sort.value)"
                    :class="{ 'active': filters?.sortedInfo?.field === sort.value }">{{ sort.label }}</a>
                </li>
              </ul>
            </div>

            <!-- Ant Design Search Input - Moved to rightmost position -->
            <div>
              <a-input-search v-model:value="searchQuery" placeholder="Search by name or ID..." :loading="searchLoading"
                enter-button="Search" @search="handleSearch" style="width: 250px;" class="search-input-primary" />
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <!-- Loading State -->
          <div v-if="isLeaveRequestsLoading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading leave requests...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!hasLeaveRequests" class="text-center py-5">
            <div class="empty-state">
              <i class="ti ti-calendar-x text-muted" style="font-size: 3rem;"></i>
              <h5 class="mt-3 text-muted">No leave requests found</h5>

              <p class="text-muted">
                {{ filters.search ? 'Try adjusting your search criteria' : 'Start by creating a new Leave request' }}
              </p>

              <button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#add_leaves"
                @click="openCreateModal">
                <i class="ti ti-plus me-2"></i>Add Leave Request
              </button>
            </div>
          </div>

          <!-- Data Table -->
          <div v-else class="resize-observer-fix">
            <a-table :columns="columns" :data-source="leaveRequests || []" :row-selection="rowSelection"
              :pagination="false" :loading="isLeaveRequestsLoading" :scroll="{ x: 1200, y: 'max-content' }"
              row-key="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'employee'">
                  <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md border avatar-rounded">
                      <img :src="getEmployeeAvatar(record.employee)" class="img-fluid" alt="Employee Avatar"
                        @error="handleImageError" />
                    </a>
                    <div class="ms-2">
                      <h6 class="fw-medium">
                        <a href="javascript:void(0);" @click="viewEmployeeDetails(record.employee)">
                          {{ record.employee?.name || 'Unknown Employee' }}
                        </a>
                      </h6>
                      <span class="fs-12 fw-normal">
                        {{ record.employee?.staffId || 'N/A' }} • {{ record.employee?.department || 'N/A' }}
                      </span>
                    </div>
                  </div>
                </template>

                <template v-if="column.key === 'leaveType'">
                  <!-- Multi-leave-type display (v2.0) -->
                  <div class="d-flex align-items-center flex-wrap gap-1">
                    <template v-if="record.items && record.items.length > 0">
                      <span v-for="(item, index) in record.items" :key="item.id || index"
                        class="badge bg-primary-transparent text-primary">
                        {{ item.leaveType?.name || 'Unknown' }}: {{ item.days }} day{{ item.days !== 1 ? 's' : '' }}
                      </span>
                    </template>
                    <!-- Fallback for backward compatibility -->
                    <p v-else class="fs-14 fw-medium d-flex align-items-center mb-0">
                      {{ record.leaveType?.name || 'Unknown Type' }}
                    </p>
                    <a v-if="record.reason" href="javascript:void(0);" class="ms-2" data-bs-toggle="tooltip"
                      data-bs-placement="right" :data-bs-title="record.reason">
                      <i class="ti ti-info-circle text-info"></i>
                    </a>
                  </div>
                </template>

                <template v-if="column.key === 'dateRange'">
                  <div>
                    <div class="fw-medium">{{ formatDate(record.startDate) }}</div>
                    <div class="text-muted fs-12">to {{ formatDate(record.endDate) }}</div>
                  </div>
                </template>

                <template v-if="column.key === 'totalDays'">
                  <span class="badge bg-light text-dark">{{ record.totalDays }} day{{ record.totalDays !== 1 ? 's' : ''
                  }}</span>
                </template>

                <template v-if="column.key === 'status'">
                  <span class="badge" :class="getStatusConfig(record.status).class">
                    {{ getStatusConfig(record.status).label }}
                  </span>
                </template>

                <template v-if="column.key === 'approvals'">
                  <div class="d-flex flex-column gap-1">
                    <div v-if="record.supervisorApproved" class="d-flex align-items-center">
                      <i class="ti ti-user-check text-success me-1"></i>
                      <small class="text-muted">
                        Supervisor Approved
                        <span v-if="record.supervisorApprovedDate" class="text-info">
                          ({{ formatDate(record.supervisorApprovedDate) }})
                        </span>
                      </small>
                    </div>
                    <div v-if="record.hrSiteAdminApproved" class="d-flex align-items-center">
                      <i class="ti ti-shield-check text-primary me-1"></i>
                      <small class="text-muted">
                        HR/Site Admin Approved
                        <span v-if="record.hrSiteAdminApprovedDate" class="text-info">
                          ({{ formatDate(record.hrSiteAdminApprovedDate) }})
                        </span>
                      </small>
                    </div>
                    <div v-if="!record.supervisorApproved && !record.hrSiteAdminApproved" class="text-muted fst-italic">
                      <small>No approvals recorded</small>
                    </div>
                  </div>
                </template>

                <template v-if="column.key === 'attachments'">
                  <div class="d-flex align-items-center">
                    <div v-if="record.attachmentNotes" class="d-flex align-items-center">
                      <i class="ti ti-paperclip text-info me-1"></i>
                      <a href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top"
                        :data-bs-title="record.attachmentNotes">
                        <small class="text-primary">View Notes</small>
                      </a>
                    </div>
                    <div v-else class="text-muted">
                      <small class="fst-italic">No attachment notes</small>
                    </div>
                  </div>
                </template>

                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a href="javascript:void(0);" class="me-2" data-bs-toggle="tooltip" data-bs-placement="top"
                      title="Edit" @click="editLeaveRequest(record)">
                      <i class="ti ti-edit"></i>
                    </a>
                    <a href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"
                      @click="confirmDeleteLeaveRequest(record)">
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
                  Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of {{ paginationInfo.total }} entries
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
      <!-- /Leaves list -->
    </div>
    <layout-footer></layout-footer>
  </div>
  <!-- /Page Wrapper -->

  <LeavesAdminModal ref="leavesAdminModal" :selectedLeaveRequest="selectedLeaveRequest"
    @leave-request-created="handleLeaveRequestCreated" @clear-selection="clearSelectedLeaveRequest">
  </LeavesAdminModal>
</template>



<script>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { Modal as BootstrapModal } from 'bootstrap';
import { Modal, Table, Modal as AntModal } from 'ant-design-vue';

// Store
import { useLeaveStore } from '@/stores/leaveStore';
import { useToast } from '@/composables/useToast';
import { usePermissions } from '@/composables/usePermissions';
import { useAssetUrl } from '@/composables/useAssetUrl';

// Utils
import { dateUtils, statusUtils, filterUtils } from '@/utils/leave.utils';

// Components
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import LeavesAdminModal from '@/components/modal/leaves-admin-modal.vue';

export default {
  name: 'LeavesAdmin',
  components: {
    indexBreadcrumb,
    LeavesAdminModal,
  },

  setup() {
    // Store
    const leaveStore = useLeaveStore();
    const { showToast } = useToast();
    
    // Initialize permission checks for leaves_admin module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('leaves_admin');

    // Reactive data
    const dateRangeInput = ref(null);
    const selectedLeaveRequest = ref(null);
    const searchTimeout = ref(null);
    const searchQuery = ref('');
    const searchLoading = ref(false);

    // Pagination state
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    // Page data
    const title = ref("Leaves");
    const text = ref("Employee");
    const text1 = ref("Leaves");

    // Computed properties from store
    const leaveRequests = computed(() => leaveStore.leaveRequests);
    const stats = computed(() => leaveStore.statistics);
    const isLeaveRequestsLoading = computed(() => leaveStore.loading);
    const leaveTypeOptions = computed(() => leaveStore.leaveTypeOptions);
    const hasLeaveRequests = computed(() => leaveStore.leaveRequests.length > 0);

    // Sync pagination with store
    watch(() => leaveStore.total, (newTotal) => {
      total.value = newTotal;
    });

    watch(() => leaveStore.currentPage, (newPage) => {
      currentPage.value = newPage;
    });

    watch(() => leaveStore.pageSize, (newSize) => {
      pageSize.value = newSize;
    });

    // Filters
    const filters = computed({
      get: () => ({
        search: searchQuery.value,
        perPage: leaveStore.pageSize,
        filteredInfo: leaveStore.filteredInfo,
        sortedInfo: leaveStore.sortedInfo
      }),
      set: (val) => {
        if (val.search !== undefined) searchQuery.value = val.search;
      }
    });

    // Options
    const statusOptions = computed(() => statusUtils.getAllStatuses());
    const sortOptions = computed(() => filterUtils.getSortOptions());

    // Computed properties for filter display
    const selectedLeaveTypeName = computed(() => {
      const leaveTypes = leaveStore.filteredInfo?.leaveTypes;
      if (!leaveTypes || !leaveTypes.length) return null;

      const selected = leaveTypeOptions.value.find(type =>
        leaveTypes.includes(type.value)
      );
      return selected?.label || 'Multiple Types';
    });

    const selectedStatusName = computed(() => {
      const status = leaveStore.filteredInfo?.status;
      if (!status) return null;

      const selected = statusOptions.value.find(s => s.value === status);
      return selected?.label;
    });

    const selectedSortName = computed(() => {
      const sortBy = leaveStore.sortedInfo?.field;
      if (!sortBy) return 'Recently Added';

      const selected = sortOptions.value.find(sort => sort.value === sortBy);
      return selected?.label || 'Recently Added';
    });

    // Pagination info computed property
    const paginationInfo = computed(() => {
      const totalItems = total.value || 0;
      const current = currentPage.value || 1;
      const size = pageSize.value || 10;

      if (totalItems === 0) {
        return {
          from: 0,
          to: 0,
          total: 0
        };
      }

      const from = (current - 1) * size + 1;
      const to = Math.min(current * size, totalItems);

      return {
        from,
        to,
        total: totalItems
      };
    });

    // Table configuration
    const columns = [
      {
        title: '',
        key: 'selection',
        width: 50,
      },
      {
        title: 'Employee',
        key: 'employee',
        sorter: true,
        width: 200,
      },
      {
        title: 'Leave Type',
        key: 'leaveType',
        sorter: true,
        width: 200,
      },
      {
        title: 'Date Range',
        key: 'dateRange',
        sorter: true,
        width: 200,
      },
      {
        title: 'Days',
        key: 'totalDays',
        sorter: true,
        width: 100
      },
      {
        title: 'Status',
        key: 'status',
        sorter: true,
        width: 120,
      },
      {
        title: 'Approvals',
        key: 'approvals',
        width: 200,
      },
      {
        title: 'Attachments',
        key: 'attachments',
        width: 150,
      },
      {
        title: 'Actions',
        key: 'action',
        width: 100,
      },
    ];

    const selectedRowKeys = ref([]);

    // Create a computed rowSelection to ensure reactivity
    const rowSelection = computed(() => ({
      // Fix the column to the left and set appropriate width
      fixed: 'left',
      columnWidth: 60,
      selectedRowKeys: selectedRowKeys.value,
      onChange: (keys, selectedRows) => {
        selectedRowKeys.value = keys;
        console.log('Selected rows:', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log('Record selected:', record, selected);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log('All selected:', selected, selectedRows, changeRows);
      },
      hideDefaultSelections: false,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_NONE,
      ],
    }));

    // Methods
    const toggleHeader = () => {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    };

    const formatDate = (date) => {
      return dateUtils.formatDate(date, 'DD MMM YYYY');
    };

    const getStatusConfig = (status) => {
      return statusUtils.getStatusConfig(status);
    };

    const { getUserAvatar } = useAssetUrl();

    const getEmployeeAvatar = (employee) => {
      return getUserAvatar(employee?.staffId);
    };

    const handleImageError = (event) => {
      event.target.src = getUserAvatar('user-01.jpg');
    };


    // Search method for Ant Design search input - Following employees-list pattern
    const handleSearch = async () => {
      searchLoading.value = true;
      try {
        leaveStore.setSearch(searchQuery.value);
        leaveStore.setPage(1);

        // Build complete parameters preserving current filters and sorting
        const params = leaveStore.buildCompleteApiParams({
          page: 1,
          per_page: leaveStore.pageSize
        });

        await leaveStore.fetchLeaveRequests(params);
      } catch (error) {
        console.error('Error during search:', error);
        showToast('Search failed. Please try again.', 'error');
      } finally {
        searchLoading.value = false;
      }
    };

    // Clear filters - Following employees-list pattern
    const clearFilters = () => {
      const newFilters = {};
      leaveStore.setFilters(newFilters);
      leaveStore.setPage(1);

      const params = leaveStore.buildCompleteApiParams({
        page: 1,
        per_page: leaveStore.pageSize
      });

      leaveStore.fetchLeaveRequests(params);
    };

    // Clear all filters and sorting - Following employees-list pattern
    const clearAll = () => {
      searchQuery.value = '';
      leaveStore.setSearch('');
      leaveStore.setFilters({});
      leaveStore.setSorting({});
      leaveStore.setPage(1);

      const params = leaveStore.buildCompleteApiParams({
        page: 1,
        per_page: leaveStore.pageSize
      });

      leaveStore.fetchLeaveRequests(params);
    };

    const setLeaveTypeFilter = (leaveTypeId) => {
      const newFilters = { ...leaveStore.filteredInfo };
      if (leaveTypeId === null) {
        newFilters.leaveTypes = [];
      } else {
        newFilters.leaveTypes = [leaveTypeId];
      }
      leaveStore.setFilters(newFilters);
      leaveStore.setPage(1);

      const params = leaveStore.buildCompleteApiParams({
        page: 1,
        per_page: leaveStore.pageSize
      });

      leaveStore.fetchLeaveRequests(params);
    };

    const setStatusFilter = (status) => {
      const newFilters = { ...leaveStore.filteredInfo };
      newFilters.status = status;
      leaveStore.setFilters(newFilters);
      leaveStore.setPage(1);

      const params = leaveStore.buildCompleteApiParams({
        page: 1,
        per_page: leaveStore.pageSize
      });

      leaveStore.fetchLeaveRequests(params);
    };

    const setSortFilter = (sortBy) => {
      const newSorting = { field: sortBy, order: 'desc' };
      leaveStore.setSorting(newSorting);
      leaveStore.setPage(1);

      const params = leaveStore.buildCompleteApiParams({
        page: 1,
        per_page: leaveStore.pageSize
      });

      leaveStore.fetchLeaveRequests(params);
    };

    // CRUD methods
    const openCreateModal = () => {
      selectedLeaveRequest.value = null;
      // The modal will be opened by Bootstrap
    };

    const leavesAdminModal = ref(null);

    const editLeaveRequest = async (record) => {
      console.log('🔧 Edit button clicked for leave request:', record);

      try {
        // Set the current leave request in the store
        leaveStore.setCurrentLeaveRequest(record);
        selectedLeaveRequest.value = record;

        // Open edit modal
        if (leavesAdminModal.value && typeof leavesAdminModal.value.openEditModal === 'function') {
          leavesAdminModal.value.openEditModal(record);
        } else {
          const modal = new BootstrapModal(document.getElementById('edit_leaves'));
          modal.show();

          nextTick(() => {
            if (leavesAdminModal.value && typeof leavesAdminModal.value.populateEditForm === 'function') {
              leavesAdminModal.value.populateEditForm(record);
            }
          });
        }
      } catch (error) {
        console.error('❌ Error opening edit modal:', error);
        showToast('Failed to open edit modal', 'error');
      }
    };

    const confirmDeleteLeaveRequest = async (record) => {
      try {
        await new Promise((resolve) => {
          AntModal.confirm({
            title: 'Delete Leave Request?',
            content: `Are you sure you want to delete the leave request for ${record.employee?.name || 'this employee'}? This action cannot be undone.`,
            centered: true,
            okText: 'Yes, delete',
            cancelText: 'Cancel',
            okType: 'danger',
            onOk: async () => {
              try {
                const result = await leaveStore.deleteLeaveRequest(record.id);
                if (result.success) {
                  showToast('Leave request deleted successfully', 'success');
                  // Refresh the list
                  await leaveStore.fetchLeaveRequests();
                } else {
                  showToast(result.error || 'Failed to delete leave request', 'error');
                }
                resolve();
              } catch (error) {
                console.error('Error during leave request deletion:', error);
                showToast('Failed to delete leave request', 'error');
                resolve();
              }
            },
            onCancel: () => {
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Delete confirmation failed:', error);
        showToast('Failed to show delete confirmation dialog', 'error');
      }
    };


    const viewEmployeeDetails = (employee) => {
      // Navigate to employee details or show employee modal
      console.log('View employee details:', employee);
    };

    // Ant Design Pagination event handlers - Following employees-list pattern
    const handlePaginationChange = async (page, pageSize) => {
      console.log('Pagination change:', page, pageSize);
      leaveStore.setPage(page);
      leaveStore.setPageSize(pageSize || leaveStore.pageSize);

      // Build complete parameters preserving current filters and sorting
      const params = leaveStore.buildCompleteApiParams({
        page: page,
        per_page: leaveStore.pageSize
      });

      await leaveStore.fetchLeaveRequests(params);
    };

    const handleSizeChange = async (current, size) => {
      console.log('Size change:', current, size);
      leaveStore.setPage(1); // Reset to first page when changing page size
      leaveStore.setPageSize(size);

      // Build complete parameters preserving current filters and sorting
      const params = leaveStore.buildCompleteApiParams({
        page: 1,
        per_page: size
      });

      await leaveStore.fetchLeaveRequests(params);
    };

    // Export methods
    const exportData = (format) => {
      showToast(`Exporting data as ${format.toUpperCase()}...`, 'info');
      // Implement export functionality
    };

    // Handle leave request created/updated event from modal
    const handleLeaveRequestCreated = async (leaveRequestData) => {
      console.log('📬 Received leave request created/updated event:', leaveRequestData);

      const employeeName = leaveRequestData.employee?.name ||
        `${leaveRequestData.employee?.first_name_en} ${leaveRequestData.employee?.last_name_en}`;

      showToast(`Leave request saved successfully for ${employeeName}`, 'success');

      // Refresh the leave requests table from the store
      await leaveStore.fetchLeaveRequests();

      // Force refresh the leave balance in the modal if it's still open
      if (leavesAdminModal.value && typeof leavesAdminModal.value.forceRefreshBalance === 'function') {
        await leavesAdminModal.value.forceRefreshBalance();
        console.log('🔄 Modal balance refreshed after CRUD operation');
      }

      console.log('✅ Leave requests table refreshed');
    };

    // Clear selected leave request
    const clearSelectedLeaveRequest = () => {
      console.log('🗑️ Clearing selected leave request');
      selectedLeaveRequest.value = null;
      leaveStore.clearCurrentLeaveRequest();
    };

    // Date range picker setup
    const initializeDateRangePicker = () => {
      if (!dateRangeInput.value) return;

      const start = moment().subtract(6, 'days');
      const end = moment();

      new DateRangePicker(dateRangeInput.value, {
        startDate: start,
        endDate: end,
        ranges: dateUtils.getDateRangePresets(),
      }, (start, end) => {
        leaveStore.setDateRange([start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]);
        leaveStore.setPage(1);

        const params = leaveStore.buildCompleteApiParams({
          page: 1,
          per_page: leaveStore.pageSize
        });

        leaveStore.fetchLeaveRequests(params);
      });
    };

    // Lifecycle
    onMounted(async () => {
      try {
        console.log('🚀 Initializing Leaves Admin component...');

        // Fetch initial data from store
        await Promise.all([
          leaveStore.fetchLeaveRequests().catch(err => {
            console.error('Error fetching leave requests:', err);
            showToast('Failed to load leave requests', 'error');
          }),
          leaveStore.fetchLeaveTypes().catch(err => {
            console.error('Error fetching leave types:', err);
            showToast('Failed to load leave types', 'error');
          })
        ]);

        // Initialize date range picker
        initializeDateRangePicker();

        console.log('✅ Leaves Admin component initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing Leaves Admin:', error);
        showToast('Failed to initialize page', 'error');
      }
    });

    // Cleanup on unmount
    onUnmounted(() => {
      // Clear search timeout
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
    });

    return {
      // Reactive data
      title,
      text,
      text1,
      dateRangeInput,
      selectedLeaveRequest,
      leavesAdminModal,
      searchQuery,
      searchLoading,
      selectedRowKeys,

      // Pagination state
      currentPage,
      pageSize,
      total,

      // Store data
      leaveRequests,
      stats,
      filters,
      leaveTypeOptions,
      isLeaveRequestsLoading,

      // Computed
      hasLeaveRequests,
      statusOptions,
      sortOptions,
      selectedLeaveTypeName,
      selectedStatusName,
      selectedSortName,
      paginationInfo,

      // Table config
      columns,
      rowSelection,

      // Methods
      toggleHeader,
      formatDate,
      getStatusConfig,
      getEmployeeAvatar,
      handleImageError,
      handleSearch,
      clearFilters,
      clearAll,
      setLeaveTypeFilter,
      setStatusFilter,
      setSortFilter,
      openCreateModal,
      editLeaveRequest,
      confirmDeleteLeaveRequest,
      viewEmployeeDetails,
      exportData,

      // Pagination methods
      handlePaginationChange,
      handleSizeChange,

      // Event handlers
      handleLeaveRequestCreated,
      clearSelectedLeaveRequest,

      // Permissions
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass,
    };
  },
  computed: {
    // Permission checks - primary source for reactivity
    canEditLeavesAdmin() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasEdit = Array.isArray(permissions) && permissions.includes('leaves_admin.edit');
        return hasEdit || (this.canEdit?.value ?? false);
      } catch (e) {
        console.error('[LeavesAdmin] Error checking permissions:', e);
        return this.canEdit?.value ?? false;
      }
    },
    canReadLeavesAdmin() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasRead = Array.isArray(permissions) && permissions.includes('leaves_admin.read');
        return hasRead || (this.canRead?.value ?? false);
      } catch (e) {
        return this.canRead?.value ?? false;
      }
    },
    isReadOnlyLeavesAdmin() {
      return this.canReadLeavesAdmin && !this.canEditLeavesAdmin;
    },
  },
};
</script>

<style scoped>
/* ========================================
   HYBRID BOOTSTRAP + ANT DESIGN STYLING
   Following HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md
   Based on: interviews-list.vue & job-offers-list.vue
   ======================================== */

/* Ant Design Select Selector Styling */
:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  min-width: 80px;
}

/* ResizeObserver Fix */
.resize-observer-fix {
  overflow: visible;
  position: relative;
  min-height: 100px;
}

/* Ant Design Pagination Wrapper */
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

/* Ant Design Pagination Customization */
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

/* Ant Design Table Customization */
:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa !important;
  color: #595959 !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

:deep(.ant-table-tbody > tr > td) {
  background-color: #ffffff !important;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #fafafa !important;
}


/* Statistics Cards Styling - Original Design with Performance Optimization */
.statistics-card {
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  transform: translateZ(0);
  /* Hardware acceleration for performance */
}

.statistics-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px) translateZ(0);
}

.statistics-card .card-body {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: auto;
}

/* Ensure statistics row has proper spacing */
.statistics-row {
  margin-bottom: 1rem;
}

.statistics-row .col-lg-3 {
  margin-bottom: 0.5rem;
}

/* Make statistics cards more compact */
.statistics-card .avatar {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.statistics-card h4 {
  margin-bottom: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.statistics-card .fs-12 {
  font-size: 0.75rem !important;
  margin-bottom: 0.25rem !important;
}

.statistics-card .badge {
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
}

/* Action Icons Styling - Matching reference implementations */
.action-icon {
  display: inline-flex;
  gap: 8px;
}

.action-icon a {
  color: #666;
  font-size: 16px;
  transition: color 0.2s;
}

.action-icon a:hover {
  color: #0067A5;
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

/* Ensure proper table layout */
:deep(.ant-table-wrapper) {
  background-color: #ffffff;
}

:deep(.ant-table-container) {
  border: 1px solid #e0e0e0;
  border-radius: 0;
}

/* Fix for table body scrollbar */
:deep(.ant-table-body)::-webkit-scrollbar {
  width: 16px !important;
  height: 16px !important;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
  background: #f1f1f1 !important;
  border-radius: 8px !important;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
  background: #888 !important;
  border-radius: 8px !important;
  border: 2px solid #f1f1f1 !important;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #555 !important;
}

/* Fix for fixed columns - comprehensive solution from employees-list.vue */
:deep(.ant-table-fixed-left),
:deep(.ant-table-fixed-right) {
  background-color: #ffffff !important;
}

:deep(.ant-table-fixed-left .ant-table-thead > tr > th),
:deep(.ant-table-fixed-right .ant-table-thead > tr > th) {
  background-color: #fafafa !important;
  color: #595959 !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

:deep(.ant-table-fixed-left .ant-table-tbody > tr > td),
:deep(.ant-table-fixed-right .ant-table-tbody > tr > td) {
  background-color: #ffffff !important;
}

/* Fix for table rows hover state - all tables */
:deep(.ant-table-tbody > tr:hover > td),
:deep(.ant-table-fixed-left .ant-table-tbody > tr:hover > td),
:deep(.ant-table-fixed-right .ant-table-tbody > tr:hover > td) {
  background-color: #fafafa !important;
}

/* Fix for selection column */
:deep(.ant-table-selection-column) {
  background-color: #ffffff !important;
  z-index: 3 !important;
  min-width: 60px !important;
  width: 60px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Fix for selection column header */
:deep(.ant-table-thead .ant-table-selection-column) {
  background-color: #fafafa !important;
}

/* Fix for fixed table selection columns */
:deep(.ant-table-fixed-left .ant-table-selection-column) {
  background-color: #ffffff !important;
}

:deep(.ant-table-fixed-left .ant-table-thead .ant-table-selection-column) {
  background-color: #fafafa !important;
}

/* Fix for selected rows - ensure all selected cells have same background */
:deep(.ant-table-row-selected > td),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-left),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-right),
:deep(.ant-table-row-selected > td.ant-table-selection-column) {
  background-color: #e6f7ff !important;
  z-index: 3 !important;
}

/* Ensure proper table layout for fixed columns */
:deep(.ant-table-layout-fixed table) {
  table-layout: auto !important;
}
</style>

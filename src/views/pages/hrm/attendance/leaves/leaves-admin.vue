<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
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
          <div class="mb-2">
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
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <div class="card bg-green-img">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                    <span
                      class="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center">
                      <i class="ti ti-calendar-check text-success fs-18"></i>
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <p class="mb-1">Total Requests</p>
                  <h4>{{ stats.totalRequests || 0 }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="card bg-pink-img">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                    <span
                      class="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center">
                      <i class="ti ti-check text-success fs-18"></i>
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <p class="mb-1">Approved</p>
                  <h4>{{ stats.approvedRequests || 0 }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="card bg-yellow-img">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                    <span
                      class="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center">
                      <i class="ti ti-clock text-warning fs-18"></i>
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <p class="mb-1">Pending</p>
                  <h4>{{ stats.pendingRequests || 0 }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="card bg-blue-img">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                    <span
                      class="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center">
                      <i class="ti ti-x text-danger fs-18"></i>
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <p class="mb-1">Declined</p>
                  <h4>{{ stats.declinedRequests || 0 }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Leaves Info -->

      <!-- Leaves list -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Leave List</h5>
          <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
            <!-- Search Input -->
            <div class="me-3">
              <div class="input-icon-end position-relative">
                <input type="text" class="form-control" v-model="filters.search" placeholder="Search by name or ID..."
                  @input="debouncedSearch" />
                <span class="input-icon-addon">
                  <i class="ti ti-search"></i>
                </span>
              </div>
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
                    :class="{ 'active': !filters.leaveTypes.length }">All Types</a>
                </li>
                <li v-for="leaveType in leaveTypeOptions" :key="leaveType.value">
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    @click="setLeaveTypeFilter(leaveType.value)"
                    :class="{ 'active': filters.leaveTypes.includes(leaveType.value) }">{{ leaveType.label }}</a>
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
                    :class="{ 'active': !filters.status }">All Status</a>
                </li>
                <li v-for="status in statusOptions" :key="status.value">
                  <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="setStatusFilter(status.value)"
                    :class="{ 'active': filters.status === status.value }">
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
            <div class="dropdown">
              <a href="javascript:void(0);"
                class="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                Sort By: {{ selectedSortName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li v-for="sort in sortOptions" :key="sort.value">
                  <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="setSortFilter(sort.value)"
                    :class="{ 'active': filters.sortBy === sort.value }">{{ sort.label }}</a>
                </li>
              </ul>
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
          <div v-else class="custom-datatable-filter table-responsive">
            <a-table class="table datatable thead-light" :columns="columns" :data-source="leaveRequests"
              :row-selection="rowSelection" :pagination="false" :loading="isLeaveRequestsLoading">
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
                  <div class="d-flex align-items-center">
                    <p class="fs-14 fw-medium d-flex align-items-center mb-0">
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
                  <div class="dropdown position-relative" :id="`status-dropdown-${record.id}`" @click.stop>
                    <button type="button"
                      class="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center border-0"
                      @click.stop="toggleStatusDropdown(record.id)" :style="{ cursor: 'pointer' }">
                      <span class="rounded-circle d-flex justify-content-center align-items-center me-2"
                        :class="getStatusConfig(record.status).class.replace('badge ', 'bg-transparent-')"
                        style="width: 16px; height: 16px;">
                        <i class="ti ti-point-filled"
                          :class="getStatusConfig(record.status).class.replace('badge bg-', 'text-').replace('-light', '')"></i>
                      </span>
                      {{ getStatusConfig(record.status).label }}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end p-3" v-if="activeStatusDropdown === record.id" :style="{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      zIndex: 1000,
                      minWidth: '200px'
                    }" @click.stop>
                      <li v-for="status in statusOptions" :key="status.value">
                        <a href="javascript:void(0);"
                          class="dropdown-item rounded-1 d-flex justify-content-start align-items-center"
                          @click.stop="updateLeaveStatus(record.id, status.value)"
                          :class="{ 'active': record.status === status.value }" :style="{ cursor: 'pointer' }">
                          <span class="rounded-circle d-flex justify-content-center align-items-center me-2"
                            :class="`bg-transparent-${status.color}`" style="width: 16px; height: 16px;">
                            <i class="ti ti-point-filled" :class="`text-${status.color}`"></i>
                          </span>
                          {{ status.label }}
                        </a>
                      </li>
                    </ul>
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

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center p-3 border-top">
              <div class="text-muted">
                Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
              </div>
              <div class="d-flex align-items-center">
                <div class="me-3">
                  <select class="form-select form-select-sm" v-model="filters.perPage"
                    @change="changePerPage(filters.perPage)">
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
                <nav aria-label="Page navigation">
                  <ul class="pagination pagination-sm mb-0">
                    <li class="page-item" :class="{ disabled: isFirstPage }">
                      <a class="page-link" href="javascript:void(0);" @click="previousPage">
                        <i class="ti ti-chevron-left"></i>
                      </a>
                    </li>
                    <li v-for="page in getVisiblePages()" :key="page" class="page-item"
                      :class="{ active: page === pagination.currentPage }">
                      <a class="page-link" href="javascript:void(0);" @click="goToPage(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: isLastPage }">
                      <a class="page-link" href="javascript:void(0);" @click="nextPage">
                        <i class="ti ti-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
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
import { Modal } from 'bootstrap';

// Composables
import { useLeaveRequests } from '@/composables/useLeaveRequests';
import { useLeaveTypes } from '@/composables/useLeaveTypes';
import { useToast } from '@/composables/useToast';
import { useLoading } from '@/composables/useLoading';

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
    // Composables
    const {
      leaveRequests,
      pagination,
      stats,
      filters,
      hasLeaveRequests,
      isFirstPage,
      isLastPage,
      fetchLeaveRequests,
      updateRequestStatus,
      deleteLeaveRequest,
      goToPage,
      nextPage,
      previousPage,
      changePerPage,
      updateFilters,
      setDateRange,
      calculateStatistics,
      updateStatisticsUI
    } = useLeaveRequests();

    const {
      leaveTypeOptions,
      fetchLeaveTypes
    } = useLeaveTypes();

    const { showToast } = useToast();
    const { isLeaveRequestsLoading } = useLoading();

    // Reactive data
    const dateRangeInput = ref(null);
    const selectedLeaveRequest = ref(null);
    const searchTimeout = ref(null);
    const activeStatusDropdown = ref(null);

    // Page data
    const title = ref("Leaves");
    const text = ref("Employee");
    const text1 = ref("Leaves");

    // Options
    const statusOptions = computed(() => statusUtils.getAllStatuses());
    const sortOptions = computed(() => filterUtils.getSortOptions());

    // Computed properties for filter display
    const selectedLeaveTypeName = computed(() => {
      if (!filters.leaveTypes.length) return null;
      const selected = leaveTypeOptions.value.find(type =>
        filters.leaveTypes.includes(type.value)
      );
      return selected?.label || 'Multiple Types';
    });

    const selectedStatusName = computed(() => {
      if (!filters.status) return null;
      const selected = statusOptions.value.find(status => status.value === filters.status);
      return selected?.label;
    });

    const selectedSortName = computed(() => {
      const selected = sortOptions.value.find(sort => sort.value === filters.sortBy);
      return selected?.label || 'Recently Added';
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
      },
      {
        title: 'Leave Type',
        key: 'leaveType',
        sorter: true,
      },
      {
        title: 'Date Range',
        key: 'dateRange',
        sorter: true,
      },
      {
        title: 'Days',
        key: 'totalDays',
        sorter: true,
        width: 100,
      },
      {
        title: 'Status',
        key: 'status',
        sorter: true,
        width: 150,
      },
      {
        title: 'Actions',
        key: 'action',
        width: 100,
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('Selected rows:', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log('Record selected:', record, selected);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log('All selected:', selected, selectedRows, changeRows);
      },
    };

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

    const getEmployeeAvatar = (employee) => {
      if (!employee) return require('@/assets/img/users/user-01.jpg');

      try {
        // Try to get the employee's avatar, fallback to default
        return require(`@/assets/img/users/${employee.staffId || 'user-01'}.jpg`);
      } catch {
        return require('@/assets/img/users/user-01.jpg');
      }
    };

    const handleImageError = (event) => {
      event.target.src = require('@/assets/img/users/user-01.jpg');
    };

    const canUpdateStatus = (record) => {
      // Add your business logic here
      return record.status === 'pending';
    };

    // Filter methods
    const debouncedSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }

      searchTimeout.value = setTimeout(() => {
        fetchLeaveRequests(true);
      }, 500);
    };

    const setLeaveTypeFilter = (leaveTypeId) => {
      if (leaveTypeId === null) {
        filters.leaveTypes = [];
      } else {
        filters.leaveTypes = [leaveTypeId];
      }
      fetchLeaveRequests(true);
    };

    const setStatusFilter = (status) => {
      filters.status = status;
      fetchLeaveRequests(true);
    };

    const setSortFilter = (sortBy) => {
      filters.sortBy = sortBy;
      fetchLeaveRequests(true);
    };

    // CRUD methods
    const openCreateModal = () => {
      selectedLeaveRequest.value = null;
      // The modal will be opened by Bootstrap
    };

    const leavesAdminModal = ref(null);

    const editLeaveRequest = (record) => {
      console.log('🔧 Edit button clicked for leave request:', record);
      selectedLeaveRequest.value = record;

      // Use template ref to call the modal method
      if (leavesAdminModal.value && typeof leavesAdminModal.value.openEditModal === 'function') {
        leavesAdminModal.value.openEditModal(record);
      } else {
        console.warn('⚠️ Modal component or openEditModal method not found, using fallback');
        // Fallback: Open modal directly
        const modal = new Modal(document.getElementById('edit_leaves'));
        modal.show();

        // Use nextTick to ensure modal is open before populating
        nextTick(() => {
          if (leavesAdminModal.value && typeof leavesAdminModal.value.populateEditForm === 'function') {
            leavesAdminModal.value.populateEditForm(record);
          }
        });
      }
    };

    const confirmDeleteLeaveRequest = (record) => {
      if (confirm(`Are you sure you want to delete the leave request for ${record.employee?.name}?`)) {
        handleDeleteLeaveRequest(record.id);
      }
    };

    const handleDeleteLeaveRequest = async (id) => {
      const result = await deleteLeaveRequest(id);
      if (result.success) {
        showToast('Leave request deleted successfully', 'success');
      }
    };

    // Toggle status dropdown
    const toggleStatusDropdown = (recordId) => {
      console.log('🔽 Toggle dropdown for record:', recordId, 'Current active:', activeStatusDropdown.value);

      if (activeStatusDropdown.value === recordId) {
        activeStatusDropdown.value = null;
        console.log('✅ Closed dropdown');
      } else {
        activeStatusDropdown.value = recordId;
        console.log('✅ Opened dropdown for record:', recordId);

        // Check if dropdown element exists
        const dropdownElement = document.getElementById(`status-dropdown-${recordId}`);
        console.log('📍 Dropdown element found:', !!dropdownElement);
        if (dropdownElement) {
          const menu = dropdownElement.querySelector('.dropdown-menu');
          console.log('📋 Dropdown menu found:', !!menu);
          if (menu) {
            console.log('📐 Menu styles:', {
              display: menu.style.display,
              position: menu.style.position,
              visibility: window.getComputedStyle(menu).visibility
            });
          }
        }
      }
    };

    // Close dropdown when clicking outside
    const closeStatusDropdown = () => {
      activeStatusDropdown.value = null;
    };

    const updateLeaveStatus = async (id, status) => {
      // Close the dropdown immediately to prevent UI issues
      activeStatusDropdown.value = null;

      console.log('🔄 Starting status update for ID:', id, 'to status:', status);
      console.log('📊 Statistics before update:', JSON.stringify(stats));

      const result = await updateRequestStatus(id, status);
      if (result.success) {
        console.log('✅ Status update completed');
        console.log('📊 Statistics after update:', JSON.stringify(stats));
        showToast(`Leave request ${status} successfully`, 'success');

        // Force an additional manual statistics calculation as backup
        setTimeout(() => {
          console.log('🔄 Manual statistics recalculation...');
          const manualStats = calculateStatistics();
          updateStatisticsUI(manualStats);
          console.log('📊 Manual statistics update complete:', JSON.stringify(stats));
        }, 100);

      } else {
        console.error('❌ Status update failed:', result);
      }
    };

    const viewEmployeeDetails = (employee) => {
      // Navigate to employee details or show employee modal
      console.log('View employee details:', employee);
    };

    // Pagination helpers
    const getVisiblePages = () => {
      const current = pagination.currentPage;
      const total = pagination.lastPage;
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, current - delta);
        i <= Math.min(total - 1, current + delta);
        i++) {
        range.push(i);
      }

      if (current - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (current + delta < total - 1) {
        rangeWithDots.push('...', total);
      } else {
        rangeWithDots.push(total);
      }

      return rangeWithDots.filter((item, index, arr) =>
        arr.indexOf(item) === index && item !== '...' || item === '...'
      );
    };

    // Export methods
    const exportData = (format) => {
      showToast(`Exporting data as ${format.toUpperCase()}...`, 'info');
      // Implement export functionality
    };

    // Handle leave request created event from modal
    const handleLeaveRequestCreated = (leaveRequestData) => {
      console.log('📬 Received leave request created event:', leaveRequestData);

      // Show success message
      showToast(`Leave request created successfully for ${leaveRequestData.employee.first_name_en} ${leaveRequestData.employee.last_name_en}`, 'success');

      // Refresh the leave requests table
      fetchLeaveRequests();

      console.log('✅ Leave requests table refreshed');
    };

    // Clear selected leave request (called when edit modal is closed)
    const clearSelectedLeaveRequest = () => {
      console.log('🗑️ Clearing selected leave request');
      selectedLeaveRequest.value = null;
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
        setDateRange(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
      });
    };

    // Lifecycle
    onMounted(async () => {
      // Initialize data
      await Promise.all([
        fetchLeaveRequests(),
        fetchLeaveTypes()
      ]);

      // Initialize date range picker
      initializeDateRangePicker();

      // Add click listener to close dropdown when clicking outside
      document.addEventListener('click', closeStatusDropdown);
    });

    // Cleanup on unmount
    onUnmounted(() => {
      document.removeEventListener('click', closeStatusDropdown);
    });

    return {
      // Reactive data
      title,
      text,
      text1,
      dateRangeInput,
      selectedLeaveRequest,
      leavesAdminModal,
      activeStatusDropdown,

      // Composable data
      leaveRequests,
      pagination,
      stats,
      filters,
      leaveTypeOptions,
      isLeaveRequestsLoading,

      // Computed
      hasLeaveRequests,
      isFirstPage,
      isLastPage,
      statusOptions,
      sortOptions,
      selectedLeaveTypeName,
      selectedStatusName,
      selectedSortName,

      // Table config
      columns,
      rowSelection,

      // Methods
      toggleHeader,
      formatDate,
      getStatusConfig,
      getEmployeeAvatar,
      handleImageError,
      canUpdateStatus,
      debouncedSearch,
      setLeaveTypeFilter,
      setStatusFilter,
      setSortFilter,
      openCreateModal,
      editLeaveRequest,
      confirmDeleteLeaveRequest,
      updateLeaveStatus,
      toggleStatusDropdown,
      viewEmployeeDetails,
      getVisiblePages,
      exportData,
      calculateStatistics,
      updateStatisticsUI,

      // Pagination methods
      goToPage,
      nextPage,
      previousPage,
      changePerPage,

      // Event handlers
      handleLeaveRequestCreated,
      clearSelectedLeaveRequest,
    };
  },
};
</script>

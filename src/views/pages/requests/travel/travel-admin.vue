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
            v-if="isReadOnlyTravelAdmin" 
            class="badge bg-warning text-dark ms-3 d-flex align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div v-if="canEditTravelAdmin" class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddTravelRequestModal"
              :disabled="openingAddTravelRequest">
              <template v-if="openingAddTravelRequest">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading form...
              </template>
              <template v-else>
                <i class="ti ti-circle-plus me-2"></i>Add New Travel Request
              </template>
            </button>
          </div>
          <div v-if="canEditTravelAdmin" class="mb-2 me-2">
            <button class="btn btn-danger d-flex align-items-center" @click="confirmDeleteSelectedTravelRequests"
              :class="{ 'disabled': selectedRowKeys.length === 0 }">
              <i class="ti ti-trash me-2"></i>Delete Selected
            </button>
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

      <!-- Travel Request Statistics -->
      <div class="row statistics-row">
        <!-- Total Requests -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-primary rounded-circle"><i class="ti ti-file-description"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Total Requests</p>
                  <h4>{{ statistics.total }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-primary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  100%
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Total Requests -->

        <!-- This Year -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-success rounded-circle"><i class="ti ti-calendar-check"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">This Year</p>
                  <h4>{{ statistics.approved }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-success badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ ((statistics.approved / statistics.total) * 100).toFixed(1) }}% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /This Year -->

        <!-- Domestic -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-info rounded-circle"><i class="ti ti-map-pin"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Domestic</p>
                  <h4>{{ Math.floor(statistics.total * 0.7) }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-info badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  70% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /Domestic -->

        <!-- International -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-warning rounded-circle"><i class="ti ti-plane"></i></span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">International</p>
                  <h4>{{ Math.floor(statistics.total * 0.3) }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-warning badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  30% of Total
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- /International -->
      </div>
      <!-- /Travel Request Statistics -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Travel Request List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end me-2">
              <a-input-search v-model:value="searchStaffId" placeholder="Enter staff ID..." :loading="searchLoading"
                enter-button="Search" @search="handleStaffIdSearch" style="width: 200px;"
                class="search-input-primary" />
            </div>
            <div class="input-icon-end">
              <a-input-search v-model:value="searchEmployeeName" placeholder="Enter employee name..."
                :loading="searchLoading" enter-button="Search" @search="handleEmployeeNameSearch" style="width: 200px;"
                class="search-input-primary" />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading travel requests...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <!-- TABLE WITHOUT PAGINATION -->
            <a-table :columns="columns" :data-source="tableData" :pagination="false"
              :scroll="{ x: 1000, y: 'max-content' }" row-key="id" @change="handleTableChange"
              :row-selection="rowSelection">
              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <!-- View Travel Request -->
                    <a href="javascript:void(0);" @click="viewTravelRequest(record)" class="me-2">
                      <i class="ti ti-eye"></i>
                    </a>
                    <!-- Edit Travel Request -->
                    <a href="javascript:void(0);" @click="editTravelRequest(record)" class="me-2">
                      <i class="ti ti-edit"></i>
                    </a>
                    <!-- Delete Travel Request -->
                    <a href="javascript:void(0);" @click="confirmDeleteTravelRequest(record.id)">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>

                <!-- Employee column -->
                <template v-if="column.key === 'employee'">
                  <div v-if="record.employee">
                    <strong>{{ record.employee.first_name_en }} {{ record.employee.last_name_en }}</strong>
                    <br>
                    <small class="text-muted">{{ record.employee.staff_id }}</small>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>

                <!-- Department column -->
                <template v-if="column.key === 'department'">
                  <span v-if="record.department">{{ record.department.name }}</span>
                  <span v-else class="text-muted">-</span>
                </template>

                <!-- Travel Dates column -->
                <template v-if="column.key === 'travel_dates'">
                  <div v-if="record.start_date || record.to_date">
                    <div v-if="record.start_date">
                      <strong>From:</strong> {{ formatDate(record.start_date) }}
                    </div>
                    <div v-if="record.to_date">
                      <strong>To:</strong> {{ formatDate(record.to_date) }}
                    </div>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>

                <!-- Transportation column -->
                <template v-if="column.key === 'transportation'">
                  <div v-if="record.transportation">
                    <span class="badge badge-soft-blue badge-sm">
                      {{ formatTransportation(record.transportation) }}
                    </span>
                    <div v-if="record.transportation === 'other' && record.transportation_other_text"
                      class="other-text mt-1">
                      <small class="text-muted">{{ record.transportation_other_text }}</small>
                    </div>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>

                <!-- Accommodation column -->
                <template v-if="column.key === 'accommodation'">
                  <div v-if="record.accommodation">
                    <span class="badge badge-soft-green badge-sm">
                      {{ formatAccommodation(record.accommodation) }}
                    </span>
                    <div v-if="record.accommodation === 'other' && record.accommodation_other_text"
                      class="other-text mt-1">
                      <small class="text-muted">{{ record.accommodation_other_text }}</small>
                    </div>
                  </div>
                  <span v-else class="text-muted">-</span>
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

  <!-- Travel Request Modal -->
  <travel-request-modal @travel-request-added="fetchTravelRequests" @travel-request-updated="fetchTravelRequests"
    ref="travelRequestModalRef"></travel-request-modal>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import TravelRequestModal from '@/components/modal/travel-request-modal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { useTravelRequestStore } from '@/stores/travelRequestStore';
import moment from 'moment';
import { Modal, Table } from 'ant-design-vue';
import { usePermissions } from '@/composables/usePermissions';

export default {
  name: 'TravelAdmin',
  components: {
    indexBreadcrumb,
    TravelRequestModal,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  },
  setup() {
    // Initialize permission checks for travel_admin module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('travel_admin');

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
      title: "Travel Requests",
      text: "Requests",
      text1: "Travel Admin",
      searchStaffId: '',
      searchEmployeeName: '',

      // Data properties (no store dependencies)
      filteredInfo: {},
      sortedInfo: {},
      travelRequests: [],
      loading: false,
      searchLoading: false,
      selectedRowKeys: [],

      // Statistics (local instead of store)
      statistics: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      },

      // SEPARATE PAGINATION PROPERTIES
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // UI loading states for opening modals
      openingAddTravelRequest: false,
    };
  },
  computed: {
    // Permission checks - primary source for reactivity
    canEditTravelAdmin() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasEdit = Array.isArray(permissions) && permissions.includes('travel_admin.edit');
        return hasEdit || (this.canEdit?.value ?? false);
      } catch (e) {
        console.error('[TravelAdmin] Error checking permissions:', e);
        return this.canEdit?.value ?? false;
      }
    },
    canReadTravelAdmin() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasRead = Array.isArray(permissions) && permissions.includes('travel_admin.read');
        return hasRead || (this.canRead?.value ?? false);
      } catch (e) {
        return this.canRead?.value ?? false;
      }
    },
    isReadOnlyTravelAdmin() {
      return this.canReadTravelAdmin && !this.canEditTravelAdmin;
    },
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: 'Employee',
          key: 'employee',
          width: 200,
          fixed: 'left',
          sorter: false,
        },
        {
          title: 'Department',
          key: 'department',
          width: 150,
          sorter: false,
        },
        {
          title: 'Destination',
          dataIndex: 'destination',
          key: 'destination',
          width: 150,
          sorter: true,
          sortOrder: sorted.columnKey === 'destination' && sorted.order,
          filters: [
            { text: 'Bangkok', value: 'Bangkok' },
            { text: 'Chiang Mai', value: 'Chiang Mai' },
            { text: 'Phuket', value: 'Phuket' },
            { text: 'Mae Sot', value: 'Mae Sot' },
            { text: 'International', value: 'International' }
          ],
          filteredValue: filtered.destination || null,
        },
        {
          title: 'Travel Dates',
          key: 'travel_dates',
          width: 180,
          sorter: false,
        },
        {
          title: 'Purpose',
          dataIndex: 'purpose',
          key: 'purpose',
          width: 200,
          sorter: true,
          sortOrder: sorted.columnKey === 'purpose' && sorted.order,
        },
        {
          title: 'Transportation',
          key: 'transportation',
          width: 120,
          filters: [
            { text: 'Flight', value: 'flight' },
            { text: 'Car', value: 'car' },
            { text: 'Train', value: 'train' },
            { text: 'Bus', value: 'bus' },
            { text: 'Other', value: 'other' },
          ],
          filteredValue: filtered.transportation || null,
          sorter: false,
        },
        {
          title: 'Accommodation',
          key: 'accommodation',
          width: 120,
          filters: [
            { text: 'Hotel', value: 'hotel' },
            { text: 'Guest House', value: 'guest_house' },
            { text: 'Apartment', value: 'apartment' },
            { text: 'Other', value: 'other' },
          ],
          filteredValue: filtered.accommodation || null,
          sorter: false,
        },
        {
          title: 'Actions',
          key: 'action',
          fixed: 'right',
          width: 100,
          sorter: false,
        },
      ];
    },
    tableData() {
      // With server-side pagination, just return the travel requests as-is
      return this.travelRequests.map(request => ({
        ...request,
        key: request.id,
      }));
    },
    rowSelection() {
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
        ],
      }
    },
  },
  mounted() {
    this.fetchTravelRequests();
  },
  methods: {
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

      this.fetchTravelRequests(params);
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

      this.fetchTravelRequests(params);
    },

    // Helper method to build complete API parameters
    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams
      };

      // Add sorting parameters ONLY when user has explicitly clicked on a column to sort
      if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
        const sortField = this.mapSortField(this.sortedInfo.field);
        params.sort_by = sortField;
        params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add filter parameters
      if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
        if (this.filteredInfo.transportation && this.filteredInfo.transportation.length > 0) {
          params.filter_transportation = this.filteredInfo.transportation.join(',');
        }
        if (this.filteredInfo.accommodation && this.filteredInfo.accommodation.length > 0) {
          params.filter_accommodation = this.filteredInfo.accommodation.join(',');
        }
        if (this.filteredInfo.destination && this.filteredInfo.destination.length > 0) {
          params.filter_destination = this.filteredInfo.destination.join(',');
        }
      }

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

      // Update filter state
      this.filteredInfo = filters;

      // Only update sorter if it's a real sort operation (has field and order)
      // Don't preserve old sorting when only filtering
      if (sorter && sorter.field && sorter.order) {
        console.log('Applying sort:', sorter);
        this.sortedInfo = sorter;
      } else if (!sorter || (!sorter.field && !sorter.order)) {
        console.log('Clearing sort (filtering only or no sort)');
        this.sortedInfo = {};
      }

      // Reset to first page when filter/sort changes
      this.currentPage = 1;

      // Build complete parameters
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      // Fetch travel requests with new parameters
      this.fetchTravelRequests(params);
    },

    // Map frontend table field names to backend field names
    mapSortField(field) {
      const fieldMapping = {
        'destination': 'destination',
        'purpose': 'purpose',
      };
      return fieldMapping[field] || field;
    },

    async handleStaffIdSearch() {
      // Validation: Check if search input is empty
      if (!this.searchStaffId || this.searchStaffId.trim() === '') {
        this.$message && this.$message.warning && this.$message.warning('Please enter a staff ID to search');
        return;
      }

      this.searchLoading = true;
      try {
        const travelRequestStore = useTravelRequestStore();
        const response = await travelRequestStore.searchTravelRequestsByStaffId(this.searchStaffId);

        // Update local data from store
        this.travelRequests = travelRequestStore.travelRequests;
        this.total = travelRequestStore.total;
        this.currentPage = travelRequestStore.currentPage;
        this.updateLocalStatistics();

        this.$message && this.$message.success && this.$message.success('Search completed successfully');
      } catch (error) {
        console.error('Error fetching travel requests by staff ID:', error);
        this.$message && this.$message.error && this.$message.error(error.message || 'Failed to search travel requests');
        // Clear data on error
        this.travelRequests = [];
        this.total = 0;
      } finally {
        this.searchLoading = false;
      }
    },

    async handleEmployeeNameSearch() {
      // Validation: Check if search input is empty
      if (!this.searchEmployeeName || this.searchEmployeeName.trim() === '') {
        this.$message && this.$message.warning && this.$message.warning('Please enter an employee name to search');
        return;
      }

      this.searchLoading = true;
      try {
        const params = this.buildApiParams({
          page: 1,
          per_page: this.pageSize,
          search_employee: this.searchEmployeeName.trim()
        });

        await this.fetchTravelRequests(params);
        this.$message && this.$message.success && this.$message.success('Search completed successfully');
      } catch (error) {
        console.error('Error searching travel requests by employee name:', error);
        this.$message && this.$message.error && this.$message.error(error.message || 'Failed to search travel requests');
        // Clear data on error
        this.travelRequests = [];
        this.total = 0;
      } finally {
        this.searchLoading = false;
      }
    },

    async fetchTravelRequests(params = {}) {
      this.loading = true;
      try {
        const travelRequestStore = useTravelRequestStore();

        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };

        await travelRequestStore.fetchTravelRequests(queryParams);

        // Update local data from store
        this.travelRequests = travelRequestStore.travelRequests;
        this.total = travelRequestStore.total;
        this.currentPage = travelRequestStore.currentPage;
        this.pageSize = travelRequestStore.pageSize;
        this.statistics = travelRequestStore.statistics;

        this.$message && this.$message.success && this.$message.success('Travel requests loaded successfully');
      } catch (error) {
        console.error('Error fetching travel requests:', error);
        this.travelRequests = [];
        this.total = 0;
        this.$message && this.$message.error && this.$message.error('Failed to load travel requests');
      } finally {
        this.loading = false;
      }
    },

    clearFilters() {
      this.filteredInfo = {};
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchTravelRequests(params);
    },

    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchStaffId = '';
      this.searchEmployeeName = '';
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchTravelRequests(params);
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    // Row selection change handler
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      console.log('selectedRowKeys changed: ', selectedRowKeys);
    },

    // Confirm delete selected travel requests
    confirmDeleteSelectedTravelRequests() {
      if (this.selectedRowKeys.length === 0) {
        this.$message && this.$message.warning && this.$message.warning('Please select at least one travel request to delete');
        return;
      }

      Modal.confirm({
        title: `Are you sure you want to delete ${this.selectedRowKeys.length} selected travel request(s)?`,
        content: 'This will delete all selected travel requests and their associated data. This action cannot be undone.',
        centered: true,
        okText: 'Yes, Delete All',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteSelectedTravelRequests();
        }
      });
    },

    // Delete selected travel requests
    async deleteSelectedTravelRequests() {
      try {
        const travelRequestStore = useTravelRequestStore();
        await travelRequestStore.deleteSelectedTravelRequests(this.selectedRowKeys);
        this.$message && this.$message.success && this.$message.success(`${this.selectedRowKeys.length} travel request(s) deleted successfully`);
        this.selectedRowKeys = [];
        this.fetchTravelRequests();
      } catch (error) {
        this.$message && this.$message.error && this.$message.error('Failed to delete travel requests');
        console.error("Error deleting travel requests:", error);
      }
    },

    // Confirm delete single travel request
    confirmDeleteTravelRequest(id) {
      Modal.confirm({
        title: 'Are you sure you want to delete this travel request?',
        content: 'This will delete the travel request and all associated data. This action cannot be undone.',
        centered: true,
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteTravelRequest(id);
        }
      });
    },

    // Delete single travel request
    async deleteTravelRequest(id) {
      try {
        const travelRequestStore = useTravelRequestStore();
        await travelRequestStore.deleteTravelRequest(id);
        this.$message && this.$message.success && this.$message.success('Travel request deleted successfully');
        this.fetchTravelRequests();
      } catch (error) {
        this.$message && this.$message.error && this.$message.error('Failed to delete travel request');
        console.error("Error deleting travel request:", error);
      }
    },

    async openAddTravelRequestModal() {
      try {
        this.openingAddTravelRequest = true;
        // Wait for modal DOM to be available
        let attempts = 0;
        while (!document.getElementById('add_travel_request') && attempts < 40) {
          await new Promise(resolve => setTimeout(resolve, 25));
          attempts++;
        }

        if (this.$refs.travelRequestModalRef) {
          await this.$refs.travelRequestModalRef.openAddTravelRequestModal();
        } else {
          this.$message && this.$message.warning && this.$message.warning('Form is loading, please try again.');
        }
      } finally {
        this.openingAddTravelRequest = false;
      }
    },

    viewTravelRequest(request) {
      // For now, just show an alert with basic info
      // In the future, you can create a view modal
      alert(`Travel Request Details:\nEmployee: ${request.employee?.first_name_en} ${request.employee?.last_name_en}\nDestination: ${request.destination}\nPurpose: ${request.purpose}`);
    },

    editTravelRequest(request) {
      if (this.$refs.travelRequestModalRef) {
        this.$refs.travelRequestModalRef.openEditTravelRequestModal(request);
      }
    },

    // Format travel request data
    formatDate(date) {
      return date ? moment(date).format("DD MMM YYYY") : 'N/A';
    },

    formatTransportation(value) {
      const travelRequestStore = useTravelRequestStore();
      const options = travelRequestStore.transportationOptions;
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    },

    formatAccommodation(value) {
      const travelRequestStore = useTravelRequestStore();
      const options = travelRequestStore.accommodationOptions;
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    },

    updateLocalStatistics() {
      // Calculate statistics from current travel requests array
      this.statistics.total = this.total;
      this.statistics.pending = 0; // For simple CRUD, no approval workflow
      this.statistics.approved = this.travelRequests.length;
      this.statistics.rejected = 0;
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

/* Container overflow fixes - only apply to table cards, not statistics */
.card:not(.statistics-card) {
  overflow: visible !important;
  margin-bottom: 20px;
}

.card:not(.statistics-card) .card-body {
  overflow: visible !important;
  padding-bottom: 0;
}

/* Statistics cards styling */
.statistics-card {
  margin-bottom: 0.75rem;
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

/* Enhanced scrollbar styling - Match Ant Design Vue docs */
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

/* Fix for fixed columns - comprehensive solution */
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

/* Fix for main table headers to match fixed headers */
:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa !important;
  color: #595959 !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

/* Ensure all table cells have consistent background */
:deep(.ant-table-tbody > tr > td) {
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

/* Fix for table container and layout */
:deep(.ant-table-container) {
  border: 1px solid #e0e0e0;
  border-radius: 0;
}

/* Ensure proper table layout for fixed columns */
:deep(.ant-table-layout-fixed table) {
  table-layout: auto !important;
}

/* Fix for table wrapper */
:deep(.ant-table-wrapper) {
  background-color: #ffffff;
}

/* Action icons */
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

/* Badge styling */
.badge-soft-blue {
  background-color: rgba(54, 162, 235, 0.1);
  color: #36a2eb;
}

.badge-soft-green {
  background-color: rgba(75, 192, 192, 0.1);
  color: #4bc0c0;
}

.badge-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.2rem;
}

.text-muted {
  color: #999 !important;
}

/* Other text styling */
.other-text {
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  border-left: 3px solid #dee2e6;
  font-style: italic;
  max-width: 200px;
  word-wrap: break-word;
}

.other-text small {
  font-size: 0.7rem;
  line-height: 1.2;
}
</style>
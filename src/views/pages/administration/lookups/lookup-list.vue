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
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                      class="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                      class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-2">
            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_lookup"
              class="btn btn-primary d-flex align-items-center"><i class="ti ti-circle-plus me-2"></i>Add Lookup</a>
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

      <!-- Lookups List -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Lookups List ({{ lookupStore.getTotalItems }} total)</h5>
          <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
            <!-- Search Input -->
            <div class="me-3">
              <div class="input-group" style="width: 300px;">
                <input type="text" class="form-control" placeholder="Search lookups and press Enter..."
                  v-model="searchTerm" @keyup.enter="handleSearch">
                <button class="btn btn-primary" type="button" @click="handleSearch">
                  <i class="ti ti-search"></i>
                </button>
                <button class="btn btn-outline-secondary" type="button" @click="clearSearch" v-if="searchTerm">
                  <i class="ti ti-x"></i>
                </button>
              </div>
            </div>

            <!-- Type Filter -->
            <div class="me-3">
              <select class="form-select" v-model="selectedFilterType" @change="handleTypeFilter" style="width: 200px;">
                <option value="">All Types</option>
                <option v-for="type in availableFilterTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>

            <!-- Per Page Selector -->
            <div class="me-3">
              <select class="form-select" v-model="perPage" @change="handlePerPageChange" style="width: 100px;">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div class="ms-3">
              <a-button @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll" class="ms-2">Clear all</a-button>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading lookups...</p>
            </div>

            <div v-else>
              <!-- Lookups Table -->
              <a-table class="table datatable thead-light" :columns="columns" :data-source="data"
                :row-selection="rowSelection" :pagination="false" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'Type'">
                    <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
                  </template>
                  <template v-if="column.key === 'Value'">
                    <span>{{ record.value }}</span>
                  </template>
                  <template v-if="column.key === 'created_at'">
                    <a-tag color="blue">{{ formatDate(record.created_at) }}</a-tag>
                  </template>
                  <template v-if="column.key === 'action'">
                    <div class="action-icon d-inline-flex">
                      <a-button type="primary" size="small" class="me-2" @click="editLookup(record)">
                        <template #icon><i class="ti ti-edit"></i></template>
                      </a-button>
                      <a-button type="danger" size="small" @click="confirmDeleteLookup(record.id)">
                        <template #icon><i class="ti ti-trash"></i></template>
                      </a-button>
                    </div>
                  </template>
                </template>
              </a-table>

              <!-- Pagination Controls -->
              <div class="d-flex justify-content-between align-items-center mt-3 px-3 pb-3" v-if="pagination.total > 0">
                <div class="pagination-info">
                  <span class="text-muted">
                    Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries
                    <span v-if="searchTerm || selectedFilterType">
                      (filtered{{ searchTerm ? ` from search: "${searchTerm}"` : '' }}{{ selectedFilterType ? ` in type:
                      "${selectedFilterType}"` : '' }})
                    </span>
                  </span>
                </div>

                <div class="pagination-controls d-flex align-items-center">
                  <a-button :disabled="pagination.current_page <= 1" @click="goToPage(1)" class="me-1" size="small">
                    <i class="ti ti-chevrons-left"></i>
                  </a-button>

                  <a-button :disabled="pagination.current_page <= 1" @click="previousPage" class="me-2" size="small">
                    <i class="ti ti-chevron-left"></i>
                  </a-button>

                  <span class="mx-3">
                    Page {{ pagination.current_page }} of {{ pagination.last_page }}
                  </span>

                  <a-button :disabled="!pagination.has_more_pages" @click="nextPage" class="ms-2" size="small">
                    <i class="ti ti-chevron-right"></i>
                  </a-button>

                  <a-button :disabled="!pagination.has_more_pages" @click="goToPage(pagination.last_page)" class="ms-1"
                    size="small">
                    <i class="ti ti-chevrons-right"></i>
                  </a-button>
                </div>
              </div>

              <!-- No Results Message -->
              <div v-else-if="!loading" class="text-center py-4">
                <div class="empty-state">
                  <i class="ti ti-search fs-48 text-muted mb-3"></i>
                  <h5 class="text-muted">No lookups found</h5>
                  <p class="text-muted">
                    <span v-if="searchTerm || selectedFilterType">
                      Try adjusting your search criteria or filters.
                    </span>
                    <span v-else>
                      No lookup values have been created yet.
                    </span>
                  </p>
                  <a-button @click="clearAll" v-if="searchTerm || selectedFilterType">
                    Clear all filters
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Lookups List -->
    </div>

    <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <lookup-modal ref="lookupModal" @lookup-added="onLookupChanged" @lookup-updated="onLookupChanged"
    @lookup-deleted="onLookupChanged"></lookup-modal>
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { useLookupStore } from "@/stores/lookupStore";
import LookupModal from "@/components/modal/lookup-modal.vue";

const rowSelection = {
  onChange: () => { },
  onSelect: () => { },
  onSelectAll: () => { },
};

export default {
  components: {
    LookupModal
  },
  data() {
    return {
      title: "Lookups",
      text: "Administration",
      text1: "Lookups",
      data: [],
      rowSelection,
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      lookupStore: useLookupStore(),
      lookupTypes: [],
      // Search and filter state
      searchTerm: '',
      selectedFilterType: '',
      perPage: 10,
      // Computed properties cache
      availableFilterTypes: [],
    };
  },
  computed: {
    pagination() {
      return this.lookupStore.getPagination;
    },

    columns() {
      const { filteredInfo, sortedInfo } = this;
      const filtered = filteredInfo || {};
      const sorted = sortedInfo || {};

      return [
        {
          title: "Type",
          dataIndex: "type",
          key: "Type",
          sorter: true,
          sortOrder: sorted.columnKey === "Type" && sorted.order,
        },
        {
          title: "Value",
          dataIndex: "value",
          key: "Value",
          sorter: true,
          sortOrder: sorted.columnKey === "Value" && sorted.order,
        },
        {
          title: "Created Date",
          dataIndex: "created_at",
          key: "created_at",
          sorter: true,
          sortOrder: sorted.columnKey === "created_at" && sorted.order,
        },
        {
          title: "Action",
          key: "action",
          sorter: false,
        },
      ];
    },
  },
  async created() {
    await this.fetchLookups();
    await this.fetchLookupTypes();
  },
  mounted() {
    this.initDateRangePicker();
  },
  methods: {
    getTypeColor(type) {
      const colors = {
        'gender': 'blue',
        'subsidiary': 'green',
        'employee_status': 'orange',
        'nationality': 'purple',
        'religion': 'cyan',
        'marital_status': 'magenta',
        'site': 'gold',
        'user_status': 'lime',
        'interview_mode': 'geekblue',
        'interview_status': 'volcano',
        'identification_types': 'red',
        'employment_type': 'pink',
        'employee_language': 'lime',
        'employee_education': 'lime',
        'employee_initial_en': 'lime',
        'employee_initial_th': 'lime',
        'Default': 'default'
      };
      return colors[type] || colors['Default'];
    },

    formatDate(date) {
      return moment(date).format('DD MMM YYYY');
    },

    async fetchLookupTypes() {
      try {
        await this.lookupStore.fetchLookupTypes();
        this.lookupTypes = this.lookupStore.getAllLookupTypes;
      } catch (error) {
        console.error('Error loading lookup types:', error);
        // Fallback to extracting types from existing data
        this.lookupTypes = this.lookupStore.getAllLookupTypes;
      }
    },

    async fetchLookups() {
      this.loading = true;
      try {
        // Set current filters in store
        this.lookupStore.setSearchTerm(this.searchTerm);
        this.lookupStore.setFilterType(this.selectedFilterType);
        this.lookupStore.setPerPage(this.perPage);

        await this.lookupStore.fetchAllLookups(true);

        // Get processed data from store
        this.data = this.lookupStore.getLookups.map(lookup => ({
          key: lookup.id.toString(),
          id: lookup.id,
          type: lookup.type,
          value: lookup.value || '',
          created_at: lookup.created_at || '',
          updated_at: lookup.updated_at || '',
          created_by: lookup.created_by || '',
          updated_by: lookup.updated_by || ''
        }));

        // Update available filter types
        this.availableFilterTypes = this.lookupStore.getAvailableFilterTypes.length > 0
          ? this.lookupStore.getAvailableFilterTypes
          : this.lookupStore.getAllLookupTypes;

        if (this.data.length > 0) {
          this.$message.success(`Loaded ${this.pagination.total} lookups`);
        }
      } catch (error) {
        console.error('Error loading lookups:', error);
        this.$message.error('Failed to load lookups');
      } finally {
        this.loading = false;
      }
    },



    editLookup(record) {
      // Pass the lookup data to the modal component
      this.$refs.lookupModal.setEditLookup(record);
    },

    confirmDeleteLookup(lookupId) {
      this.$confirm({
        title: 'Are you sure you want to delete this lookup?',
        content: 'This action cannot be undone.',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => {
          this.deleteLookup(lookupId);
        }
      });
    },

    async deleteLookup(lookupId) {
      try {
        const result = await this.lookupStore.deleteLookup(lookupId);
        if (result) {
          this.$message.success('Lookup deleted successfully');
          this.fetchLookups();
        } else {
          this.$message.error('Failed to delete lookup');
        }
      } catch (error) {
        console.error('Error deleting lookup:', error);
        this.$message.error('An error occurred while deleting the lookup');
      }
    },

    async onLookupChanged() {
      // Refresh both lookups and lookup types when any lookup is added/updated/deleted
      await this.fetchLookups();
      await this.fetchLookupTypes();
    },

    // Search functionality - triggers only on Enter or search button click
    async handleSearch() {
      await this.fetchLookups();
    },

    clearSearch() {
      this.searchTerm = '';
      this.fetchLookups();
    },

    // Filter functionality
    async handleTypeFilter() {
      await this.fetchLookups();
    },

    async handlePerPageChange() {
      await this.fetchLookups();
    },

    // Pagination methods
    async nextPage() {
      await this.lookupStore.nextPage();
      this.updateDataFromStore();
    },

    async previousPage() {
      await this.lookupStore.prevPage();
      this.updateDataFromStore();
    },

    async goToPage(page) {
      await this.lookupStore.goToPage(page);
      this.updateDataFromStore();
    },

    // Table sorting
    async handleTableChange(pagination, filters, sorter) {
      if (sorter && sorter.field) {
        let sortBy = sorter.field;
        let sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';

        // Map frontend sort fields to backend fields
        if (sortBy === 'Type') sortBy = 'type';
        if (sortBy === 'Value') sortBy = 'value';

        this.lookupStore.setSort(sortBy, sortOrder);
        await this.fetchLookups();
      }
    },

    // Update local data from store
    updateDataFromStore() {
      this.data = this.lookupStore.getLookups.map(lookup => ({
        key: lookup.id.toString(),
        id: lookup.id,
        type: lookup.type,
        value: lookup.value || '',
        created_at: lookup.created_at || '',
        updated_at: lookup.updated_at || '',
        created_by: lookup.created_by || '',
        updated_by: lookup.updated_by || ''
      }));
    },

    initDateRangePicker() {
      const dateRangeInput = document.getElementById('daterange');
      if (dateRangeInput) {
        const start = moment().subtract(6, "days");
        const end = moment();

        new DateRangePicker(
          dateRangeInput,
          {
            startDate: start,
            endDate: end,
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              "Last 7 Days": [moment().subtract(6, "days"), moment()],
              "Last 30 Days": [moment().subtract(29, "days"), moment()],
              "This Month": [moment().startOf("month"), moment().endOf("month")],
              "Last Month": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
              ],
            },
          },
          this.date_range
        );

        this.date_range(start, end);
      }
    },

    date_range(start, end) {
      return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    handleChange(pagination, filters, sorter) {
      console.log("Various parameters", pagination, filters, sorter);
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
    },

    async clearFilters() {
      this.searchTerm = '';
      this.selectedFilterType = '';
      this.lookupStore.clearFilters();
      await this.fetchLookups();
    },

    async clearAll() {
      this.searchTerm = '';
      this.selectedFilterType = '';
      this.perPage = 10;
      this.filteredInfo = null;
      this.sortedInfo = null;
      this.lookupStore.clearAllFilters();
      await this.fetchLookups();
    },


  },
};
</script>

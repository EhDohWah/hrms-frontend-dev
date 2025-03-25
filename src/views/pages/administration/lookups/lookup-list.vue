<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div
        class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3"
      >
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-pdf me-1"></i>Export as PDF</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-2">
            <a
              href="javascript:void(0);"
              data-bs-toggle="modal"
              data-bs-target="#add_lookup"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Add Lookup</a
            >
          </div>
          <div class="head-icons ms-2">
            <a
              href="javascript:void(0);"
              class=""
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-original-title="Collapse"
              id="collapse-header"
              @click="toggleHeader"
            >
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Lookups List -->
      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>Lookups List</h5>
          <div
            class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3"
          >
            <div class="ms-3">
              <a-button @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll" class="ms-2">Clear filters and sorters</a-button>
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
              <a-tabs v-model:activeKey="activeTabKey" @change="handleTabChange">
                <a-tab-pane v-for="type in lookupTypes" :key="type" :tab="type">
                  <a-table
                    class="table datatable thead-light"
                    :columns="columns"
                    :data-source="getFilteredData(type)"
                    :row-selection="rowSelection"
                    @change="handleChange"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'id'">
                        <span>{{ record.id }}</span>
                      </template>
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
                          <a-button 
                            type="primary"
                            size="small"
                            class="me-2"
                            @click="editLookup(record)"
                          >
                            <template #icon><i class="ti ti-edit"></i></template>
                          </a-button>
                          <a-button
                            type="danger"
                            size="small"
                            @click="confirmDeleteLookup(record.id)"
                          >
                            <template #icon><i class="ti ti-trash"></i></template>
                          </a-button>
                        </div>
                      </template>
                    </template>
                  </a-table>
                </a-tab-pane>
                <a-tab-pane key="all" tab="All Lookups">
                  <a-table
                    class="table datatable thead-light"
                    :columns="columns"
                    :data-source="data"
                    :row-selection="rowSelection"
                    @change="handleChange"
                  >
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
                          <a-button 
                            type="primary"
                            size="small"
                            class="me-2"
                            @click="editLookup(record)"
                          >
                            <template #icon><i class="ti ti-edit"></i></template>
                          </a-button>
                          <a-button
                            type="danger"
                            size="small"
                            @click="confirmDeleteLookup(record.id)"
                          >
                            <template #icon><i class="ti ti-trash"></i></template>
                          </a-button>
                        </div>
                      </template>
                    </template>
                  </a-table>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>
      <!-- /Lookups List -->
    </div>

    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <lookup-modal ref="lookupModal" @lookup-added="fetchLookups" @lookup-updated="fetchLookups" @lookup-deleted="fetchLookups"></lookup-modal>
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { useLookupStore } from "@/stores/lookupStore";
import LookupModal from "@/components/modal/lookup-modal.vue";

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
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
      activeTabKey: "all",
      lookupTypes: [],
    };
  },
  computed: {
    columns() {
      const { filteredInfo, sortedInfo } = this;
      const filtered = filteredInfo || {};
      const sorted = sortedInfo || {};

      return [
        {
          title: "Type",
          dataIndex: "type",
          key: "Type",
          filters: this.getTypeFilters(),
          filteredValue: filtered.Type || null,
          filterSearch: true,
          onFilter: (value, record) => record.type.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.type.toLowerCase();
              b = b.type.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Type" && sorted.order,
        },
        {
          title: "Value",
          dataIndex: "value",
          key: "Value",
          filters: this.getValueFilters(),
          filteredValue: filtered.Value || null,
          filterSearch: true,
          onFilter: (value, record) => record.value.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.value.toLowerCase();
              b = b.value.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Value" && sorted.order,
        },
        {
          title: "Created Date",
          dataIndex: "created_at",
          key: "created_at",
          sorter: {
            compare: (a, b) => {
              return moment(a.created_at).unix() - moment(b.created_at).unix();
            },
          },
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
  created() {
    this.fetchLookups();
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
        'Default': 'default'
      };
      return colors[type] || colors['Default'];
    },

    formatDate(date) {
      return moment(date).format('DD MMM YYYY');
    },

    async fetchLookups() {
      this.loading = true;
      try {
        await this.lookupStore.fetchAllLookups();
        
        // Get all lookup types from the store's getter
        this.lookupTypes = this.lookupStore.getAllLookupTypes;
        
        // Process the data
        this.data = [];
        for (const type in this.lookupStore.lookupsByType) {
          const lookupsOfType = this.lookupStore.lookupsByType[type];
          if (Array.isArray(lookupsOfType)) {
            const processedLookups = lookupsOfType.map(lookup => ({
              key: lookup.id.toString(),
              id: lookup.id,
              type: lookup.type,
              value: lookup.value || '',
              created_at: lookup.created_at || '',
              updated_at: lookup.updated_at || '',
              created_by: lookup.created_by || '',
              updated_by: lookup.updated_by || ''
            }));
            this.data.push(...processedLookups);
          }
        }
        
        this.$message.success('Lookups loaded successfully');
      } catch (error) {
        console.error('Error loading lookups:', error);
        this.$message.error('Failed to load lookups');
      } finally {
        this.loading = false;
      }
    },
    
    getFilteredData(type) {
      return this.data.filter(item => item.type === type);
    },
    
    handleTabChange(activeKey) {
      this.activeTabKey = activeKey;
      // Reset filters and sorters when changing tabs
      this.clearAll();
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
    
    clearFilters() {
      this.filteredInfo = null;
    },
    
    clearAll() {
      this.filteredInfo = null;
      this.sortedInfo = null;
    },
    
    getTypeFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      const types = [...new Set(this.data.map(item => item.type))];
      return types.map(type => ({ text: type, value: type }));
    },
    
    getValueFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      
      // If we're on a specific tab, only show values for that type
      if (this.activeTabKey !== 'all') {
        const values = [...new Set(this.getFilteredData(this.activeTabKey).map(item => item.value))];
        return values.map(value => ({ text: value, value: value }));
      }
      
      // Otherwise show all values
      const values = [...new Set(this.data.map(item => item.value))];
      return values.map(value => ({ text: value, value: value }));
    }
  },
};
</script>

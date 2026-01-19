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
              class="btn btn-primary d-flex align-items-center"
              @click="openAddSiteModal"
              ><i class="ti ti-circle-plus me-2"></i>Add Site</a
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

      <!-- Site Location list -->
      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>Site Location List</h5>
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
              <p class="mt-2">Loading work locations...</p>
            </div>
            
            <a-table
              v-else
              class="table datatable thead-light"
              :columns="columns"
              :data-source="data"
              :row-selection="rowSelection"
              @change="handleChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                  <h6 class="fw-medium fs-14 text-dark">{{ record.name }}</h6>
                </template>
                <template v-if="column.key === 'type'">
                  <span class="badge badge-primary p-2 fs-10">{{ record.type }}</span>
                </template>
                <template v-if="column.key === 'Status'">
                  <span
                    :class="[
                      'badge',
                      record.status === 'Active'
                        ? 'badge-success'
                        : 'badge-danger',
                      'align-items-center',
                      'badge-xs',
                    ]"
                  >
                    <i class="ti ti-point-filled me-1"></i>
                    {{ record.status || 'Active' }}
                  </span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      title="Edit Work Location"
                      @click="editWorkLocation(record)"
                      ><i class="ti ti-edit"></i
                    ></a>
                    <a
                      href="javascript:void(0);"
                      title="Delete Work Location"
                      @click="confirmDeleteWorkLocation(record.id)"
                      ><i class="ti ti-trash"></i
                    ></a>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <!-- /Site Location list -->
    </div>

    <layout-footer></layout-footer>
  </div>
  <!-- /Page Wrapper -->
  <WorkLocationModal ref="workLocationModal" @location-added="fetchWorkLocations" @location-updated="fetchWorkLocations" @location-deleted="fetchWorkLocations"></WorkLocationModal>
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { workLocationService } from "@/services/worklocation.service";
import WorkLocationModal from "@/components/modal/work-location-modal.vue";

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};

export default {
  components: {
    WorkLocationModal
  },
  data() {
    return {
      title: "Site Locations",
      text: "Employee",
      text1: "Site Locations",
      data: [],
      rowSelection,
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
    };
  },
  computed: {
    columns() {
      const { filteredInfo, sortedInfo } = this;
      const filtered = filteredInfo || {};
      const sorted = sortedInfo || {};

      return [
        {
          sorter: false,
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
          title: "Type",
          dataIndex: "type",
          key: "type",
          filters: this.getTypeFilters(),
          filteredValue: filtered.type || null,
          filterSearch: true,
          onFilter: (value, record) => record.type.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.type.toLowerCase();
              b = b.type.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "type" && sorted.order,
        },
        {
          title: "No of Employees",
          dataIndex: "employeeCount",
          key: "employeeCount",
          sorter: {
            compare: (a, b) => {
              return parseInt(a.employeeCount || 0) - parseInt(b.employeeCount || 0);
            },
          },
          sortOrder: sorted.columnKey === "employeeCount" && sorted.order,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "Status",
          filters: [
            { text: 'Active', value: 'Active' },
            { text: 'Inactive', value: 'Inactive' },
          ],
          filteredValue: filtered.Status || null,
          onFilter: (value, record) => record.status === value,
          sorter: {
            compare: (a, b) => {
              a = (a.status || 'Active').toLowerCase();
              b = (b.status || 'Active').toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Status" && sorted.order,
        },
        {
          title: "Created Date",
          dataIndex: "created_at",
          render: (text) => {
            return text ? moment(text).format('DD MMM YYYY') : '';
          },
          sorter: {
            compare: (a, b) => {
              return moment(a.created_at || 0).unix() - moment(b.created_at || 0).unix();
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
    this.fetchWorkLocations();
  },
  mounted() {
    this.initDateRangePicker();
  },
  methods: {
    async fetchWorkLocations() {
      this.loading = true;
      try {
        const response = await workLocationService.getAllWorkLocations();
        if (response && response.status === 'success') {
          this.data = response.data.map(location => ({
            key: location.id.toString(),
            id: location.id,
            name: location.name || '',
            type: location.type || '',
            employeeCount: location.employee_count || '0',
            status: location.status || 'Active',
            created_at: location.created_at ? moment(location.created_at).format('DD/MM/YYYY') : '',
            updated_at: location.updated_at ? moment(location.updated_at).format('DD/MM/YYYY') : '',
            created_by: location.created_by || '',
            updated_by: location.updated_by || ''
          }));
          this.$message.success('Work locations loaded successfully');
        } else {
          throw new Error('Failed to fetch work locations');
        }
      } catch (error) {
        console.error('Error loading work locations:', error);
        this.$message.error('Failed to load work locations');
      } finally {
        this.loading = false;
      }
    },
    
    openAddSiteModal() {
      this.$refs.workLocationModal.openAddModal();
    },
    
    editWorkLocation(record) {
      this.$refs.workLocationModal.setEditLocation(record);
    },
    
    async confirmDeleteWorkLocation(locationId) {
      this.$refs.workLocationModal.confirmDeleteLocation(locationId);
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
          this.booking_range
        );

        this.booking_range(start, end);
      }
    },
    
    booking_range(start, end) {
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
    
    getNameFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      const names = [...new Set(this.data.map(item => item.name))];
      return names.map(name => ({ text: name, value: name }));
    },
    
    getTypeFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      const types = [...new Set(this.data.map(item => item.type))];
      return types.map(type => ({ text: type, value: type }));
    }
  },
};
</script>

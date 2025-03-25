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
              data-bs-target="#add_department_position"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Add Department Position</a
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

      <!-- Department Positions List -->
      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>Department Positions List</h5>
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
              <p class="mt-2">Loading department positions...</p>
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
                <template v-if="column.key === 'id'">
                  <span>{{ record.id }}</span>
                </template>
                <template v-if="column.key === 'Department'">
                  <span class="badge badge-primary p-2 fs-10">{{ record.department }}</span>
                </template>
                <template v-if="column.key === 'Position'">
                  <span>{{ record.position }}</span>
                </template>
                <template v-if="column.key === 'ReportTo'">
                  <span>{{ record.report_to ? record.report_to : 'None' }}</span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      title="Edit Department Position"
                      @click="editDepartmentPosition(record)"
                      ><i class="ti ti-edit"></i
                    ></a>
                    <a
                      href="javascript:void(0);"
                      title="Delete Department Position"
                      @click="confirmDeleteDepartmentPosition(record.id)"
                      ><i class="ti ti-trash"></i
                    ></a>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <!-- /Department Positions List -->
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
  <DepartmentPositionModal ref="departmentPositionModal" @position-added="fetchDepartmentPositions" @position-updated="fetchDepartmentPositions" @position-deleted="fetchDepartmentPositions"></DepartmentPositionModal>
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { useDepartmentPositionStore } from "@/stores/departmentPositionStore";
import DepartmentPositionModal from "@/components/modal/department-position-modal.vue";

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};

export default {
  components: {
    DepartmentPositionModal
  },
  data() {
    return {
      title: "Department Positions",
      text: "Administration",
      text1: "Department Positions",
      data: [],
      rowSelection,
      filteredInfo: null,
      sortedInfo: null,
      loading: false,
      departmentPositionStore: useDepartmentPositionStore(),
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
          title: "ID",
          dataIndex: "id",
          key: "id",
          sorter: false,
        },
        {
          title: "Department",
          dataIndex: "department",
          key: "Department",
          filters: this.getDepartmentFilters(),
          filteredValue: filtered.Department || null,
          filterSearch: true,
          onFilter: (value, record) => record.department.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.department.toLowerCase();
              b = b.department.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Department" && sorted.order,
        },
        {
          title: "Position",
          dataIndex: "position",
          key: "Position",
          filters: this.getPositionFilters(),
          filteredValue: filtered.Position || null,
          filterSearch: true,
          onFilter: (value, record) => record.position.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.position.toLowerCase();
              b = b.position.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "Position" && sorted.order,
        },
        {
          title: "Reports To",
          dataIndex: "report_to",
          key: "ReportTo",
          filters: this.getReportToFilters(),
          filteredValue: filtered.ReportTo || null,
          onFilter: (value, record) => {
            if (value === "none") {
              return !record.report_to;
            }
            return record.report_to === value;
          },
          sorter: {
            compare: (a, b) => {
              const reportToA = a.report_to || '';
              const reportToB = b.report_to || '';
              return reportToA > reportToB ? -1 : reportToB > reportToA ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "ReportTo" && sorted.order,
        },
        {
          title: "Created Date",
          dataIndex: "created_at",
          render: (text) => {
            return moment(text).format('DD MMM YYYY');
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
    this.fetchDepartmentPositions();
  },
  mounted() {
    this.initDateRangePicker();
  },
  methods: {
    async fetchDepartmentPositions() {
      this.loading = true;
      try {
        await this.departmentPositionStore.fetchDepartmentPositions();
        this.data = this.departmentPositionStore.departmentPositions.map(position => ({
          key: position.id.toString(),
          id: position.id,
          department: position.department || '',
          position: position.position || '',
          report_to: position.report_to || null,
          created_at: position.created_at ? moment(position.created_at).format('DD/MM/YYYY') : '',
          updated_at: position.updated_at ? moment(position.updated_at).format('DD/MM/YYYY') : '',
          created_by: position.created_by || '',
          updated_by: position.updated_by || ''
        }));
        this.$message.success('Department positions loaded successfully');
      } catch (error) {
        console.error('Error loading department positions:', error);
        this.$message.error('Failed to load department positions');
      } finally {
        this.loading = false;
      }
    },
    
    getReportToName(id) {
      const position = this.data.find(item => item.id.toString() === id.toString());
      return position ? `${position.department} - ${position.position}` : 'Unknown';
    },
    
    editDepartmentPosition(record) {
      // Pass the department position data to the modal component
      this.$refs.departmentPositionModal.setEditPosition(record);
    },
    
    confirmDeleteDepartmentPosition(positionId) {
      // Pass the department position ID to the modal component's confirmDelete method
      this.$refs.departmentPositionModal.confirmDeletePosition(positionId);
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
    
    getDepartmentFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      const departments = [...new Set(this.data.map(item => item.department))];
      return departments.map(department => ({ text: department, value: department }));
    },
    
    getPositionFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      const positions = [...new Set(this.data.map(item => item.position))];
      return positions.map(position => ({ text: position, value: position }));
    },
    
    getReportToFilters() {
      if (!this.data || this.data.length === 0) {
        return [];
      }
      
      const filters = [{ text: 'None', value: 'none' }];
      
      // Get unique report_to values that are not null
      const reportToIds = [...new Set(this.data
        .filter(item => item.report_to)
        .map(item => item.report_to))];
      
      // Add each report_to position as a filter option
      reportToIds.forEach(id => {
        const position = this.data.find(item => item.id.toString() === id.toString());
        if (position) {
          filters.push({
            text: `${position.department} - ${position.position}`,
            value: id
          });
        }
      });
      
      return filters;
    }
  },
};
</script>

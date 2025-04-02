<template>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Breadcrumb & Export -->
        <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
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
                    <a href="javascript:void(0);" class="dropdown-item rounded-1">
                      <i class="ti ti-file-type-pdf me-1"></i>Export as PDF
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);" class="dropdown-item rounded-1">
                      <i class="ti ti-file-type-xls me-1"></i>Export as Excel
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="mb-2 me-2">
              <a-button type="primary" class="btn btn-primary d-flex align-items-center" @click="openAddEmploymentModal">
                <i class="ti ti-circle-plus me-2"></i>Add Employment
              </a-button>
            </div>
          </div>
        </div>
        <!-- /Breadcrumb -->
  
        <div class="card">
          <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <h5>Employment List</h5>
            <div class="table-operations">
              <a-button @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading employment records...</p>
            </div>
            <div v-else>
              <a-table 
                :columns="columns" 
                :data-source="tableData" 
                :pagination="pagination"
                :scroll="{ x: 'max-content' }"
                row-key="id"
                @change="handleTableChange"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'actions'">
                    <div class="action-icon d-inline-flex">
                      <a href="javascript:void(0);" class="me-2" @click="openEditEmploymentModal(record)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a href="javascript:void(0);" @click="deleteEmployment(record.id)">
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </template>
                  <template v-else-if="column.dataIndex === 'salary'">
                    {{ formatCurrency(record.salary) }}
                  </template>
                  <template v-else-if="column.dataIndex === 'start_date' || column.dataIndex === 'end_date'">
                    {{ formatDate(record[column.dataIndex]) }}
                  </template>
                  <template v-else-if="column.dataIndex === 'status'">
                    <span :class="record.active ? 'badge bg-success' : 'badge bg-danger'">
                      {{ record.active ? 'Active' : 'Inactive' }}
                    </span>
                  </template>
                  <template v-else>
                    {{ record[column.dataIndex] }}
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
      <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
        <p class="mb-0">2014 - 2025 &copy; HRMS</p>
        <p>
          Designed &amp; Developed By
          <a href="javascript:void(0);" class="text-primary">Dreams</a>
        </p>
      </div>
  
      <!-- Employment Modal Component -->
      <employment-modal
        ref="employmentModal"
        @employment-added="fetchEmployments"
        @employment-updated="fetchEmployments"
      />
  
      <!-- Notification Toast -->
      <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
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
    </div>
  </template>
  
  <script>
  import { message } from 'ant-design-vue';
  import { Modal as AntModal } from 'ant-design-vue';
  import { ref, computed } from 'vue';
  import moment from 'moment';
  import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
  import EmploymentModal from '@/components/modal/employment-modal.vue';
  import { employmentService } from '@/services/employment.service';
  
  export default {
    name: 'EmploymentList',
    components: {
      EmploymentModal,
      indexBreadcrumb,
    },
    setup() {
      const filteredInfo = ref({});
      const sortedInfo = ref({});
      const currentPage = ref(1);
      const pageSize = ref(10);
      const total = ref(0);
      
      const pagination = computed(() => ({
        total: total.value,
        current: currentPage.value,
        pageSize: pageSize.value,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `Total ${total} items`
      }));
  
      return {
        filteredInfo,
        sortedInfo,
        currentPage,
        pageSize,
        total,
        pagination,
      };
    },
    data() {
      return {
        title: 'Employment Records',
        text: 'HR Management',
        text1: 'Employment List',
        employments: [],
        loading: false,
        notificationTitle: '',
        notificationMessage: '',
        notificationClass: '',
      };
    },
    computed: {
      columns() {
        const filtered = this.filteredInfo || {};
        const sorted = this.sortedInfo || {};
        return [
          {
            title: 'Employment',
            dataIndex: 'employee_name',
            key: 'employee_name',
            filters: this.getUniqueValues('employee_name'),
            filteredValue: filtered.employee_name || null,
            onFilter: (value, record) => record.employee_name.includes(value),
            sorter: (a, b) => a.employee_name.localeCompare(b.employee_name),
            sortOrder: sorted.columnKey === 'employee_name' && sorted.order,
            filterSearch: true,
          },
          {
            title: 'Employment Type',
            dataIndex: 'employment_type',
            key: 'employment_type',
            filters: [
              { text: 'Full-Time', value: 'Full-Time' },
              { text: 'Part-Time', value: 'Part-Time' },
              { text: 'Contract', value: 'Contract' },
              { text: 'Temporary', value: 'Temporary' },
              { text: 'Internship', value: 'Internship' },
            ],
            filteredValue: filtered.employment_type || null,
            onFilter: (value, record) => record.employment_type === value,
            sorter: (a, b) => a.employment_type.localeCompare(b.employment_type),
            sortOrder: sorted.columnKey === 'employment_type' && sorted.order,
          },
          {
            title: 'Department Position',
            dataIndex: 'department_position',
            key: 'department_position',
            filters: this.getUniqueValues('department_position'),
            filteredValue: filtered.department_position || null,
            onFilter: (value, record) => record.department_position.includes(value),
            sorter: (a, b) => a.department_position.localeCompare(b.department_position),
            sortOrder: sorted.columnKey === 'department_position' && sorted.order,
            filterSearch: true,
          },
          {
            title: 'Work Location',
            dataIndex: 'work_location',
            key: 'work_location',
            filters: this.getUniqueValues('work_location'),
            filteredValue: filtered.work_location || null,
            onFilter: (value, record) => record.work_location.includes(value),
            sorter: (a, b) => a.work_location.localeCompare(b.work_location),
            sortOrder: sorted.columnKey === 'work_location' && sorted.order,
            filterSearch: true,
          },
          {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            sorter: (a, b) => moment(a.start_date).unix() - moment(b.start_date).unix(),
            sortOrder: sorted.columnKey === 'start_date' && sorted.order,
          },
          {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            sorter: (a, b) => moment(a.end_date).unix() - moment(b.end_date).unix(),
            sortOrder: sorted.columnKey === 'end_date' && sorted.order,
          },
          {
            title: 'Salary',
            dataIndex: 'salary',
            key: 'salary',
            sorter: (a, b) => a.salary - b.salary,
            sortOrder: sorted.columnKey === 'salary' && sorted.order,
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
              { text: 'Active', value: true },
              { text: 'Inactive', value: false },
            ],
            filteredValue: filtered.status || null,
            onFilter: (value, record) => record.active === value,
            sorter: (a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1),
            sortOrder: sorted.columnKey === 'status' && sorted.order,
          },
          {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
          }
        ];
      },
      tableData() {
        return this.employments.map(emp => ({
          ...emp,
          key: emp.id,
          employee_name: emp.employee ? emp.employee.first_name_en + ' ' + emp.employee.last_name_en : 'N/A',
          department_position: emp.department_position ? emp.department_position.department + ' | ' + emp.department_position.position : 'N/A',
          work_location: emp.work_location ? emp.work_location.name : 'N/A',
          status: emp.active ? 'Active' : 'Inactive',
        }));
      }
    },
    mounted() {
      this.fetchEmployments();
    },
    methods: {
      getUniqueValues(field) {
        const values = [...new Set(this.employments.map(item => {
          if (field === 'employee_name')
            return item.employee ? item.employee.first_name_en + ' ' + item.employee.last_name_en : '';
          if (field === 'department_position')
            return item.departmentPosition ? item.department_position.department + ' | ' + item.department_position.position : '';
          if (field === 'work_location')
            return item.workLocation ? item.workLocation.name : '';
          return item[field];
        }))].filter(Boolean);
        return values.map(value => ({ text: value, value }));
      },
      handleTableChange(pagination, filters, sorter) {
        this.currentPage = pagination.current;
        this.pageSize = pagination.pageSize;
        this.filteredInfo = filters;
        this.sortedInfo = sorter;
      },
      clearFilters() {
        this.filteredInfo = {};
      },
      clearAll() {
        this.filteredInfo = {};
        this.sortedInfo = {};
      },
      async fetchEmployments() {
        this.loading = true;
        try {
          const response = await employmentService.getEmployments();
          this.employments = response.data || [];
          this.total = this.employments.length;
          this.showNotification('Success', 'Employment records loaded successfully', 'bg-success');
        } catch (error) {
          console.error('Error fetching employments:', error);
          this.showNotification('Error', 'Failed to load employment records', 'bg-danger');
        } finally {
          this.loading = false;
        }
      },
      openAddEmploymentModal() {
        this.$refs.employmentModal.openModal();
      },
      openEditEmploymentModal(record) {
        this.$refs.employmentModal.employmentData = record;
        this.$refs.employmentModal.editMode = true;
        this.$refs.employmentModal.openModal();
      },
      async deleteEmployment(id) {
        try {
            AntModal.confirm({
            title: 'Are you sure?',
            content: 'You are about to delete this employment record. This action cannot be undone.',
            centered: true,
            okText: 'Yes, delete',
            cancelText: 'Cancel',
            onOk: async function() {
                try {
                await employmentService.deleteEmployment(id);
                this.employments = this.employments.filter(emp => emp.id !== id);
                this.total = this.employments.length;
                this.showNotification('Success', 'Employment record deleted successfully', 'bg-success');
                } catch (error) {
                console.error('Error deleting employment:', error);
                this.showNotification('Error', 'Failed to delete employment record', 'bg-danger');
                }
            }.bind(this),
            onCancel() {}
            });
        } catch (error) {
            console.error('Delete confirmation failed:', error);
        }
        },

        showNotification(title, msg, className) {
            // You can optionally use the title if needed.
            if (className === 'bg-success') {
            message.success(msg);
            } else if (className === 'bg-danger') {
            message.error(msg);
            } else {
            message.info(msg);
            }
        },
      formatDate(dateString) {
        if (!dateString) return '';
        return moment(dateString).format('YYYY-MM-DD');
      },
      formatCurrency(value) {
        if (!value) return '$0.00';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      }
    }
  };
  </script>
  
  <style scoped>
  .table-operations {
    margin-bottom: 16px;
  }
  
  .table-operations > button {
    margin-right: 8px;
  }
  
  .action-icon i {
    font-size: 1.2rem;
    color: #333;
  }
  
  .action-icon i:hover {
    color: #007bff;
  }
  </style>
  
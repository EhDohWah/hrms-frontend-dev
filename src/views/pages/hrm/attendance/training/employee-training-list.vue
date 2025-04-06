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
          <div class="mb-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddEmployeeTrainingModal">
              <i class="ti ti-circle-plus me-2"></i>Add Employee Training
            </button>
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

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Employee Training List</h5>
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
            <p class="mt-2">Loading employee trainings...</p>
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
                    <router-link :to="`/hrm/attendance/training/employee-training-details/${record.id}`" class="me-2">
                      <i class="ti ti-eye"></i>
                    </router-link>
                    <a href="javascript:void(0);" class="me-2" @click="openEditEmployeeTrainingModal(record)">
                      <i class="ti ti-edit"></i>
                    </a>
                    <a href="javascript:void(0);" @click="deleteEmployeeTraining(record.id)">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>
                <template v-if="column.dataIndex === 'status'">
                  <span :class="getStatusClass(record.status)">{{ record.status }}</span>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>

  <!-- Employee Training Modal -->
  <employee-training-modal ref="employeeTrainingModal" @submit="handleEmployeeTrainingSubmit" />
  
  
</template>
<script>
import { Modal as AntModal } from 'ant-design-vue';
import { useTrainingStore } from '@/stores/trainingStore';
import employeeTrainingModal from '@/components/modal/employee-training-modal.vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';

export default {
  name: 'EmployeeTrainingList',
  components: {
    employeeTrainingModal,
    indexBreadcrumb
  },
  data() {
    return {
      title: 'Employee Training',
      text: 'HRM',
      text1: 'Employee Training',
      employeeTrainings: [
        {
          id: 1,
          employee: 'John Doe',
          training: 'Leadership Skills',
          training_type: 'Soft Skills',
          training_date: '2023-05-15',
          status: 'completed'
        },
        {
          id: 2,
          employee: 'Jane Smith',
          training: 'Project Management',
          training_type: 'Professional',
          training_date: '2023-06-20',
          status: 'pending'
        },
        {
          id: 3,
          employee: 'Michael Johnson',
          training: 'Technical Writing',
          training_type: 'Technical',
          training_date: '2023-04-10',
          status: 'completed'
        },
        {
          id: 4,
          employee: 'Emily Davis',
          training: 'Data Analysis',
          training_type: 'Technical',
          training_date: '2023-07-05',
          status: 'pending'
        },
        {
          id: 5,
          employee: 'Robert Wilson',
          training: 'Customer Service',
          training_type: 'Soft Skills',
          training_date: '2023-03-25',
          status: 'cancelled'
        },
        {
          id: 6,
          employee: 'Sarah Brown',
          training: 'Advanced Excel',
          training_type: 'Technical',
          training_date: '2023-08-12',
          status: 'completed'
        },
        {
          id: 7,
          employee: 'David Miller',
          training: 'Team Building',
          training_type: 'Soft Skills',
          training_date: '2023-09-18',
          status: 'pending'
        },
        {
          id: 8,
          employee: 'Jennifer Taylor',
          training: 'Public Speaking',
          training_type: 'Soft Skills',
          training_date: '2023-06-30',
          status: 'completed'
        },
        {
          id: 9,
          employee: 'Thomas Anderson',
          training: 'Cybersecurity',
          training_type: 'Technical',
          training_date: '2023-07-22',
          status: 'pending'
        },
        {
          id: 10,
          employee: 'Lisa Martinez',
          training: 'Time Management',
          training_type: 'Professional',
          training_date: '2023-05-28',
          status: 'completed'
        }
      ],
      loading: false,
      notificationTitle: '',
      notificationMessage: '',
      notificationClass: 'bg-success',
      filteredInfo: {},
      sortedInfo: {},
      currentPage: 1,
      pageSize: 10,
      total: 10,
      trainingStore: useTrainingStore()
    };
  },
  computed: {
    pagination() {
      return {
        total: this.total,
        current: this.currentPage,
        pageSize: this.pageSize,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `Total ${total} items`
      };
    },
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};
      
      return [
        {
          title: 'Employee',
          dataIndex: 'employee',
          key: 'employee',
          filters: this.getUniqueValues('employee'),
          filteredValue: filtered.employee || null,
          onFilter: (value, record) => record.employee.includes(value),
          sorter: (a, b) => a.employee.localeCompare(b.employee),
          sortOrder: sorted.columnKey === 'employee' && sorted.order,
          filterSearch: true,
        },
        { 
          title: 'Training',
          dataIndex: 'training',
          key: 'training',
          filters: this.getUniqueValues('training'),
          filteredValue: filtered.training || null,
          onFilter: (value, record) => record.training.includes(value),
          sorter: (a, b) => a.training.localeCompare(b.training),
          sortOrder: sorted.columnKey === 'training' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Training Type',
          dataIndex: 'training_type',
          key: 'training_type',
          filters: this.getUniqueValues('training_type'),
          filteredValue: filtered.training_type || null,
          onFilter: (value, record) => record.training_type.includes(value),
          sorter: (a, b) => a.training_type.localeCompare(b.training_type),
          sortOrder: sorted.columnKey === 'training_type' && sorted.order,
        },
        {
          title: 'Training Date',
          dataIndex: 'training_date',
          key: 'training_date',
          sorter: (a, b) => new Date(a.training_date) - new Date(b.training_date),
          sortOrder: sorted.columnKey === 'training_date' && sorted.order,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: 'Pending', value: 'pending' },
            { text: 'Completed', value: 'completed' },
            { text: 'Cancelled', value: 'cancelled' },
          ],
          filteredValue: filtered.status || null,
          onFilter: (value, record) => record.status === value,
          sorter: (a, b) => a.status.localeCompare(b.status),
          sortOrder: sorted.columnKey === 'status' && sorted.order,
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
        },
      ];
    },
    tableData() {
      return this.employeeTrainings.map(training => ({
        ...training,
        key: training.id
      }));
    }
  },
  mounted() {
    // Comment out the actual data fetching
    // this.fetchEmployeeTrainings();
    
    // Instead, just show a success notification for the dummy data
    this.$message.success('Employee trainings loaded successfully');
  },
  methods: {
    getUniqueValues(field) {
      const values = [...new Set(this.employeeTrainings.map(item => item[field]))].filter(Boolean);
      return values.map(value => ({ text: value, value }));
    },
    getStatusClass(status) {
      switch (status) {
        case 'pending':
          return 'text-warning';
        case 'completed':
          return 'text-success';
        case 'cancelled':
          return 'text-danger';
        default:
          return '';
      }
    },
    handleTableChange(paginationInfo, filters, sorter) {
      this.currentPage = paginationInfo.current;
      this.pageSize = paginationInfo.pageSize;
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
    fetchEmployeeTrainings() {
      this.loading = true;
      this.trainingStore.fetchEmployeeTrainings()
        .then((data) => {
          this.employeeTrainings = data;
          this.total = data.length;
          this.$message.success('Employee trainings loaded successfully');
        })
        .catch((error) => {
          console.error('Error fetching employee trainings:', error);
          this.$message.error('Failed to load employee trainings');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openAddEmployeeTrainingModal() {
      if (this.$refs.employeeTrainingModal) {
        this.$refs.employeeTrainingModal.editMode = false;
        this.$refs.employeeTrainingModal.trainingData = null;
        this.$refs.employeeTrainingModal.open();
      }
    },
    openEditEmployeeTrainingModal(record) {
      if (this.$refs.employeeTrainingModal) {
        this.$refs.employeeTrainingModal.trainingData = record;
        this.$refs.employeeTrainingModal.editMode = true;
        this.$refs.employeeTrainingModal.open();
      }
    },
    handleEmployeeTrainingSubmit(data) {
      this.loading = true;
      const action = data.id ? 
        this.trainingStore.updateEmployeeTraining(data.id, data) : 
        this.trainingStore.createEmployeeTraining(data);
      
      action
        .then(() => {
          const message = data.id ? 
            'Employee training updated successfully' : 
            'Employee training added successfully';
          this.$message.success(message);
          this.fetchEmployeeTrainings();
          this.$refs.employeeTrainingModal.close();
        })
        .catch((error) => {
          console.error('Error submitting employee training:', error);
          const message = data.id ? 
            'Failed to update employee training' : 
            'Failed to add employee training';
          this.$message.error(message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteEmployeeTraining(id) {
      AntModal.confirm({
        title: 'Are you sure?',
        content: 'You are about to delete this employee training. This action cannot be undone.',
        centered: true,
        okText: 'Yes, delete',
        cancelText: 'Cancel',
        onOk: async () => {
          this.loading = true;
          try {
            await this.trainingStore.deleteEmployeeTraining(id);
            this.$message.success('Employee training deleted successfully');
            this.fetchEmployeeTrainings();
          } catch (error) {
            console.error('Error deleting employee training:', error);
            this.$message.error('Failed to delete employee training');
          } finally {
            this.loading = false;
          }
        }
      });
    },
    showNotification( message, type = 'success') {
      this.$message[type]({
        content: message,
        duration: 3,
      });
    },
    toggleHeader() {
      const header = document.getElementById('collapse-header');
      if (header) {
        header.classList.toggle('active');
      }
    }
  }
};
</script>
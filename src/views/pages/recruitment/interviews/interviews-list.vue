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

          <div class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddInterviewModal">
              <i class="ti ti-circle-plus me-2"></i>Add Interview
            </button>
          </div>

          <div class="ms-2 head-icons">
            <a href="javascript:void(0);" :class="{ active: isCollapsed }" @click="toggleCollapse"
              data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Interviews List</h5>
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
            <p class="mt-2">Loading interviews...</p>
          </div>
          <div v-else>
            <a-table :columns="columns" :data-source="tableData" :pagination="pagination" :scroll="{ x: 'max-content' }"
              row-key="id" @change="handleTableChange">



              <template #bodyCell="{ column, record }">

                <template v-if="column.dataIndex === 'interview_status'">
                  <span
                    :class="`badge ${record.interview_status === 'Scheduled' ? 'bg-primary' : record.interview_status === 'Completed' ? 'bg-success' : 'bg-danger'}`">
                    {{ record.interview_status }}
                  </span>
                </template>

                <template v-if="column.dataIndex === 'hired_status'">
                  <span
                    :class="`badge ${record.hired_status === 'Hired' ? 'bg-success' : record.hired_status === 'Rejected' ? 'bg-danger' : 'bg-warning'}`">
                    {{ record.hired_status }}
                  </span>
                </template>



                <template v-if="column.dataIndex === 'actions'">
                  <div class="action-icon d-inline-flex">
                    <router-link :to="`/recruitment/interviews-details/${record.id}`" class="me-2">
                      <i class="ti ti-eye"></i>
                    </router-link>
                    <a href="javascript:void(0);" class="me-2" @click="openEditInterviewModal(record)">
                      <i class="ti ti-edit"></i>
                    </a>
                    <a href="javascript:void(0);" @click="deleteInterview(record.id)">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>

  <!-- Interview Modal -->
  <interview-modal ref="interviewModal" @interview-added="fetchInterviews" @interview-updated="fetchInterviews" />

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
</template>

<script>
import { Toast } from 'bootstrap';
import { Modal as AntModal } from 'ant-design-vue';
import InterviewModal from '@/components/modal/interview-modal.vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useInterviewStore } from '@/stores/interviewStore';
import { ref, computed } from 'vue';
import moment from 'moment';

export default {
  name: 'InterviewsList',
  components: {
    InterviewModal,
    indexBreadcrumb
  },
  setup() {
    const filteredInfo = ref({});
    const sortedInfo = ref({});
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const interviewStore = useInterviewStore();

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
      interviewStore
    };
  },
  data() {
    return {
      title: 'Interviews',
      text: 'Recruitment',
      text1: 'Interviews',
      interviews: [],
      loading: false,
      searchTerm: '',
      notificationTitle: '',
      notificationMessage: '',
      notificationClass: ''
    };
  },
  computed: {
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: 'Candidate Name',
          dataIndex: 'candidate_name',
          key: 'candidate_name',
          filters: this.getUniqueValues('candidate_name'),
          filteredValue: filtered.candidate_name || null,
          onFilter: (value, record) => record.candidate_name.includes(value),
          sorter: (a, b) => a.candidate_name.localeCompare(b.candidate_name),
          sortOrder: sorted.columnKey === 'candidate_name' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          key: 'phone',
          sorter: (a, b) => a.phone.localeCompare(b.phone),
          sortOrder: sorted.columnKey === 'phone' && sorted.order,
        },
        {
          title: 'Job Position',
          dataIndex: 'job_position',
          key: 'job_position',
          filters: this.getUniqueValues('job_position'),
          filteredValue: filtered.job_position || null,
          onFilter: (value, record) => record.job_position.includes(value),
          sorter: (a, b) => a.job_position.localeCompare(b.job_position),
          sortOrder: sorted.columnKey === 'job_position' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Interviewer',
          dataIndex: 'interviewer_name',
          key: 'interviewer_name',
          filters: this.getUniqueValues('interviewer_name'),
          filteredValue: filtered.interviewer_name || null,
          onFilter: (value, record) => record.interviewer_name.includes(value),
          sorter: (a, b) => a.interviewer_name.localeCompare(b.interviewer_name),
          sortOrder: sorted.columnKey === 'interviewer_name' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Date',
          dataIndex: 'interview_date',
          key: 'interview_date',
          sorter: (a, b) => moment(a.interview_date).unix() - moment(b.interview_date).unix(),
          sortOrder: sorted.columnKey === 'interview_date' && sorted.order,
        },
        // {
        //   title: 'Time',
        //   dataIndex: 'start_time',
        //   key: 'start_time',
        //   render: (text, record) => {
        //     const startTime = record.start_time ? this.formatTime(record.start_time) : '';
        //     const endTime = record.end_time ? this.formatTime(record.end_time) : '';
        //     return startTime && endTime ? `${startTime} - ${endTime}` : startTime || endTime || '';
        //   },
        //   sorter: (a, b) => {
        //     const aTime = a.start_time || '';
        //     const bTime = b.start_time || '';
        //     return aTime.localeCompare(bTime);
        //   },
        //   sortOrder: sorted.columnKey === 'start_time' && sorted.order,
        // },
        // {
        //   title: 'Mode',
        //   dataIndex: 'interview_mode',
        //   key: 'interview_mode',
        //   filters: [
        //     { text: 'In-person', value: 'In-person' },
        //     { text: 'Virtual', value: 'Virtual' },
        //     { text: 'Phone', value: 'Phone' },
        //   ],
        //   filteredValue: filtered.interview_mode || null,
        //   onFilter: (value, record) => record.interview_mode === value,
        //   sorter: (a, b) => a.interview_mode.localeCompare(b.interview_mode),
        //   sortOrder: sorted.columnKey === 'interview_mode' && sorted.order,
        // },
        {
          title: 'Status',
          dataIndex: 'interview_status',
          key: 'interview_status',
          filters: [
            { text: 'Scheduled', value: 'Scheduled' },
            { text: 'Completed', value: 'Completed' },
            { text: 'Cancelled', value: 'Cancelled' },
            { text: 'In Progress', value: 'In Progress' },
          ],
          filteredValue: filtered.interview_status || null,
          onFilter: (value, record) => record.interview_status === value,
          sorter: (a, b) => a.interview_status.localeCompare(b.interview_status),
          sortOrder: sorted.columnKey === 'interview_status' && sorted.order,
        },
        {
          title: 'Hired Status',
          dataIndex: 'hired_status',
          key: 'hired_status',
          filters: this.getUniqueValues('hired_status'),
          filteredValue: filtered.hired_status || null,
          onFilter: (value, record) => record.hired_status === value,
          sorter: (a, b) => {
            if (!a.hired_status && !b.hired_status) return 0;
            if (!a.hired_status) return 1;
            if (!b.hired_status) return -1;
            return a.hired_status.localeCompare(b.hired_status);
          },
          sortOrder: sorted.columnKey === 'hired_status' && sorted.order,
        },
        // {
        //   title: 'Score',
        //   dataIndex: 'score',
        //   key: 'score',
        //   sorter: (a, b) => a.score - b.score,
        //   sortOrder: sorted.columnKey === 'score' && sorted.order,
        // },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
        },
      ];
    },
    tableData() {
      return this.interviews.map(interview => ({
        ...interview,
        key: interview.id
      }));
    }
  },
  mounted() {
    this.fetchInterviews();
  },
  methods: {
    formatTime(timeString) {
      if (!timeString) return '';

      // Handle time strings with milliseconds
      const timeParts = timeString.split('.');
      const baseTime = timeParts[0];

      // Convert to 12-hour format
      const [hours, minutes] = baseTime.split(':');
      if (!hours || !minutes) return timeString;

      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;

      return `${hour12}:${minutes} ${ampm}`;
    },

    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        document.body.classList.add("header-collapse");
      } else {
        document.body.classList.remove("header-collapse");
      }
    },
    getUniqueValues(field) {
      const values = [...new Set(this.interviews.map(item => item[field]))].filter(Boolean);
      return values.map(value => ({ text: value, value }));
    },

    handleTableChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter);
      this.currentPage = pagination.current;
      this.pageSize = pagination.pageSize;
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

    async fetchInterviews() {
      this.loading = true;

      try {
        await this.interviewStore.fetchInterviews();

        if (this.interviewStore.interviews) {
          this.interviews = this.interviewStore.interviews.map(interview => ({
            ...interview,
            interview_date: interview.interview_date ? moment(interview.interview_date).format('DD MMM YYYY') : '',

          }));
          this.total = this.interviews.length;
          this.$message.success('Interviews loaded successfully');
        }
      } catch (error) {
        console.error('Error fetching interviews:', error);
        this.$message.error('Failed to load interviews');
      } finally {
        this.loading = false;
      }
    },

    openAddInterviewModal() {
      if (this.$refs.interviewModal) {
        this.$refs.interviewModal.editMode = false;
        this.$refs.interviewModal.interviewData = null;
        this.$refs.interviewModal.openModal();
      }
    },

    openEditInterviewModal(interview) {
      this.$refs.interviewModal.interviewData = interview;
      this.$refs.interviewModal.editMode = true;
      this.$refs.interviewModal.openModal();
    },

    async deleteInterview(id) {
      try {
        await new Promise((resolve) => {
          AntModal.confirm({
            title: 'Are you sure?',
            content: 'You are about to delete this interview. This action cannot be undone.',
            centered: true,
            okText: 'Yes, delete',
            cancelText: 'Cancel',
            onOk: async () => {
              this.loading = true;
              try {
                await this.interviewStore.deleteInterview(id);
                this.interviews = this.interviews.filter(interview => interview.id !== id);
                this.total = this.interviews.length;
                this.$message.success('Interview deleted successfully');
                resolve();
              } catch (error) {
                console.error('Error deleting interview:', error);
                this.$message.error('Failed to delete interview');
                resolve();
              } finally {
                this.loading = false;
              }
            },
            onCancel: () => {
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Delete confirmation failed:', error);
      }
    },

    showNotification(title, message, className) {
      this.notificationTitle = title;
      this.notificationMessage = message;
      this.notificationClass = className;

      const toastEl = document.getElementById('notificationToast');
      const toast = new Toast(toastEl);
      toast.show();
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
</style>

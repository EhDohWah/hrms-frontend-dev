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
            v-if="isReadOnly" 
            class="badge bg-warning text-dark ms-3 d-flex align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <!-- Add Interview Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddInterviewModal">
              <i class="ti ti-circle-plus me-2"></i>Add Interview
            </button>
          </div>
          <div class="ms-2 head-icons">
            <a href="javascript:void(0);" :class="{ active: isCollapsed }" @click="toggleCollapse"
              id="collapse-header">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Interviews List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search v-model:value="searchCandidate" placeholder="Enter full candidate name..."
                :loading="searchLoading" enter-button="Search" @search="handleCandidateSearch" style="width: 250px;"
                class="search-input-primary" />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading interviews...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <!-- TABLE WITHOUT PAGINATION -->
            <a-table :columns="columns" :data-source="tableData" :pagination="false" :scroll="{ x: 'max-content' }"
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
                    <!-- View Interview - Always visible -->
                    <router-link 
                      :to="`/recruitment/interviews-details/${record.id}`" 
                      class="me-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="View Details"
                    >
                      <i class="ti ti-eye"></i>
                    </router-link>
                    <!-- Edit Interview - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      class="me-2" 
                      @click="openEditInterviewModal(record)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Edit Interview"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <!-- Delete Interview - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      @click="deleteInterview(record.id)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Delete Interview"
                    >
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
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

  <!-- Interview Modal -->
  <interview-modal ref="interviewModal" @interview-added="refreshInterviews" @interview-updated="refreshInterviews" />

  <!-- Notification Toast - z-index 2000 to appear above modals -->
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 2000">
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
import { interviewService } from '@/services/interview.service';
import moment from 'moment';
import { usePermissions } from '@/composables/usePermissions';
import { ref, computed } from 'vue';

export default {
  name: 'InterviewsList',
  components: {
    InterviewModal,
    indexBreadcrumb
  },
  data() {
    return {
      title: 'Interviews',
      text: 'Recruitment',
      text1: 'Interviews',
      interviews: [],
      loading: false,
      searchLoading: false,
      searchCandidate: '',
      notificationTitle: '',
      notificationMessage: '',
      notificationClass: '',
      isCollapsed: false,

      // Field mapping for server-side sorting
      fieldMapping: {
        candidate_name: 'candidate_name',
        job_position: 'job_position',
        interview_date: 'interview_date'
      }
    };
  },
  computed: {
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: '#ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
        },
        {
          title: 'Candidate Name',
          dataIndex: 'candidate_name',
          key: 'candidate_name',
          width: 180,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'candidate_name' && sorted.order,
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          key: 'phone',
          width: 120,
        },
        {
          title: 'Job Position',
          dataIndex: 'job_position',
          key: 'job_position',
          width: 180,
          filters: this.getJobPositionFilters(),
          filteredValue: filtered.job_position || null,
          // Remove onFilter for server-side filtering
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'job_position' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Interviewer',
          dataIndex: 'interviewer_name',
          key: 'interviewer_name',
          width: 150,
        },
        {
          title: 'Date',
          dataIndex: 'interview_date',
          key: 'interview_date',
          width: 120,
          sorter: true, // Enable server-side sorting
          sortOrder: sorted.columnKey === 'interview_date' && sorted.order,
        },
        {
          title: 'Status',
          dataIndex: 'interview_status',
          key: 'interview_status',
          width: 120,
          filters: [
            { text: 'Scheduled', value: 'Scheduled' },
            { text: 'Completed', value: 'Completed' },
            { text: 'Cancelled', value: 'Cancelled' },
            { text: 'In Progress', value: 'In Progress' },
          ],
          filteredValue: filtered.interview_status || null,
          // Remove onFilter for server-side filtering
        },
        {
          title: 'Hired Status',
          dataIndex: 'hired_status',
          key: 'hired_status',
          width: 120,
          filters: this.getHiredStatusFilters(),
          filteredValue: filtered.hired_status || null,
          // Remove onFilter for server-side filtering
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          fixed: 'right',
          width: 120,
        },
      ];
    },
    tableData() {
      // With server-side pagination, just return the interviews as-is
      return this.interviews.map(interview => ({
        ...interview,
        key: interview.id
      }));
    }
  },
  setup() {
    // Server-side pagination, filtering, and sorting state
    const filteredInfo = ref({});
    const sortedInfo = ref({});
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    
    // Initialize interview store
    const interviewStore = useInterviewStore();
    
    // Initialize permission checks for interviews module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('interviews');

    return {
      filteredInfo,
      sortedInfo,
      currentPage,
      pageSize,
      total,
      interviewStore,
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    };
  },
  mounted() {
    this.fetchInterviews();
  },
  methods: {
    // Helper method to build complete API parameters
    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage || 1,
        per_page: this.pageSize || 10,
        ...baseParams
      };

      // Add sorting parameters
      const sorted = this.sortedInfo || {};
      if (sorted.field) {
        const sortField = this.mapSortField(sorted.field);
        params.sort_by = sortField;
        params.sort_order = sorted.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add filter parameters
      const filtered = this.filteredInfo || {};
      if (Object.keys(filtered).length > 0) {
        if (filtered.job_position && filtered.job_position.length > 0) {
          params.filter_job_position = filtered.job_position.join(',');
        }
        if (filtered.hired_status && filtered.hired_status.length > 0) {
          params.filter_hired_status = filtered.hired_status.join(',');
        }
      }

      return params;
    },

    // Map frontend table field names to backend field names
    mapSortField(field) {
      return this.fieldMapping[field] || field;
    },

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

      this.fetchInterviews(params);
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

      this.fetchInterviews(params);
    },

    // TABLE CHANGE HANDLER (for sorting/filtering only)
    handleTableChange(pagination, filters, sorter) {
      console.log('Table change (sorting/filtering):', filters, sorter);

      // Check if there's actually a meaningful change
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};
      const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(filtered);
      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(sorted);

      // Only proceed if there's an actual filter or sort change
      if (!hasFilterChange && !hasSorterChange) {
        console.log('No meaningful change detected, skipping reload');
        return;
      }

      // Update filter and sort state
      this.filteredInfo = filters;
      this.sortedInfo = sorter;

      // Reset to first page when filter/sort changes
      this.currentPage = 1;

      // Build complete parameters
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      // Fetch interviews with new parameters
      this.fetchInterviews(params);
    },

    // Clear filters
    clearFilters() {
      this.filteredInfo = {};
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchInterviews(params);
    },

    // Clear all filters and sorters
    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchCandidate = '';
      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchInterviews(params);
    },

    // Search by candidate name
    async handleCandidateSearch() {
      // Validation: Check if search input is empty
      if (!this.searchCandidate || this.searchCandidate.trim() === '') {
        this.$message.warning('Please enter a candidate name to search');
        return;
      }

      this.searchLoading = true;
      try {
        const response = await interviewService.getByCandidateName(this.searchCandidate.trim());

        // Handle successful response - getByCandidateName has special 404 handling
        if (response.success === true && response.data) {
          const interviewData = response.data;

          // Format the interview data similar to fetchInterviews method
          const formattedInterview = {
            ...interviewData,
            interview_date: interviewData.interview_date ? moment(interviewData.interview_date).format('DD MMM YYYY') : '',
          };

          // Update the interviews array with just this interview
          this.interviews = [formattedInterview];
          this.total = 1;
          this.currentPage = 1;
          this.$message.success(response.message || 'Interview found successfully');
        } else if (response.success === false) {
          // Handle 404 response from getByCandidateName (not thrown as error)
          this.interviews = [];
          this.total = 0;
          this.$message.info(response.message || 'No interview found for this candidate');
        } else {
          // Fallback for unexpected response format
          this.$message.warning('No interview found for this candidate');
          this.interviews = [];
          this.total = 0;
        }

        return response;
      } catch (error) {
        // Handle BaseService structured errors (thrown as exceptions)
        console.error('Error during candidate search:', error);
        this.interviews = [];
        this.total = 0;

        // Handle BaseService error structure
        if (error.status) {
          switch (error.status) {
            case 401:
              this.$message.error(error.message || 'Authentication required. Please log in again.');
              break;
            case 403:
              this.$message.error(error.message || 'You don\'t have permission to search interviews.');
              break;
            case 500:
              this.$message.error(error.message || 'Server error occurred. Please try again later.');
              break;
            case 422:
              this.$message.warning(error.message || 'Invalid search parameters.');
              break;
            default:
              this.$message.error(error.message || 'Failed to search for interview');
          }
        } else {
          // Handle network or other unexpected errors
          this.$message.error(error.message || 'Network connection error. Please check your connection and try again.');
        }
      } finally {
        this.searchLoading = false;
      }
    },



    // Fetch interviews with server-side pagination, filtering, and sorting
    async fetchInterviews(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize || 10,
          ...params
        };

        const response = await this.interviewStore.fetchInterviews(queryParams);

        if (response.success && response.data) {
          const interviewsData = response.data;

          this.interviews = interviewsData.map(interview => ({
            ...interview,
            interview_date: interview.interview_date ? moment(interview.interview_date).format('DD MMM YYYY') : '',
          }));

          // Update pagination properties from server response
          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
            this.pageSize = response.pagination.per_page;
          } else {
            this.total = response.data.length;
            this.currentPage = 1;
          }

          // Only show success message on initial load, not on pagination/filter changes
          if (params.page === 1 || !params.page) {
            this.$message.success('Interviews loaded successfully');
          }
        } else {
          this.interviews = [];
          this.total = 0;
          this.$message.error('No interviews data received');
        }
      } catch (error) {
        console.error('Error fetching interviews:', error);
        this.interviews = [];
        this.total = 0;

        // Handle BaseService structured errors
        if (error.status) {
          switch (error.status) {
            case 401:
              this.$message.error(error.message || 'Authentication required. Please log in again.');
              break;
            case 403:
              this.$message.error(error.message || 'You don\'t have permission to view interviews.');
              break;
            case 500:
              this.$message.error(error.message || 'Server error occurred. Please try again later.');
              break;
            case 422:
              this.$message.warning(error.message || 'Invalid request parameters.');
              break;
            default:
              this.$message.error(error.message || 'Failed to load interviews');
          }
        } else {
          // Handle network or other unexpected errors
          this.$message.error(error.message || 'Network connection error. Please check your connection and try again.');
        }
      } finally {
        this.loading = false;
      }
    },

    // Refresh interviews after modal operations
    refreshInterviews() {
      // Refresh with current pagination/filters
      const params = this.buildApiParams();
      this.fetchInterviews(params);
    },

    // Get unique job position filters from current data
    getJobPositionFilters() {
      if (!this.interviews || !this.interviews.length) return [];
      const uniqueValues = [...new Set(this.interviews.map(item => item.job_position))].filter(Boolean);
      return uniqueValues.map(value => ({ text: value, value }));
    },

    // Get unique hired status filters from current data
    getHiredStatusFilters() {
      if (!this.interviews || !this.interviews.length) return [];
      const uniqueValues = [...new Set(this.interviews.map(item => item.hired_status))].filter(Boolean);
      return uniqueValues.map(value => ({ text: value, value }));
    },

    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        document.body.classList.add("header-collapse");
      } else {
        document.body.classList.remove("header-collapse");
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
            title: 'Move to Recycle Bin?',
            content: 'You are about to move this interview to the recycle bin. You can restore it later from the recycle bin.',
            centered: true,
            okText: 'Yes, move to recycle bin',
            cancelText: 'Cancel',
            onOk: async () => {
              this.loading = true;
              try {
                const response = await this.interviewStore.deleteInterview(id);

                // Success case - BaseService returns successful responses normally
                if (response && response.success !== false) {
                  this.$message.success('Interview moved to recycle bin successfully');
                  // Refresh the list
                  this.refreshInterviews();
                } else if (response && response.success === false) {
                  // Handle any remaining error responses that aren't thrown
                  this.$message.error(response.message || 'Failed to move interview to recycle bin');
                }
                resolve();
              } catch (error) {
                // Handle BaseService structured errors (thrown as exceptions)
                console.error('Error during interview deletion:', error);

                // Handle BaseService error structure
                if (error.status) {
                  switch (error.status) {
                    case 404:
                      this.$message.warning(error.message || 'Interview not found. It may have already been deleted.');
                      break;
                    case 401:
                      this.$message.error(error.message || 'Authentication required. Please log in again.');
                      break;
                    case 403:
                      this.$message.error(error.message || 'You don\'t have permission to delete this interview.');
                      break;
                    case 500:
                      this.$message.error(error.message || 'Server error occurred while deleting. Please try again later.');
                      break;
                    case 422:
                      this.$message.warning(error.message || 'Invalid request. Please check the interview data.');
                      break;
                    default:
                      this.$message.error(error.message || 'Failed to move interview to recycle bin');
                  }
                } else {
                  // Handle network or other unexpected errors
                  this.$message.error(error.message || 'Network connection error. Please check your connection and try again.');
                }
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
        this.$message.error('Failed to show delete confirmation dialog');
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

/* Container overflow fixes */
.card-body {
  overflow: visible !important;
  padding-bottom: 0;
}

.card {
  overflow: visible !important;
  margin-bottom: 20px;
}
</style>
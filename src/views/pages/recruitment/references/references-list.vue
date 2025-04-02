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
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
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
          <div class="mb-2">
            <button @click="openAddReferenceModal" class="btn btn-primary d-flex align-items-center">
              <i class="ti ti-circle-plus me-2"></i>Add Reference
            </button>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>References List</h5>
          <div class="table-operations">
            <a-button @click="clearFilters" >Clear filters</a-button>
            <a-button @click="clearAll">Clear filters and sorters</a-button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <a-table 
              class="table datatable thead-light" 
              :columns="columns" 
              :data-source="references" 
              :pagination="pagination"
              :scroll="{ x: 'max-content' }"
              row-key="id"
              @change="handleTableChange"
              :loading="loading"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <span :class="['badge', getStatusClass(record.status), 'align-items-center', 'badge-xs']">
                    <i class="ti ti-point-filled me-1"></i>
                    {{ record.status }}
                  </span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <!-- <a href="javascript:void(0);" class="me-2" @click="viewReferenceDetails(record.id)">
                      <i class="ti ti-eye"></i>
                    </a> -->
                    <a href="javascript:void(0);" class="me-2" @click="editReference(record)">
                      <i class="ti ti-edit"></i>
                    </a>
                    <a href="javascript:void(0);" @click="deleteReference(record.id)">
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

  <!-- Reference Modal -->
  <references-modal 
    ref="referencesModal"
    @reference-added="handleReferenceAdded"
    @reference-updated="handleReferenceUpdated"
  />
</template>



<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import ReferencesModal from '@/components/modal/references-modal.vue';
import { onMounted, ref, computed } from 'vue';
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import { useReferenceStore } from '@/stores/referenceStore';
import { message } from 'ant-design-vue';

export default {
  name: 'ReferencesList',
  components: {
    indexBreadcrumb,
    ReferencesModal
  },
  setup() {
    const dateRangeInput = ref(null);
    const referencesModal = ref(null);
    const referenceStore = useReferenceStore();
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

    function booking_range(start, end) {
      return start.format('M/D/YYYY') + ' - ' + end.format('M/D/YYYY');
    }

    onMounted(() => {
      if (dateRangeInput.value) {
        const start = moment().subtract(6, 'days');
        const end = moment();

        new DateRangePicker(dateRangeInput.value, {
          startDate: start,
          endDate: end,
          ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [
              moment().subtract(1, 'month').startOf('month'),
              moment().subtract(1, 'month').endOf('month')
            ]
          }
        }, booking_range);

        booking_range(start, end);
      }
    });

    return {
      dateRangeInput,
      referencesModal,
      referenceStore,
      filteredInfo,
      sortedInfo,
      currentPage,
      pageSize,
      total,
      pagination
    };
  },
  data() {
    return {
      title: 'References',
      text: 'Recruitment',
      text1: 'References List',
      references: [],
      loading: false
    };
  },
  computed: {
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};
      
      return [
        {
          title: 'Referee Name',
          dataIndex: 'referee_name',
          key: 'referee_name',
          filters: this.getUniqueValues('referee_name'),
          filteredValue: filtered.referee_name || null,
          onFilter: (value, record) => record.referee_name.includes(value),
          sorter: (a, b) => a.referee_name.localeCompare(b.referee_name),
          sortOrder: sorted.columnKey === 'referee_name' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Occupation',
          dataIndex: 'occupation',
          key: 'occupation',
          sorter: (a, b) => a.occupation.localeCompare(b.occupation),
          sortOrder: sorted.columnKey === 'occupation' && sorted.order,
        },
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
          title: 'Relation',
          dataIndex: 'relation',
          key: 'relation',
          sorter: (a, b) => a.relation.localeCompare(b.relation),
          sortOrder: sorted.columnKey === 'relation' && sorted.order,
        },
        {
          title: 'Phone Number',
          dataIndex: 'phone_number',
          key: 'phone_number',
          sorter: (a, b) => (a.phone_number || '').localeCompare(b.phone_number || ''),
          sortOrder: sorted.columnKey === 'phone_number' && sorted.order,
        },
        {
          title: 'Actions',
          key: 'action',
          dataIndex: 'action',
        }
      ];
    },
    tableData() {
      return this.references.map(reference => ({
        ...reference,
        key: reference.id
      }));
    }
  },
  methods: {
    getUniqueValues(field) {
      const values = [...new Set(this.references.map(item => item[field]))].filter(Boolean);
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
    
    getStatusClass(status) {
      const statusClasses = {
        'Completed': 'bg-success-light',
        'Pending': 'bg-warning-light',
        'Declined': 'bg-danger-light'
      };
      return statusClasses[status] || 'bg-secondary-light';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    viewReferenceDetails(referenceId) {
      this.$router.push(`/recruitment/references/details/${referenceId}`);
    },
    openAddReferenceModal() {
      if (this.$refs.referencesModal) {
        this.$refs.referencesModal.editMode = false;
        this.$refs.referencesModal.referenceData = null;
        this.$refs.referencesModal.openModal();
      }
    },
    editReference(reference) {
      if (this.$refs.referencesModal) {
        this.$refs.referencesModal.editMode = true;
        this.$refs.referencesModal.referenceData = reference;
        this.$refs.referencesModal.openModal();
      }
    },
    async deleteReference(id) {
      if (confirm('Are you sure you want to delete this reference?')) {
        try {
          this.loading = true;
          const response = await this.referenceStore.deleteReference(id);
          if (response.success) {
            message.success('Reference deleted successfully');
            await this.fetchReferences();
          } else {
            message.error(response.message || 'Failed to delete reference');
          }
        } catch (error) {
          console.error('Error deleting reference:', error);
          message.error(error.message || 'Failed to delete reference');
        } finally {
          this.loading = false;
        }
      }
    },
    async fetchReferences() {
      try {
        this.loading = true;
        this.references = await this.referenceStore.fetchReferences();
        this.total = this.references.length;
      } catch (error) {
        console.error('Error fetching references:', error);
        message.error('Failed to fetch references');
      } finally {
        this.loading = false;
      }
    },
    handleReferenceAdded() {
      this.fetchReferences();
    },
    handleReferenceUpdated() {
      this.fetchReferences();
    }
  },
  mounted() {
    this.fetchReferences();
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

.table-operations > button {
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
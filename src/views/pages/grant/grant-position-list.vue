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
              <button class="btn btn-primary d-flex align-items-center" @click="openAddGrantPositionModal">
                <i class="ti ti-circle-plus me-2"></i>Add Grant Position
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
            <h5>Grant Positions List</h5>
            <!-- Table Operations -->
            <div class="table-operations">
              <a-button @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <!-- /Table Operations -->
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading grants...</p>
            </div>
            <div v-else>
              <a-table :columns="columns" :data-source="tableData" :pagination="pagination"
                :scroll="{ x: 'max-content' }" row-key="id" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'actions'">
                    <div class="action-icon d-inline-flex">
                      <router-link :to="`/grant/position-details/${record.id}`" class="me-2">
                        <i class="ti ti-eye"></i>
                      </router-link>
                      <a href="javascript:void(0);" class="me-2" @click="openEditGrantPositionModal(record)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a href="javascript:void(0);" @click="deleteGrantPosition(record.id)">
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

    <!-- Grant Position Modal -->
    <grant-position-modal ref="grantPositionModal" @submit="handleGrantPositionSubmit" />

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
import GrantPositionModal from '@/components/modal/grant-position-modal.vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useGrantStore } from '@/stores/grantStore';
import { ref, computed } from 'vue';
import { onMounted } from 'vue';
import moment from 'moment';
import DateRangePicker from 'daterangepicker';

export default {
  name: 'GrantPositionList',
  components: {
    GrantPositionModal,
    indexBreadcrumb
  },
  setup() {
    const dateRangeInput = ref(null);
    const filteredInfo = ref({});
    const sortedInfo = ref({});
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const grantStore = useGrantStore();

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
        }, (start, end) => {
          return start.format('M/D/YYYY') + ' - ' + end.format('M/D/YYYY');
        });
      }
    });

    const pagination = computed(() => ({
      total: total.value,
      current: currentPage.value,
      pageSize: pageSize.value,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      showTotal: (total) => `Total ${total} items`
    }));

    return {
      dateRangeInput,
      filteredInfo,
      sortedInfo,
      currentPage,
      pageSize,
      total,
      pagination,
      grantStore
    };
  },
  data() {
    return {
      title: 'Grant Positions',
      text: 'Grants',
      text1: 'Grant Positions',
      grantPositions: [],
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
          title: 'Grant Code',
          dataIndex: 'code',
          key: 'code',
          filters: this.getUniqueValues('code'),
          filteredValue: filtered.code || null,
          onFilter: (value, record) => record.code.includes(value),
          sorter: (a, b) => a.code.localeCompare(b.code),
          sortOrder: sorted.columnKey === 'code' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Grant Name',
          dataIndex: 'grantName',
          key: 'grantName',
          sorter: (a, b) => a.grantName.localeCompare(b.grantName),
          sortOrder: sorted.columnKey === 'grantName' && sorted.order,
        },
        {
          title: 'Budget Line',
          dataIndex: 'budgetLine',
          key: 'budgetLine',
          filters: this.getUniqueValues('budgetLine'),
          filteredValue: filtered.budgetLine || null,
          onFilter: (value, record) => record.budgetLine.includes(value),
          sorter: (a, b) => a.budgetLine.localeCompare(b.budgetLine),
          sortOrder: sorted.columnKey === 'budgetLine' && sorted.order,
          filterSearch: true,
        },
        {
          title: 'Grant Position',
          dataIndex: 'positionName',
          key: 'positionName',
          sorter: (a, b) => a.positionName.localeCompare(b.positionName),
          sortOrder: sorted.columnKey === 'positionName' && sorted.order,
        },
        {
          title: 'ManPower',
          dataIndex: 'manPower',
          key: 'manPower',
          sorter: (a, b) => a.manPower - b.manPower,
          sortOrder: sorted.columnKey === 'manPower' && sorted.order,
        },
        {
          title: 'Recruited',
          dataIndex: 'recruited',
          key: 'recruited',
          sorter: (a, b) => a.recruited - b.recruited,
          sortOrder: sorted.columnKey === 'recruited' && sorted.order,
        },
        {
          title: 'Finding',
          dataIndex: 'finding',
          key: 'finding',
          sorter: (a, b) => a.finding - b.finding,
          sortOrder: sorted.columnKey === 'finding' && sorted.order,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          filters: [
            { text: 'Active', value: 'Active' },
            { text: 'Pending', value: 'Pending' },
            { text: 'Completed', value: 'Completed' },
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
      return this.grantPositions.map(position => ({
        ...position,
        key: position.id
      }));
    }
  },
  mounted() {
    this.fetchGrantPositions();
  },
  methods: {


    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        document.body.classList.add("header-collapse");
      } else {
        document.body.classList.remove("header-collapse");
      }
    },
    getUniqueValues(field) {
      const values = [...new Set(this.grantPositions.map(item => item[field]))];
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

    async fetchGrantPositions() {
      this.loading = true;

      try {
        await this.grantStore.fetchGrantPositions();

        if (this.grantStore.grantPositions) {
          // Transform the API response to match our table structure
          const positions = [];
          let id = 1;

          this.grantStore.grantPositions.forEach(grant => {
            grant.positions.forEach(position => {
              positions.push({
                id: id++,
                code: grant.grant_code,
                grantName: grant.grant_name,
                budgetLine: position.budget_line,
                positionName: position.position,
                manPower: parseInt(position.manpower),
                recruited: position.recruited,
                finding: position.finding,
                status: 'Active', // Default status since it's not in the API response
                grant_id: grant.grant_id
              });
            });
          });

          this.grantPositions = positions;
          this.total = positions.length;
          this.$message.success('Grant positions loaded successfully');
        }
      } catch (error) {
        console.error('Error fetching grant positions:', error);
        this.$message.error('Failed to load grant positions');
      } finally {
        this.loading = false;
      }
    },

    openAddGrantPositionModal() {
      this.$refs.grantPositionModal.openModal();
    },

    openEditGrantPositionModal(position) {
      this.$refs.grantPositionModal.openModal(position);
    },

    async handleGrantPositionSubmit(formData) {
      this.loading = true;
      try {
        if (formData.id) {
          // Update existing grant position
          // await this.grantStore.updateGrantPosition(formData.id, formData);

          // For dummy data, update the local array
          const index = this.grantPositions.findIndex(pos => pos.id === formData.id);
          if (index !== -1) {
            this.grantPositions[index] = { ...formData };
          }
          this.$message.success('Grant position updated successfully');
        } else {
          // Add new grant position
          // await this.grantStore.createGrantPosition(formData);

          // For dummy data, add to the local array
          const newId = Math.max(...this.grantPositions.map(pos => pos.id)) + 1;
          this.grantPositions.push({
            ...formData,
            id: newId
          });
          this.$message.success('Grant position added successfully');
        }
        // Refresh the grant positions list
        await this.fetchGrantPositions();
      } catch (error) {
        console.error('Error handling grant position submission:', error);
        this.$message.error('Failed to save grant position');
      } finally {
        this.loading = false;
      }
    },

    async deleteGrantPosition(id) {
      try {
        await new Promise((resolve) => {
          AntModal.confirm({
            title: 'Are you sure?',
            content: 'You are about to delete this grant position. This action cannot be undone.',
            centered: true,
            okText: 'Yes, delete',
            cancelText: 'Cancel',
            onOk: async () => {
              this.loading = true;
              try {
                // await this.grantStore.deleteGrantPosition(id);

                // For dummy data, remove from the local array
                this.grantPositions = this.grantPositions.filter(pos => pos.id !== id);
                this.total = this.grantPositions.length;

                this.$message.success('Grant position deleted successfully');
                resolve();
              } catch (error) {
                console.error('Error deleting grant position:', error);
                this.$message.error('Failed to delete grant position');
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

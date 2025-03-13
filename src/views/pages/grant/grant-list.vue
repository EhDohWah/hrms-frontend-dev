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
          <div class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddGrantModal">
              <i class="ti ti-circle-plus me-2"></i>Add Grant
            </button>
          </div>
          <div class="mb-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openGrantUploadModal">
              <i class="ti ti-upload me-2"></i>Upload Grant Excel File
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
          <h5>Grants List</h5>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading grants...</p>
          </div>
          <div v-else>
            <a-table 
              :columns="columns" 
              :data-source="tableData" 
              :pagination="{ pageSize: pageSize }"
              :scroll="{ x: 'max-content' }"
              row-key="id"
            >
              <!-- Custom filter dropdown for code and name -->
              <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
                <div style="padding: 8px">
                  <a-input
                    :placeholder="`Search ${column.title}`"
                    :value="selectedKeys[0]"
                    style="width: 188px; margin-bottom: 8px; display: block"
                    @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                    @pressEnter="handleTableSearch(selectedKeys, confirm, column.dataIndex)"
                  />
                  <a-button
                    type="primary"
                    size="small"
                    style="width: 90px; margin-right: 8px"
                    @click="handleTableSearch(selectedKeys, confirm, column.dataIndex)"
                  >
                    <search-outlined />
                    Search
                  </a-button>
                  <a-button size="small" style="width: 90px" @click="handleTableReset(clearFilters)">
                    Reset
                  </a-button>
                </div>
              </template>
              
              <!-- Custom filter icon -->
              <template #customFilterIcon="{ filtered }">
                <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
              </template>
              
              <!-- Expandable row for grant items -->
              <template #expandedRowRender="{ record }">
                <div style="margin: 0 16px">
                  <p style="margin-bottom: 8px; font-weight: bold">Grant Items</p>
                  <a-table 
                    :columns="innerColumns" 
                    :data-source="record.items || []" 
                    :pagination="false"
                    row-key="id"
                    bordered
                    size="small"
                  >
                    <template #bodyCell="{ column, text }">
                      <template v-if="column.dataIndex === 'grant_salary' || column.dataIndex === 'grant_benefit' || column.dataIndex === 'grant_cost_by_monthly' || column.dataIndex === 'grant_total_cost_by_person' || column.dataIndex === 'grant_total_amount'">
                        {{ formatCurrency(text) }}
                      </template>
                      <template v-else-if="column.dataIndex === 'grant_level_of_effort'">
                        {{ text }}%
                      </template>
                    </template>
                  </a-table>
                </div>
              </template>
              
              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'actions'">
                  <div class="action-icon d-inline-flex">
                    <router-link :to="`/grant/details/${record.id}`" class="me-2">
                      <i class="ti ti-eye"></i>
                    </router-link>
                    <a href="javascript:void(0);" class="me-2" @click="openEditGrantModal(record)">
                      <i class="ti ti-edit"></i>
                    </a>
                    <a href="javascript:void(0);" @click="deleteGrant(record.id)">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>
                
                <!-- Highlight search text -->
                <template v-else-if="searchState.searchText && searchState.searchedColumn === column.dataIndex && record[column.dataIndex]">
                  <span>
                    <template
                      v-for="(fragment, i) in String(record[column.dataIndex])
                        .split(new RegExp(`(?<=${searchState.searchText})|(?=${searchState.searchText})`, 'i'))"
                    >
                      <mark
                        v-if="fragment.toLowerCase() === searchState.searchText.toLowerCase()"
                        :key="i"
                        class="highlight"
                      >
                        {{ fragment }}
                      </mark>
                      <template v-else>{{ fragment }}</template>
                    </template>
                  </span>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Grant Modal -->
  <grant-modal ref="grantModal" @submit="handleGrantSubmit" />
  <!-- Grant Upload Modal -->
  <grant-upload-modal ref="grantUploadModal" @refresh-grant-list="fetchGrants" />
  
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
import GrantModal from '@/components/modal/grant-modal.vue';
import GrantUploadModal from '@/components/modal/grant-upload-modal.vue';
import { Modal, Toast } from 'bootstrap';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useGrantStore } from '@/stores/grantStore';
import { ref, reactive, onMounted } from 'vue';
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import { SearchOutlined } from '@ant-design/icons-vue';

export default {
  name: 'GrantList',
  components: {
    GrantModal,
    GrantUploadModal,
    indexBreadcrumb,
    SearchOutlined
  },
  setup() {
    const dateRangeInput = ref(null);
    const searchState = reactive({
      searchText: '',
      searchedColumn: '',
    });

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

    return {
      dateRangeInput,
      searchState
    };
  },
  data() {
    return {
      title: 'Grants',
      text: 'Grants',
      text1: 'Grant List',
      grants: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalGrants: 0,
      searchTerm: '',
      grantStore: useGrantStore(),
      notificationTitle: '',
      notificationMessage: '',
      notificationClass: '',
      columns: [
        {
          title: 'Grant Code',
          dataIndex: 'code',
          key: 'code',
          resizable: true,
          width: 150,
          customFilterDropdown: true,
          onFilter: (value, record) => record.code.toString().toLowerCase().includes(value.toLowerCase()),
        },
        {
          title: 'Grant Name',
          dataIndex: 'name',
          key: 'name',
          resizable: true,
          width: 200,
          customFilterDropdown: true,
          onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
        },
        {
          title: 'End Date',
          dataIndex: 'endDate',
          key: 'endDate',
          resizable: true,
          width: 150
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          resizable: true,
          width: 250,
          ellipsis: true
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          width: 120,
          fixed: 'right'
        }
      ],
      innerColumns: [
        {
          title: 'BG Line',
          dataIndex: 'bg_line',
          key: 'bg_line',
          width: 120
        },
        {
          title: 'Position',
          dataIndex: 'grant_position',
          key: 'grant_position',
          width: 150
        },
        {
          title: 'Salary',
          dataIndex: 'grant_salary',
          key: 'grant_salary',
          width: 120
        },
        {
          title: 'Benefit',
          dataIndex: 'grant_benefit',
          key: 'grant_benefit',
          width: 120
        },
        {
          title: 'Effort',
          dataIndex: 'grant_level_of_effort',
          key: 'grant_level_of_effort',
          width: 100
        },
        {
          title: 'Position Number',
          dataIndex: 'grant_position_number',
          key: 'grant_position_number',
          width: 150
        },
        {
          title: 'Cost Monthly',
          dataIndex: 'grant_cost_by_monthly',
          key: 'grant_cost_by_monthly',
          width: 150
        },
        {
          title: 'Total Cost By Person',
          dataIndex: 'grant_total_cost_by_person',
          key: 'grant_total_cost_by_person',
          width: 180
        },
        {
          title: 'Total Amount',
          dataIndex: 'grant_total_amount',
          key: 'grant_total_amount',
          width: 150
        }
      ]
    };
  },
  computed: {
    tableData() {
      return this.grants.map(grant => ({
        ...grant,
        key: grant.id,
        description: grant.description || 'No description'
      }));
    }
  },
  mounted() {
    this.fetchGrants();
  },
  methods: {
    async fetchGrants() {
      this.loading = true;
      try {
        await this.grantStore.fetchGrants();
        const grantsData = this.grantStore.grants;
        
        this.grants = grantsData.map(grant => ({
          id: grant.id,
          code: grant.code,
          name: grant.name,
          amount: grant.amount || this.calculateTotalAmount(grant.grant_items),
          startDate: grant.startDate || new Date().toLocaleDateString(),
          endDate: grant.end_date || 
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
          status: grant.status || 'Pending',
          description: grant.description,
          items: (grant.grant_items || []).map(item => ({
            id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`,
            bg_line: item.bg_line,
            grant_position: item.grant_position,
            grant_salary: item.grant_salary,
            grant_benefit: item.grant_benefit,
            grant_level_of_effort: item.grant_level_of_effort,
            grant_position_number: item.grant_position_number,
            grant_cost_by_monthly: item.grant_cost_by_monthly,
            grant_total_cost_by_person: item.grant_total_cost_by_person,
            grant_total_amount: item.grant_total_amount,
            position_id: item.position_id
          }))
        }));

        this.totalGrants = this.grants.length;
        this.$message.success('Grants loaded successfully');  
      } catch (error) {
        console.error('Error fetching grants:', error);
        this.$message.error('Failed to load grants');
      } finally {
        this.loading = false;
      }
    },

    async handleSearch() {
      this.loading = true;
      
      try {
        if (!this.searchTerm.trim()) {
          // If search is empty, reset to default list
          await this.fetchGrants();
          return;
        }

        // Filter grants locally based on search term
        const searchTermLower = this.searchTerm.toLowerCase();
        const filteredGrants = this.grantStore.grants.filter(grant => 
          grant.code?.toLowerCase().includes(searchTermLower) || 
          grant.name?.toLowerCase().includes(searchTermLower) ||
          grant.description?.toLowerCase().includes(searchTermLower)
        );
        
        this.grants = filteredGrants.map(grant => ({
          id: grant.id,
          code: grant.code,
          name: grant.name,
          amount: grant.amount || this.calculateTotalAmount(grant.grant_items),
          startDate: grant.startDate || new Date().toLocaleDateString(),
          endDate: grant.end_date || 
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
          status: grant.status || 'Pending',
          description: grant.description,
          items: (grant.grant_items || []).map(item => ({
            id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`,
            bg_line: item.bg_line,
            grant_position: item.grant_position,
            grant_salary: item.grant_salary,
            grant_benefit: item.grant_benefit,
            grant_level_of_effort: item.grant_level_of_effort,
            grant_position_number: item.grant_position_number,
            grant_cost_by_monthly: item.grant_cost_by_monthly,
            grant_total_cost_by_person: item.grant_total_cost_by_person,
            grant_total_amount: item.grant_total_amount,
            position_id: item.position_id
          }))
        }));
        
        this.totalGrants = this.grants.length;
        this.showNotification('Search Results', `Found ${this.totalGrants} grants matching "${this.searchTerm}"`, 'bg-info text-white');
      } catch (error) {
        console.error("Error searching grants:", error);
        this.showNotification('Error', 'Failed to search grants', 'bg-danger text-white');
      } finally {
        this.loading = false;
      }
    },

    // Table specific search methods
    handleTableSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchState.searchText = selectedKeys[0];
      this.searchState.searchedColumn = dataIndex;
    },

    handleTableReset(clearFilters) {
      clearFilters({ confirm: true });
      this.searchState.searchText = '';
    },

    formatCurrency(value) {
      if (!value) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(value);
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    showNotification(title, message, className) {
      this.notificationTitle = title;
      this.notificationMessage = message;
      this.notificationClass = className;
      
      const toastEl = document.getElementById('notificationToast');
      const toast = new Toast(toastEl);
      toast.show();
    },

    calculateTotalAmount(items) {
      if (!items || !items.length) return '0';
      const total = items.reduce((sum, item) => sum + Number(item.grant_total_amount || 0), 0);
      return `${total.toFixed(2)}`;
    },

    openAddGrantModal() {
      this.$refs.grantModal.resetForm();
      new Modal(document.getElementById('grant_modal')).show();
    },

    openGrantUploadModal() {
      this.$refs.grantUploadModal.resetForm();
      new Modal(document.getElementById('grantUploadModal')).show();
    },

    openEditGrantModal(grant) {
      const grantData = {
        id: grant.id,
        code: grant.code,
        name: grant.name,
        budget_line: grant.budget_line || '',
        end_date: grant.endDate || ''
      };
      this.$refs.grantModal.setEditData(grantData);
      new Modal(document.getElementById('grant_modal')).show();
    },

    async handleGrantSubmit(formData) {
      this.loading = true;
      try {
        if (formData.id) {
          // Update existing grant
          await this.grantStore.updateGrant(formData.id, formData);
          this.showNotification('Success', 'Grant updated successfully', 'bg-success text-white');
        } else {
          // Add new grant
          await this.grantStore.createGrant(formData);
          this.showNotification('Success', 'Grant created successfully', 'bg-success text-white');
        }
        // Refresh the grants list
        await this.fetchGrants();
      } catch (error) {
        console.error('Error handling grant submission:', error);
        this.showNotification('Error', 'Failed to save grant', 'bg-danger text-white');
      } finally {
        this.loading = false;
      }
    },

    async deleteGrant(id) {
      if (confirm('Are you sure you want to delete this grant?')) {
        this.loading = true;
        try {
          await this.grantStore.deleteGrant(id);
          this.showNotification('Success', 'Grant deleted successfully', 'bg-success text-white');
          // Refresh the grants list
          await this.fetchGrants();
        } catch (error) {
          console.error('Error deleting grant:', error);
          this.showNotification('Error', 'Failed to delete grant', 'bg-danger text-white');
        } finally {
          this.loading = false;
        }
      }
    },

    async handleGrantUploadSubmit(formData) {
      this.loading = true;
      try {
        await this.grantStore.uploadGrantFile(formData);
        this.showNotification('Success', 'Grant file uploaded successfully', 'bg-success text-white');
        // Refresh the grants list
        await this.fetchGrants();
      } catch (error) {
        console.error('Error uploading grant file:', error);
        this.showNotification('Error', 'Failed to upload grant file', 'bg-danger text-white');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
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
          <!-- Add Lookup Button - Only visible if user can edit -->
          <div v-if="canEdit" class="mb-2">
            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_lookup"
              class="btn btn-primary d-flex align-items-center">
              <i class="ti ti-circle-plus me-2"></i>Add Lookup
            </a>
          </div>
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" class="" data-bs-toggle="tooltip" data-bs-placement="top"
              data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Lookups List -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Lookups List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <!-- Type Filter -->
            <div class="me-2">
              <a-select
                v-model:value="selectedFilterType"
                @change="handleTypeFilter"
                placeholder="Filter by Type"
                style="width: 200px;"
                allowClear
              >
                <a-select-option value="">All Types</a-select-option>
                <a-select-option v-for="type in availableFilterTypes" :key="type" :value="type">
                  {{ type }}
                </a-select-option>
              </a-select>
            </div>
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <div class="input-icon-end">
              <a-input-search
                v-model:value="searchValue"
                placeholder="Search by type or value..."
                enter-button="Search"
                @search="handleSearch"
                @change="onSearchChange"
                style="width: 250px;"
                class="search-input-primary"
              />
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

            <a-table v-else class="table datatable thead-light" :columns="columns" :data-source="data"
              :row-selection="canEdit ? rowSelection : null" 
              :pagination="paginationConfig"
              @change="handleChange">
                <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'id'">
                  <span>{{ record.id }}</span>
                  </template>
                <template v-if="column.key === 'type'">
                  <span class="badge badge-primary p-2 fs-10">{{ record.type }}</span>
                  </template>
                <template v-if="column.key === 'value'">
                  <span class="fw-medium">{{ record.value }}</span>
                  </template>
                  <template v-if="column.key === 'action'">
                    <div class="action-icon d-inline-flex">
                    <!-- View - Always visible -->
                    <a href="javascript:void(0);" class="me-2" title="View Lookup" @click="editLookup(record)">
                      <i class="ti ti-eye"></i>
                    </a>
                    <!-- Edit - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      class="me-2" 
                      title="Edit Lookup" 
                      @click="editLookup(record)"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <!-- Delete - Only visible if user can edit -->
                    <a 
                      v-if="canEdit" 
                      href="javascript:void(0);" 
                      title="Delete Lookup" 
                      @click="confirmDeleteLookup(record.id)"
                    >
                      <i class="ti ti-trash"></i>
                    </a>
                    </div>
                  </template>
                </template>
              </a-table>
          </div>
        </div>
      </div>
      <!-- /Lookups List -->
    </div>

    <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>Designed &amp; Developed By <a href="javascript:void(0);" class="text-primary">Dreams</a></p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <lookup-modal ref="lookupModal" @lookup-added="onLookupChanged" @lookup-updated="onLookupChanged"></lookup-modal>
</template>

<script>
import moment from "moment";
import { useLookupStore } from "@/stores/lookupStore";
import LookupModal from "@/components/modal/lookup-modal.vue";
import { usePermissions } from '@/composables/usePermissions';

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};

export default {
  components: {
    LookupModal
  },
  setup() {
    // Initialize permission checks for lookups module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('lookups');
    
    return {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    };
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
      selectedFilterType: '',
      availableFilterTypes: [],
      searchValue: '',
      searchTimeout: null,
    };
  },
  computed: {
    paginationConfig() {
      return {
        current: this.lookupStore.pagination.current_page,
        pageSize: this.lookupStore.pagination.per_page,
        total: this.lookupStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        pageSizeOptions: ['10', '20', '50', '100'],
      };
    },
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
          sorter: {
            compare: (a, b) => a.id - b.id,
          },
          sortOrder: sorted.columnKey === "id" && sorted.order,
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
          title: "Value",
          dataIndex: "value",
          key: "value",
          filters: this.getValueFilters(),
          filteredValue: filtered.value || null,
          filterSearch: true,
          onFilter: (value, record) => record.value.toLowerCase().includes(value.toLowerCase()),
          sorter: {
            compare: (a, b) => {
              a = a.value.toLowerCase();
              b = b.value.toLowerCase();
              return a > b ? -1 : b > a ? 1 : 0;
            },
          },
          sortOrder: sorted.columnKey === "value" && sorted.order,
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
    this.fetchLookups();
    this.fetchLookupTypes();
  },
  methods: {
    async fetchLookupTypes() {
      try {
        await this.lookupStore.fetchLookupTypes();
        this.availableFilterTypes = this.lookupStore.getAllLookupTypes;
      } catch (error) {
        console.error('Error loading lookup types:', error);
      }
    },

    async fetchLookups() {
      this.loading = true;
      try {
        // Set filters in store
        this.lookupStore.setSearchTerm(this.searchValue);
        this.lookupStore.setFilterType(this.selectedFilterType);

        await this.lookupStore.fetchAllLookups(true);

        this.data = this.lookupStore.lookups.map(lookup => ({
          key: lookup.id.toString(),
          id: lookup.id,
          type: lookup.type || '',
          value: lookup.value || '',
          created_at: lookup.created_at ? moment(lookup.created_at).format('DD/MM/YYYY') : '',
          updated_at: lookup.updated_at ? moment(lookup.updated_at).format('DD/MM/YYYY') : '',
          created_by: lookup.created_by || '',
          updated_by: lookup.updated_by || ''
        }));

        this.$message.success('Lookups loaded successfully');
      } catch (error) {
        console.error('Error loading lookups:', error);
        this.$message.error('Failed to load lookups');
      } finally {
        this.loading = false;
      }
    },

    editLookup(record) {
      this.$refs.lookupModal.setEditLookup(record);
    },

    confirmDeleteLookup(lookupId) {
      this.$refs.lookupModal.confirmDeleteLookup(lookupId);
    },

    async onLookupChanged() {
      await this.fetchLookups();
      await this.fetchLookupTypes();
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    handleChange(pagination, filters, sorter) {
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      
      // Handle pagination changes
      if (pagination.current !== this.lookupStore.pagination.current_page || 
          pagination.pageSize !== this.lookupStore.pagination.per_page) {
        this.lookupStore.pagination.current_page = pagination.current;
        if (pagination.pageSize !== this.lookupStore.pagination.per_page) {
          this.lookupStore.pagination.per_page = pagination.pageSize;
        }
        this.fetchLookups();
      }
    },

    clearFilters() {
      this.filteredInfo = null;
      this.selectedFilterType = '';
      this.lookupStore.setFilterType('');
    },

    clearAll() {
      this.filteredInfo = null;
      this.sortedInfo = null;
      this.searchValue = '';
      this.selectedFilterType = '';
      this.lookupStore.setSearchTerm('');
      this.lookupStore.setFilterType('');
      this.fetchLookups();
    },

    handleSearch(value) {
      this.lookupStore.setSearchTerm(value);
      this.fetchLookups();
    },

    onSearchChange(e) {
      const value = e.target.value;
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.lookupStore.setSearchTerm(value);
        this.fetchLookups();
      }, 500);
    },

    async handleTypeFilter() {
      await this.fetchLookups();
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
      const values = [...new Set(this.data.map(item => item.value))];
      return values.slice(0, 50).map(value => ({ text: value, value: value })); // Limit to 50 for performance
    },
  },
};
</script>

<style scoped>
/* Pagination dropdown fixes */
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

/* Override Ant Design dropdown placement */
:deep(.ant-pagination .ant-select-dropdown) {
  position: absolute !important;
  bottom: calc(100% + 4px) !important;
  top: auto !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
}

/* Ensure select selector is properly displayed */
:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

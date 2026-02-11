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
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <!-- Add Template Button -->
          <div v-if="canEdit" class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddModal">
              <i class="ti ti-circle-plus me-2"></i>Add Template
            </button>
          </div>
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Letter Templates</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <!-- Sort Dropdown -->
            <div class="me-2">
              <a-select
                v-model:value="sortBy"
                placeholder="Sort By"
                style="width: 180px;"
                @change="handleFilterChange"
              >
                <a-select-option v-for="sort in sortOptions" :key="sort.value" :value="sort.value">
                  {{ sort.label }}
                </a-select-option>
              </a-select>
            </div>
            <!-- Clear -->
            <div class="me-2">
              <a-button @click="clearAll">Clear filters</a-button>
            </div>
            <!-- Search -->
            <div class="input-icon-end">
              <a-input-search
                v-model:value="searchText"
                placeholder="Search templates..."
                :loading="searchLoading"
                enter-button="Search"
                @search="handleSearch"
                style="width: 250px;"
                class="search-input-primary"
              />
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading templates...</p>
          </div>
          <div v-else class="resize-observer-fix">
            <a-table
              :columns="columns"
              :data-source="tableData"
              :pagination="false"
              :scroll="{ x: 800, y: 'max-content' }"
              row-key="id"
              @change="handleTableChange"
            >
              <template #bodyCell="{ column, record }">
                <!-- Title Column -->
                <template v-if="column.key === 'title'">
                  <div class="d-flex align-items-center">
                    <i class="ti ti-template me-2 text-primary"></i>
                    <strong>{{ record.title }}</strong>
                  </div>
                </template>

                <!-- Created By Column -->
                <template v-else-if="column.key === 'created_by'">
                  {{ record.created_by || '-' }}
                </template>

                <!-- Updated At Column -->
                <template v-else-if="column.key === 'updated_at'">
                  {{ formatDate(record.updated_at) }}
                </template>

                <!-- Actions Column -->
                <template v-else-if="column.key === 'actions'">
                  <div class="action-icon d-inline-flex">
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      @click="openGeneratePdfModal(record)"
                      title="Generate PDF"
                    >
                      <i class="ti ti-file-type-pdf"></i>
                    </a>
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      @click="openEditModal(record)"
                      title="Edit Template"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <a
                      v-if="canEdit"
                      href="javascript:void(0);"
                      @click="confirmDeleteTemplate(record)"
                      title="Delete Template"
                    >
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>
              </template>

              <!-- Empty State -->
              <template #emptyText>
                <div class="text-center py-4">
                  <i class="ti ti-template-off" style="font-size: 48px; color: #d9d9d9;"></i>
                  <p class="text-muted mt-2 mb-0">No letter templates found</p>
                  <p class="text-muted small">Create a new template to get started</p>
                </div>
              </template>
            </a-table>

            <!-- Pagination -->
            <div class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info"></div>
                <a-pagination
                  v-model:current="currentPage"
                  v-model:page-size="pageSize"
                  :total="total"
                  :show-size-changer="true"
                  :show-quick-jumper="true"
                  :page-size-options="['10', '20', '50']"
                  :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                  @change="handlePaginationChange"
                  @show-size-change="handleSizeChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>

  <!-- Letter Template Modal (for add/edit) -->
  <letter-template-modal
    :visible="showModal"
    :editing-template="editingTemplate"
    @saved="onTemplateSaved"
    @close="handleModalClose"
  ></letter-template-modal>

  <!-- Generate PDF Modal -->
  <generate-pdf-modal
    :visible="showPdfModal"
    :template="pdfTemplate"
    @close="handlePdfModalClose"
  ></generate-pdf-modal>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import LetterTemplateModal from '@/components/modal/letter-template-modal.vue';
import GeneratePdfModal from '@/components/modal/generate-pdf-modal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { letterTemplateService } from '@/services/letter-template.service';
import { Modal, message } from 'ant-design-vue';
import { usePermissions } from '@/composables/usePermissions';
import { ref } from 'vue';
import moment from 'moment';

export default {
  name: 'LetterTemplatesList',
  components: {
    indexBreadcrumb,
    LetterTemplateModal,
    GeneratePdfModal,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  },
  setup() {
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    const {
      canRead,
      canEdit,
      isReadOnly,
    } = usePermissions('letter_template');

    return {
      currentPage,
      pageSize,
      total,
      canRead,
      canEdit,
      isReadOnly,
    };
  },
  data() {
    return {
      title: 'Letter Templates',
      text: 'Administration',
      text1: 'Letter Templates',
      searchText: '',

      // Data
      templates: [],
      loading: false,
      searchLoading: false,

      // Filters
      sortBy: 'recently_updated',
      sortOptions: letterTemplateService.getSortOptions(),

      // Modal state
      showModal: false,
      editingTemplate: null,

      // PDF modal state
      showPdfModal: false,
      pdfTemplate: null,
    };
  },
  computed: {
    columns() {
      return [
        {
          title: 'Template Title',
          dataIndex: 'title',
          key: 'title',
          width: 300,
          ellipsis: true,
        },
        {
          title: 'Created By',
          dataIndex: 'created_by',
          key: 'created_by',
          width: 150,
        },
        {
          title: 'Last Updated',
          dataIndex: 'updated_at',
          key: 'updated_at',
          width: 180,
        },
        {
          title: 'Actions',
          key: 'actions',
          fixed: 'right',
          width: 130,
        },
      ];
    },
    tableData() {
      return this.templates;
    },
  },
  mounted() {
    this.fetchTemplates();
  },
  methods: {
    // ─── Data Fetching ───
    async fetchTemplates(params = {}) {
      this.loading = true;
      try {
        const queryParams = this.buildApiParams(params);
        const response = await letterTemplateService.getTemplates(queryParams);

        if (response.success) {
          this.templates = response.data || [];
          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
          }
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
        message.error(error.message || 'Failed to load templates');
      } finally {
        this.loading = false;
      }
    },

    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams,
      };
      if (this.sortBy) params.sort_by = this.sortBy;
      if (this.searchText?.trim()) params.search = this.searchText.trim();
      return params;
    },

    // ─── Filter & Pagination Handlers ───
    handleFilterChange() {
      this.currentPage = 1;
      this.fetchTemplates();
    },

    handleSearch(value) {
      this.searchLoading = true;
      this.currentPage = 1;
      this.fetchTemplates().finally(() => {
        this.searchLoading = false;
      });
    },

    handleTableChange(pagination, filters, sorter) {
      // Handle any table-level sorting/filtering
    },

    handlePaginationChange(page, pageSize) {
      this.currentPage = page;
      this.pageSize = pageSize;
      this.fetchTemplates({ page, per_page: pageSize });
    },

    handleSizeChange(current, size) {
      this.currentPage = 1;
      this.pageSize = size;
      this.fetchTemplates({ page: 1, per_page: size });
    },

    clearAll() {
      this.searchText = '';
      this.sortBy = 'recently_updated';
      this.currentPage = 1;
      this.fetchTemplates();
    },

    // ─── Modal Handlers ───
    openAddModal() {
      this.editingTemplate = null;
      this.showModal = true;
    },

    openEditModal(record) {
      this.editingTemplate = { ...record };
      this.showModal = true;
    },

    handleModalClose() {
      this.showModal = false;
      this.editingTemplate = null;
    },

    onTemplateSaved() {
      this.showModal = false;
      this.editingTemplate = null;
      this.fetchTemplates();
    },

    // ─── PDF Modal Handlers ───
    openGeneratePdfModal(record) {
      this.pdfTemplate = { ...record };
      this.showPdfModal = true;
    },

    handlePdfModalClose() {
      this.showPdfModal = false;
      this.pdfTemplate = null;
    },

    // ─── Delete ───
    confirmDeleteTemplate(record) {
      Modal.confirm({
        title: 'Delete Template',
        content: `Are you sure you want to delete "${record.title}"? This action cannot be undone.`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => this.deleteTemplate(record.id),
      });
    },

    async deleteTemplate(id) {
      try {
        await letterTemplateService.deleteTemplate(id);
        message.success('Template deleted successfully');
        this.fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        message.error(error.message || 'Failed to delete template');
      }
    },

    // ─── Utils ───
    formatDate(dateStr) {
      if (!dateStr) return '-';
      return moment(dateStr).format('DD/MM/YYYY HH:mm');
    },

    toggleHeader() {
      const header = document.getElementById('collapse-header');
      if (header) {
        header.closest('.page-breadcrumb')?.classList.toggle('collapse-header');
      }
    },
  },
};
</script>

<style scoped>
.pagination-wrapper {
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

.resize-observer-fix :deep(.ant-table-body) {
  overflow-x: auto !important;
}

.action-icon a {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #6c757d;
  transition: all 0.2s;
}

.action-icon a:hover {
  background: #f5f5f5;
  color: #1890ff;
}

.action-icon a[title="Delete Template"]:hover {
  color: #ff4d4f;
}

.action-icon a[title="Generate PDF"]:hover {
  color: #fa541c;
}
</style>

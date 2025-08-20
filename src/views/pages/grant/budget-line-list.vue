<template>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
        <div class="content">
            <!-- Breadcrumb -->
            <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                <index-breadcrumb :title="title" :text="text" :text1="text1" />
                <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
                    <div class="mb-2 me-2">
                        <button class="btn btn-primary d-flex align-items-center" @click="openAddModal">
                            <i class="ti ti-circle-plus me-2"></i>Add Budget Line
                        </button>
                    </div>
                </div>
            </div>
            <!-- /Breadcrumb -->

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Budget Lines List</h5>
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                        <div class="me-2">
                            <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
                            <a-button @click="clearAll">Clear filters and sorters</a-button>
                        </div>
                        <div class="input-icon-end">
                            <a-input-search v-model:value="searchBudgetLineCode" placeholder="Enter budget line code..."
                                :loading="searchLoading" enter-button="Search" @search="handleBudgetLineCodeSearch"
                                style="width: 250px;" class="search-input-primary" />
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="loading" class="text-center my-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading budget lines...</p>
                    </div>
                    <div v-else class="resize-observer-fix">
                        <a-table :columns="columns" :data-source="tableData" :pagination="false"
                            :scroll="{ x: 'max-content' }" row-key="id" @change="handleTableChange">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'actions'">
                                    <div class="action-icon d-inline-flex">
                                        <a href="javascript:void(0);" class="me-2" @click="openEditModal(record)">
                                            <i class="ti ti-edit"></i>
                                        </a>
                                        <a href="javascript:void(0);" class="text-danger"
                                            @click="confirmDelete(record)">
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
                                    :show-size-changer="true" :show-quick-jumper="true"
                                    :page-size-options="['10', '20', '50', '100']"
                                    :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                                    @change="handlePaginationChange" @show-size-change="handleSizeChange" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <layout-footer></layout-footer>

        <!-- Budget Line Modal -->
        <budget-line-modal ref="budgetLineModal" @saved="onSaved" :editData="editData" />

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
import { Toast } from 'bootstrap';
import { Modal as AntModal } from 'ant-design-vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import BudgetLineModal from '@/components/modal/budget-line-modal.vue';
import { budgetLineService } from '@/services/budget-line.service';

export default {
    name: 'BudgetLineList',
    components: {
        indexBreadcrumb,
        BudgetLineModal
    },
    data() {
        return {
            title: 'Budget Lines',
            text: 'Grants',
            text1: 'Budget Lines',
            budgetLines: [],
            loading: false,
            searchLoading: false,
            searchTerm: '',
            notificationTitle: '',
            notificationMessage: '',
            notificationClass: '',

            // Enhanced data model for enterprise-grade pagination and sorting
            filteredInfo: {},
            sortedInfo: {},
            currentPage: 1,
            pageSize: 10,
            total: 0,
            editData: null,
            searchBudgetLineCode: ''
        };
    },
    computed: {
        columns() {
            const filtered = this.filteredInfo || {};
            const sorted = this.sortedInfo || {};

            return [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    width: 80,
                    sorter: true, // Enable server-side sorting
                    sortOrder: sorted?.columnKey === 'id' && sorted?.order,
                },
                {
                    title: 'Budget Line Code',
                    dataIndex: 'budget_line_code',
                    key: 'budget_line_code',
                    width: 200,
                    sorter: true, // Enable server-side sorting
                    sortOrder: sorted?.columnKey === 'budget_line_code' && sorted?.order,
                    filterSearch: true
                },
                {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    width: 350,
                    ellipsis: true
                    // No sorting for description
                },
                {
                    title: 'Created By',
                    dataIndex: 'created_by',
                    key: 'created_by',
                    width: 150
                },
                {
                    title: 'Updated By',
                    dataIndex: 'updated_by',
                    key: 'updated_by',
                    width: 150
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    fixed: 'right',
                    width: 120
                }
            ];
        },
        tableData() {
            return this.budgetLines.map(b => ({ ...b, key: b.id }));
        }
    },
    mounted() {
        this.fetchBudgetLines();
    },
    methods: {
        // UNIFIED API PARAMETER BUILDER
        buildApiParams(baseParams = {}) {
            const params = {
                page: this.currentPage,
                per_page: this.pageSize,
                ...baseParams
            };

            // Add sorting parameters
            if (this.sortedInfo && this.sortedInfo.field) {
                const sortField = this.mapSortField(this.sortedInfo.field);
                params.sort_by = sortField;
                params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
            }

            // Add filter parameters
            if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
                // Add any specific filters here based on your needs
                Object.keys(this.filteredInfo).forEach(key => {
                    if (this.filteredInfo[key] && this.filteredInfo[key].length > 0) {
                        params[`filter_${key}`] = this.filteredInfo[key].join(',');
                    }
                });
            }

            // Add search parameter if exists
            if (this.searchBudgetLineCode && this.searchBudgetLineCode.trim()) {
                params.filter_budget_line_code = this.searchBudgetLineCode.trim();
            }

            return params;
        },

        // PAGINATION EVENT HANDLERS
        handlePaginationChange(page, pageSize) {
            console.log('Pagination change:', page, pageSize);
            this.currentPage = page;
            this.pageSize = pageSize || this.pageSize;

            // Build complete parameters preserving current filters and sorting
            const params = this.buildApiParams({
                page: page,
                per_page: this.pageSize
            });

            this.fetchBudgetLines(params);
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

            this.fetchBudgetLines(params);
        },

        // TABLE CHANGE HANDLER (for sorting/filtering only)
        handleTableChange(pagination, filters, sorter) {
            console.log('Table change (sorting/filtering):', filters, sorter);

            // Check if there's actually a meaningful change
            const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(this.filteredInfo);
            const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.sortedInfo);

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

            // Fetch budget lines with new parameters
            this.fetchBudgetLines(params);
        },

        // Map frontend table field names to backend field names
        mapSortField(field) {
            const fieldMapping = {
                'id': 'id',
                'budget_line_code': 'budget_line_code',
                'created_by': 'created_by',
                'updated_by': 'updated_by'
            };
            return fieldMapping[field] || field;
        },

        // FETCH ROUTINE REFACTOR
        async fetchBudgetLines(params = {}) {
            this.loading = true;
            try {
                const queryParams = {
                    page: params.page || this.currentPage || 1,
                    per_page: params.per_page || this.pageSize,
                    ...params
                };

                const response = await budgetLineService.getAllBudgetLines(queryParams);

                if (response.success && response.data) {
                    this.budgetLines = response.data || [];

                    // Update pagination properties from server response
                    if (response.pagination) {
                        this.total = response.pagination.total;
                        this.currentPage = response.pagination.current_page;
                        this.pageSize = response.pagination.per_page;
                    } else {
                        // Fallback for APIs that don't return pagination metadata
                        this.total = response.data.length;
                        this.currentPage = 1;
                    }

                    this.$message.success('Budget lines loaded successfully');
                } else {
                    // Handle legacy response format
                    this.budgetLines = response.data || [];
                    this.total = this.budgetLines.length;
                    this.$message.success('Budget lines loaded successfully');
                }
            } catch (error) {
                console.error('Error fetching budget lines:', error);
                this.$message.error('Failed to load budget lines');
                this.budgetLines = [];
                this.total = 0;
            } finally {
                this.loading = false;
            }
        },

        clearFilters() {
            this.filteredInfo = {};
            this.currentPage = 1;

            const params = this.buildApiParams({
                page: 1,
                per_page: this.pageSize
            });

            this.fetchBudgetLines(params);
        },

        clearAll() {
            this.filteredInfo = {};
            this.sortedInfo = {};
            this.searchBudgetLineCode = '';
            this.searchTerm = '';
            this.currentPage = 1;

            const params = this.buildApiParams({
                page: 1,
                per_page: this.pageSize
            });

            this.fetchBudgetLines(params);
        },

        // SEARCH INTEGRATION
        async handleBudgetLineCodeSearch() {
            // Validation: Check if search input is empty
            if (!this.searchBudgetLineCode || this.searchBudgetLineCode.trim() === '') {
                this.$message.warning('Please enter a budget line code to search');
                return;
            }

            this.searchLoading = true;
            try {
                const response = await budgetLineService.getBudgetLineByCode(this.searchBudgetLineCode);

                // Check if the API returned success
                if (response.success === true && response.data) {
                    const budgetLineData = Array.isArray(response.data) ? response.data : [response.data];

                    // Update the budget lines array with search results
                    this.budgetLines = budgetLineData;
                    this.total = budgetLineData.length;
                    this.currentPage = 1;
                    this.$message.success(response.message || `Found ${budgetLineData.length} budget line(s) matching "${this.searchBudgetLineCode}"`);
                } else {
                    // Handle API response with success: false (404 - Budget line not found)
                    this.budgetLines = [];
                    this.total = 0;
                    this.$message.warning(response.message || 'No budget line found with this code');
                }

                return response;
            } catch (error) {
                // Only network errors, auth errors, or parsing errors reach here
                console.error('Error fetching budget line by code:', error);
                this.$message.error('Network error: Failed to fetch budget line by code');
                // Clear budget lines on error
                this.budgetLines = [];
                this.total = 0;
            } finally {
                this.searchLoading = false;
            }
        },

        openAddModal() {
            this.editData = null;
            this.$refs.budgetLineModal.openModal();
        },

        openEditModal(record) {
            this.editData = { ...record };
            this.$refs.budgetLineModal.openModal(record);
        },

        confirmDelete(record) {
            AntModal.confirm({
                title: 'Are you sure you want to delete this budget line?',
                content: 'This action cannot be undone.',
                centered: true,
                okText: 'Yes, delete',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    this.loading = true;
                    try {
                        await budgetLineService.deleteBudgetLine(record.id);
                        this.$message.success('Budget line deleted successfully');

                        // Refresh with current parameters to maintain pagination/filters
                        const params = this.buildApiParams();
                        await this.fetchBudgetLines(params);
                    } catch (error) {
                        this.$message.error('Failed to delete budget line');
                    } finally {
                        this.loading = false;
                    }
                }
            });
        },

        onSaved() {
            // Refresh with current parameters to maintain pagination/filters
            const params = this.buildApiParams();
            this.fetchBudgetLines(params);
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
.table-operations {
    margin-bottom: 16px;
}

.table-operations>button {
    margin-right: 8px;
}

.action-icon a {
    margin-right: 8px;
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
</style>
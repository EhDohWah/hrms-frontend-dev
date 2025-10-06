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
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                <i class="ti ti-file-export me-1"></i>Export
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="exportData('pdf')">
                                        <i class="ti ti-file-type-pdf me-1"></i>Export as PDF
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="exportData('excel')">
                                        <i class="ti ti-file-type-xls me-1"></i>Export as Excel
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="mb-2">
                        <a href="javascript:void(0);" class="btn btn-primary d-flex align-items-center"
                            @click="openCreateModal">
                            <i class="ti ti-circle-plus me-2"></i>Add Resignation
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

            <!-- Resignation Info Cards -->
            <div class="row statistics-row">
                <div class="col-xl-3 col-sm-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-primary rounded-circle">
                                        <i class="ti ti-users-minus text-white"></i>
                                    </span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Total Resignations</p>
                                    <h4 class="mb-0">{{ statistics.total || 0 }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-warning rounded-circle">
                                        <i class="ti ti-clock text-white"></i>
                                    </span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Pending</p>
                                    <h4 class="mb-0">{{ statistics.pending || 0 }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-success rounded-circle">
                                        <i class="ti ti-check text-white"></i>
                                    </span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Acknowledged</p>
                                    <h4 class="mb-0">{{ statistics.acknowledged || 0 }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-info rounded-circle">
                                        <i class="ti ti-calendar text-white"></i>
                                    </span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">This Month</p>
                                    <h4 class="mb-0">{{ statistics.currentMonth || 0 }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Resignation Info Cards -->

            <!-- Resignation List -->
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Resignation List</h5>
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                        <div class="me-2">
                            <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
                            <a-button @click="clearAll">Clear filters and sorters</a-button>
                        </div>
                        <div class="input-icon-end">
                            <a-input-search v-model:value="searchTerm" placeholder="Search resignations..."
                                :loading="searchLoading" enter-button="Search" @search="handleSearch"
                                style="width: 250px;" class="search-input-primary" />
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <!-- Loading State -->
                    <div v-if="loading" class="text-center my-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading resignations...</p>
                    </div>
                    <div v-else class="resize-observer-fix">
                        <!-- TABLE WITHOUT PAGINATION -->
                        <a-table :columns="columns" :data-source="tableData" :pagination="false"
                            :scroll="{ x: 1200, y: 'max-content' }" row-key="id" @change="handleTableChange"
                            :row-selection="rowSelection">
                            <!-- Custom cell rendering -->
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'action'">
                                    <div class="action-icon d-inline-flex">
                                        <!-- View Resignation -->
                                        <a href="javascript:void(0);" @click="viewResignation(record)" class="me-2">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                        <!-- Edit Resignation -->
                                        <a href="javascript:void(0);" @click="editResignation(record)" class="me-2">
                                            <i class="ti ti-edit"></i>
                                        </a>
                                        <!-- Acknowledge Resignation -->
                                        <a v-if="record.acknowledgementStatus === 'Pending'" href="javascript:void(0);"
                                            @click="acknowledgeResignation(record)" class="me-2 text-success">
                                            <i class="ti ti-check"></i>
                                        </a>
                                        <!-- Delete Resignation -->
                                        <a href="javascript:void(0);" @click="confirmDeleteResignation(record.id)">
                                            <i class="ti ti-trash"></i>
                                        </a>
                                    </div>
                                </template>

                                <!-- Employee column -->
                                <template v-if="column.key === 'employee'">
                                    <div>
                                        <strong>{{ record.employee?.name || 'N/A' }}</strong>
                                        <br>
                                        <small class="text-muted">{{ record.employee?.staffId || 'N/A' }}</small>
                                    </div>
                                </template>

                                <!-- Department column -->
                                <template v-if="column.key === 'department'">
                                    {{ record.department?.name || 'N/A' }}
                                </template>

                                <!-- Position column -->
                                <template v-if="column.key === 'position'">
                                    {{ record.position?.title || 'N/A' }}
                                </template>

                                <!-- Resignation Date column -->
                                <template v-if="column.key === 'resignation_date'">
                                    {{ formatDate(record.resignationDate) }}
                                </template>

                                <!-- Last Working Date column -->
                                <template v-if="column.key === 'last_working_date'">
                                    {{ formatDate(record.lastWorkingDate) }}
                                </template>

                                <!-- Notice Period column -->
                                <template v-if="column.key === 'notice_period'">
                                    <span class="badge badge-light">{{ record.noticePeriod || 0 }} days</span>
                                </template>

                                <!-- Reason column -->
                                <template v-if="column.key === 'reason'">
                                    <a-tooltip :title="record.reason" placement="topLeft">
                                        <span class="text-muted">
                                            {{ truncateText(record.reason, 60) }}
                                        </span>
                                    </a-tooltip>
                                </template>

                                <!-- Status column -->
                                <template v-if="column.key === 'status'">
                                    <span :class="getStatusConfig(record.acknowledgementStatus).class">
                                        <i :class="getStatusConfig(record.acknowledgementStatus).icon + ' me-1'"></i>
                                        {{ getStatusConfig(record.acknowledgementStatus).label }}
                                    </span>
                                </template>
                            </template>

                            <!-- Empty state -->
                            <template #emptyText>
                                <div class="d-flex flex-column align-items-center py-4">
                                    <i class="ti ti-users-minus text-muted mb-3" style="font-size: 3rem;"></i>
                                    <h6 class="text-muted">No resignations found</h6>
                                    <p class="text-muted">Start by adding your first resignation record.</p>
                                </div>
                            </template>
                        </a-table>
                    </div>

                    <!-- SEPARATE PAGINATION COMPONENT - Always show -->
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

        <layout-footer></layout-footer>
    </div>
    <!-- /Page Wrapper -->

    <!-- Add/Edit Resignation Modal -->
    <ResignationModal :show="showModal" :isEditing="isEditing" :resignation="selectedResignation" @close="closeModal"
        @save="handleSave" />

</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import ResignationModal from '@/components/modal/ResignationModal.vue';
import { resignationService } from '@/services/resignation.service';
import { statusUtils, dateUtils, exportUtils } from '@/utils/resignation.utils';
import { useToast } from '@/composables/useToast';
import { Modal, Table } from 'ant-design-vue';

export default {
    name: 'EmployeeResignation',
    components: {
        indexBreadcrumb,
        ResignationModal
    },
    setup() {
        const { showToast } = useToast();
        return {
            showToast
        };
    },
    data() {
        return {
            title: "Employee Resignations",
            text: "Employee",
            text1: "Resignations",

            // Data
            resignations: [],
            departments: [],
            statistics: {
                total: 0,
                pending: 0,
                acknowledged: 0,
                rejected: 0,
                currentMonth: 0
            },
            selectedRowKeys: [],
            showModal: false,
            isEditing: false,
            selectedResignation: null,
            loading: false,
            searchLoading: false,

            // Filters and sorting
            searchTerm: '',
            filteredInfo: {},
            sortedInfo: {},

            // SEPARATE PAGINATION PROPERTIES
            currentPage: 1,
            pageSize: 10,
            total: 0,

            // Static data
            acknowledgementStatusOptions: statusUtils.getAcknowledgementStatusOptions()
        };
    },
    computed: {
        columns() {
            const filtered = this.filteredInfo || {};
            const sorted = this.sortedInfo || {};

            return [
                {
                    title: 'Employee',
                    key: 'employee',
                    width: 200,
                    fixed: 'left',
                    sorter: false,
                },
                {
                    title: 'Department',
                    key: 'department',
                    width: 150,
                    filters: this.getDepartmentFilters(),
                    filteredValue: filtered.department || null,
                    sorter: false,
                },
                {
                    title: 'Position',
                    key: 'position',
                    width: 150,
                    sorter: false,
                },
                {
                    title: 'Resignation Date',
                    key: 'resignation_date',
                    width: 150,
                    sorter: true,
                    sortOrder: sorted.columnKey === 'resignation_date' && sorted.order,
                },
                {
                    title: 'Last Working Date',
                    key: 'last_working_date',
                    width: 150,
                    sorter: true,
                    sortOrder: sorted.columnKey === 'last_working_date' && sorted.order,
                },
                {
                    title: 'Notice Period',
                    key: 'notice_period',
                    width: 120,
                    sorter: false,
                },
                {
                    title: 'Reason',
                    key: 'reason',
                    width: 200,
                    sorter: false,
                    ellipsis: {
                        showTitle: true
                    }
                },
                {
                    title: 'Status',
                    key: 'status',
                    width: 150,
                    filters: [
                        { text: 'Pending', value: 'Pending' },
                        { text: 'Acknowledged', value: 'Acknowledged' },
                        { text: 'Rejected', value: 'Rejected' },
                    ],
                    filteredValue: filtered.status || null,
                    sorter: false,
                },
                {
                    title: 'Actions',
                    key: 'action',
                    fixed: 'right',
                    width: 120,
                    sorter: false,
                },
            ];
        },
        tableData() {
            return this.resignations.map(resignation => ({
                ...resignation,
                key: resignation.id,
            }));
        },
        rowSelection() {
            return {
                fixed: 'left',
                columnWidth: 60,
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onSelectChange,
                hideDefaultSelections: false,
                selections: [
                    Table.SELECTION_ALL,
                    Table.SELECTION_NONE,
                ],
            }
        },
        hasResignations() {
            return this.resignations && this.resignations.length > 0;
        },
    },
    async mounted() {
        await this.fetchResignations();
        await this.fetchDepartments();
        await this.fetchStatistics();
    },
    methods: {
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

            this.fetchResignations(params);
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

            this.fetchResignations(params);
        },

        // Helper method to build complete API parameters
        buildApiParams(baseParams = {}) {
            const params = {
                page: this.currentPage,
                per_page: this.pageSize,
                ...baseParams
            };

            // Add sorting parameters ONLY when user has explicitly clicked on a column to sort
            if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
                const sortField = this.mapSortField(this.sortedInfo.field);
                params.sort_by = sortField;
                params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
            }

            // Add filter parameters
            if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
                if (this.filteredInfo.department && this.filteredInfo.department.length > 0) {
                    params.filter_department = this.filteredInfo.department.join(',');
                }
                if (this.filteredInfo.status && this.filteredInfo.status.length > 0) {
                    params.filter_status = this.filteredInfo.status.join(',');
                }
            }

            return params;
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

            // Update filter state
            this.filteredInfo = filters;

            // Only update sorter if it's a real sort operation (has field and order)
            // Don't preserve old sorting when only filtering
            if (sorter && sorter.field && sorter.order) {
                console.log('Applying sort:', sorter);
                this.sortedInfo = sorter;
            } else if (!sorter || (!sorter.field && !sorter.order)) {
                console.log('Clearing sort (filtering only or no sort)');
                this.sortedInfo = {};
            }

            // Reset to first page when filter/sort changes
            this.currentPage = 1;

            // Build complete parameters
            const params = this.buildApiParams({
                page: 1,
                per_page: this.pageSize
            });

            // Fetch resignations with new parameters
            this.fetchResignations(params);
        },

        // Map frontend table field names to backend field names
        mapSortField(field) {
            const fieldMapping = {
                'resignation_date': 'resignation_date',
                'last_working_date': 'last_working_date',
            };
            return fieldMapping[field] || field;
        },

        clearFilters() {
            this.filteredInfo = {};
            this.currentPage = 1;

            const params = this.buildApiParams({
                page: 1,
                per_page: this.pageSize
            });

            this.fetchResignations(params);
        },

        clearAll() {
            this.filteredInfo = {};
            this.sortedInfo = {};
            this.searchTerm = '';
            this.currentPage = 1;

            const params = this.buildApiParams({
                page: 1,
                per_page: this.pageSize
            });

            this.fetchResignations(params);
        },

        async fetchResignations(params = {}) {
            this.loading = true;
            try {
                const queryParams = {
                    page: params.page || this.currentPage || 1,
                    per_page: params.per_page || this.pageSize,
                    ...params
                };

                const response = await resignationService.getResignations(queryParams);
                if (response.success) {
                    this.resignations = response.data || [];

                    // Update pagination properties from server response
                    if (response.pagination) {
                        this.total = response.pagination.total || 0;
                        this.currentPage = response.pagination.current_page || 1;
                        this.pageSize = response.pagination.per_page || this.pageSize;
                    } else {
                        this.total = (response.data && response.data.length) || 0;
                        this.currentPage = 1;
                    }
                } else {
                    // Handle case when response is not successful
                    this.resignations = [];
                    this.total = 0;
                }
            } catch (error) {
                console.error('Error fetching resignations:', error);
                this.showToast('Error loading resignations', 'error');
                // Clear data on error
                this.resignations = [];
                this.total = 0;
            } finally {
                this.loading = false;
            }
        },

        async fetchDepartments() {
            try {
                const response = await resignationService.getDepartments();
                if (response.success) {
                    this.departments = response.data;
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        },

        async fetchStatistics() {
            try {
                const response = await resignationService.getResignationStatistics();
                if (response.success) {
                    this.statistics = response.data;
                }
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        },

        // Modal methods
        openCreateModal() {
            this.selectedResignation = null;
            this.isEditing = false;
            this.showModal = true;
        },

        editResignation(resignation) {
            this.selectedResignation = resignation;
            this.isEditing = true;
            this.showModal = true;
        },

        viewResignation(resignation) {
            // For now, open edit modal in read-only mode
            this.editResignation(resignation);
        },

        closeModal() {
            this.showModal = false;
            this.selectedResignation = null;
            this.isEditing = false;
        },

        async handleSave(resignationData) {
            await this.fetchResignations();
            await this.fetchStatistics();
            this.showToast(
                this.isEditing ? 'Resignation updated successfully' : 'Resignation added successfully',
                'success'
            );
        },

        // Row selection change handler
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
            console.log('selectedRowKeys changed: ', selectedRowKeys);
        },

        // Search methods
        async handleSearch() {
            // Validation: Check if search input is empty
            if (!this.searchTerm || this.searchTerm.trim() === '') {
                this.$message && this.$message.warning && this.$message.warning('Please enter search term');
                return;
            }

            this.searchLoading = true;
            try {
                const params = this.buildApiParams({
                    page: 1,
                    per_page: this.pageSize,
                    search: this.searchTerm.trim()
                });

                await this.fetchResignations(params);
                this.$message && this.$message.success && this.$message.success('Search completed successfully');
            } catch (error) {
                console.error('Error searching resignations:', error);
                this.$message && this.$message.error && this.$message.error('Failed to search resignations');
            } finally {
                this.searchLoading = false;
            }
        },

        // Get filter options for departments
        getDepartmentFilters() {
            if (!this.departments || this.departments.length === 0) return [];
            return this.departments.map(dept => ({
                text: dept.name,
                value: dept.id
            }));
        },

        // Utility methods
        truncateText(text, maxLength = 60) {
            if (!text) return 'No reason provided';
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        },

        // Acknowledgement methods
        async acknowledgeResignation(resignation) {
            try {
                const response = await resignationService.acknowledgeResignation(resignation.id, {
                    status: 'Acknowledged',
                    acknowledgedBy: 1 // This should come from current user
                });

                if (response.success) {
                    await this.fetchResignations();
                    await this.fetchStatistics();
                    this.showToast('Resignation acknowledged successfully', 'success');
                }
            } catch (error) {
                console.error('Error acknowledging resignation:', error);
                this.showToast('Error acknowledging resignation', 'error');
            }
        },

        // Delete methods
        confirmDeleteResignation(id) {
            const resignation = this.resignations.find(r => r.id === id);
            if (!resignation) return;

            Modal.confirm({
                title: 'Are you sure you want to delete this resignation?',
                content: `This will delete the resignation record for ${resignation.employee?.name || 'this employee'}. This action cannot be undone.`,
                centered: true,
                okText: 'Yes, Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: () => {
                    this.handleDeleteResignation(id);
                }
            });
        },

        async handleDeleteResignation(id) {
            try {
                const response = await resignationService.deleteResignation(id);
                if (response.success) {
                    await this.fetchResignations();
                    await this.fetchStatistics();
                    this.showToast('Resignation deleted successfully', 'success');
                }
            } catch (error) {
                console.error('Error deleting resignation:', error);
                this.showToast('Error deleting resignation', 'error');
            }
        },

        // Export methods
        async exportData(format) {
            try {
                const filters = {
                    search: this.searchTerm,
                    departmentId: this.selectedDepartment?.id,
                    acknowledgementStatus: this.selectedStatus?.value,
                    sortBy: this.sortBy
                };

                const blob = await resignationService.exportResignations(format, filters);
                const filename = exportUtils.generateFilename(format, filters);

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                this.showToast(`Resignations exported successfully as ${format.toUpperCase()}`, 'success');
            } catch (error) {
                console.error('Error exporting resignations:', error);
                this.showToast('Error exporting resignations', 'error');
            }
        },

        // Utility methods
        formatDate(date) {
            return dateUtils.formatDate(date);
        },

        getStatusConfig(status) {
            return statusUtils.getAcknowledgementStatusConfig(status);
        },

        toggleHeader() {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
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

/* Container overflow fixes - only apply to table cards, not statistics */
.card:not(.statistics-card) {
    overflow: visible !important;
    margin-bottom: 20px;
}

.card:not(.statistics-card) .card-body {
    overflow: visible !important;
    padding-bottom: 0;
}

/* Statistics cards styling */
.statistics-card {
    margin-bottom: 0.75rem;
}

.statistics-card .card-body {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: auto;
}

/* Ensure statistics row has proper spacing */
.statistics-row {
    margin-bottom: 1rem;
}

.statistics-row .col-xl-3 {
    margin-bottom: 0.5rem;
}

/* Make statistics cards more compact */
.statistics-card .avatar {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 0.75rem;
    font-weight: 600;
}

.statistics-card h4 {
    margin-bottom: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.statistics-card .fs-12 {
    font-size: 0.75rem !important;
    margin-bottom: 0.25rem !important;
}

.statistics-card .badge {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
}

/* Enhanced scrollbar styling - Match Ant Design Vue docs */
:deep(.ant-table-body)::-webkit-scrollbar {
    width: 16px !important;
    height: 16px !important;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
    background: #f1f1f1 !important;
    border-radius: 8px !important;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
    background: #888 !important;
    border-radius: 8px !important;
    border: 2px solid #f1f1f1 !important;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
    background: #555 !important;
}

/* Fix for fixed columns - comprehensive solution */
:deep(.ant-table-fixed-left),
:deep(.ant-table-fixed-right) {
    background-color: #ffffff !important;
}

:deep(.ant-table-fixed-left .ant-table-thead > tr > th),
:deep(.ant-table-fixed-right .ant-table-thead > tr > th) {
    background-color: #fafafa !important;
    color: #595959 !important;
    font-weight: 600 !important;
    border-bottom: 1px solid #e0e0e0 !important;
}

:deep(.ant-table-fixed-left .ant-table-tbody > tr > td),
:deep(.ant-table-fixed-right .ant-table-tbody > tr > td) {
    background-color: #ffffff !important;
}

/* Fix for main table headers to match fixed headers */
:deep(.ant-table-thead > tr > th) {
    background-color: #fafafa !important;
    color: #595959 !important;
    font-weight: 600 !important;
    border-bottom: 1px solid #e0e0e0 !important;
}

/* Ensure all table cells have consistent background */
:deep(.ant-table-tbody > tr > td) {
    background-color: #ffffff !important;
}

/* Fix for table rows hover state - all tables */
:deep(.ant-table-tbody > tr:hover > td),
:deep(.ant-table-fixed-left .ant-table-tbody > tr:hover > td),
:deep(.ant-table-fixed-right .ant-table-tbody > tr:hover > td) {
    background-color: #fafafa !important;
}

/* Fix for selection column */
:deep(.ant-table-selection-column) {
    background-color: #ffffff !important;
    z-index: 3 !important;
    min-width: 60px !important;
    width: 60px !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
}

/* Fix for selection column header */
:deep(.ant-table-thead .ant-table-selection-column) {
    background-color: #fafafa !important;
}

/* Fix for fixed table selection columns */
:deep(.ant-table-fixed-left .ant-table-selection-column) {
    background-color: #ffffff !important;
}

:deep(.ant-table-fixed-left .ant-table-thead .ant-table-selection-column) {
    background-color: #fafafa !important;
}

/* Fix for selected rows - ensure all selected cells have same background */
:deep(.ant-table-row-selected > td),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-left),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-right),
:deep(.ant-table-row-selected > td.ant-table-selection-column) {
    background-color: #e6f7ff !important;
    z-index: 3 !important;
}

/* Fix for table container and layout */
:deep(.ant-table-container) {
    border: 1px solid #e0e0e0;
    border-radius: 0;
}

/* Ensure proper table layout for fixed columns */
:deep(.ant-table-layout-fixed table) {
    table-layout: auto !important;
}

/* Fix for table wrapper */
:deep(.ant-table-wrapper) {
    background-color: #ffffff;
}

/* Action icons */
.action-icon {
    display: inline-flex;
    gap: 8px;
}

.action-icon a {
    color: #666;
    font-size: 16px;
    transition: color 0.2s;
}

.action-icon a:hover {
    color: #0067A5;
}

/* Badge styling */
.badge-light {
    background-color: #f8f9fa;
    color: #6c757d;
    border: 1px solid #dee2e6;
}

.text-muted {
    color: #999 !important;
}

/* Legacy styling for existing elements */
.text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.custom-datatable-filter .table td {
    vertical-align: middle;
}

.dropdown-menu {
    min-width: 150px;
}
</style>

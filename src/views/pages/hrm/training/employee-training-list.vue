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
                        v-if="isReadOnlyEmployeeTraining"
                        class="badge bg-warning text-dark ms-3 d-flex align-items-center"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="You have view-only access to this module"
                    >
                        <i class="ti ti-eye me-1"></i> Read Only
                    </span>
                </div>
                <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
                    <div v-if="canEditEmployeeTraining" class="mb-2 me-2">
                        <button class="btn btn-primary d-flex align-items-center" @click="openCreateModal">
                            <i class="ti ti-circle-plus me-2"></i>Assign Employee to Training
                        </button>
                    </div>
                    <div v-if="canEditEmployeeTraining" class="mb-2 me-2">
                        <button class="btn btn-danger d-flex align-items-center"
                            @click="confirmDeleteSelectedEmployeeTrainings"
                            :class="{ 'disabled': selectedRowKeys.length === 0 }">
                            <i class="ti ti-trash me-2"></i>Delete Selected
                        </button>
                    </div>

                    <div class="head-icons ms-2">
                        <a href="javascript:void(0);" class="" data-bs-toggle="tooltip" data-bs-placement="top"
                            data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
                            <i :class="isHeaderCollapsed ? 'ti ti-chevrons-down' : 'ti ti-chevrons-up'"></i>
                        </a>
                    </div>
                </div>
            </div>
            <!-- /Breadcrumb -->

            <!-- Employee Training Statistics -->
            <div class="row statistics-row">
                <!-- Total Records -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-primary rounded-circle"><i
                                            class="ti ti-users"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Total Enrollments</p>
                                    <h4>{{ statistics.total }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-primary badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    100%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Total Records -->

                <!-- Completed -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-success rounded-circle"><i
                                            class="ti ti-check"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Completed</p>
                                    <h4>{{ statistics.completed }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-success badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ getPercentage(statistics.completed, statistics.total) }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Completed -->

                <!-- In Progress -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-info rounded-circle"><i
                                            class="ti ti-clock"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">In Progress</p>
                                    <h4>{{ statistics.inProgress }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-info badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ getPercentage(statistics.inProgress, statistics.total) }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /In Progress -->

                <!-- Pending -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-warning rounded-circle"><i
                                            class="ti ti-hourglass"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Pending</p>
                                    <h4>{{ statistics.pending }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-warning badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ getPercentage(statistics.pending, statistics.total) }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Pending -->
            </div>
            <!-- /Employee Training Statistics -->

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Employee Training Records</h5>
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                        <div class="me-2">
                            <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
                            <a-button @click="clearAll">Clear filters and sorters</a-button>
                        </div>
                        <div class="input-icon-end">
                            <a-input-search v-model:value="searchText" placeholder="Search by training title..."
                                :loading="searchLoading" enter-button="Search" @search="handleSearch"
                                style="width: 250px;" class="search-input-primary" />
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="loading" class="text-center my-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading employee training records...</p>
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
                                        <!-- View -->
                                        <a href="javascript:void(0);" @click="viewEmployeeTraining(record)"
                                            class="me-2">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                        <!-- Edit -->
                                        <a v-if="canEditEmployeeTraining" href="javascript:void(0);" @click="editEmployeeTraining(record)"
                                            class="me-2">
                                            <i class="ti ti-edit"></i>
                                        </a>
                                        <!-- Delete -->
                                        <a v-if="canEditEmployeeTraining" href="javascript:void(0);" @click="confirmDeleteEmployeeTraining(record.id)">
                                            <i class="ti ti-trash"></i>
                                        </a>
                                    </div>
                                </template>

                                <!-- Employee column -->
                                <template v-if="column.key === 'employee_name'">
                                    <div>
                                        <strong>{{ record.employee_name }}</strong>
                                        <br>
                                        <small class="text-muted">{{ record.staff_id }}</small>
                                    </div>
                                </template>

                                <!-- Training column -->
                                <template v-if="column.key === 'training_title'">
                                    <div>
                                        <strong>{{ record.training_title }}</strong>
                                        <br>
                                        <small class="text-muted">{{ record.organizer }}</small>
                                    </div>
                                </template>

                                <!-- Date Range column -->
                                <template v-if="column.key === 'date_range'">
                                    <div>
                                        <div><strong>Start:</strong> {{ formatDate(record.start_date) }}</div>
                                        <div><strong>End:</strong> {{ formatDate(record.end_date) }}</div>
                                    </div>
                                </template>

                                <!-- Status badge -->
                                <template v-if="column.key === 'status'">
                                    <span :class="getStatusBadgeClass(record.status)">{{ record.status }}</span>
                                </template>
                            </template>
                        </a-table>

                        <!-- SEPARATE PAGINATION COMPONENT -->
                        <div class="pagination-wrapper">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="pagination-info">
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
    </div>

    <!-- Employee Training Modal (lazy-loaded) -->
    <employee-training-modal :visible="modalVisible" :editing-record="editingRecord" @saved="handleSaved" @close="closeModal" />

    <!-- View Employee Training Modal -->
    <a-modal
        v-model:open="viewModalVisible"
        title="Employee Training Details"
        :footer="null"
        :width="650"
        centered
        :destroyOnClose="true"
    >
        <div v-if="viewingEmployeeTraining" class="view-details">
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label fw-medium">Employee Name</label>
                    <p class="form-control-plaintext">{{ viewingEmployeeTraining.employee_name }}</p>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-medium">Staff ID</label>
                    <p class="form-control-plaintext">{{ viewingEmployeeTraining.staff_id }}</p>
                </div>
                <div class="col-md-12">
                    <label class="form-label fw-medium">Training Program</label>
                    <p class="form-control-plaintext">{{ viewingEmployeeTraining.training_title }}</p>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-medium">Organizer</label>
                    <p class="form-control-plaintext">{{ viewingEmployeeTraining.organizer }}</p>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-medium">Status</label>
                    <p class="form-control-plaintext">
                        <span :class="getStatusBadgeClass(viewingEmployeeTraining.status)">
                            {{ viewingEmployeeTraining.status }}
                        </span>
                    </p>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-medium">Start Date</label>
                    <p class="form-control-plaintext">{{ formatDate(viewingEmployeeTraining.start_date) }}</p>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-medium">End Date</label>
                    <p class="form-control-plaintext">{{ formatDate(viewingEmployeeTraining.end_date) }}</p>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script>
import { useEmployeeTrainingStore } from '@/stores/employeeTrainingStore';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { Modal, message } from 'ant-design-vue';
import { usePermissions } from '@/composables/usePermissions';
import moment from 'moment';

export default {
    name: 'EmployeeTrainingList',
    components: {
        indexBreadcrumb,
    },
    setup() {
        const {
            canRead,
            canEdit,
            isReadOnly,
            accessLevelText,
            accessLevelBadgeClass
        } = usePermissions('employee_training');

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
            title: 'Employee Training Management',
            text: 'Training',
            text1: 'Employee Training',

            // Data
            employeeTrainingStore: useEmployeeTrainingStore(),
            viewingEmployeeTraining: null,
            viewModalVisible: false,

            // Modal state
            modalVisible: false,
            editingRecord: null,

            // Search
            searchText: '',
            searchLoading: false,

            // Table selection
            selectedRowKeys: [],

            // Header collapse state
            isHeaderCollapsed: false,

            // Ant Design table columns
            columns: [
                {
                    title: 'Employee',
                    key: 'employee_name',
                    sorter: true,
                    width: 200
                },
                {
                    title: 'Training Program',
                    key: 'training_title',
                    sorter: true,
                    width: 250
                },
                {
                    title: 'Date Range',
                    key: 'date_range',
                    sorter: false,
                    width: 180
                },
                {
                    title: 'Status',
                    key: 'status',
                    filters: [
                        { text: 'Pending', value: 'Pending' },
                        { text: 'In Progress', value: 'In Progress' },
                        { text: 'Completed', value: 'Completed' },
                        { text: 'Cancelled', value: 'Cancelled' }
                    ],
                    width: 130
                },
                {
                    title: 'Created',
                    dataIndex: 'created_at',
                    key: 'created_at',
                    sorter: true,
                    width: 150,
                    customRender: ({ text }) => this.formatDate(text)
                },
                {
                    title: 'Actions',
                    key: 'action',
                    width: 120,
                    fixed: 'right'
                }
            ]
        };
    },

    computed: {
        canEditEmployeeTraining() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasEdit = Array.isArray(permissions) && permissions.includes('employee_training.edit');
                return hasEdit || (this.canEdit?.value ?? false);
            } catch (e) {
                console.error('[EmployeeTrainingList] Error checking permissions:', e);
                return this.canEdit?.value ?? false;
            }
        },
        canReadEmployeeTraining() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasRead = Array.isArray(permissions) && permissions.includes('employee_training.read');
                return hasRead || (this.canRead?.value ?? false);
            } catch (e) {
                return this.canRead?.value ?? false;
            }
        },
        isReadOnlyEmployeeTraining() {
            return this.canReadEmployeeTraining && !this.canEditEmployeeTraining;
        },
        tableData() {
            return this.employeeTrainingStore.employeeTrainings;
        },

        loading() {
            return this.employeeTrainingStore.loading;
        },

        currentPage: {
            get() {
                return this.employeeTrainingStore.currentPage;
            },
            set(value) {
                this.employeeTrainingStore.currentPage = value;
            }
        },

        pageSize: {
            get() {
                return this.employeeTrainingStore.pageSize;
            },
            set(value) {
                this.employeeTrainingStore.pageSize = value;
            }
        },

        total() {
            return this.employeeTrainingStore.total;
        },

        statistics() {
            return this.employeeTrainingStore.statistics;
        },

        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onSelectChange
            };
        }
    },

    async mounted() {
        await this.fetchEmployeeTrainings();
    },

    methods: {
        async fetchEmployeeTrainings(params = {}) {
            try {
                await this.employeeTrainingStore.fetchEmployeeTrainings(params);
            } catch (error) {
                console.error('Error fetching employee trainings:', error);
                message.error('Failed to load employee training records');
            }
        },

        async handleSearch() {
            this.searchLoading = true;
            try {
                await this.employeeTrainingStore.searchEmployeeTrainings(this.searchText);
            } catch (error) {
                console.error('Search error:', error);
                message.error(error.message || 'Search failed');
            } finally {
                this.searchLoading = false;
            }
        },

        handleTableChange(pagination, filters, sorter) {
            if (filters.status) {
                this.employeeTrainingStore.updateFilters({ status: filters.status });
            }
            this.employeeTrainingStore.updateSorting(sorter);
            const params = this.employeeTrainingStore.buildApiParams();
            this.fetchEmployeeTrainings(params);
        },

        handlePaginationChange(page, pageSize) {
            this.currentPage = page;
            this.pageSize = pageSize;
            const params = this.employeeTrainingStore.buildApiParams();
            this.fetchEmployeeTrainings(params);
        },

        handleSizeChange(current, size) {
            this.currentPage = 1;
            this.pageSize = size;
            const params = this.employeeTrainingStore.buildApiParams();
            this.fetchEmployeeTrainings(params);
        },

        clearFilters() {
            this.employeeTrainingStore.clearFilters();
            this.searchText = '';
            this.fetchEmployeeTrainings();
        },

        clearAll() {
            this.employeeTrainingStore.clearAll();
            this.searchText = '';
            this.selectedRowKeys = [];
            this.fetchEmployeeTrainings();
        },

        // Modal methods
        openCreateModal() {
            this.editingRecord = null;
            this.modalVisible = true;
        },

        editEmployeeTraining(record) {
            this.editingRecord = record;
            this.modalVisible = true;
        },

        closeModal() {
            this.modalVisible = false;
            this.editingRecord = null;
        },

        handleSaved() {
            this.closeModal();
            this.fetchEmployeeTrainings();
        },

        viewEmployeeTraining(record) {
            this.viewingEmployeeTraining = record;
            this.viewModalVisible = true;
        },

        async confirmDeleteEmployeeTraining(id) {
            Modal.confirm({
                title: 'Delete Employee Training',
                content: 'This will delete the employee training record.',
                okText: 'Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                centered: true,
                onOk: async () => {
                    try {
                        await this.employeeTrainingStore.deleteEmployeeTraining(id);
                        message.success('Employee training deleted successfully');
                        await this.fetchEmployeeTrainings();
                    } catch (error) {
                        message.error('Failed to delete employee training');
                    }
                }
            });
        },

        async confirmDeleteSelectedEmployeeTrainings() {
            if (this.selectedRowKeys.length === 0) {
                return;
            }

            Modal.confirm({
                title: 'Delete Selected Records',
                content: `This will delete ${this.selectedRowKeys.length} employee training record(s).`,
                okText: 'Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                centered: true,
                onOk: async () => {
                    try {
                        await this.employeeTrainingStore.deleteSelectedEmployeeTrainings(this.selectedRowKeys);
                        this.selectedRowKeys = [];
                        message.success('Selected employee trainings deleted successfully');
                        await this.fetchEmployeeTrainings();
                    } catch (error) {
                        message.error('Failed to delete selected employee trainings');
                    }
                }
            });
        },

        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },

        formatDate(date) {
            if (!date) return 'N/A';
            return moment(date).format('DD/MM/YYYY');
        },

        getStatusBadgeClass(status) {
            const classMap = {
                'Pending': 'badge badge-soft-warning',
                'In Progress': 'badge badge-soft-info',
                'Completed': 'badge badge-soft-success',
                'Cancelled': 'badge badge-soft-danger'
            };
            return classMap[status] || 'badge badge-soft-secondary';
        },

        getPercentage(value, total) {
            if (total === 0) return '0';
            return ((value / total) * 100).toFixed(1);
        },

        toggleHeader() {
            const collapseBtn = document.getElementById('collapse-header');

            if (collapseBtn) {
                collapseBtn.classList.toggle('active');
                document.body.classList.toggle('header-collapse');
                this.isHeaderCollapsed = !this.isHeaderCollapsed;
            }
        },

    }
};
</script>

<style scoped>
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

/* Action Icons */
.action-icon a {
    color: #666;
    font-size: 16px;
    transition: color 0.2s;
}

.action-icon a:hover {
    color: #0067A5;
}

/* Ant Design Select Styling */
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

.statistics-row .col-lg-3 {
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

/* Ant Design Dropdown Fix */
:deep(.ant-picker-dropdown) {
    z-index: 9999 !important;
}

/* View details styling */
.view-details .form-label {
    color: #6c757d;
    font-size: 0.875rem;
    margin-bottom: 2px;
}

.view-details .form-control-plaintext {
    font-size: 0.95rem;
    padding: 0;
    margin-bottom: 0;
}
</style>

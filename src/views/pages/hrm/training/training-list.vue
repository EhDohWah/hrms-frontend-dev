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
                        v-if="isReadOnlyTraining" 
                        class="badge bg-warning text-dark ms-3 d-flex align-items-center"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="You have view-only access to this module"
                    >
                        <i class="ti ti-eye me-1"></i> Read Only
                    </span>
                </div>
                <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
                    <div v-if="canEditTraining" class="mb-2 me-2">
                        <button class="btn btn-primary d-flex align-items-center" @click="openAddTrainingModal">
                            <i class="ti ti-circle-plus me-2"></i>Add New Training
                        </button>
                    </div>
                    <div v-if="canEditTraining" class="mb-2 me-2">
                        <button class="btn btn-danger d-flex align-items-center" @click="confirmDeleteSelectedTrainings"
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

            <!-- Training Statistics -->
            <div class="row statistics-row">
                <!-- Total Trainings -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-primary rounded-circle"><i
                                            class="ti ti-notebook"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Total Trainings</p>
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
                <!-- /Total Trainings -->

                <!-- Upcoming -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-warning rounded-circle"><i
                                            class="ti ti-calendar-event"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Upcoming</p>
                                    <h4>{{ statistics.upcoming }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-warning badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ getPercentage(statistics.upcoming, statistics.total) }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Upcoming -->

                <!-- Ongoing -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-info rounded-circle"><i
                                            class="ti ti-presentation"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Ongoing</p>
                                    <h4>{{ statistics.ongoing }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-info badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ getPercentage(statistics.ongoing, statistics.total) }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Ongoing -->

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
            </div>
            <!-- /Training Statistics -->

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Training Programs</h5>
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                        <div class="me-2">
                            <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
                            <a-button @click="clearAll">Clear filters and sorters</a-button>
                        </div>
                        <div class="input-icon-end">
                            <a-input-search v-model:value="searchText" placeholder="Search trainings..."
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
                        <p class="mt-2">Loading trainings...</p>
                    </div>
                    <div v-else class="resize-observer-fix">
                        <!-- TABLE WITHOUT PAGINATION -->
                        <a-table :columns="columns" :data-source="tableData" :pagination="false"
                            :scroll="{ x: 1000, y: 'max-content' }" row-key="id" @change="handleTableChange"
                            :row-selection="rowSelection">
                            <!-- Custom cell rendering -->
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'action'">
                                    <div class="action-icon d-inline-flex">
                                        <!-- View Training -->
                                        <a href="javascript:void(0);" @click="viewTraining(record)" class="me-2">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                        <!-- Edit Training -->
                                        <a href="javascript:void(0);" @click="editTraining(record)" class="me-2">
                                            <i class="ti ti-edit"></i>
                                        </a>
                                        <!-- Delete Training -->
                                        <a href="javascript:void(0);" @click="confirmDeleteTraining(record.id)">
                                            <i class="ti ti-trash"></i>
                                        </a>
                                    </div>
                                </template>

                                <!-- Training Title column -->
                                <template v-if="column.key === 'title'">
                                    <div>
                                        <strong>{{ record.title }}</strong>
                                    </div>
                                </template>

                                <!-- Date Range column -->
                                <template v-if="column.key === 'date_range'">
                                    <div>
                                        <div><strong>Start:</strong> {{ formatDate(record.start_date) }}</div>
                                        <div><strong>End:</strong> {{ formatDate(record.end_date) }}</div>
                                    </div>
                                </template>

                                <!-- Duration column -->
                                <template v-if="column.key === 'duration'">
                                    <span class="badge badge-soft-primary">{{ calculateDuration(record.start_date,
                                        record.end_date) }}</span>
                                </template>

                                <!-- Status badge -->
                                <template v-if="column.key === 'status'">
                                    <span :class="getStatusBadgeClass(record)">{{ getTrainingStatus(record) }}</span>
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
    </div>

    <!-- Training Modal -->
    <training-modal ref="trainingModal" @training-added="handleTrainingAdded"
        @training-updated="handleTrainingUpdated" />

    <!-- View Training Modal -->
    <div class="modal fade" id="view_training_modal" tabindex="-1" aria-labelledby="viewTrainingModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="viewTrainingModalLabel">Training Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-if="viewingTraining">
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label fw-medium">Training Title</label>
                            <p class="form-control-plaintext">{{ viewingTraining.title }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Organizer</label>
                            <p class="form-control-plaintext">{{ viewingTraining.organizer }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Status</label>
                            <p class="form-control-plaintext">
                                <span :class="getStatusBadgeClass(viewingTraining)">{{
                                    getTrainingStatus(viewingTraining)
                                    }}</span>
                            </p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Start Date</label>
                            <p class="form-control-plaintext">{{ formatDate(viewingTraining.start_date) }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">End Date</label>
                            <p class="form-control-plaintext">{{ formatDate(viewingTraining.end_date) }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Duration</label>
                            <p class="form-control-plaintext">{{ calculateDuration(viewingTraining.start_date,
                                viewingTraining.end_date) }}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium">Created By</label>
                            <p class="form-control-plaintext">{{ viewingTraining.created_by }}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap'; // ✅ Selective import
import { useTrainingStore } from '@/stores/trainingStore';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import TrainingModal from '@/components/modal/training-modal.vue';
import { message } from 'ant-design-vue';
import { usePermissions } from '@/composables/usePermissions';

export default {
    name: 'TrainingList',
    components: {
        indexBreadcrumb,
        TrainingModal
    },
    setup() {
        // Initialize permission checks for training module
        const { 
            canRead, 
            canEdit, 
            isReadOnly, 
            accessLevelText, 
            accessLevelBadgeClass 
        } = usePermissions('training');

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
            title: 'Training Management',
            text: 'Training',
            text1: 'Training List',

            // Data
            trainingStore: useTrainingStore(),
            viewingTraining: null,
            viewModalInstance: null,

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
                    title: 'Training Title',
                    dataIndex: 'title',
                    key: 'title',
                    sorter: true,
                    width: 250
                },
                {
                    title: 'Organizer',
                    dataIndex: 'organizer',
                    key: 'organizer',
                    sorter: true,
                    filters: [],
                    width: 180
                },
                {
                    title: 'Date Range',
                    key: 'date_range',
                    sorter: false,
                    width: 200
                },
                {
                    title: 'Duration',
                    key: 'duration',
                    width: 120
                },
                {
                    title: 'Status',
                    key: 'status',
                    width: 120
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
        // Permission checks - primary source for reactivity
        canEditTraining() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasEdit = Array.isArray(permissions) && permissions.includes('training.edit');
                return hasEdit || (this.canEdit?.value ?? false);
            } catch (e) {
                console.error('[TrainingList] Error checking permissions:', e);
                return this.canEdit?.value ?? false;
            }
        },
        canReadTraining() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasRead = Array.isArray(permissions) && permissions.includes('training.read');
                return hasRead || (this.canRead?.value ?? false);
            } catch (e) {
                return this.canRead?.value ?? false;
            }
        },
        isReadOnlyTraining() {
            return this.canReadTraining && !this.canEditTraining;
        },
        tableData() {
            return this.trainingStore.trainings;
        },

        loading() {
            return this.trainingStore.loading;
        },

        currentPage: {
            get() {
                return this.trainingStore.currentPage;
            },
            set(value) {
                this.trainingStore.currentPage = value;
            }
        },

        pageSize: {
            get() {
                return this.trainingStore.pageSize;
            },
            set(value) {
                this.trainingStore.pageSize = value;
            }
        },

        total() {
            return this.trainingStore.total;
        },

        statistics() {
            return this.trainingStore.statistics;
        },

        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onSelectChange
            };
        }
    },

    async mounted() {
        await this.fetchTrainings();
        this.updateOrganizerFilters();
    },

    methods: {
        async fetchTrainings(params = {}) {
            try {
                await this.trainingStore.fetchTrainings(params);
                this.updateOrganizerFilters();
            } catch (error) {
                console.error('Error fetching trainings:', error);
                message.error('Failed to load trainings');
            }
        },

        async handleSearch() {
            this.searchLoading = true;
            try {
                await this.trainingStore.searchTrainings(this.searchText);
            } catch (error) {
                console.error('Search error:', error);
                message.error(error.message || 'Search failed');
            } finally {
                this.searchLoading = false;
            }
        },

        handleTableChange(pagination, filters, sorter) {
            // Update filters in store
            if (filters.organizer) {
                this.trainingStore.updateFilters({ organizer: filters.organizer });
            }

            // Update sorting
            this.trainingStore.updateSorting(sorter);

            // Fetch with new params
            const params = this.trainingStore.buildApiParams();
            this.fetchTrainings(params);
        },

        handlePaginationChange(page, pageSize) {
            this.currentPage = page;
            this.pageSize = pageSize;
            const params = this.trainingStore.buildApiParams();
            this.fetchTrainings(params);
        },

        handleSizeChange(current, size) {
            this.currentPage = 1;
            this.pageSize = size;
            const params = this.trainingStore.buildApiParams();
            this.fetchTrainings(params);
        },

        clearFilters() {
            this.trainingStore.clearFilters();
            this.searchText = '';
            this.fetchTrainings();
        },

        clearAll() {
            this.trainingStore.clearAll();
            this.searchText = '';
            this.selectedRowKeys = [];
            this.fetchTrainings();
        },

        openAddTrainingModal() {
            this.$refs.trainingModal.openAddTrainingModal();
        },

        editTraining(record) {
            this.$refs.trainingModal.openEditTrainingModal(record);
        },

        viewTraining(record) {
            this.viewingTraining = record;
            this.viewModalInstance = new Modal(document.getElementById('view_training_modal'));
            this.viewModalInstance.show();
        },

        async confirmDeleteTraining(id) {
            // Use Ant Design Modal.confirm instead of SweetAlert
            this.$confirm({
                title: 'Are you sure?',
                content: 'This will delete the training program and all associated employee training records.',
                okText: 'Yes, delete it!',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        await this.trainingStore.deleteTraining(id);
                        message.success('Training deleted successfully');
                        await this.fetchTrainings();
                    } catch (error) {
                        message.error('Failed to delete training');
                    }
                }
            });
        },

        async confirmDeleteSelectedTrainings() {
            if (this.selectedRowKeys.length === 0) {
                return;
            }

            // Use Ant Design Modal.confirm instead of SweetAlert
            this.$confirm({
                title: 'Are you sure?',
                content: `This will delete ${this.selectedRowKeys.length} training program(s) and all associated records.`,
                okText: 'Yes, delete them!',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        await this.trainingStore.deleteSelectedTrainings(this.selectedRowKeys);
                        this.selectedRowKeys = [];
                        message.success('Selected trainings deleted successfully');
                        await this.fetchTrainings();
                    } catch (error) {
                        message.error('Failed to delete selected trainings');
                    }
                }
            });
        },

        async handleTrainingAdded() {
            await this.fetchTrainings();
            message.success('Training added successfully');
        },

        async handleTrainingUpdated() {
            await this.fetchTrainings();
            message.success('Training updated successfully');
        },

        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },

        updateOrganizerFilters() {
            const organizers = [...new Set(this.tableData.map(t => t.organizer).filter(o => o && o !== 'N/A'))];
            const organizerFilters = organizers.map(organizer => ({ text: organizer, value: organizer }));

            const organizerColumn = this.columns.find(col => col.key === 'organizer');
            if (organizerColumn) {
                organizerColumn.filters = organizerFilters;
            }
        },

        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        },

        calculateDuration(startDate, endDate) {
            if (!startDate || !endDate) return 'N/A';
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            return `${days} ${days === 1 ? 'day' : 'days'}`;
        },

        getTrainingStatus(record) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (record.start_date && record.end_date) {
                const startDate = new Date(record.start_date);
                const endDate = new Date(record.end_date);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);

                if (today < startDate) {
                    return 'Upcoming';
                } else if (today >= startDate && today <= endDate) {
                    return 'Ongoing';
                } else {
                    return 'Completed';
                }
            }
            return 'N/A';
        },

        getStatusBadgeClass(record) {
            const status = this.getTrainingStatus(record);
            const classMap = {
                'Upcoming': 'badge badge-soft-warning',
                'Ongoing': 'badge badge-soft-info',
                'Completed': 'badge badge-soft-success',
                'N/A': 'badge badge-soft-secondary'
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
/* Primary color styling for search input button - following LEAVES_ADMIN_STYLING_FIX.md */
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

/* Action Icons - simplified styling from reference implementations */
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
</style>

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
                                <i class="ti ti-settings me-1"></i>Actions
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="bulkRestore"
                                        :class="{ 'disabled': selectedRowKeys.length === 0 }">
                                        <i class="ti ti-refresh me-1"></i>Bulk Restore ({{ selectedRowKeys.length }})
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="refreshData">
                                        <i class="ti ti-refresh me-1"></i>Refresh Data
                                    </a>
                                </li>
                            </ul>
                        </div>
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

            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="dash-widget-header">
                                <span class="dash-widget-icon text-primary border-primary">
                                    <i class="ti ti-trash"></i>
                                </span>
                                <div class="dash-count">
                                    <h3>{{ totalCount || 0 }}</h3>
                                    <div class="dash-counts">
                                        <p>Total Deleted Records</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="dash-widget-header">
                                <span class="dash-widget-icon text-warning border-warning">
                                    <i class="ti ti-calendar"></i>
                                </span>
                                <div class="dash-count">
                                    <h3>{{ stats?.this_week || 0 }}</h3>
                                    <div class="dash-counts">
                                        <p>Deleted This Week</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="dash-widget-header">
                                <span class="dash-widget-icon text-success border-success">
                                    <i class="ti ti-refresh"></i>
                                </span>
                                <div class="dash-count">
                                    <h3>{{ stats?.restored_this_month || 0 }}</h3>
                                    <div class="dash-counts">
                                        <p>Restored This Month</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="dash-widget-header">
                                <span class="dash-widget-icon text-danger border-danger">
                                    <i class="ti ti-clock"></i>
                                </span>
                                <div class="dash-count">
                                    <h3>{{ stats?.older_than_30_days || 0 }}</h3>
                                    <div class="dash-counts">
                                        <p>Older Than 30 Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recycle Bin List -->
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Deleted Records ({{ totalCount || 0 }})</h5>
                    <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                        <div class="ms-3">
                            <a-button @click="clearFilters">Clear filters</a-button>
                            <a-button @click="clearAll" class="ms-2">Clear filters and sorters</a-button>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="custom-datatable-filter table-responsive">
                        <div v-if="loading" class="text-center my-3">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Loading deleted records...</p>
                        </div>

                        <a-table v-else class="table datatable thead-light" :columns="columns" :data-source="data"
                            :row-selection="rowSelection" @change="handleChange" :pagination="{
                                total: totalCount,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                            }">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'deleted_record_id'">
                                    <span class="fw-medium">#{{ record.deleted_record_id }}</span>
                                </template>
                                <template v-if="column.key === 'ModelType'">
                                    <a-tag :color="getModelTypeColor(record.model_type)">
                                        {{ record.model_type }}
                                    </a-tag>
                                </template>
                                <template v-if="column.key === 'OriginalId'">
                                    <span class="fw-medium">{{ record.original_id }}</span>
                                </template>
                                <template v-if="column.key === 'PrimaryInfo'">
                                    <div>
                                        <div class="fw-medium">{{ record.primary_info }}</div>
                                        <small class="text-muted">Key: {{ record.restoration_key }}</small>
                                    </div>
                                </template>
                                <template v-if="column.key === 'DeletedAt'">
                                    <div>
                                        <div class="fw-medium">{{ formatDate(record.deleted_at) }}</div>
                                        <small class="text-muted">{{ record.deleted_ago }}</small>
                                    </div>
                                </template>
                                <template v-if="column.key === 'ModelDetails'">
                                    <a-button type="link" size="small" @click="showDetails(record)"
                                        title="View Details">
                                        <i class="ti ti-eye me-1"></i>Details
                                    </a-button>
                                </template>
                                <template v-if="column.key === 'action'">
                                    <div class="action-icon d-inline-flex">
                                        <a-dropdown>
                                            <template #overlay>
                                                <a-menu>
                                                    <a-menu-item @click="restoreByDeletedId(record)">
                                                        <i class="ti ti-refresh me-1"></i>Restore by Deleted ID
                                                    </a-menu-item>
                                                    <a-menu-item @click="restoreByModelAndId(record)">
                                                        <i class="ti ti-refresh me-1"></i>Restore by Model & ID
                                                    </a-menu-item>
                                                    <a-menu-divider />
                                                    <a-menu-item @click="confirmPermanentDelete(record)"
                                                        class="text-danger">
                                                        <i class="ti ti-trash-x me-1"></i>Delete Permanently
                                                    </a-menu-item>
                                                </a-menu>
                                            </template>
                                            <a-button type="primary" size="small">
                                                Actions <i class="ti ti-chevron-down"></i>
                                            </a-button>
                                        </a-dropdown>
                                    </div>
                                </template>
                            </template>
                        </a-table>
                    </div>
                </div>
            </div>
        </div>
        <layout-footer />
    </div>
    <!-- /Page Wrapper -->

    <!-- Details Modal -->
    <a-modal v-model:open="showDetailsModal" title="Record Details" :footer="null" width="900px">
        <div v-if="selectedRecord">
            <div class="row mb-3">
                <div class="col-md-4">
                    <strong>Record Type:</strong> {{ selectedRecord.model_type }}
                </div>
                <div class="col-md-4">
                    <strong>Original ID:</strong> {{ selectedRecord.original_id }}
                </div>
                <div class="col-md-4">
                    <strong>Deleted Record ID:</strong> {{ selectedRecord.deleted_record_id }}
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <strong>Deleted:</strong> {{ formatDate(selectedRecord.deleted_at) }}
                </div>
                <div class="col-md-6">
                    <strong>Deleted Ago:</strong> {{ selectedRecord.deleted_ago }}
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <strong>Primary Info:</strong> {{ selectedRecord.primary_info }}
                </div>
                <div class="col-md-6">
                    <strong>Restoration Key:</strong> {{ selectedRecord.restoration_key }}
                </div>
            </div>
            <div class="mb-3">
                <strong>Model Class:</strong>
                <code>{{ selectedRecord.model_class }}</code>
            </div>

            <h6>Original Data:</h6>
            <div class="bg-light p-3 rounded">
                <pre>{{ JSON.stringify(selectedRecord.data, null, 2) }}</pre>
            </div>
        </div>
    </a-modal>

    <!-- Restore Confirmation Modals -->
    <a-modal v-model:open="showRestoreModal" :title="restoreModalTitle" @ok="confirmRestore" ok-text="Restore"
        cancel-text="Cancel">
        <p>{{ restoreModalMessage }}</p>
        <div v-if="selectedRecord" class="alert alert-info">
            <strong>Type:</strong> {{ selectedRecord.model_type }}<br>
            <strong>Original ID:</strong> {{ selectedRecord.original_id }}<br>
            <strong>Info:</strong> {{ selectedRecord.primary_info }}<br>
            <strong>Method:</strong> {{ restoreMethod }}
        </div>
    </a-modal>

    <a-modal v-model:open="showDeleteModal" title="Confirm Permanent Deletion" @ok="confirmDelete"
        ok-text="Delete Permanently" cancel-text="Cancel" ok-type="danger">
        <p class="text-danger">
            <strong>Warning:</strong> This action cannot be undone. Are you sure you want to permanently delete this
            record?
        </p>
        <div v-if="selectedRecord" class="alert alert-warning">
            <strong>Type:</strong> {{ selectedRecord.model_type }}<br>
            <strong>Original ID:</strong> {{ selectedRecord.original_id }}<br>
            <strong>Info:</strong> {{ selectedRecord.primary_info }}
        </div>
    </a-modal>

    <a-modal v-model:open="showBulkRestoreModal" title="Confirm Bulk Restore" @ok="confirmBulkRestore"
        ok-text="Restore Selected" cancel-text="Cancel">
        <p>Are you sure you want to restore {{ selectedRowKeys.length }} selected record(s)?</p>
        <div class="alert alert-info">
            <strong>Note:</strong> Records will be restored using their deleted_record_id for faster processing.
        </div>
    </a-modal>
</template>

<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import moment from "moment";
import { recycleBinService } from "@/services/recycle-bin.service";
import { message } from 'ant-design-vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';

export default {
    components: {
        indexBreadcrumb
    },
    data() {
        return {
            title: "Recycle Bin",
            text: "Administration",
            text1: "Recycle Bin",
            data: [],
            totalCount: 0,
            stats: null,
            filteredInfo: null,
            sortedInfo: null,
            loading: false,
            selectedRowKeys: [],
            selectedRecord: null,
            showRestoreModal: false,
            showDeleteModal: false,
            showBulkRestoreModal: false,
            showDetailsModal: false,
            restoreMethod: '',
            restoreModalTitle: '',
            restoreModalMessage: '',
        };
    },
    computed: {
        columns() {
            const { filteredInfo, sortedInfo } = this;
            const filtered = filteredInfo || {};
            const sorted = sortedInfo || {};

            return [
                {
                    title: "ID",
                    dataIndex: "deleted_record_id",
                    key: "deleted_record_id",
                    width: 80,
                    sorter: {
                        compare: (a, b) => a.deleted_record_id - b.deleted_record_id,
                    },
                    sortOrder: sorted.columnKey === "deleted_record_id" && sorted.order,
                },
                {
                    title: "Type",
                    dataIndex: "model_type",
                    key: "ModelType",
                    width: 120,
                    filters: this.getModelTypeFilters(),
                    filteredValue: filtered.ModelType || null,
                    filterSearch: true,
                    onFilter: (value, record) => record.model_type.includes(value),
                    sorter: {
                        compare: (a, b) => {
                            a = a.model_type.toLowerCase();
                            b = b.model_type.toLowerCase();
                            return a > b ? -1 : b > a ? 1 : 0;
                        },
                    },
                    sortOrder: sorted.columnKey === "ModelType" && sorted.order,
                },
                {
                    title: "Original ID",
                    dataIndex: "original_id",
                    key: "OriginalId",
                    width: 100,
                    sorter: {
                        compare: (a, b) => a.original_id - b.original_id,
                    },
                    sortOrder: sorted.columnKey === "OriginalId" && sorted.order,
                },
                {
                    title: "Record Info",
                    dataIndex: "primary_info",
                    key: "PrimaryInfo",
                    sorter: {
                        compare: (a, b) => {
                            const infoA = a.primary_info || '';
                            const infoB = b.primary_info || '';
                            return infoA.toLowerCase() > infoB.toLowerCase() ? -1 : infoB.toLowerCase() > infoA.toLowerCase() ? 1 : 0;
                        },
                    },
                    sortOrder: sorted.columnKey === "PrimaryInfo" && sorted.order,
                },
                {
                    title: "Deleted At",
                    dataIndex: "deleted_at",
                    key: "DeletedAt",
                    width: 180,
                    sorter: {
                        compare: (a, b) => {
                            return moment(a.deleted_at).unix() - moment(b.deleted_at).unix();
                        },
                    },
                    sortOrder: sorted.columnKey === "DeletedAt" && sorted.order,
                },
                {
                    title: "Details",
                    key: "ModelDetails",
                    width: 100,
                    sorter: false,
                },
                {
                    title: "Actions",
                    key: "action",
                    width: 120,
                    sorter: false,
                },
            ];
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys;
                },
                getCheckboxProps: (record) => ({
                    name: record.deleted_record_id,
                }),
            };
        },
    },
    async mounted() {
        await this.fetchData();
    },
    methods: {
        async fetchData() {
            this.loading = true;
            try {
                await Promise.all([
                    this.fetchDeletedRecords(),
                    this.fetchStats()
                ]);
            } catch (error) {
                console.error('Error loading recycle bin data:', error);
                message.error('Failed to load recycle bin data');
            } finally {
                this.loading = false;
            }
        },

        async fetchDeletedRecords() {
            try {
                const response = await recycleBinService.getAllDeletedRecords();
                if (response.success) {
                    this.data = response.data || [];
                    this.totalCount = response.total_count || 0;
                } else {
                    throw new Error('Failed to fetch deleted records');
                }
            } catch (error) {
                console.error('Error fetching deleted records:', error);
                throw error;
            }
        },

        async fetchStats() {
            try {
                const response = await recycleBinService.getRecycleBinStats();
                if (response.success) {
                    this.stats = response.data || {};
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                // Don't throw here as stats are not critical
            }
        },

        async refreshData() {
            await this.fetchData();
            message.success('Data refreshed successfully');
        },

        showDetails(record) {
            this.selectedRecord = record;
            this.showDetailsModal = true;
        },

        // Method 1: Restore by deleted_record_id (recommended for bulk operations)
        restoreByDeletedId(record) {
            this.selectedRecord = record;
            this.restoreMethod = 'By Deleted Record ID';
            this.restoreModalTitle = 'Restore Record (Method 1)';
            this.restoreModalMessage = 'This will restore the record using its deleted_record_id. This is the fastest method.';
            this.showRestoreModal = true;
        },

        // Method 2: Restore by model_class and original_id (dynamic method)
        restoreByModelAndId(record) {
            this.selectedRecord = record;
            this.restoreMethod = 'By Model Class & Original ID';
            this.restoreModalTitle = 'Restore Record (Method 2)';
            this.restoreModalMessage = 'This will restore the record using its model class and original ID. This is the dynamic method.';
            this.showRestoreModal = true;
        },

        async confirmRestore() {
            if (!this.selectedRecord) return;

            try {
                let restoreData;

                if (this.restoreMethod === 'By Deleted Record ID') {
                    // Method 1: Use deleted_record_id
                    restoreData = {
                        deleted_record_id: this.selectedRecord.deleted_record_id
                    };
                } else {
                    // Method 2: Use model_class and original_id
                    restoreData = {
                        model_class: this.selectedRecord.model_class,
                        original_id: this.selectedRecord.original_id

                        
                    };
                }

                const response = await recycleBinService.restoreRecord(restoreData);

                if (response.success) {
                    message.success(`Record restored successfully using ${this.restoreMethod}`);
                    this.showRestoreModal = false;
                    this.selectedRecord = null;
                    await this.fetchData();
                } else {
                    throw new Error(response.message || 'Restore failed');
                }
            } catch (error) {
                console.error('Error restoring record:', error);
                message.error(error.response?.data?.message || 'Failed to restore record');
            }
        },

        confirmPermanentDelete(record) {
            this.selectedRecord = record;
            this.showDeleteModal = true;
        },

        async confirmDelete() {
            if (!this.selectedRecord) return;

            try {
                const response = await recycleBinService.permanentlyDeleteRecord(this.selectedRecord.deleted_record_id);

                if (response.success !== false) {
                    message.success('Record permanently deleted');
                    this.showDeleteModal = false;
                    this.selectedRecord = null;
                    await this.fetchData();
                } else {
                    throw new Error(response.message || 'Delete failed');
                }
            } catch (error) {
                console.error('Error deleting record:', error);
                message.error(error.response?.data?.message || 'Failed to delete record permanently');
            }
        },

        bulkRestore() {
            if (this.selectedRowKeys.length === 0) {
                message.warning('Please select records to restore');
                return;
            }
            this.showBulkRestoreModal = true;
        },

        async confirmBulkRestore() {
            try {
                const selectedRecords = this.data.filter(record =>
                    this.selectedRowKeys.includes(record.deleted_record_id)
                );

                const restoreData = {
                    records: selectedRecords.map(record => ({
                        deleted_record_id: record.deleted_record_id
                    }))
                };

                const response = await recycleBinService.bulkRestoreRecords(restoreData);

                if (response.success) {
                    const successCount = response.results?.filter(r => r.success).length || this.selectedRowKeys.length;
                    message.success(`${successCount} record(s) restored successfully`);

                    if (response.results?.some(r => !r.success)) {
                        const failedCount = response.results.filter(r => !r.success).length;
                        message.warning(`${failedCount} record(s) failed to restore`);
                    }
                } else {
                    throw new Error(response.message || 'Bulk restore failed');
                }

                this.showBulkRestoreModal = false;
                this.selectedRowKeys = [];
                await this.fetchData();
            } catch (error) {
                console.error('Error bulk restoring records:', error);
                message.error(error.response?.data?.message || 'Failed to restore selected records');
            }
        },

        getModelTypeColor(modelType) {
            const colors = {
                'User': 'blue',
                'Employee': 'green',
                'Grant': 'orange',
                'Interview': 'purple',
                'JobOffer': 'cyan',
                'Leave': 'pink',
                'Training': 'gold',
                'Department': 'lime',
                'Position': 'magenta',
                'BlogPost': 'geekblue',
            };

            return colors[modelType] || 'default';
        },

        formatDate(dateString) {
            return moment(dateString).format('DD MMM YYYY HH:mm');
        },

        toggleHeader() {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
        },

        handleChange(pagination, filters, sorter) {
            console.log("Various parameters", pagination, filters, sorter);
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

        getModelTypeFilters() {
            if (!this.data || this.data.length === 0) {
                return [];
            }
            const types = [...new Set(this.data.map(item => item.model_type))];
            return types.map(type => ({ text: type, value: type }));
        },
    },
};
</script>

<style scoped>
.dash-widget-header {
    display: flex;
    align-items: center;
}

.dash-widget-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    border: 2px solid;
}

.dash-count h3 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
}

.dash-counts p {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
}

.disabled {
    opacity: 0.6;
    pointer-events: none;
}

pre {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 4px;
    max-height: 300px;
    overflow-y: auto;
    font-size: 12px;
}

.ant-tag {
    margin-bottom: 4px;
}

:deep(.ant-select-selector) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    min-width: 80px;
}
</style>
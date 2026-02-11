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
                    <!-- Actions Dropdown - Only visible if user can edit -->
                    <div v-if="canEdit" class="me-2 mb-2">
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
                    <!-- Refresh Button - Always visible -->
                    <div v-else class="me-2 mb-2">
                        <button class="btn btn-white d-inline-flex align-items-center" @click="refreshData">
                            <i class="ti ti-refresh me-1"></i>Refresh Data
                        </button>
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
                                    <h3>{{ stats?.total_deleted || 0 }}</h3>
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
                                <span class="dash-widget-icon text-info border-info">
                                    <i class="ti ti-archive"></i>
                                </span>
                                <div class="dash-count">
                                    <h3>{{ stats?.soft_deleted_count || 0 }}</h3>
                                    <div class="dash-counts">
                                        <p>Soft Deleted</p>
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
                                    <i class="ti ti-file"></i>
                                </span>
                                <div class="dash-count">
                                    <h3>{{ stats?.legacy_count || 0 }}</h3>
                                    <div class="dash-counts">
                                        <p>Legacy Deletions</p>
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
                                    <h3>90</h3>
                                    <div class="dash-counts">
                                        <p>Day Retention Period</p>
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
                            :row-selection="canEdit ? rowSelection : null" @change="handleChange" :pagination="{
                                total: totalCount,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                            }">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'ModelType'">
                                    <a-tag :color="getModelTypeColor(record.model_type)">
                                        {{ record.model_type }}
                                    </a-tag>
                                    <a-tag v-if="record.type === 'soft_delete'" color="blue" class="ms-1" style="font-size: 10px;">
                                        SOFT DELETE
                                    </a-tag>
                                    <a-tag v-else color="default" class="ms-1" style="font-size: 10px;">
                                        LEGACY
                                    </a-tag>
                                </template>
                                <template v-if="column.key === 'DisplayName'">
                                    <div>
                                        <div class="fw-medium">{{ record.display_name }}</div>
                                        <small class="text-muted">ID: {{ record.original_id }}</small>
                                    </div>
                                </template>
                                <template v-if="column.key === 'DeletedAt'">
                                    <div>
                                        <div class="fw-medium">{{ formatDate(record.deleted_at) }}</div>
                                        <small class="text-muted">{{ record.deleted_ago }}</small>
                                    </div>
                                </template>
                                <template v-if="column.key === 'action'">
                                    <div class="action-icon d-inline-flex">
                                        <a-dropdown>
                                            <template #overlay>
                                                <a-menu>
                                                    <!-- View Details - Always visible -->
                                                    <a-menu-item @click="showDetails(record)">
                                                        <i class="ti ti-eye me-1"></i>View Details
                                                    </a-menu-item>
                                                    <!-- Restore/Delete actions - Only visible if user can edit -->
                                                    <template v-if="canEdit">
                                                        <a-menu-divider />
                                                        <a-menu-item @click="initiateRestore(record)">
                                                            <i class="ti ti-refresh me-1"></i>Restore
                                                        </a-menu-item>
                                                        <a-menu-divider />
                                                        <a-menu-item @click="confirmPermanentDelete(record)"
                                                            class="text-danger">
                                                            <i class="ti ti-trash-x me-1"></i>Delete Permanently
                                                        </a-menu-item>
                                                    </template>
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
    <a-modal v-model:open="showDetailsModal" title="Record Details" :footer="null" width="700px" :destroyOnClose="true">
        <div v-if="selectedRecord">
            <div class="row mb-3">
                <div class="col-md-4">
                    <strong>Record Type:</strong>
                    <a-tag :color="getModelTypeColor(selectedRecord.model_type)">{{ selectedRecord.model_type }}</a-tag>
                    <a-tag v-if="selectedRecord.type === 'soft_delete'" color="blue">SOFT DELETE</a-tag>
                    <a-tag v-else color="default">LEGACY</a-tag>
                </div>
                <div class="col-md-4">
                    <strong>Original ID:</strong> {{ selectedRecord.original_id }}
                </div>
                <div class="col-md-4">
                    <strong>Display Name:</strong> {{ selectedRecord.display_name }}
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
            <div class="row mb-3" v-if="selectedRecord.type === 'legacy'">
                <div class="col-md-6">
                    <strong>Deleted Record ID:</strong> #{{ selectedRecord.deleted_record_id }}
                </div>
                <div class="col-md-6">
                    <strong>Model Class:</strong>
                    <code>{{ selectedRecord.model_class }}</code>
                </div>
            </div>
            <div v-if="selectedRecord.type === 'soft_delete'" class="alert alert-info mb-0">
                <i class="ti ti-info-circle me-1"></i>
                This record was soft-deleted and can be restored to its original state.
                Related child records (if any) will remain intact upon restoration.
            </div>
        </div>
    </a-modal>

    <!-- Restore Confirmation Modal -->
    <a-modal v-model:open="showRestoreModal" title="Restore Record" @ok="confirmRestore" ok-text="Restore"
        cancel-text="Cancel" :confirm-loading="restoring" :destroyOnClose="true"
        :ok-button-props="{ disabled: !!restoreError }">
        <div v-if="selectedRecord">
            <p>Are you sure you want to restore this record?</p>
            <div class="alert alert-info mb-2">
                <div class="d-flex align-items-center mb-2">
                    <a-tag :color="getModelTypeColor(selectedRecord.model_type)" class="me-2">{{ selectedRecord.model_type }}</a-tag>
                    <span class="fw-medium">{{ selectedRecord.display_name }}</span>
                </div>
                <small class="text-muted">Original ID: {{ selectedRecord.original_id }}</small>
            </div>
            <!-- Inline error display when restore fails -->
            <div v-if="restoreError" class="alert alert-danger mb-0">
                <div class="d-flex align-items-start">
                    <i class="ti ti-alert-circle me-2 mt-1"></i>
                    <div>
                        <strong>Restoration failed</strong>
                        <p class="mb-0 mt-1" style="font-size: 13px;">{{ restoreError }}</p>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>

    <!-- Permanent Delete Confirmation Modal -->
    <a-modal v-model:open="showDeleteModal" title="Confirm Permanent Deletion" @ok="confirmDelete"
        ok-text="Delete Permanently" cancel-text="Cancel" ok-type="danger" :confirm-loading="deleting" :destroyOnClose="true">
        <p class="text-danger">
            <strong>Warning:</strong> This action cannot be undone. The record will be permanently removed.
        </p>
        <div v-if="selectedRecord" class="alert alert-warning">
            <strong>Type:</strong> {{ selectedRecord.model_type }}<br>
            <strong>Name:</strong> {{ selectedRecord.display_name }}<br>
            <strong>Original ID:</strong> {{ selectedRecord.original_id }}
        </div>
    </a-modal>

    <!-- Bulk Restore Confirmation Modal -->
    <a-modal v-model:open="showBulkRestoreModal" title="Confirm Bulk Restore" @ok="confirmBulkRestore"
        ok-text="Restore Selected" cancel-text="Cancel" :confirm-loading="restoring" :destroyOnClose="true">
        <p>Are you sure you want to restore {{ selectedRowKeys.length }} selected record(s)?</p>
        <div class="alert alert-info">
            <i class="ti ti-info-circle me-1"></i>
            Selected records will be restored to their original state.
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
import { usePermissions } from '@/composables/usePermissions';

export default {
  setup() {
    const {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    } = usePermissions('recycle_bin_list');

    return {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    };
  },
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
            restoring: false,
            deleting: false,
            restoreError: null,
            selectedRowKeys: [],
            selectedRecord: null,
            showRestoreModal: false,
            showDeleteModal: false,
            showBulkRestoreModal: false,
            showDetailsModal: false,
        };
    },
    computed: {
        columns() {
            const { filteredInfo, sortedInfo } = this;
            const filtered = filteredInfo || {};
            const sorted = sortedInfo || {};

            return [
                {
                    title: "Type",
                    dataIndex: "model_type",
                    key: "ModelType",
                    width: 200,
                    filters: this.getModelTypeFilters(),
                    filteredValue: filtered.ModelType || null,
                    filterSearch: true,
                    onFilter: (value, record) => record.model_type === value,
                    sorter: {
                        compare: (a, b) => a.model_type.localeCompare(b.model_type),
                    },
                    sortOrder: sorted.columnKey === "ModelType" && sorted.order,
                },
                {
                    title: "Record Info",
                    key: "DisplayName",
                    sorter: {
                        compare: (a, b) => (a.display_name || '').localeCompare(b.display_name || ''),
                    },
                    sortOrder: sorted.columnKey === "DisplayName" && sorted.order,
                },
                {
                    title: "Deleted At",
                    dataIndex: "deleted_at",
                    key: "DeletedAt",
                    width: 180,
                    sorter: {
                        compare: (a, b) => moment(a.deleted_at).unix() - moment(b.deleted_at).unix(),
                    },
                    sortOrder: sorted.columnKey === "DeletedAt" && sorted.order,
                    defaultSortOrder: 'descend',
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
                onChange: (selectedRowKeys) => {
                    this.selectedRowKeys = selectedRowKeys;
                },
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
                    // Add a unique 'key' field for Ant Design table row selection
                    this.data = (response.data || []).map(record => ({
                        ...record,
                        key: record.type === 'soft_delete'
                            ? `${record.model_type}_${record.original_id}`
                            : `legacy_${record.deleted_record_id}`,
                    }));
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
                    this.stats = response.stats || {};
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
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

        initiateRestore(record) {
            this.selectedRecord = record;
            this.restoreError = null;
            this.showRestoreModal = true;
        },

        // Execute restore - routes to correct service method based on type
        async confirmRestore() {
            if (!this.selectedRecord) return;

            this.restoring = true;
            this.restoreError = null;
            try {
                let response;

                if (this.selectedRecord.type === 'soft_delete') {
                    // Soft-delete restore (Employee, Grant, Department)
                    const modelType = this.selectedRecord.model_type.toLowerCase();
                    response = await recycleBinService.restore(modelType, this.selectedRecord.original_id);
                } else {
                    // Legacy restore (Interview, JobOffer)
                    response = await recycleBinService.restoreLegacy({
                        deleted_record_id: this.selectedRecord.deleted_record_id
                    });
                }

                if (response.success) {
                    message.success(`${this.selectedRecord.model_type} restored successfully`);
                    this.showRestoreModal = false;
                    this.selectedRecord = null;
                    await this.fetchData();
                } else {
                    throw new Error(response.message || 'Restore failed');
                }
            } catch (error) {
                console.error('Error restoring record:', error);
                this.restoreError = error.response?.data?.message || error.message || 'Failed to restore record';
            } finally {
                this.restoring = false;
            }
        },

        confirmPermanentDelete(record) {
            this.selectedRecord = record;
            this.showDeleteModal = true;
        },

        // Execute permanent delete - routes to correct service method based on type
        async confirmDelete() {
            if (!this.selectedRecord) return;

            this.deleting = true;
            try {
                let response;

                if (this.selectedRecord.type === 'soft_delete') {
                    // Soft-delete permanent delete
                    const modelType = this.selectedRecord.model_type.toLowerCase();
                    response = await recycleBinService.permanentDelete(modelType, this.selectedRecord.original_id);
                } else {
                    // Legacy permanent delete
                    response = await recycleBinService.permanentDeleteLegacy(this.selectedRecord.deleted_record_id);
                }

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
            } finally {
                this.deleting = false;
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
            this.restoring = true;
            try {
                // Separate selected records into soft-delete and legacy groups
                const selectedRecords = this.data.filter(record =>
                    this.selectedRowKeys.includes(record.key)
                );

                const softDeleteRecords = selectedRecords.filter(r => r.type === 'soft_delete');
                const legacyRecords = selectedRecords.filter(r => r.type === 'legacy');

                let totalSuccess = 0;
                let totalFailed = 0;

                // Restore soft-deleted records
                if (softDeleteRecords.length > 0) {
                    const items = softDeleteRecords.map(r => ({
                        model_type: r.model_type.toLowerCase(),
                        id: r.original_id
                    }));
                    const response = await recycleBinService.bulkRestore(items);
                    totalSuccess += response.succeeded?.length || 0;
                    totalFailed += response.failed?.length || 0;
                }

                // Restore legacy records
                if (legacyRecords.length > 0) {
                    const legacyResponse = await recycleBinService.bulkRestoreLegacy({
                        restore_requests: legacyRecords.map(r => ({
                            deleted_record_id: r.deleted_record_id
                        }))
                    });
                    const legacyResults = legacyResponse.results || [];
                    totalSuccess += legacyResults.filter(r => r.success).length;
                    totalFailed += legacyResults.filter(r => !r.success).length;
                }

                if (totalSuccess > 0) {
                    message.success(`${totalSuccess} record(s) restored successfully`);
                }
                if (totalFailed > 0) {
                    message.warning(`${totalFailed} record(s) failed to restore`);
                }

                this.showBulkRestoreModal = false;
                this.selectedRowKeys = [];
                await this.fetchData();
            } catch (error) {
                console.error('Error bulk restoring records:', error);
                message.error(error.response?.data?.message || 'Failed to restore selected records');
            } finally {
                this.restoring = false;
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
                'GrantItem': 'volcano',
            };

            return colors[modelType] || 'default';
        },

        formatDate(dateString) {
            return moment(dateString).format('DD/MM/YYYY HH:mm');
        },

        toggleHeader() {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
        },

        handleChange(pagination, filters, sorter) {
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

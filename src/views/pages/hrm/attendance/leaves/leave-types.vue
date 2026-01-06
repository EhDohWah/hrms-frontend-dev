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
                        v-if="isReadOnlyLeaveTypes" 
                        class="badge bg-warning text-dark ms-3 d-flex align-items-center"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="You have view-only access to this module"
                    >
                        <i class="ti ti-eye me-1"></i> Read Only
                    </span>
                </div>
                <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
                    <div class="mb-2 me-2">
                        <div class="dropdown">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                <i class="ti ti-file-export me-1"></i>Export
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="exportData('pdf')"><i class="ti ti-file-type-pdf me-1"></i>Export as
                                        PDF</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="exportData('excel')"><i class="ti ti-file-type-xls me-1"></i>Export as
                                        Excel</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div v-if="canEditLeaveTypes" class="mb-2 me-2">
                        <button class="btn btn-primary d-flex align-items-center" @click="openCreateModal">
                            <i class="ti ti-circle-plus me-2"></i>Add Leave Type
                        </button>
                    </div>
                    <div v-if="canEditLeaveTypes" class="mb-2 me-2">
                        <button class="btn btn-danger d-flex align-items-center" @click="confirmDeleteSelected"
                            :class="{ 'disabled': selectedRowKeys.length === 0 }">
                            <i class="ti ti-trash me-2"></i>Delete Selected
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

            <!-- Leave Types Statistics -->
            <div class="row statistics-row">
                <!-- Total Leave Types -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-primary rounded-circle"><i
                                            class="ti ti-calendar-event"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Total Leave Types</p>
                                    <h4>{{ statistics.totalLeaveTypes || 0 }}</h4>
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
                <!-- /Total Leave Types -->

                <!-- Active Leave Types -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-success rounded-circle"><i
                                            class="ti ti-check"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Active Types</p>
                                    <h4>{{ statistics.activeLeaveTypes || 0 }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-success badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ statistics.totalLeaveTypes > 0 ? Math.round((statistics.activeLeaveTypes /
                                        statistics.totalLeaveTypes) * 100) : 0 }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Active Leave Types -->

                <!-- Attachment Required -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-warning rounded-circle"><i
                                            class="ti ti-paperclip"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Require Attachment</p>
                                    <h4>{{ statistics.attachmentRequired || 0 }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-warning badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ statistics.totalLeaveTypes > 0 ? Math.round((statistics.attachmentRequired /
                                        statistics.totalLeaveTypes) * 100) : 0 }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Attachment Required -->

                <!-- Recently Added -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill statistics-card">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-info rounded-circle"><i
                                            class="ti ti-clock"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Recently Added</p>
                                    <h4>{{ statistics.recentlyAdded || 0 }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-info badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    This Month
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Recently Added -->
            </div>
            <!-- /Leave Types Statistics -->

            <!-- Leave Types List -->
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Leave Types</h5>
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                        <div class="me-2">
                            <a-button class="me-2" @click="clearFiltersLocal">Clear filters</a-button>
                            <a-button @click="clearAll">Clear filters and sorters</a-button>
                        </div>
                        <div class="input-icon-end">
                            <a-input-search v-model:value="searchQuery" placeholder="Search leave types..."
                                :loading="searchLoading" enter-button="Search" @search="handleSearch"
                                style="width: 250px;" class="search-input-primary" />
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="loading.leaveTypes" class="text-center my-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading leave types...</p>
                    </div>
                    <div v-else-if="!hasLeaveTypes" class="text-center py-5">
                        <div class="empty-state">
                            <i class="ti ti-calendar-x text-muted" style="font-size: 3rem;"></i>
                            <h5 class="mt-3 text-muted">No leave types found</h5>
                            <p class="text-muted">Start by creating a new leave type</p>
                            <button class="btn btn-primary mt-2" @click="openCreateModal">
                                <i class="ti ti-plus me-2"></i>Add Leave Type
                            </button>
                        </div>
                    </div>
                    <div v-else class="resize-observer-fix">
                        <!-- Ant Design Table -->
                        <a-table :columns="columns" :data-source="tableData" :pagination="false"
                            :scroll="{ x: 1200, y: 'max-content' }" row-key="id" @change="handleTableChange"
                            :row-selection="rowSelection" :loading="loading.leaveTypes">
                            <!-- Custom cell rendering -->
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'action'">
                                    <div class="action-icon d-inline-flex">
                                        <a href="javascript:void(0);" @click="editLeaveType(record)" class="me-2">
                                            <i class="ti ti-edit"></i>
                                        </a>
                                        <a href="javascript:void(0);" @click="confirmDeleteLeaveType(record.id)">
                                            <i class="ti ti-trash"></i>
                                        </a>
                                    </div>
                                </template>

                                <!-- Default Duration column -->
                                <template v-if="column.key === 'defaultDuration'">
                                    <span class="badge badge-soft-info">
                                        {{ record.defaultDuration || 'N/A' }} {{ record.defaultDuration ? 'days' : '' }}
                                    </span>
                                </template>

                                <!-- Requires Attachment column -->
                                <template v-if="column.key === 'requiresAttachment'">
                                    <span
                                        :class="['badge', record.requiresAttachment ? 'badge-soft-success' : 'badge-soft-secondary']">
                                        {{ record.requiresAttachment ? 'Yes' : 'No' }}
                                    </span>
                                </template>

                                <!-- Description column -->
                                <template v-if="column.key === 'description'">
                                    <span class="text-wrap" style="max-width: 200px;">
                                        {{ record.description || 'No description' }}
                                    </span>
                                </template>
                            </template>
                        </a-table>

                        <!-- Ant Design Pagination -->
                        <div class="pagination-wrapper">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="pagination-info">
                                    Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of {{
                                        paginationInfo.total }} entries
                                </div>
                                <a-pagination v-model:current="pagination.currentPage"
                                    v-model:page-size="pagination.perPage" :total="pagination.total"
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

    <!-- Add/Edit Leave Type Modal -->
    <LeaveTypeModal :show="showModal" :isEditing="isEditing" :leaveType="selectedLeaveType" @close="closeModal"
        @save="handleSave" />
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { Modal, Table, Modal as AntModal } from 'ant-design-vue';
import { Modal as BootstrapModal } from 'bootstrap';
import moment from 'moment';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import LeaveTypeModal from '@/components/modal/LeaveTypeModal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { leaveService } from '@/services/leave.service';
import { useToast } from '@/composables/useToast';
import { useLeaveStore } from '@/stores/leaveStore';
import { usePermissions } from '@/composables/usePermissions';

export default {
    name: 'LeaveTypes',
    components: {
        indexBreadcrumb,
        LeaveTypeModal,
        LayoutHeader,
        LayoutSidebar,
        LayoutFooter,
    },
    setup() {
        const { showToast } = useToast();
        const leaveStore = useLeaveStore();
        
        // Initialize permission checks for leave_types module
        const { 
            canRead, 
            canEdit, 
            isReadOnly, 
            accessLevelText, 
            accessLevelBadgeClass 
        } = usePermissions('leave_types');

        // Reactive data - Following employees-list pattern
        const searchQuery = ref('');
        const searchLoading = ref(false);
        const selectedRowKeys = ref([]);
        const filteredInfo = ref({});
        const sortedInfo = ref({});

        // Data properties (no store dependencies)
        const leaveTypes = ref([]);
        const loading = ref({
            leaveTypes: false
        });

        // SEPARATE PAGINATION PROPERTIES - Following employees-list pattern
        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(0);

        // Modal state
        const showModal = ref(false);
        const isEditing = ref(false);
        const selectedLeaveType = ref(null);

        // Statistics
        const statistics = ref({
            totalLeaveTypes: 0,
            activeLeaveTypes: 0,
            attachmentRequired: 0,
            recentlyAdded: 0
        });

        // Page data
        const title = ref("Leave Types");
        const text = ref("Leave Management");
        const text1 = ref("Leave Types");

        // Computed properties
        const hasLeaveTypes = computed(() => leaveTypes.value.length > 0);

        // Create pagination object for template compatibility
        const pagination = computed(() => ({
            currentPage: currentPage.value,
            perPage: pageSize.value,
            total: total.value
        }));

        // Pagination info computed property
        const paginationInfo = computed(() => {
            const totalItems = pagination.value?.total || 0;
            const current = pagination.value?.currentPage || 1;
            const size = pagination.value?.perPage || 10;

            if (totalItems === 0) {
                return {
                    from: 0,
                    to: 0,
                    total: 0
                };
            }

            const from = (current - 1) * size + 1;
            const to = Math.min(current * size, totalItems);

            return {
                from,
                to,
                total: totalItems
            };
        });

        // Computed properties
        const columns = computed(() => [
            {
                title: 'Leave Type Name',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                width: 200,
            },
            {
                title: 'Default Duration',
                key: 'defaultDuration',
                width: 150,
                sorter: true,
            },
            {
                title: 'Requires Attachment',
                key: 'requiresAttachment',
                width: 150,
                filters: [
                    { text: 'Yes', value: true },
                    { text: 'No', value: false },
                ],
            },
            {
                title: 'Description',
                key: 'description',
                width: 250,
            },
            {
                title: 'Created Date',
                dataIndex: 'createdAt',
                key: 'createdAt',
                sorter: true,
                width: 150,
            },
            {
                title: 'Actions',
                key: 'action',
                width: 100,
                fixed: 'right',
            },
        ]);

        const tableData = computed(() => {
            return leaveTypes.value.map(leaveType => ({
                ...leaveType,
                key: leaveType.id,
                createdAt: formatDate(leaveType.createdAt)
            }));
        });

        const rowSelection = computed(() => ({
            // Fix the column to the left and set appropriate width
            fixed: 'left',
            columnWidth: 60,
            selectedRowKeys: selectedRowKeys.value,
            onChange: (keys, selectedRows) => {
                selectedRowKeys.value = keys;
                console.log('Selected rows:', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log('Record selected:', record, selected);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log('All selected:', selected, selectedRows, changeRows);
            },
            hideDefaultSelections: false,
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_NONE,
            ],
        }));

        // Methods
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            return moment(dateString).format('DD MMM YYYY');
        };

        const updateStatistics = () => {
            const types = leaveTypes.value || [];
            const now = moment();
            const thisMonth = now.startOf('month');

            statistics.value = {
                totalLeaveTypes: types.length,
                activeLeaveTypes: types.filter(type => !type.isDeleted).length,
                attachmentRequired: types.filter(type => type.requiresAttachment).length,
                recentlyAdded: types.filter(type =>
                    moment(type.createdAt).isAfter(thisMonth)
                ).length
            };
        };

        // Helper method to build complete API parameters - Following employees-list pattern
        const buildApiParams = (baseParams = {}) => {
            const params = {
                page: currentPage.value,
                per_page: pageSize.value,
                ...baseParams
            };

            // Add search parameter
            if (searchQuery.value && searchQuery.value.trim()) {
                params.search = searchQuery.value.trim();
            }

            return params;
        };

        // Main fetch method - Following employees-list pattern
        const fetchLeaveTypes = async (params = {}) => {
            loading.value.leaveTypes = true;
            try {
                const queryParams = {
                    page: params.page || currentPage.value || 1,
                    per_page: params.per_page || pageSize.value,
                    ...params
                };

                const response = await leaveService.getLeaveTypes(queryParams);

                if (response.success && response.data) {
                    leaveTypes.value = response.data || [];

                    // Update pagination properties from server response
                    if (response.pagination) {
                        total.value = response.pagination.total;
                        currentPage.value = response.pagination.current_page;
                        pageSize.value = response.pagination.per_page;
                    } else {
                        total.value = response.data.length;
                        currentPage.value = 1;
                    }

                    updateStatistics();
                } else {
                    leaveTypes.value = [];
                    total.value = 0;
                    showToast(response.message || 'Failed to load leave types', 'error');
                }
            } catch (error) {
                console.error('Error fetching leave types:', error);
                leaveTypes.value = [];
                total.value = 0;
                showToast('Failed to load leave types', 'error');
            } finally {
                loading.value.leaveTypes = false;
            }
        };

        // CRUD methods
        const createLeaveType = async (leaveTypeData) => {
            try {
                const response = await leaveService.createLeaveType(leaveTypeData);
                return response;
            } catch (error) {
                console.error('Error creating leave type:', error);
                throw error;
            }
        };

        const updateLeaveType = async (id, leaveTypeData) => {
            try {
                const response = await leaveService.updateLeaveType(id, leaveTypeData);
                return response;
            } catch (error) {
                console.error('Error updating leave type:', error);
                throw error;
            }
        };

        const deleteLeaveType = async (id) => {
            try {
                const response = await leaveService.deleteLeaveType(id);
                return response;
            } catch (error) {
                console.error('Error deleting leave type:', error);
                throw error;
            }
        };

        // PAGINATION EVENT HANDLERS - Following employees-list pattern
        const handlePaginationChange = async (page, pageSizeParam) => {
            console.log('Pagination change:', page, pageSizeParam);
            currentPage.value = page;
            pageSize.value = pageSizeParam || pageSize.value;

            // Build complete parameters preserving current filters and sorting
            const params = buildApiParams({
                page: page,
                per_page: pageSize.value
            });

            await fetchLeaveTypes(params);
        };

        const handleSizeChange = async (current, size) => {
            console.log('Size change:', current, size);
            currentPage.value = 1; // Reset to first page when changing page size
            pageSize.value = size;

            // Build complete parameters preserving current filters and sorting
            const params = buildApiParams({
                page: 1,
                per_page: size
            });

            await fetchLeaveTypes(params);
        };

        const handleSearch = async () => {
            searchLoading.value = true;
            try {
                currentPage.value = 1; // Reset to first page when searching

                // Build complete parameters preserving current filters and sorting
                const params = buildApiParams({
                    page: 1,
                    per_page: pageSize.value
                });

                await fetchLeaveTypes(params);
            } catch (error) {
                console.error('Error during search:', error);
                showToast('Search failed. Please try again.', 'error');
            } finally {
                searchLoading.value = false;
            }
        };

        const clearFiltersLocal = () => {
            filteredInfo.value = {};
            searchQuery.value = '';
            currentPage.value = 1;

            const params = buildApiParams({
                page: 1,
                per_page: pageSize.value
            });

            fetchLeaveTypes(params);
        };

        const clearAll = () => {
            filteredInfo.value = {};
            sortedInfo.value = {};
            searchQuery.value = '';
            currentPage.value = 1;

            const params = buildApiParams({
                page: 1,
                per_page: pageSize.value
            });

            fetchLeaveTypes(params);
        };

        const handleTableChange = (paginationParam, filters, sorter) => {
            console.log('Table change (sorting/filtering):', filters, sorter);

            // Check if there's actually a meaningful change
            const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(filteredInfo.value);
            const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(sortedInfo.value);

            // Only proceed if there's an actual filter or sort change
            if (!hasFilterChange && !hasSorterChange) {
                console.log('No meaningful change detected, skipping reload');
                return;
            }

            // Update filter state
            filteredInfo.value = filters;

            // Only update sorter if it's a real sort operation (has field and order)
            if (sorter && sorter.field && sorter.order) {
                console.log('Applying sort:', sorter);
                sortedInfo.value = sorter;
            } else if (!sorter || (!sorter.field && !sorter.order)) {
                console.log('Clearing sort (filtering only or no sort)');
                sortedInfo.value = {};
            }

            // Reset to first page when filter/sort changes
            currentPage.value = 1;

            // Build complete parameters
            const params = buildApiParams({
                page: 1,
                per_page: pageSize.value
            });

            // Fetch leave types with new parameters
            fetchLeaveTypes(params);
        };

        const openCreateModal = () => {
            isEditing.value = false;
            selectedLeaveType.value = null;
            showModal.value = true;
        };

        const editLeaveType = (record) => {
            isEditing.value = true;
            selectedLeaveType.value = { ...record };
            showModal.value = true;
        };

        const closeModal = () => {
            showModal.value = false;
            selectedLeaveType.value = null;
            isEditing.value = false;
        };

        const handleSave = async (leaveTypeData) => {
            try {
                let result;

                if (isEditing.value) {
                    result = await updateLeaveType(selectedLeaveType.value.id, leaveTypeData);
                } else {
                    result = await createLeaveType(leaveTypeData);
                }

                if (result.success) {
                    closeModal();
                    await fetchLeaveTypes();

                    // ✅ IMPORTANT: Invalidate leaveStore cache so dropdowns get updated
                    // Force refresh the leave types in the store for all dropdowns (leaves-admin-modal, etc.)
                    await leaveStore.fetchLeaveTypes(true);
                    console.log('✅ Leave types cache refreshed in leaveStore after create/update');

                    showToast(`Leave type ${isEditing.value ? 'updated' : 'created'} successfully`, 'success');
                }
            } catch (error) {
                console.error('Error saving leave type:', error);
                showToast(`Failed to ${isEditing.value ? 'update' : 'create'} leave type`, 'error');
            }
        };

        const confirmDeleteLeaveType = async (id) => {
            try {
                await new Promise((resolve) => {
                    AntModal.confirm({
                        title: 'Delete Leave Type?',
                        content: 'Are you sure you want to delete this leave type? This action cannot be undone.',
                        centered: true,
                        okText: 'Yes, delete',
                        cancelText: 'Cancel',
                        okType: 'danger',
                        onOk: async () => {
                            try {
                                const result = await deleteLeaveType(id);
                                if (result.success) {
                                    await fetchLeaveTypes();

                                    // ✅ Invalidate leaveStore cache after delete
                                    await leaveStore.fetchLeaveTypes(true);
                                    console.log('✅ Leave types cache refreshed in leaveStore after delete');

                                    showToast('Leave type deleted successfully', 'success');
                                }
                                resolve();
                            } catch (error) {
                                console.error('Error deleting leave type:', error);
                                showToast('Failed to delete leave type', 'error');
                                resolve();
                            }
                        },
                        onCancel: () => {
                            resolve();
                        }
                    });
                });
            } catch (error) {
                console.error('Delete confirmation failed:', error);
                showToast('Failed to show delete confirmation dialog', 'error');
            }
        };

        const confirmDeleteSelected = async () => {
            if (selectedRowKeys.value.length === 0) {
                showToast('Please select at least one leave type to delete', 'warning');
                return;
            }

            try {
                await new Promise((resolve) => {
                    AntModal.confirm({
                        title: `Delete ${selectedRowKeys.value.length} Leave Types?`,
                        content: `Are you sure you want to delete ${selectedRowKeys.value.length} selected leave type(s)? This action cannot be undone.`,
                        centered: true,
                        okText: 'Yes, delete all',
                        okType: 'danger',
                        cancelText: 'Cancel',
                        onOk: async () => {
                            try {
                                // Implement bulk delete functionality
                                showToast('Bulk delete functionality to be implemented', 'info');
                                resolve();
                            } catch (error) {
                                console.error('Error during bulk delete:', error);
                                showToast('Failed to delete selected leave types', 'error');
                                resolve();
                            }
                        },
                        onCancel: () => {
                            resolve();
                        }
                    });
                });
            } catch (error) {
                console.error('Bulk delete confirmation failed:', error);
                showToast('Failed to show delete confirmation dialog', 'error');
            }
        };

        const exportData = (format) => {
            showToast(`Exporting data as ${format.toUpperCase()}...`, 'info');
            // Implement export functionality
        };

        const toggleHeader = () => {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
        };

        // Lifecycle
        onMounted(() => {
            fetchLeaveTypes();
        });

        return {
            // Reactive data
            title,
            text,
            text1,
            searchQuery,
            searchLoading,
            selectedRowKeys,
            filteredInfo,
            sortedInfo,
            showModal,
            isEditing,
            selectedLeaveType,
            statistics,

            // Data
            leaveTypes,
            loading,
            hasLeaveTypes,
            pagination,

            // Computed
            columns,
            tableData,
            rowSelection,
            paginationInfo,

            // Methods
            formatDate,
            handleSearch,
            clearFiltersLocal,
            clearAll,
            handleTableChange,
            handlePaginationChange,
            handleSizeChange,
            openCreateModal,
            editLeaveType,
            closeModal,
            handleSave,
            confirmDeleteLeaveType,
            confirmDeleteSelected,
            exportData,
            toggleHeader,

            // Permissions
            canRead,
            canEdit,
            isReadOnly,
            accessLevelText,
            accessLevelBadgeClass,
        };
    },
    computed: {
        // Permission checks - primary source for reactivity
        canEditLeaveTypes() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasEdit = Array.isArray(permissions) && permissions.includes('leave_types.edit');
                return hasEdit || (this.canEdit?.value ?? false);
            } catch (e) {
                console.error('[LeaveTypes] Error checking permissions:', e);
                return this.canEdit?.value ?? false;
            }
        },
        canReadLeaveTypes() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasRead = Array.isArray(permissions) && permissions.includes('leave_types.read');
                return hasRead || (this.canRead?.value ?? false);
            } catch (e) {
                return this.canRead?.value ?? false;
            }
        },
        isReadOnlyLeaveTypes() {
            return this.canReadLeaveTypes && !this.canEditLeaveTypes;
        },
    },
};
</script>

<style scoped>
/* ========================================
   HYBRID BOOTSTRAP + ANT DESIGN STYLING
   Following HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md
   Based on: employees-list.vue & leaves-admin.vue
   ======================================== */

/* Ant Design Select Selector Styling */
:deep(.ant-select-selector) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    min-width: 80px;
}

/* ResizeObserver Fix */
.resize-observer-fix {
    overflow: visible;
    position: relative;
    min-height: 100px;
}

/* Ant Design Pagination Wrapper */
.pagination-wrapper {
    margin-top: 20px;
    padding: 20px 16px;
    border-top: 1px solid #e8e8e8;
    position: relative;
    z-index: 100;
}

/* Ant Design Pagination Customization */
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

.pagination-info {
    color: #666;
    font-size: 14px;
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

/* Ant Design Table Customization */
:deep(.ant-table-thead > tr > th) {
    background-color: #fafafa !important;
    color: #595959 !important;
    font-weight: 600 !important;
    border-bottom: 1px solid #e0e0e0 !important;
}

:deep(.ant-table-tbody > tr > td) {
    background-color: #ffffff !important;
}

:deep(.ant-table-tbody > tr:hover > td) {
    background-color: #fafafa !important;
}

/* Statistics Cards Styling */
.statistics-card {
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;
    transform: translateZ(0);
}

.statistics-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px) translateZ(0);
}

.statistics-card .card-body {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: auto;
}

.statistics-row {
    margin-bottom: 1rem;
}

.statistics-row .col-lg-3 {
    margin-bottom: 0.5rem;
}

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

/* Action Icons Styling */
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

/* Container overflow fixes */
.card-body {
    overflow: visible !important;
    padding-bottom: 0;
}

.card {
    overflow: visible !important;
    margin-bottom: 20px;
}

/* Badge Styling */
.badge-soft-info {
    background-color: #e7f3ff;
    color: #0066cc;
}

.badge-soft-success {
    background-color: #e7f7e7;
    color: #008000;
}

.badge-soft-secondary {
    background-color: #f8f9fa;
    color: #6c757d;
}

/* Text wrapping */
.text-wrap {
    word-wrap: break-word;
    white-space: normal;
}

/* Table wrapper styling */
:deep(.ant-table-wrapper) {
    background-color: #ffffff;
}

:deep(.ant-table-container) {
    border: 1px solid #e0e0e0;
    border-radius: 0;
}

/* Fix for table body scrollbar */
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

/* Fix for fixed columns */
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

/* Fix for table rows hover state */
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

:deep(.ant-table-thead .ant-table-selection-column) {
    background-color: #fafafa !important;
}

:deep(.ant-table-fixed-left .ant-table-selection-column) {
    background-color: #ffffff !important;
}

:deep(.ant-table-fixed-left .ant-table-thead .ant-table-selection-column) {
    background-color: #fafafa !important;
}

/* Fix for selected rows */
:deep(.ant-table-row-selected > td),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-left),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-right),
:deep(.ant-table-row-selected > td.ant-table-selection-column) {
    background-color: #e6f7ff !important;
    z-index: 3 !important;
}

/* Ensure proper table layout for fixed columns */
:deep(.ant-table-layout-fixed table) {
    table-layout: auto !important;
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

/* Ensure proper table layout */
:deep(.ant-table-wrapper) {
    background-color: #ffffff;
}

:deep(.ant-table-container) {
    border: 1px solid #e0e0e0;
    border-radius: 0;
}

/* Fix for table body scrollbar */
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

/* Fix for fixed columns - comprehensive solution from employees-list.vue */
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
</style>

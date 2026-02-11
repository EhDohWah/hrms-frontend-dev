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
                        v-if="isReadOnlyLeaveBalances"
                        class="badge bg-warning text-dark ms-3 d-flex align-items-center"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="You have view-only access to this module"
                    >
                        <i class="ti ti-eye me-1"></i> Read Only
                    </span>
                </div>
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
                    <div v-if="canEditLeaveBalances" class="mb-2">
                        <a href="javascript:void(0);" class="btn btn-primary d-flex align-items-center"
                            @click="openCreateModal">
                            <i class="ti ti-circle-plus me-2"></i>Add Leave Balance
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

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Leave Balances</h5>
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                        <!-- Year Filter -->
                        <div class="me-2">
                            <a-select
                                v-model:value="filterYear"
                                placeholder="Year"
                                style="width: 120px;"
                                @change="handleFilterChange"
                            >
                                <a-select-option v-for="year in availableYears" :key="year" :value="year">
                                    {{ year }}
                                </a-select-option>
                            </a-select>
                        </div>
                        <!-- Leave Type Filter -->
                        <div class="me-2">
                            <a-select
                                v-model:value="filterLeaveTypeId"
                                placeholder="Leave Type"
                                style="width: 180px;"
                                allow-clear
                                @change="handleFilterChange"
                            >
                                <a-select-option v-for="lt in leaveTypes" :key="lt.id" :value="lt.id">
                                    {{ lt.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                        <!-- Clear buttons -->
                        <div class="me-2">
                            <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
                            <a-button @click="clearAll">Clear filters and sorters</a-button>
                        </div>
                        <!-- Search input -->
                        <div class="input-icon-end">
                            <a-input-search
                                v-model:value="searchTerm"
                                placeholder="Search name or staff ID..."
                                :loading="searchLoading"
                                enter-button="Search"
                                @search="handleSearch"
                                style="width: 260px;"
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
                        <p class="mt-2">Loading leave balances...</p>
                    </div>
                    <div v-else class="resize-observer-fix">
                        <!-- TABLE WITHOUT PAGINATION -->
                        <a-table
                            :columns="columns"
                            :data-source="tableData"
                            :pagination="false"
                            :scroll="{ x: 1100, y: 'max-content' }"
                            row-key="id"
                            @change="handleTableChange"
                        >
                            <template #bodyCell="{ column, record }">
                                <!-- Employee column -->
                                <template v-if="column.key === 'employee_name'">
                                    <div class="d-flex align-items-center">
                                        <div class="avatar avatar-md avatar-rounded flex-shrink-0 me-2">
                                            <img :src="record.avatar || defaultAvatar" alt="Avatar" />
                                        </div>
                                        <div>
                                            <h6 class="fw-medium mb-0">{{ record.employee_name }}</h6>
                                            <span class="fs-13 text-gray">{{ record.organization }}</span>
                                        </div>
                                    </div>
                                </template>

                                <!-- Staff ID column -->
                                <template v-if="column.key === 'staff_id'">
                                    <span class="badge badge-soft-info">{{ record.staff_id }}</span>
                                </template>

                                <!-- Total Days column -->
                                <template v-if="column.key === 'total_days'">
                                    <span class="badge badge-soft-primary">{{ record.total_days }} days</span>
                                </template>

                                <!-- Used Days column -->
                                <template v-if="column.key === 'used_days'">
                                    <span class="badge badge-soft-warning">{{ record.used_days }} days</span>
                                </template>

                                <!-- Remaining Days column -->
                                <template v-if="column.key === 'remaining_days'">
                                    <span :class="getRemainingDaysClass(record.remaining_days)">
                                        {{ record.remaining_days }} days
                                    </span>
                                </template>

                                <!-- Status column -->
                                <template v-if="column.key === 'status'">
                                    <span :class="getStatusClass(record)">
                                        {{ record.status }}
                                    </span>
                                </template>

                                <!-- Actions column -->
                                <template v-if="column.key === 'action'">
                                    <div class="action-icon d-inline-flex">
                                        <a
                                            v-if="canEditLeaveBalances"
                                            href="javascript:void(0);"
                                            class="me-2"
                                            @click="openEditModal(record._raw)"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="Edit"
                                        >
                                            <i class="ti ti-edit"></i>
                                        </a>
                                        <a
                                            href="javascript:void(0);"
                                            @click="viewDetails(record._raw)"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="View Details"
                                        >
                                            <i class="ti ti-eye"></i>
                                        </a>
                                    </div>
                                </template>
                            </template>
                        </a-table>

                        <!-- SEPARATE PAGINATION COMPONENT -->
                        <div class="pagination-wrapper">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="pagination-info"></div>
                                <a-pagination
                                    v-model:current="currentPage"
                                    v-model:page-size="pageSize"
                                    :total="total"
                                    :show-size-changer="true"
                                    :show-quick-jumper="true"
                                    :page-size-options="['10', '20', '50', '100']"
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

    <!-- Add/Edit Leave Balance Modal -->
    <LeaveBalanceModal :show="showModal" :isEditing="isEditing" :leaveBalance="selectedLeaveBalance"
        :employees="employees" :leaveTypes="leaveTypes" @close="closeModal" @save="handleSave" />
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import LeaveBalanceModal from '@/components/modal/LeaveBalanceModal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { leaveService } from '@/services/leave.service';
import { employeeService } from '@/services/employee.service';
import { useToast } from '@/composables/useToast';
import { usePermissions } from '@/composables/usePermissions';
import defaultAvatar from '@/assets/img/profiles/avatar-default.jpg';
import { ref } from 'vue';

export default {
    name: 'LeaveBalances',
    components: {
        indexBreadcrumb,
        LeaveBalanceModal,
        LayoutHeader,
        LayoutSidebar,
        LayoutFooter,
    },
    setup() {
        const { showToast } = useToast();

        // Server-side pagination, sorting state
        const sortedInfo = ref({});
        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(0);

        // Initialize permission checks for leave_balances module
        const {
            canRead,
            canEdit,
            isReadOnly,
            accessLevelText,
            accessLevelBadgeClass
        } = usePermissions('leave_balances');

        return {
            showToast,
            sortedInfo,
            currentPage,
            pageSize,
            total,
            canRead,
            canEdit,
            isReadOnly,
            accessLevelText,
            accessLevelBadgeClass,
        };
    },
    data() {
        const currentYear = new Date().getFullYear();
        return {
            title: "Leave Balances",
            text: "Leave Management",
            text1: "Leave Balances",

            // Default avatar
            defaultAvatar,

            // Data
            leaveBalances: [],
            leaveTypes: [],
            employees: [],
            loading: false,
            searchLoading: false,

            // Modal state
            showModal: false,
            isEditing: false,
            selectedLeaveBalance: null,

            // Filter properties
            searchTerm: '',
            filterYear: currentYear,
            filterLeaveTypeId: undefined,
            availableYears: [
                currentYear - 2,
                currentYear - 1,
                currentYear,
                currentYear + 1,
            ],

            // Search debounce
            searchDebounceTimer: null,
        };
    },
    computed: {
        // Permission checks
        canEditLeaveBalances() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasEdit = Array.isArray(permissions) && permissions.includes('leave_balances.edit');
                return hasEdit || (this.canEdit?.value ?? false);
            } catch (e) {
                console.error('[LeaveBalances] Error checking permissions:', e);
                return this.canEdit?.value ?? false;
            }
        },
        canReadLeaveBalances() {
            try {
                const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
                const hasRead = Array.isArray(permissions) && permissions.includes('leave_balances.read');
                return hasRead || (this.canRead?.value ?? false);
            } catch (e) {
                return this.canRead?.value ?? false;
            }
        },
        isReadOnlyLeaveBalances() {
            return this.canReadLeaveBalances && !this.canEditLeaveBalances;
        },
        columns() {
            const sorted = this.sortedInfo || {};
            return [
                {
                    title: 'Employee',
                    dataIndex: 'employee_name',
                    key: 'employee_name',
                    width: 200,
                    sorter: true,
                    sortOrder: sorted.columnKey === 'employee_name' && sorted.order,
                },
                {
                    title: 'Staff ID',
                    dataIndex: 'staff_id',
                    key: 'staff_id',
                    width: 110,
                    sorter: true,
                    sortOrder: sorted.columnKey === 'staff_id' && sorted.order,
                },
                {
                    title: 'Leave Type',
                    dataIndex: 'leave_type',
                    key: 'leave_type',
                    width: 140,
                    sorter: true,
                    sortOrder: sorted.columnKey === 'leave_type' && sorted.order,
                },
                {
                    title: 'Total Days',
                    dataIndex: 'total_days',
                    key: 'total_days',
                    width: 110,
                    align: 'center',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'total_days' && sorted.order,
                },
                {
                    title: 'Used Days',
                    dataIndex: 'used_days',
                    key: 'used_days',
                    width: 110,
                    align: 'center',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'used_days' && sorted.order,
                },
                {
                    title: 'Remaining',
                    dataIndex: 'remaining_days',
                    key: 'remaining_days',
                    width: 110,
                    align: 'center',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'remaining_days' && sorted.order,
                },
                {
                    title: 'Year',
                    dataIndex: 'year',
                    key: 'year',
                    width: 80,
                    align: 'center',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'year' && sorted.order,
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: 100,
                    sorter: false,
                },
                {
                    title: 'Actions',
                    key: 'action',
                    fixed: 'right',
                    width: 90,
                    sorter: false,
                },
            ];
        },
        tableData() {
            return this.leaveBalances.map(balance => ({
                key: balance.id,
                id: balance.id,
                employee_name: this.getEmployeeName(balance.employee),
                organization: balance.employee?.organization || 'N/A',
                avatar: balance.employee?.avatar || null,
                staff_id: balance.employee?.staffId || 'N/A',
                leave_type: balance.leaveType?.name || 'N/A',
                total_days: balance.totalDays || 0,
                used_days: balance.usedDays || 0,
                remaining_days: balance.remainingDays || 0,
                year: balance.year,
                status: this.getStatusText(balance),
                _raw: balance,
            }));
        },
    },
    async mounted() {
        await this.fetchInitialData();
        this.fetchLeaveBalances();
    },
    beforeUnmount() {
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }
    },
    methods: {
        // ===== PAGINATION EVENT HANDLERS =====
        handlePaginationChange(page, pageSize) {
            this.currentPage = page;
            this.pageSize = pageSize || this.pageSize;
            this.fetchLeaveBalances(this.buildApiParams({ page, per_page: this.pageSize }));
        },

        handleSizeChange(current, size) {
            this.currentPage = 1;
            this.pageSize = size;
            this.fetchLeaveBalances(this.buildApiParams({ page: 1, per_page: size }));
        },

        // ===== BUILD API PARAMS =====
        buildApiParams(baseParams = {}) {
            const params = {
                page: this.currentPage,
                per_page: this.pageSize,
                ...baseParams,
            };

            // Add sorting parameters
            if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
                params.sort_by = this.mapSortField(this.sortedInfo.field);
                params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
            }

            // Add filter parameters
            if (this.filterYear) {
                params.year = this.filterYear;
            }
            if (this.filterLeaveTypeId) {
                params.leave_type_id = this.filterLeaveTypeId;
            }
            if (this.searchTerm && this.searchTerm.trim()) {
                params.search = this.searchTerm.trim();
            }

            return params;
        },

        // ===== TABLE CHANGE HANDLER (sorting) =====
        handleTableChange(pagination, filters, sorter) {
            const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.sortedInfo);
            if (!hasSorterChange) return;

            if (sorter && sorter.field && sorter.order) {
                this.sortedInfo = sorter;
            } else {
                this.sortedInfo = {};
            }

            this.currentPage = 1;
            this.fetchLeaveBalances(this.buildApiParams({ page: 1, per_page: this.pageSize }));
        },

        // Map frontend field names to backend sort field names
        mapSortField(field) {
            const fieldMapping = {
                'employee_name': 'employee_name',
                'staff_id': 'staff_id',
                'leave_type': 'leave_type',
                'total_days': 'total_days',
                'used_days': 'used_days',
                'remaining_days': 'remaining_days',
                'year': 'year',
            };
            return fieldMapping[field] || field;
        },

        // ===== FILTER HANDLERS =====
        handleFilterChange() {
            this.currentPage = 1;
            this.fetchLeaveBalances(this.buildApiParams({ page: 1, per_page: this.pageSize }));
        },

        handleSearch(value) {
            this.searchLoading = true;
            this.currentPage = 1;
            this.fetchLeaveBalances(this.buildApiParams({ page: 1, per_page: this.pageSize }));
        },

        clearFilters() {
            const currentYear = new Date().getFullYear();
            this.filterYear = currentYear;
            this.filterLeaveTypeId = undefined;
            this.searchTerm = '';
            this.currentPage = 1;
            this.fetchLeaveBalances(this.buildApiParams({ page: 1, per_page: this.pageSize }));
        },

        clearAll() {
            const currentYear = new Date().getFullYear();
            this.filterYear = currentYear;
            this.filterLeaveTypeId = undefined;
            this.searchTerm = '';
            this.sortedInfo = {};
            this.currentPage = 1;
            this.fetchLeaveBalances(this.buildApiParams({ page: 1, per_page: this.pageSize }));
        },

        // ===== DATA FETCHING =====
        async fetchInitialData() {
            try {
                const [leaveTypesResponse, employeesResponse] = await Promise.all([
                    leaveService.getLeaveTypes({ per_page: 100 }),
                    employeeService.getEmployees({ per_page: 100 }),
                ]);

                if (leaveTypesResponse.success) {
                    this.leaveTypes = leaveTypesResponse.data || [];
                }
                if (employeesResponse.success) {
                    this.employees = employeesResponse.data || [];
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        },

        async fetchLeaveBalances(params = {}) {
            this.loading = true;
            try {
                const queryParams = Object.keys(params).length > 0
                    ? params
                    : this.buildApiParams();

                const response = await leaveService.getLeaveBalances(queryParams);

                if (response.success) {
                    this.leaveBalances = response.data || [];

                    // Update pagination from server response
                    if (response.pagination) {
                        this.total = response.pagination.total;
                        this.currentPage = response.pagination.current_page;
                        this.pageSize = response.pagination.per_page;
                    } else {
                        this.total = (response.data || []).length;
                        this.currentPage = 1;
                    }
                } else {
                    this.leaveBalances = [];
                    this.total = 0;
                    this.showToast('error', 'Error', response.message || 'Failed to fetch leave balances');
                }
            } catch (error) {
                console.error('Error fetching leave balances:', error);
                this.leaveBalances = [];
                this.total = 0;
                this.showToast('error', 'Error', 'Failed to fetch leave balances');
            } finally {
                this.loading = false;
                this.searchLoading = false;
            }
        },

        // ===== MODAL HANDLERS =====
        openCreateModal() {
            this.isEditing = false;
            this.selectedLeaveBalance = null;
            this.showModal = true;
        },

        openEditModal(leaveBalance) {
            this.isEditing = true;
            this.selectedLeaveBalance = { ...leaveBalance };
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.selectedLeaveBalance = null;
            this.isEditing = false;
        },

        async handleSave(leaveBalanceData) {
            try {
                let response;

                if (this.isEditing) {
                    response = await leaveService.updateLeaveBalance(this.selectedLeaveBalance.id, leaveBalanceData);
                } else {
                    response = await leaveService.createLeaveBalance(leaveBalanceData);
                }

                if (response.success) {
                    this.showToast('success', 'Success', response.message || `Leave balance ${this.isEditing ? 'updated' : 'created'} successfully`);
                    this.closeModal();
                    this.fetchLeaveBalances();
                } else {
                    this.showToast('error', 'Error', response.message || `Failed to ${this.isEditing ? 'update' : 'create'} leave balance`);
                }
            } catch (error) {
                console.error('Error saving leave balance:', error);
                this.showToast('error', 'Error', `Failed to ${this.isEditing ? 'update' : 'create'} leave balance`);
            }
        },

        viewDetails(balance) {
            this.showToast('info', 'Details', `Viewing details for ${this.getEmployeeName(balance.employee)}`);
        },

        // ===== UTILITY METHODS =====
        getEmployeeName(employee) {
            if (!employee) return 'N/A';
            return `${employee.firstNameEn || ''} ${employee.lastNameEn || ''}`.trim() || 'N/A';
        },

        getRemainingDaysClass(remainingDays) {
            const days = parseFloat(remainingDays) || 0;
            if (days <= 0) return 'badge badge-soft-danger';
            if (days <= 5) return 'badge badge-soft-warning';
            return 'badge badge-soft-success';
        },

        getStatusClass(record) {
            const statusMap = {
                'Exhausted': 'badge badge-soft-danger',
                'Low': 'badge badge-soft-warning',
                'Available': 'badge badge-soft-success',
            };
            return statusMap[record.status] || 'badge badge-soft-secondary';
        },

        getStatusText(balance) {
            const remaining = parseFloat(balance.remainingDays) || 0;
            const total = parseFloat(balance.totalDays) || 0;

            if (remaining <= 0) return 'Exhausted';
            if (total > 0 && remaining / total <= 0.3) return 'Low';
            return 'Available';
        },

        exportData(format) {
            this.showToast('info', 'Export', `Exporting data as ${format.toUpperCase()}...`);
        },

        toggleHeader() {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
        },
    },
};
</script>

<style scoped>
/* ===========================================
   BADGE STYLES
   =========================================== */
.badge-soft-info {
    background-color: #e7f3ff;
    color: #0066cc;
}

.badge-soft-primary {
    background-color: #e8f4fd;
    color: #1f5582;
}

.badge-soft-warning {
    background-color: #fff8e1;
    color: #8b6914;
}

.badge-soft-success {
    background-color: #e7f7e7;
    color: #008000;
}

.badge-soft-danger {
    background-color: #ffe6e6;
    color: #d63384;
}

.badge-soft-secondary {
    background-color: #f8f9fa;
    color: #6c757d;
}

/* ===========================================
   AVATAR
   =========================================== */
.avatar {
    width: 40px;
    height: 40px;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.fs-13 {
    font-size: 0.8125rem;
}

/* ===========================================
   SEARCH INPUT
   =========================================== */
.search-input-primary :deep(.ant-input-search-button) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.search-input-primary :deep(.ant-input-search-button:hover),
.search-input-primary :deep(.ant-input-search-button:focus) {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    opacity: 0.9;
}

/* ===========================================
   PAGINATION WRAPPER
   =========================================== */
.pagination-wrapper {
    margin-top: 16px;
    padding: 16px;
    border-top: 1px solid #f0f0f0;
}

.resize-observer-fix {
    position: relative;
    min-height: 100px;
}

:deep(.ant-pagination) {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

:deep(.ant-pagination-total-text) {
    margin-right: 16px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
}

/* ===========================================
   CARD CONTAINERS
   =========================================== */
.card {
    overflow: visible;
    margin-bottom: 20px;
}

.card .card-body {
    overflow: visible;
    padding-bottom: 0;
}

/* ===========================================
   ANT DESIGN TABLE
   =========================================== */
:deep(.ant-table-container) {
    border: 1px solid #f0f0f0;
    border-radius: 2px;
}

/* Fixed column body cells - opaque white background */
:deep(.ant-table-tbody > tr > td.ant-table-cell-fix-right) {
    background-color: #ffffff !important;
}

/* Fixed column headers - opaque background */
:deep(.ant-table-thead > tr > th.ant-table-cell-fix-right) {
    background-color: #fafafa !important;
}

/* Row hover - fixed columns stay opaque */
:deep(.ant-table-tbody > tr:hover > td.ant-table-cell-fix-right) {
    background-color: #fafafa !important;
}

/* ===========================================
   SCROLLBAR STYLING
   =========================================== */
:deep(.ant-table-body)::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>

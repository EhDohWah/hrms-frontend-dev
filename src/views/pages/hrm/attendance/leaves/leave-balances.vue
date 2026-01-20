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

            <!-- Filters Card -->
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Leave Balances</h5>
                    <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                        <div class="me-3">
                            <div class="input-icon-end position-relative">
                                <input type="text" class="form-control"
                                    placeholder="Search by employee name or staff ID" v-model="searchTerm"
                                    @input="handleSearch" />
                                <span class="input-icon-addon">
                                    <i class="ti ti-search text-gray-7"></i>
                                </span>
                            </div>
                        </div>
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                <i class="ti ti-calendar me-2"></i>Year: {{ selectedYear }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-3">
                                <li v-for="year in availableYears" :key="year">
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setYear(year)">
                                        <i class="ti ti-circle-check me-2" v-if="year === selectedYear"></i>
                                        <span class="ms-4" v-else></span>{{ year }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="dropdown">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                <i class="ti ti-filter me-2"></i>Filter by Leave Type
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setLeaveTypeFilter(null)">
                                        <i class="ti ti-circle-check me-2" v-if="!selectedLeaveTypeId"></i>
                                        <span class="ms-4" v-else></span>All Leave Types
                                    </a>
                                </li>
                                <li v-for="leaveType in leaveTypes" :key="leaveType.id">
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setLeaveTypeFilter(leaveType.id)">
                                        <i class="ti ti-circle-check me-2"
                                            v-if="leaveType.id === selectedLeaveTypeId"></i>
                                        <span class="ms-4" v-else></span>{{ leaveType.name }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card-body p-0">
                    <div class="custom-datatable-filter table-responsive">
                        <table class="table table-borderless custom-table">
                            <thead class="thead-light">
                                <tr>
                                    <th class="no-sort">
                                        <div class="form-check form-check-md">
                                            <input class="form-check-input" type="checkbox" id="select-all"
                                                v-model="selectAll" @change="toggleSelectAll" />
                                            <label class="form-check-label" for="select-all"></label>
                                        </div>
                                    </th>
                                    <th>Employee</th>
                                    <th>Staff ID</th>
                                    <th>Leave Type</th>
                                    <th>Total Days</th>
                                    <th>Used Days</th>
                                    <th>Remaining Days</th>
                                    <th>Year</th>
                                    <th>Status</th>
                                    <th class="no-sort">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="isLeaveBalancesLoading">
                                    <td colspan="10" class="text-center">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else-if="leaveBalances.length === 0">
                                    <td colspan="10" class="text-center">No leave balances found</td>
                                </tr>
                                <tr v-else v-for="balance in leaveBalances" :key="balance.id">
                                    <td>
                                        <div class="form-check form-check-md">
                                            <input class="form-check-input" type="checkbox" :id="`select-${balance.id}`"
                                                v-model="selectedItems" :value="balance.id" />
                                            <label class="form-check-label" :for="`select-${balance.id}`"></label>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar avatar-md avatar-rounded flex-shrink-0 me-2">
                                                <img :src="balance.employee?.avatar || defaultAvatar"
                                                    alt="Avatar" />
                                            </div>
                                            <div>
                                                <h6 class="fw-medium mb-0">{{ getEmployeeName(balance.employee) }}</h6>
                                                <span class="fs-13 text-gray">{{ balance.employee?.organization || 'N/A'
                                                }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge badge-soft-info">{{ balance.employee?.staffId || 'N/A'
                                        }}</span>
                                    </td>
                                    <td>
                                        <span class="fw-medium">{{ balance.leaveType?.name || 'N/A' }}</span>
                                    </td>
                                    <td>
                                        <span class="badge badge-soft-primary">{{ balance.totalDays || 0 }} days</span>
                                    </td>
                                    <td>
                                        <span class="badge badge-soft-warning">{{ balance.usedDays || 0 }} days</span>
                                    </td>
                                    <td>
                                        <span :class="getRemainingDaysClass(balance.remainingDays)">
                                            {{ balance.remainingDays || 0 }} days
                                        </span>
                                    </td>
                                    <td>{{ balance.year }}</td>
                                    <td>
                                        <span :class="getStatusClass(balance)">
                                            {{ getStatusText(balance) }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="dropdown table-action">
                                            <a href="javascript:void(0);" class="action-icon dropdown-toggle"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end">
                                                <a class="dropdown-item" href="javascript:void(0);"
                                                    @click="openEditModal(balance)">
                                                    <i class="ti ti-edit text-blue"></i> Edit
                                                </a>
                                                <a class="dropdown-item" href="javascript:void(0);"
                                                    @click="viewDetails(balance)">
                                                    <i class="ti ti-eye text-info"></i> View Details
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="card-footer d-flex align-items-center justify-content-between flex-wrap">
                    <p class="mb-0">
                        Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0 }}
                        entries
                    </p>
                    <nav aria-label="Page Navigation">
                        <ul class="pagination mb-0 justify-content-end">
                            <li class="page-item" :class="{ disabled: pagination.currentPage <= 1 }">
                                <a class="page-link" href="javascript:void(0);"
                                    @click="changePage(pagination.currentPage - 1)">
                                    <i class="ti ti-chevron-left"></i>
                                </a>
                            </li>
                            <li v-for="page in paginationPages" :key="page" class="page-item"
                                :class="{ active: page === pagination.currentPage }">
                                <a class="page-link" href="javascript:void(0);" @click="changePage(page)">{{ page }}</a>
                            </li>
                            <li class="page-item" :class="{ disabled: pagination.currentPage >= pagination.lastPage }">
                                <a class="page-link" href="javascript:void(0);"
                                    @click="changePage(pagination.currentPage + 1)">
                                    <i class="ti ti-chevron-right"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Leave Balance Modal -->
    <LeaveBalanceModal :show="showModal" :isEditing="isEditing" :leaveBalance="selectedLeaveBalance"
        :employees="employees" :leaveTypes="leaveTypes" @close="closeModal" @save="handleSave" />
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import LeaveBalanceModal from '@/components/modal/LeaveBalanceModal.vue';
import { leaveService } from '@/services/leave.service';
import { employeeService } from '@/services/employee.service';
import { useToast } from '@/composables/useToast';
import { useLoading } from '@/composables/useLoading';
import { usePermissions } from '@/composables/usePermissions';
import defaultAvatar from '@/assets/img/profiles/avatar-default.jpg';

export default {
    name: 'LeaveBalances',
    components: {
        indexBreadcrumb,
        LeaveBalanceModal
    },
    setup() {
        const { showToast } = useToast();
        const { isLeaveBalancesLoading, setLoading } = useLoading();
        
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
            isLeaveBalancesLoading,
            setLoading,
            canRead,
            canEdit,
            isReadOnly,
            accessLevelText,
            accessLevelBadgeClass
        };
    },
    data() {
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
            selectedItems: [],
            selectAll: false,
            showModal: false,
            isEditing: false,
            selectedLeaveBalance: null,

            // Filters
            searchTerm: '',
            selectedYear: new Date().getFullYear(),
            selectedLeaveTypeId: null,
            availableYears: [],

            // Pagination
            pagination: {
                currentPage: 1,
                perPage: 10,
                total: 0,
                lastPage: 1,
                from: 0,
                to: 0
            }
        };
    },
    computed: {
        // Permission checks - primary source for reactivity
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
        paginationPages() {
            const pages = [];
            const start = Math.max(1, this.pagination.currentPage - 2);
            const end = Math.min(this.pagination.lastPage, this.pagination.currentPage + 2);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        }
    },
    async mounted() {
        this.initializeYears();
        await this.fetchInitialData();
        this.fetchLeaveBalances();
    },
    methods: {
        initializeYears() {
            const currentYear = new Date().getFullYear();
            this.availableYears = [
                currentYear - 2,
                currentYear - 1,
                currentYear,
                currentYear + 1
            ];
        },

        async fetchInitialData() {
            try {
                // Fetch leave types and employees in parallel
                const [leaveTypesResponse, employeesResponse] = await Promise.all([
                    leaveService.getLeaveTypes({ per_page: 100 }),
                    employeeService.getEmployees({ per_page: 100 })
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

        async fetchLeaveBalances() {
            try {
                this.setLoading('leaveBalances', true);

                const params = {
                    page: this.pagination.currentPage,
                    per_page: this.pagination.perPage,
                    search: this.searchTerm || undefined,
                    year: this.selectedYear,
                    leave_type_id: this.selectedLeaveTypeId || undefined
                };

                const response = await leaveService.getLeaveBalances(params);

                if (response.success) {
                    this.leaveBalances = response.data || [];
                    if (response.pagination) {
                        this.pagination = {
                            ...this.pagination,
                            ...response.pagination
                        };
                    }
                } else {
                    this.showToast('error', 'Error', response.message || 'Failed to fetch leave balances');
                }
            } catch (error) {
                console.error('Error fetching leave balances:', error);
                this.showToast('error', 'Error', 'Failed to fetch leave balances: ' + error.message);
            } finally {
                this.setLoading('leaveBalances', false);
            }
        },

        handleSearch() {
            this.pagination.currentPage = 1;
            this.fetchLeaveBalances();
        },

        setYear(year) {
            this.selectedYear = year;
            this.pagination.currentPage = 1;
            this.fetchLeaveBalances();
        },

        setLeaveTypeFilter(leaveTypeId) {
            this.selectedLeaveTypeId = leaveTypeId;
            this.pagination.currentPage = 1;
            this.fetchLeaveBalances();
        },

        changePage(page) {
            if (page >= 1 && page <= this.pagination.lastPage) {
                this.pagination.currentPage = page;
                this.fetchLeaveBalances();
            }
        },

        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedItems = this.leaveBalances.map(item => item.id);
            } else {
                this.selectedItems = [];
            }
        },

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
            // Navigate to detailed view or show details modal
            this.showToast('info', 'Details', `Viewing details for ${this.getEmployeeName(balance.employee)}`);
        },

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

        getStatusClass(balance) {
            const remaining = parseFloat(balance.remainingDays) || 0;
            const total = parseFloat(balance.totalDays) || 0;

            if (remaining <= 0) return 'badge badge-soft-danger';
            if (remaining / total <= 0.3) return 'badge badge-soft-warning';
            return 'badge badge-soft-success';
        },

        getStatusText(balance) {
            const remaining = parseFloat(balance.remainingDays) || 0;
            const total = parseFloat(balance.totalDays) || 0;

            if (remaining <= 0) return 'Exhausted';
            if (remaining / total <= 0.3) return 'Low';
            return 'Available';
        },

        exportData(format) {
            this.showToast('info', 'Export', `Exporting data as ${format.toUpperCase()}...`);
            // Implement export functionality
        },

        toggleHeader() {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
        }
    }
};
</script>

<style scoped>
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
</style>

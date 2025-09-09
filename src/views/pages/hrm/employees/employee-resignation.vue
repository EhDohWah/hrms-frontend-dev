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
            <div class="row mb-4">
                <div class="col-xl-3 col-sm-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center overflow-hidden">
                                    <span class="avatar avatar-lg bg-primary rounded-circle">
                                        <i class="ti ti-users-minus text-white"></i>
                                    </span>
                                    <div class="ms-2 overflow-hidden">
                                        <p class="fs-12 fw-medium mb-1 text-truncate">Total Resignations</p>
                                        <h4 class="mb-0">{{ statistics.total || 0 }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center overflow-hidden">
                                    <span class="avatar avatar-lg bg-warning rounded-circle">
                                        <i class="ti ti-clock text-white"></i>
                                    </span>
                                    <div class="ms-2 overflow-hidden">
                                        <p class="fs-12 fw-medium mb-1 text-truncate">Pending</p>
                                        <h4 class="mb-0">{{ statistics.pending || 0 }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center overflow-hidden">
                                    <span class="avatar avatar-lg bg-success rounded-circle">
                                        <i class="ti ti-check text-white"></i>
                                    </span>
                                    <div class="ms-2 overflow-hidden">
                                        <p class="fs-12 fw-medium mb-1 text-truncate">Acknowledged</p>
                                        <h4 class="mb-0">{{ statistics.acknowledged || 0 }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center overflow-hidden">
                                    <span class="avatar avatar-lg bg-info rounded-circle">
                                        <i class="ti ti-calendar text-white"></i>
                                    </span>
                                    <div class="ms-2 overflow-hidden">
                                        <p class="fs-12 fw-medium mb-1 text-truncate">This Month</p>
                                        <h4 class="mb-0">{{ statistics.currentMonth || 0 }}</h4>
                                    </div>
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
                    <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                        <!-- Search -->
                        <div class="me-3">
                            <div class="input-icon-end position-relative">
                                <input type="text" class="form-control" placeholder="Search resignations..."
                                    v-model="searchTerm" @input="handleSearch" />
                                <span class="input-icon-addon">
                                    <i class="ti ti-search"></i>
                                </span>
                            </div>
                        </div>

                        <!-- Department Filter -->
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                {{ selectedDepartment ? selectedDepartment.name : 'All Departments' }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setDepartmentFilter(null)">All Departments</a>
                                </li>
                                <li v-for="department in departments" :key="department.id">
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setDepartmentFilter(department)">{{ department.name }}</a>
                                </li>
                            </ul>
                        </div>

                        <!-- Status Filter -->
                        <div class="dropdown me-3">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                {{ selectedStatus ? selectedStatus.label : 'All Statuses' }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setStatusFilter(null)">All Statuses</a>
                                </li>
                                <li v-for="status in acknowledgementStatusOptions" :key="status.value">
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setStatusFilter(status)">{{ status.label }}</a>
                                </li>
                            </ul>
                        </div>

                        <!-- Sort By -->
                        <div class="dropdown">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                Sort By: {{ getSortLabel(sortBy) }}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setSortBy('created_at')">Recently Added</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setSortBy('resignation_date')">Resignation Date</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setSortBy('last_working_date')">Last Working Date</a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setSortBy('employee_name')">Employee Name</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card-body p-0">
                    <!-- Loading State -->
                    <div v-if="loading" class="text-center my-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading resignations...</p>
                    </div>

                    <!-- Resignations Table -->
                    <div v-else class="custom-datatable-filter table-responsive">
                        <table class="table datatable">
                            <thead>
                                <tr>
                                    <th>
                                        <label class="checkboxs">
                                            <input type="checkbox" v-model="selectAll" @change="handleSelectAll"
                                                :disabled="!hasResignations">
                                            <span class="checkmarks"></span>
                                        </label>
                                    </th>
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Resignation Date</th>
                                    <th>Last Working Date</th>
                                    <th>Notice Period</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="!hasResignations">
                                    <td colspan="10" class="text-center py-4">
                                        <div class="d-flex flex-column align-items-center">
                                            <i class="ti ti-users-minus text-muted mb-3" style="font-size: 3rem;"></i>
                                            <h6 class="text-muted">No resignations found</h6>
                                            <p class="text-muted">Start by adding your first resignation record.</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="resignation in resignations" :key="resignation.id">
                                    <td>
                                        <label class="checkboxs">
                                            <input type="checkbox" :value="resignation.id" v-model="selectedItems">
                                            <span class="checkmarks"></span>
                                        </label>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div>
                                                <h6 class="fw-medium">{{ resignation.employee?.name || 'N/A' }}</h6>
                                                <span class="text-muted">{{ resignation.employee?.staffId || 'N/A'
                                                }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{{ resignation.department?.name || 'N/A' }}</td>
                                    <td>{{ resignation.position?.title || 'N/A' }}</td>
                                    <td>{{ formatDate(resignation.resignationDate) }}</td>
                                    <td>{{ formatDate(resignation.lastWorkingDate) }}</td>
                                    <td>
                                        <span class="badge badge-light">{{ resignation.noticePeriod || 0 }} days</span>
                                    </td>
                                    <td>
                                        <span class="text-truncate" style="max-width: 120px;"
                                            :title="resignation.reason">
                                            {{ resignation.reason }}
                                        </span>
                                    </td>
                                    <td>
                                        <span :class="getStatusConfig(resignation.acknowledgementStatus).class">
                                            <i
                                                :class="getStatusConfig(resignation.acknowledgementStatus).icon + ' me-1'"></i>
                                            {{ getStatusConfig(resignation.acknowledgementStatus).label }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="dropdown">
                                            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white btn-sm"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </a>
                                            <ul class="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item"
                                                        @click="viewResignation(resignation)">
                                                        <i class="ti ti-eye me-2"></i>View
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item"
                                                        @click="editResignation(resignation)">
                                                        <i class="ti ti-edit me-2"></i>Edit
                                                    </a>
                                                </li>
                                                <li v-if="resignation.acknowledgementStatus === 'Pending'">
                                                    <a href="javascript:void(0);" class="dropdown-item"
                                                        @click="acknowledgeResignation(resignation)">
                                                        <i class="ti ti-check me-2"></i>Acknowledge
                                                    </a>
                                                </li>
                                                <li>
                                                    <hr class="dropdown-divider">
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0);" class="dropdown-item text-danger"
                                                        @click="confirmDeleteResignation(resignation)">
                                                        <i class="ti ti-trash me-2"></i>Delete
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div v-if="hasResignations"
                        class="card-footer d-flex align-items-center justify-content-between flex-wrap">
                        <p class="mb-0">
                            Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0
                            }}
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
                                    <a class="page-link" href="javascript:void(0);" @click="changePage(page)">{{ page
                                        }}</a>
                                </li>
                                <li class="page-item"
                                    :class="{ disabled: pagination.currentPage >= pagination.lastPage }">
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

        <layout-footer></layout-footer>
    </div>
    <!-- /Page Wrapper -->

    <!-- Add/Edit Resignation Modal -->
    <ResignationModal :show="showModal" :isEditing="isEditing" :resignation="selectedResignation" @close="closeModal"
        @save="handleSave" />

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="delete_modal" tabindex="-1" aria-labelledby="delete_modal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Delete Resignation</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete the resignation record for <strong>{{
                        resignationToDelete?.employee?.name }}</strong>?</p>
                    <p class="text-danger">This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="handleDeleteResignation"
                        :disabled="isDeleting">
                        <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import ResignationModal from '@/components/modal/ResignationModal.vue';
import { resignationService } from '@/services/resignation.service';
import { statusUtils, dateUtils, exportUtils } from '@/utils/resignation.utils';
import { useToast } from '@/composables/useToast';
import { Modal } from 'bootstrap';

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
            selectedItems: [],
            selectAll: false,
            showModal: false,
            isEditing: false,
            selectedResignation: null,
            resignationToDelete: null,
            isDeleting: false,
            loading: false,

            // Filters
            searchTerm: '',
            selectedDepartment: null,
            selectedStatus: null,
            sortBy: 'created_at',

            // Pagination
            pagination: {
                currentPage: 1,
                perPage: 10,
                total: 0,
                lastPage: 1,
                from: 0,
                to: 0
            },

            // Static data
            acknowledgementStatusOptions: statusUtils.getAcknowledgementStatusOptions()
        };
    },
    computed: {
        hasResignations() {
            return this.resignations && this.resignations.length > 0;
        },
        paginationPages() {
            const pages = [];
            const current = this.pagination.currentPage;
            const last = this.pagination.lastPage;
            const delta = 2;

            for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
                pages.push(i);
            }

            return pages;
        }
    },
    async mounted() {
        await this.fetchResignations();
        await this.fetchDepartments();
        await this.fetchStatistics();
    },
    methods: {
        async fetchResignations() {
            this.loading = true;
            try {
                const filters = {
                    page: this.pagination.currentPage,
                    perPage: this.pagination.perPage,
                    search: this.searchTerm,
                    departmentId: this.selectedDepartment?.id,
                    acknowledgementStatus: this.selectedStatus?.value,
                    sortBy: this.sortBy,
                    sortOrder: 'desc'
                };

                const response = await resignationService.getResignations(filters);
                if (response.success) {
                    this.resignations = response.data;
                    this.pagination = {
                        currentPage: response.pagination?.current_page || 1,
                        perPage: response.pagination?.per_page || 10,
                        total: response.pagination?.total || 0,
                        lastPage: response.pagination?.last_page || 1,
                        from: response.pagination?.from || 0,
                        to: response.pagination?.to || 0
                    };
                }
            } catch (error) {
                console.error('Error fetching resignations:', error);
                this.showToast('Error loading resignations', 'error');
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

        // Filter methods
        handleSearch() {
            this.pagination.currentPage = 1;
            this.fetchResignations();
        },

        setDepartmentFilter(department) {
            this.selectedDepartment = department;
            this.pagination.currentPage = 1;
            this.fetchResignations();
        },

        setStatusFilter(status) {
            this.selectedStatus = status;
            this.pagination.currentPage = 1;
            this.fetchResignations();
        },

        setSortBy(sortBy) {
            this.sortBy = sortBy;
            this.pagination.currentPage = 1;
            this.fetchResignations();
        },

        getSortLabel(sortBy) {
            const labels = {
                'created_at': 'Recently Added',
                'resignation_date': 'Resignation Date',
                'last_working_date': 'Last Working Date',
                'employee_name': 'Employee Name'
            };
            return labels[sortBy] || 'Recently Added';
        },

        // Pagination methods
        changePage(page) {
            if (page >= 1 && page <= this.pagination.lastPage) {
                this.pagination.currentPage = page;
                this.fetchResignations();
            }
        },

        // Selection methods
        handleSelectAll() {
            if (this.selectAll) {
                this.selectedItems = this.resignations.map(r => r.id);
            } else {
                this.selectedItems = [];
            }
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
        confirmDeleteResignation(resignation) {
            this.resignationToDelete = resignation;
            const modal = new Modal(document.getElementById('delete_modal'));
            modal.show();
        },

        async handleDeleteResignation() {
            if (!this.resignationToDelete) return;

            this.isDeleting = true;
            try {
                const response = await resignationService.deleteResignation(this.resignationToDelete.id);
                if (response.success) {
                    await this.fetchResignations();
                    await this.fetchStatistics();
                    this.showToast('Resignation deleted successfully', 'success');

                    const modal = Modal.getInstance(document.getElementById('delete_modal'));
                    modal.hide();
                }
            } catch (error) {
                console.error('Error deleting resignation:', error);
                this.showToast('Error deleting resignation', 'error');
            } finally {
                this.isDeleting = false;
                this.resignationToDelete = null;
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

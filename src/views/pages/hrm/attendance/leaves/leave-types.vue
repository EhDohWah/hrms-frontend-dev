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
                    <div class="mb-2">
                        <a href="javascript:void(0);" class="btn btn-primary d-flex align-items-center"
                            @click="openCreateModal">
                            <i class="ti ti-circle-plus me-2"></i>Add Leave Type
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

            <!-- Filter Row -->
            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Leave Types</h5>
                    <div class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                        <div class="me-3">
                            <div class="input-icon-end position-relative">
                                <input type="text" class="form-control date-range bookingrange"
                                    placeholder="Search Leave Types" v-model="searchTerm" @input="handleSearch" />
                                <span class="input-icon-addon">
                                    <i class="ti ti-search text-gray-7"></i>
                                </span>
                            </div>
                        </div>
                        <div class="dropdown">
                            <a href="javascript:void(0);"
                                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                                data-bs-toggle="dropdown">
                                <i class="ti ti-sort-descending-2 me-2"></i>Sort by : Recently Added
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end p-3">
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setSortBy('recently_added')">
                                        <i class="ti ti-circle-check me-2"></i>Recently Added
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setSortBy('ascending')">
                                        <i class="ti ti-circle-check me-2"></i>Ascending
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1"
                                        @click="setSortBy('descending')">
                                        <i class="ti ti-circle-check me-2"></i>Descending
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
                                    <th>Leave Type Name</th>
                                    <th>Default Duration (Days)</th>
                                    <th>Requires Attachment</th>
                                    <th>Description</th>
                                    <th>Created Date</th>
                                    <th class="no-sort">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="loading.leaveTypes">
                                    <td colspan="7" class="text-center">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else-if="leaveTypes.length === 0">
                                    <td colspan="7" class="text-center">No leave types found</td>
                                </tr>
                                <tr v-else v-for="leaveType in leaveTypes" :key="leaveType.id">
                                    <td>
                                        <div class="form-check form-check-md">
                                            <input class="form-check-input" type="checkbox"
                                                :id="`select-${leaveType.id}`" v-model="selectedItems"
                                                :value="leaveType.id" />
                                            <label class="form-check-label" :for="`select-${leaveType.id}`"></label>
                                        </div>
                                    </td>
                                    <td>
                                        <h6 class="fw-medium">{{ leaveType.name }}</h6>
                                    </td>
                                    <td>
                                        <span class="badge badge-soft-info">
                                            {{ leaveType.defaultDuration || 'N/A' }} {{ leaveType.defaultDuration ?
                                                'days' : '' }}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            :class="['badge', leaveType.requiresAttachment ? 'badge-soft-success' : 'badge-soft-secondary']">
                                            {{ leaveType.requiresAttachment ? 'Yes' : 'No' }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="text-wrap" style="max-width: 200px;">
                                            {{ leaveType.description || 'No description' }}
                                        </span>
                                    </td>
                                    <td>{{ formatDate(leaveType.createdAt) }}</td>
                                    <td>
                                        <div class="dropdown table-action">
                                            <a href="javascript:void(0);" class="action-icon dropdown-toggle"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end">
                                                <a class="dropdown-item" href="javascript:void(0);"
                                                    @click="openEditModal(leaveType)">
                                                    <i class="ti ti-edit text-blue"></i> Edit
                                                </a>
                                                <a class="dropdown-item" href="javascript:void(0);"
                                                    @click="confirmDelete(leaveType)">
                                                    <i class="ti ti-trash text-danger"></i> Delete
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

    <!-- Add/Edit Leave Type Modal -->
    <LeaveTypeModal :show="showModal" :isEditing="isEditing" :leaveType="selectedLeaveType" @close="closeModal"
        @save="handleSave" />

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="delete_modal" tabindex="-1" aria-labelledby="delete_modal" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Delete Leave Type</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete <strong>{{ leaveTypeToDelete?.name }}</strong>?</p>
                    <p class="text-danger">This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="handleDeleteLeaveType" :disabled="isDeleting">
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
import LeaveTypeModal from '@/components/modal/LeaveTypeModal.vue';
import { useLeaveTypes } from '@/composables/useLeaveTypes';
import { useToast } from '@/composables/useToast';

export default {
    name: 'LeaveTypes',
    components: {
        indexBreadcrumb,
        LeaveTypeModal
    },
    setup() {
        const { showToast } = useToast();
        const {
            leaveTypes,
            pagination,
            filters,
            loading,
            hasLeaveTypes,
            isFirstPage,
            isLastPage,
            leaveTypeOptions,
            fetchLeaveTypes,
            createLeaveType,
            updateLeaveType,
            deleteLeaveType,
            goToPage,
            nextPage,
            previousPage,
            changePerPage,
            updateFilters
        } = useLeaveTypes();

        return {
            showToast,
            leaveTypes,
            pagination,
            filters,
            loading,
            hasLeaveTypes,
            isFirstPage,
            isLastPage,
            leaveTypeOptions,
            fetchLeaveTypes,
            createLeaveType,
            updateLeaveType,
            deleteLeaveType,
            goToPage,
            nextPage,
            previousPage,
            changePerPage,
            updateFilters
        };
    },
    data() {
        return {
            title: "Leave Types",
            text: "Leave Management",
            text1: "Leave Types",

            // Local component state
            selectedItems: [],
            selectAll: false,
            showModal: false,
            isEditing: false,
            selectedLeaveType: null,
            leaveTypeToDelete: null,
            isDeleting: false,

            // Local filters (sync with composable)
            searchTerm: '',
            sortBy: 'recently_added'
        };
    },
    computed: {
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
    mounted() {
        this.loadLeaveTypes();
    },
    methods: {


        async loadLeaveTypes() {
            // Update filters
            this.updateFilters({
                search: this.searchTerm || '',
                page: this.pagination.currentPage,
                perPage: this.pagination.perPage
            });

            // Fetch using composable
            await this.fetchLeaveTypes();
        },

        handleSearch() {
            this.updateFilters({
                search: this.searchTerm || '',
                page: 1
            });
        },

        setSortBy(sortBy) {
            this.sortBy = sortBy;
            this.updateFilters({
                sortBy: sortBy,
                page: 1
            });
        },

        changePage(page) {
            this.goToPage(page);
        },

        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedItems = this.leaveTypes.map(item => item.id);
            } else {
                this.selectedItems = [];
            }
        },

        openCreateModal() {
            this.isEditing = false;
            this.selectedLeaveType = null;
            this.showModal = true;
        },

        openEditModal(leaveType) {
            this.isEditing = true;
            this.selectedLeaveType = { ...leaveType };
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.selectedLeaveType = null;
            this.isEditing = false;
        },

        async handleSave(leaveTypeData) {
            try {
                let result;

                if (this.isEditing) {
                    result = await this.updateLeaveType(this.selectedLeaveType.id, leaveTypeData);
                } else {
                    result = await this.createLeaveType(leaveTypeData);
                }

                if (result.success) {
                    this.closeModal();
                }
            } catch (error) {
                console.error('Error saving leave type:', error);
                this.showToast('error', 'Error', `Failed to ${this.isEditing ? 'update' : 'create'} leave type`);
            }
        },

        confirmDelete(leaveType) {
            this.leaveTypeToDelete = leaveType;
            const deleteModal = new bootstrap.Modal(document.getElementById('delete_modal'));
            deleteModal.show();
        },

        async handleDeleteLeaveType() {
            if (!this.leaveTypeToDelete) return;

            try {
                this.isDeleting = true;

                const result = await this.deleteLeaveType(this.leaveTypeToDelete.id);

                if (result.success) {
                    // Close modal
                    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('delete_modal'));
                    deleteModal.hide();

                    this.leaveTypeToDelete = null;
                }
            } catch (error) {
                console.error('Error deleting leave type:', error);
                this.showToast('error', 'Error', 'Failed to delete leave type');
            } finally {
                this.isDeleting = false;
            }
        },

        exportData(format) {
            this.showToast('info', 'Export', `Exporting data as ${format.toUpperCase()}...`);
            // Implement export functionality
        },

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        toggleHeader() {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
        }
    }
};
</script>

<style scoped>
.text-wrap {
    word-wrap: break-word;
    white-space: normal;
}

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
</style>

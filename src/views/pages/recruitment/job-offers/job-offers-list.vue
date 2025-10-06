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
                    <div class="mb-2 me-2">
                        <button class="btn btn-primary d-flex align-items-center" @click="openAddJobOfferModal">
                            <i class="ti ti-circle-plus me-2"></i>Add Job Offer
                        </button>
                    </div>

                    <div class="ms-2 head-icons">
                        <a href="javascript:void(0);" :class="{ active: isCollapsed }" @click="toggleCollapse"
                            data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse"
                            id="collapse-header">
                            <i class="ti ti-chevrons-up"></i>
                        </a>
                    </div>
                </div>
            </div>
            <!-- /Breadcrumb -->

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Job Offers List</h5>
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                        <div class="me-2">
                            <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
                            <a-button @click="clearAll">Clear filters and sorters</a-button>
                        </div>
                        <div class="input-icon-end">
                            <a-input-search v-model:value="searchCandidateName" placeholder="Enter candidate name..."
                                :loading="searchLoading" enter-button="Search" @search="handleCandidateNameSearch"
                                style="width: 250px;" class="search-input-primary" />
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="loading" class="text-center my-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading job offers...</p>
                    </div>
                    <div v-else>
                        <a-table :columns="columns" :data-source="tableData" :pagination="false"
                            :scroll="{ x: 'max-content' }" row-key="id" @change="handleTableChange">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'probation_salary'">
                                    <span class="text-primary fw-semibold">
                                        {{ record.probation_salary ? `THB
                                        ${Number(record.probation_salary).toLocaleString('en-US', {
                                        minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A' }}
                                    </span>
                                </template>

                                <template v-if="column.dataIndex === 'post_probation_salary'">
                                    <span class="text-success fw-semibold">
                                        {{ record.post_probation_salary ? `THB
                                        ${Number(record.post_probation_salary).toLocaleString('en-US', {
                                        minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A' }}
                                    </span>
                                </template>

                                <template v-if="column.dataIndex === 'acceptance_status'">
                                    <span
                                        :class="`badge ${record.acceptance_status === 'accepted' ? 'bg-success' : record.acceptance_status === 'rejected' ? 'bg-danger' : 'bg-warning'}`">
                                        {{ record.acceptance_status }}
                                    </span>
                                </template>

                                <template v-if="column.dataIndex === 'actions'">
                                    <div class="action-icon d-inline-flex">
                                        <a href="javascript:void(0);" class="me-2"
                                            @click="openJobOfferModal(record.custom_offer_id)">
                                            <i class="ti ti-eye"></i>
                                        </a>
                                        <a href="javascript:void(0);" class="me-2"
                                            @click="downloadJobOfferPDF(record.custom_offer_id)">
                                            <i class="ti ti-download"></i>
                                        </a>
                                        <a href="javascript:void(0);" class="me-2"
                                            @click="openEditJobOfferModal(record)">
                                            <i class="ti ti-edit"></i>
                                        </a>
                                        <a href="javascript:void(0);" @click="deleteJobOffer(record.id)">
                                            <i class="ti ti-trash"></i>
                                        </a>
                                    </div>
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

    <!-- Job Offer Modal -->
    <job-offers-modal ref="jobOffersModal" @job-offer-added="fetchJobOffers" @job-offer-updated="fetchJobOffers" />

    <!-- Job Offer Report Modal -->
    <job-offer-report-modal ref="jobOfferReportModal" :pdf-url="pdfUrl" />

    <!-- Notification Toast -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div id="notificationToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header" :class="notificationClass">
                <strong class="me-auto">{{ notificationTitle }}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                {{ notificationMessage }}
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'bootstrap';
import { Modal as AntModal } from 'ant-design-vue';
import JobOffersModal from '@/components/modal/job-offers-modal.vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useJobOfferStore } from '@/stores/jobOfferStore';
import { ref, computed } from 'vue';
import moment from 'moment';
import { jobOfferService } from '@/services/job-offer.service';
import JobOfferReportModal from '@/components/modal/reports/joboffer-report-modal.vue';

export default {
    name: 'JobOffersList',
    components: {
        JobOffersModal,
        indexBreadcrumb,
        JobOfferReportModal
    },
    setup() {
        const filteredInfo = ref({});
        const sortedInfo = ref({});
        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(0);
        const jobOfferStore = useJobOfferStore();

        return {
            filteredInfo,
            sortedInfo,
            currentPage,
            pageSize,
            total,
            jobOfferStore,
        };
    },
    data() {
        return {
            title: 'Job Offers',
            text: 'Recruitment',
            text1: 'Job Offers',
            loading: false,
            jobOffers: [],
            isCollapsed: false,
            notificationTitle: '',
            notificationMessage: '',
            notificationClass: '',
            pdfUrl: null,
            searchCandidateName: '',
            searchLoading: false
        };
    },
    computed: {
        columns() {
            const filtered = this.filteredInfo || {};
            const sorted = this.sortedInfo || {};

            return [
                {
                    title: 'Job Offer ID',
                    dataIndex: 'custom_offer_id',
                    key: 'custom_offer_id',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'custom_offer_id' && sorted.order
                },
                {
                    title: 'Candidate Name',
                    dataIndex: 'candidate_name',
                    key: 'candidate_name',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'candidate_name' && sorted.order
                },
                {
                    title: 'Position',
                    dataIndex: 'position_name',
                    key: 'position_name',
                    filters: [
                        { text: 'HR Manager', value: 'HR Manager' },
                        { text: 'Software Developer', value: 'Software Developer' },
                        { text: 'Data Analyst', value: 'Data Analyst' },
                        { text: 'Project Manager', value: 'Project Manager' }
                    ],
                    filteredValue: filtered.position_name || null,
                    sorter: true,
                    sortOrder: sorted.columnKey === 'position_name' && sorted.order
                },
                {
                    title: 'Probation Salary',
                    dataIndex: 'probation_salary',
                    key: 'probation_salary',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'probation_salary' && sorted.order,
                    width: 150
                },
                {
                    title: 'Post-Probation Salary',
                    dataIndex: 'post_probation_salary',
                    key: 'post_probation_salary',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'post_probation_salary' && sorted.order,
                    width: 170
                },
                {
                    title: 'Date',
                    dataIndex: 'date',
                    key: 'date',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'date' && sorted.order
                },
                {
                    title: 'Deadline',
                    dataIndex: 'acceptance_deadline',
                    key: 'acceptance_deadline',
                    sorter: true,
                    sortOrder: sorted.columnKey === 'acceptance_deadline' && sorted.order
                },
                {
                    title: 'Status',
                    dataIndex: 'acceptance_status',
                    key: 'acceptance_status',
                    filters: [
                        { text: 'Pending', value: 'pending' },
                        { text: 'Accepted', value: 'accepted' },
                        { text: 'Rejected', value: 'rejected' }
                    ],
                    filteredValue: filtered.acceptance_status || null,
                    sorter: true,
                    sortOrder: sorted.columnKey === 'acceptance_status' && sorted.order
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    fixed: 'right'
                }
            ];
        },
        tableData() {
            return this.jobOffers.map(jobOffer => ({
                ...jobOffer,
                key: jobOffer.id,
                date: jobOffer.date ? moment(jobOffer.date).format('DD/MM/YYYY') : '',
                acceptance_deadline: jobOffer.acceptance_deadline ? moment(jobOffer.acceptance_deadline).format('DD/MM/YYYY') : ''
            }));
        }
    },
    mounted() {
        this.fetchJobOffers();
    },
    methods: {
        async openJobOfferModal(custom_offer_id) {
            try {
                const blob = await jobOfferService.generateJobOfferPDF(custom_offer_id);
                const url = URL.createObjectURL(blob);
                console.log('🔍 this.pdfUrl:', url);
                this.pdfUrl = url;
                // now that the prop is set, show the modal
                this.$refs.jobOfferReportModal.openModal();
            } catch (err) {
                console.error('Error generating PDF', err);
                this.$message.error('Failed to generate job offer PDF');
            }
        },

        async downloadJobOfferPDF(custom_offer_id) {
            try {
                const blob = await jobOfferService.generateJobOfferPDF(custom_offer_id);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                console.log('🔍 a.href:', a.href);
                a.download = `job-offer-${custom_offer_id}.pdf`;
                a.click();
                this.$message.success('Job offer PDF downloaded successfully');
            } catch (error) {
                console.error('Error downloading job offer PDF:', error);
                this.$message.error('Failed to download job offer PDF');
            }
        },

        formatTime(timeString) {
            if (!timeString) return '';

            // Handle time strings with milliseconds
            const timeParts = timeString.split('.');
            const baseTime = timeParts[0];

            // Convert to 12-hour format
            const [hours, minutes] = baseTime.split(':');
            if (!hours || !minutes) return timeString;

            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;

            return `${hour12}:${minutes} ${ampm}`;
        },

        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            if (this.isCollapsed) {
                document.body.classList.add("header-collapse");
            } else {
                document.body.classList.remove("header-collapse");
            }
        },



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

            this.fetchJobOffers(params);
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

            this.fetchJobOffers(params);
        },

        // Helper method to build complete API parameters
        buildApiParams(baseParams = {}) {
            const params = {
                page: this.currentPage,
                per_page: this.pageSize,
                ...baseParams
            };

            // Add sorting parameters
            if (this.sortedInfo && this.sortedInfo.field) {
                const sortField = this.mapSortField(this.sortedInfo.field);
                params.sort_by = sortField;
                params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
            }

            // Add filter parameters
            if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
                if (this.filteredInfo.position_name && this.filteredInfo.position_name.length > 0) {
                    params.filter_position = this.filteredInfo.position_name.join(',');
                }
                if (this.filteredInfo.acceptance_status && this.filteredInfo.acceptance_status.length > 0) {
                    params.filter_status = this.filteredInfo.acceptance_status.join(',');
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

            // Update filter and sort state
            this.filteredInfo = filters;
            this.sortedInfo = sorter;

            // Reset to first page when filter/sort changes
            this.currentPage = 1;

            // Build complete parameters
            const params = this.buildApiParams({
                page: 1,
                per_page: this.pageSize
            });

            // Fetch job offers with new parameters
            this.fetchJobOffers(params);
        },

        // Map frontend table field names to backend field names
        mapSortField(field) {
            const fieldMapping = {
                'custom_offer_id': 'job_offer_id',
                'candidate_name': 'candidate_name',
                'position_name': 'position',
                'probation_salary': 'probation_salary',
                'post_probation_salary': 'post_probation_salary',
                'date': 'date',
                'acceptance_deadline': 'acceptance_deadline',
                'acceptance_status': 'status'
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

            this.fetchJobOffers(params);
        },

        clearAll() {
            this.filteredInfo = {};
            this.sortedInfo = {};
            this.searchCandidateName = '';
            this.currentPage = 1;

            const params = this.buildApiParams({
                page: 1,
                per_page: this.pageSize
            });

            this.fetchJobOffers(params);
        },

        async handleCandidateNameSearch() {
            // Validation: Check if search input is empty
            if (!this.searchCandidateName || this.searchCandidateName.trim() === '') {
                this.$message.warning('Please enter a candidate name to search');
                return;
            }

            this.searchLoading = true;
            try {
                const response = await jobOfferService.searchByCandidateName(this.searchCandidateName);

                // Check if the API returned success
                if (response.success === true && response.data) {
                    const jobOffersData = Array.isArray(response.data) ? response.data : [response.data];

                    // Format the job offers data
                    this.jobOffers = jobOffersData.map(jobOffer => ({
                        ...jobOffer,
                        date: jobOffer.date ? moment(jobOffer.date).format('YYYY-MM-DD') : '',
                        acceptance_deadline: jobOffer.acceptance_deadline ? moment(jobOffer.acceptance_deadline).format('YYYY-MM-DD') : ''
                    }));

                    // Update the pagination properties
                    this.total = jobOffersData.length;
                    this.currentPage = 1;
                    this.$message.success(response.message || 'Job offers found successfully');
                } else {
                    // Handle API response with success: false (404 - Not found)
                    this.jobOffers = [];
                    this.total = 0;
                    this.$message.warning(response.message || 'No job offers found for this candidate');
                }

                return response;
            } catch (error) {
                // Only network errors, auth errors, or parsing errors reach here
                console.error('Error searching job offers by candidate name:', error);
                this.$message.error('Network error: Failed to search job offers by candidate name');
                // Clear job offers on error
                this.jobOffers = [];
                this.total = 0;
            } finally {
                this.searchLoading = false;
            }
        },

        async fetchJobOffers(params = {}) {
            this.loading = true;
            try {
                const queryParams = {
                    page: params.page || this.currentPage || 1,
                    per_page: params.per_page || this.pageSize,
                    ...params
                };

                // Use the advanced paginated method for better server-side support
                const response = await jobOfferService.getAdvancedPaginatedJobOffers(queryParams);

                if (response.success && response.data) {
                    const jobOffersData = response.data;

                    this.jobOffers = jobOffersData.map(jobOffer => ({
                        ...jobOffer,
                        date: jobOffer.date ? moment(jobOffer.date).format('YYYY-MM-DD') : '',
                        acceptance_deadline: jobOffer.acceptance_deadline ? moment(jobOffer.acceptance_deadline).format('YYYY-MM-DD') : ''
                    }));

                    // Update pagination properties from server response
                    if (response.pagination) {
                        this.total = response.pagination.total;
                        this.currentPage = response.pagination.current_page;
                        this.pageSize = response.pagination.per_page;
                    } else {
                        this.total = response.data.length;
                        this.currentPage = 1;
                    }

                    this.$message.success('Job offers loaded successfully');
                } else {
                    this.jobOffers = [];
                    this.total = 0;
                    this.$message.error('No job offers data received');
                }
            } catch (error) {
                console.error('Error fetching job offers:', error);
                this.jobOffers = [];
                this.total = 0;
                this.$message.error('Failed to load job offers');
            } finally {
                this.loading = false;
            }
        },

        openAddJobOfferModal() {
            if (this.$refs.jobOffersModal) {
                this.$refs.jobOffersModal.editMode = false;
                this.$refs.jobOffersModal.jobOfferData = null;
                this.$refs.jobOffersModal.openModal();
            }
        },

        openEditJobOfferModal(jobOffer) {
            this.$refs.jobOffersModal.jobOfferData = jobOffer;
            this.$refs.jobOffersModal.editMode = true;
            this.$refs.jobOffersModal.openModal();
        },

        async deleteJobOffer(id) {
            try {
                await new Promise((resolve) => {
                    AntModal.confirm({
                        title: 'Move to Recycle Bin?',
                        content: 'You are about to move this job offer to the recycle bin. You can restore it later from the recycle bin.',
                        centered: true,
                        okText: 'Yes, move to recycle bin',
                        cancelText: 'Cancel',
                        onOk: async () => {
                            this.loading = true;
                            try {
                                await this.jobOfferStore.deleteJobOffer(id);
                                this.jobOffers = this.jobOffers.filter(jobOffer => jobOffer.id !== id);
                                this.total = this.jobOffers.length;
                                this.$message.success('Job offer moved to recycle bin successfully');
                                resolve();
                            } catch (error) {
                                console.error('Error moving job offer to recycle bin:', error);
                                this.$message.error('Failed to move job offer to recycle bin');
                                resolve();
                            } finally {
                                this.loading = false;
                            }
                        },
                        onCancel: () => {
                            resolve();
                        }
                    });
                });
            } catch (error) {
                console.error('Delete confirmation failed:', error);
            }
        },

        showNotification(title, message, className) {
            this.notificationTitle = title;
            this.notificationMessage = message;
            this.notificationClass = className;

            const toastEl = document.getElementById('notificationToast');
            const toast = new Toast(toastEl);
            toast.show();
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

/* Container overflow fixes */
.card-body {
    overflow: visible !important;
    padding-bottom: 0;
}

.card {
    overflow: visible !important;
    margin-bottom: 20px;
}
</style>

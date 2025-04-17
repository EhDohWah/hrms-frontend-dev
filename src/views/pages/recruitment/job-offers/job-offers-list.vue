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
                    <!-- Table Operations -->
                    <div class="table-operations">
                        <a-button @click="clearFilters">Clear filters</a-button>
                        <a-button @click="clearAll">Clear filters and sorters</a-button>
                    </div>
                    <!-- /Table Operations -->
                </div>
                <div class="card-body">
                    <div v-if="loading" class="text-center my-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading job offers...</p>
                    </div>
                    <div v-else>
                        <a-table :columns="columns" :data-source="tableData" :pagination="pagination"
                            :scroll="{ x: 'max-content' }" row-key="id" @change="handleTableChange">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'acceptance_status'">
                                    <span
                                        :class="`badge ${record.acceptance_status === 'accepted' ? 'bg-success' : record.acceptance_status === 'rejected' ? 'bg-danger' : 'bg-warning'}`">
                                        {{ record.acceptance_status }}
                                    </span>
                                </template>

                                <template v-if="column.dataIndex === 'actions'">
                                    <div class="action-icon d-inline-flex">
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
                    </div>
                </div>
            </div>
        </div>
        <layout-footer></layout-footer>
    </div>

    <!-- Job Offer Modal -->
    <job-offers-modal ref="jobOffersModal" @job-offer-added="fetchJobOffers" @job-offer-updated="fetchJobOffers" />

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

export default {
    name: 'JobOffersList',
    components: {
        JobOffersModal,
        indexBreadcrumb
    },
    setup() {
        const filteredInfo = ref({});
        const sortedInfo = ref({});
        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(0);
        const jobOfferStore = useJobOfferStore();

        const pagination = computed(() => ({
            total: total.value,
            current: currentPage.value,
            pageSize: pageSize.value,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} items`
        }));

        return {
            filteredInfo,
            sortedInfo,
            currentPage,
            pageSize,
            total,
            pagination,
            jobOfferStore
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
            notificationClass: ''
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
                    filters: this.getUniqueValues('custom_offer_id'),
                    filteredValue: filtered.custom_offer_id || null,
                    onFilter: (value, record) => record.custom_offer_id.includes(value),
                    sorter: (a, b) => a.custom_offer_id.localeCompare(b.custom_offer_id),
                    sortOrder: sorted.columnKey === 'custom_offer_id' && sorted.order,
                    filterSearch: true,
                },

                {
                    title: 'Candidate Name',
                    dataIndex: 'candidate_name',
                    key: 'candidate_name',
                    filters: this.getUniqueValues('candidate_name'),
                    filteredValue: filtered.candidate_name || null,
                    onFilter: (value, record) => record.candidate_name.includes(value),
                    sorter: (a, b) => a.candidate_name.localeCompare(b.candidate_name),
                    sortOrder: sorted.columnKey === 'candidate_name' && sorted.order,
                    filterSearch: true,
                },
                {
                    title: 'Position',
                    dataIndex: 'position_name',
                    key: 'position_name',
                    filters: this.getUniqueValues('position_name'),
                    filteredValue: filtered.position_name || null,
                    onFilter: (value, record) => record.position_name.includes(value),
                    sorter: (a, b) => a.position_name.localeCompare(b.position_name),
                    sortOrder: sorted.columnKey === 'position_name' && sorted.order,
                    filterSearch: true,
                },
                {
                    title: 'Date',
                    dataIndex: 'date',
                    key: 'date',
                    sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
                    sortOrder: sorted.columnKey === 'date' && sorted.order,
                },
                {
                    title: 'Deadline',
                    dataIndex: 'acceptance_deadline',
                    key: 'acceptance_deadline',
                    sorter: (a, b) => moment(a.acceptance_deadline).unix() - moment(b.acceptance_deadline).unix(),
                    sortOrder: sorted.columnKey === 'acceptance_deadline' && sorted.order,
                },
                {
                    title: 'Status',
                    dataIndex: 'acceptance_status',
                    key: 'acceptance_status',
                    filters: [
                        { text: 'Pending', value: 'pending' },
                        { text: 'Accepted', value: 'accepted' },
                        { text: 'Rejected', value: 'rejected' },
                    ],
                    filteredValue: filtered.acceptance_status || null,
                    onFilter: (value, record) => record.acceptance_status === value,
                    sorter: (a, b) => a.acceptance_status.localeCompare(b.acceptance_status),
                    sortOrder: sorted.columnKey === 'acceptance_status' && sorted.order,
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
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

        async downloadJobOfferPDF(custom_offer_id) {
            try {
                const blob = await jobOfferService.generateJobOfferPDF(custom_offer_id);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
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

        getUniqueValues(field) {
            const values = [...new Set(this.jobOffers.map(item => item[field]))].filter(Boolean);
            return values.map(value => ({ text: value, value }));
        },

        handleTableChange(pagination, filters, sorter) {
            console.log('Various parameters', pagination, filters, sorter);
            this.currentPage = pagination.current;
            this.pageSize = pagination.pageSize;
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

        async fetchJobOffers() {
            this.loading = true;

            try {
                await this.jobOfferStore.fetchJobOffers();

                if (this.jobOfferStore.jobOffers) {
                    this.jobOffers = this.jobOfferStore.jobOffers.map(jobOffer => ({
                        ...jobOffer,
                        date: jobOffer.date ? moment(jobOffer.date).format('YYYY-MM-DD') : '',
                        acceptance_deadline: jobOffer.acceptance_deadline ? moment(jobOffer.acceptance_deadline).format('YYYY-MM-DD') : ''
                    }));
                    this.total = this.jobOffers.length;
                    this.$message.success('Job offers loaded successfully');
                }
            } catch (error) {
                console.error('Error fetching job offers:', error);
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
                        title: 'Are you sure?',
                        content: 'You are about to delete this job offer. This action cannot be undone.',
                        centered: true,
                        okText: 'Yes, delete',
                        cancelText: 'Cancel',
                        onOk: async () => {
                            this.loading = true;
                            try {
                                await this.jobOfferStore.deleteJobOffer(id);
                                this.jobOffers = this.jobOffers.filter(jobOffer => jobOffer.id !== id);
                                this.total = this.jobOffers.length;
                                this.$message.success('Job offer deleted successfully');
                                resolve();
                            } catch (error) {
                                console.error('Error deleting job offer:', error);
                                this.$message.error('Failed to delete job offer');
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
</style>

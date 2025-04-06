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
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">
                                        <i class="ti ti-file-type-pdf me-1"></i>Export as PDF
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript:void(0);" class="dropdown-item rounded-1">
                                        <i class="ti ti-file-type-xls me-1"></i>Export as Excel
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
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
                                <template v-if="column.dataIndex === 'actions'">
                                    <div class="action-icon d-inline-flex">
                                        <router-link :to="`/recruitment/job-offers/details/${record.id}`" class="me-2">
                                            <i class="ti ti-eye"></i>
                                        </router-link>
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
    <job-offers-modal ref="jobOffersModal" />


</template>

<script>
import { Modal as AntModal } from 'ant-design-vue';

export default {
    name: 'JobOffersList',
    data() {
        return {
            title: 'Job Offers',
            text: 'Job Offers List',
            text1: 'Job Offers List',
            loading: false,
            filteredInfo: null,
            sortedInfo: null,
            currentPage: 1,
            pageSize: 10,
            total: 50, // Total number of dummy records
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    sorter: (a, b) => a.name.localeCompare(b.name),
                    filteredValue: this.filteredInfo?.name || null,
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                    sorter: (a, b) => a.email.localeCompare(b.email),
                },
                {
                    title: 'Phone',
                    dataIndex: 'phone',
                    key: 'phone',
                },
                {
                    title: 'Position',
                    dataIndex: 'position',
                    key: 'position',
                    filters: [
                        { text: 'Developer', value: 'Developer' },
                        { text: 'Designer', value: 'Designer' },
                        { text: 'Manager', value: 'Manager' },
                    ],
                    filteredValue: this.filteredInfo?.position || null,
                    onFilter: (value, record) => record.position.includes(value),
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    filters: [
                        { text: 'Pending', value: 'Pending' },
                        { text: 'Accepted', value: 'Accepted' },
                        { text: 'Rejected', value: 'Rejected' },
                    ],
                    filteredValue: this.filteredInfo?.status || null,
                    onFilter: (value, record) => record.status.includes(value),
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                }
            ],
            // Dummy data for job offers
            jobOffers: Array.from({ length: 50 }, (_, i) => ({
                id: i + 1,
                name: `Candidate ${i + 1}`,
                email: `candidate${i + 1}@example.com`,
                phone: `+1 ${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                position: ['Developer', 'Designer', 'Manager'][Math.floor(Math.random() * 3)],
                status: ['Pending', 'Accepted', 'Rejected'][Math.floor(Math.random() * 3)],
            })),
        };
    },
    mounted() {
        // No need to fetch data as we're using dummy data
        this.loading = true;
        // Simulate loading delay
        setTimeout(() => {
            this.loading = false;
            this.$message.success('Job offers loaded successfully');
        }, 100);
    },
    methods: {
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            if (this.isCollapsed) {
                document.body.classList.add("header-collapse");
            } else {
                document.body.classList.remove("header-collapse");
            }
        },
        clearFilters() {
            this.filteredInfo = null;
        },
        clearAll() {
            this.filteredInfo = null;
            this.sortedInfo = null;
        },
        handleTableChange(pagination, filters, sorter) {
            this.currentPage = pagination.current;
            this.filteredInfo = filters;
            this.sortedInfo = sorter;
        },
        editJobOffer(id) {
            // Implementation for editing job offer
            console.log('Editing job offer with ID:', id);
        },
        deleteJobOffer(id) {
            try {
                AntModal.confirm({
                    title: 'Are you sure?',
                    content: 'You are about to delete this job offer. This action cannot be undone.',
                    okText: 'Yes, Delete',
                    okType: 'danger',
                    cancelText: 'Cancel',
                    onOk: async () => {
                        this.loading = true;
                        try {
                            // Simulate deletion
                            this.jobOffers = this.jobOffers.filter(offer => offer.id !== id);
                            this.$message.success('Job offer deleted successfully');
                        } catch (error) {
                            console.error('Error deleting job offer:', error);
                            this.$message.error('Failed to delete job offer');
                        } finally {
                            this.loading = false;
                        }
                    }
                });
            } catch (error) {
                console.error('Delete confirmation failed:', error);
            }
        },
        openAddJobOfferModal() {
            // Prepare the data to pass to the modal 
            const jobOfferData = {
                name: 'Giovanni',
                email: 'giovanni@gmail.com',
                phone: '+1 234 567 890',
                position: 'Developer',
                status: 'Pending'
            };
            // Use the template ref to call the child's method
            this.$refs.jobOffersModal.setData(jobOfferData);
            // Open the modal with the data
            this.$refs.jobOffersModal.open(jobOfferData);
        }
    },
    computed: {
        tableData() {
            return this.jobOffers;
        },
        pagination() {
            return {
                current: this.currentPage,
                pageSize: this.pageSize,
                total: this.total,
                showSizeChanger: true,
                showQuickJumper: true
            };
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

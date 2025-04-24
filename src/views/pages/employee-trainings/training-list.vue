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
                        <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#add_training"
                            class="btn btn-primary d-flex align-items-center"><i class="ti ti-circle-plus me-2"></i>Add
                            New
                            Training</a>
                    </div>

                    <!-- Delete selected trainings button -->
                    <div class="mb-2 me-2">
                        <a href="javascript:void(0);" class="btn btn-danger d-flex align-items-center"
                            @click="confirmDeleteSelectedTrainings"
                            :class="{ 'disabled': selectedRowKeys.length === 0 }">
                            <i class="ti ti-trash me-2"></i>Delete Selected
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

            <div class="row">
                <!-- Total Trainings -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-primary rounded-circle"><i
                                            class="ti ti-book"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Total Trainings</p>
                                    <h4>{{ trainingStats.totalTrainings || 0 }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-purple badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    100% Total
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Total Trainings -->

                <!-- Completed Trainings -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-success rounded-circle"><i
                                            class="ti ti-check"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Completed</p>
                                    <h4>{{ trainingStats.completedTrainings || 0 }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-primary badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ trainingStats.totalTrainings ? ((trainingStats.completedTrainings /
                                        trainingStats.totalTrainings) * 100).toFixed(1) : 0 }}% of Total
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Completed Trainings -->

                <!-- Ongoing Trainings  -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-warning rounded-circle"><i
                                            class="ti ti-hourglass"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Ongoing</p>
                                    <h4>{{ trainingStats.ongoingTrainings || 0 }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-secondary badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ trainingStats.totalTrainings ? ((trainingStats.ongoingTrainings /
                                        trainingStats.totalTrainings) * 100).toFixed(1) : 0 }}% of Total
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Ongoing Trainings -->

                <!-- Upcoming Trainings -->
                <div class="col-lg-3 col-md-6 d-flex">
                    <div class="card flex-fill">
                        <div class="card-body d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center overflow-hidden">
                                <div>
                                    <span class="avatar avatar-lg bg-info rounded-circle"><i
                                            class="ti ti-calendar-event"></i></span>
                                </div>
                                <div class="ms-2 overflow-hidden">
                                    <p class="fs-12 fw-medium mb-1 text-truncate">Upcoming</p>
                                    <h4>{{ trainingStats.upcomingTrainings || 0 }}</h4>
                                </div>
                            </div>
                            <div>
                                <span class="badge badge-soft-dark badge-sm fw-normal">
                                    <i class="ti ti-arrow-wave-right-down"></i>
                                    {{ trainingStats.totalTrainings ? ((trainingStats.upcomingTrainings /
                                        trainingStats.totalTrainings) * 100).toFixed(1) : 0 }}% of Total
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Upcoming Trainings -->
            </div>

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Training List</h5>

                    <div class="table-operations">
                        <a-button @click="clearFilters">Clear filters</a-button>
                        <a-button @click="clearAll">Clear filters and sorters</a-button>
                    </div>
                </div>

                <div class="card-body p-0">
                    <div class="custom-datatable-filter table-responsive">
                        <div v-if="loading" class="text-center my-3">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Loading trainings...</p>
                        </div>

                        <a-table v-else class="table datatable thead-light bordered-table" :columns="columns"
                            :scroll="{ x: 1500, y: 700 }" :data-source="trainings" :row-selection="rowSelection"
                            :pagination="pagination" @change="handleChange" :bordered="true"
                            :row-key="record => record.id">
                            <!-- Training Name column with highlighting -->
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'trainingName'">
                                    <div class="d-flex align-items-center file-name-icon">
                                        <div>
                                            <h6 class="fw-medium">
                                                <router-link :to="`/training/training-details/${record.id}`">
                                                    {{ record.trainingName }}
                                                </router-link>
                                            </h6>
                                            <router-link :to="`/training/training-details/${record.id}`">
                                                <span class="d-block mt-1">{{ record.trainingType }}</span>
                                            </router-link>
                                        </div>
                                    </div>
                                </template>

                                <!-- Status column -->
                                <template v-if="column.key === 'status'">
                                    <a-badge :status="record.status === 'Completed'
                                        ? 'success'
                                        : record.status === 'Ongoing'
                                            ? 'processing'
                                            : record.status === 'Upcoming'
                                                ? 'warning'
                                                : 'default'
                                        " :text="record.status" />
                                </template>

                                <!-- Action column -->
                                <template v-if="column.key === 'action'">
                                    <div class="action-icon d-inline-flex">
                                        <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal"
                                            data-bs-target="#edit_training"><i class="ti ti-edit"></i></a>
                                        <a href="javascript:void(0);" @click="confirmDeleteTraining(record.id)"><i
                                                class="ti ti-trash"></i></a>
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
    <!-- /Page Wrapper -->
    <training-list-modal></training-list-modal>
</template>

<script>
import moment from "moment";
import { Modal } from 'ant-design-vue';

export default {
    data() {
        return {
            trainings: [],
            title: "Training",
            text: "Training",
            text1: "Training List",
            loading: false,
            selectedRowKeys: [],

            // Pagination
            page: 1,
            perPage: 10,

            searchTerm: '',

            // Training statistics
            trainingStats: {
                totalTrainings: 0,
                completedTrainings: 0,
                ongoingTrainings: 0,
                upcomingTrainings: 0
            },

            // Filter and sort info
            filteredInfo: {},
            sortedInfo: {},
        };
    },

    computed: {
        // Define columns with filters and sorters
        columns() {
            const filtered = this.filteredInfo || {};
            const sorted = this.sortedInfo || {};

            return [
                {
                    title: 'Training Name',
                    dataIndex: 'trainingName',
                    key: 'trainingName',
                    width: 200,
                    fixed: 'left',
                    filters: this.getUniqueValues('trainingName'),
                    filteredValue: filtered.trainingName || null,
                    onFilter: (value, record) => record.trainingName === value,
                    sorter: (a, b) => {
                        a = (a.trainingName || '').toLowerCase();
                        b = (b.trainingName || '').toLowerCase();
                        return a.localeCompare(b);
                    },
                    sortOrder: sorted.columnKey === 'trainingName' && sorted.order,
                },
                {
                    title: 'Training Type',
                    dataIndex: 'trainingType',
                    key: 'trainingType',
                    width: 150,
                    filters: this.getUniqueValues('trainingType'),
                    filteredValue: filtered.trainingType || null,
                    onFilter: (value, record) => record.trainingType === value,
                    sorter: (a, b) => {
                        a = a.trainingType.toLowerCase();
                        b = b.trainingType.toLowerCase();
                        return a.localeCompare(b);
                    },
                    sortOrder: sorted.columnKey === 'trainingType' && sorted.order,
                },
                {
                    title: 'Department',
                    dataIndex: 'department',
                    key: 'department',
                    width: 150,
                    filters: this.getUniqueValues('department'),
                    filteredValue: filtered.department || null,
                    onFilter: (value, record) => record.department === value,
                    sorter: (a, b) => {
                        a = a.department.toLowerCase();
                        b = b.department.toLowerCase();
                        return a.localeCompare(b);
                    },
                    sortOrder: sorted.columnKey === 'department' && sorted.order,
                },
                {
                    title: 'Start Date',
                    dataIndex: 'startDate',
                    key: 'startDate',
                    width: 120,
                    sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
                    sortOrder: sorted.columnKey === 'startDate' && sorted.order,
                },
                {
                    title: 'End Date',
                    dataIndex: 'endDate',
                    key: 'endDate',
                    width: 120,
                    sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix(),
                    sortOrder: sorted.columnKey === 'endDate' && sorted.order,
                },
                {
                    title: 'Duration',
                    dataIndex: 'duration',
                    key: 'duration',
                    width: 120,
                    sorter: (a, b) => parseInt(a.duration) - parseInt(b.duration),
                    sortOrder: sorted.columnKey === 'duration' && sorted.order,
                },
                {
                    title: 'Trainer',
                    dataIndex: 'trainer',
                    key: 'trainer',
                    width: 150,
                    filters: this.getUniqueValues('trainer'),
                    filteredValue: filtered.trainer || null,
                    onFilter: (value, record) => record.trainer === value,
                    sorter: (a, b) => {
                        a = a.trainer.toLowerCase();
                        b = b.trainer.toLowerCase();
                        return a.localeCompare(b);
                    },
                    sortOrder: sorted.columnKey === 'trainer' && sorted.order,
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: 120,
                    filters: [
                        { text: 'Completed', value: 'Completed' },
                        { text: 'Ongoing', value: 'Ongoing' },
                        { text: 'Upcoming', value: 'Upcoming' },
                        { text: 'Cancelled', value: 'Cancelled' }
                    ],
                    filteredValue: filtered.status || null,
                    onFilter: (value, record) => record.status === value,
                    sorter: (a, b) => {
                        a = a.status.toLowerCase();
                        b = b.status.toLowerCase();
                        return a.localeCompare(b);
                    },
                    sortOrder: sorted.columnKey === 'status' && sorted.order,
                },
                {
                    title: 'Participants',
                    dataIndex: 'participants',
                    key: 'participants',
                    width: 120,
                    sorter: (a, b) => parseInt(a.participants) - parseInt(b.participants),
                    sortOrder: sorted.columnKey === 'participants' && sorted.order,
                },
                {
                    title: 'Actions',
                    key: 'action',
                    fixed: 'right',
                    width: 100,
                    sorter: false,
                },
            ];
        },

        pagination() {
            return {
                current: this.page,
                pageSize: this.perPage,
                total: this.trainings.length,
                showTotal: total => `Total ${total} trainings`,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50', '100'],
                onChange: (page, size) => {
                    this.page = page;
                    this.perPage = size;
                },
                onShowSizeChange: (page, size) => {
                    this.page = page;
                    this.perPage = size;
                }
            };
        },

        rowSelection() {
            return {
                type: 'checkbox',
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onSelectChange,
                getCheckboxProps: (record) => ({
                    disabled: record.status === 'Completed', // Disable selection for completed trainings
                    name: record.trainingName,
                }),
            };
        }
    },

    mounted() {
        this.fetchTrainings();
    },

    methods: {
        // Row selection change handler
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            console.log('selectedRows: ', selectedRows);
        },

        // Confirm delete selected trainings
        confirmDeleteSelectedTrainings() {
            if (this.selectedRowKeys.length === 0) {
                this.$message.warning('Please select at least one training to delete');
                return;
            }

            Modal.confirm({
                title: `Are you sure you want to delete ${this.selectedRowKeys.length} selected training(s)?`,
                content: 'This will delete all selected trainings and their associated data. This action cannot be undone.',
                centered: true,
                okText: 'Yes, Delete All',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: () => {
                    this.deleteSelectedTrainings();
                }
            });
        },

        // Delete selected trainings
        async deleteSelectedTrainings() {
            try {
                // In a real app, you would call your API here
                this.trainings = this.trainings.filter(training => !this.selectedRowKeys.includes(training.id));
                this.updateTrainingStats();

                this.$message.success(`Successfully deleted ${this.selectedRowKeys.length} training(s)`);
                this.selectedRowKeys = []; // Clear selection
            } catch (error) {
                this.$message.error('Failed to delete some or all trainings');
                console.error("Error deleting trainings:", error);
            }
        },

        // Get unique values for filter dropdowns
        getUniqueValues(field) {
            if (!this.trainings || this.trainings.length === 0) return [];

            const uniqueValues = [...new Set(this.trainings.map(item => item[field]))].filter(Boolean);
            return uniqueValues.map(value => ({ text: value, value }));
        },

        // Confirm delete training
        confirmDeleteTraining(id) {
            Modal.confirm({
                title: 'Are you sure you want to delete this training?',
                content: 'This will delete the training and all associated items. This action cannot be undone.',
                centered: true,
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => {
                    this.deleteTraining(id);
                }
            });
        },

        async deleteTraining(id) {
            if (!id) return;

            try {
                // In a real app, you would call your API here
                this.trainings = this.trainings.filter(training => training.id !== id);
                this.updateTrainingStats();

                this.$message.success('Training deleted successfully');
            } catch (error) {
                this.$message.error('Failed to delete training');
                console.error("Error deleting training:", error);
            }
        },

        // Handle table change (pagination, filters, sorter)
        handleChange(pagination, filters, sorter) {
            this.filteredInfo = filters || {};
            this.sortedInfo = sorter || {};
        },

        // Clear all filters
        clearFilters() {
            this.filteredInfo = {};
        },

        // Clear all filters and sorters
        clearAll() {
            this.filteredInfo = {};
            this.sortedInfo = {};
        },

        toggleHeader() {
            document.getElementById("collapse-header").classList.toggle("active");
            document.body.classList.toggle("header-collapse");
        },

        updateTrainingStats() {

            this.trainingStats = {
                totalTrainings: this.trainings.length,
                completedTrainings: this.trainings.filter(t => t.status === 'Completed').length,
                ongoingTrainings: this.trainings.filter(t => t.status === 'Ongoing').length,
                upcomingTrainings: this.trainings.filter(t => t.status === 'Upcoming').length
            };
        },

        async fetchTrainings() {
            this.loading = true;
            try {
                // In a real app, you would fetch from an API
                // For now, we'll use mock data
                setTimeout(() => {
                    this.trainings = [
                        {
                            id: 1,
                            trainingName: 'Health and Safety Training',
                            trainingType: 'Mandatory',
                            department: 'All Departments',
                            startDate: '2023-06-01',
                            endDate: '2023-06-05',
                            duration: '5 days',
                            trainer: 'John Smith',
                            status: 'Completed',
                            participants: '45'
                        },
                        {
                            id: 2,
                            trainingName: 'Leadership Development',
                            trainingType: 'Professional',
                            department: 'Management',
                            startDate: '2023-07-10',
                            endDate: '2023-07-14',
                            duration: '5 days',
                            trainer: 'Sarah Johnson',
                            status: 'Completed',
                            participants: '12'
                        },
                        {
                            id: 3,
                            trainingName: 'Customer Service Excellence',
                            trainingType: 'Soft Skills',
                            department: 'Customer Support',
                            startDate: '2023-08-15',
                            endDate: '2023-08-17',
                            duration: '3 days',
                            trainer: 'Michael Brown',
                            status: 'Ongoing',
                            participants: '20'
                        },
                        {
                            id: 4,
                            trainingName: 'Project Management Fundamentals',
                            trainingType: 'Professional',
                            department: 'Project Management',
                            startDate: '2023-09-05',
                            endDate: '2023-09-09',
                            duration: '5 days',
                            trainer: 'Emily Davis',
                            status: 'Upcoming',
                            participants: '15'
                        },
                        {
                            id: 5,
                            trainingName: 'Data Analysis with Excel',
                            trainingType: 'Technical',
                            department: 'Finance',
                            startDate: '2023-10-10',
                            endDate: '2023-10-12',
                            duration: '3 days',
                            trainer: 'Robert Wilson',
                            status: 'Upcoming',
                            participants: '18'
                        }
                    ];

                    this.updateTrainingStats();
                    this.loading = false;
                }, 1000);
            } catch (error) {
                console.error("Error fetching trainings:", error);
                this.$message.error('Failed to load trainings');
                this.loading = false;
            }
        }
    },
};
</script>

<style scoped>
:deep(.ant-select-selector) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    min-width: 80px;
}

.table-operations {
    margin-bottom: 16px;
}

.table-operations>button {
    margin-right: 8px;
}

.bordered-table {
    border: 1px solid #e0e0e0;
}

:deep(.ant-table-bordered .ant-table-thead > tr > th),
:deep(.ant-table-bordered .ant-table-tbody > tr > td) {
    border-right: 1px solid #e0e0e0;
}

:deep(.ant-table-bordered .ant-table-thead > tr > th) {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
}

/* Make scrollbar bigger and more visible */
:deep(.ant-table-body)::-webkit-scrollbar {
    width: 14px;
    height: 14px;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 7px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 7px;
    border: 3px solid #f1f1f1;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>

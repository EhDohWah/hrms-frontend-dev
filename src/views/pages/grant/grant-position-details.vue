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
                        <button class="btn btn-primary d-flex align-items-center" @click="openAddGrantPositionModal">
                            <i class="ti ti-circle-plus me-2"></i>Allocate Employee
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

            <div class="row">
                <!-- Grant Position Details Card -->
                <div class="col-md-12">
                    <div class="card shadow-sm">
                        <div class="card-header bg-light">
                            <h5 class="mb-0"><i class="ti ti-file-description me-2"></i>Grant Position Details</h5>
                        </div>
                        <div class="card-body">
                            <div v-if="loading" class="text-center my-3">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <p class="mt-2">Loading position details...</p>
                            </div>
                            <div v-else-if="!positionDetails" class="text-center my-3">
                                <div class="alert alert-info">
                                    <i class="ti ti-info-circle me-2"></i>No position details found.
                                </div>
                            </div>
                            <div v-else>
                                <div class="row">
                                    <div class="col-md-4 mb-4">
                                        <div class="position-stat-card text-center p-4 bg-light rounded">
                                            <h6 class="text-muted mb-2">MANPOWER REQUIRED</h6>
                                            <div class="display-3 fw-bold text-primary mb-0">
                                                {{ positionDetails.manPower }}
                                            </div>

                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label text-muted small">GRANT CODE</label>
                                                    <p class="fw-medium">{{ positionDetails.code }}</p>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label text-muted small">BUDGET LINE</label>
                                                    <p class="fw-medium">{{ positionDetails.budgetLine }}</p>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label class="form-label text-muted small">GRANT NAME</label>
                                                    <p class="fw-medium">{{ positionDetails.grantName }}</p>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label text-muted small">POSITION NAME</label>
                                                    <p class="fw-medium">{{ positionDetails.positionName }}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-0">
                                            <label class="form-label text-muted small">STATUS</label>
                                            <div>
                                                <span class="badge" :class="getStatusClass(positionDetails.status)">
                                                    {{ positionDetails.status }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Grant Position Details Card -->

                <!-- Employee Allocations Card -->
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                            <h5>Employee Allocations</h5>
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
                                <p class="mt-2">Loading employee allocations...</p>
                            </div>
                            <div v-else>
                                <a-table :columns="columns" :data-source="employeeAllocations" :pagination="pagination"
                                    :scroll="{ x: 'max-content' }" row-key="id" @change="handleTableChange">
                                    <template #bodyCell="{ column, record }">
                                        <template v-if="column.dataIndex === 'active'">
                                            <span class="badge" :class="record.active ? 'bg-success' : 'bg-danger'">
                                                {{ record.active ? 'Active' : 'Inactive' }}
                                            </span>
                                        </template>
                                        <template v-if="column.dataIndex === 'actions'">
                                            <div class="action-icon d-inline-flex">
                                                <a href="javascript:void(0);" class="me-2"
                                                    @click="openEditEmployeeAllocationModal(record)">
                                                    <i class="ti ti-edit"></i>
                                                </a>
                                                <a href="javascript:void(0);"
                                                    @click="deleteEmployeeAllocation(record.allocationId)">
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
                <!-- /Employee Allocations Card -->
            </div>
        </div>
        <layout-footer></layout-footer>
    </div>

    <!-- Grant allocate employee modal -->
    <grant-allocate-employee-modal ref="grantAllocateEmployeeModal" :grant-position-id="positionDetails?.positionId"
        :grant-position-name="positionDetails?.positionName" @childSubmit="handleGrantPositionSubmit" />
</template>

<script>
import { Modal as AntModal, message } from 'ant-design-vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useGrantStore } from '@/stores/grantStore';
import { ref, computed } from 'vue';
import moment from 'moment';
import { employeeGrantAllocationService } from '@/services/employee-grant-allocation.service';
import { grantService } from '@/services/grant.service';


export default {
    name: 'GrantPositionDetails',
    components: {
        indexBreadcrumb
    },
    setup() {
        const filteredInfo = ref({});
        const sortedInfo = ref({});
        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(0);
        const grantStore = useGrantStore();
        const isCollapsed = ref(false);

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
            grantStore,
            isCollapsed
        };
    },
    data() {
        return {
            title: 'Grant Position Details',
            text: 'Grants',
            text1: 'Grant Position Details',
            positionDetails: null,
            employeeAllocations: [],
            loading: false
        };
    },
    computed: {
        columns() {
            const filtered = this.filteredInfo || {};
            const sorted = this.sortedInfo || {};

            return [
                {
                    title: 'Staff ID',
                    dataIndex: 'staffId',
                    key: 'staffId',
                    sorter: (a, b) => a.staffId.localeCompare(b.staffId),
                    sortOrder: sorted.columnKey === 'staffId' && sorted.order,
                },
                {
                    title: 'Employee Name',
                    dataIndex: 'employeeName',
                    key: 'employeeName',
                    sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
                    sortOrder: sorted.columnKey === 'employeeName' && sorted.order,
                },
                {
                    title: 'Level of Effort (%)',
                    dataIndex: 'levelOfEffort',
                    key: 'levelOfEffort',
                    sorter: (a, b) => a.levelOfEffort - b.levelOfEffort,
                    sortOrder: sorted.columnKey === 'levelOfEffort' && sorted.order,
                },
                {
                    title: 'Start Date',
                    dataIndex: 'startDate',
                    key: 'startDate',
                    render: (text) => moment(text).format('DD/MM/YYYY'),
                    sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
                    sortOrder: sorted.columnKey === 'startDate' && sorted.order,
                },
                {
                    title: 'End Date',
                    dataIndex: 'endDate',
                    key: 'endDate',
                    render: (text) => text ? moment(text).format('DD/MM/YYYY') : 'N/A',
                    sorter: (a, b) => {
                        if (!a.endDate) return 1;
                        if (!b.endDate) return -1;
                        return moment(a.endDate).unix() - moment(b.endDate).unix();
                    },
                    sortOrder: sorted.columnKey === 'endDate' && sorted.order,
                },
                {
                    title: 'Status',
                    dataIndex: 'active',
                    key: 'active',
                    filters: [
                        { text: 'Active', value: true },
                        { text: 'Inactive', value: false },
                    ],
                    filteredValue: filtered.active || null,
                    onFilter: (value, record) => record.active === value,
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                },
            ];
        }
    },
    created() {
        this.fetchPositionDetails();
        this.fetchEmployeeAllocations();
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

        getStatusClass(status) {
            switch (status) {
                case 'Active':
                    return 'bg-success';
                case 'Pending':
                    return 'bg-warning';
                case 'Completed':
                    return 'bg-info';
                default:
                    return 'bg-secondary';
            }
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
        async fetchPositionDetails() {
            try {
                const id = this.$route.params.id;
                const response = await grantService.getGrantItemDetails(id);

                // Handle grant item (position) data
                if (response.data) {
                    this.positionDetails = {
                        positionId: response.data.id,
                        positionName: response.data.grant_position || 'N/A',
                        code: response.data.grant && response.data.grant.code ? response.data.grant.code : 'N/A',
                        grantName: response.data.grant && response.data.grant.name ? response.data.grant.name : 'N/A',
                        budgetLine: response.data.bg_line || 'N/A',
                        manPower: response.data.grant_position_number || 'N/A',
                        recruited: response.employees ? response.employees.length : 0,
                        finding: response.data.grant && response.data.grant.description ? response.data.grant.description : 'N/A',
                        status: response.data.active === '1' ? 'Active' : 'Inactive'
                    };
                }

            } catch (error) {
                console.error('Error fetching position details:', error);
                message.error('Failed to load position details');
                this.positionDetails = null;
            } finally {
                this.loading = false;
            }
        },

        async fetchEmployeeAllocations() {
            try {
                this.loading = true;
                const id = this.$route.params.id;
                const response = await employeeGrantAllocationService.getEmployeeGrantAllocationDetails(id);

                if (response.success) {

                    // Handle employee allocations
                    if (response.employee_grant_allocation && Array.isArray(response.employee_grant_allocation)) {
                        this.employeeAllocations = response.employee_grant_allocation.map(alloc => ({
                            allocationId: alloc.id,
                            employeeId: alloc.employee_id,
                            positionId: alloc.grant_items_id || 'N/A',
                            staffId: alloc.employee_allocation?.staff_id || 'N/A',
                            employeeName: `${alloc.employee_allocation?.first_name_en || 'N/A'} ${alloc.employee_allocation?.last_name_en !== '-' ? alloc.employee_allocation?.last_name_en : ''}`.trim() || 'N/A',
                            levelOfEffort: alloc.level_of_effort ? (parseFloat(alloc.level_of_effort) * 100) + '%' : 'N/A',
                            rawLevelOfEffort: alloc.level_of_effort,
                            startDate: alloc.start_date ? moment(alloc.start_date).format('DD MMM YYYY') : 'N/A',
                            endDate: alloc.end_date ? moment(alloc.end_date).format('DD MMM YYYY') : 'N/A',
                            rawStartDate: alloc.start_date,
                            rawEndDate: alloc.end_date,
                            active: alloc.active === '1'
                        }));
                    } else {
                        this.employeeAllocations = [];
                    }

                    // Use total_allocations from the response
                    this.total = response.total_allocations || 0;
                    message.success(response.message || 'Employee allocations loaded successfully');
                } else {
                    throw new Error(response.message || 'Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching position and employee allocations:', error);
                message.error('Failed to load position and employee allocations');
                this.positionDetails = null;
                this.employeeAllocations = [];
            } finally {
                this.loading = false;
            }
        },

        openAddGrantPositionModal() {
            this.$refs.grantAllocateEmployeeModal.openModal();
        },

        openEditEmployeeAllocationModal(record) {
            // For Edit (pass full record, with employeeId, levelOfEffort, startDate, endDate)
            this.$refs.grantAllocateEmployeeModal.openModalEdit({
                allocationId: record.allocationId,
                employeeId: record.employeeId,
                levelOfEffort: record.rawLevelOfEffort,
                startDate: record.rawStartDate,
                endDate: record.rawEndDate
            });
        },

        async deleteEmployeeAllocation(id) {
            try {
                await new Promise((resolve) => {
                    AntModal.confirm({
                        title: 'Are you sure?',
                        content: 'You are about to delete this employee allocation. This action cannot be undone.',
                        centered: true,
                        okText: 'Yes, delete',
                        cancelText: 'Cancel',
                        onOk: async () => {
                            this.loading = true;
                            try {
                                // Call the API to delete the allocation
                                const response = await employeeGrantAllocationService.deleteEmployeeGrantAllocation(id);
                                console.log(response);
                                if (response.success) {
                                    // Remove the deleted allocation from the local array
                                    this.employeeAllocations = this.employeeAllocations.filter(allocation => allocation.id !== id);
                                    this.total = this.employeeAllocations.length;
                                    message.success(response.message || 'Employee allocation deleted successfully');
                                    this.fetchEmployeeAllocations();

                                } else {
                                    throw new Error(response.message || 'Failed to delete employee allocation');
                                }
                                resolve();
                            } catch (error) {
                                console.error('Error deleting employee allocation:', error);
                                message.error(error.message || 'Failed to delete employee allocation');
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

        async handleGrantPositionSubmit(response) {
            this.loading = true;
            try {
                // Check if the submission was successful
                if (response.success) {
                    // Display success message
                    message.success(response.message || 'Grant position saved successfully');

                    // Refresh the grant positions list to show the updated data
                    try {
                        await this.fetchEmployeeAllocations();
                    } catch (fetchError) {
                        message.warning('Position saved but could not refresh the list');
                    }
                } else {
                    // Log the failure and display an error message to the user
                    message.error(response.message || 'Failed to save grant position');
                }
            } catch (error) {
                message.error('An unexpected error occurred while processing your request');
            } finally {
                this.loading = false;
            }
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

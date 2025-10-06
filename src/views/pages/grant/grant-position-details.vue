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
                                            <small class="text-muted">Total Allocated: {{ positionDetails.recruited || 0
                                                }}</small>
                                            <br>
                                            <small class="text-success">Active Allocations: {{ totalActiveAllocations
                                                }}</small>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="h-100 p-4 bg-white rounded-4 shadow-sm">
                                            <h6 class="text-primary mb-3 fw-bold">
                                                <i class="bi bi-journal-text me-2"></i>Grant Information
                                            </h6>
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-tag text-primary me-2"></i>
                                                <span class="text-muted small fw-semibold">GRANT CODE :</span>
                                                <span class="ms-auto fw-semibold">{{ positionDetails.code }}</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-journal-text text-success me-2"></i>
                                                <span class="text-muted small fw-semibold">GRANT NAME :</span>
                                                <span class="ms-auto">{{ positionDetails.grantName }}</span>
                                            </div>
                                            <div class="d-flex align-items-center mt-3">
                                                <span class="text-muted fw-medium me-2">STATUS:</span>
                                                <div>
                                                    <span class="badge px-3 py-2 fs-12"
                                                        :class="getStatusClass(positionDetails.status)">
                                                        {{ positionDetails.status }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="h-100 p-4 bg-white rounded-4 shadow-sm">
                                            <h6 class="text-info mb-3 fw-bold">
                                                <i class="bi bi-person-badge me-2"></i>Grant Position Details
                                            </h6>
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-person-badge text-warning me-2"></i>
                                                <span class="text-muted small fw-semibold">POSITION NAME :</span>
                                                <span class="ms-auto">{{ positionDetails.positionName }}</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-cash-coin text-success me-2"></i>
                                                <span class="text-muted small fw-semibold">SALARY :</span>
                                                <span class="ms-auto">฿{{ positionDetails.salary }}</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-gift text-info me-2"></i>
                                                <span class="text-muted small fw-semibold">BENEFIT :</span>
                                                <span class="ms-auto">฿{{ positionDetails.benefit }}</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-percent text-primary me-2"></i>
                                                <span class="text-muted small fw-semibold">EFFORT :</span>
                                                <span class="ms-auto">{{ positionDetails.effort }}%</span>
                                            </div>
                                            <div class="d-flex align-items-center mb-2">
                                                <i class="bi bi-hash text-secondary me-2"></i>
                                                <span class="text-muted small fw-semibold">POSITION NUMBER :</span>
                                                <span class="ms-auto">{{ positionDetails.positionNumber }}</span>
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
                                    :scroll="{ x: 2000, y: 600 }" row-key="id" @change="handleTableChange">
                                    <template #bodyCell="{ column, record }">
                                        <template v-if="column.dataIndex === 'active'">
                                            <span class="badge" :class="record.active ? 'bg-success' : 'bg-danger'">
                                                {{ record.active ? 'Active' : 'Inactive' }}
                                            </span>
                                        </template>
                                        <template v-if="column.dataIndex === 'levelOfEffort'">
                                            {{ record.levelOfEffort }}%
                                        </template>
                                        <template v-if="column.dataIndex === 'allocatedAmount'">
                                            ฿{{ record.allocatedAmount }}
                                        </template>
                                        <template v-if="column.dataIndex === 'grantInfo'">
                                            <div class="grant-info">
                                                <div><strong>{{ record.grantName }}</strong></div>
                                                <small class="text-muted">{{ record.grantCode }}</small>
                                            </div>
                                        </template>
                                        <template v-if="column.dataIndex === 'budgetLine'">
                                            <div class="budget-line-info">
                                                <div><strong>{{ record.budgetLineCode }}</strong></div>
                                                <small class="text-muted">{{ record.budgetLineDescription }}</small>
                                            </div>
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
import { employeeFundingAllocationService } from '@/services/employee-funding-allocation.service';
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
            loading: false,
            totalActiveAllocations: 0,
            totalAllocations: 0
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
                    title: 'Grant Information',
                    dataIndex: 'grantInfo',
                    key: 'grantInfo',
                    sorter: (a, b) => a.grantName.localeCompare(b.grantName),
                    sortOrder: sorted.columnKey === 'grantInfo' && sorted.order,
                },
                {
                    title: 'Budget Line',
                    dataIndex: 'budgetLine',
                    key: 'budgetLine',
                    sorter: (a, b) => a.budgetLineCode.localeCompare(b.budgetLineCode),
                    sortOrder: sorted.columnKey === 'budgetLine' && sorted.order,
                },
                {
                    title: 'Level of Effort',
                    dataIndex: 'levelOfEffort',
                    key: 'levelOfEffort',
                    sorter: (a, b) => parseFloat(a.rawLevelOfEffort || 0) - parseFloat(b.rawLevelOfEffort || 0),
                    sortOrder: sorted.columnKey === 'levelOfEffort' && sorted.order,
                },
                {
                    title: 'Allocated Amount (THB)',
                    dataIndex: 'allocatedAmount',
                    key: 'allocatedAmount',
                    sorter: (a, b) => parseFloat(a.allocatedAmount || 0) - parseFloat(b.allocatedAmount || 0),
                    sortOrder: sorted.columnKey === 'allocatedAmount' && sorted.order,
                },
                {
                    title: 'Start Date',
                    dataIndex: 'startDate',
                    key: 'startDate',
                    sorter: (a, b) => moment(a.rawStartDate).unix() - moment(b.rawStartDate).unix(),
                    sortOrder: sorted.columnKey === 'startDate' && sorted.order,
                },
                {
                    title: 'End Date',
                    dataIndex: 'endDate',
                    key: 'endDate',
                    sorter: (a, b) => {
                        if (!a.rawEndDate) return 1;
                        if (!b.rawEndDate) return -1;
                        return moment(a.rawEndDate).unix() - moment(b.rawEndDate).unix();
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
                }

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
                        // New grant position fields
                        salary: response.data.grant_salary ? parseFloat(response.data.grant_salary).toFixed(2) : '0.00',
                        benefit: response.data.grant_benefit ? parseFloat(response.data.grant_benefit).toFixed(2) : '0.00',
                        effort: response.data.grant_level_of_effort ? Math.round(parseFloat(response.data.grant_level_of_effort) * 100) : 0,
                        positionNumber: response.data.grant_position_number || 'N/A',
                        recruited: 0, // Will be updated when allocations are fetched
                        finding: response.data.grant && response.data.grant.description ? response.data.grant.description : 'N/A',
                        status: (
                            (response.data.grant && response.data.grant.end_date && response.data.grant.end_date !== '') ||
                            (response.data.grant && response.data.grant.type === 'hub')
                        ) ? 'Active' : 'Inactive'
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

                // Fetch allocations using the employee funding allocation service
                const response = await employeeFundingAllocationService.getByGrantItem(this.$route.params.id);

                console.log('Employee allocations response:', response);

                if (response.success && response.data) {
                    // Map the allocations data according to the new API response structure
                    this.employeeAllocations = response.data.map(alloc => ({
                        id: alloc.id,
                        allocationId: alloc.id,
                        employeeId: alloc.employee_id,
                        employmentId: alloc.employment_id,
                        positionSlotId: alloc.position_slot_id,
                        staffId: alloc.employee?.staff_id || 'N/A',
                        employeeName: `${alloc.employee?.first_name_en || ''} ${alloc.employee?.last_name_en || ''}`.trim() || 'N/A',
                        grantName: alloc.grant_name || 'N/A',
                        grantCode: alloc.grant_code || 'N/A',
                        budgetLineCode: alloc.budgetline_code || 'N/A',
                        budgetLineDescription: alloc.budgetline_description || 'N/A',
                        levelOfEffort: alloc.level_of_effort ? Math.round(parseFloat(alloc.level_of_effort)) : 0,
                        rawLevelOfEffort: alloc.level_of_effort,
                        startDate: alloc.start_date ? moment(alloc.start_date).format('DD MMM YYYY') : 'N/A',
                        endDate: alloc.end_date ? moment(alloc.end_date).format('DD MMM YYYY') : 'N/A',
                        rawStartDate: alloc.start_date,
                        rawEndDate: alloc.end_date,
                        allocationType: alloc.allocation_type || 'N/A',
                        allocatedAmount: alloc.allocated_amount ? parseFloat(alloc.allocated_amount).toFixed(2) : '0.00',
                        active: true // Assume active since it's returned in the response
                    }));

                    // Update position details with recruited count using response metadata
                    if (this.positionDetails) {
                        this.positionDetails.recruited = response.total_allocations || this.employeeAllocations.length;
                    }

                    this.total = response.total_allocations || this.employeeAllocations.length;
                    this.totalActiveAllocations = response.active_allocations || this.employeeAllocations.filter(alloc => alloc.active).length;
                    this.totalAllocations = response.total_allocations || this.employeeAllocations.length;

                } else {
                    this.employeeAllocations = [];
                    this.total = 0;
                    this.totalActiveAllocations = 0;
                    this.totalAllocations = 0;

                    // Update position details with zero count
                    if (this.positionDetails) {
                        this.positionDetails.recruited = 0;
                    }
                }

            } catch (error) {
                console.error('Error fetching employee allocations:', error);
                message.error('Failed to load employee allocations');
                this.employeeAllocations = [];
                this.total = 0;
                this.totalActiveAllocations = 0;
                this.totalAllocations = 0;

                // Update position details with zero count on error
                if (this.positionDetails) {
                    this.positionDetails.recruited = 0;
                }
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
                                const response = await employeeFundingAllocationService.delete(id);
                                console.log(response);
                                if (response.success) {
                                    // Remove the deleted allocation from the local array
                                    this.employeeAllocations = this.employeeAllocations.filter(allocation => allocation.allocationId !== id);
                                    this.total = this.employeeAllocations.length;
                                    this.totalAllocations = this.employeeAllocations.length;
                                    this.totalActiveAllocations = this.employeeAllocations.filter(alloc => alloc.active).length;

                                    // Update recruited count
                                    if (this.positionDetails) {
                                        this.positionDetails.recruited = this.totalAllocations;
                                    }

                                    message.success(response.message || 'Employee allocation deleted successfully');

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
                    message.success(response.message || 'Employee allocation saved successfully');

                    // Refresh the employee allocations list to show the updated data
                    try {
                        await this.fetchEmployeeAllocations();
                    } catch (fetchError) {
                        message.warning('Allocation saved but could not refresh the list');
                    }
                } else {
                    // Log the failure and display an error message to the user
                    message.error(response.message || 'Failed to save employee allocation');
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

.grant-info {
    min-width: 150px;
}

.budget-line-info {
    min-width: 120px;
}

:deep(.ant-select-selector) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    min-width: 80px;
}

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

/* Ensure table container allows scrollbar display */
:deep(.ant-table-container) {
    border: 1px solid #e0e0e0;
    border-radius: 0;
}
</style>

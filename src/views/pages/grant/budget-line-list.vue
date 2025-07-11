<template>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
        <div class="content">
            <!-- Breadcrumb -->
            <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                <index-breadcrumb :title="title" :text="text" :text1="text1" />
                <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
                    <div class="mb-2 me-2">
                        <button class="btn btn-primary d-flex align-items-center" @click="openAddModal">
                            <i class="ti ti-circle-plus me-2"></i>Add Budget Line
                        </button>
                    </div>
                </div>
            </div>
            <!-- /Breadcrumb -->

            <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Budget Lines List</h5>
                    <div class="table-operations">
                        <a-button @click="clearFilters">Clear filters</a-button>
                        <a-button @click="clearAll">Clear filters and sorters</a-button>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="loading" class="text-center my-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading budget lines...</p>
                    </div>
                    <div v-else>
                        <a-table :columns="columns" :data-source="tableData" :pagination="pagination"
                            :scroll="{ x: 'max-content' }" row-key="id" @change="handleTableChange">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === 'actions'">
                                    <div class="action-icon d-inline-flex">
                                        <a href="javascript:void(0);" class="me-2" @click="openEditModal(record)">
                                            <i class="ti ti-edit"></i>
                                        </a>
                                        <a href="javascript:void(0);" class="text-danger"
                                            @click="confirmDelete(record)">
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

        <!-- Budget Line Modal -->
        <budget-line-modal ref="budgetLineModal" @saved="onSaved" :editData="editData" />

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
    </div>
</template>

<script>
import { Toast } from 'bootstrap';
import { Modal as AntModal } from 'ant-design-vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import BudgetLineModal from '@/components/modal/budget-line-modal.vue';
import { budgetLineService } from '@/services/budget-line.service';
import { ref, computed, onMounted } from 'vue';

export default {
    name: 'BudgetLineList',
    components: {
        indexBreadcrumb,
        BudgetLineModal
    },
    data() {
        return {
            title: 'Budget Lines',
            text: 'Finance',
            text1: 'Budget Lines',
            budgetLines: [],
            loading: false,
            searchTerm: '',
            notificationTitle: '',
            notificationMessage: '',
            notificationClass: '',
            filteredInfo: null,
            sortedInfo: null,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            editData: null
        };
    },
    computed: {
        columns() {
            const filtered = this.filteredInfo || {};
            const sorted = this.sortedInfo || {};

            return [
                {
                    title: 'Budget Line Code',
                    dataIndex: 'budget_line_code',
                    key: 'budget_line_code',
                    sorter: (a, b) => a.budget_line_code.localeCompare(b.budget_line_code),
                    sortOrder: sorted?.columnKey === 'budget_line_code' && sorted?.order,
                    filterSearch: true
                },
                {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    ellipsis: true,
                    sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
                    sortOrder: sorted?.columnKey === 'description' && sorted?.order
                },
                {
                    title: 'Created By',
                    dataIndex: 'created_by',
                    key: 'created_by'
                },
                {
                    title: 'Updated By',
                    dataIndex: 'updated_by',
                    key: 'updated_by'
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions'
                }
            ];
        },
        tableData() {
            return this.budgetLines.map(b => ({ ...b, key: b.id }));
        },
        pagination() {
            return {
                total: this.total,
                current: this.currentPage,
                pageSize: this.pageSize,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) => `Total ${total} items`
            };
        }
    },
    mounted() {
        this.fetchBudgetLines();
    },
    methods: {
        async fetchBudgetLines() {
            this.loading = true;
            try {
                const res = await budgetLineService.getAllBudgetLines();
                this.budgetLines = res.data || [];
                this.total = this.budgetLines.length;
            } catch (error) {
                this.$message.error('Failed to load budget lines');
            } finally {
                this.loading = false;
            }
        },
        handleTableChange(pagination, filters, sorter) {
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
        openAddModal() {
            this.editData = null;
            this.$refs.budgetLineModal.openModal();
        },
        openEditModal(record) {
            this.editData = { ...record };
            this.$refs.budgetLineModal.openModal(record);
        },
        confirmDelete(record) {
            AntModal.confirm({
                title: 'Are you sure you want to delete this budget line?',
                content: 'This action cannot be undone.',
                centered: true,
                okText: 'Yes, delete',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    this.loading = true;
                    try {
                        await budgetLineService.deleteBudgetLine(record.id);
                        this.$message.success('Budget line deleted successfully');
                        await this.fetchBudgetLines();
                    } catch (error) {
                        this.$message.error('Failed to delete budget line');
                    } finally {
                        this.loading = false;
                    }
                }
            });
        },
        onSaved() {
            this.fetchBudgetLines();
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
.table-operations {
    margin-bottom: 16px;
}

.table-operations>button {
    margin-right: 8px;
}

.action-icon a {
    margin-right: 8px;
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
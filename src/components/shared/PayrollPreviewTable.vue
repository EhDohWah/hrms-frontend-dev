<template>
    <div class="payroll-preview-table">
        <!-- Search -->
        <div class="mb-3">
            <a-input-search
                v-model:value="searchQuery"
                placeholder="Search by name, staff ID, department..."
                allow-clear
                size="small"
            />
        </div>

        <!-- Parent Table: Employee Info -->
        <a-table
            :columns="employeeColumns"
            :data-source="filteredEmployees"
            :row-key="record => record.employment_id"
            :pagination="filteredEmployees.length > 20 ? { pageSize: 20, showSizeChanger: true, showTotal: (total) => `${total} employees` } : false"
            :expand-column-width="40"
            v-model:expanded-row-keys="expandedKeys"
            size="small"
            bordered
            :scroll="{ x: 900 }"
        >
            <!-- Custom cell rendering -->
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                    <div class="d-flex align-items-center">
                        <strong>{{ record.name }}</strong>
                        <a-badge v-if="record.has_warnings" class="ms-2" count="!" :number-style="{ backgroundColor: '#faad14', fontSize: '10px' }" />
                    </div>
                </template>
                <template v-else-if="column.key === 'staff_id'">
                    <a-tag size="small" color="blue">{{ record.staff_id }}</a-tag>
                </template>
                <template v-else-if="column.key === 'organization'">
                    <a-tag :color="record.organization === 'SMRU' ? 'blue' : 'green'" size="small">
                        {{ record.organization }}
                    </a-tag>
                </template>
                <template v-else-if="column.key === 'allocation_count'">
                    <a-tag color="cyan" size="small">{{ record.allocation_count }}</a-tag>
                </template>
                <template v-else-if="column.key === 'total_gross'">
                    <span class="text-primary fw-semibold">฿{{ formatCurrency(record.total_gross) }}</span>
                </template>
                <template v-else-if="column.key === 'total_net'">
                    <span class="text-success fw-bold">฿{{ formatCurrency(record.total_net) }}</span>
                </template>
            </template>

            <!-- Nested Table: Payroll per Allocation -->
            <template #expandedRowRender="{ record }">
                <div class="nested-payroll-wrapper">
                    <div class="nested-header mb-2">
                        <i class="ti ti-file-invoice me-1"></i>
                        <strong>Payroll Allocations for {{ record.name }}</strong>
                        <a-tag class="ms-2" color="processing">{{ record.allocations?.length || 0 }} allocation(s)</a-tag>
                    </div>
                    <a-table
                        class="nested-payroll-table"
                        :columns="allocationColumns"
                        :data-source="record.allocations || []"
                        :row-key="r => r.allocation_id"
                        :pagination="false"
                        size="small"
                        bordered
                        :scroll="{ x: 2200 }"
                    >
                        <template #bodyCell="{ column, record: alloc }">
                            <!-- Grant Code -->
                            <template v-if="column.key === 'grant_code'">
                                <div>
                                    <strong>{{ alloc.grant_code }}</strong>
                                    <div class="text-muted small">{{ alloc.grant_name }}</div>
                                </div>
                            </template>
                            <!-- FTE -->
                            <template v-else-if="column.key === 'fte'">
                                <a-tag color="cyan" size="small">{{ alloc.fte }}</a-tag>
                            </template>
                            <!-- Grant Organization -->
                            <template v-else-if="column.key === 'grant_organization'">
                                <a-tag :color="alloc.grant_organization === 'SMRU' ? 'blue' : 'green'" size="small">
                                    {{ alloc.grant_organization }}
                                </a-tag>
                            </template>
                            <!-- Advance -->
                            <template v-else-if="column.key === 'needs_advance'">
                                <a-tag v-if="alloc.needs_advance" color="warning" size="small">
                                    {{ alloc.advance_from }} → {{ alloc.advance_to }}
                                </a-tag>
                                <span v-else class="text-muted">—</span>
                            </template>
                            <!-- Currency fields -->
                            <template v-else-if="currencyColumns.includes(column.key)">
                                <span :class="getCurrencyClass(column)">
                                    ฿{{ formatCurrency(getCellValue(alloc, column.key)) }}
                                </span>
                            </template>
                        </template>
                    </a-table>
                </div>
            </template>
        </a-table>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    name: 'PayrollPreviewTable',
    props: {
        employees: {
            type: Array,
            default: () => [],
        },
    },
    setup(props) {
        const searchQuery = ref('');
        const expandedKeys = ref([]);

        // Parent table columns
        const employeeColumns = [
            { title: 'Staff ID', dataIndex: 'staff_id', key: 'staff_id', width: 90, fixed: 'left' },
            { title: 'Employee Name', dataIndex: 'name', key: 'name', width: 180, fixed: 'left' },
            { title: 'Department', dataIndex: 'department', key: 'department', width: 160, ellipsis: true },
            { title: 'Position', dataIndex: 'position', key: 'position', width: 160, ellipsis: true },
            { title: 'Org', dataIndex: 'organization', key: 'organization', width: 80, align: 'center' },
            { title: 'Grant No.', key: 'allocation_count', width: 80, align: 'center' },
            { title: 'Total Gross', key: 'total_gross', width: 120, align: 'right' },
            { title: 'Total Net', key: 'total_net', width: 120, align: 'right' },
        ];

        // Nested allocation/payroll columns
        const allocationColumns = [
            // Allocation info
            { title: 'Grant', key: 'grant_code', width: 200, fixed: 'left' },
            { title: 'Org', key: 'grant_organization', width: 70, align: 'center' },
            { title: 'FTE', key: 'fte', width: 60, align: 'center' },
            // Salary
            { title: 'Gross Salary', key: 'gross_salary', width: 110, align: 'right' },
            { title: 'Gross (FTE)', key: 'gross_salary_by_fte', width: 110, align: 'right' },
            // Income additions
            { title: '13th Month', key: 'thirteen_month', width: 100, align: 'right', group: 'income' },
            { title: 'Comp. Refund', key: 'compensation_refund', width: 110, align: 'right', group: 'income' },
            // Deductions
            { title: 'Tax', key: 'tax', width: 90, align: 'right', group: 'deduction' },
            { title: 'Emp. SS', key: 'employee_ss', width: 90, align: 'right', group: 'deduction' },
            { title: 'Emp. HW', key: 'employee_hw', width: 90, align: 'right', group: 'deduction' },
            { title: 'Total Deduct.', key: 'total_deduction', width: 110, align: 'right', group: 'deduction' },
            // Employer contributions
            { title: 'PVD', key: 'pvd', width: 90, align: 'right', group: 'contribution' },
            { title: 'Saving Fund', key: 'saving_fund', width: 100, align: 'right', group: 'contribution' },
            { title: 'Empr. SS', key: 'employer_ss', width: 90, align: 'right', group: 'contribution' },
            { title: 'Empr. HW', key: 'employer_hw', width: 90, align: 'right', group: 'contribution' },
            // Totals
            { title: 'Total Income', key: 'total_income', width: 110, align: 'right' },
            { title: 'Net Salary', key: 'net_salary', width: 110, align: 'right' },
            // Advance
            { title: 'Advance', key: 'needs_advance', width: 130, align: 'center' },
        ];

        // Keys that display currency values
        const currencyColumns = [
            'gross_salary', 'gross_salary_by_fte',
            'thirteen_month', 'compensation_refund',
            'tax', 'employee_ss', 'employee_hw', 'total_deduction',
            'pvd', 'saving_fund', 'employer_ss', 'employer_hw',
            'total_income', 'net_salary',
        ];

        const filteredEmployees = computed(() => {
            if (!props.employees || !props.employees.length) return [];

            if (!searchQuery.value) return props.employees;

            const search = searchQuery.value.toLowerCase();
            return props.employees.filter(emp =>
                emp.name?.toLowerCase().includes(search) ||
                emp.staff_id?.toLowerCase().includes(search) ||
                emp.department?.toLowerCase().includes(search) ||
                emp.position?.toLowerCase().includes(search)
            );
        });

        const formatCurrency = (value) => {
            if (value === null || value === undefined || value === '') return '0.00';
            return parseFloat(value).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        };

        /**
         * Get the value from nested allocation object.
         * Payroll data is grouped in deductions/contributions/income_additions.
         */
        const getCellValue = (alloc, key) => {
            // Direct fields
            if (alloc[key] !== undefined) return alloc[key];
            // Check nested objects
            if (alloc.deductions && alloc.deductions[key] !== undefined) return alloc.deductions[key];
            if (alloc.contributions && alloc.contributions[key] !== undefined) return alloc.contributions[key];
            if (alloc.income_additions && alloc.income_additions[key] !== undefined) return alloc.income_additions[key];

            // Map special keys
            const keyMap = {
                'total_deduction': alloc.deductions?.total,
                'thirteen_month': alloc.income_additions?.thirteen_month,
                'compensation_refund': alloc.income_additions?.compensation_refund,
            };
            if (keyMap[key] !== undefined) return keyMap[key];

            return 0;
        };

        const getCurrencyClass = (column) => {
            if (column.key === 'net_salary') return 'text-success fw-bold';
            if (column.group === 'deduction') return 'text-danger';
            if (column.group === 'contribution') return 'text-info';
            if (column.group === 'income') return 'text-primary';
            return '';
        };

        return {
            searchQuery,
            expandedKeys,
            employeeColumns,
            allocationColumns,
            currencyColumns,
            filteredEmployees,
            formatCurrency,
            getCellValue,
            getCurrencyClass,
        };
    },
};
</script>

<style scoped>
.payroll-preview-table {
    width: 100%;
}

.nested-payroll-wrapper {
    padding: 8px 0;
}

.nested-header {
    font-size: 13px;
    color: #495057;
}

.nested-payroll-table :deep(.ant-table) {
    font-size: 12px;
}

.nested-payroll-table :deep(.ant-table-thead > tr > th) {
    background: #f0f5ff;
    font-size: 11px;
    padding: 6px 8px;
    white-space: nowrap;
}

.nested-payroll-table :deep(.ant-table-tbody > tr > td) {
    padding: 5px 8px;
}

.payroll-preview-table :deep(.ant-table-thead > tr > th) {
    font-size: 12px;
    padding: 8px 10px;
    white-space: nowrap;
}

.payroll-preview-table :deep(.ant-table-tbody > tr > td) {
    padding: 6px 10px;
}

.text-info {
    color: #17a2b8 !important;
}

.fw-semibold {
    font-weight: 600;
}
</style>

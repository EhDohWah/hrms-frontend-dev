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
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" class="" data-bs-toggle="tooltip" data-bs-placement="top"
              data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Header Section -->
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <button class="btn btn-link p-0 mb-2" @click="goBack">
            <i class="ti ti-arrow-left me-2"></i>
            Back to List
          </button>
          <h3 class="page-title mb-0">Add New Payroll Entry</h3>
          <p class="text-muted">Create payroll entry for employees with advanced table management</p>
        </div>
        <div class="header-actions">
          <a-button class="me-2" @click="resetTable">Reset Table</a-button>
          <a-button type="default" class="me-2" @click="saveDraft" :loading="saving">
            Save as Draft
          </a-button>
          <a-button type="primary" @click="submitForm" :loading="submitting" :disabled="!hasSelectedRows">
            Submit Selected ({{ selectedRowKeys.length }})
          </a-button>
        </div>
      </div>

      <!-- Employee Selection & Filters -->
      <div class="filter-section mb-4">
        <a-card size="small">
          <template #title>
            <div class="d-flex align-items-center">
              <i class="ti ti-filter me-2"></i>
              Employee Selection & Filters
            </div>
          </template>
          <div class="filter-content">
            <div class="filter-row">
              <div class="filter-item">
                <label class="filter-label">
                  <i class="ti ti-user me-1"></i>
                  Employee <span class="text-danger">*</span>
                  <span v-if="employeesLoading" class="text-muted ms-2">
                    <i class="ti ti-loader-2 spin"></i> Loading...
                  </span>
                </label>
                <a-tree-select v-model:value="selectedEmployeeFilter" @change="onEmployeeFilterChange"
                  placeholder="Select an employee..." allow-clear style="width: 280px" show-search
                  tree-default-expand-all :tree-data="employeeTreeData" tree-node-filter-prop="title"
                  :loading="employeesLoading" :disabled="employeesLoading">
                  <template #title="{ title, staff_id, subsidiary, status }">
                    <div class="employee-tree-option">
                      <div class="employee-main">
                        <strong>{{ staff_id }}</strong> {{ title }}
                      </div>
                      <div class="employee-details" v-if="staff_id">
                        <small class="text-muted">
                          {{ subsidiary }} •
                          <span :class="[
                            'badge badge-xs',
                            status === 'Local ID' ? 'bg-success' :
                              status === 'Local non ID' || status === 'Local non ID Staff' ? 'bg-primary' :
                                status === 'Expats' ? 'bg-warning' : 'bg-secondary'
                          ]">
                            {{ status }}
                          </span>
                        </small>
                      </div>
                    </div>
                  </template>
                </a-tree-select>
              </div>
              <div class="filter-item">
                <label class="filter-label">
                  <i class="ti ti-calendar me-1"></i>
                  Pay Period Date
                  <span v-if="calculationsLoading" class="text-muted ms-2">
                    <i class="ti ti-loader-2 spin"></i> Calculating...
                  </span>
                </label>
                <a-date-picker v-model:value="payPeriodDate" @change="onPayPeriodChange"
                  placeholder="Select pay period date" style="width: 200px" format="YYYY-MM-DD"
                  :disabled="!selectedEmployeeFilter || calculationsLoading" />
              </div>
              <div class="filter-item">
                <label class="filter-label">
                  <i class="ti ti-cash me-1"></i>
                  Funding Type
                </label>
                <a-select v-model:value="fundingTypeFilter" @change="applyFilters" placeholder="All Types" allow-clear
                  style="width: 200px">
                  <a-select-option value="">All Types</a-select-option>
                  <a-select-option value="org_funded">
                    <a-tag color="blue" class="me-1">ORG</a-tag>
                    Organization Funded
                  </a-select-option>
                  <a-select-option value="grant">
                    <a-tag color="green" class="me-1">GRANT</a-tag>
                    Grant Funded
                  </a-select-option>
                </a-select>
              </div>
              <div class="filter-item align-self-end">
                <a-button @click="resetFilters" type="default" class="reset-btn">
                  <template #icon><i class="ti ti-refresh"></i></template>
                  Reset Filters
                </a-button>
              </div>
            </div>
          </div>
        </a-card>
      </div>

      <!-- Initial empty state when no employee is selected -->
      <div v-if="!selectedEmployeeData && !employeesLoading" class="initial-empty-state mb-4">
        <a-card size="small">
          <div class="text-center py-5">
            <div class="empty-icon mb-3">
              <i class="ti ti-users-plus" style="font-size: 3rem; color: #cbd5e0;"></i>
            </div>
            <h5 class="text-muted mb-2">Get Started</h5>
            <p class="text-muted mb-3">Select an employee from the dropdown above to begin creating their payroll entry
            </p>
            <div class="text-muted small">
              <div class="d-flex justify-content-center align-items-center gap-4 mt-3">
                <div class="step-indicator">
                  <span class="step-number">1</span>
                  <span class="step-text">Select Employee</span>
                </div>
                <i class="ti ti-arrow-right text-muted"></i>
                <div class="step-indicator">
                  <span class="step-number">2</span>
                  <span class="step-text">Choose Pay Period</span>
                </div>
                <i class="ti ti-arrow-right text-muted"></i>
                <div class="step-indicator">
                  <span class="step-number">3</span>
                  <span class="step-text">Review & Submit</span>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </div>

      <!-- Selected Employee Info -->
      <div v-if="selectedEmployeeData" class="employee-info-section mb-4">
        <a-card size="small">
          <template #title>
            <div class="d-flex align-items-center">
              <i class="ti ti-user-check me-2"></i>
              Selected Employee Information
            </div>
          </template>
          <div class="employee-info-content">
            <div class="row">
              <div class="col-md-6">
                <div class="info-item">
                  <strong>{{ selectedEmployeeData.first_name_en }} {{ selectedEmployeeData.last_name_en }}</strong>
                </div>
                <div class="info-item">
                  <small class="text-muted">Staff ID: {{ selectedEmployeeData.staff_id }}</small>
                </div>
                <div class="info-item">
                  <small class="text-muted">Subsidiary: {{ selectedEmployeeData.subsidiary }}</small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-item">
                  <small class="text-muted">Department: {{
                    selectedEmployeeData.employment?.department?.name
                    }}</small>
                </div>
                <div class="info-item">
                  <small class="text-muted">Position: {{ selectedEmployeeData.employment?.position?.title
                    }}</small>
                </div>
                <div class="info-item">
                  <small class="text-muted">Allocations: {{ selectedEmployeeData.employee_funding_allocations?.length ||
                    0
                    }}</small>
                </div>
              </div>
            </div>

            <!-- Debug info (remove in production) -->
            <div class="mt-3 pt-3 border-top">
              <details>
                <summary class="text-muted small" style="cursor: pointer;">Debug: Employee Data Structure</summary>
                <pre class="small mt-2 p-2 bg-light rounded">{{ JSON.stringify(selectedEmployeeData, null, 2) }}</pre>
              </details>
            </div>

            <div v-if="payPeriodDate && selectedEmployeeCalculations.length > 0" class="mt-3 pt-3 border-top">
              <div class="d-flex align-items-center mb-2">
                <i class="ti ti-calculator me-2 text-success"></i>
                <span class="text-success fw-bold">Payroll Calculations Available for {{
                  payPeriodDate?.format('YYYY-MM-DD')
                }}</span>
              </div>
              <div class="calculation-summary">
                <small class="text-muted">
                  {{ selectedEmployeeCalculations.length }} allocation(s) calculated
                  • Total LOE: {{selectedEmployeeCalculations.reduce((sum, calc) => sum +
                    parseFloat(calc.loe_percentage), 0)
                    * 100}}%
                </small>
                <div class="row mt-2">
                  <div class="col-md-6">
                    <small class="text-muted d-block">Net Salary: <strong class="text-success">{{
                      formatCurrency(selectedEmployeeCalculations.reduce((sum, calc) => sum +
                        parseFloat(calc.calculations.net_salary), 0))}}</strong></small>
                  </div>
                  <div class="col-md-6">
                    <small class="text-muted d-block">Total Income: <strong class="text-info">{{
                      formatCurrency(selectedEmployeeCalculations.reduce((sum, calc) => sum +
                        parseFloat(calc.calculations.total_income), 0))}}</strong></small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </div>

      <!-- Empty state when employee is selected but no pay period date -->
      <div v-if="selectedEmployeeData && !payPeriodDate" class="empty-state-card mb-4">
        <a-card size="small">
          <div class="text-center py-4">
            <div class="empty-icon mb-3">
              <i class="ti ti-calendar-plus" style="font-size: 3rem; color: #cbd5e0;"></i>
            </div>
            <h5 class="text-muted mb-2">Select Pay Period Date</h5>
            <p class="text-muted mb-3">Please select a pay period date above to calculate and view payroll data for
              <strong>{{
                selectedEmployeeData.first_name_en }} {{ selectedEmployeeData.last_name_en }}</strong>
            </p>
            <div class="text-muted small">
              <i class="ti ti-info-circle me-1"></i>
              The system will calculate salary allocations, deductions, and net pay based on the selected date.
            </div>
          </div>
        </a-card>
      </div>

      <!-- Employee Payroll Table - Only show after pay period date is selected -->
      <div v-if="payPeriodDate && selectedEmployeeData" class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-2">Employee Payroll Data</h5>
              <div class="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                <p class="card-text">
                  This table shows the payroll calculations for the selected employee and pay period.
                </p>
                <!-- Table Operations -->
                <div class="table-operations d-flex align-items-center">
                  <span v-if="selectedRowKeys.length > 0" class="me-3">
                    <strong>{{ selectedRowKeys.length }}</strong> {{ selectedRowKeys.length === 1 ? 'item' : 'items' }}
                    selected
                  </span>
                  <div class="table-actions">
                    <a-space>
                      <a-button size="small" @click="resetFilters">Clear filters</a-button>
                      <a-button size="small" @click="resetTable">Reset All</a-button>
                    </a-space>
                  </div>
                </div>
                <!-- /Table Operations -->
              </div>
            </div>

            <div class="card-body">
              <!-- Loading Indicator -->
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading payroll data...</p>
              </div>

              <!-- Payroll Table -->
              <div v-else class="table-responsive">
                <a-table outlined :columns="columns" :data-source="filteredTableData" :row-selection="rowSelection"
                  :scroll="{ x: 2100, y: 600 }" :loading="loading" :pagination="{ pageSize: 10 }"
                  @change="handleTableChange" row-key="key" class="table datatable thead-light">
                  <template #bodyCell="{ column, text, record }">
                    <!-- Editable Position Salary -->
                    <template v-if="column.dataIndex === 'positionSalary'">
                      <div v-if="editableData[record.key]" class="editable-cell">
                        <a-input-number v-model:value="editableData[record.key].positionSalary"
                          @change="onSalaryChange(record.key)"
                          :formatter="value => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :parser="value => value.replace(/฿\s?|(,*)/g, '')" style="width: 100%" />
                      </div>
                      <div v-else class="display-cell">
                        {{ formatCurrency(text) }}
                      </div>
                    </template>

                    <!-- Editable FTE -->
                    <template v-else-if="column.dataIndex === 'fte'">
                      <div v-if="editableData[record.key]" class="editable-cell">
                        <a-input-number v-model:value="editableData[record.key].fte" @change="onFteChange(record.key)"
                          :min="1" :max="100" :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')" style="width: 100%" />
                      </div>
                      <div v-else class="display-cell">
                        {{ text }}%
                      </div>
                    </template>

                    <!-- Currency columns -->
                    <template
                      v-else-if="['salaryByFte', 'grossSalary', 'basicSalary', 'annualIncrease', 'adjustedSalary', 'pvd', 'savingFund', 'ssEmp', 'ssEmpr', 'healthEmployee', 'healthEmployer', 'tax', 'netPay', 'compensation', 'month13', 'totalIncome', 'totalDeductions', 'employerContributions'].includes(column.dataIndex)">
                      <span class="currency-cell">{{ formatCurrency(text) }}</span>
                    </template>

                    <!-- LOE column -->
                    <template v-else-if="column.dataIndex === 'loe'">
                      <span class="percentage-cell">{{ text }}%</span>
                    </template>

                    <!-- Funding type with badge -->
                    <template v-else-if="column.dataIndex === 'allocationType'">
                      <a-tag :color="text === 'org_funded' ? 'blue' : 'green'">
                        {{ text === 'org_funded' ? 'Organization' : 'Grant' }}
                      </a-tag>
                    </template>

                    <!-- Actions column -->
                    <template v-else-if="column.dataIndex === 'action'">
                      <a-space>
                        <template v-if="editableData[record.key]">
                          <a-button type="link" size="small" @click="saveRow(record.key)"
                            :loading="savingRows[record.key]">
                            Save
                          </a-button>
                          <a-button type="link" size="small" @click="cancelEdit(record.key)">Cancel</a-button>
                        </template>
                        <template v-else>
                          <a-button type="link" size="small" @click="editRow(record.key)">Edit</a-button>
                          <a-button type="link" size="small" @click="viewDetails(record)" class="view-btn">
                            View
                          </a-button>
                        </template>
                      </a-space>
                    </template>

                    <!-- Default display -->
                    <template v-else>
                      {{ text }}
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Section - Only show when payroll data is available and rows are selected -->
      <div v-if="payPeriodDate && selectedEmployeeData && selectedRowKeys.length > 0" class="summary-section mt-4">
        <a-card title="Selection Summary" size="small">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-statistic title="Selected Entries" :value="selectedRowKeys.length" />
            </a-col>
            <a-col :span="6">
              <a-statistic title="Total Gross Salary" :value="selectionSummary.totalGross"
                :formatter="formatCurrency" />
            </a-col>
            <a-col :span="6">
              <a-statistic title="Total Net Pay" :value="selectionSummary.totalNet" :formatter="formatCurrency" />
            </a-col>
            <a-col :span="6">
              <a-statistic title="Unique Employees" :value="selectionSummary.uniqueEmployees" />
            </a-col>
          </a-row>
        </a-card>
      </div>
    </div>

    <layout-footer></layout-footer>
  </div>
  <!-- /Page Wrapper -->

  <!-- Details Modal -->
  <a-modal v-model:open="detailsModalVisible" title="Employee Payroll Details" :width="800" :footer="null">
    <div v-if="selectedRecord" class="details-content">
      <a-descriptions bordered size="small" :column="2">
        <a-descriptions-item label="Staff ID">{{ selectedRecord.staffId }}</a-descriptions-item>
        <a-descriptions-item label="Employee Name">{{ selectedRecord.name }}</a-descriptions-item>
        <a-descriptions-item label="Department">{{ selectedRecord.department }}</a-descriptions-item>
        <a-descriptions-item label="Position">{{ selectedRecord.position }}</a-descriptions-item>
        <a-descriptions-item label="Funding Source">{{ selectedRecord.fundingSource }}</a-descriptions-item>
        <a-descriptions-item label="LOE">{{ selectedRecord.loe }}%</a-descriptions-item>
        <a-descriptions-item label="Position Salary">{{ formatCurrency(selectedRecord.positionSalary)
        }}</a-descriptions-item>
        <a-descriptions-item label="Salary by FTE">{{ formatCurrency(selectedRecord.salaryByFte)
        }}</a-descriptions-item>
        <a-descriptions-item label="Gross Salary">{{ formatCurrency(selectedRecord.grossSalary)
        }}</a-descriptions-item>
        <a-descriptions-item label="Net Pay">{{ formatCurrency(selectedRecord.netPay) }}</a-descriptions-item>
      </a-descriptions>

      <div class="mt-3">
        <h6>Detailed Payroll Calculations:</h6>
        <a-table :columns="detailsColumns" :data-source="getDetailedCalculations(selectedRecord)" :pagination="false"
          size="small" bordered />
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { payrollService } from '@/services/payroll.service';


// Router
const router = useRouter();

// Shared data store
const sharedStore = useSharedDataStore();

// Reactive data
const title = ref("Add Employee Salary");
const text = ref("HR");
const text1 = ref("Add Employee Salary");

// Loading states
const loading = ref(false);
const saving = ref(false);
const submitting = ref(false);
const savingRows = reactive({});
const employeesLoading = ref(false);

// Employee data from shared store
const employeeTreeData = ref([]);
const flatEmployeeList = ref([]);

// Selected employee data from API
const selectedEmployeeData = ref(null);
const selectedEmployeeCalculations = ref([]);
const payPeriodDate = ref(null);
const calculationsLoading = ref(false);

// Filter states
const selectedEmployeeFilter = ref('');
const departmentFilter = ref('');
const fundingTypeFilter = ref('');
const quickSearch = ref('');

// Table states
const selectedRowKeys = ref([]);
const editableData = reactive({});
const detailsModalVisible = ref(false);
const selectedRecord = ref(null);

// Legacy employee data - no longer used with API integration
const originalEmployees = ref([]);

// Table data
const tableData = ref([]);
const filteredTableData = ref([]);

// Computed properties
const departments = computed(() => {
  if (!selectedEmployeeData.value) return [];
  const depts = [...new Set(tableData.value.map(row => row.department))];
  return depts.sort();
});

const hasSelectedRows = computed(() => selectedRowKeys.value.length > 0);

const selectionSummary = computed(() => {
  const selectedData = filteredTableData.value.filter(row => selectedRowKeys.value.includes(row.key));

  const totalGross = selectedData.reduce((sum, row) => {
    const gross = parseFloat(row.grossSalary) || 0;
    return sum + gross;
  }, 0);

  const totalNet = selectedData.reduce((sum, row) => {
    const net = parseFloat(row.netPay) || 0;
    return sum + net;
  }, 0);

  const uniqueEmployees = new Set(selectedData.map(row => row.employeeId)).size;

  return {
    totalGross,
    totalNet,
    uniqueEmployees
  };
});

// Table columns definition
const columns = ref([
  {
    title: 'Staff ID',
    dataIndex: 'staffId',
    key: 'staffId',
    fixed: 'left',
    width: 100,
  },
  {
    title: 'Employee Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 180,
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    width: 120,
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    width: 150,
  },
  {
    title: 'Employment Type',
    dataIndex: 'employmentType',
    key: 'employmentType',
    width: 130,
  },
  {
    title: 'FTE %',
    dataIndex: 'fte',
    key: 'fte',
    width: 80,
  },
  {
    title: 'Position Salary',
    dataIndex: 'positionSalary',
    key: 'positionSalary',
    width: 140,
  },
  {
    title: 'Funding Source',
    dataIndex: 'fundingSource',
    key: 'fundingSource',
    width: 200,
  },
  {
    title: 'Funding Type',
    dataIndex: 'allocationType',
    key: 'allocationType',
    width: 140,
  },
  {
    title: 'LOE %',
    dataIndex: 'loe',
    key: 'loe',
    width: 80,
  },
  {
    title: 'Salary by FTE',
    dataIndex: 'salaryByFte',
    key: 'salaryByFte',
    width: 130,
  },
  {
    title: 'Gross Salary',
    dataIndex: 'grossSalary',
    key: 'grossSalary',
    width: 130,
  },
  {
    title: 'Annual Increase',
    dataIndex: 'annualIncrease',
    key: 'annualIncrease',
    width: 130,
  },
  {
    title: 'Adjusted Salary',
    dataIndex: 'adjustedSalary',
    key: 'adjustedSalary',
    width: 130,
  },
  {
    title: 'PVD Employee',
    dataIndex: 'pvd',
    key: 'pvd',
    width: 120,
  },
  {
    title: 'Saving Fund',
    dataIndex: 'savingFund',
    key: 'savingFund',
    width: 120,
  },
  {
    title: 'SS Employee',
    dataIndex: 'ssEmp',
    key: 'ssEmp',
    width: 110,
  },
  {
    title: 'SS Employer',
    dataIndex: 'ssEmpr',
    key: 'ssEmpr',
    width: 110,
  },
  {
    title: 'Health Employee',
    dataIndex: 'healthEmployee',
    key: 'healthEmployee',
    width: 120,
  },
  {
    title: 'Health Employer',
    dataIndex: 'healthEmployer',
    key: 'healthEmployer',
    width: 120,
  },
  {
    title: 'Income Tax',
    dataIndex: 'tax',
    key: 'tax',
    width: 110,
  },
  {
    title: '13th Month',
    dataIndex: 'month13',
    key: 'month13',
    width: 110,
  },
  {
    title: 'Compensation',
    dataIndex: 'compensation',
    key: 'compensation',
    width: 120,
  },
  {
    title: 'Total Income',
    dataIndex: 'totalIncome',
    key: 'totalIncome',
    width: 120,
  },
  {
    title: 'Total Deductions',
    dataIndex: 'totalDeductions',
    key: 'totalDeductions',
    width: 130,
  },
  {
    title: 'Net Salary',
    dataIndex: 'netPay',
    key: 'netPay',
    width: 130,
  },
  {
    title: 'Employer Contributions',
    dataIndex: 'employerContributions',
    key: 'employerContributions',
    width: 150,
  },
  {
    title: 'Total Salary',
    dataIndex: 'totalSalary',
    key: 'totalSalary',
    width: 120,
  },
  {
    title: 'PVD Saving Fund',
    dataIndex: 'totalPvdSavingFund',
    key: 'totalPvdSavingFund',
    width: 130,
  },
  {
    title: 'Actions',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 120,
  },
]);

// Details modal columns
const detailsColumns = ref([
  { title: 'Item', dataIndex: 'label', key: 'label', width: 200 },
  { title: 'Amount', dataIndex: 'value', key: 'value', width: 150 },
]);

// Row selection configuration
const rowSelection = {
  // Fix the selection column to the left
  fixed: 'left',

  // Give it a custom width to prevent overlap
  columnWidth: 80,

  // Selection configuration
  selectedRowKeys: selectedRowKeys,
  onChange: (newSelectedRowKeys) => {
    selectedRowKeys.value = newSelectedRowKeys;
  },
  hideDefaultSelections: false,
  selections: [
    {
      key: 'all-visible',
      text: 'Select All Visible',
      onSelect: () => {
        selectedRowKeys.value = filteredTableData.value.map(row => row.key);
        message.success(`Selected ${filteredTableData.value.length} visible rows`);
      },
    },
    {
      key: 'none',
      text: 'Select None',
      onSelect: () => {
        selectedRowKeys.value = [];
        message.success('Selection cleared');
      },
    },
    {
      key: 'org-funded',
      text: 'Select Org Funded',
      onSelect: () => {
        const orgRows = filteredTableData.value.filter(row => row.allocationType === 'org_funded');
        selectedRowKeys.value = orgRows.map(row => row.key);
        message.success(`Selected ${orgRows.length} organization funded entries`);
      },
    },
    {
      key: 'grant-funded',
      text: 'Select Grant Funded',
      onSelect: () => {
        const grantRows = filteredTableData.value.filter(row => row.allocationType === 'grant');
        selectedRowKeys.value = grantRows.map(row => row.key);
        message.success(`Selected ${grantRows.length} grant funded entries`);
      },
    },
  ],
};

// Pagination configuration
const pagination = ref({
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
});

// Methods
const formatCurrency = (value) => {
  if (!value && value !== 0) return '฿0.00';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const toggleHeader = () => {
  document.getElementById("collapse-header").classList.toggle("active");
  document.body.classList.toggle("header-collapse");
};

const goBack = () => {
  router.push('/payroll/employee-salary');
};

// Load employee data from shared store
const loadEmployeeData = async () => {
  try {
    console.log('🔄 Loading employee tree data...');

    // Load employee tree data using shared store
    await sharedStore.fetchEmployees();

    // Get the tree data for the dropdown
    employeeTreeData.value = sharedStore.getEmployeeTreeData;
    flatEmployeeList.value = sharedStore.getEmployees;

    console.log(`✅ Loaded ${employeeTreeData.value.length} employee tree nodes`);

  } catch (error) {
    console.error('❌ Error loading employee data:', error);
    throw error;
  }
};

// Fetch employee employment details from API
const fetchEmployeeEmploymentDetails = async (employeeId, payPeriodDate = null) => {
  try {
    calculationsLoading.value = true;
    console.log('🔄 Fetching employee employment details...', { employeeId, payPeriodDate });

    // Always use the calculated endpoint, with or without pay_period_date
    const response = await payrollService.getEmployeeEmploymentDetailsWithCalculations(employeeId, payPeriodDate);

    if (response.success) {
      // Handle API response structures from /payrolls/employee-employment-calculated
      if (response.data.employee) {
        // Both API responses have employee data in response.data.employee
        selectedEmployeeData.value = response.data.employee;

        if (payPeriodDate && response.data.allocation_calculations) {
          // With pay_period_date: data has employee and allocation_calculations
          selectedEmployeeCalculations.value = response.data.allocation_calculations || [];
          console.log('✅ Employee calculations loaded:', response.data.allocation_calculations?.length || 0, 'allocations');
        } else {
          // Without pay_period_date: only employee data, no calculations
          selectedEmployeeCalculations.value = [];
          console.log('✅ Employee basic data loaded');
        }
      } else {
        // Fallback: if data structure is different
        selectedEmployeeData.value = response.data;
        selectedEmployeeCalculations.value = [];
        console.log('✅ Employee data loaded (fallback structure)');
      }

      // Transform API data to table format
      updateTableWithEmployeeData();

      return response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch employee employment details');
    }
  } catch (error) {
    console.error('❌ Error fetching employee employment details:', error);
    message.error('Failed to load employee details: ' + error.message);
    selectedEmployeeData.value = null;
    selectedEmployeeCalculations.value = [];
    throw error;
  } finally {
    calculationsLoading.value = false;
  }
};

// Transform API employee data to table format
const updateTableWithEmployeeData = () => {
  if (!selectedEmployeeData.value) {
    filteredTableData.value = [];
    tableData.value = [];
    return;
  }

  // selectedEmployeeData.value contains the employee object
  const employee = selectedEmployeeData.value;
  const allocations = employee.employee_funding_allocations || [];
  const calculations = selectedEmployeeCalculations.value || [];

  console.log('🔄 Updating table with employee data:', {
    employee: employee.staff_id,
    allocations: allocations.length,
    calculations: calculations.length
  });

  const tableRows = [];

  allocations.forEach((allocation, index) => {
    // Find matching calculation if available
    const calculation = calculations.find(calc => calc.allocation_id === allocation.id);

    // Get funding source information
    let fundingSource = 'Unknown';
    let allocationType = allocation.allocation_type;

    if (allocation.allocation_type === 'org_funded' && allocation.org_funded) {
      fundingSource = allocation.org_funded.grant?.name || 'Organization Funded';
    } else if (allocation.allocation_type === 'grant' && allocation.position_slot) {
      fundingSource = allocation.position_slot.grant_item?.grant?.name || 'Grant Position Slot';
    }

    // Use calculations if available, otherwise use basic employment data
    const baseSalary = calculation
      ? parseFloat(calculation.calculations.gross_salary)
      : parseFloat(employee.employment?.position_salary || 0);

    const salaryByFte = calculation
      ? parseFloat(calculation.calculations.gross_salary_by_FTE)
      : baseSalary * parseFloat(allocation.level_of_effort);

    const row = {
      key: `${employee.id}-${allocation.id}`,
      employeeId: employee.id,
      staffId: employee.staff_id,
      name: `${employee.first_name_en} ${employee.last_name_en}`,
      subsidiary: employee.subsidiary,
      department: employee.employment?.department?.name || 'N/A',
      position: employee.employment?.position?.title || 'N/A',
      employmentType: employee.employment?.employment_type || 'N/A',
      fte: parseFloat(employee.employment?.fte || 1) * 100,
      positionSalary: parseFloat(employee.employment?.position_salary || 0),
      payMethod: employee.employment?.pay_method || 'Bank',
      fundingSource: fundingSource,
      allocationType: allocationType,
      positionSlot: allocation.position_slot?.slot_number || '-',
      loe: parseFloat(allocation.level_of_effort) * 100,
      salaryByFte: salaryByFte,

      // Use calculated values if available, otherwise use mock calculations
      basicSalary: calculation ? parseFloat(calculation.calculations.gross_salary) : baseSalary,
      annualIncrease: calculation ? parseFloat(calculation.calculations.salary_increase_1_percent || 0) : 0,
      adjustedSalary: calculation ? parseFloat(calculation.calculations.gross_salary) : baseSalary,
      grossSalary: calculation ? parseFloat(calculation.calculations.gross_salary) : salaryByFte,
      pvd: calculation ? parseFloat(calculation.calculations.total_pvd || 0) : salaryByFte * 0.03,
      savingFund: calculation ? parseFloat(calculation.calculations.total_saving_fund || 0) : 0,
      ssEmp: calculation ? parseFloat(calculation.calculations.employee_social_security || 0) : Math.min(salaryByFte * 0.05, 750),
      ssEmpr: calculation ? parseFloat(calculation.calculations.employer_social_security || 0) : Math.min(salaryByFte * 0.05, 750),
      healthEmployer: calculation ? parseFloat(calculation.calculations.employer_health_welfare || 0) : 0,
      healthEmployee: calculation ? parseFloat(calculation.calculations.employee_health_welfare || 0) : 0,
      tax: calculation ? parseFloat(calculation.calculations.income_tax || 0) : salaryByFte * 0.03,
      netPay: calculation ? parseFloat(calculation.calculations.net_salary) : salaryByFte * 0.85,
      compensation: calculation ? parseFloat(calculation.calculations.compensation_refund || 0) : 0,
      month13: calculation ? parseFloat(calculation.calculations.thirteen_month_salary || 0) : salaryByFte / 12,
      totalIncome: calculation ? parseFloat(calculation.calculations.total_income) : salaryByFte,
      totalDeductions: calculation ? parseFloat(calculation.calculations.total_deduction || 0) : salaryByFte * 0.15,
      employerContributions: calculation ? parseFloat(calculation.calculations.employer_contribution || 0) : Math.min(salaryByFte * 0.05, 750),

      // Additional calculated fields from API
      totalSalary: calculation ? parseFloat(calculation.calculations.total_salary || 0) : salaryByFte,
      totalPvdSavingFund: calculation ? parseFloat(calculation.calculations.total_pvd_saving_fund || 0) : 0,
      pvdSavingFundEmployee: calculation ? parseFloat(calculation.calculations.pvd_saving_fund_employee || 0) : 0,

      // Additional data
      totalLOE: allocations.reduce((sum, alloc) => sum + parseFloat(alloc.level_of_effort), 0) * 100,
      allocationIndex: index,
      allocationId: allocation.id,
      hasCalculations: !!calculation
    };

    tableRows.push(row);
  });

  tableData.value = tableRows;
  filteredTableData.value = tableRows;

  console.log('✅ Table updated with', tableRows.length, 'allocation rows');
};

const initializeData = async () => {
  try {
    employeesLoading.value = true;

    // Load employee tree data from shared store
    await loadEmployeeData();

    // Start with empty table - only show data when employee is selected
    tableData.value = [];
    filteredTableData.value = [];

    console.log('✅ Employee tree data loaded successfully');
  } catch (error) {
    console.error('❌ Error loading employee data:', error);
    message.error('Failed to load employee data: ' + error.message);
  } finally {
    employeesLoading.value = false;
  }
};

const applyFilters = () => {
  applyQuickSearchFilter();
};

const resetFilters = () => {
  selectedEmployeeFilter.value = '';
  departmentFilter.value = '';
  fundingTypeFilter.value = '';
  quickSearch.value = '';
  selectedRowKeys.value = [];
  Object.keys(editableData).forEach(key => delete editableData[key]);
  applyFilters();
  message.success('Filters reset successfully');
};

const resetTable = () => {
  selectedRowKeys.value = [];
  Object.keys(editableData).forEach(key => delete editableData[key]);
  resetFilters();
  quickSearch.value = '';
  initializeData();
  message.success('Table reset successfully');
};

const handlePageSizeChange = () => {
  // Handle page size change
  applyFilters();
};

const handleQuickSearch = () => {
  // Handle quick search as user types
  applyQuickSearchFilter();
};

const applyQuickSearch = () => {
  // Handle quick search button click
  applyQuickSearchFilter();
};

const applyQuickSearchFilter = () => {
  // If no employee is selected, show empty table
  if (!selectedEmployeeFilter.value) {
    filteredTableData.value = [];
    return;
  }

  let filtered = [...tableData.value];

  // Apply employee filter (required)
  filtered = filtered.filter(row => row.employeeId === selectedEmployeeFilter.value);

  // Apply other filters
  if (departmentFilter.value) {
    filtered = filtered.filter(row => row.department === departmentFilter.value);
  }

  if (fundingTypeFilter.value) {
    filtered = filtered.filter(row => row.allocationType === fundingTypeFilter.value);
  }

  // Apply quick search
  if (quickSearch.value) {
    const searchTerm = quickSearch.value.toLowerCase();
    filtered = filtered.filter(row =>
      row.staffId.toLowerCase().includes(searchTerm) ||
      row.name.toLowerCase().includes(searchTerm) ||
      row.department.toLowerCase().includes(searchTerm) ||
      row.position.toLowerCase().includes(searchTerm) ||
      row.fundingSource.toLowerCase().includes(searchTerm)
    );
  }

  filteredTableData.value = filtered;
};

const onEmployeeFilterChange = async (selectedEmployeeId) => {
  if (!selectedEmployeeId) {
    // Clear selection
    selectedEmployeeData.value = null;
    selectedEmployeeCalculations.value = [];
    tableData.value = [];
    filteredTableData.value = [];
    payPeriodDate.value = null;
    return;
  }

  try {
    // Fetch basic employee employment data first (without calculations)
    await fetchEmployeeEmploymentDetails(selectedEmployeeId);
    message.success('Employee selected. Choose a pay period to calculate payroll.');
  } catch (error) {
    console.error('Error selecting employee:', error);
    // Error message already shown in fetchEmployeeEmploymentDetails
  }
};

// Handle pay period date change - trigger payroll calculations
const onPayPeriodChange = async (date) => {
  if (!selectedEmployeeFilter.value) {
    message.warning('Please select an employee first.');
    return;
  }

  if (!date) {
    // Clear calculations if no date selected
    selectedEmployeeCalculations.value = [];
    updateTableWithEmployeeData();
    return;
  }

  try {
    // Format date for API
    const formattedDate = date.format('YYYY-MM-DD');

    // Fetch employee data with payroll calculations
    await fetchEmployeeEmploymentDetails(selectedEmployeeFilter.value, formattedDate);
    message.success('Payroll calculations completed for ' + formattedDate);
  } catch (error) {
    console.error('Error calculating payroll:', error);
    // Error message already shown in fetchEmployeeEmploymentDetails
  }
};

// Tree select handles filtering internally - no need for custom filter

// Table event handlers
const handleTableChange = () => {
  // Handle table changes like pagination, filtering, sorting
};

// Edit functionality
const editRow = (key) => {
  const record = filteredTableData.value.find(item => item.key === key);
  editableData[key] = { ...record };
};

const cancelEdit = (key) => {
  delete editableData[key];
};

const saveRow = async (key) => {
  try {
    savingRows[key] = true;

    // Find the record and update it
    const recordIndex = filteredTableData.value.findIndex(item => item.key === key);
    const tableIndex = tableData.value.findIndex(item => item.key === key);

    if (recordIndex !== -1 && tableIndex !== -1) {
      // Recalculate payroll based on new values
      const newData = editableData[key];
      const recalculatedPayroll = calculatePayrollForAllocation(newData.salaryByFte);

      // Update the record with new calculations
      const updatedRecord = {
        ...newData,
        ...recalculatedPayroll
      };

      filteredTableData.value[recordIndex] = updatedRecord;
      tableData.value[tableIndex] = updatedRecord;

      delete editableData[key];
      message.success('Row updated successfully');
    }
  } catch (error) {
    message.error('Failed to save changes');
  } finally {
    savingRows[key] = false;
  }
};

const onSalaryChange = (key) => {
  if (editableData[key]) {
    const newSalary = editableData[key].positionSalary;
    const recalculatedPayroll = calculatePayrollForAllocation(newSalary);
    Object.assign(editableData[key], recalculatedPayroll);
  }
};

const onFteChange = (key) => {
  // Handle FTE changes and recalculate if needed
  onSalaryChange(key);
};

// Details modal
const viewDetails = (record) => {
  selectedRecord.value = record;
  detailsModalVisible.value = true;
};

const getDetailedCalculations = (record) => {
  if (!record) return [];

  return [
    { label: 'SALARY BY FTE (PROPORTIONAL SHARE)', value: formatCurrency(record.salaryByFte) },
    { label: 'GROSS SALARY', value: formatCurrency(record.grossSalary) },
    { label: 'COMPENSATION / REFUND', value: formatCurrency(record.compensation) },
    { label: '13th MONTH SALARY', value: formatCurrency(record.month13) },
    { label: 'PVD/SAVING FUND (7.5%)', value: formatCurrency(record.pvd) },
    { label: 'EMPLOYER S.INSU 5%', value: formatCurrency(record.ssEmpr) },
    { label: 'EMPLOYEE S.INSU 5%', value: formatCurrency(record.ssEmp) },
    { label: 'HEALTH WELFARE EMPLOYER', value: formatCurrency(record.healthEmployer) },
    { label: 'HEALTH WELFARE EMPLOYEE', value: formatCurrency(record.healthEmployee) },
    { label: 'TAX', value: formatCurrency(record.tax) },
    { label: 'NET PAY', value: formatCurrency(record.netPay) }
  ];
};

// Form actions
const saveDraft = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('Please select at least one row to save as draft');
    return;
  }

  try {
    saving.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    message.success(`Saved ${selectedRowKeys.value.length} payroll entries as draft`);
    goBack();
  } catch (error) {
    message.error('Failed to save draft');
  } finally {
    saving.value = false;
  }
};

const submitForm = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('Please select at least one row to submit');
    return;
  }

  if (!selectedEmployeeData.value || !payPeriodDate.value) {
    message.warning('Employee and pay period date are required');
    return;
  }

  try {
    submitting.value = true;

    // Get selected rows data
    const selectedRows = filteredTableData.value.filter(row => selectedRowKeys.value.includes(row.key));

    // Validate that we have calculations data
    if (!selectedEmployeeCalculations.value || selectedEmployeeCalculations.value.length === 0) {
      message.error('No payroll calculations available. Please select a pay period date first.');
      submitting.value = false;
      return;
    }

    // Format allocation calculations according to backend API specification
    const allocationCalculations = selectedRows.map(row => {
      // Find the corresponding calculation from API response
      const calculation = selectedEmployeeCalculations.value.find(calc => calc.allocation_id === row.allocationId);

      if (!calculation) {
        throw new Error(`No calculation found for allocation ID: ${row.allocationId}`);
      }

      return {
        allocation_id: row.allocationId,
        employment_id: selectedEmployeeData.value.employment.id,
        allocation_type: row.allocationType === 'org_funded' ? 'organization' : 'grant', // Backend expects 'organization' not 'org_funded'
        level_of_effort: parseFloat(row.loe) / 100, // Convert percentage back to decimal
        funding_source: row.fundingSource,
        salary_by_fte: parseFloat(row.salaryByFte) || 0,
        compensation_refund: parseFloat(row.compensation) || 0,
        thirteen_month_salary: parseFloat(row.month13) || 0,
        pvd_employee: parseFloat(row.pvd) || 0,
        saving_fund: parseFloat(row.savingFund) || 0,
        social_security_employee: parseFloat(row.ssEmp) || 0,
        social_security_employer: parseFloat(row.ssEmpr) || 0,
        health_welfare_employee: parseFloat(row.healthEmployee) || 0,
        health_welfare_employer: parseFloat(row.healthEmployer) || 0,
        income_tax: parseFloat(row.tax) || 0,
        total_income: parseFloat(row.totalIncome) || 0,
        total_deductions: parseFloat(row.totalDeductions) || 0,
        net_salary: parseFloat(row.netPay) || 0,
        employer_contributions: parseFloat(row.employerContributions) || 0
      };
    });

    // Prepare request payload according to backend API specification
    const payload = {
      employee_id: selectedEmployeeData.value.id,
      pay_period_date: payPeriodDate.value.format('YYYY-MM-DD'),
      allocation_calculations: allocationCalculations,
      payslip_date: payPeriodDate.value.clone().add(1, 'day').format('YYYY-MM-DD'), // Default to next day
      payslip_number: `PAY-${payPeriodDate.value.format('YYYY-MM')}-${selectedEmployeeData.value.staff_id}`,
      staff_signature: `${selectedEmployeeData.value.first_name_en} ${selectedEmployeeData.value.last_name_en}`,
      created_by: 'HR Manager User' // You might want to get this from auth user
    };

    console.log('📤 Submitting payroll data:', payload);

    // Call the payroll service to create payroll records
    const response = await payrollService.createPayroll(payload);

    if (response.success) {
      message.success(
        `Successfully created ${response.data.summary.total_payrolls_created} payroll record(s)` +
        (response.data.summary.total_advances_created > 0
          ? ` with ${response.data.summary.total_advances_created} inter-subsidiary advance(s)`
          : '')
      );

      console.log('✅ Payroll creation response:', response);
      goBack();
    } else {
      throw new Error(response.message || 'Failed to create payroll records');
    }
  } catch (error) {
    console.error('❌ Error submitting payroll:', error);
    message.error(`Failed to submit payroll entries: ${error.message}`);
  } finally {
    submitting.value = false;
  }
};

// Lifecycle
onMounted(() => {
  initializeData();
});

// Watch for filter changes
watch([departmentFilter, fundingTypeFilter, quickSearch], () => {
  applyFilters();
});
</script>

<style scoped>
/* Page Layout */
.page-wrapper {
  background: #f8fafc;
}

.page-header {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Filter Section */
.filter-section {
  margin-bottom: 1.5rem;
}

.filter-content {
  padding: 0.5rem 0;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin: 0;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.filter-label .text-danger {
  font-size: 0.8rem;
  margin-left: 2px;
}

.employee-option {
  padding: 6px 0;
  line-height: 1.2;
}

.employee-main {
  font-size: 14px;
  margin-bottom: 2px;
}

.employee-details {
  line-height: 1.1;
}

.employee-details small {
  font-size: 0.75rem;
  opacity: 0.8;
  display: block;
}

.reset-btn {
  height: 32px;
}

.align-self-end {
  align-self: flex-end;
}

/* Table Operations - Match employees-list.vue */
.table-operations>button {
  margin-right: 8px;
}

/* Table Cell Styles */
.editable-cell {
  padding: 0;
}

.display-cell {
  padding: 8px 0;
}

.currency-cell {
  font-weight: 500;
  color: #2b6cb0;
}

.percentage-cell {
  font-weight: 500;
  color: #38a169;
}

.view-btn {
  color: #805ad5 !important;
}

/* Summary Section */
.summary-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

/* Step Indicators */
.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
}

.step-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-align: center;
}

/* Empty State Cards */
.initial-empty-state,
.empty-state-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

/* Details Modal */
.details-content {
  max-height: 70vh;
  overflow-y: auto;
}

/* Empty State Styling */
.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  margin: 2rem;
}

.empty-icon {
  opacity: 0.6;
}

.empty-state h5 {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.95rem;
  max-width: 500px;
  line-height: 1.5;
}

.empty-features {
  margin-top: 1rem;
}

.empty-features ul {
  text-align: left;
  display: inline-block;
}

.empty-features li {
  padding: 0.25rem 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

/* Ant Design Select Styling - Match employees-list.vue */
:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  min-width: 80px;
}

/* Employee select specific styling */
:deep(.ant-select-selection-item) {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Dropdown panel styling */
:deep(.ant-select-dropdown .ant-select-item-option-content) {
  white-space: normal;
}

/* Enhanced scrollbar styling - Match Ant Design Vue docs */
/* :deep(.ant-table-body)::-webkit-scrollbar {
    width: 16px !important;
    height: 16px !important;
  } */

/* :deep(.ant-table-body)::-webkit-scrollbar-track {
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
} */

/* Additional scrollbar styling for table wrapper */
/* :deep(.custom-datatable-filter .ant-table-body)::-webkit-scrollbar {
  width: 16px !important;
  height: 16px !important;
}

:deep(.custom-datatable-filter .ant-table-body)::-webkit-scrollbar-track {
  background: #f1f1f1 !important;
  border-radius: 8px !important;
}

:deep(.custom-datatable-filter .ant-table-body)::-webkit-scrollbar-thumb {
  background: #888 !important;
  border-radius: 8px !important;
  border: 2px solid #f1f1f1 !important;
}

:deep(.custom-datatable-filter .ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #555 !important;
} */

/* Table Base Styling - Match employees-list.vue */
/* :deep(.ant-table) {
  border-radius: 0;
  overflow: hidden;
} */

/* Fixed Columns Styling - Match employees-list.vue */
/* :deep(.ant-table-cell-fix-left),
:deep(.ant-table-cell-fix-right) {
  background-color: #ffffff !important;
  z-index: 2 !important;
  box-shadow: 0 0 0 1px #e0e0e0;
} */

/* Selection Column Styling - Match employees-list.vue */
/* :deep(.ant-table-selection-column) {
  background-color: #ffffff !important;
  z-index: 3 !important;
  min-width: 80px !important;
  width: 80px !important;
  padding-left: 8px !important;
  padding-right: 8px !important;
  text-align: center;
} */

/* Selection column header styling */
/* :deep(.ant-table-selection-column .ant-table-selection) {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
} */

/* Fix selection checkbox alignment */
/* :deep(.ant-table-selection-column .ant-checkbox-wrapper) {
  margin: 0;
} */

/* Selected Rows with Fixed Columns - Match employees-list.vue */
/* :deep(.ant-table-row-selected > td.ant-table-cell-fix-left),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-right),
:deep(.ant-table-row-selected > td.ant-table-selection-column) {
  background-color: #e6f7ff !important;
  z-index: 3 !important;
} */

/* Table Container Styling - Match employees-list.vue */
/* :deep(.ant-table-container) {
  border: 1px solid #e0e0e0;
  border-radius: 0;
} */

/* Table Header Styling - Match employees-list.vue */
/* :deep(.ant-table-thead > tr > th) {
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
} */

/* Table Cell Padding - Match employees-list.vue */
/* :deep(.ant-table-cell) {
  padding: 8px 8px !important;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  vertical-align: top;
} */

/* Funding columns specific styling */
/* :deep(.ant-table-cell[data-index="fundingSource"]) {
  min-width: 200px !important;
  max-width: 200px !important;
  width: 200px !important;
} */

/* :deep(.ant-table-cell[data-index="allocationType"]) {
  min-width: 140px !important;
  max-width: 140px !important;
  width: 140px !important;
  text-align: center;
} */

/* Ensure funding type tags don't overflow */
/* :deep(.ant-table-cell[data-index="allocationType"] .ant-tag) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} */

/* Loading Spinner */
.spin {
  animation: spin 1s linear infinite;
}

/* Employee Info Section */
.employee-info-section .info-item {
  margin-bottom: 4px;
}

.employee-info-content .row {
  margin: 0;
}

.calculation-summary {
  background-color: #f0f9ff;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #10b981;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Employee Tree Select Styling */
.employee-tree-option {
  padding: 2px 0;
}

.employee-tree-option .employee-main {
  font-weight: 500;
  color: #1f2937;
}

.employee-tree-option .employee-details {
  margin-top: 2px;
}

.employee-tree-option .badge {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 10px;
}

.employee-tree-option .badge.bg-success {
  background-color: #10b981 !important;
  color: white;
}

.employee-tree-option .badge.bg-primary {
  background-color: #3b82f6 !important;
  color: white;
}

.employee-tree-option .badge.bg-warning {
  background-color: #f59e0b !important;
  color: white;
}

.employee-tree-option .badge.bg-secondary {
  background-color: #6b7280 !important;
  color: white;
}

/* Custom Ant Design Overrides for payroll theme */
:deep(.ant-table-tbody > tr:hover > td) {
  background: #fff7ed;
}

:deep(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background: #fef3c7;
}

:deep(.ant-btn-primary) {
  background: #cc6600;
  border-color: #cc6600;
}

:deep(.ant-btn-primary:hover) {
  background: #a0570a;
  border-color: #a0570a;
}

:deep(.ant-tag) {
  border-radius: 12px;
  font-size: 0.8rem;
}

:deep(.ant-statistic-title) {
  font-size: 0.875rem;
  color: #6b7280;
}

:deep(.ant-statistic-content) {
  color: #1f2937;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-item {
    width: 100%;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }

  .table-operations {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

@media (max-width: 576px) {
  .filter-row {
    gap: 1rem;
  }

  .table-actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>
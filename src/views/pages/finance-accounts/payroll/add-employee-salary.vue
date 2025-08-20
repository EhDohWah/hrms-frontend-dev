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
                </label>
                <a-select v-model:value="selectedEmployeeFilter" @change="onEmployeeFilterChange"
                  placeholder="Select an employee..." allow-clear style="width: 280px" show-search
                  :filter-option="filterOption" option-label-prop="label">
                  <a-select-option v-for="emp in originalEmployees" :key="emp.id" :value="emp.id"
                    :label="`${emp.staff_id} - ${emp.name}`">
                    <div class="employee-option">
                      <div class="employee-main">
                        <strong>{{ emp.staff_id }}</strong> - {{ emp.name }}
                      </div>
                      <div class="employee-details">
                        <small class="text-muted">{{ emp.department }} • {{ emp.funding_description }}</small>
                      </div>
                    </div>
                  </a-select-option>
                </a-select>
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

      <!-- Employee Payroll Table -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Employee Payroll Data</h5>
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

        <!-- Table -->
        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <!-- <div class="dataTables_wrapper dt-bootstrap5 no-footer">
              <div class="row">
                <div class="col-sm-12 col-md-6">
                  <div class="dataTables_length">
                    <label>
                      Row Per Page
                      <select class="form-select form-select-sm" v-model.number="pagination.pageSize"
                        @change="handlePageSizeChange">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      Entries
                    </label>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6">
                  <div class="dataTables_filter text-end me-3">
                    <label>
                      QUICK SEARCH:
                      <input type="search" class="form-control form-control-sm d-inline-block w-auto"
                        placeholder="Search employee..." v-model="quickSearch" @input="handleQuickSearch">
                      <button class="btn btn-sm btn-primary ms-2" @click="applyQuickSearch">Search</button>
                    </label>
                  </div>
                </div>
              </div>
            </div> -->

            <!-- Loading Indicator -->
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading payroll data...</p>
            </div>

            <!-- Payroll Table -->
            <div v-else>
              <!-- Empty state when no employee selected -->
              <div v-if="!selectedEmployeeFilter && filteredTableData.length === 0"
                class="empty-state text-center py-5">
                <div class="empty-icon mb-3">
                  <i class="ti ti-users-plus" style="font-size: 3rem; color: #cbd5e0;"></i>
                </div>
                <h5 class="text-muted mb-2">No Employee Selected</h5>
                <p class="text-muted mb-3">Please select an employee from the dropdown above to view their payroll data
                  including:</p>
              </div>

              <!-- Table when employee is selected -->
              <a-table v-else :columns="columns" :data-source="filteredTableData" :row-selection="rowSelection"
                :scroll="{ x: 2000, y: 600 }" :loading="loading" :pagination="pagination" @change="handleTableChange"
                row-key="key" class="table datatable thead-light">

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
                        :min="1" :max="100" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"
                        style="width: 100%" />
                    </div>
                    <div v-else class="display-cell">
                      {{ text }}%
                    </div>
                  </template>

                  <!-- Currency columns -->
                  <template
                    v-else-if="['salaryByFte', 'grossSalary', 'pvd', 'tax', 'netPay'].includes(column.dataIndex)">
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
        <!-- /Table -->
      </div>

      <!-- Summary Section -->
      <div v-if="selectedRowKeys.length > 0" class="summary-section mt-4">
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


// Router
const router = useRouter();

// Reactive data
const title = ref("Add Employee Salary");
const text = ref("HR");
const text1 = ref("Add Employee Salary");

// Loading states
const loading = ref(false);
const saving = ref(false);
const submitting = ref(false);
const savingRows = reactive({});

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

// Original employee data (preserved from original component)
const originalEmployees = ref([
  {
    id: "0012",
    staff_id: "0012",
    name: "Chanchai Siri",
    subsidiary: "ACME",
    department: "Finance",
    funding_description: "Org Funded Only",
    employment: {
      employment_type: "Full-Time",
      position: "Accountant",
      position_salary: 25000,
      fte: 100,
      pay_method: "Bank"
    },
    allocations: [
      {
        source: "ACME General Fund",
        allocation_type: "org_funded",
        position_slot: null,
        loe: 100
      }
    ]
  },
  {
    id: "0155",
    staff_id: "0155",
    name: "Mr.xxxxxxxx",
    subsidiary: "BHF",
    department: "Admin",
    funding_description: "Grant+Org Funding",
    employment: {
      employment_type: "Full-Time",
      position: "Local ID Staff",
      position_salary: 40000,
      fte: 80,
      pay_method: "Bank"
    },
    allocations: [
      {
        source: "IHRP-RAI3E",
        allocation_type: "grant",
        position_slot: "Grant Position",
        loe: 80
      },
      {
        source: "BHF General Fund",
        allocation_type: "org_funded",
        position_slot: null,
        loe: 20
      }
    ]
  },
  {
    id: "0200",
    staff_id: "0200",
    name: "Somchai P.",
    subsidiary: "IHRP",
    department: "Programs",
    funding_description: "Org + 2 Grants",
    employment: {
      employment_type: "Full-Time",
      position: "Program Manager",
      position_salary: 60000,
      fte: 100,
      pay_method: "Bank"
    },
    allocations: [
      {
        source: "IHRP Grant Alpha",
        allocation_type: "grant",
        position_slot: "Slot A",
        loe: 40
      },
      {
        source: "IHRP Grant Beta",
        allocation_type: "grant",
        position_slot: "Slot B",
        loe: 35
      },
      {
        source: "IHRP Central Fund",
        allocation_type: "org_funded",
        position_slot: null,
        loe: 25
      }
    ]
  }
]);

// Transform employee data to table format
const transformEmployeeDataToTable = () => {
  const tableData = [];

  originalEmployees.value.forEach(employee => {
    employee.allocations.forEach((allocation, index) => {
      const totalLOE = employee.allocations.reduce((sum, alloc) => sum + Number(alloc.loe), 0);

      // Calculate payroll values for this allocation
      const baseSalary = Number(employee.employment.position_salary || 0);
      let salaryByFte;

      if (employee.allocations.length === 1) {
        salaryByFte = baseSalary;
      } else {
        salaryByFte = baseSalary * (Number(allocation.loe) / totalLOE);
      }

      const payrollCalc = calculatePayrollForAllocation(salaryByFte);

      tableData.push({
        key: `${employee.id}-${index}`,
        employeeId: employee.id,
        staffId: employee.staff_id,
        name: employee.name,
        subsidiary: employee.subsidiary,
        department: employee.department,
        position: employee.employment.position,
        employmentType: employee.employment.employment_type,
        fte: employee.employment.fte,
        positionSalary: employee.employment.position_salary,
        payMethod: employee.employment.pay_method,
        fundingSource: allocation.source,
        allocationType: allocation.allocation_type,
        positionSlot: allocation.position_slot || '-',
        loe: allocation.loe,
        salaryByFte: salaryByFte,
        grossSalary: payrollCalc.gross,
        pvd: payrollCalc.pvd,
        ssEmp: payrollCalc.ssEmp,
        ssEmpr: payrollCalc.ssEmpr,
        healthEmployer: payrollCalc.healthEmployer,
        healthEmployee: payrollCalc.healthEmployee,
        tax: payrollCalc.tax,
        netPay: payrollCalc.net,
        compensation: payrollCalc.compensation,
        month13: payrollCalc.month13,
        totalLOE: totalLOE,
        allocationIndex: index
      });
    });
  });

  return tableData;
};

// Calculate payroll for a specific allocation
const calculatePayrollForAllocation = (salaryByFte) => {
  const salary = Number(salaryByFte || 0);
  const compensation = salary * 0.06;
  const month13 = salary / 12;
  const healthEmployer = salary * 0.01;
  const healthEmployee = salary * 0.005;
  const tax = salary * 0.03;
  const gross = salary;
  const pvd = gross * 0.075;
  const ssEmp = gross * 0.03;
  const ssEmpr = gross * 0.03;
  const net = gross - pvd - ssEmp - healthEmployee - tax + compensation + month13;

  return {
    gross,
    compensation,
    month13,
    pvd,
    ssEmp,
    ssEmpr,
    healthEmployer,
    healthEmployee,
    tax,
    net
  };
};

// Table data
const tableData = ref([]);
const filteredTableData = ref([]);

// Computed properties
const departments = computed(() => {
  const depts = [...new Set(originalEmployees.value.map(emp => emp.department))];
  return depts.sort();
});

const hasSelectedRows = computed(() => selectedRowKeys.value.length > 0);

const selectionSummary = computed(() => {
  const selectedData = filteredTableData.value.filter(row => selectedRowKeys.value.includes(row.key));
  const totalGross = selectedData.reduce((sum, row) => sum + row.grossSalary, 0);
  const totalNet = selectedData.reduce((sum, row) => sum + row.netPay, 0);
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
    sorter: (a, b) => a.staffId.localeCompare(b.staffId),
    filterDropdown: true,
    onFilter: (value, record) => record.staffId.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: 'Employee Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 180,
    sorter: (a, b) => a.name.localeCompare(b.name),
    filterDropdown: true,
    onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    width: 120,
    filters: departments.value.map(dept => ({ text: dept, value: dept })),
    onFilter: (value, record) => record.department === value,
    sorter: (a, b) => a.department.localeCompare(b.department),
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    width: 150,
    sorter: (a, b) => a.position.localeCompare(b.position),
  },
  {
    title: 'Employment Type',
    dataIndex: 'employmentType',
    key: 'employmentType',
    width: 130,
    filters: [
      { text: 'Full-Time', value: 'Full-Time' },
      { text: 'Part-Time', value: 'Part-Time' }
    ],
    onFilter: (value, record) => record.employmentType === value,
  },
  {
    title: 'FTE %',
    dataIndex: 'fte',
    key: 'fte',
    width: 80,
    sorter: (a, b) => a.fte - b.fte,
  },
  {
    title: 'Position Salary',
    dataIndex: 'positionSalary',
    key: 'positionSalary',
    width: 140,
    sorter: (a, b) => a.positionSalary - b.positionSalary,
  },
  {
    title: 'Funding Source',
    dataIndex: 'fundingSource',
    key: 'fundingSource',
    width: 160,
    sorter: (a, b) => a.fundingSource.localeCompare(b.fundingSource),
  },
  {
    title: 'Funding Type',
    dataIndex: 'allocationType',
    key: 'allocationType',
    width: 120,
    filters: [
      { text: 'Organization', value: 'org_funded' },
      { text: 'Grant', value: 'grant' }
    ],
    onFilter: (value, record) => record.allocationType === value,
  },
  {
    title: 'LOE %',
    dataIndex: 'loe',
    key: 'loe',
    width: 80,
    sorter: (a, b) => a.loe - b.loe,
  },
  {
    title: 'Salary by FTE',
    dataIndex: 'salaryByFte',
    key: 'salaryByFte',
    width: 130,
    sorter: (a, b) => a.salaryByFte - b.salaryByFte,
  },
  {
    title: 'Gross Salary',
    dataIndex: 'grossSalary',
    key: 'grossSalary',
    width: 130,
    sorter: (a, b) => a.grossSalary - b.grossSalary,
  },
  {
    title: 'PVD (7.5%)',
    dataIndex: 'pvd',
    key: 'pvd',
    width: 120,
    sorter: (a, b) => a.pvd - b.pvd,
  },
  {
    title: 'Tax',
    dataIndex: 'tax',
    key: 'tax',
    width: 100,
    sorter: (a, b) => a.tax - b.tax,
  },
  {
    title: 'Net Pay',
    dataIndex: 'netPay',
    key: 'netPay',
    width: 130,
    sorter: (a, b) => a.netPay - b.netPay,
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

const initializeData = () => {
  tableData.value = transformEmployeeDataToTable();
  // Start with empty table - only show data when employee is selected
  filteredTableData.value = [];
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

const onEmployeeFilterChange = () => {
  applyFilters();
};

const filterOption = (input, option) => {
  const employee = originalEmployees.value.find(emp => emp.id === option.value);
  if (!employee) return false;
  const searchText = input.toLowerCase();
  return (
    employee.staff_id.toLowerCase().includes(searchText) ||
    employee.name.toLowerCase().includes(searchText) ||
    employee.department.toLowerCase().includes(searchText) ||
    employee.funding_description.toLowerCase().includes(searchText)
  );
};

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
    { label: 'EMPLOYER S.INSU 3%', value: formatCurrency(record.ssEmpr) },
    { label: 'EMPLOYEE S.INSU 3%', value: formatCurrency(record.ssEmp) },
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

  try {
    submitting.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    message.success(`Successfully submitted ${selectedRowKeys.value.length} payroll entries`);
    goBack();
  } catch (error) {
    message.error('Failed to submit payroll entries');
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

/* Additional scrollbar styling for table wrapper */
:deep(.custom-datatable-filter .ant-table-body)::-webkit-scrollbar {
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
}

/* Table Base Styling - Match employees-list.vue */
:deep(.ant-table) {
  border-radius: 0;
  overflow: hidden;
}

/* Fixed Columns Styling - Match employees-list.vue */
:deep(.ant-table-cell-fix-left),
:deep(.ant-table-cell-fix-right) {
  background-color: #ffffff !important;
  z-index: 2 !important;
  box-shadow: 0 0 0 1px #e0e0e0;
}

/* Selection Column Styling - Match employees-list.vue */
:deep(.ant-table-selection-column) {
  background-color: #ffffff !important;
  z-index: 3 !important;
  min-width: 80px !important;
  width: 80px !important;
  padding-left: 8px !important;
  padding-right: 8px !important;
  text-align: center;
}

/* Selection column header styling */
:deep(.ant-table-selection-column .ant-table-selection) {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Fix selection checkbox alignment */
:deep(.ant-table-selection-column .ant-checkbox-wrapper) {
  margin: 0;
}

/* Selected Rows with Fixed Columns - Match employees-list.vue */
:deep(.ant-table-row-selected > td.ant-table-cell-fix-left),
:deep(.ant-table-row-selected > td.ant-table-cell-fix-right),
:deep(.ant-table-row-selected > td.ant-table-selection-column) {
  background-color: #e6f7ff !important;
  z-index: 3 !important;
}

/* Table Container Styling - Match employees-list.vue */
:deep(.ant-table-container) {
  border: 1px solid #e0e0e0;
  border-radius: 0;
}

/* Table Header Styling - Match employees-list.vue */
:deep(.ant-table-thead > tr > th) {
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

/* Table Cell Padding - Match employees-list.vue */
:deep(.ant-table-cell) {
  padding: 8px 8px !important;
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
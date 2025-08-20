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
          <!-- <div class="me-2 mb-2">
            <div class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown">
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                      class="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"><i
                      class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div> -->

          <div class="mb-2">
            <router-link to="/payroll/add-employee-salary" class="btn btn-primary d-flex align-items-center"><i
                class="ti ti-circle-plus me-2"></i>Add Salary</router-link>
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

      <!-- Monthly Payroll Statistics Cards -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 bg-light-primary">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="avatar avatar-md bg-primary rounded-circle">
                    <i class="ti ti-users text-white"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="card-title mb-1">Total Employees</h6>
                  <p class="card-text mb-0 text-muted">{{ monthlyStats.totalEmployees }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 bg-light-success">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="avatar avatar-md bg-success rounded-circle">
                    <i class="ti ti-coin text-white"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="card-title mb-1">Total Payroll</h6>
                  <p class="card-text mb-0 text-muted">฿{{ formatCurrency(monthlyStats.totalPayroll) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 bg-light-warning">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="avatar avatar-md bg-warning rounded-circle">
                    <i class="ti ti-percentage text-white"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="card-title mb-1">Total Tax</h6>
                  <p class="card-text mb-0 text-muted">฿{{ formatCurrency(monthlyStats.totalTax) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 bg-light-info">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="avatar avatar-md bg-info rounded-circle">
                    <i class="ti ti-receipt text-white"></i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="card-title mb-1">Payslips Generated</h6>
                  <p class="card-text mb-0 text-muted">{{ monthlyStats.payslipsGenerated }}/{{
                    monthlyStats.totalEmployees }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tax Calculation Summary Card -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 bg-light-secondary">
            <div class="card-header">
              <h6 class="mb-0"><i class="ti ti-calculator me-2"></i>Thailand Personal Income Tax Summary</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <div class="text-center">
                    <h6 class="text-muted mb-1">Tax Year</h6>
                    <p class="h5 mb-0">{{ currentTaxYear }}</p>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <h6 class="text-muted mb-1">Tax Brackets</h6>
                    <p class="h5 mb-0">{{ taxSummary.totalBrackets }}</p>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <h6 class="text-muted mb-1">Max Tax Rate</h6>
                    <p class="h5 mb-0">{{ taxSummary.maxTaxRate }}%</p>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <h6 class="text-muted mb-1">Standard Deduction</h6>
                    <p class="h5 mb-0">฿{{ formatCurrency(taxSummary.standardDeduction) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Employee Salary List</h5>
          <div class="table-operations">
            <a-button @click="clearFilters">Clear filters</a-button>
            <a-button @click="clearAll">Clear filters and sorters</a-button>
            <a-button type="primary" @click="calculateAllTaxes" :loading="calculatingTaxes">
              <i class="ti ti-calculator me-1"></i>Calculate Taxes
            </a-button>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <div v-if="payrollStore.loading" class="text-center my-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading payrolls...</p>
            </div>

            <a-table v-else class="table datatable thead-light bordered-table" :columns="columns"
              :scroll="{ x: 2000, y: 600 }" :data-source="payrolls" :row-selection="rowSelection"
              :pagination="pagination" @change="handleChange" :bordered="true">
              <!-- Employee Name column with highlighting -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'employeeName'">
                  <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md">
                      <img src="@/assets/img/users/user-32.jpg" class="img-fluid rounded-circle" alt="img" />
                    </a>
                    <div class="ms-2">
                      <h6 class="fw-medium">
                        <router-link :to="`/employee/employee-details/${record.employee_id}`">
                          {{ record.employeeName }}
                        </router-link>
                      </h6>
                      <router-link :to="`/employee/employee-details/${record.employee_id}`">
                        <span class="d-block mt-1">{{ record.position }}</span>
                      </router-link>
                    </div>
                  </div>
                </template>

                <!-- Department column -->
                <template v-if="column.key === 'department'">
                  <span :class="[
                    'badge badge-sm fw-normal',
                    record.department === 'Finance' ? 'badge-primary' :
                      record.department === 'HR' ? 'badge-soft-primary fw-bold' :
                        'badge-secondary'
                  ]">
                    {{ record.department }}
                  </span>
                </template>

                <!-- Tax column with breakdown tooltip -->
                <template v-if="column.key === 'tax'">
                  <div class="d-flex align-items-center">
                    <span class="fw-semibold text-danger">
                      ฿{{ formatCurrency(record.tax || 0) }}
                    </span>
                    <a-tooltip v-if="record.taxBreakdown" placement="top">
                      <template #title>
                        <div class="text-start">
                          <div><strong>Tax Breakdown:</strong></div>
                          <div v-for="(amount, bracket) in record.taxBreakdown" :key="bracket">
                            {{ bracket }}: ฿{{ formatCurrency(amount) }}
                          </div>
                        </div>
                      </template>
                      <i class="ti ti-info-circle ms-1 text-muted cursor-pointer"></i>
                    </a-tooltip>
                  </div>
                </template>

                <!-- Taxable Income column -->
                <template v-if="column.key === 'taxableIncome'">
                  <span class="fw-semibold text-primary">
                    ฿{{ formatCurrency(record.taxableIncome || 0) }}
                  </span>
                </template>

                <!-- Payslip column -->
                <template v-if="column.key === 'payslip'">
                  <router-link :to="`/payroll/payslip/${record.id}`" class="btn btn-sm btn-primary">
                    Generate Slip
                  </router-link>
                </template>

                <!-- Action column -->
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal"
                      data-bs-target="#edit-employee-salary" @click="editPayroll(record)"><i class="ti ti-edit"></i></a>
                    <a href="javascript:void(0);" @click="confirmDeletePayroll(record.id)"><i
                        class="ti ti-trash"></i></a>
                    <a href="javascript:void(0);" class="me-2" @click="calculateTaxForEmployee(record)"
                      title="Calculate Tax"><i class="ti ti-calculator"></i></a>
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
</template>

<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { usePayrollStore } from '@/stores/payrollStore';
import { mapStores } from 'pinia';
import { Modal } from 'ant-design-vue';
import { taxCalculationsService } from '@/services/tax-calculations.service';

export default {
  data() {
    return {
      title: "Employee Salary",
      text: "HR",
      text1: "Employee Salary",
      payrolls: [],
      calculatingTaxes: false,

      // Monthly statistics
      monthlyStats: {
        totalEmployees: 0,
        totalPayroll: 0,
        totalTax: 0,
        payslipsGenerated: 0
      },

      // Tax summary
      taxSummary: {
        totalBrackets: 0,
        maxTaxRate: 0,
        standardDeduction: 60000
      },

      // Current tax year
      currentTaxYear: new Date().getFullYear(),

      // Pagination
      currentPage: 1,
      pageSize: 10,
      paginationSettings: {
        pageSizeOptions: ['5', '10', '20', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: false,
      },

      // Filter and sort info
      filteredInfo: {},
      sortedInfo: {},

      // Row selection configuration
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows);
        },
      },

      payrollToEdit: null,
      payrollToDelete: null,

      // Sample demo record
      samplePayroll: {
        id: 'demo-1',
        employee_id: 'emp-123',
        staff_id: 'STF-001',
        employeeName: 'John Doe',
        department: 'Finance',
        position: 'Financial Analyst',
        basic_salary: 5000,
        net_paid: 4500,
        pay_period_date: moment().format("DD MMM YYYY"),
        created_at: moment().format("DD MMM YYYY"),
        payslip: 'Generate Slip',
        payslip_number: 'PS-2023-001'
      },
    };
  },

  computed: {
    ...mapStores(usePayrollStore),

    // Define columns with filters and sorters
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: 'ID',
          dataIndex: 'id',
          fixed: 'left',
          key: 'id',
        },
        {
          title: 'Dept',
          dataIndex: 'department',
          key: 'department',
          fixed: 'left',
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
          title: 'Staff ID',
          dataIndex: 'staff_id',
          key: 'staff_id',
          fixed: 'left',
          filters: this.getUniqueValues('staff_id'),
          filteredValue: filtered.staff_id || null,
          onFilter: (value, record) => record.staff_id.includes(value),
          sorter: (a, b) => {
            a = a.staff_id.toLowerCase();
            b = b.staff_id.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'staff_id' && sorted.order,
        },
        {
          title: 'Employee Name',
          dataIndex: 'employeeName',
          key: 'employeeName',
          fixed: 'left',
          filteredValue: filtered.employeeName || null,
          onFilter: (value, record) => record.employeeName.toLowerCase().includes(value.toLowerCase()),
          sorter: (a, b) => {
            a = a.employeeName.toLowerCase();
            b = b.employeeName.toLowerCase();
            return a.localeCompare(b);
          },
          sortOrder: sorted.columnKey === 'employeeName' && sorted.order,
        },
        {
          title: 'Basic Salary',
          dataIndex: 'basic_salary',
          key: 'basic_salary',
          sorter: (a, b) => (a.basic_salary || 0) - (b.basic_salary || 0),
          sortOrder: sorted.columnKey === 'basic_salary' && sorted.order,
          render: (text) => {
            return `฿${parseFloat(text || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        },
        {
          title: 'Taxable Income',
          dataIndex: 'taxableIncome',
          key: 'taxableIncome',
          sorter: (a, b) => (a.taxableIncome || 0) - (b.taxableIncome || 0),
          sortOrder: sorted.columnKey === 'taxableIncome' && sorted.order,
        },
        {
          title: 'Retroactive Fund',
          dataIndex: 'retroactive_fund',
          key: 'retroactive_fund',
          sorter: (a, b) => (a.retroactive_fund || 0) - (b.retroactive_fund || 0),
          sortOrder: sorted.columnKey === 'retroactive_fund' && sorted.order,
          render: (text) => {
            if (!text) return '฿0.00';
            return `฿${parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        },
        {
          title: '13 mo.salary',
          dataIndex: 'thirteenth_month_salary',
          key: 'thirteenth_month_salary',
          sorter: (a, b) => (a.thirteenth_month_salary || 0) - (b.thirteenth_month_salary || 0),
          sortOrder: sorted.columnKey === 'thirteenth_month_salary' && sorted.order,
          render: (text) => {
            if (!text) return '฿0.00';
            return `฿${parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        },
        {
          title: 'Salary Accrue',
          dataIndex: 'salary_accrue',
          key: 'salary_accrue',
          sorter: (a, b) => (a.salary_accrue || 0) - (b.salary_accrue || 0),
          sortOrder: sorted.columnKey === 'salary_accrue' && sorted.order,
          render: (text) => {
            if (!text) return '฿0.00';
            return `฿${parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        },
        {
          title: 'PVD/Saving Fund',
          dataIndex: 'pvd_saving_fund',
          key: 'pvd_saving_fund',
          sorter: (a, b) => (a.pvd_saving_fund || 0) - (b.pvd_saving_fund || 0),
          sortOrder: sorted.columnKey === 'pvd_saving_fund' && sorted.order,
          render: (text) => {
            if (!text) return '฿0.00';
            return `฿${parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        },
        {
          title: 'SSF',
          dataIndex: 'ssf',
          key: 'ssf',
          sorter: (a, b) => (a.ssf || 0) - (b.ssf || 0),
          sortOrder: sorted.columnKey === 'ssf' && sorted.order,
          render: (text) => {
            if (!text) return '฿0.00';
            return `฿${parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        },
        {
          title: 'H/W',
          dataIndex: 'hw',
          key: 'hw',
          sorter: (a, b) => (a.hw || 0) - (b.hw || 0),
          sortOrder: sorted.columnKey === 'hw' && sorted.order,
          render: (text) => {
            if (!text) return '฿0.00';
            return `฿${parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        },
        {
          title: 'Tax',
          dataIndex: 'tax',
          key: 'tax',
          sorter: (a, b) => (a.tax || 0) - (b.tax || 0),
          sortOrder: sorted.columnKey === 'tax' && sorted.order,
        },
        {
          title: 'Net Salary',
          dataIndex: 'net_paid',
          key: 'net_paid',
          sorter: (a, b) => (a.net_paid || 0) - (b.net_paid || 0),
          sortOrder: sorted.columnKey === 'net_paid' && sorted.order,
          render: (text) => {
            if (!text) return '฿0.00';
            return `฿${parseFloat(text).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        },
        {
          title: 'Payslip',
          dataIndex: 'payslip',
          key: 'payslip',
        },
        {
          title: 'Actions',
          key: 'action',
          fixed: 'right',
        },
      ];
    },

    pagination() {
      return {
        ...this.paginationSettings,
        current: this.currentPage,
        pageSize: this.pageSize,
        total: this.payrollStore.payrolls.length,
        showTotal: (total) => `Total ${total} payrolls`,
      };
    }
  },

  mounted() {
    this.fetchPayrolls();
    this.$nextTick(() => {
      this.initializeDateRangePicker();
    });
  },

  beforeUnmount() {
    // Cleanup DateRangePicker when component is destroyed
    if (this.daterangepicker) {
      this.daterangepicker.remove();
    }
  },

  methods: {
    // Format currency helper
    formatCurrency(amount) {
      if (!amount) return '0.00';
      return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },

    // Calculate monthly statistics
    calculateMonthlyStats() {
      if (!this.payrolls || this.payrolls.length === 0) {
        this.monthlyStats = {
          totalEmployees: 0,
          totalPayroll: 0,
          totalTax: 0,
          payslipsGenerated: 0
        };
        return;
      }

      this.monthlyStats = {
        totalEmployees: this.payrolls.length,
        totalPayroll: this.payrolls.reduce((sum, payroll) => sum + (parseFloat(payroll.basic_salary) || 0), 0),
        totalTax: this.payrolls.reduce((sum, payroll) => sum + (parseFloat(payroll.tax) || 0), 0),
        payslipsGenerated: this.payrolls.filter(payroll => payroll.payslip_number).length
      };
    },

    // Calculate tax for a specific employee
    async calculateTaxForEmployee(employee) {
      try {
        const taxableIncome = this.calculateTaxableIncome(employee);
        const taxCalculation = await this.calculateTax(taxableIncome);

        // Update the employee record with tax information
        const index = this.payrolls.findIndex(p => p.id === employee.id);
        if (index !== -1) {
          this.payrolls[index] = {
            ...this.payrolls[index],
            taxableIncome: taxableIncome,
            tax: taxCalculation.totalTax,
            taxBreakdown: taxCalculation.breakdown
          };
        }

        this.$message.success(`Tax calculated for ${employee.employeeName}`);
      } catch (error) {
        console.error('Error calculating tax for employee:', error);
        this.$message.error('Failed to calculate tax');
      }
    },

    // Calculate taxable income for an employee
    calculateTaxableIncome(employee) {
      const basicSalary = parseFloat(employee.basic_salary) || 0;
      const retroactiveFund = parseFloat(employee.retroactive_fund) || 0;
      const thirteenthMonthSalary = parseFloat(employee.thirteenth_month_salary) || 0;
      const salaryAccrue = parseFloat(employee.salary_accrue) || 0;

      // Thailand standard deduction (฿60,000 per year)
      const standardDeduction = 60000 / 12; // Monthly deduction

      const totalIncome = basicSalary + retroactiveFund + thirteenthMonthSalary + salaryAccrue;
      const taxableIncome = Math.max(0, totalIncome - standardDeduction);

      return taxableIncome;
    },

    // Calculate tax using Thailand tax brackets
    async calculateTax(taxableIncome) {
      try {
        // Thailand Personal Income Tax Brackets (2024)
        const taxBrackets = [
          { min: 0, max: 150000, rate: 0.05 },
          { min: 150000, max: 300000, rate: 0.10 },
          { min: 300000, max: 500000, rate: 0.15 },
          { min: 500000, max: 750000, rate: 0.20 },
          { min: 750000, max: 1000000, rate: 0.25 },
          { min: 1000000, max: 2000000, rate: 0.30 },
          { min: 2000000, max: 5000000, rate: 0.35 },
          { min: 5000000, max: Infinity, rate: 0.37 }
        ];

        let totalTax = 0;
        const breakdown = {};
        const annualIncome = taxableIncome * 12;

        for (const bracket of taxBrackets) {
          if (annualIncome > bracket.min) {
            const taxableInBracket = Math.min(
              annualIncome - bracket.min,
              bracket.max - bracket.min
            );
            const taxInBracket = taxableInBracket * bracket.rate;
            totalTax += taxInBracket;

            if (taxInBracket > 0) {
              breakdown[`${bracket.rate * 100}%`] = taxInBracket;
            }
          }
        }

        return {
          totalTax: totalTax / 12, // Convert to monthly
          breakdown: breakdown
        };
      } catch (error) {
        console.error('Error calculating tax:', error);
        throw error;
      }
    },

    // Calculate taxes for all employees
    async calculateAllTaxes() {
      this.calculatingTaxes = true;
      try {
        for (const employee of this.payrolls) {
          await this.calculateTaxForEmployee(employee);
        }
        this.calculateMonthlyStats();
        this.$message.success('Taxes calculated for all employees');
      } catch (error) {
        console.error('Error calculating taxes for all employees:', error);
        this.$message.error('Failed to calculate taxes for all employees');
      } finally {
        this.calculatingTaxes = false;
      }
    },

    // Get unique values for filter dropdowns
    getUniqueValues(field) {
      if (!this.payrolls || this.payrolls.length === 0) return [];

      const uniqueValues = [...new Set(this.payrolls.map(item => item[field]))].filter(Boolean);
      return uniqueValues.map(value => ({ text: value, value }));
    },

    // Handle table change (pagination, filters, sorter)
    handleChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter);
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      this.currentPage = pagination.current;
      this.pageSize = pagination.pageSize;
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

    booking_range(start, end) {
      return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
    },

    initializeDateRangePicker() {
      const dateRangeInput = this.$refs.dateRangeInput;
      if (dateRangeInput) {
        const start = moment().subtract(6, "days");
        const end = moment();

        this.daterangepicker = new DateRangePicker(
          dateRangeInput,
          {
            startDate: start,
            endDate: end,
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              "Last 7 Days": [moment().subtract(6, "days"), moment()],
              "Last 30 Days": [moment().subtract(29, "days"), moment()],
              "This Month": [moment().startOf("month"), moment().endOf("month")],
              "Last Month": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
              ],
            },
          },
          this.booking_range
        );

        this.booking_range(start, end);
      }
    },

    mapPayrollData(data) {
      return data.map(payroll => ({
        id: payroll.id,
        employee_id: payroll.employee_id,
        staff_id: payroll.employee?.staff_id || 'N/A',
        employeeName: payroll.employee ? `${payroll.employee.first_name_en} ${payroll.employee.last_name_en}`.trim() : 'N/A',
        department: payroll.employee?.employment?.department_position?.department || 'N/A',
        position: payroll.employee?.employment?.department_position?.position || 'N/A',
        basic_salary: payroll.basic_salary,
        net_paid: payroll.net_paid,
        pay_period_date: moment(payroll.pay_period_date).format("DD MMM YYYY"),
        created_at: moment(payroll.created_at).format("DD MMM YYYY"),
        payslip: 'Generate Slip',
        payslip_number: payroll.payslip_number || 'Not Generated',
        // Additional fields for Thailand tax calculation
        retroactive_fund: payroll.retroactive_fund || 0,
        thirteenth_month_salary: payroll.thirteenth_month_salary || 0,
        salary_accrue: payroll.salary_accrue || 0,
        pvd_saving_fund: payroll.pvd_saving_fund || 0,
        ssf: payroll.ssf || 0,
        hw: payroll.hw || 0,
        tax: payroll.tax || 0,
        taxableIncome: 0,
        taxBreakdown: null
      }));
    },

    async fetchPayrolls() {
      try {
        await this.payrollStore.fetchPayrolls();
        this.payrolls = this.mapPayrollData(this.payrollStore.payrolls);

        // Calculate initial statistics
        this.calculateMonthlyStats();

        // Set tax summary
        this.taxSummary = {
          totalBrackets: 8, // Thailand has 8 tax brackets
          maxTaxRate: 37, // Maximum tax rate is 37%
          standardDeduction: 60000
        };

        this.$message.success('Payrolls loaded successfully');
      } catch (error) {
        console.error("Error fetching payrolls:", error);
        this.$message.error('Failed to load payrolls');
      }
    },

    // Add a sample record for demo purposes
    addSampleRecord() {
      // Check if the demo record already exists
      const exists = this.payrolls.some(p => p.id === this.samplePayroll.id);
      if (!exists) {
        this.payrolls.unshift(this.samplePayroll);
      }
    },

    // Format currency helper
    formatCurrency(amount) {
      if (!amount) return '0.00';
      return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },

    // Calculate monthly statistics
    calculateMonthlyStats() {
      if (!this.payrolls || this.payrolls.length === 0) {
        this.monthlyStats = {
          totalEmployees: 0,
          totalPayroll: 0,
          totalTax: 0,
          payslipsGenerated: 0
        };
        return;
      }

      this.monthlyStats = {
        totalEmployees: this.payrolls.length,
        totalPayroll: this.payrolls.reduce((sum, payroll) => sum + (parseFloat(payroll.basic_salary) || 0), 0),
        totalTax: this.payrolls.reduce((sum, payroll) => sum + (parseFloat(payroll.tax) || 0), 0),
        payslipsGenerated: this.payrolls.filter(payroll => payroll.payslip_number).length
      };
    },

    // Calculate tax for a specific employee
    async calculateTaxForEmployee(employee) {
      try {
        const taxableIncome = this.calculateTaxableIncome(employee);
        const taxCalculation = await this.calculateTax(taxableIncome);

        // Update the employee record with tax information
        const index = this.payrolls.findIndex(p => p.id === employee.id);
        if (index !== -1) {
          this.payrolls[index] = {
            ...this.payrolls[index],
            taxableIncome: taxableIncome,
            tax: taxCalculation.totalTax,
            taxBreakdown: taxCalculation.breakdown
          };
        }

        this.$message.success(`Tax calculated for ${employee.employeeName}`);
      } catch (error) {
        console.error('Error calculating tax for employee:', error);
        this.$message.error('Failed to calculate tax');
      }
    },

    // Calculate taxable income for an employee
    calculateTaxableIncome(employee) {
      const basicSalary = parseFloat(employee.basic_salary) || 0;
      const retroactiveFund = parseFloat(employee.retroactive_fund) || 0;
      const thirteenthMonthSalary = parseFloat(employee.thirteenth_month_salary) || 0;
      const salaryAccrue = parseFloat(employee.salary_accrue) || 0;

      // Thailand standard deduction (฿60,000 per year)
      const standardDeduction = 60000 / 12; // Monthly deduction

      const totalIncome = basicSalary + retroactiveFund + thirteenthMonthSalary + salaryAccrue;
      const taxableIncome = Math.max(0, totalIncome - standardDeduction);

      return taxableIncome;
    },

    // Calculate tax using Thailand tax brackets
    async calculateTax(taxableIncome) {
      try {
        // Thailand Personal Income Tax Brackets (2024)
        const taxBrackets = [
          { min: 0, max: 150000, rate: 0.05 },
          { min: 150000, max: 300000, rate: 0.10 },
          { min: 300000, max: 500000, rate: 0.15 },
          { min: 500000, max: 750000, rate: 0.20 },
          { min: 750000, max: 1000000, rate: 0.25 },
          { min: 1000000, max: 2000000, rate: 0.30 },
          { min: 2000000, max: 5000000, rate: 0.35 },
          { min: 5000000, max: Infinity, rate: 0.37 }
        ];

        let totalTax = 0;
        const breakdown = {};
        const annualIncome = taxableIncome * 12;

        for (const bracket of taxBrackets) {
          if (annualIncome > bracket.min) {
            const taxableInBracket = Math.min(
              annualIncome - bracket.min,
              bracket.max - bracket.min
            );
            const taxInBracket = taxableInBracket * bracket.rate;
            totalTax += taxInBracket;

            if (taxInBracket > 0) {
              breakdown[`${bracket.rate * 100}%`] = taxInBracket;
            }
          }
        }

        return {
          totalTax: totalTax / 12, // Convert to monthly
          breakdown: breakdown
        };
      } catch (error) {
        console.error('Error calculating tax:', error);
        throw error;
      }
    },

    // Calculate taxes for all employees
    async calculateAllTaxes() {
      this.calculatingTaxes = true;
      try {
        for (const employee of this.payrolls) {
          await this.calculateTaxForEmployee(employee);
        }
        this.calculateMonthlyStats();
        this.$message.success('Taxes calculated for all employees');
      } catch (error) {
        console.error('Error calculating taxes for all employees:', error);
        this.$message.error('Failed to calculate taxes for all employees');
      } finally {
        this.calculatingTaxes = false;
      }
    },

    calculateTotalAmount() {
      if (!this.payrollStore.payrolls || this.payrollStore.payrolls.length === 0) {
        return '$0.00';
      }

      const total = this.payrollStore.payrolls.reduce((sum, payroll) => {
        return sum + (parseFloat(payroll.net_paid) || 0);
      }, 0);

      return '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    countPendingPayrolls() {
      if (!this.payrollStore.payrolls) return 0;

      return this.payrollStore.payrolls.filter(payroll => !payroll.payslip_number).length;
    },

    countProcessedPayrolls() {
      if (!this.payrollStore.payrolls) return 0;

      return this.payrollStore.payrolls.filter(payroll => payroll.payslip_number).length;
    },

    editPayroll(payroll) {
      this.payrollToEdit = payroll;
      // The modal will be shown by the data-bs-target attribute
    },

    confirmDeletePayroll(id) {
      Modal.confirm({
        title: 'Are you sure you want to delete this payroll?',
        content: 'This action cannot be undone.',
        centered: true,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          this.deletePayroll(id);
        }
      });
    },

    async deletePayroll(id) {
      if (!id) return;

      try {
        await this.payrollStore.deletePayroll(id);
        this.$message.success('Payroll deleted successfully');
        this.fetchPayrolls();
      } catch (error) {
        this.$message.error('Failed to delete payroll');
        console.error("Error deleting payroll:", error);
      }
    }
  }
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

/* Persistent hover effect - keeps the background color until cursor leaves the row */
:deep(.ant-table-tbody > tr:hover)>td {
  background-color: #f0f7ff !important;
  transition: background-color 0.1s ease;
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

/* Statistic cards styling */
.bg-light-primary {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.bg-light-success {
  background-color: rgba(25, 135, 84, 0.1) !important;
}

.bg-light-warning {
  background-color: rgba(255, 193, 7, 0.1) !important;
}

.bg-light-info {
  background-color: rgba(13, 202, 240, 0.1) !important;
}

.bg-light-secondary {
  background-color: rgba(108, 117, 125, 0.1) !important;
}

/* Tax calculation button styling */
.cursor-pointer {
  cursor: pointer;
}

/* Avatar styling */
.avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.avatar-md {
  width: 48px;
  height: 48px;
}

.avatar i {
  font-size: 20px;
}
</style>

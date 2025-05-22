<template>
  <!-- Employee Salary -->
  <div class="modal fade" id="new-employee-salary" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-fullscreen">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h4 class="modal-title" id="myExtraLargeModalLabel">Add Employee Salary</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <div class="modal-body pb-0 resize-observer-fix">
          <div class="accordion" id="addSalaryAccordion">
            <!-- Employee Info -->
            <div class="accordion-item" :class="{ active: open.employeeInfo }">
              <div class="accordion-header" @click="toggle('employeeInfo')">
                <div class="arrow"></div>
                <div class="title">Employee Information</div>
              </div>
              <div class="accordion-content">
                <div class="inner">
                  <div class="row">
                    <!-- LEFT column: both selector & date -->
                    <div class="col-12 col-md-4">
                      <!-- Employee selector -->
                      <div class="mb-3">
                        <label class="form-label">Employee Name</label>
                        <a-tree-select v-model:value="formData.employee_id" show-search allow-clear
                          placeholder="Select employee" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                          @change="onEmployeeSelect" :tree-data="processedTreeData" tree-node-filter-prop="title"
                          :getPopupContainer="getPopupContainer" style="width:100%" />
                      </div>

                      <!-- Pay period date sits under the selector -->
                      <div class="mb-3">
                        <label class="form-label">Pay Period Date <span class="text-danger">*</span></label>
                        <div class="input-icon-end position-relative">
                          <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                            :clearable="false" :input-format="dateFormat" v-model="formData.pay_period_date"
                            :append-to-body="true" />
                          <span class="input-icon-addon">
                            <i class="ti ti-calendar text-gray-7"></i>
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- RIGHT column: the employee-details card spans both of the above -->
                    <div class="col-12 col-md-8" v-if="employeeDetails">
                      <a-card class="employee-card p-3">
                        <div class="d-flex align-items-center">

                          <div>
                            <h5 class="mb-1">
                              {{ employeeDetails.first_name_en }}
                              <span v-if="employeeDetails.last_name_en && employeeDetails.last_name_en !== '-'">
                                {{ employeeDetails.last_name_en }}
                              </span>
                            </h5>
                            <p class="mb-0 text-muted">Staff ID: {{ employeeDetails.staff_id }}</p>
                            <p class="mb-0 text-muted">Subsidiary: {{ employeeDetails.subsidiary }}</p>
                          </div>
                        </div>
                      </a-card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add space between accordion and table -->
          <div style="height: 24px;"></div>
          <!-- Grant Information Title -->
          <div class="mb-3">
            <h5 class="fw-bold">Grant Information</h5>
          </div>


          <!-- 2) Grants Editable Table -->
          <a-table :columns="columns" :data-source="dataSource" row-key="key" bordered :scroll="{ x: 1500 }">
            <template #bodyCell="{ column, text, record }">

              <!-- LOE column (editable) -->
              <template v-if="column.dataIndex === 'loe'">
                <div>
                  <template v-if="editableData[record.key]">
                    <a-input-number v-model:value="editableData[record.key].loe" style="margin: -5px 0; width: 100%"
                      :min="0" :max="100" />
                  </template>
                  <template v-else>
                    {{ text }}%
                  </template>
                </div>
              </template>

              <!-- Amount column (editable) -->
              <template v-if="column.dataIndex === 'amount'">
                <div>
                  <template v-if="editableData[record.key]">
                    <a-input-number v-model:value="editableData[record.key].amount" style="margin: -5px 0; width: 100%"
                      :min="0" />
                  </template>
                  <template v-else>
                    {{ formatCurrency(text) }}
                  </template>
                </div>
              </template>

              <!-- Actions column -->
              <template v-else-if="column.key === 'actions'">
                <div class="editable-row-operations">
                  <span v-if="editableData[record.key]">
                    <a-typography-link @click="save(record.key)">Save</a-typography-link>
                    <a-typography-link @click="cancel(record.key)">Cancel</a-typography-link>
                  </span>
                  <span v-else>
                    <a @click="edit(record.key)">Edit</a>
                  </span>
                </div>
              </template>
            </template>
          </a-table>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-white me-2" data-bs-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  <!-- /Add Employee Salary -->


  <!-- Edit Employee Salary (same accordion structure) -->
  <div class="modal fade" id="edit-employee-salary">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Employee Salary</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <form @submit.prevent="submitEditForm">
          <div class="modal-body pb-0">
            <div class="accordion" id="editSalaryAccordion">
              <!-- repeat the exact same six accordion-item blocks, but bind to editFormData and openEdit -->
              <!-- for brevity, here's one example; replicate for the others -->
              <div class="accordion-item" :class="{ active: openEdit.employeeInfo }">
                <div class="accordion-header" @click="toggleEdit('employeeInfo')">
                  <div class="arrow"></div>
                  <div class="title">Employee Information</div>
                </div>
                <div class="accordion-content">
                  <div class="inner">
                    <div class="row">
                      <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">Employee Name</label>
                        <vue-select :options="EditEmpoyeName" v-model="editFormData.employee_id" placeholder="Select" />
                      </div>
                      <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">Pay Period Date</label>
                        <input type="date" class="form-control" v-model="editFormData.pay_period_date" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- …and so on for Earnings, Deductions, Employer Contributions, Summary, Payslip… -->
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Employee Salary</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Delete Modal (unchanged) -->
  <div class="modal fade" id="delete_modal">
    <!-- … -->
  </div>
</template>

<script>
import { employeeService } from "@/services/employee.service";
import { payrollService } from "@/services/payroll.service";
import { cloneDeep } from 'lodash-es';
import { Modal } from 'ant-design-vue';


export default {
  data() {
    return {
      // tree dat for dropdown
      employeeTreeData: [],
      employeeDetails: null,
      // cache for lazy-load 
      employeeCache: new Map(),

      // editable data
      editableData: {},
      editableCols: ['loe', 'amount'],

      // table data 
      dataSource: [],

      // table columns
      columns: [
        {
          title: 'Staff ID',
          dataIndex: 'staff_id',
          fixed: 'left',
          width: 100,
          key: 'staff_id',
        },
        {
          title: 'Initial',
          dataIndex: 'initial_en',
          fixed: 'left',
          width: 80,
          key: 'initial_en',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          fixed: 'left',
          width: 150,
          key: 'name',
        },
        {
          title: 'Full Name',
          dataIndex: 'full_name',
          fixed: 'left',
          width: 200,
          key: 'full_name',
        },
        {
          title: 'Pay Method',
          dataIndex: 'pay_method',
          width: 100,
          key: 'pay_method',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          width: 150,
          key: 'status',
        },
        {
          title: 'PVD/Saving Fund',
          dataIndex: 'pvd_saving_fund',
          width: 150,
          key: 'pvd_saving_fund',
        },
        {
          title: 'Grant (LOE)',
          dataIndex: 'loe',
          width: 100,
          key: 'loe',
        },
        {
          title: 'Salary (Previous Year)',
          dataIndex: 'salary_previous_year',
          width: 170,
          key: 'salary_previous_year',
        },
        {
          title: '1%',
          dataIndex: 'one_percent',
          width: 100,
          key: 'one_percent',
        },
        {
          title: 'Basic Salary (This Year)',
          dataIndex: 'amount',
          width: 150,
          key: 'amount',
        },
        {
          title: 'Salary by FTE',
          dataIndex: 'salary_by_fte',
          width: 150,
          key: 'salary_by_fte',
        },
        {
          title: 'Compensation Refund',
          dataIndex: 'compensation_refund',
          width: 150,
          key: 'compensation_refund',
        },
        {
          title: '13th Month Salary',
          dataIndex: 'thirteen_month_salary',
          width: 150,
          key: 'thirteen_month_salary',
        },
        {
          title: 'PVD / Saving Fund 7%',
          dataIndex: 'pvd_saving_fund',
          width: 150,
          key: 'pvd_saving_fund',
        },
        {
          title: 'Employer S.Insu 13%',
          dataIndex: 'employer_social_security',
          width: 150,
          key: 'employer_si',
        },
        {
          title: 'Employee S.Insu 7%',
          dataIndex: 'employee_social_security',
          width: 150,
          key: 'employee_social_security',
        },
        {
          title: 'Employer H.Welfare 1%',
          dataIndex: 'employer_health_welfare',
          width: 150,
          key: 'employer_health_welfare',
        },
        {
          title: 'Employee H.Welfare 1%',
          dataIndex: 'employee_health_welfare',
          width: 150,
          key: 'employee_health_welfare',
        },
        {
          title: 'Tax',
          dataIndex: 'tax',
          width: 150,
          key: 'tax',
        },
        {
          title: 'Balance',
          dataIndex: 'balance',
          width: 150,
          key: 'balance',
        },
        {
          title: 'Sal+SC+SF+M13',
          dataIndex: 'sal_sc_sf_m13',
          width: 150,
          key: 'sal_sc_sf_m13',
        },
        {
          title: 'SF (2 Sides)',
          dataIndex: 'sf_2_sides',
          width: 150,
          key: 'sf_2_sides',
        },
        {
          title: 'Actual Position',
          dataIndex: 'actual_position',
          width: 150,
          key: 'actual_position',
        },
        {
          title: 'Report to',
          dataIndex: 'report_to',
          width: 150,
          key: 'report_to',
        },
        {
          title: 'Position Under Grant',
          dataIndex: 'position_under_grant',
          width: 150,
          key: 'position_under_grant',
        },
        {
          title: 'Budget Line',
          dataIndex: 'budget_line',
          width: 150,
          key: 'budget_line',
        },
        {
          title: 'Grant Name',
          dataIndex: 'grant_name',
          width: 150,
          key: 'grant_name',
        },
        {
          title: 'Actions',
          fixed: 'right',
          key: 'actions',
          width: 120,
        },
      ],

      // form state…
      formData: {
        chargeType: "normal",
        grant_id: null,
        isAdvanced: false,
        employee_id: null,
        pay_period_date: null,
        grand_total_income: 0,
        grand_total_deduction: 0,
        net_paid: 0,
        employer_contribution_total: 0,
        two_sides: 0,
        payslip_date: null,
        payslip_number: null,
        staff_signature: null,
        basic_salary: 0,
        salary_by_FTE: 0,
        compensation_refund: 0,
        thirteen_month_salary: 0,
        pvd: 0,
        saving_fund: 0,
        employee_social_security: 0,
        employee_health_welfare: 0,
        tax: 0,
        employer_social_security: 0,
        employer_health_welfare: 0,
      },

      editFormData: {
        chargeType: "normal",
        grant_id: null,
      },

      // which sections are open?
      open: {
        employeeInfo: true,
        earnings: false,
        deductions: false,
        employerContrib: false,
        summary: false,
        payslip: false,
        grantInfo: false,
      },
      openEdit: {
        employeeInfo: true,
        earnings: false,
        deductions: false,
        employerContrib: false,
        summary: false,
        payslip: false,
        grant_id: null,
      },

    };
  },


  mounted() {
    this.loadEmployees();
    if (this.formData.isAdvanced) {
      this.formData.chargeType = "cross";
      this.onChargeTypeChange();
    }
  },

  watch: {
    // lazy-load on selection 
    "formData.employee_id": {

      async handler() {
        this.loadEmployee(this.formData.employee_id);
      },
      immediate: true,
    },
  },

  computed: {

    // disable parent nodes (subsidiaries)
    processedTreeData() {
      return (this.employeeTreeData || []).map(node => ({
        ...node,
        selectable: false,
        disabled: true,
        children: (node.children || []).map(child => ({
          ...child,
          selectable: true,
          disabled: false
        }))
      }));
    },

    selectedGrant() {
      return this.grants.find(grant => grant.id === this.formData.grant_id);
    },

    hubGrantId() {
      // Find a default grant (e.g., the first one) to use when in cross-charge mode
      return this.grants.length > 0 ? this.grants[0] : null;
    },
  },
  methods: {

    // Cancel edit
    cancel(id) {
      console.log("Canceling edit for row with key:", id);
      // if it was a newly added line
      const idx = this.dataSource.findIndex(r => r.id === id);
      if (this.editableData[id].__isNew && idx !== -1) {
        this.dataSource.splice(idx, 1);
      }
      // drop the buffer
      delete this.editableData[id];
    },

    // Edit row
    edit(key) {
      console.log("Editing row with key:", key);
      const item = this.dataSource.find(item => item.key === key);
      if (item) {
        this.editableData[key] = cloneDeep(item);
      }
    },

    async onEmployeeSelect(id) {
      // 1) Clear out old data if they un‐select
      if (!id) {
        this.employeeDetails = null;
        this.dataSource = [];
        return;
      }

      // 2) (Optionally) check cache, show loading indicator, etc.

      // 3) Delegate to the actual API call
      await this.getEmployeeDetails(id);
    },

    // If a tree select is selected, then call the api to get the employee details
    async getEmployeeDetails(employeeId) {
      const response = await payrollService.getEmployeeEmploymentDetails(employeeId);
      const emp = response.data;

      // check if the employment is null or not
      if (!emp.employment || Object.keys(emp.employment).length === 0) {
        this.$message.error('Employee employment details not found');
        this.emptyEmployeeDetails();
        return;
      }

      // 1) get the employee's salary details
      this.employeeDetails = emp;

      // 2) map each grant allocation to one table row 
      this.dataSource = (emp.employee_grant_allocations || []).map(allocation => {
        const g = allocation.grant_item_allocation.grant;
        const grantItem = allocation.grant_item_allocation;
        return {
          key: allocation.id,
          staff_id: emp.staff_id,
          initial_en: emp.initial_en,
          name: `${emp.first_name_en} ${emp.last_name_en}`,
          full_name: `${emp.first_name_en} ${emp.last_name_en}`,
          pay_method: emp.employment.employment_type,
          status: emp.status,
          grant_loe: allocation.level_of_effort,
          salary_previous_year: emp.employment.position_salary,
          one_percent: (parseFloat(emp.employment.position_salary) * 0.01).toFixed(2),
          basic_salary_this_year: grantItem.grant_salary,
          salary_by_fte: (parseFloat(grantItem.grant_salary) * parseFloat(emp.employment.fte)).toFixed(2),
          compensation_refund: "0.00",
          thirteen_month_salary: "0.00",
          pvd_saving_fund: emp.employment.pvd === "1" ? (parseFloat(grantItem.grant_salary) * 0.07).toFixed(2) :
            emp.employment.saving_fund === "1" ? (parseFloat(grantItem.grant_salary) * 0.07).toFixed(2) : "0.00",
          employer_social_security: (parseFloat(grantItem.grant_salary) * 0.13).toFixed(2),
          employee_social_security: (parseFloat(grantItem.grant_salary) * 0.07).toFixed(2),
          employer_health_welfare: (parseFloat(grantItem.grant_salary) * 0.01).toFixed(2),
          employee_health_welfare: (parseFloat(grantItem.grant_salary) * 0.01).toFixed(2),
          tax: (parseFloat(grantItem.grant_salary) * (parseFloat(emp.employment.employee_tax) / 100)).toFixed(2),
          balance: "0.00",
          sal_sc_sf_m13: "0.00",
          sf_2_sides: "0.00",
          actual_position: emp.employment.department_position.position,
          report_to: "-",
          position_under_grant: grantItem.grant_position,
          budget_line: grantItem.bg_line,
          grant_name: g.name,
          loe: parseFloat(allocation.level_of_effort),
          amount: parseFloat(grantItem.grant_salary)
        };
      });
    },

    // make method that empty the employee details and datasource 
    emptyEmployeeDetails() {
      this.employeeDetails = null;
      this.dataSource = [];
    },

    // load employees
    async loadEmployees() {
      try {
        const response = await employeeService.treeSearch();
        // The API now directly returns the tree structure we need
        this.employeeTreeData = response.data || [];
      } catch (error) {
        console.error('Error loading employees:', error);
        this.$message.error('Failed to load employees');
      }
    },

    async loadEmployee(employeeId) {
      console.log(employeeId);
    },

    // toggles for Add form
    toggle(section) {
      this.open[section] = !this.open[section];

    },

    currency(n) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(n);
    },

    onChargeTypeChange() {
      if (this.formData.chargeType === "cross") {
        // Set to a default grant when in cross-charge mode
        if (this.hubGrantId) {
          this.formData.grant_id = this.hubGrantId.id;
        }
      } else {
        this.formData.grant_id = null;
      }
    },

    // toggles for Edit form
    toggleEdit(section) {
      this.openEdit[section] = !this.openEdit[section];
    },

    // currency formatter
    formatMoney(val) {
      return "฿" + parseFloat(val || 0).toFixed(2);
    },

    // the same calculation methods as before…
    calculateTotals() { /* … */ },
    calculateEmployerContribution() { /* … */ },
    calculateEditTotals() { /* … */ },
    calculateEditEmployerContribution() { /* … */ },

    // submit handlers
    submitForm() { this.$router.push("/payroll/employee-salary"); },
    submitEditForm() { this.$router.push("/payroll/employee-salary"); },

    // Save changes
    async save(key) {
      console.log("Saving row with key:", key);
      if (!this.editableData[key]) return;

      const itemData = this.editableData[key];

      // Basic validation
      if (
        itemData.loe == null ||
        itemData.amount == null
      ) {
        this.$message.error('Please fill in all fields');
        return;
      }

      try {
        // Update the item in the dataSource
        const index = this.dataSource.findIndex(item => item.key === key);
        if (index !== -1) {
          this.dataSource[index] = { ...this.dataSource[index], ...itemData };

          // Recalculate dependent values based on new LOE and amount
          const item = this.dataSource[index];
          const loe = parseFloat(item.loe) / 100;
          const amount = parseFloat(item.amount);

          // Update dependent fields
          item.grant_loe = item.loe; // Keep both fields in sync
          item.basic_salary_this_year = amount; // Keep both fields in sync
          item.salary_by_fte = (amount * parseFloat(this.employeeDetails.employment.fte)).toFixed(2);

          // Calculate saving fund based on employment settings
          item.pvd_saving_fund = this.employeeDetails.employment.pvd === "1" ? (amount * 0.07).toFixed(2) :
            this.employeeDetails.employment.saving_fund === "1" ? (amount * 0.07).toFixed(2) : "0.00";

          // Calculate contributions based on salary and LOE
          item.employer_social_security = (amount * 0.13 * loe).toFixed(2);
          item.employee_social_security = (amount * 0.07 * loe).toFixed(2);
          item.employer_health_welfare = (amount * 0.01 * loe).toFixed(2);
          item.employee_health_welfare = (amount * 0.01 * loe).toFixed(2);

          // Calculate tax
          item.tax = (amount * (parseFloat(this.employeeDetails.employment.employee_tax) / 100)).toFixed(2);
        }

        // Here you would typically make an API call to save the changes
        // await payrollService.updateEmployeeSalary(itemData);

        delete this.editableData[key];
        this.$message.success('Changes saved successfully');
      } catch (error) {
        console.error('Error saving changes:', error);
        this.$message.error('Failed to save changes');
      }
    },



    // Confirm delete grant item
    confirmDeleteItem(record) {
      Modal.confirm({
        title: 'Are you sure you want to delete this grant item?',
        content: 'This action cannot be undone.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          this.deleteItem(record);
        }
      });
    },

    // Format currency
    formatCurrency(value) {
      if (!value) return '฿0.00';
      return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2
      }).format(value);
    },
  },
};
</script>

<style scoped>
/* Accordion base */
.accordion {
  width: 100%;
}

.accordion-item+.accordion-item {
  margin-top: 8px;
}

.accordion-header {
  background-color: #DADCE1;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
}

.accordion-header .arrow {
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid #333;
  margin-right: 8px;
  transition: transform 0.2s ease;
}

.accordion-header .title {
  font-size: 14px;
  font-weight: bold;
}

/* content */
.accordion-content {
  border-top: 1px solid #ccc;
  background: #fff;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
}

.accordion-content .inner {
  padding: 12px;
}

/* active/open state */
.accordion-item.active .arrow {
  transform: rotate(90deg);
}

.accordion-item.active .accordion-content {
  max-height: 800px;
  /* enough for your content */
}

/* summary alerts */
.summary {
  margin-top: 12px;
  padding: 8px;
}

.modal-content {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header,
.modal-footer {
  background-color: #f8f9fa;
  border-color: #e9ecef;
}


/* make the accordion-content show overflow when open */
.accordion-item.active .accordion-content {
  overflow: visible;
}

/* or, if you want to be more surgical: let your date-picker wrapper overflow */
.input-icon-end {
  overflow: visible !important;
}

/* bump the dropdown up so it sits above everything */
.vue3-datepicker__dropdown,
.dp__menu {
  z-index: 2000;
  /* higher than your modal */
}




/* Fix for Ant Design TreeSelect in Bootstrap modal */
:deep(.ant-select-dropdown) {
  z-index: 1056 !important;
  /* Higher than Bootstrap modal z-index */
}

:deep(.ant-select) {
  width: 100%;
}

:deep(.ant-select-selector) {
  border-radius: 0.375rem !important;
  min-height: 38px !important;
  display: flex;
  align-items: center;
}

.employee-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.ant-tree-select) {
  width: 100%;
}

.editable-row-operations a {
  margin-right: 8px;
}

:deep(.ant-input-number) {
  width: 100%;
}
</style>

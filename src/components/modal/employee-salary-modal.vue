<template>
  <!-- Add Employee Salary -->
  <div class="modal fade" id="new-employee-salary">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <!-- header -->
        <div class="modal-header">
          <h4 class="modal-title">Add Employee Salary</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
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
                      <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">Employee Name</label>
                        <a-tree-select v-model:value="formData.employee_id" show-search style="width: 100%;"
                          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Select employee"
                          allow-clear tree-default-expand-all :tree-data="employeeTreeData"
                          tree-node-filter-prop="title" :getPopupContainer="getPopupContainer" required />
                      </div>
                      <div class="col-12 col-md-6 mb-3">
                        <label class="form-label">Pay Period Date <span class="text-danger"> *</span></label>
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
                  </div>
                </div>
              </div>

              <!-- Earnings -->
              <div class="accordion-item" :class="{ active: open.earnings }">
                <div class="accordion-header" @click="toggle('earnings')">
                  <div class="arrow"></div>
                  <div class="title">Earnings</div>
                </div>
                <div class="accordion-content">
                  <div class="inner">
                    <div class="row">
                      <div class="col-sm-6 col-md-4 mb-3" v-for="field in earningFields" :key="field.key">
                        <label class="form-label">{{ field.label }}</label>
                        <div class="input-group">
                          <span class="input-group-text">&#3647;</span>
                          <input type="number" class="form-control" v-model="formData[field.key]"
                            @input="calculateTotals" />
                        </div>
                      </div>
                    </div>
                    <div class="alert alert-success summary">
                      <strong>Total Earnings: {{ formatMoney(formData.grand_total_income) }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Deductions -->
              <div class="accordion-item" :class="{ active: open.deductions }">
                <div class="accordion-header" @click="toggle('deductions')">
                  <div class="arrow"></div>
                  <div class="title">Deductions</div>
                </div>
                <div class="accordion-content">
                  <div class="inner">
                    <div class="row">
                      <div class="col-sm-6 col-md-4 mb-3" v-for="field in deductionFields" :key="field.key">
                        <label class="form-label">{{ field.label }}</label>
                        <div class="input-group">
                          <span class="input-group-text">&#3647;</span>
                          <input type="number" class="form-control" v-model="formData[field.key]"
                            @input="calculateTotals" />
                        </div>
                      </div>
                    </div>
                    <div class="alert alert-danger summary">
                      <strong>Total Deductions: {{ formatMoney(formData.grand_total_deduction) }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Employer Contributions -->
              <div class="accordion-item" :class="{ active: open.employerContrib }">
                <div class="accordion-header" @click="toggle('employerContrib')">
                  <div class="arrow"></div>
                  <div class="title">Employer Contributions</div>
                </div>
                <div class="accordion-content">
                  <div class="inner">
                    <div class="row">
                      <div class="col-sm-6 mb-3" v-for="field in employerFields" :key="field.key">
                        <label class="form-label">{{ field.label }}</label>
                        <div class="input-group">
                          <span class="input-group-text">&#3647;</span>
                          <input type="number" class="form-control" v-model="formData[field.key]"
                            @input="calculateEmployerContribution" />
                        </div>
                      </div>
                    </div>
                    <div class="alert alert-info summary">
                      <strong>Total Employer Contribution: {{ formatMoney(formData.employer_contribution_total)
                      }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3) Grant Information -->
              <div class="accordion-item" :class="{ active: open.grantInfo }">
                <div class="accordion-header" @click="toggle('grantInfo')">
                  <div class="arrow"></div>
                  <div class="title">Grant Information</div>
                </div>
                <div class="accordion-content">
                  <div class="inner" style="max-height: 400px; overflow-y: auto;">
                    <div v-for="slice in employeeGrantAllocations" :key="slice.id" class="card mb-3">
                      <div class="card-body">
                        <div class="row">
                          <!-- LEFT -->
                          <div class="col-12 col-md-6 mb-3 mb-md-0">
                            <h6 class="card-title">
                              {{ slice.grant.code }} – {{ slice.grant.name }}
                            </h6>
                            <p class="mb-1">
                              <strong>Subsidiary:</strong> {{ slice.grant.subsidiary }}
                            </p>
                            <p class="mb-1"><strong>LOE:</strong> {{ slice.loe }}%</p>
                            <p class="mb-0">
                              <strong>Amount:</strong> {{ currency(slice.amount) }}
                            </p>
                          </div>
                          <!-- RIGHT -->
                          <div class="col-12 col-md-6">
                            <div class="mb-2">
                              <label class="form-label">Funding Type</label>
                              <select class="form-select" v-model="slice.isAdvance">
                                <option :value="false">Normal</option>
                                <option :value="true">Advance</option>
                              </select>
                            </div>
                            <div class="border rounded p-3 bg-light" v-show="slice.isAdvance">
                              <h6>Advance Details</h6>
                              <div class="mb-2">
                                <label class="form-label">From Subsidiary</label>
                                <input type="text" class="form-control" :value="employee.subsidiary" readonly />
                              </div>
                              <div class="mb-2">
                                <label class="form-label">To Subsidiary</label>
                                <input type="text" class="form-control" :value="slice.grant.subsidiary" readonly />
                              </div>
                              <div class="mb-2">
                                <label class="form-label">Via (Hub) Grant</label>
                                <select class="form-select" v-model="slice.advance.viaGrantId">
                                  <option v-for="hub in hubGrants" :key="hub.id" :value="hub.id">
                                    {{ hub.code }} – {{ hub.name }}
                                  </option>
                                </select>
                              </div>
                              <div class="mb-2">
                                <label class="form-label">Advance Amount</label>
                                <input type="number" class="form-control" v-model.number="slice.advance.amount" />
                              </div>
                              <div class="mb-2">
                                <label class="form-label">Advance Date</label>
                                <input type="date" class="form-control" v-model="slice.advance.date" />
                              </div>
                              <div class="mb-2">
                                <label class="form-label">Settlement Date</label>
                                <input type="date" class="form-control" v-model="slice.advance.settle" />
                              </div>
                              <div class="mb-2">
                                <label class="form-label">Notes</label>
                                <textarea class="form-control" rows="2" v-model="slice.advance.notes"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- end v-for -->
                  </div>
                </div>
              </div>

              <!-- Payslip Information -->
              <div class="accordion-item" :class="{ active: open.payslip }">
                <div class="accordion-header" @click="toggle('payslip')">
                  <div class="arrow"></div>
                  <div class="title">Payslip Information</div>
                </div>
                <div class="accordion-content">
                  <div class="inner">
                    <div class="row">
                      <div class="col-md-4 mb-3">
                        <label class="form-label">Payslip Date <span class="text-danger"> *</span></label>
                        <div class="input-icon-end position-relative">
                          <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                            :clearable="false" :input-format="dateFormat" v-model="formData.payslip_date"
                            :append-to-body="true" />
                          <span class="input-icon-addon">
                            <i class="ti ti-calendar text-gray-7"></i>
                          </span>
                        </div>
                      </div>
                      <div class="col-md-4 mb-3">
                        <label class="form-label">Payslip Number</label>
                        <input type="text" class="form-control" v-model="formData.payslip_number" />
                      </div>
                      <div class="col-md-4 mb-3">
                        <label class="form-label">Staff Signature</label>
                        <input type="text" class="form-control" v-model="formData.staff_signature" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Salary Summary -->
              <div class="accordion-item" :class="{ active: open.summary }">
                <div class="accordion-header" @click="toggle('summary')">
                  <div class="arrow"></div>
                  <div class="title text-primary">Salary Summary</div>
                </div>
                <div class="accordion-content">
                  <div class="inner">
                    <div class="row g-3">
                      <div class="col-md-4" v-for="field in summaryFields" :key="field.key">
                        <label class="form-label fw-bold">{{ field.label }}</label>
                        <div class="input-group">
                          <span class="input-group-text">&#3647;</span>
                          <input :class="['form-control', field.bg]" type="number" v-model="formData[field.key]"
                            readonly />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-white me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Employee Salary</button>
          </div>
        </form>
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

export default {
  data() {
    return {
      // tree dat for dropdown
      employeeTreeData: [],

      // cache for lazy-load 
      employeeCache: new Map(),


      // select options…
      EmpoyeName: ["Select", "Anthony Lewis", "Brian Villalobos", "Doglas Martini"],
      EditEmpoyeName: ["Select", "Anthony Lewis", "Brian Villalobos", "Doglas Martini"],
      employee: {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        position: "Senior Developer",
        startDate: "2024-01-15",
        subsidiary: "SMRU",
      },

      // Sample grants data to fix the error
      grants: [
        { id: 1, code: "G001", name: "Research Grant", subsidiary: "Main Office" },
        { id: 2, code: "G002", name: "Development Grant", subsidiary: "Branch Office" },
        { id: 3, code: "G003", name: "Education Grant", subsidiary: "Regional Office" }
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

      // grants that will drive your v-for
      employeeGrantAllocations: [
        {
          id: 1,
          grant: { code: "S0031", name: "Other Fund", subsidiary: "SMRU" },
          loe: 40,
          amount: 4000,
          isAdvance: false,
          advance: { viaGrantId: null, amount: null, date: null, settle: null, notes: "" },
        },
        {
          id: 2,
          grant: { code: "S0040", name: "Core Project", subsidiary: "SMRU" },
          loe: 75,
          amount: 7500,
          isAdvance: true,
          advance: {
            viaGrantId: 200,
            amount: 1000,
            date: "2025-05-01",
            settle: "2025-05-15",
            notes: "Quarterly advance",
          },
        },
      ],

      hubGrants: [
        { id: 200, code: "H001", name: "Hub Fund SMRU" },
        { id: 201, code: "H002", name: "Hub Fund HQ" },
      ],
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

      // field definitions for loops
      earningFields: [
        { key: "basic_salary", label: "Basic Salary" },
        { key: "salary_by_FTE", label: "Salary by FTE" },
        { key: "compensation_refund", label: "Compensation Refund" },
        { key: "thirteen_month_salary", label: "13th Month Salary" },
        { key: "pvd", label: "PVD" },
        { key: "saving_fund", label: "Saving Fund" },
      ],
      deductionFields: [
        { key: "employee_social_security", label: "Employee Social Security" },
        { key: "employee_health_welfare", label: "Employee Health Welfare" },
        { key: "tax", label: "Tax" },
      ],
      employerFields: [
        { key: "employer_social_security", label: "Employer Social Security" },
        { key: "employer_health_welfare", label: "Employer Health Welfare" },
      ],
      summaryFields: [
        { key: "grand_total_income", label: "Grand Total Income", bg: "bg-success bg-opacity-10" },
        { key: "grand_total_deduction", label: "Grand Total Deduction", bg: "bg-danger bg-opacity-10" },
        { key: "net_paid", label: "Net Paid", bg: "bg-primary bg-opacity-10 fw-bold" },
        { key: "employer_contribution_total", label: "Employer Contribution Total", bg: "bg-info bg-opacity-10" },
        { key: "two_sides", label: "Total Cost to Company", bg: "bg-warning bg-opacity-10" },
      ],
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
    selectedGrant() {
      return this.grants.find(grant => grant.id === this.formData.grant_id);
    },

    hubGrantId() {
      // Find a default grant (e.g., the first one) to use when in cross-charge mode
      return this.grants.length > 0 ? this.grants[0] : null;
    },
  },
  methods: {
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
</style>

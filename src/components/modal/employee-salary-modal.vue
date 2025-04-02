<template>
  <!-- Add Termination -->
  <div class="modal fade" id="new-employee-salary">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Employee Salary</h4>
          <button
            type="button" 
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <!-- Employee Information Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-light">
                <h5 class="mb-0">Employee Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Employee Name</label>
                      <vue-select
                        :options="EmpoyeName"
                        id="empoyename"
                        placeholder="Select"
                        class="w-100"
                        v-model="formData.employee_id"
                      />
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Pay Period Date</label>
                      <input type="date" class="form-control" v-model="formData.pay_period_date" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Earnings Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-success bg-opacity-10">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 text-success">Earnings</h5>
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Basic Salary</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.basic_salary" @input="calculateTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Salary by FTE</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.salary_by_FTE" @input="calculateTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Compensation Refund</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.compensation_refund" @input="calculateTotals" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">13th Month Salary</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.thirteen_month_salary" @input="calculateTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">PVD</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.pvd" @input="calculateTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Saving Fund</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.saving_fund" @input="calculateTotals" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="alert alert-success bg-success bg-opacity-10">
                      <strong>Total Earnings: ${{ parseFloat(formData.grand_total_income).toFixed(2) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Deductions Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-danger bg-opacity-10">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 text-danger">Deductions</h5>
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Employee Social Security</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.employee_social_security" @input="calculateTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Employee Health Welfare</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.employee_health_welfare" @input="calculateTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Tax</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.tax" @input="calculateTotals" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="alert alert-danger bg-danger bg-opacity-10">
                      <strong>Total Deductions: ${{ parseFloat(formData.grand_total_deduction).toFixed(2) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Employer Contributions Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-info bg-opacity-10">
                <h5 class="mb-0 text-info">Employer Contributions</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-sm-6">
                    <div class="mb-3">
                      <label class="form-label">Employer Social Security</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.employer_social_security" @input="calculateEmployerContribution" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="mb-3">
                      <label class="form-label">Employer Health Welfare</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="formData.employer_health_welfare" @input="calculateEmployerContribution" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="alert alert-info bg-info bg-opacity-10">
                      <strong>Total Employer Contribution: ${{ parseFloat(formData.employer_contribution_total).toFixed(2) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-primary bg-opacity-10">
                <h5 class="mb-0 text-primary">Salary Summary</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Grand Total Income</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-success bg-opacity-10" v-model="formData.grand_total_income" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Grand Total Deduction</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-danger bg-opacity-10" v-model="formData.grand_total_deduction" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Net Paid</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-primary bg-opacity-10 fw-bold" v-model="formData.net_paid" readonly />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Employer Contribution Total</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-info bg-opacity-10" v-model="formData.employer_contribution_total" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Total Cost to Company</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-warning bg-opacity-10" v-model="formData.two_sides" readonly />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payslip Information Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-light">
                <h5 class="mb-0">Payslip Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Payslip Date</label>
                      <input type="date" class="form-control" v-model="formData.payslip_date" />
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Payslip Number</label>
                      <input type="text" class="form-control" v-model="formData.payslip_number" />
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Staff Signature</label>
                      <input type="text" class="form-control" v-model="formData.staff_signature" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-white border me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Employee Salary</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Termination -->

  <!-- Edit Termination -->
  <div class="modal fade" id="edit-employee-salary">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Employee Salary</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitEditForm">
          <div class="modal-body pb-0">
            <!-- Employee Information Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-light">
                <h5 class="mb-0">Employee Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Employee Name</label>
                      <vue-select
                        :options="EditEmpoyeName"
                        id="editempoyename"
                        placeholder="Select"
                        class="w-100"
                        v-model="editFormData.employee_id"
                      />
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Pay Period Date</label>
                      <input type="date" class="form-control" v-model="editFormData.pay_period_date" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Earnings Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-success bg-opacity-10">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 text-success">Earnings</h5>
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Basic Salary</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.basic_salary" @input="calculateEditTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Salary by FTE</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.salary_by_FTE" @input="calculateEditTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Compensation Refund</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.compensation_refund" @input="calculateEditTotals" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">13th Month Salary</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.thirteen_month_salary" @input="calculateEditTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">PVD</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.pvd" @input="calculateEditTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Saving Fund</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.saving_fund" @input="calculateEditTotals" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="alert alert-success bg-success bg-opacity-10">
                      <strong>Total Earnings: ${{ parseFloat(editFormData.grand_total_income).toFixed(2) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Deductions Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-danger bg-opacity-10">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 text-danger">Deductions</h5>
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Employee Social Security</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.employee_social_security" @input="calculateEditTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Employee Health Welfare</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.employee_health_welfare" @input="calculateEditTotals" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Tax</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.tax" @input="calculateEditTotals" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="alert alert-danger bg-danger bg-opacity-10">
                      <strong>Total Deductions: ${{ parseFloat(editFormData.grand_total_deduction).toFixed(2) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Employer Contributions Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-info bg-opacity-10">
                <h5 class="mb-0 text-info">Employer Contributions</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-sm-6">
                    <div class="mb-3">
                      <label class="form-label">Employer Social Security</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.employer_social_security" @input="calculateEditEmployerContribution" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="mb-3">
                      <label class="form-label">Employer Health Welfare</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control" v-model="editFormData.employer_health_welfare" @input="calculateEditEmployerContribution" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="alert alert-info bg-info bg-opacity-10">
                      <strong>Total Employer Contribution: ${{ parseFloat(editFormData.employer_contribution_total).toFixed(2) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-primary bg-opacity-10">
                <h5 class="mb-0 text-primary">Salary Summary</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Grand Total Income</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-success bg-opacity-10" v-model="editFormData.grand_total_income" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Grand Total Deduction</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-danger bg-opacity-10" v-model="editFormData.grand_total_deduction" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Net Paid</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-primary bg-opacity-10 fw-bold" v-model="editFormData.net_paid" readonly />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Employer Contribution Total</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-info bg-opacity-10" v-model="editFormData.employer_contribution_total" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Total Cost to Company</label>
                      <div class="input-group">
                        <span class="input-group-text">&#3647;</span>
                        <input type="number" class="form-control bg-warning bg-opacity-10" v-model="editFormData.two_sides" readonly />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payslip Information Section -->
            <div class="card mb-4 border">
              <div class="card-header bg-light">
                <h5 class="mb-0">Payslip Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Payslip Date</label>
                      <input type="date" class="form-control" v-model="editFormData.payslip_date" />
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Payslip Number</label>
                      <input type="text" class="form-control" v-model="editFormData.payslip_number" />
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Staff Signature</label>
                      <input type="text" class="form-control" v-model="editFormData.staff_signature" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-white border me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Update Employee Salary</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Termination -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
            <i class="ti ti-trash-x fs-36"></i>
          </span>
          <h4 class="mb-1">Confirm Delete</h4>
          <p class="mb-3">
            You want to delete all the marked items, this cant be undone once you delete.
          </p>
          <div class="d-flex justify-content-center">
            <a
              href="javascript:void(0);"
              class="btn btn-light me-3"
              data-bs-dismiss="modal"
              >Cancel</a
            >
            <router-link to="/payroll/employee-salary" class="btn btn-danger"
              >Yes, Delete</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>
<script>
export default {
  data() {
    return {
      EmpoyeName: ["Select", "Anthony Lewis", "Brian Villalobos", "Doglas Martini"],
      EditEmpoyeName: ["Select", "Anthony Lewis", "Brian Villalobos", "Doglas Martini"],
      formData: {
        employee_id: null,
        pay_period_date: "",
        basic_salary: 0,
        salary_by_FTE: 0,
        compensation_refund: 0,
        thirteen_month_salary: 0,
        pvd: 0,
        saving_fund: 0,
        grand_total_income: 0,
        employee_social_security: 0,
        employee_health_welfare: 0,
        tax: 0,
        grand_total_deduction: 0,
        employer_social_security: 0,
        employer_health_welfare: 0,
        employer_contribution_total: 0,
        net_paid: 0,
        two_sides: 0,
        payslip_date: "",
        payslip_number: "",
        staff_signature: ""
      },
      editFormData: {
        employee_id: null,
        pay_period_date: "",
        basic_salary: 0,
        salary_by_FTE: 0,
        compensation_refund: 0,
        thirteen_month_salary: 0,
        pvd: 0,
        saving_fund: 0,
        grand_total_income: 0,
        employee_social_security: 0,
        employee_health_welfare: 0,
        tax: 0,
        grand_total_deduction: 0,
        employer_social_security: 0,
        employer_health_welfare: 0,
        employer_contribution_total: 0,
        net_paid: 0,
        two_sides: 0,
        payslip_date: "",
        payslip_number: "",
        staff_signature: ""
      }
    };
  },
  methods: {
    submitForm() {
      // Submit the form data to the backend
      // For now, just navigate to the employee salary page
      this.$router.push("/payroll/employee-salary");
    },
    submitEditForm() {
      // Submit the edit form data to the backend
      // For now, just navigate to the employee salary page
      this.$router.push("/payroll/employee-salary");
    },
    calculateTotals() {
      // Calculate grand total income
      this.formData.grand_total_income = 
        parseFloat(this.formData.basic_salary || 0) +
        parseFloat(this.formData.salary_by_FTE || 0) +
        parseFloat(this.formData.compensation_refund || 0) +
        parseFloat(this.formData.thirteen_month_salary || 0) +
        parseFloat(this.formData.pvd || 0) +
        parseFloat(this.formData.saving_fund || 0);
      
      // Calculate grand total deduction
      this.formData.grand_total_deduction = 
        parseFloat(this.formData.employee_social_security || 0) +
        parseFloat(this.formData.employee_health_welfare || 0) +
        parseFloat(this.formData.tax || 0);
      
      // Calculate net paid
      this.formData.net_paid = this.formData.grand_total_income - this.formData.grand_total_deduction;
      
      // Calculate total cost to company
      this.formData.two_sides = this.formData.grand_total_income + this.formData.employer_contribution_total;
    },
    calculateEmployerContribution() {
      // Calculate employer contribution total
      this.formData.employer_contribution_total = 
        parseFloat(this.formData.employer_social_security || 0) +
        parseFloat(this.formData.employer_health_welfare || 0);
      
      // Update total cost to company
      this.formData.two_sides = this.formData.grand_total_income + this.formData.employer_contribution_total;
    },
    calculateEditTotals() {
      // Calculate grand total income for edit form
      this.editFormData.grand_total_income = 
        parseFloat(this.editFormData.basic_salary || 0) +
        parseFloat(this.editFormData.salary_by_FTE || 0) +
        parseFloat(this.editFormData.compensation_refund || 0) +
        parseFloat(this.editFormData.thirteen_month_salary || 0) +
        parseFloat(this.editFormData.pvd || 0) +
        parseFloat(this.editFormData.saving_fund || 0);
      
      // Calculate grand total deduction for edit form
      this.editFormData.grand_total_deduction = 
        parseFloat(this.editFormData.employee_social_security || 0) +
        parseFloat(this.editFormData.employee_health_welfare || 0) +
        parseFloat(this.editFormData.tax || 0);
      
      // Calculate net paid for edit form
      this.editFormData.net_paid = this.editFormData.grand_total_income - this.editFormData.grand_total_deduction;
      
      // Calculate total cost to company for edit form
      this.editFormData.two_sides = this.editFormData.grand_total_income + this.editFormData.employer_contribution_total;
    },
    calculateEditEmployerContribution() {
      // Calculate employer contribution total for edit form
      this.editFormData.employer_contribution_total = 
        parseFloat(this.editFormData.employer_social_security || 0) +
        parseFloat(this.editFormData.employer_health_welfare || 0);
      
      // Update total cost to company for edit form
      this.editFormData.two_sides = this.editFormData.grand_total_income + this.editFormData.employer_contribution_total;
    }
  }
};
</script>

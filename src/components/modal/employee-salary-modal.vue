<template>
  <!-- Employee Salary Modal -->
  <div class="modal fade" id="new-employee-salary" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-fullscreen">
      <div class="modal-content modern-modal">
        <!-- Header -->
        <div class="modern-header">
          <h1>Add Employee Payroll</h1>
          <div class="user-info">
            <div>User: {{ currentUser }}</div>
            <div>{{ currentDate }}</div>
          </div>
          <button type="button" class="btn-close-modern" data-bs-dismiss="modal">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <div class="modern-content">
          <!-- 1. Employee Selection -->
          <div class="modern-section">
            <div class="section-header">Select Employee (with Funding Examples)</div>
            <div class="section-content">
              <div class="form-group">
                <label class="form-label">Employee</label>
                <select v-model="selectedEmployeeId" @change="onEmployeeSelect" class="form-select">
                  <option value="">-- Choose --</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.staff_id }} – {{ emp.funding_description }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- 2. Employment/Employee Info -->
          <div v-if="selectedEmployee" class="modern-section">
            <div class="section-header">Employee & Employment Details</div>
            <div class="section-content">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Staff ID</label>
                  <input class="form-input" :value="selectedEmployee.staff_id" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Employee Name</label>
                  <input class="form-input" :value="selectedEmployee.name" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Organization</label>
                  <input class="form-input" :value="selectedEmployee.organization" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Department</label>
                  <input class="form-input" :value="selectedEmployee.department" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Position</label>
                  <input class="form-input" :value="selectedEmployee.employment.position" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Employment Type</label>
                  <input class="form-input" :value="selectedEmployee.employment.employment_type" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">FTE (%)</label>
                  <input class="form-input" :value="selectedEmployee.employment.fte" readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Position Salary (Base)</label>
                  <input class="form-input" :value="formatCurrency(selectedEmployee.employment.position_salary)"
                    readonly>
                </div>
                <div class="form-group">
                  <label class="form-label">Pay Method</label>
                  <input class="form-input" :value="selectedEmployee.employment.pay_method" readonly>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Funding Allocations -->
          <div v-if="selectedEmployee" class="modern-section">
            <div class="section-header">Funding Allocations</div>
            <div class="section-content">
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Funding Source</th>
                      <th>Allocation Type</th>
                      <th>Position Slot</th>
                      <th>LOE %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="allocation in selectedEmployee.allocations" :key="allocation.source">
                      <td>{{ allocation.source }}</td>
                      <td>{{ allocation.allocation_type }}</td>
                      <td>{{ allocation.position_slot || '-' }}</td>
                      <td>{{ allocation.loe }}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="selectedEmployee.allocations.length > 1" class="validation-info">
                <strong>Funding Allocation Summary:</strong><br>
                Total LOE: {{ totalLOE }}% |
                Number of Funding Sources: {{ selectedEmployee.allocations.length }} |
                Each funding source will receive its proportional share of the position salary ({{
                  formatCurrency(selectedEmployee.employment.position_salary) }})
              </div>
            </div>
          </div>

          <!-- 4. Payroll Calculation Overview -->
          <div v-if="selectedEmployee" class="modern-section">
            <div class="section-header">Payroll Calculation Overview</div>
            <div class="section-content">
              <div class="tab-bar">
                <button v-for="(allocation, index) in selectedEmployee.allocations" :key="index" class="tab"
                  :class="{ active: activeTabIndex === index }" @click="setActiveTab(index)">
                  {{ allocation.source }} (Grant)
                </button>
              </div>
              <div class="tab-content">
                <div v-if="selectedEmployee.allocations.length > 1" class="validation-info">
                  <strong>Funding Allocation Logic:</strong><br>
                  This funding source ({{ activeAllocation.loe }}% LOE) receives: {{
                    formatCurrency(selectedEmployee.employment.position_salary) }} × ({{ activeAllocation.loe }}% ÷ {{
                    totalLOE }}%) = {{ formatCurrency(calculateProportionalSalary(activeAllocation.loe)) }}<br>
                  <strong>Verification:</strong> Sum of all funding sources' "Salary by FTE" = {{
                    formatCurrency(verificationSum) }} (should equal position salary: {{
                    formatCurrency(selectedEmployee.employment.position_salary) }})
                </div>
                <table class="payroll-calc-table">
                  <tr v-for="(item, index) in payrollCalculations" :key="index">
                    <th>{{ item.label }}</th>
                    <td>{{ item.value }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="modern-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" :disabled="!selectedEmployee" @click="savePayroll">Save
            Payroll</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeSalaryModal',
  data() {
    return {
      selectedEmployeeId: '',
      activeTabIndex: 0,
      currentUser: 'EhDohWah',
      currentDate: new Date().toLocaleDateString('en-CA'),

      // Dummy employee data
      employees: [
        // 1. One funding source (org)
        {
          id: "0012",
          staff_id: "0012",
          name: "Chanchai Siri",
          organization: "ACME",
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
              allocation_type: "grant",
              position_slot: null,
              loe: 100
            }
          ]
        },
        // 2. Two funding sources (grant + org)
        {
          id: "0155",
          staff_id: "0155",
          name: "Mr.xxxxxxxx",
          organization: "BHF",
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
              allocation_type: "grant",
              position_slot: null,
              loe: 20
            }
          ]
        },
        // 3. Three funding sources (org + 2 grants)
        {
          id: "0200",
          staff_id: "0200",
          name: "Somchai P.",
          organization: "IHRP",
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
              allocation_type: "grant",
              position_slot: null,
              loe: 25
            }
          ]
        }
      ]
    };
  },

  computed: {
    selectedEmployee() {
      return this.employees.find(emp => emp.id === this.selectedEmployeeId);
    },

    totalLOE() {
      if (!this.selectedEmployee) return 0;
      return this.selectedEmployee.allocations.reduce((sum, allocation) => sum + Number(allocation.loe), 0);
    },

    activeAllocation() {
      if (!this.selectedEmployee) return null;
      return this.selectedEmployee.allocations[this.activeTabIndex];
    },

    verificationSum() {
      if (!this.selectedEmployee) return 0;
      return this.selectedEmployee.allocations.reduce((sum, allocation) => {
        return sum + this.calculateProportionalSalary(allocation.loe);
      }, 0);
    },

    payrollCalculations() {
      if (!this.selectedEmployee || !this.activeAllocation) return [];

      const baseSalary = Number(this.selectedEmployee.employment.position_salary || 0);
      const fundingLOE = Number(this.activeAllocation.loe || 0);

      // Calculate proportional salary
      let salaryByFTE;
      if (this.selectedEmployee.allocations.length === 1) {
        salaryByFTE = baseSalary;
      } else {
        salaryByFTE = baseSalary * (fundingLOE / this.totalLOE);
      }

      // All calculations based on proportional share
      const salary2024 = salaryByFTE;
      const salary2025 = Math.round(salaryByFTE * 1.01);
      const compensation = salaryByFTE * 0.06;
      const month13 = salaryByFTE / 12;
      const healthEmployer = salaryByFTE * 0.01;
      const healthEmployee = salaryByFTE * 0.005;
      const tax = salaryByFTE * 0.03;
      const gross = salaryByFTE;
      const pvd = gross * 0.075;
      const ssEmp = gross * 0.05;
      const ssEmpr = gross * 0.05;
      const salBonus = gross + compensation + month13;
      const pfHiSs = pvd + ssEmp + ssEmpr + healthEmployer + healthEmployee;
      const pf2ss2HiTax = (pvd * 2) + (ssEmp * 2) + healthEmployer + healthEmployee + tax;
      const sf2 = pvd * 2;
      const net = gross - pvd - ssEmp - healthEmployee - tax + compensation + month13;

      return [
        { label: 'SALARY 2024', value: this.formatCurrency(salary2024) },
        { label: '1%', value: '1%' },
        { label: 'BASIC/SALARY 2025', value: this.formatCurrency(salary2025) },
        { label: 'SALARY BY FTE (PROPORTIONAL SHARE)', value: this.formatCurrency(salaryByFTE) },
        { label: 'GROSS SALARY', value: this.formatCurrency(gross) },
        { label: 'COMPENSATION / REFUND', value: this.formatCurrency(compensation) },
        { label: '13th MONTH SALARY', value: this.formatCurrency(month13) },
        { label: 'PVD/SAVING FUND (7.5%)', value: this.formatCurrency(pvd) },
        { label: 'EMPLOYER S.INSU 5%', value: this.formatCurrency(ssEmpr) },
        { label: 'EMPLOYEE S.INSU 5%', value: this.formatCurrency(ssEmp) },
        { label: 'HEALTH WELFARE EMPLOYER', value: this.formatCurrency(healthEmployer) },
        { label: 'HEALTH WELFARE EMPLOYEE', value: this.formatCurrency(healthEmployee) },
        { label: 'TAX', value: this.formatCurrency(tax) },
        { label: 'SAL+SC+SF+M13', value: this.formatCurrency(salBonus) },
        { label: 'PF+HI+SS', value: this.formatCurrency(pfHiSs) },
        { label: '(PF*2)+(SS*2)+HI+Tax', value: this.formatCurrency(pf2ss2HiTax) },
        { label: 'SF (2 SIDES)', value: this.formatCurrency(sf2) },
        { label: 'NET PAY', value: this.formatCurrency(net) }
      ];
    }
  },

  methods: {
    onEmployeeSelect() {
      this.activeTabIndex = 0; // Reset to first tab when employee changes
    },

    setActiveTab(index) {
      this.activeTabIndex = index;
    },

    calculateProportionalSalary(loe) {
      if (!this.selectedEmployee) return 0;
      const baseSalary = Number(this.selectedEmployee.employment.position_salary || 0);
      if (this.selectedEmployee.allocations.length === 1) {
        return baseSalary;
      }
      return baseSalary * (Number(loe) / this.totalLOE);
    },

    formatCurrency(value) {
      if (!value && value !== 0) return '฿0.00';
      return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    },

    savePayroll() {
      this.$message.success('Payroll saved successfully');
      // Close modal
      const modal = document.getElementById('new-employee-salary');
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }
};
</script>

<style scoped>
/* Modern Modal Styles */
.modern-modal {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.modern-header {
  background: #2d3748;
  color: #fff;
  padding: 1.5rem 2rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-bottom: 3px solid #4a5568;
}

.modern-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.025em;
}

.user-info {
  font-size: 0.93rem;
  opacity: 0.9;
  text-align: right;
  color: #e2e8f0;
}

.btn-close-modern {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-close-modern:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modern-content {
  padding: 2rem;
  background: #f8fafc;
}

.modern-section {
  margin-bottom: 2rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.section-header {
  background: #fff;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
}

.section-content {
  padding: 1.5rem;
  background: #fff;
  border-radius: 0 0 8px 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-input,
.form-select {
  padding: 0.7rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

.form-input:read-only {
  background: #f8fafc;
  color: #555;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

th,
td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.93rem;
}

th {
  background: #ffe3cc;
  font-weight: 600;
  color: #cc6600;
  text-transform: uppercase;
  font-size: 0.88rem;
}

tr:last-child td {
  border-bottom: none;
}

.validation-info {
  background: #fff3cd;
  border: 1px solid #ffecb5;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #856404;
  font-size: 0.9rem;
}

.validation-info strong {
  color: #664d03;
}

.tab-bar {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1rem;
  background: #faf6f0;
}

.tab {
  cursor: pointer;
  padding: 0.75rem 2rem;
  background: none;
  border: none;
  outline: none;
  font-size: 1.02rem;
  font-weight: 600;
  color: #c47a13;
  border-bottom: 3px solid transparent;
  transition: border 0.2s, color 0.2s;
}

.tab.active {
  border-bottom: 3px solid #cc6600;
  color: #222;
  background: #ffe3cc;
}

.tab:hover:not(.active) {
  background: rgba(255, 227, 204, 0.5);
}

.payroll-calc-table {
  border: 1px solid #eee;
  margin: 0;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.payroll-calc-table th {
  width: 260px;
  white-space: nowrap;
}

.payroll-calc-table td {
  white-space: nowrap;
}

.modern-footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-radius: 0 0 12px 12px;
}

.btn {
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  font-size: 0.97rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}

.btn-secondary {
  background: #edf2f7;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  background: #48bb78;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #38a169;
}

.btn-primary:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .payroll-calc-table th {
    width: 160px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .tab {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>

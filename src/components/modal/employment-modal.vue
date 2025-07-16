<template>
  <div class="modal fade" id="employmentModal" tabindex="-1" aria-labelledby="employmentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content new-modal-design">
        <div class="modal-header-new">
          <h2 class="modal-title-new" id="employmentModalLabel">
            {{ editMode ? 'Edit Employment' : 'Add Employment' }}
          </h2>
          <button type="button" class="btn-close-custom" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body-new">
          <div v-if="isLoadingData" class="text-center mb-3">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Loading employment data...
          </div>

          <form @submit.prevent="handleSubmit" ref="mainForm">
            <div v-if="alertMessage && alertClass === 'alert-success'" class="success-msg">
              {{ alertMessage }}
            </div>

            <div v-if="alertMessage && alertClass === 'alert-danger'" class="error-msg">
              {{ alertMessage }}
            </div>

            <div class="form-group">
              <label class="form-label required">Employee</label>
              <a-tree-select v-model:value="formData.employee_id" @change="onEmployeeChange" show-search
                style="width: 100%;" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="Select employee" allow-clear tree-default-expand-all :tree-data="employeeTreeData"
                tree-node-filter-prop="title" :getPopupContainer="getPopupContainer"
                :class="{ 'is-invalid': validationErrors.employee_id }" required />
              <div v-if="validationErrors.employee_id" class="invalid-feedback">
                {{ validationErrors.employee_id }}
              </div>
            </div>

            <div v-if="selectedEmployeeInfo" class="employee-info-card mb-3">
              <div class="card-body">
                <h6 class="card-title">Selected Employee</h6>
                <p class="card-text">
                  <strong>{{ selectedEmployeeInfo.name }}</strong><br>
                  <small class="text-muted">Subsidiary: {{ selectedEmployeeInfo.subsidiary }}</small><br>
                </p>
              </div>
            </div>

            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Employment Type</label>
                <select class="form-control" v-model="formData.employment_type"
                  :class="{ 'is-invalid': validationErrors.employment_type }" required>
                  <option disabled value="">Select Type</option>
                  <option v-for="type in employmentTypes" :key="type.id" :value="type.value">
                    {{ type.value }}
                  </option>
                </select>
                <div v-if="validationErrors.employment_type" class="invalid-feedback">
                  {{ validationErrors.employment_type }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Pay Method</label>
                <select class="form-control" v-model="formData.pay_method"
                  :class="{ 'is-invalid': validationErrors.pay_method }">
                  <option disabled value="">Select Pay Method</option>
                  <option v-for="method in payMethods" :key="method.id" :value="method.value">
                    {{ method.value }}
                  </option>
                </select>
                <div v-if="validationErrors.pay_method" class="invalid-feedback">
                  {{ validationErrors.pay_method }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label required">Department Position</label>
                <select class="form-control" v-model="formData.department_position_id"
                  :class="{ 'is-invalid': validationErrors.department_position_id }" required>
                  <option disabled value="">Select Department Position</option>
                  <option v-for="position in departmentPositions" :key="position.id" :value="position.id">
                    {{ position.department }} | {{ position.position }}
                  </option>
                </select>
                <div v-if="validationErrors.department_position_id" class="invalid-feedback">
                  {{ validationErrors.department_position_id }}
                </div>
              </div>
            </div>

            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Start Date</label>
                <div class="input-icon-end position-relative">
                  <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                    :clearable="false" :input-format="dateFormat" v-model="formData.start_date"
                    :class="{ 'is-invalid': validationErrors.start_date }" required />
                  <span class="input-icon-addon">
                    <i class="ti ti-calendar text-gray-7"></i>
                  </span>
                </div>
                <div v-if="validationErrors.start_date" class="invalid-feedback">
                  {{ validationErrors.start_date }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">End Date</label>
                <div class="input-icon-end position-relative">
                  <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                    :clearable="false" :input-format="dateFormat" v-model="formData.end_date"
                    :class="{ 'is-invalid': validationErrors.end_date }" />
                  <span class="input-icon-addon">
                    <i class="ti ti-calendar text-gray-7"></i>
                  </span>
                </div>
                <div v-if="validationErrors.end_date" class="invalid-feedback">
                  {{ validationErrors.end_date }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label required">Work Location</label>
                <select class="form-control" v-model="formData.work_location_id"
                  :class="{ 'is-invalid': validationErrors.work_location_id }" required>
                  <option disabled value="">Select Location</option>
                  <option v-for="location in workLocations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </option>
                </select>
                <div v-if="validationErrors.work_location_id" class="invalid-feedback">
                  {{ validationErrors.work_location_id }}
                </div>
              </div>
            </div>

            <div class="date-row">
              <div class="form-group">
                <label class="form-label">Probation Pass Date</label>
                <div class="input-icon-end position-relative">
                  <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                    :clearable="false" :input-format="dateFormat" v-model="formData.probation_pass_date"
                    :class="{ 'is-invalid': validationErrors.probation_pass_date }" />
                  <span class="input-icon-addon">
                    <i class="ti ti-calendar text-gray-7"></i>
                  </span>
                </div>
                <div v-if="validationErrors.probation_pass_date" class="invalid-feedback">
                  {{ validationErrors.probation_pass_date }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label required">Position Salary</label>
                <input type="number" class="form-control" v-model.number="formData.position_salary"
                  :class="{ 'is-invalid': validationErrors.position_salary }" required>
                <div v-if="validationErrors.position_salary" class="invalid-feedback">
                  {{ validationErrors.position_salary }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Probation Salary</label>
                <input type="number" class="form-control" v-model.number="formData.probation_salary"
                  :class="{ 'is-invalid': validationErrors.probation_salary }">
                <div v-if="validationErrors.probation_salary" class="invalid-feedback">
                  {{ validationErrors.probation_salary }}
                </div>
              </div>
            </div>

            <div class="date-row">
              <div class="form-group">
                <label class="form-label">Employee Tax (%)</label>
                <input type="number" class="form-control" v-model.number="formData.employee_tax"
                  :class="{ 'is-invalid': validationErrors.employee_tax }">
                <div v-if="validationErrors.employee_tax" class="invalid-feedback">
                  {{ validationErrors.employee_tax }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">FTE</label>
                <input type="number" step="0.1" min="0" max="1" class="form-control" v-model.number="formData.fte">
                <div v-if="validationErrors.fte" class="invalid-feedback">
                  {{ validationErrors.fte }}
                </div>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label>Funding Allocation</label>
              <div class="date-row" style="margin-bottom:8px;">
                <div class="form-group">
                  <select v-model="currentAllocation.grant_id" @change="onGrantChange" class="form-control"
                    :disabled="isLoadingData">
                    <option value="">{{ isLoadingData ? 'Loading grants...' : 'Select grant' }}</option>
                    <option v-for="grant in grantOptions" :key="grant.id" :value="grant.id">
                      {{ grant.name }} ({{ grant.code }})
                    </option>
                  </select>
                  <div v-if="allocationErrors.grant_id" class="invalid-feedback">
                    {{ allocationErrors.grant_id }}
                  </div>
                </div>

                <template v-if="isOrgFundGrant(currentAllocation.grant_id)">
                  <div class="form-group">
                    <select v-model="currentAllocation.department_position_id" class="form-control">
                      <option value="">Select department position</option>
                      <option v-for="position in departmentPositions" :key="position.id" :value="position.id">
                        {{ position.department }} - {{ position.position }}
                      </option>
                    </select>
                    <div v-if="allocationErrors.department_position_id" class="invalid-feedback">
                      {{ allocationErrors.department_position_id }}
                    </div>
                  </div>
                  <div class="form-group">
                    <input type="number" v-model.number="currentAllocation.org_funded_salary" class="form-control"
                      min="0" placeholder="Org Funded Salary" :disabled="isLoadingData" />
                    <div v-if="allocationErrors.org_funded_salary" class="invalid-feedback">
                      {{ allocationErrors.org_funded_salary }}
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="form-group">
                    <select v-model="currentAllocation.grant_items_id" @change="onGrantPositionChange"
                      class="form-control" :disabled="!currentAllocation.grant_id || isLoadingData">
                      <option value="">Select grant position</option>
                      <option v-for="position in grantPositionOptions" :key="position.id" :value="position.id">
                        {{ position.name }}
                      </option>
                    </select>
                    <div v-if="allocationErrors.grant_items_id" class="invalid-feedback">
                      {{ allocationErrors.grant_items_id }}
                    </div>
                  </div>
                  <div class="form-group">
                    <select v-model="currentAllocation.position_slot_id" class="form-control"
                      :disabled="!currentAllocation.grant_items_id || isLoadingData">
                      <option value="">Select position slot</option>
                      <option v-for="slot in positionSlotOptions" :key="slot.id" :value="slot.id">
                        Slot {{ slot.slot_number }} - {{ slot.budget_line.name }}
                      </option>
                    </select>
                    <div v-if="allocationErrors.position_slot_id" class="invalid-feedback">
                      {{ allocationErrors.position_slot_id }}
                    </div>
                  </div>
                  <!-- Display Grant Salary (read-only) -->
                  <div class="form-group">
                    <input type="text" class="form-control"
                      :value="getGrantSalary(currentAllocation.grant_id, currentAllocation.grant_items_id)"
                      placeholder="Grant Salary" readonly style="background-color: #f8f9fa;" />
                  </div>
                </template>
                <div class="form-group">
                  <input type="number" v-model.number="currentAllocation.level_of_effort" class="form-control" min="0"
                    max="100" placeholder="Effort (%)" :disabled="isLoadingData" />
                  <div v-if="allocationErrors.level_of_effort" class="invalid-feedback">
                    {{ allocationErrors.level_of_effort }}
                  </div>
                </div>
                <div class="form-group" style="min-width:72px;">
                  <button type="button" class="btn btn-save" style="width:100%;" @click="addAllocation"
                    :disabled="isLoadingData">
                    {{ editingIndex !== null ? 'Save' : 'Add' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Funding Allocations Table -->
            <table v-if="fundingAllocations.length > 0" class="allocation-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Grant</th>
                  <th>Department Position</th>
                  <th>Grant Position</th>
                  <th>Position Slot</th>
                  <th>Salary</th>
                  <th>Effort (%)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in fundingAllocations" :key="idx">
                  <template v-if="editingIndex === idx">
                    <!-- Inline Edit Row -->
                    <td>
                      <span class="badge" :class="row.allocation_type === 'org_funded' ? 'badge-org' : 'badge-grant'">
                        {{ row.allocation_type === 'org_funded' ? 'Org Funded' : 'Grant Funded' }}
                      </span>
                    </td>
                    <td>
                      <select v-model="editData.grant_id" @change="onEditGrantChange" class="edit-field">
                        <option value="">Select grant</option>
                        <option v-for="grant in grantOptions" :key="grant.id" :value="grant.id">
                          {{ grant.name }} ({{ grant.code }})
                        </option>
                      </select>
                    </td>
                    <td>
                      <select v-if="isOrgFundGrant(editData.grant_id)" v-model="editData.department_position_id"
                        class="edit-field">
                        <option value="">Select department position</option>
                        <option v-for="position in departmentPositions" :key="position.id" :value="position.id">
                          {{ position.department }} - {{ position.position }}
                        </option>
                      </select>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <select v-if="!isOrgFundGrant(editData.grant_id)" v-model="editData.grant_items_id"
                        @change="onEditGrantPositionChange" class="edit-field">
                        <option value="">Select position</option>
                        <option v-for="position in editGrantPositionOptions" :key="position.id" :value="position.id">
                          {{ position.name }}
                        </option>
                      </select>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <select v-if="!isOrgFundGrant(editData.grant_id)" v-model="editData.position_slot_id"
                        class="edit-field">
                        <option value="">Select position slot</option>
                        <option v-for="slot in editPositionSlotOptions" :key="slot.id" :value="slot.id">
                          Slot {{ slot.slot_number }} - {{ slot.budget_line.name }}
                        </option>
                      </select>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <input v-if="isOrgFundGrant(editData.grant_id)" type="number"
                        v-model.number="editData.org_funded_salary" class="edit-field" min="0">
                      <span v-else class="text-muted">{{ getGrantSalary(editData.grant_id, editData.grant_items_id)
                      }}</span>
                    </td>
                    <td>
                      <input type="number" v-model.number="editData.level_of_effort" class="edit-field" min="0"
                        max="100">
                    </td>
                    <td>
                      <button class="action-btn" @click="saveEdit">Save</button>
                      <button class="action-btn delete" @click="cancelEdit">Cancel</button>
                    </td>
                  </template>
                  <template v-else>
                    <!-- Display Row -->
                    <td>
                      <span class="badge" :class="row.allocation_type === 'org_funded' ? 'badge-org' : 'badge-grant'">
                        {{ row.allocation_type === 'org_funded' ? 'Org Funded' : 'Grant Funded' }}
                      </span>
                    </td>
                    <td>{{ getGrantName(row.grant_id, row._original) }}</td>
                    <td>
                      <span v-if="row.allocation_type === 'org_funded'">{{
                        getDepartmentPositionName(row.department_position_id) }}</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span v-if="row.allocation_type !== 'org_funded'">{{ getGrantPositionName(row.grant_id,
                        row.grant_items_id, row._original) }}</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span v-if="row.allocation_type !== 'org_funded'">{{ getPositionSlotName(row.grant_id,
                        row.grant_items_id, row.position_slot_id, row._original) }}</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span v-if="row.allocation_type === 'org_funded'">{{ formatCurrency(row.org_funded_salary)
                      }}</span>
                      <span v-else>{{ getGrantSalary(row.grant_id, row.grant_items_id, row._original) }}</span>
                    </td>
                    <td>{{ row.level_of_effort }}%</td>
                    <td>
                      <button class="action-btn" @click="editAllocation(idx)">Edit</button>
                      <button class="action-btn delete" @click="deleteAllocation(idx)">Delete</button>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>

            <!-- No Allocations Message -->
            <div v-else-if="formData.employee_id && !isLoadingData" class="no-allocations-msg">
              <p class="text-muted text-center">No funding allocations added. Please add at least one allocation.</p>
            </div>

            <!-- Benefits Section -->
            <div class="form-group">
              <label class="form-label">Benefits</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" v-model="formData.active" />
                  <span class="checkmark"></span>
                  Active Employment
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" v-model="formData.health_welfare" />
                  <span class="checkmark"></span>
                  Health & Welfare
                </label>
                <label class="checkbox-item" v-if="isLocalIDStaff">
                  <input type="checkbox" v-model="formData.pvd" />
                  <span class="checkmark"></span>
                  PVD
                </label>
                <label class="checkbox-item" v-if="isLocalNonIDStaff">
                  <input type="checkbox" v-model="formData.saving_fund" />
                  <span class="checkmark"></span>
                  Saving Fund
                </label>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="btn-row">
              <button type="button" class="btn btn-cancel" @click="resetForm" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-save" :disabled="isSubmitting || isLoadingData">
                <span v-if="isSubmitting">{{ editMode ? 'Updating...' : 'Saving...' }}</span>
                <span v-else>{{ editMode ? 'Update' : 'Save' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { employmentService } from '@/services/employment.service';
import { employeeFundingAllocationService } from '@/services/employee-funding-allocation.service';
import { employeeService } from '@/services/employee.service';
import { departmentPositionService } from '@/services/department-position.service';
import { workLocationService } from '@/services/worklocation.service';
import { employeeGrantAllocationService } from '@/services/employee-grant-allocation.service';
import { useLookupStore } from '@/stores/lookupStore';

export default {
  name: 'EmploymentModal',
  setup() {
    const editMode = ref(false);
    const employmentData = ref(null);
    const alertMessage = ref('');
    const alertClass = ref('');
    return {
      editMode,
      employmentData,
      alertMessage,
      alertClass
    };
  },
  data() {
    return {
      formData: {
        employment_id: null,
        employee_id: '',
        employment_type: '',
        pay_method: '',
        department_position_id: '',
        work_location_id: '',
        start_date: '',
        end_date: '',
        probation_pass_date: '',
        position_salary: '',
        probation_salary: '',
        employee_tax: '',
        fte: 1.0,
        active: true,
        health_welfare: false,
        pvd: false,
        saving_fund: false
      },
      currentAllocation: {
        allocation_type: '',
        grant_id: '',
        grant_items_id: '',
        position_slot_id: '',
        department_position_id: '',
        level_of_effort: 100,
        org_funded_salary: ''
      },
      editData: {
        allocation_type: '',
        grant_id: '',
        grant_items_id: '',
        position_slot_id: '',
        department_position_id: '',
        level_of_effort: 100,
        org_funded_salary: ''
      },
      fundingAllocations: [],
      editingIndex: null,
      selectedEmployeeInfo: null,
      isSubmitting: false,
      isLoadingData: false,
      modalInstance: null,

      // Date format - same as employee-list-modal
      dateFormat: "dd-MM-yyyy",

      // Validation errors
      validationErrors: {},
      allocationErrors: {},

      // Data sources
      employees: [],
      employeeTreeData: [],
      departmentPositions: [],
      workLocations: [],
      employmentTypes: [],
      payMethods: [
        { id: 1, value: 'Transferred to bank' },
        { id: 2, value: 'Cash cheque' }
      ],
      grantOptions: [],
      orgFundedOptions: [],
      grantPositions: {},

      // Computed options for dropdowns
      grantPositionOptions: [],
      positionSlotOptions: [],
      editGrantPositionOptions: [],
      editPositionSlotOptions: []
    };
  },

  computed: {
    isLocalIDStaff() {
      return this.formData.employment_type === 'Local ID Staff';
    },
    isLocalNonIDStaff() {
      return this.formData.employment_type === 'Local non ID Staff';
    },
    totalEffort() {
      return this.fundingAllocations.reduce((sum, allocation) => sum + allocation.level_of_effort, 0);
    }
  },

  watch: {
    employmentData: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };

          // Convert dates to Date objects for the date-picker component
          if (this.formData.start_date) {
            this.formData.start_date = new Date(this.formData.start_date);
          }
          if (this.formData.end_date) {
            this.formData.end_date = new Date(this.formData.end_date);
          }
          if (this.formData.probation_pass_date) {
            this.formData.probation_pass_date = new Date(this.formData.probation_pass_date);
          }
        }
      },
      deep: true
    }
  },

  mounted() {
    // Initialize the Bootstrap modal
    const modalElement = document.getElementById('employmentModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      // Reset form when modal is hidden
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.editMode = false;
        this.employmentData = null;
        this.resetForm();
      });
    }

    // Load initial data
    this.loadInitialData();
  },

  methods: {
    isOrgFundGrant(grantId) {
      // This logic should be adapted based on how org-funded grants are identified.
      // Using a hardcoded list of codes as an example, similar to grant-position-modal.
      const hubGrantCodes = ['S0031', 'S22001'];
      const grant = this.grantOptions.find(g => g.id == grantId);
      return grant && hubGrantCodes.includes(grant.code);
    },

    async loadInitialData() {
      this.isLoadingData = true;
      await Promise.all([
        this.fetchEmployees(),
        this.fetchDepartmentPositions(),
        this.fetchWorkLocations(),
        this.initFetchLookups(), // Single optimized method instead of two separate calls
        this.loadGrantStructure(),
        this.loadOrgFundedOptions()
      ]);
      this.isLoadingData = false;
    },

    // Clear validation errors
    clearValidationErrors() {
      this.validationErrors = {};
      this.allocationErrors = {};
      this.alertMessage = '';
      this.alertClass = '';
    },

    // Validate main form data
    validateForm() {
      this.clearValidationErrors();
      let isValid = true;

      if (!this.formData.employee_id) {
        this.validationErrors.employee_id = 'Please select an employee';
        isValid = false;
      }

      if (!this.formData.employment_type) {
        this.validationErrors.employment_type = 'Please select employment type';
        isValid = false;
      }

      if (!this.formData.department_position_id) {
        this.validationErrors.department_position_id = 'Please select department position';
        isValid = false;
      }

      if (!this.formData.work_location_id) {
        this.validationErrors.work_location_id = 'Please select work location';
        isValid = false;
      }

      if (!this.formData.start_date) {
        this.validationErrors.start_date = 'Please select start date';
        isValid = false;
      }

      if (!this.formData.position_salary) {
        this.validationErrors.position_salary = 'Please enter position salary';
        isValid = false;
      }

      // Validate that funding allocations total exactly 100%
      if (this.fundingAllocations.length === 0) {
        this.alertMessage = 'Please add at least one funding allocation';
        this.alertClass = 'alert-danger';
        isValid = false;
      } else if (this.totalEffort !== 100) {
        this.alertMessage = `Total effort must equal 100%. Current total: ${this.totalEffort}%`;
        this.alertClass = 'alert-danger';
        isValid = false;
      }

      return isValid;
    },

    // Validate current allocation before adding to table
    validateCurrentAllocation() {
      this.allocationErrors = {};
      let isValid = true;

      if (!this.currentAllocation.grant_id) {
        this.allocationErrors.grant_id = 'Please select a grant';
        isValid = false;
      }

      if (this.isOrgFundGrant(this.currentAllocation.grant_id)) {
        if (!this.currentAllocation.department_position_id) {
          this.allocationErrors.department_position_id = 'Please select a department position';
          isValid = false;
        }
        // Validate org_funded_salary (optional but if provided should be valid)
        if (this.currentAllocation.org_funded_salary && this.currentAllocation.org_funded_salary < 0) {
          this.allocationErrors.org_funded_salary = 'Org funded salary must be a positive number';
          isValid = false;
        }
      } else {
        if (!this.currentAllocation.grant_items_id) {
          this.allocationErrors.grant_items_id = 'Please select a grant position';
          isValid = false;
        }
        if (!this.currentAllocation.position_slot_id) {
          this.allocationErrors.position_slot_id = 'Please select a position slot';
          isValid = false;
        }
      }

      if (!this.currentAllocation.level_of_effort || this.currentAllocation.level_of_effort <= 0) {
        this.allocationErrors.level_of_effort = 'Please enter a valid effort percentage';
        isValid = false;
      }

      return isValid;
    },

    async loadGrantStructure() {
      try {
        this.isLoadingData = true;
        console.log('🔄 Loading grant structure from API...');

        const response = await employeeGrantAllocationService.getGrantStructure();

        console.log('📥 Grant Structure Response:', response);

        let grantData;
        if (response && response.success && response.data) {
          grantData = response.data;
        } else if (response && Array.isArray(response)) {
          grantData = response;
        } else {
          console.error('❌ Unable to find grant data in response structure');
          this.grantOptions = [];
          this.grantPositions = {};
          return;
        }

        if (!Array.isArray(grantData)) {
          console.error('❌ Grant data is not an array:', grantData);
          this.grantOptions = [];
          this.grantPositions = {};
          return;
        }

        // Build flat grantOptions for select dropdown
        this.grantOptions = grantData.map(grant => ({
          id: grant.id,
          name: grant.name,
          code: grant.code
        }));

        // Build mapping for dependent dropdowns with position_slots
        const positionsMap = {};
        grantData.forEach(grant => {
          if (grant.grant_items && Array.isArray(grant.grant_items)) {
            positionsMap[grant.id] = grant.grant_items.map(item => {
              const positionSlots = (item.position_slots || []).map(slot => ({
                id: slot.id,
                slot_number: slot.slot_number,
                budget_line: {
                  id: slot.budget_line.id,
                  name: slot.budget_line.name,
                  description: slot.budget_line.description
                }
              }));

              return {
                id: item.id,
                name: item.name,
                grant_salary: item.grant_salary, // Include grant_salary
                grant_benefit: item.grant_benefit, // Include grant_benefit
                grant_level_of_effort: item.grant_level_of_effort, // Include grant_level_of_effort
                position_slots: positionSlots
              };
            });
          } else {
            positionsMap[grant.id] = [];
          }
        });

        this.grantPositions = positionsMap;
        console.log('✅ Grant structure loaded successfully');

      } catch (error) {
        console.error('❌ Error loading grant structure:', error);
        this.alertMessage = `Failed to load grant structure: ${error.message}`;
        this.alertClass = 'alert-danger';
      } finally {
        this.isLoadingData = false;
      }
    },

    loadOrgFundedOptions() {
      // This is now covered by loadDepartmentPositions which is called on demand
    },

    async fetchEmployees() {
      try {
        const response = await employeeService.treeSearch();
        this.employeeTreeData = response.data || [];
      } catch (error) {
        console.error('Error loading employees:', error);
        this.alertMessage = 'Failed to load employees';
        this.alertClass = 'alert-danger';
      }
    },

    async fetchDepartmentPositions() {
      try {
        const response = await departmentPositionService.getAllDepartmentPositions();
        if (response.data) {
          this.departmentPositions = response.data;
        }
      } catch (error) {
        console.error('Error fetching department positions:', error);
        this.alertMessage = 'Failed to load department positions';
        this.alertClass = 'alert-danger';
      }
    },

    async fetchWorkLocations() {
      try {
        const response = await workLocationService.getAllWorkLocations();
        if (response.data) {
          this.workLocations = response.data;
        }
      } catch (error) {
        console.error('Error fetching work locations:', error);
        this.alertMessage = 'Failed to load work locations';
        this.alertClass = 'alert-danger';
      }
    },

    // OPTIMIZED: Single method to fetch all required lookups
    async initFetchLookups() {
      try {
        const lookupStore = useLookupStore();

        // Only fetch lookups if they haven't been loaded yet
        if (!lookupStore.lookups.length) {
          console.log('🔄 Fetching lookups from API...');
          await lookupStore.fetchAllLookups();
          console.log('✅ Lookups fetched successfully');
        } else {
          console.log('✅ Lookups already loaded from store');
        }

        // Get employment types from the store
        this.employmentTypes = lookupStore.getLookupsByType('employment_type');

        // Pay methods are now hardcoded in data() section
        console.log(`📊 Loaded ${this.employmentTypes.length} employment types`);
        console.log(`📊 Using ${this.payMethods.length} hardcoded pay methods`);

      } catch (error) {
        console.error('❌ Error loading lookups:', error);
        this.alertMessage = 'Failed to load form data';
        this.alertClass = 'alert-danger';
      }
    },

    onEmployeeChange() {
      if (this.formData.employee_id) {
        console.log('Employee selected:', this.formData.employee_id);
        const employee = this.findEmployeeInTree(this.employeeTreeData, this.formData.employee_id);
        if (employee) {
          // Get subsidiary from parent node in tree structure
          const subsidiary = this.getEmployeeSubsidiary(this.employeeTreeData, this.formData.employee_id);

          this.selectedEmployeeInfo = {
            name: employee.title,
            staff_id: employee.staff_id || 'N/A',
            subsidiary: subsidiary || 'N/A'
          };
        }
      } else {
        this.selectedEmployeeInfo = null;
      }
    },

    findEmployeeInTree(tree, id) {
      for (const node of tree) {
        if (node.value === id) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = this.findEmployeeInTree(node.children, id);
          if (found) return found;
        }
      }
      return null;
    },

    // Helper method to get subsidiary from parent node
    getEmployeeSubsidiary(tree, employeeId) {
      for (const subsidiaryNode of tree) {
        if (subsidiaryNode.children && subsidiaryNode.children.length > 0) {
          const employee = subsidiaryNode.children.find(emp => emp.value === employeeId);
          if (employee) {
            return subsidiaryNode.title; // Parent node title is the subsidiary name
          }
        }
      }
      return null;
    },

    async onGrantChange() {
      console.log('Grant changed:', this.currentAllocation.grant_id);

      // Determine allocation type and load necessary data
      if (this.isOrgFundGrant(this.currentAllocation.grant_id)) {
        this.currentAllocation.allocation_type = 'org_funded';
        // Clear grant-specific fields
        this.currentAllocation.grant_items_id = '';
        this.currentAllocation.position_slot_id = '';
        this.grantPositionOptions = [];
        this.positionSlotOptions = [];
        // Load department positions if not already loaded
        if (this.departmentPositions.length === 0) {
          await this.fetchDepartmentPositions();
        }
      } else {
        this.currentAllocation.allocation_type = 'grant';
        // Clear org-funded fields
        this.currentAllocation.department_position_id = '';
        this.currentAllocation.org_funded_salary = '';
        // Set options for grant position dropdown
        this.grantPositionOptions = this.grantPositions[this.currentAllocation.grant_id] || [];
        this.positionSlotOptions = [];
      }

      console.log('Available positions for grant:', this.grantPositionOptions);
      this.allocationErrors = {};
    },

    onGrantPositionChange() {
      console.log('Grant position changed:', this.currentAllocation.grant_items_id);
      this.currentAllocation.position_slot_id = '';
      const position = this.grantPositionOptions.find(p => p.id == this.currentAllocation.grant_items_id);
      this.positionSlotOptions = position ? position.position_slots || [] : [];
      delete this.allocationErrors.position_slot_id;
    },

    onEditGrantChange() {
      this.editData.grant_items_id = '';
      this.editData.position_slot_id = '';
      this.editData.department_position_id = '';
      this.editData.org_funded_salary = '';

      if (this.isOrgFundGrant(this.editData.grant_id)) {
        this.editData.allocation_type = 'org_funded';
      } else {
        this.editData.allocation_type = 'grant';
        this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
        const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
        this.editPositionSlotOptions = position ? position.position_slots || [] : [];
      }
    },

    onEditGrantPositionChange() {
      this.editData.position_slot_id = '';
      const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
      this.editPositionSlotOptions = position ? position.position_slots || [] : [];
    },

    addAllocation() {
      console.log('Adding allocation to memory:', this.currentAllocation);

      if (!this.validateCurrentAllocation()) {
        return;
      }

      // Check for duplicates
      const isDuplicate = this.fundingAllocations.some((a, i) => {
        if (this.editingIndex !== null && i === this.editingIndex) return false;

        if (this.currentAllocation.allocation_type === 'grant') {
          return a.position_slot_id === this.currentAllocation.position_slot_id;
        }
        if (this.currentAllocation.allocation_type === 'org_funded') {
          // Assuming a combination of grant and department position is unique for org_funded
          return a.grant_id === this.currentAllocation.grant_id && a.department_position_id === this.currentAllocation.department_position_id;
        }
        return false;
      });

      if (isDuplicate) {
        this.alertMessage = 'This allocation is already added.';
        this.alertClass = 'alert-danger';
        return;
      }

      // Check if total effort would exceed 100%
      const currentTotal = this.fundingAllocations.reduce((sum, a, i) => {
        return i === this.editingIndex ? sum : sum + a.level_of_effort;
      }, 0);

      if (currentTotal + this.currentAllocation.level_of_effort > 100) {
        this.alertMessage = `Adding this allocation would exceed 100% effort. Available: ${100 - currentTotal}%`;
        this.alertClass = 'alert-danger';
        return;
      }

      const allocation = { ...this.currentAllocation };

      if (this.editingIndex !== null) {
        this.fundingAllocations[this.editingIndex] = allocation;
        this.editingIndex = null;
        console.log('Updated allocation in memory');
      } else {
        this.fundingAllocations.push(allocation);
        console.log('Added new allocation to memory. Total allocations:', this.fundingAllocations.length);
      }

      // Reset current allocation form
      this.currentAllocation = {
        allocation_type: '',
        grant_id: '',
        grant_items_id: '',
        position_slot_id: '',
        department_position_id: '',
        level_of_effort: 100,
        org_funded_salary: ''
      };
      this.grantPositionOptions = [];
      this.positionSlotOptions = [];
      this.allocationErrors = {};
      this.alertMessage = '';
      this.alertClass = '';
    },

    editAllocation(index) {
      console.log('Editing allocation at index:', index);
      this.editingIndex = index;
      this.editData = { ...this.fundingAllocations[index] };

      if (this.isOrgFundGrant(this.editData.grant_id)) {
        this.editData.allocation_type = 'org_funded';
      } else {
        this.editData.allocation_type = 'grant';
        this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
        const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
        this.editPositionSlotOptions = position ? position.position_slots || [] : [];
      }
    },

    saveEdit() {
      // Similar validation and save logic as addAllocation
      this.fundingAllocations[this.editingIndex] = { ...this.editData };
      this.editingIndex = null;
      this.alertMessage = '';
      this.alertClass = '';
    },

    cancelEdit() {
      this.editingIndex = null;
    },

    deleteAllocation(index) {
      this.fundingAllocations.splice(index, 1);
      this.editingIndex = null;
    },

    // Helper methods for displaying data
    getGrantName(grantId, originalData = null) {
      if (originalData && originalData.grant_name && originalData.grant_code) {
        return `${originalData.grant_name} (${originalData.grant_code})`;
      }
      const grant = this.grantOptions.find(g => g.id == grantId);
      return grant ? `${grant.name} (${grant.code})` : 'Unknown Grant';
    },

    getDepartmentPositionName(id) {
      const pos = this.departmentPositions.find(p => p.id == id);
      return pos ? `${pos.department} - ${pos.position}` : 'Unknown Position';
    },

    getGrantPositionName(grantId, positionId, originalData = null) {
      if (originalData && originalData.grant_position) {
        return originalData.grant_position;
      }
      const positions = this.grantPositions[grantId] || [];
      const position = positions.find(p => p.id == positionId);
      return position ? position.name : 'Unknown Position';
    },

    getPositionSlotName(grantId, positionId, positionSlotId, originalData = null) {
      if (originalData && originalData.slot_number && originalData.budget_line_code) {
        return `Slot ${originalData.slot_number} - ${originalData.budget_line_code}`;
      }
      const positions = this.grantPositions[grantId] || [];
      const position = positions.find(p => p.id == positionId);
      if (!position || !position.position_slots) return 'Unknown Slot';
      const slot = position.position_slots.find(s => s.id == positionSlotId);
      return slot ? `Slot ${slot.slot_number} - ${slot.budget_line.name}` : 'Unknown Slot';
    },

    getOrgFundedName(orgFundedId, originalData = null) {
      if (originalData && originalData.org_funded_name) {
        return originalData.org_funded_name;
      }
      const orgFunded = this.orgFundedOptions.find(o => o.id == orgFundedId);
      return orgFunded ? orgFunded.name : 'Unknown Org Funding';
    },

    // Helper method to get grant salary from grant position
    getGrantSalary(grantId, grantItemsId, originalData = null) {
      // If we have original data from API response, use it
      if (originalData && originalData.grant_salary) {
        return this.formatCurrency(originalData.grant_salary);
      }

      // Otherwise, find it from our loaded grant structure
      if (!grantId || !grantItemsId) {
        return '-';
      }

      const positions = this.grantPositions[grantId] || [];
      const position = positions.find(p => p.id == grantItemsId);

      if (position && position.grant_salary) {
        return this.formatCurrency(position.grant_salary);
      }

      return '-';
    },

    // Helper method to format currency
    formatCurrency(value) {
      if (value === null || value === undefined || value === '') {
        return '-';
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },

    openModal() {
      if (this.editMode && this.employmentData) {
        this.formData = { ...this.employmentData };
        // Load existing funding allocations if editing
        if (this.formData.id) {
          this.loadEmployeeFundingAllocations(this.formData.id);
        }
      } else {
        this.resetForm();
      }

      this.clearValidationErrors();

      if (this.modalInstance) {
        this.modalInstance.show();
      } else {
        const modalElement = document.getElementById('employmentModal');
        if (modalElement) {
          this.modalInstance = new Modal(modalElement);
          this.modalInstance.show();
        }
      }
    },

    async loadEmployeeFundingAllocations(employmentId) {
      try {
        // TODO: Implement loading existing funding allocations
        console.log('Loading funding allocations for employment:', employmentId);
        this.fundingAllocations = [];
      } catch (error) {
        console.error('Error loading funding allocations:', error);
        this.fundingAllocations = [];
      }
    },

    async handleSubmit() {
      try {
        console.log('Submitting employment with funding allocations...', {
          formData: this.formData,
          fundingAllocations: this.fundingAllocations,
          totalAllocations: this.fundingAllocations.length,
          editMode: this.editMode
        });

        if (!this.validateForm()) {
          console.log('Form validation failed');
          return;
        }

        this.isSubmitting = true;

        // Helper function to format date for API
        const formatDateForAPI = (date) => {
          if (!date) return null;

          // If it's already a string in YYYY-MM-DD format, use it as is
          if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return date;
          }

          // Convert Date object to YYYY-MM-DD format
          if (date instanceof Date) {
            return date.toISOString().split('T')[0];
          }

          return null;
        };

        // Prepare payload to match backend API expectations
        const payload = {
          // Employment data - matching backend field names
          employee_id: this.formData.employee_id,
          employment_type: this.formData.employment_type,
          pay_method: this.formData.pay_method || null,
          probation_pass_date: formatDateForAPI(this.formData.probation_pass_date),
          start_date: formatDateForAPI(this.formData.start_date),
          end_date: formatDateForAPI(this.formData.end_date),
          active: this.formData.active,
          department_position_id: this.formData.department_position_id,
          work_location_id: this.formData.work_location_id,
          position_salary: this.formData.position_salary,
          probation_salary: this.formData.probation_salary || null,
          employee_tax: this.formData.employee_tax || null,
          fte: this.formData.fte || null,
          health_welfare: this.formData.health_welfare,
          pvd: this.formData.pvd,
          saving_fund: this.formData.saving_fund,

          // Funding allocation data - matching backend expectations
          allocations: this.fundingAllocations.map(allocation => {
            const isOrgFunded = this.isOrgFundGrant(allocation.grant_id);

            if (isOrgFunded) {
              // For org_funded allocations, send grant_id and department_position_id and org_funded_salary
              return {
                allocation_type: 'org_funded',
                grant_id: allocation.grant_id,
                department_position_id: allocation.department_position_id,
                org_funded_salary: allocation.org_funded_salary || null,
                level_of_effort: allocation.level_of_effort
              };
            } else {
              // For grant allocations, send position_slot_id (do not include grant_salary)
              return {
                allocation_type: 'grant',
                position_slot_id: allocation.position_slot_id,
                level_of_effort: allocation.level_of_effort
              };
            }
          })
        };

        console.log('Payload for API:', payload);

        let response;
        if (this.editMode) {
          // For editing, we might need separate API calls for employment and funding
          response = await employmentService.updateEmployment(this.formData.employment_id, payload);
        } else {
          // For creating, use the combined API that creates employment + funding allocations
          response = await employmentService.createEmployment(payload);
        }

        console.log('API Response:', response);

        this.alertMessage = this.editMode ? 'Employment Updated!' : 'Employment Created!';
        this.alertClass = 'alert-success';

        setTimeout(() => {
          this.alertMessage = '';
          this.resetForm();
          if (this.modalInstance) {
            this.modalInstance.hide();
          }
        }, 1800);

        this.$emit(this.editMode ? 'employment-updated' : 'employment-added', {
          success: true,
          message: this.editMode ? 'Employment updated successfully' : 'Employment created successfully',
          data: response.data
        });

      } catch (error) {
        console.error('Error submitting form:', error);

        // Handle validation errors from backend
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;

          // Handle array of errors
          if (Array.isArray(errors)) {
            this.alertMessage = errors.join(', ');
          }
          // Handle object of field errors
          else if (typeof errors === 'object') {
            this.validationErrors = errors;
            this.alertMessage = 'Please fix the validation errors below';
          } else {
            this.alertMessage = error.response.data.message || 'Validation failed';
          }
        } else {
          this.alertMessage = error.response?.data?.message || 'Failed to save employment';
        }

        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      console.log('Resetting form and clearing memory');
      this.formData = {
        employment_id: null,
        employee_id: '',
        employment_type: '',
        pay_method: '',
        department_position_id: '',
        work_location_id: '',
        start_date: '',
        end_date: '',
        probation_pass_date: '',
        position_salary: '',
        probation_salary: '',
        employee_tax: '',
        fte: 1.0,
        active: true,
        health_welfare: false,
        pvd: false,
        saving_fund: false
      };
      this.currentAllocation = {
        allocation_type: '',
        grant_id: '',
        grant_items_id: '',
        position_slot_id: '',
        department_position_id: '',
        level_of_effort: 100,
        org_funded_salary: ''
      };
      this.fundingAllocations = [];
      this.selectedEmployeeInfo = null;
      this.editingIndex = null;
      this.editMode = false;
      this.grantPositionOptions = [];
      this.positionSlotOptions = [];
      this.clearValidationErrors();
      console.log('Form reset complete. Memory cleared.');
    },

    // getPopupContainer ensures the dropdown is appended to document.body
    getPopupContainer(trigger) {
      return (typeof window !== 'undefined' && window.document && window.document.body)
        ? window.document.body
        : trigger.parentNode;
    }
  }
};
</script>

<style scoped>
/* New Modal Design Styles (same as grant-position-modal) */
.new-modal-design {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
}

.modal-header-new {
  padding: 34px 32px 0 32px;
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-title-new {
  margin: 0;
  font-size: 1.2em;
  font-weight: 700;
  color: #23325b;
  flex: 1;
}

.btn-close-custom {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.25rem;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s ease-in-out;
}

.btn-close-custom:hover {
  background-color: #f8f9fa;
  color: #000;
}

.modal-body-new {
  padding: 22px 32px 20px 32px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label,
.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #1d2636;
}

.form-group label.required:after,
.form-label.required:after {
  content: " *";
  color: #e53e3e;
}

.form-control,
select {
  width: 100%;
  padding: 7px 12px;
  border-radius: 6px;
  border: 1px solid #c9d2e2;
  font-size: 1em;
  box-sizing: border-box;
  background: #f7f8fa;
  outline: none;
  transition: border 0.2s;
}

.form-control:focus {
  border: 1.5px solid #4a7fff;
  background: #fff;
}

.form-control.is-invalid {
  border-color: #e53e3e;
  background: #fff5f5;
}

.ant-select.is-invalid .ant-select-selector {
  border-color: #e53e3e !important;
  background: #fff5f5 !important;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 5px;
  font-size: 0.875em;
  color: #e53e3e;
  font-weight: 500;
}

.date-row {
  display: flex;
  gap: 14px;
}

.date-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 10px 0 16px 0;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #1d2636;
}

.btn-row {
  text-align: right;
  margin-top: 18px;
}

.btn {
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.btn-cancel {
  background: #fff;
  color: #2a3146;
  border: 1.2px solid #bbc4d1;
  margin-right: 8px;
}

.btn-cancel:hover {
  background: #f4f7fa;
}

.btn-save {
  background: linear-gradient(90deg, #3577ef 70%, #355bef 100%);
  color: #fff;
}

.btn-save:disabled {
  background: #ccd4ea;
  color: #888;
  cursor: not-allowed;
}

.success-msg {
  text-align: center;
  color: #169b53;
  font-weight: bold;
  margin-bottom: 14px;
  padding: 8px 12px;
  background: #f0f9f4;
  border: 1px solid #d4edda;
  border-radius: 6px;
}

.error-msg {
  text-align: center;
  color: #e53e3e;
  font-weight: bold;
  margin-bottom: 14px;
  padding: 8px 12px;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
}

.allocation-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.allocation-table th,
.allocation-table td {
  border: 1px solid #e5eaf0;
  padding: 8px 7px;
  text-align: left;
  font-size: 0.97em;
}

.allocation-table th {
  background: #f8fafc;
  color: #3c4257;
  font-weight: 600;
}

.edit-field {
  width: 90%;
  padding: 4px 7px;
  border-radius: 5px;
  border: 1px solid #c9d2e2;
  background: #fff;
}

.action-btn {
  color: #3577ef;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1em;
  margin-right: 6px;
}

.action-btn.delete {
  color: #e53e3e;
}

.action-btn:hover {
  text-decoration: underline;
}

.employee-info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
}

.employee-info-card .card-body {
  padding: 0;
}

.employee-info-card .card-title {
  margin-bottom: 8px;
  font-size: 0.9em;
  font-weight: 600;
  color: #495057;
}

.employee-info-card .card-text {
  margin-bottom: 0;
  font-size: 0.9em;
}

.no-allocations-msg {
  padding: 20px;
  background: #f8f9fa;
  border: 1px dashed #dee2e6;
  border-radius: 6px;
  margin-bottom: 16px;
}

.no-allocations-msg p {
  margin: 0;
}

.badge-org {
  background: #ffe6c1;
  color: #a37500;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 600;
}

.badge-grant {
  background: #d9f4ec;
  color: #278d4c;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 600;
}

/* TreeSelect styling */
:deep(.ant-select-dropdown) {
  z-index: 1056 !important;
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

/* Date picker specific styles to match employee-list-modal */
.input-icon-end {
  position: relative;
}

.input-icon-addon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6B7280;
  z-index: 2;
}

.datetimepicker {
  padding-right: 35px !important;
}

/* Ensure the date picker fits with the form styling */
:deep(.mx-datepicker) {
  width: 100%;
}

:deep(.mx-input) {
  width: 100% !important;
  padding: 7px 35px 7px 12px !important;
  border-radius: 6px !important;
  border: 1px solid #c9d2e2 !important;
  font-size: 1em !important;
  box-sizing: border-box !important;
  background: #f7f8fa !important;
  outline: none !important;
  transition: border 0.2s !important;
}

:deep(.mx-input:focus) {
  border: 1.5px solid #4a7fff !important;
  background: #fff !important;
}

:deep(.mx-input.is-invalid) {
  border-color: #e53e3e !important;
  background: #fff5f5 !important;
}

/* Hide the default calendar icon from date picker */
:deep(.mx-icon-calendar) {
  display: none;
}
</style>

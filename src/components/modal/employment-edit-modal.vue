<template>
  <div class="modal fade" id="employmentEditModal" tabindex="-1" aria-labelledby="employmentEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content new-modal-design">
        <div class="modal-header-new">
          <h2 class="modal-title-new" id="employmentEditModalLabel">
            Edit Employment
          </h2>
          <button type="button" class="btn-close-custom" @click="handleModalClose" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body-new">
          <div v-if="isLoadingData" class="text-center mb-3">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div>Loading employment data...</div>
          </div>

          <form @submit.prevent="handleSubmit" ref="mainForm" :class="{ 'form-loading': isLoadingData }">
            <div v-if="alertMessage && alertClass === 'alert-success'" class="success-msg">
              {{ alertMessage }}
            </div>

            <div v-if="alertMessage && alertClass === 'alert-danger'" class="error-msg">
              {{ alertMessage }}
            </div>

            <!-- Row 1: Employee (full width) - READ ONLY for edit -->
            <div class="form-group">
              <label class="form-label">Employee</label>
              <div class="employee-display-card">
                <div v-if="selectedEmployeeInfo" class="employee-info">
                  <strong>{{ selectedEmployeeInfo.name }}</strong>
                  <span class="text-muted ms-2">({{ selectedEmployeeInfo.staff_id }})</span>
                  <br>
                  <small class="text-muted">{{ selectedEmployeeInfo.organization }}</small>
                </div>
                <div v-else class="text-muted">
                  Loading employee info...
                </div>
              </div>
            </div>

            <!-- Row 2: Employment Type + Pay Method -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Employment Type</label>
                <select class="form-control" v-model="formData.employment_type"
                  :class="{ 'is-invalid': validationErrors.employment_type }" required :disabled="isLoadingData">
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
              </div>
            </div>

            <!-- Row 3: Department + Position -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Department</label>
                <select class="form-control" v-model="formData.department_id"
                  :class="{ 'is-invalid': validationErrors.department_id }" required @change="onDepartmentChange">
                  <option disabled value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <div v-if="validationErrors.department_id" class="invalid-feedback">
                  {{ validationErrors.department_id }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label required">Position</label>
                <select class="form-control" v-model="formData.position_id"
                  :class="{ 'is-invalid': validationErrors.position_id }" required
                  :disabled="!formData.department_id || positionsLoading">
                  <option disabled value="">{{ positionsLoading ? 'Loading...' : 'Select Position' }}</option>
                  <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                    {{ pos.title }}
                  </option>
                </select>
                <div v-if="validationErrors.position_id" class="invalid-feedback">
                  {{ validationErrors.position_id }}
                </div>
              </div>
            </div>

            <!-- Row 4: Site + Section Department -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Site</label>
                <select class="form-control" v-model="formData.site_id"
                  :class="{ 'is-invalid': validationErrors.site_id }" required>
                  <option disabled value="">Select Site</option>
                  <option v-for="location in workLocations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </option>
                </select>
                <div v-if="validationErrors.site_id" class="invalid-feedback">
                  {{ validationErrors.site_id }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Section Department</label>
                <select class="form-control" v-model="formData.section_department" :disabled="isLoadingData">
                  <option disabled value="">Select Section Department</option>
                  <option v-for="section in sectionDepartments" :key="section.id" :value="section.value">
                    {{ section.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 5: Start Date + Pass Probation Date -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Start Date</label>
                <div class="input-icon-end position-relative">
                  <date-picker v-if="isModalVisible" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                    :editable="true" :clearable="false" :input-format="dateFormat" v-model="computedStartDate"
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
                <label class="form-label">Pass Probation Date</label>
                <div class="input-icon-end position-relative">
                  <date-picker v-if="isModalVisible" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                    :editable="true" :clearable="false" :input-format="dateFormat" v-model="computedProbationPassDate"
                    :class="{ 'is-invalid': validationErrors.pass_probation_date }" />
                  <span class="input-icon-addon">
                    <i class="ti ti-calendar text-gray-7"></i>
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 6: Probation Salary + Pass Probation Salary -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label">Probation Salary</label>
                <input type="number" class="form-control" v-model.number="formData.probation_salary"
                  :class="{ 'is-invalid': validationErrors.probation_salary }" placeholder="Salary during probation">
              </div>

              <div class="form-group">
                <label class="form-label required">Pass Probation Salary</label>
                <input type="number" class="form-control" v-model.number="formData.pass_probation_salary"
                  :class="{ 'is-invalid': validationErrors.pass_probation_salary }" required
                  placeholder="Regular salary after probation">
                <div v-if="validationErrors.pass_probation_salary" class="invalid-feedback">
                  {{ validationErrors.pass_probation_salary }}
                </div>
              </div>
            </div>

            <!-- Row: Employment Status -->
            <div class="form-group">
              <label class="form-label">Employment Status</label>
              <div class="employment-status-container">
                <div class="status-switch-wrapper">
                  <a-switch v-model:checked="formData.status" checked-children="Active" un-checked-children="Inactive"
                    size="default" />
                  <span class="status-label"
                    :class="{ 'status-active': formData.status, 'status-inactive': !formData.status }">
                    {{ formData.status ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <small class="text-muted status-hint">
                  <i class="ti ti-info-circle"></i> Toggle to set employment as Active or Inactive
                </small>
              </div>
            </div>

            <!-- Benefits Section -->
            <div class="form-group">
              <label class="form-label">Benefits</label>
              <div class="benefits-container">
                <div class="benefit-item">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.health_welfare" />
                    <span class="checkmark"></span>
                    Health & Welfare
                  </label>
                </div>
                <div class="benefit-item">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.saving_fund" />
                    <span class="checkmark"></span>
                    Saving Fund
                  </label>
                </div>
                <div class="benefit-item">
                  <label class="checkbox-item">
                    <input type="checkbox" v-model="formData.pvd" />
                    <span class="checkmark"></span>
                    PVD
                  </label>
                </div>
              </div>
            </div>

            <!-- Funding Allocations Section -->
            <div class="form-section funding-allocation-section">
              <div class="section-header-with-status">
                <label class="section-title">Funding Allocations</label>
                <span v-if="fundingAllocations.length > 0" class="badge badge-info">
                  {{ fundingAllocations.length }} allocation(s)
                </span>
              </div>

              <!-- Existing Allocations Table -->
              <div v-if="fundingAllocations.length > 0" class="allocations-table-wrapper">
                <table class="allocations-table">
                  <thead>
                    <tr>
                      <th>Grant</th>
                      <th>Budget Line</th>
                      <th>FTE (%)</th>
                      <th>Allocated Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(allocation, index) in fundingAllocations" :key="allocation.id || index">
                      <td>{{ allocation._original?.grant_name || 'N/A' }}</td>
                      <td>{{ allocation._original?.budget_line_code || 'N/A' }}</td>
                      <td>{{ allocation.fte }}%</td>
                      <td>{{ formatCurrency(allocation._original?.allocated_amount || allocation.allocated_amount) }}</td>
                      <td>
                        <button type="button" class="btn btn-sm btn-outline-danger" @click="removeAllocation(index)">
                          <i class="ti ti-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="total-row">
                      <td colspan="2"><strong>Total</strong></td>
                      <td><strong>{{ totalFte }}%</strong></td>
                      <td colspan="2"><strong>{{ formatCurrency(totalAllocatedSalary) }}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Add New Allocation Form -->
              <div v-if="showAddAllocationForm" class="add-allocation-form">
                <div class="date-row">
                  <div class="form-group">
                    <small class="text-muted">Grant</small>
                    <select v-model="currentAllocation.grant_id" @change="onGrantChange" class="form-control">
                      <option value="">Select grant</option>
                      <option v-for="grant in grantOptions" :key="grant.id" :value="grant.id">
                        {{ grant.name }} ({{ grant.code }})
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <small class="text-muted">Grant Item (Budget Line)</small>
                    <select v-model="currentAllocation.grant_item_id" class="form-control"
                      :disabled="!currentAllocation.grant_id || grantItemsLoading">
                      <option value="">{{ grantItemsLoading ? 'Loading...' : 'Select grant item' }}</option>
                      <option v-for="item in grantItems" :key="item.id" :value="item.id">
                        {{ item.budgetline_code }} - {{ item.grant_position || 'N/A' }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="date-row">
                  <div class="form-group">
                    <small class="text-muted">FTE (%)</small>
                    <input type="number" class="form-control" v-model.number="currentAllocation.fte" min="1" max="100"
                      placeholder="e.g., 100">
                  </div>
                  <div class="form-group d-flex align-items-end">
                    <button type="button" class="btn btn-primary me-2" @click="addAllocation" :disabled="!canAddCurrentAllocation">
                      <i class="ti ti-plus"></i> Add
                    </button>
                    <button type="button" class="btn btn-secondary" @click="cancelAddAllocation">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <button v-if="!showAddAllocationForm" type="button" class="btn btn-outline-primary btn-sm mt-2"
                @click="showAddAllocationForm = true">
                <i class="ti ti-plus"></i> Add Allocation
              </button>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer-new">
              <button type="button" class="btn btn-secondary" @click="handleModalClose">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting">
                  <i class="ti ti-loader spinner-icon"></i> Saving...
                </span>
                <span v-else>
                  <i class="ti ti-device-floppy"></i> Save Changes
                </span>
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
import { nextTick } from 'vue';
import { employmentService } from '@/services/employment.service';
import { workLocationService } from '@/services/worklocation.service';
import { useLookupStore } from '@/stores/lookupStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';

export default {
  name: 'EmploymentEditModal',

  emits: ['employment-updated', 'modal-closed'],

  data() {
    return {
      // Modal state
      isModalVisible: false,
      isLoadingData: false,
      isSubmitting: false,
      modalInstance: null,

      // Alert messages
      alertMessage: '',
      alertClass: '',

      // Employment data from parent
      employmentData: null,

      // Form data
      formData: {
        id: null,
        employee_id: '',
        employment_type: '',
        pay_method: '',
        department_id: '',
        position_id: '',
        section_department: '',
        site_id: '',
        start_date: null,
        end_date: null,
        pass_probation_date: null,
        pass_probation_salary: '',
        probation_salary: '',
        status: true,
        health_welfare: false,
        pvd: false,
        saving_fund: false
      },

      // Validation
      validationErrors: {},

      // Selected employee info
      selectedEmployeeInfo: null,

      // Dropdown data
      departments: [],
      positions: [],
      positionsLoading: false,
      workLocations: [],
      grantOptions: [],
      grantItems: [],
      grantItemsLoading: false,

      // Funding allocations
      fundingAllocations: [],
      showAddAllocationForm: false,
      currentAllocation: {
        grant_id: '',
        grant_item_id: '',
        fte: 100
      },

      // Static options
      employmentTypes: [
        { id: 1, value: 'Full-time' },
        { id: 2, value: 'Part-time' },
        { id: 3, value: 'Contract' },
        { id: 4, value: 'Temporary' },
        { id: 5, value: 'Local ID Staff' },
        { id: 6, value: 'Local non ID Staff' },
        { id: 7, value: 'Expats' }
      ],
      payMethods: [
        { id: 1, value: 'Transferred to bank' },
        { id: 2, value: 'Cash' },
        { id: 3, value: 'Cheque' }
      ],
      sectionDepartments: [],

      // Date format
      dateFormat: 'dd/MM/yyyy'
    };
  },

  computed: {
    computedStartDate: {
      get() {
        return this.formData.start_date;
      },
      set(value) {
        this.formData.start_date = this.safeConvertToDate(value);
      }
    },
    computedProbationPassDate: {
      get() {
        return this.formData.pass_probation_date;
      },
      set(value) {
        this.formData.pass_probation_date = this.safeConvertToDate(value);
      }
    },
    totalFte() {
      return this.fundingAllocations.reduce((sum, a) => sum + (a.fte || 0), 0);
    },
    totalAllocatedSalary() {
      return this.fundingAllocations.reduce((sum, a) => {
        const amount = a._original?.allocated_amount || a.allocated_amount || 0;
        return sum + parseFloat(amount);
      }, 0);
    },
    canAddCurrentAllocation() {
      return this.currentAllocation.grant_id && this.currentAllocation.grant_item_id && this.currentAllocation.fte > 0;
    }
  },

  methods: {
    // Safe date conversion
    safeConvertToDate(value) {
      if (!value) return null;
      if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
      if (typeof value === 'string') {
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
    },

    // Format date for API
    formatDateForAPI(date) {
      if (!date) return null;
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
      if (date instanceof Date) return date.toISOString().split('T')[0];
      return null;
    },

    // Format currency
    formatCurrency(value) {
      if (value === null || value === undefined || value === '') return '-';
      return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },

    // Clear validation errors
    clearValidationErrors() {
      this.validationErrors = {};
      this.alertMessage = '';
      this.alertClass = '';
    },

    // Open modal - main entry point
    async openModal() {
      console.log('🔵 EmploymentEditModal.openModal() called');
      this.clearValidationErrors();
      this.isModalVisible = true;
      this.isLoadingData = true;

      await nextTick();

      try {
        // Load dropdown data
        await this.loadDropdownData();

        // Populate form with employment data
        if (this.employmentData) {
          await this.populateFormData();
        }

        // Show the Bootstrap modal
        this.showBootstrapModal();
      } catch (error) {
        console.error('Error opening modal:', error);
        this.alertMessage = 'Failed to load data. Please try again.';
        this.alertClass = 'alert-danger';
      } finally {
        this.isLoadingData = false;
      }
    },

    // Show Bootstrap modal
    showBootstrapModal() {
      if (this.modalInstance) {
        this.modalInstance.show();
      } else {
        const modalElement = document.getElementById('employmentEditModal');
        if (modalElement) {
          this.modalInstance = new Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
          this.modalInstance.show();
        }
      }
    },

    // Load dropdown data
    async loadDropdownData() {
      const sharedStore = useSharedDataStore();
      const lookupStore = useLookupStore();

      try {
        // Load departments
        const depts = await sharedStore.fetchDepartments(true);
        this.departments = Array.isArray(depts) ? depts : (depts?.data || []);

        // Load work locations
        const locations = await workLocationService.getAllWorkLocations();
        this.workLocations = (locations.success || locations.status === 'success') ? (locations.data || []) : [];

        // Load grants
        const grants = await sharedStore.fetchGrants(true);
        this.grantOptions = Array.isArray(grants) ? grants : (grants?.data || []);

        // Load section departments from lookup
        const sections = await lookupStore.fetchLookupsByType('section_department');
        this.sectionDepartments = sections || [];

        console.log('✅ Dropdown data loaded');
      } catch (error) {
        console.error('Error loading dropdown data:', error);
      }
    },

    // Populate form with employment data
    async populateFormData() {
      const data = this.employmentData;
      console.log('📥 Populating form with:', data);

      // Basic fields
      this.formData.id = data.id;
      this.formData.employee_id = data.employee_id;
      this.formData.employment_type = data.employment_type || '';
      this.formData.pay_method = data.pay_method || '';
      this.formData.department_id = data.department_id || '';
      this.formData.position_id = data.position_id || '';
      this.formData.section_department = data.section_department || '';
      this.formData.site_id = data.site_id || '';
      this.formData.probation_salary = data.probation_salary || '';
      this.formData.pass_probation_salary = data.pass_probation_salary || '';
      this.formData.status = data.status === 1 || data.status === true || data.status === 'Active';
      this.formData.health_welfare = data.health_welfare === 1 || data.health_welfare === true;
      this.formData.saving_fund = data.saving_fund === 1 || data.saving_fund === true;
      this.formData.pvd = data.pvd === 1 || data.pvd === true;

      // Convert dates
      this.formData.start_date = data.start_date ? new Date(data.start_date) : null;
      this.formData.end_date = data.end_date ? new Date(data.end_date) : null;
      this.formData.pass_probation_date = data.pass_probation_date ? new Date(data.pass_probation_date) : null;

      // Set employee info
      if (data.employee) {
        this.selectedEmployeeInfo = {
          name: `${data.employee.first_name_en || ''} ${data.employee.last_name_en || ''}`.trim(),
          staff_id: data.employee.staff_id || 'N/A',
          organization: data.employee.organization || 'N/A'
        };
      }

      // Load positions for selected department
      if (this.formData.department_id) {
        await this.loadPositions(this.formData.department_id);
      }

      // Load funding allocations
      if (data.id) {
        await this.loadFundingAllocations(data.id);
      }
    },

    // Load positions for department
    async loadPositions(departmentId) {
      if (!departmentId) {
        this.positions = [];
        return;
      }

      this.positionsLoading = true;
      try {
        const sharedStore = useSharedDataStore();
        const positions = await sharedStore.fetchPositions(true, { department_id: departmentId });
        this.positions = Array.isArray(positions) ? positions : (positions?.data || []);
      } catch (error) {
        console.error('Error loading positions:', error);
        this.positions = [];
      } finally {
        this.positionsLoading = false;
      }
    },

    // Department change handler
    async onDepartmentChange() {
      this.formData.position_id = '';
      await this.loadPositions(this.formData.department_id);
    },

    // Load funding allocations
    async loadFundingAllocations(employmentId) {
      try {
        const response = await employmentService.getFundingAllocations(employmentId);
        if (response.success && response.data) {
          const allocationsData = response.data.funding_allocations || response.data;
          this.fundingAllocations = allocationsData.map(allocation => {
            const grantItem = allocation.grant_item || {};
            const grant = grantItem.grant || {};
            return {
              id: allocation.id,
              grant_id: grant.id || '',
              grant_item_id: allocation.grant_item_id || grantItem.id || '',
              fte: parseFloat(allocation.fte),
              allocated_amount: allocation.allocated_amount,
              _original: {
                grant_name: grant.name || 'Unknown',
                grant_code: grant.code || '',
                budget_line_code: grantItem.budgetline_code || '',
                allocated_amount: allocation.allocated_amount
              }
            };
          });
          console.log('✅ Loaded', this.fundingAllocations.length, 'allocations');
        }
      } catch (error) {
        console.error('Error loading allocations:', error);
        this.fundingAllocations = [];
      }
    },

    // Grant change handler
    async onGrantChange() {
      this.currentAllocation.grant_item_id = '';
      if (!this.currentAllocation.grant_id) {
        this.grantItems = [];
        return;
      }

      this.grantItemsLoading = true;
      try {
        const sharedStore = useSharedDataStore();
        const items = await sharedStore.fetchGrantItems(this.currentAllocation.grant_id, true);
        this.grantItems = Array.isArray(items) ? items : (items?.data || []);
      } catch (error) {
        console.error('Error loading grant items:', error);
        this.grantItems = [];
      } finally {
        this.grantItemsLoading = false;
      }
    },

    // Add allocation
    async addAllocation() {
      if (!this.canAddCurrentAllocation) return;

      // Find grant item details for display
      const grantItem = this.grantItems.find(i => i.id === this.currentAllocation.grant_item_id);
      const grant = this.grantOptions.find(g => g.id === this.currentAllocation.grant_id);

      // Calculate allocated amount (simplified - actual calculation should use backend)
      const baseSalary = this.formData.pass_probation_salary || this.formData.probation_salary || 0;
      const allocatedAmount = (baseSalary * this.currentAllocation.fte) / 100;

      this.fundingAllocations.push({
        id: null, // New allocation
        grant_id: this.currentAllocation.grant_id,
        grant_item_id: this.currentAllocation.grant_item_id,
        fte: this.currentAllocation.fte,
        allocated_amount: allocatedAmount,
        _original: {
          grant_name: grant?.name || 'Unknown',
          grant_code: grant?.code || '',
          budget_line_code: grantItem?.budgetline_code || '',
          allocated_amount: allocatedAmount
        }
      });

      // Reset form
      this.currentAllocation = { grant_id: '', grant_item_id: '', fte: 100 };
      this.showAddAllocationForm = false;
    },

    // Cancel add allocation
    cancelAddAllocation() {
      this.currentAllocation = { grant_id: '', grant_item_id: '', fte: 100 };
      this.showAddAllocationForm = false;
    },

    // Remove allocation
    removeAllocation(index) {
      this.fundingAllocations.splice(index, 1);
    },

    // Validate form
    validateForm() {
      this.validationErrors = {};

      if (!this.formData.employment_type) {
        this.validationErrors.employment_type = 'Employment type is required';
      }
      if (!this.formData.department_id) {
        this.validationErrors.department_id = 'Department is required';
      }
      if (!this.formData.position_id) {
        this.validationErrors.position_id = 'Position is required';
      }
      if (!this.formData.site_id) {
        this.validationErrors.site_id = 'Site is required';
      }
      if (!this.formData.start_date) {
        this.validationErrors.start_date = 'Start date is required';
      }
      if (!this.formData.pass_probation_salary) {
        this.validationErrors.pass_probation_salary = 'Pass probation salary is required';
      }

      return Object.keys(this.validationErrors).length === 0;
    },

    // Build payload for API
    buildPayload() {
      const payload = {
        employee_id: this.formData.employee_id,
        employment_type: this.formData.employment_type,
        pay_method: this.formData.pay_method || null,
        department_id: this.formData.department_id,
        position_id: this.formData.position_id,
        section_department: this.formData.section_department || null,
        site_id: this.formData.site_id,
        start_date: this.formatDateForAPI(this.formData.start_date),
        end_date: this.formatDateForAPI(this.formData.end_date),
        pass_probation_date: this.formatDateForAPI(this.formData.pass_probation_date),
        probation_salary: this.formData.probation_salary || null,
        pass_probation_salary: this.formData.pass_probation_salary,
        status: this.formData.status ? 1 : 0,
        health_welfare: this.formData.health_welfare ? 1 : 0,
        saving_fund: this.formData.saving_fund ? 1 : 0,
        pvd: this.formData.pvd ? 1 : 0
      };

      // Include allocations if any
      if (this.fundingAllocations.length > 0) {
        payload.allocations = this.fundingAllocations.map(a => ({
          grant_item_id: a.grant_item_id,
          fte: a.fte
        }));
      }

      return payload;
    },

    // Handle form submit
    async handleSubmit() {
      if (!this.validateForm()) {
        this.alertMessage = 'Please fix the errors above.';
        this.alertClass = 'alert-danger';
        return;
      }

      this.isSubmitting = true;
      this.alertMessage = '';

      try {
        const payload = this.buildPayload();
        console.log('📤 Submitting payload:', payload);

        const response = await employmentService.updateEmployment(this.formData.id, payload);

        if (response.success) {
          this.alertMessage = 'Employment updated successfully!';
          this.alertClass = 'alert-success';
          this.$emit('employment-updated', response.data);

          // Close modal after short delay
          setTimeout(() => {
            this.closeModal();
          }, 1000);
        } else {
          throw new Error(response.message || 'Update failed');
        }
      } catch (error) {
        console.error('Error updating employment:', error);
        this.alertMessage = error.message || 'Failed to update employment. Please try again.';
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    // Handle modal close
    handleModalClose() {
      this.closeModal();
    },

    // Close modal
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
      this.isModalVisible = false;
      this.resetForm();
      this.$emit('modal-closed');
    },

    // Reset form
    resetForm() {
      this.formData = {
        id: null,
        employee_id: '',
        employment_type: '',
        pay_method: '',
        department_id: '',
        position_id: '',
        section_department: '',
        site_id: '',
        start_date: null,
        end_date: null,
        pass_probation_date: null,
        pass_probation_salary: '',
        probation_salary: '',
        status: true,
        health_welfare: false,
        pvd: false,
        saving_fund: false
      };
      this.fundingAllocations = [];
      this.selectedEmployeeInfo = null;
      this.validationErrors = {};
      this.alertMessage = '';
      this.alertClass = '';
      this.showAddAllocationForm = false;
    },

    // Cleanup modal backdrops
    cleanupModalBackdrops() {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  },

  mounted() {
    console.log('📦 EmploymentEditModal mounted');

    // Setup modal hidden event
    const modalElement = document.getElementById('employmentEditModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.isModalVisible = false;
        this.cleanupModalBackdrops();
        this.$emit('modal-closed');
      });
    }
  },

  beforeUnmount() {
    if (this.modalInstance) {
      try {
        this.modalInstance.dispose();
      } catch (e) {
        console.error('Error disposing modal:', e);
      }
    }
    this.cleanupModalBackdrops();
  }
};
</script>

<style scoped>
/* Modal Design Styles */
.new-modal-design {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
}

.modal-header-new {
  padding: 24px 32px 0 32px;
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
}

.btn-close-custom {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s;
}

.btn-close-custom:hover {
  background-color: #f8f9fa;
  color: #000;
}

.modal-body-new {
  padding: 22px 32px 20px 32px;
}

.modal-footer-new {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  margin-top: 20px;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1d2636;
}

.form-label.required:after {
  content: " *";
  color: #e53e3e;
}

.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Employee Display */
.employee-display-card {
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

/* Status Switch */
.employment-status-container {
  padding: 16px 18px;
  background: linear-gradient(135deg, #f8f9fc 0%, #f0f2f5 100%);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.status-switch-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
}

.status-label {
  font-weight: 600;
  font-size: 0.95em;
  padding: 4px 12px;
  border-radius: 20px;
}

.status-label.status-active {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.status-label.status-inactive {
  color: #8c8c8c;
  background: rgba(140, 140, 140, 0.1);
}

.status-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85em;
}

/* Benefits */
.benefits-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.benefit-item {
  flex: 1 1 200px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

/* Funding Section */
.form-section {
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.section-header-with-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-weight: 600;
  font-size: 1.1em;
  color: #1d2636;
}

/* Allocations Table */
.allocations-table-wrapper {
  overflow-x: auto;
  margin-bottom: 16px;
}

.allocations-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 6px;
  overflow: hidden;
}

.allocations-table th,
.allocations-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.allocations-table th {
  background: #f1f3f5;
  font-weight: 600;
  font-size: 0.85em;
  color: #495057;
}

.allocations-table .total-row {
  background: #e9ecef;
}

/* Add Allocation Form */
.add-allocation-form {
  padding: 16px;
  background: white;
  border-radius: 6px;
  border: 1px dashed #ced4da;
  margin-top: 12px;
}

/* Loading State */
.form-loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Messages */
.success-msg {
  padding: 12px 16px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  color: #155724;
  margin-bottom: 16px;
}

.error-msg {
  padding: 12px 16px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  color: #721c24;
  margin-bottom: 16px;
}

/* Spinner */
.spinner-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Date picker container */
.input-icon-end {
  position: relative;
}

.input-icon-addon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6c757d;
}
</style>

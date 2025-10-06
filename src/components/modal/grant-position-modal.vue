<template>
  <!-- Bootstrap Modal Markup -->
  <div class="modal fade" id="grantPositionModal" tabindex="-1" aria-labelledby="grantPositionModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content new-modal-design">
        <div class="modal-header-new">
          <h2 class="modal-title-new" id="grantPositionModalLabel">
            {{ isEditMode ? 'Edit Allocation' : 'Add Allocation' }}
          </h2>
          <button type="button" class="btn-close-custom" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body-new">
          <!-- Loading state -->
          <div v-if="isLoadingData" class="text-center mb-3">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Loading grant data...
          </div>

          <form @submit.prevent="handleSubmit" ref="mainForm">
            <!-- Success Message -->
            <div v-if="alertMessage && alertClass === 'alert-success'" class="success-msg">
              {{ alertMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="alertMessage && alertClass === 'alert-danger'" class="error-msg">
              {{ alertMessage }}
            </div>

            <!-- Employee Selection TreeSelect -->
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

            <!-- Employee Info Display (when employee is selected) -->
            <div v-if="selectedEmployeeInfo" class="employee-info-card mb-3">
              <div class="card-body">
                <h6 class="card-title">Selected Employee</h6>
                <p class="card-text">
                  <strong>{{ selectedEmployeeInfo.name }}</strong><br>
                  <small class="text-muted">Staff ID: {{ selectedEmployeeInfo.staff_id }}</small><br>
                  <small class="text-muted">
                    {{ selectedEmployeeInfo.total_allocations }} allocation(s) |
                    Total Effort: {{ selectedEmployeeInfo.total_effort }}%
                  </small>
                </p>
              </div>
            </div>

            <!-- Grant Allocation Add Row -->
            <div class="form-group" style="margin-bottom: 0;">
              <label>Allocation</label>
              <div class="date-row" style="margin-bottom:8px;">
                <!-- Grant Dropdown -->
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

                <!-- Org-funded workflow (show department positions if isOrgFundGrant) -->
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
                </template>
                <!-- Grant-funded workflow -->
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
                </template>
                <!-- Level of Effort (common) -->
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

            <!-- Allocations Table (updated: badge for type) -->
            <table v-if="grantAllocations.length > 0" class="allocation-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Grant</th>
                  <th>Department Position</th>
                  <th>Grant Position</th>
                  <th>Position Slot</th>
                  <th>Effort (%)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in grantAllocations" :key="idx">
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
                      <select v-if="editData.allocation_type === 'org_funded'" v-model="editData.department_position_id"
                        class="edit-field">
                        <option value="">Select department position</option>
                        <option v-for="position in departmentPositions" :key="position.id" :value="position.id">
                          {{ position.department }} - {{ position.position }}
                        </option>
                      </select>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <select v-if="editData.allocation_type !== 'org_funded'" v-model="editData.grant_items_id"
                        @change="onEditGrantPositionChange" class="edit-field">
                        <option value="">Select position</option>
                        <option v-for="position in editGrantPositionOptions" :key="position.id" :value="position.id">
                          {{ position.name }}
                        </option>
                      </select>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <select v-if="editData.allocation_type !== 'org_funded'" v-model="editData.position_slot_id"
                        class="edit-field">
                        <option value="">Select position slot</option>
                        <option v-for="slot in editPositionSlotOptions" :key="slot.id" :value="slot.id">
                          Slot {{ slot.slot_number }} - {{ slot.budget_line.name }}
                        </option>
                      </select>
                      <span v-else class="text-muted">-</span>
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
              <p class="text-muted text-center">No grant allocations found for this employee. Add allocations above.</p>
            </div>

            <!-- Dates -->
            <div class="date-row">
              <div class="form-group">
                <label for="start-date" class="required">Start Date</label>
                <input type="date" v-model="formData.startDate" class="form-control"
                  :class="{ 'is-invalid': validationErrors.startDate }" required>
                <div v-if="validationErrors.startDate" class="invalid-feedback">
                  {{ validationErrors.startDate }}
                </div>
              </div>
              <div class="form-group">
                <label for="end-date">End Date</label>
                <input type="date" v-model="formData.endDate" class="form-control"
                  :class="{ 'is-invalid': validationErrors.endDate }">
                <div v-if="validationErrors.endDate" class="invalid-feedback">
                  {{ validationErrors.endDate }}
                </div>
              </div>
            </div>

            <div class="btn-row">
              <button type="button" class="btn btn-cancel" @click="resetForm" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-save" :disabled="isSubmitting || isLoadingData">
                <span v-if="isSubmitting">{{ isEditMode ? 'Updating...' : 'Saving...' }}</span>
                <span v-else>{{ isEditMode ? 'Update' : 'Save' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap';
import { grantService } from '@/services/grant.service';
import { employeeService } from '@/services/employee.service';
import { employeeGrantAllocationService } from '@/services/employee-grant-allocation.service';

export default {
  name: 'GrantPositionModal',
  data() {
    return {
      isEditMode: false,
      isSubmitting: false,
      isLoadingData: false,
      alertMessage: '',
      alertClass: '',
      formData: {
        id: null,
        employee_id: null,
        startDate: null,
        endDate: null
      },
      currentAllocation: {
        allocation_type: '',
        grant_id: '',
        grant_items_id: '',
        position_slot_id: '',
        department_position_id: '',
        level_of_effort: 100
      },
      editData: {
        allocation_type: '',
        grant_id: '',
        grant_items_id: '',
        position_slot_id: '',
        department_position_id: '',
        level_of_effort: 100
      },
      grantAllocations: [], // Stored in memory until Save is clicked
      editingIndex: null,
      selectedEmployeeInfo: null, // Store employee info

      // Validation errors
      validationErrors: {},
      allocationErrors: {},

      // Data sources
      grantOptions: [],
      employeeTreeData: [],
      grantPositions: {}, // Store grant positions by grant ID
      departmentPositions: [], // new

      // Computed options for dropdowns
      grantPositionOptions: [],
      positionSlotOptions: [],
      editGrantPositionOptions: [],
      editPositionSlotOptions: [],
      apiResponseStatus: 'Loading...'
    };
  },

  computed: {
    hasOrgFunded() {
      return this.grantAllocations.some(a => a.allocation_type === 'org_funded');
    }
  },

  methods: {
    isOrgFundGrant(grantId) {
      // Adapt to use DB, config, or API (just demo)
      const hubGrantCodes = ['S0031', 'S22001'];
      const grant = this.grantOptions.find(g => g.id == grantId);
      return grant && hubGrantCodes.includes(grant.code);
    },

    // Clear validation errors
    clearValidationErrors() {
      this.validationErrors = {};
      this.allocationErrors = {};
      this.alertMessage = '';
      this.alertClass = '';
    },

    // Validate only main form data (Employee, Start Date, End Date, Active)
    validateForm() {
      this.clearValidationErrors();
      let isValid = true;

      // Validate employee selection
      if (!this.formData.employee_id) {
        this.validationErrors.employee_id = 'Please select an employee';
        isValid = false;
      }

      // Validate start date
      if (!this.formData.startDate) {
        this.validationErrors.startDate = 'Please select a start date';
        isValid = false;
      }

      // Validate end date (if provided)
      if (this.formData.endDate && this.formData.startDate && this.formData.endDate < this.formData.startDate) {
        this.validationErrors.endDate = 'End date cannot be before start date';
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

    async loadGrantPositions() {
      try {
        this.isLoadingData = true;
        this.apiResponseStatus = 'Loading...';
        console.log('🔄 Loading grant positions from API...');

        const response = await employeeGrantAllocationService.getGrantStructure();

        console.log('📥 Complete Response:', response);

        // Handle the response - it should be the JSON object directly
        let grantData;

        // Check if response is the direct JSON object with success property
        if (response && response.success && response.data) {
          grantData = response.data;
          console.log('✅ Using response.data directly');
        }
        // Check if response is just the data array directly (fallback)
        else if (response && Array.isArray(response)) {
          grantData = response;
          console.log('✅ Using response as data array directly');
        }
        // Check if response has nested data.data structure
        else if (response && response.data && response.data.data) {
          grantData = response.data.data;
          console.log('✅ Using response.data.data');
        }
        else {
          console.error('❌ Unable to find grant data in response structure');
          this.grantOptions = [];
          this.grantPositions = {};
          this.alertMessage = 'Invalid response structure from server';
          this.alertClass = 'alert-danger';
          return;
        }

        // Validate that grantData is an array
        if (!Array.isArray(grantData)) {
          console.error('❌ Grant data is not an array:', grantData);
          this.grantOptions = [];
          this.grantPositions = {};
          this.alertMessage = 'Invalid data format received from server';
          this.alertClass = 'alert-danger';
          return;
        }

        console.log('📊 Processing grant data array with', grantData.length, 'grants');

        // Build flat grantOptions for select dropdown
        this.grantOptions = grantData.map(grant => {
          console.log('🏗️ Processing grant:', grant.id, grant.name, grant.code);
          return {
            id: grant.id,
            name: grant.name,
            code: grant.code
          };
        });

        console.log('✅ Built grantOptions:', this.grantOptions);

        // Build mapping for dependent dropdowns with position_slots
        const positionsMap = {};
        grantData.forEach(grant => {
          console.log(`🏗️ Processing positions for grant ${grant.id} (${grant.name})`);

          if (grant.grant_items && Array.isArray(grant.grant_items)) {
            positionsMap[grant.id] = grant.grant_items.map(item => {
              // Process position_slots instead of budget_lines
              const positionSlots = (item.position_slots || []).map(slot => ({
                id: slot.id,
                slot_number: slot.slot_number,
                budget_line: {
                  id: slot.budget_line.id,
                  name: slot.budget_line.name,
                  description: slot.budget_line.description
                }
              }));

              console.log(`   - Item ${item.id}: ${item.name} (${positionSlots.length} position slots)`);

              return {
                id: item.id,
                name: item.name,
                position_slots: positionSlots
              };
            });
          } else {
            console.warn(`   - No grant_items found for grant ${grant.id}`);
            positionsMap[grant.id] = [];
          }
        });

        this.grantPositions = positionsMap;

        console.log('✅ Grant structure loaded successfully:', {
          totalGrants: this.grantOptions.length,
          totalPositionGroups: Object.keys(this.grantPositions).length,
          grantOptions: this.grantOptions,
          positionsSample: Object.keys(this.grantPositions).slice(0, 2).reduce((obj, key) => {
            obj[key] = this.grantPositions[key];
            return obj;
          }, {})
        });

        this.apiResponseStatus = `Success (${this.grantOptions.length} grants loaded)`;

        // Clear any previous error messages
        this.alertMessage = '';
        this.alertClass = '';

      } catch (error) {
        console.error('❌ Exception in loadGrantPositions:', error);
        console.error('❌ Error message:', error.message);

        let errorMessage = error.message || 'Unknown error occurred';

        this.apiResponseStatus = `Error: ${errorMessage}`;
        this.grantOptions = [];
        this.grantPositions = {};
        this.alertMessage = `Failed to load grant structure: ${errorMessage}`;
        this.alertClass = 'alert-danger';
      } finally {
        this.isLoadingData = false;
        console.log('🏁 loadGrantPositions completed');
        console.log('📊 Final state - grantOptions:', this.grantOptions.length, 'items');
        console.log('📊 Final state - grantPositions:', Object.keys(this.grantPositions).length, 'groups');
      }
    },

    async loadEmployees() {
      try {
        console.log('Loading employees...');
        const response = await employeeService.treeSearch();
        this.employeeTreeData = response.data || [];
        console.log('Employees loaded:', this.employeeTreeData.length);
      } catch (error) {
        console.error('Error loading employees:', error);
        this.alertMessage = 'Failed to load employees';
        this.alertClass = 'alert-danger';
      }
    },

    async loadDepartmentPositions() {
      try {
        const response = await departmentPositionService.getAllDepartmentPositions();
        this.departmentPositions = response.data;
      } catch (error) {
        this.alertMessage = 'Failed to load department positions';
        this.alertClass = 'alert-danger';
      }
    },

    // getPopupContainer ensures the dropdown is appended to document.body.
    getPopupContainer(trigger) {
      return (typeof window !== 'undefined' && window.document && window.document.body)
        ? window.document.body
        : trigger.parentNode;
    },

    async onGrantChange() {
      console.log('Grant changed:', this.currentAllocation.grant_id);

      if (this.isOrgFundGrant(this.currentAllocation.grant_id)) {
        await this.loadDepartmentPositions();
        this.currentAllocation.allocation_type = 'org_funded';
        // Clear grant position/slot
        this.currentAllocation.grant_items_id = '';
        this.currentAllocation.position_slot_id = '';
        this.grantPositionOptions = [];
        this.positionSlotOptions = [];
      } else {
        this.currentAllocation.allocation_type = 'grant';
        // Load grant positions as before
        this.currentAllocation.department_position_id = '';
        this.grantPositionOptions = this.grantPositions[this.currentAllocation.grant_id] || [];
        this.positionSlotOptions = [];
      }

      console.log('Available positions for grant:', this.grantPositionOptions);

      // Clear related validation errors
      this.allocationErrors = {};
    },

    onGrantPositionChange() {
      console.log('Grant position changed:', this.currentAllocation.grant_items_id);
      this.currentAllocation.position_slot_id = '';
      const position = this.grantPositionOptions.find(p => p.id == this.currentAllocation.grant_items_id);
      this.positionSlotOptions = position ? position.position_slots || [] : [];

      console.log('Available position slots for position:', this.positionSlotOptions);

      // Clear related validation errors
      delete this.allocationErrors.position_slot_id;
    },

    onEditGrantChange() {
      console.log('Edit grant changed:', this.editData.grant_id);
      this.editData.grant_items_id = '';
      this.editData.position_slot_id = '';
      this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
      this.editPositionSlotOptions = [];
    },

    onEditGrantPositionChange() {
      console.log('Edit grant position changed:', this.editData.grant_items_id);
      this.editData.position_slot_id = '';
      const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
      this.editPositionSlotOptions = position ? position.position_slots || [] : [];
    },

    addAllocation() {
      console.log('Adding allocation to memory:', this.currentAllocation);

      // Validate current allocation before adding to table
      if (!this.validateCurrentAllocation()) {
        return;
      }

      // Compose allocation row
      const alloc = {
        ...this.currentAllocation,
        allocation_type: this.isOrgFundGrant(this.currentAllocation.grant_id) ? 'org_funded' : 'grant'
      };

      // Prevent duplicate for both types
      if (this.grantAllocations.some((a, i) => {
        if (this.editingIndex !== null && i === this.editingIndex) return false;
        if (alloc.allocation_type === 'org_funded' && a.allocation_type === 'org_funded') {
          return a.department_position_id == alloc.department_position_id;
        }
        if (alloc.allocation_type === 'grant' && a.allocation_type === 'grant') {
          return a.position_slot_id == alloc.position_slot_id;
        }
        return false;
      })) {
        this.alertMessage = 'This allocation is already added.';
        this.alertClass = 'alert-danger';
        return;
      }

      if (this.editingIndex !== null) {
        // Save edit
        this.grantAllocations[this.editingIndex] = alloc;
        this.editingIndex = null;
        console.log('Updated allocation in memory at index:', this.editingIndex);
      } else {
        // Add new to memory
        this.grantAllocations.push(alloc);
        console.log('Added new allocation to memory. Total allocations:', this.grantAllocations.length);
      }

      // Reset current allocation form
      this.currentAllocation = {
        allocation_type: '',
        grant_id: '',
        grant_items_id: '',
        position_slot_id: '',
        department_position_id: '',
        level_of_effort: 100
      };
      this.grantPositionOptions = [];
      this.positionSlotOptions = [];
      this.allocationErrors = {};

      // Clear any existing error messages
      this.alertMessage = '';
      this.alertClass = '';
    },

    editAllocation(index) {
      console.log('Editing allocation at index:', index);
      this.editingIndex = index;
      this.editData = { ...this.grantAllocations[index] };
      this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
      const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
      this.editPositionSlotOptions = position ? position.position_slots || [] : [];
    },

    saveEdit() {
      console.log('Saving edit:', this.editData);

      const { allocation_type, grant_id, grant_items_id, position_slot_id, department_position_id, level_of_effort } = this.editData;

      if (!grant_id || !level_of_effort) {
        this.alertMessage = 'Please fill in all required fields.';
        this.alertClass = 'alert-danger';
        return;
      }

      if (allocation_type === 'org_funded' && !department_position_id) {
        this.alertMessage = 'Please select a department position.';
        this.alertClass = 'alert-danger';
        return;
      }

      if (allocation_type === 'grant' && (!grant_items_id || !position_slot_id)) {
        this.alertMessage = 'Please select grant position and position slot.';
        this.alertClass = 'alert-danger';
        return;
      }

      // Check for duplicates
      if (this.grantAllocations.some((a, i) => {
        if (i === this.editingIndex) return false;
        if (allocation_type === 'org_funded' && a.allocation_type === 'org_funded') {
          return a.department_position_id == department_position_id;
        }
        if (allocation_type === 'grant' && a.allocation_type === 'grant') {
          return a.position_slot_id == position_slot_id;
        }
        return false;
      })) {
        this.alertMessage = 'This allocation already exists.';
        this.alertClass = 'alert-danger';
        return;
      }

      this.grantAllocations[this.editingIndex] = { ...this.editData };
      console.log('Updated allocation in memory at index:', this.editingIndex);
      this.editingIndex = null;
      this.alertMessage = '';
      this.alertClass = '';
    },

    cancelEdit() {
      console.log('Cancelling edit');
      this.editingIndex = null;
    },

    deleteAllocation(index) {
      console.log('Deleting allocation from memory at index:', index);
      this.grantAllocations.splice(index, 1);
      this.editingIndex = null;
      console.log('Remaining allocations in memory:', this.grantAllocations.length);
    },

    getGrantName(grantId, originalData = null) {
      if (originalData && originalData.grant_name && originalData.grant_code) {
        return `${originalData.grant_name} (${originalData.grant_code})`;
      }

      const grant = this.grantOptions.find(g => g.id == grantId);
      return grant ? `${grant.name} (${grant.code})` : 'Unknown Grant';
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

    getDepartmentPositionName(id) {
      const pos = this.departmentPositions.find(p => p.id == id);
      return pos ? `${pos.department} - ${pos.position}` : 'Unknown Position';
    },

    async openModal(employeeData = null) {
      console.log('Opening modal with employee data:', employeeData);

      // Load basic data in parallel
      await Promise.all([
        this.loadGrantPositions(),
        this.loadEmployees()
      ]);

      const modalEl = document.getElementById("grantPositionModal");
      if (modalEl) {
        const bsModal = new bootstrap.Modal(modalEl);

        if (employeeData && employeeData.employee_id) {
          // Edit mode: Load existing data
          this.isEditMode = true;
          this.formData = {
            id: employeeData.id || null,
            employee_id: employeeData.employee_id,
            startDate: employeeData.startDate || null,
            endDate: employeeData.endDate || null
          };

          // Load existing allocations for this employee
          await this.loadEmployeeAllocations(employeeData.employee_id);

        } else {
          // Add mode: Start fresh
          this.isEditMode = false;
          this.resetForm();
        }

        this.clearValidationErrors();
        bsModal.show();
      }
    },

    async handleSubmit() {
      try {
        console.log('Submitting form with stored allocations...', {
          formData: this.formData,
          grantAllocations: this.grantAllocations,
          totalAllocations: this.grantAllocations.length,
          isEditMode: this.isEditMode
        });

        // Validate main form fields
        if (!this.validateForm()) {
          console.log('Form validation failed');
          return;
        }

        // Validate that at least one allocation exists
        if (this.grantAllocations.length === 0) {
          this.alertMessage = 'Please add at least one grant allocation';
          this.alertClass = 'alert-danger';
          return;
        }

        this.isSubmitting = true;

        // Prepare payload matching the backend API specification
        const payload = {
          start_date: this.formData.startDate,
          end_date: this.formData.endDate,
          allocations: this.grantAllocations.map(allocation => {
            const baseAllocation = {
              level_of_effort: allocation.level_of_effort,
              allocation_type: allocation.allocation_type
            };

            if (allocation.allocation_type === 'org_funded') {
              baseAllocation.department_position_id = allocation.department_position_id;
            } else {
              baseAllocation.position_slot_id = allocation.position_slot_id;
            }

            return baseAllocation;
          })
        };

        console.log('Payload for API:', payload);

        let response;

        if (this.isEditMode && this.formData.employee_id) {
          // Update existing allocations (replace all)
          console.log('🔄 Updating existing allocations for employee:', this.formData.employee_id);
          response = await employeeGrantAllocationService.updateEmployeeGrantAllocations(
            this.formData.employee_id,
            payload
          );
        } else {
          // Create new allocations
          console.log('➕ Creating new allocations for employee:', this.formData.employee_id);
          payload.employee_id = this.formData.employee_id; // Only needed for POST
          response = await employeeGrantAllocationService.createEmployeeGrantAllocation(payload);
        }

        console.log('API Response:', response);

        this.alertMessage = this.isEditMode ? 'Grant Allocations Updated!' : 'Grant Allocations Created!';
        this.alertClass = 'alert-success';

        setTimeout(() => {
          this.alertMessage = '';
          this.resetForm();
          // Close modal
          const modalEl = document.getElementById("grantPositionModal");
          if (modalEl) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) {
              bsModal.hide();
            }
          }
        }, 1800);

        this.$emit('childSubmit', {
          success: true,
          message: this.isEditMode ? 'Grant allocations updated successfully' : 'Grant allocations created successfully',
          data: response.data
        });

      } catch (error) {
        console.error('Error submitting form:', error);

        // Handle specific error cases
        if (error.response?.data?.errors) {
          // Show validation errors from backend
          const errors = error.response.data.errors;
          if (Array.isArray(errors)) {
            this.alertMessage = errors.join(', ');
          } else {
            this.alertMessage = error.response.data.message || 'Validation failed';
          }
        } else {
          this.alertMessage = error.response?.data?.message || 'Failed to save grant allocation';
        }

        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      console.log('Resetting form and clearing memory');
      this.formData = {
        id: null,
        employee_id: null,
        startDate: null,
        endDate: null
      };
      this.currentAllocation = {
        allocation_type: '',
        grant_id: '',
        grant_items_id: '',
        position_slot_id: '',
        department_position_id: '',
        level_of_effort: 100
      };
      this.grantAllocations = []; // Clear memory
      this.selectedEmployeeInfo = null; // Clear employee info
      this.editingIndex = null;
      this.isEditMode = false;
      this.grantPositionOptions = [];
      this.positionSlotOptions = [];
      this.clearValidationErrors();
      console.log('Form reset complete. Memory cleared.');
    },

    // UPDATED METHOD: Load existing allocations for an employee
    async loadEmployeeAllocations(employeeId) {
      try {
        console.log('🔄 Loading existing allocations for employee:', employeeId);
        this.isLoadingData = true;

        const response = await employeeGrantAllocationService.getEmployeeAllocations(employeeId);

        if (response.success && response.data) {
          console.log('📥 Employee allocations response:', response);

          // Store employee info
          this.selectedEmployeeInfo = {
            name: `${response.employee.first_name_en} ${response.employee.last_name_en}`,
            staff_id: response.employee.staff_id,
            total_effort: response.total_effort,
            total_allocations: response.total_allocations
          };

          // Transform API response to match our component's data structure
          const existingAllocations = response.data.map(allocation => {
            // Since the API response is flattened, we need to find the corresponding IDs
            // from our grant structure data

            // Find grant by name and code
            const grant = this.grantOptions.find(g =>
              g.name === allocation.grant_name && g.code === allocation.grant_code
            );

            // Find grant position by name within the grant
            let grantItemsId = null;
            let grantId = grant ? grant.id : null;

            if (grant && this.grantPositions[grant.id]) {
              const position = this.grantPositions[grant.id].find(p =>
                p.name === allocation.grant_position
              );
              grantItemsId = position ? position.id : null;
            }

            // Determine allocation type
            const allocationType = allocation.department_position_id ? 'org_funded' : 'grant';

            return {
              id: allocation.id, // Store the allocation ID for potential updates/deletes
              allocation_type: allocationType,
              grant_id: grantId,
              grant_items_id: grantItemsId,
              position_slot_id: allocation.position_slot_id,
              department_position_id: allocation.department_position_id,
              level_of_effort: Math.round(parseFloat(allocation.level_of_effort)), // Convert to percentage
              // Store original API data for display purposes
              _original: {
                grant_name: allocation.grant_name,
                grant_code: allocation.grant_code,
                grant_position: allocation.grant_position,
                budget_line_code: allocation.budget_line_code,
                slot_number: allocation.position_slot ? allocation.position_slot.slot_number : null,
                start_date: allocation.start_date,
                end_date: allocation.end_date
              }
            };
          });

          console.log('✅ Transformed allocations:', existingAllocations);
          this.grantAllocations = existingAllocations;

        } else {
          console.log('ℹ️ No existing allocations found for employee:', employeeId);
          this.grantAllocations = [];
          this.selectedEmployeeInfo = null;
        }
      } catch (error) {
        console.error('❌ Error loading employee allocations:', error);
        this.alertMessage = 'Failed to load existing allocations';
        this.alertClass = 'alert-warning';
        this.grantAllocations = [];
        this.selectedEmployeeInfo = null;
      } finally {
        this.isLoadingData = false;
      }
    },

    // UPDATED METHOD: Handle employee selection changes
    async onEmployeeChange() {
      if (this.formData.employee_id) {
        console.log('Employee selected:', this.formData.employee_id);
        // Only load allocations if we have grant structure data loaded
        if (this.grantOptions.length > 0) {
          await this.loadEmployeeAllocations(this.formData.employee_id);
        }
      } else {
        // Clear allocations and employee info if no employee is selected
        this.grantAllocations = [];
        this.selectedEmployeeInfo = null;
      }
    },
  }
};
</script>

<style scoped>
/* New Modal Design Styles */
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

/* TreeSelect validation styles */
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
  align-items: center;
  gap: 8px;
  margin: 10px 0 16px 0;
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
}

.badge-grant {
  background: #d9f4ec;
  color: #278d4c;
}
</style>

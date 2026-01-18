<template>
  <div class="modal fade" id="employmentEditModal" tabindex="-1" aria-labelledby="employmentEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content new-modal-design">
        <div class="modal-header-new">
          <h2 class="modal-title-new" id="employmentEditModalLabel" v-once>
            Edit Employment
          </h2>
          <button type="button" class="btn-close-custom" @click="handleModalClose" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body-new">
          <!-- Restored Data Notification -->
          <div v-if="restoredDataNotification.show" class="alert alert-info alert-dismissible fade show mb-3"
            role="alert">
            <i class="ti ti-info-circle me-2"></i>
            Restored your previous unsaved changes from {{ formatRestoredTime(restoredDataNotification.timestamp) }}
            <button type="button" class="btn-close" @click="restoredDataNotification.show = false"></button>
          </div>

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

            <!-- Row 1: Employee (READ-ONLY for edit mode) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Employee :
                </label>
              </div>
              <div class="form-input-col">
                <div class="employee-display-card">
                  <div v-if="selectedEmployeeInfo" class="employee-info">
                    <strong>{{ selectedEmployeeInfo.name }}</strong>
                    <span class="text-muted ms-2">({{ selectedEmployeeInfo.staff_id }})</span>
                    <br>
                    <small class="text-muted">Organization: {{ selectedEmployeeInfo.organization }}</small>
                    <br>
                    <small class="text-muted">Status:
                      <span :class="[
                        'badge badge-sm',
                        selectedEmployeeInfo.status === 'Local ID' || selectedEmployeeInfo.status === 'Local ID Staff' ? 'bg-success' :
                          selectedEmployeeInfo.status === 'Local non ID' || selectedEmployeeInfo.status === 'Local non ID Staff' ? 'bg-primary' :
                            selectedEmployeeInfo.status === 'Expats' ? 'bg-warning' : 'bg-secondary'
                      ]">
                        {{ selectedEmployeeInfo.status }}
                      </span>
                    </small>
                  </div>
                  <div v-else class="text-muted">
                    Loading employee info...
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 2: Employment Type -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Employment Type :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-control input-medium" v-model="formData.employment_type"
                  :class="{ 'is-invalid': validationErrors.employment_type }" required @change="saveFormState"
                  :disabled="isLoadingData">
                  <option disabled value="">Select Type</option>
                  <option v-for="type in employmentTypes" :key="type.id" :value="type.value">
                    {{ type.value }}
                  </option>
                </select>
                <div v-if="validationErrors.employment_type" class="invalid-feedback">
                  {{ validationErrors.employment_type }}
                </div>
              </div>
            </div>

            <!-- Row 3: Pay Method -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Pay Method :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-control input-medium" v-model="formData.pay_method"
                  :class="{ 'is-invalid': validationErrors.pay_method }" @change="saveFormState">
                  <option disabled value="">Select Pay Method</option>
                  <option v-for="method in payMethods" :key="method.id" :value="method.value">
                    {{ method.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 4: Department -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Department :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-control input-medium" v-model="formData.department_id"
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
            </div>

            <!-- Row 5: Position -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Position :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-control input-medium" v-model="formData.position_id"
                  :class="{ 'is-invalid': validationErrors.position_id }" required @change="saveFormState"
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

            <!-- Row 6: Site -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Site :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-control input-medium" v-model="formData.site_id"
                  :class="{ 'is-invalid': validationErrors.site_id }" required @change="saveFormState">
                  <option disabled value="">Select Site</option>
                  <option v-for="location in workLocations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </option>
                </select>
                <div v-if="validationErrors.site_id" class="invalid-feedback">
                  {{ validationErrors.site_id }}
                </div>
              </div>
            </div>

            <!-- Row 7: Section/Department -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Section/Department :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-control input-medium" v-model="formData.section_department" @change="saveFormState">
                  <option disabled value="">Select Section</option>
                  <option v-for="section in sectionDepartments" :key="section.id" :value="section.value">
                    {{ section.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 8: Start Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Start Date :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker v-model="computedStartDate" class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                      :class="{ 'is-invalid': validationErrors.start_date }"
                      :disabled="isLoadingData" />
                    <span class="input-icon-addon"><i class="ti ti-calendar text-gray-7"></i></span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the employment start date" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors.start_date" class="invalid-feedback d-block">
                  {{ validationErrors.start_date }}
                </div>
              </div>
            </div>

            <!-- Row 9: End Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  End Date :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker v-model="computedEndDate" class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                      :disabled="isLoadingData" />
                    <span class="input-icon-addon"><i class="ti ti-calendar text-gray-7"></i></span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the employment end date (optional)" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 10: Probation Pass Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Probation Pass Date :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker v-model="computedProbationPassDate" class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                      :disabled="isLoadingData" />
                    <span class="input-icon-addon"><i class="ti ti-calendar text-gray-7"></i></span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the date when probation period was passed" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 11: Employment Status -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Status :
                </label>
              </div>
              <div class="form-input-col">
                <div class="employment-status-container">
                  <div class="status-switch-wrapper">
                    <a-switch v-model:checked="formData.status" checked-children="Active" un-checked-children="Inactive"
                      @change="onStatusChange" />
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
            </div>

            <!-- Row 12: Probation Salary -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Probation Salary :
                </label>
              </div>
              <div class="form-input-col">
                <input type="number" class="form-control input-medium" v-model="formData.probation_salary"
                  :class="{ 'is-invalid': validationErrors.probation_salary }" required @input="saveFormState"
                  placeholder="Enter probation salary" min="0" step="0.01" :disabled="isLoadingData" />
                <div v-if="validationErrors.probation_salary" class="invalid-feedback">
                  {{ validationErrors.probation_salary }}
                </div>
              </div>
            </div>

            <!-- Row 13: Pass Probation Salary -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Pass Probation Salary :
                </label>
              </div>
              <div class="form-input-col">
                <input type="number" class="form-control input-medium" v-model="formData.pass_probation_salary"
                  :class="{ 'is-invalid': validationErrors.pass_probation_salary }" required @input="saveFormState"
                  placeholder="Enter pass probation salary" min="0" step="0.01" :disabled="isLoadingData" />
                <div v-if="validationErrors.pass_probation_salary" class="invalid-feedback">
                  {{ validationErrors.pass_probation_salary }}
                </div>
              </div>
            </div>

            <!-- Row 14: Benefits Section -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Benefits :
                </label>
              </div>
              <div class="form-input-col">
                <div class="benefits-container">
                  <div class="benefit-item">
                    <label class="checkbox-item">
                      <input type="checkbox" v-model="formData.health_welfare" @change="saveFormState" />
                      <span class="checkmark"></span>
                      Health & Welfare
                    </label>
                  </div>
                  <div class="benefit-item">
                    <label class="checkbox-item">
                      <input type="checkbox" v-model="formData.saving_fund" @change="saveFormState" />
                      <span class="checkmark"></span>
                      Saving Fund
                    </label>
                  </div>
                  <div class="benefit-item">
                    <label class="checkbox-item">
                      <input type="checkbox" v-model="formData.pvd" @change="saveFormState" />
                      <span class="checkmark"></span>
                      PVD
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Employment Save Section -->
            <div class="section-save-row">
              <div class="section-status">
                <span v-if="isEmploymentSaved" class="status-indicator status-saved">
                  <i class="ti ti-circle-check"></i>
                  {{ employmentSaveMessage || 'Employment updated successfully' }}
                </span>
                <span v-else class="status-indicator status-pending">
                  <i class="ti ti-info-circle"></i>
                  Update employment details
                </span>
              </div>
              <button type="button" class="btn btn-section-save" @click="handleUpdateEmployment"
                :disabled="isSubmittingEmployment">
                <span v-if="isSubmittingEmployment">
                  <i class="ti ti-loader spinner-icon"></i> Saving...
                </span>
                <span v-else-if="isEmploymentSaved">
                  <i class="ti ti-check"></i> Saved
                </span>
                <span v-else>
                  <i class="ti ti-device-floppy"></i> Save Employment
                </span>
              </button>
            </div>

            <!-- Funding Allocations Section -->
            <div class="form-section funding-allocation-section">
              <div class="section-header-with-status">
                <label class="section-title">Funding Allocations</label>
                <span v-if="fundingAllocations.length > 0" class="badge badge-info">
                  {{ fundingAllocations.length }} allocation(s) | FTE: {{ totalFte }}%
                </span>
              </div>

              <!-- Existing Allocations Table -->
              <div v-if="fundingAllocations.length > 0" class="allocations-table-wrapper">
                <table class="allocations-table">
                  <thead>
                    <tr>
                      <th>Grant</th>
                      <th>Budget Line</th>
                      <th>Position</th>
                      <th>FTE (%)</th>
                      <th>Allocated Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(allocation, index) in fundingAllocations" :key="allocation.id || index">
                      <td>{{ allocation.grant_name || 'N/A' }}</td>
                      <td>{{ allocation.budget_line_code || 'N/A' }}</td>
                      <td>{{ allocation.position_name || 'N/A' }}</td>
                      <td>{{ allocation.fte }}%</td>
                      <td>{{ formatCurrency(allocation.allocated_amount) }}</td>
                      <td>
                        <button type="button" class="btn btn-sm btn-outline-primary me-1"
                          @click="editAllocation(index)" :disabled="editingIndex !== null">
                          <i class="ti ti-edit"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger"
                          @click="deleteAllocation(index)">
                          <i class="ti ti-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="total-row">
                      <td colspan="3"><strong>Total</strong></td>
                      <td><strong :class="{ 'text-danger': totalFte !== 100, 'text-success': totalFte === 100 }">
                          {{ totalFte }}%
                        </strong></td>
                      <td colspan="2"><strong>{{ formatCurrency(totalAllocatedSalary) }}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- No Allocations Message -->
              <div v-else class="no-allocations-msg">
                <p class="text-muted text-center">No funding allocations. Click "Add Allocation" to add one.</p>
              </div>

              <!-- Add New Allocation Form -->
              <div v-if="showAddAllocationForm" class="add-allocation-form">
                <h6 class="mb-3">Add New Allocation</h6>
                <div class="date-row">
                  <div class="form-group">
                    <small class="text-muted">Grant</small>
                    <select v-model="currentAllocation.grant_id" @change="onGrantChange" class="form-control"
                      :class="{ 'is-invalid': allocationErrors.grant_id }">
                      <option value="">Select grant</option>
                      <option v-for="grant in grantOptions" :key="grant.id" :value="grant.id">
                        {{ grant.project_name || grant.name }} ({{ grant.grant_code || grant.code }})
                      </option>
                    </select>
                    <div v-if="allocationErrors.grant_id" class="invalid-feedback">
                      {{ allocationErrors.grant_id }}
                    </div>
                  </div>
                  <div class="form-group">
                    <small class="text-muted">Grant Position (Budget Line)</small>
                    <select v-model="currentAllocation.grant_item_id" class="form-control"
                      :class="{ 'is-invalid': allocationErrors.grant_item_id }"
                      :disabled="!currentAllocation.grant_id || grantPositionOptions.length === 0">
                      <option value="">{{ grantPositionOptions.length === 0 ? 'Select grant first' : 'Select position'
                        }}</option>
                      <option v-for="item in grantPositionOptions" :key="item.id" :value="item.id">
                        {{ item.budget_line_code }} - {{ item.position?.name || 'N/A' }}
                      </option>
                    </select>
                    <div v-if="allocationErrors.grant_item_id" class="invalid-feedback">
                      {{ allocationErrors.grant_item_id }}
                    </div>
                  </div>
                </div>
                <div class="date-row">
                  <div class="form-group">
                    <small class="text-muted">FTE (%)</small>
                    <input type="number" class="form-control" v-model.number="currentAllocation.fte"
                      :class="{ 'is-invalid': allocationErrors.fte }" min="1" max="100" placeholder="e.g., 100">
                    <div v-if="allocationErrors.fte" class="invalid-feedback">
                      {{ allocationErrors.fte }}
                    </div>
                  </div>
                  <div class="form-group">
                    <small class="text-muted">Preview Amount</small>
                    <div class="form-control-plaintext">
                      <span v-if="calculating" class="text-muted">
                        <i class="ti ti-loader spinner-icon"></i> Calculating...
                      </span>
                      <span v-else-if="formattedAmount">
                        {{ formattedAmount }}
                        <small class="text-muted">({{ salaryTypeLabel }})</small>
                      </span>
                      <span v-else class="text-muted">Enter FTE to calculate</span>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-end gap-2 mt-3">
                  <button type="button" class="btn btn-secondary" @click="cancelAddAllocation">
                    Cancel
                  </button>
                  <button type="button" class="btn btn-primary" @click="addAllocation" :disabled="calculating">
                    <i class="ti ti-plus"></i> Add Allocation
                  </button>
                </div>
              </div>

              <!-- Add Allocation Button -->
              <button v-if="!showAddAllocationForm && editingIndex === null" type="button"
                class="btn btn-outline-primary btn-sm mt-2" @click="showAddAllocationForm = true">
                <i class="ti ti-plus"></i> Add Allocation
              </button>

              <!-- Allocation Save Section -->
              <div class="section-save-row mt-3" v-if="fundingAllocations.length > 0">
                <div class="section-status">
                  <span v-if="isAllocationsSaved" class="status-indicator status-saved">
                    <i class="ti ti-circle-check"></i>
                    Allocations saved successfully
                  </span>
                  <span v-else-if="totalFte === 100" class="status-indicator status-ready">
                    <i class="ti ti-info-circle"></i>
                    Ready to save (FTE: {{ totalFte }}%)
                  </span>
                  <span v-else class="status-indicator status-warning">
                    <i class="ti ti-alert-triangle"></i>
                    FTE must equal 100% (Current: {{ totalFte }}%)
                  </span>
                </div>
                <button type="button" class="btn btn-section-save" @click="handleSaveAllocationsOnly"
                  :disabled="isSubmittingAllocations || totalFte !== 100">
                  <span v-if="isSubmittingAllocations">
                    <i class="ti ti-loader spinner-icon"></i> Saving...
                  </span>
                  <span v-else-if="isAllocationsSaved">
                    <i class="ti ti-check"></i> Saved
                  </span>
                  <span v-else>
                    <i class="ti ti-device-floppy"></i> Save Allocations
                  </span>
                </button>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer-actions">
              <div class="progress-summary">
                <span v-if="isEmploymentSaved && (isAllocationsSaved || fundingAllocations.length === 0)"
                  class="progress-complete">
                  <i class="ti ti-circle-check"></i> All changes saved
                </span>
                <span v-else-if="isEmploymentSaved" class="progress-partial">
                  <i class="ti ti-progress"></i> Employment saved. Save allocations to complete.
                </span>
                <span v-else class="progress-pending">
                  <i class="ti ti-info-circle"></i> Make changes and save to update employment.
                </span>
              </div>

              <div class="btn-row">
                <button type="button" class="btn btn-cancel" @click="handleModalClose">
                  <i class="ti ti-x"></i> {{ isEmploymentSaved ? 'Close' : 'Cancel' }}
                </button>

                <!-- Complete Button -->
                <button v-if="isEmploymentSaved && (isAllocationsSaved || fundingAllocations.length === 0)"
                  type="button" class="btn btn-success" @click="handleModalClose">
                  <i class="ti ti-check"></i> Complete
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Employment Edit Modal Component (Refactored with Composables)
 * 
 * This modal handles editing existing employment records with funding allocations.
 * It uses composables for state management, following the same pattern as the create modal.
 * 
 * Key differences from create modal:
 * - Employee selection is READ-ONLY (displays existing employee)
 * - Loads existing employment data on open
 * - Uses UPDATE API instead of CREATE
 * - Uses separate draft key to avoid conflicts
 * 
 * Composables Used:
 * - useEmploymentForm: Form state, validation, date utilities (edit mode)
 * - useDraftPersistence: Auto-save and restore draft functionality
 * - useAllocationManager: Funding allocation CRUD operations
 * - useModalLifecycle: Bootstrap Modal integration
 */
import { ref, computed, watch, shallowRef, markRaw, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { employmentService } from '@/services/employment.service';
import { useLookupStore } from '@/stores/lookupStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { PerformanceCleanup } from '@/utils/performance.js';

// Import composables
import { useEmploymentForm } from '@/composables/useEmploymentForm';
import { useDraftPersistence } from '@/composables/useDraftPersistence';
import { useAllocationManager } from '@/composables/useAllocationManager';
import { useModalLifecycle } from '@/composables/useModalLifecycle';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'bootstrap';

export default {
  name: 'EmploymentEditModal',

  components: {
    InfoCircleOutlined
  },

  emits: ['employment-updated', 'allocations-saved', 'modal-closed'],

  setup(props, { emit }) {
    // ============================================
    // PERFORMANCE CLEANUP MANAGER
    // ============================================
    const cleanup = new PerformanceCleanup();

    // ============================================
    // DATA LOADING STATE
    // ============================================
    const dataLoaded = ref(false);
    const isLoadingData = ref(false);
    const dateFormat = "dd/MM/yyyy";
    
    // Employment data from parent (set via setEmploymentData)
    const employmentData = ref(null);

    // ============================================
    // DATA SOURCES (Lookup Data)
    // ============================================
    const departments = shallowRef([]);
    const positions = shallowRef([]);
    const workLocations = shallowRef([]);
    const employmentTypes = shallowRef([]);
    const sectionDepartments = shallowRef([]);
    const grantOptions = shallowRef([]);
    const grantPositions = shallowRef({});
    const payMethods = markRaw([
      { id: 1, value: 'Transferred to bank' },
      { id: 2, value: 'Cash cheque' }
    ]);
    const positionsLoading = ref(false);
    
    // Add allocation form visibility
    const showAddAllocationForm = ref(false);

    // ============================================
    // INITIALIZE COMPOSABLES (Edit Mode)
    // ============================================

    // 1. Employment Form Composable (Edit Mode)
    const employmentForm = useEmploymentForm({
      mode: 'edit',
      onFormChange: () => draftPersistence.debouncedSaveState(),
      onEmploymentUpdated: (data) => emit('employment-updated', data),
      onError: (error) => console.error('Employment form error:', error)
    });

    // 2. Allocation Manager Composable
    const allocationManager = useAllocationManager({
      formData: employmentForm.formData,
      onFormChange: () => draftPersistence.debouncedSaveState(),
      onAllocationsSaved: (data) => emit('allocations-saved', data),
      onError: (error) => console.error('Allocation error:', error)
    });

    // 3. Draft Persistence Composable (with unique key for edit mode)
    const draftPersistence = useDraftPersistence({
      formData: employmentForm.formData,
      fundingAllocations: allocationManager.fundingAllocations,
      currentAllocation: allocationManager.currentAllocation,
      selectedEmployeeInfo: employmentForm.selectedEmployeeInfo,
      safeConvertToDate: employmentForm.safeConvertToDate,
      draftKey: 'employment-edit-modal-draft'  // Separate key for edit mode
    });

    // 4. Modal Lifecycle Composable
    const modalLifecycle = useModalLifecycle({
      modalId: 'employmentEditModal',
      hasUnsavedChanges: () => draftPersistence.hasUnsavedChanges.value && draftPersistence.isDraftMode.value,
      onDiscardChanges: () => {
        draftPersistence.clearFormDraft();
        resetForm();
      },
      onAfterClose: () => emit('modal-closed'),
      cleanup
    });

    // ============================================
    // COMPUTED PROPERTIES
    // ============================================

    const computedStartDate = computed({
      get: () => employmentForm.formData.start_date,
      set: (value) => {
        employmentForm.formData.start_date = employmentForm.safeConvertToDate(value);
        draftPersistence.debouncedSaveState();
      }
    });

    const computedEndDate = computed({
      get: () => employmentForm.formData.end_date,
      set: (value) => {
        employmentForm.formData.end_date = employmentForm.safeConvertToDate(value);
        draftPersistence.debouncedSaveState();
      }
    });

    const computedProbationPassDate = computed({
      get: () => employmentForm.formData.pass_probation_date,
      set: (value) => {
        employmentForm.formData.pass_probation_date = employmentForm.safeConvertToDate(value);
        draftPersistence.debouncedSaveState();
      }
    });

    // ============================================
    // WATCHERS
    // ============================================

    // Watch employment type changes for benefit auto-selection
    watch(() => employmentForm.formData.employment_type, (newVal, oldVal) => {
      if (newVal !== oldVal && draftPersistence.isComponentReady.value) {
        employmentForm.autoSelectBenefitsBasedOnType(newVal);
        draftPersistence.debouncedSaveState();
      }
    });

    // Watch salary changes
    watch(() => employmentForm.formData.pass_probation_salary, () => {
      if (draftPersistence.isComponentReady.value) {
        draftPersistence.debouncedSaveState();
      }
    });

    watch(() => employmentForm.formData.probation_salary, () => {
      if (draftPersistence.isComponentReady.value) {
        draftPersistence.debouncedSaveState();
      }
    });

    // ============================================
    // DATA LOADING METHODS
    // ============================================

    async function loadDropdownData() {
      try {
        console.log('📥 Loading edit modal dropdown data...');
        const sharedStore = useSharedDataStore();
        const lookupStore = useLookupStore();

        await Promise.all([
          sharedStore.loadAllDropdownData({
            includeDepartments: true,
            includePositions: true,
            includeWorkLocations: true,
            includeGrantStructure: true,
            force: false
          }),
          sharedStore.fetchGrantStructure(true)
        ]);

        // Copy data from shared store
        departments.value = sharedStore.getDepartments;
        positions.value = sharedStore.getPositions;
        workLocations.value = sharedStore.getWorkLocations;
        grantOptions.value = sharedStore.getGrantOptions;
        grantPositions.value = sharedStore.getGrantPositions;

        // Load lookups
        const [types, sections] = await Promise.all([
          lookupStore.fetchLookupsByType('employment_type'),
          lookupStore.fetchLookupsByType('section_department')
        ]);

        employmentTypes.value = types || [];
        sectionDepartments.value = sections || [];

        dataLoaded.value = true;
        console.log('✅ Dropdown data loaded');
      } catch (error) {
        console.error('Error loading dropdown data:', error);
      }
    }

    async function loadEmploymentData(data) {
      if (!data) {
        return;
      }

      console.log('📥 Loading employment data for editing:', data.id);

      try {
        // Use the composable's loadEmployment method
        await employmentForm.loadEmployment(data);

        // Load positions for selected department
        if (data.department_id) {
          await loadPositionsForDepartment(data.department_id);
        }

        // Load existing allocations
        if (data.id) {
          await allocationManager.loadAllocations(data.id);
        }

        console.log('✅ Employment data loaded successfully');
      } catch (error) {
        console.error('Error loading employment data:', error);
        employmentForm.alertMessage.value = 'Failed to load employment data';
        employmentForm.alertClass.value = 'alert-danger';
      }
    }

    async function loadPositionsForDepartment(departmentId) {
      if (!departmentId) {
        positions.value = [];
        return;
      }

      try {
        positionsLoading.value = true;
        const sharedStore = useSharedDataStore();
        const positionData = await sharedStore.fetchPositionsByDepartment(departmentId);
        positions.value = Array.isArray(positionData) ? positionData : (positionData?.data || []);
      } catch (error) {
        console.error('Error loading positions:', error);
        positions.value = [];
      } finally {
        positionsLoading.value = false;
      }
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================

    async function onDepartmentChange() {
      const deptId = employmentForm.formData.department_id;
      employmentForm.formData.position_id = '';
      await loadPositionsForDepartment(deptId);
      draftPersistence.debouncedSaveState();
    }

    function onStatusChange(checked) {
      console.log('Status changed to:', checked ? 'Active' : 'Inactive');
      draftPersistence.debouncedSaveState();
    }

    async function onGrantChange() {
      const grantId = allocationManager.currentAllocation.grant_id;
      allocationManager.currentAllocation.grant_item_id = '';
      
      if (grantId && grantPositions.value[grantId]) {
        allocationManager.grantPositionOptions.value = grantPositions.value[grantId];
      } else {
        allocationManager.grantPositionOptions.value = [];
      }
    }

    function cancelAddAllocation() {
      showAddAllocationForm.value = false;
      allocationManager.resetCurrentAllocation();
    }

    // ============================================
    // FORM SUBMISSION
    // ============================================

    async function handleUpdateEmployment() {
      // Build payload with allocations if they exist
      const empId = employmentForm.editEmploymentId.value || employmentForm.savedEmploymentId.value || employmentForm.formData.employment_id;
      
      if (!empId) {
        employmentForm.alertMessage.value = 'No employment ID found for update';
        employmentForm.alertClass.value = 'alert-danger';
        return;
      }

      // Check if allocations should be included
      const hasAllocations = allocationManager.fundingAllocations.value.length > 0;
      const totalFte = allocationManager.totalFte.value;
      
      if (hasAllocations && totalFte === 100) {
        // Update employment with allocations in one request
        // Build base payload manually since buildEmploymentOnlyPayload is not exposed
        const basePayload = {
          employee_id: employmentForm.formData.employee_id,
          employment_type: employmentForm.formData.employment_type,
          pay_method: employmentForm.formData.pay_method || null,
          pass_probation_date: employmentForm.formatDateForAPI(employmentForm.formData.pass_probation_date),
          start_date: employmentForm.formatDateForAPI(employmentForm.formData.start_date),
          end_date: employmentForm.formatDateForAPI(employmentForm.formData.end_date),
          department_id: employmentForm.formData.department_id || null,
          position_id: employmentForm.formData.position_id || null,
          section_department: employmentForm.formData.section_department || null,
          site_id: employmentForm.formData.site_id || null,
          pass_probation_salary: employmentForm.formData.pass_probation_salary,
          probation_salary: employmentForm.formData.probation_salary || null,
          status: !!employmentForm.formData.status,
          health_welfare: !!employmentForm.formData.health_welfare,
          pvd: !!employmentForm.formData.pvd,
          saving_fund: !!employmentForm.formData.saving_fund
        };
        
        const payload = {
          ...basePayload,
          allocations: allocationManager.fundingAllocations.value.map(allocation => ({
            allocation_type: 'grant',
            grant_item_id: allocation.grant_item_id || allocation.grant_items_id || '',
            fte: allocation.fte
          }))
        };

        try {
          employmentForm.isSubmittingEmployment.value = true;
          employmentForm.alertMessage.value = '';
          
          const response = await employmentService.updateEmployment(empId, payload);
          
          if (!response.success) {
            throw new Error(response.message || 'Update failed');
          }

          employmentForm.savedEmploymentId.value = empId;
          employmentForm.isEmploymentSaved.value = true;
          allocationManager.isAllocationsSaved.value = true;
          
          employmentForm.employmentSaveMessage.value = response.message || 'Employment and allocations updated successfully';
          employmentForm.alertMessage.value = employmentForm.employmentSaveMessage.value;
          employmentForm.alertClass.value = 'alert-success';
          
          draftPersistence.markAsSaved();
          
          emit('employment-updated', {
            success: true,
            message: employmentForm.employmentSaveMessage.value,
            employmentId: empId,
            data: response.data
          });
        } catch (error) {
          console.error('Error updating employment with allocations:', error);
          employmentForm.handleApiError(error);
        } finally {
          employmentForm.isSubmittingEmployment.value = false;
        }
      } else {
        // Update employment only (no allocations or FTE not 100%)
        const result = await employmentForm.handleUpdateEmployment();
        if (result) {
          draftPersistence.markAsSaved();
        }
      }
    }

    async function handleSaveAllocationsOnly() {
      // Use employment ID from loaded data
      const empId = employmentForm.editEmploymentId.value || employmentForm.savedEmploymentId.value;
      
      if (!empId) {
        allocationManager.alertMessage.value = 'Employment must be saved first';
        allocationManager.alertClass.value = 'alert-danger';
        return;
      }

      await allocationManager.handleSaveAllocationsOnly(
        employmentForm.formData.employee_id,
        empId,
        employmentForm.formatDateForAPI(employmentForm.formData.start_date),
        employmentForm.formatDateForAPI(employmentForm.formData.end_date)
      );
    }

    function handleSubmit() {
      // Form submit is handled by section buttons
      // This prevents default form submission
    }

    // ============================================
    // MODAL MANAGEMENT
    // ============================================

    function resetForm() {
      employmentForm.resetForm();
      allocationManager.clearAllocations();
      showAddAllocationForm.value = false;
    }

    async function openModal() {
      console.log('🔵 EmploymentEditModal.openModal() called');
      
      // Clear all previous messages, validation errors, and saved states
      employmentForm.clearValidationErrors();
      employmentForm.alertMessage.value = '';
      employmentForm.alertClass.value = '';
      employmentForm.employmentSaveMessage.value = '';
      employmentForm.isEmploymentSaved.value = false;
      allocationManager.isAllocationsSaved.value = false;
      
      modalLifecycle.isModalVisible.value = true;

      isLoadingData.value = true;

      try {
        // Load dropdown data if not loaded
        if (!dataLoaded.value) {
          await loadDropdownData();
        }

        // Check for draft to restore
        const hasDraft = draftPersistence.loadFormDraft();

        if (!hasDraft) {
          // If no draft, load employment data
          if (employmentData.value) {
            await loadEmploymentData(employmentData.value);
          }
          draftPersistence.enableDraftMode();
          draftPersistence.hasUnsavedChanges.value = false;
        } else {
          draftPersistence.enableDraftMode();
          // If draft exists but employment data wasn't loaded, load it
          if (employmentData.value && !employmentForm.formData.employment_id) {
            await loadEmploymentData(employmentData.value);
          }
        }

        // Show the modal
        modalLifecycle.openModal();
      } catch (error) {
        console.error('Error opening modal:', error);
        employmentForm.alertMessage.value = 'Failed to load data';
        employmentForm.alertClass.value = 'alert-danger';
      } finally {
        isLoadingData.value = false;
      }
    }

    function handleModalClose() {
      modalLifecycle.handleModalClose();
    }

    function setEmploymentData(data) {
      console.log('📋 Setting employment data:', data);
      employmentData.value = data;
    }

    // ============================================
    // LIFECYCLE
    // ============================================

    // Initialize Bootstrap tooltips
    function initializeTooltips() {
      nextTick(() => {
        const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipElements.forEach(element => {
          // Check if tooltip is already initialized
          if (!element._tooltip) {
            new Tooltip(element);
          }
        });
      });
    }

    onMounted(() => {
      console.log('EmploymentEditModal mounted');
      
      // Initialize modal lifecycle
      modalLifecycle.initializeModal();
      
      // Initialize tooltips
      initializeTooltips();
      
      // Reinitialize tooltips when modal is shown
      const modalElement = document.getElementById('employmentEditModal');
      if (modalElement) {
        modalElement.addEventListener('shown.bs.modal', () => {
          initializeTooltips();
        });
      }
    });

    onBeforeUnmount(() => {
      console.log('EmploymentEditModal unmounting');
      draftPersistence.cleanup();
      cleanup.cleanup();
      modalLifecycle.destroy();
    });

    // ============================================
    // EXPOSE PUBLIC API
    // ============================================

    return {
      // Loading state
      isLoadingData,
      dataLoaded,
      dateFormat,

      // Form data from composable
      formData: employmentForm.formData,
      selectedEmployeeInfo: employmentForm.selectedEmployeeInfo,
      validationErrors: employmentForm.validationErrors,
      alertMessage: employmentForm.alertMessage,
      alertClass: employmentForm.alertClass,
      isSubmittingEmployment: employmentForm.isSubmittingEmployment,
      isEmploymentSaved: employmentForm.isEmploymentSaved,
      employmentSaveMessage: employmentForm.employmentSaveMessage,

      // Allocation state from composable
      fundingAllocations: allocationManager.fundingAllocations,
      currentAllocation: allocationManager.currentAllocation,
      allocationErrors: allocationManager.allocationErrors,
      editingIndex: allocationManager.editingIndex,
      isSubmittingAllocations: allocationManager.isSubmittingAllocations,
      isAllocationsSaved: allocationManager.isAllocationsSaved,
      totalFte: allocationManager.totalFte,
      totalAllocatedSalary: allocationManager.totalAllocatedSalary,
      grantPositionOptions: allocationManager.grantPositionOptions,
      calculating: allocationManager.calculating,
      formattedAmount: allocationManager.formattedAmount,
      salaryTypeLabel: allocationManager.salaryTypeLabel,

      // Draft persistence
      restoredDataNotification: draftPersistence.restoredDataNotification,
      formatRestoredTime: draftPersistence.formatRestoredTime,
      saveFormState: draftPersistence.debouncedSaveState,

      // Dropdown data
      departments,
      positions,
      positionsLoading,
      workLocations,
      employmentTypes,
      sectionDepartments,
      grantOptions,
      payMethods,
      showAddAllocationForm,

      // Computed dates
      computedStartDate,
      computedEndDate,
      computedProbationPassDate,

      // Event handlers
      onDepartmentChange,
      onStatusChange,
      onGrantChange,
      cancelAddAllocation,

      // Allocation methods
      addAllocation: allocationManager.addAllocation,
      editAllocation: allocationManager.editAllocation,
      deleteAllocation: allocationManager.deleteAllocation,
      formatCurrency: allocationManager.formatCurrency,

      // Form submission
      handleUpdateEmployment,
      handleSaveAllocationsOnly,
      handleSubmit,

      // Modal management
      openModal,
      handleModalClose,
      setEmploymentData,
      resetForm,
      initializeTooltips
    };
  }
};
</script>

<style scoped>
/* Modal Design */
.new-modal-design {
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
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

/* Form Layout */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  color: #495057;
}

.form-label.required::after {
  content: ' *';
  color: #dc3545;
}

.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Employee Display Card */
.employee-display-card {
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.employee-info {
  line-height: 1.6;
}

/* Section Save Row */
.section-save-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fc;
  border-radius: 8px;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
}

.section-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9em;
}

.status-saved {
  color: #28a745;
}

.status-ready {
  color: #17a2b8;
}

.status-warning {
  color: #ffc107;
}

.status-pending {
  color: #6c757d;
}

.btn-section-save {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-section-save:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-section-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Benefits Container */
.benefits-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
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

/* No Allocations Message */
.no-allocations-msg {
  padding: 20px;
  text-align: center;
}

/* Modal Footer */
.modal-footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  margin-top: 24px;
}

.progress-summary {
  font-size: 0.9em;
}

.progress-complete {
  color: #28a745;
}

.progress-partial {
  color: #17a2b8;
}

.progress-pending {
  color: #6c757d;
}

.btn-row {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #5a6268;
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
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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

/* Horizontal Form Layout Styles */
.modal-dialog {
  max-width: 1200px;
}

.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.form-label-col {
  flex: 0 0 180px;
  min-width: 180px;
  padding-top: 8px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.form-input-col {
  flex: 1;
  min-width: 0;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0;
  text-align: right;
  color: #262626;
  font-size: 14px;
}

.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.input-short {
  width: 200px;
  max-width: 200px;
}

.input-medium {
  width: 400px;
  max-width: 400px;
}

.input-short-wrapper {
  width: 200px;
  max-width: 200px;
  flex: 1;
}

.tooltip-icon {
  pointer-events: auto;
  z-index: 1;
  margin-left: 0;
  margin-top: 0;
}

.form-control,
.form-select {
  width: 100%;
}

.form-select.input-short,
.form-select.input-medium {
  width: 200px;
  max-width: 200px;
}

.form-select.input-medium {
  width: 400px;
  max-width: 400px;
}

/* Date picker styling */
:deep(.datetimepicker) {
  width: 100%;
}

:deep(.datetimepicker.input-short) {
  width: 200px;
  max-width: 200px;
}

/* Employment Status Container */
.employment-status-container {
  padding: 14px 18px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.employment-status-container:hover {
  border-color: #d0d7de;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
  transition: color 0.3s ease;
  min-width: 70px;
}

.status-label.status-active {
  color: #52c41a;
}

.status-label.status-inactive {
  color: #8c8c8c;
}

.status-hint {
  display: block;
  font-size: 0.85em;
  line-height: 1.4;
  margin-top: 8px;
}

.status-hint .ti {
  vertical-align: middle;
  margin-right: 4px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }

  .form-label-col {
    flex: 1;
    min-width: 100%;
    padding-top: 0;
    justify-content: flex-start;
  }

  .form-label {
    text-align: left;
  }

  .input-short,
  .input-medium,
  .input-short-wrapper,
  .input-with-tooltip,
  .form-select.input-short,
  .form-select.input-medium {
    width: 100%;
    max-width: 100%;
  }
}
</style>

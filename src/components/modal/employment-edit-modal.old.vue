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
            <div class="form-group">
              <label class="form-label">Employee</label>
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

            <!-- Row 2: Pay Method -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label">Pay Method</label>
                <select class="form-control" v-model="formData.pay_method"
                  :class="{ 'is-invalid': validationErrors.pay_method }" @change="saveFormState">
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

            <!-- Row 4: Site + Section Department -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Site</label>
                <select class="form-control" v-model="formData.site_id"
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

              <div class="form-group">
                <label class="form-label">Section/Department</label>
                <select class="form-control" v-model="formData.section_department" @change="saveFormState">
                  <option disabled value="">Select Section</option>
                  <option v-for="section in sectionDepartments" :key="section.id" :value="section.value">
                    {{ section.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 5: Start Date + End Date -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Start Date</label>
                <div class="input-icon-end">
                  <VueDatePicker v-model="computedStartDate" :format="dateFormat" :enable-time-picker="false"
                    auto-apply placeholder="Select start date" :class="{ 'is-invalid': validationErrors.start_date }"
                    :disabled="isLoadingData" />
                  <span class="input-icon-addon"><i class="ti ti-calendar"></i></span>
                </div>
                <div v-if="validationErrors.start_date" class="invalid-feedback d-block">
                  {{ validationErrors.start_date }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">End Date</label>
                <div class="input-icon-end">
                  <VueDatePicker v-model="computedEndDate" :format="dateFormat" :enable-time-picker="false"
                    auto-apply placeholder="Select end date" :disabled="isLoadingData" />
                  <span class="input-icon-addon"><i class="ti ti-calendar"></i></span>
                </div>
              </div>
            </div>

            <!-- Row 6: Pass Probation Date -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label">Probation Pass Date</label>
                <div class="input-icon-end">
                  <VueDatePicker v-model="computedProbationPassDate" :format="dateFormat" :enable-time-picker="false"
                    auto-apply placeholder="Select probation pass date" :disabled="isLoadingData" />
                  <span class="input-icon-addon"><i class="ti ti-calendar"></i></span>
                </div>
              </div>
              <div class="form-group d-flex align-items-center">
                <label class="form-label mb-0 me-3">Status</label>
                <a-switch v-model:checked="formData.status" checked-children="Active" un-checked-children="Inactive"
                  @change="onStatusChange" />
              </div>
            </div>

            <!-- Salary Section -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Probation Salary</label>
                <input type="number" class="form-control" v-model="formData.probation_salary"
                  :class="{ 'is-invalid': validationErrors.probation_salary }" required @input="saveFormState"
                  placeholder="Enter probation salary" min="0" step="0.01" :disabled="isLoadingData" />
                <div v-if="validationErrors.probation_salary" class="invalid-feedback">
                  {{ validationErrors.probation_salary }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label required">Pass Probation Salary</label>
                <input type="number" class="form-control" v-model="formData.pass_probation_salary"
                  :class="{ 'is-invalid': validationErrors.pass_probation_salary }" required @input="saveFormState"
                  placeholder="Enter pass probation salary" min="0" step="0.01" :disabled="isLoadingData" />
                <div v-if="validationErrors.pass_probation_salary" class="invalid-feedback">
                  {{ validationErrors.pass_probation_salary }}
                </div>
              </div>
            </div>

            <!-- Benefits Section -->
            <div class="form-group">
              <label class="form-label">Benefits</label>
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

            <!-- Modal Footer Actions -->
            <div class="modal-footer-actions">
              <div class="btn-row">
                <button type="button" class="btn btn-cancel" @click="handleModalClose">
                  <i class="ti ti-x"></i> Cancel
                </button>

                <button
                  type="button"
                  class="btn btn-primary"
                  @click="handleSaveAndClose"
                  :disabled="isSubmittingEmployment || isLoadingData">
                  <span v-if="isSubmittingEmployment">
                    <i class="ti ti-loader spinner-icon"></i> Saving...
                  </span>
                  <span v-else>
                    <i class="ti ti-device-floppy"></i> Save Changes
                  </span>
                </button>
              </div>
              <p class="text-muted mt-2" style="font-size: 0.85em;">
                <i class="ti ti-info-circle"></i>
                After saving, expand the employment row to manage funding allocations.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Employment Edit Modal Component (Simplified)
 *
 * This modal handles editing existing employment records.
 * Funding allocations are now managed separately via expandable rows
 * in the employment list using EmployeeFundingAllocationPanel.
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
import { useModalLifecycle } from '@/composables/useModalLifecycle';

export default {
  name: 'EmploymentEditModal',

  emits: ['employment-updated', 'modal-closed'],

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
    const sectionDepartments = shallowRef([]);
    const payMethods = markRaw([
      { id: 1, value: 'Transferred to bank' },
      { id: 2, value: 'Cash cheque' }
    ]);
    const positionsLoading = ref(false);

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

    // 2. Draft Persistence Composable (with unique key for edit mode)
    const draftPersistence = useDraftPersistence({
      formData: employmentForm.formData,
      fundingAllocations: ref([]), // No longer managing allocations in this modal
      currentAllocation: ref({}),
      selectedEmployeeInfo: employmentForm.selectedEmployeeInfo,
      safeConvertToDate: employmentForm.safeConvertToDate,
      draftKey: 'employment-edit-modal-draft'  // Separate key for edit mode
    });

    // 3. Modal Lifecycle Composable
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
          })
        ]);

        // Copy data from shared store
        departments.value = sharedStore.getDepartments;
        positions.value = sharedStore.getPositions;
        workLocations.value = sharedStore.getWorkLocations;

        // Load lookups
        const sections = await lookupStore.fetchLookupsByType('section_department');

        sectionDepartments.value = sections || [];

        dataLoaded.value = true;
        console.log('✅ Dropdown data loaded');
      } catch (error) {
        console.error('Error loading dropdown data:', error);
      }
    }

    async function loadEmploymentData(data) {
      if (!data) return;

      console.log('📥 Loading employment data for editing:', data.id);

      try {
        // Use the composable's loadEmployment method
        await employmentForm.loadEmployment(data);

        // Load positions for selected department
        if (data.department_id) {
          await loadPositionsForDepartment(data.department_id);
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

    // ============================================
    // FORM SUBMISSION
    // ============================================

    /**
     * Save employment changes and close the modal.
     * After saving, users can expand the employment row to manage allocations.
     */
    async function handleSaveAndClose() {
      const result = await employmentForm.handleUpdateEmployment();
      if (result) {
        draftPersistence.markAsSaved();
        draftPersistence.clearFormDraft();
        // Close the modal after successful save
        modalLifecycle.handleModalClose();
      }
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
    }

    async function openModal() {
      console.log('🔵 EmploymentEditModal.openModal() called');
      isLoadingData.value = true;

      await nextTick();

      try {
        // Load dropdown data if not loaded
        if (!dataLoaded.value) {
          await loadDropdownData();
        }

        // Load employment data
        if (employmentData.value) {
          await loadEmploymentData(employmentData.value);
        }

        // Check for draft to restore
        draftPersistence.loadFormDraft();
        draftPersistence.initialize();

        // Show the modal
        modalLifecycle.show();
      } catch (error) {
        console.error('Error opening modal:', error);
        employmentForm.alertMessage.value = 'Failed to load data';
        employmentForm.alertClass.value = 'alert-danger';
      } finally {
        isLoadingData.value = false;
      }
    }

    function handleModalClose() {
      modalLifecycle.close();
    }

    function setEmploymentData(data) {
      console.log('📋 Setting employment data:', data);
      employmentData.value = data;
    }

    // ============================================
    // LIFECYCLE
    // ============================================

    onMounted(() => {
      console.log('EmploymentEditModal mounted');
    });

    onBeforeUnmount(() => {
      console.log('EmploymentEditModal unmounting');
      draftPersistence.cleanup();
      cleanup.cleanup();
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

      // Draft persistence
      restoredDataNotification: draftPersistence.restoredDataNotification,
      formatRestoredTime: draftPersistence.formatRestoredTime,
      saveFormState: draftPersistence.debouncedSaveState,

      // Dropdown data
      departments,
      positions,
      positionsLoading,
      workLocations,
      sectionDepartments,
      payMethods,

      // Computed dates
      computedStartDate,
      computedEndDate,
      computedProbationPassDate,

      // Event handlers
      onDepartmentChange,
      onStatusChange,

      // Form submission
      handleSaveAndClose,
      handleSubmit,

      // Modal management
      openModal,
      handleModalClose,
      setEmploymentData,
      resetForm
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
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
}

.modal-title-new {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.btn-close-custom {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-close-custom:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-close-custom i {
  color: white;
  font-size: 1.1rem;
}

.modal-body-new {
  padding: 24px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
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
</style>

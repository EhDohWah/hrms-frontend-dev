<template>
  <div class="modal fade" id="employmentModal" tabindex="-1" aria-labelledby="employmentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content new-modal-design">
        <div class="modal-header">
          <h2 class="modal-title" id="employmentModalLabel" v-once>
            Add Employment
          </h2>
          <button type="button" class="btn-close-custom" @click="handleModalClose" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body">
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
            <div v-if="!dataLoaded">
              Loading form data for the first time...
            </div>
            <div v-else>
              Loading employment data...
            </div>
          </div>

          <form @submit.prevent ref="mainForm" :class="{ 'form-loading': isLoadingData && !dataLoaded }">
            <div v-if="alertMessage && alertClass === 'alert-success'" class="success-msg">
              {{ alertMessage }}
            </div>

            <div v-if="alertMessage && alertClass === 'alert-danger'" class="error-msg">
              {{ alertMessage }}
            </div>

            <!-- Row 1: Employee (full width) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Employee :
                </label>
              </div>
              <div class="form-input-col">
                <EmployeeTreeSelect
                  v-model="formData.employee_id"
                  :tree-data="employeeTreeData"
                  :display-value="selectedEmployeeDisplay"
                  :has-error="!!validationErrors.employee_id"
                  :error-message="validationErrors.employee_id"
                  placeholder="Select employee"
                  search-placeholder="Search employees..."
                  @select="handleEmployeeSelect"
                />
              </div>
            </div>

            <div v-if="selectedEmployeeInfo" class="employee-info-card mb-3" style="margin-top: 12px;">
              <div class="card-body">
                <h6 class="card-title">Selected Employee</h6>
                <p class="card-text">
                  <strong>{{ selectedEmployeeInfo.name }}</strong><br>
                  <small class="text-muted">Organization: {{ selectedEmployeeInfo.organization }}</small><br>
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
                </p>
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
                  <option disabled value="">{{ isLoadingData ? 'Loading types...' : 'Select Type' }}</option>
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
                <div v-if="validationErrors.pay_method" class="invalid-feedback">
                  {{ validationErrors.pay_method }}
                </div>
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
                  <option disabled value="">{{ isLoadingData ? 'Loading departments...' : 'Select Department' }}
                  </option>
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
                  <option disabled value="">{{ positionsLoading ? 'Loading positions...' : 'Select Position' }}</option>
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

            <!-- Row 7: Section Department -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Section Department :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-control input-medium" v-model="formData.section_department"
                  :class="{ 'is-invalid': validationErrors.section_department }" @change="saveFormState"
                  :disabled="isLoadingData">
                  <option disabled value="">{{ isLoadingData ? 'Loading sections...' : 'Select Section Department' }}
                  </option>
                  <option v-for="section in sectionDepartments" :key="section.id" :value="section.value">
                    {{ section.value }}
                  </option>
                </select>
                <div v-if="validationErrors.section_department" class="invalid-feedback">
                  {{ validationErrors.section_department }}
                </div>
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
                    <date-picker v-if="isModalVisible && dataLoaded" class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                      v-model="computedStartDate" :class="{ 'is-invalid': validationErrors.start_date }"
                      @update:model-value="handleStartDateChange" required />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the employment start date" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors.start_date" class="invalid-feedback">
                  {{ validationErrors.start_date }}
                </div>
              </div>
            </div>

            <!-- Row 9: Pass Probation Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Pass Probation Date :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker v-if="isModalVisible && dataLoaded" class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                      v-model="computedProbationPassDate" :class="{ 'is-invalid': validationErrors.pass_probation_date }"
                      @update:model-value="handleProbationDateChange" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Auto-calculated as start date + 3 months if not provided" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors.pass_probation_date" class="invalid-feedback">
                  {{ validationErrors.pass_probation_date }}
                </div>
              </div>
            </div>

            <!-- Row 10: Probation Salary -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Probation Salary :
                </label>
              </div>
              <div class="form-input-col">
                <input type="number" class="form-control input-medium" v-model.number.lazy="formData.probation_salary"
                  :class="{ 'is-invalid': validationErrors.probation_salary }" @blur="debouncedSaveState"
                  placeholder="Salary during probation period">
                <div v-if="validationErrors.probation_salary" class="invalid-feedback">
                  {{ validationErrors.probation_salary }}
                </div>
                <small class="text-muted" style="display: block; margin-top: 4px; font-size: 0.85em;">
                  Optional - Leave empty if same as pass probation salary
                </small>
              </div>
            </div>

            <!-- Row 11: Pass Probation Salary -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Pass Probation Salary :
                </label>
              </div>
              <div class="form-input-col">
                <input type="number" class="form-control input-medium" v-model.number.lazy="formData.pass_probation_salary"
                  :class="{ 'is-invalid': validationErrors.pass_probation_salary }" required @blur="debouncedSaveState"
                  placeholder="Regular salary after probation">
                <div v-if="validationErrors.pass_probation_salary" class="invalid-feedback">
                  {{ validationErrors.pass_probation_salary }}
                </div>
                <small class="text-muted" style="display: block; margin-top: 4px; font-size: 0.85em;">
                  Used for funding allocation calculations
                </small>
              </div>
            </div>

            <!-- Row 12: Employment Status -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Employment Status :
                </label>
              </div>
              <div class="form-input-col">
                <div class="employment-status-container">
                  <div class="status-switch-wrapper">
                    <a-switch v-model:checked="formData.status" @change="onStatusChange" checked-children="Active"
                      un-checked-children="Inactive" size="default" />
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

            <!-- Row 13: Benefits Section -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Benefits :
                </label>
              </div>
              <div class="form-input-col">
                <div class="benefits-container">
                  <!-- Health & Welfare -->
                  <div class="benefit-item">
                    <label class="checkbox-item">
                      <input type="checkbox" v-model="formData.health_welfare" @change="saveFormState" />
                      <span class="checkmark"></span>
                      Health & Welfare
                    </label>
                    <small class="text-muted" style="display: block; margin-left: 28px; margin-top: 4px; font-size: 0.85em;">
                      Percentage is managed globally in Benefit Settings
                    </small>
                  </div>
                  <!-- Saving Fund -->
                  <div class="benefit-item">
                    <label class="checkbox-item">
                      <input type="checkbox" v-model="formData.saving_fund" @change="saveFormState" />
                      <span class="checkmark"></span>
                      Saving Fund
                    </label>
                    <small class="text-muted" style="display: block; margin-left: 28px; margin-top: 4px; font-size: 0.85em;">
                      Percentage is managed globally in Benefit Settings
                    </small>
                  </div>
                  <!-- PVD -->
                  <div class="benefit-item">
                    <label class="checkbox-item">
                      <input type="checkbox" v-model="formData.pvd" @change="saveFormState" />
                      <span class="checkmark"></span>
                      PVD
                    </label>
                    <small class="text-muted" style="display: block; margin-left: 28px; margin-top: 4px; font-size: 0.85em;">
                      Percentage is managed globally in Benefit Settings
                    </small>
                  </div>
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
                    <i class="ti ti-device-floppy"></i> Save Employment
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
 * Employment Modal Component (Simplified)
 *
 * This modal handles employment creation only.
 * Funding allocations are now managed separately via expandable rows
 * in the employment list using EmployeeFundingAllocationPanel.
 *
 * Composables Used:
 * - useEmploymentForm: Form state, validation, date utilities
 * - useDraftPersistence: Auto-save and restore draft functionality
 * - useEmployeeSelector: Hierarchical employee selection
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
import { useEmployeeSelector } from '@/composables/useEmployeeSelector';
import { useModalLifecycle } from '@/composables/useModalLifecycle';

// Import child components
import EmployeeTreeSelect from '@/components/shared/EmployeeTreeSelect.vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'bootstrap';

export default {
  name: 'EmploymentModal',
  
  components: {
    EmployeeTreeSelect,
    InfoCircleOutlined
  },
  
  emits: ['employment-added', 'modal-closed'],
  
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
    const isSubmitting = ref(false);
    const isVisible = ref(true);
    const dateFormat = "dd/MM/yyyy";
    
    // ============================================
    // DATA SOURCES (Lookup Data)
    // ============================================
    const employeeTreeData = shallowRef([]);
    const departments = shallowRef([]);
    const positions = shallowRef([]);
    const workLocations = shallowRef([]);
    const employmentTypes = shallowRef([]);
    const sectionDepartments = shallowRef([]);
    const payMethods = markRaw([
      { id: 1, value: 'Transferred to bank' },
      { id: 2, value: 'Cash cheque' }
    ]);
    const positionsLoading = ref(false);

    // ============================================
    // INITIALIZE COMPOSABLES
    // ============================================
    
    // 1. Employment Form Composable
    const employmentForm = useEmploymentForm({
      onFormChange: () => draftPersistence.debouncedSaveState(),
      onEmploymentSaved: (data) => {
        // Emit employment-added when saved successfully
        emit('employment-added', {
          success: true,
          message: 'Employment created successfully',
          data: { employment_id: data.id || employmentForm.savedEmploymentId.value }
        });
      },
      onError: (error) => console.error('Employment form error:', error)
    });

    // 2. Employee Selector Composable
    const employeeSelector = useEmployeeSelector({
      employeeTreeData,
      onSelect: (employee) => {
        employmentForm.formData.employee_id = employee.value;
        employmentForm.onEmployeeChange();
      },
      onFormChange: () => draftPersistence.debouncedSaveState()
    });
    
    // 3. Draft Persistence Composable
    const draftPersistence = useDraftPersistence({
      formData: employmentForm.formData,
      fundingAllocations: ref([]), // No longer managing allocations in this modal
      currentAllocation: ref({}),
      selectedEmployeeInfo: employmentForm.selectedEmployeeInfo,
      safeConvertToDate: employmentForm.safeConvertToDate,
      onGrantChange: () => {},
      onEmployeeChange: () => employmentForm.onEmployeeChange()
    });
    
    // 4. Modal Lifecycle Composable
    const modalLifecycle = useModalLifecycle({
      modalId: 'employmentModal',
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
    
    // Computed date properties for v-model binding
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
    
    // Watch salary changes to clear calculation cache
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
    
    async function loadInitialData() {
      isLoadingData.value = true;

      try {
        console.log('📥 Loading employment modal data using shared store...');
        const sharedStore = useSharedDataStore();

        await Promise.all([
          sharedStore.loadAllDropdownData({
            includeEmployees: true,
            includeDepartments: true,
            includePositions: true,
            includeWorkLocations: true,
            includeGrantStructure: false, // Grant structure no longer needed in this modal
            force: false
          }),
          initFetchLookups()
        ]);

        // Copy data from shared store
        employeeTreeData.value = sharedStore.getEmployeeTreeData;
        departments.value = sharedStore.getDepartments;
        positions.value = sharedStore.getPositions;
        workLocations.value = sharedStore.getWorkLocations;

        console.log('✅ Employment modal data loaded');
      } catch (error) {
        console.error('❌ Error loading employment modal data:', error);
        employmentForm.alertMessage.value = error.error || error.message || 'Failed to load form data';
        employmentForm.alertClass.value = 'alert-danger';
      } finally {
        isLoadingData.value = false;
      }
    }
    
    async function initFetchLookups() {
      try {
        const lookupStore = useLookupStore();

        if (!lookupStore.lookups.length) {
          await lookupStore.fetchAllLookupLists();
        }

        employmentTypes.value = lookupStore.getLookupsByType('employment_type');
        sectionDepartments.value = lookupStore.getLookupsByType('section_department');

        // Fallback if data not loaded
        if (employmentTypes.value.length === 0 && lookupStore.lookupsByType.employment_type) {
          employmentTypes.value = lookupStore.lookupsByType.employment_type;
        }
        if (sectionDepartments.value.length === 0 && lookupStore.lookupsByType.section_department) {
          sectionDepartments.value = lookupStore.lookupsByType.section_department;
        }
      } catch (error) {
        console.error('❌ Error loading lookups:', error);
      }
    }
    
    async function onDepartmentChange() {
      try {
        employmentForm.formData.position_id = '';
        positions.value = [];
        positionsLoading.value = true;
        draftPersistence.debouncedSaveState();

        if (!employmentForm.formData.department_id) return;

        const sharedStore = useSharedDataStore();
        const positionsData = await sharedStore.fetchPositions(true, { 
          department_id: employmentForm.formData.department_id 
        });
        positions.value = Array.isArray(positionsData) ? positionsData : (positionsData?.data || []);
      } catch (error) {
        console.error('Error loading positions:', error);
        positions.value = [];
      } finally {
        positionsLoading.value = false;
        draftPersistence.debouncedSaveState();
      }
    }

    // ============================================
    // EMPLOYEE SELECTION HANDLER
    // ============================================
    
    function handleEmployeeSelect(employee) {
      employmentForm.formData.employee_id = employee.value;
      employeeSelector.setDisplayText(employee.title);
      employmentForm.onEmployeeChange();
      draftPersistence.debouncedSaveState();
    }

    // ============================================
    // MODAL OPEN/CLOSE
    // ============================================
    
    async function openModal() {
      employmentForm.clearValidationErrors();
      modalLifecycle.isModalVisible.value = true;

      if (!dataLoaded.value) {
        console.log('📥 Loading modal data for first time...');
        await loadInitialData();
        dataLoaded.value = true;
      }

      const hasDraft = draftPersistence.loadFormDraft();

      if (!hasDraft) {
        resetForm();
        draftPersistence.enableDraftMode();
        draftPersistence.hasUnsavedChanges.value = false;
      } else {
        draftPersistence.enableDraftMode();
        // Restore selected employee display
        if (employmentForm.selectedEmployeeInfo.value) {
          employeeSelector.setDisplayText(employmentForm.selectedEmployeeInfo.value.name);
        }
      }

      modalLifecycle.openModal();
    }
    
    function handleModalClose() {
      modalLifecycle.handleModalClose();
    }

    // ============================================
    // FORM SUBMISSION
    // ============================================

    /**
     * Save employment and close the modal.
     * After saving, users can expand the employment row to add allocations.
     */
    async function handleSaveAndClose() {
      const result = await employmentForm.handleSaveEmploymentOnly();
      if (result) {
        draftPersistence.hasUnsavedChanges.value = false;
        draftPersistence.clearFormDraft();
        // Close the modal after successful save
        modalLifecycle.handleModalClose();
      }
    }

    // ============================================
    // FORM RESET
    // ============================================
    
    function resetForm() {
      console.log('Resetting form and clearing memory');

      employmentForm.resetForm();
      employeeSelector.reset();

      draftPersistence.isDraftMode.value = false;
      draftPersistence.hasUnsavedChanges.value = false;
      draftPersistence.restoredDataNotification.value.show = false;

      draftPersistence.clearFormDraft();
      console.log('Form reset complete.');
    }

    // ============================================
    // LIFECYCLE HOOKS
    // ============================================
    
    onMounted(() => {
      modalLifecycle.initializeModal();
      cleanup.addListener(document, 'click', employeeSelector.handleClickOutside);
      setupPerformanceMonitoring();
      draftPersistence.initialize();
      
      // Initialize tooltips
      initializeTooltips();
      
      // Reinitialize tooltips when modal is shown
      const modalElement = document.getElementById('employmentModal');
      if (modalElement) {
        modalElement.addEventListener('shown.bs.modal', () => {
          initializeTooltips();
        });
      }
    });
    
    onBeforeUnmount(() => {
      draftPersistence.cleanup();
      employeeSelector.cleanup();
      cleanup.cleanup();
      modalLifecycle.destroy();
    });
    
    function setupPerformanceMonitoring() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isVisible.value = entry.isIntersecting;
          });
        }, { threshold: 0.1 });

        const modalElement = document.getElementById('employmentModal');
        if (modalElement) {
          observer.observe(modalElement);
          cleanup.addObserver(observer);
        }
      }
    }

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

    // ============================================
    // EXPOSE TO TEMPLATE
    // ============================================
    
    return {
      // Data loading
      dataLoaded,
      isLoadingData,
      isSubmitting,
      isVisible,
      dateFormat,
      
      // Lookup data
      employeeTreeData,
      departments,
      positions,
      workLocations,
      employmentTypes,
      sectionDepartments,
      payMethods,
      positionsLoading,
      
      // From employmentForm composable
      formData: employmentForm.formData,
      selectedEmployeeInfo: employmentForm.selectedEmployeeInfo,
      validationErrors: employmentForm.validationErrors,
      alertMessage: employmentForm.alertMessage,
      alertClass: employmentForm.alertClass,
      isSubmittingEmployment: employmentForm.isSubmittingEmployment,
      isEmploymentSaved: employmentForm.isEmploymentSaved,
      savedEmploymentId: employmentForm.savedEmploymentId,
      employmentSaveMessage: employmentForm.employmentSaveMessage,
      showAllocationReminder: employmentForm.showAllocationReminder,
      isLocalIDStaff: employmentForm.isLocalIDStaff,
      isLocalNonIDStaff: employmentForm.isLocalNonIDStaff,
      handleStartDateChange: employmentForm.handleStartDateChange,
      handleEndDateChange: employmentForm.handleEndDateChange,
      handleProbationDateChange: employmentForm.handleProbationDateChange,
      onStatusChange: employmentForm.onStatusChange,
      onEmployeeChange: employmentForm.onEmployeeChange,
      formatDateForAPI: employmentForm.formatDateForAPI,
      
      // From employeeSelector composable
      showEmployeeDropdown: employeeSelector.showEmployeeDropdown,
      employeeSearchTerm: employeeSelector.employeeSearchTerm,
      filteredEmployeeTree: employeeSelector.filteredEmployeeTree,
      selectedEmployeeDisplay: employeeSelector.selectedEmployeeDisplay,
      toggleEmployeeDropdown: employeeSelector.toggleEmployeeDropdown,
      toggleOrganization: employeeSelector.toggleOrganization,
      selectEmployee: employeeSelector.selectEmployee,
      filterEmployees: employeeSelector.filterEmployees,
      getVisibleEmployees: employeeSelector.getVisibleEmployees,
      hasMoreEmployees: employeeSelector.hasMoreEmployees,
      loadMoreEmployees: employeeSelector.loadMoreEmployees,
      handleDropdownScroll: employeeSelector.handleDropdownScroll,
      
      // From draftPersistence composable
      isDraftMode: draftPersistence.isDraftMode,
      hasUnsavedChanges: draftPersistence.hasUnsavedChanges,
      restoredDataNotification: draftPersistence.restoredDataNotification,
      saveFormState: draftPersistence.saveFormState,
      debouncedSaveState: draftPersistence.debouncedSaveState,
      formatRestoredTime: draftPersistence.formatRestoredTime,
      
      // From modalLifecycle composable
      isModalVisible: modalLifecycle.isModalVisible,
      
      // Computed dates
      computedStartDate,
      computedEndDate,
      computedProbationPassDate,
      
      // Local methods
      loadInitialData,
      onDepartmentChange,
      handleEmployeeSelect,
      openModal,
      handleModalClose,
      handleSaveAndClose,
      resetForm,
      initializeTooltips
    };
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
  margin-bottom: 20px;
}

.form-group label,
.form-label {
  display: block;
  margin-bottom: 8px;
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
  gap: 16px;
}

.date-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-weight: 500;
  color: #1d2636;
}

.btn-row {
  text-align: right;
  margin-top: 24px;
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
  margin-bottom: 20px;
  padding: 10px 14px;
  background: #f0f9f4;
  border: 1px solid #d4edda;
  border-radius: 6px;
}

.error-msg {
  text-align: center;
  color: #e53e3e;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 10px 14px;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
}

.allocation-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.allocation-table th,
.allocation-table td {
  border: 1px solid #e5eaf0;
  padding: 10px 12px;
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

/* New styles for total summary */
.total-summary {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.summary-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.summary-label {
  font-size: 0.85em;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 1em;
  color: #495057;
  font-weight: 600;
}

.summary-value.text-danger {
  color: #e53e3e !important;
}

/* Responsive adjustments for small screens */
@media (max-width: 768px) {
  .total-summary {
    flex-direction: column;
    gap: 8px;
  }

  .summary-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

/* Restored data notification styling (matching employee-details-modal) */
.alert {
  margin-bottom: 15px;
}

.alert-dismissible .btn-close {
  padding: 0.5rem;
}

/* Highlight restored data notification */
.alert-info {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #004085;
}

/* Add transition for notifications */
.fade {
  transition: opacity 0.15s linear;
}

.fade.show {
  opacity: 1;
}

/* Custom styles for Ant Design confirm dialogs */
:deep(.ant-modal-confirm .ant-modal-body) {
  padding: 24px 24px 16px 24px;
}

:deep(.ant-modal-confirm .ant-modal-confirm-title) {
  font-weight: 600;
  font-size: 16px;
  color: #262626;
}

:deep(.ant-modal-confirm .ant-modal-confirm-content) {
  margin-top: 8px;
  font-size: 14px;
  color: #595959;
}

:deep(.ant-modal-confirm .ant-btn) {
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 6px;
}

:deep(.ant-modal-confirm .ant-btn-primary) {
  background: #1890ff;
  border-color: #1890ff;
}

:deep(.ant-modal-confirm .ant-btn-danger) {
  background: #ff4d4f;
  border-color: #ff4d4f;
}

/* New styles for reorganized form sections */
.employee-tax-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafbfc;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.funding-allocation-section {
  border-top: 2px solid #e9ecef;
  padding-top: 20px;
}

/* Section-based Save Row Styles */
.section-save-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
  border: 1px solid #e9ecef;
  border-radius: 8px;
  gap: 16px;
}

.section-status {
  flex: 1;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  padding: 6px 12px;
  border-radius: 6px;
}

.status-indicator.status-saved {
  color: #28a745;
  background: rgba(40, 167, 69, 0.1);
}

.status-indicator.status-pending {
  color: #6c757d;
  background: rgba(108, 117, 125, 0.1);
}

.status-indicator.status-ready {
  color: #17a2b8;
  background: rgba(23, 162, 184, 0.1);
}

.status-indicator.status-warning {
  color: #f57c00;
  background: rgba(255, 193, 7, 0.1);
}

.btn-section-save {
  min-width: 150px;
  padding: 8px 20px;
  font-size: 0.9em;
  font-weight: 500;
  border-radius: 6px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-section-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  transform: translateY(-1px);
}

.btn-section-save:disabled {
  background: #d9d9d9;
  color: #8c8c8c;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-section-save .spinner-icon {
  animation: spin 1s linear infinite;
}

/* Section Disabled Overlay */
.section-disabled {
  position: relative;
  opacity: 0.7;
  pointer-events: none;
}

.section-disabled-overlay {
  background: rgba(248, 249, 250, 0.9);
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  margin-top: 16px;
}

.disabled-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #6c757d;
  font-size: 0.95em;
}

.disabled-message i {
  font-size: 1.2em;
}

/* Section Header with Status Badge */
.section-header-with-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-status-badge {
  font-size: 0.75em;
  padding: 4px 10px;
  border-radius: 12px;
}

/* Employment Settings Section */
.employment-settings-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px dashed #e9ecef;
}

/* Modal Footer Actions */
.modal-footer-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
}

.progress-summary {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-complete {
  color: #28a745;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-partial {
  color: #17a2b8;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-pending {
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-footer-actions .btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Enhanced Prerequisites Warning UI */
.allocation-prerequisites-warning {
  background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%);
  border: 2px solid #ffc107;
  border-radius: 10px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.15);
}

.allocation-prerequisites-warning .warning-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: rgba(255, 193, 7, 0.15);
  border-bottom: 1px solid rgba(255, 193, 7, 0.3);
}

.allocation-prerequisites-warning .warning-header i {
  font-size: 1.3em;
  color: #f57c00;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

.allocation-prerequisites-warning .warning-header strong {
  font-size: 1em;
  color: #f57c00;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.allocation-prerequisites-warning .warning-content {
  padding: 16px 18px;
}

.allocation-prerequisites-warning .warning-description {
  margin: 0 0 12px 0;
  color: #856404;
  font-size: 0.9em;
  font-weight: 500;
}

.allocation-prerequisites-warning .prerequisites-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.allocation-prerequisites-warning .prerequisite-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #ffc107;
  transition: all 0.2s ease;
}

.allocation-prerequisites-warning .prerequisite-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 6px rgba(255, 193, 7, 0.2);
}

.allocation-prerequisites-warning .prerequisite-item i {
  font-size: 1.1em;
  color: #ff6f00;
  min-width: 20px;
}

.allocation-prerequisites-warning .prerequisite-item span {
  color: #5d4037;
  font-size: 0.9em;
  font-weight: 500;
}

.allocation-prerequisites-warning .warning-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 6px;
}

.allocation-prerequisites-warning .warning-footer i {
  font-size: 0.95em;
  color: #ff8f00;
}

.allocation-prerequisites-warning .warning-footer span {
  color: #6c5400;
  font-size: 0.85em;
  font-style: italic;
  line-height: 1.4;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 12px 0 12px 0;
}

.checkbox-item {
  min-width: 140px;
}

/* Benefits container with percentage inputs */
.benefits-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0;
}

.benefit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: background-color 0.15s ease;
}

.benefit-item:hover {
  background: #f1f3f5;
}

.benefit-percentage-group {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 100px;
}

.benefit-percentage-input {
  width: 80px;
  padding: 4px 8px;
  font-size: 0.9em;
  text-align: right;
}

.benefit-percentage-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #e9ecef;
}

.percentage-symbol {
  font-weight: 500;
  color: #6c757d;
  font-size: 0.9em;
}

/* Employment Status with Ant Design Switch */
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

/* Ant Design Switch customization */
.employment-status-container .ant-switch {
  min-width: 60px;
  height: 26px;
}

.employment-status-container .ant-switch-checked {
  background-color: #52c41a;
}

.employment-status-container .ant-switch-inner {
  font-size: 12px;
  font-weight: 500;
}

/* Status badge styles */
.badge.badge-sm {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

/* Loading state styles */
.form-loading {
  position: relative;
  opacity: 0.7;
  pointer-events: none;
}

.form-loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
  border-radius: 6px;
}

/* Enhanced loading messages */
.text-center {
  position: relative;
  z-index: 20;
}

/* Loading spinner improvements */
.spinner-border-sm {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 0.15em;
}

/* Loading text styling */
.text-center div {
  margin-top: 8px;
  color: #6c757d;
  font-size: 0.9em;
  font-weight: 500;
}

/* Custom Tree Select Styles */
.custom-tree-select {
  position: relative;
  width: 100%;
}

.tree-select-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  min-height: 38px;
  padding: 7px 12px;
}

.tree-select-input:hover {
  border-color: #4a7fff;
}

.selected-text {
  color: #1d2636;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.placeholder-text {
  color: #6c757d;
  font-style: italic;
}

.dropdown-icon {
  margin-left: 8px;
  transition: transform 0.2s ease;
  color: #6c757d;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.tree-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #c9d2e2;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  max-height: 400px;
  overflow: hidden;
  margin-top: 2px;
}

.dropdown-header {
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.search-input {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.9em;
}

.search-input:focus {
  border-color: #4a7fff;
  box-shadow: 0 0 0 0.2rem rgba(74, 127, 255, 0.25);
  outline: none;
}

.dropdown-body {
  max-height: 320px;
  overflow-y: auto;
  padding: 8px 0;
}

.organization-group {
  margin-bottom: 4px;
}

.organization-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  color: #495057;
  transition: background-color 0.15s ease;
}

.organization-header:hover {
  background: #e9ecef;
}

.organization-header i {
  margin-right: 8px;
  font-size: 0.8em;
  transition: transform 0.15s ease;
}

.organization-name {
  flex: 1;
}

.employee-count {
  color: #6c757d;
  font-size: 0.85em;
  font-weight: 400;
}

.employees-list {
  background: white;
}

.employee-item {
  display: flex;
  flex-direction: column;
  padding: 10px 24px;
  cursor: pointer;
  border-bottom: 1px solid #f1f3f4;
  transition: background-color 0.15s ease;
}

.employee-item:hover {
  background: #f8f9fa;
}

.employee-item.selected {
  background: #e3f2fd;
  border-left: 3px solid #4a7fff;
}

.employee-name {
  font-weight: 500;
  color: #1d2636;
  margin-bottom: 2px;
}

.employee-info {
  color: #6c757d;
  font-size: 0.8em;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6c757d;
  text-align: center;
}

.no-results i {
  font-size: 2em;
  margin-bottom: 8px;
  opacity: 0.5;
}

/* Custom scrollbar for dropdown */
.dropdown-body::-webkit-scrollbar {
  width: 6px;
}

.dropdown-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dropdown-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dropdown-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Load More Button Styling */
.load-more-button {
  padding: 8px 16px;
  text-align: center;
  border-top: 1px solid #f1f3f4;
}

.btn-load-more {
  background: none;
  border: 1px solid #e9ecef;
  color: #6c757d;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-load-more:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #495057;
}

/* Performance optimization classes */
.virtual-scroll-container {
  contain: layout style paint;
}

.employee-item {
  contain: layout style;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tree-dropdown {
    max-height: 300px;
  }

  .dropdown-body {
    max-height: 220px;
  }

  .employee-item {
    padding: 8px 16px;
  }

  .organization-header {
    padding: 6px 12px;
  }
}

/* Spinner animation for calculating state */
@keyframes spin {
  from {
    transform: translateY(-50%) rotate(0deg);
  }

  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

/* Calculated salary wrapper - maintains alignment */
.calculated-amount-wrapper {
  position: relative;
  height: 38px;
  /* Match other input heights */
}

/* Make Calculated Salary field wider in the allocation row */
.date-row .form-group:has(.calculated-amount-wrapper) {
  flex: 1.4;
  /* Wider than other fields (default is 1) */
}

/* Make Add button container smaller */
.date-row .form-group:has(.btn-save) {
  flex: 0 0 auto;
  min-width: 60px !important;
  /* Reduced from 72px */
}

.calculated-salary-input {
  width: 100%;
  height: 38px;
  padding-right: 35px !important;
  /* Space for icon */
  transition: background-color 0.3s ease;
  font-weight: 500;
}

/* Background states for calculated salary */
.calculated-salary-input.calculating-bg {
  background-color: #fff3cd !important;
  color: #856404;
}

.calculated-salary-input.calculated-bg {
  background-color: #e8f5e9 !important;
  color: #2e7d32;
}

.calculated-salary-input.default-bg {
  background-color: #f7f8fa !important;
  color: #6c757d;
}

/* Icon positioning - aligned to right */
.spinner-icon,
.checkmark-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}

.spinner-icon {
  color: #ffc107;
  font-size: 1.1em;
  animation: spin 1s linear infinite;
}

.checkmark-icon {
  color: #28a745;
  font-size: 1.2em;
}

/* Badge styles for salary type indicator */
.badge-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.badge-sm {
  font-size: 0.65em;
  padding: 2px 5px;
  border-radius: 3px;
  font-weight: 500;
  line-height: 1.2;
}

/* Formula text styling - below input, doesn't affect alignment */
.formula-text {
  display: block;
  margin-top: 4px;
  font-size: 0.75em;
  color: #6c757d;
  line-height: 1.3;
  font-style: italic;
}

.position-relative {
  position: relative;
}

/* ============================================
   DECOUPLED WORKFLOW STYLES
   Styles for the two-step employment + allocation flow
   ============================================ */

/* Section header with status badge */
.section-header-with-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.section-header-with-status label {
  margin-bottom: 0;
}

.section-status-badge {
  font-size: 0.75em;
  padding: 4px 10px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.section-status-badge i {
  font-size: 0.9em;
}

/* Employment saved indicator */
.employment-saved-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border: 1px solid #28a745;
  border-radius: 8px;
  color: #155724;
  font-weight: 500;
  margin-bottom: 16px;
}

.employment-saved-indicator i {
  color: #28a745;
  font-size: 1.2em;
}

/* Allocation reminder warning */
.allocation-reminder {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.allocation-reminder i {
  font-size: 1.1em;
}

/* Warning when employment not saved */
.allocation-employment-warning {
  background: linear-gradient(135deg, #e7f3ff 0%, #d1e7ff 100%);
  border: 1px solid #1890ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.allocation-employment-warning .warning-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #1890ff;
}

.allocation-employment-warning .warning-content {
  color: #444;
}

.allocation-employment-warning .warning-description {
  margin: 0;
  font-size: 0.9em;
  line-height: 1.5;
}

/* Submit section styling */
.submit-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

/* Button styling for allocations save */
.btn-save-allocations {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border-color: #52c41a;
}

.btn-save-allocations:hover {
  background: linear-gradient(135deg, #389e0d 0%, #237804 100%);
  border-color: #389e0d;
}

.btn-save-allocations:disabled {
  background: #d9d9d9;
  border-color: #d9d9d9;
  cursor: not-allowed;
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  border-color: #28a745;
  color: white;
}

.btn-success:hover {
  background: linear-gradient(135deg, #1e7e34 0%, #155724 100%);
}

/* FTE warning in button */
.fte-warning {
  display: block;
  font-size: 0.75em;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}

/* Spinner icon animation in buttons */
.btn .spinner-icon {
  animation: spin 1s linear infinite;
  margin-right: 4px;
}

/* Badge variations */
.badge-secondary {
  background-color: #f0f0f0;
  color: #666;
  border: 1px solid #d9d9d9;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
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


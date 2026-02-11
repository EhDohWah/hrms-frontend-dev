<script>
/**
 * Travel Request Modal Component (Unified Add/Edit)
 *
 * Migrated from Bootstrap to Ant Design Vue.
 * This modal handles both travel request creation and editing.
 *
 * Props:
 * - visible: Boolean - Controls modal visibility
 * - editingRecord: Object - Travel request data for edit mode (null for add mode)
 *
 * Emits:
 * - saved: When travel request is successfully created/updated
 * - close: When modal is closed
 */
import { ref, computed, watch, markRaw } from 'vue';
import { message } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

// Stores
import { useSharedDataStore } from '@/stores/sharedDataStore';

// Services
import { travelRequestService } from '@/services/travelRequest.service';

// Components
import EmployeeTreeSelect from '@/components/shared/EmployeeTreeSelect.vue';

export default {
  name: 'TravelRequestModal',
  components: {
    EmployeeTreeSelect,
    InfoCircleOutlined
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingRecord: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'close'],
  setup(props, { emit }) {
    // ============================================
    // STORES
    // ============================================
    const sharedDataStore = useSharedDataStore();

    // ============================================
    // UI STATE
    // ============================================
    const loading = ref(false);
    const dataLoaded = ref(false);
    const formErrors = ref({});

    // ============================================
    // FORM DATA
    // ============================================
    const formData = ref({
      employee_id: '',
      department_id: '',
      position_id: '',
      destination: '',
      start_date: null,
      to_date: null,
      purpose: '',
      grant: '',
      transportation: '',
      transportation_other_text: '',
      accommodation: '',
      accommodation_other_text: '',
      remarks: '',
      request_by_date: null,
      supervisor_approved: false,
      supervisor_approved_date: null,
      hr_acknowledged: false,
      hr_acknowledgement_date: null
    });

    // Selected employee info for display
    const selectedEmployeeInfo = ref(null);
    const selectedEmployeeDisplay = ref('');

    // ============================================
    // DROPDOWN DATA
    // ============================================
    const employeeTreeData = ref([]);
    const departments = ref([]);
    const positions = ref([]);
    const positionsLoading = ref(false);

    // Transportation options
    const transportationOptions = markRaw([
      { value: 'smru_vehicle', label: 'SMRU vehicle' },
      { value: 'public_transportation', label: 'Public transportation' },
      { value: 'air', label: 'Air' },
      { value: 'other', label: 'Other (please specify)' }
    ]);

    // Accommodation options
    const accommodationOptions = markRaw([
      { value: 'smru_arrangement', label: 'SMRU arrangement' },
      { value: 'self_arrangement', label: 'Self arrangement' },
      { value: 'other', label: 'Other (please specify)' }
    ]);

    // ============================================
    // COMPUTED PROPERTIES
    // ============================================
    const isEditing = computed(() => !!props.editingRecord);
    const modalTitle = computed(() => isEditing.value ? 'Edit Travel Request' : 'Add Travel Request');

    const departmentOptions = computed(() =>
      departments.value.map(d => ({ value: Number(d.id), label: d.name }))
    );

    const positionOptions = computed(() =>
      positions.value.map(p => ({ value: Number(p.id), label: p.title }))
    );

    // ============================================
    // DATA LOADING
    // ============================================
    const loadDropdownData = async () => {
      try {
        await sharedDataStore.loadAllDropdownData({
          includeEmployees: true,
          includeDepartments: true,
          includePositions: true,
          force: false
        });

        employeeTreeData.value = sharedDataStore.getEmployeeTreeData;
        departments.value = sharedDataStore.getDepartments;

        dataLoaded.value = true;
      } catch (error) {
        console.error('Error loading travel request modal data:', error);
        message.error('Failed to load form data');
      }
    };

    const loadPositionsForDepartment = async (departmentId) => {
      if (!departmentId) {
        positions.value = [];
        return;
      }

      try {
        positionsLoading.value = true;
        const positionData = await sharedDataStore.fetchPositionsByDepartment(departmentId);
        positions.value = Array.isArray(positionData) ? positionData : (positionData?.data || []);
      } catch (error) {
        console.error('Error loading positions:', error);
        positions.value = [];
      } finally {
        positionsLoading.value = false;
      }
    };

    // ============================================
    // EVENT HANDLERS
    // ============================================
    const handleEmployeeSelect = (employee) => {
      formData.value.employee_id = employee.value;
      selectedEmployeeDisplay.value = employee.title;

      // Find employee info from tree data
      for (const org of employeeTreeData.value) {
        const found = org.children?.find(e => e.value === employee.value);
        if (found) {
          selectedEmployeeInfo.value = {
            name: found.title,
            staff_id: found.staffId || found.staff_id,
            organization: org.title
          };
          break;
        }
      }

      formErrors.value.employee_id = '';
    };

    const handleDepartmentChange = async (value) => {
      formData.value.position_id = '';
      await loadPositionsForDepartment(value);
    };

    const handleTransportationChange = (e) => {
      if (formData.value.transportation !== 'other') {
        formData.value.transportation_other_text = '';
      }
    };

    const handleAccommodationChange = (e) => {
      if (formData.value.accommodation !== 'other') {
        formData.value.accommodation_other_text = '';
      }
    };

    // ============================================
    // VALIDATION
    // ============================================
    const validateForm = () => {
      const errors = {};

      if (!isEditing.value && !formData.value.employee_id) {
        errors.employee_id = 'Employee is required';
      }

      // Date validation
      if (formData.value.start_date && formData.value.to_date) {
        if (dayjs(formData.value.to_date).isBefore(dayjs(formData.value.start_date))) {
          errors.to_date = 'End date must be on or after start date';
        }
      }

      // Destination length
      if (formData.value.destination && formData.value.destination.length > 200) {
        errors.destination = 'Destination cannot exceed 200 characters';
      }

      // Grant length
      if (formData.value.grant && formData.value.grant.length > 50) {
        errors.grant = 'Grant code cannot exceed 50 characters';
      }

      // Transportation "other" text validation
      if (formData.value.transportation === 'other') {
        if (!formData.value.transportation_other_text?.trim()) {
          errors.transportation_other_text = 'Please specify transportation details';
        } else if (formData.value.transportation_other_text.length > 200) {
          errors.transportation_other_text = 'Cannot exceed 200 characters';
        }
      }

      // Accommodation "other" text validation
      if (formData.value.accommodation === 'other') {
        if (!formData.value.accommodation_other_text?.trim()) {
          errors.accommodation_other_text = 'Please specify accommodation details';
        } else if (formData.value.accommodation_other_text.length > 200) {
          errors.accommodation_other_text = 'Cannot exceed 200 characters';
        }
      }

      formErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    // ============================================
    // FORM SUBMISSION
    // ============================================
    const formatDateForAPI = (date) => {
      if (!date) return null;
      return dayjs(date).format('YYYY-MM-DD');
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        message.warning('Please fill in all required fields');
        return;
      }

      loading.value = true;

      try {
        const payload = {
          employee_id: formData.value.employee_id,
          department_id: formData.value.department_id || null,
          position_id: formData.value.position_id || null,
          destination: formData.value.destination || null,
          start_date: formatDateForAPI(formData.value.start_date),
          to_date: formatDateForAPI(formData.value.to_date),
          purpose: formData.value.purpose || null,
          grant: formData.value.grant || null,
          transportation: formData.value.transportation || null,
          transportation_other_text: formData.value.transportation === 'other' ? (formData.value.transportation_other_text || null) : null,
          accommodation: formData.value.accommodation || null,
          accommodation_other_text: formData.value.accommodation === 'other' ? (formData.value.accommodation_other_text || null) : null,
          remarks: formData.value.remarks || null,
          request_by_date: formatDateForAPI(formData.value.request_by_date),
          supervisor_approved: formData.value.supervisor_approved || false,
          supervisor_approved_date: formatDateForAPI(formData.value.supervisor_approved_date),
          hr_acknowledged: formData.value.hr_acknowledged || false,
          hr_acknowledgement_date: formatDateForAPI(formData.value.hr_acknowledgement_date)
        };

        let response;
        if (isEditing.value) {
          response = await travelRequestService.updateTravelRequest(props.editingRecord.id, payload);
        } else {
          response = await travelRequestService.createTravelRequest(payload);
        }

        if (response?.success) {
          message.success(isEditing.value ? 'Travel request updated successfully' : 'Travel request created successfully');
          emit('saved', { success: true, data: response.data });
          handleClose();
        } else {
          throw new Error(response?.message || 'Failed to save travel request');
        }
      } catch (error) {
        console.error('Error saving travel request:', error);
        handleSubmitError(error);
      } finally {
        loading.value = false;
      }
    };

    const handleSubmitError = (error) => {
      let errorMessage = 'An error occurred while saving the travel request.';

      if (error.response?.data) {
        const data = error.response.data;
        errorMessage = data.error || data.message || errorMessage;

        // Handle validation errors (422)
        if (data.errors) {
          const fieldErrors = {};
          Object.entries(data.errors).forEach(([field, messages]) => {
            fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
          });
          formErrors.value = { ...formErrors.value, ...fieldErrors };
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    };

    // ============================================
    // FORM RESET
    // ============================================
    const resetForm = () => {
      formData.value = {
        employee_id: '',
        department_id: '',
        position_id: '',
        destination: '',
        start_date: null,
        to_date: null,
        purpose: '',
        grant: '',
        transportation: '',
        transportation_other_text: '',
        accommodation: '',
        accommodation_other_text: '',
        remarks: '',
        request_by_date: null,
        supervisor_approved: false,
        supervisor_approved_date: null,
        hr_acknowledged: false,
        hr_acknowledgement_date: null
      };

      selectedEmployeeInfo.value = null;
      selectedEmployeeDisplay.value = '';
      formErrors.value = {};
      positions.value = [];
    };

    // ============================================
    // MODAL MANAGEMENT
    // ============================================
    const handleClose = () => {
      resetForm();
      emit('close');
    };

    const handleAfterClose = () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    // ============================================
    // WATCHERS
    // ============================================
    const populateEditForm = (record) => {
      const deptId = record.department_id || record.department?.id || '';
      const posId = record.position_id || record.position?.id || '';

      formData.value = {
        employee_id: record.employee_id || '',
        department_id: deptId ? Number(deptId) : '',
        position_id: posId ? Number(posId) : '',
        destination: record.destination || '',
        start_date: record.start_date ? dayjs(record.start_date) : null,
        to_date: record.to_date ? dayjs(record.to_date) : null,
        purpose: record.purpose || '',
        grant: record.grant || '',
        transportation: record.transportation || '',
        transportation_other_text: record.transportation_other_text || '',
        accommodation: record.accommodation || '',
        accommodation_other_text: record.accommodation_other_text || '',
        remarks: record.remarks || '',
        request_by_date: record.request_by_date ? dayjs(record.request_by_date) : null,
        supervisor_approved: record.supervisor_approved || false,
        supervisor_approved_date: record.supervisor_approved_date ? dayjs(record.supervisor_approved_date) : null,
        hr_acknowledged: record.hr_acknowledged || false,
        hr_acknowledgement_date: record.hr_acknowledgement_date ? dayjs(record.hr_acknowledgement_date) : null
      };

      // Set employee info for display
      if (record.employee) {
        const emp = record.employee;
        selectedEmployeeInfo.value = {
          name: emp.name || `${emp.first_name_en || ''} ${emp.last_name_en || ''}`.trim(),
          staff_id: emp.staff_id,
          organization: emp.organization
        };
        selectedEmployeeDisplay.value = selectedEmployeeInfo.value.name;
      }
    };

    // Single watcher on visible
    watch(() => props.visible, async (isVisible) => {
      if (!isVisible) return;

      await loadDropdownData();

      if (props.editingRecord) {
        populateEditForm(props.editingRecord);

        if (formData.value.department_id) {
          await loadPositionsForDepartment(formData.value.department_id);
        }
      }
    });

    // ============================================
    // RETURN
    // ============================================
    return {
      // State
      loading,
      dataLoaded,
      formErrors,
      formData,
      selectedEmployeeInfo,
      selectedEmployeeDisplay,
      positionsLoading,

      // Dropdown data
      employeeTreeData,
      transportationOptions,
      accommodationOptions,
      departmentOptions,
      positionOptions,

      // Computed
      isEditing,
      modalTitle,

      // Utilities
      dayjs,

      // Methods
      handleEmployeeSelect,
      handleDepartmentChange,
      handleTransportationChange,
      handleAccommodationChange,
      handleSubmit,
      handleClose,
      handleAfterClose
    };
  }
};
</script>

<template>
  <a-modal
    :open="visible"
    :title="modalTitle"
    :confirmLoading="loading"
    @cancel="handleClose"
    @afterClose="handleAfterClose"
    :footer="null"
    :width="800"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <div class="travel-request-form">
      <!-- ===== BASIC INFORMATION ===== -->
      <div class="section-divider">
        <span class="section-label">Basic Information</span>
      </div>

      <!-- Employee Selection (Add mode) / Display (Edit mode) -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Employee <span v-if="!isEditing" class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <template v-if="!isEditing">
            <EmployeeTreeSelect
              v-model="formData.employee_id"
              :tree-data="employeeTreeData"
              :display-value="selectedEmployeeDisplay"
              :has-error="!!formErrors.employee_id"
              :error-message="formErrors.employee_id"
              placeholder="Select employee"
              search-placeholder="Search employees..."
              @select="handleEmployeeSelect"
            />
          </template>
          <template v-else>
            <div class="employee-display-card">
              <div v-if="selectedEmployeeInfo" class="employee-info">
                <strong>{{ selectedEmployeeInfo.name }}</strong>
                <span v-if="selectedEmployeeInfo.staff_id" class="text-muted ms-2">({{ selectedEmployeeInfo.staff_id }})</span>
                <br>
                <small v-if="selectedEmployeeInfo.organization" class="text-muted">Organization: {{ selectedEmployeeInfo.organization }}</small>
              </div>
              <div v-else class="text-muted">Loading employee info...</div>
            </div>
          </template>
        </div>
      </div>

      <!-- Department -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Department :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="formData.department_id"
            placeholder="Select department"
            :options="departmentOptions"
            :status="formErrors.department_id ? 'error' : ''"
            show-search
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            @change="handleDepartmentChange"
            class="input-medium"
          />
          <div v-if="formErrors.department_id" class="error-feedback">{{ formErrors.department_id }}</div>
        </div>
      </div>

      <!-- Position -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Position :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="formData.position_id"
            :placeholder="positionsLoading ? 'Loading positions...' : 'Select position'"
            :options="positionOptions"
            :status="formErrors.position_id ? 'error' : ''"
            :disabled="!formData.department_id || positionsLoading"
            :loading="positionsLoading"
            show-search
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            class="input-medium"
          />
          <div v-if="formErrors.position_id" class="error-feedback">{{ formErrors.position_id }}</div>
        </div>
      </div>

      <!-- Destination -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Destination :</label>
        </div>
        <div class="form-input-col">
          <a-input
            v-model:value="formData.destination"
            placeholder="Enter destination"
            :maxlength="200"
            :status="formErrors.destination ? 'error' : ''"
            class="input-medium"
          />
          <div v-if="formErrors.destination" class="error-feedback">{{ formErrors.destination }}</div>
        </div>
      </div>

      <!-- Start Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Start Date :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              v-model:value="formData.start_date"
              placeholder="Select start date"
              format="DD/MM/YYYY"
              :status="formErrors.start_date ? 'error' : ''"
              class="input-short"
            />
            <span class="tooltip-icon" title="Travel start date">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.start_date" class="error-feedback">{{ formErrors.start_date }}</div>
        </div>
      </div>

      <!-- End Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">End Date :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              v-model:value="formData.to_date"
              placeholder="Select end date"
              format="DD/MM/YYYY"
              :status="formErrors.to_date ? 'error' : ''"
              class="input-short"
            />
            <span class="tooltip-icon" title="Travel end date (must be on or after start date)">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.to_date" class="error-feedback">{{ formErrors.to_date }}</div>
        </div>
      </div>

      <!-- Purpose -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Purpose :</label>
        </div>
        <div class="form-input-col">
          <a-textarea
            v-model:value="formData.purpose"
            placeholder="Enter purpose of travel"
            :rows="2"
            :status="formErrors.purpose ? 'error' : ''"
          />
          <div v-if="formErrors.purpose" class="error-feedback">{{ formErrors.purpose }}</div>
        </div>
      </div>

      <!-- Grant Code -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Grant Code :</label>
        </div>
        <div class="form-input-col">
          <a-input
            v-model:value="formData.grant"
            placeholder="Enter grant/project code"
            :maxlength="50"
            class="input-medium"
          />
        </div>
      </div>

      <!-- ===== TRAVEL DETAILS ===== -->
      <div class="section-divider">
        <span class="section-label">Travel Details</span>
      </div>

      <!-- Transportation -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Transportation :</label>
        </div>
        <div class="form-input-col">
          <a-radio-group v-model:value="formData.transportation" @change="handleTransportationChange">
            <a-radio v-for="opt in transportationOptions" :key="opt.value" :value="opt.value" class="radio-item">
              {{ opt.label }}
            </a-radio>
          </a-radio-group>
          <div v-if="formErrors.transportation" class="error-feedback">{{ formErrors.transportation }}</div>

          <!-- Other text field -->
          <div v-if="formData.transportation === 'other'" class="mt-2">
            <a-textarea
              v-model:value="formData.transportation_other_text"
              placeholder="Please specify transportation method"
              :rows="2"
              :maxlength="200"
              show-count
              :status="formErrors.transportation_other_text ? 'error' : ''"
            />
            <div v-if="formErrors.transportation_other_text" class="error-feedback">{{ formErrors.transportation_other_text }}</div>
          </div>
        </div>
      </div>

      <!-- Accommodation -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Accommodation :</label>
        </div>
        <div class="form-input-col">
          <a-radio-group v-model:value="formData.accommodation" @change="handleAccommodationChange">
            <a-radio v-for="opt in accommodationOptions" :key="opt.value" :value="opt.value" class="radio-item">
              {{ opt.label }}
            </a-radio>
          </a-radio-group>
          <div v-if="formErrors.accommodation" class="error-feedback">{{ formErrors.accommodation }}</div>

          <!-- Other text field -->
          <div v-if="formData.accommodation === 'other'" class="mt-2">
            <a-textarea
              v-model:value="formData.accommodation_other_text"
              placeholder="Please specify accommodation type"
              :rows="2"
              :maxlength="200"
              show-count
              :status="formErrors.accommodation_other_text ? 'error' : ''"
            />
            <div v-if="formErrors.accommodation_other_text" class="error-feedback">{{ formErrors.accommodation_other_text }}</div>
          </div>
        </div>
      </div>

      <!-- Remarks -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Remarks :</label>
        </div>
        <div class="form-input-col">
          <a-textarea
            v-model:value="formData.remarks"
            placeholder="Additional remarks or special requirements"
            :rows="3"
            :maxlength="1000"
            show-count
          />
        </div>
      </div>

      <!-- ===== APPROVAL SECTION ===== -->
      <div class="section-divider">
        <span class="section-label">Signature & Approval</span>
        <small class="section-hint">Optional fields for tracking approval workflow</small>
      </div>

      <!-- Request By Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Request By Date :</label>
        </div>
        <div class="form-input-col">
          <a-date-picker
            v-model:value="formData.request_by_date"
            placeholder="Select date"
            format="DD/MM/YYYY"
            class="input-short"
          />
        </div>
      </div>

      <!-- Supervisor Approved -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Supervisor :</label>
        </div>
        <div class="form-input-col">
          <div class="d-flex align-items-center gap-3">
            <a-checkbox v-model:checked="formData.supervisor_approved">
              Approved
            </a-checkbox>
            <a-date-picker
              v-if="formData.supervisor_approved"
              v-model:value="formData.supervisor_approved_date"
              placeholder="Approval date"
              format="DD/MM/YYYY"
              class="input-short"
            />
          </div>
        </div>
      </div>

      <!-- HR Acknowledged -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">HR :</label>
        </div>
        <div class="form-input-col">
          <div class="d-flex align-items-center gap-3">
            <a-checkbox v-model:checked="formData.hr_acknowledged">
              Acknowledged
            </a-checkbox>
            <a-date-picker
              v-if="formData.hr_acknowledged"
              v-model:value="formData.hr_acknowledgement_date"
              placeholder="Acknowledgement date"
              format="DD/MM/YYYY"
              class="input-short"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="modal-footer-actions">
      <div class="footer-buttons">
        <a-button @click="handleClose" :disabled="loading">Cancel</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEditing ? 'Save Changes' : 'Save Travel Request' }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
/* Scrollable form container */
.travel-request-form {
  min-height: 400px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

/* Section divider */
.section-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e5e5;
}

.section-divider:first-child {
  margin-top: 0;
}

.section-label {
  font-weight: 600;
  color: #23325b;
  font-size: 14px;
  white-space: nowrap;
}

.section-hint {
  color: #8c8c8c;
  font-size: 12px;
}

/* Form layout */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.form-label-col {
  flex: 0 0 160px;
  min-width: 160px;
  padding-top: 6px;
  display: flex;
  justify-content: flex-end;
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
  white-space: nowrap;
}

/* Input widths */
.input-short {
  width: 200px !important;
  max-width: 200px;
}

.input-medium {
  width: 300px !important;
  max-width: 300px;
}

/* Tooltip */
.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tooltip-icon {
  flex-shrink: 0;
}

/* Error feedback */
.error-feedback {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.text-danger {
  color: #ff4d4f;
}

/* Employee display card */
.employee-display-card {
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.employee-info {
  line-height: 1.6;
}

/* Radio items - vertical layout */
.radio-item {
  display: block;
  margin-bottom: 4px;
}

/* Footer actions */
.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
  margin-top: 16px;
}

.footer-buttons {
  display: flex;
  gap: 8px;
}

/* Responsive */
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
  .input-medium {
    width: 100% !important;
    max-width: 100%;
  }

  :deep(.ant-picker),
  :deep(.ant-select),
  :deep(.ant-input-number) {
    width: 100% !important;
  }

  .modal-footer-actions {
    flex-direction: column;
    gap: 12px;
  }
}

/* Ant Design component overrides */
:deep(.input-short.ant-picker),
:deep(.input-short.ant-select) {
  width: 200px !important;
}

:deep(.input-medium.ant-select),
:deep(.input-medium.ant-input) {
  width: 300px !important;
}

:deep(.ant-select-selector) {
  min-width: inherit;
}

:deep(.ant-radio-wrapper) {
  margin-inline-end: 0;
}
</style>

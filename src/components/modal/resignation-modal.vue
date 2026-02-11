<script>
/**
 * Resignation Modal Component (Unified Add/Edit)
 *
 * Migrated from Bootstrap to Ant Design Vue.
 * This modal handles both resignation creation and editing.
 * Includes acknowledge/reject functionality in edit mode.
 *
 * Props:
 * - visible: Boolean - Controls modal visibility
 * - editingResignation: Object - Resignation data for edit mode (null for add mode)
 *
 * Emits:
 * - saved: When resignation is successfully created/updated/acknowledged
 * - close: When modal is closed
 */
import { ref, computed, watch, markRaw, onMounted, onBeforeUnmount } from 'vue';
import { message } from 'ant-design-vue';
import { InfoCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

// Stores
import { useSharedDataStore } from '@/stores/sharedDataStore';

// Services
import { resignationService } from '@/services/resignation.service';

// Utils
import { reasonUtils } from '@/utils/resignation.utils';

// Components
import EmployeeTreeSelect from '@/components/shared/EmployeeTreeSelect.vue';

export default {
  name: 'ResignationModal',
  components: {
    EmployeeTreeSelect,
    InfoCircleOutlined,
    CheckOutlined,
    CloseOutlined
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingResignation: {
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
    const isAcknowledging = ref(false);
    const isRejecting = ref(false);

    // ============================================
    // FORM DATA
    // ============================================
    const formData = ref({
      employee_id: '',
      department_id: '',
      position_id: '',
      resignation_date: null,
      last_working_date: null,
      reason: '',
      reason_details: '',
      acknowledgement_status: 'Pending',
      acknowledged_at: null
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

    // Resignation reasons (hardcoded from utils)
    const resignationReasons = markRaw(
      reasonUtils.getResignationReasons().map(r => ({
        value: r,
        label: r
      }))
    );

    // ============================================
    // COMPUTED PROPERTIES
    // ============================================
    const isEditing = computed(() => !!props.editingResignation);
    const modalTitle = computed(() => isEditing.value ? 'Edit Resignation' : 'Add Resignation');

    // Convert dropdown data to options format
    // Use Number() to ensure consistent type matching with form values
    const departmentOptions = computed(() =>
      departments.value.map(d => ({ value: Number(d.id), label: d.name }))
    );

    const positionOptions = computed(() =>
      positions.value.map(p => ({ value: Number(p.id), label: p.title }))
    );

    // Status color mapping
    const getStatusColor = (status) => {
      const colors = {
        'Pending': 'warning',
        'Acknowledged': 'success',
        'Rejected': 'error'
      };
      return colors[status] || 'default';
    };

    // ============================================
    // DATA LOADING
    // ============================================
    const loadDropdownData = async () => {
      try {
        // Load from shared store (uses internal caching, won't re-fetch if cached)
        await sharedDataStore.loadAllDropdownData({
          includeEmployees: true,
          includeDepartments: true,
          includePositions: true,
          force: false
        });

        // Always copy data from shared store to local refs
        // This ensures local refs are in sync even if previously cleared
        employeeTreeData.value = sharedDataStore.getEmployeeTreeData;
        departments.value = sharedDataStore.getDepartments;

        dataLoaded.value = true;
      } catch (error) {
        console.error('Error loading resignation modal data:', error);
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

      // Clear employee error
      formErrors.value.employee_id = '';
    };

    const handleDepartmentChange = async (value) => {
      formData.value.position_id = '';
      await loadPositionsForDepartment(value);
    };

    // ============================================
    // VALIDATION
    // ============================================
    const validateForm = () => {
      const errors = {};

      if (!isEditing.value && !formData.value.employee_id) {
        errors.employee_id = 'Employee is required';
      }
      if (!formData.value.department_id) {
        errors.department_id = 'Department is required';
      }
      if (!formData.value.position_id) {
        errors.position_id = 'Position is required';
      }
      if (!formData.value.resignation_date) {
        errors.resignation_date = 'Resignation date is required';
      }
      if (!formData.value.last_working_date) {
        errors.last_working_date = 'Last working date is required';
      }
      if (!formData.value.reason) {
        errors.reason = 'Reason is required';
      }

      // Date validation: last working date must be on or after resignation date
      if (formData.value.resignation_date && formData.value.last_working_date) {
        if (dayjs(formData.value.last_working_date).isBefore(dayjs(formData.value.resignation_date))) {
          errors.last_working_date = 'Last working date must be on or after resignation date';
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
          department_id: formData.value.department_id,
          position_id: formData.value.position_id,
          resignation_date: formatDateForAPI(formData.value.resignation_date),
          last_working_date: formatDateForAPI(formData.value.last_working_date),
          reason: formData.value.reason,
          reason_details: formData.value.reason_details || null
        };

        let response;
        if (isEditing.value) {
          response = await resignationService.updateResignation(props.editingResignation.id, payload);
        } else {
          response = await resignationService.createResignation(payload);
        }

        if (response?.success) {
          message.success(isEditing.value ? 'Resignation updated successfully' : 'Resignation created successfully');
          emit('saved', {
            success: true,
            message: isEditing.value ? 'Resignation updated successfully' : 'Resignation created successfully',
            data: response.data
          });
          handleClose();
        } else {
          throw new Error(response?.message || 'Failed to save resignation');
        }
      } catch (error) {
        console.error('Error saving resignation:', error);
        handleSubmitError(error);
      } finally {
        loading.value = false;
      }
    };

    const handleSubmitError = (error) => {
      let errorMessage = 'An error occurred while saving the resignation.';

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
    // ACKNOWLEDGE / REJECT
    // ============================================
    const acknowledgeResignation = async () => {
      isAcknowledging.value = true;
      try {
        const response = await resignationService.acknowledgeResignation(
          props.editingResignation.id,
          { action: 'acknowledge' }
        );

        if (response.success) {
          message.success('Resignation acknowledged successfully');
          emit('saved', { success: true, data: response.data });
          handleClose();
        }
      } catch (error) {
        console.error('Error acknowledging resignation:', error);
        message.error(error.message || 'Failed to acknowledge resignation');
      } finally {
        isAcknowledging.value = false;
      }
    };

    const rejectResignation = async () => {
      isRejecting.value = true;
      try {
        const response = await resignationService.acknowledgeResignation(
          props.editingResignation.id,
          { action: 'reject' }
        );

        if (response.success) {
          message.success('Resignation rejected');
          emit('saved', { success: true, data: response.data });
          handleClose();
        }
      } catch (error) {
        console.error('Error rejecting resignation:', error);
        message.error(error.message || 'Failed to reject resignation');
      } finally {
        isRejecting.value = false;
      }
    };

    // ============================================
    // FORM RESET
    // ============================================
    const resetForm = () => {
      formData.value = {
        employee_id: '',
        department_id: '',
        position_id: '',
        resignation_date: null,
        last_working_date: null,
        reason: '',
        reason_details: '',
        acknowledgement_status: 'Pending',
        acknowledged_at: null
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
      // Cleanup any lingering DOM elements
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    // ============================================
    // WATCHERS
    // ============================================

    // Populate form with resignation data for editing
    const populateEditForm = (resignationData) => {
      // Use Number() to ensure type consistency with dropdown option values
      const deptId = resignationData.departmentId || resignationData.department_id || resignationData.department?.id || '';
      const posId = resignationData.positionId || resignationData.position_id || resignationData.position?.id || '';

      formData.value = {
        employee_id: resignationData.employeeId || resignationData.employee_id || '',
        department_id: deptId ? Number(deptId) : '',
        position_id: posId ? Number(posId) : '',
        resignation_date: resignationData.resignationDate || resignationData.resignation_date
          ? dayjs(resignationData.resignationDate || resignationData.resignation_date)
          : null,
        last_working_date: resignationData.lastWorkingDate || resignationData.last_working_date
          ? dayjs(resignationData.lastWorkingDate || resignationData.last_working_date)
          : null,
        reason: resignationData.reason || '',
        reason_details: resignationData.reasonDetails || resignationData.reason_details || '',
        acknowledgement_status: resignationData.acknowledgementStatus || resignationData.acknowledgement_status || 'Pending',
        acknowledged_at: resignationData.acknowledgedAt || resignationData.acknowledged_at || null
      };

      // Set employee info for display
      if (resignationData.employee) {
        const emp = resignationData.employee;
        selectedEmployeeInfo.value = {
          name: emp.name || `${emp.firstNameEn || emp.first_name_en || ''} ${emp.lastNameEn || emp.last_name_en || ''}`.trim(),
          staff_id: emp.staffId || emp.staff_id,
          organization: emp.organization
        };
        selectedEmployeeDisplay.value = selectedEmployeeInfo.value.name;
      }
    };

    // Single watcher on visible — handles both Add and Edit mode
    // This eliminates the race condition between two concurrent watchers
    watch(() => props.visible, async (isVisible) => {
      if (!isVisible) return;

      // Always load dropdown data when modal opens
      await loadDropdownData();

      // If editing, populate form after dropdown data is ready
      if (props.editingResignation) {
        populateEditForm(props.editingResignation);

        // Load department-specific positions after form is populated
        if (formData.value.department_id) {
          await loadPositionsForDepartment(formData.value.department_id);
        }
      }
    });

    // ============================================
    // LIFECYCLE
    // ============================================
    onMounted(() => {
      // Dropdown data will be loaded when modal becomes visible
    });

    onBeforeUnmount(() => {
      // Cleanup
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
      isAcknowledging,
      isRejecting,

      // Dropdown data
      employeeTreeData,
      resignationReasons,
      departmentOptions,
      positionOptions,

      // Computed
      isEditing,
      modalTitle,

      // Utilities
      dayjs,

      // Methods
      getStatusColor,
      handleEmployeeSelect,
      handleDepartmentChange,
      handleSubmit,
      handleClose,
      handleAfterClose,
      acknowledgeResignation,
      rejectResignation
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
    <div class="resignation-form">
      <!-- Employee Selection (Add mode) / Display (Edit mode) -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Employee <span v-if="!isEditing" class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <!-- Add Mode: Tree Select -->
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

          <!-- Edit Mode: Display Card -->
          <template v-else>
            <div class="employee-display-card">
              <div v-if="selectedEmployeeInfo" class="employee-info">
                <strong>{{ selectedEmployeeInfo.name }}</strong>
                <span v-if="selectedEmployeeInfo.staff_id" class="text-muted ms-2">({{ selectedEmployeeInfo.staff_id }})</span>
                <br>
                <small v-if="selectedEmployeeInfo.organization" class="text-muted">Organization: {{ selectedEmployeeInfo.organization }}</small>
              </div>
              <div v-else class="text-muted">
                Loading employee info...
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Selected Employee Info Card (Add mode only) -->
      <div v-if="!isEditing && selectedEmployeeInfo" class="employee-info-card mb-3">
        <h6 class="card-title">Selected Employee</h6>
        <p class="mb-0">
          <strong>{{ selectedEmployeeInfo.name }}</strong><br>
          <small v-if="selectedEmployeeInfo.staff_id" class="text-muted">Staff ID: {{ selectedEmployeeInfo.staff_id }}</small><br>
          <small v-if="selectedEmployeeInfo.organization" class="text-muted">Organization: {{ selectedEmployeeInfo.organization }}</small>
        </p>
      </div>

      <!-- Department -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Department <span class="text-danger">*</span> :</label>
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
          <label class="form-label">Position <span class="text-danger">*</span> :</label>
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

      <!-- Resignation Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Resignation Date <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              v-model:value="formData.resignation_date"
              placeholder="Select resignation date"
              format="DD/MM/YYYY"
              :status="formErrors.resignation_date ? 'error' : ''"
              class="input-short"
            />
            <span class="tooltip-icon" title="Date when the resignation was submitted">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.resignation_date" class="error-feedback">{{ formErrors.resignation_date }}</div>
        </div>
      </div>

      <!-- Last Working Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Last Working Date <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              v-model:value="formData.last_working_date"
              placeholder="Select last working date"
              format="DD/MM/YYYY"
              :status="formErrors.last_working_date ? 'error' : ''"
              class="input-short"
            />
            <span class="tooltip-icon" title="Employee's last day of work (must be on or after resignation date)">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.last_working_date" class="error-feedback">{{ formErrors.last_working_date }}</div>
        </div>
      </div>

      <!-- Reason -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Reason <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="formData.reason"
            placeholder="Select reason"
            :options="resignationReasons"
            :status="formErrors.reason ? 'error' : ''"
            show-search
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            class="input-medium"
          />
          <div v-if="formErrors.reason" class="error-feedback">{{ formErrors.reason }}</div>
        </div>
      </div>

      <!-- Reason Details -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Reason Details :</label>
        </div>
        <div class="form-input-col">
          <a-textarea
            v-model:value="formData.reason_details"
            placeholder="Additional details about the resignation reason (optional)"
            :rows="3"
            :maxlength="1000"
            show-count
          />
        </div>
      </div>

      <!-- Acknowledgement Status (Edit mode only) -->
      <div v-if="isEditing" class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Status :</label>
        </div>
        <div class="form-input-col">
          <div class="acknowledgement-status">
            <a-tag :color="getStatusColor(formData.acknowledgement_status)">
              {{ formData.acknowledgement_status || 'Pending' }}
            </a-tag>

            <!-- Acknowledge/Reject buttons when status is Pending -->
            <div v-if="formData.acknowledgement_status === 'Pending'" class="mt-2">
              <a-button
                type="primary"
                size="small"
                @click="acknowledgeResignation"
                :loading="isAcknowledging"
                class="me-2"
              >
                <template #icon><CheckOutlined /></template>
                Acknowledge
              </a-button>
              <a-button
                danger
                size="small"
                @click="rejectResignation"
                :loading="isRejecting"
              >
                <template #icon><CloseOutlined /></template>
                Reject
              </a-button>
            </div>

            <!-- Acknowledged/Rejected timestamp -->
            <div v-if="formData.acknowledged_at" class="mt-2">
              <small class="text-muted">
                {{ formData.acknowledgement_status === 'Acknowledged' ? 'Acknowledged' : 'Rejected' }}
                on {{ dayjs(formData.acknowledged_at).format('DD/MM/YYYY') }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="modal-footer-actions">
      <div class="footer-info">
        <small v-if="isEditing && formData.acknowledgement_status === 'Pending'" class="text-muted">
          <info-circle-outlined /> You can acknowledge or reject the resignation above before saving changes.
        </small>
      </div>
      <div class="footer-buttons">
        <a-button @click="handleClose" :disabled="loading">Cancel</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEditing ? 'Save Changes' : 'Save Resignation' }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
/* Scrollable form container */
.resignation-form {
  min-height: 400px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
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

/* Employee info card (add mode) */
.employee-info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px 16px;
  margin-left: 176px;
}

.employee-info-card .card-title {
  margin-bottom: 8px;
  font-size: 0.9em;
  font-weight: 600;
  color: #495057;
}

/* Acknowledgement status section */
.acknowledgement-status {
  padding: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

/* Footer actions */
.modal-footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
  margin-top: 16px;
}

.footer-info {
  flex: 1;
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

  .employee-info-card {
    margin-left: 0;
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

  .footer-info {
    text-align: center;
  }
}

/* Ant Design component overrides */
:deep(.input-short.ant-picker),
:deep(.input-short.ant-select) {
  width: 200px !important;
}

:deep(.input-medium.ant-select),
:deep(.input-medium.ant-input-number) {
  width: 300px !important;
}

:deep(.ant-select-selector) {
  min-width: inherit;
}
</style>

<script>
import { ref, watch, computed } from 'vue';
import { attendanceService } from '@/services/attendance.service';
import { message } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'AttendanceModal',
  components: {
    InfoCircleOutlined,
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
    // Form state
    const form = ref({
      employee_id: undefined,
      date: null,
      clock_in: null,
      clock_out: null,
      status: 'Present',
      notes: ''
    });

    // Loading and error states
    const loading = ref(false);
    const formErrors = ref({});

    // Dropdown options loaded from API
    const employeeOptions = ref([]);
    const statusOptions = ref([
      { value: 'Present', label: 'Present' },
      { value: 'Absent', label: 'Absent' },
      { value: 'Late', label: 'Late' },
      { value: 'Half Day', label: 'Half Day' },
      { value: 'On Leave', label: 'On Leave' },
    ]);

    // Computed
    const isEditing = computed(() => !!props.editingRecord);
    const modalTitle = computed(() => isEditing.value ? 'Edit Attendance' : 'Add Attendance');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Add Attendance');

    // Auto-calculate total hours from clock_in and clock_out
    const calculatedHours = computed(() => {
      if (form.value.clock_in && form.value.clock_out) {
        const clockIn = dayjs(form.value.clock_in);
        const clockOut = dayjs(form.value.clock_out);

        if (clockIn.isValid() && clockOut.isValid()) {
          let diffMinutes = clockOut.diff(clockIn, 'minute');

          // Handle overnight shifts
          if (diffMinutes < 0) {
            diffMinutes += 24 * 60;
          }

          const hours = (diffMinutes / 60).toFixed(2);
          return `${hours} hrs`;
        }
      }
      return '--';
    });

    // Methods
    const resetForm = () => {
      form.value = {
        employee_id: undefined,
        date: null,
        clock_in: null,
        clock_out: null,
        status: 'Present',
        notes: ''
      };
      formErrors.value = {};
    };

    const loadOptions = async () => {
      try {
        const response = await attendanceService.getOptions();
        if (response.success && response.data) {
          employeeOptions.value = response.data.employees || [];
          if (response.data.statuses) {
            statusOptions.value = response.data.statuses;
          }
        }
      } catch (error) {
        console.error('Error loading attendance options:', error);
        employeeOptions.value = [];
      }
    };

    // Watch for editing record changes
    watch(() => props.editingRecord, (newVal) => {
      if (newVal) {
        form.value = {
          employee_id: newVal.employee_id || undefined,
          date: newVal.date ? dayjs(newVal.date) : null,
          clock_in: newVal.clock_in ? dayjs(newVal.clock_in, 'HH:mm') : null,
          clock_out: newVal.clock_out ? dayjs(newVal.clock_out, 'HH:mm') : null,
          status: newVal.status || 'Present',
          notes: newVal.notes || ''
        };
      } else {
        resetForm();
      }
    }, { immediate: true });

    // Watch visibility to load options and reset form
    watch(() => props.visible, async (newVal) => {
      if (newVal) {
        await loadOptions();
        if (!props.editingRecord) {
          resetForm();
        }
      }
    });

    const validateForm = () => {
      const errors = {};

      if (!form.value.employee_id) {
        errors.employee_id = 'Employee is required';
      }

      if (!form.value.date) {
        errors.date = 'Date is required';
      }

      if (!form.value.status) {
        errors.status = 'Status is required';
      }

      formErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        message.warning('Please fill in all required fields');
        return;
      }

      loading.value = true;
      try {
        // Prepare data for API
        const data = {
          employee_id: form.value.employee_id,
          date: form.value.date ? dayjs(form.value.date).format('YYYY-MM-DD') : null,
          clock_in: form.value.clock_in ? dayjs(form.value.clock_in).format('HH:mm') : null,
          clock_out: form.value.clock_out ? dayjs(form.value.clock_out).format('HH:mm') : null,
          status: form.value.status,
          notes: form.value.notes?.trim() || null
        };

        let response;
        if (isEditing.value) {
          response = await attendanceService.update(props.editingRecord.id, data);
        } else {
          response = await attendanceService.create(data);
        }

        if (response.success) {
          message.success(isEditing.value ? 'Attendance updated successfully' : 'Attendance created successfully');
          emit('saved', response);
          handleClose();
        } else {
          message.error(response.message || 'Failed to save attendance');
        }
      } catch (error) {
        console.error('Error saving attendance:', error);

        // Handle validation errors from server (422)
        if (error.status === 422 && error.errors) {
          Object.keys(error.errors).forEach(field => {
            if (Array.isArray(error.errors[field]) && error.errors[field].length > 0) {
              formErrors.value[field] = error.errors[field][0];
            }
          });
          message.error('Please correct the errors and try again');
        } else {
          message.error(error.message || 'Failed to save attendance');
        }
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      resetForm();
      emit('close');
    };

    // Cleanup any stray modal elements after close animation completes
    const handleAfterClose = () => {
      const backdrops = document.querySelectorAll('.ant-modal-mask, .ant-modal-wrap');
      const openModals = document.querySelectorAll('.ant-modal-wrap:not([style*="display: none"])');

      if (openModals.length === 0) {
        backdrops.forEach(el => {
          if (el.style.display !== 'none') {
            el.style.display = 'none';
          }
        });
      }

      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    // Employee search filter for a-select
    const filterEmployeeOption = (input, option) => {
      return option.label.toLowerCase().includes(input.toLowerCase());
    };

    return {
      form,
      loading,
      formErrors,
      employeeOptions,
      statusOptions,
      isEditing,
      modalTitle,
      submitButtonText,
      calculatedHours,
      handleSubmit,
      handleClose,
      handleAfterClose,
      filterEmployeeOption,
      resetForm
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
    :width="650"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <form @submit.prevent="handleSubmit">
      <!-- Employee -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="attendance-employee">
            Employee <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-select
              id="attendance-employee"
              v-model:value="form.employee_id"
              placeholder="Select an employee"
              :status="formErrors.employee_id ? 'error' : ''"
              :options="employeeOptions"
              show-search
              :filter-option="filterEmployeeOption"
              class="input-long"
            />
            <span class="tooltip-icon" title="Select the employee for this attendance record">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.employee_id" class="error-feedback">
            {{ formErrors.employee_id }}
          </div>
        </div>
      </div>

      <!-- Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="attendance-date">
            Date <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              id="attendance-date"
              v-model:value="form.date"
              class="input-short"
              placeholder="Select date"
              format="DD/MM/YYYY"
              :status="formErrors.date ? 'error' : ''"
            />
            <span class="tooltip-icon" title="Select the attendance date">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.date" class="error-feedback">
            {{ formErrors.date }}
          </div>
        </div>
      </div>

      <!-- Clock In -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="attendance-clock-in">
            Clock In :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-time-picker
              id="attendance-clock-in"
              v-model:value="form.clock_in"
              class="input-short"
              placeholder="HH:mm"
              format="HH:mm"
              :minuteStep="1"
            />
            <span class="tooltip-icon" title="Employee check-in time">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
        </div>
      </div>

      <!-- Clock Out -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="attendance-clock-out">
            Clock Out :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-time-picker
              id="attendance-clock-out"
              v-model:value="form.clock_out"
              class="input-short"
              placeholder="HH:mm"
              format="HH:mm"
              :minuteStep="1"
            />
            <span class="tooltip-icon" title="Employee check-out time">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
        </div>
      </div>

      <!-- Total Hours (read-only, auto-calculated) -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">
            Total Hours :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <span class="total-hours-display">{{ calculatedHours }}</span>
            <span class="tooltip-icon" title="Auto-calculated from Clock In and Clock Out times">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
        </div>
      </div>

      <!-- Status -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="attendance-status">
            Status <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-select
              id="attendance-status"
              v-model:value="form.status"
              placeholder="Select status"
              :status="formErrors.status ? 'error' : ''"
              :options="statusOptions"
              class="input-short"
            />
            <span class="tooltip-icon" title="Select the attendance status for this day">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.status" class="error-feedback">
            {{ formErrors.status }}
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="attendance-notes">
            Notes :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-textarea
              id="attendance-notes"
              v-model:value="form.notes"
              placeholder="Enter any additional notes..."
              :rows="3"
              style="width: 100%;"
            />
            <span class="tooltip-icon tooltip-icon-textarea" title="Optional notes about this attendance record">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <a-button @click="handleClose" :disabled="loading">
          Cancel
        </a-button>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ submitButtonText }}
        </a-button>
      </div>
    </form>
  </a-modal>
</template>

<style scoped>
/* Reset Ant Design 4 modal content padding */
:deep(.ant-modal-content) {
  padding: 0 !important;
}

/* Modal header styling - add divider line and spacing */
:deep(.ant-modal-header) {
  padding: 16px 24px !important;
  margin: 0 !important;
  border-bottom: 1px solid #e5e5e5 !important;
  background: #fff;
}

:deep(.ant-modal-title) {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

:deep(.ant-modal-body) {
  padding: 24px !important;
  margin-top: 0 !important;
}

:deep(.ant-modal-close) {
  top: 12px;
  right: 12px;
}

/* Horizontal form layout - labels on left, inputs on right */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.form-label-col {
  flex: 0 0 120px;
  min-width: 120px;
  padding-top: 6px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.form-input-col {
  flex: 1;
  min-width: 0;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0;
  display: block;
  text-align: right;
  color: #262626;
  font-size: 14px;
  white-space: nowrap;
}

/* Input width classes */
.input-short {
  width: 200px !important;
  max-width: 200px;
}

.input-long {
  width: 100% !important;
  max-width: 400px;
}

/* Total hours display */
.total-hours-display {
  display: inline-block;
  padding: 4px 11px;
  font-size: 14px;
  color: #262626;
  font-weight: 500;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  min-width: 100px;
  text-align: center;
}

/* Tooltip positioning */
.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 0;
}

.tooltip-icon {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  flex-shrink: 0;
}

.tooltip-icon-textarea {
  align-self: flex-start;
  margin-top: 8px;
}

/* Error feedback */
.error-feedback {
  display: block;
  width: 100%;
  margin-top: 5px;
  font-size: 0.875em;
  color: #ff4d4f;
  font-weight: 500;
}

.text-danger {
  color: #ff4d4f;
}

/* Responsive: stack vertically on small screens */
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

  .form-input-col {
    flex: 1;
    min-width: 100%;
  }

  .input-short,
  .input-long {
    width: 100% !important;
    max-width: 100%;
  }

  :deep(.ant-picker),
  :deep(.ant-select) {
    width: 100% !important;
  }
}

/* Button gap utility */
.gap-2 {
  gap: 0.5rem;
}

/* Ant Design component overrides for input widths */
:deep(.input-short.ant-picker),
:deep(.input-short.ant-select) {
  width: 200px !important;
}

:deep(.input-long.ant-select) {
  width: 100% !important;
  max-width: 400px;
}

/* Fix for select dropdown to prevent text clipping */
:deep(.ant-select-selector) {
  min-width: inherit;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.ant-select-selection-item) {
  line-height: 30px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.ant-select-selection-placeholder) {
  line-height: 30px !important;
  display: flex !important;
  align-items: center !important;
}
</style>

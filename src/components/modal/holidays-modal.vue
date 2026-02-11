<script>
import { ref, watch, computed } from 'vue';
import { holidayService } from '@/services/holiday.service';
import { message } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import moment from 'moment';

export default {
  name: 'HolidaysModal',
  components: {
    InfoCircleOutlined,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingHoliday: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'close'],
  setup(props, { emit }) {
    // Form state - use number for is_active (1/0) since a-select doesn't support boolean
    const form = ref({
      name: '',
      name_th: '',
      date: null,
      description: '',
      is_active: 1
    });

    // Loading states
    const loading = ref(false);
    const formErrors = ref({});

    // Status options - use numbers since a-select doesn't support boolean values
    const statusOptions = [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 }
    ];

    // Computed
    const isEditing = computed(() => !!props.editingHoliday);
    const modalTitle = computed(() => isEditing.value ? 'Edit Holiday' : 'Add Holiday');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Add Holiday');

    // Methods - defined before watchers that use them
    const resetForm = () => {
      form.value = {
        name: '',
        name_th: '',
        date: null,
        description: '',
        is_active: 1
      };
      formErrors.value = {};
    };

    // Watch for editing holiday changes
    watch(() => props.editingHoliday, (newVal) => {
      if (newVal) {
        form.value = {
          name: newVal.name || '',
          name_th: newVal.name_th || '',
          date: newVal.date ? moment(newVal.date) : null,
          description: newVal.description || '',
          // Convert boolean to number for a-select compatibility
          is_active: newVal.is_active ? 1 : 0
        };
      } else {
        resetForm();
      }
    }, { immediate: true });

    // Watch visibility to reset form when closed
    watch(() => props.visible, (newVal) => {
      if (!newVal) {
        // Modal is closing, don't reset if we still have editingHoliday
        // This is handled by the parent component
      } else if (!props.editingHoliday) {
        // Opening for add mode
        resetForm();
      }
    });

    const validateForm = () => {
      const errors = {};

      if (!form.value.name?.trim()) {
        errors.name = 'Holiday name is required';
      }

      if (!form.value.date) {
        errors.date = 'Date is required';
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
        // Prepare data for API - convert number back to boolean
        const data = {
          name: form.value.name.trim(),
          name_th: form.value.name_th?.trim() || null,
          date: moment(form.value.date).format('YYYY-MM-DD'),
          description: form.value.description?.trim() || null,
          is_active: form.value.is_active === 1
        };

        let response;
        if (isEditing.value) {
          response = await holidayService.updateHoliday(props.editingHoliday.id, data);
        } else {
          response = await holidayService.createHoliday(data);
        }

        if (response.success) {
          message.success(isEditing.value ? 'Holiday updated successfully' : 'Holiday created successfully');
          emit('saved', response);
          handleClose();
        } else {
          message.error(response.message || 'Failed to save holiday');
        }
      } catch (error) {
        console.error('Error saving holiday:', error);
        message.error(error.message || 'Failed to save holiday');
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
      // Force cleanup of any lingering modal backdrops
      const backdrops = document.querySelectorAll('.ant-modal-mask, .ant-modal-wrap');
      const openModals = document.querySelectorAll('.ant-modal-wrap:not([style*="display: none"])');

      // Only clean up if no other modals are open
      if (openModals.length === 0) {
        backdrops.forEach(el => {
          if (el.style.display !== 'none') {
            el.style.display = 'none';
          }
        });
      }

      // Also restore body scroll if needed
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    return {
      form,
      loading,
      formErrors,
      statusOptions,
      isEditing,
      modalTitle,
      submitButtonText,
      handleSubmit,
      handleClose,
      handleAfterClose,
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
    :width="600"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <form @submit.prevent="handleSubmit">
      <!-- Holiday Name -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="holiday-name">
            Holiday Name <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-input
              id="holiday-name"
              v-model:value="form.name"
              placeholder="Enter holiday name"
              :status="formErrors.name ? 'error' : ''"
              class="input-medium"
            />
            <span class="tooltip-icon" title="Enter the official name of the holiday">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.name" class="error-feedback">
            {{ formErrors.name }}
          </div>
        </div>
      </div>

      <!-- Holiday Name (Thai) -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="holiday-name-th">
            Holiday Name (Thai) :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-input
              id="holiday-name-th"
              v-model:value="form.name_th"
              placeholder="Enter holiday name in Thai"
              class="input-medium"
            />
            <span class="tooltip-icon" title="Optional: Enter the Thai name of the holiday">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
        </div>
      </div>

      <!-- Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="holiday-date">
            Date <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              id="holiday-date"
              v-model:value="form.date"
              class="input-short"
              placeholder="Select date"
              format="DD/MM/YYYY"
              :status="formErrors.date ? 'error' : ''"
            />
            <span class="tooltip-icon" title="Select the date of the holiday">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.date" class="error-feedback">
            {{ formErrors.date }}
          </div>
        </div>
      </div>

      <!-- Status -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="holiday-status">
            Status :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-select
              id="holiday-status"
              v-model:value="form.is_active"
              placeholder="Select status"
              class="input-short"
              :options="statusOptions"
            />
            <span class="tooltip-icon" title="Set whether the holiday is active or inactive">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="holiday-description">
            Description :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-textarea
              id="holiday-description"
              v-model:value="form.description"
              placeholder="Enter holiday description"
              :rows="3"
              style="width: 100%;"
            />
            <span class="tooltip-icon tooltip-icon-textarea" title="Optional: Add any additional notes or description about the holiday">
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
  flex: 0 0 160px;
  min-width: 160px;
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

.input-medium {
  width: 300px !important;
  max-width: 300px;
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
  .input-medium {
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

:deep(.input-medium.ant-input) {
  width: 300px !important;
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

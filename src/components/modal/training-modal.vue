<script>
import { ref, watch, computed } from 'vue';
import { trainingService } from '@/services/training.service';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

export default {
  name: 'TrainingModal',
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
    const form = ref({
      title: '',
      organizer: '',
      start_date: null,
      end_date: null,
    });

    const loading = ref(false);
    const formErrors = ref({});

    const isEditing = computed(() => !!props.editingRecord);
    const modalTitle = computed(() => isEditing.value ? 'Edit Training Program' : 'Add New Training Program');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Add Training');

    const duration = computed(() => {
      if (!form.value.start_date || !form.value.end_date) return null;
      const start = dayjs(form.value.start_date);
      const end = dayjs(form.value.end_date);
      if (!start.isValid() || !end.isValid()) return null;
      const days = end.diff(start, 'day') + 1;
      if (days < 1) return null;
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    });

    const resetForm = () => {
      form.value = {
        title: '',
        organizer: '',
        start_date: null,
        end_date: null,
      };
      formErrors.value = {};
    };

    watch(() => props.editingRecord, (newVal) => {
      if (newVal) {
        form.value = {
          title: newVal.title || '',
          organizer: newVal.organizer || '',
          start_date: newVal.start_date ? dayjs(newVal.start_date) : null,
          end_date: newVal.end_date ? dayjs(newVal.end_date) : null,
        };
      } else {
        resetForm();
      }
    }, { immediate: true });

    watch(() => props.visible, (newVal) => {
      if (newVal && !props.editingRecord) {
        resetForm();
      }
    });

    const validateForm = () => {
      const errors = {};
      if (!form.value.title?.trim()) {
        errors.title = 'Training title is required';
      }
      if (!form.value.organizer?.trim()) {
        errors.organizer = 'Organizer is required';
      }
      if (!form.value.start_date) {
        errors.start_date = 'Start date is required';
      }
      if (!form.value.end_date) {
        errors.end_date = 'End date is required';
      }
      if (form.value.start_date && form.value.end_date) {
        const start = dayjs(form.value.start_date);
        const end = dayjs(form.value.end_date);
        if (end.isBefore(start)) {
          errors.end_date = 'End date must be after start date';
        }
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
        const data = {
          title: form.value.title?.trim(),
          organizer: form.value.organizer?.trim(),
          start_date: form.value.start_date ? dayjs(form.value.start_date).format('YYYY-MM-DD') : null,
          end_date: form.value.end_date ? dayjs(form.value.end_date).format('YYYY-MM-DD') : null,
        };

        let response;
        if (isEditing.value) {
          response = await trainingService.updateTraining(props.editingRecord.id, data);
        } else {
          response = await trainingService.createTraining(data);
        }

        if (response.success) {
          message.success(isEditing.value ? 'Training updated successfully' : 'Training created successfully');
          emit('saved', response);
          handleClose();
        } else {
          message.error(response.message || 'Failed to save training');
        }
      } catch (error) {
        if (error.status === 422 && error.errors) {
          Object.keys(error.errors).forEach(field => {
            if (Array.isArray(error.errors[field]) && error.errors[field].length > 0) {
              formErrors.value[field] = error.errors[field][0];
            }
          });
          message.error('Please correct the errors and try again');
        } else {
          message.error(error.message || 'Failed to save training');
        }
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      resetForm();
      emit('close');
    };

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

    return {
      form,
      loading,
      formErrors,
      isEditing,
      modalTitle,
      submitButtonText,
      duration,
      handleSubmit,
      handleClose,
      handleAfterClose,
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
      <!-- Title -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="training-title">
            Title <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="training-title"
            v-model:value="form.title"
            placeholder="Enter training title"
            :status="formErrors.title ? 'error' : ''"
            :maxlength="200"
            show-count
            class="input-long"
          />
          <div v-if="formErrors.title" class="error-feedback">
            {{ formErrors.title }}
          </div>
        </div>
      </div>

      <!-- Organizer -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="training-organizer">
            Organizer <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="training-organizer"
            v-model:value="form.organizer"
            placeholder="Enter organizer name or organization"
            :status="formErrors.organizer ? 'error' : ''"
            :maxlength="100"
            show-count
            class="input-long"
          />
          <div v-if="formErrors.organizer" class="error-feedback">
            {{ formErrors.organizer }}
          </div>
        </div>
      </div>

      <!-- Start Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="training-start-date">
            Start Date <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-date-picker
            id="training-start-date"
            v-model:value="form.start_date"
            format="DD/MM/YYYY"
            placeholder="Select start date"
            :status="formErrors.start_date ? 'error' : ''"
            style="width: 200px;"
          />
          <div v-if="formErrors.start_date" class="error-feedback">
            {{ formErrors.start_date }}
          </div>
        </div>
      </div>

      <!-- End Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="training-end-date">
            End Date <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-date-picker
            id="training-end-date"
            v-model:value="form.end_date"
            format="DD/MM/YYYY"
            placeholder="Select end date"
            :status="formErrors.end_date ? 'error' : ''"
            style="width: 200px;"
          />
          <div v-if="formErrors.end_date" class="error-feedback">
            {{ formErrors.end_date }}
          </div>
        </div>
      </div>

      <!-- Duration Display -->
      <div v-if="duration" class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">
            Duration :
          </label>
        </div>
        <div class="form-input-col">
          <div class="duration-badge">
            <i class="ti ti-calendar-time me-1"></i>
            {{ duration }}
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
:deep(.ant-modal-content) {
  padding: 0 !important;
}

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

.input-long {
  width: 100% !important;
  max-width: 400px;
}

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

.duration-badge {
  display: inline-flex;
  align-items: center;
  background-color: #e7f3ff;
  border: 1px solid #b3d9ff;
  color: #004085;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

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

  .input-long {
    width: 100% !important;
    max-width: 100%;
  }

  :deep(.ant-picker),
  :deep(.ant-select) {
    width: 100% !important;
  }
}

.gap-2 {
  gap: 0.5rem;
}

:deep(.input-long.ant-input) {
  width: 100% !important;
  max-width: 400px;
}
</style>

<script>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useJobOfferStore } from '@/stores/jobOfferStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import { message, Modal as AntModal } from 'ant-design-vue';
import { InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { h } from 'vue';

export default {
  name: 'JobOffersModal',
  components: {
    InfoCircleOutlined,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingJobOffer: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'close'],
  setup(props, { emit }) {
    // Form state
    const form = ref({
      id: null,
      candidate_name: '',
      position_name: '',
      custom_offer_id: '',
      probation_salary: null,
      post_probation_salary: null,
      date: null,
      acceptance_deadline: null,
      acceptance_status: 'pending',
      note: ''
    });

    // Loading and error states
    const loading = ref(false);
    const formErrors = ref({});

    // Form persistence state
    const isDraftMode = ref(false);
    const formKey = ref(null);
    const originalFormData = ref({});
    const saveTimeout = ref(null);
    const restoredDataNotification = ref({
      show: false,
      timeAgo: ''
    });

    // Status options for acceptance status
    const statusOptions = [
      { label: 'Pending', value: 'pending' },
      { label: 'Accepted', value: 'accepted' },
      { label: 'Rejected', value: 'rejected' }
    ];

    // Computed
    const isEditing = computed(() => !!props.editingJobOffer);
    const modalTitle = computed(() => isEditing.value ? 'Edit Job Offer' : 'Add Job Offer');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Add Job Offer');

    const hasUnsavedChanges = computed(() => {
      if (!isDraftMode.value) return false;
      return JSON.stringify(form.value) !== JSON.stringify(originalFormData.value);
    });

    // Methods
    const resetForm = () => {
      form.value = {
        id: null,
        candidate_name: '',
        position_name: '',
        custom_offer_id: '',
        probation_salary: null,
        post_probation_salary: null,
        date: null,
        acceptance_deadline: null,
        acceptance_status: 'pending',
        note: ''
      };
      formErrors.value = {};
      originalFormData.value = {};
      restoredDataNotification.value.show = false;
    };

    const showRestoredDataNotification = (timestamp) => {
      const timeAgo = dayjs(timestamp).fromNow();
      restoredDataNotification.value = {
        show: true,
        timeAgo: timeAgo
      };

      // Auto-hide notification after 10 seconds
      setTimeout(() => {
        restoredDataNotification.value.show = false;
      }, 10000);
    };

    const handleFormChange = () => {
      if (isDraftMode.value && formKey.value) {
        // Save to form persistence store with debouncing
        clearTimeout(saveTimeout.value);
        saveTimeout.value = setTimeout(() => {
          const formPersistenceStore = useFormPersistenceStore();
          // Convert dayjs objects to ISO strings for persistence
          const dataToSave = {
            ...form.value,
            date: form.value.date ? dayjs(form.value.date).format('YYYY-MM-DD') : null,
            acceptance_deadline: form.value.acceptance_deadline ? dayjs(form.value.acceptance_deadline).format('YYYY-MM-DD') : null
          };
          formPersistenceStore.saveFormData(formKey.value, dataToSave);
        }, 500);
      }
    };

    // Watch for editing job offer changes
    watch(() => props.editingJobOffer, (newVal) => {
      if (newVal) {
        form.value = {
          id: newVal.id || null,
          candidate_name: newVal.candidate_name || '',
          position_name: newVal.position_name || '',
          custom_offer_id: newVal.custom_offer_id || '',
          probation_salary: newVal.probation_salary || null,
          post_probation_salary: newVal.post_probation_salary || null,
          date: newVal.date ? dayjs(newVal.date) : null,
          acceptance_deadline: newVal.acceptance_deadline ? dayjs(newVal.acceptance_deadline) : null,
          acceptance_status: newVal.acceptance_status || 'pending',
          note: newVal.note || ''
        };
        originalFormData.value = JSON.parse(JSON.stringify({
          ...form.value,
          date: form.value.date ? form.value.date.format('YYYY-MM-DD') : null,
          acceptance_deadline: form.value.acceptance_deadline ? form.value.acceptance_deadline.format('YYYY-MM-DD') : null
        }));
      } else {
        resetForm();
      }
    }, { immediate: true });

    // Watch visibility to handle form persistence
    watch(() => props.visible, async (newVal) => {
      if (newVal) {
        // Modal is opening
        isDraftMode.value = true;
        formKey.value = isEditing.value
          ? `job_offer_edit_${props.editingJobOffer?.id || 'new'}`
          : `job_offer_new_${Date.now()}`;

        if (!props.editingJobOffer) {
          // Check for restored data first
          const formPersistenceStore = useFormPersistenceStore();
          const savedDataResult = await formPersistenceStore.checkForSavedData(formKey.value);

          if (savedDataResult.hasSavedData) {
            // Restore saved data
            const savedData = savedDataResult.data;
            form.value = {
              ...form.value,
              ...savedData,
              date: savedData.date ? dayjs(savedData.date) : null,
              acceptance_deadline: savedData.acceptance_deadline ? dayjs(savedData.acceptance_deadline) : null
            };
            showRestoredDataNotification(savedDataResult.timestamp);
          } else {
            // Set defaults for new entry
            form.value.date = dayjs();
          }

          originalFormData.value = JSON.parse(JSON.stringify({
            ...form.value,
            date: form.value.date ? dayjs(form.value.date).format('YYYY-MM-DD') : null,
            acceptance_deadline: form.value.acceptance_deadline ? dayjs(form.value.acceptance_deadline).format('YYYY-MM-DD') : null
          }));
        }
      }
    });

    const validateForm = () => {
      const errors = {};

      if (!form.value.date) {
        errors.date = 'Offer date is required';
      }

      if (!form.value.acceptance_deadline) {
        errors.acceptance_deadline = 'Acceptance deadline is required';
      }

      if (!form.value.probation_salary || form.value.probation_salary <= 0) {
        errors.probation_salary = 'Probation salary is required and must be greater than 0';
      }

      if (!form.value.post_probation_salary || form.value.post_probation_salary <= 0) {
        errors.post_probation_salary = 'Post-probation salary is required and must be greater than 0';
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
        const jobOfferStore = useJobOfferStore();

        // Prepare data for API
        const data = {
          candidate_name: form.value.candidate_name?.trim() || null,
          position_name: form.value.position_name?.trim() || null,
          custom_offer_id: form.value.custom_offer_id?.trim() || null,
          probation_salary: form.value.probation_salary,
          post_probation_salary: form.value.post_probation_salary,
          date: form.value.date ? dayjs(form.value.date).format('YYYY-MM-DD') : null,
          acceptance_deadline: form.value.acceptance_deadline ? dayjs(form.value.acceptance_deadline).format('YYYY-MM-DD') : null,
          acceptance_status: form.value.acceptance_status,
          note: form.value.note?.trim() || null
        };

        if (isEditing.value) {
          await jobOfferStore.updateJobOffer(form.value.id, data);
          message.success('Job offer updated successfully');
        } else {
          await jobOfferStore.createJobOffer(data);
          message.success('Job offer created successfully');
        }

        // Clear form persistence after successful submit
        if (formKey.value) {
          const formPersistenceStore = useFormPersistenceStore();
          formPersistenceStore.clearFormData(formKey.value);
        }

        isDraftMode.value = false;
        emit('saved');
        handleClose();
      } catch (error) {
        console.error('Error saving job offer:', error);

        // Handle validation errors from server (422)
        if (error.status === 422 && error.errors) {
          Object.keys(error.errors).forEach(field => {
            if (Array.isArray(error.errors[field]) && error.errors[field].length > 0) {
              formErrors.value[field] = error.errors[field][0];
            }
          });
          message.error('Please correct the errors and try again');
        } else {
          message.error(error.message || 'Failed to save job offer');
        }
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      if (hasUnsavedChanges.value) {
        showUnsavedChangesConfirm();
      } else {
        forceClose();
      }
    };

    const showUnsavedChangesConfirm = () => {
      AntModal.confirm({
        title: 'Unsaved Changes',
        icon: h(ExclamationCircleOutlined),
        content: 'You have unsaved changes in the job offer form. What would you like to do?',
        okText: 'Continue Editing',
        cancelText: 'Discard Changes',
        centered: true,
        cancelButtonProps: {
          danger: true
        },
        onOk: () => {
          // User wants to continue editing - do nothing
          return Promise.resolve();
        },
        onCancel: () => {
          // User wants to discard changes
          forceClose();
          return Promise.resolve();
        }
      });
    };

    const forceClose = () => {
      isDraftMode.value = false;

      // Clear form persistence
      if (formKey.value) {
        const formPersistenceStore = useFormPersistenceStore();
        formPersistenceStore.clearFormData(formKey.value);
      }

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

    // Cleanup on unmount
    onUnmounted(() => {
      if (saveTimeout.value) {
        clearTimeout(saveTimeout.value);
      }
    });

    return {
      form,
      loading,
      formErrors,
      statusOptions,
      isEditing,
      modalTitle,
      submitButtonText,
      hasUnsavedChanges,
      restoredDataNotification,
      handleSubmit,
      handleClose,
      handleAfterClose,
      handleFormChange,
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
    :width="700"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <form @submit.prevent="handleSubmit">
      <!-- Restored Data Notification -->
      <a-alert
        v-if="restoredDataNotification.show"
        type="info"
        show-icon
        closable
        @close="restoredDataNotification.show = false"
        class="mb-3"
      >
        <template #message>
          Your unsaved changes from {{ restoredDataNotification.timeAgo }} have been restored.
        </template>
      </a-alert>

      <!-- Offer Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="offer-date">
            Offer Date <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              id="offer-date"
              v-model:value="form.date"
              class="input-short"
              placeholder="Select date"
              format="DD MMM YYYY"
              :status="formErrors.date ? 'error' : ''"
              @change="handleFormChange"
            />
            <span class="tooltip-icon" title="Select the date when the job offer was made">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.date" class="error-feedback">
            {{ formErrors.date }}
          </div>
        </div>
      </div>

      <!-- Candidate Name -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="candidate-name">
            Candidate Name :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="candidate-name"
            v-model:value="form.candidate_name"
            placeholder="Enter candidate name"
            class="input-medium"
            @change="handleFormChange"
          />
        </div>
      </div>

      <!-- Position Name -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="position-name">
            Position Name :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="position-name"
            v-model:value="form.position_name"
            placeholder="Enter position name"
            class="input-medium"
            @change="handleFormChange"
          />
        </div>
      </div>

      <!-- Acceptance Deadline -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="acceptance-deadline">
            Acceptance Deadline <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              id="acceptance-deadline"
              v-model:value="form.acceptance_deadline"
              class="input-short"
              placeholder="Select deadline"
              format="DD MMM YYYY"
              :status="formErrors.acceptance_deadline ? 'error' : ''"
              @change="handleFormChange"
            />
            <span class="tooltip-icon" title="Select the deadline for candidate acceptance">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.acceptance_deadline" class="error-feedback">
            {{ formErrors.acceptance_deadline }}
          </div>
        </div>
      </div>

      <!-- Acceptance Status -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="acceptance-status">
            Acceptance Status :
          </label>
        </div>
        <div class="form-input-col">
          <a-select
            id="acceptance-status"
            v-model:value="form.acceptance_status"
            placeholder="Select status"
            class="input-short"
            :options="statusOptions"
            @change="handleFormChange"
          />
        </div>
      </div>

      <!-- Probation Salary -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="probation-salary">
            Probation Salary (THB) <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-input-number
              id="probation-salary"
              v-model:value="form.probation_salary"
              placeholder="Enter salary"
              class="input-medium"
              :min="0"
              :step="100"
              :precision="2"
              :status="formErrors.probation_salary ? 'error' : ''"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/,/g, '')"
              @change="handleFormChange"
            />
            <span class="tooltip-icon" title="Enter the salary during probation period in Thai Baht">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.probation_salary" class="error-feedback">
            {{ formErrors.probation_salary }}
          </div>
        </div>
      </div>

      <!-- Post-Probation Salary -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="post-probation-salary">
            Post-Probation Salary (THB) <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-input-number
              id="post-probation-salary"
              v-model:value="form.post_probation_salary"
              placeholder="Enter salary"
              class="input-medium"
              :min="0"
              :step="100"
              :precision="2"
              :status="formErrors.post_probation_salary ? 'error' : ''"
              :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/,/g, '')"
              @change="handleFormChange"
            />
            <span class="tooltip-icon" title="Enter the salary after probation period in Thai Baht">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.post_probation_salary" class="error-feedback">
            {{ formErrors.post_probation_salary }}
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="job-offer-note">
            Notes :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-textarea
              id="job-offer-note"
              v-model:value="form.note"
              placeholder="Enter any additional notes about the job offer..."
              :rows="3"
              style="width: 100%;"
              @change="handleFormChange"
            />
            <span class="tooltip-icon tooltip-icon-textarea" title="Add any additional notes or comments about the job offer">
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
/* Horizontal form layout - labels on left, inputs on right */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.form-label-col {
  flex: 0 0 200px;
  min-width: 200px;
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
  :deep(.ant-select),
  :deep(.ant-input-number) {
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

:deep(.input-medium.ant-input),
:deep(.input-medium.ant-input-number) {
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

/* Input number formatting */
:deep(.ant-input-number-input) {
  text-align: left;
}

/* Alert margin */
.mb-3 {
  margin-bottom: 1rem;
}
</style>

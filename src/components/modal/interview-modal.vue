<script>
import { ref, watch, computed } from 'vue';
import { message, Modal as AntModal } from 'ant-design-vue';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { useInterviewStore } from '@/stores/interviewStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import dayjs from 'dayjs';

export default {
  name: 'InterviewModal',
  components: {
    InfoCircleOutlined,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingInterview: {
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
      phone: '',
      job_position: '',
      interviewer_name: '',
      interview_date: null,
      start_time: null,
      end_time: null,
      interview_mode: 'In-person',
      interview_status: 'Scheduled',
      score: null,
      feedback: '',
      reference_info: '',
      hired_status: ''
    });

    // Loading and validation states
    const loading = ref(false);
    const formErrors = ref({});
    const alertMessage = ref('');
    const alertClass = ref('');

    // Form persistence
    const isDraftMode = ref(false);
    const hasUnsavedChanges = ref(false);
    const restoredDataNotification = ref({
      show: false,
      timestamp: null
    });

    // Stores
    const interviewStore = useInterviewStore();
    const formPersistenceStore = useFormPersistenceStore();

    // Computed
    const isEditing = computed(() => !!props.editingInterview);
    const modalTitle = computed(() => isEditing.value ? 'Edit Interview' : 'Add Interview');
    const submitButtonText = computed(() => isEditing.value ? 'Update' : 'Save');

    // Interview mode options
    const interviewModeOptions = [
      { label: 'In-person', value: 'In-person' },
      { label: 'Virtual', value: 'Virtual' },
      { label: 'Phone', value: 'Phone' }
    ];

    // Interview status options
    const interviewStatusOptions = [
      { label: 'Scheduled', value: 'Scheduled' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'In Progress', value: 'In Progress' }
    ];

    // Hired status options
    const hiredStatusOptions = [
      { label: 'Hired', value: 'Hired' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Pending', value: 'Pending' }
    ];

    // Methods
    const resetForm = () => {
      form.value = {
        id: null,
        candidate_name: '',
        phone: '',
        job_position: '',
        interviewer_name: '',
        interview_date: null,
        start_time: null,
        end_time: null,
        interview_mode: 'In-person',
        interview_status: 'Scheduled',
        score: null,
        feedback: '',
        reference_info: '',
        hired_status: ''
      };
      formErrors.value = {};
      alertMessage.value = '';
      alertClass.value = '';
      hasUnsavedChanges.value = false;
      restoredDataNotification.value.show = false;
    };

    const formatTimeForInput = (timeString) => {
      if (!timeString) return null;
      // Convert HH:mm:ss or HH:mm to dayjs time object
      const timeParts = timeString.split(':');
      if (timeParts.length >= 2) {
        return dayjs().hour(parseInt(timeParts[0])).minute(parseInt(timeParts[1])).second(0);
      }
      return null;
    };

    const formatTimeWithSeconds = (timeValue) => {
      if (!timeValue) return null;
      if (dayjs.isDayjs(timeValue)) {
        return timeValue.format('HH:mm:ss');
      }
      return timeValue;
    };

    // Watch for editing interview changes
    watch(() => props.editingInterview, (newVal) => {
      if (newVal) {
        form.value = {
          id: newVal.id,
          candidate_name: newVal.candidate_name || '',
          phone: newVal.phone || '',
          job_position: newVal.job_position || '',
          interviewer_name: newVal.interviewer_name || '',
          interview_date: newVal.interview_date ? dayjs(newVal.interview_date) : null,
          start_time: formatTimeForInput(newVal.start_time),
          end_time: formatTimeForInput(newVal.end_time),
          interview_mode: newVal.interview_mode || 'In-person',
          interview_status: newVal.interview_status || 'Scheduled',
          score: newVal.score ?? null,
          feedback: newVal.feedback || '',
          reference_info: newVal.reference_info || '',
          hired_status: newVal.hired_status || ''
        };
        isDraftMode.value = false;
        hasUnsavedChanges.value = false;
      } else {
        resetForm();
      }
    }, { immediate: true });

    // Watch visibility
    watch(() => props.visible, (newVal) => {
      if (newVal) {
        if (!props.editingInterview) {
          // Check for draft
          const hasDraft = loadFormDraft();
          if (!hasDraft) {
            resetForm();
          }
          isDraftMode.value = true;
        }
      }
    });

    // Form change handler
    const handleFormChange = () => {
      if (isDraftMode.value) {
        hasUnsavedChanges.value = true;
        saveFormState();
      }
    };

    // Form persistence methods
    const saveFormState = () => {
      try {
        const draftData = {
          formData: { ...form.value },
          timestamp: Date.now()
        };
        // Convert dayjs objects for storage
        if (draftData.formData.interview_date && dayjs.isDayjs(draftData.formData.interview_date)) {
          draftData.formData.interview_date = draftData.formData.interview_date.toISOString();
        }
        if (draftData.formData.start_time && dayjs.isDayjs(draftData.formData.start_time)) {
          draftData.formData.start_time = draftData.formData.start_time.format('HH:mm:ss');
        }
        if (draftData.formData.end_time && dayjs.isDayjs(draftData.formData.end_time)) {
          draftData.formData.end_time = draftData.formData.end_time.format('HH:mm:ss');
        }
        formPersistenceStore.saveFormSection('interview', 'interviewForm', draftData);
      } catch (error) {
        console.error('Error saving form draft:', error);
      }
    };

    const loadFormDraft = () => {
      try {
        const savedData = formPersistenceStore.checkForSavedData('interview');
        if (savedData.hasSavedData && savedData.data?.interviewForm) {
          const parsed = savedData.data.interviewForm;
          const isRecent = (Date.now() - parsed.timestamp) < (24 * 60 * 60 * 1000);
          if (isRecent) {
            form.value = { ...parsed.formData };
            // Convert stored strings back to dayjs
            if (form.value.interview_date) {
              form.value.interview_date = dayjs(form.value.interview_date);
            }
            if (form.value.start_time) {
              form.value.start_time = formatTimeForInput(form.value.start_time);
            }
            if (form.value.end_time) {
              form.value.end_time = formatTimeForInput(form.value.end_time);
            }
            hasUnsavedChanges.value = true;
            restoredDataNotification.value.show = true;
            restoredDataNotification.value.timestamp = parsed.timestamp;
            return true;
          } else {
            clearFormDraft();
          }
        }
      } catch (error) {
        console.error('Error loading form draft:', error);
        clearFormDraft();
      }
      return false;
    };

    const clearFormDraft = () => {
      try {
        formPersistenceStore.clearFormSection('interview', 'interviewForm');
      } catch (error) {
        console.error('Error clearing form draft:', error);
      }
    };

    // Validation methods
    const validatePhone = () => {
      const phone = form.value.phone;
      if (!phone || phone.trim() === '') {
        formErrors.value.phone = 'Phone number is required';
        return false;
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length === 10) {
        if (!cleanPhone.startsWith('0')) {
          formErrors.value.phone = 'Thai phone number must start with 0';
          return false;
        }
      } else if (cleanPhone.length === 11) {
        if (!cleanPhone.startsWith('09')) {
          formErrors.value.phone = 'Myanmar phone number must start with 09';
          return false;
        }
      } else {
        formErrors.value.phone = 'Phone must be 10 digits (Thai) or 11 digits (Myanmar)';
        return false;
      }
      delete formErrors.value.phone;
      return true;
    };

    const validateScore = () => {
      const score = form.value.score;
      if (!score || score === '') {
        delete formErrors.value.score;
        return true;
      }
      const numericScore = parseFloat(score);
      if (isNaN(numericScore)) {
        formErrors.value.score = 'Score must be a valid number';
        return false;
      }
      if (numericScore < 0 || numericScore > 100) {
        formErrors.value.score = 'Score must be between 0 and 100';
        return false;
      }
      delete formErrors.value.score;
      return true;
    };

    const validateForm = () => {
      let isValid = true;
      formErrors.value = {};

      if (!form.value.candidate_name?.trim()) {
        formErrors.value.candidate_name = 'Candidate name is required';
        isValid = false;
      }
      if (!form.value.job_position?.trim()) {
        formErrors.value.job_position = 'Job position is required';
        isValid = false;
      }
      if (!form.value.interview_date) {
        formErrors.value.interview_date = 'Interview date is required';
        isValid = false;
      }

      const phoneValid = validatePhone();
      const scoreValid = validateScore();

      return isValid && phoneValid && scoreValid;
    };

    // Submit handler
    const handleSubmit = async () => {
      if (!validateForm()) {
        message.warning('Please fill in all required fields correctly');
        return;
      }

      loading.value = true;
      alertMessage.value = '';
      try {
        const formattedData = {
          ...form.value,
          interview_date: form.value.interview_date ? dayjs(form.value.interview_date).format('YYYY-MM-DD') : null,
          start_time: formatTimeWithSeconds(form.value.start_time),
          end_time: formatTimeWithSeconds(form.value.end_time)
        };

        let response;
        if (isEditing.value) {
          response = await interviewStore.updateInterview(form.value.id, formattedData);
        } else {
          response = await interviewStore.createInterview(formattedData);
        }

        if (response && response.success !== false) {
          message.success(isEditing.value ? 'Interview updated successfully' : 'Interview added successfully');
          clearFormDraft();
          hasUnsavedChanges.value = false;
          isDraftMode.value = false;
          emit('saved', response);
          handleClose();
        } else {
          alertMessage.value = response?.message || 'Failed to save interview';
          alertClass.value = 'alert-danger';
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        if (error.status === 422 && error.errors) {
          Object.keys(error.errors).forEach(field => {
            if (Array.isArray(error.errors[field])) {
              formErrors.value[field] = error.errors[field][0];
            }
          });
          alertMessage.value = 'Validation failed. Please check your input.';
        } else {
          alertMessage.value = error.message || 'An error occurred while saving the interview';
        }
        alertClass.value = 'alert-danger';
      } finally {
        loading.value = false;
      }
    };

    // Close handlers
    const handleClose = () => {
      if (hasUnsavedChanges.value && isDraftMode.value) {
        showUnsavedChangesConfirm();
      } else {
        resetForm();
        emit('close');
      }
    };

    const showUnsavedChangesConfirm = () => {
      AntModal.confirm({
        title: 'Unsaved Changes',
        icon: () => null,
        content: 'You have unsaved changes. What would you like to do?',
        centered: true,
        okText: 'Continue Editing',
        cancelText: 'Discard Changes',
        cancelButtonProps: { danger: true },
        onOk: () => Promise.resolve(),
        onCancel: () => {
          clearFormDraft();
          resetForm();
          emit('close');
          return Promise.resolve();
        }
      });
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

    // Time ago formatter
    const formatRestoredTime = (timestamp) => {
      if (!timestamp) return 'earlier';
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      if (seconds < 60) return 'just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
    };

    return {
      form,
      loading,
      formErrors,
      alertMessage,
      alertClass,
      isEditing,
      modalTitle,
      submitButtonText,
      interviewModeOptions,
      interviewStatusOptions,
      hiredStatusOptions,
      restoredDataNotification,
      handleFormChange,
      handleSubmit,
      handleClose,
      handleAfterClose,
      formatRestoredTime
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
        Restored your previous unsaved changes from {{ formatRestoredTime(restoredDataNotification.timestamp) }}
      </template>
    </a-alert>

    <!-- Error Alert -->
    <a-alert
      v-if="alertMessage"
      :type="alertClass === 'alert-danger' ? 'error' : 'warning'"
      :message="alertMessage"
      show-icon
      class="mb-3"
    />

    <form @submit.prevent="handleSubmit">
      <!-- Candidate Name -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Candidate Name <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <a-input
            v-model:value="form.candidate_name"
            placeholder="Enter candidate name"
            :status="formErrors.candidate_name ? 'error' : ''"
            class="input-medium"
            @change="handleFormChange"
          />
          <div v-if="formErrors.candidate_name" class="error-feedback">{{ formErrors.candidate_name }}</div>
        </div>
      </div>

      <!-- Phone -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Phone <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-input
              v-model:value="form.phone"
              placeholder="Enter 10 digits (Thai) or 11 digits (Myanmar)"
              :status="formErrors.phone ? 'error' : ''"
              class="input-medium"
              @change="handleFormChange"
            />
            <a-tooltip title="Thai numbers: 10 digits (e.g., 0812345678) | Myanmar numbers: 11 digits (e.g., 09123456789)">
              <info-circle-outlined class="tooltip-icon" />
            </a-tooltip>
          </div>
          <div v-if="formErrors.phone" class="error-feedback">{{ formErrors.phone }}</div>
        </div>
      </div>

      <!-- Job Position -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Job Position <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <a-input
            v-model:value="form.job_position"
            placeholder="Enter job position"
            :status="formErrors.job_position ? 'error' : ''"
            @change="handleFormChange"
          />
          <div v-if="formErrors.job_position" class="error-feedback">{{ formErrors.job_position }}</div>
        </div>
      </div>

      <!-- Interview Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Interview Date <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              v-model:value="form.interview_date"
              class="input-short"
              placeholder="Select date"
              format="DD MMM YYYY"
              :status="formErrors.interview_date ? 'error' : ''"
              @change="handleFormChange"
            />
            <a-tooltip title="Select the date for the interview">
              <info-circle-outlined class="tooltip-icon" />
            </a-tooltip>
          </div>
          <div v-if="formErrors.interview_date" class="error-feedback">{{ formErrors.interview_date }}</div>
        </div>
      </div>

      <!-- Start Time & End Time -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Start Time :</label>
        </div>
        <div class="form-input-col">
          <a-time-picker
            v-model:value="form.start_time"
            class="input-short"
            format="HH:mm"
            placeholder="Select time"
            @change="handleFormChange"
          />
        </div>
      </div>

      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">End Time :</label>
        </div>
        <div class="form-input-col">
          <a-time-picker
            v-model:value="form.end_time"
            class="input-short"
            format="HH:mm"
            placeholder="Select time"
            @change="handleFormChange"
          />
        </div>
      </div>

      <!-- Interview Mode -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Interview Mode :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="form.interview_mode"
            :options="interviewModeOptions"
            class="input-short"
            @change="handleFormChange"
          />
        </div>
      </div>

      <!-- Interview Status -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Interview Status :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="form.interview_status"
            :options="interviewStatusOptions"
            class="input-short"
            @change="handleFormChange"
          />
        </div>
      </div>

      <!-- Score -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Score :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-input-number
              v-model:value="form.score"
              class="input-short"
              placeholder="0-100"
              :min="0"
              :max="100"
              :status="formErrors.score ? 'error' : ''"
              @change="handleFormChange"
            />
            <a-tooltip title="Enter a numeric score between 0 and 100">
              <info-circle-outlined class="tooltip-icon" />
            </a-tooltip>
          </div>
          <div v-if="formErrors.score" class="error-feedback">{{ formErrors.score }}</div>
        </div>
      </div>

      <!-- Hired Status -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Hired Status :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="form.hired_status"
            :options="hiredStatusOptions"
            class="input-short"
            placeholder="Select status"
            allowClear
            @change="handleFormChange"
          />
        </div>
      </div>

      <!-- Interviewer Name -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Interviewer Name / Position :</label>
        </div>
        <div class="form-input-col">
          <a-textarea
            v-model:value="form.interviewer_name"
            placeholder="Enter interviewer name and position"
            :rows="2"
            @change="handleFormChange"
          />
        </div>
      </div>

      <!-- Feedback -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Feedback :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-textarea
              v-model:value="form.feedback"
              placeholder="Provide feedback about the interview"
              :rows="3"
              style="width: 100%;"
              @change="handleFormChange"
            />
            <span class="tooltip-icon tooltip-icon-textarea">
              <a-tooltip title="Provide feedback about the interview">
                <info-circle-outlined />
              </a-tooltip>
            </span>
          </div>
        </div>
      </div>

      <!-- Reference Information -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Reference Information :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-textarea
              v-model:value="form.reference_info"
              placeholder="Provide reference information about the candidate"
              :rows="3"
              style="width: 100%;"
              @change="handleFormChange"
            />
            <span class="tooltip-icon tooltip-icon-textarea">
              <a-tooltip title="Provide reference information about the candidate">
                <info-circle-outlined />
              </a-tooltip>
            </span>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <a-button @click="handleClose" :disabled="loading">Cancel</a-button>
        <a-button type="primary" html-type="submit" :loading="loading">{{ submitButtonText }}</a-button>
      </div>
    </form>
  </a-modal>
</template>

<style scoped>
/* Horizontal form layout */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.form-label-col {
  flex: 0 0 180px;
  min-width: 180px;
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
  width: 350px !important;
  max-width: 350px;
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
  color: rgba(0, 0, 0, 0.45);
  cursor: help;
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
  .form-input-col {
    flex: 1;
    min-width: 100%;
  }
  .input-short,
  .input-medium {
    width: 100% !important;
    max-width: 100%;
  }
}

/* Button gap utility */
.gap-2 {
  gap: 0.5rem;
}

/* Ant Design overrides */
:deep(.input-short.ant-picker),
:deep(.input-short.ant-select),
:deep(.input-short.ant-input-number) {
  width: 200px !important;
}

:deep(.input-medium.ant-input) {
  width: 350px !important;
}

:deep(.ant-select-selector) {
  min-width: inherit;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
}
</style>

<template>
  <div class="modal fade" id="interviewModal" tabindex="-1" aria-labelledby="interviewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="interviewModalLabel">{{ editMode ? 'Edit' : 'Add' }} Interview</h5>
          <button type="button" class="btn-close" @click="handleModalClose" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Restored Data Notification -->
          <div v-if="restoredDataNotification.show" class="alert alert-info alert-dismissible fade show mb-3"
            role="alert">
            <i class="ti ti-info-circle me-2"></i>
            Restored your previous unsaved changes from {{ formatRestoredTime(restoredDataNotification.timestamp) }}
            <button type="button" class="btn-close" @click="restoredDataNotification.show = false"></button>
          </div>

          <form @submit.prevent="handleSubmit">
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              {{ alertMessage }}
            </div>

            <!-- Row 1: Candidate Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="candidateName">
                  Candidate Name :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" :class="{ 'is-invalid': validationErrors.candidate_name }"
                  id="candidateName" v-model="formData.candidate_name" required @input="handleFormChange" />
                <div v-if="validationErrors.candidate_name" class="invalid-feedback">
                  {{ validationErrors.candidate_name }}
                </div>
              </div>
            </div>

            <!-- Row 2: Phone -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="phone">
                  Phone :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <input type="text" class="form-control input-medium" :class="{ 'is-invalid': validationErrors.phone }" id="phone"
                    v-model="formData.phone" required @input="handlePhoneInput" @blur="validatePhone"
                    placeholder="Enter 10 digits (Thai) or 11 digits (Myanmar)" />
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Thai numbers: 10 digits (e.g., 0812345678) | Myanmar numbers: 11 digits (e.g., 09123456789)"
                    class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors.phone" class="invalid-feedback">
                  {{ validationErrors.phone }}
                </div>
              </div>
            </div>

            <!-- Row 3: Job Position -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="jobPosition">
                  Job Position :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control" :class="{ 'is-invalid': validationErrors.job_position }"
                  id="jobPosition" v-model="formData.job_position" required @input="handleFormChange" />
                <div v-if="validationErrors.job_position" class="invalid-feedback">
                  {{ validationErrors.job_position }}
                </div>
              </div>
            </div>

            <!-- Row 4: Start Time -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="startTime">
                  Start Time :
                </label>
              </div>
              <div class="form-input-col">
                <input type="time" class="form-control input-short" id="startTime" v-model="formData.start_time" required
                  @change="handleFormChange" />
              </div>
            </div>

            <!-- Row 5: End Time -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="endTime">
                  End Time :
                </label>
              </div>
              <div class="form-input-col">
                <input type="time" class="form-control input-short" id="endTime" v-model="formData.end_time"
                  @change="handleFormChange" />
              </div>
            </div>

            <!-- Row 6: Interview Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="interviewDate">
                  Interview Date <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker class="form-control datetimepicker input-short" placeholder="dd/mm/yyyy" :editable="true"
                      :clearable="false" :input-format="displayFormat" v-model="formData.interview_date"
                      @update:model-value="handleDateChange('interview_date', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the date for the interview" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 7: Interview Mode -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="interviewMode">
                  Interview Mode :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-short" id="interviewMode" v-model="formData.interview_mode" required
                  @change="handleFormChange">
                  <option value="In-person">In-person</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
            </div>

            <!-- Row 8: Interview Status -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="interviewStatus">
                  Interview Status :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-short" id="interviewStatus" v-model="formData.interview_status" required
                  @change="handleFormChange">
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
            </div>

            <!-- Row 9: Score -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="score">
                  Score :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <input type="number" class="form-control input-short" :class="{ 'is-invalid': validationErrors.score }"
                    id="score" v-model="formData.score" min="0" max="100" step="0.01" @input="handleScoreInput"
                    @blur="validateScore" placeholder="Enter score between 0-100" />
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Enter a numeric score between 0 and 100 (decimals allowed)" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors.score" class="invalid-feedback">
                  {{ validationErrors.score }}
                </div>
              </div>
            </div>

            <!-- Row 10: Hired Status -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="hiredStatus">
                  Hired Status :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-short" id="hiredStatus" v-model="formData.hired_status"
                  @change="handleFormChange">
                  <option value="" disabled selected>Select Hired Status</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <!-- Row 11: Interviewer Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="interviewerName">
                  Interviewer Name / Position :
                </label>
              </div>
              <div class="form-input-col">
                <textarea class="form-control" id="interviewerName" v-model="formData.interviewer_name" required
                  @input="handleFormChange"></textarea>
              </div>
            </div>

            <!-- Row 12: Feedback -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="feedback">
                  Feedback :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <textarea class="form-control" id="feedback" v-model="formData.feedback" rows="3"
                    @input="handleFormChange"></textarea>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Provide feedback about the interview" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 13: Reference Information -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="referenceInfo">
                  Reference Information :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <textarea class="form-control" id="referenceInfo" v-model="formData.reference_info" rows="3"
                    @input="handleFormChange"></textarea>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Provide reference information about the candidate" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
              </div>
            </div>

            <div class="text-end">
              <button type="button" class="btn btn-secondary me-2" @click="handleModalClose">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                  aria-hidden="true"></span>
                {{ editMode ? 'Update' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal, Tooltip as BootstrapTooltip } from 'bootstrap';
import { createVNode, nextTick } from 'vue';
import { message, Modal as AntModal } from 'ant-design-vue';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { useInterviewStore } from '@/stores/interviewStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';

export default {
  name: 'InterviewModal',
  components: {
    InfoCircleOutlined,
  },
  data() {
    return {
      // Properties moved from setup()
      editMode: false,
      interviewData: null,
      alertMessage: '',
      alertClass: '',

      // Store instances (initialized in created())
      interviewStore: null,
      formPersistenceStore: null,

      // Accessibility observer instance
      ariaObserver: null,

      // Existing properties
      formData: {
        id: null,
        candidate_name: '',
        phone: '',
        job_position: '',
        interviewer_name: '',
        interview_date: null,
        start_time: '',
        end_time: '',
        interview_mode: 'In-person',
        interview_status: 'Scheduled',
        score: '',
        feedback: '',
        reference_info: '',
        hired_status: ''
      },
      originalFormData: {},
      isSubmitting: false,
      modalInstance: null,
      displayFormat: 'dd/MM/yyyy',
      inputFormat: 'yyyy-MM-dd',

      // Form persistence properties
      isDraftMode: false,
      hasUnsavedChanges: false,
      isDestroyed: false,
      isComponentReady: false,
      formDraftKey: 'interview-modal-draft',

      // Restored data notification
      restoredDataNotification: {
        show: false,
        timestamp: null
      },

      // Form validation
      validationErrors: {},
      isValidating: false
    };
  },

  watch: {
    interviewData: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };
          this.originalFormData = { ...newVal };

          // Convert the incoming string to a JS Date
          if (this.formData.interview_date) {
            this.formData.interview_date = new Date(this.formData.interview_date);
            this.originalFormData.interview_date = new Date(this.originalFormData.interview_date);
          }

          // Format time fields when in edit mode
          if (this.editMode) {
            if (this.formData.start_time) {
              this.formData.start_time = this.formatTimeForInput(this.formData.start_time);
              this.originalFormData.start_time = this.formatTimeForInput(this.originalFormData.start_time);
            }
            if (this.formData.end_time) {
              this.formData.end_time = this.formatTimeForInput(this.formData.end_time);
              this.originalFormData.end_time = this.formatTimeForInput(this.originalFormData.end_time);
            }
          }
        }
      },
      deep: true
    }
  },

  async created() {
    try {
      // Initialize stores
      this.interviewStore = useInterviewStore();
      this.formPersistenceStore = useFormPersistenceStore();

      // Mark component as ready
      this.isComponentReady = true;
    } catch (error) {
      console.error('Error during component initialization:', error);
    }
  },

  mounted() {
    // Initialize the modal when component is mounted
    const modalElement = document.getElementById('interviewModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });

      // Add event listener for when modal is shown
      modalElement.addEventListener('shown.bs.modal', () => {
        console.log('🔄 Interview modal opened');
        this.onModalShown();
      });

      // Override the default hide behavior
      modalElement.addEventListener('hide.bs.modal', (event) => {
        console.log('🚪 Attempting to close interview modal - hasUnsavedChanges:', this.hasUnsavedChanges, 'isDraftMode:', this.isDraftMode);
        if (this.hasUnsavedChanges && !this.isSubmitting && this.isDraftMode) {
          event.preventDefault();
          event.stopPropagation();
          this.handleModalClose();
        }
      });

      // Clean up when modal is actually hidden
      modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('🎯 Interview modal hidden');
        if (!this.isDraftMode) {
          this.resetForm();
        }
        this.cleanupModalBackdrops();
      });

      // Fix accessibility issue with modal and aria-hidden
      this.ariaObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
            if (modalElement.getAttribute('aria-hidden') === 'true' &&
              modalElement.contains(document.activeElement)) {
              modalElement.removeAttribute('aria-hidden');
            }
          }
        });
      });

      this.ariaObserver.observe(modalElement, { attributes: true });
    }

    // Initialize tooltips on component mount
    this.initializeTooltips();
  },

  beforeUnmount() {
    // Mark component as destroyed
    this.isDestroyed = true;
    this.isComponentReady = false;

    // Clean up accessibility observer
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = null;
    }

    // Clean up modal instance
    if (this.modalInstance && typeof this.modalInstance.dispose === 'function') {
      try {
        this.modalInstance.dispose();
      } catch (error) {
        console.error('Error disposing modal:', error);
      }
    }

    // Remove any lingering backdrops
    this.cleanupModalBackdrops();
  },

  methods: {
    // Initialize Bootstrap tooltips
    initializeTooltips() {
      this.$nextTick(() => {
        // Dispose of existing tooltips to prevent duplicates
        const existingTooltips = document.querySelectorAll('#interviewModal [data-bs-toggle="tooltip"]');
        existingTooltips.forEach(tooltipTriggerEl => {
          const existingTooltip = BootstrapTooltip.getInstance(tooltipTriggerEl);
          if (existingTooltip) {
            existingTooltip.dispose();
          }
        });

        // Initialize all tooltips within the modal
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('#interviewModal [data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new BootstrapTooltip(tooltipTriggerEl);
        });
      });
    },

    // Form Validation Methods
    validatePhone() {
      const phone = this.formData.phone;

      if (!phone || phone.trim() === '') {
        this.validationErrors.phone = 'Phone number is required';
        return false;
      }

      // Remove all non-digit characters for validation
      const cleanPhone = phone.replace(/\D/g, '');

      // Check length: 10 for Thai, 11 for Myanmar
      if (cleanPhone.length === 10) {
        // Thai phone number validation (starts with 0)
        if (!cleanPhone.startsWith('0')) {
          this.validationErrors.phone = 'Thai phone number must start with 0';
          return false;
        }
      } else if (cleanPhone.length === 11) {
        // Myanmar phone number validation (starts with 09)
        if (!cleanPhone.startsWith('09')) {
          this.validationErrors.phone = 'Myanmar phone number must start with 09';
          return false;
        }
      } else {
        this.validationErrors.phone = 'Phone number must be 10 digits (Thai) or 11 digits (Myanmar)';
        return false;
      }

      // Clear error if validation passes
      delete this.validationErrors.phone;
      return true;
    },

    validateScore() {
      const score = this.formData.score;

      // Score is optional, so empty is valid
      if (!score || score === '') {
        delete this.validationErrors.score;
        return true;
      }

      const numericScore = parseFloat(score);

      // Check if it's a valid number
      if (isNaN(numericScore)) {
        this.validationErrors.score = 'Score must be a valid number';
        return false;
      }

      // Check range 0-100
      if (numericScore < 0 || numericScore > 100) {
        this.validationErrors.score = 'Score must be between 0 and 100';
        return false;
      }

      // Clear error if validation passes
      delete this.validationErrors.score;
      return true;
    },

    validateForm() {
      let isValid = true;

      // Validate required fields
      if (!this.formData.candidate_name || this.formData.candidate_name.trim() === '') {
        this.validationErrors.candidate_name = 'Candidate name is required';
        isValid = false;
      } else {
        delete this.validationErrors.candidate_name;
      }

      if (!this.formData.job_position || this.formData.job_position.trim() === '') {
        this.validationErrors.job_position = 'Job position is required';
        isValid = false;
      } else {
        delete this.validationErrors.job_position;
      }

      // Validate phone and score
      const phoneValid = this.validatePhone();
      const scoreValid = this.validateScore();

      return isValid && phoneValid && scoreValid;
    },

    handlePhoneInput(event) {
      // Allow only digits, spaces, dashes, parentheses, and plus signs
      const value = event.target.value;
      const cleanValue = value.replace(/[^\d\s\-\(\)\+]/g, '');

      if (value !== cleanValue) {
        this.formData.phone = cleanValue;
      }

      // Clear validation error on input
      if (this.validationErrors.phone) {
        delete this.validationErrors.phone;
      }

      this.handleFormChange();
    },

    handleScoreInput(event) {
      const value = event.target.value;

      // Clear validation error on input
      if (this.validationErrors.score) {
        delete this.validationErrors.score;
      }

      this.handleFormChange();
    },

    // Called when modal is shown
    onModalShown() {
      if (this.editMode && this.interviewData) {
        // Editing existing interview - clear any draft and load interview data
        this.clearFormDraft();
        this.isDraftMode = false;
        this.hasUnsavedChanges = false;
        this.restoredDataNotification.show = false;

        this.formData = { ...this.interviewData };
        this.originalFormData = { ...this.interviewData };

        // Convert dates and times
        if (this.formData.interview_date) {
          this.formData.interview_date = new Date(this.formData.interview_date);
          this.originalFormData.interview_date = new Date(this.originalFormData.interview_date);
        }

        if (this.formData.start_time) {
          this.formData.start_time = this.formatTimeForInput(this.formData.start_time);
          this.originalFormData.start_time = this.formatTimeForInput(this.originalFormData.start_time);
        }
        if (this.formData.end_time) {
          this.formData.end_time = this.formatTimeForInput(this.formData.end_time);
          this.originalFormData.end_time = this.formatTimeForInput(this.originalFormData.end_time);
        }
      } else {
        // Creating new interview - check for draft
        const hasDraft = this.loadFormDraft();

        if (!hasDraft) {
          this.resetForm();
          this.restoredDataNotification.show = false;
        }

        // Enable draft mode for tracking changes
        this.isDraftMode = true;
        this.hasUnsavedChanges = false;
      }

      // Initialize tooltips when modal is shown
      this.initializeTooltips();

      console.log('📝 Interview modal ready for input - isDraftMode:', this.isDraftMode);
    },

    // Check if form data has changed from original (for edit mode)
    hasDataChanged() {
      if (!this.originalFormData || !this.formData) return false;

      const current = { ...this.formData };
      const original = { ...this.originalFormData };

      // Convert dates to strings for comparison
      if (current.interview_date instanceof Date) {
        current.interview_date = current.interview_date.toISOString().split('T')[0];
      }
      if (original.interview_date instanceof Date) {
        original.interview_date = original.interview_date.toISOString().split('T')[0];
      }

      return JSON.stringify(current) !== JSON.stringify(original);
    },

    // Handle any form input change
    handleFormChange() {
      if (this.isDraftMode && this.isComponentReady && !this.isSubmitting) {
        console.log('📝 Form changed, marking as unsaved');
        if (this.editMode) {
          this.hasUnsavedChanges = this.hasDataChanged();
        } else {
          this.hasUnsavedChanges = true;
        }
        this.saveFormState();
      }
    },

    // Handle date picker changes
    handleDateChange(fieldName, newValue) {
      if (this.isDestroyed || !this.isComponentReady) return;

      try {
        const safeDate = this.safeConvertToDate(newValue);
        this.formData[fieldName] = safeDate;
        this.handleFormChange();
      } catch (error) {
        console.error('Error handling date change:', error);
      }
    },

    // Form persistence methods
    saveFormState() {
      if (this.isDestroyed || !this.isComponentReady) return;

      try {
        const draftData = {
          formData: { ...this.formData },
          originalFormData: { ...this.originalFormData },
          editMode: this.editMode,
          timestamp: Date.now()
        };

        // Convert dates to ISO strings for storage
        if (draftData.formData.interview_date instanceof Date) {
          draftData.formData.interview_date = draftData.formData.interview_date.toISOString();
        }
        if (draftData.originalFormData.interview_date instanceof Date) {
          draftData.originalFormData.interview_date = draftData.originalFormData.interview_date.toISOString();
        }

        const key = this.editMode ? `interviewEditForm_${this.formData.id}` : 'interviewForm';
        this.formPersistenceStore.saveFormSection('interview', key, draftData);
        console.log('💾 Interview form draft saved automatically');
      } catch (error) {
        console.error('❌ Error saving interview form draft:', error);
      }
    },

    loadFormDraft() {
      try {
        const savedData = this.formPersistenceStore.checkForSavedData('interview');

        if (savedData.hasSavedData) {
          const key = this.editMode ? `interviewEditForm_${this.formData.id}` : 'interviewForm';
          const parsed = savedData.data[key];

          if (parsed) {
            // Check if draft is not too old (24 hours)
            const isRecent = (Date.now() - parsed.timestamp) < (24 * 60 * 60 * 1000);

            if (isRecent) {
              console.log('📄 Loading saved interview form draft');

              // Restore form data
              this.formData = { ...parsed.formData };
              this.originalFormData = { ...parsed.originalFormData };

              // Convert date strings back to Date objects
              if (this.formData.interview_date) {
                this.formData.interview_date = this.safeConvertToDate(this.formData.interview_date);
              }
              if (this.originalFormData.interview_date) {
                this.originalFormData.interview_date = this.safeConvertToDate(this.originalFormData.interview_date);
              }

              this.hasUnsavedChanges = this.editMode ? this.hasDataChanged() : true;
              this.restoredDataNotification.show = true;
              this.restoredDataNotification.timestamp = parsed.timestamp;
              return true;
            } else {
              // Clean up old draft
              this.clearFormDraft();
            }
          }
        }
      } catch (error) {
        console.error('❌ Error loading interview form draft:', error);
        this.clearFormDraft();
      }
      return false;
    },

    clearFormDraft() {
      try {
        const key = this.editMode ? `interviewEditForm_${this.formData.id}` : 'interviewForm';
        this.formPersistenceStore.clearFormSection('interview', key);
        console.log('🗑️ Interview form draft cleared');
      } catch (error) {
        console.error('❌ Error clearing interview form draft:', error);
      }
    },

    // Safe date conversion helper
    safeConvertToDate(dateValue) {
      if (!dateValue) return null;

      try {
        if (dateValue instanceof Date) {
          return isNaN(dateValue.getTime()) ? null : dateValue;
        }

        if (typeof dateValue === 'string') {
          const parsedDate = new Date(dateValue);
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        }

        return null;
      } catch (error) {
        console.error('Error converting date:', error);
        return null;
      }
    },

    // Format restored time for display
    formatRestoredTime(timestamp) {
      if (!timestamp) return 'earlier';
      return this.getTimeAgo(timestamp);
    },

    // Get human-readable time ago
    getTimeAgo(timestamp) {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      if (seconds < 60) return 'just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
    },

    // Clean up stray modal backdrops
    cleanupModalBackdrops() {
      if (this.isDestroyed) return;

      nextTick(() => {
        if (this.isDestroyed) return;

        const backdrops = document.querySelectorAll('.modal-backdrop');
        const activeModals = document.querySelectorAll('.modal.show');

        if (activeModals.length === 0 && backdrops.length > 0) {
          backdrops.forEach(backdrop => backdrop.remove());
        }
      });
    },

    // Handle modal close with unsaved changes check
    async handleModalClose() {
      console.log('🔍 handleModalClose called - hasUnsavedChanges:', this.hasUnsavedChanges, 'isDraftMode:', this.isDraftMode);

      if (this.isDestroyed || !this.isComponentReady) return;

      const hasUnsaved = this.hasUnsavedChanges && this.isDraftMode;

      if (hasUnsaved) {
        console.log('⚠️ Has unsaved changes, showing confirmation');
        this.showUnsavedChangesConfirm();
      } else {
        console.log('✅ No unsaved changes, closing normally');
        await this.safeHideModal();
      }
    },

    // Show single-tier Ant Design confirm dialog for unsaved changes
    showUnsavedChangesConfirm() {
      AntModal.confirm({
        title: 'Unsaved Changes',
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode('div', { style: 'margin-top: 16px;' }, [
          createVNode('p', { style: 'margin-bottom: 12px; color: #666;' }, 'You have unsaved changes in the interview form.'),
          createVNode('p', { style: 'margin-bottom: 0; font-weight: 500;' }, 'What would you like to do?')
        ]),
        centered: true,
        width: 440,
        maskClosable: false,
        keyboard: false,

        okText: 'Continue Editing',
        okType: 'default',
        cancelText: 'Discard Changes',
        cancelButtonProps: {
          danger: true
        },

        onOk: () => {
          console.log('User chose to continue editing');
          return Promise.resolve();
        },

        onCancel: () => {
          console.log('User chose to discard changes');
          this.discardChangesAndClose();
          return Promise.resolve();
        }
      });
    },

    // Discard changes and close modal
    async discardChangesAndClose() {
      if (this.isDestroyed) return;

      try {
        this.clearFormDraft();
        this.resetForm();
        await this.safeHideModal();
        console.log('✅ Discarded changes and closed modal');
      } catch (error) {
        console.error('❌ Error discarding changes:', error);
      }
    },

    // Safe modal hide helper
    safeHideModal() {
      return new Promise((resolve) => {
        if (this.isDestroyed) {
          resolve(true);
          return;
        }

        // Temporarily disable draft mode to allow normal close
        this.isDraftMode = false;
        this.hasUnsavedChanges = false;

        nextTick(() => {
          if (this.isDestroyed) {
            resolve(true);
            return;
          }

          if (this.modalInstance) {
            try {
              const modalEl = document.getElementById('interviewModal');
              if (modalEl) {
                modalEl.addEventListener('hidden.bs.modal', () => {
                  this.cleanupModalBackdrops();
                  resolve(true);
                }, { once: true });

                this.modalInstance.hide();
              } else {
                resolve(true);
              }
            } catch (error) {
              console.error('Error hiding modal:', error);
              resolve(false);
            }
          } else {
            resolve(true);
          }
        });
      });
    },

    openModal() {
      if (this.modalInstance) {
        this.modalInstance.show();
      } else {
        // If modalInstance is not available, try to create it again
        const modalElement = document.getElementById('interviewModal');
        if (modalElement) {
          this.modalInstance = new Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
          this.modalInstance.show();
        } else {
          console.error('Modal element not found');
          message.error('Modal element not found');
        }
      }
    },

    async handleSubmit() {
      // Validate form before submission
      if (!this.validateForm()) {
        this.alertMessage = 'Please fix the validation errors before submitting.';
        this.alertClass = 'alert-danger';
        return;
      }

      this.isSubmitting = true;
      this.alertMessage = ''; // Reset alert message
      try {
        // Format time fields to match H:i:s format
        const formattedData = { ...this.formData };
        if (formattedData.start_time) {
          formattedData.start_time = this.formatTimeWithSeconds(formattedData.start_time);
        }
        if (formattedData.end_time) {
          formattedData.end_time = this.formatTimeWithSeconds(formattedData.end_time);
        }

        let response;
        if (this.editMode) {
          response = await this.interviewStore.updateInterview(this.formData.id, formattedData);
        } else {
          response = await this.interviewStore.createInterview(formattedData);
        }

        // Handle successful response from BaseService
        if (response && response.success !== false) {
          // Success case
          this.$emit(this.editMode ? 'interview-updated' : 'interview-added');
          message.success(this.editMode ? 'Interview updated successfully' : 'Interview added successfully');

          // Clear draft on successful submission
          this.clearFormDraft();
          this.hasUnsavedChanges = false;
          this.isDraftMode = false;

          this.resetForm();
          if (this.modalInstance) {
            this.modalInstance.hide();
          }
        } else if (response && response.success === false) {
          // Handle any remaining error responses that aren't thrown
          this.alertMessage = response.message || `Failed to ${this.editMode ? 'update' : 'create'} interview. Please try again.`;
          this.alertClass = 'alert-danger';
        } else {
          // Fallback for unexpected response format
          this.alertMessage = `Failed to ${this.editMode ? 'update' : 'create'} interview. Please try again.`;
          this.alertClass = 'alert-danger';
        }
      } catch (error) {
        // Handle BaseService structured errors (thrown as exceptions)
        console.error('Error submitting form:', error);

        // Handle BaseService error structure
        if (error.status) {
          switch (error.status) {
            case 422:
              // Validation error - show detailed validation errors
              this.alertMessage = error.message || 'Validation failed. Please check your input.';
              this.alertClass = 'alert-warning';

              // Display specific validation errors if available
              if (error.errors && typeof error.errors === 'object') {
                const errorMessages = Object.entries(error.errors)
                  .map(([field, messages]) => {
                    const fieldMessages = Array.isArray(messages) ? messages : [messages];
                    return fieldMessages.map(msg => `${field.replace('_', ' ')}: ${msg}`).join(', ');
                  })
                  .join('; ');

                if (errorMessages) {
                  this.alertMessage += ` Details: ${errorMessages}`;
                }
              }
              break;

            case 404:
              this.alertMessage = error.message || 'Interview not found. It may have been deleted by another user.';
              this.alertClass = 'alert-warning';
              break;

            case 401:
              this.alertMessage = error.message || 'Authentication required. Please log in again.';
              this.alertClass = 'alert-danger';
              break;

            case 403:
              this.alertMessage = error.message || `You don't have permission to ${this.editMode ? 'update' : 'create'} interviews.`;
              this.alertClass = 'alert-danger';
              break;

            case 500:
              this.alertMessage = error.message || `Server error occurred while ${this.editMode ? 'updating' : 'creating'} interview. Please try again later.`;
              this.alertClass = 'alert-danger';
              break;

            default:
              this.alertMessage = error.message || `An error occurred while ${this.editMode ? 'updating' : 'creating'} the interview.`;
              this.alertClass = 'alert-danger';
          }
        } else {
          // Handle network or other unexpected errors
          this.alertMessage = error.message || `Network connection error. Please check your connection and try again.`;
          this.alertClass = 'alert-danger';
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    formatTimeWithSeconds(timeString) {
      // If time already has seconds, return as is
      if (timeString.split(':').length === 3) {
        return timeString;
      }
      // Otherwise add seconds
      return `${timeString}:00`;
    },

    formatTimeForInput(timeString) {
      // Format time for input field (HH:MM format)
      if (!timeString) return '';

      // If time has seconds or more parts, truncate to HH:MM
      const timeParts = timeString.split(':');
      if (timeParts.length >= 2) {
        return `${timeParts[0]}:${timeParts[1]}`;
      }

      return timeString;
    },

    resetForm() {
      this.formData = {
        id: null,
        candidate_name: '',
        phone: '',
        job_position: '',
        interviewer_name: '',
        interview_date: null,
        start_time: '',
        end_time: '',
        interview_mode: 'In-person',
        interview_status: 'Scheduled',
        score: '',
        feedback: '',
        reference_info: '',
        hired_status: ''
      };
      this.originalFormData = {};
      this.isDraftMode = false;

      // Clear validation errors
      this.validationErrors = {};
      this.alertMessage = '';
      this.alertClass = '';
      this.hasUnsavedChanges = false;
      this.restoredDataNotification.show = false;
      this.restoredDataNotification.timestamp = null;
      this.alertMessage = ''; // Reset alert message on form reset
      this.alertClass = '';
      this.clearFormDraft();
    }
  }
};
</script>

<style scoped>
.modal-dialog {
  max-width: 1000px;
}

.modal-content {
  padding: 20px;
}

/* Horizontal form layout - labels on left, inputs on right */
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
}

/* Input width classes */
.input-short {
  width: 200px;
  max-width: 200px;
}

.input-medium {
  width: 400px;
  max-width: 400px;
}

.form-select.input-short {
  width: 200px;
  max-width: 200px;
}

.form-select.input-medium {
  width: 400px;
  max-width: 400px;
}

.input-short-wrapper {
  width: 200px;
  max-width: 200px;
}

/* Responsive adjustments for input widths */
@media (max-width: 768px) {
  .input-short,
  .input-medium,
  .input-short-wrapper {
    width: 100%;
    max-width: 100%;
  }
}

.tooltip-icon {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  flex-shrink: 0;
}

.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 0;
}

.input-with-tooltip .input-short-wrapper {
  margin: 0;
}

.input-with-tooltip textarea + .tooltip-icon {
  align-self: flex-start;
  margin-top: 8px;
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
}

/* Form validation styles */
.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #e53e3e;
  background: #fff5f5;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 5px;
  font-size: 0.875em;
  color: #e53e3e;
  font-weight: 500;
  margin-left: 0;
}

/* Alert notification styles */
.alert {
  margin-bottom: 15px;
}

.alert-dismissible .btn-close {
  padding: 0.5rem;
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #004085;
}

.fade {
  transition: opacity 0.15s linear;
}

.fade.show {
  opacity: 1;
}

/* Date picker styling */
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

:deep(.mx-icon-calendar) {
  display: none;
}

/* Button styling */
.btn {
  transition: all 0.15s ease-in-out;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* Bootstrap Tooltip styling enhancements */
:deep(.tooltip) {
  z-index: 9999 !important;
}

:deep(.tooltip-inner) {
  background-color: rgba(0, 0, 0, 0.85) !important;
  color: white !important;
  border-radius: 4px !important;
  padding: 8px 12px !important;
  font-size: 12px !important;
  line-height: 1.4 !important;
  max-width: 300px !important;
  text-align: left !important;
}

:deep(.tooltip.bs-tooltip-top .tooltip-arrow::before) {
  border-top-color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.tooltip.bs-tooltip-bottom .tooltip-arrow::before) {
  border-bottom-color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.tooltip.bs-tooltip-start .tooltip-arrow::before) {
  border-left-color: rgba(0, 0, 0, 0.85) !important;
}

:deep(.tooltip.bs-tooltip-end .tooltip-arrow::before) {
  border-right-color: rgba(0, 0, 0, 0.85) !important;
}

.input-short-wrapper :deep(.mx-datepicker) {
  width: 100%;
}

.input-short-wrapper :deep(.mx-input) {
  width: 100% !important;
}

/* Modal content overflow fixes for tooltips */
.modal-content {
  overflow: visible !important;
}

.modal-body {
  overflow: visible !important;
}
</style>

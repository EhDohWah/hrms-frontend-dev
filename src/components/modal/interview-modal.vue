<template>
  <div class="modal fade" id="interviewModal" tabindex="-1" aria-labelledby="interviewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
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

            <div class="row">
              <!-- Left Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="candidateName" class="form-label">Candidate Name</label>
                  <input type="text" class="form-control" id="candidateName" v-model="formData.candidate_name" required
                    @input="handleFormChange" />
                </div>
                <div class="mb-3">
                  <label for="jobPosition" class="form-label">Job Position</label>
                  <input type="text" class="form-control" id="jobPosition" v-model="formData.job_position" required
                    @input="handleFormChange" />
                </div>

                <div class="mb-3">
                  <label for="endTime" class="form-label">End Time</label>
                  <input type="time" class="form-control" id="endTime" v-model="formData.end_time"
                    @change="handleFormChange" />
                </div>

                <div class="mb-3">
                  <label class="form-label">Interview Date <span class="text-danger"> *</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                      :clearable="false" :input-format="displayFormat" v-model="formData.interview_date"
                      @update:model-value="handleDateChange('interview_date', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="interviewMode" class="form-label">Interview Mode</label>
                  <select class="form-select" id="interviewMode" v-model="formData.interview_mode" required
                    @change="handleFormChange">
                    <option value="In-person">In-person</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
              </div>

              <!-- Right Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="phone" class="form-label">Phone</label>
                  <input type="text" class="form-control" id="phone" v-model="formData.phone" required
                    @input="handleFormChange" />
                </div>
                <div class="mb-3">
                  <label for="startTime" class="form-label">Start Time</label>
                  <input type="time" class="form-control" id="startTime" v-model="formData.start_time" required
                    @change="handleFormChange" />
                </div>

                <div class="mb-3">
                  <label for="interviewStatus" class="form-label">Interview Status</label>
                  <select class="form-select" id="interviewStatus" v-model="formData.interview_status" required
                    @change="handleFormChange">
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="score" class="form-label">Score</label>
                  <input type="number" class="form-control" id="score" v-model="formData.score" min="0" max="100"
                    @input="handleFormChange" />
                </div>
                <div class="mb-3">
                  <label for="hiredStatus" class="form-label">Hired Status</label>
                  <select class="form-select" id="hiredStatus" v-model="formData.hired_status"
                    @change="handleFormChange">
                    <option value="" disabled selected>Select Hired Status</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Full Width Fields -->
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <label for="interviewerName" class="form-label">Interviewer Name / Position</label>
                  <textarea class="form-control" id="interviewerName" v-model="formData.interviewer_name" required
                    @input="handleFormChange" />
                </div>
                <div class="mb-3">
                  <label for="feedback" class="form-label">Feedback</label>
                  <textarea class="form-control" id="feedback" v-model="formData.feedback" rows="3"
                    @input="handleFormChange"></textarea>
                </div>
                <div class="mb-3">
                  <label for="referenceInfo" class="form-label">Reference Information</label>
                  <textarea class="form-control" id="referenceInfo" v-model="formData.reference_info" rows="3"
                    @input="handleFormChange"></textarea>
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
import { Modal } from 'bootstrap';
import { ref, createVNode, nextTick } from 'vue';
import { message, Modal as AntModal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useInterviewStore } from '@/stores/interviewStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';

export default {
  name: 'InterviewModal',
  setup() {
    const editMode = ref(false);
    const interviewData = ref(null);
    const alertMessage = ref('');
    const alertClass = ref('');

    return {
      editMode,
      interviewData,
      alertMessage,
      alertClass
    };
  },
  data() {
    return {
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
      }
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
    }
  },

  beforeUnmount() {
    // Mark component as destroyed
    this.isDestroyed = true;
    this.isComponentReady = false;

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
        const formStore = useFormPersistenceStore();
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
        formStore.saveFormSection('interview', key, draftData);
        console.log('💾 Interview form draft saved automatically');
      } catch (error) {
        console.error('❌ Error saving interview form draft:', error);
      }
    },

    loadFormDraft() {
      try {
        const formStore = useFormPersistenceStore();
        const savedData = formStore.checkForSavedData('interview');

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
        const formStore = useFormPersistenceStore();
        const key = this.editMode ? `interviewEditForm_${this.formData.id}` : 'interviewForm';
        formStore.clearFormSection('interview', key);
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

        const interviewStore = useInterviewStore();

        let response;
        if (this.editMode) {
          response = await interviewStore.updateInterview(this.formData.id, formattedData);
        } else {
          response = await interviewStore.createInterview(formattedData);
        }

        if (!response.success) {
          this.alertMessage = response.message;
          this.alertClass = 'alert-danger';
          if (response.errors) {
            this.alertMessage += ' ' + Object.values(response.errors).flat().join(' ');
          }
        } else {
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
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        this.alertMessage = error.message || 'An error occurred while saving the interview.';
        this.alertClass = 'alert-danger';
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
.modal-content {
  padding: 20px;
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
</style>

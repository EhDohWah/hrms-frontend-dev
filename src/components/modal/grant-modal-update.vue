<template>
  <div class="modal custom-modal fade" id="grant_modal_update" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Grant</h5>
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
            <div v-if="alertMessage && alertClass === 'alert-success'" class="success-msg">
              {{ alertMessage }}
            </div>

            <div v-if="alertMessage && alertClass === 'alert-danger'" class="error-msg">
              {{ alertMessage }}
            </div>

            <!-- Row 1: Organization -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="grant-organization">
                  Organization :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <input type="text" id="grant-organization" v-model="formData.organization" class="form-control input-short"
                    :class="{ 'is-invalid': validationErrors.organization }" placeholder="e.g., SMRU" disabled>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="The organization for this grant (read-only)" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors.organization" class="invalid-feedback">
                  {{ validationErrors.organization }}
                </div>
              </div>
            </div>

            <!-- Row 2: Grant Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="grant-name">
                  Grant Name :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <input type="text" id="grant-name" v-model="formData.name" class="form-control input-medium"
                    :class="{ 'is-invalid': validationErrors.name }" placeholder="e.g., UNICEF-EP" required
                    @input="handleFormChange">
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Enter the full name of the grant project (e.g., UNICEF Emergency Preparedness)"
                    class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors.name" class="invalid-feedback">
                  {{ validationErrors.name }}
                </div>
              </div>
            </div>

            <!-- Row 3: Grant Code -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="grant-code">
                  Grant Code :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <input type="text" id="grant-code" v-model="formData.code" class="form-control input-medium"
                    :class="{ 'is-invalid': validationErrors.code }" placeholder="e.g., B-24004" disabled>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="The unique grant code identifier (read-only)" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors.code" class="invalid-feedback">
                  {{ validationErrors.code }}
                </div>
              </div>
            </div>

            <!-- Row 4: End Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="grant-end-date">
                  End Date :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker class="form-control datetimepicker input-short" placeholder="dd/mm/yyyy" :editable="true"
                      :clearable="false" :input-format="dateFormat" v-model="formData.end_date"
                      :class="{ 'is-invalid': validationErrors.end_date }"
                      @update:model-value="handleDateChange('end_date', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the end date when this grant project will conclude" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors.end_date" class="invalid-feedback">
                  {{ validationErrors.end_date }}
                </div>
              </div>
            </div>

            <!-- Row 5: Description -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="grant-description">
                  Description :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <textarea id="grant-description" v-model="formData.description" class="form-control" rows="3"
                    @input="handleFormChange" placeholder="Enter grant description and objectives..."></textarea>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Provide a detailed description of the grant project, its objectives, and scope"
                    class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
              </div>
            </div>

            <div class="submit-section text-end">
              <button type="button" class="btn btn-secondary me-2" @click="handleModalClose">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting">Updating...</span>
                <span v-else>Update Grant</span>
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
import { ref, createVNode, nextTick } from 'vue';
import { message, Modal as AntModal } from 'ant-design-vue';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';

export default {
  name: 'GrantModalUpdate',
  components: {
    InfoCircleOutlined,
  },
  setup() {
    const alertMessage = ref('');
    const alertClass = ref('');
    return {
      alertMessage,
      alertClass
    };
  },
  data() {
    return {
      isSubmitting: false,
      formData: {
        id: '',
        name: '',
        code: '',
        description: '',
        end_date: null,
        organization: ''
      },
      originalFormData: {},

      // Form persistence properties
      isDraftMode: false, // Will be set to true when editing
      hasUnsavedChanges: false,
      isDestroyed: false,
      isComponentReady: false,
      modalInstance: null,

      // Restored data notification
      restoredDataNotification: {
        show: false,
        timestamp: null
      },

      // Date format
      dateFormat: "dd-MM-yyyy",

      // Validation errors
      validationErrors: {}
    };
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
    // Initialize the Bootstrap modal
    const modalElement = document.getElementById('grant_modal_update');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });

      // Add event listener for when modal is shown
      modalElement.addEventListener('shown.bs.modal', () => {
        console.log('🔄 Grant update modal opened');
        // Draft mode will already be set in setEditData
        this.initializeTooltips();
      });

      // Override the default hide behavior
      modalElement.addEventListener('hide.bs.modal', (event) => {
        console.log('🚪 Attempting to close grant update modal - hasUnsavedChanges:', this.hasUnsavedChanges, 'isDraftMode:', this.isDraftMode);
        if (this.hasUnsavedChanges && !this.isSubmitting && this.isDraftMode) {
          event.preventDefault();
          event.stopPropagation();
          this.handleModalClose();
        }
      });

      // Clean up when modal is actually hidden
      modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('🎯 Grant update modal hidden');
        if (!this.isDraftMode) {
          this.resetForm();
        }
        this.cleanupModalBackdrops();
      });

      // Fix accessibility issue with aria-hidden
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
            if (modalElement.getAttribute('aria-hidden') === 'true' &&
              modalElement.contains(document.activeElement)) {
              modalElement.removeAttribute('aria-hidden');
            }
          }
        });
      });

      observer.observe(modalElement, { attributes: true });
    }

    // Initialize tooltips on component mount
    this.initializeTooltips();
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
    // Initialize Bootstrap tooltips
    initializeTooltips() {
      this.$nextTick(() => {
        // Dispose of existing tooltips to prevent duplicates
        const existingTooltips = document.querySelectorAll('#grant_modal_update [data-bs-toggle="tooltip"]');
        existingTooltips.forEach(tooltipTriggerEl => {
          const existingTooltip = BootstrapTooltip.getInstance(tooltipTriggerEl);
          if (existingTooltip) {
            existingTooltip.dispose();
          }
        });

        // Initialize all tooltips within the modal
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('#grant_modal_update [data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new BootstrapTooltip(tooltipTriggerEl);
        });
      });
    },

    // Check if form data has changed from original
    hasDataChanged() {
      if (!this.originalFormData || !this.formData) return false;

      const current = { ...this.formData };
      const original = { ...this.originalFormData };

      // Convert dates to strings for comparison
      if (current.end_date instanceof Date) {
        current.end_date = current.end_date.toISOString().split('T')[0];
      }
      if (original.end_date instanceof Date) {
        original.end_date = original.end_date.toISOString().split('T')[0];
      }

      return JSON.stringify(current) !== JSON.stringify(original);
    },

    // Handle any form input change
    handleFormChange() {
      if (this.isDraftMode && this.isComponentReady && !this.isSubmitting) {
        const hasChanges = this.hasDataChanged();
        console.log('📝 Form changed, has changes:', hasChanges);
        this.hasUnsavedChanges = hasChanges;
        if (hasChanges) {
          this.saveFormState();
        }
      }
    },

    // Form persistence methods
    saveFormState() {
      if (this.isDestroyed || !this.isComponentReady || !this.isDraftMode) return;

      try {
        const formStore = useFormPersistenceStore();
        const draftData = {
          formData: { ...this.formData },
          originalFormData: { ...this.originalFormData },
          timestamp: Date.now()
        };

        // Convert dates to ISO strings for storage
        if (draftData.formData.end_date instanceof Date) {
          draftData.formData.end_date = draftData.formData.end_date.toISOString();
        }

        formStore.saveFormSection('grant-edit', `grantEditForm_${this.formData.id}`, draftData);
        console.log('💾 Grant edit form draft saved automatically');
      } catch (error) {
        console.error('❌ Error saving grant edit form draft:', error);
      }
    },

    loadFormDraft() {
      if (!this.formData.id) return false;

      try {
        const formStore = useFormPersistenceStore();
        const savedData = formStore.checkForSavedData('grant-edit');

        if (savedData.hasSavedData) {
          const formKey = `grantEditForm_${this.formData.id}`;
          const parsed = savedData.data[formKey];

          if (parsed) {
            // Check if draft is not too old (24 hours)
            const isRecent = (Date.now() - parsed.timestamp) < (24 * 60 * 60 * 1000);

            if (isRecent) {
              console.log('📄 Loading saved grant edit form draft');

              // Restore form data
              this.formData = { ...parsed.formData };
              this.originalFormData = { ...parsed.originalFormData };

              // Convert date strings back to Date objects
              if (this.formData.end_date) {
                this.formData.end_date = this.safeConvertToDate(this.formData.end_date);
              }

              this.hasUnsavedChanges = this.hasDataChanged();
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
        console.error('❌ Error loading grant edit form draft:', error);
        this.clearFormDraft();
      }
      return false;
    },

    clearFormDraft() {
      if (!this.formData.id) return;

      try {
        const formStore = useFormPersistenceStore();
        formStore.clearFormSection('grant-edit', `grantEditForm_${this.formData.id}`);
        console.log('🗑️ Grant edit form draft cleared');
      } catch (error) {
        console.error('❌ Error clearing grant edit form draft:', error);
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

    // Handle date picker changes
    handleDateChange(fieldName, newValue) {
      if (this.isDestroyed || !this.isComponentReady) return;

      try {
        const safeDate = this.safeConvertToDate(newValue);
        this.formData[fieldName] = safeDate;
        this.handleFormChange(); // Use the same handler for consistency
      } catch (error) {
        console.error('Error handling date change:', error);
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
          createVNode('p', { style: 'margin-bottom: 12px; color: #666;' }, 'You have unsaved changes in the grant form.'),
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
              const modalEl = document.getElementById('grant_modal_update');
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

    // Validation methods
    clearValidationErrors() {
      this.validationErrors = {};
      this.alertMessage = '';
      this.alertClass = '';
    },

    validateForm() {
      this.clearValidationErrors();
      let isValid = true;

      if (!this.formData.id) {
        this.validationErrors.id = 'Grant ID is missing';
        isValid = false;
      }

      if (!this.formData.name?.trim()) {
        this.validationErrors.name = 'Grant name is required';
        isValid = false;
      }

      if (!this.formData.code?.trim()) {
        this.validationErrors.code = 'Grant code is required';
        isValid = false;
      }

      if (!this.formData.organization?.trim()) {
        this.validationErrors.organization = 'Organization is required';
        isValid = false;
      }

      return isValid;
    },

    // Format date for API
    formatDateForAPI(date) {
      if (!date) return null;

      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }

      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return null;
      }

      return dateObj.toISOString().split('T')[0];
    },

    async handleSubmit() {
      try {
        if (!this.validateForm()) {
          return;
        }

        this.isSubmitting = true;

        // Create a clean copy of the form data to emit
        const formDataToSubmit = {
          ...this.formData,
          end_date: this.formatDateForAPI(this.formData.end_date)
        };

        this.$emit('update-grant', formDataToSubmit);

        this.alertMessage = 'Grant updated successfully!';
        this.alertClass = 'alert-success';

        // Clear draft on successful submission
        this.clearFormDraft();
        this.hasUnsavedChanges = false;
        this.isDraftMode = false;

        setTimeout(() => {
          this.resetForm();
          if (this.modalInstance) {
            this.modalInstance.hide();
          }
        }, 1500);

      } catch (error) {
        console.error('Error submitting form:', error);
        this.alertMessage = error.message || 'Failed to update grant';
        this.alertClass = 'alert-danger';
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.formData = {
        id: '',
        name: '',
        code: '',
        description: '',
        end_date: null,
        organization: ''
      };
      this.originalFormData = {};
      this.isDraftMode = false;
      this.hasUnsavedChanges = false;
      this.restoredDataNotification.show = false;
      this.restoredDataNotification.timestamp = null;
      this.clearValidationErrors();
    },

    setEditData(data) {
      // Ensure ID is properly set
      if (!data.id) {
        console.error('Cannot edit grant: ID is missing');
        this.alertMessage = 'Cannot edit grant: ID is missing';
        this.alertClass = 'alert-danger';
        return;
      }

      // Store original data for comparison
      this.originalFormData = { ...data };

      // Convert date string to Date object if needed
      if (data.end_date && typeof data.end_date === 'string') {
        data.end_date = this.safeConvertToDate(data.end_date);
      }

      this.formData = { ...data };

      // Check for draft after setting edit data
      const hasDraft = this.loadFormDraft();

      if (!hasDraft) {
        // No draft, enable draft mode for tracking changes
        this.isDraftMode = true;
        this.hasUnsavedChanges = false;
        this.restoredDataNotification.show = false;
      } else {
        // Draft loaded, enable draft mode
        this.isDraftMode = true;
      }

      console.log('📝 Edit data set - isDraftMode:', this.isDraftMode, 'formData:', this.formData);
    }
  }
};
</script>

<style scoped>
.modal-dialog {
  max-width: 800px;
}

.input-block {
  position: relative;
}

/* Horizontal form layout - labels on left, inputs on right */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.form-label-col {
  flex: 0 0 140px;
  min-width: 140px;
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
.form-control.is-invalid {
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
}

/* Success and error message styles */
.success-msg {
  text-align: center;
  color: #169b53;
  font-weight: bold;
  margin-bottom: 14px;
  padding: 8px 12px;
  background: #f0f9f4;
  border: 1px solid #d4edda;
  border-radius: 6px;
}

.error-msg {
  text-align: center;
  color: #e53e3e;
  font-weight: bold;
  margin-bottom: 14px;
  padding: 8px 12px;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
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

:deep(.mx-input.is-invalid) {
  border-color: #e53e3e !important;
  background: #fff5f5 !important;
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
  max-width: 250px !important;
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
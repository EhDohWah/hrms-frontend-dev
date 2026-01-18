<template>
  <div class="modal custom-modal fade" id="grant_modal" role="dialog" tabindex="-1" aria-labelledby="grantModalLabel">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="grantModalLabel">Add Grant</h5>
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
            <!-- Success Message -->
            <div v-if="alertMessage && alertClass === 'alert-success'" class="success-msg">
              <i class="ti ti-check-circle me-2"></i>
              {{ alertMessage }}
            </div>

            <!-- Error Message -->
            <div v-if="alertMessage && alertClass === 'alert-danger'" class="error-msg">
              <i class="ti ti-alert-circle me-2"></i>
              {{ alertMessage }}
            </div>

            <!-- Validation Summary (when there are multiple field errors) -->
            <div v-if="hasValidationErrors" class="validation-summary mb-3">
              <div class="alert alert-warning" role="alert">
                <i class="ti ti-exclamation-triangle me-2"></i>
                <strong>Please correct the following errors:</strong>
                <ul class="mb-0 mt-2">
                  <li v-for="(error, field) in validationErrors" :key="field" class="small">
                    <strong>{{ getFieldDisplayName(field) }}:</strong> {{ error }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Row 1: Organization + Grant Name -->
            <div class="row">
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="grant-organization">Organization</label>
                  <div style="display: flex; align-items: center;">
                    <select id="grant-organization" v-model="formData.organization" class="form-control"
                      :class="{ 'is-invalid': validationErrors.organization }" required @change="handleFormChange"
                      style="flex: 1;">
                      <option value="" disabled>Select a organization</option>
                      <option v-for="organization in subsidiaries" :key="organization.id" :value="organization.value" :class="[
                        organization.value === 'SMRU' ? 'text-primary' :
                          organization.value === 'BHF' ? 'text-primary' :
                            'text-secondary'
                      ]">
                        {{ organization.value }}
                      </option>
                    </select>
                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                      title="Select the organization for this grant (SMRU or BHF)" style="margin-left: 8px;">
                      <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                    </span>
                  </div>
                  <div v-if="validationErrors.organization" class="invalid-feedback">
                    {{ validationErrors.organization }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="grant-name">Grant Name</label>
                  <div style="display: flex; align-items: center;">
                    <input type="text" id="grant-name" v-model="formData.name" class="form-control"
                      :class="{ 'is-invalid': validationErrors.name }" placeholder="e.g., UNICEF-EP" required
                      @input="handleFormChange" style="flex: 1;">
                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                      title="Enter the full name of the grant project (e.g., UNICEF Emergency Preparedness)"
                      style="margin-left: 8px;">
                      <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                    </span>
                  </div>
                  <div v-if="validationErrors.name" class="invalid-feedback">
                    {{ validationErrors.name }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 2: Grant Code + End Date -->
            <div class="row">
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="grant-code">Grant Code</label>
                  <div style="display: flex; align-items: center;">
                    <input type="text" id="grant-code" v-model="formData.code" class="form-control"
                      :class="{ 'is-invalid': validationErrors.code }" placeholder="e.g., B-24004" required
                      @input="handleFormChange" style="flex: 1;">
                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                      title="Enter the unique grant code identifier (e.g., B-24004, A-23001)" style="margin-left: 8px;">
                      <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                    </span>
                  </div>
                  <div v-if="validationErrors.code" class="invalid-feedback">
                    {{ validationErrors.code }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="grant-end-date">End Date</label>
                  <div style="display: flex; align-items: center;">
                    <div class="input-icon-end position-relative" style="flex: 1;">
                      <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                        :clearable="false" :input-format="dateFormat" v-model="formData.end_date"
                        :class="{ 'is-invalid': validationErrors.end_date }"
                        @update:model-value="handleDateChange('end_date', $event)" />
                      <span class="input-icon-addon">
                        <i class="ti ti-calendar text-gray-7"></i>
                      </span>
                    </div>
                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                      title="Select the end date when this grant project will conclude" style="margin-left: 8px;">
                      <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                    </span>
                  </div>
                  <div v-if="validationErrors.end_date" class="invalid-feedback">
                    {{ validationErrors.end_date }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 3: Description (Full Width) -->
            <div class="row">
              <div class="col-md-12">
                <div class="input-block mb-3">
                  <label class="form-label" for="grant-description">Description</label>
                  <div style="display: flex; align-items: flex-start;">
                    <textarea id="grant-description" v-model="formData.description" class="form-control" rows="3"
                      @input="handleFormChange" placeholder="Enter grant description and objectives..."
                      style="flex: 1;"></textarea>
                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                      title="Provide a detailed description of the grant project, its objectives, and scope"
                      style="margin-left: 8px; margin-top: 8px;">
                      <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="submit-section text-end">
              <button type="button" class="btn btn-secondary me-2" @click="handleModalClose">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting">Adding...</span>
                <span v-else>Add Grant</span>
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
import { useLookupStore } from '@/stores/lookupStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import { grantService } from '@/services/grant.service';

export default {
  name: 'GrantModal',
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
      subsidiaries: [],
      formData: {
        name: '',
        code: '',
        description: '',
        end_date: null,
        organization: ''
      },

      // Form persistence properties
      isDraftMode: false, // Will be set to true when modal opens
      hasUnsavedChanges: false,
      isDestroyed: false,
      isComponentReady: false,
      formDraftKey: 'grant-modal-draft',
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

  computed: {
    // Check if there are any validation errors to show summary
    hasValidationErrors() {
      return Object.keys(this.validationErrors).length > 0 &&
        !this.alertMessage; // Don't show summary if there's already an alert message
    }
  },

  async created() {
    try {
      // Mark component as ready
      this.isComponentReady = true;

      // Load initial data
      await this.initSubsidiaries();
    } catch (error) {
      console.error('Error during component initialization:', error);
    }
  },

  mounted() {
    // Initialize the Bootstrap modal
    const modalElement = document.getElementById('grant_modal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });

      // Add event listener for when modal is shown
      modalElement.addEventListener('shown.bs.modal', () => {
        console.log('🔄 Grant modal opened');
        this.onModalShown();
      });

      // Override the default hide behavior
      modalElement.addEventListener('hide.bs.modal', (event) => {
        console.log('🚪 Attempting to close grant modal - hasUnsavedChanges:', this.hasUnsavedChanges, 'isDraftMode:', this.isDraftMode);
        if (this.hasUnsavedChanges && !this.isSubmitting && this.isDraftMode) {
          event.preventDefault();
          event.stopPropagation();
          this.handleModalClose();
        }
      });

      // Clean up when modal is actually hidden
      modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('🎯 Grant modal hidden');
        if (!this.isDraftMode) {
          this.resetForm();
        }
        this.cleanupModalBackdrops();
      });

      // Fix accessibility issue with modal and aria-hidden
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
        const existingTooltips = document.querySelectorAll('#grant_modal [data-bs-toggle="tooltip"]');
        existingTooltips.forEach(tooltipTriggerEl => {
          const existingTooltip = BootstrapTooltip.getInstance(tooltipTriggerEl);
          if (existingTooltip) {
            existingTooltip.dispose();
          }
        });

        // Initialize all tooltips within the modal
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('#grant_modal [data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new BootstrapTooltip(tooltipTriggerEl);
        });
      });
    },

    // Called when modal is shown
    onModalShown() {
      this.clearAllErrors();

      // Check for draft when opening for new grant
      const hasDraft = this.loadFormDraft();

      if (!hasDraft) {
        this.resetForm();
        this.restoredDataNotification.show = false;
      }

      // Enable draft mode for tracking changes
      this.isDraftMode = true;
      this.hasUnsavedChanges = false;

      // Initialize tooltips when modal is shown
      this.initializeTooltips();

      console.log('📝 Grant modal ready for input - isDraftMode:', this.isDraftMode);
    },

    // Handle any form input change
    handleFormChange() {
      if (this.isDraftMode && this.isComponentReady && !this.isSubmitting) {
        console.log('📝 Form changed, marking as unsaved');
        this.hasUnsavedChanges = true;
        this.saveFormState();
      }
    },

    // Form persistence methods
    saveFormState() {
      if (this.isDestroyed || !this.isComponentReady) return;

      try {
        const formStore = useFormPersistenceStore();
        const draftData = {
          formData: { ...this.formData },
          timestamp: Date.now()
        };

        // Convert dates to ISO strings for storage
        if (draftData.formData.end_date instanceof Date) {
          draftData.formData.end_date = draftData.formData.end_date.toISOString();
        }

        formStore.saveFormSection('grant', 'grantForm', draftData);
        console.log('💾 Grant form draft saved automatically');
      } catch (error) {
        console.error('❌ Error saving grant form draft:', error);
      }
    },

    loadFormDraft() {
      try {
        const formStore = useFormPersistenceStore();
        const savedData = formStore.checkForSavedData('grant');

        if (savedData.hasSavedData) {
          const parsed = savedData.data.grantForm;

          if (parsed) {
            // Check if draft is not too old (24 hours)
            const isRecent = (Date.now() - parsed.timestamp) < (24 * 60 * 60 * 1000);

            if (isRecent) {
              console.log('📄 Loading saved grant form draft');

              // Restore form data
              this.formData = { ...parsed.formData };

              // Convert date strings back to Date objects
              if (this.formData.end_date) {
                this.formData.end_date = this.safeConvertToDate(this.formData.end_date);
              }

              this.hasUnsavedChanges = true;
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
        console.error('❌ Error loading grant form draft:', error);
        this.clearFormDraft();
      }
      return false;
    },

    clearFormDraft() {
      try {
        const formStore = useFormPersistenceStore();
        formStore.clearFormSection('grant', 'grantForm');
        console.log('🗑️ Grant form draft cleared');
      } catch (error) {
        console.error('❌ Error clearing grant form draft:', error);
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
              const modalEl = document.getElementById('grant_modal');
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

      // Use service validation for consistency
      try {
        const validation = grantService.validateGrantData(this.formData);

        if (!validation.isValid) {
          // Map validation errors to form fields
          Object.keys(validation.errors).forEach(field => {
            if (Array.isArray(validation.errors[field]) && validation.errors[field].length > 0) {
              this.validationErrors[field] = validation.errors[field][0];
            }
          });
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error during client-side validation:', error);

        // Fallback to basic validation if service validation fails
        let isValid = true;

        if (!this.formData.name?.trim()) {
          this.validationErrors.name = 'Grant name is required';
          isValid = false;
        }

        if (!this.formData.code?.trim()) {
          this.validationErrors.code = 'Grant code is required';
          isValid = false;
        }

        if (!this.formData.organization) {
          this.validationErrors.organization = 'Please select a organization';
          isValid = false;
        }

        return isValid;
      }
    },

    // Get organization data from lookups
    async fetchSubsidiaries() {
      try {
        const lookupStore = useLookupStore();
        const subsidiaries = lookupStore.getLookupsByType('organization');
        return subsidiaries || [];
      } catch (error) {
        console.error('Error fetching subsidiaries:', error);
        return [];
      }
    },

    // Initialize organization data when component is created
    async initSubsidiaries() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookupLists();
      }
      this.subsidiaries = lookupStore.getLookupsByType('organization');
    },

    // Format date to YYYY-MM-DD format
    formatDateForBackend(date) {
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

    // Public method to open modal (called from parent)
    openModal() {
      if (this.modalInstance) {
        // Clear any previous errors when opening modal
        this.clearAllErrors();
        this.modalInstance.show();
      }
    },

    async handleSubmit() {
      try {
        if (!this.validateForm()) {
          return;
        }

        this.isSubmitting = true;
        this.clearValidationErrors();

        const submissionData = {
          ...this.formData,
          end_date: this.formatDateForBackend(this.formData.end_date)
        };

        console.log('Formatted submission data:', submissionData);

        // Use the grant service directly (validation already done above)
        const response = await grantService.createGrant(submissionData);

        // Handle successful response
        if (response && response.success) {
          this.alertMessage = response.message || 'Grant added successfully!';
          this.alertClass = 'alert-success';

          // Clear draft on successful submission
          this.clearFormDraft();
          this.hasUnsavedChanges = false;
          this.isDraftMode = false;

          // Emit success event to parent component (just notify of success)
          this.$emit('add-grant', { success: true, grant: response.data });

          // Show success message and close modal
          setTimeout(() => {
            this.resetForm();
            if (this.modalInstance) {
              this.modalInstance.hide();
            }
          }, 1500);
        }

      } catch (error) {
        console.error('Error submitting form:', error);
        this.handleSubmissionError(error);
      } finally {
        this.isSubmitting = false;
      }
    },

    // Handle different types of submission errors
    handleSubmissionError(error) {
      if (!error.status) {
        // Network or unknown error
        this.alertMessage = 'Network error. Please check your connection and try again.';
        this.alertClass = 'alert-danger';
        return;
      }

      switch (error.status) {
        case 422:
          // Validation errors from server
          this.handleValidationErrors(error);
          break;

        case 404:
          // Not found error
          this.alertMessage = error.message || 'Resource not found. Please refresh and try again.';
          this.alertClass = 'alert-danger';
          break;

        case 401:
          // Unauthorized
          this.alertMessage = 'Your session has expired. Please log in again.';
          this.alertClass = 'alert-danger';
          // Could emit event to parent to handle logout
          break;

        case 403:
          // Forbidden
          this.alertMessage = 'You do not have permission to create grants. Please contact your administrator.';
          this.alertClass = 'alert-danger';
          break;

        case 500:
          // Server error
          this.alertMessage = 'Server error occurred. Please try again later or contact support.';
          this.alertClass = 'alert-danger';
          break;

        default:
          // Other HTTP errors
          this.alertMessage = error.message || `An error occurred (${error.status}). Please try again.`;
          this.alertClass = 'alert-danger';
      }
    },

    // Handle validation errors from server (422)
    handleValidationErrors(error) {
      if (error.errors && typeof error.errors === 'object') {
        // Map server validation errors to form fields
        Object.keys(error.errors).forEach(field => {
          if (Array.isArray(error.errors[field]) && error.errors[field].length > 0) {
            this.validationErrors[field] = error.errors[field][0]; // Take first error message
          }
        });

        // Show general validation message
        this.alertMessage = error.message || 'Please correct the errors below and try again.';
        this.alertClass = 'alert-danger';

        // Scroll to first error field
        this.scrollToFirstError();
      } else {
        // Fallback for validation errors without detailed field errors
        this.alertMessage = error.message || 'Please check your input and try again.';
        this.alertClass = 'alert-danger';
      }
    },

    // Scroll to the first field with validation error
    scrollToFirstError() {
      this.$nextTick(() => {
        const firstErrorField = document.querySelector('#grant_modal .is-invalid');
        if (firstErrorField) {
          firstErrorField.focus();
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    },

    // Get user-friendly field names for display
    getFieldDisplayName(fieldName) {
      const fieldNames = {
        'name': 'Grant Name',
        'code': 'Grant Code',
        'organization': 'Organization',
        'description': 'Description',
        'end_date': 'End Date'
      };
      return fieldNames[fieldName] || fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    // Show user-friendly toast messages for different error types
    showErrorToast(error) {
      let toastMessage = '';
      let toastType = 'error';

      if (!error.status) {
        toastMessage = 'Network connection error. Please check your internet connection.';
      } else {
        switch (error.status) {
          case 422:
            toastMessage = 'Please check the form for validation errors.';
            break;
          case 401:
            toastMessage = 'Session expired. Please log in again.';
            break;
          case 403:
            toastMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            toastMessage = 'Resource not found. Please refresh the page.';
            break;
          case 500:
            toastMessage = 'Server error. Please try again later.';
            break;
          default:
            toastMessage = error.message || 'An unexpected error occurred.';
        }
      }

      // Use Ant Design message component for better UX
      message.error(toastMessage);
    },

    // Clear all error states
    clearAllErrors() {
      this.clearValidationErrors();
      this.validationErrors = {};
    },

    // Enhanced form reset with error clearing
    resetFormCompletely() {
      this.resetForm();
      this.clearAllErrors();
      this.isSubmitting = false;
    },

    resetForm() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        end_date: null,
        organization: ''
      };
      this.isDraftMode = false;
      this.hasUnsavedChanges = false;
      this.restoredDataNotification.show = false;
      this.restoredDataNotification.timestamp = null;
      this.clearValidationErrors();
      this.clearFormDraft();
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

.form-label {
  font-weight: 500;
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
  padding: 12px 16px;
  background: #f0f9f4;
  border: 1px solid #d4edda;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-msg {
  text-align: center;
  color: #e53e3e;
  font-weight: bold;
  margin-bottom: 14px;
  padding: 12px 16px;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Validation summary styles */
.validation-summary .alert {
  border-radius: 6px;
  border: 1px solid #ffc107;
  background-color: #fff9e6;
  color: #856404;
}

.validation-summary .alert ul {
  padding-left: 1.2rem;
  margin-bottom: 0;
}

.validation-summary .alert li {
  margin-bottom: 4px;
  line-height: 1.4;
}

.validation-summary .alert li:last-child {
  margin-bottom: 0;
}

.validation-summary .alert strong {
  color: #664d03;
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

/* Input field container styling */
.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Ensure tooltip icons don't interfere with input functionality */
.tooltip-icon {
  pointer-events: auto;
  z-index: 1;
}

/* Modal content overflow fixes for tooltips */
.modal-content {
  overflow: visible !important;
}

.modal-body {
  overflow: visible !important;
}
</style>
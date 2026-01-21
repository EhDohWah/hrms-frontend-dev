<template>
  <div class="modal fade" id="job-offers-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="job-offers-modal-title">{{ editMode ? 'Edit' : 'Add' }} Job Offer</h5>
          <button type="button" class="btn-close" @click="handleModalClose" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Restored Data Notification -->
          <div v-if="restoredDataNotification.show" class="alert alert-info alert-dismissible fade show mb-3">
            <div class="d-flex align-items-center">
              <i class="ti ti-info-circle me-2"></i>
              <span>
                Your unsaved changes from {{ restoredDataNotification.timeAgo }} have been restored.
              </span>
            </div>
            <button type="button" class="btn-close" @click="restoredDataNotification.show = false"></button>
          </div>

          <form @submit.prevent="handleSubmit">
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              {{ alertMessage }}
            </div>

            <!-- Row 1: Offer Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="offerDate">
                  Offer Date <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker class="form-control datetimepicker input-short"
                      :class="{ 'is-invalid': validationErrors && validationErrors.date }" :editable="true"
                      :clearable="false" :input-format="displayFormat" v-model="formData.date"
                      @input="handleFormChange" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the date when the job offer was made" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors && validationErrors.date" class="invalid-feedback">
                  {{ validationErrors.date[0] }}
                </div>
              </div>
            </div>

            <!-- Row 2: Candidate Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="candidateName">
                  Candidate Name :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="candidateName" v-model="formData.candidate_name"
                  @input="handleFormChange" required />
              </div>
            </div>

            <!-- Row 3: Position Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="positionName">
                  Position Name :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="positionName" v-model="formData.position_name"
                  @input="handleFormChange" required />
              </div>
            </div>

            <!-- Row 4: Acceptance Deadline -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="acceptanceDeadline">
                  Acceptance Deadline <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker class="form-control datetimepicker input-short"
                      :class="{ 'is-invalid': validationErrors && validationErrors.acceptance_deadline }"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="displayFormat"
                      v-model="formData.acceptance_deadline" @input="handleFormChange" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the deadline for candidate acceptance" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors && validationErrors.acceptance_deadline" class="invalid-feedback">
                  {{ validationErrors.acceptance_deadline[0] }}
                </div>
              </div>
            </div>

            <!-- Row 5: Acceptance Status -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="acceptanceStatus">
                  Acceptance Status :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-short" id="acceptanceStatus" v-model="formData.acceptance_status"
                  @change="handleFormChange" required>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <!-- Row 6: Probation Salary -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="probationSalary">
                  Probation Salary (THB) <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <input type="number" class="form-control input-medium" id="probationSalary" v-model="formData.probation_salary"
                    :class="{ 'is-invalid': validationErrors && validationErrors.probation_salary }"
                    @input="handleFormChange" step="0.01" min="0" required />
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Enter the salary during probation period in Thai Baht" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors && validationErrors.probation_salary" class="invalid-feedback">
                  {{ validationErrors.probation_salary[0] }}
                </div>
              </div>
            </div>

            <!-- Row 7: Post-Probation Salary -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="postProbationSalary">
                  Post-Probation Salary (THB) <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <input type="number" class="form-control input-medium" id="postProbationSalary"
                    v-model="formData.post_probation_salary"
                    :class="{ 'is-invalid': validationErrors && validationErrors.post_probation_salary }"
                    @input="handleFormChange" step="0.01" min="0" required />
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Enter the salary after probation period in Thai Baht" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="validationErrors && validationErrors.post_probation_salary" class="invalid-feedback">
                  {{ validationErrors.post_probation_salary[0] }}
                </div>
              </div>
            </div>

            <!-- Row 8: Notes -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="note">
                  Notes :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <textarea class="form-control" id="note" v-model="formData.note" rows="3" @input="handleFormChange"
                    placeholder="Enter notes here" style="height: 100px" required></textarea>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Add any additional notes or comments about the job offer" class="tooltip-icon">
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

<style scoped>
.modal-dialog {
  max-width: 1000px;
}

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

.form-select.input-short {
  width: 200px;
  max-width: 200px;
}

.form-select.input-medium {
  width: 400px;
  max-width: 400px;
}

/* Responsive adjustments for input widths */
@media (max-width: 768px) {
  .input-short,
  .input-medium,
  .input-short-wrapper,
  .form-select.input-short,
  .form-select.input-medium {
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

/* Enhanced error display styling */
.alert {
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.alert-danger {
  background-color: #fef2f2;
  color: #dc2626;
  border-left: 4px solid #dc2626;
}

.alert-warning {
  background-color: #fffbeb;
  color: #d97706;
  border-left: 4px solid #d97706;
}

.alert-info {
  background-color: #eff6ff;
  color: #2563eb;
  border-left: 4px solid #2563eb;
}

.invalid-feedback {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-left: 0;
  display: block;
}

.is-invalid {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.25) !important;
}

/* Date picker error styling */
.input-icon-end .is-invalid {
  padding-right: 2.5rem;
}

/* Validation error list styling */
.alert ul {
  padding-left: 1.2rem;
  margin-bottom: 0;
}

.alert ul li {
  margin-bottom: 0.25rem;
}

.alert ul li:last-child {
  margin-bottom: 0;
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
  border-color: #dc2626 !important;
  background: #fff5f5 !important;
}

:deep(.mx-icon-calendar) {
  display: none;
}

.input-short-wrapper :deep(.mx-datepicker) {
  width: 100%;
}

.input-short-wrapper :deep(.mx-input) {
  width: 100% !important;
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

/* Modal content overflow fixes for tooltips */
.modal-content {
  overflow: visible !important;
}

.modal-body {
  overflow: visible !important;
}
</style>

<script>
import { Modal, Tooltip as BootstrapTooltip } from 'bootstrap';
import { useJobOfferStore } from '@/stores/jobOfferStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import { message, Modal as AntModal } from 'ant-design-vue';
import { ref, nextTick, createVNode } from 'vue';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import moment from 'moment';

export default {
  name: 'JobOffersModal',
  components: {
    InfoCircleOutlined,
  },
  setup() {
    const editMode = ref(false);
    const jobOfferData = ref(null);
    const alertMessage = ref('');
    const alertClass = ref('');

    return {
      editMode,
      jobOfferData,
      alertMessage,
      alertClass
    };
  },
  data() {
    return {
      formData: {
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
      },
      originalFormData: {},
      displayFormat: 'dd/MM/yyyy',
      inputFormat: 'yyyy-MM-dd',
      isSubmitting: false,
      modalInstance: null,
      isDraftMode: false,
      formKey: null,
      restoredDataNotification: {
        show: false,
        timeAgo: ''
      },
      validationErrors: {},
      ariaObserver: null
    }
  },
  computed: {
    hasUnsavedChanges() {
      if (!this.isDraftMode) return false;
      return JSON.stringify(this.formData) !== JSON.stringify(this.originalFormData);
    }
  },
  watch: {
    jobOfferData: {
      handler(newVal) {
        if (newVal) {
          // Clone the job offer data but convert formatted dates back to YYYY-MM-DD
          const formattedData = { ...newVal };

          // Convert date strings to Date objects
          if (formattedData.date) {
            if (typeof formattedData.date === 'string' && formattedData.date.includes('/')) {
              formattedData.date = moment(formattedData.date, 'DD/MM/YYYY').toDate();
            } else {
              formattedData.date = new Date(formattedData.date);
            }
          }

          if (formattedData.acceptance_deadline) {
            if (typeof formattedData.acceptance_deadline === 'string' && formattedData.acceptance_deadline.includes('/')) {
              formattedData.acceptance_deadline = moment(formattedData.acceptance_deadline, 'DD/MM/YYYY').toDate();
            } else {
              formattedData.acceptance_deadline = new Date(formattedData.acceptance_deadline);
            }
          }

          this.formData = formattedData;
        }
      },
      deep: true
    }
  },
  mounted() {
    // Initialize the modal when component is mounted
    const modalElement = document.getElementById('job-offers-modal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });

      // Listen for Bootstrap modal events
      modalElement.addEventListener('hide.bs.modal', this.onModalHide);

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

      this.ariaObserver.observe(modalElement, {
        attributes: true,
        attributeFilter: ['aria-hidden']
      });
    }

    // Initialize tooltips on component mount
    this.initializeTooltips();
  },
  beforeUnmount() {
    // Clean up event listeners
    const modalElement = document.getElementById('job-offers-modal');
    if (modalElement) {
      modalElement.removeEventListener('hide.bs.modal', this.onModalHide);
    }

    // Clean up MutationObserver
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = null;
    }

    // Clean up form persistence if needed
    if (this.formKey && this.isDraftMode) {
      const formPersistenceStore = useFormPersistenceStore();
      formPersistenceStore.clearFormData(this.formKey);
    }
  },
  methods: {
    // Initialize Bootstrap tooltips
    initializeTooltips() {
      this.$nextTick(() => {
        // Dispose of existing tooltips to prevent duplicates
        const existingTooltips = document.querySelectorAll('#job-offers-modal [data-bs-toggle="tooltip"]');
        existingTooltips.forEach(tooltipTriggerEl => {
          const existingTooltip = BootstrapTooltip.getInstance(tooltipTriggerEl);
          if (existingTooltip) {
            existingTooltip.dispose();
          }
        });

        // Initialize all tooltips within the modal
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('#job-offers-modal [data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new BootstrapTooltip(tooltipTriggerEl);
        });
      });
    },

    async openModal() {
      // Set form key for persistence
      this.formKey = this.editMode ? `job_offer_edit_${this.jobOfferData?.id || 'new'}` : `job_offer_new_${Date.now()}`;
      this.isDraftMode = true;

      if (this.editMode && this.jobOfferData) {
        // Clone existing data for edit mode
        const formattedData = { ...this.jobOfferData };

        // Convert date strings to Date objects
        if (formattedData.date) {
          if (typeof formattedData.date === 'string' && formattedData.date.includes('/')) {
            formattedData.date = moment(formattedData.date, 'DD/MM/YYYY').toDate();
          } else {
            formattedData.date = new Date(formattedData.date);
          }
        }

        if (formattedData.acceptance_deadline) {
          if (typeof formattedData.acceptance_deadline === 'string' && formattedData.acceptance_deadline.includes('/')) {
            formattedData.acceptance_deadline = moment(formattedData.acceptance_deadline, 'DD/MM/YYYY').toDate();
          } else {
            formattedData.acceptance_deadline = new Date(formattedData.acceptance_deadline);
          }
        }

        this.formData = formattedData;
        this.originalFormData = JSON.parse(JSON.stringify(formattedData));
      } else {
        // Check for restored data first
        const formPersistenceStore = useFormPersistenceStore();
        const savedDataResult = await formPersistenceStore.checkForSavedData(this.formKey);

        if (savedDataResult.hasSavedData) {
          // Restore saved data
          this.formData = { ...this.formData, ...savedDataResult.data };
          this.showRestoredDataNotification(savedDataResult.timestamp);
        } else {
          // Set defaults for new entry
          this.formData = {
            id: null,
            candidate_name: '',
            position_name: '',
            custom_offer_id: '',
            probation_salary: null,
            post_probation_salary: null,
            date: new Date(),
            acceptance_deadline: null,
            acceptance_status: 'pending',
            note: ''
          };
        }

        this.originalFormData = JSON.parse(JSON.stringify(this.formData));
      }

      // Show the modal using Bootstrap Modal instance
      if (this.modalInstance) {
        this.modalInstance.show();
        // Initialize tooltips when modal is shown
        this.$nextTick(() => {
          this.initializeTooltips();
        });
      } else {
        const modalElement = document.getElementById('job-offers-modal');
        if (modalElement) {
          this.modalInstance = new Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
          this.modalInstance.show();
          // Initialize tooltips when modal is shown
          this.$nextTick(() => {
            this.initializeTooltips();
          });
        } else {
          console.error('Modal element not found');
          message.error('Modal element not found');
        }
      }
    },

    onModalHide(event) {
      // Prevent modal from closing if there are unsaved changes
      if (this.hasUnsavedChanges) {
        event.preventDefault();
        this.showUnsavedChangesConfirm();
      }
    },

    handleModalClose() {
      if (this.hasUnsavedChanges) {
        this.showUnsavedChangesConfirm();
      } else {
        this.forceCloseModal();
      }
    },

    showUnsavedChangesConfirm() {
      AntModal.confirm({
        title: 'Unsaved Changes',
        icon: createVNode(ExclamationCircleOutlined),
        content: 'You have unsaved changes in the job offer form.\n\nWhat would you like to do?',
        okText: 'Continue Editing',
        cancelText: 'Discard Changes',
        centered: true,
        cancelButtonProps: {
          danger: true
        },
        onOk: () => {
          // User wants to continue editing - do nothing, stay in modal
          return Promise.resolve();
        },
        onCancel: () => {
          // User wants to discard changes
          this.forceCloseModal();
          return Promise.resolve();
        }
      });
    },

    forceCloseModal() {
      this.isDraftMode = false;

      // Clear form persistence
      if (this.formKey) {
        const formPersistenceStore = useFormPersistenceStore();
        formPersistenceStore.clearFormData(this.formKey);
      }

      this.resetForm();

      if (this.modalInstance) {
        // Temporarily remove the event listener to allow closing
        const modalElement = document.getElementById('job-offers-modal');
        modalElement.removeEventListener('hide.bs.modal', this.onModalHide);

        this.modalInstance.hide();

        // Re-add the event listener after a short delay
        setTimeout(() => {
          modalElement.addEventListener('hide.bs.modal', this.onModalHide);
        }, 100);
      }
    },

    handleFormChange() {
      if (this.isDraftMode && this.formKey) {
        // Save to form persistence store with debouncing
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
          const formPersistenceStore = useFormPersistenceStore();
          formPersistenceStore.saveFormData(this.formKey, this.formData);
        }, 500);
      }
    },

    showRestoredDataNotification(timestamp) {
      const timeAgo = moment(timestamp).fromNow();
      this.restoredDataNotification = {
        show: true,
        timeAgo: timeAgo
      };

      // Auto-hide notification after 10 seconds
      setTimeout(() => {
        this.restoredDataNotification.show = false;
      }, 10000);
    },

    async handleSubmit() {
      this.isSubmitting = true;
      this.alertMessage = ''; // Reset alert message
      this.validationErrors = {}; // Clear validation errors
      try {
        const jobOfferStore = useJobOfferStore();

        if (this.editMode) {
          await jobOfferStore.updateJobOffer(this.formData.id, this.formData);
        } else {
          await jobOfferStore.createJobOffer(this.formData);
        }

        // Clear form persistence after successful submit
        if (this.formKey) {
          const formPersistenceStore = useFormPersistenceStore();
          formPersistenceStore.clearFormData(this.formKey);
        }

        this.$emit(this.editMode ? 'job-offer-updated' : 'job-offer-added');
        message.success(this.editMode ? 'Job offer updated successfully' : 'Job offer added successfully');

        this.isDraftMode = false;
        this.forceCloseModal();
      } catch (error) {
        console.error('Error submitting form:', error);
        this.alertMessage = error.message || 'An error occurred while saving the job offer.';
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.formData = {
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
      this.originalFormData = {};
      this.alertMessage = '';
      this.alertClass = '';
      this.validationErrors = {};
      this.restoredDataNotification.show = false;
    }
  }
};
</script>

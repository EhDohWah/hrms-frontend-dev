<template>
  <div class="modal fade" id="job-offers-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
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

            <!-- Full Width Fields for offer date and salary details-->
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Offer Date <span class="text-danger">*</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker class="form-control datetimepicker" :editable="true" :clearable="false"
                      :input-format="displayFormat" v-model="formData.date" @input="handleFormChange" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <!-- Left Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="candidateName" class="form-label">Candidate Name</label>
                  <input type="text" class="form-control" id="candidateName" v-model="formData.candidate_name"
                    @input="handleFormChange" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Acceptance Deadline <span class="text-danger"> *</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                      :clearable="false" :input-format="displayFormat" v-model="formData.acceptance_deadline"
                      @input="handleFormChange" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="positionName" class="form-label">Position Name</label>
                  <input type="text" class="form-control" id="positionName" v-model="formData.position_name"
                    @input="handleFormChange" required />
                </div>

                <div class="mb-3">
                  <label for="acceptanceStatus" class="form-label">Acceptance Status</label>
                  <select class="form-select" id="acceptanceStatus" v-model="formData.acceptance_status"
                    @change="handleFormChange" required>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Full Width Fields -->
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <label for="salaryDetail" class="form-label">Salary Details</label>
                  <input type="text" class="form-control" id="salaryDetail" v-model="formData.salary_detail"
                    @input="handleFormChange" required />
                </div>

                <div class="mb-3">
                  <label for="note" class="form-label">Notes</label>
                  <textarea class="form-control" id="note" v-model="formData.note" rows="3" @input="handleFormChange"
                    placeholder="Enter notes here" style="height: 100px" required></textarea>
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
import { useJobOfferStore } from '@/stores/jobOfferStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import { message, Modal as AntModal } from 'ant-design-vue';
import { ref, nextTick, createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import moment from 'moment';

export default {
  name: 'JobOffersModal',
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
        salary_detail: '',
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
      }
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
    }
  },
  beforeUnmount() {
    // Clean up event listeners
    const modalElement = document.getElementById('job-offers-modal');
    if (modalElement) {
      modalElement.removeEventListener('hide.bs.modal', this.onModalHide);
    }

    // Clean up form persistence if needed
    if (this.formKey && this.isDraftMode) {
      const formPersistenceStore = useFormPersistenceStore();
      formPersistenceStore.clearFormData(this.formKey);
    }
  },
  methods: {
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
            salary_detail: '',
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
      } else {
        const modalElement = document.getElementById('job-offers-modal');
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
        salary_detail: '',
        date: null,
        acceptance_deadline: null,
        acceptance_status: 'pending',
        note: ''
      };
      this.originalFormData = {};
      this.alertMessage = '';
      this.alertClass = '';
      this.restoredDataNotification.show = false;
    }
  }
};
</script>

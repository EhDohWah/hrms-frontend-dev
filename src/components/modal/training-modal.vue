<template>
  <!-- Bootstrap Modal -->
  <div class="modal fade" id="training_modal" tabindex="-1" aria-labelledby="trainingModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <!-- Bootstrap Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" id="trainingModalLabel">
            {{ isEditMode ? 'Edit Training Program' : 'Add New Training Program' }}
          </h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <!-- Alert Message -->
        <div v-if="alertMessage" :class="['alert', alertClass, 'mx-3', 'mt-3', 'mb-0']" role="alert">
          {{ alertMessage }}
        </div>

        <!-- Bootstrap Form -->
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Form Section: Training Information -->
            <div class="form-section">
              <div class="section-header">
                <i class="ti ti-notebook"></i>
                <h6>Training Information</h6>
              </div>

              <div class="row g-3">
                <!-- Training Title -->
                <div class="col-md-12">
                  <label class="form-label required">Training Title</label>
                  <input type="text" class="form-control" v-model="formData.title"
                    :class="{ 'is-invalid': errors.title }" placeholder="Enter training title" maxlength="200" required>
                  <div class="invalid-feedback" v-if="errors.title">
                    {{ errors.title }}
                  </div>
                  <small class="text-muted">{{ formData.title?.length || 0 }}/200 characters</small>
                </div>

                <!-- Organizer -->
                <div class="col-md-12">
                  <label class="form-label required">Organizer</label>
                  <input type="text" class="form-control" v-model="formData.organizer"
                    :class="{ 'is-invalid': errors.organizer }" placeholder="Enter organizer name or organization"
                    maxlength="100" required>
                  <div class="invalid-feedback" v-if="errors.organizer">
                    {{ errors.organizer }}
                  </div>
                  <small class="text-muted">{{ formData.organizer?.length || 0 }}/100 characters</small>
                </div>

                <!-- Start Date -->
                <div class="col-md-6">
                  <label class="form-label required">Start Date</label>
                  <div class="input-icon-end position-relative">
                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                      :clearable="false" :input-format="displayFormat" v-model="formData.start_date"
                      :class="{ 'is-invalid': errors.start_date }"
                      @update:model-value="handleDateChange('start_date', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <div class="invalid-feedback" v-if="errors.start_date">
                    {{ errors.start_date }}
                  </div>
                </div>

                <!-- End Date -->
                <div class="col-md-6">
                  <label class="form-label required">End Date</label>
                  <div class="input-icon-end position-relative">
                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                      :clearable="false" :input-format="displayFormat" v-model="formData.end_date"
                      :class="{ 'is-invalid': errors.end_date }"
                      @update:model-value="handleDateChange('end_date', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <div class="invalid-feedback" v-if="errors.end_date">
                    {{ errors.end_date }}
                  </div>
                </div>

                <!-- Duration Display -->
                <div class="col-md-12" v-if="formData.start_date && formData.end_date">
                  <div class="alert alert-info mb-0">
                    <i class="ti ti-calendar-time me-2"></i>
                    <strong>Duration:</strong> {{ calculateDuration(formData.start_date, formData.end_date) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bootstrap Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal" :disabled="isSubmitting">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSubmitting ? 'Saving...' : 'Save Training' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'; // ✅ Selective import
import { useTrainingStore } from '@/stores/trainingStore';
import { trainingService } from '@/services/training.service';

export default {
  name: 'TrainingModal',

  emits: ['training-added', 'training-updated'],

  data() {
    return {
      trainingStore: useTrainingStore(),
      modalInstance: null,
      isEditMode: false,
      editingTrainingId: null,

      formData: {
        title: '',
        organizer: '',
        start_date: '',
        end_date: ''
      },

      errors: {},
      alertMessage: '',
      alertClass: '',
      isSubmitting: false,

      // Date picker format
      displayFormat: 'dd/MM/yyyy',
      inputFormat: 'yyyy-MM-dd'
    };
  },

  methods: {
    /**
     * Handle date picker changes
     */
    handleDateChange(fieldName, newValue) {
      try {
        const safeDate = this.safeConvertToDate(newValue);
        this.formData[fieldName] = safeDate;
      } catch (error) {
        console.error('Error handling date change:', error);
      }
    },

    /**
     * Safe date conversion helper
     */
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

    /**
     * Open modal in add mode
     */
    openAddTrainingModal() {
      this.isEditMode = false;
      this.editingTrainingId = null;
      this.resetForm();
      this.openModal();
    },

    /**
     * Open modal in edit mode
     */
    openEditTrainingModal(training) {
      this.isEditMode = true;
      this.editingTrainingId = training.id;
      this.populateForm(training);
      this.openModal();
    },

    /**
     * Open the modal
     */
    openModal() {
      this.modalInstance = new Modal(document.getElementById('training_modal'));
      this.modalInstance.show();
    },

    /**
     * Close the modal
     */
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },

    /**
     * Reset form to initial state
     */
    resetForm() {
      this.formData = {
        title: '',
        organizer: '',
        start_date: '',
        end_date: ''
      };
      this.errors = {};
      this.alertMessage = '';
      this.alertClass = '';
      this.isSubmitting = false;
    },

    /**
     * Populate form with training data for editing
     */
    populateForm(training) {
      this.formData = {
        title: training.title || '',
        organizer: training.organizer || '',
        start_date: training.start_date || '',
        end_date: training.end_date || ''
      };
      this.errors = {};
      this.alertMessage = '';
      this.alertClass = '';
    },

    /**
     * Handle form submission
     */
    async handleSubmit() {
      // Clear previous errors and alerts
      this.errors = {};
      this.alertMessage = '';

      // Validate form
      const validation = trainingService.validateTrainingData(this.formData);
      if (!validation.isValid) {
        this.errors = validation.errors;
        this.alertMessage = 'Please fix the errors below';
        this.alertClass = 'alert-danger';
        return;
      }

      this.isSubmitting = true;

      try {
        if (this.isEditMode) {
          // Update existing training
          await this.trainingStore.updateTraining(this.editingTrainingId, this.formData);
          this.showSuccessAndClose('Training updated successfully', 'training-updated');
        } else {
          // Create new training
          await this.trainingStore.createTraining(this.formData);
          this.showSuccessAndClose('Training created successfully', 'training-added');
        }
      } catch (error) {
        console.error('Error saving training:', error);

        // Handle validation errors from backend
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors;
          this.alertMessage = 'Please fix the errors below';
        } else {
          this.alertMessage = error.message || 'Failed to save training. Please try again.';
        }

        this.alertClass = 'alert-danger';
        this.isSubmitting = false;
      }
    },

    /**
     * Show success message and close modal
     */
    showSuccessAndClose(message, emitEvent) {
      this.alertMessage = message;
      this.alertClass = 'alert-success';

      setTimeout(() => {
        this.closeModal();
        this.$emit(emitEvent);
        this.resetForm();
      }, 1500);
    },

    /**
     * Calculate training duration
     */
    calculateDuration(startDate, endDate) {
      if (!startDate || !endDate) return 'N/A';

      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
  },

  /**
   * Cleanup on component unmount
   */
  beforeUnmount() {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  }
};
</script>

<style scoped>
/* Modal Styling */
.modal-content {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 15px 20px;
}

.modal-title {
  font-weight: 600;
  color: #011b44;
}

/* Form Section Styling */
.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #495057;
}

.section-header i {
  font-size: 20px;
  margin-right: 8px;
  color: var(--bs-primary);
}

.section-header h6 {
  margin: 0;
  font-weight: 600;
}

/* Required Field Indicator */
.form-label.required::after {
  content: ' *';
  color: #dc3545;
}

/* Form Control Styling */
.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

/* Alert Styling */
.alert {
  border-radius: 6px;
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #004085;
}

/* Button Styling */
.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Small Text */
small.text-muted {
  display: block;
  margin-top: 4px;
  font-size: 0.875rem;
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
</style>

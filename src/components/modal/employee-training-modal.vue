<template>
  <!-- Bootstrap Modal -->
  <div class="modal fade" id="employee_training_modal" tabindex="-1" aria-labelledby="employeeTrainingModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <!-- Bootstrap Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" id="employeeTrainingModalLabel">
            {{ isEditMode ? 'Edit Employee Training' : 'Assign Employee to Training' }}
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
            <!-- Form Section: Assignment Information -->
            <div class="form-section">
              <div class="section-header">
                <i class="ti ti-user-check"></i>
                <h6>Training Assignment</h6>
              </div>

              <div class="row g-3">
                <!-- Employee Selection -->
                <div class="col-md-12">
                  <label class="form-label required">Employee</label>
                  <a-select v-model:value="formData.employee_id" show-search placeholder="Select employee"
                    style="width: 100%" :class="{ 'is-invalid': errors.employee_id }"
                    :filter-option="filterEmployeeOption" :options="employeeOptions" :disabled="isEditMode"
                    :get-popup-container="(triggerNode) => triggerNode.parentNode" :loading="loadingEmployees">
                    <template #notFoundContent>
                      <div class="text-center py-3">
                        <i class="ti ti-users-off"></i>
                        <p class="mt-2">No employees found</p>
                      </div>
                    </template>
                  </a-select>
                  <div class="invalid-feedback d-block" v-if="errors.employee_id">
                    {{ errors.employee_id }}
                  </div>
                  <small class="text-muted" v-if="isEditMode">Employee cannot be changed after creation</small>
                </div>

                <!-- Training Program Selection -->
                <div class="col-md-12">
                  <label class="form-label required">Training Program</label>
                  <a-select v-model:value="formData.training_id" show-search placeholder="Select training program"
                    style="width: 100%" :class="{ 'is-invalid': errors.training_id }"
                    :filter-option="filterTrainingOption" :options="trainingOptions" :disabled="isEditMode"
                    :get-popup-container="(triggerNode) => triggerNode.parentNode" :loading="loadingTrainings">
                    <template #notFoundContent>
                      <div class="text-center py-3">
                        <i class="ti ti-notebook-off"></i>
                        <p class="mt-2">No training programs found</p>
                      </div>
                    </template>
                  </a-select>
                  <div class="invalid-feedback d-block" v-if="errors.training_id">
                    {{ errors.training_id }}
                  </div>
                  <small class="text-muted" v-if="isEditMode">Training program cannot be changed after creation</small>
                </div>

                <!-- Status Selection -->
                <div class="col-md-12">
                  <label class="form-label required">Status</label>
                  <select v-model="formData.status" class="form-select" :class="{ 'is-invalid': errors.status }"
                    required>
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.status">
                    {{ errors.status }}
                  </div>
                </div>

                <!-- Training Details Display (when training is selected) -->
                <div class="col-md-12" v-if="selectedTrainingDetails">
                  <div class="alert alert-info mb-0">
                    <h6 class="alert-heading">
                      <i class="ti ti-info-circle me-2"></i>Training Details
                    </h6>
                    <hr>
                    <div class="row">
                      <div class="col-md-6">
                        <strong>Training:</strong> {{ selectedTrainingDetails.title }}
                      </div>
                      <div class="col-md-6">
                        <strong>Organizer:</strong> {{ selectedTrainingDetails.organizer }}
                      </div>
                      <div class="col-md-6 mt-2">
                        <strong>Start Date:</strong> {{ formatDate(selectedTrainingDetails.start_date) }}
                      </div>
                      <div class="col-md-6 mt-2">
                        <strong>End Date:</strong> {{ formatDate(selectedTrainingDetails.end_date) }}
                      </div>
                    </div>
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
              {{ isSubmitting ? 'Saving...' : 'Save Assignment' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'; // ✅ Selective import
import { useEmployeeTrainingStore } from '@/stores/employeeTrainingStore';
import { useTrainingStore } from '@/stores/trainingStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { employeeTrainingService } from '@/services/employeeTraining.service';
import { message } from 'ant-design-vue';

export default {
  name: 'EmployeeTrainingModal',

  emits: ['employee-training-added', 'employee-training-updated'],

  data() {
    return {
      employeeTrainingStore: useEmployeeTrainingStore(),
      trainingStore: useTrainingStore(),
      sharedDataStore: useSharedDataStore(),

      modalInstance: null,
      isEditMode: false,
      editingEmployeeTrainingId: null,

      formData: {
        employee_id: null,
        training_id: null,
        status: 'Pending'
      },

      errors: {},
      alertMessage: '',
      alertClass: '',
      isSubmitting: false,

      loadingEmployees: false,
      loadingTrainings: false
    };
  },

  computed: {
    employeeOptions() {
      return this.sharedDataStore.employees.map(emp => ({
        value: emp.id,
        label: `${emp.name || 'Unknown'} (${emp.staff_id || 'N/A'})`.trim(),
        searchText: `${emp.name || ''} ${emp.staff_id || ''}`.toLowerCase()
      }));
    },

    trainingOptions() {
      return this.trainingStore.trainings.map(training => ({
        value: training.id,
        label: `${training.title} - ${training.organizer} (${this.formatDateShort(training.start_date)})`,
        searchText: `${training.title} ${training.organizer}`.toLowerCase(),
        details: training
      }));
    },

    selectedTrainingDetails() {
      if (!this.formData.training_id) return null;
      const training = this.trainingStore.trainings.find(t => t.id === this.formData.training_id);
      return training || null;
    }
  },

  methods: {
    /**
     * Open modal in add mode
     */
    async openAddEmployeeTrainingModal() {
      this.isEditMode = false;
      this.editingEmployeeTrainingId = null;
      this.resetForm();
      await this.loadRequiredData();
      this.openModal();
    },

    /**
     * Open modal in edit mode
     */
    async openEditEmployeeTrainingModal(employeeTraining) {
      this.isEditMode = true;
      this.editingEmployeeTrainingId = employeeTraining.id;
      this.populateForm(employeeTraining);
      await this.loadRequiredData();
      this.openModal();
    },

    /**
     * Load required dropdown data
     */
    async loadRequiredData() {
      try {
        // Load employees if not already loaded
        if (!this.sharedDataStore.isEmployeesLoaded) {
          this.loadingEmployees = true;
          await this.sharedDataStore.fetchEmployees();
          this.loadingEmployees = false;
        }

        // Load trainings if not already loaded
        if (this.trainingStore.trainings.length === 0) {
          this.loadingTrainings = true;
          await this.trainingStore.fetchTrainings({ per_page: 100 }); // Load all trainings for dropdown
          this.loadingTrainings = false;
        }
      } catch (error) {
        console.error('Error loading required data:', error);
        message.error('Failed to load required data. Please try again.');
      }
    },

    /**
     * Open the modal
     */
    openModal() {
      this.modalInstance = new Modal(document.getElementById('employee_training_modal'));
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
        employee_id: null,
        training_id: null,
        status: 'Pending'
      };
      this.errors = {};
      this.alertMessage = '';
      this.alertClass = '';
      this.isSubmitting = false;
    },

    /**
     * Populate form with employee training data for editing
     */
    populateForm(employeeTraining) {
      this.formData = {
        employee_id: employeeTraining.employee_id,
        training_id: employeeTraining.training_id,
        status: employeeTraining.status || 'Pending'
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
      const validation = employeeTrainingService.validateEmployeeTrainingData(this.formData);
      if (!validation.isValid) {
        this.errors = validation.errors;
        this.alertMessage = 'Please fix the errors below';
        this.alertClass = 'alert-danger';
        return;
      }

      this.isSubmitting = true;

      try {
        if (this.isEditMode) {
          // Update existing employee training
          await this.employeeTrainingStore.updateEmployeeTraining(this.editingEmployeeTrainingId, this.formData);
          this.showSuccessAndClose('Employee training updated successfully', 'employee-training-updated');
        } else {
          // Create new employee training
          await this.employeeTrainingStore.createEmployeeTraining(this.formData);
          this.showSuccessAndClose('Employee training created successfully', 'employee-training-added');
        }
      } catch (error) {
        console.error('Error saving employee training:', error);

        // Handle validation errors from backend
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors;
          this.alertMessage = 'Please fix the errors below';
          this.alertClass = 'alert-danger';
        } else {
          // Use Ant Design message for general errors
          const errorMessage = error.message || 'Failed to save employee training. Please try again.';
          message.error(errorMessage);
        }

        this.isSubmitting = false;
      }
    },

    /**
     * Show success message and close modal
     */
    showSuccessAndClose(successMessage, emitEvent) {
      // Use Ant Design message notification
      message.success(successMessage);

      // Close modal and emit event
      this.closeModal();
      this.$emit(emitEvent);
      this.resetForm();
    },

    /**
     * Filter employee options for search
     */
    filterEmployeeOption(input, option) {
      return option.searchText.includes(input.toLowerCase());
    },

    /**
     * Filter training options for search
     */
    filterTrainingOption(input, option) {
      return option.searchText.includes(input.toLowerCase());
    },

    /**
     * Format date for display
     */
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },

    /**
     * Format date short version
     */
    formatDateShort(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc3545;
}

/* Ant Design Select Styling */
:deep(.ant-select) {
  font-size: 14px;
}

:deep(.ant-select-selector) {
  border-radius: 6px !important;
  min-height: 38px !important;
  padding: 4px 11px !important;
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: var(--bs-primary) !important;
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25) !important;
}

:deep(.is-invalid .ant-select-selector) {
  border-color: #dc3545 !important;
}

/* Ant Design Dropdown */
:deep(.ant-select-dropdown) {
  z-index: 1060 !important;
  /* Higher than modal */
  border-radius: 6px;
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

.alert-info .alert-heading {
  color: #004085;
  font-size: 1rem;
  margin-bottom: 10px;
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
</style>

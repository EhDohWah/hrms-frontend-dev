<template>
  <div class="modal fade" id="benefitSettingModal" tabindex="-1" aria-labelledby="benefitSettingModalLabel"
    aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-light border-bottom px-4 py-3">
          <h5 class="modal-title fw-semibold" id="benefitSettingModalLabel">
            <i class="ti ti-settings me-2 text-primary"></i>{{ isEditMode ? 'Edit' : 'Add' }} Benefit Setting
          </h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body px-4 py-4">
          <form @submit.prevent="submitForm">
            <div class="row g-4">
              <!-- Setting Key -->
              <div class="col-md-6">
                <label for="setting_key" class="form-label">
                  Setting Key <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control" id="setting_key" v-model="formData.setting_key"
                  :disabled="isEditMode" placeholder="e.g., pvd_percentage" required>
                <small class="text-muted">Unique identifier for this setting</small>
                <div v-if="errors.setting_key" class="text-danger small mt-1">{{ errors.setting_key }}</div>
              </div>

              <!-- Setting Type -->
              <div class="col-md-6">
                <label for="setting_type" class="form-label">
                  Setting Type <span class="text-danger">*</span>
                </label>
                <select class="form-select" id="setting_type" v-model="formData.setting_type" required>
                  <option value="">Select type</option>
                  <option value="percentage">Percentage (%)</option>
                  <option value="numeric">Numeric Value</option>
                  <option value="boolean">Boolean (Yes/No)</option>
                </select>
                <div v-if="errors.setting_type" class="text-danger small mt-1">{{ errors.setting_type }}</div>
              </div>

              <!-- Setting Value -->
              <div class="col-md-6">
                <label for="setting_value" class="form-label">
                  Setting Value <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <input type="number" class="form-control" id="setting_value" v-model="formData.setting_value"
                    step="0.01" placeholder="e.g., 7.50" required>
                  <span v-if="formData.setting_type === 'percentage'" class="input-group-text">%</span>
                </div>
                <small class="text-muted">
                  {{ getValueHint() }}
                </small>
                <div v-if="errors.setting_value" class="text-danger small mt-1">{{ errors.setting_value }}</div>
              </div>

              <!-- Effective Date -->
              <div class="col-md-6">
                <label for="effective_date" class="form-label">
                  Effective Date
                </label>
                <input type="date" class="form-control" id="effective_date" v-model="formData.effective_date">
                <small class="text-muted">When this setting becomes active</small>
                <div v-if="errors.effective_date" class="text-danger small mt-1">{{ errors.effective_date }}</div>
              </div>

              <!-- Description -->
              <div class="col-12">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" v-model="formData.description" rows="3"
                  placeholder="Brief description of what this setting controls"></textarea>
                <div v-if="errors.description" class="text-danger small mt-1">{{ errors.description }}</div>
              </div>

              <!-- Is Active -->
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="is_active" v-model="formData.is_active">
                  <label class="form-check-label" for="is_active">
                    Active Setting
                  </label>
                  <small class="text-muted d-block">Only active settings are used in payroll calculations</small>
                </div>
              </div>

              <!-- Preview Card -->
              <div class="col-12" v-if="formData.setting_key && formData.setting_value">
                <div class="alert alert-info bg-info-subtle border-info mb-0">
                  <div class="d-flex align-items-start">
                    <i class="ti ti-eye fs-4 me-2 mt-1 text-info"></i>
                    <div class="flex-grow-1">
                      <h6 class="alert-heading fw-semibold mb-2">Preview</h6>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-semibold text-dark">{{ formData.setting_key }}</span>
                        <span class="badge bg-primary px-3 py-2 fs-6">{{ formatPreviewValue() }}</span>
                      </div>
                      <p class="text-muted small mb-0">
                        <i class="ti ti-info-circle me-1"></i>
                        {{ formData.description || 'No description provided' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer gap-2 px-4 py-3">
          <button type="button" class="btn btn-light border px-4" @click="closeModal">
            <i class="ti ti-x me-1"></i>Cancel
          </button>
          <button type="button" class="btn btn-primary px-4" @click="submitForm" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="ti me-2" :class="isEditMode ? 'ti-device-floppy' : 'ti-plus'"></i>
            {{ isEditMode ? 'Update' : 'Create' }} Setting
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { benefitSettingService } from '@/services/benefitSetting.service';

export default {
  name: 'BenefitSettingModal',
  data() {
    return {
      modalInstance: null,
      isEditMode: false,
      submitting: false,
      formData: {
        setting_key: '',
        setting_value: '',
        setting_type: '',
        description: '',
        effective_date: '',
        is_active: true
      },
      errors: {}
    };
  },
  mounted() {
    const modalElement = document.getElementById('benefitSettingModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }
  },
  methods: {
    openAddBenefitSettingModal() {
      this.isEditMode = false;
      this.resetForm();
      // Set default effective date to today
      this.formData.effective_date = new Date().toISOString().split('T')[0];
      this.modalInstance.show();
    },
    openEditBenefitSettingModal(setting) {
      this.isEditMode = true;
      this.resetForm();
      this.formData = {
        id: setting.id,
        setting_key: setting.setting_key,
        setting_value: setting.setting_value,
        setting_type: setting.setting_type,
        description: setting.description || '',
        effective_date: setting.effective_date ? setting.effective_date.split('T')[0] : '',
        is_active: setting.is_active
      };
      this.modalInstance.show();
    },
    closeModal() {
      this.modalInstance.hide();
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        setting_key: '',
        setting_value: '',
        setting_type: '',
        description: '',
        effective_date: '',
        is_active: true
      };
      this.errors = {};
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.submitting = true;

      try {
        let response;
        if (this.isEditMode) {
          response = await benefitSettingService.updateBenefitSetting(this.formData.id, this.formData);
        } else {
          response = await benefitSettingService.createBenefitSetting(this.formData);
        }

        if (response.success) {
          this.closeModal();
          if (this.isEditMode) {
            this.$emit('benefit-setting-updated', response.data);
          } else {
            this.$emit('benefit-setting-added', response.data);
          }
        } else {
          if (response.errors) {
            this.errors = response.errors;
          } else {
            this.$toast.error(response.message || 'Failed to save benefit setting');
          }
        }
      } catch (error) {
        console.error('Error saving benefit setting:', error);
        this.$toast.error('An error occurred while saving the benefit setting');
      } finally {
        this.submitting = false;
      }
    },
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.formData.setting_key) {
        this.errors.setting_key = 'Setting key is required';
        isValid = false;
      }

      if (!this.formData.setting_type) {
        this.errors.setting_type = 'Setting type is required';
        isValid = false;
      }

      if (!this.formData.setting_value && this.formData.setting_value !== 0) {
        this.errors.setting_value = 'Setting value is required';
        isValid = false;
      }

      if (this.formData.setting_type === 'percentage' && (this.formData.setting_value < 0 || this.formData.setting_value > 100)) {
        this.errors.setting_value = 'Percentage must be between 0 and 100';
        isValid = false;
      }

      return isValid;
    },
    getValueHint() {
      if (this.formData.setting_type === 'percentage') {
        return 'Enter percentage value (0-100)';
      } else if (this.formData.setting_type === 'numeric') {
        return 'Enter numeric value';
      } else if (this.formData.setting_type === 'boolean') {
        return 'Enter 1 for Yes, 0 for No';
      }
      return 'Enter the setting value';
    },
    formatPreviewValue() {
      if (this.formData.setting_type === 'percentage') {
        return `${this.formData.setting_value}%`;
      } else if (this.formData.setting_type === 'boolean') {
        return this.formData.setting_value ? 'Yes' : 'No';
      }
      return this.formData.setting_value;
    }
  }
};
</script>

<style scoped>
.modal-header {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.text-danger {
  font-size: 0.875rem;
}

.card {
  border: 1px solid #dee2e6;
}

.badge {
  font-size: 0.875rem;
  padding: 0.35em 0.65em;
}
</style>

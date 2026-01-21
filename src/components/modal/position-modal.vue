<template>
  <!-- Add/Edit Position Modal -->
  <div class="modal fade" id="add_position_modal" tabindex="-1" aria-labelledby="positionModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="positionModalLabel">
            {{ isEditMode ? 'Edit Position' : 'Add New Position' }}
          </h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div v-if="alertMessage" class="alert mx-3 mt-3" :class="alertClass" role="alert">
          {{ alertMessage }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row g-3">
              <!-- Title -->
              <div class="col-md-6">
                <label class="form-label">Title <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="formData.title"
                  :class="{ 'is-invalid': validationErrors.title }" placeholder="Enter position title" required>
                <div v-if="validationErrors.title" class="invalid-feedback">
                  {{ validationErrors.title }}
                </div>
              </div>

              <!-- Department -->
              <div class="col-md-6">
                <label class="form-label">Department <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.department_id"
                  :class="{ 'is-invalid': validationErrors.department_id }" required
                  @change="onDepartmentChange">
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <div v-if="validationErrors.department_id" class="invalid-feedback">
                  {{ validationErrors.department_id }}
                </div>
              </div>

              <!-- Reports To -->
              <div class="col-md-6">
                <label class="form-label">Reports To</label>
                <select class="form-select" v-model="formData.reports_to_position_id">
                  <option value="">None</option>
                  <option v-for="pos in availableReportsTo" :key="pos.id" :value="pos.id">
                    {{ pos.title }} ({{ pos.department_name }})
                  </option>
                </select>
                <small class="text-muted">Select the position this position reports to</small>
              </div>

              <!-- Level -->
              <div class="col-md-6">
                <label class="form-label">Level <span class="text-danger">*</span></label>
                <input type="number" class="form-control" v-model.number="formData.level"
                  :class="{ 'is-invalid': validationErrors.level }" min="1" required>
                <div v-if="validationErrors.level" class="invalid-feedback">
                  {{ validationErrors.level }}
                </div>
                <small class="text-muted">1 = Department Head, 2 = Manager, 3+ = Staff</small>
              </div>

              <!-- Is Manager -->
              <div class="col-md-6">
                <label class="form-label">Position Type</label>
                <select class="form-select" v-model="formData.is_manager">
                  <option :value="true">Manager</option>
                  <option :value="false">Staff</option>
                </select>
              </div>

              <!-- Status -->
              <div class="col-md-6">
                <label class="form-label">Status</label>
                <select class="form-select" v-model="formData.is_active">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="modal fade" id="delete_position_modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Delete Position</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this position? This action cannot be undone.</p>
          <p class="text-warning"><i class="ti ti-alert-triangle me-1"></i>Note: Positions with active subordinates cannot be deleted.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="deletePosition" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
            {{ isSubmitting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { usePositionStore } from '@/stores/positionStore';
import { useDepartmentStore } from '@/stores/departmentStore';

export default {
  name: 'PositionModal',
  emits: ['position-added', 'position-updated'],
  data() {
    return {
      isEditMode: false,
      currentId: null,
      formData: {
        title: '',
        department_id: '',
        reports_to_position_id: '',
        level: 1,
        is_manager: false,
        is_active: true,
      },
      departments: [],
      positions: [],
      validationErrors: {},
      alertMessage: '',
      alertClass: '',
      isSubmitting: false,
      addModalInstance: null,
      deleteModalInstance: null,
      deleteId: null,
    };
  },
  computed: {
    availableReportsTo() {
      // Filter positions to exclude the current position (if editing) and only show positions from the same department
      let filtered = this.positions;
      
      if (this.isEditMode && this.currentId) {
        filtered = filtered.filter(p => p.id !== this.currentId);
      }
      
      // Optionally filter by same department
      if (this.formData.department_id) {
        filtered = filtered.filter(p => p.department_id === parseInt(this.formData.department_id));
      }
      
      return filtered;
    }
  },
  methods: {
    async loadDropdowns() {
      try {
        const departmentStore = useDepartmentStore();
        const positionStore = usePositionStore();
        
        await departmentStore.fetchDepartmentOptions();
        await positionStore.fetchPositionOptions();
        
        this.departments = departmentStore.departmentOptions;
        this.positions = positionStore.positionOptions;
      } catch (error) {
        console.error('Error loading dropdowns:', error);
      }
    },

    setEditPosition(record) {
      this.isEditMode = true;
      this.currentId = record.id;
      this.formData = {
        title: record.title || '',
        department_id: record.department_id || '',
        reports_to_position_id: record.reports_to_position_id || '',
        level: record.level || 1,
        is_manager: record.is_manager || false,
        is_active: record.is_active !== undefined ? record.is_active : true,
      };
      this.validationErrors = {};
      this.alertMessage = '';
      this.loadDropdowns();
      this.openModal();
    },

    openModal() {
      if (!this.addModalInstance) {
        this.addModalInstance = new Modal(document.getElementById('add_position_modal'));
      }
      this.addModalInstance.show();
    },

    closeModal() {
      if (this.addModalInstance) {
        this.addModalInstance.hide();
      }
      this.resetForm();
    },

    resetForm() {
      this.isEditMode = false;
      this.currentId = null;
      this.formData = {
        title: '',
        department_id: '',
        reports_to_position_id: '',
        level: 1,
        is_manager: false,
        is_active: true,
      };
      this.validationErrors = {};
      this.alertMessage = '';
    },

    onDepartmentChange() {
      // Reset reports_to when department changes
      this.formData.reports_to_position_id = '';
    },

    confirmDeletePosition(positionId) {
      this.deleteId = positionId;
      if (!this.deleteModalInstance) {
        this.deleteModalInstance = new Modal(document.getElementById('delete_position_modal'));
      }
      this.deleteModalInstance.show();
    },

    async handleSubmit() {
      this.validationErrors = {};
      this.alertMessage = '';
      this.isSubmitting = true;

      try {
        const positionStore = usePositionStore();

        if (this.isEditMode) {
          await positionStore.updatePosition(this.currentId, this.formData);
          this.alertMessage = 'Position updated successfully!';
          this.$emit('position-updated');
        } else {
          await positionStore.createPosition(this.formData);
          this.alertMessage = 'Position created successfully!';
          this.$emit('position-added');
        }

        this.alertClass = 'alert-success';

        setTimeout(() => {
          this.closeModal();
        }, 1500);
      } catch (error) {
        if (error.errors) {
          this.validationErrors = error.errors;
          this.alertMessage = 'Please fix the validation errors';
        } else {
          this.alertMessage = error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} position`;
        }
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    async deletePosition() {
      this.isSubmitting = true;

      try {
        const positionStore = usePositionStore();
        await positionStore.deletePosition(this.deleteId);

        if (this.deleteModalInstance) {
          this.deleteModalInstance.hide();
        }

        this.$emit('position-updated');
        this.$message.success('Position deleted successfully');
      } catch (error) {
        this.$message.error(error.message || 'Failed to delete position');
      } finally {
        this.isSubmitting = false;
        this.deleteId = null;
      }
    },
  },
  mounted() {
    const modalEl = document.getElementById('add_position_modal');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
      modalEl.addEventListener('show.bs.modal', () => {
        this.loadDropdowns();
      });
    }
  },
};
</script>

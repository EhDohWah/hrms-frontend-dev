<template>
  <!-- Add/Edit Department Modal -->
  <div class="modal fade" id="add_department_modal" tabindex="-1" aria-labelledby="departmentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="departmentModalLabel">
            {{ isEditMode ? 'Edit Department' : 'Add New Department' }}
          </h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div v-if="alertMessage" class="alert mx-3 mt-3" :class="alertClass" role="alert">
          {{ alertMessage }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="row g-3">
              <!-- Name -->
              <div class="col-md-12">
                <label class="form-label">Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="formData.name"
                  :class="{ 'is-invalid': validationErrors.name }" placeholder="Enter department name" required>
                <div v-if="validationErrors.name" class="invalid-feedback">
                  {{ validationErrors.name }}
                </div>
              </div>

              <!-- Description -->
              <div class="col-md-12">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="formData.description" rows="3"
                  placeholder="Enter description"></textarea>
              </div>

              <!-- Status -->
              <div class="col-md-12">
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
  <div class="modal fade" id="delete_department_modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Delete Department</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this department?</p>
          <p class="text-info"><i class="ti ti-info-circle me-1"></i>The department and related data will be moved to the Recycle Bin and can be restored within 30 days.</p>
          <p class="text-warning"><i class="ti ti-alert-triangle me-1"></i>Note: Departments with active employments or personnel actions cannot be deleted.</p>
          <div v-if="deleteError" class="alert alert-danger mt-2">
            <strong>Cannot delete:</strong>
            <ul class="mb-0 mt-1">
              <li v-for="(blocker, index) in deleteBlockers" :key="index">{{ blocker }}</li>
            </ul>
          </div>
          </div>
          <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="deleteDepartment" :disabled="isSubmitting">
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
import { useDepartmentStore } from '@/stores/departmentStore';

export default {
  name: 'DepartmentModal',
  emits: ['department-added', 'department-updated'],
  data() {
    return {
      isEditMode: false,
      currentId: null,
      formData: {
        name: '',
        description: '',
        is_active: true,
      },
      validationErrors: {},
      alertMessage: '',
      alertClass: '',
      isSubmitting: false,
      addModalInstance: null,
      deleteModalInstance: null,
      deleteId: null,
      deleteError: false,
      deleteBlockers: [],
    };
  },
  methods: {
    setEditDepartment(record) {
      this.isEditMode = true;
      this.currentId = record.id;
      this.formData = {
        name: record.name || '',
        description: record.description || '',
        is_active: record.is_active !== undefined ? record.is_active : true,
      };
      this.validationErrors = {};
      this.alertMessage = '';
      this.openModal();
    },

    openModal() {
      if (!this.addModalInstance) {
        this.addModalInstance = new Modal(document.getElementById('add_department_modal'));
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
        name: '',
        description: '',
        is_active: true,
      };
      this.validationErrors = {};
      this.alertMessage = '';
    },

    confirmDeleteDepartment(departmentId) {
      this.deleteId = departmentId;
      this.deleteError = false;
      this.deleteBlockers = [];
      if (!this.deleteModalInstance) {
        this.deleteModalInstance = new Modal(document.getElementById('delete_department_modal'));
      }
      this.deleteModalInstance.show();
    },

    async handleSubmit() {
      this.validationErrors = {};
      this.alertMessage = '';
      this.isSubmitting = true;

      try {
        const departmentStore = useDepartmentStore();

        if (this.isEditMode) {
          await departmentStore.updateDepartment(this.currentId, this.formData);
          this.alertMessage = 'Department updated successfully!';
          this.$emit('department-updated');
        } else {
          await departmentStore.createDepartment(this.formData);
          this.alertMessage = 'Department created successfully!';
          this.$emit('department-added');
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
          this.alertMessage = error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} department`;
        }
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    async deleteDepartment() {
      this.isSubmitting = true;
      this.deleteError = false;
      this.deleteBlockers = [];

      try {
        const departmentStore = useDepartmentStore();
        await departmentStore.deleteDepartment(this.deleteId);

        if (this.deleteModalInstance) {
          this.deleteModalInstance.hide();
        }

        this.$emit('department-updated');
        this.$message.success('Department moved to Recycle Bin');
      } catch (error) {
        const responseData = error.response?.data || error;

        // Show blocker messages inline in the modal
        if (responseData.blockers && responseData.blockers.length > 0) {
          this.deleteError = true;
          this.deleteBlockers = responseData.blockers;
        } else {
          this.$message.error(responseData.message || 'Failed to delete department');
        }
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  mounted() {
    const modalEl = document.getElementById('add_department_modal');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    }
  },
};
</script>

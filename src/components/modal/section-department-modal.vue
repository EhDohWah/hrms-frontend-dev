<template>
  <!-- Add/Edit Section Department Modal -->
  <div class="modal fade" id="add_section_department_modal" tabindex="-1" aria-labelledby="sectionDepartmentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="sectionDepartmentModalLabel">
            {{ isEditMode ? 'Edit Section Department' : 'Add New Section Department' }}
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
                  :class="{ 'is-invalid': validationErrors.name }" placeholder="Enter section name" required>
                <div v-if="validationErrors.name" class="invalid-feedback">
                  {{ validationErrors.name }}
                </div>
              </div>

              <!-- Department -->
              <div class="col-md-12">
                <label class="form-label">Parent Department <span class="text-danger">*</span></label>
                <select class="form-select" v-model="formData.department_id"
                  :class="{ 'is-invalid': validationErrors.department_id }" required>
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <div v-if="validationErrors.department_id" class="invalid-feedback">
                  {{ validationErrors.department_id }}
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
  <div class="modal fade" id="delete_section_department_modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Delete Section Department</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this section department? This action cannot be undone.</p>
          <p class="text-warning"><i class="ti ti-alert-triangle me-1"></i>Note: Section departments with active employments cannot be deleted.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="deleteSectionDepartment" :disabled="isSubmitting">
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
import { useSectionDepartmentStore } from '@/stores/sectionDepartmentStore';
import { useDepartmentStore } from '@/stores/departmentStore';

export default {
  name: 'SectionDepartmentModal',
  emits: ['section-department-added', 'section-department-updated'],
  data() {
    return {
      isEditMode: false,
      currentId: null,
      formData: {
        name: '',
        department_id: '',
        description: '',
        is_active: true,
      },
      departments: [],
      validationErrors: {},
      alertMessage: '',
      alertClass: '',
      isSubmitting: false,
      addModalInstance: null,
      deleteModalInstance: null,
      deleteId: null,
    };
  },
  methods: {
    async loadDropdowns() {
      try {
        const departmentStore = useDepartmentStore();
        await departmentStore.fetchDepartmentOptions();
        this.departments = departmentStore.departmentOptions;
      } catch (error) {
        console.error('Error loading departments:', error);
      }
    },

    setEditSectionDepartment(record) {
      this.isEditMode = true;
      this.currentId = record.id;
      this.formData = {
        name: record.name || '',
        department_id: record.department_id || '',
        description: record.description || '',
        is_active: record.is_active !== undefined ? record.is_active : true,
      };
      this.validationErrors = {};
      this.alertMessage = '';
      this.loadDropdowns();
      this.openModal();
    },

    openModal() {
      if (!this.addModalInstance) {
        this.addModalInstance = new Modal(document.getElementById('add_section_department_modal'));
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
        department_id: '',
        description: '',
        is_active: true,
      };
      this.validationErrors = {};
      this.alertMessage = '';
    },

    confirmDeleteSectionDepartment(sectionDepartmentId) {
      this.deleteId = sectionDepartmentId;
      if (!this.deleteModalInstance) {
        this.deleteModalInstance = new Modal(document.getElementById('delete_section_department_modal'));
      }
      this.deleteModalInstance.show();
    },

    async handleSubmit() {
      this.validationErrors = {};
      this.alertMessage = '';
      this.isSubmitting = true;

      try {
        const sectionDepartmentStore = useSectionDepartmentStore();

        if (this.isEditMode) {
          await sectionDepartmentStore.updateSectionDepartment(this.currentId, this.formData);
          this.alertMessage = 'Section department updated successfully!';
          this.$emit('section-department-updated');
        } else {
          await sectionDepartmentStore.createSectionDepartment(this.formData);
          this.alertMessage = 'Section department created successfully!';
          this.$emit('section-department-added');
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
          this.alertMessage = error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} section department`;
        }
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    async deleteSectionDepartment() {
      this.isSubmitting = true;

      try {
        const sectionDepartmentStore = useSectionDepartmentStore();
        await sectionDepartmentStore.deleteSectionDepartment(this.deleteId);

        if (this.deleteModalInstance) {
          this.deleteModalInstance.hide();
        }

        this.$emit('section-department-updated');
        this.$message.success('Section department deleted successfully');
      } catch (error) {
        this.$message.error(error.message || 'Failed to delete section department');
      } finally {
        this.isSubmitting = false;
        this.deleteId = null;
      }
    },
  },
  mounted() {
    const modalEl = document.getElementById('add_section_department_modal');
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

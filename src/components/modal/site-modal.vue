<template>
  <!-- Add/Edit Site Modal -->
  <div class="modal fade" id="add_site_modal" tabindex="-1" aria-labelledby="siteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="siteModalLabel">
            {{ isEditMode ? 'Edit Site' : 'Add New Site' }}
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
              <div class="col-md-6">
                <label class="form-label">Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="formData.name"
                  :class="{ 'is-invalid': validationErrors.name }" placeholder="Enter site name" required>
                <div v-if="validationErrors.name" class="invalid-feedback">
                  {{ validationErrors.name }}
                </div>
              </div>

              <!-- Code -->
              <div class="col-md-6">
                <label class="form-label">Code <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="formData.code"
                  :class="{ 'is-invalid': validationErrors.code }" placeholder="Enter site code" required>
                <div v-if="validationErrors.code" class="invalid-feedback">
                  {{ validationErrors.code }}
                </div>
              </div>

              <!-- Description -->
              <div class="col-md-12">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="formData.description" rows="2"
                  placeholder="Enter description"></textarea>
              </div>

              <!-- Address -->
              <div class="col-md-12">
                <label class="form-label">Address</label>
                <textarea class="form-control" v-model="formData.address" rows="2"
                  placeholder="Enter address"></textarea>
              </div>

              <!-- Contact Person -->
              <div class="col-md-6">
                <label class="form-label">Contact Person</label>
                <input type="text" class="form-control" v-model="formData.contact_person"
                  placeholder="Enter contact person name">
              </div>

              <!-- Contact Phone -->
              <div class="col-md-6">
                <label class="form-label">Contact Phone</label>
                <input type="text" class="form-control" v-model="formData.contact_phone"
                  placeholder="Enter contact phone">
              </div>

              <!-- Contact Email -->
              <div class="col-md-6">
                <label class="form-label">Contact Email</label>
                <input type="email" class="form-control" v-model="formData.contact_email"
                  :class="{ 'is-invalid': validationErrors.contact_email }"
                  placeholder="Enter contact email">
                <div v-if="validationErrors.contact_email" class="invalid-feedback">
                  {{ validationErrors.contact_email }}
                </div>
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
  <div class="modal fade" id="delete_site_modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Delete Site</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this site? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="deleteSite" :disabled="isSubmitting">
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
import { useSiteStore } from '@/stores/siteStore';

export default {
  name: 'SiteModal',
  emits: ['site-added', 'site-updated'],
  data() {
    return {
      isEditMode: false,
      currentId: null,
      formData: {
        name: '',
        code: '',
        description: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        is_active: true,
      },
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
    setEditSite(record) {
      this.isEditMode = true;
      this.currentId = record.id;
      this.formData = {
        name: record.name || '',
        code: record.code || '',
        description: record.description || '',
        address: record.address || '',
        contact_person: record.contact_person || '',
        contact_phone: record.contact_phone || '',
        contact_email: record.contact_email || '',
        is_active: record.is_active !== undefined ? record.is_active : true,
      };
      this.validationErrors = {};
      this.alertMessage = '';
      this.openModal();
    },

    openModal() {
      if (!this.addModalInstance) {
        this.addModalInstance = new Modal(document.getElementById('add_site_modal'));
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
        code: '',
        description: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        is_active: true,
      };
      this.validationErrors = {};
      this.alertMessage = '';
    },

    confirmDeleteSite(siteId) {
      this.deleteId = siteId;
      if (!this.deleteModalInstance) {
        this.deleteModalInstance = new Modal(document.getElementById('delete_site_modal'));
      }
      this.deleteModalInstance.show();
    },

    async handleSubmit() {
      this.validationErrors = {};
      this.alertMessage = '';
      this.isSubmitting = true;

      try {
        const siteStore = useSiteStore();

        if (this.isEditMode) {
          await siteStore.updateSite(this.currentId, this.formData);
          this.alertMessage = 'Site updated successfully!';
          this.$emit('site-updated');
        } else {
          await siteStore.createSite(this.formData);
          this.alertMessage = 'Site created successfully!';
          this.$emit('site-added');
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
          this.alertMessage = error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} site`;
        }
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    async deleteSite() {
      this.isSubmitting = true;

      try {
        const siteStore = useSiteStore();
        await siteStore.deleteSite(this.deleteId);

        if (this.deleteModalInstance) {
          this.deleteModalInstance.hide();
        }

        this.$emit('site-updated');
        this.$message.success('Site deleted successfully');
      } catch (error) {
        this.$message.error(error.message || 'Failed to delete site');
      } finally {
        this.isSubmitting = false;
        this.deleteId = null;
      }
    },
  },
  mounted() {
    const modalEl = document.getElementById('add_site_modal');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.resetForm();
      });
    }
  },
};
</script>

<template>
  <!-- Add Lookup Modal -->
  <div class="modal fade" id="add_lookup">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Lookup</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <!-- Alert Message -->
        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
          {{ alertMessage }}
        </div>
        <form @submit.prevent="submitNewLookup">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Type</label>
                  <div class="input-group">
                    <select class="form-select" v-model="newLookup.type" @change="onTypeChange"
                      :required="!showCustomType">
                      <option value="" disabled>Select a type</option>
                      <option v-for="type in dynamicLookupTypes" :key="type" :value="type">{{ type }}</option>
                      <option value="__custom__">Add New Type...</option>
                    </select>
                  </div>
                  <div v-if="showCustomType" class="mt-2">
                    <input type="text" class="form-control" v-model="customType" placeholder="Enter new type name"
                      required @blur="validateCustomType" />
                    <small class="text-muted">Enter a new lookup type (e.g., 'department', 'position')</small>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Value</label>
                  <input type="text" class="form-control" v-model="newLookup.value" required />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Adding...' : 'Add Lookup' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Lookup Modal -->

  <!-- Edit Lookup Modal -->
  <div class="modal fade" id="edit_lookup">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Lookup</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <!-- Alert Message -->
        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
          {{ alertMessage }}
        </div>
        <form @submit.prevent="updateLookup">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Type</label>
                  <div class="input-group">
                    <select class="form-select" v-model="editLookup.type" @change="onEditTypeChange"
                      :required="!showEditCustomType">
                      <option value="" disabled>Select a type</option>
                      <option v-for="type in dynamicLookupTypes" :key="type" :value="type">{{ type }}</option>
                      <option value="__custom__">Add New Type...</option>
                    </select>
                  </div>
                  <div v-if="showEditCustomType" class="mt-2">
                    <input type="text" class="form-control" v-model="editCustomType" placeholder="Enter new type name"
                      required @blur="validateEditCustomType" />
                    <small class="text-muted">Enter a new lookup type (e.g., 'department', 'position')</small>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Value</label>
                  <input type="text" class="form-control" v-model="editLookup.value" required />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Updating...' : 'Update Lookup' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Lookup Modal -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_lookup_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
            <i class="ti ti-trash-x fs-36"></i>
          </span>
          <h4 class="mb-1">Confirm Delete</h4>
          <p class="mb-3">
            Are you sure you want to delete this lookup? This action cannot be undone.
          </p>
          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-light me-3" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteLookup" :disabled="loading">
              {{ loading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

<script>
import { useLookupStore } from "@/stores/lookupStore";

export default {
  emits: ['lookup-added', 'lookup-updated', 'lookup-deleted'],
  data() {
    return {
      loading: false,
      alertMessage: '',
      alertClass: '',
      lookupToDelete: null,
      lookupStore: null,
      dynamicLookupTypes: [],
      showCustomType: false,
      customType: '',
      showEditCustomType: false,
      editCustomType: '',
      newLookup: {
        type: '',
        value: ''
      },
      editLookup: {
        id: null,
        type: '',
        value: ''
      }
    };
  },
  async created() {
    this.lookupStore = useLookupStore();
    await this.fetchLookupTypes();
  },
  methods: {
    async fetchLookupTypes() {
      try {
        await this.lookupStore.fetchLookupTypes();
        this.dynamicLookupTypes = this.lookupStore.getAllLookupTypes;
      } catch (error) {
        console.error('Error fetching lookup types:', error);
        // Fallback to extracting types from existing lookups
        this.dynamicLookupTypes = this.lookupStore.getAllLookupTypes;
      }
    },

    onTypeChange() {
      if (this.newLookup.type === '__custom__') {
        this.showCustomType = true;
        this.newLookup.type = '';
      } else {
        this.showCustomType = false;
        this.customType = '';
      }
    },

    onEditTypeChange() {
      if (this.editLookup.type === '__custom__') {
        this.showEditCustomType = true;
        this.editLookup.type = '';
      } else {
        this.showEditCustomType = false;
        this.editCustomType = '';
      }
    },

    validateCustomType() {
      if (this.customType && this.customType.trim()) {
        this.newLookup.type = this.customType.trim().toLowerCase().replace(/\s+/g, '_');
      }
    },

    validateEditCustomType() {
      if (this.editCustomType && this.editCustomType.trim()) {
        this.editLookup.type = this.editCustomType.trim().toLowerCase().replace(/\s+/g, '_');
      }
    },

    async submitNewLookup() {
      try {
        this.loading = true;

        // Validate custom type if applicable
        if (this.showCustomType) {
          this.validateCustomType();
          if (!this.newLookup.type) {
            throw new Error('Please enter a valid type name');
          }
        }

        const lookupData = {
          type: this.newLookup.type,
          value: this.newLookup.value
        };

        const response = await this.lookupStore.createLookup(lookupData);

        if (response) {
          // Refresh lookup types to include the new type
          await this.fetchLookupTypes();

          // Reset form
          this.resetNewLookupForm();

          // Close modal
          document.getElementById('add_lookup').querySelector('[data-bs-dismiss="modal"]').click();

          // Emit event to parent component to refresh lookup list
          this.$emit('lookup-added');

          // Show success message
          this.showAlert('Lookup created successfully', 'success');
        }
      } catch (error) {
        console.error('Error creating lookup:', error);
        this.showAlert(error.message || 'Failed to create lookup', 'danger');
      } finally {
        this.loading = false;
      }
    },

    async updateLookup() {
      try {
        this.loading = true;

        if (!this.editLookup.id) {
          throw new Error('Lookup ID is required for update');
        }

        // Validate custom type if applicable
        if (this.showEditCustomType) {
          this.validateEditCustomType();
          if (!this.editLookup.type) {
            throw new Error('Please enter a valid type name');
          }
        }

        const lookupData = {
          type: this.editLookup.type,
          value: this.editLookup.value
        };

        const response = await this.lookupStore.updateLookup(
          this.editLookup.id,
          lookupData
        );

        if (response) {
          // Refresh lookup types to include any new type
          await this.fetchLookupTypes();

          // Close modal
          document.getElementById('edit_lookup').querySelector('[data-bs-dismiss="modal"]').click();

          // Emit event to parent component to refresh lookup list
          this.$emit('lookup-updated');

          // Show success message
          this.showAlert('Lookup updated successfully', 'success');
        }
      } catch (error) {
        console.error('Error updating lookup:', error);
        this.showAlert(error.message || 'Failed to update lookup', 'danger');
      } finally {
        this.loading = false;
      }
    },

    async deleteLookup() {
      try {
        this.loading = true;

        if (!this.lookupToDelete) {
          throw new Error('No lookup selected for deletion');
        }

        const success = await this.lookupStore.deleteLookup(this.lookupToDelete);

        if (success) {
          // Close modal
          document.getElementById('delete_lookup_modal').querySelector('[data-bs-dismiss="modal"]').click();

          // Emit event to parent component to refresh lookup list
          this.$emit('lookup-deleted');

          // Show success message
          this.showAlert('Lookup deleted successfully', 'success');

          // Reset lookupToDelete
          this.lookupToDelete = null;
        }
      } catch (error) {
        console.error('Error deleting lookup:', error);
        this.showAlert(error.message || 'Failed to delete lookup', 'danger');
      } finally {
        this.loading = false;
      }
    },

    confirmDeleteLookup(lookupId) {
      this.lookupToDelete = lookupId;
      // Open delete modal
      const deleteModal = document.getElementById('delete_lookup_modal');
      // Import Bootstrap Modal dynamically to avoid 'bootstrap is not defined' error
      if (deleteModal) {
        import('bootstrap').then(bootstrap => {
          const bsModal = new bootstrap.Modal(deleteModal);
          bsModal.show();
        });
      }
    },

    setEditLookup(lookup) {
      this.editLookup = {
        id: lookup.id,
        type: lookup.type,
        value: lookup.value
      };

      // Reset custom type fields
      this.showEditCustomType = false;
      this.editCustomType = '';

      // Open edit modal
      const editModal = document.getElementById('edit_lookup');
      if (editModal) {
        import('bootstrap').then(bootstrap => {
          const bsModal = new bootstrap.Modal(editModal);
          bsModal.show();
        });
      }
    },

    resetNewLookupForm() {
      this.newLookup = {
        type: '',
        value: ''
      };
      this.showCustomType = false;
      this.customType = '';
    },

    showAlert(message, type = 'danger') {
      this.alertMessage = message;
      this.alertClass = `alert-${type}`;

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        this.alertMessage = '';
      }, 5000);

      // Auto-dismiss success alerts after 3 seconds
      if (type === 'success') {
        setTimeout(() => {
          this.alertMessage = '';
        }, 3000);
      }
    }
  }
};
</script>

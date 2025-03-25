<template>
  <!-- Add Lookup Modal -->
  <div class="modal fade" id="add_lookup">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Lookup</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
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
                  <select class="form-select" v-model="newLookup.type" required>
                    <option value="" disabled>Select a type</option>
                    <option v-for="type in lookupTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
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
            <button
              type="button"
              class="btn btn-white border me-2"
              data-bs-dismiss="modal"
            >
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
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
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
                  <select class="form-select" v-model="editLookup.type" required>
                    <option value="" disabled>Select a type</option>
                    <option v-for="type in lookupTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
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
            <button
              type="button"
              class="btn btn-white border me-2"
              data-bs-dismiss="modal"
            >
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
            <button
              type="button"
              class="btn btn-light me-3"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteLookup"
              :disabled="loading"
            >
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
      lookupTypes: [
        'gender', 'subsidiary', 'employee_status', 'nationality',
        'religion', 'marital_status', 'site', 'user_status',
        'interview_mode', 'interview_status', 'identification_types',
        'employment_type'
      ],
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
  created() {
    this.lookupStore = useLookupStore();
  },
  methods: {
    async submitNewLookup() {
      try {
        this.loading = true;
        
        const lookupData = {
          type: this.newLookup.type,
          value: this.newLookup.value
        };
        
        const response = await this.lookupStore.createLookup(lookupData);
        
        if (response) {
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
        
        const lookupData = {
          type: this.editLookup.type,
          value: this.editLookup.value
        };
        
        const response = await this.lookupStore.updateLookup(
          this.editLookup.id, 
          lookupData
        );
        
        if (response) {
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

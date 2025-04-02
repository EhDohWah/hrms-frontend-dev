<template>
  <!-- Add Work Location Modal -->
  <div class="modal fade" id="add_work_location">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Work Location</h4>
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
        <form @submit.prevent="submitNewLocation">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Location Name</label>
                  <input type="text" class="form-control" v-model="newLocation.name" required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Location Type</label>
                  <input type="text" class="form-control" v-model="newLocation.type" required />
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
              {{ loading ? 'Adding...' : 'Add Location' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Work Location Modal -->

  <!-- Edit Work Location Modal -->
  <div class="modal fade" id="edit_work_location">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Work Location</h4>
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
        <form @submit.prevent="updateLocation">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Location Name</label>
                  <input type="text" class="form-control" v-model="editLocation.name" required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Location Type</label>
                  <input type="text" class="form-control" v-model="editLocation.type" required />
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
              {{ loading ? 'Updating...' : 'Update Location' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Work Location Modal -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_location_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
            <i class="ti ti-trash-x fs-36"></i>
          </span>
          <h4 class="mb-1">Confirm Delete</h4>
          <p class="mb-3">
            Are you sure you want to delete this work location? This action cannot be undone.
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
              @click="deleteLocation"
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
import workLocationService from "@/services/worklocation.service";

export default {
  emits: ['location-added', 'location-updated', 'location-deleted'],
  data() {
    return {
      loading: false,
      alertMessage: '',
      alertClass: '',
      locationToDelete: null,
      newLocation: {
        name: '',
        type: ''
      },
      editLocation: {
        id: null,
        name: '',
        type: ''
      }
    };
  },
  
  methods: {
    async submitNewLocation() {
      try {
        this.loading = true;
        
        const locationData = {
          name: this.newLocation.name,
          type: this.newLocation.type
        };
        
        const response = await workLocationService.createWorkLocation(locationData);
        
        if (response && response.status === 'success') {
          // Reset form
          this.resetNewLocationForm();
          
          // Close modal
          document.getElementById('add_work_location').querySelector('[data-bs-dismiss="modal"]').click();
          
          // Emit event to parent component to refresh location list
          this.$emit('location-added');
          
          // Show success message
          this.showAlert('Work location created successfully', 'success');
        } else {
          throw new Error(response?.message || 'Failed to create work location');
        }
      } catch (error) {
        console.error('Error creating work location:', error);
        this.showAlert(error.message || 'Failed to create work location', 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    async updateLocation() {
      try {
        this.loading = true;
        
        if (!this.editLocation.id) {
          throw new Error('Location ID is required for update');
        }
        
        const locationData = {
          name: this.editLocation.name,
          type: this.editLocation.type
        };
        
        const response = await workLocationService.updateWorkLocation(
          this.editLocation.id, 
          locationData
        );
        
        if (response && response.status === 'success') {
          // Close modal
          document.getElementById('edit_work_location').querySelector('[data-bs-dismiss="modal"]').click();
          
          // Emit event to parent component to refresh location list
          this.$emit('location-updated');
          
          // Show success message
          this.showAlert('Work location updated successfully', 'success');
        } else {
          throw new Error(response?.message || 'Failed to update work location');
        }
      } catch (error) {
        console.error('Error updating work location:', error);
        this.showAlert(error.message || 'Failed to update work location', 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    async deleteLocation() {
      try {
        this.loading = true;
        
        if (!this.locationToDelete) {
          throw new Error('No location selected for deletion');
        }
        
        const response = await workLocationService.deleteWorkLocation(this.locationToDelete);
        
        if (response && response.status === 'success') {
          // Close modal
          document.getElementById('delete_location_modal').querySelector('[data-bs-dismiss="modal"]').click();
          
          // Emit event to parent component to refresh location list
          this.$emit('location-deleted');
          
          // Show success message
          this.showAlert('Work location deleted successfully', 'success');
          
          // Reset locationToDelete
          this.locationToDelete = null;
        } else {
          throw new Error(response?.message || 'Failed to delete work location');
        }
      } catch (error) {
        console.error('Error deleting work location:', error);
        this.showAlert(error.message || 'Failed to delete work location', 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    confirmDeleteLocation(locationId) {
      this.locationToDelete = locationId;
      // Open delete modal
      const deleteModal = document.getElementById('delete_location_modal');
      // Import Bootstrap Modal dynamically to avoid 'bootstrap is not defined' error
      if (deleteModal) {
        import('bootstrap').then(bootstrap => {
          const bsModal = new bootstrap.Modal(deleteModal);
          bsModal.show();
        });
      }
    },
    
    setEditLocation(location) {
      this.editLocation = {
        id: location.id,
        name: location.name,
        type: location.type
      };
      
      // Open edit modal
      const editModal = document.getElementById('edit_work_location');
      if (editModal) {
        import('bootstrap').then(bootstrap => {
          const bsModal = new bootstrap.Modal(editModal);
          bsModal.show();
        });
      }
    },
    
    openAddModal() {
      // Reset form first
      this.resetNewLocationForm();
      
      // Open add modal
      const addModal = document.getElementById('add_work_location');
      if (addModal) {
        import('bootstrap').then(bootstrap => {
          const bsModal = new bootstrap.Modal(addModal);
          bsModal.show();
        });
      }
    },
    
    resetNewLocationForm() {
      this.newLocation = {
        name: '',
        type: ''
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

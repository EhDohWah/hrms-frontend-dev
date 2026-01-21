<template>
  <!-- Add Department Position Modal -->
  <div class="modal fade" id="add_department_position">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Department Position</h4>
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
        <form @submit.prevent="submitNewPosition">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Department</label>
                  <input type="text" class="form-control" v-model="newPosition.department" required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Position</label>
                  <input type="text" class="form-control" v-model="newPosition.position" required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Reports To (ID)</label>
                  <input type="number" class="form-control" v-model="newPosition.report_to" placeholder="Enter ID (optional)" />
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
              {{ loading ? 'Adding...' : 'Add Position' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Department Position Modal -->

  <!-- Edit Department Position Modal -->
  <div class="modal fade" id="edit_department_position">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Department Position</h4>
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
        <form @submit.prevent="updatePosition">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Department</label>
                  <input type="text" class="form-control" v-model="editPosition.department" required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Position</label>
                  <input type="text" class="form-control" v-model="editPosition.position" required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Reports To (ID)</label>
                  <input type="number" class="form-control" v-model="editPosition.report_to" placeholder="Enter ID (optional)" />
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
              {{ loading ? 'Updating...' : 'Update Position' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Department Position Modal -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_position_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
            <i class="ti ti-trash-x fs-36"></i>
          </span>
          <h4 class="mb-1">Confirm Delete</h4>
          <p class="mb-3">
            Are you sure you want to delete this department position? This action cannot be undone.
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
              @click="deletePosition"
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
import { useDepartmentPositionStore } from "@/stores/departmentPositionStore";

export default {
  emits: ['position-added', 'position-updated', 'position-deleted'],
  data() {
    return {
      loading: false,
      alertMessage: '',
      alertClass: '',
      positionToDelete: null,
      departmentPositionStore: null,
      newPosition: {
        department: '',
        position: '',
        report_to: null
      },
      editPosition: {
        id: null,
        department: '',
        position: '',
        report_to: null
      },
      departmentPositions: [],
      departments: {
        // This will store departments and their positions
        // Similar to the modules object in user-list-modal.vue
      }
    };
  },
  created() {
    this.departmentPositionStore = useDepartmentPositionStore();
    this.fetchDepartmentPositions();
  },
  
  methods: {
    async fetchDepartmentPositions() {
      try {
        await this.departmentPositionStore.fetchDepartmentPositions();
        this.departmentPositions = this.departmentPositionStore.getDepartmentPositions;
        
        // Organize positions by department (similar to modules in user-list-modal)
        this.departments = {};
        this.departmentPositions.forEach(position => {
          if (!this.departments[position.department]) {
            this.departments[position.department] = [];
          }
          this.departments[position.department].push(position);
        });
      } catch (error) {
        console.error('Error fetching department positions:', error);
        this.showAlert('Failed to load department positions', 'danger');
      }
    },
    
    async submitNewPosition() {
      try {
        this.loading = true;
        
        const positionData = {
          department: this.newPosition.department,
          position: this.newPosition.position,
          report_to: this.newPosition.report_to
        };
        
        const response = await this.departmentPositionStore.createDepartmentPosition(positionData);
        
        if (response) {
          // Reset form
          this.resetNewPositionForm();
          
          // Close modal
          document.getElementById('add_department_position').querySelector('[data-bs-dismiss="modal"]').click();
          
          // Emit event to parent component to refresh position list
          this.$emit('position-added');
          
          // Show success message
          this.showAlert('Department position created successfully', 'success');
        }
      } catch (error) {
        console.error('Error creating department position:', error);
        this.showAlert(error.message || 'Failed to create department position', 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    async updatePosition() {
      try {
        this.loading = true;
        
        if (!this.editPosition.id) {
          throw new Error('Position ID is required for update');
        }
        
        const positionData = {
          department: this.editPosition.department,
          position: this.editPosition.position,
          report_to: this.editPosition.report_to
        };
        
        const response = await this.departmentPositionStore.updateDepartmentPosition(
          this.editPosition.id, 
          positionData
        );
        
        if (response) {
          // Close modal
          document.getElementById('edit_department_position').querySelector('[data-bs-dismiss="modal"]').click();
          
          // Emit event to parent component to refresh position list
          this.$emit('position-updated');
          
          // Show success message
          this.showAlert('Department position updated successfully', 'success');
        }
      } catch (error) {
        console.error('Error updating department position:', error);
        this.showAlert(error.message || 'Failed to update department position', 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    async deletePosition() {
      try {
        this.loading = true;
        
        if (!this.positionToDelete) {
          throw new Error('No position selected for deletion');
        }
        
        const success = await this.departmentPositionStore.deleteDepartmentPosition(this.positionToDelete);
        
        if (success) {
          // Close modal
          document.getElementById('delete_position_modal').querySelector('[data-bs-dismiss="modal"]').click();
          
          // Emit event to parent component to refresh position list
          this.$emit('position-deleted');
          
          // Show success message
          this.showAlert('Department position deleted successfully', 'success');
          
          // Reset positionToDelete
          this.positionToDelete = null;
        }
      } catch (error) {
        console.error('Error deleting department position:', error);
        this.showAlert(error.message || 'Failed to delete department position', 'danger');
      } finally {
        this.loading = false;
      }
    },
    
    confirmDeletePosition(positionId) {
      this.positionToDelete = positionId;
      // Open delete modal
      const deleteModal = document.getElementById('delete_position_modal');
      // Import Bootstrap Modal dynamically to avoid 'bootstrap is not defined' error
      if (deleteModal) {
        import('bootstrap').then(bootstrap => {
          const bsModal = new bootstrap.Modal(deleteModal);
          bsModal.show();
        });
      }
    },
    
    setEditPosition(position) {
      this.editPosition = {
        id: position.id,
        department: position.department,
        position: position.position,
        report_to: position.report_to
      };
      
      // Open edit modal
      const editModal = document.getElementById('edit_department_position');
      if (editModal) {
        import('bootstrap').then(bootstrap => {
          const bsModal = new bootstrap.Modal(editModal);
          bsModal.show();
        });
      }
    },
    
    resetNewPositionForm() {
      this.newPosition = {
        department: '',
        position: '',
        report_to: null
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

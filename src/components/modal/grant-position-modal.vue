<template>
  <div
    class="modal fade"
    id="grantPositionModal"
    tabindex="-1"
    aria-labelledby="grantPositionModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="grantPositionModalLabel">{{ isEditing ? 'Edit' : 'Add' }} Grant Position</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="grantName" class="form-label">Grant Name</label>
              <input type="text" class="form-control" id="grantName" v-model="formData.grantName" required />
            </div>
            <div class="mb-3">
              <label for="code" class="form-label">Code</label>
              <input type="text" class="form-control" id="code" v-model="formData.code" required />
            </div>
            <div class="mb-3">
              <label for="budgetLine" class="form-label">Budget Line</label>
              <input type="text" class="form-control" id="budgetLine" v-model="formData.budgetLine" required />
            </div>
            <div class="mb-3">
              <label for="positionName" class="form-label">Position Name</label>
              <input type="text" class="form-control" id="positionName" v-model="formData.positionName" required />
            </div>
            <div class="mb-3">
              <label for="manPower" class="form-label">ManPower</label>
              <input type="number" class="form-control" id="manPower" v-model="formData.manPower" required />
            </div>
            <div class="mb-3">
              <label for="recruited" class="form-label">Recruited</label>
              <input type="number" class="form-control" id="recruited" v-model="formData.recruited" required />
            </div>
            <div class="mb-3">
              <label for="finding" class="form-label">Finding</label>
              <input type="text" class="form-control" id="finding" v-model="formData.finding" required />
            </div>
            <div class="mb-3">
              <label for="status" class="form-label">Status</label>
              <select class="form-select" id="status" v-model="formData.status" required>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              {{ isEditing ? 'Update' : 'Save' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'GrantPositionModal',
  data() {
    return {
      formData: {
        id: null,
        grantName: '',
        code: '',
        budgetLine: '',
        positionName: '',
        manPower: 0,
        recruited: 0,
        finding: '',
        status: 'Active'
      },
      isEditing: false,
      isSubmitting: false,
      modalInstance: null
    };
  },
  mounted() {
    // Initialize the modal when component is mounted
    const modalElement = document.getElementById('grantPositionModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }
  },
  methods: {
    openModal(position = null) {
      if (position) {
        this.isEditing = true;
        // This creates a copy of the position object and assigns it to formData
        // It uses the spread operator (...) to create a new object with all properties from position
        // This ensures we're working with a copy rather than the original object reference
        this.formData = { ...position };
        // Set default status if not present in existing data
        if (!this.formData.status) {
          this.formData.status = 'Active';
        }
      } else {
        this.isEditing = false;
        this.resetForm();
      }
      
      // Show the modal using the instance created in mounted hook
      if (this.modalInstance) {
        this.modalInstance.show();
      } else {
        // If modalInstance is not available, try to create it again
        const modalElement = document.getElementById('grantPositionModal');
        if (modalElement) {
          this.modalInstance = new Modal(modalElement);
          this.modalInstance.show();
        } else {
          console.error('Modal element not found');
        }
      }
    },
    handleSubmit() {
      this.isSubmitting = true;
      try {
        // Emit the form data to parent component
        this.$emit('submit', { ...this.formData });
        
        // Close the modal
        if (this.modalInstance) {
          this.modalInstance.hide();
        } else {
          const modalElement = document.getElementById('grantPositionModal');
          if (modalElement) {
            const modalInstance = Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        }
        
        this.resetForm();
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while saving the grant position.');
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        id: null,
        grantName: '',
        code: '',
        budgetLine: '',
        positionName: '',
        manPower: 0,
        recruited: 0,
        finding: '',
        status: 'Active'
      };
    }
  }
};
</script>

<style scoped>
.modal-content {
  padding: 20px;
}
</style>

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
          <h5 class="modal-title" id="grantPositionModalLabel">
            {{ isEditMode ? 'Edit Grant Position' : 'Add Grant Position' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            
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
      modalInstance: null,
      isEditMode: false,
      formData: {
        id: null,
        grantName: '',
        code: '',
        budgetLine: '',
        positionName: '',
        manPower: 0,
        recruited: 0,
        finding: '',
        status: 'Active',
        grant_id: null
      }
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
      // Show the modal using the instance created in mounted hook
      if (this.modalInstance) {
        if (position) {
          // Edit mode
          this.isEditMode = true;
          this.formData = { ...position };
        } else {
          // Add mode
          this.isEditMode = false;
          this.resetForm();
        }
        this.modalInstance.show();
      } else {
        // If modalInstance is not available, try to create it again
        const modalElement = document.getElementById('grantPositionModal');
        if (modalElement) {
          this.modalInstance = new Modal(modalElement);
          if (position) {
            // Edit mode
            this.isEditMode = true;
            this.formData = { ...position };
          } else {
            // Add mode
            this.isEditMode = false;
            this.resetForm();
          }
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
        status: 'Active',
        grant_id: null
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

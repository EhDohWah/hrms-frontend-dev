<template>
    <div class="modal custom-modal fade" id="grant_modal_update" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Grant</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6">
                  <div class="input-block mb-3">
                    <label class="form-label" for="grant-subsidiary">Subsidiary</label>
                    <input type="text" id="grant-subsidiary" v-model="formData.subsidiary" class="form-control" placeholder="e.g., SMRU" required>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="input-block mb-3">
                    <label class="form-label">Grant Name</label>
                    <input type="text" v-model="formData.name" class="form-control" placeholder="e.g., UNICEF-EP" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-block mb-3">
                    <label class="form-label">Grant Code</label>
                    <input type="text" v-model="formData.code" class="form-control" placeholder="e.g., B-24004" required>
                  </div>
                </div>
              </div>
  
              <div class="row">
                <div class="col-md-12">
                  <div class="input-block mb-3">
                    <label class="form-label">Description</label>
                    <textarea v-model="formData.description" class="form-control" rows="3"></textarea>
                  </div>
                </div>
              </div>
  
              <div class="row">
                <div class="col-md-6">
                  <div class="input-block mb-3">
                    <label class="form-label">End Date</label>
                    <input type="date" v-model="formData.end_date" class="form-control">
                  </div>
                </div>
              </div>
  
              <div class="submit-section">
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  Update Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Modal } from 'bootstrap';

  export default {
    name: 'GrantModalUpdate',
    data() {
      return {
        isSubmitting: false,
        formData: {
          id: '',
          name: '',
          code: '',
          description: '',
          end_date: '',
          subsidiary: ''
        }
      };
    },
    mounted() {
      // Fix accessibility issue with aria-hidden
      const modalElement = document.getElementById('grant_modal_update');
      if (modalElement) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
              if (modalElement.getAttribute('aria-hidden') === 'true' && 
                  modalElement.contains(document.activeElement)) {
                // Remove aria-hidden when the modal contains focus
                modalElement.removeAttribute('aria-hidden');
              }
            }
          });
        });
        
        observer.observe(modalElement, { attributes: true });
      }
    },
    methods: {
      handleSubmit() {
        // Prevent duplicate submissions
        if (this.isSubmitting) return;
        this.isSubmitting = true;

        try {
          // Validate that ID exists before submitting
          if (!this.formData.id) {
            throw new Error('Grant ID is missing');
          }
          
          // Validate other required fields
          if (!this.formData.name || !this.formData.code) {
            throw new Error('Name and code are required fields');
          }
          
          // Create a clean copy of the form data to emit
          const formDataToSubmit = { ...this.formData };
          
          // Emit the form data to parent component
          this.$emit('update-grant', formDataToSubmit);
          
          // Close modal using Bootstrap's API
          const modalElement = document.getElementById('grant_modal_update');
          if (modalElement) {
            const bsModal = Modal.getInstance(modalElement);
            if (bsModal) {
              bsModal.hide();
            } else {
              // Fallback to click method if instance not found
              const closeButton = modalElement.querySelector('[data-bs-dismiss="modal"]');
              if (closeButton) closeButton.click();
            }
          }
          
          // Reset form after successful submission
          this.resetForm();
        } catch (error) {
          console.error('Error submitting form:', error);
          // Use message component if available, otherwise fallback to alert
          this.$message?.error?.(error.message) || alert(error.message);
        } finally {
          // Reset the submitting flag immediately
          this.isSubmitting = false;
        }
      },
      resetForm() {
        this.formData = {
          id: '',
          name: '',
          code: '',
          description: '',
          end_date: '',
          subsidiary: ''
        };
      },
      setEditData(data) {
        // Ensure ID is properly set
        if (!data.id) {
          console.error('Cannot edit grant: ID is missing');
          this.$message?.error?.('Cannot edit grant: ID is missing') || alert('Cannot edit grant: ID is missing');
          return;
        }
        this.formData = { ...data };
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-dialog {
    max-width: 800px;
  }
  .input-block {
    position: relative;
  }
  .form-label {
    font-weight: 500;
  }
  </style> 
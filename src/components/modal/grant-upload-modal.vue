<template>
    <div
      class="modal fade"
      id="grantUploadModal"
      tabindex="-1"
      aria-labelledby="grantUploadModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="grantUploadModalLabel">Upload Grant Files</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              {{ alertMessage }}
            </div>
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="grantFile" class="form-label">Select File</label>
                <input type="file" class="form-control" id="grantFile" @change="handleFileChange" required />
              </div>
              <button type="submit" class="btn btn-primary" :disabled="isUploading">
                <span
                  v-if="isUploading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { grantService } from '@/services/grant.service';

  export default {
    name: 'GrantUploadModal',
    data() {
      return {
        file: null,
        description: '',
        isUploading: false,
        alertMessage: '',
        alertClass: '',
      };
    },
    methods: {
      handleFileChange(event) {
        this.file = event.target.files[0];
      },
      showAlert(message, type = 'danger') {
        this.alertMessage = message;
        this.alertClass = `alert-${type}`;
        
        // Auto-dismiss success alerts after 3 seconds
        if (type === 'success') {
          setTimeout(() => {
            this.alertMessage = '';
          }, 3000);
        }
      },
      async handleSubmit() {
        if (!this.file) {
          this.showAlert('Please select a file to upload.');
          return;
        }
  
        // Create FormData and append file and description
        const formData = new FormData();
        formData.append('file', this.file);
  
        this.isUploading = true;
        try {
          // Use grantService directly
          const response = await grantService.uploadGrantFile(formData);
          
          // Handle successful response with potential warnings
          if (response) {
            if (response.error) {
              this.showAlert(`Upload completed but with issues: ${response.error}`, 'warning');
            } else if (response.warnings && response.warnings.length > 0) {
              // Display warnings as a list if there are any
              const warningMessage = `Upload completed with warnings:\n${response.warnings.join('\n')}`;
              this.showAlert(warningMessage, 'warning');
            } else if (response.skipped_grants && response.skipped_grants.length > 0) {
              // Show information about skipped grants
              const skippedMessage = `Upload completed. Skipped grants: ${response.skipped_grants.join(', ')}`;
              this.showAlert(skippedMessage, 'info');
            } else {
              // Success with no issues
              const successMessage = response.message || 'File uploaded successfully!';
              this.showAlert(`${successMessage} (${response.processed_grants || 0} grants processed)`, 'success');
              this.resetForm();
            }
          } else {
            this.showAlert('File uploaded successfully!', 'success');
            this.resetForm();
          }
          
          // Emit event to refresh grant list
          this.$emit('refresh-grant-list');
          
        } catch (error) {
          console.error('Error uploading file:', error);
          // Show more detailed error message if available
          const errorMessage = error.response?.data?.message || 
                              error.message || 
                              'An error occurred while uploading the file.';
          this.showAlert(errorMessage);
        } finally {
          this.isUploading = false;
        }
      },
      resetForm() {
        this.file = null;
        this.description = '';
        const fileInput = document.getElementById('grantFile');
        if (fileInput) {
          fileInput.value = '';
        }
      },

      // refresh the grant list
      refreshGrantList() {
        this.$emit('refresh-grant-list');
      }
    },
  };
  </script>
  
  <style scoped>
  .modal-content {
    padding: 20px;
  }
  </style>
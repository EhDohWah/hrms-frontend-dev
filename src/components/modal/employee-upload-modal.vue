<template>

  <!-- upload employee excel file -->

  <div class="modal fade" id="employeeUploadModal" tabindex="-1" aria-labelledby="employeeUploadModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="employeeUploadModalLabel">Upload Employee Excel File</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
            {{ alertMessage }}
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="employeeFile" class="form-label">Select Excel File</label>
              <input type="file" class="form-control" id="employeeFile" @change="handleFileChange" required />
              <small class="form-text text-muted">Supported formats: .xlsx, .xls</small>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isUploading">
              <span v-if="isUploading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>


  <!-- Employment Upload Modal -->

  <div class="modal fade" id="employmentUploadModal" tabindex="-1" aria-labelledby="employmentUploadModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="employmentUploadModalLabel">Upload Employment Excel File</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="employmentAlertMessage" class="alert" :class="employmentAlertClass" role="alert">
            {{ employmentAlertMessage }}
          </div>
          <form @submit.prevent="handleEmploymentSubmit">
            <div class="mb-3">
              <label for="employmentFile" class="form-label">Select Excel File</label>
              <input type="file" class="form-control" id="employmentFile" @change="handleEmploymentFileChange"
                required />
              <small class="form-text text-muted">Supported formats: .xlsx, .xls</small>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isEmploymentUploading">
              <span v-if="isEmploymentUploading" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import { employeeService } from '@/services/employee.service';
import { employmentService } from '@/services/employment.service';

export default {
  name: 'EmployeeUploadModal',
  data() {
    return {
      file: null,
      employmentFile: null,
      isUploading: false,
      isEmploymentUploading: false,
      alertMessage: '',
      alertClass: '',
      employmentAlertMessage: '',
      employmentAlertClass: ''
    };
  },
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    handleEmploymentFileChange(event) {
      this.employmentFile = event.target.files[0];
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
    showEmploymentAlert(message, type = 'danger') {
      this.employmentAlertMessage = message;
      this.employmentAlertClass = `alert-${type}`;

      // Auto-dismiss success alerts after 3 seconds
      if (type === 'success') {
        setTimeout(() => {
          this.employmentAlertMessage = '';
        }, 3000);
      }
    },

    async handleSubmit() {
      if (!this.file) {
        this.showAlert('Please select a file to upload.');
        return;
      }

      // Validate file type
      const fileType = this.file.name.split('.').pop().toLowerCase();
      if (!['xlsx', 'xls'].includes(fileType)) {
        this.showAlert('Please upload a valid Excel file (.xlsx or .xls)');
        return;
      }

      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', this.file);

      this.isUploading = true;
      try {
        const response = await employeeService.uploadEmployeeFile(formData);

        // Handle successful response
        if (response) {
          if (response.errors && response.errors.length > 0) {
            this.showAlert(`Upload completed but with issues: ${response.errors.join(', ')}`, 'warning');
          } else {
            const successMessage = response.message || 'File uploaded successfully!';
            this.showAlert(`${successMessage}`, 'success');
            this.resetForm();
          }
        } else {
          this.showAlert('File uploaded successfully!', 'success');
          this.resetForm();
        }

        // Emit event to refresh employee list
        this.$emit('refresh-employee-list');

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


    async handleEmploymentSubmit() {
      if (!this.employmentFile) {
        this.showEmploymentAlert('Please select a file to upload.');
        return;
      }

      // Validate file type
      const fileType = this.employmentFile.name.split('.').pop().toLowerCase();
      if (!['xlsx', 'xls'].includes(fileType)) {
        this.showEmploymentAlert('Please upload a valid Excel file (.xlsx or .xls)');
        return;
      }

      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', this.employmentFile);

      this.isEmploymentUploading = true;
      try {
        const response = await employmentService.uploadEmploymentFile(formData);

        // Handle successful response with potential warnings
        if (response) {
          if (response.error) {
            this.showEmploymentAlert(`Upload completed but with issues: ${response.error}`, 'warning');
          } else if (response.warnings && response.warnings.length > 0) {
            // Display warnings as a list if there are any
            const warningMessage = `Upload completed with warnings:\n${response.warnings.join('\n')}`;
            this.showEmploymentAlert(warningMessage, 'warning');
          } else if (response.skipped_employments && response.skipped_employments.length > 0) {
            // Show information about skipped employments
            const skippedMessage = `Upload completed. Skipped employments: ${response.skipped_employments.join(', ')}`;
            this.showEmploymentAlert(skippedMessage, 'info');
          } else {
            // Success with no issues
            const successMessage = response.message || 'File uploaded successfully!';
            this.showEmploymentAlert(`${successMessage}`, 'success');
            this.resetEmploymentForm();
          }
        } else {
          this.showEmploymentAlert('File uploaded successfully!', 'success');
          this.resetEmploymentForm();
        }

        // Emit event to refresh employment list
        this.$emit('refresh-employment-list');

      } catch (error) {
        console.error('Error uploading employment file:', error);
        // Show more detailed error message if available
        const errorMessage = error.response?.data?.message ||
          error.message ||
          'An error occurred while uploading the file.';
        this.showEmploymentAlert(errorMessage);
      } finally {
        this.isEmploymentUploading = false;
      }
    },
    resetForm() {
      this.file = null;
      const fileInput = document.getElementById('employeeFile');
      if (fileInput) {
        fileInput.value = '';
      }
    },
    resetEmploymentForm() {
      this.employmentFile = null;
      const fileInput = document.getElementById('employmentFile');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  },
};
</script>

<style scoped>
.modal-content {
  padding: 20px;
}
</style>

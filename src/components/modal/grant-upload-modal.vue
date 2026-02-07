<template>
    <div
      class="modal fade"
      id="grantUploadModal"
      tabindex="-1"
      aria-labelledby="grantUploadModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="grantUploadModalLabel">Upload Grant Files</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Main Alert Message -->
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              <div v-html="formatAlertMessage(alertMessage)"></div>
            </div>

            <!-- Detailed Errors Section -->
            <div v-if="importErrors.length > 0" class="error-details mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="text-danger mb-0">
                  <i class="fa fa-exclamation-circle me-1"></i>
                  Import Errors ({{ importErrors.length }})
                </h6>
                <button type="button" class="btn btn-sm btn-outline-secondary" @click="toggleErrorDetails">
                  {{ showErrorDetails ? 'Hide Details' : 'Show Details' }}
                </button>
              </div>
              <div v-if="showErrorDetails" class="error-list-container">
                <ul class="error-list">
                  <li v-for="(error, index) in importErrors" :key="index" class="error-item">
                    <span v-html="formatErrorMessage(error)"></span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Upload Form -->
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="grantFile" class="form-label">Select Excel File</label>
                <input
                  type="file"
                  class="form-control"
                  id="grantFile"
                  @change="handleFileChange"
                  accept=".xlsx,.xls"
                  required
                />
                <small class="text-muted">
                  Template format: Column A = Labels, Column B = Values. Subsidiary must be SMRU or BHF.
                </small>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary" :disabled="isUploading">
                  <span
                    v-if="isUploading"
                    class="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {{ isUploading ? 'Uploading...' : 'Upload' }}
                </button>
                <button type="button" class="btn btn-outline-secondary" @click="resetForm" :disabled="isUploading">
                  Clear
                </button>
              </div>
            </form>

            <!-- Import Summary -->
            <div v-if="importSummary" class="import-summary mt-3 p-3 bg-light rounded">
              <h6 class="mb-2">Import Summary</h6>
              <div class="row">
                <div class="col-6">
                  <span class="text-success">
                    <i class="fa fa-check-circle me-1"></i>
                    Grants Processed: {{ importSummary.processedGrants }}
                  </span>
                </div>
                <div class="col-6">
                  <span class="text-info">
                    <i class="fa fa-list me-1"></i>
                    Items Processed: {{ importSummary.processedItems }}
                  </span>
                </div>
                <div v-if="importSummary.skippedGrants.length > 0" class="col-12 mt-2">
                  <span class="text-warning">
                    <i class="fa fa-forward me-1"></i>
                    Skipped Grants: {{ importSummary.skippedGrants.join(', ') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { uploadGrantService } from '@/services/upload-grant.service';
  import { sanitizeErrorHtml, escapeHtml } from '@/utils/sanitize';

  export default {
    name: 'GrantUploadModal',
    data() {
      return {
        file: null,
        description: '',
        isUploading: false,
        alertMessage: '',
        alertClass: '',
        importErrors: [],
        importSummary: null,
        showErrorDetails: false,
      };
    },
    methods: {
      handleFileChange(event) {
        this.file = event.target.files[0];
        // Clear previous results when selecting a new file
        this.alertMessage = '';
        this.importErrors = [];
        this.importSummary = null;
      },
      showAlert(message, type = 'danger') {
        this.alertMessage = message;
        this.alertClass = `alert-${type}`;

        // Auto-dismiss success alerts after 5 seconds
        if (type === 'success') {
          setTimeout(() => {
            this.alertMessage = '';
          }, 5000);
        }
      },
      toggleErrorDetails() {
        this.showErrorDetails = !this.showErrorDetails;
      },
      formatErrorMessage(error) {
        // First escape the raw error to prevent XSS
        let formatted = escapeHtml(error);

        // Then apply formatting on escaped text (safe patterns)
        // Highlight cell references like (Cell B1), (Cell B3)
        formatted = formatted.replace(/\(Cell ([A-Z]+\d+)\)/g, '<span class="badge bg-info text-white">(Cell $1)</span>');

        // Highlight row references like "Row 9:"
        formatted = formatted.replace(/Row (\d+):/g, '<span class="badge bg-warning text-dark">Row $1:</span>');

        // Highlight "Did you mean" suggestions (escaped quotes become &#39;)
        formatted = formatted.replace(/(Did you mean [&#39;"]([^&#39;"]+)[&#39;"]?\?)/g, '<span class="text-success fw-bold">$1</span>');

        // Highlight sheet names (escaped quotes become &#39;)
        formatted = formatted.replace(/Sheet &#39;([^&#39;]+)&#39;:/g, '<span class="fw-bold text-primary">Sheet \'$1\':</span>');

        // Final sanitization pass to ensure safety
        return sanitizeErrorHtml(formatted);
      },
      formatAlertMessage(message) {
        // Escape first then apply safe formatting
        return sanitizeErrorHtml(escapeHtml(message).replace(/\n/g, '<br>'));
      },
      async handleSubmit() {
        if (!this.file) {
          this.showAlert('Please select a file to upload.');
          return;
        }

        this.isUploading = true;
        this.importErrors = [];
        this.importSummary = null;

        try {
          const response = await uploadGrantService.uploadGrantData(this.file);

          // Handle successful response
          if (response) {
            const data = response.data || response;

            // Store import summary
            this.importSummary = {
              processedGrants: data.processed_grants || 0,
              processedItems: data.processed_items || 0,
              skippedGrants: data.skipped_grants || []
            };

            // Store errors for display
            this.importErrors = data.errors || [];

            if (data.error) {
              this.showAlert(`Upload completed with issues: ${data.error}`, 'warning');
            } else if (this.importErrors.length > 0) {
              this.showAlert(`Upload completed with ${this.importErrors.length} error(s). Review the details below.`, 'warning');
              this.showErrorDetails = true;
            } else if (data.warnings && data.warnings.length > 0) {
              const warningMessage = `Upload completed with warnings:\n${data.warnings.slice(0, 3).join('\n')}`;
              this.showAlert(warningMessage, 'warning');
            } else if (this.importSummary.skippedGrants.length > 0) {
              this.showAlert(`Upload completed. Skipped ${this.importSummary.skippedGrants.length} grant(s).`, 'info');
            } else if (this.importSummary.processedGrants > 0) {
              this.showAlert(`Successfully imported ${this.importSummary.processedGrants} grant(s) with ${this.importSummary.processedItems} position(s)!`, 'success');
              this.resetForm();
            } else {
              this.showAlert('No grants were imported. Please check your file format.', 'warning');
            }
          }

          // Emit event to refresh grant list
          this.$emit('refresh-grant-list');

        } catch (error) {
          console.error('Error uploading file:', error);

          // Extract errors from response
          if (error.response?.data) {
            const responseData = error.response.data;
            this.importErrors = responseData.data?.errors || responseData.errors || [];

            if (responseData.data) {
              this.importSummary = {
                processedGrants: responseData.data.processed_grants || 0,
                processedItems: responseData.data.processed_items || 0,
                skippedGrants: responseData.data.skipped_grants || []
              };
            }
          }

          const errorMessage = error.response?.data?.message ||
                              error.message ||
                              'An error occurred while uploading the file.';
          this.showAlert(errorMessage);

          if (this.importErrors.length > 0) {
            this.showErrorDetails = true;
          }
        } finally {
          this.isUploading = false;
        }
      },
      resetForm() {
        this.file = null;
        this.description = '';
        this.importErrors = [];
        this.importSummary = null;
        this.showErrorDetails = false;
        const fileInput = document.getElementById('grantFile');
        if (fileInput) {
          fileInput.value = '';
        }
      },
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

  .error-list-container {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    background-color: #fff5f5;
  }

  .error-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .error-item {
    padding: 8px 12px;
    border-bottom: 1px solid #f5c6cb;
    font-size: 13px;
    color: #721c24;
  }

  .error-item:last-child {
    border-bottom: none;
  }

  .import-summary {
    border: 1px solid #dee2e6;
  }

  .gap-2 {
    gap: 0.5rem;
  }
  </style>
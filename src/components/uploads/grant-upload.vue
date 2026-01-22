<template>
    <UploadRow
        ref="uploadRow"
        :upload="upload"
        :uploading="uploading"
        :upload-progress="uploadProgress"
        @upload="handleUpload"
        @file-selected="onFileSelected"
        @file-cleared="onFileCleared"
        @download-template="downloadTemplate"
    />

    <!-- Import Results Modal -->
    <a-modal
        v-model:open="showResultsModal"
        title="Grant Import Results"
        :footer="null"
        width="700px"
        @cancel="closeResultsModal"
    >
        <div class="import-results">
            <!-- Success Summary -->
            <a-alert
                v-if="importResults.processedGrants > 0"
                type="success"
                show-icon
                class="mb-3"
            >
                <template #message>
                    Successfully imported {{ importResults.processedGrants }} grant(s) with {{ importResults.processedItems }} position(s)
                </template>
            </a-alert>

            <!-- Skipped Grants -->
            <a-alert
                v-if="importResults.skippedGrants.length > 0"
                type="info"
                show-icon
                class="mb-3"
            >
                <template #message>
                    Skipped {{ importResults.skippedGrants.length }} grant(s): {{ importResults.skippedGrants.join(', ') }}
                </template>
            </a-alert>

            <!-- Warnings -->
            <div v-if="importResults.warnings.length > 0" class="mb-3">
                <h6 class="text-warning mb-2">
                    <i class="fa fa-exclamation-triangle me-1"></i>
                    Warnings ({{ importResults.warnings.length }})
                </h6>
                <a-collapse>
                    <a-collapse-panel key="warnings" header="Click to view warnings">
                        <ul class="warning-list">
                            <li v-for="(warning, index) in importResults.warnings" :key="'w-' + index" class="text-warning">
                                {{ warning }}
                            </li>
                        </ul>
                    </a-collapse-panel>
                </a-collapse>
            </div>

            <!-- Errors -->
            <div v-if="importResults.errors.length > 0" class="mb-3">
                <h6 class="text-danger mb-2">
                    <i class="fa fa-times-circle me-1"></i>
                    Errors ({{ importResults.errors.length }})
                </h6>
                <div class="error-list-container">
                    <ul class="error-list">
                        <li v-for="(error, index) in importResults.errors" :key="'e-' + index" class="error-item">
                            <span class="error-text" v-html="formatErrorMessage(error)"></span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- No Results -->
            <a-empty
                v-if="importResults.processedGrants === 0 && importResults.errors.length === 0"
                description="No grants were processed"
            />
        </div>
    </a-modal>
</template>

<script>
import UploadRow from '@/components/uploads/upload-row.vue';
import { message } from 'ant-design-vue';
import { uploadGrantService } from '@/services/upload-grant.service';

export default {
    name: 'GrantUpload',
    components: {
        UploadRow
    },
    emits: ['upload-complete'],
    data() {
        return {
            upload: {
                id: 1,
                name: "Grant Data Import",
                description: "Upload Excel file with grant information (bulk import)",
                icon: "award",
                templateUrl: true
            },
            uploading: false,
            uploadProgress: 0,
            selectedFile: null,
            showResultsModal: false,
            importResults: {
                processedGrants: 0,
                processedItems: 0,
                errors: [],
                warnings: [],
                skippedGrants: []
            }
        };
    },
    methods: {
        onFileSelected(file) {
            this.selectedFile = file;
        },
        onFileCleared() {
            this.selectedFile = null;
            this.uploadProgress = 0;
        },
        async downloadTemplate() {
            try {
                message.loading({ content: 'Downloading template...', key: 'template' });
                await uploadGrantService.downloadTemplate();
                message.success({ content: 'Template downloaded successfully!', key: 'template' });
            } catch (error) {
                console.error('Error downloading template:', error);

                let errorMessage = 'Failed to download template. Please try again.';
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                message.error({ content: errorMessage, key: 'template' });
            }
        },
        async handleUpload(file) {
            if (!file) {
                message.error('Please select a file to upload');
                return;
            }

            this.uploading = true;
            this.uploadProgress = 0;

            try {
                message.loading({ content: 'Uploading grant data...', key: 'upload' });

                // Simulate progress (replace with actual progress if your API supports it)
                const progressInterval = setInterval(() => {
                    if (this.uploadProgress < 90) {
                        this.uploadProgress += 10;
                    }
                }, 200);

                const response = await uploadGrantService.uploadGrantData(file);

                clearInterval(progressInterval);
                this.uploadProgress = 100;

                // Extract data from response
                const data = response.data || response;
                const processedGrants = data.processed_grants || 0;
                const processedItems = data.processed_items || 0;
                const warnings = data.warnings || [];
                const errors = data.errors || [];
                const skippedGrants = data.skipped_grants || [];

                // Store results for modal display
                this.importResults = {
                    processedGrants,
                    processedItems,
                    errors,
                    warnings,
                    skippedGrants
                };

                // Show success message
                if (processedGrants > 0) {
                    message.success({
                        content: `Successfully uploaded ${processedGrants} grant(s) with ${processedItems} position(s)!`,
                        key: 'upload',
                        duration: 5
                    });
                } else if (errors.length > 0) {
                    message.warning({
                        content: `Import completed with ${errors.length} error(s). Click to view details.`,
                        key: 'upload',
                        duration: 5
                    });
                } else {
                    message.info({
                        content: 'No grants were imported.',
                        key: 'upload',
                        duration: 5
                    });
                }

                // Show results modal if there are errors, warnings, or skipped grants
                if (errors.length > 0 || warnings.length > 0 || skippedGrants.length > 0) {
                    this.showResultsModal = true;
                }

                // Clear the file after upload
                this.onFileCleared();
                if (this.$refs.uploadRow) {
                    this.$refs.uploadRow.resetFile();
                }
                this.$emit('upload-complete', data);

            } catch (error) {
                console.error('Error uploading grant data:', error);

                let errorMessage = 'Failed to upload grant data. Please try again.';
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                message.error({ content: errorMessage, key: 'upload' });

                // Show detailed errors if available in modal
                if (error.response && error.response.data) {
                    const responseData = error.response.data;
                    this.importResults = {
                        processedGrants: responseData.data?.processed_grants || 0,
                        processedItems: responseData.data?.processed_items || 0,
                        errors: responseData.data?.errors || responseData.errors || [],
                        warnings: responseData.data?.warnings || responseData.warnings || [],
                        skippedGrants: responseData.data?.skipped_grants || responseData.skipped_grants || []
                    };

                    if (this.importResults.errors.length > 0) {
                        this.showResultsModal = true;
                    }
                }
            } finally {
                this.uploading = false;
            }
        },
        formatErrorMessage(error) {
            // Highlight cell references like (Cell B1), (Cell B3), Row 9, etc.
            let formatted = error;

            // Highlight cell references
            formatted = formatted.replace(/\(Cell ([A-Z]+\d+)\)/g, '<span class="cell-ref">(Cell $1)</span>');

            // Highlight row references
            formatted = formatted.replace(/Row (\d+):/g, '<span class="row-ref">Row $1:</span>');

            // Highlight "Did you mean" suggestions
            formatted = formatted.replace(/(Did you mean ['"]([^'"]+)['"]?\?)/g, '<span class="suggestion">$1</span>');

            // Highlight sheet names
            formatted = formatted.replace(/Sheet '([^']+)':/g, '<span class="sheet-ref">Sheet \'$1\':</span>');

            return formatted;
        },
        closeResultsModal() {
            this.showResultsModal = false;
        }
    }
};
</script>

<style scoped>
.import-results {
    max-height: 500px;
    overflow-y: auto;
}

.error-list-container {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #ffccc7;
    border-radius: 4px;
    background-color: #fff2f0;
}

.error-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.error-list .error-item {
    padding: 8px 12px;
    border-bottom: 1px solid #ffccc7;
    font-size: 13px;
    color: #cf1322;
}

.error-list .error-item:last-child {
    border-bottom: none;
}

.warning-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.warning-list li {
    padding: 4px 0;
    font-size: 13px;
}

:deep(.cell-ref) {
    background-color: #e6f7ff;
    padding: 1px 4px;
    border-radius: 3px;
    font-family: monospace;
    font-weight: 600;
    color: #1890ff;
}

:deep(.row-ref) {
    background-color: #fff7e6;
    padding: 1px 4px;
    border-radius: 3px;
    font-family: monospace;
    font-weight: 600;
    color: #fa8c16;
}

:deep(.suggestion) {
    color: #52c41a;
    font-weight: 600;
}

:deep(.sheet-ref) {
    font-weight: 600;
    color: #722ed1;
}

.mb-3 {
    margin-bottom: 1rem;
}

.text-warning {
    color: #faad14;
}

.text-danger {
    color: #ff4d4f;
}
</style>


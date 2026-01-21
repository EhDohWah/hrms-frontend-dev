<template>
    <UploadRow 
        ref="uploadRow"
        :upload="upload" 
        :uploading="uploading"
        :upload-progress="uploadProgress"
        :can-edit="canEdit"
        @upload="handleUpload"
        @file-selected="onFileSelected"
        @file-cleared="onFileCleared"
        @download-template="downloadTemplate"
    >
        <template #additional-downloads>
            <span class="text-muted fs-12 mx-2">|</span>
            <a 
                href="javascript:void(0);" 
                @click="downloadGrantItemsReference" 
                class="text-success fs-12"
                :class="{ 'disabled': downloadingReference }"
            >
                <i class="ti ti-list-check me-1"></i>
                {{ downloadingReference ? 'Downloading...' : 'Download Grant Items Reference' }}
            </a>
            <i 
                class="ti ti-info-circle text-info ms-1" 
                style="cursor: help;"
                title="Download this file first to get Grant Item IDs needed for the import"
            ></i>
        </template>
    </UploadRow>
</template>

<script>
import UploadRow from '@/components/uploads/upload-row.vue';
import { message } from 'ant-design-vue';
import { uploadFundingAllocationService } from '@/services/upload-funding-allocation.service';

export default {
    name: 'FundingAllocationUpload',
    components: {
        UploadRow
    },
    props: {
        canEdit: {
            type: Boolean,
            default: false
        }
    },
    emits: ['upload-complete'],
    data() {
        return {
            upload: {
                id: 4,
                name: "Employee Funding Allocations Import",
                description: "Upload Excel file with employee funding allocation data (bulk import)",
                icon: "chart-pie",
                templateUrl: true
            },
            uploading: false,
            uploadProgress: 0,
            selectedFile: null,
            downloadingReference: false
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
                await uploadFundingAllocationService.downloadTemplate();
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
        async downloadGrantItemsReference() {
            this.downloadingReference = true;
            try {
                message.loading({ content: 'Downloading grant items reference...', key: 'reference' });
                await uploadFundingAllocationService.downloadGrantItemsReference();
                message.success({ 
                    content: 'Grant items reference downloaded successfully! Use this file to find Grant Item IDs for your import.', 
                    key: 'reference',
                    duration: 5
                });
            } catch (error) {
                console.error('Error downloading grant items reference:', error);
                
                let errorMessage = 'Failed to download grant items reference. Please try again.';
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                message.error({ content: errorMessage, key: 'reference' });
            } finally {
                this.downloadingReference = false;
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
                message.loading({ content: 'Uploading employee funding allocation data...', key: 'upload' });

                // Simulate progress
                const progressInterval = setInterval(() => {
                    if (this.uploadProgress < 90) {
                        this.uploadProgress += 10;
                    }
                }, 200);

                const response = await uploadFundingAllocationService.uploadFundingAllocationData(file, (progress) => {
                    this.uploadProgress = progress;
                });

                clearInterval(progressInterval);
                this.uploadProgress = 100;

                // Funding allocation upload is queued - show queued message
                const data = response.data || response;
                const importId = data.import_id;
                const status = data.status;
                
                message.success({ 
                    content: response.message || 'Employee funding allocation import started successfully. You will receive a notification when the import is complete.', 
                    key: 'upload',
                    duration: 6
                });

                if (importId) {
                    message.info({
                        content: `Import ID: ${importId} | Status: ${status || 'processing'}`,
                        duration: 5
                    });
                }

                // Clear the file after successful upload
                this.onFileCleared();
                if (this.$refs.uploadRow) {
                    this.$refs.uploadRow.resetFile();
                }
                this.$emit('upload-complete', data);

            } catch (error) {
                console.error('Error uploading employee funding allocation data:', error);
                
                let errorMessage = 'Failed to upload employee funding allocation data. Please try again.';
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                message.error({ content: errorMessage, key: 'upload' });

                // Show detailed errors if available
                if (error.response && error.response.data && error.response.data.errors) {
                    const errors = error.response.data.errors;
                    Object.keys(errors).forEach(key => {
                        message.error(`${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`);
                    });
                }
            } finally {
                this.uploading = false;
            }
        }
    }
};
</script>

<style scoped>
a.disabled {
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
}
</style>

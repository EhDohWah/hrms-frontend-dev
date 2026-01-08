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
    />
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
            selectedFile: null
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

                const totalRecords = response.data?.total_records || response.total_records || 0;
                message.success({ 
                    content: `Successfully uploaded employee funding allocation data! Import is processing...`, 
                    key: 'upload',
                    duration: 5
                });

                // Show import ID info
                if (response.data?.import_id) {
                    message.info(`Import ID: ${response.data.import_id}. You will receive a notification when complete.`, 7);
                }

                // Clear the file after successful upload
                this.onFileCleared();
                if (this.$refs.uploadRow) {
                    this.$refs.uploadRow.resetFile();
                }
                this.$emit('upload-complete', response.data || response);

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


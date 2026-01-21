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

                // Show success message
                message.success({ 
                    content: `Successfully uploaded ${processedGrants} grant(s) with ${processedItems} position(s)!`, 
                    key: 'upload',
                    duration: 5
                });

                // Show warnings if available
                if (warnings.length > 0) {
                    warnings.forEach((warning, index) => {
                        setTimeout(() => {
                            message.warning({
                                content: warning,
                                duration: 6
                            });
                        }, (index + 1) * 100);
                    });
                }

                // Show errors if available
                if (errors.length > 0) {
                    errors.forEach((error, index) => {
                        setTimeout(() => {
                            message.error({
                                content: error,
                                duration: 8
                            });
                        }, (index + 1) * 100);
                    });
                }

                // Clear the file after successful upload
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


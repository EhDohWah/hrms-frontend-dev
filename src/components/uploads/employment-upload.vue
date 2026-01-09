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
import { uploadEmploymentService } from '@/services/upload-employment.service';

export default {
    name: 'EmploymentUpload',
    components: {
        UploadRow
    },
    emits: ['upload-complete'],
    data() {
        return {
            upload: {
                id: 2,
                name: "Employment Records Import",
                description: "Upload Excel file with employment history data (bulk import)",
                icon: "briefcase",
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
                await uploadEmploymentService.downloadTemplate();
                message.success({ content: 'Template downloaded!', key: 'template' });
            } catch (error) {
                console.error('Error downloading template:', error);
                message.error({ content: 'Failed to download template.', key: 'template' });
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
                message.loading({ content: 'Uploading employment data...', key: 'upload' });

                const progressInterval = setInterval(() => {
                    if (this.uploadProgress < 90) {
                        this.uploadProgress += 10;
                    }
                }, 200);

                const response = await uploadEmploymentService.uploadEmploymentData(file, (progress) => {
                    this.uploadProgress = progress;
                });

                clearInterval(progressInterval);
                this.uploadProgress = 100;

                // Employment upload is queued - show queued message
                const data = response.data || response;
                const importId = data.import_id;
                const status = data.status;
                
                message.success({ 
                    content: response.message || 'Employment import started successfully. You will receive a notification when the import is complete.', 
                    key: 'upload',
                    duration: 6
                });

                if (importId) {
                    message.info({
                        content: `Import ID: ${importId} | Status: ${status || 'processing'}`,
                        duration: 5
                    });
                }

                this.onFileCleared();
                if (this.$refs.uploadRow) {
                    this.$refs.uploadRow.resetFile();
                }
                this.$emit('upload-complete', data);

            } catch (error) {
                console.error('Error uploading employment data:', error);
                
                let errorMessage = 'Failed to upload employment data. Please try again.';
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                message.error({ content: errorMessage, key: 'upload' });

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





























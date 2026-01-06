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
import { uploadEmployeeService } from '@/services/upload-employee.service';

export default {
    name: 'EmployeeUpload',
    components: {
        UploadRow
    },
    emits: ['upload-complete'],
    data() {
        return {
            upload: {
                id: 1,
                name: "Employee Data Import",
                description: "Upload Excel file with employee information (bulk import)",
                icon: "users",
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
                await uploadEmployeeService.downloadTemplate();
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
                message.loading({ content: 'Uploading employee data...', key: 'upload' });

                // Simulate progress (replace with actual progress if your API supports it)
                const progressInterval = setInterval(() => {
                    if (this.uploadProgress < 90) {
                        this.uploadProgress += 10;
                    }
                }, 200);

                const response = await uploadEmployeeService.uploadEmployeeData(file, (progress) => {
                    this.uploadProgress = progress;
                });

                clearInterval(progressInterval);
                this.uploadProgress = 100;

                const totalRecords = response.data?.total_records || response.total_records || 0;
                message.success({ 
                    content: `Successfully uploaded ${totalRecords} employee records!`, 
                    key: 'upload' 
                });

                // Show summary if available
                const summary = response.data?.summary || response.summary;
                if (summary) {
                    message.info(`Inserted: ${summary.inserted || 0}, Updated: ${summary.updated || 0}, Failed: ${summary.failed || 0}`);
                }

                // Clear the file after successful upload
                this.onFileCleared();
                if (this.$refs.uploadRow) {
                    this.$refs.uploadRow.resetFile();
                }
                this.$emit('upload-complete', response.data || response);

            } catch (error) {
                console.error('Error uploading employee data:', error);
                
                let errorMessage = 'Failed to upload employee data. Please try again.';
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




























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
import { uploadPayrollService } from '@/services/upload-payroll.service';

export default {
    name: 'PayrollUpload',
    components: {
        UploadRow
    },
    emits: ['upload-complete'],
    data() {
        return {
            upload: {
                id: 3,
                name: "Payroll Data Import",
                description: "Upload Excel file with payroll information (bulk import)",
                icon: "calculator",
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
                await uploadPayrollService.downloadTemplate();
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
                message.loading({ content: 'Uploading payroll data...', key: 'upload' });

                const progressInterval = setInterval(() => {
                    if (this.uploadProgress < 90) {
                        this.uploadProgress += 10;
                    }
                }, 200);

                const response = await uploadPayrollService.uploadPayrollData(file, (progress) => {
                    this.uploadProgress = progress;
                });

                clearInterval(progressInterval);
                this.uploadProgress = 100;

                const totalRecords = response.data?.total_records || response.total_records || 0;
                message.success({ 
                    content: `Successfully uploaded ${totalRecords} payroll records!`, 
                    key: 'upload' 
                });

                const summary = response.data?.summary || response.summary;
                if (summary) {
                    message.info(`Inserted: ${summary.inserted || 0}, Updated: ${summary.updated || 0}, Failed: ${summary.failed || 0}`);
                }

                this.onFileCleared();
                if (this.$refs.uploadRow) {
                    this.$refs.uploadRow.resetFile();
                }
                this.$emit('upload-complete', response.data || response);

            } catch (error) {
                console.error('Error uploading payroll data:', error);
                
                let errorMessage = 'Failed to upload payroll data. Please try again.';
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





























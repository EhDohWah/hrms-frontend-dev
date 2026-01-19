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
    >
        <template #additional-downloads>
            <span class="text-muted fs-12 mx-2">|</span>
            <a 
                href="javascript:void(0);" 
                @click="downloadFundingAllocationsReference" 
                class="text-success fs-12"
                :class="{ 'disabled': downloadingReference }"
            >
                <i class="ti ti-list-check me-1"></i>
                {{ downloadingReference ? 'Downloading...' : 'Download Funding Allocations Reference' }}
            </a>
            <i 
                class="ti ti-info-circle text-info ms-1" 
                style="cursor: help;"
                title="Download this file first to get Employee Funding Allocation IDs needed for the payroll import"
            ></i>
        </template>
    </UploadRow>
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
                name: "Payroll Records Import",
                description: "Upload Excel file with monthly payroll records (bulk import)",
                icon: "cash-banknote",
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
                await uploadPayrollService.downloadTemplate();
                message.success({ content: 'Template downloaded!', key: 'template' });
            } catch (error) {
                console.error('Error downloading template:', error);
                message.error({ content: 'Failed to download template.', key: 'template' });
            }
        },
        async downloadFundingAllocationsReference() {
            this.downloadingReference = true;
            try {
                message.loading({ content: 'Downloading funding allocations reference...', key: 'reference' });
                await uploadPayrollService.downloadFundingAllocationsReference();
                message.success({ 
                    content: 'Funding allocations reference downloaded! Use this file to find Employee Funding Allocation IDs for your payroll import.', 
                    key: 'reference',
                    duration: 5
                });
            } catch (error) {
                console.error('Error downloading funding allocations reference:', error);
                
                let errorMessage = 'Failed to download funding allocations reference. Please try again.';
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

                // Payroll upload is queued - show queued message
                const data = response.data || response;
                const importId = response.import_id || data.import_id;
                
                message.success({ 
                    content: response.message || 'Payroll import started successfully. You will be notified when complete.', 
                    key: 'upload',
                    duration: 6
                });

                if (importId) {
                    message.info({
                        content: `Import ID: ${importId}`,
                        duration: 4
                    });
                }

                this.onFileCleared();
                if (this.$refs.uploadRow) {
                    this.$refs.uploadRow.resetFile();
                }
                this.$emit('upload-complete', data);

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

<style scoped>
a.disabled {
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
}
</style>




























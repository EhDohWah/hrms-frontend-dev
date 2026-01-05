<template>
    <tr>
        <td>
            <div class="d-flex align-items-center">
                <div class="me-3 flex-shrink-0">
                    <div class="d-flex align-items-center justify-content-center rounded-circle" :style="iconStyle">
                        <i :class="`ti ti-${upload.icon}`" class="fs-3 text-white"></i>
                    </div>
                </div>
                <div>
                    <h6 class="mb-0">{{ upload.name }}</h6>
                    <p class="text-muted fs-12 mb-0">{{ upload.description }}</p>
                    <a v-if="upload.templateUrl" href="javascript:void(0);" @click="downloadTemplate" class="text-primary fs-12">
                        <i class="ti ti-download me-1"></i>Download Template
                    </a>
                </div>
            </div>
        </td>
        <td>
            <div class="upload-input-wrapper">
                <input 
                    type="file" 
                    ref="fileInput" 
                    @change="handleFileSelect" 
                    accept=".xlsx,.xls"
                    class="form-control"
                    :disabled="uploading"
                />
                <div v-if="selectedFile" class="selected-file-info mt-2">
                    <small class="text-muted">
                        <i class="ti ti-file-type-xls text-success"></i> {{ selectedFile.name }} 
                        ({{ formatFileSize(selectedFile.size) }})
                    </small>
                </div>
                <div v-if="uploading" class="upload-progress mt-2">
                    <div class="progress" style="height: 6px;">
                        <div 
                            class="progress-bar progress-bar-striped progress-bar-animated" 
                            role="progressbar" 
                            :style="{ width: uploadProgress + '%' }"
                        ></div>
                    </div>
                    <small class="text-muted">{{ uploadProgress }}% uploaded</small>
                </div>
            </div>
        </td>
        <td class="text-end">
            <div class="d-flex justify-content-end gap-2">
                <button 
                    class="btn btn-sm btn-primary" 
                    @click="handleUpload"
                    :disabled="!selectedFile || uploading"
                >
                    <i class="ti ti-upload me-1"></i> 
                    {{ uploading ? 'Uploading...' : 'Upload' }}
                </button>
                <button 
                    class="btn btn-sm btn-secondary" 
                    @click="clearFile"
                    :disabled="!selectedFile || uploading"
                >
                    <i class="ti ti-x me-1"></i> Clear
                </button>
            </div>
        </td>
    </tr>
</template>

<script>
import { message } from 'ant-design-vue';

export default {
    name: 'UploadRow',
    props: {
        upload: {
            type: Object,
            required: true
        },
        uploading: {
            type: Boolean,
            default: false
        },
        uploadProgress: {
            type: Number,
            default: 0
        }
    },
    emits: ['upload', 'file-selected', 'file-cleared', 'download-template'],
    data() {
        return {
            selectedFile: null,
            iconStyle: {
                backgroundColor: '#28a745',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        };
    },
    methods: {
        handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                const validTypes = [
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel'
                ];
                
                // Some browsers may report different MIME types, so also check extension
                const validExtensions = ['.xlsx', '.xls'];
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                
                if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
                    message.error('Please select a valid Excel file (.xlsx or .xls)');
                    event.target.value = '';
                    return;
                }

                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    message.error('File size must be less than 10MB');
                    event.target.value = '';
                    return;
                }

                this.selectedFile = file;
                this.$emit('file-selected', file);
            }
        },
        handleUpload() {
            if (this.selectedFile) {
                this.$emit('upload', this.selectedFile);
            }
        },
        clearFile() {
            this.selectedFile = null;
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
            this.$emit('file-cleared');
        },
        downloadTemplate() {
            this.$emit('download-template');
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        },
        resetFile() {
            this.selectedFile = null;
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        }
    }
};
</script>

<style scoped>
.upload-input-wrapper {
    position: relative;
}

.selected-file-info {
    padding: 8px;
    background-color: #f8f9fa;
    border-radius: 4px;
    border-left: 3px solid #28a745;
}

.upload-progress {
    margin-top: 8px;
}

.form-control:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
}

.gap-2 {
    gap: 0.5rem;
}
</style>





























<template>
    <div class="modal fade" id="taxSettingsModal" tabindex="-1" aria-labelledby="taxSettingsModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="taxSettingsModalLabel">{{ editMode ? 'Edit' : 'Add' }} Tax Setting</h5>
                    <button type="button" class="btn-close" @click="handleModalClose" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Restored Data Notification -->
                    <div v-if="restoredDataNotification.show" class="alert alert-info alert-dismissible fade show mb-3"
                        role="alert">
                        <i class="ti ti-info-circle me-2"></i>
                        Restored your previous unsaved changes from {{
                            formatRestoredTime(restoredDataNotification.timestamp) }}
                        <button type="button" class="btn-close" @click="restoredDataNotification.show = false"></button>
                    </div>

                    <form @submit.prevent="handleSubmit">
                        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
                            {{ alertMessage }}
                        </div>

                        <div class="row">
                            <!-- Left Column -->
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="settingKey" class="form-label">Setting Key <span
                                            class="text-danger">*</span></label>
                                    <select class="form-select" :class="{ 'is-invalid': validationErrors.setting_key }"
                                        id="settingKey" v-model="formData.setting_key" required
                                        @change="handleSettingKeyChange">
                                        <option value="" disabled>Select Setting Key</option>
                                        <option v-for="key in availableSettingKeys" :key="key.value" :value="key.value">
                                            {{ key.label }}
                                        </option>
                                    </select>
                                    <div v-if="validationErrors.setting_key" class="invalid-feedback">
                                        {{ validationErrors.setting_key }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="settingValue" class="form-label">Setting Value <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <span v-if="selectedSettingType === 'RATE'" class="input-group-text">%</span>
                                        <span
                                            v-if="selectedSettingType === 'DEDUCTION' || selectedSettingType === 'LIMIT'"
                                            class="input-group-text">฿</span>
                                        <input type="number" class="form-control"
                                            :class="{ 'is-invalid': validationErrors.setting_value }" id="settingValue"
                                            v-model="formData.setting_value" required @input="handleFormChange"
                                            :step="selectedSettingType === 'RATE' ? '0.01' : '0.01'"
                                            :placeholder="getSettingValuePlaceholder()" />
                                    </div>
                                    <div v-if="validationErrors.setting_value" class="invalid-feedback">
                                        {{ validationErrors.setting_value }}
                                    </div>
                                    <div class="form-text">
                                        <small>{{ getSettingValueHint() }}</small>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="settingType" class="form-label">Setting Type <span
                                            class="text-danger">*</span></label>
                                    <div class="form-check-group">
                                        <div class="form-check" v-for="type in availableSettingTypes" :key="type.value">
                                            <input class="form-check-input" type="radio"
                                                :name="'settingType-' + modalId" :id="'settingType' + type.value"
                                                :value="type.value" v-model="formData.setting_type"
                                                @change="handleFormChange" required>
                                            <label class="form-check-label" :for="'settingType' + type.value">
                                                {{ type.label }}
                                            </label>
                                        </div>
                                    </div>
                                    <div v-if="validationErrors.setting_type" class="invalid-feedback d-block">
                                        {{ validationErrors.setting_type }}
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="effectiveYear" class="form-label">Effective Year <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control"
                                        :class="{ 'is-invalid': validationErrors.effective_year }" id="effectiveYear"
                                        v-model="formData.effective_year" required @input="handleFormChange"
                                        :min="currentYear - 5" :max="currentYear + 10" />
                                    <div v-if="validationErrors.effective_year" class="invalid-feedback">
                                        {{ validationErrors.effective_year }}
                                    </div>
                                    <div class="form-text">
                                        <small>Year when this setting becomes effective ({{ currentYear - 5 }} - {{
                                            currentYear + 10 }})</small>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="isActive"
                                            v-model="formData.is_active" @change="handleFormChange">
                                        <label class="form-check-label" for="isActive">
                                            Active Setting
                                        </label>
                                    </div>
                                    <div class="form-text">
                                        <small>Only active settings are used in tax calculations</small>
                                    </div>
                                </div>

                                <!-- Preview Card -->
                                <div v-if="formData.setting_key && formData.setting_value" class="card bg-light">
                                    <div class="card-header">
                                        <h6 class="card-title mb-0">Setting Preview</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-muted">Key:</span>
                                            <strong>{{ getSelectedSettingLabel() }}</strong>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-muted">Value:</span>
                                            <strong class="text-primary">{{ formatSettingValue() }}</strong>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-muted">Type:</span>
                                            <span class="badge" :class="getSettingTypeBadgeClass()">{{
                                                getSelectedSettingType() }}</span>
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="text-muted">Status:</span>
                                            <span class="badge"
                                                :class="formData.is_active ? 'badge-success' : 'badge-secondary'">
                                                {{ formData.is_active ? 'Active' : 'Inactive' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Full Width Fields -->
                        <div class="row">
                            <div class="col-12">
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description</label>
                                    <textarea class="form-control" id="description" v-model="formData.description"
                                        rows="3" @input="handleFormChange"
                                        placeholder="Enter a description for this tax setting..."></textarea>
                                    <div class="form-text">
                                        <small>Optional description to explain the purpose of this setting</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="text-end">
                            <button type="button" class="btn btn-secondary me-2"
                                @click="handleModalClose">Cancel</button>
                            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                                    aria-hidden="true"></span>
                                {{ editMode ? 'Update Setting' : 'Save Setting' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { createVNode, nextTick } from 'vue';
import { message, Modal as AntModal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { taxSettingsService } from '@/services/tax-settings.service';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';

export default {
    name: 'TaxSettingsModal',
    props: {
        editingRecord: {
            type: Object,
            default: null
        }
    },
    emits: ['submit', 'cancel'],
    data() {
        return {
            // Modal instance and state
            modalInstance: null,
            modalId: `modal-${Math.random().toString(36).substr(2, 9)}`,
            editMode: false,

            // Loading and submission states
            isSubmitting: false,

            // Form persistence
            formPersistenceStore: null,
            isDraftMode: false,
            hasUnsavedChanges: false,
            isDestroyed: false,
            isComponentReady: false,

            // Notifications
            restoredDataNotification: {
                show: false,
                timestamp: null
            },
            alertMessage: '',
            alertClass: '',

            // Form validation
            validationErrors: {},

            // Form data
            formData: {
                id: null,
                setting_key: '',
                setting_value: '',
                setting_type: 'DEDUCTION',
                description: '',
                effective_year: new Date().getFullYear(),
                is_active: true
            },
            originalFormData: {},

            // Current year for validation
            currentYear: new Date().getFullYear(),

            // Available options
            availableSettingKeys: [],
            availableSettingTypes: []
        };
    },

    computed: {
        selectedSettingType() {
            if (!this.formData.setting_key || !this.availableSettingKeys.length) {
                return this.formData.setting_type;
            }

            const selectedKey = this.availableSettingKeys.find(key => key.value === this.formData.setting_key);
            return selectedKey ? selectedKey.type : this.formData.setting_type;
        }
    },

    watch: {
        editingRecord: {
            handler(newVal) {
                if (newVal) {
                    this.editMode = true;
                    this.formData = { ...newVal };
                    this.originalFormData = { ...newVal };
                } else {
                    this.editMode = false;
                    this.resetForm();
                }
            },
            deep: true,
            immediate: true
        }
    },

    async created() {
        try {
            // Initialize stores and services
            this.formPersistenceStore = useFormPersistenceStore();

            // Load available options
            this.availableSettingKeys = taxSettingsService.getTaxSettingKeys();
            this.availableSettingTypes = taxSettingsService.getTaxSettingTypes();

            this.isComponentReady = true;
        } catch (error) {
            console.error('Error during component initialization:', error);
        }
    },

    mounted() {
        // Initialize Bootstrap modal
        const modalElement = document.getElementById('taxSettingsModal');
        if (modalElement) {
            this.modalInstance = new Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });

            // Modal event listeners
            modalElement.addEventListener('shown.bs.modal', () => {
                this.onModalShown();
            });

            modalElement.addEventListener('hide.bs.modal', (event) => {
                if (this.hasUnsavedChanges && !this.isSubmitting && this.isDraftMode) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.handleModalClose();
                }
            });

            modalElement.addEventListener('hidden.bs.modal', () => {
                if (!this.isDraftMode) {
                    this.resetForm();
                }
                this.cleanupModalBackdrops();
            });
        }
    },

    beforeUnmount() {
        this.isDestroyed = true;
        this.isComponentReady = false;

        if (this.modalInstance && typeof this.modalInstance.dispose === 'function') {
            try {
                this.modalInstance.dispose();
            } catch (error) {
                console.error('Error disposing modal:', error);
            }
        }

        this.cleanupModalBackdrops();
    },

    methods: {
        // Modal lifecycle methods
        onModalShown() {
            if (this.editMode && this.editingRecord) {
                // Editing mode - clear draft and load data
                this.clearFormDraft();
                this.isDraftMode = false;
                this.hasUnsavedChanges = false;
                this.restoredDataNotification.show = false;

                this.formData = { ...this.editingRecord };
                this.originalFormData = { ...this.editingRecord };
            } else {
                // Create mode - check for draft
                const hasDraft = this.loadFormDraft();

                if (!hasDraft) {
                    this.resetForm();
                    this.restoredDataNotification.show = false;
                }

                this.isDraftMode = true;
                this.hasUnsavedChanges = false;
            }

            console.log('📝 Tax Settings modal ready for input - isDraftMode:', this.isDraftMode);
        },

        openModal() {
            if (this.modalInstance) {
                this.modalInstance.show();
            }
        },

        async handleModalClose() {
            if (this.isDestroyed || !this.isComponentReady) return;

            const hasUnsaved = this.hasUnsavedChanges && this.isDraftMode;

            if (hasUnsaved) {
                this.showUnsavedChangesConfirm();
            } else {
                await this.safeHideModal();
            }
        },

        showUnsavedChangesConfirm() {
            AntModal.confirm({
                title: 'Unsaved Changes',
                icon: createVNode(ExclamationCircleOutlined),
                content: createVNode('div', { style: 'margin-top: 16px;' }, [
                    createVNode('p', { style: 'margin-bottom: 12px; color: #666;' }, 'You have unsaved changes in the tax setting form.'),
                    createVNode('p', { style: 'margin-bottom: 0; font-weight: 500;' }, 'What would you like to do?')
                ]),
                centered: true,
                width: 440,
                maskClosable: false,
                keyboard: false,
                okText: 'Continue Editing',
                okType: 'default',
                cancelText: 'Discard Changes',
                cancelButtonProps: { danger: true },
                onOk: () => Promise.resolve(),
                onCancel: () => {
                    this.discardChangesAndClose();
                    return Promise.resolve();
                }
            });
        },

        async discardChangesAndClose() {
            if (this.isDestroyed) return;

            try {
                this.clearFormDraft();
                this.resetForm();
                await this.safeHideModal();
            } catch (error) {
                console.error('Error discarding changes:', error);
            }
        },

        safeHideModal() {
            return new Promise((resolve) => {
                if (this.isDestroyed) {
                    resolve(true);
                    return;
                }

                this.isDraftMode = false;
                this.hasUnsavedChanges = false;

                nextTick(() => {
                    if (this.isDestroyed) {
                        resolve(true);
                        return;
                    }

                    if (this.modalInstance) {
                        try {
                            const modalEl = document.getElementById('taxSettingsModal');
                            if (modalEl) {
                                modalEl.addEventListener('hidden.bs.modal', () => {
                                    this.cleanupModalBackdrops();
                                    resolve(true);
                                }, { once: true });

                                this.modalInstance.hide();
                            } else {
                                resolve(true);
                            }
                        } catch (error) {
                            console.error('Error hiding modal:', error);
                            resolve(false);
                        }
                    } else {
                        resolve(true);
                    }
                });
            });
        },

        cleanupModalBackdrops() {
            if (this.isDestroyed) return;

            nextTick(() => {
                if (this.isDestroyed) return;

                const backdrops = document.querySelectorAll('.modal-backdrop');
                const activeModals = document.querySelectorAll('.modal.show');

                if (activeModals.length === 0 && backdrops.length > 0) {
                    backdrops.forEach(backdrop => backdrop.remove());
                }
            });
        },

        // Form handling methods
        handleFormChange() {
            if (this.isDraftMode && this.isComponentReady && !this.isSubmitting) {
                if (this.editMode) {
                    this.hasUnsavedChanges = this.hasDataChanged();
                } else {
                    this.hasUnsavedChanges = true;
                }
                this.saveFormState();
            }
        },

        handleSettingKeyChange() {
            // Auto-set setting type based on selected key
            if (this.formData.setting_key) {
                const selectedKey = this.availableSettingKeys.find(key => key.value === this.formData.setting_key);
                if (selectedKey) {
                    this.formData.setting_type = selectedKey.type;
                }
            }
            this.handleFormChange();
        },

        hasDataChanged() {
            if (!this.originalFormData || !this.formData) return false;
            return JSON.stringify(this.formData) !== JSON.stringify(this.originalFormData);
        },

        // Form validation
        validateForm() {
            let isValid = true;
            this.validationErrors = {};

            // Required field validation
            if (!this.formData.setting_key) {
                this.validationErrors.setting_key = 'Setting key is required';
                isValid = false;
            }

            if (!this.formData.setting_value && this.formData.setting_value !== 0) {
                this.validationErrors.setting_value = 'Setting value is required';
                isValid = false;
            }

            if (!this.formData.setting_type) {
                this.validationErrors.setting_type = 'Setting type is required';
                isValid = false;
            }

            if (!this.formData.effective_year) {
                this.validationErrors.effective_year = 'Effective year is required';
                isValid = false;
            }

            // Value validation based on type
            const value = parseFloat(this.formData.setting_value);
            if (this.formData.setting_type === 'RATE') {
                if (value < 0 || value > 100) {
                    this.validationErrors.setting_value = 'Rate must be between 0 and 100';
                    isValid = false;
                }
            } else if (value < 0) {
                this.validationErrors.setting_value = 'Value cannot be negative';
                isValid = false;
            }

            // Year validation
            const year = parseInt(this.formData.effective_year);
            if (year < this.currentYear - 5 || year > this.currentYear + 10) {
                this.validationErrors.effective_year = `Year must be between ${this.currentYear - 5} and ${this.currentYear + 10}`;
                isValid = false;
            }

            return isValid;
        },

        // Form submission
        async handleSubmit() {
            if (!this.validateForm()) {
                this.alertMessage = 'Please fix the validation errors before submitting.';
                this.alertClass = 'alert-danger';
                return;
            }

            this.isSubmitting = true;
            this.alertMessage = '';

            try {
                // Emit submit event to parent
                this.$emit('submit', { ...this.formData });

                // Clear draft on successful submission
                this.clearFormDraft();
                this.hasUnsavedChanges = false;
                this.isDraftMode = false;

                message.success(this.editMode ? 'Tax setting updated successfully' : 'Tax setting created successfully');

                this.resetForm();
                if (this.modalInstance) {
                    this.modalInstance.hide();
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                this.alertMessage = error.message || 'An error occurred while saving the tax setting.';
                this.alertClass = 'alert-danger';
            } finally {
                this.isSubmitting = false;
            }
        },

        resetForm() {
            this.formData = {
                id: null,
                setting_key: '',
                setting_value: '',
                setting_type: 'DEDUCTION',
                description: '',
                effective_year: new Date().getFullYear(),
                is_active: true
            };
            this.originalFormData = {};
            this.validationErrors = {};
            this.alertMessage = '';
            this.alertClass = '';
            this.hasUnsavedChanges = false;
            this.restoredDataNotification.show = false;
            this.restoredDataNotification.timestamp = null;
            this.isDraftMode = false;
            this.clearFormDraft();
        },

        // Form persistence methods
        saveFormState() {
            if (this.isDestroyed || !this.isComponentReady) return;

            try {
                const draftData = {
                    formData: { ...this.formData },
                    originalFormData: { ...this.originalFormData },
                    editMode: this.editMode,
                    timestamp: Date.now()
                };

                const key = this.editMode ? `taxSettingEditForm_${this.formData.id}` : 'taxSettingForm';
                this.formPersistenceStore.saveFormSection('taxSettings', key, draftData);
                console.log('💾 Tax setting form draft saved automatically');
            } catch (error) {
                console.error('❌ Error saving tax setting form draft:', error);
            }
        },

        loadFormDraft() {
            try {
                const savedData = this.formPersistenceStore.checkForSavedData('taxSettings');

                if (savedData.hasSavedData) {
                    const key = this.editMode ? `taxSettingEditForm_${this.formData.id}` : 'taxSettingForm';
                    const parsed = savedData.data[key];

                    if (parsed) {
                        const isRecent = (Date.now() - parsed.timestamp) < (24 * 60 * 60 * 1000);

                        if (isRecent) {
                            console.log('📄 Loading saved tax setting form draft');

                            this.formData = { ...parsed.formData };
                            this.originalFormData = { ...parsed.originalFormData };

                            this.hasUnsavedChanges = this.editMode ? this.hasDataChanged() : true;
                            this.restoredDataNotification.show = true;
                            this.restoredDataNotification.timestamp = parsed.timestamp;
                            return true;
                        } else {
                            this.clearFormDraft();
                        }
                    }
                }
            } catch (error) {
                console.error('❌ Error loading tax setting form draft:', error);
                this.clearFormDraft();
            }
            return false;
        },

        clearFormDraft() {
            try {
                const key = this.editMode ? `taxSettingEditForm_${this.formData.id}` : 'taxSettingForm';
                this.formPersistenceStore.clearFormSection('taxSettings', key);
                console.log('🗑️ Tax setting form draft cleared');
            } catch (error) {
                console.error('❌ Error clearing tax setting form draft:', error);
            }
        },

        // Helper methods
        formatRestoredTime(timestamp) {
            if (!timestamp) return 'earlier';
            return this.getTimeAgo(timestamp);
        },

        getTimeAgo(timestamp) {
            const seconds = Math.floor((Date.now() - timestamp) / 1000);

            if (seconds < 60) return 'just now';
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
        },

        getSelectedSettingLabel() {
            const selectedKey = this.availableSettingKeys.find(key => key.value === this.formData.setting_key);
            return selectedKey ? selectedKey.label : this.formData.setting_key;
        },

        getSelectedSettingType() {
            const selectedType = this.availableSettingTypes.find(type => type.value === this.selectedSettingType);
            return selectedType ? selectedType.label : this.selectedSettingType;
        },

        formatSettingValue() {
            const value = parseFloat(this.formData.setting_value);
            if (isNaN(value)) return '';

            if (this.selectedSettingType === 'RATE') {
                return `${value}%`;
            } else if (this.selectedSettingType === 'DEDUCTION' || this.selectedSettingType === 'LIMIT') {
                return `฿${value.toLocaleString('en-US')}`;
            }
            return value.toString();
        },

        getSettingValuePlaceholder() {
            switch (this.selectedSettingType) {
                case 'RATE':
                    return 'Enter percentage (e.g., 5.00)';
                case 'DEDUCTION':
                    return 'Enter deduction amount';
                case 'LIMIT':
                    return 'Enter limit amount';
                default:
                    return 'Enter value';
            }
        },

        getSettingValueHint() {
            switch (this.selectedSettingType) {
                case 'RATE':
                    return 'Enter as percentage (0-100)';
                case 'DEDUCTION':
                    return 'Amount that reduces taxable income';
                case 'LIMIT':
                    return 'Maximum or minimum limit amount';
                default:
                    return '';
            }
        },

        getSettingTypeBadgeClass() {
            switch (this.selectedSettingType) {
                case 'RATE':
                    return 'badge-warning';
                case 'DEDUCTION':
                    return 'badge-success';
                case 'LIMIT':
                    return 'badge-info';
                default:
                    return 'badge-secondary';
            }
        }
    }
};
</script>

<style scoped>
.modal-content {
    padding: 20px;
}

.alert {
    margin-bottom: 15px;
}

.alert-dismissible .btn-close {
    padding: 0.5rem;
}

.alert-info {
    background-color: #e7f3ff;
    border-color: #b3d9ff;
    color: #004085;
}

.form-check-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.form-check {
    margin-bottom: 0;
}

.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    border: 1px solid rgba(0, 0, 0, 0.125);
}

.badge {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
}

.badge-success {
    background-color: #28a745;
    color: white;
}

.badge-warning {
    background-color: #ffc107;
    color: #212529;
}

.badge-info {
    background-color: #17a2b8;
    color: white;
}

.badge-secondary {
    background-color: #6c757d;
    color: white;
}

.btn {
    transition: all 0.15s ease-in-out;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

/* Custom styles for Ant Design confirm dialogs */
:deep(.ant-modal-confirm .ant-modal-body) {
    padding: 24px 24px 16px 24px;
}

:deep(.ant-modal-confirm .ant-modal-confirm-title) {
    font-weight: 600;
    font-size: 16px;
    color: #262626;
}

:deep(.ant-modal-confirm .ant-modal-confirm-content) {
    margin-top: 8px;
    font-size: 14px;
    color: #595959;
}

:deep(.ant-modal-confirm .ant-btn) {
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
    border-radius: 6px;
}

:deep(.ant-modal-confirm .ant-btn-primary) {
    background: #1890ff;
    border-color: #1890ff;
}

:deep(.ant-modal-confirm .ant-btn-danger) {
    background: #ff4d4f;
    border-color: #ff4d4f;
}

.fade {
    transition: opacity 0.15s linear;
}

.fade.show {
    opacity: 1;
}
</style>
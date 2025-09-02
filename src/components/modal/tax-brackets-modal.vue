<template>
    <div class="modal fade" id="taxBracketsModal" tabindex="-1" aria-labelledby="taxBracketsModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="taxBracketsModalLabel">{{ editMode ? 'Edit' : 'Add' }} Tax Bracket</h5>
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
                                    <label for="minIncome" class="form-label">Minimum Income <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <span class="input-group-text">฿</span>
                                        <input type="number" class="form-control"
                                            :class="{ 'is-invalid': validationErrors.min_income }" id="minIncome"
                                            v-model="formData.min_income" required @input="handleFormChange" step="0.01"
                                            min="0" placeholder="0.00" />
                                    </div>
                                    <div v-if="validationErrors.min_income" class="invalid-feedback">
                                        {{ validationErrors.min_income }}
                                    </div>
                                    <div class="form-text">
                                        <small>Starting income amount for this tax bracket</small>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="maxIncome" class="form-label">Maximum Income</label>
                                    <div class="input-group">
                                        <span class="input-group-text">฿</span>
                                        <input type="number" class="form-control"
                                            :class="{ 'is-invalid': validationErrors.max_income }" id="maxIncome"
                                            v-model="formData.max_income" @input="handleFormChange" step="0.01"
                                            :min="parseFloat(formData.min_income) + 0.01"
                                            placeholder="Leave empty for unlimited" />
                                    </div>
                                    <div v-if="validationErrors.max_income" class="invalid-feedback">
                                        {{ validationErrors.max_income }}
                                    </div>
                                    <div class="form-text">
                                        <small>Leave empty for the highest bracket (no upper limit)</small>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="taxRate" class="form-label">Tax Rate <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="number" class="form-control"
                                            :class="{ 'is-invalid': validationErrors.tax_rate }" id="taxRate"
                                            v-model="formData.tax_rate" required @input="handleFormChange" step="0.01"
                                            min="0" max="100" placeholder="0.00" />
                                        <span class="input-group-text">%</span>
                                    </div>
                                    <div v-if="validationErrors.tax_rate" class="invalid-feedback">
                                        {{ validationErrors.tax_rate }}
                                    </div>
                                    <div class="form-text">
                                        <small>Tax rate as percentage (0-100)</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="bracketOrder" class="form-label">Bracket Order <span
                                            class="text-danger">*</span></label>
                                    <input type="number" class="form-control"
                                        :class="{ 'is-invalid': validationErrors.bracket_order }" id="bracketOrder"
                                        v-model="formData.bracket_order" required @input="handleFormChange" min="1"
                                        placeholder="1" />
                                    <div v-if="validationErrors.bracket_order" class="invalid-feedback">
                                        {{ validationErrors.bracket_order }}
                                    </div>
                                    <div class="form-text">
                                        <small>Order of this bracket (1 = lowest income bracket)</small>
                                    </div>
                                </div>

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
                                        <small>Year when this bracket becomes effective ({{ currentYear - 5 }} - {{
                                            currentYear + 10 }})</small>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="isActive"
                                            v-model="formData.is_active" @change="handleFormChange">
                                        <label class="form-check-label" for="isActive">
                                            Active Bracket
                                        </label>
                                    </div>
                                    <div class="form-text">
                                        <small>Only active brackets are used in tax calculations</small>
                                    </div>
                                </div>

                                <!-- Quick Tax Calculation -->
                                <div class="card bg-light">
                                    <div class="card-header">
                                        <h6 class="card-title mb-0">Quick Tax Calculator</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-2">
                                            <label for="testIncome" class="form-label small">Test Income:</label>
                                            <div class="input-group input-group-sm">
                                                <span class="input-group-text">฿</span>
                                                <input type="number" class="form-control" id="testIncome"
                                                    v-model="testIncome" @input="calculateQuickTax" step="1000"
                                                    placeholder="Enter amount to test">
                                            </div>
                                        </div>
                                        <div v-if="quickTaxResult" class="small">
                                            <div class="d-flex justify-content-between">
                                                <span>Tax for this bracket:</span>
                                                <strong class="text-primary">{{ formatCurrency(quickTaxResult)
                                                }}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Preview Card -->
                        <div v-if="formData.min_income !== '' && formData.tax_rate !== ''" class="row">
                            <div class="col-12">
                                <div class="card border-primary">
                                    <div class="card-header bg-primary text-white">
                                        <h6 class="card-title mb-0">Bracket Preview</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="text-center">
                                                    <div class="text-muted small">Income Range</div>
                                                    <div class="fw-bold text-primary">{{ formatIncomeRange() }}</div>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="text-center">
                                                    <div class="text-muted small">Tax Rate</div>
                                                    <div class="fw-bold text-success">{{ formData.tax_rate }}%</div>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="text-center">
                                                    <div class="text-muted small">Order</div>
                                                    <div class="fw-bold">{{ formData.bracket_order }}</div>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="text-center">
                                                    <div class="text-muted small">Year</div>
                                                    <div class="fw-bold">{{ formData.effective_year }}</div>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="text-center">
                                                    <div class="text-muted small">Status</div>
                                                    <span class="badge"
                                                        :class="formData.is_active ? 'badge-success' : 'badge-secondary'">
                                                        {{ formData.is_active ? 'Active' : 'Inactive' }}
                                                    </span>
                                                </div>
                                            </div>
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
                                        rows="2" @input="handleFormChange"
                                        placeholder="Enter a description for this tax bracket..."></textarea>
                                    <div class="form-text">
                                        <small>Optional description to explain this tax bracket</small>
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
                                {{ editMode ? 'Update Bracket' : 'Save Bracket' }}
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
import { taxBracketsService } from '@/services/tax-brackets.service';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';

export default {
    name: 'TaxBracketsModal',
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
                min_income: '',
                max_income: '',
                tax_rate: '',
                bracket_order: '',
                effective_year: new Date().getFullYear(),
                is_active: true,
                description: ''
            },
            originalFormData: {},

            // Current year for validation
            currentYear: new Date().getFullYear(),

            // Quick tax calculation
            testIncome: '',
            quickTaxResult: 0
        };
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
            // Initialize stores
            this.formPersistenceStore = useFormPersistenceStore();
            this.isComponentReady = true;
        } catch (error) {
            console.error('Error during component initialization:', error);
        }
    },

    mounted() {
        // Initialize Bootstrap modal
        const modalElement = document.getElementById('taxBracketsModal');
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

            console.log('📝 Tax Brackets modal ready for input - isDraftMode:', this.isDraftMode);
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
                    createVNode('p', { style: 'margin-bottom: 12px; color: #666;' }, 'You have unsaved changes in the tax bracket form.'),
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
                            const modalEl = document.getElementById('taxBracketsModal');
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

            // Recalculate quick tax when form changes
            this.calculateQuickTax();
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
            if (!this.formData.min_income && this.formData.min_income !== 0) {
                this.validationErrors.min_income = 'Minimum income is required';
                isValid = false;
            }

            if (!this.formData.tax_rate && this.formData.tax_rate !== 0) {
                this.validationErrors.tax_rate = 'Tax rate is required';
                isValid = false;
            }

            if (!this.formData.bracket_order) {
                this.validationErrors.bracket_order = 'Bracket order is required';
                isValid = false;
            }

            if (!this.formData.effective_year) {
                this.validationErrors.effective_year = 'Effective year is required';
                isValid = false;
            }

            // Numeric validation
            const minIncome = parseFloat(this.formData.min_income);
            const maxIncome = parseFloat(this.formData.max_income);
            const taxRate = parseFloat(this.formData.tax_rate);
            const bracketOrder = parseInt(this.formData.bracket_order);
            const effectiveYear = parseInt(this.formData.effective_year);

            if (minIncome < 0) {
                this.validationErrors.min_income = 'Minimum income cannot be negative';
                isValid = false;
            }

            if (this.formData.max_income && maxIncome <= minIncome) {
                this.validationErrors.max_income = 'Maximum income must be greater than minimum income';
                isValid = false;
            }

            if (taxRate < 0 || taxRate > 100) {
                this.validationErrors.tax_rate = 'Tax rate must be between 0 and 100';
                isValid = false;
            }

            if (bracketOrder < 1) {
                this.validationErrors.bracket_order = 'Bracket order must be at least 1';
                isValid = false;
            }

            if (effectiveYear < this.currentYear - 5 || effectiveYear > this.currentYear + 10) {
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

                message.success(this.editMode ? 'Tax bracket updated successfully' : 'Tax bracket created successfully');

                this.resetForm();
                if (this.modalInstance) {
                    this.modalInstance.hide();
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                this.alertMessage = error.message || 'An error occurred while saving the tax bracket.';
                this.alertClass = 'alert-danger';
            } finally {
                this.isSubmitting = false;
            }
        },

        resetForm() {
            this.formData = {
                id: null,
                min_income: '',
                max_income: '',
                tax_rate: '',
                bracket_order: '',
                effective_year: new Date().getFullYear(),
                is_active: true,
                description: ''
            };
            this.originalFormData = {};
            this.validationErrors = {};
            this.alertMessage = '';
            this.alertClass = '';
            this.hasUnsavedChanges = false;
            this.restoredDataNotification.show = false;
            this.restoredDataNotification.timestamp = null;
            this.isDraftMode = false;
            this.testIncome = '';
            this.quickTaxResult = 0;
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

                const key = this.editMode ? `taxBracketEditForm_${this.formData.id}` : 'taxBracketForm';
                if (this.formPersistenceStore && typeof this.formPersistenceStore.saveFormSection === 'function') {
                    this.formPersistenceStore.saveFormSection('taxBrackets', key, draftData);
                    console.log('💾 Tax bracket form draft saved automatically');
                } else {
                    console.warn('⚠️ FormPersistenceStore not available, skipping draft save');
                }
            } catch (error) {
                console.error('❌ Error saving tax bracket form draft:', error);
            }
        },

        loadFormDraft() {
            try {
                if (!this.formPersistenceStore || typeof this.formPersistenceStore.checkForSavedData !== 'function') {
                    console.warn('⚠️ FormPersistenceStore not available, skipping draft load');
                    return false;
                }

                const savedData = this.formPersistenceStore.checkForSavedData('taxBrackets');

                if (savedData.hasSavedData) {
                    const key = this.editMode ? `taxBracketEditForm_${this.formData.id}` : 'taxBracketForm';
                    const parsed = savedData.data[key];

                    if (parsed) {
                        const isRecent = (Date.now() - parsed.timestamp) < (24 * 60 * 60 * 1000);

                        if (isRecent) {
                            console.log('📄 Loading saved tax bracket form draft');

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
                console.error('❌ Error loading tax bracket form draft:', error);
                this.clearFormDraft();
            }
            return false;
        },

        clearFormDraft() {
            try {
                if (this.formPersistenceStore && typeof this.formPersistenceStore.clearFormSection === 'function') {
                    const key = this.editMode ? `taxBracketEditForm_${this.formData.id}` : 'taxBracketForm';
                    this.formPersistenceStore.clearFormSection('taxBrackets', key);
                    console.log('🗑️ Tax bracket form draft cleared');
                } else {
                    console.warn('⚠️ FormPersistenceStore not available, skipping draft clear');
                }
            } catch (error) {
                console.error('❌ Error clearing tax bracket form draft:', error);
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

        formatIncomeRange() {
            const minIncome = parseFloat(this.formData.min_income);
            const maxIncome = parseFloat(this.formData.max_income);

            if (isNaN(minIncome)) return '';

            const formatCurrency = (amount) => {
                return `฿${amount.toLocaleString('en-US')}`;
            };

            if (!this.formData.max_income || isNaN(maxIncome)) {
                return `${formatCurrency(minIncome)}+`;
            }

            return `${formatCurrency(minIncome)} - ${formatCurrency(maxIncome)}`;
        },

        formatCurrency(amount) {
            if (!amount && amount !== 0) return '฿0.00';
            return `฿${amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        },

        // Quick tax calculation
        calculateQuickTax() {
            if (!this.testIncome || !this.formData.min_income || !this.formData.tax_rate) {
                this.quickTaxResult = 0;
                return;
            }

            const income = parseFloat(this.testIncome);
            const minIncome = parseFloat(this.formData.min_income);
            const maxIncome = parseFloat(this.formData.max_income);
            const taxRate = parseFloat(this.formData.tax_rate) / 100;

            if (income < minIncome) {
                this.quickTaxResult = 0;
                return;
            }

            let taxableInBracket = income - minIncome;

            if (this.formData.max_income && !isNaN(maxIncome)) {
                taxableInBracket = Math.min(taxableInBracket, maxIncome - minIncome);
            }

            this.quickTaxResult = taxableInBracket * taxRate;
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

.border-primary {
    border-color: #0d6efd !important;
}

.bg-primary {
    background-color: #0d6efd !important;
}

.text-primary {
    color: #0d6efd !important;
}

.text-success {
    color: #28a745 !important;
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

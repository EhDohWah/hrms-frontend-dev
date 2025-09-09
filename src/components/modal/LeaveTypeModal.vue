<template>
    <!-- Add/Edit Leave Type Modal -->
    <div v-if="show" class="modal fade show d-block" id="add_leave_type" tabindex="-1" aria-labelledby="add_leave_type"
        style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{ isEditing ? 'Edit' : 'Add' }} Leave Type</h4>
                    <button type="button" class="btn-close custom-btn-close" aria-label="Close" @click="$emit('close')">
                        <i class="ti ti-x"></i>
                    </button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body pb-0">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Leave Type Name <span class="text-danger">*</span>
                                    </label>
                                    <input type="text" class="form-control" :class="{ 'is-invalid': errors.name }"
                                        v-model="form.name" placeholder="Enter leave type name" required />
                                    <div v-if="errors.name" class="invalid-feedback">
                                        {{ errors.name }}
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Default Duration (Days)
                                    </label>
                                    <input type="number" class="form-control"
                                        :class="{ 'is-invalid': errors.defaultDuration }"
                                        v-model.number="form.defaultDuration" placeholder="Enter default duration"
                                        min="0" step="0.5" />
                                    <div v-if="errors.defaultDuration" class="invalid-feedback">
                                        {{ errors.defaultDuration }}
                                    </div>
                                    <small class="text-muted">Optional: Default number of days for this leave
                                        type</small>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Requires Attachment
                                    </label>
                                    <div class="d-flex align-items-center mt-2">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="requiresAttachment"
                                                v-model="form.requiresAttachment" />
                                            <label class="form-check-label" for="requiresAttachment">
                                                {{ form.requiresAttachment ? 'Yes' : 'No' }}
                                            </label>
                                        </div>
                                    </div>
                                    <small class="text-muted">Whether this leave type requires document
                                        attachments</small>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Description
                                    </label>
                                    <textarea class="form-control" :class="{ 'is-invalid': errors.description }"
                                        v-model="form.description" rows="3"
                                        placeholder="Enter description for this leave type"></textarea>
                                    <div v-if="errors.description" class="invalid-feedback">
                                        {{ errors.description }}
                                    </div>
                                    <small class="text-muted">Optional: Provide additional details about this leave
                                        type</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light me-2" @click="$emit('close')">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="isSaving">
                            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                            {{ isEditing ? 'Update' : 'Add' }} Leave Type
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LeaveTypeModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isEditing: {
            type: Boolean,
            default: false
        },
        leaveType: {
            type: Object,
            default: null
        }
    },
    emits: ['close', 'save'],
    data() {
        return {
            form: {
                name: '',
                defaultDuration: null,
                description: '',
                requiresAttachment: false
            },
            errors: {},
            isSaving: false
        };
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.resetForm();
                if (this.isEditing && this.leaveType) {
                    this.populateForm();
                }
            }
        },
        leaveType: {
            handler() {
                if (this.isEditing && this.leaveType) {
                    this.populateForm();
                }
            },
            deep: true
        }
    },
    methods: {
        resetForm() {
            this.form = {
                name: '',
                defaultDuration: null,
                description: '',
                requiresAttachment: false
            };
            this.errors = {};
            this.isSaving = false;
        },

        populateForm() {
            if (this.leaveType) {
                this.form = {
                    name: this.leaveType.name || '',
                    defaultDuration: this.leaveType.defaultDuration || null,
                    description: this.leaveType.description || '',
                    requiresAttachment: this.leaveType.requiresAttachment || false
                };
            }
        },

        validateForm() {
            this.errors = {};
            let isValid = true;

            // Required fields
            if (!this.form.name?.trim()) {
                this.errors.name = 'Leave type name is required';
                isValid = false;
            } else if (this.form.name.length > 100) {
                this.errors.name = 'Leave type name must not exceed 100 characters';
                isValid = false;
            }

            // Optional validations
            if (this.form.defaultDuration !== null && this.form.defaultDuration < 0) {
                this.errors.defaultDuration = 'Default duration cannot be negative';
                isValid = false;
            }

            if (this.form.description && this.form.description.length > 1000) {
                this.errors.description = 'Description must not exceed 1000 characters';
                isValid = false;
            }

            return isValid;
        },

        async handleSubmit() {
            if (!this.validateForm()) {
                return;
            }

            this.isSaving = true;

            try {
                // Prepare data for API
                const leaveTypeData = {
                    name: this.form.name.trim(),
                    defaultDuration: this.form.defaultDuration || undefined,
                    description: this.form.description?.trim() || undefined,
                    requiresAttachment: this.form.requiresAttachment
                };

                // Emit save event to parent
                this.$emit('save', leaveTypeData);
            } catch (error) {
                console.error('Error preparing leave type data:', error);
            } finally {
                this.isSaving = false;
            }
        },

        closeModal() {
            this.resetForm();
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.form-check-input:checked {
    background-color: #6c5ce7;
    border-color: #6c5ce7;
}

.text-muted {
    font-size: 0.875em;
}

.is-invalid {
    border-color: #dc3545;
}

.invalid-feedback {
    display: block;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 0.875em;
    color: #dc3545;
}

.modal-lg {
    max-width: 600px;
}

.form-switch .form-check-input {
    width: 2.5em;
    height: 1.25em;
}
</style>

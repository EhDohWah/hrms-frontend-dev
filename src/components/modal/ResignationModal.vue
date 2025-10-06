<template>
    <!-- Add/Edit Resignation Modal -->
    <div v-if="show" class="modal fade show d-block" id="add_resignation" tabindex="-1"
        aria-labelledby="add_resignation" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{ isEditing ? 'Edit' : 'Add' }} Resignation</h4>
                    <button type="button" class="btn-close custom-btn-close" aria-label="Close" @click="$emit('close')">
                        <i class="ti ti-x"></i>
                    </button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body pb-0">
                        <div class="row">
                            <!-- Employee Selection -->
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Employee <span class="text-danger">*</span></label>
                                <div class="position-relative">
                                    <input type="text" class="form-control" v-model="employeeSearchQuery"
                                        :class="{ 'is-invalid': errors.employeeId }" placeholder="Search employee..."
                                        @input="searchEmployees" @focus="showEmployeeDropdown = true"
                                        @blur="hideEmployeeDropdown" autocomplete="off" />
                                    <div v-if="showEmployeeDropdown && filteredEmployees.length > 0"
                                        class="dropdown-menu show position-absolute w-100" style="z-index: 1050;">
                                        <a href="javascript:void(0);" v-for="employee in filteredEmployees"
                                            :key="employee.id" class="dropdown-item"
                                            @mousedown.prevent="selectEmployee(employee)">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{{ employee.name }}</strong>
                                                    <small class="text-muted d-block">{{ employee.staffId }} - {{
                                                        employee.subsidiary }}</small>
                                                    <small class="text-muted">{{ employee.department }} - {{
                                                        employee.position }}</small>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div v-if="errors.employeeId" class="invalid-feedback">{{ errors.employeeId }}</div>
                            </div>

                            <!-- Department (Auto-filled) -->
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Department</label>
                                <input type="text" class="form-control" :value="selectedEmployee?.department || ''"
                                    readonly disabled />
                            </div>

                            <!-- Position (Auto-filled) -->
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Position</label>
                                <input type="text" class="form-control" :value="selectedEmployee?.position || ''"
                                    readonly disabled />
                            </div>

                            <!-- Resignation Date -->
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Resignation Date <span class="text-danger">*</span></label>
                                <div class="input-icon-end position-relative">
                                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                                        :editable="true" :clearable="false" :input-format="displayFormat"
                                        v-model="form.resignationDate" :class="{ 'is-invalid': errors.resignationDate }"
                                        @update:model-value="handleDateChange('resignationDate', $event)" />
                                    <span class="input-icon-addon">
                                        <i class="ti ti-calendar text-gray-7"></i>
                                    </span>
                                </div>
                                <div v-if="errors.resignationDate" class="invalid-feedback">{{ errors.resignationDate }}
                                </div>
                            </div>

                            <!-- Last Working Date -->
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Last Working Date <span class="text-danger">*</span></label>
                                <div class="input-icon-end position-relative">
                                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                                        :editable="true" :clearable="false" :input-format="displayFormat"
                                        v-model="form.lastWorkingDate" :class="{ 'is-invalid': errors.lastWorkingDate }"
                                        @update:model-value="handleDateChange('lastWorkingDate', $event)" />
                                    <span class="input-icon-addon">
                                        <i class="ti ti-calendar text-gray-7"></i>
                                    </span>
                                </div>
                                <div v-if="errors.lastWorkingDate" class="invalid-feedback">{{ errors.lastWorkingDate }}
                                </div>
                            </div>

                            <!-- Notice Period (Calculated) -->
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Notice Period</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" :value="noticePeriodText" readonly
                                        disabled />
                                    <span class="input-group-text">days</span>
                                </div>
                                <small class="text-muted">Automatically calculated from dates above</small>
                            </div>

                            <!-- Resignation Reason -->
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Resignation Reason <span class="text-danger">*</span></label>
                                <select class="form-select" v-model="form.reason"
                                    :class="{ 'is-invalid': errors.reason }">
                                    <option value="">Select reason...</option>
                                    <option v-for="reason in resignationReasons" :key="reason" :value="reason">{{
                                        reason }}</option>
                                </select>
                                <div v-if="errors.reason" class="invalid-feedback">{{ errors.reason }}</div>
                            </div>

                            <!-- Reason Details -->
                            <div class="col-12 mb-3">
                                <label class="form-label">Reason Details</label>
                                <textarea class="form-control" v-model="form.reasonDetails" rows="3"
                                    :class="{ 'is-invalid': errors.reasonDetails }"
                                    placeholder="Additional details about the resignation..."
                                    maxlength="1000"></textarea>
                                <div class="d-flex justify-content-between">
                                    <div v-if="errors.reasonDetails" class="invalid-feedback">{{ errors.reasonDetails }}
                                    </div>
                                    <small class="text-muted">{{ form.reasonDetails?.length || 0 }}/1000
                                        characters</small>
                                </div>
                            </div>

                            <!-- Acknowledgement Status (for editing) -->
                            <div v-if="isEditing" class="col-md-6 mb-3">
                                <label class="form-label">Acknowledgement Status</label>
                                <select class="form-select" v-model="form.acknowledgementStatus">
                                    <option v-for="status in acknowledgementStatusOptions" :key="status.value"
                                        :value="status.value">{{ status.label }}</option>
                                </select>
                            </div>

                            <!-- Current Status Badge (for editing) -->
                            <div v-if="isEditing && form.acknowledgementStatus" class="col-md-6 mb-3">
                                <label class="form-label">Current Status</label>
                                <div class="mt-2">
                                    <span :class="getStatusConfig(form.acknowledgementStatus).class">
                                        <i :class="getStatusConfig(form.acknowledgementStatus).icon + ' me-1'"></i>
                                        {{ getStatusConfig(form.acknowledgementStatus).label }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Validation Summary -->
                        <div v-if="hasValidationIssues" class="alert alert-warning">
                            <h6 class="alert-heading">
                                <i class="ti ti-alert-triangle me-1"></i>
                                Please check the following:
                            </h6>
                            <ul class="mb-0">
                                <li v-if="!isValidDateSequence">Last working date must be on or after resignation date
                                </li>
                                <li v-if="noticePeriod < 0">Notice period cannot be negative</li>
                            </ul>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" @click="$emit('close')" :disabled="isSaving">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="isSaving || hasValidationIssues">
                            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                            {{ isEditing ? 'Update Resignation' : 'Add Resignation' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { resignationService } from '@/services/resignation.service';
import { statusUtils, reasonUtils, dateUtils, validationUtils } from '@/utils/resignation.utils';

export default {
    name: 'ResignationModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isEditing: {
            type: Boolean,
            default: false
        },
        resignation: {
            type: Object,
            default: null
        }
    },
    emits: ['close', 'save'],
    data() {
        return {
            form: {
                employeeId: '',
                departmentId: '',
                positionId: '',
                resignationDate: '',
                lastWorkingDate: '',
                reason: '',
                reasonDetails: '',
                acknowledgementStatus: 'Pending'
            },
            errors: {},
            isSaving: false,

            // Employee search
            employeeSearchQuery: '',
            employees: [],
            filteredEmployees: [],
            showEmployeeDropdown: false,
            selectedEmployee: null,

            // Static data
            resignationReasons: reasonUtils.getResignationReasons(),
            acknowledgementStatusOptions: statusUtils.getAcknowledgementStatusOptions(),

            // Date picker format
            displayFormat: 'dd/MM/yyyy',
            inputFormat: 'yyyy-MM-dd'
        };
    },
    computed: {
        noticePeriod() {
            if (!this.form.resignationDate || !this.form.lastWorkingDate) return 0;
            return dateUtils.calculateNoticePeriod(this.form.resignationDate, this.form.lastWorkingDate);
        },
        noticePeriodText() {
            if (this.noticePeriod <= 0) return 'Invalid dates';
            return this.noticePeriod.toString();
        },
        isValidDateSequence() {
            if (!this.form.resignationDate || !this.form.lastWorkingDate) return true;
            return dateUtils.isValidDateSequence(this.form.resignationDate, this.form.lastWorkingDate);
        },
        hasValidationIssues() {
            return !this.isValidDateSequence || this.noticePeriod < 0;
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.resetForm();
                this.loadEmployees();
                if (this.isEditing && this.resignation) {
                    this.populateForm();
                }
            }
        },
        resignation: {
            handler() {
                if (this.isEditing && this.resignation) {
                    this.populateForm();
                }
            },
            deep: true
        }
    },
    methods: {
        // Handle date picker changes
        handleDateChange(fieldName, newValue) {
            try {
                const safeDate = this.safeConvertToDate(newValue);
                this.form[fieldName] = safeDate;
                this.calculateNoticePeriod();
            } catch (error) {
                console.error('Error handling date change:', error);
            }
        },

        // Safe date conversion helper
        safeConvertToDate(dateValue) {
            if (!dateValue) return null;

            try {
                if (dateValue instanceof Date) {
                    return isNaN(dateValue.getTime()) ? null : dateValue;
                }

                if (typeof dateValue === 'string') {
                    const parsedDate = new Date(dateValue);
                    return isNaN(parsedDate.getTime()) ? null : parsedDate;
                }

                return null;
            } catch (error) {
                console.error('Error converting date:', error);
                return null;
            }
        },

        resetForm() {
            this.form = {
                employeeId: '',
                departmentId: '',
                positionId: '',
                resignationDate: '',
                lastWorkingDate: '',
                reason: '',
                reasonDetails: '',
                acknowledgementStatus: 'Pending'
            };
            this.errors = {};
            this.employeeSearchQuery = '';
            this.selectedEmployee = null;
            this.showEmployeeDropdown = false;
            this.isSaving = false;
        },

        populateForm() {
            if (!this.resignation) return;

            this.form = {
                employeeId: this.resignation.employeeId,
                departmentId: this.resignation.departmentId,
                positionId: this.resignation.positionId,
                resignationDate: this.resignation.resignationDate,
                lastWorkingDate: this.resignation.lastWorkingDate,
                reason: this.resignation.reason,
                reasonDetails: this.resignation.reasonDetails || '',
                acknowledgementStatus: this.resignation.acknowledgementStatus || 'Pending'
            };

            // Set selected employee data
            if (this.resignation.employee) {
                this.selectedEmployee = this.resignation.employee;
                this.employeeSearchQuery = this.resignation.employee.name;
            }
        },

        async loadEmployees() {
            try {
                const response = await resignationService.searchEmployees();
                if (response.success) {
                    this.employees = response.data;
                }
            } catch (error) {
                console.error('Error loading employees:', error);
            }
        },

        async searchEmployees() {
            if (this.employeeSearchQuery.length < 2) {
                this.filteredEmployees = [];
                return;
            }

            try {
                const response = await resignationService.searchEmployees(this.employeeSearchQuery);
                if (response.success) {
                    this.filteredEmployees = response.data.slice(0, 10); // Limit to 10 results
                }
            } catch (error) {
                console.error('Error searching employees:', error);
                this.filteredEmployees = [];
            }
        },

        selectEmployee(employee) {
            this.selectedEmployee = employee;
            this.form.employeeId = employee.id;
            this.employeeSearchQuery = employee.name;
            this.showEmployeeDropdown = false;
            this.filteredEmployees = [];

            // Clear employee error if exists
            if (this.errors.employeeId) {
                delete this.errors.employeeId;
            }
        },

        hideEmployeeDropdown() {
            setTimeout(() => {
                this.showEmployeeDropdown = false;
            }, 200);
        },

        calculateNoticePeriod() {
            // This is handled by the computed property
            // Just trigger reactivity
            this.$nextTick(() => {
                this.$forceUpdate();
            });
        },

        getStatusConfig(status) {
            return statusUtils.getAcknowledgementStatusConfig(status);
        },

        async validateForm() {
            try {
                const validation = await resignationService.validateResignation(this.form);
                this.errors = validation.errors;
                return validation.isValid && !this.hasValidationIssues;
            } catch (error) {
                console.error('Error validating form:', error);
                return false;
            }
        },

        async handleSubmit() {
            if (this.isSaving) return;

            const isValid = await this.validateForm();
            if (!isValid) return;

            this.isSaving = true;

            try {
                let response;
                if (this.isEditing) {
                    response = await resignationService.updateResignation(this.resignation.id, this.form);
                } else {
                    response = await resignationService.createResignation(this.form);
                }

                if (response.success) {
                    this.$emit('save', response.data);
                    this.$emit('close');
                } else {
                    // Handle validation errors from backend
                    if (response.errors) {
                        this.errors = response.errors;
                    }
                }
            } catch (error) {
                console.error('Error saving resignation:', error);
                // Handle server errors
                this.errors = { general: 'An error occurred while saving. Please try again.' };
            } finally {
                this.isSaving = false;
            }
        }
    }
};
</script>

<style scoped>
.dropdown-menu {
    max-height: 200px;
    overflow-y: auto;
}

.custom-btn-close {
    border: none;
    background: none;
    font-size: 1.2rem;
    padding: 0.5rem;
}

.custom-btn-close:hover {
    background-color: #f8f9fa;
    border-radius: 0.25rem;
}

/* Date picker styling */
.input-icon-end {
    position: relative;
}

.input-icon-addon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #6B7280;
    z-index: 2;
}

.datetimepicker {
    padding-right: 35px !important;
}

:deep(.mx-datepicker) {
    width: 100%;
}

:deep(.mx-input) {
    width: 100% !important;
    padding: 7px 35px 7px 12px !important;
    border-radius: 6px !important;
    border: 1px solid #c9d2e2 !important;
    font-size: 1em !important;
    box-sizing: border-box !important;
    background: #f7f8fa !important;
    outline: none !important;
    transition: border 0.2s !important;
}

:deep(.mx-input:focus) {
    border: 1.5px solid #4a7fff !important;
    background: #fff !important;
}

:deep(.mx-icon-calendar) {
    display: none;
}
</style>

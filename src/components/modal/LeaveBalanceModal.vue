<template>
    <!-- Add/Edit Leave Balance Modal -->
    <div v-if="show" class="modal fade show d-block" id="add_leave_balance" tabindex="-1"
        aria-labelledby="add_leave_balance" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">{{ isEditing ? 'Edit' : 'Add' }} Leave Balance</h4>
                    <button type="button" class="btn-close custom-btn-close" aria-label="Close" @click="$emit('close')">
                        <i class="ti ti-x"></i>
                    </button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body pb-0">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Employee <span class="text-danger">*</span>
                                    </label>
                                    <select class="form-select" :class="{ 'is-invalid': errors.employeeId }"
                                        v-model="form.employeeId" :disabled="isEditing" required>
                                        <option value="">Select Employee</option>
                                        <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                                            {{ getEmployeeName(employee) }} ({{ employee.staffId }})
                                        </option>
                                    </select>
                                    <div v-if="errors.employeeId" class="invalid-feedback">
                                        {{ errors.employeeId }}
                                    </div>
                                    <small v-if="isEditing" class="text-muted">Employee cannot be changed when
                                        editing</small>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Leave Type <span class="text-danger">*</span>
                                    </label>
                                    <select class="form-select" :class="{ 'is-invalid': errors.leaveTypeId }"
                                        v-model="form.leaveTypeId" :disabled="isEditing" required>
                                        <option value="">Select Leave Type</option>
                                        <option v-for="leaveType in leaveTypes" :key="leaveType.id"
                                            :value="leaveType.id">
                                            {{ leaveType.name }}
                                        </option>
                                    </select>
                                    <div v-if="errors.leaveTypeId" class="invalid-feedback">
                                        {{ errors.leaveTypeId }}
                                    </div>
                                    <small v-if="isEditing" class="text-muted">Leave type cannot be changed when
                                        editing</small>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Year <span class="text-danger">*</span>
                                    </label>
                                    <select class="form-select" :class="{ 'is-invalid': errors.year }"
                                        v-model="form.year" :disabled="isEditing" required>
                                        <option value="">Select Year</option>
                                        <option v-for="year in availableYears" :key="year" :value="year">
                                            {{ year }}
                                        </option>
                                    </select>
                                    <div v-if="errors.year" class="invalid-feedback">
                                        {{ errors.year }}
                                    </div>
                                    <small v-if="isEditing" class="text-muted">Year cannot be changed when
                                        editing</small>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Total Days <span class="text-danger">*</span>
                                    </label>
                                    <input type="number" class="form-control"
                                        :class="{ 'is-invalid': errors.totalDays }" v-model.number="form.totalDays"
                                        placeholder="Enter total days" min="0" step="0.5" required
                                        @input="calculateRemainingDays" />
                                    <div v-if="errors.totalDays" class="invalid-feedback">
                                        {{ errors.totalDays }}
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Used Days
                                    </label>
                                    <input type="number" class="form-control" :class="{ 'is-invalid': errors.usedDays }"
                                        v-model.number="form.usedDays" placeholder="Enter used days" min="0" step="0.5"
                                        @input="calculateRemainingDays" />
                                    <div v-if="errors.usedDays" class="invalid-feedback">
                                        {{ errors.usedDays }}
                                    </div>
                                    <small class="text-muted">Days already used by the employee</small>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">Remaining Days</label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" :value="remainingDays" readonly
                                            step="0.5" />
                                        <span class="input-group-text">
                                            <i class="ti ti-calculator"></i>
                                        </span>
                                    </div>
                                    <small class="text-muted">Automatically calculated: Total Days - Used Days</small>
                                </div>
                            </div>

                            <!-- Validation Summary -->
                            <div v-if="hasValidationIssues" class="col-md-12">
                                <div class="alert alert-warning d-flex align-items-center" role="alert">
                                    <i class="ti ti-alert-triangle me-2"></i>
                                    <div>
                                        <strong>Validation Issues:</strong>
                                        <ul class="mb-0 mt-1">
                                            <li v-if="form.usedDays > form.totalDays">
                                                Used days cannot exceed total days
                                            </li>
                                            <li v-if="remainingDays < 0">
                                                Remaining days cannot be negative
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- Balance Summary Card (for editing) -->
                            <div v-if="isEditing && selectedEmployee && selectedLeaveType" class="col-md-12">
                                <div class="card bg-light border-0 mb-3">
                                    <div class="card-body">
                                        <h6 class="card-title mb-3">
                                            <i class="ti ti-info-circle me-2"></i>Balance Summary
                                        </h6>
                                        <div class="balance-items-container">
                                            <div class="balance-item">
                                                <div class="text-center">
                                                    <h4 class="text-primary mb-0">{{ form.totalDays || 0 }}</h4>
                                                    <small class="text-muted">Total Days</small>
                                                </div>
                                            </div>
                                            <div class="balance-item">
                                                <div class="text-center">
                                                    <h4 class="text-warning mb-0">{{ form.usedDays || 0 }}</h4>
                                                    <small class="text-muted">Used Days</small>
                                                </div>
                                            </div>
                                            <div class="balance-item">
                                                <div class="text-center">
                                                    <h4 :class="remainingDays >= 0 ? 'text-success' : 'text-danger'"
                                                        class="mb-0">
                                                        {{ remainingDays }}
                                                    </h4>
                                                    <small class="text-muted">Remaining Days</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light me-2" @click="$emit('close')">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="isSaving || hasValidationIssues">
                            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                            {{ isEditing ? 'Update' : 'Create' }} Leave Balance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LeaveBalanceModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isEditing: {
            type: Boolean,
            default: false
        },
        leaveBalance: {
            type: Object,
            default: null
        },
        employees: {
            type: Array,
            default: () => []
        },
        leaveTypes: {
            type: Array,
            default: () => []
        }
    },
    emits: ['close', 'save'],
    data() {
        return {
            form: {
                employeeId: '',
                leaveTypeId: '',
                totalDays: null,
                usedDays: 0,
                year: new Date().getFullYear()
            },
            errors: {},
            isSaving: false,
            availableYears: []
        };
    },
    computed: {
        remainingDays() {
            const total = parseFloat(this.form.totalDays) || 0;
            const used = parseFloat(this.form.usedDays) || 0;
            return total - used;
        },
        hasValidationIssues() {
            return (
                this.form.usedDays > this.form.totalDays ||
                this.remainingDays < 0
            );
        },
        selectedEmployee() {
            return this.employees.find(emp => emp.id === this.form.employeeId);
        },
        selectedLeaveType() {
            return this.leaveTypes.find(type => type.id === this.form.leaveTypeId);
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.resetForm();
                if (this.isEditing && this.leaveBalance) {
                    this.populateForm();
                }
            }
        },
        leaveBalance: {
            handler() {
                if (this.isEditing && this.leaveBalance) {
                    this.populateForm();
                }
            },
            deep: true
        }
    },
    mounted() {
        this.initializeYears();
    },
    methods: {
        initializeYears() {
            const currentYear = new Date().getFullYear();
            this.availableYears = [
                currentYear - 2,
                currentYear - 1,
                currentYear,
                currentYear + 1,
                currentYear + 2
            ];
        },

        resetForm() {
            this.form = {
                employeeId: '',
                leaveTypeId: '',
                totalDays: null,
                usedDays: 0,
                year: new Date().getFullYear()
            };
            this.errors = {};
            this.isSaving = false;
        },

        populateForm() {
            if (this.leaveBalance) {
                this.form = {
                    employeeId: this.leaveBalance.employeeId || this.leaveBalance.employee?.id || '',
                    leaveTypeId: this.leaveBalance.leaveTypeId || this.leaveBalance.leaveType?.id || '',
                    totalDays: this.leaveBalance.totalDays || null,
                    usedDays: this.leaveBalance.usedDays || 0,
                    year: this.leaveBalance.year || new Date().getFullYear()
                };
            }
        },

        calculateRemainingDays() {
            // Triggered automatically by computed property
            this.$nextTick(() => {
                this.validateUsedDays();
            });
        },

        validateUsedDays() {
            if (this.form.usedDays > this.form.totalDays) {
                this.errors.usedDays = 'Used days cannot exceed total days';
            } else {
                delete this.errors.usedDays;
            }
        },

        validateForm() {
            this.errors = {};
            let isValid = true;

            // Required fields
            if (!this.form.employeeId) {
                this.errors.employeeId = 'Employee is required';
                isValid = false;
            }

            if (!this.form.leaveTypeId) {
                this.errors.leaveTypeId = 'Leave type is required';
                isValid = false;
            }

            if (!this.form.year) {
                this.errors.year = 'Year is required';
                isValid = false;
            }

            if (!this.form.totalDays || this.form.totalDays <= 0) {
                this.errors.totalDays = 'Total days must be greater than 0';
                isValid = false;
            }

            // Logical validations
            if (this.form.usedDays < 0) {
                this.errors.usedDays = 'Used days cannot be negative';
                isValid = false;
            }

            if (this.form.usedDays > this.form.totalDays) {
                this.errors.usedDays = 'Used days cannot exceed total days';
                isValid = false;
            }

            // Check for existing balance (only for new records)
            if (!this.isEditing) {
                const existingBalance = this.checkExistingBalance();
                if (existingBalance) {
                    this.errors.general = 'A leave balance already exists for this employee, leave type, and year';
                    isValid = false;
                }
            }

            return isValid;
        },

        checkExistingBalance() {
            // This would typically be checked on the backend
            // For now, we'll rely on backend validation
            return false;
        },

        async handleSubmit() {
            if (!this.validateForm()) {
                return;
            }

            this.isSaving = true;

            try {
                // Prepare data for API
                const leaveBalanceData = {
                    employeeId: this.form.employeeId,
                    leaveTypeId: this.form.leaveTypeId,
                    totalDays: this.form.totalDays,
                    usedDays: this.form.usedDays || 0,
                    year: this.form.year
                };

                // Emit save event to parent
                this.$emit('save', leaveBalanceData);
            } catch (error) {
                console.error('Error preparing leave balance data:', error);
            } finally {
                this.isSaving = false;
            }
        },

        getEmployeeName(employee) {
            if (!employee) return 'N/A';
            return `${employee.firstNameEn || ''} ${employee.lastNameEn || ''}`.trim() || 'N/A';
        },

        closeModal() {
            this.resetForm();
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.form-select:disabled,
.form-control:disabled {
    background-color: #f8f9fa;
    opacity: 0.8;
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

.text-muted {
    font-size: 0.875em;
}

.modal-lg {
    max-width: 700px;
}

.bg-light {
    background-color: #f8f9fa !important;
}

.card {
    border-radius: 0.5rem;
}

.alert {
    border-radius: 0.5rem;
}

.input-group-text {
    background-color: #e9ecef;
    border-color: #ced4da;
}

.text-primary {
    color: #0d6efd !important;
}

.text-warning {
    color: #ffc107 !important;
}

.text-success {
    color: #198754 !important;
}

.text-danger {
    color: #dc3545 !important;
}

/* Balance Items Horizontal Layout Fix */
.balance-items-container {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-around !important;
    align-items: stretch !important;
    width: 100% !important;
    gap: 1rem !important;
}

.balance-item {
    display: inline-block !important;
    flex: 0 1 auto !important;
    min-width: 70px !important;
    max-width: 90px !important;
    width: auto !important;
    text-align: center !important;
    padding: 0.5rem !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .balance-items-container {
        flex-direction: column !important;
        gap: 0.75rem !important;
    }

    .balance-item {
        min-width: unset !important;
        max-width: unset !important;
        width: 100% !important;
    }
}
</style>

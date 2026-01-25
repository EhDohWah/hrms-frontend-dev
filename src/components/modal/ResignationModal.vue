<template>
    <!-- Add/Edit Resignation Modal -->
    <div v-if="show" class="modal fade show d-block" id="add_resignation" tabindex="-1"
        aria-labelledby="add_resignation" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="d-flex align-items-center">
                        <h4 class="modal-title me-2">{{ isEditing ? (isReadOnly ? 'View' : 'Edit') : 'Add' }} Resignation</h4>
                        <span v-if="isReadOnly" class="badge bg-warning text-dark d-flex align-items-center"
                            data-bs-toggle="tooltip" data-bs-placement="top" title="You have view-only access">
                            <i class="ti ti-eye me-1"></i> Read Only
                        </span>
                    </div>
                    <button type="button" class="btn-close custom-btn-close" aria-label="Close" @click="handleClose">
                        <i class="ti ti-x"></i>
                    </button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="modal-body pb-0">
                        <!-- Loading State -->
                        <div v-if="isLoadingData" class="text-center mb-3">
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <div>Loading form data...</div>
                        </div>

                        <!-- Employee Selection -->
                        <div class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label" for="resignation-employee">
                                    Employee <span class="text-danger">*</span> :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="input-with-tooltip">
                                    <div class="employee-select-wrapper">
                                        <EmployeeTreeSelect
                                            v-model="form.employeeId"
                                            :tree-data="employeeTreeData"
                                            :display-value="selectedEmployeeDisplay"
                                            :has-error="!!errors.employeeId"
                                            :error-message="errors.employeeId"
                                            placeholder="Select employee"
                                            search-placeholder="Search employees..."
                                            :disabled="isReadOnly || isEditing"
                                            @select="handleEmployeeSelect"
                                        />
                                    </div>
                                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="Search and select the employee who is resigning" class="tooltip-icon">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Selected Employee Info Card -->
                        <div v-if="selectedEmployeeInfo" class="employee-info-card mb-3">
                            <div class="card-body">
                                <h6 class="card-title">Selected Employee</h6>
                                <p class="card-text mb-0">
                                    <strong>{{ selectedEmployeeInfo.name }}</strong><br>
                                    <small class="text-muted">Staff ID: {{ selectedEmployeeInfo.staffId }}</small><br>
                                    <small class="text-muted">Organization: {{ selectedEmployeeInfo.organization }}</small><br>
                                    <small class="text-muted">Status:
                                        <span :class="[
                                            'badge badge-sm',
                                            selectedEmployeeInfo.status === 'Local ID' || selectedEmployeeInfo.status === 'Local ID Staff' ? 'bg-success' :
                                            selectedEmployeeInfo.status === 'Local non ID' || selectedEmployeeInfo.status === 'Local non ID Staff' ? 'bg-primary' :
                                            selectedEmployeeInfo.status === 'Expats' ? 'bg-warning' : 'bg-secondary'
                                        ]">
                                            {{ selectedEmployeeInfo.status || 'N/A' }}
                                        </span>
                                    </small>
                                </p>
                            </div>
                        </div>

                        <!-- Employment Loading State -->
                        <div v-if="isLoadingEmployment" class="form-row mb-3">
                            <div class="form-label-col"></div>
                            <div class="form-input-col">
                                <div class="d-flex align-items-center text-muted">
                                    <div class="spinner-border spinner-border-sm me-2" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <span>Loading employment information...</span>
                                </div>
                            </div>
                        </div>

                        <!-- No Employment Warning -->
                        <div v-if="selectedEmployeeInfo && !isLoadingEmployment && !currentEmployment" class="form-row mb-3">
                            <div class="form-label-col"></div>
                            <div class="form-input-col">
                                <div class="alert alert-warning mb-0 py-2">
                                    <i class="ti ti-alert-triangle me-1"></i>
                                    No active employment found for this employee.
                                </div>
                            </div>
                        </div>

                        <!-- Department (Read-only from Employment) -->
                        <div class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label" for="resignation-department">
                                    Department :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="input-with-tooltip">
                                    <input type="text" id="resignation-department"
                                        class="form-control input-medium"
                                        :value="currentEmployment?.department?.name || currentEmployment?.department || ''"
                                        readonly disabled
                                        placeholder="Auto-filled from employment" />
                                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="Department is auto-filled from the employee's current employment" class="tooltip-icon">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Position (Read-only from Employment) -->
                        <div class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label" for="resignation-position">
                                    Position :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="input-with-tooltip">
                                    <input type="text" id="resignation-position"
                                        class="form-control input-medium"
                                        :value="currentEmployment?.position?.title || currentEmployment?.position || ''"
                                        readonly disabled
                                        placeholder="Auto-filled from employment" />
                                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="Position is auto-filled from the employee's current employment" class="tooltip-icon">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Resignation Date -->
                        <div class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label" for="resignation-date">
                                    Resignation Date <span class="text-danger">*</span> :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="input-with-tooltip">
                                    <div class="input-icon-end position-relative input-short-wrapper">
                                        <date-picker id="resignation-date"
                                            class="form-control datetimepicker input-short"
                                            placeholder="dd/mm/yyyy"
                                            :editable="!isReadOnly"
                                            :clearable="false"
                                            :input-format="displayFormat"
                                            v-model="form.resignationDate"
                                            :class="{ 'is-invalid': errors.resignationDate }"
                                            @update:model-value="handleDateChange('resignationDate', $event)"
                                            :disabled="isReadOnly" />
                                        <span class="input-icon-addon">
                                            <i class="ti ti-calendar text-gray-7"></i>
                                        </span>
                                    </div>
                                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="The date when the employee submitted their resignation" class="tooltip-icon">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                                    </span>
                                </div>
                                <div v-if="errors.resignationDate" class="invalid-feedback d-block">{{ errors.resignationDate }}</div>
                            </div>
                        </div>

                        <!-- Last Working Date -->
                        <div class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label" for="last-working-date">
                                    Last Working Date <span class="text-danger">*</span> :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="input-with-tooltip">
                                    <div class="input-icon-end position-relative input-short-wrapper">
                                        <date-picker id="last-working-date"
                                            class="form-control datetimepicker input-short"
                                            placeholder="dd/mm/yyyy"
                                            :editable="!isReadOnly"
                                            :clearable="false"
                                            :input-format="displayFormat"
                                            v-model="form.lastWorkingDate"
                                            :class="{ 'is-invalid': errors.lastWorkingDate }"
                                            @update:model-value="handleDateChange('lastWorkingDate', $event)"
                                            :disabled="isReadOnly" />
                                        <span class="input-icon-addon">
                                            <i class="ti ti-calendar text-gray-7"></i>
                                        </span>
                                    </div>
                                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="The employee's final working day at the organization" class="tooltip-icon">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                                    </span>
                                </div>
                                <div v-if="errors.lastWorkingDate" class="invalid-feedback d-block">{{ errors.lastWorkingDate }}</div>
                            </div>
                        </div>

                        <!-- Notice Period (Calculated) -->
                        <div class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label" for="notice-period">
                                    Notice Period :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="input-with-tooltip">
                                    <div class="input-group input-short">
                                        <input type="text" id="notice-period"
                                            class="form-control"
                                            :value="noticePeriodText"
                                            readonly disabled />
                                        <span class="input-group-text">days</span>
                                    </div>
                                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="Automatically calculated from resignation date to last working date" class="tooltip-icon">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                                    </span>
                                </div>
                                <small class="text-muted">Automatically calculated from dates above</small>
                            </div>
                        </div>

                        <!-- Resignation Reason -->
                        <div class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label" for="resignation-reason">
                                    Resignation Reason <span class="text-danger">*</span> :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="input-with-tooltip">
                                    <select id="resignation-reason"
                                        class="form-select input-medium"
                                        v-model="form.reason"
                                        :class="{ 'is-invalid': errors.reason }"
                                        :disabled="isReadOnly">
                                        <option value="">Select reason...</option>
                                        <option v-for="reason in resignationReasons" :key="reason" :value="reason">
                                            {{ reason }}
                                        </option>
                                    </select>
                                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="Select the primary reason for the employee's resignation" class="tooltip-icon">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                                    </span>
                                </div>
                                <div v-if="errors.reason" class="invalid-feedback d-block">{{ errors.reason }}</div>
                            </div>
                        </div>

                        <!-- Reason Details -->
                        <div class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label" for="reason-details">
                                    Reason Details :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="input-with-tooltip align-items-start">
                                    <textarea id="reason-details"
                                        class="form-control"
                                        v-model="form.reasonDetails"
                                        rows="3"
                                        :class="{ 'is-invalid': errors.reasonDetails }"
                                        placeholder="Additional details about the resignation..."
                                        maxlength="1000"
                                        :disabled="isReadOnly"></textarea>
                                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="Provide additional context or details about the resignation (optional)" class="tooltip-icon" style="margin-top: 8px;">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                                    </span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div v-if="errors.reasonDetails" class="invalid-feedback d-block">{{ errors.reasonDetails }}</div>
                                    <small class="text-muted ms-auto">{{ form.reasonDetails?.length || 0 }}/1000 characters</small>
                                </div>
                            </div>
                        </div>

                        <!-- Acknowledgement Status (for editing) -->
                        <div v-if="isEditing" class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label" for="acknowledgement-status">
                                    Acknowledgement Status :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="input-with-tooltip">
                                    <select id="acknowledgement-status"
                                        class="form-select input-short"
                                        v-model="form.acknowledgementStatus"
                                        :disabled="isReadOnly">
                                        <option v-for="status in acknowledgementStatusOptions" :key="status.value"
                                            :value="status.value">{{ status.label }}</option>
                                    </select>
                                    <span data-bs-toggle="tooltip" data-bs-placement="top"
                                        title="Current acknowledgement status of the resignation" class="tooltip-icon">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Current Status Badge (for editing) -->
                        <div v-if="isEditing && form.acknowledgementStatus" class="form-row mb-3">
                            <div class="form-label-col">
                                <label class="form-label">
                                    Current Status :
                                </label>
                            </div>
                            <div class="form-input-col">
                                <div class="mt-1">
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
                                <li v-if="!isValidDateSequence">Last working date must be on or after resignation date</li>
                                <li v-if="noticePeriod < 0">Notice period cannot be negative</li>
                            </ul>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" @click="handleClose" :disabled="isSaving">
                            {{ isReadOnly ? 'Close' : 'Cancel' }}
                        </button>
                        <button v-if="!isReadOnly" type="submit" class="btn btn-primary"
                            :disabled="isSaving || hasValidationIssues || isLoadingData || isLoadingEmployment || (!currentEmployment && !isEditing)">
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
import { ref, shallowRef, computed, watch, nextTick } from 'vue';
import { resignationService } from '@/services/resignation.service';
import { employmentService } from '@/services/employment.service';
import { statusUtils, reasonUtils, dateUtils } from '@/utils/resignation.utils';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'bootstrap';
import EmployeeTreeSelect from '@/components/shared/EmployeeTreeSelect.vue';

export default {
    name: 'ResignationModal',
    components: {
        InfoCircleOutlined,
        EmployeeTreeSelect
    },
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
        },
        isReadOnly: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
        // Form data
        const form = ref({
            employeeId: '',
            departmentId: '',
            positionId: '',
            resignationDate: '',
            lastWorkingDate: '',
            reason: '',
            reasonDetails: '',
            acknowledgementStatus: 'Pending'
        });

        const errors = ref({});
        const isSaving = ref(false);
        const isLoadingData = ref(false);
        const isLoadingEmployment = ref(false);
        const dataLoaded = ref(false);

        // Employee selection
        const selectedEmployeeDisplay = ref('');
        const selectedEmployeeInfo = ref(null);

        // Employment data (from employee's current employment)
        const currentEmployment = ref(null);

        // Data sources from shared store
        const employeeTreeData = shallowRef([]);

        // Static data
        const resignationReasons = reasonUtils.getResignationReasons();
        const acknowledgementStatusOptions = statusUtils.getAcknowledgementStatusOptions();

        // Date picker format
        const displayFormat = 'dd/MM/yyyy';

        // Computed properties
        const noticePeriod = computed(() => {
            if (!form.value.resignationDate || !form.value.lastWorkingDate) return 0;
            return dateUtils.calculateNoticePeriod(form.value.resignationDate, form.value.lastWorkingDate);
        });

        const noticePeriodText = computed(() => {
            if (noticePeriod.value <= 0) return 'Invalid dates';
            return noticePeriod.value.toString();
        });

        const isValidDateSequence = computed(() => {
            if (!form.value.resignationDate || !form.value.lastWorkingDate) return true;
            return dateUtils.isValidDateSequence(form.value.resignationDate, form.value.lastWorkingDate);
        });

        const hasValidationIssues = computed(() => {
            return !isValidDateSequence.value || noticePeriod.value < 0;
        });

        // Load initial data (employee tree for selection)
        async function loadInitialData() {
            isLoadingData.value = true;

            try {
                console.log('Loading resignation modal data using shared store...');
                const sharedStore = useSharedDataStore();

                await sharedStore.loadAllDropdownData({
                    includeEmployees: true,
                    includeDepartments: false,
                    includePositions: false,
                    force: false
                });

                // Copy employee tree data from shared store
                employeeTreeData.value = sharedStore.getEmployeeTreeData;

                console.log('Resignation modal data loaded');
            } catch (error) {
                console.error('Error loading resignation modal data:', error);
            } finally {
                isLoadingData.value = false;
            }
        }

        // Fetch employee's current employment data
        async function fetchEmployeeEmployment(employeeId) {
            if (!employeeId) {
                currentEmployment.value = null;
                return;
            }

            isLoadingEmployment.value = true;

            try {
                // Fetch employments for this employee
                const response = await employmentService.getAllEmployments({
                    employee_id: employeeId,
                    filter_status: 'active', // Only active employments
                    per_page: 1,
                    sort_by: 'start_date',
                    sort_order: 'desc'
                });

                if (response.success && response.data?.data?.length > 0) {
                    const employment = response.data.data[0];
                    currentEmployment.value = employment;

                    // Auto-fill department and position IDs in the form
                    form.value.departmentId = employment.department_id || employment.department?.id;
                    form.value.positionId = employment.position_id || employment.position?.id;

                    console.log('Employee employment loaded:', employment);
                } else {
                    currentEmployment.value = null;
                    form.value.departmentId = '';
                    form.value.positionId = '';
                    console.log('No active employment found for employee:', employeeId);
                }
            } catch (error) {
                console.error('Error fetching employee employment:', error);
                currentEmployment.value = null;
                form.value.departmentId = '';
                form.value.positionId = '';
            } finally {
                isLoadingEmployment.value = false;
            }
        }

        // Handle employee selection from tree select
        async function handleEmployeeSelect(employee) {
            form.value.employeeId = employee.value;
            selectedEmployeeDisplay.value = employee.title;

            // Store employee info for display
            selectedEmployeeInfo.value = {
                id: employee.value,
                name: employee.title,
                staffId: employee.staff_id || 'N/A',
                organization: employee.organization || 'N/A',
                status: employee.status || 'N/A'
            };

            // Clear employee error if exists
            if (errors.value.employeeId) {
                delete errors.value.employeeId;
            }

            // Fetch employee's employment data to get department and position
            await fetchEmployeeEmployment(employee.value);
        }

        // Handle date changes
        function handleDateChange(fieldName, newValue) {
            try {
                form.value[fieldName] = safeConvertToDate(newValue);
            } catch (error) {
                console.error('Error handling date change:', error);
            }
        }

        // Safe date conversion helper
        function safeConvertToDate(dateValue) {
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
        }

        // Reset form to initial state
        function resetForm() {
            form.value = {
                employeeId: '',
                departmentId: '',
                positionId: '',
                resignationDate: '',
                lastWorkingDate: '',
                reason: '',
                reasonDetails: '',
                acknowledgementStatus: 'Pending'
            };
            errors.value = {};
            selectedEmployeeDisplay.value = '';
            selectedEmployeeInfo.value = null;
            currentEmployment.value = null;
            isSaving.value = false;
        }

        // Populate form with existing resignation data
        async function populateForm() {
            if (!props.resignation) return;

            form.value = {
                employeeId: props.resignation.employeeId || props.resignation.employee_id,
                departmentId: props.resignation.departmentId || props.resignation.department_id,
                positionId: props.resignation.positionId || props.resignation.position_id,
                resignationDate: props.resignation.resignationDate || props.resignation.resignation_date,
                lastWorkingDate: props.resignation.lastWorkingDate || props.resignation.last_working_date,
                reason: props.resignation.reason,
                reasonDetails: props.resignation.reasonDetails || props.resignation.reason_details || '',
                acknowledgementStatus: props.resignation.acknowledgementStatus || props.resignation.acknowledgement_status || 'Pending'
            };

            // Set selected employee data
            if (props.resignation.employee) {
                const emp = props.resignation.employee;
                selectedEmployeeDisplay.value = emp.name || `${emp.first_name_en || ''} ${emp.last_name_en || ''}`.trim();
                selectedEmployeeInfo.value = {
                    id: emp.id,
                    name: emp.name || `${emp.first_name_en || ''} ${emp.last_name_en || ''}`.trim(),
                    staffId: emp.staffId || emp.staff_id || 'N/A',
                    organization: emp.organization || 'N/A',
                    status: emp.status || 'N/A'
                };
            }

            // Set department and position info from resignation data
            if (props.resignation.department || props.resignation.position) {
                currentEmployment.value = {
                    department: props.resignation.department,
                    position: props.resignation.position,
                    department_id: props.resignation.departmentId || props.resignation.department_id,
                    position_id: props.resignation.positionId || props.resignation.position_id
                };
            } else {
                // If not in resignation data, fetch from employment
                await fetchEmployeeEmployment(form.value.employeeId);
            }
        }

        // Get status configuration for display
        function getStatusConfig(status) {
            return statusUtils.getAcknowledgementStatusConfig(status);
        }

        // Validate form
        function validateForm() {
            const newErrors = {};

            if (!form.value.employeeId) {
                newErrors.employeeId = 'Employee is required';
            }

            if (!currentEmployment.value && !props.isEditing) {
                newErrors.employeeId = 'Selected employee has no active employment';
            }

            if (!form.value.resignationDate) {
                newErrors.resignationDate = 'Resignation date is required';
            }

            if (!form.value.lastWorkingDate) {
                newErrors.lastWorkingDate = 'Last working date is required';
            }

            if (!form.value.reason || form.value.reason.trim().length === 0) {
                newErrors.reason = 'Resignation reason is required';
            }

            if (form.value.reasonDetails && form.value.reasonDetails.length > 1000) {
                newErrors.reasonDetails = 'Reason details cannot exceed 1000 characters';
            }

            errors.value = newErrors;
            return Object.keys(newErrors).length === 0 && !hasValidationIssues.value;
        }

        // Handle form submission
        async function handleSubmit() {
            if (isSaving.value) return;

            const isValid = validateForm();
            if (!isValid) return;

            isSaving.value = true;

            try {
                // Include department and position IDs from employment
                const submitData = {
                    ...form.value,
                    departmentId: currentEmployment.value?.department_id || currentEmployment.value?.department?.id || form.value.departmentId,
                    positionId: currentEmployment.value?.position_id || currentEmployment.value?.position?.id || form.value.positionId
                };

                let response;
                if (props.isEditing) {
                    response = await resignationService.updateResignation(props.resignation.id, submitData);
                } else {
                    response = await resignationService.createResignation(submitData);
                }

                if (response.success) {
                    emit('save', response.data);
                    emit('close');
                } else {
                    // Handle validation errors from backend
                    if (response.errors) {
                        errors.value = response.errors;
                    }
                }
            } catch (error) {
                console.error('Error saving resignation:', error);
                errors.value = { general: 'An error occurred while saving. Please try again.' };
            } finally {
                isSaving.value = false;
            }
        }

        // Handle modal close
        function handleClose() {
            emit('close');
        }

        // Initialize tooltips
        function initTooltips() {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach(tooltipTriggerEl => {
                new Tooltip(tooltipTriggerEl);
            });
        }

        // Watch for show prop changes
        watch(() => props.show, async (newVal) => {
            if (newVal) {
                resetForm();

                if (!dataLoaded.value) {
                    await loadInitialData();
                    dataLoaded.value = true;
                }

                if (props.isEditing && props.resignation) {
                    await populateForm();
                }

                // Initialize tooltips after DOM update
                nextTick(() => {
                    initTooltips();
                });
            }
        });

        // Watch for resignation prop changes (for editing)
        watch(() => props.resignation, async () => {
            if (props.isEditing && props.resignation && props.show) {
                await populateForm();
            }
        }, { deep: true });

        return {
            // Form data
            form,
            errors,
            isSaving,
            isLoadingData,
            isLoadingEmployment,

            // Employee selection
            selectedEmployeeDisplay,
            selectedEmployeeInfo,

            // Employment data
            currentEmployment,

            // Data sources
            employeeTreeData,

            // Static data
            resignationReasons,
            acknowledgementStatusOptions,

            // Format
            displayFormat,

            // Computed
            noticePeriod,
            noticePeriodText,
            isValidDateSequence,
            hasValidationIssues,

            // Methods
            loadInitialData,
            fetchEmployeeEmployment,
            handleEmployeeSelect,
            handleDateChange,
            resetForm,
            populateForm,
            getStatusConfig,
            validateForm,
            handleSubmit,
            handleClose,
            initTooltips
        };
    }
};
</script>

<style scoped>
/* Horizontal form layout */
.form-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
}

.form-label-col {
    flex: 0 0 140px;
    min-width: 140px;
    padding-top: 8px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
}

.form-input-col {
    flex: 1;
    min-width: 0;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0;
    display: block;
    text-align: right;
    color: #262626;
    font-size: 14px;
}

/* Input widths */
.input-short {
    width: 200px;
    max-width: 200px;
}

.input-medium {
    width: 400px;
    max-width: 400px;
}

.input-short-wrapper {
    width: 200px;
    max-width: 200px;
}

.input-group.input-short {
    width: 200px;
    max-width: 200px;
}

/* Employee select wrapper */
.employee-select-wrapper {
    width: 400px;
    max-width: 400px;
}

/* Tooltip positioning */
.input-with-tooltip {
    display: flex;
    align-items: center;
    gap: 0;
}

.tooltip-icon {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    flex-shrink: 0;
}

/* Employee info card */
.employee-info-card {
    margin-left: 156px;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 12px 16px;
    max-width: 400px;
}

.employee-info-card .card-title {
    font-size: 13px;
    color: #6c757d;
    margin-bottom: 8px;
    font-weight: 600;
}

.employee-info-card .card-text {
    font-size: 14px;
    line-height: 1.5;
}

/* Dropdown styling */
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

/* Date picker short width */
:deep(.datetimepicker.input-short) {
    width: 200px;
    max-width: 200px;
}

/* Select styling */
.form-select.input-short {
    width: 200px;
    max-width: 200px;
}

.form-select.input-medium {
    width: 400px;
    max-width: 400px;
}

/* Read-only styling */
.form-control:disabled,
.form-select:disabled,
textarea:disabled {
    background-color: #f8f9fa;
    opacity: 0.7;
    cursor: not-allowed;
}

:deep(.mx-input:disabled) {
    background-color: #f8f9fa !important;
    opacity: 0.7;
    cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
        gap: 8px;
    }

    .form-label-col {
        flex: 1;
        min-width: 100%;
        padding-top: 0;
        justify-content: flex-start;
    }

    .form-label {
        text-align: left;
    }

    .form-input-col {
        flex: 1;
        min-width: 100%;
    }

    .input-short,
    .input-medium,
    .input-short-wrapper,
    .input-with-tooltip,
    .input-group.input-short,
    .employee-select-wrapper,
    .form-select.input-short,
    .form-select.input-medium {
        width: 100%;
        max-width: 100%;
    }

    .employee-info-card {
        margin-left: 0;
        max-width: 100%;
    }

    :deep(.datetimepicker.input-short) {
        width: 100%;
        max-width: 100%;
    }
}
</style>

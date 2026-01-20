<template>
    <!-- Add/Edit Travel Request -->
    <div class="modal fade" id="add_travel_request">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                <div class="modal-header"
                    style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; padding: 15px 20px;">
                    <div class="d-flex align-items-center">
                        <h4 class="modal-title me-2" style="color: #0067A5; font-weight: 600;">
                            {{ isEditMode ? 'Edit Travel Request' : 'Add New Travel Request' }}
                        </h4>
                    </div>
                    <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i class="ti ti-x"></i>
                    </button>
                </div>

                <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
                    {{ alertMessage }}
                </div>

                <form @submit.prevent="handleSubmit">
                    <div class="contact-grids-tab">
                        <ul class="nav nav-underline" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="basic-tab" data-bs-toggle="tab"
                                    data-bs-target="#basic-info" type="button" role="tab" aria-selected="true">
                                    Basic Information
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="details-tab" data-bs-toggle="tab"
                                    data-bs-target="#details-info" type="button" role="tab" aria-selected="false">
                                    Travel Details
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div class="tab-content" id="myTabContent">
                        <!-- Basic Information Tab -->
                        <div class="tab-pane fade show active" id="basic-info" role="tabpanel"
                            aria-labelledby="basic-tab" tabindex="0">
                            <div class="modal-body pb-0">
                                <!-- Employee Information Section -->
                                <div class="form-row mb-3">
                                    <div class="form-label-col">
                                        <label class="form-label">Employee Name :</label>
                                        <span class="text-danger ms-1">*</span>
                                    </div>
                                    <div class="form-input-col">
                                        <div class="input-with-full-width">
                                            <div class="position-relative">
                                                <input type="text" v-model="employeeSearchQuery"
                                                    @input="onEmployeeSearchInput" @focus="onEmployeeSearchFocus"
                                                    @blur="onEmployeeSearchBlur" @keydown="onEmployeeKeyDown"
                                                    class="form-control"
                                                    :class="{ 'is-invalid': validationErrors.employee_id }"
                                                    placeholder="Type to search by Staff ID, Name, or Organization..."
                                                    autocomplete="off" />

                                                <!-- Clear button -->
                                                <button v-if="formData.employee_id" type="button"
                                                    @click="clearEmployeeSelection" class="btn btn-sm position-absolute"
                                                    style="right: 8px; top: 50%; transform: translateY(-50%); border: none; background: none; color: #6c757d;">
                                                    <i class="ti ti-x"></i>
                                                </button>

                                                <!-- Dropdown list -->
                                                <div v-if="showEmployeeDropdown && filteredEmployees.length > 0"
                                                    class="dropdown-menu show position-absolute w-100"
                                                    style="max-height: 300px; overflow-y: auto; z-index: 1050;">
                                                    <div v-for="(employee, index) in filteredEmployees"
                                                        :key="employee.id" @mousedown="selectEmployee(employee)"
                                                        class="dropdown-item"
                                                        :class="{ 'active': index === selectedEmployeeIndex }"
                                                        style="cursor: pointer;">
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>{{ employee.staff_id }}</strong> - {{
                                                                    employee.name }}
                                                            </div>
                                                            <small class="text-muted">[{{ employee.organization
                                                            }}]</small>
                                                        </div>
                                                        <small class="text-muted">{{ employee.status }}</small>
                                                    </div>
                                                </div>

                                                <!-- No results message -->
                                                <div v-if="showEmployeeDropdown && filteredEmployees.length === 0 && employeeSearchQuery.trim()"
                                                    class="dropdown-menu show position-absolute w-100"
                                                    style="z-index: 1050;">
                                                    <div class="dropdown-item-text text-muted">
                                                        No employees found for "{{ employeeSearchQuery }}"
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="validationErrors.employee_id" class="invalid-feedback">
                                                {{ validationErrors.employee_id }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Department Selection -->
                                <div class="form-row mb-3">
                                    <div class="form-label-col">
                                        <label class="form-label">Department :</label>
                                    </div>
                                    <div class="form-input-col">
                                        <select v-model="formData.department_id" class="form-select input-medium"
                                            :class="{ 'is-invalid': validationErrors.department_id }"
                                            @change="onDepartmentChange">
                                            <option value="">Select Department</option>
                                            <option v-for="department in departments" :key="department.id"
                                                :value="department.id">
                                                {{ department.name }}
                                            </option>
                                        </select>
                                        <div v-if="validationErrors.department_id" class="invalid-feedback">
                                            {{ validationErrors.department_id }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Position Selection -->
                                <div class="form-row mb-3">
                                    <div class="form-label-col">
                                        <label class="form-label">Position :</label>
                                    </div>
                                    <div class="form-input-col">
                                        <select v-model="formData.position_id" class="form-select input-medium"
                                            :class="{ 'is-invalid': validationErrors.position_id }"
                                            :disabled="!formData.department_id">
                                            <option value="">Select Position</option>
                                            <option v-for="position in filteredPositions" :key="position.id"
                                                :value="position.id">
                                                {{ position.title }}
                                            </option>
                                        </select>
                                        <div v-if="validationErrors.position_id" class="invalid-feedback">
                                            {{ validationErrors.position_id }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Destination -->
                                <div class="form-row mb-3">
                                    <div class="form-label-col">
                                        <label class="form-label">Destination :</label>
                                    </div>
                                    <div class="form-input-col">
                                        <input type="text" class="form-control input-medium" placeholder="Enter destination"
                                            v-model="formData.destination" maxlength="200"
                                            :class="{ 'is-invalid': validationErrors.destination }">
                                        <div v-if="validationErrors.destination" class="invalid-feedback">
                                            {{ validationErrors.destination }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Start Date -->
                                <div class="form-row mb-3">
                                    <div class="form-label-col">
                                        <label class="form-label">Start Date :</label>
                                    </div>
                                    <div class="form-input-col">
                                        <div class="input-short-wrapper">
                                            <div class="input-icon-end position-relative">
                                                <date-picker class="form-control datetimepicker"
                                                    placeholder="dd/mm/yyyy" :editable="true" :clearable="false"
                                                    :input-format="displayFormat" v-model="formData.start_date"
                                                    :class="{ 'is-invalid': validationErrors.start_date }"
                                                    @update:model-value="handleDateChange('start_date', $event)" />
                                                <span class="input-icon-addon">
                                                    <i class="ti ti-calendar text-gray-7"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div v-if="validationErrors.start_date" class="invalid-feedback">
                                            {{ validationErrors.start_date }}
                                        </div>
                                    </div>
                                </div>

                                <!-- End Date -->
                                <div class="form-row mb-3">
                                    <div class="form-label-col">
                                        <label class="form-label">End Date :</label>
                                    </div>
                                    <div class="form-input-col">
                                        <div class="input-short-wrapper">
                                            <div class="input-icon-end position-relative">
                                                <date-picker class="form-control datetimepicker"
                                                    placeholder="dd/mm/yyyy" :editable="true" :clearable="false"
                                                    :input-format="displayFormat" v-model="formData.to_date"
                                                    :class="{ 'is-invalid': validationErrors.to_date }"
                                                    @update:model-value="handleDateChange('to_date', $event)" />
                                                <span class="input-icon-addon">
                                                    <i class="ti ti-calendar text-gray-7"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <div v-if="validationErrors.to_date" class="invalid-feedback">
                                            {{ validationErrors.to_date }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Purpose of Travel -->
                                <div class="form-row mb-3">
                                    <div class="form-label-col">
                                        <label class="form-label">Purpose :</label>
                                    </div>
                                    <div class="form-input-col">
                                        <textarea class="form-control" v-model="formData.purpose"
                                            placeholder="Enter purpose of travel" rows="2"
                                            :class="{ 'is-invalid': validationErrors.purpose }"></textarea>
                                        <div v-if="validationErrors.purpose" class="invalid-feedback">
                                            {{ validationErrors.purpose }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Grant/Project Code -->
                                <div class="form-row mb-3">
                                    <div class="form-label-col">
                                        <label class="form-label">Grant Code :</label>
                                    </div>
                                    <div class="form-input-col">
                                        <input type="text" class="form-control input-medium"
                                            placeholder="Enter grant/project code" v-model="formData.grant"
                                            maxlength="50" :class="{ 'is-invalid': validationErrors.grant }">
                                        <div v-if="validationErrors.grant" class="invalid-feedback">
                                            {{ validationErrors.grant }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-cancel"
                                    data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="button" class="btn btn-save"
                                    @click="switchToDetailsTab">
                                    Next: Travel Details
                                </button>
                            </div>
                        </div>

                        <!-- Travel Details Tab -->
                        <div class="tab-pane fade" id="details-info" role="tabpanel" aria-labelledby="details-tab"
                            tabindex="0">
                            <div class="modal-body pb-0">
                                <!-- Transportation & Accommodation Section -->
                                <div class="row g-4">
                                    <!-- Transportation Column -->
                                    <div class="col-md-6">
                                        <div class="option-card">
                                            <label class="form-label mb-3">Transportation Method</label>
                                            <div class="option-group">
                                                <div class="form-check" v-for="option in transportationOptions"
                                                    :key="option.value">
                                                    <input class="form-check-input" type="radio"
                                                        :name="'transportation'" :id="'trans_' + option.value"
                                                        :value="option.value" v-model="formData.transportation"
                                                        @change="onTransportationChange">
                                                    <label class="form-check-label" :for="'trans_' + option.value">
                                                        {{ option.label }}
                                                    </label>
                                                </div>
                                            </div>
                                            <div v-if="validationErrors.transportation"
                                                class="invalid-feedback d-block">
                                                {{ validationErrors.transportation }}
                                            </div>

                                            <!-- Transportation Other Text -->
                                            <div v-if="formData.transportation === 'other'" class="mt-3">
                                                <label class="form-label text-primary required">Specify Transportation
                                                    Details</label>
                                                <textarea v-model="formData.transportation_other_text"
                                                    class="form-control"
                                                    :class="{ 'is-invalid': validationErrors.transportation_other_text }"
                                                    placeholder="Please specify transportation method (e.g., Company shuttle bus, Rental car, Motorcycle)"
                                                    rows="3" maxlength="200"></textarea>
                                                <div class="form-footer">
                                                    <small v-if="validationErrors.transportation_other_text"
                                                        class="text-danger">
                                                        {{ validationErrors.transportation_other_text }}
                                                    </small>
                                                    <small class="text-muted ms-auto">
                                                        {{ (formData.transportation_other_text || '').length }}/200
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Accommodation Column -->
                                    <div class="col-md-6">
                                        <div class="option-card">
                                            <label class="form-label mb-3">Accommodation Type</label>
                                            <div class="option-group">
                                                <div class="form-check" v-for="option in accommodationOptions"
                                                    :key="option.value">
                                                    <input class="form-check-input" type="radio" :name="'accommodation'"
                                                        :id="'acc_' + option.value" :value="option.value"
                                                        v-model="formData.accommodation"
                                                        @change="onAccommodationChange">
                                                    <label class="form-check-label" :for="'acc_' + option.value">
                                                        {{ option.label }}
                                                    </label>
                                                </div>
                                            </div>
                                            <div v-if="validationErrors.accommodation" class="invalid-feedback d-block">
                                                {{ validationErrors.accommodation }}
                                            </div>

                                            <!-- Accommodation Other Text -->
                                            <div v-if="formData.accommodation === 'other'" class="mt-3">
                                                <label class="form-label text-primary required">Specify Accommodation
                                                    Details</label>
                                                <textarea v-model="formData.accommodation_other_text"
                                                    class="form-control"
                                                    :class="{ 'is-invalid': validationErrors.accommodation_other_text }"
                                                    placeholder="Please specify accommodation type (e.g., Client-provided guest house, Homestay, Camping)"
                                                    rows="3" maxlength="200"></textarea>
                                                <div class="form-footer">
                                                    <small v-if="validationErrors.accommodation_other_text"
                                                        class="text-danger">
                                                        {{ validationErrors.accommodation_other_text }}
                                                    </small>
                                                    <small class="text-muted ms-auto">
                                                        {{ (formData.accommodation_other_text || '').length }}/200
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Additional Information Section -->
                                <div class="row mt-4">
                                    <div class="col-12">
                                        <div class="mb-3">
                                            <label class="form-label">Remarks</label>
                                            <textarea class="form-control" v-model="formData.remarks"
                                                placeholder="Enter any additional remarks or special requirements"
                                                rows="3" :class="{ 'is-invalid': validationErrors.remarks }"></textarea>
                                            <div v-if="validationErrors.remarks" class="invalid-feedback">
                                                {{ validationErrors.remarks }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Signature and Approval Section -->
                                <div class="row mt-4">
                                    <div class="col-12">
                                        <div class="form-section">
                                            <div class="section-header">
                                                <h6 class="section-title">Signature & Approval Information</h6>
                                                <small class="text-muted">Optional fields for tracking approval workflow
                                                    from paper forms</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Request By Section -->
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="mb-3">
                                            <label class="form-label">Request By Date</label>
                                            <div class="input-icon-end position-relative">
                                                <date-picker class="form-control datetimepicker"
                                                    placeholder="dd/mm/yyyy" :editable="true" :clearable="false"
                                                    :input-format="displayFormat" v-model="formData.request_by_date"
                                                    @update:model-value="handleDateChange('request_by_date', $event)" />
                                                <span class="input-icon-addon">
                                                    <i class="ti ti-calendar text-gray-7"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Supervisor Approval Section -->
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Supervisor Approved</label>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox"
                                                    v-model="formData.supervisor_approved" id="supervisor_approved">
                                                <label class="form-check-label" for="supervisor_approved">
                                                    Approved
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">Supervisor Approval Date</label>
                                            <div class="input-icon-end position-relative">
                                                <date-picker class="form-control datetimepicker"
                                                    placeholder="dd/mm/yyyy" :editable="true" :clearable="false"
                                                    :input-format="displayFormat"
                                                    v-model="formData.supervisor_approved_date"
                                                    @update:model-value="handleDateChange('supervisor_approved_date', $event)" />
                                                <span class="input-icon-addon">
                                                    <i class="ti ti-calendar text-gray-7"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- HR Acknowledgement Section -->
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">HR Acknowledged</label>
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox"
                                                    v-model="formData.hr_acknowledged" id="hr_acknowledged">
                                                <label class="form-check-label" for="hr_acknowledged">
                                                    Acknowledged
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label class="form-label">HR Acknowledgement Date</label>
                                            <div class="input-icon-end position-relative">
                                                <date-picker class="form-control datetimepicker"
                                                    placeholder="dd/mm/yyyy" :editable="true" :clearable="false"
                                                    :input-format="displayFormat"
                                                    v-model="formData.hr_acknowledgement_date"
                                                    @update:model-value="handleDateChange('hr_acknowledgement_date', $event)" />
                                                <span class="input-icon-addon">
                                                    <i class="ti ti-calendar text-gray-7"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-cancel"
                                    data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" class="btn btn-save"
                                    :disabled="isSubmitting">
                                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"
                                        role="status" aria-hidden="true"></span>
                                    {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Save') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Success Modal -->
    <div class="modal fade" id="travel_success_modal" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="text-center p-3">
                        <span class="avatar avatar-lg avatar-rounded bg-success mb-3"><i
                                class="ti ti-check fs-24"></i></span>
                        <h5 class="mb-2">{{ isEditMode ? 'Travel Request Updated Successfully' : 'Travel Request Added Successfully' }}</h5>
                        <p class="mb-3" v-if="lastAddedTravelRequest">
                            Travel request to <strong>{{ lastAddedTravelRequest.destination || 'destination' }}</strong>
                            has been {{ isEditMode ? 'updated' : 'added' }} successfully.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { useTravelRequestStore } from '@/stores/travelRequestStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { message } from 'ant-design-vue';

export default {
    name: 'TravelRequestModal',
    emits: ['travel-request-added', 'travel-request-updated'],

    data() {
        return {
            formData: {
                employee_id: '',
                department_id: '',
                position_id: '',
                destination: '',
                start_date: null,
                to_date: null,
                purpose: '',
                grant: '',
                transportation: '',
                transportation_other_text: '',
                accommodation: '',
                accommodation_other_text: '',
                remarks: '',
                // Approval fields (matching backend schema - Version 4.2)
                request_by_date: null,
                supervisor_approved: false,
                supervisor_approved_date: null,
                hr_acknowledged: false,
                hr_acknowledgement_date: null,
                created_by: null,
                updated_by: null
            },
            lastAddedTravelRequest: null,
            isSubmitting: false,
            modalInstance: null,
            alertMessage: '',
            alertClass: '',
            alertTimeout: null,
            validationErrors: {},
            ariaObserver: null,
            isEditMode: false,
            editingTravelRequestId: null,
            dateFormat: "dd/MM/yyyy",
            displayFormat: "dd/MM/yyyy",
            inputFormat: "yyyy-MM-dd",
            // Employee search dropdown properties
            employeeSearchQuery: '',
            showEmployeeDropdown: false,
            selectedEmployeeIndex: -1,
            employees: [],
            employeeTreeData: []
        };
    },

    computed: {
        // Filtered employees based on search query
        filteredEmployees() {
            if (!this.employeeSearchQuery.trim()) {
                return this.employees;
            }

            const query = this.employeeSearchQuery.toLowerCase().trim();
            return this.employees.filter(employee => {
                return (
                    employee.staff_id.toLowerCase().includes(query) ||
                    employee.name.toLowerCase().includes(query) ||
                    employee.organization.toLowerCase().includes(query)
                );
            });
        },
        departments() {
            const sharedDataStore = useSharedDataStore();
            return sharedDataStore.departments || [];
        },
        positions() {
            const sharedDataStore = useSharedDataStore();
            return sharedDataStore.positions || [];
        },
        filteredPositions() {
            if (!this.formData.department_id) return [];
            return this.positions.filter(position => position.department_id == this.formData.department_id);
        },
        transportationOptions() {
            const travelRequestStore = useTravelRequestStore();
            return travelRequestStore.transportationOptions || [
                { value: 'smru_vehicle', label: 'SMRU vehicle' },
                { value: 'public_transportation', label: 'Public transportation' },
                { value: 'air', label: 'Air' },
                { value: 'other', label: 'Other please specify' }
            ];
        },
        accommodationOptions() {
            const travelRequestStore = useTravelRequestStore();
            return travelRequestStore.accommodationOptions || [
                { value: 'smru_arrangement', label: 'SMRU arrangement' },
                { value: 'self_arrangement', label: 'Self arrangement' },
                { value: 'other', label: 'Other please specify' }
            ];
        }
    },

    async mounted() {
        const modalElement = document.getElementById('add_travel_request');
        if (modalElement) {
            this.modalInstance = new Modal(modalElement);

            // Fix accessibility issue with modal and aria-hidden
            this.ariaObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
                        if (modalElement.getAttribute('aria-hidden') === 'true' &&
                            modalElement.contains(document.activeElement)) {
                            modalElement.removeAttribute('aria-hidden');
                        }
                    }
                });
            });

            this.ariaObserver.observe(modalElement, {
                attributes: true,
                attributeFilter: ['aria-hidden']
            });
        }
        await this.loadData();
    },

    beforeUnmount() {
        // Clean up MutationObserver
        if (this.ariaObserver) {
            this.ariaObserver.disconnect();
            this.ariaObserver = null;
        }
    },

    methods: {
        /**
         * Handle date picker changes
         */
        handleDateChange(fieldName, newValue) {
            try {
                const safeDate = this.safeConvertToDate(newValue);
                this.formData[fieldName] = safeDate;
            } catch (error) {
                console.error('Error handling date change:', error);
            }
        },

        /**
         * Safe date conversion helper
         */
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

        async loadData() {
            try {
                const sharedDataStore = useSharedDataStore();
                const travelRequestStore = useTravelRequestStore();
                await Promise.all([
                    this.loadEmployees(),
                    sharedDataStore.fetchDepartments?.() || Promise.resolve(),
                    sharedDataStore.fetchPositions?.() || Promise.resolve(),
                    travelRequestStore.fetchOptions?.() || Promise.resolve()
                ]);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },

        // Load employees from backend using tree search
        async loadEmployees() {
            try {
                console.log('🔄 Loading employees using treeSearch...');
                const { employeeService } = await import('@/services/employee.service');
                const response = await employeeService.treeSearch();

                if (response.success && response.data) {
                    // Store the tree data for tree components if needed
                    this.employeeTreeData = response.data;

                    // Flatten the tree data for regular select dropdown
                    this.employees = this.flattenEmployeeTree(response.data);

                    console.log(`✅ Loaded ${this.employees.length} employees from both SMRU and BHF`);
                    console.log('Employee data sample:', this.employees.slice(0, 3));
                } else {
                    this.employeeTreeData = [];
                    this.employees = [];
                    console.warn('⚠️ No employee data received from API');
                }
            } catch (error) {
                console.error('❌ Error loading employees:', error);
                // Fallback to static data
                this.employeeTreeData = [];
                this.employees = [
                    { id: 1, name: 'Anthony Lewis', staff_id: 'EMP001', organization: 'DEMO' },
                    { id: 2, name: 'Brian Villalobos', staff_id: 'EMP002', organization: 'DEMO' },
                    { id: 3, name: 'Harvey Smith', staff_id: 'EMP003', organization: 'DEMO' }
                ];
            }
        },

        // Helper method to flatten employee tree for dropdown
        flattenEmployeeTree(treeData) {
            const flattened = [];

            const flatten = (nodes, parentOrganization = null) => {
                for (const node of nodes) {
                    // Skip organization nodes (they don't have numeric values)
                    if (node.value && node.title && !isNaN(node.value)) {
                        // Extract staff ID from title (format: "0001 - Name")
                        const staffIdMatch = node.title.match(/^(\d+)\s*-\s*(.+)$/);
                        const staffId = staffIdMatch ? staffIdMatch[1] : '';
                        const employeeName = staffIdMatch ? staffIdMatch[2] : node.title;

                        flattened.push({
                            id: parseInt(node.value),
                            name: employeeName,
                            staff_id: staffId,
                            organization: parentOrganization,
                            status: node.status || '',
                            fullTitle: node.title, // Keep original title for display
                            department_id: node.department_id || null,
                            position_id: node.position_id || null
                        });
                    }

                    // Process children and pass down organization info
                    if (node.children && node.children.length > 0) {
                        const organization = node.title === 'SMRU' || node.title === 'BHF' ? node.title : parentOrganization;
                        flatten(node.children, organization);
                    }
                }
            };

            flatten(treeData);
            return flattened;
        },

        async handleSubmit() {
            this.isSubmitting = true;
            this.alertMessage = '';
            this.validationErrors = {};

            try {
                const validation = this.validateForm(this.formData);
                if (!validation.isValid) {
                    this.validationErrors = validation.errors;
                    this.showAlert(validation.message || 'Please correct the validation errors', 'alert-danger');
                    return;
                }

                // Format dates for API and add user info
                const formattedData = this.formatDataForAPI(this.formData);

                // Add created_by and updated_by fields
                const currentUser = this.$store?.getters?.currentUser?.username || 'system';
                if (!this.isEditMode) {
                    formattedData.created_by = currentUser;
                }
                formattedData.updated_by = currentUser;

                const travelRequestStore = useTravelRequestStore();
                let response;

                if (this.isEditMode) {
                    response = await travelRequestStore.updateTravelRequest(this.editingTravelRequestId, formattedData);
                    this.$emit('travel-request-updated');
                } else {
                    response = await travelRequestStore.createTravelRequest(formattedData);
                    this.$emit('travel-request-added');
                }

                if (response) {
                    this.lastAddedTravelRequest = response;
                    message.success(`Travel request ${this.isEditMode ? 'updated' : 'added'} successfully`);

                    if (this.modalInstance) {
                        this.modalInstance.hide();
                    }

                    const successModal = new Modal(document.getElementById('travel_success_modal'));
                    successModal.show();

                    successModal._element.addEventListener('hidden.bs.modal', () => {
                        this.resetForm();
                        this.lastAddedTravelRequest = null;
                    }, { once: true });
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                this.handleSubmitError(error);
            } finally {
                this.isSubmitting = false;
            }
        },

        validateForm(data) {
            const errors = {};
            let message = '';

            // Required field validation
            if (!data.employee_id) {
                errors.employee_id = 'Employee is required';
            }

            // Date validation
            if (data.start_date && data.to_date) {
                const startDate = new Date(data.start_date);
                const endDate = new Date(data.to_date);
                if (endDate <= startDate) {
                    errors.to_date = 'End date must be after start date';
                }
            }

            // Transportation validation
            if (data.transportation === 'other') {
                if (!data.transportation_other_text?.trim()) {
                    errors.transportation_other_text = 'Please specify the transportation method when selecting "Other"';
                } else if (data.transportation_other_text.length > 200) {
                    errors.transportation_other_text = 'Transportation specification cannot exceed 200 characters';
                }
            }

            // Accommodation validation
            if (data.accommodation === 'other') {
                if (!data.accommodation_other_text?.trim()) {
                    errors.accommodation_other_text = 'Please specify the accommodation type when selecting "Other"';
                } else if (data.accommodation_other_text.length > 200) {
                    errors.accommodation_other_text = 'Accommodation specification cannot exceed 200 characters';
                }
            }

            // Destination validation
            if (data.destination && data.destination.length > 200) {
                errors.destination = 'Destination cannot exceed 200 characters';
            }

            // Grant validation
            if (data.grant && data.grant.length > 50) {
                errors.grant = 'Grant/Project Code cannot exceed 50 characters';
            }

            if (Object.keys(errors).length > 0) {
                message = Object.values(errors)[0];
            }

            return {
                isValid: Object.keys(errors).length === 0,
                errors,
                message
            };
        },

        formatDataForAPI(data) {
            const formatted = { ...data };

            // Format dates to YYYY-MM-DD format
            if (formatted.start_date instanceof Date) {
                formatted.start_date = formatted.start_date.toISOString().split('T')[0];
            }
            if (formatted.to_date instanceof Date) {
                formatted.to_date = formatted.to_date.toISOString().split('T')[0];
            }

            // Format approval dates
            if (formatted.request_by_date instanceof Date) {
                formatted.request_by_date = formatted.request_by_date.toISOString().split('T')[0];
            }
            if (formatted.supervisor_approved_date instanceof Date) {
                formatted.supervisor_approved_date = formatted.supervisor_approved_date.toISOString().split('T')[0];
            }
            if (formatted.hr_acknowledgement_date instanceof Date) {
                formatted.hr_acknowledgement_date = formatted.hr_acknowledgement_date.toISOString().split('T')[0];
            }

            // Remove empty strings and convert to null for optional fields
            Object.keys(formatted).forEach(key => {
                if (formatted[key] === '') {
                    formatted[key] = null;
                }
            });

            // Ensure other text fields are only sent when 'other' is selected
            if (formatted.transportation !== 'other') {
                formatted.transportation_other_text = null;
            }
            if (formatted.accommodation !== 'other') {
                formatted.accommodation_other_text = null;
            }

            return formatted;
        },

        handleSubmitError(error) {
            let errorMessage = 'An error occurred while saving the travel request.';

            if (error.response?.data) {
                const data = error.response.data;

                // Handle validation errors (422)
                if (error.response.status === 422 && data.errors) {
                    this.validationErrors = data.errors;
                    errorMessage = data.message || 'Please correct the validation errors';
                } else {
                    errorMessage = data.error || data.message || errorMessage;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            this.showAlert(errorMessage, 'alert-danger');
        },

        showAlert(message, alertClass, duration = 5000) {
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
            }
            this.alertMessage = message;
            this.alertClass = alertClass;
            this.alertTimeout = setTimeout(() => {
                this.alertMessage = '';
                this.alertClass = '';
            }, duration);
        },

        resetForm() {
            this.formData = {
                employee_id: '',
                department_id: '',
                position_id: '',
                destination: '',
                start_date: null,
                to_date: null,
                purpose: '',
                grant: '',
                transportation: '',
                transportation_other_text: '',
                accommodation: '',
                accommodation_other_text: '',
                remarks: '',
                // Approval fields (matching backend schema - Version 4.2)
                request_by_date: null,
                supervisor_approved: false,
                supervisor_approved_date: null,
                hr_acknowledged: false,
                hr_acknowledgement_date: null,
                created_by: null,
                updated_by: null
            };
            this.alertMessage = '';
            this.alertClass = '';
            this.validationErrors = {};
            this.isEditMode = false;
            this.editingTravelRequestId = null;
            // Reset employee search fields
            this.employeeSearchQuery = '';
            this.showEmployeeDropdown = false;
            this.selectedEmployeeIndex = -1;
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
            }
        },

        // Employee search methods
        onEmployeeSearchInput() {
            this.showEmployeeDropdown = true;
            this.selectedEmployeeIndex = -1;

            // Clear selected employee if search doesn't match
            if (this.formData.employee_id && this.employeeSearchQuery.toLowerCase().indexOf(this.employeeSearchQuery.toLowerCase()) === -1) {
                this.formData.employee_id = '';
            }
        },

        onEmployeeSearchFocus() {
            this.showEmployeeDropdown = true;
            this.selectedEmployeeIndex = -1;
        },

        onEmployeeSearchBlur() {
            // Delay hiding to allow for mousedown on dropdown items
            setTimeout(() => {
                this.showEmployeeDropdown = false;
            }, 200);
        },

        onEmployeeKeyDown(event) {
            if (!this.showEmployeeDropdown) return;

            const filteredList = this.filteredEmployees;

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    this.selectedEmployeeIndex = Math.min(this.selectedEmployeeIndex + 1, filteredList.length - 1);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    this.selectedEmployeeIndex = Math.max(this.selectedEmployeeIndex - 1, -1);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (this.selectedEmployeeIndex >= 0 && filteredList[this.selectedEmployeeIndex]) {
                        this.selectEmployee(filteredList[this.selectedEmployeeIndex]);
                    }
                    break;
                case 'Escape':
                    this.showEmployeeDropdown = false;
                    break;
            }
        },

        selectEmployee(employee) {
            console.log('👤 Selecting employee:', employee);

            this.formData.employee_id = employee.id;
            console.log('✅ Employee selected - formData.employee_id set to:', this.formData.employee_id);

            this.employeeSearchQuery = `${employee.staff_id} - ${employee.name} [${employee.organization}]`;
            this.showEmployeeDropdown = false;
            this.selectedEmployeeIndex = -1;

            // Auto-populate department and position
            this.onEmployeeChange();
        },

        clearEmployeeSelection() {
            this.formData.employee_id = null;
            this.employeeSearchQuery = '';
            this.showEmployeeDropdown = false;
            this.selectedEmployeeIndex = -1;
        },

        onEmployeeChange() {
            // Auto-populate department and position when employee is selected
            if (this.formData.employee_id) {
                const employee = this.employees.find(emp => emp.id == this.formData.employee_id);
                if (employee && employee.department_id) {
                    this.formData.department_id = employee.department_id;
                    if (employee.position_id) {
                        this.formData.position_id = employee.position_id;
                    }
                }
            }
        },

        onDepartmentChange() {
            this.formData.position_id = '';
        },

        onTransportationChange() {
            if (this.formData.transportation !== 'other') {
                this.formData.transportation_other_text = '';
            }
        },

        onAccommodationChange() {
            if (this.formData.accommodation !== 'other') {
                this.formData.accommodation_other_text = '';
            }
        },

        switchToDetailsTab() {
            // Switch to the details tab
            const detailsTab = document.getElementById('details-tab');
            if (detailsTab) {
                detailsTab.click();
            }
        },

        async openAddTravelRequestModal() {
            try {
                this.resetForm();
                this.isEditMode = false;
                await this.loadData();
                if (this.modalInstance) {
                    this.modalInstance.show();
                }
            } catch (error) {
                console.error('Error opening add modal:', error);
            }
        },

        async openEditTravelRequestModal(travelRequest) {
            try {
                this.isEditMode = true;
                this.editingTravelRequestId = travelRequest.id;

                // Populate form with existing data
                this.formData = {
                    employee_id: travelRequest.employee_id || '',
                    department_id: travelRequest.department_id || '',
                    position_id: travelRequest.position_id || '',
                    destination: travelRequest.destination || '',
                    start_date: travelRequest.start_date ? new Date(travelRequest.start_date) : null,
                    to_date: travelRequest.to_date ? new Date(travelRequest.to_date) : null,
                    purpose: travelRequest.purpose || '',
                    grant: travelRequest.grant || '',
                    transportation: travelRequest.transportation || '',
                    transportation_other_text: travelRequest.transportation_other_text || '',
                    accommodation: travelRequest.accommodation || '',
                    accommodation_other_text: travelRequest.accommodation_other_text || '',
                    remarks: travelRequest.remarks || '',
                    // Approval fields (matching backend schema - Version 4.2)
                    request_by_date: travelRequest.request_by_date ? new Date(travelRequest.request_by_date) : null,
                    supervisor_approved: travelRequest.supervisor_approved || false,
                    supervisor_approved_date: travelRequest.supervisor_approved_date ? new Date(travelRequest.supervisor_approved_date) : null,
                    hr_acknowledged: travelRequest.hr_acknowledged || false,
                    hr_acknowledgement_date: travelRequest.hr_acknowledgement_date ? new Date(travelRequest.hr_acknowledgement_date) : null,
                    created_by: travelRequest.created_by || null,
                    updated_by: travelRequest.updated_by || null
                };

                await this.loadData();

                // Set employee search query for display in edit form
                if (travelRequest.employee) {
                    const staffId = travelRequest.employee.staff_id || '';
                    const employeeName = travelRequest.employee.first_name_en && travelRequest.employee.last_name_en
                        ? `${travelRequest.employee.first_name_en} ${travelRequest.employee.last_name_en}`
                        : travelRequest.employee.name || '';
                    this.employeeSearchQuery = `${staffId} - ${employeeName}`;
                } else if (this.formData.employee_id) {
                    // Find employee in loaded data
                    const employee = this.employees.find(emp => emp.id == this.formData.employee_id);
                    if (employee) {
                        this.employeeSearchQuery = `${employee.staff_id} - ${employee.name}`;
                    }
                }

                if (this.modalInstance) {
                    this.modalInstance.show();
                }
            } catch (error) {
                console.error('Error opening edit modal:', error);
            }
        }
    }
};
</script>

<style scoped>
/* ========================================
   HORIZONTAL FORM LAYOUT (Grant Modal Style)
   ======================================== */

/* Form row container */
.form-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
}

/* Label column - fixed width, right-aligned */
.form-label-col {
    flex: 0 0 180px;
    min-width: 180px;
    padding-top: 8px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
}

/* Input column - flexible width */
.form-input-col {
    flex: 1;
    min-width: 0;
}

/* Form labels - right-aligned with consistent styling */
.form-row .form-label {
    font-weight: 500;
    margin-bottom: 0;
    display: block;
    text-align: right;
    color: #262626;
    font-size: 14px;
}

/* Input width classes */
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
    flex: 1;
}

.input-with-full-width {
    width: 100%;
}

/* Custom button close styling */
.custom-btn-close {
    background: none;
    border: none;
    color: #6c757d;
    font-size: 1.25rem;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.15s ease-in-out;
}

.custom-btn-close:hover {
    background-color: #f8f9fa;
    color: #000;
}

/* Form styling */
.form-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
}

.required::after {
    content: " *";
    color: #e53e3e;
}

.form-control,
.form-select {
    width: 100%;
    padding: 7px 12px;
    border-radius: 6px;
    border: 1px solid #c9d2e2;
    font-size: 1em;
    box-sizing: border-box;
    background: #f7f8fa;
    outline: none;
    transition: border 0.2s;
}

.form-control:focus,
.form-select:focus {
    border: 1.5px solid #4a7fff;
    background: #fff;
}

.form-select:disabled {
    background-color: #e9ecef;
    opacity: 1;
}

.is-invalid {
    border-color: #e53e3e;
    background: #fff5f5;
}

.invalid-feedback {
    display: block;
    width: 100%;
    margin-top: 5px;
    font-size: 0.875em;
    color: #e53e3e;
    font-weight: 500;
}

/* Option cards styling */
.option-card {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1.25rem;
    height: 100%;
}

.option-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-check {
    padding-left: 1.5rem;
}

.form-check-input {
    margin-top: 0.125rem;
}

.form-check-label {
    font-weight: 500;
    cursor: pointer;
    color: #495057;
}

/* Form footer for character counter */
.form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.25rem;
}

.text-danger {
    color: #e53e3e !important;
    font-size: 0.875rem;
}

.text-muted {
    color: #6c757d !important;
    font-size: 0.875rem;
}

.text-primary {
    color: #0d6efd !important;
}

/* Date picker specific styles */
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

/* Date picker integration */
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

:deep(.mx-input.is-invalid) {
    border-color: #e53e3e !important;
    background: #fff5f5 !important;
}

:deep(.mx-icon-calendar) {
    display: none;
}

/* Success icon styling */
.avatar {
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.avatar-lg {
    width: 4rem;
    height: 4rem;
}

.avatar-rounded {
    border-radius: 50%;
}

.bg-success {
    background-color: #28a745 !important;
    color: white;
}

.fs-24 {
    font-size: 1.5rem;
}

/* Tab styling */
.nav-underline .nav-link {
    border-bottom: 2px solid transparent;
    color: #6c757d;
    font-weight: 500;
}

.nav-underline .nav-link.active {
    color: #0067A5;
    border-bottom-color: #0067A5;
}

.nav-underline .nav-link:hover {
    color: #0067A5;
}

/* ========================================
   BUTTON STYLING (Employment Modal Style)
   ======================================== */

/* Base button styling */
.btn {
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    margin-right: 8px;
}

/* Cancel button */
.btn-cancel {
    background: #fff;
    color: #2a3146;
    border: 1.2px solid #bbc4d1;
}

.btn-cancel:hover {
    background: #f4f7fa;
}

/* Save/Primary button */
.btn-save {
    background: linear-gradient(90deg, #3577ef 70%, #355bef 100%);
    color: #fff;
    border: none;
}

.btn-save:hover {
    background: linear-gradient(90deg, #2566de 70%, #2449de 100%);
}

.btn-save:disabled {
    background: #ccd4ea;
    color: #888;
    cursor: not-allowed;
}

/* Modal footer styling */
.modal-footer {
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    padding: 15px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 0;
}

/* Searchable dropdown styles */
.dropdown-menu {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    margin-top: 2px;
}

.dropdown-item {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f8f9fa;
    transition: background-color 0.15s ease-in-out;
}

.dropdown-item:last-child {
    border-bottom: none;
}

.dropdown-item:hover,
.dropdown-item.active {
    background-color: #e9ecef;
    color: #495057;
}

.dropdown-item strong {
    color: #007bff;
}

.dropdown-item-text {
    padding: 0.75rem 1rem;
    font-style: italic;
}

/* Clear button hover effect */
.btn:hover i {
    color: #e53e3e !important;
}

/* Loading state */
.dropdown-menu .text-center {
    padding: 1rem;
}

/* Fix dropdown direction - force dropdowns to show below */
.form-select {
    position: relative;
}

/* Ensure Bootstrap select dropdowns appear below the select element */
.form-select option {
    position: relative;
    z-index: 1;
}

/* Force dropdown direction for select elements in modal */
.modal .form-select {
    /* Ensure enough space for dropdown */
    margin-bottom: 2rem;
}

/* Fix for any dropdown menus that might appear above */
.dropdown-menu {
    top: 100% !important;
    bottom: auto !important;
    transform: none !important;
}

/* Ensure modal has proper overflow handling */
.modal-body {
    overflow-y: visible;
    padding-bottom: 2rem;
}

/* Specific fix for department and position dropdowns */
.modal .form-select[value*="Department"],
.modal .form-select[value*="Position"] {
    margin-bottom: 3rem;
}

/* Form section styling for signature/approval section */
.form-section {
    margin-bottom: 1rem;
}

.section-header {
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
}

.section-title {
    color: #495057;
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
}

.section-header small {
    color: #6c757d;
    font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    /* Horizontal form layout - Switch to vertical on mobile */
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

    .form-row .form-label {
        text-align: left;
    }

    .form-input-col {
        flex: 1;
        min-width: 100%;
    }

    /* All inputs full width on mobile */
    .input-short,
    .input-medium,
    .input-short-wrapper {
        width: 100%;
        max-width: 100%;
    }

    .option-card {
        padding: 1rem;
        margin-bottom: 1rem;
    }

    .modal-dialog {
        margin: 0.5rem;
    }

    .dropdown-menu {
        font-size: 0.9rem;
    }

    .dropdown-item {
        padding: 0.5rem 0.75rem;
    }
}
</style>
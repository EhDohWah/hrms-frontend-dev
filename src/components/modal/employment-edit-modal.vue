<template>
    <div class="modal fade" id="employmentEditModal" tabindex="-1" aria-labelledby="employmentEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content new-modal-design">
                <div class="modal-header-new">
                    <h2 class="modal-title-new" id="employmentEditModalLabel">
                        Edit Employment
                    </h2>
                    <button type="button" class="btn-close-custom" @click="handleModalClose" aria-label="Close">
                        <i class="ti ti-x"></i>
                    </button>
                </div>
                <div class="modal-body-new">
                    <div v-if="isLoadingData" class="text-center mb-3">
                        <div class="spinner-border spinner-border-sm" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <div v-if="!dataLoaded">
                            Loading form data for the first time...
                        </div>
                        <div v-else>
                            Loading employment data...
                        </div>
                    </div>

                    <form @submit.prevent="handleSubmit" ref="mainForm"
                        :class="{ 'form-loading': isLoadingData && !dataLoaded }">
                        <div v-if="alertMessage && alertClass === 'alert-success'" class="success-msg">
                            {{ alertMessage }}
                        </div>

                        <div v-if="alertMessage && alertClass === 'alert-danger'" class="error-msg">
                            {{ alertMessage }}
                        </div>

                        <!-- Row 1: Employee + FTE (2 columns) -->
                        <div class="date-row">
                            <div class="form-group" style="flex: 2.3;"> <!-- 70% width -->
                                <label class="form-label required">Employee</label>
                                <a-tree-select v-model:value="formData.employee_id" @change="onEmployeeChange"
                                    show-search style="width: 100%;"
                                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                    placeholder="Select employee" allow-clear tree-default-expand-all
                                    :tree-data="employeeTreeData" tree-node-filter-prop="title"
                                    :getPopupContainer="getPopupContainer"
                                    :class="{ 'is-invalid': validationErrors.employee_id }" required
                                    @input="saveFormState" />
                                <div v-if="validationErrors.employee_id" class="invalid-feedback">
                                    {{ validationErrors.employee_id }}
                                </div>
                            </div>
                            <div class="form-group" style="flex: 1;"> <!-- 30% width -->
                                <label class="form-label">FTE</label>
                                <input type="number" step="0.1" min="0" max="1" class="form-control"
                                    v-model.number="formData.fte" @input="saveFormState">
                                <div v-if="validationErrors.fte" class="invalid-feedback">
                                    {{ validationErrors.fte }}
                                </div>
                            </div>
                        </div>

                        <div v-if="selectedEmployeeInfo" class="employee-info-card mb-3" style="margin-top: 16px;">
                            <div class="card-body">
                                <h6 class="card-title">Selected Employee</h6>
                                <p class="card-text">
                                    <strong>{{ selectedEmployeeInfo.name }}</strong><br>
                                    <small class="text-muted">Subsidiary: {{ selectedEmployeeInfo.subsidiary
                                        }}</small><br>
                                    <small class="text-muted">Status:
                                        <span :class="[
                                            'badge badge-sm',
                                            selectedEmployeeInfo.status === 'Local ID' ? 'bg-success' :
                                                selectedEmployeeInfo.status === 'Local non ID' || selectedEmployeeInfo.status === 'Local non ID Staff' ? 'bg-primary' :
                                                    selectedEmployeeInfo.status === 'Expats' ? 'bg-warning' : 'bg-secondary'
                                        ]">
                                            {{ selectedEmployeeInfo.status }}
                                        </span>
                                    </small>
                                </p>
                            </div>
                        </div>

                        <div class="date-row">
                            <div class="form-group">
                                <label class="form-label required">Employment Type</label>
                                <select class="form-control" v-model="formData.employment_type"
                                    :class="{ 'is-invalid': validationErrors.employment_type }" required
                                    @change="saveFormState">
                                    <option disabled value="">Select Type</option>
                                    <option v-for="type in employmentTypes" :key="type.id" :value="type.value">
                                        {{ type.value }}
                                    </option>
                                </select>
                                <div v-if="validationErrors.employment_type" class="invalid-feedback">
                                    {{ validationErrors.employment_type }}
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Pay Method</label>
                                <select class="form-control" v-model="formData.pay_method"
                                    :class="{ 'is-invalid': validationErrors.pay_method }" @change="saveFormState">
                                    <option disabled value="">Select Pay Method</option>
                                    <option v-for="method in payMethods" :key="method.id" :value="method.value">
                                        {{ method.value }}
                                    </option>
                                </select>
                                <div v-if="validationErrors.pay_method" class="invalid-feedback">
                                    {{ validationErrors.pay_method }}
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Department Position</label>
                                <select class="form-control" v-model="formData.department_position_id"
                                    :class="{ 'is-invalid': validationErrors.department_position_id }" required
                                    @change="saveFormState">
                                    <option disabled value="">Select Department Position</option>
                                    <option v-for="position in departmentPositions" :key="position.id"
                                        :value="position.id">
                                        {{ position.department }} | {{ position.position }}
                                    </option>
                                </select>
                                <div v-if="validationErrors.department_position_id" class="invalid-feedback">
                                    {{ validationErrors.department_position_id }}
                                </div>
                            </div>
                        </div>

                        <div class="date-row">
                            <div class="form-group">
                                <label class="form-label required">Start Date</label>
                                <div class="input-icon-end position-relative">
                                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                                        :editable="true" :clearable="false" :input-format="dateFormat"
                                        v-model="formData.start_date"
                                        :class="{ 'is-invalid': validationErrors.start_date }" required
                                        @update:model-value="handleDateChange('start_date', $event)" />
                                    <span class="input-icon-addon">
                                        <i class="ti ti-calendar text-gray-7"></i>
                                    </span>
                                </div>
                                <div v-if="validationErrors.start_date" class="invalid-feedback">
                                    {{ validationErrors.start_date }}
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">End Date</label>
                                <div class="input-icon-end position-relative">
                                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                                        :editable="true" :clearable="false" :input-format="dateFormat"
                                        v-model="formData.end_date" :class="{ 'is-invalid': validationErrors.end_date }"
                                        @update:model-value="handleDateChange('end_date', $event)" />
                                    <span class="input-icon-addon">
                                        <i class="ti ti-calendar text-gray-7"></i>
                                    </span>
                                </div>
                                <div v-if="validationErrors.end_date" class="invalid-feedback">
                                    {{ validationErrors.end_date }}
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Work Location</label>
                                <select class="form-control" v-model="formData.work_location_id"
                                    :class="{ 'is-invalid': validationErrors.work_location_id }" required
                                    @change="saveFormState">
                                    <option disabled value="">Select Location</option>
                                    <option v-for="location in workLocations" :key="location.id" :value="location.id">
                                        {{ location.name }}
                                    </option>
                                </select>
                                <div v-if="validationErrors.work_location_id" class="invalid-feedback">
                                    {{ validationErrors.work_location_id }}
                                </div>
                            </div>
                        </div>

                        <div class="date-row">
                            <div class="form-group">
                                <label class="form-label">Probation Pass Date</label>
                                <div class="input-icon-end position-relative">
                                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                                        :editable="true" :clearable="false" :input-format="dateFormat"
                                        v-model="formData.probation_pass_date"
                                        :class="{ 'is-invalid': validationErrors.probation_pass_date }"
                                        @update:model-value="handleDateChange('probation_pass_date', $event)" />
                                    <span class="input-icon-addon">
                                        <i class="ti ti-calendar text-gray-7"></i>
                                    </span>
                                </div>
                                <div v-if="validationErrors.probation_pass_date" class="invalid-feedback">
                                    {{ validationErrors.probation_pass_date }}
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Position Salary</label>
                                <input type="number" class="form-control" v-model.number="formData.position_salary"
                                    :class="{ 'is-invalid': validationErrors.position_salary }" required
                                    @input="saveFormState">
                                <div v-if="validationErrors.position_salary" class="invalid-feedback">
                                    {{ validationErrors.position_salary }}
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Probation Salary</label>
                                <input type="number" class="form-control" v-model.number="formData.probation_salary"
                                    :class="{ 'is-invalid': validationErrors.probation_salary }" @input="saveFormState">
                                <div v-if="validationErrors.probation_salary" class="invalid-feedback">
                                    {{ validationErrors.probation_salary }}
                                </div>
                            </div>
                        </div>



                        <!-- Funding Allocation with added spacing -->
                        <div class="form-group funding-allocation-section" style="margin-top: 24px; margin-bottom: 0;">
                            <label>Funding Allocation</label>

                            <div class="date-row" style="margin-bottom:8px;">
                                <div class="form-group">
                                    <small class="text-muted">Grant</small>
                                    <select v-model="currentAllocation.grant_id" @change="onGrantChange"
                                        class="form-control" :disabled="isLoadingData">
                                        <option value="">{{ isLoadingData ? 'Loading grants...' : 'Select grant' }}
                                        </option>
                                        <option v-for="grant in grantOptions" :key="grant.id" :value="grant.id">
                                            {{ grant.name }} ({{ grant.code }})
                                        </option>
                                    </select>
                                    <div v-if="allocationErrors.grant_id" class="invalid-feedback">
                                        {{ allocationErrors.grant_id }}
                                    </div>
                                </div>

                                <template v-if="isOrgFundGrant(currentAllocation.grant_id)">
                                    <div class="form-group">
                                        <small class="text-muted">Department Position</small>
                                        <select v-model="currentAllocation.department_position_id" class="form-control">
                                            <option value="">Select department position</option>
                                            <option v-for="position in departmentPositions" :key="position.id"
                                                :value="position.id">
                                                {{ position.department }} - {{ position.position }}
                                            </option>
                                        </select>
                                        <div v-if="allocationErrors.department_position_id" class="invalid-feedback">
                                            {{ allocationErrors.department_position_id }}
                                        </div>
                                    </div>
                                </template>

                                <template v-else>
                                    <div class="form-group">
                                        <small class="text-muted">Grant Position</small>
                                        <select v-model="currentAllocation.grant_items_id"
                                            @change="onGrantPositionChange" class="form-control"
                                            :disabled="!currentAllocation.grant_id || isLoadingData">
                                            <option value="">Select grant position</option>
                                            <option v-for="position in grantPositionOptions" :key="position.id"
                                                :value="position.id">
                                                {{ position.name }}
                                            </option>
                                        </select>
                                        <div v-if="allocationErrors.grant_items_id" class="invalid-feedback">
                                            {{ allocationErrors.grant_items_id }}
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <small class="text-muted">Position Slot</small>
                                        <select v-model="currentAllocation.position_slot_id" class="form-control"
                                            :disabled="!currentAllocation.grant_items_id || isLoadingData">
                                            <option value="">Select position slot</option>
                                            <option v-for="slot in positionSlotOptions" :key="slot.id" :value="slot.id">
                                                Slot {{ slot.slot_number }} - {{ slot.budget_line.name }}
                                            </option>
                                        </select>
                                        <div v-if="allocationErrors.position_slot_id" class="invalid-feedback">
                                            {{ allocationErrors.position_slot_id }}
                                        </div>
                                    </div>
                                </template>

                                <div class="form-group">
                                    <small class="text-muted">Effort (%)</small>
                                    <input type="number" v-model.number="currentAllocation.level_of_effort"
                                        @input="onEffortChange" class="form-control" min="0" max="100"
                                        placeholder="Effort (%)" :disabled="isLoadingData" />
                                    <div v-if="allocationErrors.level_of_effort" class="invalid-feedback">
                                        {{ allocationErrors.level_of_effort }}
                                    </div>
                                </div>

                                <!-- Display Calculated Salary (read-only) -->
                                <div class="form-group">
                                    <small class="text-muted">Calculated Salary</small>
                                    <input type="text" class="form-control"
                                        :value="getCalculatedSalary(currentAllocation.level_of_effort)"
                                        placeholder="Calculated Salary" readonly style="background-color: #f8f9fa;" />
                                </div>

                                <div class="form-group" style="min-width:72px;">
                                    <small class="text-muted">&nbsp;</small>
                                    <button type="button" class="btn btn-save" style="width:100%;"
                                        @click="addAllocation" :disabled="isLoadingData">
                                        {{ editingIndex !== null ? 'Save' : 'Add' }}
                                    </button>
                                </div>

                            </div>
                        </div>

                        <!-- Funding Allocations Table -->
                        <table v-if="fundingAllocations.length > 0" class="allocation-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Grant</th>
                                    <th>Department Position</th>
                                    <th>Grant Position</th>
                                    <th>Position Slot</th>
                                    <th>Effort (%)</th>
                                    <th>Allocated Salary</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in fundingAllocations" :key="idx">
                                    <template v-if="editingIndex === idx">
                                        <!-- Inline Edit Row -->
                                        <td>
                                            <span class="badge"
                                                :class="row.allocation_type === 'org_funded' ? 'badge-org' : 'badge-grant'">
                                                {{ row.allocation_type === 'org_funded' ? 'Org Funded' : 'Grant Funded'
                                                }}
                                            </span>
                                        </td>
                                        <td>
                                            <select v-model="editData.grant_id" @change="onEditGrantChange"
                                                class="edit-field">
                                                <option value="">Select grant</option>
                                                <option v-for="grant in grantOptions" :key="grant.id" :value="grant.id">
                                                    {{ grant.name }} ({{ grant.code }})
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            <select v-if="isOrgFundGrant(editData.grant_id)"
                                                v-model="editData.department_position_id" class="edit-field">
                                                <option value="">Select department position</option>
                                                <option v-for="position in departmentPositions" :key="position.id"
                                                    :value="position.id">
                                                    {{ position.department }} - {{ position.position }}
                                                </option>
                                            </select>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <select v-if="!isOrgFundGrant(editData.grant_id)"
                                                v-model="editData.grant_items_id" @change="onEditGrantPositionChange"
                                                class="edit-field">
                                                <option value="">Select position</option>
                                                <option v-for="position in editGrantPositionOptions" :key="position.id"
                                                    :value="position.id">
                                                    {{ position.name }}
                                                </option>
                                            </select>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <select v-if="!isOrgFundGrant(editData.grant_id)"
                                                v-model="editData.position_slot_id" class="edit-field">
                                                <option value="">Select position slot</option>
                                                <option v-for="slot in editPositionSlotOptions" :key="slot.id"
                                                    :value="slot.id">
                                                    Slot {{ slot.slot_number }} - {{ slot.budget_line.name }}
                                                </option>
                                            </select>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <input type="number" v-model.number="editData.level_of_effort"
                                                @input="onEditEffortChange" class="edit-field" min="0" max="100">
                                        </td>
                                        <td>
                                            <span class="text-muted">{{ getCalculatedSalary(editData.level_of_effort)
                                                }}</span>
                                        </td>
                                        <td>
                                            <button class="action-btn" @click="saveEdit">Save</button>
                                            <button class="action-btn delete" @click="cancelEdit">Cancel</button>
                                        </td>
                                    </template>
                                    <template v-else>
                                        <!-- Display Row -->
                                        <td>
                                            <span class="badge"
                                                :class="row.allocation_type === 'org_funded' ? 'badge-org' : 'badge-grant'">
                                                {{ row.allocation_type === 'org_funded' ? 'Org Funded' : 'Grant Funded'
                                                }}
                                            </span>
                                        </td>
                                        <td>{{ getGrantName(row.grant_id, row._original) }}</td>
                                        <td>
                                            <span v-if="row.allocation_type === 'org_funded'">{{
                                                getDepartmentPositionName(row.department_position_id) }}</span>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <span v-if="row.allocation_type !== 'org_funded'">{{
                                                getGrantPositionName(row.grant_id,
                                                    row.grant_items_id, row._original) }}</span>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <span v-if="row.allocation_type !== 'org_funded'">{{
                                                getPositionSlotName(row.grant_id,
                                                    row.grant_items_id, row.position_slot_id, row._original) }}</span>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>{{ row.level_of_effort }}%</td>
                                        <td>{{ getAllocatedSalary(row) }}</td>
                                        <td>
                                            <button class="action-btn" @click="editAllocation(idx)">Edit</button>
                                            <button class="action-btn delete"
                                                @click="deleteAllocation(idx)">Delete</button>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Total Summary Row -->
                        <div v-if="fundingAllocations.length > 0" class="total-summary">
                            <div class="summary-row">
                                <span class="summary-label">Total Effort:</span>
                                <span class="summary-value" :class="{ 'text-danger': totalEffort !== 100 }">{{
                                    totalEffort }}%</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Total Allocated Salary:</span>
                                <span class="summary-value">{{ formatCurrency(totalAllocatedSalary) }}</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Position Salary:</span>
                                <span class="summary-value">{{ formatCurrency(formData.position_salary) }}</span>
                            </div>
                        </div>

                        <!-- No Allocations Message -->
                        <div v-else-if="formData.employee_id && !isLoadingData" class="no-allocations-msg">
                            <p class="text-muted text-center">No funding allocations added. Please add at least one
                                allocation.</p>
                        </div>

                        <!-- Enhanced Benefits Section -->
                        <div class="form-group">
                            <label class="form-label">Benefits</label>

                            <div class="checkbox-group">
                                <label class="checkbox-item">
                                    <input type="checkbox" v-model="formData.health_welfare" @change="saveFormState" />
                                    <span class="checkmark"></span>
                                    Health & Welfare
                                </label>

                                <label class="checkbox-item">
                                    <input type="checkbox" v-model="formData.saving_fund" @change="saveFormState" />
                                    <span class="checkmark"></span>
                                    Saving Fund
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" v-model="formData.pvd" @change="saveFormState" />
                                    <span class="checkmark"></span>
                                    PVD
                                </label>
                            </div>
                        </div>

                        <!-- Submit Buttons -->
                        <div class="btn-row">
                            <button type="button" class="btn btn-cancel" @click="handleModalClose">Cancel</button>
                            <button type="submit" class="btn btn-save" :disabled="isSubmitting || isLoadingData">
                                <span v-if="isSubmitting">Updating...</span>
                                <span v-else>Update Employment</span>
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
import { ref, createVNode, nextTick } from 'vue';
import { Modal as AntModal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { employmentService } from '@/services/employment.service';
import { employeeService } from '@/services/employee.service';
import { departmentPositionService } from '@/services/department-position.service';
import { workLocationService } from '@/services/worklocation.service';
import { employeeGrantAllocationService } from '@/services/employee-grant-allocation.service';
import { useLookupStore } from '@/stores/lookupStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';

export default {
    name: 'EmploymentEditModal',
    setup() {
        const employmentData = ref(null);
        const alertMessage = ref('');
        const alertClass = ref('');
        return {
            employmentData,
            alertMessage,
            alertClass
        };
    },
    data() {
        return {
            // Performance optimization flag
            dataLoaded: false,

            formData: {
                employment_id: null,
                employee_id: '',
                employment_type: '',
                pay_method: '',
                department_position_id: '',
                work_location_id: '',
                start_date: '',
                end_date: '',
                probation_pass_date: '',
                position_salary: '',
                probation_salary: '',

                fte: 1.0,
                health_welfare: false,
                pvd: false,
                saving_fund: false
            },
            currentAllocation: {
                allocation_type: '',
                grant_id: '',
                grant_items_id: '',
                position_slot_id: '',
                department_position_id: '',
                level_of_effort: 100,

            },
            editData: {
                allocation_type: '',
                grant_id: '',
                grant_items_id: '',
                position_slot_id: '',
                department_position_id: '',
                level_of_effort: 100
            },
            fundingAllocations: [],
            editingIndex: null,
            selectedEmployeeInfo: null,
            isSubmitting: false,
            isLoadingData: false,
            modalInstance: null,

            // Date format - same as employee-list-modal
            dateFormat: "dd-MM-yyyy",

            // Validation errors
            validationErrors: {},
            allocationErrors: {},

            // Data sources
            employees: [],
            employeeTreeData: [],
            departmentPositions: [],
            workLocations: [],
            employmentTypes: [],
            payMethods: [
                { id: 1, value: 'Transferred to bank' },
                { id: 2, value: 'Cash cheque' }
            ],
            grantOptions: [],
            orgFundedOptions: [],
            grantPositions: {},

            // Computed options for dropdowns
            grantPositionOptions: [],
            positionSlotOptions: [],
            editGrantPositionOptions: [],
            editPositionSlotOptions: []
        };
    },

    computed: {
        isLocalIDStaff() {
            return this.formData.employment_type === 'Local ID Staff';
        },
        isLocalNonIDStaff() {
            return this.formData.employment_type === 'Local non ID Staff';
        },
        totalEffort() {
            return this.fundingAllocations.reduce((sum, allocation) => sum + allocation.level_of_effort, 0);
        },
        totalAllocatedSalary() {
            return this.fundingAllocations.reduce((sum, allocation) => {
                const salary = this.calculateSalaryFromEffort(allocation.level_of_effort);
                return sum + salary;
            }, 0);
        }
    },

    watch: {
        employmentData: {
            handler(newVal) {
                if (newVal) {
                    this.formData = { ...newVal };

                    // Ensure department_position_id is properly set
                    if (newVal.department_position_id) {
                        // Convert to number to match dropdown option values
                        this.formData.department_position_id = parseInt(newVal.department_position_id);
                        console.log('🔧 Setting department_position_id from API:', newVal.department_position_id, '-> converted to:', this.formData.department_position_id);
                    }

                    // Convert dates to Date objects for the date-picker component
                    if (this.formData.start_date) {
                        this.formData.start_date = new Date(this.formData.start_date);
                    }
                    if (this.formData.end_date) {
                        this.formData.end_date = new Date(this.formData.end_date);
                    }
                    if (this.formData.probation_pass_date) {
                        this.formData.probation_pass_date = new Date(this.formData.probation_pass_date);
                    }

                    // Load funding allocations when employment data is set in edit mode
                    if (newVal.id) {
                        this.loadEmployeeFundingAllocations(newVal.id);
                    }

                    // Set selected employee info if available
                    if (newVal.employee) {
                        this.selectedEmployeeInfo = {
                            name: `${newVal.employee.first_name_en || ''} ${newVal.employee.last_name_en || ''}`.trim(),
                            staff_id: newVal.employee.staff_id || 'N/A',
                            subsidiary: newVal.employee.subsidiary || 'N/A'
                        };
                    }
                }
            },
            deep: true
        }
    },

    async created() {
        try {
            // Don't load initial data here - load only when modal opens
            // This improves page load performance significantly
            console.log('📝 Employment edit modal component created, data will load when opened');
        } catch (error) {
            console.error('Error during component initialization:', error);
        }
    },

    mounted() {
        // Initialize the Bootstrap modal
        const modalElement = document.getElementById('employmentEditModal');
        if (modalElement) {
            this.modalInstance = new Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });

            // Clean up when modal is actually hidden
            modalElement.addEventListener('hidden.bs.modal', () => {
                this.employmentData = null;
                this.cleanupModalBackdrops();
            });
        }
    },

    beforeUnmount() {
        // Clean up modal instance
        if (this.modalInstance && typeof this.modalInstance.dispose === 'function') {
            try {
                this.modalInstance.dispose();
            } catch (error) {
                console.error('Error disposing modal:', error);
            }
        }

        // Remove any lingering backdrops
        this.cleanupModalBackdrops();
    },

    methods: {
        // Save form state (not needed for edit mode but keeping for consistency)
        saveFormState() {
            // This method is called by form inputs but we don't need to save drafts for edit mode
        },

        // Handle date picker changes
        handleDateChange(fieldName, newValue) {
            try {
                const safeDate = this.safeConvertToDate(newValue);
                this.formData[fieldName] = safeDate;
                this.saveFormState();
            } catch (error) {
                console.error('Error handling date change:', error);
            }
        },

        // Safe date conversion helper
        safeConvertToDate(dateValue) {
            if (!dateValue) return null;

            try {
                // If it's already a Date object, return it
                if (dateValue instanceof Date) {
                    return isNaN(dateValue.getTime()) ? null : dateValue;
                }

                // If it's a string, try to parse it
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

        // Clean up stray modal backdrops
        cleanupModalBackdrops() {
            nextTick(() => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                const activeModals = document.querySelectorAll('.modal.show');

                if (activeModals.length === 0 && backdrops.length > 0) {
                    backdrops.forEach(backdrop => backdrop.remove());
                }
            });
        },

        // Handle modal close
        async handleModalClose() {
            await this.safeHideModal();
        },

        // Safe modal hide helper
        safeHideModal() {
            return new Promise((resolve) => {
                nextTick(() => {
                    if (this.modalInstance) {
                        try {
                            const modalEl = document.getElementById('employmentEditModal');
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

        isOrgFundGrant(grantId) {
            // This logic should be adapted based on how org-funded grants are identified.
            // Using a hardcoded list of codes as an example, similar to grant-position-modal.
            const hubGrantCodes = ['S0031', 'S22001'];
            const grant = this.grantOptions.find(g => g.id == grantId);
            return grant && hubGrantCodes.includes(grant.code);
        },

        async loadInitialData() {
            this.isLoadingData = true;

            try {
                console.log('📥 Loading employment edit modal data using shared store...');
                const sharedStore = useSharedDataStore();

                // Load all dropdown data in parallel using shared store
                await Promise.all([
                    sharedStore.loadAllDropdownData({
                        includeEmployees: true,
                        includeDepartmentPositions: true,
                        includeWorkLocations: true,
                        includeGrantStructure: true, // Include for funding allocations
                        force: false // Use cache if available
                    }),
                    this.initFetchLookups() // Still need lookups for employment types
                ]);

                // Copy data from shared store to local properties for reactivity
                this.employeeTreeData = sharedStore.getEmployeeTreeData;
                this.departmentPositions = sharedStore.getDepartmentPositions;
                this.workLocations = sharedStore.getWorkLocations;
                this.grantOptions = sharedStore.getGrantOptions;
                this.grantPositions = sharedStore.getGrantPositions;

                console.log('✅ Employment edit modal data loaded from shared store');
            } catch (error) {
                console.error('❌ Error loading employment edit modal data:', error);
                this.alertMessage = `Failed to load form data: ${error.message}`;
                this.alertClass = 'alert-danger';
            } finally {
                this.isLoadingData = false;
            }
        },

        // Clear validation errors
        clearValidationErrors() {
            this.validationErrors = {};
            this.allocationErrors = {};
            this.alertMessage = '';
            this.alertClass = '';
        },

        // Validate main form data for edit mode (optional allocations)
        validateForm() {
            this.clearValidationErrors();
            let isValid = true;

            if (!this.formData.employee_id) {
                this.validationErrors.employee_id = 'Please select an employee';
                isValid = false;
            }

            if (!this.formData.employment_type) {
                this.validationErrors.employment_type = 'Please select employment type';
                isValid = false;
            }

            if (!this.formData.department_position_id) {
                this.validationErrors.department_position_id = 'Please select department position';
                isValid = false;
            }

            if (!this.formData.work_location_id) {
                this.validationErrors.work_location_id = 'Please select work location';
                isValid = false;
            }

            if (!this.formData.start_date) {
                this.validationErrors.start_date = 'Please select start date';
                isValid = false;
            }

            if (!this.formData.position_salary) {
                this.validationErrors.position_salary = 'Please enter position salary';
                isValid = false;
            }

            // For edit mode, allocations are optional but if provided must total 100%
            if (this.fundingAllocations.length > 0 && this.totalEffort !== 100) {
                this.alertMessage = `If allocations are provided, total effort must equal 100%. Current total: ${this.totalEffort}%`;
                this.alertClass = 'alert-danger';
                isValid = false;
            }

            return isValid;
        },

        // Validate current allocation before adding to table (updated)
        validateCurrentAllocation() {
            this.allocationErrors = {};
            let isValid = true;

            if (!this.currentAllocation.grant_id) {
                this.allocationErrors.grant_id = 'Please select a grant';
                isValid = false;
            }

            if (this.isOrgFundGrant(this.currentAllocation.grant_id)) {
                if (!this.currentAllocation.department_position_id) {
                    this.allocationErrors.department_position_id = 'Please select a department position';
                    isValid = false;
                }
            } else {
                if (!this.currentAllocation.grant_items_id) {
                    this.allocationErrors.grant_items_id = 'Please select a grant position';
                    isValid = false;
                }
                if (!this.currentAllocation.position_slot_id) {
                    this.allocationErrors.position_slot_id = 'Please select a position slot';
                    isValid = false;
                }
            }

            if (!this.currentAllocation.level_of_effort || this.currentAllocation.level_of_effort <= 0) {
                this.allocationErrors.level_of_effort = 'Please enter a valid effort percentage';
                isValid = false;
            }

            if (this.currentAllocation.level_of_effort > 100) {
                this.allocationErrors.level_of_effort = 'Effort percentage cannot exceed 100%';
                isValid = false;
            }

            return isValid;
        },

        // OPTIMIZED: Single method to fetch all required lookups
        async initFetchLookups() {
            try {
                const lookupStore = useLookupStore();

                // Only fetch lookups if they haven't been loaded yet
                if (!lookupStore.lookups.length) {
                    console.log('🔄 Fetching lookups from API...');
                    await lookupStore.fetchAllLookupLists();
                    console.log('✅ Lookups fetched successfully');
                } else {
                    console.log('✅ Lookups already loaded from store');
                }

                // Get employment types from the store
                this.employmentTypes = lookupStore.getLookupsByType('employment_type');

                // Pay methods are now hardcoded in data() section
                console.log(`📊 Loaded ${this.employmentTypes.length} employment types`);
                console.log(`📊 Using ${this.payMethods.length} hardcoded pay methods`);

            } catch (error) {
                console.error('❌ Error loading lookups:', error);
                this.alertMessage = 'Failed to load form data';
                this.alertClass = 'alert-danger';
            }
        },

        onEmployeeChange() {
            if (this.formData.employee_id) {
                console.log('Employee selected:', this.formData.employee_id);
                const sharedStore = useSharedDataStore();
                const employee = sharedStore.findEmployeeInTree(this.formData.employee_id);

                if (employee) {
                    // Get subsidiary from parent node in tree structure
                    const subsidiary = sharedStore.getEmployeeSubsidiary(this.formData.employee_id);

                    this.selectedEmployeeInfo = {
                        name: employee.title,
                        staff_id: employee.staff_id || 'N/A',
                        subsidiary: subsidiary || 'N/A',
                        status: employee.status || 'N/A'
                    };

                    // Auto-select benefits based on employee status
                    this.autoSelectBenefitsBasedOnStatus(employee.status);
                }
            } else {
                this.selectedEmployeeInfo = null;
                // Reset benefits when no employee is selected
                this.formData.pvd = false;
                this.formData.saving_fund = false;
            }
            this.saveFormState();
        },

        // Auto-select benefits based on employee status
        autoSelectBenefitsBasedOnStatus(status) {
            console.log('Auto-selecting benefits for status:', status);

            // Reset benefits first
            this.formData.pvd = false;
            this.formData.saving_fund = false;

            if (!status) return;

            // Auto-select based on status
            if (status === 'Local ID') {
                this.formData.pvd = true;
                this.formData.saving_fund = false;
                console.log('✅ Auto-selected PVD for Local ID staff');
            } else if (status === 'Local non ID' || status === 'Local non ID Staff') {
                this.formData.pvd = false;
                this.formData.saving_fund = true;
                console.log('✅ Auto-selected Saving Fund for Local non ID staff');
            } else {
                // For other statuses (Expats, etc.), don't auto-select anything
                console.log('ℹ️ No auto-selection for status:', status);
            }

            // Save form state after auto-selection
            this.saveFormState();
        },

        async onGrantChange() {
            console.log('Grant changed:', this.currentAllocation.grant_id);

            // Determine allocation type and load necessary data
            if (this.isOrgFundGrant(this.currentAllocation.grant_id)) {
                this.currentAllocation.allocation_type = 'org_funded';
                // Clear grant-specific fields
                this.currentAllocation.grant_items_id = '';
                this.currentAllocation.position_slot_id = '';
                this.grantPositionOptions = [];
                this.positionSlotOptions = [];
                // Load department positions if not already loaded using shared store
                if (this.departmentPositions.length === 0) {
                    const sharedStore = useSharedDataStore();
                    await sharedStore.fetchDepartmentPositions();
                    this.departmentPositions = sharedStore.getDepartmentPositions;
                }
            } else {
                this.currentAllocation.allocation_type = 'grant';
                // Clear org-funded fields
                this.currentAllocation.department_position_id = '';
                // Set options for grant position dropdown
                this.grantPositionOptions = this.grantPositions[this.currentAllocation.grant_id] || [];
                this.positionSlotOptions = [];
            }

            console.log('Available positions for grant:', this.grantPositionOptions);
            this.allocationErrors = {};
            this.saveFormState();
        },

        onGrantPositionChange() {
            console.log('Grant position changed:', this.currentAllocation.grant_items_id);
            this.currentAllocation.position_slot_id = '';
            const position = this.grantPositionOptions.find(p => p.id == this.currentAllocation.grant_items_id);
            this.positionSlotOptions = position ? position.position_slots || [] : [];
            delete this.allocationErrors.position_slot_id;
            this.saveFormState();
        },

        onEditGrantChange() {
            this.editData.grant_items_id = '';
            this.editData.position_slot_id = '';
            this.editData.department_position_id = '';
            this.editData.level_of_effort = 100; // Reset effort to 100 for new allocation

            if (this.isOrgFundGrant(this.editData.grant_id)) {
                this.editData.allocation_type = 'org_funded';
            } else {
                this.editData.allocation_type = 'grant';
                this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
                const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
                this.editPositionSlotOptions = position ? position.position_slots || [] : [];
            }
        },

        onEditGrantPositionChange() {
            this.editData.position_slot_id = '';
            const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
            this.editPositionSlotOptions = position ? position.position_slots || [] : [];
        },

        addAllocation() {
            console.log('Adding allocation to memory:', this.currentAllocation);

            if (!this.validateCurrentAllocation()) {
                return;
            }

            // Check for duplicates
            const isDuplicate = this.fundingAllocations.some((a, i) => {
                if (this.editingIndex !== null && i === this.editingIndex) return false;

                if (this.currentAllocation.allocation_type === 'grant') {
                    return a.position_slot_id === this.currentAllocation.position_slot_id;
                }
                if (this.currentAllocation.allocation_type === 'org_funded') {
                    // Assuming a combination of grant and department position is unique for org_funded
                    return a.grant_id === this.currentAllocation.grant_id && a.department_position_id === this.currentAllocation.department_position_id;
                }
                return false;
            });

            if (isDuplicate) {
                this.alertMessage = 'This allocation is already added.';
                this.alertClass = 'alert-danger';
                return;
            }

            // Check if total effort would exceed 100%
            const currentTotal = this.fundingAllocations.reduce((sum, a, i) => {
                return i === this.editingIndex ? sum : sum + a.level_of_effort;
            }, 0);

            if (currentTotal + this.currentAllocation.level_of_effort > 100) {
                this.alertMessage = `Adding this allocation would exceed 100% effort. Available: ${100 - currentTotal}%`;
                this.alertClass = 'alert-danger';
                return;
            }

            const allocation = { ...this.currentAllocation };

            if (this.editingIndex !== null) {
                this.fundingAllocations[this.editingIndex] = allocation;
                this.editingIndex = null;
                console.log('Updated allocation in memory');
            } else {
                this.fundingAllocations.push(allocation);
                console.log('Added new allocation to memory. Total allocations:', this.fundingAllocations.length);
            }

            // Reset current allocation form
            this.currentAllocation = {
                allocation_type: '',
                grant_id: '',
                grant_items_id: '',
                position_slot_id: '',
                department_position_id: '',
                level_of_effort: 100
            };
            this.grantPositionOptions = [];
            this.positionSlotOptions = [];
            this.allocationErrors = {};
            this.alertMessage = '';
            this.alertClass = '';
            this.saveFormState();
        },

        editAllocation(index) {
            console.log('Editing allocation at index:', index);
            this.editingIndex = index;
            this.editData = { ...this.fundingAllocations[index] };

            if (this.isOrgFundGrant(this.editData.grant_id)) {
                this.editData.allocation_type = 'org_funded';
            } else {
                this.editData.allocation_type = 'grant';
                this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
                const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
                this.editPositionSlotOptions = position ? position.position_slots || [] : [];
            }
        },

        saveEdit() {
            // Similar validation and save logic as addAllocation
            this.fundingAllocations[this.editingIndex] = { ...this.editData };
            this.editingIndex = null;
            this.alertMessage = '';
            this.alertClass = '';
            this.saveFormState();
        },

        cancelEdit() {
            this.editingIndex = null;
        },

        deleteAllocation(index) {
            this.fundingAllocations.splice(index, 1);
            this.editingIndex = null;
            this.saveFormState();
        },

        // Helper methods for displaying data
        getGrantName(grantId, originalData = null) {
            if (originalData && originalData.grant_name && originalData.grant_code) {
                return `${originalData.grant_name} (${originalData.grant_code})`;
            }
            const grant = this.grantOptions.find(g => g.id == grantId);
            return grant ? `${grant.name} (${grant.code})` : 'Unknown Grant';
        },

        getDepartmentPositionName(id) {
            const pos = this.departmentPositions.find(p => p.id == id);
            return pos ? `${pos.department} - ${pos.position}` : 'Unknown Position';
        },

        getGrantPositionName(grantId, positionId, originalData = null) {
            // First try to use original data from API response
            if (originalData && originalData.grant_position) {
                return originalData.grant_position;
            }

            // Fallback to finding from loaded grant structure
            const positions = this.grantPositions[grantId] || [];
            const position = positions.find(p => p.id == positionId);
            return position ? position.name : 'Unknown Position';
        },

        getPositionSlotName(grantId, positionId, positionSlotId, originalData = null) {
            // First try to use original data from API response
            if (originalData && originalData.slot_number && originalData.budget_line_code) {
                return `Slot ${originalData.slot_number} - ${originalData.budget_line_code}`;
            }

            // Fallback to finding from loaded grant structure
            const positions = this.grantPositions[grantId] || [];
            const position = positions.find(p => p.id == positionId);
            if (!position || !position.position_slots) return 'Unknown Slot';
            const slot = position.position_slots.find(s => s.id == positionSlotId);
            return slot ? `Slot ${slot.slot_number} - ${slot.budget_line.name}` : 'Unknown Slot';
        },

        getOrgFundedName(orgFundedId, originalData = null) {
            if (originalData && originalData.org_funded_name) {
                return originalData.org_funded_name;
            }
            const orgFunded = this.orgFundedOptions.find(o => o.id == orgFundedId);
            return orgFunded ? orgFunded.name : 'Unknown Org Funding';
        },

        // Helper method to get grant salary from grant position
        getGrantSalary(grantId, grantItemsId, originalData = null) {
            // If we have original data from API response, use it
            if (originalData && originalData.grant_salary) {
                return this.formatCurrency(originalData.grant_salary);
            }

            // Otherwise, find it from our loaded grant structure
            if (!grantId || !grantItemsId) {
                return '-';
            }

            const positions = this.grantPositions[grantId] || [];
            const position = positions.find(p => p.id == grantItemsId);

            if (position && position.grant_salary) {
                return this.formatCurrency(position.grant_salary);
            }

            return '-';
        },

        // New method to calculate salary based on effort percentage
        calculateSalaryFromEffort(effortPercentage) {
            if (!this.formData.position_salary || !effortPercentage) {
                return 0;
            }
            return (this.formData.position_salary * effortPercentage) / 100;
        },

        // Method to get calculated salary for current allocation display
        getCalculatedSalary(effortPercentage) {
            if (!effortPercentage || !this.formData.position_salary) {
                return this.formatCurrency(0);
            }
            const salary = this.calculateSalaryFromEffort(effortPercentage);
            return this.formatCurrency(salary);
        },

        // Method to get allocated salary for table display
        getAllocatedSalary(allocation) {
            const salary = this.calculateSalaryFromEffort(allocation.level_of_effort);
            return this.formatCurrency(salary);
        },

        // Event handler for effort change in current allocation
        onEffortChange() {
            // This will trigger reactivity to update the calculated salary display
            // No additional logic needed as the computed display will update automatically
            this.saveFormState();
        },

        // Event handler for effort change in edit mode
        onEditEffortChange() {
            // This will trigger reactivity to update the calculated salary display
            // No additional logic needed as the computed display will update automatically
        },

        // Helper method to format currency (updated for THB)
        formatCurrency(value) {
            if (value === null || value === undefined || value === '') {
                return '-';
            }
            return new Intl.NumberFormat('th-TH', {
                style: 'currency',
                currency: 'THB',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        },

        async openModal() {
            this.clearValidationErrors();

            // Always ensure initial data is loaded before proceeding
            if (!this.dataLoaded) {
                console.log('📥 Loading modal data for first time...');
                await this.loadInitialData();
                this.dataLoaded = true;
            }

            // Editing existing employment - populate form with employment data
            if (this.employmentData) {
                this.formData = { ...this.employmentData };

                // Ensure department_position_id is properly set
                if (this.employmentData.department_position_id) {
                    // Convert to number to match dropdown option values
                    this.formData.department_position_id = parseInt(this.employmentData.department_position_id);
                    console.log('🔧 Setting department_position_id from API in openModal:', this.employmentData.department_position_id, '-> converted to:', this.formData.department_position_id);
                }

                // Convert dates to Date objects for the date-picker component
                if (this.formData.start_date) {
                    this.formData.start_date = new Date(this.formData.start_date);
                }
                if (this.formData.end_date) {
                    this.formData.end_date = new Date(this.formData.end_date);
                }
                if (this.formData.probation_pass_date) {
                    this.formData.probation_pass_date = new Date(this.formData.probation_pass_date);
                }

                // Set selected employee info if available
                if (this.employmentData.employee) {
                    this.selectedEmployeeInfo = {
                        name: `${this.employmentData.employee.first_name_en || ''} ${this.employmentData.employee.last_name_en || ''}`.trim(),
                        staff_id: this.employmentData.employee.staff_id || 'N/A',
                        subsidiary: this.employmentData.employee.subsidiary || 'N/A'
                    };
                }

                // Load existing funding allocations if editing
                if (this.employmentData.id) {
                    this.loadEmployeeFundingAllocations(this.employmentData.id);
                }
            }

            if (this.modalInstance) {
                this.modalInstance.show();
            } else {
                const modalElement = document.getElementById('employmentEditModal');
                if (modalElement) {
                    this.modalInstance = new Modal(modalElement);
                    this.modalInstance.show();
                }
            }
        },

        async loadEmployeeFundingAllocations(employmentId) {
            try {
                console.log('Loading funding allocations for employment:', employmentId);
                this.isLoadingData = true;

                // Call the API to get funding allocations
                const response = await employmentService.getFundingAllocations(employmentId);
                console.log('API Response for funding allocations:', response);

                if (response.success && response.data) {
                    // Handle both possible response structures
                    const allocationsData = response.data.funding_allocations || response.data;
                    console.log('Found funding allocations from API:', allocationsData);

                    // Map the API response to our internal format
                    this.fundingAllocations = allocationsData.map(allocation => {
                        // Convert level_of_effort from decimal string to percentage number
                        const effortPercentage = parseFloat(allocation.level_of_effort) * 100;

                        if (allocation.allocation_type === 'org_funded') {
                            // Handle org_funded allocations
                            return {
                                id: allocation.id,
                                allocation_type: 'org_funded',
                                grant_id: allocation.org_funded?.grant?.id || '',
                                grant_items_id: '',
                                position_slot_id: '',
                                department_position_id: allocation.org_funded?.department_position?.id || '',
                                level_of_effort: effortPercentage,

                                // Additional data for display purposes
                                _original: {
                                    grant_name: allocation.org_funded?.grant?.name || 'Other Fund',
                                    grant_code: allocation.org_funded?.grant?.code || '',
                                    grant_position: '',
                                    slot_number: '',
                                    budget_line_code: '',
                                    allocated_amount: allocation.allocated_amount,
                                    formatted_allocated_amount: allocation.formatted_allocated_amount,
                                    start_date: allocation.start_date,
                                    end_date: allocation.end_date,
                                    org_funded_name: 'Org Funded'
                                }
                            };
                        } else {
                            // Handle grant allocations (position_slot based)
                            return {
                                id: allocation.id,
                                allocation_type: 'grant',
                                grant_id: allocation.position_slot?.grant_item?.grant?.id || '',
                                grant_items_id: allocation.position_slot?.grant_item?.id || '',
                                position_slot_id: allocation.position_slot?.id || '',
                                department_position_id: '',
                                level_of_effort: effortPercentage,

                                // Additional data for display purposes
                                _original: {
                                    grant_name: allocation.position_slot?.grant_item?.grant?.name || 'Unknown Grant',
                                    grant_code: allocation.position_slot?.grant_item?.grant?.code || '',
                                    grant_position: allocation.position_slot?.grant_item?.grant_position || allocation.position_slot?.grant_item?.name || '',
                                    slot_number: allocation.position_slot?.slot_number || '',
                                    budget_line_code: allocation.position_slot?.budget_line?.budget_line_code || allocation.position_slot?.budget_line?.description || '',
                                    allocated_amount: allocation.allocated_amount,
                                    formatted_allocated_amount: allocation.formatted_allocated_amount,
                                    start_date: allocation.start_date,
                                    end_date: allocation.end_date,
                                    grant_salary: allocation.position_slot?.grant_item?.grant_salary || null
                                }
                            };
                        }
                    });

                    console.log('Mapped funding allocations from API:', this.fundingAllocations);
                } else {
                    console.log('No funding allocations found in API response');
                    this.fundingAllocations = [];
                }

            } catch (error) {
                console.error('Error loading funding allocations from API:', error);
                this.fundingAllocations = [];

                // Only show error message if it's not a 404 (no allocations found)
                if (error.response?.status !== 404) {
                    this.alertMessage = 'Failed to load existing funding allocations';
                    this.alertClass = 'alert-danger';
                } else {
                    console.log('No funding allocations exist for this employment (404 response)');
                }
            } finally {
                this.isLoadingData = false;
            }
        },

        // Build payload for API based on edit mode
        buildPayloadForAPI() {
            const basePayload = {
                // Employment data - matching backend field names exactly
                employee_id: this.formData.employee_id,
                employment_type: this.formData.employment_type,
                pay_method: this.formData.pay_method || null,
                probation_pass_date: this.formatDateForAPI(this.formData.probation_pass_date),
                start_date: this.formatDateForAPI(this.formData.start_date),
                end_date: this.formatDateForAPI(this.formData.end_date),
                department_position_id: this.formData.department_position_id || null,
                work_location_id: this.formData.work_location_id || null,
                position_salary: this.formData.position_salary,
                probation_salary: this.formData.probation_salary || null,
                fte: this.formData.fte || null,
                health_welfare: !!this.formData.health_welfare,
                pvd: !!this.formData.pvd,
                saving_fund: !!this.formData.saving_fund
            };

            // For update mode, only include changed fields and optionally include allocations
            const updatePayload = {};

            // Only include fields that have values (backend update method accepts nullable fields)
            Object.keys(basePayload).forEach(key => {
                const value = basePayload[key];
                if (value !== null && value !== undefined && value !== '') {
                    updatePayload[key] = value;
                }
            });

            // Always include boolean fields for updates (they can be false)
            updatePayload.health_welfare = !!this.formData.health_welfare;
            updatePayload.pvd = !!this.formData.pvd;
            updatePayload.saving_fund = !!this.formData.saving_fund;

            // Include allocations if they exist (optional for updates)
            if (this.fundingAllocations.length > 0) {
                updatePayload.allocations = this.fundingAllocations.map(allocation => {
                    const isOrgFunded = allocation.allocation_type === 'org_funded';
                    const calculatedSalary = this.calculateSalaryFromEffort(allocation.level_of_effort);

                    if (isOrgFunded) {
                        return {
                            allocation_type: 'org_funded',
                            grant_id: allocation.grant_id,
                            level_of_effort: allocation.level_of_effort,
                            allocated_amount: calculatedSalary
                        };
                    } else {
                        return {
                            allocation_type: 'grant',
                            position_slot_id: allocation.position_slot_id,
                            level_of_effort: allocation.level_of_effort,
                            allocated_amount: calculatedSalary
                        };
                    }
                });
            }

            return updatePayload;
        },

        async handleSubmit() {
            try {
                console.log('Updating employment with funding allocations...', {
                    formData: this.formData,
                    fundingAllocations: this.fundingAllocations,
                    totalAllocations: this.fundingAllocations.length
                });

                if (!this.validateForm()) {
                    console.log('Form validation failed');
                    return;
                }

                this.isSubmitting = true;

                // Prepare payload to match backend API expectations
                const payload = this.buildPayloadForAPI();

                console.log('Payload for API:', payload);

                // For updating, use the update API with optional allocations
                const response = await employmentService.updateEmployment(this.employmentData.id, payload);

                console.log('API Response:', response);

                this.alertMessage = 'Employment Updated!';
                this.alertClass = 'alert-success';

                setTimeout(() => {
                    this.alertMessage = '';
                    if (this.modalInstance) {
                        this.modalInstance.hide();
                    }
                }, 1800);

                this.$emit('employment-updated', {
                    success: true,
                    message: 'Employment updated successfully',
                    data: response.data
                });

            } catch (error) {
                console.error('Error submitting form:', error);

                // Handle validation errors from backend
                if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;

                    // Handle array of errors
                    if (Array.isArray(errors)) {
                        this.alertMessage = errors.join(', ');
                    }
                    // Handle object of field errors
                    else if (typeof errors === 'object') {
                        this.validationErrors = errors;
                        this.alertMessage = 'Please fix the validation errors below';
                    } else {
                        this.alertMessage = error.response.data.message || 'Validation failed';
                    }
                } else {
                    this.alertMessage = error.response?.data?.message || 'Failed to update employment';
                }

                this.alertClass = 'alert-danger';
                throw error; // Re-throw to be caught by saveAndCloseModal if needed
            } finally {
                this.isSubmitting = false;
            }
        },

        // Helper function to format date for API
        formatDateForAPI(date) {
            if (!date) return null;

            // If it's already a string in YYYY-MM-DD format, use it as is
            if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return date;
            }

            // Convert Date object to YYYY-MM-DD format
            if (date instanceof Date) {
                return date.toISOString().split('T')[0];
            }

            return null;
        },

        // getPopupContainer ensures the dropdown is appended to document.body
        getPopupContainer(trigger) {
            return (typeof window !== 'undefined' && window.document && window.document.body)
                ? window.document.body
                : trigger.parentNode;
        }
    }
};
</script>

<style scoped>
/* New Modal Design Styles (same as employment-modal) */
.new-modal-design {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
}

.modal-header-new {
    padding: 34px 32px 0 32px;
    border-bottom: none;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.modal-title-new {
    margin: 0;
    font-size: 1.2em;
    font-weight: 700;
    color: #23325b;
    flex: 1;
}

.btn-close-custom {
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

.btn-close-custom:hover {
    background-color: #f8f9fa;
    color: #000;
}

.modal-body-new {
    padding: 22px 32px 20px 32px;
    font-family: 'Segoe UI', Arial, sans-serif;
}

.form-group {
    margin-bottom: 14px;
}

.form-group label,
.form-label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #1d2636;
}

.form-group label.required:after,
.form-label.required:after {
    content: " *";
    color: #e53e3e;
}

.form-control,
select {
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

.form-control:focus {
    border: 1.5px solid #4a7fff;
    background: #fff;
}

.form-control.is-invalid {
    border-color: #e53e3e;
    background: #fff5f5;
}

.ant-select.is-invalid .ant-select-selector {
    border-color: #e53e3e !important;
    background: #fff5f5 !important;
}

.invalid-feedback {
    display: block;
    width: 100%;
    margin-top: 5px;
    font-size: 0.875em;
    color: #e53e3e;
    font-weight: 500;
}

.date-row {
    display: flex;
    gap: 14px;
}

.date-row .form-group {
    flex: 1;
    margin-bottom: 0;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    font-weight: 500;
    color: #1d2636;
}

.btn-row {
    text-align: right;
    margin-top: 18px;
}

.btn {
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.btn-cancel {
    background: #fff;
    color: #2a3146;
    border: 1.2px solid #bbc4d1;
    margin-right: 8px;
}

.btn-cancel:hover {
    background: #f4f7fa;
}

.btn-save {
    background: linear-gradient(90deg, #3577ef 70%, #355bef 100%);
    color: #fff;
}

.btn-save:disabled {
    background: #ccd4ea;
    color: #888;
    cursor: not-allowed;
}

.success-msg {
    text-align: center;
    color: #169b53;
    font-weight: bold;
    margin-bottom: 14px;
    padding: 8px 12px;
    background: #f0f9f4;
    border: 1px solid #d4edda;
    border-radius: 6px;
}

.error-msg {
    text-align: center;
    color: #e53e3e;
    font-weight: bold;
    margin-bottom: 14px;
    padding: 8px 12px;
    background: #fff5f5;
    border: 1px solid #f5c6cb;
    border-radius: 6px;
}

.allocation-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
}

.allocation-table th,
.allocation-table td {
    border: 1px solid #e5eaf0;
    padding: 8px 7px;
    text-align: left;
    font-size: 0.97em;
}

.allocation-table th {
    background: #f8fafc;
    color: #3c4257;
    font-weight: 600;
}

.edit-field {
    width: 90%;
    padding: 4px 7px;
    border-radius: 5px;
    border: 1px solid #c9d2e2;
    background: #fff;
}

.action-btn {
    color: #3577ef;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1em;
    margin-right: 6px;
}

.action-btn.delete {
    color: #e53e3e;
}

.action-btn:hover {
    text-decoration: underline;
}

.employee-info-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 12px;
}

.employee-info-card .card-body {
    padding: 0;
}

.employee-info-card .card-title {
    margin-bottom: 8px;
    font-size: 0.9em;
    font-weight: 600;
    color: #495057;
}

.employee-info-card .card-text {
    margin-bottom: 0;
    font-size: 0.9em;
}

.no-allocations-msg {
    padding: 20px;
    background: #f8f9fa;
    border: 1px dashed #dee2e6;
    border-radius: 6px;
    margin-bottom: 16px;
}

.no-allocations-msg p {
    margin: 0;
}

.badge-org {
    background: #ffe6c1;
    color: #a37500;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: 600;
}

.badge-grant {
    background: #d9f4ec;
    color: #278d4c;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: 600;
}

/* TreeSelect styling */
:deep(.ant-select-dropdown) {
    z-index: 1056 !important;
}

:deep(.ant-select) {
    width: 100%;
}

:deep(.ant-select-selector) {
    border-radius: 0.375rem !important;
    min-height: 38px !important;
    display: flex;
    align-items: center;
}

/* Date picker specific styles to match employee-list-modal */
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

/* Ensure the date picker fits with the form styling */
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

/* Hide the default calendar icon from date picker */
:deep(.mx-icon-calendar) {
    display: none;
}

/* New styles for total summary */
.total-summary {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
}

.summary-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 120px;
}

.summary-label {
    font-size: 0.85em;
    color: #6c757d;
    font-weight: 500;
    margin-bottom: 4px;
}

.summary-value {
    font-size: 1em;
    color: #495057;
    font-weight: 600;
}

.summary-value.text-danger {
    color: #e53e3e !important;
}

/* Responsive adjustments for small screens */
@media (max-width: 768px) {
    .total-summary {
        flex-direction: column;
        gap: 8px;
    }

    .summary-row {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

/* New styles for reorganized form sections */
.employee-tax-section {
    margin-bottom: 16px;
    padding: 16px;
    background: #fafbfc;
    border: 1px solid #e9ecef;
    border-radius: 8px;
}

.funding-allocation-section {
    border-top: 2px solid #e9ecef;
    padding-top: 20px;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 12px 0 12px 0;
}

.checkbox-item {
    min-width: 140px;
}

/* Status badge styles */
.badge.badge-sm {
    font-size: 0.75em;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 500;
}

/* Loading state styles */
.form-loading {
    position: relative;
    opacity: 0.7;
    pointer-events: none;
}

.form-loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    z-index: 10;
    border-radius: 6px;
}

/* Enhanced loading messages */
.text-center {
    position: relative;
    z-index: 20;
}

/* Loading spinner improvements */
.spinner-border-sm {
    width: 1.5rem;
    height: 1.5rem;
    border-width: 0.15em;
}

/* Loading text styling */
.text-center div {
    margin-top: 8px;
    color: #6c757d;
    font-size: 0.9em;
    font-weight: 500;
}
</style>

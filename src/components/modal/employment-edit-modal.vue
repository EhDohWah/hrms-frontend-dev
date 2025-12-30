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

                        <!-- Row 1: Employee (full width) -->
                        <div class="form-group">
                            <label class="form-label required">Employee</label>
                            <a-tree-select v-model:value="formData.employee_id" @change="onEmployeeChange" show-search
                                style="width: 100%;" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                placeholder="Select employee" allow-clear tree-default-expand-all
                                :tree-data="employeeTreeData" tree-node-filter-prop="title"
                                :getPopupContainer="getPopupContainer"
                                :class="{ 'is-invalid': validationErrors.employee_id }" required
                                @input="saveFormState" />
                            <div v-if="validationErrors.employee_id" class="invalid-feedback">
                                {{ validationErrors.employee_id }}
                            </div>
                        </div>

                        <div v-if="selectedEmployeeInfo" class="employee-info-card mb-3" style="margin-top: 12px;">
                            <div class="card-body">
                                <h6 class="card-title">Selected Employee</h6>
                                <p class="card-text">
                                    <strong>{{ selectedEmployeeInfo.name }}</strong><br>
                                    <small class="text-muted">Organization: {{ selectedEmployeeInfo.organization
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

                        <!-- Row 2: Employment Type + Pay Method (2 columns) -->
                        <div class="date-row">
                            <div class="form-group">
                                <label class="form-label required">Employment Type</label>
                                <select class="form-control" v-model="formData.employment_type"
                                    :class="{ 'is-invalid': validationErrors.employment_type }" required
                                    @change="onEmploymentTypeChange" :disabled="isLoadingData">
                                    <option disabled value="">{{ isLoadingData ? 'Loading types...' : 'Select Type' }}
                                    </option>
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
                        </div>

                        <!-- Row 3: Department + Position (2 columns) -->
                        <div class="date-row">
                            <div class="form-group">
                                <label class="form-label required">Department</label>
                                <select class="form-control" v-model="formData.department_id"
                                    :class="{ 'is-invalid': validationErrors.department_id }" required
                                    @change="onDepartmentChange">
                                    <option disabled value="">Select Department</option>
                                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                        {{ dept.name }}
                                    </option>
                                </select>
                                <div v-if="validationErrors.department_id" class="invalid-feedback">
                                    {{ validationErrors.department_id }}
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Position</label>
                                <select class="form-control" v-model="formData.position_id"
                                    :class="{ 'is-invalid': validationErrors.position_id }" required
                                    @change="saveFormState" :disabled="!formData.department_id || positionsLoading">
                                    <option disabled value="">{{ positionsLoading ? 'Loading positions...' : 'Select Position' }}</option>
                                    <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                                        {{ pos.title }}
                                    </option>
                                </select>
                                <div v-if="validationErrors.position_id" class="invalid-feedback">
                                    {{ validationErrors.position_id }}
                                </div>
                            </div>
                        </div>

                        <!-- Row 4: Site + Section Department -->
                        <div class="date-row">
                            <div class="form-group">
                                <label class="form-label required">Site</label>
                                <select class="form-control" v-model="formData.site_id"
                                    :class="{ 'is-invalid': validationErrors.site_id }" required
                                    @change="saveFormState">
                                    <option disabled value="">Select Site</option>
                                    <option v-for="location in workLocations" :key="location.id" :value="location.id">
                                        {{ location.name }}
                                    </option>
                                </select>
                                <div v-if="validationErrors.site_id" class="invalid-feedback">
                                    {{ validationErrors.site_id }}
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Section Department</label>
                                <select class="form-control" v-model="formData.section_department"
                                    :class="{ 'is-invalid': validationErrors.section_department }"
                                    @change="saveFormState" :disabled="isLoadingData">
                                    <option disabled value="">{{ isLoadingData ? 'Loading sections...' : 'Select Section Department' }}</option>
                                    <option v-for="section in sectionDepartments" :key="section.id"
                                        :value="section.value">
                                        {{ section.value }}
                                    </option>
                                </select>
                                <div v-if="validationErrors.section_department" class="invalid-feedback">
                                    {{ validationErrors.section_department }}
                                </div>
                            </div>
                        </div>

                        <!-- Row 5: Start Date + Pass Probation Date -->
                        <div class="date-row">
                            <div class="form-group">
                                <label class="form-label required">Start Date</label>
                                <div class="input-icon-end position-relative">
                                    <date-picker v-if="isModalVisible && dataLoaded" class="form-control datetimepicker"
                                        placeholder="dd/mm/yyyy" :editable="true" :clearable="false"
                                        :input-format="dateFormat" v-model="computedStartDate"
                                        :class="{ 'is-invalid': validationErrors.start_date }" required />
                                    <span class="input-icon-addon">
                                        <i class="ti ti-calendar text-gray-7"></i>
                                    </span>
                                </div>
                                <div v-if="validationErrors.start_date" class="invalid-feedback">
                                    {{ validationErrors.start_date }}
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Pass Probation Date</label>
                                <div class="input-icon-end position-relative">
                                    <date-picker v-if="isModalVisible && dataLoaded" class="form-control datetimepicker"
                                        placeholder="dd/mm/yyyy" :editable="true" :clearable="false"
                                        :input-format="dateFormat" v-model="computedProbationPassDate"
                                        :class="{ 'is-invalid': validationErrors.pass_probation_date }" />
                                    <span class="input-icon-addon">
                                        <i class="ti ti-calendar text-gray-7"></i>
                                    </span>
                                </div>
                                <div v-if="validationErrors.pass_probation_date" class="invalid-feedback">
                                    {{ validationErrors.pass_probation_date }}
                                </div>
                                <small class="text-muted" style="display: block; margin-top: 4px; font-size: 0.85em;">
                                    <i class="ti ti-info-circle"></i> Auto-calculated as start date + 3 months if not
                                    provided
                                </small>
                            </div>
                        </div>

                        <!-- Row 6: Probation Salary + Pass Probation Salary -->
                        <div class="date-row">
                            <div class="form-group">
                                <label class="form-label">Probation Salary</label>
                                <input type="number" class="form-control" v-model.number="formData.probation_salary"
                                    :class="{ 'is-invalid': validationErrors.probation_salary }" @input="saveFormState"
                                    placeholder="Salary during probation period">
                                <div v-if="validationErrors.probation_salary" class="invalid-feedback">
                                    {{ validationErrors.probation_salary }}
                                </div>
                                <small class="text-muted" style="display: block; margin-top: 4px; font-size: 0.85em;">
                                    Optional - Leave empty if same as pass probation salary
                                </small>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Pass Probation Salary</label>
                                <input type="number" class="form-control"
                                    v-model.number="formData.pass_probation_salary"
                                    :class="{ 'is-invalid': validationErrors.pass_probation_salary }" required
                                    @input="saveFormState" placeholder="Regular salary after probation">
                                <div v-if="validationErrors.pass_probation_salary" class="invalid-feedback">
                                    {{ validationErrors.pass_probation_salary }}
                                </div>
                                <small class="text-muted" style="display: block; margin-top: 4px; font-size: 0.85em;">
                                    Used for funding allocation calculations
                                </small>
                            </div>
                        </div>

                        <!-- Probation Status Display -->
                        <div v-if="formData.pass_probation_date" class="probation-status-card"
                            style="margin-top: 24px;">
                            <div class="status-header">
                                <i class="ti ti-user-check"></i>
                                <span class="status-title">Probation Information</span>
                            </div>
                            <div class="status-body">
                                <div class="probation-info-grid">
                                    <div class="probation-info-item">
                                        <label>Status:</label>
                                        <span class="badge" :class="probationStatusClass">
                                            {{ probationStatusLabel }}
                                        </span>
                                    </div>
                                    <div class="probation-info-item">
                                        <label>Pass Probation Date:</label>
                                        <span>{{ formatDisplayDate(formData.pass_probation_date) }}</span>
                                    </div>
                                    <div class="probation-info-item">
                                        <label>Days Remaining:</label>
                                        <span :class="daysRemainingClass">
                                            {{ daysRemainingText }}
                                        </span>
                                    </div>
                                </div>
                                <div class="probation-description">
                                    <i class="ti ti-info-circle"></i>
                                    {{ probationStatusDescription }}
                                </div>
                                <div v-if="probationHistoryLoading" class="text-muted small mt-3">
                                    <i class="ti ti-loader"></i>
                                    Loading probation history...
                                </div>
                                <div v-else-if="probationHistorySummary"
                                    class="probation-info-grid probation-stats-grid">
                                    <div class="probation-info-item">
                                        <label>Total Extensions:</label>
                                        <span>{{ probationExtensionsCount }}</span>
                                    </div>
                                    <div class="probation-info-item">
                                        <label>Current Event:</label>
                                        <span>{{ probationCurrentEventLabel }}</span>
                                    </div>
                                    <div class="probation-info-item">
                                        <label>Current End Date:</label>
                                        <span>{{ formatDisplayDate(probationHistorySummary.current_end_date) || '-'
                                        }}</span>
                                    </div>
                                </div>
                                <div class="probation-actions">
                                    <button type="button" class="btn btn-outline-primary btn-sm mt-3"
                                        :disabled="probationHistoryLoading" @click="toggleProbationHistory"
                                        v-if="employmentId">
                                        <i class="ti ti-history me-1"></i>
                                        {{ probationHistoryExpanded ? 'Hide Probation History' : 'Show Probation History' }}
                                    </button>
                                </div>
                                <div v-if="probationHistoryExpanded" class="probation-history-inline">
                                    <div v-if="probationHistoryLoading" class="text-muted small mt-2">
                                        <i class="ti ti-loader me-1"></i>
                                        Loading probation history...
                                    </div>
                                    <div v-else-if="probationHistoryError" class="text-danger small mt-2">
                                        {{ probationHistoryError }}
                                    </div>
                                    <div v-else-if="probationHistoryHasRecords" class="probation-history-content">
                                        <div class="probation-summary-grid">
                                            <div class="summary-card summary-blue">
                                                <div class="summary-icon"><i class="ti ti-calendar-event"></i></div>
                                                <div>
                                                    <div class="summary-value">{{
                                                        formatDisplayDate(probationHistorySummary.probation_start_date)
                                                        || '-' }}</div>
                                                    <div class="summary-label">Start Date</div>
                                                </div>
                                            </div>
                                            <div class="summary-card summary-green">
                                                <div class="summary-icon"><i class="ti ti-calendar-check"></i></div>
                                                <div>
                                                    <div class="summary-value">{{
                                                        formatDisplayDate(probationHistorySummary.current_end_date) ||
                                                        '-' }}</div>
                                                    <div class="summary-label">Current End Date</div>
                                                </div>
                                            </div>
                                            <div class="summary-card summary-yellow">
                                                <div class="summary-icon"><i class="ti ti-repeat"></i></div>
                                                <div>
                                                    <div class="summary-value">{{ probationExtensionsCount }}</div>
                                                    <div class="summary-label">Total Extensions</div>
                                                </div>
                                            </div>
                                            <div class="summary-card" :class="probationStatusSummaryClass">
                                                <div class="summary-icon">
                                                    <i class="ti" :class="probationStatusSummaryIcon"></i>
                                                </div>
                                                <div>
                                                    <div class="summary-value">{{ probationStatusSummaryLabel }}</div>
                                                    <div class="summary-label">Current Status</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="probation-timeline-container">
                                            <h5 class="timeline-title">
                                                <i class="ti ti-timeline me-2"></i>
                                                Probation Timeline
                                            </h5>
                                            <div class="timeline">
                                                <div v-for="record in probationTimelineRecords" :key="record.id"
                                                    class="timeline-item"
                                                    :class="{ 'timeline-item-active': record.is_active }">
                                                    <div class="timeline-marker"
                                                        :class="getEventTypeClass(record.event_type)">
                                                        <i class="ti" :class="getEventIcon(record.event_type)"></i>
                                                    </div>
                                                    <div class="timeline-content">
                                                        <div class="timeline-header">
                                                            <h6 class="timeline-event-title">
                                                                {{ getEventTypeLabel(record.event_type) }}
                                                                <span v-if="record.extension_number > 0"
                                                                    class="badge bg-warning ms-2">
                                                                    Extension #{{ record.extension_number }}
                                                                </span>
                                                                <span v-if="record.is_active"
                                                                    class="badge bg-success ms-2">
                                                                    <i class="ti ti-check"></i> Active
                                                                </span>
                                                            </h6>
                                                            <div class="timeline-date">
                                                                <i class="ti ti-calendar me-1"></i>
                                                                {{ formatDisplayDate(record.event_date) }}
                                                            </div>
                                                        </div>
                                                        <div class="timeline-body">
                                                            <div class="timeline-detail">
                                                                <strong>Probation Period:</strong>
                                                                <span>{{ formatTimelineRange(record) }}</span>
                                                            </div>
                                                            <div class="timeline-detail" v-if="record.decision_date">
                                                                <strong>Decision Date:</strong>
                                                                <span>{{ formatDisplayDate(record.decision_date)
                                                                }}</span>
                                                            </div>
                                                            <div class="timeline-detail"
                                                                v-if="record.previous_end_date">
                                                                <strong>Extended From:</strong>
                                                                <span>{{ formatDisplayDate(record.previous_end_date)
                                                                }}</span>
                                                            </div>
                                                            <div class="timeline-detail" v-if="record.approved_by">
                                                                <strong>Approved By:</strong>
                                                                <span>{{ record.approved_by }}</span>
                                                            </div>
                                                            <div class="timeline-reason" v-if="record.decision_reason">
                                                                <strong>Reason</strong>
                                                                <p>{{ record.decision_reason }}</p>
                                                            </div>
                                                            <div class="timeline-notes" v-if="record.evaluation_notes">
                                                                <strong>Notes</strong>
                                                                <p>{{ record.evaluation_notes }}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-muted small mt-2">
                                        No probation history available yet.
                                    </div>
                                </div>

                                <div class="probation-decision-card mt-3">
                                    <div class="decision-header">
                                        <i class="ti ti-adjustments"></i>
                                        <div>
                                            <h6>Update Probation Status</h6>
                                            <small>Record manual pass or fail decisions with notes.</small>
                                        </div>
                                    </div>
                                    <div class="decision-body">
                                        <div class="decision-field">
                                            <label class="form-label">Decision</label>
                                            <select class="form-select" v-model="probationDecision.action">
                                                <option value="">Select decision</option>
                                                <option value="passed">Mark as Passed</option>
                                                <option value="failed">Mark as Failed</option>
                                            </select>
                                        </div>
                                        <div class="decision-field">
                                            <label class="form-label">Decision Date</label>
                                            <input type="date" class="form-control"
                                                v-model="probationDecision.decision_date">
                                        </div>
                                        <div class="decision-field" v-if="probationDecisionRequiresReason">
                                            <label class="form-label required">Reason</label>
                                            <textarea class="form-control" rows="2" v-model="probationDecision.reason"
                                                placeholder="Explain why probation failed"></textarea>
                                        </div>
                                        <div class="decision-field">
                                            <label class="form-label">Notes</label>
                                            <textarea class="form-control" rows="2" v-model="probationDecision.notes"
                                                placeholder="Additional context (optional)"></textarea>
                                        </div>
                                        <div class="decision-actions">
                                            <button type="button" class="btn btn-success btn-sm"
                                                :disabled="!canSubmitProbationDecision || updatingProbationStatus"
                                                @click="submitProbationDecision">
                                                <i class="ti ti-check me-1"></i>
                                                {{ updatingProbationStatus ? 'Updating...' : 'Apply Decision' }}
                                            </button>
                                            <button type="button" class="btn btn-link btn-sm"
                                                @click="resetProbationDecision">
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Allocation History (Read-only, grouped by status) -->
                        <div v-if="hasAllocationHistory" class="allocation-history-section"
                            style="margin-top: 24px; margin-bottom: 24px;">
                            <div class="history-header">
                                <i class="ti ti-history"></i>
                                <h5>Funding Allocation History</h5>
                            </div>

                            <!-- Active Allocations -->
                            <div v-if="activeAllocations.length > 0" class="allocation-group">
                                <div class="group-header active">
                                    <i class="ti ti-circle-check"></i>
                                    <span>Currently Active ({{ activeAllocations.length }})</span>
                                </div>
                                <table class="history-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Grant/Position</th>
                                            <th>FTE</th>
                                            <th>Salary Type</th>
                                            <th>Amount</th>
                                            <th>Period</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="allocation in activeAllocations" :key="allocation.id">
                                            <td>
                                                <span class="badge badge-grant">
                                                    Grant
                                                </span>
                                            </td>
                                            <td>
                                                <div>{{ getAllocationDisplayName(allocation) }}</div>
                                                <small class="text-muted">{{ getAllocationSubInfo(allocation) }}</small>
                                            </td>
                                            <td>{{ allocation.fte }}%</td>
                                            <td>
                                                <span class="badge badge-sm"
                                                    :class="allocation.salary_type === 'probation_salary' ? 'badge-warning' : 'badge-success'">
                                                    {{ allocation.salary_type_label || allocation.salary_type }}
                                                </span>
                                            </td>
                                            <td class="font-weight-bold">{{ formatCurrency(allocation.allocated_amount)
                                            }}</td>
                                            <td>
                                                <small>{{ formatDateRange(allocation.start_date, allocation.end_date)
                                                }}</small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Historical Allocations -->
                            <div v-if="historicalAllocations.length > 0" class="allocation-group">
                                <div class="group-header historical">
                                    <i class="ti ti-clock"></i>
                                    <span>Historical - Probation Period ({{ historicalAllocations.length }})</span>
                                </div>
                                <table class="history-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Grant/Position</th>
                                            <th>FTE</th>
                                            <th>Salary Type</th>
                                            <th>Amount</th>
                                            <th>Period</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="allocation in historicalAllocations" :key="allocation.id">
                                            <td>
                                                <span class="badge badge-sm badge-grant">
                                                    Grant
                                                </span>
                                            </td>
                                            <td>
                                                <div>{{ getAllocationDisplayName(allocation) }}</div>
                                                <small class="text-muted">{{ getAllocationSubInfo(allocation) }}</small>
                                            </td>
                                            <td>{{ allocation.fte }}%</td>
                                            <td>
                                                <span class="badge badge-sm badge-warning">
                                                    {{ allocation.salary_type_label || allocation.salary_type }}
                                                </span>
                                            </td>
                                            <td>{{ formatCurrency(allocation.allocated_amount) }}</td>
                                            <td>
                                                <small>{{ formatDateRange(allocation.start_date, allocation.end_date)
                                                }}</small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- Show salary increase if transitioned to active -->
                                <div v-if="showSalaryIncrease" class="salary-increase-info">
                                    <i class="ti ti-trending-up"></i>
                                    <span>Salary increased from {{ formatCurrency(totalHistoricalAmount) }} to {{
                                        formatCurrency(totalActiveAmount) }} upon probation completion</span>
                                    <span class="increase-badge">+{{ formatCurrency(totalActiveAmount -
                                        totalHistoricalAmount) }}</span>
                                </div>
                            </div>

                            <!-- Terminated Allocations -->
                            <div v-if="terminatedAllocations.length > 0" class="allocation-group">
                                <div class="group-header terminated">
                                    <i class="ti ti-circle-x"></i>
                                    <span>Terminated ({{ terminatedAllocations.length }})</span>
                                </div>
                                <table class="history-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Grant/Position</th>
                                            <th>FTE</th>
                                            <th>Salary Type</th>
                                            <th>Amount</th>
                                            <th>Period</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="allocation in terminatedAllocations" :key="allocation.id">
                                            <td>
                                                <span class="badge badge-grant">
                                                    Grant
                                                </span>
                                            </td>
                                            <td>
                                                <div>{{ getAllocationDisplayName(allocation) }}</div>
                                                <small class="text-muted">{{ getAllocationSubInfo(allocation) }}</small>
                                            </td>
                                            <td>{{ allocation.fte }}%</td>
                                            <td>
                                                <span class="badge badge-sm"
                                                    :class="allocation.salary_type === 'probation_salary' ? 'badge-warning' : 'badge-success'">
                                                    {{ allocation.salary_type_label || allocation.salary_type }}
                                                </span>
                                            </td>
                                            <td>{{ formatCurrency(allocation.allocated_amount) }}</td>
                                            <td>
                                                <small>{{ formatDateRange(allocation.start_date, allocation.end_date)
                                                }}</small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Funding Allocation with added spacing -->
                        <div class="form-group funding-allocation-section" style="margin-top: 32px; margin-bottom: 0;">
                            <div
                                style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <label style="margin-bottom: 0;">Funding Allocation</label>
                                <button type="button" class="btn btn-sm"
                                    :class="showAddAllocationForm ? 'btn-secondary' : 'btn-primary'"
                                    @click="showAddAllocationForm = !showAddAllocationForm"
                                    style="padding: 6px 12px; font-size: 0.875rem;">
                                    <i class="ti" :class="showAddAllocationForm ? 'ti-x' : 'ti-plus'"></i>
                                    {{ showAddAllocationForm ? 'Cancel' : 'Add New Allocation' }}
                                </button>
                            </div>

                            <div v-if="showAddAllocationForm" class="date-row" style="margin-bottom:12px;">
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
                                        <small class="text-muted">Department</small>
                                        <select v-model="currentAllocation.department_id"
                                            @change="onAllocationDepartmentChange" class="form-control">
                                            <option value="">Select department</option>
                                            <option v-for="dept in allocationDepartments" :key="dept.id"
                                                :value="dept.id">
                                                {{ dept.name }}
                                            </option>
                                        </select>
                                        <div v-if="allocationErrors.department_id" class="invalid-feedback">
                                            {{ allocationErrors.department_id }}
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <small class="text-muted">Position</small>
                                        <select v-model="currentAllocation.position_id" class="form-control"
                                            :disabled="!currentAllocation.department_id || allocationPositionsLoading">
                                            <option value="">{{ allocationPositionsLoading ? 'Loading positions...' :
                                                'Select position' }}</option>
                                            <option v-for="pos in allocationPositions" :key="pos.id" :value="pos.id">
                                                {{ pos.title }}
                                            </option>
                                        </select>
                                        <div v-if="allocationErrors.position_id" class="invalid-feedback">
                                            {{ allocationErrors.position_id }}
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
                                                Slot {{ slot.slot_number }} - {{ slot.budget_line?.name ||
                                                    slot.budgetline_code || 'No Budget Code' }}
                                            </option>
                                        </select>
                                        <div v-if="allocationErrors.position_slot_id" class="invalid-feedback">
                                            {{ allocationErrors.position_slot_id }}
                                        </div>
                                    </div>
                                </template>

                                <div class="form-group">
                                    <small class="text-muted">FTE (%)</small>
                                    <input type="number" v-model.number="currentAllocation.fte" @input="onFteChange"
                                        class="form-control" min="0" max="100" placeholder="FTE (%)"
                                        :disabled="isLoadingData" />
                                    <div v-if="allocationErrors.fte" class="invalid-feedback">
                                        {{ allocationErrors.fte }}
                                    </div>
                                </div>

                                <!-- Display Calculated Salary (ONLY from backend API) -->
                                <div class="form-group">
                                    <small class="text-muted"
                                        style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px;">
                                        <span>Calculated Salary</span>
                                        <span v-if="salaryTypeLabel && !calculating" class="badge badge-sm"
                                            :class="isProbationPeriod ? 'badge-warning' : 'badge-success'"
                                            style="font-size: 0.65em; padding: 2px 5px; white-space: nowrap;">
                                            {{ salaryTypeLabel }}
                                        </span>
                                    </small>
                                    <div class="calculated-amount-wrapper position-relative">
                                        <input type="text" class="form-control calculated-salary-input"
                                            :value="calculating ? 'Calculating...' : getCalculatedSalary(currentAllocation.fte)"
                                            placeholder="Enter FTE to calculate" readonly :class="{
                                                'calculating-bg': calculating,
                                                'calculated-bg': calculationResult && calculationResult.fte === currentAllocation.fte,
                                                'default-bg': !calculating && (!calculationResult || calculationResult.fte !== currentAllocation.fte)
                                            }" />
                                        <i v-if="calculating" class="ti ti-loader spinner-icon"></i>
                                        <i v-else-if="calculationResult && calculationResult.fte === currentAllocation.fte"
                                            class="ti ti-circle-check checkmark-icon"></i>
                                    </div>
                                    <small v-if="calculationFormula" class="formula-text">
                                        <i class="ti ti-calculator" style="color: #011b44; font-size: 0.9em;"></i>
                                        {{ calculationFormula }}
                                    </small>
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
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Grant Position</th>
                                    <th>Position Slot</th>
                                    <th>FTE (%)</th>
                                    <th>Allocated Salary</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in fundingAllocations" :key="idx">
                                    <template v-if="editingIndex === idx">
                                        <!-- Inline Edit Row -->
                                        <td>
                                            <span class="badge badge-grant">
                                                Grant Funded
                                            </span>
                                        </td>
                                        <td>
                                            <select v-model.number="editData.grant_id" @change="onEditGrantChange"
                                                class="edit-field">
                                                <option value="">Select grant</option>
                                                <option v-for="grant in grantOptions" :key="grant.id"
                                                    :value="Number(grant.id)">
                                                    {{ grant.name }} ({{ grant.code }})
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            <select v-if="isOrgFundGrant(editData.grant_id)"
                                                v-model.number="editData.department_id"
                                                @change="onEditAllocationDepartmentChange" class="edit-field">
                                                <option value="">Select department</option>
                                                <option v-for="dept in allocationDepartments" :key="dept.id"
                                                    :value="Number(dept.id)">
                                                    {{ dept.name }}
                                                </option>
                                            </select>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <select v-if="isOrgFundGrant(editData.grant_id)"
                                                v-model.number="editData.position_id" class="edit-field"
                                                :disabled="!editData.department_id || allocationPositionsLoading">
                                                <option value="">{{ allocationPositionsLoading ? 'Loading...' : 'Select position' }}    
                                                </option>
                                                <option v-for="pos in allocationPositions" :key="pos.id"
                                                    :value="Number(pos.id)">
                                                    {{ pos.title }}
                                                </option>
                                            </select>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <select v-if="!isOrgFundGrant(editData.grant_id)"
                                                v-model.number="editData.grant_items_id"
                                                @change="onEditGrantPositionChange" class="edit-field">
                                                <option value="">Select position</option>
                                                <option v-for="position in editGrantPositionOptions" :key="position.id"
                                                    :value="Number(position.id)">
                                                    {{ position.name }}
                                                </option>
                                            </select>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <select v-if="!isOrgFundGrant(editData.grant_id)"
                                                v-model.number="editData.position_slot_id" class="edit-field">
                                                <option value="">Select position slot</option>
                                                <option v-for="slot in editPositionSlotOptions" :key="slot.id"
                                                    :value="Number(slot.id)">
                                                    Slot {{ slot.slot_number }} - {{ slot.budget_line?.name ||
                                                        slot.budgetline_code || 'No Budget Code' }}
                                                </option>
                                            </select>
                                            <span v-else class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <input type="number" v-model.number="editData.fte" @input="onEditFteChange"
                                                class="edit-field" min="0" max="100">
                                        </td>
                                        <td>
                                            <span class="text-muted">{{ getCalculatedSalary(editData.fte)
                                            }}</span>
                                        </td>
                                        <td>
                                            <button type="button" class="action-btn" @click="saveEdit">Save</button>
                                            <button type="button" class="action-btn delete"
                                                @click="cancelEdit">Cancel</button>
                                        </td>
                                    </template>
                                    <template v-else>
                                        <!-- Display Row -->
                                        <td>
                                            <span class="badge badge-grant">
                                                Grant Funded
                                            </span>
                                        </td>
                                        <td>{{ getGrantName(row.grant_id, row._original) }}</td>
                                        <td>
                                            <span class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <span class="text-muted">-</span>
                                        </td>
                                        <td>
                                            <span>{{
                                                getGrantPositionName(row.grant_id,
                                                    row.grant_item_id || row.grant_items_id, row._original) }}</span>
                                        </td>
                                        <td>
                                            <span class="text-muted">-</span>
                                        </td>
                                        <td>{{ row.fte }}%</td>
                                        <td>{{ getAllocatedSalary(row) }}</td>
                                        <td>
                                            <button type="button" class="action-btn"
                                                @click="editAllocation(idx)">Edit</button>
                                            <button type="button" class="action-btn delete"
                                                @click="deleteAllocation(idx)">Delete</button>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Total Summary Row -->
                        <div v-if="fundingAllocations.length > 0" class="total-summary">
                            <div class="summary-row">
                                <span class="summary-label">Total FTE:</span>
                                <span class="summary-value" :class="{ 'text-danger': totalFte !== 100 }">{{
                                    totalFte }}%</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Total Allocated Salary:</span>
                                <span class="summary-value">{{ formatCurrency(totalAllocatedSalary) }}</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Pass Probation Salary:</span>
                                <span class="summary-value">{{ formatCurrency(formData.pass_probation_salary) }}</span>
                            </div>
                        </div>

                        <!-- No Allocations Message -->
                        <div v-else-if="formData.employee_id && !isLoadingData" class="no-allocations-msg">
                            <p class="text-muted text-center">No funding allocations added. Please add at least one
                                allocation.</p>
                        </div>

                        <!-- Row: Employment Status -->
                        <div class="form-group">
                            <label class="form-label">Employment Status</label>
                            <div class="status-toggle-container">
                                <label class="status-toggle">
                                    <input type="checkbox" v-model="formData.status" @change="saveFormState" />
                                    <span class="toggle-slider"></span>
                                    <span class="toggle-label">{{ formData.status ? 'Active' : 'Inactive' }}</span>
                                </label>
                                <small class="text-muted" style="display: block; margin-top: 8px; font-size: 0.85em;">
                                    <i class="ti ti-info-circle"></i> Toggle to set employment as Active or Inactive
                                </small>
                            </div>
                        </div>

                        <!-- Enhanced Benefits Section -->
                        <div class="form-group">
                            <label class="form-label">Benefits</label>

                            <div class="benefits-container">
                                <!-- Health & Welfare -->
                                <div class="benefit-item">
                                    <label class="checkbox-item">
                                        <input type="checkbox" v-model="formData.health_welfare"
                                            @change="saveFormState" />
                                        <span class="checkmark"></span>
                                        Health & Welfare
                                    </label>
                                    <small class="text-muted"
                                        style="display: block; margin-left: 28px; margin-top: 4px; font-size: 0.85em;">
                                        Percentage is managed globally in Benefit Settings
                                    </small>
                                </div>

                                <!-- Saving Fund -->
                                <div class="benefit-item">
                                    <label class="checkbox-item">
                                        <input type="checkbox" v-model="formData.saving_fund" @change="saveFormState" />
                                        <span class="checkmark"></span>
                                        Saving Fund
                                    </label>
                                    <small class="text-muted"
                                        style="display: block; margin-left: 28px; margin-top: 4px; font-size: 0.85em;">
                                        Percentage is managed globally in Benefit Settings
                                    </small>
                                </div>

                                <!-- PVD -->
                                <div class="benefit-item">
                                    <label class="checkbox-item">
                                        <input type="checkbox" v-model="formData.pvd" @change="saveFormState" />
                                        <span class="checkmark"></span>
                                        PVD
                                    </label>
                                    <small class="text-muted"
                                        style="display: block; margin-left: 28px; margin-top: 4px; font-size: 0.85em;">
                                        Percentage is managed globally in Benefit Settings
                                    </small>
                                </div>
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

        <!-- Probation History Modal -->
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { ref, createVNode, nextTick } from 'vue';
import { Modal as AntModal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { employmentService } from '@/services/employment.service';
import { employeeService } from '@/services/employee.service';
import { workLocationService } from '@/services/worklocation.service';
import { useLookupStore } from '@/stores/lookupStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { useAllocationCalculation } from '@/composables/useAllocationCalculation';

export default {
    name: 'EmploymentEditModal',
    setup() {
        const employmentData = ref(null);
        const alertMessage = ref('');
        const alertClass = ref('');

        // Use allocation calculation composable for real-time backend calculations
        const {
            calculating,
            calculationResult,
            calculateAmount,
            formattedAmount,
            allocatedAmount,
            baseSalary,
            salaryType,
            salaryTypeLabel,
            calculationFormula,
            isProbationPeriod
        } = useAllocationCalculation();

        return {
            employmentData,
            alertMessage,
            alertClass,
            calculating,
            calculationResult,
            calculateAmount,
            formattedAmount,
            allocatedAmount,
            baseSalary,
            salaryType,
            salaryTypeLabel,
            calculationFormula,
            isProbationPeriod
        };
    },
    data() {
        return {
            // Performance optimization flag
            dataLoaded: false,
            isModalVisible: false,

            formData: {
                employment_id: null,
                employee_id: '',
                employment_type: '',
                pay_method: '',
                department_id: '',
                position_id: '',
                section_department: '',
                site_id: '',
                start_date: null,
                end_date: null,
                pass_probation_date: null,
                pass_probation_salary: '',
                probation_salary: '',
                status: true, // Boolean: true = Active, false = Inactive (default Active)

                health_welfare: false,
                pvd: false,
                saving_fund: false
            },
            currentAllocation: {
                allocation_type: '',
                grant_id: '',
                grant_item_id: '',
                department_position_id: '',
                department_id: '',
                position_id: '',
                fte: 100

            },
            editData: {
                allocation_type: '',
                grant_id: '',
                grant_item_id: '',
                department_position_id: '',
                department_id: '',
                position_id: '',
                fte: 100
            },
            fundingAllocations: [],
            editingIndex: null,
            selectedEmployeeInfo: null,
            isSubmitting: false,
            isLoadingData: false,
            modalInstance: null,
            showAddAllocationForm: false, // Control visibility of add allocation form

            // Date format - same as employee-list-modal
            dateFormat: "dd-MM-yyyy",

            // Validation errors
            validationErrors: {},
            allocationErrors: {},

            // Data sources
            employees: [],
            employeeTreeData: [],
            departments: [],
            positions: [],
            workLocations: [],
            employmentTypes: [],
            sectionDepartments: [],
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
            editPositionSlotOptions: [],
            positionsLoading: false,

            // Allocation-specific departments and positions
            allocationDepartments: [],
            allocationPositions: [],
            allocationPositionsLoading: false,

            // Probation insights
            probationHistory: null,
            probationHistoryLoading: false,
            probationHistoryError: '',
            probationHistoryExpanded: false,
            updatingProbationStatus: false,
            probationDecision: {
                action: '',
                decision_date: new Date().toISOString().slice(0, 10),
                reason: '',
                notes: ''
            }
        };
    },

    computed: {
        isLocalIDStaff() {
            return this.formData.employment_type === 'Local ID Staff';
        },
        isLocalNonIDStaff() {
            return this.formData.employment_type === 'Local non ID Staff';
        },
        // FIXED: Safe computed properties for date fields to prevent prop type errors
        computedStartDate: {
            get() {
                return this.formData.start_date || null;
            },
            set(value) {
                this.formData.start_date = this.safeConvertToDate(value);
                this.saveFormState();
            }
        },
        computedEndDate: {
            get() {
                return this.formData.end_date || null;
            },
            set(value) {
                this.formData.end_date = this.safeConvertToDate(value);
                this.saveFormState();
            }
        },
        computedProbationPassDate: {
            get() {
                return this.formData.pass_probation_date || null;
            },
            set(value) {
                this.formData.pass_probation_date = this.safeConvertToDate(value);
                this.saveFormState();
            }
        },
        totalFte() {
            return this.fundingAllocations.reduce((sum, allocation) => sum + allocation.fte, 0);
        },
        totalAllocatedSalary() {
            // Sum ONLY backend-calculated allocated_amount - NO local calculation
            return this.fundingAllocations.reduce((sum, allocation) => {
                // Only use backend-calculated amount
                if (allocation.allocated_amount !== undefined && allocation.allocated_amount !== null) {
                    return sum + parseFloat(allocation.allocated_amount);
                }
                // For loaded data, try _original
                if (allocation._original?.allocated_amount) {
                    return sum + parseFloat(allocation._original.allocated_amount);
                }
                // This should not happen if addAllocation works correctly
                console.warn('⚠️ Allocation missing backend-calculated amount in total:', allocation);
                return sum;
            }, 0);
        },

        // Probation Status Display
        resolvedProbationStatus() {
            if (this.formData.probation_status) {
                return this.formData.probation_status;
            }

            if (this.probationHistorySummary?.current_status) {
                return this.probationHistorySummary.current_status;
            }

            if (!this.formData.pass_probation_date) {
                return null;
            }

            const days = this.daysRemaining;
            if (days === null) {
                return null;
            }

            if (days < 0) {
                return 'passed';
            }

            return 'ongoing';
        },
        probationStatusClass() {
            const status = this.resolvedProbationStatus;
            if (!status) return '';

            const statusClasses = {
                'ongoing': 'badge-warning',
                'passed': 'badge-success',
                'failed': 'badge-danger',
                'extended': 'badge-info'
            };

            return statusClasses[status] || 'badge-secondary';
        },

        probationStatusLabel() {
            const status = this.resolvedProbationStatus;
            if (!status) return 'Not Set';

            const labels = {
                'ongoing': 'Ongoing',
                'passed': 'Passed',
                'failed': 'Failed',
                'extended': 'Extended'
            };

            return labels[status] || status;
        },

        probationStatusDescription() {
            const status = this.resolvedProbationStatus;
            if (!status) return '';

            const descriptions = {
                'ongoing': 'Employee is currently in probation period',
                'passed': 'Employee successfully completed probation period',
                'failed': 'Employment was terminated during probation period',
                'extended': 'Probation period has been extended'
            };

            return descriptions[status] || '';
        },

        // Employment ID for probation history modal
        employmentId() {
            return this.employmentData?.id || this.formData.id || this.formData.employment_id || null;
        },

        // Days remaining in probation
        daysRemaining() {
            if (!this.formData.pass_probation_date) return null;

            const endDate = new Date(this.formData.pass_probation_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            const diffTime = endDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return diffDays;
        },

        daysRemainingText() {
            const days = this.daysRemaining;
            if (days === null) return 'N/A';

            if (days < 0) {
                return `Ended ${Math.abs(days)} days ago`;
            } else if (days === 0) {
                return 'Ends today';
            } else {
                return `${days} days remaining`;
            }
        },

        daysRemainingClass() {
            const days = this.daysRemaining;
            if (days === null) return '';

            if (days < 0) {
                return 'text-muted';
            } else if (days <= 7) {
                return 'text-danger fw-bold';
            } else if (days <= 14) {
                return 'text-warning fw-bold';
            } else {
                return 'text-success';
            }
        },

        // Allocation Grouping by Status
        activeAllocations() {
            return this.fundingAllocations.filter(a =>
                (a.status === 'active' || a._original?.status === 'active')
            );
        },

        historicalAllocations() {
            return this.fundingAllocations.filter(a =>
                (a.status === 'historical' || a._original?.status === 'historical')
            );
        },

        terminatedAllocations() {
            return this.fundingAllocations.filter(a =>
                (a.status === 'terminated' || a._original?.status === 'terminated')
            );
        },

        hasAllocationHistory() {
            return this.fundingAllocations.length > 0 &&
                this.fundingAllocations.some(a =>
                    (a.status || a._original?.status) !== undefined
                );
        },

        showSalaryIncrease() {
            return this.historicalAllocations.length > 0 &&
                this.activeAllocations.length > 0 &&
                this.formData.probation_status === 'passed';
        },

        totalHistoricalAmount() {
            return this.historicalAllocations.reduce((sum, allocation) => {
                const amount = allocation.allocated_amount || allocation._original?.allocated_amount || 0;
                return sum + parseFloat(amount);
            }, 0);
        },

        totalActiveAmount() {
            return this.activeAllocations.reduce((sum, allocation) => {
                const amount = allocation.allocated_amount || allocation._original?.allocated_amount || 0;
                return sum + parseFloat(amount);
            }, 0);
        },
        probationHistorySummary() {
            return this.probationHistory;
        },
        probationHistoryHasRecords() {
            return !!(this.probationHistory?.records && this.probationHistory.records.length > 0);
        },
        probationExtensionsCount() {
            return this.probationHistory?.total_extensions ?? 0;
        },
        probationCurrentEventLabel() {
            const event = this.probationHistory?.current_event_type;
            if (!event) {
                return 'N/A';
            }

            return this.formatProbationEvent(event);
        },
        probationTimelineRecords() {
            return this.probationHistory?.records ?? [];
        },
        probationStatusSummaryClass() {
            const status = this.probationHistorySummary?.current_status || this.resolvedProbationStatus;
            return {
                'summary-green': status === 'passed',
                'summary-yellow': status === 'extended',
                'summary-red': status === 'failed'
            };
        },
        probationStatusSummaryIcon() {
            const status = this.probationHistorySummary?.current_status || this.resolvedProbationStatus;
            return {
                passed: 'ti-circle-check',
                extended: 'ti-clock',
                failed: 'ti-alert-triangle'
            }[status] || 'ti-user-check';
        },
        probationStatusSummaryLabel() {
            return this.formatProbationEvent(this.probationHistorySummary?.current_status || this.resolvedProbationStatus);
        },
        probationDecisionRequiresReason() {
            return this.probationDecision.action === 'failed';
        },
        canSubmitProbationDecision() {
            if (!this.employmentId) {
                return false;
            }

            if (!this.probationDecision.action || !this.probationDecision.decision_date) {
                return false;
            }

            if (this.probationDecisionRequiresReason && !this.probationDecision.reason?.trim()) {
                return false;
            }

            return true;
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
                    if (this.formData.pass_probation_date) {
                        this.formData.pass_probation_date = new Date(this.formData.pass_probation_date);
                    }

                    // Load funding allocations and probation history when employment data is set in edit mode
                    if (newVal.id) {
                        this.loadEmployeeFundingAllocations(newVal.id);
                        this.loadProbationHistory(newVal.id);
                    } else {
                        this.probationHistory = null;
                    }

                    // Set selected employee info if available
                    if (newVal.employee) {
                        this.selectedEmployeeInfo = {
                            name: `${newVal.employee.first_name_en || ''} ${newVal.employee.last_name_en || ''}`.trim(),
                            staff_id: newVal.employee.staff_id || 'N/A',
                            organization: newVal.employee.organization || 'N/A'
                        };
                    }
                }
            },
            deep: true
        }
    },

    async created() {
        try {
            // Import debounce utility for FTE change handlers
            const { debounce } = await import('@/utils/performance.js');

            // Create debounced FTE change function to prevent excessive API calls
            this.debouncedFteChange = debounce(this.onFteChangeInternal, 500);

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
                this.isModalVisible = false;
                this.cleanupModalBackdrops();
                this.$emit('modal-closed');
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

        // Computed wrappers handle updates; keep method for compatibility if needed

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

        // Format date for display
        formatDisplayDate(date) {
            if (!date) return 'N/A';

            const d = new Date(date);
            if (isNaN(d.getTime())) return 'Invalid Date';

            return d.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },

        toggleProbationHistory() {
            if (!this.probationHistory && !this.probationHistoryLoading && this.employmentId) {
                this.loadProbationHistory(this.employmentId);
            }

            this.probationHistoryExpanded = !this.probationHistoryExpanded;
        },
        async loadProbationHistory(employmentId) {
            if (!employmentId) {
                return;
            }

            this.probationHistoryLoading = true;
            this.probationHistoryError = '';

            try {
                const response = await employmentService.getProbationHistory(employmentId);
                if (response.success && response.data) {
                    this.probationHistory = response.data;
                    if (response.data.current_status) {
                        this.formData.probation_status = response.data.current_status;
                    }
                } else {
                    this.probationHistory = null;
                }
            } catch (error) {
                console.error('Failed to load probation history:', error);
                this.probationHistory = null;
                this.probationHistoryError = error.response?.data?.message || 'Failed to load probation history';
            } finally {
                this.probationHistoryLoading = false;
            }
        },
        formatTimelineRange(record) {
            return `${this.formatDisplayDate(record.probation_start_date)} — ${this.formatDisplayDate(record.probation_end_date)}`;
        },
        getEventTypeClass(eventType) {
            return {
                initial: 'timeline-marker-blue',
                extension: 'timeline-marker-yellow',
                passed: 'timeline-marker-green',
                failed: 'timeline-marker-red'
            }[eventType] || 'timeline-marker-gray';
        },
        getEventIcon(eventType) {
            return {
                initial: 'ti-calendar-plus',
                extension: 'ti-repeat',
                passed: 'ti-circle-check',
                failed: 'ti-alert-triangle'
            }[eventType] || 'ti-calendar';
        },
        getEventTypeLabel(eventType) {
            return this.formatProbationEvent(eventType);
        },
        resetProbationDecision() {
            this.probationDecision = {
                action: '',
                decision_date: new Date().toISOString().slice(0, 10),
                reason: '',
                notes: ''
            };
        },
        async submitProbationDecision() {
            if (!this.canSubmitProbationDecision || !this.employmentId) {
                return;
            }

            this.updatingProbationStatus = true;

            try {
                const payload = {
                    action: this.probationDecision.action,
                    decision_date: this.probationDecision.decision_date,
                    reason: this.probationDecision.reason || null,
                    notes: this.probationDecision.notes || null,
                };

                const response = await employmentService.updateProbationStatus(this.employmentId, payload);
                const successMessage = response.message || 'Probation status updated successfully.';
                message.success(successMessage);

                if (response.data?.employment) {
                    this.applyEmploymentPatch(response.data.employment);
                }

                if (response.data?.probation_history) {
                    this.probationHistory = response.data.probation_history;
                } else {
                    await this.loadProbationHistory(this.employmentId);
                }

                this.resetProbationDecision();
            } catch (error) {
                console.error('Failed to update probation status:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Failed to update probation status';
                message.error(errorMessage);
            } finally {
                this.updatingProbationStatus = false;
            }
        },
        applyEmploymentPatch(employmentPayload) {
            if (!employmentPayload) {
                return;
            }

            this.formData = {
                ...this.formData,
                ...employmentPayload
            };

            if (employmentPayload.start_date) {
                this.formData.start_date = new Date(employmentPayload.start_date);
            }

            if (employmentPayload.end_date) {
                this.formData.end_date = new Date(employmentPayload.end_date);
            }

            if (employmentPayload.pass_probation_date) {
                this.formData.pass_probation_date = new Date(employmentPayload.pass_probation_date);
            }

            if (employmentPayload.probation_status) {
                this.formData.probation_status = employmentPayload.probation_status;
            }

            this.$emit('employment-updated', employmentPayload);
        },
        formatProbationEvent(eventType) {
            if (!eventType) {
                return 'N/A';
            }

            const labels = {
                initial: 'Initial',
                extension: 'Extension',
                passed: 'Passed',
                failed: 'Failed'
            };

            return labels[eventType] || eventType.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
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
            // Hub grants are identified by code, but they still use grant_items
            // This method is kept for UI display purposes only (e.g., showing different labels)
            // All allocations are created as 'grant' type with grant_item_id
            const hubGrantCodes = ['S0031', 'BHF-GF']; // Updated to match backend
            const grant = this.grantOptions.find(g => g.id == grantId);
            return grant && hubGrantCodes.includes(grant.code);
        },

        async loadInitialData() {
            this.isLoadingData = true;

            try {
                console.log('📥 Loading employment edit modal data using shared store...');
                const sharedStore = useSharedDataStore();

                // Load data in parallel using the same successful pattern as employment-modal
                // Force refresh grant structure to ensure we have the latest data
                await Promise.all([
                    sharedStore.loadAllDropdownData({
                        includeEmployees: true,
                        includeDepartments: true,
                        includePositions: true,
                        includeWorkLocations: true,
                        includeGrantStructure: true, // Use this for grant data
                        force: false // Use cache for other data
                    }),
                    // Force refresh grant structure specifically to get latest grant positions
                    sharedStore.fetchGrantStructure(true), // Force refresh grant data
                    this.initFetchLookups()
                ]);

                // Copy data from shared store to local properties for reactivity
                // Make sure we wait for the data to be actually loaded
                console.log('📋 Copying data from shared store to edit modal...');
                this.employeeTreeData = sharedStore.getEmployeeTreeData;
                this.departments = sharedStore.getDepartments;
                this.positions = sharedStore.getPositions;
                this.workLocations = sharedStore.getWorkLocations;
                this.grantOptions = sharedStore.getGrantOptions;
                this.grantPositions = sharedStore.getGrantPositions;

                // Initialize allocation departments (copy from main departments)
                this.allocationDepartments = [...this.departments];

                console.log('✅ Modal data copied:', {
                    departments: this.departments?.length || 0,
                    positions: this.positions?.length || 0,
                    workLocations: this.workLocations?.length || 0,
                    grantOptions: this.grantOptions?.length || 0,
                    employees: this.employeeTreeData?.length || 0
                });

                console.log('✅ Employment edit modal data loaded from shared store');
            } catch (error) {
                console.error('❌ Error loading employment edit modal data:', error);
                // Handle BaseService structured errors or raw axios errors
                const errorMessage = error.error || error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to load form data';
                this.alertMessage = errorMessage;
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

            if (!this.formData.department_id) {
                this.validationErrors.department_id = 'Please select department';
                isValid = false;
            }

            if (!this.formData.position_id) {
                this.validationErrors.position_id = 'Please select position';
                isValid = false;
            }

            if (!this.formData.site_id) {
                this.validationErrors.site_id = 'Please select site';
                isValid = false;
            }

            if (!this.formData.start_date) {
                this.validationErrors.start_date = 'Please select start date';
                isValid = false;
            }

            if (!this.formData.pass_probation_salary) {
                this.validationErrors.pass_probation_salary = 'Please enter pass probation salary';
                isValid = false;
            }

            // For edit mode, allocations are optional but if provided must total 100%
            if (this.fundingAllocations.length > 0 && this.totalFte !== 100) {
                this.alertMessage = `If allocations are provided, total FTE must equal 100%. Current total: ${this.totalFte}%`;
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

            // All allocations require grant_item_id
            if (!this.currentAllocation.grant_item_id && !this.currentAllocation.grant_items_id) {
                this.allocationErrors.grant_items_id = 'Please select a grant position';
                isValid = false;
            }

            if (!this.currentAllocation.fte || this.currentAllocation.fte <= 0) {
                this.allocationErrors.fte = 'Please enter a valid FTE percentage';
                isValid = false;
            }

            if (this.currentAllocation.fte > 100) {
                this.allocationErrors.fte = 'FTE percentage cannot exceed 100%';
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
                    console.log('🔄 Fetching all lookup lists from new API endpoint...');
                    await lookupStore.fetchAllLookupLists();
                    console.log('✅ All lookup lists fetched successfully');
                } else {
                    console.log('✅ Lookups already loaded from store');
                }

                // Get employment types and section departments from the store
                this.employmentTypes = lookupStore.getLookupsByType('employment_type');
                this.sectionDepartments = lookupStore.getLookupsByType('section_department');

                // Debug logging
                console.log(`📊 Loaded ${this.employmentTypes.length} employment types:`, this.employmentTypes);
                console.log(`📊 Loaded ${this.sectionDepartments.length} section departments:`, this.sectionDepartments);
                console.log(`📊 Using ${this.payMethods.length} hardcoded pay methods`);
                console.log('🔍 Full lookupsByType from store:', lookupStore.lookupsByType);
                console.log('🔍 Available lookup types:', lookupStore.lookupTypes);

                // If no data loaded, try alternative approaches
                if (this.employmentTypes.length === 0) {
                    console.log('⚠️ No employment types loaded, checking alternative data sources...');
                    // Try to get data directly from lookupsByType
                    if (lookupStore.lookupsByType.employment_type) {
                        this.employmentTypes = lookupStore.lookupsByType.employment_type;
                        console.log('✅ Found employment types in lookupsByType:', this.employmentTypes);
                    }
                }

                if (this.sectionDepartments.length === 0) {
                    console.log('⚠️ No section departments loaded, checking alternative data sources...');
                    // Try to get data directly from lookupsByType
                    if (lookupStore.lookupsByType.section_department) {
                        this.sectionDepartments = lookupStore.lookupsByType.section_department;
                        console.log('✅ Found section departments in lookupsByType:', this.sectionDepartments);
                    }
                }

            } catch (error) {
                console.error('❌ Error loading lookups:', error);
                // Don't overwrite existing alert messages, just warn
                if (!this.alertMessage) {
                    this.alertMessage = 'Warning: Some lookup data failed to load';
                    this.alertClass = 'alert-warning';
                }
            }
        },

        onEmployeeChange() {
            if (this.formData.employee_id) {
                console.log('Employee selected:', this.formData.employee_id);
                const sharedStore = useSharedDataStore();
                const employee = sharedStore.findEmployeeInTree(this.formData.employee_id);

                if (employee) {
                    // Get organization from parent node in tree structure
                    const organization = sharedStore.getEmployeeOrganization(this.formData.employee_id);

                    this.selectedEmployeeInfo = {
                        name: employee.title,
                        staff_id: employee.staff_id || 'N/A',
                        organization: organization || 'N/A',
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

        // Auto-select benefits based on employment type
        autoSelectBenefitsBasedOnType(employmentType) {
            console.log('Auto-selecting benefits for employment type:', employmentType);

            // Reset benefits first
            this.formData.pvd = false;
            this.formData.saving_fund = false;

            if (!employmentType) return;

            // Auto-select based on employment type
            if (employmentType === 'Local ID Staff') {
                this.formData.pvd = true;
                this.formData.saving_fund = false;
                console.log('✅ Auto-selected PVD for Local ID Staff employment type');
            } else if (employmentType === 'Local non ID Staff') {
                this.formData.pvd = false;
                this.formData.saving_fund = true;
                console.log('✅ Auto-selected Saving Fund for Local non ID Staff employment type');
            } else {
                // For other employment types (Expats, Contract, etc.), don't auto-select anything
                console.log('ℹ️ No auto-selection for employment type:', employmentType);
            }

            // Save form state after auto-selection
            this.saveFormState();
        },

        // Handle employment type change
        onEmploymentTypeChange() {
            this.autoSelectBenefitsBasedOnType(this.formData.employment_type);
            this.saveFormState();
        },

        async onGrantChange() {
            console.log('Grant changed:', this.currentAllocation.grant_id);

            // Determine allocation type and load necessary data
            // All allocations are now grant type with grant_item_id
            // Hub grants still use grant_items, so we just load the grant positions
            {
                this.currentAllocation.allocation_type = 'grant';
                // Clear org-funded fields
                this.currentAllocation.department_position_id = '';
                this.currentAllocation.department_id = '';
                this.currentAllocation.position_id = '';
                this.allocationPositions = [];
                // Set options for grant position dropdown
                this.grantPositionOptions = this.grantPositions[this.currentAllocation.grant_id] || [];
                this.positionSlotOptions = [];
            }

            console.log('Available positions for grant:', this.grantPositionOptions);
            this.allocationErrors = {};
            this.saveFormState();
        },

        async onAllocationDepartmentChange() {
            try {
                this.currentAllocation.position_id = '';
                this.allocationPositions = [];
                this.allocationPositionsLoading = true;
                this.saveFormState();

                if (!this.currentAllocation.department_id) {
                    return;
                }

                const sharedStore = useSharedDataStore();
                const positions = await sharedStore.fetchPositions(true, { department_id: this.currentAllocation.department_id });
                this.allocationPositions = Array.isArray(positions) ? positions : (positions?.data || []);
            } catch (error) {
                console.error('Error loading positions for allocation department:', error);
                this.allocationPositions = [];
                this.alertMessage = 'Failed to load positions';
                this.alertClass = 'alert-danger';
            } finally {
                this.allocationPositionsLoading = false;
                this.saveFormState();
            }
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
            this.editData.department_id = '';
            this.editData.position_id = '';
            this.editData.fte = 100; // Reset FTE to 100 for new allocation

            // All allocations are now grant type with grant_item_id
            this.editData.allocation_type = 'grant';
            this.allocationPositions = [];
            this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
            this.editPositionSlotOptions = []; // No longer used
        },

        async onEditAllocationDepartmentChange() {
            try {
                this.editData.position_id = '';
                this.allocationPositions = [];
                this.allocationPositionsLoading = true;

                if (!this.editData.department_id) {
                    return;
                }

                const sharedStore = useSharedDataStore();
                const positions = await sharedStore.fetchPositions(true, { department_id: this.editData.department_id });
                this.allocationPositions = Array.isArray(positions) ? positions : (positions?.data || []);
            } catch (error) {
                console.error('Error loading positions for edit allocation department:', error);
                this.allocationPositions = [];
                this.alertMessage = 'Failed to load positions';
                this.alertClass = 'alert-danger';
            } finally {
                this.allocationPositionsLoading = false;
            }
        },

        onEditGrantPositionChange() {
            this.editData.position_slot_id = '';
            const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
            this.editPositionSlotOptions = position ? position.position_slots || [] : [];
        },

        async addAllocation() {
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
                // All allocations are grant type, check by grant_item_id
                return (a.grant_item_id || a.grant_items_id) === (this.currentAllocation.grant_item_id || this.currentAllocation.grant_items_id);
            });

            if (isDuplicate) {
                this.alertMessage = 'This allocation is already added.';
                this.alertClass = 'alert-danger';
                return;
            }

            // Check if total effort would exceed 100%
            const currentTotal = this.fundingAllocations.reduce((sum, a, i) => {
                return i === this.editingIndex ? sum : sum + a.fte;
            }, 0);

            if (currentTotal + this.currentAllocation.fte > 100) {
                this.alertMessage = `Adding this allocation would exceed 100% FTE. Available: ${100 - currentTotal}%`;
                this.alertClass = 'alert-danger';
                return;
            }

            // Get backend calculation before adding allocation
            console.log('🔄 Getting backend calculation before adding allocation...');
            try {
                await this.calculateAmount({
                    probation_salary: this.formData.probation_salary,
                    pass_probation_salary: this.formData.pass_probation_salary,
                    pass_probation_date: this.formData.pass_probation_date,
                    start_date: this.formData.start_date
                }, this.currentAllocation.fte);

                // Create allocation with backend-calculated amount
                const allocation = {
                    ...this.currentAllocation,
                    allocated_amount: this.allocatedAmount, // Store backend-calculated amount
                    salary_type: this.salaryType, // Store which salary type was used
                    calculation_formula: this.calculationFormula // Store formula for reference
                };

                if (this.editingIndex !== null) {
                    this.fundingAllocations[this.editingIndex] = allocation;
                    this.editingIndex = null;
                    console.log('✅ Updated allocation in memory with backend calculation');
                } else {
                    this.fundingAllocations.push(allocation);
                    console.log('✅ Added new allocation to memory with backend calculation. Total allocations:', this.fundingAllocations.length);
                }

                // Reset current allocation form
                this.currentAllocation = {
                    allocation_type: '',
                    grant_id: '',
                    grant_items_id: '',
                    position_slot_id: '',
                    department_position_id: '',
                    department_id: '',
                    position_id: '',
                    fte: 100
                };
                this.grantPositionOptions = [];
                this.positionSlotOptions = [];
                this.allocationPositions = [];
                this.allocationErrors = {};
                this.alertMessage = '';
                this.alertClass = '';

                // Hide the add allocation form after successfully adding
                this.showAddAllocationForm = false;

                this.saveFormState();

            } catch (error) {
                console.error('❌ Failed to calculate allocation before adding:', error);
                this.alertMessage = 'Failed to calculate allocation amount. Please try again.';
                this.alertClass = 'alert-danger';
            }
        },

        editAllocation(index) {
            console.log('Editing allocation at index:', index);
            this.editingIndex = index;
            const originalAllocation = this.fundingAllocations[index];

            // Create a new reactive object with explicit property assignment
            // This ensures Vue properly tracks changes and updates the dropdown
            // CRITICAL: Convert all IDs to numbers for strict type matching in v-model
            this.editData = {
                allocation_type: originalAllocation.allocation_type || '',
                grant_id: originalAllocation.grant_id ? Number(originalAllocation.grant_id) : '',
                grant_items_id: originalAllocation.grant_items_id ? Number(originalAllocation.grant_items_id) : '',
                position_slot_id: originalAllocation.position_slot_id ? Number(originalAllocation.position_slot_id) : '',
                department_position_id: originalAllocation.department_position_id ? Number(originalAllocation.department_position_id) : '',
                department_id: originalAllocation.department_id ? Number(originalAllocation.department_id) : '',
                position_id: originalAllocation.position_id ? Number(originalAllocation.position_id) : '',
                fte: originalAllocation.fte || 100
            };

            console.log('Original allocation data:', originalAllocation);
            console.log('Edit data after copy:', this.editData);
            console.log('grant_id type:', typeof this.editData.grant_id);
            console.log('grant_id value:', this.editData.grant_id);

            // Check if grant_id exists in grantOptions
            console.log('Available grantOptions:', this.grantOptions);
            const grantExists = this.grantOptions.find(g => g.id === this.editData.grant_id);
            console.log('Grant found in options:', grantExists);
            if (!grantExists && this.editData.grant_id) {
                console.warn('⚠️ WARNING: grant_id', this.editData.grant_id, 'not found in grantOptions!');
            }

            // All allocations are grant type
            this.editData.allocation_type = 'grant';
            console.log('Editing grant allocation');
            console.log('Available grantPositions:', this.grantPositions);
            console.log('Looking for grant_id:', this.editData.grant_id);

            // Load grant positions for this grant
            this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
            console.log('Loaded editGrantPositionOptions:', this.editGrantPositionOptions);
            console.log('Looking for grant_items_id:', this.editData.grant_items_id);

            // Load position slots for the selected grant position
            const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
            console.log('Found position:', position);

            this.editPositionSlotOptions = position ? position.position_slots || [] : [];
            console.log('Loaded editPositionSlotOptions:', this.editPositionSlotOptions);

            // If options are empty but we have data, it means grantPositions wasn't loaded
            // Try to use the shared store
            if (this.editGrantPositionOptions.length === 0 && this.editData.grant_id) {
                console.warn('Grant positions not found in grantPositions map, checking shared store...');
                const sharedStore = useSharedDataStore();
                const allGrantPositions = sharedStore.getGrantPositions;
                console.log('All grant positions from store:', allGrantPositions);
                this.editGrantPositionOptions = allGrantPositions[this.editData.grant_id] || [];
                console.log('Reloaded editGrantPositionOptions:', this.editGrantPositionOptions);

                // Retry loading position slots
                if (this.editGrantPositionOptions.length > 0) {
                    const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
                    this.editPositionSlotOptions = position ? position.position_slots || [] : [];
                    console.log('Reloaded editPositionSlotOptions:', this.editPositionSlotOptions);
                }
            }
        }
    },

    async saveEdit() {
        console.log('Saving edited allocation:', this.editData);

        // Validate the edited allocation
        if (!this.validateEditAllocation()) {
            return;
        }

        // Check for duplicates (excluding current editing index)
        const isDuplicate = this.fundingAllocations.some((a, i) => {
            if (i === this.editingIndex) return false;

            if (this.editData.allocation_type === 'grant') {
                return a.position_slot_id === this.editData.position_slot_id;
            }
            // All allocations are grant type, check by grant_item_id
            return (a.grant_item_id || a.grant_items_id) === (this.editData.grant_item_id || this.editData.grant_items_id);
        });

        if (isDuplicate) {
            this.alertMessage = 'This allocation is already added.';
            this.alertClass = 'alert-danger';
            return;
        }

        // Check if total FTE would exceed 100%
        const currentTotal = this.fundingAllocations.reduce((sum, a, i) => {
            return i === this.editingIndex ? sum : sum + a.fte;
        }, 0);

        if (currentTotal + this.editData.fte > 100) {
            this.alertMessage = `Saving this allocation would exceed 100% FTE. Available: ${100 - currentTotal}%`;
            this.alertClass = 'alert-danger';
            return;
        }

        // Get backend calculation before saving edited allocation
        console.log('🔄 Getting backend calculation for edited allocation...');
        try {
            await this.calculateAmount({
                probation_salary: this.formData.probation_salary,
                pass_probation_salary: this.formData.pass_probation_salary,
                pass_probation_date: this.formData.pass_probation_date,
                start_date: this.formData.start_date
            }, this.editData.fte);

            // Update allocation with backend-calculated amount
            const updatedAllocation = {
                ...this.editData,
                allocated_amount: this.allocatedAmount, // Store backend-calculated amount
                salary_type: this.salaryType, // Store which salary type was used
                calculation_formula: this.calculationFormula // Store formula for reference
            };

            this.fundingAllocations[this.editingIndex] = updatedAllocation;
            this.editingIndex = null;
            this.alertMessage = '';
            this.alertClass = '';
            this.saveFormState();

            console.log('✅ Successfully saved edited allocation with backend calculation');
        } catch (error) {
            console.error('❌ Failed to calculate edited allocation:', error);
            this.alertMessage = 'Failed to calculate allocation amount. Please try again.';
            this.alertClass = 'alert-danger';
        }
    },

    // Validate edited allocation
    validateEditAllocation() {
        let isValid = true;

        if (!this.editData.grant_id) {
            this.alertMessage = 'Please select a grant';
            this.alertClass = 'alert-danger';
            isValid = false;
        }

        // All allocations require grant_item_id
        if (!this.editData.grant_item_id && !this.editData.grant_items_id) {
            this.alertMessage = 'Please select a grant position';
            this.alertClass = 'alert-danger';
            isValid = false;
        }

        if (!this.editData.fte || this.editData.fte <= 0) {
            this.alertMessage = 'Please enter a valid FTE percentage';
            this.alertClass = 'alert-danger';
            isValid = false;
        }

        if (this.editData.fte > 100) {
            this.alertMessage = 'FTE percentage cannot exceed 100%';
            this.alertClass = 'alert-danger';
            isValid = false;
        }

        return isValid;
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


    getDepartmentName(id, originalData = null) {
        // First try to use original data if available
        if (originalData && originalData.department_name) {
            return originalData.department_name;
        }

        // First try to find in allocation departments
        let dept = this.allocationDepartments.find(d => d.id == id);

        // If not found, try main departments array
        if (!dept) {
            dept = this.departments.find(d => d.id == id);
        }

        return dept ? dept.name : 'Unknown Department';
    },

    getPositionName(id, originalData = null) {
        // First try to use original data if available
        if (originalData && originalData.position_name) {
            return originalData.position_name;
        }

        if (!id) return 'Unknown Position';

        // First try to find in allocation positions (current department)
        let pos = this.allocationPositions.find(p => p.id == id);

        // If not found, try to find in main positions array
        if (!pos) {
            pos = this.positions.find(p => p.id == id);
        }

        return pos ? pos.title : 'Unknown Position';
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

        // Handle new structure: budgetline_code is directly in grant_item, not in budget_line object
        if (slot) {
            const budgetLineCode = slot.budget_line?.name || slot.budgetline_code || 'No Budget Code';
            return `Slot ${slot.slot_number} - ${budgetLineCode}`;
        }

        return 'Unknown Slot';
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

    // New method to calculate salary based on FTE percentage
    calculateSalaryFromFte(ftePercentage) {
        if (!this.formData.pass_probation_salary || !ftePercentage) {
            return 0;
        }
        return (this.formData.pass_probation_salary * ftePercentage) / 100;
    },

    // Method to get calculated salary for current allocation display
    // Shows ONLY backend calculation - NO local fallback
    getCalculatedSalary(ftePercentage, isEditMode = false) {
        if (!ftePercentage || ftePercentage === 0) {
            return '฿0.00';
        }

        // For edit mode, check if we're currently editing and use calculation result
        if (isEditMode && this.editingIndex !== null) {
            // Use calculation result if it matches the edit FTE
            if (this.calculationResult && this.calculationResult.fte === ftePercentage) {
                return this.formattedAmount;
            }
            // Check if the edited allocation already has a stored amount
            if (this.editData.allocated_amount !== undefined && this.editData.allocated_amount !== null) {
                return this.formatCurrency(this.editData.allocated_amount);
            }
        }

        // For current allocation (add mode)
        if (!isEditMode) {
            // ONLY use backend calculation result
            if (this.calculationResult && this.calculationResult.fte === ftePercentage) {
                return this.formattedAmount;
            }
        }

        // No backend calculation yet - prompt user to wait
        if (!this.formData.probation_salary && !this.formData.pass_probation_salary) {
            return 'Enter salary first';
        }

        return 'Calculating...';
    },

    // Method to get allocated salary for table display
    // Shows ONLY backend-calculated amount - NO local calculation
    getAllocatedSalary(allocation) {
        // ONLY use backend-calculated amount stored in allocation
        if (allocation.allocated_amount !== undefined && allocation.allocated_amount !== null) {
            return this.formatCurrency(allocation.allocated_amount);
        }

        // For loaded data from API, try _original
        if (allocation._original?.formatted_allocated_amount) {
            return allocation._original.formatted_allocated_amount;
        }

        if (allocation._original?.allocated_amount) {
            return this.formatCurrency(allocation._original.allocated_amount);
        }

        // No backend calculation available - this should not happen if addAllocation works correctly
        console.warn('⚠️ Allocation missing backend-calculated amount:', allocation);
        return '฿0.00';
    },

    // Event handler wrapper for FTE change - calls debounced version
    onFteChange() {
        // Save form state immediately for draft persistence
        this.saveFormState();

        // Call debounced function to prevent excessive API calls
        if (this.debouncedFteChange) {
            this.debouncedFteChange();
        } else {
            // Fallback if debounced function not initialized
            this.onFteChangeInternal();
        }
    },

    // Internal FTE change handler (debounced)
    // Triggers real-time backend calculation of allocated amount
    async onFteChangeInternal() {
        // Validate FTE in real-time
        if (this.currentAllocation.fte < 0) {
            this.alertMessage = 'FTE cannot be negative';
            this.alertClass = 'alert-danger';
            return;
        }

        if (this.currentAllocation.fte > 100) {
            this.alertMessage = 'FTE cannot exceed 100%';
            this.alertClass = 'alert-danger';
            return;
        }

        // Check if total FTE would exceed 100% in real-time
        const currentTotal = this.fundingAllocations.reduce((sum, a, i) => {
            return i === this.editingIndex ? sum : sum + a.fte;
        }, 0);

        if (currentTotal + this.currentAllocation.fte > 100) {
            this.alertMessage = `Adding this would make total ${currentTotal + this.currentAllocation.fte}%. Maximum is 100%. Available: ${100 - currentTotal}%`;
            this.alertClass = 'alert-warning';
            // Still allow input but show warning
        } else {
            // Clear warning if FTE is valid
            if (this.alertClass === 'alert-warning') {
                this.alertMessage = '';
                this.alertClass = '';
            }
        }

        // Skip calculation if FTE is invalid
        if (!this.currentAllocation.fte || this.currentAllocation.fte <= 0) {
            console.log('FTE is zero or invalid, skipping calculation');
            return;
        }

        // Call backend API for real-time calculation (debounced to 500ms)
        console.log('FTE changed to:', this.currentAllocation.fte, '- calling backend for calculation (debounced)');

        try {
            await this.calculateAmount({
                probation_salary: this.formData.probation_salary,
                pass_probation_salary: this.formData.pass_probation_salary,
                pass_probation_date: this.formData.pass_probation_date,
                start_date: this.formData.start_date
            }, this.currentAllocation.fte);

            console.log('✅ Backend calculation complete:', this.calculationResult);
        } catch (error) {
            console.error('❌ Error calculating allocation:', error);
            this.alertMessage = 'Failed to calculate allocation. Please check your input and try again.';
            this.alertClass = 'alert-danger';
        }
    },

    // Event handler for FTE change in edit mode
    async onEditFteChange() {
        // Save state for draft persistence
        this.saveFormState();

        // Validate FTE in real-time
        if (this.editData.fte < 0) {
            this.alertMessage = 'FTE cannot be negative';
            this.alertClass = 'alert-danger';
            return;
        }

        if (this.editData.fte > 100) {
            this.alertMessage = 'FTE cannot exceed 100%';
            this.alertClass = 'alert-danger';
            return;
        }

        // Check if total FTE would exceed 100% in real-time
        const currentTotal = this.fundingAllocations.reduce((sum, a, i) => {
            return i === this.editingIndex ? sum : sum + a.fte;
        }, 0);

        if (currentTotal + this.editData.fte > 100) {
            this.alertMessage = `Total FTE would be ${currentTotal + this.editData.fte}%. Maximum is 100%. Available: ${100 - currentTotal}%`;
            this.alertClass = 'alert-warning';
            // Still allow input but show warning
        } else {
            // Clear warning if FTE is valid
            if (this.alertClass === 'alert-warning') {
                this.alertMessage = '';
                this.alertClass = '';
            }
        }

        // Skip calculation if FTE is invalid
        if (!this.editData.fte || this.editData.fte <= 0) {
            return;
        }

        // Call backend API for real-time calculation in edit mode
        try {
            await this.calculateAmount({
                probation_salary: this.formData.probation_salary,
                pass_probation_salary: this.formData.pass_probation_salary,
                pass_probation_date: this.formData.pass_probation_date,
                start_date: this.formData.start_date
            }, this.editData.fte);

            console.log('✅ Backend calculation complete for edit:', this.calculationResult);
        } catch (error) {
            console.error('❌ Error calculating allocation in edit mode:', error);
            this.alertMessage = 'Failed to calculate allocation. Please check your input and try again.';
            this.alertClass = 'alert-danger';
        }

        // The display will automatically update via getCalculatedSalary()
        console.log('Edit FTE changed to:', this.editData.fte);
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

    // Allocation History Helper Methods
    getAllocationDisplayName(allocation) {
        const original = allocation._original || allocation;
        // All allocations are grant type, show grant name
        return this.getGrantName(allocation.grant_id || original.grant_id, original);
    },

    getAllocationSubInfo(allocation) {
        const original = allocation._original || allocation;
        // All allocations are grant type, show grant position
        const grantPosition = this.getGrantPositionName(
            allocation.grant_id || original.grant_id,
            allocation.grant_item_id || allocation.grant_items_id || original.grant_items_id,
            original
        );
        return grantPosition;
    },

    formatDateRange(startDate, endDate) {
        if (!startDate) return '-';

        const formatDate = (date) => {
            if (!date) return null;
            const d = new Date(date);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        const start = formatDate(startDate);
        const end = endDate ? formatDate(endDate) : 'Present';

        return `${start} to ${end}`;
    },

    async openModal() {
        this.clearValidationErrors();
        // Control DatePicker rendering lifecycle
        this.isModalVisible = true;

        // Always ensure initial data is loaded before proceeding
        if (!this.dataLoaded) {
            console.log('📥 Loading modal data for first time...');
            try {
                await this.loadInitialData();
                this.dataLoaded = true;
            } catch (error) {
                console.error('❌ Critical error loading modal data:', error);
                // Still mark as loaded so modal can open, but show error
                this.dataLoaded = true;
                this.alertMessage = `Critical error loading form data: ${error.message}. Some features may not work.`;
                this.alertClass = 'alert-danger';
            }
        }

        // Editing existing employment - populate form with employment data
        if (this.employmentData) {
            this.formData = { ...this.employmentData };

            // Normalize employment_type for case sensitivity (Full-Time -> Full-time)
            if (this.formData.employment_type) {
                const matchingType = this.employmentTypes.find(type =>
                    type.value.toLowerCase() === this.formData.employment_type.toLowerCase()
                );
                if (matchingType) {
                    this.formData.employment_type = matchingType.value;
                    console.log('🔧 Normalized employment_type:', this.employmentData.employment_type, '->', this.formData.employment_type);
                }
            }

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
            if (this.formData.pass_probation_date) {
                this.formData.pass_probation_date = new Date(this.formData.pass_probation_date);
            }

            // Set selected employee info if available
            if (this.employmentData.employee) {
                this.selectedEmployeeInfo = {
                    name: `${this.employmentData.employee.first_name_en || ''} ${this.employmentData.employee.last_name_en || ''}`.trim(),
                    staff_id: this.employmentData.employee.staff_id || 'N/A',
                    organization: this.employmentData.employee.organization || 'N/A'
                };
            }

            // Load existing funding allocations and probation timeline if editing
            if (this.employmentData.id) {
                await this.loadEmployeeFundingAllocations(this.employmentData.id);
                await this.loadProbationHistory(this.employmentData.id);
            } else {
                this.probationHistory = null;
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
                // All allocations now use grant_item_id (including hub/org grants)
                this.fundingAllocations = allocationsData.map(allocation => {
                    // FTE is already in percentage from backend resource
                    const ftePercentage = parseFloat(allocation.fte);

                    // All allocations use grant_item relationship
                    const grantItem = allocation.grant_item || {};
                    const grant = grantItem.grant || {};

                    // Find grant_id and grant_items_id from grant_item relationship
                    let grant_id = grant.id || '';
                    let grant_items_id = allocation.grant_item_id || grantItem.id || '';

                    // If nested data not available, try to find IDs from loaded grant options
                    if (!grant_id && allocation.grant_name) {
                        const grantOption = this.grantOptions.find(g =>
                            g.name === allocation.grant_name || g.code === allocation.grant_code
                        );
                        grant_id = grantOption?.id || '';

                        // Find grant_items_id (position within grant)
                        if (grant_id && allocation.grant_position) {
                            const grantPositions = this.grantPositions[grant_id] || [];
                            const grantItemOption = grantPositions.find(p =>
                                p.name === allocation.grant_position || p.grant_position === allocation.grant_position
                            );
                            grant_items_id = grantItemOption?.id || '';
                        }
                    }

                    return {
                        id: allocation.id,
                        allocation_type: 'grant', // All allocations are grant type now
                        grant_id: grant_id,
                        grant_item_id: grant_items_id,
                        grant_items_id: grant_items_id, // Keep for backward compatibility
                        position_slot_id: '', // No longer used
                        department_position_id: '',
                        department_id: '',
                        position_id: '',
                        fte: ftePercentage,
                        allocated_amount: allocation.allocated_amount,
                        start_date: allocation.start_date,
                        end_date: allocation.end_date,
                        status: allocation.status,
                        salary_type: allocation.salary_type,
                        salary_type_label: allocation.salary_type_label,

                        // Additional data for display purposes
                        _original: {
                            grant_name: grant.name || allocation.grant_name || 'Unknown Grant',
                            grant_code: grant.code || allocation.grant_code || '',
                            grant_position: grantItem.grant_position || allocation.grant_position || '',
                            slot_number: '', // No longer used
                            budget_line_code: allocation.budgetline_code || '',
                            allocated_amount: allocation.allocated_amount,
                            formatted_allocated_amount: allocation.formatted_allocated_amount,
                            start_date: allocation.start_date,
                            end_date: allocation.end_date,
                            grant_salary: allocation.position_slot?.grant_item?.grant_salary || null,
                            status: allocation.status,
                            salary_type: allocation.salary_type
                        }
                    };
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
            pass_probation_date: this.formatDateForAPI(this.formData.pass_probation_date),
            start_date: this.formatDateForAPI(this.formData.start_date),
            end_date: this.formatDateForAPI(this.formData.end_date),
            department_id: this.formData.department_id || null,
            position_id: this.formData.position_id || null,
            section_department: this.formData.section_department || null,
            site_id: this.formData.site_id || null,
            pass_probation_salary: this.formData.pass_probation_salary,
            probation_salary: this.formData.probation_salary || null,
            status: !!this.formData.status, // Boolean: true = Active, false = Inactive
            health_welfare: !!this.formData.health_welfare,
            pvd: !!this.formData.pvd,
            saving_fund: !!this.formData.saving_fund
            // NOTE: Benefit percentages are now managed globally in benefit_settings table
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
        // NOTE: Benefit percentages are now managed globally in benefit_settings table

        // Include allocations if they exist (optional for updates)
        if (this.fundingAllocations.length > 0) {
            updatePayload.allocations = this.fundingAllocations.map(allocation => {
                // All allocations are now grant type with grant_item_id
                return {
                    allocation_type: 'grant',
                    grant_item_id: allocation.grant_item_id || allocation.grant_items_id || '',
                    fte: allocation.fte // Send as percentage (0-100), backend calculates allocated_amount
                    // ✅ NO allocated_amount - backend calculates this
                };
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
    },

    async onDepartmentChange() {
        try {
            this.formData.position_id = '';
            this.positions = [];
            this.positionsLoading = true;

            if (!this.formData.department_id) {
                return;
            }

            const sharedStore = useSharedDataStore();
            const positions = await sharedStore.fetchPositions(true, { department_id: this.formData.department_id });
            this.positions = Array.isArray(positions) ? positions : (positions?.data || []);
        } catch (error) {
            console.error('Error loading positions for department (edit):', error);
            this.positions = [];
            this.alertMessage = 'Failed to load positions';
            this.alertClass = 'alert-danger';
        } finally {
            this.positionsLoading = false;
        }
    }
}   
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
    margin-bottom: 20px;
}

.form-group label,
.form-label {
    display: block;
    margin-bottom: 8px;
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
    gap: 16px;
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
    margin-top: 24px;
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
    margin-bottom: 20px;
    padding: 10px 14px;
    background: #f0f9f4;
    border: 1px solid #d4edda;
    border-radius: 6px;
}

.error-msg {
    text-align: center;
    color: #e53e3e;
    font-weight: bold;
    margin-bottom: 20px;
    padding: 10px 14px;
    background: #fff5f5;
    border: 1px solid #f5c6cb;
    border-radius: 6px;
}

.allocation-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.allocation-table th,
.allocation-table td {
    border: 1px solid #e5eaf0;
    padding: 10px 12px;
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

/* Benefits container with percentage inputs */
.benefits-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 12px 0;
}

.benefit-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    transition: background-color 0.15s ease;
}

.benefit-item:hover {
    background: #f1f3f5;
}

.benefit-percentage-group {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 100px;
}

.benefit-percentage-input {
    width: 80px;
    padding: 4px 8px;
    font-size: 0.9em;
    text-align: right;
}

.benefit-percentage-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #e9ecef;
}

.percentage-symbol {
    font-weight: 500;
    color: #6c757d;
    font-size: 0.9em;
}

/* Status toggle styles */
.status-toggle-container {
    padding: 12px 16px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
}

.status-toggle {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    gap: 12px;
}

.status-toggle input[type="checkbox"] {
    display: none;
}

.toggle-slider {
    position: relative;
    width: 50px;
    height: 26px;
    background-color: #ccc;
    border-radius: 26px;
    transition: background-color 0.3s;
}

.toggle-slider::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    left: 3px;
    top: 3px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s;
}

.status-toggle input[type="checkbox"]:checked+.toggle-slider {
    background-color: #52c41a;
}

.status-toggle input[type="checkbox"]:checked+.toggle-slider::before {
    transform: translateX(24px);
}

.toggle-label {
    font-weight: 600;
    font-size: 0.95em;
    color: #1d2636;
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

/* Calculation visual indicator styles */
.calculated-amount-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
}

.calculated-salary-input {
    padding-right: 35px !important;
}

.spinner-icon,
.checkmark-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1em;
    pointer-events: none;
}

.spinner-icon {
    color: #1B84FF;
    /* Info color */
    animation: spin 1s linear infinite;
}

.checkmark-icon {
    color: #03C95A;
    /* Success color */
}

@keyframes spin {
    from {
        transform: translateY(-50%) rotate(0deg);
    }

    to {
        transform: translateY(-50%) rotate(360deg);
    }
}

.calculating-bg {
    background: #fffbea !important;
    border-color: #FFC107 !important;
    /* Warning color */
}

.calculated-bg {
    background: #ecfdf5 !important;
    border-color: #03C95A !important;
    /* Success color */
}

.default-bg {
    background: #f7f8fa !important;
}

.formula-text {
    display: block;
    margin-top: 4px;
    font-size: 0.8em;
    color: #6b7280;
    font-style: italic;
}

.badge-warning {
    background: #fef3c7;
    color: #92400e;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 600;
}

.badge-success {
    background: #d1fae5;
    color: #065f46;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 600;
}

/* Probation Status Card Styles */
.probation-status-card {
    background: #f7f8fa;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
}

.probation-status-card .status-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.probation-status-card .status-header i {
    font-size: 1.2em;
    color: #011b44;
    /* Primary color */
}

.probation-status-card .status-title {
    font-weight: 600;
    color: #1d2636;
    font-size: 1em;
}

.probation-status-card .status-body {
    display: block;
}

.probation-status-card .probation-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 12px;
}

.probation-status-card .probation-info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.probation-status-card .probation-info-item label {
    font-weight: 600;
    color: #6b7280;
    font-size: 0.85rem;
    margin-bottom: 0;
}

.probation-status-card .probation-info-item span {
    color: #1f2937;
    font-size: 0.95rem;
}

.probation-status-card .probation-description {
    background: #fff;
    border-left: 3px solid #011b44;
    /* Primary color */
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #4b5563;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 12px;
}

.probation-status-card .probation-description i {
    color: #011b44;
    /* Primary color */
    margin-top: 2px;
    flex-shrink: 0;
}

.probation-status-card .badge {
    font-size: 0.9em;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 600;
}

.probation-stats-grid {
    margin-top: 12px;
}

.probation-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
}

.badge-info {
    background: #dbeafe;
    color: #1e40af;
}

.badge-danger {
    background: #fee2e2;
    color: #991b1b;
}

/* Allocation History Section Styles */
.allocation-history-section {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
}

.allocation-history-section .history-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e5e7eb;
}

.allocation-history-section .history-header i {
    font-size: 1.3em;
    color: #011b44;
    /* Primary color */
}

.allocation-history-section .history-header h5 {
    margin: 0;
    font-size: 1.1em;
    font-weight: 600;
    color: #1d2636;
}

.allocation-group {
    margin-bottom: 24px;
}

.allocation-group:last-child {
    margin-bottom: 0;
}

.group-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 6px;
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 0.95em;
}

.group-header.active {
    background: #d1fae5;
    color: #065f46;
}

.group-header.historical {
    background: #fef3c7;
    color: #92400e;
}

.group-header.terminated {
    background: #fee2e2;
    color: #991b1b;
}

.group-header i {
    font-size: 1.1em;
}

.history-table {
    width: 100%;
    border-collapse: collapse;
    background: #fafbfc;
    border-radius: 6px;
    overflow: hidden;
    font-size: 0.9em;
}

.history-table thead {
    background: #f3f4f6;
}

.history-table th {
    padding: 10px 12px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.85em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.history-table td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
    color: #1d2636;
}

.history-table tbody tr:last-child td {
    border-bottom: none;
}

.history-table tbody tr:hover {
    background: #f9fafb;
}

.history-table .badge-sm {
    font-size: 0.75em;
    padding: 3px 8px;
    border-radius: 3px;
    font-weight: 600;
    white-space: nowrap;
}

.salary-increase-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    margin-top: 12px;
    background: #ecfdf5;
    border: 1px solid #03C95A;
    /* Success color */
    border-radius: 6px;
    font-size: 0.9em;
    color: #065f46;
}

.salary-increase-info i {
    font-size: 1.2em;
    color: #03C95A;
    /* Success color */
}

.increase-badge {
    background: #03C95A;
    /* Success color */
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 600;
    margin-left: auto;
}

.font-weight-bold {
    font-weight: 600;
}

.probation-history-inline {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px dashed #dee2e6;
}

.probation-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
}

.summary-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border-radius: 5px;
    background: #fff;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.summary-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.summary-card .summary-icon {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #1B84FF;
    /* Info color */
}

.summary-card.summary-green .summary-icon {
    background: #03C95A;
    /* Success color */
}

.summary-card.summary-yellow .summary-icon {
    background: #FFC107;
    /* Warning color */
}

.summary-card.summary-red .summary-icon {
    background: #E70D0D;
    /* Danger color */
}

.summary-card.summary-blue .summary-icon {
    background: #011b44;
    /* Primary color */
}

.summary-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2933;
}

.summary-label {
    font-size: 0.82rem;
    color: #6b7280;
}

.probation-timeline-container {
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px;
}

.timeline-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.timeline {
    position: relative;
    padding-left: 30px;
    border-left: 2px solid #e5e7eb;
}

.timeline-item {
    position: relative;
    padding-left: 24px;
    margin-bottom: 24px;
}

.timeline-item:last-child {
    margin-bottom: 0;
}

.timeline-item-active .timeline-content {
    border-left: 3px solid #03C95A;
    /* Success color */
}

.timeline-marker {
    position: absolute;
    left: -47px;
    top: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-marker-blue {
    background: #1B84FF;
    /* Info color */
}

.timeline-marker-yellow {
    background: #FFC107;
    /* Warning color */
}

.timeline-marker-green {
    background: #03C95A;
    /* Success color */
}

.timeline-marker-red {
    background: #E70D0D;
    /* Danger color */
}

.timeline-marker-gray {
    background: #9ca3af;
}

.timeline-content {
    background: white;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-left: 3px solid transparent;
}

.timeline-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.timeline-event-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.timeline-date {
    font-size: 0.85rem;
    color: #6b7280;
    display: flex;
    align-items: center;
}

.timeline-detail {
    font-size: 0.9rem;
    margin-bottom: 8px;
    color: #4b5563;
    display: flex;
    gap: 6px;
}

.timeline-reason,
.timeline-notes {
    background: #f3f4f6;
    border-left: 3px solid #011b44;
    /* Primary color */
    padding: 12px;
    border-radius: 8px;
    margin-top: 12px;
    font-size: 0.9rem;
    color: #374151;
}

.probation-decision-card {
    margin-top: 20px;
    padding: 16px;
    border: 1px dashed #dee2e6;
    /* Gray-200 for subtle border */
    border-radius: 12px;
    background: #fff;
    /* White background */
}

.decision-header {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 12px;
}

.decision-header i {
    font-size: 1.4rem;
    color: #011b44;
    /* Primary color */
}

.decision-body .decision-field {
    margin-bottom: 12px;
}

.decision-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}
</style>

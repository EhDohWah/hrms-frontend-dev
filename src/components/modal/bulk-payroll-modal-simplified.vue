<template>
    <!-- Bulk Payroll Creation Modal -->
    <div class="modal fade" id="bulk-payroll-modal" tabindex="-1" aria-labelledby="bulkPayrollModalLabel"
        aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                    <div>
                        <h5 class="modal-title fw-bold" id="bulkPayrollModalLabel">
                            <i class="ti ti-cash-banknote me-2"></i>Bulk Payroll Creation
                        </h5>
                        <small class="text-muted">Create payroll records for multiple employees with real-time tracking</small>
                    </div>
                    <button type="button" class="btn-close" :disabled="isProcessing" @click="handleModalClose" aria-label="Close"></button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">
                    <!-- Progress Steps -->
                    <div class="steps-container mb-4">
                        <div class="step" :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }">
                            <div class="step-number">1</div>
                            <div class="step-label">Pay Period</div>
                        </div>
                        <div class="step-line" :class="{ 'active': currentStep > 1 }"></div>
                        <div class="step" :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }">
                            <div class="step-number">2</div>
                            <div class="step-label">Select Employees</div>
                        </div>
                        <div class="step-line" :class="{ 'active': currentStep > 2 }"></div>
                        <div class="step" :class="{ 'active': currentStep >= 3, 'completed': currentStep > 3 }">
                            <div class="step-number">3</div>
                            <div class="step-label">Preview</div>
                        </div>
                        <div class="step-line" :class="{ 'active': currentStep > 3 }"></div>
                        <div class="step" :class="{ 'active': currentStep >= 4 }">
                            <div class="step-number">4</div>
                            <div class="step-label">Progress</div>
                        </div>
                    </div>

                    <!-- Step Content -->
                    <div class="step-content">
                        <!-- Step 1: Pay Period Selection -->
                        <div v-show="currentStep === 1">
                            <div class="mb-3">
                                <p class="text-muted mb-3">
                                    <i class="ti ti-info-circle me-1"></i>
                                    Select the pay period month for bulk payroll creation.
                                </p>
                            </div>

                            <div class="row g-3">
                                <div class="col-md-12">
                                    <label class="form-label">Pay Period (Month) <span class="text-danger">*</span></label>
                                    <a-month-picker
                                        v-model:value="formData.payPeriod"
                                        class="w-100"
                                        format="MMMM YYYY"
                                        value-format="YYYY-MM"
                                        placeholder="Select pay period month"
                                        size="large"
                                    />
                                    <small class="text-muted">Select the month for which payroll should be created (e.g., October 2025)</small>
                                    <div v-if="formErrors.payPeriod" class="text-danger mt-1">{{ formErrors.payPeriod }}</div>
                                </div>
                            </div>

                            <!-- Summary Info -->
                            <div class="row mt-4">
                                <div class="col-md-12">
                                    <div class="info-box">
                                        <div class="info-label">Selected Pay Period</div>
                                        <div class="info-value">{{ formatPayPeriod(formData.payPeriod) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: Select Employees by Organization -->
                        <div v-show="currentStep === 2">
                            <div class="mb-3">
                                <p class="text-muted mb-3">
                                    <i class="ti ti-info-circle me-1"></i>
                                    Select organization to filter employees for bulk payroll creation.
                                </p>
                            </div>

                            <!-- Organization Selection -->
                            <div class="row g-3 mb-4">
                                <div class="col-md-12">
                                    <label class="form-label">Select Organization <span class="text-danger">*</span></label>
                                    <a-select v-model:value="selectedOrganization" class="w-100" size="large"
                                        placeholder="Choose SMRU or BHF" @change="handleOrganizationChange">
                                        <a-select-option value="SMRU">
                                            <i class="ti ti-building me-2"></i>SMRU
                                        </a-select-option>
                                        <a-select-option value="BHF">
                                            <i class="ti ti-building me-2"></i>BHF
                                        </a-select-option>
                                    </a-select>
                                    <div v-if="formErrors.organization" class="text-danger mt-1">{{ formErrors.organization }}</div>
                                </div>
                            </div>

                            <!-- Employee Count Summary -->
                            <div v-if="selectedOrganization" class="alert alert-info">
                                <i class="ti ti-info-circle me-2"></i>
                                All active employees in <strong>{{ selectedOrganization }}</strong> will be included in the bulk payroll creation.
                            </div>
                        </div>

                        <!-- Step 3: Preview -->
                        <div v-show="currentStep === 3">
                            <!-- Loading Preview -->
                            <div v-if="loadingPreview" class="text-center py-5">
                                <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
                                <p class="text-muted">Calculating preview for {{ selectedOrganization }}...</p>
                            </div>

                            <!-- Preview Data -->
                            <div v-else-if="previewData">
                                <div class="mb-3">
                                    <p class="text-muted mb-3">
                                        <i class="ti ti-info-circle me-1"></i>
                                        Review the detailed preview before creating payroll records.
                                    </p>
                                </div>

                                <!-- Statistics Cards -->
                                <div class="row g-3 mb-4">
                                    <div class="col-md-3">
                                        <div class="preview-card text-center">
                                            <div class="preview-icon"><i class="ti ti-users text-primary"></i></div>
                                            <div class="preview-number">{{ previewData.summary?.total_employees || 0 }}</div>
                                            <div class="preview-label">Employees</div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="preview-card text-center">
                                            <div class="preview-icon"><i class="ti ti-file-invoice text-info"></i></div>
                                            <div class="preview-number">{{ previewData.summary?.total_payrolls || 0 }}</div>
                                            <div class="preview-label">Payroll Records</div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="preview-card text-center">
                                            <div class="preview-icon"><i class="ti ti-cash text-success"></i></div>
                                            <div class="preview-number">฿{{ previewData.summary?.total_net_salary || '0.00' }}</div>
                                            <div class="preview-label">Total Net Salary</div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="preview-card text-center">
                                            <div class="preview-icon"><i class="ti ti-arrows-exchange text-warning"></i></div>
                                            <div class="preview-number">{{ previewData.summary?.advances_needed || 0 }}</div>
                                            <div class="preview-label">Inter-Sub Advances</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pay Period Info -->
                                <div class="alert alert-info mb-3">
                                    <strong><i class="ti ti-calendar me-1"></i>Pay Period:</strong> {{ formatPayPeriod(formData.payPeriod) }}
                                    <br>
                                    <strong><i class="ti ti-building me-1"></i>Organization:</strong> {{ selectedOrganization }}
                                </div>

                                <!-- Warnings -->
                                <div v-if="previewData.warnings && previewData.warnings.length > 0" class="mb-3">
                                    <h6 class="text-warning mb-2">
                                        <i class="ti ti-alert-triangle me-1"></i>Warnings ({{ previewData.warnings.length }})
                                    </h6>
                                    <div class="warnings-list" style="max-height: 200px; overflow-y: auto;">
                                        <div
                                            v-for="(warning, index) in displayedWarnings"
                                            :key="index"
                                            class="alert alert-warning py-2 px-3 mb-2 small"
                                        >
                                            <i class="ti ti-alert-circle me-1"></i>{{ warning }}
                                        </div>
                                        <button
                                            v-if="previewData.warnings.length > 5 && !showAllWarnings"
                                            type="button"
                                            class="btn btn-sm btn-outline-warning"
                                            @click="showAllWarnings = true"
                                        >
                                            Show all {{ previewData.warnings.length }} warnings
                                        </button>
                                    </div>
                                </div>

                                <!-- NEW: Detailed Employee Breakdown -->
                                <div v-if="previewData.employees && previewData.employees.length > 0" class="preview-details mt-4">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <h6 class="mb-0">
                                            <i class="ti ti-list-details me-2"></i>Detailed Breakdown
                                            <span class="text-muted small ms-2">
                                                ({{ filteredPreviewEmployees.length }} employees)
                                            </span>
                                        </h6>
                                        <!-- Search -->
                                        <input
                                            v-model="previewSearchQuery"
                                            type="text"
                                            class="form-control form-control-sm"
                                            placeholder="Search by name or staff ID..."
                                            style="max-width: 250px"
                                        />
                                    </div>

                                    <!-- Employee Accordion -->
                                    <a-collapse v-model:active-key="expandedEmployees" accordion class="preview-accordion">
                                        <a-collapse-panel
                                            v-for="(emp, index) in paginatedPreviewEmployees"
                                            :key="index"
                                        >
                                            <template #header>
                                                <div class="employee-header-preview d-flex align-items-center justify-content-between w-100">
                                                    <div class="d-flex align-items-center gap-2">
                                                        <a-avatar :style="{ backgroundColor: getOrgColor(emp.organization) }">
                                                            {{ emp.name.charAt(0) }}
                                                        </a-avatar>
                                                        <div>
                                                            <strong>{{ emp.staff_id }}</strong> - {{ emp.name }}
                                                            <br />
                                                            <small class="text-muted">{{ emp.department }} • {{ emp.position }}</small>
                                                        </div>
                                                    </div>
                                                    <div class="d-flex align-items-center gap-3">
                                                        <a-badge v-if="emp.has_warnings" count="!" :style="{ backgroundColor: '#f5222d' }" />
                                                        <span class="text-muted small">{{ emp.allocation_count }} allocation(s)</span>
                                                        <span class="text-success fw-bold">฿{{ emp.total_net }}</span>
                                                    </div>
                                                </div>
                                            </template>

                                            <!-- Allocation Details Table -->
                                            <div class="allocation-details">
                                                <table class="table table-sm table-bordered mb-0">
                                                    <thead class="table-light">
                                                        <tr>
                                                            <th style="width: 200px">Grant</th>
                                                            <th style="width: 60px">FTE</th>
                                                            <th style="width: 120px">Gross</th>
                                                            <th style="width: 120px">Deductions</th>
                                                            <th style="width: 120px">Net</th>
                                                            <th style="width: 80px" class="text-center">Advance</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(alloc, idx) in emp.allocations" :key="idx">
                                                            <td>
                                                                <div class="grant-info">
                                                                    <strong class="text-primary">{{ alloc.grant_code }}</strong>
                                                                    <br />
                                                                    <small class="text-muted">{{ alloc.grant_name }}</small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span class="badge bg-info">{{ alloc.fte }}</span>
                                                            </td>
                                                            <td>
                                                                <div class="salary-breakdown">
                                                                    <div class="main-amount text-primary fw-bold">
                                                                        ฿{{ alloc.gross_salary }}
                                                                    </div>
                                                                    <small class="text-muted">
                                                                        By FTE: ฿{{ alloc.gross_salary_by_fte }}
                                                                    </small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <a-popover title="Deduction Breakdown" trigger="click">
                                                                    <template #content>
                                                                        <div class="breakdown-popover">
                                                                            <div class="d-flex justify-content-between mb-1">
                                                                                <span>Tax:</span>
                                                                                <strong>฿{{ alloc.deductions.tax }}</strong>
                                                                            </div>
                                                                            <div class="d-flex justify-content-between mb-1">
                                                                                <span>Employee SS:</span>
                                                                                <strong>฿{{ alloc.deductions.employee_ss }}</strong>
                                                                            </div>
                                                                            <div class="d-flex justify-content-between mb-1">
                                                                                <span>Employee HW:</span>
                                                                                <strong>฿{{ alloc.deductions.employee_hw }}</strong>
                                                                            </div>
                                                                            <hr class="my-2" />
                                                                            <div class="d-flex justify-content-between">
                                                                                <strong>Total:</strong>
                                                                                <strong class="text-danger">
                                                                                    ฿{{ alloc.deductions.total }}
                                                                                </strong>
                                                                            </div>
                                                                        </div>
                                                                    </template>
                                                                    <span class="text-danger cursor-pointer">
                                                                        ฿{{ alloc.deductions.total }}
                                                                        <i class="ti ti-info-circle ms-1"></i>
                                                                    </span>
                                                                </a-popover>
                                                            </td>
                                                            <td>
                                                                <strong class="text-success">
                                                                    ฿{{ alloc.net_salary }}
                                                                </strong>
                                                            </td>
                                                            <td class="text-center">
                                                                <a-tag v-if="alloc.needs_advance" color="warning">
                                                                    <i class="ti ti-arrow-right-circle me-1"></i>Yes
                                                                </a-tag>
                                                                <span v-else class="text-muted">-</span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                    <tfoot class="table-light">
                                                        <tr>
                                                            <td colspan="2" class="text-end"><strong>Employee Total:</strong></td>
                                                            <td><strong>฿{{ emp.total_gross }}</strong></td>
                                                            <td colspan="2">
                                                                <strong class="text-success">฿{{ emp.total_net }}</strong>
                                                            </td>
                                                            <td></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </a-collapse-panel>
                                    </a-collapse>

                                    <!-- Pagination -->
                                    <div v-if="filteredPreviewEmployees.length > previewPageSize" class="d-flex justify-content-center mt-3">
                                        <a-pagination
                                            v-model:current="previewPage"
                                            v-model:page-size="previewPageSize"
                                            :total="filteredPreviewEmployees.length"
                                            :show-size-changer="false"
                                            size="small"
                                        />
                                    </div>
                                </div>

                                <!-- Confirmation Note -->
                                <div class="alert alert-primary mb-0 mt-4">
                                    <strong><i class="ti ti-info-circle me-1"></i>Ready to Create:</strong>
                                    This will create <strong>{{ previewData.summary?.total_payrolls || 0 }} payroll records</strong> for
                                    <strong>{{ previewData.summary?.total_employees || 0 }} employees</strong> in {{ selectedOrganization }}.
                                    Click "Create Payroll" to proceed.
                                </div>
                            </div>
                        </div>

                        <!-- Step 4: Progress Tracking -->
                        <div v-show="currentStep === 4">
                            <div v-if="batchData">
                                <!-- Status Header -->
                                <div class="alert" :class="statusAlertClass" role="alert">
                                    <h5 class="mb-1">
                                        <i :class="statusIcon" class="me-2"></i>{{ statusText }}
                                    </h5>
                                    <p class="mb-0 small">Batch ID: #{{ batchData.batch_id }} | Pay Period: {{ formatPayPeriod(batchData.pay_period) }}</p>
                                </div>

                                <!-- Progress Bar -->
                                <div class="mb-4">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="fw-semibold">Progress</span>
                                        <span class="fw-bold text-primary">{{ batchData.progress_percentage }}%</span>
                                    </div>
                                    <div class="progress" style="height: 30px;">
                                        <div
                                            class="progress-bar progress-bar-striped"
                                            :class="progressBarClass"
                                            :style="{ width: batchData.progress_percentage + '%' }"
                                            role="progressbar"
                                        >
                                            <strong>{{ batchData.processed }} / {{ batchData.total }}</strong>
                                        </div>
                                    </div>
                                </div>

                                <!-- Currently Processing -->
                                <div v-if="isProcessing && batchData.current_employee" class="alert alert-primary d-flex align-items-center mb-4">
                                    <div class="spinner-border spinner-border-sm me-3"></div>
                                    <div>
                                        <strong>Currently Processing:</strong><br />
                                        <span class="small">{{ batchData.current_employee }}</span>
                                        <span v-if="batchData.current_allocation" class="small"> - {{ batchData.current_allocation }}</span>
                                    </div>
                                </div>

                                <!-- Statistics -->
                                <div class="row g-3 mb-3">
                                    <div class="col-md-3 col-6">
                                        <div class="stat-card-sm bg-success">
                                            <div class="stat-number-sm">{{ batchData.stats?.successful || 0 }}</div>
                                            <div class="stat-label-sm">Successful</div>
                                        </div>
                                    </div>
                                    <div class="col-md-3 col-6">
                                        <div class="stat-card-sm bg-danger">
                                            <div class="stat-number-sm">{{ batchData.stats?.failed || 0 }}</div>
                                            <div class="stat-label-sm">Failed</div>
                                        </div>
                                    </div>
                                    <div class="col-md-3 col-6">
                                        <div class="stat-card-sm bg-info">
                                            <div class="stat-number-sm">{{ batchData.stats?.advances_created || 0 }}</div>
                                            <div class="stat-label-sm">Advances</div>
                                        </div>
                                    </div>
                                    <div class="col-md-3 col-6">
                                        <div class="stat-card-sm bg-primary">
                                            <div class="stat-number-sm">{{ batchData.total || 0 }}</div>
                                            <div class="stat-label-sm">Total</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Connection Status -->
                                <div class="text-end mb-3">
                                    <small class="text-muted">
                                        <i :class="connectionIcon" class="me-1"></i>{{ connectionStatus }}
                                    </small>
                                </div>

                                <!-- Errors Section -->
                                <div v-if="batchData.has_errors" class="alert alert-danger">
                                    <h6><i class="ti ti-alert-triangle me-1"></i>Errors ({{ batchData.error_count }})</h6>
                                    <p class="small mb-2">Some payroll records failed to process. You can download the error report.</p>
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-outline-danger"
                                        @click="downloadErrors"
                                        :disabled="downloadingErrors"
                                    >
                                        <span v-if="!downloadingErrors">
                                            <i class="ti ti-download me-1"></i>Download Errors CSV
                                        </span>
                                        <span v-else>
                                            <span class="spinner-border spinner-border-sm me-1"></span>Downloading...
                                        </span>
                                    </button>
                                </div>

                                <!-- Completion Message -->
                                <div v-if="isCompleted" class="text-center py-4">
                                    <i class="ti ti-circle-check text-success" style="font-size: 4rem;"></i>
                                    <h5 class="mt-3 text-success">Bulk Payroll Creation Completed!</h5>
                                    <p class="text-muted">
                                        Successfully created {{ batchData.stats?.successful || 0 }} out of {{ batchData.total }} payroll records
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer d-flex justify-content-between">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="handleModalClose"
                        :disabled="isProcessing"
                    >
                        <i class="ti ti-x me-1"></i>{{ isCompleted ? 'Close' : 'Cancel' }}
                    </button>
                    <div class="d-flex gap-2">
                        <button
                            v-if="currentStep > 1 && currentStep < 4"
                            type="button"
                            class="btn btn-outline-primary"
                            @click="previousStep"
                        >
                            <i class="ti ti-chevron-left me-1"></i>Previous
                        </button>
                        <button
                            v-if="currentStep === 1"
                            type="button"
                            class="btn btn-primary"
                            @click="nextStep"
                            :disabled="!canProceedFromStep1"
                        >
                            Next<i class="ti ti-chevron-right ms-1"></i>
                        </button>
                        <button
                            v-if="currentStep === 2"
                            type="button"
                            class="btn btn-primary"
                            @click="generatePreview"
                            :disabled="!selectedOrganization || loadingPreview"
                        >
                            <span v-if="!loadingPreview">
                                <i class="ti ti-calculator me-1"></i>Calculate Preview
                            </span>
                            <span v-else>
                                <span class="spinner-border spinner-border-sm me-2"></span>Calculating...
                            </span>
                        </button>
                        <button
                            v-if="currentStep === 3"
                            type="button"
                            class="btn btn-success"
                            @click="createBulkPayroll"
                            :disabled="submitting || !previewData"
                        >
                            <span v-if="!submitting">
                                <i class="ti ti-check me-1"></i>Create Payroll ({{ previewData?.total_payrolls || 0 }})
                            </span>
                            <span v-else>
                                <span class="spinner-border spinner-border-sm me-2"></span>Creating...
                            </span>
                        </button>
                        <button
                            v-if="currentStep === 4 && isCompleted"
                            type="button"
                            class="btn btn-success"
                            @click="handleModalClose"
                        >
                            <i class="ti ti-check me-1"></i>Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { ref, reactive, computed, createVNode, nextTick, onMounted, onUnmounted } from 'vue';
import moment from 'moment';
import { payrollService } from '@/services/payroll.service';
import { message, Modal as AntModal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import Echo from 'laravel-echo';

export default {
    name: 'BulkPayrollModalSimplified',
    emits: ['payroll-created', 'refresh'],

    setup(props, { emit }) {
        const currentStep = ref(1);
        const submitting = ref(false);
        const loadingPreview = ref(false);
        const downloadingErrors = ref(false);
        const showAllWarnings = ref(false);

        const formData = reactive({
            payPeriod: null,
        });

        const formErrors = reactive({
            payPeriod: '',
            organization: '',
        });

        const selectedOrganization = ref(null);
        const previewData = ref(null);
        const batchData = ref(null);

        // Preview search and pagination
        const previewSearchQuery = ref('');
        const expandedEmployees = ref([]);
        const previewPage = ref(1);
        const previewPageSize = ref(10);

        // WebSocket and polling
        const wsConnected = ref(false);
        const httpPollingInterval = ref(null);
        const echo = ref(null);

        // CRITICAL: Timeout tracking to prevent memory leaks
        const wsTimeout = ref(null);
        const disconnectTimeout = ref(null);

        // Bootstrap Modal instance
        let modalInstance = null;

        // Flag to prevent recursive confirmation dialogs
        let isClosing = false;

        // Computed
        const canProceedFromStep1 = computed(() => {
            return formData.payPeriod !== null;
        });

        const displayedWarnings = computed(() => {
            if (!previewData.value || !previewData.value.warnings) return [];
            return showAllWarnings.value
                ? previewData.value.warnings
                : previewData.value.warnings.slice(0, 5);
        });

        // Filtered preview employees based on search
        const filteredPreviewEmployees = computed(() => {
            if (!previewData.value?.employees) return [];
            
            const employees = previewData.value.employees;
            if (!previewSearchQuery.value) return employees;
            
            const search = previewSearchQuery.value.toLowerCase();
            return employees.filter(emp => 
                emp.name.toLowerCase().includes(search) ||
                emp.staff_id.toLowerCase().includes(search) ||
                emp.department.toLowerCase().includes(search)
            );
        });

        // Paginated preview employees
        const paginatedPreviewEmployees = computed(() => {
            const start = (previewPage.value - 1) * previewPageSize.value;
            const end = start + previewPageSize.value;
            return filteredPreviewEmployees.value.slice(start, end);
        });

        const isProcessing = computed(() => batchData.value?.status === 'processing');
        const isCompleted = computed(() => batchData.value?.status === 'completed');
        const isFailed = computed(() => batchData.value?.status === 'failed');

        const statusText = computed(() => {
            if (!batchData.value) return 'Initializing...';
            switch (batchData.value.status) {
                case 'pending': return 'Batch Pending';
                case 'processing': return 'Processing Payroll Records';
                case 'completed': return 'Batch Completed Successfully';
                case 'failed': return 'Batch Failed';
                default: return 'Unknown Status';
            }
        });

        const statusIcon = computed(() => {
            if (!batchData.value) return 'ti ti-loader';
            switch (batchData.value.status) {
                case 'pending': return 'ti ti-clock';
                case 'processing': return 'ti ti-loader ti-spin';
                case 'completed': return 'ti ti-circle-check';
                case 'failed': return 'ti ti-circle-x';
                default: return 'ti ti-question-mark';
            }
        });

        const statusAlertClass = computed(() => {
            if (!batchData.value) return 'alert-info';
            switch (batchData.value.status) {
                case 'pending': return 'alert-warning';
                case 'processing': return 'alert-primary';
                case 'completed': return 'alert-success';
                case 'failed': return 'alert-danger';
                default: return 'alert-info';
            }
        });

        const progressBarClass = computed(() => {
            if (!batchData.value) return 'bg-primary';
            const percentage = batchData.value.progress_percentage || 0;
            if (batchData.value.status === 'completed') return 'bg-success progress-bar-animated';
            if (batchData.value.status === 'failed') return 'bg-danger';
            if (percentage < 25) return 'bg-primary progress-bar-animated';
            if (percentage < 50) return 'bg-info progress-bar-animated';
            if (percentage < 75) return 'bg-warning progress-bar-animated';
            return 'bg-success progress-bar-animated';
        });

        const connectionStatus = computed(() => {
            if (wsConnected.value) return 'Connected via WebSocket (Real-time)';
            if (httpPollingInterval.value) return 'Connected via HTTP Polling (Fallback)';
            return 'Connecting...';
        });

        const connectionIcon = computed(() => {
            if (wsConnected.value) return 'ti ti-bolt text-success';
            if (httpPollingInterval.value) return 'ti ti-refresh text-warning';
            return 'ti ti-loader ti-spin text-muted';
        });

        // Methods
        const formatPayPeriod = (payPeriod) => {
            if (!payPeriod) return 'Not set';
            return moment(payPeriod, 'YYYY-MM').format('MMMM YYYY');
        };

        const validateStep = (step) => {
            Object.keys(formErrors).forEach(key => formErrors[key] = '');

            if (step === 1 && !formData.payPeriod) {
                formErrors.payPeriod = 'Pay period is required';
                return false;
            }
            if (step === 2 && !selectedOrganization.value) {
                formErrors.organization = 'Please select a organization';
                return false;
            }
            return true;
        };

        const nextStep = () => {
            if (!validateStep(currentStep.value)) {
                message.warning('Please complete all required fields');
                return;
            }
            if (currentStep.value < 4) {
                currentStep.value++;
            }
        };

        const previousStep = () => {
            if (currentStep.value > 1) {
                currentStep.value--;
            }
        };

        const handleOrganizationChange = () => {
            formErrors.organization = '';
            previewData.value = null;
        };

        const generatePreview = async () => {
            if (!validateStep(2)) {
                message.warning('Please select a organization');
                return;
            }

            loadingPreview.value = true;
            showAllWarnings.value = false;

            try {
                const payload = {
                    pay_period: formData.payPeriod,
                    filters: {
                        subsidiaries: [selectedOrganization.value],
                    },
                };

                const response = await payrollService.bulkPreview(payload);

                if (response.success) {
                    previewData.value = response.data;
                    currentStep.value = 3; // Move to preview step
                    message.success('Preview generated successfully');
                } else {
                    throw new Error(response.message || 'Failed to generate preview');
                }
            } catch (error) {
                console.error('Preview error:', error);
                message.error(error.response?.data?.message || error.message || 'Failed to generate preview');
            } finally {
                loadingPreview.value = false;
            }
        };

        const createBulkPayroll = async () => {
            submitting.value = true;

            try {
                const payload = {
                    pay_period: formData.payPeriod,
                    filters: {
                        subsidiaries: [selectedOrganization.value],
                    },
                };

                const response = await payrollService.bulkCreate(payload);

                if (response.success) {
                    const batchId = response.data.batch_id;
                    batchData.value = response.data;

                    message.success('Bulk payroll batch created! Starting processing...');

                    // Move to progress step
                    currentStep.value = 4;

                    // Start tracking progress
                    startProgressTracking(batchId);
                } else {
                    throw new Error(response.message || 'Failed to create bulk payroll batch');
                }
            } catch (error) {
                console.error('Create batch error:', error);
                message.error(error.response?.data?.message || error.message || 'Failed to create bulk payroll batch');
                submitting.value = false;
            }
        };

        const startProgressTracking = (batchId) => {
            // Fetch initial status
            fetchBatchStatus(batchId);

            // Try WebSocket first
            connectWebSocket(batchId);

            // Start HTTP polling as fallback
            startHttpPolling(batchId);
        };

        const fetchBatchStatus = async (batchId) => {
            try {
                const response = await payrollService.getBatchStatus(batchId);
                if (response.success) {
                    batchData.value = response.data;

                    // Stop tracking when completed
                    if (isCompleted.value || isFailed.value) {
                        stopHttpPolling();
                        disconnectWebSocket();
                        emit('refresh');
                    }
                }
            } catch (error) {
                console.error('Fetch status error:', error);
            }
        };

        const connectWebSocket = (batchId) => {
            try {
                echo.value = new Echo({
                    broadcaster: 'reverb',
                    key: process.env.VUE_APP_REVERB_APP_KEY || 'local',
                    wsHost: process.env.VUE_APP_REVERB_HOST || window.location.hostname,
                    wsPort: process.env.VUE_APP_REVERB_PORT || 8080,
                    wssPort: process.env.VUE_APP_REVERB_PORT || 8080,
                    forceTLS: (process.env.VUE_APP_REVERB_SCHEME || 'https') === 'https',
                    enabledTransports: ['ws', 'wss'],
                    disableStats: true,
                });

                // CRITICAL FIX: Track WebSocket connection timeout for cleanup
                wsTimeout.value = setTimeout(() => {
                    if (!wsConnected.value) {
                        console.log('[WebSocket] Timeout - using HTTP polling');
                        disconnectWebSocket();
                    }
                    wsTimeout.value = null; // Clear after execution
                }, 3000);

                echo.value
                    .channel(`payroll-bulk.${batchId}`)
                    .listen('.payroll.progress', (event) => {
                        console.log('[WebSocket] Progress update:', event);

                        batchData.value = {
                            ...batchData.value,
                            processed: event.processed,
                            total: event.total,
                            status: event.status,
                            progress_percentage: Math.round((event.processed / event.total) * 100),
                            current_employee: event.currentEmployee,
                            current_allocation: event.currentAllocation,
                            stats: event.stats,
                        };

                        if (!wsConnected.value) {
                            wsConnected.value = true;
                            // CRITICAL FIX: Clear wsTimeout using ref
                            if (wsTimeout.value) {
                                clearTimeout(wsTimeout.value);
                                wsTimeout.value = null;
                            }
                            stopHttpPolling();
                        }

                        if (event.status === 'completed' || event.status === 'failed') {
                            // CRITICAL FIX: Track disconnectTimeout for cleanup
                            disconnectTimeout.value = setTimeout(() => {
                                disconnectWebSocket();
                                emit('refresh');
                                disconnectTimeout.value = null; // Clear after execution
                            }, 2000);
                        }
                    });
            } catch (error) {
                console.error('[WebSocket] Error:', error);
            }
        };

        const disconnectWebSocket = () => {
            if (echo.value) {
                echo.value.disconnect();
                echo.value = null;
                wsConnected.value = false;
            }
        };

        const startHttpPolling = (batchId) => {
            if (httpPollingInterval.value) return;

            httpPollingInterval.value = setInterval(() => {
                if (!wsConnected.value && currentStep.value === 4) {
                    fetchBatchStatus(batchId);
                }
            }, 3000);
        };

        const stopHttpPolling = () => {
            if (httpPollingInterval.value) {
                clearInterval(httpPollingInterval.value);
                httpPollingInterval.value = null;
            }
        };

        const downloadErrors = async () => {
            if (!batchData.value?.has_errors) return;

            downloadingErrors.value = true;
            try {
                const response = await payrollService.downloadBatchErrors(batchData.value.batch_id);
                const blob = new Blob([response], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `bulk_payroll_errors_${batchData.value.batch_id}_${batchData.value.pay_period}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                message.success('Error report downloaded');
            } catch (error) {
                console.error('Download error:', error);
                message.error('Failed to download error report');
            } finally {
                downloadingErrors.value = false;
            }
        };

        const resetModal = () => {
            currentStep.value = 1;
            formData.payPeriod = null;
            selectedOrganization.value = null;
            previewData.value = null;
            batchData.value = null;
            showAllWarnings.value = false;
            previewSearchQuery.value = '';
            expandedEmployees.value = [];
            previewPage.value = 1;
            Object.keys(formErrors).forEach(key => formErrors[key] = '');
            stopHttpPolling();
            disconnectWebSocket();
        };

        // Helper: Get organization color for avatar
        const getOrgColor = (organization) => {
            const colors = {
                'SMRU': '#1890ff',
                'BHF': '#52c41a',
            };
            return colors[organization] || '#8c8c8c';
        };

        // Helper function to check if user has unsaved data
        const hasUnsavedData = () => {
            // Check if user is in steps 1-3 with data entered
            if (currentStep.value === 1 && formData.payPeriod !== null) return true;
            if (currentStep.value === 2 && selectedOrganization.value !== null) return true;
            if (currentStep.value === 3 && previewData.value !== null) return true;
            return false;
        };

        // Cleanup function for modal backdrops (matches employment-modal pattern)
        const cleanupModalBackdrops = () => {
            nextTick(() => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                const activeModals = document.querySelectorAll('.modal.show');

                // Only remove backdrops if no other modals are open
                if (activeModals.length === 0 && backdrops.length > 0) {
                    backdrops.forEach(backdrop => backdrop.remove());
                }

                // Ensure body classes are correct
                if (activeModals.length === 0) {
                    document.body.classList.remove('modal-open');
                    document.body.style.removeProperty('overflow');
                    document.body.style.removeProperty('padding-right');
                }
            });
        };

        // Safe modal hide helper (matches employment-modal pattern)
        const safeHideModal = () => {
            return new Promise((resolve) => {
                // Set closing flag to prevent recursive confirmations
                isClosing = true;

                nextTick(() => {
                    if (modalInstance) {
                        try {
                            const modalEl = document.getElementById('bulk-payroll-modal');
                            if (modalEl) {
                                modalEl.addEventListener('hidden.bs.modal', () => {
                                    cleanupModalBackdrops();
                                    resetModal();
                                    isClosing = false; // Reset flag after modal is hidden
                                    resolve(true);
                                }, { once: true });

                                modalInstance.hide();
                            } else {
                                resetModal();
                                isClosing = false;
                                resolve(true);
                            }
                        } catch (error) {
                            console.error('Error hiding modal:', error);
                            resetModal();
                            isClosing = false;
                            resolve(false);
                        }
                    } else {
                        resetModal();
                        isClosing = false;
                        resolve(true);
                    }
                });
            });
        };

        // Show confirmation dialog when there are unsaved changes (matches employment-modal pattern)
        const showUnsavedChangesConfirm = () => {
            AntModal.confirm({
                title: 'Unsaved Progress',
                icon: createVNode(ExclamationCircleOutlined),
                content: createVNode('div', { style: 'margin-top: 16px;' }, [
                    createVNode('p', { style: 'margin-bottom: 12px; color: #666;' },
                        'You have unsaved progress in the bulk payroll wizard.'),
                    createVNode('p', { style: 'margin-bottom: 0; font-weight: 500; color: #d9534f;' },
                        'All data will be lost if you close now.')
                ]),
                centered: true,
                okText: 'Continue Editing',
                okType: 'default',
                cancelText: 'Discard and Close',
                cancelButtonProps: { danger: true },

                onOk: () => {
                    // User chose to continue editing - do nothing
                    return Promise.resolve();
                },

                onCancel: async () => {
                    // User chose to discard changes and close
                    await safeHideModal();
                    return Promise.resolve();
                }
            });
        };

        // Main modal close handler (matches employment-modal pattern)
        const handleModalClose = async () => {
            // Always prevent closing if processing
            if (isProcessing.value) {
                message.warning('Please wait for the batch to complete before closing');
                return;
            }

            // If in step 4 (completed or failed), allow direct close
            if (currentStep.value === 4) {
                await safeHideModal();
                return;
            }

            // Check for unsaved data in steps 1-3
            if (hasUnsavedData()) {
                showUnsavedChangesConfirm();
            } else {
                await safeHideModal();
            }
        };

        // Initialize Bootstrap modal instance on mount (matches employment-modal pattern)
        onMounted(() => {
            const modalElement = document.getElementById('bulk-payroll-modal');
            if (modalElement) {
                modalInstance = new Modal(modalElement, {
                    backdrop: 'static',
                    keyboard: false
                });

                // Prevent modal from closing if there are unsaved changes
                modalElement.addEventListener('hide.bs.modal', (event) => {
                    // Don't intercept if already in closing process (prevents infinite loop)
                    if (isClosing) {
                        return;
                    }

                    // Allow closing if processing is done (step 4) or no unsaved data
                    if (currentStep.value === 4 || !hasUnsavedData()) {
                        return; // Allow closing
                    }

                    // Prevent default closing behavior
                    if (hasUnsavedData() && !isProcessing.value) {
                        event.preventDefault();
                        event.stopPropagation();
                        // Show confirmation dialog
                        handleModalClose();
                    }
                });

                // Listen to modal events for cleanup after modal is hidden
                modalElement.addEventListener('hidden.bs.modal', () => {
                    cleanupModalBackdrops();
                });
            }
        });

        // Cleanup on unmount
        onUnmounted(() => {
            if (modalInstance) {
                const modalElement = document.getElementById('bulk-payroll-modal');
                if (modalElement) {
                    // Remove all event listeners
                    const clone = modalElement.cloneNode(true);
                    modalElement.parentNode.replaceChild(clone, modalElement);
                }
                modalInstance.dispose();
                modalInstance = null;
            }
            stopHttpPolling();
            disconnectWebSocket();
            cleanupModalBackdrops();

            // CRITICAL FIX: Clear all tracked timeouts to prevent memory leaks
            if (wsTimeout.value) {
                clearTimeout(wsTimeout.value);
                wsTimeout.value = null;
            }
            if (disconnectTimeout.value) {
                clearTimeout(disconnectTimeout.value);
                disconnectTimeout.value = null;
            }
        });

        return {
            currentStep,
            submitting,
            loadingPreview,
            downloadingErrors,
            showAllWarnings,
            formData,
            formErrors,
            selectedOrganization,
            previewData,
            batchData,
            wsConnected,
            previewSearchQuery,
            expandedEmployees,
            previewPage,
            previewPageSize,
            canProceedFromStep1,
            displayedWarnings,
            filteredPreviewEmployees,
            paginatedPreviewEmployees,
            isProcessing,
            isCompleted,
            isFailed,
            statusText,
            statusIcon,
            statusAlertClass,
            progressBarClass,
            connectionStatus,
            connectionIcon,
            formatPayPeriod,
            nextStep,
            previousStep,
            handleOrganizationChange,
            generatePreview,
            createBulkPayroll,
            downloadErrors,
            handleModalClose,
            getOrgColor,
        };
    },
};
</script>

<style scoped>
/* Existing styles remain the same... */
.modal-header {
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
}

.steps-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 0;
    background: #f8f9fa;
    border-radius: 0.5rem;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #dee2e6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #6c757d;
    transition: all 0.3s ease;
}

.step.active .step-number {
    background: #0d6efd;
    border-color: #0d6efd;
    color: #fff;
}

.step.completed .step-number {
    background: #28a745;
    border-color: #28a745;
    color: #fff;
}

.step.completed .step-number::before {
    content: "✓";
}

.step-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6c757d;
}

.step.active .step-label {
    color: #0d6efd;
    font-weight: 600;
}

.step-line {
    width: 80px;
    height: 2px;
    background: #dee2e6;
    margin: 0 0.5rem;
    transition: all 0.3s ease;
}

.step-line.active {
    background: #28a745;
}

.info-box {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 0.375rem;
    border-left: 3px solid #0d6efd;
}

.info-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #6c757d;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.info-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: #212529;
}

/* Preview Cards */
.preview-card {
    padding: 1.5rem;
    background: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
}

.preview-card:hover {
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.preview-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.preview-number {
    font-size: 1.75rem;
    font-weight: 700;
    color: #212529;
    margin-bottom: 0.25rem;
}

.preview-label {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
}

/* Progress Stats */
.stat-card-sm {
    padding: 1rem;
    border-radius: 0.375rem;
    color: white;
    text-align: center;
}

.stat-number-sm {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.25rem;
}

.stat-label-sm {
    font-size: 0.75rem;
    opacity: 0.9;
}

.ti-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

:deep(.ant-picker),
:deep(.ant-select-selector) {
    border-radius: 0.375rem !important;
}

:deep(.ant-select-dropdown),
:deep(.ant-picker-dropdown) {
    z-index: 1060 !important;
}

/* Preview Details Styles */
.preview-details {
    margin-top: 1.5rem;
}

.preview-accordion :deep(.ant-collapse-header) {
    padding: 12px 16px !important;
}

.employee-header-preview {
    pointer-events: none;
}

.employee-header-preview > * {
    pointer-events: auto;
}

.grant-info {
    line-height: 1.4;
}

.salary-breakdown {
    line-height: 1.3;
}

.main-amount {
    font-size: 14px;
}

.breakdown-popover {
    min-width: 200px;
}

.breakdown-popover .d-flex {
    font-size: 13px;
}

.cursor-pointer {
    cursor: pointer;
}

.cursor-pointer:hover {
    text-decoration: underline;
}

.allocation-details {
    margin-top: 12px;
}

.allocation-details table {
    font-size: 13px;
}

.allocation-details thead th {
    font-weight: 600;
    font-size: 12px;
    text-align: center;
}

.allocation-details tbody td {
    vertical-align: middle;
}

.allocation-details tfoot {
    font-weight: 600;
}

@media (max-width: 768px) {
    .steps-container {
        flex-wrap: wrap;
    }

    .step-line {
        width: 40px;
    }

    .employee-header-preview {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 8px;
    }

    .allocation-details {
        overflow-x: auto;
    }
}
</style>

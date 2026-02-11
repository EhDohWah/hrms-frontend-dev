<template>
    <!-- Process Monthly Payroll Modal - Ant Design Redesign -->
    <div class="modal fade" id="bulk-payroll-modal" tabindex="-1" aria-labelledby="bulkPayrollModalLabel"
        aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content new-modal-design">
                <!-- Modal Header -->
                <div class="modal-header">
                    <div>
                        <h2 class="modal-title" id="bulkPayrollModalLabel">
                            <i class="ti ti-cash-banknote me-2"></i>Process Monthly Payroll
                        </h2>
                        <small class="text-muted d-block mt-1">
                            Generate payroll records for multiple employees with real-time progress tracking
                        </small>
                    </div>
                    <button type="button" class="btn-close-custom" :disabled="isProcessing" @click="handleModalClose" aria-label="Close">
                        <i class="ti ti-x"></i>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">
                    <!-- Ant Design Steps Component -->
                    <a-steps :current="currentStep - 1" class="payroll-steps mb-4">
                        <a-step v-for="item in stepItems" :key="item.title">
                            <template #title>{{ item.title }}</template>
                            <template #icon>
                                <component :is="item.icon" />
                            </template>
                        </a-step>
                    </a-steps>

                    <!-- Step Content -->
                    <div class="step-content-container">
                        <!-- Step 1: Pay Period Selection -->
                        <div v-show="currentStep === 1" class="step-panel fade-in">
                            <a-card :bordered="false" class="step-card">
                                <template #title>
                                    <div class="d-flex align-items-center">
                                        <calendar-outlined class="me-2 text-primary" style="font-size: 20px;" />
                                        <span>Select Pay Period</span>
                                    </div>
                                </template>

                                <a-alert
                                    message="Monthly Payroll Generation"
                                    description="Choose the month for which you want to process payroll. This will generate payroll records for all active employees in the selected period."
                                    type="info"
                                    show-icon
                                    :icon="h(InfoCircleOutlined)"
                                    class="mb-4"
                                />

                                <a-form layout="vertical" class="step-form">
                                    <a-row :gutter="24">
                                        <a-col :span="24">
                                            <a-form-item
                                                label="Pay Period Month"
                                                :validate-status="formErrors.payPeriod ? 'error' : ''"
                                                :help="formErrors.payPeriod"
                                                required
                                            >
                                                <a-month-picker
                                                    v-model:value="formData.payPeriod"
                                                    class="w-100"
                                                    format="MMMM YYYY"
                                                    value-format="YYYY-MM"
                                                    placeholder="Select pay period month (e.g., October 2025)"
                                                    size="large"
                                                    :disabled-date="disabledDate"
                                                />
                                                <small class="ant-form-text text-muted">
                                                    <clock-circle-outlined class="me-1" />
                                                    Select the month for payroll processing
                                                </small>
                                            </a-form-item>
                                        </a-col>
                                    </a-row>

                                    <!-- Selected Period Display -->
                                    <a-card v-if="formData.payPeriod" class="selected-period-card mt-3" size="small">
                                        <a-statistic
                                            title="Selected Pay Period"
                                            :value="formatPayPeriod(formData.payPeriod)"
                                            :value-style="{ color: '#3f8600', fontSize: '24px' }"
                                        >
                                            <template #prefix>
                                                <check-circle-outlined />
                                            </template>
                                        </a-statistic>
                                    </a-card>
                                </a-form>
                            </a-card>
                        </div>

                        <!-- Step 2: Select Organization -->
                        <div v-show="currentStep === 2" class="step-panel fade-in">
                            <a-card :bordered="false" class="step-card">
                                <template #title>
                                    <div class="d-flex align-items-center">
                                        <team-outlined class="me-2 text-primary" style="font-size: 20px;" />
                                        <span>Select Organization</span>
                                    </div>
                                </template>

                                <a-alert
                                    message="Organization Selection"
                                    description="Select the organization (SMRU or BHF) to process payroll for all active employees within that organization."
                                    type="info"
                                    show-icon
                                    :icon="h(InfoCircleOutlined)"
                                    class="mb-4"
                                />

                                <a-form layout="vertical" class="step-form">
                                    <a-row :gutter="24">
                                        <a-col :span="24">
                                            <a-form-item
                                                label="Organization"
                                                :validate-status="formErrors.organization ? 'error' : ''"
                                                :help="formErrors.organization"
                                                required
                                            >
                                                <a-radio-group
                                                    v-model:value="selectedOrganization"
                                                    size="large"
                                                    button-style="solid"
                                                    class="w-100 org-radio-group"
                                                    @change="handleOrganizationChange"
                                                >
                                                    <a-radio-button value="SMRU" class="org-radio-btn">
                                                        <div class="org-radio-content">
                                                            <bank-outlined style="font-size: 24px;" class="mb-2" />
                                                            <div class="org-name">SMRU</div>
                                                            <div class="org-subtitle">Shoklo Malaria Research Unit</div>
                                                        </div>
                                                    </a-radio-button>
                                                    <a-radio-button value="BHF" class="org-radio-btn">
                                                        <div class="org-radio-content">
                                                            <bank-outlined style="font-size: 24px;" class="mb-2" />
                                                            <div class="org-name">BHF</div>
                                                            <div class="org-subtitle">Border Health Foundation</div>
                                                        </div>
                                                    </a-radio-button>
                                                </a-radio-group>
                                            </a-form-item>
                                        </a-col>
                                    </a-row>

                                    <!-- Organization Info -->
                                    <a-alert
                                        v-if="selectedOrganization"
                                        :message="`${selectedOrganization} Organization Selected`"
                                        :description="`All active employees in ${selectedOrganization} will be included in this payroll processing batch.`"
                                        type="success"
                                        show-icon
                                        class="mt-3"
                                    />
                                </a-form>
                            </a-card>
                        </div>

                        <!-- Step 3: Review & Confirm (Redesigned with Ant Design) -->
                        <div v-show="currentStep === 3" class="step-panel fade-in">
                            <!-- Loading State -->
                            <div v-if="loadingPreview" class="text-center py-5">
                                <a-spin size="large">
                                    <template #indicator>
                                        <loading-outlined style="font-size: 48px;" spin />
                                    </template>
                                </a-spin>
                                <p class="text-muted mt-3">Calculating payroll preview for {{ selectedOrganization }}...</p>
                            </div>

                            <!-- Preview Data -->
                            <div v-else-if="previewData">
                                <!-- Period & Organization Info Banner -->
                                <a-alert class="mb-3" type="info" show-icon>
                                    <template #message>
                                        <div class="d-flex align-items-center justify-content-between flex-wrap">
                                            <div>
                                                <strong>Pay Period:</strong> {{ formatPayPeriod(formData.payPeriod) }}
                                                <a-divider type="vertical" />
                                                <strong>Organization:</strong>
                                                <a-tag :color="selectedOrganization === 'SMRU' ? 'blue' : 'green'" class="ms-2">
                                                    {{ selectedOrganization }}
                                                </a-tag>
                                            </div>
                                        </div>
                                    </template>
                                </a-alert>

                                <!-- Statistics - Ant Design Statistic Cards -->
                                <a-row :gutter="16" class="mb-4">
                                    <a-col :xs="12" :sm="12" :md="6">
                                        <a-card class="stat-card-modern">
                                            <a-statistic
                                                title="Employees"
                                                :value="previewData.summary?.total_employees || 0"
                                                :value-style="{ color: '#1890ff' }"
                                            >
                                                <template #prefix>
                                                    <user-outlined />
                                                </template>
                                            </a-statistic>
                                        </a-card>
                                    </a-col>
                                    <a-col :xs="12" :sm="12" :md="6">
                                        <a-card class="stat-card-modern">
                                            <a-statistic
                                                title="Payroll Records"
                                                :value="previewData.summary?.total_payrolls || 0"
                                                :value-style="{ color: '#13c2c2' }"
                                            >
                                                <template #prefix>
                                                    <file-text-outlined />
                                                </template>
                                            </a-statistic>
                                        </a-card>
                                    </a-col>
                                    <a-col :xs="12" :sm="12" :md="6">
                                        <a-card class="stat-card-modern">
                                            <a-statistic
                                                title="Total Net Salary"
                                                :value="parseFloat(previewData.summary?.total_net_salary || 0)"
                                                :precision="2"
                                                :value-style="{ color: '#52c41a' }"
                                                prefix="฿"
                                            >
                                                <template #prefix>
                                                    <dollar-outlined />
                                                </template>
                                            </a-statistic>
                                        </a-card>
                                    </a-col>
                                    <a-col :xs="12" :sm="12" :md="6">
                                        <a-card class="stat-card-modern">
                                            <a-statistic
                                                title="Inter-Sub Advances"
                                                :value="previewData.summary?.advances_needed || 0"
                                                :value-style="{ color: '#faad14' }"
                                            >
                                                <template #prefix>
                                                    <swap-outlined />
                                                </template>
                                            </a-statistic>
                                        </a-card>
                                    </a-col>
                                </a-row>

                                <!-- Warnings Section -->
                                <a-alert
                                    v-if="previewData.warnings && previewData.warnings.length > 0"
                                    type="warning"
                                    show-icon
                                    class="mb-3"
                                >
                                    <template #message>
                                        <strong>{{ previewData.warnings.length }} Warning(s) Detected</strong>
                                    </template>
                                    <template #description>
                                        <div style="max-height: 120px; overflow-y: auto;">
                                            <ul class="mb-0">
                                                <li v-for="(warning, index) in displayedWarnings" :key="index">
                                                    {{ warning }}
                                                </li>
                                            </ul>
                                            <a-button
                                                v-if="previewData.warnings.length > 5 && !showAllWarnings"
                                                type="link"
                                                size="small"
                                                @click="showAllWarnings = true"
                                                class="p-0 mt-2"
                                            >
                                                Show all {{ previewData.warnings.length }} warnings
                                            </a-button>
                                        </div>
                                    </template>
                                </a-alert>

                                <!-- Employee Payroll Preview Table -->
                                <PayrollPreviewTable
                                    v-if="previewData.employees && previewData.employees.length > 0"
                                    :employees="previewData.employees"
                                />

                                <!-- Ready to Process Banner -->
                                <a-alert type="success" show-icon class="mt-3">
                                    <template #message>
                                        <strong>Ready to Process Payroll</strong>
                                    </template>
                                    <template #description>
                                        This will create <strong>{{ previewData.summary?.total_payrolls || 0 }} payroll records</strong> for
                                        <strong>{{ previewData.summary?.total_employees || 0 }} employees</strong> in {{ selectedOrganization }}.
                                    </template>
                                </a-alert>
                            </div>
                        </div>

                        <!-- Step 4: Processing -->
                        <div v-show="currentStep === 4" class="step-panel fade-in">
                            <div v-if="batchData">
                                <!-- Status Card -->
                                <a-card :bordered="false" class="mb-4">
                                    <a-result
                                        v-if="isCompleted"
                                        status="success"
                                        title="Payroll Processing Completed!"
                                        :sub-title="`Successfully created ${batchData.stats?.successful || 0} out of ${batchData.total} payroll records`"
                                    >
                                        <template #icon>
                                            <check-circle-outlined style="color: #52c41a" />
                                        </template>
                                    </a-result>

                                    <a-result
                                        v-else-if="isFailed"
                                        status="error"
                                        title="Processing Failed"
                                        sub-title="An error occurred during payroll processing. Please check the error details below."
                                    >
                                        <template #icon>
                                            <close-circle-outlined style="color: #ff4d4f" />
                                        </template>
                                    </a-result>

                                    <div v-else>
                                        <a-descriptions :column="1" bordered size="small" class="mb-3">
                                            <a-descriptions-item label="Status">
                                                <a-tag :color="statusTagColor">{{ statusText }}</a-tag>
                                            </a-descriptions-item>
                                            <a-descriptions-item label="Batch ID">
                                                <a-tag color="purple">#{{ batchData.batch_id }}</a-tag>
                                            </a-descriptions-item>
                                            <a-descriptions-item label="Pay Period">
                                                {{ formatPayPeriod(batchData.pay_period) }}
                                            </a-descriptions-item>
                                        </a-descriptions>

                                        <!-- Progress Bar -->
                                        <div class="mb-4">
                                            <a-progress
                                                :percent="batchData.progress_percentage || 0"
                                                :status="progressStatus"
                                                :stroke-color="progressColor"
                                            >
                                                <template #format="percent">
                                                    <span style="font-weight: bold;">{{ batchData.processed }} / {{ batchData.total }}</span>
                                                </template>
                                            </a-progress>
                                        </div>

                                        <!-- Currently Processing -->
                                        <a-alert v-if="isProcessing && batchData.current_employee" type="info" show-icon class="mb-3">
                                            <template #message>
                                                <strong>Currently Processing</strong>
                                            </template>
                                            <template #description>
                                                <div>{{ batchData.current_employee }}</div>
                                                <div v-if="batchData.current_allocation" class="text-muted small">
                                                    {{ batchData.current_allocation }}
                                                </div>
                                            </template>
                                        </a-alert>
                                    </div>
                                </a-card>

                                <!-- Statistics Cards -->
                                <a-row :gutter="16" class="mb-3">
                                    <a-col :xs="12" :sm="6">
                                        <a-card class="stat-card-modern">
                                            <a-statistic
                                                title="Successful"
                                                :value="batchData.stats?.successful || 0"
                                                :value-style="{ color: '#52c41a' }"
                                            >
                                                <template #prefix>
                                                    <check-circle-outlined />
                                                </template>
                                            </a-statistic>
                                        </a-card>
                                    </a-col>
                                    <a-col :xs="12" :sm="6">
                                        <a-card class="stat-card-modern">
                                            <a-statistic
                                                title="Failed"
                                                :value="batchData.stats?.failed || 0"
                                                :value-style="{ color: '#ff4d4f' }"
                                            >
                                                <template #prefix>
                                                    <close-circle-outlined />
                                                </template>
                                            </a-statistic>
                                        </a-card>
                                    </a-col>
                                    <a-col :xs="12" :sm="6">
                                        <a-card class="stat-card-modern">
                                            <a-statistic
                                                title="Advances"
                                                :value="batchData.stats?.advances_created || 0"
                                                :value-style="{ color: '#13c2c2' }"
                                            >
                                                <template #prefix>
                                                    <swap-outlined />
                                                </template>
                                            </a-statistic>
                                        </a-card>
                                    </a-col>
                                    <a-col :xs="12" :sm="6">
                                        <a-card class="stat-card-modern">
                                            <a-statistic
                                                title="Total"
                                                :value="batchData.total || 0"
                                                :value-style="{ color: '#1890ff' }"
                                            >
                                                <template #prefix>
                                                    <file-text-outlined />
                                                </template>
                                            </a-statistic>
                                        </a-card>
                                    </a-col>
                                </a-row>

                                <!-- Connection Status -->
                                <div class="text-end mb-3">
                                    <a-tag :color="wsConnected ? 'green' : 'orange'">
                                        <template #icon>
                                            <component :is="wsConnected ? h(CheckCircleOutlined) : h(SyncOutlined)" :spin="!wsConnected" />
                                        </template>
                                        {{ connectionStatus }}
                                    </a-tag>
                                </div>

                                <!-- Errors Section -->
                                <a-alert
                                    v-if="batchData.has_errors"
                                    type="error"
                                    show-icon
                                    class="mb-3"
                                >
                                    <template #message>
                                        <strong>Errors Detected ({{ batchData.error_count }})</strong>
                                    </template>
                                    <template #description>
                                        <p class="mb-2">Some payroll records failed to process. Download the error report for details.</p>
                                        <a-button
                                            type="primary"
                                            danger
                                            size="small"
                                            @click="downloadErrors"
                                            :loading="downloadingErrors"
                                        >
                                            <template #icon>
                                                <download-outlined />
                                            </template>
                                            Download Error Report
                                        </a-button>
                                    </template>
                                </a-alert>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <a-space>
                        <a-button
                            size="large"
                            @click="handleModalClose"
                            :disabled="isProcessing"
                        >
                            <template #icon>
                                <close-outlined />
                            </template>
                            {{ isCompleted ? 'Close' : 'Cancel' }}
                        </a-button>

                        <a-button
                            v-if="currentStep > 1 && currentStep < 4"
                            size="large"
                            @click="previousStep"
                        >
                            <template #icon>
                                <left-outlined />
                            </template>
                            Previous
                        </a-button>

                        <a-button
                            v-if="currentStep === 1"
                            type="primary"
                            size="large"
                            @click="nextStep"
                            :disabled="!canProceedFromStep1"
                        >
                            Next
                            <template #icon>
                                <right-outlined />
                            </template>
                        </a-button>

                        <a-button
                            v-if="currentStep === 2"
                            type="primary"
                            size="large"
                            @click="generatePreview"
                            :disabled="!selectedOrganization"
                            :loading="loadingPreview"
                        >
                            <template #icon>
                                <calculator-outlined v-if="!loadingPreview" />
                            </template>
                            {{ loadingPreview ? 'Calculating...' : 'Generate Preview' }}
                        </a-button>

                        <a-button
                            v-if="currentStep === 3"
                            type="primary"
                            size="large"
                            @click="createBulkPayroll"
                            :disabled="submitting || !previewData"
                            :loading="submitting"
                            danger
                        >
                            <template #icon>
                                <check-outlined v-if="!submitting" />
                            </template>
                            {{ submitting ? 'Processing...' : `Process Payroll (${previewData?.summary?.total_payrolls || 0})` }}
                        </a-button>

                        <a-button
                            v-if="currentStep === 4 && isCompleted"
                            type="primary"
                            size="large"
                            @click="handleModalClose"
                        >
                            <template #icon>
                                <check-outlined />
                            </template>
                            Done
                        </a-button>
                    </a-space>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { ref, reactive, computed, createVNode, h, nextTick, onMounted, onUnmounted } from 'vue';
import { Empty } from 'ant-design-vue';
import PayrollPreviewTable from '@/components/shared/PayrollPreviewTable.vue';
import moment from 'moment';
import { payrollService } from '@/services/payroll.service';
import { message, Modal as AntModal } from 'ant-design-vue';
import {
    CalendarOutlined,
    TeamOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
    BankOutlined,
    LoadingOutlined,
    UserOutlined,
    FileTextOutlined,
    DollarOutlined,
    SwapOutlined,
    SearchOutlined,
    UnorderedListOutlined,
    FundOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    DownloadOutlined,
    CloseOutlined,
    LeftOutlined,
    RightOutlined,
    CalculatorOutlined,
    CheckOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import Echo from 'laravel-echo';

export default {
    name: 'BulkPayrollModalImproved',
    emits: ['payroll-created', 'refresh'],
    components: {
        CalendarOutlined,
        TeamOutlined,
        EyeOutlined,
        CheckCircleOutlined,
        InfoCircleOutlined,
        ClockCircleOutlined,
        BankOutlined,
        LoadingOutlined,
        UserOutlined,
        FileTextOutlined,
        DollarOutlined,
        SwapOutlined,
        SearchOutlined,
        UnorderedListOutlined,
        FundOutlined,
        CloseCircleOutlined,
        SyncOutlined,
        DownloadOutlined,
        CloseOutlined,
        LeftOutlined,
        RightOutlined,
        CalculatorOutlined,
        CheckOutlined,
        ExclamationCircleOutlined,
        PayrollPreviewTable,
    },

    setup(props, { emit }) {
        const currentStep = ref(1);
        const submitting = ref(false);
        const loadingPreview = ref(false);
        const downloadingErrors = ref(false);
        const showAllWarnings = ref(false);
        const activeAllocations = ref([0]); // For collapse panels

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

        // Preview UI state
        const previewSearchQuery = ref('');
        const selectedEmployeeIndex = ref(null);

        // WebSocket and polling
        const wsConnected = ref(false);
        const httpPollingInterval = ref(null);
        const echo = ref(null);
        const wsTimeout = ref(null);
        const disconnectTimeout = ref(null);

        // Bootstrap Modal instance
        let modalInstance = null;
        let isClosing = false;

        // Empty image for Ant Design Empty component
        const emptyImage = Empty.PRESENTED_IMAGE_SIMPLE;

        // Step items for Ant Design Steps
        const stepItems = computed(() => [
            {
                title: 'Pay Period',
                icon: h(CalendarOutlined),
            },
            {
                title: 'Select Organization',
                icon: h(TeamOutlined),
            },
            {
                title: 'Review & Confirm',
                icon: h(EyeOutlined),
            },
            {
                title: 'Processing',
                icon: h(CheckCircleOutlined),
            },
        ]);

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

        const filteredPreviewEmployees = computed(() => {
            if (!previewData.value?.employees) return [];

            const employees = previewData.value.employees;
            if (!previewSearchQuery.value) return employees;

            const search = previewSearchQuery.value.toLowerCase();
            return employees.filter(emp =>
                emp.name.toLowerCase().includes(search) ||
                emp.staff_id.toLowerCase().includes(search) ||
                emp.department.toLowerCase().includes(search) ||
                emp.position.toLowerCase().includes(search)
            );
        });

        const selectedEmployee = computed(() => {
            if (selectedEmployeeIndex.value === null) return null;
            return filteredPreviewEmployees.value[selectedEmployeeIndex.value];
        });

        const isProcessing = computed(() => batchData.value?.status === 'processing');
        const isCompleted = computed(() => batchData.value?.status === 'completed');
        const isFailed = computed(() => batchData.value?.status === 'failed');

        const statusText = computed(() => {
            if (!batchData.value) return 'Initializing...';
            switch (batchData.value.status) {
                case 'pending': return 'Batch Pending';
                case 'processing': return 'Processing Payroll Records';
                case 'completed': return 'Completed';
                case 'failed': return 'Failed';
                default: return 'Unknown Status';
            }
        });

        const statusTagColor = computed(() => {
            if (!batchData.value) return 'default';
            switch (batchData.value.status) {
                case 'pending': return 'warning';
                case 'processing': return 'processing';
                case 'completed': return 'success';
                case 'failed': return 'error';
                default: return 'default';
            }
        });

        const progressStatus = computed(() => {
            if (!batchData.value) return 'normal';
            if (isCompleted.value) return 'success';
            if (isFailed.value) return 'exception';
            return 'active';
        });

        const progressColor = computed(() => {
            if (!batchData.value) return '#1890ff';
            if (isCompleted.value) return '#52c41a';
            if (isFailed.value) return '#ff4d4f';
            const percentage = batchData.value.progress_percentage || 0;
            if (percentage < 25) return '#1890ff';
            if (percentage < 50) return '#13c2c2';
            if (percentage < 75) return '#faad14';
            return '#52c41a';
        });

        const connectionStatus = computed(() => {
            if (wsConnected.value) return 'Real-time (WebSocket)';
            if (httpPollingInterval.value) return 'HTTP Polling (Fallback)';
            return 'Connecting...';
        });

        // Methods
        const formatPayPeriod = (payPeriod) => {
            if (!payPeriod) return 'Not set';
            return moment(payPeriod, 'YYYY-MM').format('MMMM YYYY');
        };

        const formatCurrency = (value) => {
            if (!value) return '0.00';
            return parseFloat(value).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        const disabledDate = (current) => {
            // Can disable future dates if needed
            // return current && current > moment().endOf('month');
            return false;
        };

        const validateStep = (step) => {
            Object.keys(formErrors).forEach(key => formErrors[key] = '');

            if (step === 1 && !formData.payPeriod) {
                formErrors.payPeriod = 'Pay period is required';
                return false;
            }
            if (step === 2 && !selectedOrganization.value) {
                formErrors.organization = 'Please select an organization';
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
                if (currentStep.value === 2) {
                    selectedEmployeeIndex.value = null;
                }
            }
        };

        const handleOrganizationChange = () => {
            formErrors.organization = '';
            previewData.value = null;
            selectedEmployeeIndex.value = null;
        };

        const selectEmployee = (index) => {
            selectedEmployeeIndex.value = index;
            activeAllocations.value = [0]; // Auto-open first allocation
        };

        const generatePreview = async () => {
            if (!validateStep(2)) {
                message.warning('Please select an organization');
                return;
            }

            loadingPreview.value = true;
            showAllWarnings.value = false;
            selectedEmployeeIndex.value = null;

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
                    currentStep.value = 3;
                    message.success('Preview generated successfully');

                    if (previewData.value.employees && previewData.value.employees.length > 0) {
                        nextTick(() => {
                            selectedEmployeeIndex.value = 0;
                        });
                    }
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

                    message.success('Payroll processing started!');
                    currentStep.value = 4;
                    startProgressTracking(batchId);
                } else {
                    throw new Error(response.message || 'Failed to create bulk payroll batch');
                }
            } catch (error) {
                console.error('Create batch error:', error);
                message.error(error.response?.data?.message || error.message || 'Failed to start payroll processing');
                submitting.value = false;
            }
        };

        const startProgressTracking = (batchId) => {
            fetchBatchStatus(batchId);
            connectWebSocket(batchId);
            startHttpPolling(batchId);
        };

        const fetchBatchStatus = async (batchId) => {
            try {
                const response = await payrollService.getBatchStatus(batchId);
                if (response.success) {
                    batchData.value = response.data;

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
                    key: import.meta.env.VITE_REVERB_APP_KEY || 'local',
                    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
                    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
                    wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
                    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https',
                    enabledTransports: ['ws', 'wss'],
                    disableStats: true,
                });

                wsTimeout.value = setTimeout(() => {
                    if (!wsConnected.value) {
                        console.log('[WebSocket] Timeout - using HTTP polling');
                        disconnectWebSocket();
                    }
                    wsTimeout.value = null;
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
                            if (wsTimeout.value) {
                                clearTimeout(wsTimeout.value);
                                wsTimeout.value = null;
                            }
                            stopHttpPolling();
                        }

                        if (event.status === 'completed' || event.status === 'failed') {
                            disconnectTimeout.value = setTimeout(() => {
                                disconnectWebSocket();
                                emit('refresh');
                                disconnectTimeout.value = null;
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
                link.download = `payroll_errors_${batchData.value.batch_id}_${batchData.value.pay_period}.csv`;
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
            selectedEmployeeIndex.value = null;
            activeAllocations.value = [0];
            Object.keys(formErrors).forEach(key => formErrors[key] = '');
            stopHttpPolling();
            disconnectWebSocket();
        };

        const getOrgColor = (organization) => {
            const colors = {
                'SMRU': '#1890ff',
                'BHF': '#52c41a',
            };
            return colors[organization] || '#8c8c8c';
        };

        const hasUnsavedData = () => {
            if (currentStep.value === 1 && formData.payPeriod !== null) return true;
            if (currentStep.value === 2 && selectedOrganization.value !== null) return true;
            if (currentStep.value === 3 && previewData.value !== null) return true;
            return false;
        };

        const cleanupModalBackdrops = () => {
            nextTick(() => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                const activeModals = document.querySelectorAll('.modal.show');

                if (activeModals.length === 0 && backdrops.length > 0) {
                    backdrops.forEach(backdrop => backdrop.remove());
                }

                if (activeModals.length === 0) {
                    document.body.classList.remove('modal-open');
                    document.body.style.removeProperty('overflow');
                    document.body.style.removeProperty('padding-right');
                }
            });
        };

        const safeHideModal = () => {
            return new Promise((resolve) => {
                isClosing = true;

                nextTick(() => {
                    if (modalInstance) {
                        try {
                            const modalEl = document.getElementById('bulk-payroll-modal');
                            if (modalEl) {
                                modalEl.addEventListener('hidden.bs.modal', () => {
                                    cleanupModalBackdrops();
                                    resetModal();
                                    isClosing = false;
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

        const showUnsavedChangesConfirm = () => {
            AntModal.confirm({
                title: 'Unsaved Progress',
                icon: createVNode(ExclamationCircleOutlined),
                content: createVNode('div', { style: 'margin-top: 16px;' }, [
                    createVNode('p', { style: 'margin-bottom: 12px; color: #666;' },
                        'You have unsaved progress in the payroll processing wizard.'),
                    createVNode('p', { style: 'margin-bottom: 0; font-weight: 500; color: #d9534f;' },
                        'All data will be lost if you close now.')
                ]),
                centered: true,
                okText: 'Continue Editing',
                okType: 'default',
                cancelText: 'Discard and Close',
                cancelButtonProps: { danger: true },

                onOk: () => {
                    return Promise.resolve();
                },

                onCancel: async () => {
                    await safeHideModal();
                    return Promise.resolve();
                }
            });
        };

        const handleModalClose = async () => {
            if (isProcessing.value) {
                message.warning('Please wait for processing to complete before closing');
                return;
            }

            if (currentStep.value === 4) {
                await safeHideModal();
                return;
            }

            if (hasUnsavedData()) {
                showUnsavedChangesConfirm();
            } else {
                await safeHideModal();
            }
        };

        onMounted(() => {
            const modalElement = document.getElementById('bulk-payroll-modal');
            if (modalElement) {
                modalInstance = new Modal(modalElement, {
                    backdrop: 'static',
                    keyboard: false
                });

                modalElement.addEventListener('hide.bs.modal', (event) => {
                    if (isClosing) {
                        return;
                    }

                    if (currentStep.value === 4 || !hasUnsavedData()) {
                        return;
                    }

                    if (hasUnsavedData() && !isProcessing.value) {
                        event.preventDefault();
                        event.stopPropagation();
                        handleModalClose();
                    }
                });

                modalElement.addEventListener('hidden.bs.modal', () => {
                    cleanupModalBackdrops();
                });
            }
        });

        onUnmounted(() => {
            if (modalInstance) {
                const modalElement = document.getElementById('bulk-payroll-modal');
                if (modalElement) {
                    const clone = modalElement.cloneNode(true);
                    modalElement.parentNode.replaceChild(clone, modalElement);
                }
                modalInstance.dispose();
                modalInstance = null;
            }
            stopHttpPolling();
            disconnectWebSocket();
            cleanupModalBackdrops();

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
            // Expose h function for template
            h,
            // Data
            currentStep,
            submitting,
            loadingPreview,
            downloadingErrors,
            showAllWarnings,
            activeAllocations,
            formData,
            formErrors,
            selectedOrganization,
            previewData,
            batchData,
            wsConnected,
            previewSearchQuery,
            selectedEmployeeIndex,
            emptyImage,
            stepItems,
            // Computed
            canProceedFromStep1,
            displayedWarnings,
            filteredPreviewEmployees,
            selectedEmployee,
            isProcessing,
            isCompleted,
            isFailed,
            statusText,
            statusTagColor,
            progressStatus,
            progressColor,
            connectionStatus,
            // Methods
            formatPayPeriod,
            formatCurrency,
            disabledDate,
            nextStep,
            previousStep,
            handleOrganizationChange,
            selectEmployee,
            generatePreview,
            createBulkPayroll,
            downloadErrors,
            handleModalClose,
            getOrgColor,
            // Icons (expose for template usage with h())
            InfoCircleOutlined,
            CheckCircleOutlined,
            ClockCircleOutlined,
            BankOutlined,
            LoadingOutlined,
            UserOutlined,
            FileTextOutlined,
            DollarOutlined,
            SwapOutlined,
            SearchOutlined,
            UnorderedListOutlined,
            FundOutlined,
            CloseCircleOutlined,
            SyncOutlined,
            DownloadOutlined,
            CloseOutlined,
            LeftOutlined,
            RightOutlined,
            CalculatorOutlined,
            CheckOutlined,
        };
    },
};
</script>

<style scoped>
/* Modal Design */
.new-modal-design .modal-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-bottom: 2px solid #e9ecef;
    padding: 24px 32px;
}

.new-modal-design .modal-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #212529;
    margin: 0;
}

.btn-close-custom {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0.5rem;
    line-height: 1;
    transition: all 0.2s;
}

.btn-close-custom:hover {
    color: #000;
    transform: scale(1.1);
}

.modal-body {
    padding: 32px;
    background: #fafafa;
}

.modal-footer {
    padding: 20px 32px;
    border-top: 1px solid #e9ecef;
    background: #ffffff;
    display: flex;
    justify-content: flex-end;
}

/* Fix icon vertical alignment in footer buttons */
.modal-footer :deep(.ant-btn) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.modal-footer :deep(.ant-btn .anticon) {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
}

/* Ant Design Steps Styling */
.payroll-steps {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.ant-steps-item-title) {
    font-size: 14px !important;
    font-weight: 500 !important;
}

/* Step Panels */
.step-content-container {
    min-height: 400px;
}

.step-panel {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.step-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

:deep(.ant-card-head) {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-bottom: 2px solid #e9ecef;
}

:deep(.ant-card-head-title) {
    font-size: 18px;
    font-weight: 600;
    color: #212529;
}

.step-form {
    margin-top: 16px;
}

:deep(.ant-form-item-label > label) {
    font-weight: 500;
    font-size: 14px;
}

.selected-period-card {
    background: #f6ffed;
    border: 1px solid #b7eb8f;
}

/* Organization Radio Buttons */
.org-radio-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.org-radio-btn {
    height: auto !important;
    padding: 24px 16px !important;
    text-align: center;
    border-radius: 8px !important;
}

:deep(.org-radio-btn .ant-radio-button) {
    height: 100%;
}

.org-radio-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.org-name {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 4px;
}

.org-subtitle {
    font-size: 12px;
    color: #8c8c8c;
}

/* Statistics Cards */
.stat-card-modern {
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card-modern:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

:deep(.ant-statistic-title) {
    font-size: 13px;
    font-weight: 500;
    color: #8c8c8c;
}

:deep(.ant-statistic-content) {
    font-size: 24px;
    font-weight: 600;
}

/* Employee Details */
.employee-details-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

.employee-list-card,
.employee-detail-card {
    height: 550px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.employee-list-modern {
    flex: 1;
    overflow-y: auto;
    max-height: 430px;
}

.employee-list-item-modern {
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 6px;
    margin-bottom: 8px;
    padding: 12px !important;
    background: #fafafa;
}

.employee-list-item-modern:hover {
    background: #e6f7ff;
}

.employee-list-item-modern.selected {
    background: #e6f7ff;
    border: 2px solid #1890ff;
}

.employee-name-modern {
    font-weight: 600;
    font-size: 14px;
    color: #212529;
}

.employee-meta-modern {
    margin-top: 4px;
}

.employee-salary-modern {
    font-size: 14px;
    margin-top: 4px;
}

.employee-detail-content {
    max-height: 480px;
    overflow-y: auto;
}

.summary-highlight-card {
    background: #f6ffed;
    border: 1px solid #b7eb8f;
}

.allocations-container-modern {
    max-height: 300px;
    overflow-y: auto;
}

:deep(.ant-collapse) {
    border-radius: 8px;
}

:deep(.ant-collapse-header) {
    font-weight: 600;
    background: #fafafa;
}

:deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
    background: #fafafa;
    font-weight: 500;
}

/* Scrollbar Styling */
.employee-list-modern::-webkit-scrollbar,
.employee-detail-content::-webkit-scrollbar,
.allocations-container-modern::-webkit-scrollbar {
    width: 6px;
}

.employee-list-modern::-webkit-scrollbar-track,
.employee-detail-content::-webkit-scrollbar-track,
.allocations-container-modern::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.employee-list-modern::-webkit-scrollbar-thumb,
.employee-detail-content::-webkit-scrollbar-thumb,
.allocations-container-modern::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}

.employee-list-modern::-webkit-scrollbar-thumb:hover,
.employee-detail-content::-webkit-scrollbar-thumb:hover,
.allocations-container-modern::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Ant Design Global Overrides */
:deep(.ant-picker),
:deep(.ant-select-selector),
:deep(.ant-input),
:deep(.ant-input-search) {
    border-radius: 6px !important;
}

:deep(.ant-select-dropdown),
:deep(.ant-picker-dropdown),
:deep(.ant-modal-wrap) {
    z-index: 1060 !important;
}

:deep(.ant-alert) {
    border-radius: 6px;
}

:deep(.ant-tag) {
    border-radius: 4px;
}

:deep(.ant-btn-lg) {
    height: 40px;
    padding: 8px 20px;
    font-size: 16px;
    border-radius: 6px;
}

:deep(.ant-progress-text) {
    font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
    .modal-body {
        padding: 16px;
    }

    .payroll-steps {
        padding: 16px;
    }

    .org-radio-group {
        grid-template-columns: 1fr;
    }

    .employee-list-card,
    .employee-detail-card {
        height: auto;
        min-height: 400px;
    }

    :deep(.ant-steps-item-title) {
        font-size: 12px !important;
    }
}
</style>

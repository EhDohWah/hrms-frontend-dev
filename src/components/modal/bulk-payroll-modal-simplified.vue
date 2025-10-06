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
                        <small class="text-muted">Create payroll records for multiple employees</small>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="resetModal"></button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">
                    <!-- Progress Steps - Simple Version -->
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
                            <div class="step-label">Review & Submit</div>
                        </div>
                    </div>

                    <!-- Step Content -->
                    <div class="step-content">
                        <!-- Step 1: Pay Period Selection -->
                        <div v-show="currentStep === 1">
                            <div class="mb-3">
                                <p class="text-muted mb-3">
                                    <i class="ti ti-info-circle me-1"></i>
                                    Configure the pay period dates and payment details for bulk payroll creation.
                                </p>
                            </div>

                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Pay Period Start Date <span
                                            class="text-danger">*</span></label>
                                    <a-date-picker v-model:value="formData.payPeriodStart" class="w-100"
                                        format="DD/MM/YYYY" placeholder="Select start date"
                                        :disabled-date="disableStartDate" @change="onStartDateChange" />
                                    <small v-if="formErrors.payPeriodStart" class="text-danger">{{
                                        formErrors.payPeriodStart }}</small>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Pay Period End Date <span
                                            class="text-danger">*</span></label>
                                    <a-date-picker v-model:value="formData.payPeriodEnd" class="w-100"
                                        format="DD/MM/YYYY" placeholder="Select end date"
                                        :disabled-date="disableEndDate" @change="onEndDateChange" />
                                    <small v-if="formErrors.payPeriodEnd" class="text-danger">{{ formErrors.payPeriodEnd
                                        }}</small>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Payment Date <span class="text-danger">*</span></label>
                                    <a-date-picker v-model:value="formData.paymentDate" class="w-100"
                                        format="DD/MM/YYYY" placeholder="Select payment date"
                                        :disabled-date="disablePaymentDate" />
                                    <small v-if="formErrors.paymentDate" class="text-danger">{{ formErrors.paymentDate
                                        }}</small>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Payroll Month <span class="text-danger">*</span></label>
                                    <a-select v-model:value="formData.payrollMonth" class="w-100"
                                        placeholder="Select month">
                                        <a-select-option v-for="month in months" :key="month.value"
                                            :value="month.value">
                                            {{ month.label }}
                                        </a-select-option>
                                    </a-select>
                                    <small v-if="formErrors.payrollMonth" class="text-danger">{{ formErrors.payrollMonth
                                        }}</small>
                                </div>
                            </div>

                            <!-- Summary Info -->
                            <div class="row mt-4">
                                <div class="col-md-4">
                                    <div class="info-box">
                                        <div class="info-label">Duration</div>
                                        <div class="info-value">{{ calculatePayPeriodDuration }}</div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="info-box">
                                        <div class="info-label">Payment Date</div>
                                        <div class="info-value">{{ formatDisplayDate(formData.paymentDate) }}</div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="info-box">
                                        <div class="info-label">Month</div>
                                        <div class="info-value">{{ getMonthLabel(formData.payrollMonth) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Step 2: Employee Selection -->
                        <div v-show="currentStep === 2">
                            <div class="mb-3">
                                <p class="text-muted mb-3">
                                    <i class="ti ti-info-circle me-1"></i>
                                    Select employees to include in this payroll batch. Use filters to narrow down your
                                    selection.
                                </p>
                            </div>

                            <!-- Filters -->
                            <div class="row g-2 mb-3">
                                <div class="col-md-4">
                                    <input type="text" class="form-control" v-model="employeeFilters.search"
                                        placeholder="Search by name or ID..." @input="handleEmployeeSearch" />
                                </div>
                                <div class="col-md-3">
                                    <a-select v-model:value="employeeFilters.subsidiary" class="w-100"
                                        placeholder="All Subsidiaries" allow-clear @change="handleEmployeeFilterChange">
                                        <a-select-option v-for="sub in availableSubsidiaries" :key="sub" :value="sub">
                                            {{ sub }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <div class="col-md-3">
                                    <a-select v-model:value="employeeFilters.department" class="w-100"
                                        placeholder="All Departments" allow-clear @change="handleEmployeeFilterChange">
                                        <a-select-option v-for="dept in availableDepartments" :key="dept" :value="dept">
                                            {{ dept }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <div class="col-md-2">
                                    <a-select v-model:value="employeeFilters.status" class="w-100" placeholder="Status"
                                        allow-clear @change="handleEmployeeFilterChange">
                                        <a-select-option value="active">Active</a-select-option>
                                        <a-select-option value="inactive">Inactive</a-select-option>
                                    </a-select>
                                </div>
                            </div>

                            <!-- Selection Actions -->
                            <div class="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                                <div>
                                    <strong>{{ selectedEmployees.length }}</strong> employee(s) selected
                                    <span v-if="filteredEmployees.length > 0" class="text-muted ms-2">
                                        of {{ filteredEmployees.length }}
                                    </span>
                                </div>
                                <div>
                                    <button type="button" class="btn btn-sm btn-primary me-2"
                                        @click="selectAllEmployees" :disabled="filteredEmployees.length === 0">
                                        Select All
                                    </button>
                                    <button type="button" class="btn btn-sm btn-secondary"
                                        @click="clearEmployeeSelection" :disabled="selectedEmployees.length === 0">
                                        Clear
                                    </button>
                                </div>
                            </div>

                            <!-- Employee List -->
                            <div v-if="!loadingEmployees" class="employee-list">
                                <div v-if="filteredEmployees.length > 0" class="row g-2">
                                    <div v-for="employee in paginatedEmployees" :key="employee.id" class="col-md-4">
                                        <div class="employee-item"
                                            :class="{ 'selected': isEmployeeSelected(employee.id) }"
                                            @click="toggleEmployeeSelection(employee.id)">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox"
                                                    :checked="isEmployeeSelected(employee.id)"
                                                    @click.stop="toggleEmployeeSelection(employee.id)" />
                                                <label class="form-check-label">
                                                    <div class="fw-semibold">{{ employee.name }}</div>
                                                    <small class="text-muted">{{ employee.staff_id }} • {{
                                                        employee.department }}</small>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-center py-4">
                                    <i class="ti ti-users-off text-muted" style="font-size: 3rem;"></i>
                                    <p class="text-muted mt-2">No employees found</p>
                                </div>

                                <!-- Pagination -->
                                <nav v-if="filteredEmployees.length > employeesPerPage" class="mt-3">
                                    <ul class="pagination pagination-sm justify-content-center">
                                        <li class="page-item" :class="{ disabled: employeeCurrentPage === 1 }">
                                            <a class="page-link" href="#"
                                                @click.prevent="employeeCurrentPage = Math.max(1, employeeCurrentPage - 1)">Previous</a>
                                        </li>
                                        <li class="page-item" :class="{ active: employeeCurrentPage === page }"
                                            v-for="page in Math.min(employeeTotalPages, 5)" :key="page">
                                            <a class="page-link" href="#" @click.prevent="employeeCurrentPage = page">{{
                                                page }}</a>
                                        </li>
                                        <li class="page-item"
                                            :class="{ disabled: employeeCurrentPage === employeeTotalPages }">
                                            <a class="page-link" href="#"
                                                @click.prevent="employeeCurrentPage = Math.min(employeeTotalPages, employeeCurrentPage + 1)">Next</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div v-else class="text-center py-4">
                                <div class="spinner-border text-primary" role="status"></div>
                                <p class="text-muted mt-2">Loading employees...</p>
                            </div>
                        </div>

                        <!-- Step 3: Review & Submit -->
                        <div v-show="currentStep === 3">
                            <div class="mb-3">
                                <p class="text-muted mb-3">
                                    <i class="ti ti-info-circle me-1"></i>
                                    Review your selection before creating payroll records.
                                </p>
                            </div>

                            <!-- Summary Cards -->
                            <div class="row g-3 mb-4">
                                <div class="col-md-3">
                                    <div class="summary-card text-center">
                                        <div class="summary-number">{{ selectedEmployees.length }}</div>
                                        <div class="summary-label">Employees</div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="summary-card text-center">
                                        <div class="summary-number">{{ calculatePayPeriodDuration }}</div>
                                        <div class="summary-label">Duration</div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="summary-card text-center">
                                        <div class="summary-number">{{ formatDisplayDate(formData.paymentDate) }}</div>
                                        <div class="summary-label">Payment Date</div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="summary-card text-center">
                                        <div class="summary-number">{{ getMonthLabel(formData.payrollMonth) }}</div>
                                        <div class="summary-label">Month</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Selected Employees Table -->
                            <div class="table-responsive">
                                <table class="table table-sm table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th style="width: 50px;">#</th>
                                            <th>Employee</th>
                                            <th>Staff ID</th>
                                            <th>Department</th>
                                            <th style="width: 80px;">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(employeeId, index) in selectedEmployees" :key="employeeId">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ getEmployeeById(employeeId)?.name }}</td>
                                            <td>{{ getEmployeeById(employeeId)?.staff_id }}</td>
                                            <td>{{ getEmployeeById(employeeId)?.department }}</td>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-outline-danger"
                                                    @click="removeEmployee(employeeId)">
                                                    <i class="ti ti-x"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetModal">
                        Cancel
                    </button>
                    <button v-if="currentStep > 1" type="button" class="btn btn-outline-primary" @click="previousStep">
                        <i class="ti ti-chevron-left"></i> Previous
                    </button>
                    <button v-if="currentStep < 3" type="button" class="btn btn-primary" @click="nextStep"
                        :disabled="!canProceedToNextStep">
                        Next <i class="ti ti-chevron-right"></i>
                    </button>
                    <button v-if="currentStep === 3" type="button" class="btn btn-success" @click="submitBulkPayroll"
                        :disabled="submitting || selectedEmployees.length === 0">
                        <span v-if="!submitting">
                            <i class="ti ti-check me-1"></i>Create Payroll ({{ selectedEmployees.length }})
                        </span>
                        <span v-else>
                            <span class="spinner-border spinner-border-sm me-2"></span>Processing...
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import moment from 'moment';
import { payrollService } from '@/services/payroll.service';
import { employmentService } from '@/services/employment.service';
import { useLookupStore } from '@/stores/lookupStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { message } from 'ant-design-vue';

export default {
    name: 'BulkPayrollModal',
    emits: ['payroll-created', 'refresh'],

    setup(props, { emit }) {
        const currentStep = ref(1);
        const submitting = ref(false);
        const loadingEmployees = ref(false);

        const formData = reactive({
            payPeriodStart: null,
            payPeriodEnd: null,
            paymentDate: null,
            payrollMonth: moment().format('YYYY-MM'),
        });

        const formErrors = reactive({
            payPeriodStart: '',
            payPeriodEnd: '',
            paymentDate: '',
            payrollMonth: '',
        });

        const employees = ref([]);
        const selectedEmployees = ref([]);
        const employeeFilters = reactive({
            search: '',
            subsidiary: null,
            department: null,
            status: 'active',
        });

        const employeeCurrentPage = ref(1);
        const employeesPerPage = ref(12);
        const availableSubsidiaries = ref([]);
        const availableDepartments = ref([]);

        const months = computed(() => {
            const monthsList = [];
            for (let i = 0; i < 12; i++) {
                const date = moment().subtract(i, 'months');
                monthsList.push({
                    value: date.format('YYYY-MM'),
                    label: date.format('MMMM YYYY'),
                });
            }
            return monthsList;
        });

        const calculatePayPeriodDuration = computed(() => {
            if (!formData.payPeriodStart || !formData.payPeriodEnd) return 'Not set';
            const start = moment(formData.payPeriodStart);
            const end = moment(formData.payPeriodEnd);
            const days = end.diff(start, 'days') + 1;
            return `${days} days`;
        });

        const filteredEmployees = computed(() => {
            let filtered = [...employees.value];
            if (employeeFilters.search) {
                const search = employeeFilters.search.toLowerCase();
                filtered = filtered.filter(emp =>
                    emp.name.toLowerCase().includes(search) ||
                    emp.staff_id.toLowerCase().includes(search)
                );
            }
            if (employeeFilters.subsidiary) {
                filtered = filtered.filter(emp => emp.subsidiary === employeeFilters.subsidiary);
            }
            if (employeeFilters.department) {
                filtered = filtered.filter(emp => emp.department === employeeFilters.department);
            }
            if (employeeFilters.status) {
                filtered = filtered.filter(emp => emp.status === employeeFilters.status);
            }
            return filtered;
        });

        const employeeTotalPages = computed(() => {
            return Math.ceil(filteredEmployees.value.length / employeesPerPage.value);
        });

        const paginatedEmployees = computed(() => {
            const start = (employeeCurrentPage.value - 1) * employeesPerPage.value;
            const end = start + employeesPerPage.value;
            return filteredEmployees.value.slice(start, end);
        });

        const canProceedToNextStep = computed(() => {
            if (currentStep.value === 1) {
                return formData.payPeriodStart && formData.payPeriodEnd && formData.paymentDate && formData.payrollMonth;
            }
            if (currentStep.value === 2) {
                return selectedEmployees.value.length > 0;
            }
            return true;
        });

        const formatDisplayDate = (date) => {
            if (!date) return 'Not set';
            return moment(date).format('DD MMM YYYY');
        };

        const getMonthLabel = (monthValue) => {
            if (!monthValue) return 'Not set';
            return moment(monthValue, 'YYYY-MM').format('MMMM YYYY');
        };

        const disableStartDate = (current) => {
            return current && current > moment().endOf('day');
        };

        const disableEndDate = (current) => {
            if (!current) return false;
            if (!formData.payPeriodStart) return current > moment().endOf('day');
            return current < moment(formData.payPeriodStart) || current > moment().endOf('day');
        };

        const disablePaymentDate = (current) => {
            if (!current) return false;
            if (!formData.payPeriodEnd) return current < moment().startOf('day');
            return current < moment(formData.payPeriodEnd);
        };

        const onStartDateChange = () => {
            if (formData.payPeriodEnd && moment(formData.payPeriodStart) > moment(formData.payPeriodEnd)) {
                formData.payPeriodEnd = null;
            }
        };

        const onEndDateChange = () => {
            if (formData.paymentDate && moment(formData.payPeriodEnd) > moment(formData.paymentDate)) {
                formData.paymentDate = null;
            }
        };

        const validateStep = (step) => {
            let isValid = true;
            Object.keys(formErrors).forEach(key => formErrors[key] = '');

            if (step === 1) {
                if (!formData.payPeriodStart) {
                    formErrors.payPeriodStart = 'Required';
                    isValid = false;
                }
                if (!formData.payPeriodEnd) {
                    formErrors.payPeriodEnd = 'Required';
                    isValid = false;
                }
                if (!formData.paymentDate) {
                    formErrors.paymentDate = 'Required';
                    isValid = false;
                }
                if (!formData.payrollMonth) {
                    formErrors.payrollMonth = 'Required';
                    isValid = false;
                }
            }

            if (step === 2) {
                if (selectedEmployees.value.length === 0) {
                    message.warning('Please select at least one employee');
                    isValid = false;
                }
            }

            return isValid;
        };

        const nextStep = () => {
            if (!validateStep(currentStep.value)) return;
            if (currentStep.value === 1) {
                fetchEmployees();
            }
            if (currentStep.value < 3) {
                currentStep.value++;
            }
        };

        const previousStep = () => {
            if (currentStep.value > 1) {
                currentStep.value--;
            }
        };

        const fetchEmployees = async () => {
            loadingEmployees.value = true;
            try {
                const response = await employmentService.getEmployments({
                    status: 'active',
                    per_page: 1000,
                });

                if (response.success && response.data) {
                    employees.value = response.data.map(emp => ({
                        id: emp.id,
                        staff_id: emp.employee?.staff_id || 'N/A',
                        name: `${emp.employee?.first_name_en || ''} ${emp.employee?.last_name_en || ''}`.trim(),
                        subsidiary: emp.employee?.subsidiary || 'N/A',
                        department: emp.department?.name || 'N/A',
                        position: emp.position?.title || 'N/A',
                        status: emp.employment_status || 'active',
                        employment_id: emp.id,
                    }));
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
                message.error('Failed to load employees');
            } finally {
                loadingEmployees.value = false;
            }
        };

        const isEmployeeSelected = (employeeId) => {
            return selectedEmployees.value.includes(employeeId);
        };

        const toggleEmployeeSelection = (employeeId) => {
            const index = selectedEmployees.value.indexOf(employeeId);
            if (index > -1) {
                selectedEmployees.value.splice(index, 1);
            } else {
                selectedEmployees.value.push(employeeId);
            }
        };

        const selectAllEmployees = () => {
            selectedEmployees.value = filteredEmployees.value.map(emp => emp.id);
        };

        const clearEmployeeSelection = () => {
            selectedEmployees.value = [];
        };

        const handleEmployeeSearch = () => {
            employeeCurrentPage.value = 1;
        };

        const handleEmployeeFilterChange = () => {
            employeeCurrentPage.value = 1;
        };

        const getEmployeeById = (employeeId) => {
            return employees.value.find(emp => emp.id === employeeId);
        };

        const removeEmployee = (employeeId) => {
            const index = selectedEmployees.value.indexOf(employeeId);
            if (index > -1) {
                selectedEmployees.value.splice(index, 1);
            }
        };

        const submitBulkPayroll = async () => {
            if (!validateStep(3)) return;

            submitting.value = true;
            try {
                const payload = {
                    pay_period_start: moment(formData.payPeriodStart).format('YYYY-MM-DD'),
                    pay_period_end: moment(formData.payPeriodEnd).format('YYYY-MM-DD'),
                    payment_date: moment(formData.paymentDate).format('YYYY-MM-DD'),
                    payroll_month: formData.payrollMonth,
                    employee_ids: selectedEmployees.value,
                };

                const response = await payrollService.createBulkPayroll(payload);

                if (response.success) {
                    message.success({
                        content: `Successfully created ${selectedEmployees.value.length} payroll record(s)`,
                        duration: 3,
                    });
                    emit('payroll-created', response.data);
                    emit('refresh');
                    closeModal();
                } else {
                    throw new Error(response.message || 'Failed to create bulk payroll');
                }
            } catch (error) {
                console.error('Error creating bulk payroll:', error);
                message.error(error.message || 'Failed to create bulk payroll');
            } finally {
                submitting.value = false;
            }
        };

        const resetModal = () => {
            currentStep.value = 1;
            formData.payPeriodStart = null;
            formData.payPeriodEnd = null;
            formData.paymentDate = null;
            formData.payrollMonth = moment().format('YYYY-MM');
            selectedEmployees.value = [];
            employees.value = [];
            Object.keys(formErrors).forEach(key => formErrors[key] = '');
            employeeFilters.search = '';
            employeeFilters.subsidiary = null;
            employeeFilters.department = null;
            employeeFilters.status = 'active';
            employeeCurrentPage.value = 1;
        };

        const closeModal = () => {
            const modal = document.getElementById('bulk-payroll-modal');
            const bootstrapModal = window.bootstrap?.Modal?.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
            resetModal();
        };

        const initializeLookupData = async () => {
            const lookupStore = useLookupStore();
            const sharedStore = useSharedDataStore();

            if (!lookupStore.lookups.length) {
                await lookupStore.fetchAllLookupLists();
            }
            const subsidiaries = lookupStore.getLookupsByType('subsidiary');
            availableSubsidiaries.value = subsidiaries.map(sub => sub.value).filter(Boolean);

            if (!sharedStore.isDepartmentsLoaded) {
                await sharedStore.fetchDepartments(false, {});
            }
            const departments = sharedStore.getDepartments || [];
            availableDepartments.value = departments.map(dept => dept.name).filter(Boolean);
        };

        onMounted(() => {
            initializeLookupData();
        });

        return {
            currentStep,
            submitting,
            loadingEmployees,
            formData,
            formErrors,
            employees,
            selectedEmployees,
            employeeFilters,
            employeeCurrentPage,
            employeesPerPage,
            availableSubsidiaries,
            availableDepartments,
            months,
            calculatePayPeriodDuration,
            filteredEmployees,
            employeeTotalPages,
            paginatedEmployees,
            canProceedToNextStep,
            formatDisplayDate,
            getMonthLabel,
            disableStartDate,
            disableEndDate,
            disablePaymentDate,
            onStartDateChange,
            onEndDateChange,
            nextStep,
            previousStep,
            isEmployeeSelected,
            toggleEmployeeSelection,
            selectAllEmployees,
            clearEmployeeSelection,
            handleEmployeeSearch,
            handleEmployeeFilterChange,
            getEmployeeById,
            removeEmployee,
            submitBulkPayroll,
            resetModal,
        };
    },
};
</script>

<style scoped>
/* Simple, Clean Modal Styles */
.modal-header {
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
}

.modal-title {
    font-size: 1.25rem;
}

/* Simple Step Progress */
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
    width: 100px;
    height: 2px;
    background: #dee2e6;
    margin: 0 1rem;
    transition: all 0.3s ease;
}

.step-line.active {
    background: #28a745;
}

/* Info Boxes */
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
    font-size: 1rem;
    font-weight: 600;
    color: #212529;
}

/* Employee Items */
.employee-list {
    max-height: 400px;
    overflow-y: auto;
}

.employee-item {
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #fff;
}

.employee-item:hover {
    border-color: #0d6efd;
    background: #f8f9fa;
}

.employee-item.selected {
    border-color: #0d6efd;
    background: #e7f3ff;
}

/* Summary Cards */
.summary-card {
    padding: 1.5rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
}

.summary-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0d6efd;
    margin-bottom: 0.5rem;
}

.summary-label {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
}

/* Ant Design Overrides */
:deep(.ant-picker),
:deep(.ant-select-selector) {
    height: 38px !important;
    border-radius: 0.375rem !important;
}

:deep(.ant-select) {
    width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
    .steps-container {
        flex-direction: column;
    }

    .step-line {
        width: 2px;
        height: 50px;
        margin: 0.5rem 0;
    }
}
</style>

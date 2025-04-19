<template>
    <!-- Bootstrap Modal Markup -->
    <div class="modal fade" id="grantAllocateEmployeeModal" tabindex="-1"
        aria-labelledby="grantAllocateEmployeeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="grantAllocateEmployeeModalLabel">
                        Allocate Employee to Grant Position
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <!-- Alert Message for Employee Allocation -->
                        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
                            {{ alertMessage }}
                        </div>
                        <div class="row">
                            <!-- Level of Effort -->
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">Level of Effort (%)</label>
                                    <input type="number" v-model.number="formData.levelOfEffort" class="form-control"
                                        placeholder="Enter level of effort" />
                                </div>
                            </div>
                            <!-- Start Date -->
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Start Date</label>
                                    <input type="date" v-model="formData.startDate" class="form-control" />
                                </div>
                            </div>
                            <!-- End Date -->
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">End Date</label>
                                    <input type="date" v-model="formData.endDate" class="form-control" />
                                </div>
                            </div>
                            <!-- Employee Selection TreeSelect -->
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">Select Employees</label>
                                    <a-tree-select v-model:value="employeesSelection" show-search style="width: 100%;"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        placeholder="Select employees" allow-clear tree-default-expand-all
                                        :tree-data="employeeTreeData" tree-node-filter-prop="title"
                                        :getPopupContainer="getPopupContainer" required />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-white border me-2"
                                data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                                    aria-hidden="true"></span>
                                <span v-if="isSubmitting">Allocating...</span>
                                <span v-else>Allocate</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Ensure Bootstrap JS is imported in your project.
import * as bootstrap from 'bootstrap';
import { employeeService } from '@/services/employee.service';
import { employeeGrantAllocationService } from '@/services/employee-grant-allocation.service';

export default {
    name: 'GrantAllocateEmployeeModal',
    props: {
        grantPositionId: {
            type: [String, Number],
            default: null
        },
        grantPositionName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isSubmitting: false,
            alertMessage: '',
            alertClass: '',
            formData: {
                levelOfEffort: 100,
                startDate: null,
                endDate: null
            },
            employeesSelection: [],
            employeeTreeData: [],
        };
    },
    methods: {
        // getPopupContainer ensures the dropdown is appended to document.body.
        getPopupContainer(trigger) {
            return (typeof window !== 'undefined' && window.document && window.document.body)
                ? window.document.body
                : trigger.parentNode;
        },
        // Open the modal using Bootstrap's JS API.
        openModal() {
            this.loadEmployees();
            const modalEl = document.getElementById("grantAllocateEmployeeModal");
            if (modalEl) {
                const bsModal = new bootstrap.Modal(modalEl);
                this.resetForm();
                this.alertMessage = '';
                bsModal.show();
            }
        },

        async loadEmployees() {
            try {
                const response = await employeeService.getEmployees();
                const employees = response.data || [];

                // Group employees by subsidiary
                const grouped = employees.reduce((acc, employee) => {
                    const sub = employee.subsidiary;
                    if (!acc[sub]) {
                        acc[sub] = [];
                    }
                    acc[sub].push(employee);
                    return acc;
                }, {});

                // Map each subsidiary into a parent node with its employees as children.
                this.employeeTreeData = Object.keys(grouped).map(subsidiary => {
                    return {
                        key: `subsidiary-${subsidiary}`,
                        title: subsidiary,
                        value: `subsidiary-${subsidiary}`,
                        children: grouped[subsidiary].map(emp => {
                            // Use first_name_en and last_name_en for display, or adjust as needed.
                            const staff_id = emp.staff_id;
                            const fullName =
                                emp.first_name_en +
                                (emp.last_name_en && emp.last_name_en !== '-' ? ' ' + emp.last_name_en : '');
                            return {
                                key: `employee-${emp.id}`,
                                title: staff_id + ' - ' + fullName,
                                value: `employee-${emp.id}`
                            };
                        })
                    };
                });
            } catch (error) {
                console.error('Error loading employees:', error);
                this.$message.error('Failed to load employees');
            }
        },

        // Validate and emit the form data.
        async handleSubmit() {
            try {
                // Set submission flag immediately
                this.isSubmitting = true;

                // Validate form data
                if (this.employeesSelection.length === 0) {
                    this.alertMessage = 'Please select at least one employee';
                    this.alertClass = 'alert-danger';
                    this.isSubmitting = false;
                    return;
                }

                if (!this.formData.startDate || !this.formData.endDate) {
                    this.alertMessage = 'Please select start and end dates';
                    this.alertClass = 'alert-danger';
                    this.isSubmitting = false;
                    return;
                }

                // Extract employee ID from selection (which has format "employee-{id}")
                const employeeIds = Array.isArray(this.employeesSelection)
                    ? this.employeesSelection.map(val =>
                        typeof val === 'string' ? val.replace('employee-', '') : val
                    )
                    : this.employeesSelection ? [this.employeesSelection.toString().replace('employee-', '')] : [];

                const payload = {
                    grant_items_id: this.grantPositionId,
                    level_of_effort: this.formData.levelOfEffort / 100,
                    start_date: this.formData.startDate,
                    end_date: this.formData.endDate,
                    active: true,
                    employee_id: employeeIds.length > 0 ? employeeIds[0] : null
                };

                console.log(payload);

                // Call the service to create the employee grant allocation
                const response = await employeeGrantAllocationService.createEmployeeGrantAllocation(payload);

                // If the response is successful, emit the event and reset the form
                if (response.data && response.success) {
                    this.alertMessage = response.message || 'Employee allocated successfully';
                    this.alertClass = 'alert-success';

                    // Emit the event with the response data
                    this.$emit('childSubmit', {
                        success: true,
                        message: this.alertMessage,
                        data: response.data
                    });

                    // Close the modal
                    const modalEl = document.getElementById("grantAllocateEmployeeModal");
                    if (modalEl) {
                        const bsModal = bootstrap.Modal.getInstance(modalEl);
                        if (bsModal) bsModal.hide();
                    }

                    this.resetForm();
                } else {
                    // If success flag is false, display error
                    this.alertMessage = response.data?.message || 'Failed to allocate employee';
                    this.alertClass = 'alert-danger';
                }
            } catch (error) {
                console.error('Error allocating employee:', error);
                this.alertMessage = error.response?.data?.message || 'Failed to allocate employee';
                this.alertClass = 'alert-danger';
            } finally {
                this.isSubmitting = false;
            }
        },

        // Reset the form.
        resetForm() {
            this.formData = {
                levelOfEffort: 100,
                startDate: null,
                endDate: null
            };
            this.employeesSelection = [];
            this.alertMessage = '';
        },
    },
};
</script>
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
            // Dummy tree data for employee selection
            employeeTreeData: [
                {
                    title: 'Subsidiary 1',
                    value: 'sub_1',
                    children: [
                        {
                            title: 'Department 1',
                            value: 'dept_1',
                            children: [
                                { title: 'Employee 1', value: 'emp_1' },
                                { title: 'Employee 2', value: 'emp_2' },
                            ],
                        },
                        {
                            title: 'Department 2',
                            value: 'dept_2',
                            children: [
                                { title: 'Employee 3', value: 'emp_3' },
                            ],
                        },
                    ],
                },
                {
                    title: 'Subsidiary 2',
                    value: 'sub_2',
                    children: [
                        {
                            title: 'Department 3',
                            value: 'dept_3',
                            children: [
                                { title: 'Employee 4', value: 'emp_4' },
                            ],
                        },
                    ],
                },
            ],
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
            const modalEl = document.getElementById("grantAllocateEmployeeModal");
            if (modalEl) {
                const bsModal = new bootstrap.Modal(modalEl);
                this.resetForm();
                this.alertMessage = '';
                bsModal.show();
            }
        },
        // Validate and emit the form data.
        handleSubmit() {
            if (this.isSubmitting) return;

            if (this.employeesSelection.length === 0) {
                this.alertMessage = 'Please select at least one employee';
                this.alertClass = 'alert-danger';
                return;
            }

            if (!this.formData.startDate || !this.formData.endDate) {
                this.alertMessage = 'Please select start and end dates';
                this.alertClass = 'alert-danger';
                return;
            }

            this.isSubmitting = true;

            const submitData = {
                grantPositionId: this.grantPositionId,
                grantPositionName: this.grantPositionName,
                ...this.formData,
                employees: this.employeesSelection,
            };

            // Simulate API call
            setTimeout(() => {
                this.$emit('submit', submitData);
                const modalEl = document.getElementById("grantAllocateEmployeeModal");
                if (modalEl) {
                    const bsModal = bootstrap.Modal.getInstance(modalEl);
                    if (bsModal) bsModal.hide();
                }
                this.resetForm();
                this.isSubmitting = false;
            }, 1000);
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
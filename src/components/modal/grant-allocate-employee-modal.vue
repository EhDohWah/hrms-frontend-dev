<template>
    <div class="modal fade" id="grantAllocateEmployeeModal" tabindex="-1"
        aria-labelledby="grantAllocateEmployeeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-md">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="grantAllocateEmployeeModalLabel">
                        {{ isEdit ? 'Edit Employee Allocation' : 'Allocate Employee to Grant Position' }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="isEdit ? submitEdit() : handleSubmit()">
                        <!-- Alert Message -->
                        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
                            {{ alertMessage }}
                        </div>
                        <div class="row">
                            <!-- Employee Selection TreeSelect -->
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">Select Employee</label>
                                    <a-tree-select v-model:value="employeeSelection" show-search style="width: 100%;"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        placeholder="Select employee" allow-clear tree-default-expand-all
                                        :tree-data="employeeTreeData" tree-node-filter-prop="title"
                                        :getPopupContainer="getPopupContainer" required :disabled="isEdit" />
                                </div>
                            </div>

                            <!-- Level of Effort -->
                            <div class="col-md-12">
                                <div class="mb-3">
                                    <label class="form-label">Level of Effort (%)</label>
                                    <input type="number" v-model.number="formData.levelOfEffort" class="form-control"
                                        placeholder="Enter level of effort" min="0" max="100" step="0.1" required />
                                </div>
                            </div>

                            <!-- Start Date -->
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Start Date</label>
                                    <input type="date" v-model="formData.startDate" class="form-control" required />
                                </div>
                            </div>

                            <!-- End Date -->
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">End Date</label>
                                    <input type="date" v-model="formData.endDate" class="form-control" />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                                    aria-hidden="true"></span>
                                <span v-if="isSubmitting">{{ isEdit ? 'Updating...' : 'Allocating...' }}</span>
                                <span v-else>{{ isEdit ? 'Update' : 'Allocate' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as bootstrap from 'bootstrap';
import { employeeService } from '@/services/employee.service';
import { employeeGrantAllocationService } from '@/services/employee-grant-allocation.service';

export default {
    name: 'GrantAllocateEmployeeModal',
    props: {
        grantPositionId: { type: [String, Number], default: null },
        grantPositionName: { type: String, default: '' }
    },
    data() {
        return {
            isEdit: false,
            allocationId: null,
            isSubmitting: false,
            alertMessage: '',
            alertClass: '',
            formData: {
                levelOfEffort: 100,
                startDate: null,
                endDate: null
            },
            employeeSelection: '',
            employeeTreeData: [],
        };
    },
    methods: {
        getPopupContainer(trigger) {
            return (typeof window !== 'undefined' && window.document && window.document.body)
                ? window.document.body
                : trigger.parentNode;
        },

        async loadEmployees() {
            try {
                const response = await employeeService.treeSearch();
                this.employeeTreeData = response.data || [];
            } catch (error) {
                console.error('Error loading employees:', error);
                this.showAlert('Failed to load employees', 'alert-danger');
            }
        },

        // Call this for ADD
        async openModal() {
            this.isEdit = false;
            this.allocationId = null;
            this.resetForm();
            await this.loadEmployees();
            this.showModal();
        },

        // Call this for EDIT, pass in allocation data (from parent record)
        async openModalEdit(editData) {
            this.isEdit = true;
            this.allocationId = editData.allocationId;
            this.resetForm();

            await this.loadEmployees();

            // Populate form with edit data
            this.formData = {
                levelOfEffort: editData.levelOfEffort ? parseFloat(editData.levelOfEffort) * 100 : 100,
                startDate: editData.startDate,
                endDate: editData.endDate
            };
            this.employeeSelection = String(editData.employeeId);

            this.showModal();
        },

        showModal() {
            const modalEl = document.getElementById("grantAllocateEmployeeModal");
            if (modalEl) {
                const bsModal = new bootstrap.Modal(modalEl);
                this.alertMessage = '';
                bsModal.show();
            }
        },

        async handleSubmit() {
            try {
                this.isSubmitting = true;
                this.clearAlert();

                // Validation
                if (!this.employeeSelection) {
                    this.showAlert('Please select an employee', 'alert-danger');
                    return;
                }

                if (!this.formData.startDate) {
                    this.showAlert('Please select a start date', 'alert-danger');
                    return;
                }

                const employee_id = parseInt(this.employeeSelection);

                // Simple payload for basic allocation (compatible with current system)
                const payload = {
                    employee_id: employee_id,
                    employment_id: 1, // Default employment ID - will be handled by backend
                    start_date: this.formData.startDate,
                    end_date: this.formData.endDate || null,
                    active: true,
                    allocations: [{
                        grant_id: 1, // Will be determined by backend based on grant_items_id
                        grant_items_id: parseInt(this.grantPositionId),
                        budgetline_id: 1, // Default budget line - will be handled by backend
                        level_of_effort: this.formData.levelOfEffort / 100
                    }]
                };

                const response = await employeeGrantAllocationService.createEmployeeGrantAllocation(payload);

                if (response.success) {
                    this.showAlert(response.message || 'Employee allocated successfully', 'alert-success');
                    this.$emit('childSubmit', {
                        success: true,
                        message: response.message || 'Employee allocated successfully',
                        data: response.data
                    });

                    setTimeout(() => {
                        this.hideModal();
                        this.resetForm();
                    }, 1500);
                } else {
                    this.showAlert(response.message || 'Failed to allocate employee', 'alert-danger');
                }
            } catch (error) {
                console.error('Error allocating employee:', error);
                this.showAlert(error.response?.data?.message || 'Failed to allocate employee', 'alert-danger');
            } finally {
                this.isSubmitting = false;
            }
        },

        // Edit submit
        async submitEdit() {
            try {
                this.isSubmitting = true;
                this.clearAlert();

                if (!this.formData.startDate) {
                    this.showAlert('Please select a start date', 'alert-danger');
                    return;
                }

                const payload = {
                    level_of_effort: this.formData.levelOfEffort / 100,
                    start_date: this.formData.startDate,
                    end_date: this.formData.endDate || null,
                    active: true
                };

                const response = await employeeGrantAllocationService.updateEmployeeGrantAllocation(this.allocationId, payload);

                if (response.success) {
                    this.showAlert(response.message || 'Employee allocation updated successfully', 'alert-success');
                    this.$emit('childSubmit', {
                        success: true,
                        message: response.message || 'Employee allocation updated successfully',
                        data: response.data,
                        edit: true
                    });

                    setTimeout(() => {
                        this.hideModal();
                        this.resetForm();
                    }, 1500);
                } else {
                    this.showAlert(response.message || 'Failed to update allocation', 'alert-danger');
                }
            } catch (error) {
                console.error('Error updating allocation:', error);
                this.showAlert(error.response?.data?.message || 'Failed to update allocation', 'alert-danger');
            } finally {
                this.isSubmitting = false;
            }
        },

        resetForm() {
            this.formData = { levelOfEffort: 100, startDate: null, endDate: null };
            this.employeeSelection = '';
            this.clearAlert();
        },

        hideModal() {
            const modalEl = document.getElementById("grantAllocateEmployeeModal");
            if (modalEl) {
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
            }
        },

        showAlert(message, className) {
            this.alertMessage = message;
            this.alertClass = className;
        },

        clearAlert() {
            this.alertMessage = '';
            this.alertClass = '';
        }
    }
};
</script>

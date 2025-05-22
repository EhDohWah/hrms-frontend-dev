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
                                    <a-tree-select v-model:value="employeeSelection" show-search style="width: 100%;"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        placeholder="Select employees" allow-clear tree-default-expand-all
                                        :tree-data="employeeTreeData" tree-node-filter-prop="title"
                                        :getPopupContainer="getPopupContainer" required :disabled="isEdit" />
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
                this.$message?.error?.('Failed to load employees');
            }
        },
        // Call this for ADD
        openModal() {
            this.isEdit = false;
            this.allocationId = null;
            this.resetForm();
            this.loadEmployees();
            this.showModal();
        },
        // Call this for EDIT, pass in allocation data (from parent record)
        openModalEdit(editData) {
            this.isEdit = true;
            this.allocationId = editData.allocationId;
            this.resetForm();
            this.loadEmployees().then(() => {
                this.formData = {
                    levelOfEffort: editData.levelOfEffort
                        ? Math.round(parseFloat(editData.levelOfEffort) * 100)
                        : 100,
                    startDate: editData.startDate,
                    endDate: editData.endDate
                };
                this.employeesSelection = [String(editData.employeeId)];
                this.showModal();
            });
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
                if (this.employeeSelection.length === 0) {
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
                const employee_id = this.employeeSelection ? parseInt(this.employeeSelection) : null;
                console.log('employeeSelection before show:', this.employeeSelection);

                const payload = {
                    grant_items_id: this.grantPositionId,
                    level_of_effort: this.formData.levelOfEffort / 100,
                    start_date: this.formData.startDate,
                    end_date: this.formData.endDate,
                    active: true,
                    employee_id: employee_id
                };
                const response = await employeeGrantAllocationService.createEmployeeGrantAllocation(payload);
                if (response.data && response.success) {
                    this.alertMessage = response.message || 'Employee allocated successfully';
                    this.alertClass = 'alert-success';
                    this.$emit('childSubmit', {
                        success: true, message: this.alertMessage, data: response.data
                    });
                    this.hideModal();
                    this.resetForm();
                } else {
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
        // New: Edit submit
        async submitEdit() {
            try {
                this.isSubmitting = true;
                if (!this.formData.startDate || !this.formData.endDate) {
                    this.alertMessage = 'Please select start and end dates';
                    this.alertClass = 'alert-danger';
                    this.isSubmitting = false;
                    return;
                }
                const employee_id = this.employeesSelection ? parseInt(this.employeesSelection) : null;
                const payload = {
                    grant_items_id: this.grantPositionId,
                    level_of_effort: this.formData.levelOfEffort / 100,
                    start_date: this.formData.startDate,
                    end_date: this.formData.endDate,
                    active: true,
                    employee_id: employee_id
                };
                const response = await employeeGrantAllocationService.updateEmployeeGrantAllocation(this.allocationId, payload);
                if (response.data && response.success) {
                    this.alertMessage = response.message || 'Employee allocation updated successfully';
                    this.alertClass = 'alert-success';
                    this.$emit('childSubmit', { success: true, message: this.alertMessage, data: response.data, edit: true });
                    this.hideModal();
                    this.resetForm();
                } else {
                    this.alertMessage = response.data?.message || 'Failed to update allocation';
                    this.alertClass = 'alert-danger';
                }
            } catch (error) {
                console.error('Error updating allocation:', error);
                this.alertMessage = error.response?.data?.message || 'Failed to update allocation';
                this.alertClass = 'alert-danger';
            } finally {
                this.isSubmitting = false;
            }
        },
        resetForm() {
            this.formData = { levelOfEffort: 100, startDate: null, endDate: null };
            this.employeesSelection = [];
            this.alertMessage = '';
        },
        hideModal() {
            const modalEl = document.getElementById("grantAllocateEmployeeModal");
            if (modalEl) {
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
            }
        }
    }
};
</script>

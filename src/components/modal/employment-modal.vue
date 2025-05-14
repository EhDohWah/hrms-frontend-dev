<template>
  <div class="modal fade" id="employmentModal" tabindex="-1" aria-labelledby="employmentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="employmentModalLabel">
            {{ editMode ? 'Edit Employment' : 'Add Employment' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              {{ alertMessage }}
            </div>

            <!-- Employee TreeSelect -->
            <div class="mb-3">
              <label class="form-label">Employee</label>
              <a-tree-select v-model:value="formData.employee_id" show-search style="width: 100%;"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Select Employee" allow-clear
                tree-default-expand-all :tree-data="employeeTreeData" tree-node-filter-prop="title"
                :getPopupContainer="getPopupContainer" required />
            </div>

            <!-- Employment Type (Plain Bootstrap Select) -->
            <div class="mb-3">
              <label class="form-label">Employment Type</label>
              <select class="form-select" v-model="formData.employment_type" required>
                <option disabled value="">Select Type</option>
                <option v-for="type in employmentTypes" :key="type.id" :value="type.value">
                  {{ type.value }}
                </option>
              </select>
            </div>

            <!-- Department Position Dropdown (Simple Select) -->
            <div class="mb-3">
              <label class="form-label">Department Position</label>
              <select class="form-select" v-model="formData.department_position_id" required>
                <option disabled value="">Select Department Position</option>
                <option v-for="position in departmentPositions" :key="position.id" :value="position.id">
                  {{ position.department + ' | ' + position.position }}
                </option>
              </select>
            </div>

            <!-- Work Location (Plain Bootstrap Select) -->
            <div class="mb-3">
              <label class="form-label">Work Location</label>
              <select class="form-select" v-model="formData.work_location_id" required>
                <option disabled value="">Select Location</option>
                <option v-for="location in workLocations" :key="location.id" :value="location.id">
                  {{ location.name }}
                </option>
              </select>
            </div>

            <!-- Start Date -->
            <div class="mb-3">
              <label class="form-label">Start Date <span class="text-danger"> *</span></label>
              <div class="input-icon-end position-relative">
                <date-picker v-model="formData.start_date" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                  :editable="true" :clearable="false" :input-format="dateFormat" required />
                <span class="input-icon-addon">
                  <i class="ti ti-calendar text-gray-7"></i>
                </span>
              </div>
            </div>

            <!-- End Date -->
            <div class="mb-3">
              <label class="form-label">End Date <span class="text-danger"> *</span></label>
              <div class="input-icon-end position-relative">
                <date-picker v-model="formData.end_date" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                  :editable="true" :clearable="false" :input-format="dateFormat" required />
                <span class="input-icon-addon">
                  <i class="ti ti-calendar text-gray-7"></i>
                </span>
              </div>
            </div>

            <!-- Probation End Date -->
            <div class="mb-3">
              <label class="form-label">Probation End Date</label>
              <div class="input-icon-end position-relative">
                <date-picker v-model="formData.probation_end_date" class="form-control datetimepicker"
                  placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat" />
                <span class="input-icon-addon">
                  <i class="ti ti-calendar text-gray-7"></i>
                </span>
              </div>
            </div>

            <!-- Position Salary -->
            <div class="mb-3">
              <label class="form-label">Position Salary</label>
              <div class="input-icon-end position-relative">
                <input type="number" class="form-control" v-model="formData.position_salary" required />
                <span class="input-icon-addon">
                  <i class="ti ti-currency-baht text-gray-7"></i>
                </span>
              </div>
            </div>

            <!-- Probation Salary -->
            <div class="mb-3">
              <label class="form-label">Probation Salary</label>
              <div class="input-icon-end position-relative">
                <input type="number" class="form-control" v-model="formData.probation_salary" />
                <span class="input-icon-addon">
                  <i class="ti ti-currency-baht text-gray-7"></i>
                </span>
              </div>
            </div>

            <!-- Employee Tax -->
            <div class="mb-3">
              <label class="form-label">Employee Tax (%)</label>
              <div class="input-icon-end position-relative">
                <input type="number" class="form-control" v-model="formData.employee_tax" />
                <span class="input-icon-addon">
                  <i class="ti ti-percent text-gray-7"></i>
                </span>
              </div>
            </div>

            <!-- FTE -->
            <div class="mb-3">
              <label class="form-label">FTE (Full-Time Equivalent)</label>
              <div class="input-icon-end position-relative">
                <input type="number" step="0.1" min="0" max="1" class="form-control" v-model="formData.fte" />
                <span class="input-icon-addon">
                  <i class="ti ti-percent text-gray-7"></i>
                </span>
              </div>
            </div>

            <!-- Active Checkbox -->
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="active" v-model="formData.active" />
              <label class="form-check-label" for="active">Active</label>
            </div>

            <!-- Benefit Checkboxes -->
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="healthWelfare" v-model="formData.health_welfare" />
                <label class="form-check-label" for="healthWelfare">
                  Health & Welfare
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="pvd" v-model="formData.pvd"
                  :checked="formData.employment_type === 'Local ID Staff'" @change="handlePvdChange" />
                <label class="form-check-label" for="pvd">PVD</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="savingFund" v-model="formData.saving_fund"
                  :checked="formData.employment_type === 'Local non ID Staff'" @change="handleSavingFundChange" />
                <label class="form-check-label" for="savingFund">
                  Saving Fund
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              {{ editMode ? 'Update' : 'Save' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { employmentService } from '@/services/employment.service';
import { employeeService } from '@/services/employee.service';
import { departmentPositionService } from '@/services/department-position.service';
import { workLocationService } from '@/services/worklocation.service';
import { useLookupStore } from '@/stores/lookupStore';

export default {
  name: 'EmploymentModal',
  setup() {
    const editMode = ref(false);
    const employmentData = ref(null);
    const alertMessage = ref('');
    const alertClass = ref('');
    return {
      editMode,
      employmentData,
      alertMessage,
      alertClass
    };
  },
  data() {
    return {
      formData: {
        id: null,
        employee_id: '',
        employment_type: '',
        department_position_id: '',
        work_location_id: '',
        start_date: null,
        end_date: null,
        probation_end_date: null,
        position_salary: '',
        probation_salary: '',
        employee_tax: '',
        fte: 1.0,
        active: true,
        health_welfare: false,
        pvd: false,
        saving_fund: false
      },
      dateFormat: "dd-MM-yyyy",
      isSubmitting: false,
      modalInstance: null,
      employees: [],
      perPage: 10,
      departmentPositions: [],
      workLocations: [],
      employeeTreeData: [],
      employmentTypes: []
    };
  },
  watch: {
    employmentData: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };
          this.formData.start_date = new Date(this.formData.start_date);
          this.formData.end_date = new Date(this.formData.end_date);
          this.formData.probation_end_date = new Date(this.formData.probation_end_date);
        }
      },
      deep: true
    }
  },
  mounted() {
    // Initialize the Bootstrap modal
    const modalElement = document.getElementById('employmentModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      // Reset form when modal is hidden
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.editMode = false;
        this.employmentData = null;
        this.resetForm();
      });
    }

    // Fetch department positions
    this.fetchDepartmentPositions();

    // Fetch employees
    this.fetchEmployees();

    // Fetch work locations
    this.fetchWorkLocations();

    // Fetch employment types
    this.initFetchEmploymentTypes();
  },
  methods: {

    async initFetchEmploymentTypes() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      this.employmentTypes = lookupStore.getLookupsByType('employment_type');
    },


    openModal() {
      if (this.editMode && this.employmentData) {
        this.formData = { ...this.employmentData };
      } else {
        this.resetForm();
      }
      if (this.modalInstance) {
        this.modalInstance.show();
      } else {
        const modalElement = document.getElementById('employmentModal');
        if (modalElement) {
          this.modalInstance = new Modal(modalElement);
          this.modalInstance.show();
        } else {
          console.error('Modal element not found');
          message.error('Modal element not found');
        }
      }
    },

    async handleSubmit() {
      this.isSubmitting = true;
      this.alertMessage = '';
      try {
        let response;
        if (this.editMode) {
          response = await employmentService.updateEmployment(this.formData.id, this.formData);
        } else {
          response = await employmentService.createEmployment(this.formData);
        }
        if (!response.success) {
          // Display API errors
          this.alertMessage = response.message;
          this.alertClass = 'alert-danger';
          if (response.errors) {
            this.alertMessage += ' ' + Object.values(response.errors).flat().join(' ');
          }
        } else {
          // Success
          this.$emit(this.editMode ? 'employment-updated' : 'employment-added');
          message.success(
            this.editMode
              ? 'Employment updated successfully'
              : 'Employment added successfully'
          );
          this.resetForm();
          if (this.modalInstance) {
            this.modalInstance.hide();
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        this.alertMessage =
          error.message || 'An error occurred while saving the employment record.';
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        id: null,
        employee_id: '',
        employment_type: '',
        department_position_id: '',
        work_location_id: '',
        start_date: '',
        end_date: '',
        probation_end_date: '',
        position_salary: '',
        probation_salary: '',
        employee_tax: '',
        fte: 1.0,
        active: true,
        health_welfare: false,
        pvd: false,
        saving_fund: false
      };
      this.alertMessage = '';
      this.alertClass = '';
    },

    async fetchDepartmentPositions() {
      try {
        const response = await departmentPositionService.getAllDepartmentPositions();
        if (response.data) {
          this.departmentPositions = response.data;
        }
      } catch (error) {
        console.error('Error fetching department positions:', error);
        message.error('Failed to load department positions');
      }
    },

    async fetchEmployees() {
      try {
        const response = await employeeService.treeSearch();
        // The API now directly returns the tree structure we need
        this.employeeTreeData = response.data || [];
      } catch (error) {
        console.error('Error loading employees:', error);
        message.error('Failed to load employees');
      }
    },


    async fetchWorkLocations() {
      try {
        const response = await workLocationService.getAllWorkLocations();
        if (response.data) {
          this.workLocations = response.data;
        }
      } catch (error) {
        console.error('Error fetching work locations:', error);
        message.error('Failed to load work locations');
      }
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
/* Keep Bootstrap's modal layout */
.modal-content {
  padding: 20px;
}

/* Fix for Ant Design TreeSelect in Bootstrap modal */
:deep(.ant-select-dropdown) {
  z-index: 1056 !important;
  /* Higher than Bootstrap modal z-index */
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
</style>

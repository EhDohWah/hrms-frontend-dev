<template>
  <!-- Bootstrap Modal Markup -->
  <div class="modal fade" id="grantPositionModal" tabindex="-1" aria-labelledby="grantPositionModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-di`alog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="grantPositionModalLabel">
            {{ isEditMode ? 'Edit Grant Position' : 'Add Grant Position' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- Alert Message for Grant Allocation -->
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              {{ alertMessage }}
            </div>
            <div class="row">
              <!-- Grant Position TreeSelect -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Grant Position</label>
                  <a-tree-select v-model:value="formData.grantPositionName" show-search style="width: 100%;"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Select a grant position"
                    allow-clear tree-default-expand-all :tree-data="grantPositionTreeData" tree-node-filter-prop="title"
                    :getPopupContainer="getPopupContainer" required />
                </div>
              </div>
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
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Select employees"
                    allow-clear tree-default-expand-all :tree-data="employeeTreeData" tree-node-filter-prop="title"
                    :getPopupContainer="getPopupContainer" required />
                </div>
              </div>
              <!-- Active Checkbox -->
              <div class="col-md-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="formData.active" id="activeCheck" />
                  <label class="form-check-label" for="activeCheck">
                    Active
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                  aria-hidden="true"></span>
                <span v-if="isSubmitting">{{ isEditMode ? 'Updating...' : 'Saving...' }}</span>
                <span v-else>{{ isEditMode ? 'Update' : 'Save' }}</span>
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
import { grantService } from '@/services/grant.service';
import { employeeService } from '@/services/employee.service';
import { employeeGrantAllocationService } from '@/services/employee-grant-allocation.service';

export default {
  name: 'GrantPositionModal',
  data() {
    return {
      isEditMode: false,
      isSubmitting: false,
      alertMessage: '',
      alertClass: '',
      formData: {
        id: null,
        grantPositionName: null,
        levelOfEffort: 100,
        startDate: null,
        endDate: null,
        employee_id: null,
        active: true
      },
      employeesSelection: [],
      // Dummy tree data for grant positions
      grantPositionTreeData: [],
      // Dummy tree data for employee selection
      employeeTreeData: [],
    };
  },

  methods: {
    // Convert the API response into tree data: each grant is a parent and its items are children.
    async loadGrantPositions() {
      try {
        const response = await grantService.getAllGrants();
        // Note: response.data.data is the actual array of grants.
        const grants = response.data || [];

        // Map each grant to a parent node
        this.grantPositionTreeData = grants.map((grant) => {
          return {
            key: `grant-${grant.id}`,
            title: grant.name, // The text displayed for the grant
            value: `grant-${grant.id}`, // The value when user selects the grant
            children: (grant.grant_items || []).map((item) => ({
              key: `item-${item.id}`,
              title: item.bg_line + ' - ' + item.grant_position, // The text displayed for the child
              value: `item-${item.id}`, // The value when user selects the item
            }))
          };
        });

        console.log(this.grantPositionTreeData);
      } catch (error) {
        console.error('Error loading grant positions:', error);
        this.$message.error('Failed to load grant positions');
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


    // getPopupContainer ensures the dropdown is appended to document.body.
    getPopupContainer(trigger) {
      return (typeof window !== 'undefined' && window.document && window.document.body)
        ? window.document.body
        : trigger.parentNode;
    },
    // Open the modal using Bootstrap's JS API.
    openModal(position = null) {
      this.loadGrantPositions();
      this.loadEmployees();
      const modalEl = document.getElementById("grantPositionModal");
      if (modalEl) {
        const bsModal = new bootstrap.Modal(modalEl);
        if (position) {
          this.isEditMode = true;
          this.formData = {
            ...this.formData,
            ...position
          };
          this.employeesSelection = position.employees || [];
        } else {
          this.isEditMode = false;
          this.resetForm();
          this.employeesSelection = [];
        }
        this.alertMessage = '';
        bsModal.show();
      }
    },

    async handleSubmit() {
      try {
        // Set submission flag immediately
        this.isSubmitting = true;

        // Validate form data using defined error messages
        const validationErrors = {
          grantPositionName: 'Please select a grant position',
          levelOfEffort: 'Please enter a level of effort',
          startDate: 'Please enter a start date',
          endDate: 'Please enter an end date',
          active: 'Please select an active status'
        };

        // Check each required field and return early if any are missing
        for (const [field, message] of Object.entries(validationErrors)) {
          if (!this.formData[field]) {
            this.alertMessage = message;
            this.alertClass = 'alert-danger';
            this.isSubmitting = false;
            return;
          }
        }

        // Build the payload.
        // Ensure employeesSelection is an array before mapping
        const employeeIds = Array.isArray(this.employeesSelection)
          ? this.employeesSelection.map(val =>
            // Remove "employee-" prefix if present.
            typeof val === 'string' ? val.replace('employee-', '') : val
          )
          : this.employeesSelection ? [this.employeesSelection.toString().replace('employee-', '')] : [];

        // Extract grant_items_id from grantPositionName (which has format "item-{id}")
        const grantItemsId = this.formData.grantPositionName.replace('item-', '');

        const payload = {
          grant_items_id: grantItemsId,
          level_of_effort: this.formData.levelOfEffort / 100,
          start_date: this.formData.startDate,
          end_date: this.formData.endDate,
          active: this.formData.active,
          employee_id: employeeIds.length > 0 ? employeeIds[0] : null
        };

        // Call the service to create the employee grant allocation
        const response = await employeeGrantAllocationService.createEmployeeGrantAllocation(payload);

        console.log(response);
        // If the response is successful, emit the event and reset the form.
        if (response.data && response.success) {
          this.alertMessage = response.message || 'Grant position added successfully';
          this.alertClass = 'alert-success';

          // Emit the event with the response data that includes success flag and message
          this.$emit('childSubmit', {
            success: true,
            message: this.alertMessage,
            data: response.data
          });

          this.resetForm();
        } else {
          // If success flag is false, do not emit and display error
          this.alertMessage = response.data?.message || 'Failed to add grant position';
          this.alertClass = 'alert-danger';
        }
      } catch (error) {
        console.error('Error creating grant position:', error);
        this.alertMessage = error.response?.data?.message || 'Failed to add grant position';
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    // Reset the form.
    resetForm() {
      this.formData = {
        id: null,
        grantPositionName: null,
        levelOfEffort: 100,
        startDate: null,
        endDate: null,
        employee_id: null,
        active: true
      };
      this.employeesSelection = [];
      this.isEditMode = false;
    },
  },
};
</script>

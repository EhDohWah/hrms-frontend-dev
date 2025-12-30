<template>
  <div class="modal fade" id="employmentModal" tabindex="-1" aria-labelledby="employmentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content new-modal-design">
        <div class="modal-header-new">
          <h2 class="modal-title-new" id="employmentModalLabel" v-once>
            Add Employment
          </h2>
          <button type="button" class="btn-close-custom" @click="handleModalClose" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body-new">
          <!-- Restored Data Notification -->
          <div v-if="restoredDataNotification.show" class="alert alert-info alert-dismissible fade show mb-3"
            role="alert">
            <i class="ti ti-info-circle me-2"></i>
            Restored your previous unsaved changes from {{ formatRestoredTime(restoredDataNotification.timestamp) }}
            <button type="button" class="btn-close" @click="restoredDataNotification.show = false"></button>
          </div>

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

          <form @submit.prevent="handleSubmit" ref="mainForm" :class="{ 'form-loading': isLoadingData && !dataLoaded }">
            <div v-if="alertMessage && alertClass === 'alert-success'" class="success-msg">
              {{ alertMessage }}
            </div>

            <div v-if="alertMessage && alertClass === 'alert-danger'" class="error-msg">
              {{ alertMessage }}
            </div>

            <!-- Row 1: Employee (full width) -->
            <div class="form-group">
              <label class="form-label required">Employee</label>
              <div class="custom-tree-select" :class="{ 'is-invalid': validationErrors.employee_id }">
                <div class="form-control tree-select-input" @click="toggleEmployeeDropdown"
                  :class="{ 'is-invalid': validationErrors.employee_id }">
                  <span v-if="selectedEmployeeDisplay" class="selected-text">{{ selectedEmployeeDisplay }}</span>
                  <span v-else class="placeholder-text">Select employee</span>
                  <i class="ti ti-chevron-down dropdown-icon" :class="{ 'rotated': showEmployeeDropdown }"></i>
                </div>

                <!-- Custom Dropdown -->
                <div v-if="showEmployeeDropdown" class="tree-dropdown" ref="employeeDropdown">
                  <div class="dropdown-header">
                    <input type="text" class="form-control form-control-sm search-input"
                      placeholder="Search employees..." v-model="employeeSearchTerm" @input="filterEmployees"
                      ref="employeeSearchInput">
                  </div>
                  <div class="dropdown-body" ref="dropdownBody" @scroll="handleDropdownScroll">
                    <div v-for="organization in filteredEmployeeTree" :key="organization.key"
                      class="organization-group">
                      <div class="organization-header" @click="toggleOrganization(organization.key)">
                        <i class="ti" :class="organization.expanded ? 'ti-chevron-down' : 'ti-chevron-right'"></i>
                        <span class="organization-name">{{ organization.title }}</span>
                        <span class="employee-count">({{ organization.children?.length || 0 }})</span>
                      </div>
                      <div v-if="organization.expanded" class="employees-list">
                        <!-- VIRTUALIZED EMPLOYEE LIST FOR PERFORMANCE -->
                        <div v-for="employee in getVisibleEmployees(organization.children)" :key="employee.key"
                          class="employee-item" :class="{ 'selected': formData.employee_id === employee.value }"
                          @click="selectEmployee(employee)">
                          <span class="employee-name">{{ employee.title }}</span>
                          <small class="employee-info">ID: {{ employee.staff_id || 'N/A' }}</small>
                        </div>
                        <!-- Show "Load More" if there are more employees -->
                        <div v-if="hasMoreEmployees(organization.children)" class="load-more-button">
                          <button @click="loadMoreEmployees(organization.key)" class="btn-load-more">
                            Load More Employees...
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- No results message -->
                    <div v-if="filteredEmployeeTree.length === 0" class="no-results">
                      <i class="ti ti-search"></i>
                      <span>No employees found</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="validationErrors.employee_id" class="invalid-feedback">
                {{ validationErrors.employee_id }}
              </div>
            </div>

            <div v-if="selectedEmployeeInfo" class="employee-info-card mb-3" style="margin-top: 12px;">
              <div class="card-body">
                <h6 class="card-title">Selected Employee</h6>
                <p class="card-text">
                  <strong>{{ selectedEmployeeInfo.name }}</strong><br>
                  <small class="text-muted">Organization: {{ selectedEmployeeInfo.organization }}</small><br>
                  <small class="text-muted">Status:
                    <span :class="[
                      'badge badge-sm',
                      selectedEmployeeInfo.status === 'Local ID' || selectedEmployeeInfo.status === 'Local ID Staff' ? 'bg-success' :
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
                  :class="{ 'is-invalid': validationErrors.employment_type }" required @change="saveFormState"
                  :disabled="isLoadingData">
                  <option disabled value="">{{ isLoadingData ? 'Loading types...' : 'Select Type' }}</option>
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

            <!-- Row 3: Department + Position (separate) -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label required">Department</label>
                <select class="form-control" v-model="formData.department_id"
                  :class="{ 'is-invalid': validationErrors.department_id }" required @change="onDepartmentChange">
                  <option disabled value="">{{ isLoadingData ? 'Loading departments...' : 'Select Department' }}
                  </option>
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
                  :class="{ 'is-invalid': validationErrors.position_id }" required @change="saveFormState"
                  :disabled="!formData.department_id || positionsLoading">
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
                  :class="{ 'is-invalid': validationErrors.site_id }" required @change="saveFormState">
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
                  :class="{ 'is-invalid': validationErrors.section_department }" @change="saveFormState"
                  :disabled="isLoadingData">
                  <option disabled value="">{{ isLoadingData ? 'Loading sections...' : 'Select Section Department' }}
                  </option>
                  <option v-for="section in sectionDepartments" :key="section.id" :value="section.value">
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
                    placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                    v-model="computedStartDate" :class="{ 'is-invalid': validationErrors.start_date }"
                    @update:model-value="handleStartDateChange" required />
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
                    placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                    v-model="computedProbationPassDate" :class="{ 'is-invalid': validationErrors.pass_probation_date }"
                    @update:model-value="handleProbationDateChange" />
                  <span class="input-icon-addon">
                    <i class="ti ti-calendar text-gray-7"></i>
                  </span>
                </div>
                <div v-if="validationErrors.pass_probation_date" class="invalid-feedback">
                  {{ validationErrors.pass_probation_date }}
                </div>
                <small class="text-muted" style="display: block; margin-top: 4px; font-size: 0.85em;">
                  <i class="ti ti-info-circle"></i> Auto-calculated as start date + 3 months if not provided
                </small>
              </div>
            </div>

            <!-- Row 6: Probation Salary + Pass Probation Salary -->
            <div class="date-row">
              <div class="form-group">
                <label class="form-label">Probation Salary</label>
                <input type="number" class="form-control" v-model.number.lazy="formData.probation_salary"
                  :class="{ 'is-invalid': validationErrors.probation_salary }" @blur="debouncedSaveState"
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
                <input type="number" class="form-control" v-model.number.lazy="formData.pass_probation_salary"
                  :class="{ 'is-invalid': validationErrors.pass_probation_salary }" required @blur="debouncedSaveState"
                  placeholder="Regular salary after probation">
                <div v-if="validationErrors.pass_probation_salary" class="invalid-feedback">
                  {{ validationErrors.pass_probation_salary }}
                </div>
                <small class="text-muted" style="display: block; margin-top: 4px; font-size: 0.85em;">
                  Used for funding allocation calculations
                </small>
              </div>
            </div>



            <!-- Funding Allocation with added spacing -->
            <div class="form-group funding-allocation-section" style="margin-top: 32px; margin-bottom: 0;">
              <label>Funding Allocation</label>

              <!-- Warning message when prerequisites are not met -->
              <div v-if="!canAddAllocation" class="allocation-prerequisites-warning">
                <div class="warning-header">
                  <i class="ti ti-alert-triangle"></i>
                  <strong>Required Fields Missing</strong>
                </div>
                <div class="warning-content">
                  <p class="warning-description">Please complete the following to enable funding allocation:</p>
                  <div class="prerequisites-list">
                    <div v-if="!formData.employee_id" class="prerequisite-item">
                      <i class="ti ti-user"></i>
                      <span>Select an employee</span>
                    </div>
                    <div v-if="!formData.start_date" class="prerequisite-item">
                      <i class="ti ti-calendar"></i>
                      <span>Select start date</span>
                    </div>
                    <div v-if="!formData.probation_salary && !formData.pass_probation_salary" class="prerequisite-item">
                      <i class="ti ti-cash"></i>
                      <span>Enter probation salary or pass probation salary</span>
                    </div>
                  </div>
                  <div class="warning-footer">
                    <i class="ti ti-info-circle"></i>
                    <span>These fields are required for backend salary calculations</span>
                  </div>
                </div>
              </div>

              <div class="date-row" style="margin-bottom:12px;">
                <div class="form-group">
                  <small class="text-muted">Grant</small>
                  <select v-model="currentAllocation.grant_id" @change="onGrantChange" class="form-control"
                    :disabled="isLoadingData || !canAddAllocation">
                    <option value="">{{ isLoadingData ? 'Loading grants...' : (!canAddAllocation ? 'Complete required fields first' : 'Select grant') }}</option>
                    <option v-for="grant in grantOptions" :key="grant.id" :value="grant.id">
                      {{ grant.name }} ({{ grant.code }})
                    </option>
                  </select>
                  <div v-if="allocationErrors.grant_id" class="invalid-feedback">
                    {{ allocationErrors.grant_id }}
                  </div>
                </div>

                <template v-if="false">
                  <div class="form-group">
                    <small class="text-muted">Department</small>
                    <select v-model="currentAllocation.department_id" @change="onAllocationDepartmentChange"
                      class="form-control" :disabled="!canAddAllocation">
                      <option value="">Select department</option>
                      <option v-for="dept in allocationDepartments" :key="dept.id" :value="dept.id">
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
                      :disabled="!canAddAllocation || !currentAllocation.department_id || allocationPositionsLoading">
                      <option value="">{{ allocationPositionsLoading ? 'Loading positions...' : 'Select position' }}
                      </option>
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
                    <select v-model="currentAllocation.grant_item_id" @change="onGrantPositionChange"
                      class="form-control"
                      :disabled="!canAddAllocation || !currentAllocation.grant_id || isLoadingData">
                      <option value="">Select grant position</option>
                      <option v-for="position in grantPositionOptions" :key="position.id" :value="position.id">
                        {{ position.name }}
                      </option>
                    </select>
                    <div v-if="allocationErrors.grant_item_id" class="invalid-feedback">
                      {{ allocationErrors.grant_item_id }}
                    </div>
                  </div>
                </template>

                <div class="form-group">
                  <small class="text-muted">FTE (%)</small>
                  <input type="number" v-model.number="currentAllocation.fte" @input="onFteChange" class="form-control"
                    min="0" max="100" placeholder="FTE (%)" :disabled="isLoadingData || !canAddAllocation" />
                  <div v-if="allocationErrors.fte" class="invalid-feedback">
                    {{ allocationErrors.fte }}
                  </div>
                </div>

                <!-- Display Calculated Salary (ONLY from backend API) -->
                <div class="form-group">
                  <small class="text-muted" style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px;">
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
                    <i class="ti ti-calculator" style="color: #4a7fff; font-size: 0.9em;"></i>
                    {{ calculationFormula }}
                  </small>
                </div>

                <div class="form-group" style="min-width:72px;">
                  <small class="text-muted">&nbsp;</small>
                  <button type="button" class="btn btn-save" style="width:100%;" @click="addAllocation"
                    :disabled="isLoadingData || !canAddAllocation">
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
                  <th>FTE (%)</th>
                  <th>Allocated Salary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in fundingAllocations" :key="idx"
                  v-memo="[row.id, row.fte, editingIndex === idx]">
                  <template v-if="editingIndex === idx">
                    <!-- Inline Edit Row -->
                    <td>
                      <span class="badge badge-grant">
                        Grant Funded
                      </span>
                    </td>
                    <td>
                      <select v-model="editData.grant_id" @change="onEditGrantChange" class="edit-field">
                        <option value="">Select grant</option>
                        <option v-for="grant in grantOptions" :key="grant.id" :value="grant.id">
                          {{ grant.name }} ({{ grant.code }})
                        </option>
                      </select>
                    </td>
                    <td>
                      <span class="text-muted">-</span>
                    </td>
                    <td>
                      <span class="text-muted">-</span>
                    </td>
                    <td>
                      <select v-model="editData.grant_item_id"
                        @change="onEditGrantPositionChange" class="edit-field">
                        <option value="">Select position</option>
                        <option v-for="position in editGrantPositionOptions" :key="position.id" :value="position.id">
                          {{ position.name }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <input type="number" v-model.number="editData.fte" @input="onEditFteChange" class="edit-field"
                        min="0" max="100">
                    </td>
                    <td>
                      <span class="text-muted">{{ getCalculatedSalary(editData.fte, true) }}</span>
                    </td>
                    <td>
                      <button class="action-btn" @click="saveEdit">Save</button>
                      <button class="action-btn delete" @click="cancelEdit">Cancel</button>
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
                      <span>{{ getGrantPositionName(row.grant_id, row.grant_item_id, row._original) }}</span>
                    </td>
                    <td>{{ row.fte }}%</td>
                    <td>{{ getAllocatedSalary(row) }}</td>
                    <td>
                      <button class="action-btn" @click="editAllocation(idx)">Edit</button>
                      <button class="action-btn delete" @click="deleteAllocation(idx)">Delete</button>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>

            <!-- Total Summary Row -->
            <div v-if="fundingAllocations.length > 0" class="total-summary">
              <div class="summary-row">
                <span class="summary-label">Total FTE:</span>
                <span class="summary-value" :class="{ 'text-danger': totalFte !== 100 }">{{ totalFte }}%</span>
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
              <p class="text-muted text-center">No funding allocations added. Please add at least one allocation.</p>
            </div>

            <!-- Row: Employment Status -->
            <div class="form-group">
              <label class="form-label">Employment Status</label>
              <div class="employment-status-container">
                <div class="status-switch-wrapper">
                  <a-switch v-model:checked="formData.status" @change="onStatusChange" checked-children="Active"
                    un-checked-children="Inactive" size="default" />
                  <span class="status-label"
                    :class="{ 'status-active': formData.status, 'status-inactive': !formData.status }">
                    {{ formData.status ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <small class="text-muted status-hint">
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
                    <input type="checkbox" v-model="formData.health_welfare" @change="saveFormState" />
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
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>Save Employment</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { ref, createVNode, nextTick, shallowRef, markRaw, toRaw } from 'vue';
import { Modal as AntModal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { employmentService } from '@/services/employment.service';
import { employeeService } from '@/services/employee.service';
import { workLocationService } from '@/services/worklocation.service';
import { useLookupStore } from '@/stores/lookupStore';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { useAllocationCalculation } from '@/composables/useAllocationCalculation';
import { debounce, memoize, PerformanceCleanup } from '@/utils/performance.js';

export default {
  name: 'EmploymentModal',
  setup() {
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

      // Performance cleanup manager
      cleanup: new PerformanceCleanup(),

      // Memoized functions for performance
      memoizedCalculateStatus: null,
      memoizedFormatCurrency: null,
      memoizedValidation: null,

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

      // Form persistence properties (updated to match employee-details-modal pattern)
      isDraftMode: false,
      hasUnsavedChanges: false,
      isDestroyed: false,
      isComponentReady: false,
      formDraftKey: 'employment-modal-draft',

      // Restored data notification
      restoredDataNotification: {
        show: false,
        timestamp: null
      },

      // Date format - same as employee-list-modal
      dateFormat: "dd/MM/yyyy",

      // Validation errors
      validationErrors: {},
      allocationErrors: {},

      // Data sources (optimized with shallow refs and frozen objects)
      employees: shallowRef([]),
      employeeTreeData: shallowRef([]),
      departmentPositions: shallowRef([]),
      departments: shallowRef([]),
      positions: shallowRef([]),
      workLocations: shallowRef([]),
      employmentTypes: shallowRef([]),
      sectionDepartments: shallowRef([]),
      payMethods: markRaw([
        { id: 1, value: 'Transferred to bank' },
        { id: 2, value: 'Cash cheque' }
      ]),
      grantOptions: shallowRef([]),
      orgFundedOptions: shallowRef([]),
      grantPositions: shallowRef({}),

      // Custom tree select properties
      showEmployeeDropdown: false,
      employeeSearchTerm: '',
      filteredEmployeeTree: [],
      selectedEmployeeDisplay: '',

      // Virtual scrolling properties for tree select
      visibleEmployeeCount: 20,
      loadedEmployeeCounts: new Map(), // Track loaded count per organization
      scrollDebounceTimer: null,

      // Computed options for dropdowns (cached)
      grantPositionOptions: shallowRef([]),
      editGrantPositionOptions: shallowRef([]),
      positionsLoading: false,

      // Allocation-specific departments and positions
      allocationDepartments: shallowRef([]),
      allocationPositions: shallowRef([]),
      allocationPositionsLoading: false,

      // Performance tracking
      lastValidationTime: 0,
      validationCache: new Map(),
      validationCacheMaxSize: 50, // Limit cache size to prevent memory leaks
      formChangeBuffer: null,
      saveStateDebounced: null,
      isVisible: true,

      // Modal rendering control
      isModalVisible: false
    };
  },

  computed: {
    isLocalIDStaff() {
      return this.formData.employment_type === 'Local ID Staff';
    },
    isLocalNonIDStaff() {
      return this.formData.employment_type === 'Local non ID Staff';
    },
    // Check if allocation form can be enabled (requires employee, salaries, and dates)
    canAddAllocation() {
      return !!(
        this.formData.employee_id &&
        this.formData.start_date &&
        (this.formData.probation_salary || this.formData.pass_probation_salary)
      );
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
        // This should not happen if addAllocation works correctly
        console.warn('⚠️ Allocation missing backend-calculated amount in total:', allocation);
        return sum;
      }, 0);
    },

    // FIXED: Improved computed properties for date fields with better reactivity
    computedStartDate: {
      get() {
        console.log('Getting start date:', this.formData.start_date);
        return this.formData.start_date;
      },
      set(value) {
        console.log('Setting start date:', value);
        this.$set ? this.$set(this.formData, 'start_date', this.safeConvertToDate(value)) :
          (this.formData.start_date = this.safeConvertToDate(value));
        this.debouncedSaveState();
      }
    },

    computedEndDate: {
      get() {
        console.log('Getting end date:', this.formData.end_date);
        return this.formData.end_date;
      },
      set(value) {
        console.log('Setting end date:', value);
        this.$set ? this.$set(this.formData, 'end_date', this.safeConvertToDate(value)) :
          (this.formData.end_date = this.safeConvertToDate(value));
        this.debouncedSaveState();
      }
    },

    computedProbationPassDate: {
      get() {
        console.log('Getting probation date:', this.formData.pass_probation_date);
        return this.formData.pass_probation_date;
      },
      set(value) {
        console.log('Setting probation date:', value);
        this.$set ? this.$set(this.formData, 'pass_probation_date', this.safeConvertToDate(value)) :
          (this.formData.pass_probation_date = this.safeConvertToDate(value));
        this.debouncedSaveState();
      }
    }
  },

  watch: {
    // OPTIMIZED: Only watch specific fields instead of deep watching entire objects
    'formData.employee_id'(newVal, oldVal) {
      if (newVal !== oldVal && this.isComponentReady) {
        this.onEmployeeChange();
        this.debouncedSaveState();
      }
    },

    'formData.employment_type'(newVal, oldVal) {
      if (newVal !== oldVal && this.isComponentReady) {
        this.autoSelectBenefitsBasedOnType(newVal);
        this.debouncedSaveState();
      }
    },

    'formData.pass_probation_salary'(newVal, oldVal) {
      if (newVal !== oldVal && this.isComponentReady) {
        // Clear salary calculation cache when position salary changes
        this.clearValidationCache();
        this.debouncedSaveState();
      }
    },

    'formData.probation_salary'(newVal, oldVal) {
      if (newVal !== oldVal && this.isComponentReady) {
        // Clear salary calculation cache when probation salary changes
        this.clearValidationCache();
        this.debouncedSaveState();
      }
    },

    // Watch funding allocations with shallow comparison
    fundingAllocations: {
      handler() {
        if (this.isDraftMode && !this.isSubmitting && this.isComponentReady) {
          this.hasUnsavedChanges = true;
          this.debouncedSaveState();
        }
      },
      flush: 'post' // Execute after DOM updates
    },

    // Debug watchers to track when data arrives
    departments: {
      handler(newVal) {
        console.log('🏢 Departments updated in modal:', newVal?.length || 0, newVal);
      },
      deep: true
    },
    grantOptions: {
      handler(newVal) {
        console.log('🎯 Grant options updated in modal:', newVal?.length || 0, newVal);
      },
      deep: true
    }
  },

  async created() {
    try {
      // Initialize memoized functions for better performance
      this.memoizedCalculateStatus = memoize(this.calculateEmploymentStatus, 100);
      this.memoizedFormatCurrency = memoize(this.formatCurrency, 50);
      this.memoizedValidation = memoize(this.validateAllocationInternal, 20);

      // Create debounced save function
      this.debouncedSaveState = debounce(this.saveFormState, 1000);

      // Create debounced filter function for employee search
      this.debouncedFilterEmployees = debounce(this.filterEmployeesInternal, 300);

      // Create debounced FTE change function to prevent excessive API calls
      this.debouncedFteChange = debounce(this.onFteChangeInternal, 500);

      // Mark component as ready
      this.isComponentReady = true;

      // Don't load initial data here - load only when modal opens
      console.log('📝 Employment modal component created, data will load when opened');
    } catch (error) {
      console.error('Error during component initialization:', error);
    }
  },

  mounted() {
    // Initialize the Bootstrap modal
    const modalElement = document.getElementById('employmentModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });

      // Use performance cleanup for event listeners
      const hideHandler = (event) => {
        if (this.hasUnsavedChanges && !this.isSubmitting && this.isDraftMode) {
          event.preventDefault();
          this.handleModalClose();
        }
      };

      const hiddenHandler = () => {
        if (!this.isDraftMode) {
          this.resetForm();
        }
        // No edit mode in this component
        this.employmentData = null;
        // Reset modal visibility to prevent DatePicker warnings on next render
        this.isModalVisible = false;
        this.cleanupModalBackdrops();
        // Notify parent so it can unmount for memory efficiency (matches employment-edit-modal)
        this.$emit('modal-closed');
      };

      // Track listeners for cleanup
      this.cleanup.addListener(modalElement, 'hide.bs.modal', hideHandler);
      this.cleanup.addListener(modalElement, 'hidden.bs.modal', hiddenHandler);
    }

    // Add click outside listener for custom tree select with cleanup tracking
    this.cleanup.addListener(document, 'click', this.handleClickOutside);

    // Setup intersection observer for performance monitoring
    this.setupPerformanceMonitoring();
  },

  beforeUnmount() {
    // Mark component as destroyed
    this.isDestroyed = true;
    this.isComponentReady = false;

    // Comprehensive cleanup for performance
    this.cleanup.cleanup();

    // Clear caches
    if (this.validationCache) {
      this.validationCache.clear();
    }

    // Clear memoized functions
    this.memoizedCalculateStatus = null;
    this.memoizedFormatCurrency = null;
    this.memoizedValidation = null;

    // Clear debounced functions
    this.debouncedSaveState = null;
    this.debouncedFilterEmployees = null;
    this.debouncedFteChange = null;

    // Clean up modal instance
    if (this.modalInstance && typeof this.modalInstance.dispose === 'function') {
      try {
        this.modalInstance.dispose();
      } catch (error) {
        console.error('Error disposing modal:', error);
      }
    }

    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside);

    // Remove any lingering backdrops
    this.cleanupModalBackdrops();
  },

  methods: {
    // Form persistence methods (updated to match employee-details-modal pattern)
    saveFormState() {
      if (this.isDestroyed || !this.isComponentReady) return;

      try {
        const formStore = useFormPersistenceStore();
        const draftData = {
          formData: { ...this.formData },
          fundingAllocations: [...this.fundingAllocations],
          currentAllocation: { ...this.currentAllocation },
          selectedEmployeeInfo: this.selectedEmployeeInfo,
          // Always in add mode
          timestamp: Date.now()
        };

        // Convert dates to ISO strings for storage
        if (draftData.formData.start_date instanceof Date) {
          draftData.formData.start_date = draftData.formData.start_date.toISOString();
        }
        if (draftData.formData.end_date instanceof Date) {
          draftData.formData.end_date = draftData.formData.end_date.toISOString();
        }
        if (draftData.formData.pass_probation_date instanceof Date) {
          draftData.formData.pass_probation_date = draftData.formData.pass_probation_date.toISOString();
        }

        formStore.saveFormSection('employment', 'employmentForm', draftData);
        console.log('📝 Form draft saved automatically');
      } catch (error) {
        console.error('❌ Error saving form draft:', error);
      }
    },

    // Handle employment status change from Ant Design Switch
    onStatusChange(checked) {
      console.log('Employment status changed to:', checked ? 'Active' : 'Inactive');
      this.saveFormState();
    },

    async onDepartmentChange() {
      try {
        this.formData.position_id = '';
        this.positions = [];
        this.positionsLoading = true;
        this.saveFormState();

        if (!this.formData.department_id) {
          return;
        }

        const sharedStore = useSharedDataStore();
        const positions = await sharedStore.fetchPositions(true, { department_id: this.formData.department_id });
        this.positions = Array.isArray(positions) ? positions : (positions?.data || []);
      } catch (error) {
        console.error('Error loading positions for department:', error);
        this.positions = [];
        this.$message && this.$message.error && this.$message.error('Failed to load positions');
      } finally {
        this.positionsLoading = false;
        this.saveFormState();
      }
    },

    loadFormDraft() {
      try {
        const formStore = useFormPersistenceStore();
        const savedData = formStore.checkForSavedData('employment');

        if (savedData.hasSavedData) {
          const parsed = savedData.data.employmentForm;

          // Check if draft is not too old (24 hours)
          const isRecent = (Date.now() - parsed.timestamp) < (24 * 60 * 60 * 1000);

          if (isRecent) {
            console.log('📄 Loading saved form draft');

            // Restore form data
            this.formData = { ...parsed.formData };
            this.fundingAllocations = [...parsed.fundingAllocations];
            this.currentAllocation = { ...parsed.currentAllocation };
            this.selectedEmployeeInfo = parsed.selectedEmployeeInfo;

            // Convert date strings back to Date objects
            if (this.formData.start_date) {
              this.formData.start_date = this.safeConvertToDate(this.formData.start_date);
            }
            if (this.formData.end_date) {
              this.formData.end_date = this.safeConvertToDate(this.formData.end_date);
            }
            if (this.formData.pass_probation_date) {
              this.formData.pass_probation_date = this.safeConvertToDate(this.formData.pass_probation_date);
            }

            // Restore related dropdowns if needed
            if (this.formData.employee_id) {
              this.onEmployeeChange();
            }
            if (this.currentAllocation.grant_id) {
              this.onGrantChange();
            }

            this.hasUnsavedChanges = true;
            this.restoredDataNotification.show = true;
            this.restoredDataNotification.timestamp = parsed.timestamp;
            return true;
          } else {
            // Clean up old draft
            this.clearFormDraft();
          }
        }
      } catch (error) {
        console.error('❌ Error loading form draft:', error);
        this.clearFormDraft();
      }
      return false;
    },

    clearFormDraft() {
      try {
        const formStore = useFormPersistenceStore();
        formStore.clearFormSection('employment', 'employmentForm');
        console.log('🗑️ Form draft cleared');
      } catch (error) {
        console.error('❌ Error clearing form draft:', error);
      }
    },

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
          // Handle ISO string format
          if (dateValue.includes('T') || dateValue.includes('Z')) {
            const parsedDate = new Date(dateValue);
            return isNaN(parsedDate.getTime()) ? null : parsedDate;
          }

          // Handle various date string formats
          const parsedDate = new Date(dateValue);
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        }

        // Handle timestamp numbers
        if (typeof dateValue === 'number') {
          const parsedDate = new Date(dateValue);
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        }

        return null;
      } catch (error) {
        console.error('Error converting date:', error);
        return null;
      }
    },

    // Handle date picker changes
    handleDateChange(fieldName, newValue) {
      if (this.isDestroyed || !this.isComponentReady) return;

      try {
        const safeDate = this.safeConvertToDate(newValue);
        this.formData[fieldName] = safeDate;
        this.saveFormState();
      } catch (error) {
        console.error('Error handling date change:', error);
      }
    },

    // Specific date change handlers for better reactivity
    handleStartDateChange(newValue) {
      console.log('Start date changed:', newValue);
      this.handleDateChange('start_date', newValue);

      // Auto-calculate probation pass date (3 months after start date)
      if (newValue) {
        const startDate = this.safeConvertToDate(newValue);
        if (startDate) {
          const probationDate = new Date(startDate);
          probationDate.setMonth(probationDate.getMonth() + 3);
          this.formData.pass_probation_date = probationDate;
          console.log('Auto-calculated probation pass date:', probationDate);
          this.saveFormState();
        }
      }
    },

    handleEndDateChange(newValue) {
      console.log('End date changed:', newValue);
      this.handleDateChange('end_date', newValue);
    },

    handleProbationDateChange(newValue) {
      console.log('Probation date changed:', newValue);
      this.handleDateChange('pass_probation_date', newValue);
    },

    // Format restored time for display
    formatRestoredTime(timestamp) {
      if (!timestamp) return 'earlier';
      return this.getTimeAgo(timestamp);
    },

    // Get human-readable time ago
    getTimeAgo(timestamp) {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      if (seconds < 60) return 'just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
    },

    // Clean up stray modal backdrops
    cleanupModalBackdrops() {
      if (this.isDestroyed) return;

      nextTick(() => {
        if (this.isDestroyed) return;

        const backdrops = document.querySelectorAll('.modal-backdrop');
        const activeModals = document.querySelectorAll('.modal.show');

        if (activeModals.length === 0 && backdrops.length > 0) {
          backdrops.forEach(backdrop => backdrop.remove());
        }
      });
    },

    // Handle modal close with unsaved changes check - UPDATED to single-tier
    async handleModalClose() {
      if (this.isDestroyed || !this.isComponentReady) return;

      const hasUnsaved = this.hasUnsavedChanges && this.isDraftMode;

      if (hasUnsaved) {
        // Use single-tier Ant Design confirm
        this.showUnsavedChangesConfirm();
      } else {
        await this.safeHideModal();
      }
    },

    // Show single-tier Ant Design confirm dialog for unsaved changes
    showUnsavedChangesConfirm() {
      AntModal.confirm({
        title: 'Unsaved Changes',
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode('div', { style: 'margin-top: 16px;' }, [
          createVNode('p', { style: 'margin-bottom: 12px; color: #666;' }, 'You have unsaved changes in the employment form.'),
          createVNode('p', { style: 'margin-bottom: 0; font-weight: 500;' }, 'What would you like to do?')
        ]),
        centered: true,
        width: 440,
        maskClosable: false,
        keyboard: false,

        okText: 'Continue Editing',
        okType: 'default',
        cancelText: 'Discard Changes',
        cancelButtonProps: {
          danger: true
        },

        onOk: () => {
          console.log('User chose to continue editing');
          return Promise.resolve();
        },

        onCancel: () => {
          console.log('User chose to discard changes');
          this.discardChangesAndClose();
          return Promise.resolve();
        }
      });
    },

    // Discard changes and close modal
    async discardChangesAndClose() {
      if (this.isDestroyed) return;

      try {
        // Clear saved data
        this.clearFormDraft();

        // Reset forms
        this.resetForm();

        // Close the modal
        await this.safeHideModal();

        console.log('✅ Discarded changes and closed modal');
      } catch (error) {
        console.error('❌ Error discarding changes:', error);
      }
    },

    // Safe modal hide helper
    safeHideModal() {
      return new Promise((resolve) => {
        if (this.isDestroyed) {
          resolve(true);
          return;
        }

        nextTick(() => {
          if (this.isDestroyed) {
            resolve(true);
            return;
          }

          if (this.modalInstance) {
            try {
              const modalEl = document.getElementById('employmentModal');
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
        console.log('📥 Loading employment modal data using shared store...');
        const sharedStore = useSharedDataStore();

        // Load all dropdown data in parallel using shared store
        // Force refresh grant structure to ensure we have the latest data
        await Promise.all([
          sharedStore.loadAllDropdownData({
            includeEmployees: true,
            includeDepartments: true,
            includePositions: true,
            includeWorkLocations: true,
            includeGrantStructure: true,
            force: false // Use cache for other data
          }),
          // Force refresh grant structure specifically to get latest grant positions
          sharedStore.fetchGrantStructure(true), // Force refresh grant data
          this.initFetchLookups()
        ]);

        // Copy data from shared store to local properties for reactivity
        // Make sure we wait for the data to be actually loaded
        console.log('📋 Copying data from shared store to modal...');
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

        console.log('✅ Employment modal data loaded from shared store');
      } catch (error) {
        console.error('❌ Error loading employment modal data:', error);
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

    // Add to validation cache with size limit (LRU-style)
    addToValidationCache(key, value) {
      // If cache is at max size, remove oldest entry (first entry)
      if (this.validationCache.size >= this.validationCacheMaxSize) {
        const firstKey = this.validationCache.keys().next().value;
        this.validationCache.delete(firstKey);
      }
      this.validationCache.set(key, value);
    },

    // Clear validation cache (useful for form reset and salary changes)
    clearValidationCache() {
      if (this.validationCache) {
        this.validationCache.clear();
        this.lastValidationTime = 0;
        console.log('🗑️ Validation cache cleared');
      }
    },

    // OPTIMIZED: Cached validation with early returns
    validateForm() {
      const now = Date.now();
      const formDataRaw = toRaw(this.formData);
      const cacheKey = JSON.stringify({
        formData: formDataRaw,
        allocationsLength: this.fundingAllocations.length,
        totalFte: this.totalFte
      });

      // Use cached validation if recent (within 500ms)
      if (this.validationCache.has(cacheKey) && (now - this.lastValidationTime) < 500) {
        const cached = this.validationCache.get(cacheKey);
        this.validationErrors = { ...cached.errors };
        this.alertMessage = cached.alertMessage;
        this.alertClass = cached.alertClass;
        return cached.isValid;
      }

      this.clearValidationErrors();
      let isValid = true;
      const errors = {};
      let alertMessage = '';
      let alertClass = '';

      // Batch validation checks for better performance
      const requiredFields = [
        { field: 'employee_id', message: 'Please select an employee' },
        { field: 'employment_type', message: 'Please select employment type' },
        { field: 'department_id', message: 'Please select department' },
        { field: 'position_id', message: 'Please select position' },
        { field: 'site_id', message: 'Please select site' },
        { field: 'start_date', message: 'Please select start date' },
        { field: 'pass_probation_salary', message: 'Please enter position salary' }
      ];

      for (const { field, message } of requiredFields) {
        if (!formDataRaw[field]) {
          errors[field] = message;
          isValid = false;
        }
      }

      // Validate funding allocations
      if (this.fundingAllocations.length === 0) {
        alertMessage = 'Please add at least one funding allocation';
        alertClass = 'alert-danger';
        isValid = false;
      } else if (this.totalFte !== 100) {
        alertMessage = `Total FTE must equal 100%. Current total: ${this.totalFte}%`;
        alertClass = 'alert-danger';
        isValid = false;
      }

      // Cache the result with size limit
      this.addToValidationCache(cacheKey, { isValid, errors, alertMessage, alertClass });
      this.lastValidationTime = now;

      // Apply results
      this.validationErrors = errors;
      this.alertMessage = alertMessage;
      this.alertClass = alertClass;

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
      if (!this.currentAllocation.grant_item_id) {
        this.allocationErrors.grant_item_id = 'Please select a grant position';
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

    // Removed loadGrantStructure method - now handled by shared store

    // Removed individual fetch methods - now using shared store for better performance

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
        this.alertMessage = 'Failed to load form data';
        this.alertClass = 'alert-danger';
      }
    },

    onEmployeeChange() {
      if (this.formData.employee_id) {
        console.log('Employee selected:', this.formData.employee_id);
        const sharedStore = useSharedDataStore();
        const employee = sharedStore.findEmployeeInTree(this.formData.employee_id);

        if (employee) {
          // Set display text for custom tree select
          this.selectedEmployeeDisplay = employee.title;

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
        this.selectedEmployeeDisplay = '';
        // Reset benefits when no employee is selected
        this.formData.pvd = false;
        this.formData.saving_fund = false;
      }
      this.saveFormState();
    },

    // Removed findEmployeeInTree and getEmployeeOrganization - now handled by shared store

    // Auto-select benefits based on employee status
    // Priority: Employee status > Employment type (status wins in conflicts)
    autoSelectBenefitsBasedOnStatus(status) {
      console.log('Auto-selecting benefits for employee status:', status);

      if (!status) return;

      // Auto-select based on status (this has priority over employment type)
      if (status === 'Local ID' || status === 'Local ID Staff') {
        this.formData.pvd = true;
        this.formData.saving_fund = false;
        console.log('✅ Auto-selected PVD for Local ID staff (from employee status)');
      } else if (status === 'Local non ID' || status === 'Local non ID Staff') {
        this.formData.pvd = false;
        this.formData.saving_fund = true;
        console.log('✅ Auto-selected Saving Fund for Local non ID staff (from employee status)');
      } else {
        // For other statuses (Expats, etc.), reset to defaults
        this.formData.pvd = false;
        this.formData.saving_fund = false;
        console.log('ℹ️ Reset benefits for non-local employee status:', status);
      }

      // Save form state after auto-selection
      this.saveFormState();
    },

    // Auto-select benefits based on employment type
    // Note: This only applies if employee status hasn't already set the benefits
    // Employment type selection happens AFTER employee is selected, so it can override if needed
    autoSelectBenefitsBasedOnType(employmentType) {
      console.log('Auto-selecting benefits for employment type:', employmentType);

      if (!employmentType) return;

      // Check if employee status already determined benefits
      // If we have an employee selected with a status, prefer that
      const hasEmployeeStatus = this.selectedEmployeeInfo && this.selectedEmployeeInfo.status;

      if (hasEmployeeStatus) {
        const status = this.selectedEmployeeInfo.status;
        // Only override if employment type matches status category
        if ((status === 'Local ID' || status === 'Local ID Staff') && employmentType === 'Local ID Staff') {
          // Status and type agree - reinforce selection
          this.formData.pvd = true;
          this.formData.saving_fund = false;
          console.log('✅ Confirmed PVD (employment type matches employee status)');
        } else if ((status === 'Local non ID' || status === 'Local non ID Staff') && employmentType === 'Local non ID Staff') {
          // Status and type agree - reinforce selection
          this.formData.pvd = false;
          this.formData.saving_fund = true;
          console.log('✅ Confirmed Saving Fund (employment type matches employee status)');
        } else {
          // Conflict: employment type differs from employee status
          // Keep employee status selection (higher priority)
          console.log('⚠️ Employment type differs from employee status - keeping status-based selection');
        }
      } else {
        // No employee selected yet, use employment type
        if (employmentType === 'Local ID Staff') {
          this.formData.pvd = true;
          this.formData.saving_fund = false;
          console.log('✅ Auto-selected PVD for Local ID Staff employment type');
        } else if (employmentType === 'Local non ID Staff') {
          this.formData.pvd = false;
          this.formData.saving_fund = true;
          console.log('✅ Auto-selected Saving Fund for Local non ID Staff employment type');
        } else {
          // For other employment types, reset
          this.formData.pvd = false;
          this.formData.saving_fund = false;
          console.log('ℹ️ Reset benefits for employment type:', employmentType);
        }
      }

      // Save form state after auto-selection
      this.saveFormState();
    },

    async onGrantChange() {
      console.log('Grant changed:', this.currentAllocation.grant_id);

      // All allocations are now grant type with grant_item_id
      // Hub grants still use grant_items, so we just load the grant positions
      this.currentAllocation.allocation_type = 'grant';
      // Clear any old fields
      this.currentAllocation.department_position_id = '';
      this.currentAllocation.department_id = '';
      this.currentAllocation.position_id = '';
      this.allocationPositions = [];
      // Set options for grant position dropdown
      this.grantPositionOptions = this.grantPositions[this.currentAllocation.grant_id] || [];

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
        this.$message && this.$message.error && this.$message.error('Failed to load positions');
      } finally {
        this.allocationPositionsLoading = false;
        this.saveFormState();
      }
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
        this.$message && this.$message.error && this.$message.error('Failed to load positions');
      } finally {
        this.allocationPositionsLoading = false;
      }
    },

    onGrantPositionChange() {
      console.log('Grant position changed:', this.currentAllocation.grant_item_id);
      delete this.allocationErrors.grant_item_id;
      this.saveFormState();
    },

    onEditGrantChange() {
      this.editData.grant_item_id = '';
      this.editData.department_position_id = '';
      this.editData.department_id = '';
      this.editData.position_id = '';
      this.editData.fte = 100; // Reset FTE to 100 for new allocation

      // All allocations are now grant type with grant_item_id
      this.editData.allocation_type = 'grant';
      this.allocationPositions = [];
      this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
    },

    onEditGrantPositionChange() {
      // Grant position changed, no additional logic needed for position slots
      console.log('Grant position changed in edit mode:', this.editData.grant_item_id);
    },

    async addAllocation() {
      console.log('Adding allocation to memory:', this.currentAllocation);

      if (!this.validateCurrentAllocation()) {
        return;
      }

      // Check for duplicates
      const isDuplicate = this.fundingAllocations.some((a, i) => {
        if (this.editingIndex !== null && i === this.editingIndex) return false;

        // All allocations are grant type, check by grant_item_id
        return a.grant_item_id === this.currentAllocation.grant_item_id;
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
          grant_item_id: '',
          department_position_id: '',
          department_id: '',
          position_id: '',
          fte: 100
        };
        this.grantPositionOptions = [];
        this.allocationPositions = [];
        this.allocationErrors = {};
        this.alertMessage = '';
        this.alertClass = '';
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
      this.editData = { ...this.fundingAllocations[index] };

      if (this.isOrgFundGrant(this.editData.grant_id)) {
        // All allocations are grant type
        this.editData.allocation_type = 'grant';
      } else {
        this.editData.allocation_type = 'grant';
        this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
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

        // All allocations are grant type, check by grant_item_id
        return a.grant_item_id === this.editData.grant_item_id;
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
      if (!this.editData.grant_item_id) {
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

    getDepartmentPositionName(id) {
      const pos = this.departmentPositions.find(p => p.id == id);
      return pos ? `${pos.department} - ${pos.position}` : 'Unknown Position';
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
      if (originalData && originalData.grant_position) {
        return originalData.grant_position;
      }
      const positions = this.grantPositions[grantId] || [];
      const position = positions.find(p => p.id == positionId);
      return position ? position.name : 'Unknown Position';
    },

    getPositionSlotName(grantId, positionId, positionSlotId, originalData = null) {
      if (originalData && originalData.slot_number && originalData.budget_line_code) {
        return `Slot ${originalData.slot_number} - ${originalData.budget_line_code}`;
      }
      const positions = this.grantPositions[grantId] || [];
      const position = positions.find(p => p.id == positionId);
      if (!position || !position.position_slots) return 'Unknown Slot';
      const slot = position.position_slots.find(s => s.id == positionSlotId);
      // Use budgetline_code from the position level since slots no longer have budget_line
      return slot ? `Slot ${slot.slot_number} - ${position.budgetline_code || 'N/A'}` : 'Unknown Slot';
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

    // ⚠️ REMOVED: This method is completely removed as all calculations are now done by backend
    // All allocation amounts come from the backend API via calculateAmount() composable

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

    // Get salary type label for display (shows which salary is being used)
    getSalaryTypeLabel() {
      if (this.calculating) {
        return 'Calculating...';
      }

      if (this.salaryTypeLabel) {
        return this.salaryTypeLabel;
      }

      // Fallback label based on local logic
      if (this.formData.probation_salary) {
        return 'Probation Salary';
      } else if (this.formData.pass_probation_salary) {
        return 'Pass Probation Salary';
      }

      return 'Not Set';
    },

    // Method to get allocated salary for table display
    // Shows ONLY backend-calculated amount - NO local calculation
    getAllocatedSalary(allocation) {
      // ONLY use backend-calculated amount stored in allocation
      if (allocation.allocated_amount !== undefined && allocation.allocated_amount !== null) {
        return this.formatCurrency(allocation.allocated_amount);
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

    async openModal() {
      this.clearValidationErrors();
      // Set modal visibility before loading data to control DatePicker rendering
      this.isModalVisible = true;

      // Always ensure initial data is loaded before proceeding
      if (!this.dataLoaded) {
        console.log('📥 Loading modal data for first time...');
        await this.loadInitialData();
        this.dataLoaded = true;
      }

      // Creating new employment - check for draft
      const hasDraft = this.loadFormDraft();

      if (!hasDraft) {
        // No draft, start fresh
        this.resetForm();
        this.isDraftMode = true;
        this.hasUnsavedChanges = false;
        this.restoredDataNotification.show = false;
      } else {
        // Draft loaded, notification already shown
        this.isDraftMode = true;
      }

      if (this.modalInstance) {
        this.modalInstance.show();
      } else {
        const modalElement = document.getElementById('employmentModal');
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

        if (response.success && response.data && response.data.funding_allocations) {
          const allocationsData = response.data.funding_allocations;
          console.log('Found funding allocations from API:', allocationsData);

          // Map the API response to our internal format
          // All allocations now use grant_item_id (including hub/org grants)
          this.fundingAllocations = allocationsData.map(allocation => {
            // FTE is already in percentage from backend resource
            const ftePercentage = parseFloat(allocation.fte);

            // All allocations use grant_item relationship
            const grantItem = allocation.grant_item || {};
            const grant = grantItem.grant || {};

            return {
              id: allocation.id,
              allocation_type: 'grant', // All allocations are grant type now
              grant_id: grant.id || '',
              grant_item_id: allocation.grant_item_id || grantItem.id || '',
              grant_items_id: allocation.grant_item_id || grantItem.id || '', // Keep for backward compatibility
              position_slot_id: '', // No longer used
              department_position_id: '',
              department_id: '',
              position_id: '',
              fte: ftePercentage,

              // Additional data for display purposes
              _original: {
                grant_name: grant.name || allocation.grant_name || 'Unknown Grant',
                grant_code: grant.code || allocation.grant_code || '',
                grant_position: grantItem.grant_position || allocation.grant_position || '',
                slot_number: '', // No longer used
                budget_line_code: grantItem.budgetline_code || allocation.budgetline_code || '',
                allocated_amount: allocation.allocated_amount,
                formatted_allocated_amount: allocation.formatted_allocated_amount,
                start_date: allocation.start_date,
                end_date: allocation.end_date
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
        if (error.status !== 404 && error.response?.status !== 404) {
          // Handle BaseService structured errors or raw axios errors
          const errorMessage = error.error || error.response?.data?.error || error.response?.data?.message || 'Failed to load existing funding allocations';
          this.alertMessage = errorMessage;
          this.alertClass = 'alert-danger';
        } else {
          console.log('No funding allocations exist for this employment (404 response)');
        }
      } finally {
        this.isLoadingData = false;
      }
    },

    // Build payload for API based on create/update mode
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

      // For create mode, all fields are required as per backend create validation
      return {
        ...basePayload,
        // Funding allocation data - required for create
        // ✅ IMPORTANT: Do NOT send allocated_amount - backend calculates it
        // Backend uses correct salary field (probation_salary or pass_probation_salary)
        allocations: this.fundingAllocations.map(allocation => {
          // All allocations are now grant type with grant_item_id
          return {
            allocation_type: 'grant',
            grant_item_id: allocation.grant_item_id || allocation.grant_items_id || '',
            fte: allocation.fte // Send as percentage (0-100), backend converts to decimal
            // ✅ NO allocated_amount - backend calculates using correct salary
          };
        })
      };
    },

    async handleSubmit() {
      try {
        console.log('Creating employment with funding allocations...', {
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

        // For creating, use the combined API that creates employment + funding allocations
        const response = await employmentService.createEmployment(payload);

        console.log('API Response:', response);

        // Use actual backend success message
        this.alertMessage = response.message || 'Employment created successfully!';
        this.alertClass = 'alert-success';

        // Clear draft on successful submission
        this.clearFormDraft();
        this.hasUnsavedChanges = false;
        this.isDraftMode = false;

        setTimeout(() => {
          this.alertMessage = '';
          this.resetForm();
          if (this.modalInstance) {
            this.modalInstance.hide();
          }
        }, 2200); // Slightly longer to read the actual message

        this.$emit('employment-added', {
          success: true,
          message: response.message || 'Employment created successfully',
          data: response.data
        });

      } catch (error) {
        console.error('Error submitting form:', error);

        // Clear any previous validation errors
        this.validationErrors = {};

        // Handle BaseService structured errors
        if (error.status && error.success === false) {
          // This is a structured error from BaseService
          if (error.errors && typeof error.errors === 'object' && !Array.isArray(error.errors)) {
            // Handle field validation errors (422)
            this.validationErrors = error.errors;
            // Use the meaningful error message from backend
            this.alertMessage = error.error || error.message || 'Validation failed';
          } else {
            // Handle business logic errors - prioritize 'error' field for meaningful messages
            this.alertMessage = error.error || error.message || 'An error occurred';
          }
        }
        // Handle raw axios errors (fallback)
        else if (error.response?.data) {
          const errorData = error.response.data;
          // Prioritize 'error' field for meaningful error messages
          this.alertMessage = errorData.error || errorData.message || 'An error occurred while saving employment';

          // Handle validation errors
          if (errorData.errors && typeof errorData.errors === 'object' && !Array.isArray(errorData.errors)) {
            this.validationErrors = errorData.errors;
          }
        }
        // Handle network or other errors
        else {
          this.alertMessage = error.message || 'Failed to save employment. Please try again.';
        }

        this.alertClass = 'alert-danger';

        // Log the full error for debugging
        console.error('Full error details:', {
          structuredError: error.status ? error : null,
          rawError: error.response?.data || error.message,
          status: error.status || error.response?.status
        });

        throw error; // Re-throw to be caught by saveAndCloseModal if needed
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      console.log('Resetting form and clearing memory');
      this.formData = {
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
        status: true, // Boolean: true = Active (default), false = Inactive

        health_welfare: false,
        pvd: false,
        saving_fund: false
      };
      this.currentAllocation = {
        allocation_type: '',
        grant_id: '',
        grant_item_id: '',
        department_position_id: '',
        department_id: '',
        position_id: '',
        fte: 100
      };
      this.editData = {
        allocation_type: '',
        grant_id: '',
        grant_item_id: '',
        department_position_id: '',
        department_id: '',
        position_id: '',
        fte: 100
      };
      this.fundingAllocations = [];
      this.selectedEmployeeInfo = null;
      this.editingIndex = null;
      // Always in add mode
      this.isDraftMode = false;
      this.hasUnsavedChanges = false;
      this.restoredDataNotification.show = false;
      this.restoredDataNotification.timestamp = null;
      this.grantPositionOptions = [];

      // Reset custom tree select
      this.showEmployeeDropdown = false;
      this.employeeSearchTerm = '';
      this.selectedEmployeeDisplay = '';
      this.filteredEmployeeTree = [];

      this.clearValidationErrors();
      this.clearValidationCache();
      this.clearFormDraft();
      // Keep dataLoaded as true to avoid reloading data unnecessarily
      console.log('Form reset complete. Memory cleared.');
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

    // OPTIMIZED: Custom tree select methods with virtual scrolling
    toggleEmployeeDropdown() {
      this.showEmployeeDropdown = !this.showEmployeeDropdown;
      if (this.showEmployeeDropdown) {
        this.initializeEmployeeTree();
        // Reset loaded counts when opening dropdown
        this.loadedEmployeeCounts.clear();
        this.$nextTick(() => {
          if (this.$refs.employeeSearchInput) {
            this.$refs.employeeSearchInput.focus();
          }
        });
      }
    },

    // Virtual scrolling helper methods
    getVisibleEmployees(employees) {
      if (!employees) return [];

      const organizationKey = this.getCurrentOrganizationKey(employees);
      const loadedCount = this.loadedEmployeeCounts.get(organizationKey) || this.visibleEmployeeCount;

      return employees.slice(0, Math.min(loadedCount, employees.length));
    },

    hasMoreEmployees(employees) {
      if (!employees) return false;

      const organizationKey = this.getCurrentOrganizationKey(employees);
      const loadedCount = this.loadedEmployeeCounts.get(organizationKey) || this.visibleEmployeeCount;

      return employees.length > loadedCount;
    },

    getCurrentOrganizationKey(employees) {
      // Generate a simple key based on the first employee's data
      return employees[0]?.organization || 'unknown';
    },

    loadMoreEmployees(organizationKey) {
      const currentCount = this.loadedEmployeeCounts.get(organizationKey) || this.visibleEmployeeCount;
      this.loadedEmployeeCounts.set(organizationKey, currentCount + this.visibleEmployeeCount);
    },

    handleDropdownScroll(event) {
      // Debounce scroll events for performance
      if (this.scrollDebounceTimer) {
        clearTimeout(this.scrollDebounceTimer);
      }

      this.scrollDebounceTimer = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;

        // Auto-load more when near bottom
        if (scrollHeight - scrollTop - clientHeight < 100) {
          // Find subsidiaries that need more loading
          this.filteredEmployeeTree.forEach(organization => {
            if (organization.expanded && this.hasMoreEmployees(organization.children)) {
              this.loadMoreEmployees(organization.key);
            }
          });
        }
      }, 100);
    },

    initializeEmployeeTree() {
      // Initialize filtered tree with all data and expand subsidiaries
      this.filteredEmployeeTree = this.employeeTreeData.map(organization => ({
        ...organization,
        expanded: true // Auto-expand all subsidiaries
      }));
    },

    toggleOrganization(organizationKey) {
      const organization = this.filteredEmployeeTree.find(s => s.key === organizationKey);
      if (organization) {
        organization.expanded = !organization.expanded;
      }
    },

    selectEmployee(employee) {
      this.formData.employee_id = employee.value;
      this.selectedEmployeeDisplay = employee.title;
      this.showEmployeeDropdown = false;
      this.employeeSearchTerm = '';
      this.onEmployeeChange();
      this.saveFormState();
    },

    // Public method that triggers debounced filtering
    filterEmployees() {
      if (this.debouncedFilterEmployees) {
        this.debouncedFilterEmployees();
      } else {
        // Fallback if debounced function not initialized
        this.filterEmployeesInternal();
      }
    },

    // Internal filtering logic (debounced)
    filterEmployeesInternal() {
      if (!this.employeeSearchTerm.trim()) {
        this.initializeEmployeeTree();
        return;
      }

      const searchTerm = this.employeeSearchTerm.toLowerCase();
      this.filteredEmployeeTree = this.employeeTreeData.map(organization => {
        const filteredChildren = organization.children?.filter(employee =>
          employee.title.toLowerCase().includes(searchTerm) ||
          (employee.staff_id && employee.staff_id.toLowerCase().includes(searchTerm))
        ) || [];

        return {
          ...organization,
          children: filteredChildren,
          expanded: filteredChildren.length > 0 // Auto-expand if has matching children
        };
      }).filter(organization => organization.children.length > 0);
    },

    // Click outside handler to close dropdown
    handleClickOutside(event) {
      if (this.showEmployeeDropdown) {
        const treeSelectElement = event.target.closest('.custom-tree-select');
        if (!treeSelectElement) {
          this.showEmployeeDropdown = false;
        }
      }
    },

    // getPopupContainer ensures the dropdown is appended to document.body
    getPopupContainer(trigger) {
      return (typeof window !== 'undefined' && window.document && window.document.body)
        ? window.document.body
        : trigger.parentNode;
    },

    // PERFORMANCE MONITORING SETUP
    setupPerformanceMonitoring() {
      if ('IntersectionObserver' in window) {
        // Monitor visibility changes for performance optimization
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Component is visible, can perform optimizations
              this.isVisible = true;
            } else {
              // Component is not visible, reduce work
              this.isVisible = false;
            }
          });
        }, { threshold: 0.1 });

        const modalElement = document.getElementById('employmentModal');
        if (modalElement) {
          observer.observe(modalElement);
          this.cleanup.addObserver(observer);
        }
      }

      // Setup performance observer for long tasks
      if ('PerformanceObserver' in window) {
        try {
          const perfObserver = new PerformanceObserver((list) => {
            const longTasks = list.getEntries();
            longTasks.forEach(task => {
              if (task.duration > 50) {
                console.warn(`Long task detected in employment modal: ${task.duration}ms`);
              }
            });
          });

          perfObserver.observe({ entryTypes: ['longtask'] });
          this.cleanup.addObserver(perfObserver);
        } catch (error) {
          console.log('PerformanceObserver not supported or failed to initialize');
        }
      }
    }
  }
};
</script>

<style scoped>
/* New Modal Design Styles (same as grant-position-modal) */
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

/* Restored data notification styling (matching employee-details-modal) */
.alert {
  margin-bottom: 15px;
}

.alert-dismissible .btn-close {
  padding: 0.5rem;
}

/* Highlight restored data notification */
.alert-info {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #004085;
}

/* Add transition for notifications */
.fade {
  transition: opacity 0.15s linear;
}

.fade.show {
  opacity: 1;
}

/* Custom styles for Ant Design confirm dialogs */
:deep(.ant-modal-confirm .ant-modal-body) {
  padding: 24px 24px 16px 24px;
}

:deep(.ant-modal-confirm .ant-modal-confirm-title) {
  font-weight: 600;
  font-size: 16px;
  color: #262626;
}

:deep(.ant-modal-confirm .ant-modal-confirm-content) {
  margin-top: 8px;
  font-size: 14px;
  color: #595959;
}

:deep(.ant-modal-confirm .ant-btn) {
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 6px;
}

:deep(.ant-modal-confirm .ant-btn-primary) {
  background: #1890ff;
  border-color: #1890ff;
}

:deep(.ant-modal-confirm .ant-btn-danger) {
  background: #ff4d4f;
  border-color: #ff4d4f;
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

/* Enhanced Prerequisites Warning UI */
.allocation-prerequisites-warning {
  background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%);
  border: 2px solid #ffc107;
  border-radius: 10px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.15);
}

.allocation-prerequisites-warning .warning-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: rgba(255, 193, 7, 0.15);
  border-bottom: 1px solid rgba(255, 193, 7, 0.3);
}

.allocation-prerequisites-warning .warning-header i {
  font-size: 1.3em;
  color: #f57c00;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

.allocation-prerequisites-warning .warning-header strong {
  font-size: 1em;
  color: #f57c00;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.allocation-prerequisites-warning .warning-content {
  padding: 16px 18px;
}

.allocation-prerequisites-warning .warning-description {
  margin: 0 0 12px 0;
  color: #856404;
  font-size: 0.9em;
  font-weight: 500;
}

.allocation-prerequisites-warning .prerequisites-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.allocation-prerequisites-warning .prerequisite-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #ffc107;
  transition: all 0.2s ease;
}

.allocation-prerequisites-warning .prerequisite-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 6px rgba(255, 193, 7, 0.2);
}

.allocation-prerequisites-warning .prerequisite-item i {
  font-size: 1.1em;
  color: #ff6f00;
  min-width: 20px;
}

.allocation-prerequisites-warning .prerequisite-item span {
  color: #5d4037;
  font-size: 0.9em;
  font-weight: 500;
}

.allocation-prerequisites-warning .warning-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: 6px;
}

.allocation-prerequisites-warning .warning-footer i {
  font-size: 0.95em;
  color: #ff8f00;
}

.allocation-prerequisites-warning .warning-footer span {
  color: #6c5400;
  font-size: 0.85em;
  font-style: italic;
  line-height: 1.4;
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

/* Employment Status with Ant Design Switch */
.employment-status-container {
  padding: 14px 18px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.employment-status-container:hover {
  border-color: #d0d7de;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.status-switch-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
}

.status-label {
  font-weight: 600;
  font-size: 0.95em;
  transition: color 0.3s ease;
  min-width: 70px;
}

.status-label.status-active {
  color: #52c41a;
}

.status-label.status-inactive {
  color: #8c8c8c;
}

.status-hint {
  display: block;
  font-size: 0.85em;
  line-height: 1.4;
  margin-top: 8px;
}

.status-hint .ti {
  vertical-align: middle;
  margin-right: 4px;
}

/* Ant Design Switch customization */
.employment-status-container .ant-switch {
  min-width: 60px;
  height: 26px;
}

.employment-status-container .ant-switch-checked {
  background-color: #52c41a;
}

.employment-status-container .ant-switch-inner {
  font-size: 12px;
  font-weight: 500;
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

/* Custom Tree Select Styles */
.custom-tree-select {
  position: relative;
  width: 100%;
}

.tree-select-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  min-height: 38px;
  padding: 7px 12px;
}

.tree-select-input:hover {
  border-color: #4a7fff;
}

.selected-text {
  color: #1d2636;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.placeholder-text {
  color: #6c757d;
  font-style: italic;
}

.dropdown-icon {
  margin-left: 8px;
  transition: transform 0.2s ease;
  color: #6c757d;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.tree-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #c9d2e2;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  max-height: 400px;
  overflow: hidden;
  margin-top: 2px;
}

.dropdown-header {
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.search-input {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.9em;
}

.search-input:focus {
  border-color: #4a7fff;
  box-shadow: 0 0 0 0.2rem rgba(74, 127, 255, 0.25);
  outline: none;
}

.dropdown-body {
  max-height: 320px;
  overflow-y: auto;
  padding: 8px 0;
}

.organization-group {
  margin-bottom: 4px;
}

.organization-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  color: #495057;
  transition: background-color 0.15s ease;
}

.organization-header:hover {
  background: #e9ecef;
}

.organization-header i {
  margin-right: 8px;
  font-size: 0.8em;
  transition: transform 0.15s ease;
}

.organization-name {
  flex: 1;
}

.employee-count {
  color: #6c757d;
  font-size: 0.85em;
  font-weight: 400;
}

.employees-list {
  background: white;
}

.employee-item {
  display: flex;
  flex-direction: column;
  padding: 10px 24px;
  cursor: pointer;
  border-bottom: 1px solid #f1f3f4;
  transition: background-color 0.15s ease;
}

.employee-item:hover {
  background: #f8f9fa;
}

.employee-item.selected {
  background: #e3f2fd;
  border-left: 3px solid #4a7fff;
}

.employee-name {
  font-weight: 500;
  color: #1d2636;
  margin-bottom: 2px;
}

.employee-info {
  color: #6c757d;
  font-size: 0.8em;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6c757d;
  text-align: center;
}

.no-results i {
  font-size: 2em;
  margin-bottom: 8px;
  opacity: 0.5;
}

/* Custom scrollbar for dropdown */
.dropdown-body::-webkit-scrollbar {
  width: 6px;
}

.dropdown-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dropdown-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dropdown-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Load More Button Styling */
.load-more-button {
  padding: 8px 16px;
  text-align: center;
  border-top: 1px solid #f1f3f4;
}

.btn-load-more {
  background: none;
  border: 1px solid #e9ecef;
  color: #6c757d;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-load-more:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #495057;
}

/* Performance optimization classes */
.virtual-scroll-container {
  contain: layout style paint;
}

.employee-item {
  contain: layout style;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tree-dropdown {
    max-height: 300px;
  }

  .dropdown-body {
    max-height: 220px;
  }

  .employee-item {
    padding: 8px 16px;
  }

  .organization-header {
    padding: 6px 12px;
  }
}

/* Spinner animation for calculating state */
@keyframes spin {
  from {
    transform: translateY(-50%) rotate(0deg);
  }

  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

/* Calculated salary wrapper - maintains alignment */
.calculated-amount-wrapper {
  position: relative;
  height: 38px;
  /* Match other input heights */
}

/* Make Calculated Salary field wider in the allocation row */
.date-row .form-group:has(.calculated-amount-wrapper) {
  flex: 1.4;
  /* Wider than other fields (default is 1) */
}

/* Make Add button container smaller */
.date-row .form-group:has(.btn-save) {
  flex: 0 0 auto;
  min-width: 60px !important;
  /* Reduced from 72px */
}

.calculated-salary-input {
  width: 100%;
  height: 38px;
  padding-right: 35px !important;
  /* Space for icon */
  transition: background-color 0.3s ease;
  font-weight: 500;
}

/* Background states for calculated salary */
.calculated-salary-input.calculating-bg {
  background-color: #fff3cd !important;
  color: #856404;
}

.calculated-salary-input.calculated-bg {
  background-color: #e8f5e9 !important;
  color: #2e7d32;
}

.calculated-salary-input.default-bg {
  background-color: #f7f8fa !important;
  color: #6c757d;
}

/* Icon positioning - aligned to right */
.spinner-icon,
.checkmark-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}

.spinner-icon {
  color: #ffc107;
  font-size: 1.1em;
  animation: spin 1s linear infinite;
}

.checkmark-icon {
  color: #28a745;
  font-size: 1.2em;
}

/* Badge styles for salary type indicator */
.badge-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.badge-sm {
  font-size: 0.65em;
  padding: 2px 5px;
  border-radius: 3px;
  font-weight: 500;
  line-height: 1.2;
}

/* Formula text styling - below input, doesn't affect alignment */
.formula-text {
  display: block;
  margin-top: 4px;
  font-size: 0.75em;
  color: #6c757d;
  line-height: 1.3;
  font-style: italic;
}

.position-relative {
  position: relative;
}
</style>

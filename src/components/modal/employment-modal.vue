<script>
/**
 * Employment Modal Component (Unified Add/Edit)
 *
 * Migrated from Bootstrap to Ant Design Vue.
 * This modal handles both employment creation and editing.
 * Funding allocations are managed separately via expandable rows
 * in the employment list using EmployeeFundingAllocationPanel.
 *
 * Props:
 * - visible: Boolean - Controls modal visibility
 * - editingEmployment: Object - Employment data for edit mode (null for add mode)
 *
 * Emits:
 * - saved: When employment is successfully created/updated
 * - close: When modal is closed
 */
import { ref, computed, watch, markRaw, onMounted, onBeforeUnmount } from 'vue';
import { message } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

// Stores
import { useLookupStore } from '@/stores/lookupStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';

// Services
import { employmentService } from '@/services/employment.service';

// Components
import EmployeeTreeSelect from '@/components/shared/EmployeeTreeSelect.vue';

export default {
  name: 'EmploymentModal',
  components: {
    EmployeeTreeSelect,
    InfoCircleOutlined
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingEmployment: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'close'],
  setup(props, { emit }) {
    // ============================================
    // STORES
    // ============================================
    const lookupStore = useLookupStore();
    const sharedDataStore = useSharedDataStore();

    // ============================================
    // UI STATE
    // ============================================
    const loading = ref(false);
    const dataLoaded = ref(false);
    const formErrors = ref({});

    // ============================================
    // FORM DATA
    // ============================================
    const formData = ref({
      employee_id: '',
      pay_method: '',
      department_id: '',
      position_id: '',
      site_id: '',
      section_department: '',
      start_date: null,
      end_date: null,
      pass_probation_date: null,
      probation_salary: null,
      pass_probation_salary: null,
      status: true,
      health_welfare: false,
      saving_fund: false,
      pvd: false
    });

    // Selected employee info for display
    const selectedEmployeeInfo = ref(null);
    const selectedEmployeeDisplay = ref('');

    // ============================================
    // DROPDOWN DATA
    // ============================================
    const employeeTreeData = ref([]);
    const departments = ref([]);
    const positions = ref([]);
    const workLocations = ref([]);
    const sectionDepartments = ref([]);
    const positionsLoading = ref(false);

    // Pay methods (hardcoded)
    const payMethods = markRaw([
      { value: 'Transferred to bank', label: 'Transferred to bank' },
      { value: 'Cash cheque', label: 'Cash cheque' }
    ]);

    // ============================================
    // COMPUTED PROPERTIES
    // ============================================
    const isEditing = computed(() => !!props.editingEmployment);
    const modalTitle = computed(() => isEditing.value ? 'Edit Employment' : 'Add Employment');

    // Convert dropdown data to options format
    // Use Number() to ensure consistent type matching with form values
    const departmentOptions = computed(() =>
      departments.value.map(d => ({ value: Number(d.id), label: d.name }))
    );

    const positionOptions = computed(() =>
      positions.value.map(p => ({ value: Number(p.id), label: p.title }))
    );

    const workLocationOptions = computed(() =>
      workLocations.value.map(w => ({ value: Number(w.id), label: w.name }))
    );

    const sectionDepartmentOptions = computed(() =>
      sectionDepartments.value.map(s => ({ value: s.value, label: s.value }))
    );

    // ============================================
    // DATA LOADING
    // ============================================
    const loadDropdownData = async () => {
      try {
        // Load from shared store (uses internal caching, won't re-fetch if cached)
        await sharedDataStore.loadAllDropdownData({
          includeEmployees: true,
          includeDepartments: true,
          includePositions: true,
          includeWorkLocations: true,
          force: false
        });

        // Always copy data from shared store to local refs
        // This ensures local refs are in sync even if previously cleared
        employeeTreeData.value = sharedDataStore.getEmployeeTreeData;
        departments.value = sharedDataStore.getDepartments;
        positions.value = sharedDataStore.getPositions;
        workLocations.value = sharedDataStore.getWorkLocations;

        // Load lookups
        if (!lookupStore.lookups.length) {
          await lookupStore.fetchAllLookupLists();
        }
        sectionDepartments.value = lookupStore.getLookupsByType('section_department');

        dataLoaded.value = true;
      } catch (error) {
        console.error('❌ Error loading employment modal data:', error);
        message.error('Failed to load form data');
      }
    };

    const loadPositionsForDepartment = async (departmentId) => {
      if (!departmentId) {
        positions.value = [];
        return;
      }

      try {
        positionsLoading.value = true;
        const positionData = await sharedDataStore.fetchPositionsByDepartment(departmentId);
        positions.value = Array.isArray(positionData) ? positionData : (positionData?.data || []);
      } catch (error) {
        console.error('Error loading positions:', error);
        positions.value = [];
      } finally {
        positionsLoading.value = false;
      }
    };

    // ============================================
    // EVENT HANDLERS
    // ============================================
    const handleEmployeeSelect = (employee) => {
      formData.value.employee_id = employee.value;
      selectedEmployeeDisplay.value = employee.title;

      // Find employee info from tree data
      for (const org of employeeTreeData.value) {
        const found = org.children?.find(e => e.value === employee.value);
        if (found) {
          selectedEmployeeInfo.value = {
            name: found.title,
            staff_id: found.staffId || found.staff_id,
            organization: org.title,
            status: found.status
          };

          // Auto-select benefits based on employee status
          autoSelectBenefitsBasedOnStatus(found.status);
          break;
        }
      }
    };

    /**
     * Auto-select benefits based on employee status
     * - Local ID / Local ID Staff → PVD enabled
     * - Local non ID / Local non ID Staff → Saving Fund enabled
     * - Other statuses → both reset
     */
    const autoSelectBenefitsBasedOnStatus = (status) => {
      if (!status) return;

      if (status === 'Local ID' || status === 'Local ID Staff') {
        formData.value.pvd = true;
        formData.value.saving_fund = false;
      } else if (status === 'Local non ID' || status === 'Local non ID Staff') {
        formData.value.pvd = false;
        formData.value.saving_fund = true;
      } else {
        formData.value.pvd = false;
        formData.value.saving_fund = false;
      }
    };

    const handleDepartmentChange = async (value) => {
      formData.value.position_id = '';
      await loadPositionsForDepartment(value);
    };

    // Auto-calculate pass probation date when start date changes (start + 3 months)
    const handleStartDateChange = (newStartDate) => {
      formData.value.start_date = newStartDate;

      if (newStartDate && !isEditing.value) {
        const probationDate = dayjs(newStartDate).add(3, 'month');
        formData.value.pass_probation_date = probationDate;
        console.log('Auto-calculated probation pass date:', probationDate.format('YYYY-MM-DD'));
      }
    };

    const handleStatusChange = (checked) => {
      formData.value.status = checked;
    };

    // ============================================
    // VALIDATION
    // ============================================
    const validateForm = () => {
      const errors = {};

      if (!isEditing.value && !formData.value.employee_id) {
        errors.employee_id = 'Employee is required';
      }
      if (!formData.value.department_id) {
        errors.department_id = 'Department is required';
      }
      if (!formData.value.position_id) {
        errors.position_id = 'Position is required';
      }
      if (!formData.value.site_id) {
        errors.site_id = 'Site is required';
      }
      if (!formData.value.start_date) {
        errors.start_date = 'Start date is required';
      }
      if (!formData.value.pass_probation_salary && formData.value.pass_probation_salary !== 0) {
        errors.pass_probation_salary = 'Pass probation salary is required';
      }

      formErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    // ============================================
    // FORM SUBMISSION
    // ============================================
    const formatDateForAPI = (date) => {
      if (!date) return null;
      return dayjs(date).format('YYYY-MM-DD');
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        message.warning('Please fill in all required fields');
        return;
      }

      loading.value = true;

      try {
        const payload = {
          employee_id: formData.value.employee_id,
          pay_method: formData.value.pay_method || null,
          department_id: formData.value.department_id,
          position_id: formData.value.position_id,
          site_id: formData.value.site_id,
          section_department: formData.value.section_department || null,
          start_date: formatDateForAPI(formData.value.start_date),
          end_date: formatDateForAPI(formData.value.end_date),
          pass_probation_date: formatDateForAPI(formData.value.pass_probation_date),
          probation_salary: formData.value.probation_salary || null,
          pass_probation_salary: formData.value.pass_probation_salary,
          status: formData.value.status,
          health_welfare: formData.value.health_welfare,
          saving_fund: formData.value.saving_fund,
          pvd: formData.value.pvd
        };

        let response;
        if (isEditing.value) {
          response = await employmentService.updateEmployment(props.editingEmployment.id, payload);
        } else {
          response = await employmentService.createEmployment(payload);
        }

        if (response?.success) {
          message.success(isEditing.value ? 'Employment updated successfully' : 'Employment created successfully');

          // Invalidate shared store cache
          sharedDataStore.invalidateCache('employees');

          emit('saved', {
            success: true,
            message: isEditing.value ? 'Employment updated successfully' : 'Employment created successfully',
            data: response.data
          });
          handleClose();
        } else {
          throw new Error(response?.message || 'Failed to save employment');
        }
      } catch (error) {
        console.error('Error saving employment:', error);
        handleSubmitError(error);
      } finally {
        loading.value = false;
      }
    };

    const handleSubmitError = (error) => {
      let errorMessage = 'An error occurred while saving the employment.';

      if (error.response?.data) {
        const data = error.response.data;
        errorMessage = data.error || data.message || errorMessage;

        // Handle validation errors (422)
        if (data.errors) {
          const fieldErrors = {};
          Object.entries(data.errors).forEach(([field, messages]) => {
            fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
          });
          formErrors.value = { ...formErrors.value, ...fieldErrors };
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    };

    // ============================================
    // FORM RESET
    // ============================================
    const resetForm = () => {
      formData.value = {
        employee_id: '',
        pay_method: '',
        department_id: '',
        position_id: '',
        site_id: '',
        section_department: '',
        start_date: null,
        end_date: null,
        pass_probation_date: null,
        probation_salary: null,
        pass_probation_salary: null,
        status: true,
        health_welfare: false,
        saving_fund: false,
        pvd: false
      };

      selectedEmployeeInfo.value = null;
      selectedEmployeeDisplay.value = '';
      formErrors.value = {};
      positions.value = [];
    };

    // ============================================
    // MODAL MANAGEMENT
    // ============================================
    const handleClose = () => {
      resetForm();
      emit('close');
    };

    const handleAfterClose = () => {
      // Cleanup any lingering DOM elements
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    // ============================================
    // WATCHERS
    // ============================================

    // Populate form with employment data for editing
    const populateEditForm = (employmentData) => {
      // Use Number() to ensure type consistency with dropdown option values
      const deptId = employmentData.department_id || employmentData.department?.id || '';
      const posId = employmentData.position_id || employmentData.position?.id || '';
      const siteId = employmentData.site_id || employmentData.site?.id || '';

      formData.value = {
        employee_id: employmentData.employee_id || employmentData.employee?.id || '',
        pay_method: employmentData.pay_method || '',
        department_id: deptId ? Number(deptId) : '',
        position_id: posId ? Number(posId) : '',
        site_id: siteId ? Number(siteId) : '',
        section_department: employmentData.section_department || '',
        start_date: employmentData.start_date ? dayjs(employmentData.start_date) : null,
        end_date: employmentData.end_date ? dayjs(employmentData.end_date) : null,
        pass_probation_date: employmentData.pass_probation_date ? dayjs(employmentData.pass_probation_date) : null,
        probation_salary: employmentData.probation_salary,
        pass_probation_salary: employmentData.pass_probation_salary,
        status: employmentData.status !== undefined ? employmentData.status : true,
        health_welfare: employmentData.health_welfare || false,
        saving_fund: employmentData.saving_fund || false,
        pvd: employmentData.pvd || false
      };

      // Set employee info for display
      if (employmentData.employee) {
        selectedEmployeeInfo.value = {
          name: `${employmentData.employee.first_name_en || ''} ${employmentData.employee.last_name_en || ''}`.trim(),
          staff_id: employmentData.employee.staff_id,
          organization: employmentData.employee.organization,
          status: employmentData.employee.status
        };
      }
    };

    // Single watcher on visible — handles both Add and Edit mode
    // This eliminates the race condition between two concurrent watchers
    watch(() => props.visible, async (isVisible) => {
      if (!isVisible) return;

      // Always load dropdown data when modal opens
      await loadDropdownData();

      // If editing, populate form after dropdown data is ready
      if (props.editingEmployment) {
        populateEditForm(props.editingEmployment);

        // Load department-specific positions after form is populated
        if (formData.value.department_id) {
          await loadPositionsForDepartment(formData.value.department_id);
        }
      }
    });

    // ============================================
    // LIFECYCLE
    // ============================================
    onMounted(() => {
      // Dropdown data will be loaded when modal becomes visible
    });

    onBeforeUnmount(() => {
      // Cleanup
    });

    // ============================================
    // RETURN
    // ============================================
    return {
      // State
      loading,
      dataLoaded,
      formErrors,
      formData,
      selectedEmployeeInfo,
      selectedEmployeeDisplay,
      positionsLoading,

      // Dropdown data
      employeeTreeData,
      payMethods,
      departmentOptions,
      positionOptions,
      workLocationOptions,
      sectionDepartmentOptions,

      // Computed
      isEditing,
      modalTitle,

      // Methods
      handleEmployeeSelect,
      handleDepartmentChange,
      handleStartDateChange,
      handleStatusChange,
      handleSubmit,
      handleClose,
      handleAfterClose
    };
  }
};
</script>

<template>
  <a-modal
    :open="visible"
    :title="modalTitle"
    :confirmLoading="loading"
    @cancel="handleClose"
    @afterClose="handleAfterClose"
    :footer="null"
    :width="800"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <div class="employment-form">
      <!-- Employee Selection (Add mode) / Display (Edit mode) -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Employee <span v-if="!isEditing" class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <!-- Add Mode: Tree Select -->
          <template v-if="!isEditing">
            <EmployeeTreeSelect
              v-model="formData.employee_id"
              :tree-data="employeeTreeData"
              :display-value="selectedEmployeeDisplay"
              :has-error="!!formErrors.employee_id"
              :error-message="formErrors.employee_id"
              placeholder="Select employee"
              search-placeholder="Search employees..."
              @select="handleEmployeeSelect"
            />
          </template>

          <!-- Edit Mode: Display Card -->
          <template v-else>
            <div class="employee-display-card">
              <div v-if="selectedEmployeeInfo" class="employee-info">
                <strong>{{ selectedEmployeeInfo.name }}</strong>
                <span class="text-muted ms-2">({{ selectedEmployeeInfo.staff_id }})</span>
                <br>
                <small class="text-muted">Organization: {{ selectedEmployeeInfo.organization }}</small>
                <br>
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
              </div>
              <div v-else class="text-muted">
                Loading employee info...
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Selected Employee Info Card (Add mode only) -->
      <div v-if="!isEditing && selectedEmployeeInfo" class="employee-info-card mb-3">
        <h6 class="card-title">Selected Employee</h6>
        <p class="mb-0">
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

      <!-- Pay Method -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Pay Method :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="formData.pay_method"
            placeholder="Select pay method"
            :options="payMethods"
            allow-clear
            class="input-medium"
          />
        </div>
      </div>

      <!-- Department -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Department <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="formData.department_id"
            placeholder="Select department"
            :options="departmentOptions"
            :status="formErrors.department_id ? 'error' : ''"
            show-search
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            @change="handleDepartmentChange"
            class="input-medium"
          />
          <div v-if="formErrors.department_id" class="error-feedback">{{ formErrors.department_id }}</div>
        </div>
      </div>

      <!-- Position -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Position <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="formData.position_id"
            :placeholder="positionsLoading ? 'Loading positions...' : 'Select position'"
            :options="positionOptions"
            :status="formErrors.position_id ? 'error' : ''"
            :disabled="!formData.department_id || positionsLoading"
            :loading="positionsLoading"
            show-search
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            class="input-medium"
          />
          <div v-if="formErrors.position_id" class="error-feedback">{{ formErrors.position_id }}</div>
        </div>
      </div>

      <!-- Site -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Site <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="formData.site_id"
            placeholder="Select site"
            :options="workLocationOptions"
            :status="formErrors.site_id ? 'error' : ''"
            show-search
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            class="input-medium"
          />
          <div v-if="formErrors.site_id" class="error-feedback">{{ formErrors.site_id }}</div>
        </div>
      </div>

      <!-- Section Department -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Section Department :</label>
        </div>
        <div class="form-input-col">
          <a-select
            v-model:value="formData.section_department"
            placeholder="Select section department"
            :options="sectionDepartmentOptions"
            allow-clear
            show-search
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            class="input-medium"
          />
        </div>
      </div>

      <!-- Start Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Start Date <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              :value="formData.start_date"
              placeholder="Select start date"
              format="DD/MM/YYYY"
              :status="formErrors.start_date ? 'error' : ''"
              class="input-short"
              @change="handleStartDateChange"
            />
            <span class="tooltip-icon" title="Select the employment start date">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.start_date" class="error-feedback">{{ formErrors.start_date }}</div>
        </div>
      </div>

      <!-- End Date (Edit mode visible, Add mode optional) -->
      <div v-if="isEditing" class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">End Date :</label>
        </div>
        <div class="form-input-col">
          <a-date-picker
            v-model:value="formData.end_date"
            placeholder="Select end date"
            format="DD/MM/YYYY"
            class="input-short"
          />
        </div>
      </div>

      <!-- Pass Probation Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Pass Probation Date :</label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              v-model:value="formData.pass_probation_date"
              placeholder="Select probation pass date"
              format="DD/MM/YYYY"
              class="input-short"
            />
            <span class="tooltip-icon" title="Auto-calculated as start date + 3 months if not provided">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
        </div>
      </div>

      <!-- Probation Salary -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Probation Salary :</label>
        </div>
        <div class="form-input-col">
          <a-input-number
            v-model:value="formData.probation_salary"
            placeholder="Enter probation salary"
            :min="0"
            :precision="2"
            :formatter="value => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/฿\s?|(,*)/g, '')"
            class="input-medium"
          />
          <small class="text-muted d-block mt-1">Optional - Leave empty if same as pass probation salary</small>
        </div>
      </div>

      <!-- Pass Probation Salary -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Pass Probation Salary <span class="text-danger">*</span> :</label>
        </div>
        <div class="form-input-col">
          <a-input-number
            v-model:value="formData.pass_probation_salary"
            placeholder="Enter pass probation salary"
            :min="0"
            :precision="2"
            :status="formErrors.pass_probation_salary ? 'error' : ''"
            :formatter="value => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/฿\s?|(,*)/g, '')"
            class="input-medium"
          />
          <div v-if="formErrors.pass_probation_salary" class="error-feedback">{{ formErrors.pass_probation_salary }}</div>
          <small class="text-muted d-block mt-1">Used for funding allocation calculations</small>
        </div>
      </div>

      <!-- Employment Status -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Employment Status :</label>
        </div>
        <div class="form-input-col">
          <div class="status-switch-container">
            <a-switch
              v-model:checked="formData.status"
              checked-children="Active"
              un-checked-children="Inactive"
              @change="handleStatusChange"
            />
            <span class="status-label" :class="{ 'status-active': formData.status, 'status-inactive': !formData.status }">
              {{ formData.status ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <small class="text-muted d-block mt-1">
            <info-circle-outlined /> Toggle to set employment as Active or Inactive
          </small>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">Benefits :</label>
        </div>
        <div class="form-input-col">
          <div class="benefits-container">
            <div class="benefit-item">
              <a-checkbox v-model:checked="formData.health_welfare">
                Health & Welfare
              </a-checkbox>
              <small class="text-muted d-block ms-4">Percentage managed in Benefit Settings</small>
            </div>
            <div class="benefit-item">
              <a-checkbox v-model:checked="formData.saving_fund">
                Saving Fund
              </a-checkbox>
              <small class="text-muted d-block ms-4">Percentage managed in Benefit Settings</small>
            </div>
            <div class="benefit-item">
              <a-checkbox v-model:checked="formData.pvd">
                PVD
              </a-checkbox>
              <small class="text-muted d-block ms-4">Percentage managed in Benefit Settings</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="modal-footer-actions">
      <div class="footer-info">
        <small class="text-muted">
          <info-circle-outlined /> After saving, expand the employment row to manage funding allocations.
        </small>
      </div>
      <div class="footer-buttons">
        <a-button @click="handleClose" :disabled="loading">Cancel</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEditing ? 'Save Changes' : 'Save Employment' }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
/* Scrollable form container */
.employment-form {
  min-height: 400px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

/* Form layout */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.form-label-col {
  flex: 0 0 160px;
  min-width: 160px;
  padding-top: 6px;
  display: flex;
  justify-content: flex-end;
}

.form-input-col {
  flex: 1;
  min-width: 0;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0;
  text-align: right;
  color: #262626;
  font-size: 14px;
  white-space: nowrap;
}

/* Input widths */
.input-short {
  width: 200px !important;
  max-width: 200px;
}

.input-medium {
  width: 300px !important;
  max-width: 300px;
}

/* Tooltip */
.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tooltip-icon {
  flex-shrink: 0;
}

/* Error feedback */
.error-feedback {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.text-danger {
  color: #ff4d4f;
}

/* Employee display card */
.employee-display-card {
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.employee-info {
  line-height: 1.6;
}

/* Employee info card (add mode) */
.employee-info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px 16px;
  margin-left: 176px;
}

.employee-info-card .card-title {
  margin-bottom: 8px;
  font-size: 0.9em;
  font-weight: 600;
  color: #495057;
}

/* Status switch */
.status-switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-label {
  font-weight: 600;
  font-size: 0.95em;
  transition: color 0.3s ease;
}

.status-label.status-active {
  color: #52c41a;
}

.status-label.status-inactive {
  color: #8c8c8c;
}

/* Benefits container */
.benefits-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefit-item {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

/* Badge styles */
.badge.badge-sm {
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

/* Footer actions */
.modal-footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
  margin-top: 16px;
}

.footer-info {
  flex: 1;
}

.footer-buttons {
  display: flex;
  gap: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }

  .form-label-col {
    flex: 1;
    min-width: 100%;
    padding-top: 0;
    justify-content: flex-start;
  }

  .form-label {
    text-align: left;
  }

  .input-short,
  .input-medium {
    width: 100% !important;
    max-width: 100%;
  }

  .employee-info-card {
    margin-left: 0;
  }

  :deep(.ant-picker),
  :deep(.ant-select),
  :deep(.ant-input-number) {
    width: 100% !important;
  }

  .modal-footer-actions {
    flex-direction: column;
    gap: 12px;
  }

  .footer-info {
    text-align: center;
  }
}

/* Ant Design component overrides */
:deep(.input-short.ant-picker),
:deep(.input-short.ant-select) {
  width: 200px !important;
}

:deep(.input-medium.ant-select),
:deep(.input-medium.ant-input-number) {
  width: 300px !important;
}

:deep(.ant-select-selector) {
  min-width: inherit;
}
</style>

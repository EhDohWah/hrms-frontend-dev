import { ref, reactive, computed, watch, toRaw } from 'vue';
import { employmentService } from '@/services/employment.service';
import { useSharedDataStore } from '@/stores/sharedDataStore';

/**
 * Composable for employment form state management
 * 
 * Handles form data, validation, date utilities, benefit auto-selection,
 * and payload building for the employment modal.
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.onFormChange - Callback when form data changes
 * @param {Function} options.onEmploymentSaved - Callback when employment is saved
 * @returns {Object} Form management interface
 * 
 * @example
 * const {
 *   formData,
 *   validationErrors,
 *   validateEmploymentOnly,
 *   handleSaveEmploymentOnly
 * } = useEmploymentForm({
 *   onFormChange: () => saveFormState(),
 *   onEmploymentSaved: (data) => emit('employment-saved', data)
 * });
 */
export function useEmploymentForm(options = {}) {
  const { 
    mode = 'create',           // 'create' or 'edit' mode
    employmentId = null,       // Employment ID for edit mode
    onFormChange, 
    onEmploymentSaved,         // Callback for create mode
    onEmploymentUpdated,       // Callback for edit mode
    onError 
  } = options;

  // ============================================
  // FORM STATE
  // ============================================

  /**
   * Main form data reactive object
   * Contains all employment-related fields
   */
  const formData = reactive({
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
  });

  /**
   * Selected employee information for display
   */
  const selectedEmployeeInfo = ref(null);

  /**
   * Validation errors object
   * Keys are field names, values are error messages
   */
  const validationErrors = reactive({});

  /**
   * Alert message for form-level feedback
   */
  const alertMessage = ref('');

  /**
   * Alert CSS class for styling
   */
  const alertClass = ref('');

  /**
   * Submission state for employment-only save
   */
  const isSubmittingEmployment = ref(false);

  /**
   * Track if employment has been saved (decoupled workflow)
   */
  const isEmploymentSaved = ref(false);

  /**
   * Store the employment ID after save
   */
  const savedEmploymentId = ref(null);

  /**
   * Message to show after employment save
   */
  const employmentSaveMessage = ref('');

  /**
   * Show reminder to add allocations
   */
  const showAllocationReminder = ref(false);

  /**
   * Current mode: 'create' or 'edit'
   */
  const currentMode = ref(mode);

  /**
   * Employment ID for edit mode (tracked separately from formData)
   */
  const editEmploymentId = ref(employmentId);

  // ============================================
  // COMPUTED PROPERTIES
  // ============================================

  /**
   * Check if employment type is Local ID Staff
   */
  const isLocalIDStaff = computed(() => {
    return formData.employment_type === 'Local ID Staff';
  });

  /**
   * Check if employment type is Local non ID Staff
   */
  const isLocalNonIDStaff = computed(() => {
    return formData.employment_type === 'Local non ID Staff';
  });

  // ============================================
  // DATE UTILITIES
  // ============================================

  /**
   * Safely convert various date formats to Date object
   * 
   * @param {Date|string|number|null} dateValue - Date value to convert
   * @returns {Date|null} Converted Date object or null
   * 
   * @example
   * safeConvertToDate('2024-12-01') // Returns Date object
   * safeConvertToDate(new Date()) // Returns same Date object
   * safeConvertToDate(null) // Returns null
   */
  const safeConvertToDate = (dateValue) => {
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
  };

  /**
   * Format date for API submission (YYYY-MM-DD)
   * 
   * @param {Date|string|null} dateValue - Date to format
   * @returns {string|null} Formatted date string or null
   * 
   * @example
   * formatDateForAPI(new Date('2024-12-01')) // Returns '2024-12-01'
   */
  const formatDateForAPI = (dateValue) => {
    const date = safeConvertToDate(dateValue);
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Handle date picker changes with proper conversion
   * 
   * @param {string} fieldName - Form field name to update
   * @param {Date|string|null} newValue - New date value
   */
  const handleDateChange = (fieldName, newValue) => {
    try {
      const safeDate = safeConvertToDate(newValue);
      formData[fieldName] = safeDate;
      onFormChange?.();
    } catch (error) {
      console.error('Error handling date change:', error);
    }
  };

  /**
   * Handle start date change with auto-calculation of probation pass date
   * 
   * @param {Date|string|null} newValue - New start date value
   */
  const handleStartDateChange = (newValue) => {
    console.log('Start date changed:', newValue);
    handleDateChange('start_date', newValue);

    // Auto-calculate probation pass date (3 months after start date)
    if (newValue) {
      const startDate = safeConvertToDate(newValue);
      if (startDate) {
        const probationDate = new Date(startDate);
        probationDate.setMonth(probationDate.getMonth() + 3);
        formData.pass_probation_date = probationDate;
        console.log('Auto-calculated probation pass date:', probationDate);
        onFormChange?.();
      }
    }
  };

  /**
   * Handle end date change
   * 
   * @param {Date|string|null} newValue - New end date value
   */
  const handleEndDateChange = (newValue) => {
    console.log('End date changed:', newValue);
    handleDateChange('end_date', newValue);
  };

  /**
   * Handle probation date change
   * 
   * @param {Date|string|null} newValue - New probation date value
   */
  const handleProbationDateChange = (newValue) => {
    console.log('Probation date changed:', newValue);
    handleDateChange('pass_probation_date', newValue);
  };

  // ============================================
  // BENEFIT AUTO-SELECTION
  // ============================================

  /**
   * Auto-select benefits based on employee status
   * Priority: Employee status > Employment type (status wins in conflicts)
   * 
   * @param {string} status - Employee status
   */
  const autoSelectBenefitsBasedOnStatus = (status) => {
    console.log('Auto-selecting benefits for employee status:', status);

    if (!status) return;

    // Auto-select based on status (this has priority over employment type)
    if (status === 'Local ID' || status === 'Local ID Staff') {
      formData.pvd = true;
      formData.saving_fund = false;
      console.log('✅ Auto-selected PVD for Local ID staff (from employee status)');
    } else if (status === 'Local non ID' || status === 'Local non ID Staff') {
      formData.pvd = false;
      formData.saving_fund = true;
      console.log('✅ Auto-selected Saving Fund for Local non ID staff (from employee status)');
    } else {
      // For other statuses (Expats, etc.), reset to defaults
      formData.pvd = false;
      formData.saving_fund = false;
      console.log('ℹ️ Reset benefits for non-local employee status:', status);
    }

    // Save form state after auto-selection
    onFormChange?.();
  };

  /**
   * Auto-select benefits based on employment type
   * Note: This only applies if employee status hasn't already set the benefits
   * Employment type selection happens AFTER employee is selected, so it can override if needed
   * 
   * @param {string} employmentType - Employment type value
   */
  const autoSelectBenefitsBasedOnType = (employmentType) => {
    console.log('Auto-selecting benefits for employment type:', employmentType);

    if (!employmentType) return;

    // Check if employee status already determined benefits
    // If we have an employee selected with a status, prefer that
    const hasEmployeeStatus = selectedEmployeeInfo.value && selectedEmployeeInfo.value.status;

    if (hasEmployeeStatus) {
      const status = selectedEmployeeInfo.value.status;
      // Only override if employment type matches status category
      if ((status === 'Local ID' || status === 'Local ID Staff') && employmentType === 'Local ID Staff') {
        // Status and type agree - reinforce selection
        formData.pvd = true;
        formData.saving_fund = false;
        console.log('✅ Confirmed PVD (employment type matches employee status)');
      } else if ((status === 'Local non ID' || status === 'Local non ID Staff') && employmentType === 'Local non ID Staff') {
        // Status and type agree - reinforce selection
        formData.pvd = false;
        formData.saving_fund = true;
        console.log('✅ Confirmed Saving Fund (employment type matches employee status)');
      } else {
        // Conflict: employment type differs from employee status
        // Keep employee status selection (higher priority)
        console.log('⚠️ Employment type differs from employee status - keeping status-based selection');
      }
    } else {
      // No employee selected yet, use employment type
      if (employmentType === 'Local ID Staff') {
        formData.pvd = true;
        formData.saving_fund = false;
        console.log('✅ Auto-selected PVD for Local ID Staff employment type');
      } else if (employmentType === 'Local non ID Staff') {
        formData.pvd = false;
        formData.saving_fund = true;
        console.log('✅ Auto-selected Saving Fund for Local non ID Staff employment type');
      } else {
        // For other employment types, reset
        formData.pvd = false;
        formData.saving_fund = false;
        console.log('ℹ️ Reset benefits for employment type:', employmentType);
      }
    }

    // Save form state after auto-selection
    onFormChange?.();
  };

  // ============================================
  // EMPLOYEE CHANGE HANDLER
  // ============================================

  /**
   * Handle employee selection change
   * Updates selected employee info and auto-selects benefits
   */
  const onEmployeeChange = () => {
    if (formData.employee_id) {
      console.log('Employee selected:', formData.employee_id);
      const sharedStore = useSharedDataStore();
      const employee = sharedStore.findEmployeeInTree(formData.employee_id);

      if (employee) {
        // Get organization from parent node in tree structure
        const organization = sharedStore.getEmployeeOrganization(formData.employee_id);

        selectedEmployeeInfo.value = {
          name: employee.title,
          staff_id: employee.staff_id || 'N/A',
          organization: organization || 'N/A',
          status: employee.status || 'N/A'
        };

        // Auto-select benefits based on employee status
        autoSelectBenefitsBasedOnStatus(employee.status);
      }
    } else {
      selectedEmployeeInfo.value = null;
      // Reset benefits when no employee is selected
      formData.pvd = false;
      formData.saving_fund = false;
    }
    onFormChange?.();
  };

  // ============================================
  // VALIDATION
  // ============================================

  /**
   * Clear all validation errors and alerts
   */
  const clearValidationErrors = () => {
    Object.keys(validationErrors).forEach(key => {
      delete validationErrors[key];
    });
    alertMessage.value = '';
    alertClass.value = '';
  };

  /**
   * Validate employment fields only (for decoupled workflow)
   * 
   * @returns {boolean} True if all required fields are valid
   */
  const validateEmploymentOnly = () => {
    clearValidationErrors();
    let isValid = true;

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
      if (!formData[field]) {
        validationErrors[field] = message;
        isValid = false;
      }
    }

    return isValid;
  };

  /**
   * Validate entire form including allocations (for combined workflow)
   * 
   * @param {Array} fundingAllocations - Array of funding allocations
   * @param {number} totalFte - Total FTE percentage
   * @returns {boolean} True if form is valid
   */
  const validateForm = (fundingAllocations = [], totalFte = 0) => {
    clearValidationErrors();
    let isValid = true;

    const formDataRaw = toRaw(formData);

    // Validate required fields
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
        validationErrors[field] = message;
        isValid = false;
      }
    }

    // Validate funding allocations
    if (fundingAllocations.length === 0) {
      alertMessage.value = 'Please add at least one funding allocation';
      alertClass.value = 'alert-danger';
      isValid = false;
    } else if (totalFte !== 100) {
      alertMessage.value = `Total FTE must equal 100%. Current total: ${totalFte}%`;
      alertClass.value = 'alert-danger';
      isValid = false;
    }

    return isValid;
  };

  // ============================================
  // PAYLOAD BUILDERS
  // ============================================

  /**
   * Build payload for employment-only API call (decoupled workflow)
   * Does not include allocations - they are saved separately
   * 
   * @returns {Object} Employment payload for API
   */
  const buildEmploymentOnlyPayload = () => {
    return {
      employee_id: formData.employee_id,
      employment_type: formData.employment_type,
      pay_method: formData.pay_method || null,
      pass_probation_date: formatDateForAPI(formData.pass_probation_date),
      start_date: formatDateForAPI(formData.start_date),
      end_date: formatDateForAPI(formData.end_date),
      department_id: formData.department_id || null,
      position_id: formData.position_id || null,
      section_department: formData.section_department || null,
      site_id: formData.site_id || null,
      pass_probation_salary: formData.pass_probation_salary,
      probation_salary: formData.probation_salary || null,
      status: !!formData.status,
      health_welfare: !!formData.health_welfare,
      pvd: !!formData.pvd,
      saving_fund: !!formData.saving_fund
      // NOTE: No allocations - employment created without allocations
    };
  };

  /**
   * Build complete payload for API (combined workflow)
   * 
   * @param {Array} fundingAllocations - Array of funding allocations
   * @returns {Object} Complete payload for API
   */
  const buildPayloadForAPI = (fundingAllocations = []) => {
    const basePayload = buildEmploymentOnlyPayload();

    return {
      ...basePayload,
      // Funding allocation data - required for create
      // Backend calculates allocated_amount
      allocations: fundingAllocations.map(allocation => ({
        allocation_type: 'grant',
        grant_item_id: allocation.grant_item_id || allocation.grant_items_id || '',
        fte: allocation.fte // Send as percentage (0-100)
      }))
    };
  };

  // ============================================
  // API HANDLERS
  // ============================================

  /**
   * Handle API errors consistently
   * 
   * @param {Error|Object} error - Error from API call
   */
  const handleApiError = (error) => {
    Object.keys(validationErrors).forEach(key => {
      delete validationErrors[key];
    });

    if (error.status && error.success === false) {
      if (error.errors && typeof error.errors === 'object' && !Array.isArray(error.errors)) {
        Object.assign(validationErrors, error.errors);
        alertMessage.value = error.error || error.message || 'Validation failed';
      } else {
        alertMessage.value = error.error || error.message || 'An error occurred';
      }
    } else if (error.response?.data) {
      const errorData = error.response.data;
      alertMessage.value = errorData.error || errorData.message || 'An error occurred';
      if (errorData.errors && typeof errorData.errors === 'object') {
        Object.assign(validationErrors, errorData.errors);
      }
    } else {
      alertMessage.value = error.message || 'An error occurred. Please try again.';
    }

    alertClass.value = 'alert-danger';
    onError?.(error);
  };

  /**
   * Handle saving employment only (decoupled workflow - Step 1)
   * Creates employment record without allocations
   * 
   * @returns {Promise<Object|null>} Saved employment data or null on failure
   */
  const handleSaveEmploymentOnly = async () => {
    try {
      console.log('Saving employment only (decoupled workflow)...', {
        formData: toRaw(formData)
      });

      if (!validateEmploymentOnly()) {
        console.log('Employment validation failed');
        alertMessage.value = 'Please fill in all required employment fields';
        alertClass.value = 'alert-danger';
        return null;
      }

      isSubmittingEmployment.value = true;
      alertMessage.value = '';

      const payload = buildEmploymentOnlyPayload();
      console.log('Employment payload:', payload);

      const response = await employmentService.createEmployment(payload);
      console.log('Employment API Response:', response);

      // Store employment ID for allocation creation
      savedEmploymentId.value = response.data?.employment?.id || response.data?.id;
      isEmploymentSaved.value = true;
      showAllocationReminder.value = true;

      // Show success message with guidance
      employmentSaveMessage.value = response.message || 'Employment saved successfully';
      alertMessage.value = `${employmentSaveMessage.value}. You can now add funding allocations below.`;
      alertClass.value = 'alert-success';

      // Callback
      onEmploymentSaved?.({
        success: true,
        message: employmentSaveMessage.value,
        employmentId: savedEmploymentId.value,
        data: response.data
      });

      return response.data;

    } catch (error) {
      console.error('Error saving employment:', error);
      handleApiError(error);
      return null;
    } finally {
      isSubmittingEmployment.value = false;
    }
  };

  // ============================================
  // EDIT MODE: LOAD & UPDATE EMPLOYMENT
  // ============================================

  /**
   * Load employment data for editing
   * Fetches employment record and populates form fields
   * 
   * @param {number|Object} employmentIdOrData - Employment ID or full employment data object
   * @returns {Promise<boolean>} Success status
   * 
   * @example
   * // Load by ID (triggers API call)
   * await loadEmployment(123);
   * 
   * // Load from existing data (no API call)
   * await loadEmployment({ id: 123, employment_type: 'Full-time', ... });
   */
  const loadEmployment = async (employmentIdOrData) => {
    try {
      let data;
      
      // If passed an object with employment data, use it directly
      if (typeof employmentIdOrData === 'object' && employmentIdOrData !== null) {
        data = employmentIdOrData;
        console.log('📥 Loading employment from provided data:', data.id);
      } else {
        // Otherwise fetch from API
        const id = employmentIdOrData;
        console.log('📥 Loading employment from API:', id);
        
        const response = await employmentService.getEmploymentById(id);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to load employment');
        }
        
        data = response.data;
      }
      
      // Store employment ID for edit operations
      editEmploymentId.value = data.id;
      savedEmploymentId.value = data.id;
      
      // Populate form fields
      Object.assign(formData, {
        employment_id: data.id,
        employee_id: data.employee_id,
        employment_type: data.employment_type || '',
        pay_method: data.pay_method || '',
        department_id: data.department_id || '',
        position_id: data.position_id || '',
        section_department: data.section_department || '',
        site_id: data.site_id || '',
        probation_salary: data.probation_salary || '',
        pass_probation_salary: data.pass_probation_salary || '',
        status: data.status === 1 || data.status === true || data.status === 'Active',
        health_welfare: data.health_welfare === 1 || data.health_welfare === true,
        saving_fund: data.saving_fund === 1 || data.saving_fund === true,
        pvd: data.pvd === 1 || data.pvd === true,
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null,
        pass_probation_date: data.pass_probation_date ? new Date(data.pass_probation_date) : null
      });
      
      // Set employee info for display
      if (data.employee) {
        selectedEmployeeInfo.value = {
          id: data.employee.id,
          name: `${data.employee.first_name_en || ''} ${data.employee.last_name_en || ''}`.trim() || 'Unknown',
          staff_id: data.employee.staff_id || 'N/A',
          organization: data.employee.organization || 'N/A',
          status: data.employee.status || 'N/A'
        };
      }
      
      // Mark as already saved (for edit mode, employment exists)
      isEmploymentSaved.value = true;
      
      console.log('✅ Employment data loaded successfully');
      return true;
      
    } catch (error) {
      console.error('Error loading employment:', error);
      handleApiError(error);
      return false;
    }
  };

  /**
   * Handle updating employment (edit mode - Step 1)
   * Updates existing employment record
   * 
   * @returns {Promise<Object|null>} Updated employment data or null on failure
   */
  const handleUpdateEmployment = async () => {
    try {
      const empId = editEmploymentId.value || formData.employment_id;
      
      if (!empId) {
        alertMessage.value = 'No employment ID found for update';
        alertClass.value = 'alert-danger';
        return null;
      }
      
      console.log('Updating employment (edit mode)...', {
        employmentId: empId,
        formData: toRaw(formData)
      });

      if (!validateEmploymentOnly()) {
        console.log('Employment validation failed');
        alertMessage.value = 'Please fill in all required employment fields';
        alertClass.value = 'alert-danger';
        return null;
      }

      isSubmittingEmployment.value = true;
      alertMessage.value = '';

      const payload = buildEmploymentOnlyPayload();
      console.log('Update payload:', payload);

      const response = await employmentService.updateEmployment(empId, payload);
      console.log('Update API Response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Update failed');
      }

      // Update saved employment ID
      savedEmploymentId.value = empId;
      isEmploymentSaved.value = true;

      // Show success message
      employmentSaveMessage.value = response.message || 'Employment updated successfully';
      alertMessage.value = employmentSaveMessage.value;
      alertClass.value = 'alert-success';

      // Callback for edit mode
      onEmploymentUpdated?.({
        success: true,
        message: employmentSaveMessage.value,
        employmentId: empId,
        data: response.data
      });

      return response.data;

    } catch (error) {
      console.error('Error updating employment:', error);
      handleApiError(error);
      return null;
    } finally {
      isSubmittingEmployment.value = false;
    }
  };

  /**
   * Smart save handler - routes to create or update based on mode
   * 
   * @returns {Promise<Object|null>} Saved/updated data or null on failure
   */
  const handleSaveOrUpdateEmployment = async () => {
    if (currentMode.value === 'edit' || editEmploymentId.value) {
      return handleUpdateEmployment();
    }
    return handleSaveEmploymentOnly();
  };

  // ============================================
  // FORM RESET
  // ============================================

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    console.log('Resetting employment form');

    // Reset form data
    Object.assign(formData, {
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
      status: true,
      health_welfare: false,
      pvd: false,
      saving_fund: false
    });

    // Reset related state
    selectedEmployeeInfo.value = null;
    isEmploymentSaved.value = false;
    savedEmploymentId.value = null;
    employmentSaveMessage.value = '';
    showAllocationReminder.value = false;
    
    // Reset edit mode state
    editEmploymentId.value = null;
    // Note: currentMode is not reset here - it's set by the modal initialization

    // Clear validation
    clearValidationErrors();
  };

  /**
   * Handle employment status change from Ant Design Switch
   * 
   * @param {boolean} checked - New status value
   */
  const onStatusChange = (checked) => {
    console.log('Employment status changed to:', checked ? 'Active' : 'Inactive');
    onFormChange?.();
  };

  // ============================================
  // RETURN PUBLIC API
  // ============================================

  return {
    // State
    formData,
    selectedEmployeeInfo,
    validationErrors,
    alertMessage,
    alertClass,
    isSubmittingEmployment,
    isEmploymentSaved,
    savedEmploymentId,
    employmentSaveMessage,
    showAllocationReminder,
    
    // Edit mode state
    currentMode,
    editEmploymentId,

    // Computed
    isLocalIDStaff,
    isLocalNonIDStaff,

    // Date utilities
    safeConvertToDate,
    formatDateForAPI,
    handleDateChange,
    handleStartDateChange,
    handleEndDateChange,
    handleProbationDateChange,

    // Benefit auto-selection
    autoSelectBenefitsBasedOnStatus,
    autoSelectBenefitsBasedOnType,

    // Employee handling
    onEmployeeChange,

    // Validation
    clearValidationErrors,
    validateEmploymentOnly,
    validateForm,

    // Payload builders
    buildEmploymentOnlyPayload,
    buildPayloadForAPI,

    // API handlers
    handleApiError,
    handleSaveEmploymentOnly,
    
    // Edit mode handlers
    loadEmployment,
    handleUpdateEmployment,
    handleSaveOrUpdateEmployment,

    // Form management
    resetForm,
    onStatusChange
  };
}

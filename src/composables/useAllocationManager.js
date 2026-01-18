import { ref, reactive, computed } from 'vue';
import { employmentService } from '@/services/employment.service';
import { useAllocationCalculation } from '@/composables/useAllocationCalculation';

/**
 * Composable for managing funding allocations
 * 
 * Handles allocation CRUD operations, FTE validation, duplicate detection,
 * and integration with backend calculation API.
 * 
 * @param {Object} options - Configuration options
 * @param {Ref|Reactive} options.formData - Main employment form data (for salary context)
 * @param {Function} options.onFormChange - Callback when allocations change
 * @param {Function} options.onAllocationsSaved - Callback when allocations are saved
 * @param {Function} options.onError - Callback on error
 * @param {Function} options.formatCurrency - Currency formatting function
 * @returns {Object} Allocation management interface
 * 
 * @example
 * const {
 *   fundingAllocations,
 *   currentAllocation,
 *   addAllocation,
 *   editAllocation,
 *   deleteAllocation
 * } = useAllocationManager({
 *   formData,
 *   onFormChange: () => saveFormState()
 * });
 */
export function useAllocationManager(options = {}) {
  const { formData, onFormChange, onAllocationsSaved, onError, formatCurrency: externalFormatCurrency } = options;

  // Get calculation composable for backend calculations
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

  // ============================================
  // STATE
  // ============================================

  /**
   * Array of funding allocations
   */
  const fundingAllocations = ref([]);

  /**
   * Current allocation being added
   */
  const currentAllocation = reactive({
    allocation_type: '',
    grant_id: '',
    grant_item_id: '',
    department_position_id: '',
    department_id: '',
    position_id: '',
    fte: 100
  });

  /**
   * Data for editing an allocation
   */
  const editData = reactive({
    allocation_type: '',
    grant_id: '',
    grant_item_id: '',
    department_position_id: '',
    department_id: '',
    position_id: '',
    fte: 100
  });

  /**
   * Index of allocation being edited (-1 or null when not editing)
   */
  const editingIndex = ref(null);

  /**
   * Allocation validation errors
   */
  const allocationErrors = reactive({});

  /**
   * Alert message for allocation section
   */
  const alertMessage = ref('');

  /**
   * Alert CSS class for styling
   */
  const alertClass = ref('');

  /**
   * Submission state for allocations-only save
   */
  const isSubmittingAllocations = ref(false);

  /**
   * Track if allocations have been saved
   */
  const isAllocationsSaved = ref(false);

  /**
   * Grant position options (loaded per grant)
   */
  const grantPositionOptions = ref([]);

  /**
   * Edit grant position options
   */
  const editGrantPositionOptions = ref([]);

  // ============================================
  // COMPUTED PROPERTIES
  // ============================================

  /**
   * Total FTE percentage across all allocations
   */
  const totalFte = computed(() => {
    return fundingAllocations.value.reduce((sum, allocation) => sum + allocation.fte, 0);
  });

  /**
   * Total allocated salary (sum of backend-calculated amounts)
   */
  const totalAllocatedSalary = computed(() => {
    return fundingAllocations.value.reduce((sum, allocation) => {
      if (allocation.allocated_amount !== undefined && allocation.allocated_amount !== null) {
        return sum + parseFloat(allocation.allocated_amount);
      }
      console.warn('⚠️ Allocation missing backend-calculated amount in total:', allocation);
      return sum;
    }, 0);
  });

  /**
   * Check if allocation form can be enabled
   * Requires employee, start date, and at least one salary field
   */
  const canAddAllocation = computed(() => {
    const data = formData?.value ?? formData;
    if (!data) return false;
    
    return !!(
      data.employee_id &&
      data.start_date &&
      (data.probation_salary || data.pass_probation_salary)
    );
  });

  // ============================================
  // VALIDATION
  // ============================================

  /**
   * Clear allocation errors
   */
  const clearAllocationErrors = () => {
    Object.keys(allocationErrors).forEach(key => {
      delete allocationErrors[key];
    });
    alertMessage.value = '';
    alertClass.value = '';
  };

  /**
   * Validate current allocation before adding
   * 
   * @returns {boolean} True if valid
   */
  const validateCurrentAllocation = () => {
    clearAllocationErrors();
    let isValid = true;

    if (!currentAllocation.grant_id) {
      allocationErrors.grant_id = 'Please select a grant';
      isValid = false;
    }

    // All allocations require grant_item_id
    if (!currentAllocation.grant_item_id) {
      allocationErrors.grant_item_id = 'Please select a grant position';
      isValid = false;
    }

    if (!currentAllocation.fte || currentAllocation.fte <= 0) {
      allocationErrors.fte = 'Please enter a valid FTE percentage';
      isValid = false;
    }

    if (currentAllocation.fte > 100) {
      allocationErrors.fte = 'FTE percentage cannot exceed 100%';
      isValid = false;
    }

    return isValid;
  };

  /**
   * Validate edited allocation
   * 
   * @returns {boolean} True if valid
   */
  const validateEditAllocation = () => {
    let isValid = true;

    if (!editData.grant_id) {
      alertMessage.value = 'Please select a grant';
      alertClass.value = 'alert-danger';
      isValid = false;
    }

    if (!editData.grant_item_id) {
      alertMessage.value = 'Please select a grant position';
      alertClass.value = 'alert-danger';
      isValid = false;
    }

    if (!editData.fte || editData.fte <= 0) {
      alertMessage.value = 'Please enter a valid FTE percentage';
      alertClass.value = 'alert-danger';
      isValid = false;
    }

    if (editData.fte > 100) {
      alertMessage.value = 'FTE percentage cannot exceed 100%';
      alertClass.value = 'alert-danger';
      isValid = false;
    }

    return isValid;
  };

  // ============================================
  // LOAD EXISTING ALLOCATIONS (EDIT MODE)
  // ============================================

  /**
   * Load existing allocations for an employment (used in edit mode)
   * Fetches allocations from API and populates the fundingAllocations array
   * 
   * @param {number} employmentId - Employment ID to load allocations for
   * @returns {Promise<boolean>} Success status
   * 
   * @example
   * // Load allocations when opening edit modal
   * await loadAllocations(employmentId);
   */
  const loadAllocations = async (employmentId) => {
    if (!employmentId) {
      console.warn('⚠️ loadAllocations called without employmentId');
      return false;
    }

    try {
      console.log('📥 Loading allocations for employment:', employmentId);
      
      const response = await employmentService.getFundingAllocations(employmentId);
      
      if (!response.success) {
        console.warn('Failed to load allocations:', response.message);
        return false;
      }

      const allocationsData = response.data || [];
      console.log('📋 Loaded allocations:', allocationsData.length);

      // Transform API response to match local allocation structure
      fundingAllocations.value = allocationsData.map(alloc => ({
        // Core fields
        id: alloc.id,
        allocation_type: alloc.allocation_type || 'grant',
        grant_id: alloc.grant_id,
        grant_item_id: alloc.grant_item_id,
        fte: alloc.fte || 0,
        allocated_amount: alloc.allocated_amount || 0,
        
        // Display names for the UI table
        grant_name: alloc.grant?.project_name || alloc.grant_name || 'Unknown Grant',
        budget_line_code: alloc.grant_item?.budget_line_code || alloc.budget_line_code || 'N/A',
        position_name: alloc.grant_item?.position?.name || alloc.position_name || 'N/A',
        
        // Keep original data for reference
        _original: alloc
      }));

      // Mark as having existing allocations
      if (allocationsData.length > 0) {
        isAllocationsSaved.value = true;
      }

      console.log('✅ Allocations loaded and mapped:', fundingAllocations.value);
      return true;

    } catch (error) {
      console.error('Error loading allocations:', error);
      onError?.({ message: error.message || 'Failed to load allocations' });
      return false;
    }
  };

  /**
   * Clear all allocations from memory
   * Used when resetting the form
   */
  const clearAllocations = () => {
    fundingAllocations.value = [];
    isAllocationsSaved.value = false;
    clearAllocationErrors();
    resetCurrentAllocation();
  };

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  /**
   * Add allocation to the list
   * Gets backend calculation before adding
   */
  const addAllocation = async () => {
    console.log('Adding allocation to memory:', currentAllocation);

    if (!validateCurrentAllocation()) {
      return;
    }

    // Check for duplicates
    const isDuplicate = fundingAllocations.value.some((a, i) => {
      if (editingIndex.value !== null && i === editingIndex.value) return false;
      return a.grant_item_id === currentAllocation.grant_item_id;
    });

    if (isDuplicate) {
      alertMessage.value = 'This allocation is already added.';
      alertClass.value = 'alert-danger';
      return;
    }

    // Check if total FTE would exceed 100%
    const currentTotal = fundingAllocations.value.reduce((sum, a, i) => {
      return i === editingIndex.value ? sum : sum + a.fte;
    }, 0);

    if (currentTotal + currentAllocation.fte > 100) {
      alertMessage.value = `Adding this allocation would exceed 100% FTE. Available: ${100 - currentTotal}%`;
      alertClass.value = 'alert-danger';
      return;
    }

    // Get backend calculation before adding allocation
    console.log('🔄 Getting backend calculation before adding allocation...');
    try {
      const data = formData?.value ?? formData;
      await calculateAmount({
        probation_salary: data.probation_salary,
        pass_probation_salary: data.pass_probation_salary,
        pass_probation_date: data.pass_probation_date,
        start_date: data.start_date
      }, currentAllocation.fte);

      // Create allocation with backend-calculated amount
      const allocation = {
        ...currentAllocation,
        allocated_amount: allocatedAmount.value,
        salary_type: salaryType.value,
        calculation_formula: calculationFormula.value
      };

      if (editingIndex.value !== null) {
        fundingAllocations.value[editingIndex.value] = allocation;
        editingIndex.value = null;
        console.log('✅ Updated allocation in memory with backend calculation');
      } else {
        fundingAllocations.value.push(allocation);
        console.log('✅ Added new allocation to memory. Total:', fundingAllocations.value.length);
      }

      // Reset current allocation form
      resetCurrentAllocation();
      clearAllocationErrors();
      onFormChange?.();

    } catch (error) {
      console.error('❌ Failed to calculate allocation before adding:', error);
      alertMessage.value = 'Failed to calculate allocation amount. Please try again.';
      alertClass.value = 'alert-danger';
    }
  };

  /**
   * Start editing an allocation
   * 
   * @param {number} index - Index of allocation to edit
   * @param {Object} grantPositions - Grant positions lookup object
   */
  const editAllocation = (index, grantPositions = {}) => {
    console.log('Editing allocation at index:', index);
    editingIndex.value = index;
    Object.assign(editData, fundingAllocations.value[index]);
    
    // Set allocation type and load grant positions
    editData.allocation_type = 'grant';
    editGrantPositionOptions.value = grantPositions[editData.grant_id] || [];
  };

  /**
   * Save edited allocation
   */
  const saveEdit = async () => {
    console.log('Saving edited allocation:', editData);

    if (!validateEditAllocation()) {
      return;
    }

    // Check for duplicates (excluding current editing index)
    const isDuplicate = fundingAllocations.value.some((a, i) => {
      if (i === editingIndex.value) return false;
      return a.grant_item_id === editData.grant_item_id;
    });

    if (isDuplicate) {
      alertMessage.value = 'This allocation is already added.';
      alertClass.value = 'alert-danger';
      return;
    }

    // Check if total FTE would exceed 100%
    const currentTotal = fundingAllocations.value.reduce((sum, a, i) => {
      return i === editingIndex.value ? sum : sum + a.fte;
    }, 0);

    if (currentTotal + editData.fte > 100) {
      alertMessage.value = `Saving this allocation would exceed 100% FTE. Available: ${100 - currentTotal}%`;
      alertClass.value = 'alert-danger';
      return;
    }

    // Get backend calculation before saving edited allocation
    console.log('🔄 Getting backend calculation for edited allocation...');
    try {
      const data = formData?.value ?? formData;
      await calculateAmount({
        probation_salary: data.probation_salary,
        pass_probation_salary: data.pass_probation_salary,
        pass_probation_date: data.pass_probation_date,
        start_date: data.start_date
      }, editData.fte);

      // Update allocation with backend-calculated amount
      const updatedAllocation = {
        ...editData,
        allocated_amount: allocatedAmount.value,
        salary_type: salaryType.value,
        calculation_formula: calculationFormula.value
      };

      fundingAllocations.value[editingIndex.value] = updatedAllocation;
      editingIndex.value = null;
      clearAllocationErrors();
      onFormChange?.();

      console.log('✅ Successfully saved edited allocation with backend calculation');
    } catch (error) {
      console.error('❌ Failed to calculate edited allocation:', error);
      alertMessage.value = 'Failed to calculate allocation amount. Please try again.';
      alertClass.value = 'alert-danger';
    }
  };

  /**
   * Cancel editing
   */
  const cancelEdit = () => {
    editingIndex.value = null;
  };

  /**
   * Delete allocation at index
   * 
   * @param {number} index - Index to delete
   */
  const deleteAllocation = (index) => {
    fundingAllocations.value.splice(index, 1);
    editingIndex.value = null;
    onFormChange?.();
  };

  /**
   * Reset current allocation form
   */
  const resetCurrentAllocation = () => {
    Object.assign(currentAllocation, {
      allocation_type: '',
      grant_id: '',
      grant_item_id: '',
      department_position_id: '',
      department_id: '',
      position_id: '',
      fte: 100
    });
    grantPositionOptions.value = [];
  };

  /**
   * Reset all allocations
   */
  const resetAllocations = () => {
    fundingAllocations.value = [];
    resetCurrentAllocation();
    Object.assign(editData, {
      allocation_type: '',
      grant_id: '',
      grant_item_id: '',
      department_position_id: '',
      department_id: '',
      position_id: '',
      fte: 100
    });
    editingIndex.value = null;
    isAllocationsSaved.value = false;
    clearAllocationErrors();
  };

  // ============================================
  // GRANT CHANGE HANDLERS
  // ============================================

  /**
   * Handle grant selection change
   * 
   * @param {Object} grantPositions - Grant positions lookup object
   */
  const onGrantChange = (grantPositions = {}) => {
    console.log('Grant changed:', currentAllocation.grant_id);

    currentAllocation.allocation_type = 'grant';
    currentAllocation.department_position_id = '';
    currentAllocation.department_id = '';
    currentAllocation.position_id = '';
    currentAllocation.grant_item_id = '';
    
    grantPositionOptions.value = grantPositions[currentAllocation.grant_id] || [];

    console.log('Available positions for grant:', grantPositionOptions.value);
    clearAllocationErrors();
    onFormChange?.();
  };

  /**
   * Handle grant position change
   */
  const onGrantPositionChange = () => {
    console.log('Grant position changed:', currentAllocation.grant_item_id);
    delete allocationErrors.grant_item_id;
    onFormChange?.();
  };

  /**
   * Handle grant change in edit mode
   * 
   * @param {Object} grantPositions - Grant positions lookup object
   */
  const onEditGrantChange = (grantPositions = {}) => {
    editData.grant_item_id = '';
    editData.department_position_id = '';
    editData.department_id = '';
    editData.position_id = '';
    editData.fte = 100;
    editData.allocation_type = 'grant';
    
    editGrantPositionOptions.value = grantPositions[editData.grant_id] || [];
  };

  /**
   * Handle grant position change in edit mode
   */
  const onEditGrantPositionChange = () => {
    console.log('Grant position changed in edit mode:', editData.grant_item_id);
  };

  // ============================================
  // FTE CHANGE HANDLERS
  // ============================================

  /**
   * Handle FTE change with real-time validation and calculation
   */
  const onFteChange = async () => {
    onFormChange?.();

    // Validate FTE in real-time
    if (currentAllocation.fte < 0) {
      alertMessage.value = 'FTE cannot be negative';
      alertClass.value = 'alert-danger';
      return;
    }

    if (currentAllocation.fte > 100) {
      alertMessage.value = 'FTE cannot exceed 100%';
      alertClass.value = 'alert-danger';
      return;
    }

    // Check if total FTE would exceed 100%
    const currentTotal = fundingAllocations.value.reduce((sum, a, i) => {
      return i === editingIndex.value ? sum : sum + a.fte;
    }, 0);

    if (currentTotal + currentAllocation.fte > 100) {
      alertMessage.value = `Adding this would make total ${currentTotal + currentAllocation.fte}%. Maximum is 100%. Available: ${100 - currentTotal}%`;
      alertClass.value = 'alert-warning';
    } else if (alertClass.value === 'alert-warning') {
      alertMessage.value = '';
      alertClass.value = '';
    }

    // Skip calculation if FTE is invalid
    if (!currentAllocation.fte || currentAllocation.fte <= 0) {
      return;
    }

    // Call backend API for real-time calculation
    try {
      const data = formData?.value ?? formData;
      await calculateAmount({
        probation_salary: data.probation_salary,
        pass_probation_salary: data.pass_probation_salary,
        pass_probation_date: data.pass_probation_date,
        start_date: data.start_date
      }, currentAllocation.fte);

      console.log('✅ Backend calculation complete:', calculationResult.value);
    } catch (error) {
      console.error('❌ Error calculating allocation:', error);
      alertMessage.value = 'Failed to calculate allocation. Please check your input and try again.';
      alertClass.value = 'alert-danger';
    }
  };

  /**
   * Handle FTE change in edit mode
   */
  const onEditFteChange = async () => {
    onFormChange?.();

    if (editData.fte < 0) {
      alertMessage.value = 'FTE cannot be negative';
      alertClass.value = 'alert-danger';
      return;
    }

    if (editData.fte > 100) {
      alertMessage.value = 'FTE cannot exceed 100%';
      alertClass.value = 'alert-danger';
      return;
    }

    const currentTotal = fundingAllocations.value.reduce((sum, a, i) => {
      return i === editingIndex.value ? sum : sum + a.fte;
    }, 0);

    if (currentTotal + editData.fte > 100) {
      alertMessage.value = `Total FTE would be ${currentTotal + editData.fte}%. Maximum is 100%. Available: ${100 - currentTotal}%`;
      alertClass.value = 'alert-warning';
    } else if (alertClass.value === 'alert-warning') {
      alertMessage.value = '';
      alertClass.value = '';
    }

    if (!editData.fte || editData.fte <= 0) {
      return;
    }

    try {
      const data = formData?.value ?? formData;
      await calculateAmount({
        probation_salary: data.probation_salary,
        pass_probation_salary: data.pass_probation_salary,
        pass_probation_date: data.pass_probation_date,
        start_date: data.start_date
      }, editData.fte);

      console.log('✅ Backend calculation complete for edit:', calculationResult.value);
    } catch (error) {
      console.error('❌ Error calculating allocation in edit mode:', error);
      alertMessage.value = 'Failed to calculate allocation. Please check your input and try again.';
      alertClass.value = 'alert-danger';
    }
  };

  // ============================================
  // DISPLAY HELPERS
  // ============================================

  /**
   * Format currency value
   * 
   * @param {number} value - Value to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (value) => {
    if (externalFormatCurrency) {
      return externalFormatCurrency(value);
    }
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  /**
   * Get calculated salary for current allocation display
   * 
   * @param {number} ftePercentage - FTE percentage
   * @param {boolean} isEditMode - Whether in edit mode
   * @returns {string} Formatted salary or status message
   */
  const getCalculatedSalary = (ftePercentage, isEditMode = false) => {
    if (!ftePercentage || ftePercentage === 0) {
      return '฿0.00';
    }

    if (isEditMode && editingIndex.value !== null) {
      if (calculationResult.value && calculationResult.value.fte === ftePercentage) {
        return formattedAmount.value;
      }
      if (editData.allocated_amount !== undefined && editData.allocated_amount !== null) {
        return formatCurrency(editData.allocated_amount);
      }
    }

    if (!isEditMode) {
      if (calculationResult.value && calculationResult.value.fte === ftePercentage) {
        return formattedAmount.value;
      }
    }

    const data = formData?.value ?? formData;
    if (!data?.probation_salary && !data?.pass_probation_salary) {
      return 'Enter salary first';
    }

    return 'Calculating...';
  };

  /**
   * Get allocated salary for table display
   * 
   * @param {Object} allocation - Allocation object
   * @returns {string} Formatted salary
   */
  const getAllocatedSalary = (allocation) => {
    if (allocation.allocated_amount !== undefined && allocation.allocated_amount !== null) {
      return formatCurrency(allocation.allocated_amount);
    }
    console.warn('⚠️ Allocation missing backend-calculated amount:', allocation);
    return '฿0.00';
  };

  /**
   * Get salary type label for display
   * 
   * @returns {string} Salary type label
   */
  const getSalaryTypeLabel = () => {
    if (calculating.value) {
      return 'Calculating...';
    }

    if (salaryTypeLabel.value) {
      return salaryTypeLabel.value;
    }

    const data = formData?.value ?? formData;
    if (data?.probation_salary) {
      return 'Probation Salary';
    } else if (data?.pass_probation_salary) {
      return 'Pass Probation Salary';
    }

    return 'Not Set';
  };

  // ============================================
  // PAYLOAD BUILDER
  // ============================================

  /**
   * Build payload for allocations-only API call
   * 
   * @param {number} savedEmploymentId - ID of saved employment
   * @param {Function} formatDateForAPI - Date formatting function
   * @returns {Object} Allocations payload
   */
  const buildAllocationsOnlyPayload = (savedEmploymentId, formatDateForAPI) => {
    if (!savedEmploymentId) {
      throw new Error('Employment must be saved before creating allocations');
    }

    const data = formData?.value ?? formData;

    return {
      employee_id: data.employee_id,
      employment_id: savedEmploymentId,
      start_date: formatDateForAPI?.(data.start_date) || null,
      end_date: formatDateForAPI?.(data.end_date) || null,
      allocations: fundingAllocations.value.map(allocation => ({
        allocation_type: 'grant',
        grant_item_id: allocation.grant_item_id || allocation.grant_items_id || '',
        fte: allocation.fte
      }))
    };
  };

  /**
   * Handle saving allocations only (decoupled workflow - Step 2)
   * 
   * @param {number} savedEmploymentId - ID of saved employment
   * @param {Function} formatDateForAPI - Date formatting function
   * @returns {Promise<Object|null>} Response data or null on failure
   */
  const handleSaveAllocationsOnly = async (savedEmploymentId, formatDateForAPI) => {
    try {
      if (!savedEmploymentId) {
        alertMessage.value = 'Please save the employment first before adding allocations';
        alertClass.value = 'alert-danger';
        return null;
      }

      if (fundingAllocations.value.length === 0) {
        alertMessage.value = 'Please add at least one funding allocation';
        alertClass.value = 'alert-danger';
        return null;
      }

      if (totalFte.value !== 100) {
        alertMessage.value = `Total FTE must equal 100%. Current total: ${totalFte.value}%`;
        alertClass.value = 'alert-danger';
        return null;
      }

      console.log('Saving allocations only (decoupled workflow)...', {
        employmentId: savedEmploymentId,
        allocations: fundingAllocations.value
      });

      isSubmittingAllocations.value = true;
      alertMessage.value = '';

      const payload = buildAllocationsOnlyPayload(savedEmploymentId, formatDateForAPI);
      console.log('Allocations payload:', payload);

      const response = await employmentService.createFundingAllocations(payload);
      console.log('Allocations API Response:', response);

      isAllocationsSaved.value = true;

      // Show success with salary info from backend
      const salaryInfo = response.salary_info;
      let successMessage = response.message || 'Funding allocations saved successfully';
      if (salaryInfo) {
        const salaryTypeMsg = salaryInfo.is_probation_period ? 'Probation' : 'Regular';
        successMessage += ` (Using ${salaryTypeMsg} salary: ${formatCurrency(salaryInfo.salary_amount_used)})`;
      }

      alertMessage.value = successMessage;
      alertClass.value = 'alert-success';

      onAllocationsSaved?.({
        success: true,
        message: successMessage,
        employmentId: savedEmploymentId,
        data: response.data,
        salaryInfo: salaryInfo
      });

      return response;

    } catch (error) {
      console.error('Error saving allocations:', error);
      
      if (error.status && error.success === false) {
        alertMessage.value = error.error || error.message || 'Failed to save allocations';
      } else if (error.response?.data) {
        alertMessage.value = error.response.data.error || error.response.data.message || 'An error occurred';
      } else {
        alertMessage.value = error.message || 'An error occurred. Please try again.';
      }
      alertClass.value = 'alert-danger';
      
      onError?.(error);
      return null;
    } finally {
      isSubmittingAllocations.value = false;
    }
  };

  // ============================================
  // RETURN PUBLIC API
  // ============================================

  return {
    // State
    fundingAllocations,
    currentAllocation,
    editData,
    editingIndex,
    allocationErrors,
    alertMessage,
    alertClass,
    isSubmittingAllocations,
    isAllocationsSaved,
    grantPositionOptions,
    editGrantPositionOptions,

    // Computed
    totalFte,
    totalAllocatedSalary,
    canAddAllocation,

    // Calculation composable exports
    calculating,
    calculationResult,
    calculateAmount,
    formattedAmount,
    allocatedAmount,
    baseSalary,
    salaryType,
    salaryTypeLabel,
    calculationFormula,
    isProbationPeriod,

    // Validation
    clearAllocationErrors,
    validateCurrentAllocation,
    validateEditAllocation,

    // CRUD operations
    addAllocation,
    editAllocation,
    saveEdit,
    cancelEdit,
    deleteAllocation,
    resetCurrentAllocation,
    resetAllocations,
    
    // Edit mode operations
    loadAllocations,
    clearAllocations,

    // Grant change handlers
    onGrantChange,
    onGrantPositionChange,
    onEditGrantChange,
    onEditGrantPositionChange,

    // FTE change handlers
    onFteChange,
    onEditFteChange,

    // Display helpers
    formatCurrency,
    getCalculatedSalary,
    getAllocatedSalary,
    getSalaryTypeLabel,

    // API handlers
    buildAllocationsOnlyPayload,
    handleSaveAllocationsOnly
  };
}

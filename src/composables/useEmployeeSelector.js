import { ref, computed, nextTick } from 'vue';
import { debounce } from '@/utils/performance.js';

/**
 * Composable for employee tree select functionality
 * 
 * Handles hierarchical employee selection with search, virtual scrolling,
 * and organization grouping.
 * 
 * @param {Object} options - Configuration options
 * @param {Ref} options.employeeTreeData - Tree data from shared store
 * @param {Function} options.onSelect - Callback when employee is selected
 * @param {Function} options.onFormChange - Callback when selection changes
 * @param {number} options.visibleCount - Initial visible employee count (default: 20)
 * @param {number} options.searchDebounce - Search debounce delay in ms (default: 300)
 * @returns {Object} Employee selector interface
 * 
 * @example
 * const {
 *   showEmployeeDropdown,
 *   employeeSearchTerm,
 *   filteredEmployeeTree,
 *   selectedEmployeeDisplay,
 *   toggleEmployeeDropdown,
 *   selectEmployee
 * } = useEmployeeSelector({
 *   employeeTreeData,
 *   onSelect: (employee) => handleEmployeeSelect(employee)
 * });
 */
export function useEmployeeSelector(options = {}) {
  const {
    employeeTreeData,
    onSelect,
    onFormChange,
    visibleCount = 20,
    searchDebounce = 300
  } = options;

  // ============================================
  // STATE
  // ============================================

  /**
   * Dropdown visibility state
   */
  const showEmployeeDropdown = ref(false);

  /**
   * Search term for filtering employees
   */
  const employeeSearchTerm = ref('');

  /**
   * Filtered employee tree based on search
   */
  const filteredEmployeeTree = ref([]);

  /**
   * Display text for selected employee
   */
  const selectedEmployeeDisplay = ref('');

  /**
   * Number of visible employees per organization (virtual scrolling)
   */
  const visibleEmployeeCount = ref(visibleCount);

  /**
   * Track loaded employee count per organization
   */
  const loadedEmployeeCounts = ref(new Map());

  /**
   * Scroll debounce timer reference
   */
  const scrollDebounceTimer = ref(null);

  /**
   * Reference to search input element
   */
  const searchInputRef = ref(null);

  /**
   * Reference to dropdown body element
   */
  const dropdownBodyRef = ref(null);

  // ============================================
  // TREE INITIALIZATION
  // ============================================

  /**
   * Initialize the employee tree with all organizations expanded
   */
  const initializeEmployeeTree = () => {
    const treeData = employeeTreeData?.value ?? employeeTreeData ?? [];
    filteredEmployeeTree.value = treeData.map(organization => ({
      ...organization,
      expanded: true // Auto-expand all organizations
    }));
  };

  /**
   * Toggle dropdown visibility
   */
  const toggleEmployeeDropdown = () => {
    showEmployeeDropdown.value = !showEmployeeDropdown.value;
    
    if (showEmployeeDropdown.value) {
      initializeEmployeeTree();
      // Reset loaded counts when opening dropdown
      loadedEmployeeCounts.value.clear();
      
      nextTick(() => {
        if (searchInputRef.value) {
          searchInputRef.value.focus();
        }
      });
    }
  };

  /**
   * Close the dropdown
   */
  const closeDropdown = () => {
    showEmployeeDropdown.value = false;
    employeeSearchTerm.value = '';
  };

  // ============================================
  // VIRTUAL SCROLLING
  // ============================================

  /**
   * Get organization key for tracking loaded counts
   * 
   * @param {Array} employees - Array of employees
   * @returns {string} Organization key
   */
  const getCurrentOrganizationKey = (employees) => {
    return employees?.[0]?.organization || 'unknown';
  };

  /**
   * Get visible employees for virtual scrolling
   * 
   * @param {Array} employees - All employees in organization
   * @returns {Array} Visible subset of employees
   */
  const getVisibleEmployees = (employees) => {
    if (!employees) return [];

    const organizationKey = getCurrentOrganizationKey(employees);
    const loadedCount = loadedEmployeeCounts.value.get(organizationKey) || visibleEmployeeCount.value;

    return employees.slice(0, Math.min(loadedCount, employees.length));
  };

  /**
   * Check if organization has more employees to load
   * 
   * @param {Array} employees - All employees in organization
   * @returns {boolean} True if more employees available
   */
  const hasMoreEmployees = (employees) => {
    if (!employees) return false;

    const organizationKey = getCurrentOrganizationKey(employees);
    const loadedCount = loadedEmployeeCounts.value.get(organizationKey) || visibleEmployeeCount.value;

    return employees.length > loadedCount;
  };

  /**
   * Load more employees for an organization
   * 
   * @param {string} organizationKey - Organization identifier
   */
  const loadMoreEmployees = (organizationKey) => {
    const currentCount = loadedEmployeeCounts.value.get(organizationKey) || visibleEmployeeCount.value;
    loadedEmployeeCounts.value.set(organizationKey, currentCount + visibleEmployeeCount.value);
  };

  /**
   * Handle dropdown scroll for infinite loading
   * 
   * @param {Event} event - Scroll event
   */
  const handleDropdownScroll = (event) => {
    // Debounce scroll events for performance
    if (scrollDebounceTimer.value) {
      clearTimeout(scrollDebounceTimer.value);
    }

    scrollDebounceTimer.value = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;

      // Auto-load more when near bottom
      if (scrollHeight - scrollTop - clientHeight < 100) {
        // Find organizations that need more loading
        filteredEmployeeTree.value.forEach(organization => {
          if (organization.expanded && hasMoreEmployees(organization.children)) {
            loadMoreEmployees(organization.key);
          }
        });
      }
    }, 100);
  };

  // ============================================
  // ORGANIZATION TOGGLING
  // ============================================

  /**
   * Toggle organization expansion state
   * 
   * @param {string} organizationKey - Organization identifier
   */
  const toggleOrganization = (organizationKey) => {
    const organization = filteredEmployeeTree.value.find(s => s.key === organizationKey);
    if (organization) {
      organization.expanded = !organization.expanded;
    }
  };

  // ============================================
  // EMPLOYEE SELECTION
  // ============================================

  /**
   * Select an employee from the tree
   * 
   * @param {Object} employee - Employee object from tree
   * @returns {Object} Selected employee data
   */
  const selectEmployee = (employee) => {
    selectedEmployeeDisplay.value = employee.title;
    showEmployeeDropdown.value = false;
    employeeSearchTerm.value = '';
    
    onSelect?.(employee);
    onFormChange?.();
    
    return employee;
  };

  /**
   * Clear employee selection
   */
  const clearSelection = () => {
    selectedEmployeeDisplay.value = '';
    onFormChange?.();
  };

  /**
   * Set display text without triggering selection
   * Useful for restoring from draft
   * 
   * @param {string} displayText - Display text to set
   */
  const setDisplayText = (displayText) => {
    selectedEmployeeDisplay.value = displayText || '';
  };

  // ============================================
  // SEARCH FILTERING
  // ============================================

  /**
   * Internal filtering logic
   */
  const filterEmployeesInternal = () => {
    if (!employeeSearchTerm.value.trim()) {
      initializeEmployeeTree();
      return;
    }

    const searchTerm = employeeSearchTerm.value.toLowerCase();
    const treeData = employeeTreeData?.value ?? employeeTreeData ?? [];
    
    filteredEmployeeTree.value = treeData.map(organization => {
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
  };

  /**
   * Debounced version of filterEmployeesInternal
   */
  const debouncedFilterEmployees = debounce(filterEmployeesInternal, searchDebounce);

  /**
   * Public method that triggers debounced filtering
   */
  const filterEmployees = () => {
    debouncedFilterEmployees();
  };

  // ============================================
  // CLICK OUTSIDE HANDLING
  // ============================================

  /**
   * Handle clicks outside the dropdown to close it
   * 
   * @param {Event} event - Click event
   */
  const handleClickOutside = (event) => {
    if (showEmployeeDropdown.value) {
      const treeSelectElement = event.target.closest('.custom-tree-select');
      if (!treeSelectElement) {
        showEmployeeDropdown.value = false;
      }
    }
  };

  // ============================================
  // CLEANUP
  // ============================================

  /**
   * Cleanup timers and state
   */
  const cleanup = () => {
    if (scrollDebounceTimer.value) {
      clearTimeout(scrollDebounceTimer.value);
      scrollDebounceTimer.value = null;
    }
    loadedEmployeeCounts.value.clear();
  };

  /**
   * Reset all state
   */
  const reset = () => {
    showEmployeeDropdown.value = false;
    employeeSearchTerm.value = '';
    selectedEmployeeDisplay.value = '';
    filteredEmployeeTree.value = [];
    loadedEmployeeCounts.value.clear();
  };

  // ============================================
  // POPUP CONTAINER HELPER
  // ============================================

  /**
   * Get popup container for dropdown positioning
   * 
   * @param {Element} trigger - Trigger element
   * @returns {Element} Container element
   */
  const getPopupContainer = (trigger) => {
    return (typeof window !== 'undefined' && window.document && window.document.body)
      ? window.document.body
      : trigger.parentNode;
  };

  // ============================================
  // RETURN PUBLIC API
  // ============================================

  return {
    // State
    showEmployeeDropdown,
    employeeSearchTerm,
    filteredEmployeeTree,
    selectedEmployeeDisplay,
    visibleEmployeeCount,
    loadedEmployeeCounts,

    // Refs for template binding
    searchInputRef,
    dropdownBodyRef,

    // Tree initialization
    initializeEmployeeTree,
    toggleEmployeeDropdown,
    closeDropdown,

    // Virtual scrolling
    getVisibleEmployees,
    hasMoreEmployees,
    loadMoreEmployees,
    handleDropdownScroll,

    // Organization toggling
    toggleOrganization,

    // Employee selection
    selectEmployee,
    clearSelection,
    setDisplayText,

    // Search filtering
    filterEmployees,
    filterEmployeesInternal,

    // Click outside handling
    handleClickOutside,

    // Cleanup
    cleanup,
    reset,

    // Helpers
    getPopupContainer
  };
}

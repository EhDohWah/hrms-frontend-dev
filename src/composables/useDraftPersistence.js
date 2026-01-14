import { ref, watch } from 'vue';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import { debounce } from '@/utils/performance.js';

/**
 * Composable for form draft persistence
 * 
 * Handles auto-save, restore, and clear draft logic for the employment modal.
 * Uses the formPersistenceStore for localStorage-backed persistence.
 * 
 * @param {Object} options - Configuration options
 * @param {Ref|Reactive} options.formData - Main form data object
 * @param {Ref|Reactive} options.fundingAllocations - Funding allocations array
 * @param {Ref|Reactive} options.currentAllocation - Current allocation being edited
 * @param {Ref} options.selectedEmployeeInfo - Selected employee info
 * @param {Function} options.safeConvertToDate - Date conversion utility
 * @param {Function} options.onGrantChange - Callback when grant changes
 * @param {Function} options.onEmployeeChange - Callback when employee changes
 * @param {number} options.debounceDelay - Debounce delay for auto-save (default: 1000ms)
 * @returns {Object} Draft persistence interface
 * 
 * @example
 * const {
 *   isDraftMode,
 *   hasUnsavedChanges,
 *   restoredDataNotification,
 *   saveFormState,
 *   loadFormDraft,
 *   clearFormDraft
 * } = useDraftPersistence({
 *   formData,
 *   fundingAllocations,
 *   currentAllocation,
 *   selectedEmployeeInfo,
 *   safeConvertToDate
 * });
 */
export function useDraftPersistence(options = {}) {
  const {
    formData,
    fundingAllocations,
    currentAllocation,
    selectedEmployeeInfo,
    safeConvertToDate,
    onGrantChange,
    onEmployeeChange,
    debounceDelay = 1000
  } = options;

  // ============================================
  // STATE
  // ============================================

  /**
   * Track if component is in draft mode
   */
  const isDraftMode = ref(false);

  /**
   * Track if there are unsaved changes
   */
  const hasUnsavedChanges = ref(false);

  /**
   * Track if component is ready for persistence
   */
  const isComponentReady = ref(false);

  /**
   * Track if component is destroyed (for cleanup)
   */
  const isDestroyed = ref(false);

  /**
   * Restored data notification state
   */
  const restoredDataNotification = ref({
    show: false,
    timestamp: null
  });

  /**
   * Form draft storage key
   */
  const formDraftKey = 'employment-modal-draft';

  // ============================================
  // SAVE DRAFT
  // ============================================

  /**
   * Save form state to persistence store
   * Called on form changes with debouncing
   */
  const saveFormState = () => {
    if (isDestroyed.value || !isComponentReady.value) return;

    try {
      const formStore = useFormPersistenceStore();
      
      // Get raw form data
      const formDataValue = formData?.value ?? formData;
      const allocationsValue = fundingAllocations?.value ?? fundingAllocations ?? [];
      const currentAllocValue = currentAllocation?.value ?? currentAllocation ?? {};
      const employeeInfoValue = selectedEmployeeInfo?.value ?? selectedEmployeeInfo;

      const draftData = {
        formData: { ...formDataValue },
        fundingAllocations: [...allocationsValue],
        currentAllocation: { ...currentAllocValue },
        selectedEmployeeInfo: employeeInfoValue,
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
      hasUnsavedChanges.value = true;
      console.log('📝 Form draft saved automatically');
    } catch (error) {
      console.error('❌ Error saving form draft:', error);
    }
  };

  /**
   * Debounced version of saveFormState
   */
  const debouncedSaveState = debounce(saveFormState, debounceDelay);

  // ============================================
  // LOAD DRAFT
  // ============================================

  /**
   * Load form draft from persistence store
   * 
   * @returns {boolean} True if draft was loaded, false otherwise
   */
  const loadFormDraft = () => {
    try {
      const formStore = useFormPersistenceStore();
      const savedData = formStore.checkForSavedData('employment');

      if (savedData.hasSavedData) {
        const parsed = savedData.data.employmentForm;

        // Check if draft is not too old (24 hours)
        const isRecent = (Date.now() - parsed.timestamp) < (24 * 60 * 60 * 1000);

        if (isRecent && parsed.formData) {
          console.log('📄 Loading saved form draft');

          // Restore form data
          const formDataTarget = formData?.value ?? formData;
          Object.assign(formDataTarget, parsed.formData);

          // Restore funding allocations
          const allocationsTarget = fundingAllocations?.value ?? fundingAllocations;
          if (Array.isArray(allocationsTarget)) {
            allocationsTarget.length = 0;
            allocationsTarget.push(...(parsed.fundingAllocations || []));
          }

          // Restore current allocation
          const currentAllocTarget = currentAllocation?.value ?? currentAllocation;
          if (currentAllocTarget && parsed.currentAllocation) {
            Object.assign(currentAllocTarget, parsed.currentAllocation);
          }

          // Restore selected employee info
          if (selectedEmployeeInfo) {
            if ('value' in selectedEmployeeInfo) {
              selectedEmployeeInfo.value = parsed.selectedEmployeeInfo;
            }
          }

          // Convert date strings back to Date objects
          if (safeConvertToDate) {
            if (formDataTarget.start_date) {
              formDataTarget.start_date = safeConvertToDate(formDataTarget.start_date);
            }
            if (formDataTarget.end_date) {
              formDataTarget.end_date = safeConvertToDate(formDataTarget.end_date);
            }
            if (formDataTarget.pass_probation_date) {
              formDataTarget.pass_probation_date = safeConvertToDate(formDataTarget.pass_probation_date);
            }
          }

          // Restore related dropdowns if needed
          if (formDataTarget.employee_id && onEmployeeChange) {
            onEmployeeChange();
          }
          if (currentAllocTarget?.grant_id && onGrantChange) {
            onGrantChange();
          }

          hasUnsavedChanges.value = true;
          restoredDataNotification.value.show = true;
          restoredDataNotification.value.timestamp = parsed.timestamp;
          return true;
        } else {
          // Clean up old draft
          clearFormDraft();
        }
      }
    } catch (error) {
      console.error('❌ Error loading form draft:', error);
      clearFormDraft();
    }
    return false;
  };

  // ============================================
  // CLEAR DRAFT
  // ============================================

  /**
   * Clear form draft from persistence store
   */
  const clearFormDraft = () => {
    try {
      const formStore = useFormPersistenceStore();
      formStore.clearFormSection('employment', 'employmentForm');
      hasUnsavedChanges.value = false;
      restoredDataNotification.value.show = false;
      restoredDataNotification.value.timestamp = null;
      console.log('🗑️ Form draft cleared');
    } catch (error) {
      console.error('❌ Error clearing form draft:', error);
    }
  };

  // ============================================
  // TIME DISPLAY UTILITIES
  // ============================================

  /**
   * Get human-readable time ago
   * 
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Human-readable time string
   */
  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
  };

  /**
   * Format restored time for display
   * 
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted time string
   */
  const formatRestoredTime = (timestamp) => {
    if (!timestamp) return 'earlier';
    return getTimeAgo(timestamp);
  };

  // ============================================
  // LIFECYCLE HELPERS
  // ============================================

  /**
   * Initialize the composable (call in mounted/created)
   */
  const initialize = () => {
    isComponentReady.value = true;
    isDestroyed.value = false;
  };

  /**
   * Cleanup the composable (call in beforeUnmount)
   */
  const cleanup = () => {
    isDestroyed.value = true;
    isComponentReady.value = false;
  };

  /**
   * Mark form as saved (no unsaved changes)
   */
  const markAsSaved = () => {
    hasUnsavedChanges.value = false;
    isDraftMode.value = false;
  };

  /**
   * Enable draft mode
   */
  const enableDraftMode = () => {
    isDraftMode.value = true;
  };

  /**
   * Dismiss restored data notification
   */
  const dismissRestoredNotification = () => {
    restoredDataNotification.value.show = false;
  };

  // ============================================
  // RETURN PUBLIC API
  // ============================================

  return {
    // State
    isDraftMode,
    hasUnsavedChanges,
    isComponentReady,
    restoredDataNotification,
    formDraftKey,

    // Methods
    saveFormState,
    debouncedSaveState,
    loadFormDraft,
    clearFormDraft,

    // Time utilities
    getTimeAgo,
    formatRestoredTime,

    // Lifecycle
    initialize,
    cleanup,
    markAsSaved,
    enableDraftMode,
    dismissRestoredNotification
  };
}

import { ref, nextTick, createVNode } from 'vue';
import { Modal } from 'bootstrap';
import { Modal as AntModal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

/**
 * Composable for modal lifecycle management
 * 
 * Handles Bootstrap Modal integration, open/close operations,
 * unsaved changes confirmation, and cleanup.
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.modalId - DOM element ID for the modal (default: 'employmentModal')
 * @param {Function} options.onBeforeOpen - Callback before modal opens
 * @param {Function} options.onAfterOpen - Callback after modal opens
 * @param {Function} options.onBeforeClose - Callback before modal closes
 * @param {Function} options.onAfterClose - Callback after modal closes
 * @param {Function} options.hasUnsavedChanges - Function that returns true if there are unsaved changes
 * @param {Function} options.onDiscardChanges - Callback when user discards changes
 * @param {Object} options.cleanup - PerformanceCleanup instance for tracking listeners
 * @returns {Object} Modal lifecycle interface
 * 
 * @example
 * const {
 *   isModalVisible,
 *   openModal,
 *   handleModalClose,
 *   safeHideModal
 * } = useModalLifecycle({
 *   modalId: 'employmentModal',
 *   hasUnsavedChanges: () => hasUnsavedChanges.value && isDraftMode.value,
 *   onDiscardChanges: () => resetForm()
 * });
 */
export function useModalLifecycle(options = {}) {
  const {
    modalId = 'employmentModal',
    onBeforeOpen,
    onAfterOpen,
    onBeforeClose,
    onAfterClose,
    hasUnsavedChanges,
    onDiscardChanges,
    cleanup: cleanupManager
  } = options;

  // ============================================
  // STATE
  // ============================================

  /**
   * Modal visibility state (for controlling DatePicker rendering)
   */
  const isModalVisible = ref(false);

  /**
   * Bootstrap Modal instance reference
   */
  const modalInstance = ref(null);

  /**
   * Track if component is destroyed
   */
  const isDestroyed = ref(false);

  /**
   * Track if component is ready
   */
  const isComponentReady = ref(false);

  // ============================================
  // INITIALIZATION
  // ============================================

  /**
   * Initialize the Bootstrap modal
   * Call this in mounted()
   * 
   * @param {Object} modalOptions - Bootstrap Modal options
   * @returns {Modal|null} Modal instance or null
   */
  const initializeModal = (modalOptions = {}) => {
    const modalElement = document.getElementById(modalId);
    
    if (!modalElement) {
      console.warn(`Modal element with id "${modalId}" not found`);
      return null;
    }

    const defaultOptions = {
      backdrop: 'static',
      keyboard: false
    };

    modalInstance.value = new Modal(modalElement, {
      ...defaultOptions,
      ...modalOptions
    });

    // Setup event listeners
    const hideHandler = (event) => {
      const shouldBlock = hasUnsavedChanges?.();
      if (shouldBlock) {
        event.preventDefault();
        handleModalClose();
      }
    };

    const hiddenHandler = () => {
      isModalVisible.value = false;
      cleanupModalBackdrops();
      onAfterClose?.();
    };

    // Track listeners for cleanup
    if (cleanupManager) {
      cleanupManager.addListener(modalElement, 'hide.bs.modal', hideHandler);
      cleanupManager.addListener(modalElement, 'hidden.bs.modal', hiddenHandler);
    } else {
      modalElement.addEventListener('hide.bs.modal', hideHandler);
      modalElement.addEventListener('hidden.bs.modal', hiddenHandler);
    }

    isComponentReady.value = true;
    return modalInstance.value;
  };

  // ============================================
  // OPEN MODAL
  // ============================================

  /**
   * Open the modal
   * 
   * @returns {Promise<void>}
   */
  const openModal = async () => {
    if (isDestroyed.value) return;

    // Set visibility before loading data
    isModalVisible.value = true;

    // Execute before open callback
    await onBeforeOpen?.();

    // Show the modal
    if (modalInstance.value) {
      modalInstance.value.show();
    } else {
      // Try to initialize if not done
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        modalInstance.value = new Modal(modalElement);
        modalInstance.value.show();
      }
    }

    // Execute after open callback
    await onAfterOpen?.();
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  /**
   * Handle modal close with unsaved changes check
   */
  const handleModalClose = async () => {
    if (isDestroyed.value || !isComponentReady.value) return;

    const hasUnsaved = hasUnsavedChanges?.();

    if (hasUnsaved) {
      showUnsavedChangesConfirm();
    } else {
      await safeHideModal();
    }
  };

  /**
   * Show Ant Design confirm dialog for unsaved changes
   */
  const showUnsavedChangesConfirm = () => {
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
        discardChangesAndClose();
        return Promise.resolve();
      }
    });
  };

  /**
   * Discard changes and close modal
   */
  const discardChangesAndClose = async () => {
    if (isDestroyed.value) return;

    try {
      // Execute discard callback
      onDiscardChanges?.();

      // Close the modal
      await safeHideModal();

      console.log('✅ Discarded changes and closed modal');
    } catch (error) {
      console.error('❌ Error discarding changes:', error);
    }
  };

  /**
   * Safely hide the modal
   * 
   * @returns {Promise<boolean>} True if hidden successfully
   */
  const safeHideModal = () => {
    return new Promise((resolve) => {
      if (isDestroyed.value) {
        resolve(true);
        return;
      }

      // Execute before close callback
      onBeforeClose?.();

      nextTick(() => {
        if (isDestroyed.value) {
          resolve(true);
          return;
        }

        if (modalInstance.value) {
          try {
            const modalEl = document.getElementById(modalId);
            if (modalEl) {
              modalEl.addEventListener('hidden.bs.modal', () => {
                cleanupModalBackdrops();
                resolve(true);
              }, { once: true });

              modalInstance.value.hide();
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
  };

  // ============================================
  // BACKDROP CLEANUP
  // ============================================

  /**
   * Clean up stray modal backdrops
   * Handles cases where backdrops are left behind
   */
  const cleanupModalBackdrops = () => {
    if (isDestroyed.value) return;

    nextTick(() => {
      if (isDestroyed.value) return;

      const backdrops = document.querySelectorAll('.modal-backdrop');
      const activeModals = document.querySelectorAll('.modal.show');

      if (activeModals.length === 0 && backdrops.length > 0) {
        backdrops.forEach(backdrop => backdrop.remove());
      }
    });
  };

  // ============================================
  // LIFECYCLE MANAGEMENT
  // ============================================

  /**
   * Mark component as destroyed
   * Call this in beforeUnmount()
   */
  const destroy = () => {
    isDestroyed.value = true;
    isComponentReady.value = false;

    // Dispose modal instance
    if (modalInstance.value && typeof modalInstance.value.dispose === 'function') {
      try {
        modalInstance.value.dispose();
      } catch (error) {
        console.error('Error disposing modal:', error);
      }
    }

    // Cleanup backdrops
    cleanupModalBackdrops();
  };

  /**
   * Force close modal (for programmatic closing)
   */
  const forceClose = () => {
    if (modalInstance.value) {
      try {
        modalInstance.value.hide();
      } catch (error) {
        console.error('Error force closing modal:', error);
      }
    }
    isModalVisible.value = false;
    cleanupModalBackdrops();
  };

  // ============================================
  // RETURN PUBLIC API
  // ============================================

  return {
    // State
    isModalVisible,
    modalInstance,
    isDestroyed,
    isComponentReady,

    // Initialization
    initializeModal,

    // Open/Close
    openModal,
    handleModalClose,
    safeHideModal,
    forceClose,

    // Unsaved changes
    showUnsavedChangesConfirm,
    discardChangesAndClose,

    // Cleanup
    cleanupModalBackdrops,
    destroy
  };
}

/**
 * Helper for migrating vue-select to a-select
 * Provides common patterns and utilities for Ant Design Vue Select component
 */
export function useSelectMigration() {
  // Filter function for searchable selects
  const filterOption = (input, option) => {
    if (!input || !option) return true
    const label = option.label || option.value || ''
    return label.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  // Get popup container for modals
  const getModalPopupContainer = (trigger) => {
    return trigger.closest('.modal-content') || trigger.parentNode
  }

  // Get popup container for regular pages
  const getPagePopupContainer = (trigger) => {
    return trigger.parentNode
  }

  return {
    filterOption,
    getModalPopupContainer,
    getPagePopupContainer
  }
}

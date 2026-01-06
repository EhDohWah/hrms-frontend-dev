/**
 * Lazy-loaded Components Plugin
 * 
 * This plugin registers heavy components as async components to reduce
 * initial bundle size and memory usage.
 * 
 * Components are only loaded when first used, improving initial load time.
 * 
 * @module plugins/lazy-components
 */

import { defineAsyncComponent } from 'vue';

/**
 * Loading component shown while async component is loading
 */
const LoadingComponent = {
  template: `
    <div class="lazy-loading-placeholder d-flex align-items-center justify-content-center" style="min-height: 100px;">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `
};

/**
 * Error component shown if async component fails to load
 */
const ErrorComponent = {
  template: `
    <div class="lazy-loading-error alert alert-warning" role="alert">
      <i class="ti ti-alert-circle me-2"></i>
      Failed to load component. Please refresh the page.
    </div>
  `
};

/**
 * Create an async component with loading and error states
 * @param {Function} loader - Import function for the component
 * @returns {Object} Async component definition
 */
function createAsyncComponent(loader) {
  return defineAsyncComponent({
    loader,
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent,
    delay: 200, // Show loading after 200ms
    timeout: 30000, // Timeout after 30 seconds
  });
}

/**
 * Modal components - loaded on demand when modal is opened
 */
export const lazyModals = {
  'job-offers-modal': () => import('@/components/modal/job-offers-modal.vue'),
  'interview-modal': () => import('@/components/modal/interview-modal.vue'),
  'employee-list-modal': () => import('@/components/modal/employee-list-modal.vue'),
  'employee-details-modal': () => import('@/components/modal/employee-details-modal.vue'),
  'grant-modal': () => import('@/components/modal/grant-modal.vue'),
  'grant-upload-modal': () => import('@/components/modal/grant-upload-modal.vue'),
  'grant-modal-update': () => import('@/components/modal/grant-modal-update.vue'),
  'grant-position-modal': () => import('@/components/modal/grant-position-modal.vue'),
  'grant-allocate-employee-modal': () => import('@/components/modal/grant-allocate-employee-modal.vue'),
  'leaves-admin-modal': () => import('@/components/modal/leaves-admin-modal.vue'),
  'leaves-employee-modal': () => import('@/components/modal/leaves-employee-modal.vue'),
  'leave-settings-modal': () => import('@/components/modal/leave-settings-modal.vue'),
  'leave-type-modal': () => import('@/components/modal/leave-type-modal.vue'),
  'user-list-modal': () => import('@/components/modal/user-list-modal.vue'),
  'user-permission-modal': () => import('@/components/modal/user-permission-modal.vue'),
  'employee-upload-modal': () => import('@/components/modal/employee-upload-modal.vue'),
  'employee-training-modal': () => import('@/components/modal/employee-training-modal.vue'),
  'employee-salary-modal': () => import('@/components/modal/employee-salary-modal.vue'),
  'travel-employee-modal': () => import('@/components/modal/travel-employee-modal.vue'),
  'attendence-admin-modal': () => import('@/components/modal/attendance-admin-modal.vue'),
  'attendance-employee-modal': () => import('@/components/modal/attendance-employee-modal.vue'),
  'timesheets-modal': () => import('@/components/modal/timesheets-modal.vue'),
  'holidays-modal': () => import('@/components/modal/holidays-modal.vue'),
  'training-modal': () => import('@/components/modal/training-modal.vue'),
  'trainers-modal': () => import('@/components/modal/trainers-modal.vue'),
  'training-type-modal': () => import('@/components/modal/training-type-modal.vue'),
  'payroll-deduction-modal': () => import('@/components/modal/payroll-deduction-modal.vue'),
  'payroll-overtime-modal': () => import('@/components/modal/payroll-overtime-modal.vue'),
  'roles-modal': () => import('@/components/modal/roles-modal.vue'),
  'company-details-modal': () => import('@/components/modal/company-details-modal.vue'),
  'custom-fields-modal': () => import('@/components/modal/custom-fields-modal.vue'),
  'tax-settings-modal': () => import('@/components/modal/tax-settings-modal.vue'),
  'policy-modal': () => import('@/components/modal/policy-modal.vue'),
  'admin-dashboard-modal': () => import('@/components/modal/admin-dashboard-modal.vue'),
  'employee-dashboard-modal': () => import('@/components/modal/employee-dashboard-modal.vue'),
};

/**
 * Table components - loaded when page containing them is accessed
 */
export const lazyTables = {
  'trining-table': () => import('@/views/pages/hrm/attendance/training/training-table.vue'),
  'trainers-table': () => import('@/views/pages/hrm/attendance/training/trainers-table.vue'),
  'training-type-table': () => import('@/views/pages/hrm/attendance/training/training-type-table.vue'),
  'promotion-table': () => import('@/views/pages/hrm/promotion/promotion-table.vue'),
  'resignation-table': () => import('@/views/pages/hrm/resignation/resignation-table.vue'),
  'termination-table': () => import('@/views/pages/hrm/termination/termination-table.vue'),
  'job-table': () => import('@/views/pages/recruitment/jobs/job-table.vue'),
  'candidates-table': () => import('@/views/pages/recruitment/candidates/candidates-table.vue'),
  'candidates-board': () => import('@/views/pages/recruitment/candidates/candidates-board.vue'),
  'refferals-table': () => import('@/views/pages/recruitment/refferals/refferals-table.vue'),
  'payslip-report-table': () => import('@/views/pages/administration/reports/payslip-report-table.vue'),
  'attendance-report-table': () => import('@/views/pages/administration/reports/attendance-report-table.vue'),
};

/**
 * Page components - loaded on demand
 */
export const lazyPages = {
  'job-offers-list': () => import('@/views/pages/recruitment/job-offers/job-offers-list.vue'),
  'report-list': () => import('@/views/pages/administration/reports/report-list.vue'),
  'employment-list': () => import('@/views/pages/hrm/employment/employment-list.vue'),
  'recycle-bin-list': () => import('@/views/pages/administration/recycle-bin/recycle-bin-list.vue'),
  'interviews-list': () => import('@/views/pages/recruitment/interviews/interviews-list.vue'),
  'interviews-details': () => import('@/views/pages/recruitment/interviews/interviews-details.vue'),
  'grant-position-list': () => import('@/views/pages/grant/grant-position-list.vue'),
  'department-position-list': () => import('@/views/pages/administration/department-position/department-position-list.vue'),
  'lookup-list': () => import('@/views/pages/administration/lookups/lookup-list.vue'),
  'travel-request-list': () => import('@/views/pages/requests/travel/travel-list.vue'),
  'travel-request-details': () => import('@/views/pages/requests/travel/travel-details.vue'),
  'employee-training-list': () => import('@/views/pages/hrm/attendance/training/employee-training-list.vue'),
  'hr-manager-dashboard': () => import('@/views/pages/dashboard/hr-manager-dashboard/hr-manager-dashboard.vue'),
  'hr-assistant-dashboard': () => import('@/views/pages/dashboard/hr-assistant-dashboard/hr-assistant-dashboard.vue'),
};

/**
 * Dashboard widget components
 */
export const lazyWidgets = {
  'employee-status': () => import('@/views/pages/dashboard/admin-dashboard/employee-status.vue'),
  'welcome-wrap': () => import('@/views/pages/dashboard/admin-dashboard/welcome-wrap.vue'),
  'welcome-hr-manager': () => import('@/views/pages/dashboard/hr-manager-dashboard/welcome-hr-manager.vue'),
  'welcome-hr-assistant': () => import('@/views/pages/dashboard/hr-assistant-dashboard/welcome-hr-assistant.vue'),
};

/**
 * Report components
 */
export const lazyReports = {
  'interview-report': () => import('@/components/reports/interview-report.vue'),
  'job-offer-report': () => import('@/components/reports/joboffer-report.vue'),
  'report-row': () => import('@/components/reports/report-row.vue'),
  'grant-headcount-report': () => import('@/components/reports/grant-headcount-report.vue'),
};

/**
 * Register all lazy-loaded components on the Vue app
 * @param {Object} app - Vue app instance
 */
export function registerLazyComponents(app) {
  // Register all component groups
  const allComponents = {
    ...lazyModals,
    ...lazyTables,
    ...lazyPages,
    ...lazyWidgets,
    ...lazyReports,
  };

  Object.entries(allComponents).forEach(([name, loader]) => {
    app.component(name, createAsyncComponent(loader));
  });

  console.log(`[LazyComponents] Registered ${Object.keys(allComponents).length} lazy-loaded components`);
}

export default {
  install(app) {
    registerLazyComponents(app);
  }
};


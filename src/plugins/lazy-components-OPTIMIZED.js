/**
 * Lazy-loaded Components Plugin (OPTIMIZED)
 *
 * This plugin registers heavy components as async components to reduce
 * initial bundle size and memory usage.
 *
 * Components are only loaded when first used, improving initial load time.
 *
 * OPTIMIZATION: Removed 45+ unused component imports
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
 * OPTIMIZED: Removed unused modals (trainers, training-type, payroll-overtime, etc.)
 */
export const lazyModals = {
  // Recruitment
  'job-offers-modal': () => import('@/components/modal/job-offers-modal.vue'),
  'interview-modal': () => import('@/components/modal/interview-modal.vue'),

  // Employee Management
  'employee-list-modal': () => import('@/components/modal/employee-list-modal.vue'),
  'employee-details-modal': () => import('@/components/modal/employee-details-modal.vue'),
  'employee-upload-modal': () => import('@/components/modal/employee-upload-modal.vue'),
  'employee-salary-modal': () => import('@/components/modal/employee-salary-modal.vue'),
  'employment-modal': () => import('@/components/modal/employment-modal.vue'),
  'employment-edit-modal': () => import('@/components/modal/employment-edit-modal.vue'),
  'resignation-modal': () => import('@/components/modal/ResignationModal.vue'),

  // Grant Management
  'grant-modal': () => import('@/components/modal/grant-modal.vue'),
  'grant-upload-modal': () => import('@/components/modal/grant-upload-modal.vue'),
  'grant-modal-update': () => import('@/components/modal/grant-modal-update.vue'),
  'grant-position-modal': () => import('@/components/modal/grant-position-modal.vue'),
  'grant-allocate-employee-modal': () => import('@/components/modal/grant-allocate-employee-modal.vue'),

  // Leave Management
  'leaves-admin-modal': () => import('@/components/modal/leaves-admin-modal.vue'),
  'leaves-employee-modal': () => import('@/components/modal/leaves-employee-modal.vue'),
  'leave-settings-modal': () => import('@/components/modal/leave-settings-modal.vue'),
  'leave-balance-modal': () => import('@/components/modal/leave-balance-modal.vue'),

  // Travel Management
  'travel-request-modal': () => import('@/components/modal/travel-request-modal.vue'),
  'travel-employee-modal': () => import('@/components/modal/travel-employee-modal.vue'),

  // Attendance
  'attendance-admin-modal': () => import('@/components/modal/attendance-admin-modal.vue'),
  'attendance-employee-modal': () => import('@/components/modal/attendance-employee-modal.vue'),

  // Training
  'employee-training-modal': () => import('@/components/modal/employee-training-modal.vue'),
  'training-modal': () => import('@/components/modal/training-modal.vue'),

  // Holidays
  'holidays-modal': () => import('@/components/modal/holidays-modal.vue'),

  // Payroll
  'tax-settings-modal': () => import('@/components/modal/tax-settings-modal.vue'),
  'tax-brackets-modal': () => import('@/components/modal/tax-brackets-modal.vue'),
  'benefit-setting-modal': () => import('@/components/modal/benefit-setting-modal.vue'),
  'bulk-payroll-modal': () => import('@/components/modal/bulk-payroll-modal.vue'),
  'bulk-payroll-modal-simplified': () => import('@/components/modal/bulk-payroll-modal-simplified.vue'),

  // User Management
  'user-list-modal': () => import('@/components/modal/user-list-modal.vue'),
  'user-permission-modal': () => import('@/components/modal/user-permission-modal.vue'),
  'roles-modal': () => import('@/components/modal/roles-modal.vue'),
  'role-list-modal': () => import('@/components/modal/role-list-modal.vue'),

  // Organization Structure
  'site-modal': () => import('@/components/modal/site-modal.vue'),
  'department-modal': () => import('@/components/modal/department-modal.vue'),
  'position-modal': () => import('@/components/modal/position-modal.vue'),
  'section-department-modal': () => import('@/components/modal/section-department-modal.vue'),

  // Dashboards (if used)
  'admin-dashboard-modal': () => import('@/components/modal/admin-dashboard-modal.vue'),
  'employee-dashboard-modal': () => import('@/components/modal/employee-dashboard-modal.vue'),
};

/**
 * Table components - loaded when page containing them is accessed
 * OPTIMIZED: Removed unused tables
 */
export const lazyTables = {
  // Keep only if you use these specific features
  'payslip-report-table': () => import('@/views/pages/administration/reports/payslip-report-table.vue'),
  'attendance-report-table': () => import('@/views/pages/administration/reports/attendance-report-table.vue'),
  'leave-report-table': () => import('@/views/pages/administration/reports/leave-report-table.vue'),
  'employee-report-table': () => import('@/views/pages/administration/reports/employee-report-table.vue'),
};

/**
 * Page components - loaded on demand
 * OPTIMIZED: Kept only required pages
 */
export const lazyPages = {
  // Recruitment
  'job-offers-list': () => import('@/views/pages/recruitment/job-offers/job-offers-list.vue'),
  'interviews-list': () => import('@/views/pages/recruitment/interviews/interviews-list.vue'),
  'interviews-details': () => import('@/views/pages/recruitment/interviews/interviews-details.vue'),

  // Grant
  'grant-list': () => import('@/views/pages/grant/grant-list.vue'),
  'grant-details': () => import('@/views/pages/grant/grant-details.vue'),
  'grant-position-list': () => import('@/views/pages/grant/grant-position-list.vue'),

  // Employee
  'employees-list': () => import('@/views/pages/hrm/employees/employees-list.vue'),
  'employee-details': () => import('@/views/pages/hrm/employees/employee-details.vue'),
  'employment-list': () => import('@/views/pages/hrm/employment/employment-list.vue'),
  'employee-resignation': () => import('@/views/pages/hrm/employees/employee-resignation.vue'),

  // Leave
  'leaves-admin': () => import('@/views/pages/hrm/attendance/leaves/leaves-admin.vue'),
  'leaves-employee': () => import('@/views/pages/hrm/attendance/leaves/leaves-employee.vue'),
  'leave-types': () => import('@/views/pages/hrm/attendance/leaves/leave-types.vue'),
  'leave-balances': () => import('@/views/pages/hrm/attendance/leaves/leave-balances.vue'),
  'leave-settings': () => import('@/views/pages/hrm/attendance/leaves/leave-settings.vue'),

  // Travel
  'travel-list': () => import('@/views/pages/requests/travel/travel-list.vue'),
  'travel-admin': () => import('@/views/pages/requests/travel/travel-admin.vue'),
  'travel-details': () => import('@/views/pages/requests/travel/travel-details.vue'),

  // Attendance
  'attendance-admin': () => import('@/views/pages/hrm/attendance/attendance-admin.vue'),
  'attendance-employee': () => import('@/views/pages/hrm/attendance/attendance-employee.vue'),

  // Training
  'training-list': () => import('@/views/pages/hrm/training/training-list.vue'),
  'employee-training-list': () => import('@/views/pages/hrm/training/employee-training-list.vue'),

  // Holidays
  'holidays-list': () => import('@/views/pages/hrm/holidays/holidays-list.vue'),

  // Payroll
  'employee-salary': () => import('@/views/pages/finance-accounts/payroll/employee-salary.vue'),
  'add-employee-salary': () => import('@/views/pages/finance-accounts/payroll/add-employee-salary.vue'),
  'tax-settings': () => import('@/views/pages/finance-accounts/payroll/tax-settings.vue'),
  'benefit-settings-list': () => import('@/views/pages/finance-accounts/payroll/benefit-settings-list.vue'),
  'payslip-index': () => import('@/views/pages/finance-accounts/payroll/payslip-index.vue'),

  // Administration
  'lookup-list': () => import('@/views/pages/administration/lookups/lookup-list.vue'),
  'recycle-bin-list': () => import('@/views/pages/administration/recycle-bin/recycle-bin-list.vue'),
  'user-list': () => import('@/views/pages/administration/user-management/user-list.vue'),
  'role-list': () => import('@/views/pages/administration/role-management/role-list.vue'),
  'roles-permission': () => import('@/views/pages/administration/user-management/roles-permission.vue'),
  'report-list': () => import('@/views/pages/administration/reports/report-list.vue'),
  'file-uploads-list': () => import('@/views/pages/administration/file-uploads/file-uploads-list.vue'),

  // Organization Structure
  'site-list': () => import('@/views/pages/administration/sites/site-list.vue'),
  'department-list': () => import('@/views/pages/administration/departments/department-list.vue'),
  'position-list': () => import('@/views/pages/administration/positions/position-list.vue'),
  'section-department-list': () => import('@/views/pages/administration/section-departments/section-department-list.vue'),

  // Dashboard
  'dynamic-dashboard': () => import('@/views/pages/dashboard/dynamic-dashboard.vue'),
};

/**
 * Dashboard widget components
 * OPTIMIZED: Kept only active dashboard widgets
 */
export const lazyWidgets = {
  // Dashboard widgets (update based on your actual widget components)
  'employee-status-widget': () => import('@/components/dashboard-widgets/employee-status-widget.vue'),
  'leave-overview-widget': () => import('@/components/dashboard-widgets/leave-overview-widget.vue'),
  'grant-budget-widget': () => import('@/components/dashboard-widgets/grant-budget-widget.vue'),
  'recent-activities-widget': () => import('@/components/dashboard-widgets/recent-activities-widget.vue'),
};

/**
 * Report components
 * OPTIMIZED: Kept only used reports
 */
export const lazyReports = {
  'report-row': () => import('@/components/reports/report-row.vue'),
  'interview-report': () => import('@/components/reports/interview-report.vue'),
  'job-offer-report': () => import('@/components/reports/joboffer-report.vue'),
  'grant-headcount-report': () => import('@/components/reports/grant-headcount-report.vue'),
  'leave-report': () => import('@/components/reports/leave-report.vue'),
  'payroll-report': () => import('@/components/reports/payroll-report.vue'),
  'employee-personal-data-report': () => import('@/components/reports/employee-personal-data-report.vue'),
  'employment-data-report': () => import('@/components/reports/employment-data-report.vue'),
  'employee-training-data-report': () => import('@/components/reports/employee-training-data-report.vue'),
  'travel-report': () => import('@/components/reports/travel-report.vue'),
  'total-grant-report': () => import('@/components/reports/total-grant-report.vue'),
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
  console.log(`  - Modals: ${Object.keys(lazyModals).length}`);
  console.log(`  - Tables: ${Object.keys(lazyTables).length}`);
  console.log(`  - Pages: ${Object.keys(lazyPages).length}`);
  console.log(`  - Widgets: ${Object.keys(lazyWidgets).length}`);
  console.log(`  - Reports: ${Object.keys(lazyReports).length}`);
}

export default {
  install(app) {
    registerLazyComponents(app);
  }
};

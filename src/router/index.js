import { createRouter, createWebHistory } from 'vue-router';
import { authGuard, roleGuard, permissionGuard } from './guards';
import LoginIndex from '@/views/pages/authentication/login-index.vue';

// Route component mapping - explicit imports for Vite static analysis
// Vite cannot handle dynamic imports with variables containing multiple path segments
// This mapping contains ALL multi-level route paths (162 routes)
const routeComponents = {
  'pages/administration/department-position/department-position-list': () => import('@/views/pages/administration/department-position/department-position-list.vue'),
  'pages/administration/departments/department-list': () => import('@/views/pages/administration/departments/department-list.vue'),
  'pages/administration/file-uploads/file-uploads-list': () => import('@/views/pages/administration/file-uploads/file-uploads-list.vue'),
  'pages/administration/lookups/lookup-list': () => import('@/views/pages/administration/lookups/lookup-list.vue'),
  'pages/administration/positions/position-list': () => import('@/views/pages/administration/positions/position-list.vue'),
  'pages/administration/recycle-bin/recycle-bin': () => import('@/views/pages/administration/recycle-bin/recycle-bin.vue'),
  'pages/administration/recycle-bin/recycle-bin-list': () => import('@/views/pages/administration/recycle-bin/recycle-bin-list.vue'),
  'pages/administration/reports/attendance-report': () => import('@/views/pages/administration/reports/attendance-report.vue'),
  'pages/administration/reports/daily-report': () => import('@/views/pages/administration/reports/daily-report.vue'),
  'pages/administration/reports/employee-report': () => import('@/views/pages/administration/reports/employee-report.vue'),
  'pages/administration/reports/expenses-report': () => import('@/views/pages/administration/reports/expenses-report.vue'),
  'pages/administration/reports/invoice-report': () => import('@/views/pages/administration/reports/invoice-report.vue'),
  'pages/administration/reports/leave-report': () => import('@/views/pages/administration/reports/leave-report.vue'),
  'pages/administration/reports/payment-report': () => import('@/views/pages/administration/reports/payment-report.vue'),
  'pages/administration/reports/payslip-report': () => import('@/views/pages/administration/reports/payslip-report.vue'),
  'pages/administration/reports/project-report': () => import('@/views/pages/administration/reports/project-report.vue'),
  'pages/administration/reports/report-list': () => import('@/views/pages/administration/reports/report-list.vue'),
  'pages/administration/reports/reports-index': () => import('@/views/pages/administration/reports/reports-index.vue'),
  'pages/administration/reports/task-report': () => import('@/views/pages/administration/reports/task-report.vue'),
  'pages/administration/reports/user-report': () => import('@/views/pages/administration/reports/user-report.vue'),
  'pages/administration/role-management/role-list': () => import('@/views/pages/administration/role-management/role-list.vue'),
  'pages/administration/section-departments/section-department-list': () => import('@/views/pages/administration/section-departments/section-department-list.vue'),
  'pages/administration/settings/app-settings/approval-settings': () => import('@/views/pages/administration/settings/app-settings/approval-settings.vue'),
  'pages/administration/settings/app-settings/app-settings': () => import('@/views/pages/administration/settings/app-settings/app-settings.vue'),
  'pages/administration/settings/app-settings/custom-fields': () => import('@/views/pages/administration/settings/app-settings/custom-fields.vue'),
  'pages/administration/settings/app-settings/invoice-settings': () => import('@/views/pages/administration/settings/app-settings/invoice-settings.vue'),
  'pages/administration/settings/app-settings/leave-type': () => import('@/views/pages/administration/settings/app-settings/leave-type.vue'),
  'pages/administration/settings/app-settings/salary-settings': () => import('@/views/pages/administration/settings/app-settings/salary-settings.vue'),
  'pages/administration/settings/financial-settings/currencies-settings': () => import('@/views/pages/administration/settings/financial-settings/currencies-settings.vue'),
  'pages/administration/settings/financial-settings/financial-settings': () => import('@/views/pages/administration/settings/financial-settings/financial-settings.vue'),
  'pages/administration/settings/financial-settings/payment-gateway': () => import('@/views/pages/administration/settings/financial-settings/payment-gateway.vue'),
  'pages/administration/settings/financial-settings/tax-rates': () => import('@/views/pages/administration/settings/financial-settings/tax-rates.vue'),
  'pages/administration/settings/general-settings/connected-apps': () => import('@/views/pages/administration/settings/general-settings/connected-apps.vue'),
  'pages/administration/settings/general-settings/general-settings': () => import('@/views/pages/administration/settings/general-settings/general-settings.vue'),
  'pages/administration/settings/general-settings/notification-settings': () => import('@/views/pages/administration/settings/general-settings/notification-settings.vue'),
  'pages/administration/settings/general-settings/profile-settings': () => import('@/views/pages/administration/settings/general-settings/profile-settings.vue'),
  'pages/administration/settings/general-settings/security-settings': () => import('@/views/pages/administration/settings/general-settings/security-settings.vue'),
  'pages/administration/settings/others-settings/backup-settings': () => import('@/views/pages/administration/settings/others-settings/backup-settings.vue'),
  'pages/administration/settings/others-settings/ban-ip-address': () => import('@/views/pages/administration/settings/others-settings/ban-ip-address.vue'),
  'pages/administration/settings/others-settings/clear-cache': () => import('@/views/pages/administration/settings/others-settings/clear-cache.vue'),
  'pages/administration/settings/others-settings/cronjob-schedule': () => import('@/views/pages/administration/settings/others-settings/cronjob-schedule.vue'),
  'pages/administration/settings/others-settings/cronjob-settings': () => import('@/views/pages/administration/settings/others-settings/cronjob-settings.vue'),
  'pages/administration/settings/others-settings/custom-css': () => import('@/views/pages/administration/settings/others-settings/custom-css.vue'),
  'pages/administration/settings/others-settings/custom-js': () => import('@/views/pages/administration/settings/others-settings/custom-js.vue'),
  'pages/administration/settings/others-settings/others-settings': () => import('@/views/pages/administration/settings/others-settings/others-settings.vue'),
  'pages/administration/settings/others-settings/storage-setings': () => import('@/views/pages/administration/settings/others-settings/storage-setings.vue'),
  'pages/administration/settings/system-settings/email-settings': () => import('@/views/pages/administration/settings/system-settings/email-settings.vue'),
  'pages/administration/settings/system-settings/email-template': () => import('@/views/pages/administration/settings/system-settings/email-template.vue'),
  'pages/administration/settings/system-settings/gdpr-settings': () => import('@/views/pages/administration/settings/system-settings/gdpr-settings.vue'),
  'pages/administration/settings/system-settings/maintenance-mode': () => import('@/views/pages/administration/settings/system-settings/maintenance-mode.vue'),
  'pages/administration/settings/system-settings/otp-settings': () => import('@/views/pages/administration/settings/system-settings/otp-settings.vue'),
  'pages/administration/settings/system-settings/sms-settings': () => import('@/views/pages/administration/settings/system-settings/sms-settings.vue'),
  'pages/administration/settings/system-settings/sms-template': () => import('@/views/pages/administration/settings/system-settings/sms-template.vue'),
  'pages/administration/settings/system-settings/system-settings': () => import('@/views/pages/administration/settings/system-settings/system-settings.vue'),
  'pages/administration/settings/website-settings/add-language': () => import('@/views/pages/administration/settings/website-settings/add-language.vue'),
  'pages/administration/settings/website-settings/ai-settings': () => import('@/views/pages/administration/settings/website-settings/ai-settings.vue'),
  'pages/administration/settings/website-settings/appearance-settings': () => import('@/views/pages/administration/settings/website-settings/appearance-settings.vue'),
  'pages/administration/settings/website-settings/authentication-settings': () => import('@/views/pages/administration/settings/website-settings/authentication-settings.vue'),
  'pages/administration/settings/website-settings/bussiness-settings': () => import('@/views/pages/administration/settings/website-settings/bussiness-settings.vue'),
  'pages/administration/settings/website-settings/language-settings': () => import('@/views/pages/administration/settings/website-settings/language-settings.vue'),
  'pages/administration/settings/website-settings/language-web': () => import('@/views/pages/administration/settings/website-settings/language-web.vue'),
  'pages/administration/settings/website-settings/localization-settings': () => import('@/views/pages/administration/settings/website-settings/localization-settings.vue'),
  'pages/administration/settings/website-settings/preferences-settings': () => import('@/views/pages/administration/settings/website-settings/preferences-settings.vue'),
  'pages/administration/settings/website-settings/prefixes-settings': () => import('@/views/pages/administration/settings/website-settings/prefixes-settings.vue'),
  'pages/administration/settings/website-settings/seo-settings': () => import('@/views/pages/administration/settings/website-settings/seo-settings.vue'),
  'pages/administration/settings/website-settings/website-settings': () => import('@/views/pages/administration/settings/website-settings/website-settings.vue'),
  'pages/administration/sites/site-list': () => import('@/views/pages/administration/sites/site-list.vue'),
  'pages/administration/user-management/user-list': () => import('@/views/pages/administration/user-management/user-list.vue'),
  'pages/administration/user-management/user-management': () => import('@/views/pages/administration/user-management/user-management.vue'),
  'pages/authentication/forgot-password': () => import('@/views/pages/authentication/forgot-password.vue'),
  'pages/authentication/reset-password': () => import('@/views/pages/authentication/reset-password.vue'),
  'pages/authentication/unauthorized': () => import('@/views/pages/authentication/unauthorized.vue'),
  'pages/dashboard/dynamic-dashboard': () => import('@/views/pages/dashboard/dynamic-dashboard.vue'),
  'pages/finance-accounts/payroll/add-employee-salary': () => import('@/views/pages/finance-accounts/payroll/add-employee-salary.vue'),
  'pages/finance-accounts/payroll/benefit-settings-list': () => import('@/views/pages/finance-accounts/payroll/benefit-settings-list.vue'),
  'pages/finance-accounts/payroll/BulkPayrollCreate': () => import('@/views/pages/finance-accounts/payroll/BulkPayrollCreate.vue'),
  'pages/finance-accounts/payroll/BulkPayrollProgress': () => import('@/views/pages/finance-accounts/payroll/BulkPayrollProgress.vue'),
  'pages/finance-accounts/payroll/employee-salary': () => import('@/views/pages/finance-accounts/payroll/employee-salary.vue'),
  'pages/finance-accounts/payroll/payroll-additions': () => import('@/views/pages/finance-accounts/payroll/payroll-additions.vue'),
  'pages/finance-accounts/payroll/payroll-deduction': () => import('@/views/pages/finance-accounts/payroll/payroll-deduction.vue'),
  'pages/finance-accounts/payroll/payroll-index': () => import('@/views/pages/finance-accounts/payroll/payroll-index.vue'),
  'pages/finance-accounts/payroll/payroll-overtime': () => import('@/views/pages/finance-accounts/payroll/payroll-overtime.vue'),
  'pages/finance-accounts/payroll/payslip-index': () => import('@/views/pages/finance-accounts/payroll/payslip-index.vue'),
  'pages/finance-accounts/payroll/tax-settings': () => import('@/views/pages/finance-accounts/payroll/tax-settings.vue'),
  'pages/grant/grant-details': () => import('@/views/pages/grant/grant-details.vue'),
  'pages/grant/grant-index': () => import('@/views/pages/grant/grant-index.vue'),
  'pages/grant/grant-list': () => import('@/views/pages/grant/grant-list.vue'),
  'pages/grant/grant-position-details': () => import('@/views/pages/grant/grant-position-details.vue'),
  'pages/grant/grant-position-list': () => import('@/views/pages/grant/grant-position-list.vue'),
  'pages/hrm/attendance/attendance-admin': () => import('@/views/pages/hrm/attendance/attendance-admin.vue'),
  'pages/hrm/attendance/attendance-employee': () => import('@/views/pages/hrm/attendance/attendance-employee.vue'),
  'pages/hrm/attendance/attendance-index': () => import('@/views/pages/hrm/attendance/attendance-index.vue'),
  'pages/hrm/attendance/leaves/leave-balances': () => import('@/views/pages/hrm/attendance/leaves/leave-balances.vue'),
  'pages/hrm/attendance/leaves/leave-index': () => import('@/views/pages/hrm/attendance/leaves/leave-index.vue'),
  'pages/hrm/attendance/leaves/leaves-admin': () => import('@/views/pages/hrm/attendance/leaves/leaves-admin.vue'),
  'pages/hrm/attendance/leaves/leaves-employee': () => import('@/views/pages/hrm/attendance/leaves/leaves-employee.vue'),
  'pages/hrm/attendance/leaves/leave-settings': () => import('@/views/pages/hrm/attendance/leaves/leave-settings.vue'),
  'pages/hrm/attendance/leaves/leave-types': () => import('@/views/pages/hrm/attendance/leaves/leave-types.vue'),
  'pages/hrm/attendance/overtime-list': () => import('@/views/pages/hrm/attendance/overtime-list.vue'),
  'pages/hrm/attendance/performance/goal-tracking': () => import('@/views/pages/hrm/attendance/performance/goal-tracking.vue'),
  'pages/hrm/attendance/performance/goal-type': () => import('@/views/pages/hrm/attendance/performance/goal-type.vue'),
  'pages/hrm/attendance/performance/performance-appraisal': () => import('@/views/pages/hrm/attendance/performance/performance-appraisal.vue'),
  'pages/hrm/attendance/performance/performance-index': () => import('@/views/pages/hrm/attendance/performance/performance-index.vue'),
  'pages/hrm/attendance/performance/performance-indicator': () => import('@/views/pages/hrm/attendance/performance/performance-indicator.vue'),
  'pages/hrm/attendance/performance/performance-review': () => import('@/views/pages/hrm/attendance/performance/performance-review.vue'),
  'pages/hrm/attendance/schedule-timing': () => import('@/views/pages/hrm/attendance/schedule-timing.vue'),
  'pages/hrm/attendance/timesheets-list': () => import('@/views/pages/hrm/attendance/timesheets-list.vue'),
  'pages/hrm/employees/employee-departments': () => import('@/views/pages/hrm/employees/employee-departments.vue'),
  'pages/hrm/employees/employee-details': () => import('@/views/pages/hrm/employees/employee-details.vue'),
  'pages/hrm/employees/employee-policy': () => import('@/views/pages/hrm/employees/employee-policy.vue'),
  'pages/hrm/employees/employee-positions': () => import('@/views/pages/hrm/employees/employee-positions.vue'),
  'pages/hrm/employees/employee-resignation': () => import('@/views/pages/hrm/employees/employee-resignation.vue'),
  'pages/hrm/employees/employees-grid': () => import('@/views/pages/hrm/employees/employees-grid.vue'),
  'pages/hrm/employees/employees-index': () => import('@/views/pages/hrm/employees/employees-index.vue'),
  'pages/hrm/employees/employee-sites': () => import('@/views/pages/hrm/employees/employee-sites.vue'),
  'pages/hrm/employees/employees-list': () => import('@/views/pages/hrm/employees/employees-list.vue'),
  'pages/hrm/employment/employment-list': () => import('@/views/pages/hrm/employment/employment-list.vue'),
  'pages/hrm/holidays/holidays-list': () => import('@/views/pages/hrm/holidays/holidays-list.vue'),
  'pages/hrm/hrm-index': () => import('@/views/pages/hrm/hrm-index.vue'),
  'pages/hrm/promotion/promotion-list': () => import('@/views/pages/hrm/promotion/promotion-list.vue'),
  'pages/hrm/resignation/resignation-list': () => import('@/views/pages/hrm/resignation/resignation-list.vue'),
  'pages/hrm/termination/termination-list': () => import('@/views/pages/hrm/termination/termination-list.vue'),
  'pages/hrm/tickets/tickets-details': () => import('@/views/pages/hrm/tickets/tickets-details.vue'),
  'pages/hrm/tickets/tickets-grid': () => import('@/views/pages/hrm/tickets/tickets-grid.vue'),
  'pages/hrm/tickets/tickets-index': () => import('@/views/pages/hrm/tickets/tickets-index.vue'),
  'pages/hrm/tickets/tickets-list': () => import('@/views/pages/hrm/tickets/tickets-list.vue'),
  'pages/hrm/training/employee-training-list': () => import('@/views/pages/hrm/training/employee-training-list.vue'),
  'pages/hrm/training/training-list': () => import('@/views/pages/hrm/training/training-list.vue'),
  'pages/notifications/notification-detail': () => import('@/views/pages/notifications/notification-detail.vue'),
  'pages/notifications/notification-list': () => import('@/views/pages/notifications/notification-list.vue'),
  'pages/pages/api-keys': () => import('@/views/pages/pages/api-keys.vue'),
  'pages/pages/coming-soon': () => import('@/views/pages/pages/coming-soon.vue'),
  'pages/pages/gallery-index': () => import('@/views/pages/pages/gallery-index.vue'),
  'pages/pages/pages-index': () => import('@/views/pages/pages/pages-index.vue'),
  'pages/pages/pricing-index': () => import('@/views/pages/pages/pricing-index.vue'),
  'pages/pages/privacy-policy': () => import('@/views/pages/pages/privacy-policy.vue'),
  'pages/pages/profile-index': () => import('@/views/pages/pages/profile-index.vue'),
  'pages/pages/search-result': () => import('@/views/pages/pages/search-result.vue'),
  'pages/pages/starter-index': () => import('@/views/pages/pages/starter-index.vue'),
  'pages/pages/terms-condition': () => import('@/views/pages/pages/terms-condition.vue'),
  'pages/pages/timeline-index': () => import('@/views/pages/pages/timeline-index.vue'),
  'pages/pages/under-construction': () => import('@/views/pages/pages/under-construction.vue'),
  'pages/pages/under-maintenance': () => import('@/views/pages/pages/under-maintenance.vue'),
  'pages/recruitment/candidates/candidates-grid': () => import('@/views/pages/recruitment/candidates/candidates-grid.vue'),
  'pages/recruitment/candidates/candidates-kanban': () => import('@/views/pages/recruitment/candidates/candidates-kanban.vue'),
  'pages/recruitment/candidates/candidates-list': () => import('@/views/pages/recruitment/candidates/candidates-list.vue'),
  'pages/recruitment/interviews/interviews-details': () => import('@/views/pages/recruitment/interviews/interviews-details.vue'),
  'pages/recruitment/interviews/interviews-list': () => import('@/views/pages/recruitment/interviews/interviews-list.vue'),
  'pages/recruitment/job-offers/job-offers-list': () => import('@/views/pages/recruitment/job-offers/job-offers-list.vue'),
  'pages/recruitment/jobs/job-grid': () => import('@/views/pages/recruitment/jobs/job-grid.vue'),
  'pages/recruitment/jobs/job-list': () => import('@/views/pages/recruitment/jobs/job-list.vue'),
  'pages/recruitment/recruitment-index': () => import('@/views/pages/recruitment/recruitment-index.vue'),
  'pages/recruitment/refferals/refferals-list': () => import('@/views/pages/recruitment/refferals/refferals-list.vue'),
  'pages/requests/travel/travel-admin': () => import('@/views/pages/requests/travel/travel-admin.vue'),
  'pages/requests/travel/travel-details': () => import('@/views/pages/requests/travel/travel-details.vue'),
  'pages/requests/travel/travel-index': () => import('@/views/pages/requests/travel/travel-index.vue'),
  'pages/requests/travel/travel-list': () => import('@/views/pages/requests/travel/travel-list.vue'),
};

// Helper function that uses explicit imports for multi-level paths
const lazyView = (path) => {
  // If path exists in mapping, use explicit import
  if (routeComponents[path]) {
    return routeComponents[path];
  }
  
  // For paths not in mapping, generate explicit import dynamically
  // This works around Vite's limitation with template literal dynamic imports
  const pathParts = path.split('/');
  
  // If it's a multi-level path, add it to the mapping on-the-fly
  if (pathParts.length > 2) {
    // Cache the import function
    if (!routeComponents[path]) {
      routeComponents[path] = () => import(`@/views/${path}.vue`);
    }
    return routeComponents[path];
  }
  
  // Single level path - safe for dynamic import
  return () => import(`@/views/${path}.vue`);
};

const routes = [
  // Public routes
  {
    path: '/login',
    name: 'login',
    component: LoginIndex,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: lazyView('pages/authentication/forgot-password'),
    meta: {
      title: 'Forgot Password'
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: lazyView('pages/authentication/reset-password'),
    meta: {
      title: 'Reset Password'
    }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: lazyView('pages/authentication/unauthorized'),
    meta: {
      title: 'Unauthorized Access'
    }
  },

  // Protected routes
  
  // Dynamic Dashboard - Single dashboard for all users with permission-based widgets
  {
    path: '/dashboard',
    name: 'dashboard',
    component: lazyView('pages/dashboard/dynamic-dashboard'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard'
    }
  },
  
  // Redirect legacy dashboard routes to the unified dynamic dashboard
  { path: '/dashboard/admin-dashboard', redirect: '/dashboard' },
  { path: '/dashboard/hr-manager-dashboard', redirect: '/dashboard' },
  { path: '/dashboard/hr-assistant-senior-dashboard', redirect: '/dashboard' },
  { path: '/dashboard/hr-assistant-junior-dashboard', redirect: '/dashboard' },
  { path: '/dashboard/site-admin-dashboard', redirect: '/dashboard' },

  // Default redirect
  {
    path: '/',
    redirect: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userRole = localStorage.getItem('userRole')?.toLowerCase();

      // All authenticated users go to the dynamic dashboard
      if (user && userRole) {
        return '/dashboard';
      }
      return '/login';
    }
  },
  {
    path: '/website-settings',
    component: lazyView('pages/administration/settings/website-settings/website-settings'),
    children: [
      { path: '', redirect: '/website-settings/bussiness-settings' },
      { path: "bussiness-settings", component: lazyView('pages/administration/settings/website-settings/bussiness-settings') },
      { path: "seo-settings", component: lazyView('pages/administration/settings/website-settings/seo-settings') },
      { path: "localization-settings", component: lazyView('pages/administration/settings/website-settings/localization-settings') },
      { path: "prefixes", component: lazyView('pages/administration/settings/website-settings/prefixes-settings') },
      { path: "preferences", component: lazyView('pages/administration/settings/website-settings/preferences-settings') },
      { path: "appearance", component: lazyView('pages/administration/settings/website-settings/appearance-settings') },
      { path: "language", component: lazyView('pages/administration/settings/website-settings/language-settings') },
      { path: "add-language", component: lazyView('pages/administration/settings/website-settings/add-language') },
      { path: "language-web", component: lazyView('pages/administration/settings/website-settings/language-web') },
      { path: "authentication-settings", component: lazyView('pages/administration/settings/website-settings/authentication-settings') },
      { path: "ai-settings", component: lazyView('pages/administration/settings/website-settings/ai-settings') },
    ]
  },
  {
    path: '/others-settings',
    component: lazyView('pages/administration/settings/others-settings/others-settings'),
    children: [
      { path: '', redirect: '/others-settings/custom-css' },
      { path: "custom-css", component: lazyView('pages/administration/settings/others-settings/custom-css') },
      { path: "custom-js", component: lazyView('pages/administration/settings/others-settings/custom-js') },
      { path: "cronjob", component: lazyView('pages/administration/settings/others-settings/cronjob-settings') },
      { path: "cronjob-schedule", component: lazyView('pages/administration/settings/others-settings/cronjob-schedule') },
      { path: "storage-settings", component: lazyView('pages/administration/settings/others-settings/storage-setings') },
      { path: "ban-ip-address", component: lazyView('pages/administration/settings/others-settings/ban-ip-address') },
      { path: "backup", component: lazyView('pages/administration/settings/others-settings/backup-settings') },
      { path: "clear-cache", component: lazyView('pages/administration/settings/others-settings/clear-cache') },
    ]
  },
  {
    path: '/financial-settings',
    component: lazyView('pages/administration/settings/financial-settings/financial-settings'),
    children: [
      { path: '', redirect: '/financial-settings/payment-gateways' },
      { path: "payment-gateways", component: lazyView('pages/administration/settings/financial-settings/payment-gateway') },
      { path: "tax-rates", component: lazyView('pages/administration/settings/financial-settings/tax-rates') },
      { path: "currencies", component: lazyView('pages/administration/settings/financial-settings/currencies-settings') },
    ]
  },
  {
    path: '/system-settings',
    component: lazyView('pages/administration/settings/system-settings/system-settings'),
    children: [
      { path: '', redirect: '/system-settings/email-settings' },
      { path: "otp-settings", component: lazyView('pages/administration/settings/system-settings/otp-settings') },
      { path: "email-settings", component: lazyView('pages/administration/settings/system-settings/email-settings') },
      { path: "email-template", component: lazyView('pages/administration/settings/system-settings/email-template') },
      { path: "sms-settings", component: lazyView('pages/administration/settings/system-settings/sms-settings') },
      { path: "sms-template", component: lazyView('pages/administration/settings/system-settings/sms-template') },
      { path: "gdpr", component: lazyView('pages/administration/settings/system-settings/gdpr-settings') },
      { path: "maintenance-mode", component: lazyView('pages/administration/settings/system-settings/maintenance-mode') },
    ]
  },
  {
    path: '/app-settings',
    component: lazyView('pages/administration/settings/app-settings/app-settings'),
    children: [
      { path: '', redirect: '/app-settings/salary-settings' },
      { path: "salary-settings", component: lazyView('pages/administration/settings/app-settings/salary-settings') },
      { path: "leave-type", component: lazyView('pages/administration/settings/app-settings/leave-type') },
      { path: "approval-settings", component: lazyView('pages/administration/settings/app-settings/approval-settings') },
      { path: "invoice-settings", component: lazyView('pages/administration/settings/app-settings/invoice-settings') },
      { path: "custom-fields", component: lazyView('pages/administration/settings/app-settings/custom-fields') },
    ]
  },
  {
    path: '/general-settings',
    component: lazyView('pages/administration/settings/general-settings/general-settings'),
    children: [
      { path: '', redirect: '/general-settings/profile-settings' },
      { path: "profile-settings", component: lazyView('pages/administration/settings/general-settings/profile-settings') },
      { path: "security-settings", component: lazyView('pages/administration/settings/general-settings/security-settings') },
      { path: "notification-settings", component: lazyView('pages/administration/settings/general-settings/notification-settings') },
      { path: "connected-apps", component: lazyView('pages/administration/settings/general-settings/connected-apps') },
    ]
  },

  {
    path: '/lookups',
    component: lazyView('pages/administration/lookups/lookup-list'),
    beforeEnter: permissionGuard(['lookup_list.read', 'lookup_list.edit']),
    meta: {
      requiresAuth: true,
      title: 'Lookups'
    },
    children: [
      { path: '', redirect: '/lookups/lookup-list' },
      { path: "lookup-list", component: lazyView('pages/administration/lookups/lookup-list') }
    ]
  },

  // Sites route
  {
    path: '/sites',
    component: lazyView('pages/administration/sites/site-list'),
    beforeEnter: permissionGuard('sites.read'),
    meta: {
      requiresAuth: true,
      title: 'Sites'
    }
  },

  // Departments route
  {
    path: '/departments',
    component: lazyView('pages/administration/departments/department-list'),
    beforeEnter: permissionGuard('departments.read'),
    meta: {
      requiresAuth: true,
      title: 'Departments'
    }
  },

  // Positions route
  {
    path: '/positions',
    component: lazyView('pages/administration/positions/position-list'),
    beforeEnter: permissionGuard('positions.read'),
    meta: {
      requiresAuth: true,
      title: 'Positions'
    }
  },

  // Section Departments route
  {
    path: '/section-departments',
    component: lazyView('pages/administration/section-departments/section-department-list'),
    beforeEnter: permissionGuard('section_departments.read'),
    meta: {
      requiresAuth: true,
      title: 'Section Departments'
    }
  },

  // Legacy Department Positions route (kept for backward compatibility)
  {
    path: '/department-positions',
    component: lazyView('pages/administration/department-position/department-position-list'),
    beforeEnter: permissionGuard('positions.read'),
    meta: {
      requiresAuth: true,
      title: 'Department Positions'
    },
    children: [
      { path: '', redirect: '/department-positions/department-position-list' },
      { path: "department-position-list", component: lazyView('pages/administration/department-position/department-position-list') }
    ]
  },

  {
    path: '/user-management',
    component: lazyView('pages/administration/user-management/user-management'),
    beforeEnter: permissionGuard('users.read'),
    meta: {
      requiresAuth: true,
      title: 'User Management'
    },
    children: [
      { path: '', redirect: '/user-management/users' },
      { path: "users", component: lazyView('pages/administration/user-management/user-list') },
      { path: "roles", component: lazyView('pages/administration/role-management/role-list') },
    ]
  },

  // Notifications routes
  {
    path: '/notifications',
    component: lazyView('pages/notifications/notification-list'),
    meta: {
      requiresAuth: true,
      title: 'Notifications'
    }
  },
  {
    path: '/notifications/:id',
    component: lazyView('pages/notifications/notification-detail'),
    meta: {
      requiresAuth: true,
      title: 'Notification Detail'
    }
  },
  // REMOVED: /supports route - directory deleted (administration/supports)
  // REMOVED: /asset route - directory deleted (administration/assets)
  // REMOVED: /layouts route - directory deleted (layout/)
  {
    path: '/pages',
    component: lazyView('pages/pages/pages-index'),
    children: [
      { path: '', redirect: '/pages/starter' },
      { path: "starter", component: lazyView('pages/pages/starter-index') },
      { path: "profile", component: lazyView('pages/pages/profile-index') },
      { path: "gallery", component: lazyView('pages/pages/gallery-index') },
      { path: "search-result", component: lazyView('pages/pages/search-result') },
      { path: "timeline", component: lazyView('pages/pages/timeline-index') },
      { path: "pricing", component: lazyView('pages/pages/pricing-index') },
      { path: "coming-soon", component: lazyView('pages/pages/coming-soon') },
      { path: "under-maintenance", component: lazyView('pages/pages/under-maintenance') },
      { path: "under-construction", component: lazyView('pages/pages/under-construction') },
      { path: "api-keys", component: lazyView('pages/pages/api-keys') },
      { path: "terms-condition", component: lazyView('pages/pages/terms-condition') },
      { path: "privacy-policy", component: lazyView('pages/pages/privacy-policy') },
    ]
  },
  {
    path: '/payroll',
    component: lazyView('pages/finance-accounts/payroll/payroll-index'),
    children: [
      { path: '', redirect: '/payroll/employee-salary' },
      {
        path: "employee-salary",
        component: lazyView('pages/finance-accounts/payroll/employee-salary'),
        meta: {
          title: 'Employee Salary'
        }
      },
      {
        path: "add-employee-salary",
        component: lazyView('pages/finance-accounts/payroll/add-employee-salary'),
        meta: {
          title: 'Add Employee Salary'
        }
      },
      { path: "payslip", component: lazyView('pages/finance-accounts/payroll/payslip-index') },
      { path: "payroll", component: lazyView('pages/finance-accounts/payroll/payroll-additions') },
      { path: "payroll-overtime", component: lazyView('pages/finance-accounts/payroll/payroll-overtime') },
      { path: "payroll-deduction", component: lazyView('pages/finance-accounts/payroll/payroll-deduction') },
      {
        path: "tax-settings",
        component: lazyView('pages/finance-accounts/payroll/tax-settings'),
        meta: {
          title: 'Tax Settings',
          requiresAuth: true
        }
      },
      {
        path: "benefit-settings",
        component: lazyView('pages/finance-accounts/payroll/benefit-settings-list'),
        meta: {
          title: 'Benefit Settings',
          requiresAuth: true,
          requiredPermissions: ['benefit-settings.read']
        }
      },
      {
        path: "bulk-create",
        name: "bulk-payroll-create",
        component: lazyView('pages/finance-accounts/payroll/BulkPayrollCreate'),
        meta: {
          title: 'Bulk Payroll Creation',
          requiresAuth: true,
          requiredPermissions: ['payroll.bulk_create']
        }
      },
      {
        path: "bulk-progress/:batchId",
        name: "bulk-payroll-progress",
        component: lazyView('pages/finance-accounts/payroll/BulkPayrollProgress'),
        meta: {
          title: 'Bulk Payroll Progress',
          requiresAuth: true,
          requiredPermissions: ['payroll.bulk_create']
        }
      },
    ]
  },
  // REMOVED: /accounting route - directory deleted (finance-accounts/accounting)
  // REMOVED: /content route - directory deleted (content/)
  {
    path: '/reports',
    component: lazyView('pages/administration/reports/reports-index'),
    children: [
      { path: '', redirect: '/reports/expenses-report' },
      { path: "expenses-report", component: lazyView('pages/administration/reports/expenses-report') },
      { path: "invoice-report", component: lazyView('pages/administration/reports/invoice-report') },
      { path: "payment-report", component: lazyView('pages/administration/reports/payment-report') },
      { path: "project-report", component: lazyView('pages/administration/reports/project-report') },
      { path: "task-report", component: lazyView('pages/administration/reports/task-report') },
      { path: "user-report", component: lazyView('pages/administration/reports/user-report') },
      { path: "employee-report", component: lazyView('pages/administration/reports/employee-report') },
      { path: "payslip-report", component: lazyView('pages/administration/reports/payslip-report') },
      { path: "attendance-report", component: lazyView('pages/administration/reports/attendance-report') },
      { path: "leave-report", component: lazyView('pages/administration/reports/leave-report') },
      { path: "daily-report", component: lazyView('pages/administration/reports/daily-report') },
      { path: "report-list", component: lazyView('pages/administration/reports/report-list') },
    ]
  },
  // File Uploads route
  {
    path: '/file-uploads',
    component: lazyView('pages/administration/file-uploads/file-uploads-list'),
    beforeEnter: permissionGuard('file_uploads.read'),
    meta: {
      requiresAuth: true,
      title: 'File Uploads'
    }
  },
  // REMOVED: /location route - directory deleted (content/location)
  // REMOVED: /blog route - directory deleted (content/blogs)
  // REMOVED: /sales route - directory deleted (finance-accounts/sales)
  {
    path: '/recruitment',
    component: lazyView('pages/recruitment/recruitment-index'),
    beforeEnter: permissionGuard(['interviews.read', 'job_offers.read']),
    meta: {
      requiresAuth: true,
      title: 'Recruitment'
    },
    children: [
      { path: '', redirect: '/recruitment/job-list' },
      { path: "job-grid", component: lazyView('pages/recruitment/jobs/job-grid') },
      { path: "job-list", component: lazyView('pages/recruitment/jobs/job-list') },
      { path: "candidates-grid", component: lazyView('pages/recruitment/candidates/candidates-grid') },
      { path: "candidates-list", component: lazyView('pages/recruitment/candidates/candidates-list') },
      { path: "candidates-kanban", component: lazyView('pages/recruitment/candidates/candidates-kanban') },
      { path: "refferals", component: lazyView('pages/recruitment/refferals/refferals-list') },
      {
        path: "interviews-list",
        component: lazyView('pages/recruitment/interviews/interviews-list'),
        beforeEnter: permissionGuard('interviews.read'),
        meta: {
          title: 'Interview List '
        }
      },
      {
        path: "job-offers-list", 
        component: lazyView('pages/recruitment/job-offers/job-offers-list'),
        beforeEnter: permissionGuard('job_offers.read'),
        meta: {
          title: 'Job Offer List '
        }
      },
      { path: "interviews-details/:id", component: lazyView('pages/recruitment/interviews/interviews-details') },
    ]
  },
  {
    path: '/hrm',
    component: lazyView('pages/hrm/hrm-index'),
    children: [
      { path: '', redirect: '/hrm/holidays' },
      { path: "holidays", component: lazyView('pages/hrm/holidays/holidays-list') },
      { path: "promotion", component: lazyView('pages/hrm/promotion/promotion-list') },
      { path: "resignation", component: lazyView('pages/hrm/resignation/resignation-list') },
      { path: "termination", component: lazyView('pages/hrm/termination/termination-list') },
    ]
  },
  {
    path: '/performance',
    component: lazyView('pages/hrm/attendance/performance/performance-index'),
    children: [
      { path: '', redirect: '/performance/performance-indicator' },
      { path: "performance-indicator", component: lazyView('pages/hrm/attendance/performance/performance-indicator') },
      { path: "performance-review", component: lazyView('pages/hrm/attendance/performance/performance-review') },
      { path: "performance-appraisal", component: lazyView('pages/hrm/attendance/performance/performance-appraisal') },
      { path: "goal-tracking", component: lazyView('pages/hrm/attendance/performance/goal-tracking') },
      { path: "goal-type", component: lazyView('pages/hrm/attendance/performance/goal-type') },
    ]
  },
  {
    path: '/attendance',
    component: lazyView('pages/hrm/attendance/attendance-index'),
    children: [
      {
        path: '',
        meta: {
          title: 'Attendance Admin'
        },
        redirect: '/attendance/attendance-admin'

      },
      {
        path: "attendance-admin",
        component: lazyView('pages/hrm/attendance/attendance-admin'),
        meta: {
          title: 'Attendance Admin'
        }
      },
      { path: "attendance-employee", component: lazyView('pages/hrm/attendance/attendance-employee') },
      { path: "timesheets", component: lazyView('pages/hrm/attendance/timesheets-list') },
      { path: "schedule-timing", component: lazyView('pages/hrm/attendance/schedule-timing') },
      { path: "overtime", component: lazyView('pages/hrm/attendance/overtime-list') }
    ]
  },
  {
    path: '/leave/admin',
    component: lazyView('pages/hrm/attendance/leaves/leave-index'),
    beforeEnter: permissionGuard(['leaves_admin.read', 'leave_settings.read', 'leave_types.read', 'leave_balances.read']),
    meta: {
      requiresAuth: true,
      title: 'Leave Admin'
    },
    children: [
      { path: '', redirect: '/leave/admin/leaves-admin' },
      { path: "leaves-admin", component: lazyView('pages/hrm/attendance/leaves/leaves-admin') },
      { path: "leave-settings", component: lazyView('pages/hrm/attendance/leaves/leave-settings') },
      { path: "leave-types", component: lazyView('pages/hrm/attendance/leaves/leave-types') },
      { path: "leave-balances", component: lazyView('pages/hrm/attendance/leaves/leave-balances') },
    ]
  },
  {
    path: '/leave/employee',
    component: lazyView('pages/hrm/attendance/leaves/leave-index'),
    beforeEnter: permissionGuard('leaves_employee.read'),
    meta: {
      requiresAuth: true,
      title: 'My Leave'
    },
    children: [
      { path: '', redirect: '/leave/employee/leaves-employee' },
      { path: "leaves-employee", component: lazyView('pages/hrm/attendance/leaves/leaves-employee') },
    ]

  },
  {
    path: '/tickets',
    component: lazyView('pages/hrm/tickets/tickets-index'),
    children: [
      { path: '', redirect: '/tickets/ticket' },
      { path: "ticket", component: lazyView('pages/hrm/tickets/tickets-list') },
      { path: "tickets-grid", component: lazyView('pages/hrm/tickets/tickets-grid') },
      { path: "tickets-details", component: lazyView('pages/hrm/tickets/tickets-details') },
    ]
  },
  {
    path: '/employee',
    component: lazyView('pages/hrm/employees/employees-index'),
    beforeEnter: permissionGuard(['employees.read', 'employment_records.read', 'employee_resignation.read']),
    meta: {
      requiresAuth: true,
      title: 'Employee'
    },
    children: [
      { path: '', redirect: '/employee/employee-list' },
      {
        path: "employee-list",
        component: lazyView('pages/hrm/employees/employees-list'),
        meta: {
          title: 'Employee List'
        }
      },
      { path: "employee-grid", component: lazyView('pages/hrm/employees/employees-grid') },
      // Updated route with dynamic parameter
      { path: "employee-details/:id", component: lazyView('pages/hrm/employees/employee-details') },
      {
        path: "employment-list",
        component: lazyView('pages/hrm/employment/employment-list'),
        meta: {
          title: 'Employment List'
        }
      },
      { path: "departments", component: lazyView('pages/hrm/employees/employee-departments') },
      { path: "positions", component: lazyView('pages/hrm/employees/employee-positions') },
      { path: "policy", component: lazyView('pages/hrm/employees/employee-policy') },
      { path: "site", component: lazyView('pages/hrm/employees/employee-sites') },
      {
        path: "employee-resignation",
        component: lazyView('pages/hrm/employees/employee-resignation'),
        meta: {
          title: 'Employee Resignation'
        }
      },
    ]
  },
  {
    path: '/recycle-bin',
    component: lazyView('pages/administration/recycle-bin/recycle-bin'),
    beforeEnter: permissionGuard('recycle_bin_list.read'),
    meta: {
      requiresAuth: true,
      title: 'Recycle Bin'
    },
    children: [
      { path: '', redirect: '/recycle-bin/recycle-bin-list' },
      { path: "recycle-bin-list", component: lazyView('pages/administration/recycle-bin/recycle-bin-list') }
    ]
  },
  // REMOVED: /crm route - directory deleted (crm/)
  // REMOVED: /projects route - directory deleted (projects/)
  // REMOVED: /super-admin route - directory deleted (superadmin/)
  // REMOVED: /applications route - directory deleted (applications/)
  // REMOVED: /calls route - directory deleted (applications/calls)
  // Legacy dashboard routes - kept for template compatibility but not used in HRMS
  // The main /dashboard route is defined earlier and points to dynamic-dashboard
  // {
  //   path: '/dashboard-legacy',
  //   component: lazyView('pages/dashboard/dashboard-index'),
  //   children: [
  //     { path: "admin-dashboard", component: lazyView('pages/dashboard/admin-dashboard') },
  //     { path: "employee-dashboard", component: lazyView('pages/dashboard/employee-dashboard') },
  //     { path: "deals-dashboard", component: lazyView('pages/dashboard/deals-dashboard') },
  //     { path: "leads-dashboard", component: lazyView('pages/dashboard/leads-dashboard') },
  //   ]
  // },
  // REMOVED: /icons route - directory deleted (uiinterface/icons)
  // REMOVED: /baseui route - directory deleted (uiinterface/baseui)
  // REMOVED: /advancedui route - directory deleted (uiinterface/advancedui)
  // REMOVED: /tables route - directory deleted (uiinterface/tables)
  // REMOVED: /charts route - directory deleted (uiinterface/charts)
  // REMOVED: /form-elements route - directory deleted (uiinterface/forms)
  // REMOVED: /form-layouts route - directory deleted (uiinterface/forms)
  // REMOVED: /forms route - directory deleted (uiinterface/forms)
  {
    path: '/grant',
    component: lazyView('pages/grant/grant-index'),
    beforeEnter: permissionGuard(['grants_list.read', 'grant_position.read']),
    children: [
      { path: '', redirect: '/grant/list' },
      {
        path: 'list',
        component: lazyView('pages/grant/grant-list'),
        meta: {
          title: 'Grants',
          requiresAuth: true,
          roles: ['admin', 'hr-manager']
        }
      },
      {
        path: 'details/:id',
        component: lazyView('pages/grant/grant-details'),
        meta: {
          title: 'Grant Details',
          requiresAuth: true,
          roles: ['admin', 'hr-manager']
        }
      },
      {
        path: 'grant-position',
        component: lazyView('pages/grant/grant-position-list'),
        meta: {
          title: 'Grant Position',
        }
      },
      {
        path: 'grant-position-details/:id',
        component: lazyView('pages/grant/grant-position-details'),
        meta: {
          title: 'Grant Position Details',
        }
      },
      {
        path: 'grant-allocate-employee/:id',
        component: () => import('@/components/modal/grant-allocate-employee-modal.vue'),
        meta: {
          title: 'Grant Allocate Employee',
        }
      },
    ]
  },
  {
    path: '/requests/travel/admin',
    component: lazyView('pages/requests/travel/travel-index'),
    beforeEnter: permissionGuard('travel_admin.read'),
    meta: {
      requiresAuth: true,
      title: 'Travel Request Management'
    },
    children: [
      {
        path: '',
        component: lazyView('pages/requests/travel/travel-admin'),
        meta: {
          title: 'Travel Request Admin'
        }
      },
      { path: ':id', component: lazyView('pages/requests/travel/travel-details') }
    ]
  },
  {
    path: '/requests/travel',
    component: lazyView('pages/requests/travel/travel-index'),
    beforeEnter: permissionGuard('travel_employee.read'),
    meta: {
      requiresAuth: true,
      title: 'Travel Request Employee'
    },

    children: [
      { path: '', component: lazyView('pages/requests/travel/travel-list') },
      { path: ':id', component: lazyView('pages/requests/travel/travel-details') }
    ]
  },

  // Training routes
  {
    path: '/training/training-list',
    component: lazyView('pages/hrm/training/training-list'),
    beforeEnter: permissionGuard('training_list.read'),
    meta: {
      requiresAuth: true,
      title: 'Training List'
    }
  },
  {
    path: '/training/employee-training-list',
    component: lazyView('pages/hrm/training/employee-training-list'),
    beforeEnter: permissionGuard('employee_training.read'),
    meta: {
      requiresAuth: true,
      title: 'Employee Training'
    }
  },

];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes,
});

// Title handling
router.afterEach((to) => {
  // Handle RTL layout
  if (to.name === "layout-rtl") {
    document.body.classList.add("layout-mode-rtl");
  } else {
    document.body.classList.remove("layout-mode-rtl");
  }

  // Update page title
  const defaultTitle = 'HRMS';
  let title = to.meta.title || defaultTitle;

  // If you want to always include the default title
  if (to.meta.title) {
    document.title = `${title} - ${defaultTitle}`;
  } else {
    document.title = defaultTitle;
  }
});

// Scroll behavior
router.beforeEach((to, from, next) => {
  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });
  next();
});

// Global navigation guard
router.beforeEach(authGuard);

export default router;
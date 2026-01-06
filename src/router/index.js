import { createRouter, createWebHistory } from 'vue-router';
import { authGuard, roleGuard, permissionGuard } from './guards';
import LoginIndex from '@/views/pages/authentication/login-index.vue';

// helper for pages under /views
const lazyView = path => () => import(`@/views/${path}.vue`)
// helper for components under /components

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
        component: lazyView('pages/grant/grant-allocate-employee-modal'),
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
  history: createWebHistory(process.env.BASE_URL),
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
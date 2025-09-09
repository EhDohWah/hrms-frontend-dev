import { createRouter, createWebHistory } from 'vue-router';
import { authGuard, roleGuard } from './guards';
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
  {
    path: '/dashboard/admin-dashboard',
    name: 'admin-dashboard',
    component: lazyView('pages/dashboard/admin-dashboard/admin-dashboard'),
    beforeEnter: roleGuard(['admin']),
    meta: {
      requiresAuth: true,
      title: 'Admin Dashboard'
    }
  },
  {
    path: '/dashboard/employee-dashboard',
    name: 'employee-dashboard',
    component: lazyView('pages/dashboard/employee-dashboard/employee-dashboard'),
    beforeEnter: roleGuard(['employee', 'hr-manager', 'admin', 'hr-assistant']),
    meta: {
      requiresAuth: true,
      title: 'Employee Dashboard'
    }

  },
  {
    path: '/dashboard/deals-dashboard',
    name: 'deals-dashboard',
    component: lazyView('pages/dashboard/deals-dashboard/deals-dashboard'),
    beforeEnter: roleGuard(['hr-manager', 'admin']),
    meta: {
      requiresAuth: true,
      title: 'Deals Dashboard'
    }

  },
  {
    path: '/dashboard/hr-manager-dashboard',
    name: 'hr-manager-dashboard',
    component: lazyView('pages/dashboard/hr-manager-dashboard/hr-manager-dashboard'),
    beforeEnter: roleGuard(['hr-manager', 'admin']),
    meta: {
      requiresAuth: true,
      title: 'HR Manager Dashboard'
    }
  },
  {
    path: '/dashboard/hr-assistant-dashboard',
    name: 'hr-assistant-dashboard',
    component: lazyView('pages/dashboard/hr-assistant-dashboard/hr-assistant-dashboard'),
    beforeEnter: roleGuard(['hr-assistant', 'hr-manager', 'admin']),
    meta: {
      requiresAuth: true,
      title: 'HR Assistant Dashboard'
    }
  },

  // Default redirect
  {
    path: '/',
    redirect: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userRole = localStorage.getItem('userRole')?.toLowerCase();

      if (user && userRole) {
        switch (userRole) {
          case 'admin':
            return '/dashboard/admin-dashboard';
          case 'hr-manager':
            return '/dashboard/hr-manager-dashboard';
          case 'hr-assistant':
            return '/dashboard/hr-assistant-dashboard';
          case 'employee':
            return '/dashboard/employee-dashboard';
          default:
            return '/login';
        }
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
    beforeEnter: roleGuard(['admin']),
    meta: {
      requiresAuth: true,
      title: 'Lookups'
    },
    children: [
      { path: '', redirect: '/lookups/lookup-list' },
      { path: "lookup-list", component: lazyView('pages/administration/lookups/lookup-list') }
    ]
  },

  {
    path: '/department-positions',
    component: lazyView('pages/administration/department-position/department-position-list'),
    beforeEnter: roleGuard(['admin']),
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
    beforeEnter: roleGuard(['admin']),
    meta: {
      requiresAuth: true,
      title: 'User Management'
    },
    children: [
      { path: '', redirect: '/user-management/users' },
      { path: "users", component: lazyView('pages/administration/user-management/user-list') },
      { path: "roles-permissions", component: lazyView('pages/administration/user-management/roles-permission') },
      { path: "permission", component: lazyView('pages/administration/user-management/permission-index') },
    ]
  },
  {
    path: '/supports',
    component: lazyView('pages/administration/supports/help-supports'),
    children: [
      { path: '', redirect: '/supports/knowledgebase' },
      { path: "knowledgebase", component: lazyView('pages/administration/supports/knowledgebase-index') },
      { path: "knowledgebase-view", component: lazyView('pages/administration/supports/knowledgebase-view') },
      { path: "knowledgebase-details", component: lazyView('pages/administration/supports/knowledgebase-details') },
    ]
  },
  {
    path: '/asset',
    component: lazyView('pages/administration/assets/assets-index'),
    children: [
      { path: '', redirect: '/asset/assets' },
      { path: "assets", component: lazyView('pages/administration/assets/assets-list') },
      { path: "asset-categories", component: lazyView('pages/administration/assets/assets-categories') },
    ]
  },
  {
    path: '/layouts',
    component: lazyView('pages/layout/layout-index'),
    children: [
      { path: '', redirect: '/layouts/layout-horizontal' },
      { path: "layout-horizontal", component: lazyView('pages/layout/layout-horizontal') },
      { path: "layout-detached", component: lazyView('pages/layout/layout-detached') },
      { path: "layout-modern", component: lazyView('pages/layout/layout-modern') },
      { path: "layout-two-column", component: lazyView('pages/layout/layout-two-column') },
      { path: "layout-hovered", component: lazyView('pages/layout/layout-hovered') },
      { path: "layout-box", component: lazyView('pages/layout/layout-box') },
      { path: "layout-horizontal-single", component: lazyView('pages/layout/layout-horizontal-single') },
      { path: "layout-horizontal-overlay", component: lazyView('pages/layout/layout-horizontal-overlay') },
      { path: "layout-horizontal-box", component: lazyView('pages/layout/layout-horizontal-box') },
      { path: "layout-horizontal-sidemenu", component: lazyView('pages/layout/layout-horizontal-sidemenu') },
      { path: "layout-vertical-transparent", component: lazyView('pages/layout/layout-vertical-transparent') },
      { path: "layout-without-header", component: lazyView('pages/layout/layout-without-header') },
      { path: "layout-rtl", component: lazyView('pages/layout/layout-rtl/layout-rtl') },
      { path: "layout-dark", component: lazyView('pages/layout/layout-dark') },
    ]
  },
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
    ]
  },
  {
    path: '/accounting',
    component: lazyView('pages/finance-accounts/accounting/accounting-index'),
    children: [
      { path: '', redirect: '/accounting/budgets' },
      { path: "budgets", component: lazyView('pages/finance-accounts/accounting/budgets-index') },
      { path: "budget-expenses", component: lazyView('pages/finance-accounts/accounting/budgets-expenses') },
      { path: "budget-revenues", component: lazyView('pages/finance-accounts/accounting/budgets-revenues') },
      { path: "categories", component: lazyView('pages/finance-accounts/accounting/categories-list') },
    ]
  },
  {
    path: '/content',
    component: lazyView('pages/content/content-index'),
    children: [
      { path: '', redirect: '/content/pages' },
      { path: "pages", component: lazyView('pages/content/pages-list') },
      { path: "testimonials", component: lazyView('pages/content/testimonials-list') },
      { path: "faq", component: lazyView('pages/content/faq-list') },
    ]
  },
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
  {
    path: '/location',
    component: lazyView('pages/content/location/location-index'),
    children: [
      { path: '', redirect: '/location/countries' },
      { path: "countries", component: lazyView('pages/content/location/countries-list') },
      { path: "states", component: lazyView('pages/content/location/states-list') },
      { path: "cities", component: lazyView('pages/content/location/cities-list') },
    ]
  },
  {
    path: '/blog',
    component: lazyView('pages/content/blogs/blogs-index'),
    children: [
      { path: '', redirect: '/blog/blogs' },
      { path: "blogs", component: lazyView('pages/content/blogs/blogs-grid') },
      { path: "blog-categories", component: lazyView('pages/content/blogs/blog-categories') },
      { path: "blog-comments", component: lazyView('pages/content/blogs/blog-comments') },
      { path: "blog-tags", component: lazyView('pages/content/blogs/blog-tags') },
    ]
  },
  {
    path: '/sales',
    component: lazyView('pages/finance-accounts/sales/sales-index'),
    children: [
      { path: '', redirect: '/sales/estimates' },
      { path: "estimates", component: lazyView('pages/finance-accounts/sales/estimates-list') },
      { path: "invoices", component: lazyView('pages/finance-accounts/sales/invoices-list') },
      { path: "add-invoices", component: lazyView('pages/finance-accounts/sales/add-invoices') },
      { path: "edit-invoices", component: lazyView('pages/finance-accounts/sales/edit-invoices') },
      { path: "invoice-details", component: lazyView('pages/finance-accounts/sales/invoice-details') },
      { path: "payments", component: lazyView('pages/finance-accounts/sales/payments-list') },
      { path: "expenses", component: lazyView('pages/finance-accounts/sales/expenses-list') },
      { path: "provident-fund", component: lazyView('pages/finance-accounts/sales/provident-fund') },
      { path: "taxes", component: lazyView('pages/finance-accounts/sales/taxes-list') },
    ]
  },
  {
    path: '/recruitment',
    component: lazyView('pages/recruitment/recruitment-index'),
    beforeEnter: roleGuard(['hr-assistant', 'hr-manager', 'admin']),
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
        meta: {
          title: 'Interview List '
        }
      },
      {
        path: "job-offers-list", component: lazyView('pages/recruitment/job-offers/job-offers-list'),
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
    path: '/training',
    component: lazyView('pages/hrm/attendance/training/training-index'),
    children: [
      { path: 'employee-training-list', component: lazyView('pages/hrm/attendance/training/employee-training-list') },
      { path: '', redirect: '/training/training-list' },
      {
        path: "training-list",
        component: lazyView('pages/hrm/attendance/training/training-list'),
        meta: {
          title: 'Training List'
        }
      },
      { path: "trainers", component: lazyView('pages/hrm/attendance/training/trainers-list') },
      { path: "training-type", component: lazyView('pages/hrm/attendance/training/training-type') },
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
    beforeEnter: roleGuard(['hr-assistant', 'hr-manager', 'admin']),
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
    beforeEnter: roleGuard(['employee']),
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
    beforeEnter: roleGuard(['hr-assistant', 'hr-manager', 'admin']),
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
    beforeEnter: roleGuard(['admin', 'hr-manager']),
    meta: {
      requiresAuth: true,
      title: 'Recycle Bin'
    },
    children: [
      { path: '', redirect: '/recycle-bin/recycle-bin-list' },
      { path: "recycle-bin-list", component: lazyView('pages/administration/recycle-bin/recycle-bin-list') }
    ]
  },
  {
    path: '/crm',
    component: lazyView('pages/crm/crm-index'),
    children: [
      { path: '', redirect: '/crm/deals-grid' },
      { path: "deals-grid", component: lazyView('pages/crm/deals/deals-grid') },
      { path: "deals-list", component: lazyView('pages/crm/deals/deals-list') },
      { path: "deals-details", component: lazyView('pages/crm/deals/deals-details') },
      { path: "leads-grid", component: lazyView('pages/crm/leads/leads-grid') },
      { path: "leads-list", component: lazyView('pages/crm/leads/leads-list') },
      { path: "leads-details", component: lazyView('pages/crm/leads/leads-details') },
      { path: "contacts-grid", component: lazyView('pages/crm/contacts/contacts-grid') },
      { path: "contacts", component: lazyView('pages/crm/contacts/contacts-list') },
      { path: "contact-details", component: lazyView('pages/crm/contacts/contact-details') },
      { path: "companies-grid", component: lazyView('pages/crm/companies/companies-grid') },
      { path: "companies-crm", component: lazyView('pages/superadmin/companies/companies-crm') },
      { path: "companies-details", component: lazyView('pages/superadmin/companies/companies-details') },
      { path: "deals-grid", component: lazyView('pages/crm/deals/deals-grid') },
      { path: "deals-list", component: lazyView('pages/crm/deals/deals-list') },
      { path: "deals-details", component: lazyView('pages/crm/deals/deals-details') },
      { path: "leads-grid", component: lazyView('pages/crm/leads/leads-grid') },
      { path: "leads-list", component: lazyView('pages/crm/leads/leads-list') },
      { path: "leads-details", component: lazyView('pages/crm/leads/leads-details') },
      { path: "contacts-grid", component: lazyView('pages/crm/contacts/contacts-grid') },
      { path: "contacts", component: lazyView('pages/crm/contacts/contacts-list') },
      { path: "contact-details", component: lazyView('pages/crm/contacts/contact-details') },
      { path: "companies-grid", component: lazyView('pages/crm/companies/companies-grid') },
      { path: "companies-crm", component: lazyView('pages/superadmin/companies/companies-crm') },
      { path: "companies-details", component: lazyView('pages/superadmin/companies/companies-details') },
      { path: "pipeline", component: lazyView('pages/crm/pipeline/pipeline-list') },
      { path: "analytics", component: lazyView('pages/crm/analytics/analytics-list') },
      { path: "activity", component: lazyView('pages/crm/activity/activity-list') },
    ]
  },
  {
    path: '/projects',
    component: lazyView('pages/projects/projects-index'),
    children: [
      { path: '', redirect: '/projects/client-grid' },
      { path: "clients-grid", component: lazyView('pages/projects/clients/clients-grid') },
      { path: "clients", component: lazyView('pages/projects/clients/clients-list') },
      { path: "clients-details", component: lazyView('pages/projects/clients/clients-details') },
      { path: "projects-grid", component: lazyView('pages/projects/projects/projects-grid') },
      { path: "projects-list", component: lazyView('pages/projects/projects/projects-list') },
      { path: "projects-details", component: lazyView('pages/projects/projects/projects-details') },
      { path: "tasks", component: lazyView('pages/projects/tasks/tasks-index') },
      { path: "task-board", component: lazyView('pages/projects/tasks/task-board') },
      { path: "task-details", component: lazyView('pages/projects/tasks/task-details') },
    ]
  },
  {
    path: '/super-admin',
    component: lazyView('pages/superadmin/superadmin-index'),
    children: [
      { path: '', redirect: '/super-admin/dashboard' },
      { path: "dashboard", component: lazyView('pages/superadmin/dashboard/dashboard') },
      { path: "companies", component: lazyView('pages/superadmin/companies/companies-list') },
      { path: "subscription", component: lazyView('pages/superadmin/subscription/super-subscription') },
      { path: "packages", component: lazyView('pages/superadmin/packages/packages-list') },
      { path: "packages-grid", component: lazyView('pages/superadmin/packages/packages-grid') },
      { path: "domain", component: lazyView('pages/superadmin/domain/domain-list') },
      { path: "purchase-transaction", component: lazyView('pages/superadmin/purchase-transaction/purchase-transaction') }
    ]
  },
  {
    path: '/applications',
    component: lazyView('pages/applications/applications-index'),
    children: [
      { path: '', redirect: '/applications/chat' },
      { path: "chat", component: lazyView('pages/applications/chat/chat-index') },
      { path: "events", component: lazyView('pages/applications/calendar/calendar-index') },
      { path: "email", component: lazyView('pages/applications/email/email-index') },
      { path: "email-reply", component: lazyView('pages/applications/email/email-reply') },
      { path: "todo", component: lazyView('pages/applications/todo/todo-index') },
      { path: "todo-list", component: lazyView('pages/applications/todo/todo-list') },
      { path: "notes", component: lazyView('pages/applications/notes/notes-index') },
      { path: "social-feed", component: lazyView('pages/applications/social-feed/social-feed-index') },
      { path: "invoices", component: lazyView('pages/applications/invoices/invoices-app') },
      { path: "add-invoices", component: lazyView('pages/applications/invoices/add-invoices') },
      { path: "edit-invoices", component: lazyView('pages/applications/invoices/edit-invoices') },
      { path: "invoice-details", component: lazyView('pages/applications/invoices/invoice-details') },
      { path: "file-manager", component: lazyView('pages/applications/file-manager/file-manager') },
      { path: "kanban-view", component: lazyView('pages/applications/kanban/kanban-view') },
    ]
  },
  {
    path: '/calls',
    component: lazyView('pages/applications/calls/calls-index'),
    children: [
      { path: '', redirect: '/calls/voice-call' },
      { path: "voice-call", component: lazyView('pages/applications/calls/voice-call') },
      { path: "video-call", component: lazyView('pages/applications/calls/video-call') },
      { path: "outgoing-call", component: lazyView('pages/applications/calls/outgoing-call') },
      { path: "incoming-call", component: lazyView('pages/applications/calls/incoming-call') },
      { path: "call-history", component: lazyView('pages/applications/calls/call-history') },
    ]
  },
  {
    path: '/dashboard',
    component: lazyView('pages/dashboard/dashboard-index'),
    children: [
      { path: '', redirect: '/dashboard/admin-dashboard' },
      { path: "admin-dashboard", component: lazyView('pages/dashboard/admin-dashboard') },
      { path: "employee-dashboard", component: lazyView('pages/dashboard/employee-dashboard') },
      { path: "deals-dashboard", component: lazyView('pages/dashboard/deals-dashboard') },
      { path: "leads-dashboard", component: lazyView('pages/dashboard/leads-dashboard') },
    ]
  },
  {
    path: '/icons',
    component: lazyView('pages/icons/icons-index'),
    children: [
      { path: '', redirect: '/icons/icon-fontawesome' },
      { path: "icon-fontawesome", component: lazyView('pages/icons/icon-fontawesome') },
      { path: "icon-feather", component: lazyView('pages/icons/icon-feather') },
      { path: "icon-ionic", component: lazyView('pages/icons/icon-ionic') },
      { path: "icon-material", component: lazyView('pages/icons/icon-material') },
      { path: "icon-pe7", component: lazyView('pages/icons/icon-pe7') },
      { path: "icon-simpleline", component: lazyView('pages/icons/icon-simpleline') },
      { path: "icon-themify", component: lazyView('pages/icons/icon-themify') },
      { path: "icon-weather", component: lazyView('pages/icons/icon-weather') },
      { path: "icon-typicon", component: lazyView('pages/icons/icon-typicon') },
      { path: "icon-flag", component: lazyView('pages/icons/icon-flag') },
    ]
  },
  {
    path: '/baseui',
    component: lazyView('pages/baseui/baseui-index'),
    children: [
      { path: '', redirect: '/baseui/ui-alerts' },
      { path: "ui-alerts", component: lazyView('pages/baseui/ui-alerts') },
      { path: "ui-accordion", component: lazyView('pages/baseui/ui-accordion') },
      { path: "ui-avatar", component: lazyView('pages/baseui/ui-avatar') },
      { path: "ui-badges", component: lazyView('pages/baseui/ui-badges') },
      { path: "ui-borders", component: lazyView('pages/baseui/ui-borders') },
      { path: "ui-buttons", component: lazyView('pages/baseui/ui-buttons') },
      { path: "ui-buttons-group", component: lazyView('pages/baseui/ui-buttons-group') },
      { path: "ui-breadcrumb", component: lazyView('pages/baseui/ui-breadcrumb') },
      { path: "ui-cards", component: lazyView('pages/baseui/ui-cards') },
      { path: "ui-carousel", component: lazyView('pages/baseui/ui-carousel') },
      { path: "ui-colors", component: lazyView('pages/baseui/ui-colors') },
      { path: "ui-dropdowns", component: lazyView('pages/baseui/ui-dropdowns') },
      { path: "ui-grid", component: lazyView('pages/baseui/ui-grid') },
      { path: "ui-images", component: lazyView('pages/baseui/ui-images') },
      { path: "ui-lightbox", component: lazyView('pages/baseui/ui-lightbox') },
      { path: "ui-media", component: lazyView('pages/baseui/ui-media') },
      { path: "ui-modals", component: lazyView('pages/baseui/ui-modals') },
      { path: "ui-offcanvas", component: lazyView('pages/baseui/ui-offcanvas') },
      { path: "ui-pagination", component: lazyView('pages/baseui/ui-pagination') },
      { path: "ui-popovers", component: lazyView('pages/baseui/ui-popovers') },
      { path: "ui-progress", component: lazyView('pages/baseui/ui-progress') },
      { path: "ui-placeholders", component: lazyView('pages/baseui/ui-placeholders') },
      { path: "ui-nav-tabs", component: lazyView('pages/baseui/ui-nav-tabs') },
      { path: "ui-spinner", component: lazyView('pages/baseui/ui-spinner') },
      { path: "ui-sweetalerts", component: lazyView('pages/baseui/ui-sweetalerts') },
      { path: "ui-tooltips", component: lazyView('pages/baseui/ui-tooltips') },
      { path: "ui-typography", component: lazyView('pages/baseui/ui-typography') },
      { path: "ui-video", component: lazyView('pages/baseui/ui-video') },
    ]
  },
  {
    path: '/advancedui',
    component: lazyView('pages/advancedui/advancedui-index'),
    children: [
      { path: '', redirect: '/advancedui/ui-ribbon' },
      { path: "ui-ribbon", component: lazyView('pages/advancedui/ui-ribbon') },
      { path: "ui-clipboard", component: lazyView('pages/advancedui/ui-clipboard') },
      { path: "ui-drag-drop", component: lazyView('pages/advancedui/ui-drag-drop') },
      { path: "ui-text-editor", component: lazyView('pages/advancedui/ui-text-editor') },
      { path: "ui-counter", component: lazyView('pages/advancedui/ui-counter') },
      { path: "ui-scrollbar", component: lazyView('pages/advancedui/ui-scrollbar') },
      { path: "ui-rating", component: lazyView('pages/advancedui/ui-rating') },
      { path: "ui-stickynote", component: lazyView('pages/advancedui/ui-stickynote') },
      { path: "ui-rangeslider", component: lazyView('pages/advancedui/ui-rangeslider') },
      { path: "ui-timeline", component: lazyView('pages/advancedui/ui-timeline') },
    ]
  },
  {
    path: '/tables',
    component: lazyView('pages/tables/tables-index'),
    children: [
      { path: '', redirect: '/tables/data-tables' },
      { path: "data-tables", component: lazyView('pages/tables/data-tables') },
      { path: "tables-basic", component: lazyView('pages/tables/tables-basic') }
    ]
  },
  {
    path: '/charts',
    component: lazyView('pages/charts/charts-index'),
    children: [
      { path: '', redirect: '/charts/chart-apex' },
      { path: "chart-apex", component: lazyView('pages/charts/chart-apex') },
      { path: "chart-c3", component: lazyView('pages/charts/chart-c3') },
      { path: "chart-flot", component: lazyView('pages/charts/chart-flot') },
      { path: "chart-js", component: lazyView('pages/charts/chart-js') },
      { path: "chart-morris", component: lazyView('pages/charts/chart-morris') }
    ]
  },
  {
    path: '/form-elements',
    component: lazyView('pages/forms/form-elements'),
    children: [
      { path: '', redirect: '/form-elements/form-basic-inputs' },
      { path: "form-basic-inputs", component: lazyView('pages/forms/form-basic-inputs') },
      { path: "form-checkbox-radios", component: lazyView('pages/forms/form-checkbox-radios') },
      { path: "form-grid-gutters", component: lazyView('pages/forms/form-grid-gutters') },
      { path: "form-input-groups", component: lazyView('pages/forms/form-input-groups') },
      { path: "form-select", component: lazyView('pages/forms/form-select') },
      { path: "form-mask", component: lazyView('pages/forms/form-mask') },
      { path: "form-fileupload", component: lazyView('pages/forms/form-fileupload') },
    ]
  },
  {
    path: '/form-layouts',
    component: lazyView('pages/forms/form-layouts'),
    children: [
      { path: '', redirect: '/form-layouts/form-horizontal' },
      { path: "form-horizontal", component: lazyView('pages/forms/form-horizontal') },
      { path: "form-vertical", component: lazyView('pages/forms/form-vertical') },
      { path: "form-floating-labels", component: lazyView('pages/forms/form-floating-labels') },
    ]
  },
  {
    path: '/forms',
    component: lazyView('pages/forms/forms-index'),
    children: [
      { path: '', redirect: '/forms/form-validation' },
      { path: "form-validation", component: lazyView('pages/forms/form-validation') },
      { path: "form-select2", component: lazyView('pages/forms/form-select2') },
      { path: "form-wizard", component: lazyView('pages/forms/form-wizard') },
    ]
  },
  {
    path: '/grant',
    component: lazyView('pages/grant/grant-index'),
    beforeEnter: roleGuard(['admin', 'hr-manager', 'hr-assistant']),
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
      {
        path: 'budget-line-list',
        component: lazyView('pages/grant/budget-line-list'),
        meta: {
          title: 'Budget Line List',
        }
      }
    ]
  },
  {
    path: '/requests/travel/admin',
    component: lazyView('pages/requests/travel/travel-index'),
    beforeEnter: roleGuard(['admin', 'hr-manager', 'hr-assistant']),
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
    beforeEnter: roleGuard(['employee', 'hr-manager', 'hr-assistant']),
    meta: {
      requiresAuth: true,
      title: 'Travel Request Employee'
    },

    children: [
      { path: '', component: lazyView('pages/requests/travel/travel-list') },
      { path: ':id', component: lazyView('pages/requests/travel/travel-details') }
    ]
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
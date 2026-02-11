import { createRouter, createWebHistory } from 'vue-router';
import { authGuard, roleGuard, permissionGuard } from './guards';
import LoginIndex from '@/views/pages/authentication/login-index.vue';

/**
 * HRMS Route Component Mapping
 * Explicit imports for Vite static analysis - organized by HRMS module
 */
const routeComponents = {
  // ============================================
  // ADMINISTRATION MODULE
  // ============================================
  'pages/administration/departments/department-list': () => import('@/views/pages/administration/departments/department-list.vue'),
  'pages/administration/file-uploads/file-uploads-list': () => import('@/views/pages/administration/file-uploads/file-uploads-list.vue'),
  'pages/administration/letter-templates/letter-templates-list': () => import('@/views/pages/administration/letter-templates/letter-templates-list.vue'),
  'pages/administration/lookups/lookup-list': () => import('@/views/pages/administration/lookups/lookup-list.vue'),
  'pages/administration/positions/position-list': () => import('@/views/pages/administration/positions/position-list.vue'),
  'pages/administration/recycle-bin/recycle-bin': () => import('@/views/pages/administration/recycle-bin/recycle-bin.vue'),
  'pages/administration/recycle-bin/recycle-bin-list': () => import('@/views/pages/administration/recycle-bin/recycle-bin-list.vue'),
  'pages/administration/role-management/role-list': () => import('@/views/pages/administration/role-management/role-list.vue'),
  'pages/administration/section-departments/section-department-list': () => import('@/views/pages/administration/section-departments/section-department-list.vue'),
  'pages/administration/sites/site-list': () => import('@/views/pages/administration/sites/site-list.vue'),
  'pages/administration/user-management/user-list': () => import('@/views/pages/administration/user-management/user-list.vue'),
  'pages/administration/user-management/user-management': () => import('@/views/pages/administration/user-management/user-management.vue'),

  // ============================================
  // REPORTS MODULE
  // ============================================
  'pages/administration/reports/reports-index': () => import('@/views/pages/administration/reports/reports-index.vue'),
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
  'pages/administration/reports/task-report': () => import('@/views/pages/administration/reports/task-report.vue'),
  'pages/administration/reports/user-report': () => import('@/views/pages/administration/reports/user-report.vue'),

  // ============================================
  // AUTHENTICATION MODULE
  // ============================================
  'pages/authentication/forgot-password': () => import('@/views/pages/authentication/forgot-password.vue'),
  'pages/authentication/reset-password': () => import('@/views/pages/authentication/reset-password.vue'),
  'pages/authentication/unauthorized': () => import('@/views/pages/authentication/unauthorized.vue'),

  // ============================================
  // DASHBOARD MODULE
  // ============================================
  'pages/dashboard/dynamic-dashboard': () => import('@/views/pages/dashboard/dynamic-dashboard.vue'),

  // ============================================
  // PAYROLL & FINANCE MODULE
  // ============================================
  'pages/finance-accounts/payroll/payroll-index': () => import('@/views/pages/finance-accounts/payroll/payroll-index.vue'),
  'pages/finance-accounts/payroll/employee-salary': () => import('@/views/pages/finance-accounts/payroll/employee-salary.vue'),
  'pages/finance-accounts/payroll/add-employee-salary': () => import('@/views/pages/finance-accounts/payroll/add-employee-salary.vue'),
  'pages/finance-accounts/payroll/payslip-index': () => import('@/views/pages/finance-accounts/payroll/payslip-index.vue'),
  'pages/finance-accounts/payroll/payroll-additions': () => import('@/views/pages/finance-accounts/payroll/payroll-additions.vue'),
  'pages/finance-accounts/payroll/payroll-deduction': () => import('@/views/pages/finance-accounts/payroll/payroll-deduction.vue'),
  'pages/finance-accounts/payroll/payroll-overtime': () => import('@/views/pages/finance-accounts/payroll/payroll-overtime.vue'),
  'pages/finance-accounts/payroll/tax-settings': () => import('@/views/pages/finance-accounts/payroll/tax-settings.vue'),
  'pages/finance-accounts/payroll/benefit-settings-list': () => import('@/views/pages/finance-accounts/payroll/benefit-settings-list.vue'),
  'pages/finance-accounts/payroll/BulkPayrollCreate': () => import('@/views/pages/finance-accounts/payroll/BulkPayrollCreate.vue'),
  'pages/finance-accounts/payroll/BulkPayrollProgress': () => import('@/views/pages/finance-accounts/payroll/BulkPayrollProgress.vue'),

  // ============================================
  // GRANT MANAGEMENT MODULE
  // ============================================
  'pages/grant/grant-index': () => import('@/views/pages/grant/grant-index.vue'),
  'pages/grant/grant-list': () => import('@/views/pages/grant/grant-list.vue'),
  'pages/grant/grant-details': () => import('@/views/pages/grant/grant-details.vue'),
  'pages/grant/grant-position-list': () => import('@/views/pages/grant/grant-position-list.vue'),
  'pages/grant/grant-position-details': () => import('@/views/pages/grant/grant-position-details.vue'),

  // ============================================
  // EMPLOYEE MANAGEMENT MODULE
  // ============================================
  'pages/hrm/employees/employees-index': () => import('@/views/pages/hrm/employees/employees-index.vue'),
  'pages/hrm/employees/employees-list': () => import('@/views/pages/hrm/employees/employees-list.vue'),
  'pages/hrm/employees/employees-grid': () => import('@/views/pages/hrm/employees/employees-grid.vue'),
  'pages/hrm/employees/employee-details': () => import('@/views/pages/hrm/employees/employee-details.vue'),
  'pages/hrm/employees/employee-departments': () => import('@/views/pages/hrm/employees/employee-departments.vue'),
  'pages/hrm/employees/employee-positions': () => import('@/views/pages/hrm/employees/employee-positions.vue'),
  'pages/hrm/employees/employee-policy': () => import('@/views/pages/hrm/employees/employee-policy.vue'),
  'pages/hrm/employees/employee-sites': () => import('@/views/pages/hrm/employees/employee-sites.vue'),
  'pages/hrm/employees/employee-resignation': () => import('@/views/pages/hrm/employees/employee-resignation.vue'),
  'pages/hrm/employment/employment-list': () => import('@/views/pages/hrm/employment/employment-list.vue'),

  // ============================================
  // ATTENDANCE & TIME MODULE
  // ============================================
  'pages/hrm/attendance/attendance-index': () => import('@/views/pages/hrm/attendance/attendance-index.vue'),
  'pages/hrm/attendance/attendance-list': () => import('@/views/pages/hrm/attendance/attendance-list.vue'),
  'pages/hrm/attendance/timesheets-list': () => import('@/views/pages/hrm/attendance/timesheets-list.vue'),
  'pages/hrm/attendance/schedule-timing': () => import('@/views/pages/hrm/attendance/schedule-timing.vue'),
  'pages/hrm/attendance/overtime-list': () => import('@/views/pages/hrm/attendance/overtime-list.vue'),

  // ============================================
  // LEAVE MANAGEMENT MODULE
  // ============================================
  'pages/hrm/attendance/leaves/leave-index': () => import('@/views/pages/hrm/attendance/leaves/leave-index.vue'),
  'pages/hrm/attendance/leaves/leaves-admin': () => import('@/views/pages/hrm/attendance/leaves/leaves-admin.vue'),
  'pages/hrm/attendance/leaves/leave-types': () => import('@/views/pages/hrm/attendance/leaves/leave-types.vue'),
  'pages/hrm/attendance/leaves/leave-balances': () => import('@/views/pages/hrm/attendance/leaves/leave-balances.vue'),

  // ============================================
  // PERFORMANCE MANAGEMENT MODULE
  // ============================================
  'pages/hrm/attendance/performance/performance-index': () => import('@/views/pages/hrm/attendance/performance/performance-index.vue'),
  'pages/hrm/attendance/performance/performance-indicator': () => import('@/views/pages/hrm/attendance/performance/performance-indicator.vue'),
  'pages/hrm/attendance/performance/performance-review': () => import('@/views/pages/hrm/attendance/performance/performance-review.vue'),
  'pages/hrm/attendance/performance/performance-appraisal': () => import('@/views/pages/hrm/attendance/performance/performance-appraisal.vue'),
  'pages/hrm/attendance/performance/goal-tracking': () => import('@/views/pages/hrm/attendance/performance/goal-tracking.vue'),
  'pages/hrm/attendance/performance/goal-type': () => import('@/views/pages/hrm/attendance/performance/goal-type.vue'),

  // ============================================
  // HRM GENERAL MODULE
  // ============================================
  'pages/hrm/hrm-index': () => import('@/views/pages/hrm/hrm-index.vue'),
  'pages/hrm/holidays/holidays-list': () => import('@/views/pages/hrm/holidays/holidays-list.vue'),
  'pages/hrm/resignation/resignation-list': () => import('@/views/pages/hrm/resignation/resignation-list.vue'),

  // ============================================
  // TRAINING & DEVELOPMENT MODULE
  // ============================================
  'pages/hrm/training/training-list': () => import('@/views/pages/hrm/training/training-list.vue'),
  'pages/hrm/training/employee-training-list': () => import('@/views/pages/hrm/training/employee-training-list.vue'),

  // ============================================
  // RECRUITMENT MODULE
  // ============================================
  'pages/recruitment/recruitment-index': () => import('@/views/pages/recruitment/recruitment-index.vue'),
  'pages/recruitment/jobs/job-list': () => import('@/views/pages/recruitment/jobs/job-list.vue'),
  'pages/recruitment/jobs/job-grid': () => import('@/views/pages/recruitment/jobs/job-grid.vue'),
  'pages/recruitment/candidates/candidates-list': () => import('@/views/pages/recruitment/candidates/candidates-list.vue'),
  'pages/recruitment/candidates/candidates-grid': () => import('@/views/pages/recruitment/candidates/candidates-grid.vue'),
  'pages/recruitment/candidates/candidates-kanban': () => import('@/views/pages/recruitment/candidates/candidates-kanban.vue'),
  'pages/recruitment/interviews/interviews-list': () => import('@/views/pages/recruitment/interviews/interviews-list.vue'),
  'pages/recruitment/interviews/interviews-details': () => import('@/views/pages/recruitment/interviews/interviews-details.vue'),
  'pages/recruitment/job-offers/job-offers-list': () => import('@/views/pages/recruitment/job-offers/job-offers-list.vue'),
  'pages/recruitment/refferals/refferals-list': () => import('@/views/pages/recruitment/refferals/refferals-list.vue'),

  // ============================================
  // TRAVEL & REQUESTS MODULE
  // ============================================
  'pages/requests/travel/travel-index': () => import('@/views/pages/requests/travel/travel-index.vue'),
  'pages/requests/travel/travel-admin': () => import('@/views/pages/requests/travel/travel-admin.vue'),
  'pages/requests/travel/travel-details': () => import('@/views/pages/requests/travel/travel-details.vue'),

  // ============================================
  // NOTIFICATIONS MODULE
  // ============================================
  'pages/notifications/notification-list': () => import('@/views/pages/notifications/notification-list.vue'),
  'pages/notifications/notification-detail': () => import('@/views/pages/notifications/notification-detail.vue'),

  // ============================================
  // UTILITY PAGES
  // ============================================
  'pages/pages/pages-index': () => import('@/views/pages/pages/pages-index.vue'),
  'pages/pages/profile-index': () => import('@/views/pages/pages/profile-index.vue'),
  'pages/pages/search-result': () => import('@/views/pages/pages/search-result.vue'),
  'pages/pages/timeline-index': () => import('@/views/pages/pages/timeline-index.vue'),
  'pages/pages/coming-soon': () => import('@/views/pages/pages/coming-soon.vue'),
  'pages/pages/under-maintenance': () => import('@/views/pages/pages/under-maintenance.vue'),
  'pages/pages/under-construction': () => import('@/views/pages/pages/under-construction.vue'),
  'pages/pages/terms-condition': () => import('@/views/pages/pages/terms-condition.vue'),
  'pages/pages/privacy-policy': () => import('@/views/pages/pages/privacy-policy.vue'),
};

/**
 * Helper function for lazy loading components
 * Uses explicit imports for multi-level paths (Vite requirement)
 */
const lazyView = (path) => {
  if (routeComponents[path]) {
    return routeComponents[path];
  }

  const pathParts = path.split('/');
  if (pathParts.length > 2) {
    if (!routeComponents[path]) {
      routeComponents[path] = () => import(`@/views/${path}.vue`);
    }
    return routeComponents[path];
  }

  return () => import(`@/views/${path}.vue`);
};

/**
 * HRMS Route Definitions
 * Following professional HRMS naming conventions:
 * - Route paths: kebab-case (e.g., /employee-management)
 * - Route names: PascalCase with module prefix (e.g., HrmEmployeeList)
 * - Titles: Title Case with HR terminology (e.g., "Employee Directory")
 */
const routes = [
  // ============================================
  // AUTHENTICATION ROUTES (Public)
  // ============================================
  {
    path: '/login',
    name: 'AuthLogin',
    component: LoginIndex,
    meta: {
      title: 'Sign In',
      breadcrumb: 'Sign In'
    }
  },
  {
    path: '/forgot-password',
    name: 'AuthForgotPassword',
    component: lazyView('pages/authentication/forgot-password'),
    meta: {
      title: 'Forgot Password',
      breadcrumb: 'Forgot Password'
    }
  },
  {
    path: '/reset-password',
    name: 'AuthResetPassword',
    component: lazyView('pages/authentication/reset-password'),
    meta: {
      title: 'Reset Password',
      breadcrumb: 'Reset Password'
    }
  },
  {
    path: '/unauthorized',
    name: 'AuthUnauthorized',
    component: lazyView('pages/authentication/unauthorized'),
    meta: {
      title: 'Access Denied',
      breadcrumb: 'Unauthorized'
    }
  },

  // ============================================
  // DASHBOARD ROUTES
  // ============================================
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: lazyView('pages/dashboard/dynamic-dashboard'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
      breadcrumb: 'Dashboard'
    }
  },

  // Legacy dashboard redirects
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
      return (user && userRole) ? '/dashboard' : '/login';
    }
  },

  // ============================================
  // ADMINISTRATION ROUTES
  // ============================================
  {
    path: '/sites',
    name: 'AdminSiteList',
    component: lazyView('pages/administration/sites/site-list'),
    beforeEnter: permissionGuard('sites.read'),
    meta: {
      requiresAuth: true,
      title: 'Site Management',
      breadcrumb: 'Sites'
    }
  },
  {
    path: '/departments',
    name: 'AdminDepartmentList',
    component: lazyView('pages/administration/departments/department-list'),
    beforeEnter: permissionGuard('departments.read'),
    meta: {
      requiresAuth: true,
      title: 'Department Management',
      breadcrumb: 'Departments'
    }
  },
  {
    path: '/positions',
    name: 'AdminPositionList',
    component: lazyView('pages/administration/positions/position-list'),
    beforeEnter: permissionGuard('positions.read'),
    meta: {
      requiresAuth: true,
      title: 'Position Management',
      breadcrumb: 'Positions'
    }
  },
  {
    path: '/section-departments',
    name: 'AdminSectionDepartmentList',
    component: lazyView('pages/administration/section-departments/section-department-list'),
    beforeEnter: permissionGuard('section_departments.read'),
    meta: {
      requiresAuth: true,
      title: 'Section Department Management',
      breadcrumb: 'Section Departments'
    }
  },
  {
    path: '/lookups',
    name: 'AdminLookupList',
    component: lazyView('pages/administration/lookups/lookup-list'),
    beforeEnter: permissionGuard(['lookup_list.read', 'lookup_list.edit']),
    meta: {
      requiresAuth: true,
      title: 'Lookup Management',
      breadcrumb: 'Lookups'
    }
  },
  {
    path: '/user-management',
    name: 'AdminUserManagement',
    component: lazyView('pages/administration/user-management/user-management'),
    beforeEnter: permissionGuard('users.read'),
    meta: {
      requiresAuth: true,
      title: 'User & Role Management',
      breadcrumb: 'User Management'
    },
    children: [
      {
        path: '',
        redirect: '/user-management/users'
      },
      {
        path: 'users',
        name: 'AdminUserList',
        component: lazyView('pages/administration/user-management/user-list'),
        meta: {
          title: 'User Directory',
          breadcrumb: 'Users'
        }
      },
      {
        path: 'roles',
        name: 'AdminRoleList',
        component: lazyView('pages/administration/role-management/role-list'),
        meta: {
          title: 'Role Management',
          breadcrumb: 'Roles'
        }
      },
    ]
  },
  {
    path: '/letter-templates',
    name: 'AdminLetterTemplates',
    component: lazyView('pages/administration/letter-templates/letter-templates-list'),
    beforeEnter: permissionGuard('letter_templates.read'),
    meta: {
      requiresAuth: true,
      title: 'Letter Templates',
      breadcrumb: 'Letter Templates'
    }
  },
  {
    path: '/file-uploads',
    name: 'AdminFileUploads',
    component: lazyView('pages/administration/file-uploads/file-uploads-list'),
    beforeEnter: permissionGuard('file_uploads.read'),
    meta: {
      requiresAuth: true,
      title: 'File Upload Management',
      breadcrumb: 'File Uploads'
    }
  },
  {
    path: '/recycle-bin',
    name: 'AdminRecycleBin',
    component: lazyView('pages/administration/recycle-bin/recycle-bin'),
    beforeEnter: permissionGuard('recycle_bin_list.read'),
    meta: {
      requiresAuth: true,
      title: 'Recycle Bin',
      breadcrumb: 'Recycle Bin'
    },
    children: [
      {
        path: '',
        redirect: '/recycle-bin/list'
      },
      {
        path: 'list',
        name: 'AdminRecycleBinList',
        component: lazyView('pages/administration/recycle-bin/recycle-bin-list'),
        meta: {
          title: 'Deleted Records',
          breadcrumb: 'Deleted Items'
        }
      }
    ]
  },

  // ============================================
  // EMPLOYEE MANAGEMENT ROUTES
  // ============================================
  {
    path: '/employee',
    name: 'HrmEmployeeManagement',
    component: lazyView('pages/hrm/employees/employees-index'),
    beforeEnter: permissionGuard(['employees.read', 'employment_records.read', 'employee_resignation.read']),
    meta: {
      requiresAuth: true,
      title: 'Employee Management',
      breadcrumb: 'Employees'
    },
    children: [
      {
        path: '',
        redirect: '/employee/employee-list'
      },
      {
        path: 'employee-list',
        name: 'HrmEmployeeList',
        component: lazyView('pages/hrm/employees/employees-list'),
        meta: {
          title: 'Employee Directory',
          breadcrumb: 'Employee List'
        }
      },
      {
        path: 'employee-grid',
        name: 'HrmEmployeeGrid',
        component: lazyView('pages/hrm/employees/employees-grid'),
        meta: {
          title: 'Employee Gallery',
          breadcrumb: 'Employee Grid'
        }
      },
      {
        path: 'employee-details/:id',
        name: 'HrmEmployeeDetails',
        component: lazyView('pages/hrm/employees/employee-details'),
        meta: {
          title: 'Employee Profile',
          breadcrumb: 'Employee Details'
        }
      },
      {
        path: 'employment-list',
        name: 'HrmEmploymentList',
        component: lazyView('pages/hrm/employment/employment-list'),
        meta: {
          title: 'Employment Records',
          breadcrumb: 'Employment List'
        }
      },
      {
        path: 'departments',
        name: 'HrmEmployeeDepartments',
        component: lazyView('pages/hrm/employees/employee-departments'),
        meta: {
          title: 'Employee Departments',
          breadcrumb: 'Departments'
        }
      },
      {
        path: 'positions',
        name: 'HrmEmployeePositions',
        component: lazyView('pages/hrm/employees/employee-positions'),
        meta: {
          title: 'Employee Positions',
          breadcrumb: 'Positions'
        }
      },
      {
        path: 'policy',
        name: 'HrmEmployeePolicy',
        component: lazyView('pages/hrm/employees/employee-policy'),
        meta: {
          title: 'Employee Policies',
          breadcrumb: 'Policies'
        }
      },
      {
        path: 'site',
        name: 'HrmEmployeeSites',
        component: lazyView('pages/hrm/employees/employee-sites'),
        meta: {
          title: 'Employee Sites',
          breadcrumb: 'Sites'
        }
      },
      {
        path: 'employee-resignation',
        name: 'HrmEmployeeResignation',
        component: lazyView('pages/hrm/employees/employee-resignation'),
        meta: {
          title: 'Resignation Requests',
          breadcrumb: 'Resignations'
        }
      },
    ]
  },

  // ============================================
  // ATTENDANCE & TIME MANAGEMENT ROUTES
  // ============================================
  {
    path: '/attendance',
    component: lazyView('pages/hrm/attendance/attendance-index'),
    meta: {
      requiresAuth: true,
      title: 'Attendance Management',
      breadcrumb: 'Attendance'
    },
    children: [
      {
        path: '',
        name: 'HrmAttendance',
        redirect: '/attendance/attendance-list'
      },
      {
        path: 'attendance-list',
        name: 'HrmAttendanceList',
        component: lazyView('pages/hrm/attendance/attendance-list'),
        meta: {
          title: 'Attendance List',
          breadcrumb: 'Attendance List'
        }
      },
      {
        path: 'timesheets',
        name: 'HrmTimesheets',
        component: lazyView('pages/hrm/attendance/timesheets-list'),
        meta: {
          title: 'Timesheet Management',
          breadcrumb: 'Timesheets'
        }
      },
      {
        path: 'schedule-timing',
        name: 'HrmWorkSchedule',
        component: lazyView('pages/hrm/attendance/schedule-timing'),
        meta: {
          title: 'Work Schedule',
          breadcrumb: 'Schedule'
        }
      },
      {
        path: 'overtime',
        name: 'HrmOvertime',
        component: lazyView('pages/hrm/attendance/overtime-list'),
        meta: {
          title: 'Overtime Records',
          breadcrumb: 'Overtime'
        }
      }
    ]
  },

  // ============================================
  // LEAVE MANAGEMENT ROUTES
  // ============================================
  {
    path: '/leave/admin',
    component: lazyView('pages/hrm/attendance/leaves/leave-index'),
    beforeEnter: permissionGuard(['leaves_admin.read', 'leave_types.read', 'leave_balances.read']),
    meta: {
      requiresAuth: true,
      title: 'Leave Management',
      breadcrumb: 'Leaves'
    },
    children: [
      {
        path: '',
        name: 'HrmLeaveAdmin',
        redirect: '/leave/admin/leaves-admin'
      },
      {
        path: 'leaves-admin',
        name: 'HrmLeaveRequests',
        component: lazyView('pages/hrm/attendance/leaves/leaves-admin'),
        meta: {
          title: 'Leave Request List',
          breadcrumb: 'Leave Requests'
        }
      },
      {
        path: 'leave-types',
        name: 'HrmLeaveTypes',
        component: lazyView('pages/hrm/attendance/leaves/leave-types'),
        meta: {
          title: 'Leave Types',
          breadcrumb: 'Leave Types'
        }
      },
      {
        path: 'leave-balances',
        name: 'HrmLeaveBalances',
        component: lazyView('pages/hrm/attendance/leaves/leave-balances'),
        meta: {
          title: 'Leave Balances',
          breadcrumb: 'Balances'
        }
      },
    ]
  },
  // Redirect old employee leave route to admin
  {
    path: '/leave/employee',
    redirect: '/leave/admin/leaves-admin'
  },

  // ============================================
  // PERFORMANCE MANAGEMENT ROUTES
  // ============================================
  {
    path: '/performance',
    component: lazyView('pages/hrm/attendance/performance/performance-index'),
    meta: {
      requiresAuth: true,
      title: 'Performance Management',
      breadcrumb: 'Performance'
    },
    children: [
      {
        path: '',
        name: 'HrmPerformance',
        redirect: '/performance/performance-indicator'
      },
      {
        path: 'performance-indicator',
        name: 'HrmPerformanceIndicators',
        component: lazyView('pages/hrm/attendance/performance/performance-indicator'),
        meta: {
          title: 'Performance Indicators (KPIs)',
          breadcrumb: 'Indicators'
        }
      },
      {
        path: 'performance-review',
        name: 'HrmPerformanceReviews',
        component: lazyView('pages/hrm/attendance/performance/performance-review'),
        meta: {
          title: 'Performance Reviews',
          breadcrumb: 'Reviews'
        }
      },
      {
        path: 'performance-appraisal',
        name: 'HrmPerformanceAppraisals',
        component: lazyView('pages/hrm/attendance/performance/performance-appraisal'),
        meta: {
          title: 'Performance Appraisals',
          breadcrumb: 'Appraisals'
        }
      },
      {
        path: 'goal-tracking',
        name: 'HrmGoalTracking',
        component: lazyView('pages/hrm/attendance/performance/goal-tracking'),
        meta: {
          title: 'Goal Tracking',
          breadcrumb: 'Goals'
        }
      },
      {
        path: 'goal-type',
        name: 'HrmGoalTypes',
        component: lazyView('pages/hrm/attendance/performance/goal-type'),
        meta: {
          title: 'Goal Types',
          breadcrumb: 'Goal Types'
        }
      },
    ]
  },

  // ============================================
  // HRM GENERAL ROUTES
  // ============================================
  {
    path: '/hrm',
    component: lazyView('pages/hrm/hrm-index'),
    meta: {
      requiresAuth: true,
      title: 'HR Management',
      breadcrumb: 'HRM'
    },
    children: [
      {
        path: '',
        name: 'HrmGeneral',
        redirect: '/hrm/holidays'
      },
      {
        path: 'holidays',
        name: 'HrmHolidays',
        component: lazyView('pages/hrm/holidays/holidays-list'),
        meta: {
          title: 'Holiday Calendar',
          breadcrumb: 'Holidays'
        }
      },
      {
        path: 'resignation',
        name: 'HrmResignations',
        component: lazyView('pages/hrm/resignation/resignation-list'),
        meta: {
          title: 'Resignation Records',
          breadcrumb: 'Resignations'
        }
      },
    ]
  },

  // ============================================
  // TRAINING & DEVELOPMENT ROUTES
  // ============================================
  {
    path: '/training/training-list',
    name: 'HrmTrainingList',
    component: lazyView('pages/hrm/training/training-list'),
    beforeEnter: permissionGuard('training_list.read'),
    meta: {
      requiresAuth: true,
      title: 'Training Programs',
      breadcrumb: 'Training List'
    }
  },
  {
    path: '/training/employee-training-list',
    name: 'HrmEmployeeTraining',
    component: lazyView('pages/hrm/training/employee-training-list'),
    beforeEnter: permissionGuard('employee_training.read'),
    meta: {
      requiresAuth: true,
      title: 'Employee Training Records',
      breadcrumb: 'Employee Training'
    }
  },

  // ============================================
  // PAYROLL & FINANCE ROUTES
  // ============================================
  {
    path: '/payroll',
    component: lazyView('pages/finance-accounts/payroll/payroll-index'),
    meta: {
      requiresAuth: true,
      title: 'Payroll Management',
      breadcrumb: 'Payroll'
    },
    children: [
      {
        path: '',
        name: 'PayrollManagement',
        redirect: '/payroll/employee-salary'
      },
      {
        path: 'employee-salary',
        name: 'PayrollSalaryList',
        component: lazyView('pages/finance-accounts/payroll/employee-salary'),
        beforeEnter: permissionGuard('employee_salary.read'),
        meta: {
          title: 'Salary Management',
          breadcrumb: 'Employee Salary'
        }
      },
      {
        path: 'add-employee-salary',
        name: 'PayrollSalaryCreate',
        component: lazyView('pages/finance-accounts/payroll/add-employee-salary'),
        beforeEnter: permissionGuard('employee_salary.edit'),
        meta: {
          title: 'Add Salary Record',
          breadcrumb: 'Add Salary'
        }
      },
      {
        path: 'payslip',
        name: 'PayrollPayslips',
        component: lazyView('pages/finance-accounts/payroll/payslip-index'),
        beforeEnter: permissionGuard('employee_salary.read'),
        meta: {
          title: 'Payslip Generation',
          breadcrumb: 'Payslips'
        }
      },
      {
        path: 'payroll',
        name: 'PayrollAdditions',
        component: lazyView('pages/finance-accounts/payroll/payroll-additions'),
        beforeEnter: permissionGuard('payroll_items.read'),
        meta: {
          title: 'Salary Additions',
          breadcrumb: 'Additions'
        }
      },
      {
        path: 'payroll-overtime',
        name: 'PayrollOvertime',
        component: lazyView('pages/finance-accounts/payroll/payroll-overtime'),
        beforeEnter: permissionGuard('payroll_items.read'),
        meta: {
          title: 'Overtime Payments',
          breadcrumb: 'Overtime'
        }
      },
      {
        path: 'payroll-deduction',
        name: 'PayrollDeductions',
        component: lazyView('pages/finance-accounts/payroll/payroll-deduction'),
        beforeEnter: permissionGuard('payroll_items.read'),
        meta: {
          title: 'Salary Deductions',
          breadcrumb: 'Deductions'
        }
      },
      {
        path: 'tax-settings',
        name: 'PayrollTaxSettings',
        component: lazyView('pages/finance-accounts/payroll/tax-settings'),
        beforeEnter: permissionGuard('tax_settings.read'),
        meta: {
          title: 'Tax Configuration',
          breadcrumb: 'Tax Settings'
        }
      },
      {
        path: 'benefit-settings',
        name: 'PayrollBenefitSettings',
        component: lazyView('pages/finance-accounts/payroll/benefit-settings-list'),
        beforeEnter: permissionGuard('benefit_settings.read'),
        meta: {
          title: 'Benefits Configuration',
          breadcrumb: 'Benefit Settings'
        }
      },
      {
        path: 'bulk-create',
        name: 'PayrollBulkCreate',
        component: lazyView('pages/finance-accounts/payroll/BulkPayrollCreate'),
        beforeEnter: permissionGuard('employee_salary.edit'),
        meta: {
          title: 'Bulk Payroll Processing',
          breadcrumb: 'Bulk Create'
        }
      },
      {
        path: 'bulk-progress/:batchId',
        name: 'PayrollBulkProgress',
        component: lazyView('pages/finance-accounts/payroll/BulkPayrollProgress'),
        beforeEnter: permissionGuard('employee_salary.edit'),
        meta: {
          title: 'Payroll Processing Status',
          breadcrumb: 'Processing Status'
        }
      },
    ]
  },

  // ============================================
  // GRANT MANAGEMENT ROUTES
  // ============================================
  {
    path: '/grant',
    component: lazyView('pages/grant/grant-index'),
    beforeEnter: permissionGuard(['grants_list.read', 'grant_position.read']),
    meta: {
      requiresAuth: true,
      title: 'Grant Management',
      breadcrumb: 'Grants'
    },
    children: [
      {
        path: '',
        name: 'GrantManagement',
        redirect: '/grant/list'
      },
      {
        path: 'list',
        name: 'GrantList',
        component: lazyView('pages/grant/grant-list'),
        meta: {
          title: 'Grant Directory',
          breadcrumb: 'Grant List',
          requiresAuth: true,
          roles: ['admin', 'hr-manager']
        }
      },
      {
        path: 'details/:id',
        name: 'GrantDetails',
        component: lazyView('pages/grant/grant-details'),
        meta: {
          title: 'Grant Details',
          breadcrumb: 'Grant Details',
          requiresAuth: true,
          roles: ['admin', 'hr-manager']
        }
      },
      {
        path: 'grant-position',
        name: 'GrantPositionList',
        component: lazyView('pages/grant/grant-position-list'),
        meta: {
          title: 'Grant Positions',
          breadcrumb: 'Grant Positions'
        }
      },
      {
        path: 'grant-position-details/:id',
        name: 'GrantPositionDetails',
        component: lazyView('pages/grant/grant-position-details'),
        meta: {
          title: 'Grant Position Details',
          breadcrumb: 'Position Details'
        }
      },
      {
        path: 'grant-allocate-employee/:id',
        name: 'GrantAllocateEmployee',
        component: () => import('@/components/modal/grant-allocate-employee-modal.vue'),
        meta: {
          title: 'Allocate Employee to Grant',
          breadcrumb: 'Allocate Employee'
        }
      },
    ]
  },

  // ============================================
  // RECRUITMENT ROUTES
  // ============================================
  {
    path: '/recruitment',
    component: lazyView('pages/recruitment/recruitment-index'),
    beforeEnter: permissionGuard(['interviews.read', 'job_offers.read']),
    meta: {
      requiresAuth: true,
      title: 'Recruitment Management',
      breadcrumb: 'Recruitment'
    },
    children: [
      {
        path: '',
        name: 'RecruitmentManagement',
        redirect: '/recruitment/job-list'
      },
      {
        path: 'job-list',
        name: 'RecruitmentJobList',
        component: lazyView('pages/recruitment/jobs/job-list'),
        meta: {
          title: 'Job Postings',
          breadcrumb: 'Job List'
        }
      },
      {
        path: 'job-grid',
        name: 'RecruitmentJobGrid',
        component: lazyView('pages/recruitment/jobs/job-grid'),
        meta: {
          title: 'Job Postings Gallery',
          breadcrumb: 'Job Grid'
        }
      },
      {
        path: 'candidates-list',
        name: 'RecruitmentCandidateList',
        component: lazyView('pages/recruitment/candidates/candidates-list'),
        meta: {
          title: 'Candidate Directory',
          breadcrumb: 'Candidates'
        }
      },
      {
        path: 'candidates-grid',
        name: 'RecruitmentCandidateGrid',
        component: lazyView('pages/recruitment/candidates/candidates-grid'),
        meta: {
          title: 'Candidate Gallery',
          breadcrumb: 'Candidate Grid'
        }
      },
      {
        path: 'candidates-kanban',
        name: 'RecruitmentCandidateKanban',
        component: lazyView('pages/recruitment/candidates/candidates-kanban'),
        meta: {
          title: 'Candidate Pipeline',
          breadcrumb: 'Kanban View'
        }
      },
      {
        path: 'refferals',
        name: 'RecruitmentReferrals',
        component: lazyView('pages/recruitment/refferals/refferals-list'),
        meta: {
          title: 'Employee Referrals',
          breadcrumb: 'Referrals'
        }
      },
      {
        path: 'interviews-list',
        name: 'RecruitmentInterviewList',
        component: lazyView('pages/recruitment/interviews/interviews-list'),
        beforeEnter: permissionGuard('interviews.read'),
        meta: {
          title: 'Interview Schedule',
          breadcrumb: 'Interviews'
        }
      },
      {
        path: 'job-offers-list',
        name: 'RecruitmentJobOfferList',
        component: lazyView('pages/recruitment/job-offers/job-offers-list'),
        beforeEnter: permissionGuard('job_offers.read'),
        meta: {
          title: 'Job Offers',
          breadcrumb: 'Job Offers'
        }
      },
      {
        path: 'interviews-details/:id',
        name: 'RecruitmentInterviewDetails',
        component: lazyView('pages/recruitment/interviews/interviews-details'),
        meta: {
          title: 'Interview Details',
          breadcrumb: 'Interview Details'
        }
      },
    ]
  },

  // ============================================
  // TRAVEL REQUEST ROUTES
  // ============================================
  {
    path: '/requests/travel/admin',
    name: 'TravelRequestAdmin',
    component: lazyView('pages/requests/travel/travel-index'),
    beforeEnter: permissionGuard('travel_admin.read'),
    meta: {
      requiresAuth: true,
      title: 'Travel Request List',
      breadcrumb: 'Travel Requests'
    },
    children: [
      {
        path: '',
        name: 'TravelRequestList',
        component: lazyView('pages/requests/travel/travel-admin'),
        meta: {
          title: 'Travel Request List',
          breadcrumb: 'All Requests'
        }
      },
      {
        path: ':id',
        name: 'TravelRequestDetails',
        component: lazyView('pages/requests/travel/travel-details'),
        meta: {
          title: 'Travel Request Details',
          breadcrumb: 'Request Details'
        }
      }
    ]
  },
  // Redirect old employee travel route to unified page
  {
    path: '/requests/travel',
    redirect: '/requests/travel/admin'
  },

  // ============================================
  // REPORTS ROUTES
  // ============================================
  {
    path: '/reports',
    component: lazyView('pages/administration/reports/reports-index'),
    meta: {
      requiresAuth: true,
      title: 'Reports & Analytics',
      breadcrumb: 'Reports'
    },
    children: [
      {
        path: '',
        name: 'ReportManagement',
        redirect: '/reports/employee-report'
      },
      {
        path: 'employee-report',
        name: 'ReportEmployee',
        component: lazyView('pages/administration/reports/employee-report'),
        meta: {
          title: 'Employee Reports',
          breadcrumb: 'Employee Report'
        }
      },
      {
        path: 'attendance-report',
        name: 'ReportAttendance',
        component: lazyView('pages/administration/reports/attendance-report'),
        meta: {
          title: 'Attendance Reports',
          breadcrumb: 'Attendance Report'
        }
      },
      {
        path: 'leave-report',
        name: 'ReportLeave',
        component: lazyView('pages/administration/reports/leave-report'),
        meta: {
          title: 'Leave Reports',
          breadcrumb: 'Leave Report'
        }
      },
      {
        path: 'payslip-report',
        name: 'ReportPayslip',
        component: lazyView('pages/administration/reports/payslip-report'),
        meta: {
          title: 'Payslip Reports',
          breadcrumb: 'Payslip Report'
        }
      },
      {
        path: 'daily-report',
        name: 'ReportDaily',
        component: lazyView('pages/administration/reports/daily-report'),
        meta: {
          title: 'Daily Reports',
          breadcrumb: 'Daily Report'
        }
      },
      {
        path: 'expenses-report',
        name: 'ReportExpenses',
        component: lazyView('pages/administration/reports/expenses-report'),
        meta: {
          title: 'Expense Reports',
          breadcrumb: 'Expense Report'
        }
      },
      {
        path: 'invoice-report',
        name: 'ReportInvoice',
        component: lazyView('pages/administration/reports/invoice-report'),
        meta: {
          title: 'Invoice Reports',
          breadcrumb: 'Invoice Report'
        }
      },
      {
        path: 'payment-report',
        name: 'ReportPayment',
        component: lazyView('pages/administration/reports/payment-report'),
        meta: {
          title: 'Payment Reports',
          breadcrumb: 'Payment Report'
        }
      },
      {
        path: 'project-report',
        name: 'ReportProject',
        component: lazyView('pages/administration/reports/project-report'),
        meta: {
          title: 'Project Reports',
          breadcrumb: 'Project Report'
        }
      },
      {
        path: 'task-report',
        name: 'ReportTask',
        component: lazyView('pages/administration/reports/task-report'),
        meta: {
          title: 'Task Reports',
          breadcrumb: 'Task Report'
        }
      },
      {
        path: 'user-report',
        name: 'ReportUser',
        component: lazyView('pages/administration/reports/user-report'),
        meta: {
          title: 'User Reports',
          breadcrumb: 'User Report'
        }
      },
      {
        path: 'report-list',
        name: 'ReportList',
        component: lazyView('pages/administration/reports/report-list'),
        meta: {
          title: 'All Reports',
          breadcrumb: 'Report List'
        }
      },
    ]
  },

  // ============================================
  // NOTIFICATION ROUTES
  // ============================================
  {
    path: '/notifications',
    name: 'NotificationList',
    component: lazyView('pages/notifications/notification-list'),
    meta: {
      requiresAuth: true,
      title: 'Notifications',
      breadcrumb: 'Notifications'
    }
  },
  {
    path: '/notifications/:id',
    name: 'NotificationDetails',
    component: lazyView('pages/notifications/notification-detail'),
    meta: {
      requiresAuth: true,
      title: 'Notification Details',
      breadcrumb: 'Notification Detail'
    }
  },

  // ============================================
  // UTILITY PAGES
  // ============================================
  {
    path: '/pages',
    component: lazyView('pages/pages/pages-index'),
    meta: {
      title: 'Utility Pages',
      breadcrumb: 'Pages'
    },
    children: [
      {
        path: '',
        name: 'UtilityPages',
        redirect: '/pages/profile'
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: lazyView('pages/pages/profile-index'),
        meta: {
          title: 'My Profile',
          breadcrumb: 'Profile'
        }
      },
      {
        path: 'search-result',
        name: 'SearchResults',
        component: lazyView('pages/pages/search-result'),
        meta: {
          title: 'Search Results',
          breadcrumb: 'Search'
        }
      },
      {
        path: 'timeline',
        name: 'ActivityTimeline',
        component: lazyView('pages/pages/timeline-index'),
        meta: {
          title: 'Activity Timeline',
          breadcrumb: 'Timeline'
        }
      },
      {
        path: 'coming-soon',
        name: 'ComingSoon',
        component: lazyView('pages/pages/coming-soon'),
        meta: {
          title: 'Coming Soon',
          breadcrumb: 'Coming Soon'
        }
      },
      {
        path: 'under-maintenance',
        name: 'UnderMaintenance',
        component: lazyView('pages/pages/under-maintenance'),
        meta: {
          title: 'Under Maintenance',
          breadcrumb: 'Maintenance'
        }
      },
      {
        path: 'under-construction',
        name: 'UnderConstruction',
        component: lazyView('pages/pages/under-construction'),
        meta: {
          title: 'Under Construction',
          breadcrumb: 'Construction'
        }
      },
      {
        path: 'terms-condition',
        name: 'TermsAndConditions',
        component: lazyView('pages/pages/terms-condition'),
        meta: {
          title: 'Terms & Conditions',
          breadcrumb: 'Terms'
        }
      },
      {
        path: 'privacy-policy',
        name: 'PrivacyPolicy',
        component: lazyView('pages/pages/privacy-policy'),
        meta: {
          title: 'Privacy Policy',
          breadcrumb: 'Privacy'
        }
      },
    ]
  },
];

/**
 * Create Vue Router instance
 */
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes,
});

/**
 * Dynamic page title handling
 */
router.afterEach((to) => {
  // Handle RTL layout
  if (to.name === 'layout-rtl') {
    document.body.classList.add('layout-mode-rtl');
  } else {
    document.body.classList.remove('layout-mode-rtl');
  }

  // Update page title
  const appName = 'HRMS';
  const pageTitle = to.meta.title || appName;
  document.title = to.meta.title ? `${pageTitle} - ${appName}` : appName;
});

/**
 * Scroll to top on navigation
 */
router.beforeEach((to, from, next) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  next();
});

/**
 * Global authentication guard
 */
router.beforeEach(authGuard);

export default router;

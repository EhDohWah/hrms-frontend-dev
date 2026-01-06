/**
 * ==============================================================================
 * ROUTER CLEANUP SCRIPT
 * ==============================================================================
 * This file contains the cleaned router configuration with unused routes removed
 *
 * INSTRUCTIONS:
 * 1. Backup your current src/router/index.js first
 * 2. Review this file carefully
 * 3. Replace src/router/index.js with this content
 * 4. Test all navigation paths
 *
 * Routes removed:
 * - /applications/* (unused module)
 * - /crm/* (unused module)
 * - /projects/* (unused module)
 * - /content/* (unused module)
 * - /sales/* (unused module)
 * - /accounting/* (unused module)
 * - /supports/* (unused module)
 * - /asset/* (unused module)
 * - /layouts/* (demo pages)
 * - /pages/* (demo pages)
 * - /website-settings/* (unused settings)
 * - /financial-settings/* (unused settings)
 * - /app-settings/* (unused settings)
 * ==============================================================================
 */

import { createRouter, createWebHistory } from 'vue-router';
import { setupRouterGuards } from './guards';

// Lazy loading helper
const lazyView = path => () => import(`@/views/${path}.vue`);

const routes = [
  // ============================================================================
  // AUTHENTICATION ROUTES
  // ============================================================================
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: lazyView('pages/authentication/login-index'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: lazyView('pages/authentication/register-index'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: lazyView('pages/authentication/forgot-password'),
    meta: { requiresAuth: false }
  },

  // ============================================================================
  // MAIN APPLICATION LAYOUT
  // ============================================================================
  {
    path: '/app',
    component: lazyView('layouts/layout-default'),
    meta: { requiresAuth: true },
    children: [
      // ------------------------------------------------------------------------
      // DASHBOARD
      // ------------------------------------------------------------------------
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: lazyView('pages/dashboard/dynamic-dashboard'),
        meta: {
          requiresAuth: true,
          title: 'Dashboard'
        }
      },

      // ------------------------------------------------------------------------
      // GRANT MANAGEMENT
      // ------------------------------------------------------------------------
      {
        path: '/grant/list',
        name: 'GrantList',
        component: lazyView('pages/grant/grant-list'),
        meta: {
          requiresAuth: true,
          title: 'Grants List',
          permission: 'grant.view'
        }
      },
      {
        path: '/grant/details/:id',
        name: 'GrantDetails',
        component: lazyView('pages/grant/grant-details'),
        meta: {
          requiresAuth: true,
          title: 'Grant Details',
          permission: 'grant.view'
        }
      },
      {
        path: '/grant/grant-position',
        name: 'GrantPosition',
        component: lazyView('pages/grant/grant-position-list'),
        meta: {
          requiresAuth: true,
          title: 'Grant Positions',
          permission: 'grant.view'
        }
      },

      // ------------------------------------------------------------------------
      // RECRUITMENT
      // ------------------------------------------------------------------------
      {
        path: '/recruitment/interviews',
        name: 'Interviews',
        component: lazyView('pages/recruitment/interviews/interviews-list'),
        meta: {
          requiresAuth: true,
          title: 'Interviews',
          permission: 'recruitment.view'
        }
      },
      {
        path: '/recruitment/interviews/:id',
        name: 'InterviewDetails',
        component: lazyView('pages/recruitment/interviews/interviews-details'),
        meta: {
          requiresAuth: true,
          title: 'Interview Details',
          permission: 'recruitment.view'
        }
      },
      {
        path: '/recruitment/job-offers',
        name: 'JobOffers',
        component: lazyView('pages/recruitment/job-offers/job-offers-list'),
        meta: {
          requiresAuth: true,
          title: 'Job Offers',
          permission: 'recruitment.view'
        }
      },

      // ------------------------------------------------------------------------
      // EMPLOYEE MANAGEMENT
      // ------------------------------------------------------------------------
      {
        path: '/employee/employee-list',
        name: 'EmployeesList',
        component: lazyView('pages/hrm/employees/employees-list'),
        meta: {
          requiresAuth: true,
          title: 'Employees List',
          permission: 'employee.view'
        }
      },
      {
        path: '/employee/employee-details/:id',
        name: 'EmployeeDetails',
        component: lazyView('pages/hrm/employees/employee-details'),
        meta: {
          requiresAuth: true,
          title: 'Employee Details',
          permission: 'employee.view'
        }
      },
      {
        path: '/employee/employment-list',
        name: 'EmploymentList',
        component: lazyView('pages/hrm/employment/employment-list'),
        meta: {
          requiresAuth: true,
          title: 'Employment Records',
          permission: 'employment.view'
        }
      },
      {
        path: '/employee/resignation',
        name: 'EmployeeResignation',
        component: lazyView('pages/hrm/employees/employee-resignation'),
        meta: {
          requiresAuth: true,
          title: 'Employee Resignation',
          permission: 'resignation.view'
        }
      },
      {
        path: '/hrm/resignation/resignation-list',
        name: 'ResignationList',
        component: lazyView('pages/hrm/resignation/resignation-list'),
        meta: {
          requiresAuth: true,
          title: 'Resignation List',
          permission: 'resignation.view'
        }
      },

      // ------------------------------------------------------------------------
      // HRM - HOLIDAYS
      // ------------------------------------------------------------------------
      {
        path: '/hrm/holidays',
        name: 'Holidays',
        component: lazyView('pages/hrm/holidays/holidays-list'),
        meta: {
          requiresAuth: true,
          title: 'Holidays',
          permission: 'holidays.view'
        }
      },

      // ------------------------------------------------------------------------
      // HRM - LEAVES
      // ------------------------------------------------------------------------
      {
        path: '/hrm/leaves/admin',
        name: 'LeavesAdmin',
        component: lazyView('pages/hrm/attendance/leaves/leaves-admin'),
        meta: {
          requiresAuth: true,
          title: 'Leaves Admin',
          permission: 'leaves.admin'
        }
      },
      {
        path: '/hrm/leaves/employee',
        name: 'LeavesEmployee',
        component: lazyView('pages/hrm/attendance/leaves/leaves-employee'),
        meta: {
          requiresAuth: true,
          title: 'My Leaves',
          permission: 'leaves.view'
        }
      },
      {
        path: '/hrm/leaves/types',
        name: 'LeaveTypes',
        component: lazyView('pages/hrm/attendance/leaves/leave-types'),
        meta: {
          requiresAuth: true,
          title: 'Leave Types',
          permission: 'leaves.admin'
        }
      },
      {
        path: '/hrm/leaves/balances',
        name: 'LeaveBalances',
        component: lazyView('pages/hrm/attendance/leaves/leave-balances'),
        meta: {
          requiresAuth: true,
          title: 'Leave Balances',
          permission: 'leaves.admin'
        }
      },
      {
        path: '/hrm/leaves/settings',
        name: 'LeaveSettings',
        component: lazyView('pages/hrm/attendance/leaves/leave-settings'),
        meta: {
          requiresAuth: true,
          title: 'Leave Settings',
          permission: 'leaves.admin'
        }
      },

      // ------------------------------------------------------------------------
      // HRM - TRAVEL
      // ------------------------------------------------------------------------
      {
        path: '/hrm/travel/list',
        name: 'TravelList',
        component: lazyView('pages/requests/travel/travel-list'),
        meta: {
          requiresAuth: true,
          title: 'My Travel Requests',
          permission: 'travel.view'
        }
      },
      {
        path: '/hrm/travel/admin',
        name: 'TravelAdmin',
        component: lazyView('pages/requests/travel/travel-admin'),
        meta: {
          requiresAuth: true,
          title: 'Travel Admin',
          permission: 'travel.admin'
        }
      },
      {
        path: '/hrm/travel/details/:id',
        name: 'TravelDetails',
        component: lazyView('pages/requests/travel/travel-details'),
        meta: {
          requiresAuth: true,
          title: 'Travel Details',
          permission: 'travel.view'
        }
      },

      // ------------------------------------------------------------------------
      // HRM - ATTENDANCE
      // ------------------------------------------------------------------------
      {
        path: '/hrm/attendance/admin',
        name: 'AttendanceAdmin',
        component: lazyView('pages/hrm/attendance/attendance-admin'),
        meta: {
          requiresAuth: true,
          title: 'Attendance Admin',
          permission: 'attendance.admin'
        }
      },
      {
        path: '/hrm/attendance/employee',
        name: 'AttendanceEmployee',
        component: lazyView('pages/hrm/attendance/attendance-employee'),
        meta: {
          requiresAuth: true,
          title: 'My Attendance',
          permission: 'attendance.view'
        }
      },

      // ------------------------------------------------------------------------
      // HRM - TRAINING
      // ------------------------------------------------------------------------
      {
        path: '/hrm/training/list',
        name: 'TrainingList',
        component: lazyView('pages/hrm/training/training-list'),
        meta: {
          requiresAuth: true,
          title: 'Training Programs',
          permission: 'training.view'
        }
      },
      {
        path: '/hrm/training/employee-training',
        name: 'EmployeeTrainingList',
        component: lazyView('pages/hrm/training/employee-training-list'),
        meta: {
          requiresAuth: true,
          title: 'Employee Training',
          permission: 'training.view'
        }
      },

      // ------------------------------------------------------------------------
      // PAYROLL
      // ------------------------------------------------------------------------
      {
        path: '/payroll/employee-salary',
        name: 'EmployeeSalary',
        component: lazyView('pages/finance-accounts/payroll/employee-salary'),
        meta: {
          requiresAuth: true,
          title: 'Employee Salary',
          permission: 'payroll.view'
        }
      },
      {
        path: '/payroll/add-salary',
        name: 'AddEmployeeSalary',
        component: lazyView('pages/finance-accounts/payroll/add-employee-salary'),
        meta: {
          requiresAuth: true,
          title: 'Add Employee Salary',
          permission: 'payroll.create'
        }
      },
      {
        path: '/payroll/tax-settings',
        name: 'TaxSettings',
        component: lazyView('pages/finance-accounts/payroll/tax-settings'),
        meta: {
          requiresAuth: true,
          title: 'Tax Settings',
          permission: 'payroll.admin'
        }
      },
      {
        path: '/payroll/benefit-settings',
        name: 'BenefitSettings',
        component: lazyView('pages/finance-accounts/payroll/benefit-settings-list'),
        meta: {
          requiresAuth: true,
          title: 'Benefit Settings',
          permission: 'payroll.admin'
        }
      },
      {
        path: '/payroll/payslip',
        name: 'Payslip',
        component: lazyView('pages/finance-accounts/payroll/payslip-index'),
        meta: {
          requiresAuth: true,
          title: 'Payslip',
          permission: 'payroll.view'
        }
      },
      {
        path: '/payroll/bulk-create',
        name: 'BulkPayrollCreate',
        component: lazyView('pages/finance-accounts/payroll/BulkPayrollCreate'),
        meta: {
          requiresAuth: true,
          title: 'Bulk Payroll Creation',
          permission: 'payroll.create'
        }
      },

      // ------------------------------------------------------------------------
      // ADMINISTRATION - ORGANIZATION STRUCTURE
      // ------------------------------------------------------------------------
      {
        path: '/administration/sites',
        name: 'SiteList',
        component: lazyView('pages/administration/sites/site-list'),
        meta: {
          requiresAuth: true,
          title: 'Sites',
          permission: 'organization.view'
        }
      },
      {
        path: '/administration/departments',
        name: 'DepartmentList',
        component: lazyView('pages/administration/departments/department-list'),
        meta: {
          requiresAuth: true,
          title: 'Departments',
          permission: 'organization.view'
        }
      },
      {
        path: '/administration/positions',
        name: 'PositionList',
        component: lazyView('pages/administration/positions/position-list'),
        meta: {
          requiresAuth: true,
          title: 'Positions',
          permission: 'organization.view'
        }
      },
      {
        path: '/administration/section-departments',
        name: 'SectionDepartmentList',
        component: lazyView('pages/administration/section-departments/section-department-list'),
        meta: {
          requiresAuth: true,
          title: 'Section Departments',
          permission: 'organization.view'
        }
      },

      // ------------------------------------------------------------------------
      // ADMINISTRATION - LOOKUPS
      // ------------------------------------------------------------------------
      {
        path: '/administration/lookups',
        name: 'LookupList',
        component: lazyView('pages/administration/lookups/lookup-list'),
        meta: {
          requiresAuth: true,
          title: 'Lookups',
          permission: 'admin.manage'
        }
      },

      // ------------------------------------------------------------------------
      // ADMINISTRATION - USER MANAGEMENT
      // ------------------------------------------------------------------------
      {
        path: '/administration/users',
        name: 'UserList',
        component: lazyView('pages/administration/user-management/user-list'),
        meta: {
          requiresAuth: true,
          title: 'User Management',
          permission: 'user.manage'
        }
      },
      {
        path: '/administration/roles',
        name: 'RoleList',
        component: lazyView('pages/administration/role-management/role-list'),
        meta: {
          requiresAuth: true,
          title: 'Role Management',
          permission: 'role.manage'
        }
      },
      {
        path: '/administration/roles-permissions',
        name: 'RolesPermissions',
        component: lazyView('pages/administration/user-management/roles-permission'),
        meta: {
          requiresAuth: true,
          title: 'Roles & Permissions',
          permission: 'role.manage'
        }
      },

      // ------------------------------------------------------------------------
      // ADMINISTRATION - REPORTS
      // ------------------------------------------------------------------------
      {
        path: '/administration/reports',
        name: 'ReportList',
        component: lazyView('pages/administration/reports/report-list'),
        meta: {
          requiresAuth: true,
          title: 'Reports',
          permission: 'reports.view'
        }
      },

      // ------------------------------------------------------------------------
      // ADMINISTRATION - FILE UPLOADS
      // ------------------------------------------------------------------------
      {
        path: '/administration/file-uploads',
        name: 'FileUploadsList',
        component: lazyView('pages/administration/file-uploads/file-uploads-list'),
        meta: {
          requiresAuth: true,
          title: 'File Uploads',
          permission: 'admin.manage'
        }
      },

      // ------------------------------------------------------------------------
      // ADMINISTRATION - RECYCLE BIN
      // ------------------------------------------------------------------------
      {
        path: '/administration/recycle-bin',
        name: 'RecycleBinList',
        component: lazyView('pages/administration/recycle-bin/recycle-bin-list'),
        meta: {
          requiresAuth: true,
          title: 'Recycle Bin',
          permission: 'admin.manage'
        }
      },

      // ------------------------------------------------------------------------
      // NOTIFICATIONS
      // ------------------------------------------------------------------------
      {
        path: '/notifications',
        name: 'NotificationsList',
        component: lazyView('pages/notifications/notifications-list'),
        meta: {
          requiresAuth: true,
          title: 'Notifications'
        }
      },

      // ------------------------------------------------------------------------
      // PROFILE & SETTINGS
      // ------------------------------------------------------------------------
      {
        path: '/profile',
        name: 'Profile',
        component: lazyView('pages/profile/profile-index'),
        meta: {
          requiresAuth: true,
          title: 'My Profile'
        }
      },
      {
        path: '/settings/general',
        name: 'GeneralSettings',
        component: lazyView('pages/settings/general-settings'),
        meta: {
          requiresAuth: true,
          title: 'General Settings',
          permission: 'admin.manage'
        }
      },
      {
        path: '/settings/system',
        name: 'SystemSettings',
        component: lazyView('pages/settings/system-settings'),
        meta: {
          requiresAuth: true,
          title: 'System Settings',
          permission: 'admin.manage'
        }
      },
    ]
  },

  // ============================================================================
  // ERROR PAGES
  // ============================================================================
  {
    path: '/403',
    name: 'Forbidden',
    component: lazyView('pages/errors/error-403'),
    meta: { requiresAuth: false }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: lazyView('pages/errors/error-404'),
    meta: { requiresAuth: false }
  },
  {
    path: '/500',
    name: 'ServerError',
    component: lazyView('pages/errors/error-500'),
    meta: { requiresAuth: false }
  },

  // Catch-all redirect to 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Setup authentication guards and other middleware
setupRouterGuards(router);

export default router;

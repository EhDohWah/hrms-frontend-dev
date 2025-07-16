// Role hierarchy (higher index = lower priority)
export const ROLE_HIERARCHY = {
    'admin': 1,
    'hr-manager': 2,
    'hr-assistant': 3,
    'manager': 4,
    'employee': 5
};

// Default routes for each role
export const DEFAULT_ROUTES = {
    'admin': '/dashboard/admin-dashboard',
    'hr-manager': '/dashboard/hr-manager-dashboard',
    'hr-assistant': '/dashboard/hr-assistant-dashboard',
    'employee': '/dashboard/employee-dashboard'
};

// Role-based menu access configuration
export const ROLE_MENU_ACCESS = {
    'admin': {
        allowedMenus: [
            'Dashboard',
            'User Management',
            'Lookups',
            'Department Positions'
        ],
        allowedSubMenus: {
            'Dashboard': ['Admin Dashboard'],
            'User Management': ['Users'],
            'Lookups': ['Lookup List'],
            'Department Positions': ['Department Position List']
        },
        permissions: [
            'view_all',
            'manage_all',
            'access_all_dashboards',
        ]
    },
    'hr-manager': {
        allowedMenus: [
            'Dashboard',
            'Recruitment',
            'Jobs',
            'Candidates',
            'Referrals',
            'Employee',
            'Tickets',
            'Holidays',
            'Attendance',
            'Grants',
            'Payroll',
            'Training',
            'Reports',
            'Requests',
            'Leaves',
            'Travel',
            'Training',
            'Reports'
        ],
        allowedSubMenus: {
            'Dashboard': ['HR Manager Dashboard'],
            'Leaves': ['Leaves (Admin)', 'Leave Settings'],
            'Travel': ['Travel (Admin)'],
            'Attendance': ['Attendance (Admin)', 'Timesheets', 'Schedule Timing'],
            'Recruitment': ['Interviews', 'Job Offers'],
            'Employee': ['Employee Lists', 'Employment List', 'Site Location', 'Policies'],
            'Payroll': ['Employee Salary', 'Payslip', 'Payroll Items'],
            'Training': ['Training List', 'Training Type', 'Trainers', 'Employee Training'],
            'Reports': ['Report List'],
            'Grants': ['Grants List', 'Grant Position', 'Budget Lines']
        },
        permissions: [
            'view_hr',
            'manage_hr',
            'view_employees',
            'manage_employees',
            'manage_grants',
            'manage_requests',
            'manage_leave',
            'manage_recruitment'
        ]
    },
    'hr-assistant': {
        allowedMenus: [
            'Dashboard',
            'Recruitment',
            'Candidates',
            'Employee',
            'Holidays',
            'Attendance',
            'Training',
            'Reports',
            'Requests',
            'Leaves',
            'Travel',
            'Payroll',
            'Training',
            'Reports'
        ],
        allowedSubMenus: {
            'Dashboard': ['HR Assistant Dashboard'],
            'Leaves': ['Leaves (Admin)'],
            'Travel': ['Travel (Admin)', 'Travel (Employee)'],
            'Attendance': ['Attendance (Admin)', 'Timesheets', 'Schedule Timing'],
            'Recruitment': ['Interviews', 'Job Offers'],
            'Employee': ['Employee Lists', 'Employment List', 'Site Location', 'Policies'],
            'Payroll': ['Employee Salary', 'Payslip', 'Payroll Items'],
            'Training': ['Training List', 'Training Type', 'Trainers', 'Employee Training'],
            'Reports': ['Report List'],
        },
        permissions: [
            'view_hr',
            'view_employees',
            'manage_grants',
            'manage_requests',
            'manage_leave',
            'view_recruitment'
        ]
    },
    'employee': {
        allowedMenus: [
            'Dashboard',
            'Attendance',
            'Requests',
            'Leaves',
            'Travel'
        ],
        allowedSubMenus: {
            'Dashboard': ['Employee Dashboard'],
            'Leaves': ['Leave (Employee)'],
            'Travel': ['Travel (Employee)'],
            'Attendance': ['Attendance (Employee)', 'Timesheets']
        },
        permissions: [
            'view_self',
            'view_requests',
            'manage_leave',
            'manage_travel'
        ]
    }
};
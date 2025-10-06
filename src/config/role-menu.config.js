// Role hierarchy (higher index = lower priority)
export const ROLE_HIERARCHY = {
    'admin': 1,
    'hr-manager': 2,
    'hr-assistant-senior': 3,
    'hr-assistant-junior': 4,
    'site-admin': 5
};

// Default routes for each role
export const DEFAULT_ROUTES = {
    'admin': '/dashboard/admin-dashboard',
    'hr-manager': '/dashboard/hr-manager-dashboard',
    'hr-assistant-senior': '/dashboard/hr-assistant-senior-dashboard',
    'hr-assistant-junior': '/dashboard/hr-assistant-junior-dashboard',
    'site-admin': '/dashboard/site-admin-dashboard'
};

// Role-based menu access configuration
export const ROLE_MENU_ACCESS = {
    'admin': {
        allowedMenus: [
            'Dashboard',
            'User Management',
            'Lookups',
            'Department Positions',
        ],
        allowedSubMenus: {
            'Dashboard': ['Admin Dashboard'],
            'User Management': ['Users', 'Roles & Permissions'],
            'Lookups': ['Lookup List'],
            'Department Positions': ['Department Position List'],
        },
        permissions: [
            'admin.*',
            'user.*',
            'grant.*',
            'interview.*',
            'employee.*',
            'employment.*',
            'employment_history.*',
            'children.*',
            'questionnaire.*',
            'language.*',
            'reference.*',
            'education.*',
            'payroll.*',
            'attendance.*',
            'training.*',
            'reports.*',
            'travel_request.*',
            'leave_request.*',
            'job_offer.*',
            'tax.*'
        ]
    },
    'hr-manager': {
        allowedMenus: [
            'Dashboard',
            'User Management',
            'Recruitment',
            'Jobs',
            'Candidates',
            'Referrals',
            'Employee',
            'Employment',
            'Children',
            'Questionnaire',
            'Language',
            'Reference',
            'Education',
            'Tickets',
            'Attendance',
            'Grants',
            'Payroll',
            'Training',
            'Reports',
            'Requests',
            'Leaves',
            'Travel',
            'Job Offers',
            'Tax',
            'Recycle Bin'
        ],
        allowedSubMenus: {
            'Dashboard': ['HR Manager Dashboard'],
            'User Management': ['Users', 'Roles & Permissions'],
            'Leaves': ['Leaves (Admin)', 'Leave Types', 'Leave Balances'],
            'Travel': ['Travel (Admin)', 'Travel Requests'],
            'Attendance': ['Attendance (Admin)', 'Timesheets', 'Schedule Timing'],
            'Recruitment': ['Interviews', 'Job Offers'],
            'Employee': ['Employees', 'Employment Records', 'Site Location', 'Employee Resignation'],
            'Employment': ['Employment List', 'Employment History'],
            'Payroll': ['Employee Salary', 'Payslip', 'Payroll Items', 'Tax Settings'],
            'Training': ['Training List', 'Employee Training'],
            'Reports': ['Report List'],
            'Grants': ['Grants List', 'Grant Position'],
            'Recycle Bin': ['Recycle Bin List']
        },
        permissions: [
            'admin.*',
            'user.*',
            'grant.*',
            'interview.*',
            'employee.*',
            'employment.*',
            'employment_history.*',
            'children.*',
            'questionnaire.*',
            'language.*',
            'reference.*',
            'education.*',
            'payroll.*',
            'attendance.*',
            'training.*',
            'reports.*',
            'travel_request.*',
            'leave_request.*',
            'job_offer.*',
            'tax.*'
        ]
    },
    'hr-assistant-senior': {
        allowedMenus: [
            'Dashboard',
            'Recruitment',
            'Candidates',
            'Employee',
            'Employment',
            'Children',
            'Questionnaire',
            'Language',
            'Reference',
            'Education',
            'Attendance',
            'Training',
            'Reports',
            'Requests',
            'Leaves',
            'Travel',
            'Job Offers',
            'Tax'
        ],
        allowedSubMenus: {
            'Dashboard': ['HR Assistant Senior Dashboard'],
            'Leaves': ['Leaves (Admin)', 'Leave Types', 'Leave Balances'],
            'Travel': ['Travel (Admin)', 'Travel (Employee)'],
            'Attendance': ['Attendance (Admin)', 'Timesheets', 'Schedule Timing'],
            'Recruitment': ['Interviews', 'Job Offers'],
            'Employee': ['Employees', 'Employment Records', 'Site Location'],
            'Employment': ['Employment List', 'Employment History'],
            'Payroll': ['Employee Salary', 'Payslip', 'Payroll Items', 'Tax Settings'],
            'Training': ['Training List', 'Employee Training'],
            'Reports': ['Report List']
        },
        permissions: [
            'admin.*',
            'user.*',
            'interview.*',
            'employee.*',
            'employment.*',
            'employment_history.*',
            'children.*',
            'questionnaire.*',
            'language.*',
            'reference.*',
            'education.*',
            'payroll.*',
            'attendance.*',
            'training.*',
            'reports.*',
            'travel_request.*',
            'leave_request.*',
            'job_offer.*',
            'tax.*'
        ]
    },
    'hr-assistant-junior': {
        allowedMenus: [
            'Dashboard',
            'Recruitment',
            'Candidates',
            'Employee',
            'Children',
            'Questionnaire',
            'Language',
            'Reference',
            'Education',
            'Attendance',
            'Training',
            'Requests',
            'Leaves',
            'Travel',
            'Job Offers',
            'Tax'
        ],
        allowedSubMenus: {
            'Dashboard': ['HR Assistant Junior Dashboard'],
            'Leaves': ['Leaves (Admin)', 'Leave Types'],
            'Travel': ['Travel (Admin)', 'Travel (Employee)'],
            'Attendance': ['Attendance (Admin)', 'Timesheets', 'Schedule Timing'],
            'Recruitment': ['Interviews', 'Job Offers'],
            'Employee': ['Employees', 'Site Location'],
            'Training': ['Training List', 'Employee Training']
        },
        permissions: [
            'admin.*',
            'user.*',
            'interview.*',
            'employee.*',
            'children.*',
            'questionnaire.*',
            'language.*',
            'reference.*',
            'education.*',
            'attendance.*',
            'training.*',
            'travel_request.*',
            'leave_request.*',
            'job_offer.*',
            'tax.*'
        ]
    },
    'site-admin': {
        allowedMenus: [
            'Dashboard',
            'Training',
            'Requests',
            'Leaves',
            'Travel'
        ],
        allowedSubMenus: {
            'Dashboard': ['Site Admin Dashboard'],
            'Leaves': ['Leaves (Admin)', 'Leave Types', 'Leave Balances'],
            'Travel': ['Travel (Admin)', 'Travel Requests'],
            'Training': ['Training List', 'Employee Training']
        },
        permissions: [
            'leave.*',
            'travel.*',
            'training.*'
        ]
    }
};
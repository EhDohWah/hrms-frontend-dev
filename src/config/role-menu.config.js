// Role hierarchy (higher index = lower priority)
export const ROLE_HIERARCHY = {
    'admin': 1,
    'hr-manager': 2,
    'hr-assistant-senior': 3,
    'hr-assistant-junior': 4,
    'site-admin': 5
};

// Default routes for each role - all roles go to the unified dynamic dashboard
export const DEFAULT_ROUTES = {
    'admin': '/dashboard',
    'hr-manager': '/dashboard',
    'hr-assistant-senior': '/dashboard',
    'hr-assistant-junior': '/dashboard',
    'site-admin': '/dashboard'
};

// Role-based menu access configuration
export const ROLE_MENU_ACCESS = {
    'admin': {
        allowedMenus: [
            'Dashboard',
            'User Management',
            'Lookups',
            'Organization Structure',
            'File Uploads',
        ],
        allowedSubMenus: {
            'User Management': ['Users', 'Roles'],
            'Lookups': ['Lookup List'],
            'Organization Structure': ['Sites', 'Departments', 'Positions', 'Section Departments'],
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
            'tax.*',
            'upload.*'
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
            'Lookups',
            'Organization Structure',
            'Recycle Bin',
            'File Uploads'
        ],
        allowedSubMenus: {
            'User Management': ['Users', 'Roles'],
            'Leaves': ['Leaves (Admin)', 'Leave Types', 'Leave Balances'],
            'Travel': ['Travel (Admin)', 'Travel Requests'],
            'Attendance': ['Attendance (Admin)', 'Timesheets', 'Schedule Timing'],
            'Recruitment': ['Interviews', 'Job Offers'],
            'Employee': ['Employees', 'Employment Records', 'Employee Resignation'],
            'Employment': ['Employment List', 'Employment History'],
            'Payroll': ['Employee Salary', 'Payslip', 'Payroll Items', 'Tax Settings', 'Benefit Settings'],
            'Training': ['Training List', 'Employee Training'],
            'Reports': ['Report List'],
            'Grants': ['Grants List', 'Grant Position'],
            'Organization Structure': ['Sites', 'Departments', 'Positions', 'Section Departments'],
            'Recycle Bin': ['Recycle Bin List'],
            'Lookups': ['Lookup List']
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
            'tax.*',
            'upload.*'
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
            'Tax',
            'Organization Structure',
            'File Uploads'
        ],
        allowedSubMenus: {
            'Leaves': ['Leaves (Admin)', 'Leave Types', 'Leave Balances'],
            'Travel': ['Travel (Admin)', 'Travel (Employee)'],
            'Attendance': ['Attendance (Admin)', 'Timesheets', 'Schedule Timing'],
            'Recruitment': ['Interviews', 'Job Offers'],
            'Employee': ['Employees', 'Employment Records', 'Site Location'],
            'Employment': ['Employment List', 'Employment History'],
            'Payroll': ['Employee Salary', 'Payslip', 'Payroll Items', 'Tax Settings', 'Benefit Settings'],
            'Training': ['Training List', 'Employee Training'],
            'Reports': ['Report List'],
            'Organization Structure': ['Sites', 'Departments', 'Positions', 'Section Departments']
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
            'tax.*',
            'upload.*'
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
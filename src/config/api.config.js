export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://hrms-backend-api-v1-main-wrhlmg.laravel.cloud/api/v1',
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

// API endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: '/login',
        LOGOUT: '/logout',
        REGISTER: '/register',
        REFRESH: '/refresh-token',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        VERIFY_EMAIL: '/verify-email',
        USER: '/user',
        MY_PERMISSIONS: '/me/permissions'
    },

    // Admin endpoints
    ADMIN: {
        USERS: {
            LIST: '/admin/users',
            CREATE: '/admin/users',
            UPDATE: '/admin/users/:id',
            DELETE: '/admin/users/:id',
            DETAILS: '/admin/users/:id'
        },
        ROLES: {
            LIST: '/admin/roles'
        },
        PERMISSIONS: {
            LIST: '/admin/permissions'
        },
        DASHBOARD: {
            ALL_WIDGETS: '/admin/dashboard/widgets',
            USER_WIDGETS: '/admin/dashboard/users/:userId/widgets',
            USER_AVAILABLE_WIDGETS: '/admin/dashboard/users/:userId/available-widgets'
        }
    },

    // Dashboard endpoints
    DASHBOARD: {
        MY_WIDGETS: '/dashboard/my-widgets',
        UPDATE_WIDGETS: '/dashboard/my-widgets',
        AVAILABLE_WIDGETS: '/dashboard/available-widgets',
        ADD_WIDGET: '/dashboard/widgets/add',
        REMOVE_WIDGET: '/dashboard/widgets/:widgetId',
        TOGGLE_VISIBILITY: '/dashboard/widgets/:widgetId/toggle-visibility',
        TOGGLE_COLLAPSE: '/dashboard/widgets/:widgetId/toggle-collapse',
        REORDER_WIDGETS: '/dashboard/widgets/reorder',
        RESET_DEFAULTS: '/dashboard/reset-defaults'
    },

    // User endpoints
    USER: {
        LIST: '/users',
        CREATE: '/users',
        UPDATE: '/users/:id',
        DELETE: '/users/:id',
        DETAILS: '/users/:id',
        GET_USER: '/user',
        UPDATE_PROFILE_PICTURE: '/user/profile-picture',
        UPDATE_USERNAME: '/user/username',
        UPDATE_PASSWORD: '/user/password',
        UPDATE_EMAIL: '/user/email'
    },

    // Employee endpoints
    EMPLOYEE: {
        TREE_SEARCH: '/employees/tree-search',
        LIST: '/employees?per_page=&staff_id=&status=&organization=&gender=&date_of_birth=&sort_by=&sort_order=',
        SINGLE: '/employees/staff-id/:staffId',
        CREATE: '/employees',
        UPDATE: '/employees/:id',
        DELETE: '/employees/:id',
        DELETE_SELECTED: '/employees/delete-selected/:ids',
        DETAILS: '/employees/:id',
        FILTER: '/employees/filter',
        SITE_RECORDS: '/employees/site-records',
        UPLOAD_FILE: '/employees/upload',
        UPLOAD_PROFILE_PICTURE: '/employees/:id/profile-picture',
        UPDATE_BASIC_INFORMATION: '/employees/:id/basic-information',
        UPDATE_PERSONAL_INFORMATION: '/employees/:id/personal-information',
        UPDATE_BANK_INFORMATION: '/employees/:id/bank-information',
        UPDATE_FAMILY_INFORMATION: '/employees/:id/family-information',
    },

    // Role endpoints
    ROLE: {
        LIST: '/admin/roles',
        OPTIONS: '/admin/roles/options',
        CREATE: '/admin/roles',
        UPDATE: '/admin/roles/:id',
        DELETE: '/admin/roles/:id',
        DETAILS: '/admin/roles/:id',
        GET_PERMISSIONS: '/admin/roles/:id/permissions',
        UPDATE_PERMISSIONS: '/admin/roles/:id/permissions'
    },

    // Employment endpoints
    EMPLOYMENT: {
        LIST: '/employments',
        SEARCH_BY_STAFF_ID: '/employments/search/staff-id/:staffId',
        FUNDING_ALLOCATIONS: '/employments/:id/funding-allocations',
        PROBATION_HISTORY: '/employments/:id/probation-history',
        PROBATION_STATUS: '/employments/:id/probation-status',
        CALCULATE_ALLOCATION: '/employments/calculate-allocation',
        COMPLETE_PROBATION: '/employments/:id/complete-probation',
        CREATE: '/employments',
        UPDATE: '/employments/:id',
        DELETE: '/employments/:id',
        DETAILS: '/employments/:id',
    },

    // Permission endpoints
    PERMISSION: {
        LIST: '/permissions',
        CREATE: '/permissions',
        UPDATE: '/permissions/:id',
        DELETE: '/permissions/:id',
        DETAILS: '/permissions/:id',
        MODULES: '/permissions/modules',
        GENERATE: '/permissions/generate'
    },

    // Grant endpoints
    GRANT: {
        LIST: '/grants',
        GET_BY_ID: '/grants/by-id/:id',
        GET_BY_CODE: '/grants/by-code/:code',
        CREATE: '/grants',
        UPDATE: '/grants/:id',
        DELETE: '/grants/:id',
        DELETE_SELECTED: '/grants/delete-selected',
        DETAILS: '/grants/:id',
        UPLOAD: '/uploads/grant',
        DOWNLOAD_TEMPLATE: '/downloads/grant-template',
        ITEMS: {
            LIST: '/grants/items',
            CREATE: '/grants/items',
            DETAILS: '/grants/items/:id',
            DELETE: '/grants/items/:id',
            UPDATE: '/grants/items/:id'
        },
        GRANT_POSITIONS: '/grants/grant-positions',
        PAGINATED_GRANTS: '/grants/paginated',
    },


    // Position Slot endpoints
    POSITION_SLOT: {
        LIST: '/position-slots',
        CREATE: '/position-slots',
        UPDATE: '/position-slots/:id',
        DELETE: '/position-slots/:id',
        DETAILS: '/position-slots/:id'
    },

    // Interview endpoints
    INTERVIEW: {
        LIST: '/interviews',
        CREATE: '/interviews',
        UPDATE: '/interviews/:id',
        DELETE: '/interviews/:id',
        DETAILS: '/interviews/:id',
        BY_CANDIDATE_NAME: '/interviews/by-candidate/:candidateName'
    },

    // Lookup endpoints
    LOOKUP: {
        LIST: '/lookups',
        LISTS: '/lookups/lists',
        CREATE: '/lookups',
        UPDATE: '/lookups/:id',
        DELETE: '/lookups/:id',
        DETAILS: '/lookups/:id',
        TYPES: '/lookups/types',
        BY_TYPE: '/lookups/type/:type',
        SEARCH: '/lookups/search'
    },

    // Department Position endpoints (legacy)
    DEPARTMENT_POSITION: {
        LIST: '/department-positions',
        CREATE: '/department-positions',
        UPDATE: '/department-positions/:id',
        DELETE: '/department-positions/:id',
        DETAILS: '/department-positions/:id'
    },

    // Site endpoints
    SITE: {
        LIST: '/sites',
        CREATE: '/sites',
        UPDATE: '/sites/:id',
        DELETE: '/sites/:id',
        DETAILS: '/sites/:id',
        OPTIONS: '/sites/options'
    },

    // Department endpoints
    DEPARTMENT: {
        LIST: '/departments',
        CREATE: '/departments',
        UPDATE: '/departments/:id',
        DELETE: '/departments/:id',
        DETAILS: '/departments/:id',
        OPTIONS: '/departments/options',
        POSITIONS: '/departments/:id/positions',
        MANAGERS: '/departments/:id/managers'
    },

    // Position endpoints
    POSITION: {
        LIST: '/positions',
        CREATE: '/positions',
        UPDATE: '/positions/:id',
        DELETE: '/positions/:id',
        DETAILS: '/positions/:id',
        OPTIONS: '/positions/options',
        DIRECT_REPORTS: '/positions/:id/direct-reports'
    },

    // Section Department endpoints
    SECTION_DEPARTMENT: {
        LIST: '/section-departments',
        CREATE: '/section-departments',
        UPDATE: '/section-departments/:id',
        DELETE: '/section-departments/:id',
        DETAILS: '/section-departments/:id',
        OPTIONS: '/section-departments/options',
        BY_DEPARTMENT: '/section-departments/by-department/:departmentId'
    },


    // Work location endpoints
    WORK_LOCATION: {
        LIST: '/worklocations',
        CREATE: '/worklocations',
        UPDATE: '/worklocations/:id',
        DELETE: '/worklocations/:id',
        DETAILS: '/worklocations/:id'
    },

    // Leave endpoints - Updated to match simplified backend structure
    LEAVE: {
        TYPES: {
            LIST: '/leaves/types',
            DROPDOWN: '/leaves/types/dropdown',
            CREATE: '/leaves/types',
            UPDATE: '/leaves/types/:id',
            DELETE: '/leaves/types/:id',
            DETAILS: '/leaves/types/:id'
        },
        REQUESTS: {
            LIST: '/leaves/requests',
            CREATE: '/leaves/requests',
            UPDATE: '/leaves/requests/:id',
            DELETE: '/leaves/requests/:id',
            DETAILS: '/leaves/requests/:id'
        },
        BALANCES: {
            LIST: '/leaves/balances',
            CREATE: '/leaves/balances',
            UPDATE: '/leaves/balances/:id',
            DELETE: '/leaves/balances/:id',
            DETAILS: '/leaves/balances/:id',
            EMPLOYEE_BALANCE: '/leaves/balance/:employeeId/:leaveTypeId'
        }
    },

    // employee-references endpoints
    EMPLOYEE_REFERENCES: {
        LIST: '/employee-references',
        CREATE: '/employee-references',
        UPDATE: '/employee-references/:id',
        DELETE: '/employee-references/:id',
        DETAILS: '/employee-references/:id'
    },

    // References endpoints
    REFERENCES: {
        LIST: '/employee-references',
        CREATE: '/employee-references',
        UPDATE: '/employee-references/:id',
        DELETE: '/employee-references/:id',
        DETAILS: '/employee-references/:id'
    },

    // Training endpoints
    TRAINING: {
        LIST: '/trainings',
        CREATE: '/trainings',
        UPDATE: '/trainings/:id',
        DELETE: '/trainings/:id',
        DETAILS: '/trainings/:id'
    },

    // Employee training endpoints
    EMPLOYEE_TRAINING: {
        LIST: '/employee-trainings',
        CREATE: '/employee-trainings',
        UPDATE: '/employee-trainings/:id',
        DELETE: '/employee-trainings/:id',
        DETAILS: '/employee-trainings/:id'
    },

    // payroll endpoints    
    PAYROLL: {
        LIST: '/payrolls',
        SEARCH: '/payrolls/search',
        BUDGET_HISTORY: '/payrolls/budget-history',
        CREATE: '/payrolls',
        UPDATE: '/payrolls/:id',
        DELETE: '/payrolls/:id',
        DETAILS: '/payrolls/:id',
        EMPLOYEE_EMPLOYMENT: '/payrolls/employee-employment',
        EMPLOYEE_EMPLOYMENT_CALCULATED: '/payrolls/employee-employment-calculated',
        PREVIEW_ADVANCES: '/payrolls/preview-advances',
        TAX_SUMMARY: '/payrolls/tax-summary/:id',
        CALCULATE: '/payrolls/calculate',
        BULK_CALCULATE: '/payrolls/bulk-calculate',
        // Bulk payroll creation with real-time progress tracking
        BULK_PREVIEW: '/payrolls/bulk/preview',
        BULK_CREATE_NEW: '/payrolls/bulk/create',
        BULK_STATUS: '/payrolls/bulk/status/:batchId',
        BULK_ERRORS: '/payrolls/bulk/errors/:batchId'
    },

    // Employee grant allocation endpoints
    EMPLOYEE_GRANT_ALLOCATION: {
        LIST: '/employee-grant-allocations',
        CREATE: '/employee-grant-allocations',
        DETAILS: '/employee-grant-allocations/:id',
        UPDATE: '/employee-grant-allocations/:id',
        DELETE: '/employee-grant-allocations/:id',
        GRANT_STRUCTURE: '/employee-grant-allocations/grant-structure',
        BULK_DEACTIVATE: '/employee-grant-allocations/bulk-deactivate',
        EMPLOYEE_ALLOCATIONS: '/employee-grant-allocations/employee/:employee_id',
        UPDATE_EMPLOYEE_ALLOCATIONS: '/employee-grant-allocations/employee/:employee_id'
    },

    // Employee funding allocations endpoints
    EMPLOYEE_FUNDING_ALLOCATION: {
        LIST: '/employee-funding-allocations',
        CREATE: '/employee-funding-allocations',
        DETAILS: '/employee-funding-allocations/:id',
        UPDATE: '/employee-funding-allocations/:id',
        DELETE: '/employee-funding-allocations/:id',
        BY_GRANT_ITEM: '/employee-funding-allocations/by-grant-item/:grantItemId',
        GRANT_STRUCTURE: '/employee-funding-allocations/grant-structure',
        CALCULATE_PREVIEW: '/employee-funding-allocations/calculate-preview',
        BULK_DEACTIVATE: '/employee-funding-allocations/bulk-deactivate',
        BY_EMPLOYEE: '/employee-funding-allocations/employee/:employeeId',
        UPDATE_EMPLOYEE_ALLOCATIONS: '/employee-funding-allocations/employee/:employeeId'
    },

    // JobOffer endpoints 
    JOB_OFFER: {
        LIST: '/job-offers',
        CREATE: '/job-offers',
        DETAILS: '/job-offers/:id',
        UPDATE: '/job-offers/:id',
        DELETE: '/job-offers/:id',
        GENERATE_PDF: '/job-offers/:id/pdf',
        BY_CANDIDATE: '/job-offers/by-candidate/:candidateName'
    },

    // Report endpoints
    REPORT: {
        INTERVIEW_EXPORT_PDF: '/reports/interview-report/export-pdf',
        JOB_OFFER_EXPORT_PDF: '/reports/job-offer-report/export-pdf',
        INTERVIEW_EXPORT_EXCEL: '/reports/interview-report/export-excel',
        LEAVE_EXPORT_PDF: '/reports/leave-request-report/export-pdf',
        LEAVE_EXPORT_EXCEL: '/reports/leave-request-report/export-excel',
        LEAVE_EXPORT_CSV: '/reports/leave-request-report/export-csv',
        EMPLOYEE_PERSONAL_DATA_EXPORT_PDF: '/reports/employee-personal-data-report/export-pdf',
        EMPLOYEE_PERSONAL_DATA_EXPORT_EXCEL: '/reports/employee-personal-data-report/export-excel',
        EMPLOYMENT_DATA_EXPORT_PDF: '/reports/employment-data-report/export-pdf',
        EMPLOYMENT_DATA_EXPORT_EXCEL: '/reports/employment-data-report/export-excel',
        TOTAL_GRANT_EXPORT_PDF: '/reports/total-grant-report/export-pdf',
        TOTAL_GRANT_EXPORT_EXCEL: '/reports/total-grant-report/export-excel',
        TRAINING_ATTENDANCE_EXPORT_PDF: '/reports/training-attendance-report/export-pdf',
        TRAINING_ATTENDANCE_EXPORT_EXCEL: '/reports/training-attendance-report/export-excel',
        TRAINING_ATTENDANCE_EXPORT_CSV: '/reports/training-attendance-report/export-csv',
        EMPLOYEE_TRAINING_HISTORY_EXPORT_PDF: '/reports/employee-training-history-report/export-pdf',
        EMPLOYEE_TRAINING_HISTORY_EXPORT_EXCEL: '/reports/employee-training-history-report/export-excel',
        EMPLOYEE_TRAINING_HISTORY_EXPORT_CSV: '/reports/employee-training-history-report/export-csv',
        PAYROLL_EXPORT_PDF: '/reports/payroll-report/export-pdf',
        PAYROLL_EXPORT_EXCEL: '/reports/payroll-report/export-excel',
        INDIVIDUAL_LEAVE_EXPORT_PDF: '/reports/leave-request-report/export-individual-pdf',
        INDIVIDUAL_LEAVE_EXPORT_EXCEL: '/reports/individual-leave-request-report/export-excel',
        INDIVIDUAL_LEAVE_EXPORT_CSV: '/reports/individual-leave-request-report/export-csv',
        TRAVEL_EXPORT_PDF: '/reports/travel-report/export-pdf',
        TRAVEL_EXPORT_EXCEL: '/reports/travel-report/export-excel',
        TRAVEL_EXPORT_CSV: '/reports/travel-report/export-csv',
    },

    // Notification endpoints (Enhanced with filtering and bulk operations)
    NOTIFICATION: {
        LIST: '/notifications',
        MARK_ALL_READ: '/notifications/mark-all-read',
        MARK_READ: '/notifications/:id/mark-read',
        UNREAD_COUNT: '/notifications/unread-count',
        STATS: '/notifications/stats',
        FILTER_OPTIONS: '/notifications/filter-options',
        BULK_DELETE: '/notifications/bulk-delete',
        CLEAR_READ: '/notifications/clear-read',
    },

    // Employee children endpoints
    EMPLOYEE_CHILDREN: {
        LIST: '/employee-children',
        CREATE: '/employee-children',
        UPDATE: '/employee-children/:id',
        DELETE: '/employee-children/:id',
        DETAILS: '/employee-children/:id'
    },

    // Employee education endpoints
    EMPLOYEE_EDUCATION: {
        LIST: '/employee-education',
        CREATE: '/employee-education',
        UPDATE: '/employee-education/:id',
        DELETE: '/employee-education/:id',
        DETAILS: '/employee-education/:id'
    },

    // Employee beneficiaries endpoints
    EMPLOYEE_BENEFICIARIES: {
        LIST: '/employee-beneficiaries',
        CREATE: '/employee-beneficiaries',
        UPDATE: '/employee-beneficiaries/:id',
        DELETE: '/employee-beneficiaries/:id',
        DETAILS: '/employee-beneficiaries/:id'
    },

    // Recycle Bin endpoints
    RECYCLE_BIN: {
        LIST: '/recycle-bin',
        STATS: '/recycle-bin/stats',
        RESTORE: '/recycle-bin/restore',
        BULK_RESTORE: '/recycle-bin/bulk-restore',
        PERMANENT_DELETE: '/recycle-bin/:deletedRecordId'
    },

    // Tax Settings endpoints
    TAX_SETTINGS: {
        LIST: '/tax-settings?per_page=&setting_key=&setting_type=&effective_year=&is_selected=&sort_by=&sort_order=',
        CREATE: '/tax-settings',
        UPDATE: '/tax-settings/:id',
        DELETE: '/tax-settings/:id',
        DETAILS: '/tax-settings/:id',
        BY_YEAR: '/tax-settings/by-year/:year',
        VALUE: '/tax-settings/value/:key',
        BULK_UPDATE: '/tax-settings/bulk-update',
        TOGGLE: '/tax-settings/:id/toggle',
        ALLOWED_KEYS: '/tax-settings/allowed-keys',
        EXPORT_EXCEL: '/tax-settings/export/excel',
        EXPORT_PDF: '/tax-settings/export/pdf'
    },

    // Tax Brackets endpoints
    TAX_BRACKETS: {
        LIST: '/tax-brackets?per_page=&effective_year=&sort_by=&sort_order=',
        CREATE: '/tax-brackets',
        UPDATE: '/tax-brackets/:id',
        DELETE: '/tax-brackets/:id',
        DETAILS: '/tax-brackets/:id',
        BY_YEAR: '/tax-brackets/by-year/:year',
        CALCULATE: '/tax-brackets/calculate/:income',
        BREAKDOWN: '/tax-brackets/breakdown/:income',
        EXPORT_EXCEL: '/tax-brackets/export/excel',
        EXPORT_PDF: '/tax-brackets/export/pdf'
    },

    // Tax Calculations endpoints
    TAX_CALCULATIONS: {
        PAYROLL: '/tax-calculations/payroll',
        INCOME_TAX: '/tax-calculations/income-tax',
        ANNUAL_SUMMARY: '/tax-calculations/annual-summary',
        VALIDATE_INPUTS: '/tax-calculations/validate-inputs',
        COMPLIANCE_CHECK: '/tax-calculations/compliance-check',
        THAI_REPORT: '/tax-calculations/thai-report'
    },

    // Benefit Settings endpoints
    BENEFIT_SETTINGS: {
        LIST: '/benefit-settings',
        CREATE: '/benefit-settings',
        UPDATE: '/benefit-settings/:id',
        DELETE: '/benefit-settings/:id',
        DETAILS: '/benefit-settings/:id'
    },

    // Resignation endpoints
    RESIGNATION: {
        LIST: '/resignations',
        CREATE: '/resignations',
        UPDATE: '/resignations/:id',
        DELETE: '/resignations/:id',
        DETAILS: '/resignations/:id',
        ACKNOWLEDGE: '/resignations/:id/acknowledge',
        BULK_DELETE: '/resignations/bulk-delete'
    },

    // Travel Request endpoints
    TRAVEL_REQUEST: {
        LIST: '/travel-requests',
        CREATE: '/travel-requests',
        SHOW: '/travel-requests/:id',
        UPDATE: '/travel-requests/:id',
        DELETE: '/travel-requests/:id',
        DELETE_SELECTED: '/travel-requests/bulk-delete',
        OPTIONS: '/travel-requests/options',
        SEARCH_BY_EMPLOYEE: '/travel-requests/search/employee/:staffId'
    },

    // File Upload endpoints
    UPLOAD: {
        EMPLOYEE: '/uploads/employee',
        EMPLOYEE_TEMPLATE: '/downloads/employee-template',
        EMPLOYMENT: '/uploads/employment',
        EMPLOYMENT_TEMPLATE: '/downloads/employment-template',
        EMPLOYEE_FUNDING_ALLOCATION: '/uploads/employee-funding-allocation',
        EMPLOYEE_FUNDING_ALLOCATION_TEMPLATE: '/downloads/employee-funding-allocation-template',
        GRANT_ITEMS_REFERENCE: '/downloads/grant-items-reference',
        EMPLOYEE_FUNDING_ALLOCATIONS_REFERENCE: '/downloads/employee-funding-allocations-reference',
        PAYROLL: '/uploads/payroll',
        PAYROLL_TEMPLATE: '/downloads/payroll-template'
    },

    // Module endpoints (Dynamic Menu System)
    MODULE: {
        LIST: '/admin/modules',
        HIERARCHICAL: '/admin/modules/hierarchical',
        BY_CATEGORY: '/admin/modules/by-category',
        PERMISSIONS: '/admin/modules/permissions',
        DETAILS: '/admin/modules/:id'
    }

};

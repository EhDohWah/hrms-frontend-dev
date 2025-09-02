export const API_CONFIG = {
    BASE_URL: process.env.VUE_APP_API_BASE_URL || 'https://hrms-backend-api-v1-main-wrhlmg.laravel.cloud/api/v1',
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
        USER: '/user'
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
        }
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
        LIST: '/employees?per_page=&staff_id=&status=&subsidiary=&gender=&date_of_birth=&sort_by=&sort_order=',
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
    },

    // Role endpoints
    ROLE: {
        LIST: '/roles',
        CREATE: '/roles',
        UPDATE: '/roles/:id',
        DELETE: '/roles/:id',
        DETAILS: '/roles/:id',
        GET_PERMISSIONS: '/roles/:id/permissions',
        UPDATE_PERMISSIONS: '/roles/:id/permissions'
    },

    // Employment endpoints
    EMPLOYMENT: {
        LIST: '/employments',
        SEARCH_BY_STAFF_ID: '/employments/search/staff-id/:staffId',
        FUNDING_ALLOCATIONS: '/employments/:id/funding-allocations',
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
        DETAILS: '/grants/:id',
        UPLOAD: '/grants/upload',
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

    // Budget Line endpoints
    BUDGET_LINE: {
        LIST: '/budget-lines',
        SEARCH_BY_CODE: '/budget-lines/by-code/:code',
        CREATE: '/budget-lines',
        UPDATE: '/budget-lines/:id',
        DELETE: '/budget-lines/:id',
        DETAILS: '/budget-lines/:id'
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

    // Department Position endpoints
    DEPARTMENT_POSITION: {
        LIST: '/department-positions',
        CREATE: '/department-positions',
        UPDATE: '/department-positions/:id',
        DELETE: '/department-positions/:id',
        DETAILS: '/department-positions/:id'
    },


    // Work location endpoints
    WORK_LOCATION: {
        LIST: '/worklocations',
        CREATE: '/worklocations',
        UPDATE: '/worklocations/:id',
        DELETE: '/worklocations/:id',
        DETAILS: '/worklocations/:id'
    },

    // Leave endpoints - Updated to match Laravel backend structure
    LEAVE: {
        TYPES: {
            LIST: '/leaves/types',
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
            DETAILS: '/leaves/balances/:id'
        },
        APPROVALS: {
            LIST: '/leaves/requests/:leaveRequestId/approvals',
            CREATE: '/leaves/requests/:leaveRequestId/approvals',
            UPDATE: '/leaves/approvals/:id',
            DELETE: '/leaves/approvals/:id',
            DETAILS: '/leaves/approvals/:id'
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
        CREATE: '/payrolls',
        UPDATE: '/payrolls/:id',
        DELETE: '/payrolls/:id',
        DETAILS: '/payrolls/:id',
        EMPLOYEE_EMPLOYMENT: '/payrolls/employee-employment',
        EMPLOYEE_EMPLOYMENT_CALCULATED: '/payrolls/employee-employment-calculated',
        PREVIEW_ADVANCES: '/payrolls/preview-advances',
        TAX_SUMMARY: '/payrolls/tax-summary/:id',
        CALCULATE: '/payrolls/calculate',
        BULK_CALCULATE: '/payrolls/bulk-calculate'
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
        BY_GRANT_ITEM: '/employee-funding-allocations/by-grant-item/:grantItemId'
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
    },

    // Notification endpoints
    NOTIFICATION: {
        LIST: '/notifications',
        MARK_ALL_READ: '/notifications/mark-all-read'
    },

    // Employee children endpoints
    EMPLOYEE_CHILDREN: {
        LIST: '/employee-children',
        CREATE: '/employee-children',
        UPDATE: '/employee-children/:id',
        DELETE: '/employee-children/:id',
        DETAILS: '/employee-children/:id'
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
    }

};
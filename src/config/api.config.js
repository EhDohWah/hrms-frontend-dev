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
        GRANT_POSITIONS: '/grants/grant-positions'
    },

    // Budget Line endpoints
    BUDGET_LINE: {
        LIST: '/budget-lines',
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
        DETAILS: '/interviews/:id'
    },

    // Lookup endpoints
    LOOKUP: {
        LIST: '/lookups',
        CREATE: '/lookups',
        UPDATE: '/lookups/:id',
        DELETE: '/lookups/:id',
        DETAILS: '/lookups/:id'
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

    // Leave endpoints
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
            LIST: '/leaves/approvals',
            CREATE: '/leaves/approvals',
            UPDATE: '/leaves/approvals/:id',
            DELETE: '/leaves/approvals/:id',
            DETAILS: '/leaves/approvals/:id'
        },
        TRADITIONAL: {
            LIST: '/leaves/traditional',
            CREATE: '/leaves/traditional',
            UPDATE: '/leaves/traditional/:id',
            DELETE: '/leaves/traditional/:id',
            DETAILS: '/leaves/traditional/:id'
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
        CREATE: '/payrolls',
        UPDATE: '/payrolls/:id',
        DELETE: '/payrolls/:id',
        DETAILS: '/payrolls/:id',
        EMPLOYEE_EMPLOYMENT: '/payrolls/employee-employment'
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
        DELETE: '/employee-funding-allocations/:id'
    },

    // JobOffer endpoints 
    JOB_OFFER: {
        LIST: '/job-offers',
        CREATE: '/job-offers',
        DETAILS: '/job-offers/:id',
        UPDATE: '/job-offers/:id',
        DELETE: '/job-offers/:id',
        GENERATE_PDF: '/job-offers/:id/pdf'
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
    }

};
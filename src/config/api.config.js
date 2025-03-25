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
        LIST: '/employees',
        CREATE: '/employees',
        UPDATE: '/employees/:id',
        DELETE: '/employees/:id',
        DETAILS: '/employees/:id',
        FILTER: '/employees/filter',
        SITE_RECORDS: '/employees/site-records'
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
        DETAILS: '/employments/:id'
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
        CREATE: '/grants',
        UPDATE: '/grants/:id',
        DELETE: '/grants/:id',
        DETAILS: '/grants/:id',
        UPLOAD: '/grants/upload',
        ITEMS: {
            LIST: '/grants/items',
            CREATE: '/grants/items',
            DELETE: '/grants/items/:id',
            UPDATE: '/grants/items/:id'
        },
        GRANT_POSITIONS: '/grants/grant-positions'
    },

    // Interview endpoints
    INTERVIEW: {
        LIST: '/interviews',
        CREATE: '/interviews',
        UPDATE: '/interviews/:id',
        DELETE: '/interviews/:id',
        DETAILS: '/interviews/:id',
        UPDATE_STATUS: '/interviews/:id/status',
        FEEDBACK: '/interviews/:id/feedback'
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
};
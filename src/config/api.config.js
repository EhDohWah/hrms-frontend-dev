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

    // User endpoints
    USER: {
        LIST: '/users',
        CREATE: '/users',
        UPDATE: '/users/:id',
        DELETE: '/users/:id',
        DETAILS: '/users/:id',
        GET_USER: '/user',
        UPDATE_PROFILE_PICTURE: '/profile-picture',
        UPDATE_USERNAME: '/username',
        UPDATE_PASSWORD: '/password',
        UPDATE_EMAIL: '/email'
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
        UPLOAD: '/grants/upload'
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
    }
};
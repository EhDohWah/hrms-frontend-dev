/**
 * Leave Management Utility Functions
 * Handles data transformation, formatting, and validation for the leave management system
 */

import moment from 'moment';

// Date formatting utilities
export const dateUtils = {
    /**
     * Format date for display in the UI
     * @param {string} date - Date string from backend
     * @param {string} format - Moment.js format string
     * @returns {string} Formatted date
     */
    formatDate(date, format = 'DD MMM YYYY') {
        if (!date) return '';
        return moment(date).format(format);
    },

    /**
     * Format date for API requests (backend expects YYYY-MM-DD)
     * @param {string|Date} date - Date to format
     * @returns {string} API-formatted date
     */
    formatForAPI(date) {
        if (!date) return '';
        return moment(date).format('YYYY-MM-DD');
    },

    /**
     * Calculate difference between two dates in days
     * @param {string} startDate - Start date
     * @param {string} endDate - End date
     * @returns {number} Number of days
     */
    calculateDays(startDate, endDate) {
        if (!startDate || !endDate) return 0;
        const start = moment(startDate);
        const end = moment(endDate);
        return end.diff(start, 'days') + 1; // +1 to include both start and end dates
    },

    /**
     * Check if date is in the past
     * @param {string} date - Date to check
     * @returns {boolean} True if date is in the past
     */
    isPastDate(date) {
        if (!date) return false;
        return moment(date).isBefore(moment(), 'day');
    },

    /**
     * Get date range presets for filtering
     * @returns {Object} Date range presets
     */
    getDateRangePresets() {
        return {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'This Year': [moment().startOf('year'), moment().endOf('year')]
        };
    }
};

// Status mapping and styling utilities
export const statusUtils = {
    /**
     * Get status display configuration
     * @param {string} status - Status from backend
     * @returns {Object} Status configuration with label, class, and color
     */
    getStatusConfig(status) {
        const statusMap = {
            'pending': {
                label: 'Pending',
                class: 'badge bg-warning-light text-warning',
                color: 'warning',
                icon: 'ti-clock'
            },
            'approved': {
                label: 'Approved',
                class: 'badge bg-success-light text-success',
                color: 'success',
                icon: 'ti-check'
            },
            'declined': {
                label: 'Declined',
                class: 'badge bg-danger-light text-danger',
                color: 'danger',
                icon: 'ti-x'
            },
            'cancelled': {
                label: 'Cancelled',
                class: 'badge bg-secondary-light text-secondary',
                color: 'secondary',
                icon: 'ti-ban'
            }
        };

        return statusMap[status?.toLowerCase()] || statusMap['pending'];
    },

    /**
     * Get all available statuses for dropdowns
     * @returns {Array} Array of status options
     */
    getAllStatuses() {
        return [
            { value: 'pending', label: 'Pending', color: 'warning' },
            { value: 'approved', label: 'Approved', color: 'success' },
            { value: 'declined', label: 'Declined', color: 'danger' },
            { value: 'cancelled', label: 'Cancelled', color: 'secondary' }
        ];
    }
};

// Data transformation utilities
export const dataMapper = {
    /**
     * Convert backend snake_case to frontend camelCase
     * @param {Object} obj - Object to convert
     * @returns {Object} Converted object
     */
    snakeToCamel(obj) {
        if (obj === null || typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => this.snakeToCamel(item));
        }

        const converted = {};
        for (const [key, value] of Object.entries(obj)) {
            const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
            converted[camelKey] = typeof value === 'object' ? this.snakeToCamel(value) : value;
        }
        return converted;
    },

    /**
     * Convert frontend camelCase to backend snake_case
     * @param {Object} obj - Object to convert
     * @returns {Object} Converted object
     */
    camelToSnake(obj) {
        if (obj === null || typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => this.camelToSnake(item));
        }

        const converted = {};
        for (const [key, value] of Object.entries(obj)) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            converted[snakeKey] = typeof value === 'object' ? this.camelToSnake(value) : value;
        }
        return converted;
    },

    /**
     * Map backend leave request data to frontend format
     * @param {Object} backendData - Leave request from backend
     * @returns {Object} Frontend-formatted leave request
     */
    mapLeaveRequest(backendData) {
        if (!backendData) return null;

        return {
            id: backendData.id,
            employeeId: backendData.employee_id,
            employee: backendData.employee ? {
                id: backendData.employee.id,
                staffId: backendData.employee.staff_id,
                name: `${backendData.employee.first_name_en} ${backendData.employee.last_name_en}`,
                firstName: backendData.employee.first_name_en,
                lastName: backendData.employee.last_name_en,
                subsidiary: backendData.employee.subsidiary,
                department: backendData.employee.employment?.department,
                position: backendData.employee.employment?.position
            } : null,
            leaveTypeId: backendData.leave_type_id,
            leaveType: backendData.leave_type ? {
                id: backendData.leave_type.id,
                name: backendData.leave_type.name,
                requiresAttachment: backendData.leave_type.requires_attachment,
                defaultDuration: backendData.leave_type.default_duration
            } : null,
            startDate: backendData.start_date,
            endDate: backendData.end_date,
            totalDays: backendData.total_days,
            reason: backendData.reason,
            status: backendData.status,
            createdAt: backendData.created_at,
            updatedAt: backendData.updated_at,
            approvals: backendData.approvals?.map(approval => ({
                id: approval.id,
                approverRole: approval.approver_role,
                approverName: approval.approver_name,
                approverSignature: approval.approver_signature,
                approvalDate: approval.approval_date,
                status: approval.status
            })) || [],
            attachments: backendData.attachments?.map(attachment => ({
                id: attachment.id,
                documentName: attachment.document_name,
                documentUrl: attachment.document_url,
                description: attachment.description,
                addedAt: attachment.added_at
            })) || []
        };
    },

    /**
     * Map frontend leave request data to backend format
     * @param {Object} frontendData - Leave request from frontend
     * @returns {Object} Backend-formatted leave request
     */
    mapLeaveRequestForAPI(frontendData) {
        if (!frontendData) return null;

        return {
            employee_id: frontendData.employeeId,
            leave_type_id: frontendData.leaveTypeId,
            start_date: dateUtils.formatForAPI(frontendData.startDate),
            end_date: dateUtils.formatForAPI(frontendData.endDate),
            total_days: frontendData.totalDays,
            reason: frontendData.reason,
            status: frontendData.status,
            documents: frontendData.attachments?.map(attachment => ({
                document_name: attachment.documentName,
                document_url: attachment.documentUrl,
                description: attachment.description
            })) || []
        };
    },

    /**
     * Map backend leave type data to frontend format
     * @param {Object} backendData - Leave type from backend
     * @returns {Object} Frontend-formatted leave type
     */
    mapLeaveType(backendData) {
        if (!backendData) return null;

        return {
            id: backendData.id,
            name: backendData.name,
            defaultDuration: backendData.default_duration,
            description: backendData.description,
            requiresAttachment: backendData.requires_attachment,
            createdAt: backendData.created_at,
            updatedAt: backendData.updated_at
        };
    },

    /**
     * Map backend leave balance data to frontend format
     * @param {Object} backendData - Leave balance from backend
     * @returns {Object} Frontend-formatted leave balance
     */
    mapLeaveBalance(backendData) {
        if (!backendData) return null;

        return {
            id: backendData.id,
            employeeId: backendData.employee_id,
            employee: backendData.employee ? {
                id: backendData.employee.id,
                staffId: backendData.employee.staff_id,
                name: `${backendData.employee.first_name_en} ${backendData.employee.last_name_en}`,
                subsidiary: backendData.employee.subsidiary
            } : null,
            leaveTypeId: backendData.leave_type_id,
            leaveType: backendData.leave_type ? {
                id: backendData.leave_type.id,
                name: backendData.leave_type.name
            } : null,
            totalDays: backendData.total_days,
            usedDays: backendData.used_days,
            remainingDays: backendData.remaining_days,
            year: backendData.year,
            createdAt: backendData.created_at,
            updatedAt: backendData.updated_at
        };
    }
};

// Validation utilities
export const validationUtils = {
    /**
     * Validate leave request form data
     * @param {Object} formData - Form data to validate
     * @returns {Object} Validation result with errors
     */
    validateLeaveRequest(formData) {
        const errors = {};

        if (!formData.employeeId) {
            errors.employeeId = 'Employee is required';
        }

        if (!formData.leaveTypeId) {
            errors.leaveTypeId = 'Leave type is required';
        }

        if (!formData.startDate) {
            errors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            errors.endDate = 'End date is required';
        }

        if (formData.startDate && formData.endDate) {
            if (moment(formData.endDate).isBefore(moment(formData.startDate))) {
                errors.endDate = 'End date must be after start date';
            }
        }

        if (!formData.totalDays || formData.totalDays <= 0) {
            errors.totalDays = 'Total days must be greater than 0';
        }

        if (formData.reason && formData.reason.length > 1000) {
            errors.reason = 'Reason must be less than 1000 characters';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },

    /**
     * Validate leave type form data
     * @param {Object} formData - Form data to validate
     * @returns {Object} Validation result with errors
     */
    validateLeaveType(formData) {
        const errors = {};

        if (!formData.name || formData.name.trim().length === 0) {
            errors.name = 'Leave type name is required';
        } else if (formData.name.length > 100) {
            errors.name = 'Leave type name must be less than 100 characters';
        }

        if (formData.defaultDuration !== null && formData.defaultDuration !== undefined) {
            if (isNaN(formData.defaultDuration) || formData.defaultDuration < 0) {
                errors.defaultDuration = 'Default duration must be a positive number';
            }
        }

        if (formData.description && formData.description.length > 1000) {
            errors.description = 'Description must be less than 1000 characters';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

// Filter and sorting utilities
export const filterUtils = {
    /**
     * Build query parameters for API requests
     * @param {Object} filters - Filter object
     * @returns {Object} Query parameters
     */
    buildQueryParams(filters) {
        const params = {};

        if (filters.page) params.page = filters.page;
        if (filters.perPage) params.per_page = filters.perPage;
        if (filters.search) params.search = filters.search;
        if (filters.from) params.from = dateUtils.formatForAPI(filters.from);
        if (filters.to) params.to = dateUtils.formatForAPI(filters.to);
        if (filters.leaveTypes && filters.leaveTypes.length > 0) {
            params.leave_types = filters.leaveTypes.join(',');
        }
        if (filters.status) params.status = filters.status;
        if (filters.sortBy) params.sort_by = filters.sortBy;
        if (filters.employeeId) params.employee_id = filters.employeeId;
        if (filters.leaveTypeId) params.leave_type_id = filters.leaveTypeId;
        if (filters.year) params.year = filters.year;

        return params;
    },

    /**
     * Get sort options for dropdowns
     * @returns {Array} Sort options
     */
    getSortOptions() {
        return [
            { value: 'recently_added', label: 'Recently Added' },
            { value: 'ascending', label: 'Date Ascending' },
            { value: 'descending', label: 'Date Descending' },
            { value: 'last_month', label: 'Last Month' },
            { value: 'last_7_days', label: 'Last 7 Days' }
        ];
    }
};

// Export all utilities as a single object
export default {
    dateUtils,
    statusUtils,
    dataMapper,
    validationUtils,
    filterUtils
};


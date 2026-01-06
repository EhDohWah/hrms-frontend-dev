/**
 * Resignation Management Utility Functions
 * Handles data transformation, formatting, and validation for the resignation management system
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
     * Calculate working days between resignation date and last working date
     * @param {string} resignationDate - Resignation date
     * @param {string} lastWorkingDate - Last working date
     * @returns {number} Number of working days
     */
    calculateNoticePeriod(resignationDate, lastWorkingDate) {
        if (!resignationDate || !lastWorkingDate) return 0;
        const start = moment(resignationDate);
        const end = moment(lastWorkingDate);
        return end.diff(start, 'days') + 1;
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
     * Check if last working date is after resignation date
     * @param {string} resignationDate - Resignation date
     * @param {string} lastWorkingDate - Last working date
     * @returns {boolean} True if valid date sequence
     */
    isValidDateSequence(resignationDate, lastWorkingDate) {
        if (!resignationDate || !lastWorkingDate) return false;
        return moment(lastWorkingDate).isSameOrAfter(moment(resignationDate));
    }
};

// Status mapping and styling utilities
export const statusUtils = {
    /**
     * Get acknowledgement status display configuration
     * @param {string} status - Status from backend
     * @returns {Object} Status configuration with label, class, and color
     */
    getAcknowledgementStatusConfig(status) {
        const statusMap = {
            'Pending': {
                label: 'Pending',
                class: 'badge bg-warning-light text-warning',
                color: 'warning',
                icon: 'ti-clock'
            },
            'Acknowledged': {
                label: 'Acknowledged',
                class: 'badge bg-success-light text-success',
                color: 'success',
                icon: 'ti-check'
            },
            'Rejected': {
                label: 'Rejected',
                class: 'badge bg-danger-light text-danger',
                color: 'danger',
                icon: 'ti-x'
            }
        };

        return statusMap[status] || {
            label: status || 'Unknown',
            class: 'badge bg-secondary-light text-secondary',
            color: 'secondary',
            icon: 'ti-help'
        };
    },

    /**
     * Get all available acknowledgement status options
     * @returns {Array} Array of status options
     */
    getAcknowledgementStatusOptions() {
        return [
            { value: 'Pending', label: 'Pending', color: 'warning' },
            { value: 'Acknowledged', label: 'Acknowledged', color: 'success' },
            { value: 'Rejected', label: 'Rejected', color: 'danger' }
        ];
    }
};

// Resignation reason utilities
export const reasonUtils = {
    /**
     * Get predefined resignation reasons
     * @returns {Array} Array of resignation reasons
     */
    getResignationReasons() {
        return [
            'Better Opportunity',
            'Career Growth',
            'Personal Reasons',
            'Health Issues',
            'Relocation',
            'Education/Studies',
            'Family Responsibilities',
            'Retirement',
            'Company Culture',
            'Work-Life Balance',
            'Salary Issues',
            'Contract End',
            'Other'
        ];
    },

    /**
     * Validate resignation reason
     * @param {string} reason - Resignation reason
     * @returns {boolean} True if valid
     */
    isValidReason(reason) {
        if (!reason || reason.trim().length === 0) return false;
        return reason.trim().length >= 3 && reason.trim().length <= 50;
    }
};

// Data transformation utilities
export const dataMapper = {
    /**
     * Transform resignation data from backend format to frontend format
     * @param {Object} backendData - Data from backend API
     * @returns {Object} Frontend-formatted data
     */
    mapResignation(backendData) {
        if (!backendData) return null;

        return {
            id: backendData.id,
            employeeId: backendData.employee_id,
            departmentId: backendData.department_id,
            positionId: backendData.position_id,
            resignationDate: backendData.resignation_date,
            lastWorkingDate: backendData.last_working_date,
            reason: backendData.reason,
            reasonDetails: backendData.reason_details,
            acknowledgementStatus: backendData.acknowledgement_status || 'Pending',
            acknowledgedBy: backendData.acknowledged_by,
            acknowledgedAt: backendData.acknowledged_at,
            noticePeriod: dateUtils.calculateNoticePeriod(backendData.resignation_date, backendData.last_working_date),

            // Metadata
            createdAt: backendData.created_at,
            updatedAt: backendData.updated_at,
            createdBy: backendData.created_by,
            updatedBy: backendData.updated_by,

            // Related data (if included)
            employee: backendData.employee ? {
                id: backendData.employee.id,
                staffId: backendData.employee.staff_id,
                firstNameEn: backendData.employee.first_name_en,
                lastNameEn: backendData.employee.last_name_en,
                name: `${backendData.employee.first_name_en} ${backendData.employee.last_name_en}`.trim(),
                organization: backendData.employee.organization,
                email: backendData.employee.email,
                mobilePhone: backendData.employee.mobile_phone
            } : null,

            department: backendData.department ? {
                id: backendData.department.id,
                name: backendData.department.name,
                code: backendData.department.code
            } : null,

            position: backendData.position ? {
                id: backendData.position.id,
                title: backendData.position.title,
                department: backendData.position.department
            } : null,

            acknowledger: backendData.acknowledger ? {
                id: backendData.acknowledger.id,
                name: `${backendData.acknowledger.first_name_en} ${backendData.acknowledger.last_name_en}`.trim(),
                staffId: backendData.acknowledger.staff_id
            } : null
        };
    },

    /**
     * Transform resignation data from frontend format to backend format for API calls
     * @param {Object} frontendData - Data from frontend form
     * @returns {Object} Backend-formatted data
     */
    mapResignationForAPI(frontendData) {
        if (!frontendData) return null;

        const apiData = {
            employee_id: frontendData.employeeId || frontendData.employee_id,
            department_id: frontendData.departmentId || frontendData.department_id,
            position_id: frontendData.positionId || frontendData.position_id,
            resignation_date: dateUtils.formatForAPI(frontendData.resignationDate || frontendData.resignation_date),
            last_working_date: dateUtils.formatForAPI(frontendData.lastWorkingDate || frontendData.last_working_date),
            reason: frontendData.reason,
            reason_details: frontendData.reasonDetails || frontendData.reason_details,
            acknowledgement_status: frontendData.acknowledgementStatus || frontendData.acknowledgement_status || 'Pending'
        };

        // Remove null/undefined values
        Object.keys(apiData).forEach(key => {
            if (apiData[key] === null || apiData[key] === undefined || apiData[key] === '') {
                delete apiData[key];
            }
        });

        return apiData;
    },

    /**
     * Transform acknowledgement data for API calls
     * @param {Object} acknowledgementData - Acknowledgement data
     * @returns {Object} Backend-formatted acknowledgement data
     */
    mapAcknowledgementForAPI(acknowledgementData) {
        return {
            acknowledgement_status: acknowledgementData.status,
            acknowledged_by: acknowledgementData.acknowledgedBy
        };
    }
};

// Filter and query utilities
export const filterUtils = {
    /**
     * Build query parameters for API requests
     * @param {Object} filters - Filter object
     * @returns {Object} Query parameters
     */
    buildQueryParams(filters = {}) {
        const params = {};

        // Pagination
        if (filters.page) params.page = filters.page;
        if (filters.perPage || filters.per_page) params.per_page = filters.perPage || filters.per_page;

        // Search and basic filters
        if (filters.search && filters.search.trim()) params.search = filters.search.trim();
        if (filters.employeeId || filters.employee_id) params.employee_id = filters.employeeId || filters.employee_id;
        if (filters.departmentId || filters.department_id) params.department_id = filters.departmentId || filters.department_id;
        if (filters.positionId || filters.position_id) params.position_id = filters.positionId || filters.position_id;
        if (filters.acknowledgementStatus || filters.acknowledgement_status) {
            params.acknowledgement_status = filters.acknowledgementStatus || filters.acknowledgement_status;
        }
        if (filters.reason) params.reason = filters.reason;

        // Date filters
        if (filters.resignationDateFrom || filters.resignation_date_from) {
            params.resignation_date_from = dateUtils.formatForAPI(filters.resignationDateFrom || filters.resignation_date_from);
        }
        if (filters.resignationDateTo || filters.resignation_date_to) {
            params.resignation_date_to = dateUtils.formatForAPI(filters.resignationDateTo || filters.resignation_date_to);
        }
        if (filters.lastWorkingDateFrom || filters.last_working_date_from) {
            params.last_working_date_from = dateUtils.formatForAPI(filters.lastWorkingDateFrom || filters.last_working_date_from);
        }
        if (filters.lastWorkingDateTo || filters.last_working_date_to) {
            params.last_working_date_to = dateUtils.formatForAPI(filters.lastWorkingDateTo || filters.last_working_date_to);
        }

        // Sorting
        if (filters.sortBy || filters.sort_by) params.sort_by = filters.sortBy || filters.sort_by;
        if (filters.sortOrder || filters.sort_order) params.sort_order = filters.sortOrder || filters.sort_order;

        return params;
    },

    /**
     * Get default filter values
     * @returns {Object} Default filters
     */
    getDefaultFilters() {
        return {
            page: 1,
            perPage: 10,
            search: '',
            employeeId: null,
            departmentId: null,
            positionId: null,
            acknowledgementStatus: null,
            reason: null,
            resignationDateFrom: null,
            resignationDateTo: null,
            lastWorkingDateFrom: null,
            lastWorkingDateTo: null,
            sortBy: 'created_at',
            sortOrder: 'desc'
        };
    }
};

// Validation utilities
export const validationUtils = {
    /**
     * Validate resignation form data
     * @param {Object} data - Form data to validate
     * @returns {Object} Validation result with isValid and errors
     */
    validateResignation(data) {
        const errors = {};

        // Required fields
        if (!data.employeeId && !data.employee_id) {
            errors.employeeId = 'Employee is required';
        }

        if (!data.resignationDate && !data.resignation_date) {
            errors.resignationDate = 'Resignation date is required';
        }

        if (!data.lastWorkingDate && !data.last_working_date) {
            errors.lastWorkingDate = 'Last working date is required';
        }

        if (!data.reason || data.reason.trim().length === 0) {
            errors.reason = 'Resignation reason is required';
        } else if (!reasonUtils.isValidReason(data.reason)) {
            errors.reason = 'Reason must be between 3 and 50 characters';
        }

        // Date validations
        const resignationDate = data.resignationDate || data.resignation_date;
        const lastWorkingDate = data.lastWorkingDate || data.last_working_date;

        if (resignationDate && lastWorkingDate) {
            if (!dateUtils.isValidDateSequence(resignationDate, lastWorkingDate)) {
                errors.lastWorkingDate = 'Last working date must be on or after resignation date';
            }
        }

        // Reason details length check
        if (data.reasonDetails && data.reasonDetails.length > 1000) {
            errors.reasonDetails = 'Reason details cannot exceed 1000 characters';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },

    /**
     * Validate acknowledgement data
     * @param {Object} data - Acknowledgement data to validate
     * @returns {Object} Validation result
     */
    validateAcknowledgement(data) {
        const errors = {};

        if (!data.status) {
            errors.status = 'Acknowledgement status is required';
        }

        if (!data.acknowledgedBy) {
            errors.acknowledgedBy = 'Acknowledger is required';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

// Export utilities
export const exportUtils = {
    /**
     * Generate filename for export
     * @param {string} type - Export type (pdf, excel, csv)
     * @param {Object} filters - Applied filters
     * @returns {string} Generated filename
     */
    generateFilename(type, filters = {}) {
        const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
        let filename = `resignations_${timestamp}`;

        // Add filter indicators to filename
        if (filters.acknowledgementStatus) {
            filename += `_${filters.acknowledgementStatus.toLowerCase()}`;
        }
        if (filters.departmentId) {
            filename += `_dept-${filters.departmentId}`;
        }

        return `${filename}.${type}`;
    }
};

// Statistics utilities
export const statsUtils = {
    /**
     * Calculate resignation statistics from data array
     * @param {Array} resignations - Array of resignation records
     * @returns {Object} Statistics object
     */
    calculateStats(resignations = []) {
        const total = resignations.length;
        const pending = resignations.filter(r => r.acknowledgementStatus === 'Pending').length;
        const acknowledged = resignations.filter(r => r.acknowledgementStatus === 'Acknowledged').length;
        const rejected = resignations.filter(r => r.acknowledgementStatus === 'Rejected').length;

        // Current month resignations
        const currentMonth = resignations.filter(r =>
            moment(r.resignationDate).isSame(moment(), 'month')
        ).length;

        // Resignation reasons breakdown
        const reasonBreakdown = {};
        resignations.forEach(r => {
            if (r.reason) {
                reasonBreakdown[r.reason] = (reasonBreakdown[r.reason] || 0) + 1;
            }
        });

        return {
            total,
            pending,
            acknowledged,
            rejected,
            currentMonth,
            reasonBreakdown
        };
    }
};

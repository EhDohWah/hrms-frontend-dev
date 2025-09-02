// base.service.js
/**
 * Base service class providing common API response handling and utilities
 * All service classes should extend this base class for consistent error handling
 */
export class BaseService {

    /**
     * Handle API responses with proper HTTP status code handling
     * @param {Function} apiCall - The API call function
     * @param {string} operation - Description of the operation for error messages
     * @returns {Promise} Processed response
     */
    async handleApiResponse(apiCall, operation) {
        try {
            const response = await apiCall();

            // Handle successful responses (200, 201)
            if (response && response.success !== false) {
                return response;
            }

            // Handle case where response exists but success is false
            throw new Error(response?.message || `Failed to ${operation}`);
        } catch (error) {
            // Handle HTTP error responses
            if (error.response) {
                const { status, data } = error.response;

                switch (status) {
                    case 404:
                        // Not found - return structured error response
                        throw {
                            status: 404,
                            success: false,
                            message: data?.message || `Resource not found`,
                            error: data?.error || 'Not found'
                        };

                    case 422:
                        // Validation error - return detailed validation errors
                        throw {
                            status: 422,
                            success: false,
                            message: data?.message || 'Validation failed',
                            errors: data?.errors || {},
                            error: data?.error
                        };

                    case 500:
                        // Server error - return server error details
                        throw {
                            status: 500,
                            success: false,
                            message: data?.message || 'Internal server error',
                            error: data?.error || 'Server error occurred'
                        };

                    case 401:
                        // Unauthorized - authentication required
                        throw {
                            status: 401,
                            success: false,
                            message: data?.message || 'Authentication required',
                            error: data?.error || 'Unauthorized access'
                        };

                    case 403:
                        // Forbidden - insufficient permissions
                        throw {
                            status: 403,
                            success: false,
                            message: data?.message || 'Access forbidden',
                            error: data?.error || 'Insufficient permissions'
                        };

                    default:
                        // Other HTTP errors
                        throw {
                            status: status,
                            success: false,
                            message: data?.message || `HTTP ${status} error occurred`,
                            error: data?.error || error.message
                        };
                }
            }

            // Handle network or other errors
            throw {
                status: 0,
                success: false,
                message: `Failed to ${operation}`,
                error: error.message || 'Network or unknown error'
            };
        }
    }

    /**
     * Handle specific error types for better user experience
     * @param {Object} error - Error object from API call
     * @param {string} context - Context of the operation
     * @returns {Object} Formatted error response
     */
    formatError(error, context = '') {
        if (error.status) {
            // Already formatted error from handleApiResponse
            return error;
        }

        // Format unhandled errors
        return {
            status: error.response?.status || 0,
            success: false,
            message: error.message || `Operation failed${context ? `: ${context}` : ''}`,
            error: error.response?.data?.error || error.message || 'Unknown error'
        };
    }

    /**
     * Check if a date string is valid
     * @param {string} dateString - Date string to validate
     * @returns {boolean} True if valid date
     */
    isValidDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Validate required fields in data object
     * @param {Object} data - Data object to validate
     * @param {Array} requiredFields - Array of required field names
     * @returns {Object} Validation result with isValid and errors
     */
    validateRequiredFields(data, requiredFields) {
        const errors = {};

        requiredFields.forEach(field => {
            if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
                errors[field] = [`${field.replace('_', ' ')} is required`];
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Validate numeric fields
     * @param {Object} data - Data object to validate
     * @param {Array} numericFields - Array of numeric field configurations
     * @returns {Object} Validation result
     */
    validateNumericFields(data, numericFields) {
        const errors = {};

        numericFields.forEach(config => {
            const { field, min = null, max = null, required = false } = config;
            const value = data[field];

            if (required && (value === undefined || value === null || value === '')) {
                errors[field] = [`${field.replace('_', ' ')} is required`];
                return;
            }

            if (value !== undefined && value !== null && value !== '') {
                const numValue = Number(value);

                if (isNaN(numValue)) {
                    errors[field] = [`${field.replace('_', ' ')} must be a valid number`];
                } else {
                    if (min !== null && numValue < min) {
                        errors[field] = [`${field.replace('_', ' ')} must be at least ${min}`];
                    }
                    if (max !== null && numValue > max) {
                        errors[field] = [`${field.replace('_', ' ')} must be at most ${max}`];
                    }
                }
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Build query string from parameters object
     * @param {Object} params - Parameters object
     * @returns {string} Query string
     */
    buildQueryString(params = {}) {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        return queryParams.toString();
    }

    /**
     * Combine validation results from multiple validators
     * @param {Array} validationResults - Array of validation result objects
     * @returns {Object} Combined validation result
     */
    combineValidations(validationResults) {
        const combinedErrors = {};
        let isValid = true;

        validationResults.forEach(result => {
            if (!result.isValid) {
                isValid = false;
                Object.assign(combinedErrors, result.errors);
            }
        });

        return {
            isValid,
            errors: combinedErrors
        };
    }

    /**
     * Create a validation error response
     * @param {Object} errors - Validation errors object
     * @param {string} message - Custom message
     * @returns {Object} Validation error response
     */
    createValidationError(errors, message = 'Validation failed') {
        return {
            status: 422,
            success: false,
            message,
            errors
        };
    }

    /**
     * Log errors for debugging (can be extended for different environments)
     * @param {Object} error - Error object
     * @param {string} context - Context where error occurred
     */
    logError(error, context = '') {
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${context}] API Error:`, error);
        }

        // In production, you might want to send to error tracking service
        // Example: Sentry, LogRocket, etc.
    }

    /**
     * Handle file upload validation
     * @param {File} file - File object to validate
     * @param {Object} options - Validation options
     * @returns {Object} Validation result
     */
    validateFile(file, options = {}) {
        const {
            maxSize = 10 * 1024 * 1024, // 10MB default
            allowedTypes = [],
            required = true
        } = options;

        const errors = {};

        if (required && !file) {
            errors.file = ['File is required'];
            return { isValid: false, errors };
        }

        if (file) {
            if (file.size > maxSize) {
                errors.file = [`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`];
            }

            if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
                errors.file = [`File type must be one of: ${allowedTypes.join(', ')}`];
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Retry API call with exponential backoff
     * @param {Function} apiCall - API call function
     * @param {number} maxRetries - Maximum number of retries
     * @param {number} baseDelay - Base delay in milliseconds
     * @returns {Promise} API response
     */
    async retryApiCall(apiCall, maxRetries = 3, baseDelay = 1000) {
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await apiCall();
            } catch (error) {
                lastError = error;

                // Don't retry for client errors (4xx)
                if (error.response && error.response.status >= 400 && error.response.status < 500) {
                    throw error;
                }

                if (attempt < maxRetries) {
                    const delay = baseDelay * Math.pow(2, attempt);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;
    }
}

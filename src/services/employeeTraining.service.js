import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class EmployeeTrainingService extends BaseService {
    /**
     * Get all employee training records with pagination and filtering
     * @param {Object} params - Query parameters (page, per_page, filter_training_id, filter_employee_id, filter_status, etc.)
     * @returns {Promise<Object>} API response
     */
    async getEmployeeTrainings(params = {}) {
        try {
            // Build query parameters object
            const queryParams = new URLSearchParams();

            // Add all parameters from params object
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const endpoint = `${API_ENDPOINTS.EMPLOYEE_TRAINING.LIST}?${queryParams.toString()}`;
            const response = await apiService.get(endpoint);
            return response; // This should return the full API response including pagination metadata
        } catch (error) {
            console.error('Error fetching employee trainings:', error);
            throw error;
        }
    }

    /**
     * Get single employee training record by ID
     * @param {number} id - Employee training ID
     * @returns {Promise<Object>} API response
     */
    async getEmployeeTraining(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE_TRAINING.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }

    /**
     * Create new employee training record
     * @param {Object} data - Employee training data
     * @returns {Promise<Object>} API response
     */
    async createEmployeeTraining(data) {
        const formattedData = this.formatEmployeeTrainingData(data);
        return await apiService.post(API_ENDPOINTS.EMPLOYEE_TRAINING.CREATE, formattedData);
    }

    /**
     * Update existing employee training record
     * @param {number} id - Employee training ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} API response
     */
    async updateEmployeeTraining(id, data) {
        const endpoint = API_ENDPOINTS.EMPLOYEE_TRAINING.UPDATE.replace(':id', id);
        const formattedData = this.formatEmployeeTrainingData(data);
        return await apiService.put(endpoint, formattedData);
    }

    /**
     * Delete employee training record
     * @param {number} id - Employee training ID
     * @returns {Promise<Object>} API response
     */
    async deleteEmployeeTraining(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE_TRAINING.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    /**
     * Delete selected employee training records
     * @param {number[]} ids - Array of employee training IDs
     * @returns {Promise<Object>} API response
     */
    async deleteSelectedEmployeeTrainings(ids) {
        // Delete individually as backend doesn't have bulk delete endpoint
        const deletePromises = ids.map(id => this.deleteEmployeeTraining(id));
        return Promise.all(deletePromises);
    }

    /**
     * Format employee training data for API submission
     * @param {Object} data - Raw form data
     * @returns {Object} Formatted data
     */
    formatEmployeeTrainingData(data) {
        return {
            employee_id: parseInt(data.employee_id),
            training_id: parseInt(data.training_id),
            status: data.status || null,
            created_by: data.created_by || null,
            updated_by: data.updated_by || null
        };
    }

    /**
     * Validate employee training form data
     * @param {Object} data - Form data to validate
     * @returns {Object} Validation result
     */
    validateEmployeeTrainingData(data) {
        const errors = {};

        // Required fields
        if (!data.employee_id) {
            errors.employee_id = 'Employee is required';
        }

        if (!data.training_id) {
            errors.training_id = 'Training program is required';
        }

        if (!data.status || data.status.trim() === '') {
            errors.status = 'Status is required';
        }

        // Validate status values
        const validStatuses = ['Completed', 'In Progress', 'Pending', 'Cancelled'];
        if (data.status && !validStatuses.includes(data.status)) {
            errors.status = 'Invalid status value. Must be one of: Completed, In Progress, Pending, Cancelled';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Get available status options
     * @returns {Array} Array of status objects
     */
    getStatusOptions() {
        return [
            { value: 'Pending', label: 'Pending' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Cancelled', label: 'Cancelled' }
        ];
    }
}

export const employeeTrainingService = new EmployeeTrainingService();



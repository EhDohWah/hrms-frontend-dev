import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * Employee Beneficiary Service
 * Handles all CRUD operations for employee beneficiaries
 */
class EmployeeBeneficiaryService {
    /**
     * Get all employee beneficiaries
     * @returns {Promise<Object>} Response with beneficiaries list
     */
    async getAllBeneficiaries() {
        try {
            const response = await apiService.get(API_ENDPOINTS.EMPLOYEE_BENEFICIARIES.LIST);
            return response.data;
        } catch (error) {
            console.error('Error fetching employee beneficiaries:', error);
            throw error;
        }
    }

    /**
     * Get employee beneficiaries by employee ID
     * @param {number} employeeId - Employee ID
     * @returns {Promise<Object>} Response with employee's beneficiaries
     */
    async getBeneficiariesByEmployeeId(employeeId) {
        try {
            const response = await apiService.get(`${API_ENDPOINTS.EMPLOYEE_BENEFICIARIES.LIST}?employee_id=${employeeId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employee beneficiaries:', error);
            throw error;
        }
    }

    /**
     * Get a specific employee beneficiary by ID
     * @param {number} id - Beneficiary ID
     * @returns {Promise<Object>} Response with beneficiary details
     */
    async getBeneficiaryById(id) {
        try {
            const url = API_ENDPOINTS.EMPLOYEE_BENEFICIARIES.DETAILS.replace(':id', id);
            const response = await apiService.get(url);
            return response.data;
        } catch (error) {
            console.error(`Error fetching beneficiary ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new employee beneficiary
     * @param {Object} beneficiaryData - Beneficiary data
     * @param {number} beneficiaryData.employee_id - Employee ID
     * @param {string} beneficiaryData.beneficiary_name - Beneficiary name
     * @param {string} beneficiaryData.beneficiary_relationship - Relationship to employee
     * @param {string} beneficiaryData.phone_number - Phone number
     * @param {string} beneficiaryData.beneficiary_email - Email address (optional)
     * @param {string} beneficiaryData.beneficiary_address - Address (optional)
     * @param {string} beneficiaryData.created_by - Created by user (optional)
     * @returns {Promise<Object>} Response with created beneficiary
     */
    async createBeneficiary(beneficiaryData) {
        try {
            // Prepare payload according to backend API requirements
            const payload = {
                employee_id: beneficiaryData.employee_id,
                beneficiary_name: beneficiaryData.beneficiary_name,
                beneficiary_relationship: beneficiaryData.beneficiary_relationship,
                phone_number: beneficiaryData.phone_number,
                created_by: beneficiaryData.created_by || 'system'
            };

            // Add optional fields if provided
            if (beneficiaryData.beneficiary_email) {
                payload.beneficiary_email = beneficiaryData.beneficiary_email;
            }
            if (beneficiaryData.beneficiary_address) {
                payload.beneficiary_address = beneficiaryData.beneficiary_address;
            }

            const response = await apiService.post(API_ENDPOINTS.EMPLOYEE_BENEFICIARIES.CREATE, payload);
            return response;
        } catch (error) {
            console.error('Error creating employee beneficiary:', error);
            throw error;
        }
    }

    /**
     * Update an existing employee beneficiary
     * @param {number} id - Beneficiary ID
     * @param {Object} beneficiaryData - Updated beneficiary data
     * @returns {Promise<Object>} Response with updated beneficiary
     */
    async updateBeneficiary(id, beneficiaryData) {
        try {
            // Prepare payload according to backend API requirements
            const payload = {
                employee_id: beneficiaryData.employee_id,
                beneficiary_name: beneficiaryData.beneficiary_name,
                beneficiary_relationship: beneficiaryData.beneficiary_relationship,
                phone_number: beneficiaryData.phone_number,
                updated_by: beneficiaryData.updated_by || 'system'
            };

            // Add optional fields if provided
            if (beneficiaryData.beneficiary_email) {
                payload.beneficiary_email = beneficiaryData.beneficiary_email;
            }
            if (beneficiaryData.beneficiary_address) {
                payload.beneficiary_address = beneficiaryData.beneficiary_address;
            }

            const url = API_ENDPOINTS.EMPLOYEE_BENEFICIARIES.UPDATE.replace(':id', id);
            const response = await apiService.put(url, payload);
            return response;
        } catch (error) {
            console.error(`Error updating beneficiary ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete an employee beneficiary
     * @param {number} id - Beneficiary ID
     * @returns {Promise<Object>} Response confirming deletion
     */
    async deleteBeneficiary(id) {
        try {
            const url = API_ENDPOINTS.EMPLOYEE_BENEFICIARIES.DELETE.replace(':id', id);
            const response = await apiService.delete(url);
            return response;
        } catch (error) {
            console.error(`Error deleting beneficiary ${id}:`, error);
            throw error;
        }
    }

    /**
     * Validate beneficiary data before submission
     * @param {Object} beneficiaryData - Beneficiary data to validate
     * @returns {Object} Validation result
     */
    validateBeneficiaryData(beneficiaryData) {
        const errors = [];

        // Required field validations
        if (!beneficiaryData.employee_id) {
            errors.push('Employee ID is required');
        }

        if (!beneficiaryData.beneficiary_name || beneficiaryData.beneficiary_name.trim() === '') {
            errors.push('Beneficiary name is required');
        } else if (beneficiaryData.beneficiary_name.length > 255) {
            errors.push('Beneficiary name must not exceed 255 characters');
        }

        if (!beneficiaryData.beneficiary_relationship || beneficiaryData.beneficiary_relationship.trim() === '') {
            errors.push('Beneficiary relationship is required');
        } else if (beneficiaryData.beneficiary_relationship.length > 100) {
            errors.push('Beneficiary relationship must not exceed 100 characters');
        }

        if (!beneficiaryData.phone_number || beneficiaryData.phone_number.trim() === '') {
            errors.push('Phone number is required');
        } else if (beneficiaryData.phone_number.length > 20) {
            errors.push('Phone number must not exceed 20 characters');
        }

        // Optional field validations
        if (beneficiaryData.beneficiary_email && beneficiaryData.beneficiary_email.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(beneficiaryData.beneficiary_email)) {
                errors.push('Please enter a valid email address');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Format beneficiary data for display
     * @param {Object} beneficiary - Raw beneficiary data
     * @returns {Object} Formatted beneficiary data
     */
    formatBeneficiaryForDisplay(beneficiary) {
        return {
            id: beneficiary.id,
            employeeId: beneficiary.employee_id,
            name: beneficiary.beneficiary_name || 'N/A',
            relationship: beneficiary.beneficiary_relationship || 'N/A',
            phone: beneficiary.phone_number || 'N/A',
            email: beneficiary.beneficiary_email || 'N/A',
            address: beneficiary.beneficiary_address || 'N/A',
            createdBy: beneficiary.created_by || 'N/A',
            updatedBy: beneficiary.updated_by || 'N/A',
            createdAt: beneficiary.created_at,
            updatedAt: beneficiary.updated_at,
            // Employee information if included in response
            employee: beneficiary.employee ? {
                id: beneficiary.employee.id,
                staffId: beneficiary.employee.staff_id,
                name: `${beneficiary.employee.first_name_en || ''} ${beneficiary.employee.last_name_en || ''}`.trim(),
                subsidiary: beneficiary.employee.subsidiary
            } : null
        };
    }
}

// Create and export a singleton instance
const employeeBeneficiaryService = new EmployeeBeneficiaryService();
export default employeeBeneficiaryService; 
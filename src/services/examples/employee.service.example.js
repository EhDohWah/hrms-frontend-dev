// employee.service.example.js
// Example of how to create other service files using the BaseService

import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { BaseService } from '@/services/base.service';

class EmployeeService extends BaseService {

    // Get all employees with pagination
    async getAllEmployees(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.EMPLOYEE.LIST}${queryString ? `?${queryString}` : ''}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch employees'
        );
    }

    // Get employee by ID
    async getEmployeeById(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE.GET_BY_ID.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch employee by ID'
        );
    }

    // Create new employee
    async createEmployee(employeeData) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.EMPLOYEE.CREATE, employeeData),
            'create employee'
        );
    }

    // Update employee
    async updateEmployee(id, employeeData) {
        const endpoint = API_ENDPOINTS.EMPLOYEE.UPDATE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, employeeData),
            'update employee'
        );
    }

    // Delete employee
    async deleteEmployee(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            'delete employee'
        );
    }

    // Custom validation for employee data
    validateEmployeeData(employeeData) {
        // Use base class validation for required fields
        const requiredValidation = this.validateRequiredFields(employeeData, [
            'first_name', 'last_name', 'email', 'department_id'
        ]);

        // Use base class validation for numeric fields
        const numericValidation = this.validateNumericFields(employeeData, [
            { field: 'salary', min: 0, required: false },
            { field: 'department_id', min: 1, required: true }
        ]);

        // Custom validations
        const customErrors = {};

        if (employeeData.email && !this.isValidEmail(employeeData.email)) {
            customErrors.email = ['Invalid email format'];
        }

        if (employeeData.phone && !this.isValidPhone(employeeData.phone)) {
            customErrors.phone = ['Invalid phone format'];
        }

        if (employeeData.hire_date && !this.isValidDate(employeeData.hire_date)) {
            customErrors.hire_date = ['Invalid date format'];
        }

        // Combine all validations
        return this.combineValidations([
            requiredValidation,
            numericValidation,
            { isValid: Object.keys(customErrors).length === 0, errors: customErrors }
        ]);
    }

    // Create employee with validation
    async createEmployeeWithValidation(employeeData) {
        const validation = this.validateEmployeeData(employeeData);

        if (!validation.isValid) {
            throw this.createValidationError(validation.errors);
        }

        return await this.createEmployee(employeeData);
    }

    // Upload employee photo
    async uploadEmployeePhoto(employeeId, photoFile) {
        const validation = this.validateFile(photoFile, {
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/jpg']
        });

        if (!validation.isValid) {
            throw this.createValidationError(validation.errors);
        }

        const formData = new FormData();
        formData.append('photo', photoFile);
        formData.append('employee_id', employeeId);

        return await this.handleApiResponse(
            () => apiService.postFormData(API_ENDPOINTS.EMPLOYEE.UPLOAD_PHOTO, formData),
            'upload employee photo'
        );
    }

    // Custom validation helpers
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Search employees with retry mechanism
    async searchEmployees(searchTerm) {
        return await this.retryApiCall(
            () => this.handleApiResponse(
                () => apiService.get(`${API_ENDPOINTS.EMPLOYEE.SEARCH}?q=${encodeURIComponent(searchTerm)}`),
                'search employees'
            ),
            3, // max retries
            1000 // base delay
        );
    }
}

export const employeeService = new EmployeeService();

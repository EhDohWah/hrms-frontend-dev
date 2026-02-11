import moment from 'moment';
import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class EmployeeEducationService {

    // Get all employee education records
    async getEmployeeEducation(params = {}) {
        return await apiService.get(API_ENDPOINTS.EMPLOYEE_EDUCATION.LIST, { params });
    }

    // Get single employee education details
    async getEmployeeEducationDetails(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE_EDUCATION.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }

    // Create employee education
    async createEmployeeEducation(data) {
        const formattedData = this.formatEmployeeEducationData(data);
        return await apiService.post(API_ENDPOINTS.EMPLOYEE_EDUCATION.CREATE, formattedData);
    }

    // Update employee education
    async updateEmployeeEducation(id, data) {
        const endpoint = API_ENDPOINTS.EMPLOYEE_EDUCATION.UPDATE.replace(':id', id);
        const formattedData = this.formatEmployeeEducationData(data);
        return await apiService.put(endpoint, formattedData);
    }

    // Delete employee education
    async deleteEmployeeEducation(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE_EDUCATION.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    // Helper method to format employee education data according to API schema
    formatEmployeeEducationData(data) {
        return {
            employee_id: data.employee_id,
            school_name: data.school_name,
            degree: data.degree,
            start_date: data.start_date,
            end_date: data.end_date,
            created_by: data.created_by,
            updated_by: data.updated_by,
            ...data // Include any additional fields that might be passed
        };
    }

    // Validate education data before submission
    validateEducationData(data) {
        const errors = [];

        if (!data.employee_id) {
            errors.push('Employee ID is required');
        }

        if (!data.school_name || data.school_name.trim() === '') {
            errors.push('School name is required');
        }

        if (!data.degree || data.degree.trim() === '') {
            errors.push('Degree is required');
        }

        if (!data.start_date) {
            errors.push('Start date is required');
        }

        if (!data.end_date) {
            errors.push('End date is required');
        }

        if (data.start_date && data.end_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.end_date);

            if (endDate < startDate) {
                errors.push('End date must be on or after the start date');
            }
        }

        if (data.school_name && data.school_name.length > 100) {
            errors.push('School name must not exceed 100 characters');
        }

        if (data.degree && data.degree.length > 100) {
            errors.push('Degree must not exceed 100 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Helper method to format date for display
    formatDateForDisplay(date) {
        if (!date) return '';
        return moment(date).format('DD/MM/YYYY');
    }

    // Helper method to format date for API (YYYY-MM-DD)
    formatDateForAPI(date) {
        if (!date) return null;
        if (typeof date === 'string') {
            date = new Date(date);
        }
        if (date instanceof Date && !isNaN(date)) {
            return date.toISOString().split('T')[0];
        }
        return null;
    }

    // Calculate study duration
    calculateStudyDuration(startDate, endDate) {
        if (!startDate || !endDate) return '';

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) return '';

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);

        if (years > 0) {
            return months > 0 ? `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''}`;
        } else if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''}`;
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        }
    }
}

export const employeeEducationService = new EmployeeEducationService();
export default employeeEducationService;

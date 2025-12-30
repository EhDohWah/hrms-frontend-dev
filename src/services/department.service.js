import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class DepartmentService extends BaseService {
    /**
     * Get department options for dropdowns
     */
    async getDepartmentOptions(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.DEPARTMENT.OPTIONS}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch department options'
        );
    }

    /**
     * Get all departments with pagination and filtering
     */
    async getDepartments(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.DEPARTMENT.LIST}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch departments'
        );
    }

    /**
     * Get department by ID
     */
    async getDepartmentById(id) {
        const endpoint = API_ENDPOINTS.DEPARTMENT.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch department ${id}`
        );
    }

    /**
     * Create new department
     */
    async createDepartment(data) {
        const formattedData = this.formatDepartmentData(data);
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.DEPARTMENT.CREATE, formattedData),
            'create department'
        );
    }

    /**
     * Update department
     */
    async updateDepartment(id, data) {
        const endpoint = API_ENDPOINTS.DEPARTMENT.UPDATE.replace(':id', id);
        const formattedData = this.formatDepartmentData(data);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, formattedData),
            `update department ${id}`
        );
    }

    /**
     * Delete department
     */
    async deleteDepartment(id) {
        const endpoint = API_ENDPOINTS.DEPARTMENT.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            `delete department ${id}`
        );
    }

    /**
     * Get positions in department
     */
    async getDepartmentPositions(id, params = {}) {
        const queryString = this.buildQueryString(params);
        const endpointBase = API_ENDPOINTS.DEPARTMENT.POSITIONS.replace(':id', id);
        const endpoint = `${endpointBase}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch positions for department ${id}`
        );
    }

    /**
     * Get managers in department
     */
    async getDepartmentManagers(id) {
        const endpoint = API_ENDPOINTS.DEPARTMENT.MANAGERS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch managers for department ${id}`
        );
    }

    /**
     * Format department data for API submission
     */
    formatDepartmentData(data) {
        return {
            name: data.name || null,
            description: data.description || null,
            is_active: data.is_active !== undefined ? data.is_active : true,
        };
    }

    /**
     * Validate department data
     */
    validateDepartmentData(data) {
        const requiredValidation = this.validateRequiredFields(data, ['name']);
        return requiredValidation;
    }
}

export const departmentService = new DepartmentService();
export default departmentService;

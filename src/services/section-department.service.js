import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class SectionDepartmentService extends BaseService {
    /**
     * Get section department options for dropdowns
     */
    async getSectionDepartmentOptions(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.SECTION_DEPARTMENT.OPTIONS}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch section department options'
        );
    }

    /**
     * Get all section departments with pagination and filtering
     */
    async getSectionDepartments(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.SECTION_DEPARTMENT.LIST}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch section departments'
        );
    }

    /**
     * Get section department by ID
     */
    async getSectionDepartmentById(id) {
        const endpoint = API_ENDPOINTS.SECTION_DEPARTMENT.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch section department ${id}`
        );
    }

    /**
     * Get section departments by department ID
     */
    async getSectionDepartmentsByDepartment(departmentId) {
        const endpoint = API_ENDPOINTS.SECTION_DEPARTMENT.BY_DEPARTMENT.replace(':departmentId', departmentId);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch section departments for department ${departmentId}`
        );
    }

    /**
     * Create new section department
     */
    async createSectionDepartment(data) {
        const formattedData = this.formatSectionDepartmentData(data);
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.SECTION_DEPARTMENT.CREATE, formattedData),
            'create section department'
        );
    }

    /**
     * Update section department
     */
    async updateSectionDepartment(id, data) {
        const endpoint = API_ENDPOINTS.SECTION_DEPARTMENT.UPDATE.replace(':id', id);
        const formattedData = this.formatSectionDepartmentData(data);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, formattedData),
            `update section department ${id}`
        );
    }

    /**
     * Delete section department
     */
    async deleteSectionDepartment(id) {
        const endpoint = API_ENDPOINTS.SECTION_DEPARTMENT.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            `delete section department ${id}`
        );
    }

    /**
     * Format section department data for API submission
     */
    formatSectionDepartmentData(data) {
        return {
            name: data.name || null,
            department_id: data.department_id ? parseInt(data.department_id) : null,
            description: data.description || null,
            is_active: data.is_active !== undefined ? data.is_active : true,
        };
    }

    /**
     * Validate section department data
     */
    validateSectionDepartmentData(data) {
        const requiredValidation = this.validateRequiredFields(data, ['name', 'department_id']);
        return requiredValidation;
    }
}

export const sectionDepartmentService = new SectionDepartmentService();
export default sectionDepartmentService;

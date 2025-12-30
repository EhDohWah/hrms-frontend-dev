import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class PositionService extends BaseService {
    /**
     * Get position options for dropdowns
     */
    async getPositionOptions(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.POSITION.OPTIONS}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch position options'
        );
    }

    /**
     * Get all positions with pagination and filtering
     */
    async getPositions(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.POSITION.LIST}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch positions'
        );
    }

    /**
     * Get position by ID
     */
    async getPositionById(id) {
        const endpoint = API_ENDPOINTS.POSITION.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch position ${id}`
        );
    }

    /**
     * Create new position
     */
    async createPosition(data) {
        const formattedData = this.formatPositionData(data);
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.POSITION.CREATE, formattedData),
            'create position'
        );
    }

    /**
     * Update position
     */
    async updatePosition(id, data) {
        const endpoint = API_ENDPOINTS.POSITION.UPDATE.replace(':id', id);
        const formattedData = this.formatPositionData(data);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, formattedData),
            `update position ${id}`
        );
    }

    /**
     * Delete position
     */
    async deletePosition(id) {
        const endpoint = API_ENDPOINTS.POSITION.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            `delete position ${id}`
        );
    }

    /**
     * Get direct reports for a manager position
     */
    async getDirectReports(id) {
        const endpoint = API_ENDPOINTS.POSITION.DIRECT_REPORTS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch direct reports for position ${id}`
        );
    }

    /**
     * Format position data for API submission
     */
    formatPositionData(data) {
        return {
            title: data.title || null,
            department_id: data.department_id ? parseInt(data.department_id) : null,
            reports_to_position_id: data.reports_to_position_id ? parseInt(data.reports_to_position_id) : null,
            level: data.level ? parseInt(data.level) : 1,
            is_manager: data.is_manager !== undefined ? data.is_manager : false,
            is_active: data.is_active !== undefined ? data.is_active : true,
        };
    }

    /**
     * Validate position data
     */
    validatePositionData(data) {
        const requiredValidation = this.validateRequiredFields(data, ['title', 'department_id']);
        return requiredValidation;
    }
}

export const positionService = new PositionService();
export default positionService;

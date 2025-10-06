import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class DepartmentService extends BaseService {
    async getDepartmentOptions(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.DEPARTMENT.OPTIONS}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch department options'
        );
    }
    async getDepartments(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.DEPARTMENT.LIST}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch departments'
        );
    }

    async getDepartmentById(id) {
        const endpoint = API_ENDPOINTS.DEPARTMENT.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch department ${id}`
        );
    }

    async getDepartmentPositions(id, params = {}) {
        const queryString = this.buildQueryString(params);
        const endpointBase = API_ENDPOINTS.DEPARTMENT.POSITIONS.replace(':id', id);
        const endpoint = `${endpointBase}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch positions for department ${id}`
        );
    }

    async getDepartmentManagers(id) {
        const endpoint = API_ENDPOINTS.DEPARTMENT.MANAGERS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch managers for department ${id}`
        );
    }
}

export const departmentService = new DepartmentService();
export default departmentService;



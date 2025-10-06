import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class PositionService extends BaseService {
    async getPositionOptions(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.POSITION.OPTIONS}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch position options'
        );
    }
    async getPositions(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.POSITION.LIST}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch positions'
        );
    }

    async getPositionById(id) {
        const endpoint = API_ENDPOINTS.POSITION.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch position ${id}`
        );
    }

    async getDirectReports(id) {
        const endpoint = API_ENDPOINTS.POSITION.DIRECT_REPORTS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch direct reports for position ${id}`
        );
    }
}

export const positionService = new PositionService();
export default positionService;



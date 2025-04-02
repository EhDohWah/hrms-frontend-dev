import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class EmploymentService {
    // Get all employments
    async getEmployments() {
        return await apiService.get(API_ENDPOINTS.EMPLOYMENT.LIST);
    }

    // Get employment details
    async getEmploymentDetails(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }

    // Create employment
    async createEmployment(data) {
        return await apiService.post(API_ENDPOINTS.EMPLOYMENT.CREATE, data);
    }

    // Update employment
    async updateEmployment(id, data) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.UPDATE.replace(':id', id);
        return await apiService.put(endpoint, data);
    }

    // Delete employment
    async deleteEmployment(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    // Add grant allocation
    async addGrantAllocation(data) {
        return await apiService.post(API_ENDPOINTS.EMPLOYMENT.ADD_GRANT_ALLOCATION, data);
    }

    // Delete grant allocation
    async deleteGrantAllocation(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DELETE_GRANT_ALLOCATION.replace(':id', id);
        return await apiService.delete(endpoint);
    }
}

export const employmentService = new EmploymentService();
export default employmentService;

import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

export const employeeFundingAllocationService = {
    // Get all employee funding allocations
    getAll(params = {}) {
        return apiService.get(API_ENDPOINTS.EMPLOYEE_FUNDING_ALLOCATION.LIST, { params });
    },

    // Get employee funding allocation by ID
    getById(id) {
        const url = API_ENDPOINTS.EMPLOYEE_FUNDING_ALLOCATION.DETAILS.replace(':id', id);
        return apiService.get(url);
    },

    // Create new employee funding allocation
    create(data) {
        return apiService.post(API_ENDPOINTS.EMPLOYEE_FUNDING_ALLOCATION.CREATE, data);
    },

    // Update employee funding allocation
    update(id, data) {
        const url = API_ENDPOINTS.EMPLOYEE_FUNDING_ALLOCATION.UPDATE.replace(':id', id);
        return apiService.put(url, data);
    },

    // Delete employee funding allocation
    delete(id) {
        const url = API_ENDPOINTS.EMPLOYEE_FUNDING_ALLOCATION.DELETE.replace(':id', id);
        return apiService.delete(url);
    },

    // Get employee funding allocation by grant item ID
    getByGrantItem(grantItemId) {
        const url = API_ENDPOINTS.EMPLOYEE_FUNDING_ALLOCATION.BY_GRANT_ITEM.replace(':grantItemId', grantItemId);
        return apiService.get(url);
    }
};

// worklocation.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class WorkLocationService {
  async getAllWorkLocations() {
    return await apiService.get(API_ENDPOINTS.WORK_LOCATION.LIST);
  }

  async createWorkLocation(locationData) {
    return await apiService.post(API_ENDPOINTS.WORK_LOCATION.CREATE, locationData);
  }

  async updateWorkLocation(id, locationData) {
    const endpoint = API_ENDPOINTS.WORK_LOCATION.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, locationData);
  }

  async deleteWorkLocation(id) {
    const endpoint = API_ENDPOINTS.WORK_LOCATION.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  async getWorkLocationDetails(id) {
    const endpoint = API_ENDPOINTS.WORK_LOCATION.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }
}

export const workLocationService = new WorkLocationService();
export default workLocationService;

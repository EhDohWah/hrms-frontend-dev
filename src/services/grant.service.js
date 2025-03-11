// grant.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class GrantService {
  // Fetch all grants
  async getAllGrants() {
    return await apiService.get(API_ENDPOINTS.GRANT.LIST);
  }

  // Create a new grant
  async createGrant(grantData) {
    return await apiService.post(API_ENDPOINTS.GRANT.CREATE, grantData);
  }

  // Update an existing grant
  async updateGrant(id, grantData) {
    const endpoint = API_ENDPOINTS.GRANT.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, grantData);
  }

  // Delete a grant
  async deleteGrant(id) {
    const endpoint = API_ENDPOINTS.GRANT.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  // Upload grant file
  async uploadGrantFile(formData) {
    return await apiService.postFormData(API_ENDPOINTS.GRANT.UPLOAD, formData);
  }
}

export const grantService = new GrantService();

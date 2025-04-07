// grant.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class GrantService {
  // Fetch all grants
  async getAllGrants() {
    return await apiService.get(API_ENDPOINTS.GRANT.LIST);
  }

  // Fetch all grant items
  async getAllGrantItems() {
    return await apiService.get(API_ENDPOINTS.GRANT.ITEMS.LIST);
  }

  // Create a new grant
  async createGrant(grantData) {
    return await apiService.post(API_ENDPOINTS.GRANT.CREATE, grantData);
  }

  // Create a new grant item
  async createGrantItem(itemData) {
    return await apiService.post(API_ENDPOINTS.GRANT.ITEMS.CREATE, itemData);
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

  // Delete a grant item
  async deleteGrantItem(id) {
    const endpoint = API_ENDPOINTS.GRANT.ITEMS.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  // Upload grant file
  async uploadGrantFile(formData) {
    return await apiService.postFormData(API_ENDPOINTS.GRANT.UPLOAD, formData);
  }

  // Get grant details
  async getGrantDetails(id) {
    const endpoint = API_ENDPOINTS.GRANT.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Get grant item details
  async getGrantItemDetails(id) {
    const endpoint = API_ENDPOINTS.GRANT.ITEMS.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Update a grant item
  async updateGrantItem(id, itemData) {
    const endpoint = API_ENDPOINTS.GRANT.ITEMS.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, itemData);
  }

  // Get grant positions
  async getGrantPositions() {
    return await apiService.get(API_ENDPOINTS.GRANT.GRANT_POSITIONS);
  }
}

export const grantService = new GrantService();

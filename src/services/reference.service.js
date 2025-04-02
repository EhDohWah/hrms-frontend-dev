import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReferenceService {
  // Fetch all references
  async getAllReferences() {
    return await apiService.get(API_ENDPOINTS.REFERENCES.LIST);
  }

  // Get reference by ID
  async getReferenceById(id) {
    const endpoint = API_ENDPOINTS.REFERENCES.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Create a new reference
  async createReference(referenceData) {
    return await apiService.post(API_ENDPOINTS.REFERENCES.CREATE, referenceData);
  }

  // Update an existing reference
  async updateReference(id, referenceData) {
    const endpoint = API_ENDPOINTS.REFERENCES.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, referenceData);
  }

  // Delete a reference
  async deleteReference(id) {
    const endpoint = API_ENDPOINTS.REFERENCES.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }
}

export const referenceService = new ReferenceService();

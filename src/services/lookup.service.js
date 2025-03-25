// lookup.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class LookupService {
  /**
   * Get all lookups organized by category
   * @returns {Promise<Object>} Object containing lookup values grouped by categories
   */
  async getAllLookups() {
    return await apiService.get(API_ENDPOINTS.LOOKUP.LIST);
  }

  /**
   * Create a new lookup value
   * @param {Object} lookupData - The lookup data
   * @param {string} lookupData.category - The category of the lookup (e.g., 'gender', 'nationality')
   * @param {string} lookupData.value - The value to store for the given category
   * @returns {Promise<Object>} The created lookup
   */
  async createLookup(lookupData) {
    return await apiService.post(API_ENDPOINTS.LOOKUP.CREATE, lookupData);
  }

  /**
   * Update an existing lookup value
   * @param {number} id - The ID of the lookup to update
   * @param {Object} lookupData - The updated lookup data
   * @param {string} lookupData.category - The category to update
   * @param {string} lookupData.value - The new value
   * @returns {Promise<Object>} The updated lookup
   */
  async updateLookup(id, lookupData) {
    const endpoint = API_ENDPOINTS.LOOKUP.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, lookupData);
  }

  /**
   * Delete a lookup value
   * @param {number} id - The ID of the lookup to delete
   * @returns {Promise<Object>} Response indicating success or failure
   */
  async deleteLookup(id) {
    const endpoint = API_ENDPOINTS.LOOKUP.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  /**
   * Get details for a specific lookup
   * @param {number} id - The ID of the lookup to retrieve
   * @returns {Promise<Object>} The lookup details
   */
  async getLookupDetails(id) {
    const endpoint = API_ENDPOINTS.LOOKUP.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  /**
   * Get lookup values by category
   * @returns {Promise<Object>} Object with properties for each category:
   * - genders
   * - subsidiaries
   * - employee_statuses
   * - nationalities
   * - religions
   * - marital_statuses
   * - sites
   * - user_statuses
   * - interview_modes
   * - interview_statuses
   * - identification_types
   */
  async getLookupCategories() {
    const response = await this.getAllLookups();
    return response.data;
  }
}

export const lookupService = new LookupService();
export default lookupService;

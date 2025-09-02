// lookup.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class LookupService {
  /**
   * Get all lookups organized by category or paginated list
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.filter_type - Filter by lookup types (comma-separated)
   * @param {string} params.search - Search term
   * @param {string} params.sort_by - Sort field
   * @param {string} params.sort_order - Sort direction
   * @param {boolean} params.grouped - Return grouped format (legacy)
   * @returns {Promise<Object>} Paginated lookup data or grouped object
   */
  async getAllLookups(params = {}) {
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    // Add filtering parameters
    if (params.filter_type) queryParams.append('filter_type', params.filter_type);
    if (params.search) queryParams.append('search', params.search);

    // Add sorting parameters
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    // Add grouped parameter for backward compatibility
    if (params.grouped !== undefined) queryParams.append('grouped', params.grouped);

    const url = `${API_ENDPOINTS.LOOKUP.LIST}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiService.get(url);
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
   * - pay_methods
   */
  async getLookupCategories() {
    const response = await this.getAllLookups();
    return response.data;
  }

  /**
   * Get all lookup lists organized by category without pagination
   * @returns {Promise<Object>} All lookup values organized by category
   */
  async getAllLookupLists() {
    return await apiService.get(API_ENDPOINTS.LOOKUP.LISTS);
  }

  /**
   * Get all available lookup types
   * @returns {Promise<Array>} Array of available lookup types
   */
  async getLookupTypes() {
    return await apiService.get(API_ENDPOINTS.LOOKUP.TYPES);
  }

  /**
   * Get lookup values by specific type
   * @param {string} type - The lookup type to retrieve
   * @returns {Promise<Object>} The lookup values for the specified type
   */
  async getLookupsByType(type) {
    const endpoint = API_ENDPOINTS.LOOKUP.BY_TYPE.replace(':type', type);
    return await apiService.get(endpoint);
  }

  /**
   * Advanced search for lookups
   * @param {Object} params - Search parameters
   * @param {string} params.search - General search term
   * @param {string} params.types - Specific types to search in
   * @param {string} params.value - Search only in values
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.sort_by - Sort field
   * @param {string} params.sort_order - Sort direction
   * @returns {Promise<Object>} Search results with pagination
   */
  async searchLookups(params = {}) {
    const queryParams = new URLSearchParams();

    // Add search parameters
    if (params.search) queryParams.append('search', params.search);
    if (params.types) queryParams.append('types', params.types);
    if (params.value) queryParams.append('value', params.value);

    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    // Add sorting parameters
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `${API_ENDPOINTS.LOOKUP.SEARCH}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await apiService.get(url);
  }
}

export const lookupService = new LookupService();
export default lookupService;

// grant.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class GrantService {

  // Fetch a grant by code
  async getGrantByCode(code) {
    const endpoint = API_ENDPOINTS.GRANT.GET_BY_CODE.replace(':code', code);
    return await apiService.get(endpoint);
  }

  // Fetch a grant by code for search (handles 404 as valid response)
  async searchGrantByCode(code) {
    const endpoint = API_ENDPOINTS.GRANT.GET_BY_CODE.replace(':code', code);

    try {
      // Use the regular API service
      return await apiService.get(endpoint);
    } catch (error) {
      // Check if it's a 404 error with grant not found response
      if (error.response && error.response.status === 404 && error.response.data) {
        // Return the 404 response data as a valid response (not an error)
        return error.response.data;
      }
      // For other errors (network, auth, etc.), re-throw the error
      throw error;
    }
  }

  // Fetch a grant by id
  async getGrantById(id) {
    const endpoint = API_ENDPOINTS.GRANT.GET_BY_ID.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Fetch all grants
  async getAllGrants(params = {}) {
    try {
      // Build query string from parameters
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `${API_ENDPOINTS.GRANT.LIST}${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get(endpoint);
      return response; // This should return the full API response including pagination metadata
    } catch (error) {
      console.error('Error fetching grants:', error);
      throw error;
    }
  }

  // Fetch paginated grants
  async getPaginatedGrants(params = {}) {
    const queryParams = new URLSearchParams();

    // Add parameters to query string
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `${API_ENDPOINTS.GRANT.PAGINATED}?${queryParams.toString()}`;
    return await apiService.get(endpoint);
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

  /**
   * Get advanced paginated grants with server-side filtering and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10, max: 100)
   * @param {string} params.search - Search term for code, name, or description
   * @param {string} params.subsidiary - Filter by subsidiary
   * @param {string} params.code - Filter by grant code
   * @param {string} params.name - Filter by grant name
   * @param {string} params.end_date_after - Filter grants ending after this date
   * @param {string} params.end_date_before - Filter grants ending before this date
   * @param {string} params.end_date_between - Filter grants ending between dates (comma-separated)
   * @param {string} params.sort_by - Column to sort by (code, name, subsidiary, end_date, created_at)
   * @param {string} params.sort_order - Sort order (asc, desc)
   * @param {boolean} params.with_items - Include grant items in response
   * @param {boolean} params.include_expired - Include expired grants
   * @returns {Promise} API response with paginated grants data
   */
  async getAdvancedPaginatedGrants(params = {}) {
    const queryParams = new URLSearchParams();

    // Add parameters to query string, filtering out empty values
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `${API_ENDPOINTS.GRANT.ADVANCED_PAGINATED}?${queryParams.toString()}`;
    return await apiService.get(endpoint);
  }

  /**
   * Get filter options for grants (subsidiaries, codes, names, etc.)
   * @returns {Promise} API response with available filter options
   */
  async getFilterOptions() {
    return await apiService.get(API_ENDPOINTS.GRANT.FILTER_OPTIONS);
  }
}

export const grantService = new GrantService();

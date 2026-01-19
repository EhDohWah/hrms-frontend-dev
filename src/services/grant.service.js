// grant.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { BaseService } from '@/services/base.service';
import { useSharedDataStore } from '@/stores/sharedDataStore';

class GrantService extends BaseService {

  // Fetch a grant by code
  async getGrantByCode(code) {
    const endpoint = API_ENDPOINTS.GRANT.GET_BY_CODE.replace(':code', code);
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch grant by code'
    );
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
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch grant by ID'
    );
  }

  // Fetch all grants
  async getAllGrants(params = {}) {
    try {
      // Build query string from parameters
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `${API_ENDPOINTS.GRANT.LIST}${queryString ? `?${queryString}` : ''}`;

      return await this.handleApiResponse(
        () => apiService.get(endpoint),
        'fetch grants list'
      );
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
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch paginated grants'
    );
  }

  // Fetch all grant items
  async getAllGrantItems() {
    return await this.handleApiResponse(
      () => apiService.get(API_ENDPOINTS.GRANT.ITEMS.LIST),
      'fetch grant items'
    );
  }

  // Create a new grant
  async createGrant(grantData) {
    return await this.handleApiResponse(
      () => apiService.post(API_ENDPOINTS.GRANT.CREATE, grantData),
      'create grant'
    );
  }

  // Create a new grant item
  async createGrantItem(itemData) {
    const result = await this.handleApiResponse(
      () => apiService.post(API_ENDPOINTS.GRANT.ITEMS.CREATE, itemData),
      'create grant item'
    );

    // Invalidate grant structure cache after creating grant item
    try {
      const sharedStore = useSharedDataStore();
      sharedStore.invalidateCache('grantStructure');
      console.log('🗑️ Cache invalidated after creating grant item');
    } catch (error) {
      console.warn('⚠️ Failed to invalidate cache after creating grant item:', error);
    }

    return result;
  }

  // Update an existing grant
  async updateGrant(id, grantData) {
    const endpoint = API_ENDPOINTS.GRANT.UPDATE.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.put(endpoint, grantData),
      'update grant'
    );
  }

  // Delete a grant
  async deleteGrant(id) {
    const endpoint = API_ENDPOINTS.GRANT.DELETE.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.delete(endpoint),
      'delete grant'
    );
  }

  // Delete selected grants (bulk delete)
  async deleteSelectedGrants(ids) {
    const result = await this.handleApiResponse(
      () => apiService.delete(API_ENDPOINTS.GRANT.DELETE_SELECTED, { ids }),
      'delete selected grants'
    );

    // Invalidate grant structure cache after bulk delete
    try {
      const sharedStore = useSharedDataStore();
      sharedStore.invalidateCache('grantStructure');
      console.log('🗑️ Cache invalidated after bulk deleting grants');
    } catch (error) {
      console.warn('⚠️ Failed to invalidate cache after bulk deleting grants:', error);
    }

    return result;
  }

  // Delete a grant item
  async deleteGrantItem(id) {
    const endpoint = API_ENDPOINTS.GRANT.ITEMS.DELETE.replace(':id', id);
    const result = await this.handleApiResponse(
      () => apiService.delete(endpoint),
      'delete grant item'
    );

    // Invalidate grant structure cache after deleting grant item
    try {
      const sharedStore = useSharedDataStore();
      sharedStore.invalidateCache('grantStructure');
      console.log('🗑️ Cache invalidated after deleting grant item');
    } catch (error) {
      console.warn('⚠️ Failed to invalidate cache after deleting grant item:', error);
    }

    return result;
  }


  // Get grant details
  async getGrantDetails(id) {
    const endpoint = API_ENDPOINTS.GRANT.DETAILS.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch grant details'
    );
  }

  // Get grant item details
  async getGrantItemDetails(id) {
    const endpoint = API_ENDPOINTS.GRANT.ITEMS.DETAILS.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch grant item details'
    );
  }

  // Update a grant item
  async updateGrantItem(id, itemData) {
    const endpoint = API_ENDPOINTS.GRANT.ITEMS.UPDATE.replace(':id', id);
    const result = await this.handleApiResponse(
      () => apiService.put(endpoint, itemData),
      'update grant item'
    );

    // Invalidate grant structure cache after updating grant item
    try {
      const sharedStore = useSharedDataStore();
      sharedStore.invalidateCache('grantStructure');
      console.log('🗑️ Cache invalidated after updating grant item');
    } catch (error) {
      console.warn('⚠️ Failed to invalidate cache after updating grant item:', error);
    }

    return result;
  }

  // Get grant positions
  async getGrantPositions() {
    return await this.handleApiResponse(
      () => apiService.get(API_ENDPOINTS.GRANT.GRANT_POSITIONS),
      'fetch grant positions'
    );
  }

  /**
   * Get advanced paginated grants with server-side filtering and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10, max: 100)
   * @param {string} params.search - Search term for code, name, or description
   * @param {string} params.organization - Filter by organization
   * @param {string} params.code - Filter by grant code
   * @param {string} params.name - Filter by grant name
   * @param {string} params.end_date_after - Filter grants ending after this date
   * @param {string} params.end_date_before - Filter grants ending before this date
   * @param {string} params.end_date_between - Filter grants ending between dates (comma-separated)
   * @param {string} params.sort_by - Column to sort by (code, name, organization, end_date, created_at)
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
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch advanced paginated grants'
    );
  }

  /**
   * Get filter options for grants (subsidiaries, codes, names, etc.)
   * @returns {Promise} API response with available filter options
   */
  async getFilterOptions() {
    return await this.handleApiResponse(
      () => apiService.get(API_ENDPOINTS.GRANT.FILTER_OPTIONS),
      'fetch filter options'
    );
  }

  /**
   * Validate grant data before sending to API
   * @param {Object} grantData - Grant data to validate
   * @returns {Object} Validation result
   */
  validateGrantData(grantData) {
    // Use base class validation for required fields
    const requiredValidation = this.validateRequiredFields(grantData, ['code', 'name', 'organization']);

    // Additional custom validations
    const customErrors = {};

    if (grantData.end_date && !this.isValidDate(grantData.end_date)) {
      customErrors.end_date = ['Invalid date format'];
    }

    // Combine validations
    return this.combineValidations([
      requiredValidation,
      { isValid: Object.keys(customErrors).length === 0, errors: customErrors }
    ]);
  }

  /**
   * Validate grant item data before sending to API
   * @param {Object} itemData - Grant item data to validate
   * @returns {Object} Validation result
   */
  validateGrantItemData(itemData) {
    // Use base class validation for required fields
    const requiredValidation = this.validateRequiredFields(itemData, ['grant_id']);

    // Use base class validation for numeric fields
    const numericValidation = this.validateNumericFields(itemData, [
      { field: 'grant_salary', min: 0 },
      { field: 'grant_benefit', min: 0 },
      { field: 'grant_level_of_effort', min: 0, max: 1 },
      { field: 'grant_position_number', min: 1 }
    ]);

    // Additional custom validations
    const customErrors = {};

    // Validate budget line code if provided
    if (itemData.budgetline_code && typeof itemData.budgetline_code !== 'string') {
      customErrors.budgetline_code = ['Budget line code must be a string'];
    }

    // Validate grant position if provided
    if (itemData.grant_position && typeof itemData.grant_position !== 'string') {
      customErrors.grant_position = ['Grant position must be a string'];
    }

    // Combine validations
    return this.combineValidations([
      requiredValidation,
      numericValidation,
      { isValid: Object.keys(customErrors).length === 0, errors: customErrors }
    ]);
  }

  /**
 * Create grant with client-side validation (for use in components)
 * Note: This is a convenience method that validates before calling createGrant.
 * For better separation of concerns, consider doing validation in the component
 * and calling createGrant() directly.
 * 
 * @param {Object} grantData - Grant data
 * @returns {Promise} API response
 */
  async createGrantWithValidation(grantData) {
    const validation = this.validateGrantData(grantData);

    if (!validation.isValid) {
      throw this.createValidationError(validation.errors);
    }

    return await this.createGrant(grantData);
  }

  /**
   * Create grant item with client-side validation (for use in components)
   * Note: This is a convenience method that validates before calling createGrantItem.
   * For better separation of concerns, consider doing validation in the component
   * and calling createGrantItem() directly.
   * 
   * @param {Object} itemData - Grant item data
   * @returns {Promise} API response
   */
  async createGrantItemWithValidation(itemData) {
    const validation = this.validateGrantItemData(itemData);

    if (!validation.isValid) {
      throw this.createValidationError(validation.errors);
    }

    return await this.createGrantItem(itemData);
  }

}

export const grantService = new GrantService();

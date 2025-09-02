// budget-line.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { BaseService } from '@/services/base.service';

class BudgetLineService extends BaseService {

    // Fetch all budget lines with optional parameters for pagination, sorting, and filtering
    async getAllBudgetLines(params = {}) {
        try {
            // Build query string from parameters
            const queryString = this.buildQueryString(params);
            const endpoint = `${API_ENDPOINTS.BUDGET_LINE.LIST}${queryString ? `?${queryString}` : ''}`;

            return await this.handleApiResponse(
                () => apiService.get(endpoint),
                'fetch budget lines'
            );
        } catch (error) {
            console.error('Error fetching budget lines:', error);
            throw error;
        }
    }

    // Fetch budget line by code (handles 404 as valid response)
    async getBudgetLineByCode(code) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.SEARCH_BY_CODE?.replace(':code', code) ||
            `${API_ENDPOINTS.BUDGET_LINE.LIST}?filter_budget_line_code=${code}`;

        try {
            // Use the regular API service
            return await apiService.get(endpoint);
        } catch (error) {
            // Check if it's a 404 error with budget line not found response
            if (error.response && error.response.status === 404 && error.response.data) {
                // Return the 404 response data as a valid response (not an error)
                return error.response.data;
            }
            // For other errors (network, auth, etc.), re-throw the error
            throw error;
        }
    }

    // Fetch paginated budget lines
    async getPaginatedBudgetLines(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.BUDGET_LINE.PAGINATED || API_ENDPOINTS.BUDGET_LINE.LIST}?${queryString}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch paginated budget lines'
        );
    }

    // Search budget line by code (handles 404 as valid response)
    async searchBudgetLineByCode(code) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.SEARCH_BY_CODE?.replace(':code', code) ||
            `${API_ENDPOINTS.BUDGET_LINE.LIST}?filter_budget_line_code=${code}`;

        try {
            // Use the regular API service
            return await apiService.get(endpoint);
        } catch (error) {
            // Check if it's a 404 error with budget line not found response
            if (error.response && error.response.status === 404 && error.response.data) {
                // Return the 404 response data as a valid response (not an error)
                return error.response.data;
            }
            // For other errors (network, auth, etc.), re-throw the error
            throw error;
        }
    }

    // Fetch budget line by ID
    async getBudgetLineById(id) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.GET_BY_ID.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch budget line by ID'
        );
    }

    // Create a new budget line
    async createBudgetLine(budgetLineData) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.BUDGET_LINE.CREATE, budgetLineData),
            'create budget line'
        );
    }

    // Update an existing budget line
    async updateBudgetLine(id, budgetLineData) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.UPDATE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, budgetLineData),
            'update budget line'
        );
    }

    // Delete a budget line
    async deleteBudgetLine(id) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            'delete budget line'
        );
    }

    // Get budget line details
    async getBudgetLineDetails(id) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch budget line details'
        );
    }

    /**
     * Get advanced paginated budget lines with server-side filtering and sorting
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.per_page - Items per page (default: 10, max: 100)
     * @param {string} params.search - Search term for budget line code or description
     * @param {string} params.filter_budget_line_code - Filter by budget line code
     * @param {string} params.filter_description - Filter by description
     * @param {string} params.filter_created_by - Filter by creator
     * @param {string} params.filter_updated_by - Filter by updater
     * @param {string} params.sort_by - Column to sort by (id, budget_line_code, description, created_by, updated_by, created_at, updated_at)
     * @param {string} params.sort_order - Sort order (asc, desc)
     * @param {string} params.created_after - Filter budget lines created after this date
     * @param {string} params.created_before - Filter budget lines created before this date
     * @param {string} params.updated_after - Filter budget lines updated after this date
     * @param {string} params.updated_before - Filter budget lines updated before this date
     * @returns {Promise} API response with paginated budget lines data
     */
    async getAdvancedPaginatedBudgetLines(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.BUDGET_LINE.ADVANCED_PAGINATED || API_ENDPOINTS.BUDGET_LINE.LIST}?${queryString}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch advanced paginated budget lines'
        );
    }

    /**
     * Get filter options for budget lines (codes, descriptions, creators, etc.)
     * @returns {Promise} API response with available filter options
     */
    async getFilterOptions() {
        return await this.handleApiResponse(
            () => apiService.get(API_ENDPOINTS.BUDGET_LINE.FILTER_OPTIONS || `${API_ENDPOINTS.BUDGET_LINE.LIST}/filter-options`),
            'fetch filter options'
        );
    }

    /**
     * Validate budget line data before sending to API
     * @param {Object} budgetLineData - Budget line data to validate
     * @returns {Object} Validation result
     */
    validateBudgetLineData(budgetLineData) {
        // Use base class validation for required fields
        const requiredValidation = this.validateRequiredFields(budgetLineData, ['budget_line_code', 'description']);

        // Additional custom validations
        const customErrors = {};

        // Validate budget_line_code format (if needed)
        if (budgetLineData.budget_line_code && budgetLineData.budget_line_code.length > 255) {
            customErrors.budget_line_code = ['Budget line code must not exceed 255 characters'];
        }

        // Validate description length
        if (budgetLineData.description && budgetLineData.description.length > 255) {
            customErrors.description = ['Description must not exceed 255 characters'];
        }

        // Combine validations
        return this.combineValidations([
            requiredValidation,
            { isValid: Object.keys(customErrors).length === 0, errors: customErrors }
        ]);
    }

    /**
     * Create budget line with client-side validation (for use in components)
     * Note: This is a convenience method that validates before calling createBudgetLine.
     * For better separation of concerns, consider doing validation in the component
     * and calling createBudgetLine() directly.
     * 
     * @param {Object} budgetLineData - Budget line data
     * @returns {Promise} API response
     */
    async createBudgetLineWithValidation(budgetLineData) {
        const validation = this.validateBudgetLineData(budgetLineData);

        if (!validation.isValid) {
            throw this.createValidationError(validation.errors);
        }

        return await this.createBudgetLine(budgetLineData);
    }

    /**
     * Update budget line with client-side validation (for use in components)
     * Note: This is a convenience method that validates before calling updateBudgetLine.
     * For better separation of concerns, consider doing validation in the component
     * and calling updateBudgetLine() directly.
     * 
     * @param {number} id - Budget line ID
     * @param {Object} budgetLineData - Budget line data
     * @returns {Promise} API response
     */
    async updateBudgetLineWithValidation(id, budgetLineData) {
        const validation = this.validateBudgetLineData(budgetLineData);

        if (!validation.isValid) {
            throw this.createValidationError(validation.errors);
        }

        return await this.updateBudgetLine(id, budgetLineData);
    }
}

export const budgetLineService = new BudgetLineService();

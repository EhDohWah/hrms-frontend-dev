// budget-line.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class BudgetLineService {

    // Fetch all budget lines with optional parameters for pagination, sorting, and filtering
    async getAllBudgetLines(params = {}) {
        try {
            // Build query string from parameters
            const queryString = new URLSearchParams(params).toString();
            const endpoint = `${API_ENDPOINTS.BUDGET_LINE.LIST}${queryString ? `?${queryString}` : ''}`;

            const response = await apiService.get(endpoint);
            return response; // This should return the full API response including pagination metadata
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
        const queryParams = new URLSearchParams();

        // Add parameters to query string
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        const endpoint = `${API_ENDPOINTS.BUDGET_LINE.PAGINATED || API_ENDPOINTS.BUDGET_LINE.LIST}?${queryParams.toString()}`;
        return await apiService.get(endpoint);
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
        return await apiService.get(endpoint);
    }

    // Create a new budget line
    async createBudgetLine(budgetLineData) {
        return await apiService.post(API_ENDPOINTS.BUDGET_LINE.CREATE, budgetLineData);
    }

    // Update an existing budget line
    async updateBudgetLine(id, budgetLineData) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.UPDATE.replace(':id', id);
        return await apiService.put(endpoint, budgetLineData);
    }

    // Delete a budget line
    async deleteBudgetLine(id) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    // Get budget line details
    async getBudgetLineDetails(id) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
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
        const queryParams = new URLSearchParams();

        // Add parameters to query string, filtering out empty values
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        const endpoint = `${API_ENDPOINTS.BUDGET_LINE.ADVANCED_PAGINATED || API_ENDPOINTS.BUDGET_LINE.LIST}?${queryParams.toString()}`;
        return await apiService.get(endpoint);
    }

    /**
     * Get filter options for budget lines (codes, descriptions, creators, etc.)
     * @returns {Promise} API response with available filter options
     */
    async getFilterOptions() {
        return await apiService.get(API_ENDPOINTS.BUDGET_LINE.FILTER_OPTIONS || `${API_ENDPOINTS.BUDGET_LINE.LIST}/filter-options`);
    }
}

export const budgetLineService = new BudgetLineService();

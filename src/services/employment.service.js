import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class EmploymentService {
    // Get all employments (legacy method - kept for backward compatibility)
    async getEmployments() {
        return await apiService.get(API_ENDPOINTS.EMPLOYMENT.LIST);
    }

    // Get all employments with query parameters (similar to grant service)
    async getAllEmployments(params = {}) {
        try {
            // Build query string from parameters
            const queryString = new URLSearchParams(params).toString();
            const endpoint = `${API_ENDPOINTS.EMPLOYMENT.LIST}${queryString ? `?${queryString}` : ''}`;

            const response = await apiService.get(endpoint);
            return response; // This should return the full API response including pagination metadata
        } catch (error) {
            console.error('Error fetching employments:', error);
            throw error;
        }
    }

    // Search employments by staff ID (handles 404 as valid response)
    async searchEmploymentsByStaffId(staffId) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.SEARCH_BY_STAFF_ID.replace(':staffId', staffId);

        try {
            // Use the regular API service
            return await apiService.get(endpoint);
        } catch (error) {
            // Check if it's a 404 error with employment not found response
            if (error.response && error.response.status === 404 && error.response.data) {
                // Return the 404 response data as a valid response (not an error)
                return error.response.data;
            }
            // For other errors (network, auth, etc.), re-throw the error
            throw error;
        }
    }

    // Get employment details
    async getEmploymentDetails(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }

    // Get employment by ID (similar to grant service)
    async getEmploymentById(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }

    // Create employment
    async createEmployment(data) {
        return await apiService.post(API_ENDPOINTS.EMPLOYMENT.CREATE, data);
    }

    // Update employment
    async updateEmployment(id, data) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.UPDATE.replace(':id', id);
        return await apiService.put(endpoint, data);
    }

    // Delete employment
    async deleteEmployment(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    // Add grant allocation
    async addGrantAllocation(data) {
        return await apiService.post(API_ENDPOINTS.EMPLOYMENT.ADD_GRANT_ALLOCATION, data);
    }

    // Delete grant allocation
    async deleteGrantAllocation(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DELETE_GRANT_ALLOCATION.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    /**
     * Get advanced paginated employments with server-side filtering and sorting
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.per_page - Items per page (default: 10, max: 100)
     * @param {string} params.search - Search term for staff ID, employee name
     * @param {string} params.filter_subsidiary - Filter by subsidiary
     * @param {string} params.filter_employment_type - Filter by employment type
     * @param {string} params.filter_work_location - Filter by work location
     * @param {string} params.filter_status - Filter by employment status
     * @param {string} params.sort_by - Column to sort by (staff_id, employee_name, employment_type, work_location, start_date, end_date, salary, subsidiary)
     * @param {string} params.sort_order - Sort order (asc, desc)
     * @param {boolean} params.include_inactive - Include inactive employments
     * @returns {Promise} API response with paginated employments data
     */
    async getAdvancedPaginatedEmployments(params = {}) {
        const queryParams = new URLSearchParams();

        // Add parameters to query string, filtering out empty values
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key]);
            }
        });

        const endpoint = `${API_ENDPOINTS.EMPLOYMENT.PAGINATED || API_ENDPOINTS.EMPLOYMENT.LIST}?${queryParams.toString()}`;
        return await apiService.get(endpoint);
    }

    /**
     * Get filter options for employments (subsidiaries, employment types, work locations, etc.)
     * @returns {Promise} API response with available filter options
     */
    async getFilterOptions() {
        return await apiService.get(API_ENDPOINTS.EMPLOYMENT.FILTER_OPTIONS || `${API_ENDPOINTS.EMPLOYMENT.LIST}/filter-options`);
    }
}

export const employmentService = new EmploymentService();
export default employmentService;

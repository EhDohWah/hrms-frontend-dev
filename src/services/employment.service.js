import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class EmploymentService extends BaseService {
    // Get all employments (legacy method - kept for backward compatibility)
    async getEmployments() {
        return await this.handleApiResponse(
            () => apiService.get(API_ENDPOINTS.EMPLOYMENT.LIST),
            'fetch employments list'
        );
    }

    // Get funding allocations for an employment
    async getFundingAllocations(employmentId) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.FUNDING_ALLOCATIONS.replace(':id', employmentId);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch funding allocations for employment ${employmentId}`
        );
    }

    // Get all employments with query parameters (similar to grant service)
    async getAllEmployments(params = {}) {
        // Build query string from parameters
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.EMPLOYMENT.LIST}${queryString ? `?${queryString}` : ''}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch employments with parameters'
        );
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
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch employment details for ID ${id}`
        );
    }

    // Get employment by ID (similar to grant service)
    async getEmploymentById(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch employment by ID ${id}`
        );
    }

    // Create employment
    async createEmployment(data) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.EMPLOYMENT.CREATE, data),
            'create employment with funding allocations'
        );
    }

    // Update employment
    async updateEmployment(id, data) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.UPDATE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, data),
            `update employment with ID ${id}`
        );
    }

    // Delete employment
    async deleteEmployment(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            `delete employment with ID ${id}`
        );
    }

    // Add grant allocation
    async addGrantAllocation(data) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.EMPLOYMENT.ADD_GRANT_ALLOCATION, data),
            'add grant allocation to employment'
        );
    }

    // Delete grant allocation
    async deleteGrantAllocation(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.DELETE_GRANT_ALLOCATION.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            `delete grant allocation with ID ${id}`
        );
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
        // Build query string from parameters using BaseService method
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.EMPLOYMENT.PAGINATED || API_ENDPOINTS.EMPLOYMENT.LIST}${queryString ? `?${queryString}` : ''}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch advanced paginated employments'
        );
    }

    /**
     * Get filter options for employments (subsidiaries, employment types, work locations, etc.)
     * @returns {Promise} API response with available filter options
     */
    async getFilterOptions() {
        return await this.handleApiResponse(
            () => apiService.get(API_ENDPOINTS.EMPLOYMENT.FILTER_OPTIONS || `${API_ENDPOINTS.EMPLOYMENT.LIST}/filter-options`),
            'fetch employment filter options'
        );
    }
}

export const employmentService = new EmploymentService();
export default employmentService;

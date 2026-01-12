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

    /**
     * Create funding allocations separately (decoupled workflow)
     * This is used when employment is saved first, then allocations are added later.
     * Backend automatically calculates allocated_amount using deriveSalaryContext()
     * based on the employment's probation status.
     * 
     * @param {Object} data - Allocation data
     * @param {number} data.employee_id - Employee ID
     * @param {number} data.employment_id - Employment ID (must exist)
     * @param {string} data.start_date - Start date for allocations
     * @param {string} [data.end_date] - End date for allocations (optional)
     * @param {Array} data.allocations - Array of allocation objects
     * @param {string} data.allocations[].allocation_type - Type ('grant')
     * @param {number} data.allocations[].grant_item_id - Grant item ID
     * @param {number} data.allocations[].fte - FTE percentage (0-100)
     * 
     * @returns {Promise<Object>} Response with:
     *   - data: Created allocations with auto-calculated amounts
     *   - total_created: Number of allocations created
     *   - salary_info: Object with salary type used, amount, probation status
     * 
     * @example
     * const result = await employmentService.createFundingAllocations({
     *   employee_id: 123,
     *   employment_id: 456,
     *   start_date: '2026-01-15',
     *   allocations: [
     *     { allocation_type: 'grant', grant_item_id: 789, fte: 60 },
     *     { allocation_type: 'grant', grant_item_id: 790, fte: 40 }
     *   ]
     * });
     */
    async createFundingAllocations(data) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.EMPLOYEE_FUNDING_ALLOCATION.CREATE, data),
            'create funding allocations for employment'
        );
    }

    /**
     * Calculate allocation preview without persisting
     * Used for real-time UI feedback in the decoupled workflow.
     * Returns calculated amount based on employment's salary and probation status.
     * 
     * @param {Object} data - Preview data
     * @param {number} data.employment_id - Employment ID (required)
     * @param {number} data.fte - FTE percentage (0-100)
     * @param {string} [data.effective_date] - Date to calculate for (defaults to today)
     * 
     * @returns {Promise<Object>} Preview result with:
     *   - fte_decimal: FTE as decimal
     *   - allocated_amount: Calculated amount
     *   - salary_type: Which salary is being used
     *   - salary_amount: The base salary amount
     *   - is_probation_period: Whether in probation period
     * 
     * @example
     * const preview = await employmentService.calculateAllocationPreview({
     *   employment_id: 456,
     *   fte: 60
     * });
     * // Returns: { allocated_amount: 30000, salary_type: 'probation_salary', is_probation_period: true }
     */
    async calculateAllocationPreview(data) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.EMPLOYEE_FUNDING_ALLOCATION.CALCULATE_PREVIEW, data),
            'calculate allocation preview'
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
     * @param {string} params.filter_organization - Filter by organization
     * @param {string} params.filter_employment_type - Filter by employment type
     * @param {string} params.filter_work_location - Filter by work location
     * @param {string} params.filter_status - Filter by employment status
     * @param {string} params.sort_by - Column to sort by (staff_id, employee_name, employment_type, work_location, start_date, end_date, salary, organization)
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

    /**
     * Calculate allocation amount in real-time
     * This is the AUTHORITATIVE method for all allocation calculations.
     * Backend automatically selects correct salary (probation_salary vs pass_probation_salary) based on dates.
     * 
     * Calculation Rules (handled by backend):
     * 1. If current date < pass_probation_date: use probation_salary (if available, else pass_probation_salary)
     * 2. If current date >= pass_probation_date: use pass_probation_salary
     * 3. Formula: (base_salary × fte%) / 100 = allocated_amount
     * 
     * @param {Object} data - Calculation parameters
     * @param {number} data.employment_id - Employment record ID (for existing records, optional)
     * @param {number} data.fte - FTE percentage (0-100) (required)
     * @param {number} data.probation_salary - Probation salary (for new employment, optional)
     * @param {number} data.pass_probation_salary - Post-probation salary (for new employment, required if no employment_id)
     * @param {string} data.pass_probation_date - Pass probation date (for new employment, optional, format: 'YYYY-MM-DD')
     * @param {string} data.start_date - Employment start date (for new employment, optional, format: 'YYYY-MM-DD')
     * @param {string} data.calculation_date - Date to calculate for (defaults to today, format: 'YYYY-MM-DD')
     * 
     * @returns {Promise<Object>} Calculation result with:
     *   - employment_id: Employment ID (if provided)
     *   - fte: FTE percentage (as sent)
     *   - fte_decimal: FTE as decimal (0.60 for 60%)
     *   - base_salary: Salary used for calculation
     *   - salary_type: Which salary field was used (probation_salary or pass_probation_salary)
     *   - salary_type_label: Human-readable salary type label
     *   - allocated_amount: Calculated amount (number)
     *   - formatted_amount: Formatted currency string (e.g., "฿30,000.00")
     *   - formatted_base_salary: Formatted base salary string
     *   - calculation_formula: Human-readable calculation formula
     *   - calculation_date: Date used for calculation
     *   - pass_probation_date: Pass probation date (if available)
     *   - start_date: Employment start date (if available)
     *   - is_probation_period: Boolean indicating if in probation period
     * 
     * @example
     * // For existing employment
     * const result = await employmentService.calculateAllocationAmount({
     *   employment_id: 123,
     *   fte: 60
     * });
     * 
     * @example
     * // For new employment (before saving)
     * const result = await employmentService.calculateAllocationAmount({
     *   fte: 60,
     *   probation_salary: 45000,
     *   pass_probation_salary: 50000,
     *   pass_probation_date: '2025-03-01',
     *   start_date: '2024-12-01'
     * });
     * // Returns: { allocated_amount: 27000, formatted_amount: "฿27,000.00", salary_type: "probation_salary", ... }
     */
    async calculateAllocationAmount(data) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.EMPLOYMENT.CALCULATE_ALLOCATION, data),
            'calculate allocation amount'
        );
    }

    /**
     * Manually complete probation for an employment
     * This triggers probation completion process which:
     * - Updates all funding allocations from probation_salary to pass_probation_salary
     * - Creates employment history entry
     * - Updates allocated_amount for each allocation
     *
     * Note: This is a manual trigger. Automated processing runs daily at 00:01
     *
     * @param {number} id - Employment ID
     * @returns {Promise<Object>} Response with updated employment and allocations
     *
     * @example
     * const result = await employmentService.completeProbation(123);
     * // Returns: { success: true, data: { employment, updated_allocations } }
     */
    async completeProbation(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.COMPLETE_PROBATION?.replace(':id', id)
            || `/employments/${id}/complete-probation`;
        return await this.handleApiResponse(
            () => apiService.post(endpoint),
            `complete probation for employment ${id}`
        );
    }

    // Update probation status (passed/failed)
    async updateProbationStatus(id, payload) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.PROBATION_STATUS?.replace(':id', id)
            || `/employments/${id}/probation-status`;
        return await this.handleApiResponse(
            () => apiService.post(endpoint, payload),
            `update probation status for employment ${id}`
        );
    }

    /**
     * Get probation history for an employment
     * Returns complete probation timeline including:
     * - Initial probation record
     * - Extension records (if any)
     * - Pass/Fail records (if completed)
     * - Summary statistics (total extensions, current status, etc.)
     *
     * @param {number} id - Employment ID
     * @returns {Promise<Object>} Response with probation history data
     *
     * Response structure:
     * {
     *   success: true,
     *   message: "Probation history retrieved successfully",
     *   data: {
     *     total_extensions: 1,
     *     current_extension_number: 1,
     *     probation_start_date: "2025-01-01",
     *     initial_end_date: "2025-04-01",
     *     current_end_date: "2025-05-01",
     *     current_status: "extended",
     *     current_event_type: "extension",
     *     records: [
     *       {
     *         id: 1,
     *         event_type: "initial",
     *         event_date: "2025-01-01",
     *         probation_start_date: "2025-01-01",
     *         probation_end_date: "2025-04-01",
     *         extension_number: 0,
     *         is_active: false,
     *         ...
     *       },
     *       {
     *         id: 2,
     *         event_type: "extension",
     *         event_date: "2025-04-01",
     *         probation_start_date: "2025-01-01",
     *         probation_end_date: "2025-05-01",
     *         previous_end_date: "2025-04-01",
     *         extension_number: 1,
     *         decision_reason: "Needs more time...",
     *         is_active: true,
     *         ...
     *       }
     *     ]
     *   }
     * }
     *
     * @example
     * const history = await employmentService.getProbationHistory(123);
     * console.log(history.data.total_extensions); // 1
     * console.log(history.data.records); // Array of probation records
     */
    async getProbationHistory(id) {
        const endpoint = API_ENDPOINTS.EMPLOYMENT.PROBATION_HISTORY.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch probation history for employment ${id}`
        );
    }
}

export const employmentService = new EmploymentService();
export default employmentService;

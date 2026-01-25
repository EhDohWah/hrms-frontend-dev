import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

/**
 * Holiday Service
 * Handles all API operations related to holidays management
 */
class HolidayService extends BaseService {
    /**
     * Get paginated holidays with filtering and sorting
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.per_page - Items per page (max 100)
     * @param {string} params.search - Search by name
     * @param {number} params.year - Filter by year
     * @param {boolean} params.is_active - Filter by active status
     * @param {string} params.from - Start date filter (YYYY-MM-DD)
     * @param {string} params.to - End date filter (YYYY-MM-DD)
     * @param {string} params.sort_by - Sort option (date_asc, date_desc, name_asc, name_desc, recently_added)
     * @returns {Promise<Object>} API response with holidays data and pagination
     */
    async getHolidays(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.HOLIDAY.LIST}${queryString ? `?${queryString}` : ''}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch holidays'
        );
    }

    /**
     * Get a single holiday by ID
     * @param {number} id - Holiday ID
     * @returns {Promise<Object>} API response with holiday data
     */
    async getHoliday(id) {
        const endpoint = API_ENDPOINTS.HOLIDAY.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch holiday ${id}`
        );
    }

    /**
     * Create a new holiday
     * @param {Object} data - Holiday data
     * @param {string} data.name - Holiday name (required)
     * @param {string} data.name_th - Holiday name in Thai
     * @param {string} data.date - Holiday date (YYYY-MM-DD, required)
     * @param {string} data.description - Holiday description
     * @param {boolean} data.is_active - Active status
     * @returns {Promise<Object>} API response with created holiday
     */
    async createHoliday(data) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.HOLIDAY.CREATE, data),
            'create holiday'
        );
    }

    /**
     * Update an existing holiday
     * @param {number} id - Holiday ID
     * @param {Object} data - Holiday data to update
     * @returns {Promise<Object>} API response with updated holiday
     */
    async updateHoliday(id, data) {
        const endpoint = API_ENDPOINTS.HOLIDAY.UPDATE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, data),
            `update holiday ${id}`
        );
    }

    /**
     * Delete a holiday
     * @param {number} id - Holiday ID
     * @returns {Promise<Object>} API response
     */
    async deleteHoliday(id) {
        const endpoint = API_ENDPOINTS.HOLIDAY.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            `delete holiday ${id}`
        );
    }

    /**
     * Get holidays for dropdown options
     * @param {Object} params - Query parameters
     * @param {number} params.year - Filter by year
     * @param {boolean} params.active_only - Only return active holidays
     * @returns {Promise<Object>} API response with holiday options
     */
    async getHolidayOptions(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.HOLIDAY.OPTIONS}${queryString ? `?${queryString}` : ''}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch holiday options'
        );
    }

    /**
     * Bulk create holidays
     * @param {Array} holidays - Array of holiday objects
     * @returns {Promise<Object>} API response with created holidays
     */
    async bulkCreateHolidays(holidays) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.HOLIDAY.BULK, { holidays }),
            'bulk create holidays'
        );
    }

    /**
     * Get holidays within a date range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<Object>} API response with holidays in range
     */
    async getHolidaysInRange(startDate, endDate) {
        const endpoint = `${API_ENDPOINTS.HOLIDAY.IN_RANGE}?start_date=${startDate}&end_date=${endDate}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch holidays in range'
        );
    }

    /**
     * Get available years for filtering
     * @returns {Array} Array of years
     */
    getYearOptions() {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear - 2; year <= currentYear + 2; year++) {
            years.push({ value: year, label: year.toString() });
        }
        return years;
    }

    /**
     * Get status options for filtering
     * @returns {Array} Array of status options
     */
    getStatusOptions() {
        return [
            { value: true, label: 'Active' },
            { value: false, label: 'Inactive' }
        ];
    }

    /**
     * Get sort options for the table
     * @returns {Array} Array of sort options
     */
    getSortOptions() {
        return [
            { value: 'date_asc', label: 'Date (Oldest First)' },
            { value: 'date_desc', label: 'Date (Newest First)' },
            { value: 'name_asc', label: 'Name (A-Z)' },
            { value: 'name_desc', label: 'Name (Z-A)' },
            { value: 'recently_added', label: 'Recently Added' }
        ];
    }
}

export const holidayService = new HolidayService();

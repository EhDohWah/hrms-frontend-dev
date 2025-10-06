import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class TravelRequestService extends BaseService {
    /**
     * Get all travel requests with pagination and filtering
     * @param {Object} params - Query parameters (page, per_page, search, filter_department, etc.)
     * @returns {Promise<Object>} API response
     */
    async getTravelRequests(params = {}) {
        try {
            // Build query parameters object
            const queryParams = new URLSearchParams();

            // Add all parameters from params object
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const endpoint = `${API_ENDPOINTS.TRAVEL_REQUEST.LIST}?${queryParams.toString()}`;
            const response = await apiService.get(endpoint);
            return response; // This should return the full API response including pagination metadata
        } catch (error) {
            console.error('Error fetching travel requests:', error);
            throw error;
        }
    }

    /**
     * Search travel requests by employee staff ID
     * @param {string} staffId - Employee staff ID
     * @param {Object} params - Query parameters (page, per_page)
     * @returns {Promise<Object>} API response
     */
    async searchTravelRequestsByEmployee(staffId, params = {}) {
        const endpoint = API_ENDPOINTS.TRAVEL_REQUEST.SEARCH_BY_EMPLOYEE.replace(':staffId', staffId);

        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const fullEndpoint = `${endpoint}?${queryParams.toString()}`;
            return await apiService.get(fullEndpoint);
        } catch (error) {
            // Check if it's a 404 error with travel request not found response
            if (error.response && error.response.status === 404 && error.response.data) {
                // Return the 404 response data as a valid response (not an error)
                return error.response.data;
            }
            // For other errors (network, auth, etc.), re-throw the error
            throw error;
        }
    }

    /**
     * Get single travel request by ID
     * @param {number} id - Travel request ID
     * @returns {Promise<Object>} API response
     */
    async getTravelRequest(id) {
        const endpoint = API_ENDPOINTS.TRAVEL_REQUEST.SHOW.replace(':id', id);
        return await apiService.get(endpoint);
    }

    /**
     * Create new travel request
     * @param {Object} data - Travel request data
     * @returns {Promise<Object>} API response
     */
    async createTravelRequest(data) {
        const formattedData = this.formatTravelRequestData(data);
        return await apiService.post(API_ENDPOINTS.TRAVEL_REQUEST.CREATE, formattedData);
    }

    /**
     * Update existing travel request
     * @param {number} id - Travel request ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} API response
     */
    async updateTravelRequest(id, data) {
        const endpoint = API_ENDPOINTS.TRAVEL_REQUEST.UPDATE.replace(':id', id);
        const formattedData = this.formatTravelRequestData(data);
        return await apiService.put(endpoint, formattedData);
    }

    /**
     * Delete travel request
     * @param {number} id - Travel request ID
     * @returns {Promise<Object>} API response
     */
    async deleteTravelRequest(id) {
        const endpoint = API_ENDPOINTS.TRAVEL_REQUEST.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    /**
     * Delete selected travel requests
     * @param {number[]} ids - Array of travel request IDs
     * @returns {Promise<Object>} API response
     */
    async deleteSelectedTravelRequests(ids) {
        return apiService.delete(
            API_ENDPOINTS.TRAVEL_REQUEST.DELETE_SELECTED,
            { ids }      // This will become the JSON body
        );
    }

    /**
     * Get transportation and accommodation options
     * @returns {Promise<Object>} API response with options
     */
    async getOptions() {
        return await this.handleApiResponse(
            () => apiService.get(API_ENDPOINTS.TRAVEL_REQUEST.OPTIONS),
            'fetch travel request options'
        );
    }

    /**
     * Format travel request data for API submission
     * @param {Object} data - Raw form data
     * @returns {Object} Formatted data
     */
    formatTravelRequestData(data) {
        const formattedData = {
            employee_id: parseInt(data.employee_id),
            department_id: data.department_id ? parseInt(data.department_id) : null,
            position_id: data.position_id ? parseInt(data.position_id) : null,
            destination: data.destination || null,
            start_date: data.start_date || null,
            to_date: data.to_date || null,
            purpose: data.purpose || null,
            grant: data.grant || null,
            transportation: data.transportation || null,
            accommodation: data.accommodation || null,
            remarks: data.remarks || null,
            created_by: data.created_by || null,
            updated_by: data.updated_by || null
        };

        // Only include other text fields if "other" is selected
        if (data.transportation === 'other' && data.transportation_other_text) {
            formattedData.transportation_other_text = data.transportation_other_text;
        }

        if (data.accommodation === 'other' && data.accommodation_other_text) {
            formattedData.accommodation_other_text = data.accommodation_other_text;
        }

        // Add approval fields (matching backend schema - Version 4.2)
        if (data.request_by_date) {
            formattedData.request_by_date = data.request_by_date;
        }
        if (data.supervisor_approved !== undefined) {
            formattedData.supervisor_approved = Boolean(data.supervisor_approved);
        }
        if (data.supervisor_approved_date) {
            formattedData.supervisor_approved_date = data.supervisor_approved_date;
        }
        if (data.hr_acknowledged !== undefined) {
            formattedData.hr_acknowledged = Boolean(data.hr_acknowledged);
        }
        if (data.hr_acknowledgement_date) {
            formattedData.hr_acknowledgement_date = data.hr_acknowledgement_date;
        }

        return formattedData;
    }

    /**
     * Validate travel request form data
     * @param {Object} data - Form data to validate
     * @returns {Object} Validation result
     */
    validateTravelRequestData(data) {
        const errors = {};

        // Required fields
        if (!data.employee_id) {
            errors.employee_id = 'Employee is required';
        }

        // Date validation
        if (data.start_date && data.to_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.to_date);

            if (endDate <= startDate) {
                errors.to_date = 'End date must be after start date';
            }
        }

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (startDate < today) {
                errors.start_date = 'Start date cannot be in the past';
            }
        }

        // Transportation validation
        const validTransportation = ['smru_vehicle', 'public_transportation', 'air', 'other'];
        if (data.transportation && !validTransportation.includes(data.transportation)) {
            errors.transportation = 'Invalid transportation option';
        }

        // Transportation "other" text validation
        if (data.transportation === 'other' && (!data.transportation_other_text || data.transportation_other_text.trim() === '')) {
            errors.transportation_other_text = 'Please specify the transportation method when "Other" is selected';
        }

        if (data.transportation_other_text && data.transportation_other_text.length > 200) {
            errors.transportation_other_text = 'Transportation description cannot exceed 200 characters';
        }

        // Accommodation validation
        const validAccommodation = ['smru_arrangement', 'self_arrangement', 'other'];
        if (data.accommodation && !validAccommodation.includes(data.accommodation)) {
            errors.accommodation = 'Invalid accommodation option';
        }

        // Accommodation "other" text validation
        if (data.accommodation === 'other' && (!data.accommodation_other_text || data.accommodation_other_text.trim() === '')) {
            errors.accommodation_other_text = 'Please specify the accommodation type when "Other" is selected';
        }

        if (data.accommodation_other_text && data.accommodation_other_text.length > 200) {
            errors.accommodation_other_text = 'Accommodation description cannot exceed 200 characters';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export const travelRequestService = new TravelRequestService();

// job-offer.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class JobOfferService {

  // Fetch all job offers
  async getAllJobOffers(params = {}) {
    try {
      // Build query string from parameters
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get(endpoint);
      return response; // This should return the full API response including pagination metadata
    } catch (error) {
      console.error('Error fetching job offers:', error);
      throw error;
    }
  }

  // Search job offers by candidate name
  async getByCandidateName(candidateName) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.BY_CANDIDATE.replace(':candidateName', candidateName);

    try {
      // Use the regular API service
      return await apiService.get(endpoint);
    } catch (error) {
      // Check if it's a 404 error with job offer not found response
      if (error.response && error.response.status === 404 && error.response.data) {
        // Return the 404 response data as a valid response (not an error)
        return error.response.data;
      }
      // For other errors (network, auth, etc.), re-throw the error
      throw error;
    }
  }

  // Search job offers by candidate name (handles 404 as valid response)
  async searchByCandidateName(candidateName) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.BY_CANDIDATE.replace(':candidateName', candidateName);

    try {
      // Use the regular API service
      return await apiService.get(endpoint);
    } catch (error) {
      // Check if it's a 404 error with job offer not found response
      if (error.response && error.response.status === 404 && error.response.data) {
        // Return the 404 response data as a valid response (not an error)
        return error.response.data;
      }
      // For other errors (network, auth, etc.), re-throw the error
      throw error;
    }
  }

  // Get job offer by ID
  async getJobOfferById(id) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Get job offer details
  async getJobOfferDetails(id) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Create a new job offer
  async createJobOffer(jobOfferData) {
    return await apiService.post(API_ENDPOINTS.JOB_OFFER.CREATE, jobOfferData);
  }

  // Update an existing job offer
  async updateJobOffer(id, jobOfferData) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, jobOfferData);
  }

  // Delete a job offer
  async deleteJobOffer(id) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  /**
   * Generate a PDF job offer letter
   * 
   * @param {string} custom_job_offer_id - Custom ID of the job offer
   * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
   * @throws {Error} - If the job offer is not found or there's a server error
   */
  async generateJobOfferPDF(custom_job_offer_id) {
    try {
      // Append a cache-busting timestamp query parameter
      const timestamp = new Date().getTime();
      const endpoint = API_ENDPOINTS.JOB_OFFER.GENERATE_PDF.replace(':id', custom_job_offer_id) + `?ts=${timestamp}`;
      const pdfBlob = await apiService.getPdf(endpoint);
      return pdfBlob;
    } catch (error) {
      // Handle specific error cases based on status code
      if (error.response && error.response.status === 404) {
        throw new Error('Job offer not found');
      }
      throw error;
    }
  }

  /**
   * Get advanced paginated job offers with server-side filtering and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10, max: 100)
   * @param {string} params.search - Search term for job offer ID, candidate name, or position
   * @param {string} params.candidate_name - Filter by candidate name
   * @param {string} params.position_name - Filter by position name
   * @param {string} params.acceptance_status - Filter by acceptance status (pending, accepted, rejected)
   * @param {string} params.date_from - Filter job offers from this date
   * @param {string} params.date_to - Filter job offers to this date
   * @param {string} params.deadline_from - Filter by acceptance deadline from this date
   * @param {string} params.deadline_to - Filter by acceptance deadline to this date
   * @param {string} params.sort_by - Column to sort by (job_offer_id, candidate_name, position, date, acceptance_deadline, status)
   * @param {string} params.sort_order - Sort order (asc, desc)
   * @param {string} params.filter_position - Filter by position names (comma-separated)
   * @param {string} params.filter_status - Filter by acceptance statuses (comma-separated)
   * @returns {Promise} API response with paginated job offers data
   */
  async getAdvancedPaginatedJobOffers(params = {}) {
    const queryParams = new URLSearchParams();

    // Add parameters to query string, filtering out empty values
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryParams.toString()}`;
    return await apiService.get(endpoint);
  }

  /**
   * Get paginated job offers
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with paginated job offers
   */
  async getPaginatedJobOffers(params = {}) {
    const queryParams = new URLSearchParams();

    // Add parameters to query string
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryParams.toString()}`;
    return await apiService.get(endpoint);
  }

  /**
   * Search job offers with various criteria
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.candidate_name - Candidate name to search for
   * @param {string} searchParams.position_name - Position name to search for
   * @param {string} searchParams.job_offer_id - Job offer ID to search for
   * @param {string} searchParams.status - Acceptance status to filter by
   * @returns {Promise} API response with matching job offers
   */
  async searchJobOffers(searchParams = {}) {
    const queryParams = new URLSearchParams();

    // Add search parameters to query string
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== undefined && searchParams[key] !== null && searchParams[key] !== '') {
        queryParams.append(`search_${key}`, searchParams[key]);
      }
    });

    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/search?${queryParams.toString()}`;

    try {
      return await apiService.get(endpoint);
    } catch (error) {
      // Handle 404 as a valid "no results" response
      if (error.response && error.response.status === 404 && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  /**
   * Get job offers by status
   * @param {string} status - The acceptance status (pending, accepted, rejected)
   * @param {Object} params - Additional query parameters
   * @returns {Promise} API response with job offers filtered by status
   */
  async getJobOffersByStatus(status, params = {}) {
    const queryParams = new URLSearchParams({
      acceptance_status: status,
      ...params
    });

    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryParams.toString()}`;
    return await apiService.get(endpoint);
  }

  /**
   * Get job offers by position
   * @param {string} positionName - The position name to filter by
   * @param {Object} params - Additional query parameters
   * @returns {Promise} API response with job offers filtered by position
   */
  async getJobOffersByPosition(positionName, params = {}) {
    const queryParams = new URLSearchParams({
      position_name: positionName,
      ...params
    });

    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryParams.toString()}`;
    return await apiService.get(endpoint);
  }

  /**
   * Get job offers within a date range
   * @param {string} dateFrom - Start date (YYYY-MM-DD format)
   * @param {string} dateTo - End date (YYYY-MM-DD format)
   * @param {Object} params - Additional query parameters
   * @returns {Promise} API response with job offers within the date range
   */
  async getJobOffersByDateRange(dateFrom, dateTo, params = {}) {
    const queryParams = new URLSearchParams({
      date_from: dateFrom,
      date_to: dateTo,
      ...params
    });

    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryParams.toString()}`;
    return await apiService.get(endpoint);
  }

  /**
   * Get filter options for job offers (positions, statuses, etc.)
   * @returns {Promise} API response with available filter options
   */
  async getFilterOptions() {
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/filter-options`;
    return await apiService.get(endpoint);
  }

  /**
   * Get job offer statistics
   * @param {Object} params - Query parameters for filtering statistics
   * @returns {Promise} API response with job offer statistics
   */
  async getJobOfferStatistics(params = {}) {
    const queryParams = new URLSearchParams(params);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/statistics?${queryParams.toString()}`;
    return await apiService.get(endpoint);
  }

  /**
   * Bulk update job offers
   * @param {Array} jobOfferIds - Array of job offer IDs to update
   * @param {Object} updateData - Data to update for all selected job offers
   * @returns {Promise} API response
   */
  async bulkUpdateJobOffers(jobOfferIds, updateData) {
    const payload = {
      job_offer_ids: jobOfferIds,
      update_data: updateData
    };

    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/bulk-update`;
    return await apiService.put(endpoint, payload);
  }

  /**
   * Bulk delete job offers
   * @param {Array} jobOfferIds - Array of job offer IDs to delete
   * @returns {Promise} API response
   */
  async bulkDeleteJobOffers(jobOfferIds) {
    const payload = {
      job_offer_ids: jobOfferIds
    };

    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/bulk-delete`;
    return await apiService.delete(endpoint, { data: payload });
  }

  /**
   * Export job offers to Excel
   * @param {Object} params - Export parameters (filters, date ranges, etc.)
   * @returns {Promise<Blob>} Excel file blob
   */
  async exportJobOffersToExcel(params = {}) {
    const queryParams = new URLSearchParams(params);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/export/excel?${queryParams.toString()}`;
    return await apiService.getBlob(endpoint);
  }

  /**
   * Export job offers to PDF
   * @param {Object} params - Export parameters (filters, date ranges, etc.)
   * @returns {Promise<Blob>} PDF file blob
   */
  async exportJobOffersToPDF(params = {}) {
    const queryParams = new URLSearchParams(params);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/export/pdf?${queryParams.toString()}`;
    return await apiService.getPdf(endpoint);
  }
}

export const jobOfferService = new JobOfferService();
// job-offer.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { BaseService } from '@/services/base.service';

class JobOfferService extends BaseService {

  // Fetch all job offers
  async getAllJobOffers(params = {}) {
    try {
      // Build query string from parameters using BaseService method
      const queryString = this.buildQueryString(params);
      const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}${queryString ? `?${queryString}` : ''}`;

      return await this.handleApiResponse(
        () => apiService.get(endpoint),
        'fetch job offers list'
      );
    } catch (error) {
      console.error('Error fetching job offers:', error);
      throw error;
    }
  }

  // Search job offers by candidate name
  async getByCandidateName(candidateName) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.BY_CANDIDATE.replace(':candidateName', candidateName);

    try {
      return await this.handleApiResponse(
        () => apiService.get(endpoint),
        `fetch job offers for candidate ${candidateName}`
      );
    } catch (error) {
      // Handle 404 as a valid "not found" response for search
      if (error.status === 404) {
        return error; // Return the structured error response from BaseService
      }
      throw error;
    }
  }

  // Search job offers by candidate name (handles 404 as valid response)
  async searchByCandidateName(candidateName) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.BY_CANDIDATE.replace(':candidateName', candidateName);

    try {
      return await this.handleApiResponse(
        () => apiService.get(endpoint),
        `search job offers for candidate ${candidateName}`
      );
    } catch (error) {
      // Handle 404 as a valid "not found" response for search
      if (error.status === 404) {
        return error; // Return the structured error response from BaseService
      }
      throw error;
    }
  }

  // Get job offer by ID
  async getJobOfferById(id) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.DETAILS.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      `fetch job offer with ID ${id}`
    );
  }

  // Get job offer details
  async getJobOfferDetails(id) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.DETAILS.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      `fetch job offer details for ID ${id}`
    );
  }

  // Create a new job offer
  async createJobOffer(jobOfferData) {
    return await this.handleApiResponse(
      () => apiService.post(API_ENDPOINTS.JOB_OFFER.CREATE, jobOfferData),
      'create job offer'
    );
  }

  // Update an existing job offer
  async updateJobOffer(id, jobOfferData) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.UPDATE.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.put(endpoint, jobOfferData),
      `update job offer with ID ${id}`
    );
  }

  // Delete a job offer
  async deleteJobOffer(id) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.DELETE.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.delete(endpoint),
      `delete job offer with ID ${id}`
    );
  }

  /**
   * Generate a PDF job offer letter
   * 
   * @param {string} custom_job_offer_id - Custom ID of the job offer
   * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
   * @throws {Error} - If the job offer is not found or there's a server error
   */
  async generateJobOfferPDF(custom_job_offer_id) {
    // Append a cache-busting timestamp query parameter
    const timestamp = new Date().getTime();
    const endpoint = API_ENDPOINTS.JOB_OFFER.GENERATE_PDF.replace(':id', custom_job_offer_id) + `?ts=${timestamp}`;

    return await this.handleApiResponse(
      () => apiService.getPdf(endpoint),
      `generate PDF for job offer ${custom_job_offer_id}`
    );
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
    // Use BaseService method to build query string
    const queryString = this.buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryString}`;

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch advanced paginated job offers'
    );
  }

  /**
   * Get paginated job offers
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with paginated job offers
   */
  async getPaginatedJobOffers(params = {}) {
    // Use BaseService method to build query string
    const queryString = this.buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryString}`;

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch paginated job offers'
    );
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
    // Build search query parameters
    const queryParams = new URLSearchParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== undefined && searchParams[key] !== null && searchParams[key] !== '') {
        queryParams.append(`search_${key}`, searchParams[key]);
      }
    });

    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/search?${queryParams.toString()}`;

    try {
      return await this.handleApiResponse(
        () => apiService.get(endpoint),
        'search job offers'
      );
    } catch (error) {
      // Handle 404 as a valid "no results" response for search
      if (error.status === 404) {
        return error; // Return the structured error response from BaseService
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
    const allParams = {
      acceptance_status: status,
      ...params
    };
    const queryString = this.buildQueryString(allParams);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryString}`;

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      `fetch job offers with status ${status}`
    );
  }

  /**
   * Get job offers by position
   * @param {string} positionName - The position name to filter by
   * @param {Object} params - Additional query parameters
   * @returns {Promise} API response with job offers filtered by position
   */
  async getJobOffersByPosition(positionName, params = {}) {
    const allParams = {
      position_name: positionName,
      ...params
    };
    const queryString = this.buildQueryString(allParams);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryString}`;

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      `fetch job offers for position ${positionName}`
    );
  }

  /**
   * Get job offers within a date range
   * @param {string} dateFrom - Start date (YYYY-MM-DD format)
   * @param {string} dateTo - End date (YYYY-MM-DD format)
   * @param {Object} params - Additional query parameters
   * @returns {Promise} API response with job offers within the date range
   */
  async getJobOffersByDateRange(dateFrom, dateTo, params = {}) {
    const allParams = {
      date_from: dateFrom,
      date_to: dateTo,
      ...params
    };
    const queryString = this.buildQueryString(allParams);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}?${queryString}`;

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      `fetch job offers from ${dateFrom} to ${dateTo}`
    );
  }

  /**
   * Get filter options for job offers (positions, statuses, etc.)
   * @returns {Promise} API response with available filter options
   */
  async getFilterOptions() {
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/filter-options`;
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch filter options'
    );
  }

  /**
   * Get job offer statistics
   * @param {Object} params - Query parameters for filtering statistics
   * @returns {Promise} API response with job offer statistics
   */
  async getJobOfferStatistics(params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/statistics?${queryString}`;
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch job offer statistics'
    );
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
    return await this.handleApiResponse(
      () => apiService.put(endpoint, payload),
      `bulk update ${jobOfferIds.length} job offers`
    );
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
    return await this.handleApiResponse(
      () => apiService.delete(endpoint, { data: payload }),
      `bulk delete ${jobOfferIds.length} job offers`
    );
  }

  /**
   * Export job offers to Excel
   * @param {Object} params - Export parameters (filters, date ranges, etc.)
   * @returns {Promise<Blob>} Excel file blob
   */
  async exportJobOffersToExcel(params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/export/excel?${queryString}`;
    return await this.handleApiResponse(
      () => apiService.getBlob(endpoint),
      'export job offers to Excel'
    );
  }

  /**
   * Export job offers to PDF
   * @param {Object} params - Export parameters (filters, date ranges, etc.)
   * @returns {Promise<Blob>} PDF file blob
   */
  async exportJobOffersToPDF(params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.JOB_OFFER.LIST}/export/pdf?${queryString}`;
    return await this.handleApiResponse(
      () => apiService.getPdf(endpoint),
      'export job offers to PDF'
    );
  }

  /**
   * Validate job offer data before sending to API
   * @param {Object} jobOfferData - Job offer data to validate
   * @returns {Object} Validation result
   */
  validateJobOfferData(jobOfferData) {
    // Use base class validation for required fields
    const requiredValidation = this.validateRequiredFields(jobOfferData, [
      'candidate_name',
      'position_name',
      'job_offer_id'
    ]);

    // Additional custom validations
    const customErrors = {};

    // Validate acceptance deadline date
    if (jobOfferData.acceptance_deadline && !this.isValidDate(jobOfferData.acceptance_deadline)) {
      customErrors.acceptance_deadline = ['Invalid acceptance deadline date format'];
    }

    // Validate job offer date
    if (jobOfferData.date && !this.isValidDate(jobOfferData.date)) {
      customErrors.date = ['Invalid job offer date format'];
    }

    // Validate acceptance status
    if (jobOfferData.acceptance_status) {
      const validStatuses = ['pending', 'accepted', 'rejected'];
      if (!validStatuses.includes(jobOfferData.acceptance_status.toLowerCase())) {
        customErrors.acceptance_status = [`Acceptance status must be one of: ${validStatuses.join(', ')}`];
      }
    }

    // Combine validations
    return this.combineValidations([
      requiredValidation,
      { isValid: Object.keys(customErrors).length === 0, errors: customErrors }
    ]);
  }

  /**
   * Create job offer with client-side validation
   * @param {Object} jobOfferData - Job offer data
   * @returns {Promise} API response
   */
  async createJobOfferWithValidation(jobOfferData) {
    const validation = this.validateJobOfferData(jobOfferData);

    if (!validation.isValid) {
      throw this.createValidationError(validation.errors);
    }

    return await this.createJobOffer(jobOfferData);
  }

  /**
   * Update job offer with client-side validation
   * @param {number} id - Job offer ID
   * @param {Object} jobOfferData - Job offer data
   * @returns {Promise} API response
   */
  async updateJobOfferWithValidation(id, jobOfferData) {
    const validation = this.validateJobOfferData(jobOfferData);

    if (!validation.isValid) {
      throw this.createValidationError(validation.errors);
    }

    return await this.updateJobOffer(id, jobOfferData);
  }
}

export const jobOfferService = new JobOfferService();
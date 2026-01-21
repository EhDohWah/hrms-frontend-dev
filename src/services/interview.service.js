import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { BaseService } from '@/services/base.service';

class InterviewService extends BaseService {
  // Fetch all interviews with query parameters for server-side pagination, filtering, and sorting
  async getAll(params = {}) {
    try {
      // Build query string from parameters using BaseService method
      const queryString = this.buildQueryString(params);
      const endpoint = `${API_ENDPOINTS.INTERVIEW.LIST}${queryString ? `?${queryString}` : ''}`;

      return await this.handleApiResponse(
        () => apiService.get(endpoint),
        'fetch interviews list'
      );
    } catch (error) {
      console.error('Error fetching interviews:', error);
      throw error;
    }
  }

  // Fetch all interviews (legacy method for backward compatibility)
  async getAllInterviews() {
    return await this.handleApiResponse(
      () => apiService.get(API_ENDPOINTS.INTERVIEW.LIST),
      'fetch all interviews'
    );
  }

  // Get interview by candidate name
  async getByCandidateName(name) {
    const endpoint = API_ENDPOINTS.INTERVIEW.BY_CANDIDATE_NAME?.replace(':candidateName', encodeURIComponent(name)) ||
      `${API_ENDPOINTS.INTERVIEW.LIST}/by-candidate/${encodeURIComponent(name)}`;

    try {
      return await apiService.get(endpoint);
    } catch (error) {
      // Check if it's a 404 error with interview not found response
      if (error.response && error.response.status === 404 && error.response.data) {
        // Return the 404 response data as a valid response (not an error)
        return error.response.data;
      }
      // For other errors (network, auth, etc.), re-throw the error
      throw error;
    }
  }

  // Get interview by ID with enhanced error handling
  async getInterviewById(id) {
    const endpoint = API_ENDPOINTS.INTERVIEW.DETAILS.replace(':id', id);

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      `fetch interview with ID ${id}`
    );
  }

  // Create a new interview with enhanced error handling
  async createInterview(interviewData) {
    return await this.handleApiResponse(
      () => apiService.post(API_ENDPOINTS.INTERVIEW.CREATE, interviewData),
      'create interview'
    );
  }

  // Update an existing interview with enhanced error handling
  async updateInterview(id, interviewData) {
    const endpoint = API_ENDPOINTS.INTERVIEW.UPDATE.replace(':id', id);

    return await this.handleApiResponse(
      () => apiService.put(endpoint, interviewData),
      `update interview with ID ${id}`
    );
  }

  // Delete an interview with enhanced error handling
  async deleteInterview(id) {
    const endpoint = API_ENDPOINTS.INTERVIEW.DELETE.replace(':id', id);

    return await this.handleApiResponse(
      () => apiService.delete(endpoint),
      `delete interview with ID ${id}`
    );
  }

  /**
   * Validate interview data before sending to API
   * @param {Object} interviewData - Interview data to validate
   * @returns {Object} Validation result
   */
  validateInterviewData(interviewData) {
    // Use base class validation for required fields
    const requiredValidation = this.validateRequiredFields(interviewData, [
      'candidate_name',
      'phone',
      'job_position',
      'interviewer_name',
      'interview_date',
      'interview_status'
    ]);

    // Additional custom validations
    const customErrors = {};

    // Validate phone number format
    if (interviewData.phone) {
      const cleanPhone = interviewData.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
        customErrors.phone = ['Phone number must be 10 digits (Thai) or 11 digits (Myanmar)'];
      } else if (cleanPhone.length === 10 && !cleanPhone.startsWith('0')) {
        customErrors.phone = ['Thai phone number must start with 0'];
      } else if (cleanPhone.length === 11 && !cleanPhone.startsWith('09')) {
        customErrors.phone = ['Myanmar phone number must start with 09'];
      }
    }

    // Validate score if provided
    if (interviewData.score !== undefined && interviewData.score !== null && interviewData.score !== '') {
      const score = parseFloat(interviewData.score);
      if (isNaN(score) || score < 0 || score > 100) {
        customErrors.score = ['Score must be a number between 0 and 100'];
      }
    }

    // Validate interview date
    if (interviewData.interview_date && !this.isValidDate(interviewData.interview_date)) {
      customErrors.interview_date = ['Invalid date format'];
    }

    // Combine validations
    return this.combineValidations([
      requiredValidation,
      { isValid: Object.keys(customErrors).length === 0, errors: customErrors }
    ]);
  }

  /**
   * Create interview with client-side validation
   * @param {Object} interviewData - Interview data
   * @returns {Promise} API response
   */
  async createInterviewWithValidation(interviewData) {
    const validation = this.validateInterviewData(interviewData);

    if (!validation.isValid) {
      throw this.createValidationError(validation.errors);
    }

    return await this.createInterview(interviewData);
  }

  /**
   * Update interview with client-side validation
   * @param {number} id - Interview ID
   * @param {Object} interviewData - Interview data
   * @returns {Promise} API response
   */
  async updateInterviewWithValidation(id, interviewData) {
    const validation = this.validateInterviewData(interviewData);

    if (!validation.isValid) {
      throw this.createValidationError(validation.errors);
    }

    return await this.updateInterview(id, interviewData);
  }
}

export const interviewService = new InterviewService();

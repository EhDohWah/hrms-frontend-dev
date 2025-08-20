import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class InterviewService {
  // Fetch all interviews with query parameters for server-side pagination, filtering, and sorting
  async getAll(params = {}) {
    try {
      // Build query string from parameters
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `${API_ENDPOINTS.INTERVIEW.LIST}${queryString ? `?${queryString}` : ''}`;

      const response = await apiService.get(endpoint);
      return response; // This should return the full API response including pagination metadata
    } catch (error) {
      console.error('Error fetching interviews:', error);
      throw error;
    }
  }

  // Fetch all interviews (legacy method for backward compatibility)
  async getAllInterviews() {
    return await apiService.get(API_ENDPOINTS.INTERVIEW.LIST);
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

    try {
      return await apiService.get(endpoint);
    } catch (error) {
      return this.handleServiceError(error, `interview with ID ${id}`);
    }
  }

  // Create a new interview with enhanced error handling
  async createInterview(interviewData) {
    try {
      return await apiService.post(API_ENDPOINTS.INTERVIEW.CREATE, interviewData);
    } catch (error) {
      return this.handleServiceError(error, 'interview creation');
    }
  }

  // Update an existing interview with enhanced error handling
  async updateInterview(id, interviewData) {
    const endpoint = API_ENDPOINTS.INTERVIEW.UPDATE.replace(':id', id);

    try {
      return await apiService.put(endpoint, interviewData);
    } catch (error) {
      return this.handleServiceError(error, `interview update for ID ${id}`);
    }
  }

  // Delete an interview with enhanced error handling
  async deleteInterview(id) {
    const endpoint = API_ENDPOINTS.INTERVIEW.DELETE.replace(':id', id);

    try {
      return await apiService.delete(endpoint);
    } catch (error) {
      return this.handleServiceError(error, `interview deletion for ID ${id}`);
    }
  }

  // Centralized error handling method
  handleServiceError(error, operation) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 404:
          return {
            success: false,
            message: data.message || `The requested ${operation} was not found.`,
            error_code: 'NOT_FOUND',
            data: null
          };

        case 422:
          return {
            success: false,
            message: data.message || 'Validation failed. Please check your input.',
            errors: data.errors || {},
            error_code: 'VALIDATION_ERROR',
            data: null
          };

        case 500:
          return {
            success: false,
            message: data.message || `Server error occurred during ${operation}. Please try again later.`,
            error_code: 'SERVER_ERROR',
            data: null
          };

        case 403:
          return {
            success: false,
            message: data.message || `You don't have permission to perform ${operation}.`,
            error_code: 'FORBIDDEN',
            data: null
          };

        case 401:
          return {
            success: false,
            message: data.message || 'Authentication required. Please log in again.',
            error_code: 'UNAUTHORIZED',
            data: null
          };

        default:
          return {
            success: false,
            message: data.message || `An error occurred during ${operation}.`,
            error_code: 'UNKNOWN_ERROR',
            status: status,
            data: null
          };
      }
    } else if (error.request) {
      // Network error
      return {
        success: false,
        message: `Network error during ${operation}. Please check your connection and try again.`,
        error_code: 'NETWORK_ERROR',
        data: null
      };
    } else {
      // Other error
      return {
        success: false,
        message: error.message || `An unexpected error occurred during ${operation}.`,
        error_code: 'UNKNOWN_ERROR',
        data: null
      };
    }
  }
}

export const interviewService = new InterviewService();

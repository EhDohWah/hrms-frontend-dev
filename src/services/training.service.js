import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class TrainingService extends BaseService {
  /**
   * Get all training programs with pagination and filtering
   * @param {Object} params - Query parameters (page, per_page, filter_organizer, filter_title, sort_by, sort_order)
   * @returns {Promise<Object>} API response
   */
  async getTrainings(params = {}) {
    try {
      // Build query parameters object
      const queryParams = new URLSearchParams();

      // Add all parameters from params object
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const endpoint = `${API_ENDPOINTS.TRAINING.LIST}?${queryParams.toString()}`;
      const response = await apiService.get(endpoint);
      return response; // This should return the full API response including pagination metadata
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }
  }

  /**
   * Get single training by ID
   * @param {number} id - Training ID
   * @returns {Promise<Object>} API response
   */
  async getTraining(id) {
    const endpoint = API_ENDPOINTS.TRAINING.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  /**
   * Create new training program
   * @param {Object} data - Training data
   * @returns {Promise<Object>} API response
   */
  async createTraining(data) {
    const formattedData = this.formatTrainingData(data);
    return await apiService.post(API_ENDPOINTS.TRAINING.CREATE, formattedData);
  }

  /**
   * Update existing training program
   * @param {number} id - Training ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} API response
   */
  async updateTraining(id, data) {
    const endpoint = API_ENDPOINTS.TRAINING.UPDATE.replace(':id', id);
    const formattedData = this.formatTrainingData(data);
    return await apiService.put(endpoint, formattedData);
  }

  /**
   * Delete training program
   * @param {number} id - Training ID
   * @returns {Promise<Object>} API response
   */
  async deleteTraining(id) {
    const endpoint = API_ENDPOINTS.TRAINING.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  /**
   * Delete selected training programs
   * @param {number[]} ids - Array of training IDs
   * @returns {Promise<Object>} API response
   */
  async deleteSelectedTrainings(ids) {
    // Use a bulk delete approach if supported by backend
    // For now, delete individually
    const deletePromises = ids.map(id => this.deleteTraining(id));
    return Promise.all(deletePromises);
  }

  /**
   * Format training data for API submission
   * @param {Object} data - Raw form data
   * @returns {Object} Formatted data
   */
  formatTrainingData(data) {
    return {
      title: data.title || null,
      organizer: data.organizer || null,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      created_by: data.created_by || null,
      updated_by: data.updated_by || null
    };
  }

  /**
   * Validate training form data
   * @param {Object} data - Form data to validate
   * @returns {Object} Validation result
   */
  validateTrainingData(data) {
    const errors = {};

    // Required fields
    if (!data.title || data.title.trim() === '') {
      errors.title = 'Training title is required';
    }

    if (data.title && data.title.length > 200) {
      errors.title = 'Training title cannot exceed 200 characters';
    }

    if (!data.organizer || data.organizer.trim() === '') {
      errors.organizer = 'Organizer is required';
    }

    if (data.organizer && data.organizer.length > 100) {
      errors.organizer = 'Organizer name cannot exceed 100 characters';
    }

    if (!data.start_date) {
      errors.start_date = 'Start date is required';
    }

    if (!data.end_date) {
      errors.end_date = 'End date is required';
    }

    // Date validation
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);

      if (endDate < startDate) {
        errors.end_date = 'End date must be after or equal to start date';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export const trainingService = new TrainingService();

import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class TrainingService {
  // Training
  async getTrainings() {
    return await apiService.get(API_ENDPOINTS.INTERVIEW.LIST);
  }

  async createTraining(data) {
    return await apiService.post(API_ENDPOINTS.TRAINING.CREATE, data);
  }

  async updateTraining(id, data) {
    const endpoint = API_ENDPOINTS.TRAINING.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, data);
  }

  async deleteTraining(id) {
    const endpoint = API_ENDPOINTS.TRAINING.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  async getTrainingDetails(id) {
    const endpoint = API_ENDPOINTS.TRAINING.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Employee Training
  async getEmployeeTrainings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.EMPLOYEE_TRAINING.LIST}?${queryString}` : API_ENDPOINTS.EMPLOYEE_TRAINING.LIST;
    return await apiService.get(endpoint);
  }

  async createEmployeeTraining(data) {
    return await apiService.post(API_ENDPOINTS.EMPLOYEE_TRAINING.CREATE, data);
  }

  async updateEmployeeTraining(id, data) {
    const endpoint = API_ENDPOINTS.EMPLOYEE_TRAINING.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, data);
  }

  async deleteEmployeeTraining(id) {
    const endpoint = API_ENDPOINTS.EMPLOYEE_TRAINING.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  async getEmployeeTrainingDetails(id) {
    const endpoint = API_ENDPOINTS.EMPLOYEE_TRAINING.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }
}

export const trainingService = new TrainingService();

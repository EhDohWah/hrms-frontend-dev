import axios from 'axios';
import API_ENDPOINTS from '@/config/api.config';

class TrainingService {
  // Training
  async getTrainings() {
    try {
      const response = await axios.get(API_ENDPOINTS.TRAINING.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainings:', error);
      throw error;
    }
  }

  async createTraining(data) {
    try {
      const response = await axios.post(API_ENDPOINTS.TRAINING.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  }

  async updateTraining(id, data) {
    try {
      const url = API_ENDPOINTS.TRAINING.UPDATE.replace(':id', id);
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating training:', error);
      throw error;
    }
  }

  async deleteTraining(id) {
    try {
      const url = API_ENDPOINTS.TRAINING.DELETE.replace(':id', id);
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting training:', error);
      throw error;
    }
  }

  async getTrainingDetails(id) {
    try {
      const url = API_ENDPOINTS.TRAINING.DETAILS.replace(':id', id);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching training details:', error);
      throw error;
    }
  }

  // Employee Training
  async getEmployeeTrainings() {
    try {
      const response = await axios.get(API_ENDPOINTS.EMPLOYEE_TRAINING.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee trainings:', error);
      throw error;
    }
  }

  async createEmployeeTraining(data) {
    try {
      const response = await axios.post(API_ENDPOINTS.EMPLOYEE_TRAINING.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating employee training:', error);
      throw error;
    }
  }

  async updateEmployeeTraining(id, data) {
    try {
      const url = API_ENDPOINTS.EMPLOYEE_TRAINING.UPDATE.replace(':id', id);
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating employee training:', error);
      throw error;
    }
  }

  async deleteEmployeeTraining(id) {
    try {
      const url = API_ENDPOINTS.EMPLOYEE_TRAINING.DELETE.replace(':id', id);
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting employee training:', error);
      throw error;
    }
  }

  async getEmployeeTrainingDetails(id) {
    try {
      const url = API_ENDPOINTS.EMPLOYEE_TRAINING.DETAILS.replace(':id', id);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee training details:', error);
      throw error;
    }
  }
}

export default new TrainingService();


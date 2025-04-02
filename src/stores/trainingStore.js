// src/stores/trainingStore.js
import { defineStore } from 'pinia';
import trainingService from '@/services/training.service';

export const useTrainingStore = defineStore('training', {
  state: () => ({
    trainings: [],
    employeeTrainings: [],
    currentTraining: null,
    currentEmployeeTraining: null,
    loading: false,
    error: null
  }),

  getters: {
    getTrainingById: (state) => (id) => {
      return state.trainings.find(training => training.id === id);
    },
    getEmployeeTrainingById: (state) => (id) => {
      return state.employeeTrainings.find(empTraining => empTraining.id === id);
    },
    getTrainingsByType: (state) => (type) => {
      return state.trainings.filter(training => training.type === type);
    },
    getEmployeeTrainingsByEmployee: (state) => (employeeId) => {
      return state.employeeTrainings.filter(empTraining => empTraining.employee_id === employeeId);
    },
    getCompletedTrainings: (state) => {
      return state.employeeTrainings.filter(empTraining => empTraining.status === 'completed');
    },
    getPendingTrainings: (state) => {
      return state.employeeTrainings.filter(empTraining => empTraining.status === 'pending');
    }
  },

  actions: {
    // Training actions
    async fetchTrainings() {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.getTrainings();
        this.trainings = response.data || response;
        return this.trainings;
      } catch (error) {
        this.error = error.message || 'Failed to fetch trainings';
        console.error('Error fetching trainings:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getTrainingDetails(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.getTrainingDetails(id);
        this.currentTraining = response.data || response;
        return this.currentTraining;
      } catch (error) {
        this.error = error.message || 'Failed to fetch training details';
        console.error('Error fetching training details:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTraining(data) {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.createTraining(data);
        await this.fetchTrainings();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create training';
        console.error('Error creating training:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTraining(id, data) {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.updateTraining(id, data);
        await this.fetchTrainings();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update training';
        console.error('Error updating training:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTraining(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.deleteTraining(id);
        await this.fetchTrainings();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete training';
        console.error('Error deleting training:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Employee Training actions
    async fetchEmployeeTrainings() {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.getEmployeeTrainings();
        this.employeeTrainings = response.data || response;
        return this.employeeTrainings;
      } catch (error) {
        this.error = error.message || 'Failed to fetch employee trainings';
        console.error('Error fetching employee trainings:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getEmployeeTrainingDetails(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.getEmployeeTrainingDetails(id);
        this.currentEmployeeTraining = response.data || response;
        return this.currentEmployeeTraining;
      } catch (error) {
        this.error = error.message || 'Failed to fetch employee training details';
        console.error('Error fetching employee training details:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createEmployeeTraining(data) {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.createEmployeeTraining(data);
        await this.fetchEmployeeTrainings();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create employee training';
        console.error('Error creating employee training:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateEmployeeTraining(id, data) {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.updateEmployeeTraining(id, data);
        await this.fetchEmployeeTrainings();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update employee training';
        console.error('Error updating employee training:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteEmployeeTraining(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await trainingService.deleteEmployeeTraining(id);
        await this.fetchEmployeeTrainings();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete employee training';
        console.error('Error deleting employee training:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setCurrentTraining(training) {
      this.currentTraining = training;
    },

    setCurrentEmployeeTraining(employeeTraining) {
      this.currentEmployeeTraining = employeeTraining;
    }
  }
});

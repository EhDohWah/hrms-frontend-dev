import { defineStore } from 'pinia';
import { trainingService } from '@/services/training.service';

export const useTrainingStore = defineStore('training', {
  state: () => ({
    // Data state
    trainings: [],
    currentTraining: null,
    statistics: {
      total: 0,
      upcoming: 0,
      ongoing: 0,
      completed: 0
    },

    // UI state
    loading: false,
    submitting: false,
    searchLoading: false,
    error: null,

    // Pagination state (server-side pagination from backend)
    currentPage: 1,
    pageSize: 10,
    total: 0,

    // Filter and sorting state
    filteredInfo: {},
    sortedInfo: {},
    searchText: ''
  }),

  getters: {
    /**
     * Get training by ID
     */
    getTrainingById: (state) => (id) => {
      return state.trainings.find(training => training.id === parseInt(id));
    },

    /**
     * Get filtered trainings (server-side filtering)
     */
    filteredTrainings: (state) => {
      return state.trainings;
    }
  },

  actions: {
    /**
     * Build API parameters for requests
     */
    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams
      };

      // Add sorting parameters
      if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
        const sortField = this.mapSortField(this.sortedInfo.field);
        params.sort_by = sortField;
        params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add filter parameters
      if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
        if (this.filteredInfo.organizer && this.filteredInfo.organizer.length > 0) {
          params.filter_organizer = this.filteredInfo.organizer.join(',');
        }
      }

      // Add search text if present
      if (this.searchText && this.searchText.trim() !== '') {
        params.filter_title = this.searchText.trim();
      }

      return params;
    },

    /**
     * Map frontend field names to backend field names
     */
    mapSortField(field) {
      const fieldMapping = {
        'title': 'title',
        'organizer': 'organizer',
        'start_date': 'start_date',
        'end_date': 'end_date',
        'created_at': 'created_at'
      };
      return fieldMapping[field] || field;
    },

    /**
     * Fetch trainings with pagination and filtering
     */
    async fetchTrainings(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };

        const response = await trainingService.getTrainings(queryParams);

        if (response.success && response.data) {
          this.trainings = this.mapTrainingData(response.data);

          // Update pagination properties from server response
          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
            this.pageSize = response.pagination.per_page;
          } else {
            this.total = response.data.length;
            this.currentPage = 1;
          }

          // Update statistics
          this.updateStatistics();
        } else {
          this.trainings = [];
          this.total = 0;
          throw new Error(response.message || 'Failed to fetch trainings');
        }
      } catch (error) {
        console.error('Error fetching trainings:', error);
        this.error = error.message;
        this.trainings = [];
        this.total = 0;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Search trainings by title or organizer
     */
    async searchTrainings(searchText) {
      this.searchLoading = true;
      this.searchText = searchText;

      try {
        const params = this.buildApiParams({
          filter_title: searchText,
          page: 1 // Reset to first page on search
        });

        const response = await trainingService.getTrainings(params);

        if (response.success && response.data) {
          this.trainings = this.mapTrainingData(response.data);

          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
          } else {
            this.total = response.data.length;
          }
        } else {
          this.trainings = [];
          this.total = 0;
          throw new Error(response.message || 'No trainings found');
        }
      } catch (error) {
        console.error('Error searching trainings:', error);
        this.trainings = [];
        this.total = 0;
        throw error;
      } finally {
        this.searchLoading = false;
      }
    },

    /**
     * Fetch single training
     */
    async fetchTraining(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await trainingService.getTraining(id);

        if (response.success) {
          this.currentTraining = response.data;

          // Update in list if exists
          const index = this.trainings.findIndex(t => t.id === parseInt(id));
          if (index !== -1) {
            this.trainings[index] = response.data;
          }

          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch training');
        }
      } catch (error) {
        this.error = error.message;
        this.currentTraining = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create new training
     */
    async createTraining(data) {
      this.submitting = true;
      this.error = null;

      try {
        const response = await trainingService.createTraining(data);

        if (response.success) {
          // Refresh list to get updated data
          await this.fetchTrainings();

          return response.data;
        } else {
          throw new Error(response.message || 'Failed to create training');
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.submitting = false;
      }
    },

    /**
     * Update training
     */
    async updateTraining(id, data) {
      this.submitting = true;
      this.error = null;

      try {
        const response = await trainingService.updateTraining(id, data);

        if (response.success) {
          // Update in list
          const index = this.trainings.findIndex(t => t.id === parseInt(id));
          if (index !== -1) {
            this.trainings[index] = response.data;
          }

          // Update current if it's the same
          if (this.currentTraining?.id === parseInt(id)) {
            this.currentTraining = response.data;
          }

          return response.data;
        } else {
          throw new Error(response.message || 'Failed to update training');
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.submitting = false;
      }
    },

    /**
     * Delete training
     */
    async deleteTraining(id) {
      this.submitting = true;
      this.error = null;

      try {
        const response = await trainingService.deleteTraining(id);

        if (response.success) {
          // Remove from list
          this.trainings = this.trainings.filter(t => t.id !== parseInt(id));
          this.total -= 1;

          // Clear current if it's the same
          if (this.currentTraining?.id === parseInt(id)) {
            this.currentTraining = null;
          }

          // Update statistics
          this.updateStatistics();

          return true;
        } else {
          throw new Error(response.message || 'Failed to delete training');
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.submitting = false;
      }
    },

    /**
     * Delete selected trainings
     */
    async deleteSelectedTrainings(ids) {
      this.submitting = true;
      this.error = null;

      try {
        await trainingService.deleteSelectedTrainings(ids);

        // Remove from list
        this.trainings = this.trainings.filter(t => !ids.includes(t.id));
        this.total -= ids.length;

        // Update statistics
        this.updateStatistics();

        return true;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.submitting = false;
      }
    },

    /**
     * Map training data from API response
     */
    mapTrainingData(data) {
      return data.map(training => ({
        key: training.id,
        id: training.id,
        title: training.title || 'N/A',
        organizer: training.organizer || 'N/A',
        start_date: training.start_date || null,
        end_date: training.end_date || null,
        created_at: training.created_at,
        updated_at: training.updated_at,
        created_by: training.created_by || 'N/A',
        updated_by: training.updated_by || 'N/A'
      }));
    },

    /**
     * Update local statistics
     */
    updateStatistics() {
      this.statistics.total = this.total;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let upcoming = 0;
      let ongoing = 0;
      let completed = 0;

      this.trainings.forEach(training => {
        if (training.start_date && training.end_date) {
          const startDate = new Date(training.start_date);
          const endDate = new Date(training.end_date);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          if (today < startDate) {
            upcoming++;
          } else if (today >= startDate && today <= endDate) {
            ongoing++;
          } else if (today > endDate) {
            completed++;
          }
        }
      });

      this.statistics.upcoming = upcoming;
      this.statistics.ongoing = ongoing;
      this.statistics.completed = completed;
    },

    /**
     * Update filters
     */
    updateFilters(newFilters) {
      this.filteredInfo = { ...this.filteredInfo, ...newFilters };
    },

    /**
     * Reset filters
     */
    clearFilters() {
      this.filteredInfo = {};
      this.currentPage = 1;
    },

    /**
     * Clear all filters and sorting
     */
    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchText = '';
      this.currentPage = 1;
    },

    /**
     * Update pagination
     */
    updatePagination(pagination) {
      if (pagination.current) this.currentPage = pagination.current;
      if (pagination.pageSize) this.pageSize = pagination.pageSize;
    },

    /**
     * Update sorting info
     */
    updateSorting(sorter) {
      this.sortedInfo = sorter || {};
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null;
    },

    /**
     * Clear current training
     */
    clearCurrentTraining() {
      this.currentTraining = null;
    }
  }
});

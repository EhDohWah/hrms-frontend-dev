import { defineStore } from 'pinia';
import { interviewService } from '@/services/interview.service';


export const useInterviewStore = defineStore('interview', {
  state: () => ({
    interviews: [],
    currentInterview: null,
    loading: false,
    error: null
  }),

  getters: {
    getInterviewById: (state) => (id) => {
      return state.interviews.find(interview => interview.id === id);
    }
  },

  actions: {
    // Fetch interviews with parameters for server-side pagination, filtering, and sorting
    async fetchInterviews(params = {}) {
      try {
        this.loading = true;
        this.error = null;

        // Use the new getAll method with parameters
        const response = await interviewService.getAll(params);

        // Return the raw API payload for the component to handle
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch interviews';
        console.error('Error fetching interviews:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Legacy method for backward compatibility
    async fetchAllInterviews() {
      try {
        this.loading = true;
        this.error = null;
        const response = await interviewService.getAllInterviews();

        // Check if response.data exists and is an array; if not, assume response is the array
        const interviewsData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        this.interviews = interviewsData;
        return this.interviews;
      } catch (error) {
        this.error = error.message || 'Failed to fetch interviews';
        console.error('Error fetching interviews:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createInterview(interviewData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await interviewService.createInterview(interviewData);
        // Refresh interviews list after creating
        await this.fetchInterviews();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create interview';
        console.error('Error creating interview:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchInterviewById(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await interviewService.getInterviewById(id);
        this.currentInterview = response.data;
        return this.currentInterview;
      } catch (error) {
        this.error = error.message || 'Failed to fetch interview';
        console.error('Error fetching interview by ID:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateInterview(id, interviewData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await interviewService.updateInterview(id, interviewData);
        // Refresh interviews list after updating
        await this.fetchInterviews();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update interview';
        console.error('Error updating interview:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteInterview(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await interviewService.deleteInterview(id);
        // Don't automatically refresh - let the component handle it
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete interview';
        console.error('Error deleting interview:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});

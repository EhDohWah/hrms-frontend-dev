import { defineStore } from 'pinia';
import { jobOfferService } from '@/services/job-offer.service';

export const useJobOfferStore = defineStore('jobOffer', {
  state: () => ({
    jobOffers: [],
    currentJobOffer: null,
    loading: false,
    error: null
  }),

  getters: {
    getJobOfferById: (state) => (id) => {
      return state.jobOffers.find(jobOffer => jobOffer.id === id);
    }
  },

  actions: {
    async fetchJobOffers() {
      try {
        this.loading = true;
        this.error = null;
        const response = await jobOfferService.getAllJobOffers();

        // Check if response.data exists and is an array; if not, assume response is the array
        const jobOffersData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        this.jobOffers = jobOffersData;
        return this.jobOffers;
      } catch (error) {
        this.error = error.message || 'Failed to fetch job offers';
        console.error('Error fetching job offers:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createJobOffer(jobOfferData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await jobOfferService.createJobOffer(jobOfferData);
        // Refresh job offers list after creating
        await this.fetchJobOffers();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create job offer';
        console.error('Error creating job offer:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchJobOfferById(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await jobOfferService.getJobOfferById(id);
        this.currentJobOffer = response.data;
        return this.currentJobOffer;
      } catch (error) {
        this.error = error.message || 'Failed to fetch job offer';
        console.error('Error fetching job offer by ID:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateJobOffer(id, jobOfferData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await jobOfferService.updateJobOffer(id, jobOfferData);
        // Refresh job offers list after updating
        await this.fetchJobOffers();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update job offer';
        console.error('Error updating job offer:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteJobOffer(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await jobOfferService.deleteJobOffer(id);
        // Refresh job offers list after deleting
        await this.fetchJobOffers();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete job offer';
        console.error('Error deleting job offer:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async generateJobOfferPDF(custom_job_offer_id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await jobOfferService.generateJobOfferPDF(custom_job_offer_id);
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to generate job offer PDF';
        console.error('Error generating job offer PDF:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});

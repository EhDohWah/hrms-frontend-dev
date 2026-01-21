import { defineStore } from 'pinia';
import { referenceService } from '@/services/reference.service';

export const useReferenceStore = defineStore('reference', {
  state: () => ({
    references: [],
    currentReference: null,
    loading: false,
    error: null
  }),

  getters: {
    getReferenceById: (state) => (id) => {
      return state.references.find(reference => reference.id === id);
    }
  },

  actions: {
    async fetchReferences() {
      try {
        this.loading = true;
        this.error = null;
        const response = await referenceService.getAllReferences();
        
        // Check if response.data exists and is an array; if not, assume response is the array
        const referencesData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
          
        this.references = referencesData;
        return this.references;
      } catch (error) {
        this.error = error.message || 'Failed to fetch references';
        console.error('Error fetching references:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createReference(referenceData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await referenceService.createReference(referenceData);
        // Refresh references list after creating
        await this.fetchReferences();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create reference';
        console.error('Error creating reference:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchReferenceById(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await referenceService.getReferenceById(id);
        this.currentReference = response.data;
        return this.currentReference;
      } catch (error) {
        this.error = error.message || 'Failed to fetch reference';
        console.error('Error fetching reference by ID:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateReference(id, referenceData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await referenceService.updateReference(id, referenceData);
        // Refresh references list after updating
        await this.fetchReferences();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update reference';
        console.error('Error updating reference:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteReference(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await referenceService.deleteReference(id);
        // Refresh references list after deleting
        await this.fetchReferences();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete reference';
        console.error('Error deleting reference:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});

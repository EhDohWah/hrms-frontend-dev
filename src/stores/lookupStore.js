import { defineStore } from 'pinia';
import { lookupService } from '@/services/lookup.service';

export const useLookupStore = defineStore('lookup', {
  state: () => ({
    lookups: [],
    lookupsByType: {},
    currentLookup: null,
    loading: false,
    error: null
  }),

  getters: {
    getLookups: (state) => state.lookups,
    getCurrentLookup: (state) => state.currentLookup,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,

    // Get lookups by category/t..
    getLookupsByType: (state) => (type) => {
      // First check if we have it in the organized lookupsByType object
      if (state.lookupsByType[type]) {
        return state.lookupsByType[type];
      }
      // Fallback to filtering the flat lookups array
      return state.lookups.filter(lookup => lookup.type === type);
    },

    // Get all unique lookup types
    getAllLookupTypes: (state) => {
      // If we have lookupsByType populated, use its keys
      if (Object.keys(state.lookupsByType).length > 0) {
        return Object.keys(state.lookupsByType);
      }
      // Fallback to extracting from flat lookups array
      const types = new Set(state.lookups.map(lookup => lookup.type));
      return [...types];
    }
  },

  actions: {
    // Fetch all lookups
    async fetchAllLookups() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await lookupService.getAllLookups();
        
        // Handle the new nested object response format
        if (response && typeof response === 'object' && !Array.isArray(response)) {
          // This is the new format - an object with type keys containing arrays of lookups
          this.lookupsByType = response;
          
          // Also flatten the data into the lookups array for backward compatibility
          const flattenedLookups = [];
          for (const type in response) {
            if (Array.isArray(response[type])) {
              flattenedLookups.push(...response[type]);
            }
          }
          this.lookups = flattenedLookups;
        } else {
          // Handle the old format (array or response.data)
          const data = response.data ? response.data : response;
          this.lookups = Array.isArray(data) ? data : [];
          
          // Also organize by type for the new getter
          this.lookupsByType = {};
          this.lookups.forEach(lookup => {
            const type = lookup.type;
            if (!this.lookupsByType[type]) {
              this.lookupsByType[type] = [];
            }
            this.lookupsByType[type].push(lookup);
          });
        }
        
        return this.lookups;
      } catch (error) {
        this.error = error.message || 'Failed to fetch lookups';
        console.error('Error fetching lookups:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    

    // Get a specific lookup by ID
    async fetchLookupById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await lookupService.getLookupDetails(id);
        this.currentLookup = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message || `Failed to fetch lookup with ID: ${id}`;
        console.error(`Error fetching lookup ${id}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Create a new lookup
    async createLookup(lookupData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await lookupService.createLookup(lookupData);
        this.lookups.push(response.data);
        
        // Update lookupsByType as well
        const type = response.data.type;
        if (!this.lookupsByType[type]) {
          this.lookupsByType[type] = [];
        }
        this.lookupsByType[type].push(response.data);
        
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to create lookup';
        console.error('Error creating lookup:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Update an existing lookup
    async updateLookup(id, lookupData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await lookupService.updateLookup(id, lookupData);
        const index = this.lookups.findIndex(lookup => lookup.id === id);
        if (index !== -1) {
          this.lookups[index] = response.data;
        }
        
        // Update in lookupsByType as well
        const type = response.data.type;
        if (this.lookupsByType[type]) {
          const typeIndex = this.lookupsByType[type].findIndex(lookup => lookup.id === id);
          if (typeIndex !== -1) {
            this.lookupsByType[type][typeIndex] = response.data;
          } else {
            this.lookupsByType[type].push(response.data);
          }
        } else {
          this.lookupsByType[type] = [response.data];
        }
        
        if (this.currentLookup && this.currentLookup.id === id) {
          this.currentLookup = response.data;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.message || `Failed to update lookup with ID: ${id}`;
        console.error(`Error updating lookup ${id}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Delete a lookup
    async deleteLookup(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await lookupService.deleteLookup(id);
        
        // Find the lookup to get its type before removing
        const lookup = this.lookups.find(item => item.id === id);
        
        // Remove from flat lookups array
        this.lookups = this.lookups.filter(lookup => lookup.id !== id);
        
        // Remove from lookupsByType if the lookup and its type exist
        if (lookup && lookup.type && this.lookupsByType[lookup.type]) {
          this.lookupsByType[lookup.type] = this.lookupsByType[lookup.type].filter(
            item => item.id !== id
          );
        }
        
        if (this.currentLookup && this.currentLookup.id === id) {
          this.currentLookup = null;
        }
        
        return true;
      } catch (error) {
        this.error = error.message || `Failed to delete lookup with ID: ${id}`;
        console.error(`Error deleting lookup ${id}:`, error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Get lookups by type
    async fetchLookupsByType(type) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await lookupService.getLookupsByType(type);
        
        // Update the lookupsByType for this specific type
        if (response.data) {
          this.lookupsByType[type] = response.data;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.message || `Failed to fetch lookups of type: ${type}`;
        console.error(`Error fetching lookups of type ${type}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Reset store state
    resetState() {
      this.lookups = [];
      this.lookupsByType = {};
      this.currentLookup = null;
      this.loading = false;
      this.error = null;
    }
  }
});

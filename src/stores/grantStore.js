// create a store for the grant
import { defineStore } from 'pinia';
import { grantService } from '@/services/grant.service';
import { uploadGrantService } from '@/services/upload-grant.service';
import { toRaw } from 'vue';


export const useGrantStore = defineStore('grant', {
  state: () => ({
    grants: [],
    grantItems: [],
    currentGrant: null,
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0
    }
  }),

  getters: {
    getGrantById: (state) => (id) => {
      return state.grants.find(grant => grant.id === id);
    },
    getGrantItemById: (state) => (id) => {
      return state.grantItems.find(item => item.id === id);
    }
  },

  actions: {

    async fetchPaginatedGrants(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || 1,
          per_page: params.per_page || 10,
          ...(params.search && { search: params.search }),
          ...(params.organization && { organization: params.organization }),
          ...(params.code && { code: params.code }),
          ...(params.sort_by && { sort_by: params.sort_by }),
          ...(params.sort_order && { sort_order: params.sort_order })
        };

        const response = await grantService.getPaginatedGrants(queryParams);

        if (response.data && response.data.success) {
          this.grants = response.data.data;
          this.pagination = response.data.pagination;
        } else {
          // Handle case where response structure might be different
          this.grants = response.data || response || [];
          this.pagination = {
            current_page: 1,
            per_page: 10,
            total: this.grants.length,
            last_page: 1,
            from: 1,
            to: this.grants.length
          };
        }

        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch paginated grants';
        console.error('Error fetching paginated grants:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAdvancedPaginatedGrants(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || 1,
          per_page: params.per_page || 10,
          with_items: params.with_items || true,
          ...(params.search && { search: params.search }),
          ...(params.organization && { organization: params.organization }),
          ...(params.code && { code: params.code }),
          ...(params.name && { name: params.name }),
          ...(params.end_date_after && { end_date_after: params.end_date_after }),
          ...(params.end_date_before && { end_date_before: params.end_date_before }),
          ...(params.end_date_between && { end_date_between: params.end_date_between }),
          ...(params.sort_by && { sort_by: params.sort_by }),
          ...(params.sort_order && { sort_order: params.sort_order }),
          ...(params.include_expired !== undefined && { include_expired: params.include_expired })
        };

        const response = await grantService.getAdvancedPaginatedGrants(queryParams);

        if (response.data && response.data.success) {
          this.grants = response.data.data.data || response.data.data;
          this.pagination = response.data.data.pagination || response.data.pagination;
        } else {
          // Handle case where response structure might be different
          this.grants = response.data || response || [];
          this.pagination = {
            current_page: 1,
            per_page: 10,
            total: this.grants.length,
            last_page: 1,
            from: 1,
            to: this.grants.length
          };
        }

        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch advanced paginated grants';
        console.error('Error fetching advanced paginated grants:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchFilterOptions() {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.getFilterOptions();

        // Return the filter options data
        return response.data && response.data.success
          ? response.data.data
          : response.data || response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch filter options';
        console.error('Error fetching filter options:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchGrantById(id) {

      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.getGrantById(id);
        this.currentGrant = response.data || response;
        return this.currentGrant;
      } catch (error) {
        this.error = error.message || 'Failed to fetch grant by id';
        console.error('Error fetching grant by id:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchGrantByCode(code) {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.getGrantByCode(code);

        // Check if response.data exists; if not, assume response is the data
        const grantData = response.data || response;

        // Update the grants array with the fetched grant if it exists
        if (grantData) {
          // Check if the grant already exists in the store
          const existingIndex = this.grants.findIndex(g => g.id === grantData.id);
          if (existingIndex >= 0) {
            // Update existing grant
            this.grants[existingIndex] = grantData;
          } else {
            // Add new grant to the array
            this.grants.push(grantData);
          }
        }

        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch grant by code';
        console.error('Error fetching grant by code:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchGrants() {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.getAllGrants();

        // Check if response.data exists and is an array; if not, assume response is the array
        const grantsData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        this.grants = grantsData;
        return this.grants;
      } catch (error) {
        this.error = error.message || 'Failed to fetch grants';
        console.error('Error fetching grants:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchGrantItems() {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.getAllGrantItems();

        // Check if response.data exists and is an array; if not, assume response is the array
        const grantItemsData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        this.grantItems = grantItemsData;
        return this.grantItems;
      } catch (error) {
        this.error = error.message || 'Failed to fetch grant items';
        console.error('Error fetching grant items:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createGrant(grantData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.createGrant(grantData);
        // Refresh grants list after creating
        await this.fetchGrants();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create grant';
        console.error('Error creating grant:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createGrantItem(itemData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.createGrantItem(itemData);
        // Refresh grant items list after creating
        await this.fetchGrantItems();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create grant item';
        console.error('Error creating grant item:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateGrant(id, grantData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.updateGrant(id, grantData);
        // Refresh grants list after updating
        await this.fetchGrants();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update grant';
        console.error('Error updating grant:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateGrantItem(id, itemData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.updateGrantItem(id, itemData);
        // Refresh grant items list after updating
        await this.fetchGrantItems();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update grant item';
        console.error('Error updating grant item:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteGrant(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.deleteGrant(id);
        // Refresh grants list after deleting
        await this.fetchGrants();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete grant';
        console.error('Error deleting grant:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteGrantItem(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.deleteGrantItem(id);
        // Refresh grant items list after deleting
        await this.fetchGrantItems();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete grant item';
        console.error('Error deleting grant item:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadGrantFile(file) {
      // Unwrap the reactive proxy to get the native File instance
      const rawFile = toRaw(file);
      try {
        this.loading = true;
        this.error = null;
        const response = await uploadGrantService.uploadGrantData(rawFile);
        // Refresh grants list after upload
        await this.fetchGrants();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to upload grant file';
        console.error('Error uploading grant file:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getGrantDetails(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.getGrantDetails(id);
        this.currentGrant = response.data || response;
        return this.currentGrant;
      } catch (error) {
        this.error = error.message || 'Failed to fetch grant details';
        console.error('Error fetching grant details:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setCurrentGrant(grant) {
      this.currentGrant = grant;
    },

    async fetchGrantPositions() {
      try {
        this.loading = true;
        this.error = null;
        const response = await grantService.getGrantPositions();
        this.grantPositions = response.data || response;
        return this.grantPositions;
      } catch (error) {
        this.error = error.message || 'Failed to fetch grant positions';
        console.error('Error fetching grant positions:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
}); 

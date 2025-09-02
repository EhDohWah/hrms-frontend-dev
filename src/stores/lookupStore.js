import { defineStore } from 'pinia';
import { lookupService } from '@/services/lookup.service';

export const useLookupStore = defineStore('lookup', {
  state: () => ({
    lookups: [],
    lookupsByType: {},
    lookupTypes: [],
    currentLookup: null,
    loading: false,
    error: null,
    // Pagination state
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0,
      has_more_pages: false
    },
    // Search and filter state
    filters: {
      search: '',
      filter_type: '',
      sort_by: 'type',
      sort_order: 'asc'
    },
    // Available filters
    availableFilters: {
      types: []
    }
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
      // First try to use the dedicated lookupTypes array (from backend)
      if (state.lookupTypes && state.lookupTypes.length > 0) {
        return state.lookupTypes;
      }
      // If we have lookupsByType populated, use its keys
      if (Object.keys(state.lookupsByType).length > 0) {
        return Object.keys(state.lookupsByType);
      }
      // Fallback to extracting from flat lookups array
      const types = new Set(state.lookups.map(lookup => lookup.type));
      return [...types];
    },

    // Get available lookup types for dropdowns
    getAvailableLookupTypes: (state) => state.lookupTypes,

    // Pagination getters
    getPagination: (state) => state.pagination,
    getCurrentPage: (state) => state.pagination.current_page,
    getTotalPages: (state) => state.pagination.last_page,
    hasMorePages: (state) => state.pagination.has_more_pages,
    getPerPage: (state) => state.pagination.per_page,
    getTotalItems: (state) => state.pagination.total,

    // Filter getters
    getFilters: (state) => state.filters,
    getSearchTerm: (state) => state.filters.search,
    getFilterType: (state) => state.filters.filter_type,
    getSortBy: (state) => state.filters.sort_by,
    getSortOrder: (state) => state.filters.sort_order,
    getAvailableFilterTypes: (state) => state.availableFilters.types,

    // Combined filter state for API calls
    getApiParams: (state) => ({
      page: state.pagination.current_page,
      per_page: state.pagination.per_page,
      search: state.filters.search || undefined,
      filter_type: state.filters.filter_type || undefined,
      sort_by: state.filters.sort_by,
      sort_order: state.filters.sort_order
    })
  },

  actions: {
    // Fetch all lookups with pagination support
    async fetchAllLookups(useFilters = true) {
      this.loading = true;
      this.error = null;

      try {
        const params = useFilters ? this.getApiParams : { grouped: true };
        const response = await lookupService.getAllLookups(params);

        if (response.success && response.data) {
          // Handle new paginated format
          if (response.pagination) {
            this.lookups = response.data;
            this.pagination = response.pagination;

            // Update available filters if provided
            if (response.filters?.available_types) {
              this.availableFilters.types = response.filters.available_types;
            }

            // Organize by type for backward compatibility
            this.lookupsByType = {};
            this.lookups.forEach(lookup => {
              const type = lookup.type;
              if (!this.lookupsByType[type]) {
                this.lookupsByType[type] = [];
              }
              this.lookupsByType[type].push(lookup);
            });
          } else {
            // Handle grouped format (backward compatibility)
            this.lookupsByType = response.data || response;

            // Flatten for the lookups array
            const flattenedLookups = [];
            for (const type in this.lookupsByType) {
              if (Array.isArray(this.lookupsByType[type])) {
                flattenedLookups.push(...this.lookupsByType[type]);
              }
            }
            this.lookups = flattenedLookups;
          }
        } else {
          // Handle old response format
          const data = response.data ? response.data : response;
          this.lookups = Array.isArray(data) ? data : [];

          // Organize by type
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

        // Update lookup types if this is a new type
        this.updateLookupTypes(type);

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

    // Fetch available lookup types
    async fetchLookupTypes() {
      this.loading = true;
      this.error = null;

      try {
        const response = await lookupService.getLookupTypes();

        if (response && response.data) {
          this.lookupTypes = response.data;
        } else if (Array.isArray(response)) {
          this.lookupTypes = response;
        } else {
          // If backend doesn't support types endpoint, extract from current data
          const types = new Set(this.lookups.map(lookup => lookup.type));
          this.lookupTypes = [...types];
        }

        return this.lookupTypes;
      } catch (error) {
        this.error = error.message || 'Failed to fetch lookup types';
        console.error('Error fetching lookup types:', error);

        // Fallback: extract types from existing data
        const types = new Set(this.lookups.map(lookup => lookup.type));
        this.lookupTypes = [...types];

        return this.lookupTypes;
      } finally {
        this.loading = false;
      }
    },

    // Fetch all lookup lists without pagination
    async fetchAllLookupLists() {
      this.loading = true;
      this.error = null;

      try {
        const response = await lookupService.getAllLookupLists();

        console.log('🔍 Raw response from /lookups/lists:', response);

        let lookupData = null;

        // Handle different response formats
        if (response.success && response.data) {
          // Format: { success: true, data: { type1: [...], type2: [...] } }
          lookupData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // Format: { data: { type1: [...], type2: [...] } }
          lookupData = response.data;
        } else if (typeof response === 'object' && !response.success) {
          // Format: { type1: [...], type2: [...] } (direct data)
          lookupData = response;
        }

        if (lookupData && typeof lookupData === 'object') {
          // Store the organized lookup data by type
          this.lookupsByType = lookupData;

          console.log('🔍 Organized data by type:', this.lookupsByType);

          // Flatten for the lookups array
          const flattenedLookups = [];
          for (const type in this.lookupsByType) {
            if (Array.isArray(this.lookupsByType[type])) {
              console.log(`🔍 Type "${type}" has ${this.lookupsByType[type].length} items:`, this.lookupsByType[type]);
              flattenedLookups.push(...this.lookupsByType[type]);
            }
          }
          this.lookups = flattenedLookups;

          // Extract and store lookup types
          this.lookupTypes = Object.keys(this.lookupsByType);

          console.log(`✅ Loaded ${this.lookups.length} lookups organized by type`);
          console.log(`📊 Available types: ${this.lookupTypes.join(', ')}`);
        } else {
          console.error('Invalid response format from lookup lists endpoint', response);
          this.error = 'Invalid response format';
        }

        return this.lookupsByType;
      } catch (error) {
        this.error = error.message || 'Failed to fetch lookup lists';
        console.error('Error fetching lookup lists:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update lookup types when new lookup is created
    updateLookupTypes(newType) {
      if (newType && !this.lookupTypes.includes(newType)) {
        this.lookupTypes.push(newType);
      }
    },

    // Search lookups
    async searchLookups(searchParams = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await lookupService.searchLookups(searchParams);

        if (response.success && response.data) {
          this.lookups = response.data;

          if (response.pagination) {
            this.pagination = response.pagination;
          }

          // Update search info if available
          if (response.search_info) {
            this.filters.search = response.search_info.search_term || '';
          }

          return response.data;
        }

        return [];
      } catch (error) {
        this.error = error.message || 'Failed to search lookups';
        console.error('Error searching lookups:', error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Pagination actions
    async nextPage() {
      if (this.pagination.has_more_pages) {
        this.pagination.current_page++;
        await this.fetchAllLookups();
      }
    },

    async prevPage() {
      if (this.pagination.current_page > 1) {
        this.pagination.current_page--;
        await this.fetchAllLookups();
      }
    },

    async goToPage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        await this.fetchAllLookups();
      }
    },

    setPerPage(perPage) {
      this.pagination.per_page = perPage;
      this.pagination.current_page = 1; // Reset to first page
    },

    // Filter actions
    setSearchTerm(search) {
      this.filters.search = search;
      this.pagination.current_page = 1; // Reset to first page when searching
    },

    setFilterType(filterType) {
      this.filters.filter_type = filterType;
      this.pagination.current_page = 1; // Reset to first page when filtering
    },

    setSortBy(sortBy) {
      this.filters.sort_by = sortBy;
      this.pagination.current_page = 1; // Reset to first page when sorting
    },

    setSortOrder(sortOrder) {
      this.filters.sort_order = sortOrder;
      this.pagination.current_page = 1; // Reset to first page when sorting
    },

    setSort(sortBy, sortOrder) {
      this.filters.sort_by = sortBy;
      this.filters.sort_order = sortOrder;
      this.pagination.current_page = 1;
    },

    // Clear filters
    clearFilters() {
      this.filters.search = '';
      this.filters.filter_type = '';
      this.pagination.current_page = 1;
    },

    clearAllFilters() {
      this.filters.search = '';
      this.filters.filter_type = '';
      this.filters.sort_by = 'type';
      this.filters.sort_order = 'asc';
      this.pagination.current_page = 1;
    },

    // Reset store state
    resetState() {
      this.lookups = [];
      this.lookupsByType = {};
      this.lookupTypes = [];
      this.currentLookup = null;
      this.loading = false;
      this.error = null;
      this.pagination = {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
        has_more_pages: false
      };
      this.filters = {
        search: '',
        filter_type: '',
        sort_by: 'type',
        sort_order: 'asc'
      };
      this.availableFilters = {
        types: []
      };
    }
  }
});

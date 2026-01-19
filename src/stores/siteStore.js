import { defineStore } from 'pinia';
import { siteService } from '@/services/site.service';

export const useSiteStore = defineStore('site', {
    state: () => ({
        sites: [],
        currentSite: null,
        siteOptions: [],
        loading: false,
        submitting: false,
        error: null,

        // Pagination
        currentPage: 1,
        pageSize: 10,
        total: 0,

        // Filter and sorting
        filteredInfo: {},
        sortedInfo: {},
        searchValue: ''
    }),

    getters: {
        getSiteById: (state) => (id) => {
            return state.sites.find(site => site.id === parseInt(id));
        },
        activeSites: (state) => {
            return state.sites.filter(site => site.is_active);
        }
    },

    actions: {
        async fetchSites(params = {}) {
            this.loading = true;
            this.error = null;

            try {
                const queryParams = {
                    page: params.page || this.currentPage || 1,
                    per_page: params.per_page || this.pageSize,
                };

                // Add search parameter if present
                if (params.search || this.searchValue) {
                    queryParams.search = params.search || this.searchValue;
                }

                // Add status filter if present
                if (params.is_active !== undefined) {
                    queryParams.is_active = params.is_active;
                }

                // Add sorting if present
                if (params.sort_by) {
                    queryParams.sort_by = params.sort_by;
                    queryParams.sort_direction = params.sort_direction || 'asc';
                }

                const response = await siteService.getSites(queryParams);

                if (response.success && response.data) {
                    this.sites = this.mapSiteData(response.data.data || response.data);

                    if (response.data.meta) {
                        this.total = response.data.meta.total;
                        this.currentPage = response.data.meta.current_page;
                        this.pageSize = response.data.meta.per_page;
                    } else {
                        this.total = this.sites.length;
                    }
                }
            } catch (error) {
                console.error('Error fetching sites:', error);
                this.error = error.message;
                this.sites = [];
            } finally {
                this.loading = false;
            }
        },

        async fetchSiteOptions(params = {}) {
            try {
                const response = await siteService.getSiteOptions(params);
                if (response.success && response.data) {
                    this.siteOptions = response.data;
                }
            } catch (error) {
                console.error('Error fetching site options:', error);
            }
        },

        async fetchSiteById(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await siteService.getSiteById(id);
                if (response.success) {
                    this.currentSite = response.data;
                    return response.data;
                }
            } catch (error) {
                this.error = error.message;
                this.currentSite = null;
            } finally {
                this.loading = false;
            }
        },

        async createSite(data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await siteService.createSite(data);
                if (response.success) {
                    await this.fetchSites();
                    return response.data;
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        async updateSite(id, data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await siteService.updateSite(id, data);
                if (response.success) {
                    const index = this.sites.findIndex(site => site.id === parseInt(id));
                    if (index !== -1) {
                        this.sites[index] = response.data;
                    }
                    return response.data;
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        async deleteSite(id) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await siteService.deleteSite(id);
                if (response.success) {
                    this.sites = this.sites.filter(site => site.id !== parseInt(id));
                    this.total -= 1;
                    return true;
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        mapSiteData(data) {
            return data.map(item => ({
                key: item.id,
                id: item.id,
                name: item.name || '',
                code: item.code || '',
                description: item.description || '',
                address: item.address || '',
                contact_person: item.contact_person || '',
                contact_phone: item.contact_phone || '',
                contact_email: item.contact_email || '',
                is_active: item.is_active,
                employments_count: item.employments_count || 0,
                active_employments_count: item.active_employments_count || 0,
                created_at: item.created_at,
                updated_at: item.updated_at
            }));
        },

        clearFilters() {
            this.filteredInfo = {};
            this.currentPage = 1;
        },

        clearAll() {
            this.filteredInfo = {};
            this.sortedInfo = {};
            this.searchValue = '';
            this.currentPage = 1;
        },

        setSearchValue(value) {
            this.searchValue = value;
            this.currentPage = 1;
        },

        setPage(page) {
            this.currentPage = page;
        },

        setPageSize(size) {
            this.pageSize = size;
            this.currentPage = 1;
        }
    }
});

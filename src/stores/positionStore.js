import { defineStore } from 'pinia';
import { positionService } from '@/services/position.service';

export const usePositionStore = defineStore('position', {
    state: () => ({
        positions: [],
        currentPosition: null,
        positionOptions: [],
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
        getPositionById: (state) => (id) => {
            return state.positions.find(pos => pos.id === parseInt(id));
        },
        activePositions: (state) => {
            return state.positions.filter(pos => pos.is_active);
        },
        managerPositions: (state) => {
            return state.positions.filter(pos => pos.is_manager && pos.is_active);
        }
    },

    actions: {
        async fetchPositions(params = {}) {
            this.loading = true;
            this.error = null;

            try {
                const queryParams = {
                    page: params.page || this.currentPage || 1,
                    per_page: params.per_page || this.pageSize,
                };

                // Add search parameter if present (searches by title)
                if (params.search || this.searchValue) {
                    queryParams.search = params.search || this.searchValue;
                }

                // Add department filter if present
                if (params.department_id) {
                    queryParams.department_id = params.department_id;
                }

                // Add status filter if present
                if (params.is_active !== undefined) {
                    queryParams.is_active = params.is_active;
                }

                // Add manager filter if present
                if (params.is_manager !== undefined) {
                    queryParams.is_manager = params.is_manager;
                }

                // Add sorting if present
                if (params.sort_by) {
                    queryParams.sort_by = params.sort_by;
                    queryParams.sort_direction = params.sort_direction || 'asc';
                }

                const response = await positionService.getPositions(queryParams);

                if (response.success && response.data) {
                    this.positions = this.mapPositionData(response.data.data || response.data);

                    if (response.data.meta) {
                        this.total = response.data.meta.total;
                        this.currentPage = response.data.meta.current_page;
                        this.pageSize = response.data.meta.per_page;
                    } else {
                        this.total = this.positions.length;
                    }
                }
            } catch (error) {
                console.error('Error fetching positions:', error);
                this.error = error.message;
                this.positions = [];
            } finally {
                this.loading = false;
            }
        },

        async fetchPositionOptions(params = {}) {
            try {
                const response = await positionService.getPositionOptions(params);
                if (response.success && response.data) {
                    this.positionOptions = response.data;
                }
            } catch (error) {
                console.error('Error fetching position options:', error);
            }
        },

        async fetchPositionById(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await positionService.getPositionById(id);
                if (response.success) {
                    this.currentPosition = response.data;
                    return response.data;
                }
            } catch (error) {
                this.error = error.message;
                this.currentPosition = null;
            } finally {
                this.loading = false;
            }
        },

        async createPosition(data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await positionService.createPosition(data);
                if (response.success) {
                    await this.fetchPositions();
                    return response.data;
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        async updatePosition(id, data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await positionService.updatePosition(id, data);
                if (response.success) {
                    const index = this.positions.findIndex(pos => pos.id === parseInt(id));
                    if (index !== -1) {
                        this.positions[index] = response.data;
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

        async deletePosition(id) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await positionService.deletePosition(id);
                if (response.success) {
                    this.positions = this.positions.filter(pos => pos.id !== parseInt(id));
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

        mapPositionData(data) {
            return data.map(item => ({
                key: item.id,
                id: item.id,
                title: item.title || '',
                department_id: item.department_id,
                department: item.department || null,
                department_name: item.department?.name || '',
                reports_to_position_id: item.reports_to_position_id,
                reports_to: item.reports_to || item.manager || null,
                reports_to_title: item.reports_to?.title || item.manager?.title || '',
                level: item.level || 1,
                is_manager: item.is_manager || false,
                is_active: item.is_active,
                direct_reports_count: item.direct_reports_count || 0,
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

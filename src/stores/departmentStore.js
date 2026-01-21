import { defineStore } from 'pinia';
import { departmentService } from '@/services/department.service';

export const useDepartmentStore = defineStore('department', {
    state: () => ({
        departments: [],
        currentDepartment: null,
        departmentOptions: [],
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
        getDepartmentById: (state) => (id) => {
            return state.departments.find(dept => dept.id === parseInt(id));
        },
        activeDepartments: (state) => {
            return state.departments.filter(dept => dept.is_active);
        }
    },

    actions: {
        async fetchDepartments(params = {}) {
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

                const response = await departmentService.getDepartments(queryParams);

                if (response.success && response.data) {
                    this.departments = this.mapDepartmentData(response.data.data || response.data);

                    if (response.data.meta) {
                        this.total = response.data.meta.total;
                        this.currentPage = response.data.meta.current_page;
                        this.pageSize = response.data.meta.per_page;
                    } else {
                        this.total = this.departments.length;
                    }
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
                this.error = error.message;
                this.departments = [];
            } finally {
                this.loading = false;
            }
        },

        async fetchDepartmentOptions(params = {}) {
            try {
                const response = await departmentService.getDepartmentOptions(params);
                if (response.success && response.data) {
                    this.departmentOptions = response.data;
                }
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        },

        async fetchDepartmentById(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await departmentService.getDepartmentById(id);
                if (response.success) {
                    this.currentDepartment = response.data;
                    return response.data;
                }
            } catch (error) {
                this.error = error.message;
                this.currentDepartment = null;
            } finally {
                this.loading = false;
            }
        },

        async createDepartment(data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await departmentService.createDepartment(data);
                if (response.success) {
                    await this.fetchDepartments();
                    return response.data;
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        async updateDepartment(id, data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await departmentService.updateDepartment(id, data);
                if (response.success) {
                    const index = this.departments.findIndex(dept => dept.id === parseInt(id));
                    if (index !== -1) {
                        this.departments[index] = response.data;
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

        async deleteDepartment(id) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await departmentService.deleteDepartment(id);
                if (response.success) {
                    this.departments = this.departments.filter(dept => dept.id !== parseInt(id));
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

        mapDepartmentData(data) {
            return data.map(item => ({
                key: item.id,
                id: item.id,
                name: item.name || '',
                description: item.description || '',
                is_active: item.is_active,
                positions_count: item.positions_count || 0,
                active_positions_count: item.active_positions_count || 0,
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

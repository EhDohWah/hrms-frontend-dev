import { defineStore } from 'pinia';
import { sectionDepartmentService } from '@/services/section-department.service';

export const useSectionDepartmentStore = defineStore('sectionDepartment', {
    state: () => ({
        sectionDepartments: [],
        currentSectionDepartment: null,
        sectionDepartmentOptions: [],
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
        getSectionDepartmentById: (state) => (id) => {
            return state.sectionDepartments.find(sec => sec.id === parseInt(id));
        },
        activeSectionDepartments: (state) => {
            return state.sectionDepartments.filter(sec => sec.is_active);
        },
        getSectionDepartmentsByDepartment: (state) => (departmentId) => {
            return state.sectionDepartments.filter(sec => sec.department_id === parseInt(departmentId));
        }
    },

    actions: {
        async fetchSectionDepartments(params = {}) {
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

                // Add department filter if present
                if (params.department_id) {
                    queryParams.department_id = params.department_id;
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

                const response = await sectionDepartmentService.getSectionDepartments(queryParams);

                if (response.success && response.data) {
                    this.sectionDepartments = this.mapSectionDepartmentData(response.data.data || response.data);

                    if (response.data.meta) {
                        this.total = response.data.meta.total;
                        this.currentPage = response.data.meta.current_page;
                        this.pageSize = response.data.meta.per_page;
                    } else {
                        this.total = this.sectionDepartments.length;
                    }
                }
            } catch (error) {
                console.error('Error fetching section departments:', error);
                this.error = error.message;
                this.sectionDepartments = [];
            } finally {
                this.loading = false;
            }
        },

        async fetchSectionDepartmentOptions(params = {}) {
            try {
                const response = await sectionDepartmentService.getSectionDepartmentOptions(params);
                if (response.success && response.data) {
                    this.sectionDepartmentOptions = response.data;
                }
            } catch (error) {
                console.error('Error fetching section department options:', error);
            }
        },

        async fetchSectionDepartmentsByDepartment(departmentId) {
            try {
                const response = await sectionDepartmentService.getSectionDepartmentsByDepartment(departmentId);
                if (response.success && response.data) {
                    return response.data;
                }
            } catch (error) {
                console.error('Error fetching section departments by department:', error);
            }
        },

        async fetchSectionDepartmentById(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await sectionDepartmentService.getSectionDepartmentById(id);
                if (response.success) {
                    this.currentSectionDepartment = response.data;
                    return response.data;
                }
            } catch (error) {
                this.error = error.message;
                this.currentSectionDepartment = null;
            } finally {
                this.loading = false;
            }
        },

        async createSectionDepartment(data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await sectionDepartmentService.createSectionDepartment(data);
                if (response.success) {
                    await this.fetchSectionDepartments();
                    return response.data;
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        async updateSectionDepartment(id, data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await sectionDepartmentService.updateSectionDepartment(id, data);
                if (response.success) {
                    const index = this.sectionDepartments.findIndex(sec => sec.id === parseInt(id));
                    if (index !== -1) {
                        this.sectionDepartments[index] = response.data;
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

        async deleteSectionDepartment(id) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await sectionDepartmentService.deleteSectionDepartment(id);
                if (response.success) {
                    this.sectionDepartments = this.sectionDepartments.filter(sec => sec.id !== parseInt(id));
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

        mapSectionDepartmentData(data) {
            return data.map(item => ({
                key: item.id,
                id: item.id,
                name: item.name || '',
                department_id: item.department_id,
                department: item.department || null,
                department_name: item.department_name || item.department?.name || '',
                description: item.description || '',
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

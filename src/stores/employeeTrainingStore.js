import { defineStore } from 'pinia';
import { employeeTrainingService } from '@/services/employeeTraining.service';

export const useEmployeeTrainingStore = defineStore('employeeTraining', {
    state: () => ({
        // Data state
        employeeTrainings: [],
        currentEmployeeTraining: null,
        statistics: {
            total: 0,
            completed: 0,
            inProgress: 0,
            pending: 0,
            cancelled: 0
        },

        // UI state
        loading: false,
        submitting: false,
        searchLoading: false,
        error: null,

        // Pagination state (server-side pagination from backend)
        currentPage: 1,
        pageSize: 10,
        total: 0,

        // Filter and sorting state
        filteredInfo: {},
        sortedInfo: {},
        searchText: '',

        // Status options
        statusOptions: [
            { value: 'Pending', label: 'Pending', color: 'warning' },
            { value: 'In Progress', label: 'In Progress', color: 'primary' },
            { value: 'Completed', label: 'Completed', color: 'success' },
            { value: 'Cancelled', label: 'Cancelled', color: 'danger' }
        ]
    }),

    getters: {
        /**
         * Get employee training by ID
         */
        getEmployeeTrainingById: (state) => (id) => {
            return state.employeeTrainings.find(et => et.id === parseInt(id));
        },

        /**
         * Get filtered employee trainings (server-side filtering)
         */
        filteredEmployeeTrainings: (state) => {
            return state.employeeTrainings;
        },

        /**
         * Get status badge color
         */
        getStatusBadgeClass: (state) => (status) => {
            const statusOption = state.statusOptions.find(opt => opt.value === status);
            return statusOption ? `badge-soft-${statusOption.color}` : 'badge-soft-secondary';
        }
    },

    actions: {
        /**
         * Build API parameters for requests
         */
        buildApiParams(baseParams = {}) {
            const params = {
                page: this.currentPage,
                per_page: this.pageSize,
                ...baseParams
            };

            // Add sorting parameters
            if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
                const sortField = this.mapSortField(this.sortedInfo.field);
                params.sort_by = sortField;
                params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
            }

            // Add filter parameters
            if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
                if (this.filteredInfo.status && this.filteredInfo.status.length > 0) {
                    params.filter_status = this.filteredInfo.status.join(',');
                }
                if (this.filteredInfo.training_id) {
                    params.filter_training_id = this.filteredInfo.training_id;
                }
                if (this.filteredInfo.employee_id) {
                    params.filter_employee_id = this.filteredInfo.employee_id;
                }
            }

            // Add search text if present
            if (this.searchText && this.searchText.trim() !== '') {
                params.filter_training_title = this.searchText.trim();
            }

            return params;
        },

        /**
         * Map frontend field names to backend field names
         */
        mapSortField(field) {
            const fieldMapping = {
                'employee_name': 'employee_id',
                'training_title': 'training_id',
                'status': 'status',
                'start_date': 'start_date',
                'end_date': 'end_date',
                'created_at': 'created_at'
            };
            return fieldMapping[field] || field;
        },

        /**
         * Fetch employee trainings with pagination and filtering
         */
        async fetchEmployeeTrainings(params = {}) {
            this.loading = true;
            this.error = null;

            try {
                const queryParams = {
                    page: params.page || this.currentPage || 1,
                    per_page: params.per_page || this.pageSize,
                    ...params
                };

                const response = await employeeTrainingService.getEmployeeTrainings(queryParams);

                if (response.success && response.data) {
                    this.employeeTrainings = this.mapEmployeeTrainingData(response.data);

                    // Update pagination properties from server response
                    if (response.pagination) {
                        this.total = response.pagination.total;
                        this.currentPage = response.pagination.current_page;
                        this.pageSize = response.pagination.per_page;
                    } else {
                        this.total = response.data.length;
                        this.currentPage = 1;
                    }

                    // Update statistics
                    this.updateStatistics();
                } else {
                    this.employeeTrainings = [];
                    this.total = 0;
                    throw new Error(response.message || 'Failed to fetch employee trainings');
                }
            } catch (error) {
                console.error('Error fetching employee trainings:', error);
                this.error = error.message;
                this.employeeTrainings = [];
                this.total = 0;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Search employee trainings
         */
        async searchEmployeeTrainings(searchText) {
            this.searchLoading = true;
            this.searchText = searchText;

            try {
                const params = this.buildApiParams({
                    filter_training_title: searchText,
                    page: 1 // Reset to first page on search
                });

                const response = await employeeTrainingService.getEmployeeTrainings(params);

                if (response.success && response.data) {
                    this.employeeTrainings = this.mapEmployeeTrainingData(response.data);

                    if (response.pagination) {
                        this.total = response.pagination.total;
                        this.currentPage = response.pagination.current_page;
                    } else {
                        this.total = response.data.length;
                    }
                } else {
                    this.employeeTrainings = [];
                    this.total = 0;
                    throw new Error(response.message || 'No employee trainings found');
                }
            } catch (error) {
                console.error('Error searching employee trainings:', error);
                this.employeeTrainings = [];
                this.total = 0;
                throw error;
            } finally {
                this.searchLoading = false;
            }
        },

        /**
         * Fetch single employee training
         */
        async fetchEmployeeTraining(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await employeeTrainingService.getEmployeeTraining(id);

                if (response.success) {
                    this.currentEmployeeTraining = response.data;

                    // Update in list if exists
                    const index = this.employeeTrainings.findIndex(et => et.id === parseInt(id));
                    if (index !== -1) {
                        this.employeeTrainings[index] = response.data;
                    }

                    return response.data;
                } else {
                    throw new Error(response.message || 'Failed to fetch employee training');
                }
            } catch (error) {
                this.error = error.message;
                this.currentEmployeeTraining = null;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Create new employee training
         */
        async createEmployeeTraining(data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await employeeTrainingService.createEmployeeTraining(data);

                if (response.success) {
                    // Refresh list to get updated data
                    await this.fetchEmployeeTrainings();

                    return response.data;
                } else {
                    throw new Error(response.message || 'Failed to create employee training');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Update employee training
         */
        async updateEmployeeTraining(id, data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await employeeTrainingService.updateEmployeeTraining(id, data);

                if (response.success) {
                    // Update in list
                    const index = this.employeeTrainings.findIndex(et => et.id === parseInt(id));
                    if (index !== -1) {
                        this.employeeTrainings[index] = response.data;
                    }

                    // Update current if it's the same
                    if (this.currentEmployeeTraining?.id === parseInt(id)) {
                        this.currentEmployeeTraining = response.data;
                    }

                    // Update statistics
                    this.updateStatistics();

                    return response.data;
                } else {
                    throw new Error(response.message || 'Failed to update employee training');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Delete employee training
         */
        async deleteEmployeeTraining(id) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await employeeTrainingService.deleteEmployeeTraining(id);

                if (response.success) {
                    // Remove from list
                    this.employeeTrainings = this.employeeTrainings.filter(et => et.id !== parseInt(id));
                    this.total -= 1;

                    // Clear current if it's the same
                    if (this.currentEmployeeTraining?.id === parseInt(id)) {
                        this.currentEmployeeTraining = null;
                    }

                    // Update statistics
                    this.updateStatistics();

                    return true;
                } else {
                    throw new Error(response.message || 'Failed to delete employee training');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Delete selected employee trainings
         */
        async deleteSelectedEmployeeTrainings(ids) {
            this.submitting = true;
            this.error = null;

            try {
                await employeeTrainingService.deleteSelectedEmployeeTrainings(ids);

                // Remove from list
                this.employeeTrainings = this.employeeTrainings.filter(et => !ids.includes(et.id));
                this.total -= ids.length;

                // Update statistics
                this.updateStatistics();

                return true;
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Map employee training data from API response
         */
        mapEmployeeTrainingData(data) {
            return data.map(et => ({
                key: et.id,
                id: et.id,
                employee_id: et.employee_id,
                employee: et.employee || null,
                employee_name: et.employee ? `${et.employee.first_name_en || ''} ${et.employee.last_name_en || ''}`.trim() : 'N/A',
                staff_id: et.employee?.staff_id || 'N/A',
                training_id: et.training_id,
                training: et.training || null,
                training_title: et.training?.title || 'N/A',
                organizer: et.training?.organizer || 'N/A',
                start_date: et.training?.start_date || null,
                end_date: et.training?.end_date || null,
                status: et.status || 'Pending',
                created_at: et.created_at,
                updated_at: et.updated_at,
                created_by: et.created_by || 'N/A',
                updated_by: et.updated_by || 'N/A'
            }));
        },

        /**
         * Update local statistics
         */
        updateStatistics() {
            this.statistics.total = this.total;

            let completed = 0;
            let inProgress = 0;
            let pending = 0;
            let cancelled = 0;

            this.employeeTrainings.forEach(et => {
                switch (et.status) {
                    case 'Completed':
                        completed++;
                        break;
                    case 'In Progress':
                        inProgress++;
                        break;
                    case 'Pending':
                        pending++;
                        break;
                    case 'Cancelled':
                        cancelled++;
                        break;
                }
            });

            this.statistics.completed = completed;
            this.statistics.inProgress = inProgress;
            this.statistics.pending = pending;
            this.statistics.cancelled = cancelled;
        },

        /**
         * Update filters
         */
        updateFilters(newFilters) {
            this.filteredInfo = { ...this.filteredInfo, ...newFilters };
        },

        /**
         * Reset filters
         */
        clearFilters() {
            this.filteredInfo = {};
            this.currentPage = 1;
        },

        /**
         * Clear all filters and sorting
         */
        clearAll() {
            this.filteredInfo = {};
            this.sortedInfo = {};
            this.searchText = '';
            this.currentPage = 1;
        },

        /**
         * Update pagination
         */
        updatePagination(pagination) {
            if (pagination.current) this.currentPage = pagination.current;
            if (pagination.pageSize) this.pageSize = pagination.pageSize;
        },

        /**
         * Update sorting info
         */
        updateSorting(sorter) {
            this.sortedInfo = sorter || {};
        },

        /**
         * Clear error state
         */
        clearError() {
            this.error = null;
        },

        /**
         * Clear current employee training
         */
        clearCurrentEmployeeTraining() {
            this.currentEmployeeTraining = null;
        }
    }
});



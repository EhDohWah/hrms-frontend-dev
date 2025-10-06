import { defineStore } from 'pinia';
import { travelRequestService } from '@/services/travelRequest.service';

export const useTravelRequestStore = defineStore('travelRequest', {
    state: () => ({
        // Data state
        travelRequests: [],
        currentTravelRequest: null,
        statistics: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
        },
        options: {
            transportation: [
                { value: 'smru_vehicle', label: 'SMRU vehicle' },
                { value: 'public_transportation', label: 'Public transportation' },
                { value: 'air', label: 'Air' },
                { value: 'other', label: 'Other please specify' }
            ],
            accommodation: [
                { value: 'smru_arrangement', label: 'SMRU arrangement' },
                { value: 'self_arrangement', label: 'Self arrangement' },
                { value: 'other', label: 'Other please specify' }
            ]
        },

        // UI state
        loading: false,
        submitting: false,
        searchLoading: false,
        error: null,

        // Pagination state (following employees-list pattern)
        currentPage: 1,
        pageSize: 10,
        total: 0,

        // Filter and sorting state
        filteredInfo: {},
        sortedInfo: {},
        searchStaffId: '',

        // Cache timestamp for options (24 hours)
        optionsTimestamp: null
    }),

    getters: {
        /**
         * Get travel request by ID
         */
        getTravelRequestById: (state) => (id) => {
            return state.travelRequests.find(request => request.id === parseInt(id));
        },

        /**
         * Get filtered travel requests (server-side filtering)
         */
        filteredTravelRequests: (state) => {
            return state.travelRequests;
        },

        /**
         * Check if options are loaded and not expired
         */
        hasOptions: (state) => {
            if (!state.optionsTimestamp) return false;
            const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - state.optionsTimestamp <= expirationTime;
        },

        /**
         * Get transportation options
         */
        transportationOptions: (state) => state.options.transportation,

        /**
         * Get accommodation options
         */
        accommodationOptions: (state) => state.options.accommodation
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
                if (this.filteredInfo.department && this.filteredInfo.department.length > 0) {
                    params.filter_department = this.filteredInfo.department.join(',');
                }
                if (this.filteredInfo.transportation && this.filteredInfo.transportation.length > 0) {
                    params.filter_transportation = this.filteredInfo.transportation.join(',');
                }
                if (this.filteredInfo.destination && this.filteredInfo.destination.length > 0) {
                    params.filter_destination = this.filteredInfo.destination.join(',');
                }
            }

            return params;
        },

        /**
         * Map frontend field names to backend field names
         */
        mapSortField(field) {
            const fieldMapping = {
                'employee': 'employee_id',
                'department': 'department_id',
                'destination': 'destination',
                'start_date': 'start_date',
                'to_date': 'to_date',
                'transportation': 'transportation',
                'accommodation': 'accommodation',
                'created_at': 'created_at'
            };
            return fieldMapping[field] || field;
        },

        /**
         * Fetch travel requests with pagination and filtering
         */
        async fetchTravelRequests(params = {}) {
            this.loading = true;
            this.error = null;

            try {
                const queryParams = {
                    page: params.page || this.currentPage || 1,
                    per_page: params.per_page || this.pageSize,
                    ...params
                };

                const response = await travelRequestService.getTravelRequests(queryParams);

                if (response.success && response.data) {
                    this.travelRequests = this.mapTravelRequestData(response.data);

                    // Update pagination properties from server response
                    if (response.pagination) {
                        this.total = response.pagination.total;
                        this.currentPage = response.pagination.current_page;
                        this.pageSize = response.pagination.per_page;
                    } else {
                        this.total = response.data.length;
                        this.currentPage = 1;
                    }

                    // Update statistics from server response
                    if (response.statistics) {
                        this.statistics = {
                            total: response.statistics.total || 0,
                            pending: response.statistics.pending || 0,
                            approved: response.statistics.approved || 0,
                            rejected: response.statistics.rejected || 0
                        };
                    } else {
                        this.updateLocalStatistics();
                    }
                } else {
                    this.travelRequests = [];
                    this.total = 0;
                    throw new Error(response.message || 'Failed to fetch travel requests');
                }
            } catch (error) {
                console.error('Error fetching travel requests:', error);
                this.error = error.message;
                this.travelRequests = [];
                this.total = 0;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Search travel requests by employee staff ID
         */
        async searchTravelRequestsByStaffId(staffId) {
            if (!staffId || staffId.trim() === '') {
                throw new Error('Please enter a staff ID to search');
            }

            this.searchLoading = true;
            try {
                const response = await travelRequestService.searchTravelRequestsByEmployee(staffId);

                if (response.success === true && response.data) {
                    const travelRequestArray = Array.isArray(response.data) ? response.data : [response.data];
                    const formattedTravelRequests = this.mapTravelRequestData(travelRequestArray);

                    this.travelRequests = formattedTravelRequests;
                    this.total = 1;
                    this.currentPage = 1;
                    return response;
                } else {
                    // Handle API response with success: false (404 - Travel request not found)
                    this.travelRequests = [];
                    this.total = 0;
                    throw new Error(response.message || 'No travel requests found for this staff ID');
                }
            } catch (error) {
                console.error('Error searching travel requests by staff ID:', error);
                this.travelRequests = [];
                this.total = 0;
                throw error;
            } finally {
                this.searchLoading = false;
            }
        },

        /**
         * Fetch single travel request
         */
        async fetchTravelRequest(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await travelRequestService.getTravelRequest(id);

                if (response.success) {
                    this.currentTravelRequest = response.data;

                    // Update in list if exists
                    const index = this.travelRequests.findIndex(r => r.id === parseInt(id));
                    if (index !== -1) {
                        this.travelRequests[index] = response.data;
                    }

                    return response.data;
                } else {
                    throw new Error(response.message || 'Failed to fetch travel request');
                }
            } catch (error) {
                this.error = error.message;
                this.currentTravelRequest = null;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Create new travel request
         */
        async createTravelRequest(data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await travelRequestService.createTravelRequest(data);

                if (response.success) {
                    // Add to list if we're on the first page
                    if (this.currentPage === 1) {
                        this.travelRequests.unshift(response.data);
                        this.total += 1;
                    }

                    return response.data;
                } else {
                    throw new Error(response.message || 'Failed to create travel request');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Update travel request
         */
        async updateTravelRequest(id, data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await travelRequestService.updateTravelRequest(id, data);

                if (response.success) {
                    // Update in list
                    const index = this.travelRequests.findIndex(r => r.id === parseInt(id));
                    if (index !== -1) {
                        this.travelRequests[index] = response.data;
                    }

                    // Update current if it's the same
                    if (this.currentTravelRequest?.id === parseInt(id)) {
                        this.currentTravelRequest = response.data;
                    }

                    return response.data;
                } else {
                    throw new Error(response.message || 'Failed to update travel request');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Delete travel request
         */
        async deleteTravelRequest(id) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await travelRequestService.deleteTravelRequest(id);

                if (response.success) {
                    // Remove from list
                    this.travelRequests = this.travelRequests.filter(r => r.id !== parseInt(id));
                    this.total -= 1;

                    // Clear current if it's the same
                    if (this.currentTravelRequest?.id === parseInt(id)) {
                        this.currentTravelRequest = null;
                    }

                    return true;
                } else {
                    throw new Error(response.message || 'Failed to delete travel request');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Delete selected travel requests
         */
        async deleteSelectedTravelRequests(ids) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await travelRequestService.deleteSelectedTravelRequests(ids);

                if (response.success) {
                    // Remove from list
                    this.travelRequests = this.travelRequests.filter(r => !ids.includes(r.id));
                    this.total -= ids.length;

                    return true;
                } else {
                    throw new Error(response.message || 'Failed to delete travel requests');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Fetch transportation and accommodation options
         */
        async fetchOptions() {
            // Skip if options already loaded and not expired
            if (this.hasOptions) {
                return this.options;
            }

            try {
                const response = await travelRequestService.getOptions();

                if (response.success) {
                    this.options = response.data;
                    this.optionsTimestamp = Date.now();
                } else {
                    console.warn('Failed to fetch options from API, using defaults');
                    // Keep default options set in state
                    this.optionsTimestamp = Date.now();
                }

                return this.options;
            } catch (error) {
                console.error('Failed to fetch travel request options:', error);
                // Keep default options set in state
                this.optionsTimestamp = Date.now();
                return this.options;
            }
        },

        /**
         * Map travel request data from API response
         */
        mapTravelRequestData(data) {
            return data.map(request => ({
                key: request.id,
                id: request.id,
                employee_id: request.employee_id,
                employee: request.employee || null,
                department_id: request.department_id,
                department: request.department || null,
                position_id: request.position_id,
                position: request.position || null,
                destination: request.destination || 'N/A',
                start_date: request.start_date || null,
                to_date: request.to_date || null,
                purpose: request.purpose || 'N/A',
                grant: request.grant || 'N/A',
                transportation: request.transportation || 'N/A',
                transportation_other_text: request.transportation_other_text || '',
                accommodation: request.accommodation || 'N/A',
                accommodation_other_text: request.accommodation_other_text || '',
                remarks: request.remarks || '',
                // Approval fields (matching backend schema - Version 4.2)
                request_by_date: request.request_by_date || null,
                supervisor_approved: request.supervisor_approved || false,
                supervisor_approved_date: request.supervisor_approved_date || null,
                hr_acknowledged: request.hr_acknowledged || false,
                hr_acknowledgement_date: request.hr_acknowledgement_date || null,
                created_at: request.created_at,
                updated_at: request.updated_at,
                created_by: request.created_by || null,
                updated_by: request.updated_by || null
            }));
        },

        /**
         * Update local statistics (fallback when not provided by server)
         */
        updateLocalStatistics() {
            this.statistics.total = this.total;
            // For simple CRUD, all travel requests are considered active
            this.statistics.pending = 0;
            this.statistics.approved = this.travelRequests.length;
            this.statistics.rejected = 0;
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
            this.searchStaffId = '';
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
         * Clear current travel request
         */
        clearCurrentTravelRequest() {
            this.currentTravelRequest = null;
        }
    }
});

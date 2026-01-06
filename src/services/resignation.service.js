import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { dataMapper, filterUtils } from '@/utils/resignation.utils';

/**
 * Resignation Service
 * Handles all resignation-related API operations with proper pagination, filtering, and data transformation
 * Uses the centralized apiService for consistent error handling, authentication, and response processing
 */
class ResignationService {
    /**
     * Get paginated list of resignations with filtering and sorting
     * @param {Object} filters - Filter parameters
     * @returns {Promise<Object>} API response with transformed data
     */
    async getResignations(filters = {}) {
        try {
            const queryParams = filterUtils.buildQueryParams(filters);
            const queryString = new URLSearchParams(queryParams).toString();
            const endpoint = queryString ? `${API_ENDPOINTS.RESIGNATION.LIST}?${queryString}` : API_ENDPOINTS.RESIGNATION.LIST;

            const response = await apiService.get(endpoint);

            // Transform the response data
            if (response.success && response.data) {
                const transformedData = Array.isArray(response.data)
                    ? response.data.map(item => dataMapper.mapResignation(item))
                    : response.data;

                return {
                    ...response,
                    data: transformedData
                };
            }

            return response;
        } catch (error) {
            console.error('Error fetching resignations:', error);
            throw error;
        }
    }

    /**
     * Create a new resignation
     * @param {Object} data - Resignation data
     * @returns {Promise<Object>} API response with transformed data
     */
    async createResignation(data) {
        try {
            // Transform data to backend format
            const backendData = dataMapper.mapResignationForAPI(data);
            const response = await apiService.post(API_ENDPOINTS.RESIGNATION.CREATE, backendData);

            if (response.success && response.data) {
                return {
                    ...response,
                    data: dataMapper.mapResignation(response.data)
                };
            }

            return response;
        } catch (error) {
            console.error('Error creating resignation:', error);
            throw error;
        }
    }

    /**
     * Update an existing resignation
     * @param {number} id - Resignation ID
     * @param {Object} data - Updated resignation data
     * @returns {Promise<Object>} API response with transformed data
     */
    async updateResignation(id, data) {
        try {
            // Transform data to backend format
            const backendData = dataMapper.mapResignationForAPI(data);
            const endpoint = API_ENDPOINTS.RESIGNATION.UPDATE.replace(':id', id);
            const response = await apiService.put(endpoint, backendData);

            if (response.success && response.data) {
                return {
                    ...response,
                    data: dataMapper.mapResignation(response.data)
                };
            }

            return response;
        } catch (error) {
            console.error('Error updating resignation:', error);
            throw error;
        }
    }

    /**
     * Delete a resignation
     * @param {number} id - Resignation ID
     * @returns {Promise<Object>} API response
     */
    async deleteResignation(id) {
        try {
            const endpoint = API_ENDPOINTS.RESIGNATION.DELETE.replace(':id', id);
            const response = await apiService.delete(endpoint);
            return response;
        } catch (error) {
            console.error('Error deleting resignation:', error);
            throw error;
        }
    }

    /**
     * Get resignation details by ID
     * @param {number} id - Resignation ID
     * @returns {Promise<Object>} API response with transformed data
     */
    async getResignationDetails(id) {
        try {
            const endpoint = API_ENDPOINTS.RESIGNATION.DETAILS.replace(':id', id);
            const response = await apiService.get(endpoint);

            if (response.success && response.data) {
                return {
                    ...response,
                    data: dataMapper.mapResignation(response.data)
                };
            }

            return response;
        } catch (error) {
            console.error('Error fetching resignation details:', error);
            throw error;
        }
    }

    /**
     * Acknowledge a resignation (update acknowledgement status)
     * @param {number} id - Resignation ID
     * @param {Object} acknowledgementData - Acknowledgement data
     * @returns {Promise<Object>} API response with transformed data
     */
    async acknowledgeResignation(id, acknowledgementData) {
        try {
            const backendData = dataMapper.mapAcknowledgementForAPI(acknowledgementData);
            const endpoint = API_ENDPOINTS.RESIGNATION.ACKNOWLEDGE.replace(':id', id);
            const response = await apiService.put(endpoint, backendData);

            if (response.success && response.data) {
                return {
                    ...response,
                    data: dataMapper.mapResignation(response.data)
                };
            }

            return response;
        } catch (error) {
            console.error('Error acknowledging resignation:', error);
            throw error;
        }
    }

    /**
     * Bulk delete resignations
     * @param {Array} ids - Array of resignation IDs
     * @returns {Promise<Object>} API response
     */
    async bulkDeleteResignations(ids) {
        try {
            const response = await apiService.post(API_ENDPOINTS.RESIGNATION.BULK_DELETE, { ids });
            return response;
        } catch (error) {
            console.error('Error bulk deleting resignations:', error);
            throw error;
        }
    }

    /**
     * Get resignation statistics
     * @param {Object} filters - Filter parameters for statistics
     * @returns {Promise<Object>} API response with statistics
     */
    async getResignationStatistics(filters = {}) {
        try {
            // For now, we'll fetch all resignations and calculate stats on frontend
            // In production, this should be a dedicated statistics endpoint
            const response = await this.getResignations(filters);

            if (response.success && response.data) {
                const { statsUtils } = await import('@/utils/resignation.utils');
                const stats = statsUtils.calculateStats(response.data);

                return {
                    success: true,
                    data: stats
                };
            }

            return response;
        } catch (error) {
            console.error('Error fetching resignation statistics:', error);
            throw error;
        }
    }

    /**
     * Export resignations data
     * @param {string} format - Export format (pdf, excel, csv)
     * @param {Object} filters - Filter parameters
     * @returns {Promise<Blob>} Export file blob
     */
    async exportResignations(format, filters = {}) {
        try {
            // Note: This would need corresponding backend endpoints
            const queryParams = filterUtils.buildQueryParams({
                ...filters,
                format
            });
            const queryString = new URLSearchParams(queryParams).toString();
            const endpoint = `${API_ENDPOINTS.RESIGNATION.LIST}/export?${queryString}`;

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    ...apiService.headers,
                    'Accept': format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            return await response.blob();
        } catch (error) {
            console.error('Error exporting resignations:', error);
            throw error;
        }
    }

    /**
     * Get employees for resignation assignment
     * @param {string} query - Search query
     * @returns {Promise<Object>} API response with employee list
     */
    async searchEmployees(query = '') {
        try {
            // This would use the existing employee search endpoint
            const endpoint = `${API_ENDPOINTS.EMPLOYEE.TREE_SEARCH}?search=${encodeURIComponent(query)}`;
            const response = await apiService.get(endpoint);

            if (response.success && response.data) {
                // Transform employee data for dropdown usage
                const transformedData = response.data.map(employee => ({
                    id: employee.id,
                    staffId: employee.staff_id,
                    name: `${employee.first_name_en} ${employee.last_name_en}`.trim(),
                    organization: employee.organization,
                    department: employee.employment?.department?.name,
                    position: employee.employment?.position?.title,
                    email: employee.email,
                    mobilePhone: employee.mobile_phone
                }));

                return {
                    ...response,
                    data: transformedData
                };
            }

            return response;
        } catch (error) {
            console.error('Error searching employees:', error);
            throw error;
        }
    }

    /**
     * Get departments for filtering
     * @returns {Promise<Object>} API response with departments
     */
    async getDepartments() {
        try {
            // This would use the existing lookup endpoint for departments
            const endpoint = `${API_ENDPOINTS.LOOKUP.BY_TYPE}/department`;
            const response = await apiService.get(endpoint);

            if (response.success && response.data) {
                const transformedData = response.data.map(dept => ({
                    id: dept.id,
                    name: dept.value,
                    code: dept.code
                }));

                return {
                    ...response,
                    data: transformedData
                };
            }

            return response;
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error;
        }
    }

    /**
     * Get positions for filtering
     * @param {number} departmentId - Department ID filter
     * @returns {Promise<Object>} API response with positions
     */
    async getPositions(departmentId = null) {
        try {
            let endpoint = API_ENDPOINTS.DEPARTMENT_POSITION.LIST;
            if (departmentId) {
                endpoint += `?department_id=${departmentId}`;
            }

            const response = await apiService.get(endpoint);

            if (response.success && response.data) {
                const transformedData = response.data.map(position => ({
                    id: position.id,
                    title: position.position,
                    department: position.department,
                    departmentId: position.department_id
                }));

                return {
                    ...response,
                    data: transformedData
                };
            }

            return response;
        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }

    /**
     * Validate resignation data before submission
     * @param {Object} data - Resignation data to validate
     * @returns {Promise<Object>} Validation result
     */
    async validateResignation(data) {
        try {
            const { validationUtils } = await import('@/utils/resignation.utils');
            return validationUtils.validateResignation(data);
        } catch (error) {
            console.error('Error validating resignation:', error);
            throw error;
        }
    }
}

export const resignationService = new ResignationService();

import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class RoleService extends BaseService {
    /**
     * Get all roles with optional filtering
     * @param {Object} params - Query parameters
     * @returns {Promise} Roles list
     */
    async getRoles(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = queryString ? `${API_ENDPOINTS.ROLE.LIST}?${queryString}` : API_ENDPOINTS.ROLE.LIST;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch roles'
        );
    }

    /**
     * Get role details by ID
     * @param {number|string} id - Role ID
     * @returns {Promise} Role details
     */
    async getRoleDetails(id) {
        const endpoint = API_ENDPOINTS.ROLE.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch role ${id}`
        );
    }

    /**
     * Create a new role
     * @param {Object} data - Role data (name required)
     * @returns {Promise} Created role
     */
    async createRole(data) {
        // Validate required fields
        const validation = this.validateRequiredFields(data, ['name']);
        if (!validation.isValid) {
            throw this.createValidationError(validation.errors, 'Role name is required');
        }

        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.ROLE.CREATE, data),
            'create role'
        );
    }

    /**
     * Update an existing role
     * @param {number|string} id - Role ID
     * @param {Object} data - Role data to update
     * @returns {Promise} Updated role
     */
    async updateRole(id, data) {
        const endpoint = API_ENDPOINTS.ROLE.UPDATE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, data),
            `update role ${id}`
        );
    }

    /**
     * Delete a role
     * @param {number|string} id - Role ID
     * @returns {Promise} Deletion result
     */
    async deleteRole(id) {
        const endpoint = API_ENDPOINTS.ROLE.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            `delete role ${id}`
        );
    }

    /**
     * Get permissions for a specific role
     * @param {number|string} id - Role ID
     * @returns {Promise} Role permissions
     */
    async getRolePermissions(id) {
        const endpoint = API_ENDPOINTS.ROLE.GET_PERMISSIONS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch permissions for role ${id}`
        );
    }

    /**
     * Update permissions for a role
     * @param {number|string} id - Role ID
     * @param {Array} permissions - Array of permission names
     * @returns {Promise} Updated permissions
     */
    async updateRolePermissions(id, permissions) {
        const endpoint = API_ENDPOINTS.ROLE.UPDATE_PERMISSIONS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, { permissions }),
            `update permissions for role ${id}`
        );
    }
}

export const roleService = new RoleService(); 
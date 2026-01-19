import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class PermissionService {
    // Get all permissions
    async getPermissions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${API_ENDPOINTS.PERMISSION.LIST}?${queryString}` : API_ENDPOINTS.PERMISSION.LIST;
        return await apiService.get(endpoint);
    }

    // Get permission details
    async getPermissionDetails(id) {
        const endpoint = API_ENDPOINTS.PERMISSION.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }

    // Create permission
    async createPermission(data) {
        return await apiService.post(API_ENDPOINTS.PERMISSION.CREATE, data);
    }

    // Update permission
    async updatePermission(id, data) {
        const endpoint = API_ENDPOINTS.PERMISSION.UPDATE.replace(':id', id);
        return await apiService.put(endpoint, data);
    }

    // Delete permission
    async deletePermission(id) {
        const endpoint = API_ENDPOINTS.PERMISSION.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    // Get permission modules
    async getPermissionModules() {
        return await apiService.get(API_ENDPOINTS.PERMISSION.MODULES);
    }

    // Generate module permissions
    async generatePermissions(data) {
        return await apiService.post(API_ENDPOINTS.PERMISSION.GENERATE, data);
    }

    // Check if user has permission
    hasPermission(permissionName) {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.permissions?.some(permission => permission.name === permissionName) || false;
        } catch (error) {
            console.error('Error checking permission:', error);
            return false;
        }
    }

    // Check if user has any of the permissions
    hasAnyPermission(permissionNames) {
        if (!permissionNames || permissionNames.length === 0) return true;
        return permissionNames.some(name => this.hasPermission(name));
    }

    // Check if user has all permissions
    hasAllPermissions(permissionNames) {
        if (!permissionNames || permissionNames.length === 0) return true;
        return permissionNames.every(name => this.hasPermission(name));
    }

    // Get user permissions
    getUserPermissions() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.permissions || [];
        } catch (error) {
            console.error('Error getting user permissions:', error);
            return [];
        }
    }
}

export const permissionService = new PermissionService();
// admin.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class AdminService {
  // User management
  async getAllUsers() {
    return await apiService.get(API_ENDPOINTS.ADMIN.USERS.LIST);
  }

  async createUser(userData) {
    // Check if userData is already FormData
    if (userData instanceof FormData) {
      return await apiService.postFormData(API_ENDPOINTS.ADMIN.USERS.CREATE, userData);
    }
    
    // Convert userData to FormData if it's not already
    const formData = new FormData();
    for (const key in userData) {
      if (Object.prototype.hasOwnProperty.call(userData, key)) {
        formData.append(key, userData[key]);
      }
    }
    return await apiService.postFormData(API_ENDPOINTS.ADMIN.USERS.CREATE, formData);
  }

    async updateUser(id, userData) {
    const endpoint = API_ENDPOINTS.ADMIN.USERS.UPDATE.replace(':id', id);
    
    // If userData is not FormData, convert it to a regular object for PUT request
    if (!(userData instanceof FormData)) {
      return await apiService.put(endpoint, userData);
    }
    
    // For FormData, we need to add a method override for PUT
    // since the backend route uses PUT but we need to send FormData
    userData.append('_method', 'PUT');
    
    // Use postFormData which will properly handle the FormData with the _method override
    return await apiService.postFormData(endpoint, userData);
  }

  async deleteUser(id) {
    const endpoint = API_ENDPOINTS.ADMIN.USERS.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  async getUserDetails(id) {
    const endpoint = API_ENDPOINTS.ADMIN.USERS.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Role management
  async getAllRoles() {
    return await apiService.get(API_ENDPOINTS.ADMIN.ROLES.LIST);
  }

  // Permission management
  async getAllPermissions() {
    return await apiService.get(API_ENDPOINTS.ADMIN.PERMISSIONS.LIST);
  }
}

export const adminService = new AdminService();
export default adminService;

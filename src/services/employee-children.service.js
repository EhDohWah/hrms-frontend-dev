import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class EmployeeChildrenService {

    // Get all employee children
    async getEmployeeChildren(params = {}) {
        return await apiService.get(API_ENDPOINTS.EMPLOYEE_CHILDREN.LIST, { params });
    }

    // Get single employee child details
    async getEmployeeChildDetails(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE_CHILDREN.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }

    // Create employee child
    async createEmployeeChild(data) {
        const formattedData = this.formatEmployeeChildData(data);
        return await apiService.post(API_ENDPOINTS.EMPLOYEE_CHILDREN.CREATE, formattedData);
    }

    // Update employee child
    async updateEmployeeChild(id, data) {
        const endpoint = API_ENDPOINTS.EMPLOYEE_CHILDREN.UPDATE.replace(':id', id);
        const formattedData = this.formatEmployeeChildData(data);
        return await apiService.put(endpoint, formattedData);
    }

    // Delete employee child
    async deleteEmployeeChild(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE_CHILDREN.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    // Helper method to format employee child data according to API schema
    formatEmployeeChildData(data) {
        return {
            employee_id: data.employee_id,
            name: data.name || data.child_name, // Support both field names
            date_of_birth: data.date_of_birth,
            created_by: data.created_by,
            updated_by: data.updated_by,
            ...data // Include any additional fields that might be passed
        };
    }
}

export const employeeChildrenService = new EmployeeChildrenService();
export default employeeChildrenService;

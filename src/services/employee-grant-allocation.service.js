import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class EmployeeGrantAllocationService {
  // Get all employee grant allocations
  async getAllEmployeeGrantAllocations() {
    return await apiService.get(API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.LIST);
  }

  // Get employee grant allocation details
  async getEmployeeGrantAllocationDetails(id) {
    const endpoint = API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Create a new employee grant allocation
  async createEmployeeGrantAllocation(data) {
    return await apiService.post(API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.CREATE, data);
  }

  // Update an existing employee grant allocation
  async updateEmployeeGrantAllocation(id, data) {
    const endpoint = API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, data);
  }

  // Delete an employee grant allocation
  async deleteEmployeeGrantAllocation(id) {
    const endpoint = API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }
}

export const employeeGrantAllocationService = new EmployeeGrantAllocationService();
export default employeeGrantAllocationService;

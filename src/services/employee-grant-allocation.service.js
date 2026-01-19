import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class EmployeeGrantAllocationService {
  // Get all employee grant allocations
  async getAllEmployeeGrantAllocations(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `${API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.LIST}?${queryParams}` : API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.LIST;
    return await apiService.get(endpoint);
  }

  // Get employee grant allocation details
  async getEmployeeGrantAllocationDetails(id) {
    const endpoint = API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Create multiple employee grant allocations
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

  // Get grant structure for UI dropdowns
  async getGrantStructure() {
    return await apiService.get(API_ENDPOINTS.EMPLOYEE_FUNDING_ALLOCATION.GRANT_STRUCTURE);
  }

  // Get all allocations for a specific employee
  async getEmployeeAllocations(employeeId) {
    const endpoint = API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.EMPLOYEE_ALLOCATIONS.replace(':employee_id', employeeId);
    return await apiService.get(endpoint);
  }

  // Bulk deactivate employee grant allocations
  async bulkDeactivateEmployeeGrantAllocations(data) {
    return await apiService.post(API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.BULK_DEACTIVATE, data);
  }

  // Update employee grant allocations
  async updateEmployeeGrantAllocations(employeeId, data) {
    const endpoint = API_ENDPOINTS.EMPLOYEE_GRANT_ALLOCATION.UPDATE_EMPLOYEE_ALLOCATIONS.replace(':employee_id', employeeId);
    return await apiService.put(endpoint, data);
  }
}

export const employeeGrantAllocationService = new EmployeeGrantAllocationService();
export default employeeGrantAllocationService;

import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class PayrollService {
  // Get employee employment details
  async getEmployeeEmploymentDetails(employeeId) {
    // build the URL with the query string
    const base = API_ENDPOINTS.PAYROLL.EMPLOYEE_EMPLOYMENT;           // "/payrolls/employee-employment"
    const url  = `${base}?employee_id=${encodeURIComponent(employeeId)}`;
    return apiService.get(url);
  }

  // Fetch all payrolls
  async getAllPayrolls() {
    return await apiService.get(API_ENDPOINTS.PAYROLL.LIST);
  }

  // Get payroll by ID
  async getPayrollById(id) {
    const endpoint = API_ENDPOINTS.PAYROLL.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Create a new payroll
  async createPayroll(payrollData) {
    return await apiService.post(API_ENDPOINTS.PAYROLL.CREATE, payrollData);
  }

  // Update an existing payroll
  async updatePayroll(id, payrollData) {
    const endpoint = API_ENDPOINTS.PAYROLL.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, payrollData);
  }

  // Delete a payroll
  async deletePayroll(id) {
    const endpoint = API_ENDPOINTS.PAYROLL.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }
}

export const payrollService = new PayrollService();

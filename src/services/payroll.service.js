import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class PayrollService {
  // Get employee employment details
  async getEmployeeEmploymentDetails(employeeId) {
    // build the URL with the query string
    const base = API_ENDPOINTS.PAYROLL.EMPLOYEE_EMPLOYMENT;           // "/payrolls/employee-employment"
    const url = `${base}?employee_id=${encodeURIComponent(employeeId)}`;
    return apiService.get(url);
  }

  // Get employee employment details with calculations (pay_period_date is optional)
  async getEmployeeEmploymentDetailsWithCalculations(employeeId, payPeriodDate = null) {
    const base = API_ENDPOINTS.PAYROLL.EMPLOYEE_EMPLOYMENT_CALCULATED;
    let url = `${base}?employee_id=${encodeURIComponent(employeeId)}`;
    if (payPeriodDate) {
      url += `&pay_period_date=${encodeURIComponent(payPeriodDate)}`;
    }
    return apiService.get(url);
  }

  // Preview advances for employee payroll
  async previewAdvances(employeeId, payPeriodDate) {
    const base = API_ENDPOINTS.PAYROLL.PREVIEW_ADVANCES;
    const url = `${base}?employee_id=${encodeURIComponent(employeeId)}&pay_period_date=${encodeURIComponent(payPeriodDate)}`;
    return apiService.get(url);
  }

  // Get payrolls with pagination, filtering, and search
  async getPayrolls(params = {}) {
    const queryParams = new URLSearchParams();

    // Add all parameters to query string
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.PAYROLL.LIST}?${queryString}` : API_ENDPOINTS.PAYROLL.LIST;

    return apiService.get(url);
  }

  // Search payrolls by staff ID or employee details
  async searchPayrolls(params = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.PAYROLL.SEARCH}?${queryString}` : API_ENDPOINTS.PAYROLL.SEARCH;

    return apiService.get(url);
  }

  // Fetch all payrolls (legacy method)
  async getAllPayrolls() {
    return await apiService.get(API_ENDPOINTS.PAYROLL.LIST);
  }

  // Get payroll by ID
  async getPayrollById(id) {
    const endpoint = API_ENDPOINTS.PAYROLL.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Get tax summary for a payroll
  async getTaxSummary(id) {
    const endpoint = API_ENDPOINTS.PAYROLL.TAX_SUMMARY.replace(':id', id);
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

  // Calculate payroll with automated tax calculations
  async calculatePayroll(calculationData) {
    return await apiService.post(API_ENDPOINTS.PAYROLL.CALCULATE, calculationData);
  }

  // Calculate payroll for multiple employees
  async bulkCalculatePayroll(bulkData) {
    return await apiService.post(API_ENDPOINTS.PAYROLL.BULK_CALCULATE, bulkData);
  }
}

export const payrollService = new PayrollService();

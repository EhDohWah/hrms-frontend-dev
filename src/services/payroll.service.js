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

    // Normalize pagination to be 1-based and valid
    if (params && Object.prototype.hasOwnProperty.call(params, 'page')) {
      const pageNum = Number(params.page);
      params.page = Number.isFinite(pageNum) && pageNum >= 1 ? pageNum : 1;
    }
    if (params && Object.prototype.hasOwnProperty.call(params, 'per_page')) {
      const perNum = Number(params.per_page);
      params.per_page = Number.isFinite(perNum) && perNum > 0 ? perNum : 10;
    }

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

    // Normalize pagination to be 1-based and valid for search too
    if (params && Object.prototype.hasOwnProperty.call(params, 'page')) {
      const pageNum = Number(params.page);
      params.page = Number.isFinite(pageNum) && pageNum >= 1 ? pageNum : 1;
    }
    if (params && Object.prototype.hasOwnProperty.call(params, 'per_page')) {
      const perNum = Number(params.per_page);
      params.per_page = Number.isFinite(perNum) && perNum > 0 ? perNum : 10;
    }

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

  // Create bulk payroll for multiple employees (old method - kept for compatibility)
  async createBulkPayroll(bulkData) {
    return await apiService.post(API_ENDPOINTS.PAYROLL.BULK_CREATE || `${API_ENDPOINTS.PAYROLL.CREATE}/bulk`, bulkData);
  }

  // ============================================
  // NEW: Bulk Payroll Creation with Real-Time Progress Tracking
  // ============================================

  /**
   * Preview bulk payroll creation (dry-run)
   * @param {Object} data - { pay_period, filters }
   * @returns {Promise} Preview data with totals and warnings
   */
  async bulkPreview(data) {
    return await apiService.post(API_ENDPOINTS.PAYROLL.BULK_PREVIEW || '/payrolls/bulk/preview', data);
  }

  /**
   * Create bulk payroll batch and start processing
   * @param {Object} data - { pay_period, filters }
   * @returns {Promise} Batch creation response with batch_id
   */
  async bulkCreate(data) {
    return await apiService.post(API_ENDPOINTS.PAYROLL.BULK_CREATE_NEW || '/payrolls/bulk/create', data);
  }

  /**
   * Get bulk payroll batch status (HTTP polling fallback)
   * @param {Number} batchId - Batch ID
   * @returns {Promise} Current batch status
   */
  async getBatchStatus(batchId) {
    const endpoint = (API_ENDPOINTS.PAYROLL.BULK_STATUS || '/payrolls/bulk/status/:batchId').replace(':batchId', batchId);
    return await apiService.get(endpoint);
  }

  /**
   * Download batch error report as CSV
   * @param {Number} batchId - Batch ID
   * @returns {Promise} Blob for CSV download
   */
  async downloadBatchErrors(batchId) {
    const endpoint = (API_ENDPOINTS.PAYROLL.BULK_ERRORS || '/payrolls/bulk/errors/:batchId').replace(':batchId', batchId);
    return await apiService.get(endpoint, { responseType: 'blob' });
  }

  /**
   * Generate payslip PDF for a specific payroll record
   * @param {Number} payrollId - Payroll record ID
   * @returns {Promise<Blob>} PDF blob that opens in a new tab
   */
  async generatePayslip(payrollId) {
    const endpoint = API_ENDPOINTS.PAYROLL.PAYSLIP.replace(':id', payrollId);
    return await apiService.get(endpoint, { responseType: 'blob' });
  }

  /**
   * Get budget history for grant-centric view
   * @param {Object} params - { start_date, end_date, organization, department, page, per_page }
   * @returns {Promise} Budget history data grouped by employee and grant allocation
   */
  async getBudgetHistory(params = {}) {
    const queryParams = new URLSearchParams();

    // Normalize pagination
    if (params && Object.prototype.hasOwnProperty.call(params, 'page')) {
      const pageNum = Number(params.page);
      params.page = Number.isFinite(pageNum) && pageNum >= 1 ? pageNum : 1;
    }
    if (params && Object.prototype.hasOwnProperty.call(params, 'per_page')) {
      const perNum = Number(params.per_page);
      params.per_page = Number.isFinite(perNum) && perNum > 0 ? perNum : 50;
    }

    // Add all parameters to query string
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.PAYROLL.BUDGET_HISTORY}?${queryString}` : API_ENDPOINTS.PAYROLL.BUDGET_HISTORY;

    return apiService.get(url);
  }
}

export const payrollService = new PayrollService();

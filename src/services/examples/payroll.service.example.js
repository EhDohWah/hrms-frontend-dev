// payroll.service.example.js
// Another example showing different usage patterns of BaseService

import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { BaseService } from '@/services/base.service';

class PayrollService extends BaseService {

    // Get payroll records with advanced filtering
    async getPayrollRecords(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.PAYROLL.LIST}${queryString ? `?${queryString}` : ''}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch payroll records'
        );
    }

    // Process payroll for a period
    async processPayroll(payrollData) {
        // Validate before processing
        const validation = this.validatePayrollData(payrollData);
        if (!validation.isValid) {
            throw this.createValidationError(validation.errors);
        }

        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.PAYROLL.PROCESS, payrollData),
            'process payroll'
        );
    }

    // Generate payroll report
    async generatePayrollReport(reportParams) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.PAYROLL.GENERATE_REPORT, reportParams),
            'generate payroll report'
        );
    }

    // Download payroll export file
    async downloadPayrollExport(exportId) {
        return await this.handleApiResponse(
            () => apiService.get(`${API_ENDPOINTS.PAYROLL.DOWNLOAD_EXPORT}/${exportId}`, {
                responseType: 'blob'
            }),
            'download payroll export'
        );
    }

    // Upload payroll import file
    async uploadPayrollImport(file) {
        const validation = this.validateFile(file, {
            maxSize: 20 * 1024 * 1024, // 20MB for larger payroll files
            allowedTypes: [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'text/csv'
            ]
        });

        if (!validation.isValid) {
            throw this.createValidationError(validation.errors);
        }

        const formData = new FormData();
        formData.append('payroll_file', file);

        return await this.handleApiResponse(
            () => apiService.postFormData(API_ENDPOINTS.PAYROLL.UPLOAD_IMPORT, formData),
            'upload payroll import'
        );
    }

    // Custom validation for payroll data
    validatePayrollData(payrollData) {
        // Required fields validation
        const requiredValidation = this.validateRequiredFields(payrollData, [
            'pay_period_start', 'pay_period_end', 'employee_ids'
        ]);

        // Custom validations
        const customErrors = {};

        if (!this.isValidDate(payrollData.pay_period_start)) {
            customErrors.pay_period_start = ['Invalid start date format'];
        }

        if (!this.isValidDate(payrollData.pay_period_end)) {
            customErrors.pay_period_end = ['Invalid end date format'];
        }

        if (payrollData.pay_period_start && payrollData.pay_period_end) {
            const startDate = new Date(payrollData.pay_period_start);
            const endDate = new Date(payrollData.pay_period_end);

            if (startDate >= endDate) {
                customErrors.pay_period_end = ['End date must be after start date'];
            }
        }

        if (!Array.isArray(payrollData.employee_ids) || payrollData.employee_ids.length === 0) {
            customErrors.employee_ids = ['At least one employee must be selected'];
        }

        return this.combineValidations([
            requiredValidation,
            { isValid: Object.keys(customErrors).length === 0, errors: customErrors }
        ]);
    }

    // Get payroll summary with error logging
    async getPayrollSummary(params = {}) {
        try {
            return await this.handleApiResponse(
                () => apiService.get(API_ENDPOINTS.PAYROLL.SUMMARY, { params }),
                'fetch payroll summary'
            );
        } catch (error) {
            this.logError(error, 'PayrollService.getPayrollSummary');
            throw error;
        }
    }

    // Bulk operations with retry
    async bulkUpdatePayrollItems(updates) {
        return await this.retryApiCall(
            () => this.handleApiResponse(
                () => apiService.put(API_ENDPOINTS.PAYROLL.BULK_UPDATE, { updates }),
                'bulk update payroll items'
            ),
            2, // fewer retries for bulk operations
            2000 // longer delay
        );
    }

    // Validate payroll period
    validatePayrollPeriod(startDate, endDate) {
        const errors = {};

        if (!this.isValidDate(startDate)) {
            errors.start_date = ['Invalid start date'];
        }

        if (!this.isValidDate(endDate)) {
            errors.end_date = ['Invalid end date'];
        }

        if (this.isValidDate(startDate) && this.isValidDate(endDate)) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const now = new Date();

            if (start >= end) {
                errors.end_date = ['End date must be after start date'];
            }

            if (end > now) {
                errors.end_date = ['End date cannot be in the future'];
            }

            // Check if period is too long (more than 1 year)
            const oneYear = 365 * 24 * 60 * 60 * 1000;
            if (end - start > oneYear) {
                errors.period = ['Payroll period cannot exceed one year'];
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export const payrollService = new PayrollService();

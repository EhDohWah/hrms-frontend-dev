import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class UploadPayrollService {
    /**
     * Upload payroll Excel file
     * @param {File} file - Excel file
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Object>} API response
     */
    async uploadPayrollData(file, onProgress = null) {
        const formData = new FormData();
        formData.append('file', file);

        const config = {};

        // Add progress tracking if callback provided
        if (onProgress) {
            config.onUploadProgress = (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            };
        }

        try {
            const response = await apiService.post(
                API_ENDPOINTS.UPLOAD.PAYROLL,
                formData,
                config
            );
            return response;
        } catch (error) {
            console.error('Error uploading payroll data:', error);
            throw error;
        }
    }

    /**
     * Download payroll import template
     * @returns {Promise<void>}
     */
    async downloadTemplate() {
        try {
            // Get blob response directly
            const blob = await apiService.get(
                API_ENDPOINTS.UPLOAD.PAYROLL_TEMPLATE,
                { responseType: 'blob' }
            );

            // Create blob link to download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            link.setAttribute('download', `payroll_import_template_${timestamp}.xlsx`);
            
            // Append to html link element page
            document.body.appendChild(link);
            
            // Start download
            link.click();
            
            // Clean up and remove the link
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            console.error('Error downloading template:', error);
            throw error;
        }
    }

    /**
     * Download employee funding allocations reference list (contains Funding Allocation IDs for payroll imports)
     * @returns {Promise<void>}
     */
    async downloadFundingAllocationsReference() {
        try {
            const blob = await apiService.get(
                API_ENDPOINTS.UPLOAD.EMPLOYEE_FUNDING_ALLOCATIONS_REFERENCE,
                { responseType: 'blob' }
            );

            // Create blob link to download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            link.setAttribute('download', `employee_funding_allocations_reference_${timestamp}.xlsx`);
            
            // Append to html link element page
            document.body.appendChild(link);
            
            // Start download
            link.click();
            
            // Clean up and remove the link
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            console.error('Error downloading funding allocations reference:', error);
            throw error;
        }
    }

    /**
     * Validate payroll data before upload (optional client-side validation)
     * @param {File} file - File to validate
     * @returns {Object} Validation result
     */
    validateFile(file) {
        const errors = [];

        // Check file type
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

        if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
            errors.push('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            errors.push('File size exceeds 10MB limit');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export const uploadPayrollService = new UploadPayrollService();
























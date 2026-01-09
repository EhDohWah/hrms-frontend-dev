import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class UploadEmploymentService {
    /**
     * Upload employment Excel file
     * @param {File} file - Excel file
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Object>} API response
     */
    async uploadEmploymentData(file, onProgress = null) {
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
                API_ENDPOINTS.UPLOAD.EMPLOYMENT,
                formData,
                config
            );
            return response;
        } catch (error) {
            console.error('Error uploading employment data:', error);
            throw error;
        }
    }

    /**
     * Download employment import template
     * @returns {Promise<void>}
     */
    async downloadTemplate() {
        try {
            const response = await apiService.get(
                API_ENDPOINTS.UPLOAD.EMPLOYMENT_TEMPLATE,
                { responseType: 'blob' }
            );

            // Create a URL for the blob and trigger download
            const blob = response.data || response;
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'employment-import-template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading template:', error);
            throw error;
        }
    }

    /**
     * Validate employment data before upload (optional client-side validation)
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

export const uploadEmploymentService = new UploadEmploymentService();





























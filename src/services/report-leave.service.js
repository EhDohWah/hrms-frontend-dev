import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportLeaveService {
    /**
 * Generate a PDF leave report for a date range
 * 
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} workLocation - Work location (required)
 * @param {string} department - Department filter (required)
 * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
 * @throws {Error} - If there's a server error or missing required parameters
 */
    async generateLeaveReportPDF(startDate, endDate, workLocation, department) {
        try {
            // Validate required parameters
            if (!workLocation) {
                throw new Error('Work location is required for generating leave report');
            }
            if (!department) {
                throw new Error('Department is required for generating leave report');
            }

            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.LEAVE_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getLeaveReportPdf(startDate, endDate, workLocation, department, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating leave report PDF:', error);
            throw error;
        }
    }

    /**
 * Generate an Excel leave report for a date range
 * 
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} workLocation - Work location (required)
 * @param {string} department - Department filter (required)
 * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
 * @throws {Error} - If there's a server error or missing required parameters
 */
    async generateLeaveReportExcel(startDate, endDate, workLocation, department) {
        try {
            // Validate required parameters
            if (!workLocation) {
                throw new Error('Work location is required for generating leave report');
            }
            if (!department) {
                throw new Error('Department is required for generating leave report');
            }

            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.LEAVE_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getLeaveReportExcel(startDate, endDate, workLocation, department, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating leave report Excel:', error);
            throw error;
        }
    }

    /**
 * Generate a CSV leave report for a date range
 * 
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} workLocation - Work location (required)
 * @param {string} department - Department filter (required)
 * @returns {Promise<Blob>} - Returns a CSV blob that can be downloaded
 * @throws {Error} - If there's a server error or missing required parameters
 */
    async generateLeaveReportCSV(startDate, endDate, workLocation, department) {
        try {
            // Validate required parameters
            if (!workLocation) {
                throw new Error('Work location is required for generating leave report');
            }
            if (!department) {
                throw new Error('Department is required for generating leave report');
            }

            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.LEAVE_EXPORT_CSV}?ts=${timestamp}`;

            const csvBlob = await apiService.getLeaveReportCsv(startDate, endDate, workLocation, department, endpoint);
            return csvBlob;
        } catch (error) {
            console.error('Error generating leave report CSV:', error);
            // Fallback to Excel if CSV endpoint is not available
            console.warn('CSV endpoint not available, falling back to Excel export');
            return await this.generateLeaveReportExcel(startDate, endDate, workLocation, department);
        }
    }
}

export const reportLeaveService = new ReportLeaveService();

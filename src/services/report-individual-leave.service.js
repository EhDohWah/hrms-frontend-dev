import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportIndividualLeaveService {
    /**
     * Generate a PDF individual leave request report for a date range and staff ID
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @param {string} staffId - Staff ID filter (required for individual report)
     * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
     * @throws {Error} - If there's a server error
     */
    async generateIndividualLeaveReportPDF(startDate, endDate, staffId) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.INDIVIDUAL_LEAVE_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getIndividualLeaveReportPdf(startDate, endDate, staffId, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating individual leave report PDF:', error);
            throw error;
        }
    }

    /**
     * Generate an Excel individual leave request report for a date range and staff ID
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @param {string} staffId - Staff ID filter (required for individual report)
     * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateIndividualLeaveReportExcel(startDate, endDate, staffId) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.INDIVIDUAL_LEAVE_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getIndividualLeaveReportExcel(startDate, endDate, staffId, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating individual leave report Excel:', error);
            throw error;
        }
    }

    /**
     * Generate a CSV individual leave request report for a date range and staff ID
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @param {string} staffId - Staff ID filter (required for individual report)
     * @returns {Promise<Blob>} - Returns a CSV blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateIndividualLeaveReportCSV(startDate, endDate, staffId) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.INDIVIDUAL_LEAVE_EXPORT_CSV}?ts=${timestamp}`;

            const csvBlob = await apiService.getIndividualLeaveReportCsv(startDate, endDate, staffId, endpoint);
            return csvBlob;
        } catch (error) {
            console.error('Error generating individual leave report CSV:', error);
            // Fallback to Excel if CSV endpoint is not available
            console.warn('CSV endpoint not available, falling back to Excel export');
            return await this.generateIndividualLeaveReportExcel(startDate, endDate, staffId);
        }
    }
}

export const reportIndividualLeaveService = new ReportIndividualLeaveService();

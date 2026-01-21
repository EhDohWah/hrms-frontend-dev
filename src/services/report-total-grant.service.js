import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportTotalGrantService {
    /**
     * Generate a PDF total grant report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
     * @throws {Error} - If there's a server error
     */
    async generateTotalGrantReportPDF(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.TOTAL_GRANT_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getTotalGrantReportPdf(startDate, endDate, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating total grant report PDF:', error);
            throw error;
        }
    }

    /**
     * Generate an Excel total grant report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateTotalGrantReportExcel(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.TOTAL_GRANT_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getTotalGrantReportExcel(startDate, endDate, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating total grant report Excel:', error);
            throw error;
        }
    }
}

export const reportTotalGrantService = new ReportTotalGrantService();

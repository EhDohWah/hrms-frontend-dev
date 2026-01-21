import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportGrantHeadcountService {
    /**
     * Generate a PDF grant headcount report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
     * @throws {Error} - If there's a server error
     */
    async generateGrantHeadcountReportPDF(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.GRANT_HEADCOUNT_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getGrantHeadcountReportPdf(startDate, endDate, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating grant headcount report PDF:', error);
            throw error;
        }
    }

    /**
     * Generate an Excel grant headcount report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateGrantHeadcountReportExcel(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.GRANT_HEADCOUNT_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getGrantHeadcountReportExcel(startDate, endDate, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating grant headcount report Excel:', error);
            throw error;
        }
    }
}

export const reportGrantHeadcountService = new ReportGrantHeadcountService();

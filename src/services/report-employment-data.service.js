import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportEmploymentDataService {
    /**
     * Generate a PDF employment data report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
     * @throws {Error} - If there's a server error
     */
    async generateEmploymentDataReportPDF(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.EMPLOYMENT_DATA_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getEmploymentDataReportPdf(startDate, endDate, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating employment data report PDF:', error);
            throw error;
        }
    }

    /**
     * Generate an Excel employment data report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateEmploymentDataReportExcel(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.EMPLOYMENT_DATA_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getEmploymentDataReportExcel(startDate, endDate, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating employment data report Excel:', error);
            throw error;
        }
    }
}

export const reportEmploymentDataService = new ReportEmploymentDataService();

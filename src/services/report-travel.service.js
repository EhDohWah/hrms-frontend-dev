import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportTravelService {
    /**
     * Generate a PDF travel report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
     * @throws {Error} - If there's a server error
     */
    async generateTravelReportPDF(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.TRAVEL_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getTravelReportPdf(startDate, endDate, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating travel report PDF:', error);
            throw error;
        }
    }

    /**
     * Generate an Excel travel report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateTravelReportExcel(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.TRAVEL_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getTravelReportExcel(startDate, endDate, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating travel report Excel:', error);
            throw error;
        }
    }

    /**
     * Generate a CSV travel report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns a CSV blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateTravelReportCSV(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.TRAVEL_EXPORT_CSV}?ts=${timestamp}`;

            const csvBlob = await apiService.getTravelReportCsv(startDate, endDate, endpoint);
            return csvBlob;
        } catch (error) {
            console.error('Error generating travel report CSV:', error);
            throw error;
        }
    }
}

export const reportTravelService = new ReportTravelService();






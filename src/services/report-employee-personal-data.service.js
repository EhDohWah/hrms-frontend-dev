import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportEmployeePersonalDataService {
    /**
     * Generate a PDF employee personal data report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
     * @throws {Error} - If there's a server error
     */
    async generateEmployeePersonalDataReportPDF(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.EMPLOYEE_PERSONAL_DATA_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getEmployeePersonalDataReportPdf(startDate, endDate, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating employee personal data report PDF:', error);
            throw error;
        }
    }

    /**
     * Generate an Excel employee personal data report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateEmployeePersonalDataReportExcel(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.EMPLOYEE_PERSONAL_DATA_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getEmployeePersonalDataReportExcel(startDate, endDate, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating employee personal data report Excel:', error);
            throw error;
        }
    }
}

export const reportEmployeePersonalDataService = new ReportEmployeePersonalDataService();

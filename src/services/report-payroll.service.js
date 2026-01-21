import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportPayrollService {
    /**
     * Generate a PDF payroll report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
     * @throws {Error} - If there's a server error
     */
    async generatePayrollReportPDF(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.PAYROLL_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getPayrollReportPdf(startDate, endDate, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating payroll report PDF:', error);
            throw error;
        }
    }

    /**
     * Generate an Excel payroll report for a date range
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generatePayrollReportExcel(startDate, endDate) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.PAYROLL_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getPayrollReportExcel(startDate, endDate, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating payroll report Excel:', error);
            throw error;
        }
    }
}

export const reportPayrollService = new ReportPayrollService();

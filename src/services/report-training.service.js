import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportTrainingService {
    /**
     * Generate a PDF training attendance report for a date range and training
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @param {string} trainingTitle - Training title filter (optional)
     * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
     * @throws {Error} - If there's a server error
     */
    async generateTrainingAttendanceReportPDF(startDate, endDate, trainingTitle = null) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.TRAINING_ATTENDANCE_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getTrainingAttendanceReportPdf(startDate, endDate, trainingTitle, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating training attendance report PDF:', error);
            throw error;
        }
    }

    /**
     * Generate an Excel training attendance report for a date range and training
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @param {string} trainingTitle - Training title filter (optional)
     * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateTrainingAttendanceReportExcel(startDate, endDate, trainingTitle = null) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.TRAINING_ATTENDANCE_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getTrainingAttendanceReportExcel(startDate, endDate, trainingTitle, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating training attendance report Excel:', error);
            throw error;
        }
    }

    /**
     * Generate a CSV training attendance report for a date range and training
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @param {string} trainingTitle - Training title filter (optional)
     * @returns {Promise<Blob>} - Returns a CSV blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateTrainingAttendanceReportCSV(startDate, endDate, trainingTitle = null) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.TRAINING_ATTENDANCE_EXPORT_CSV}?ts=${timestamp}`;

            const csvBlob = await apiService.getTrainingAttendanceReportCsv(startDate, endDate, trainingTitle, endpoint);
            return csvBlob;
        } catch (error) {
            console.error('Error generating training attendance report CSV:', error);
            throw error;
        }
    }

    /**
     * Generate a PDF employee training history report for a date range and staff ID
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @param {string} staffId - Staff ID filter (optional)
     * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
     * @throws {Error} - If there's a server error
     */
    async generateEmployeeTrainingHistoryReportPDF(startDate, endDate, staffId = null) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.EMPLOYEE_TRAINING_HISTORY_EXPORT_PDF}?ts=${timestamp}`;

            const pdfBlob = await apiService.getEmployeeTrainingHistoryReportPdf(startDate, endDate, staffId, endpoint);
            return pdfBlob;
        } catch (error) {
            console.error('Error generating employee training history report PDF:', error);
            throw error;
        }
    }

    /**
     * Generate an Excel employee training history report for a date range and staff ID
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @param {string} staffId - Staff ID filter (optional)
     * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateEmployeeTrainingHistoryReportExcel(startDate, endDate, staffId = null) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.EMPLOYEE_TRAINING_HISTORY_EXPORT_EXCEL}?ts=${timestamp}`;

            const excelBlob = await apiService.getEmployeeTrainingHistoryReportExcel(startDate, endDate, staffId, endpoint);
            return excelBlob;
        } catch (error) {
            console.error('Error generating employee training history report Excel:', error);
            throw error;
        }
    }

    /**
     * Generate a CSV employee training history report for a date range and staff ID
     * 
     * @param {string} startDate - Start date in YYYY-MM-DD format
     * @param {string} endDate - End date in YYYY-MM-DD format
     * @param {string} staffId - Staff ID filter (optional)
     * @returns {Promise<Blob>} - Returns a CSV blob that can be downloaded
     * @throws {Error} - If there's a server error
     */
    async generateEmployeeTrainingHistoryReportCSV(startDate, endDate, staffId = null) {
        try {
            // Add a cache-busting timestamp
            const timestamp = new Date().getTime();
            const endpoint = `${API_ENDPOINTS.REPORT.EMPLOYEE_TRAINING_HISTORY_EXPORT_CSV}?ts=${timestamp}`;

            const csvBlob = await apiService.getEmployeeTrainingHistoryReportCsv(startDate, endDate, staffId, endpoint);
            return csvBlob;
        } catch (error) {
            console.error('Error generating employee training history report CSV:', error);
            throw error;
        }
    }
}

export const reportTrainingService = new ReportTrainingService();

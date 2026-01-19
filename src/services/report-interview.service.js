import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportInterviewService {
  /**
   * Generate a PDF interview report for a date range
   * 
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
   * @throws {Error} - If there's a server error
   */
  async generateInterviewReportPDF(startDate, endDate) {
    try {
      // Add a cache-busting timestamp
      const timestamp = new Date().getTime();
      const endpoint = `${API_ENDPOINTS.REPORT.INTERVIEW_EXPORT_PDF}?ts=${timestamp}`;
      
      const pdfBlob = await apiService.getInterviewReportPdf(startDate, endDate, endpoint);
      return pdfBlob;
    } catch (error) {
      console.error('Error generating interview report PDF:', error);
      throw error;
    }
  }

  /**
   * Generate an Excel interview report for a date range
   * 
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Promise<Blob>} - Returns an Excel blob that can be downloaded or displayed
   * @throws {Error} - If there's a server error
   */
  async generateInterviewReportExcel(startDate, endDate) {
    try {
      // Add a cache-busting timestamp
      const timestamp = new Date().getTime();
      const endpoint = `${API_ENDPOINTS.REPORT.INTERVIEW_EXPORT_EXCEL}?ts=${timestamp}`;
      
      const excelBlob = await apiService.getInterviewReportExcel(startDate, endDate, endpoint);
      return excelBlob;
    } catch (error) {
      console.error('Error generating interview report Excel:', error);
      throw error;
    }
  }
}

export const reportInterviewService = new ReportInterviewService();

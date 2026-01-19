import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class ReportJobOfferService {
  /**
   * Generate a PDF job offer report for a date range
   * 
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
   * @throws {Error} - If there's a server error
   */
  async generateJobOfferReportPDF(startDate, endDate) {
    try {
      // Add a cache-busting timestamp
      const timestamp = new Date().getTime();
      const endpoint = `${API_ENDPOINTS.REPORT.JOB_OFFER_EXPORT_PDF}?ts=${timestamp}`;
      
      const pdfBlob = await apiService.getJobOfferReportPdf(startDate, endDate, endpoint);
      return pdfBlob;
    } catch (error) {
      console.error('Error generating job offer report PDF:', error);
      throw error;
    }
  }
}

export const reportJobOfferService = new ReportJobOfferService();

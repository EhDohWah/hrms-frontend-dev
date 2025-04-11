import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class JobOfferService {
  // Fetch all job offers
  async getAllJobOffers() {
    return await apiService.get(API_ENDPOINTS.JOB_OFFER.LIST);
  }

  // Get job offer by ID
  async getJobOfferById(id) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Create a new job offer
  async createJobOffer(jobOfferData) {
    return await apiService.post(API_ENDPOINTS.JOB_OFFER.CREATE, jobOfferData);
  }

  // Update an existing job offer
  async updateJobOffer(id, jobOfferData) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, jobOfferData);
  }

  // Delete a job offer
  async deleteJobOffer(id) {
    const endpoint = API_ENDPOINTS.JOB_OFFER.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  /**
   * Generate a PDF job offer letter
   * 
   * @param {string} custom_job_offer_id - Custom ID of the job offer
   * @returns {Promise<Blob>} - Returns a PDF blob that can be downloaded or displayed
   * @throws {Error} - If the job offer is not found or there's a server error
   */
  async generateJobOfferPDF(custom_job_offer_id) {
    try {
      // Append a cache-busting timestamp query parameter
      const timestamp = new Date().getTime();
      const endpoint = API_ENDPOINTS.JOB_OFFER.GENERATE_PDF.replace(':id', custom_job_offer_id) + `?ts=${timestamp}`;
      const pdfBlob = await apiService.getPdf(endpoint);
      return pdfBlob;
    } catch (error) {
      // Handle specific error cases based on status code
      if (error.response && error.response.status === 404) {
        throw new Error('Job offer not found');
      }
      throw error;
    }
  }
}

export const jobOfferService = new JobOfferService();

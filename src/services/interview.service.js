import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class InterviewService {
  // Fetch all interviews
  async getAllInterviews() {
    return await apiService.get(API_ENDPOINTS.INTERVIEW.LIST);
  }

  // Get interview by ID
  async getInterviewById(id) {
    const endpoint = API_ENDPOINTS.INTERVIEW.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }

  // Create a new interview
  async createInterview(interviewData) {
    return await apiService.post(API_ENDPOINTS.INTERVIEW.CREATE, interviewData);
  }

  // Update an existing interview
  async updateInterview(id, interviewData) {
    const endpoint = API_ENDPOINTS.INTERVIEW.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, interviewData);
  }

  // Delete an interview
  async deleteInterview(id) {
    const endpoint = API_ENDPOINTS.INTERVIEW.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }
}

export const interviewService = new InterviewService();

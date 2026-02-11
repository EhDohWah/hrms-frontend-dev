import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { BaseService } from '@/services/base.service';

class AttendanceService extends BaseService {
  /**
   * Fetch all attendance records with query parameters for server-side pagination, filtering, and sorting
   */
  async getAll(params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.ATTENDANCE.LIST}${queryString ? `?${queryString}` : ''}`;

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch attendance list'
    );
  }

  /**
   * Get attendance record by ID
   */
  async getById(id) {
    const endpoint = API_ENDPOINTS.ATTENDANCE.DETAILS.replace(':id', id);

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      `fetch attendance record with ID ${id}`
    );
  }

  /**
   * Create a new attendance record
   */
  async create(data) {
    return await this.handleApiResponse(
      () => apiService.post(API_ENDPOINTS.ATTENDANCE.CREATE, data),
      'create attendance record'
    );
  }

  /**
   * Update an existing attendance record
   */
  async update(id, data) {
    const endpoint = API_ENDPOINTS.ATTENDANCE.UPDATE.replace(':id', id);

    return await this.handleApiResponse(
      () => apiService.put(endpoint, data),
      `update attendance record with ID ${id}`
    );
  }

  /**
   * Delete an attendance record
   */
  async delete(id) {
    const endpoint = API_ENDPOINTS.ATTENDANCE.DELETE.replace(':id', id);

    return await this.handleApiResponse(
      () => apiService.delete(endpoint),
      `delete attendance record with ID ${id}`
    );
  }

  /**
   * Fetch dropdown options for the attendance modal (employees, statuses)
   */
  async getOptions() {
    return await this.handleApiResponse(
      () => apiService.get(API_ENDPOINTS.ATTENDANCE.OPTIONS),
      'fetch attendance options'
    );
  }
}

export const attendanceService = new AttendanceService();

import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { dataMapper, filterUtils } from '@/utils/leave.utils';

/**
 * Enhanced Leave Service
 * Handles all leave-related API operations with proper pagination, filtering, and data transformation
 * Uses the centralized apiService for consistent error handling, authentication, and response processing
 */
class LeaveService {
  // Leave Types
  async getLeaveTypes(filters = {}) {
    try {
      const queryParams = filterUtils.buildQueryParams(filters);
      const queryString = new URLSearchParams(queryParams).toString();
      const endpoint = queryString ? `${API_ENDPOINTS.LEAVE.TYPES.LIST}?${queryString}` : API_ENDPOINTS.LEAVE.TYPES.LIST;

      const response = await apiService.get(endpoint);

      // Transform the response data
      if (response.success && response.data) {
        const transformedData = Array.isArray(response.data)
          ? response.data.map(item => dataMapper.mapLeaveType(item))
          : response.data;

        return {
          ...response,
          data: transformedData
        };
      }

      return response;
    } catch (error) {
      console.error('Error fetching leave types:', error);
      throw error;
    }
  }

  async createLeaveType(data) {
    try {
      // Transform data to backend format
      const backendData = dataMapper.camelToSnake(data);
      const response = await apiService.post(API_ENDPOINTS.LEAVE.TYPES.CREATE, backendData);

      // Transform response data back to frontend format
      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.mapLeaveType(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error creating leave type:', error);
      throw error;
    }
  }

  async updateLeaveType(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.TYPES.UPDATE.replace(':id', id);
      const backendData = dataMapper.camelToSnake(data);
      const response = await apiService.put(url, backendData);

      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.mapLeaveType(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error updating leave type:', error);
      throw error;
    }
  }

  async deleteLeaveType(id) {
    try {
      const url = API_ENDPOINTS.LEAVE.TYPES.DELETE.replace(':id', id);
      return await apiService.delete(url);
    } catch (error) {
      console.error('Error deleting leave type:', error);
      throw error;
    }
  }

  async getLeaveTypeDetails(id) {
    try {
      const url = API_ENDPOINTS.LEAVE.TYPES.DETAILS.replace(':id', id);
      const response = await apiService.get(url);

      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.mapLeaveType(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error fetching leave type details:', error);
      throw error;
    }
  }

  // Leave Requests
  async getLeaveRequests(filters = {}) {
    try {
      const queryParams = filterUtils.buildQueryParams(filters);
      const queryString = new URLSearchParams(queryParams).toString();
      const endpoint = queryString ? `${API_ENDPOINTS.LEAVE.REQUESTS.LIST}?${queryString}` : API_ENDPOINTS.LEAVE.REQUESTS.LIST;

      const response = await apiService.get(endpoint);

      // Transform the response data
      if (response.success && response.data) {
        const transformedData = Array.isArray(response.data)
          ? response.data.map(item => dataMapper.mapLeaveRequest(item))
          : response.data;

        return {
          ...response,
          data: transformedData
        };
      }

      return response;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  }

  async createLeaveRequest(data) {
    try {
      // Transform data to backend format
      const backendData = dataMapper.mapLeaveRequestForAPI(data);
      const response = await apiService.post(API_ENDPOINTS.LEAVE.REQUESTS.CREATE, backendData);

      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.mapLeaveRequest(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
  }

  async updateLeaveRequest(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.REQUESTS.UPDATE.replace(':id', id);
      const backendData = dataMapper.camelToSnake(data);
      const response = await apiService.put(url, backendData);

      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.mapLeaveRequest(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }
  }

  async deleteLeaveRequest(id) {
    try {
      const url = API_ENDPOINTS.LEAVE.REQUESTS.DELETE.replace(':id', id);
      return await apiService.delete(url);
    } catch (error) {
      console.error('Error deleting leave request:', error);
      throw error;
    }
  }

  async getLeaveRequestDetails(id) {
    try {
      const url = API_ENDPOINTS.LEAVE.REQUESTS.DETAILS.replace(':id', id);
      const response = await apiService.get(url);

      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.mapLeaveRequest(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error fetching leave request details:', error);
      throw error;
    }
  }

  // Leave Balances
  async getLeaveBalances(filters = {}) {
    try {
      const queryParams = filterUtils.buildQueryParams(filters);
      const queryString = new URLSearchParams(queryParams).toString();
      const endpoint = queryString ? `${API_ENDPOINTS.LEAVE.BALANCES.LIST}?${queryString}` : API_ENDPOINTS.LEAVE.BALANCES.LIST;

      const response = await apiService.get(endpoint);

      if (response.success && response.data) {
        const transformedData = Array.isArray(response.data)
          ? response.data.map(item => dataMapper.mapLeaveBalance(item))
          : response.data;

        return {
          ...response,
          data: transformedData
        };
      }

      return response;
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      throw error;
    }
  }

  async createLeaveBalance(data) {
    try {
      const backendData = dataMapper.camelToSnake(data);
      const response = await apiService.post(API_ENDPOINTS.LEAVE.BALANCES.CREATE, backendData);

      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.mapLeaveBalance(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error creating leave balance:', error);
      throw error;
    }
  }

  async updateLeaveBalance(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.BALANCES.UPDATE.replace(':id', id);
      const backendData = dataMapper.camelToSnake(data);
      const response = await apiService.put(url, backendData);

      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.mapLeaveBalance(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error updating leave balance:', error);
      throw error;
    }
  }

  // Leave Approvals
  async getLeaveApprovals(leaveRequestId) {
    try {
      const url = API_ENDPOINTS.LEAVE.APPROVALS.LIST.replace(':leaveRequestId', leaveRequestId);
      const response = await apiService.get(url);

      if (response.success && response.data) {
        const transformedData = Array.isArray(response.data)
          ? response.data.map(item => dataMapper.snakeToCamel(item))
          : response.data;

        return {
          ...response,
          data: transformedData
        };
      }

      return response;
    } catch (error) {
      console.error('Error fetching leave approvals:', error);
      throw error;
    }
  }

  async createLeaveApproval(leaveRequestId, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.APPROVALS.CREATE.replace(':leaveRequestId', leaveRequestId);
      const backendData = dataMapper.camelToSnake(data);
      const response = await apiService.post(url, backendData);

      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.snakeToCamel(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error creating leave approval:', error);
      throw error;
    }
  }

  async updateLeaveApproval(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.APPROVALS.UPDATE.replace(':id', id);
      const backendData = dataMapper.camelToSnake(data);
      const response = await apiService.put(url, backendData);

      if (response.success && response.data) {
        return {
          ...response,
          data: dataMapper.snakeToCamel(response.data)
        };
      }

      return response;
    } catch (error) {
      console.error('Error updating leave approval:', error);
      throw error;
    }
  }

  // Additional utility methods
  async getLeaveStats(filters = {}) {
    try {
      // This would typically come with the getLeaveRequests response
      // but can be called separately if needed
      const response = await this.getLeaveRequests(filters);
      return response.stats || {};
    } catch (error) {
      console.error('Error fetching leave stats:', error);
      throw error;
    }
  }

  async bulkUpdateLeaveRequests(ids, data) {
    try {
      const backendData = dataMapper.camelToSnake(data);
      return await apiService.put('/leaves/requests/bulk-update', {
        ids,
        ...backendData
      });
    } catch (error) {
      console.error('Error bulk updating leave requests:', error);
      throw error;
    }
  }

  // Get specific employee leave balance
  async getEmployeeLeaveBalance(employeeId, leaveTypeId, year = null) {
    try {
      const currentYear = year || new Date().getFullYear();
      const endpoint = `leaves/balance/${employeeId}/${leaveTypeId}?year=${currentYear}`;

      const response = await apiService.get(endpoint);

      return response;
    } catch (error) {
      console.error('Error fetching employee leave balance:', error);
      throw error;
    }
  }
}

export const leaveService = new LeaveService();

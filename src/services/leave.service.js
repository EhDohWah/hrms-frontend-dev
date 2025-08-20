import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * Leave Service
 * Handles all leave-related API operations including leave types, requests, balances, approvals, and traditional leaves
 * Uses the centralized apiService for consistent error handling, authentication, and response processing
 */
class LeaveService {
  // Leave Types
  async getLeaveTypes() {
    try {
      return await apiService.get(API_ENDPOINTS.LEAVE.TYPES.LIST);
    } catch (error) {
      console.error('Error fetching leave types:', error);
      throw error;
    }
  }

  async createLeaveType(data) {
    try {
      return await apiService.post(API_ENDPOINTS.LEAVE.TYPES.CREATE, data);
    } catch (error) {
      console.error('Error creating leave type:', error);
      throw error;
    }
  }

  async updateLeaveType(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.TYPES.UPDATE.replace(':id', id);
      return await apiService.put(url, data);
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
      return await apiService.get(url);
    } catch (error) {
      console.error('Error fetching leave type details:', error);
      throw error;
    }
  }

  // Leave Requests
  async getLeaveRequests() {
    try {
      return await apiService.get(API_ENDPOINTS.LEAVE.REQUESTS.LIST);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  }

  async createLeaveRequest(data) {
    try {
      return await apiService.post(API_ENDPOINTS.LEAVE.REQUESTS.CREATE, data);
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
  }

  async updateLeaveRequest(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.REQUESTS.UPDATE.replace(':id', id);
      return await apiService.put(url, data);
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
      return await apiService.get(url);
    } catch (error) {
      console.error('Error fetching leave request details:', error);
      throw error;
    }
  }

  // Leave Balances
  async getLeaveBalances() {
    try {
      return await apiService.get(API_ENDPOINTS.LEAVE.BALANCES.LIST);
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      throw error;
    }
  }

  async createLeaveBalance(data) {
    try {
      return await apiService.post(API_ENDPOINTS.LEAVE.BALANCES.CREATE, data);
    } catch (error) {
      console.error('Error creating leave balance:', error);
      throw error;
    }
  }

  async updateLeaveBalance(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.BALANCES.UPDATE.replace(':id', id);
      return await apiService.put(url, data);
    } catch (error) {
      console.error('Error updating leave balance:', error);
      throw error;
    }
  }

  // Leave Approvals
  async getLeaveApprovals() {
    try {
      return await apiService.get(API_ENDPOINTS.LEAVE.APPROVALS.LIST);
    } catch (error) {
      console.error('Error fetching leave approvals:', error);
      throw error;
    }
  }

  async createLeaveApproval(data) {
    try {
      return await apiService.post(API_ENDPOINTS.LEAVE.APPROVALS.CREATE, data);
    } catch (error) {
      console.error('Error creating leave approval:', error);
      throw error;
    }
  }

  async updateLeaveApproval(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.APPROVALS.UPDATE.replace(':id', id);
      return await apiService.put(url, data);
    } catch (error) {
      console.error('Error updating leave approval:', error);
      throw error;
    }
  }

  // Traditional Leave
  async getTraditionalLeaves() {
    try {
      return await apiService.get(API_ENDPOINTS.LEAVE.TRADITIONAL.LIST);
    } catch (error) {
      console.error('Error fetching traditional leaves:', error);
      throw error;
    }
  }

  async createTraditionalLeave(data) {
    try {
      return await apiService.post(API_ENDPOINTS.LEAVE.TRADITIONAL.CREATE, data);
    } catch (error) {
      console.error('Error creating traditional leave:', error);
      throw error;
    }
  }

  async updateTraditionalLeave(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.TRADITIONAL.UPDATE.replace(':id', id);
      return await apiService.put(url, data);
    } catch (error) {
      console.error('Error updating traditional leave:', error);
      throw error;
    }
  }
}

export const leaveService = new LeaveService();

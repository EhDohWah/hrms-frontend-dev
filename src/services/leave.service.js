import axios from 'axios';
import API_ENDPOINTS from '@/config/api.config';

class LeaveService {
  // Leave Types
  async getLeaveTypes() {
    try {
      const response = await axios.get(API_ENDPOINTS.LEAVE.TYPES.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave types:', error);
      throw error;
    }
  }

  async createLeaveType(data) {
    try {
      const response = await axios.post(API_ENDPOINTS.LEAVE.TYPES.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating leave type:', error);
      throw error;
    }
  }

  async updateLeaveType(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.TYPES.UPDATE.replace(':id', id);
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating leave type:', error);
      throw error;
    }
  }

  async deleteLeaveType(id) {
    try {
      const url = API_ENDPOINTS.LEAVE.TYPES.DELETE.replace(':id', id);
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting leave type:', error);
      throw error;
    }
  }

  async getLeaveTypeDetails(id) {
    try {
      const url = API_ENDPOINTS.LEAVE.TYPES.DETAILS.replace(':id', id);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave type details:', error);
      throw error;
    }
  }

  // Leave Requests
  async getLeaveRequests() {
    try {
      const response = await axios.get(API_ENDPOINTS.LEAVE.REQUESTS.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  }

  async createLeaveRequest(data) {
    try {
      const response = await axios.post(API_ENDPOINTS.LEAVE.REQUESTS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
  }

  async updateLeaveRequest(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.REQUESTS.UPDATE.replace(':id', id);
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }
  }

  async deleteLeaveRequest(id) {
    try {
      const url = API_ENDPOINTS.LEAVE.REQUESTS.DELETE.replace(':id', id);
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting leave request:', error);
      throw error;
    }
  }

  async getLeaveRequestDetails(id) {
    try {
      const url = API_ENDPOINTS.LEAVE.REQUESTS.DETAILS.replace(':id', id);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave request details:', error);
      throw error;
    }
  }

  // Leave Balances
  async getLeaveBalances() {
    try {
      const response = await axios.get(API_ENDPOINTS.LEAVE.BALANCES.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      throw error;
    }
  }

  async createLeaveBalance(data) {
    try {
      const response = await axios.post(API_ENDPOINTS.LEAVE.BALANCES.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating leave balance:', error);
      throw error;
    }
  }

  async updateLeaveBalance(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.BALANCES.UPDATE.replace(':id', id);
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating leave balance:', error);
      throw error;
    }
  }

  // Leave Approvals
  async getLeaveApprovals() {
    try {
      const response = await axios.get(API_ENDPOINTS.LEAVE.APPROVALS.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching leave approvals:', error);
      throw error;
    }
  }

  async createLeaveApproval(data) {
    try {
      const response = await axios.post(API_ENDPOINTS.LEAVE.APPROVALS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating leave approval:', error);
      throw error;
    }
  }

  async updateLeaveApproval(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.APPROVALS.UPDATE.replace(':id', id);
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating leave approval:', error);
      throw error;
    }
  }

  // Traditional Leave
  async getTraditionalLeaves() {
    try {
      const response = await axios.get(API_ENDPOINTS.LEAVE.TRADITIONAL.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching traditional leaves:', error);
      throw error;
    }
  }

  async createTraditionalLeave(data) {
    try {
      const response = await axios.post(API_ENDPOINTS.LEAVE.TRADITIONAL.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating traditional leave:', error);
      throw error;
    }
  }

  async updateTraditionalLeave(id, data) {
    try {
      const url = API_ENDPOINTS.LEAVE.TRADITIONAL.UPDATE.replace(':id', id);
      const response = await axios.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating traditional leave:', error);
      throw error;
    }
  }
}

export default new LeaveService();

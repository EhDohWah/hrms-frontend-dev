// department-position.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class DepartmentPositionService {
  async getAllDepartmentPositions() {
    return await apiService.get(API_ENDPOINTS.DEPARTMENT_POSITION.LIST);
  }

  async createDepartmentPosition(positionData) {
    return await apiService.post(API_ENDPOINTS.DEPARTMENT_POSITION.CREATE, positionData);
  }

  async updateDepartmentPosition(id, positionData) {
    const endpoint = API_ENDPOINTS.DEPARTMENT_POSITION.UPDATE.replace(':id', id);
    return await apiService.put(endpoint, positionData);
  }

  async deleteDepartmentPosition(id) {
    const endpoint = API_ENDPOINTS.DEPARTMENT_POSITION.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }

  async getDepartmentPositionDetails(id) {
    const endpoint = API_ENDPOINTS.DEPARTMENT_POSITION.DETAILS.replace(':id', id);
    return await apiService.get(endpoint);
  }
}

export const departmentPositionService = new DepartmentPositionService();
export default departmentPositionService;


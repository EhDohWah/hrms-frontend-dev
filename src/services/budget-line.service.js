// budget-line.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class BudgetLineService {

    // Fetch all budget lines
    async getAllBudgetLines() {
        return await apiService.get(API_ENDPOINTS.BUDGET_LINE.LIST);
    }

    // Fetch budget line by ID
    async getBudgetLineById(id) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.GET_BY_ID.replace(':id', id);
        return await apiService.get(endpoint);
    }

    // Create a new budget line
    async createBudgetLine(budgetLineData) {
        return await apiService.post(API_ENDPOINTS.BUDGET_LINE.CREATE, budgetLineData);
    }

    // Update an existing budget line
    async updateBudgetLine(id, budgetLineData) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.UPDATE.replace(':id', id);
        return await apiService.put(endpoint, budgetLineData);
    }

    // Delete a budget line
    async deleteBudgetLine(id) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    // Get budget line details
    async getBudgetLineDetails(id) {
        const endpoint = API_ENDPOINTS.BUDGET_LINE.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }
}

export const budgetLineService = new BudgetLineService();

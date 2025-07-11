// position-slot.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class PositionSlotService {

    // Fetch all position slots
    async getAllPositionSlots() {
        return await apiService.get(API_ENDPOINTS.POSITION_SLOT.LIST);
    }

    // Fetch position slot by ID
    async getPositionSlotById(id) {
        const endpoint = API_ENDPOINTS.POSITION_SLOT.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }

    // Create a new position slot
    async createPositionSlot(positionSlotData) {
        return await apiService.post(API_ENDPOINTS.POSITION_SLOT.CREATE, positionSlotData);
    }

    // Update an existing position slot
    async updatePositionSlot(id, positionSlotData) {
        const endpoint = API_ENDPOINTS.POSITION_SLOT.UPDATE.replace(':id', id);
        return await apiService.put(endpoint, positionSlotData);
    }

    // Delete a position slot
    async deletePositionSlot(id) {
        const endpoint = API_ENDPOINTS.POSITION_SLOT.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    // Get position slot details
    async getPositionSlotDetails(id) {
        const endpoint = API_ENDPOINTS.POSITION_SLOT.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }
}

export const positionSlotService = new PositionSlotService();

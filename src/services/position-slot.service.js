// position-slot.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { useSharedDataStore } from '@/stores/sharedDataStore';

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
        const result = await apiService.post(API_ENDPOINTS.POSITION_SLOT.CREATE, positionSlotData);

        // Invalidate grant structure cache after creating position slot
        try {
            const sharedStore = useSharedDataStore();
            sharedStore.invalidateCache('grantStructure');
            console.log('🗑️ Cache invalidated after creating position slot');
        } catch (error) {
            console.warn('⚠️ Failed to invalidate cache after creating position slot:', error);
        }

        return result;
    }

    // Update an existing position slot
    async updatePositionSlot(id, positionSlotData) {
        const endpoint = API_ENDPOINTS.POSITION_SLOT.UPDATE.replace(':id', id);
        const result = await apiService.put(endpoint, positionSlotData);

        // Invalidate grant structure cache after updating position slot
        try {
            const sharedStore = useSharedDataStore();
            sharedStore.invalidateCache('grantStructure');
            console.log('🗑️ Cache invalidated after updating position slot');
        } catch (error) {
            console.warn('⚠️ Failed to invalidate cache after updating position slot:', error);
        }

        return result;
    }

    // Delete a position slot
    async deletePositionSlot(id) {
        const endpoint = API_ENDPOINTS.POSITION_SLOT.DELETE.replace(':id', id);
        const result = await apiService.delete(endpoint);

        // Invalidate grant structure cache after deleting position slot
        try {
            const sharedStore = useSharedDataStore();
            sharedStore.invalidateCache('grantStructure');
            console.log('🗑️ Cache invalidated after deleting position slot');
        } catch (error) {
            console.warn('⚠️ Failed to invalidate cache after deleting position slot:', error);
        }

        return result;
    }

    // Get position slot details
    async getPositionSlotDetails(id) {
        const endpoint = API_ENDPOINTS.POSITION_SLOT.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }
}

export const positionSlotService = new PositionSlotService();

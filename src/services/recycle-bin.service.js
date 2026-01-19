// recycle-bin.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class RecycleBinService {

    // Fetch all deleted records in recycle bin
    async getAllDeletedRecords() {
        return await apiService.get(API_ENDPOINTS.RECYCLE_BIN.LIST);
    }

    // Get recycle bin statistics
    async getRecycleBinStats() {
        return await apiService.get(API_ENDPOINTS.RECYCLE_BIN.STATS);
    }

    // Restore a single record from recycle bin
    async restoreRecord(restoreData) {
        return await apiService.post(API_ENDPOINTS.RECYCLE_BIN.RESTORE, restoreData);
    }

    // Bulk restore multiple records from recycle bin
    async bulkRestoreRecords(bulkRestoreData) {
        return await apiService.post(API_ENDPOINTS.RECYCLE_BIN.BULK_RESTORE, bulkRestoreData);
    }

    // Permanently delete a record from recycle bin
    async permanentlyDeleteRecord(deletedRecordId) {
        const endpoint = API_ENDPOINTS.RECYCLE_BIN.PERMANENT_DELETE.replace(':deletedRecordId', deletedRecordId);
        return await apiService.delete(endpoint);
    }
}

export const recycleBinService = new RecycleBinService(); 
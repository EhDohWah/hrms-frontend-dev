// recycle-bin.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class RecycleBinService {

    // Fetch all deleted records (both soft-deleted and legacy)
    async getAllDeletedRecords() {
        return await apiService.get(API_ENDPOINTS.RECYCLE_BIN.LIST);
    }

    // Get recycle bin statistics
    async getRecycleBinStats() {
        return await apiService.get(API_ENDPOINTS.RECYCLE_BIN.STATS);
    }

    // ─── Soft-delete operations (Employee, Grant, Department) ─────────

    // Restore a soft-deleted record by model type and ID
    async restore(modelType, id) {
        const endpoint = `${API_ENDPOINTS.RECYCLE_BIN.RESTORE}/${modelType}/${id}`;
        return await apiService.post(endpoint);
    }

    // Bulk restore soft-deleted records
    async bulkRestore(items) {
        return await apiService.post(API_ENDPOINTS.RECYCLE_BIN.BULK_RESTORE, { items });
    }

    // Permanently delete a soft-deleted record
    async permanentDelete(modelType, id) {
        const endpoint = `${API_ENDPOINTS.RECYCLE_BIN.PERMANENT_DELETE}/${modelType}/${id}`;
        return await apiService.delete(endpoint);
    }

    // ─── Legacy operations (Interview, JobOffer) ──────────────────────

    // Restore a legacy flat record
    async restoreLegacy(restoreData) {
        return await apiService.post(API_ENDPOINTS.RECYCLE_BIN.RESTORE_LEGACY, restoreData);
    }

    // Bulk restore legacy flat records
    async bulkRestoreLegacy(bulkRestoreData) {
        return await apiService.post(API_ENDPOINTS.RECYCLE_BIN.BULK_RESTORE_LEGACY, bulkRestoreData);
    }

    // Permanently delete a legacy flat record by deleted_models ID
    async permanentDeleteLegacy(deletedRecordId) {
        const endpoint = API_ENDPOINTS.RECYCLE_BIN.PERMANENT_DELETE_LEGACY.replace(':deletedRecordId', deletedRecordId);
        return await apiService.delete(endpoint);
    }
}

export const recycleBinService = new RecycleBinService();

// recycle-bin.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

class RecycleBinService {

    // Fetch all deleted records (both manifest-based and legacy)
    async getAllDeletedRecords() {
        return await apiService.get(API_ENDPOINTS.RECYCLE_BIN.LIST);
    }

    // Get recycle bin statistics
    async getRecycleBinStats() {
        return await apiService.get(API_ENDPOINTS.RECYCLE_BIN.STATS);
    }

    // ─── Manifest-based operations (Employee, Grant, Department) ────────

    // Restore a manifest-based deletion by its deletion key
    async restoreByKey(deletionKey) {
        const endpoint = API_ENDPOINTS.RECYCLE_BIN.RESTORE_BY_KEY.replace(':deletionKey', deletionKey);
        return await apiService.post(endpoint);
    }

    // Bulk restore manifest-based deletions by their deletion keys
    async bulkRestoreByKeys(deletionKeys) {
        return await apiService.post(API_ENDPOINTS.RECYCLE_BIN.BULK_RESTORE_KEYS, {
            deletion_keys: deletionKeys
        });
    }

    // Permanently delete a manifest-based deletion by its key
    async permanentDeleteByKey(deletionKey) {
        const endpoint = API_ENDPOINTS.RECYCLE_BIN.PERMANENT_DELETE_BY_KEY.replace(':deletionKey', deletionKey);
        return await apiService.delete(endpoint);
    }

    // ─── Legacy operations (Interview, JobOffer) ────────────────────────

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

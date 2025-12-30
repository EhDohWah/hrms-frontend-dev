// activityLogStore.js
import { defineStore } from 'pinia';
import { activityLogService } from '@/services/activityLog.service';

export const useActivityLogStore = defineStore('activityLog', {
  state: () => ({
    logs: [],
    recentLogs: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      per_page: 20,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0,
      has_more_pages: false
    },
    // Cache for subject-specific logs
    subjectLogsCache: {} // { 'grant_123': { logs: [], pagination: {}, timestamp: Date } }
  }),

  getters: {
    /**
     * Get all logs
     */
    getLogs: (state) => state.logs,

    /**
     * Check if loading
     */
    isLoading: (state) => state.loading,

    /**
     * Get logs by subject type and id (from cache)
     */
    getLogsBySubject: (state) => (subjectType, subjectId) => {
      const cacheKey = `${subjectType}_${subjectId}`;
      return state.subjectLogsCache[cacheKey]?.logs || [];
    },

    /**
     * Get recent activity logs
     */
    getRecentLogs: (state) => state.recentLogs,

    /**
     * Get pagination info
     */
    getPagination: (state) => state.pagination
  },

  actions: {
    /**
     * Fetch paginated activity logs with filters
     * @param {Object} params - Query parameters
     */
    async fetchLogs(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const queryParams = {
          page: params.page || 1,
          per_page: params.per_page || 20,
          ...(params.subject_type && { subject_type: params.subject_type }),
          ...(params.subject_id && { subject_id: params.subject_id }),
          ...(params.user_id && { user_id: params.user_id }),
          ...(params.action && { action: params.action }),
          ...(params.date_from && { date_from: params.date_from }),
          ...(params.date_to && { date_to: params.date_to })
        };

        const response = await activityLogService.getActivityLogs(queryParams);

        if (response.data && response.data.success) {
          this.logs = response.data.data;
          this.pagination = response.data.pagination;
        } else {
          this.logs = response.data || [];
        }

        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch activity logs';
        console.error('Error fetching activity logs:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch activity logs for a specific subject
     * @param {string} subjectType - Subject type (grant, employee, employment, payroll)
     * @param {number} subjectId - Subject ID
     * @param {Object} params - Optional pagination params
     * @param {boolean} forceRefresh - Force refresh cache
     */
    async fetchSubjectLogs(subjectType, subjectId, params = {}, forceRefresh = false) {
      const cacheKey = `${subjectType}_${subjectId}`;

      // Check cache (valid for 2 minutes)
      const cached = this.subjectLogsCache[cacheKey];
      if (!forceRefresh && cached && (Date.now() - cached.timestamp) < 120000) {
        return { data: { success: true, data: cached.logs, pagination: cached.pagination } };
      }

      this.loading = true;
      this.error = null;

      try {
        const queryParams = {
          page: params.page || 1,
          per_page: params.per_page || 20
        };

        const response = await activityLogService.getSubjectLogs(subjectType, subjectId, queryParams);

        if (response.data && response.data.success) {
          // Update cache
          this.subjectLogsCache[cacheKey] = {
            logs: response.data.data,
            pagination: response.data.pagination,
            timestamp: Date.now()
          };
        }

        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch subject activity logs';
        console.error('Error fetching subject activity logs:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch recent activity logs
     * @param {number} limit - Maximum number of logs (default: 50)
     */
    async fetchRecentActivity(limit = 50) {
      this.loading = true;
      this.error = null;

      try {
        const response = await activityLogService.getRecentActivity(limit);

        if (response.data && response.data.success) {
          this.recentLogs = response.data.data;
        } else {
          this.recentLogs = response.data || [];
        }

        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch recent activity';
        console.error('Error fetching recent activity:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear subject logs cache for a specific subject
     * @param {string} subjectType - Subject type
     * @param {number} subjectId - Subject ID
     */
    clearSubjectCache(subjectType, subjectId) {
      const cacheKey = `${subjectType}_${subjectId}`;
      delete this.subjectLogsCache[cacheKey];
    },

    /**
     * Clear all cached data
     */
    clearCache() {
      this.subjectLogsCache = {};
      this.logs = [];
      this.recentLogs = [];
    },

    /**
     * Reset store state
     */
    resetState() {
      this.logs = [];
      this.recentLogs = [];
      this.loading = false;
      this.error = null;
      this.pagination = {
        current_page: 1,
        per_page: 20,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
        has_more_pages: false
      };
      this.subjectLogsCache = {};
    }
  }
});


















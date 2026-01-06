// activityLog.service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { BaseService } from '@/services/base.service';

class ActivityLogService extends BaseService {

  /**
   * Get paginated activity logs with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 20, max: 100)
   * @param {string} params.subject_type - Filter by subject type (grant, employee, employment, payroll)
   * @param {number} params.subject_id - Filter by subject ID
   * @param {number} params.user_id - Filter by user ID
   * @param {string} params.action - Filter by action (created, updated, deleted, processed, imported)
   * @param {string} params.date_from - Filter from date
   * @param {string} params.date_to - Filter to date
   * @returns {Promise} API response with paginated logs
   */
  async getActivityLogs(params = {}) {
    const queryParams = this.buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.ACTIVITY_LOG.LIST}${queryParams ? `?${queryParams}` : ''}`;

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch activity logs'
    );
  }

  /**
   * Get activity logs for a specific subject (record)
   * @param {string} type - Subject type (grant, employee, employment, payroll)
   * @param {number} id - Subject ID
   * @param {Object} params - Optional pagination params
   * @returns {Promise} API response with logs for the subject
   */
  async getSubjectLogs(type, id, params = {}) {
    const endpoint = API_ENDPOINTS.ACTIVITY_LOG.SUBJECT
      .replace(':type', type)
      .replace(':id', id);

    const queryParams = this.buildQueryString(params);
    const fullEndpoint = `${endpoint}${queryParams ? `?${queryParams}` : ''}`;

    return await this.handleApiResponse(
      () => apiService.get(fullEndpoint),
      'fetch subject activity logs'
    );
  }

  /**
   * Get recent activity logs across all types
   * @param {number} limit - Maximum number of logs to return (default: 50)
   * @returns {Promise} API response with recent logs
   */
  async getRecentActivity(limit = 50) {
    const endpoint = `${API_ENDPOINTS.ACTIVITY_LOG.RECENT}?limit=${limit}`;

    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch recent activity'
    );
  }

  /**
   * Format action for display with proper casing
   * @param {string} action - Raw action string
   * @returns {string} Formatted action string
   */
  formatAction(action) {
    if (!action) return '';
    return action.charAt(0).toUpperCase() + action.slice(1);
  }

  /**
   * Get action color class for styling
   * @param {string} action - Action type
   * @returns {string} CSS class name for the action
   */
  getActionColorClass(action) {
    const colorMap = {
      'created': 'success',
      'updated': 'info',
      'deleted': 'danger',
      'processed': 'purple',
      'imported': 'warning'
    };
    return colorMap[action?.toLowerCase()] || 'secondary';
  }

  /**
   * Get action badge variant for UI components
   * @param {string} action - Action type
   * @returns {string} Badge variant name
   */
  getActionBadgeVariant(action) {
    const variantMap = {
      'created': 'success',
      'updated': 'primary',
      'deleted': 'danger',
      'processed': 'info',
      'imported': 'warning'
    };
    return variantMap[action?.toLowerCase()] || 'secondary';
  }

  /**
   * Format relative time for display
   * @param {string} dateString - ISO date string
   * @returns {string} Relative time string (e.g., "2h ago")
   */
  formatRelativeTime(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    // For older dates, return formatted date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  /**
   * Get short subject type name for display
   * @param {string} subjectType - Full model class name
   * @returns {string} Short type name
   */
  getShortSubjectType(subjectType) {
    if (!subjectType) return '';
    // Extract class name from full namespace (e.g., "App\\Models\\Grant" -> "Grant")
    const parts = subjectType.split('\\');
    return parts[parts.length - 1] || subjectType;
  }
}

export const activityLogService = new ActivityLogService();



















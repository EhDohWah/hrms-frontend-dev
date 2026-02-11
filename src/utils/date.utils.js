/**
 * Centralized Date Formatting Utilities
 *
 * All user-facing date display in the HRMS should use these functions
 * to ensure consistent DD/MM/YYYY format across the application.
 *
 * Usage:
 *   import { formatDate, formatDateTime } from '@/utils/date.utils';
 *   formatDate('2025-01-15')      // → '15/01/2025'
 *   formatDateTime('2025-01-15T10:30:00') // → '15/01/2025 10:30'
 *   formatDateForAPI('15/01/2025') // → '2025-01-15'
 */
import moment from 'moment';

/**
 * Format a date for user-facing display: DD/MM/YYYY
 * @param {string|Date} date - Date from backend or JS Date object
 * @returns {string} Formatted date string, or '' if input is falsy/invalid
 */
export function formatDate(date) {
    if (!date) return '';
    const m = moment(date);
    if (!m.isValid()) return '';
    return m.format('DD/MM/YYYY');
}

/**
 * Format a date+time for user-facing display: DD/MM/YYYY HH:mm
 * Use for activity logs, timestamps, recycle bin, etc.
 * @param {string|Date} date - Datetime from backend or JS Date object
 * @returns {string} Formatted datetime string, or '' if input is falsy/invalid
 */
export function formatDateTime(date) {
    if (!date) return '';
    const m = moment(date);
    if (!m.isValid()) return '';
    return m.format('DD/MM/YYYY HH:mm');
}

/**
 * Format a date for sending to the API: YYYY-MM-DD
 * Backend expects ISO date format.
 * @param {string|Date} date - Date to format for API
 * @returns {string} API-formatted date string, or '' if input is falsy/invalid
 */
export function formatDateForAPI(date) {
    if (!date) return '';
    const m = moment(date);
    if (!m.isValid()) return '';
    return m.format('YYYY-MM-DD');
}

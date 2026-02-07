/**
 * HTML Sanitization Utility
 *
 * Uses DOMPurify to sanitize HTML content before rendering with v-html.
 * This prevents XSS attacks while allowing safe HTML formatting.
 *
 * @module utils/sanitize
 */
import DOMPurify from 'dompurify';

/**
 * Default DOMPurify configuration
 * - Allows common formatting tags: b, i, strong, em, br, span, p
 * - Allows class and style attributes for styling
 * - Strips all potentially dangerous content (scripts, event handlers, etc.)
 */
const DEFAULT_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'br', 'span', 'p', 'a', 'ul', 'li'],
  ALLOWED_ATTR: ['class', 'style', 'href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  // Prevent javascript: URLs
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

/**
 * Sanitize HTML string to prevent XSS attacks
 *
 * @param {string} dirtyHtml - The untrusted HTML string to sanitize
 * @param {Object} customConfig - Optional custom DOMPurify configuration
 * @returns {string} - Sanitized HTML safe for v-html rendering
 *
 * @example
 * // Basic usage
 * const safeHtml = sanitizeHtml('<script>alert("xss")</script><b>Safe text</b>');
 * // Returns: '<b>Safe text</b>'
 *
 * @example
 * // With custom config
 * const safeHtml = sanitizeHtml(html, { ALLOWED_TAGS: ['b', 'i'] });
 */
export function sanitizeHtml(dirtyHtml, customConfig = {}) {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  const config = { ...DEFAULT_CONFIG, ...customConfig };
  return DOMPurify.sanitize(dirtyHtml, config);
}

/**
 * Sanitize HTML for notification messages
 * More restrictive - only allows basic formatting
 *
 * @param {string} dirtyHtml - The untrusted HTML string
 * @returns {string} - Sanitized HTML
 */
export function sanitizeNotificationHtml(dirtyHtml) {
  return sanitizeHtml(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'strong', 'em', 'span', 'br'],
    ALLOWED_ATTR: ['class'],
  });
}

/**
 * Sanitize HTML for error messages
 * Allows badges and formatting common in error displays
 *
 * @param {string} dirtyHtml - The untrusted HTML string
 * @returns {string} - Sanitized HTML
 */
export function sanitizeErrorHtml(dirtyHtml) {
  return sanitizeHtml(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'strong', 'em', 'span', 'br', 'p'],
    ALLOWED_ATTR: ['class'],
  });
}

/**
 * Escape HTML entities (no HTML allowed)
 * Use this when you want to display user input as plain text
 *
 * @param {string} text - The text to escape
 * @returns {string} - Escaped text safe for display
 */
export function escapeHtml(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export default {
  sanitizeHtml,
  sanitizeNotificationHtml,
  sanitizeErrorHtml,
  escapeHtml,
};

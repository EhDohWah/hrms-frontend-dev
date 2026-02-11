/**
 * Quill.js Shared Configuration
 *
 * Provides toolbar presets for QuillEditor components.
 * - defaultToolbar: basic formatting for general modals
 * - letterTemplateToolbar: extended toolbar with fonts, sizes, colors, alignment
 */

/**
 * Default toolbar - matches the old CKEditor Classic Build features
 * Used by: admin-dashboard-modal, clients-details-modal, email-modal,
 *          employee-dashboard-modal, project-details-modal, project-grid-modal,
 *          sms-template-modal, todo-list-modal
 */
export const defaultToolbar = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline'],
  ['link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['blockquote'],
  ['clean'],
];

/**
 * Extended toolbar for letter templates
 * Includes: font family, font size, font color, alignment, horizontal rule
 * Used by: letter-template-modal
 */
export const letterTemplateToolbar = [
  [{ header: [1, 2, 3, false] }],
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['link', 'blockquote'],
  ['clean'],
];

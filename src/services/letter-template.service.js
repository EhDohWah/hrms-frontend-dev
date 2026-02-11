import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

/**
 * Letter Template Service
 * Handles all API operations for managing letter templates (CRUD + PDF generation)
 */
class LetterTemplateService extends BaseService {
    /**
     * Get paginated letter templates
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.per_page - Items per page
     * @param {string} params.search - Search by title
     * @param {string} params.sort_by - Sort option
     * @returns {Promise<Object>} API response with templates and pagination
     */
    async getTemplates(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.LETTER_TEMPLATE.LIST}${queryString ? `?${queryString}` : ''}`;

        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch letter templates'
        );
    }

    /**
     * Get a single letter template by ID (includes full content)
     * @param {number} id - Template ID
     * @returns {Promise<Object>} API response with template data
     */
    async getTemplate(id) {
        const endpoint = API_ENDPOINTS.LETTER_TEMPLATE.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch letter template ${id}`
        );
    }

    /**
     * Create a new letter template
     * @param {Object} data - Template data
     * @param {string} data.title - Template title (required, max 200)
     * @param {string} data.content - Template HTML content from editor (required)
     * @returns {Promise<Object>} API response with created template
     */
    async createTemplate(data) {
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.LETTER_TEMPLATE.CREATE, data),
            'create letter template'
        );
    }

    /**
     * Update an existing letter template
     * @param {number} id - Template ID
     * @param {Object} data - Template data to update
     * @returns {Promise<Object>} API response with updated template
     */
    async updateTemplate(id, data) {
        const endpoint = API_ENDPOINTS.LETTER_TEMPLATE.UPDATE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, data),
            `update letter template ${id}`
        );
    }

    /**
     * Delete a letter template
     * @param {number} id - Template ID
     * @returns {Promise<Object>} API response
     */
    async deleteTemplate(id) {
        const endpoint = API_ENDPOINTS.LETTER_TEMPLATE.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            `delete letter template ${id}`
        );
    }

    /**
     * Generate a PDF from a saved template with placeholder replacement
     * @param {number} id - Template ID
     * @param {Object} placeholders - Key-value pairs for placeholder replacement
     * @returns {Promise<Blob>} PDF blob
     */
    async generatePdf(id, placeholders = {}) {
        const endpoint = API_ENDPOINTS.LETTER_TEMPLATE.GENERATE_PDF.replace(':id', id);
        const fullURL = apiService.getFullURL(endpoint);

        const response = await fetch(fullURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf',
            },
            body: JSON.stringify({ placeholders }),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = new Error(`Failed to generate PDF (HTTP ${response.status})`);
            error.response = response;
            throw error;
        }

        return await response.blob();
    }

    /**
     * Get available placeholder categories and their placeholders
     * Used by the editor placeholder toolbar
     * @returns {Array} Array of placeholder categories with their items
     */
    getPlaceholderCategories() {
        return [
            {
                label: 'Employee',
                placeholders: [
                    { key: 'employee_name', label: 'Employee Name' },
                    { key: 'staff_id', label: 'Staff ID' },
                    { key: 'date_of_birth', label: 'Date of Birth' },
                    { key: 'nationality', label: 'Nationality' },
                ]
            },
            {
                label: 'Employment',
                placeholders: [
                    { key: 'position', label: 'Position' },
                    { key: 'department', label: 'Department' },
                    { key: 'site', label: 'Site' },
                    { key: 'start_date', label: 'Start Date' },
                    { key: 'probation_salary', label: 'Probation Salary' },
                    { key: 'post_probation_salary', label: 'Post-Probation Salary' },
                ]
            },
            {
                label: 'Organization',
                placeholders: [
                    { key: 'organization_name', label: 'Organization Name' },
                    { key: 'acceptance_deadline', label: 'Acceptance Deadline' },
                ]
            },
            {
                label: 'Date',
                placeholders: [
                    { key: 'current_date', label: 'Current Date' },
                ]
            }
        ];
    }

    /**
     * Get all available placeholder keys as a flat array
     * @returns {Array<string>} Array of placeholder keys
     */
    getAllPlaceholderKeys() {
        return this.getPlaceholderCategories()
            .flatMap(category => category.placeholders.map(p => p.key));
    }

    /**
     * Get sort options for the template list
     * @returns {Array} Array of sort options
     */
    getSortOptions() {
        return [
            { value: 'recently_updated', label: 'Recently Updated' },
            { value: 'title_asc', label: 'Title (A-Z)' },
            { value: 'title_desc', label: 'Title (Z-A)' },
            { value: 'recently_created', label: 'Recently Created' }
        ];
    }
}

export const letterTemplateService = new LetterTemplateService();

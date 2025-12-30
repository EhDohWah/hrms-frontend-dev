import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class SiteService extends BaseService {
    /**
     * Get site options for dropdowns
     */
    async getSiteOptions(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.SITE.OPTIONS}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch site options'
        );
    }

    /**
     * Get all sites with pagination and filtering
     */
    async getSites(params = {}) {
        const queryString = this.buildQueryString(params);
        const endpoint = `${API_ENDPOINTS.SITE.LIST}${queryString ? `?${queryString}` : ''}`;
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            'fetch sites'
        );
    }

    /**
     * Get site by ID
     */
    async getSiteById(id) {
        const endpoint = API_ENDPOINTS.SITE.DETAILS.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.get(endpoint),
            `fetch site ${id}`
        );
    }

    /**
     * Create new site
     */
    async createSite(data) {
        const formattedData = this.formatSiteData(data);
        return await this.handleApiResponse(
            () => apiService.post(API_ENDPOINTS.SITE.CREATE, formattedData),
            'create site'
        );
    }

    /**
     * Update site
     */
    async updateSite(id, data) {
        const endpoint = API_ENDPOINTS.SITE.UPDATE.replace(':id', id);
        const formattedData = this.formatSiteData(data);
        return await this.handleApiResponse(
            () => apiService.put(endpoint, formattedData),
            `update site ${id}`
        );
    }

    /**
     * Delete site
     */
    async deleteSite(id) {
        const endpoint = API_ENDPOINTS.SITE.DELETE.replace(':id', id);
        return await this.handleApiResponse(
            () => apiService.delete(endpoint),
            `delete site ${id}`
        );
    }

    /**
     * Format site data for API submission
     */
    formatSiteData(data) {
        return {
            name: data.name || null,
            code: data.code || null,
            description: data.description || null,
            address: data.address || null,
            contact_person: data.contact_person || null,
            contact_phone: data.contact_phone || null,
            contact_email: data.contact_email || null,
            is_active: data.is_active !== undefined ? data.is_active : true,
        };
    }

    /**
     * Validate site data
     */
    validateSiteData(data) {
        const requiredValidation = this.validateRequiredFields(data, ['name', 'code']);
        return requiredValidation;
    }
}

export const siteService = new SiteService();
export default siteService;

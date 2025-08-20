import { apiService } from './api.service';

class TaxSettingsService {
    constructor() {
        this.baseURL = '/tax-settings';
    }

    /**
     * Get all tax settings
     * @param {Object} params - Query parameters (page, limit, search, year, etc.)
     * @returns {Promise<Object>} API response with tax settings data
     */
    async getTaxSettings(params = {}) {
        try {
            const response = await apiService.get(this.baseURL, { params });
            return {
                success: true,
                data: response.data,
                message: 'Tax settings retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching tax settings:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch tax settings',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Get tax settings by year
     * @param {number} year - The year to filter by
     * @returns {Promise<Object>} API response with filtered tax settings
     */
    async getTaxSettingsByYear(year) {
        try {
            const response = await apiService.get(`${this.baseURL}/by-year/${year}`);
            return {
                success: true,
                data: response.data,
                message: 'Tax settings retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching tax settings by year:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch tax settings',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Get specific tax setting value by key
     * @param {string} key - The setting key (e.g., PERSONAL_ALLOWANCE, SSF_RATE)
     * @param {number} year - Optional year filter
     * @returns {Promise<Object>} API response with setting value
     */
    async getTaxSettingValue(key, year = null) {
        try {
            const url = year ? `${this.baseURL}/value/${key}?year=${year}` : `${this.baseURL}/value/${key}`;
            const response = await apiService.get(url);
            return {
                success: true,
                data: response.data,
                message: 'Tax setting value retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching tax setting value:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch tax setting value',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Get a single tax setting by ID
     * @param {number} id - Tax setting ID
     * @returns {Promise<Object>} API response with tax setting data
     */
    async getTaxSetting(id) {
        try {
            const response = await apiService.get(`${this.baseURL}/${id}`);
            return {
                success: true,
                data: response.data,
                message: 'Tax setting retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching tax setting:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch tax setting',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Create a new tax setting
     * @param {Object} taxSettingData - Tax setting data
     * @returns {Promise<Object>} API response
     */
    async createTaxSetting(taxSettingData) {
        try {
            const response = await apiService.post(this.baseURL, taxSettingData);
            return {
                success: true,
                data: response.data,
                message: 'Tax setting created successfully'
            };
        } catch (error) {
            console.error('Error creating tax setting:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create tax setting',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Update an existing tax setting
     * @param {number} id - Tax setting ID
     * @param {Object} taxSettingData - Updated tax setting data
     * @returns {Promise<Object>} API response
     */
    async updateTaxSetting(id, taxSettingData) {
        try {
            const response = await apiService.put(`${this.baseURL}/${id}`, taxSettingData);
            return {
                success: true,
                data: response.data,
                message: 'Tax setting updated successfully'
            };
        } catch (error) {
            console.error('Error updating tax setting:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update tax setting',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Delete a tax setting
     * @param {number} id - Tax setting ID
     * @returns {Promise<Object>} API response
     */
    async deleteTaxSetting(id) {
        try {
            const response = await apiService.delete(`${this.baseURL}/${id}`);
            return {
                success: true,
                data: response.data,
                message: 'Tax setting deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting tax setting:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete tax setting',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Bulk update tax settings
     * @param {Array} updates - Array of tax setting updates
     * @returns {Promise<Object>} API response
     */
    async bulkUpdateTaxSettings(updates) {
        try {
            const response = await apiService.post(`${this.baseURL}/bulk-update`, { updates });
            return {
                success: true,
                data: response.data,
                message: 'Tax settings updated successfully'
            };
        } catch (error) {
            console.error('Error bulk updating tax settings:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update tax settings',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Export tax settings to Excel
     * @param {Object} params - Export parameters (year, filters, etc.)
     * @returns {Promise<Blob>} Excel file blob
     */
    async exportToExcel(params = {}) {
        try {
            const response = await apiService.get(`${this.baseURL}/export/excel`, {
                params,
                responseType: 'blob'
            });
            return {
                success: true,
                data: response.data,
                message: 'Tax settings exported successfully'
            };
        } catch (error) {
            console.error('Error exporting tax settings:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to export tax settings',
                errors: null
            };
        }
    }

    /**
     * Export tax settings to PDF
     * @param {Object} params - Export parameters (year, filters, etc.)
     * @returns {Promise<Blob>} PDF file blob
     */
    async exportToPDF(params = {}) {
        try {
            const response = await apiService.get(`${this.baseURL}/export/pdf`, {
                params,
                responseType: 'blob'
            });
            return {
                success: true,
                data: response.data,
                message: 'Tax settings exported successfully'
            };
        } catch (error) {
            console.error('Error exporting tax settings:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to export tax settings',
                errors: null
            };
        }
    }

    /**
     * Get available tax setting keys/types
     * @returns {Array} Available tax setting keys
     */
    getTaxSettingKeys() {
        return [
            { value: 'PERSONAL_ALLOWANCE', label: 'Personal Allowance', type: 'DEDUCTION' },
            { value: 'SPOUSE_ALLOWANCE', label: 'Spouse Allowance', type: 'DEDUCTION' },
            { value: 'CHILD_ALLOWANCE', label: 'Child Allowance', type: 'DEDUCTION' },
            { value: 'SSF_RATE', label: 'Social Security Fund Rate', type: 'RATE' },
            { value: 'SSF_MAX_CONTRIBUTION', label: 'SSF Maximum Contribution', type: 'LIMIT' },
            { value: 'PF_MIN_RATE', label: 'Provident Fund Minimum Rate', type: 'RATE' },
            { value: 'PF_MAX_RATE', label: 'Provident Fund Maximum Rate', type: 'RATE' },
            { value: 'PF_MAX_CONTRIBUTION', label: 'PF Maximum Contribution', type: 'LIMIT' },
            { value: 'WITHHOLDING_TAX_RATE', label: 'Withholding Tax Rate', type: 'RATE' },
            { value: 'OVERTIME_RATE_MULTIPLIER', label: 'Overtime Rate Multiplier', type: 'RATE' },
            { value: 'MINIMUM_WAGE', label: 'Minimum Wage', type: 'LIMIT' },
            { value: 'MAXIMUM_TAXABLE_INCOME', label: 'Maximum Taxable Income', type: 'LIMIT' }
        ];
    }

    /**
     * Get available tax setting types
     * @returns {Array} Available tax setting types
     */
    getTaxSettingTypes() {
        return [
            { value: 'DEDUCTION', label: 'Deduction' },
            { value: 'RATE', label: 'Rate (%)' },
            { value: 'LIMIT', label: 'Limit Amount' }
        ];
    }
}

export const taxSettingsService = new TaxSettingsService();

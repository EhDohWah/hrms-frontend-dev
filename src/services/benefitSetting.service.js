import { apiService } from './api.service';

class BenefitSettingService {
    constructor() {
        this.baseURL = '/benefit-settings';
    }

    /**
     * Get all benefit settings with filtering
     * @param {Object} params - Query parameters (filter_is_active, filter_setting_type)
     * @returns {Promise<Object>} API response with benefit settings data
     */
    async getBenefitSettings(params = {}) {
        try {
            const queryParams = new URLSearchParams();

            // Add all parameters from params object
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const response = await apiService.get(`${this.baseURL}?${queryParams.toString()}`);
            return response;
        } catch (error) {
            console.error('Error fetching benefit settings:', error);
            throw error;
        }
    }

    /**
     * Get a single benefit setting by ID
     * @param {number} id - Benefit setting ID
     * @returns {Promise<Object>} API response with benefit setting data
     */
    async getBenefitSetting(id) {
        try {
            const response = await apiService.get(`${this.baseURL}/${id}`);
            return {
                success: true,
                data: response.data,
                message: 'Benefit setting retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching benefit setting:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch benefit setting',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Create a new benefit setting
     * @param {Object} benefitSettingData - Benefit setting data
     * @returns {Promise<Object>} API response
     */
    async createBenefitSetting(benefitSettingData) {
        try {
            const response = await apiService.post(this.baseURL, benefitSettingData);
            return {
                success: true,
                data: response.data,
                message: 'Benefit setting created successfully'
            };
        } catch (error) {
            console.error('Error creating benefit setting:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create benefit setting',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Update an existing benefit setting
     * @param {number} id - Benefit setting ID
     * @param {Object} benefitSettingData - Updated benefit setting data
     * @returns {Promise<Object>} API response
     */
    async updateBenefitSetting(id, benefitSettingData) {
        try {
            const response = await apiService.put(`${this.baseURL}/${id}`, benefitSettingData);
            return {
                success: true,
                data: response.data,
                message: 'Benefit setting updated successfully'
            };
        } catch (error) {
            console.error('Error updating benefit setting:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update benefit setting',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Delete a benefit setting
     * @param {number} id - Benefit setting ID
     * @returns {Promise<Object>} API response
     */
    async deleteBenefitSetting(id) {
        try {
            const response = await apiService.delete(`${this.baseURL}/${id}`);
            return {
                success: true,
                data: response.data,
                message: 'Benefit setting deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting benefit setting:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete benefit setting',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Get benefit setting types
     * @returns {Array} Available benefit setting types
     */
    getBenefitSettingTypes() {
        return [
            { value: 'percentage', label: 'Percentage (%)' },
            { value: 'numeric', label: 'Numeric Value' },
            { value: 'boolean', label: 'Boolean (Yes/No)' }
        ];
    }
}

export const benefitSettingService = new BenefitSettingService();

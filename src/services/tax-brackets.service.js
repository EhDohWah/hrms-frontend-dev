import { apiService } from './api.service';

class TaxBracketsService {
    constructor() {
        this.baseURL = '/tax-brackets';
    }

    /**
     * Get all tax brackets with advanced filtering and pagination
     * @param {Object} params - Query parameters (page, per_page, search, filter_effective_year, sort_by, sort_order)
     * @returns {Promise<Object>} API response with tax brackets data
     */
    async getTaxBrackets(params = {}) {
        try {
            // Build query parameters object
            const queryParams = new URLSearchParams();

            // Add all parameters from params object
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const response = await apiService.get(`${this.baseURL}?${queryParams.toString()}`);
            return response; // This should return the full API response including pagination metadata
        } catch (error) {
            console.error('Error fetching tax brackets:', error);
            throw error;
        }
    }

    /**
     * Get tax brackets by year
     * @param {number} year - The year to filter by
     * @returns {Promise<Object>} API response with filtered tax brackets
     */
    async getTaxBracketsByYear(year) {
        try {
            const params = { filter_effective_year: year };
            const response = await apiService.get(this.baseURL, { params });
            return {
                success: true,
                data: response.data?.data || response.data,
                pagination: response.data?.pagination || null,
                message: response.data?.message || 'Tax brackets retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching tax brackets by year:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch tax brackets',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Get a single tax bracket by ID
     * @param {number} id - Tax bracket ID
     * @returns {Promise<Object>} API response with tax bracket data
     */
    async getTaxBracket(id) {
        try {
            const response = await apiService.get(`${this.baseURL}/${id}`);
            return {
                success: true,
                data: response.data?.data || response.data,
                message: response.data?.message || 'Tax bracket retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching tax bracket:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch tax bracket',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Create a new tax bracket
     * @param {Object} taxBracketData - Tax bracket data
     * @returns {Promise<Object>} API response
     */
    async createTaxBracket(taxBracketData) {
        try {
            const response = await apiService.post(this.baseURL, taxBracketData);
            return {
                success: true,
                data: response.data?.data || response.data,
                message: response.data?.message || 'Tax bracket created successfully'
            };
        } catch (error) {
            console.error('Error creating tax bracket:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create tax bracket',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Update an existing tax bracket
     * @param {number} id - Tax bracket ID
     * @param {Object} taxBracketData - Updated tax bracket data
     * @returns {Promise<Object>} API response
     */
    async updateTaxBracket(id, taxBracketData) {
        try {
            const response = await apiService.put(`${this.baseURL}/${id}`, taxBracketData);
            return {
                success: true,
                data: response.data?.data || response.data,
                message: response.data?.message || 'Tax bracket updated successfully'
            };
        } catch (error) {
            console.error('Error updating tax bracket:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update tax bracket',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Delete a tax bracket
     * @param {number} id - Tax bracket ID
     * @returns {Promise<Object>} API response
     */
    async deleteTaxBracket(id) {
        try {
            const response = await apiService.delete(`${this.baseURL}/${id}`);
            return {
                success: true,
                data: response.data?.data || response.data,
                message: response.data?.message || 'Tax bracket deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting tax bracket:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete tax bracket',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Calculate tax for a given income and year
     * @param {number} income - Annual income amount
     * @param {number} year - Tax year (optional, defaults to current year)
     * @returns {Promise<Object>} API response with tax calculation
     */
    async calculateTax(income, year = null) {
        try {
            const url = year ? `${this.baseURL}/calculate/${income}?year=${year}` : `${this.baseURL}/calculate/${income}`;
            const response = await apiService.get(url);
            return {
                success: true,
                data: response.data?.data || response.data,
                message: response.data?.message || 'Tax calculated successfully'
            };
        } catch (error) {
            console.error('Error calculating tax:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to calculate tax',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Get tax calculation breakdown for a given income
     * @param {number} income - Annual income amount
     * @param {number} year - Tax year (optional)
     * @returns {Promise<Object>} API response with detailed tax breakdown
     */
    async getTaxBreakdown(income, year = null) {
        try {
            const params = year ? { year } : {};
            const response = await apiService.get(`${this.baseURL}/breakdown/${income}`, { params });
            return {
                success: true,
                data: response.data,
                message: 'Tax breakdown retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching tax breakdown:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to get tax breakdown',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Export tax brackets to Excel
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
                message: 'Tax brackets exported successfully'
            };
        } catch (error) {
            console.error('Error exporting tax brackets:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to export tax brackets',
                errors: null
            };
        }
    }

    /**
     * Export tax brackets to PDF
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
                message: 'Tax brackets exported successfully'
            };
        } catch (error) {
            console.error('Error exporting tax brackets:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to export tax brackets',
                errors: null
            };
        }
    }

    /**
     * Validate tax bracket data before submission
     * @param {Object} bracketData - Tax bracket data to validate
     * @returns {Object} Validation result
     */
    validateTaxBracket(bracketData) {
        const errors = {};

        // Validate required fields
        if (!bracketData.min_income && bracketData.min_income !== 0) {
            errors.min_income = 'Minimum income is required';
        }

        if (!bracketData.tax_rate && bracketData.tax_rate !== 0) {
            errors.tax_rate = 'Tax rate is required';
        }

        if (!bracketData.bracket_order) {
            errors.bracket_order = 'Bracket order is required';
        }

        if (!bracketData.effective_year) {
            errors.effective_year = 'Effective year is required';
        }

        // Validate numeric values
        if (bracketData.min_income < 0) {
            errors.min_income = 'Minimum income cannot be negative';
        }

        if (bracketData.max_income && bracketData.max_income <= bracketData.min_income) {
            errors.max_income = 'Maximum income must be greater than minimum income';
        }

        if (bracketData.tax_rate < 0 || bracketData.tax_rate > 100) {
            errors.tax_rate = 'Tax rate must be between 0 and 100';
        }

        if (bracketData.bracket_order < 1) {
            errors.bracket_order = 'Bracket order must be at least 1';
        }

        const currentYear = new Date().getFullYear();
        if (bracketData.effective_year < currentYear - 10 || bracketData.effective_year > currentYear + 10) {
            errors.effective_year = `Effective year must be between ${currentYear - 10} and ${currentYear + 10}`;
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Format income range for display
     * @param {number} minIncome - Minimum income
     * @param {number} maxIncome - Maximum income (null for unlimited)
     * @returns {string} Formatted income range
     */
    formatIncomeRange(minIncome, maxIncome) {
        const formatCurrency = (amount) => {
            return `฿${amount.toLocaleString('en-US')}`;
        };

        if (maxIncome === null || maxIncome === undefined) {
            return `${formatCurrency(minIncome)}+`;
        }

        return `${formatCurrency(minIncome)} - ${formatCurrency(maxIncome)}`;
    }

    /**
     * Format tax rate for display
     * @param {number} rate - Tax rate (decimal)
     * @returns {string} Formatted tax rate with percentage
     */
    formatTaxRate(rate) {
        return `${rate}%`;
    }
}

export const taxBracketsService = new TaxBracketsService();

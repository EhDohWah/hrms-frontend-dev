import { apiService } from './api.service';

class TaxCalculationsService {
    constructor() {
        this.baseURL = '/tax-calculations';
    }

    /**
     * Calculate full payroll taxes and deductions
     * @param {Object} payrollData - Payroll calculation data
     * @returns {Promise<Object>} API response with complete payroll calculation
     */
    async calculatePayroll(payrollData) {
        try {
            const response = await apiService.post(`${this.baseURL}/payroll`, payrollData);
            return {
                success: true,
                data: response.data,
                message: 'Payroll calculated successfully'
            };
        } catch (error) {
            console.error('Error calculating payroll:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to calculate payroll',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Calculate income tax only
     * @param {Object} incomeData - Income tax calculation data
     * @returns {Promise<Object>} API response with income tax calculation
     */
    async calculateIncomeTax(incomeData) {
        try {
            const response = await apiService.post(`${this.baseURL}/income-tax`, incomeData);
            return {
                success: true,
                data: response.data,
                message: 'Income tax calculated successfully'
            };
        } catch (error) {
            console.error('Error calculating income tax:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to calculate income tax',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Calculate social security contribution
     * @param {Object} socialSecurityData - Social security calculation data
     * @returns {Promise<Object>} API response with social security calculation
     */
    async calculateSocialSecurity(socialSecurityData) {
        try {
            const response = await apiService.post(`${this.baseURL}/social-security`, socialSecurityData);
            return {
                success: true,
                data: response.data,
                message: 'Social security calculated successfully'
            };
        } catch (error) {
            console.error('Error calculating social security:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to calculate social security',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Calculate provident fund contribution
     * @param {Object} providentFundData - Provident fund calculation data
     * @returns {Promise<Object>} API response with provident fund calculation
     */
    async calculateProvidentFund(providentFundData) {
        try {
            const response = await apiService.post(`${this.baseURL}/provident-fund`, providentFundData);
            return {
                success: true,
                data: response.data,
                message: 'Provident fund calculated successfully'
            };
        } catch (error) {
            console.error('Error calculating provident fund:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to calculate provident fund',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Get tax calculation history for an employee
     * @param {number} employeeId - Employee ID
     * @param {Object} params - Query parameters (year, month, etc.)
     * @returns {Promise<Object>} API response with calculation history
     */
    async getCalculationHistory(employeeId, params = {}) {
        try {
            const response = await apiService.get(`${this.baseURL}/history/${employeeId}`, { params });
            return {
                success: true,
                data: response.data,
                message: 'Calculation history retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching calculation history:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch calculation history',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Save tax calculation result
     * @param {Object} calculationData - Tax calculation data to save
     * @returns {Promise<Object>} API response
     */
    async saveCalculation(calculationData) {
        try {
            const response = await apiService.post(`${this.baseURL}/save`, calculationData);
            return {
                success: true,
                data: response.data,
                message: 'Tax calculation saved successfully'
            };
        } catch (error) {
            console.error('Error saving tax calculation:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to save tax calculation',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Get saved tax calculation by ID
     * @param {number} calculationId - Calculation ID
     * @returns {Promise<Object>} API response with calculation data
     */
    async getCalculation(calculationId) {
        try {
            const response = await apiService.get(`${this.baseURL}/${calculationId}`);
            return {
                success: true,
                data: response.data,
                message: 'Tax calculation retrieved successfully'
            };
        } catch (error) {
            console.error('Error fetching tax calculation:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch tax calculation',
                errors: error.response?.data?.errors || null
            };
        }
    }

    /**
     * Export tax calculation to PDF
     * @param {number} calculationId - Calculation ID
     * @returns {Promise<Blob>} PDF file blob
     */
    async exportCalculationToPDF(calculationId) {
        try {
            const response = await apiService.get(`${this.baseURL}/${calculationId}/export/pdf`, {
                responseType: 'blob'
            });
            return {
                success: true,
                data: response.data,
                message: 'Tax calculation exported successfully'
            };
        } catch (error) {
            console.error('Error exporting tax calculation:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to export tax calculation',
                errors: null
            };
        }
    }

    /**
     * Client-side tax calculation helper (for real-time calculation)
     * @param {Object} inputData - Calculation input data
     * @param {Object} taxSettings - Tax settings data
     * @param {Array} taxBrackets - Tax brackets data
     * @returns {Object} Calculated tax breakdown
     */
    calculateTaxClientSide(inputData, taxSettings, taxBrackets) {
        try {
            const {
                monthly_salary = 0,
                annual_salary = 0,
                allowances = 0,
                other_income = 0,
                deductions = 0,
                dependents = 0
            } = inputData;

            // Calculate gross income
            const grossIncome = (annual_salary || monthly_salary * 12) + allowances + other_income;

            // Get tax settings values
            const personalAllowance = this.getTaxSettingValue(taxSettings, 'PERSONAL_ALLOWANCE', 60000);
            const childAllowance = this.getTaxSettingValue(taxSettings, 'CHILD_ALLOWANCE', 30000);
            const ssfRate = this.getTaxSettingValue(taxSettings, 'SSF_RATE', 5) / 100;
            const ssfMaxContribution = this.getTaxSettingValue(taxSettings, 'SSF_MAX_CONTRIBUTION', 15000);
            const pfMinRate = this.getTaxSettingValue(taxSettings, 'PF_MIN_RATE', 3) / 100;
            const pfMaxRate = this.getTaxSettingValue(taxSettings, 'PF_MAX_RATE', 15) / 100;

            // Calculate deductions
            const totalPersonalDeductions = personalAllowance + deductions + (dependents * childAllowance);
            const taxableIncome = Math.max(0, grossIncome - totalPersonalDeductions);

            // Calculate progressive income tax
            const incomeTax = this.calculateProgressiveTax(taxableIncome, taxBrackets);

            // Calculate social security (5% of monthly salary, capped)
            const monthlySalaryForSSF = Math.min(monthly_salary || (annual_salary / 12), ssfMaxContribution / 12);
            const socialSecurity = (monthlySalaryForSSF * ssfRate) * 12;

            // Calculate provident fund (configurable rate of monthly salary)
            const pfRate = Math.min(Math.max(pfMinRate, 0.05), pfMaxRate); // Default 5%, within limits
            const providentFund = ((monthly_salary || (annual_salary / 12)) * pfRate) * 12;

            // Calculate net income
            const netIncome = grossIncome - incomeTax - socialSecurity - providentFund;

            return {
                success: true,
                data: {
                    gross_income: grossIncome,
                    taxable_income: taxableIncome,
                    personal_deductions: totalPersonalDeductions,
                    income_tax: incomeTax,
                    social_security: socialSecurity,
                    provident_fund: providentFund,
                    net_income: netIncome,
                    tax_breakdown: this.getTaxBreakdown(taxableIncome, taxBrackets),
                    effective_tax_rate: grossIncome > 0 ? ((incomeTax / grossIncome) * 100) : 0,
                    marginal_tax_rate: this.getMarginalTaxRate(taxableIncome, taxBrackets)
                }
            };
        } catch (error) {
            console.error('Error in client-side tax calculation:', error);
            return {
                success: false,
                message: 'Error calculating taxes',
                errors: error.message
            };
        }
    }

    /**
     * Calculate progressive tax based on brackets
     * @param {number} taxableIncome - Taxable income amount
     * @param {Array} taxBrackets - Tax brackets array
     * @returns {number} Calculated tax amount
     */
    calculateProgressiveTax(taxableIncome, taxBrackets) {
        if (!taxBrackets || taxBrackets.length === 0) {
            return 0;
        }

        // Sort brackets by min_income
        const sortedBrackets = [...taxBrackets].sort((a, b) => a.min_income - b.min_income);

        let tax = 0;
        let remainingIncome = taxableIncome;

        for (const bracket of sortedBrackets) {
            if (remainingIncome <= 0) break;

            const bracketMin = bracket.min_income;
            const bracketMax = bracket.max_income || Infinity;
            const bracketRate = bracket.tax_rate / 100;

            if (taxableIncome > bracketMin) {
                const taxableInBracket = Math.min(remainingIncome, bracketMax - bracketMin);
                tax += taxableInBracket * bracketRate;
                remainingIncome -= taxableInBracket;
            }
        }

        return Math.max(0, tax);
    }

    /**
     * Get tax breakdown by bracket
     * @param {number} taxableIncome - Taxable income amount
     * @param {Array} taxBrackets - Tax brackets array
     * @returns {Array} Tax breakdown by bracket
     */
    getTaxBreakdown(taxableIncome, taxBrackets) {
        if (!taxBrackets || taxBrackets.length === 0) {
            return [];
        }

        const sortedBrackets = [...taxBrackets].sort((a, b) => a.min_income - b.min_income);
        const breakdown = [];
        let remainingIncome = taxableIncome;

        for (const bracket of sortedBrackets) {
            if (remainingIncome <= 0) break;

            const bracketMin = bracket.min_income;
            const bracketMax = bracket.max_income || Infinity;
            const bracketRate = bracket.tax_rate / 100;

            if (taxableIncome > bracketMin) {
                const taxableInBracket = Math.min(remainingIncome, bracketMax - bracketMin);
                const taxInBracket = taxableInBracket * bracketRate;

                breakdown.push({
                    bracket_order: bracket.bracket_order,
                    income_range: this.formatIncomeRange(bracketMin, bracket.max_income),
                    tax_rate: bracket.tax_rate,
                    taxable_amount: taxableInBracket,
                    tax_amount: taxInBracket
                });

                remainingIncome -= taxableInBracket;
            }
        }

        return breakdown;
    }

    /**
     * Get marginal tax rate for given income
     * @param {number} taxableIncome - Taxable income amount
     * @param {Array} taxBrackets - Tax brackets array
     * @returns {number} Marginal tax rate percentage
     */
    getMarginalTaxRate(taxableIncome, taxBrackets) {
        if (!taxBrackets || taxBrackets.length === 0) {
            return 0;
        }

        const sortedBrackets = [...taxBrackets].sort((a, b) => a.min_income - b.min_income);

        for (const bracket of sortedBrackets) {
            const bracketMin = bracket.min_income;
            const bracketMax = bracket.max_income || Infinity;

            if (taxableIncome >= bracketMin && taxableIncome <= bracketMax) {
                return bracket.tax_rate;
            }
        }

        // If income is higher than all brackets, return the highest rate
        return sortedBrackets[sortedBrackets.length - 1]?.tax_rate || 0;
    }

    /**
     * Get tax setting value by key
     * @param {Array} taxSettings - Tax settings array
     * @param {string} key - Setting key
     * @param {number} defaultValue - Default value if not found
     * @returns {number} Setting value
     */
    getTaxSettingValue(taxSettings, key, defaultValue = 0) {
        if (!taxSettings || !Array.isArray(taxSettings)) {
            return defaultValue;
        }

        const setting = taxSettings.find(s => s.setting_key === key && s.is_active);
        return setting ? parseFloat(setting.setting_value) : defaultValue;
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
     * Format currency for display
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    formatCurrency(amount) {
        if (!amount && amount !== 0) return '฿0.00';
        return `฿${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    /**
     * Validate calculation input data
     * @param {Object} inputData - Input data to validate
     * @returns {Object} Validation result
     */
    validateCalculationInput(inputData) {
        const errors = {};

        // Validate salary
        if (!inputData.monthly_salary && !inputData.annual_salary) {
            errors.salary = 'Either monthly or annual salary is required';
        }

        if (inputData.monthly_salary && inputData.monthly_salary < 0) {
            errors.monthly_salary = 'Monthly salary cannot be negative';
        }

        if (inputData.annual_salary && inputData.annual_salary < 0) {
            errors.annual_salary = 'Annual salary cannot be negative';
        }

        // Validate other income fields
        if (inputData.allowances && inputData.allowances < 0) {
            errors.allowances = 'Allowances cannot be negative';
        }

        if (inputData.other_income && inputData.other_income < 0) {
            errors.other_income = 'Other income cannot be negative';
        }

        if (inputData.deductions && inputData.deductions < 0) {
            errors.deductions = 'Deductions cannot be negative';
        }

        if (inputData.dependents && (inputData.dependents < 0 || !Number.isInteger(inputData.dependents))) {
            errors.dependents = 'Dependents must be a non-negative integer';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export const taxCalculationsService = new TaxCalculationsService();

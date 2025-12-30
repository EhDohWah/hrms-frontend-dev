import { ref, computed } from 'vue';
import { employmentService } from '@/services/employment.service';
import { message } from 'ant-design-vue';

/**
 * Composable for real-time allocation amount calculations
 * 
 * This composable provides a reactive interface to the backend calculation API.
 * It manages loading states, error handling, and provides formatted results.
 * 
 * Backend automatically uses correct salary field:
 * - probation_salary: If employee is in probation period
 * - pass_probation_salary: If employee has passed probation
 * 
 * FTE is sent as percentage (0-100) but stored as decimal (0.60 for 60%) in database
 * 
 * @returns {Object} Calculation interface
 * @property {Ref<boolean>} calculating - Loading state
 * @property {Ref<Object>} calculationResult - Full calculation result from API
 * @property {Ref<Error>} calculationError - Last error if any
 * @property {Function} calculateAmount - Perform calculation
 * @property {ComputedRef<string>} formattedAmount - Formatted currency string
 * @property {ComputedRef<number>} allocatedAmount - Calculated amount as number
 * 
 * @example
 * const { calculating, formattedAmount, calculateAmount } = useAllocationCalculation();
 * 
 * // Calculate when FTE changes
 * watch(() => allocation.fte, async (newFte) => {
 *   await calculateAmount(employmentId, newFte);
 * });
 * 
 * // Display in template
 * <span v-if="calculating">Calculating...</span>
 * <span v-else>{{ formattedAmount }}</span>
 */
export function useAllocationCalculation() {
    const calculating = ref(false);
    const calculationResult = ref(null);
    const calculationError = ref(null);

    /**
     * Calculate allocation amount based on employment and FTE
     * Supports both existing employments (by ID) and new employments (by salary data)
     * 
     * @param {number|Object} employmentIdOrData - Either employment ID (number) or salary data object
     * @param {number} ftePercentage - FTE percentage (0-100)
     * @returns {Promise<Object>} Calculation result
     * 
     * @example
     * // For existing employment
     * await calculateAmount(123, 60);
     * 
     * @example
     * // For new employment
     * await calculateAmount({
     *   probation_salary: 45000,
     *   pass_probation_salary: 50000,
     *   pass_probation_date: '2025-03-01',
     *   start_date: '2024-12-01'
     * }, 60);
     */
    const calculateAmount = async (employmentIdOrData, ftePercentage) => {
        // Validate FTE
        if (!ftePercentage || ftePercentage <= 0) {
            calculationResult.value = {
                allocated_amount: 0,
                formatted_amount: '฿0.00',
                base_salary: 0,
                salary_type: null,
                salary_type_label: null,
                calculation_formula: null
            };
            return calculationResult.value;
        }

        // Validate FTE range
        if (ftePercentage > 100) {
            calculationError.value = new Error('FTE percentage cannot exceed 100%');
            message.warning('FTE percentage cannot exceed 100%');
            calculationResult.value = {
                allocated_amount: 0,
                formatted_amount: '฿0.00',
                base_salary: 0,
                salary_type: null,
                salary_type_label: null,
                calculation_formula: null
            };
            return calculationResult.value;
        }

        calculating.value = true;
        calculationError.value = null;

        try {
            // Prepare request data
            let requestData = { fte: ftePercentage };

            if (typeof employmentIdOrData === 'number') {
                // Existing employment by ID
                requestData.employment_id = employmentIdOrData;
            } else if (typeof employmentIdOrData === 'object' && employmentIdOrData !== null) {
                // New employment with salary data
                requestData = {
                    ...requestData,
                    probation_salary: employmentIdOrData.probation_salary,
                    pass_probation_salary: employmentIdOrData.pass_probation_salary,
                    pass_probation_date: employmentIdOrData.pass_probation_date,
                    start_date: employmentIdOrData.start_date,
                    calculation_date: employmentIdOrData.calculation_date
                };
            } else {
                throw new Error('Invalid employment data provided');
            }

            const response = await employmentService.calculateAllocationAmount(requestData);

            if (response.success) {
                calculationResult.value = response.data;
                return response.data;
            } else {
                throw new Error(response.message || 'Calculation failed');
            }
        } catch (error) {
            console.error('Error calculating allocation amount:', error);
            calculationError.value = error;

            // Handle specific error types
            if (error.response?.status === 404) {
                message.error('Employment not found');
            } else if (error.response?.status === 422) {
                const errorMsg = error.response?.data?.message || 'Invalid calculation parameters';
                message.error(errorMsg);
            } else {
                message.error('Failed to calculate allocation amount');
            }

            // Return zero values on error
            calculationResult.value = {
                allocated_amount: 0,
                formatted_amount: '฿0.00',
                base_salary: 0,
                salary_type: null,
                salary_type_label: null,
                calculation_formula: null
            };

            return calculationResult.value;
        } finally {
            calculating.value = false;
        }
    };

    /**
     * Formatted currency amount (reactive)
     */
    const formattedAmount = computed(() => {
        return calculationResult.value?.formatted_amount || '฿0.00';
    });

    /**
     * Raw allocated amount (reactive)
     */
    const allocatedAmount = computed(() => {
        return calculationResult.value?.allocated_amount || 0;
    });

    /**
     * Base salary used for calculation (reactive)
     */
    const baseSalary = computed(() => {
        return calculationResult.value?.base_salary || 0;
    });

    /**
     * Salary type used (probation_salary or pass_probation_salary) (reactive)
     */
    const salaryType = computed(() => {
        return calculationResult.value?.salary_type || null;
    });

    /**
     * Salary type label (human-readable) (reactive)
     */
    const salaryTypeLabel = computed(() => {
        return calculationResult.value?.salary_type_label || null;
    });

    /**
     * Calculation formula string (reactive)
     */
    const calculationFormula = computed(() => {
        return calculationResult.value?.calculation_formula || null;
    });

    /**
     * Is in probation period (reactive)
     */
    const isProbationPeriod = computed(() => {
        return calculationResult.value?.is_probation_period || false;
    });

    return {
        calculating,
        calculationResult,
        calculationError,
        calculateAmount,
        formattedAmount,
        allocatedAmount,
        baseSalary,
        salaryType,
        salaryTypeLabel,
        calculationFormula,
        isProbationPeriod
    };
}


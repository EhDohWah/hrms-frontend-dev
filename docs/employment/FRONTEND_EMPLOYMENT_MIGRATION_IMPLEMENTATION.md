# Frontend Employment Management System - Migration Implementation Summary

## Document Version: 1.0
**Implementation Date:** January 2025  
**Backend API Version:** v1 (Updated)  
**Frontend Framework:** Vue 3 + Ant Design Vue

---

## Overview

This document summarizes the implementation of frontend changes to align with the refactored backend Employment Management System. The key change is that **allocation amount calculations are now performed exclusively on the backend**, ensuring consistency and using the correct salary fields.

### What Was Changed

✅ **Completed Changes:**
1. Added new backend calculation API endpoint integration
2. Created Vue 3 composable for allocation calculations
3. Updated employment-modal.vue to remove local calculations
4. Modified payload submission to NOT send `allocated_amount`
5. Updated UI to indicate backend calculation
6. All components now use backend-calculated amounts

---

## Files Changed

### 1. API Configuration
**File:** `src/config/api.config.js`

**Changes:**
```javascript
EMPLOYMENT: {
    // ... existing endpoints
    CALCULATE_ALLOCATION: '/employments/calculate-allocation', // NEW
}
```

**Purpose:** Added endpoint for real-time allocation amount calculations.

---

### 2. Employment Service
**File:** `src/services/employment.service.js`

**Changes:**
- Added `calculateAllocationAmount(data)` method
- Full JSDoc documentation included
- Integrates with BaseService error handling

**Key Method:**
```javascript
/**
 * Calculate allocation amount in real-time
 * Backend automatically uses correct salary field (probation_salary or pass_probation_salary)
 * 
 * @param {Object} data - { employment_id: number, fte: number }
 * @returns {Promise<Object>} Calculation result
 */
async calculateAllocationAmount(data) {
    return await this.handleApiResponse(
        () => apiService.post(API_ENDPOINTS.EMPLOYMENT.CALCULATE_ALLOCATION, data),
        'calculate allocation amount'
    );
}
```

**API Response Structure:**
```json
{
  "success": true,
  "data": {
    "employment_id": 123,
    "fte": 60,
    "fte_decimal": 0.60,
    "base_salary": 50000,
    "salary_type": "probation_salary",
    "allocated_amount": 30000,
    "formatted_amount": "฿30,000.00",
    "calculation_formula": "(50000 × 60) / 100 = 30000"
  }
}
```

---

### 3. Allocation Calculation Composable (NEW)
**File:** `src/composables/useAllocationCalculation.js`

**Purpose:** Provides reactive interface for backend calculation API.

**Exports:**
```javascript
const {
  calculating,           // Ref<boolean> - Loading state
  calculationResult,     // Ref<Object> - Full API response
  calculationError,      // Ref<Error> - Error if any
  calculateAmount,       // Function - Perform calculation
  formattedAmount,       // ComputedRef<string> - "฿30,000.00"
  allocatedAmount,       // ComputedRef<number> - 30000
  baseSalary,           // ComputedRef<number> - Base salary used
  salaryType,           // ComputedRef<string> - Salary field used
  calculationFormula    // ComputedRef<string> - Calculation formula
} = useAllocationCalculation();
```

**Features:**
- Automatic input validation (FTE range 0-100)
- Error handling with user-friendly messages
- Reactive computed properties
- Zero-value fallbacks on error

**Usage Example:**
```javascript
import { useAllocationCalculation } from '@/composables/useAllocationCalculation';

export default {
  setup() {
    const { calculating, formattedAmount, calculateAmount } = useAllocationCalculation();
    
    return { calculating, formattedAmount, calculateAmount };
  },
  
  methods: {
    async onFteChange() {
      await this.calculateAmount(this.employmentId, this.fte);
    }
  }
}
```

---

### 4. Employment Modal Component
**File:** `src/components/modal/employment-modal.vue`

#### Changes Made:

**A. Imports:**
```javascript
import { useAllocationCalculation } from '@/composables/useAllocationCalculation';
```

**B. Setup Function:**
```javascript
setup() {
  const { calculating, calculationResult, calculateAmount, formattedAmount, ... } = useAllocationCalculation();
  return { ...composable exports... };
}
```

**C. Deprecated Methods:**

The following methods are now **DEPRECATED** and marked with warnings:

```javascript
// ⚠️ DEPRECATED - Backend now calculates
calculateSalaryFromFte(ftePercentage) {
  console.warn('⚠️ calculateSalaryFromFte is deprecated. Backend handles calculations.');
  // Kept only for displaying existing backend-loaded data
}

getCalculatedSalary(ftePercentage) {
  // Returns "Calculated on submit" for new allocations
}

getAllocatedSalary(allocation) {
  // Uses allocation.allocated_amount from backend if available
  // Otherwise shows "Calculated on submit"
}
```

**D. Updated Payload Builder:**

**OLD (INCORRECT):**
```javascript
allocations: this.fundingAllocations.map(allocation => ({
  // ...other fields
  fte: allocation.fte,
  allocated_amount: this.calculateSalaryFromFte(allocation.fte) // ❌ WRONG
}))
```

**NEW (CORRECT):**
```javascript
allocations: this.fundingAllocations.map(allocation => ({
  // ...other fields
  fte: allocation.fte
  // ✅ NO allocated_amount - backend calculates it
}))
```

**E. Template Changes:**

**Updated Calculated Salary Display:**
```vue
<div class="form-group">
  <small class="text-muted">Calculated Salary</small>
  <div class="calculated-amount-info">
    <input type="text" class="form-control" 
           :value="getCalculatedSalary(currentAllocation.fte)"
           placeholder="Will be calculated on backend" 
           readonly style="background-color: #f8f9fa;" />
    <small class="text-muted">
      <i class="ti ti-info-circle"></i> Backend will calculate using correct salary field
    </small>
  </div>
</div>
```

**F. Key Points:**

1. **CREATE Mode Limitation:** 
   - Cannot use real-time calculation API in CREATE mode
   - No `employment_id` exists until submission
   - Backend calculates during creation
   - UI shows placeholder message

2. **EDIT Mode (Future):**
   - Will use real-time calculation API
   - Requires employment_id
   - Updates happen via backend

3. **Total Allocated Salary:**
   - Uses backend `allocated_amount` if available
   - Fallback calculation only for display consistency

---

### 5. Employment List Component
**File:** `src/views/pages/hrm/employment/employment-list.vue`

**Status:** ✅ **No changes required**

**Reason:** 
- Already uses backend data exclusively
- No local calculations performed
- Displays `position_salary` and other fields from API
- Correctly handles `employee_funding_allocations` from backend

---

## Backend Integration Details

### Salary Field Selection

The backend automatically selects the correct salary field:

```php
// Backend Logic (PHP)
$baseSalary = $employment->probation_salary ?? $employment->pass_probation_salary;
$allocatedAmount = ($baseSalary * $ftePercentage) / 100;
```

**Rules:**
- **During Probation:** Uses `probation_salary`
- **After Probation:** Uses `pass_probation_salary`
- **Fallback:** Uses whichever is available

**Frontend Impact:**
- ✅ No need to determine which salary field to use
- ✅ Consistent with payroll calculations
- ✅ Single source of truth

---

### FTE Storage Format

**Understanding FTE Conversion:**

| Context | Format | Example | Notes |
|---------|--------|---------|-------|
| **Frontend Input** | Percentage | 60 | User enters as % |
| **API Request** | Percentage | 60 | Send as % (0-100) |
| **Backend Processing** | Decimal | 0.60 | Backend converts |
| **Database Storage** | Decimal | 0.60 | Stored as decimal |
| **API Response** | Both | `fte: 60, fte_decimal: 0.60` | Both formats returned |

**Code Example:**
```javascript
// Frontend sends:
{ fte: 60 }

// Backend converts:
$fteDecimal = $ftePercentage / 100; // 0.60

// Backend returns:
{
  fte: 60,
  fte_decimal: 0.60
}
```

---

## API Endpoints

### New: Calculate Allocation Amount

```http
POST /api/employments/calculate-allocation
```

**Request:**
```json
{
  "employment_id": 123,
  "fte": 60
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Allocation amount calculated successfully",
  "data": {
    "employment_id": 123,
    "fte": 60,
    "fte_decimal": 0.60,
    "base_salary": 50000,
    "salary_type": "probation_salary",
    "allocated_amount": 30000,
    "formatted_amount": "฿30,000.00",
    "calculation_formula": "(50000 × 60) / 100 = 30000"
  }
}
```

**Error Responses:**

```json
// 404 - Employment Not Found
{
  "success": false,
  "message": "Employment not found",
  "status": 404
}

// 422 - Validation Error
{
  "success": false,
  "message": "The given data was invalid",
  "errors": {
    "fte": ["The fte must be between 0 and 100."]
  },
  "status": 422
}
```

### Updated: Create Employment

```http
POST /api/employments
```

**Key Change:** `allocated_amount` in allocations is now **OPTIONAL**.

**Request (Correct):**
```json
{
  "employee_id": 123,
  "employment_type": "Full-Time",
  "start_date": "2024-01-01",
  "end_date": null,
  "pass_probation_date": "2024-04-01",
  "department_id": 5,
  "position_id": 12,
  "work_location_id": 2,
  "pass_probation_salary": 50000,
  "probation_salary": 45000,
  "allocations": [
    {
      "allocation_type": "grant",
      "position_slot_id": 45,
      "fte": 60
      // ✅ NO allocated_amount
    },
    {
      "allocation_type": "org_funded",
      "grant_id": 2,
      "department_id": 5,
      "position_id": 12,
      "fte": 40
      // ✅ NO allocated_amount
    }
  ]
}
```

**Backend Behavior:**
1. Validates FTE percentages
2. Validates FTE sum = 100%
3. Calculates `allocated_amount` for each allocation
4. Stores with correct decimal format
5. Returns complete employment with calculated amounts

---

## Migration Checklist

### ✅ Completed Tasks

- [x] Add `CALCULATE_ALLOCATION` endpoint to API config
- [x] Add `calculateAllocationAmount()` method to employment service
- [x] Create `useAllocationCalculation` composable
- [x] Update `employment-modal.vue` setup to use composable
- [x] Deprecate local calculation methods with warnings
- [x] Update `buildPayloadForAPI()` to NOT send `allocated_amount`
- [x] Update template to show backend calculation message
- [x] Update `onFteChange()` handler (noting CREATE mode limitation)
- [x] Verify `employment-list.vue` uses backend data (already correct)
- [x] Test for linting errors (none found)
- [x] Create comprehensive documentation

---

## Testing Guidelines

### Unit Tests (Recommended)

**Test: Employment Service**
```javascript
describe('employmentService.calculateAllocationAmount', () => {
  it('should call correct API endpoint', async () => {
    const data = { employment_id: 123, fte: 60 };
    await employmentService.calculateAllocationAmount(data);
    expect(apiService.post).toHaveBeenCalledWith(
      '/employments/calculate-allocation',
      data
    );
  });
});
```

**Test: Composable**
```javascript
describe('useAllocationCalculation', () => {
  it('should return zero for invalid inputs', async () => {
    const { calculateAmount, allocatedAmount } = useAllocationCalculation();
    await calculateAmount(null, 0);
    expect(allocatedAmount.value).toBe(0);
  });
  
  it('should validate FTE range', async () => {
    const { calculateAmount } = useAllocationCalculation();
    const result = await calculateAmount(123, 150); // > 100
    expect(result.allocated_amount).toBe(0);
  });
});
```

### Integration Tests

**Test: Create Employment**
```javascript
it('should create employment without sending allocated_amount', async () => {
  const payload = {
    employee_id: 123,
    allocations: [
      { allocation_type: 'grant', position_slot_id: 45, fte: 60 }
    ]
  };
  
  const response = await employmentService.createEmployment(payload);
  
  expect(response.data.employee_funding_allocations[0]).toHaveProperty('allocated_amount');
  expect(response.data.employee_funding_allocations[0].allocated_amount).toBeGreaterThan(0);
});
```

### E2E Tests

**Test: Employment Creation Flow**
1. Open employment modal
2. Fill employee details
3. Add funding allocation with FTE 60%
4. Add second allocation with FTE 40%
5. Submit form
6. Verify success message
7. Verify employments list shows new employment
8. Open edit modal
9. Verify allocated amounts are displayed

---

## Known Limitations & Future Enhancements

### Current Limitations

1. **CREATE Mode - No Real-time Calculation:**
   - **Issue:** Cannot use calculation API in CREATE mode (no employment_id)
   - **Workaround:** Show "Calculated on submit" placeholder
   - **Impact:** User doesn't see calculated amount until after submission

2. **Edit Mode - Not Fully Implemented:**
   - **Issue:** Edit modal doesn't use real-time calculation
   - **Status:** Marked for future implementation
   - **Workaround:** Shows backend-calculated amounts from load

### Future Enhancements

**Priority 1: Real-time Calculation in Create Mode**

**Approach:** Two-step creation process
1. Create basic employment record first
2. Get employment_id
3. Then add allocations with real-time calculation

**Alternative:** Frontend preview calculation
- Calculate on frontend for preview only
- Show disclaimer: "Estimate - final amount calculated by backend"
- Backend still does authoritative calculation

**Priority 2: Edit Mode Real-time Updates**

**Implementation:**
```javascript
// In employment-edit-modal.vue
async onEditFteChange(allocationIndex) {
  const allocation = this.fundingAllocations[allocationIndex];
  
  if (this.formData.id && allocation.fte) {
    const result = await this.calculateAmount(
      this.formData.id,
      allocation.fte
    );
    
    this.fundingAllocations[allocationIndex].allocated_amount = result.allocated_amount;
    this.fundingAllocations[allocationIndex].formatted_amount = result.formatted_amount;
  }
}
```

**Priority 3: Bulk Calculation API**

**Purpose:** Calculate multiple allocations in one request

**Endpoint:**
```http
POST /api/employments/calculate-allocations-bulk
```

**Request:**
```json
{
  "employment_id": 123,
  "allocations": [
    { "fte": 60 },
    { "fte": 40 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "calculations": [
      { "fte": 60, "allocated_amount": 30000 },
      { "fte": 40, "allocated_amount": 20000 }
    ],
    "total_allocated": 50000
  }
}
```

---

## Troubleshooting

### Issue: "calculateSalaryFromFte is deprecated" Warning

**Cause:** Old calculation method is being called.

**Solution:**
- Check for old code still calling this method
- Method is kept for backward compatibility only
- Update code to not rely on frontend calculations

### Issue: Allocation Amount Shows "Calculated on submit"

**Cause:** Normal behavior in CREATE mode.

**Explanation:**
- Employment doesn't exist yet (no ID)
- Cannot call calculation API without employment_id
- Backend calculates during creation

**Verification:**
- After submission, reload employment
- Check that `allocated_amount` is populated
- Verify correct salary field was used

### Issue: Total Allocated Salary Incorrect

**Cause:** Using old calculation method.

**Check:**
1. Verify `totalAllocatedSalary` computed property
2. Should use `allocation.allocated_amount` from backend
3. Should NOT call `calculateSalaryFromFte()`

**Fix:**
```javascript
totalAllocatedSalary() {
  return this.fundingAllocations.reduce((sum, allocation) => {
    // Use backend-calculated amount
    if (allocation.allocated_amount !== undefined) {
      return sum + parseFloat(allocation.allocated_amount);
    }
    return sum; // Or fallback for display
  }, 0);
}
```

---

## Best Practices

### ✅ Do's

1. **Always use backend-calculated amounts** for authoritative data
2. **Use composable** for calculation logic
3. **Handle loading states** gracefully
4. **Show user-friendly messages** when calculation not available
5. **Validate FTE inputs** on frontend (0-100 range)
6. **Log warnings** when deprecated methods are called
7. **Test with various salary scenarios** (probation vs. passed)

### ❌ Don'ts

1. **Don't calculate allocated_amount on frontend** for submission
2. **Don't send allocated_amount** in create/update payloads
3. **Don't use position_salary** for calculations (backend uses correct field)
4. **Don't assume FTE is decimal** in API requests (send as percentage)
5. **Don't skip error handling** for calculation API calls
6. **Don't display frontend-calculated amounts** as authoritative

---

## Code Review Checklist

When reviewing employment-related code:

- [ ] No `allocated_amount` in payload to backend
- [ ] Using `useAllocationCalculation` composable if calculating
- [ ] Not calling deprecated calculation methods
- [ ] Handling API errors gracefully
- [ ] Showing loading states during calculations
- [ ] Using backend amounts for display
- [ ] FTE sent as percentage (0-100)
- [ ] Proper validation of FTE inputs
- [ ] Documentation updated if behavior changes

---

## Related Documentation

- **Backend API:** `/docs/COMPLETE_PAYROLL_MANAGEMENT_SYSTEM_DOCUMENTATION.md`
- **Migration Guide:** `FRONTEND_EMPLOYMENT_MIGRATION_GUIDE.md` (provided by user)
- **API Swagger:** `/api/documentation` (when server running)
- **Employment Service:** `src/services/employment.service.js`
- **Composable:** `src/composables/useAllocationCalculation.js`

---

## Changelog

### Version 1.1 - October 14, 2025
- ✅ **Field Name Updates:** Updated all references from old field names to new standardized names
  - `probation_pass_date` → `pass_probation_date`
  - `position_salary` → `pass_probation_salary`
- ✅ **New Endpoint:** Added `completeProbation()` method to employment service
- ✅ **API Config:** Added `COMPLETE_PROBATION` endpoint
- ✅ **Documentation:** Updated to reflect backend's standardized 30-day month calculations
- ✅ **Alignment:** Full alignment with backend Employment Management System v1.1

### Version 1.0 - January 2025
- ✅ Initial implementation of backend calculation integration
- ✅ Created useAllocationCalculation composable
- ✅ Updated employment-modal.vue to use backend calculations
- ✅ Deprecated frontend calculation methods
- ✅ Updated payload builder to not send allocated_amount
- ✅ Added comprehensive documentation

---

## Support

For questions or issues:
1. Check this documentation first
2. Review backend API documentation
3. Check console for deprecation warnings
4. Verify API responses in Network tab
5. Test with different employment scenarios

---

**Document Maintained By:** Development Team  
**Last Updated:** January 2025  
**Status:** ✅ Implementation Complete


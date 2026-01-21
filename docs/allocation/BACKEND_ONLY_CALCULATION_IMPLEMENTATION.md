# Backend-Only Calculation Implementation

## Summary
All frontend local salary calculations have been completely removed. The system now relies **100% on backend API** for allocation amount calculations.

## Changes Made

### 1. Removed Local Calculation Fallbacks

#### `getCalculatedSalary()` - Line 2077
**Before:** Had local fallback calculation
```javascript
// Fallback to local calculation if backend hasn't calculated yet
const baseSalary = this.formData.probation_salary || this.formData.pass_probation_salary;
const calculatedAmount = (baseSalary * ftePercentage) / 100;
```

**After:** Shows ONLY backend results
```javascript
// ONLY use backend calculation result
if (this.calculationResult && this.calculationResult.fte === ftePercentage) {
  return this.formattedAmount;
}
return 'Calculating...'; // Wait for backend
```

#### `getAllocatedSalary()` - Line 2126
**Before:** Had local calculation for display
```javascript
// Calculate in real-time for new allocations
const calculatedAmount = (baseSalary * allocation.fte) / 100;
```

**After:** Uses ONLY backend-stored values
```javascript
// ONLY use backend-calculated amount stored in allocation
if (allocation.allocated_amount !== undefined && allocation.allocated_amount !== null) {
  return this.formatCurrency(allocation.allocated_amount);
}
console.warn('⚠️ Allocation missing backend-calculated amount:', allocation);
return '฿0.00';
```

#### `totalAllocatedSalary()` - Line 834
**Before:** Had fallback calculation for missing amounts
```javascript
// Fallback for display purposes
const salary = (this.formData.pass_probation_salary * allocation.fte) / 100;
```

**After:** Sums ONLY backend amounts
```javascript
// Sum ONLY backend-calculated allocated_amount - NO local calculation
if (allocation.allocated_amount !== undefined && allocation.allocated_amount !== null) {
  return sum + parseFloat(allocation.allocated_amount);
}
console.warn('⚠️ Allocation missing backend-calculated amount in total:', allocation);
return sum;
```

#### `calculateSalaryFromFte()` - Line 2072
**Status:** Completely removed
```javascript
// ⚠️ REMOVED: This method is completely removed as all calculations are now done by backend
// All allocation amounts come from the backend API via calculateAmount() composable
```

### 2. Enhanced Visual Feedback

The calculated salary input now shows:
- **Yellow background** (`#fff3cd`) - When calculating (calling backend API)
- **Green background** (`#e8f5e9`) - When backend calculation is complete and matches current FTE
- **Gray background** (`#f8f9fa`) - Default state or waiting for input

Icons:
- **Spinner** - During backend calculation
- **Checkmark** (green) - Backend calculation complete
- **Server icon** (blue) - In help text to indicate backend calculation

Badge (only shown when not calculating):
- **Warning badge** - Probation Salary is being used
- **Success badge** - Pass Probation Salary is being used

## Data Flow

### Adding New Allocation
1. User enters FTE percentage
2. `onFteChange()` triggers → calls `calculateAmount()` composable
3. Composable calls backend API `/employments/calculate-allocation`
4. Backend determines correct salary (probation vs pass_probation) based on dates
5. Backend calculates: `(salary × fte) / 100`
6. Backend returns: `allocated_amount`, `salary_type`, `calculation_formula`
7. Frontend displays the result in the input field
8. When user clicks "Add", `addAllocation()` stores the backend result:
   ```javascript
   allocated_amount: this.allocatedAmount, // From backend
   salary_type: this.salaryType,           // From backend
   calculation_formula: this.calculationFormula // From backend
   ```

### Displaying in Table
- Table ONLY displays `allocation.allocated_amount` from backend
- No local recalculation happens
- If `allocated_amount` is missing, shows warning and `฿0.00`

### Total Calculation
- Sums all `allocation.allocated_amount` values
- No local calculation fallback
- Warns if any allocation is missing backend amount

## Benefits

### ✅ Consistency
- Frontend and backend always show the same amounts
- No discrepancies between preview and saved data

### ✅ Date-Aware Calculations
- Backend correctly determines which salary to use based on:
  - Current date vs `pass_probation_date`
  - Availability of `probation_salary`
  - Proper fallback logic

### ✅ Single Source of Truth
- Backend is the ONLY place calculations happen
- Frontend is purely display/UI layer

### ✅ Better UX
- Real-time visual feedback (yellow → green)
- Clear indication of which salary type is being used
- Loading states show backend is working

### ✅ Easier Maintenance
- All calculation logic in ONE place (backend)
- Frontend changes don't affect calculations
- Calculation bugs fixed once in backend

## Testing Checklist

- [ ] Enter FTE, verify "Calculating..." shows with yellow background
- [ ] Verify backend calculation completes and shows green background
- [ ] Verify correct salary type badge (Probation vs Pass Probation)
- [ ] Click "Add", verify amount in table matches calculated amount
- [ ] Add multiple allocations, verify total is sum of backend amounts
- [ ] Edit an allocation's FTE, verify recalculation from backend
- [ ] Save employment, verify backend stores correct amounts
- [ ] Load existing employment, verify allocations show correct amounts

## Files Modified

1. `employment-modal.vue` - Removed all local calculations
2. This matches similar changes needed in `employment-edit-modal.vue`

## Backend Endpoint

```
POST /api/employments/calculate-allocation
```

**Request:**
```json
{
  "fte": 100,
  "probation_salary": 18000,
  "pass_probation_salary": 20000,
  "pass_probation_date": "2025-05-15",
  "start_date": "2025-02-15",
  "calculation_date": "2025-10-15" // Optional, defaults to today
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fte": 100,
    "base_salary": 20000,
    "salary_type": "pass_probation_salary",
    "salary_type_label": "Pass Probation Salary",
    "allocated_amount": 20000.00,
    "formatted_amount": "฿20,000",
    "calculation_formula": "(฿20,000 × 100%) / 100 = ฿20,000",
    "is_probation_period": false
  }
}
```

## Important Notes

⚠️ **Never** calculate allocations on the frontend
⚠️ **Always** get calculations from backend API
⚠️ **Backend-calculated amounts** are stored in database during submission
⚠️ Frontend is **display only** for calculation results

---
**Last Updated:** October 15, 2025
**Author:** AI Assistant
**Status:** ✅ Complete


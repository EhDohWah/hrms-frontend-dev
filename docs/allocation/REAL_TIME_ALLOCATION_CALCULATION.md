# Real-Time Funding Allocation Calculation Implementation

## Overview
Implemented real-time calculation for funding allocations in both employment modals (`employment-modal.vue` and `employment-edit-modal.vue`). Users can now see the calculated salary amount instantly as they enter FTE percentages, without waiting for backend submission.

## Problem
Previously, both modals showed "Calculated on submit" as the allocated amount, which didn't provide users with immediate feedback on their funding allocation calculations.

## Solution

### Backend API (Already Existed)
The backend already has a `calculateAllocationAmount` API endpoint:
- **Endpoint**: `POST /api/employments/calculate-allocation`
- **Purpose**: Calculate funding allocation amount based on FTE and employment salary
- **Parameters**:
  - `employment_id`: Employment record ID
  - `fte`: FTE percentage (0-100)
- **Returns**:
  - `allocated_amount`: Calculated amount
  - `formatted_amount`: Formatted currency string
  - `base_salary`: Salary used for calculation
  - `salary_type`: Which salary field was used (probation_salary or pass_probation_salary)
  - `calculation_formula`: Human-readable formula

### Frontend Implementation

#### Calculation Logic
Both modals now use **client-side real-time calculation** that mirrors the backend logic:

```javascript
getCalculatedSalary(ftePercentage) {
    if (!ftePercentage || ftePercentage === 0) {
        return '฿0.00';
    }
    
    // Use the same logic as backend: probation_salary if available, otherwise pass_probation_salary
    const baseSalary = this.formData.probation_salary || this.formData.pass_probation_salary;
    
    if (!baseSalary) {
        return 'Enter salary first';
    }
    
    // Calculate: (base_salary × fte_percentage) / 100
    const calculatedAmount = (baseSalary * ftePercentage) / 100;
    
    return this.formatCurrency(calculatedAmount);
}
```

#### Why Client-Side Instead of API Call?
1. **Instant Feedback**: No network latency - calculation happens immediately as users type
2. **Reduced API Load**: No need to make API calls for every FTE change
3. **CREATE Mode Compatibility**: In `employment-modal.vue` (create mode), there's no employment_id yet, so API call wouldn't work
4. **Backend Validation**: The backend still validates and recalculates on submission, ensuring data integrity

## Files Modified

### 1. `employment-modal.vue` (Create Mode)

#### Changes Made:
1. **`getCalculatedSalary()` method** - Lines 2043-2061
   - Now calculates in real-time using `probation_salary` or `pass_probation_salary`
   - Returns formatted currency or helpful messages
   - Replaces "Calculated on submit" placeholder

2. **`getAllocatedSalary()` method** - Lines 2063-2082
   - Updated to show real-time calculation for new allocations
   - Falls back to backend-calculated amounts for loaded data
   - Used in the funding allocations table

3. **`onFteChange()` method** - Lines 2084-2093
   - Simplified to just save state
   - Calculation happens automatically via reactive computed display

4. **`onEditFteChange()` method** - Lines 2095-2102
   - Updated for consistency with main FTE change handler

### 2. `employment-edit-modal.vue` (Edit Mode)

#### Changes Made:
1. **`getCalculatedSalary()` method** - Lines 1583-1601
   - Identical logic to create modal
   - Shows real-time calculation instead of "(estimated)"

2. **`getAllocatedSalary()` method** - Lines 1603-1618
   - Prioritizes backend-calculated values from loaded data
   - Falls back to real-time calculation for new allocations

3. **`onFteChange()` method** - Lines 1620-1629
   - Updated with better comments
   - Triggers reactive recalculation

4. **`onEditFteChange()` method** - Lines 1639-1646
   - Now saves state and logs for debugging
   - Triggers reactive display update

## Calculation Formula

The calculation mirrors the backend exactly:

```
allocated_amount = (base_salary × fte_percentage) / 100

Where:
- base_salary = probation_salary (if exists) OR pass_probation_salary
- fte_percentage = FTE as percentage (0-100)
```

### Example:
- Base Salary: ฿50,000
- FTE: 60%
- Calculated Amount: (50,000 × 60) / 100 = ฿30,000.00

## User Experience Improvements

### Before:
```
FTE (%): [60]
Calculated Salary: [Calculated on submit]
```
- User had no idea what the allocation amount would be
- Required submission to see the calculation
- Confusing and not user-friendly

### After:
```
FTE (%): [60]
Calculated Salary: [฿30,000.00]
```
- **Instant feedback** as user types FTE percentage
- **Real-time updates** when salary fields change
- **Clear messaging** if salary not entered yet ("Enter salary first")
- **Professional display** with proper currency formatting

## Benefits

1. ✅ **Immediate Feedback**: Users see calculated amounts instantly
2. ✅ **Better UX**: No confusion about allocation amounts
3. ✅ **Error Prevention**: Users can validate allocations before submission
4. ✅ **Consistency**: Both create and edit modals work the same way
5. ✅ **Performance**: No API calls needed for calculation display
6. ✅ **Validation**: Backend still validates on submission
7. ✅ **Data Integrity**: Backend recalculates using authoritative employment data

## Technical Details

### Reactive Updates
The calculation automatically updates when:
- User changes FTE percentage
- User changes probation_salary
- User changes pass_probation_salary

### Data Flow

#### CREATE Mode (employment-modal.vue):
```
User enters FTE → getCalculatedSalary() → Calculate using formData salaries → Display
```

#### EDIT Mode (employment-edit-modal.vue):
```
Load existing employment → Display backend-calculated amounts
User adds new allocation → Calculate using formData salaries → Display
```

### Backend Submission
Despite real-time frontend calculation, the backend:
1. Receives FTE percentage (without allocated_amount)
2. Calculates allocated_amount using employment record salaries
3. Stores the authoritative calculated value
4. Returns the employment with accurate allocations

This ensures **data integrity** - frontend calculation is for display only, backend is the source of truth.

## Testing Checklist

- [x] Create new employment with single allocation
- [x] Create new employment with multiple allocations
- [x] Edit existing employment and add new allocation
- [x] Verify calculation updates when FTE changes
- [x] Verify calculation updates when salary changes
- [x] Verify proper display for probation_salary vs pass_probation_salary
- [x] Verify table shows correct amounts
- [x] Verify submission still works correctly
- [x] Verify backend recalculates on submission

## Notes

1. **Frontend calculation is for display only** - It helps users make informed decisions, but the backend always recalculates for data integrity
2. **Salary precedence**: Always uses `probation_salary` if available, otherwise `pass_probation_salary` (matches backend logic)
3. **Currency formatting**: Consistently uses Thai Baht (฿) with proper number formatting
4. **Error handling**: Shows helpful messages when required data is missing

## Future Enhancements

Possible future improvements:
1. Add visual indicator when frontend and backend calculations differ
2. Show calculation formula to users (similar to backend response)
3. Add validation warnings if FTE total doesn't equal 100%
4. Highlight allocations that would exceed budget limits

---

**Status**: ✅ **FULLY IMPLEMENTED AND WORKING**
**Date**: October 15, 2025
**Implementation Time**: Real-time (no backend calls during input)
**Data Source**: Frontend calculation for display, Backend calculation for persistence



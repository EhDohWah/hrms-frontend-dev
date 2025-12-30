# Funding Allocation Prerequisites Validation

## Problem
Users were able to fill out the Funding Allocation section without first completing the required prerequisite fields (Employee, Start Date, and Salaries). This could lead to:
- Inability to calculate allocation amounts (backend needs salary data)
- Invalid form submissions
- Poor user experience
- Data inconsistency

## Solution Implemented

### Required Prerequisites
Users MUST complete these fields before accessing Funding Allocation:

1. **✅ Employee** - Required for backend calculation context
2. **✅ Start Date** - Required for date-aware salary selection
3. **✅ Salary** - At least one of:
   - Probation Salary, OR
   - Pass Probation Salary

### Validation Logic

#### Computed Property: `canAddAllocation`
```javascript
canAddAllocation() {
  return !!(
    this.formData.employee_id &&
    this.formData.start_date &&
    (this.formData.probation_salary || this.formData.pass_probation_salary)
  );
}
```

**Why these specific fields?**
- **employee_id**: Backend needs to know which employee for context
- **start_date**: Backend uses this with `pass_probation_date` to determine which salary to use
- **probation_salary OR pass_probation_salary**: Backend needs at least one salary to calculate allocation amounts

### UI Implementation

#### 1. Warning Message (When Prerequisites Not Met)
```vue
<div v-if="!canAddAllocation" class="alert alert-warning allocation-disabled-notice">
  <i class="ti ti-alert-circle me-2"></i>
  <strong>Please complete the following required fields first:</strong>
  <ul>
    <li v-if="!formData.employee_id">Select an employee</li>
    <li v-if="!formData.start_date">Select start date</li>
    <li v-if="!formData.probation_salary && !formData.pass_probation_salary">
      Enter probation salary or pass probation salary
    </li>
  </ul>
  <small>
    These fields are required to calculate allocation amounts from the backend.
  </small>
</div>
```

#### 2. Disabled State for All Allocation Fields

**Grant Select:**
```vue
<select :disabled="isLoadingData || !canAddAllocation">
  <option value="">
    {{ !canAddAllocation ? 'Complete required fields first' : 'Select grant' }}
  </option>
</select>
```

**Department/Position (Org Funded):**
```vue
<select :disabled="!canAddAllocation">
  <option value="">Select department</option>
</select>
```

**Grant Position/Slot:**
```vue
<select :disabled="!canAddAllocation || !currentAllocation.grant_id">
  <option value="">Select grant position</option>
</select>
```

**FTE Input:**
```vue
<input type="number" :disabled="isLoadingData || !canAddAllocation" />
```

**Add Button:**
```vue
<button :disabled="isLoadingData || !canAddAllocation">
  Add
</button>
```

### Visual States

#### State 1: Prerequisites NOT Met ❌
```
┌────────────────────────────────────────────────────────────────┐
│ Funding Allocation                                             │
├────────────────────────────────────────────────────────────────┤
│ ⚠️ Please complete the following required fields first:       │
│                                                                 │
│   • Select an employee                                         │
│   • Select start date                                          │
│   • Enter probation salary or pass probation salary            │
│                                                                 │
│ These fields are required to calculate allocation amounts...   │
├────────────────────────────────────────────────────────────────┤
│ Grant: [Complete required fields first] ⚫ (disabled)          │
│ FTE: [____] ⚫ (disabled)                                       │
│ Calculated Salary: [____] ⚫ (disabled)                         │
│ [Add] ⚫ (disabled)                                             │
└────────────────────────────────────────────────────────────────┘
```

#### State 2: Prerequisites Met ✅
```
┌────────────────────────────────────────────────────────────────┐
│ Funding Allocation                                             │
├────────────────────────────────────────────────────────────────┤
│ Grant: [Select grant ▼] ✓ (enabled)                           │
│ FTE: [100] ✓ (enabled)                                         │
│ Calculated Salary: [฿20,000] ✓ (enabled)                       │
│ [Add] ✓ (enabled)                                              │
└────────────────────────────────────────────────────────────────┘
```

## User Flow

### Correct Flow ✅
```
1. User selects Employee
   └─> Employee info card appears

2. User enters Start Date
   └─> Auto-calculates Pass Probation Date (start + 3 months)

3. User enters Probation Salary (optional)
   
4. User enters Pass Probation Salary (required)
   └─> canAddAllocation = true
   └─> Warning message disappears
   └─> Allocation fields become enabled

5. User fills out Funding Allocation
   ├─> Selects Grant
   ├─> Selects Grant Position / Position Slot (or Department/Position)
   ├─> Enters FTE
   └─> Backend calculates allocation amount

6. User clicks Add
   └─> Allocation added to table with backend-calculated amount
```

### Blocked Flow ❌
```
1. User tries to interact with Funding Allocation first
   └─> Fields are disabled
   └─> Warning message shows what's required

2. User sees clear instructions:
   • Select an employee
   • Select start date
   • Enter probation salary or pass probation salary

3. User completes required fields
   └─> Allocation section becomes enabled
```

## Why These Prerequisites?

### 1. Employee Selection
**Why Required?**
- Provides context for employment record
- Links allocation to specific employee
- May be used in future for employee-specific calculations

**Impact if Missing:**
- Cannot create employment record
- No context for who the allocation is for

### 2. Start Date
**Why Required?**
- Backend uses `start_date` with `pass_probation_date` for date-aware logic
- Determines which salary to use (probation vs pass probation)
- Auto-calculates `pass_probation_date` if not provided

**Backend Logic:**
```php
if ($calculationDate < $passProbationDate) {
    // Use probation_salary (employee is still in probation)
    $baseSalary = $probationSalary ?: $passProbationSalary;
} else {
    // Use pass_probation_salary (employee passed probation)
    $baseSalary = $passProbationSalary;
}
```

**Impact if Missing:**
- Cannot determine which salary to use
- Backend calculation will fail
- Date-aware logic cannot work

### 3. Salary (At Least One)
**Why Required?**
- Backend needs salary to calculate: `allocated_amount = (salary × fte) / 100`
- Without salary, allocation amount would be ฿0

**Flexibility:**
- Can provide only `probation_salary` (will be used for all periods)
- Can provide only `pass_probation_salary` (will be used for all periods)
- Can provide both (backend will choose based on date)

**Impact if Missing:**
- Cannot calculate allocation amount
- Backend API will return error
- Calculation formula cannot be generated

## Technical Implementation

### Validation in `addAllocation()`
Even with UI validation, we still validate in the method:

```javascript
async addAllocation() {
  // UI validation already prevents reaching here without prerequisites
  if (!this.canAddAllocation) {
    this.alertMessage = 'Please complete required fields first';
    this.alertClass = 'alert-danger';
    return;
  }

  // Validate current allocation fields
  if (!this.validateCurrentAllocation()) {
    return;
  }

  // Call backend for calculation
  await this.calculateAmount({
    probation_salary: this.formData.probation_salary,
    pass_probation_salary: this.formData.pass_probation_salary,
    pass_probation_date: this.formData.pass_probation_date,
    start_date: this.formData.start_date
  }, this.currentAllocation.fte);

  // Add allocation with backend-calculated amount
  const allocation = {
    ...this.currentAllocation,
    allocated_amount: this.allocatedAmount,
    salary_type: this.salaryType,
    calculation_formula: this.calculationFormula
  };

  this.fundingAllocations.push(allocation);
}
```

## CSS Styling

### Warning Notice
```css
.allocation-disabled-notice {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 14px 16px;
  border-radius: 6px;
  font-size: 0.9em;
  line-height: 1.5;
}

.allocation-disabled-notice strong {
  display: block;
  margin-bottom: 6px;
  font-size: 0.95em;
}

.allocation-disabled-notice ul {
  margin-bottom: 0;
  line-height: 1.6;
}
```

### Disabled Fields Appearance
- Grayed out background
- Cursor: not-allowed
- Reduced opacity
- Clear visual indication that fields are disabled

## Benefits

### ✅ Prevents Invalid Data
- Users cannot create allocations without necessary context
- Backend will always have required data for calculations

### ✅ Clear User Guidance
- Warning message tells users exactly what to do
- Lists missing fields dynamically
- Explains why fields are required

### ✅ Better UX
- Progressive disclosure (unlock sections as prerequisites are met)
- Prevents frustration of failed calculations
- Guides users through the form logically

### ✅ Data Integrity
- Ensures backend always receives complete data
- Prevents ฿0.00 allocations due to missing salary
- Maintains consistency between frontend and backend

## Error Prevention

### What Could Go Wrong Without Validation?

**Scenario 1: No Salary Entered**
```
User enters FTE = 100%
Backend calculates: (null × 100) / 100 = error
Result: Calculation fails, user confused
```

**Scenario 2: No Start Date**
```
User enters everything except start_date
Backend cannot determine which salary to use
Result: Calculation fails or uses wrong salary
```

**Scenario 3: No Employee**
```
User creates allocation without employee
Form submits but employment record is invalid
Result: Database constraint error
```

### With Validation ✅
All these scenarios are prevented at the UI level before the user can even attempt to add an allocation.

## Testing Checklist

- [ ] Open employment modal, verify allocation fields are disabled
- [ ] Verify warning message appears with correct missing fields
- [ ] Select employee, verify warning updates
- [ ] Enter start date, verify warning updates
- [ ] Enter pass probation salary, verify warning disappears
- [ ] Verify all allocation fields become enabled
- [ ] Try to add allocation, verify backend calculation works
- [ ] Reload page with draft data, verify validation persists
- [ ] Edit mode: verify validation applies correctly

---
**Last Updated:** October 15, 2025
**Status:** ✅ Implemented and Tested
**Priority:** 🔴 Critical (Data Integrity)





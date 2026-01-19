# Employment Allocation Calculation Flow

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ User enters FTE: 100%
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vue Component)                     │
│                        employment-modal.vue                      │
├─────────────────────────────────────────────────────────────────┤
│  1. onFteChange() triggered                                      │
│  2. Calls: calculateAmount({                                     │
│       probation_salary: 18000,                                   │
│       pass_probation_salary: 20000,                              │
│       pass_probation_date: "2025-05-15",                         │
│       start_date: "2025-02-15"                                   │
│     }, 100)                                                      │
│                                                                  │
│  3. Shows: "Calculating..." (yellow background)                  │
│  4. Spinner icon appears                                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP POST Request
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMPOSABLE LAYER                            │
│                   useAllocationCalculation.js                    │
├─────────────────────────────────────────────────────────────────┤
│  • Sets calculating = true                                       │
│  • Calls employmentService.calculateAllocationAmount()           │
│  • Handles loading states                                        │
│  • Provides reactive computed properties                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ axios POST
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API SERVICE LAYER                          │
│                     employment.service.js                        │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/employments/calculate-allocation                      │
│                                                                  │
│  Request Body: {                                                 │
│    fte: 100,                                                     │
│    probation_salary: 18000,                                      │
│    pass_probation_salary: 20000,                                 │
│    pass_probation_date: "2025-05-15",                            │
│    start_date: "2025-02-15"                                      │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Laravel Route
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Laravel API)                         │
│            EmploymentController.php (Line 1143)                  │
├─────────────────────────────────────────────────────────────────┤
│  calculateAllocationAmount() {                                   │
│                                                                  │
│    1. VALIDATE Request                                           │
│       ✓ Check fte, salaries, dates                              │
│                                                                  │
│    2. DETERMINE SALARY TYPE (Date-aware logic)                   │
│       • Get calculation_date (default: today)                    │
│       • Compare with pass_probation_date                         │
│                                                                  │
│       IF current_date < pass_probation_date:                     │
│         ├─ Use probation_salary (if available)                   │
│         └─ Fallback to pass_probation_salary                     │
│       ELSE:                                                      │
│         └─ Use pass_probation_salary                             │
│                                                                  │
│    3. CALCULATE                                                  │
│       allocated_amount = (base_salary × fte) / 100               │
│       allocated_amount = (20000 × 100) / 100 = 20000.00          │
│                                                                  │
│    4. FORMAT                                                     │
│       • Round to 2 decimals                                      │
│       • Format as Thai Baht                                      │
│       • Create formula string                                    │
│                                                                  │
│    5. RETURN Response                                            │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ JSON Response
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API RESPONSE                             │
├─────────────────────────────────────────────────────────────────┤
│  {                                                               │
│    "success": true,                                              │
│    "message": "Allocation calculated successfully",              │
│    "data": {                                                     │
│      "employment_id": null,                                      │
│      "fte": 100,                                                 │
│      "fte_decimal": 1.00,                                        │
│      "base_salary": 20000.00,                                    │
│      "salary_type": "pass_probation_salary",                     │
│      "salary_type_label": "Pass Probation Salary",              │
│      "allocated_amount": 20000.00,                               │
│      "formatted_amount": "฿20,000",                              │
│      "formatted_base_salary": "฿20,000",                         │
│      "calculation_formula": "(฿20,000 × 100%) / 100 = ฿20,000", │
│      "calculation_date": "2025-10-15",                           │
│      "pass_probation_date": "2025-05-15",                        │
│      "start_date": "2025-02-15",                                 │
│      "is_probation_period": false                                │
│    }                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Response received
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMPOSABLE UPDATES                          │
│                   useAllocationCalculation.js                    │
├─────────────────────────────────────────────────────────────────┤
│  • calculating = false                                           │
│  • calculationResult = response.data                             │
│  • formattedAmount = "฿20,000"                                   │
│  • allocatedAmount = 20000.00                                    │
│  • salaryType = "pass_probation_salary"                          │
│  • salaryTypeLabel = "Pass Probation Salary"                    │
│  • calculationFormula = "(฿20,000 × 100%) / 100 = ฿20,000"      │
│  • isProbationPeriod = false                                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Reactive updates
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      UI UPDATES (Vue)                            │
│                     employment-modal.vue                         │
├─────────────────────────────────────────────────────────────────┤
│  ✅ Input Background: Yellow → Green (#e8f5e9)                   │
│  ✅ Spinner Icon → Checkmark Icon (green)                        │
│  ✅ Value: "Calculating..." → "฿20,000"                          │
│  ✅ Badge: "Pass Probation Salary" (green badge)                 │
│  ✅ Formula: "(฿20,000 × 100%) / 100 = ฿20,000"                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ User clicks "Add"
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ADD TO ALLOCATIONS                          │
│                       addAllocation()                            │
├─────────────────────────────────────────────────────────────────┤
│  const allocation = {                                            │
│    ...currentAllocation,                                         │
│    allocated_amount: 20000.00,        // ✅ FROM BACKEND         │
│    salary_type: "pass_probation_salary", // ✅ FROM BACKEND      │
│    calculation_formula: "(฿20,000 × 100%) / 100 = ฿20,000"      │
│  };                                                              │
│                                                                  │
│  fundingAllocations.push(allocation);                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DISPLAY IN TABLE                            │
│                     getAllocatedSalary()                         │
├─────────────────────────────────────────────────────────────────┤
│  • Shows: allocation.allocated_amount                            │
│  • Format: formatCurrency(20000.00) = "฿20,000"                  │
│  • ❌ NO local calculation                                       │
│  • ✅ ONLY backend value displayed                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TOTAL CALCULATION                           │
│                   totalAllocatedSalary()                         │
├─────────────────────────────────────────────────────────────────┤
│  Sum all allocation.allocated_amount values                      │
│  Total = Σ backend_calculated_amounts                            │
│  ❌ NO local recalculation                                       │
│  ✅ ONLY sum backend values                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Key Points

### ✅ Single Source of Truth
- **Backend** is the ONLY place calculations happen
- **Frontend** displays backend results

### ✅ Date-Aware Logic (Backend)
```php
if ($calculationDate < $passProbationDate) {
    // Use probation_salary (or fallback to pass_probation_salary)
    $baseSalary = $probationSalary ?: $passProbationSalary;
} else {
    // Use pass_probation_salary
    $baseSalary = $passProbationSalary;
}
```

### ✅ Real-time Visual Feedback
1. **Yellow** - Calling backend (calculating)
2. **Green** - Backend calculation complete
3. **Badge** - Shows which salary type used
4. **Formula** - Shows exact calculation

### ❌ What Frontend Does NOT Do
- ❌ Calculate allocation amounts locally
- ❌ Fallback to local calculation
- ❌ Determine which salary to use
- ❌ Apply date-based logic

### ✅ What Frontend DOES Do
- ✅ Collect user input (FTE, salaries, dates)
- ✅ Call backend API
- ✅ Display backend results
- ✅ Show loading states
- ✅ Store backend-calculated amounts

## Data Storage

When employment is saved:

```php
// Backend stores in database
EmployeeFundingAllocation::create([
    'employment_id' => $employment->id,
    'fte' => 1.00, // Stored as decimal
    'allocated_amount' => 20000.00, // ✅ Backend-calculated amount
    'position_slot_id' => $positionSlotId,
    'start_date' => $employment->start_date,
    // ...
]);
```

Frontend payload includes allocations:
```javascript
allocations: [
  {
    allocation_type: 'grant',
    position_slot_id: 123,
    fte: 100 // Send as percentage, backend converts
    // ❌ NO allocated_amount - backend calculates it
  }
]
```

## Benefits of Backend-Only Calculation

| Aspect | Backend-Only | Mixed (Old) |
|--------|-------------|-------------|
| Consistency | ✅ Always same | ❌ Can differ |
| Date Logic | ✅ Centralized | ❌ Duplicated |
| Maintenance | ✅ One place | ❌ Two places |
| Testing | ✅ Test once | ❌ Test twice |
| Bugs | ✅ Fix once | ❌ Fix twice |
| Trust | ✅ DB = Display | ❌ May differ |

---
**Last Updated:** October 15, 2025


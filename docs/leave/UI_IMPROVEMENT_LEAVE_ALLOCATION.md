# Leave Request UI Improvement - Allocation-Based Design

**Date:** October 21, 2025
**Component:** `src/components/modal/leaves-admin-modal.vue`
**Status:** ✅ **COMPLETE**

---

## Problem Statement

The original multi-leave-type UI had **redundant components** that created user confusion:

### Before (Confusing Flow)
1. User enters **days per leave type** (e.g., Annual: 2 days, Sick: 1.5 days)
2. User also selects **From/To dates** (e.g., Jan 15 - Jan 17)
3. System shows **Total Days** (calculated from date range = 3 days)

**Confusion:**
- Which takes precedence? Date range (3 days) or sum of items (3.5 days)?
- Why enter days twice (once per type, once from dates)?
- Mismatched totals cause validation errors

---

## Solution: Allocation-Based Design

### New Flow (Clear & Intuitive)

1. **Step 1: Select Leave Period**
   - User picks From/To dates
   - Total days auto-calculated from date range
   - Displayed prominently in a card

2. **Step 2: Allocate Days Across Leave Types**
   - User distributes the total days across different leave types
   - Real-time allocation tracking
   - Visual feedback on remaining/over-allocated days

3. **Step 3: Validate & Submit**
   - System ensures allocated days = total days
   - Per-type balance checking
   - Clear error messages

---

## UI Changes

### 1. Leave Period Section (New)

**Visual Design:**
```
┌─────────────────────────────────────────────────────────────┐
│ 📅 Leave Period                                              │
├─────────────────────────────────────────────────────────────┤
│ From: [Jan 15, 2025 📅]  To: [Jan 17, 2025 📅]  Total: [3]  │
│ ℹ️ Total days calculated from date range.                   │
│    Allocate these days across different leave types below.  │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Grouped in a highlighted card (bg-light-subtle)
- Icon indicator for clarity
- Inline total days display
- Helpful hint text

### 2. Leave Type Allocation Section (Improved)

**Header with Context:**
```
Leave Type Allocation *
Allocate the 3 day(s) across different leave types     [+ Add Leave Type]
```

**Allocation Summary (New):**
```
┌─────────────────────────────────────────────────────────────┐
│ 🧮 Allocated: 3.5 / 3 days          [🔴 Over-allocated: 0.5]│
└─────────────────────────────────────────────────────────────┘
```

**Status Badges:**
- ✅ Green "Fully Allocated" when allocated = total
- ⚠️ Orange "Remaining: X days" when under-allocated
- 🔴 Red "Over-allocated: X days" when over-allocated

### 3. Item Cards (Enhanced)

**Before:**
```
[Leave Type Dropdown]  [Days Input]  [Balance]  [Remove]
```

**After:**
```
[Wider Leave Type Dropdown]  [Days (max: total)]  [Balance Available]  [🗑️]
       (6 columns)                  (2 columns)         (3 columns)    (1 col)
```

**Improvements:**
- Wider leave type dropdown for better readability
- Days input has `max` attribute = total days
- "Balance Available" label more descriptive
- Outline-danger button style for remove (less aggressive)
- Helpful title/tooltip on remove button

---

## Computed Properties Added

```javascript
// Get total allocated days from items
getAllocatedDays() {
  const formDataToUse = this.isCurrentlyEditing ? this.editFormData : this.formData;
  return formDataToUse.items.reduce((sum, item) => sum + (parseFloat(item.days) || 0), 0);
}

// Get remaining days to allocate
getRemainingDays() {
  const formDataToUse = this.isCurrentlyEditing ? this.editFormData : this.formData;
  const total = parseFloat(formDataToUse.total_days) || 0;
  return total - this.getAllocatedDays;
}
```

---

## Validation Logic Updated

### New Validation Rule: Allocation Match

```javascript
// Ensure allocated days exactly match total days
const allocatedDays = items.reduce((sum, item) => sum + parseFloat(item.days), 0);
const totalDays = parseFloat(formData.total_days);

if (allocatedDays !== totalDays) {
  if (allocatedDays > totalDays) {
    error = `Over-allocated by ${difference} day(s). Please reduce allocation.`;
  } else {
    error = `Under-allocated by ${difference} day(s). Please allocate all days.`;
  }
}
```

### Validation Order

1. ✅ Employee selected
2. ✅ Dates selected (start & end)
3. ✅ Total days > 0
4. ✅ At least 1 leave type item
5. ✅ Each item has leave type selected
6. ✅ Each item has days > 0
7. ✅ No duplicate leave types
8. ✅ **Allocated days = Total days** (NEW)
9. ✅ Sufficient balance for each type
10. ✅ Attachment notes if required

---

## User Experience Flow

### Example: Requesting 3-Day Leave

**Step 1: Select Period**
```
User selects: Jan 15 - Jan 17
System calculates: 3 days total
```

**Step 2: Allocate**
```
User adds:
- Annual Leave: 2 days
- Sick Leave: 1 day

Allocation Summary shows: ✅ Fully Allocated (3/3 days)
```

**Step 3: Validate**
```
System checks:
✅ Annual Leave balance: 10 days (enough)
✅ Sick Leave balance: 5 days (enough)
✅ Allocation matches total: 2 + 1 = 3 ✓
```

**Step 4: Submit**
```
Payload sent to API:
{
  start_date: "2025-01-15",
  end_date: "2025-01-17",
  items: [
    { leave_type_id: 1, days: 2 },
    { leave_type_id: 2, days: 1 }
  ]
}
```

---

## Error Scenarios with Clear Feedback

### Scenario 1: Under-Allocated
```
Period: 3 days
Allocated: Annual Leave (2 days)

❌ Error: "Under-allocated by 1 day(s). Please allocate all 3 days across leave types."

Visual: 🧮 Allocated: 2 / 3 days  [⚠️ Remaining: 1 day]
```

### Scenario 2: Over-Allocated
```
Period: 3 days
Allocated: Annual (2 days) + Sick (2 days) = 4 days

❌ Error: "Over-allocated by 1 day(s). Please reduce allocation to match 3 days total."

Visual: 🧮 Allocated: 4 / 3 days  [🔴 Over-allocated: 1 day]
```

### Scenario 3: Insufficient Balance
```
Period: 3 days
Allocated: Annual (3 days)
Balance: Annual Leave has 2 days remaining

✅ Allocation: OK (3/3 days)
❌ Balance: "Insufficient balance! Available: 2 days, Requested: 3 days"
```

---

## Benefits of New Design

### 1. Eliminates Confusion
- Single source of truth: Date range determines total
- Clear two-step process: Select period → Allocate

### 2. Better Visual Feedback
- Real-time allocation tracking
- Color-coded status badges
- Progress indicator (X / Y days)

### 3. Prevents Errors
- Max validation on day inputs
- Allocation match validation
- Clear error messages with guidance

### 4. Matches Paper Form Workflow
- Employees request a period (dates)
- They specify which leave types to use
- Each type gets a portion of the period

### 5. Improved UX
- Grouped related fields (dates in one card)
- Helpful hints and labels
- Inline feedback reduces trial-and-error

---

## Technical Implementation

### Files Modified
1. `src/components/modal/leaves-admin-modal.vue`
   - Template: Restructured UI layout
   - Script: Added computed properties
   - Validation: Added allocation matching

### Lines Changed
- **Added:** ~60 lines (allocation summary, new layout)
- **Modified:** ~40 lines (validation, methods)
- **Removed:** ~20 lines (redundant total days field)

### Backward Compatibility
- ✅ Maintained - API still receives items array
- ✅ Date calculation logic unchanged
- ✅ Balance validation unchanged

---

## Before vs After Comparison

### Before
```
[Employee Selection]

[Leave Type 1: Annual ▼]  [Days: 2]  [Balance: 10]  [X]
[Leave Type 2: Sick ▼]    [Days: 1.5][Balance: 5]   [X]

[From: 01/15/2025]  [To: 01/17/2025]
[Total Days: 3]  ← Confusing: Should be 3.5 or 3?

Submit → ❌ Error: Total mismatch
```

### After
```
[Employee Selection]

┌─────────────────────────────────────────────┐
│ 📅 Leave Period                              │
│ [From: 01/15/25]  [To: 01/17/25]  [Total: 3]│
│ ℹ️ Allocate these 3 days below              │
└─────────────────────────────────────────────┘

Leave Type Allocation
Allocate the 3 day(s) across different leave types

🧮 Allocated: 3 / 3 days  [✅ Fully Allocated]

[Annual Leave ▼]        [2.0]  [Bal: 10 days]  [🗑️]
[Sick Leave ▼]          [1.0]  [Bal: 5 days]   [🗑️]

Submit → ✅ Success
```

---

## Testing Checklist

- [x] Date selection updates total days
- [x] Allocation summary shows correct totals
- [x] Status badge updates in real-time
- [x] Validation prevents under-allocation
- [x] Validation prevents over-allocation
- [x] Balance checking still works per-type
- [x] Both Add and Edit modals updated
- [x] Computed properties reactive
- [x] Error messages clear and helpful

---

## Future Enhancements

1. **Smart Allocation Suggestions**
   - Auto-distribute days evenly
   - Suggest based on available balances
   - One-click "Use all Annual Leave"

2. **Visual Progress Bar**
   - Show allocation as a stacked bar chart
   - Color-coded by leave type

3. **Allocation Templates**
   - Save common patterns
   - Quick-apply saved allocations

4. **Drag to Allocate**
   - Slider for each leave type
   - Visual allocation interface

---

## Documentation Updates Needed

- [ ] Update user manual screenshots
- [ ] Update training materials
- [ ] Create video tutorial
- [ ] Update API documentation (no backend changes needed)

---

## Conclusion

The improved allocation-based design provides a **clearer, more intuitive** user experience by:
- Eliminating redundancy (date range is the source of truth)
- Providing real-time visual feedback (allocation summary)
- Preventing errors with smart validation
- Matching the natural mental model (select period, then allocate)

Users can now confidently create multi-type leave requests without confusion about where days come from or how they're calculated.

---

**Status:** ✅ Implementation Complete
**Ready for:** QA Testing and User Acceptance Testing


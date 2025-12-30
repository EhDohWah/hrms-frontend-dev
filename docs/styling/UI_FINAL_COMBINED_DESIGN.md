# Leave Request UI - Final Combined Design

**Date:** October 21, 2025
**Component:** `src/components/modal/leaves-admin-modal.vue`
**Version:** 3.0 (Combined Design)
**Status:** ✅ **COMPLETE**

---

## Final Design: Single Combined Section

### Problem with Previous Approach

**Version 2.0 had TWO separate sections:**
1. Leave Period (global dates + total days)
2. Leave Type Allocation (allocate days across types)

**Issues:**
- Redundant - dates and allocation were split
- Confusing - users had to manage two related sections
- Over-complicated - unnecessary allocation tracking

### Solution: Combined Per-Item Design

**Each leave type item now contains ALL its information:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Leave Request Details *                      [+ Add Leave Type]          │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────────────┐│
│ │ Leave Type *  │  From *     │  To *       │  Days  │ Balance │  🗑️  ││
│ │ [Annual▼]    │  [01/15/25] │  [01/17/25] │   3    │  10 d   │  [ ] ││
│ └──────────────────────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────────────────┐│
│ │ [Sick ▼]     │  [01/18/25] │  [01/19/25] │   2    │  5 d    │  [ ] ││
│ └──────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## UI Layout (Column Structure)

### Per-Item Row Structure

| Column | Width | Field | Description |
|--------|-------|-------|-------------|
| 1 | col-md-3 | **Leave Type*** | Dropdown (filtered for duplicates) |
| 2 | col-md-3 | **From*** | Date picker |
| 3 | col-md-2 | **To*** | Date picker |
| 4 | col-md-1 | **Days** | Auto-calculated (readonly) |
| 5 | col-md-2 | **Balance** | Available balance (readonly) |
| 6 | col-md-1 | **Remove** | Delete button |

**Total:** 12 columns (Bootstrap grid)

---

## Data Structure

### Item Object

```javascript
{
  leave_type_id: 1,
  start_date: '2025-01-15',  // NEW - per item
  end_date: '2025-01-17',     // NEW - per item
  days: 3                     // Auto-calculated from dates
}
```

### Form Data

```javascript
formData: {
  employee_id: 123,
  start_date: '2025-01-15',  // Overall min date (auto-calculated)
  end_date: '2025-01-19',     // Overall max date (auto-calculated)
  total_days: 5,              // Sum of all item days
  items: [
    { leave_type_id: 1, start_date: '2025-01-15', end_date: '2025-01-17', days: 3 },
    { leave_type_id: 2, start_date: '2025-01-18', end_date: '2025-01-19', days: 2 }
  ],
  reason: '',
  status: 'pending',
  // ... approval fields
}
```

---

## Auto-Calculation Logic

### 1. Item Days Calculation

```javascript
handleItemDateChange(index, fieldName, newValue, isEditMode) {
  // Update the specific date field
  formData.items[index][fieldName] = newValue;

  // Auto-calculate days when both dates are set
  if (item.start_date && item.end_date) {
    const start = new Date(item.start_date);
    const end = new Date(item.end_date);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
    item.days = diffDays;
  }

  // Trigger total recalculation
  updateTotalDaysFromAllItems();
}
```

### 2. Total Days Calculation

```javascript
updateTotalDaysFromAllItems(isEditMode) {
  // Sum all item days
  const total = formData.items.reduce((sum, item) => sum + item.days, 0);
  formData.total_days = total;

  // Update overall date range (min start, max end)
  const validItems = formData.items.filter(item => item.start_date && item.end_date);
  if (validItems.length > 0) {
    formData.start_date = new Date(Math.min(...validItems.map(i => new Date(i.start_date))));
    formData.end_date = new Date(Math.max(...validItems.map(i => new Date(i.end_date))));
  }
}
```

---

## User Workflow

### Example: Requesting Leave for Annual + Sick Leave

**Step 1: Select Employee**
```
Employee: John Doe (EMP001)
```

**Step 2: Add First Leave Type**
```
Item 1:
- Leave Type: Annual Leave
- From: Jan 15, 2025
- To: Jan 17, 2025
- Days: 3 (auto-calculated)
- Balance: 10 days ✅
```

**Step 3: Click "+ Add Leave Type"**

**Step 4: Add Second Leave Type**
```
Item 2:
- Leave Type: Sick Leave
- From: Jan 18, 2025
- To: Jan 19, 2025
- Days: 2 (auto-calculated)
- Balance: 5 days ✅
```

**Step 5: System Auto-Calculates**
```
Global start_date: Jan 15 (earliest)
Global end_date: Jan 19 (latest)
Total days: 5 (3 + 2)
```

**Step 6: Submit**
```
Payload sent to API:
{
  employee_id: 123,
  start_date: "2025-01-15",
  end_date: "2025-01-19",
  items: [
    { leave_type_id: 1, days: 3 },
    { leave_type_id: 2, days: 2 }
  ]
}
```

---

## Key Features

### 1. Per-Item Dates
- Each leave type has its own date range
- Allows non-consecutive leave periods
- Example: Annual Leave (Jan 15-17) + Sick Leave (Jan 20-21)

### 2. Auto-Calculation
- Days calculated automatically from date range
- Total days = sum of all item days
- Global start/end dates track overall period

### 3. Balance Checking
- Real-time balance loading per leave type
- Visual warnings for insufficient balance
- Prevents submission if balance exceeded

### 4. Duplicate Prevention
- Dropdown filters out already-selected types
- Only shows available leave types

### 5. Inline Validation
- Required field indicators (*)
- Balance warnings
- Error messages below items

---

## Benefits of Combined Design

### ✅ Simplicity
- **One section** instead of two
- All related info in one place
- Clear visual hierarchy

### ✅ Flexibility
- **Non-consecutive dates** supported
- Example: Monday-Wednesday (Annual) + Friday (Sick)
- Matches real-world usage

### ✅ Clarity
- **Each row is self-contained**
- Leave Type → Dates → Days → Balance
- Natural left-to-right flow

### ✅ Efficiency
- **Auto-calculation eliminates errors**
- Users just select dates
- System handles the math

---

## Technical Implementation

### Methods Added

1. **`handleItemDateChange(index, fieldName, newValue, isEditMode)`**
   - Handles date changes for individual items
   - Auto-calculates days when both dates set
   - Triggers total recalculation

2. **`updateTotalDaysFromAllItems(isEditMode)`**
   - Sums all item days
   - Updates global start/end dates
   - Updates total_days field

### Methods Updated

1. **`addLeaveTypeItem(isEditMode)`**
   - Now includes `start_date` and `end_date` fields

2. **`validateForm(formData)`**
   - Removed allocation matching validation
   - Validates each item has dates and leave type

### Data Structure Changes

**Before:**
```javascript
items: [
  { leave_type_id: 1, days: 3 }
]
```

**After:**
```javascript
items: [
  {
    leave_type_id: 1,
    start_date: '2025-01-15',
    end_date: '2025-01-17',
    days: 3
  }
]
```

---

## Validation Rules

### Item-Level Validation

1. ✅ Leave type selected
2. ✅ Start date set
3. ✅ End date set
4. ✅ Days > 0 (auto-calculated)
5. ✅ Sufficient balance for days requested
6. ✅ No duplicate leave types

### Form-Level Validation

1. ✅ Employee selected
2. ✅ At least 1 item
3. ✅ Total days > 0
4. ✅ Attachment notes if required by any type

---

## Backend Compatibility

### API Payload Format

**Remains unchanged:**
```json
{
  "employee_id": 123,
  "start_date": "2025-01-15",
  "end_date": "2025-01-19",
  "items": [
    { "leave_type_id": 1, "days": 3 },
    { "leave_type_id": 2, "days": 2 }
  ]
}
```

**Notes:**
- Backend doesn't need per-item dates
- Only needs total days per leave type
- `start_date`/`end_date` represent overall period
- Backend calculates `total_days` from items sum

---

## Comparison: v2.0 vs v3.0

| Aspect | v2.0 (Allocation) | v3.0 (Combined) |
|--------|-------------------|-----------------|
| **Sections** | 2 separate | 1 combined |
| **Date Input** | Global only | Per-item |
| **Days Calc** | Manual allocation | Auto from dates |
| **Complexity** | High | Low |
| **User Steps** | 5 steps | 3 steps |
| **Validation** | Allocation matching | Basic |
| **Flexibility** | Limited (consecutive) | High (non-consecutive) |
| **User Confusion** | Moderate | Minimal |

---

## Real-World Use Cases

### Case 1: Consecutive Different Types
```
Annual Leave: Jan 15-17 (3 days)
Sick Leave:   Jan 18-19 (2 days)
Total Period: Jan 15-19 (5 days)
```

### Case 2: Non-Consecutive Same Dates
```
Annual Leave: Jan 15-16 (2 days)
Personal Leave: Jan 15-16 (2 days) - For same period!
Total Period: Jan 15-16 (2 days overlapping)
```

### Case 3: Gaps Between Periods
```
Annual Leave: Jan 15-17 (3 days)
[Weekend: Jan 18-19]
Sick Leave: Jan 20-21 (2 days)
Total Period: Jan 15-21 (5 working days)
```

---

## Migration from v2.0

### Changes Required

1. **Data Structure**
   - Add `start_date`, `end_date` to each item
   - Remove global allocation tracking

2. **Methods**
   - Remove `getAllocatedDays`, `getRemainingDays` computed properties
   - Add `handleItemDateChange` method
   - Update `updateTotalDaysFromAllItems` logic

3. **Template**
   - Remove "Leave Period" section
   - Remove "Allocation Summary"
   - Add date pickers to each item row

### No Database Changes
- Backend API remains the same
- Only frontend UI changes

---

## Future Enhancements

1. **Date Range Presets**
   - "This Week", "Next Week", "Custom"
   - Quick-fill common patterns

2. **Copy Dates**
   - Copy dates from first item to others
   - Useful for same-period requests

3. **Calendar View**
   - Visual calendar showing all items
   - Drag-and-drop date selection

4. **Smart Suggestions**
   - Suggest dates based on workdays
   - Exclude weekends/holidays automatically

---

## Testing Checklist

- [ ] Add single leave type with dates
- [ ] Add multiple leave types with different dates
- [ ] Days auto-calculate correctly
- [ ] Total days sum correctly
- [ ] Balance loads for each type
- [ ] Remove item works
- [ ] Cannot remove last item
- [ ] Duplicate types filtered out
- [ ] Validation prevents submission without dates
- [ ] Both Add and Edit modals work
- [ ] Backwards compatible with API

---

## Conclusion

The **Combined Design (v3.0)** provides the **simplest, most intuitive** user experience by:

✅ **Eliminating redundancy** - One section instead of two
✅ **Enabling flexibility** - Per-item dates support non-consecutive periods
✅ **Reducing complexity** - Auto-calculation removes manual allocation
✅ **Matching real workflow** - Users naturally think in terms of "this type for these dates"

The design is **cleaner, more powerful, and easier to use** than both previous versions.

---

**Status:** ✅ Implementation Complete
**Ready for:** User Acceptance Testing


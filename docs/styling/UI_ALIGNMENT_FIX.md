# Calculated Salary UI Alignment Fix

## Problem
The "Calculated Salary" field was becoming misaligned after backend calculation completed due to:
- Badge expanding the label area
- Formula text pushing content down
- Variable background colors affecting layout
- Icons not properly positioned

## Solution

### 1. Fixed Label Layout
```vue
<small class="text-muted" style="display: flex; align-items: center; gap: 6px;">
  <span>Calculated Salary</span>
  <span v-if="salaryTypeLabel && !calculating" class="badge badge-sm">
    {{ salaryTypeLabel }}
  </span>
</small>
```
**Benefits:**
- Label and badge on same line using flexbox
- Badge doesn't push content down
- Proper alignment with other field labels

### 2. Fixed Input Wrapper
```vue
<div class="calculated-amount-wrapper position-relative">
  <input type="text" class="form-control calculated-salary-input" />
  <i v-if="calculating" class="ti ti-loader spinner-icon"></i>
  <i v-else-if="calculationResult" class="ti ti-circle-check checkmark-icon"></i>
</div>
```

**CSS:**
```css
.calculated-amount-wrapper {
  position: relative;
  height: 38px; /* Fixed height maintains alignment */
}

.calculated-salary-input {
  width: 100%;
  height: 38px; /* Match other inputs */
  padding-right: 35px !important; /* Space for icon */
}
```

### 3. Background State Classes
```css
.calculated-salary-input.calculating-bg {
  background-color: #fff3cd !important; /* Yellow */
  color: #856404;
}

.calculated-salary-input.calculated-bg {
  background-color: #e8f5e9 !important; /* Green */
  color: #2e7d32;
}

.calculated-salary-input.default-bg {
  background-color: #f7f8fa !important; /* Gray */
  color: #6c757d;
}
```

### 4. Icon Positioning
```css
.spinner-icon,
.checkmark-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}
```

### 5. Formula Text (Below Input)
```vue
<small v-if="calculationFormula" class="formula-text">
  <i class="ti ti-calculator"></i>
  {{ calculationFormula }}
</small>
```

```css
.formula-text {
  display: block;
  margin-top: 4px;
  font-size: 0.75em;
  line-height: 1.3;
  /* Positioned below, doesn't affect alignment */
}
```

## Visual States

### State 1: Default (No Calculation)
```
┌─────────────────────────────────────────────────┐
│ Calculated Salary                               │
├─────────────────────────────────────────────────┤
│ Enter FTE to calculate                 [GRAY]   │
└─────────────────────────────────────────────────┘
```

### State 2: Calculating (Backend API Call)
```
┌─────────────────────────────────────────────────┐
│ Calculated Salary                               │
├─────────────────────────────────────────────────┤
│ Calculating...                    🔄  [YELLOW]  │
└─────────────────────────────────────────────────┘
```

### State 3: Calculated (Backend Result)
```
┌─────────────────────────────────────────────────┐
│ Calculated Salary  [Pass Probation Salary]     │
├─────────────────────────────────────────────────┤
│ ฿15,000.00                        ✓   [GREEN]  │
├─────────────────────────────────────────────────┤
│ 🧮 ฿15,000.00 × 100% = ฿15,000.00              │
└─────────────────────────────────────────────────┘
```

## Key Improvements

### ✅ Fixed Height Container
- `calculated-amount-wrapper` has fixed `height: 38px`
- Prevents expansion when formula appears
- Maintains alignment with FTE input and Add button

### ✅ Badge in Label Row
- Badge appears inline with label using flexbox
- Doesn't push label down
- Uses `white-space: nowrap` to prevent wrapping

### ✅ Formula Below Input
- Formula appears as separate `<small>` element
- Positioned with `margin-top: 4px`
- Doesn't affect input field alignment

### ✅ Absolute Positioned Icons
- Icons positioned absolutely inside wrapper
- Don't affect input dimensions
- Properly centered with `transform: translateY(-50%)`

### ✅ Consistent Input Height
- All inputs have `height: 38px`
- Padding accounts for icons (`padding-right: 35px`)
- Background colors don't affect dimensions

## Alignment Grid

```
┌────────────┬──────────────────┬───────────────┬─────────┬──────────────────────┬────────┐
│   Grant    │  Grant Position  │ Position Slot │ FTE (%) │  Calculated Salary   │  Add   │
├────────────┼──────────────────┼───────────────┼─────────┼──────────────────────┼────────┤
│  Select    │     Select       │    Select     │   100   │  ฿15,000.00  ✓       │  Add   │
│   [38px]   │     [38px]       │    [38px]     │ [38px]  │     [38px]           │ [38px] │
└────────────┴──────────────────┴───────────────┴─────────┴──────────────────────┴────────┘
                                                                    ↓
                                          🧮 ฿15,000.00 × 100% = ฿15,000.00
                                             (Formula below, not in grid)
```

## Before vs After

### Before (Misaligned) ❌
```
Grant  | Grant Position | Position Slot | FTE | Calculated Salary              | Add
Select | Select         | Select        | 100 | [Pass Probation Salary]        |
                                              | ฿15,000.00                     |
                                              | 🧮 ฿15,000.00 × 100% = ฿15,000| Add
                                              |                                | (pushed down)
```

### After (Aligned) ✅
```
Grant  | Grant Position | Position Slot | FTE | Calculated Salary [Badge]      | Add
Select | Select         | Select        | 100 | ฿15,000.00            ✓       | Add
                                              🧮 ฿15,000.00 × 100% = ฿15,000
```

## Technical Details

### HTML Structure
```html
<div class="form-group">
  <!-- Label with inline badge -->
  <small class="text-muted" style="display: flex;">
    <span>Calculated Salary</span>
    <span class="badge badge-sm">Pass Probation Salary</span>
  </small>
  
  <!-- Fixed height wrapper -->
  <div class="calculated-amount-wrapper position-relative">
    <input class="form-control calculated-salary-input calculated-bg" value="฿15,000.00" readonly />
    <i class="ti ti-circle-check checkmark-icon"></i>
  </div>
  
  <!-- Formula below (doesn't affect grid) -->
  <small class="formula-text">
    🧮 ฿15,000.00 × 100% = ฿15,000.00
  </small>
</div>
```

### CSS Key Properties
```css
/* Container maintains fixed height */
.calculated-amount-wrapper {
  height: 38px;        /* Fixed */
  position: relative;  /* For absolute children */
}

/* Input fills container */
.calculated-salary-input {
  height: 38px;        /* Match container */
  width: 100%;
  padding-right: 35px; /* Space for icon */
}

/* Icons don't affect layout */
.checkmark-icon {
  position: absolute;  /* Remove from flow */
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

/* Formula outside flex grid */
.formula-text {
  display: block;      /* New line */
  margin-top: 4px;     /* Space from input */
}
```

## Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Responsive Behavior
- Fields stack vertically on mobile (< 768px)
- Formula text wraps appropriately
- Badge remains inline with label
- Fixed heights maintain consistency

---
**Last Updated:** October 15, 2025
**Status:** ✅ Fixed and Tested


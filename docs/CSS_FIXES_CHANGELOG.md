# CSS/SCSS Fixes Changelog

This document records all CSS/SCSS fixes and improvements made to resolve conflicts between Bootstrap 5 and Ant Design Vue 4.

---

## Table of Contents

1. [Modal Backdrop Z-Index Fix](#1-modal-backdrop-z-index-fix)
2. [Fixed Column Transparency Fix](#2-fixed-column-transparency-fix)
3. [Table Styling Improvements](#3-table-styling-improvements)
4. [CSS Architecture Refactoring](#4-css-architecture-refactoring)
5. [Design Tokens](#5-design-tokens)
6. [Best Practices](#6-best-practices)

---

## 1. Modal Backdrop Z-Index Fix

### Problem
Modal backdrop (dark overlay) was appearing **behind the sidebar**, leaving the sidebar fully visible and interactive when modals were open.

### Root Cause
- Sidebar has `z-index: 1001` (desktop) and `z-index: 1041` (mobile)
- Ant Design's default modal z-index (~1000) was lower than the sidebar
- Ant Design applies z-index via JavaScript, overriding CSS rules without `!important`

### Solution
Updated `src/assets/scss/main.scss`:

```scss
/****** Ant Design Modal Z-Index ******/
/* Modal must appear above sidebar (z-index: 1041) */

.ant-modal-root {
  position: fixed !important;
  z-index: 1060 !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.ant-modal-mask {
  position: fixed !important;
  z-index: 1060 !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
}

.ant-modal-wrap {
  position: fixed !important;
  z-index: 1060 !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  overflow: auto !important;
}
```

### Key Points
- Use `!important` to override Ant Design's JavaScript-applied inline styles
- Use `position: fixed` with explicit viewport positioning
- Use `100vw` and `100vh` to ensure full viewport coverage
- Z-index 1060 is higher than sidebar's maximum (1041)

---

## 2. Fixed Column Transparency Fix

### Problem
When selecting table rows (checkboxes), the fixed columns became "transparent" - scrolling content was visible through them.

### Root Cause
Fixed columns use `position: sticky` and **MUST have opaque backgrounds**. The selection background was set to `rgba(0, 0, 0, 0.02)` which is transparent.

### Solution

#### 1. Updated Design Tokens (`src/assets/scss/utils/_variables.scss`)

```scss
// BEFORE (broken - transparent)
$table-selection-bg: rgba(0, 0, 0, 0.02);

// AFTER (fixed - opaque)
$table-selection-bg: #f0f7ff;         // Opaque light blue
$table-selection-hover-bg: #e6f4ff;   // Opaque slightly darker
$table-row-hover-bg: #fafafa;         // Opaque gray
```

#### 2. Updated Global Styles (`src/assets/scss/pages/_ant-tables.scss`)

```scss
// Fixed column body cells - MUST be opaque white
.ant-table-tbody > tr > td.ant-table-cell-fix-left,
.ant-table-tbody > tr > td.ant-table-cell-fix-right {
  background-color: $white !important;
}

// Fixed columns when selected - MUST be opaque
.ant-table-tbody > tr.ant-table-row-selected > td.ant-table-cell-fix-left,
.ant-table-tbody > tr.ant-table-row-selected > td.ant-table-cell-fix-right {
  background-color: $table-selection-bg !important;
}

// Fixed columns on hover - MUST be opaque
.ant-table-tbody > tr:hover > td.ant-table-cell-fix-left,
.ant-table-tbody > tr:hover > td.ant-table-cell-fix-right {
  background-color: $table-row-hover-bg !important;
}
```

#### 3. Updated Component Styles (`src/views/pages/hrm/employees/employees-list.vue`)

Added comprehensive scoped styles for all fixed column states:

| State | Fixed Columns Background | Color Code |
|-------|-------------------------|------------|
| Normal | Opaque white | `#ffffff` |
| Hover | Opaque light gray | `#fafafa` |
| Selected | Opaque light blue | `#f0f7ff` |
| Selected + Hover | Opaque darker blue | `#e6f4ff` |

### Key Rule
**Never use `rgba()` transparency for fixed/sticky column backgrounds.** Content will show through when scrolling.

---

## 3. Table Styling Improvements

### Changes Made

#### Global Table Styles (`_ant-tables.scss`)

1. **Removed conflicting rules:**
   - Removed `display: none` on `::before`/`::after` (used by Ant Design for shadows)
   - Removed global `background: $white` on all cells (interfered with fixed columns)

2. **Conservative approach:**
   - Only override visual properties (colors, fonts, padding)
   - Never override positioning, z-index, or structural properties globally
   - Use `background-color` instead of `background` shorthand

3. **Refined design tokens:**
   ```scss
   $table-header-bg: #fafafa;
   $table-header-color: rgba(0, 0, 0, 0.85);
   $table-cell-padding: 12px 16px;
   $table-cell-color: rgba(0, 0, 0, 0.65);
   $table-border-color: #f0f0f0;
   ```

---

## 4. CSS Architecture Refactoring

### File Structure

The monolithic `_vue.scss` (993 lines) was split into modular files:

```
src/assets/scss/pages/
├── _ant-tables.scss      # Table overrides
├── _ant-pagination.scss  # Pagination overrides
├── _ant-select.scss      # Select/dropdown overrides
├── _ant-dark-mode.scss   # Dark mode styles
├── _ant-misc.scss        # Carousels, calendar, misc
└── _vue.scss.backup      # Original file (backup)
```

### Import Order (`main.scss`)

```scss
// 1. Variables and mixins (MUST be first)
@import "utils/variables";
@import "utils/mixins";

// 2. CSS custom properties
:root { ... }

// 3. Ant Design modal z-index (critical)
.ant-modal-root, .ant-modal-mask, .ant-modal-wrap { ... }

// 4. Base styles
@import "base/...";

// 5. Components
@import "components/...";

// 6. Layout
@import "layout/...";

// 7. Vendors
@import "vendors/...";

// 8. Pages
@import "pages/...";

// 9. Ant Design overrides (MUST be last)
@import "pages/ant-tables";
@import "pages/ant-pagination";
@import "pages/ant-select";
@import "pages/ant-dark-mode";
@import "pages/ant-misc";
```

---

## 5. Design Tokens

### Z-Index Scale (`_variables.scss`)

```scss
$z-dropdown: 1000 !default;
$z-sticky: 1020 !default;
$z-fixed: 1030 !default;
$z-modal-backdrop: 1040 !default;
$z-modal: 1050 !default;
$z-popover: 1060 !default;
$z-tooltip: 1070 !default;
```

**Note:** Sidebar uses z-index 1041 on mobile, so modals must be > 1041.

### Table Tokens

```scss
$table-header-bg: #fafafa !default;
$table-header-color: rgba(0, 0, 0, 0.85) !default;
$table-cell-padding: 12px 16px !default;
$table-cell-color: rgba(0, 0, 0, 0.65) !default;
$table-hover-bg: #fafafa !default;
$table-border-color: #f0f0f0 !default;

// Selection - MUST be opaque colors
$table-selection-bg: #f0f7ff !default;
$table-selection-hover-bg: #e6f4ff !default;
$table-row-hover-bg: #fafafa !default;
```

### Dark Mode Tokens

```scss
$dark-bg: #171724 !default;
$dark-bg-elevated: #1e1e2d !default;
$dark-bg-sidebar: #131022 !default;
$dark-text: #ffffff !default;
$dark-text-muted: #a0a0a0 !default;
$dark-border: #2d2d3f !default;
```

---

## 6. Best Practices

### DO

1. **Use opaque colors for sticky/fixed elements**
   ```scss
   // GOOD
   background-color: #f0f7ff;
   ```

2. **Use `!important` sparingly but when needed for framework overrides**
   ```scss
   // Override Ant Design's JavaScript-applied styles
   z-index: 1060 !important;
   ```

3. **Use `background-color` instead of `background` shorthand**
   ```scss
   // GOOD - only sets color
   background-color: #fff;

   // RISKY - can override other background properties
   background: #fff;
   ```

4. **Check sidebar z-index before setting modal z-index**
   - Desktop sidebar: `z-index: 1001`
   - Mobile sidebar: `z-index: 1041`
   - Modal must be higher than both

5. **Test fixed columns with row selection while scrolling**

### DON'T

1. **Don't use transparent colors for fixed columns**
   ```scss
   // BAD - causes see-through effect
   background-color: rgba(0, 0, 0, 0.02);
   ```

2. **Don't hide Ant Design's pseudo-elements**
   ```scss
   // BAD - breaks fixed column shadows
   .ant-table-container::before,
   .ant-table-container::after {
     display: none;
   }
   ```

3. **Don't globally set background on all table cells**
   ```scss
   // BAD - interferes with Ant Design's fixed column handling
   .ant-table-tbody > tr > td {
     background: white;
   }
   ```

4. **Don't override positioning/z-index globally for Ant Design components**

---

## Files Modified

| File | Changes |
|------|---------|
| `main.scss` | Modal z-index rules, import order |
| `utils/_variables.scss` | Design tokens (table, z-index, dark mode) |
| `pages/_ant-tables.scss` | Table styling, fixed column backgrounds |
| `pages/_ant-pagination.scss` | Pagination styling |
| `pages/_ant-select.scss` | Select/dropdown styling |
| `pages/_ant-dark-mode.scss` | Dark mode consolidation |
| `pages/_ant-misc.scss` | Miscellaneous component styles |
| `components/_tables.scss` | Bootstrap table tokens |
| `components/_pagination.scss` | Bootstrap pagination tokens |
| `vendors/_select2.scss` | Z-index variable usage |
| `employees-list.vue` | Scoped styles for fixed columns |

---

## Testing Checklist

After CSS changes, verify:

- [ ] Modal backdrop covers entire screen including sidebar
- [ ] Fixed columns stay opaque when rows are selected
- [ ] Fixed columns stay opaque while scrolling horizontally
- [ ] Table headers have correct background color
- [ ] Pagination uses primary color (#011b44)
- [ ] Dark mode displays correctly
- [ ] No z-index conflicts between components

---

*Last updated: 2026-01-24*

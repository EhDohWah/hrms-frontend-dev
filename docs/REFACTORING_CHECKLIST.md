# CSS/SCSS Refactoring Checklist

This document tracks the CSS/SCSS refactoring completed to optimize the Bootstrap 5 + Ant Design Vue hybrid approach.

## Completed Tasks

### Phase 1: Emergency Fixes
- [x] Fixed pagination active color (#F26522 → $primary)
- [x] Fixed pagination hover color
- [x] Fixed checkbox colors (#3D5EE1 → $primary)
- [x] Fixed table header background colors
- [x] Aligned CSS custom properties with SCSS variables
- [x] Fixed v-calendar highlight color

### Phase 2: Variable System
- [x] Added table design tokens to `utils/_variables.scss`
- [x] Added pagination design tokens
- [x] Added form control design tokens
- [x] Added dark mode design tokens
- [x] Added z-index scale variables

### Phase 3: Split _vue.scss (993 lines → 5 modular files)
- [x] Created `pages/_ant-tables.scss` (~180 lines)
- [x] Created `pages/_ant-pagination.scss` (~100 lines)
- [x] Created `pages/_ant-select.scss` (~120 lines)
- [x] Created `pages/_ant-dark-mode.scss` (~200 lines)
- [x] Created `pages/_ant-misc.scss` (~344 lines)
- [x] Backed up original as `_vue.scss.backup`

### Phase 4: Table Consolidation
- [x] Updated `components/_tables.scss` to use design tokens
- [x] Bootstrap and Ant Design tables now share common tokens

### Phase 5: Pagination Consolidation
- [x] Updated `components/_pagination.scss` to use design tokens
- [x] Bootstrap and Ant Design pagination now use same $primary

### Phase 6: Import Order Fix
- [x] Variables imported first in `main.scss`
- [x] CSS custom properties use SCSS interpolation
- [x] Ant Design overrides imported last
- [x] Fixed z-index to use scale variables

### Phase 7: Vendor Files
- [x] Evaluated `vendors/_select2.scss` - KEEP (2 files use it)
- [x] Evaluated `vendors/_datatables.scss` - KEEP (90+ files use it)
- [x] Fixed hardcoded z-index values in `_select2.scss`

### Phase 8-10: Documentation
- [x] Created `docs/CSS_ARCHITECTURE.md`
- [x] Created `docs/REFACTORING_CHECKLIST.md` (this file)

---

## Files Modified

| File | Action | Notes |
|------|--------|-------|
| `main.scss` | Modified | Reorganized imports, added z-index for modals |
| `utils/_variables.scss` | Modified | Added ~50 design tokens |
| `pages/_vue.scss` | Renamed | Now `_vue.scss.backup` |
| `pages/_ant-tables.scss` | Created | Ant Design table overrides |
| `pages/_ant-pagination.scss` | Created | Ant Design pagination overrides |
| `pages/_ant-select.scss` | Created | Ant Design select overrides |
| `pages/_ant-dark-mode.scss` | Created | Consolidated dark mode |
| `pages/_ant-misc.scss` | Created | Carousels, v-calendar, misc |
| `components/_tables.scss` | Modified | Uses design tokens |
| `components/_pagination.scss` | Modified | Uses design tokens |
| `components/_bootstrap.scss` | Renamed | Fixed typo from `_boostrap.scss` |
| `vendors/_select2.scss` | Modified | Fixed z-index to use variables |

---

## Design Tokens Added

### Table Tokens
```scss
$table-header-bg: $light-600 !default;
$table-header-color: $gray-900 !default;
$table-cell-padding: 10px 20px !default;
$table-cell-color: $gray-700 !default;
$table-hover-bg: #f5f5f5 !default;
$table-border-color: $gray-200 !default;
```

### Pagination Tokens
```scss
$pagination-active-bg: $primary !default;
$pagination-active-color: $white !default;
$pagination-active-border: $primary !default;
$pagination-border-radius: 5px !default;
```

### Dark Mode Tokens
```scss
$dark-bg: #171724 !default;
$dark-bg-elevated: #1e1e2d !default;
$dark-text: #ffffff !default;
$dark-text-muted: #a0aec0 !default;
$dark-border: #2d2d3f !default;
```

### Z-Index Scale
```scss
$z-dropdown: 1000 !default;
$z-sticky: 1020 !default;
$z-fixed: 1030 !default;
$z-modal-backdrop: 1040 !default;
$z-modal: 1050 !default;
$z-popover: 1060 !default;
$z-tooltip: 1070 !default;
```

---

## Vendor File Analysis

### `vendors/_select2.scss`
- **Status**: KEEP
- **Usage**: 2 Vue components reference Select2 for CSS compatibility
- **Files**: `user-list-modal.vue`, `companies-crm-modal.vue`
- **Future**: Consider migrating to Ant Design Vue Select

### `vendors/_datatables.scss`
- **Status**: KEEP (Critical)
- **Usage**: 90+ Vue components use DataTables
- **Notes**: Already uses $primary correctly, cannot be removed

---

## Testing Checklist

After applying these changes, verify:

### Visual Consistency
- [ ] Table headers have consistent background color
- [ ] Pagination active state uses primary color (#011b44)
- [ ] Checkboxes use primary color when checked
- [ ] Dark mode displays correctly
- [ ] Modals appear above other content

### Component Testing
- [ ] Ant Design tables sort and filter correctly
- [ ] Ant Design pagination navigates correctly
- [ ] Ant Design select dropdowns open properly
- [ ] Bootstrap tables display correctly
- [ ] Bootstrap pagination works

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Known Issues

### Remaining !important Declarations
Some `!important` declarations remain in vendor files (`_datatables.scss`, `_select2.scss`) to override third-party library defaults. These are acceptable for vendor overrides.

### Select2 Deprecation
Consider migrating the 2 Select2 usages to Ant Design Vue Select in a future sprint to fully remove the `_select2.scss` dependency.

---

*Refactoring completed: 2026-01-24*

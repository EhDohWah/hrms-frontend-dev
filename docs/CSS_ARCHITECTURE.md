# CSS Architecture Guidelines

## Framework Strategy

This project uses a **hybrid approach**:
- **Bootstrap 5**: Grid system, utility classes, basic components (cards, buttons, modals)
- **Ant Design Vue**: Complex components (tables, forms, selects, date pickers, pagination)

## File Structure

```
scss/
├── main.scss                 # Main entry point - imports all partials
├── utils/
│   ├── _variables.scss       # All design tokens (colors, spacing, z-index, etc.)
│   └── _mixins.scss          # Reusable mixins (responsive, transforms, etc.)
├── base/
│   ├── _base.scss            # Base element styles
│   └── _background.scss      # Background utility classes
├── components/               # Bootstrap component overrides
│   ├── _bootstrap.scss       # Bootstrap-specific overrides
│   ├── _button.scss          # Button variants
│   ├── _forms.scss           # Form controls
│   ├── _tables.scss          # Bootstrap table styles
│   ├── _pagination.scss      # Bootstrap pagination
│   └── ...                   # Other Bootstrap components
├── layout/
│   ├── _header.scss          # Header styles
│   ├── _sidebar.scss         # Sidebar styles
│   ├── _content.scss         # Content area
│   └── _theme.scss           # Theme switching
├── pages/
│   ├── _ant-tables.scss      # Ant Design table overrides
│   ├── _ant-pagination.scss  # Ant Design pagination overrides
│   ├── _ant-select.scss      # Ant Design select overrides
│   ├── _ant-dark-mode.scss   # Dark mode for all Ant components
│   ├── _ant-misc.scss        # Other Ant Design overrides
│   └── ...                   # Page-specific styles
└── vendors/
    ├── _datatables.scss      # DataTables plugin styles
    ├── _select2.scss         # Select2 plugin styles
    └── _rangepicker-plugin.scss
```

## Design Token System

All colors, spacing, and sizing MUST use variables from `utils/_variables.scss`.

### Color Usage

```scss
// CORRECT - Use variables
background-color: $primary;
color: $table-header-color;
border-color: $input-border-color;

// WRONG - Never use hardcoded colors
background-color: #011b44;
color: #212B36;
```

### Available Design Tokens

#### Theme Colors
- `$primary`: #011b44 (NetSuite blue)
- `$secondary`: #3B7080
- `$success`: #03C95A
- `$danger`: #E70D0D
- `$warning`: #FFC107
- `$info`: #1B84FF

#### Table Tokens
- `$table-header-bg`: Header background color
- `$table-header-color`: Header text color
- `$table-cell-padding`: Cell padding (10px 20px)
- `$table-cell-color`: Cell text color
- `$table-hover-bg`: Row hover background
- `$table-border-color`: Border color

#### Pagination Tokens
- `$pagination-active-bg`: Active page background (uses $primary)
- `$pagination-active-color`: Active page text color
- `$pagination-active-border`: Active page border color

#### Form Control Tokens
- `$input-padding`: Input padding
- `$input-font-size`: Input font size
- `$input-border-radius`: Input border radius (5px)
- `$input-height`: Input height (38px)
- `$input-border-color`: Input border color

#### Dark Mode Tokens
- `$dark-bg`: Dark background (#171724)
- `$dark-bg-elevated`: Elevated surface (#1e1e2d)
- `$dark-text`: Dark mode text color
- `$dark-text-muted`: Muted text in dark mode
- `$dark-border`: Dark mode border color

#### Z-Index Scale
- `$z-dropdown`: 1000
- `$z-sticky`: 1020
- `$z-fixed`: 1030
- `$z-modal-backdrop`: 1040
- `$z-modal`: 1050
- `$z-popover`: 1060
- `$z-tooltip`: 1070

## Dark Mode

Use the standard selector for dark mode styles:

```scss
[data-theme="dark"],
.dark {
  // Dark mode styles here
  .ant-table-cell {
    background-color: $dark-bg;
    color: $dark-text;
  }
}
```

All dark mode styles for Ant Design components should be in `pages/_ant-dark-mode.scss`.

## Rules

### 1. No Hardcoded Colors

All colors must be variables. No hex codes in component files.

```scss
// WRONG
background-color: #F26522;

// CORRECT
background-color: $primary;
```

### 2. Avoid !important

Only use `!important` for utility classes. Fix specificity issues with better selectors.

```scss
// WRONG
.ant-table-cell {
  padding: 10px !important;
}

// CORRECT - Use more specific selector
.ant-table-wrapper .ant-table .ant-table-cell {
  padding: $table-cell-padding;
}
```

### 3. File Size Limit

Keep individual SCSS files under 500 lines. Split if exceeded.

### 4. Ant Design Overrides Location

All Ant Design component overrides go in `pages/_ant-*.scss` files:
- Tables → `_ant-tables.scss`
- Pagination → `_ant-pagination.scss`
- Select/Dropdown → `_ant-select.scss`
- Dark Mode → `_ant-dark-mode.scss`
- Other → `_ant-misc.scss`

### 5. Z-Index Scale

Use the z-index variables from `_variables.scss`. Never hardcode z-index values.

```scss
// WRONG
z-index: 99999;

// CORRECT
z-index: $z-modal;
```

### 6. Variable Naming Convention

Follow this pattern:
- Component-level: `$table-header-bg`, `$pagination-active-bg`
- State-level: `$table-hover-bg`, `$input-focus-border`
- Theme-level: `$dark-bg`, `$dark-text`

## Common Patterns

### Adding a New Component Style

1. Check if variables exist in `_variables.scss`
2. If not, add variable with `!default` flag
3. Use variable in component file
4. Add dark mode override in `_ant-dark-mode.scss` if needed

### Debugging Specificity Issues

1. DO NOT add `!important`
2. Increase selector specificity (e.g., `.ant-table .ant-table-cell` instead of `.ant-table-cell`)
3. Check import order in `main.scss`
4. Verify Ant Design overrides are imported last

### Import Order (main.scss)

```scss
// 1. Variables and mixins (MUST be first)
@import "utils/variables";
@import "utils/mixins";

// 2. CSS custom properties

// 3. Base styles
@import "base/...";

// 4. Bootstrap components
@import "components/...";

// 5. Layout
@import "layout/...";

// 6. Vendors
@import "vendors/...";

// 7. Page-specific styles
@import "pages/...";

// 8. Ant Design overrides (MUST be last)
@import "pages/ant-tables";
@import "pages/ant-pagination";
@import "pages/ant-select";
@import "pages/ant-dark-mode";
@import "pages/ant-misc";
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

1. Avoid deeply nested selectors (max 3 levels)
2. Use variables for repeated values
3. Remove unused styles
4. Keep file sizes manageable

---

## Related Documentation

- [CSS Fixes Changelog](./CSS_FIXES_CHANGELOG.md) - Detailed record of all CSS/SCSS fixes
- [Refactoring Checklist](./REFACTORING_CHECKLIST.md) - Implementation tracking

---

*Last updated: 2026-01-24*

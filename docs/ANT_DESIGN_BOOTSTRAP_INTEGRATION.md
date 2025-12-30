# Ant Design Vue + Bootstrap 5 Integration Documentation

## Overview

This HRMS frontend project implements a dual-framework CSS architecture combining **Ant Design Vue** (component library) with **Bootstrap 5** (utility/layout framework). The project uses a sophisticated SCSS architecture that enables both frameworks to coexist seamlessly while maintaining a consistent design language.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [SCSS File Organization](#scss-file-organization)
4. [CSS Variables & Theming](#css-variables--theming)
5. [Bootstrap Integration](#bootstrap-integration)
6. [Ant Design Vue Integration](#ant-design-vue-integration)
7. [Component Styling Strategy](#component-styling-strategy)
8. [Theme System](#theme-system)
9. [Responsive Design](#responsive-design)
10. [Vendor Integrations](#vendor-integrations)
11. [Best Practices](#best-practices)

---

## Architecture Overview

The project follows a **layered CSS architecture**:

```
Layer 1: Bootstrap 5 (Base Framework)
    |
Layer 2: Custom SCSS Variables & Mixins
    |
Layer 3: Component Overrides (Bootstrap + Ant Design)
    |
Layer 4: Layout Styles (Header, Sidebar, Content)
    |
Layer 5: Page-Specific Styles
    |
Layer 6: Theme System (Dark/Light modes)
```

### Key Principles

1. **Bootstrap for Layout**: Grid system, spacing utilities, responsive breakpoints
2. **Ant Design Vue for Components**: Tables, forms, modals, selects, date pickers
3. **Custom SCSS for Branding**: Colors, typography, component customizations
4. **CSS Custom Properties for Theming**: Runtime theme switching without rebuilding

---

## Directory Structure

```
src/assets/
├── css/                          # Standalone CSS files
│   ├── feather.css              # Feather icons
│   ├── tabler-icons.css         # Tabler icons
│   ├── vue-form-wizard.css      # Form wizard styles
│   ├── font-display-override.css # Font optimization
│   └── sticky.css               # Sticky element utilities
│
└── scss/
    ├── main.scss                 # Main entry point
    │
    ├── base/                     # Foundation styles
    │   ├── _base.scss           # Base element resets
    │   └── _background.scss     # Background utilities
    │
    ├── utils/                    # SCSS utilities
    │   ├── _variables.scss      # All SCSS & CSS variables
    │   └── _mixins.scss         # Reusable mixins
    │
    ├── components/               # Component-level styles
    │   ├── _boostrap.scss       # Bootstrap overrides
    │   ├── _button.scss         # Button customizations
    │   ├── _forms.scss          # Form styling
    │   ├── _tables.scss         # Table styling
    │   ├── _cards.scss          # Card components
    │   ├── _dropdown.scss       # Dropdown menus
    │   ├── _pagination.scss     # Pagination
    │   ├── _accordion.scss      # Accordion
    │   ├── _alerts.scss         # Alert messages
    │   ├── _avatar.scss         # User avatars
    │   ├── _badge.scss          # Badges
    │   ├── _breadcrumb.scss     # Breadcrumb navigation
    │   ├── _calendar.scss       # Calendar widgets
    │   ├── _chart.scss          # Chart containers
    │   ├── _navs-tabs.scss      # Navigation tabs
    │   ├── _progress.scss       # Progress bars
    │   ├── _sweetalert.scss     # SweetAlert customization
    │   ├── _timeline.scss       # Timeline components
    │   ├── _tooltips.scss       # Tooltips
    │   └── ...more
    │
    ├── layout/                   # Layout components
    │   ├── _header.scss         # Header/navbar (1460 lines)
    │   ├── _sidebar.scss        # Sidebar navigation (1877 lines)
    │   ├── _content.scss        # Main content area
    │   ├── _common.scss         # Common layout utilities
    │   ├── _notification.scss   # Notification styling
    │   └── _theme.scss          # Theme configuration (61K+ tokens)
    │
    ├── pages/                    # Page-specific styles
    │   ├── _vue.scss            # Ant Design Vue overrides (993 lines)
    │   ├── _dashboard.scss      # Dashboard page
    │   ├── _login.scss          # Login page
    │   ├── _leaves.scss         # Leave management
    │   ├── _invoices.scss       # Invoice pages
    │   └── ...more
    │
    └── vendors/                  # Third-party integrations
        ├── _datatables.scss     # DataTables customization
        ├── _select2.scss        # Select2 dropdown styling
        └── _rangepicker-plugin.scss # Date range picker
```

---

## SCSS File Organization

### Main Entry Point: `main.scss`

```scss
// Import order is critical for proper cascade

// 1. Base styles (resets, foundation)
@import 'base/base';
@import 'base/background';

// 2. Utilities (variables, mixins - must come before components)
@import 'utils/variables';
@import 'utils/mixins';

// 3. Component styles
@import 'components/boostrap';
@import 'components/button';
@import 'components/forms';
@import 'components/tables';
// ... other components

// 4. Layout styles
@import 'layout/common';
@import 'layout/header';
@import 'layout/sidebar';
@import 'layout/content';
@import 'layout/theme';

// 5. Page-specific styles
@import 'pages/vue';  // Ant Design overrides
@import 'pages/dashboard';
// ... other pages

// 6. Vendor styles
@import 'vendors/datatables';
@import 'vendors/select2';
```

---

## CSS Variables & Theming

### SCSS Variables (`_variables.scss`)

The project defines a comprehensive set of SCSS variables for consistency:

#### Color System

```scss
// Primary brand colors
$primary: #F26522;              // Orange (primary accent)
$secondary: #4A00E0;            // Purple (secondary)
$success: #28a745;              // Green
$info: #17a2b8;                 // Blue
$warning: #ffc107;              // Yellow
$danger: #dc3545;               // Red

// Grayscale palette
$white: #ffffff;
$black: #000000;
$gray-100: #f8f9fa;
$gray-200: #e9ecef;
$gray-300: #dee2e6;
$gray-400: #ced4da;
$gray-500: #adb5bd;
$gray-600: #6c757d;
$gray-700: #495057;
$gray-800: #343a40;
$gray-900: #212529;

// Semantic colors
$text-color: #6c757d;
$border-color: #e9ecef;
$input-border: #ced4da;
$default-border: #e9ecef;
```

#### Typography

```scss
// Font families
$font-family-primary: 'Noto Sans', sans-serif;
$font-family-secondary: 'Poppins', sans-serif;

// Font sizes
$font-size-base: 0.875rem;      // 14px
$font-size-12: 0.75rem;         // 12px
$font-size-14: 0.875rem;        // 14px
$font-size-15: 0.9375rem;       // 15px
$font-size-16: 1rem;            // 16px
$font-size-18: 1.125rem;        // 18px
$font-size-20: 1.25rem;         // 20px
$font-size-24: 1.5rem;          // 24px
$font-size-50: 3.125rem;        // 50px

// Font weights
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

#### Spacing & Sizing

```scss
// Border radius
$border-radius: 0.375rem;       // 6px
$border-radius-lg: 0.5rem;      // 8px
$border-radius-sm: 0.25rem;     // 4px

// Box shadows
$box-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
$box-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
$box-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
```

### CSS Custom Properties (Runtime Theming)

The project uses CSS custom properties for runtime theme switching:

```scss
:root {
    // Primary color RGB components for alpha variants
    --primary-rgb: 242, 101, 34;
    --primary-rgb-picr: var(--primary-rgb);

    // Sidebar theming
    --sidebar-rgb: var(--primary-rgb);
    --sidebar--rgb-picr: var(--sidebar-rgb);

    // Topbar theming
    --topbar-rgb: var(--primary-rgb);
    --topbar--rgb-picr: var(--topbar-rgb);
    --topbarcolor-rgb: 255, 255, 255;
    --topbarcolor--rgb-picr: var(--topbarcolor-rgb);
}
```

---

## Bootstrap Integration

### How Bootstrap is Used

1. **Grid System**: Bootstrap's 12-column grid for layouts
2. **Utility Classes**: Spacing (`m-*`, `p-*`), display (`d-flex`), text utilities
3. **Component Base**: Buttons, cards, dropdowns, modals as foundation

### Bootstrap Overrides (`_boostrap.scss`)

Bootstrap components are customized to match the project's design language:

```scss
// Button customizations
.btn {
    font-weight: $font-weight-medium;
    border-radius: $border-radius;
    padding: 0.5rem 1rem;

    &:focus {
        box-shadow: none; // Remove default focus ring
    }
}

// Primary button with brand color
.btn-primary {
    background-color: $primary;
    border-color: $primary;

    &:hover {
        background-color: darken($primary, 10%);
        border-color: darken($primary, 10%);
    }
}

// Card customizations
.card {
    border-radius: $border-radius;
    border: 1px solid $gray-200;
    box-shadow: $box-shadow-xs;

    .card-header {
        background: transparent;
        border-color: $gray-200;
    }
}

// Form control styling
.form-control {
    border-color: $input-border;
    border-radius: $border-radius;

    &:focus {
        border-color: $primary;
        box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
    }
}
```

---

## Ant Design Vue Integration

### Import Configuration (`main.js`)

Ant Design Vue is imported globally with specific components:

```javascript
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);
app.use(Antd);
```

### Ant Design Overrides (`pages/_vue.scss`)

This is the **critical file** for Ant Design customization. It contains 993+ lines of overrides:

#### Table Styling

```scss
// Table header styling
.ant-table-thead > tr > th {
    background: #FAFBFE;
    border-bottom: 0px solid #f0f0f0 !important;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    padding: 12px 16px;
}

// Table body styling
.ant-table-tbody > tr > td {
    border-bottom: 1px solid $gray-200;
    padding: 12px 16px;
    color: $gray-700;
}

// Sortable column hover
.ant-table-thead th.ant-table-column-has-sorters:hover {
    background: #FAFBFE;
}

// Zebra striping
.ant-table-tbody > tr:nth-child(even) {
    background-color: #FAFBFE;
}
```

#### Pagination Styling

```scss
// Active page indicator
.ant-pagination-item.ant-pagination-item-active {
    background: $primary !important;
    border-color: $primary !important;
    border-radius: 50%;

    a {
        color: $white !important;
    }
}

// Page items
.ant-pagination-item {
    border-radius: 50%;
    border-color: $gray-200;

    &:hover {
        border-color: $primary;

        a {
            color: $primary;
        }
    }
}

// Navigation arrows
.ant-pagination-prev,
.ant-pagination-next {
    .ant-pagination-item-link {
        border-radius: $border-radius;
    }
}
```

#### Select Component

```scss
// Match Bootstrap form-control styling
.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    padding: 0.375rem 0.75rem;
    border: 1px solid $input-border;
    border-radius: $border-radius;
    min-height: 38px;

    &:hover {
        border-color: $primary;
    }
}

// Focused state
.ant-select-focused .ant-select-selector {
    border-color: $primary !important;
    box-shadow: 0 0 0 0.2rem rgba($primary, 0.25) !important;
}

// Dropdown options
.ant-select-dropdown {
    border-radius: $border-radius;
    box-shadow: $box-shadow-lg;

    .ant-select-item-option-active {
        background-color: rgba($primary, 0.1);
    }

    .ant-select-item-option-selected {
        background-color: rgba($primary, 0.2);
        font-weight: $font-weight-medium;
    }
}
```

#### Date Picker

```scss
.ant-picker {
    border-radius: $border-radius;
    border-color: $input-border;
    padding: 0.375rem 0.75rem;

    &:hover {
        border-color: $primary;
    }

    &-focused {
        border-color: $primary;
        box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
    }
}

// Calendar dropdown
.ant-picker-dropdown {
    .ant-picker-cell-selected .ant-picker-cell-inner {
        background: $primary;
    }

    .ant-picker-today-btn {
        color: $primary;
    }
}
```

#### Modal Component

```scss
.ant-modal {
    .ant-modal-header {
        border-radius: $border-radius-lg $border-radius-lg 0 0;
        padding: 16px 24px;
        border-bottom: 1px solid $gray-200;
    }

    .ant-modal-title {
        font-weight: $font-weight-semibold;
        font-size: $font-size-18;
    }

    .ant-modal-content {
        border-radius: $border-radius-lg;
    }

    .ant-modal-footer {
        border-top: 1px solid $gray-200;
        padding: 16px 24px;
    }
}
```

#### Dark Mode Support for Ant Design

```scss
[data-theme="dark"] {
    // Table dark mode
    .ant-table {
        background-color: #171724 !important;

        .ant-table-thead > tr > th {
            background-color: #1e1e2d !important;
            color: #ffffff !important;
            border-color: #2d2d3f !important;
        }

        .ant-table-tbody > tr > td {
            background-color: #171724 !important;
            color: #a0a0a0 !important;
            border-color: #2d2d3f !important;
        }

        .ant-table-tbody > tr:hover > td {
            background-color: #1e1e2d !important;
        }
    }

    // Select dark mode
    .ant-select-selector {
        background-color: #1e1e2d !important;
        border-color: #2d2d3f !important;
        color: #ffffff !important;
    }

    // Modal dark mode
    .ant-modal-content {
        background-color: #1e1e2d !important;

        .ant-modal-header {
            background-color: #1e1e2d !important;
            border-color: #2d2d3f !important;
        }

        .ant-modal-title {
            color: #ffffff !important;
        }
    }
}
```

---

## Component Styling Strategy

### CSS Specificity Management

The project uses a layered specificity approach:

```
1. Ant Design base styles (lowest specificity)
2. Bootstrap utilities (medium specificity)
3. Custom SCSS overrides (higher specificity with !important when needed)
4. Theme-specific styles (highest - using data attributes)
```

### Naming Conventions

| Framework | Convention | Example |
|-----------|------------|---------|
| Bootstrap | Utility-first | `.btn-primary`, `.d-flex`, `.p-3` |
| Ant Design | Component-based | `.ant-table`, `.ant-select`, `.ant-modal` |
| Custom | BEM-like | `.card-dropdown`, `.sidebar-menu-item` |

### When to Use Each Framework

| Use Case | Framework | Reason |
|----------|-----------|--------|
| Page layouts | Bootstrap Grid | Familiar 12-column system |
| Data tables | Ant Design Table | Rich features (sorting, filtering, pagination) |
| Form inputs | Ant Design | Validation, date pickers, complex selects |
| Buttons | Bootstrap | Simpler, more customizable |
| Modals | Ant Design | Better accessibility, animations |
| Spacing | Bootstrap utilities | Quick inline adjustments |
| Icons | Feather/Tabler | Consistent icon set |

---

## Theme System

### Layout Modes

The project supports multiple layout configurations via data attributes:

```html
<body data-layout="default" data-width="full" data-theme="light">
```

#### Available Layout Options

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-layout` | `default`, `mini`, `horizontal`, `twocolumn`, `modern`, `stacked` | Sidebar layout style |
| `data-width` | `full`, `box` | Content width mode |
| `data-theme` | `light`, `dark` | Color theme |
| `data-sidebar` | `dark`, `light`, `gradient` | Sidebar color scheme |
| `data-topbar` | `dark`, `light` | Header color scheme |

### Layout Configurations (`_theme.scss`)

```scss
// Box mode layout
[data-layout="default"][data-width="box"] {
    .main-wrapper {
        max-width: 1320px;
        margin: auto;
    }
}

// Mini sidebar mode
[data-layout="mini"] {
    .sidebar {
        width: 72px;

        .sidebar-menu span {
            display: none;
        }
    }

    .page-wrapper {
        margin-left: 72px;
    }
}

// Horizontal navigation
[data-layout="horizontal"] {
    .sidebar {
        position: relative;
        flex-direction: row;
        width: 100%;
    }
}
```

### Dark Theme Implementation

```scss
[data-theme="dark"] {
    // Global background
    body {
        background-color: #0e0e23;
        color: #ffffff;
    }

    // Card styling
    .card {
        background-color: #171724;
        border-color: #2d2d3f;
    }

    // Form controls
    .form-control {
        background-color: #1e1e2d;
        border-color: #2d2d3f;
        color: #ffffff;

        &::placeholder {
            color: #6c757d;
        }
    }

    // Tables
    .table {
        color: #ffffff;

        th, td {
            border-color: #2d2d3f;
        }
    }
}
```

---

## Responsive Design

### Breakpoint Mixins (`_mixins.scss`)

```scss
// Breakpoint values
$breakpoints: (
    'sm': 576px,
    'md': 768px,
    'lg': 992px,
    'xl': 1200px,
    'xxl': 1400px
);

// Respond below breakpoint
@mixin respond-below($breakpoint) {
    @if map-has-key($breakpoints, $breakpoint) {
        @media (max-width: map-get($breakpoints, $breakpoint) - 0.02px) {
            @content;
        }
    }
}

// Respond above breakpoint
@mixin respond-above($breakpoint) {
    @if map-has-key($breakpoints, $breakpoint) {
        @media (min-width: map-get($breakpoints, $breakpoint)) {
            @content;
        }
    }
}
```

### Usage Examples

```scss
.card-title {
    font-size: $font-size-18;

    @include respond-below(md) {
        font-size: $font-size-16;
    }
}

.sidebar {
    width: 252px;

    @include respond-below(lg) {
        position: fixed;
        left: -252px;

        &.show {
            left: 0;
        }
    }
}
```

---

## Vendor Integrations

### DataTables (`_datatables.scss`)

Custom styling for jQuery DataTables:

```scss
table.dataTable {
    margin: 0 !important;

    > thead .sorting:after {
        content: "\f175";
        font-family: 'Font Awesome 5 Free';
        color: $gray-300;
    }
}

.dataTables_paginate .pagination li {
    margin: 0 2px;

    a {
        border-radius: 50% !important;
        width: 26px;
        height: 26px;
    }

    &.active a.page-link {
        background: $primary;
        border-color: $primary;
    }
}
```

### Select2 (`_select2.scss`)

Custom styling for Select2 dropdowns:

```scss
.select2-container--default .select2-selection--single {
    height: 38px;
    border: 1px solid $input-border;
    border-radius: $border-radius;

    .select2-selection__rendered {
        line-height: 38px;
        padding-left: 10px;
    }
}

.select2-results__option--highlighted {
    background: $primary;
    color: $white;
}
```

---

## Best Practices

### 1. Adding New Styles

```scss
// DO: Use existing variables
.my-component {
    color: $primary;
    font-size: $font-size-14;
    border-radius: $border-radius;
}

// DON'T: Hardcode values
.my-component {
    color: #F26522;
    font-size: 14px;
    border-radius: 6px;
}
```

### 2. Overriding Ant Design Components

```scss
// DO: Target specific components with clear selectors
.ant-table-thead > tr > th {
    background: $light-500;
}

// DON'T: Use overly generic selectors
th {
    background: $light-500;
}
```

### 3. Theme-Aware Styling

```scss
// DO: Use data attribute selectors for theme-specific styles
[data-theme="dark"] .my-component {
    background-color: #1e1e2d;
}

// DON'T: Use separate classes
.my-component-dark {
    background-color: #1e1e2d;
}
```

### 4. Responsive Design

```scss
// DO: Use mixins consistently
.sidebar {
    @include respond-below(lg) {
        display: none;
    }
}

// DON'T: Write raw media queries
.sidebar {
    @media (max-width: 991px) {
        display: none;
    }
}
```

### 5. File Organization

- Place new component styles in `components/`
- Place page-specific styles in `pages/`
- Place Ant Design overrides in `pages/_vue.scss`
- Always import new files in `main.scss`

---

## Summary

This HRMS frontend successfully combines Ant Design Vue and Bootstrap 5 through:

1. **Layered Architecture**: Clear separation of concerns with modular SCSS
2. **Unified Design Language**: Consistent colors, typography, and spacing across both frameworks
3. **CSS Custom Properties**: Runtime theming without rebuild
4. **Comprehensive Overrides**: Ant Design components styled to match Bootstrap aesthetics
5. **Responsive Design**: Consistent breakpoints and mobile-first approach
6. **Dark Mode Support**: Full dark theme for all components

The key to maintaining this architecture is:
- Always use SCSS variables for consistency
- Add Ant Design overrides to `_vue.scss`
- Follow the established import order in `main.scss`
- Use the responsive mixins for breakpoints
- Test both light and dark themes when adding new styles

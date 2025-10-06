# HRMS Frontend Styling Architecture Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Color System & Theme Variables](#color-system--theme-variables)
4. [Typography System](#typography-system)
5. [Component Styling Guide](#component-styling-guide)
6. [Layout System](#layout-system)
7. [Utility Classes](#utility-classes)
8. [Responsive Design Patterns](#responsive-design-patterns)
9. [Ant Design Vue Customizations](#ant-design-vue-customizations)
10. [Performance Optimizations](#performance-optimizations)
11. [Best Practices](#best-practices)

---

## 🎯 Overview

The HRMS frontend uses a comprehensive SCSS architecture built on top of Bootstrap 5 and Ant Design Vue, providing a scalable, maintainable, and consistent design system.

### Technology Stack

- **Bootstrap 5.3.3**: Base framework for layout and utilities
- **Ant Design Vue 4.2.6**: Advanced components and data tables
- **SCSS**: CSS preprocessor for modular styling
- **Custom Design System**: Tailored color palette and components

### Main Entry Point

```scss
// src/assets/scss/main.scss
:root {
  --primary-color: #0067A5; // NetSuite blue
  --secondary-color: #6B7280;
  --success-color: #10B981;
  --danger-color: #EF4444;
  --warning-color: #F59E0B;
  --info-color: #3B82F6;
}
```

---

## 📁 File Structure

```
src/assets/
├── css/                          # Standalone CSS files
│   ├── feather.css              # Feather icon font
│   ├── font-display-override.css # Font loading optimization
│   ├── sticky.css               # Sticky notes component
│   ├── tabler-icons.css         # Tabler icon font
│   └── vue-form-wizard.css      # Form wizard styling
│
├── scss/                         # SCSS modular architecture
│   ├── main.scss                # Main entry point
│   ├── utils/                   # Utilities and variables
│   │   ├── _variables.scss      # Color, font, spacing variables
│   │   └── _mixins.scss         # Reusable SCSS mixins
│   │
│   ├── base/                    # Base styles
│   │   ├── _base.scss           # Global HTML element styles
│   │   └── _background.scss     # Background utilities
│   │
│   ├── components/              # Component styles (36 files)
│   │   ├── _boostrap.scss       # Bootstrap overrides
│   │   ├── _button.scss         # Button variants
│   │   ├── _badge.scss          # Badge styles
│   │   ├── _cards.scss          # Card components
│   │   ├── _forms.scss          # Form controls
│   │   ├── _tables.scss         # Table styling
│   │   └── ... (30+ more)
│   │
│   ├── layout/                  # Layout components
│   │   ├── _common.scss         # Common layout styles
│   │   ├── _header.scss         # Header component
│   │   ├── _sidebar.scss        # Sidebar navigation
│   │   ├── _theme.scss          # Theme configuration
│   │   └── _notification.scss   # Notification styles
│   │
│   ├── vendors/                 # Third-party customizations
│   │   ├── _datatables.scss     # DataTables plugin
│   │   ├── _select2.scss        # Select2 plugin
│   │   └── _rangepicker-plugin.scss
│   │
│   └── pages/                   # Page-specific styles
│       ├── _vue.scss            # Vue.js specific styles
│       ├── _dashboard.scss      # Dashboard page
│       ├── _leaves.scss         # Leaves management
│       └── ... (16 more files)
```

---

## 🎨 Color System & Theme Variables

### Primary Color Palette

```scss
// src/assets/scss/utils/_variables.scss

// Brand Colors
$primary: #011b44;           // NetSuite blue (main brand)
$secondary: #3B7080;         // Teal blue
$success: #03C95A;           // Green
$info: #1B84FF;              // Blue
$warning: #FFC107;           // Yellow/Gold
$danger: #E70D0D;            // Red
$dark: #212529;              // Dark gray
$light: #F8F9FA;             // Light gray
$white: #FFF;
$black: #000;
```

### Extended Color Palette

```scss
// Additional Colors
$purple: #AB47BC;
$pink: #FD3995;
$skyblue: #0DCAF0;
$teal: #02a8b5;

// Special Purpose Colors
$dark-green: #111926;
$night-blue: #0F0F41;
$royal-blue: #0039C6;
$lavender: #673AB7;
$magenta: #E83E8C;
```

### Color Scale System

Each main color has a 9-step scale (100-900):

```scss
// Primary Scale
$primary-100: #E6E9EE;   // Lightest
$primary-200: #CCD3DD;
$primary-300: #B3BDCC;
$primary-400: #99A7BB;
$primary-500: #8091AA;   // Mid-tone
$primary-600: #667B99;
$primary-700: #4D6588;
$primary-800: #334F77;
$primary-900: #1A3966;   // Darkest

// Same pattern for: secondary, pink, light, gray, info, success, danger, warning, purple, skyblue
```

### Semantic Colors

```scss
// Text Colors
$text-color: #6B7280;
$title-color: #202C4B;
$sub-title: #6B7280;
$text-muted: #677788;

// Background Colors
$body-bg: #fff;
$default-background: #F8F9FA;
$form-control-bg: #ffffff;

// Border Colors
$border-color: $gray-200;
$default-border: $gray-200;
$input-border: $gray-200;
```

### Transparent Variants

```scss
// Gradient/Transparent Colors
$primary-transparent: #FEF1EB;
$secondary-transparent: #EDF2F4;
$success-transparent: #E8FAF0;
$warning-transparent: #FFF9E9;
$danger-transparent: #FAE7E7;
$info-transparent: #EBF4FF;
$purple-transparent: #F7EEF9;
$skyblue-transparent: #E9FAFE;
```

### Gradient System

```scss
$primary-gradient: linear-gradient(90deg, $primary 0%, darken($primary, 10%) 100%);
$secondary-gradient: linear-gradient(180deg, #3B7080 0%, #3D90A9 100%);
$success-gradient: linear-gradient(180deg, #2DCB73 0%, #0DA952 100%);
$danger-gradient: linear-gradient(180deg, #E70D0D 0%, #810707 100%);
```

### Dark Mode Colors

```scss
// Darkmode Base
$darkmode-light: #131313;
$darkmode-dark: #D6DADE;
$darkmode-white: #0D0D0D;

// Darkmode Gray Scale
$darkmode-gray-900: #D8DFEE;
$darkmode-gray-800: #C8D2E0;
// ... continues to 100

// Darkmode Transparent
$darkmode-primary-transparent: #100601;
$darkmode-secondary-transparent: #030D11;
// ... all color variants
```

---

## 📝 Typography System

### Font Configuration

```scss
// Font Import
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

// Font Family
$font-family-primary: "Roboto", sans-serif;
$font-awesome: "Fontawesome";
```

### Font Sizes

```scss
// Base Sizes
$font-size-base: 14px;
$font-size-sm: 12.25px;  // $font-size-base * 0.875
$font-size-lg: 17.5px;   // $font-size-base * 1.25

// Specific Sizes (8px to 60px)
$font-size-8: 8px;
$font-size-10: 10px;
$font-size-12: 12px;
$font-size-14: 14px;
$font-size-16: 16px;
$font-size-18: 18px;
$font-size-20: 20px;
$font-size-24: 24px;
$font-size-28: 28px;
$font-size-32: 32px;
$font-size-36: 36px;
$font-size-40: 40px;
$font-size-50: 50px;
$font-size-60: 60px;

// Heading Sizes
$h1-font-size: 28px;
$h2-font-size: 24px;
$h3-font-size: 20px;
$h4-font-size: 18px;
$h5-font-size: 16px;
$h6-font-size: 14px;
```

### Font Weights

```scss
$font-weight-lighter: lighter;
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-bolder: bolder;
```

### Typography Styles

```scss
body {
  font-family: $font-family-primary;
  font-size: $font-size-14;
  color: $text-color;
  line-height: 1.5;
}

h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6 {
  color: $title-color;
  font-family: $font-family-primary;
  font-weight: $font-weight-bold;
  margin-bottom: 0;
}
```

---

## 🧩 Component Styling Guide

### Buttons

#### Button Base Styles

```scss
.btn {
  border-radius: 5px;           // $border-radius-lg
  padding: 0.5rem 0.85rem;
  font-size: 14px;
  transition: all 0.5s;
  font-weight: 500;             // $font-weight-medium
}

// Sizes
.btn-lg { padding: 0.65rem 1rem; font-size: 0.95rem; }
.btn-md { padding: 0.35rem 0.85rem; font-size: 0.813rem; }
.btn-sm { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
.btn-xs { padding: 0.25rem 0.5rem; font-size: 0.6rem; }
```

#### Button Variants

```scss
// Primary Button
.btn-primary {
  background-color: $primary-900;  // #1A3966
  border: 1px solid $primary-900;
  color: $white;
  
  &:hover {
    background-color: darken($primary-900, 7%);
    border: 1px solid darken($primary-900, 7%);
  }
}

// Light Buttons
.btn-primary-light {
  background-color: rgba($primary, 0.1);
  color: $primary;
  
  &:hover {
    background-color: $primary;
    color: $white;
  }
}

// Ghost/Outline Buttons
.btn-outline-primary {
  border: 1px solid $primary;
  color: $primary;
  
  &:hover {
    background-color: $primary;
    box-shadow: 0 3px 10px rgba($primary, 0.5);
    color: $white;
  }
}

// Soft Buttons
.btn-soft-primary {
  background-color: $primary-300;
  color: $primary;
  
  &:hover {
    box-shadow: 0 3px 12px rgba($primary, .2);
    border-color: $primary;
  }
}
```

#### Icon Buttons

```scss
.btn-icon {
  width: 2.313rem;
  height: 2.313rem;
  font-size: 0.95rem;
  flex-shrink: 0;
  
  &.btn-xs { width: 24px; height: 24px; font-size: 0.8rem; }
  &.btn-sm { width: 1.75rem; height: 1.75rem; font-size: 0.8rem; }
  &.btn-lg { width: 2.75rem; height: 2.75rem; font-size: 1.2rem; }
}
```

### Cards

#### Card Base

```scss
.card {
  margin-bottom: 1.5rem;
  background-color: $white;
  transition: all 0.5s ease-in-out;
  position: relative;
  border-radius: 5px;
  border: 1px solid $gray-200;
  box-shadow: 0px 1px 1px 1px rgba(198, 198, 198, 0.2);
  
  .card-body {
    padding: 1.25rem;
    
    @media (max-width: 767.98px) {
      padding: 16px;
    }
  }
  
  .card-header {
    border-color: $gray-200;
    background: transparent;
    padding: 1rem 1.25rem;
  }
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    text-transform: capitalize;
    color: $gray-900;
  }
}
```

#### Card Variants

```scss
// Colored Cards
.card-bg-primary {
  background-color: $primary;
  color: $white;
  
  .card-header {
    background-color: rgba(255, 255, 255, 0.1);
    color: $white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
}

// Statistics Card Pattern (Common in HRMS)
.statistics-card {
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}
```

### Badges

```scss
.badge {
  padding: 0.25rem 0.45rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 4px;
  
  // Sizes
  &.badge-xs { font-size: 10px; padding: 0 5px; line-height: 18px; }
  &.badge-sm { font-size: 11px; padding: 5px 8px; }
  &.badge-md { font-size: 12px; padding: 5px 12px; }
  &.badge-lg { font-size: 14px; padding: 0 10px; line-height: 30px; }
  &.badge-xl { font-size: 16px; padding: 0 15px; line-height: 35px; }
}

// Soft Badges (Transparent background)
.badge-soft-primary {
  background: rgba($primary, 0.1);
  color: $primary;
}

.badge-soft-success {
  background: $success-100;
  color: $success;
}
```

### Forms

#### Form Controls

```scss
.form-control {
  border-color: $input-border;      // #E5E7EB
  color: $gray-900;
  background-color: $form-control-bg;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  border-radius: 5px;
  padding: 0.5rem 0.625rem;
  height: 38px;
  transition: all 0.5s;
  
  &:focus {
    box-shadow: none;
    border-color: $input-border;
  }
}

// Form Control Sizes
.form-control-sm {
  font-size: 0.8rem;
  padding: 0.25rem 0.8rem;
  height: auto;
}

.form-control-lg {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}
```

#### Form Labels

```scss
.form-label {
  font-size: 14px;
  font-weight: 500;
  color: $title-color;  // #202C4B
}

.form-label.required::after {
  content: ' *';
  color: #dc3545;
}
```

#### Checkboxes & Radio Buttons

```scss
.form-check-input {
  width: 0.9rem;
  height: 0.9rem;
  background-color: $white;
  border: 1px solid $input-border;
  
  &:checked {
    background-color: $primary;
    border-color: $primary;
  }
  
  &:focus {
    box-shadow: none;
  }
}

// Custom Radio (used in selectors)
.custom-radio {
  display: block;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  font-size: 15px;
  color: $gray-700;
  
  input:checked ~ .checkmark {
    border-color: $primary;
    background: $primary;
    
    &::after {
      opacity: 1;
      visibility: visible;
    }
  }
  
  .checkmark {
    width: 20px;
    height: 20px;
    border: 1px solid $light-900;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    
    &::after {
      content: "";
      width: 8px;
      height: 8px;
      background-color: $white;
      opacity: 0;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
```

### Tables

```scss
.table {
  color: $text-color;
  border-color: $default-border;
  margin-bottom: 0;
  
  th, td {
    padding: 8px 20px;
    vertical-align: middle;
    font-size: 14px;
    white-space: nowrap;
  }
  
  thead tr th {
    font-weight: 600;
    border-color: $light-900;
    background: $gray-200;
    font-size: 14px;
    color: $gray-900;
  }
  
  tbody tr {
    border-color: $light-900;
  }
}

// Action Icons in Tables
.action-icon a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: #6c757d;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8f9fa;
    color: var(--bs-primary);
  }
}
```

---

## 🏗️ Layout System

### Grid & Spacing

```scss
// Border Radius
$border-radius: 4px;
$border-radius-sm: 3px;
$border-radius-lg: 5px;
$border-radius-xl: 8px;
$border-radius-xxl: 12px;
$rounded: 50%;
$rounded-pill: 1.5rem;

// Box Shadows
$box-shadow: 0px 4px 54px 0px #E0E0E040;
$box-shadow-xs: 0px 1px 1px 1px rgba(198, 198, 198, 0.2);
$box-shadow-sm: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);
$box-shadow-md: 0px 3px 8px 0px rgba(0, 0, 0, 0.1);
$box-shadow-lg: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
$drop-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);

// Spacer
$spacer: 1rem;
```

### Header Layout

```scss
.header {
  height: 50px;
  z-index: 999;
  background: $white;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  transition: all 0.5s ease;
  border-bottom: 1px solid $gray-200;
  
  @media (min-width: 992px) {
    left: 252px;  // Sidebar width offset
  }
}
```

### Page Wrapper

```scss
.page-wrapper {
  margin-left: 0;
  padding-top: 50px;  // Header height
  transition: all 0.5s ease;
  
  @media (min-width: 992px) {
    margin-left: 252px;  // Sidebar width
  }
  
  .content {
    padding: 20px;
    min-height: calc(100vh - 50px);
  }
}
```

### Responsive Containers

```scss
// Statistics Row (Common Pattern)
.statistics-row {
  margin-bottom: 1.5rem;
  
  .statistics-card {
    height: 100%;
  }
}

// Pagination Wrapper
.pagination-wrapper {
  margin-top: 20px;
  padding: 15px 0;
}
```

---

## 🛠️ Utility Classes

### Display Utilities

```scss
.hidden {
  display: none !important;
  visibility: hidden;
}

.visuallyhidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
```

### Input Icons

```scss
// Icon Addon Pattern
.input-icon-addon {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  pointer-events: none;
  font-size: 1.2em;
  color: $gray-400;
  z-index: 9;
  
  &:last-child {
    right: 0;
    left: auto;
  }
}

.input-icon-start .form-control {
  padding-left: 32px;
}

.input-icon-end .form-control {
  padding-right: 32px;
}
```

### Section Styling

```scss
// Form Section (Used in modals)
.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #495057;
  
  i {
    font-size: 20px;
    margin-right: 8px;
    color: var(--bs-primary);
  }
  
  h6 {
    margin: 0;
    font-weight: 600;
  }
}
```

---

## 📱 Responsive Design Patterns

### Breakpoints

```scss
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

### Responsive Mixins

```scss
// Respond Above Breakpoint
@mixin respond-above($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    $breakpoint-value: map-get($breakpoints, $breakpoint);
    
    @media (min-width: $breakpoint-value) {
      @content;
    }
  }
}

// Respond Below Breakpoint
@mixin respond-below($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    $breakpoint-value: map-get($breakpoints, $breakpoint);
    $max-value: $breakpoint-value - 0.02px;
    
    @media (max-width: $max-value) {
      @content;
    }
  }
}
```

### Usage Examples

```scss
// Mobile-first approach
.statistics-card {
  .card-body {
    padding: 1.25rem;
    
    @include respond-below(md) {
      padding: 16px;
    }
  }
}

.card-title {
  font-size: 18px;
  
  @include respond-below(md) {
    font-size: 16px;
  }
}

// Hide on mobile
.input-group {
  @include respond-below(xl) {
    display: none;
  }
}
```

---

## 🔧 Ant Design Vue Customizations

### Table Customizations

```scss
// Ant Table Base
.ant-table {
  border: 1px solid #e9f2f6;
  font-family: "Roboto", sans-serif;
  
  .ant-table-thead > tr > th {
    border-bottom: 0px solid #f0f0f0;
    background-color: #f2f4f8;
    font-weight: 600;
    color: #212B36;
    padding: 10px;
  }
  
  .ant-table-tbody > tr {
    &:hover {
      background: #f5f5f5;
    }
    
    td {
      padding: 10px 20px;
      color: #434752;
      font-weight: 400;
      vertical-align: middle;
      white-space: nowrap;
    }
  }
}

// Remove default borders
.ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
  display: none;
}

// Selected row styling
.ant-table-tbody > tr.ant-table-row-selected > td {
  background: transparent;
}

// Checkbox styling
.ant-table .ant-table-selection .ant-checkbox-checked .ant-checkbox-inner {
  background-color: #3D5EE1;
  border: 1px solid #3D5EE1;
}
```

### Pagination Customizations

```scss
// Active page item
.ant-pagination-item.ant-pagination-item-active {
  background: #F26522;
  border-color: #F26522;
  color: #fff;
  border-radius: 50%;
  width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

// Regular page items
.ant-pagination-item {
  background: transparent;
  border-color: transparent;
  border-radius: 50%;
  width: 26px;
  color: #404040;
  
  &:hover {
    background: #F26522;
    border-color: #F26522;
    color: #fff;
  }
}

// Navigation buttons
.ant-pagination .ant-pagination-prev,
.ant-pagination .ant-pagination-next {
  background-color: #fff;
  
  .ant-pagination-item-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

### Select & Dropdown

```scss
// Select Container
.ant-select:not(.ant-select-customize-input) .ant-select-selector {
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.ant-select:not(.ant-select-disabled):hover .ant-select-selector {
  border-color: #ced4da;
}

// Dropdown Z-Index Fix (Critical for Modals)
.ant-select-dropdown {
  z-index: 9999 !important;
}

.ant-modal-root,
.ant-modal-mask,
.ant-modal-wrap {
  z-index: 99999 !important;
}
```

### Tags & Badges

```scss
.ant-tag {
  font-size: 13px;
  border: 0px solid #d9d9d9;
  border-radius: 0.25rem;
  text-transform: lowercase;
}

.ant-table-tbody {
  .ant-tag-red {
    color: #FFFFFF;
    background-color: #e84646;
  }
  
  .ant-tag-success {
    color: #FFFFFF;
    background-color: #7bb13c;
  }
  
  .ant-tag-warning {
    color: #FFFFFF;
    background-color: #ffbc34;
  }
}
```

### Date Picker

```scss
.ant-picker {
  &:hover,
  &-focused {
    border-color: #e2e3e4;
  }
}

// Dropdown Z-Index
.ant-picker-dropdown {
  z-index: 1055;  // Above Bootstrap modals
}

// Calendar Customization
.datepic {
  .vc-container {
    border: none;
    min-width: 100%;
  }
  
  .vc-day-layer .vc-highlight {
    background-color: #F26522;
    text-shadow: unset;
    color: #fff;
    border-radius: 4px;
  }
  
  .vc-arrow {
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #3333;
  }
}
```

### Tooltip

```scss
.ant-tooltip {
  display: none;  // Often hidden, use Bootstrap tooltips instead
}
```

### Dark Mode Support

```scss
[data-theme="dark"] {
  .ant-table {
    background-color: #171724;
    border-color: #171724;
  }
  
  .ant-table-thead .ant-table-cell {
    background: #131022;
    color: #efeff2;
    border-color: #1b1632;
  }
  
  .ant-table-tbody > tr > td {
    color: #fff;
  }
  
  .ant-table-wrapper .ant-table-tbody > tr:hover {
    background-color: #171724;
  }
}
```

---

## ⚡ Performance Optimizations

### Font Display Optimization

```css
/* src/assets/css/font-display-override.css */

/**
 * Font Display Override for Performance Optimization
 * Prevents FOIT (Flash of Invisible Text) and improves LCP
 */

@font-face {
  font-family: "Font Awesome 6 Brands";
  font-style: normal;
  font-weight: 400;
  font-display: swap;  /* Performance optimization */
  src: url("~@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2") format("woff2");
}

@font-face {
  font-family: "Font Awesome 6 Free";
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url("~@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2") format("woff2");
}

/**
 * Expected Performance Impact:
 * - Reduces LCP by ~1,100ms
 * - Eliminates font-blocking render delay
 * - Text visible immediately with system font
 */
```

### Scroll Areas

```scss
// Optimized scroll containers
.scroll-area {
  position: relative;
  margin: auto;
  width: 100%;
  height: calc(100vh - 30px);
  background-color: transparent;
}

.scroll-area-one {
  height: calc(100vh - 0px);
}

.scroll-area-two {
  height: calc(100vh - 140px);
}
```

### ResizeObserver Fix

```javascript
// Already implemented in main.js
const resizeObserverLoopErr = /^ResizeObserver loop/;
window.addEventListener('error', (e) => {
  if (resizeObserverLoopErr.test(e.message)) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});
```

### Table Performance

```scss
// Prevent layout shifts
.ant-table {
  td, th {
    white-space: nowrap;  // Prevent text wrapping causing height changes
  }
}

// Resize observer fix
.resize-observer-fix {
  overflow: visible;
  position: relative;
}
```

---

## ✅ Best Practices

### 1. Color Usage

```scss
// ✅ GOOD: Use semantic color variables
.alert-success {
  background-color: $success-transparent;
  color: $success;
  border-color: $success;
}

// ❌ BAD: Hardcoded colors
.alert-success {
  background-color: #E8FAF0;
  color: #03C95A;
}
```

### 2. Spacing Consistency

```scss
// ✅ GOOD: Use consistent spacing patterns
.card-body {
  padding: 1.25rem;  // 20px
  
  @include respond-below(md) {
    padding: 16px;
  }
}

// ✅ GOOD: Use margin utilities
.statistics-row {
  margin-bottom: 1.5rem;  // 24px
}
```

### 3. Z-Index Hierarchy

```scss
// Z-Index Layers (from documentation)
$z-index-dropdown: 9999;
$z-index-modal: 99999;
$z-index-tooltip: 10000;

// Modal Backdrop: 1050
// Modal: 1055
// Ant Design Dropdown: 9999
// Ant Design Modal: 99999
```

### 4. Component Scoping

```vue
<style scoped>
/* Component-specific styles */
.search-input-primary {
  /* Styles only apply to this component */
}

/* Use :deep() for child components */
:deep(.ant-select-dropdown) {
  z-index: 9999 !important;
}
</style>
```

### 5. Responsive Design

```scss
// ✅ GOOD: Mobile-first approach
.statistics-card {
  padding: 16px;
  
  @include respond-above(md) {
    padding: 1.25rem;
  }
}

// ✅ GOOD: Use mixins instead of raw media queries
@include respond-below(md) {
  .card-title {
    font-size: $font-size-16;
  }
}
```

### 6. Button Styling

```scss
// ✅ GOOD: Extend base button classes
.custom-action-btn {
  @extend .btn;
  @extend .btn-primary;
  padding: 0.5rem 1rem;
}

// ✅ GOOD: Use modifier classes
<button class="btn btn-primary btn-sm">
  <i class="ti ti-plus me-2"></i>Add New
</button>
```

### 7. Form Patterns

```html
<!-- ✅ GOOD: Consistent form structure -->
<div class="form-section">
  <div class="section-header">
    <i class="ti ti-user"></i>
    <h6>User Information</h6>
  </div>
  
  <div class="row g-3">
    <div class="col-md-6">
      <label class="form-label required">Name</label>
      <input type="text" class="form-control">
    </div>
  </div>
</div>
```

### 8. Table Action Icons

```html
<!-- ✅ GOOD: Consistent action icon pattern -->
<div class="action-icon d-inline-flex">
  <a href="javascript:void(0);" @click="editItem" class="me-2">
    <i class="ti ti-edit"></i>
  </a>
  <a href="javascript:void(0);" @click="deleteItem">
    <i class="ti ti-trash"></i>
  </a>
</div>
```

### 9. Statistics Cards Pattern

```html
<!-- ✅ GOOD: Standard statistics card -->
<div class="col-lg-3 col-md-6 d-flex">
  <div class="card flex-fill statistics-card">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center overflow-hidden">
        <div>
          <span class="avatar avatar-lg bg-primary rounded-circle">
            <i class="ti ti-users"></i>
          </span>
        </div>
        <div class="ms-2 overflow-hidden">
          <p class="fs-12 fw-medium mb-1 text-truncate">Total Employees</p>
          <h4>{{ statistics.total }}</h4>
        </div>
      </div>
      <div>
        <span class="badge badge-soft-primary badge-sm fw-normal">
          <i class="ti ti-arrow-wave-right-up"></i>
          {{ percentage }}%
        </span>
      </div>
    </div>
  </div>
</div>
```

### 10. Modal Patterns

```html
<!-- ✅ GOOD: Standard modal with tabs -->
<div class="modal fade" id="item_modal">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">{{ modalTitle }}</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <div class="form-section">
            <!-- Form content -->
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>
```

---

## 📚 Quick Reference

### Common Class Combinations

```html
<!-- Page Breadcrumb -->
<div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
  <!-- Content -->
</div>

<!-- Search Input with Icon -->
<div class="input-icon-end">
  <a-input-search 
    v-model:value="searchValue"
    placeholder="Search..."
    style="width: 250px;"
    class="search-input-primary"
  />
</div>

<!-- Card Header with Actions -->
<div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
  <h5>Title</h5>
  <div class="d-flex align-items-center flex-wrap row-gap-2">
    <!-- Actions -->
  </div>
</div>

<!-- Responsive Table Container -->
<div class="card-body">
  <div class="resize-observer-fix">
    <a-table 
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ x: 1000, y: 'max-content' }"
    />
  </div>
</div>
```

---

## 🔗 Integration with Hybrid Guide

This styling architecture documentation complements the [HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md) by providing:

1. **Complete Color Palette**: Use documented colors for consistent theming
2. **Typography Scale**: Apply documented font sizes and weights
3. **Component Patterns**: Follow established component styling patterns
4. **Responsive Mixins**: Use provided mixins for consistent breakpoints
5. **Ant Design Overrides**: Apply documented customizations for framework integration
6. **Performance Optimizations**: Implement documented performance patterns

### Cross-Reference Guide

| Hybrid Guide Section | Styling Architecture Section |
|---------------------|------------------------------|
| Framework Decision Matrix | Component Styling Guide |
| List Page Implementation | Layout System + Table Patterns |
| Modal Implementation | Modal Patterns + Form Patterns |
| Common Patterns | Utility Classes + Component Guide |
| Import Strategies | Performance Optimizations |
| Conflict Resolution | Ant Design Customizations |

---

## 📝 Changelog

### Version 1.0 (2025-09-30)
- Initial comprehensive styling architecture documentation
- Documented complete color system and variables
- Added typography system documentation
- Included all component styling patterns
- Documented layout and responsive patterns
- Added Ant Design Vue customizations
- Included performance optimization techniques
- Added best practices and quick reference

---

**Document Version**: 1.0  
**Last Updated**: 2025-09-30  
**Author**: HRMS Development Team  
**Status**: ✅ Active Reference  
**Related Documents**: [HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md)

# HRMS Frontend Styling Quick Reference

> 🚀 Quick access to the most commonly used styling patterns, colors, and components

## 📚 Documentation Index

- **[HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md)** - Framework integration patterns and component usage
- **[STYLING_ARCHITECTURE_DOCUMENTATION.md](./STYLING_ARCHITECTURE_DOCUMENTATION.md)** - Complete SCSS architecture and design system

---

## 🎨 Color Palette Quick Reference

### Brand Colors

```scss
$primary: #011b44;      // NetSuite blue - Main brand color
$secondary: #3B7080;    // Teal blue
$success: #03C95A;      // Green - Success states
$danger: #E70D0D;       // Red - Error/delete actions
$warning: #FFC107;      // Yellow - Warning states
$info: #1B84FF;         // Blue - Info messages
```

### Commonly Used Colors

```scss
// Text
$text-color: #6B7280;           // Body text
$title-color: #202C4B;          // Headings
$gray-900: #111827;             // Dark text

// Backgrounds
$light: #F8F9FA;                // Page background
$white: #FFF;                   // Card backgrounds
$gray-100: #F3F4F6;             // Light backgrounds
$gray-200: #E5E7EB;             // Borders

// Transparent variants (for badges/alerts)
$success-transparent: #E8FAF0;
$danger-transparent: #FAE7E7;
$warning-transparent: #FFF9E9;
$info-transparent: #EBF4FF;
```

---

## 📏 Typography Quick Reference

### Font Sizes

```scss
$font-size-12: 12px;   // Small text, badges
$font-size-14: 14px;   // Body text (default)
$font-size-16: 16px;   // Subheadings
$font-size-18: 18px;   // Card titles
$font-size-24: 24px;   // Page headings
```

### Font Weights

```scss
$font-weight-normal: 400;     // Regular text
$font-weight-medium: 500;     // Form labels
$font-weight-semibold: 600;   // Card titles
$font-weight-bold: 700;       // Headings
```

---

## 🔘 Button Quick Reference

### Basic Buttons

```html
<!-- Primary Action -->
<button class="btn btn-primary">Save</button>

<!-- Secondary Action -->
<button class="btn btn-light">Cancel</button>

<!-- Danger Action -->
<button class="btn btn-danger">Delete</button>

<!-- With Icon -->
<button class="btn btn-primary">
  <i class="ti ti-plus me-2"></i>Add New
</button>
```

### Button Sizes

```html
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-xs">Extra Small</button>
```

### Button Variants

```html
<!-- Outline -->
<button class="btn btn-outline-primary">Outline</button>

<!-- Light (transparent background) -->
<button class="btn btn-primary-light">Light</button>

<!-- Soft (subtle background) -->
<button class="btn btn-soft-primary">Soft</button>

<!-- Icon Only -->
<button class="btn btn-icon btn-light">
  <i class="ti ti-edit"></i>
</button>
```

---

## 🏷️ Badge Quick Reference

### Basic Badges

```html
<!-- Solid -->
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-danger">Danger</span>

<!-- Soft (transparent) -->
<span class="badge badge-soft-primary">Primary</span>
<span class="badge badge-soft-success">Active</span>
<span class="badge badge-soft-danger">Rejected</span>
```

### Badge Sizes

```html
<span class="badge badge-xs badge-soft-primary">XS</span>
<span class="badge badge-sm badge-soft-success">Small</span>
<span class="badge badge-md badge-soft-info">Medium</span>
<span class="badge badge-lg badge-soft-warning">Large</span>
```

---

## 📋 Card Quick Reference

### Basic Card

```html
<div class="card">
  <div class="card-header">
    <h5>Card Title</h5>
  </div>
  <div class="card-body">
    Card content
  </div>
  <div class="card-footer">
    Footer content
  </div>
</div>
```

### Statistics Card Pattern

```html
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
          <p class="fs-12 fw-medium mb-1 text-truncate">Total Items</p>
          <h4>{{ count }}</h4>
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

---

## 📝 Form Quick Reference

### Form Group

```html
<div class="row g-3">
  <!-- Text Input -->
  <div class="col-md-6">
    <label class="form-label required">Name</label>
    <input type="text" class="form-control" v-model="form.name">
  </div>
  
  <!-- Select (Bootstrap) -->
  <div class="col-md-6">
    <label class="form-label">Category</label>
    <select class="form-select" v-model="form.category">
      <option value="">Select...</option>
      <option value="1">Option 1</option>
    </select>
  </div>
  
  <!-- Select (Ant Design - for multi-select) -->
  <div class="col-md-6">
    <label class="form-label">Tags</label>
    <a-select
      v-model:value="form.tags"
      mode="multiple"
      style="width: 100%"
      placeholder="Select tags"
      :get-popup-container="(trigger) => trigger.parentNode"
    />
  </div>
</div>
```

### Form Section (Modal Pattern)

```html
<div class="form-section">
  <div class="section-header">
    <i class="ti ti-user"></i>
    <h6>User Information</h6>
  </div>
  
  <div class="row g-3">
    <!-- Form fields -->
  </div>
</div>
```

### Input with Icon

```html
<!-- Icon on left -->
<div class="input-icon-start">
  <span class="input-icon-addon">
    <i class="ti ti-search"></i>
  </span>
  <input type="text" class="form-control" placeholder="Search...">
</div>

<!-- Icon on right -->
<div class="input-icon-end">
  <input type="text" class="form-control" placeholder="Search...">
  <span class="input-icon-addon">
    <i class="ti ti-search"></i>
  </span>
</div>
```

---

## 📊 Table Quick Reference

### Ant Design Table (Recommended)

```vue
<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5>Data List</h5>
      <div class="input-icon-end">
        <a-input-search 
          v-model:value="searchValue"
          placeholder="Search..."
          style="width: 250px;"
          class="search-input-primary"
        />
      </div>
    </div>
    
    <div class="card-body">
      <div class="resize-observer-fix">
        <a-table 
          :columns="columns"
          :data-source="data"
          :pagination="false"
          :scroll="{ x: 1000, y: 'max-content' }"
          :row-selection="rowSelection"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <div class="action-icon d-inline-flex">
                <a href="javascript:void(0);" @click="edit(record)" class="me-2">
                  <i class="ti ti-edit"></i>
                </a>
                <a href="javascript:void(0);" @click="deleteItem(record.id)">
                  <i class="ti ti-trash"></i>
                </a>
              </div>
            </template>
            
            <template v-if="column.key === 'status'">
              <span class="badge badge-soft-success">{{ record.status }}</span>
            </template>
          </template>
        </a-table>
        
        <!-- Pagination -->
        <div class="pagination-wrapper">
          <a-pagination 
            v-model:current="page"
            v-model:page-size="pageSize"
            :total="total"
            :show-size-changer="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

### Table Column Configuration

```javascript
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
    width: 80,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Status',
    key: 'status',
    width: 120,
    filters: [
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
    ],
  },
  {
    title: 'Actions',
    key: 'action',
    width: 100,
  },
];
```

---

## 🔄 Modal Quick Reference

### Basic Modal Structure

```vue
<template>
  <div class="modal fade" id="item_modal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        
        <div class="modal-header">
          <h4 class="modal-title">{{ isEdit ? 'Edit' : 'Add' }} Item</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="form-section">
              <div class="section-header">
                <i class="ti ti-user"></i>
                <h6>Information</h6>
              </div>
              
              <div class="row g-3">
                <!-- Form fields -->
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  </div>
</template>

<script>
import { Modal as BootstrapModal } from 'bootstrap';

export default {
  data() {
    return {
      modalInstance: null,
      loading: false,
    };
  },
  
  methods: {
    openModal() {
      this.modalInstance = new BootstrapModal(document.getElementById('item_modal'));
      this.modalInstance.show();
    },
    
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
  },
};
</script>
```

---

## 📱 Responsive Utilities

### Breakpoints

```scss
xs: 0px       // Extra small (mobile)
sm: 576px     // Small (mobile landscape)
md: 768px     // Medium (tablet)
lg: 992px     // Large (desktop)
xl: 1200px    // Extra large
xxl: 1400px   // Extra extra large
```

### Usage

```scss
// Mobile-first
.element {
  padding: 16px;
  
  @include respond-above(md) {
    padding: 1.25rem;
  }
}

// Desktop-first
.element {
  display: block;
  
  @include respond-below(md) {
    display: none;
  }
}
```

### Bootstrap Display Utilities

```html
<!-- Show on desktop only -->
<div class="d-none d-lg-block">Desktop only</div>

<!-- Show on mobile only -->
<div class="d-block d-lg-none">Mobile only</div>

<!-- Responsive flex -->
<div class="d-md-flex d-block">Flex on tablet+, block on mobile</div>
```

---

## 🎯 Common Layout Patterns

### Page Breadcrumb

```html
<div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
  <index-breadcrumb :title="title" :text="text" />
  <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
    <button class="btn btn-primary mb-2 me-2" @click="openModal">
      <i class="ti ti-plus me-2"></i>Add New
    </button>
  </div>
</div>
```

### Statistics Row

```html
<div class="row statistics-row">
  <div class="col-lg-3 col-md-6 d-flex" v-for="stat in statistics" :key="stat.id">
    <!-- Statistics card here -->
  </div>
</div>
```

### Card with Table

```html
<div class="card">
  <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
    <h5>Title</h5>
    <div class="d-flex align-items-center flex-wrap row-gap-2">
      <!-- Search and actions -->
    </div>
  </div>
  
  <div class="card-body">
    <!-- Table content -->
  </div>
</div>
```

---

## 🔧 Critical Z-Index Values

```scss
// Z-Index Hierarchy (from lowest to highest)
.header                      // 999
.sidebar                     // 1000
Modal Backdrop               // 1050
Modal                        // 1055
Ant Design Dropdown          // 9999
Ant Design Modal             // 99999
```

### Ant Design Dropdown Fix

```vue
<style scoped>
:deep(.ant-select-dropdown) {
  z-index: 9999 !important;
}

:deep(.ant-dropdown) {
  z-index: 9999 !important;
}
</style>
```

---

## ⚡ Performance Tips

### Font Loading

```css
/* Use font-display: swap for performance */
@font-face {
  font-family: "Font Awesome 6 Free";
  font-display: swap;  /* Prevents FOIT */
  src: url("...") format("woff2");
}
```

### Table Performance

```vue
<template>
  <!-- Add resize-observer-fix wrapper -->
  <div class="resize-observer-fix">
    <a-table 
      :scroll="{ x: 1000, y: 'max-content' }"
      :pagination="false"
    />
  </div>
</template>

<style scoped>
.resize-observer-fix {
  overflow: visible;
  position: relative;
}
</style>
```

---

## 📋 Import Checklist

### ✅ DO

```javascript
// Selective Bootstrap imports
import { Modal as BootstrapModal } from 'bootstrap';

// Component-level Ant Design imports
import { message } from 'ant-design-vue';

// Scoped styles
<style scoped>
.my-component { ... }
</style>
```

### ❌ DON'T

```javascript
// ❌ Full bundle import (causes conflicts)
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

// ❌ Import everything
import * as bootstrap from 'bootstrap';

// ❌ Unscoped global styles
<style>
.btn { ... }  // Affects all buttons globally
</style>
```

---

## 🔍 Where to Find More

| Need | Go To | Section |
|------|-------|---------|
| **Color codes** | [Styling Architecture](./STYLING_ARCHITECTURE_DOCUMENTATION.md) | Color System & Theme Variables |
| **Button variants** | [Styling Architecture](./STYLING_ARCHITECTURE_DOCUMENTATION.md) | Component Styling Guide > Buttons |
| **Form patterns** | [Styling Architecture](./STYLING_ARCHITECTURE_DOCUMENTATION.md) | Component Styling Guide > Forms |
| **Table setup** | [Hybrid Guide](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md) | List Page Implementation |
| **Modal setup** | [Hybrid Guide](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md) | Modal Implementation |
| **Responsive mixins** | [Styling Architecture](./STYLING_ARCHITECTURE_DOCUMENTATION.md) | Responsive Design Patterns |
| **Conflict fixes** | [Hybrid Guide](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md) | Conflict Resolution |
| **Best practices** | Both guides | Best Practices sections |

---

## 🚀 Quick Start Checklist

When creating a new page/component:

- [ ] Use Bootstrap for layout (grid, cards, containers)
- [ ] Use Ant Design for data tables and pagination
- [ ] Import Bootstrap Modal selectively: `import { Modal as BootstrapModal } from 'bootstrap'`
- [ ] Use documented color variables (not hardcoded colors)
- [ ] Follow statistics card pattern for metrics
- [ ] Use form-section pattern in modals
- [ ] Add z-index fix for Ant Design dropdowns
- [ ] Add resize-observer-fix wrapper for tables
- [ ] Use responsive mixins for breakpoints
- [ ] Add scoped styles for custom CSS
- [ ] Follow action icon pattern for table actions
- [ ] Test modal functionality after navigation

---

**Quick Reference Version**: 1.0  
**Last Updated**: 2025-09-30  
**Related Docs**: 
- [HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md)
- [STYLING_ARCHITECTURE_DOCUMENTATION.md](./STYLING_ARCHITECTURE_DOCUMENTATION.md)

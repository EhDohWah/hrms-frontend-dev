# Hybrid Bootstrap + Ant Design Vue Implementation Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Framework Decision Matrix](#framework-decision-matrix)
3. [Architecture Principles](#architecture-principles)
4. [List Page Implementation](#list-page-implementation)
5. [Modal Implementation](#modal-implementation)
6. [Common Patterns](#common-patterns)
7. [Import Strategies](#import-strategies)
8. [Conflict Resolution](#conflict-resolution)
9. [Best Practices](#best-practices)
10. [Real-World Examples](#real-world-examples)

---

## 🎯 Overview

The HRMS frontend uses a **hybrid approach** combining Bootstrap 5 and Ant Design Vue 4 to leverage the strengths of both frameworks:

- **Bootstrap 5.3.3**: Layout, styling, cards, buttons, forms, modals
- **Ant Design Vue 4.2.6**: Tables, pagination, advanced components, dropdowns
- **Bootstrap Vue 3**: Additional Bootstrap components for Vue.js

### Why Hybrid?

| Framework | Strengths | Use Cases |
|-----------|-----------|-----------|
| **Bootstrap** | 🎨 Rich styling system<br>📱 Responsive grid<br>🎭 Familiar UI patterns<br>⚡ Lightweight | Layout structure<br>Forms & inputs<br>Cards & statistics<br>Modals & alerts<br>Buttons & badges |
| **Ant Design Vue** | 📊 Advanced tables<br>🔍 Built-in filtering/sorting<br>📄 Pagination<br>🎯 Enterprise components | Data tables<br>Complex dropdowns<br>Date pickers<br>Advanced search<br>Tree structures |

---

## 🧭 Framework Decision Matrix

### Quick Decision Guide

```
┌─────────────────────────────────────────────────────────┐
│                    COMPONENT DECISION TREE              │
└─────────────────────────────────────────────────────────┘

Is it a data table?
├─ YES → Use Ant Design <a-table>
└─ NO → Continue

Does it need complex filtering/sorting/pagination?
├─ YES → Use Ant Design components
└─ NO → Continue

Is it a layout component (grid, container, card)?
├─ YES → Use Bootstrap classes
└─ NO → Continue

Is it a form element (input, select, checkbox)?
├─ YES → Use Bootstrap form classes
└─ NO → Continue

Is it a modal/dialog?
├─ YES → Use Bootstrap modal
└─ NO → Use Bootstrap by default, consider Ant Design for special cases
```

### Component-by-Component Guide

#### ✅ Use Bootstrap For:

| Component | Bootstrap Class/Component | Why |
|-----------|---------------------------|-----|
| **Layout** | Grid system (`row`, `col-*`) | Flexible, responsive, well-tested |
| **Cards** | `.card`, `.card-header`, `.card-body` | Beautiful styling, consistent UI |
| **Buttons** | `.btn`, `.btn-primary`, `.btn-*` | Rich variants, good UX |
| **Modals** | Bootstrap Modal API | Smooth animations, familiar pattern |
| **Forms** | `.form-control`, `.form-select`, `.form-check` | Clean styling, validation support |
| **Badges** | `.badge`, `.badge-soft-*` | Variety of colors and styles |
| **Statistics Cards** | Custom Bootstrap cards | Consistent with design system |
| **Loading Spinners** | `.spinner-border` | Native Bootstrap component |
| **Alerts** | `.alert`, `.alert-*` | Simple, effective messaging |

#### ✅ Use Ant Design Vue For:

| Component | Ant Design Component | Why |
|-----------|----------------------|-----|
| **Data Tables** | `<a-table>` | Built-in sorting, filtering, pagination |
| **Pagination** | `<a-pagination>` | Advanced features, customizable |
| **Search** | `<a-input-search>` | Built-in search button, loading states |
| **Select Dropdowns** | `<a-select>` | Multi-select, remote search, tags |
| **Date Pickers** | `<a-date-picker>` | Rich features, range selection |
| **Advanced Filters** | `<a-dropdown>` | Complex filtering UIs |
| **Badges (Status)** | `<a-badge>` | Status indicators with dots |
| **Complex Forms** | Ant Design form components | Validation, async rules |

---

## 🏛️ Architecture Principles

### 1. Layered Approach

```
┌─────────────────────────────────────────┐
│          Bootstrap Layout Layer         │
│  (Grid, Cards, Page Structure)          │
├─────────────────────────────────────────┤
│       Ant Design Component Layer        │
│  (Tables, Pagination, Advanced UI)      │
├─────────────────────────────────────────┤
│        Bootstrap Form Layer             │
│  (Inputs, Buttons, Form Controls)       │
├─────────────────────────────────────────┤
│         Custom Styling Layer            │
│  (SCSS overrides, theme customization)  │
└─────────────────────────────────────────┘
```

### 2. Separation of Concerns

**Bootstrap Handles:**
- ✅ Page structure and layout
- ✅ Visual styling and theming
- ✅ Basic user interactions
- ✅ Form styling and validation

**Ant Design Handles:**
- ✅ Complex data presentation
- ✅ Advanced user interactions
- ✅ State management in components
- ✅ Enterprise-grade features

### 3. Conflict Prevention

**Golden Rules:**
1. ❌ **Never import full Bootstrap bundle in components**
   ```javascript
   // ❌ BAD - Causes global conflicts
   import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
   
   // ✅ GOOD - Selective import
   import { Modal as BootstrapModal } from 'bootstrap';
   ```

2. ✅ **Use scoped styles for custom CSS**
   ```vue
   <style scoped>
   /* Component-specific styles here */
   </style>
   ```

3. ✅ **Set z-index hierarchy properly**
   ```css
   :deep(.ant-select-dropdown) {
     z-index: 9999 !important;
   }
   ```

---

## 📊 List Page Implementation

### Standard List Page Pattern

Based on: `employees-list.vue`, `travel-admin.vue`, `grant-position-list.vue`

#### Template Structure

```vue
<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <!-- Bootstrap Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      
      <!-- Bootstrap Breadcrumb Section -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <!-- Bootstrap Buttons -->
          <div class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAddModal">
              <i class="ti ti-circle-plus me-2"></i>Add New Item
            </button>
          </div>
          <div class="mb-2 me-2">
            <button class="btn btn-danger d-flex align-items-center" 
                    :class="{ 'disabled': selectedRowKeys.length === 0 }">
              <i class="ti ti-trash me-2"></i>Delete Selected
            </button>
          </div>
        </div>
      </div>

      <!-- Bootstrap Statistics Cards -->
      <div class="row statistics-row">
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-primary rounded-circle">
                    <i class="ti ti-icon-name"></i>
                  </span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Label</p>
                  <h4>{{ statistics.value }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-primary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ percentage }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hybrid Table Card -->
      <div class="card">
        <!-- Bootstrap Card Header -->
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>Data List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <!-- Ant Design Buttons -->
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
            <!-- Ant Design Search -->
            <div class="input-icon-end">
              <a-input-search 
                v-model:value="searchValue" 
                placeholder="Search..." 
                :loading="searchLoading"
                enter-button="Search" 
                @search="handleSearch" 
                style="width: 250px;"
                class="search-input-primary" 
              />
            </div>
          </div>
        </div>

        <!-- Bootstrap Card Body -->
        <div class="card-body">
          <!-- Bootstrap Loading State -->
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading data...</p>
          </div>

          <!-- Ant Design Table -->
          <div v-else class="resize-observer-fix">
            <a-table 
              :columns="columns" 
              :data-source="tableData" 
              :pagination="false"
              :scroll="{ x: 1000, y: 'max-content' }" 
              row-key="id" 
              @change="handleTableChange"
              :row-selection="rowSelection"
            >
              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a href="javascript:void(0);" @click="editItem(record)" class="me-2">
                      <i class="ti ti-edit"></i>
                    </a>
                    <a href="javascript:void(0);" @click="deleteItem(record.id)">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>

                <!-- Bootstrap Badges in Table -->
                <template v-if="column.key === 'status'">
                  <span class="badge badge-soft-success">{{ record.status }}</span>
                </template>
              </template>
            </a-table>

            <!-- Ant Design Pagination -->
            <div class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <a-pagination 
                  v-model:current="currentPage" 
                  v-model:page-size="pageSize" 
                  :total="total"
                  :show-size-changer="true" 
                  :show-quick-jumper="true" 
                  :page-size-options="['10', '20', '50', '100']"
                  :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                  @change="handlePaginationChange" 
                  @show-size-change="handleSizeChange" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <layout-footer></layout-footer>
  </div>
</template>
```

#### Script Setup

```vue
<script>
import { ref, computed, onMounted } from 'vue';
import { Modal as BootstrapModal } from 'bootstrap'; // ✅ Selective import
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';

export default {
  name: 'ListPage',
  components: {
    indexBreadcrumb,
  },
  
  setup() {
    // Reactive data
    const loading = ref(false);
    const searchLoading = ref(false);
    const searchValue = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const selectedRowKeys = ref([]);
    
    // Ant Design table columns
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
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
    
    // Row selection for table
    const rowSelection = {
      selectedRowKeys: selectedRowKeys.value,
      onChange: (selectedKeys) => {
        selectedRowKeys.value = selectedKeys;
      },
    };
    
    return {
      loading,
      searchLoading,
      searchValue,
      currentPage,
      pageSize,
      total,
      selectedRowKeys,
      columns,
      rowSelection,
    };
  },
  
  methods: {
    handleTableChange(pagination, filters, sorter) {
      // Handle table changes
    },
    
    handleSearch() {
      // Handle search
    },
    
    clearFilters() {
      // Clear filters
    },
  },
};
</script>
```

#### Required CSS

```vue
<style scoped>
/* Ant Design Dropdown Fix */
:deep(.ant-select-dropdown) {
  z-index: 9999 !important;
}

/* ResizeObserver Fix */
.resize-observer-fix {
  overflow: visible;
  position: relative;
}

/* Statistics Card Styling */
.statistics-card {
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.statistics-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Pagination Wrapper */
.pagination-wrapper {
  margin-top: 20px;
  padding: 15px 0;
}

/* Search Input Styling */
:deep(.search-input-primary .ant-input-search-button) {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

:deep(.search-input-primary .ant-input-search-button:hover) {
  background-color: var(--bs-primary-dark);
}
</style>
```

---

## 🎭 Modal Implementation

### Standard Modal Pattern

Based on: `employee-list-modal.vue`, `travel-request-modal.vue`

#### Template Structure

```vue
<template>
  <!-- Bootstrap Modal -->
  <div class="modal fade" id="add_item_modal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        
        <!-- Bootstrap Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Add New Item</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <!-- Alert Message -->
        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
          {{ alertMessage }}
        </div>

        <!-- Bootstrap Form -->
        <form @submit.prevent="handleSubmit">
          
          <!-- Bootstrap Tabs (Optional) -->
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="basic-tab" data-bs-toggle="tab" 
                        data-bs-target="#basic-info" type="button" role="tab">
                  Basic Information
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="details-tab" data-bs-toggle="tab" 
                        data-bs-target="#details-info" type="button" role="tab">
                  Details
                </button>
              </li>
            </ul>
          </div>

          <div class="tab-content" id="myTabContent">
            <!-- Basic Info Tab -->
            <div class="tab-pane fade show active" id="basic-info" role="tabpanel">
              <div class="modal-body">
                
                <!-- Form Section -->
                <div class="form-section">
                  <div class="section-header">
                    <i class="ti ti-user"></i>
                    <h6>User Information</h6>
                  </div>
                  
                  <div class="row g-3">
                    <!-- Bootstrap Form Controls -->
                    <div class="col-md-6">
                      <label class="form-label required">Name</label>
                      <input type="text" class="form-control" v-model="formData.name" required>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" v-model="formData.email">
                    </div>
                    
                    <!-- Bootstrap Select -->
                    <div class="col-md-6">
                      <label class="form-label">Category</label>
                      <select v-model="formData.category" class="form-select">
                        <option value="">Select category</option>
                        <option value="1">Category 1</option>
                        <option value="2">Category 2</option>
                      </select>
                    </div>
                    
                    <!-- Ant Design Select (for complex dropdowns) -->
                    <div class="col-md-6">
                      <label class="form-label">Tags</label>
                      <a-select
                        v-model:value="formData.tags"
                        mode="multiple"
                        style="width: 100%"
                        placeholder="Select tags"
                        :options="tagOptions"
                        :get-popup-container="(triggerNode) => triggerNode.parentNode"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Details Tab -->
            <div class="tab-pane fade" id="details-info" role="tabpanel">
              <div class="modal-body">
                <!-- Additional form fields -->
              </div>
            </div>
          </div>

          <!-- Bootstrap Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSubmitting ? 'Saving...' : 'Save' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>
```

#### Script Setup

```vue
<script>
import { Modal as BootstrapModal } from 'bootstrap'; // ✅ Selective import

export default {
  name: 'ItemModal',
  
  data() {
    return {
      formData: {
        name: '',
        email: '',
        category: '',
        tags: [],
      },
      tagOptions: [
        { label: 'Tag 1', value: '1' },
        { label: 'Tag 2', value: '2' },
      ],
      alertMessage: '',
      alertClass: '',
      isSubmitting: false,
      modalInstance: null,
    };
  },
  
  methods: {
    openModal(item = null) {
      if (item) {
        // Edit mode
        this.formData = { ...item };
      } else {
        // Add mode
        this.resetForm();
      }
      
      // Open Bootstrap modal
      this.modalInstance = new BootstrapModal(document.getElementById('add_item_modal'));
      this.modalInstance.show();
    },
    
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
    
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        category: '',
        tags: [],
      };
      this.alertMessage = '';
    },
    
    async handleSubmit() {
      this.isSubmitting = true;
      
      try {
        // API call
        await this.saveData();
        
        this.alertMessage = 'Item saved successfully!';
        this.alertClass = 'alert-success';
        
        setTimeout(() => {
          this.closeModal();
          this.$emit('item-saved');
        }, 1500);
        
      } catch (error) {
        this.alertMessage = 'Failed to save item';
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
```

#### Modal CSS

```vue
<style scoped>
/* Modal Styling */
.modal-content {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 15px 20px;
}

/* Form Section Styling */
.form-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.form-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #495057;
}

.section-header i {
  font-size: 20px;
  margin-right: 8px;
  color: var(--bs-primary);
}

.section-header h6 {
  margin: 0;
  font-weight: 600;
}

/* Required Field Indicator */
.form-label.required::after {
  content: ' *';
  color: #dc3545;
}

/* Ant Design Select in Modal */
:deep(.ant-select-dropdown) {
  z-index: 1060 !important; /* Higher than modal */
}
</style>
```

---

## 🔧 Common Patterns

### 1. Custom Radio/Checkbox Selectors

Pattern used in `transportation-selector.vue`, `accommodation-selector.vue`

```vue
<template>
  <div class="selector-group">
    <h6 class="selector-title">{{ title }}</h6>
    <div class="selector-options">
      <div v-for="option in options" :key="option.value" 
           class="selector-option" :class="{ 'active': modelValue === option.value }"
           @click="selectOption(option.value)">
        <div class="option-icon">
          <i :class="option.icon"></i>
        </div>
        <div class="option-label">{{ option.label }}</div>
      </div>
      
      <!-- Other Option with Input -->
      <div class="selector-option other-option" 
           :class="{ 'active': modelValue === 'other' }">
        <div class="option-icon" @click="selectOption('other')">
          <i class="ti ti-dots"></i>
        </div>
        <div class="option-input">
          <input 
            type="text" 
            class="form-control form-control-sm" 
            placeholder="Other (specify)"
            v-model="otherText"
            @focus="selectOption('other')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
    title: String,
    options: Array,
  },
  
  data() {
    return {
      otherText: '',
    };
  },
  
  methods: {
    selectOption(value) {
      this.$emit('update:modelValue', value);
      if (value === 'other') {
        this.$emit('update:otherText', this.otherText);
      }
    },
  },
};
</script>

<style scoped>
.selector-option {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.selector-option.active {
  border-color: var(--bs-primary);
  background-color: rgba(var(--bs-primary-rgb), 0.05);
}
</style>
```

### 2. Statistics Cards with Badges

```vue
<template>
  <div class="col-lg-3 col-md-6 d-flex">
    <div class="card flex-fill statistics-card">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center overflow-hidden">
          <div>
            <span class="avatar avatar-lg bg-primary rounded-circle">
              <i :class="icon"></i>
            </span>
          </div>
          <div class="ms-2 overflow-hidden">
            <p class="fs-12 fw-medium mb-1 text-truncate">{{ label }}</p>
            <h4>{{ value }}</h4>
          </div>
        </div>
        <div>
          <span :class="`badge badge-soft-${badgeColor} badge-sm fw-normal`">
            <i class="ti ti-arrow-wave-right-down"></i>
            {{ percentage }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 3. Action Icons in Table

```vue
<template #bodyCell="{ column, record }">
  <template v-if="column.key === 'action'">
    <div class="action-icon d-inline-flex">
      <!-- View -->
      <a href="javascript:void(0);" @click="viewItem(record)" class="me-2"
         data-bs-toggle="tooltip" title="View">
        <i class="ti ti-eye"></i>
      </a>
      <!-- Edit -->
      <a href="javascript:void(0);" @click="editItem(record)" class="me-2"
         data-bs-toggle="tooltip" title="Edit">
        <i class="ti ti-edit"></i>
      </a>
      <!-- Delete -->
      <a href="javascript:void(0);" @click="deleteItem(record)"
         data-bs-toggle="tooltip" title="Delete">
        <i class="ti ti-trash"></i>
      </a>
    </div>
  </template>
</template>

<style scoped>
.action-icon a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: #6c757d;
  transition: all 0.3s ease;
}

.action-icon a:hover {
  background-color: #f8f9fa;
  color: var(--bs-primary);
}
</style>
```

---

## 📦 Import Strategies

### ✅ CORRECT: Selective Imports

```javascript
// main.js - Global imports
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import 'ant-design-vue/dist/reset.css';

// Component-specific imports
import { Modal as BootstrapModal } from 'bootstrap';
import { message } from 'ant-design-vue';
```

### ❌ INCORRECT: Full Bundle Imports

```javascript
// ❌ BAD - Causes global conflicts
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

// ❌ BAD - Imports everything
import * as bootstrap from 'bootstrap';

// ❌ BAD - Multiple full imports
import Bootstrap from 'bootstrap';
import AntDesign from 'ant-design-vue';
```

### Import Checklist

- [ ] ✅ Bootstrap CSS imported once in `main.js`
- [ ] ✅ Ant Design CSS imported once in `main.js`
- [ ] ✅ Component-specific JS imports are selective
- [ ] ✅ No full bundle imports in component files
- [ ] ✅ z-index hierarchy configured
- [ ] ✅ Scoped styles used for custom CSS

---

## 🔥 Conflict Resolution

### Common Conflicts & Solutions

#### 1. **Dropdown Z-Index Issues**

**Problem**: Ant Design dropdowns appear behind Bootstrap modals

**Solution**:
```css
:deep(.ant-select-dropdown) {
  z-index: 9999 !important;
}

:deep(.ant-dropdown) {
  z-index: 9999 !important;
}
```

#### 2. **ResizeObserver Error**

**Problem**: "ResizeObserver loop completed with undelivered notifications"

**Solution** (Already implemented in `main.js`):
```javascript
// Suppress benign ResizeObserver errors
const resizeObserverLoopErr = /^ResizeObserver loop/;
window.addEventListener('error', (e) => {
  if (resizeObserverLoopErr.test(e.message)) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});
```

#### 3. **Modal Event Conflicts**

**Problem**: Bootstrap modals stop working after navigation

**Solution**:
```javascript
// ❌ BAD
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

// ✅ GOOD
import { Modal as BootstrapModal } from 'bootstrap';

// Use it
const modal = new BootstrapModal(document.getElementById('myModal'));
modal.show();
```

#### 4. **Table Column Overflow**

**Problem**: Table columns overflow container

**Solution**:
```vue
<a-table 
  :scroll="{ x: 1000, y: 'max-content' }"
  :pagination="false"
>
</a-table>

<style scoped>
.resize-observer-fix {
  overflow: visible;
  position: relative;
}
</style>
```

#### 5. **Form Control Styling Conflicts**

**Problem**: Ant Design form controls look inconsistent with Bootstrap

**Solution**:
```css
/* Match Ant Design inputs to Bootstrap */
:deep(.ant-input) {
  border-radius: 0.375rem;
  border-color: #dee2e6;
}

:deep(.ant-input:focus) {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}
```

---

## ✨ Best Practices

### 1. Component Organization

```
component.vue
├── Template (Bootstrap structure)
│   ├── Layout (Bootstrap grid)
│   ├── Cards (Bootstrap cards)
│   └── Data Components (Ant Design)
├── Script (Vue 3 Composition API)
│   ├── Imports (Selective)
│   ├── Reactive Data
│   └── Methods
└── Styles (Scoped CSS)
    ├── Bootstrap overrides
    └── Ant Design adjustments
```

### 2. CSS Specificity

```css
/* Level 1: Bootstrap base */
.card { ... }

/* Level 2: Custom Bootstrap */
.statistics-card { ... }

/* Level 3: Ant Design overrides */
:deep(.ant-table) { ... }

/* Level 4: Component-specific */
.my-custom-class { ... }
```

### 3. State Management

```javascript
// Use Bootstrap for UI state
const modalInstance = ref(null);

// Use Ant Design for data state
const tableLoading = ref(false);
const selectedRowKeys = ref([]);

// Use Pinia store for global state
const store = useEmployeeStore();
```

### 4. Performance Optimization

```javascript
// ✅ Lazy load heavy components
const HeavyModal = defineAsyncComponent(() => 
  import('@/components/modal/heavy-modal.vue')
);

// ✅ Debounce search
const debouncedSearch = debounce(() => {
  handleSearch();
}, 500);

// ✅ Virtual scrolling for large tables
<a-table :virtual="true" :scroll="{ y: 600 }">
```

---

## 🎓 Real-World Examples

### Example 1: Employee List Page

**File**: `src/views/pages/hrm/employees/employees-list.vue`

**Key Features**:
- ✅ Bootstrap grid layout and cards
- ✅ Bootstrap statistics cards with badges
- ✅ Ant Design table with sorting/filtering
- ✅ Ant Design pagination
- ✅ Ant Design search input
- ✅ Bootstrap buttons and modals
- ✅ Selective Bootstrap Modal import

**Pattern Used**: Hybrid List Pattern

---

### Example 2: Travel Request Page

**File**: `src/views/pages/requests/travel/travel-admin.vue`

**Key Features**:
- ✅ Bootstrap statistics cards
- ✅ Ant Design table with custom cell rendering
- ✅ Bootstrap badges in table cells
- ✅ Ant Design dropdown filters
- ✅ Custom radio selectors (transportation/accommodation)
- ✅ Bootstrap modal for add/edit

**Pattern Used**: Advanced Hybrid Pattern with Custom Components

---

### Example 3: Grant Position List

**File**: `src/views/pages/grant/grant-position-list.vue`

**Key Features**:
- ✅ Bootstrap card layout
- ✅ Ant Design table with filters
- ✅ Ant Design buttons for operations
- ✅ Bootstrap loading spinner
- ✅ Optimized for performance (no unused imports)

**Pattern Used**: Simplified List Pattern

---

## 📚 Quick Reference

### When to Use What

| Scenario | Framework | Component |
|----------|-----------|-----------|
| Page layout | Bootstrap | Grid system (`row`, `col-*`) |
| Data table | Ant Design | `<a-table>` |
| Form inputs | Bootstrap | `.form-control`, `.form-select` |
| Complex dropdown | Ant Design | `<a-select>` |
| Modal dialog | Bootstrap | Bootstrap Modal |
| Pagination | Ant Design | `<a-pagination>` |
| Buttons | Bootstrap | `.btn`, `.btn-*` |
| Search input | Ant Design | `<a-input-search>` |
| Badges/Tags | Bootstrap | `.badge`, `.badge-*` |
| Loading state | Bootstrap | `.spinner-border` |
| Statistics cards | Bootstrap | Custom `.card` |
| Date picker | Ant Design | `<a-date-picker>` |
| Alerts | Bootstrap | `.alert`, `.alert-*` |

### Import Patterns

```javascript
// ✅ Bootstrap Selective Import
import { Modal, Tooltip, Collapse } from 'bootstrap';

// ✅ Ant Design Selective Import
import { message, Modal as AntModal } from 'ant-design-vue';

// ✅ Component Registration
import { Table, Pagination, Select } from 'ant-design-vue';
app.use(Table);
app.use(Pagination);
app.use(Select);
```

### Z-Index Hierarchy

```
Modal Backdrop:  1050
Modal:          1055
Dropdown:       9999
Tooltip:        10000
```

---

## 🚀 Migration Guide

### Converting Existing Components

#### Step 1: Identify Framework Usage

```
Current Component Analysis:
├── Layout: Bootstrap ✅
├── Forms: Bootstrap ✅
├── Table: HTML table ❌ → Migrate to Ant Design
└── Pagination: Custom ❌ → Migrate to Ant Design
```

#### Step 2: Update Imports

```diff
- import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
+ import { Modal as BootstrapModal } from 'bootstrap';
```

#### Step 3: Refactor Table

```diff
- <table class="table">
-   <thead>...</thead>
-   <tbody>...</tbody>
- </table>
+ <a-table 
+   :columns="columns" 
+   :data-source="data"
+   :pagination="false"
+ >
+ </a-table>
```

#### Step 4: Add Pagination

```diff
+ <a-pagination 
+   v-model:current="currentPage"
+   :total="total"
+   @change="handlePageChange"
+ />
```

---

## 🎨 Styling Architecture Integration

### Using the Color System

Refer to the [Styling Architecture Documentation](./STYLING_ARCHITECTURE_DOCUMENTATION.md) for the complete color palette:

```scss
// Primary brand colors
$primary: #011b44;      // NetSuite blue
$primary-900: #1A3966;  // Used for buttons
$success: #03C95A;
$danger: #E70D0D;
$warning: #FFC107;

// Use color scales (100-900)
$primary-100: #E6E9EE;  // Light backgrounds
$primary-900: #1A3966;  // Dark backgrounds/text

// Transparent variants
$success-transparent: #E8FAF0;
$danger-transparent: #FAE7E7;
```

### Typography Standards

```scss
// Font sizes (documented in Styling Architecture)
$font-size-12: 12px;  // Small text
$font-size-14: 14px;  // Body text (base)
$font-size-16: 16px;  // Subheadings
$font-size-18: 18px;  // Card titles
$font-size-24: 24px;  // Page headings

// Font weights
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Common Component Patterns

All component patterns are documented with full code examples in the [Styling Architecture Documentation](./STYLING_ARCHITECTURE_DOCUMENTATION.md):

1. **Statistics Cards** - Section: Component Styling Guide
2. **Form Sections** - Section: Component Styling Guide > Forms
3. **Action Icons** - Section: Component Styling Guide > Tables
4. **Modal Structure** - Section: Best Practices
5. **Button Variants** - Section: Component Styling Guide > Buttons

### Responsive Design

Use documented responsive mixins:

```scss
@include respond-above(lg) {
  // Desktop styles
}

@include respond-below(md) {
  // Mobile styles
}
```

### Z-Index Management

Follow the documented z-index hierarchy:

```scss
// From Styling Architecture Documentation
Modal Backdrop:  1050
Modal:          1055
Dropdown:       9999
Tooltip:        10000
```

---

## 📖 Related Documentation

- **[Styling Architecture Documentation](./STYLING_ARCHITECTURE_DOCUMENTATION.md)** - Complete guide to SCSS architecture, color system, typography, and component styling
- [Ant Design Dropdown Guide](./components/ant-design-dropdown-guide.md)
- [Bootstrap Dropdown Fix](./BOOTSTRAP_DROPDOWN_FIX.md)
- [HRMS Frontend Architecture](./HRMS_FRONTEND_ARCHITECTURE.md)
- [Travel Request Styling Update](./TRAVEL_REQUEST_STYLING_UPDATE_DOCUMENTATION.md)

---

## 🤝 Contributing

When adding new pages or components:

1. ✅ Follow the hybrid pattern guidelines
2. ✅ Use selective imports
3. ✅ Add proper z-index handling
4. ✅ Include scoped styles
5. ✅ Document any new patterns
6. ✅ Test for conflicts

---

## 📝 Changelog

### Version 1.0 (2025-09-30)
- Initial comprehensive hybrid implementation guide
- Documented patterns from employees-list, travel-admin, and grant-position pages
- Added import strategies and conflict resolution
- Included real-world examples and best practices

---

**Document Version**: 1.0  
**Last Updated**: 2025-09-30  
**Author**: HRMS Development Team  
**Status**: ✅ Active Reference

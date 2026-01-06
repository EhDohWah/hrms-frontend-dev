# HRMS CRUD Feature Implementation Template

**Version:** 1.0  
**Last Updated:** October 2, 2025  
**Status:** ✅ Production-Ready Template

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Variable Placeholders Reference](#variable-placeholders-reference)
3. [Implementation Steps](#implementation-steps)
4. [Code Templates](#code-templates)
   - [API Configuration](#1-api-configuration-template)
   - [Service Layer](#2-service-layer-template)
   - [Pinia Store](#3-pinia-store-template)
   - [List Page Component](#4-list-page-component-template)
   - [Modal Component](#5-modal-component-template)
   - [Router Configuration](#6-router-configuration-template)
   - [Sidebar Configuration](#7-sidebar-configuration-template)
   - [Role Menu Configuration](#8-role-menu-configuration-template)
5. [Complete Example: Employee Promotion](#complete-example-employee-promotion)
6. [Customization Guide](#customization-guide)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This template provides a complete, production-ready foundation for implementing any CRUD feature in the HRMS system. It follows the established hybrid Bootstrap 5 + Ant Design Vue 4 architecture and includes all necessary files, configurations, and patterns.

### What's Included

- ✅ Complete code templates with proper styling
- ✅ Bootstrap 5 + Ant Design Vue 4 hybrid pattern
- ✅ Pinia store integration
- ✅ Server-side pagination, sorting, and filtering
- ✅ Form validation and error handling
- ✅ Role-based access control
- ✅ Statistics cards and action icons
- ✅ Modal with tabs and form sections
- ✅ All z-index fixes and ResizeObserver fixes pre-included

### Prerequisites

- Basic knowledge of Vue 3 Composition API
- Understanding of Pinia state management
- Familiarity with REST API patterns
- Access to backend API documentation

---

## 🔤 Variable Placeholders Reference

Use these placeholders throughout the template. Replace them using find-and-replace in your editor.

### Naming Conventions

| Placeholder | Format | Example | Usage |
|------------|--------|---------|-------|
| `{{FEATURE_NAME}}` | Title Case with spaces | `Employee Promotion` | Display names, titles |
| `{{FEATURE_NAME_LOWER}}` | lowercase with spaces | `employee promotion` | Descriptions, messages |
| `{{FEATURE_NAME_CAMEL}}` | camelCase | `employeePromotion` | JavaScript variables, function names |
| `{{FEATURE_NAME_PASCAL}}` | PascalCase | `EmployeePromotion` | Component names, class names |
| `{{FEATURE_NAME_SNAKE}}` | snake_case | `employee_promotion` | API endpoints, database fields |
| `{{FEATURE_NAME_KEBAB}}` | kebab-case | `employee-promotion` | Routes, file names, HTML attributes |
| `{{FEATURE_NAME_PLURAL}}` | Plural form | `Employee Promotions` | Lists, collections |
| `{{FEATURE_NAME_PLURAL_LOWER}}` | Plural lowercase | `employee promotions` | Messages |
| `{{FEATURE_NAME_PLURAL_CAMEL}}` | Plural camelCase | `employeePromotions` | Array variables |
| `{{FEATURE_NAME_PLURAL_SNAKE}}` | Plural snake_case | `employee_promotions` | API endpoints |
| `{{FEATURE_NAME_PLURAL_KEBAB}}` | Plural kebab-case | `employee-promotions` | Routes |

### Feature-Specific Placeholders

| Placeholder | Description | Example |
|------------|-------------|---------|
| `{{MENU_SECTION}}` | Parent menu section | `HRM`, `Requests`, `Grants` |
| `{{ALLOWED_ROLES}}` | Comma-separated roles | `'hr-manager', 'hr-assistant-senior', 'admin'` |
| `{{ROUTE_PATH}}` | Base route path | `/hrm/{{FEATURE_NAME_KEBAB}}` |
| `{{ICON_NAME}}` | Tabler icon name | `ti-award`, `ti-users`, `ti-file-description` |
| `{{PRIMARY_KEY}}` | Primary identifier field | `id`, `code`, `employee_id` |

### Table & Form Placeholders

These will be replaced with actual column/field definitions:

- `{{TABLE_COLUMNS}}` - Array of table column definitions
- `{{FORM_FIELDS}}` - Form field definitions
- `{{VALIDATION_RULES}}` - Validation rules object
- `{{STATISTICS_CARDS}}` - Statistics card definitions

---

## 📝 Implementation Steps

Follow these steps in order to implement a new CRUD feature:

### Step 1: Planning (5-10 minutes)

1. ✅ Define feature name and all placeholder values
2. ✅ List required table columns and form fields
3. ✅ Identify required API endpoints
4. ✅ Determine which roles should have access
5. ✅ Sketch out statistics cards (if needed)

### Step 2: Backend Coordination (if needed)

1. ✅ Confirm API endpoint structure with backend team
2. ✅ Verify request/response payload formats
3. ✅ Confirm validation rules
4. ✅ Verify pagination parameters

### Step 3: Frontend Implementation (30-45 minutes)

1. ✅ Create API configuration (`api.config.js`)
2. ✅ Create service file (`src/services/{{FEATURE_NAME_CAMEL}}.service.js`)
3. ✅ Create Pinia store (`src/stores/{{FEATURE_NAME_CAMEL}}Store.js`)
4. ✅ Create list page component (`src/views/pages/.../{{FEATURE_NAME_KEBAB}}-list.vue`)
5. ✅ Create modal component (`src/components/modal/{{FEATURE_NAME_KEBAB}}-modal.vue`)
6. ✅ Configure router (`src/router/index.js`)
7. ✅ Update sidebar (`src/assets/json/sidebar-data.json`)
8. ✅ Configure role access (`src/config/role-menu.config.js`)

### Step 4: Testing (15-20 minutes)

1. ✅ Test Create functionality
2. ✅ Test Read/List with pagination
3. ✅ Test Update functionality
4. ✅ Test Delete functionality
5. ✅ Test filtering and sorting
6. ✅ Test role-based access
7. ✅ Test responsive design

### Step 5: Documentation (5 minutes)

1. ✅ Update any relevant documentation
2. ✅ Add JSDoc comments to complex functions
3. ✅ Note any custom business logic

---

## 💾 Code Templates

### 1. API Configuration Template

**File:** `src/config/api.config.js`

Add to the `API_ENDPOINTS` object:

```javascript
    // {{FEATURE_NAME}} endpoints
    {{FEATURE_NAME_SNAKE_UPPER}}: {
        LIST: '/{{FEATURE_NAME_PLURAL_KEBAB}}',
        CREATE: '/{{FEATURE_NAME_PLURAL_KEBAB}}',
        SHOW: '/{{FEATURE_NAME_PLURAL_KEBAB}}/:id',
        UPDATE: '/{{FEATURE_NAME_PLURAL_KEBAB}}/:id',
        DELETE: '/{{FEATURE_NAME_PLURAL_KEBAB}}/:id',
        DELETE_SELECTED: '/{{FEATURE_NAME_PLURAL_KEBAB}}/delete-selected',
        SEARCH_BY_EMPLOYEE: '/{{FEATURE_NAME_PLURAL_KEBAB}}/search/employee/:staffId', // Optional
        OPTIONS: '/{{FEATURE_NAME_PLURAL_KEBAB}}/options' // Optional: for dropdown data
    },
```

**Example for Employee Promotion:**

```javascript
    // Employee Promotion endpoints
    EMPLOYEE_PROMOTION: {
        LIST: '/employee-promotions',
        CREATE: '/employee-promotions',
        SHOW: '/employee-promotions/:id',
        UPDATE: '/employee-promotions/:id',
        DELETE: '/employee-promotions/:id',
        DELETE_SELECTED: '/employee-promotions/delete-selected',
        SEARCH_BY_EMPLOYEE: '/employee-promotions/search/employee/:staffId'
    },
```

---

### 2. Service Layer Template

**File:** `src/services/{{FEATURE_NAME_CAMEL}}.service.js`

```javascript
import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BaseService } from './base.service';

class {{FEATURE_NAME_PASCAL}}Service extends BaseService {
    /**
     * Get all {{FEATURE_NAME_PLURAL_LOWER}} with pagination and filtering
     * @param {Object} params - Query parameters (page, per_page, sort_by, sort_order, filters)
     * @returns {Promise<Object>} API response
     */
    async get{{FEATURE_NAME_PLURAL_PASCAL}}(params = {}) {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const endpoint = `${API_ENDPOINTS.{{FEATURE_NAME_SNAKE_UPPER}}.LIST}?${queryParams.toString()}`;
            const response = await apiService.get(endpoint);
            return response;
        } catch (error) {
            console.error('Error fetching {{FEATURE_NAME_PLURAL_LOWER}}:', error);
            throw error;
        }
    }

    /**
     * Search {{FEATURE_NAME_PLURAL_LOWER}} by employee staff ID (Optional)
     * @param {string} staffId - Employee staff ID
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} API response
     */
    async search{{FEATURE_NAME_PLURAL_PASCAL}}ByEmployee(staffId, params = {}) {
        const endpoint = API_ENDPOINTS.{{FEATURE_NAME_SNAKE_UPPER}}.SEARCH_BY_EMPLOYEE.replace(':staffId', staffId);

        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });

            const fullEndpoint = `${endpoint}?${queryParams.toString()}`;
            return await apiService.get(fullEndpoint);
        } catch (error) {
            // Handle 404 gracefully
            if (error.response && error.response.status === 404 && error.response.data) {
                return error.response.data;
            }
            throw error;
        }
    }

    /**
     * Get single {{FEATURE_NAME_LOWER}} by ID
     * @param {number} id - {{FEATURE_NAME}} ID
     * @returns {Promise<Object>} API response
     */
    async get{{FEATURE_NAME_PASCAL}}(id) {
        const endpoint = API_ENDPOINTS.{{FEATURE_NAME_SNAKE_UPPER}}.SHOW.replace(':id', id);
        return await apiService.get(endpoint);
    }

    /**
     * Create new {{FEATURE_NAME_LOWER}}
     * @param {Object} data - {{FEATURE_NAME}} data
     * @returns {Promise<Object>} API response
     */
    async create{{FEATURE_NAME_PASCAL}}(data) {
        const formattedData = this.format{{FEATURE_NAME_PASCAL}}Data(data);
        return await apiService.post(API_ENDPOINTS.{{FEATURE_NAME_SNAKE_UPPER}}.CREATE, formattedData);
    }

    /**
     * Update existing {{FEATURE_NAME_LOWER}}
     * @param {number} id - {{FEATURE_NAME}} ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} API response
     */
    async update{{FEATURE_NAME_PASCAL}}(id, data) {
        const endpoint = API_ENDPOINTS.{{FEATURE_NAME_SNAKE_UPPER}}.UPDATE.replace(':id', id);
        const formattedData = this.format{{FEATURE_NAME_PASCAL}}Data(data);
        return await apiService.put(endpoint, formattedData);
    }

    /**
     * Delete {{FEATURE_NAME_LOWER}}
     * @param {number} id - {{FEATURE_NAME}} ID
     * @returns {Promise<Object>} API response
     */
    async delete{{FEATURE_NAME_PASCAL}}(id) {
        const endpoint = API_ENDPOINTS.{{FEATURE_NAME_SNAKE_UPPER}}.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    /**
     * Delete selected {{FEATURE_NAME_PLURAL_LOWER}}
     * @param {number[]} ids - Array of {{FEATURE_NAME_LOWER}} IDs
     * @returns {Promise<Object>} API response
     */
    async deleteSelected{{FEATURE_NAME_PLURAL_PASCAL}}(ids) {
        return apiService.delete(
            API_ENDPOINTS.{{FEATURE_NAME_SNAKE_UPPER}}.DELETE_SELECTED,
            { ids }
        );
    }

    /**
     * Get dropdown options (Optional)
     * @returns {Promise<Object>} API response with options
     */
    async getOptions() {
        return await this.handleApiResponse(
            () => apiService.get(API_ENDPOINTS.{{FEATURE_NAME_SNAKE_UPPER}}.OPTIONS),
            'fetch {{FEATURE_NAME_LOWER}} options'
        );
    }

    /**
     * Format {{FEATURE_NAME_LOWER}} data for API submission
     * @param {Object} data - Raw form data
     * @returns {Object} Formatted data
     */
    format{{FEATURE_NAME_PASCAL}}Data(data) {
        // TODO: Customize based on your fields
        const formattedData = {
            employee_id: data.employee_id ? parseInt(data.employee_id) : null,
            // Add your fields here
            name: data.name || null,
            description: data.description || null,
            status: data.status || null,
            effective_date: data.effective_date || null,
            remarks: data.remarks || null,
            created_by: data.created_by || null,
            updated_by: data.updated_by || null
        };

        return formattedData;
    }

    /**
     * Validate {{FEATURE_NAME_LOWER}} form data
     * @param {Object} data - Form data to validate
     * @returns {Object} Validation result
     */
    validate{{FEATURE_NAME_PASCAL}}Data(data) {
        const errors = {};

        // TODO: Add your validation rules
        // Required fields
        if (!data.employee_id) {
            errors.employee_id = 'Employee is required';
        }

        if (!data.name || data.name.trim() === '') {
            errors.name = 'Name is required';
        }

        // Date validation example
        if (data.effective_date) {
            const effectiveDate = new Date(data.effective_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (effectiveDate < today) {
                errors.effective_date = 'Effective date cannot be in the past';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export const {{FEATURE_NAME_CAMEL}}Service = new {{FEATURE_NAME_PASCAL}}Service();
```

---

### 3. Pinia Store Template

**File:** `src/stores/{{FEATURE_NAME_CAMEL}}Store.js`

```javascript
import { defineStore } from 'pinia';
import { {{FEATURE_NAME_CAMEL}}Service } from '@/services/{{FEATURE_NAME_CAMEL}}.service';

export const use{{FEATURE_NAME_PASCAL}}Store = defineStore('{{FEATURE_NAME_CAMEL}}', {
    state: () => ({
        // Data state
        {{FEATURE_NAME_PLURAL_CAMEL}}: [],
        current{{FEATURE_NAME_PASCAL}}: null,
        statistics: {
            total: 0,
            active: 0,
            pending: 0,
            completed: 0
        },

        // UI state
        loading: false,
        submitting: false,
        searchLoading: false,
        error: null,

        // Pagination state
        currentPage: 1,
        pageSize: 10,
        total: 0,

        // Filter and sorting state
        filteredInfo: {},
        sortedInfo: {},
        searchValue: ''
    }),

    getters: {
        /**
         * Get {{FEATURE_NAME_LOWER}} by ID
         */
        get{{FEATURE_NAME_PASCAL}}ById: (state) => (id) => {
            return state.{{FEATURE_NAME_PLURAL_CAMEL}}.find(item => item.id === parseInt(id));
        },

        /**
         * Get filtered {{FEATURE_NAME_PLURAL_LOWER}}
         */
        filtered{{FEATURE_NAME_PLURAL_PASCAL}}: (state) => {
            return state.{{FEATURE_NAME_PLURAL_CAMEL}};
        }
    },

    actions: {
        /**
         * Build API parameters for requests
         */
        buildApiParams(baseParams = {}) {
            const params = {
                page: this.currentPage,
                per_page: this.pageSize,
                ...baseParams
            };

            // Add sorting parameters
            if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
                const sortField = this.mapSortField(this.sortedInfo.field);
                params.sort_by = sortField;
                params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
            }

            // Add filter parameters
            if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
                // TODO: Map your filter fields
                if (this.filteredInfo.status && this.filteredInfo.status.length > 0) {
                    params.filter_status = this.filteredInfo.status.join(',');
                }
            }

            return params;
        },

        /**
         * Map frontend field names to backend field names
         */
        mapSortField(field) {
            const fieldMapping = {
                'name': 'name',
                'employee': 'employee_id',
                'status': 'status',
                'created_at': 'created_at'
                // TODO: Add your field mappings
            };
            return fieldMapping[field] || field;
        },

        /**
         * Fetch {{FEATURE_NAME_PLURAL_LOWER}} with pagination and filtering
         */
        async fetch{{FEATURE_NAME_PLURAL_PASCAL}}(params = {}) {
            this.loading = true;
            this.error = null;

            try {
                const queryParams = {
                    page: params.page || this.currentPage || 1,
                    per_page: params.per_page || this.pageSize,
                    ...params
                };

                const response = await {{FEATURE_NAME_CAMEL}}Service.get{{FEATURE_NAME_PLURAL_PASCAL}}(queryParams);

                if (response.success && response.data) {
                    this.{{FEATURE_NAME_PLURAL_CAMEL}} = this.map{{FEATURE_NAME_PASCAL}}Data(response.data);

                    // Update pagination
                    if (response.pagination) {
                        this.total = response.pagination.total;
                        this.currentPage = response.pagination.current_page;
                        this.pageSize = response.pagination.per_page;
                    } else {
                        this.total = response.data.length;
                        this.currentPage = 1;
                    }

                    // Update statistics
                    if (response.statistics) {
                        this.statistics = {
                            total: response.statistics.total || 0,
                            active: response.statistics.active || 0,
                            pending: response.statistics.pending || 0,
                            completed: response.statistics.completed || 0
                        };
                    } else {
                        this.updateLocalStatistics();
                    }
                } else {
                    this.{{FEATURE_NAME_PLURAL_CAMEL}} = [];
                    this.total = 0;
                    throw new Error(response.message || 'Failed to fetch {{FEATURE_NAME_PLURAL_LOWER}}');
                }
            } catch (error) {
                console.error('Error fetching {{FEATURE_NAME_PLURAL_LOWER}}:', error);
                this.error = error.message;
                this.{{FEATURE_NAME_PLURAL_CAMEL}} = [];
                this.total = 0;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Fetch single {{FEATURE_NAME_LOWER}}
         */
        async fetch{{FEATURE_NAME_PASCAL}}(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await {{FEATURE_NAME_CAMEL}}Service.get{{FEATURE_NAME_PASCAL}}(id);

                if (response.success) {
                    this.current{{FEATURE_NAME_PASCAL}} = response.data;

                    // Update in list if exists
                    const index = this.{{FEATURE_NAME_PLURAL_CAMEL}}.findIndex(item => item.id === parseInt(id));
                    if (index !== -1) {
                        this.{{FEATURE_NAME_PLURAL_CAMEL}}[index] = response.data;
                    }

                    return response.data;
                } else {
                    throw new Error(response.message || 'Failed to fetch {{FEATURE_NAME_LOWER}}');
                }
            } catch (error) {
                this.error = error.message;
                this.current{{FEATURE_NAME_PASCAL}} = null;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * Create new {{FEATURE_NAME_LOWER}}
         */
        async create{{FEATURE_NAME_PASCAL}}(data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await {{FEATURE_NAME_CAMEL}}Service.create{{FEATURE_NAME_PASCAL}}(data);

                if (response.success) {
                    // Add to list if on first page
                    if (this.currentPage === 1) {
                        this.{{FEATURE_NAME_PLURAL_CAMEL}}.unshift(response.data);
                        this.total += 1;
                    }

                    return response.data;
                } else {
                    throw new Error(response.message || 'Failed to create {{FEATURE_NAME_LOWER}}');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Update {{FEATURE_NAME_LOWER}}
         */
        async update{{FEATURE_NAME_PASCAL}}(id, data) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await {{FEATURE_NAME_CAMEL}}Service.update{{FEATURE_NAME_PASCAL}}(id, data);

                if (response.success) {
                    // Update in list
                    const index = this.{{FEATURE_NAME_PLURAL_CAMEL}}.findIndex(item => item.id === parseInt(id));
                    if (index !== -1) {
                        this.{{FEATURE_NAME_PLURAL_CAMEL}}[index] = response.data;
                    }

                    // Update current if same
                    if (this.current{{FEATURE_NAME_PASCAL}}?.id === parseInt(id)) {
                        this.current{{FEATURE_NAME_PASCAL}} = response.data;
                    }

                    return response.data;
                } else {
                    throw new Error(response.message || 'Failed to update {{FEATURE_NAME_LOWER}}');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Delete {{FEATURE_NAME_LOWER}}
         */
        async delete{{FEATURE_NAME_PASCAL}}(id) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await {{FEATURE_NAME_CAMEL}}Service.delete{{FEATURE_NAME_PASCAL}}(id);

                if (response.success) {
                    // Remove from list
                    this.{{FEATURE_NAME_PLURAL_CAMEL}} = this.{{FEATURE_NAME_PLURAL_CAMEL}}.filter(item => item.id !== parseInt(id));
                    this.total -= 1;

                    // Clear current if same
                    if (this.current{{FEATURE_NAME_PASCAL}}?.id === parseInt(id)) {
                        this.current{{FEATURE_NAME_PASCAL}} = null;
                    }

                    return true;
                } else {
                    throw new Error(response.message || 'Failed to delete {{FEATURE_NAME_LOWER}}');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Delete selected {{FEATURE_NAME_PLURAL_LOWER}}
         */
        async deleteSelected{{FEATURE_NAME_PLURAL_PASCAL}}(ids) {
            this.submitting = true;
            this.error = null;

            try {
                const response = await {{FEATURE_NAME_CAMEL}}Service.deleteSelected{{FEATURE_NAME_PLURAL_PASCAL}}(ids);

                if (response.success) {
                    // Remove from list
                    this.{{FEATURE_NAME_PLURAL_CAMEL}} = this.{{FEATURE_NAME_PLURAL_CAMEL}}.filter(item => !ids.includes(item.id));
                    this.total -= ids.length;

                    return true;
                } else {
                    throw new Error(response.message || 'Failed to delete {{FEATURE_NAME_PLURAL_LOWER}}');
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.submitting = false;
            }
        },

        /**
         * Map {{FEATURE_NAME_LOWER}} data from API response
         */
        map{{FEATURE_NAME_PASCAL}}Data(data) {
            return data.map(item => ({
                key: item.id,
                id: item.id,
                // TODO: Map your fields
                name: item.name || 'N/A',
                employee_id: item.employee_id,
                employee: item.employee || null,
                status: item.status || 'pending',
                effective_date: item.effective_date || null,
                remarks: item.remarks || '',
                created_at: item.created_at,
                updated_at: item.updated_at
            }));
        },

        /**
         * Update local statistics
         */
        updateLocalStatistics() {
            this.statistics.total = this.total;
            this.statistics.active = this.{{FEATURE_NAME_PLURAL_CAMEL}}.filter(item => item.status === 'active').length;
            this.statistics.pending = this.{{FEATURE_NAME_PLURAL_CAMEL}}.filter(item => item.status === 'pending').length;
            this.statistics.completed = this.{{FEATURE_NAME_PLURAL_CAMEL}}.filter(item => item.status === 'completed').length;
        },

        /**
         * Clear filters
         */
        clearFilters() {
            this.filteredInfo = {};
            this.currentPage = 1;
        },

        /**
         * Clear all filters and sorting
         */
        clearAll() {
            this.filteredInfo = {};
            this.sortedInfo = {};
            this.searchValue = '';
            this.currentPage = 1;
        },

        /**
         * Update pagination
         */
        updatePagination(pagination) {
            if (pagination.current) this.currentPage = pagination.current;
            if (pagination.pageSize) this.pageSize = pagination.pageSize;
        },

        /**
         * Update sorting info
         */
        updateSorting(sorter) {
            this.sortedInfo = sorter || {};
        },

        /**
         * Clear error state
         */
        clearError() {
            this.error = null;
        }
    }
});
```

---

### 4. List Page Component Template

**File:** `src/views/pages/{{ROUTE_PATH}}/{{FEATURE_NAME_KEBAB}}-list.vue`

```vue
<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="mb-2 me-2">
            <button class="btn btn-primary d-flex align-items-center" @click="openAdd{{FEATURE_NAME_PASCAL}}Modal">
              <i class="ti ti-circle-plus me-2"></i>Add New {{FEATURE_NAME}}
            </button>
          </div>
          <div class="mb-2 me-2">
            <button class="btn btn-danger d-flex align-items-center" @click="confirmDeleteSelected"
              :class="{ 'disabled': selectedRowKeys.length === 0 }">
              <i class="ti ti-trash me-2"></i>Delete Selected
            </button>
          </div>

          <div class="head-icons ms-2">
            <a href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top"
              data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Statistics Cards -->
      <div class="row statistics-row">
        <!-- Total -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-primary rounded-circle">
                    <i class="{{ICON_NAME}}"></i>
                  </span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Total {{FEATURE_NAME_PLURAL}}</p>
                  <h4>{{ statistics.total }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-primary badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  100%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-success rounded-circle">
                    <i class="ti ti-check"></i>
                  </span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Active</p>
                  <h4>{{ statistics.active }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-success badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ getPercentage(statistics.active) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-warning rounded-circle">
                    <i class="ti ti-clock"></i>
                  </span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Pending</p>
                  <h4>{{ statistics.pending }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-warning badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ getPercentage(statistics.pending) }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Completed -->
        <div class="col-lg-3 col-md-6 d-flex">
          <div class="card flex-fill statistics-card">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center overflow-hidden">
                <div>
                  <span class="avatar avatar-lg bg-info rounded-circle">
                    <i class="ti ti-circle-check"></i>
                  </span>
                </div>
                <div class="ms-2 overflow-hidden">
                  <p class="fs-12 fw-medium mb-1 text-truncate">Completed</p>
                  <h4>{{ statistics.completed }}</h4>
                </div>
              </div>
              <div>
                <span class="badge badge-soft-info badge-sm fw-normal">
                  <i class="ti ti-arrow-wave-right-down"></i>
                  {{ getPercentage(statistics.completed) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Statistics Cards -->

      <!-- Data Table Card -->
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <h5>{{FEATURE_NAME_PLURAL}} List</h5>
          <div class="d-flex align-items-center flex-wrap row-gap-2">
            <div class="me-2">
              <a-button class="me-2" @click="clearFilters">Clear filters</a-button>
              <a-button @click="clearAll">Clear filters and sorters</a-button>
            </div>
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

        <div class="card-body">
          <!-- Loading State -->
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading {{FEATURE_NAME_PLURAL_LOWER}}...</p>
          </div>

          <!-- Data Table -->
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
                <!-- Action Column -->
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a href="javascript:void(0);" @click="view{{FEATURE_NAME_PASCAL}}(record)" class="me-2">
                      <i class="ti ti-eye"></i>
                    </a>
                    <a href="javascript:void(0);" @click="edit{{FEATURE_NAME_PASCAL}}(record)" class="me-2">
                      <i class="ti ti-edit"></i>
                    </a>
                    <a href="javascript:void(0);" @click="confirmDelete{{FEATURE_NAME_PASCAL}}(record.id)">
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>

                <!-- Employee Column -->
                <template v-if="column.key === 'employee'">
                  <div v-if="record.employee">
                    <strong>{{ record.employee.first_name_en }} {{ record.employee.last_name_en }}</strong>
                    <br>
                    <small class="text-muted">{{ record.employee.staff_id }}</small>
                  </div>
                  <span v-else class="text-muted">-</span>
                </template>

                <!-- Status Column -->
                <template v-if="column.key === 'status'">
                  <span class="badge" :class="getStatusBadgeClass(record.status)">
                    {{ formatStatus(record.status) }}
                  </span>
                </template>

                <!-- Date Column -->
                <template v-if="column.key === 'effective_date'">
                  {{ formatDate(record.effective_date) }}
                </template>
              </template>
            </a-table>

            <!-- Pagination -->
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

  <!-- Modal Component -->
  <{{FEATURE_NAME_KEBAB}}-modal 
    @{{FEATURE_NAME_KEBAB}}-added="fetch{{FEATURE_NAME_PLURAL_PASCAL}}" 
    @{{FEATURE_NAME_KEBAB}}-updated="fetch{{FEATURE_NAME_PLURAL_PASCAL}}"
    ref="{{FEATURE_NAME_CAMEL}}ModalRef"
  ></{{FEATURE_NAME_KEBAB}}-modal>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import {{FEATURE_NAME_PASCAL}}Modal from '@/components/modal/{{FEATURE_NAME_KEBAB}}-modal.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import { use{{FEATURE_NAME_PASCAL}}Store } from '@/stores/{{FEATURE_NAME_CAMEL}}Store';
import moment from 'moment';
import { Modal } from 'ant-design-vue';

export default {
  name: '{{FEATURE_NAME_PASCAL}}List',
  components: {
    indexBreadcrumb,
    {{FEATURE_NAME_PASCAL}}Modal,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  },
  data() {
    return {
      title: "{{FEATURE_NAME_PLURAL}}",
      text: "{{MENU_SECTION}}",
      text1: "{{FEATURE_NAME_PLURAL}}",
      searchValue: '',

      // Local data properties
      filteredInfo: {},
      sortedInfo: {},
      {{FEATURE_NAME_PLURAL_CAMEL}}: [],
      loading: false,
      searchLoading: false,
      selectedRowKeys: [],

      // Statistics
      statistics: {
        total: 0,
        active: 0,
        pending: 0,
        completed: 0
      },

      // Pagination
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  computed: {
    columns() {
      const filtered = this.filteredInfo || {};
      const sorted = this.sortedInfo || {};

      return [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
          sorter: true,
          sortOrder: sorted.columnKey === 'id' && sorted.order,
        },
        {
          title: 'Employee',
          key: 'employee',
          width: 200,
          sorter: false,
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 200,
          sorter: true,
          sortOrder: sorted.columnKey === 'name' && sorted.order,
        },
        {
          title: 'Status',
          key: 'status',
          width: 120,
          filters: [
            { text: 'Active', value: 'active' },
            { text: 'Pending', value: 'pending' },
            { text: 'Completed', value: 'completed' },
          ],
          filteredValue: filtered.status || null,
        },
        {
          title: 'Effective Date',
          key: 'effective_date',
          width: 150,
          sorter: true,
          sortOrder: sorted.columnKey === 'effective_date' && sorted.order,
        },
        {
          title: 'Actions',
          key: 'action',
          width: 100,
          fixed: 'right',
        },
      ];
    },

    tableData() {
      return this.{{FEATURE_NAME_PLURAL_CAMEL}};
    },

    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedKeys) => {
          this.selectedRowKeys = selectedKeys;
        },
      };
    },
  },
  methods: {
    /**
     * Fetch {{FEATURE_NAME_PLURAL_LOWER}} from API
     */
    async fetch{{FEATURE_NAME_PLURAL_PASCAL}}() {
      this.loading = true;
      try {
        const params = this.buildApiParams();
        const store = use{{FEATURE_NAME_PASCAL}}Store();
        await store.fetch{{FEATURE_NAME_PLURAL_PASCAL}}(params);

        // Update local data from store
        this.{{FEATURE_NAME_PLURAL_CAMEL}} = store.{{FEATURE_NAME_PLURAL_CAMEL}};
        this.total = store.total;
        this.currentPage = store.currentPage;
        this.pageSize = store.pageSize;
        this.statistics = store.statistics;
      } catch (error) {
        this.$message.error(error.message || 'Failed to load {{FEATURE_NAME_PLURAL_LOWER}}');
      } finally {
        this.loading = false;
      }
    },

    /**
     * Build API parameters
     */
    buildApiParams() {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
      };

      // Add sorting
      if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
        params.sort_by = this.sortedInfo.field;
        params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add filters
      if (this.filteredInfo && Object.keys(this.filteredInfo).length > 0) {
        if (this.filteredInfo.status && this.filteredInfo.status.length > 0) {
          params.filter_status = this.filteredInfo.status.join(',');
        }
      }

      return params;
    },

    /**
     * Handle table change (sorting, filtering, pagination)
     */
    handleTableChange(pagination, filters, sorter) {
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      this.fetch{{FEATURE_NAME_PLURAL_PASCAL}}();
    },

    /**
     * Handle pagination change
     */
    handlePaginationChange(page, pageSize) {
      this.currentPage = page;
      this.pageSize = pageSize;
      this.fetch{{FEATURE_NAME_PLURAL_PASCAL}}();
    },

    /**
     * Handle page size change
     */
    handleSizeChange(current, size) {
      this.currentPage = 1;
      this.pageSize = size;
      this.fetch{{FEATURE_NAME_PLURAL_PASCAL}}();
    },

    /**
     * Handle search
     */
    handleSearch() {
      // Implement search logic
      this.currentPage = 1;
      this.fetch{{FEATURE_NAME_PLURAL_PASCAL}}();
    },

    /**
     * Clear filters
     */
    clearFilters() {
      this.filteredInfo = {};
      this.currentPage = 1;
      this.fetch{{FEATURE_NAME_PLURAL_PASCAL}}();
    },

    /**
     * Clear all filters and sorters
     */
    clearAll() {
      this.filteredInfo = {};
      this.sortedInfo = {};
      this.searchValue = '';
      this.currentPage = 1;
      this.fetch{{FEATURE_NAME_PLURAL_PASCAL}}();
    },

    /**
     * Open add modal
     */
    openAdd{{FEATURE_NAME_PASCAL}}Modal() {
      this.$refs.{{FEATURE_NAME_CAMEL}}ModalRef.openAdd{{FEATURE_NAME_PASCAL}}Modal();
    },

    /**
     * View {{FEATURE_NAME_LOWER}}
     */
    view{{FEATURE_NAME_PASCAL}}(record) {
      // Implement view logic or navigate to details page
      this.$router.push(`/{{ROUTE_PATH}}/${record.id}`);
    },

    /**
     * Edit {{FEATURE_NAME_LOWER}}
     */
    edit{{FEATURE_NAME_PASCAL}}(record) {
      this.$refs.{{FEATURE_NAME_CAMEL}}ModalRef.openEdit{{FEATURE_NAME_PASCAL}}Modal(record);
    },

    /**
     * Confirm delete single {{FEATURE_NAME_LOWER}}
     */
    confirmDelete{{FEATURE_NAME_PASCAL}}(id) {
      Modal.confirm({
        title: 'Delete {{FEATURE_NAME}}?',
        content: 'Are you sure you want to delete this {{FEATURE_NAME_LOWER}}? This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          await this.delete{{FEATURE_NAME_PASCAL}}(id);
        },
      });
    },

    /**
     * Delete single {{FEATURE_NAME_LOWER}}
     */
    async delete{{FEATURE_NAME_PASCAL}}(id) {
      try {
        const store = use{{FEATURE_NAME_PASCAL}}Store();
        await store.delete{{FEATURE_NAME_PASCAL}}(id);
        this.$message.success('{{FEATURE_NAME}} deleted successfully');
        await this.fetch{{FEATURE_NAME_PLURAL_PASCAL}}();
      } catch (error) {
        this.$message.error(error.message || 'Failed to delete {{FEATURE_NAME_LOWER}}');
      }
    },

    /**
     * Confirm delete selected
     */
    confirmDeleteSelected() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('Please select {{FEATURE_NAME_PLURAL_LOWER}} to delete');
        return;
      }

      Modal.confirm({
        title: `Delete ${this.selectedRowKeys.length} {{FEATURE_NAME_PLURAL}}?`,
        content: 'Are you sure you want to delete the selected {{FEATURE_NAME_PLURAL_LOWER}}? This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          await this.deleteSelected();
        },
      });
    },

    /**
     * Delete selected {{FEATURE_NAME_PLURAL_LOWER}}
     */
    async deleteSelected() {
      try {
        const store = use{{FEATURE_NAME_PASCAL}}Store();
        await store.deleteSelected{{FEATURE_NAME_PLURAL_PASCAL}}(this.selectedRowKeys);
        this.$message.success(`${this.selectedRowKeys.length} {{FEATURE_NAME_PLURAL_LOWER}} deleted successfully`);
        this.selectedRowKeys = [];
        await this.fetch{{FEATURE_NAME_PLURAL_PASCAL}}();
      } catch (error) {
        this.$message.error(error.message || 'Failed to delete selected {{FEATURE_NAME_PLURAL_LOWER}}');
      }
    },

    /**
     * Toggle header collapse
     */
    toggleHeader() {
      // Implement header collapse logic
    },

    /**
     * Format date
     */
    formatDate(date) {
      return date ? moment(date).format('DD MMM YYYY') : '-';
    },

    /**
     * Format status
     */
    formatStatus(status) {
      const statusMap = {
        'active': 'Active',
        'pending': 'Pending',
        'completed': 'Completed',
      };
      return statusMap[status] || status;
    },

    /**
     * Get status badge class
     */
    getStatusBadgeClass(status) {
      const classMap = {
        'active': 'badge-soft-success',
        'pending': 'badge-soft-warning',
        'completed': 'badge-soft-info',
      };
      return classMap[status] || 'badge-soft-secondary';
    },

    /**
     * Get percentage
     */
    getPercentage(value) {
      if (this.statistics.total === 0) return 0;
      return ((value / this.statistics.total) * 100).toFixed(1);
    },
  },
  mounted() {
    this.fetch{{FEATURE_NAME_PLURAL_PASCAL}}();
  },
};
</script>

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

/* Action Icons */
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

/* Statistics Row */
.statistics-row {
  margin-bottom: 1.5rem;
}
</style>
```

---

### 5. Modal Component Template

**File:** `src/components/modal/{{FEATURE_NAME_KEBAB}}-modal.vue`

```vue
<template>
  <!-- Add/Edit Modal -->
  <div class="modal fade" id="add_{{FEATURE_NAME_SNAKE}}_modal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            {{ isEditMode ? 'Edit {{FEATURE_NAME}}' : 'Add New {{FEATURE_NAME}}' }}
          </h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
          {{ alertMessage }}
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Tabs (Optional) -->
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
                  Additional Details
                </button>
              </li>
            </ul>
          </div>

          <div class="tab-content" id="myTabContent">
            <!-- Basic Information Tab -->
            <div class="tab-pane fade show active" id="basic-info" role="tabpanel">
              <div class="modal-body">
                <!-- Form Section: Basic Information -->
                <div class="form-section">
                  <div class="section-header">
                    <i class="ti ti-info-circle"></i>
                    <h6>Basic Information</h6>
                  </div>
                  
                  <div class="row g-3">
                    <!-- Employee Selection -->
                    <div class="col-md-12">
                      <label class="form-label required">Employee</label>
                      <select v-model="formData.employee_id" class="form-select"
                        :class="{ 'is-invalid': validationErrors.employee_id }" required>
                        <option value="">Select Employee</option>
                        <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                          {{ employee.staff_id }} - {{ employee.name }}
                        </option>
                      </select>
                      <div v-if="validationErrors.employee_id" class="invalid-feedback">
                        {{ validationErrors.employee_id }}
                      </div>
                    </div>

                    <!-- Name Field -->
                    <div class="col-md-6">
                      <label class="form-label required">Name</label>
                      <input type="text" class="form-control" v-model="formData.name"
                        :class="{ 'is-invalid': validationErrors.name }" required>
                      <div v-if="validationErrors.name" class="invalid-feedback">
                        {{ validationErrors.name }}
                      </div>
                    </div>

                    <!-- Status Field -->
                    <div class="col-md-6">
                      <label class="form-label">Status</label>
                      <select v-model="formData.status" class="form-select"
                        :class="{ 'is-invalid': validationErrors.status }">
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                      <div v-if="validationErrors.status" class="invalid-feedback">
                        {{ validationErrors.status }}
                      </div>
                    </div>

                    <!-- Date Field -->
                    <div class="col-md-6">
                      <label class="form-label">Effective Date</label>
                      <div class="input-icon-end position-relative">
                        <date-picker 
                          class="form-control datetimepicker"
                          placeholder="dd/mm/yyyy" 
                          :editable="true" 
                          :clearable="false"
                          :input-format="dateFormat" 
                          v-model="formData.effective_date"
                          :class="{ 'is-invalid': validationErrors.effective_date }" 
                        />
                        <span class="input-icon-addon">
                          <i class="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                      <div v-if="validationErrors.effective_date" class="invalid-feedback">
                        {{ validationErrors.effective_date }}
                      </div>
                    </div>

                    <!-- Description Field -->
                    <div class="col-md-12">
                      <label class="form-label">Description</label>
                      <textarea class="form-control" v-model="formData.description" rows="3"
                        :class="{ 'is-invalid': validationErrors.description }"
                        placeholder="Enter description"></textarea>
                      <div v-if="validationErrors.description" class="invalid-feedback">
                        {{ validationErrors.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" @click="switchToDetailsTab">
                  Next: Additional Details
                </button>
              </div>
            </div>

            <!-- Additional Details Tab -->
            <div class="tab-pane fade" id="details-info" role="tabpanel">
              <div class="modal-body">
                <!-- Form Section: Additional Information -->
                <div class="form-section">
                  <div class="section-header">
                    <i class="ti ti-file-text"></i>
                    <h6>Additional Information</h6>
                  </div>
                  
                  <div class="row g-3">
                    <!-- Remarks Field -->
                    <div class="col-md-12">
                      <label class="form-label">Remarks</label>
                      <textarea class="form-control" v-model="formData.remarks" rows="4"
                        placeholder="Enter any additional remarks"></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-light" @click="switchToBasicTab">
                  Back
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isSubmitting ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal as BootstrapModal } from 'bootstrap';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import { use{{FEATURE_NAME_PASCAL}}Store } from '@/stores/{{FEATURE_NAME_CAMEL}}Store';
import { useSharedDataStore } from '@/stores/sharedDataStore';

export default {
  name: '{{FEATURE_NAME_PASCAL}}Modal',
  components: {
    DatePicker,
  },
  emits: ['{{FEATURE_NAME_KEBAB}}-added', '{{FEATURE_NAME_KEBAB}}-updated'],
  data() {
    return {
      isEditMode: false,
      currentId: null,
      formData: {
        employee_id: '',
        name: '',
        status: 'pending',
        effective_date: null,
        description: '',
        remarks: '',
      },
      validationErrors: {},
      alertMessage: '',
      alertClass: '',
      isSubmitting: false,
      modalInstance: null,
      dateFormat: 'DD/MM/YYYY',

      // Dropdown data
      employees: [],
    };
  },
  methods: {
    /**
     * Open add modal
     */
    openAdd{{FEATURE_NAME_PASCAL}}Modal() {
      this.isEditMode = false;
      this.currentId = null;
      this.resetForm();
      this.loadDropdownData();
      this.openModal();
    },

    /**
     * Open edit modal
     */
    openEdit{{FEATURE_NAME_PASCAL}}Modal(record) {
      this.isEditMode = true;
      this.currentId = record.id;
      this.populateForm(record);
      this.loadDropdownData();
      this.openModal();
    },

    /**
     * Open modal
     */
    openModal() {
      this.modalInstance = new BootstrapModal(document.getElementById('add_{{FEATURE_NAME_SNAKE}}_modal'));
      this.modalInstance.show();
    },

    /**
     * Close modal
     */
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },

    /**
     * Reset form
     */
    resetForm() {
      this.formData = {
        employee_id: '',
        name: '',
        status: 'pending',
        effective_date: null,
        description: '',
        remarks: '',
      };
      this.validationErrors = {};
      this.alertMessage = '';
    },

    /**
     * Populate form with existing data
     */
    populateForm(record) {
      this.formData = {
        employee_id: record.employee_id || '',
        name: record.name || '',
        status: record.status || 'pending',
        effective_date: record.effective_date || null,
        description: record.description || '',
        remarks: record.remarks || '',
      };
      this.validationErrors = {};
      this.alertMessage = '';
    },

    /**
     * Load dropdown data
     */
    async loadDropdownData() {
      const sharedStore = useSharedDataStore();
      await sharedStore.fetchEmployees();
      this.employees = sharedStore.employees;
    },

    /**
     * Switch to details tab
     */
    switchToDetailsTab() {
      const detailsTab = document.getElementById('details-tab');
      if (detailsTab) {
        detailsTab.click();
      }
    },

    /**
     * Switch to basic tab
     */
    switchToBasicTab() {
      const basicTab = document.getElementById('basic-tab');
      if (basicTab) {
        basicTab.click();
      }
    },

    /**
     * Handle form submission
     */
    async handleSubmit() {
      this.validationErrors = {};
      this.alertMessage = '';
      this.isSubmitting = true;

      try {
        const store = use{{FEATURE_NAME_PASCAL}}Store();

        if (this.isEditMode) {
          await store.update{{FEATURE_NAME_PASCAL}}(this.currentId, this.formData);
          this.alertMessage = '{{FEATURE_NAME}} updated successfully!';
          this.$emit('{{FEATURE_NAME_KEBAB}}-updated');
        } else {
          await store.create{{FEATURE_NAME_PASCAL}}(this.formData);
          this.alertMessage = '{{FEATURE_NAME}} created successfully!';
          this.$emit('{{FEATURE_NAME_KEBAB}}-added');
        }

        this.alertClass = 'alert-success';
        
        setTimeout(() => {
          this.closeModal();
          this.resetForm();
        }, 1500);
      } catch (error) {
        if (error.errors) {
          this.validationErrors = error.errors;
          this.alertMessage = 'Please fix the validation errors';
        } else {
          this.alertMessage = error.message || `Failed to ${this.isEditMode ? 'update' : 'create'} {{FEATURE_NAME_LOWER}}`;
        }
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

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
  z-index: 1060 !important;
}

/* Date Picker Styling */
.input-icon-addon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
</style>
```

---

### 6. Router Configuration Template

**File:** `src/router/index.js`

Add to the appropriate parent route:

```javascript
  // {{FEATURE_NAME}} routes
  {
    path: '{{ROUTE_PATH}}',
    component: lazyView('pages/{{ROUTE_PATH}}/{{FEATURE_NAME_KEBAB}}-index'), // Optional: parent wrapper
    beforeEnter: roleGuard([{{ALLOWED_ROLES}}]),
    children: [
      {
        path: '',
        redirect: '{{ROUTE_PATH}}/list'
      },
      {
        path: 'list',
        component: lazyView('pages/{{ROUTE_PATH}}/{{FEATURE_NAME_KEBAB}}-list'),
        meta: { 
          title: '{{FEATURE_NAME_PLURAL}}',
          requiresAuth: true
        }
      },
      {
        path: ':id',
        component: lazyView('pages/{{ROUTE_PATH}}/{{FEATURE_NAME_KEBAB}}-details'), // Optional: details page
        meta: { 
          title: '{{FEATURE_NAME}} Details',
          requiresAuth: true
        }
      }
    ]
  },
```

**Simple Route (without parent wrapper):**

```javascript
  {
    path: '{{ROUTE_PATH}}/{{FEATURE_NAME_PLURAL_KEBAB}}',
    component: lazyView('pages/{{ROUTE_PATH}}/{{FEATURE_NAME_KEBAB}}-list'),
    beforeEnter: roleGuard([{{ALLOWED_ROLES}}]),
    meta: {
      title: '{{FEATURE_NAME_PLURAL}}',
      requiresAuth: true
    }
  },
```

---

### 7. Sidebar Configuration Template

**File:** `src/assets/json/sidebar-data.json`

Add to the appropriate menu section:

```json
{
  "menuValue": "{{FEATURE_NAME_PLURAL}}",
  "route": "{{ROUTE_PATH}}/{{FEATURE_NAME_PLURAL_KEBAB}}",
  "active_link": "{{ROUTE_PATH}}/{{FEATURE_NAME_PLURAL_KEBAB}}"
}
```

**Example in context:**

```json
{
  "tittle": "{{MENU_SECTION}}",
  "showAsTab": false,
  "separateRoute": false,
  "menu": [
    {
      "menuValue": "{{MENU_SECTION}}",
      "hasSubRoute": true,
      "showSubRoute": false,
      "icon": "{{ICON_NAME}}",
      "subMenus": [
        {
          "menuValue": "{{FEATURE_NAME_PLURAL}}",
          "route": "{{ROUTE_PATH}}/{{FEATURE_NAME_PLURAL_KEBAB}}",
          "active_link": "{{ROUTE_PATH}}/{{FEATURE_NAME_PLURAL_KEBAB}}"
        }
      ]
    }
  ]
}
```

---

### 8. Role Menu Configuration Template

**File:** `src/config/role-menu.config.js`

Update for each role that should have access:

```javascript
'hr-manager': {
    allowedMenus: [
        'Dashboard',
        '{{MENU_SECTION}}',
        // ... other menus
    ],
    allowedSubMenus: {
        '{{MENU_SECTION}}': [
            '{{FEATURE_NAME_PLURAL}}',
            // ... other submenus
        ],
    },
    permissions: [
        '{{FEATURE_NAME_SNAKE}}.*',
        // ... other permissions
    ]
},
```

---

## 📚 Complete Example: Employee Promotion

Here's the template fully filled in for an "Employee Promotion" feature:

### Placeholder Values

```
{{FEATURE_NAME}} = Employee Promotion
{{FEATURE_NAME_LOWER}} = employee promotion
{{FEATURE_NAME_CAMEL}} = employeePromotion
{{FEATURE_NAME_PASCAL}} = EmployeePromotion
{{FEATURE_NAME_SNAKE}} = employee_promotion
{{FEATURE_NAME_KEBAB}} = employee-promotion
{{FEATURE_NAME_PLURAL}} = Employee Promotions
{{FEATURE_NAME_PLURAL_CAMEL}} = employeePromotions
{{FEATURE_NAME_PLURAL_SNAKE}} = employee_promotions
{{FEATURE_NAME_PLURAL_KEBAB}} = employee-promotions
{{MENU_SECTION}} = HRM
{{ALLOWED_ROLES}} = 'hr-manager', 'hr-assistant-senior', 'admin'
{{ROUTE_PATH}} = /employee
{{ICON_NAME}} = ti-award
```

### 1. API Configuration (api.config.js)

```javascript
    // Employee Promotion endpoints
    EMPLOYEE_PROMOTION: {
        LIST: '/employee-promotions',
        CREATE: '/employee-promotions',
        SHOW: '/employee-promotions/:id',
        UPDATE: '/employee-promotions/:id',
        DELETE: '/employee-promotions/:id',
        DELETE_SELECTED: '/employee-promotions/delete-selected',
        SEARCH_BY_EMPLOYEE: '/employee-promotions/search/employee/:staffId'
    },
```

### 2. Service File

**File:** `src/services/employeePromotion.service.js`

Create this file using the service template with placeholders replaced.

### 3. Pinia Store

**File:** `src/stores/employeePromotionStore.js`

Create this file using the store template with placeholders replaced.

### 4. List Page

**File:** `src/views/pages/employee/employee-promotion-list.vue`

Create this file using the list page template with placeholders replaced.

### 5. Modal Component

**File:** `src/components/modal/employee-promotion-modal.vue`

Create this file using the modal template with placeholders replaced.

### 6. Router Configuration

In `src/router/index.js`, add under the Employee section:

```javascript
{
  path: '/employee/employee-promotions',
  component: lazyView('pages/employee/employee-promotion-list'),
  beforeEnter: roleGuard(['hr-manager', 'hr-assistant-senior', 'admin']),
  meta: {
    title: 'Employee Promotions',
    requiresAuth: true
  }
},
```

### 7. Sidebar Configuration

In `src/assets/json/sidebar-data.json`, add under Employee subMenus:

```json
{
  "menuValue": "Employee Promotions",
  "route": "/employee/employee-promotions",
  "active_link": "/employee/employee-promotions"
}
```

### 8. Role Menu Configuration

In `src/config/role-menu.config.js`, update roles:

```javascript
'hr-manager': {
    allowedMenus: [
        'Dashboard',
        'Employee',
        // ... other menus
    ],
    allowedSubMenus: {
        'Employee': [
            'Employees',
            'Employment Records',
            'Employee Promotions', // Add this
            // ... other submenus
        ],
    },
    permissions: [
        'employee.*',
        'employee_promotion.*', // Add this
        // ... other permissions
    ]
},
```

---

## 🎨 Customization Guide

### Adding Custom Table Columns

1. **Define column in list page:**

```javascript
columns() {
  return [
    // ... existing columns
    {
      title: 'Your Custom Column',
      dataIndex: 'custom_field',
      key: 'custom_field',
      width: 150,
      sorter: true, // Enable sorting
      filters: [ // Add filters if needed
        { text: 'Option 1', value: 'option1' },
        { text: 'Option 2', value: 'option2' },
      ],
    },
  ];
}
```

2. **Add custom cell rendering:**

```vue
<template #bodyCell="{ column, record }">
  <template v-if="column.key === 'custom_field'">
    <span class="badge badge-soft-primary">{{ record.custom_field }}</span>
  </template>
</template>
```

### Adding Custom Form Fields

1. **Add to formData in modal:**

```javascript
data() {
  return {
    formData: {
      // ... existing fields
      custom_field: '',
      custom_dropdown: '',
    },
  };
}
```

2. **Add form input in modal template:**

```vue
<div class="col-md-6">
  <label class="form-label required">Custom Field</label>
  <input type="text" class="form-control" v-model="formData.custom_field"
    :class="{ 'is-invalid': validationErrors.custom_field }" required>
  <div v-if="validationErrors.custom_field" class="invalid-feedback">
    {{ validationErrors.custom_field }}
  </div>
</div>
```

### Adding Custom Validation

In the service file, update `validate{{FEATURE_NAME_PASCAL}}Data`:

```javascript
validate{{FEATURE_NAME_PASCAL}}Data(data) {
    const errors = {};

    // Custom validation rule
    if (data.custom_field && data.custom_field.length < 3) {
        errors.custom_field = 'Custom field must be at least 3 characters';
    }

    // Custom business logic validation
    if (data.amount && parseFloat(data.amount) > 100000) {
        errors.amount = 'Amount cannot exceed 100,000';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
```

### Adding Custom Statistics Cards

Update the statistics section in the list page:

```vue
<!-- Custom Stat Card -->
<div class="col-lg-3 col-md-6 d-flex">
  <div class="card flex-fill statistics-card">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center overflow-hidden">
        <div>
          <span class="avatar avatar-lg bg-purple rounded-circle">
            <i class="ti ti-custom-icon"></i>
          </span>
        </div>
        <div class="ms-2 overflow-hidden">
          <p class="fs-12 fw-medium mb-1 text-truncate">Custom Metric</p>
          <h4>{{ statistics.custom_count }}</h4>
        </div>
      </div>
      <div>
        <span class="badge badge-soft-purple badge-sm fw-normal">
          <i class="ti ti-arrow-wave-right-up"></i>
          {{ getPercentage(statistics.custom_count) }}%
        </span>
      </div>
    </div>
  </div>
</div>
```

### Adding Search by Employee

If your feature relates to employees, add search functionality:

1. **In list page, add search input:**

```vue
<div class="input-icon-end me-2">
  <a-input-search 
    v-model:value="searchStaffId" 
    placeholder="Enter staff ID..." 
    :loading="searchLoading"
    enter-button="Search" 
    @search="handleStaffIdSearch" 
    style="width: 200px;"
    class="search-input-primary" 
  />
</div>
```

2. **Add search method:**

```javascript
async handleStaffIdSearch() {
  if (!this.searchStaffId || this.searchStaffId.trim() === '') {
    this.$message.warning('Please enter a staff ID');
    return;
  }

  this.searchLoading = true;
  try {
    const store = use{{FEATURE_NAME_PASCAL}}Store();
    // Assuming you added searchByEmployee action to store
    await store.search{{FEATURE_NAME_PLURAL_PASCAL}}ByStaffId(this.searchStaffId);
    
    this.{{FEATURE_NAME_PLURAL_CAMEL}} = store.{{FEATURE_NAME_PLURAL_CAMEL}};
    this.total = store.total;
    
    if (this.{{FEATURE_NAME_PLURAL_CAMEL}}.length === 0) {
      this.$message.info(`No {{FEATURE_NAME_PLURAL_LOWER}} found for staff ID: ${this.searchStaffId}`);
    }
  } catch (error) {
    this.$message.error(error.message || 'Search failed');
  } finally {
    this.searchLoading = false;
  }
},
```

---

## ✅ Testing Checklist

### Functional Testing

- [ ] **Create Operation**
  - [ ] Modal opens correctly
  - [ ] All form fields are visible and functional
  - [ ] Validation works for required fields
  - [ ] Data saves successfully
  - [ ] Success message displays
  - [ ] List refreshes with new item

- [ ] **Read/List Operation**
  - [ ] Data loads on page mount
  - [ ] Pagination works correctly
  - [ ] Page size changes work
  - [ ] Data displays correctly in table
  - [ ] Statistics cards show correct values

- [ ] **Update Operation**
  - [ ] Edit modal opens with existing data
  - [ ] Data pre-populates correctly
  - [ ] Changes save successfully
  - [ ] List updates with new data
  - [ ] Success message displays

- [ ] **Delete Operation**
  - [ ] Single delete confirmation shows
  - [ ] Item deletes successfully
  - [ ] List updates after delete
  - [ ] Bulk delete works for multiple items
  - [ ] Success message displays

- [ ] **Search & Filter**
  - [ ] Search functionality works
  - [ ] Filters apply correctly
  - [ ] "Clear filters" button works
  - [ ] "Clear all" resets everything
  - [ ] Search by employee works (if applicable)

- [ ] **Sorting**
  - [ ] Sortable columns sort correctly
  - [ ] Ascending and descending work
  - [ ] Sorting persists during pagination

### UI/UX Testing

- [ ] **Responsive Design**
  - [ ] Mobile view (< 768px)
  - [ ] Tablet view (768px - 1024px)
  - [ ] Desktop view (> 1024px)
  - [ ] Statistics cards stack properly on mobile

- [ ] **Styling**
  - [ ] Statistics cards hover effect works
  - [ ] Action icons hover effect works
  - [ ] Badges display with correct colors
  - [ ] Modal styling is consistent
  - [ ] No styling conflicts

- [ ] **Loading States**
  - [ ] Loading spinner shows during data fetch
  - [ ] Button loading states work
  - [ ] Search loading indicator works
  - [ ] No flickering during loads

### Access Control Testing

- [ ] **Role-Based Access**
  - [ ] Admin role can access feature
  - [ ] HR Manager can access feature
  - [ ] HR Assistant Senior can access feature (if allowed)
  - [ ] Unauthorized roles are blocked
  - [ ] Menu only shows for allowed roles

- [ ] **Permissions**
  - [ ] Create permission works
  - [ ] Read permission works
  - [ ] Update permission works
  - [ ] Delete permission works

### Error Handling Testing

- [ ] **Validation Errors**
  - [ ] Required field errors display
  - [ ] Custom validation rules work
  - [ ] Error messages are clear
  - [ ] Errors clear after correction

- [ ] **API Errors**
  - [ ] 404 errors handled gracefully
  - [ ] 422 validation errors display
  - [ ] 500 server errors show message
  - [ ] Network errors handled

### Performance Testing

- [ ] **Load Time**
  - [ ] Initial page load < 2 seconds
  - [ ] Data fetch < 1 second
  - [ ] Modal opens instantly
  - [ ] No ResizeObserver errors

- [ ] **Browser Compatibility**
  - [ ] Chrome/Edge (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Modal Not Opening

**Symptoms:** Modal doesn't appear when clicking "Add New" button

**Solutions:**
- Check that modal ID matches in template and script
- Ensure Bootstrap is imported correctly: `import { Modal as BootstrapModal } from 'bootstrap'`
- Check browser console for JavaScript errors
- Verify `ref` is correctly set on modal component

#### 2. Dropdown Menu Behind Modal

**Symptoms:** Ant Design select dropdown appears behind modal overlay

**Solutions:**
```css
/* Add to modal component styles */
:deep(.ant-select-dropdown) {
  z-index: 1060 !important; /* Higher than modal backdrop (1055) */
}
```

#### 3. ResizeObserver Error

**Symptoms:** Console shows "ResizeObserver loop completed with undelivered notifications"

**Solutions:**
- Already handled in `main.js` globally
- If still occurring, wrap table in div with class:
```vue
<div class="resize-observer-fix">
  <a-table ... />
</div>
```

#### 4. Table Not Updating After Create/Update

**Symptoms:** New/updated items don't appear in table

**Solutions:**
- Ensure `@{{FEATURE_NAME_KEBAB}}-added` and `@{{FEATURE_NAME_KEBAB}}-updated` events are emitted
- Check that fetch method is called in event handlers
- Verify Pinia store is updating correctly
- Check that API returns updated data in response

#### 5. Pagination Not Working

**Symptoms:** Clicking pagination doesn't load new data

**Solutions:**
- Verify `handlePaginationChange` method is correctly bound
- Check that `currentPage` and `pageSize` are reactive
- Ensure API call includes pagination parameters
- Verify backend supports pagination

#### 6. Filters Not Applying

**Symptoms:** Filtering doesn't change displayed data

**Solutions:**
- Check `handleTableChange` receives filter object
- Verify `buildApiParams` includes filter parameters
- Ensure backend supports filtering on those fields
- Check `filteredValue` is correctly set on columns

#### 7. Role-Based Access Not Working

**Symptoms:** Unauthorized users can access feature

**Solutions:**
- Verify `roleGuard` is applied to route
- Check `role-menu.config.js` includes correct roles
- Ensure user role is correctly stored in localStorage
- Verify backend also enforces role permissions

#### 8. Validation Errors Not Displaying

**Symptoms:** Form submits even with invalid data

**Solutions:**
- Check `:class="{ 'is-invalid': validationErrors.fieldName }"` on inputs
- Verify validation errors object structure matches
- Ensure validation runs before API call
- Check that API returns validation errors in expected format

#### 9. Statistics Cards Not Updating

**Symptoms:** Statistics show 0 or incorrect values

**Solutions:**
- Check that API returns `statistics` object
- Verify `updateLocalStatistics` method logic
- Ensure statistics update after create/update/delete
- Check that mapping function includes required fields

#### 10. Date Picker Not Working

**Symptoms:** Date picker doesn't open or format is wrong

**Solutions:**
```javascript
// Ensure date picker is imported correctly
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';

// Verify date format
data() {
  return {
    dateFormat: 'DD/MM/YYYY',
  };
}
```

#### 11. Search Not Working

**Symptoms:** Search returns no results or errors

**Solutions:**
- Check backend endpoint supports search parameter
- Verify search parameter name matches backend expectation
- Ensure search value is properly encoded in URL
- Check for typos in search field binding

#### 12. Styling Issues

**Symptoms:** Bootstrap and Ant Design styles conflict

**Solutions:**
- Never import full Bootstrap bundle in components
- Use scoped styles for component-specific CSS
- Use `:deep()` for targeting child components
- Follow z-index hierarchy documented in guides

---

## 📖 Additional Resources

### Related Documentation

- [HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md) - Comprehensive guide to hybrid framework usage
- [STYLING_ARCHITECTURE_DOCUMENTATION.md](./STYLING_ARCHITECTURE_DOCUMENTATION.md) - Complete styling reference
- [ADDING_NEW_FEATURE_GUIDE.md](./ADDING_NEW_FEATURE_GUIDE.md) - Original feature guide

### Quick Links

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Ant Design Vue 4 Documentation](https://antdv.com/docs/vue/introduction)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)

---

## 📝 Template Checklist

Use this checklist when implementing a new feature:

### Preparation
- [ ] Define all placeholder values
- [ ] List required table columns
- [ ] List required form fields
- [ ] Identify required dropdown data
- [ ] Determine role access requirements

### Implementation
- [ ] Create API configuration
- [ ] Create service file
- [ ] Create Pinia store
- [ ] Create list page component
- [ ] Create modal component
- [ ] Update router configuration
- [ ] Update sidebar configuration
- [ ] Update role menu configuration

### Testing
- [ ] Test Create operation
- [ ] Test Read/List operation
- [ ] Test Update operation
- [ ] Test Delete operation
- [ ] Test role-based access
- [ ] Test responsive design
- [ ] Test error handling

### Documentation
- [ ] Add JSDoc comments
- [ ] Document custom business logic
- [ ] Update related documentation

---

## 🎉 Conclusion

This template provides everything you need to implement a complete CRUD feature in the HRMS system. By following the template and replacing placeholders with your feature-specific values, you can create production-ready features in 30-45 minutes.

### Key Benefits

✅ **Time Savings** - Reduce development time from hours to minutes  
✅ **Consistency** - All features follow the same architectural patterns  
✅ **Quality** - Pre-tested patterns ensure reliable functionality  
✅ **Maintainability** - Standardized code is easier to maintain  
✅ **Best Practices** - Incorporates proven patterns and optimizations

### Next Steps

1. Choose your feature name and define placeholder values
2. Copy the templates and replace placeholders
3. Customize fields and business logic as needed
4. Test thoroughly using the checklist
5. Deploy with confidence!

**Happy Coding! 🚀**

---

**Document Version:** 1.0  
**Last Updated:** October 2, 2025  
**Template Author:** HRMS Development Team  
**Status:** ✅ Production-Ready


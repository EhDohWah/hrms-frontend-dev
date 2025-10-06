# HRMS Frontend Documentation

> 📚 Comprehensive documentation for the HRMS Frontend application

## 📖 Documentation Index

### 🎨 Styling & Design System

1. **[STYLING_QUICK_REFERENCE.md](./STYLING_QUICK_REFERENCE.md)** ⭐ START HERE
   - Quick access to colors, typography, buttons, badges, forms, and tables
   - Copy-paste ready code snippets
   - Common layout patterns

2. **[STYLING_ARCHITECTURE_DOCUMENTATION.md](./STYLING_ARCHITECTURE_DOCUMENTATION.md)**
   - Complete SCSS architecture
   - Color system (with 9-step scales)
   - Typography system
   - Component styling guide
   - Performance optimizations

3. **[HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md)**
   - Framework integration patterns
   - When to use Bootstrap vs Ant Design
   - List page implementation
   - Modal implementation
   - Conflict resolution

### 🏗️ Architecture & Patterns

4. **[HRMS_FRONTEND_ARCHITECTURE.md](./HRMS_FRONTEND_ARCHITECTURE.md)**
   - Overall frontend architecture
   - Component structure
   - State management patterns

5. **[Service Layer Architecture](#service-layer-architecture-guide)** (below)
   - BaseService usage
   - CRUD operations
   - Validation patterns
   - Error handling

### 🔧 Component Guides

6. **[components/ant-design-dropdown-guide.md](./components/ant-design-dropdown-guide.md)**
   - Ant Design dropdown implementation
   - Common dropdown patterns

7. **[components/dropdown-quick-reference.md](./components/dropdown-quick-reference.md)**
   - Quick dropdown reference

### 🐛 Bug Fixes & Solutions

8. **[BOOTSTRAP_DROPDOWN_FIX.md](./BOOTSTRAP_DROPDOWN_FIX.md)**
   - Critical Bootstrap dropdown conflict fix
   - Selective import patterns

9. **[LEAVES_ADMIN_*.md](./)**
   - Various leaves admin fixes and optimizations
   - Checkbox functionality
   - Performance optimizations

### 📊 Feature Documentation

10. **Report Components**
    - [EMPLOYEE_PERSONAL_DATA_REPORT_DOCUMENTATION.md](./EMPLOYEE_PERSONAL_DATA_REPORT_DOCUMENTATION.md)
    - [EMPLOYEE_TRAINING_DATA_REPORTS_DOCUMENTATION.md](./EMPLOYEE_TRAINING_DATA_REPORTS_DOCUMENTATION.md)
    - [EMPLOYMENT_DATA_REPORT_DOCUMENTATION.md](./EMPLOYMENT_DATA_REPORT_DOCUMENTATION.md)
    - [PAYROLL_REPORT_DOCUMENTATION.md](./PAYROLL_REPORT_DOCUMENTATION.md)
    - [TRAVEL_REPORT_DOCUMENTATION.md](./TRAVEL_REPORT_DOCUMENTATION.md)
    - [TOTAL_GRANT_REPORT_DOCUMENTATION.md](./TOTAL_GRANT_REPORT_DOCUMENTATION.md)

11. **Other Features**
    - [DYNAMIC_LOOKUP_SYSTEM_GUIDE.md](./DYNAMIC_LOOKUP_SYSTEM_GUIDE.md)
    - [FAMILY_INFORMATION_MODAL_IMPLEMENTATION.md](./FAMILY_INFORMATION_MODAL_IMPLEMENTATION.md)
    - [TRAVEL_REQUEST_FRONTEND_DOCUMENTATION.md](./TRAVEL_REQUEST_FRONTEND_DOCUMENTATION.md) - Complete travel request system guide
    - [TRAVEL_REQUEST_STYLING_UPDATE_DOCUMENTATION.md](./TRAVEL_REQUEST_STYLING_UPDATE_DOCUMENTATION.md)

### 🎯 Implementation Guides

12. **[ADDING_NEW_FEATURE_GUIDE.md](./ADDING_NEW_FEATURE_GUIDE.md)**
    - Step-by-step guide to add new features

13. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**
    - Summary of implementations

---

## 🚀 Quick Start

### For New Developers

1. **Understand the Design System**
   - Start with [STYLING_QUICK_REFERENCE.md](./STYLING_QUICK_REFERENCE.md)
   - Review [STYLING_ARCHITECTURE_DOCUMENTATION.md](./STYLING_ARCHITECTURE_DOCUMENTATION.md)

2. **Learn the Hybrid Framework Approach**
   - Read [HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md)
   - Understand when to use Bootstrap vs Ant Design

3. **Study the Architecture**
   - Review [HRMS_FRONTEND_ARCHITECTURE.md](./HRMS_FRONTEND_ARCHITECTURE.md)
   - Understand the service layer (below)

4. **Build Your First Feature**
   - Follow [ADDING_NEW_FEATURE_GUIDE.md](./ADDING_NEW_FEATURE_GUIDE.md)

### For Adding a New Page

1. Use Bootstrap for layout (grid, cards)
2. Use Ant Design for data tables
3. Follow the list page pattern from [HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md)
4. Use documented colors from [STYLING_QUICK_REFERENCE.md](./STYLING_QUICK_REFERENCE.md)
5. Import Bootstrap selectively: `import { Modal as BootstrapModal } from 'bootstrap'`

### For Styling Components

1. Check [STYLING_QUICK_REFERENCE.md](./STYLING_QUICK_REFERENCE.md) for copy-paste patterns
2. Use documented color variables (never hardcode)
3. Follow responsive patterns using mixins
4. Add z-index fixes for Ant Design dropdowns

---

## 📋 Common Tasks

### Task: Create a List Page with Table

**Docs to Reference:**
- [HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md) → "List Page Implementation"
- [STYLING_QUICK_REFERENCE.md](./STYLING_QUICK_REFERENCE.md) → "Table Quick Reference"

### Task: Create a Modal Form

**Docs to Reference:**
- [HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md) → "Modal Implementation"
- [STYLING_QUICK_REFERENCE.md](./STYLING_QUICK_REFERENCE.md) → "Modal Quick Reference"

### Task: Style Buttons/Badges

**Docs to Reference:**
- [STYLING_QUICK_REFERENCE.md](./STYLING_QUICK_REFERENCE.md) → "Button/Badge Quick Reference"
- [STYLING_ARCHITECTURE_DOCUMENTATION.md](./STYLING_ARCHITECTURE_DOCUMENTATION.md) → "Component Styling Guide"

### Task: Add API Service

**Docs to Reference:**
- [Service Layer Architecture](#service-layer-architecture-guide) (below)

### Task: Fix Dropdown Issues

**Docs to Reference:**
- [BOOTSTRAP_DROPDOWN_FIX.md](./BOOTSTRAP_DROPDOWN_FIX.md)
- [components/ant-design-dropdown-guide.md](./components/ant-design-dropdown-guide.md)

---

## 🎯 Design System Quick Access

### Colors

```scss
$primary: #011b44;      // NetSuite blue
$success: #03C95A;      // Green
$danger: #E70D0D;       // Red
$warning: #FFC107;      // Yellow
```

[→ Full Color Palette](./STYLING_ARCHITECTURE_DOCUMENTATION.md#color-system--theme-variables)

### Typography

```scss
$font-size-14: 14px;   // Body (default)
$font-size-18: 18px;   // Card titles
$font-weight-medium: 500;
$font-weight-semibold: 600;
```

[→ Full Typography System](./STYLING_ARCHITECTURE_DOCUMENTATION.md#typography-system)

### Components

- [Buttons](./STYLING_QUICK_REFERENCE.md#-button-quick-reference)
- [Badges](./STYLING_QUICK_REFERENCE.md#-badge-quick-reference)
- [Cards](./STYLING_QUICK_REFERENCE.md#-card-quick-reference)
- [Forms](./STYLING_QUICK_REFERENCE.md#-form-quick-reference)
- [Tables](./STYLING_QUICK_REFERENCE.md#-table-quick-reference)
- [Modals](./STYLING_QUICK_REFERENCE.md#-modal-quick-reference)

---

## ⚡ Critical Information

### Import Pattern (MUST FOLLOW)

```javascript
// ✅ CORRECT - Selective import
import { Modal as BootstrapModal } from 'bootstrap';

// ❌ WRONG - Causes conflicts
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

[→ Full Import Guide](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md#import-strategies)

### Z-Index Hierarchy

```
Modal Backdrop:  1050
Modal:          1055
Dropdown:       9999
Tooltip:        10000
```

[→ Conflict Resolution](./HYBRID_BOOTSTRAP_ANTDESIGN_GUIDE.md#conflict-resolution)

---

# Service Layer Architecture Guide

This guide explains how to use the BaseService class for consistent API handling across all service files.

## BaseService Features

The `BaseService` class provides:

- **Consistent Error Handling**: Handles all HTTP status codes (200, 201, 404, 422, 500, 401, 403)
- **Validation Utilities**: Built-in validation for required fields, numeric fields, files, and dates
- **Retry Mechanism**: Automatic retry with exponential backoff for failed requests
- **Query String Building**: Utility to build query parameters
- **Error Logging**: Configurable error logging for different environments

## Creating a New Service

### 1. Basic Structure

```javascript
// your-service.js
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import { BaseService } from '@/services/base.service';

class YourService extends BaseService {
  
  // Your service methods here
  async getItems(params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.YOUR_RESOURCE.LIST}${queryString ? `?${queryString}` : ''}`;
    
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch items' // Operation description for error messages
    );
  }
}

export const yourService = new YourService();
```

### 2. CRUD Operations

```javascript
class YourService extends BaseService {
  
  // GET - List items
  async getAllItems(params = {}) {
    const queryString = this.buildQueryString(params);
    const endpoint = `${API_ENDPOINTS.ITEMS.LIST}${queryString ? `?${queryString}` : ''}`;
    
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch items'
    );
  }

  // GET - Single item
  async getItemById(id) {
    const endpoint = API_ENDPOINTS.ITEMS.GET_BY_ID.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.get(endpoint),
      'fetch item by ID'
    );
  }

  // POST - Create item
  async createItem(itemData) {
    return await this.handleApiResponse(
      () => apiService.post(API_ENDPOINTS.ITEMS.CREATE, itemData),
      'create item'
    );
  }

  // PUT - Update item
  async updateItem(id, itemData) {
    const endpoint = API_ENDPOINTS.ITEMS.UPDATE.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.put(endpoint, itemData),
      'update item'
    );
  }

  // DELETE - Delete item
  async deleteItem(id) {
    const endpoint = API_ENDPOINTS.ITEMS.DELETE.replace(':id', id);
    return await this.handleApiResponse(
      () => apiService.delete(endpoint),
      'delete item'
    );
  }
}
```

## Validation

### 1. Using Built-in Validators

```javascript
class YourService extends BaseService {
  
  validateItemData(itemData) {
    // Required fields validation
    const requiredValidation = this.validateRequiredFields(itemData, [
      'name', 'email', 'category_id'
    ]);

    // Numeric fields validation
    const numericValidation = this.validateNumericFields(itemData, [
      { field: 'price', min: 0, required: true },
      { field: 'quantity', min: 1, max: 1000, required: false },
      { field: 'category_id', min: 1, required: true }
    ]);

    // Custom validations
    const customErrors = {};
    
    if (itemData.email && !this.isValidEmail(itemData.email)) {
      customErrors.email = ['Invalid email format'];
    }
    
    if (itemData.start_date && !this.isValidDate(itemData.start_date)) {
      customErrors.start_date = ['Invalid date format'];
    }

    // Combine all validations
    return this.combineValidations([
      requiredValidation,
      numericValidation,
      { isValid: Object.keys(customErrors).length === 0, errors: customErrors }
    ]);
  }

  // Create with validation
  async createItemWithValidation(itemData) {
    const validation = this.validateItemData(itemData);
    
    if (!validation.isValid) {
      throw this.createValidationError(validation.errors);
    }
    
    return await this.createItem(itemData);
  }
}
```

### 2. File Upload Validation

```javascript
class YourService extends BaseService {
  
  async uploadFile(file) {
    const validation = this.validateFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        'application/pdf',
        'image/jpeg',
        'image/png'
      ],
      required: true
    });
    
    if (!validation.isValid) {
      throw this.createValidationError(validation.errors);
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    return await this.handleApiResponse(
      () => apiService.postFormData(API_ENDPOINTS.UPLOAD, formData),
      'upload file'
    );
  }
}
```

## Error Handling

### 1. In Service Methods

```javascript
class YourService extends BaseService {
  
  async getItemsWithLogging(params = {}) {
    try {
      return await this.handleApiResponse(
        () => apiService.get(API_ENDPOINTS.ITEMS.LIST, { params }),
        'fetch items with logging'
      );
    } catch (error) {
      // Log the error for debugging
      this.logError(error, 'YourService.getItemsWithLogging');
      
      // Re-throw to let the component handle it
      throw error;
    }
  }
}
```

### 2. In Components

```javascript
// In your Vue component
async fetchData() {
  try {
    const response = await yourService.getItems({ page: 1, limit: 10 });
    this.items = response.data;
  } catch (error) {
    switch (error.status) {
      case 404:
        this.showError('No items found');
        break;
      case 422:
        this.showValidationErrors(error.errors);
        break;
      case 500:
        this.showError('Server error occurred');
        break;
      default:
        this.showError(error.message || 'An error occurred');
    }
  }
}
```

## Advanced Features

### 1. Retry Mechanism

```javascript
class YourService extends BaseService {
  
  async criticalOperation(data) {
    return await this.retryApiCall(
      () => this.handleApiResponse(
        () => apiService.post(API_ENDPOINTS.CRITICAL_OPERATION, data),
        'perform critical operation'
      ),
      3, // max retries
      1000 // base delay in milliseconds
    );
  }
}
```

### 2. Custom Error Formatting

```javascript
class YourService extends BaseService {
  
  async getItemsWithCustomErrorHandling(params = {}) {
    try {
      return await this.handleApiResponse(
        () => apiService.get(API_ENDPOINTS.ITEMS.LIST, { params }),
        'fetch items'
      );
    } catch (error) {
      // Format the error with additional context
      throw this.formatError(error, 'while fetching items with custom parameters');
    }
  }
}
```

## Response Structure

All methods using `handleApiResponse` will return responses in this format:

### Success Response (200, 201)
```javascript
{
  success: true,
  message: "Operation completed successfully",
  data: { /* response data */ },
  pagination: { /* pagination info if applicable */ }
}
```

### Error Responses

#### 404 - Not Found
```javascript
{
  status: 404,
  success: false,
  message: "Resource not found",
  error: "Not found"
}
```

#### 422 - Validation Error
```javascript
{
  status: 422,
  success: false,
  message: "Validation failed",
  errors: {
    field1: ["Error message 1"],
    field2: ["Error message 2"]
  }
}
```

#### 500 - Server Error
```javascript
{
  status: 500,
  success: false,
  message: "Internal server error",
  error: "Server error occurred"
}
```

## Best Practices

1. **Always use `handleApiResponse`** for API calls to ensure consistent error handling
2. **Provide descriptive operation names** for better error messages
3. **Use validation methods** before making API calls when possible
4. **Log errors** in service methods for debugging
5. **Handle specific error types** in components for better user experience
6. **Use retry mechanism** for critical or network-sensitive operations
7. **Validate files** before uploading
8. **Use query string builder** for consistent parameter handling

## Migration from Existing Services

To migrate existing service files to use BaseService:

1. Import BaseService: `import { BaseService } from '@/services/base.service';`
2. Extend BaseService: `class YourService extends BaseService {`
3. Replace direct API calls with `this.handleApiResponse(() => apiCall, 'operation')`
4. Remove custom error handling code
5. Use built-in validation methods where applicable
6. Update validation logic to use base class utilities

This architecture ensures consistent error handling, reduces code duplication, and provides a robust foundation for all API interactions in your application.

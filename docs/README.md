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

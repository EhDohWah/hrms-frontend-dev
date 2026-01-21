# File Upload FormData Fix

## Issue
File uploads were failing with validation error:
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "file": [
            "The file field is required."
        ]
    }
}
```

## Root Cause
The `apiService.post()` method in `src/services/api.service.js` was not handling FormData correctly. It was:

1. **Always using `JSON.stringify(data)`** - This converted FormData objects to JSON strings instead of sending them as multipart/form-data
2. **Not accepting a config parameter** - Upload services were passing config with headers, but the post method ignored it
3. **Not detecting FormData** - The method didn't differentiate between regular JSON data and FormData

## Solution

### 1. Updated `api.service.js` - `post()` method
Modified the `post()` method to:
- Accept an optional `config` parameter
- Detect when data is FormData using `instanceof FormData`
- Remove `Content-Type` header for FormData (browser sets it automatically with boundary)
- Send FormData directly without JSON.stringify()
- Send regular data as JSON (existing behavior)

```javascript
async post(endpoint, data, config = {}) {
    try {
        // Check if data is FormData
        const isFormData = data instanceof FormData;
        
        // Prepare headers
        let headers = { ...this.headers };
        
        // If FormData, remove Content-Type to let browser set it with boundary
        if (isFormData) {
            delete headers['Content-Type'];
        }
        
        // Merge with custom headers from config if provided
        if (config.headers) {
            // Don't override Content-Type for FormData
            if (isFormData && config.headers['Content-Type']) {
                delete config.headers['Content-Type'];
            }
            headers = { ...headers, ...config.headers };
        }
        
        const response = await fetch(this.getFullURL(endpoint), {
            method: 'POST',
            headers: headers,
            body: isFormData ? data : JSON.stringify(data),
            credentials: 'include'
        });
        return this.handleResponse(response, { endpoint, method: 'POST', data });
    } catch (error) {
        if (!error.response) {
            error.message = 'Network Error: Server is not responding';
        }
        return Promise.reject(error);
    }
}
```

### 2. Updated Upload Services
Removed explicit `Content-Type: multipart/form-data` header from all upload services:
- `src/services/upload-grant.service.js`
- `src/services/upload-employee.service.js`
- `src/services/upload-employment.service.js`
- `src/services/upload-payroll.service.js`
- `src/services/upload-funding-allocation.service.js`

**Before:**
```javascript
const config = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
};
```

**After:**
```javascript
const config = {};
```

## Why Remove Content-Type Header?

When sending FormData, the browser **must** set the `Content-Type` header automatically because it needs to include a unique boundary string:

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
```

If we manually set `Content-Type: multipart/form-data` without the boundary, the server cannot parse the multipart data correctly.

## Files Modified

### Frontend - API Service Layer
1. `src/services/api.service.js` - Enhanced post() method to handle FormData
2. `src/services/upload-grant.service.js` - Removed explicit Content-Type header
3. `src/services/upload-employee.service.js` - Removed explicit Content-Type header
4. `src/services/upload-employment.service.js` - Removed explicit Content-Type header
5. `src/services/upload-payroll.service.js` - Removed explicit Content-Type header
6. `src/services/upload-funding-allocation.service.js` - Removed explicit Content-Type header

### Frontend - Upload Components (Message Handling)
7. `src/components/uploads/grant-upload.vue` - Updated to show processed grants/items and warnings
8. `src/components/uploads/employee-upload.vue` - Updated to show queued message with import ID
9. `src/components/uploads/employment-upload.vue` - Updated to show queued message with import ID
10. `src/components/uploads/payroll-upload.vue` - Updated to show queued message with import ID
11. `src/components/uploads/funding-allocation-upload.vue` - Updated to show queued message with import ID

## Upload Response Handling

### Grant Upload (Synchronous)
Returns immediately with results:
```json
{
    "success": true,
    "message": "Grant data import completed",
    "data": {
        "processed_grants": 1,
        "processed_items": 2,
        "warnings": ["Sheet 'Instructions': Missing grant code"]
    }
}
```

**Component displays:**
- Success message with grant and position counts
- Warning messages (if any)
- Error messages (if any)

### Other Uploads (Queued/Asynchronous)
Employee, Employment, Payroll, and Funding Allocation uploads are queued and return:
```json
{
    "success": true,
    "message": "Import started successfully. You will be notified when complete.",
    "data": {
        "import_id": "import_123456",
        "status": "processing"
    }
}
```

**Component displays:**
- Success message indicating import is queued
- Import ID for tracking
- Status (if available)
- User receives notification when import completes

## Testing
After this fix, file uploads should work correctly:
1. Select an Excel file (.xlsx or .xls)
2. Upload the file
3. Backend should receive the file in the `file` field
4. Validation should pass
5. Appropriate success/queued message displays
6. For grant uploads: see immediate results with warnings
7. For other uploads: see import ID and await notification

## Related Issues
- All file upload endpoints were affected by this issue
- This was a systematic problem in the API service layer
- Message handling was inconsistent across upload components
- No backend changes were required

## Date
January 9, 2026

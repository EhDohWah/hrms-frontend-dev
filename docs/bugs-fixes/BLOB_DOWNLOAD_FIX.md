# Blob Download Fix - "PK" Parsing Error

## 🐛 Issue Description

**Error Message:**
```
SyntaxError: Unexpected token 'P', "PK" is not valid JSON
```

**Root Cause:** The API service was trying to parse the binary Excel file (which starts with "PK" - ZIP format signature) as JSON.

---

## 🔍 Problem Analysis

### What Happened

1. Backend returns Excel file as binary blob (✅ Correct)
2. Frontend `apiService.get()` receives response
3. `handleResponse()` tries to parse response as JSON
4. Excel file starts with "PK" (ZIP signature)
5. JSON parser fails: `Unexpected token 'P'`

### Why It Happened

The `get()` method in `api.service.js` always calls `handleResponse()`, which attempts to parse the response as JSON:

```javascript
// ❌ PROBLEM
async get(endpoint) {
    const response = await fetch(fullURL, {...});
    return this.handleResponse(response, {...});  // Always parses as JSON!
}
```

---

## ✅ Solution Implemented

### 1. Updated `api.service.js` - Added Blob Support

**File:** `src/services/api.service.js`

**Before:**
```javascript
async get(endpoint) {
    const fullURL = this.getFullURL(endpoint);
    const response = await fetch(fullURL, {
        method: 'GET',
        headers: this.headers,
        credentials: 'include'
    });
    return this.handleResponse(response, { endpoint, method: 'GET' });
}
```

**After:**
```javascript
async get(endpoint, options = {}) {
    const fullURL = this.getFullURL(endpoint);
    const fetchOptions = {
        method: 'GET',
        headers: this.headers,
        credentials: 'include'
    };

    const response = await fetch(fullURL, fetchOptions);

    // If responseType is 'blob', return blob directly
    if (options.responseType === 'blob') {
        if (!response.ok) {
            const error = new Error(`HTTP error! Status: ${response.status}`);
            error.response = response;
            throw error;
        }
        return await response.blob();  // ✅ Return blob, don't parse as JSON
    }

    // Otherwise, handle as JSON
    return this.handleResponse(response, { endpoint, method: 'GET' });
}
```

**Key Changes:**
- ✅ Added `options` parameter to `get()` method
- ✅ Check for `options.responseType === 'blob'`
- ✅ Return blob directly without JSON parsing
- ✅ Maintain backward compatibility (default behavior unchanged)

### 2. Updated `grant.service.js` - Simplified Blob Handling

**File:** `src/services/grant.service.js`

**Before:**
```javascript
async downloadTemplate() {
    const response = await apiService.get(API_ENDPOINTS.GRANT.DOWNLOAD_TEMPLATE, {
        responseType: 'blob'
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));  // ❌ response.data doesn't exist
    // ...
}
```

**After:**
```javascript
async downloadTemplate() {
    // Get blob response directly
    const blob = await apiService.get(API_ENDPOINTS.GRANT.DOWNLOAD_TEMPLATE, {
        responseType: 'blob'
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(blob);  // ✅ blob is returned directly
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.setAttribute('download', `grant_import_template_${timestamp}.xlsx`);
    
    // Append to html link element page
    document.body.appendChild(link);
    
    // Start download
    link.click();
    
    // Clean up and remove the link
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
}
```

**Key Changes:**
- ✅ Response is now a `Blob` object directly (not wrapped in `response.data`)
- ✅ Removed unnecessary `new Blob([response.data])`
- ✅ Proper cleanup with `revokeObjectURL()`
- ✅ Returns success indicator

---

## 🎯 How It Works Now

### Request Flow

```
Frontend: grant-upload.vue
    ↓
    downloadTemplate()
    ↓
Grant Service: grant.service.js
    ↓
    apiService.get(endpoint, { responseType: 'blob' })
    ↓
API Service: api.service.js
    ↓
    Check options.responseType === 'blob'
    ↓
    YES → Return blob directly (skip JSON parsing)
    ↓
Grant Service receives Blob
    ↓
    Create download link
    ↓
    Trigger download
    ↓
✅ File downloaded successfully!
```

### Response Handling

**For Blob Downloads:**
```javascript
// Request
await apiService.get('/grants/download-template', { responseType: 'blob' })

// Response
Blob {
    size: 25648,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}
```

**For JSON Responses (default):**
```javascript
// Request
await apiService.get('/grants')

// Response (parsed as JSON)
{
    success: true,
    data: [...],
    message: "Success"
}
```

---

## 🧪 Testing

### Test 1: Download Template

```javascript
// In browser console
import { grantService } from '@/services/grant.service';

// Should download file without error
await grantService.downloadTemplate();
// ✅ File: grant_import_template_2025-12-30T14-15-30.xlsx
```

### Test 2: Verify Blob Type

```javascript
// In api.service.js (temporary debug)
const blob = await response.blob();
console.log('Blob type:', blob.type);
console.log('Blob size:', blob.size);
// Should show:
// Blob type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// Blob size: 25648 (or similar)
```

### Test 3: Network Tab

1. Open DevTools → Network tab
2. Click "Download Template"
3. Check response:
   - ✅ Status: 200 OK
   - ✅ Type: xlsx
   - ✅ Size: ~25KB
   - ✅ No JSON parsing errors

---

## 📋 Files Changed

1. ✅ `src/services/api.service.js` - Added blob support to `get()` method
2. ✅ `src/services/grant.service.js` - Updated `downloadTemplate()` to handle blob correctly

---

## 🔄 Backward Compatibility

The changes are **100% backward compatible**:

- ✅ Existing `get()` calls work unchanged (no `options` parameter)
- ✅ Default behavior: parse as JSON (unchanged)
- ✅ New behavior: pass `{ responseType: 'blob' }` for blob downloads
- ✅ All existing API calls continue to work

---

## 🎉 Result

**Before:**
```
❌ SyntaxError: Unexpected token 'P', "PK" is not valid JSON
```

**After:**
```
✅ Template downloaded successfully!
✅ File: grant_import_template_2025-12-30T14-15-30.xlsx
```

---

## 💡 Key Learnings

1. **Binary responses need special handling** - Don't parse as JSON
2. **Use `responseType: 'blob'`** for file downloads
3. **Return blob directly** from API service
4. **Clean up blob URLs** with `revokeObjectURL()`
5. **Maintain backward compatibility** when modifying shared services

---

## 🚀 Status

**Issue:** ✅ RESOLVED  
**Date Fixed:** December 30, 2025  
**Tested:** ✅ Working  
**Production Ready:** ✅ Yes

---

**Implementation By:** AI Assistant  
**Version:** 1.2.0 (Blob Download Fix)


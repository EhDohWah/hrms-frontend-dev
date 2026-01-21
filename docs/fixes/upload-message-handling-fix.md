# Upload Message Handling Fix

## Issue
Upload components were not displaying the correct success messages based on the actual API response structure. The components were looking for fields that didn't exist in the response.

## Example Problem
**Grant Upload Response:**
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

**Component was looking for:**
- `total_records` (doesn't exist)
- `summary.inserted`, `summary.updated`, `summary.failed` (doesn't exist)

**Component should use:**
- `processed_grants` and `processed_items`
- `warnings` array
- `errors` array (if present)

## Solution

### Grant Upload Component
Updated to correctly extract and display:
- Number of processed grants
- Number of processed items (positions)
- Warning messages (displayed as warning toasts)
- Error messages (displayed as error toasts)

```javascript
const data = response.data || response;
const processedGrants = data.processed_grants || 0;
const processedItems = data.processed_items || 0;
const warnings = data.warnings || [];
const errors = data.errors || [];

message.success({ 
    content: `Successfully uploaded ${processedGrants} grant(s) with ${processedItems} position(s)!`, 
    key: 'upload',
    duration: 5
});

// Show warnings
warnings.forEach((warning, index) => {
    setTimeout(() => {
        message.warning({
            content: warning,
            duration: 6
        });
    }, (index + 1) * 100);
});
```

### Queued Upload Components
Updated Employee, Employment, Payroll, and Funding Allocation uploads to show:
- Success message indicating import is queued
- Import ID for tracking
- Status (if available)
- Clear indication that user will receive notification

```javascript
const data = response.data || response;
const importId = data.import_id;
const status = data.status;

message.success({ 
    content: response.message || 'Import started successfully. You will receive a notification when complete.', 
    key: 'upload',
    duration: 6
});

if (importId) {
    message.info({
        content: `Import ID: ${importId} | Status: ${status || 'processing'}`,
        duration: 5
    });
}
```

## Upload Types

### Synchronous Uploads
- **Grant Upload**: Returns immediate results with counts and warnings

### Asynchronous/Queued Uploads
- **Employee Upload**: Queued, returns import_id
- **Employment Upload**: Queued, returns import_id and status
- **Payroll Upload**: Queued, returns import_id
- **Funding Allocation Upload**: Queued, returns import_id and status

## Files Modified
1. `src/components/uploads/grant-upload.vue`
2. `src/components/uploads/employee-upload.vue`
3. `src/components/uploads/employment-upload.vue`
4. `src/components/uploads/payroll-upload.vue`
5. `src/components/uploads/funding-allocation-upload.vue`

## User Experience Improvements
- ✅ Accurate success messages based on actual response data
- ✅ Display of warnings and errors from backend
- ✅ Clear indication when imports are queued vs completed
- ✅ Import ID shown for tracking queued imports
- ✅ Appropriate message durations (longer for important info)
- ✅ Staggered display of multiple warnings/errors (prevents overlap)

## Testing
1. Upload a grant file → See immediate results with grant/item counts and warnings
2. Upload employee file → See queued message with import ID
3. Upload employment file → See queued message with import ID and status
4. Upload payroll file → See queued message with import ID
5. Upload funding allocation file → See queued message with import ID and status
6. Check notifications for completion status of queued imports

## Date
January 9, 2026

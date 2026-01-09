# Payroll Upload & Download Feature

## Overview
This document describes the frontend implementation of the payroll data upload and template download functionality.

## Feature Location
**Navigation:** Administration → File Uploads → Payroll Data section

## Components

### 1. PayrollUpload Component
**File:** `src/components/uploads/payroll-upload.vue`

#### Purpose
Provides UI for uploading payroll Excel files and downloading the import template.

#### Features
- File selection with drag-and-drop support (via UploadRow)
- Template download link
- Upload progress tracking
- Success/error message display
- Automatic file clearing after upload

#### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| None | - | - | Component is self-contained |

#### Emits
| Event | Payload | Description |
|-------|---------|-------------|
| `upload-complete` | `Object` | Emitted after successful upload with response data |

#### Data Properties
```javascript
{
    upload: {
        id: 3,
        name: "Payroll Records Import",
        description: "Upload Excel file with monthly payroll records (bulk import)",
        icon: "cash-banknote",
        templateUrl: true
    },
    uploading: false,
    uploadProgress: 0,
    selectedFile: null
}
```

#### Methods

**`onFileSelected(file)`**
- Called when user selects a file
- Stores the selected file in component state

**`onFileCleared()`**
- Called when user clears the file selection
- Resets file and progress state

**`downloadTemplate()`**
- Calls service to download Excel template
- Shows loading/success/error messages
- Triggers browser download

**`handleUpload(file)`**
- Validates file is selected
- Shows upload progress
- Calls service to upload file
- Handles success/error responses
- Displays upload summary
- Clears file after success

### 2. UploadRow Component
**File:** `src/components/uploads/upload-row.vue`

Reusable component that provides the upload UI row. Used by all upload components (Grant, Employee, Employment, Funding Allocation, Payroll).

## Service Layer

### UploadPayrollService
**File:** `src/services/upload-payroll.service.js`

#### Methods

**`uploadPayrollData(file, onProgress)`**
```javascript
async uploadPayrollData(file, onProgress = null)
```
- **Parameters:**
  - `file` (File): Excel file to upload
  - `onProgress` (Function, optional): Callback for upload progress
- **Returns:** Promise<Object> - API response with upload summary
- **Throws:** Error if upload fails

**`downloadTemplate()`**
```javascript
async downloadTemplate()
```
- **Returns:** Promise<Object> - { success: true }
- **Side Effects:** Triggers browser download of template file
- **Filename:** `payroll_import_template_YYYY-MM-DDTHH-MM-SS.xlsx`
- **Throws:** Error if download fails

**`validateFile(file)`**
```javascript
validateFile(file)
```
- **Parameters:**
  - `file` (File): File to validate
- **Returns:** Object - { isValid: boolean, errors: string[] }
- **Validations:**
  - File type must be .xlsx or .xls
  - File size must be ≤ 10MB

## API Integration

### Endpoints Used
**Configuration:** `src/config/api.config.js`

```javascript
API_ENDPOINTS.UPLOAD = {
    PAYROLL: '/uploads/payroll',
    PAYROLL_TEMPLATE: '/downloads/payroll-template'
}
```

### Upload Request
```
POST /api/v1/uploads/payroll
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- file: [Excel file]
```

### Download Request
```
GET /api/v1/downloads/payroll-template
Authorization: Bearer {token}
```

## User Interface

### Layout
The payroll upload section is displayed in the File Uploads page with:
- **Section Header:** "Payroll Data" with calculator icon
- **Table Layout:**
  - Column 1: Upload Type (35% width)
  - Column 2: Select File (40% width)
  - Column 3: Actions (25% width)

### Visual Design
- **Section Color:** Purple accent (#6f42c1)
- **Icon:** `ti ti-calculator`
- **Hover Effect:** Light gray background on row hover
- **Progress Bar:** Animated progress during upload

### User Actions

#### 1. Download Template
- **Trigger:** Click "Download Template" link
- **Visual Feedback:** Loading message
- **Result:** Browser downloads Excel file
- **Success Message:** "Template downloaded!"
- **Error Message:** "Failed to download template."

#### 2. Upload File
- **Trigger:** Click "Upload" button after selecting file
- **Visual Feedback:** 
  - Progress bar (0-100%)
  - Loading message: "Uploading payroll data..."
- **Success Message:** "Successfully uploaded {count} payroll records!"
- **Additional Info:** "Inserted: X, Updated: Y, Failed: Z"
- **Error Messages:** 
  - "Please select a file to upload"
  - "Failed to upload payroll data. Please try again."
  - Specific validation errors from API

## Permissions

### Module Permission
**Module:** `file_uploads`
- Read: `upload.read`
- Write: `upload.create`, `upload.delete`

### Specific Payroll Permissions
- **Upload:** `employee_salary.edit`
- **Download Template:** `employee_salary.read`

### Permission Checks
The component receives `canEdit` prop from parent:
```javascript
const { canEdit } = usePermissions('file_uploads');
```

If user doesn't have edit permission:
- Upload button is disabled
- File selection is disabled
- Template download is still available (if they have read permission)

## File Format

### Supported Formats
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

### Size Limit
- Maximum: 10 MB

### Template Structure
The downloaded template includes:
- Header row with column names
- Sample data row (optional)
- Instructions or notes

## Error Handling

### Client-Side Validation
1. **File Type Check**
   - Validates file extension and MIME type
   - Error: "Invalid file type. Please upload an Excel file (.xlsx or .xls)"

2. **File Size Check**
   - Validates file size ≤ 10MB
   - Error: "File size exceeds 10MB limit"

### Server-Side Errors
Handled and displayed to user:
- Network errors
- Authentication errors
- Validation errors (missing fields, invalid data)
- Database errors
- Permission errors

### Error Display
- Primary error message shown in notification
- Detailed field errors shown as separate notifications
- Console logging for debugging

## Integration

### Parent Component
**File:** `src/views/pages/administration/file-uploads/file-uploads-list.vue`

```vue
<PayrollUpload 
    :can-edit="canEdit" 
    @upload-complete="onUploadComplete" 
/>
```

### Event Handling
```javascript
methods: {
    onUploadComplete(data) {
        console.log('Upload completed:', data);
        // Can add additional logic here:
        // - Refresh data
        // - Show additional notifications
        // - Navigate to another page
    }
}
```

## Testing

### Manual Testing Checklist
- [ ] Download template without errors
- [ ] Template file opens in Excel
- [ ] Select valid Excel file
- [ ] Upload shows progress bar
- [ ] Success message displays with correct counts
- [ ] File input clears after success
- [ ] Invalid file type shows error
- [ ] File too large shows error
- [ ] No file selected shows error
- [ ] Network error shows error message
- [ ] Permission check works (read-only mode)

### Test Data
Create test Excel files:
1. Valid file with correct format
2. Invalid file type (.pdf, .doc)
3. Oversized file (>10MB)
4. Empty file
5. File with validation errors
6. File with duplicate records

## Best Practices

### Code Quality
✅ Consistent with other upload components
✅ Proper error handling
✅ Loading states and feedback
✅ Clean component structure
✅ Service layer separation
✅ Type validation
✅ Progress tracking

### User Experience
✅ Clear instructions
✅ Visual feedback during operations
✅ Helpful error messages
✅ Template download for guidance
✅ Automatic cleanup after success
✅ Permission-based UI

### Performance
✅ Progress tracking for large files
✅ Blob handling for downloads
✅ Proper memory cleanup (URL.revokeObjectURL)
✅ Async/await for API calls

## Related Components

### Similar Upload Components
- `src/components/uploads/grant-upload.vue`
- `src/components/uploads/employee-upload.vue`
- `src/components/uploads/employment-upload.vue`
- `src/components/uploads/funding-allocation-upload.vue`

All follow the same pattern and structure.

## Maintenance Notes

### Adding New Fields
1. Update backend template generation
2. Update backend validation rules
3. Update template documentation
4. Test with new fields

### Changing File Size Limit
Update in two places:
1. `upload-payroll.service.js` - validateFile method
2. Backend validation rules

### Changing Permissions
Update in:
1. Backend route middleware
2. Frontend permission checks
3. Documentation

## Troubleshooting

### Common Issues

**Issue:** Template download fails
- Check API endpoint is correct
- Verify user has `employee_salary.read` permission
- Check backend template generation method

**Issue:** Upload fails with validation errors
- Verify Excel file matches template format
- Check all required fields are filled
- Ensure data types are correct

**Issue:** Progress bar doesn't update
- Check onProgress callback is working
- Verify API supports progress events
- Check network tab for upload progress

**Issue:** File doesn't clear after upload
- Check if `resetFile()` is called on UploadRow ref
- Verify `onFileCleared()` is called
- Check component state is reset

## Future Enhancements

### Potential Improvements
- [ ] Drag-and-drop file upload
- [ ] Preview data before upload
- [ ] Validate file contents client-side
- [ ] Show detailed error report for failed records
- [ ] Support for CSV files
- [ ] Batch upload multiple files
- [ ] Upload history/logs
- [ ] Retry failed records
- [ ] Download error report

## Conclusion

The payroll upload and download feature is fully implemented and follows best practices:
- Clean component architecture
- Robust service layer
- Proper error handling
- Good user experience
- Consistent with other upload features
- Well-documented and maintainable

The implementation is production-ready and requires no additional changes.

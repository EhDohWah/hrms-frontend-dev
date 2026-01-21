# Leave Report API Update Documentation

## Overview
This document outlines the comprehensive updates made to the frontend to support the new Leave Request Report API backend implementation. The changes ensure compatibility with the updated backend controller that requires both `work_location` and `department` as mandatory parameters.

## Backend API Changes
The backend controller now expects:
- **Endpoint**: `POST /reports/leave-request-report/export-pdf`
- **Required Parameters**:
  - `start_date` (string, format: YYYY-MM-DD)
  - `end_date` (string, format: YYYY-MM-DD)
  - `work_location` (string, required)
  - `department` (string, required)

## Frontend Updates Summary

### 1. API Service Layer (`src/services/api.service.js`)

#### Changes Made:
- **Parameter Renaming**: Changed `site` parameter to `workLocation` in all leave report methods
- **Required Validation**: Added validation to ensure both `workLocation` and `department` are provided
- **Request Body Updates**: Modified request body to send `work_location` and `department` as required fields

#### Methods Updated:
- `getLeaveReportPdf(startDate, endDate, workLocation, department, endpoint)`
- `getLeaveReportExcel(startDate, endDate, workLocation, department, endpoint)`
- `getLeaveReportCsv(startDate, endDate, workLocation, department, endpoint)`

#### Before:
```javascript
async getLeaveReportPdf(startDate, endDate, site, department, endpoint) {
    const requestBody = {
        start_date: startDate,
        end_date: endDate
    };
    
    // Add optional parameters if provided
    if (site) {
        requestBody.site = site;
    }
    if (department) {
        requestBody.department = department;
    }
}
```

#### After:
```javascript
async getLeaveReportPdf(startDate, endDate, workLocation, department, endpoint) {
    // Validate required parameters
    if (!workLocation) {
        throw new Error('Work location is required for leave report generation');
    }
    if (!department) {
        throw new Error('Department is required for leave report generation');
    }

    const requestBody = {
        start_date: startDate,
        end_date: endDate,
        work_location: workLocation,
        department: department
    };
}
```

### 2. Report Service Layer (`src/services/report-leave.service.js`)

#### Changes Made:
- **Parameter Updates**: Changed `site` to `workLocation` in all method signatures
- **Validation Logic**: Added validation to ensure required parameters are provided
- **Documentation**: Updated JSDoc comments to reflect new requirements

#### Methods Updated:
- `generateLeaveReportPDF(startDate, endDate, workLocation, department)`
- `generateLeaveReportExcel(startDate, endDate, workLocation, department)`
- `generateLeaveReportCSV(startDate, endDate, workLocation, department)`

#### Before:
```javascript
async generateLeaveReportPDF(startDate, endDate, site = null, department = null) {
    const pdfBlob = await apiService.getLeaveReportPdf(startDate, endDate, site, department, endpoint);
    return pdfBlob;
}
```

#### After:
```javascript
async generateLeaveReportPDF(startDate, endDate, workLocation, department) {
    // Validate required parameters
    if (!workLocation) {
        throw new Error('Work location is required for generating leave report');
    }
    if (!department) {
        throw new Error('Department is required for generating leave report');
    }

    const pdfBlob = await apiService.getLeaveReportPdf(startDate, endDate, workLocation, department, endpoint);
    return pdfBlob;
}
```

### 3. Component Layer (`src/components/reports/leave-report.vue`)

#### Template Changes:
- **Placeholder Updates**: Changed placeholders to indicate required fields
  - `"All Sites"` → `"Select Site *"`
  - `"All Departments"` → `"Select Department *"`
- **Clear Button Removal**: Removed `allow-clear` from site dropdown to prevent clearing required fields

#### Before:
```vue
<a-select v-model:value="selectedSite" placeholder="All Sites" style="width: 100%" allow-clear>
<a-select v-model:value="selectedDepartment" placeholder="All Departments" style="width: 100%" allow-clear>
```

#### After:
```vue
<a-select v-model:value="selectedSite" placeholder="Select Site *" style="width: 100%">
<a-select v-model:value="selectedDepartment" placeholder="Select Department *" style="width: 100%">
```

#### Script Changes:

##### 1. Parameter Generation (`getReportParameters()`)
**Before:**
```javascript
getReportParameters() {
    const params = {
        start_date: startDate,
        end_date: endDate
    };

    if (this.selectedSite) {
        params.site = this.selectedSite;
    }
    if (this.selectedDepartment) {
        params.department = this.selectedDepartment;
    }

    return params;
}
```

**After:**
```javascript
getReportParameters() {
    const params = {
        start_date: startDate,
        end_date: endDate,
        work_location: this.selectedSite,
        department: this.selectedDepartment
    };

    return params;
}
```

##### 2. Validation Updates (All Export Methods)
**Added validation for all export methods:**
```javascript
if (!params.work_location) {
    message.error('Please select a work location.');
    return;
}

if (!params.department) {
    message.error('Please select a department.');
    return;
}
```

##### 3. Service Method Calls
**Before:**
```javascript
const pdfBlob = await reportLeaveService.generateLeaveReportPDF(
    params.start_date,
    params.end_date,
    params.site,
    params.department
);
```

**After:**
```javascript
const pdfBlob = await reportLeaveService.generateLeaveReportPDF(
    params.start_date,
    params.end_date,
    params.work_location,
    params.department
);
```

##### 4. Filename Generation
**Before:**
```javascript
let filename = `leave-report-${params.start_date}-to-${params.end_date}`;
if (params.site) filename += `-${params.site}`;
if (params.department) filename += `-${params.department}`;
```

**After:**
```javascript
let filename = `leave-report-${params.start_date}-to-${params.end_date}`;
if (params.work_location) filename += `-${params.work_location}`;
if (params.department) filename += `-${params.department}`;
```

## API Configuration (`src/config/api.config.js`)

### Status: No Changes Required
The API endpoint was already correctly configured:
```javascript
LEAVE_EXPORT_PDF: '/reports/leave-request-report/export-pdf'
```

## Validation Flow

### 1. Frontend Validation
- **Date Range**: Must select start and end dates
- **Work Location**: Must select a site (required field)
- **Department**: Must select a department (required field)

### 2. Service Layer Validation
- Validates `workLocation` is not null/undefined
- Validates `department` is not null/undefined
- Throws descriptive errors if validation fails

### 3. API Layer Validation
- Double-checks required parameters before making HTTP request
- Provides consistent error messaging

## Error Handling Improvements

### User-Friendly Messages
- `"Please select a work location."` - When site is not selected
- `"Please select a department."` - When department is not selected
- `"Please select a date range."` - When dates are not selected

### Service Layer Errors
- `"Work location is required for generating leave report"`
- `"Department is required for generating leave report"`

## Request/Response Flow

### 1. User Interface
```
User selects: Date Range + Site + Department → Clicks Export
```

### 2. Component Validation
```
Validates all required fields → Calls service method
```

### 3. Service Layer
```
Validates parameters → Calls API service → Returns blob
```

### 4. API Request
```
POST /reports/leave-request-report/export-pdf
{
    "start_date": "2025-04-02",
    "end_date": "2025-04-31",
    "work_location": "SMRU",
    "department": "Human Resources"
}
```

## Testing Considerations

### 1. Validation Testing
- [ ] Test with missing work location
- [ ] Test with missing department
- [ ] Test with missing date range
- [ ] Test with all valid parameters

### 2. Integration Testing
- [ ] Verify PDF generation works with new parameters
- [ ] Test filename generation includes all filters
- [ ] Verify error handling for API failures

### 3. User Experience Testing
- [ ] Confirm required field indicators are visible
- [ ] Test that clear buttons work appropriately
- [ ] Verify error messages are user-friendly

## Notes for Excel/CSV Endpoints

The frontend maintains Excel and CSV export functionality, but these endpoints may not be implemented in the backend yet:
- `/reports/leave-request-report/export-excel`
- `/reports/leave-request-report/export-csv`

**Recommendation**: Either implement these endpoints in the backend or disable these options in the frontend until implemented.

## Migration Impact

### Breaking Changes
- **Required Parameters**: Both site and department are now mandatory
- **Parameter Names**: `site` parameter renamed to `work_location`
- **API Contract**: Request body structure changed

### Backward Compatibility
- **None**: This is a breaking change that requires both frontend and backend updates
- **Migration Required**: All existing integrations must be updated

## Files Modified

1. **`src/services/api.service.js`** - API layer updates
2. **`src/services/report-leave.service.js`** - Service layer updates  
3. **`src/components/reports/leave-report.vue`** - Component layer updates
4. **`src/config/api.config.js`** - No changes (already correct)

## Deployment Checklist

- [ ] Backend API updated with new controller
- [ ] Frontend updated with parameter changes
- [ ] API endpoint routes configured
- [ ] Validation rules implemented
- [ ] Error handling tested
- [ ] User interface reflects required fields
- [ ] Documentation updated

---

**Created**: December 2024  
**Version**: 1.0  
**Last Updated**: Post-implementation of leave request report API changes

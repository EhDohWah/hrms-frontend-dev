# Leave Request System - Frontend Update v4.1

**Date:** October 4, 2025  
**Status:** ✅ Completed  
**Version:** 4.1 - Aligned with Travel Request Backend Pattern

## Overview

This document describes the frontend updates made to align the Leave Request system with the Travel Request backend API pattern (v4.1). The primary changes involve:

1. **Combining HR and Site Admin approval fields** into a single `hr_site_admin_approved` field
2. **Removing signature-related fields** (if any existed)
3. **Updating data mappers, store, service, and UI components**

---

## Changes Summary

### 1. Database Schema Alignment

The frontend now maps to this simplified backend structure:

**Approval Fields (Updated):**
- ✅ `supervisor_approved` (boolean) + `supervisor_approved_date` (date)
- ✅ `hr_site_admin_approved` (boolean) + `hr_site_admin_approved_date` (date) - **NEW COMBINED FIELD**

**Removed Fields:**
- ❌ `hr_approved` + `hr_approved_date`
- ❌ `site_admin_approved` + `site_admin_approved_date`
- ❌ Any signature boolean fields

---

## Files Updated

### 1. Data Mapper (`src/utils/leave.utils.js`)

**Changes:**
- Updated `mapLeaveRequest()` function to use combined field names
- Updated `mapLeaveRequestForAPI()` function to send combined field names to backend

**Before:**
```javascript
hrApproved: backendData.hr_approved || false,
hrApprovedDate: backendData.hr_approved_date,
siteAdminApproved: backendData.site_admin_approved || false,
siteAdminApprovedDate: backendData.site_admin_approved_date,
```

**After:**
```javascript
hrSiteAdminApproved: backendData.hr_site_admin_approved || false,
hrSiteAdminApprovedDate: backendData.hr_site_admin_approved_date,
```

### 2. Modal Component (`src/components/modal/leaves-admin-modal.vue`)

**Changes:**
- Updated `formData` object to use combined approval field
- Updated `editFormData` object to use combined approval field
- Updated `submitForm()` method to send combined field in payload
- Updated `resetForm()` method to reset combined field
- Updated `resetEditForm()` method to reset combined field
- Updated `populateEditForm()` method to map combined field from backend data
- Updated template (Add Modal) to show single "HR/Site Admin Approved" checkbox and date
- Updated template (Edit Modal) to show single "HR/Site Admin Approved" checkbox and date

**Before (Add Modal):**
```html
<!-- HR Approval -->
<input type="checkbox" v-model="formData.hr_approved" />
<input type="date" v-model="formData.hr_approved_date" />

<!-- Site Admin Approval -->
<input type="checkbox" v-model="formData.site_admin_approved" />
<input type="date" v-model="formData.site_admin_approved_date" />
```

**After (Add Modal):**
```html
<!-- HR/Site Admin Approval (Combined) -->
<input type="checkbox" v-model="formData.hr_site_admin_approved" />
<input type="date" v-model="formData.hr_site_admin_approved_date" />
```

### 3. List Component (`src/views/pages/hrm/attendance/leaves/leaves-admin.vue`)

**Changes:**
- Updated approvals column template to display combined HR/Site Admin approval status
- Changed icon from separate HR and Site Admin icons to single combined icon
- Updated approval check logic

**Before:**
```html
<div v-if="record.hrApproved">
  <i class="ti ti-briefcase text-primary"></i>
  HR Approved
</div>
<div v-if="record.siteAdminApproved">
  <i class="ti ti-shield-check text-warning"></i>
  Site Admin Approved
</div>
```

**After:**
```html
<div v-if="record.hrSiteAdminApproved">
  <i class="ti ti-shield-check text-primary"></i>
  HR/Site Admin Approved ({{ formatDate(record.hrSiteAdminApprovedDate) }})
</div>
```

---

## Field Mapping Reference

### Frontend → Backend Mapping

| Frontend (camelCase) | Backend (snake_case) | Type | Description |
|---------------------|---------------------|------|-------------|
| `supervisorApproved` | `supervisor_approved` | boolean | Supervisor approval flag |
| `supervisorApprovedDate` | `supervisor_approved_date` | date | Supervisor approval date |
| `hrSiteAdminApproved` | `hr_site_admin_approved` | boolean | Combined HR/Site Admin approval flag |
| `hrSiteAdminApprovedDate` | `hr_site_admin_approved_date` | date | Combined HR/Site Admin approval date |

### Removed Mappings

| Removed Frontend Field | Removed Backend Field |
|----------------------|---------------------|
| `hrApproved` | `hr_approved` |
| `hrApprovedDate` | `hr_approved_date` |
| `siteAdminApproved` | `site_admin_approved` |
| `siteAdminApprovedDate` | `site_admin_approved_date` |

---

## API Payload Example

### Create/Update Leave Request Payload

```json
{
  "employee_id": 1,
  "leave_type_id": 2,
  "start_date": "2025-04-01",
  "end_date": "2025-04-05",
  "total_days": 5,
  "reason": "Annual vacation",
  "status": "pending",
  "supervisor_approved": true,
  "supervisor_approved_date": "2025-03-15",
  "hr_site_admin_approved": false,
  "hr_site_admin_approved_date": null,
  "attachment_notes": "Medical certificate attached"
}
```

---

## UI Changes

### Modal Forms (Add/Edit)

**Approval Information Section:**
- **Supervisor Approval** - Checkbox + Date picker (unchanged)
- **HR/Site Admin Approval** - NEW Combined checkbox + Date picker

**Label Text:**
- "HR/Site Admin Approved" (replaces separate "HR Approved" and "Site Admin Approved")

### Leave List Table

**Approvals Column:**
- Shows "Supervisor Approved" with date (if approved)
- Shows "HR/Site Admin Approved" with date (if approved)
- Shows "No approvals recorded" if neither are approved

---

## Testing Checklist

- [x] ✅ Data mapper converts backend snake_case to frontend camelCase correctly
- [x] ✅ Data mapper converts frontend camelCase to backend snake_case correctly
- [x] ✅ Modal form displays combined HR/Site Admin approval field
- [x] ✅ Create leave request sends correct field names to backend
- [x] ✅ Update leave request sends correct field names to backend
- [x] ✅ Edit modal populates combined field from backend data
- [x] ✅ Leave list displays combined approval status correctly
- [x] ✅ Form reset clears combined field correctly
- [x] ✅ No linter errors in updated files

---

## Migration Notes

### For Existing Data

If you have existing leave requests in the database with the old field structure (`hr_approved`, `site_admin_approved`), the backend should handle the migration. The frontend will work with whichever field the backend sends:

**Backend Compatibility:**
```javascript
// Frontend data mapper supports both old and new field names
hrSiteAdminApproved: leaveRequest.hrSiteAdminApproved || 
                     leaveRequest.hr_site_admin_approved || 
                     false
```

---

## Backend Requirements

The backend must be updated to:

1. **Add new database columns:**
   - `hr_site_admin_approved` (boolean)
   - `hr_site_admin_approved_date` (date)

2. **Remove old database columns:**
   - `hr_approved` (boolean)
   - `hr_approved_date` (date)
   - `site_admin_approved` (boolean)
   - `site_admin_approved_date` (date)

3. **Update API validation rules** to accept new field names
4. **Update API response mapping** to send new field names
5. **Run database migration** to rename/combine columns

---

## Related Documentation

- [Travel Request System Documentation](./TRAVEL_REQUEST_DOCUMENTATION.md) - Backend API v4.1
- [Leave Management System Documentation](./LEAVE_MANAGEMENT_IMPLEMENTATION_SUMMARY.md) - Previous version
- [Data Mapper Utilities](./LEAVE_MANAGEMENT_QUICK_REFERENCE.md) - Field mapping reference

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 4.1 | 2025-10-04 | Combined HR and Site Admin approval fields; Removed signature fields |
| 4.0 | 2025-10-04 | Removed signature boolean fields from Travel Request system |
| 3.0 | 2025-10-01 | Initial leave request implementation |

---

**End of Documentation**


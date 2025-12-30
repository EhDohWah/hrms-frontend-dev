# Reactive Permission Checks Pattern

## Overview
This document provides the standard pattern for implementing reactive permission checks in all list/module pages.

## Problem
Permission checks from `usePermissions()` composable in `setup()` are not always reactive in Options API components, causing buttons to not show/hide correctly when permissions change.

## Solution
Add computed properties in the Options API `computed` section that read directly from localStorage and fall back to setup() values.

---

## Implementation Pattern

### Step 1: Ensure `usePermissions` is imported and used in `setup()`

```javascript
import { usePermissions } from '@/composables/usePermissions';

export default {
  setup() {
    // Initialize permission checks for [MODULE_NAME] module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('[module_name]'); // e.g., 'employees', 'interviews', 'holidays'

    return {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    };
  },
  // ... rest of component
}
```

### Step 2: Add Reactive Computed Properties

Add these computed properties **before** any other computed properties (like `columns()`):

```javascript
computed: {
  // Permission checks - primary source for reactivity
  canEdit[ModuleName]() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasEdit = Array.isArray(permissions) && permissions.includes('[module_name].edit');
      // Also check if setup() computed is available
      return hasEdit || (this.canEdit?.value ?? false);
    } catch (e) {
      console.error('[[ModuleName]List] Error checking permissions:', e);
      return this.canEdit?.value ?? false;
    }
  },
  canRead[ModuleName]() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasRead = Array.isArray(permissions) && permissions.includes('[module_name].read');
      return hasRead || (this.canRead?.value ?? false);
    } catch (e) {
      return this.canRead?.value ?? false;
    }
  },
  isReadOnly[ModuleName]() {
    return this.canRead[ModuleName] && !this.canEdit[ModuleName];
  },
  // ... other computed properties
}
```

**Replace placeholders:**
- `[ModuleName]` → PascalCase module name (e.g., `Employees`, `Interviews`, `Holidays`, `Users`)
- `[module_name]` → snake_case/kebab-case permission name (e.g., `employees`, `interviews`, `holidays`, `users`)

### Step 3: Update Template to Use Computed Properties

#### Add Read-Only Badge (if not present)

```vue
<div class="d-flex align-items-center">
  <index-breadcrumb :title="title" :text="text" :text1="text1" />
  <!-- Read-Only Badge -->
  <span 
    v-if="isReadOnly[ModuleName]" 
    class="badge bg-warning text-dark ms-3 d-flex align-items-center"
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    title="You have view-only access to this module"
  >
    <i class="ti ti-eye me-1"></i> Read Only
  </span>
</div>
```

#### Update "Add" Button

```vue
<!-- Add [Module] Button - Only visible if user can edit -->
<div v-if="canEdit[ModuleName]" class="mb-2 me-2">
  <button class="btn btn-primary d-flex align-items-center" @click="openAdd[Module]Modal">
    <i class="ti ti-circle-plus me-2"></i>Add [Module]
  </button>
</div>
```

#### Update Action Buttons in Table

```vue
<template #bodyCell="{ column, record }">
  <template v-if="column.dataIndex === 'actions'">
    <div class="action-icon d-inline-flex">
      <!-- View - Always visible -->
      <router-link 
        :to="`/[module-path]/details/${record.id}`" 
        class="me-2"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="View Details"
      >
        <i class="ti ti-eye"></i>
      </router-link>
      
      <!-- Edit - Only visible if user can edit -->
      <a 
        v-if="canEdit[ModuleName]" 
        href="javascript:void(0);" 
        class="me-2" 
        @click="openEdit[Module]Modal(record)"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Edit"
      >
        <i class="ti ti-edit"></i>
      </a>
      
      <!-- Delete - Only visible if user can edit -->
      <a 
        v-if="canEdit[ModuleName]" 
        href="javascript:void(0);" 
        @click="delete[Module](record.id)"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Delete"
      >
        <i class="ti ti-trash"></i>
      </a>
    </div>
  </template>
</template>
```

#### Update Row Selection (if applicable)

```javascript
computed: {
  // ... permission computed properties ...
  
  rowSelection() {
    // Only show row selection if user has edit permission
    if (!this.canEdit[ModuleName]) {
      return null;
    }
    return {
      selectedRowKeys: this.selectedRowKeys,
      onChange: this.onSelectChange,
    };
  },
}
```

#### Update Bulk Action Buttons

```vue
<!-- Delete Selected Button - Only visible if user can edit -->
<div v-if="canEdit[ModuleName]" class="mb-2 me-2">
  <button 
    class="btn btn-danger d-flex align-items-center" 
    @click="confirmDeleteSelected"
    :class="{ 'disabled': selectedRowKeys.length === 0 }"
  >
    <i class="ti ti-trash me-2"></i>Delete Selected
  </button>
</div>
```

---

## Module-Specific Examples

### Example 1: Employees Module

**Permission name:** `employees`  
**Computed properties:** `canEditEmployees`, `canReadEmployees`, `isReadOnlyEmployees`

```javascript
computed: {
  canEditEmployees() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasEdit = Array.isArray(permissions) && permissions.includes('employees.edit');
      return hasEdit || (this.canEdit?.value ?? false);
    } catch (e) {
      console.error('[EmployeesList] Error checking permissions:', e);
      return this.canEdit?.value ?? false;
    }
  },
  canReadEmployees() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasRead = Array.isArray(permissions) && permissions.includes('employees.read');
      return hasRead || (this.canRead?.value ?? false);
    } catch (e) {
      return this.canRead?.value ?? false;
    }
  },
  isReadOnlyEmployees() {
    return this.canReadEmployees && !this.canEditEmployees;
  },
}
```

**Template usage:**
- `v-if="canEditEmployees"` for Add/Edit/Delete buttons
- `v-if="isReadOnlyEmployees"` for read-only badge

### Example 2: Interviews Module

**Permission name:** `interviews`  
**Computed properties:** `canEditInterviews`, `canReadInterviews`, `isReadOnlyInterviews`

```javascript
computed: {
  canEditInterviews() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasEdit = Array.isArray(permissions) && permissions.includes('interviews.edit');
      return hasEdit || (this.canEdit?.value ?? false);
    } catch (e) {
      console.error('[InterviewsList] Error checking permissions:', e);
      return this.canEdit?.value ?? false;
    }
  },
  canReadInterviews() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasRead = Array.isArray(permissions) && permissions.includes('interviews.read');
      return hasRead || (this.canRead?.value ?? false);
    } catch (e) {
      return this.canRead?.value ?? false;
    }
  },
  isReadOnlyInterviews() {
    return this.canReadInterviews && !this.canEditInterviews;
  },
}
```

### Example 3: User Management Module

**Permission name:** `users` (or `user_management`)  
**Computed properties:** `canEditUsers`, `canReadUsers`, `isReadOnlyUsers`

```javascript
computed: {
  canEditUsers() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasEdit = Array.isArray(permissions) && permissions.includes('users.edit');
      return hasEdit || (this.canEdit?.value ?? false);
    } catch (e) {
      console.error('[UsersList] Error checking permissions:', e);
      return this.canEdit?.value ?? false;
    }
  },
  canReadUsers() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasRead = Array.isArray(permissions) && permissions.includes('users.read');
      return hasRead || (this.canRead?.value ?? false);
    } catch (e) {
      return this.canRead?.value ?? false;
    }
  },
  isReadOnlyUsers() {
    return this.canReadUsers && !this.canEditUsers;
  },
}
```

---

## Module Permission Name Mapping

| Module Display Name | Permission Name | Computed Property Suffix |
|-------------------|----------------|------------------------|
| Employees | `employees` | `Employees` |
| Interviews | `interviews` | `Interviews` |
| Job Offers | `job_offers` | `JobOffers` |
| Holidays | `holidays` | `Holidays` |
| Attendance Admin | `attendance_admin` | `AttendanceAdmin` |
| Users | `users` | `Users` |
| Roles | `roles` | `Roles` |
| Departments | `departments` | `Departments` |
| Sites | `sites` | `Sites` |
| Positions | `positions` | `Positions` |
| Lookups | `lookups` | `Lookups` |
| Reports | `reports` | `Reports` |
| Assets | `assets` | `Assets` |
| Leaves | `leaves` | `Leaves` |
| Timesheets | `timesheets` | `Timesheets` |
| Overtime | `overtime` | `Overtime` |
| Training | `training` | `Training` |
| Resignation | `resignation` | `Resignation` |
| Promotion | `promotion` | `Promotion` |
| Termination | `termination` | `Termination` |
| Tickets | `tickets` | `Tickets` |
| Payroll | `payroll` | `Payroll` |

---

## Files Already Updated

✅ **Completed:**
1. `src/views/pages/recruitment/interviews/interviews-list.vue` - Interviews module
2. `src/views/pages/recruitment/job-offers/job-offers-list.vue` - Job Offers module
3. `src/views/pages/hrm/employees/employees-list.vue` - Employees module
4. `src/views/pages/hrm/holidays/holidays-list.vue` - Holidays module

---

## Files Pending Update

Based on the user's screenshot, the following modules need to be updated:

### HRM Modules
- [ ] `src/views/pages/hrm/attendance/attendance-admin.vue` - Attendance Admin
- [ ] `src/views/pages/hrm/attendance/timesheets-list.vue` - Timesheets
- [ ] `src/views/pages/hrm/attendance/overtime-list.vue` - Overtime
- [ ] `src/views/pages/hrm/resignation/resignation-list.vue` - Resignation
- [ ] `src/views/pages/hrm/promotion/promotion-list.vue` - Promotion
- [ ] `src/views/pages/hrm/termination/termination-list.vue` - Termination
- [ ] `src/views/pages/hrm/tickets/tickets-list.vue` - Tickets
- [ ] `src/views/pages/hrm/training/training-list.vue` - Training

### Administration Modules
- [ ] `src/views/pages/administration/user-management/user-list.vue` - Users
- [ ] `src/views/pages/administration/role-management/role-list.vue` - Roles
- [ ] `src/views/pages/administration/departments/department-list.vue` - Departments
- [ ] `src/views/pages/administration/sites/site-list.vue` - Sites
- [ ] `src/views/pages/administration/positions/position-list.vue` - Positions
- [ ] `src/views/pages/administration/lookups/lookup-list.vue` - Lookups
- [ ] `src/views/pages/administration/reports/report-list.vue` - Reports
- [ ] `src/views/pages/administration/assets/assets-list.vue` - Assets
- [ ] `src/views/pages/administration/section-departments/section-department-list.vue` - Section Departments
- [ ] `src/views/pages/administration/department-position/department-position-list.vue` - Department Positions
- [ ] `src/views/pages/administration/file-uploads/file-uploads-list.vue` - File Uploads
- [ ] `src/views/pages/administration/recycle-bin/recycle-bin-list.vue` - Recycle Bin

### Finance & Accounts Modules
- [ ] `src/views/pages/finance-accounts/payroll/benefit-settings-list.vue` - Payroll/Benefits

---

## Testing Checklist

After implementing the pattern for a module, test:

1. ✅ Login as user with **read-only** permission (e.g., `[module].read`)
   - [ ] "Add" button is **hidden**
   - [ ] "Edit" action button is **hidden**
   - [ ] "Delete" action button is **hidden**
   - [ ] "View" button is **visible**
   - [ ] Read-only badge is **visible**
   - [ ] Row selection checkboxes are **hidden** (if applicable)

2. ✅ Login as user with **edit** permission (e.g., `[module].edit`)
   - [ ] "Add" button is **visible**
   - [ ] "Edit" action button is **visible**
   - [ ] "Delete" action button is **visible**
   - [ ] "View" button is **visible**
   - [ ] Read-only badge is **hidden**
   - [ ] Row selection checkboxes are **visible** (if applicable)

3. ✅ Test **real-time updates**
   - [ ] Admin updates user permissions
   - [ ] Frontend receives WebSocket event
   - [ ] Buttons show/hide immediately without page refresh

---

## Common Mistakes to Avoid

1. ❌ **Don't use `canEdit` directly in template** - it's not reactive
   - ✅ Use `canEdit[ModuleName]` computed property instead

2. ❌ **Don't forget to add read-only badge**
   - ✅ Always add the badge with `v-if="isReadOnly[ModuleName]"`

3. ❌ **Don't hide "View" buttons**
   - ✅ View/Details buttons should always be visible for all users

4. ❌ **Don't forget row selection**
   - ✅ Update `rowSelection()` computed to check `canEdit[ModuleName]`

5. ❌ **Don't use wrong permission name**
   - ✅ Check the permission name in the backend/database
   - ✅ Use the module mapping table above

---

## Quick Copy-Paste Template

```javascript
// In setup()
import { usePermissions } from '@/composables/usePermissions';

setup() {
  const { canRead, canEdit, isReadOnly, accessLevelText, accessLevelBadgeClass } = usePermissions('[MODULE_NAME]');
  return { canRead, canEdit, isReadOnly, accessLevelText, accessLevelBadgeClass };
},

// In computed (add before other computed properties)
computed: {
  canEdit[ModuleName]() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasEdit = Array.isArray(permissions) && permissions.includes('[module_name].edit');
      return hasEdit || (this.canEdit?.value ?? false);
    } catch (e) {
      console.error('[[ModuleName]List] Error checking permissions:', e);
      return this.canEdit?.value ?? false;
    }
  },
  canRead[ModuleName]() {
    try {
      const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
      const hasRead = Array.isArray(permissions) && permissions.includes('[module_name].read');
      return hasRead || (this.canRead?.value ?? false);
    } catch (e) {
      return this.canRead?.value ?? false;
    }
  },
  isReadOnly[ModuleName]() {
    return this.canRead[ModuleName] && !this.canEdit[ModuleName];
  },
  // ... other computed properties
}
```

**Replace:**
- `[MODULE_NAME]` → permission name (e.g., `'employees'`, `'interviews'`)
- `[ModuleName]` → PascalCase (e.g., `Employees`, `Interviews`)
- `[module_name]` → lowercase permission (e.g., `employees`, `interviews`)

---

## Summary

This pattern ensures:
- ✅ **Reactive permission checks** that update when permissions change
- ✅ **Consistent UI/UX** across all modules
- ✅ **Real-time updates** via WebSocket integration
- ✅ **Fallback to setup()** values if localStorage fails
- ✅ **Error handling** with console logging for debugging

Apply this pattern to all list/module pages for complete permission-based UI control.


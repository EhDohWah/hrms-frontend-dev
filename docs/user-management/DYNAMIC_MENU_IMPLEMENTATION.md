# Dynamic Permission-Based Menu System - Implementation Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [What Was Implemented](#what-was-implemented)
3. [How It Works](#how-it-works)
4. [Files Created/Modified](#files-createdmodified)
5. [Configuration Guide](#configuration-guide)
6. [Usage Examples](#usage-examples)
7. [Visual Indicators](#visual-indicators)
8. [Testing the Implementation](#testing-the-implementation)
9. [Migration from Role-Based System](#migration-from-role-based-system)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This implementation converts the HRMS frontend menu system from **hardcoded role-based filtering** to **dynamic permission-based filtering**.

### Key Features

✅ **Real-time Menu Updates**: Menus update automatically when admin/HR manager changes user permissions
✅ **Permission-Based Visibility**: Menus show/hide based on actual permissions, not roles
✅ **Visual Access Indicators**: Eye icon (👁️) for read-only, Edit icon (✏️) for full access
✅ **Flexible Permission System**: Supports read-only and full CRUD access levels
✅ **Event-Driven Architecture**: Uses CustomEvent API for real-time updates
✅ **Reusable Composables**: Easy-to-use Vue 3 composable for permission checks

### Previous System (Role-Based)

```javascript
// ❌ OLD: Hardcoded role-to-menu mapping
const ROLE_MENU_MAP = {
  'admin': ['Dashboard', 'User Management', 'Grants', ...],
  'hr-manager': ['Dashboard', 'Employees', ...],
  // Fixed menus per role - no flexibility
};
```

### New System (Permission-Based)

```javascript
// ✅ NEW: Flexible permission-based mapping
const MENU_PERMISSION_MAP = {
  'User Management': {
    readPermission: 'user.read',          // Can VIEW menu
    writePermissions: ['user.create', 'user.update', 'user.delete']  // Can CRUD
  }
};
```

---

## What Was Implemented

### 1. Permission-to-Menu Mapping System

**File**: `src/config/menu-permission-map.js`

- Maps 60+ menu items to required permissions
- Defines read permissions (viewing) and write permissions (CRUD)
- Includes all menus: Dashboard, User Management, Grants, Recruitment, Employee, Employment, Payroll, Attendance, Training, Reports, Leaves, Travel, Tax, Lookups, Organization Structure, etc.

### 2. Enhanced Menu Service

**File**: `src/services/menu.service.js`

**New Methods**:
- `hasPermission(permission)` - Check single permission
- `hasAnyPermission(permissions)` - Check if user has ANY permission
- `hasAllPermissions(permissions)` - Check if user has ALL permissions
- `hasPermissionPattern(pattern)` - Wildcard support (e.g., `user.*`)
- `canViewMenu(menuValue)` - Check if menu should be visible
- `canEditMenu(menuValue)` - Check if user can perform CRUD
- `getMenuAccessLevel(menuValue)` - Returns `'none'|'read'|'write'`
- `filterSidebarData(data)` - Filter menus based on permissions
- `canPerformAction(module, action)` - Check `module.action` permission
- `getModulePermissions(module)` - Get all permissions for a module

**Features**:
- Adds metadata to filtered menus: `accessLevel`, `canEdit`, `isReadOnly`, `showBadge`
- Filters nested submenus recursively
- Deprecated old role-based methods with console warnings

### 3. Real-Time Permission Updates

**File**: `src/stores/authStore.js`

**New Method**:
```javascript
emitPermissionsUpdated() {
  const event = new CustomEvent('permissions-updated', {
    detail: {
      permissions: this.permissions,
      timestamp: Date.now()
    }
  });
  window.dispatchEvent(event);
}
```

**Integration Points**:
- Called in `setAuthData()` - When user logs in
- Called in `updateUserData()` - When permissions are refreshed
- Triggers menu refresh without page reload

### 4. Dynamic Sidebar with Visual Indicators

**File**: `src/views/layouts/sidebar-menu.vue`

**New Features**:
- Event listener for `permissions-updated` event
- Automatic menu refresh when permissions change
- Visual badges on all menu levels (main menus, submenus, nested submenus)

**Visual Indicators**:
```vue
<!-- Read-only access (blue eye icon) -->
<span v-if="menu.isReadOnly" class="badge badge-soft-info ms-1" title="Read Only Access">
  <i class="ti ti-eye"></i>
</span>

<!-- Full access (green edit icon) -->
<span v-if="menu.canEdit" class="badge badge-soft-success ms-1" title="Full Access">
  <i class="ti ti-pencil"></i>
</span>
```

### 5. Reusable Permission Composable

**File**: `src/composables/usePermissions.js`

**Usage**:
```javascript
import { usePermissions } from '@/composables/usePermissions';

export default {
  setup() {
    const { canCreate, canEdit, canDelete } = usePermissions('employee');

    return {
      canCreate,  // Computed: employee.create permission
      canEdit,    // Computed: employee.update permission
      canDelete   // Computed: employee.delete permission
    };
  }
};
```

**Helper Functions**:
- `can(permission)` - Simple permission check
- `canPerform(module, action)` - Check module.action
- `canAccessRoute(permissions, requireAll)` - Route guard helper

---

## How It Works

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Admin/HR Manager                          │
│              Updates User Permissions via API                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Laravel API)                         │
│         Returns updated user permissions in response             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    authStore.updateUserData()                    │
│    1. Fetches latest user data from API                         │
│    2. Updates permissions in store & localStorage                │
│    3. Emits 'permissions-updated' event                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              sidebar-menu.vue Event Listener                     │
│    1. Listens for 'permissions-updated' event                   │
│    2. Calls menuService.filterSidebarData()                     │
│    3. Re-renders sidebar with new filtered menus                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    menuService.filterSidebarData()               │
│    1. Gets permissions from localStorage                         │
│    2. Checks each menu against menu-permission-map.js           │
│    3. Filters menus based on permissions                        │
│    4. Adds metadata: accessLevel, canEdit, isReadOnly, showBadge│
│    5. Returns filtered sidebar data with visual indicators      │
└─────────────────────────────────────────────────────────────────┘
```

### Permission Check Flow

```javascript
// Example: Checking "User Management" menu visibility

1. User has permissions: ['user.read', 'user.update']

2. Menu config from menu-permission-map.js:
   {
     'User Management': {
       readPermission: 'user.read',
       writePermissions: ['user.create', 'user.update', 'user.delete']
     }
   }

3. menuService.canViewMenu('User Management'):
   ✅ Has 'user.read' → Menu is VISIBLE

4. menuService.canEditMenu('User Management'):
   ✅ Has 'user.update' (one of write permissions) → canEdit = true

5. menuService.getMenuAccessLevel('User Management'):
   Returns: 'write' → Shows EDIT icon (green badge)

6. Result in sidebar:
   [📊 User Management ✏️]  ← Green edit icon badge
```

### Access Levels Explained

| Access Level | Description | User Has | Icon | Badge Color | CRUD Buttons Visible |
|-------------|-------------|----------|------|-------------|---------------------|
| **none** | No access | Neither read nor write permissions | N/A | N/A | Menu hidden |
| **read** | View only | Read permission ONLY (no write permissions) | 👁️ Eye | Blue (`badge-soft-info`) | ❌ No (buttons hidden) |
| **write** | Full access | Read permission AND at least one write permission | ✏️ Edit | Green (`badge-soft-success`) | ✅ Yes (buttons visible) |

---

## Files Created/Modified

### Created Files

| File | Purpose |
|------|---------|
| `src/config/menu-permission-map.js` | Maps all menus to required permissions |
| `src/composables/usePermissions.js` | Reusable permission check composable |
| `DYNAMIC_MENU_IMPLEMENTATION.md` | This documentation file |

### Modified Files

| File | Changes |
|------|---------|
| `src/services/menu.service.js` | Added permission-based filtering logic, deprecated role-based methods |
| `src/stores/authStore.js` | Added `emitPermissionsUpdated()` method, integrated with `setAuthData()` and `updateUserData()` |
| `src/views/layouts/sidebar-menu.vue` | Added event listener, visual indicators (badges), and `handlePermissionsUpdated()` method |

### Deprecated Files

| File | Status | Replacement |
|------|--------|-------------|
| `src/config/role-menu.config.js` | ⚠️ Deprecated (still exists but not used) | `src/config/menu-permission-map.js` |

---

## Configuration Guide

### Adding a New Menu

**Step 1**: Add menu to `menu-permission-map.js`

```javascript
export const MENU_PERMISSION_MAP = {
  // ... existing menus

  'New Feature': {
    readPermission: 'new_feature.read',  // Required to VIEW menu
    writePermissions: [                   // Required for CRUD (at least one)
      'new_feature.create',
      'new_feature.update',
      'new_feature.delete'
    ]
  }
};
```

**Step 2**: Add menu to `sidebar-data.json`

```json
{
  "tittle": "Main",
  "menu": [
    {
      "menuValue": "New Feature",
      "icon": "star",
      "route": "/new-feature",
      "hasSubRoute": false
    }
  ]
}
```

**Step 3**: Ensure backend has corresponding permissions

```php
// In Laravel seeder or migration
Permission::create(['name' => 'new_feature.read']);
Permission::create(['name' => 'new_feature.create']);
Permission::create(['name' => 'new_feature.update']);
Permission::create(['name' => 'new_feature.delete']);
```

### Permission Naming Convention

Format: `{module}.{action}`

**Modules**: `user`, `employee`, `grant`, `payroll`, `leave_request`, `travel_request`, `training`, `admin`, etc.

**Actions**:
- `create` - Create new records
- `read` - View/read records
- `update` - Edit existing records
- `delete` - Delete records
- `import` - Import data
- `export` - Export data
- `bulk_create` - Bulk operations

**Examples**:
- `employee.read` - Can view employees
- `payroll.create` - Can create payroll
- `grant.export` - Can export grants
- `user.delete` - Can delete users

---

## Usage Examples

### Example 1: Check Permission in Component (Composition API)

```vue
<template>
  <div>
    <button v-if="canCreate.value" @click="createEmployee">
      Create Employee
    </button>
    <button v-if="canUpdate.value" @click="editEmployee">
      Edit Employee
    </button>
    <button v-if="canDelete.value" @click="deleteEmployee">
      Delete Employee
    </button>
  </div>
</template>

<script>
import { usePermissions } from '@/composables/usePermissions';

export default {
  name: 'EmployeeActions',
  setup() {
    const { canCreate, canUpdate, canDelete } = usePermissions('employee');

    const createEmployee = () => {
      console.log('Creating employee...');
    };

    const editEmployee = () => {
      console.log('Editing employee...');
    };

    const deleteEmployee = () => {
      console.log('Deleting employee...');
    };

    return {
      canCreate,
      canUpdate,
      canDelete,
      createEmployee,
      editEmployee,
      deleteEmployee
    };
  }
};
</script>
```

### Example 2: Check Permission in Component (Options API)

```vue
<template>
  <div>
    <button v-if="can('employee.create')" @click="createEmployee">
      Create Employee
    </button>
  </div>
</template>

<script>
import { can } from '@/composables/usePermissions';

export default {
  name: 'EmployeeActions',
  methods: {
    can,
    createEmployee() {
      console.log('Creating employee...');
    }
  }
};
</script>
```

### Example 3: Multiple Permission Checks

```vue
<template>
  <div>
    <!-- Show if user has employee.read OR employee.update -->
    <button v-if="hasAnyPermission(['employee.read', 'employee.update'])">
      View Employee
    </button>

    <!-- Show only if user has ALL permissions -->
    <button v-if="hasAllPermissions(['employee.create', 'employee.update', 'employee.delete'])">
      Full Employee Management
    </button>
  </div>
</template>

<script>
import { usePermissions } from '@/composables/usePermissions';

export default {
  setup() {
    const { hasAnyPermission, hasAllPermissions } = usePermissions();

    return {
      hasAnyPermission,
      hasAllPermissions
    };
  }
};
</script>
```

### Example 4: Menu Access Level Check

```vue
<template>
  <div>
    <div v-if="menuAccessLevel === 'write'">
      <!-- Show CRUD buttons -->
      <button @click="create">Create</button>
      <button @click="edit">Edit</button>
      <button @click="delete">Delete</button>
    </div>
    <div v-else-if="menuAccessLevel === 'read'">
      <!-- Read-only view -->
      <p>You have read-only access to this page</p>
    </div>
    <div v-else>
      <!-- No access -->
      <p>You don't have access to this page</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { usePermissions } from '@/composables/usePermissions';

export default {
  setup() {
    const { getMenuAccessLevel } = usePermissions();
    const menuAccessLevel = ref('none');

    onMounted(() => {
      menuAccessLevel.value = getMenuAccessLevel('User Management');
    });

    return {
      menuAccessLevel
    };
  }
};
</script>
```

### Example 5: Route Guard with Permissions

```javascript
// router/index.js
import { canAccessRoute } from '@/composables/usePermissions';

const routes = [
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/users/UserList.vue'),
    beforeEnter: (to, from, next) => {
      if (canAccessRoute('user.read')) {
        next();
      } else {
        next('/unauthorized');
      }
    }
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('@/views/employees/EmployeeList.vue'),
    beforeEnter: (to, from, next) => {
      // Require ALL permissions
      if (canAccessRoute(['employee.read', 'employee.create'], true)) {
        next();
      } else {
        next('/unauthorized');
      }
    }
  }
];
```

---

## Visual Indicators

### Badge Appearance

**Read-Only Access (Eye Icon)**:
```html
<span class="badge badge-soft-info ms-1" title="Read Only Access">
  <i class="ti ti-eye"></i>
</span>
```
- **Color**: Light blue (`badge-soft-info`)
- **Icon**: Eye icon (`ti-eye`)
- **Tooltip**: "Read Only Access"
- **Meaning**: User can view this page but cannot perform CRUD operations

**Full Access (Edit Icon)**:
```html
<span class="badge badge-soft-success ms-1" title="Full Access">
  <i class="ti ti-pencil"></i>
</span>
```
- **Color**: Light green (`badge-soft-success`)
- **Icon**: Pencil/Edit icon (`ti-pencil`)
- **Tooltip**: "Full Access"
- **Meaning**: User can perform CRUD operations (Create, Read, Update, Delete)

### Where Badges Appear

Badges are shown on:
- ✅ Main menu items
- ✅ First-level submenus
- ✅ Second-level submenus (nested)
- ❌ Dashboard menu (always accessible, no badge needed)

---

## Testing the Implementation

### Test Case 1: Login with Different Roles

**Objective**: Verify menus filter based on permissions

**Steps**:
1. Login as Admin (`admin@hrms.com` / `password`)
2. Verify all menus are visible with green edit badges
3. Logout
4. Login as Site Admin (`siteadmin@hrms.com` / `password`)
5. Verify limited menus are visible
6. Check badges match permission levels

**Expected Result**: Each role sees different menus based on their permissions

### Test Case 2: Real-Time Permission Update

**Objective**: Verify menus update without page reload

**Steps**:
1. Open two browser windows
2. Window 1: Login as regular user (e.g., HR Assistant)
3. Window 2: Login as Admin
4. In Window 2: Go to User Management → Edit the HR Assistant user → Update permissions
5. In Window 1: Observe sidebar (DO NOT refresh page)

**Expected Result**: Window 1 sidebar should update automatically with new permissions and badges

**How to Verify**:
- Open browser console in Window 1
- Look for log: `[SidebarMenu] Permissions updated, refreshing menu...`
- Verify new menus appear/disappear based on permission changes

### Test Case 3: Permission-Based CRUD Button Visibility

**Objective**: Verify CRUD buttons respect permissions

**Setup**:
1. Create a test user with only `employee.read` permission (no write permissions)
2. Login as that user
3. Navigate to Employee List page

**Expected Result**:
- ✅ Employee menu should be visible
- ✅ Should show blue eye badge (read-only)
- ❌ "Add Employee" button should be HIDDEN
- ❌ "Edit" button should be HIDDEN
- ❌ "Delete" button should be HIDDEN
- ✅ View/Details button should be VISIBLE

### Test Case 4: Submenu Filtering

**Objective**: Verify nested submenus filter correctly

**Steps**:
1. Create a user with permission: `grant.read` but NOT `grant.create`
2. Login as that user
3. Navigate to Grants menu

**Expected Result**:
- ✅ Grants menu should be visible
- ✅ "Grants List" submenu should be visible with blue eye badge
- ✅ "Grant Position" submenu should be visible with blue eye badge
- ❌ Create/Edit/Delete buttons should be HIDDEN

### Test Case 5: Wildcard Permission Support

**Objective**: Verify wildcard patterns work

**Test Code**:
```javascript
// In browser console
import { menuService } from '@/services/menu.service';

// Assume user has permissions: ['employee.create', 'employee.read', 'employee.update']

console.log(menuService.hasPermissionPattern('employee.*'));  // Should be true
console.log(menuService.hasPermissionPattern('user.*'));      // Should be false
```

**Expected Result**: Wildcard patterns should match correctly

---

## Migration from Role-Based System

### What Needs to Change

#### 1. Remove Role-Based Checks in Components

**Before** (Role-Based):
```javascript
// ❌ DON'T USE THIS ANYMORE
if (this.userRole === 'admin' || this.userRole === 'hr-manager') {
  // Show button
}
```

**After** (Permission-Based):
```javascript
// ✅ USE THIS INSTEAD
import { can } from '@/composables/usePermissions';

if (can('user.create')) {
  // Show button
}
```

#### 2. Update Route Guards

**Before**:
```javascript
beforeEnter: (to, from, next) => {
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'admin') {
    next();
  } else {
    next('/unauthorized');
  }
}
```

**After**:
```javascript
import { canAccessRoute } from '@/composables/usePermissions';

beforeEnter: (to, from, next) => {
  if (canAccessRoute('user.read')) {
    next();
  } else {
    next('/unauthorized');
  }
}
```

#### 3. Update Conditional Rendering

**Before**:
```vue
<button v-if="isAdmin || isHRManager">Create User</button>
```

**After**:
```vue
<button v-if="can('user.create')">Create User</button>
```

### Backward Compatibility

The old role-based methods in `menuService` are **deprecated but still functional**:

```javascript
// These methods still work but will log deprecation warnings
menuService.hasRole('admin');           // ⚠️ Deprecated
menuService.hasAnyRole(['admin', 'hr-manager']);  // ⚠️ Deprecated
menuService.isMenuAllowed('User Management');     // ⚠️ Deprecated
```

**Console Warning Example**:
```
[MenuService] hasRole is deprecated. Use permission-based checks instead.
```

### Migration Checklist

- [ ] Replace all `hasRole()` calls with `hasPermission()` or `can()`
- [ ] Replace all `isMenuAllowed()` calls with `canViewMenu()`
- [ ] Update route guards to use `canAccessRoute()`
- [ ] Update CRUD button visibility to use permission checks
- [ ] Remove direct `userRole` comparisons
- [ ] Test all affected components
- [ ] Update custom components to use `usePermissions` composable
- [ ] Remove `role-menu.config.js` imports (if any)

---

## Troubleshooting

### Issue 1: Menu Not Updating After Permission Change

**Symptoms**: Admin updates user permissions, but menu doesn't refresh in user's browser

**Possible Causes**:
1. Event listener not registered
2. `updateUserData()` not being called
3. Permission change not persisted to backend

**Debug Steps**:
```javascript
// In user's browser console:

// 1. Check if event listener is registered
console.log('Event listener registered:',
  !!window.addEventListener.toString().includes('permissions-updated'));

// 2. Check current permissions
import { menuService } from '@/services/menu.service';
console.log('Current permissions:', menuService.getUserPermissions());

// 3. Manually trigger menu refresh
const event = new CustomEvent('permissions-updated', {
  detail: { permissions: [], timestamp: Date.now() }
});
window.dispatchEvent(event);
```

**Solution**:
- Ensure `authStore.updateUserData()` is called after permission changes
- Check browser console for `[AuthStore] Permissions updated event emitted` log
- Verify `sidebar-menu.vue` has `mounted()` and `beforeUnmount()` hooks

### Issue 2: Menu Shows but CRUD Buttons Missing

**Symptoms**: User sees a menu with eye badge, but CRUD buttons are hidden (correct behavior)

**Explanation**: This is **expected behavior** when user has `read` permission but NO `write` permissions

**Verify**:
```javascript
// In browser console
import { menuService } from '@/services/menu.service';

console.log('Can view User Management:', menuService.canViewMenu('User Management'));
console.log('Can edit User Management:', menuService.canEditMenu('User Management'));
console.log('Access level:', menuService.getMenuAccessLevel('User Management'));
```

**Expected Output**:
```
Can view User Management: true
Can edit User Management: false
Access level: read
```

**Solution**: If user should have CRUD access, admin needs to grant write permissions (`user.create`, `user.update`, `user.delete`)

### Issue 3: Menu Not Showing at All

**Symptoms**: Menu item doesn't appear in sidebar

**Possible Causes**:
1. User doesn't have `readPermission` for that menu
2. Menu not configured in `menu-permission-map.js`
3. Menu filtered out by `filterSidebarData()`

**Debug Steps**:
```javascript
// In browser console
import { menuService } from '@/services/menu.service';
import { MENU_PERMISSION_MAP, getMenuPermissionConfig } from '@/config/menu-permission-map';

// 1. Check if menu is configured
console.log('Menu config:', getMenuPermissionConfig('User Management'));

// 2. Check if user can view menu
console.log('Can view:', menuService.canViewMenu('User Management'));

// 3. Check user's permissions
console.log('User permissions:', menuService.getUserPermissions());
```

**Solution**:
- Ensure menu exists in `menu-permission-map.js`
- Ensure user has the required `readPermission`
- Check backend to verify permission was assigned correctly

### Issue 4: Badge Not Showing

**Symptoms**: Menu appears but no eye/edit badge

**Possible Causes**:
1. `showBadge` metadata not set correctly
2. Dashboard menu (Dashboard doesn't show badges by design)
3. CSS class missing

**Debug Steps**:
```javascript
// In Vue DevTools or browser console
// Inspect the menu item object
console.log(this.sideBarData[0].menu[0]);
// Should show:
// {
//   menuValue: 'User Management',
//   accessLevel: 'write',
//   canEdit: true,
//   isReadOnly: false,
//   showBadge: true
// }
```

**Solution**:
- Verify `menu.showBadge === true` in filtered data
- Check if menu is Dashboard (Dashboard intentionally has `showBadge: false`)
- Verify Bootstrap classes are loaded (`badge`, `badge-soft-info`, `badge-soft-success`)

### Issue 5: "No permission configuration" Warning

**Symptoms**: Console shows `[MenuService] No permission configuration for menu: "X"`

**Cause**: Menu exists in `sidebar-data.json` but not in `menu-permission-map.js`

**Solution**:
Add the missing menu to `menu-permission-map.js`:

```javascript
export const MENU_PERMISSION_MAP = {
  // ... existing menus

  'Your Menu Name': {
    readPermission: 'module.read',
    writePermissions: ['module.create', 'module.update', 'module.delete']
  }
};
```

### Issue 6: Permission Denied on Route Navigation

**Symptoms**: User can see menu but gets "Access Denied" when clicking

**Cause**: Route guard has different permission requirements than menu

**Solution**: Ensure route guard and menu permission configuration match:

```javascript
// menu-permission-map.js
'User Management': {
  readPermission: 'user.read',  // ← Should match route guard
  writePermissions: ['user.create', 'user.update', 'user.delete']
}

// router/index.js
{
  path: '/users',
  beforeEnter: (to, from, next) => {
    if (canAccessRoute('user.read')) {  // ← Should match menu config
      next();
    } else {
      next('/unauthorized');
    }
  }
}
```

---

## Best Practices

### 1. Permission Naming

✅ **DO**:
- Use lowercase with underscores: `leave_request.create`
- Follow module.action format: `employee.read`
- Be specific: `payroll.export` instead of `payroll.download`

❌ **DON'T**:
- Use camelCase: `leaveRequest.create`
- Use spaces: `leave request.create`
- Use generic names: `payroll.access`

### 2. Menu Configuration

✅ **DO**:
- Always define `readPermission` for menu visibility
- Use arrays for `writePermissions` even if only one permission
- Group related permissions logically

❌ **DON'T**:
- Leave `readPermission` as `null` for restricted menus
- Mix read and write permissions in the same array

### 3. Component Permission Checks

✅ **DO**:
- Use composable for reactive permission checks
- Cache permission checks in computed properties
- Use v-if for conditional rendering

❌ **DON'T**:
- Call `menuService` methods directly in templates
- Use v-show for permission-based hiding (use v-if instead)
- Perform permission checks in loops (pre-compute outside loop)

### 4. Testing

✅ **DO**:
- Test with multiple role/permission combinations
- Test permission update scenarios
- Test edge cases (no permissions, partial permissions)
- Check browser console for warnings/errors

❌ **DON'T**:
- Test only with admin role
- Assume permissions work without testing

---

## Performance Considerations

### Optimizations Implemented

1. **Cached Permission Checks**: Permissions are stored in localStorage to avoid repeated API calls
2. **Event-Driven Updates**: Only updates when permissions actually change, not on every route navigation
3. **Computed Properties**: Vue 3 computed properties cache results until dependencies change
4. **Deep Clone Only When Needed**: Sidebar data is deep cloned only during filtering, not on every render

### Performance Tips

- **Minimize Permission Checks in Loops**: Pre-compute permission checks outside loops
- **Use Computed Properties**: Cache permission results in computed properties
- **Avoid Unnecessary Re-Filtering**: Menu only re-filters on permission update events, not on route changes

---

## Future Enhancements

### Potential Improvements

1. **Permission Groups**: Group related permissions (e.g., `employee_full_access` = all employee permissions)
2. **Conditional Permissions**: Support complex conditions (e.g., "can edit own records only")
3. **Permission Caching Service**: Dedicated service for caching and invalidating permission checks
4. **Admin UI for Permission Testing**: Visual tool to preview menu as different users
5. **Audit Logging**: Track when permissions are checked and by whom
6. **Permission Preloading**: Prefetch permissions for better performance

---

## Support & Maintenance

### Logging

The system includes comprehensive logging for debugging:

```javascript
// Console logs to watch for:
[MenuService] No permission configuration for menu: "X"  // Missing menu config
[MenuService] User has no permissions, showing empty sidebar  // No permissions loaded
[AuthStore] Permissions updated event emitted: [...]  // Permission update event
[SidebarMenu] Permissions updated, refreshing menu...  // Menu refresh triggered
```

### Documentation Updates

When adding new features, update:
1. This implementation guide
2. `menu-permission-map.js` inline comments
3. `menu.service.js` JSDoc comments
4. `usePermissions.js` usage examples

---

## Conclusion

The dynamic permission-based menu system provides:

✅ **Flexibility**: Menus adapt to individual user permissions, not just roles
✅ **Real-Time Updates**: No page refresh needed when permissions change
✅ **Visual Clarity**: Clear badges show access levels at a glance
✅ **Developer-Friendly**: Easy-to-use composables and clear APIs
✅ **Scalability**: Easy to add new menus and permissions
✅ **Maintainability**: Centralized configuration in `menu-permission-map.js`

### Quick Start Summary

1. **Configuration**: Add menus to `menu-permission-map.js`
2. **Usage**: Use `usePermissions` composable in components
3. **Testing**: Verify with different roles and permission combinations
4. **Maintenance**: Update `menu-permission-map.js` when adding new features

---

**Last Updated**: 2025-12-18
**Version**: 1.0
**Maintained by**: HRMS Development Team

---

**Happy Coding! 🚀**

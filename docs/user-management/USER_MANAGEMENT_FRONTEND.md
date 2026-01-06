# User Management - Frontend Documentation

## Overview

The User Management system in the HRMS frontend provides a comprehensive interface for managing users, their roles, permissions, and profile information. The system is built with Vue.js 3, Pinia for state management, and integrates with the backend API for all operations.

## Table of Contents

1. [Architecture](#architecture)
2. [Components](#components)
3. [State Management](#state-management)
4. [Services](#services)
5. [User Interface](#user-interface)
6. [API Integration](#api-integration)
7. [Permissions & Roles](#permissions--roles)
8. [Form Handling](#form-handling)
9. [Error Handling](#error-handling)

## Architecture

### Key Components

- **User List Page** (`src/views/pages/administration/user-management/user-list.vue`): Main user listing page
- **User Management Page** (`src/views/pages/administration/user-management/user-management.vue`): Router wrapper
- **User List Modal** (`src/components/modal/user-list-modal.vue`): Modal for creating/editing users
- **Admin Store** (`src/stores/adminStore.js`): Pinia store for user state management
- **Admin Service** (`src/services/admin.service.js`): API service layer

### Technology Stack

- **Vue.js 3**: Frontend framework
- **Pinia**: State management
- **Ant Design Vue**: UI component library (for tables)
- **Bootstrap 5**: UI framework (for modals and styling)
- **Axios**: HTTP client (via apiService)

## Components

### User List Page

**Location**: `src/views/pages/administration/user-management/user-list.vue`

Main component for displaying and managing users.

#### Features

- **User Table**: Displays users with sorting and filtering
- **Add User Button**: Opens modal to create new users
- **Edit User**: Opens modal to edit existing users
- **Delete User**: Confirms and deletes users
- **Filtering**: Filter by name, role, and status
- **Sorting**: Sort by name, email, created date, role, and status
- **Export Options**: PDF and Excel export (UI ready)

#### Data Structure

```javascript
data: {
    title: "Users",
    text: "Administration",
    text1: "Users",
    data: [], // Array of user objects
    rowSelection: {}, // For table row selection
    filteredInfo: null, // Current filter state
    sortedInfo: null, // Current sort state
    loading: false, // Loading state
    adminStore: null, // Pinia store instance
}
```

#### Methods

##### `fetchUsers()`

Fetches all users from the API and updates the table data.

```javascript
async fetchUsers() {
    this.loading = true;
    try {
        await this.adminStore.fetchUsers();
        this.data = this.adminStore.users.map(user => ({
            key: user.id.toString(),
            id: user.id,
            name: user.name || 'Unknown',
            email: user.email || '',
            roles: user.roles || [],
            status: user.status || 'inactive',
            created_at: user.created_at,
            profile_picture: user.profile_picture || null,
            permissions: user.permissions || []
        }));
    } catch (error) {
        this.$message.error('Failed to load users');
    } finally {
        this.loading = false;
    }
}
```

##### `editUser(record)`

Opens the edit modal with user data.

```javascript
editUser(record) {
    this.$refs.userListModal.setEditUser(record);
}
```

##### `confirmDeleteUser(userId)`

Opens delete confirmation modal.

```javascript
confirmDeleteUser(userId) {
    this.$refs.userListModal.confirmDelete(userId);
}
```

#### Table Columns

The table displays the following columns:

1. **Name**: User's name with profile picture avatar
2. **Email**: User's email address
3. **Created Date**: User creation date (formatted as DD MMM YYYY)
4. **Role**: User's role with color-coded badges
   - Admin: Red badge
   - HR Manager: Blue badge
   - HR Assistant: Yellow badge
   - Employee: Green badge
5. **Status**: Active/Inactive status with indicator
6. **Action**: Edit and Delete buttons

### User List Modal

**Location**: `src/components/modal/user-list-modal.vue`

Modal component for creating and editing users.

#### Features

- **Add User Form**: Complete form for creating new users
- **Edit User Form**: Form for updating existing users
- **Delete Confirmation**: Confirmation dialog for user deletion
- **Permission Management**: Checkbox grid for managing permissions
- **Role Selection**: Dropdown for selecting user roles
- **Profile Picture Upload**: File input for profile pictures
- **Password Management**: Password fields with show/hide toggle

#### Data Structure

```javascript
data: {
    adminStore: null,
    loading: false,
    showNewPassword: false,
    showNewConfirmPassword: false,
    showEditPassword: false,
    showEditConfirmPassword: false,
    alertMessage: '',
    alertClass: '',
    userToDelete: null,
    roles: ["admin", "hr-manager", "hr-assistant", "employee"],
    modules: {
        admin: ['create', 'read', 'update', 'delete', 'import', 'export'],
        user: ['create', 'read', 'update', 'delete', 'import', 'export'],
        // ... more modules
    },
    rolePermissions: {
        'admin': [], // All permissions
        'hr-manager': [], // All permissions
        'hr-assistant': [], // All permissions
        'employee': [
            'user.read',
            'user.update',
            'attendance.create',
            // ... more permissions
        ]
    },
    newUser: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        permissions: [],
        profile_picture: null
    },
    editUser: {
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        permissions: [],
        profile_picture: null
    }
}
```

#### Methods

##### `submitNewUser()`

Creates a new user.

```javascript
async submitNewUser() {
    try {
        this.loading = true;
        const formData = new FormData();
        formData.append('name', this.newUser.name);
        formData.append('email', this.newUser.email);
        formData.append('password', this.newUser.password);
        formData.append('password_confirmation', this.newUser.password_confirmation);
        formData.append('role', this.newUser.role);
        
        // Add permissions
        this.newUser.permissions.forEach(permission => {
            formData.append('permissions[]', permission);
        });
        
        // Add profile picture if exists
        if (this.newUser.profile_picture) {
            formData.append('profile_picture', this.newUser.profile_picture);
        }
        
        const response = await this.adminStore.createUser(formData);
        
        if (response && response.success) {
            this.resetNewUserForm();
            // Close modal
            this.$emit('user-added');
            this.showAlert('User created successfully', 'success');
        }
    } catch (error) {
        this.showAlert(error.message || 'Failed to create user', 'danger');
    } finally {
        this.loading = false;
    }
}
```

##### `updateExistingUser()`

Updates an existing user.

```javascript
async updateExistingUser() {
    try {
        this.loading = true;
        const formData = new FormData();
        formData.append('name', this.editUser.name);
        formData.append('email', this.editUser.email);
        
        // Only include password if provided
        if (this.editUser.password) {
            formData.append('password', this.editUser.password);
            formData.append('password_confirmation', this.editUser.password_confirmation);
        }
        
        formData.append('role', this.editUser.role);
        
        // Add permissions
        this.editUser.permissions.forEach(permission => {
            formData.append('permissions[]', permission);
        });
        
        // Add profile picture if exists
        if (this.editUser.profile_picture instanceof File) {
            formData.append('profile_picture', this.editUser.profile_picture);
        }
        
        const response = await this.adminStore.updateUser(this.editUser.id, formData);
        
        if (response && response.success) {
            this.$emit('user-updated');
            this.showAlert('User updated successfully', 'success');
        }
    } catch (error) {
        this.showAlert(error.message || 'Failed to update user', 'danger');
    } finally {
        this.loading = false;
    }
}
```

##### `deleteUser()`

Deletes a user.

```javascript
async deleteUser() {
    try {
        this.loading = true;
        const response = await this.adminStore.deleteUser(this.userToDelete);
        
        if (response && response.success) {
            this.$emit('user-deleted');
            this.showAlert('User deleted successfully', 'success');
            this.userToDelete = null;
        }
    } catch (error) {
        this.showAlert(error.message || 'Failed to delete user', 'danger');
    } finally {
        this.loading = false;
    }
}
```

##### `updatePermissionsByRole(role)`

Updates permissions based on selected role.

```javascript
updatePermissionsByRole(role) {
    if (role && this.rolePermissions[role]) {
        this.newUser.permissions = [...this.rolePermissions[role]];
    } else {
        this.newUser.permissions = [];
    }
}
```

##### `setEditUser(user)`

Populates edit form with user data.

```javascript
setEditUser(user) {
    this.editUser = {
        id: user.id,
        password: '',
        password_confirmation: '',
        role: user.roles && user.roles.length > 0 ? user.roles[0].name : '',
        permissions: user.permissions ? user.permissions.map(p => p.name) : [],
        profile_picture: null
    };
    
    // Update permissions based on role
    if (this.editUser.role && (!this.editUser.permissions || this.editUser.permissions.length === 0)) {
        this.updateEditPermissionsByRole(this.editUser.role);
    }
}
```

#### Permission Modules

The system supports the following permission modules:

- admin
- user
- grant
- interview
- employee
- employment
- employment_history
- children
- questionnaire
- language
- reference
- education
- payroll
- attendance
- training
- reports
- travel_request
- leave_request

Each module supports the following actions:
- create
- read
- update
- delete
- import
- export

## State Management

### Admin Store

**Location**: `src/stores/adminStore.js`

Pinia store for managing user-related state.

#### State

```javascript
state: () => ({
    users: [],
    currentUser: null,
    roles: [],
    permissions: [],
    loading: false,
    error: null,
    statistics: {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0
    }
})
```

#### Getters

- `getUserById(id)`: Get user by ID
- `getActiveUsers`: Get all active users
- `getInactiveUsers`: Get all inactive users
- `getUsersByRole(roleId)`: Get users by role ID
- `getUsersWithRoleName`: Get users with role name included

#### Actions

##### `fetchUsers()`

Fetches all users from the API.

```javascript
async fetchUsers() {
    try {
        this.loading = true;
        this.error = null;
        const response = await adminService.getAllUsers();
        const usersData = response && response.success && Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];
        this.users = usersData;
        this.updateStatistics();
        return this.users;
    } catch (error) {
        this.error = error.message || 'Failed to fetch users';
        throw error;
    } finally {
        this.loading = false;
    }
}
```

##### `createUser(data)`

Creates a new user.

```javascript
async createUser(data) {
    try {
        this.loading = true;
        this.error = null;
        const response = await adminService.createUser(data);
        await this.fetchUsers(); // Refresh list
        return response;
    } catch (error) {
        this.error = error.message || 'Failed to create user';
        throw error;
    } finally {
        this.loading = false;
    }
}
```

##### `updateUser(id, data)`

Updates an existing user.

```javascript
async updateUser(id, data) {
    try {
        this.loading = true;
        this.error = null;
        const response = await adminService.updateUser(id, data);
        await this.fetchUsers(); // Refresh list
        return response;
    } catch (error) {
        this.error = error.message || 'Failed to update user';
        throw error;
    } finally {
        this.loading = false;
    }
}
```

##### `deleteUser(id)`

Deletes a user.

```javascript
async deleteUser(id) {
    try {
        this.loading = true;
        this.error = null;
        const response = await adminService.deleteUser(id);
        await this.fetchUsers(); // Refresh list
        return response;
    } catch (error) {
        this.error = error.message || 'Failed to delete user';
        throw error;
    } finally {
        this.loading = false;
    }
}
```

## Services

### Admin Service

**Location**: `src/services/admin.service.js`

Service layer for API communication.

#### Methods

##### `getAllUsers()`

Fetches all users.

```javascript
async getAllUsers() {
    return await apiService.get(API_ENDPOINTS.ADMIN.USERS.LIST);
}
```

##### `createUser(userData)`

Creates a new user. Handles both FormData and regular objects.

```javascript
async createUser(userData) {
    if (userData instanceof FormData) {
        return await apiService.postFormData(API_ENDPOINTS.ADMIN.USERS.CREATE, userData);
    }
    
    const formData = new FormData();
    for (const key in userData) {
        if (Object.prototype.hasOwnProperty.call(userData, key)) {
            formData.append(key, userData[key]);
        }
    }
    return await apiService.postFormData(API_ENDPOINTS.ADMIN.USERS.CREATE, formData);
}
```

##### `updateUser(id, userData)`

Updates a user. Handles FormData with PUT method override.

```javascript
async updateUser(id, userData) {
    const endpoint = API_ENDPOINTS.ADMIN.USERS.UPDATE.replace(':id', id);
    
    if (!(userData instanceof FormData)) {
        return await apiService.put(endpoint, userData);
    }
    
    // For FormData, add method override for PUT
    userData.append('_method', 'PUT');
    return await apiService.postFormData(endpoint, userData);
}
```

##### `deleteUser(id)`

Deletes a user.

```javascript
async deleteUser(id) {
    const endpoint = API_ENDPOINTS.ADMIN.USERS.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
}
```

## User Interface

### User List Table

The user list table provides:

- **Sorting**: Click column headers to sort
- **Filtering**: Use filter dropdowns for name, role, and status
- **Search**: Filter search for name column
- **Pagination**: Built-in pagination (if configured)
- **Row Selection**: Checkbox selection for bulk operations

### Modal Forms

#### Add User Modal

Fields:
- Name (required)
- Email (required)
- Password (required, with show/hide toggle)
- Confirm Password (required, with show/hide toggle)
- Profile Picture (optional, file upload)
- Role (required, dropdown)
- Permissions (checkbox grid)

#### Edit User Modal

Fields:
- Role (required, dropdown)
- Password (optional, with show/hide toggle)
- Confirm Password (optional, with show/hide toggle)
- Permissions (checkbox grid)

#### Delete Confirmation Modal

- Confirmation message
- Cancel button
- Delete button

### Visual Indicators

#### Role Badges

- **Admin**: Red badge (`badge-danger`)
- **HR Manager**: Blue badge (`badge-info`)
- **HR Assistant**: Yellow badge (`badge-warning`)
- **Employee**: Green badge (`badge-success`)

#### Status Indicators

- **Active**: Green dot with "Active" text
- **Inactive**: Red dot with "Inactive" text

## API Integration

### Endpoints Used

All endpoints are defined in `src/config/api.config.js`:

- `API_ENDPOINTS.ADMIN.USERS.LIST`: GET `/api/admin/users`
- `API_ENDPOINTS.ADMIN.USERS.CREATE`: POST `/api/admin/users`
- `API_ENDPOINTS.ADMIN.USERS.UPDATE`: PUT `/api/admin/users/{id}`
- `API_ENDPOINTS.ADMIN.USERS.DELETE`: DELETE `/api/admin/users/{id}`
- `API_ENDPOINTS.ADMIN.USERS.DETAILS`: GET `/api/admin/users/{id}`

### Request Format

#### Create User

```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('password', 'Password123!');
formData.append('password_confirmation', 'Password123!');
formData.append('role', 'employee');
formData.append('permissions[]', 'user.read');
formData.append('permissions[]', 'user.update');
formData.append('profile_picture', file); // Optional
```

#### Update User

```javascript
const formData = new FormData();
formData.append('role', 'admin');
formData.append('permissions[]', 'user.read');
formData.append('password', 'NewPassword123!'); // Optional
formData.append('password_confirmation', 'NewPassword123!'); // Optional
formData.append('_method', 'PUT'); // For FormData PUT requests
```

### Response Handling

All API responses are handled through the store actions, which:
1. Check for success status
2. Update local state
3. Refresh user list
4. Handle errors appropriately

## Permissions & Roles

### Role Selection

Users can be assigned one of four roles:
- admin
- hr-manager
- hr-assistant
- employee

### Permission Management

Permissions are managed through a checkbox grid:
- Each module has its own row
- Each action (create, read, update, delete, import, export) has its own column
- Permissions are automatically populated based on selected role
- Permissions can be manually adjusted after role selection

### Default Permissions by Role

#### Employee
- user.read
- user.update
- attendance.create
- attendance.read
- travel_request.create
- travel_request.read
- travel_request.update
- leave_request.create
- leave_request.read
- leave_request.update

#### Admin, HR Manager, HR Assistant
- All permissions (automatically selected)

## Form Handling

### Validation

Frontend validation includes:
- Required field checks
- Email format validation
- Password confirmation matching
- File type validation for profile pictures

### Form Submission

1. Form data is collected
2. FormData object is created (for file uploads)
3. Permissions array is properly formatted
4. Request is sent via service
5. Store action is called
6. Success/error messages are displayed
7. Modal is closed on success
8. User list is refreshed

### File Upload

Profile pictures are handled via FormData:
- File input accepts image files
- File is added to FormData
- Backend validates file type and size
- Old profile picture is deleted when new one is uploaded

## Error Handling

### Error Display

Errors are displayed using alert components:
- Success: Green alert
- Error: Red alert
- Auto-dismiss after 3-5 seconds

### Error Handling Flow

1. Try-catch blocks in all async methods
2. Error messages extracted from API responses
3. User-friendly error messages displayed
4. Console logging for debugging
5. Store error state updated

### Common Error Scenarios

- **Network Errors**: Displayed as "Failed to connect to server"
- **Validation Errors**: Displayed with specific field errors
- **Permission Errors**: Displayed as "You don't have permission"
- **Not Found Errors**: Displayed as "User not found"

## Best Practices

1. **Always use the store** for state management
2. **Handle loading states** to provide user feedback
3. **Validate inputs** before submission
4. **Show clear error messages** to users
5. **Refresh data** after mutations
6. **Use FormData** for file uploads
7. **Handle both FormData and objects** in services
8. **Emit events** to parent components for updates
9. **Reset forms** after successful submission
10. **Use try-catch** for all async operations

## Component Communication

### Event Emission

The UserListModal component emits events:
- `user-added`: When a new user is created
- `user-updated`: When a user is updated
- `user-deleted`: When a user is deleted

### Parent Component Handling

```vue
<user-list-modal 
    ref="userListModal" 
    @user-added="fetchUsers" 
    @user-updated="fetchUsers" 
    @user-deleted="fetchUsers"
></user-list-modal>
```

## Styling

The components use:
- **Bootstrap 5**: For modals, buttons, forms, badges
- **Ant Design Vue**: For tables
- **Custom CSS**: For specific styling needs

## Related Documentation

- [Backend User Management Documentation](../backend-api-v1/docs/user-management/USER_MANAGEMENT_BACKEND.md)
- [Vue.js Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Ant Design Vue Documentation](https://antdv.com/)


# Dynamic Dashboard System Implementation

## Overview

This document summarizes the implementation of a dynamic dashboard system for the HRMS application. The system replaces hardcoded role-based dashboards with a single dynamic dashboard that displays widgets based on user permissions.

## Why Dynamic Dashboard?

Previously, dashboards were hardcoded based on roles (admin-dashboard, hr-manager-dashboard, etc.). Since roles are now dynamic and can be created/modified by administrators, the dashboard system needed to be dynamic as well.

## Solution: Permission-Based Widget System

### Key Features

1. **Single Dashboard for All Users** - All authenticated users access `/dashboard`
2. **Permission-Based Widgets** - Each widget has a `required_permission` field
3. **User Customization** - Users can toggle visibility, reorder, and collapse widgets
4. **Admin Management** - Admins can set dashboard widgets when creating/editing users

---

## Backend Implementation

### Database Schema

#### `dashboard_widgets` table
```
- id (primary key)
- name (unique identifier, e.g., 'welcome_card')
- display_name (human-readable name)
- description
- component (Vue component name)
- icon (Tabler icon class)
- category (general, hr, payroll, leave, etc.)
- size (small, medium, large, full)
- required_permission (nullable - null means visible to all)
- is_active (boolean)
- is_default (boolean - assigned to new users)
- default_order (integer)
- config (JSON - widget-specific configuration)
```

#### `user_dashboard_widgets` pivot table
```
- user_id (foreign key)
- dashboard_widget_id (foreign key)
- order (integer)
- is_visible (boolean)
- is_collapsed (boolean)
- user_config (JSON - user-specific overrides)
```

### Models

#### DashboardWidget Model
- **File**: `app/Models/DashboardWidget.php`
- **Key Methods**:
  - `userHasPermission($user)` - Check if user can see widget
  - `scopeActive()` - Only active widgets
  - `scopeDefault()` - Only default widgets
  - `getCategories()` - Get all widget categories
  - `getSizes()` - Get available widget sizes

#### UserDashboardWidget Pivot Model
- **File**: `app/Models/UserDashboardWidget.php`
- **Key Scopes**: `visible()`, `ordered()`

#### User Model Extensions
- **New Relationships**:
  - `dashboardWidgets()` - BelongsToMany
  - `userDashboardWidgets()` - HasMany
- **New Methods**:
  - `getVisibleDashboardWidgets()` - Get user's visible widgets
  - `syncDashboardWidgets($widgetIds)` - Sync user's widgets
  - `assignDefaultWidgets()` - Assign default widgets to user

### Controller

**File**: `app/Http/Controllers/Api/DashboardController.php`

#### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/my-widgets` | Get current user's dashboard |
| PUT | `/dashboard/my-widgets` | Update user's dashboard config |
| GET | `/dashboard/available-widgets` | Get widgets user can add |
| POST | `/dashboard/widgets/add` | Add widget to dashboard |
| DELETE | `/dashboard/widgets/{id}` | Remove widget from dashboard |
| POST | `/dashboard/widgets/{id}/toggle-visibility` | Toggle widget visibility |
| POST | `/dashboard/widgets/{id}/toggle-collapse` | Toggle widget collapsed state |
| POST | `/dashboard/widgets/reorder` | Reorder widgets |
| POST | `/dashboard/reset-defaults` | Reset to default widgets |

#### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard/widgets` | Get all widgets (admin) |
| GET | `/admin/dashboard/users/{id}/widgets` | Get user's widgets |
| PUT | `/admin/dashboard/users/{id}/widgets` | Set user's widgets |
| GET | `/admin/dashboard/users/{id}/available-widgets` | Get available for user |

### Seeder

**File**: `database/seeders/DashboardWidgetSeeder.php`

Seeded 18 default widgets across 8 categories:

| Category | Widgets |
|----------|---------|
| General | Welcome Card*, Quick Actions*, System Notifications* |
| HR | Employee Stats*, Department Overview, Organization Chart, Birthday/Anniversary |
| Leave | Leave Summary*, Upcoming Holidays, Leave Calendar |
| Payroll | Payroll Summary, Recent Payslips |
| Attendance | Attendance Overview |
| Recruitment | Open Positions, Recent Applications |
| Training | Training Programs |
| Reports | Reports Overview |

*Marked as default widgets

---

## Frontend Implementation

### API Configuration

**File**: `src/config/api.config.js`

Added dashboard endpoints to `DASHBOARD` and `ADMIN.DASHBOARD` sections.

### Dashboard Service

**File**: `src/services/dashboard.service.js`

Extends `BaseService` with methods:
- `getMyWidgets()`, `updateMyWidgets()`
- `getAvailableWidgets()`, `addWidget()`, `removeWidget()`
- `toggleWidgetVisibility()`, `toggleWidgetCollapse()`
- `reorderWidgets()`, `resetToDefaults()`
- Admin: `getAllWidgets()`, `getUserWidgets()`, `setUserWidgets()`

### Dynamic Dashboard Component

**File**: `src/views/pages/dashboard/dynamic-dashboard.vue`

Features:
- Loads user's widgets on mount
- Renders widgets using dynamic component loading
- Widget management modal for adding/removing/reordering
- Collapse/expand functionality
- Reset to defaults option

### Widget Components

Located in `src/components/dashboard-widgets/`:

| Component | Description |
|-----------|-------------|
| WelcomeWidget.vue | Personalized greeting with user info |
| QuickActionsWidget.vue | Quick action buttons (permission-based) |
| EmployeeStatsWidget.vue | Employee statistics display |
| LeaveSummaryWidget.vue | Leave requests summary |
| SystemNotificationsWidget.vue | Recent notifications |
| PlaceholderWidget.vue | Fallback for unmapped widgets |

### Router Updates

**File**: `src/router/index.js`

Added dynamic dashboard route:
```javascript
{
  path: '/dashboard',
  name: 'dashboard',
  component: lazyView('pages/dashboard/dynamic-dashboard'),
  meta: { requiresAuth: true, title: 'Dashboard' }
}
```

**File**: `src/router/guards.js`

Updated to redirect all authenticated users to `/dashboard`:
- Root path (`/`) → `/dashboard`
- After login → `/dashboard`

Legacy role-based dashboard routes kept for backward compatibility.

### User Management Integration

**File**: `src/components/modal/user-list-modal.vue`

Added Dashboard Widgets section to:
- **Add User Modal**: Select initial widgets for new users
- **Edit User Modal**: Modify user's dashboard widgets

New data properties:
- `widgets` - Array of all available widgets
- `loadingWidgets` - Loading state
- `newUser.selectedWidgets` - Selected widget IDs for new user
- `editUser.selectedWidgets` - Selected widget IDs for editing

New methods:
- `loadWidgets()` - Fetch widgets from API
- `selectAllWidgets(formType)` - Select all widgets
- `selectDefaultWidgets(formType)` - Select only defaults
- `setUserWidgets(userId, widgetIds)` - Save user's widgets
- `loadUserWidgets(userId)` - Load user's current widgets

---

## How It Works

### New User Flow
1. Admin creates user with role and permissions
2. Admin selects dashboard widgets for user
3. On creation, widgets are saved via `setUserWidgets` API
4. User logs in and sees their personalized dashboard

### Existing User Login
1. User logs in
2. Router redirects to `/dashboard`
3. Dynamic dashboard fetches user's widgets
4. Widgets are filtered by user's current permissions
5. If no widgets, default widgets are assigned

### Widget Permission Check
```php
public function userHasPermission(User $user): bool
{
    if (empty($this->required_permission)) {
        return true; // No permission required
    }
    return $user->hasPermissionTo($this->required_permission);
}
```

### User Customization
Users can:
- Hide widgets (toggle visibility)
- Collapse widgets
- Reorder widgets via modal
- Add available widgets
- Remove widgets
- Reset to defaults

---

## Files Created/Modified

### Backend - Created
- `database/migrations/2025_12_23_093806_create_dashboard_widgets_table.php`
- `database/migrations/2025_12_23_093813_create_user_dashboard_widgets_table.php`
- `app/Models/DashboardWidget.php`
- `app/Models/UserDashboardWidget.php`
- `app/Http/Controllers/Api/DashboardController.php`
- `database/seeders/DashboardWidgetSeeder.php`

### Backend - Modified
- `app/Models/User.php` - Added dashboard widget relationships and methods
- `routes/api/admin.php` - Added dashboard routes

### Frontend - Created
- `src/services/dashboard.service.js`
- `src/views/pages/dashboard/dynamic-dashboard.vue`
- `src/components/dashboard-widgets/WelcomeWidget.vue`
- `src/components/dashboard-widgets/QuickActionsWidget.vue`
- `src/components/dashboard-widgets/EmployeeStatsWidget.vue`
- `src/components/dashboard-widgets/LeaveSummaryWidget.vue`
- `src/components/dashboard-widgets/SystemNotificationsWidget.vue`
- `src/components/dashboard-widgets/PlaceholderWidget.vue`

### Frontend - Modified
- `src/config/api.config.js` - Added dashboard endpoints
- `src/router/index.js` - Added dynamic dashboard route
- `src/router/guards.js` - Updated redirects to use dynamic dashboard
- `src/components/modal/user-list-modal.vue` - Added widget selection
- `src/views/pages/administration/user-management/user-list.vue` - Async edit user

---

## Testing Checklist

- [ ] Login redirects to `/dashboard`
- [ ] Dashboard loads user's widgets
- [ ] Widgets respect user permissions
- [ ] Widget visibility toggle works
- [ ] Widget collapse/expand works
- [ ] Widget reorder works
- [ ] Add widget modal shows available widgets
- [ ] Remove widget works
- [ ] Reset to defaults works
- [ ] Admin can select widgets for new user
- [ ] Admin can modify widgets for existing user
- [ ] Legacy dashboard routes still work

---

## Future Enhancements

1. **Drag-and-drop reordering** - Better UX for widget arrangement
2. **Widget-specific settings** - Allow users to configure individual widgets
3. **Widget groups/layouts** - Custom layout configurations
4. **Role-based default widgets** - Different defaults per role
5. **More widget types** - Charts, calendars, custom data widgets

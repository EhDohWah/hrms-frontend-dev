# HR Management System - Role and Permission Update Summary

## Overview
Updated the frontend application to align with the new backend role structure and permissions system. The system now supports four distinct roles with specific access levels and permissions.

## New Role Structure

### 1. HR Manager (hr-manager)
- **Access Level**: Full access to all HR functions
- **Permissions**: All modules with complete CRUD operations
- **Dashboard**: `/dashboard/hr-manager-dashboard`
- **Key Features**:
  - Full employee management
  - Grant management (exclusive access)
  - All HR operations including payroll, reports
  - User management capabilities

### 2. HR Assistant Senior (hr-assistant-senior)
- **Access Level**: All HR functions except grant management
- **Permissions**: All modules except `grant.*` permissions
- **Dashboard**: `/dashboard/hr-assistant-senior-dashboard`
- **Key Features**:
  - Full employee and employment management
  - Payroll processing
  - Complete recruitment management
  - Training coordination
  - Report generation

### 3. HR Assistant Junior (hr-assistant-junior)
- **Access Level**: Basic HR operations (no grants, employment, payroll, reports)
- **Permissions**: Excludes `grant.*`, `employment.*`, `payroll.*`, `reports.*`
- **Dashboard**: `/dashboard/hr-assistant-junior-dashboard`
- **Key Features**:
  - Basic employee management
  - Attendance monitoring
  - Basic recruitment support
  - Training assistance
  - Leave and travel request processing

### 4. Site Admin (site-admin)
- **Access Level**: Limited to personal requests and training
- **Permissions**: Only `leave_request.*`, `travel_request.*`, `training.*`
- **Dashboard**: `/dashboard/site-admin-dashboard`
- **Key Features**:
  - Personal leave request management
  - Personal travel request management
  - Training session participation
  - Profile management

## Files Modified

### Configuration Files
1. **src/config/role-menu.config.js**
   - Updated `ROLE_HIERARCHY` with new roles
   - Updated `DEFAULT_ROUTES` for new dashboards
   - Completely restructured `ROLE_MENU_ACCESS` with detailed permissions
   - Added granular permission mapping based on backend structure

### Authentication & Authorization
2. **src/stores/authStore.js**
   - Updated getters for new role checks
   - Removed old admin/employee roles
   - Added new role-specific getters

3. **src/router/guards.js**
   - Updated authentication guard redirections
   - Modified role-based redirection logic
   - Updated default fallback routes

4. **src/views/pages/authentication/login-index.vue**
   - Updated `redirectBasedOnRole` function
   - Added support for new role redirections

### Routing Configuration
5. **src/router/index.js**
   - Added new dashboard routes for all roles
   - Updated role guards for existing routes
   - Modified access permissions throughout the application
   - Updated default route redirections

### Dashboard Components
6. **Created New Dashboard Components**:
   - `src/views/pages/dashboard/hr-assistant-senior-dashboard/`
     - `hr-assistant-senior-dashboard.vue`
     - `welcome-hr-assistant-senior.vue`
   - `src/views/pages/dashboard/hr-assistant-junior-dashboard/`
     - `hr-assistant-junior-dashboard.vue`
     - `welcome-hr-assistant-junior.vue`
   - `src/views/pages/dashboard/site-admin-dashboard/`
     - `site-admin-dashboard.vue`
     - `welcome-site-admin.vue`

### Modal Components
7. **Created New Modal Components**:
   - `src/components/modal/hr-assistant-senior-dashboard-modal.vue`
   - `src/components/modal/hr-assistant-junior-dashboard-modal.vue`
   - `src/components/modal/site-admin-dashboard-modal.vue`

## Permission Mapping

### Backend to Frontend Permission Mapping
- **admin.\***: User and administrative functions
- **user.\***: User management operations
- **grant.\***: Grant management (HR Manager only)
- **interview.\***: Interview and recruitment processes
- **employee.\***: Employee record management
- **employment.\***: Employment and employment history
- **children.\***: Employee children information
- **questionnaire.\***: Employee questionnaires
- **language.\***: Language proficiency records
- **reference.\***: Employee references
- **education.\***: Employee education records
- **payroll.\***: Payroll processing and management
- **attendance.\***: Attendance tracking and management
- **training.\***: Training programs and sessions
- **reports.\***: Report generation and viewing
- **travel_request.\***: Travel request management
- **leave_request.\***: Leave request processing
- **job_offer.\***: Job offer management
- **budget_line.\***: Budget line management
- **tax.\***: Tax calculations and settings

## Key Features by Role

### HR Manager Dashboard
- Comprehensive overview with all metrics
- Quick access to all HR functions
- Full administrative capabilities
- Grant management exclusive access

### HR Assistant Senior Dashboard  
- Advanced HR operations dashboard
- Employee and recruitment management
- Payroll and reporting capabilities
- Training coordination features

### HR Assistant Junior Dashboard
- Basic HR operations interface
- Task management system
- Limited to essential HR functions
- Focus on daily operational tasks

### Site Admin Dashboard
- Personal request management
- Training progress tracking
- Self-service interface
- Limited to personal activities

## Route Protection

All routes are now protected with appropriate role guards:
- Routes requiring full HR access: `['hr-manager']`
- Routes for senior operations: `['hr-assistant-senior', 'hr-manager']`
- Routes for basic operations: `['hr-assistant-junior', 'hr-assistant-senior', 'hr-manager']`
- Personal/employee routes: `['site-admin']`

## Default Users Created (Backend)
1. **HR Manager**: hrmanager@hrms.com
2. **HR Assistant Junior**: hrassistant.junior@hrms.com  
3. **HR Assistant Senior**: hrassistant.senior@hrms.com
4. **Site Admin**: siteadmin@hrms.com

All default accounts use password: `password` (should be changed in production)

## Testing Recommendations

1. Test login with each role type
2. Verify dashboard access and redirection
3. Check menu visibility based on role permissions
4. Test route protection and unauthorized access handling
5. Verify permission-based feature access
6. Test role hierarchy and access escalation

## Notes

- All permissions follow the backend structure using dot notation (e.g., `module.action`)
- Role hierarchy ensures higher roles can access lower role functions
- Menu system automatically filters based on user permissions
- Dashboard components are role-specific with relevant widgets and actions
- Modal components provide quick access to role-appropriate functions

## Future Considerations

- Consider implementing permission caching for performance
- Add role-based UI theming
- Implement granular feature toggling within modules
- Add audit logging for role-based actions
- Consider role delegation or temporary access features

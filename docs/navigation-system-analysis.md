# Vue.js HRMS Navigation System Analysis

Based on analysis of the Vue.js HRMS project, this document provides a comprehensive breakdown of the sophisticated JSON-driven navigation system with role-based access control.

## **Project Structure Analysis**

### **Key Directories:**
- **`/src/assets/json/`** - Contains menu configuration files
- **`/src/components/`** - Reusable components (modals, reports, breadcrumbs)
- **`/src/views/layouts/`** - Layout components including sidebar navigation
- **`/src/router/`** - Vue Router configuration with guards
- **`/src/config/`** - Role-based menu access configuration
- **`/src/services/`** - Business logic including menu service

### **Core Navigation Files:**
1. **`sidebar-data.json`** - Main menu configuration (currently active)
2. **`sidebar-menuone.json`** - Alternative/extended menu configuration
3. **`role-menu.config.js`** - Role hierarchy and permissions
4. **`menu.service.js`** - Menu filtering and access control logic
5. **`sidebar-menu.vue`** - Menu rendering component
6. **`layout-sidebar.vue`** - Main sidebar wrapper

---

## **Navigation System Understanding**

### **JSON Menu Structure Format:**
```json
[
  {
    "tittle": "Main Menu",           // Section title
    "showAsTab": true,               // Display as tab section
    "separateRoute": false,          // Whether to separate routes
    "menu": [                        // Array of menu items
      {
        "menuValue": "Dashboard",    // Display name
        "icon": "smart-home",        // Tabler icon name (ti ti-{icon})
        "active_link": "dashboard",  // Active state identifier
        "hasSubRoute": true,         // Has dropdown submenu
        "showSubRoute": false,       // Initially collapsed
        "route": "/dashboard",       // Direct route (if no submenu)
        "subMenus": [               // First level submenus
          {
            "menuValue": "Admin Dashboard",
            "route": "/dashboard/admin-dashboard",
            "active_link": "/dashboard/admin-dashboard"
          }
        ]
      }
    ]
  }
]
```

### **Menu Item Properties:**
- **`menuValue`** - Display text
- **`icon`** - Tabler icon class (without `ti ti-` prefix)
- **`route`** - Vue Router path
- **`active_link`** - Used for active state detection
- **`hasSubRoute`** - Boolean for single-level dropdown
- **`hasSubRouteTwo`** - Boolean for multi-level dropdown
- **`customSubmenuTwo`** - Enables third-level nesting
- **`subMenus`** - Array of submenu items
- **`subMenusTwo`** - Array of third-level menu items

### **Three-Level Menu Support:**
1. **Main Menu** → `hasSubRoute: true`
2. **Submenu** → `customSubmenuTwo: true`
3. **Sub-submenu** → `subMenusTwo` array

---

## **Data Flow from JSON to Rendered Navbar**

```
1. sidebar-data.json (Menu Configuration)
         ↓
2. sidebar-menu.vue (Import & Render)
         ↓
3. menuService.js (Role-based Filtering)
         ↓
4. Router Guards (Route Protection)
         ↓
5. Rendered Navigation with Active States
```

### **Role-Based Access Control:**
```javascript
// Role hierarchy (lower number = higher privilege)
ROLE_HIERARCHY = {
    'admin': 1,
    'hr-manager': 2,
    'hr-assistant': 3,
    'manager': 4,
    'employee': 5
}
```

---

## **Implementation Guidance**

### **1. Adding a New Top-Level Menu Item**

**Step 1:** Add to `sidebar-data.json`
```json
{
  "tittle": "Your New Section",
  "showAsTab": false,
  "separateRoute": false,
  "menu": [
    {
      "menuValue": "New Feature",
      "route": "/new-feature",
      "icon": "settings",
      "active_link": "/new-feature",
      "hasSubRoute": false
    }
  ]
}
```

**Step 2:** Create Vue component
```javascript
// /src/views/pages/new-feature/new-feature.vue
<template>
  <div class="page-wrapper">
    <div class="content">
      <h1>New Feature Page</h1>
      <!-- Your content here -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewFeature',
  data() {
    return {
      // Component data
    }
  }
}
</script>
```

**Step 3:** Add route to `router/index.js`
```javascript
{
  path: '/new-feature',
  name: 'new-feature',
  component: lazyView('pages/new-feature/new-feature'),
  beforeEnter: roleGuard(['admin', 'hr-manager']), // Set required roles
  meta: {
    requiresAuth: true,
    title: 'New Feature'
  }
}
```

**Step 4:** Update role permissions in `role-menu.config.js`
```javascript
'admin': {
  allowedMenus: [
    'Dashboard',
    'New Feature', // Add here
    // ... other menus
  ]
}
```

### **2. Creating Menu with Submenus (Dropdown)**

**JSON Structure:**
```json
{
  "menuValue": "Reports",
  "hasSubRouteTwo": true,
  "showSubRoute": false,
  "icon": "chart-bar",
  "active_link": "reports",
  "subMenus": [
    {
      "menuValue": "Sales Report",
      "route": "/reports/sales",
      "active_link": "/reports/sales"
    },
    {
      "menuValue": "User Report", 
      "route": "/reports/users",
      "active_link": "/reports/users"
    }
  ]
}
```

### **3. Three-Level Nested Menu**

```json
{
  "menuValue": "Administration",
  "hasSubRouteTwo": true,
  "showSubRoute": false,
  "icon": "settings",
  "active_link": "administration",
  "subMenus": [
    {
      "menuValue": "User Management",
      "customSubmenuTwo": true,
      "active_link": "user-management",
      "subMenusTwo": [
        {
          "menuValue": "Add User",
          "route": "/admin/users/add",
          "active_link": "/admin/users/add"
        },
        {
          "menuValue": "User List",
          "route": "/admin/users/list", 
          "active_link": "/admin/users/list"
        }
      ]
    }
  ]
}
```

---

## **Best Practices & Naming Conventions**

### **File Naming:**
- **Components:** `kebab-case.vue` (e.g., `employee-dashboard.vue`)
- **Routes:** `/kebab-case` (e.g., `/employee-dashboard`)
- **JSON keys:** `camelCase` (e.g., `menuValue`, `hasSubRoute`)

### **Icon Usage:**
- Uses **Tabler Icons** (`ti ti-{icon-name}`)
- Common icons: `smart-home`, `users`, `settings`, `chart-bar`
- Browse available icons at [tabler-icons.io](https://tabler-icons.io)

### **Route Structure:**
```
/module/feature/action
Examples:
- /dashboard/admin-dashboard
- /employee/list
- /reports/attendance
```

### **Important Configurations:**

1. **Always set role guards** for protected routes
2. **Update role-menu.config.js** when adding new menus
3. **Use consistent active_link patterns** for proper highlighting
4. **Follow the lazy loading pattern** with `lazyView()` helper

---

## **Key Differences from Standard Vue.js Navigation**

1. **JSON-Driven:** Menus are defined in JSON files rather than hardcoded in components
2. **Role-Based Filtering:** Dynamic menu visibility based on user roles
3. **Multi-Level Support:** Built-in support for 3-level nested menus
4. **Active State Management:** Complex active state logic for nested menus
5. **Permission Integration:** Tight integration with role-based permissions
6. **Dynamic Dashboard Routing:** Role-based default dashboard selection

This system provides excellent flexibility for managing complex navigation structures while maintaining clean separation between configuration and presentation logic.

---

## **Quick Reference**

### **Menu JSON Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `tittle` | String | Section title |
| `showAsTab` | Boolean | Display as tab section |
| `menuValue` | String | Menu display name |
| `icon` | String | Tabler icon name |
| `route` | String | Vue Router path |
| `active_link` | String | Active state identifier |
| `hasSubRoute` | Boolean | Has single-level dropdown |
| `hasSubRouteTwo` | Boolean | Has multi-level dropdown |
| `customSubmenuTwo` | Boolean | Enables third-level nesting |
| `subMenus` | Array | First-level submenu items |
| `subMenusTwo` | Array | Second-level submenu items |

### **Role Hierarchy:**
1. **admin** (highest privilege)
2. **hr-manager**
3. **hr-assistant**
4. **manager**
5. **employee** (lowest privilege)

### **Common File Locations:**
- Menu Config: `/src/assets/json/sidebar-data.json`
- Role Config: `/src/config/role-menu.config.js`
- Menu Service: `/src/services/menu.service.js`
- Sidebar Component: `/src/views/layouts/sidebar-menu.vue`
- Router: `/src/router/index.js`

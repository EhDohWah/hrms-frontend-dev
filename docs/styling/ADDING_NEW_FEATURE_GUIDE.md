### Adding a new CRUD feature (example: Employee > Personnel Actions)

This guide shows how to add a new feature that includes routes, sidebar menu, list page, modal component, service, and optional Pinia store. It follows the existing patterns used by Employees and Travel Requests.

- Key files you will touch:
  - `src/router/index.js`
  - `src/assets/json/sidebar-data.json`
  - `src/config/role-menu.config.js`
  - `src/services/<feature>.service.js`
  - `src/stores/<feature>Store.js` (optional)
  - `src/views/pages/.../<feature>-list.vue`
  - `src/components/modal/<feature>-modal.vue`

- Reference patterns in repo:
  - Travel admin page: `src/views/pages/requests/travel/travel-admin.vue`
  - Travel modal: `src/components/modal/travel-request-modal.vue`
  - Travel store: `src/stores/travelRequestStore.js`
  - Service pattern: `src/services/travelRequest.service.js`
  - Sidebar JSON: `src/assets/json/sidebar-data.json`
  - Menu access: `src/config/role-menu.config.js`
  - Menu service: `src/services/menu.service.js`

---

### 1) API endpoints

Add endpoints to `src/config/api.config.js` similar to `TRAVEL_REQUEST`.

Example:
```js
// In API_ENDPOINTS
PERSONNEL_ACTION: {
  LIST: '/personnel-actions',
  CREATE: '/personnel-actions',
  SHOW: '/personnel-actions/:id',
  UPDATE: '/personnel-actions/:id',
  DELETE: '/personnel-actions/:id',
  SEARCH_BY_EMPLOYEE: '/personnel-actions/search/employee/:staffId'
}
```

### 2) Service

Create `src/services/personnelAction.service.js` modeled after `travelRequest.service.js`.

Key methods:
- `getPersonnelActions(params)`
- `searchPersonnelActionsByEmployee(staffId, params)`
- `getPersonnelAction(id)`
- `createPersonnelAction(payload)`
- `updatePersonnelAction(id, payload)`
- `deletePersonnelAction(id)`
- optional: `deleteSelected(ids)`

Follow: `API_ENDPOINTS.PERSONNEL_ACTION.*` and reuse pagination query pattern used in travel.

### 3) Store (optional but recommended)

Create `src/stores/personnelActionStore.js` based on `travelRequestStore.js` if you want centralized pagination/filter/search and to share option lists.

State to include:
- `personnelActions`, `currentPersonnelAction`
- `statistics`, `loading`, `searchLoading`
- `currentPage`, `pageSize`, `total`
- `filteredInfo`, `sortedInfo`, `searchStaffId`

Actions to include:
- `fetchPersonnelActions(params)`
- `searchPersonnelActionsByStaffId(staffId)`
- `createPersonnelAction(payload)`
- `updatePersonnelAction(id, payload)`
- `deletePersonnelAction(id)` and `deleteSelectedPersonnelActions(ids)`

### 4) Routes

Update `src/router/index.js` under the Employee group to add your list route (and details if needed).

Example:
```js
{
  path: '/employee',
  component: lazyView('pages/hrm/employees/employees-index'),
  beforeEnter: roleGuard(['hr-assistant-junior', 'hr-assistant-senior', 'hr-manager', 'admin']),
  children: [
    // ...existing
    {
      path: 'personnel-actions',
      component: lazyView('pages/hrm/personnel-actions/personnel-actions-list'),
      meta: { title: 'Personnel Actions' }
    },
    { path: 'personnel-actions/:id', component: lazyView('pages/hrm/personnel-actions/personnel-actions-details') }
  ]
}
```

Keep using the `lazyView('...')` helper and role guard pattern as above.

### 5) Sidebar menu

Update `src/assets/json/sidebar-data.json` under the HRM > Employee submenu. Add a new item matching your route.

Example (under the `Employee` subMenus array):
```json
{
  "menuValue": "Personnel Actions",
  "route": "/employee/personnel-actions",
  "active_link": "/employee/personnel-actions"
}
```

The actual visibility is filtered by `menu.service.js` using `ROLE_MENU_ACCESS`.

### 6) Role access and permissions

Edit `src/config/role-menu.config.js` to allow the menu entry for specific roles and to wire permission strings.

- Add the top-level menu label (`'Employee'`) must already be in `allowedMenus`.
- Add the submenu label into `allowedSubMenus['Employee']` for the chosen roles.
- If you check permissions, include a pattern in `permissions` like `'personnel_action.*'`.

Example snippet inside a role block:
```js
allowedSubMenus: {
  Employee: [
    'Employees',
    'Employment Records',
    'Employee Resignation',
    'Personnel Actions', // add this
    'Site Location'
  ]
},
permissions: [
  'employee.*',
  'employment.*',
  'personnel_action.*' // add if used in guards
]
```

### 7) List page component

Create `src/views/pages/hrm/personnel-actions/personnel-actions-list.vue`. Base it on `travel-admin.vue` or `employees-list.vue`:
- Include `LayoutHeader`, `LayoutSidebar`, `LayoutFooter`, `indexBreadcrumb`
- Use Ant Design `a-table` with server-side pagination
- Use local data + store-backed fetch like travel admin
- Include actions (add/edit/delete) with a modal

Key methods to copy/adjust from travel admin:
- `fetchPersonnelActions(params)`
- `handlePaginationChange`, `handleSizeChange`, `handleTableChange`
- `buildApiParams`, `clearFilters`, `clearAll`

### 8) Modal component

Create `src/components/modal/personnel-action-modal.vue`. Base it on `travel-request-modal.vue`:
- Use `Bootstrap` `Modal` via `new Modal(...)` and selective import `import { Modal } from 'bootstrap'`
- Keep validation and alert pattern
- Load dropdown data from `useSharedDataStore` if needed (employees, departments, positions)
- Emit events like `@personnel-action-added` and `@personnel-action-updated`

Expose methods:
- `openAddPersonnelActionModal()`
- `openEditPersonnelActionModal(record)`

In your list page, include and reference it via `ref` just like travel admin does.

### 9) Header dropdown safety

When using Bootstrap modals, do NOT import `bootstrap/dist/js/bootstrap.bundle.min.js` in your views. Use selective import:
```js
import { Modal } from 'bootstrap';
```
This avoids the global re-initialization issue that breaks header dropdowns (see `docs/BOOTSTRAP_DROPDOWN_FIX.md`).

### 10) Testing checklist

- Sidebar shows "Personnel Actions" only for allowed roles
- Route `/employee/personnel-actions` loads the list page
- Create, update, delete work via service endpoints
- Pagination, sorting, and filtering round-trip to backend
- Modal opens and closes correctly; success flow resets form and reloads list
- Breadcrumb title and `document.title` set via route meta

---

### Example: Files to create

- `src/services/personnelAction.service.js`
- `src/stores/personnelActionStore.js` (optional)
- `src/views/pages/hrm/personnel-actions/personnel-actions-list.vue`
- `src/views/pages/hrm/personnel-actions/personnel-actions-details.vue` (optional)
- `src/components/modal/personnel-action-modal.vue`

And edits to:
- `src/config/api.config.js`
- `src/router/index.js`
- `src/assets/json/sidebar-data.json`
- `src/config/role-menu.config.js`

Use existing Travel Request files as your main blueprint for pagination/search/modals.

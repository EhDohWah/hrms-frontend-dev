# CLEANUP VERIFICATION REPORT (UPDATED)
## HRMS Vue.js Template - File Deletion Safety Analysis

**Generated:** December 30, 2025  
**Updated:** December 30, 2025 (Based on Active Sidebar Menu)  
**Analysis Scope:** Entire `src/` directory  
**Search Method:** Comprehensive grep + Sidebar menu comparison

---

## EXECUTIVE SUMMARY

### Overall Statistics
- **Total Directories Analyzed:** 14
- **Total Vue Files Found:** 208
- **Total Modal Components Analyzed:** 44
- **Sidebar Menu Features:** Only specific HRMS features needed (Grant, Recruitment, HRM, Finance, Administration)

### ✅ UPDATED FINDINGS - BASED ON YOUR ACTUAL SIDEBAR MENU

**Your Active Sidebar Menu Includes ONLY:**
- ✅ Dashboard
- ✅ Grant (Grants List, Grant Position)
- ✅ Recruitment (Interviews, Job Offers)
- ✅ HRM (Employees, Holidays, Leaves, Travel, Attendance, Training)
- ✅ Finance & Accounts (Payroll only)
- ✅ Administration (Organization Structure, Lookups, User Management, Reports, File Uploads, Recycle Bin)

**NOT in Your Sidebar (Template Features):**
- ❌ Applications (chat, email, calendar, todo, notes, file-manager, calls, kanban)
- ❌ CRM (deals, leads, contacts, companies, pipeline, analytics, activity)
- ❌ Projects (clients, projects, tasks)
- ❌ Content (blogs, pages, testimonials, FAQs, location)
- ❌ Superadmin (packages, domain, subscription, purchase)
- ❌ Layouts (demo layout variations)
- ❌ UI Interface (baseui, advancedui, forms, charts, tables, icons demos)
- ❌ Sales (estimates, invoices, payments, expenses, provident, taxes)
- ❌ Accounting (budgets, categories)

### Critical Finding
⚠️ **7 OUT OF 14 DIRECTORIES CAN BE SAFELY DELETED** (Not in your sidebar menu)  
✅ **SAFE TO DELETE:** 7 directories + 31 modal components  
❌ **MUST KEEP:** 7 directories (in active use)

---

## PART 1: DIRECTORY ANALYSIS (BASED ON YOUR SIDEBAR MENU)

---

## 🗑️ SAFE TO DELETE - NOT IN YOUR SIDEBAR MENU

### 1. src/views/pages/applications/ 
**Status:** ✅ **SAFE TO DELETE - NOT IN YOUR SIDEBAR**  
**Files Found:** 31 Vue files  
**Reason:** Applications features (chat, email, calendar, todo, notes, file-manager, calls, kanban) are NOT in your sidebar-data.json

**Router Impact:** Will need to remove/comment routes at lines 713-743 in router/index.js

**Related Modals to Delete:**
- calendar-modal.vue
- call-history-modal.vue
- file-manager-modal.vue
- notes-modal.vue
- todo-modal.vue

**Files to Delete:**
```bash
src/views/pages/applications/ (entire directory - 31 files)
```

---

### 2. src/views/pages/crm/
**Status:** ✅ **SAFE TO DELETE - NOT IN YOUR SIDEBAR**  
**Files Found:** 22 Vue files  
**Reason:** CRM features (deals, leads, contacts, companies, pipeline, analytics, activity) are NOT in your sidebar-data.json

**Router Impact:** Will need to remove/comment routes at lines 649-680 in router/index.js

**Related Modals to Delete:**
- activity-modal.vue
- companies-modal.vue
- contacts-modal.vue
- leads-modal.vue
- pipeline-modal.vue

**Files to Delete:**
```bash
src/views/pages/crm/ (entire directory - 22 files)
```

---

### 3. src/views/pages/projects/
**Status:** ✅ **SAFE TO DELETE - NOT IN YOUR SIDEBAR**  
**Files Found:** 14 Vue files  
**Reason:** Projects features (clients, projects, tasks) are NOT in your sidebar-data.json

**Router Impact:** Will need to remove/comment routes at lines 683-697 in router/index.js

**Related Modals to Delete:**
- tasks-modal.vue
- project-modal.vue (already has zero usage)
- clients-modal.vue (already has zero usage)

**Files to Delete:**
```bash
src/views/pages/projects/ (entire directory - 14 files)
```

---

### 4. src/views/pages/content/
**Status:** ✅ **SAFE TO DELETE - NOT IN YOUR SIDEBAR**  
**Files Found:** 22 Vue files  
**Reason:** Content features (blogs, pages, testimonials, FAQs, location) are NOT in your sidebar-data.json

**Router Impact:** Will need to remove/comment routes at lines 397-454 in router/index.js

**Related Modals to Delete:**
- blogs-modal.vue
- cities-modal.vue
- contries-modal.vue (already has zero usage)
- faq-modal.vue
- pages-modal.vue
- states-modal.vue
- testimonials-modal.vue

**Files to Delete:**
```bash
src/views/pages/content/ (entire directory - 22 files)
```

---

### 5. src/views/pages/superadmin/
**Status:** ✅ **SAFE TO DELETE - NOT IN YOUR SIDEBAR**  
**Files Found:** 15 Vue files  
**Reason:** Superadmin features (packages, domain, subscription, purchase) are NOT in your sidebar-data.json

**Router Impact:** Will need to remove/comment routes at lines 699-711 in router/index.js

**Related Modals to Delete:**
- companies-modal.vue
- domain-modal.vue
- packages-modal.vue
- purchase-modal.vue

**Files to Delete:**
```bash
src/views/pages/superadmin/ (entire directory - 15 files)
```

---

### 6. src/views/pages/layout/
**Status:** ✅ **SAFE TO DELETE - DEMO LAYOUTS**  
**Files Found:** 21 Vue files  
**Reason:** Layout demo pages (horizontal, detached, modern, two-column, hovered, box, RTL, dark) are NOT in your sidebar-data.json. These are template showcase features.

**Router Impact:** Will need to remove/comment routes at lines 284-302 in router/index.js

**Files to Delete:**
```bash
src/views/pages/layout/ (entire directory - 21 files)
```

---

### 7. src/views/pages/uiinterface/
**Status:** ✅ **SAFE TO DELETE - DEMO UI COMPONENTS**  
**Files Found:** 84 Vue files  
**Reason:** UI Interface demos (baseui, advancedui, forms, charts, tables, icons) are NOT in your sidebar-data.json. These are template showcase features.

**Router Impact:** Will need to remove/comment multiple route sections for baseui, advancedui, tables, charts, form-elements, form-layouts, forms, icons

**Files to Delete:**
```bash
src/views/pages/uiinterface/ (entire directory - 84 files)
```

---

## ❌ MUST KEEP - IN YOUR SIDEBAR MENU

### 8. src/views/pages/administration/assets/
**Status:** ✅ **SAFE TO DELETE - NOT IN YOUR SIDEBAR**  
**Files Found:** 3 Vue files  
**Reason:** Assets management is NOT in your sidebar-data.json

**Router Impact:** Will need to remove/comment routes at lines 276-280 in router/index.js

**Related Modals to Delete:**
- assets-modal.vue

**Files to Delete:**
```bash
src/views/pages/administration/assets/ (entire directory - 3 files)
```

---

### 9. src/views/pages/administration/supports/
**Status:** ✅ **SAFE TO DELETE - NOT IN YOUR SIDEBAR**  
**Files Found:** 4 Vue files  
**Reason:** Support/Knowledgebase features are NOT in your sidebar-data.json

**Router Impact:** Will need to remove/comment routes at lines 266-272 in router/index.js

**Files to Delete:**
```bash
src/views/pages/administration/supports/ (entire directory - 4 files)
```

---

### 10. src/views/pages/administration/settings/website-settings/
**Status:** ⚠️ **REVIEW NEEDED - Settings Feature**  
**Files Found:** 13 Vue files  
**Reason:** Website settings are NOT explicitly in your sidebar-data.json, but settings might be accessed elsewhere

**Recommendation:** Keep if you have a settings page accessible from user profile/admin panel. Delete if not needed.

**Files in Directory:**
```
- add-language.vue, ai-settings.vue, appearance-settings.vue
- authentication-settings.vue, bussiness-settings.vue
- language-settings.vue, language-web.vue
- localization-settings.vue, prefixes-settings.vue
- preferences-settings.vue, seo-settings.vue
- website-settings.vue, website-sidebar.vue
```

---

### 11. src/views/pages/administration/settings/financial-settings/
**Status:** ⚠️ **REVIEW NEEDED - Settings Feature**  
**Files Found:** 5 Vue files  
**Reason:** Financial settings are NOT explicitly in your sidebar-data.json, but might be needed for payroll configuration

**Recommendation:** Keep if needed for payroll/tax configuration. Delete if not needed.

**Related Modals:**
- currencies-modal.vue

**Files in Directory:**
```
- currencies-settings.vue, financial-settings.vue
- financial-sidebar.vue, payment-gateway.vue, tax-rates.vue
```

---

### 12. src/views/pages/administration/settings/app-settings/
**Status:** ⚠️ **REVIEW NEEDED - Settings Feature**  
**Files Found:** 7 Vue files  
**Reason:** App settings are NOT explicitly in your sidebar-data.json, but might be needed for system configuration

**Recommendation:** Keep if needed for salary/leave/approval configuration. Delete if not needed.

**Related Modals:**
- custom-fields-modal.vue

**Files in Directory:**
```
- app-settings.vue, app-sidebar.vue
- approval-settings.vue, custom-fields.vue
- invoice-settings.vue, leave-type.vue
- salary-settings.vue
```

---

### 13. src/views/pages/finance-accounts/sales/
**Status:** ✅ **SAFE TO DELETE - NOT IN YOUR SIDEBAR**  
**Files Found:** 16 Vue files  
**Reason:** Sales features (estimates, invoices, payments, expenses, provident, taxes) are NOT in your sidebar-data.json. You only have "Payroll" under Finance & Accounts.

**Router Impact:** Will need to remove/comment routes at lines 458-469 in router/index.js

**Related Modals to Delete:**
- estimates-modal.vue
- invoices-modal.vue
- expenses-modal.vue
- provident-modal.vue
- taxes-modal.vue

**Files to Delete:**
```bash
src/views/pages/finance-accounts/sales/ (entire directory - 16 files)
```

---

### 14. src/views/pages/finance-accounts/accounting/
**Status:** ✅ **SAFE TO DELETE - NOT IN YOUR SIDEBAR**  
**Files Found:** 6 Vue files  
**Reason:** Accounting features (budgets, categories) are NOT in your sidebar-data.json. You only have "Payroll" under Finance & Accounts.

**Router Impact:** Will need to remove/comment routes at lines 387-393 in router/index.js

**Related Modals to Delete:**
- budgets-modal.vue
- categories-modal.vue

**Files to Delete:**
```bash
src/views/pages/finance-accounts/accounting/ (entire directory - 6 files)
```

---

## PART 2: MODAL COMPONENTS ANALYSIS (BASED ON YOUR SIDEBAR)

### ✅ MODALS TO DELETE - Used by directories NOT in your sidebar (31 modals)

| Modal Component | Reason | Used In (to be deleted) |
|----------------|--------|-------------------------|
| activity-modal.vue | CRM feature | crm/activity/activity-list.vue |
| api-keys-modal.vue | Not in sidebar | pages/api-keys.vue |
| assets-modal.vue | Assets not in sidebar | administration/assets/assets-list.vue |
| blogs-modal.vue | Content feature | content/blogs/blogs-grid.vue |
| budgets-modal.vue | Accounting feature | finance-accounts/accounting/budgets-index.vue |
| calendar-modal.vue | Applications feature | applications/calendar-index.vue |
| call-history-modal.vue | Applications feature | applications/calls/call-history.vue |
| categories-modal.vue | Accounting feature | finance-accounts/accounting/categories-list.vue |
| cities-modal.vue | Content/Location feature | content/location/cities-list.vue |
| clients-modal.vue | Projects feature (zero usage) | Not used anywhere |
| companies-modal.vue | Superadmin feature | superadmin/companies/ |
| contact-modal.vue | Zero usage | Not used anywhere |
| contacts-modal.vue | CRM feature | crm/contacts/contacts-list.vue |
| contries-modal.vue | Content/Location (zero usage) | Not used anywhere |
| cronjob-modal.vue | Zero usage | Not used anywhere |
| deals-modal.vue | CRM (zero usage) | Not used anywhere |
| domain-modal.vue | Superadmin feature | superadmin/domain/domain-list.vue |
| estimates-modal.vue | Sales feature | finance-accounts/sales/estimates-list.vue |
| expenses-modal.vue | Sales feature | finance-accounts/sales/expenses-list.vue |
| faq-modal.vue | Content feature | content/faq-list.vue |
| file-manager-modal.vue | Applications feature | applications/file-manager/file-manager.vue |
| goal-modal.vue | Zero usage | Not used anywhere |
| invoices-modal.vue | Sales feature | finance-accounts/sales/ |
| job-modal.vue | Zero usage | Not used anywhere |
| leads-modal.vue | CRM feature | crm/leads/ |
| notes-modal.vue | Applications feature | applications/notes-index.vue |
| packages-modal.vue | Superadmin feature | superadmin/packages/ |
| pages-modal.vue | Content feature | content/pages-list.vue |
| pipeline-modal.vue | CRM feature | crm/pipeline/pipeline-list.vue |
| project-modal.vue | Projects (zero usage) | Not used anywhere |
| provident-modal.vue | Sales feature | finance-accounts/sales/provident-fund.vue |
| purchase-modal.vue | Superadmin feature | superadmin/purchase/purchase-transaction.vue |
| states-modal.vue | Content/Location feature | content/location/states-list.vue |
| tasks-modal.vue | Projects feature | projects/task/ |
| taxes-modal.vue | Sales feature | finance-accounts/sales/taxes-list.vue |
| testimonials-modal.vue | Content feature | content/testimonials-list.vue |
| ticket-modal.vue | Zero usage | Not used anywhere |
| todo-modal.vue | Applications feature | applications/todo-index.vue |

---

### ⚠️ MODALS TO REVIEW - Settings Related (3 modals)

| Modal Component | Reason | Used In |
|----------------|--------|---------|
| currencies-modal.vue | Financial settings | administration/settings/financial-settings/currencies-settings.vue |
| custom-fields-modal.vue | App settings | administration/settings/app-settings/custom-fields.vue |
| backup-modal.vue | System settings | administration/settings/others-settings/backup-settings.vue |
| email-modal.vue | System settings | administration/settings/system-settings/email-template.vue |

**Decision:** Keep if you need settings pages. Delete if you don't need system configuration pages.

---

### ❌ MODALS TO KEEP - Used by features IN your sidebar (13 modals)

| Modal Component | Reason | Used In |
|----------------|--------|---------|
| candidates-modal.vue | ✅ Recruitment in sidebar | recruitment/candidates/candidates-list.vue |
| indicator-modal.vue | ✅ HRM Performance | hrm/attendance/performance/performance-indicator.vue |
| organizational-table.vue | ✅ HRM Performance | modal/performance-appraisal-modal.vue |
| overtime-modal.vue | ✅ HRM Attendance | hrm/attendance/overtime-list.vue |
| payroll-overtime-modal.vue | ✅ Finance/Payroll in sidebar | finance-accounts/payroll/payroll-overtime.vue |
| performance-appraisal-modal.vue | ✅ HRM Performance | hrm/attendance/performance/performance-appraisal.vue |
| policy-modal.vue | ✅ HRM Employees | hrm/employees/employee-policy.vue |
| promotion-modal.vue | ✅ HRM | hrm/promotion/promotion-list.vue |
| schedule-time-modal.vue | ✅ HRM Attendance | hrm/attendance/schedule-timing.vue |
| technical-table.vue | ✅ HRM Performance | modal/performance-appraisal-modal.vue |
| termination-modal.vue | ✅ HRM | hrm/termination/termination-list.vue |
| timesheets-modal.vue | ✅ HRM Attendance | hrm/attendance/timesheets-list.vue |
| trainers-modal.vue | ✅ HRM Training in sidebar | hrm/attendance/training/trainers-list.vue |
| training-type-modal.vue | ✅ HRM Training in sidebar | hrm/attendance/training/training-type.vue |

---

## PART 3: UPDATED RECOMMENDATIONS (BASED ON YOUR SIDEBAR)

### ✅ SAFE TO DELETE - DIRECTORIES (11 directories, 199 files)

Based on your sidebar-data.json, you can safely delete these entire directories:

```bash
# Applications (NOT in sidebar) - 31 files
src/views/pages/applications/

# CRM (NOT in sidebar) - 22 files
src/views/pages/crm/

# Projects (NOT in sidebar) - 14 files
src/views/pages/projects/

# Content (NOT in sidebar) - 22 files
src/views/pages/content/

# Superadmin (NOT in sidebar) - 15 files
src/views/pages/superadmin/

# Layout demos (NOT in sidebar) - 21 files
src/views/pages/layout/

# UI Interface demos (NOT in sidebar) - 84 files
src/views/pages/uiinterface/

# Administration subdirectories NOT in sidebar
src/views/pages/administration/assets/          # 3 files
src/views/pages/administration/supports/        # 4 files

# Finance subdirectories NOT in sidebar (you only have Payroll)
src/views/pages/finance-accounts/sales/         # 16 files
src/views/pages/finance-accounts/accounting/    # 6 files
```

**Total:** 11 directories, approximately 199 Vue files

---

### ✅ SAFE TO DELETE - MODAL COMPONENTS (38 modals)

Delete these modal components as they're used by deleted directories:

```bash
# Applications modals
src/components/modal/calendar-modal.vue
src/components/modal/call-history-modal.vue
src/components/modal/file-manager-modal.vue
src/components/modal/notes-modal.vue
src/components/modal/todo-modal.vue

# CRM modals
src/components/modal/activity-modal.vue
src/components/modal/companies-modal.vue
src/components/modal/contacts-modal.vue
src/components/modal/leads-modal.vue
src/components/modal/pipeline-modal.vue

# Projects modals
src/components/modal/tasks-modal.vue

# Content modals
src/components/modal/blogs-modal.vue
src/components/modal/cities-modal.vue
src/components/modal/faq-modal.vue
src/components/modal/pages-modal.vue
src/components/modal/states-modal.vue
src/components/modal/testimonials-modal.vue

# Superadmin modals
src/components/modal/domain-modal.vue
src/components/modal/packages-modal.vue
src/components/modal/purchase-modal.vue

# Administration modals (not in sidebar)
src/components/modal/assets-modal.vue

# Sales/Accounting modals (not in sidebar)
src/components/modal/budgets-modal.vue
src/components/modal/categories-modal.vue
src/components/modal/estimates-modal.vue
src/components/modal/expenses-modal.vue
src/components/modal/invoices-modal.vue
src/components/modal/provident-modal.vue
src/components/modal/taxes-modal.vue

# Other pages not in sidebar
src/components/modal/api-keys-modal.vue

# Zero usage modals
src/components/modal/clients-modal.vue
src/components/modal/contact-modal.vue
src/components/modal/contries-modal.vue
src/components/modal/cronjob-modal.vue
src/components/modal/deals-modal.vue
src/components/modal/goal-modal.vue
src/components/modal/job-modal.vue
src/components/modal/project-modal.vue
src/components/modal/ticket-modal.vue
```

**Total:** 38 modal components

---

### ⚠️ REVIEW BEFORE DELETING - SETTINGS DIRECTORIES

These settings directories are NOT in your sidebar but might be needed:

```bash
src/views/pages/administration/settings/website-settings/    # 13 files
src/views/pages/administration/settings/financial-settings/  # 5 files
src/views/pages/administration/settings/app-settings/        # 7 files
src/views/pages/administration/settings/system-settings/     # (check if exists)
src/views/pages/administration/settings/others-settings/     # (check if exists)
```

**Related modals:**
- currencies-modal.vue
- custom-fields-modal.vue
- backup-modal.vue
- email-modal.vue

**Decision:** 
- **Keep** if you access settings from admin profile/settings menu
- **Delete** if you don't need system configuration pages

---

### ❌ MUST KEEP - IN YOUR SIDEBAR (7 directories + 13 modals)

**Keep these directories** (they're in your sidebar-data.json):

```bash
✅ src/views/pages/dashboard/                    # Dashboard
✅ src/views/pages/grant/                        # Grant features
✅ src/views/pages/recruitment/                  # Interviews, Job Offers
✅ src/views/pages/hrm/                          # Employees, Holidays, Leaves, Attendance, Training, etc.
✅ src/views/pages/finance-accounts/payroll/     # Payroll (only this, not sales/accounting)
✅ src/views/pages/administration/               # Keep core admin features:
   - departments/
   - positions/
   - section-departments/
   - sites/
   - lookups/
   - user-management/
   - role-management/
   - reports/
   - file-uploads/
   - recycle-bin/
✅ src/views/pages/requests/travel/              # Travel requests
```

**Keep these modals** (used by features in your sidebar):

```bash
✅ candidates-modal.vue              # Recruitment
✅ indicator-modal.vue               # HRM Performance
✅ organizational-table.vue          # HRM Performance
✅ overtime-modal.vue                # HRM Attendance
✅ payroll-overtime-modal.vue        # Finance/Payroll
✅ performance-appraisal-modal.vue   # HRM Performance
✅ policy-modal.vue                  # HRM Employees
✅ promotion-modal.vue               # HRM
✅ schedule-time-modal.vue           # HRM Attendance
✅ technical-table.vue               # HRM Performance
✅ termination-modal.vue             # HRM
✅ timesheets-modal.vue              # HRM Attendance
✅ trainers-modal.vue                # HRM Training
✅ training-type-modal.vue           # HRM Training
```

---

## PART 4: ROUTER CLEANUP REQUIRED

After deleting directories, you must update `src/router/index.js`:

### Routes to Remove/Comment Out:

```javascript
// Lines 284-302: Layout demos
{
  path: '/layouts',
  component: lazyView('pages/layout/layout-index'),
  // ... all layout routes
}

// Lines 397-454: Content (blogs, pages, testimonials, FAQs, location)
{
  path: '/content',
  component: lazyView('pages/content/content-index'),
  // ...
}
{
  path: '/location',
  // ...
}
{
  path: '/blog',
  // ...
}

// Lines 387-393: Accounting
{
  path: '/accounting',
  component: lazyView('pages/finance-accounts/accounting/accounting-index'),
  // ...
}

// Lines 458-469: Sales
{
  path: '/sales',
  component: lazyView('pages/finance-accounts/sales/sales-index'),
  // ...
}

// Lines 649-680: CRM
{
  path: '/crm',
  component: lazyView('pages/crm/crm-index'),
  // ...
}

// Lines 683-697: Projects
{
  path: '/projects',
  component: lazyView('pages/projects/projects-index'),
  // ...
}

// Lines 699-711: Superadmin
{
  path: '/super-admin',
  component: lazyView('pages/superadmin/superadmin-index'),
  // ...
}

// Lines 713-743: Applications
{
  path: '/applications',
  component: lazyView('pages/applications/applications-index'),
  // ...
}
{
  path: '/calls',
  // ...
}

// Lines 276-280: Assets
{
  path: '/asset',
  component: lazyView('pages/administration/assets/assets-index'),
  // ...
}

// Lines 266-272: Supports
{
  path: '/supports',
  component: lazyView('pages/administration/supports/help-supports'),
  // ...
}

// UI Interface routes (multiple sections)
// - /baseui
// - /advancedui
// - /tables
// - /charts
// - /form-elements
// - /form-layouts
// - /forms
// - /icons
```

---

## PART 5: LAZY COMPONENTS CLEANUP

Update `src/plugins/lazy-components.js` to remove:

```javascript
// Remove these lazy component registrations:
'activity-modal': () => import('@/components/modal/activity-modal.vue'),
'assets-modal': () => import('@/components/modal/assets-modal.vue'),
'custom-fields-modal': () => import('@/components/modal/custom-fields-modal.vue'),
'payroll-overtime-modal': () => import('@/components/modal/payroll-overtime-modal.vue'),
'pipeline-modal': () => import('@/components/modal/pipeline-modal.vue'),
'policy-modal': () => import('@/components/modal/policy-modal.vue'),
'timesheets-modal': () => import('@/components/modal/timesheets-modal.vue'),
'trainers-modal': () => import('@/components/modal/trainers-modal.vue'),
'training-type-modal': () => import('@/components/modal/training-type-modal.vue'),

// Sales table components
'estimates-table': () => import('@/views/pages/finance-accounts/sales/estimates-table.vue'),
'invoices-table': () => import('@/views/pages/finance-accounts/sales/invoices-table.vue'),
'payments-table': () => import('@/views/pages/finance-accounts/sales/payments-table.vue'),
'expenses-table': () => import('@/views/pages/finance-accounts/sales/expenses-table.vue'),
'provident-table': () => import('@/views/pages/finance-accounts/sales/provident-table.vue'),
'taxes-table': () => import('@/views/pages/finance-accounts/sales/taxes-table.vue'),

// Accounting table components
'categories-table': () => import('@/views/pages/finance-accounts/accounting/categories-table.vue'),

// Content table components
'pages-table': () => import('@/views/pages/content/pages-table.vue'),
```

---

## PART 6: VERIFICATION METHODOLOGY

### Search Strategy
1. ✅ Searched entire `src/` directory
2. ✅ Included .vue, .js, .ts files
3. ✅ Excluded node_modules
4. ✅ Checked both import statements and component usage in templates
5. ✅ Verified router lazy loading patterns
6. ✅ Checked lazy component registration files
7. ✅ **Compared with actual sidebar-data.json menu structure**

### Tools Used
- `grep` with regex patterns
- Case-insensitive searches
- Pattern matching for imports and component names
- File listing and directory scanning
- Manual comparison with sidebar-data.json

---

## CONCLUSION

### Summary of Deletions

**Based on your sidebar-data.json, you can safely delete:**

📊 **Statistics:**
- ✅ **11 directories** (199 Vue files)
- ✅ **38 modal components**
- ⚠️ **3-5 settings directories** (review needed - 25 files)
- 📝 **Router cleanup required** (remove ~15 route sections)
- 📝 **Lazy components cleanup required** (remove ~20 registrations)

**Total potential cleanup:** ~240-265 files

---

### ⚠️ IMPORTANT WARNINGS

1. **Backup First:** Create a git commit or backup before deleting anything
2. **Test After Deletion:** Run your application and test all features in your sidebar
3. **Router Errors:** After deletion, you'll get router errors until you clean up router/index.js
4. **Settings Decision:** Decide if you need settings pages before deleting those directories
5. **Build Test:** Run `npm run build` to ensure no build errors after cleanup

---

### 🎯 RECOMMENDED DELETION ORDER

1. **Phase 1 - Safe Deletions:**
   - Delete modal components (38 files)
   - Delete UI Interface directory (84 files)
   - Delete Layout directory (21 files)
   
2. **Phase 2 - Feature Deletions:**
   - Delete Applications directory (31 files)
   - Delete CRM directory (22 files)
   - Delete Projects directory (14 files)
   - Delete Content directory (22 files)
   - Delete Superadmin directory (15 files)

3. **Phase 3 - Finance Cleanup:**
   - Delete Sales directory (16 files)
   - Delete Accounting directory (6 files)

4. **Phase 4 - Administration Cleanup:**
   - Delete Assets directory (3 files)
   - Delete Supports directory (4 files)

5. **Phase 5 - Router Cleanup:**
   - Comment out/remove unused routes
   - Test application

6. **Phase 6 - Lazy Components Cleanup:**
   - Remove unused lazy component registrations
   - Run build test

---

**Report End - Updated Based on Your Sidebar Menu**


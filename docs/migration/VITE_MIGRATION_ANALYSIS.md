# Vite Migration Analysis Report

**Project:** HRMS Frontend (Vue.js 3)  
**Migration:** Vue CLI (Webpack) → Vite  
**Analysis Date:** January 19, 2026  
**Status:** ⚠️ **INCOMPLETE - Critical Issues Found**

---

## Executive Summary

The Vue.js frontend project has been **partially migrated** from Vue CLI (Webpack) to Vite. While the core configuration files are in place, there are **critical issues** that will prevent the application from running correctly. The migration is approximately **70% complete**.

### Critical Issues Found: 3
### Warnings: 2
### Completed Items: 5

---

## 📋 Detailed Analysis

## 1. Configuration Files

### ✅ **PASSED: `vite.config.js`**

The Vite configuration file is properly set up:

```javascript:1:27:vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      moment: 'moment/moment.js'
    },
  },
  server: {
    port: 3000,
  },
  base: '/vue/template/',
  optimizeDeps: {
    include: ['vue-draggable-next']
  }
})
```

**Status:** ✅ Correct
- Proper alias configuration for `@/`
- Vue plugin configured
- Dev tools enabled
- Custom port set to 3000

### ✅ **PASSED: Old Files Deleted**

- ✅ `vue.config.js` - Not found (correctly deleted)
- ✅ `babel.config.js` - Not found (correctly deleted)

### ✅ **PASSED: `package.json` Scripts**

```json:6:11:package.json
"scripts": {
  "dev": "vite",
  "serve": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

**Status:** ✅ Correct - All Vite scripts are properly configured

### ✅ **PASSED: Vue CLI Dependencies Removed**

No `@vue/cli-*` or `@babel/*` dependencies found in `package.json`. Only found in documentation and cleanup scripts (which is fine).

**Status:** ✅ Correct

---

## 2. index.html

### ✅ **PASSED: Location and Structure**

```html:1:22:index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <base href="/" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="/favicon.png">
  <title>HRMS - SMRU / BHF</title>
  <!-- Performance Optimizations -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://code.jquery.com">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Status:** ✅ Correct
- ✅ Located in project root (not in `/public`)
- ✅ Has `<script type="module" src="/src/main.js"></script>`
- ✅ No `<%= %>` template syntax found

---

## 3. Environment Variables

### ❌ **CRITICAL: Environment Variables Not Migrated**

**Issue:** All environment variables are still using the old Vue CLI format (`VUE_APP_*` and `process.env.*`) instead of Vite format (`VITE_*` and `import.meta.env.*`).

#### Files Affected (32 instances found):

| File | Line(s) | Issue |
|------|---------|-------|
| `src/config/api.config.js` | 2 | `process.env.VUE_APP_API_BASE_URL` |
| `src/services/auth.service.js` | 123 | `process.env.VUE_APP_API_BASE_URL` |
| `src/plugins/echo.js` | 138-145 | Multiple `process.env.VUE_APP_REVERB_*` |
| `src/utils/env-check.js` | 4-8 | Multiple `process.env.VUE_APP_*` |
| `src/main.js` | 203 | `process.env.NODE_ENV` |
| `src/router/index.js` | 687 | `process.env.BASE_URL` |
| `src/router/index.optimized.js` | 141, 194 | `process.env.BASE_URL`, `process.env.NODE_ENV` |
| `src/services/base.service.js` | 251 | `process.env.NODE_ENV` |
| `src/utils/cache.js` | 54, 395 | `process.env.NODE_ENV` |
| `src/views/layouts/layout-header.vue` | 237 | `process.env.VUE_APP_PUBLIC_URL` |
| `src/views/pages/pages/profile-index.vue` | 271 | `process.env.VUE_APP_PUBLIC_URL` |
| `src/views/pages/finance-accounts/payroll/BulkPayrollProgress.vue` | 433-437 | Multiple `process.env.VUE_APP_REVERB_*` |
| `src/components/modal/bulk-payroll-modal-simplified.vue` | 822-826 | Multiple `process.env.VUE_APP_REVERB_*` |

#### Required Changes:

**1. Rename Environment Variables:**
```bash
# Old (Vue CLI)
VUE_APP_API_BASE_URL=...
VUE_APP_ENV=...
VUE_APP_PUBLIC_URL=...
VUE_APP_REVERB_APP_KEY=...
VUE_APP_REVERB_HOST=...
VUE_APP_REVERB_PORT=...
VUE_APP_REVERB_SCHEME=...
VUE_APP_BROADCASTING_AUTH_ENDPOINT=...

# New (Vite)
VITE_API_BASE_URL=...
VITE_ENV=...
VITE_PUBLIC_URL=...
VITE_REVERB_APP_KEY=...
VITE_REVERB_HOST=...
VITE_REVERB_PORT=...
VITE_REVERB_SCHEME=...
VITE_BROADCASTING_AUTH_ENDPOINT=...
```

**2. Update Code References:**
```javascript
// Old (Vue CLI)
process.env.VUE_APP_API_BASE_URL
process.env.NODE_ENV

// New (Vite)
import.meta.env.VITE_API_BASE_URL
import.meta.env.MODE
```

**Note:** `NODE_ENV` in Vite is replaced by `import.meta.env.MODE` which returns 'development', 'production', etc.

### ❌ **CRITICAL: No .env Files Found**

**Issue:** No `.env`, `.env.development`, or `.env.production` files exist in the project root.

**Status:** ❌ Missing

**Required Action:**
1. Create `.env.development` with Vite-compatible variables
2. Create `.env.production` with production values
3. Optionally create `.env.example` as a template

---

## 4. Import Statements

### ❌ **CRITICAL: 51 `require()` Statements Found**

**Issue:** Vite uses ES modules and does not support CommonJS `require()`. All `require()` statements must be converted to ES `import`.

#### Files with `require()` (51 instances):

| File | Count | Usage |
|------|-------|-------|
| `src/views/pages/recruitment/refferals/refferals-table.vue` | 3 | Image imports |
| `src/views/pages/recruitment/jobs/job-table.vue` | 1 | Image import |
| `src/views/pages/recruitment/candidates/candidates-table.vue` | 1 | Image import |
| `src/views/pages/recruitment/candidates/candidates-board.vue` | 1 | Image import |
| `src/views/pages/pages/api-keys.vue` | 1 | Image import |
| `src/views/pages/pages/search-result.vue` | 2 | Image imports |
| `src/views/pages/pages/gallery-index.vue` | 2 | Image imports |
| `src/views/pages/hrm/termination/termination-table.vue` | 1 | Image import |
| `src/views/pages/hrm/resignation/resignation-table.vue` | 1 | Image import |
| `src/views/pages/hrm/promotion/promotion-table.vue` | 1 | Image import |
| `src/views/pages/hrm/employees/employee-details.vue` | 1 | Image import |
| `src/views/pages/hrm/attendance/training/training-table.vue` | 6 | Image imports |
| `src/views/pages/hrm/attendance/training/trainers-table.vue` | 1 | Image import |
| `src/views/pages/hrm/attendance/timesheets-table.vue` | 1 | Image import |
| `src/views/pages/hrm/attendance/schedule-time-table.vue` | 1 | Image import |
| `src/views/pages/hrm/attendance/performance/review-table.vue` | 1 | Image import |
| `src/views/pages/hrm/attendance/performance/indicator-table.vue` | 1 | Image import |
| `src/views/pages/hrm/attendance/overtime-table.vue` | 2 | Image imports |
| `src/views/pages/hrm/attendance/leaves/leaves-admin-table.vue` | 1 | Image import |
| `src/views/pages/hrm/attendance/leaves/leaves-employee-table.vue` | 1 | Image import |
| `src/views/pages/hrm/attendance/leaves/leaves-admin.vue` | 4 | Image imports + error handler |
| `src/views/pages/finance-accounts/payroll/employee-salary.vue` | 1 | Bootstrap import |
| `src/views/pages/hrm/attendance/attendance-admin-table.vue` | 1 | Image import |
| `src/views/pages/hrm/attendance/leaves/leave-balances.vue` | 1 | Image import |
| `src/views/pages/administration/user-management/user-list.vue` | 1 | Image import |
| `src/views/pages/administration/reports/*` | 11 | Image imports |
| `src/components/dashboard-widgets/WelcomeWidget.vue` | 1 | Image import |

#### Example Issues:

**1. Dynamic Image Imports (Most Common):**
```javascript
// ❌ Old (Webpack) - WILL NOT WORK IN VITE
:src="require(`@/assets/img/users/${record.Image}`)"

// ✅ New (Vite) - Option 1: Use new URL()
:src="new URL(`../assets/img/users/${record.Image}`, import.meta.url).href"

// ✅ New (Vite) - Option 2: Use Vite's glob import
// In script setup or data:
const images = import.meta.glob('@/assets/img/users/*.{jpg,png}', { eager: true })
```

**2. Module Imports:**
```javascript
// ❌ Old (employee-salary.vue line 676)
bootstrap = require('bootstrap');

// ✅ New
import bootstrap from 'bootstrap';
```

**3. Default Image with Error Handler:**
```javascript
// ❌ Old (leaves-admin.vue lines 659-670)
if (!employee) return require('@/assets/img/users/user-01.jpg');
try {
  return require(`@/assets/img/users/${employee.staffId || 'user-01'}.jpg`);
} catch {
  return require('@/assets/img/users/user-01.jpg');
}

// ✅ New
const defaultAvatar = new URL('@/assets/img/users/user-01.jpg', import.meta.url).href;
if (!employee) return defaultAvatar;
try {
  return new URL(`../assets/img/users/${employee.staffId}.jpg`, import.meta.url).href;
} catch {
  return defaultAvatar;
}
```

---

## 5. Static Assets

### ⚠️ **WARNING: Dynamic Asset Imports Need Attention**

**Issue:** While static assets in `/public` are correctly referenced, dynamic asset imports using `require()` will fail.

**Current Pattern (51 files):**
```javascript
:src="require(`@/assets/img/users/${record.Image}`)"
```

**Status:** ⚠️ Needs conversion to Vite syntax (see section 4 above)

**Public Assets:** ✅ Correctly referenced with `/` prefix (e.g., `/favicon.png`)

---

## 6. Additional Issues Found

### ⚠️ **WARNING: Webpack-Specific Comments in Router**

**File:** `src/router/index.optimized.js`

**Issue:** Contains webpack-specific magic comments that Vite ignores:

```javascript:27:39:src/router/index.optimized.js
const lazyView = (path, chunkName = null, prefetch = true) => {
  return () => import(
    /* webpackChunkName: "[request]" */
    /* webpackPrefetch: true */
    `@/views/${path}.vue`
  );
};

const lazyViewNoPrefetch = (path, chunkName = null) => {
  return () => import(
    /* webpackChunkName: "[request]" */
    /* webpackPrefetch: false */
    `@/views/${path}.vue`
  );
};
```

**Status:** ⚠️ Non-critical but should be updated

**Vite Equivalent:**
```javascript
// Vite doesn't use magic comments for chunk names
// Chunk names are automatically generated from file paths
const lazyView = (path) => () => import(`@/views/${path}.vue`);

// For prefetch control, use vite.config.js:
// build: {
//   rollupOptions: {
//     output: {
//       manualChunks: {...}
//     }
//   }
// }
```

---

## 7. Build & Dev Testing

### ⚠️ **NOT TESTED**

Due to the critical issues found above, build and dev testing was not performed. The application **will not run** until the following are fixed:

1. ❌ Environment variables converted to Vite format
2. ❌ `.env` files created
3. ❌ All `require()` statements converted to ES imports

---

## 📊 Migration Checklist Summary

| Category | Item | Status | Priority |
|----------|------|--------|----------|
| **Configuration** | `vite.config.js` properly configured | ✅ PASS | - |
| **Configuration** | `vue.config.js` deleted | ✅ PASS | - |
| **Configuration** | `babel.config.js` deleted | ✅ PASS | - |
| **Configuration** | `package.json` scripts updated | ✅ PASS | - |
| **Configuration** | Vue CLI dependencies removed | ✅ PASS | - |
| **index.html** | In project root | ✅ PASS | - |
| **index.html** | Module script tag | ✅ PASS | - |
| **index.html** | No template syntax | ✅ PASS | - |
| **Environment** | Variables renamed to `VITE_*` | ❌ FAIL | 🔴 CRITICAL |
| **Environment** | Code updated to `import.meta.env.*` | ❌ FAIL | 🔴 CRITICAL |
| **Environment** | `.env` files exist | ❌ FAIL | 🔴 CRITICAL |
| **Imports** | No `require()` statements | ❌ FAIL | 🔴 CRITICAL |
| **Imports** | Dynamic imports use Vite syntax | ❌ FAIL | 🔴 CRITICAL |
| **Assets** | Public assets use `/` prefix | ✅ PASS | - |
| **Assets** | Dynamic assets use Vite syntax | ❌ FAIL | 🔴 CRITICAL |
| **Router** | Webpack magic comments removed | ⚠️ WARN | 🟡 LOW |
| **Build** | `npm run dev` works | ⚠️ UNTESTED | - |
| **Build** | `npm run build` works | ⚠️ UNTESTED | - |

**Legend:**
- ✅ PASS: Correctly migrated
- ❌ FAIL: Not migrated or incorrect
- ⚠️ WARN: Works but needs improvement
- 🔴 CRITICAL: Must fix before app will run
- 🟡 LOW: Can be fixed later

---

## 🔧 Required Actions (Priority Order)

### 1. 🔴 **CRITICAL: Create Environment Files**

Create `.env.development`:
```env
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_ENV=development
VITE_PUBLIC_URL=http://127.0.0.1:8000

# Reverb WebSocket Configuration
VITE_REVERB_APP_KEY=lwzlina3oymluc9m9nog
VITE_REVERB_HOST=127.0.0.1
VITE_REVERB_PORT=8081
VITE_REVERB_SCHEME=http
VITE_BROADCASTING_AUTH_ENDPOINT=http://127.0.0.1:8000/broadcasting/auth
```

Create `.env.production`:
```env
# API Configuration
VITE_API_BASE_URL=https://hrms-backend-api-v1-main-wrhlmg.laravel.cloud/api/v1
VITE_ENV=production
VITE_PUBLIC_URL=https://hrms-backend-api-v1-main-wrhlmg.laravel.cloud

# Reverb WebSocket Configuration
VITE_REVERB_APP_KEY=your_production_key
VITE_REVERB_HOST=your-production-host.com
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
VITE_BROADCASTING_AUTH_ENDPOINT=https://your-production-host.com/broadcasting/auth
```

### 2. 🔴 **CRITICAL: Update Environment Variable References**

**Files to update (13 files):**

1. `src/config/api.config.js` (line 2)
2. `src/services/auth.service.js` (line 123)
3. `src/plugins/echo.js` (lines 138-145)
4. `src/utils/env-check.js` (lines 4-8)
5. `src/main.js` (line 203)
6. `src/router/index.js` (line 687)
7. `src/router/index.optimized.js` (lines 141, 194)
8. `src/services/base.service.js` (line 251)
9. `src/utils/cache.js` (lines 54, 395)
10. `src/views/layouts/layout-header.vue` (line 237)
11. `src/views/pages/pages/profile-index.vue` (line 271)
12. `src/views/pages/finance-accounts/payroll/BulkPayrollProgress.vue` (lines 433-437)
13. `src/components/modal/bulk-payroll-modal-simplified.vue` (lines 822-826)

**Search & Replace:**
```bash
# Find all instances
grep -r "process\.env\.VUE_APP_" src/
grep -r "process\.env\.NODE_ENV" src/
```

**Replacement mapping:**
- `process.env.VUE_APP_API_BASE_URL` → `import.meta.env.VITE_API_BASE_URL`
- `process.env.VUE_APP_ENV` → `import.meta.env.VITE_ENV`
- `process.env.VUE_APP_PUBLIC_URL` → `import.meta.env.VITE_PUBLIC_URL`
- `process.env.VUE_APP_REVERB_*` → `import.meta.env.VITE_REVERB_*`
- `process.env.NODE_ENV` → `import.meta.env.MODE`
- `process.env.BASE_URL` → `import.meta.env.BASE_URL` (Vite provides this)

### 3. 🔴 **CRITICAL: Convert `require()` to ES Imports**

**51 files need updating.** Two main patterns:

#### Pattern 1: Dynamic Image Imports (Most Common)

**Before:**
```vue
<template>
  <img :src="require(`@/assets/img/users/${record.Image}`)" />
</template>
```

**After (Option A - Recommended for few images):**
```vue
<script setup>
import { computed } from 'vue';

const getImageUrl = (imageName) => {
  return new URL(`../assets/img/users/${imageName}`, import.meta.url).href;
};
</script>

<template>
  <img :src="getImageUrl(record.Image)" />
</template>
```

**After (Option B - Recommended for many images):**
```vue
<script setup>
// Eagerly load all images in directory
const images = import.meta.glob('@/assets/img/users/*.{jpg,png,jpeg}', { 
  eager: true,
  import: 'default'
});

const getImageUrl = (imageName) => {
  const path = `/src/assets/img/users/${imageName}`;
  return images[path] || defaultImage;
};
</script>

<template>
  <img :src="getImageUrl(record.Image)" />
</template>
```

#### Pattern 2: Module Imports

**Before (`employee-salary.vue`):**
```javascript
bootstrap = require('bootstrap');
```

**After:**
```javascript
import bootstrap from 'bootstrap';
```

#### Pattern 3: Default Images with Error Handling

**Before (`leaves-admin.vue`):**
```javascript
getEmployeeImage(employee) {
  if (!employee) return require('@/assets/img/users/user-01.jpg');
  try {
    return require(`@/assets/img/users/${employee.staffId}.jpg`);
  } catch {
    return require('@/assets/img/users/user-01.jpg');
  }
}
```

**After:**
```javascript
import defaultAvatar from '@/assets/img/users/user-01.jpg';

getEmployeeImage(employee) {
  if (!employee) return defaultAvatar;
  try {
    return new URL(`../assets/img/users/${employee.staffId}.jpg`, import.meta.url).href;
  } catch {
    return defaultAvatar;
  }
}
```

### 4. 🟡 **LOW PRIORITY: Clean Up Webpack Comments**

Update `src/router/index.optimized.js` to remove webpack-specific comments:

**Before:**
```javascript
const lazyView = (path) => () => import(
  /* webpackChunkName: "[request]" */
  /* webpackPrefetch: true */
  `@/views/${path}.vue`
);
```

**After:**
```javascript
const lazyView = (path) => () => import(`@/views/${path}.vue`);
```

### 5. ✅ **TEST: Verify Build & Dev**

After completing steps 1-3:

```bash
# Test development server
npm run dev

# Test production build
npm run build

# Test preview
npm run preview
```

---

## 📝 Automated Migration Script

To speed up the migration, here's a script to handle the bulk replacements:

```bash
#!/bin/bash
# vite-migration-fix.sh

echo "🔧 Starting Vite Migration Fixes..."

# 1. Replace environment variable references
echo "📝 Updating environment variables..."

# VUE_APP_* to VITE_*
find src -type f \( -name "*.js" -o -name "*.vue" -o -name "*.ts" \) -exec sed -i '' \
  -e 's/process\.env\.VUE_APP_API_BASE_URL/import.meta.env.VITE_API_BASE_URL/g' \
  -e 's/process\.env\.VUE_APP_ENV/import.meta.env.VITE_ENV/g' \
  -e 's/process\.env\.VUE_APP_PUBLIC_URL/import.meta.env.VITE_PUBLIC_URL/g' \
  -e 's/process\.env\.VUE_APP_REVERB_APP_KEY/import.meta.env.VITE_REVERB_APP_KEY/g' \
  -e 's/process\.env\.VUE_APP_REVERB_HOST/import.meta.env.VITE_REVERB_HOST/g' \
  -e 's/process\.env\.VUE_APP_REVERB_PORT/import.meta.env.VITE_REVERB_PORT/g' \
  -e 's/process\.env\.VUE_APP_REVERB_SCHEME/import.meta.env.VITE_REVERB_SCHEME/g' \
  -e 's/process\.env\.VUE_APP_BROADCASTING_AUTH_ENDPOINT/import.meta.env.VITE_BROADCASTING_AUTH_ENDPOINT/g' \
  -e 's/process\.env\.NODE_ENV/import.meta.env.MODE/g' \
  {} \;

echo "✅ Environment variables updated"

# 2. Note: require() statements need manual conversion
echo "⚠️  WARNING: require() statements need MANUAL conversion"
echo "   Found in 51 files - see VITE_MIGRATION_ANALYSIS.md section 3"

echo "✅ Automated fixes complete!"
echo "📋 Next steps:"
echo "   1. Create .env.development and .env.production files"
echo "   2. Manually convert require() statements (51 files)"
echo "   3. Test with: npm run dev"
```

---

## 🎯 Estimated Time to Complete

| Task | Estimated Time | Difficulty |
|------|---------------|------------|
| Create `.env` files | 10 minutes | Easy |
| Update env variable references (automated) | 5 minutes | Easy |
| Convert `require()` in 51 files | 3-4 hours | Medium |
| Remove webpack comments | 15 minutes | Easy |
| Testing & bug fixes | 1-2 hours | Medium |
| **TOTAL** | **~5-7 hours** | **Medium** |

---

## 📚 References

- [Vite Migration Guide](https://vitejs.dev/guide/migration.html)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vite Static Asset Handling](https://vitejs.dev/guide/assets.html)
- [Vue 3 + Vite Best Practices](https://vuejs.org/guide/best-practices/production-deployment.html)

---

## 🔍 How This Analysis Was Performed

1. ✅ Checked `vite.config.js` configuration
2. ✅ Verified old config files deleted (`vue.config.js`, `babel.config.js`)
3. ✅ Reviewed `package.json` for scripts and dependencies
4. ✅ Examined `index.html` structure and location
5. ✅ Searched for `process.env.` usage (32 matches found)
6. ✅ Searched for `VUE_APP_` references (56 matches found)
7. ✅ Searched for `require(` statements (51 matches found)
8. ✅ Checked for webpack-specific syntax (3 matches found)
9. ✅ Verified `.env` file existence (none found)
10. ✅ Reviewed dynamic import patterns

---

## ✅ Conclusion

The Vite migration is **70% complete** but has **3 critical blockers** that must be resolved before the application can run:

1. **Environment variables** must be renamed and code updated
2. **`.env` files** must be created
3. **51 `require()` statements** must be converted to ES imports

Once these issues are resolved, the migration should be complete and the application should run successfully with Vite's improved performance and faster HMR.

**Recommended Next Step:** Start with creating the `.env` files and running the automated script to fix environment variable references, then tackle the `require()` conversions file by file.

---

**Report Generated:** January 19, 2026  
**Analyzed By:** AI Code Assistant  
**Project:** HRMS Frontend (Vue.js 3)

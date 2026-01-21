# Vite Migration Quick Fix Guide

**Quick reference for completing the Vite migration**

---

## 🚀 Quick Start (30 seconds)

```bash
# 1. Create environment files
touch .env.development .env.production

# 2. Run automated fix script (see below)
chmod +x vite-migration-fix.sh
./vite-migration-fix.sh

# 3. Manually fix require() statements (see patterns below)
```

---

## 📝 Step 1: Create `.env.development`

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

---

## 📝 Step 2: Create `.env.production`

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

---

## 🤖 Step 3: Run Automated Fix Script

Create `vite-migration-fix.sh`:

```bash
#!/bin/bash
echo "🔧 Fixing environment variables..."

# For macOS/Linux
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

echo "✅ Done!"
```

**For Windows PowerShell:**

```powershell
# vite-migration-fix.ps1
Write-Host "🔧 Fixing environment variables..." -ForegroundColor Cyan

Get-ChildItem -Path src -Recurse -Include *.js,*.vue,*.ts | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'process\.env\.VUE_APP_API_BASE_URL', 'import.meta.env.VITE_API_BASE_URL'
    $content = $content -replace 'process\.env\.VUE_APP_ENV', 'import.meta.env.VITE_ENV'
    $content = $content -replace 'process\.env\.VUE_APP_PUBLIC_URL', 'import.meta.env.VITE_PUBLIC_URL'
    $content = $content -replace 'process\.env\.VUE_APP_REVERB_APP_KEY', 'import.meta.env.VITE_REVERB_APP_KEY'
    $content = $content -replace 'process\.env\.VUE_APP_REVERB_HOST', 'import.meta.env.VITE_REVERB_HOST'
    $content = $content -replace 'process\.env\.VUE_APP_REVERB_PORT', 'import.meta.env.VITE_REVERB_PORT'
    $content = $content -replace 'process\.env\.VUE_APP_REVERB_SCHEME', 'import.meta.env.VITE_REVERB_SCHEME'
    $content = $content -replace 'process\.env\.VUE_APP_BROADCASTING_AUTH_ENDPOINT', 'import.meta.env.VITE_BROADCASTING_AUTH_ENDPOINT'
    $content = $content -replace 'process\.env\.NODE_ENV', 'import.meta.env.MODE'
    Set-Content $_.FullName -Value $content -NoNewline
}

Write-Host "✅ Done!" -ForegroundColor Green
```

---

## 🔧 Step 4: Fix `require()` Statements (Manual)

### Pattern 1: Dynamic Image Imports (Most Common - 48 files)

**❌ Before:**
```vue
<img :src="require(`@/assets/img/users/${record.Image}`)" />
```

**✅ After:**
```vue
<script setup>
const getImageUrl = (imageName) => {
  try {
    return new URL(`../assets/img/users/${imageName}`, import.meta.url).href;
  } catch (error) {
    return new URL('../assets/img/users/user-01.jpg', import.meta.url).href;
  }
};
</script>

<template>
  <img :src="getImageUrl(record.Image)" />
</template>
```

**Or use a composable (recommended for reuse):**

Create `src/composables/useAssetUrl.js`:
```javascript
export function useAssetUrl() {
  const getImageUrl = (path, fallback = '/assets/img/users/user-01.jpg') => {
    try {
      return new URL(`../${path}`, import.meta.url).href;
    } catch (error) {
      return new URL(`..${fallback}`, import.meta.url).href;
    }
  };

  return { getImageUrl };
}
```

Then in components:
```vue
<script setup>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getImageUrl } = useAssetUrl();
</script>

<template>
  <img :src="getImageUrl(`assets/img/users/${record.Image}`)" />
</template>
```

### Pattern 2: Static Image Import

**❌ Before:**
```javascript
defaultAvatar: require('@/assets/img/profiles/avatar-default.jpg')
```

**✅ After:**
```javascript
import defaultAvatar from '@/assets/img/profiles/avatar-default.jpg';

// In data() or setup():
defaultAvatar
```

### Pattern 3: Module Import

**❌ Before:**
```javascript
bootstrap = require('bootstrap');
```

**✅ After:**
```javascript
import bootstrap from 'bootstrap';
```

### Pattern 4: Image Array/Map

**❌ Before:**
```javascript
getImages() {
  return images.map((image) => require(`@/assets/img/media/${image}`));
}
```

**✅ After:**
```javascript
getImages() {
  return images.map((image) => 
    new URL(`../assets/img/media/${image}`, import.meta.url).href
  );
}
```

---

## 📋 Files That Need Manual Fixing (51 files)

### High Priority (Core functionality):
1. `src/views/layouts/layout-header.vue` - User avatar
2. `src/components/dashboard-widgets/WelcomeWidget.vue` - Welcome avatar
3. `src/views/pages/administration/user-management/user-list.vue` - User list
4. `src/views/pages/finance-accounts/payroll/employee-salary.vue` - Bootstrap import

### Medium Priority (Feature pages):
5-13. All files in `src/views/pages/hrm/attendance/leaves/`
14-20. All files in `src/views/pages/hrm/attendance/training/`
21-30. All files in `src/views/pages/administration/reports/`
31-40. All files in `src/views/pages/recruitment/`

### Low Priority (Less frequently used):
41-51. Remaining pages (see full analysis document)

---

## 🧪 Step 5: Test

```bash
# Start dev server
npm run dev

# Should start on http://localhost:3000
# Check console for errors

# Test build
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Common Errors & Fixes

### Error: "process is not defined"
**Cause:** Missed an environment variable conversion  
**Fix:** Search for remaining `process.env` references
```bash
grep -r "process\.env\." src/
```

### Error: "require is not defined"
**Cause:** Missed a `require()` statement  
**Fix:** Search for remaining requires
```bash
grep -r "require(" src/
```

### Error: "Failed to fetch dynamically imported module"
**Cause:** Incorrect dynamic import path  
**Fix:** Check the relative path in `new URL()` - it's relative to the current file

### Error: Image not loading
**Cause:** Wrong path in `new URL()`  
**Fix:** 
- Path should be relative to current file: `../assets/...`
- Or use absolute with `@/`: but wrap in try-catch

---

## 📊 Progress Tracker

- [ ] Create `.env.development`
- [ ] Create `.env.production`
- [ ] Run automated env variable fix script
- [ ] Fix `require()` in layout components (4 files)
- [ ] Fix `require()` in dashboard widgets (2 files)
- [ ] Fix `require()` in HRM pages (20 files)
- [ ] Fix `require()` in recruitment pages (8 files)
- [ ] Fix `require()` in reports pages (11 files)
- [ ] Fix `require()` in other pages (6 files)
- [ ] Remove webpack comments from router
- [ ] Test `npm run dev`
- [ ] Test `npm run build`
- [ ] Test `npm run preview`

---

## 🎯 Time Estimates

| Task | Time |
|------|------|
| Create .env files | 5 min |
| Run automated script | 2 min |
| Fix 4 critical files | 30 min |
| Fix 20 HRM files | 1 hour |
| Fix 19 other files | 1 hour |
| Fix remaining files | 1 hour |
| Testing & debugging | 1 hour |
| **TOTAL** | **~4-5 hours** |

---

## 💡 Pro Tips

1. **Use Find & Replace in VS Code:**
   - Search: `require\(\`@/assets/img/([^/]+)/\$\{([^}]+)\}\`\)`
   - This helps identify patterns quickly

2. **Test incrementally:**
   - Fix a few files, then test
   - Don't fix all 51 files before testing

3. **Create a composable:**
   - Makes the code cleaner and reusable
   - Easier to maintain

4. **Use TypeScript:**
   - Add type safety to your image imports
   - Catch errors at compile time

5. **Consider using Vite's glob import for large directories:**
   ```javascript
   const images = import.meta.glob('@/assets/img/**/*.{jpg,png}', { eager: true });
   ```

---

## 🆘 Need Help?

If you encounter issues:

1. Check the full analysis: `docs/migration/VITE_MIGRATION_ANALYSIS.md`
2. Check Vite docs: https://vitejs.dev/guide/
3. Check Vue 3 docs: https://vuejs.org/guide/
4. Search for error message in GitHub issues

---

**Last Updated:** January 19, 2026

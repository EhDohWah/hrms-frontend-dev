# HRMS Template Optimization Scripts

## Overview

This directory contains automated scripts and documentation for optimizing the purchased HRMS Vue.js template by removing unused features, dependencies, and components.

**Expected Results:**
- **Bundle Size Reduction**: 60-70%
- **Build Time Improvement**: 40-50%
- **node_modules Size**: 7.1GB → ~350MB (95% reduction)
- **Package Reduction**: 57 → ~35 packages (39% reduction)
- **File Reduction**: ~510 files removed (75% reduction)
- **Route Reduction**: ~150 unused routes removed

---

## 📁 Directory Contents

### Scripts (Execute in Order)

| Script | Purpose | Estimated Time | Risk Level |
|--------|---------|----------------|------------|
| `00-MASTER-CLEANUP.sh` | Orchestrates all optimization phases | 30-45 min | **High** |
| `01-verify-modal-usage.sh` | Verifies which modals are safe to delete | 2-3 min | **None** (Read-only) |
| `02-fix-node-modules.sh` | Fixes 7.1GB node_modules bloat | 10-15 min | **Medium** |
| `03-remove-unused-directories.sh` | Removes ~510 unused files | 2-3 min | **High** |
| `04-cleanup-router.js` | Optimized router configuration | N/A | **Medium** |
| `05-update-package-json.sh` | Removes 22 unused packages | 10-15 min | **Medium** |
| `05-package-json-optimized.json` | Optimized package.json template | N/A | **Medium** |

### Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | This file - Overview and usage guide |
| `TESTING-CHECKLIST.md` | Comprehensive testing checklist for all features |
| `ROLLBACK-PLAN.md` | Detailed rollback procedures if issues occur |

### Generated During Execution

| Directory/File | Purpose |
|----------------|---------|
| `cleanup-logs/` | Stores execution logs, reports, and backup lists |
| `cleanup-logs/modal-verification-report.txt` | Modal usage verification results |
| `cleanup-logs/deleted-directories-*.txt` | List of deleted directories |
| `cleanup-logs/cleanup-*.log` | Master script execution log |

---

## 🚀 Quick Start

### Prerequisites

1. **Git Repository**
   ```bash
   # Verify you have Git initialized
   git status

   # If not, initialize
   git init
   git add .
   git commit -m "Pre-optimization checkpoint"
   ```

2. **Create Safety Tag**
   ```bash
   git tag pre-optimization
   ```

3. **Create Full Backup**
   ```bash
   # Copy entire project to safe location
   cp -r /path/to/hrms-frontend-dev /path/to/backup/hrms-frontend-dev-backup
   ```

4. **Environment Check**
   ```bash
   # Verify Node.js and npm versions
   node --version   # Should be v16+ or v18+
   npm --version    # Should be v8+
   ```

---

## 📋 Execution Methods

### Method 1: Automated (Recommended for First-Time Users)

Run the master script which handles all phases interactively:

```bash
# Make scripts executable (Linux/Mac)
chmod +x cleanup-scripts/*.sh

# Run master script
bash cleanup-scripts/00-MASTER-CLEANUP.sh
```

The master script will:
- Run pre-flight checks
- Execute each phase with confirmation prompts
- Log all actions
- Verify each step
- Provide rollback instructions if needed

**Pros:**
- Guided process with confirmations
- Automated verification
- Comprehensive logging
- Safer for beginners

**Cons:**
- All-or-nothing approach (unless you skip phases)
- Requires more time to complete

---

### Method 2: Manual Phase-by-Phase (Recommended for Advanced Users)

Execute each script individually for more control:

#### Phase 1: Verify Modal Usage (REQUIRED FIRST)

```bash
bash cleanup-scripts/01-verify-modal-usage.sh > cleanup-logs/modal-verification-report.txt

# Review the report
cat cleanup-logs/modal-verification-report.txt
```

**Purpose**: Identifies which modal components are actually used

**What to look for**:
- ❌ UNUSED - Safe to delete
- ⚠️ LOW USAGE - Review carefully
- ✅ ACTIVELY USED - Must keep

**Decision**: Review report and confirm deletions are safe before proceeding

---

#### Phase 2: Fix node_modules Bloat (CRITICAL - DO THIS FIRST)

```bash
bash cleanup-scripts/02-fix-node-modules.sh
```

**Purpose**: Fixes the 7.1GB node_modules corruption

**What it does**:
1. Backs up package.json and package-lock.json
2. Deletes node_modules (7.1GB)
3. Deletes package-lock.json
4. Cleans npm cache
5. Reinstalls dependencies (~350MB)

**Time**: 10-15 minutes

**Verification**:
```bash
# Check size (should be ~350MB)
du -sh node_modules

# Verify app builds
npm run dev
```

**⚠️ IMPORTANT**: This must be done before other optimizations

---

#### Phase 3: Remove Unused Directories

```bash
bash cleanup-scripts/03-remove-unused-directories.sh
```

**Purpose**: Deletes ~510 unused files (75% reduction)

**What it removes**:
- Applications module
- CRM module
- Projects module
- Content management
- Sales module
- Accounting module
- Superadmin features
- Support/Knowledgebase
- Asset management
- Layout demos
- UI demos
- Unused settings pages

**Time**: 2-3 minutes

**Verification**:
```bash
# Check if app still builds
npm run dev

# Review deleted files list
cat cleanup-logs/deleted-directories-*.txt
```

**Rollback**: Use Git or backup if issues occur

---

#### Phase 4: Update Router Configuration

```bash
# Backup current router
cp src/router/index.js src/router/index.js.backup-$(date +%Y%m%d_%H%M%S)

# Replace with optimized version
cp cleanup-scripts/04-cleanup-router.js src/router/index.js
```

**Purpose**: Removes ~150 unused routes

**What it does**:
- Removes routes for deleted features
- Keeps only active feature routes
- Maintains proper navigation guards
- Preserves error pages

**Verification**:
```bash
# Build and test routing
npm run dev

# Test critical routes:
# - /dashboard
# - /employee/employee-list
# - /grant/list
# - /hrm/leaves/admin
# - /payroll/employee-salary
```

**Rollback**:
```bash
cp src/router/index.js.backup-* src/router/index.js
```

---

#### Phase 5: Optimize Package Dependencies

```bash
bash cleanup-scripts/05-update-package-json.sh
```

**Purpose**: Removes 22 unused npm packages (39% reduction)

**What it removes**:
- 10 unused icon libraries (keeping only Tabler Icons)
- 5 unused UI libraries
- 4 unused editors
- Vuex (replaced by Pinia)
- Vuelidate (using Vee-Validate + Yup)

**Time**: 10-15 minutes (includes npm install)

**Verification**:
```bash
# Check package count
npm list --depth=0

# Verify build
npm run dev
npm run build
```

**Rollback**:
```bash
cp package.json.backup-* package.json
rm -rf node_modules package-lock.json
npm install
```

---

#### Phase 6: Update Lazy Components

```bash
# Backup current file
cp src/plugins/lazy-components.js src/plugins/lazy-components.js.backup-$(date +%Y%m%d_%H%M%S)

# Replace with optimized version
cp src/plugins/lazy-components-OPTIMIZED.js src/plugins/lazy-components.js
```

**Purpose**: Removes ~45 unused lazy component imports

**What it does**:
- Removes imports for deleted modals
- Removes unused table components
- Removes unused page components
- Keeps only actively used components

**Verification**:
```bash
# Check console logs for component registration
npm run dev

# Should show reduced component count
# Test modal opening/closing
```

**Rollback**:
```bash
cp src/plugins/lazy-components.js.backup-* src/plugins/lazy-components.js
```

---

## ✅ Testing & Verification

After completing optimization, follow the comprehensive testing checklist:

```bash
# Open testing checklist
cat cleanup-scripts/TESTING-CHECKLIST.md
```

**Critical Tests**:
1. ✅ Application builds: `npm run dev`
2. ✅ Production build: `npm run build`
3. ✅ Login works
4. ✅ Dashboard loads
5. ✅ All active features accessible
6. ✅ No console errors
7. ✅ Modals open/close correctly
8. ✅ Routes navigate properly

**Performance Tests**:
1. ✅ Build time reduced by 40-50%
2. ✅ Bundle size reduced by 60-70%
3. ✅ Dev server starts faster
4. ✅ Hot reload works correctly

---

## 🔄 Rollback Procedures

If issues occur, refer to the rollback plan:

```bash
# View rollback procedures
cat cleanup-scripts/ROLLBACK-PLAN.md
```

### Quick Rollback (Git Method - FASTEST)

```bash
# Reset to pre-optimization state
git reset --hard pre-optimization
git clean -fd

# Reinstall dependencies
rm -rf node_modules
npm install

# Verify
npm run dev
```

### Selective Rollback

```bash
# Rollback specific files
git checkout -- src/router/index.js
git checkout -- src/plugins/lazy-components.js

# Rollback specific directories
git checkout -- src/views/pages/
git checkout -- src/components/modal/
```

---

## 📊 Expected Results

### Before Optimization

```
node_modules:        7.1 GB
Total packages:      57
Total Vue files:     680
Production build:    ~15 MB
Build time:          ~60 seconds
Dev server start:    ~15 seconds
```

### After Optimization

```
node_modules:        ~350 MB  (95% reduction)
Total packages:      ~35      (39% reduction)
Total Vue files:     ~170     (75% reduction)
Production build:    ~5 MB    (67% reduction)
Build time:          ~30 sec  (50% faster)
Dev server start:    ~5 sec   (67% faster)
```

---

## ⚠️ Important Notes

### Before You Start

1. **Commit Everything to Git**
   ```bash
   git add .
   git commit -m "Pre-optimization checkpoint"
   git tag pre-optimization
   ```

2. **Create Full Backup**
   - Copy entire project directory
   - Store in safe location
   - Verify backup is complete

3. **Test Current State**
   - Ensure application currently works
   - Document any existing issues
   - Take screenshots of working features

4. **Read All Documentation**
   - Review TESTING-CHECKLIST.md
   - Review ROLLBACK-PLAN.md
   - Understand what each script does

### During Execution

1. **Run Scripts in Order**
   - Phase order matters
   - Don't skip Phase 2 (node_modules fix)
   - Test after each phase

2. **Review Verification Reports**
   - Check modal verification before deletion
   - Review deletion logs
   - Monitor console for errors

3. **Test Incrementally**
   - Build after each phase
   - Test critical features
   - Don't proceed if issues occur

### After Completion

1. **Comprehensive Testing**
   - Use TESTING-CHECKLIST.md
   - Test ALL features listed
   - Document any issues

2. **Performance Verification**
   - Measure build time
   - Check bundle size
   - Verify metrics meet targets

3. **Documentation**
   - Update README.md with changes
   - Document any custom modifications
   - Update deployment notes

---

## 🐛 Troubleshooting

### Issue: Scripts won't execute

**Solution:**
```bash
# Make scripts executable (Linux/Mac)
chmod +x cleanup-scripts/*.sh

# Or run with bash explicitly
bash cleanup-scripts/00-MASTER-CLEANUP.sh
```

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Router errors after optimization

**Solution:**
```bash
# Restore router from backup
cp src/router/index.js.backup-* src/router/index.js

# Or from Git
git checkout -- src/router/index.js
```

### Issue: Modals not opening

**Solution:**
```bash
# Check if modal component exists
ls src/components/modal/

# Restore lazy-components.js
cp src/plugins/lazy-components.js.backup-* src/plugins/lazy-components.js
```

### Issue: Build errors

**Solution:**
```bash
# Full reset
git checkout -- .
rm -rf node_modules
npm install
npm run dev
```

---

## 📝 Logs and Reports

All execution logs are stored in `cleanup-logs/`:

```bash
# View modal verification report
cat cleanup-logs/modal-verification-report.txt

# View deleted directories list
cat cleanup-logs/deleted-directories-*.txt

# View master script execution log
cat cleanup-logs/cleanup-*.log
```

---

## 🤝 Support

### Getting Help

1. **Review Documentation**
   - Read TESTING-CHECKLIST.md
   - Read ROLLBACK-PLAN.md
   - Check troubleshooting section

2. **Check Logs**
   - Review cleanup-logs/ directory
   - Look for error messages
   - Check console output

3. **Use Git History**
   ```bash
   # See what changed
   git diff pre-optimization

   # View commit history
   git log --oneline
   ```

4. **Rollback if Needed**
   - Follow ROLLBACK-PLAN.md
   - Restore from Git
   - Use backups if necessary

---

## 📚 Additional Resources

### Files Modified by Optimization

- `package.json` - Dependency optimization
- `src/router/index.js` - Route cleanup
- `src/plugins/lazy-components.js` - Component optimization
- `src/views/pages/*` - Directory deletions
- `src/components/modal/*` - Modal deletions
- `src/views/layouts/*` - Layout file deletions

### Files Preserved

- All authentication components
- All active feature pages
- All services and stores
- All utilities and composables
- API configurations
- Asset files (images, styles)
- All required modals

---

## 🎯 Success Criteria

Optimization is successful when:

- [x] Application builds without errors
- [x] All active features work correctly
- [x] No console errors
- [x] Build time reduced by 40-50%
- [x] Bundle size reduced by 60-70%
- [x] node_modules size ~350MB
- [x] Dev server starts faster
- [x] All tests in TESTING-CHECKLIST.md pass

---

## 📅 Maintenance

### After Optimization

1. **Keep Scripts**
   - Don't delete cleanup-scripts/ directory
   - May need for future reference
   - Rollback procedures still useful

2. **Update Documentation**
   - Reflect new structure in project docs
   - Update README.md
   - Document any customizations

3. **Monitor Performance**
   - Track build times
   - Monitor bundle sizes
   - Watch for regressions

---

## ⚙️ Version Information

- **Created**: 2025-12-30
- **Template Version**: Themeforest HRMS Template
- **Framework**: Vue.js 3.5.12
- **Build Tool**: Vue CLI 5.0.8
- **Package Manager**: npm

---

## 📄 License

These optimization scripts are provided as-is for use with your purchased HRMS template. Modify as needed for your specific requirements.

---

**Happy Optimizing! 🚀**

For questions or issues, refer to ROLLBACK-PLAN.md or restore from your Git backup.

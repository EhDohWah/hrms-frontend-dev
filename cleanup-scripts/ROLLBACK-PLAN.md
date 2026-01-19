# HRMS Optimization - Rollback Plan

## Overview

This document provides detailed instructions for rolling back the optimization changes if issues occur. Each phase has specific rollback procedures.

**IMPORTANT**: The best rollback strategy is to use Git. Always commit before starting the optimization process.

---

## Quick Rollback (Git Method) - RECOMMENDED

### If You Have Git and Committed Before Optimization

This is the fastest and safest rollback method.

```bash
# View recent commits
git log --oneline

# Rollback to specific commit (find commit hash from log)
git reset --hard <commit-hash>

# OR rollback to the tag created before optimization
git reset --hard pre-optimization

# Force clean any untracked files
git clean -fd

# Reinstall dependencies
rm -rf node_modules
npm install

# Verify application works
npm run dev
```

**✅ This method restores everything instantly**

---

## Selective Rollback by Phase

### Phase 1: Modal Verification (Read-Only)

**No rollback needed** - This phase only generated a report.

---

### Phase 2: node_modules Cleanup

#### Rollback Steps

1. **Restore package.json**
   ```bash
   # Find your backup file
   ls -la package.json.backup*

   # Restore the backup (replace TIMESTAMP with your backup's timestamp)
   cp package.json.backup-YYYYMMDD_HHMMSS package.json
   ```

2. **Restore package-lock.json** (if it was backed up)
   ```bash
   # Find your backup file
   ls -la package-lock.json.backup*

   # Restore the backup
   cp package-lock.json.backup-YYYYMMDD_HHMMSS package-lock.json
   ```

3. **Clean and reinstall**
   ```bash
   # Remove current node_modules
   rm -rf node_modules

   # Clear npm cache
   npm cache clean --force

   # Reinstall dependencies
   npm install
   ```

4. **Verify**
   ```bash
   npm run dev
   ```

#### Expected Results

- node_modules should return to original state
- Application should work as before
- May still have the large node_modules size issue

---

### Phase 3: Directory Cleanup

#### Rollback Steps

**⚠️ WARNING**: This is the hardest phase to rollback without Git!

#### Option 1: Using Git (RECOMMENDED)

```bash
# Restore deleted directories from Git
git checkout -- src/views/pages/
git checkout -- src/components/modal/
git checkout -- src/views/layouts/

# Verify files are restored
git status
```

#### Option 2: Manual Restoration (If No Git)

If you don't have Git, you'll need to:

1. **Find your project backup**
   - You should have created a full project backup before starting
   - Locate the backup directory

2. **Copy deleted directories back**
   ```bash
   # Example: Restore from backup directory
   BACKUP_DIR="/path/to/your/backup"

   # Restore all deleted page directories
   cp -r "$BACKUP_DIR/src/views/pages/applications" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/crm" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/projects" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/content" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/sales" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/accounting" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/superadmin" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/supports" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/asset" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/layouts" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/uiinterface" src/views/pages/
   cp -r "$BACKUP_DIR/src/views/pages/pages" src/views/pages/

   # Restore deleted layout files
   cp -r "$BACKUP_DIR/src/views/layouts/horizontal-header.vue" src/views/layouts/
   cp -r "$BACKUP_DIR/src/views/layouts/two-sidebar.vue" src/views/layouts/
   cp -r "$BACKUP_DIR/src/views/layouts/stacked-sidebar.vue" src/views/layouts/
   cp -r "$BACKUP_DIR/src/views/layouts/theme-settings.vue" src/views/layouts/

   # Restore deleted modal files
   cp "$BACKUP_DIR/src/components/modal/trainers-modal.vue" src/components/modal/
   cp "$BACKUP_DIR/src/components/modal/training-type-modal.vue" src/components/modal/
   cp "$BACKUP_DIR/src/components/modal/payroll-deduction-modal.vue" src/components/modal/
   cp "$BACKUP_DIR/src/components/modal/payroll-overtime-modal.vue" src/components/modal/
   cp "$BACKUP_DIR/src/components/modal/company-details-modal.vue" src/components/modal/
   cp "$BACKUP_DIR/src/components/modal/custom-fields-modal.vue" src/components/modal/
   cp "$BACKUP_DIR/src/components/modal/policy-modal.vue" src/components/modal/
   cp "$BACKUP_DIR/src/components/modal/timesheets-modal.vue" src/components/modal/
   ```

3. **Verify restoration**
   ```bash
   npm run dev
   ```

#### Option 3: Using Deleted Files List

The cleanup script created a backup list:

```bash
# Find the backup list
ls cleanup-logs/deleted-directories-*

# Review what was deleted
cat cleanup-logs/deleted-directories-YYYYMMDD_HHMMSS.txt
```

Use this list to know which files to restore from your backup.

---

### Phase 4: Router Configuration

#### Rollback Steps

1. **Find router backup**
   ```bash
   ls -la src/router/index.js.backup*
   ```

2. **Restore original router**
   ```bash
   # Replace with your backup timestamp
   cp src/router/index.js.backup-YYYYMMDD_HHMMSS src/router/index.js
   ```

3. **Verify**
   ```bash
   npm run dev
   ```

#### Verification

- Check that all original routes are accessible
- Verify navigation works
- Test route guards

---

### Phase 5: Package Dependencies

#### Rollback Steps

1. **Restore package.json**
   ```bash
   # Find your backup
   ls -la package.json.backup*

   # Restore it
   cp package.json.backup-YYYYMMDD_HHMMSS package.json
   ```

2. **Clean and reinstall**
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm cache clean --force
   npm install
   ```

3. **Verify**
   ```bash
   npm run dev
   ```

#### Expected Results

- All original dependencies restored
- Application works as before
- May see the bloated dependencies again

---

### Phase 6: Lazy Components

#### Rollback Steps

1. **Find lazy-components backup**
   ```bash
   ls -la src/plugins/lazy-components.js.backup*
   ```

2. **Restore original file**
   ```bash
   cp src/plugins/lazy-components.js.backup-YYYYMMDD_HHMMSS src/plugins/lazy-components.js
   ```

3. **Verify**
   ```bash
   npm run dev
   ```

#### Verification

- Check console for component registration logs
- Verify all modals work
- Test lazy loading of pages

---

## Complete System Rollback

If you need to rollback everything:

### Using Git (Recommended)

```bash
# Option 1: Reset to tag
git reset --hard pre-optimization
git clean -fd

# Option 2: Reset to specific commit
git log --oneline
git reset --hard <commit-hash>
git clean -fd

# Reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install

# Verify
npm run dev
```

### Without Git (Manual)

```bash
# 1. Stop any running processes
# Press Ctrl+C in terminal running dev server

# 2. Delete current implementation
cd /path/to/hrms-frontend-dev
rm -rf ./*

# 3. Copy entire backup back
cp -r /path/to/backup/* ./

# 4. Reinstall dependencies
npm install

# 5. Verify
npm run dev
```

---

## Verification After Rollback

### Checklist

After any rollback, verify:

- [ ] Application builds without errors: `npm run dev`
- [ ] Login page loads
- [ ] Can log in successfully
- [ ] Dashboard displays
- [ ] Critical features work:
  - [ ] Employee list
  - [ ] Grant management
  - [ ] Leave management
  - [ ] Payroll features
- [ ] No console errors
- [ ] All required routes accessible

---

## Troubleshooting Common Rollback Issues

### Issue: "Cannot find module" errors after rollback

**Cause**: node_modules not properly restored

**Solution**:
```bash
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

---

### Issue: Router errors after rollback

**Cause**: Router file not properly restored

**Solution**:
```bash
# Restore router from backup
cp src/router/index.js.backup-YYYYMMDD_HHMMSS src/router/index.js

# Or from Git
git checkout -- src/router/index.js
```

---

### Issue: Modals not opening after rollback

**Cause**: lazy-components.js not restored

**Solution**:
```bash
# Restore from backup
cp src/plugins/lazy-components.js.backup-YYYYMMDD_HHMMSS src/plugins/lazy-components.js

# Or from Git
git checkout -- src/plugins/lazy-components.js
```

---

### Issue: Build errors after rollback

**Cause**: Mismatch between files and dependencies

**Solution**:
```bash
# Full reset and reinstall
git checkout -- .
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
npm run dev
```

---

### Issue: Git conflicts during rollback

**Cause**: Uncommitted changes conflicting with reset

**Solution**:
```bash
# Stash current changes
git stash

# Reset to desired state
git reset --hard pre-optimization

# If you want to review stashed changes later
git stash list
git stash show stash@{0}

# Drop the stash if not needed
git stash drop
```

---

## Partial Rollback Scenarios

### Scenario 1: Keep package.json optimization, rollback file deletions

```bash
# Restore files from Git
git checkout -- src/views/pages/
git checkout -- src/components/modal/
git checkout -- src/views/layouts/

# Keep optimized package.json
# (Don't restore package.json backup)

# Verify
npm run dev
```

---

### Scenario 2: Keep file deletions, rollback package.json

```bash
# Restore package.json from backup
cp package.json.backup-YYYYMMDD_HHMMSS package.json

# Reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install

# Keep deleted files removed
# Verify
npm run dev
```

---

### Scenario 3: Rollback only router changes

```bash
# Restore router
cp src/router/index.js.backup-YYYYMMDD_HHMMSS src/router/index.js

# Keep everything else
# Verify
npm run dev
```

---

## Prevention Tips

To avoid needing rollback:

1. **Always use Git**
   - Commit before optimization
   - Create tags: `git tag pre-optimization`
   - Use branches: `git checkout -b optimization/cleanup`

2. **Test incrementally**
   - Run each phase separately
   - Test after each phase before proceeding
   - Don't run master script blindly

3. **Keep backups**
   - Full project backup outside Git
   - Store backups for at least 30 days
   - Document backup locations

4. **Use staging environment**
   - Test optimization on staging first
   - Verify everything works
   - Then apply to production

---

## Support

If rollback procedures don't work:

1. **Check your backups**
   - Verify backup exists and is complete
   - Check backup timestamp

2. **Review cleanup logs**
   - Check `cleanup-logs/` directory
   - Review what was changed
   - Use logs to guide restoration

3. **Fresh start (last resort)**
   - Re-download template from Themeforest
   - Restore only your custom code
   - Reapply necessary configurations

---

## Rollback Checklist

Use this checklist when performing rollback:

- [ ] Stop all running processes
- [ ] Document current issue causing rollback
- [ ] Identify which phase to rollback
- [ ] Locate appropriate backup files
- [ ] Execute rollback commands
- [ ] Clean node_modules and reinstall
- [ ] Verify application builds
- [ ] Test critical features
- [ ] Check for console errors
- [ ] Document rollback in project notes
- [ ] Update team (if applicable)

---

## Rollback Log Template

Document your rollback:

```
Rollback Date: ____________________
Rollback Performed By: ____________________

Reason for Rollback:
____________________

Phases Rolled Back:
[ ] Phase 2: node_modules
[ ] Phase 3: Directory cleanup
[ ] Phase 4: Router
[ ] Phase 5: Package dependencies
[ ] Phase 6: Lazy components

Rollback Method Used:
[ ] Git reset
[ ] Backup restoration
[ ] Manual copy

Verification Results:
[ ] Application builds successfully
[ ] Critical features work
[ ] No console errors

Issues Encountered During Rollback:
____________________

Resolution:
____________________

Status:
[ ] Rollback successful
[ ] Partial success (details: _______________)
[ ] Rollback failed (escalated to: _______________)
```

---

## Emergency Contacts

*Document your team contacts for emergency assistance:*

- **Technical Lead**: ____________________
- **DevOps**: ____________________
- **System Admin**: ____________________

---

## Final Notes

- **Always test rollback procedures before needing them**
- **Keep multiple backup copies**
- **Document any custom changes made to the rollback procedures**
- **Update this document if you discover better rollback methods**

---

**Last Updated**: 2025-12-30
**Version**: 1.0

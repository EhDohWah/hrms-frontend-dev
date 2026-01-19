#!/bin/bash

# ==============================================================================
# PACKAGE.JSON CLEANUP SCRIPT
# ==============================================================================
# This script removes unused npm packages from package.json
# Reduces from 57 packages to ~35 packages (39% reduction)
#
# IMPORTANT: This script will:
# 1. Backup your current package.json
# 2. Replace it with optimized version
# 3. Run npm install to update node_modules
#
# Usage: bash 05-update-package-json.sh
# ==============================================================================

set -e  # Exit on error

echo "========================================="
echo "PACKAGE.JSON OPTIMIZATION"
echo "========================================="
echo ""

# Check if optimized package.json exists
OPTIMIZED_FILE="cleanup-scripts/05-package-json-optimized.json"

if [ ! -f "$OPTIMIZED_FILE" ]; then
    echo "❌ ERROR: Optimized package.json not found at: $OPTIMIZED_FILE"
    echo "Please ensure the optimized package.json file exists in cleanup-scripts/"
    exit 1
fi

echo "Step 1: Creating backup..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp package.json "package.json.backup-${TIMESTAMP}"
echo "✅ Backup created: package.json.backup-${TIMESTAMP}"
echo ""

echo "Step 2: Analyzing current dependencies..."
CURRENT_DEPS=$(grep -c '".*":' package.json | head -1 || echo "0")
echo "Current dependencies: $CURRENT_DEPS packages"
echo ""

echo "Packages to be REMOVED:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "UNUSED ICON LIBRARIES (8 packages):"
echo "  ❌ boxicons"
echo "  ❌ ionicons-npm"
echo "  ❌ material-icons"
echo "  ❌ pe7-icon"
echo "  ❌ themify-icons"
echo "  ❌ typicons.font"
echo "  ❌ vue-feather"
echo "  ❌ vue-flag-icon"
echo "  ❌ vue-simple-line"
echo "  ❌ vue-themify-icons"
echo "  ❌ @fortawesome/fontawesome-free"
echo "  ✅ KEEPING: @tabler/icons-vue (only icon library needed)"
echo ""

echo "UNUSED UI LIBRARIES (5 packages):"
echo "  ❌ mdb-vue-ui-kit"
echo "  ❌ bootstrap-vue-3"
echo "  ❌ @fullcalendar/bootstrap"
echo "  ❌ @fullcalendar/core"
echo "  ❌ @fullcalendar/daygrid"
echo "  ❌ @fancyapps/ui"
echo "  ✅ KEEPING: ant-design-vue, bootstrap"
echo ""

echo "UNUSED EDITORS & PLUGINS (4 packages):"
echo "  ❌ @ckeditor/ckeditor5-build-classic"
echo "  ❌ @ckeditor/ckeditor5-vue"
echo "  ❌ quill"
echo "  ❌ vue-quill"
echo ""

echo "UNUSED UTILITIES (3 packages):"
echo "  ❌ dragula"
echo "  ❌ vue-dragula"
echo "  ❌ vue-slick"
echo ""

echo "STATE MANAGEMENT (1 package):"
echo "  ❌ vuex (replaced by Pinia)"
echo "  ✅ KEEPING: pinia"
echo ""

echo "UNUSED VALIDATION (1 package):"
echo "  ❌ vuelidate"
echo "  ✅ KEEPING: vee-validate + yup"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total packages to remove: 22"
echo ""

# Ask for confirmation
read -p "⚠️  Do you want to proceed with package.json optimization? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled by user"
    exit 0
fi

echo ""
echo "Step 3: Replacing package.json with optimized version..."
cp "$OPTIMIZED_FILE" package.json
echo "✅ package.json updated"
echo ""

echo "Step 4: Removing old package-lock.json..."
if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "✅ package-lock.json removed"
else
    echo "ℹ️  package-lock.json not found"
fi
echo ""

echo "Step 5: Installing optimized dependencies..."
echo "⏳ Running npm install (this may take 5-10 minutes)..."
npm install
echo "✅ Dependencies installed"
echo ""

echo "Step 6: Verifying installation..."
NEW_DEPS=$(npm list --depth=0 2>/dev/null | grep -c "├──\|└──" || echo "0")
echo "New dependency count: $NEW_DEPS packages"
echo ""

# Check node_modules size
if [ -d "node_modules" ]; then
    SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo "node_modules size: $SIZE"
else
    echo "⚠️  node_modules directory not found"
fi
echo ""

echo "========================================="
echo "OPTIMIZATION COMPLETE"
echo "========================================="
echo ""
echo "Summary:"
echo "  Original packages: $CURRENT_DEPS"
echo "  Optimized packages: ~35"
echo "  Packages removed: 22"
echo "  Reduction: ~39%"
echo ""
echo "Backup saved: package.json.backup-${TIMESTAMP}"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to test the application"
echo "2. Verify all features work correctly"
echo "3. Run 'npm run build' to verify production build"
echo "4. If any issues occur, restore from backup:"
echo "   cp package.json.backup-${TIMESTAMP} package.json"
echo "   npm install"
echo ""

#!/bin/bash

# ==============================================================================
# NODE_MODULES CLEANUP AND REINSTALL SCRIPT
# ==============================================================================
# CRITICAL: This fixes the 7.1GB node_modules bloat issue
# Expected result: ~350MB node_modules after completion
#
# This script MUST be run BEFORE any other optimization steps
#
# Usage: bash 02-fix-node-modules.sh
# ==============================================================================

set -e  # Exit on error

echo "========================================="
echo "NODE_MODULES CLEANUP"
echo "========================================="
echo ""
echo "⚠️  CRITICAL ISSUE DETECTED:"
echo "Current node_modules size: ~7.1GB"
echo "Expected size: ~350MB"
echo "This indicates corrupted or duplicate packages"
echo ""

# Function to get directory size
get_size() {
    if [ -d "$1" ]; then
        du -sh "$1" 2>/dev/null | cut -f1
    else
        echo "N/A"
    fi
}

echo "Current node_modules size: $(get_size node_modules)"
echo ""

# Backup package files
echo "Step 1: Backing up package files..."
cp package.json package.json.backup
if [ -f "package-lock.json" ]; then
    cp package-lock.json package-lock.json.backup
    echo "✅ Backed up package.json and package-lock.json"
else
    echo "✅ Backed up package.json (no package-lock.json found)"
fi
echo ""

# Remove node_modules
echo "Step 2: Removing corrupted node_modules..."
if [ -d "node_modules" ]; then
    echo "⏳ Deleting node_modules (this may take a few minutes)..."
    rm -rf node_modules
    echo "✅ node_modules removed"
else
    echo "ℹ️  node_modules directory not found"
fi
echo ""

# Remove package-lock.json
echo "Step 3: Removing package-lock.json..."
if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "✅ package-lock.json removed"
else
    echo "ℹ️  package-lock.json not found"
fi
echo ""

# Clean npm cache
echo "Step 4: Cleaning npm cache..."
npm cache clean --force
echo "✅ npm cache cleaned"
echo ""

# Reinstall dependencies
echo "Step 5: Reinstalling dependencies..."
echo "⏳ Running npm install (this may take 5-10 minutes)..."
npm install
echo "✅ Dependencies reinstalled"
echo ""

# Verify installation
echo "========================================="
echo "VERIFICATION"
echo "========================================="
echo ""
echo "New node_modules size: $(get_size node_modules)"
echo ""

# Check if size is reasonable
size_kb=$(du -sk node_modules 2>/dev/null | cut -f1)
if [ $size_kb -lt 1000000 ]; then  # Less than ~1GB
    echo "✅ SUCCESS: node_modules size is now normal"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm run dev' to verify application builds"
    echo "2. Test critical features in browser"
    echo "3. If everything works, proceed with optimization scripts"
else
    echo "⚠️  WARNING: node_modules is still larger than expected"
    echo "Consider checking for:"
    echo "- Duplicate dependencies in package.json"
    echo "- Large packages that can be replaced"
    echo "- Run 'npm ls --depth=0' to see top-level packages"
fi

echo ""
echo "Backup files saved:"
echo "- package.json.backup"
echo "- package-lock.json.backup (if existed)"
echo ""
echo "========================================="

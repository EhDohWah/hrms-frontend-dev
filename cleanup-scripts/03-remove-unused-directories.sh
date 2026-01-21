#!/bin/bash

# ==============================================================================
# REMOVE UNUSED DIRECTORIES SCRIPT
# ==============================================================================
# This script removes entire feature directories that are not in use
# Based on the analysis of required vs unused features
#
# IMPORTANT: Review the list carefully before running
# Creates backup list before deletion
#
# Usage: bash 03-remove-unused-directories.sh
# ==============================================================================

set -e  # Exit on error

echo "========================================="
echo "REMOVE UNUSED DIRECTORIES"
echo "========================================="
echo ""

# Create backup directory list
echo "Creating backup list of directories to be deleted..."
mkdir -p cleanup-logs
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_LIST="cleanup-logs/deleted-directories-${TIMESTAMP}.txt"

# Function to safely remove directory
remove_directory() {
    local dir_path=$1
    local description=$2

    if [ -d "$dir_path" ]; then
        echo "$dir_path" >> "$BACKUP_LIST"
        echo "🗑️  Removing: $dir_path"
        echo "   ($description)"
        rm -rf "$dir_path"
        echo "   ✅ Deleted"
    else
        echo "ℹ️  Not found: $dir_path (already deleted or doesn't exist)"
    fi
    echo ""
}

echo "Backup list will be saved to: $BACKUP_LIST"
echo ""
echo "========================================="
echo "PHASE 1: Remove Unused Feature Directories"
echo "========================================="
echo ""

# Applications Module (unused)
remove_directory "src/views/pages/applications" "Complete applications module - not in requirements"

# CRM Module (unused)
remove_directory "src/views/pages/crm" "Complete CRM module - not in requirements"

# Projects Module (unused)
remove_directory "src/views/pages/projects" "Complete projects module - not in requirements"

# Content Management (unused)
remove_directory "src/views/pages/content" "Content/blog management - not in requirements"

# Sales Module (unused)
remove_directory "src/views/pages/sales" "Sales module - not in requirements"

# Accounting (unused - keeping only payroll)
echo "⚠️  Note: Keeping payroll, removing general accounting..."
remove_directory "src/views/pages/accounting" "General accounting (payroll kept separately in finance-accounts)"

# Superadmin (unused)
remove_directory "src/views/pages/superadmin" "Superadmin features - not in requirements"

# Support/Knowledgebase (unused)
remove_directory "src/views/pages/supports" "Support ticket system - not in requirements"
remove_directory "src/views/pages/knowledgebase" "Knowledge base - not in requirements"

# Assets Management (unused)
remove_directory "src/views/pages/asset" "Asset management module - not in requirements"

# Layout demos (unused)
remove_directory "src/views/pages/layouts" "Layout demonstration pages"

# UI demo pages (unused)
remove_directory "src/views/pages/uiinterface" "UI component demos"
remove_directory "src/views/pages/pages" "Generic demo pages"

echo "========================================="
echo "PHASE 2: Remove Unused Layout Components"
echo "========================================="
echo ""

remove_directory "src/views/layouts/horizontal-header.vue" "Unused horizontal layout"
remove_directory "src/views/layouts/two-sidebar.vue" "Unused two-sidebar layout"
remove_directory "src/views/layouts/stacked-sidebar.vue" "Unused stacked sidebar layout"
remove_directory "src/views/layouts/theme-settings.vue" "Theme settings page (keeping only essential)"

echo "========================================="
echo "PHASE 3: Remove Unused Modal Components"
echo "========================================="
echo ""

# Only remove modals that were verified as unused
# (This should be run AFTER verification script confirms they're not used)

remove_directory "src/components/modal/trainers-modal.vue" "Trainers modal - feature not used"
remove_directory "src/components/modal/training-type-modal.vue" "Training type modal - feature not used"
remove_directory "src/components/modal/payroll-deduction-modal.vue" "Payroll deduction - not in requirements"
remove_directory "src/components/modal/payroll-overtime-modal.vue" "Payroll overtime - not in requirements"
remove_directory "src/components/modal/company-details-modal.vue" "Company details - not in requirements"
remove_directory "src/components/modal/custom-fields-modal.vue" "Custom fields - not in requirements"
remove_directory "src/components/modal/policy-modal.vue" "Policy management - not in requirements"
remove_directory "src/components/modal/timesheets-modal.vue" "Timesheets - not in requirements"

echo "========================================="
echo "PHASE 4: Remove Unused Settings Pages"
echo "========================================="
echo ""

# Settings cleanup (keep only essential system settings)
if [ -d "src/views/pages/settings" ]; then
    echo "ℹ️  Found settings directory, cleaning up unused settings..."

    # Remove specific unused settings files
    remove_directory "src/views/pages/settings/website-settings" "Website settings - not in requirements"
    remove_directory "src/views/pages/settings/financial-settings" "Financial settings - not in requirements"
    remove_directory "src/views/pages/settings/app-settings" "App settings - not in requirements"

    echo "✅ Kept: system-settings, general-settings (required)"
else
    echo "ℹ️  Settings directory not found in expected location"
fi
echo ""

echo "========================================="
echo "SUMMARY"
echo "========================================="
echo ""
echo "Directories deleted. Backup list saved to:"
echo "  $BACKUP_LIST"
echo ""
echo "Files removed from disk: $(wc -l < "$BACKUP_LIST" 2>/dev/null || echo "0")"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to check for broken imports"
echo "2. Fix any import errors in remaining files"
echo "3. Run verification tests"
echo "4. Proceed to route cleanup script"
echo ""
echo "⚠️  If you need to rollback, restore from Git:"
echo "   git checkout -- ."
echo "   (Only works if you committed before running this script)"
echo ""

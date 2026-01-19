#!/bin/bash

# ==============================================================================
# MODAL USAGE VERIFICATION SCRIPT
# ==============================================================================
# This script verifies which modal components are actually used in the codebase
# before deletion. Run this BEFORE making any changes.
#
# Usage: bash 01-verify-modal-usage.sh > modal-usage-report.txt
# ==============================================================================

echo "========================================="
echo "MODAL COMPONENT USAGE VERIFICATION"
echo "========================================="
echo ""
echo "Generated: $(date)"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to search for modal usage
check_modal_usage() {
    local modal_name=$1
    local search_pattern=$2

    echo "----------------------------------------"
    echo "Checking: $modal_name"
    echo "----------------------------------------"

    # Search in .vue files
    vue_results=$(grep -r "$search_pattern" --include="*.vue" src/ 2>/dev/null | wc -l)

    # Search in .js files
    js_results=$(grep -r "$search_pattern" --include="*.js" src/ 2>/dev/null | wc -l)

    total=$((vue_results + js_results))

    if [ $total -eq 0 ]; then
        echo -e "${RED}❌ UNUSED${NC} - Safe to delete"
        echo "   Found in: 0 files"
    elif [ $total -lt 3 ]; then
        echo -e "${YELLOW}⚠️  LOW USAGE${NC} - Review carefully"
        echo "   Found in: $total files"
        grep -r "$search_pattern" --include="*.vue" --include="*.js" src/ 2>/dev/null | head -5
    else
        echo -e "${GREEN}✅ ACTIVELY USED${NC} - Keep"
        echo "   Found in: $total files"
        grep -r "$search_pattern" --include="*.vue" --include="*.js" src/ 2>/dev/null | head -5
    fi

    echo ""
}

echo "==========================================="
echo "MODALS TO DELETE (Unused Features)"
echo "==========================================="
echo ""

# Check modals marked for deletion
check_modal_usage "trainers-modal" "trainers-modal"
check_modal_usage "training-type-modal" "training-type-modal"
check_modal_usage "payroll-deduction-modal" "payroll-deduction-modal"
check_modal_usage "payroll-overtime-modal" "payroll-overtime-modal"
check_modal_usage "company-details-modal" "company-details-modal"
check_modal_usage "custom-fields-modal" "custom-fields-modal"
check_modal_usage "policy-modal" "policy-modal"
check_modal_usage "timesheets-modal" "timesheets-modal"

echo ""
echo "==========================================="
echo "MODALS TO KEEP (Active Features)"
echo "==========================================="
echo ""

# Check modals marked to keep
check_modal_usage "job-offers-modal" "job-offers-modal"
check_modal_usage "interview-modal" "interview-modal"
check_modal_usage "employee-list-modal" "employee-list-modal"
check_modal_usage "employee-details-modal" "employee-details-modal"
check_modal_usage "grant-modal" "grant-modal"
check_modal_usage "leaves-admin-modal" "leaves-admin-modal"
check_modal_usage "travel-request-modal" "travel-request-modal"
check_modal_usage "tax-settings-modal" "tax-settings-modal"
check_modal_usage "user-list-modal" "user-list-modal"
check_modal_usage "roles-modal" "roles-modal"
check_modal_usage "department-modal" "department-modal"
check_modal_usage "site-modal" "site-modal"
check_modal_usage "position-modal" "position-modal"
check_modal_usage "benefit-setting-modal" "benefit-setting-modal"
check_modal_usage "bulk-payroll-modal" "bulk-payroll-modal"

echo ""
echo "==========================================="
echo "SUMMARY"
echo "==========================================="
echo ""
echo "Review the results above before proceeding with deletion."
echo "Pay special attention to items marked with ⚠️ LOW USAGE"
echo ""
echo "Next steps:"
echo "1. Review this report carefully"
echo "2. Move any modals with usage to the 'KEEP' list"
echo "3. Run cleanup script only after verification"
echo ""

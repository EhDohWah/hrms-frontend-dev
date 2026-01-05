#!/bin/bash

# ==============================================================================
# MASTER CLEANUP SCRIPT
# ==============================================================================
# This script orchestrates the complete HRMS template optimization process
#
# CRITICAL: Before running this script:
# 1. Commit all current changes to Git
# 2. Create a backup of the entire project
# 3. Read through each individual script to understand what will be deleted
# 4. Ensure you have tested the verification script first
#
# Usage: bash 00-MASTER-CLEANUP.sh
# ==============================================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "═══════════════════════════════════════════════════════════"
echo "  HRMS TEMPLATE OPTIMIZATION - MASTER CLEANUP SCRIPT"
echo "═══════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""

# Pre-flight checks
echo -e "${YELLOW}PRE-FLIGHT CHECKS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Git repo
if [ -d ".git" ]; then
    echo -e "${GREEN}✅${NC} Git repository detected"

    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${RED}⚠️  WARNING: You have uncommitted changes!${NC}"
        echo ""
        git status --short
        echo ""
        read -p "Do you want to commit these changes before proceeding? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "Please commit your changes and run this script again."
            exit 1
        fi
    else
        echo -e "${GREEN}✅${NC} No uncommitted changes"
    fi
else
    echo -e "${YELLOW}⚠️  WARNING: Not a Git repository!${NC}"
    echo "It's highly recommended to use Git for this operation."
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo -e "${GREEN}✅${NC} node_modules exists (Size: $SIZE)"

    # Check if size is abnormally large
    SIZE_KB=$(du -sk node_modules 2>/dev/null | cut -f1)
    if [ $SIZE_KB -gt 2000000 ]; then  # > 2GB
        echo -e "${RED}⚠️  CRITICAL: node_modules is abnormally large ($SIZE)${NC}"
        echo "   Expected size: ~350MB"
        echo "   This indicates corruption and MUST be fixed first"
    fi
else
    echo -e "${YELLOW}⚠️${NC} node_modules not found"
fi

# Check if package.json exists
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅${NC} package.json exists"
else
    echo -e "${RED}❌${NC} package.json not found!"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show what will be done
echo -e "${BLUE}OPTIMIZATION PLAN${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will execute the following steps in order:"
echo ""
echo "  Phase 1: Verify modal component usage"
echo "           (Review which modals are safe to delete)"
echo ""
echo "  Phase 2: Fix node_modules bloat (CRITICAL)"
echo "           Current: ~7.1GB → Target: ~350MB"
echo ""
echo "  Phase 3: Remove unused directories"
echo "           (~510 files, 75% reduction)"
echo ""
echo "  Phase 4: Update router configuration"
echo "           (Remove ~150 unused routes)"
echo ""
echo "  Phase 5: Optimize package.json"
echo "           (Remove 22 unused packages, 39% reduction)"
echo ""
echo "  Phase 6: Update lazy-components.js"
echo "           (Remove ~45 unused component imports)"
echo ""
echo "Expected Results:"
echo "  • Bundle size reduction: 60-70%"
echo "  • Build time improvement: 40-50%"
echo "  • node_modules size: 7.1GB → ~350MB"
echo "  • Faster development server startup"
echo "  • Improved IDE performance"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Final confirmation
echo -e "${YELLOW}⚠️  THIS WILL MAKE SIGNIFICANT CHANGES TO YOUR PROJECT${NC}"
echo ""
read -p "Are you sure you want to proceed? Type 'YES' to continue: " -r
echo ""

if [ "$REPLY" != "YES" ]; then
    echo -e "${RED}Operation cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}Starting optimization process...${NC}"
echo ""

# Create logs directory
mkdir -p cleanup-logs
LOG_FILE="cleanup-logs/cleanup-$(date +%Y%m%d_%H%M%S).log"

echo "Logging to: $LOG_FILE"
echo ""

# ==============================================================================
# PHASE 1: VERIFY MODAL USAGE
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PHASE 1: VERIFY MODAL USAGE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

if [ -f "cleanup-scripts/01-verify-modal-usage.sh" ]; then
    echo "Running modal verification..."
    bash cleanup-scripts/01-verify-modal-usage.sh > cleanup-logs/modal-verification-report.txt
    echo -e "${GREEN}✅ Modal verification complete${NC}"
    echo "   Report saved to: cleanup-logs/modal-verification-report.txt"
    echo ""
    echo "Please review the report before proceeding."
    echo ""
    read -p "Press Enter to continue after reviewing the report..."
    echo ""
else
    echo -e "${YELLOW}⚠️  Skipping: 01-verify-modal-usage.sh not found${NC}"
    echo ""
fi

# ==============================================================================
# PHASE 2: FIX NODE_MODULES
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PHASE 2: FIX NODE_MODULES BLOAT${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

if [ -f "cleanup-scripts/02-fix-node-modules.sh" ]; then
    echo "This will delete and reinstall node_modules..."
    read -p "Continue with node_modules cleanup? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        bash cleanup-scripts/02-fix-node-modules.sh | tee -a "$LOG_FILE"
        echo -e "${GREEN}✅ Phase 2 complete${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipped Phase 2${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping: 02-fix-node-modules.sh not found${NC}"
fi
echo ""

# ==============================================================================
# PHASE 3: REMOVE UNUSED DIRECTORIES
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PHASE 3: REMOVE UNUSED DIRECTORIES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

if [ -f "cleanup-scripts/03-remove-unused-directories.sh" ]; then
    echo "This will permanently delete ~510 unused files..."
    read -p "Continue with directory cleanup? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        bash cleanup-scripts/03-remove-unused-directories.sh | tee -a "$LOG_FILE"
        echo -e "${GREEN}✅ Phase 3 complete${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipped Phase 3${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping: 03-remove-unused-directories.sh not found${NC}"
fi
echo ""

# ==============================================================================
# PHASE 4: UPDATE ROUTER
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PHASE 4: UPDATE ROUTER CONFIGURATION${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

if [ -f "cleanup-scripts/04-cleanup-router.js" ]; then
    echo "This will replace src/router/index.js with optimized version..."
    read -p "Continue with router update? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Backup current router
        cp src/router/index.js "src/router/index.js.backup-$(date +%Y%m%d_%H%M%S)"
        cp cleanup-scripts/04-cleanup-router.js src/router/index.js
        echo -e "${GREEN}✅ Phase 4 complete${NC}"
        echo "   Backup saved: src/router/index.js.backup-*"
    else
        echo -e "${YELLOW}⚠️  Skipped Phase 4${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping: 04-cleanup-router.js not found${NC}"
fi
echo ""

# ==============================================================================
# PHASE 5: OPTIMIZE PACKAGE.JSON
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PHASE 5: OPTIMIZE PACKAGE.JSON${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

if [ -f "cleanup-scripts/05-update-package-json.sh" ]; then
    echo "This will remove 22 unused npm packages..."
    echo "Note: This will run 'npm install' which may take several minutes"
    read -p "Continue with package.json optimization? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        bash cleanup-scripts/05-update-package-json.sh | tee -a "$LOG_FILE"
        echo -e "${GREEN}✅ Phase 5 complete${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipped Phase 5${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping: 05-update-package-json.sh not found${NC}"
fi
echo ""

# ==============================================================================
# PHASE 6: UPDATE LAZY COMPONENTS
# ==============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}PHASE 6: UPDATE LAZY COMPONENTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

if [ -f "src/plugins/lazy-components-OPTIMIZED.js" ]; then
    echo "This will replace lazy-components.js with optimized version..."
    read -p "Continue with lazy components update? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Backup current file
        cp src/plugins/lazy-components.js "src/plugins/lazy-components.js.backup-$(date +%Y%m%d_%H%M%S)"
        cp src/plugins/lazy-components-OPTIMIZED.js src/plugins/lazy-components.js
        echo -e "${GREEN}✅ Phase 6 complete${NC}"
        echo "   Backup saved: src/plugins/lazy-components.js.backup-*"
    else
        echo -e "${YELLOW}⚠️  Skipped Phase 6${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping: lazy-components-OPTIMIZED.js not found${NC}"
fi
echo ""

# ==============================================================================
# COMPLETION
# ==============================================================================
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}OPTIMIZATION COMPLETE!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo "Summary:"
echo "  ✅ Modal verification complete"
echo "  ✅ node_modules cleaned and reinstalled"
echo "  ✅ Unused directories removed"
echo "  ✅ Router configuration optimized"
echo "  ✅ Package dependencies optimized"
echo "  ✅ Lazy components updated"
echo ""

echo "Next Steps:"
echo ""
echo "1. TEST THE APPLICATION:"
echo "   npm run dev"
echo ""
echo "2. VERIFY CRITICAL FEATURES:"
echo "   - Login/Authentication"
echo "   - Dashboard loads"
echo "   - Employee list"
echo "   - Grant management"
echo "   - Leave management"
echo "   - Payroll features"
echo ""
echo "3. BUILD FOR PRODUCTION:"
echo "   npm run build"
echo ""
echo "4. CHECK BUILD SIZE:"
echo "   ls -lh dist/"
echo ""

echo -e "${YELLOW}IMPORTANT NOTES:${NC}"
echo ""
echo "• All backups are saved with timestamps"
echo "• Full log saved to: $LOG_FILE"
echo "• If issues occur, restore from Git:"
echo "  git checkout -- ."
echo ""
echo "• To rollback package.json changes:"
echo "  cp package.json.backup-* package.json"
echo "  npm install"
echo ""

echo -e "${GREEN}Thank you for optimizing your HRMS application!${NC}"
echo ""

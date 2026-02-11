/**
 * usePermissions Composable
 *
 * Provides reactive permission checking utilities for Vue 3 components.
 * This composable wraps the menuService to provide an easy-to-use API for
 * checking user permissions in components.
 *
 * @example
 * // In Options API
 * import { usePermissions } from '@/composables/usePermissions';
 *
 * export default {
 *   setup() {
 *     const { hasPermission, canEdit, canRead, isReadOnly } = usePermissions('employees');
 *     return { hasPermission, canEdit, canRead, isReadOnly };
 *   }
 * };
 *
 * @example
 * // In template with v-if
 * <button v-if="canEdit" @click="openEditModal">Edit</button>
 * <span v-if="isReadOnly" class="badge bg-warning">Read Only</span>
 */

import { computed, ref, watch } from 'vue';
import { menuService } from '@/services/menu.service';

/**
 * Module name mapping - normalizes different module name variations
 * Maps common variations to the canonical module name used in permissions
 */
const MODULE_NAME_MAP = {
  // Employee variations
  'employee': 'employees',
  'employee_list': 'employees',
  'employee-list': 'employees',
  'staff': 'employees',
  
  // Interview variations
  'interview': 'interviews',
  'interview_list': 'interviews',
  'interview-list': 'interviews',
  
  // Job Offer variations
  'job_offer': 'job_offers',
  'job-offer': 'job_offers',
  'job_offer_list': 'job_offers',
  'joboffer': 'job_offers',
  
  // Holiday variations
  'holiday': 'holidays',
  'holiday_list': 'holidays',
  
  // Leave variations
  'leave': 'leaves',
  'leave_request': 'leaves',
  'leave-request': 'leaves',
  
  // Attendance variations (uses attendance_admin permission module)
  'attendance': 'attendance_admin',
  'attendance-admin': 'attendance_admin',
  'attendance-list': 'attendance_admin',
  'attendance_admin': 'attendance_admin',
  
  // Department variations
  'department': 'departments',
  'department_list': 'departments',
  
  // Position variations
  'position': 'positions',
  'designation': 'positions',
  'position_list': 'positions',
  
  // Employment variations
  'employment': 'employment_records',
  'employment-list': 'employment_records',
  
  // User management variations
  'user': 'users',
  'user_management': 'users',
  'user-management': 'users',
  
  // Role variations
  'role': 'roles',
  'role_management': 'roles',
  
  // Grant variations
  'grant': 'grants_list',
  'grant_list': 'grants_list',
  'grants': 'grants_list',
  
  // Training variations
  'training': 'training_list',
  'training_list': 'training_list',
  'trainings': 'training_list',
  
  // Travel variations
  'travel': 'travels',
  'travel_request': 'travels',
  
  // Payroll variations
  'payroll': 'employee_salary',
  'salary': 'employee_salary',
  'employee_salary': 'employee_salary',
  'employee-salary': 'employee_salary',

  // Payroll Items variations
  'payroll_items': 'payroll_items',
  'payroll-items': 'payroll_items',

  // Tax variations
  'tax': 'tax_settings',
  'tax_settings': 'tax_settings',
  'tax-settings': 'tax_settings',

  // Benefit Settings variations
  'benefit': 'benefit_settings',
  'benefit_settings': 'benefit_settings',
  'benefit-settings': 'benefit_settings',
  
  // Resignation variations
  'resignation': 'employee_resignation',
  'employee_resignation': 'employee_resignation',
  'employee-resignation': 'employee_resignation',

  // Employee Funding Allocation variations
  'employee-funding-allocation': 'employee_funding_allocations',
  'employee_funding_allocation': 'employee_funding_allocations',
  'funding-allocation': 'employee_funding_allocations',
  'funding_allocation': 'employee_funding_allocations',

  // Lookup variations
  'lookup': 'lookup_list',
  'lookups': 'lookup_list',
  'lookup_list': 'lookup_list',
  'lookup-list': 'lookup_list',

  // Termination variations
  'termination': 'terminations',
  
  // Promotion variations
  'promotion': 'promotions',
  
  // Transfer variations
  'transfer': 'transfers',
  
  // Warning variations
  'warning': 'warnings',
  'disciplinary': 'warnings',
  
  // Asset variations
  'asset': 'assets',
  'company_asset': 'assets',
  
  // Letter Template variations
  'letter_template': 'letter_templates',
  'letter-template': 'letter_templates',
  'letter_template_list': 'letter_templates',
  'template': 'letter_templates',

  // Document variations
  'document': 'documents',
  'file': 'documents',
  
  // Report variations
  'report': 'reports',
  
  // Settings variations
  'setting': 'settings',
  'configuration': 'settings',
  
  // Audit variations
  'audit': 'audits',
  'audit_log': 'audits',
  'activity_log': 'audits',
};

/**
 * Normalize module name to canonical form
 * @param {string} moduleName - Module name to normalize
 * @returns {string} Normalized module name
 */
function normalizeModuleName(moduleName) {
  if (!moduleName) return '';
  const normalized = moduleName.toLowerCase().trim();
  return MODULE_NAME_MAP[normalized] || normalized;
}

/**
 * Permission check composable
 * @param {string} module - Optional module name (e.g., 'employees', 'interviews')
 * @returns {object} Permission check functions and computed properties
 */
export function usePermissions(module = null) {
  // Normalize the module name
  const normalizedModule = module ? normalizeModuleName(module) : null;
  
  /**
   * Get user's permissions from localStorage (reactive)
   */
  const userPermissions = computed(() => {
    return menuService.getUserPermissions();
  });
  
  /**
   * Reactive flag to track permission refresh
   */
  const permissionVersion = ref(0);
  
  // Listen for permission updates
  if (typeof window !== 'undefined') {
    window.addEventListener('permissions-updated', () => {
      permissionVersion.value++;
    });
  }

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission to check (e.g., 'user.read', 'employee.create')
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    return menuService.hasPermission(permission);
  };

  /**
   * Check if user has ANY of the specified permissions
   * @param {string[]} permissions - Array of permissions
   * @returns {boolean}
   */
  const hasAnyPermission = (permissions) => {
    return menuService.hasAnyPermission(permissions);
  };

  /**
   * Check if user has ALL of the specified permissions
   * @param {string[]} permissions - Array of permissions
   * @returns {boolean}
   */
  const hasAllPermissions = (permissions) => {
    return menuService.hasAllPermissions(permissions);
  };

  /**
   * Check if user has permission with wildcard support
   * @param {string} permissionPattern - Permission pattern (e.g., 'user.*')
   * @returns {boolean}
   */
  const hasPermissionPattern = (permissionPattern) => {
    return menuService.hasPermissionPattern(permissionPattern);
  };

  /**
   * Check if user can view a menu
   * @param {string} menuValue - Menu label
   * @returns {boolean}
   */
  const canViewMenu = (menuValue) => {
    return menuService.canViewMenu(menuValue);
  };

  /**
   * Check if user can edit a menu (CRUD operations)
   * @param {string} menuValue - Menu label
   * @returns {boolean}
   */
  const canEditMenu = (menuValue) => {
    return menuService.canEditMenu(menuValue);
  };

  /**
   * Get menu access level
   * @param {string} menuValue - Menu label
   * @returns {'none'|'read'|'write'} Access level
   */
  const getMenuAccessLevel = (menuValue) => {
    return menuService.getMenuAccessLevel(menuValue);
  };

  // Module-specific permission checks (if module is provided)
  const modulePermissions = normalizedModule ? {
    /**
     * The normalized module name
     */
    moduleName: normalizedModule,
    
    /**
     * Check if user can read from the module
     */
    canRead: computed(() => {
      // Force reactivity by accessing permissionVersion
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.read`);
    }),

    /**
     * Check if user can edit the module (full CRUD)
     */
    canEdit: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.edit`);
    }),

    /**
     * Check if user has read-only access (has read but NOT edit)
     */
    isReadOnly: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.read`) && !hasPermission(`${normalizedModule}.edit`);
    }),

    /**
     * @deprecated Use canEdit instead - Backward compatibility
     * Check if user can create in the module (maps to edit permission)
     */
    canCreate: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.edit`);
    }),

    /**
     * @deprecated Use canEdit instead - Backward compatibility
     * Check if user can update in the module (maps to edit permission)
     */
    canUpdate: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.edit`);
    }),

    /**
     * @deprecated Use canEdit instead - Backward compatibility
     * Check if user can delete in the module (maps to edit permission)
     */
    canDelete: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.edit`);
    }),

    /**
     * Check if user can export from the module (requires read permission)
     */
    canExport: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.read`);
    }),

    /**
     * Check if user can import to the module (requires edit permission)
     */
    canImport: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.edit`);
    }),

    /**
     * @deprecated Use canEdit instead - Backward compatibility
     * Check if user can bulk create in the module (maps to edit permission)
     */
    canBulkCreate: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.edit`);
    }),

    /**
     * Check if user has write access (edit permission)
     */
    hasWriteAccess: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.edit`);
    }),

    /**
     * Check if user has full access (both read and edit)
     */
    hasFullAccess: computed(() => {
      permissionVersion.value;
      return hasPermission(`${normalizedModule}.read`) && hasPermission(`${normalizedModule}.edit`);
    }),

    /**
     * Get all module permissions as an object {read: bool, edit: bool}
     */
    permissions: computed(() => {
      permissionVersion.value;
      return {
        read: hasPermission(`${normalizedModule}.read`),
        edit: hasPermission(`${normalizedModule}.edit`)
      };
    }),
    
    /**
     * Get permission status message for UI display
     */
    accessLevelText: computed(() => {
      permissionVersion.value;
      const canReadVal = hasPermission(`${normalizedModule}.read`);
      const canEditVal = hasPermission(`${normalizedModule}.edit`);
      
      if (canEditVal) return 'Full Access';
      if (canReadVal) return 'Read Only';
      return 'No Access';
    }),
    
    /**
     * Get Bootstrap badge class for access level
     */
    accessLevelBadgeClass: computed(() => {
      permissionVersion.value;
      const canReadVal = hasPermission(`${normalizedModule}.read`);
      const canEditVal = hasPermission(`${normalizedModule}.edit`);
      
      if (canEditVal) return 'bg-success';
      if (canReadVal) return 'bg-warning text-dark';
      return 'bg-danger';
    })
  } : {};

  return {
    // Reactive permissions list
    userPermissions,

    // Generic permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPermissionPattern,

    // Menu-specific checks
    canViewMenu,
    canEditMenu,
    getMenuAccessLevel,

    // Module-specific checks (only if module provided)
    ...modulePermissions
  };
}

/**
 * Permission directive helper
 * Can be used with v-if for conditional rendering based on permissions
 *
 * @example
 * <button v-if="can('user.create')">Create User</button>
 *
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function can(permission) {
  return menuService.hasPermission(permission);
}

/**
 * Check if user can perform an action on a module
 *
 * @example
 * <button v-if="canPerform('employee', 'create')">Create Employee</button>
 *
 * @param {string} module - Module name
 * @param {string} action - Action name (create, read, update, delete, etc.)
 * @returns {boolean}
 */
export function canPerform(module, action) {
  return menuService.canPerformAction(module, action);
}

/**
 * Check if user can access a route based on required permissions
 *
 * @example
 * <router-link v-if="canAccessRoute('user.read')" to="/users">Users</router-link>
 *
 * @param {string|string[]} requiredPermissions - Single permission or array of permissions
 * @param {boolean} requireAll - If true, user must have ALL permissions
 * @returns {boolean}
 */
export function canAccessRoute(requiredPermissions, requireAll = false) {
  return menuService.canAccessRoute(requiredPermissions, requireAll);
}

/**
 * Check if user has read permission for a module
 * @param {string} module - Module name
 * @returns {boolean}
 */
export function canRead(module) {
  const normalized = normalizeModuleName(module);
  return menuService.hasPermission(`${normalized}.read`);
}

/**
 * Check if user has edit permission for a module
 * @param {string} module - Module name
 * @returns {boolean}
 */
export function canEdit(module) {
  const normalized = normalizeModuleName(module);
  return menuService.hasPermission(`${normalized}.edit`);
}

/**
 * Check if user has read-only access (read but not edit)
 * @param {string} module - Module name
 * @returns {boolean}
 */
export function isReadOnly(module) {
  const normalized = normalizeModuleName(module);
  return menuService.hasPermission(`${normalized}.read`) && !menuService.hasPermission(`${normalized}.edit`);
}

/**
 * Get module permission info object
 * @param {string} module - Module name
 * @returns {object} {canRead, canEdit, isReadOnly, accessLevel}
 */
export function getModuleAccess(module) {
  const normalized = normalizeModuleName(module);
  const hasRead = menuService.hasPermission(`${normalized}.read`);
  const hasEdit = menuService.hasPermission(`${normalized}.edit`);
  
  return {
    module: normalized,
    canRead: hasRead,
    canEdit: hasEdit,
    isReadOnly: hasRead && !hasEdit,
    accessLevel: hasEdit ? 'full' : (hasRead ? 'read' : 'none'),
    accessLevelText: hasEdit ? 'Full Access' : (hasRead ? 'Read Only' : 'No Access'),
    badgeClass: hasEdit ? 'bg-success' : (hasRead ? 'bg-warning text-dark' : 'bg-danger')
  };
}

/**
 * Normalize module name helper - exported for external use
 */
export { normalizeModuleName };

/**
 * Module name mapping - exported for reference
 */
export { MODULE_NAME_MAP };

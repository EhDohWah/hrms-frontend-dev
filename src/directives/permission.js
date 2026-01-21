/**
 * v-permission Directive
 * 
 * A Vue 3 directive for conditionally showing/hiding elements based on user permissions.
 * 
 * @example
 * <!-- Hide element if user doesn't have permission -->
 * <button v-permission="'employees.edit'">Edit Employee</button>
 * 
 * @example
 * <!-- Check for module edit permission -->
 * <button v-permission:edit="'employees'">Edit Employee</button>
 * 
 * @example
 * <!-- Check for module read permission -->
 * <div v-permission:read="'employees'">Employee Data</div>
 * 
 * @example
 * <!-- Disable instead of hide -->
 * <button v-permission.disable="'employees.edit'">Edit Employee</button>
 * 
 * @example
 * <!-- Show tooltip on disabled elements -->
 * <button v-permission.disable.tooltip="'employees.edit'">Edit Employee</button>
 * 
 * @example
 * <!-- Check for any of multiple permissions -->
 * <button v-permission="['employees.edit', 'users.edit']">Manage</button>
 */

import { menuService } from '@/services/menu.service';

/**
 * Module name mapping for normalization
 */
const MODULE_NAME_MAP = {
  'employee': 'employees',
  'employee_list': 'employees',
  'interview': 'interviews',
  'job_offer': 'job_offers',
  'job-offer': 'job_offers',
  'holiday': 'holidays',
  'leave': 'leaves',
  'attendance': 'attendance_admin',
  'department': 'departments',
  'position': 'positions',
  'user': 'users',
  'role': 'roles',
  'grant': 'grants',
  'training': 'trainings',
  'travel': 'travels',
  'resignation': 'resignations',
  'termination': 'terminations',
  'promotion': 'promotions',
  'transfer': 'transfers',
  'warning': 'warnings',
  'asset': 'assets',
  'document': 'documents',
  'report': 'reports',
  'setting': 'settings',
  'audit': 'audits',
};

/**
 * Normalize module name
 */
function normalizeModuleName(name) {
  if (!name) return '';
  const normalized = name.toLowerCase().trim();
  return MODULE_NAME_MAP[normalized] || normalized;
}

/**
 * Check if user has the required permission(s)
 * @param {string|string[]} value - Permission string or array of permissions
 * @param {string} arg - Directive argument ('read' or 'edit')
 * @returns {boolean}
 */
function checkPermission(value, arg) {
  if (!value) return true;
  
  // If arg is provided, treat value as module name
  if (arg === 'read' || arg === 'edit') {
    const moduleName = normalizeModuleName(value);
    return menuService.hasPermission(`${moduleName}.${arg}`);
  }
  
  // If value is an array, check if user has ANY of the permissions
  if (Array.isArray(value)) {
    return menuService.hasAnyPermission(value);
  }
  
  // Single permission check
  return menuService.hasPermission(value);
}

/**
 * Store original display style for restoration
 */
const originalDisplayMap = new WeakMap();

/**
 * Apply permission check to element
 */
function applyPermission(el, binding) {
  const { value, arg, modifiers } = binding;
  const hasPermission = checkPermission(value, arg);
  
  if (hasPermission) {
    // User has permission - show element normally
    if (originalDisplayMap.has(el)) {
      el.style.display = originalDisplayMap.get(el);
    }
    el.removeAttribute('disabled');
    el.classList.remove('permission-disabled');
    el.removeAttribute('title');
    el.removeAttribute('data-bs-toggle');
    el.removeAttribute('data-bs-placement');
    el.removeAttribute('data-bs-original-title');
  } else {
    // User doesn't have permission
    if (modifiers.disable) {
      // Disable the element instead of hiding
      el.setAttribute('disabled', 'disabled');
      el.classList.add('permission-disabled');
      
      // Add tooltip if modifier is present
      if (modifiers.tooltip) {
        el.setAttribute('title', 'You have read-only access to this module');
        el.setAttribute('data-bs-toggle', 'tooltip');
        el.setAttribute('data-bs-placement', 'top');
      }
    } else {
      // Hide the element (default behavior)
      if (!originalDisplayMap.has(el)) {
        originalDisplayMap.set(el, el.style.display || '');
      }
      el.style.display = 'none';
    }
  }
}

/**
 * Permission directive definition
 */
export const permissionDirective = {
  // Called when the bound element's parent component is mounted
  mounted(el, binding) {
    applyPermission(el, binding);
    
    // Listen for permission updates
    const handler = () => applyPermission(el, binding);
    el._permissionHandler = handler;
    window.addEventListener('permissions-updated', handler);
  },
  
  // Called when the containing component's VNode and its children have updated
  updated(el, binding) {
    applyPermission(el, binding);
  },
  
  // Called when the bound element's parent component is unmounted
  unmounted(el) {
    if (el._permissionHandler) {
      window.removeEventListener('permissions-updated', el._permissionHandler);
      delete el._permissionHandler;
    }
    originalDisplayMap.delete(el);
  }
};

/**
 * v-can-edit directive - shorthand for v-permission:edit
 */
export const canEditDirective = {
  mounted(el, binding) {
    const newBinding = { ...binding, arg: 'edit' };
    applyPermission(el, newBinding);
    
    const handler = () => applyPermission(el, newBinding);
    el._permissionHandler = handler;
    window.addEventListener('permissions-updated', handler);
  },
  updated(el, binding) {
    const newBinding = { ...binding, arg: 'edit' };
    applyPermission(el, newBinding);
  },
  unmounted(el) {
    if (el._permissionHandler) {
      window.removeEventListener('permissions-updated', el._permissionHandler);
      delete el._permissionHandler;
    }
    originalDisplayMap.delete(el);
  }
};

/**
 * v-can-read directive - shorthand for v-permission:read
 */
export const canReadDirective = {
  mounted(el, binding) {
    const newBinding = { ...binding, arg: 'read' };
    applyPermission(el, newBinding);
    
    const handler = () => applyPermission(el, newBinding);
    el._permissionHandler = handler;
    window.addEventListener('permissions-updated', handler);
  },
  updated(el, binding) {
    const newBinding = { ...binding, arg: 'read' };
    applyPermission(el, newBinding);
  },
  unmounted(el) {
    if (el._permissionHandler) {
      window.removeEventListener('permissions-updated', el._permissionHandler);
      delete el._permissionHandler;
    }
    originalDisplayMap.delete(el);
  }
};

/**
 * Plugin to register all permission directives
 */
export const PermissionPlugin = {
  install(app) {
    app.directive('permission', permissionDirective);
    app.directive('can-edit', canEditDirective);
    app.directive('can-read', canReadDirective);
    
    // Add global CSS for disabled elements
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        .permission-disabled {
          opacity: 0.6;
          cursor: not-allowed !important;
          pointer-events: none;
        }
        .permission-disabled * {
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export default permissionDirective;


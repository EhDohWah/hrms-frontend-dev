/**
 * Menu Service - Role-Based Menu Filtering
 *
 * This service provides role-based menu filtering and access control.
 * It uses ROLE_MENU_ACCESS from role-menu.config.js to determine menu visibility.
 *
 * Key Features:
 * - Role-based menu visibility
 * - Read-only vs Full access control based on permissions
 * - Real-time permission updates
 * - Menu access level detection (none, read, write)
 *
 * @version 3.0.0
 */

import { ROLE_MENU_ACCESS } from '../config/role-menu.config';
import { moduleService } from './module.service';

class MenuService {
  constructor() {
    this.modules = [];
    this.modulesLoaded = false;
    this.useApiModules = false; // Flag to switch between hardcoded and API modules
  }

  /**
   * Initialize menu service - load modules from API
   * Call this on app startup or after authentication
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      // Check if user is authenticated by checking user data presence
      // NOTE: Token is in HttpOnly cookie (sent automatically), we check user data for auth state
      const user = localStorage.getItem('user');
      if (!user) {
        console.warn('[MenuService] No user data found, skipping module initialization');
        this.useApiModules = false;
        return false;
      }

      // NOTE: Token is in HttpOnly cookie, no need to set auth header manually

      console.log('[MenuService] Initializing - loading modules from API');
      this.modules = await moduleService.fetchModules();

      if (this.modules && this.modules.length > 0) {
        this.modulesLoaded = true;
        this.useApiModules = true;
        console.log(`[MenuService] Initialized with ${this.modules.length} modules from API`);

        // Emit event for components listening
        this.emitModulesLoaded();
        return true;
      } else {
        console.warn('[MenuService] No modules loaded from API, falling back to hardcoded map');
        this.useApiModules = false;
        return false;
      }
    } catch (error) {
      console.error('[MenuService] Error initializing:', error);
      this.useApiModules = false;
      return false;
    }
  }

  /**
   * Refresh modules from API (force refresh cache)
   * @returns {Promise<boolean>}
   */
  async refreshModules() {
    try {
      console.log('[MenuService] Refreshing modules from API');
      this.modules = await moduleService.fetchModules(true); // Force refresh

      if (this.modules && this.modules.length > 0) {
        this.modulesLoaded = true;
        this.useApiModules = true;
        console.log(`[MenuService] Refreshed ${this.modules.length} modules`);

        // Emit event
        this.emitModulesLoaded();
        return true;
      }
      return false;
    } catch (error) {
      console.error('[MenuService] Error refreshing modules:', error);
      return false;
    }
  }

  /**
   * Reset menu service state - clears modules and cache
   * Call this on logout to ensure fresh data on next login
   */
  reset() {
    console.log('[MenuService] Resetting menu service state');
    this.modules = [];
    this.modulesLoaded = false;
    this.useApiModules = false;
    
    // Clear localStorage module cache
    try {
      localStorage.removeItem('hrms_modules_cache');
      console.log('[MenuService] Cleared module cache from localStorage');
    } catch (error) {
      console.error('[MenuService] Error clearing cache:', error);
    }
  }

  /**
   * Emit custom event when modules are loaded
   */
  emitModulesLoaded() {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('modules-loaded', {
        detail: { modules: this.modules, count: this.modules.length }
      });
      window.dispatchEvent(event);
      console.log('[MenuService] Emitted modules-loaded event');
    }
  }

  /**
   * Get loaded modules
   * @returns {Array} Modules array
   */
  getModules() {
    return this.modules;
  }

  /**
   * Check if using API modules
   * @returns {boolean}
   */
  isUsingApiModules() {
    return this.useApiModules;
  }

  /**
   * Get menu permission config from API modules only (no fallback)
   * @param {string} menuValue - Menu display name
   * @returns {object|null} Permission config
   */
  getMenuConfig(menuValue) {
    if (this.useApiModules && this.modulesLoaded) {
      // Find module by display_name
      const module = this.modules.find(m => m.display_name === menuValue);

      if (module) {
        return {
          readPermission: module.read_permission,
          writePermissions: [`${module.name}.edit`]  // Simplified: single edit permission
        };
      }

      // Not found in API modules - don't log warning here (checked elsewhere)
      return null;
    }

    // If API modules not loaded, deny access
    console.warn(`[MenuService] API modules not loaded yet`);
    return null;
  }

  /**
   * Check if a menu item has a corresponding module in the API
   * @param {string} menuValue - Menu display name
   * @returns {boolean} True if a module exists for this menu
   */
  hasModuleForMenu(menuValue) {
    if (this.useApiModules && this.modulesLoaded) {
      const normalizedMenuValue = menuValue.toLowerCase().trim();
      const module = this.modules.find(m => 
        m.display_name && m.display_name.toLowerCase() === normalizedMenuValue
      );
      
      if (!module) {
        // Debug: Log available modules for troubleshooting
        const availableModules = this.modules.map(m => m.display_name).slice(0, 10);
        console.log(`[MenuService] Module not found for "${menuValue}". Available: ${availableModules.join(', ')}...`);
      }
      
      return !!module;
    }
    return false;
  }

  /**
   * Get user's permissions from localStorage
   * @returns {string[]} Array of permission strings (e.g., ['user.read', 'user.create'])
   */
  getUserPermissions() {
    try {
      const permissionsStr = localStorage.getItem('permissions');
      if (!permissionsStr) {
        console.warn('[MenuService] No permissions found in localStorage');
        return [];
      }
      const permissions = JSON.parse(permissionsStr);
      return Array.isArray(permissions) ? permissions : [];
    } catch (error) {
      console.error('[MenuService] Error parsing user permissions:', error);
      return [];
    }
  }

  /**
   * Get user object from localStorage
   * @returns {object|null} User object or null
   */
  getUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('[MenuService] Error parsing user:', error);
      return null;
    }
  }

  /**
   * Get user's role from localStorage
   * @returns {string} Role name (lowercase)
   * @deprecated Use permission-based checks instead
   */
  getUserRole() {
    const role = localStorage.getItem('userRole');
    if (!role) {
      console.warn('[MenuService] No user role found in localStorage');
      return 'employee'; // default fallback
    }
    return role.toLowerCase();
  }

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission to check (e.g., 'user.read')
   * @returns {boolean}
   */
  hasPermission(permission) {
    if (!permission) return true; // No permission required
    const userPermissions = this.getUserPermissions();
    return userPermissions.includes(permission);
  }

  /**
   * Check if user has ALL of the specified permissions
   * @param {string[]} permissions - Array of permissions
   * @returns {boolean}
   */
  hasAllPermissions(permissions) {
    if (!permissions || permissions.length === 0) return true;
    const userPermissions = this.getUserPermissions();
    return permissions.every(perm => userPermissions.includes(perm));
  }

  /**
   * Check if user has ANY of the specified permissions
   * @param {string[]} permissions - Array of permissions
   * @returns {boolean}
   */
  hasAnyPermission(permissions) {
    if (!permissions || permissions.length === 0) return true;
    const userPermissions = this.getUserPermissions();
    return permissions.some(perm => userPermissions.includes(perm));
  }

  /**
   * Check if user has permission with wildcard support
   * Supports patterns like 'user.*' to check for any user permission
   * @param {string} permissionPattern - Permission pattern (e.g., 'user.*')
   * @returns {boolean}
   */
  hasPermissionPattern(permissionPattern) {
    if (!permissionPattern) return true;

    const userPermissions = this.getUserPermissions();

    // If it's a wildcard pattern
    if (permissionPattern.includes('*')) {
      const basePattern = permissionPattern.replace('.*', '');
      return userPermissions.some(perm => perm.startsWith(basePattern));
    }

    // Exact match
    return userPermissions.includes(permissionPattern);
  }

  /**
   * Check if menu item should be visible based on role configuration or user permissions
   * For dynamic roles not in ROLE_MENU_ACCESS, uses permission-based filtering
   * @param {string} menuValue - Menu label (e.g., 'User Management')
   * @returns {boolean}
   */
  canViewMenu(menuValue) {
    const userRole = this.getUserRole();
    
    // Get role configuration
    const roleConfig = ROLE_MENU_ACCESS[userRole];
    
    // Special case: Dashboard is always visible
    if (menuValue.toLowerCase() === 'dashboard') {
      return true;
    }
    
    // If role config exists, use role-based filtering
    if (roleConfig) {
      // Check if menu is in allowedMenus (case-insensitive comparison)
      const normalizedMenuValue = menuValue.trim();
      return roleConfig.allowedMenus.some(allowed => 
        allowed.trim().toLowerCase() === normalizedMenuValue.toLowerCase()
      );
    }
    
    // For dynamic roles not in config, use permission-based filtering
    // Find the module for this menu and check if user has any permission for it
    return this.canViewMenuByPermission(menuValue);
  }
  
  /**
   * Check if user can view menu based on their permissions (for dynamic roles)
   * @param {string} menuValue - Menu label
   * @returns {boolean}
   */
  canViewMenuByPermission(menuValue) {
    const menuConfig = this.getMenuConfig(menuValue);
    
    if (menuConfig && menuConfig.readPermission) {
      // User can view if they have read permission for this module
      return this.hasPermission(menuConfig.readPermission);
    }
    
    // Fallback: check if any module matches this menu name
    if (this.useApiModules && this.modulesLoaded) {
      // Try to find module by matching display name
      const module = this.modules.find(m => 
        m.display_name && m.display_name.toLowerCase() === menuValue.toLowerCase().trim()
      );
      
      if (module) {
        return this.hasPermission(module.read_permission);
      }
    }
    
    return false;
  }

  /**
   * Check if submenu item should be visible based on role configuration or permissions
   * @param {string} parentMenuValue - Parent menu label
   * @param {string} subMenuValue - Submenu label
   * @returns {boolean}
   */
  canViewSubMenu(parentMenuValue, subMenuValue) {
    const userRole = this.getUserRole();
    const roleConfig = ROLE_MENU_ACCESS[userRole];
    
    // Dashboard no longer has submenus - always return false for dashboard submenus
    if (parentMenuValue.toLowerCase() === 'dashboard') {
      return false;
    }
    
    // If role config exists, use role-based filtering
    if (roleConfig && roleConfig.allowedSubMenus) {
      // Check if parent menu is allowed
      if (!this.canViewMenu(parentMenuValue)) {
        return false;
      }

      // Check if submenu is in allowedSubMenus for this parent (case-insensitive)
      const allowedSubMenus = roleConfig.allowedSubMenus[parentMenuValue];
      if (!allowedSubMenus) {
        return false;
      }

      const normalizedSubMenu = subMenuValue.trim();
      return allowedSubMenus.some(allowed => 
        allowed.trim().toLowerCase() === normalizedSubMenu.toLowerCase()
      );
    }
    
    // For dynamic roles without config, use permission-based filtering
    // Check if parent menu is accessible
    if (!this.canViewMenu(parentMenuValue)) {
      return false;
    }

    // Check submenu by permission
    return this.canViewMenuByPermission(subMenuValue);
  }

  /**
   * Check if user can perform write operations (CRUD)
   * @param {string} menuValue - Menu label
   * @returns {boolean}
   */
  canEditMenu(menuValue) {
    const menuConfig = this.getMenuConfig(menuValue);

    if (!menuConfig) {
      return false;
    }

    // If no write permissions specified, treat as read-only
    if (!menuConfig.writePermissions || menuConfig.writePermissions.length === 0) {
      return false;
    }

    // User needs at least one write permission
    return this.hasAnyPermission(menuConfig.writePermissions);
  }

  /**
   * Get menu access level for a specific menu
   * @param {string} menuValue - Menu label
   * @returns {'none'|'read'|'write'} Access level
   */
  getMenuAccessLevel(menuValue) {
    if (!this.canViewMenu(menuValue)) {
      return 'none'; // No access - menu should be hidden
    }

    if (this.canEditMenu(menuValue)) {
      return 'write'; // Full CRUD access - show edit icon
    }

    return 'read'; // Read-only access - show eye icon
  }

  /**
   * Check if menu should show read-only badge
   * @param {string} menuValue - Menu label
   * @returns {boolean}
   */
  isMenuReadOnly(menuValue) {
    return this.getMenuAccessLevel(menuValue) === 'read';
  }

  /**
   * Check if menu should show edit badge
   * @param {string} menuValue - Menu label
   * @returns {boolean}
   */
  isMenuEditable(menuValue) {
    return this.getMenuAccessLevel(menuValue) === 'write';
  }

  /**
   * Filter sidebar data based on user's permissions
   * ALWAYS uses permission-based filtering when API modules are loaded
   * Falls back to role config only if API modules are not available
   * @param {Array} sidebarData - Original sidebar data from JSON
   * @returns {Array} Filtered sidebar data with access level metadata
   */
  filterSidebarData(sidebarData) {
    try {
      // Always use permission-based filtering when API modules are loaded
      if (this.useApiModules && this.modulesLoaded) {
        console.log('[MenuService] Using permission-based filtering (API modules loaded)');
        return this.filterSidebarDataByPermissions(sidebarData);
      }

      // Fallback: If API modules not loaded, try role-based config
      const userRole = this.getUserRole();
      const roleConfig = ROLE_MENU_ACCESS[userRole];

      if (!roleConfig) {
        console.log(`[MenuService] No role config found for role: ${userRole}, and API modules not loaded`);
        // Return empty if no role config and no API modules
        return [];
      }

      console.log(`[MenuService] Fallback: Using role-based filtering for ${userRole}`);

      // Deep clone to avoid mutating original data
      const data = JSON.parse(JSON.stringify(sidebarData));

      // Process each section
      const filteredData = data.map(section => {
        const filteredMenus = section.menu.reduce((acc, menuItem) => {
          // Check if user can view this menu based on role
          if (!this.canViewMenu(menuItem.menuValue)) {
            return acc; // Skip this menu - user has no access
          }

          // Dashboard is now a simple menu item without submenus
          // All users with 'dashboard.read' permission can access it
          if (menuItem.menuValue.toLowerCase() === 'dashboard') {
            // Dashboard no longer has submenus - it's a direct route
            acc.push({
              ...menuItem,
              hasSubRoute: false,
              subMenus: [],
              accessLevel: 'read',
              canEdit: false,
              isReadOnly: false,
              showBadge: false
            });
          } else {
            // For non-dashboard menus
            if (menuItem.hasSubRoute || menuItem.hasSubRouteTwo) {
              // Filter submenus based on role configuration
              const filteredSubMenus = this.filterSubMenusByRole(menuItem.subMenus || [], menuItem.menuValue);

              // Only include menu if at least one submenu is accessible
              if (filteredSubMenus.length > 0) {
                const accessLevel = this.getMenuAccessLevel(menuItem.menuValue);
                const canEdit = this.canEditMenu(menuItem.menuValue);

                acc.push({
                  ...menuItem,
                  subMenus: filteredSubMenus,
                  accessLevel,
                  canEdit,
                  isReadOnly: accessLevel === 'read',
                  showBadge: true
                });
              }
            } else {
              // Single menu item without submenus
              const accessLevel = this.getMenuAccessLevel(menuItem.menuValue);
              const canEdit = this.canEditMenu(menuItem.menuValue);

              acc.push({
                ...menuItem,
                accessLevel,
                canEdit,
                isReadOnly: accessLevel === 'read',
                showBadge: true
              });
            }
          }

          return acc;
        }, []);

        return { ...section, menu: filteredMenus };
      })
      .filter(section => section.menu.length > 0); // Remove empty sections

      return filteredData;
    } catch (error) {
      console.error('[MenuService] Error filtering sidebar data:', error);
      return [];
    }
  }

  /**
   * Filter submenus based on role configuration
   * @param {Array} subMenus - Array of submenu items
   * @param {string} parentMenuValue - Parent menu value
   * @returns {Array} Filtered submenus with access level metadata
   */
  filterSubMenusByRole(subMenus, parentMenuValue) {
    return subMenus.reduce((acc, subMenu) => {
      // Check if user can view this submenu based on role
      if (!this.canViewSubMenu(parentMenuValue, subMenu.menuValue)) {
        return acc; // Skip this submenu
      }

      const accessLevel = this.getMenuAccessLevel(subMenu.menuValue);
      const canEdit = this.canEditMenu(subMenu.menuValue);

      // Handle nested submenus (subMenusTwo)
      if (subMenu.subMenusTwo && subMenu.subMenusTwo.length > 0) {
        const filteredSubMenusTwo = this.filterSubMenusByRole(subMenu.subMenusTwo, subMenu.menuValue);

        if (filteredSubMenusTwo.length > 0) {
          acc.push({
            ...subMenu,
            subMenusTwo: filteredSubMenusTwo,
            accessLevel,
            canEdit,
            isReadOnly: accessLevel === 'read',
            showBadge: true
          });
        }
      } else {
        acc.push({
          ...subMenu,
          accessLevel,
          canEdit,
          isReadOnly: accessLevel === 'read',
          showBadge: true
        });
      }

      return acc;
    }, []);
  }

  /**
   * Filter sidebar data based on user permissions (for dynamic roles)
   * This method is used when the user's role is not in ROLE_MENU_ACCESS
   * @param {Array} sidebarData - Original sidebar data from JSON
   * @returns {Array} Filtered sidebar data with access level metadata
   */
  filterSidebarDataByPermissions(sidebarData) {
    try {
      // Deep clone to avoid mutating original data
      const data = JSON.parse(JSON.stringify(sidebarData));
      const userPermissions = this.getUserPermissions();
      
      console.log(`[MenuService] ======== PERMISSION-BASED FILTERING ========`);
      console.log(`[MenuService] User permissions: ${userPermissions.join(', ')}`);
      console.log(`[MenuService] API modules loaded: ${this.modulesLoaded}, count: ${this.modules.length}`);
      
      console.log(`[MenuService] Filtering sidebar by permissions for ${userPermissions.length} permissions`);

      // Process each section
      const filteredData = data.map(section => {
        const filteredMenus = section.menu.reduce((acc, menuItem) => {
          // Dashboard - now a simple menu item without submenus
          if (menuItem.menuValue.toLowerCase() === 'dashboard') {
            // Check if user has dashboard.read permission
            const hasDashboardPermission = userPermissions.some(p => 
              p === 'dashboard.read' || p.startsWith('dashboard.')
            );
            
            if (hasDashboardPermission) {
              acc.push({
                ...menuItem,
                hasSubRoute: false,
                subMenus: [],
                route: '/dashboard',
                active_link: '/dashboard',
                accessLevel: 'read',
                canEdit: false,
                isReadOnly: false,
                showBadge: false
              });
            }
            return acc;
          }

          // Handle menus with submenus - check if ANY submenu has permission first
          if (menuItem.hasSubRoute || menuItem.hasSubRouteTwo) {
            const filteredSubMenus = this.filterSubMenusByPermission(menuItem.subMenus || [], menuItem.menuValue);

            // Only include menu if at least one submenu is accessible OR if parent menu has its own module
            const parentHasModule = this.hasModuleForMenu(menuItem.menuValue);
            const parentHasPermission = parentHasModule && this.canViewMenuByPermission(menuItem.menuValue);
            
            if (filteredSubMenus.length > 0 || parentHasPermission) {
              // Parent menu is visible because at least one submenu has permission OR parent has permission
              // If parent has permission but no submenus passed filter, still show parent with all submenus
              const subMenusToShow = filteredSubMenus.length > 0 
                ? filteredSubMenus 
                : (parentHasPermission ? (menuItem.subMenus || []) : []);
              
              if (subMenusToShow.length > 0) {
                acc.push({
                  ...menuItem,
                  subMenus: subMenusToShow,
                  accessLevel: parentHasPermission ? (this.canEditMenu(menuItem.menuValue) ? 'write' : 'read') : 'read',
                  canEdit: parentHasPermission ? this.canEditMenu(menuItem.menuValue) : false,
                  isReadOnly: parentHasPermission ? !this.canEditMenu(menuItem.menuValue) : true,
                  showBadge: parentHasPermission
                });
              }
            }
            return acc;
          }

          // For standalone menus (no submenus), check if menu has its own module
          if (!this.canViewMenuByPermission(menuItem.menuValue)) {
            return acc; // Skip this menu - user has no access
          }

          // Single menu item without submenus (e.g., Holidays, Resignation, Termination)
          const accessLevel = this.canEditMenu(menuItem.menuValue) ? 'write' : 'read';
          const canEdit = this.canEditMenu(menuItem.menuValue);

          acc.push({
            ...menuItem,
            accessLevel,
            canEdit,
            isReadOnly: accessLevel === 'read',
            showBadge: true
          });

          return acc;
        }, []);

        return { ...section, menu: filteredMenus };
      })
      .filter(section => section.menu.length > 0); // Remove empty sections

      console.log(`[MenuService] Filtered sidebar has ${filteredData.reduce((sum, s) => sum + s.menu.length, 0)} menu items`);
      return filteredData;
    } catch (error) {
      console.error('[MenuService] Error filtering sidebar data by permissions:', error);
      return [];
    }
  }

  /**
   * Filter submenus based on user permissions (for dynamic roles)
   * Each submenu must have its own module and permission to be visible
   * If a submenu doesn't have its own module, it falls back to the parent menu's module
   * @param {Array} subMenus - Array of submenu items
   * @param {string} parentMenuValue - Parent menu value (for fallback module check)
   * @returns {Array} Filtered submenus with access level metadata
   */
  filterSubMenusByPermission(subMenus, parentMenuValue) {
    console.log(`[MenuService] Filtering ${subMenus.length} submenus for parent: ${parentMenuValue}`);
    
    return subMenus.reduce((acc, subMenu) => {
      // Check if submenu has its own module
      let hasOwnModule = this.hasModuleForMenu(subMenu.menuValue);
      let moduleToCheck = subMenu.menuValue;
      
      // If submenu doesn't have its own module, fall back to parent menu's module
      if (!hasOwnModule) {
        console.log(`[MenuService] ⚠️ Submenu "${subMenu.menuValue}" has no module, checking parent "${parentMenuValue}"`);
        const hasParentModule = this.hasModuleForMenu(parentMenuValue);
        if (hasParentModule) {
          moduleToCheck = parentMenuValue;
          hasOwnModule = true;
          console.log(`[MenuService] ✅ Using parent module "${parentMenuValue}" for submenu "${subMenu.menuValue}"`);
        } else {
          // Neither submenu nor parent has a module - skip it
          console.log(`[MenuService] ❌ Submenu "${subMenu.menuValue}" and parent "${parentMenuValue}" have no module`);
          return acc;
        }
      }
      
      // Check permission for the module (either submenu's own or parent's)
      if (!this.canViewMenuByPermission(moduleToCheck)) {
        console.log(`[MenuService] ❌ Submenu "${subMenu.menuValue}" (using module "${moduleToCheck}") - no permission`);
        return acc; // Skip this submenu - user has no access
      }

      console.log(`[MenuService] ✅ Submenu "${subMenu.menuValue}" - has module and permission (using module: "${moduleToCheck}")`);

      // User has permission for this submenu (check using the module we found)
      const accessLevel = this.canEditMenu(moduleToCheck) ? 'write' : 'read';
      const canEdit = this.canEditMenu(moduleToCheck);

      // Handle nested submenus (subMenusTwo)
      if (subMenu.subMenusTwo && subMenu.subMenusTwo.length > 0) {
        const filteredSubMenusTwo = this.filterSubMenusByPermission(subMenu.subMenusTwo, subMenu.menuValue);

        if (filteredSubMenusTwo.length > 0) {
          acc.push({
            ...subMenu,
            subMenusTwo: filteredSubMenusTwo,
            accessLevel,
            canEdit,
            isReadOnly: accessLevel === 'read',
            showBadge: true
          });
        }
      } else {
        acc.push({
          ...subMenu,
          accessLevel,
          canEdit,
          isReadOnly: accessLevel === 'read',
          showBadge: true
        });
      }

      return acc;
    }, []);
  }

  /**
   * Check if user can perform a specific action on a module
   * Simplified to read/edit model:
   * - Read actions: read, view, show, export → module.read
   * - Edit actions: create, update, delete, import, bulk_create → module.edit
   *
   * @param {string} module - Module name (e.g., 'user', 'employee')
   * @param {string} action - Action name (e.g., 'create', 'update', 'delete', 'read', 'export')
   * @returns {boolean}
   */
  canPerformAction(module, action) {
    // Map actions to simplified read/edit permissions
    const readActions = ['read', 'view', 'show', 'export'];
    const editActions = ['create', 'update', 'delete', 'import', 'bulk_create', 'edit'];

    if (readActions.includes(action)) {
      return this.hasPermission(`${module}.read`);
    }

    if (editActions.includes(action)) {
      return this.hasPermission(`${module}.edit`);
    }

    // Fallback: try exact permission match for backward compatibility
    return this.hasPermission(`${module}.${action}`);
  }

  /**
   * Get all permissions for a specific module (simplified read/edit model)
   * @param {string} module - Module name
   * @returns {object} Object with read and edit permissions: {read: boolean, edit: boolean}
   */
  getModulePermissions(module) {
    return {
      read: this.hasPermission(`${module}.read`),
      edit: this.hasPermission(`${module}.edit`)
    };
  }

  /**
   * Check if user can access a route based on required permissions
   * @param {string|string[]} requiredPermissions - Single permission or array of permissions
   * @param {boolean} requireAll - If true, user must have ALL permissions. If false, ANY permission.
   * @returns {boolean}
   */
  canAccessRoute(requiredPermissions, requireAll = false) {
    if (!requiredPermissions) return true;

    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

    if (permissions.length === 0) return true;

    return requireAll
      ? this.hasAllPermissions(permissions)
      : this.hasAnyPermission(permissions);
  }

  // ============================================================================
  // DEPRECATED METHODS (For backward compatibility)
  // ============================================================================

  /**
   * @deprecated Use canViewMenu instead
   */
  isMenuAllowed(menuValue) {
    console.warn('[MenuService] isMenuAllowed is deprecated. Use canViewMenu instead.');
    return this.canViewMenu(menuValue);
  }

  /**
   * @deprecated Use canViewMenu instead
   */
  isSubmenuAllowed(parentMenuValue, submenuValue) {
    console.warn('[MenuService] isSubmenuAllowed is deprecated. Use canViewMenu instead.');
    return this.canViewMenu(submenuValue);
  }

  /**
   * @deprecated Permission-based filtering is now used instead of role-based
   */
  getAllowedMenus() {
    console.warn('[MenuService] getAllowedMenus is deprecated. Menus are now filtered by permissions.');
    return [];
  }

  /**
   * @deprecated Permission-based filtering is now used instead of role-based
   */
  getAllowedSubmenus(menuValue) {
    console.warn('[MenuService] getAllowedSubmenus is deprecated. Submenus are now filtered by permissions.');
    return [];
  }

  /**
   * @deprecated Use hasPermission or hasAnyPermission instead
   */
  hasRole(requiredRole) {
    console.warn('[MenuService] hasRole is deprecated. Use permission-based checks instead.');
    const userRole = this.getUserRole();
    return userRole === requiredRole.toLowerCase();
  }

  /**
   * @deprecated Use hasPermission or hasAnyPermission instead
   */
  hasAnyRole(requiredRoles) {
    console.warn('[MenuService] hasAnyRole is deprecated. Use permission-based checks instead.');
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const userRole = this.getUserRole();
    return requiredRoles.some(role => role.toLowerCase() === userRole);
  }
}

// Export singleton instance
export const menuService = new MenuService();

// Export class for testing
export { MenuService };

import { ROLE_HIERARCHY, ROLE_MENU_ACCESS } from '../config/role-menu.config';

class MenuService {
  // Get user's role
  getUserRole() {
    const role = localStorage.getItem('userRole');
    if (!role) {
      console.warn('No user role found in storage');
      return 'employee'; // default fallback
    }
    return role.toLowerCase();
  }

  // Get user's permissions
  getUserPermissions() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.permissions || [];
    } catch (error) {
      console.error('Error parsing user permissions:', error);
      return [];
    }
  }

  // Check if user has required role based on hierarchy
  hasRole(requiredRole) {
    const userRole = this.getUserRole();
    const userRoleLevel = ROLE_HIERARCHY[userRole] || 999;
    const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 999;

    return userRoleLevel <= requiredRoleLevel;
  }

  // Check if user has any of the required roles
  hasAnyRole(requiredRoles) {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.some(role => this.hasRole(role));
  }

  // Check if menu item is allowed for user's role
  isMenuAllowed(menuValue) {
    const userRole = this.getUserRole();
    const roleAccess = ROLE_MENU_ACCESS[userRole];
    return roleAccess?.allowedMenus.includes(menuValue) || false;
  }

  // Check if submenu item is allowed for user's role
  isSubmenuAllowed(parentMenuValue, submenuValue) {
    const userRole = this.getUserRole();
    const roleAccess = ROLE_MENU_ACCESS[userRole];
    return roleAccess?.allowedSubMenus?.[parentMenuValue]?.includes(submenuValue) || false;
  }

  // Get allowed menus for current user
  getAllowedMenus() {
    const userRole = this.getUserRole();
    return ROLE_MENU_ACCESS[userRole]?.allowedMenus || [];
  }

  // Get allowed submenus for a specific menu
  getAllowedSubmenus(menuValue) {
    const userRole = this.getUserRole();
    return ROLE_MENU_ACCESS[userRole]?.allowedSubMenus?.[menuValue] || [];
  }

  // Filter sidebar data based on user's role
  filterSidebarData(sidebarData) {
    try {
      const userRole = this.getUserRole();
      const roleAccess = ROLE_MENU_ACCESS[userRole];

      if (!roleAccess) {
        console.warn(`No menu access configuration found for role: ${userRole}`);
        return [];
      }

      const allowedMenus = roleAccess.allowedMenus;

      // Process each section and update its menu items
      const filteredData = sidebarData.map(section => {
        // Use reduce to both transform and filter menu items
        const filteredMenus = section.menu.reduce((acc, menuItem) => {
          // Handle Dashboard specially (case-insensitive)
          if (menuItem.menuValue.toLowerCase() === 'dashboard') {
            // Get allowed Dashboard submenu items for this role
            const allowedDashboardSubMenus = roleAccess.allowedSubMenus?.[menuItem.menuValue] || [];
            // Filter the Dashboard submenus based on allowed values
            const filteredSubMenus = menuItem.subMenus.filter(subMenu =>
              allowedDashboardSubMenus.includes(subMenu.menuValue)
            );
            // Only add the Dashboard menu if there is at least one allowed submenu
            if (filteredSubMenus.length > 0) {
              acc.push({ ...menuItem, subMenus: filteredSubMenus });
            }
          } else {
            // For non-dashboard items, check if the menu is allowed
            if (allowedMenus.includes(menuItem.menuValue)) {
              // If the menu has subroutes, filter them too
              if (menuItem.hasSubRoute || menuItem.hasSubRouteTwo) {
                const allowedSubmenus = roleAccess.allowedSubMenus?.[menuItem.menuValue] || [];
                const filteredSubMenus = menuItem.subMenus.filter(subMenu =>
                  allowedSubmenus.includes(subMenu.menuValue)
                );
                // Only include the menu if there is at least one allowed submenu
                if (filteredSubMenus.length > 0) {
                  acc.push({ ...menuItem, subMenus: filteredSubMenus });
                }
              } else {
                // For menus without subroutes, simply add them
                acc.push(menuItem);
              }
            }
          }
          return acc;
        }, []);

        return { ...section, menu: filteredMenus };
      })
        // Remove sections that have no menu items
        .filter(section => section.menu.length > 0);

      return filteredData;
    } catch (error) {
      console.error('Error filtering sidebar data:', error);
      return [];
    }
  }

  // Check if user has required permission
  hasPermission(requiredPermission) {
    if (!requiredPermission) return true;
    const userRole = this.getUserRole();
    const rolePermissions = ROLE_MENU_ACCESS[userRole]?.permissions || [];
    const userPermissions = this.getUserPermissions();

    return rolePermissions.includes(requiredPermission) ||
      userPermissions.includes(requiredPermission);
  }

  // Check if user has all required permissions
  hasAllPermissions(requiredPermissions) {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.every(permission => this.hasPermission(permission));
  }

  // Check if user has any of the required permissions
  hasAnyPermission(requiredPermissions) {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.some(permission => this.hasPermission(permission));
  }

  // Check if user can access a specific route
  canAccessRoute(route, requiredRoles = [], requiredPermissions = []) {
    return this.hasAnyRole(requiredRoles) && this.hasAnyPermission(requiredPermissions);
  }
}

export const menuService = new MenuService();
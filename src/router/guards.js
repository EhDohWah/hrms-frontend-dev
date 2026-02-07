import { authService } from '@/services/auth.service';
import { initEcho, disconnectEcho, isEchoInitialized, initPermissionUpdateListener, initProfileUpdateListener } from '@/plugins/echo';

export const authGuard = (to, from, next) => {
    const isAuthenticated = authService.isAuthenticated();
    const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    const authRequired = !publicPages.includes(to.path);
    // NOTE: Token is now in HttpOnly cookie (not in localStorage) for XSS protection
    // We track user data and expiration in localStorage to determine auth state
    const user = localStorage.getItem('user');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    // If user and expiration exist, check whether session is expired
    if (user && tokenExpiration) {
        // tokenExpiration is stored in milliseconds
        const expiryTimeMs = Number(tokenExpiration);
        if (Date.now() > expiryTimeMs) {
            // Session is expired. Clear out local storage and redirect to login.
            // NOTE: We no longer clear 'token' as it's in HttpOnly cookie (cleared by backend on logout)
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            localStorage.removeItem('permissions');
            disconnectEcho();
            return next('/login');
        }
    }

    // Initialize Echo once per session when user is authenticated
    // NOTE: Token is in HttpOnly cookie, Echo uses cookie-based auth via credentials: 'include'
    if (isAuthenticated && user && !isEchoInitialized()) {
        initEcho(); // No token parameter needed - cookie is sent automatically

        // Initialize real-time listeners for permission and profile sync
        const userData = JSON.parse(user);
        if (userData?.id) {
            initPermissionUpdateListener(userData.id);
            initProfileUpdateListener(userData.id);
            // Note: Notification subscription is handled in layout-header.vue
            // to properly show toast notifications with retry logic
        }
    }


    // Handle root path redirection to dynamic dashboard
    if (isAuthenticated && to.path === '/') {
        // All authenticated users go to the dynamic dashboard
        // Widget visibility is handled by permissions on the dashboard itself
        return next('/dashboard');
    }

    if (authRequired && !isAuthenticated) {
        // Save the intended route for redirection after login
        localStorage.setItem('intendedRoute', to.fullPath);
        return next('/login');
    }

    if (isAuthenticated && publicPages.includes(to.path)) {
        // Check if there's an intended route - if so, let the login component handle the redirect
        const intendedRoute = localStorage.getItem('intendedRoute');

        if (intendedRoute && intendedRoute !== '/login' && intendedRoute !== to.path) {
            // There's an intended route, allow navigation to continue
            // The login component will handle the redirect
            return next();
        }

        // No intended route, redirect to dynamic dashboard
        // All authenticated users use the same dashboard with permission-based widgets
        return next('/dashboard');
    }

    next();
};

/**
 * Role Guard - allows access based on user role OR permissions
 * For dynamic roles not in the allowedRoles list, it falls back to permission checking
 * @param {string[]} allowedRoles - Array of allowed role names
 * @param {string|string[]} fallbackPermissions - Permission(s) to check if role not in allowedRoles (optional)
 */
export const roleGuard = (allowedRoles, fallbackPermissions = null) => {
    return (to, from, next) => {
        const userRole = localStorage.getItem('userRole');
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

        if (!userRole) {
            return next('/login');
        }

        // Convert both arrays to lowercase for case-insensitive comparison
        const userRoleLower = userRole.toLowerCase();
        const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());

        // Check if user's role is in the allowed roles list
        if (allowedRolesLower.includes(userRoleLower)) {
            return next();
        }

        // For dynamic roles not in the list, check fallback permissions
        if (fallbackPermissions) {
            const permArray = Array.isArray(fallbackPermissions) ? fallbackPermissions : [fallbackPermissions];
            const hasPermission = permArray.some(perm => permissions.includes(perm));
            if (hasPermission) {
                return next();
            }
        }

        // If no fallback permissions specified, try to infer from route path
        // This allows dynamic roles with appropriate permissions to access routes
        const routePath = to.path.toLowerCase();
        const routeSegments = routePath.split('/').filter(s => s);
        
        if (routeSegments.length > 0) {
            const moduleName = routeSegments[0]; // e.g., 'employee', 'attendance', etc.
            
            // Check for common permission patterns
            const readPermissions = [
                `${moduleName}.read`,
                `${moduleName}s.read`, // plural form
                `${moduleName.replace(/-/g, '_')}.read`, // with underscores
            ];
            
            const hasModulePermission = readPermissions.some(perm => permissions.includes(perm));
            if (hasModulePermission) {
                return next();
            }
        }

        next('/unauthorized');
    };
};

/**
 * Permission Guard - allows access based on specific permission(s)
 * @param {string|string[]} requiredPermission - Permission(s) required for access
 */
export const permissionGuard = (requiredPermission) => {
    return (to, from, next) => {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

        if (!permissions.length) {
            return next('/login');
        }

        // Support both single permission and array of permissions
        const permArray = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
        
        // User needs at least one of the required permissions
        const hasPermission = permArray.some(perm => permissions.includes(perm));
        
        if (hasPermission) {
            next();
        } else {
            next('/unauthorized');
        }
    };
}; 
import { authService } from '@/services/auth.service';
import { initEcho, disconnectEcho, isEchoInitialized } from '@/plugins/echo';

export const authGuard = (to, from, next) => {
    const isAuthenticated = authService.isAuthenticated();
    const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    const authRequired = !publicPages.includes(to.path);
    // Retrieve token and expiration from localStorage
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    // e.g. "1741721978" (seconds since epoch)

    // If token and expiration exist, check whether it is expired
    if (token && tokenExpiration) {
        // If your tokenExpiration is in seconds, multiply by 1000 to compare with Date.now() (which is in ms)
        const expiryTimeMs = Number(tokenExpiration) * 1000;
        if (Date.now() > expiryTimeMs) {
            // Token is expired. Clear out local storage and redirect to login.
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            localStorage.removeItem('permissions');
            disconnectEcho();
            return next('/login');
        }
    }

    // ----> Echo initialization logic here
    if (isAuthenticated && token && !isEchoInitialized()) {
        initEcho(token);
    }


    // Handle root path redirection based on role
    if (isAuthenticated && to.path === '/') {
        const userRole = localStorage.getItem('userRole')?.toLowerCase();

        switch (userRole) {
            case 'admin':
                return next('/dashboard/admin-dashboard');
            case 'hr-manager':
                return next('/dashboard/hr-manager-dashboard');
            case 'hr-assistant':
                return next('/dashboard/hr-assistant-dashboard');
            case 'employee':
                return next('/dashboard/employee-dashboard');
            default:
                return next('/login');
        }
    }

    if (authRequired && !isAuthenticated) {
        // Save the intended route for redirection after login
        localStorage.setItem('intendedRoute', to.fullPath);
        return next('/login');
    }

    if (isAuthenticated && publicPages.includes(to.path)) {
        const userRole = localStorage.getItem('userRole')?.toLowerCase();

        switch (userRole) {
            case 'admin':
                return next('/dashboard/admin-dashboard');
            case 'hr-manager':
                return next('/dashboard/hr-manager-dashboard');
            case 'hr-assistant':
                return next('/dashboard/hr-assistant-dashboard');
            case 'employee':
                return next('/dashboard/employee-dashboard');
            default:
                return next('/dashboard/employee-dashboard');
        }
    }

    next();
};

export const roleGuard = (allowedRoles) => {
    return (to, from, next) => {
        const userRole = localStorage.getItem('userRole');

        if (!userRole) {
            return next('/login');
        }

        // Convert both arrays to lowercase for case-insensitive comparison
        const userRoleLower = userRole.toLowerCase();
        const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());

        if (allowedRolesLower.includes(userRoleLower)) {
            next();
        } else {
            next('/unauthorized');
        }
    };
};

export const permissionGuard = (requiredPermission) => {
    return (to, from, next) => {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

        if (!permissions.length) {
            return next('/login');
        }

        if (permissions.includes(requiredPermission)) {
            next();
        } else {
            next('/unauthorized');
        }
    };
}; 
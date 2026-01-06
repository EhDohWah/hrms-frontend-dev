/**
 * Module Service - Dynamic Menu System API Integration
 *
 * This service handles API calls for the dynamic module/menu system.
 * It fetches modules from the database instead of using hardcoded configurations.
 *
 * Key Features:
 * - Fetch modules from backend API
 * - Cache modules with TTL for performance
 * - Get user permissions per module
 * - Update user permissions (Admin/HR Manager only)
 *
 * @version 1.0.0
 * @author HRMS Development Team
 */

import { API_CONFIG } from '../config/api.config';

class ModuleService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = { ...API_CONFIG.HEADERS };
        this.cacheKey = 'hrms_modules_cache';
        this.cacheTTL = 3600000; // 1 hour in milliseconds

        // Set auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            this.setAuthToken(token);
        }
    }

    /**
     * Set authentication token
     * @param {string} token - JWT token
     */
    setAuthToken(token) {
        if (token) {
            this.headers['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.headers['Authorization'];
        }
    }

    /**
     * Get full API URL
     * @param {string} endpoint - API endpoint
     * @returns {string} Full URL
     */
    getFullURL(endpoint) {
        if (!endpoint) {
            endpoint = '';
        } else if (endpoint && !endpoint.startsWith('/')) {
            endpoint = `/${endpoint}`;
        }
        return `${this.baseURL}${endpoint}`;
    }

    /**
     * Handle API response
     * @param {Response} response - Fetch response
     * @returns {Promise<object>}
     */
    async handleResponse(response) {
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || response.statusText);
            error.response = {
                status: response.status,
                data: data
            };
            throw error;
        }

        return data;
    }

    /**
     * Fetch all active modules from API
     * @param {boolean} forceRefresh - Skip cache and fetch fresh data
     * @returns {Promise<Array>} Array of modules
     */
    async fetchModules(forceRefresh = false) {
        try {
            // Check cache first if not forcing refresh
            if (!forceRefresh) {
                const cached = this.getCachedModules();
                if (cached) {
                    console.log('[ModuleService] Using cached modules');
                    return cached;
                }
            }

            console.log('[ModuleService] Fetching modules from API');
            const response = await fetch(this.getFullURL('/admin/modules'), {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            });

            const result = await this.handleResponse(response);

            if (result.success && result.data) {
                // Cache the modules
                this.cacheModules(result.data);
                console.log(`[ModuleService] Fetched ${result.data.length} modules from API`);
                return result.data;
            }

            console.warn('[ModuleService] API response missing data');
            return [];
        } catch (error) {
            console.error('[ModuleService] Error fetching modules:', error);

            // Return cached data as fallback
            const cached = this.getCachedModules();
            if (cached) {
                console.log('[ModuleService] Using cached modules as fallback');
                return cached;
            }

            return [];
        }
    }

    /**
     * Fetch modules in hierarchical tree structure
     * @returns {Promise<Array>} Hierarchical modules
     */
    async fetchHierarchicalModules() {
        try {
            const response = await fetch(this.getFullURL('/admin/modules/hierarchical'), {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            });

            const result = await this.handleResponse(response);
            return result.success ? result.data : [];
        } catch (error) {
            console.error('[ModuleService] Error fetching hierarchical modules:', error);
            return [];
        }
    }

    /**
     * Fetch modules grouped by category
     * @returns {Promise<object>} Modules grouped by category
     */
    async fetchModulesByCategory() {
        try {
            const response = await fetch(this.getFullURL('/admin/modules/by-category'), {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            });

            const result = await this.handleResponse(response);
            return result.success ? result.data : {};
        } catch (error) {
            console.error('[ModuleService] Error fetching modules by category:', error);
            return {};
        }
    }

    /**
     * Get a single module by ID
     * @param {number} moduleId - Module ID
     * @returns {Promise<object|null>} Module object or null
     */
    async getModule(moduleId) {
        try {
            const response = await fetch(this.getFullURL(`/admin/modules/${moduleId}`), {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            });

            const result = await this.handleResponse(response);
            return result.success ? result.data : null;
        } catch (error) {
            console.error(`[ModuleService] Error fetching module ${moduleId}:`, error);
            return null;
        }
    }

    /**
     * Get all unique permissions from all modules
     * @returns {Promise<Array>} Array of permission strings
     */
    async getAllPermissions() {
        try {
            const response = await fetch(this.getFullURL('/admin/modules/permissions'), {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            });

            const result = await this.handleResponse(response);
            return result.success ? result.data : [];
        } catch (error) {
            console.error('[ModuleService] Error fetching permissions:', error);
            return [];
        }
    }

    /**
     * Get user permissions grouped by module
     * Returns Read/Edit flags for each module
     *
     * @param {number} userId - User ID
     * @returns {Promise<object>} User permissions object
     */
    async getUserPermissions(userId) {
        try {
            const response = await fetch(this.getFullURL(`/admin/user-permissions/${userId}`), {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            });

            const result = await this.handleResponse(response);
            return result.success ? result.data : null;
        } catch (error) {
            console.error(`[ModuleService] Error fetching user ${userId} permissions:`, error);
            throw error;
        }
    }

    /**
     * Update user permissions using Read/Edit checkboxes
     *
     * @param {number} userId - User ID
     * @param {object} modules - Object with module permissions
     * @example
     * {
     *   "user_management": { read: true, edit: true },
     *   "employees": { read: true, edit: false }
     * }
     * @returns {Promise<object>} Update result
     */
    async updateUserPermissions(userId, modules) {
        try {
            const response = await fetch(this.getFullURL(`/admin/user-permissions/${userId}`), {
                method: 'PUT',
                headers: this.headers,
                credentials: 'include',
                body: JSON.stringify({ modules })
            });

            const result = await this.handleResponse(response);

            if (result.success) {
                console.log(`[ModuleService] Updated permissions for user ${userId}`);
            }

            return result;
        } catch (error) {
            console.error(`[ModuleService] Error updating user ${userId} permissions:`, error);
            throw error;
        }
    }

    /**
     * Get permission summary for a user
     * @param {number} userId - User ID
     * @returns {Promise<object>} Permission summary
     */
    async getUserPermissionsSummary(userId) {
        try {
            const response = await fetch(this.getFullURL(`/admin/user-permissions/${userId}/summary`), {
                method: 'GET',
                headers: this.headers,
                credentials: 'include'
            });

            const result = await this.handleResponse(response);
            return result.success ? result.data : null;
        } catch (error) {
            console.error(`[ModuleService] Error fetching user ${userId} permissions summary:`, error);
            return null;
        }
    }

    // ============================================================================
    // CACHING METHODS
    // ============================================================================

    /**
     * Cache modules in localStorage
     * @param {Array} modules - Modules to cache
     */
    cacheModules(modules) {
        try {
            const cacheData = {
                data: modules,
                timestamp: Date.now(),
                ttl: this.cacheTTL
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
            console.log('[ModuleService] Modules cached successfully');
        } catch (error) {
            console.error('[ModuleService] Error caching modules:', error);
        }
    }

    /**
     * Get cached modules if still valid
     * @returns {Array|null} Cached modules or null if expired/missing
     */
    getCachedModules() {
        try {
            const cacheStr = localStorage.getItem(this.cacheKey);
            if (!cacheStr) {
                return null;
            }

            const cache = JSON.parse(cacheStr);
            const now = Date.now();

            // Check if cache is still valid
            if (now - cache.timestamp > cache.ttl) {
                console.log('[ModuleService] Cache expired');
                this.clearCache();
                return null;
            }

            return cache.data;
        } catch (error) {
            console.error('[ModuleService] Error reading cache:', error);
            this.clearCache();
            return null;
        }
    }

    /**
     * Clear module cache
     */
    clearCache() {
        try {
            localStorage.removeItem(this.cacheKey);
            console.log('[ModuleService] Cache cleared');
        } catch (error) {
            console.error('[ModuleService] Error clearing cache:', error);
        }
    }

    /**
     * Check if cache exists and is valid
     * @returns {boolean}
     */
    isCacheValid() {
        const cached = this.getCachedModules();
        return cached !== null;
    }

    // ============================================================================
    // HELPER METHODS
    // ============================================================================

    /**
     * Convert modules array to permission map format
     * Used for backward compatibility with old menu system
     *
     * @param {Array} modules - Modules from API
     * @returns {object} Permission map object
     */
    convertModulesToPermissionMap(modules) {
        const permissionMap = {};

        modules.forEach(module => {
            permissionMap[module.display_name] = {
                readPermission: module.read_permission,
                writePermissions: module.edit_permissions
            };
        });

        return permissionMap;
    }

    /**
     * Find module by name
     * @param {Array} modules - Modules array
     * @param {string} moduleName - Module name to find
     * @returns {object|null} Module or null
     */
    findModuleByName(modules, moduleName) {
        return modules.find(m => m.name === moduleName) || null;
    }

    /**
     * Find module by display name
     * @param {Array} modules - Modules array
     * @param {string} displayName - Display name to find
     * @returns {object|null} Module or null
     */
    findModuleByDisplayName(modules, displayName) {
        return modules.find(m => m.display_name === displayName) || null;
    }

    /**
     * Get modules by category
     * @param {Array} modules - Modules array
     * @param {string} category - Category name
     * @returns {Array} Filtered modules
     */
    getModulesByCategory(modules, category) {
        return modules.filter(m => m.category === category);
    }

    /**
     * Get root modules (no parent)
     * @param {Array} modules - Modules array
     * @returns {Array} Root modules
     */
    getRootModules(modules) {
        return modules.filter(m => !m.parent_id);
    }

    /**
     * Get child modules of a parent
     * @param {Array} modules - Modules array
     * @param {number} parentId - Parent module ID
     * @returns {Array} Child modules
     */
    getChildModules(modules, parentId) {
        return modules.filter(m => m.parent_id === parentId);
    }
}

// Export singleton instance
export const moduleService = new ModuleService();

// Export class for testing
export { ModuleService };

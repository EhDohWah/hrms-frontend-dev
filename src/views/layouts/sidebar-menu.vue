<template>
    <ul>
        <!-- Loading skeleton - shows realistic menu structure while loading -->
        <template v-if="isLoadingMenu">
            <li class="menu-title">
                <span class="skeleton-text" style="width: 100px;"></span>
            </li>
            <li v-for="i in 5" :key="'skeleton-' + i" class="menu-item-skeleton">
                <a href="javascript:void(0);">
                    <div class="skeleton-icon"></div>
                    <span class="skeleton-text" :style="{ width: (100 + i * 20) + 'px' }"></span>
                </a>
            </li>
        </template>

        <!-- Actual menu - only show when not loading -->
        <template v-else v-for="item in sideBarData" :key="item.tittle">
            <li class="menu-title">
                <span>{{ item.tittle }}</span>
            </li>
            <li>
                <ul>
                    <template v-for="menu in item.menu" :key="menu.menuValue">
                        <!-- Simple menu item without submenus (including Dashboard when hasSubRoute is false) -->
                        <li v-if="!menu.hasSubRoute"
                            :class="{ 'active': isMenuActive(menu) }">
                            <router-link v-if="menu.route" :to="menu.route">
                                <i :class="'ti ti-' + menu.icon"></i>
                                <span>{{ menu.menuValue }}</span>
                            </router-link>
                        </li>
                        
                        <!-- Dashboard with submenus (only when hasSubRoute is true and has subMenus) -->
                        <li v-else-if="menu.menuValue === 'Dashboard' && menu.hasSubRoute && menu.subMenus && menu.subMenus.length > 0" class="submenu">
                            <a href="#" @click.prevent="toggleDashboard"
                                :class="{ subdrop: isDashboardOpen, 'active': isActive(menu) }">
                                <i :class="'ti ti-' + menu.icon"></i>
                                <span>{{ menu.menuValue }}</span>
                                <span class="menu-arrow"></span>
                            </a>
                            <ul :class="{ 'd-block': isDashboardOpen, 'd-none': !isDashboardOpen }">
                                <li v-for="(subMenu, index) in menu.subMenus" :key="index"
                                    :class="{ 'active': isSubMenuActive(subMenu) }">
                                    <router-link :to="subMenu.route">
                                        {{ subMenu.menuValue }}
                                    </router-link>
                                </li>
                            </ul>
                        </li>

                        <li v-else-if="menu.hasSubRouteTwo" class="submenu">
                            <a href="#" @click.prevent="OpenMenu(menu)"
                                :class="{ subdrop: openMenuItem === menu, 'active': isActive(menu) }">
                                <i :class="'ti ti-' + menu.icon"></i><span>{{ menu.menuValue }}</span>
                                <span class="menu-arrow"></span>
                            </a>
                            <ul :class="{ 'd-block': openMenuItem === menu, 'd-none': openMenuItem !== menu }">
                                <li v-for="subMenus in menu.subMenus" :key="subMenus.menuValue" :class="{ 'submenu submenu-two': subMenus.customSubmenuTwo }">
                                    <template v-if="!subMenus.customSubmenuTwo">
                                        <router-link :to="subMenus.route"
                                            :class="{ 'active': isSubMenuActive(subMenus) }">
                                            {{ subMenus.menuValue }}
                                        </router-link>
                                    </template>
                                    <template v-else-if="subMenus.customSubmenuTwo">
                                        <a href="#" @click.prevent="openSubmenuOne(subMenus)"
                                            :class="{ subdrop: openSubmenuOneItem === subMenus, 'active': isSubActive(subMenus) }">
                                            {{ subMenus.menuValue }}<span class="menu-arrow inside-submenu"></span>
                                        </a>
                                        <ul
                                            :class="{ 'd-block': openSubmenuOneItem === subMenus, 'd-none': openSubmenuOneItem !== subMenus }">
                                            <li v-for="subMenuTwo in subMenus.subMenusTwo" :key="subMenuTwo.menuValue">
                                                <router-link :to="subMenuTwo.route">
                                                    {{ subMenuTwo.menuValue }}
                                                </router-link>
                                            </li>
                                        </ul>
                                    </template>
                                </li>
                            </ul>
                        </li>

                        <li v-else class="submenu">
                            <a href="#" @click.prevent="expandSubMenus(menu)"
                                :class="{ subdrop: menu.showSubRoute, 'active': isActive(menu) }">
                                <i :class="'ti ti-' + menu.icon"></i><span>{{ menu.menuValue }}</span>
                                <span class="menu-arrow"></span>
                            </a>
                            <ul :class="{ 'd-block': menu.showSubRoute, 'd-none': !menu.showSubRoute }">
                                <li v-for="(subMenu, index) in menu.subMenus" :key="index" :class="{ 'active': isSubMenuActive(subMenu) }">
                                    <router-link :to="subMenu.route">
                                        {{ subMenu.menuValue }}
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </template>
                </ul>
            </li>
        </template>
    </ul>
</template>

<script>
import sideBarData from "@/assets/json/sidebar-data.json";
import { menuService } from '@/services/menu.service';

// Cache for base sidebar data to avoid repeated JSON parsing
let cachedBaseSidebarData = null;

/**
 * Get base sidebar data with caching
 * Parses JSON only once, improving memory and performance
 */
function getBaseSidebarData() {
    if (!cachedBaseSidebarData) {
        cachedBaseSidebarData = JSON.parse(JSON.stringify(sideBarData));
    }
    return cachedBaseSidebarData;
}

/**
 * Clone sidebar data efficiently
 * Uses structured clone when available for better performance
 */
function cloneSidebarData() {
    const baseData = getBaseSidebarData();
    // Use structuredClone for better performance if available
    if (typeof structuredClone === 'function') {
        return structuredClone(baseData);
    }
    return JSON.parse(JSON.stringify(baseData));
}

/**
 * Pre-load menu data from cache synchronously
 * This runs BEFORE Vue component initialization to prevent blank screen flash
 */
function preloadMenuFromCache() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { sideBarData: [], isLoading: false };
        }

        // Try to load from localStorage cache directly (synchronous)
        const cacheKey = 'hrms_modules_cache';
        const cacheStr = localStorage.getItem(cacheKey);

        if (cacheStr) {
            const cache = JSON.parse(cacheStr);
            const now = Date.now();
            const cacheTTL = 3600000; // 1 hour

            // Check if cache is still valid
            if (now - cache.timestamp <= cacheTTL && cache.data && cache.data.length > 0) {
                // Load cache into menuService synchronously
                menuService.modules = cache.data;
                menuService.modulesLoaded = true;
                menuService.useApiModules = true;

                // Filter and return sidebar data immediately using optimized clone
                const filteredData = menuService.filterSidebarData(cloneSidebarData());
                console.log('[SidebarMenu] Pre-loaded menu from cache synchronously');
                return { sideBarData: filteredData, isLoading: false };
            }
        }

        // No valid cache - will need to load from API
        console.log('[SidebarMenu] No valid cache, will load from API');
        return { sideBarData: [], isLoading: true };
    } catch (error) {
        console.error('[SidebarMenu] Error pre-loading from cache:', error);
        return { sideBarData: [], isLoading: true };
    }
}

export default {
    data() {
        // Pre-load menu from cache synchronously BEFORE component creation
        // This ensures data is available on first render, preventing blank screen
        const preloadedData = preloadMenuFromCache();

        return {
            sideBarData: preloadedData.sideBarData,
            openMenuItem: null,
            openSubmenuOneItem: null,
            route_array: [],
            multilevel: [false, false, false],
            isDashboardOpen: false,
            isLoadingMenu: preloadedData.isLoading
        };
    },
    computed: {
        userRole() {
            return localStorage.getItem('userRole')?.toLowerCase() || 'employee';
        },
        currentPath() {
            return this.$route.path;
        },
        isMenuActive() {
            return (menu) => {
                if (menu.menuValue === 'Dashboard') {
                    return this.$route.path.includes('/dashboard/');
                }
                const currentPath = this.$route.path;
                const pathSegments = currentPath.split('/').filter(part => part);
                const menuPath = menu.route?.split('/').filter(part => part) || [];

                return currentPath === menu.route ||
                    currentPath === menu.active_link ||
                    currentPath === menu.active_link1 ||
                    (pathSegments[0] === menuPath[0]);
            };
        },
        isActive() {
            return (menu) => {
                if (menu.menuValue === 'Dashboard') {
                    return this.$route.path.includes('/dashboard/');
                }
                const currentPath = this.$route.path;
                const pathSegments = currentPath.split('/').filter(part => part);
                const base = pathSegments[0];

                return base === menu.active_link ||
                    base === menu.active_link1 ||
                    (menu.route && currentPath.startsWith(menu.route));
            };
        },
        isSubActive() {
            return (menu) => {
                const currentPath = this.$route.path;
                const pathSegments = currentPath.split('/').filter(part => part);
                const base = pathSegments[0];
                const subPath = pathSegments[1];

                if (base === 'dashboard') {
                    const dashboardType = subPath?.replace('-dashboard', '');
                    const menuValue = menu.menuValue.toLowerCase();
                    return menuValue.includes(dashboardType);
                }

                return base === menu.active_link ||
                    (menu.route && currentPath.startsWith(menu.route));
            };
        }
    },
    watch: {
        '$route': {
            handler(newRoute) {
                if (newRoute.path.includes('/dashboard/')) {
                    this.isDashboardOpen = true;
                }
                this.initializeActiveMenus();
            },
            immediate: true
        }
    },
    async created() {
        // If menu was pre-loaded from cache, just refresh in background
        // Otherwise, load from API now
        if (!this.isLoadingMenu) {
            // Menu already loaded from cache - refresh in background
            this.refreshModulesInBackground();
        } else {
            // No cache - load from API now
            await this.loadMenu();
        }
    },
    mounted() {
        // Listen for permission updates to refresh menu dynamically
        window.addEventListener('permissions-updated', this.handlePermissionsUpdated);
        // Listen for modules loaded event
        window.addEventListener('modules-loaded', this.handleModulesLoaded);
    },
    beforeUnmount() {
        // Cleanup event listeners to prevent memory leaks
        window.removeEventListener('permissions-updated', this.handlePermissionsUpdated);
        window.removeEventListener('modules-loaded', this.handleModulesLoaded);
    },
    methods: {
        /**
         * Load menu from API (called only when cache is not available)
         * @returns {Promise<void>}
         */
        async loadMenu() {
            try {
                console.log('[SidebarMenu] Loading menu from API');
                this.isLoadingMenu = true;

                // Wait for modules to load from API
                await this.waitForModules();

                // Filter and display menu
                this.sideBarData = menuService.filterSidebarData(cloneSidebarData());
                this.isLoadingMenu = false;

                console.log('[SidebarMenu] Menu loaded from API successfully');
            } catch (error) {
                console.error('[SidebarMenu] Error loading menu:', error);
                this.isLoadingMenu = false;
            }
        },

        /**
         * Refresh modules in background (non-blocking)
         */
        refreshModulesInBackground() {
            // Refresh modules asynchronously without blocking UI
            menuService.initialize().catch(error => {
                console.warn('[SidebarMenu] Background module refresh failed:', error);
            });
        },

        /**
         * Wait for modules to be loaded from API (fallback when no cache)
         * @returns {Promise<void>}
         */
        async waitForModules() {
            // Try to initialize menu service
            try {
                await menuService.initialize();
            } catch (error) {
                console.error('[SidebarMenu] Error initializing menu service:', error);
            }

            // If modules are already loaded, return immediately
            if (menuService.isUsingApiModules() && menuService.getModules().length > 0) {
                return;
            }

            // Wait for modules-loaded event with timeout
            return new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    console.warn('[SidebarMenu] Timeout waiting for modules, proceeding with available data');
                    resolve();
                }, 5000); // 5 second timeout

                const handler = () => {
                    clearTimeout(timeout);
                    window.removeEventListener('modules-loaded', handler);
                    console.log('[SidebarMenu] Modules loaded, proceeding with menu filtering');
                    resolve();
                };

                // If modules are already loaded, resolve immediately
                if (menuService.isUsingApiModules() && menuService.getModules().length > 0) {
                    clearTimeout(timeout);
                    resolve();
                    return;
                }

                window.addEventListener('modules-loaded', handler, { once: true });
            });
        },
        /**
         * Handle modules loaded event
         * Re-filters sidebar data when modules are loaded
         */
        handleModulesLoaded(event) {
            console.log('[SidebarMenu] Modules loaded event received, refreshing menu...', event.detail);
            // Re-filter sidebar data with newly loaded modules
            this.sideBarData = menuService.filterSidebarData(JSON.parse(JSON.stringify(sideBarData)));
            // Re-initialize active menus to maintain UI state
            this.initializeActiveMenus();
        },
        /**
         * Handle permission updates from authStore
         * Re-filters sidebar data based on new permissions
         */
        handlePermissionsUpdated(event) {
            console.log('[SidebarMenu] Permissions updated, refreshing menu...', event.detail);

            // Re-filter sidebar data with new permissions
            this.sideBarData = menuService.filterSidebarData(JSON.parse(JSON.stringify(sideBarData)));

            // Re-initialize active menus to maintain UI state
            this.initializeActiveMenus();
        },
        isSubMenuActive(subMenu) {
            const currentPath = this.$route.path;
            return currentPath === subMenu.route ||
                currentPath === subMenu.active_link;
        },
        hasActiveSubMenu(menu) {
            return menu.subMenus?.some(subMenu => this.isSubMenuActive(subMenu)) || false;
        },
        hasActiveSubMenuTwo(subMenus) {
            return subMenus.subMenusTwo?.some(subMenu => this.isSubMenuActive(subMenu)) || false;
        },
        toggleDashboard() {
            this.isDashboardOpen = !this.isDashboardOpen;
        },
        initializeActiveMenus() {
            const currentPath = this.$route.path;

            // Handle dashboard routes
            if (currentPath.startsWith('/dashboard/')) {
                this.isDashboardOpen = true;
            }

            // Initialize menu states based on active routes
            this.sideBarData.forEach(section => {
                section.menu.forEach(menuItem => {
                    if (menuItem.menuValue !== 'Dashboard') {
                        menuItem.showSubRoute = this.hasActiveSubMenu(menuItem);
                        if (this.hasActiveSubMenu(menuItem)) {
                            this.openMenuItem = menuItem;
                        }
                    }
                });
            });
        },
        expandSubMenus(menu) {
            this.sideBarData.forEach((item) => {
                item.menu.forEach((subMenu) => {
                    if (subMenu !== menu) {
                        subMenu.showSubRoute = false;
                    }
                });
            });
            menu.showSubRoute = !menu.showSubRoute;
        },
        OpenMenu(menu) {
            this.openMenuItem = this.openMenuItem === menu ? null : menu;
        },
        openSubmenuOne(subMenus) {
            this.openSubmenuOneItem = this.openSubmenuOneItem === subMenus ? null : subMenus;
        }
    }
};
</script>

<style scoped>
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes shimmer {
    0% {
        background-position: -468px 0;
    }
    100% {
        background-position: 468px 0;
    }
}

.menu-loading {
    padding: 15px 20px;
    list-style: none;
}

.menu-loading span {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Skeleton loading styles */
.menu-item-skeleton {
    padding: 8px 20px;
    list-style: none;
}

.menu-item-skeleton a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
}

.skeleton-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%, #f0f0f0 100%);
    background-size: 800px 100px;
    animation: shimmer 1.5s infinite linear;
}

.skeleton-text {
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%, #f0f0f0 100%);
    background-size: 800px 100px;
    animation: shimmer 1.5s infinite linear;
    display: inline-block;
}

.menu-title .skeleton-text {
    height: 16px;
}
</style>

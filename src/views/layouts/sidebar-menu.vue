<template>
    <ul>
        <template v-for="item in sideBarData" :key="item.tittle">
            <li class="menu-title">
                <span>{{ item.tittle }}</span>
            </li>
            <li>
                <ul>
                    <template v-for="menu in item.menu" :key="menu.menuValue">
                        <li v-if="!menu.hasSubRoute && menu.menuValue !== 'Dashboard'"
                            :class="{ 'active': isMenuActive(menu) }">
                            <router-link v-if="menu.route" :to="menu.route">
                                <i :class="'ti ti-' + menu.icon"></i>
                                <span>{{ menu.menuValue }}</span>
                            </router-link>
                        </li>
                        <li v-else-if="menu.menuValue === 'Dashboard'" class="submenu">
                            <a href="#" @click.prevent="toggleDashboard"
                                :class="{ subdrop: isDashboardOpen, 'active': isActive(menu) }">
                                <i :class="'ti ti-' + menu.icon"></i><span>{{ menu.menuValue }}</span>
                                <span class="menu-arrow"></span>
                            </a>
                            <ul :class="{ 'd-block': isDashboardOpen, 'd-none': !isDashboardOpen }">
                                <li v-for="(subMenu, index) in menu.subMenus" :key="index"
                                    :class="{ 'active': isSubMenuActive(subMenu) }">
                                    <router-link :to="subMenu.route">{{ subMenu.menuValue }}</router-link>
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
                                <li v-for="subMenus in menu.subMenus" :key="subMenus.menuValue">
                                    <template v-if="!subMenus.customSubmenuTwo">
                                        <router-link :to="subMenus.route"
                                            :class="{ 'active': isSubMenuActive(subMenus) }">
                                            {{ subMenus.menuValue }}
                                        </router-link>
                                    </template>
                                    <template v-else-if="subMenus.customSubmenuTwo">
                                <li class="submenu submenu-two">
                                    <a href="#" @click.prevent="openSubmenuOne(subMenus)"
                                        :class="{ subdrop: openSubmenuOneItem === subMenus, 'active': isSubActive(subMenus) }">
                                        {{ subMenus.menuValue }}<span class="menu-arrow inside-submenu"></span>
                                    </a>
                                    <ul
                                        :class="{ 'd-block': openSubmenuOneItem === subMenus, 'd-none': openSubmenuOneItem !== subMenus }">
                                        <li v-for="subMenuTwo in subMenus.subMenusTwo" :key="subMenuTwo.menuValue">
                                            <router-link :to="subMenuTwo.route">{{ subMenuTwo.menuValue }}</router-link>
                                        </li>
                                    </ul>
                                </li>
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
                <router-link :to="subMenu.route">{{ subMenu.menuValue }}</router-link>
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

export default {
    data() {
        return {
            sideBarData: sideBarData,
            openMenuItem: null,
            openSubmenuOneItem: null,
            route_array: [],
            multilevel: [false, false, false],
            isDashboardOpen: false
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
    created() {
        this.sideBarData = menuService.filterSidebarData(JSON.parse(JSON.stringify(sideBarData)));
    },
    methods: {
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

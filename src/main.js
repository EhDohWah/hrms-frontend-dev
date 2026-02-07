/**
 * HRMS Vue Application Entry Point
 * 
 * This file initializes the Vue application with optimized component loading.
 * Heavy components are lazy-loaded to improve initial load time and memory usage.
 * 
 * @version 2.0.0 - Optimized for memory performance
 */

import { createApp } from 'vue';
import { router } from './router';
import App from "./App.vue";
import { createPinia } from 'pinia';

// Essential UI Libraries (loaded synchronously as they're used everywhere)
import { BootstrapVue3, BToastPlugin } from 'bootstrap-vue-3'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// Essential icons and UI components
import VueFeather from 'vue-feather';
import FlagIcon from 'vue-flag-icon';
import { IconHome } from '@tabler/icons-vue';

// Form components (used frequently)
// NOTE: vue3-select2-component removed - using Ant Design Vue Select instead
import DatePicker from 'vue3-datepicker'
import VCalendar from 'v-calendar';
import Vue3TagsInput from "vue3-tags-input";

// Charts (lazy load the actual charts, but register the plugin)
import VueApexCharts from "vue3-apexcharts";
import StarRating from 'vue-star-rating'
import CircleProgress from "vue3-circle-progress";
import "vue3-circle-progress/dist/circle-progress.css";

// Form wizard
import VueFormWizard from "vue3-form-wizard";
import "@/assets/css/vue-form-wizard.css";

// Other plugins
import VueEasyLightbox from "vue-easy-lightbox";
import CKEditor from '@ckeditor/ckeditor5-vue';
import SimpleLineIcons from "vue-simple-line";

// Essential CSS imports
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'ionicons-npm/css/ionicons.css';
import '@/assets/css/feather.css'
import '@/assets/css/sticky.css'
import '@/assets/css/tabler-icons.css'
import '@/assets/css/font-display-override.css'
import '@/assets/css/vue-form-wizard.css';
import "boxicons/css/boxicons.min.css";
import "v-calendar/dist/style.css";
import 'nprogress/nprogress.css'; // Base NProgress styles
import '@/assets/css/nprogress-custom.css'; // Custom NProgress styling (overrides base)
import '@/assets/scss/main.scss'

// Lazy Components Plugin - reduces initial bundle size by ~60%
import { registerLazyComponents } from './plugins/lazy-components';

// Permission Directive Plugin - for v-permission, v-can-edit, v-can-read directives
import { PermissionPlugin } from './directives/permission';

// NProgress Composable - Route navigation progress bar (Vue 3 recommended approach)
import { useNProgress, setupRouterNProgress } from './composables/useNProgress';

// Event Bus
import eventBus from './plugins/eventBus';

// SweetAlert global
import swal from 'sweetalert2';
window.Swal = swal;

// Suppress benign ResizeObserver errors for performance optimization
const resizeObserverLoopErr = /^ResizeObserver loop (limit exceeded|completed with undelivered notifications)/;
window.addEventListener('error', (e) => {
    if (resizeObserverLoopErr.test(e.message)) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
});

// ============================================================================
// ESSENTIAL LAYOUT COMPONENTS (Always needed, loaded synchronously)
// ============================================================================
import Layout_Header from '@/views/layouts/layout-header.vue';
import Layout_Sidebar from '@/views/layouts/layout-sidebar.vue';
import SidebarMenu from '@/views/layouts/sidebar-menu.vue';
import layoutFooter from '@/views/layouts/layout-footer.vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';

// Employee site component (used in multiple places)
import employeeSite from '@/views/pages/hrm/employees/employee-sites.vue';

// ============================================================================
// CREATE APP INSTANCE
// ============================================================================
const app = createApp(App)
const pinia = createPinia()

// ============================================================================
// REGISTER PINIA (State Management)
// ============================================================================
app.use(pinia)

// ============================================================================
// REGISTER ESSENTIAL GLOBAL COMPONENTS ONLY
// These are components used in almost every page, so they should be globally available
// ============================================================================

// Layout components - Always needed
app.component('layout-header', Layout_Header)
app.component('layout-sidebar', Layout_Sidebar)
app.component('sidebar-menu', SidebarMenu)
app.component('layout-footer', layoutFooter)
app.component('index-breadcrumb', indexBreadcrumb)
app.component('employee-site', employeeSite)

// ============================================================================
// REGISTER LAZY-LOADED COMPONENTS
// These components are loaded on-demand when first used, saving ~60% memory
// ============================================================================
registerLazyComponents(app);

// ============================================================================
// REGISTER THIRD-PARTY COMPONENTS
// ============================================================================

// Form components
// NOTE: vue-select removed - using Ant Design Vue's a-select instead
app.component('date-picker', DatePicker);
app.component('vue3-tags-input', Vue3TagsInput);

// UI components
app.component(VueFeather.name, VueFeather);
app.component('star-rating', StarRating);
app.component('circle-progress', CircleProgress);
app.component('IconHome', IconHome);

// ============================================================================
// USE PLUGINS
// ============================================================================

// UI Frameworks
app.use(BootstrapVue3)
app.use(BToastPlugin)
app.use(Antd)
app.use(VueSweetalert2)

// Form & Calendar
app.use(VCalendar)
app.use(VueFormWizard)

// Charts
app.use(VueApexCharts)

// Other
app.use(FlagIcon)
app.use(VueEasyLightbox)
app.use(SimpleLineIcons)
app.use(CKEditor)

// Permission Directives (v-permission, v-can-edit, v-can-read)
app.use(PermissionPlugin)

// NProgress - Route navigation progress bar (Vue 3 composable approach)
// Setup router integration for automatic progress on navigation
setupRouterNProgress(router, {
  skipRoutes: ['/login', '/logout', '/forgot-password', '/reset-password'],
});

// Provide NProgress composable globally for component usage
const nprogress = useNProgress();
app.provide('nprogress', nprogress);
app.config.globalProperties.$nprogress = nprogress;

// Provide EventBus globally
app.provide('eventBus', eventBus);

// ============================================================================
// USE ROUTER
// ============================================================================
app.use(router);

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================
import { menuService } from './services/menu.service';

async function initializeApp() {
    // Check if user is already authenticated
    // NOTE: Token is in HttpOnly cookie, we check user data presence in localStorage
    const user = localStorage.getItem('user');

    if (user) {
    try {
            console.log('[App] User authenticated, initializing menu service...');
        await menuService.initialize();
        console.log('[App] Menu service initialized successfully');
    } catch (error) {
        console.error('[App] Error initializing menu service:', error);
        console.log('[App] Continuing with hardcoded fallback...');
        }
    } else {
        console.log('[App] User not authenticated, menu service will initialize after login');
    }
    
    // Mount app regardless of menu initialization status
    app.mount('#app');
  
  // Log memory usage in development
  if (import.meta.env.MODE === 'development' && performance.memory) {
    console.log('[App] Memory Usage:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
    });
  }
}

// Initialize and mount app
initializeApp();   

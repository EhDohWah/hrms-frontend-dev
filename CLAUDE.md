# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue.js 3 frontend for the HR Management System. Connects to a Laravel backend API at `/api/v1/`. Features role-based dashboards, employee management, payroll, grants, leave management, and reporting.

## Development Philosophy

**Write for maintainability, not complexity.** You are a senior frontend developer, but you're writing code for future junior developers to maintain and debug. Follow these principles:

- **Simplicity over cleverness** - Prefer straightforward solutions that junior developers can understand at a glance
- **Explicit over implicit** - Make your intentions clear through descriptive variable names, component names, and comments when necessary
- **Consistency over innovation** - Follow established patterns in the codebase rather than introducing new approaches
- **Readable over compact** - Choose clarity over brevity; a few extra lines that improve understanding are worth it
- **Future-proof architecture** - Structure code so bugs can be isolated and fixed without cascading changes

When adding features or fixing bugs:
1. Keep the existing architecture and patterns consistent
2. Add inline comments for complex business logic (especially state management and API integrations)
3. Write self-documenting code with clear component, function, and variable names
4. Avoid over-abstraction - don't create layers that hide what the code actually does
5. Keep component responsibilities focused and single-purpose
6. Think: "Can a junior developer debug this at 2 AM?"

## Common Commands

```bash
# Development server
npm run dev          # Start Vite dev server (or npm run serve)

# Production build
npm run build

# Preview production build
npm run preview
```

## Architecture

### Technology Stack
- Vue.js 3.5.12 with Composition API (`<script setup>`)
- Vite for build tooling
- Pinia for state management
- Vue Router 4 with auth/role/permission guards
- Bootstrap 5 + Ant Design Vue 4 (hybrid UI approach - prefer Ant Design for new components)

### Layer Structure

```
src/
├── config/           # API endpoints (api.config.js), role menus
├── services/         # API layer - each service extends BaseService
├── stores/           # Pinia stores for state management
├── router/           # Routes with lazy loading, guards in guards.js
├── views/pages/      # Page components organized by module
├── components/       # Reusable components (modals, reports, etc.)
├── composables/      # Vue composables for shared logic
├── plugins/          # eventBus.js, echo.js (WebSocket)
└── utils/            # performance.js (debounce, memoize, virtual scroll)
```

### Data Flow
User Action → Component → Pinia Store → Service → API Config → Backend API → Response → Store State → Reactive UI Update

### Key Patterns

**Services**: Extend `BaseService` for consistent error handling. Use `api.service.js` for HTTP calls. All endpoints defined in `config/api.config.js`.

**Stores**: 24 Pinia stores. `authStore` handles authentication and permissions. `sharedDataStore` caches dropdown/lookup data with expiry.

**Routes**: Lazy-loaded with explicit component mapping in `router/index.js`. Guards: `authGuard`, `roleGuard`, `permissionGuard`.

**Real-time**: Laravel Echo via `plugins/echo.js` for WebSocket notifications.

### Role-Based Access
5 roles: admin, hr-manager, hr-assistant-senior, hr-assistant-junior, site-admin. Each has a dedicated dashboard. Permission checks via `authStore.permissions`.

## Code Style

- Use Composition API with `<script setup>` for all new components
- Clean up event listeners in `onUnmounted` to prevent memory leaks
- Lazy load routes and heavy components
- Use Ant Design Vue 4 for new components, Bootstrap 5 for legacy
- Cache dropdown data in `sharedDataStore` instead of fetching repeatedly

## Environment Configuration

Copy `.env.example` to `.env.development` and set:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Known Issues & Fixes

### Ant Design Vue Select Dropdown Text Visibility & Alignment

**Issue**: Selected text in `<a-select>` dropdowns appears blurry, partially hidden, cut off at the bottom, or positioned too low within the input.

**Root Cause**: Default Ant Design Vue styles can conflict with Bootstrap or custom styles, affecting text rendering, opacity, and vertical alignment on the selected value display.

**Fix Location**: `src/assets/scss/pages/_ant-select.scss`

**Solution Applied**:
```scss
// Fix selector container flex alignment
.ant-select:not(.ant-select-customize-input) .ant-select-selector {
  display: flex !important;
  align-items: center !important;
  min-height: 38px !important;
}

// Ensure selected text is fully visible and vertically centered
.ant-select-selection-item {
  display: flex !important;
  align-items: center !important;
  color: $gray-900 !important;
  opacity: 1 !important;
  line-height: 1.5 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

// Fix for single select mode
.ant-select-single .ant-select-selector .ant-select-selection-item {
  line-height: 36px !important;
  padding-right: 18px;
}

.ant-select-selection-placeholder {
  color: $gray-500 !important;
  opacity: 1 !important;
}
```

### Ant Design Vue Teleported Components Styling

**Issue**: Scoped styles don't work on `<a-modal>`, `<a-select>` dropdowns, `<a-date-picker>` popups, etc.

**Root Cause**: These components are teleported to `<body>` and are outside the component's DOM tree, so Vue's scoped styles cannot reach them.

**Solution**: Use global styles in `src/assets/scss/main.scss`. See `docs/styling-guides/ANT_DESIGN_TELEPORTED_COMPONENTS.md` for detailed documentation.

### Ant Design Vue Empty Component

**Issue**: `<a-empty :image="null" />` throws error "Cannot use 'in' operator to search for 'type' in null".

**Solution**: Don't pass `null` to the `image` prop. Use `:image-style="{ height: '60px' }"` to customize size, or omit the prop entirely for default behavior.

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

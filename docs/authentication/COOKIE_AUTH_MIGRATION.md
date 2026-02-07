# Cookie-Based Authentication Migration

## Overview

Migrated the frontend authentication from **localStorage Bearer token** to **HttpOnly cookie (`auth_token`)** for XSS protection. The actual token is no longer accessible to JavaScript. The browser automatically sends the cookie on every request via `credentials: 'include'`.

---

## Architecture

### Before (Bearer Token)
```
Login → Response body contains token → Store in localStorage → Attach as Authorization: Bearer header on every request
```

### After (HttpOnly Cookie)
```
Login → Backend sets HttpOnly cookie (auth_token) → Browser sends cookie automatically → Backend middleware extracts cookie → Sets Authorization header internally
```

### What JavaScript Still Stores (localStorage)
| Key | Purpose |
|-----|---------|
| `user` | User object (name, email, id, profile_picture) for UI display |
| `userRole` | Role string for route guards and UI logic |
| `permissions` | Permission array for route guards and UI conditionals |
| `tokenExpiration` | Expiry timestamp (ms) for session validity checks |

The actual authentication token is **never** stored in localStorage or accessible via JavaScript.

---

## Files Modified

### Frontend

| File | Changes |
|------|---------|
| `src/services/auth.service.js` | Removed `Authorization: Bearer` header from all requests. Added `credentials: 'include'` to all fetch calls. Login no longer returns/stores token in localStorage. |
| `src/services/api.service.js` | Removed Bearer token injection. Added `credentials: 'include'`. Added fresh-login guard in 401 handler to prevent race conditions during login setup. |
| `src/services/module.service.js` | Removed Bearer token header, uses cookie auth via `credentials: 'include'`. |
| `src/services/menu.service.js` | Removed Bearer token header, uses cookie auth via `credentials: 'include'`. |
| `src/services/user.service.js` | Removed Bearer token header, uses cookie auth via `credentials: 'include'`. |
| `src/services/resignation.service.js` | Removed Bearer token header, uses cookie auth via `credentials: 'include'`. |
| `src/stores/authStore.js` | Removed `token` from state and localStorage. `setAuthData` no longer stores token. `fetchMyPermissions()` made non-blocking in login flow. `clearAuthData` no longer removes token key. |
| `src/router/guards.js` | Removed token-based auth check. Auth state determined by `user` + `tokenExpiration` in localStorage. Echo initialized once per session via `isEchoInitialized()` guard. |
| `src/plugins/echo.js` | Replaced Bearer token auth with custom `authorizer` using `fetch()` + `credentials: 'include'`. Made `initEcho()` idempotent. See [Broadcasting Auth Fix](#broadcasting-auth-fix) section. |
| `src/views/pages/authentication/login-index.vue` | Removed Echo initialization (handled by router guard). Removed `initEcho` import. |
| `src/views/layouts/layout-header.vue` | Switched from direct `getEcho().private()` to managed `subscribeToNotifications()`. Replaced destructive `window.Echo.leave()` with `unsubscribeFromNotifications()`. |
| `src/views/layouts/sidebar-menu.vue` | No token references, works with cookie auth. |
| `src/main.js` | No token initialization on app startup. |
| `src/config/api.config.js` | Changed fallback URL from `127.0.0.1` to `localhost`. |
| `.env` | Changed all `127.0.0.1` to `localhost` (SameSite cookie requirement). |
| `.env.development` | Changed all `127.0.0.1` to `localhost`. |
| `.env.example` | Changed all `127.0.0.1` to `localhost`, added security documentation. |
| `src/utils/sanitize.js` | New utility for sanitizing notification HTML content (XSS protection). |

### Backend

| File | Changes |
|------|---------|
| `bootstrap/app.php` | Added `encryptCookies(except: ['auth_token'])` to prevent EncryptCookies from nullifying the plain-text cookie on web routes. Added `AuthenticateFromCookie` middleware to web group (needed for `/broadcasting/auth`). |

---

## Critical: localhost vs 127.0.0.1

`localhost` and `127.0.0.1` are **different sites** for browser SameSite cookie policy.

- Frontend page: `http://localhost:8080` (Vite dev server)
- API calls to: `http://127.0.0.1:8000` = **cross-site**
- `SameSite=Lax` cookies are **NOT sent** on cross-site fetch/XHR requests

**All environment files MUST use `localhost`** (not `127.0.0.1`) so the page hostname matches the API hostname.

```env
# Correct - matches the Vite dev server hostname
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_PUBLIC_URL=http://localhost:8000
VITE_REVERB_HOST=localhost
VITE_BROADCASTING_AUTH_ENDPOINT=http://localhost:8000/broadcasting/auth
```

---

## Broadcasting Auth Fix

### Problem
After login, `broadcasting/auth` was called on **every route navigation**, causing redundant server requests.

### Root Causes

1. **`login-index.vue`** called `window.Echo.disconnect()` then `initEcho()` after login. This created an Echo instance but the router guard then saw it as "already initialized" and skipped setting up channel listeners (permission, profile).

2. **`echo.js` `initEcho()`** always destroyed and recreated the Echo instance, so any second call triggered new channel authorization.

3. **`layout-header.vue`** bypassed echo.js's subscription tracking by using direct `getEcho().private().notification()`, and called `window.Echo.leave()` in `beforeUnmount()` which killed ALL channel subscriptions on that user channel (permission + profile + notifications), not just its own.

### Solution

#### 1. Idempotent `initEcho()` (echo.js)

```javascript
// Before: ALWAYS destroyed and recreated
export function initEcho(token = null) {
    if (echoInstance) {
        echoInstance.disconnect();  // Always destroys
        echoInstance = null;
    }
    // ... create new instance
}

// After: Returns existing instance unless forced
export function initEcho({ force = false } = {}) {
    if (echoInstance && window.__ECHO_INITIALIZED && !force) {
        return echoInstance;  // Already initialized, skip
    }
    // ... cleanup and create only when needed
}
```

#### 2. Single initialization point (login-index.vue)

Removed Echo initialization from `login-index.vue`. The router guard (`guards.js`) is the **sole** initialization point:

```javascript
// guards.js - runs once per session
if (isAuthenticated && user && !isEchoInitialized()) {
    initEcho();
    initPermissionUpdateListener(userData.id);  // Subscribe to permission channel
    initProfileUpdateListener(userData.id);     // Subscribe to profile channel
    // Notification subscription handled by layout-header.vue
}
```

#### 3. Managed channel subscriptions (layout-header.vue)

```javascript
// Before: Direct channel access, destructive cleanup
created() {
    getEcho().private(`App.Models.User.${userId}`)
        .notification((notif) => { ... });
}
beforeUnmount() {
    window.Echo.leave(`private-App.Models.User.${userId}`);  // Kills ALL listeners
}

// After: Managed subscription, safe cleanup
created() {
    subscribeToNotifications(userId, (notif) => { ... });
}
beforeUnmount() {
    unsubscribeFromNotifications(userId);  // Only removes notification listener
}
```

### Flow After Fix

```
1. Login success → login-index.vue navigates to dashboard (no Echo work)
2. Router guard fires → isEchoInitialized() = false
   → initEcho() creates single instance
   → initPermissionUpdateListener() subscribes to user channel (1 broadcasting/auth call)
   → initProfileUpdateListener() reuses same channel (no extra auth)
3. layout-header mounts → subscribeToNotifications() reuses same channel (no extra auth)
4. Subsequent navigations → isEchoInitialized() = true → guard skips → zero auth calls
```

---

## Pusher.js Cookie Auth Workaround

Pusher.js's default XHR-based channel authorization does **not** support `withCredentials`. The `auth.options.withCredentials` config is silently ignored — cookies are never sent with the default authorizer.

### Solution: Custom Authorizer

```javascript
// echo.js - Custom authorizer using Fetch API
const reverbConfig = {
    broadcaster: 'reverb',
    // ... other config
    authorizer: (channel) => ({
        authorize: (socketId, callback) => {
            fetch(broadcastAuthEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    socket_id: socketId,
                    channel_name: channel.name,
                }),
                credentials: 'include',  // Sends the HttpOnly cookie
            })
            .then(response => {
                if (!response.ok) throw new Error(`Broadcasting auth failed: ${response.status}`);
                return response.json();
            })
            .then(data => callback(null, data))
            .catch(error => callback(true, error));
        },
    }),
};
```

---

## Backend Middleware Stack for Cookie Auth

The `auth_token` cookie traverses two different middleware groups depending on the route:

### API Routes (`/api/*`)
```
Request → AuthenticateFromCookie (extracts cookie → sets Bearer header) → Controller
```

### Web Routes (`/broadcasting/auth`)
```
Request → EncryptCookies (MUST exclude auth_token) → AuthenticateFromCookie → BroadcastController
```

Without the `encryptCookies(except: ['auth_token'])` exclusion, EncryptCookies attempts to decrypt the plain-text cookie and nullifies it before AuthenticateFromCookie can read it.

```php
// bootstrap/app.php
$middleware->encryptCookies(except: ['auth_token']);

$middleware->api(prepend: [
    \App\Http\Middleware\AuthenticateFromCookie::class,
]);
$middleware->web(prepend: [
    \App\Http\Middleware\AuthenticateFromCookie::class,
]);
```

---

## 401 Handler Race Condition Fix

### Problem
During login, `authStore.setAuthData()` stores user data in localStorage, then calls `fetchMyPermissions()`. If permissions fetch returns 401 (e.g., due to timing), the 401 handler in `api.service.js` would clear ALL localStorage — destroying the just-saved login data.

### Solution: Fresh-Login Guard

```javascript
// api.service.js - 401 handler
const tokenExpiration = localStorage.getItem('tokenExpiration');
const timeUntilExpiry = tokenExpiration ? Number(tokenExpiration) - Date.now() : 0;
const FRESH_LOGIN_THRESHOLD = 5 * 60 * 1000; // 5 minutes

if (!tokenExpiration || timeUntilExpiry < FRESH_LOGIN_THRESHOLD) {
    // Session is stale or expired — safe to clear
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('user');
    // ...
} else {
    // Session was just established — don't clear auth data
    console.warn('[ApiService] 401 during fresh session, not clearing auth data');
}
```

### Non-Blocking Permission Fetch

```javascript
// authStore.js - setAuthData()
// Initialize menu service first (uses localStorage data already saved above)
await this.initializeMenuService();

// Fetch enhanced permissions in background — does NOT block login flow
this.fetchMyPermissions().catch(err => {
    console.warn('[AuthStore] Enhanced permissions fetch failed, using login response permissions');
});
```

---

## Echo Channel Subscription Management

All three real-time listeners share the **same private channel** (`private-App.Models.User.{id}`):

| Listener | Initialized By | Event |
|----------|---------------|-------|
| Permission updates | `guards.js` via `initPermissionUpdateListener()` | `.user.permissions-updated` |
| Profile updates | `guards.js` via `initProfileUpdateListener()` | `.user.profile-updated` |
| Notifications | `layout-header.vue` via `subscribeToNotifications()` | `BroadcastNotificationCreated` |

### Rules
- **Never call `window.Echo.leave()` directly** — it removes ALL listeners on that channel.
- Use echo.js's `unsubscribeFrom*()` functions which only remove the specific listener and track reference counts.
- The channel is only fully left when ALL subscriptions are removed (tracked by `activeUserChannels` Map in echo.js).
- On logout, `cleanupUserSubscriptions(userId)` force-leaves the channel and resets all tracking.

---

## Testing Checklist

- [ ] Login succeeds, cookie is set, user data appears in localStorage
- [ ] After login, only **one** `broadcasting/auth` POST request in Network tab
- [ ] Navigating between pages does **not** trigger additional `broadcasting/auth` calls
- [ ] Real-time permission updates work (change permissions in admin → reflected in user's UI)
- [ ] Real-time notifications appear as toast messages
- [ ] Logout clears localStorage and disconnects Echo
- [ ] Re-login after logout works correctly (fresh Echo instance created)
- [ ] Page refresh while authenticated reconnects Echo without errors
- [ ] Opening page on `localhost:8080` (not `127.0.0.1:8080`) — cookie is sent with all requests

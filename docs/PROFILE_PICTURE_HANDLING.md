# Profile Picture Handling - Frontend Guide

> **Document Version:** 1.0
> **Last Updated:** January 2026
> **Category:** Frontend / User Management

## Overview

This document describes how profile pictures are handled in the HRMS frontend application, including upload, display, state management, real-time updates, and fallback mechanisms.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Configuration](#configuration)
3. [Components & Files](#components--files)
4. [Image URL Construction](#image-url-construction)
5. [State Management](#state-management)
6. [Real-time Updates](#real-time-updates)
7. [Fallback Avatar System](#fallback-avatar-system)
8. [Cache Busting](#cache-busting)
9. [Common Issues & Solutions](#common-issues--solutions)
10. [Best Practices](#best-practices)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │  layout-header  │    │  profile-index  │    │ Other Views  │ │
│  │  (Avatar Display)│    │  (Upload Form)  │    │              │ │
│  └────────┬────────┘    └────────┬────────┘    └──────────────┘ │
│           │                      │                               │
│           ▼                      ▼                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     Pinia Auth Store                         │ │
│  │  • user.profile_picture (relative path)                      │ │
│  │  • user.profile_picture_updated_at (cache bust timestamp)    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│           │                      │                               │
│           ▼                      ▼                               │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │   User Service  │    │   Echo Plugin   │                     │
│  │   (API Calls)   │    │  (WebSocket)    │                     │
│  └────────┬────────┘    └────────┬────────┘                     │
└───────────┼──────────────────────┼──────────────────────────────┘
            │                      │
            ▼                      ▼
    ┌───────────────┐      ┌───────────────┐
    │  Laravel API  │      │ Laravel Reverb │
    │  /user/...    │      │  (WebSocket)   │
    └───────────────┘      └───────────────┘
```

---

## Configuration

### Environment Variables (`.env.development`)

```env
# Backend API URL
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

# Public URL for serving static files (images, storage)
VITE_PUBLIC_URL=http://127.0.0.1:8000

# WebSocket configuration
VITE_REVERB_APP_KEY=your-app-key
VITE_REVERB_HOST=127.0.0.1
VITE_REVERB_PORT=8081
VITE_REVERB_SCHEME=http
```

### Key Configuration Notes

- `VITE_PUBLIC_URL` is used to construct image URLs
- Must match the backend's `APP_URL` for storage URLs to work
- In production, this should point to your CDN or backend domain

---

## Components & Files

### Key Files

| File | Purpose |
|------|---------|
| `src/views/layouts/layout-header.vue` | Displays profile picture in header dropdown |
| `src/views/pages/pages/profile-index.vue` | Profile picture upload form |
| `src/stores/authStore.js` | User state management, real-time sync |
| `src/services/user.service.js` | API calls for profile updates |
| `src/plugins/echo.js` | WebSocket subscriptions for real-time updates |

---

## Image URL Construction

### How URLs Are Built

The backend stores only the **relative path**:
```
profile_pictures/A8bmeMNRSSyjnmhZVQkjsOjBZxUUW2Ron2G9uBCb.jpg
```

The frontend constructs the full URL:
```javascript
const fullUrl = `${import.meta.env.VITE_PUBLIC_URL}/storage/${user.profile_picture}`;
// Result: http://127.0.0.1:8000/storage/profile_pictures/A8bmeMNRSSyjnmhZVQkjsOjBZxUUW2Ron2G9uBCb.jpg
```

### Implementation in layout-header.vue

```javascript
// In setup()
const profilePictureUrl = computed(() => {
  if (authStore.user && authStore.user.profile_picture) {
    // Add cache-busting timestamp to force reload after update
    const timestamp = authStore.user.profile_picture_updated_at || '';
    const baseUrl = `${import.meta.env.VITE_PUBLIC_URL}/storage/${authStore.user.profile_picture}`;
    return timestamp ? `${baseUrl}?t=${timestamp}` : baseUrl;
  }
  return null; // Fallback handled in template
});
```

### Implementation in profile-index.vue

```javascript
// In handleProfileUpdate method
case 'profile_picture':
  if (data?.profile_picture) {
    this.profileImage = `${import.meta.env.VITE_PUBLIC_URL}/storage/${data.profile_picture}`;
  }
  break;
```

---

## State Management

### Auth Store User Object

```javascript
// authStore.js state
state: () => ({
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profile_picture: "profile_pictures/abc123.jpg",  // Relative path
    profile_picture_updated_at: 1705789200000,       // Timestamp for cache busting
    // ... other fields
  },
  // ... other state
})
```

### Updating Profile Picture in Store

When a profile picture is updated (via API or WebSocket), the store is updated:

```javascript
// In authStore.js - handleProfileUpdateEvent()
case 'profile_picture':
  if (data.data.profile_picture) {
    this.user = {
      ...this.user,
      profile_picture: data.data.profile_picture,
      profile_picture_updated_at: Date.now() // Cache busting timestamp
    };
    this.setStorageItem(STORAGE_KEYS.USER, this.user);
  }
  break;
```

### User Service localStorage Sync

```javascript
// In user.service.js - updateProfilePicture()
if (response && response.success && response.data?.profile_picture) {
  const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
  const updatedUser = {
    ...currentUser,
    profile_picture: response.data.profile_picture,
    profile_picture_updated_at: Date.now()  // Cache busting
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
}
```

---

## Real-time Updates

### WebSocket Event Flow

1. User uploads profile picture
2. Backend saves file and broadcasts `UserProfileUpdated` event
3. Frontend receives event via Echo WebSocket
4. `authStore.handleProfileUpdateEvent()` updates state
5. Vue reactivity updates all components displaying the image

### Echo Plugin Setup (`echo.js`)

```javascript
// Subscribe to profile updates
export function subscribeToProfileUpdates(userId, callback) {
  const channelName = `App.Models.User.${userId}`;

  return echoInstance
    .private(channelName)
    .listen('.user.profile-updated', (event) => {
      if (typeof callback === 'function') {
        callback(event);
      }
    });
}

// Initialize listener
export function initProfileUpdateListener(userId) {
  return import('@/stores/authStore').then(({ useAuthStore }) => {
    const authStore = useAuthStore();

    return subscribeToProfileUpdates(userId, (event) => {
      if (authStore.handleProfileUpdateEvent) {
        authStore.handleProfileUpdateEvent(event);
      }
    });
  });
}
```

### Cross-Tab Synchronization

Profile updates are synchronized across browser tabs using the BroadcastChannel API:

```javascript
// In authStore.js - initCrossTabSync()
this.crossTabChannel = new BroadcastChannel('hrms-permission-sync');

this.crossTabChannel.onmessage = (event) => {
  if (event.data.type === 'PROFILE_UPDATE') {
    const { updateType, data } = event.data;

    if (updateType === 'profile_picture' && data.profile_picture) {
      this.user = {
        ...this.user,
        profile_picture: data.profile_picture,
        profile_picture_updated_at: Date.now()
      };
      this.setStorageItem(STORAGE_KEYS.USER, this.user);
      this.emitProfileUpdated(updateType, data);
    }
  }
};
```

---

## Fallback Avatar System

### When Fallbacks Are Used

1. User has no profile picture (`profile_picture` is null)
2. Image fails to load (404, network error, etc.)
3. Image URL is invalid

### SVG Initials Avatar

```javascript
// In layout-header.vue setup()
const defaultAvatarUrl = computed(() => {
  const name = authStore.user?.name || 'User';
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect fill="#6366f1" width="40" height="40" rx="20"/>
      <text x="50%" y="50%" dy=".35em" fill="white" font-family="Arial" font-size="16" text-anchor="middle">
        ${initials}
      </text>
    </svg>`
  )}`;
});
```

### Error Handler

```javascript
// In layout-header.vue methods
handleImageError(event) {
  const name = this.authStore.user?.name || 'User';
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  event.target.src = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <rect fill="#6366f1" width="40" height="40" rx="20"/>
      <text x="50%" y="50%" dy=".35em" fill="white" font-family="Arial" font-size="16" text-anchor="middle">
        ${initials}
      </text>
    </svg>`
  )}`;
}
```

### Template Usage

```html
<img
  :src="profilePictureUrl || defaultAvatarUrl"
  alt="Profile"
  class="img-fluid rounded-circle"
  @error="handleImageError"
/>
```

---

## Cache Busting

### Why Cache Busting Is Needed

Browsers cache images aggressively. When a user uploads a new profile picture with the same filename pattern, the browser may show the old cached image.

### Implementation

1. **Timestamp stored in user object:**
   ```javascript
   user.profile_picture_updated_at = Date.now();
   ```

2. **Appended to URL as query parameter:**
   ```javascript
   const url = `${baseUrl}?t=${timestamp}`;
   // Result: http://example.com/storage/profile_pictures/abc.jpg?t=1705789200000
   ```

3. **Forces browser to fetch fresh image:**
   - Different URL = different resource in browser cache
   - Timestamp changes with each upload

---

## Common Issues & Solutions

### Issue 1: Profile Picture Shows Placeholder/Initials

**Possible Causes:**
1. Storage symlink not created on backend
2. Incorrect `VITE_PUBLIC_URL` configuration
3. Image file was deleted from storage

**Debugging Steps:**
```javascript
// Check in browser console
console.log('Profile picture path:', authStore.user?.profile_picture);
console.log('Full URL:', profilePictureUrl.value);

// Try accessing URL directly in browser
// http://127.0.0.1:8000/storage/profile_pictures/xxx.jpg
```

**Solutions:**
- Backend: Run `php artisan storage:link`
- Frontend: Verify `VITE_PUBLIC_URL` in `.env.development`

---

### Issue 2: Profile Picture Not Updating After Upload

**Possible Causes:**
1. authStore not updated after upload
2. Vue reactivity not triggering
3. Browser caching old image

**Solutions:**

1. **Ensure store is updated:**
   ```javascript
   // After upload in profile-index.vue
   await authStore.updateUserData();
   ```

2. **Force reactivity:**
   ```javascript
   // Create new object reference
   this.user = { ...this.user, profile_picture: newPath };
   ```

3. **Cache busting:**
   ```javascript
   this.user.profile_picture_updated_at = Date.now();
   ```

---

### Issue 3: Profile Picture Not Syncing Across Tabs

**Cause:** Cross-tab sync not initialized or WebSocket disconnected.

**Solution:** Verify cross-tab sync is initialized:
```javascript
// In authStore.js - checkAuth() or setAuthData()
this.initCrossTabSync();
```

---

### Issue 4: Fallback Avatar Not Showing

**Cause:** `@error` handler not attached or `defaultAvatarUrl` not computed.

**Solution:**
```html
<!-- Ensure both fallback and error handler are present -->
<img
  :src="profilePictureUrl || defaultAvatarUrl"
  @error="handleImageError"
/>
```

---

## Best Practices

### 1. Always Use Computed Properties for URLs

```javascript
// Good - reactive to store changes
const profilePictureUrl = computed(() => {
  return authStore.user?.profile_picture
    ? `${VITE_PUBLIC_URL}/storage/${authStore.user.profile_picture}`
    : null;
});

// Bad - won't update when store changes
const profilePictureUrl = authStore.user?.profile_picture
  ? `${VITE_PUBLIC_URL}/storage/${authStore.user.profile_picture}`
  : null;
```

### 2. Always Provide Fallback Images

```html
<img :src="profilePictureUrl || defaultAvatarUrl" @error="handleImageError" />
```

### 3. Use Cache Busting for Dynamic Images

```javascript
const url = `${baseUrl}?t=${user.profile_picture_updated_at || Date.now()}`;
```

### 4. Update Both Store and localStorage

```javascript
// Update store (triggers Vue reactivity)
this.user = { ...this.user, profile_picture: newPath };

// Update localStorage (persists across page refreshes)
this.setStorageItem(STORAGE_KEYS.USER, this.user);
```

### 5. Handle Upload Errors Gracefully

```javascript
try {
  const response = await userService.updateProfilePicture(file);
  if (response.success) {
    message.success('Profile picture updated');
  }
} catch (error) {
  message.error('Failed to upload profile picture');
  console.error(error);
}
```

---

## Related Documentation

- [Backend Profile Picture Storage](../../hrms-backend-api-v1/docs/backend/PROFILE_PICTURE_STORAGE.md)
- [Auth Store Documentation](./authentication/AUTH_STORE.md)
- [Real-time Updates Guide](./notifications/REALTIME_UPDATES.md)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | HRMS Team | Initial documentation |

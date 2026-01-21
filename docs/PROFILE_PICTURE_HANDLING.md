# Profile Picture Handling - Frontend Guide

> **Document Version:** 1.1
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
9. [Enhanced Upload UI/UX](#enhanced-upload-uiux)
10. [Common Issues & Solutions](#common-issues--solutions)
11. [Best Practices](#best-practices)

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

## Enhanced Upload UI/UX

### Overview

The profile picture upload interface in `profile-index.vue` has been enhanced with modern UX patterns including file validation, progress tracking, success/error states, and interactive edit controls.

### Features

#### 1. File Preview & Information

When a user selects a file, they see:
- **File name** with truncation for long names
- **File size** in human-readable format (KB, MB)
- **Preview image** of the selected file
- **Clear button** to cancel selection

```vue
<!-- File Info Display -->
<div v-if="selectedFile" class="mb-3 p-3 bg-white rounded border">
  <div class="d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center">
      <i class="ti ti-file-type-jpg text-primary fs-24 me-2"></i>
      <div>
        <p class="mb-0 fw-medium text-truncate" style="max-width: 200px;">{{ selectedFile.name }}</p>
        <small class="text-muted">{{ formatFileSize(selectedFile.size) }}</small>
      </div>
    </div>
    <button type="button" class="btn btn-sm btn-outline-danger" @click="clearSelectedFile">
      <i class="ti ti-x"></i>
    </button>
  </div>
</div>
```

#### 2. File Validation

Files are validated before upload:
- **Allowed types:** JPG, PNG, GIF, WebP
- **Maximum size:** 2MB
- **Immediate feedback** if validation fails

```javascript
validateFile(file) {
  // Check file type
  if (!this.allowedFileTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: JPG, PNG, GIF, WebP`
    };
  }
  // Check file size
  if (file.size > this.maxFileSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${this.formatFileSize(this.maxFileSize)}`
    };
  }
  return { valid: true };
}
```

#### 3. Upload Progress Indicator

Visual feedback during upload:
- **Animated progress bar** with striped animation
- **Percentage display** showing upload progress
- **Disabled buttons** during upload to prevent duplicate submissions

```vue
<div v-if="isUploading" class="mt-2">
  <div class="progress" style="height: 6px;">
    <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary"
         role="progressbar"
         :style="{ width: uploadProgress + '%' }">
    </div>
  </div>
  <small class="text-muted">Uploading... {{ uploadProgress }}%</small>
</div>
```

#### 4. Success & Error States

Clear visual feedback after upload:

**Success State:**
```vue
<div v-if="uploadSuccess" class="alert alert-success py-2 mb-3 d-flex align-items-center">
  <i class="ti ti-circle-check me-2"></i>
  <span>Profile picture updated successfully!</span>
</div>
```

**Error State:**
```vue
<div v-if="uploadError" class="alert alert-danger py-2 mb-3 d-flex align-items-center">
  <i class="ti ti-alert-circle me-2"></i>
  <span>{{ uploadErrorMessage }}</span>
</div>
```

**Border Color Feedback:**
- Avatar border turns **green** on success
- Avatar border turns **red** on error

```vue
<div class="avatar avatar-xxl rounded-circle border border-primary"
     :class="{ 'border-success': uploadSuccess, 'border-danger': uploadError }">
```

#### 5. Edit Overlay

Hover interaction for changing existing profile picture:
- **Edit icon overlay** appears on hover
- **Click to trigger** file input
- **Smooth opacity transition**

```vue
<!-- Edit overlay on hover -->
<div v-if="profileImage && !selectedFile"
     class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle edit-overlay"
     @click="triggerFileInput">
  <i class="ti ti-pencil text-white fs-20"></i>
</div>
```

CSS:
```css
.edit-overlay {
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
}

.position-relative:hover .edit-overlay {
  opacity: 1;
}
```

#### 6. File Size Formatting

Human-readable file size display:

```javascript
formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
```

Examples:
- `1024 bytes` → `1.00 KB`
- `2097152 bytes` → `2.00 MB`

### Data Properties

```javascript
data() {
  return {
    // Existing properties...
    profileImage: null,
    selectedFile: null,
    isLoading: false,

    // Enhanced upload state
    isUploading: false,           // Tracks upload in progress
    uploadProgress: 0,            // Progress percentage (0-100)
    uploadSuccess: false,         // Success state flag
    uploadError: false,           // Error state flag
    uploadErrorMessage: '',       // Error message text

    // Validation constants
    maxFileSize: 2 * 1024 * 1024,  // 2MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  };
}
```

### Methods

#### handleImageUpload(event)

Handles file selection with validation:

```javascript
handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Reset states
  this.uploadError = false;
  this.uploadErrorMessage = '';
  this.uploadSuccess = false;

  // Validate file
  const validation = this.validateFile(file);
  if (!validation.valid) {
    this.uploadError = true;
    this.uploadErrorMessage = validation.error;
    message.warning(validation.error);
    event.target.value = '';
    return;
  }

  this.selectedFile = file;
  this.profileImage = URL.createObjectURL(file);
}
```

#### saveProfilePicture()

Uploads the file with progress tracking:

```javascript
async saveProfilePicture() {
  if (!this.selectedFile) {
    message.warning('Please select an image first');
    return;
  }

  // Reset states
  this.uploadError = false;
  this.uploadErrorMessage = '';
  this.uploadSuccess = false;
  this.isUploading = true;
  this.uploadProgress = 0;

  try {
    // Simulate progress (since we can't track actual XHR progress easily)
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += 10;
      }
    }, 100);

    const response = await userService.updateProfilePicture(this.selectedFile);

    // Complete progress
    clearInterval(progressInterval);
    this.uploadProgress = 100;

    if (response && response.success) {
      // Refresh global state
      const authStore = useAuthStore();
      await authStore.updateUserData();

      // Show success state
      this.uploadSuccess = true;
      message.success('Profile picture updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.uploadSuccess = false;
      }, 3000);
    } else {
      throw new Error(response.message || 'Failed to update profile picture');
    }
  } catch (error) {
    this.uploadError = true;
    this.uploadErrorMessage = error.message || 'Failed to update profile picture';
    message.error(this.uploadErrorMessage);
  } finally {
    this.isUploading = false;
    this.uploadProgress = 0;
    this.selectedFile = null;
    if (this.$refs.fileInput) {
      this.$refs.fileInput.value = '';
    }
  }
}
```

#### clearSelectedFile()

Resets file selection and restores original image:

```javascript
clearSelectedFile() {
  this.selectedFile = null;
  this.uploadError = false;
  this.uploadErrorMessage = '';
  this.uploadSuccess = false;

  if (this.$refs.fileInput) {
    this.$refs.fileInput.value = '';
  }

  // Restore original profile image from store
  const authStore = useAuthStore();
  if (authStore.user?.profile_picture) {
    this.profileImage = `${import.meta.env.VITE_PUBLIC_URL}/storage/${authStore.user.profile_picture}`;
  } else {
    this.profileImage = null;
  }
}
```

#### triggerFileInput()

Programmatically triggers file input when edit overlay is clicked:

```javascript
triggerFileInput() {
  this.$refs.fileInput.click();
}
```

### User Flow

1. **Initial State:** User sees their current profile picture or placeholder
2. **Hover:** Edit overlay appears with pencil icon
3. **Click overlay or "Select Image":** File picker opens
4. **Select file:**
   - Validation runs immediately
   - If invalid: Error message shown, selection rejected
   - If valid: Preview shown with file info
5. **Click "Save Picture":**
   - Progress bar appears
   - Upload executes
   - Success/error feedback shown
6. **Auto-update:** Profile picture updates in header and profile page via reactive state

### Validation Rules

| Rule | Value | Error Message |
|------|-------|---------------|
| File Type | JPG, PNG, GIF, WebP | "Invalid file type. Allowed: JPG, PNG, GIF, WebP" |
| File Size | Max 2MB | "File too large. Maximum size is 2.00 MB" |

### Browser Compatibility

- **File API:** All modern browsers
- **Object URLs:** IE 10+, All modern browsers
- **Progress animation:** CSS3 animations (all modern browsers)
- **Fallback:** SVG initials avatar for IE/Edge

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
| 1.1 | Jan 2026 | HRMS Team | Added enhanced upload UI/UX documentation with file validation, progress tracking, success/error states, and edit overlay features |

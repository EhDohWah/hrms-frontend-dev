# Notification Dropdown Redesign

> **Document Version:** 2.0.0
> **Last Updated:** January 2026
> **Category:** Frontend / UI/UX

## Overview

This document describes the redesigned notification dropdown component, which provides a clean, professional, Facebook-inspired notification system with user context, avatars, and improved mobile accessibility.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Key Changes](#key-changes)
3. [Component Structure](#component-structure)
4. [Backend Integration](#backend-integration)
5. [Styling](#styling)
6. [Responsive Design](#responsive-design)
7. [Accessibility](#accessibility)

---

## Design Philosophy

The redesign follows these core principles:

1. **User-Centric** - Show who performed each action with their avatar
2. **Clean & Professional** - Neutral color palette, no colorful badges or emojis
3. **Native Behavior** - Use Bootstrap's dropdown without custom JavaScript
4. **Mobile-First** - Accessible on all devices without overflow issues
5. **Performance** - No memory leaks, minimal JavaScript

---

## Key Changes

### Removed (82 lines of JavaScript)

- `initNotificationDropdown()` method - 82 lines of custom animation code
- `handleClick()` and `handleOutsideClick()` methods
- Custom event listener management that fought Bootstrap's behavior
- `notificationClass` data property

### Added

| Feature | Description |
|---------|-------------|
| User Avatars | Shows who performed each action |
| All/Unread Tabs | Filter notifications by read status |
| Mobile Menu Link | Notifications accessible on mobile devices |
| Formatted Text | "**User Name** action **Object Name**" format |
| Category Badges | Small icon overlay on avatar |
| Unread Dot | Blue dot indicator instead of "New" badge |

### Changed

| Before | After |
|--------|-------|
| 450px min-width (mobile overflow) | Responsive: 420px → 340px → 100vw-20px |
| Colorful emoji icons | Professional Tabler icons |
| "New" badge for unread | Subtle blue background + dot |
| Custom JS animations | CSS-only transitions (0.15s) |
| Desktop only | Mobile menu integration |

---

## Component Structure

### Template

```vue
<!-- Notification Dropdown -->
<div class="notification_item">
  <!-- Bell Button -->
  <a class="btn btn-menubar notif-bell-btn" data-bs-toggle="dropdown">
    <i class="ti ti-bell"></i>
    <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount }}</span>
  </a>

  <!-- Dropdown -->
  <div class="dropdown-menu notification-dropdown">
    <!-- Header with tabs -->
    <div class="notif-header">...</div>

    <!-- Notification list -->
    <div class="notif-content">
      <ul class="notif-list">
        <li v-for="notification in filteredNotifications">
          <router-link class="notif-item" :class="{ unread: !notification.read_at }">
            <div class="notif-avatar">
              <img :src="getUserAvatar(notification)" />
              <span class="category-badge" :class="getNotificationCategory(notification)">
                <i :class="getCategoryIcon(notification)"></i>
              </span>
            </div>
            <div class="notif-body">
              <p class="notif-text" v-html="formatNotificationText(notification)"></p>
              <span class="notif-time">{{ formatNotificationDate(notification) }}</span>
            </div>
            <span v-if="!notification.read_at" class="notif-unread-dot"></span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <div class="notif-footer">...</div>
  </div>
</div>
```

### Data Properties

```javascript
data() {
  return {
    activeNotifTab: 'all', // 'all' or 'unread'
    isMarkingAllRead: false,
  };
}
```

### Computed Properties

```javascript
computed: {
  filteredNotifications() {
    if (this.activeNotifTab === 'unread') {
      return this.notifications.filter(n => !n.read_at);
    }
    return this.notifications;
  }
}
```

### Key Methods

| Method | Purpose |
|--------|---------|
| `getUserAvatar(notification)` | Get avatar URL (API or fallback) |
| `getPerformedByName(notification)` | Extract performer's name |
| `formatNotificationText(notification)` | Build "User action Object" HTML |
| `getCategoryIcon(notification)` | Get Tabler icon class |
| `handleAvatarError(event, notification)` | Fallback avatar on load error |

---

## Backend Integration

### Current Notification Data Structure

```json
{
  "id": "uuid",
  "data": {
    "type": "grant_action",
    "action": "deleted",
    "message": "Grant UNicef-NP has been deleted by HR Manager.",
    "grant_id": 5,
    "grant_code": "B-12345",
    "grant_name": "UNicef-NP",
    "performed_by_id": 2,
    "performed_by_name": "HR Manager",
    "category": "grants"
  }
}
```

### Recommended Addition: `performed_by_avatar`

To show user avatars directly without an API call, add `performed_by_avatar` to the notification data:

```json
{
  "data": {
    "performed_by_id": 2,
    "performed_by_name": "HR Manager",
    "performed_by_avatar": "profile-pictures/user-2.jpg"  // NEW FIELD
  }
}
```

### Laravel Implementation

Update your notification class to include the avatar:

```php
<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class GrantActionNotification extends Notification
{
    protected $grant;
    protected $action;
    protected $performedBy;

    public function __construct($grant, $action, $performedBy)
    {
        $this->grant = $grant;
        $this->action = $action;
        $this->performedBy = $performedBy;
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'grant_action',
            'action' => $this->action,
            'message' => $this->buildMessage(),
            'grant_id' => $this->grant->id,
            'grant_code' => $this->grant->code,
            'grant_name' => $this->grant->name,
            'performed_by_id' => $this->performedBy->id,
            'performed_by_name' => $this->performedBy->name,
            // ADD THIS LINE:
            'performed_by_avatar' => $this->performedBy->profile_picture,
            'category' => 'grants',
            'category_label' => 'Grants',
        ];
    }
}
```

### Fallback Behavior

If `performed_by_avatar` is not provided, the frontend automatically falls back to:

1. **UI Avatars API** - Generates avatar from name initials
2. **SVG Placeholder** - For system notifications

```javascript
// Frontend fallback logic
getUserAvatar(notification) {
  // 1. Try backend-provided avatar
  if (notification.data?.performed_by_avatar) {
    return `${VITE_PUBLIC_URL}/storage/${notification.data.performed_by_avatar}`;
  }

  // 2. Generate from UI Avatars API
  const name = this.getPerformedByName(notification);
  if (name && name !== 'System') {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}...`;
  }

  // 3. System avatar placeholder
  return systemAvatarSvg;
}
```

---

## Styling

### Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `$notif-text-primary` | #111827 | Headings, user names |
| `$notif-text-secondary` | #1f2937 | Body text |
| `$notif-text-muted` | #6b7280 | Timestamps |
| `$notif-border` | #e5e7eb | Dividers |
| `$notif-bg-default` | #ffffff | Default background |
| `$notif-bg-hover` | #f9fafb | Hover state |
| `$notif-bg-unread` | #f0f6ff | Unread notification |
| `$notif-accent-blue` | #3b82f6 | Links, active states |

### Category Badge Colors

| Category | Color | Icon |
|----------|-------|------|
| Grants | #10b981 | ti-target |
| Employee | #6366f1 | ti-user |
| Payroll | #f59e0b | ti-cash |
| Leaves | #8b5cf6 | ti-calendar |
| System | #ef4444 | ti-settings |
| General | #6b7280 | ti-bell |

### File Location

```
src/assets/scss/layout/_notification.scss
```

---

## Responsive Design

### Breakpoints

| Screen Size | Dropdown Width | Changes |
|-------------|----------------|---------|
| Desktop (≥992px) | 420px | Full features |
| Tablet (768-991px) | 340px | Smaller avatars |
| Mobile (<768px) | calc(100vw - 20px), max 340px | Compact layout |
| Mobile (<576px) | Hidden dropdown | Use mobile menu link |

### Mobile Menu Integration

On screens <992px, the notification bell is hidden. Users access notifications via the mobile menu:

```vue
<!-- Mobile Menu -->
<div class="dropdown mobile-user-menu">
  <div class="dropdown-menu">
    <router-link class="dropdown-item mobile-notif-link" to="/notifications">
      <span><i class="ti ti-bell me-2"></i>Notifications</span>
      <span v-if="unreadCount > 0" class="mobile-notif-badge">{{ unreadCount }}</span>
    </router-link>
    <!-- Other menu items -->
  </div>
</div>
```

---

## Accessibility

### Implemented

- **Keyboard Navigation**: Tab through items, Enter to select
- **Focus States**: Visible outline on focus-visible
- **ARIA Labels**: Bell button has aria-label="Notifications"
- **Reduced Motion**: Transitions disabled with prefers-reduced-motion
- **High Contrast**: Stronger borders in high contrast mode

### SCSS Accessibility Rules

```scss
// Reduced motion
@media (prefers-reduced-motion: reduce) {
  .notification-dropdown {
    transition: none;
  }
}

// Focus visible
.notif-item:focus-visible {
  outline: 2px solid $notif-accent-blue;
  outline-offset: -2px;
}

// High contrast
@media (prefers-contrast: high) {
  .notif-item.unread {
    border-left: 3px solid $notif-accent-blue;
  }
}
```

---

## Testing Checklist

- [ ] Bell button shows correct unread count
- [ ] Dropdown opens/closes with native Bootstrap behavior
- [ ] "All" tab shows all notifications
- [ ] "Unread" tab shows only unread notifications
- [ ] User avatars load correctly (or fallback)
- [ ] Category badges display correct icons
- [ ] Unread notifications have blue background
- [ ] "Mark all as read" works and shows loading state
- [ ] Clicking notification navigates and closes dropdown
- [ ] Mobile: Notifications accessible via mobile menu
- [ ] Mobile: No horizontal overflow
- [ ] Responsive: Dropdown width adjusts on different screens
- [ ] Accessibility: Keyboard navigation works
- [ ] Performance: No console errors or memory leaks

---

## Migration Notes

1. The old animation JavaScript has been removed - no action needed
2. CSS transitions now handle show/hide (0.15s ease-out)
3. Mobile users should use the mobile menu link
4. Backend can optionally add `performed_by_avatar` for better avatars

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0.0 | Jan 2026 | HRMS Team | Complete redesign with user context |
| 1.0.0 | Dec 2025 | HRMS Team | Initial implementation |

# Notification System - Frontend Guide

## Overview
Frontend implementation details for consuming HRMS notifications using Vue 3, Pinia, and Laravel Reverb (Echo) for real-time delivery.

## Table of Contents
1. Architecture Overview
2. Frontend Implementation
3. Real-Time WebSocket (Laravel Reverb + Echo)
4. API Endpoints Used
5. Notification Types
6. Summary

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         NOTIFICATION FLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐ │
│  │   Backend    │     │   Laravel    │     │       Frontend           │ │
│  │   Trigger    │────▶│   Reverb     │────▶│   (WebSocket Listener)   │ │
│  │              │     │  (WebSocket) │     │                          │ │
│  └──────────────┘     └──────────────┘     └──────────────────────────┘ │
│         │                                            │                   │
│         │                                            ▼                   │
│         │              ┌──────────────┐     ┌──────────────────────────┐ │
│         │              │   Database   │     │   Notification Store     │ │
│         └─────────────▶│   Storage    │◀────│      (Pinia)             │ │
│                        │ (Laravel DB) │     │                          │ │
│                        └──────────────┘     └──────────────────────────┘ │
│                                                       │                   │
│                                                       ▼                   │
│                                             ┌──────────────────────────┐ │
│                                             │     UI Display           │ │
│                                             │   (Notification Bell)    │ │
│                                             └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

Frontend responsibilities:
- Pull notifications via API and persist in Pinia.
- Listen to private channels over Laravel Reverb (Echo).
- Render bell dropdown with unread badge and mark-all-read action.

---

## 2. Frontend Implementation

### 2.1 Notification Service

```javascript
// src/services/notification.service.js
import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class NotificationService {
    async getNotifications() {
        return apiService.get(API_ENDPOINTS.NOTIFICATION.LIST);
    }

    async markAllNotificationsRead() {
        return apiService.post(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ);
    }
}

export const notificationService = new NotificationService();
```

### 2.2 Notification Store (Pinia)

```javascript
// src/stores/notificationStore.js
import { defineStore } from 'pinia'
import { notificationService } from '@/services/notification.service'

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: []
    }),
    
    actions: {
        // Fetch notifications from API
        async fetchNotifications() {
            this.notifications = await notificationService.getNotifications();
        },
        
        // Mark all as read
        async markAllNotificationsRead() {
            await notificationService.markAllNotificationsRead();
            this.notifications = this.notifications.map(n => ({
                ...n,
                read_at: new Date().toISOString()
            }));
        },
        
        // Add notification from WebSocket
        addNotification(notification) {
            if (!this.notifications.some(n => n.id === notification.id)) {
                this.notifications.unshift(notification);
            }
        }
    },
    
    getters: {
        getNotifications: state => state.notifications,
        getUnreadNotifications: state => state.notifications.filter(n => !n.read_at),
        unreadCount: state => state.notifications.filter(n => !n.read_at).length
    },
    
    persist: {
        key: 'notification-store',
        storage: localStorage
    }
});
```

### 2.3 API Configuration

```javascript
// src/config/api.config.js
export const API_ENDPOINTS = {
    // ... other endpoints
    
    // Notification endpoints
    NOTIFICATION: {
        LIST: '/notifications',
        MARK_ALL_READ: '/notifications/mark-all-read'
    },
};
```

### 2.4 Header Component (UI)

```vue
<!-- src/views/layouts/layout-header.vue -->
<template>
  <!-- Notification Bell -->
  <div class="notification_item">
    <a href="javascript:void(0);" class="btn btn-menubar position-relative" 
       data-bs-toggle="dropdown">
      <i class="ti ti-bell"></i>
      <!-- Unread Count Badge -->
      <span v-if="unreadCount > 0"
        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </a>
    
    <!-- Dropdown Menu -->
    <div class="dropdown-menu dropdown-menu-end notification-dropdown p-4">
      <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
        <h4>Notifications ({{ unreadCount }})</h4>
        <a href="javascript:void(0);" @click="markAllAsRead" v-if="unreadCount > 0">
          Mark all as read
        </a>
      </div>
      
      <!-- Notification List -->
      <div class="noti-content">
        <div v-for="notification in notifications" :key="notification.id" 
             class="border-bottom mb-3 pb-3" 
             :class="{ 'bg-light': !notification.read_at }">
          <div class="d-flex">
            <div class="avatar avatar-sm me-3">
              <i class="ti ti-bell text-white"></i>
            </div>
            <div class="flex-grow-1">
              <p class="mb-1 fw-medium">{{ getNotificationMessage(notification) }}</p>
              <small class="text-muted">{{ formatNotificationDate(notification) }}</small>
              <span v-if="!notification.read_at" class="badge bg-primary ms-2">New</span>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="!notifications.length" class="text-center py-4">
          <i class="ti ti-bell-off text-muted"></i>
          <p class="text-muted">No notifications yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useNotificationStore } from '@/stores/notificationStore';
import { getEcho } from '@/plugins/echo';

export default {
  setup() {
    const notificationStore = useNotificationStore();
    return { notificationStore };
  },
  
  created() {
    // Fetch initial notifications
    this.notificationStore.fetchNotifications();
    
    // Setup WebSocket listener
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;
    
    if (userId && getEcho()) {
      getEcho().private(`App.Models.User.${userId}`)
        .notification((notif) => {
          console.log('[Echo] Notification received:', notif);
          
          const formattedNotif = {
            id: notif.id || Date.now().toString(),
            data: notif.data || { message: notif.message },
            read_at: null,
            created_at: new Date().toISOString(),
            ...notif
          };
          
          // Add to store
          this.notificationStore.addNotification(formattedNotif);
          
          // Show toast notification
          notification.open({
            message: 'New Notification',
            description: this.getNotificationMessage(formattedNotif),
            placement: 'topRight',
          });
        });
    }
  },
  
  computed: {
    notifications() {
      return this.notificationStore.getNotifications;
    },
    unreadCount() {
      return this.notificationStore.unreadCount;
    }
  },
  
  methods: {
    async markAllAsRead() {
      await this.notificationStore.markAllNotificationsRead();
    },
    
    getNotificationMessage(notification) {
      if (notification.data && notification.data.message) {
        return notification.data.message;
      }
      if (notification.message) {
        return notification.message;
      }
      return 'New notification received';
    },
    
    formatNotificationDate(notification) {
      const date = notification.created_at || notification.finished_at;
      if (!date) return 'Just now';
      
      const notificationDate = new Date(date);
      const now = new Date();
      const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      
      return notificationDate.toLocaleDateString();
    }
  }
};
</script>
```

---

## 3. Real-Time WebSocket (Laravel Reverb + Echo)

### 3.1 Echo Plugin

```javascript
// src/plugins/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export function initEcho(token) {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }

    const reverbConfig = {
        broadcaster: 'reverb',
        key: process.env.VUE_APP_REVERB_APP_KEY || 'lwzlina3oymluc9m9nog',
        wsHost: process.env.VUE_APP_REVERB_HOST || '127.0.0.1',
        wsPort: process.env.VUE_APP_REVERB_PORT || 8081,
        wssPort: process.env.VUE_APP_REVERB_PORT || 8081,
        forceTLS: (process.env.VUE_APP_REVERB_SCHEME || 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
        authEndpoint: `${process.env.VUE_APP_PUBLIC_URL}/broadcasting/auth`,
        auth: {
            headers: { Authorization: `Bearer ${token}` },
        },
    };

    echoInstance = new Echo(reverbConfig);

    // Connection event listeners
    echoInstance.connector.pusher.connection.bind('connected', () => {
        console.log('[Echo] ✅ Connected to Laravel Reverb!');
    });

    window.Echo = echoInstance;
    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
        delete window.Echo;
    }
}

export function getEcho() {
    return echoInstance;
}
```

### 3.2 Environment Variables (Frontend)

```env
VUE_APP_REVERB_APP_KEY=your_app_key
VUE_APP_REVERB_HOST=127.0.0.1
VUE_APP_REVERB_PORT=8081
VUE_APP_REVERB_SCHEME=http
```

---

## 4. API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/notifications` | Fetch latest notifications |
| POST | `/notifications/mark-all-read` | Mark all as read |

---

## 5. Notification Types

| Type | Description |
|------|-------------|
| `import_completed` | Successful import completion |
| `import_failed` | Import failure with errors |

---

## 6. Summary

- Fetch notifications via API, cache in Pinia, and expose unread count.
- Subscribe to `private-App.Models.User.{id}` via Echo/Reverb for real-time pushes.
- Keep `.env` Reverb keys aligned with backend values and restart dev server after changes.


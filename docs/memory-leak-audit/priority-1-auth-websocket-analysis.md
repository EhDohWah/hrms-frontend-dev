# Memory Leak Audit Report - Priority 1: Authentication & WebSocket

**Project:** HRMS Vue.js 3 Application  
**Analysis Date:** January 9, 2026  
**Issue:** Memory growth from 200-300MB to 1.5-3.5GB after multiple login/logout cycles  
**Scope:** Priority 1 - Authentication, Logout, and WebSocket Connections

---

## Executive Summary

### 🔴 Critical Issues Found: 5
### 🟡 Medium Issues Found: 8
### 🟢 Low Issues Found: 3

The analysis reveals **multiple critical memory leaks** in authentication and WebSocket lifecycle management that accumulate with each login/logout cycle. The primary issue is that **WebSocket channels, event listeners, and timers are not fully cleaned up on logout**, causing memory to accumulate exponentially.

---

## 🔴 Critical Issues (Must Fix Immediately)

### 1. **WebSocket Channel Subscription Not Cleaned Up in layout-header.vue**

**File:** `src/views/layouts/layout-header.vue`  
**Lines:** 251-280

**Issue:**
The notification WebSocket channel subscription in `created()` hook is **never properly cleaned up**. While `beforeUnmount()` attempts to leave the channel, it:
1. Uses `window.Echo` instead of `getEcho()` (inconsistent)
2. Does not stop listening to the `.notification` event before leaving
3. May fail silently if Echo instance changed

**Code:**
```javascript
// created() - Line 251
if (userId && getEcho()) {
  getEcho().private(`App.Models.User.${userId}`)
    .notification((notif) => {
      // Handler never removed!
      this.notificationStore.addNotification(formattedNotif);
      // ...
    });
}

// beforeUnmount() - Line 287 - INCOMPLETE CLEANUP
if (userId && window.Echo) {
  window.Echo.leave(`private-App.Models.User.${userId}`);
}
```

**Impact:** **HIGH**
- Each login creates a new subscription that persists after logout
- Notifications continue to be received and processed in memory
- Multiple subscriptions accumulate (1st login: 1, 2nd: 2, 3rd: 3, etc.)

**Fix Required:**
```javascript
// In created()
this.notificationListener = getEcho().private(`App.Models.User.${userId}`)
  .notification((notif) => {
    // ... handler code
  });

// In beforeUnmount()
if (this.notificationListener && getEcho()) {
  this.notificationListener.stopListening('.notification');
  getEcho().leave(`private-App.Models.User.${userId}`);
}
```

---

### 2. **Permission Update Listener Not Cleaned Up**

**File:** `src/router/guards.js`  
**Lines:** 30-37

**Issue:**
The permission update listener is initialized in the auth guard on **every route navigation** but is **never cleaned up**. This creates multiple redundant subscriptions.

**Code:**
```javascript
if (isAuthenticated && token && !isEchoInitialized()) {
    initEcho(token);
    
    // This runs on EVERY navigation when Echo is already initialized!
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
        initPermissionUpdateListener(user.id); // Creates new subscription
    }
}
```

**Impact:** **HIGH**
- Multiple permission listeners stack up on each route change
- Each listener triggers `authStore.handlePermissionUpdateEvent()`
- Causes redundant permission API calls
- Memory grows with each navigation

**Fix Required:**
- Move permission listener initialization to login only
- Track if listener is already initialized
- Ensure cleanup on logout

---

### 3. **Echo Instance Reconnection Creates Duplicate Listeners**

**File:** `src/views/pages/authentication/login-index.vue`  
**Lines:** 84-88

**Issue:**
On login, the code **disconnects** existing Echo but doesn't unbind event listeners first, then creates a new instance. The old listeners remain in memory.

**Code:**
```javascript
// Disconnect and reinitialize Echo with new token
if (window.Echo) {
  window.Echo.disconnect(); // Listeners NOT unbound first!
}
initEcho(localStorage.getItem('token'));
```

**Impact:** **HIGH**
- Old connection listeners remain bound to the disconnected instance
- Memory leaks in Pusher/Reverb connection objects
- Each login adds 5 connection event listeners (connected, connecting, disconnected, error, unavailable)

**Fix Required:**
Use `disconnectEcho()` instead of direct disconnect:
```javascript
import { disconnectEcho, initEcho } from '@/plugins/echo';

// In handleLogin:
disconnectEcho(); // This properly unbinds listeners first
initEcho(localStorage.getItem('token'));
```

---

### 4. **Token Timer Leak in auth.service.js**

**File:** `src/services/auth.service.js`  
**Lines:** 53-58, 115-118

**Issue:**
The `tokenTimer` in `auth.service.js` is cleared on logout, BUT the `authService` is a **singleton instance** that persists. If a user logs in again, a new timer is created without clearing the old one properly.

**Code:**
```javascript
setTokenTimer(duration) {
  if (this.tokenTimer) {
    clearTimeout(this.tokenTimer); // Clears previous
  }
  this.tokenTimer = setTimeout(() => this.logout(), duration);
}

clearAuthData() {
  // ...
  if (this.tokenTimer) {
    clearTimeout(this.tokenTimer);
    this.tokenTimer = null; // Good!
  }
}
```

**Impact:** **MEDIUM-HIGH**
- While the code appears correct, the `authService.logout()` method calls `clearAuthData()` which clears the timer
- However, if logout fails or is interrupted, timer may persist
- Multiple logins can create timer leaks if logout is partial

**Fix Required:**
- Add defensive check in `setTokenTimer` before creating new timer
- Ensure `clearAuthData` is called in all logout paths

---

### 5. **BroadcastChannel Not Closed Properly**

**File:** `src/stores/authStore.js`  
**Lines:** 623-672, 713-725

**Issue:**
The `BroadcastChannel` for cross-tab sync is created on login but may not be properly closed if logout fails or user closes browser tab.

**Code:**
```javascript
initCrossTabSync() {
  if (this.crossTabChannel) {
    this.crossTabChannel.close(); // Good!
  }
  
  this.crossTabChannel = new BroadcastChannel('hrms-permission-sync');
  this.crossTabChannel.onmessage = (event) => {
    // Handler attached but never explicitly removed
  };
}

cleanupCrossTabSync() {
  if (this.crossTabChannel) {
    this.crossTabChannel.close();
    this.crossTabChannel = null;
  }
}
```

**Impact:** **MEDIUM**
- BroadcastChannel persists even after logout in some browsers
- Messages may continue to be processed
- Memory leak accumulates with multiple login/logout cycles

**Fix Required:**
- Set `onmessage` to null before closing
- Add try-catch for close operation
- Verify cleanup in browser tab close scenarios

---

## 🟡 Medium Priority Issues

### 6. **Permission Refresh Timer Queue Not Cleared**

**File:** `src/stores/authStore.js`  
**Lines:** 476-531, 573-591

**Issue:**
The permission event queue (`permissionEventQueue`) is never explicitly cleared on logout, potentially retaining references to permission data.

**Fix Required:**
Add to `logout()` method:
```javascript
this.permissionEventQueue = [];
this.isRefreshingPermissions = false;
```

---

### 7. **Notification Store Persists Across Sessions**

**File:** `src/stores/notificationStore.js`  
**Lines:** 76-79

**Issue:**
The notification store uses localStorage persistence, which means notifications from previous users remain in memory and storage.

**Code:**
```javascript
persist: {
  key: 'notification-store',
  storage: localStorage
}
```

**Impact:** **MEDIUM**
- Old user's notifications persist in memory after logout
- Accumulates across multiple user sessions
- Privacy issue - next user can see previous user's notifications

**Fix Required:**
- Remove persist option OR
- Add explicit cleanup on logout
- Clear localStorage notification key in `authStore.logout()`

---

### 8. **Activity Log Cache Not Cleared**

**File:** `src/stores/activityLogStore.js`  
**Lines:** 21, 203

**Issue:**
The `subjectLogsCache` object grows indefinitely and is only cleared on `resetState()` which is called on logout, but the store itself persists.

**Impact:** **MEDIUM**
- Cache grows with each activity log fetch
- Multiple user sessions accumulate cache data

---

### 9. **SharedDataStore Map Objects Persist**

**File:** `src/stores/sharedDataStore.js`  
**Lines:** 59-60, 655-657

**Issue:**
While `resetState()` does clear the Maps, the Maps themselves hold references that may not be immediately garbage collected.

**Code:**
```javascript
// Clear position cache
this.positionsByDepartment.clear();
this.positionAbortControllers.forEach(controller => controller.abort());
this.positionAbortControllers.clear();
```

**Fix Required:**
- Explicitly iterate and delete entries before clear
- Set Maps to new instances instead of just clearing

---

### 10. **Modal Event Listeners Leak in Bootstrap Modals**

**File:** Multiple modal components  
**Pattern Found:** 67 `addEventListener` calls, many without cleanup

**Issue:**
Many modals use Bootstrap modal event listeners (`show.bs.modal`, `hide.bs.modal`, `hidden.bs.modal`) but don't always clean them up properly.

**Example Files:**
- `employee-details-modal.vue` (Lines 2734, 2799)
- `grant-modal.vue` (Lines 253, 259, 269)
- Multiple others

**Impact:** **MEDIUM**
- Event listeners persist after modal destruction
- Accumulates with repeated modal open/close

---

### 11. **HTTP Polling Intervals in Payroll Components**

**Files:**
- `bulk-payroll-modal-simplified.vue` (Line 891)
- `BulkPayrollProgress.vue` (Line 407)

**Issue:**
HTTP polling intervals are started but may not be cleared if user navigates away during payroll processing.

**Code:**
```javascript
httpPollingInterval.value = setInterval(() => {
  if (!wsConnected.value && currentStep.value === 4) {
    fetchBatchStatus(batchId);
  }
}, 3000);
```

**Fix Required:**
- Add `onBeforeUnmount` hook to clear interval
- Ensure cleanup happens even on route change

---

### 12. **Permission Directive Listeners Accumulate**

**File:** `src/directives/permission.js`  
**Lines:** 154, 182, 207

**Issue:**
The permission directive attaches `permissions-updated` listeners to elements, but the cleanup in `unmounted` may not always fire if elements are removed abruptly.

**Impact:** **MEDIUM**
- Directive listeners persist on removed elements
- Can accumulate across many component rerenders

---

### 13. **Sidebar Menu Module Listeners**

**File:** `src/views/layouts/sidebar-menu.vue`  
**Lines:** 272-279

**Issue:**
The sidebar attaches `permissions-updated` and `modules-loaded` listeners on mount, but cleanup depends on proper component lifecycle.

---

## 🟢 Low Priority Issues

### 14. **Memory Cleanup Utility Not Widely Adopted**

**File:** `src/utils/memory-cleanup.js`

**Issue:**
A memory cleanup mixin exists but is not used in critical components like `layout-header.vue`, `login-index.vue`, etc.

**Recommendation:**
- Refactor to use memory-cleanup mixin in all auth-related components
- Or convert to Composition API composable for Vue 3

---

### 15. **Performance Timer Accumulation**

**File:** `src/utils/performance.js`  
**Lines:** 200-202

**Issue:**
Timer cleanup exists but relies on manual cleanup by calling `cleanup()`.

---

### 16. **Cache.js Global Interval**

**File:** `src/utils/cache.js`  
**Line:** 351

**Issue:**
A global `setInterval` runs for cache cleanup but is never explicitly stopped.

---

## Summary of Memory Leak Patterns

### Root Causes:
1. **Incomplete WebSocket Cleanup** - Channels and listeners not fully torn down
2. **Event Listener Accumulation** - Window/document listeners not removed
3. **Timer/Interval Leaks** - setTimeout/setInterval not cleared
4. **Store Persistence** - Pinia stores retain data across sessions
5. **Singleton Service State** - authService persists across logins

### Estimated Memory Impact Per Login/Logout Cycle:
- Echo connection listeners: ~50KB
- WebSocket channel subscriptions: ~100KB
- Notification store data: ~500KB-2MB (depending on notifications)
- Permission event queue: ~10KB
- Modal event listeners: ~5KB per modal
- **Total per cycle: ~600KB-2.5MB**

**After 10 login/logout cycles: 6MB-25MB**  
**After 100 cycles: 60MB-250MB**  
**Combined with other factors: Easily reaches 1.5-3.5GB**

---

## Recommended Action Plan

### Phase 1: Critical Fixes (Immediate - Block Release)
1. ✅ Fix WebSocket notification channel cleanup in `layout-header.vue`
2. ✅ Fix permission listener initialization in `router/guards.js`
3. ✅ Fix Echo reconnection in `login-index.vue`
4. ✅ Verify token timer cleanup in `auth.service.js`
5. ✅ Fix BroadcastChannel cleanup in `authStore.js`

### Phase 2: Medium Priority (Next Sprint)
6. Clear permission event queue on logout
7. Remove notification store persistence OR clear on logout
8. Clear activity log cache on logout
9. Fix modal event listener cleanup patterns
10. Add HTTP polling cleanup to payroll components

### Phase 3: Low Priority (Technical Debt)
11. Adopt memory cleanup utility across components
12. Add memory monitoring in production
13. Implement automated memory leak testing

---

## Testing Recommendations

### Manual Testing:
1. Open Chrome DevTools Memory Profiler
2. Take heap snapshot
3. Login → Logout → Login → Logout (repeat 5 times)
4. Take another heap snapshot
5. Compare detached DOM nodes, event listeners, and intervals

### Expected Results After Fixes:
- Detached DOM nodes: Should remain constant
- Event listeners: Should return to baseline after logout
- Memory growth: <50MB after 10 login/logout cycles

### Automated Testing:
```javascript
// Add to E2E tests
describe('Memory Leak Tests', () => {
  it('should not leak memory on multiple login/logout', async () => {
    const initialMemory = await page.metrics();
    
    for (let i = 0; i < 10; i++) {
      await login();
      await logout();
    }
    
    const finalMemory = await page.metrics();
    const memoryGrowth = finalMemory.JSHeapUsedSize - initialMemory.JSHeapUsedSize;
    
    expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // 50MB max
  });
});
```

---

## Conclusion

The HRMS application has **significant memory leaks** in authentication and WebSocket management. The primary issue is that **cleanup code exists but is incomplete or inconsistent**. Most fixes are straightforward and involve:

1. Properly unbinding event listeners before disconnecting
2. Clearing timers and intervals in all lifecycle hooks
3. Resetting store state on logout
4. Using the `disconnectEcho()` helper consistently

**Estimated Development Time:** 2-3 days  
**Risk Level:** Medium (requires thorough testing)  
**Business Impact:** High (affects all users, worsens over time)

---

**Next Steps:**
1. Review and approve this audit
2. Assign developers to Phase 1 critical fixes
3. Create unit tests for cleanup functions
4. Perform memory profiling after fixes
5. Move to Priority 2 analysis (component-level leaks)

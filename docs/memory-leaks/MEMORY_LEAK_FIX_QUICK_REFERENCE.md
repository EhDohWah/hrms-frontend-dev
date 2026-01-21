# 🚀 Memory Leak Fix - Quick Reference Guide

**For Developers:** Use this guide when fixing memory leaks identified in the comprehensive analysis.

---

## 📋 Priority Files to Fix

### 🔴 CRITICAL - Fix First (Week 1)

#### 1. MutationObserver Leaks (3 files)
- [ ] `src/components/modal/grant-modal.vue` - Line 278
- [ ] `src/components/modal/grant-modal-update.vue` - Line 204
- [ ] `src/components/modal/interview-modal.vue` - Line 344

**Fix:** Add observer to data, disconnect in beforeUnmount
```javascript
data() {
  return {
    ariaObserver: null
  };
},
beforeUnmount() {
  if (this.ariaObserver) {
    this.ariaObserver.disconnect();
    this.ariaObserver = null;
  }
}
```

#### 2. Window Event Listener Leaks (2 files)
- [ ] `src/views/pages/finance-accounts/payroll/employee-salary.vue` - Line 1490
- [ ] `src/main.js` - Line 77 (move to App.vue)

**Fix:** Remove listener in beforeUnmount
```javascript
mounted() {
  window.addEventListener('error', this.handleError);
},
beforeUnmount() {
  window.removeEventListener('error', this.handleError);
}
```

#### 3. Document Event Listener Leak (1 file)
- [ ] `src/components/modal/leaves-admin-modal.vue` - Line 248

**Fix:** Remove custom event listener
```javascript
beforeUnmount() {
  document.removeEventListener('populate-edit-form', this.handlePopulateForm);
}
```

#### 4. Global Interval (1 file)
- [ ] `src/utils/cache.js` - Line 351

**Fix:** Export cleanup function
```javascript
let cacheCleanupInterval = null;

export function startCacheCleanup() {
  cacheCleanupInterval = setInterval(() => {
    // cleanup logic
  }, interval);
}

export function stopCacheCleanup() {
  if (cacheCleanupInterval) {
    clearInterval(cacheCleanupInterval);
    cacheCleanupInterval = null;
  }
}
```

---

### 🟠 HIGH PRIORITY - Bootstrap Modal Disposal (Week 2)

#### Modal Components WITHOUT Disposal (20+ files)

**Add beforeUnmount with disposal to:**

1. [ ] `src/components/modal/site-modal.vue`
2. [ ] `src/components/modal/section-department-modal.vue`
3. [ ] `src/components/modal/position-modal.vue`
4. [ ] `src/components/modal/department-modal.vue`
5. [ ] `src/components/modal/role-list-modal.vue`
6. [ ] `src/components/modal/training-modal.vue`
7. [ ] `src/components/modal/benefit-setting-modal.vue`
8. [ ] `src/views/pages/hrm/training/training-list.vue`
9. [ ] `src/views/pages/hrm/training/employee-training-list.vue`
10. [ ] All report modal components in `src/components/modal/reports/`

**Standard Fix Template:**
```javascript
beforeUnmount() {
  // Mark as destroyed
  this.isDestroyed = true;
  
  // Dispose all modal instances
  if (this.modalInstance) {
    try {
      this.modalInstance.dispose();
    } catch (error) {
      console.error('Error disposing modal:', error);
    }
  }
  
  if (this.addModalInstance) {
    this.addModalInstance.dispose();
  }
  
  if (this.deleteModalInstance) {
    this.deleteModalInstance.dispose();
  }
  
  // Cleanup backdrops
  this.cleanupModalBackdrops();
}
```

**Add cleanupModalBackdrops method:**
```javascript
methods: {
  cleanupModalBackdrops() {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }
}
```

---

## 🛠️ Code Templates

### Template 1: Options API Component with Full Cleanup

```javascript
export default {
  name: 'MyComponent',
  
  data() {
    return {
      isDestroyed: false,
      modalInstance: null,
      searchTimeout: null,
      pollInterval: null,
      ariaObserver: null
    };
  },
  
  mounted() {
    // Initialize modal
    const modalEl = document.getElementById('myModal');
    if (modalEl) {
      this.modalInstance = new Modal(modalEl);
    }
    
    // Add event listeners
    window.addEventListener('custom-event', this.handleCustomEvent);
    document.addEventListener('click', this.handleClick);
    
    // Create observers
    this.ariaObserver = new MutationObserver(() => {
      // Observer logic
    });
    this.ariaObserver.observe(modalEl, { attributes: true });
  },
  
  beforeUnmount() {
    // Mark as destroyed
    this.isDestroyed = true;
    
    // Clear timers
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
    
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    
    // Remove event listeners
    window.removeEventListener('custom-event', this.handleCustomEvent);
    document.removeEventListener('click', this.handleClick);
    
    // Disconnect observers
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = null;
    }
    
    // Dispose modal
    if (this.modalInstance) {
      this.modalInstance.dispose();
      this.modalInstance = null;
    }
    
    // Cleanup backdrops
    this.cleanupModalBackdrops();
  },
  
  methods: {
    async fetchData() {
      const response = await api.getData();
      // Guard against post-unmount updates
      if (this.isDestroyed) return;
      this.data = response.data;
    },
    
    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        if (this.isDestroyed) return;
        this.performSearch();
      }, 500);
    },
    
    cleanupModalBackdrops() {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }
  }
};
```

### Template 2: Composition API Component (Recommended for New Code)

```javascript
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';

export default {
  setup() {
    const isDestroyed = ref(false);
    const modalInstance = ref(null);
    const searchTimeout = ref(null);
    const pollInterval = ref(null);
    
    const fetchData = async () => {
      const response = await api.getData();
      if (isDestroyed.value) return;
      // Update state
    };
    
    const handleSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      searchTimeout.value = setTimeout(() => {
        if (isDestroyed.value) return;
        performSearch();
      }, 500);
    };
    
    onMounted(() => {
      const modalEl = document.getElementById('myModal');
      if (modalEl) {
        modalInstance.value = new Modal(modalEl);
      }
    });
    
    onUnmounted(() => {
      isDestroyed.value = true;
      
      // Clear timers
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      if (pollInterval.value) {
        clearInterval(pollInterval.value);
      }
      
      // Dispose modal
      if (modalInstance.value) {
        modalInstance.value.dispose();
      }
    });
    
    return {
      fetchData,
      handleSearch
    };
  }
};
```

### Template 3: Using Existing cleanupMixin (Easiest!)

```javascript
import { cleanupMixin } from '@/utils/memory-cleanup';

export default {
  mixins: [cleanupMixin],
  
  mounted() {
    // Use mixin methods - automatically cleaned up!
    this.$addListener(window, 'resize', this.handleResize);
    this.$addListener(document, 'click', this.handleClick);
    this.$setInterval(this.poll, 5000);
    this.$setTimeout(this.delayedAction, 3000);
    
    // For observers
    const observer = new MutationObserver(() => {});
    observer.observe(element, config);
    this.$addObserver(observer);
    
    // No need for beforeUnmount - mixin handles everything!
  }
};
```

---

## 🧪 Testing Your Fixes

### 1. Chrome DevTools Memory Test

```javascript
// Before fix:
1. Open Component
2. Close Component
3. Repeat 10 times
4. Take Heap Snapshot
5. Look for increasing "Detached" nodes and VueComponent instances

// After fix:
1. Open Component
2. Close Component
3. Repeat 10 times
4. Take Heap Snapshot
5. Verify: Detached nodes = 0, VueComponent count stable
```

### 2. Manual Modal Test

```javascript
// Test script:
1. Open modal 20 times (open/close rapidly)
2. Check DOM: document.querySelectorAll('.modal-backdrop').length
3. Expected: 0 or 1 (only if modal is open)
4. Check body: document.body.classList.contains('modal-open')
5. Expected: false (unless modal is open)
```

### 3. Event Listener Test

```javascript
// In Chrome DevTools Console:
getEventListeners(window); // Before component mount
// Mount component
getEventListeners(window); // After mount - should show your listeners
// Unmount component  
getEventListeners(window); // After unmount - should match "before mount"
```

---

## 📝 Commit Message Template

```
fix(memory): prevent memory leak in [ComponentName]

- Add MutationObserver disconnect in beforeUnmount
- Dispose Bootstrap Modal instance properly
- Remove window/document event listeners
- Clear intervals and timeouts

Closes #[issue-number]

Testing:
- Memory profiling shows no detached nodes after 20 open/close cycles
- Modal backdrops properly removed from DOM
- Event listener count returns to baseline after unmount
```

---

## ✅ Self-Review Checklist

Before submitting your PR, verify:

- [ ] Every `mounted()` has corresponding `beforeUnmount()` cleanup
- [ ] Every `new Modal()` has `.dispose()` in cleanup
- [ ] Every `setInterval` has `clearInterval` in cleanup
- [ ] Every `setTimeout` is tracked or has `isDestroyed` guard
- [ ] Every `addEventListener` has `removeEventListener` in cleanup
- [ ] Every Observer has `.disconnect()` in cleanup
- [ ] Async methods check `if (this.isDestroyed) return`
- [ ] Tested with Chrome DevTools Memory Profiler
- [ ] No modal backdrops left in DOM after component unmount
- [ ] Body classes/styles reset after modal close

---

## 🔍 Common Mistakes to Avoid

### ❌ DON'T: Remove listener without storing reference
```javascript
mounted() {
  window.addEventListener('resize', () => this.handleResize());
},
beforeUnmount() {
  // This won't work! Arrow function is different reference
  window.removeEventListener('resize', () => this.handleResize());
}
```

### ✅ DO: Use method reference or store arrow function
```javascript
mounted() {
  this.resizeHandler = () => this.handleResize();
  window.addEventListener('resize', this.resizeHandler);
},
beforeUnmount() {
  window.removeEventListener('resize', this.resizeHandler);
}
```

---

### ❌ DON'T: Forget to clear interval on error
```javascript
mounted() {
  this.pollInterval = setInterval(async () => {
    await this.fetchData(); // If this throws, interval keeps running
  }, 5000);
}
```

### ✅ DO: Clear interval on error or use try-catch
```javascript
mounted() {
  this.pollInterval = setInterval(async () => {
    try {
      await this.fetchData();
    } catch (error) {
      console.error(error);
      clearInterval(this.pollInterval); // Stop on error
    }
  }, 5000);
}
```

---

### ❌ DON'T: Update state after unmount
```javascript
async mounted() {
  const data = await api.getData();
  // Component might be unmounted here!
  this.data = data;
}
```

### ✅ DO: Guard with isDestroyed flag
```javascript
data() {
  return { isDestroyed: false };
},
async mounted() {
  const data = await api.getData();
  if (this.isDestroyed) return; // ✅ Safe
  this.data = data;
},
beforeUnmount() {
  this.isDestroyed = true;
}
```

---

## 📚 Additional Resources

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Chrome DevTools Memory Profiler](https://developer.chrome.com/docs/devtools/memory-problems/)
- [Bootstrap 5 Modal Methods](https://getbootstrap.com/docs/5.0/components/modal/#methods)
- [MDN: MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

---

## 🆘 Need Help?

**Questions about:**
- **Component patterns:** Check `src/utils/memory-cleanup.js` or existing components with good patterns
- **Bootstrap modals:** See `employment-modal.vue` or `grant-modal.vue` for complete examples
- **Composition API:** See `BulkPayrollProgress.vue` for excellent patterns
- **Testing:** Ask team lead for memory profiling session

---

**Last Updated:** January 8, 2026  
**Maintained By:** Development Team  



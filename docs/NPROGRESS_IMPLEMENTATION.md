# NProgress Route Loading Indicator

> **Document Version:** 1.0
> **Last Updated:** January 2026
> **Category:** Frontend / User Experience

## Overview

NProgress provides a slim progress bar at the top of the page during route transitions, giving users visual feedback that the application is loading. This implementation is optimized for performance and integrates cleanly with the existing Vue Router setup.

---

## Table of Contents

1. [Installation](#installation)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Customization](#customization)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Installation

NProgress is already installed and configured. If you need to reinstall:

```bash
npm install nprogress --save
```

### Files Created

| File | Purpose |
|------|---------|
| `src/plugins/nprogress.js` | Plugin with router integration and manual control API |
| `src/assets/css/nprogress-custom.css` | Custom styles matching HRMS theme |

### Files Modified

| File | Change |
|------|--------|
| `src/main.js` | Imported and registered NProgress plugin |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Route Navigation                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   router.beforeEach() ──────► NProgress.start()                  │
│         │                           │                             │
│         ▼                           ▼                             │
│   [Auth Guard]              [Progress Bar Visible]                │
│   [Permission Guard]              │                               │
│         │                         │                               │
│         ▼                         │                               │
│   [Component Loads]               │                               │
│         │                         │                               │
│         ▼                         ▼                               │
│   router.afterEach() ───────► NProgress.done()                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Hook Order

The NProgress hooks are registered **before** the existing guards, ensuring they fire first:

1. **beforeEach (NProgress)** - Start progress bar
2. **beforeEach (Scroll)** - Scroll to top
3. **beforeEach (AuthGuard)** - Authentication check
4. **beforeEnter (PermissionGuard)** - Per-route permission check
5. **afterEach (NProgress)** - Finish progress bar
6. **afterEach (Title)** - Update page title

---

## Configuration

### Default Settings

Located in `src/plugins/nprogress.js`:

```javascript
const NPROGRESS_CONFIG = {
  minimum: 0.1,        // Start at 10%
  trickleSpeed: 200,   // Increment every 200ms
  showSpinner: false,  // No spinner (cleaner look)
  easing: 'ease',      // Smooth animation
  speed: 400,          // 400ms animation duration
  parent: 'body',      // Attach to body
};
```

### Timeout Protection

```javascript
const PROGRESS_TIMEOUT = 30000; // 30 seconds max
```

If navigation takes longer than 30 seconds, the progress bar auto-completes to prevent UI stuck states.

### Skip Routes

Routes that don't show the progress bar:

```javascript
const SKIP_PROGRESS_ROUTES = [
  '/login',
  '/logout',
];
```

---

## Usage

### Automatic (Default)

The progress bar automatically starts/stops with route navigation. No code changes needed.

### Manual Control

For non-route operations (API calls, file uploads):

```javascript
// In Composition API
import { inject } from 'vue';

export default {
  setup() {
    const nprogress = inject('nprogress');

    async function fetchData() {
      nprogress.start();
      try {
        await api.fetchLargeDataset();
      } finally {
        nprogress.done();
      }
    }

    return { fetchData };
  }
};
```

```javascript
// In Options API
export default {
  methods: {
    async fetchData() {
      this.$nprogress.start();
      try {
        await this.api.fetchLargeDataset();
      } finally {
        this.$nprogress.done();
      }
    }
  }
};
```

### Import Directly

```javascript
import { start, done, set, inc } from '@/plugins/nprogress';

// Start progress
start();

// Set to specific value (0.0 - 1.0)
set(0.5);

// Increment
inc();

// Finish
done();
```

---

## Customization

### Theme Colors

Edit `src/assets/css/nprogress-custom.css`:

```css
#nprogress .bar {
  background: var(--primary-color, #011b44);
  /* Change to match your theme */
}
```

### Bar Height

```css
#nprogress .bar {
  height: 3px; /* Default */
  /* Change to 2px for thinner, 4px for thicker */
}
```

### Enable Spinner

In `src/plugins/nprogress.js`:

```javascript
const NPROGRESS_CONFIG = {
  showSpinner: true,  // Enable spinner
  // ...
};
```

### Change Position

```css
#nprogress .bar {
  top: 0;    /* Default: top */
  /* bottom: 0; */ /* Alternative: bottom */
}
```

### Glow Effect

The default includes a glow effect:

```css
#nprogress .bar {
  box-shadow: 0 0 10px var(--primary-color),
              0 0 5px var(--primary-color);
}
```

To disable:

```css
#nprogress .bar {
  box-shadow: none;
}
```

---

## API Reference

### Plugin Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `start()` | Start the progress bar | None |
| `done()` | Complete the progress bar | None |
| `set(value)` | Set progress to specific value | `value`: 0.0 - 1.0 |
| `inc()` | Increment progress slightly | None |
| `isStarted()` | Check if progress is active | Returns: `boolean` |

### Injection Keys

| Key | Access | Description |
|-----|--------|-------------|
| `'nprogress'` | `inject('nprogress')` | Composition API |
| `this.$nprogress` | `this.$nprogress` | Options API |

---

## Troubleshooting

### Issue: Progress bar doesn't appear

**Causes:**
1. CSS not imported
2. Z-index conflict with other elements
3. Route in skip list

**Solutions:**
```javascript
// Check CSS import in main.js
import '@/assets/css/nprogress-custom.css';

// Check z-index in CSS (should be 99999)
#nprogress .bar {
  z-index: 99999;
}
```

### Issue: Progress bar gets stuck

**Causes:**
1. Navigation error not handled
2. Component throws during mount
3. Infinite redirect loop

**Solutions:**
```javascript
// Timeout protection is built-in (30s default)
// Check for errors in router.onError handler

// Manual cleanup if needed:
import { done } from '@/plugins/nprogress';
done();
```

### Issue: Progress bar conflicts with Ant Design

**Cause:** Z-index overlap with modals

**Solution:** Our CSS already handles this:
```css
/* NProgress: 99999 */
/* Ant Design modals: 99999+ (handled by Ant Design) */
```

### Issue: Memory leaks

**Cause:** Timer not cleared

**Solution:** Built-in cleanup in `finishProgress()`:
```javascript
function finishProgress() {
  clearProgressTimer();  // Always clears timeout
  isNavigating = false;
  NProgress.done();
}
```

---

## Best Practices

### 1. Don't Start Manually for Routes

The plugin handles route transitions automatically. Only use manual control for:
- Long API calls
- File uploads/downloads
- WebSocket operations
- Background tasks

### 2. Always Use Finally Block

```javascript
// Good
nprogress.start();
try {
  await operation();
} finally {
  nprogress.done(); // Always runs
}

// Bad - might leave progress stuck
nprogress.start();
await operation(); // If this throws, done() never runs
nprogress.done();
```

### 3. Don't Call Start Multiple Times

The plugin prevents multiple starts, but avoid:

```javascript
// Bad
nprogress.start();
nprogress.start(); // Ignored

// Good
if (!nprogress.isStarted()) {
  nprogress.start();
}
```

### 4. Heavy Routes

For routes that load heavy data tables:

```javascript
// In component
import { inc } from '@/plugins/nprogress';

onMounted(async () => {
  inc(); // Show progress increasing
  await fetchPage1();
  inc();
  await fetchPage2();
  // done() called automatically by afterEach
});
```

---

## Testing Checklist

- [ ] Progress bar appears on route change
- [ ] Progress bar completes when route loads
- [ ] Progress bar matches theme color (#011b44)
- [ ] No progress bar on login/logout routes
- [ ] No conflicts with Ant Design modals
- [ ] No console errors
- [ ] Works on mobile (responsive)
- [ ] Manual API (`start`, `done`) works
- [ ] Timeout protection works (wait 30+ seconds)

---

## Related Documentation

- [Vue Router Documentation](https://router.vuejs.org/)
- [NProgress GitHub](https://github.com/rstacruz/nprogress)
- [HRMS Router Guards](./guards.js)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | HRMS Team | Initial implementation |

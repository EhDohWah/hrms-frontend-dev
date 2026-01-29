# Styling Ant Design Vue Teleported Components

## The Problem

When using Ant Design Vue components like `<a-modal>`, `<a-select>`, `<a-dropdown>`, `<a-date-picker>`, etc., you may find that **scoped styles don't work** even when using `:deep()`.

### Example: Modal Header Border Not Showing

```vue
<template>
  <a-modal :open="visible" title="Add Holiday">
    <!-- form content -->
  </a-modal>
</template>

<style scoped>
/* THIS DOESN'T WORK! */
:deep(.ant-modal-header) {
  border-bottom: 1px solid #d9d9d9 !important;
}
</style>
```

You add the styles, but the modal header still has no visible divider line.

---

## Why This Happens

### Vue Scoped Styles

Vue's scoped styles work by adding a unique attribute (like `data-v-7ba5bd90`) to elements **within the component's template**. The `:deep()` combinator allows styles to target child components, but only if those elements are **inside the component's DOM tree**.

### Teleportation

Ant Design Vue uses Vue's `<Teleport>` feature to render certain components **outside the component's DOM tree**, typically directly into `<body>`:

```html
<!-- Your component renders here -->
<div id="app">
  <your-component data-v-7ba5bd90>
    <!-- Modal trigger button is here -->
  </your-component>
</div>

<!-- But the modal renders HERE, outside your component! -->
<body>
  <div class="ant-modal-root">
    <div class="ant-modal-mask"></div>
    <div class="ant-modal-wrap">
      <div class="ant-modal">
        <!-- NO data-v-7ba5bd90 attribute here! -->
        <div class="ant-modal-content">
          <div class="ant-modal-header">...</div>
          <div class="ant-modal-body">...</div>
        </div>
      </div>
    </div>
  </div>
</body>
```

Since the modal is **teleported to `<body>`**, it's outside the component's DOM tree, and Vue's scoped styles (even with `:deep()`) cannot reach it.

---

## Affected Components

These Ant Design Vue components are teleported and **cannot be styled with scoped styles**:

| Component | Teleported Element | Default Container |
|-----------|-------------------|-------------------|
| `<a-modal>` | Modal dialog | `<body>` |
| `<a-drawer>` | Drawer panel | `<body>` |
| `<a-select>` | Dropdown options | `<body>` |
| `<a-date-picker>` | Calendar popup | `<body>` |
| `<a-time-picker>` | Time popup | `<body>` |
| `<a-dropdown>` | Dropdown menu | `<body>` |
| `<a-popover>` | Popover content | `<body>` |
| `<a-tooltip>` | Tooltip content | `<body>` |
| `<a-popconfirm>` | Confirm popup | `<body>` |
| `<a-message>` | Toast messages | `<body>` |
| `<a-notification>` | Notifications | `<body>` |

---

## The Solution: Global Styles

Since teleported elements are outside the component's scope, you must use **global (unscoped) styles**.

### Option 1: Add to `main.scss` (Recommended)

Add styles to your global stylesheet (`src/assets/scss/main.scss`):

```scss
/****** Ant Design Modal Header Styling ******/
/* Reset Ant Design 4 modal content padding for proper header/body separation */
.ant-modal-content {
  padding: 0 !important;
  border-radius: 8px;
  overflow: hidden;
}

/* Modal header with visible divider line */
.ant-modal-header {
  padding: 16px 24px !important;
  margin: 0 !important;
  border-bottom: 1px solid #d9d9d9 !important;
  background: #fff !important;
  border-radius: 8px 8px 0 0;
}

/* Modal title styling */
.ant-modal-title {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #1a1a2e !important;
  line-height: 1.4 !important;
}

/* Modal body with proper spacing from header */
.ant-modal-body {
  padding: 24px !important;
}

/* Modal close button positioning */
.ant-modal-close {
  top: 12px !important;
  right: 16px !important;
}
```

### Option 2: Unscoped Style Block in Component

Add a second `<style>` block without the `scoped` attribute:

```vue
<template>
  <a-modal :open="visible" title="Add Holiday">
    <!-- form content -->
  </a-modal>
</template>

<style scoped>
/* Scoped styles for elements INSIDE your component */
.form-label {
  font-weight: 500;
}
</style>

<style>
/* Unscoped styles for TELEPORTED elements */
.ant-modal-header {
  border-bottom: 1px solid #d9d9d9 !important;
}
</style>
```

> **Warning:** Unscoped styles in components are global and will affect ALL modals in your app. Use specific class selectors if you need modal-specific styles.

### Option 3: Use `getContainer` Prop (Not Recommended)

Some components support a `getContainer` prop to render inside a specific element:

```vue
<template>
  <div ref="modalContainer">
    <a-modal :open="visible" :getContainer="() => $refs.modalContainer">
      <!-- content -->
    </a-modal>
  </div>
</template>

<style scoped>
:deep(.ant-modal-header) {
  border-bottom: 1px solid #d9d9d9;
}
</style>
```

This keeps the modal inside the component's DOM tree, allowing scoped styles to work. However, this can cause issues with:
- Z-index stacking
- Scroll behavior
- Focus trapping

---

## Ant Design Vue 4 Specific Issue

Ant Design Vue 4 changed the modal structure. The `.ant-modal-content` element now has default padding that removes the visual separation between header and body:

```css
/* Ant Design Vue 4 default */
.ant-modal-content {
  padding: 20px 24px;  /* This removes header/body separation */
}
```

### Fix

Reset the padding on `.ant-modal-content`:

```scss
.ant-modal-content {
  padding: 0 !important;
}

.ant-modal-header {
  padding: 16px 24px !important;
  border-bottom: 1px solid #d9d9d9 !important;
}

.ant-modal-body {
  padding: 24px !important;
}
```

---

## Quick Reference

| Scenario | Use This Approach |
|----------|-------------------|
| Style all modals consistently | `main.scss` (global) |
| One-off modal customization | Unscoped `<style>` block |
| Component library development | `getContainer` prop |
| Style elements inside modal body | Scoped `:deep()` works if content is in your template |

---

## Debugging Tips

1. **Inspect the DOM**: Open DevTools and check where the modal is rendered. If it's directly under `<body>`, it's teleported.

2. **Check for `data-v-*` attributes**: If the modal elements don't have Vue's scoped attribute, scoped styles won't work.

3. **Use `!important`**: Ant Design uses specific selectors. You may need `!important` to override.

4. **Check Ant Design version**: Ant Design Vue 3 and 4 have different default styles. Check your `package.json` for the version.

---

## Related Files in This Project

- Global modal styles: `src/assets/scss/main.scss`
- Example modal component: `src/components/modal/grant-modal.vue`
- Example modal component: `src/components/modal/holidays-modal.vue`

---

## References

- [Vue Scoped CSS Documentation](https://vuejs.org/api/sfc-css-features.html#scoped-css)
- [Vue Teleport Documentation](https://vuejs.org/guide/built-ins/teleport.html)
- [Ant Design Vue Modal API](https://antdv.com/components/modal)

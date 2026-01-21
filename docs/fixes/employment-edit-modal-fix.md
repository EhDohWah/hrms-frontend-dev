# Employment Edit Modal Fix

## Issue
The employment edit modal was not opening when users clicked the edit button in the employment list. The error message displayed was: **"Edit form is loading, please try again."**

## Root Cause
The `employmentData` property in `employment-edit-modal.vue` was incorrectly defined as a `ref` in the Vue 3 Composition API `setup()` function:

```javascript
setup() {
    const employmentData = ref(null);  // ❌ WRONG - causes reactivity issues
    const alertMessage = ref('');
    const alertClass = ref('');
    // ...
    return {
        employmentData,
        alertMessage,
        alertClass,
        // ...
    };
}
```

However, the parent component (`employment-list.vue`) was trying to set this data directly:

```javascript
this.$refs.employmentEditModal.employmentData = response.data;
```

This direct assignment doesn't work properly with Vue 3 refs when accessed from outside the component. The ref would need to be updated using its `.value` property, but this creates an anti-pattern and breaks component encapsulation.

## Analysis
After analyzing `employment-modal.vue` (the add modal), we found that it does NOT define `employmentData` in the setup function at all. The setup function in `employment-modal.vue` only returns composable values and refs that are truly needed for the Composition API:

```javascript
// ✅ CORRECT pattern from employment-modal.vue
setup() {
    const alertMessage = ref('');
    const alertClass = ref('');
    // ... composable values only
    return {
        alertMessage,
        alertClass,
        // ... no employmentData here
    };
}
```

## Solution
Moved `employmentData` from the `setup()` function to the `data()` function, matching the pattern used in `employment-modal.vue`:

**Before:**
```javascript
setup() {
    const employmentData = ref(null);  // ❌ Wrong location
    return { employmentData };
}
data() {
    return {
        dataLoaded: false,
        // ...
    };
}
```

**After:**
```javascript
setup() {
    // Only composable values here
    const alertMessage = ref('');
    const alertClass = ref('');
    return { alertMessage, alertClass };
}
data() {
    return {
        dataLoaded: false,
        employmentData: null,  // ✅ Correct location
        // ...
    };
}
```

This allows the parent component to set the data directly as normal Vue reactive data:

```javascript
this.$refs.employmentEditModal.employmentData = response.data;
await this.$refs.employmentEditModal.openModal();
```

## Files Modified
1. **src/components/modal/employment-edit-modal.vue**
   - Moved `employmentData` from `setup()` function to `data()` function
   - Added `v-if="isModalVisible"` to `a-tree-select` to prevent render warnings
   - Now matches the pattern used in `employment-modal.vue`

2. **src/views/pages/hrm/employment/employment-list.vue**
   - Simplified to use direct property assignment (no changes needed, original code now works)

## Testing
1. Navigate to the Employment List page
2. Click the edit button (pencil icon) on any employment record
3. The edit modal should now open successfully with the employment data loaded
4. Verify that all fields are populated correctly
5. Test editing and saving changes

## Technical Details
- The issue was related to Vue 3's reactivity system and how refs work in the Composition API
- Direct property assignment from parent components doesn't properly update refs defined in setup()
- The `setup()` function should only be used for:
  - Composables (like `useAllocationCalculation()`)
  - Refs that are internal to the component's reactive logic
  - Computed values that depend on composables
- Regular component data that needs to be set from parent components should be in `data()`
- This follows Vue 3 best practices and matches the pattern used in `employment-modal.vue`

## Related Components
- `employment-edit-modal.vue` - The modal component for editing employment records
- `employment-list.vue` - The parent component that opens the edit modal
- `employment.service.js` - Service for fetching employment data

## Date
January 9, 2026

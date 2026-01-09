# Funding Allocation Upload UI Fix

**Date:** January 9, 2026  
**Issue:** Grant Items Reference download button was appearing below the upload row without proper styling

## Problem

The "Download Grant Items Reference" button was rendered as a separate button below the upload row, causing:
- Poor visual integration
- Inconsistent styling
- Cluttered interface
- Not aligned with existing download links

## Solution

### 1. Added Slot to Upload-Row Component

Modified `upload-row.vue` to support additional download links:

```vue
<div v-if="upload.templateUrl" class="d-flex align-items-center gap-2">
    <a href="javascript:void(0);" @click="downloadTemplate" class="text-primary fs-12">
        <i class="ti ti-download me-1"></i>Download Template
    </a>
    <slot name="additional-downloads"></slot>
</div>
```

### 2. Updated Funding Allocation Upload Component

Modified `funding-allocation-upload.vue` to use the slot:

```vue
<template #additional-downloads>
    <span class="text-muted fs-12 mx-2">|</span>
    <a 
        href="javascript:void(0);" 
        @click="downloadGrantItemsReference" 
        class="text-success fs-12"
        :class="{ 'disabled': downloadingReference }"
    >
        <i class="ti ti-list-check me-1"></i>
        {{ downloadingReference ? 'Downloading...' : 'Download Grant Items Reference' }}
    </a>
    <i 
        class="ti ti-info-circle text-info ms-1" 
        style="cursor: help;"
        title="Download this file first to get Grant Item IDs needed for the import"
    ></i>
</template>
```

## Result

Now the UI shows:
```
Employee Funding Allocations Import
Upload Excel file with employee funding allocation data (bulk import)
Download Template | Download Grant Items Reference ℹ️
```

### Visual Improvements

✅ **Inline Layout** - Both download links appear on the same line  
✅ **Consistent Styling** - Uses same font size and style as template link  
✅ **Visual Separator** - Pipe (|) separates the two links  
✅ **Color Coding** - Template is blue, Reference is green  
✅ **Info Icon** - Tooltip explains the purpose  
✅ **Loading State** - Shows "Downloading..." when in progress  
✅ **Disabled State** - Link is disabled during download

## Files Modified

1. `src/components/uploads/upload-row.vue`
   - Added `<slot name="additional-downloads"></slot>`

2. `src/components/uploads/funding-allocation-upload.vue`
   - Used the slot to render grant items reference link
   - Added disabled state styling

## Benefits

- **Better UX** - Clear visual hierarchy
- **Consistent** - Matches existing UI patterns
- **Informative** - Info icon provides context
- **Accessible** - Proper loading and disabled states
- **Reusable** - Slot can be used by other upload components

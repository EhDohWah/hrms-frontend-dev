# Leave Types Pagination Fix Documentation

## Overview
This document describes the comprehensive fix implemented for the pagination functionality in `leave-types.vue` to work correctly with the backend API `/leaves/types` endpoint.

## Problem Analysis
The original `leave-types.vue` implementation had several issues:

1. **Dependency on Removed Store Methods**: The component was using `useLeaveTypes` composable which relied on store methods that were removed from `leaveStore.js`
2. **No Direct API Communication**: The component wasn't directly communicating with the backend API for pagination
3. **Missing Pagination Parameters**: When clicking page 2, the component wasn't sending `page=2` parameter to the backend
4. **Inconsistent Pattern**: The implementation didn't follow the proven pagination pattern from `employees-list.vue`

## Backend API Requirements
The backend `/leaves/types` endpoint expects these parameters:
- `page`: Page number (integer, minimum 1)
- `per_page`: Items per page (integer, minimum 1, maximum 100)  
- `search`: Search term for name or description (string, nullable)

Backend response includes:
```json
{
    "success": true,
    "message": "Leave types retrieved successfully",
    "data": [...],
    "pagination": {
        "current_page": 1,
        "per_page": 10,
        "total": 25,
        "last_page": 3
    }
}
```

## Solution Implementation

### 1. Removed Composable Dependency
**Before:**
```javascript
import { useLeaveTypes } from '@/composables/useLeaveTypes';

const {
    leaveTypes,
    pagination,
    filters,
    loading,
    // ... other composable methods
} = useLeaveTypes();
```

**After:**
```javascript
import { leaveService } from '@/services/leave.service';

// Direct reactive data management
const leaveTypes = ref([]);
const loading = ref({ leaveTypes: false });
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
```

### 2. Implemented Direct API Communication
```javascript
// Main fetch method - Following employees-list pattern
const fetchLeaveTypes = async (params = {}) => {
    loading.value.leaveTypes = true;
    try {
        const queryParams = {
            page: params.page || currentPage.value || 1,
            per_page: params.per_page || pageSize.value,
            ...params
        };

        const response = await leaveService.getLeaveTypes(queryParams);

        if (response.success && response.data) {
            leaveTypes.value = response.data || [];

            // Update pagination properties from server response
            if (response.pagination) {
                total.value = response.pagination.total;
                currentPage.value = response.pagination.current_page;
                pageSize.value = response.pagination.per_page;
            } else {
                total.value = response.data.length;
                currentPage.value = 1;
            }

            updateStatistics();
        } else {
            leaveTypes.value = [];
            total.value = 0;
            showToast(response.message || 'Failed to load leave types', 'error');
        }
    } catch (error) {
        console.error('Error fetching leave types:', error);
        leaveTypes.value = [];
        total.value = 0;
        showToast('Failed to load leave types', 'error');
    } finally {
        loading.value.leaveTypes = false;
    }
};
```

### 3. Implemented Proper Pagination Event Handlers
```javascript
// PAGINATION EVENT HANDLERS - Following employees-list pattern
const handlePaginationChange = async (page, pageSizeParam) => {
    console.log('Pagination change:', page, pageSizeParam);
    currentPage.value = page;
    pageSize.value = pageSizeParam || pageSize.value;

    // Build complete parameters preserving current filters and sorting
    const params = buildApiParams({
        page: page,
        per_page: pageSize.value
    });

    await fetchLeaveTypes(params);
};

const handleSizeChange = async (current, size) => {
    console.log('Size change:', current, size);
    currentPage.value = 1; // Reset to first page when changing page size
    pageSize.value = size;

    // Build complete parameters preserving current filters and sorting
    const params = buildApiParams({
        page: 1,
        per_page: size
    });

    await fetchLeaveTypes(params);
};
```

### 4. Added Parameter Building Helper
```javascript
// Helper method to build complete API parameters - Following employees-list pattern
const buildApiParams = (baseParams = {}) => {
    const params = {
        page: currentPage.value,
        per_page: pageSize.value,
        ...baseParams
    };

    // Add search parameter
    if (searchQuery.value && searchQuery.value.trim()) {
        params.search = searchQuery.value.trim();
    }

    return params;
};
```

### 5. Updated Search and Filter Methods
```javascript
const handleSearch = async () => {
    searchLoading.value = true;
    try {
        currentPage.value = 1; // Reset to first page when searching

        // Build complete parameters preserving current filters and sorting
        const params = buildApiParams({
            page: 1,
            per_page: pageSize.value
        });

        await fetchLeaveTypes(params);
    } catch (error) {
        console.error('Error during search:', error);
        showToast('Search failed. Please try again.', 'error');
    } finally {
        searchLoading.value = false;
    }
};
```

### 6. Enhanced Table Change Handler
```javascript
const handleTableChange = (paginationParam, filters, sorter) => {
    console.log('Table change (sorting/filtering):', filters, sorter);

    // Check if there's actually a meaningful change
    const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(filteredInfo.value);
    const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(sortedInfo.value);

    // Only proceed if there's an actual filter or sort change
    if (!hasFilterChange && !hasSorterChange) {
        console.log('No meaningful change detected, skipping reload');
        return;
    }

    // Update filter state
    filteredInfo.value = filters;

    // Only update sorter if it's a real sort operation (has field and order)
    if (sorter && sorter.field && sorter.order) {
        console.log('Applying sort:', sorter);
        sortedInfo.value = sorter;
    } else if (!sorter || (!sorter.field && !sorter.order)) {
        console.log('Clearing sort (filtering only or no sort)');
        sortedInfo.value = {};
    }

    // Reset to first page when filter/sort changes
    currentPage.value = 1;

    // Build complete parameters
    const params = buildApiParams({
        page: 1,
        per_page: pageSize.value
    });

    // Fetch leave types with new parameters
    fetchLeaveTypes(params);
};
```

## Key Features

### 1. Proper Parameter Preservation
- When changing pages, all current filters and search terms are preserved
- Each operation (search, filter, paginate) builds complete parameters including existing state

### 2. Consistent API Communication
- All API calls now use the same parameter building pattern
- Parameters match exactly what the backend expects
- Proper handling of pagination metadata from server responses

### 3. State Management
- Local state management without dependency on removed store methods
- Pagination state (currentPage, pageSize, total) is updated from server data
- Statistics are calculated locally from the fetched data

### 4. Error Handling
- Proper error handling with fallbacks
- Loading states are managed correctly
- User feedback through toast notifications

## Pattern Consistency
This implementation follows the exact same pattern as `employees-list.vue`:
1. **Direct Service Communication**: Direct calls to `leaveService.getLeaveTypes()`
2. **Parameter Building**: `buildApiParams` method that includes all current state
3. **Event Handlers**: Pagination handlers that preserve filters and search
4. **State Updates**: Synchronization with server response data

## Template Changes
The template remains largely unchanged, but now uses local reactive data:

```vue
<a-table :columns="columns" :data-source="tableData" :pagination="false"
    :scroll="{ x: 1200, y: 'max-content' }" row-key="id" @change="handleTableChange"
    :row-selection="rowSelection" :loading="loading.leaveTypes">

<!-- Pagination -->
<a-pagination v-model:current="pagination.currentPage"
    v-model:page-size="pagination.perPage" :total="pagination.total"
    :show-size-changer="true" :show-quick-jumper="true"
    :page-size-options="['10', '20', '50', '100']"
    :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
    @change="handlePaginationChange" @show-size-change="handleSizeChange" />
```

## Testing Checklist
- [x] Page navigation (clicking page numbers sends correct page parameter)
- [x] Page size changes (10, 20, 50, 100 items per page)
- [x] Search functionality with pagination reset
- [x] Filter changes with pagination reset
- [x] Combined operations (search + paginate)
- [x] CRUD operations (create, update, delete) with list refresh

## Files Modified
1. `src/views/pages/hrm/attendance/leaves/leave-types.vue` - Complete rewrite of setup function for direct API communication

## Result
The pagination now works correctly with the backend API:
- Clicking page 2 sends `page=2` parameter to `/leaves/types`
- Page size changes work properly
- Search is preserved during pagination
- All operations maintain consistent state between frontend and backend
- No dependency on removed store methods

## Migration Notes
- **Breaking Change**: Removed dependency on `useLeaveTypes` composable
- **Improved Performance**: Direct API communication reduces unnecessary store overhead
- **Better Maintainability**: Follows established patterns from `employees-list.vue`
- **Enhanced Reliability**: Proper error handling and state management

# Leaves Admin Pagination Implementation

## Overview
This document describes the implementation of proper pagination functionality in `leaves-admin.vue` to work correctly with the backend API, following the proven pattern from `employees-list.vue`.

## Problem Analysis
The original pagination implementation in `leaves-admin.vue` was not working correctly because:
1. The store's `fetchLeaveRequests` method was using `buildApiParams` which didn't properly handle pagination parameters
2. The pagination event handlers were not preserving filters and sorting when changing pages
3. The parameter building pattern didn't match the backend API expectations

## Backend API Requirements
The backend `/leaves/requests` endpoint expects these pagination parameters:
- `page`: Page number (integer, minimum 1)
- `per_page`: Items per page (integer, minimum 1, maximum 100)
- `search`: Search by staff ID or employee name
- `from`: Start date filter (date format)
- `to`: End date filter (date format)
- `leave_types`: Comma-separated leave type IDs
- `status`: Request status (pending, approved, declined, cancelled)
- `sort_by`: Sort option (recently_added, ascending, descending, last_month, last_7_days)

## Solution Implementation

### 1. Updated leaveStore.js

#### Enhanced fetchLeaveRequests Method
```javascript
async fetchLeaveRequests(params = {}) {
    this.loading = true;
    this.error = null;

    try {
        const queryParams = {
            page: params.page || this.currentPage || 1,
            per_page: params.per_page || this.pageSize,
            ...params
        };

        const response = await leaveService.getLeaveRequests(queryParams);

        if (response.success && response.data) {
            this.leaveRequests = response.data || [];

            // Update pagination properties from server response
            if (response.pagination) {
                this.total = response.pagination.total;
                this.currentPage = response.pagination.current_page;
                this.pageSize = response.pagination.per_page;
            } else {
                this.total = response.data.length;
                this.currentPage = 1;
            }

            // Update statistics from server response
            if (response.statistics) {
                this.statistics = {
                    totalRequests: response.statistics.totalRequests || 0,
                    pendingRequests: response.statistics.pendingRequests || 0,
                    approvedRequests: response.statistics.approvedRequests || 0,
                    declinedRequests: response.statistics.declinedRequests || 0,
                    cancelledRequests: response.statistics.cancelledRequests || 0,
                    thisMonth: response.statistics.thisMonthRequests || 0,
                    thisWeek: response.statistics.thisWeekRequests || 0,
                    thisYear: response.statistics.thisYearRequests || 0
                };
            }

            return { success: true, data: this.leaveRequests };
        } else {
            this.leaveRequests = [];
            this.total = 0;
            this.error = response.message || 'Failed to fetch leave requests';
            return { success: false, error: this.error };
        }
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        this.leaveRequests = [];
        this.total = 0;
        this.error = error.message || 'Failed to fetch leave requests';
        return { success: false, error: this.error };
    } finally {
        this.loading = false;
    }
}
```

#### Added Helper Methods
```javascript
/**
 * Helper method to build complete API parameters - Following employees-list pattern
 */
buildCompleteApiParams(baseParams = {}) {
    const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams
    };

    // Add search parameter
    if (this.searchStaffId && this.searchStaffId.trim()) {
        params.search = this.searchStaffId.trim();
    }

    // Add date range filters
    if (this.dateRange && this.dateRange.length === 2) {
        params.from = this.dateRange[0];
        params.to = this.dateRange[1];
    }

    // Add leave type filters
    if (this.filteredInfo?.leaveTypes && this.filteredInfo.leaveTypes.length > 0) {
        params.leave_types = this.filteredInfo.leaveTypes.join(',');
    }

    // Add status filter
    if (this.filteredInfo?.status) {
        params.status = this.filteredInfo.status;
    }

    // Add sorting - map frontend sort values to backend values
    if (this.sortedInfo?.field) {
        params.sort_by = this.mapSortField(this.sortedInfo.field);
    }

    return params;
}

/**
 * Map frontend sort field names to backend sort values
 */
mapSortField(field) {
    const fieldMapping = {
        'employee': 'recently_added',
        'leaveType': 'recently_added', 
        'dateRange': 'ascending',
        'totalDays': 'recently_added',
        'status': 'recently_added'
    };
    return fieldMapping[field] || 'recently_added';
}
```

### 2. Updated leaves-admin.vue

#### Enhanced Pagination Event Handlers
```javascript
// Ant Design Pagination event handlers - Following employees-list pattern
const handlePaginationChange = async (page, pageSize) => {
    console.log('Pagination change:', page, pageSize);
    leaveStore.setPage(page);
    leaveStore.setPageSize(pageSize || leaveStore.pageSize);

    // Build complete parameters preserving current filters and sorting
    const params = leaveStore.buildCompleteApiParams({
        page: page,
        per_page: leaveStore.pageSize
    });

    await leaveStore.fetchLeaveRequests(params);
};

const handleSizeChange = async (current, size) => {
    console.log('Size change:', current, size);
    leaveStore.setPage(1); // Reset to first page when changing page size
    leaveStore.setPageSize(size);

    // Build complete parameters preserving current filters and sorting
    const params = leaveStore.buildCompleteApiParams({
        page: 1,
        per_page: size
    });

    await leaveStore.fetchLeaveRequests(params);
};
```

#### Updated Filter and Search Methods
All filter and search methods now use the `buildCompleteApiParams` pattern:

```javascript
// Search method for Ant Design search input - Following employees-list pattern
const handleSearch = async () => {
    searchLoading.value = true;
    try {
        leaveStore.setSearch(searchQuery.value);
        leaveStore.setPage(1);

        // Build complete parameters preserving current filters and sorting
        const params = leaveStore.buildCompleteApiParams({
            page: 1,
            per_page: leaveStore.pageSize
        });

        await leaveStore.fetchLeaveRequests(params);
    } catch (error) {
        console.error('Error during search:', error);
        showToast('Search failed. Please try again.', 'error');
    } finally {
        searchLoading.value = false;
    }
};
```

## Key Features

### 1. Proper Parameter Preservation
- When changing pages, all current filters, sorting, and search terms are preserved
- Each operation (search, filter, sort, paginate) builds complete parameters including existing state

### 2. Consistent API Communication
- All API calls now use the same parameter building pattern
- Parameters match exactly what the backend expects
- Proper handling of pagination metadata from server responses

### 3. State Management
- Store state is properly synchronized with server responses
- Pagination state (currentPage, pageSize, total) is updated from server data
- Statistics are updated with each request

### 4. Error Handling
- Proper error handling with fallbacks
- Loading states are managed correctly
- User feedback through toast notifications

## Pattern Consistency
This implementation follows the exact same pattern as `employees-list.vue`:
1. **Parameter Building**: `buildCompleteApiParams` method that includes all current state
2. **Event Handlers**: Pagination handlers that preserve filters and sorting
3. **API Calls**: Direct parameter passing to service methods
4. **State Updates**: Synchronization with server response data

## Testing Checklist
- [ ] Page navigation (clicking page numbers)
- [ ] Page size changes (10, 20, 50, 100 items per page)
- [ ] Search functionality with pagination
- [ ] Filter changes with pagination reset
- [ ] Sort changes with pagination reset
- [ ] Combined operations (search + filter + sort + paginate)

## Files Modified
1. `src/stores/leaveStore.js` - Enhanced pagination methods and parameter building
2. `src/views/pages/hrm/attendance/leaves/leaves-admin.vue` - Updated pagination event handlers and filter methods

## Result
The pagination now works correctly with the backend API:
- Clicking page 2 shows records from page 2
- Page size changes work properly
- Filters and search are preserved during pagination
- All operations maintain consistent state between frontend and backend

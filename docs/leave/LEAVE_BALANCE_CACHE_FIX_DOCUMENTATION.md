# Leave Balance Cache Fix Documentation

## Overview
Fixed the leave balance caching issue where the available balance would show stale data after creating or updating leave requests. The problem was that the cache invalidation wasn't working properly due to field name variations and insufficient cache refresh triggers.

## Implementation Date
October 1, 2025

## Problem Description
Users reported that after adding or updating leave requests, the available balance in the modal would still show the old `remaining_days` value. The balance would only update correctly after refreshing the entire page, indicating a caching issue.

### Root Cause Analysis
1. **Field Name Variations**: The cache invalidation logic was looking for `employee_id` and `leave_type_id` but the API response sometimes used camelCase (`employeeId`, `leaveTypeId`)
2. **Incomplete Cache Invalidation**: Update operations had complex logic that didn't always invalidate cache when it should
3. **No Balance Refresh After CRUD**: The modal wasn't refreshing the balance display after successful operations

## Files Modified

### 1. `src/stores/leaveStore.js`

#### Enhanced Create Operation Cache Invalidation
**Before:**
```javascript
// Invalidate leave balance cache for this employee/leave type (balance might have changed)
if (response.data.employee_id && response.data.leave_type_id) {
    this.invalidateEmployeeLeaveCache(response.data.employee_id, response.data.leave_type_id);
}
```

**After:**
```javascript
// Invalidate leave balance cache for this employee/leave type (balance might have changed)
const employeeId = response.data.employeeId || response.data.employee_id;
const leaveTypeId = response.data.leaveTypeId || response.data.leave_type_id;

if (employeeId && leaveTypeId) {
    this.invalidateEmployeeLeaveCache(employeeId, leaveTypeId);
    console.log(`🔄 Cache invalidated for employee ${employeeId}, leave type ${leaveTypeId} after create`);
}
```

#### Simplified Update Operation Cache Invalidation
**Before:** Complex conditional logic that sometimes missed cache invalidation
**After:** Always invalidate cache for any update operation
```javascript
// Always invalidate cache for updates since any change might affect balance calculation
// (e.g., total days changed, dates changed, status changed, etc.)
const oldEmployeeId = oldRequest?.employeeId || oldRequest?.employee_id;
const oldLeaveTypeId = oldRequest?.leaveTypeId || oldRequest?.leave_type_id;
const newEmployeeId = response.data.employeeId || response.data.employee_id;
const newLeaveTypeId = response.data.leaveTypeId || response.data.leave_type_id;

// Invalidate cache for old employee/leave type combination
if (oldEmployeeId && oldLeaveTypeId) {
    this.invalidateEmployeeLeaveCache(oldEmployeeId, oldLeaveTypeId);
    console.log(`🔄 Cache invalidated for old employee ${oldEmployeeId}, leave type ${oldLeaveTypeId} after update`);
}

// Invalidate cache for new employee/leave type combination (if different)
if (newEmployeeId && newLeaveTypeId && 
    (newEmployeeId !== oldEmployeeId || newLeaveTypeId !== oldLeaveTypeId)) {
    this.invalidateEmployeeLeaveCache(newEmployeeId, newLeaveTypeId);
    console.log(`🔄 Cache invalidated for new employee ${newEmployeeId}, leave type ${newLeaveTypeId} after update`);
} else if (newEmployeeId && newLeaveTypeId) {
    // Same employee/leave type, but still invalidate since balance might have changed
    this.invalidateEmployeeLeaveCache(newEmployeeId, newLeaveTypeId);
    console.log(`🔄 Cache invalidated for employee ${newEmployeeId}, leave type ${newLeaveTypeId} after update (same employee)`);
}
```

#### Enhanced Delete Operation Cache Invalidation
**Before:**
```javascript
// Invalidate leave balance cache for this employee/leave type (balance might have changed)
if (deletedRequest && deletedRequest.employee_id && deletedRequest.leave_type_id) {
    this.invalidateEmployeeLeaveCache(deletedRequest.employee_id, deletedRequest.leave_type_id);
    console.log('🔄 Cache invalidated due to leave request deletion affecting balances');
}
```

**After:**
```javascript
// Invalidate leave balance cache for this employee/leave type (balance might have changed)
const employeeId = deletedRequest?.employeeId || deletedRequest?.employee_id;
const leaveTypeId = deletedRequest?.leaveTypeId || deletedRequest?.leave_type_id;

if (employeeId && leaveTypeId) {
    this.invalidateEmployeeLeaveCache(employeeId, leaveTypeId);
    console.log(`🔄 Cache invalidated for employee ${employeeId}, leave type ${leaveTypeId} after delete`);
}
```

### 2. `src/views/pages/hrm/attendance/leaves/leaves-admin.vue`

#### Added Balance Refresh After CRUD Operations
```javascript
// Handle leave request created/updated event from modal
const handleLeaveRequestCreated = async (leaveRequestData) => {
  console.log('📬 Received leave request created/updated event:', leaveRequestData);

  const employeeName = leaveRequestData.employee?.name ||
    `${leaveRequestData.employee?.first_name_en} ${leaveRequestData.employee?.last_name_en}`;

  showToast(`Leave request saved successfully for ${employeeName}`, 'success');

  // Refresh the leave requests table from the store
  await leaveStore.fetchLeaveRequests();

  // Force refresh the leave balance in the modal if it's still open
  if (leavesAdminModal.value && typeof leavesAdminModal.value.forceRefreshBalance === 'function') {
    await leavesAdminModal.value.forceRefreshBalance();
    console.log('🔄 Modal balance refreshed after CRUD operation');
  }

  console.log('✅ Leave requests table refreshed');
};
```

### 3. `src/components/modal/leaves-admin-modal.vue`

#### Enhanced Force Refresh Balance Method
**Before:** Simple refresh without proper cache invalidation
**After:** Comprehensive refresh with cache invalidation and better error handling
```javascript
// Force refresh leave balance using store
async forceRefreshBalance() {
  const employeeId = this.isCurrentlyEditing ? this.editFormData.employee_id : this.formData.employee_id;
  const leaveTypeId = this.isCurrentlyEditing ? this.editFormData.leave_type_id : this.formData.leave_type_id;

  console.log(`🔄 Force refreshing balance for employee ${employeeId}, leave type ${leaveTypeId}`);

  if (employeeId && leaveTypeId) {
    // Prevent duplicate API calls
    if (this.isLoadingBalance) {
      console.log('⏳ Balance refresh already in progress, skipping duplicate call');
      return;
    }

    this.isLoadingBalance = true;

    try {
      const year = new Date().getFullYear();
      
      // First invalidate the cache to ensure fresh data
      this.leaveStore.invalidateEmployeeLeaveCache(employeeId, leaveTypeId, year);
      
      // Then fetch fresh data
      const result = await this.leaveStore.getOrFetchLeaveBalance(employeeId, leaveTypeId, year);

      if (result.success && result.data) {
        let remainingDays = 0;
        if (result.data.remainingDays !== undefined) {
          remainingDays = parseFloat(result.data.remainingDays);
        } else if (result.data.remaining_days !== undefined) {
          remainingDays = parseFloat(result.data.remaining_days);
        } else if (result.data.balance !== undefined) {
          remainingDays = parseFloat(result.data.balance);
        }

        this.availableBalance = remainingDays || 0;
        this.$forceUpdate();
        console.log(`✅ Balance force refreshed: ${this.availableBalance} days (was cached: ${result.fromCache})`);
      } else {
        console.warn('⚠️ No balance data received during force refresh:', result);
      }
    } catch (error) {
      console.error('❌ Error force refreshing balance:', error);
    } finally {
      this.isLoadingBalance = false;
    }
  } else {
    console.log('⚠️ Cannot refresh balance: missing employee ID or leave type ID');
  }
}
```

#### Added Automatic Balance Refresh After Form Submission
```javascript
// Emit event to parent
this.$emit('leave-request-created', result.data);

// Force refresh balance to show updated available balance
setTimeout(async () => {
  await this.forceRefreshBalance();
}, 500);

// Close modal after delay
setTimeout(() => {
  this.safeCloseModal();
}, 1500);
```

## Key Improvements

### 1. **Robust Field Name Handling**
- Handles both camelCase (`employeeId`, `leaveTypeId`) and snake_case (`employee_id`, `leave_type_id`) field names
- Uses fallback logic: `response.data.employeeId || response.data.employee_id`

### 2. **Comprehensive Cache Invalidation**
- **Create**: Always invalidates cache after successful creation
- **Update**: Always invalidates cache for any update (simplified from complex conditional logic)
- **Delete**: Always invalidates cache after successful deletion

### 3. **Automatic Balance Refresh**
- Modal automatically refreshes balance after successful CRUD operations
- Parent component triggers modal balance refresh after receiving CRUD events
- Prevents duplicate API calls with loading state management

### 4. **Enhanced Debugging**
- Added detailed console logging for cache invalidation operations
- Logs show which employee/leave type combinations are being invalidated
- Helps track cache operations during development and debugging

### 5. **Better Error Handling**
- Force refresh method includes comprehensive error handling
- Prevents infinite loading states with proper `finally` blocks
- Warns when balance refresh cannot be performed due to missing data

## Testing Scenarios

### Before Fix:
1. ✅ Open modal, select employee and leave type → Shows correct balance (22 days)
2. ❌ Create new leave request → Balance still shows 22 days (should show updated balance)
3. ❌ Edit existing leave request → Balance doesn't update
4. ✅ Refresh page → Shows correct updated balance

### After Fix:
1. ✅ Open modal, select employee and leave type → Shows correct balance (22 days)
2. ✅ Create new leave request → Balance automatically updates to show new balance
3. ✅ Edit existing leave request → Balance updates immediately
4. ✅ Delete leave request → Balance updates to reflect deletion
5. ✅ No page refresh needed → Balance always shows current data

## Cache Strategy

### Cache Invalidation Triggers:
1. **Create Leave Request**: Invalidates cache for the employee/leave type combination
2. **Update Leave Request**: Invalidates cache for both old and new employee/leave type combinations
3. **Delete Leave Request**: Invalidates cache for the deleted request's employee/leave type combination

### Cache Refresh Strategy:
1. **Automatic**: Cache is automatically invalidated by store operations
2. **Manual**: Modal can force refresh balance using `forceRefreshBalance()` method
3. **Event-Driven**: Parent component triggers balance refresh after CRUD events

### Cache Expiration:
- Cache entries expire after 5 minutes (300,000ms)
- Force refresh always invalidates cache before fetching fresh data
- Cache keys format: `"${employeeId}-${leaveTypeId}-${year}"`

## Performance Considerations

### Optimizations:
1. **Debounced Loading**: Prevents duplicate API calls with `isLoadingBalance` flag
2. **Selective Invalidation**: Only invalidates specific employee/leave type combinations
3. **Event-Driven Updates**: Only refreshes when necessary (after CRUD operations)

### Network Efficiency:
- Cache reduces unnecessary API calls for repeated balance checks
- Force refresh only occurs after actual data changes
- Automatic refresh happens in background without blocking UI

## Future Enhancements

### Potential Improvements:
1. **Real-time Updates**: WebSocket integration for real-time balance updates
2. **Batch Invalidation**: Invalidate multiple cache entries for bulk operations
3. **Cache Warming**: Pre-load balances for commonly accessed employee/leave type combinations
4. **Cache Analytics**: Track cache hit/miss rates for optimization

### Monitoring:
- Console logs provide visibility into cache operations
- Can be extended with analytics tracking for cache performance
- Error logging helps identify cache-related issues

## Conclusion

This fix resolves the leave balance caching issue by:

1. **Ensuring Reliable Cache Invalidation**: Handles field name variations and always invalidates when needed
2. **Providing Automatic Balance Updates**: Modal shows fresh balance data after CRUD operations
3. **Improving User Experience**: No need to refresh page to see updated balances
4. **Maintaining Performance**: Efficient cache strategy with selective invalidation

The implementation is robust, well-tested, and provides a solid foundation for reliable leave balance management in the HRMS application.

---

**Document Version**: 1.0  
**Last Updated**: October 1, 2025  
**Author**: HRMS Development Team  
**Status**: ✅ Implementation Complete

# Leave Multi-Type Frontend Implementation Guide

**Version:** 2.0
**Date:** October 21, 2025
**Status:** ✅ **Data Mappers Updated** | ⏳ **UI Components Pending**

---

## Overview

This guide provides complete instructions for updating the HRMS frontend (Vue 3) to support the new multi-leave-type feature. The backend API has been updated to accept multiple leave types per request via an `items` array.

---

## What Changed in Backend API

### Before (v1.0)
```json
{
  "employee_id": 123,
  "leave_type_id": 1,
  "total_days": 5,
  "start_date": "2025-01-15",
  "end_date": "2025-01-19"
}
```

### After (v2.0)
```json
{
  "employee_id": 123,
  "start_date": "2025-01-15",
  "end_date": "2025-01-17",
  "items": [
    {"leave_type_id": 1, "days": 2},
    {"leave_type_id": 2, "days": 1.5}
  ]
}
```

**Key Changes:**
- ❌ **Removed**: `leave_type_id` field
- ❌ **Removed**: `total_days` from request body (auto-calculated)
- ✅ **Added**: `items` array (required, minimum 1 item)
- ✅ Response now includes `items` array with leave type details

---

## Implementation Progress

### ✅ Completed

1. **Data Mappers Updated** (`src/utils/leave.utils.js`)
   - ✅ `mapLeaveRequest()` - Handles incoming `items` array
   - ✅ `mapLeaveRequestForAPI()` - Converts to `items` array format
   - ✅ `validateLeaveRequest()` - Validates items array
   - ✅ Backward compatibility maintained

### ⏳ Pending

2. **UI Components** (Require Manual Updates)
   - ⏳ `src/components/modal/leaves-admin-modal.vue` - Admin form
   - ⏳ `src/components/modal/leaves-employee-modal.vue` - Employee form
   - ⏳ Leave request display components
   - ⏳ Leave request list views

---

## Step-by-Step Implementation

### Step 1: ✅ Update Data Mappers (COMPLETED)

File: `src/utils/leave.utils.js`

**Changes Made:**

1. **mapLeaveRequest()** - Parse items from backend
   ```javascript
   items: backendData.items?.map(item => ({
       id: item.id,
       leaveRequestId: item.leave_request_id,
       leaveTypeId: item.leave_type_id,
       days: parseFloat(item.days),
       leaveType: { ... }
   })) || []
   ```

2. **mapLeaveRequestForAPI()** - Convert to items array
   ```javascript
   if (frontendData.items && frontendData.items.length > 0) {
       payload.items = frontendData.items.map(item => ({
           leave_type_id: item.leaveTypeId,
           days: parseFloat(item.days)
       }));
   }
   ```

3. **validateLeaveRequest()** - Validate items array
   - Checks minimum 1 item
   - Validates each item has leave_type_id and days
   - Prevents duplicate leave types
   - Ensures days > 0

---

### Step 2: ⏳ Update Leave Request Form Modal

File: `src/components/modal/leaves-admin-modal.vue`

**Current Structure:**
```javascript
formData: {
    employee_id: null,
    leave_type_id: null,  // ❌ Single leave type
    total_days: 0,
    // ...
}
```

**Required Changes:**

#### A. Update formData Structure

```javascript
formData: {
    employee_id: null,
    start_date: null,
    end_date: null,
    reason: '',
    status: 'pending',
    // NEW: Items array for multiple leave types
    items: [
        {
            leave_type_id: null,
            days: 0
        }
    ],
    // Approval fields
    supervisor_approved: false,
    supervisor_approved_date: null,
    hr_site_admin_approved: false,
    hr_site_admin_approved_date: null,
    attachment_notes: ''
}
```

#### B. Add Item Management Methods

```javascript
methods: {
    // Add new leave type item
    addLeaveTypeItem() {
        this.formData.items.push({
            leave_type_id: null,
            days: 0
        });
    },

    // Remove leave type item
    removeLeaveTypeItem(index) {
        if (this.formData.items.length > 1) {
            this.formData.items.splice(index, 1);
            this.updateTotalDays();
        }
    },

    // Update total days from all items
    updateTotalDays() {
        const total = this.formData.items.reduce((sum, item) => {
            return sum + (parseFloat(item.days) || 0);
        }, 0);
        this.formData.total_days = total;
    },

    // Check if leave type is already selected
    isLeaveTypeSelected(leaveTypeId, currentIndex) {
        return this.formData.items.some((item, index) => {
            return index !== currentIndex && item.leave_type_id === leaveTypeId;
        });
    },

    // Get available leave types for dropdown (excluding already selected)
    getAvailableLeaveTypes(currentIndex) {
        return this.leaveTypes.filter(type => {
            return !this.isLeaveTypeSelected(type.id, currentIndex);
        });
    }
}
```

#### C. Update Watchers

```javascript
watch: {
    // Watch items array for changes
    'formData.items': {
        handler() {
            this.updateTotalDays();
        },
        deep: true
    },

    // Load balance for each item
    'formData.items': {
        handler(newItems, oldItems) {
            // Check if employee is selected
            if (this.formData.employee_id) {
                this.loadBalancesForAllItems();
            }
        },
        deep: true
    }
}
```

#### D. Update submitForm() Method

```javascript
async submitForm() {
    // Validate items
    if (!this.formData.items || this.formData.items.length === 0) {
        this.showError('Please add at least one leave type');
        return;
    }

    // Check for duplicates
    const leaveTypeIds = this.formData.items.map(item => item.leave_type_id);
    const hasDuplicates = leaveTypeIds.some((id, index) => {
        return leaveTypeIds.indexOf(id) !== index;
    });

    if (hasDuplicates) {
        this.showError('Duplicate leave types are not allowed');
        return;
    }

    // Prepare payload
    const payload = {
        employee_id: parseInt(this.formData.employee_id),
        start_date: this.formData.start_date,
        end_date: this.formData.end_date,
        reason: this.formData.reason,
        status: this.formData.status,
        items: this.formData.items.map(item => ({
            leave_type_id: parseInt(item.leave_type_id),
            days: parseFloat(item.days)
        })),
        // ... approval fields
    };

    // Submit to API
    const result = await this.leaveStore.createLeaveRequest(payload);
    // ... handle response
}
```

---

### Step 3: ⏳ Update Template/HTML

File: `src/components/modal/leaves-admin-modal.vue` (Template Section)

**Remove:**
```html
<!-- OLD: Single leave type dropdown -->
<select v-model="formData.leave_type_id">
    <option v-for="type in leaveTypes" :key="type.id" :value="type.id">
        {{ type.name }}
    </option>
</select>

<!-- OLD: Total days input -->
<input type="number" v-model="formData.total_days">
```

**Add:**
```html
<!-- NEW: Multiple Leave Types Section -->
<div class="leave-types-section">
    <label class="form-label">Leave Types <span class="text-danger">*</span></label>

    <!-- Items List -->
    <div v-for="(item, index) in formData.items" :key="index" class="leave-type-item mb-3">
        <div class="row align-items-center">
            <!-- Leave Type Dropdown -->
            <div class="col-md-6">
                <select
                    v-model="item.leave_type_id"
                    class="form-select"
                    @change="onLeaveTypeChange(index)"
                    required
                >
                    <option value="" disabled>Select Leave Type</option>
                    <option
                        v-for="type in getAvailableLeaveTypes(index)"
                        :key="type.id"
                        :value="type.id"
                    >
                        {{ type.name }}
                    </option>
                </select>
            </div>

            <!-- Days Input -->
            <div class="col-md-4">
                <input
                    type="number"
                    v-model.number="item.days"
                    class="form-control"
                    placeholder="Days"
                    min="0.5"
                    step="0.5"
                    @input="updateTotalDays"
                    required
                >
            </div>

            <!-- Remove Button -->
            <div class="col-md-2">
                <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeLeaveTypeItem(index)"
                    :disabled="formData.items.length === 1"
                >
                    <i class="ti-trash"></i>
                </button>
            </div>
        </div>

        <!-- Balance Display for this item -->
        <div v-if="item.leave_type_id && formData.employee_id" class="mt-2">
            <small class="text-muted">
                Available: {{ getBalanceForType(item.leave_type_id) }} days
            </small>
        </div>
    </div>

    <!-- Add More Button -->
    <button
        type="button"
        class="btn btn-outline-primary btn-sm"
        @click="addLeaveTypeItem"
    >
        <i class="ti-plus"></i> Add Another Leave Type
    </button>

    <!-- Total Days Display (Read-only) -->
    <div class="mt-3">
        <label class="form-label">Total Days (Auto-calculated)</label>
        <input
            type="text"
            :value="formData.total_days"
            class="form-control"
            readonly
            disabled
        >
    </div>
</div>
```

**CSS Styling:**
```scss
.leave-type-item {
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;

    &:hover {
        background-color: #e9ecef;
    }
}

.leave-types-section {
    margin-bottom: 20px;
}
```

---

### Step 4: ⏳ Update Display Components

**Files to Update:**
- Leave request list views
- Leave request detail views
- Leave request cards/badges

**Example Display Component:**

```vue
<template>
    <div class="leave-request-card">
        <div class="request-header">
            <span class="employee-name">{{ request.employee?.name }}</span>
            <span :class="statusClass">{{ request.status }}</span>
        </div>

        <!-- Display Multiple Leave Types -->
        <div class="leave-types-display mt-2">
            <div v-for="item in request.items" :key="item.id" class="leave-type-badge">
                <span class="badge bg-primary">
                    {{ item.leaveType?.name }}: {{ item.days }} days
                </span>
            </div>
        </div>

        <!-- Total Days -->
        <div class="mt-2">
            <strong>Total:</strong> {{ request.totalDays }} days
        </div>

        <!-- Dates -->
        <div class="text-muted">
            {{ formatDate(request.startDate) }} - {{ formatDate(request.endDate) }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        request: {
            type: Object,
            required: true
        }
    },
    computed: {
        statusClass() {
            const statusMap = {
                'pending': 'badge bg-warning',
                'approved': 'badge bg-success',
                'declined': 'badge bg-danger',
                'cancelled': 'badge bg-secondary'
            };
            return statusMap[this.request.status] || 'badge bg-secondary';
        }
    }
}
</script>

<style scoped>
.leave-type-badge {
    display: inline-block;
    margin-right: 8px;
    margin-bottom: 8px;
}
</style>
```

---

## Balance Validation Strategy

### Multi-Type Balance Loading

```javascript
data() {
    return {
        itemBalances: {}, // Store balance for each leave type
        isLoadingBalances: {}
    }
},

methods: {
    async loadBalancesForAllItems() {
        for (const item of this.formData.items) {
            if (item.leave_type_id && this.formData.employee_id) {
                await this.loadBalanceForItem(item.leave_type_id);
            }
        }
    },

    async loadBalanceForItem(leaveTypeId) {
        // Prevent duplicate calls
        if (this.isLoadingBalances[leaveTypeId]) return;

        this.isLoadingBalances[leaveTypeId] = true;

        try {
            const result = await this.leaveStore.getOrFetchLeaveBalance(
                this.formData.employee_id,
                leaveTypeId,
                new Date().getFullYear()
            );

            if (result.success && result.data) {
                this.$set(this.itemBalances, leaveTypeId, result.data.remainingDays || 0);
            }
        } finally {
            this.isLoadingBalances[leaveTypeId] = false;
        }
    },

    getBalanceForType(leaveTypeId) {
        return this.itemBalances[leaveTypeId] || 0;
    },

    // Check if submission would exceed balance
    validateBalances() {
        for (const item of this.formData.items) {
            const balance = this.getBalanceForType(item.leave_type_id);
            if (item.days > balance) {
                const leaveType = this.leaveTypes.find(t => t.id === item.leave_type_id);
                this.showError(`Insufficient balance for ${leaveType?.name}. Available: ${balance} days`);
                return false;
            }
        }
        return true;
    }
}
```

---

## Error Handling

### Backend Error Responses

```javascript
methods: {
    async submitForm() {
        try {
            const result = await this.leaveStore.createLeaveRequest(payload);

            if (result.success) {
                this.showSuccess('Leave request created successfully');
            }
        } catch (error) {
            // Handle specific error cases
            if (error.response?.status === 422) {
                // Validation error
                const message = error.response.data.message;

                if (message.includes('Duplicate leave types')) {
                    this.showError('You cannot select the same leave type twice');
                } else if (message.includes('Insufficient balance')) {
                    this.showError(message);
                } else {
                    this.showError('Please check your form and try again');
                }
            } else {
                this.showError('Failed to create leave request. Please try again.');
            }
        }
    }
}
```

---

## Testing Checklist

### ✅ Data Mapper Tests

- [x] Backend response with items array is correctly parsed
- [x] Items array is correctly mapped to frontend format
- [x] Backward compatibility with old single leave_type_id format
- [x] Validation prevents duplicate leave types
- [x] Validation ensures minimum 1 item

### ⏳ UI Component Tests

- [ ] Can add multiple leave type items
- [ ] Can remove leave type items (minimum 1 remains)
- [ ] Total days auto-calculates from items
- [ ] Duplicate leave types are prevented in dropdown
- [ ] Balance loads for each leave type separately
- [ ] Form submission sends items array correctly
- [ ] Error messages display for validation failures
- [ ] Success message shows correct multi-type information
- [ ] Display components show all leave types in request
- [ ] Edit mode correctly loads items from existing request

---

## Migration Path

### Phase 1: ✅ **COMPLETED** - Backend Compatibility Layer
- ✅ Data mappers updated
- ✅ Backward compatibility maintained
- ✅ Old single-type requests still work

### Phase 2: ⏳ **IN PROGRESS** - UI Updates
- ⏳ Update admin leave request modal
- ⏳ Update employee leave request modal
- ⏳ Update display components
- ⏳ Test multi-type submission
- ⏳ Test balance validation

### Phase 3: **PENDING** - Deployment
- [ ] Update staging environment
- [ ] User acceptance testing
- [ ] Deploy to production
- [ ] Monitor for issues

---

## Code Examples

### Complete submitForm() Implementation

```javascript
async submitForm() {
    // Validate items array
    if (!this.formData.items || this.formData.items.length === 0) {
        this.showError('Please add at least one leave type');
        return;
    }

    // Check for empty leave types
    const hasEmptyTypes = this.formData.items.some(item => !item.leave_type_id);
    if (hasEmptyTypes) {
        this.showError('Please select a leave type for all items');
        return;
    }

    // Check for duplicates
    const leaveTypeIds = this.formData.items.map(item => item.leave_type_id);
    const hasDuplicates = leaveTypeIds.length !== new Set(leaveTypeIds).size;
    if (hasDuplicates) {
        this.showError('You cannot select the same leave type multiple times');
        return;
    }

    // Validate balances
    if (!this.validateBalances()) {
        return;
    }

    this.isLoading = true;

    try {
        const payload = {
            employee_id: parseInt(this.formData.employee_id),
            start_date: this.formData.start_date,
            end_date: this.formData.end_date,
            reason: this.formData.reason,
            status: this.formData.status,
            items: this.formData.items.map(item => ({
                leave_type_id: parseInt(item.leave_type_id),
                days: parseFloat(item.days)
            })),
            supervisor_approved: this.formData.supervisor_approved || false,
            supervisor_approved_date: this.formData.supervisor_approved_date || null,
            hr_site_admin_approved: this.formData.hr_site_admin_approved || false,
            hr_site_admin_approved_date: this.formData.hr_site_admin_approved_date || null,
            attachment_notes: this.formData.attachment_notes || null
        };

        console.log('📤 Submitting leave request:', payload);

        const result = await this.leaveStore.createLeaveRequest(payload);

        if (result.success) {
            const leaveTypeNames = result.data.items.map(item => item.leaveType?.name).join(', ');
            this.showSuccess(`Leave request created successfully!\n\nLeave Types: ${leaveTypeNames}\nTotal Days: ${result.data.totalDays}`);

            // Emit event and close modal
            this.$emit('leave-request-created', result.data);
            setTimeout(() => this.safeCloseModal(), 1500);
        }
    } catch (error) {
        console.error('Error creating leave request:', error);
        this.showError(error.response?.data?.message || 'Failed to create leave request');
    } finally {
        this.isLoading = false;
    }
}
```

---

## Troubleshooting

### Common Issues

**Issue 1:** "Items field is required" error
- **Solution:** Ensure `items` array is being sent in payload
- **Check:** `mapLeaveRequestForAPI()` is converting data correctly

**Issue 2:** Total days not updating
- **Solution:** Add watcher on `formData.items` with `deep: true`
- **Check:** `updateTotalDays()` is being called on item changes

**Issue 3:** Duplicate leave types allowed
- **Solution:** Implement `getAvailableLeaveTypes()` to filter dropdown
- **Check:** Validation in `submitForm()` before API call

**Issue 4:** Balance not loading for all items
- **Solution:** Implement `loadBalancesForAllItems()` with proper loop
- **Check:** Store is being called for each unique leave_type_id

---

## Summary of Changes

### Files Modified

1. ✅ **`src/utils/leave.utils.js`**
   - Updated `mapLeaveRequest()` to parse `items` array
   - Updated `mapLeaveRequestForAPI()` to send `items` array
   - Updated `validateLeaveRequest()` for items validation

2. ⏳ **`src/components/modal/leaves-admin-modal.vue`** (Pending)
   - Update formData structure with `items` array
   - Add item management methods
   - Update template with multi-type UI
   - Update balance loading logic

3. ⏳ **Display Components** (Pending)
   - Update to show items array
   - Display all leave types with individual days
   - Show total days as sum

---

## Next Steps

1. **Update `leaves-admin-modal.vue`**
   - Implement items array in formData
   - Add UI for adding/removing items
   - Update submit method

2. **Update `leaves-employee-modal.vue`**
   - Apply same changes as admin modal
   - Test employee submission flow

3. **Update Display Components**
   - Show items in list views
   - Show items in detail views
   - Update badges/chips

4. **Test Integration**
   - Test multi-type creation
   - Test balance validation
   - Test edit functionality
   - Test backward compatibility

---

**Implementation Status:** 🟡 **Partial** (Data mappers complete, UI pending)

**Next Required Action:** Update Vue components to use new items array structure

---

**End of Guide**

For questions or assistance, refer to the backend documentation:
- `MULTI_LEAVE_TYPE_IMPLEMENTATION.md`
- `SWAGGER_API_UPDATES.md`

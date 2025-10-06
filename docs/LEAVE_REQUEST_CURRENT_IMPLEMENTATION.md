# Leave Request System - Current Implementation

**Version:** 4.1  
**Date:** October 4, 2025  
**Status:** ✅ Production Ready  

## Overview

This document describes the current implementation of the Leave Request system in the HRMS frontend, including recent updates to align with the Travel Request backend API pattern.

---

## System Architecture

### Core Components

1. **Leave Request List** (`src/views/pages/hrm/attendance/leaves/leaves-admin.vue`)
2. **Leave Request Modal** (`src/components/modal/leaves-admin-modal.vue`)
3. **Leave Service** (`src/services/leave.service.js`)
4. **Leave Store** (`src/stores/leaveStore.js`)
5. **Leave Utils** (`src/utils/leave.utils.js`)

---

## Current Data Structure

### Leave Request Object (Frontend)

```javascript
{
  id: 1,
  employeeId: 1,
  employee: {
    id: 1,
    staffId: "EMP001",
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    subsidiary: "SMRU",
    department: "IT",
    position: "Developer"
  },
  leaveTypeId: 2,
  leaveType: {
    id: 2,
    name: "Annual Leave",
    requiresAttachment: false,
    defaultDuration: 5
  },
  startDate: "2025-04-01",
  endDate: "2025-04-05",
  totalDays: 5,
  reason: "Family vacation",
  status: "pending",
  
  // Current Approval Structure (v4.1)
  supervisorApproved: true,
  supervisorApprovedDate: "2025-03-15",
  hrSiteAdminApproved: false,
  hrSiteAdminApprovedDate: null,
  
  attachmentNotes: "Medical certificate attached",
  createdAt: "2025-03-10T10:00:00Z",
  updatedAt: "2025-03-15T14:30:00Z"
}
```

### API Payload Structure (Backend)

```javascript
{
  employee_id: 1,
  leave_type_id: 2,
  start_date: "2025-04-01",
  end_date: "2025-04-05",
  total_days: 5,
  reason: "Family vacation",
  status: "pending",
  
  // Current Approval Structure (v4.1)
  supervisor_approved: true,
  supervisor_approved_date: "2025-03-15",
  hr_site_admin_approved: false,
  hr_site_admin_approved_date: null,
  
  attachment_notes: "Medical certificate attached"
}
```

---

## Recent Updates (v4.1)

### What Changed

#### 1. Approval Field Consolidation
**Before (v4.0):**
```javascript
// Separate HR and Site Admin fields
hrApproved: boolean,
hrApprovedDate: date,
siteAdminApproved: boolean,
siteAdminApprovedDate: date
```

**After (v4.1):**
```javascript
// Combined HR/Site Admin field
hrSiteAdminApproved: boolean,
hrSiteAdminApprovedDate: date
```

#### 2. Removed Fields
- ❌ `hrApproved` + `hrApprovedDate`
- ❌ `siteAdminApproved` + `siteAdminApprovedDate`
- ❌ Any signature-related boolean fields

#### 3. Files Updated

**Data Mapper (`src/utils/leave.utils.js`):**
- Updated `mapLeaveRequest()` function
- Updated `mapLeaveRequestForAPI()` function
- Added v4.1 comments for clarity

**Modal Component (`src/components/modal/leaves-admin-modal.vue`):**
- Updated `formData` and `editFormData` objects
- Modified approval section in Add Leave modal
- Modified approval section in Edit Leave modal
- Updated form submission payload
- Updated form reset methods

**List Component (`src/views/pages/hrm/attendance/leaves/leaves-admin.vue`):**
- Updated approvals column template
- Changed from separate HR/Site Admin entries to combined display
- Added column widths for better table layout

---

## Current Features

### 1. Leave Request Management

#### Create Leave Request
- Employee selection with search functionality
- Leave type selection from dropdown
- Date range picker with validation
- Automatic total days calculation
- Leave balance checking
- Approval status setting
- Attachment notes

#### Edit Leave Request
- Pre-populated form with existing data
- Same validation as create
- Maintains employee selection (read-only in edit)
- Updates approval status and dates

#### Delete Leave Request
- Confirmation dialog
- Soft delete with success notification
- Automatic list refresh

### 2. Leave Request List

#### Display Features
- Paginated table with Ant Design components
- Employee information with avatar
- Leave type with info tooltip
- Date range display
- Total days badge
- Status badges with color coding
- Approval status indicators
- Attachment notes display
- Action buttons (Edit/Delete)

#### Filtering & Search
- Employee search by Staff ID or name
- Leave type filtering
- Status filtering
- Date range filtering
- Sort by multiple fields
- Clear filters functionality

#### Statistics Cards
- Total requests count
- Approved requests with percentage
- Pending requests with percentage
- Declined requests with percentage

### 3. Approval System

#### Current Approval Levels
1. **Supervisor Approval**
   - Boolean flag: `supervisorApproved`
   - Date field: `supervisorApprovedDate`
   - Icon: User check (green)

2. **HR/Site Admin Approval** (Combined)
   - Boolean flag: `hrSiteAdminApproved`
   - Date field: `hrSiteAdminApprovedDate`
   - Icon: Shield check (blue)

#### Approval Display
- Shows approved items with dates
- "No approvals recorded" when none exist
- Color-coded icons for different approval types

---

## Form Validation

### Required Fields
- Employee selection
- Leave type selection
- Start date
- End date
- Total days (auto-calculated)

### Validation Rules
- End date must be after start date
- Total days must be greater than 0
- Leave balance checking (if available)
- Attachment notes required for certain leave types
- Date format validation
- Character limits on text fields

### Error Handling
- Field-level validation with error messages
- Form submission error handling
- API error display
- Loading states during operations

---

## Data Flow

### 1. Create Flow
```
User Input → Form Validation → Data Mapping → API Call → Store Update → UI Refresh
```

### 2. Edit Flow
```
Select Record → Populate Form → User Changes → Validation → API Update → Store Update → UI Refresh
```

### 3. Delete Flow
```
Select Record → Confirmation Dialog → API Delete → Store Update → UI Refresh
```

### 4. List Flow
```
Page Load → API Fetch → Data Mapping → Store Update → Table Render
```

---

## API Integration

### Endpoints Used
- `GET /api/v1/leaves/requests` - List with pagination/filtering
- `POST /api/v1/leaves/requests` - Create new request
- `PUT /api/v1/leaves/requests/{id}` - Update existing request
- `DELETE /api/v1/leaves/requests/{id}` - Delete request
- `GET /api/v1/leaves/balance/{employeeId}/{leaveTypeId}` - Get balance

### Request/Response Handling
- Automatic camelCase ↔ snake_case conversion
- Error response mapping
- Loading state management
- Success/error notifications
- Cache management for leave balances

---

## UI Components

### Modal Forms
- **Add Leave Modal** (`#add_leaves`)
  - Employee search with dropdown
  - Leave type selection
  - Date pickers with validation
  - Approval checkboxes and dates
  - Attachment notes textarea

- **Edit Leave Modal** (`#edit_leaves`)
  - Same fields as Add modal
  - Employee field is read-only
  - Pre-populated with existing data

### Table Features
- **Ant Design Table** with fixed columns
- **Row selection** with checkboxes
- **Pagination** with size options
- **Sorting** on multiple columns
- **Filtering** with dropdown menus
- **Search** with loading states

### Statistics Cards
- **Bootstrap cards** with hover effects
- **Color-coded icons** for different metrics
- **Percentage calculations** with badges
- **Responsive design** for mobile

---

## State Management

### Pinia Store (`useLeaveStore`)

#### State Properties
```javascript
{
  leaveRequests: [],           // Current page data
  currentLeaveRequest: null,   // Selected for editing
  statistics: {},              // Dashboard stats
  leaveTypes: [],             // Dropdown options
  leaveBalanceCache: Map(),   // Employee balance cache
  loading: false,             // Loading states
  currentPage: 1,             // Pagination
  pageSize: 10,               // Items per page
  total: 0,                   // Total records
  filteredInfo: {},           // Applied filters
  sortedInfo: {},             // Applied sorting
  searchStaffId: '',          // Search query
  dateRange: null             // Date filter
}
```

#### Key Actions
- `fetchLeaveRequests()` - Load paginated data
- `createLeaveRequest()` - Create new request
- `updateLeaveRequest()` - Update existing request
- `deleteLeaveRequest()` - Delete request
- `getOrFetchLeaveBalance()` - Get cached or fetch balance
- `setFilters()`, `setSorting()` - Update filters/sorting

---

## Performance Optimizations

### Caching
- **Leave balance caching** (5-minute expiry)
- **Leave types caching** (24-hour expiry)
- **Request deduplication** for simultaneous calls

### UI Optimizations
- **Virtual scrolling** for large tables
- **Debounced search** to reduce API calls
- **Loading states** for better UX
- **Optimistic updates** where appropriate

### Memory Management
- **Cache invalidation** after CRUD operations
- **Component cleanup** on unmount
- **Event listener cleanup**

---

## Error Handling

### Validation Errors
- Field-level validation with immediate feedback
- Form submission blocking on validation errors
- Clear error messages with field highlighting

### API Errors
- Network error handling with retry options
- Server error display with user-friendly messages
- Timeout handling with appropriate feedback

### UI Error States
- Empty state when no data
- Error state with retry actions
- Loading state indicators

---

## Testing Considerations

### Unit Testing
- Form validation logic
- Data mapping functions
- Store actions and mutations
- Utility functions

### Integration Testing
- API service calls
- Store integration
- Component interactions
- Form submission flows

### E2E Testing
- Complete CRUD workflows
- Filter and search functionality
- Pagination and sorting
- Error scenarios

---

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features Used
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Fetch API for HTTP requests
- Local Storage for caching

---

## Security Considerations

### Data Protection
- Input sanitization
- XSS prevention
- CSRF token handling (if implemented)
- Secure API communication

### Access Control
- Role-based field visibility
- Action permissions
- Route guards (if implemented)

---

## Future Enhancements

### Planned Features
- Bulk operations (approve/reject multiple)
- Advanced reporting
- Email notifications
- Mobile app support
- Offline capability

### Technical Improvements
- GraphQL migration
- Real-time updates with WebSockets
- Enhanced caching strategies
- Performance monitoring

---

## Troubleshooting

### Common Issues

1. **Leave balance not loading**
   - Check employee and leave type selection
   - Verify API endpoint availability
   - Clear cache and retry

2. **Form validation errors**
   - Ensure all required fields are filled
   - Check date format and ranges
   - Verify leave balance availability

3. **Table not updating after CRUD operations**
   - Check store state updates
   - Verify API response handling
   - Refresh page if needed

### Debug Tools
- Vue DevTools for component inspection
- Network tab for API monitoring
- Console logs for error tracking
- Store state inspection

---

## Documentation References

- [Leave Management Quick Reference](./LEAVE_MANAGEMENT_QUICK_REFERENCE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Component Library Guide](./COMPONENT_LIBRARY_GUIDE.md)
- [State Management Patterns](./STATE_MANAGEMENT_PATTERNS.md)

---

**Last Updated:** October 4, 2025  
**Version:** 4.1  
**Status:** ✅ Production Ready

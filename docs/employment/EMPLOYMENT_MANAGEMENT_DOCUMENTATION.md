# Employment Management System - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Components](#components)
5. [Data Flow](#data-flow)
6. [API Integration](#api-integration)
7. [Performance Optimizations](#performance-optimizations)
8. [User Interface](#user-interface)
9. [Form Validation](#form-validation)
10. [Funding Allocation System](#funding-allocation-system)
11. [Technical Implementation](#technical-implementation)
12. [Usage Guide](#usage-guide)

---

## System Overview

The Employment Management System is a comprehensive solution for managing employee employment records, including their positions, salaries, benefits, and funding allocations. The system is built using Vue 3 with Ant Design Vue components and follows modern frontend best practices.

### Key Capabilities
- **Employment CRUD Operations**: Create, Read, Update, Delete employment records
- **Advanced Search & Filtering**: Search by staff ID with multi-field filtering
- **Funding Allocation Management**: Split employee costs across multiple grants/positions
- **Benefits Management**: Track health welfare, PVD, and saving fund benefits
- **Real-time Validation**: Client-side and server-side validation
- **Draft Persistence**: Auto-save form progress with restoration capability
- **Performance Optimized**: Virtual scrolling, lazy loading, and caching

---

## Architecture

### Component Structure

```
employment-management/
├── views/
│   └── pages/
│       └── hrm/
│           └── employment/
│               └── employment-list.vue (Main list page)
├── components/
│   └── modal/
│       ├── employment-modal.vue (Create modal)
│       └── employment-edit-modal.vue (Edit modal - referenced)
├── services/
│   └── employment.service.js (API service layer)
└── stores/
    ├── sharedDataStore.js (Shared data management)
    ├── lookupStore.js (Lookup data)
    └── formPersistenceStore.js (Form draft storage)
```

### Technology Stack

- **Frontend Framework**: Vue 3 (Composition API + Options API)
- **UI Components**: Ant Design Vue
- **State Management**: Pinia stores
- **Date Handling**: Moment.js + vue-datepicker-next
- **HTTP Client**: Axios (via BaseService)
- **Performance**: Custom utilities (memoization, debouncing, virtual scrolling)

---

## Features

### 1. Employment List Management

#### Features:
- **Paginated Table Display**: Server-side pagination with customizable page sizes (10, 20, 50, 100)
- **Virtual Scrolling**: Optimized rendering for large datasets (600px viewport)
- **Advanced Filtering**:
  - Organization (SMRU, BHF)
  - Employment Type (Full-Time, Part-Time, Contract, etc.)
  - Status (Active, Pending, Expired)
- **Multi-field Sorting**: Server-side sorting on all columns
- **Staff ID Search**: Quick search functionality with debouncing
- **Status Calculation**: Dynamic status based on start/end dates
- **Bulk Operations**: Clear filters, clear all (filters + sorters)

#### Table Columns:
1. Organization (badge display)
2. Staff ID
3. Employee Name
4. Employment Type
5. Department
6. Position
7. Work Location
8. Start Date
9. End Date
10. Probation Pass Date
11. Salary (formatted currency)
12. Probation Salary (formatted currency)
13. Status (badge with color coding)
14. Actions (Edit, Delete)

### 2. Employment Creation (employment-modal.vue)

#### Core Features:
- **Employee Selection**: Custom tree-select dropdown with search
  - Grouped by organization
  - Virtual scrolling for performance
  - Load more functionality
  - Search by name or staff ID
- **Employment Details**:
  - Employment Type (from lookup)
  - Pay Method (Transferred to bank, Cash cheque)
  - Department & Position (cascading dropdowns)
  - Section Department (optional)
  - Work Location (required)
- **Date Management**:
  - Start Date (required) - triggers auto-calculation
  - End Date (optional)
  - Probation Pass Date - auto-calculated (3 months from start date)
- **Salary Information**:
  - Position Salary (required)
  - Probation Salary (optional)
- **Benefits Management**:
  - Health & Welfare (checkbox + percentage)
  - Saving Fund (checkbox + percentage)
  - PVD (checkbox + percentage)
  - Auto-selection based on employment type
- **Funding Allocation System** (detailed below)

#### Form Persistence:
- **Auto-save Draft**: Debounced form state saving (1 second)
- **Draft Restoration**: Automatic restoration on modal reopen
- **24-hour Expiry**: Old drafts automatically cleaned
- **Unsaved Changes Dialog**: Single-tier Ant Design confirm modal
- **Restoration Notification**: Shows when draft is restored with timestamp

### 3. Funding Allocation System

The funding allocation system is the most complex feature, allowing employees to be split across multiple funding sources.

#### Allocation Types:

##### A. Grant-Funded Allocation
- **Grant Selection**: Choose from available grants
- **Grant Position**: Select position within the grant
- **Position Slot**: Choose specific budget line slot
- **FTE Percentage**: Define percentage of time (0-100%)
- **Calculated Salary**: Auto-calculated based on FTE

##### B. Organization-Funded Allocation
- **Grant Selection**: Special hub grant codes (S0031, S22001)
- **Department**: Select department
- **Position**: Select position within department
- **FTE Percentage**: Define percentage of time (0-100%)
- **Calculated Salary**: Auto-calculated based on FTE

#### Allocation Rules:
1. **Total FTE Must Equal 100%**: Validation ensures complete allocation
2. **No Duplicate Allocations**: 
   - Grant-funded: Unique position slot per employee
   - Org-funded: Unique grant + department + position combination
3. **Dynamic Salary Calculation**: 
   - Formula: `(Position Salary × FTE) / 100`
   - Real-time updates as FTE changes
4. **Multiple Allocations**: Support for multiple funding sources per employee

#### Allocation Table Display:
- Allocation Type badge (color-coded)
- Grant name and code
- Department (org-funded only)
- Position (org-funded only)
- Grant Position (grant-funded only)
- Position Slot (grant-funded only)
- FTE Percentage
- Allocated Salary (calculated)
- Edit/Delete actions
- Inline editing capability

#### Summary Display:
- Total FTE (warns if ≠ 100%)
- Total Allocated Salary
- Position Salary (for comparison)

---

## Components

### employment-list.vue

**Purpose**: Main listing page for employment records with search, filter, and management capabilities.

#### Key Responsibilities:
1. Fetch and display paginated employment data
2. Handle search, filtering, and sorting
3. Manage modal lifecycle (lazy loading)
4. Calculate employment status dynamically
5. Handle CRUD operations

#### State Management:
```javascript
{
  employments: shallowRef([]),      // Main data array
  loading: false,                    // Global loading state
  searchLoading: false,              // Search-specific loading
  currentPage: 1,                    // Current page number
  pageSize: 10,                      // Items per page
  total: 0,                          // Total items count
  filteredInfo: {},                  // Active filters
  sortedInfo: {},                    // Active sorting
  editingEmploymentId: null,         // Loading state for edit button
  isEmploymentModalMounted: false,   // Create modal mount state
  isEditModalMounted: false,         // Edit modal mount state
  openingAddModal: false,            // Create button loading state
  statusCache: WeakMap,              // Performance cache
  displayCache: Map,                 // Performance cache
}
```

#### Key Methods:

##### Data Fetching:
```javascript
async fetchEmployments(params = {})
```
- Fetches paginated employment data from API
- Handles query parameters (page, per_page, filters, sorting)
- Updates pagination metadata
- Implements Object.freeze for performance
- Clear caches on new data

##### Search:
```javascript
async handleStaffIdSearch()
```
- Validates search input
- Debounced search execution
- Displays employee summary
- Shows search statistics
- Handles empty results gracefully

##### Filtering & Sorting:
```javascript
handleTableChange(pagination, filters, sorter)
```
- Debounced (300ms) to prevent excessive API calls
- Updates filteredInfo and sortedInfo state
- Resets to page 1 on filter/sort change
- Clears caches for fresh rendering
- Maps frontend fields to backend fields

##### Status Calculation:
```javascript
calculateEmploymentStatus(startDate, endDate)
```
- **Pending**: Start date in future
- **Active**: Currently employed (start date passed, no end date or end date not reached)
- **Expired**: End date in past
- Cached using WeakMap for performance

##### Modal Management:
```javascript
async openAddEmploymentModal()
async openEditEmploymentModal(record)
```
- **Lazy Loading**: Only mount component when needed
- **Preloading**: Load component chunk on hover
- **Loading States**: Visual feedback during loading
- **Error Handling**: Graceful degradation
- **Unmounting**: Free memory when modal closes

##### Pagination:
```javascript
handlePaginationChange(page, pageSize)
handleSizeChange(current, size)
buildApiParams(baseParams = {})
```
- Preserves filters and sorting across page changes
- Updates URL parameters
- Maintains user's view state

#### Performance Optimizations:

1. **Shallow Refs**: Prevent deep reactivity on large arrays
2. **Object.freeze**: Immutable data prevents Vue reactivity overhead
3. **WeakMap Cache**: Automatic garbage collection for status cache
4. **Display Cache**: Memoized table data transformation
5. **Debouncing**: Search (300ms), filter changes (300ms)
6. **Virtual Scrolling**: Ant Design table virtualization
7. **Lazy Modal Loading**: Async component imports
8. **Component Unmounting**: Free memory when modals close
9. **v-memo**: Optimize repeated renders in action column

### employment-modal.vue

**Purpose**: Create new employment records with comprehensive data collection and funding allocation.

#### Key Features:

##### 1. Data Loading Strategy:
```javascript
async loadInitialData()
```
- **First Open Only**: Data loaded once and cached
- **Shared Store Integration**: Reuses cached data across components
- **Parallel Loading**: Promise.all for concurrent API calls
- **Force Refresh**: Grant structure refreshed to ensure latest data
- **Loading States**: Shows spinners for different loading phases

**Data Sources**:
- Employees (tree structure by organization)
- Departments
- Positions
- Work Locations
- Grant Options
- Grant Positions
- Employment Types (lookup)
- Section Departments (lookup)
- Pay Methods (hardcoded)

##### 2. Employee Selection (Custom Tree Select):

**Implementation**:
```javascript
// Custom dropdown with virtual scrolling
{
  showEmployeeDropdown: false,
  employeeSearchTerm: '',
  filteredEmployeeTree: [],
  visibleEmployeeCount: 20,
  loadedEmployeeCounts: Map
}
```

**Features**:
- **Hierarchical Display**: Grouped by organization
- **Search Functionality**: Filter by name or staff ID
- **Virtual Scrolling**: Load 20 employees initially
- **Load More**: Button to load additional employees
- **Auto-expand**: Subsidiaries expand on search results
- **Employee Info Card**: Shows selected employee details with status badge
- **Click Outside**: Closes dropdown

**Employee Info Display**:
- Full name
- Organization
- Status badge (color-coded by type)
- Staff ID

##### 3. Department & Position Cascading:

**Main Employment**:
```javascript
async onDepartmentChange()
```
- Clears position selection
- Fetches positions for selected department
- Shows loading state
- Uses sharedDataStore for caching

**Allocation (Org-Funded)**:
```javascript
async onAllocationDepartmentChange()
```
- Separate department/position selection
- Independent of main employment
- Maintains separate loading state

##### 4. Date Management:

**Computed Properties with Improved Reactivity**:
```javascript
computedStartDate: {
  get() { return this.formData.start_date; },
  set(value) {
    this.formData.start_date = this.safeConvertToDate(value);
    this.debouncedSaveState();
  }
}
```

**Auto-calculation**:
```javascript
handleStartDateChange(newValue)
```
- Sets start date
- Auto-calculates probation pass date (+3 months)
- Triggers form state save

**Safe Conversion**:
```javascript
safeConvertToDate(dateValue)
```
- Handles Date objects
- Handles ISO strings
- Handles timestamp numbers
- Returns null for invalid dates
- Error handling for edge cases

##### 5. Benefits Auto-selection:

**By Employee Status**:
```javascript
autoSelectBenefitsBasedOnStatus(status)
```
- **Local ID/Local ID Staff**: Auto-select PVD
- **Local non ID/Local non ID Staff**: Auto-select Saving Fund
- **Others (Expats, etc.)**: No auto-selection
- Saves form state after selection

**By Employment Type**:
```javascript
autoSelectBenefitsBasedOnType(employmentType)
```
- Similar logic to status-based selection
- Triggered on employment type change

##### 6. Funding Allocation Management:

**Grant Selection**:
```javascript
async onGrantChange()
```
- Determines allocation type (org_funded vs grant)
- Loads appropriate dropdown options
- Clears conflicting fields
- Updates grantPositionOptions or departmentPositions

**Grant Position Selection**:
```javascript
onGrantPositionChange()
```
- Loads position slots for selected grant position
- Includes budget line code information
- Clears allocation errors

**FTE Management**:
```javascript
onFteChange()
```
- Auto-saves form state
- **Note**: Frontend does NOT calculate `allocated_amount` - this is handled by the backend
- Display shows estimated calculation only for user preview
- Actual allocation amounts are calculated by backend using standardized 30-day month logic

**Adding Allocation**:
```javascript
addAllocation()
```
1. Validates current allocation
2. Checks for duplicate allocations
3. Validates total FTE doesn't exceed 100%
4. Adds to fundingAllocations array
5. Resets allocation form
6. Saves form state

**Editing Allocation**:
```javascript
editAllocation(index)
saveEdit()
cancelEdit()
```
- Inline editing in table
- Maintains separate editData state
- Reloads related dropdowns for edit context
- Validates before saving

**Validation**:
```javascript
validateCurrentAllocation()
```
- Checks allocation type requirements
- Validates grant selection
- Validates department/position (org-funded)
- Validates grant position/slot (grant-funded)
- Validates FTE range (0-100)

**Display Helpers**:
```javascript
getGrantName(grantId, originalData)
getDepartmentName(id, originalData)
getPositionName(id, originalData)
getGrantPositionName(grantId, positionId, originalData)
getPositionSlotName(grantId, positionId, slotId, originalData)
```
- Fallback to originalData from API
- Lookup in current options arrays
- Returns "Unknown" if not found
- Handles null/undefined gracefully

##### 7. Form Validation:

**Complete Form Validation**:
```javascript
validateForm()
```
- **Cached Validation**: Reuses results within 500ms
- **Batch Validation**: Checks all required fields
- **Required Fields**:
  - employee_id
  - employment_type
  - department_id
  - position_id
  - work_location_id
  - start_date
  - position_salary
- **Funding Validation**:
  - At least one allocation required
  - Total FTE must equal 100%
- **Performance**: Cached with cacheKey using JSON.stringify

**Real-time Validation**:
- Field-level validation on blur
- Inline error messages
- Red border on invalid fields
- Alert messages for form-level errors

##### 8. Form Persistence:

**Auto-save**:
```javascript
saveFormState()
```
- Debounced (1 second)
- Saves to formPersistenceStore
- Converts dates to ISO strings
- Includes all form data and allocations
- Timestamped for expiry checking

**Load Draft**:
```javascript
loadFormDraft()
```
- Checks for saved data
- Validates 24-hour expiry
- Restores form data
- Converts ISO strings back to Date objects
- Restores related dropdowns
- Shows restoration notification

**Clear Draft**:
```javascript
clearFormDraft()
```
- Removes from store
- Called on successful submission
- Called on draft expiry

##### 9. Modal Lifecycle:

**Opening Modal**:
```javascript
async openModal()
```
1. Set modal visibility flag
2. Load initial data (first time only)
3. Check for draft
4. Load draft or reset form
5. Set draft mode
6. Show modal using Bootstrap Modal API

**Closing Modal**:
```javascript
async handleModalClose()
```
- Checks for unsaved changes
- Shows confirmation dialog if needed
- Single-tier Ant Design Modal.confirm
- Options: Continue Editing or Discard Changes

**Unsaved Changes Dialog**:
```javascript
showUnsavedChangesConfirm()
```
- Custom styled Ant Design confirm
- Clear messaging
- Two options:
  - **Continue Editing** (OK button - default)
  - **Discard Changes** (Cancel button - danger)
- Non-dismissible (no mask/keyboard close)

**Discard Changes**:
```javascript
async discardChangesAndClose()
```
1. Clear saved draft
2. Reset form
3. Close modal safely
4. Log action

##### 10. Form Submission:

**Submit Handler**:
```javascript
async handleSubmit()
```
1. Validate complete form
2. Build API payload
3. Call employmentService.createEmployment()
4. Handle success:
   - Clear draft
   - Reset form
   - Show success message
   - Close modal after 2.2 seconds
   - Emit event to parent
5. Handle errors:
   - Field validation errors (422)
   - Business logic errors
   - Network errors
   - Display appropriate messages

**Payload Builder**:
```javascript
buildPayloadForAPI()
```
**Employment Data**:
- employee_id
- employment_type
- pay_method
- start_date (formatted YYYY-MM-DD)
- end_date (formatted YYYY-MM-DD)
- pass_probation_date (formatted YYYY-MM-DD) ← **Updated field name**
- department_id
- position_id
- section_department
- work_location_id
- pass_probation_salary ← **Updated field name**
- probation_salary
- health_welfare (boolean)
- health_welfare_percentage
- pvd (boolean)
- pvd_percentage
- saving_fund (boolean)
- saving_fund_percentage

**Allocations Array**:
Each allocation includes:
- allocation_type ('grant' or 'org_funded')
- For grant: position_slot_id, fte ← **NO allocated_amount (backend calculates)**
- For org_funded: grant_id, department_id, position_id, fte ← **NO allocated_amount (backend calculates)**

**⚠️ Important**: 
- `allocated_amount` is **NOT** sent in the payload
- Backend automatically calculates using `pass_probation_salary` and FTE
- Backend uses standardized 30-day month for probation salary calculations

**Date Formatting**:
```javascript
formatDateForAPI(date)
```
- Handles Date objects
- Handles existing YYYY-MM-DD strings
- Returns null for invalid dates
- Ensures consistent format

##### 11. Performance Optimizations:

**Memoization**:
```javascript
// Created in component lifecycle
this.memoizedCalculateStatus = memoize(this.calculateEmploymentStatus, 100);
this.memoizedFormatCurrency = memoize(this.formatCurrency, 50);
this.memoizedValidation = memoize(this.validateAllocationInternal, 20);
```

**Debouncing**:
```javascript
this.debouncedSaveState = debounce(this.saveFormState, 1000);
```

**Virtual Scrolling** (Employee Dropdown):
```javascript
{
  visibleEmployeeCount: 20,
  loadedEmployeeCounts: Map,
  
  getVisibleEmployees(employees),
  hasMoreEmployees(employees),
  loadMoreEmployees(organizationKey),
  handleDropdownScroll(event)
}
```

**Shallow Refs**:
```javascript
employees: shallowRef([]),
employeeTreeData: shallowRef([]),
departments: shallowRef([]),
grantOptions: shallowRef([]),
```

**Performance Cleanup**:
```javascript
cleanup: new PerformanceCleanup()
```
- Tracks event listeners
- Tracks observers
- Cleans up on unmount
- Prevents memory leaks

**Caching**:
```javascript
validationCache: Map,
displayCache: Map,
statusCache: WeakMap
```

**Performance Monitoring**:
```javascript
setupPerformanceMonitoring()
```
- IntersectionObserver for visibility tracking
- PerformanceObserver for long tasks detection
- Logs warnings for tasks > 50ms

##### 12. Component Lifecycle:

**Created**:
```javascript
async created()
```
- Initialize memoized functions
- Create debounced save function
- Mark component as ready
- Don't load data (wait for modal open)

**Mounted**:
```javascript
mounted()
```
- Initialize Bootstrap modal instance
- Setup event listeners with cleanup tracking
- Add click outside listener
- Setup performance monitoring

**Before Unmount**:
```javascript
beforeUnmount()
```
- Mark component as destroyed
- Comprehensive cleanup
- Clear caches
- Clear memoized functions
- Clear debounced functions
- Dispose modal instance
- Remove event listeners
- Clean up backdrops

---

### employment-edit-modal.vue

**Purpose**: Edit existing employment records with full data update and allocation management capabilities.

#### Key Differences from Create Modal:

1. **Pre-populated Data**: Loads existing employment data from API
2. **No Draft Persistence**: Edit mode doesn't use form drafts (data comes from backend)
3. **Backend Calculation Display**: Shows backend-calculated `allocated_amount` from API
4. **Allocation Loading**: Fetches existing funding allocations via separate endpoint

#### Data Loading:

**Initial Employment Data**:
```javascript
watch: {
  employmentData: {
    handler(newVal) {
      // Populate form with employment data
      this.formData = { ...newVal };
      
      // Convert dates to Date objects for date-picker
      this.formData.start_date = new Date(this.formData.start_date);
      this.formData.pass_probation_date = new Date(this.formData.pass_probation_date);
      
      // Load existing funding allocations
      this.loadEmployeeFundingAllocations(newVal.id);
    }
  }
}
```

**Funding Allocations**:
```javascript
async loadEmployeeFundingAllocations(employmentId)
```
- Calls `GET /api/employments/{id}/funding-allocations`
- Maps API response to internal format
- Stores backend-calculated values in `_original` object:
  - `allocated_amount`: Backend-calculated amount (numeric)
  - `formatted_allocated_amount`: Formatted currency string (e.g., "฿20,000")
  - `fte`: Converted from decimal (0-1) to percentage (0-100)

#### Backend Calculation Integration:

**Total Allocated Salary** (Computed Property):
```javascript
totalAllocatedSalary() {
  // ✅ Uses backend-calculated values
  return this.fundingAllocations.reduce((sum, allocation) => {
    const allocatedAmount = allocation._original?.allocated_amount || 0;
    return sum + parseFloat(allocatedAmount);
  }, 0);
}
```

**Allocation Display**:
```javascript
getAllocatedSalary(allocation) {
  // ✅ Uses backend-provided formatted value
  if (allocation._original?.formatted_allocated_amount) {
    return allocation._original.formatted_allocated_amount;
  }
  // Fallback (shouldn't be needed)
  return this.formatCurrency(allocation._original?.allocated_amount || 0);
}
```

**New Allocation Preview**:
```javascript
getCalculatedSalary(ftePercentage) {
  // Shows estimated value for new allocations being added
  // Displays "(estimated)" label to indicate backend will calculate final value
  const estimatedSalary = this.calculateSalaryFromFte(ftePercentage);
  return this.formatCurrency(estimatedSalary) + ' (estimated)';
}
```

#### Field Name Mapping:

**Data Object** (`formData`):
```javascript
{
  employment_id: null,
  employee_id: '',
  employment_type: '',
  start_date: null,
  end_date: null,
  pass_probation_date: null,  // ← Updated from probation_pass_date
  pass_probation_salary: '',  // ← Updated from position_salary
  probation_salary: '',
  // ... other fields
}
```

#### API Payload (Update):

**buildPayloadForAPI()**:
```javascript
const updatePayload = {
  employee_id: this.formData.employee_id,
  employment_type: this.formData.employment_type,
  pass_probation_date: this.formatDateForAPI(this.formData.pass_probation_date),
  pass_probation_salary: this.formData.pass_probation_salary,
  // ... other fields
  
  allocations: this.fundingAllocations.map(allocation => ({
    allocation_type: allocation.allocation_type,
    position_slot_id: allocation.position_slot_id, // for grant
    grant_id: allocation.grant_id,                 // for org_funded
    department_id: allocation.department_id,       // for org_funded
    position_id: allocation.position_id,           // for org_funded
    fte: allocation.fte  // Send as percentage (0-100)
    // ✅ NO allocated_amount - backend calculates this
  }))
};
```

#### UI Layout (Updated):

**Row Structure**:
1. Employee (full width, tree select)
2. Employment Type + Pay Method
3. Department + Position
4. **Work Location + Section Department** ← Updated
5. **Start Date + Pass Probation Date** ← Updated (End Date removed)
6. **Probation Salary + Pass Probation Salary** ← Updated (labels and order)
7. Funding Allocation Section
8. Benefits Section

**Key UI Changes**:
- "Position Salary" label → "Pass Probation Salary"
- End Date removed from display (still in data model, optional)
- Fields reorganized for better logical grouping
- Help text added for clarity

#### Validation:

**Form Validation** (Edit Mode):
```javascript
validateForm()
```
- All required fields must be present
- Allocations are **optional** for updates
- If allocations provided, total FTE must equal 100%
- Uses `pass_probation_salary` field name

#### Performance Considerations:

1. **No Calculation Overhead**: Frontend just displays backend-calculated values
2. **Direct Data Binding**: `_original` object holds API response data
3. **Efficient Re-renders**: Only affected allocations update on changes
4. **Lazy Loading**: Modal component only mounted when needed

---

## Data Flow

### 1. Employment Creation Flow

```
User Clicks "Add Employment"
         ↓
employment-list.vue (openAddEmploymentModal)
         ↓
Mount employment-modal.vue (lazy loading)
         ↓
employment-modal.vue (openModal)
         ↓
loadInitialData() → Load all dropdown data
         ↓
Check for draft → loadFormDraft()
         ↓
Display form with auto-save enabled
         ↓
User fills form → Auto-save every 1s
         ↓
User adds funding allocations
         ↓
User submits → validateForm()
         ↓
buildPayloadForAPI()
         ↓
employmentService.createEmployment(payload)
         ↓
Backend API processes request
         ↓
Success response
         ↓
clearFormDraft()
         ↓
Emit 'employment-added' event
         ↓
employment-list.vue (onEmploymentAdded)
         ↓
fetchEmployments() → Refresh list
         ↓
Modal closes and unmounts
```

### 2. Funding Allocation Flow

```
User selects Grant
         ↓
onGrantChange()
         ↓
Determine allocation type (isOrgFundGrant)
         ↓
If org_funded:
    Load departments
    User selects department
    onAllocationDepartmentChange()
    Load positions for department
    User selects position
         ↓
If grant:
    Set grantPositionOptions from grantPositions
    User selects grant position
    onGrantPositionChange()
    Load position slots for grant position
    User selects position slot
         ↓
User enters FTE percentage
         ↓
onFteChange() → Calculate salary
         ↓
User clicks "Add"
         ↓
validateCurrentAllocation()
         ↓
Check for duplicates
         ↓
Check total FTE doesn't exceed 100%
         ↓
Add to fundingAllocations array
         ↓
Display in allocation table
         ↓
Update summary (Total FTE, Total Allocated Salary)
```

### 3. Form Persistence Flow

```
User makes changes
         ↓
Debounced saveFormState() triggered (1s)
         ↓
Collect form data:
    - formData
    - fundingAllocations
    - currentAllocation
    - selectedEmployeeInfo
         ↓
Convert dates to ISO strings
         ↓
Add timestamp
         ↓
formPersistenceStore.saveFormSection('employment', 'employmentForm', data)
         ↓
Data saved to localStorage

--- User closes modal or browser ---

User reopens modal
         ↓
openModal() called
         ↓
loadFormDraft()
         ↓
formPersistenceStore.checkForSavedData('employment')
         ↓
Check timestamp < 24 hours
         ↓
Restore form data
         ↓
Convert ISO strings back to Date objects
         ↓
Restore related dropdowns
         ↓
Show restoration notification
         ↓
User can continue editing

--- On successful submit ---

clearFormDraft()
         ↓
formPersistenceStore.clearFormSection('employment', 'employmentForm')
         ↓
Draft removed from localStorage
```

### 4. Search & Filter Flow

```
User enters Staff ID
         ↓
Debounced search (300ms)
         ↓
handleStaffIdSearch()
         ↓
Validate input (not empty)
         ↓
Set searchLoading = true
         ↓
employmentService.searchEmploymentsByStaffId(staffId)
         ↓
Backend searches employments table
         ↓
Returns matching employments with employee data
         ↓
Update employments array
         ↓
Update pagination (total, currentPage)
         ↓
Show success message with employee summary
         ↓
Display search statistics
         ↓
Set searchLoading = false

--- OR ---

User applies table filter
         ↓
handleTableChange(pagination, filters, sorter)
         ↓
Debounced (300ms)
         ↓
Update filteredInfo and sortedInfo
         ↓
Reset to page 1
         ↓
Clear caches
         ↓
buildApiParams() → Combine filters, sorting, pagination
         ↓
fetchEmployments(params)
         ↓
Backend applies filters and sorting
         ↓
Returns paginated, filtered, sorted data
         ↓
Update employments array
         ↓
Update pagination metadata
         ↓
Display updated table
```

---

## API Integration

### Service Layer: employment.service.js

The system uses a BaseService pattern for API calls with structured error handling.

#### Endpoints:

##### 1. Get All Employments (Paginated)
```javascript
getAllEmployments(params)
```
**Method**: GET  
**Endpoint**: `/api/employments`  
**Query Parameters**:
- `page`: Page number
- `per_page`: Items per page
- `sort_by`: Field to sort by
- `sort_order`: 'asc' or 'desc'
- `filter_organization`: Comma-separated organization values
- `filter_employment_type`: Comma-separated employment types
- `filter_status`: Comma-separated status values

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee": {
        "id": 123,
        "staff_id": "SMRU001",
        "first_name_en": "John",
        "last_name_en": "Doe",
        "organization": "SMRU"
      },
      "employment_type": "Full-Time",
      "start_date": "2024-01-01",
      "end_date": null,
      "pass_probation_salary": 50000,
      "probation_salary": 45000,
      "pass_probation_date": "2024-04-01",
      "department": {
        "id": 5,
        "name": "IT Department"
      },
      "position": {
        "id": 12,
        "title": "Software Developer"
      },
      "work_location": {
        "id": 2,
        "name": "Bangkok Office"
      },
      "pay_method": "Transferred to bank",
      "health_welfare": true,
      "health_welfare_percentage": 5,
      "pvd": true,
      "pvd_percentage": 3,
      "saving_fund": false,
      "saving_fund_percentage": null,
      "employee_funding_allocations": [...]
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 150,
    "last_page": 15
  },
  "message": "Employments retrieved successfully"
}
```

##### 2. Search Employment by Staff ID
```javascript
searchEmploymentsByStaffId(staffId)
```
**Method**: GET  
**Endpoint**: `/api/employments/search/${staffId}`

**Response**:
```json
{
  "success": true,
  "data": [...],
  "employee_summary": {
    "id": 123,
    "staff_id": "SMRU001",
    "full_name": "John Doe",
    "organization": "SMRU"
  },
  "statistics": {
    "total_employments": 2,
    "active_employments": 1,
    "pending_employments": 0,
    "expired_employments": 1
  },
  "message": "Found 2 employment(s) for John Doe (SMRU001)"
}
```

##### 3. Get Employment by ID
```javascript
getEmploymentById(id)
```
**Method**: GET  
**Endpoint**: `/api/employments/${id}`

**Response**: Same structure as getAllEmployments but single object

##### 4. Create Employment
```javascript
createEmployment(data)
```
**Method**: POST  
**Endpoint**: `/api/employments`

**Request Payload**:
```json
{
  "employee_id": 123,
  "employment_type": "Full-Time",
  "pay_method": "Transferred to bank",
  "start_date": "2024-01-01",
  "end_date": null,
  "pass_probation_date": "2024-04-01",
  "department_id": 5,
  "position_id": 12,
  "section_department": "IT Operations",
  "work_location_id": 2,
  "pass_probation_salary": 50000,
  "probation_salary": 45000,
  "health_welfare": true,
  "health_welfare_percentage": 5,
  "pvd": true,
  "pvd_percentage": 3,
  "saving_fund": false,
  "saving_fund_percentage": null,
  "allocations": [
    {
      "allocation_type": "grant",
      "position_slot_id": 45,
      "fte": 60
      // ✅ NO allocated_amount - backend calculates this automatically
    },
    {
      "allocation_type": "org_funded",
      "grant_id": 2,
      "department_id": 5,
      "position_id": 12,
      "fte": 40
      // ✅ NO allocated_amount - backend calculates this automatically
    }
  ]
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "id": 456,
    "employee_id": 123,
    "employee_funding_allocations": [
      {
        "id": 789,
        "allocation_type": "grant",
        "fte": "0.60",
        "allocated_amount": "30000.00",
        "formatted_allocated_amount": "฿30,000",
        ...
      }
    ],
    ...
  },
  "message": "Employment created successfully"
}
```

**⚠️ Important Notes:**
- **Backend Calculation**: The `allocated_amount` is **automatically calculated** by the backend. Do NOT send `allocated_amount` in the request payload.
- **Field Names**: Use `pass_probation_salary` and `pass_probation_date` (standardized names).
- **FTE Format**: Send FTE as percentage (0-100), backend converts to decimal (0-1) for storage.
- **30-Day Month Standard**: Backend uses standardized 30-day months for all salary prorating calculations during probation period.

**Validation Error Response** (422):
```json
{
  "success": false,
  "status": 422,
  "error": "Validation failed",
  "errors": {
    "employee_id": "The employee id field is required.",
    "start_date": "The start date must be a valid date.",
    "allocations": "Total FTE must equal 100%"
  }
}
```

**Business Logic Error Response** (400):
```json
{
  "success": false,
  "status": 400,
  "error": "Employee already has an active employment",
  "message": "Cannot create employment for employee with existing active employment"
}
```

##### 5. Update Employment
```javascript
updateEmployment(id, data)
```
**Method**: PUT  
**Endpoint**: `/api/employments/${id}`

**Request/Response**: Similar to createEmployment

##### 6. Delete Employment
```javascript
deleteEmployment(id)
```
**Method**: DELETE  
**Endpoint**: `/api/employments/${id}`

**Response**:
```json
{
  "success": true,
  "message": "Employment deleted successfully"
}
```

##### 7. Get Funding Allocations
```javascript
getFundingAllocations(employmentId)
```
**Method**: GET  
**Endpoint**: `/api/employments/${employmentId}/funding-allocations`

**Response**:
```json
{
  "success": true,
  "data": {
    "employment_id": 456,
    "funding_allocations": [
      {
        "id": 789,
        "allocation_type": "grant",
        "position_slot_id": 45,
        "position_slot": {
          "id": 45,
          "slot_number": 1,
          "grant_item": {
            "id": 23,
            "name": "Research Assistant",
            "budgetline_code": "BL-001",
            "grant": {
              "id": 1,
              "name": "Research Grant A",
              "code": "RG001"
            }
          }
        },
        "fte": "0.60",
        "allocated_amount": "30000.00",
        "formatted_allocated_amount": "฿30,000",
        "start_date": "2024-01-01",
        "end_date": null
      },
      {
        "id": 790,
        "allocation_type": "org_funded",
        "org_funded": {
          "id": 12,
          "grant": {
            "id": 2,
            "name": "HUB Fund",
            "code": "S0031"
          },
          "department": {
            "id": 5,
            "name": "IT Department"
          },
          "position": {
            "id": 12,
            "title": "Software Developer"
          },
          "department_position": {
            "id": 67,
            "department": "IT Department",
            "position": "Software Developer"
          }
        },
        "fte": "0.40",
        "allocated_amount": "20000.00",
        "formatted_allocated_amount": "฿20,000",
        "start_date": "2024-01-01",
        "end_date": null
      }
    ]
  },
  "message": "Funding allocations retrieved successfully"
}
```

### Error Handling

The system uses a structured error handling approach with BaseService:

#### Error Response Structure:
```javascript
{
  success: false,
  status: 400|422|404|500,
  error: "Primary error message",
  message: "Descriptive message",
  errors: { /* Field-level errors for 422 */ }
}
```

#### Frontend Error Handling:
```javascript
try {
  const response = await employmentService.createEmployment(payload);
} catch (error) {
  // Structured error from BaseService
  if (error.status && error.success === false) {
    if (error.errors && typeof error.errors === 'object') {
      // Field validation errors (422)
      this.validationErrors = error.errors;
      this.alertMessage = error.error || error.message;
    } else {
      // Business logic errors
      this.alertMessage = error.error || error.message;
    }
  }
  // Raw axios errors (fallback)
  else if (error.response?.data) {
    this.alertMessage = error.response.data.error || error.response.data.message;
    if (error.response.data.errors) {
      this.validationErrors = error.response.data.errors;
    }
  }
  // Network errors
  else {
    this.alertMessage = error.message || 'Network error occurred';
  }
}
```

---

## Performance Optimizations

### 1. List Component Optimizations

#### Virtual Scrolling:
```vue
<a-table 
  :virtual="true"
  :scroll="{ x: 'max-content', y: 600 }"
  :scrollToFirstRowOnChange="false"
/>
```
- Only renders visible rows
- Handles thousands of records efficiently
- Maintains smooth scrolling

#### Shallow Refs:
```javascript
employments: shallowRef([])
```
- Prevents deep reactivity
- Reduces Vue overhead
- Improves update performance

#### Object.freeze:
```javascript
const processedData = response.data.map(emp => Object.freeze({
  id: emp.id,
  employee: Object.freeze(emp.employee || {}),
  ...emp
}));
```
- Prevents Vue from adding reactivity
- Significant performance gain with large datasets
- Immutable data pattern

#### Caching:
```javascript
// Status cache - automatic garbage collection
statusCache: new WeakMap()

// Display cache - cleared on data changes
displayCache: new Map()

// Cached table data
tableData() {
  const cacheKey = `${this.employments.length}-${this.currentPage}-${this.pageSize}`;
  if (this.displayCache.has(cacheKey)) {
    return this.displayCache.get(cacheKey);
  }
  // ... compute and cache
}
```

#### Debouncing:
```javascript
// Search debouncing
this.debouncedSearch = debounce(this.performSearch, 300);

// Filter debouncing
this.filterDebounceTimer = setTimeout(() => {
  // ... filter logic
}, 300);
```

#### v-memo Directive:
```vue
<div class="action-icon" v-memo="[record.id, editingEmploymentId]">
  <!-- Only re-renders if these values change -->
</div>
```

#### Component Destruction Guards:
```javascript
beforeUnmount() {
  this.isComponentDestroyed = true;
  // Clear timers
  // Clear caches
  // Cleanup listeners
}

// In async methods
if (this.isComponentDestroyed) return;
```

### 2. Modal Component Optimizations

#### Lazy Loading:
```javascript
// Modal only mounts when needed
const EmploymentModal = defineAsyncComponent(() => 
  import('@/components/modal/employment-modal.vue')
);

// Mount flag
isEmploymentModalMounted: false

// Mount only when opening
if (!this.isEmploymentModalMounted) {
  this.isEmploymentModalMounted = true;
  await this.$nextTick();
}
```

#### Preloading:
```vue
<button @mouseenter="preloadEmploymentModal">
  Add Employment
</button>
```
```javascript
async preloadEmploymentModal() {
  if (this.employmentModalPreloaded) return;
  await import('@/components/modal/employment-modal.vue');
  this.employmentModalPreloaded = true;
}
```

#### Memoization:
```javascript
this.memoizedCalculateStatus = memoize(this.calculateEmploymentStatus, 100);
this.memoizedFormatCurrency = memoize(this.formatCurrency, 50);
this.memoizedValidation = memoize(this.validateAllocationInternal, 20);
```

#### Virtual Scrolling (Employee Dropdown):
```javascript
getVisibleEmployees(employees) {
  const loadedCount = this.loadedEmployeeCounts.get(organizationKey) || 20;
  return employees.slice(0, loadedCount);
}

loadMoreEmployees(organizationKey) {
  const currentCount = this.loadedEmployeeCounts.get(organizationKey) || 20;
  this.loadedEmployeeCounts.set(organizationKey, currentCount + 20);
}
```

#### Performance Cleanup Class:
```javascript
class PerformanceCleanup {
  constructor() {
    this.listeners = [];
    this.observers = [];
  }
  
  addListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.listeners.push({ element, event, handler });
  }
  
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  cleanup() {
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.observers.forEach(observer => observer.disconnect());
  }
}
```

#### Performance Monitoring:
```javascript
setupPerformanceMonitoring() {
  // Visibility tracking
  const observer = new IntersectionObserver((entries) => {
    this.isVisible = entries[0].isIntersecting;
  });
  
  // Long task detection
  const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach(task => {
      if (task.duration > 50) {
        console.warn(`Long task: ${task.duration}ms`);
      }
    });
  });
}
```

### 3. Data Loading Optimizations

#### Shared Data Store:
```javascript
// Load once, use everywhere
const sharedStore = useSharedDataStore();
await sharedStore.loadAllDropdownData({
  includeEmployees: true,
  includeDepartments: true,
  includePositions: true,
  includeWorkLocations: true,
  includeGrantStructure: true,
  force: false // Use cache
});
```

#### Parallel Loading:
```javascript
await Promise.all([
  sharedStore.loadAllDropdownData({ ... }),
  sharedStore.fetchGrantStructure(true),
  this.initFetchLookups()
]);
```

#### Conditional Loading:
```javascript
if (!this.dataLoaded) {
  await this.loadInitialData();
  this.dataLoaded = true;
}
```

---

## User Interface

### Design System

The Employment Management System follows a modern, clean design language with:

#### Color Palette:
- **Primary**: #3577ef (Blue gradient)
- **Success**: #169b53 (Green)
- **Danger**: #e53e3e (Red)
- **Warning**: #f59e0b (Orange)
- **Secondary**: #6c757d (Gray)
- **Background**: #f7f8fa (Light gray)
- **Text**: #1d2636 (Dark blue-gray)

#### Typography:
- **Font Family**: 'Segoe UI', Arial, sans-serif
- **Modal Title**: 1.2em, 700 weight
- **Body Text**: 1em
- **Labels**: 0.95em, 500 weight
- **Small Text**: 0.85em

### Modal Design (New Modal Design System)

#### Header:
```css
.modal-header-new {
  padding: 34px 32px 0 32px;
  border-bottom: none;
}
```
- No bottom border for clean look
- Large padding for breathing room
- Custom close button (icon-based)

#### Body:
```css
.modal-body-new {
  padding: 22px 32px 20px 32px;
}
```
- Consistent horizontal padding with header
- Reduced vertical padding for density

#### Form Fields:
```css
.form-control {
  padding: 7px 12px;
  border-radius: 6px;
  border: 1px solid #c9d2e2;
  background: #f7f8fa;
}

.form-control:focus {
  border: 1.5px solid #4a7fff;
  background: #fff;
}
```
- Subtle background color in default state
- Clear focus state with thicker border
- Smooth transitions

#### Date Rows:
```css
.date-row {
  display: flex;
  gap: 14px;
}
```
- Flexbox for equal-width fields
- Consistent gap between fields
- Responsive to content

### Custom Tree Select

#### Design:
```css
.custom-tree-select {
  position: relative;
  width: 100%;
}

.tree-select-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  min-height: 38px;
}
```

#### Features:
- Dropdown icon rotates on open
- Search input in header
- Hierarchical display with expand/collapse
- Virtual scrolling for performance
- Custom scrollbar styling

#### Employee Item:
```css
.employee-item {
  padding: 10px 24px;
  transition: background-color 0.15s ease;
}

.employee-item:hover {
  background: #f8f9fa;
}

.employee-item.selected {
  background: #e3f2fd;
  border-left: 3px solid #4a7fff;
}
```

### Allocation Table

#### Design:
```css
.allocation-table {
  width: 100%;
  border-collapse: collapse;
}

.allocation-table th {
  background: #f8fafc;
  color: #3c4257;
  font-weight: 600;
}

.allocation-table td {
  padding: 8px 7px;
  border: 1px solid #e5eaf0;
}
```

#### Badges:
```css
.badge-org {
  background: #ffe6c1;
  color: #a37500;
}

.badge-grant {
  background: #d9f4ec;
  color: #278d4c;
}
```

#### Inline Editing:
```css
.edit-field {
  width: 90%;
  padding: 4px 7px;
  border-radius: 5px;
  border: 1px solid #c9d2e2;
}
```

### Benefits Section

#### Container:
```css
.benefits-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}
```

#### Percentage Input:
```css
.benefit-percentage-input {
  width: 80px;
  padding: 4px 8px;
  text-align: right;
}

.benefit-percentage-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #e9ecef;
}
```

### Summary Display

```css
.total-summary {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
}

.summary-row {
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

### Buttons

#### Primary Button (Save):
```css
.btn-save {
  background: linear-gradient(90deg, #3577ef 70%, #355bef 100%);
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
}

.btn-save:disabled {
  background: #ccd4ea;
  color: #888;
  cursor: not-allowed;
}
```

#### Cancel Button:
```css
.btn-cancel {
  background: #fff;
  color: #2a3146;
  border: 1.2px solid #bbc4d1;
}

.btn-cancel:hover {
  background: #f4f7fa;
}
```

### Messages

#### Success:
```css
.success-msg {
  color: #169b53;
  background: #f0f9f4;
  border: 1px solid #d4edda;
  border-radius: 6px;
  padding: 8px 12px;
}
```

#### Error:
```css
.error-msg {
  color: #e53e3e;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 8px 12px;
}
```

### Loading States

#### Form Loading:
```css
.form-loading {
  opacity: 0.7;
  pointer-events: none;
}

.form-loading::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
}
```

#### Button Loading:
```css
.spinner-border-sm {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 0.15em;
}
```

#### Loading Dots Animation:
```css
@keyframes loadingDots {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}
```

### Responsive Design

```css
@media (max-width: 768px) {
  .total-summary {
    flex-direction: column;
    gap: 8px;
  }
  
  .tree-dropdown {
    max-height: 300px;
  }
  
  .employee-item {
    padding: 8px 16px;
  }
}
```

### Accessibility

- **Focus States**: Clearly visible on all interactive elements
- **Color Contrast**: WCAG AA compliant
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels
- **Loading Indicators**: Visible and announced

---

## Form Validation

### Client-Side Validation

#### Required Field Validation:
```javascript
const requiredFields = [
  { field: 'employee_id', message: 'Please select an employee' },
  { field: 'employment_type', message: 'Please select employment type' },
  { field: 'department_id', message: 'Please select department' },
  { field: 'position_id', message: 'Please select position' },
  { field: 'work_location_id', message: 'Please select work location' },
  { field: 'start_date', message: 'Please select start date' },
  { field: 'position_salary', message: 'Please enter position salary' }
];
```

#### Funding Allocation Validation:
```javascript
// Must have at least one allocation
if (this.fundingAllocations.length === 0) {
  alertMessage = 'Please add at least one funding allocation';
  isValid = false;
}

// Total FTE must equal 100%
if (this.totalFte !== 100) {
  alertMessage = `Total FTE must equal 100%. Current total: ${this.totalFte}%`;
  isValid = false;
}
```

#### Allocation-Specific Validation:
```javascript
// Grant-funded validation
if (!allocation.grant_items_id) {
  this.allocationErrors.grant_items_id = 'Please select a grant position';
  isValid = false;
}
if (!allocation.position_slot_id) {
  this.allocationErrors.position_slot_id = 'Please select a position slot';
  isValid = false;
}

// Org-funded validation
if (!allocation.department_id) {
  this.allocationErrors.department_id = 'Please select a department';
  isValid = false;
}
if (!allocation.position_id) {
  this.allocationErrors.position_id = 'Please select a position';
  isValid = false;
}

// FTE validation
if (!allocation.fte || allocation.fte <= 0) {
  this.allocationErrors.fte = 'Please enter a valid FTE percentage';
  isValid = false;
}
if (allocation.fte > 100) {
  this.allocationErrors.fte = 'FTE percentage cannot exceed 100%';
  isValid = false;
}
```

#### Duplicate Allocation Check:
```javascript
const isDuplicate = this.fundingAllocations.some((a, i) => {
  if (this.editingIndex !== null && i === this.editingIndex) return false;
  
  if (allocation.allocation_type === 'grant') {
    return a.position_slot_id === allocation.position_slot_id;
  }
  if (allocation.allocation_type === 'org_funded') {
    return a.grant_id === allocation.grant_id &&
           a.department_id === allocation.department_id &&
           a.position_id === allocation.position_id;
  }
  return false;
});
```

#### FTE Overflow Check:
```javascript
const currentTotal = this.fundingAllocations.reduce((sum, a, i) => {
  return i === this.editingIndex ? sum : sum + a.fte;
}, 0);

if (currentTotal + this.currentAllocation.fte > 100) {
  this.alertMessage = `Adding this allocation would exceed 100% FTE. Available: ${100 - currentTotal}%`;
  this.alertClass = 'alert-danger';
  return;
}
```

### Server-Side Validation

#### Laravel Validation Rules (Expected):
```php
[
  'employee_id' => 'required|exists:employees,id',
  'employment_type' => 'required|string',
  'start_date' => 'required|date',
  'end_date' => 'nullable|date|after:start_date',
  'department_id' => 'required|exists:departments,id',
  'position_id' => 'required|exists:positions,id',
  'work_location_id' => 'required|exists:work_locations,id',
  'position_salary' => 'required|numeric|min:0',
  'probation_salary' => 'nullable|numeric|min:0',
  'allocations' => 'required|array|min:1',
  'allocations.*.allocation_type' => 'required|in:grant,org_funded',
  'allocations.*.fte' => 'required|numeric|min:0|max:100',
  'allocations.*.allocated_amount' => 'required|numeric|min:0',
]
```

#### Custom Validation Rules:
```php
// Total FTE must equal 100
'allocations' => [
  'required',
  'array',
  function ($attribute, $value, $fail) {
    $totalFte = collect($value)->sum('fte');
    if ($totalFte != 100) {
      $fail("Total FTE must equal 100%. Current total: {$totalFte}%");
    }
  }
]

// No duplicate position slots
'allocations.*.position_slot_id' => [
  'required_if:allocations.*.allocation_type,grant',
  function ($attribute, $value, $fail) {
    // Check for duplicates
  }
]

// Employee must not have overlapping employments
'employee_id' => [
  'required',
  function ($attribute, $value, $fail) {
    // Check for date overlaps
  }
]
```

### Validation Display

#### Field-Level Errors:
```vue
<input 
  v-model="formData.position_salary"
  :class="{ 'is-invalid': validationErrors.position_salary }"
/>
<div v-if="validationErrors.position_salary" class="invalid-feedback">
  {{ validationErrors.position_salary }}
</div>
```

#### Form-Level Errors:
```vue
<div v-if="alertMessage && alertClass === 'alert-danger'" class="error-msg">
  {{ alertMessage }}
</div>
```

#### Allocation Errors:
```vue
<select v-model="currentAllocation.grant_items_id">
  <!-- options -->
</select>
<div v-if="allocationErrors.grant_items_id" class="invalid-feedback">
  {{ allocationErrors.grant_items_id }}
</div>
```

---

## Funding Allocation System

### Detailed Technical Implementation

#### Data Structure:

##### Current Allocation (Form Input):
```javascript
currentAllocation: {
  allocation_type: '',      // 'grant' or 'org_funded'
  grant_id: '',            // Selected grant ID
  grant_items_id: '',      // Grant position ID (grant only)
  position_slot_id: '',    // Position slot ID (grant only)
  department_id: '',       // Department ID (org_funded only)
  position_id: '',         // Position ID (org_funded only)
  fte: 100                 // FTE percentage (0-100)
}
```

##### Funding Allocations (Array):
```javascript
fundingAllocations: [
  {
    id: null,                    // null for new, number for existing
    allocation_type: 'grant',
    grant_id: 1,
    grant_items_id: 23,
    position_slot_id: 45,
    department_id: '',
    position_id: '',
    fte: 60,
    _original: {                 // Display data from API
      grant_name: 'Research Grant A',
      grant_code: 'RG001',
      grant_position: 'Research Assistant',
      slot_number: 1,
      budget_line_code: 'BL-001',
      allocated_amount: 30000,
      formatted_allocated_amount: '฿30,000'
    }
  },
  {
    id: null,
    allocation_type: 'org_funded',
    grant_id: 2,
    grant_items_id: '',
    position_slot_id: '',
    department_id: 5,
    position_id: 12,
    fte: 40,
    _original: {
      grant_name: 'HUB Fund',
      grant_code: 'S0031',
      department_name: 'IT Department',
      position_name: 'Software Developer',
      allocated_amount: 20000,
      formatted_allocated_amount: '฿20,000'
    }
  }
]
```

#### Grant Structure:

##### Grant Options:
```javascript
grantOptions: [
  {
    id: 1,
    name: 'Research Grant A',
    code: 'RG001',
    type: 'grant'
  },
  {
    id: 2,
    name: 'HUB Fund',
    code: 'S0031',
    type: 'org_funded'
  }
]
```

##### Grant Positions (Nested Structure):
```javascript
grantPositions: {
  '1': [  // Grant ID as key
    {
      id: 23,
      name: 'Research Assistant',
      budgetline_code: 'BL-001',
      grant_salary: 50000,
      position_slots: [
        {
          id: 45,
          slot_number: 1,
          status: 'available'
        },
        {
          id: 46,
          slot_number: 2,
          status: 'occupied'
        }
      ]
    }
  ]
}
```

#### Allocation Workflow:

##### Step 1: Grant Selection
```javascript
async onGrantChange() {
  const grantId = this.currentAllocation.grant_id;
  
  if (this.isOrgFundGrant(grantId)) {
    // Org-funded path
    this.currentAllocation.allocation_type = 'org_funded';
    
    // Clear grant-specific fields
    this.currentAllocation.grant_items_id = '';
    this.currentAllocation.position_slot_id = '';
    this.grantPositionOptions = [];
    this.positionSlotOptions = [];
    
    // Prepare for department/position selection
    this.currentAllocation.department_id = '';
    this.currentAllocation.position_id = '';
    this.allocationPositions = [];
  } else {
    // Grant-funded path
    this.currentAllocation.allocation_type = 'grant';
    
    // Clear org-funded fields
    this.currentAllocation.department_id = '';
    this.currentAllocation.position_id = '';
    this.allocationPositions = [];
    
    // Load grant positions
    this.grantPositionOptions = this.grantPositions[grantId] || [];
    this.positionSlotOptions = [];
  }
  
  this.allocationErrors = {};
  this.saveFormState();
}
```

##### Step 2A: Org-Funded - Department Selection
```javascript
async onAllocationDepartmentChange() {
  try {
    // Reset position
    this.currentAllocation.position_id = '';
    this.allocationPositions = [];
    this.allocationPositionsLoading = true;
    
    if (!this.currentAllocation.department_id) return;
    
    // Fetch positions for department
    const sharedStore = useSharedDataStore();
    const positions = await sharedStore.fetchPositions(true, {
      department_id: this.currentAllocation.department_id
    });
    
    this.allocationPositions = Array.isArray(positions) 
      ? positions 
      : (positions?.data || []);
  } catch (error) {
    console.error('Error loading positions:', error);
    this.allocationPositions = [];
    this.$message.error('Failed to load positions');
  } finally {
    this.allocationPositionsLoading = false;
    this.saveFormState();
  }
}
```

##### Step 2B: Grant-Funded - Grant Position Selection
```javascript
onGrantPositionChange() {
  const positionId = this.currentAllocation.grant_items_id;
  
  // Reset position slot
  this.currentAllocation.position_slot_id = '';
  
  // Find selected position
  const position = this.grantPositionOptions.find(p => p.id == positionId);
  
  if (position) {
    // Map position slots with budget line info
    this.positionSlotOptions = (position.position_slots || []).map(slot => ({
      ...slot,
      budgetline_code: position.budgetline_code || 'N/A'
    }));
  } else {
    this.positionSlotOptions = [];
  }
  
  delete this.allocationErrors.position_slot_id;
  this.saveFormState();
}
```

##### Step 3: FTE Entry
```javascript
onFteChange() {
  // Trigger reactivity for calculated salary display
  // Auto-save will handle persistence
  this.saveFormState();
}

getCalculatedSalary(ftePercentage) {
  if (!ftePercentage || !this.formData.position_salary) {
    return this.formatCurrency(0);
  }
  const salary = (this.formData.position_salary * ftePercentage) / 100;
  return this.formatCurrency(salary);
}
```

##### Step 4: Add Allocation
```javascript
addAllocation() {
  // 1. Validate current allocation
  if (!this.validateCurrentAllocation()) {
    return;
  }
  
  // 2. Check for duplicates
  const isDuplicate = this.fundingAllocations.some((a, i) => {
    if (this.editingIndex !== null && i === this.editingIndex) return false;
    
    if (this.currentAllocation.allocation_type === 'grant') {
      return a.position_slot_id === this.currentAllocation.position_slot_id;
    }
    if (this.currentAllocation.allocation_type === 'org_funded') {
      return a.grant_id === this.currentAllocation.grant_id &&
             a.department_id === this.currentAllocation.department_id &&
             a.position_id === this.currentAllocation.position_id;
    }
    return false;
  });
  
  if (isDuplicate) {
    this.alertMessage = 'This allocation is already added.';
    this.alertClass = 'alert-danger';
    return;
  }
  
  // 3. Check FTE limit
  const currentTotal = this.fundingAllocations.reduce((sum, a, i) => {
    return i === this.editingIndex ? sum : sum + a.fte;
  }, 0);
  
  if (currentTotal + this.currentAllocation.fte > 100) {
    this.alertMessage = `Adding this allocation would exceed 100% FTE. Available: ${100 - currentTotal}%`;
    this.alertClass = 'alert-danger';
    return;
  }
  
  // 4. Add or update allocation
  const allocation = { ...this.currentAllocation };
  
  if (this.editingIndex !== null) {
    this.fundingAllocations[this.editingIndex] = allocation;
    this.editingIndex = null;
  } else {
    this.fundingAllocations.push(allocation);
  }
  
  // 5. Reset form
  this.currentAllocation = {
    allocation_type: '',
    grant_id: '',
    grant_items_id: '',
    position_slot_id: '',
    department_id: '',
    position_id: '',
    fte: 100
  };
  
  this.grantPositionOptions = [];
  this.positionSlotOptions = [];
  this.allocationPositions = [];
  this.allocationErrors = {};
  this.alertMessage = '';
  this.alertClass = '';
  
  this.saveFormState();
}
```

#### Inline Editing:

##### Edit Mode Activation:
```javascript
editAllocation(index) {
  this.editingIndex = index;
  this.editData = { ...this.fundingAllocations[index] };
  
  if (this.isOrgFundGrant(this.editData.grant_id)) {
    this.editData.allocation_type = 'org_funded';
    if (this.editData.department_id) {
      this.onEditAllocationDepartmentChange();
    }
  } else {
    this.editData.allocation_type = 'grant';
    this.editGrantPositionOptions = this.grantPositions[this.editData.grant_id] || [];
    const position = this.editGrantPositionOptions.find(p => p.id == this.editData.grant_items_id);
    this.editPositionSlotOptions = position
      ? (position.position_slots || []).map(slot => ({
          ...slot,
          budgetline_code: position.budgetline_code || 'N/A'
        }))
      : [];
  }
}
```

##### Save Edit:
```javascript
saveEdit() {
  this.fundingAllocations[this.editingIndex] = { ...this.editData };
  this.editingIndex = null;
  this.alertMessage = '';
  this.alertClass = '';
  this.saveFormState();
}
```

##### Cancel Edit:
```javascript
cancelEdit() {
  this.editingIndex = null;
}
```

#### Display Implementation:

##### Table Template:
```vue
<table v-if="fundingAllocations.length > 0" class="allocation-table">
  <thead>
    <tr>
      <th>Type</th>
      <th>Grant</th>
      <th>Department</th>
      <th>Position</th>
      <th>Grant Position</th>
      <th>Position Slot</th>
      <th>FTE (%)</th>
      <th>Allocated Salary</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(row, idx) in fundingAllocations" :key="idx"
      v-memo="[row.id, row.fte, editingIndex === idx]">
      <template v-if="editingIndex === idx">
        <!-- Inline Edit Row -->
        <td>
          <span class="badge" :class="row.allocation_type === 'org_funded' ? 'badge-org' : 'badge-grant'">
            {{ row.allocation_type === 'org_funded' ? 'Org Funded' : 'Grant Funded' }}
          </span>
        </td>
        <td>
          <select v-model="editData.grant_id" @change="onEditGrantChange" class="edit-field">
            <option value="">Select grant</option>
            <option v-for="grant in grantOptions" :key="grant.id" :value="grant.id">
              {{ grant.name }} ({{ grant.code }})
            </option>
          </select>
        </td>
        <!-- More edit fields... -->
      </template>
      <template v-else>
        <!-- Display Row -->
        <td>
          <span class="badge" :class="row.allocation_type === 'org_funded' ? 'badge-org' : 'badge-grant'">
            {{ row.allocation_type === 'org_funded' ? 'Org Funded' : 'Grant Funded' }}
          </span>
        </td>
        <td>{{ getGrantName(row.grant_id, row._original) }}</td>
        <td>
          <span v-if="row.allocation_type === 'org_funded'">
            {{ getDepartmentName(row.department_id, row._original) }}
          </span>
          <span v-else class="text-muted">-</span>
        </td>
        <!-- More display fields... -->
      </template>
    </tr>
  </tbody>
</table>
```

##### Summary Display:
```vue
<div v-if="fundingAllocations.length > 0" class="total-summary">
  <div class="summary-row">
    <span class="summary-label">Total FTE:</span>
    <span class="summary-value" :class="{ 'text-danger': totalFte !== 100 }">
      {{ totalFte }}%
    </span>
  </div>
  <div class="summary-row">
    <span class="summary-label">Total Allocated Salary:</span>
    <span class="summary-value">{{ formatCurrency(totalAllocatedSalary) }}</span>
  </div>
  <div class="summary-row">
    <span class="summary-label">Position Salary:</span>
    <span class="summary-value">{{ formatCurrency(formData.position_salary) }}</span>
  </div>
</div>
```

##### Computed Properties:
```javascript
computed: {
  totalFte() {
    return this.fundingAllocations.reduce((sum, allocation) => sum + allocation.fte, 0);
  },
  
  totalAllocatedSalary() {
    return this.fundingAllocations.reduce((sum, allocation) => {
      const salary = this.calculateSalaryFromFte(allocation.fte);
      return sum + salary;
    }, 0);
  }
}
```

---

## Technical Implementation

### State Management Strategy

#### Local Component State:
- Form data (formData, currentAllocation, editData)
- UI state (loading flags, modal visibility)
- Validation errors
- Temporary data (filtered lists, search terms)

#### Pinia Stores:

##### sharedDataStore:
```javascript
{
  employees: [],
  employeeTreeData: [],
  departments: [],
  positions: [],
  workLocations: [],
  grantOptions: [],
  grantPositions: {},
  
  loadAllDropdownData(options),
  fetchEmployees(force),
  fetchDepartments(force),
  fetchPositions(force, filters),
  fetchWorkLocations(force),
  fetchGrantStructure(force),
  
  findEmployeeInTree(id),
  getEmployeeOrganization(id)
}
```

##### lookupStore:
```javascript
{
  lookups: [],
  lookupsByType: {},
  lookupTypes: [],
  
  fetchAllLookupLists(),
  getLookupsByType(type)
}
```

##### formPersistenceStore:
```javascript
{
  savedForms: {},
  
  saveFormSection(module, section, data),
  checkForSavedData(module),
  clearFormSection(module, section),
  clearAllForModule(module)
}
```

### Service Layer Architecture

#### BaseService Pattern:
```javascript
class BaseService {
  constructor(baseURL = '') {
    this.axios = axios.create({
      baseURL: baseURL || process.env.VUE_APP_API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Request interceptor
    this.axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );
    
    // Response interceptor
    this.axios.interceptors.response.use(
      response => response.data,
      error => {
        // Structured error handling
        return Promise.reject({
          success: false,
          status: error.response?.status,
          error: error.response?.data?.error || error.response?.data?.message,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
          originalError: error
        });
      }
    );
  }
  
  async get(url, config = {}) {
    return this.axios.get(url, config);
  }
  
  async post(url, data = {}, config = {}) {
    return this.axios.post(url, data, config);
  }
  
  async put(url, data = {}, config = {}) {
    return this.axios.put(url, data, config);
  }
  
  async delete(url, config = {}) {
    return this.axios.delete(url, config);
  }
}
```

#### EmploymentService:
```javascript
class EmploymentService extends BaseService {
  constructor() {
    super();
  }
  
  async getAllEmployments(params = {}) {
    return this.get('/employments', { params });
  }
  
  async getEmploymentById(id) {
    return this.get(`/employments/${id}`);
  }
  
  async createEmployment(data) {
    return this.post('/employments', data);
  }
  
  async updateEmployment(id, data) {
    return this.put(`/employments/${id}`, data);
  }
  
  async deleteEmployment(id) {
    return this.delete(`/employments/${id}`);
  }
  
  async searchEmploymentsByStaffId(staffId) {
    return this.get(`/employments/search/${staffId}`);
  }
  
  async getFundingAllocations(employmentId) {
    return this.get(`/employments/${employmentId}/funding-allocations`);
  }
}

export const employmentService = new EmploymentService();
```

### Utility Functions

#### Performance Utilities (utils/performance.js):

##### Debounce:
```javascript
export function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}
```

##### Memoize:
```javascript
export function memoize(func, maxSize = 100) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(this, args);
    
    // Limit cache size
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
}
```

##### PerformanceCleanup:
```javascript
export class PerformanceCleanup {
  constructor() {
    this.listeners = [];
    this.observers = [];
    this.timers = [];
  }
  
  addListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    this.listeners.push({ element, event, handler, options });
  }
  
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  addTimer(timerId) {
    this.timers.push(timerId);
  }
  
  cleanup() {
    // Remove event listeners
    this.listeners.forEach(({ element, event, handler, options }) => {
      try {
        element.removeEventListener(event, handler, options);
      } catch (error) {
        console.warn('Error removing listener:', error);
      }
    });
    
    // Disconnect observers
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Error disconnecting observer:', error);
      }
    });
    
    // Clear timers
    this.timers.forEach(timerId => {
      clearTimeout(timerId);
    });
    
    // Clear arrays
    this.listeners = [];
    this.observers = [];
    this.timers = [];
  }
}
```

### Router Configuration

```javascript
{
  path: '/hrm/employments',
  name: 'EmploymentList',
  component: () => import('@/views/pages/hrm/employment/employment-list.vue'),
  meta: {
    requiresAuth: true,
    roles: ['admin', 'hr_manager', 'hr_staff'],
    title: 'Employment Management'
  }
}
```

---

## Usage Guide

### For End Users

#### Creating a New Employment:

1. **Navigate to Employment List**
   - Click "HR Management" in sidebar
   - Click "Employment List"

2. **Open Create Form**
   - Click "Add Employment" button (blue button top-right)
   - Wait for form to load (first time may take a moment)

3. **Select Employee**
   - Click on employee dropdown
   - Search by name or staff ID
   - Expand organization to see employees
   - Click to select employee
   - Review employee info card that appears

4. **Fill Employment Details**
   - Select Employment Type (required)
   - Select Pay Method (optional)
   - Select Department (required)
   - Select Position within department (required)
   - Select Section Department (optional)
   - Select Work Location (required)

5. **Set Dates**
   - Select Start Date (required)
     - Probation Pass Date auto-fills to 3 months later
   - Adjust Probation Pass Date if needed
   - Set End Date (optional, for fixed-term contracts)

6. **Enter Salary Information**
   - Enter Position Salary (required)
   - Enter Probation Salary (optional)

7. **Configure Benefits**
   - Benefits may be pre-selected based on employment type
   - Check/uncheck: Health & Welfare, PVD, Saving Fund
   - Enter percentage for each checked benefit

8. **Add Funding Allocations**
   - Select Grant
   - If Org-Funded (HUB Fund):
     - Select Department
     - Select Position
   - If Grant-Funded:
     - Select Grant Position
     - Select Position Slot
   - Enter FTE percentage (remaining % shown)
   - Review calculated salary
   - Click "Add" button
   - Repeat until total FTE = 100%

9. **Review Summary**
   - Check Total FTE = 100% (must be exactly 100%)
   - Review Total Allocated Salary
   - Compare with Position Salary

10. **Submit**
    - Click "Save Employment" button
    - Wait for confirmation message
    - Modal closes automatically

#### Searching for Employment:

1. **By Staff ID**
   - Enter staff ID in search box
   - Click "Search" or press Enter
   - View matching employments
   - See employee summary in success message

2. **By Filter**
   - Click filter icon on column header
   - Select filter values (can select multiple)
   - Table updates automatically
   - Clear filters using "Clear filters" button

3. **By Sorting**
   - Click on column header to sort
   - Click again to reverse sort
   - Click third time to remove sort

#### Editing an Employment:

1. **Locate Employment**
   - Search or filter to find employment
   - Click edit icon (pencil) in Actions column
   - Wait for edit form to load (loading dots appear)

2. **Make Changes**
   - Update any employment details
   - Modify funding allocations as needed
   - Form auto-saves drafts

3. **Save Changes**
   - Click "Save Employment" button
   - Wait for confirmation

#### Deleting an Employment:

1. **Locate Employment**
2. **Click Delete Icon** (trash can in Actions column)
3. **Confirm Deletion** in dialog
4. **Wait for Confirmation**

#### Draft Recovery:

If you accidentally close the form:
1. Reopen the form within 24 hours
2. Your unsaved changes will be restored automatically
3. A notification shows when draft was last saved
4. Choose to continue editing or discard

### For Developers

#### Adding New Validation Rule:

```javascript
// In validateForm() method
const customValidation = () => {
  if (this.formData.end_date && this.formData.end_date < this.formData.start_date) {
    errors.end_date = 'End date must be after start date';
    isValid = false;
  }
};

customValidation();
```

#### Adding New Benefit Field:

1. **Add to formData**:
```javascript
formData: {
  // ... existing fields
  new_benefit: false,
  new_benefit_percentage: null
}
```

2. **Add to Template**:
```vue
<div class="benefit-item">
  <label class="checkbox-item">
    <input type="checkbox" v-model="formData.new_benefit" @change="saveFormState" />
    <span class="checkmark"></span>
    New Benefit
  </label>
  <div class="benefit-percentage-group">
    <input type="number" class="form-control benefit-percentage-input"
      v-model.number.lazy="formData.new_benefit_percentage"
      :disabled="!formData.new_benefit"
      @blur="debouncedSaveState">
    <span class="percentage-symbol">%</span>
  </div>
</div>
```

3. **Add to Payload**:
```javascript
buildPayloadForAPI() {
  return {
    // ... existing fields
    new_benefit: !!this.formData.new_benefit,
    new_benefit_percentage: this.formData.new_benefit_percentage || null
  };
}
```

#### Customizing Auto-save Delay:

```javascript
// In created() hook
this.debouncedSaveState = debounce(this.saveFormState, 2000); // 2 seconds instead of 1
```

#### Adding New Allocation Type:

```javascript
// 1. Extend isOrgFundGrant logic
isCustomType(grantId) {
  const customCodes = ['C001', 'C002'];
  const grant = this.grantOptions.find(g => g.id == grantId);
  return grant && customCodes.includes(grant.code);
}

// 2. Handle in onGrantChange
if (this.isOrgFundGrant(grantId)) {
  // ... existing org_funded logic
} else if (this.isCustomType(grantId)) {
  this.currentAllocation.allocation_type = 'custom';
  // Load custom options
} else {
  // ... existing grant logic
}

// 3. Add validation in validateCurrentAllocation

// 4. Add display logic in table template

// 5. Handle in buildPayloadForAPI
```

#### Performance Monitoring:

```javascript
// Enable performance logging
setupPerformanceMonitoring() {
  // ... existing code
  
  // Add custom metrics
  performance.mark('employment-form-open');
  
  // Later
  performance.mark('employment-form-loaded');
  performance.measure('form-load-time', 'employment-form-open', 'employment-form-loaded');
  
  const measure = performance.getEntriesByName('form-load-time')[0];
  console.log(`Form loaded in ${measure.duration}ms`);
}
```

#### Testing Checklist:

**Unit Tests:**
- [ ] Validation functions return correct results
- [ ] Date conversion handles all formats
- [ ] FTE calculation is accurate
- [ ] Duplicate detection works correctly

**Integration Tests:**
- [ ] API calls succeed with valid data
- [ ] API calls fail gracefully with invalid data
- [ ] Draft persistence saves and restores correctly
- [ ] Modal lifecycle works (mount/unmount)

**E2E Tests:**
- [ ] Complete employment creation flow
- [ ] Search and filter functionality
- [ ] Edit existing employment
- [ ] Delete employment with confirmation
- [ ] Draft recovery after accidental close

---

## Best Practices

### Code Organization

1. **Separation of Concerns**
   - UI logic in components
   - Business logic in services
   - State management in stores
   - Utilities in utils folder

2. **Component Size**
   - Keep components under 3500 lines
   - Extract complex logic to composables
   - Use mixins for shared behavior

3. **Naming Conventions**
   - Components: PascalCase
   - Methods: camelCase
   - Constants: UPPER_SNAKE_CASE
   - Files: kebab-case

### Performance

1. **Always Use Debouncing** for user input
2. **Implement Virtual Scrolling** for long lists
3. **Use Object.freeze** for read-only data
4. **Cache Expensive Calculations**
5. **Lazy Load** heavy components
6. **Clean Up** on component unmount

### Security

1. **Never Store Sensitive Data** in localStorage
2. **Validate on Client AND Server**
3. **Sanitize User Input**
4. **Use HTTPS** for all API calls
5. **Implement CSRF Protection**
6. **Handle Authentication Properly**

### Accessibility

1. **Keyboard Navigation** fully supported
2. **Screen Reader** friendly
3. **Color Contrast** meets WCAG AA
4. **Focus Indicators** clearly visible
5. **Error Messages** properly announced

### User Experience

1. **Loading States** for all async operations
2. **Error Messages** are clear and actionable
3. **Confirmation Dialogs** for destructive actions
4. **Auto-save** prevents data loss
5. **Visual Feedback** for all actions

---

## Troubleshooting

### Common Issues

#### Issue: Modal doesn't open on first click
**Cause**: Async component not loaded yet  
**Solution**: Implemented with preloading on hover and retry logic

#### Issue: DatePicker shows "Extraneous non-props attributes" warning
**Cause**: DatePicker rendered before modal is visible  
**Solution**: Use `v-if="isModalVisible && dataLoaded"` in template

#### Issue: Draft not restoring
**Cause**: Draft older than 24 hours  
**Solution**: Draft automatically expires and clears after 24 hours

#### Issue: Total FTE shows as 100.00000001
**Cause**: JavaScript floating point precision  
**Solution**: Store as integers (percentage) not decimals

#### Issue: Allocation table not updating
**Cause**: Missing reactivity on nested objects  
**Solution**: Use `this.$set` or spread operator when updating

#### Issue: Search returns no results
**Cause**: Staff ID doesn't exist or wrong format  
**Solution**: Validate input and show helpful error message

#### Issue: Performance degradation with many allocations
**Cause**: Too many reactive watchers  
**Solution**: Use v-memo and shallow refs

#### Issue: Modal backdrop remains after close
**Cause**: Multiple modals open simultaneously  
**Solution**: Implement cleanupModalBackdrops() method

---

## Future Enhancements

### Planned Features

1. **Bulk Import**
   - Excel file upload
   - Template download
   - Validation before import
   - Progress tracking

2. **Export Functionality**
   - Export to Excel
   - Export to PDF
   - Custom column selection
   - Filtered data export

3. **Employment History Timeline**
   - Visual timeline of employment changes
   - Action change tracking
   - Funding change tracking
   - Department/position changes

4. **Advanced Reporting**
   - Employment statistics dashboard
   - Funding utilization reports
   - Headcount by department
   - FTE allocation reports

5. **Notification System**
   - Contract expiration alerts
   - Probation period reminders
   - Funding allocation changes
   - Email notifications

6. **Action Change Modal**
   - Promotion tracking
   - Transfer management
   - Demotion handling
   - Salary adjustments

7. **Funding Change Modal**
   - Mid-employment allocation changes
   - Effective date tracking
   - Historical funding records

8. **Approval Workflow**
   - Multi-level approval
   - Approval history
   - Comment system
   - Email notifications

9. **Document Attachment**
   - Contract upload
   - Supporting documents
   - Document versioning
   - Preview capability

10. **Audit Log**
    - Complete change history
    - User tracking
    - Timestamp all changes
    - Revert capability

### Technical Debt

1. **Split Large Component**
   - Extract funding allocation to separate component
   - Create composable for form persistence
   - Separate validation logic

2. **Improve TypeScript**
   - Add type definitions
   - Use TypeScript for better IDE support
   - Reduce any types

3. **Add More Tests**
   - Increase test coverage to 80%
   - Add E2E tests for critical flows
   - Performance benchmarks

4. **Optimize Bundle Size**
   - Code splitting
   - Tree shaking
   - Remove unused dependencies

5. **Improve Error Handling**
   - Retry failed requests
   - Offline support
   - Better error messages

---

## Conclusion

The Employment Management System is a comprehensive solution for managing employee employment records with advanced features like funding allocation, draft persistence, and performance optimizations. The system is built with modern Vue 3 patterns, follows best practices, and provides an excellent user experience.

### Key Strengths:
- ✅ Comprehensive functionality
- ✅ Excellent performance with large datasets
- ✅ User-friendly interface
- ✅ Robust error handling
- ✅ Auto-save and draft recovery
- ✅ Advanced funding allocation system
- ✅ Clean, maintainable code
- ✅ Extensive documentation

### Quick Reference:
- **Main List**: `src/views/pages/hrm/employment/employment-list.vue`
- **Create Modal**: `src/components/modal/employment-modal.vue`
- **Service**: `src/services/employment.service.js`
- **Stores**: `sharedDataStore`, `lookupStore`, `formPersistenceStore`
- **Documentation**: `docs/EMPLOYMENT_MANAGEMENT_DOCUMENTATION.md`

For questions or issues, refer to the troubleshooting section or contact the development team.

---

## Changelog

### Version 1.1 - October 14, 2025

**Backend Calculation Migration & Field Name Standardization**

#### Breaking Changes:
1. **Field Names Updated**:
   - `probation_pass_date` → `pass_probation_date`
   - `position_salary` → `pass_probation_salary`

2. **Calculation Logic Migration**:
   - `allocated_amount` no longer sent in API requests
   - Backend now handles all salary allocation calculations
   - Frontend displays backend-calculated values

#### Updates:

**employment-edit-modal.vue**:
- ✅ Updated field names to match backend (`pass_probation_date`, `pass_probation_salary`)
- ✅ Removed frontend calculation of `allocated_amount`
- ✅ Updated `totalAllocatedSalary` to use backend values from `_original.allocated_amount`
- ✅ Updated `getAllocatedSalary` to display `_original.formatted_allocated_amount`
- ✅ Updated `getCalculatedSalary` to show "(estimated)" label for new allocations
- ✅ Updated `buildPayloadForAPI` to remove `allocated_amount` from payload
- ✅ Updated UI layout: Work Location + Section Department on same row
- ✅ Updated UI layout: Start Date + Pass Probation Date on same row (End Date removed from display)
- ✅ Updated UI layout: Probation Salary + Pass Probation Salary on same row with help text
- ✅ Updated label: "Position Salary" → "Pass Probation Salary"

**employment-modal.vue**:
- ✅ Updated field names in formData object
- ✅ Removed `allocated_amount` calculation from allocation payload
- ✅ Updated documentation for FTE management (backend calculation note)

**API Integration**:
- ✅ Updated request payload examples to exclude `allocated_amount`
- ✅ Updated response examples to show backend-calculated values
- ✅ Added important notes about backend calculation
- ✅ Documented 30-day month standardization for probation calculations

**Data Flow**:
- ✅ Frontend is now pure display layer for allocations
- ✅ Backend is single source of truth for calculations
- ✅ No frontend/backend calculation discrepancies

#### Benefits:
- **Consistency**: All calculations use same backend logic
- **Accuracy**: 30-day month standardization applied uniformly
- **Maintainability**: Calculation logic in one place only
- **Performance**: No frontend calculation overhead
- **Data Integrity**: Single source of truth

---

**Document Version**: 1.1  
**Last Updated**: October 14, 2025  
**Author**: Development Team  
**Status**: Production Ready



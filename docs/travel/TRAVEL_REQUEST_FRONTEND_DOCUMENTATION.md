# Travel Request System - Frontend Documentation

**Current Version:** 4.2  
**Last Updated:** October 5, 2025  
**Status:** Production Ready  

## 📋 Table of Contents

1. [Overview](#overview)
2. [Current Schema (Version 4.2)](#current-schema-version-42)
3. [File Structure](#file-structure)
4. [Component Implementation](#component-implementation)
5. [Service Layer](#service-layer)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Validation Rules](#validation-rules)
9. [Testing Guidelines](#testing-guidelines)
10. [Version History](#version-history)

---

## Overview

The Travel Request system is a comprehensive CRUD application for managing employee travel requests with approval tracking. It features:

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ Enhanced "Other please specify" functionality with custom text fields
- ✅ Server-side pagination and advanced search
- ✅ Multi-field filtering and sorting
- ✅ Employee-based search by staff ID
- ✅ Two-level approval workflow (Supervisor → HR)
- ✅ Date range validation
- ✅ Transportation and accommodation tracking

### System Architecture
This is a **Data Entry and Display System** - digitizing paper-based travel request forms into a database for storage, viewing, searching, and reporting.

---

## Current Schema (Version 4.2)

### Core Fields

```javascript
{
    // Employee Information
    employee_id: Number (required),
    department_id: Number (optional),
    position_id: Number (optional),
    
    // Travel Details
    destination: String (max: 200),
    start_date: Date,
    to_date: Date,
    purpose: Text,
    grant: String (max: 50), // Grant/Project Code
    
    // Transportation
    transportation: Enum ['smru_vehicle', 'public_transportation', 'air', 'other'],
    transportation_other_text: String (max: 200), // Required when transportation = 'other'
    
    // Accommodation
    accommodation: Enum ['smru_arrangement', 'self_arrangement', 'other'],
    accommodation_other_text: String (max: 200), // Required when accommodation = 'other'
    
    // Approval Tracking
    request_by_date: Date,
    supervisor_approved: Boolean,
    supervisor_approved_date: Date,
    hr_acknowledged: Boolean,
    hr_acknowledgement_date: Date,
    
    // Additional
    remarks: Text,
    created_by: String (max: 100),
    updated_by: String (max: 100)
}
```

### Approval Workflow

```
1. Request By Date → When the request was made
2. Supervisor Approval → Boolean + Date
3. HR Acknowledgement → Boolean + Date
```

**Note:** Site admin approval was removed in Version 4.2 to simplify the workflow.

---

## File Structure

```
src/
├── components/
│   └── modal/
│       └── travel-request-modal.vue          # Main form modal (1436 lines)
├── views/
│   └── pages/
│       └── requests/
│           └── travel/
│               └── travel-list.vue           # List view with filters
├── services/
│   └── travelRequest.service.js              # API service layer (249 lines)
├── stores/
│   └── travelRequestStore.js                 # Pinia state management (513 lines)
└── config/
    └── api.config.js                         # API endpoints configuration
```

---

## Component Implementation

### 1. Travel Request Modal (`travel-request-modal.vue`)

**Purpose:** Create and edit travel requests with tabbed interface.

#### Features:
- Two-tab interface: "Basic Information" and "Travel Details"
- Employee searchable dropdown with staff ID, name, and organization
- Auto-populate department and position from employee data
- Date range validation
- Conditional "Other" text fields for transportation and accommodation
- Real-time character count for text areas
- Approval tracking fields

#### Tab 1: Basic Information
```vue
<template>
  <!-- Employee Search Dropdown -->
  <input type="text" v-model="employeeSearchQuery" 
         @input="onEmployeeSearchInput"
         placeholder="Type to search by Staff ID, Name, or Organization..." />
  
  <!-- Auto-populated Department & Position -->
  <select v-model="formData.department_id">...</select>
  <select v-model="formData.position_id">...</select>
  
  <!-- Travel Information -->
  <input v-model="formData.destination" maxlength="200" />
  <date-picker v-model="formData.start_date" />
  <date-picker v-model="formData.to_date" />
  <textarea v-model="formData.purpose" />
  <input v-model="formData.grant" maxlength="50" />
</template>
```

#### Tab 2: Travel Details
```vue
<template>
  <!-- Transportation Options -->
  <div class="option-card">
    <input type="radio" value="smru_vehicle" v-model="formData.transportation" />
    <input type="radio" value="public_transportation" v-model="formData.transportation" />
    <input type="radio" value="air" v-model="formData.transportation" />
    <input type="radio" value="other" v-model="formData.transportation" />
    
    <!-- Conditional "Other" text field -->
    <textarea v-if="formData.transportation === 'other'" 
              v-model="formData.transportation_other_text"
              maxlength="200" />
  </div>
  
  <!-- Accommodation Options -->
  <div class="option-card">
    <input type="radio" value="smru_arrangement" v-model="formData.accommodation" />
    <input type="radio" value="self_arrangement" v-model="formData.accommodation" />
    <input type="radio" value="other" v-model="formData.accommodation" />
    
    <!-- Conditional "Other" text field -->
    <textarea v-if="formData.accommodation === 'other'" 
              v-model="formData.accommodation_other_text"
              maxlength="200" />
  </div>
  
  <!-- Approval Tracking -->
  <div class="approval-section">
    <date-picker v-model="formData.request_by_date" />
    <checkbox v-model="formData.supervisor_approved" />
    <date-picker v-model="formData.supervisor_approved_date" />
    <checkbox v-model="formData.hr_acknowledged" />
    <date-picker v-model="formData.hr_acknowledgement_date" />
  </div>
</template>
```

#### Key Methods:

```javascript
export default {
  methods: {
    // Employee search with keyboard navigation
    async loadEmployees() {
      const response = await employeeService.treeSearch();
      this.employees = this.flattenEmployeeTree(response.data);
    },
    
    onEmployeeSearchInput() {
      this.showEmployeeDropdown = true;
      // Filter employees by staff_id, name, or organization
    },
    
    onEmployeeKeyDown(event) {
      // Handle ArrowDown, ArrowUp, Enter, Escape
    },
    
    selectEmployee(employee) {
      this.formData.employee_id = employee.id;
      this.onEmployeeChange(); // Auto-populate dept & position
    },
    
    // Form submission
    async handleSubmit() {
      const validation = this.validateForm(this.formData);
      if (!validation.isValid) {
        this.validationErrors = validation.errors;
        return;
      }
      
      const formattedData = this.formatDataForAPI(this.formData);
      const travelRequestStore = useTravelRequestStore();
      
      if (this.isEditMode) {
        await travelRequestStore.updateTravelRequest(this.editingTravelRequestId, formattedData);
      } else {
        await travelRequestStore.createTravelRequest(formattedData);
      }
    },
    
    // Date formatting
    formatDataForAPI(data) {
      const formatted = { ...data };
      
      // Convert dates to YYYY-MM-DD
      if (formatted.start_date instanceof Date) {
        formatted.start_date = formatted.start_date.toISOString().split('T')[0];
      }
      
      // Remove "other" text fields if not applicable
      if (formatted.transportation !== 'other') {
        formatted.transportation_other_text = null;
      }
      
      return formatted;
    }
  }
}
```

---

### 2. Travel List View (`travel-list.vue`)

**Purpose:** Display, search, filter, and manage travel requests.

#### Features:
- Statistics cards (Total, Pending, Approved, Rejected)
- Search by staff ID
- Filter by department and transportation
- Ant Design table with horizontal scrolling
- Pagination
- CRUD action buttons

#### Template Structure:
```vue
<template>
  <!-- Statistics Row -->
  <div class="row statistics-row">
    <div class="col-xl-3">
      <div class="card">
        <h6>Total Requests</h6>
        <h3>{{ statistics.total }}</h3>
      </div>
    </div>
    <!-- Pending, Approved, Rejected cards... -->
  </div>
  
  <!-- Search & Filter Section -->
  <div class="card">
    <input v-model="searchStaffId" placeholder="Enter staff ID" />
    <select v-model="departmentFilter">...</select>
    <select v-model="transportationFilter">...</select>
    <button @click="clearFilters">Clear</button>
  </div>
  
  <!-- Travel Requests Table -->
  <a-table 
    :columns="columns" 
    :data-source="travelRequests"
    :pagination="false"
    :scroll="{ x: 1200 }">
    
    <!-- Custom Columns -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'employee'">
        {{ getEmployeeName(record) }}
      </template>
      
      <template v-if="column.key === 'actions'">
        <button @click="viewTravelRequest(record)">View</button>
        <button @click="editTravelRequest(record)">Edit</button>
        <button @click="deleteTravelRequest(record)">Delete</button>
      </template>
    </template>
  </a-table>
  
  <!-- Pagination -->
  <a-pagination 
    v-model:current="currentPage"
    v-model:page-size="pageSize"
    :total="total" />
</template>
```

#### Key Methods:
```javascript
export default {
  methods: {
    async fetchTravelRequests() {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        filter_department: this.departmentFilter,
        filter_transportation: this.transportationFilter
      };
      
      await travelRequestStore.fetchTravelRequests(params);
      this.travelRequests = travelRequestStore.travelRequests;
      this.total = travelRequestStore.total;
      this.statistics = travelRequestStore.statistics;
    },
    
    async searchByStaffId() {
      await travelRequestStore.searchTravelRequestsByStaffId(this.searchStaffId);
    },
    
    deleteTravelRequest(record) {
      Modal.confirm({
        title: 'Delete Travel Request',
        content: `Are you sure you want to delete this request?`,
        onOk: async () => {
          await travelRequestStore.deleteTravelRequest(record.id);
          this.fetchTravelRequests();
        }
      });
    }
  }
}
```

---

## Service Layer

### Travel Request Service (`travelRequest.service.js`)

**Purpose:** Handle all API communications for travel requests.

```javascript
class TravelRequestService extends BaseService {
  /**
   * Get all travel requests with pagination and filtering
   */
  async getTravelRequests(params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const endpoint = `${API_ENDPOINTS.TRAVEL_REQUEST.LIST}?${queryParams.toString()}`;
    return await apiService.get(endpoint);
  }
  
  /**
   * Search travel requests by employee staff ID
   */
  async searchTravelRequestsByEmployee(staffId, params = {}) {
    const endpoint = API_ENDPOINTS.TRAVEL_REQUEST.SEARCH_BY_EMPLOYEE.replace(':staffId', staffId);
    return await apiService.get(endpoint);
  }
  
  /**
   * Create new travel request
   */
  async createTravelRequest(data) {
    const formattedData = this.formatTravelRequestData(data);
    return await apiService.post(API_ENDPOINTS.TRAVEL_REQUEST.CREATE, formattedData);
  }
  
  /**
   * Update existing travel request
   */
  async updateTravelRequest(id, data) {
    const endpoint = API_ENDPOINTS.TRAVEL_REQUEST.UPDATE.replace(':id', id);
    const formattedData = this.formatTravelRequestData(data);
    return await apiService.put(endpoint, formattedData);
  }
  
  /**
   * Delete travel request
   */
  async deleteTravelRequest(id) {
    const endpoint = API_ENDPOINTS.TRAVEL_REQUEST.DELETE.replace(':id', id);
    return await apiService.delete(endpoint);
  }
  
  /**
   * Format travel request data for API submission
   */
  formatTravelRequestData(data) {
    const formattedData = {
      employee_id: parseInt(data.employee_id),
      department_id: data.department_id ? parseInt(data.department_id) : null,
      position_id: data.position_id ? parseInt(data.position_id) : null,
      destination: data.destination || null,
      start_date: data.start_date || null,
      to_date: data.to_date || null,
      purpose: data.purpose || null,
      grant: data.grant || null,
      transportation: data.transportation || null,
      accommodation: data.accommodation || null,
      remarks: data.remarks || null,
      created_by: data.created_by || null,
      updated_by: data.updated_by || null
    };
    
    // Only include other text fields if "other" is selected
    if (data.transportation === 'other' && data.transportation_other_text) {
      formattedData.transportation_other_text = data.transportation_other_text;
    }
    
    if (data.accommodation === 'other' && data.accommodation_other_text) {
      formattedData.accommodation_other_text = data.accommodation_other_text;
    }
    
    // Add approval fields (matching backend schema - Version 4.2)
    if (data.request_by_date) {
      formattedData.request_by_date = data.request_by_date;
    }
    if (data.supervisor_approved !== undefined) {
      formattedData.supervisor_approved = Boolean(data.supervisor_approved);
    }
    if (data.supervisor_approved_date) {
      formattedData.supervisor_approved_date = data.supervisor_approved_date;
    }
    if (data.hr_acknowledged !== undefined) {
      formattedData.hr_acknowledged = Boolean(data.hr_acknowledged);
    }
    if (data.hr_acknowledgement_date) {
      formattedData.hr_acknowledgement_date = data.hr_acknowledgement_date;
    }
    
    return formattedData;
  }
}

export const travelRequestService = new TravelRequestService();
```

---

## State Management

### Travel Request Store (`travelRequestStore.js`)

**Purpose:** Centralized state management using Pinia.

```javascript
export const useTravelRequestStore = defineStore('travelRequest', {
  state: () => ({
    // Data state
    travelRequests: [],
    currentTravelRequest: null,
    statistics: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    },
    options: {
      transportation: [
        { value: 'smru_vehicle', label: 'SMRU vehicle' },
        { value: 'public_transportation', label: 'Public transportation' },
        { value: 'air', label: 'Air' },
        { value: 'other', label: 'Other please specify' }
      ],
      accommodation: [
        { value: 'smru_arrangement', label: 'SMRU arrangement' },
        { value: 'self_arrangement', label: 'Self arrangement' },
        { value: 'other', label: 'Other please specify' }
      ]
    },
    
    // Pagination state
    currentPage: 1,
    pageSize: 10,
    total: 0,
    
    // UI state
    loading: false,
    submitting: false,
    error: null
  }),
  
  actions: {
    /**
     * Fetch travel requests with pagination and filtering
     */
    async fetchTravelRequests(params = {}) {
      this.loading = true;
      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };
        
        const response = await travelRequestService.getTravelRequests(queryParams);
        
        if (response.success && response.data) {
          this.travelRequests = this.mapTravelRequestData(response.data);
          
          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
            this.pageSize = response.pagination.per_page;
          }
          
          if (response.statistics) {
            this.statistics = response.statistics;
          }
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Create new travel request
     */
    async createTravelRequest(data) {
      this.submitting = true;
      try {
        const response = await travelRequestService.createTravelRequest(data);
        
        if (response.success) {
          if (this.currentPage === 1) {
            this.travelRequests.unshift(response.data);
            this.total += 1;
          }
          return response.data;
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.submitting = false;
      }
    },
    
    /**
     * Update travel request
     */
    async updateTravelRequest(id, data) {
      this.submitting = true;
      try {
        const response = await travelRequestService.updateTravelRequest(id, data);
        
        if (response.success) {
          const index = this.travelRequests.findIndex(r => r.id === parseInt(id));
          if (index !== -1) {
            this.travelRequests[index] = response.data;
          }
          return response.data;
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.submitting = false;
      }
    },
    
    /**
     * Map travel request data from API response
     */
    mapTravelRequestData(data) {
      return data.map(request => ({
        key: request.id,
        id: request.id,
        employee_id: request.employee_id,
        employee: request.employee || null,
        department_id: request.department_id,
        department: request.department || null,
        position_id: request.position_id,
        position: request.position || null,
        destination: request.destination || 'N/A',
        start_date: request.start_date || null,
        to_date: request.to_date || null,
        purpose: request.purpose || 'N/A',
        grant: request.grant || 'N/A',
        transportation: request.transportation || 'N/A',
        transportation_other_text: request.transportation_other_text || '',
        accommodation: request.accommodation || 'N/A',
        accommodation_other_text: request.accommodation_other_text || '',
        remarks: request.remarks || '',
        // Approval fields (matching backend schema - Version 4.2)
        request_by_date: request.request_by_date || null,
        supervisor_approved: request.supervisor_approved || false,
        supervisor_approved_date: request.supervisor_approved_date || null,
        hr_acknowledged: request.hr_acknowledged || false,
        hr_acknowledgement_date: request.hr_acknowledgement_date || null,
        created_at: request.created_at,
        updated_at: request.updated_at,
        created_by: request.created_by || null,
        updated_by: request.updated_by || null
      }));
    }
  }
});
```

---

## API Integration

### API Configuration (`api.config.js`)

```javascript
export const API_ENDPOINTS = {
  TRAVEL_REQUEST: {
    LIST: '/travel-requests',
    SHOW: '/travel-requests/:id',
    CREATE: '/travel-requests',
    UPDATE: '/travel-requests/:id',
    DELETE: '/travel-requests/:id',
    DELETE_SELECTED: '/travel-requests/delete-selected',
    OPTIONS: '/travel-requests/options',
    SEARCH_BY_EMPLOYEE: '/travel-requests/search/employee/:staffId'
  }
};
```

### API Endpoints Documentation

#### 1. List Travel Requests
```
GET /api/v1/travel-requests?page=1&per_page=10
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 10)
- `search`: Search by employee staff ID, first name, or last name
- `filter_department`: Filter by department names (comma-separated)
- `filter_transportation`: Filter by transportation type
- `sort_by`: Sort field (start_date, destination, employee_name, created_at)
- `sort_order`: Sort direction (asc, desc)

**Response:**
```json
{
  "success": true,
  "message": "Travel requests retrieved successfully",
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total": 50,
    "last_page": 5
  },
  "statistics": {
    "total": 50,
    "pending": 10,
    "approved": 35,
    "rejected": 5
  }
}
```

#### 2. Create Travel Request
```
POST /api/v1/travel-requests
```

**Request Body:**
```json
{
  "employee_id": 1,
  "department_id": 8,
  "position_id": 47,
  "destination": "Bangkok",
  "start_date": "2025-04-01",
  "to_date": "2025-04-05",
  "purpose": "Business meeting",
  "grant": "Project X",
  "transportation": "other",
  "transportation_other_text": "Company shuttle bus",
  "accommodation": "other",
  "accommodation_other_text": "Client-provided guest house",
  "request_by_date": "2025-03-15",
  "supervisor_approved": false,
  "supervisor_approved_date": null,
  "hr_acknowledged": false,
  "hr_acknowledgement_date": null,
  "remarks": "Meeting with stakeholders",
  "created_by": "admin"
}
```

#### 3. Update Travel Request
```
PUT /api/v1/travel-requests/{id}
```

#### 4. Delete Travel Request
```
DELETE /api/v1/travel-requests/{id}
```

#### 5. Search by Staff ID
```
GET /api/v1/travel-requests/search/employee/{staffId}
```

#### 6. Get Options
```
GET /api/v1/travel-requests/options
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transportation": [
      {"value": "smru_vehicle", "label": "SMRU vehicle"},
      {"value": "public_transportation", "label": "Public transportation"},
      {"value": "air", "label": "Air"},
      {"value": "other", "label": "Other please specify"}
    ],
    "accommodation": [
      {"value": "smru_arrangement", "label": "SMRU arrangement"},
      {"value": "self_arrangement", "label": "Self arrangement"},
      {"value": "other", "label": "Other please specify"}
    ]
  }
}
```

---

## Validation Rules

### Frontend Validation

```javascript
validateForm(data) {
  const errors = {};
  
  // Required fields
  if (!data.employee_id) {
    errors.employee_id = 'Employee is required';
  }
  
  // Date validation
  if (data.start_date && data.to_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.to_date);
    if (endDate <= startDate) {
      errors.to_date = 'End date must be after start date';
    }
  }
  
  // Transportation "other" validation
  if (data.transportation === 'other') {
    if (!data.transportation_other_text?.trim()) {
      errors.transportation_other_text = 'Please specify the transportation method when selecting "Other"';
    } else if (data.transportation_other_text.length > 200) {
      errors.transportation_other_text = 'Transportation specification cannot exceed 200 characters';
    }
  }
  
  // Accommodation "other" validation
  if (data.accommodation === 'other') {
    if (!data.accommodation_other_text?.trim()) {
      errors.accommodation_other_text = 'Please specify the accommodation type when selecting "Other"';
    } else if (data.accommodation_other_text.length > 200) {
      errors.accommodation_other_text = 'Accommodation specification cannot exceed 200 characters';
    }
  }
  
  // Field length validation
  if (data.destination && data.destination.length > 200) {
    errors.destination = 'Destination cannot exceed 200 characters';
  }
  
  if (data.grant && data.grant.length > 50) {
    errors.grant = 'Grant/Project Code cannot exceed 50 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

### Backend Validation (Reference)

```php
[
  'employee_id' => 'required|exists:employees,id',
  'department_id' => 'nullable|exists:departments,id',
  'position_id' => 'nullable|exists:positions,id',
  'destination' => 'nullable|string|max:200',
  'start_date' => 'nullable|date|after_or_equal:today',
  'to_date' => 'nullable|date|after:start_date',
  'transportation' => 'nullable|string|in:smru_vehicle,public_transportation,air,other',
  'transportation_other_text' => 'nullable|string|max:200|required_if:transportation,other',
  'accommodation' => 'nullable|string|in:smru_arrangement,self_arrangement,other',
  'accommodation_other_text' => 'nullable|string|max:200|required_if:accommodation,other',
]
```

---

## Testing Guidelines

### Unit Testing Checklist

#### Modal Component Tests
- [ ] Employee search filters correctly by staff ID, name, and organization
- [ ] Keyboard navigation works (Arrow keys, Enter, Escape)
- [ ] Employee selection auto-populates department and position
- [ ] Date validation prevents end date before start date
- [ ] "Other" text fields appear/disappear based on radio selection
- [ ] Character counters work for text areas
- [ ] Form resets correctly when cancelled
- [ ] Edit mode loads existing data correctly

#### List Component Tests
- [ ] Statistics cards display correct counts
- [ ] Search by staff ID returns correct results
- [ ] Department filter works with multiple selections
- [ ] Transportation filter works correctly
- [ ] Pagination updates data correctly
- [ ] Edit button opens modal with correct data
- [ ] Delete confirmation modal appears
- [ ] Success/error messages display correctly

#### Service Layer Tests
- [ ] GET requests include correct query parameters
- [ ] POST requests format data correctly
- [ ] PUT requests format data correctly
- [ ] DELETE requests target correct endpoint
- [ ] Error responses are handled gracefully
- [ ] "Other" text fields only sent when applicable

#### Store Tests
- [ ] State updates correctly after create
- [ ] State updates correctly after update
- [ ] State updates correctly after delete
- [ ] Pagination metadata updates correctly
- [ ] Statistics update correctly
- [ ] Loading states toggle correctly

### Integration Testing Checklist

- [ ] Create travel request end-to-end
- [ ] Edit existing travel request end-to-end
- [ ] Delete travel request with confirmation
- [ ] Search and filter combination works
- [ ] Pagination with filters maintained
- [ ] Form validation prevents invalid submissions
- [ ] Backend API returns expected data structure
- [ ] Authentication tokens sent correctly

### Manual Testing Checklist

1. **Create Travel Request**
   - [ ] Open modal from "+ Add New Travel Request" button
   - [ ] Search and select employee (test keyboard navigation)
   - [ ] Verify department and position auto-populate
   - [ ] Enter destination, dates, purpose, grant
   - [ ] Click "Next: Travel Details"
   - [ ] Select transportation (test "Other" option with text)
   - [ ] Select accommodation (test "Other" option with text)
   - [ ] Enter remarks
   - [ ] Set approval fields
   - [ ] Click "Save"
   - [ ] Verify success message
   - [ ] Verify new entry in table

2. **Edit Travel Request**
   - [ ] Click edit button on existing request
   - [ ] Verify all fields populated correctly
   - [ ] Modify some fields
   - [ ] Click "Update"
   - [ ] Verify success message
   - [ ] Verify changes in table

3. **Search & Filter**
   - [ ] Search by staff ID (partial match)
   - [ ] Filter by department
   - [ ] Filter by transportation
   - [ ] Combine filters
   - [ ] Click "Clear" to reset

4. **Pagination**
   - [ ] Navigate to page 2
   - [ ] Change page size
   - [ ] Verify URL updates
   - [ ] Verify data updates

5. **Delete Travel Request**
   - [ ] Click delete button
   - [ ] Verify confirmation modal
   - [ ] Click "Yes, Delete"
   - [ ] Verify success message
   - [ ] Verify entry removed from table

---

## Version History

### Version 4.2 (Current) - October 5, 2025
**Changes:**
- ✅ **Removed** site admin approval fields (`site_admin_approved`, `site_admin_approved_date`)
- ✅ Simplified approval workflow to 2 levels (Supervisor + HR)
- ✅ Updated all files to match backend schema

**Files Modified:**
- `travel-request-modal.vue` - Removed site admin section from form
- `travelRequest.service.js` - Removed site admin field handling
- `travelRequestStore.js` - Removed site admin fields from data mapping

**Impact:** Simpler form, faster completion, clearer workflow

---

### Version 4.1 - October 4, 2025
**Changes:**
- ✅ **Renamed** `hr_approved` → `hr_acknowledged`
- ✅ **Renamed** `hr_approved_date` → `hr_acknowledgement_date`
- ✅ **Removed** all signature boolean fields:
  - `request_by_signature`
  - `supervisor_signature`
  - `hr_signature`

**Files Modified:**
- `travel-request-modal.vue` - Updated field names and removed signature checkboxes
- `travelRequest.service.js` - Updated field formatting
- `travelRequestStore.js` - Updated data mapping

**Impact:** Better terminology (acknowledged vs approved), simplified form

---

### Version 4.0 - October 4, 2025
**Changes:**
- ✅ **Removed** signature boolean fields
- ✅ Kept approval boolean fields with dates
- ✅ Initial schema alignment with backend

---

### Version 3.0 - October 4, 2025
**Changes:**
- ✅ Enhanced "Other please specify" functionality
- ✅ Added custom text fields for transportation and accommodation
- ✅ Added character limit validation (200 chars)

---

### Version 2.0 - Initial Implementation
**Features:**
- ✅ Complete CRUD operations
- ✅ Server-side pagination
- ✅ Multi-field filtering
- ✅ Employee search by staff ID
- ✅ Two-tab modal interface
- ✅ Approval tracking

---

## Best Practices

### Code Style
- Use composition API patterns where possible
- Follow Vue 3 style guide
- Use Pinia for state management
- Keep components under 2000 lines
- Extract reusable logic to composables

### UI/UX
- Always show loading states
- Provide clear error messages
- Use success confirmations
- Implement keyboard navigation
- Make forms accessible (ARIA labels)

### Performance
- Lazy load employee data
- Use pagination for large datasets
- Debounce search inputs
- Cache dropdown options
- Optimize re-renders with keys

### Security
- Validate on both frontend and backend
- Sanitize user inputs
- Use parameterized queries
- Implement CSRF protection
- Require authentication for all endpoints

---

## Troubleshooting

### Common Issues

**1. Employee dropdown not loading**
- Check `employeeService.treeSearch()` response
- Verify employee data structure
- Check console for errors

**2. Date validation not working**
- Ensure date picker returns Date objects
- Check `formatDataForAPI()` formatting
- Verify backend expects YYYY-MM-DD format

**3. "Other" text field not showing**
- Check radio button `v-model` binding
- Verify `formData.transportation` or `formData.accommodation` value
- Check `v-if` condition

**4. Form submission fails**
- Check validation errors in console
- Verify all required fields populated
- Check network tab for API response
- Verify backend expects correct field names

**5. Pagination not working**
- Check `currentPage` and `pageSize` state
- Verify API returns pagination metadata
- Check `fetchTravelRequests()` parameters

---

## Related Documentation

- **Backend API:** Travel Request System - Complete Documentation (Backend)
- **Reports:** [TRAVEL_REPORT_DOCUMENTATION.md](./TRAVEL_REPORT_DOCUMENTATION.md)
- **Architecture:** [HRMS_FRONTEND_ARCHITECTURE.md](./HRMS_FRONTEND_ARCHITECTURE.md)
- **Styling:** [TRAVEL_REQUEST_STYLING_UPDATE_DOCUMENTATION.md](./TRAVEL_REQUEST_STYLING_UPDATE_DOCUMENTATION.md)

---

## Support & Maintenance

### Contact
- Development Team: HRMS Development Team
- Last Major Update: October 5, 2025
- Current Status: Production Ready ✅

### Change Request Process
1. Document required changes
2. Update backend schema if needed
3. Update frontend files
4. Run tests
5. Update this documentation
6. Deploy to staging
7. User acceptance testing
8. Deploy to production

---

**End of Documentation**


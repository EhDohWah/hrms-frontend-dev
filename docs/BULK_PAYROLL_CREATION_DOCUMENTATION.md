# Bulk Payroll Creation Feature Documentation

## Overview
The Bulk Payroll Creation feature allows HR administrators to create payroll records for multiple employees simultaneously, streamlining the payroll process and reducing manual data entry.

## Implementation Details

### Components Created

#### 1. BulkPayrollModal Component
**Location:** `src/components/modal/bulk-payroll-modal.vue`

A comprehensive 3-step wizard modal for creating bulk payroll:

##### Step 1: Pay Period Selection
- **Pay Period Start Date**: Select the beginning of the pay period
- **Pay Period End Date**: Select the end of the pay period
- **Payment Date**: Select when employees will be paid
- **Payroll Month**: Select the month for payroll processing
- **Duration Calculator**: Automatically calculates pay period duration
- **Date Validation**: Ensures logical date selections (end date after start date, payment date after end date)

##### Step 2: Employee Selection
- **Search & Filter**: 
  - Text search by name or staff ID
  - Filter by subsidiary
  - Filter by department
  - Filter by employment status (active/inactive)
- **Employee Cards**: Visual cards showing employee details
- **Bulk Actions**:
  - Select All: Select all filtered employees
  - Clear Selection: Deselect all employees
- **Pagination**: Navigate through large employee lists (12 employees per page)
- **Visual Feedback**: Selected employees are highlighted with blue border and background

##### Step 3: Review & Submit
- **Summary Cards**: Visual summary of:
  - Number of employees selected
  - Payroll month
  - Pay period duration
  - Payment date
- **Selected Employees Table**: 
  - Scrollable table showing all selected employees
  - Individual employee details (name, staff ID, subsidiary, department, position)
  - Remove option for each employee
- **Final Submission**: Create payroll button with employee count

### Files Modified

#### 1. Employee Salary Page
**Location:** `src/views/pages/finance-accounts/payroll/employee-salary.vue`

**Changes:**
- Changed button from router link to modal trigger
- Updated button text from "Add Salary" to "Bulk Payroll Creation"
- Changed icon from `ti-circle-plus` to `ti-cash-banknote`
- Imported and registered `BulkPayrollModal` component
- Added event handler `handlePayrollCreated` for modal events
- Modal automatically refreshes payroll list after successful creation

#### 2. Payroll Service
**Location:** `src/services/payroll.service.js`

**Changes:**
- Added `createBulkPayroll(bulkData)` method
- Endpoints to `PAYROLL.BULK_CREATE` or fallback to `PAYROLL.CREATE/bulk`

## Features

### User Interface
1. **Modern Step-by-Step Wizard**: Clear progress indicators
2. **Responsive Design**: Works on desktop, tablet, and mobile
3. **Visual Feedback**: 
   - Active step highlighting
   - Completed step checkmarks
   - Selected employee highlighting
4. **Validation**: 
   - Required field validation
   - Date logic validation
   - Minimum selection validation
5. **Loading States**: Spinner for async operations
6. **Empty States**: Helpful messages when no data available

### Functionality
1. **Smart Date Validation**:
   - Cannot select future dates for pay period
   - End date must be after start date
   - Payment date must be after end date
2. **Flexible Employee Selection**:
   - Select individual employees
   - Select all filtered employees
   - Search and filter combinations
3. **Real-time Calculations**:
   - Pay period duration calculation
   - Selected employee count
4. **Error Handling**:
   - Network error handling
   - User-friendly error messages
   - Retry functionality

## API Integration

### Endpoints Used

#### 1. Get Employments
```javascript
GET /api/employments?status=active&per_page=1000
```
Fetches active employees for selection in Step 2.

#### 2. Create Bulk Payroll
```javascript
POST /api/payrolls/bulk
```

**Request Payload:**
```json
{
  "pay_period_start": "2025-10-01",
  "pay_period_end": "2025-10-31",
  "payment_date": "2025-11-05",
  "payroll_month": "2025-10",
  "employee_ids": [1, 2, 3, 4, 5]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Bulk payroll created successfully",
  "data": {
    "created_count": 5,
    "payrolls": [...]
  }
}
```

## Usage

### For End Users

1. **Navigate to Employee Salary page**
   - Path: `/payroll/employee-salary`

2. **Click "Bulk Payroll Creation" button**
   - Located in the top-right header area

3. **Step 1: Set Pay Period**
   - Select pay period start and end dates
   - Select payment date
   - Choose payroll month
   - Review the summary
   - Click "Next"

4. **Step 2: Select Employees**
   - Use search and filters to find employees
   - Click on employee cards to select/deselect
   - Or use "Select All" for bulk selection
   - Review selection count
   - Click "Next"

5. **Step 3: Review & Submit**
   - Review summary cards
   - Check the selected employees table
   - Remove any employees if needed
   - Click "Create Payroll (X)" button

6. **Confirmation**
   - Success message appears
   - Modal closes automatically
   - Payroll list refreshes with new records

### For Developers

#### Import the Modal
```vue
<template>
  <bulk-payroll-modal 
    @refresh="handleRefresh" 
    @payroll-created="handlePayrollCreated" 
  />
</template>

<script>
export default {
  components: {
    BulkPayrollModal: () => import('@/components/modal/bulk-payroll-modal.vue'),
  },
  methods: {
    handleRefresh() {
      // Refresh your data
    },
    handlePayrollCreated(data) {
      // Handle created payroll data
    }
  }
}
</script>
```

#### Trigger the Modal
```html
<button 
  type="button" 
  data-bs-toggle="modal" 
  data-bs-target="#bulk-payroll-modal"
>
  Open Bulk Payroll
</button>
```

## Styling

### CSS Classes Used
- **Bootstrap 5**: Core layout and components
- **Ant Design Vue**: Date picker, select, table, pagination
- **Tabler Icons**: Icon set for UI elements
- **Custom Classes**: Step progress, employee cards

### Key Custom Styles
```css
.steps-progress          /* Progress bar container */
.step-item               /* Individual step */
.step-icon               /* Step icon circle */
.employee-card           /* Employee selection card */
.employee-card.selected  /* Selected employee state */
.icon-wrapper            /* Summary card icons */
```

## State Management

### Local State
```javascript
{
  currentStep: 1,                    // Current wizard step (1-3)
  submitting: false,                 // Form submission state
  loadingEmployees: false,           // Employee loading state
  formData: {
    payPeriodStart: null,            // Date
    payPeriodEnd: null,              // Date
    paymentDate: null,               // Date
    payrollMonth: 'YYYY-MM'          // String
  },
  selectedEmployees: [],             // Array of employee IDs
  employeeFilters: {
    search: '',                      // Search query
    subsidiary: null,                // Subsidiary filter
    department: null,                // Department filter
    status: 'active'                 // Status filter
  }
}
```

## Dependencies

### Required Packages
- `vue@3.x`: Core framework
- `ant-design-vue@3.x`: UI components
- `moment`: Date manipulation
- `bootstrap@5.x`: CSS framework

### Required Services
- `payrollService`: Payroll API operations
- `employmentService`: Employment API operations
- `useLookupStore`: Subsidiary lookups
- `useSharedDataStore`: Department data

## Best Practices

1. **Always validate dates** before proceeding to next step
2. **Provide clear feedback** during async operations
3. **Reset modal state** when closing
4. **Handle errors gracefully** with user-friendly messages
5. **Use pagination** for large employee lists
6. **Optimize performance** with lazy loading

## Future Enhancements

### Potential Improvements
1. **Excel Import**: Upload employee list via Excel file
2. **Payroll Templates**: Save and reuse payroll configurations
3. **Scheduled Payroll**: Schedule bulk payroll for future dates
4. **Preview Calculations**: Show estimated payroll amounts before creation
5. **Partial Success Handling**: Handle cases where some payrolls fail
6. **Batch Processing**: Process very large batches in background
7. **Email Notifications**: Send payslip notifications after creation
8. **Audit Trail**: Track who created bulk payroll records

## Troubleshooting

### Common Issues

#### Modal doesn't open
- Ensure Bootstrap JS is loaded
- Check `data-bs-toggle` and `data-bs-target` attributes
- Verify modal ID is `bulk-payroll-modal`

#### Employees not loading
- Check `employmentService.getEmployments()` implementation
- Verify API endpoint is accessible
- Check network tab for errors

#### Date picker not working
- Ensure Ant Design Vue is properly installed
- Check moment.js is available
- Verify date picker styles are loaded

#### Submission fails
- Check `payrollService.createBulkPayroll()` implementation
- Verify API endpoint configuration
- Check request payload format
- Review backend validation rules

## Testing Checklist

- [ ] Modal opens correctly
- [ ] Step 1: All date fields work
- [ ] Step 1: Date validation works
- [ ] Step 1: Duration calculation is correct
- [ ] Step 2: Employees load successfully
- [ ] Step 2: Search filter works
- [ ] Step 2: Subsidiary filter works
- [ ] Step 2: Department filter works
- [ ] Step 2: Employee selection works
- [ ] Step 2: Select all works
- [ ] Step 2: Clear selection works
- [ ] Step 2: Pagination works
- [ ] Step 3: Summary displays correctly
- [ ] Step 3: Employee table shows all selected
- [ ] Step 3: Remove employee works
- [ ] Submit creates payroll successfully
- [ ] Success message appears
- [ ] Modal closes after success
- [ ] Parent page refreshes data
- [ ] Modal resets state on close

## Performance Considerations

1. **Lazy Load Modal**: Component is lazy-loaded to reduce initial bundle size
2. **Paginated Employee List**: Only render 12 employees at a time
3. **Debounced Search**: Prevents excessive filtering operations
4. **Optimized Re-renders**: Uses computed properties for derived state
5. **Event Cleanup**: Properly removes event listeners on unmount

## Security Considerations

1. **API Validation**: All data validated on backend
2. **Authentication**: Requires authenticated user
3. **Authorization**: Check user permissions for bulk payroll creation
4. **Input Sanitization**: All inputs sanitized before API calls
5. **CSRF Protection**: Uses CSRF tokens for POST requests

---

**Version:** 1.0.0  
**Last Updated:** October 6, 2025  
**Author:** HRMS Development Team

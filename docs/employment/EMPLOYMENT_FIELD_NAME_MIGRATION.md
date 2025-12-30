# Employment Field Name Migration Guide

**Version:** 1.1  
**Date:** October 14, 2025  
**Status:** ✅ Complete

---

## Overview

The Employment Management System has undergone field name standardization to improve clarity and consistency across the entire HRMS. This document outlines the changes and their implications for the frontend.

---

## Field Name Changes

### 1. Probation Pass Date Field

**OLD:** `probation_pass_date`  
**NEW:** `pass_probation_date`

**Rationale:**
- More grammatically correct ("pass probation" is the action)
- Consistent with salary field naming convention
- Clearer intent: "date when employee passes probation"

**Impact Areas:**
- Database schema
- API request/response payloads
- Frontend form fields
- Validation rules
- Query parameters

### 2. Position Salary Field

**OLD:** `position_salary`  
**NEW:** `pass_probation_salary`

**Rationale:**
- Clarifies this is the **regular salary** after passing probation
- Distinguishes from `probation_salary` (during probation)
- Aligns with business logic and payroll calculations
- More descriptive and self-documenting

**Impact Areas:**
- Database schema
- API payloads
- Salary calculations
- Payroll processing
- Funding allocation calculations

---

## Frontend Changes Made

### Files Updated

#### 1. Employment Modal Component
**File:** `src/components/modal/employment-modal.vue`

**Changes:**
- ✅ All 29 occurrences of `probation_pass_date` → `pass_probation_date`
- ✅ All 15 occurrences of `position_salary` → `pass_probation_salary`
- ✅ Form data structure updated
- ✅ Validation error keys updated
- ✅ Computed properties updated
- ✅ Date picker bindings updated
- ✅ API payload builder updated

**Key Sections Updated:**
```javascript
// Form data structure
formData: {
  pass_probation_date: null,      // Was: probation_pass_date
  pass_probation_salary: '',      // Was: position_salary
  probation_salary: '',           // Unchanged
  // ...
}

// Computed properties
computedProbationPassDate: {
  get() {
    return this.formData.pass_probation_date;
  },
  set(value) {
    this.formData.pass_probation_date = this.safeConvertToDate(value);
  }
}

// API payload
buildPayloadForAPI() {
  return {
    pass_probation_date: this.formatDateForAPI(this.formData.pass_probation_date),
    pass_probation_salary: this.formData.pass_probation_salary,
    // ...
  };
}
```

#### 2. Employment List Component
**File:** `src/views/pages/hrm/employment/employment-list.vue`

**Changes:**
- ✅ All 4 occurrences of `probation_pass_date` → `pass_probation_date`
- ✅ All 4 occurrences of `position_salary` → `pass_probation_salary`
- ✅ Table column definitions updated
- ✅ Data mapping updated
- ✅ Sort field mapping updated

**Key Sections Updated:**
```javascript
// Column definition
{
  title: 'Probation Pass Date',
  dataIndex: 'pass_probation_date',     // Was: probation_pass_date
  key: 'pass_probation_date',
  sorter: true,
  sortOrder: sorted.columnKey === 'pass_probation_date' && sorted.order
}

// Data mapping
const processedData = response.data.map(emp => ({
  // ...
  salary: emp.pass_probation_salary,   // Was: position_salary
  // ...
}));
```

#### 3. Employment Service
**File:** `src/services/employment.service.js`

**Changes:**
- ✅ Added `completeProbation(id)` method
- ✅ Documentation updated with new field names
- ✅ JSDoc examples updated

**New Method:**
```javascript
/**
 * Manually complete probation for an employment
 * @param {number} id - Employment ID
 * @returns {Promise<Object>} Response with updated employment and allocations
 */
async completeProbation(id) {
    const endpoint = API_ENDPOINTS.EMPLOYMENT.COMPLETE_PROBATION?.replace(':id', id) 
        || `/employments/${id}/complete-probation`;
    return await this.handleApiResponse(
        () => apiService.post(endpoint),
        `complete probation for employment ${id}`
    );
}
```

#### 4. API Configuration
**File:** `src/config/api.config.js`

**Changes:**
- ✅ Added `COMPLETE_PROBATION: '/employments/:id/complete-probation'` endpoint

---

## Backend Alignment

### Key Backend Changes (v1.1)

1. **Standardized 30-Day Month Calculations**
   - All salary calculations now use 30-day month regardless of actual calendar days
   - Ensures consistent pro-rating across all months
   - Formula: `daily_rate = salary / 30`

2. **Auto-Calculation of pass_probation_date**
   - If not provided: `pass_probation_date = start_date + 3 months`
   - Automatically updated when start_date changes
   - Consistent probation period across all employments

3. **Probation Transition Service**
   - New service class: `ProbationTransitionService`
   - Handles all probation-related calculations
   - Methods: `calculateProRatedSalary()`, `calculateFirstMonthSalary()`, etc.

4. **Automated Probation Completion**
   - Daily scheduled job at 00:01
   - Automatically processes employees passing probation
   - Updates funding allocations from probation to regular salary
   - Creates employment history entries

5. **Manual Probation Completion Endpoint**
   - `POST /api/employments/{id}/complete-probation`
   - For manual override or testing
   - Same logic as automated process

---

## Migration Impact Analysis

### Breaking Changes

❌ **API Payloads:**
- Old requests using `probation_pass_date` will fail validation
- Old requests using `position_salary` will fail validation

❌ **API Responses:**
- Frontend expecting old field names will get `undefined`
- Data mapping will break without updates

### Non-Breaking Changes

✅ **Backward Compatibility:**
- Backend may still accept old field names (if migration helper is in place)
- But this is temporary and should not be relied upon

### Data Integrity

✅ **Database Migration:**
- Backend handles database column renaming
- Data preserved during migration
- No data loss

✅ **Existing Records:**
- All existing employments updated with new field names
- Historical data remains intact
- Employment histories maintained

---

## Testing Checklist

### Unit Tests

- [ ] Employment modal form data uses new field names
- [ ] Employment list displays data with new field names
- [ ] Employment service methods use correct field names
- [ ] API payloads contain new field names

### Integration Tests

- [ ] Create employment with new field names
- [ ] Update employment with new field names
- [ ] Load employment details with new field names
- [ ] Search employments returns new field names
- [ ] Complete probation endpoint works

### E2E Tests

- [ ] **Create Employment Flow:**
  1. Open employment modal
  2. Fill form fields (note: pass_probation_date, pass_probation_salary)
  3. Submit successfully
  4. Verify employment created with correct fields

- [ ] **View Employment Flow:**
  1. Open employment list
  2. Verify columns display correct data
  3. Sort by pass_probation_date works
  4. Filter works correctly

- [ ] **Edit Employment Flow:**
  1. Open edit modal
  2. Fields populated with new field names
  3. Update pass_probation_salary
  4. Save successfully

- [ ] **Probation Completion Flow:**
  1. Employment with pass_probation_date = today
  2. Manually trigger completion (if endpoint exposed)
  3. Verify funding allocations updated
  4. Verify employment history created

### Manual Testing Scenarios

**Scenario 1: Create New Employment**
```
Given: I am on the employment creation page
When: I fill in pass_probation_date and pass_probation_salary
And: I submit the form
Then: Employment is created successfully
And: Backend stores data with new field names
```

**Scenario 2: Edit Existing Employment**
```
Given: I open an existing employment
When: I change the pass_probation_salary
And: I save the changes
Then: Employment is updated successfully
And: Employment history is created with change details
```

**Scenario 3: View Employment List**
```
Given: I am on the employment list page
When: The list loads
Then: I see "Probation Pass Date" column
And: I see salary values from pass_probation_salary
And: Sorting by pass_probation_date works
```

---

## Troubleshooting

### Issue 1: Frontend showing `undefined` for dates

**Cause:** Frontend still using old `probation_pass_date` field name

**Solution:**
```javascript
// ❌ Old (wrong)
const date = employment.probation_pass_date;

// ✅ New (correct)
const date = employment.pass_probation_date;
```

### Issue 2: API validation errors

**Error Message:** `"The probation_pass_date field is required"`

**Cause:** Sending old field name in request

**Solution:**
```javascript
// ❌ Old payload
{
  probation_pass_date: "2025-04-15",
  position_salary: 50000
}

// ✅ New payload
{
  pass_probation_date: "2025-04-15",
  pass_probation_salary: 50000
}
```

### Issue 3: Salary calculations incorrect

**Cause:** Using old `position_salary` field which no longer exists

**Solution:**
```javascript
// ❌ Old (wrong)
const salary = employment.position_salary;

// ✅ New (correct)
const salary = employment.pass_probation_salary;
```

### Issue 4: Cannot find employment data

**Cause:** Database queries using old field names

**Solution:**
- All queries should use `pass_probation_date` and `pass_probation_salary`
- Backend API returns data with new field names
- Frontend must map to new field names

---

## Best Practices

### ✅ Do's

1. **Use New Field Names Everywhere:**
   ```javascript
   const employment = {
     pass_probation_date: '2025-04-15',
     pass_probation_salary: 50000,
     probation_salary: 45000
   };
   ```

2. **Update All References:**
   - Form fields
   - Validation rules
   - API payloads
   - Data mapping
   - Display templates

3. **Test Thoroughly:**
   - Create, read, update, delete operations
   - All employment-related features
   - Integration with payroll, funding allocations

4. **Document Changes:**
   - Update component documentation
   - Update API documentation
   - Update user guides

### ❌ Don'ts

1. **Don't Mix Old and New:**
   ```javascript
   // ❌ Don't do this
   const employment = {
     pass_probation_date: '2025-04-15',  // New
     position_salary: 50000               // Old - wrong!
   };
   ```

2. **Don't Assume Backward Compatibility:**
   - Old field names may not work
   - Always use new field names
   - Don't rely on fallbacks

3. **Don't Skip Testing:**
   - Field name changes affect entire system
   - Test all employment flows
   - Verify data integrity

---

## Quick Reference

### Field Name Mapping

| Old Field Name | New Field Name | Type | Purpose |
|----------------|----------------|------|---------|
| `probation_pass_date` | `pass_probation_date` | Date | Date employee passes probation |
| `position_salary` | `pass_probation_salary` | Decimal(10,2) | Regular salary after probation |
| `probation_salary` | `probation_salary` | Decimal(10,2) | **Unchanged** - Salary during probation |

### Updated API Endpoints

| Method | Endpoint | New Fields Used |
|--------|----------|-----------------|
| GET | `/api/employments` | Returns `pass_probation_date`, `pass_probation_salary` |
| POST | `/api/employments` | Accepts `pass_probation_date`, `pass_probation_salary` |
| PATCH | `/api/employments/{id}` | Accepts `pass_probation_date`, `pass_probation_salary` |
| GET | `/api/employments/{id}` | Returns `pass_probation_date`, `pass_probation_salary` |
| POST | `/api/employments/{id}/complete-probation` | **NEW** - Completes probation |

### Code Search & Replace

If you need to update other files, use these patterns:

```bash
# Find old field names
grep -r "probation_pass_date" src/
grep -r "position_salary" src/

# Replace patterns (in your IDE or editor)
Find: probation_pass_date
Replace: pass_probation_date

Find: position_salary
Replace: pass_probation_salary
```

---

## Summary

✅ **All field name migrations complete**  
✅ **Frontend fully aligned with backend v1.1**  
✅ **No linting errors**  
✅ **Documentation updated**  
✅ **Ready for testing and deployment**

**Key Takeaways:**
1. `probation_pass_date` → `pass_probation_date` (more grammatically correct)
2. `position_salary` → `pass_probation_salary` (clearer purpose)
3. Backend uses standardized 30-day month for all calculations
4. Automated probation completion runs daily
5. Manual probation completion endpoint available

---

**Document Maintained By:** Development Team  
**Last Updated:** October 14, 2025  
**Status:** ✅ Migration Complete


# Bulk Payroll Preview - Testing Guide

**Date:** January 10, 2026  
**Purpose:** Step-by-step testing guide for the new bulk payroll preview feature

---

## Prerequisites

### **Backend**
- ✅ Laravel application running
- ✅ Database with test data (employees, employments, funding allocations)
- ✅ At least 10-20 test employees with active allocations
- ✅ Mix of SMRU and BHF employees
- ✅ Some employees with multiple allocations

### **Frontend**
- ✅ Vue application running (`npm run dev`)
- ✅ Logged in with user having `employee_salary.edit` permission
- ✅ Browser console open for debugging

---

## Test Scenarios

### **Test 1: Basic Preview Flow**

**Steps:**
1. Navigate to Employee Salary page (`/payroll/employee-salary`)
2. Click "Create Payroll" button
3. **Step 1:** Select current month (e.g., "January 2026")
4. Click "Next"
5. **Step 2:** Select organization "SMRU"
6. Click "Calculate Preview"
7. Wait for preview to load

**Expected Results:**
- ✅ Step 3 displays with summary cards showing:
  - Total employees count
  - Total payroll records count
  - Total net salary
  - Number of advances needed
- ✅ Detailed employee breakdown appears below summary
- ✅ Search box is visible
- ✅ Pagination controls appear (if > 10 employees)

**Screenshot:** Take screenshot of Step 3 preview

---

### **Test 2: Employee Accordion**

**Steps:**
1. Complete Test 1 to reach Step 3
2. Click on first employee accordion header
3. Observe allocation details table
4. Click on another employee
5. Verify first employee collapses

**Expected Results:**
- ✅ Accordion expands smoothly
- ✅ Table displays with columns: Grant, FTE, Gross, Deductions, Net, Advance
- ✅ All amounts are formatted with ฿ symbol
- ✅ FTE shows as badge (e.g., "1.00")
- ✅ Advance column shows "Yes" badge or "-"
- ✅ Employee total row shows correct sums
- ✅ Only one accordion open at a time

**Screenshot:** Take screenshot of expanded employee

---

### **Test 3: Deduction Breakdown Popover**

**Steps:**
1. Expand an employee accordion
2. Click on the deduction amount (red text with info icon)
3. Observe popover content
4. Click elsewhere to close popover

**Expected Results:**
- ✅ Popover appears above/below the clicked amount
- ✅ Shows breakdown:
  - Tax: ฿X,XXX.XX
  - Employee SS: ฿XXX.XX
  - Employee HW: ฿XXX.XX
  - Total: ฿X,XXX.XX (in red)
- ✅ Popover closes when clicking outside

**Screenshot:** Take screenshot of popover

---

### **Test 4: Search Functionality**

**Steps:**
1. In Step 3 preview, type employee name in search box
2. Observe filtered results
3. Clear search
4. Type staff ID
5. Observe filtered results
6. Type department name
7. Observe filtered results

**Expected Results:**
- ✅ Results filter in real-time as you type
- ✅ Search works for: name, staff ID, department
- ✅ Search is case-insensitive
- ✅ "X employees" count updates
- ✅ Pagination resets to page 1
- ✅ "No results" message if no matches

**Test Data:**
- Search: "John" → Should show all Johns
- Search: "EMP001" → Should show that staff ID
- Search: "Research" → Should show Research department

---

### **Test 5: Pagination**

**Steps:**
1. Complete preview with 20+ employees
2. Verify pagination controls appear
3. Click "Next" or page number
4. Observe new employees load
5. Click "Previous"
6. Verify you return to previous page

**Expected Results:**
- ✅ Shows 10 employees per page
- ✅ Pagination shows correct total
- ✅ Page navigation works smoothly
- ✅ Current page is highlighted
- ✅ Accordion state resets on page change

---

### **Test 6: Visual Indicators**

**Steps:**
1. In Step 3, observe employee avatars
2. Check SMRU employees have blue avatars
3. Check BHF employees have green avatars
4. Look for warning badges (!) on employees with issues
5. Verify color coding:
   - Gross amounts: Blue
   - Deductions: Red
   - Net amounts: Green

**Expected Results:**
- ✅ SMRU: Blue avatar (#1890ff)
- ✅ BHF: Green avatar (#52c41a)
- ✅ Warning badge appears for problematic employees
- ✅ Amounts are color-coded correctly
- ✅ Badges use appropriate colors

---

### **Test 7: Multiple Allocations**

**Steps:**
1. Find employee with 2+ allocations
2. Expand their accordion
3. Verify all allocations are listed
4. Check employee total row sums all allocations

**Expected Results:**
- ✅ Multiple rows in allocation table
- ✅ Each allocation shows different grant
- ✅ FTE may differ per allocation
- ✅ Employee total = sum of all allocation net salaries
- ✅ Advance indicator per allocation

---

### **Test 8: Inter-Subsidiary Advances**

**Steps:**
1. Find employee with "Yes" in Advance column
2. Hover over or note the grant organization
3. Compare with employee organization
4. Verify they are different

**Expected Results:**
- ✅ Advance badge shows when grant org ≠ employee org
- ✅ Example: SMRU employee on BHF grant → Advance needed
- ✅ Badge is orange/warning color
- ✅ Icon shows arrow-right-circle

---

### **Test 9: Warnings Display**

**Steps:**
1. If warnings exist, observe warnings section
2. Check first 5 warnings are shown
3. If > 5 warnings, click "Show all X warnings"
4. Verify all warnings appear

**Expected Results:**
- ✅ Warning section appears below summary cards
- ✅ Yellow/warning styling
- ✅ Alert icon on each warning
- ✅ "Show all" button if > 5 warnings
- ✅ All warnings visible after clicking button

---

### **Test 10: Complete Flow**

**Steps:**
1. Complete preview (Test 1-9)
2. Click "Create Payroll (X)" button
3. Observe Step 4 progress tracking
4. Wait for completion
5. Verify success message
6. Check payroll records created in database

**Expected Results:**
- ✅ Progress bar appears
- ✅ Real-time updates via WebSocket or polling
- ✅ Success message on completion
- ✅ Modal closes or shows "Done" button
- ✅ Payroll records exist in database
- ✅ Amounts match preview

---

### **Test 11: Edge Cases**

#### **11a: No Employees Match Filters**
**Steps:**
1. Select organization with no active employees
2. Click "Calculate Preview"

**Expected:** Error message or empty state

#### **11b: Employee with No Allocations**
**Steps:**
1. Preview with employee having no funding allocations

**Expected:** Warning in warnings list, employee excluded from preview

#### **11c: Invalid Pay Period**
**Steps:**
1. Select future pay period (if allowed)
2. Calculate preview

**Expected:** Appropriate handling or validation error

#### **11d: Network Error**
**Steps:**
1. Disconnect network
2. Try to calculate preview

**Expected:** Error message, retry option

---

### **Test 12: Responsive Design**

**Steps:**
1. Open preview on desktop (1920x1080)
2. Verify layout
3. Resize to tablet (768px)
4. Verify layout adjusts
5. Resize to mobile (375px)
6. Verify layout is usable

**Expected Results:**
- ✅ Desktop: Full layout with all columns
- ✅ Tablet: Adjusted spacing, readable
- ✅ Mobile: Stacked layout, horizontal scroll for table
- ✅ Search box adjusts width
- ✅ Pagination remains functional

---

### **Test 13: Performance**

**Test Data:**
- 10 employees: < 2 seconds
- 50 employees: < 5 seconds
- 100 employees: < 10 seconds

**Steps:**
1. Time preview calculation
2. Time frontend render
3. Test search response time
4. Test pagination navigation

**Expected:**
- ✅ Preview loads within acceptable time
- ✅ Search is instant (< 100ms)
- ✅ Pagination is instant (< 50ms)
- ✅ No browser freezing or lag

---

## Bug Reporting Template

If you find a bug, report it using this template:

```markdown
**Bug Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**


**Actual Result:**


**Screenshot/Video:**
[Attach if applicable]

**Browser:** Chrome 120 / Firefox 121 / Safari 17

**Console Errors:**
[Paste any console errors]

**Additional Context:**

```

---

## Test Results Checklist

### **Backend Tests**
- [ ] Preview with 1 employee
- [ ] Preview with 10 employees
- [ ] Preview with 50+ employees
- [ ] Preview with invalid filters
- [ ] Preview with no matching employees
- [ ] All calculation fields correct
- [ ] Advance detection works
- [ ] Multiple allocations handled
- [ ] Warnings display correctly

### **Frontend Tests**
- [ ] Step 3 displays correctly
- [ ] Employee accordion works
- [ ] Search functionality works
- [ ] Pagination works
- [ ] Deduction popover works
- [ ] Amounts display correctly
- [ ] Empty state handled
- [ ] Single employee works
- [ ] 100+ employees works
- [ ] Responsive on mobile
- [ ] Avatar colors correct
- [ ] Warning badges show
- [ ] Advance indicators correct

### **Integration Tests**
- [ ] Complete flow works
- [ ] Preview matches created records
- [ ] Real database data works
- [ ] Different organizations work
- [ ] Different pay periods work
- [ ] WebSocket tracking works
- [ ] Modal close/reset works

---

## Sign-Off

**Tested By:** ___________________  
**Date:** ___________________  
**Result:** ☐ Pass  ☐ Fail  ☐ Pass with Issues  

**Issues Found:** ___________________

**Notes:**
___________________
___________________
___________________

---

**Ready for Production:** ☐ Yes  ☐ No  ☐ With Fixes



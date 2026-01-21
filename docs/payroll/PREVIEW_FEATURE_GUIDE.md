# Bulk Payroll Preview - Visual Feature Guide

**Date:** January 10, 2026  
**Audience:** End Users  
**Purpose:** Quick visual guide to the new preview feature

---

## 🎯 What's New?

Before creating bulk payroll, you can now **see detailed calculations for every employee** including:
- ✅ Individual employee breakdown
- ✅ Per-allocation details
- ✅ Deductions, contributions, and net salary
- ✅ Inter-subsidiary advances
- ✅ Search and filter capabilities

---

## 📖 How to Use

### **Step 1: Open Bulk Payroll Modal**

Navigate to: **Payroll → Employee Salary**

Click: **"Create Payroll"** button (top right)

---

### **Step 2: Select Pay Period**

```
┌─────────────────────────────────────┐
│ 📅 Pay Period (Month) *             │
│ [January 2026 ▼]                    │
│                                      │
│ Selected: January 2026               │
└─────────────────────────────────────┘
```

**Action:** Select the month for payroll creation

**Click:** "Next" button

---

### **Step 3: Select Organization**

```
┌─────────────────────────────────────┐
│ 🏢 Select Organization *            │
│ ○ SMRU                               │
│ ○ BHF                                │
│                                      │
│ ℹ️ All active employees in SMRU     │
│    will be included                  │
└─────────────────────────────────────┘
```

**Action:** Choose SMRU or BHF

**Click:** "Calculate Preview" button

---

### **Step 4: Review Detailed Preview** ⭐ NEW!

#### **A. Summary Cards**

```
┌─────────────────────────────────────────────────────────┐
│  📊 Quick Statistics                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │    50    │ │    75    │ │ ฿950,000 │ │    5     │  │
│  │Employees │ │ Payrolls │ │Net Total │ │ Advances │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

**What you see:**
- Total number of employees
- Total payroll records (may be > employees if multiple allocations)
- Total net salary across all employees
- Number of inter-subsidiary advances needed

---

#### **B. Search Employees** ⭐ NEW!

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Search: [Type name, staff ID, or department...    ] │
└─────────────────────────────────────────────────────────┘
```

**How to use:**
- Type employee name: "John"
- Type staff ID: "EMP001"
- Type department: "Research"
- Results filter instantly as you type

---

#### **C. Employee List** ⭐ NEW!

```
┌─────────────────────────────────────────────────────────┐
│ 📋 Detailed Breakdown (50 employees)                    │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 👤 EMP001 - John Doe                           ▼   │ │
│ │    Research • Senior Researcher                     │ │
│ │    2 allocations                          ฿43,750   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 👤 EMP002 - Jane Smith                         ▶   │ │
│ │    Administration • HR Manager                      │ │
│ │    1 allocation                           ฿40,000   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 👤 EMP003 - Bob Wilson                    ⚠️  ▶   │ │
│ │    Finance • Accountant                             │ │
│ │    1 allocation                           ฿35,000   │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**What you see:**
- 👤 Avatar (Blue = SMRU, Green = BHF)
- Staff ID and Full Name
- Department and Position
- Number of funding allocations
- Total net salary for this employee
- ⚠️ Warning badge if there are issues
- ▶/▼ Click to expand/collapse

---

#### **D. Allocation Details** ⭐ NEW!

**Click on an employee to expand:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ 👤 EMP001 - John Doe                                            ▼   │
│    Research • Senior Researcher                                      │
│    2 allocations                                          ฿43,750    │
├─────────────────────────────────────────────────────────────────────┤
│ Grant          │FTE │  Gross   │Deductions│   Net    │ Advance     │
├─────────────────────────────────────────────────────────────────────┤
│ MRG-2025       │1.00│ ฿50,000  │ ฿6,250 ℹ️│ ฿43,750  │ ⚠️ Yes     │
│ Malaria Grant  │    │          │          │          │             │
│                │    │By FTE:   │          │          │             │
│                │    │฿50,000   │          │          │             │
├─────────────────────────────────────────────────────────────────────┤
│ Employee Total:                  ฿50,000             ฿43,750        │
└─────────────────────────────────────────────────────────────────────┘
```

**What you see:**
- **Grant:** Code and full name
- **FTE:** Full-time equivalent (e.g., 1.00 = 100%, 0.50 = 50%)
- **Gross:** Total gross salary and gross by FTE
- **Deductions:** Total deductions (click ℹ️ for breakdown)
- **Net:** Final net salary
- **Advance:** Shows if inter-subsidiary advance needed

---

#### **E. Deduction Breakdown** ⭐ NEW!

**Click on deduction amount (red text with ℹ️ icon):**

```
┌───────────────────────────────┐
│ Deduction Breakdown           │
├───────────────────────────────┤
│ Tax:              ฿5,000.00   │
│ Employee SS:        ฿750.00   │
│ Employee HW:        ฿500.00   │
├───────────────────────────────┤
│ Total:            ฿6,250.00   │
└───────────────────────────────┘
```

**What you see:**
- Individual tax amount
- Social Security (employee portion)
- Health & Welfare (employee portion)
- Total deductions

**Note:** Click anywhere outside to close

---

#### **F. Pagination** ⭐ NEW!

```
┌─────────────────────────────────────────────────────────┐
│                « 1  2  3  4  5 »                        │
│              Showing 1-10 of 50 employees               │
└─────────────────────────────────────────────────────────┘
```

**How to use:**
- Click page numbers to navigate
- Click « for previous page
- Click » for next page
- Shows 10 employees per page

---

### **Step 5: Create Payroll**

After reviewing the preview:

**Click:** "Create Payroll (75)" button

```
┌─────────────────────────────────────────────────────────┐
│ ✅ Ready to Create:                                     │
│ This will create 75 payroll records for 50 employees   │
│ in SMRU. Click "Create Payroll" to proceed.            │
│                                                          │
│ [Cancel]  [← Previous]  [Create Payroll (75) ✓]        │
└─────────────────────────────────────────────────────────┘
```

---

### **Step 6: Track Progress**

Watch real-time progress:

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Processing Payroll Records                           │
│                                                          │
│ Progress: ████████████░░░░░░░░ 65%                     │
│           49 / 75                                        │
│                                                          │
│ Currently Processing:                                    │
│ John Doe - Malaria Research Grant                       │
│                                                          │
│ ✅ Successful: 48  ❌ Failed: 1  📊 Advances: 5         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Indicators

### **Avatar Colors**
- 🔵 **Blue** = SMRU employee
- 🟢 **Green** = BHF employee

### **Amount Colors**
- 🔵 **Blue** = Gross salary (income)
- 🔴 **Red** = Deductions
- 🟢 **Green** = Net salary (take-home)

### **Badges**
- **FTE Badge** (Blue) = Full-time equivalent
- **Advance Badge** (Orange) = Inter-subsidiary advance needed
- **Warning Badge** (Red !) = Employee has issues

---

## 💡 Tips & Tricks

### **Tip 1: Quick Search**
Instead of scrolling through all employees, use search:
- Type "EMP" to see all staff IDs starting with EMP
- Type department name to see all in that department

### **Tip 2: Verify Calculations**
Before creating payroll:
1. Expand a few random employees
2. Click on deduction amounts to see breakdown
3. Verify amounts match your expectations

### **Tip 3: Check Advances**
Look for orange "Yes" badges in Advance column:
- These indicate money needs to be transferred between subsidiaries
- Example: SMRU employee on BHF grant = BHF pays SMRU

### **Tip 4: Review Warnings**
If you see warnings:
- Read each warning carefully
- Fix issues before creating payroll
- Or proceed with caution if warnings are acceptable

### **Tip 5: Multiple Allocations**
Some employees have 2+ allocations:
- Each allocation is a separate payroll record
- Employee total = sum of all allocations
- Useful for employees working on multiple grants

---

## ❓ FAQ

### **Q: Why do I see more payroll records than employees?**
**A:** Employees with multiple funding allocations get one payroll record per allocation.
- Example: 50 employees with 75 allocations = 75 payroll records

### **Q: What does "Advance" mean?**
**A:** Inter-subsidiary advance is needed when:
- Employee organization ≠ Grant organization
- Example: SMRU employee on BHF grant
- BHF pays salary, SMRU reimburses BHF

### **Q: Can I exclude specific employees?**
**A:** Not in current version. Use organization filter only.
- Future enhancement: Department and grant filters

### **Q: How do I export the preview?**
**A:** Not available yet. Planned for future release.
- Workaround: Take screenshots or manually note amounts

### **Q: What if preview takes too long?**
**A:** Preview calculation time depends on employee count:
- 10 employees: ~2 seconds
- 50 employees: ~5 seconds
- 100+ employees: ~10 seconds
- If stuck, refresh and try again

### **Q: Can I edit amounts in preview?**
**A:** No, preview is read-only. To change amounts:
- Edit employee salary in Employment module
- Edit funding allocation percentages
- Then recalculate preview

---

## 🐛 Troubleshooting

### **Problem: Preview won't load**
**Solutions:**
1. Check internet connection
2. Verify you selected organization
3. Refresh page and try again
4. Check browser console for errors

### **Problem: Search doesn't work**
**Solutions:**
1. Clear search box and try again
2. Check spelling
3. Try different search term
4. Refresh page if needed

### **Problem: Accordion won't expand**
**Solutions:**
1. Click directly on employee header
2. Avoid clicking on avatar or badges
3. Try different employee
4. Refresh page if needed

### **Problem: Deduction popover won't show**
**Solutions:**
1. Click directly on red deduction amount
2. Look for ℹ️ icon next to amount
3. Try clicking again
4. Close any open popovers first

---

## 📞 Need Help?

**Contact:** IT Support / HR Department  
**Documentation:** See `BULK_PAYROLL_TESTING_GUIDE.md` for detailed testing  
**Technical Issues:** Report to system administrator

---

## ✅ Quick Checklist

Before creating payroll, verify:
- [ ] Correct pay period selected
- [ ] Correct organization selected
- [ ] Employee count looks right
- [ ] Total net salary seems reasonable
- [ ] Reviewed a few employee details
- [ ] Checked for warnings
- [ ] Noted any advances needed
- [ ] Ready to proceed

---

**Last Updated:** January 10, 2026  
**Version:** 1.0  
**Feature Status:** ✅ Active


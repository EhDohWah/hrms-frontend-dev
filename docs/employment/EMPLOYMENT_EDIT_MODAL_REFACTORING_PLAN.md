# Employment Edit Modal Refactoring Plan

**Date:** January 14, 2026  
**Task:** Refactor `employment-edit-modal.vue` following the pattern from `employment-modal.vue`  
**Status:** 📋 Planning Phase

---

## Executive Summary

### Current State
- **File:** `employment-edit-modal.vue`
- **Lines:** 1,174 lines (monolithic)
- **Pattern:** Options API with `data()`, `methods`, `computed`
- **Mode:** Edit existing employment records

### Target State
- **Pattern:** Composition API with extracted composables (same as create modal)
- **Composables:** Reuse 5 existing composables with edit mode support
- **Lines:** ~500-600 (template + minimal script orchestration)
- **Shared Component:** `EmployeeTreeSelect.vue` (already created)

---

## Analysis: Current vs Refactored Create Modal

### Structural Comparison

| Aspect | employment-edit-modal.vue (Current) | employment-modal.vue (Refactored) | Notes |
|--------|-------------------------------------|-----------------------------------|-------|
| **Total Lines** | 1,174 | 2,675 | Edit is simpler (no EmployeeTreeSelect embedded) |
| **Script Lines** | ~600 | ~400 (orchestration only) | Edit has less complex logic |
| **API Pattern** | Options API | Composition API | Must convert |
| **State Management** | `data()` object | Composables | Must extract |
| **Lifecycle** | mounted/beforeUnmount | onMounted/onBeforeUnmount | Must convert |
| **Employee Select** | Hardcoded readonly display | EmployeeTreeSelect component | Already simple in edit |

### Key Differences: Edit vs Create Mode

| Feature | Create Mode | Edit Mode | Implication |
|---------|-------------|-----------|-------------|
| **Employee Selection** | Interactive tree select | Read-only display | ✅ Simpler! No need for complex selector |
| **Data Loading** | Empty form | Load from API + populate | ✅ Add `loadEmployment()` method |
| **Allocations** | User adds from scratch | Load existing + allow edit | ✅ Add `loadAllocations()` method |
| **API Endpoint** | POST `/employments` | PUT `/employments/{id}` | ✅ Use `updateEmployment()` |
| **Validation** | Full validation | Same validation | ✅ Reuse existing |
| **Draft Persistence** | New draft | Separate draft key | ✅ Use different key |
| **Employee ID** | User selects | Pre-populated (read-only) | ✅ Remove selector logic |
| **Employment ID** | null (not created yet) | Loaded from data | ✅ Track throughout |

---

## Refactoring Strategy

### ✅ **Recommendation: Option A - Extend Existing Composables**

**Rationale:**
1. **Edit and create logic is 85% identical**
2. **Less code duplication** (DRY principle)
3. **Easier maintenance** (one place to fix bugs)
4. **Smaller bundle size**
5. **Consistent behavior** between create and edit

### Composables Modification Plan

#### 1. **useEmploymentForm.js** - MODIFY

**Changes Needed:**
```javascript
export function useEmploymentForm(options = {}) {
  const { 
    mode = 'create',        // ✅ NEW: 'create' or 'edit'
    employmentId = null,    // ✅ NEW: For edit mode
    onFormChange, 
    onEmploymentSaved,      // ✅ KEEP: for create
    onEmploymentUpdated,    // ✅ NEW: for edit
    onError 
  } = options;

  // ✅ NEW METHODS:
  const loadEmployment = async (id) => { ... };
  const handleUpdateEmployment = async () => { ... };
  
  // ✅ MODIFY EXISTING:
  const handleSaveEmploymentOnly = async () => {
    if (mode === 'edit') {
      return handleUpdateEmployment();
    }
    // existing create logic...
  };
}
```

**New Functionality:**
- ✅ `loadEmployment(id)` - Fetch employment record and populate form
- ✅ `handleUpdateEmployment()` - PUT/PATCH instead of POST
- ✅ Mode-aware validation (if any differences)
- ✅ Different success callbacks based on mode

#### 2. **useAllocationManager.js** - MODIFY

**Changes Needed:**
```javascript
export function useAllocationManager(options = {}) {
  const { 
    formData,
    mode = 'create',                    // ✅ NEW
    employmentId = null,                // ✅ NEW
    onFormChange,
    onAllocationsSaved,                 // ✅ KEEP
    onAllocationsUpdated,               // ✅ NEW
    onError
  } = options;

  // ✅ NEW METHODS:
  const loadAllocations = async (employmentId) => { ... };
  
  // ✅ MODIFY EXISTING:
  const handleSaveAllocationsOnly = async (empId, formatDate) => {
    // For edit mode, may need to handle UPDATE vs CREATE for allocations
    // For now, backend recreates all allocations (delete old, create new)
    // So no change needed here!
  };
}
```

**New Functionality:**
- ✅ `loadAllocations(employmentId)` - Fetch and populate existing allocations
- ✅ Mode parameter (for future use)
- ⚠️ **Note:** Current API likely **replaces all allocations** on update, so no per-allocation edit needed

#### 3. **useDraftPersistence.js** - MINOR MODIFY

**Changes Needed:**
```javascript
export function useDraftPersistence(options = {}) {
  const {
    formData,
    fundingAllocations,
    currentAllocation,
    selectedEmployeeInfo,
    safeConvertToDate,
    onGrantChange,
    onEmployeeChange,
    draftKey = 'employment-modal-draft',  // ✅ NEW: customizable key
    debounceDelay = 1000
  } = options;

  // ✅ CHANGE: Use custom draft key
  const formDraftKey = draftKey; // Instead of hardcoded 'employment-modal-draft'
}
```

**Changes:**
- ✅ Allow custom `draftKey` parameter
- ✅ Edit modal uses: `draftKey: 'employment-edit-modal-draft'`
- ✅ Prevents edit drafts from interfering with create drafts

#### 4. **useEmployeeSelector.js** - NO CHANGE

**Status:** ✅ **Not needed for edit mode**

**Reason:** Edit modal shows employee info as **read-only**. No interactive selection needed.

#### 5. **useModalLifecycle.js** - MINOR MODIFY

**Changes Needed:**
```javascript
export function useModalLifecycle(options = {}) {
  const {
    modalId = 'employmentModal',  // ✅ ALREADY CUSTOMIZABLE
    onBeforeOpen,
    onAfterOpen,
    onBeforeClose,
    onAfterClose,
    hasUnsavedChanges,
    onDiscardChanges,
    cleanup
  } = options;
  
  // ✅ NO CHANGES NEEDED - already flexible!
}
```

**Usage for Edit Modal:**
```javascript
const modalLifecycle = useModalLifecycle({
  modalId: 'employmentEditModal',  // ✅ Different modal ID
  hasUnsavedChanges: () => draftPersistence.hasUnsavedChanges.value,
  onDiscardChanges: () => { ... }
});
```

---

## Implementation Plan

### Phase 1: Modify Composables (High Priority)

**Files to Modify:**
1. ✅ `useEmploymentForm.js` - Add edit mode support
2. ✅ `useAllocationManager.js` - Add `loadAllocations()`
3. ✅ `useDraftPersistence.js` - Add `draftKey` parameter

**Estimated Effort:** 2-3 hours

**Testing Requirement:** ⚠️ **MUST TEST** that create mode still works after changes!

---

### Phase 2: Refactor Employment Edit Modal

**File:** `employment-edit-modal.vue`

**Current Structure:**
```vue
<script>
export default {
  name: 'EmploymentEditModal',
  data() { ... },      // ❌ Remove - move to composables
  computed: { ... },   // ❌ Remove - move to composables
  methods: { ... },    // ❌ Remove - move to composables
  mounted() { ... },   // ✅ Convert to onMounted
  beforeUnmount() { ... } // ✅ Convert to onBeforeUnmount
}
</script>
```

**Target Structure:**
```vue
<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useEmploymentForm } from '@/composables/useEmploymentForm';
import { useAllocationManager } from '@/composables/useAllocationManager';
import { useDraftPersistence } from '@/composables/useDraftPersistence';
import { useModalLifecycle } from '@/composables/useModalLifecycle';
import { PerformanceCleanup } from '@/utils/performance.js';

export default {
  name: 'EmploymentEditModal',
  
  emits: ['employment-updated', 'modal-closed'],
  
  setup(props, { emit }) {
    const cleanup = new PerformanceCleanup();
    
    // Data loading state
    const isLoadingData = ref(false);
    const employmentId = ref(null);
    
    // Lookup data (same as create modal)
    const departments = shallowRef([]);
    const positions = shallowRef([]);
    const workLocations = shallowRef([]);
    const grantOptions = shallowRef([]);
    // ...etc
    
    // Initialize composables in EDIT MODE
    const employmentForm = useEmploymentForm({
      mode: 'edit',
      onFormChange: () => draftPersistence.debouncedSaveState(),
      onEmploymentUpdated: (data) => emit('employment-updated', data),
      onError: (error) => console.error('Error:', error)
    });
    
    const allocationManager = useAllocationManager({
      formData: employmentForm.formData,
      mode: 'edit',
      onFormChange: () => draftPersistence.debouncedSaveState(),
      onAllocationsUpdated: (data) => emit('employment-updated', data),
      onError: (error) => console.error('Error:', error)
    });
    
    const draftPersistence = useDraftPersistence({
      formData: employmentForm.formData,
      fundingAllocations: allocationManager.fundingAllocations,
      currentAllocation: allocationManager.currentAllocation,
      draftKey: 'employment-edit-modal-draft',  // ✅ Different key
      onGrantChange: () => handleGrantChange(),
      debounceDelay: 1000
    });
    
    const modalLifecycle = useModalLifecycle({
      modalId: 'employmentEditModal',
      hasUnsavedChanges: () => draftPersistence.hasUnsavedChanges.value,
      onDiscardChanges: () => { ... },
      onAfterClose: () => emit('modal-closed'),
      cleanup
    });
    
    // ✅ NEW: Load employment data on modal open
    const openModal = async (employmentData) => {
      employmentId.value = employmentData.id;
      modalLifecycle.isModalVisible.value = true;
      isLoadingData.value = true;
      
      try {
        // Load dropdown data (same as create)
        await loadInitialData();
        
        // Load employment data into form
        await employmentForm.loadEmployment(employmentData.id);
        
        // Load existing allocations
        await allocationManager.loadAllocations(employmentData.id);
        
        // Show modal
        modalLifecycle.openModal();
      } catch (error) {
        console.error('Error loading employment:', error);
      } finally {
        isLoadingData.value = false;
      }
    };
    
    // Rest of setup...
    
    return {
      // Expose to template
      ...employmentForm,
      ...allocationManager,
      ...draftPersistence,
      ...modalLifecycle,
      openModal,
      // ...etc
    };
  }
}
</script>
```

**Estimated Effort:** 3-4 hours

---

### Phase 3: Testing Checklist

#### Unit Tests (Composables)

- [ ] `useEmploymentForm` with `mode: 'create'` still works
- [ ] `useEmploymentForm` with `mode: 'edit'` loads data correctly
- [ ] `useEmploymentForm` update API call works
- [ ] `useAllocationManager.loadAllocations()` works
- [ ] Draft persistence uses correct key for edit mode

#### Integration Tests (Component)

- [ ] ✅ Modal opens with pre-populated data
- [ ] ✅ Employee info displays correctly (read-only)
- [ ] ✅ All form fields are populated
- [ ] ✅ Dates are converted correctly
- [ ] ✅ Existing allocations load and display
- [ ] ✅ Update employment button works
- [ ] ✅ Update allocations button works
- [ ] ✅ Validation works
- [ ] ✅ Error handling works
- [ ] ✅ Draft auto-save works
- [ ] ✅ Draft restore works on reopen
- [ ] ✅ Modal close cleanup works
- [ ] ✅ Success message shows and modal closes

#### Regression Tests

- [ ] ✅ **CRITICAL:** Create modal (`employment-modal.vue`) still works
- [ ] ✅ Create mode draft persistence still works
- [ ] ✅ Create mode validation still works
- [ ] ✅ Create mode API calls still work

---

## Detailed Code Changes

### 1. Modify `useEmploymentForm.js`

**Location:** Lines to add after line ~100 (in state section)

```javascript
// ============================================
// EDIT MODE STATE
// ============================================

/**
 * Mode: 'create' or 'edit'
 */
const mode = ref(options.mode || 'create');

/**
 * Employment ID for edit mode
 */
const employmentId = ref(options.employmentId || null);
```

**Location:** After validation section (~line 400)

```javascript
// ============================================
// LOAD EMPLOYMENT (EDIT MODE)
// ============================================

/**
 * Load employment data for editing
 * 
 * @param {number} id - Employment ID
 * @returns {Promise<boolean>} Success status
 */
const loadEmployment = async (id) => {
  try {
    console.log('📥 Loading employment for edit:', id);
    
    const response = await employmentService.getEmploymentById(id);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to load employment');
    }
    
    const data = response.data;
    employmentId.value = data.id;
    
    // Populate form fields
    Object.assign(formData, {
      employment_id: data.id,
      employee_id: data.employee_id,
      employment_type: data.employment_type || '',
      pay_method: data.pay_method || '',
      department_id: data.department_id || '',
      position_id: data.position_id || '',
      section_department: data.section_department || '',
      site_id: data.site_id || '',
      probation_salary: data.probation_salary || '',
      pass_probation_salary: data.pass_probation_salary || '',
      status: data.status === 1 || data.status === true,
      health_welfare: data.health_welfare === 1 || data.health_welfare === true,
      saving_fund: data.saving_fund === 1 || data.saving_fund === true,
      pvd: data.pvd === 1 || data.pvd === true,
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null,
      pass_probation_date: data.pass_probation_date ? new Date(data.pass_probation_date) : null
    });
    
    // Set employee info for display
    if (data.employee) {
      selectedEmployeeInfo.value = {
        name: `${data.employee.first_name_en || ''} ${data.employee.last_name_en || ''}`.trim(),
        staff_id: data.employee.staff_id || 'N/A',
        organization: data.employee.organization || 'N/A',
        status: data.employee.status || 'N/A'
      };
    }
    
    console.log('✅ Employment data loaded successfully');
    return true;
    
  } catch (error) {
    console.error('Error loading employment:', error);
    handleApiError(error);
    return false;
  }
};

/**
 * Handle update employment (edit mode)
 * 
 * @returns {Promise<Object|null>} Response data or null
 */
const handleUpdateEmployment = async () => {
  if (!validateEmploymentOnly()) {
    alertMessage.value = 'Please fix validation errors';
    alertClass.value = 'alert-danger';
    return null;
  }
  
  isSubmittingEmployment.value = true;
  alertMessage.value = '';
  
  try {
    const payload = buildEmploymentOnlyPayload();
    console.log('📤 Updating employment:', employmentId.value, payload);
    
    const response = await employmentService.updateEmployment(employmentId.value, payload);
    
    if (!response.success) {
      throw new Error(response.message || 'Update failed');
    }
    
    alertMessage.value = 'Employment updated successfully!';
    alertClass.value = 'alert-success';
    isEmploymentSaved.value = true;
    savedEmploymentId.value = employmentId.value;
    
    onEmploymentUpdated?.({
      success: true,
      message: 'Employment updated successfully',
      data: response.data
    });
    
    return response.data;
    
  } catch (error) {
    console.error('Error updating employment:', error);
    handleApiError(error);
    return null;
  } finally {
    isSubmittingEmployment.value = false;
  }
};
```

**Location:** Modify return object (~line 680)

```javascript
return {
  // State
  formData,
  selectedEmployeeInfo,
  validationErrors,
  alertMessage,
  alertClass,
  isSubmittingEmployment,
  isEmploymentSaved,
  savedEmploymentId,
  employmentSaveMessage,
  showAllocationReminder,
  mode,              // ✅ NEW
  employmentId,      // ✅ NEW

  // ... existing returns ...

  // Edit mode methods
  loadEmployment,           // ✅ NEW
  handleUpdateEmployment,   // ✅ NEW

  // Form management
  resetForm,
  onStatusChange
};
```

---

### 2. Modify `useAllocationManager.js`

**Location:** After state section (~line 100)

```javascript
// ============================================
// LOAD ALLOCATIONS (EDIT MODE)
// ============================================

/**
 * Load existing allocations for editing
 * 
 * @param {number} employmentId - Employment ID
 * @returns {Promise<boolean>} Success status
 */
const loadAllocations = async (employmentId) => {
  try {
    console.log('📥 Loading allocations for employment:', employmentId);
    
    const response = await employmentService.getFundingAllocations(employmentId);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to load allocations');
    }
    
    const allocationsData = response.data.funding_allocations || response.data || [];
    
    fundingAllocations.value = allocationsData.map(allocation => {
      const grantItem = allocation.grant_item || {};
      const grant = grantItem.grant || {};
      
      return {
        id: allocation.id,                    // ✅ Keep ID for reference
        grant_id: grant.id || '',
        grant_item_id: allocation.grant_item_id || grantItem.id || '',
        fte: parseFloat(allocation.fte) || 0,
        allocated_amount: allocation.allocated_amount || 0,
        _original: {
          grant_name: grant.name || 'Unknown',
          grant_code: grant.code || '',
          budget_line_code: grantItem.budgetline_code || '',
          allocated_amount: allocation.allocated_amount || 0
        }
      };
    });
    
    console.log('✅ Loaded', fundingAllocations.value.length, 'allocations');
    return true;
    
  } catch (error) {
    console.error('Error loading allocations:', error);
    fundingAllocations.value = [];
    onError?.(error);
    return false;
  }
};
```

**Location:** Modify return object (~line 900)

```javascript
return {
  // State
  fundingAllocations,
  currentAllocation,
  // ... existing returns ...

  // Edit mode methods
  loadAllocations,  // ✅ NEW

  // ... rest of returns
};
```

---

### 3. Modify `useDraftPersistence.js`

**Location:** At top of function (~line 50)

```javascript
export function useDraftPersistence(options = {}) {
  const {
    formData,
    fundingAllocations,
    currentAllocation,
    selectedEmployeeInfo,
    safeConvertToDate,
    onGrantChange,
    onEmployeeChange,
    draftKey = 'employment-modal-draft',  // ✅ NEW: customizable key
    debounceDelay = 1000
  } = options;
  
  // ... rest of code
  
  /**
   * Form draft storage key (customizable for create vs edit)
   */
  const formDraftKey = draftKey;  // ✅ CHANGE: Use parameter instead of hardcoded
  
  // ... rest of code uses formDraftKey ...
}
```

---

## Template Changes for Edit Modal

### Current Employee Selection (Read-Only)

**Keep as-is** - already simple:

```vue
<div class="form-group">
  <label class="form-label">Employee</label>
  <div class="employee-display-card">
    <div v-if="selectedEmployeeInfo" class="employee-info">
      <strong>{{ selectedEmployeeInfo.name }}</strong>
      <span class="text-muted ms-2">({{ selectedEmployeeInfo.staff_id }})</span>
      <br>
      <small class="text-muted">{{ selectedEmployeeInfo.organization }}</small>
    </div>
    <div v-else class="text-muted">
      Loading employee info...
    </div>
  </div>
</div>
```

**✅ No change needed** - this is already appropriate for edit mode.

### Button Labels

**Change:**
- ❌ "Save Employment" → ✅ "Update Employment"
- ❌ "Save Allocations" → ✅ "Update Allocations"

---

## Questions & Answers

### Q1: Should we extend existing composables or create separate edit composables?

**Answer:** ✅ **Extend existing composables**

**Reasons:**
1. 85% of logic is identical
2. Less code duplication
3. Easier maintenance
4. Consistent behavior

---

### Q2: Are there edit-specific business rules?

**Answer:** Based on code analysis:

1. ✅ **Employee is read-only** in edit mode (cannot change employee)
2. ✅ **Employment ID** must be tracked throughout
3. ✅ **Allocations** are replaced entirely (delete old + create new)
4. ⚠️ **Department change** may require position reload (same as create)
5. ✅ **Validation** appears identical to create mode

**No significant differences found** that would require separate logic.

---

### Q3: Should draft persistence key be different for edit mode?

**Answer:** ✅ **YES - Use different key**

**Reason:** Prevent interference between create and edit drafts.

**Keys:**
- Create: `'employment-modal-draft'`
- Edit: `'employment-edit-modal-draft'`

---

## Risk Assessment

### Low Risk ✅

1. **Template changes** - Minimal, mostly button labels
2. **useModalLifecycle** - Already flexible, no changes needed
3. **useDraftPersistence** - Simple parameter addition
4. **Employee display** - Already correct for edit mode

### Medium Risk ⚠️

1. **useEmploymentForm** - Adding edit mode support
   - **Mitigation:** Thorough testing of both modes
   - **Fallback:** Mode parameter defaults to 'create'

2. **useAllocationManager** - Adding load method
   - **Mitigation:** Load is separate from CRUD, minimal risk
   - **Fallback:** Empty allocations if load fails

### High Risk ❌

**None identified** - Changes are additive, not destructive

---

## Success Criteria

### Must Have ✅

1. [ ] Edit modal opens with pre-populated data
2. [ ] All form fields show correct values
3. [ ] Existing allocations load correctly
4. [ ] Update employment works (PUT/PATCH)
5. [ ] Update allocations works
6. [ ] **Create modal still works** (regression test)
7. [ ] Draft persistence works for edit mode
8. [ ] Validation works correctly
9. [ ] Error handling works

### Nice to Have 🎯

1. [ ] Loading states for data fetch
2. [ ] Smooth transitions on modal open
3. [ ] Proper memory cleanup
4. [ ] Performance optimization with shallowRef

---

## Next Steps

### Immediate Actions

1. **Review this plan** with team
2. **Get approval** to proceed
3. **Create feature branch:** `feature/refactor-employment-edit-modal`
4. **Start Phase 1:** Modify composables

### Implementation Order

**Day 1:**
- Modify `useEmploymentForm.js` (add edit mode)
- Modify `useAllocationManager.js` (add loadAllocations)
- Modify `useDraftPersistence.js` (add draftKey param)
- Test create modal still works ✅

**Day 2:**
- Refactor `employment-edit-modal.vue` component
- Test edit modal functionality
- Fix any issues

**Day 3:**
- Integration testing
- Bug fixes
- Code review
- Merge to main

---

## Conclusion

**Recommendation:** ✅ **PROCEED WITH REFACTORING**

**Rationale:**
1. ✅ Clear path forward with low risk
2. ✅ Composables can be extended safely
3. ✅ Edit modal is **simpler** than create modal (less complex)
4. ✅ Pattern is already proven in create modal
5. ✅ Estimated effort is reasonable (1-2 days)

**Benefits:**
- Consistent architecture across both modals
- Easier maintenance
- Better testability
- Improved code quality

**Ready to implement?** Say the word and I'll start with Phase 1! 🚀

---

**Document prepared by:** GitHub Copilot  
**Next review:** After Phase 1 completion

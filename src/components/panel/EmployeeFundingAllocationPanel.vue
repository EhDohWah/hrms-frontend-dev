<template>
  <div>
    <!-- Header: Simple title + Edit/Add button -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="d-flex align-items-center gap-2">
        <p class="mb-0 fw-bold">Funding Allocations</p>
        <!-- FTE indicator badge - always visible when allocations exist -->
        <span
          v-if="savedAllocations.length > 0 || isEditMode"
          class="badge"
          :class="fteStatusBadgeClass"
        >
          {{ totalFte.toFixed(0) }}% FTE
        </span>
        <!-- Inline FTE hint in edit mode - no layout shift -->
        <span v-if="isEditMode && totalFte !== 100" class="fte-hint">
          <template v-if="totalFte < 100">
            ({{ (100 - totalFte).toFixed(0) }}% remaining)
          </template>
          <template v-else>
            ({{ (totalFte - 100).toFixed(0) }}% over limit)
          </template>
        </span>
      </div>

      <div class="d-flex align-items-center gap-2">
        <!-- Edit All / Add button (view mode) -->
        <a-button
          v-if="!readonly && !isEditMode && savedAllocations.length > 0"
          size="small"
          @click="enterEditMode"
          :disabled="loading || grantsLoading"
          :loading="grantsLoading"
        >
          {{ grantsLoading ? 'Loading...' : 'Edit Allocations' }}
        </a-button>
        <a-button
          v-if="!readonly && !isEditMode && savedAllocations.length === 0"
          size="small"
          @click="enterEditMode"
          :disabled="loading || grantsLoading"
          :loading="grantsLoading"
        >
          {{ grantsLoading ? 'Loading...' : 'Add Allocation' }}
        </a-button>

        <!-- Save button (edit mode) with tooltip when disabled -->
        <a-tooltip v-if="isEditMode" :title="!canSave ? saveDisabledReason : ''">
          <a-button
            type="primary"
            size="small"
            @click="saveChanges"
            :loading="saving"
            :disabled="!canSave"
          >
            Save
          </a-button>
        </a-tooltip>

        <!-- Cancel button (edit mode) -->
        <a-button
          v-if="isEditMode"
          size="small"
          @click="cancelChanges"
          :disabled="saving"
        >
          Cancel
        </a-button>
      </div>
    </div>

    <!-- Allocations Table -->
    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      :loading="loading"
      row-key="rowKey"
      bordered
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <!-- Grant Name Column -->
        <template v-if="column.dataIndex === 'grant_name'">
          <template v-if="isEditMode">
            <a-select
              v-model:value="record.grant_id"
              placeholder="Select Grant"
              style="width: 100%"
              :options="grantOptions"
              @change="() => onGrantChange(record)"
              :loading="grantsLoading"
              show-search
              :filter-option="filterOption"
            />
          </template>
          <template v-else>
            {{ record.grant_name || '-' }}
          </template>
        </template>

        <!-- Position Column -->
        <template v-else-if="column.dataIndex === 'position_name'">
          <template v-if="isEditMode">
            <a-select
              v-model:value="record.grant_item_id"
              placeholder="Select Position"
              style="width: 100%"
              :options="getPositionOptions(record.grant_id)"
              :disabled="!record.grant_id"
              :loading="positionsLoading"
              show-search
              :filter-option="filterOption"
              @change="() => onPositionChange(record)"
            />
          </template>
          <template v-else>
            {{ record.position_name || '-' }}
          </template>
        </template>

        <!-- Budget Line Code Column -->
        <template v-else-if="column.dataIndex === 'budget_line_code'">
          <template v-if="isEditMode">
            <span class="text-muted">
              {{ record.budget_line_code || 'Auto' }}
            </span>
          </template>
          <template v-else>
            <span class="badge badge-sm badge-soft-info fw-normal">
              {{ record.budget_line_code || '-' }}
            </span>
          </template>
        </template>

        <!-- FTE Column -->
        <template v-else-if="column.dataIndex === 'fte'">
          <template v-if="isEditMode">
            <a-input-number
              v-model:value="record.fte"
              :min="1"
              :max="100"
              :precision="0"
              :step="5"
              class="fte-input"
              @change="() => onFteChange(record)"
            />
          </template>
          <template v-else>
            {{ (record.fte || 0).toFixed(0) }}%
          </template>
        </template>

        <!-- Allocated Amount Column -->
        <template v-else-if="column.dataIndex === 'allocated_amount'">
          <template v-if="isEditMode">
            <span v-if="record.calculating" class="text-muted">
              <a-spin size="small" />
            </span>
            <span v-else-if="record.calculated_amount !== null && record.calculated_amount !== undefined">
              {{ formatCurrency(record.calculated_amount) }}
            </span>
            <span v-else class="text-muted">-</span>
          </template>
          <template v-else>
            {{ formatCurrency(record.allocated_amount) }}
          </template>
        </template>

        <!-- Status Column -->
        <template v-else-if="column.dataIndex === 'status'">
          <template v-if="isEditMode && !record.isNew">
            <a-select
              v-model:value="record.status"
              style="width: 100%"
              size="small"
              :options="statusOptions"
            />
          </template>
          <template v-else>
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusLabel(record.status) }}
            </a-tag>
          </template>
        </template>

        <!-- Actions Column -->
        <template v-else-if="column.dataIndex === 'actions'">
          <div class="action-links">
            <template v-if="isEditMode">
              <!-- Remove button - only show if more than 1 row -->
              <a-popconfirm
                v-if="editableRows.length > 1"
                :title="record.isNew ? 'Remove this row?' : 'Delete this allocation?'"
                @confirm="removeRow(record)"
                ok-text="Yes"
                cancel-text="No"
              >
                <a href="javascript:void(0);" class="text-danger">
                  <i class="ti ti-trash"></i>
                </a>
              </a-popconfirm>
              <span v-else class="text-muted">-</span>
            </template>
            <template v-else>
              <a-popconfirm
                title="Delete this allocation?"
                @confirm="deleteAllocation(record)"
                ok-text="Yes"
                cancel-text="No"
              >
                <a href="javascript:void(0);" class="text-danger">
                  <i class="ti ti-trash"></i>
                </a>
              </a-popconfirm>
            </template>
          </div>
        </template>
      </template>

      <!-- Empty State -->
      <template #emptyText>
        <div class="text-center py-3">
          <p class="text-muted mb-2">No funding allocations</p>
          <a-button
            v-if="!readonly && !isEditMode"
            size="small"
            @click="enterEditMode"
            :disabled="grantsLoading"
            :loading="grantsLoading"
          >
            {{ grantsLoading ? 'Loading...' : 'Add Allocation' }}
          </a-button>
        </div>
      </template>
    </a-table>

    <!-- Add Another row button (edit mode, when FTE < 100) -->
    <div v-if="isEditMode && totalFte < 100" class="mt-2">
      <a-button size="small" @click="addNewRow" :disabled="saving || !canAddAnother">
        + Add Another Allocation
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { employmentService } from '@/services/employment.service';
import { employeeFundingAllocationService } from '@/services/employee-funding-allocation.service';

// Props
const props = defineProps({
  employmentId: {
    type: Number,
    required: true
  },
  employeeId: {
    type: Number,
    required: true
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['allocation-changed']);

// ============================================
// STATE
// ============================================
const savedAllocations = ref([]);  // Allocations from server (view mode)
const editableRows = ref([]);      // All rows in edit mode (existing + new)
const isEditMode = ref(false);     // Whether we're in batch edit mode
const loading = ref(false);
const saving = ref(false);

// Rows marked for deletion (existing allocations only)
const rowsToDelete = ref([]);

// Grant dropdown data
const grantOptions = ref([]);
const grantPositions = ref({});  // { grantId: [{ value, label, budget_line_code }] }
const grantsLoading = ref(false);
const positionsLoading = ref(false);
const grantStructureReady = ref(false);  // Track if grant structure has loaded successfully

// Counter for new row IDs
let newRowIdCounter = 0;

// Debounce timers
const calculateTimeouts = {};

// ============================================
// COMPUTED
// ============================================

// Table data - either saved allocations (view) or editable rows (edit)
const tableData = computed(() => {
  if (isEditMode.value) {
    return editableRows.value;
  }
  return savedAllocations.value;
});

// Total FTE calculation - only count active allocations
const totalFte = computed(() => {
  const rows = isEditMode.value ? editableRows.value : savedAllocations.value;
  return rows
    .filter(row => row.status === 'active')
    .reduce((sum, row) => sum + (row.fte || 0), 0);
});

// Can save?
const canSave = computed(() => {
  if (!isEditMode.value) return false;

  const activeRows = editableRows.value.filter(r => r.status === 'active');

  // All active rows must have grant_id, grant_item_id, and valid FTE
  for (const row of activeRows) {
    if (!row.grant_id || !row.grant_item_id) return false;
    if (!row.fte || row.fte <= 0) return false;
  }

  // Active FTE total must equal 100% (or 0% if no active rows)
  if (activeRows.length === 0) return editableRows.value.length > 0;
  return Math.abs(totalFte.value - 100) < 0.01;
});

// Validation messages for user feedback
const validationMessages = computed(() => {
  const messages = [];

  if (!isEditMode.value) return messages;

  // Only validate active rows
  for (let i = 0; i < editableRows.value.length; i++) {
    const row = editableRows.value[i];
    if (row.status !== 'active') continue;

    const rowNum = i + 1;

    if (!row.grant_id) {
      messages.push(`Row ${rowNum}: Please select a grant`);
    } else if (!row.grant_item_id) {
      messages.push(`Row ${rowNum}: Please select a position`);
    }

    if (!row.fte || row.fte <= 0) {
      messages.push(`Row ${rowNum}: FTE must be greater than 0`);
    }
  }

  // FTE total validation (only show if row validations pass and there are active rows)
  const activeRows = editableRows.value.filter(r => r.status === 'active');
  if (activeRows.length > 0 && messages.length === 0) {
    if (totalFte.value < 100) {
      messages.push(`Total FTE is ${totalFte.value.toFixed(0)}% - needs ${(100 - totalFte.value).toFixed(0)}% more to reach 100%`);
    } else if (totalFte.value > 100) {
      messages.push(`Total FTE is ${totalFte.value.toFixed(0)}% - ${(totalFte.value - 100).toFixed(0)}% over the 100% limit`);
    }
  }

  return messages;
});

// Check if there are validation issues (for UI display)
const hasValidationIssues = computed(() => validationMessages.value.length > 0);

// Tooltip text for disabled Save button
const saveDisabledReason = computed(() => {
  if (!hasValidationIssues.value) return '';
  return validationMessages.value.join(' · ');
});

// Can add another row?
const canAddAnother = computed(() => {
  if (editableRows.value.length === 0) return true;
  // Last row must have grant and position selected
  const lastRow = editableRows.value[editableRows.value.length - 1];
  return lastRow.grant_id && lastRow.grant_item_id;
});

// FTE status badge class
const fteStatusBadgeClass = computed(() => {
  if (Math.abs(totalFte.value - 100) < 0.01) return 'badge-success-subtle';
  if (totalFte.value > 100) return 'badge-danger-subtle';
  return 'badge-warning-subtle';
});

// Table columns
const columns = computed(() => {
  const cols = [
    { title: 'Grant', dataIndex: 'grant_name', key: 'grant_name', width: 200 },
    { title: 'Grant Position', dataIndex: 'position_name', key: 'position_name', width: 200 },
    { title: 'Budget Line', dataIndex: 'budget_line_code', key: 'budget_line_code', width: 120 },
    { title: 'FTE %', dataIndex: 'fte', key: 'fte', width: 110, align: 'center' },
    { title: 'Amount', dataIndex: 'allocated_amount', key: 'allocated_amount', width: 130, align: 'right' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 130, align: 'center' }
  ];

  if (!props.readonly) {
    cols.push({ title: '', dataIndex: 'actions', key: 'actions', width: 60, align: 'center' });
  }

  return cols;
});

// ============================================
// METHODS
// ============================================
const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const filterOption = (input, option) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};

// Status dropdown options for edit mode
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'green';
    case 'inactive': return 'orange';
    case 'closed': return 'red';
    default: return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'Active';
    case 'inactive': return 'Inactive';
    case 'closed': return 'Closed';
    default: return status || 'Unknown';
  }
};

const getPositionOptions = (grantId) => {
  if (!grantId) return [];
  return grantPositions.value[grantId] || [];
};

// Load allocations from server
const loadAllocations = async () => {
  if (!props.employmentId) return;

  loading.value = true;
  try {
    const response = await employmentService.getFundingAllocations(props.employmentId);

    if (response.success) {
      const data = response.data?.funding_allocations || response.data || [];
      savedAllocations.value = (Array.isArray(data) ? data : []).map(alloc => {
        // Extract grant_id with multiple fallback paths for robustness
        // Priority: direct grant_id > grant_item.grant_id > grant_item.grant.id
        let grantId = alloc.grant_id;

        if (!grantId && alloc.grant_item) {
          grantId = alloc.grant_item.grant_id || alloc.grant_item.grant?.id;
        }

        // Debug warning if grant_id is still missing (helps identify API issues)
        if (!grantId && alloc.grant_item_id) {
          console.warn('Funding allocation missing grant_id:', { id: alloc.id, grant_item_id: alloc.grant_item_id });
        }

        return {
          id: alloc.id,
          rowKey: `saved-${alloc.id}`,
          grant_id: grantId ? Number(grantId) : null,
          grant_item_id: alloc.grant_item_id ? Number(alloc.grant_item_id) : null,
          fte: alloc.fte || 0,
          allocated_amount: alloc.allocated_amount || 0,
          grant_name: alloc.grant_name || alloc.grant_item?.grant?.name || 'Unknown',
          budget_line_code: alloc.budgetline_code || alloc.grant_item?.budgetline_code || '',
          position_name: alloc.grant_position || alloc.grant_item?.grant_position || '',
          status: alloc.status || 'active'
        };
      });
    }
  } catch (error) {
    console.error('Error loading allocations:', error);
    message.error('Failed to load allocations');
  } finally {
    loading.value = false;
  }
};

// Load grant structure for dropdowns
const loadGrantStructure = async () => {
  grantsLoading.value = true;
  grantStructureReady.value = false;  // Reset on new load
  try {
    const response = await employeeFundingAllocationService.getGrantStructure();

    if (response.data) {
      // Normalize IDs to Number to prevent type mismatch with allocation data
      grantOptions.value = (response.data.grants || []).map(g => ({
        value: Number(g.id),
        label: g.name || g.code || `Grant ${g.id}`
      }));

      const positionsMap = {};
      (response.data.grants || []).forEach(grant => {
        const grantId = Number(grant.id);
        positionsMap[grantId] = (grant.grant_items || grant.items || []).map(item => ({
          value: Number(item.id),
          label: item.name || item.grant_position || 'Position',
          budget_line_code: item.budgetline_code || item.budget_line_code || ''
        }));
      });
      grantPositions.value = positionsMap;
      grantStructureReady.value = true;  // Mark as ready after successful load
    }
  } catch (error) {
    console.error('Error loading grant structure:', error);
    grantStructureReady.value = false;  // Ensure false on error
  } finally {
    grantsLoading.value = false;
  }
};

// Calculate amount for a row
const calculateRowAmount = async (row) => {
  if (!row.fte || row.fte <= 0) {
    row.calculated_amount = null;
    return;
  }

  row.calculating = true;
  try {
    const response = await employmentService.calculateAllocationAmount({
      employment_id: props.employmentId,
      fte: row.fte
    });

    if (response.success && response.data) {
      row.calculated_amount = response.data.allocated_amount;
    }
  } catch (error) {
    console.error('Error calculating amount:', error);
    row.calculated_amount = null;
  } finally {
    row.calculating = false;
  }
};

// Debounced calculation
const debouncedCalculate = (row) => {
  const id = row.rowKey;
  if (calculateTimeouts[id]) {
    clearTimeout(calculateTimeouts[id]);
  }
  calculateTimeouts[id] = setTimeout(() => calculateRowAmount(row), 300);
};

// Enter batch edit mode
const enterEditMode = async () => {
  // Ensure grant structure is loaded before entering edit mode
  if (!grantStructureReady.value) {
    if (grantsLoading.value) {
      // Wait for grant structure to finish loading (with timeout)
      message.info('Loading grant options, please wait...');
      const startTime = Date.now();
      const timeout = 5000;  // 5 second timeout

      while (grantsLoading.value && (Date.now() - startTime) < timeout) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (!grantStructureReady.value) {
        message.error('Failed to load grant options. Please try again.');
        return;
      }
    } else {
      // Grant structure failed to load previously, try again
      message.info('Loading grant options...');
      await loadGrantStructure();

      if (!grantStructureReady.value) {
        message.error('Failed to load grant options. Please try again.');
        return;
      }
    }
  }

  // Ensure saved allocation grants/positions exist in dropdown options
  // This prevents selects from showing raw IDs when the grant structure
  // doesn't include a specific grant (e.g., deactivated grants)
  savedAllocations.value.forEach(alloc => {
    if (alloc.grant_id && !grantOptions.value.find(g => g.value === alloc.grant_id)) {
      grantOptions.value.push({ value: alloc.grant_id, label: alloc.grant_name || `Grant ${alloc.grant_id}` });
    }
    if (alloc.grant_id && alloc.grant_item_id) {
      if (!grantPositions.value[alloc.grant_id]) {
        grantPositions.value[alloc.grant_id] = [];
      }
      if (!grantPositions.value[alloc.grant_id].find(p => p.value === alloc.grant_item_id)) {
        grantPositions.value[alloc.grant_id].push({
          value: alloc.grant_item_id,
          label: alloc.position_name || `Position ${alloc.grant_item_id}`,
          budget_line_code: alloc.budget_line_code || ''
        });
      }
    }
  });

  // Clone saved allocations to editable rows
  editableRows.value = savedAllocations.value.map(alloc => ({
    ...alloc,
    rowKey: `edit-${alloc.id}`,
    isNew: false,
    calculating: false,
    calculated_amount: alloc.allocated_amount,
    status: alloc.status || 'active'
  }));

  rowsToDelete.value = [];

  // If no allocations, add an empty row
  if (editableRows.value.length === 0) {
    addNewRow();
  }

  isEditMode.value = true;
};

// Add a new row
const addNewRow = () => {
  const remainingFte = Math.max(1, 100 - totalFte.value);

  const newRow = {
    id: null,
    rowKey: `new-${++newRowIdCounter}`,
    grant_id: null,
    grant_item_id: null,
    fte: remainingFte,
    grant_name: '',
    position_name: '',
    budget_line_code: '',
    allocated_amount: null,
    calculated_amount: null,
    calculating: false,
    isNew: true,
    status: 'active'
  };

  editableRows.value.push(newRow);
  debouncedCalculate(newRow);
};

// Remove a row
const removeRow = (row) => {
  const index = editableRows.value.findIndex(r => r.rowKey === row.rowKey);
  if (index > -1) {
    // If it's an existing allocation (not new), mark for deletion
    if (!row.isNew && row.id) {
      rowsToDelete.value.push(row.id);
    }
    editableRows.value.splice(index, 1);
  }

  if (calculateTimeouts[row.rowKey]) {
    clearTimeout(calculateTimeouts[row.rowKey]);
  }
};

// Delete a single allocation (view mode)
const deleteAllocation = async (row) => {
  if (!row.id) return;
  try {
    const response = await employeeFundingAllocationService.delete(row.id);
    if (response.success) {
      message.success('Allocation deleted successfully');
      await loadAllocations();
      emit('allocation-changed');
    } else {
      message.error(response.message || 'Failed to delete allocation');
    }
  } catch (error) {
    message.error(error.response?.data?.message || 'Failed to delete allocation');
  }
};

// Handle grant change
const onGrantChange = (row) => {
  row.grant_item_id = null;
  row.position_name = '';
  row.budget_line_code = '';
  const grant = grantOptions.value.find(g => g.value === row.grant_id);
  row.grant_name = grant?.label || '';
};

// Handle position change
const onPositionChange = (row) => {
  const options = getPositionOptions(row.grant_id);
  const selected = options.find(o => o.value === row.grant_item_id);
  row.position_name = selected?.label || '';
  row.budget_line_code = selected?.budget_line_code || '';
};

// Handle FTE change
const onFteChange = (row) => {
  debouncedCalculate(row);
};

// Cancel all changes
const cancelChanges = () => {
  editableRows.value = [];
  rowsToDelete.value = [];
  isEditMode.value = false;
  Object.values(calculateTimeouts).forEach(t => clearTimeout(t));
};

// Save changes using batch API (single atomic operation)
const saveChanges = async () => {
  if (!canSave.value) {
    if (Math.abs(totalFte.value - 100) >= 0.01) {
      message.error(`Total FTE must equal 100% (currently ${totalFte.value.toFixed(0)}%)`);
    } else {
      message.error('Please fill in all required fields');
    }
    return;
  }

  saving.value = true;
  try {
    // Separate existing (updates) from new (creates)
    const existingRows = editableRows.value.filter(r => !r.isNew);
    const newRows = editableRows.value.filter(r => r.isNew);

    // Build batch payload - single API call handles all operations
    const payload = {
      employee_id: props.employeeId,
      employment_id: props.employmentId,
      updates: existingRows.map(row => ({
        id: row.id,
        grant_item_id: row.grant_item_id,
        fte: row.fte,  // Already in percentage (e.g., 60)
        status: row.status
      })),
      creates: newRows.map(row => ({
        grant_item_id: row.grant_item_id,
        fte: row.fte
      })),
      deletes: rowsToDelete.value
    };

    const response = await employeeFundingAllocationService.batchUpdate(payload);

    if (response.success) {
      message.success('Allocations saved successfully');
      isEditMode.value = false;
      editableRows.value = [];
      rowsToDelete.value = [];
      await loadAllocations();
      emit('allocation-changed');
    } else {
      // Show detailed error from backend
      const errorMsg = response.message || 'Failed to save allocations';
      if (response.breakdown) {
        console.error('FTE breakdown:', response.breakdown);
      }
      message.error(errorMsg);
    }

  } catch (error) {
    console.error('Error saving:', error);
    const errorMsg = error.response?.data?.message || error.message || 'Failed to save allocations';
    message.error(errorMsg);
  } finally {
    saving.value = false;
  }
};

// ============================================
// LIFECYCLE
// ============================================
watch(() => props.employmentId, (newId) => {
  if (newId) {
    cancelChanges();
    loadAllocations();
  }
}, { immediate: true });

onMounted(() => {
  loadGrantStructure();
});
</script>

<style scoped>
.action-links a {
  margin-right: 8px;
}

.action-links a:last-child {
  margin-right: 0;
}

/* FTE input - wider to prevent number being hidden by arrows */
.fte-input {
  width: 90px !important;
}

/* Remove the addon and use suffix-style display */
.fte-input :deep(.ant-input-number-input) {
  text-align: center;
  padding-right: 4px;
}

/* FTE hint - inline next to badge, no layout shift */
.fte-hint {
  font-size: 12px;
  color: #8c8c8c;
}

/* Badge styles - subtle backgrounds matching Ant Design */
.badge-success-subtle {
  background-color: #f6ffed;
  color: #389e0d;
  border: 1px solid #b7eb8f;
}

.badge-warning-subtle {
  background-color: #fffbe6;
  color: #d48806;
  border: 1px solid #ffe58f;
}

.badge-danger-subtle {
  background-color: #fff2f0;
  color: #cf1322;
  border: 1px solid #ffccc7;
}

.badge-soft-info {
  background-color: #e6f7ff;
  color: #1890ff;
}

</style>

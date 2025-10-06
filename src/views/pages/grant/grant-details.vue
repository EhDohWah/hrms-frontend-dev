<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <!-- <router-link :to="'/grant/edit/' + grantId" class="btn btn-primary">
              <i class="ti ti-pencil me-1"></i>Edit Grant
            </router-link> -->
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Grant Details -->
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <div class="my-auto mb-4">
                <h6 class="fw-medium d-inline-flex align-items-center mb-3 mb-sm-0">
                  <router-link to="/grant/list">
                    <i class="ti ti-arrow-left me-2"></i>Back to Grant List
                  </router-link>
                </h6>
              </div>
              <div class="project-details">
                <h5 class="card-title">{{ grant.name }}</h5>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="project-info">
                      <label>Grant Code</label>
                      <p>{{ grant.code }}</p>
                    </div>
                    <div class="project-info">
                      <label>Grant Amount</label>
                      <p>{{ grant.amount }}</p>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="project-info">
                      <label>End Date</label>
                      <p>{{ grant.endDate }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="project-description">
                <h5 class="card-title">Description</h5>
                <p>{{ grant.description }}</p>
              </div>

              <!-- UPDATED: Grant Items Ant Design Vue Table with Nested Table -->
              <div class="mt-4">
                <h5 class="card-title">Grant Positions</h5>
                <div class="table-responsive-custom">
                  <a-table :columns="grantItemColumns" :dataSource="grant.items" :rowKey="record => record.id" bordered
                    size="small" :pagination="false" :expandable="expandableConfig" class="grant-items-table"
                    :loading="{ spinning: loading, indicator: loadingIndicator }">
                    <template #expandedRowRender="{ record }">
                      <div class="expanded-row-content">
                        <div class="slot-header">
                          <h6 class="slot-title">Position Slots</h6>
                          <a-button type="primary" size="small" @click="handleAddSlot(record)" class="add-slot-btn"
                            :disabled="!canAddSlot(record)">
                            <i class="ti ti-plus"></i>Add Slot
                          </a-button>
                        </div>
                        <a-table :columns="slotColumns" :dataSource="record.position_slots || []"
                          :rowKey="slot => slot.id" :pagination="false" size="small" bordered class="slots-table"
                          :loading="{ spinning: slotsLoading, indicator: loadingIndicator }">
                          <template #bodyCell="{ column, record: slot }">
                            <!-- Inline Editable Cells -->
                            <template v-if="slotEditMap[slot.id]">
                              <span v-if="column.dataIndex === 'slot_number'" class="slot-number">{{ slot.slot_number
                              }}</span>
                            </template>
                            <template v-else>
                              <span v-if="column.dataIndex === 'slot_number'" class="slot-number">{{ slot.slot_number
                              }}</span>
                            </template>
                            <!-- Actions -->
                            <template v-if="column.dataIndex === 'actions'">
                              <div v-if="slotEditMap[slot.id]" class="action-buttons editing">
                                <a @click="saveSlot(slot, record)" class="save-btn">
                                  <i class="ti ti-check"></i>Save
                                </a>
                                <a @click="cancelSlot(slot)" class="cancel-btn">
                                  <i class="ti ti-x"></i>Cancel
                                </a>
                              </div>
                              <div v-else class="action-buttons">
                                <a @click="editSlot(slot)" class="edit-btn">
                                  <i class="ti ti-pencil"></i>Edit
                                </a>
                                <a @click="deleteSlot(slot, record)" class="delete-btn">
                                  <i class="ti ti-trash"></i>Delete
                                </a>
                              </div>
                            </template>
                          </template>
                        </a-table>
                      </div>
                    </template>
                  </a-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Grant Details -->
    </div>
    <layout-footer></layout-footer>
  </div>

</template>

<script setup>
import { ref, reactive, onMounted, h, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useGrantStore } from '@/stores/grantStore';
import { LoadingOutlined } from '@ant-design/icons-vue';
import { positionSlotService } from '@/services/position-slot.service';
import { message, Modal } from 'ant-design-vue';
// Loading indicator component
const loadingIndicator = h(LoadingOutlined, { style: { fontSize: '24px' } });

// Page meta & data
const title = 'Grant Details';
const text = 'Grants';
const text1 = 'Grant Details';
const route = useRoute();
const grantId = ref(route.params.id);
const grantStore = useGrantStore();

// Loading states
const loading = ref(true);
const slotsLoading = ref(false);

const grant = ref({
  name: 'Loading...',
  code: '',
  amount: '',
  startDate: '',
  endDate: '',
  status: '',
  department: '',
  investigator: '',
  description: 'Loading grant details...',
  items: [],
  documents: []
});


// Load data when component is mounted
onMounted(async () => {
  // Component initialization
});


// --- Table Column Definitions ---
const grantItemColumns = [
  { title: 'Position', dataIndex: 'grant_position', key: 'grant_position' },
  {
    title: 'Salary',
    dataIndex: 'grant_salary',
    key: 'grant_salary',
    customRender: ({ text }) => '$' + Number(text || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
  },
  {
    title: 'Benefit',
    dataIndex: 'grant_benefit',
    key: 'grant_benefit',
    customRender: ({ text }) => '$' + Number(text || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
  },
  {
    title: 'Effort (%)',
    dataIndex: 'grant_level_of_effort',
    key: 'grant_level_of_effort',
    customRender: ({ text }) => (Number(text || 0) * 100).toFixed(1) + '%'
  },
  { title: 'Position Number', dataIndex: 'grant_position_number', key: 'grant_position_number' },
  {
    title: 'Cost Monthly',
    dataIndex: 'costMonthly',
    key: 'costMonthly',
    customRender: ({ text }) => '$' + Number(text || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
  },
  {
    title: 'Total Amount Annual',
    dataIndex: 'totalAmountAnnual',
    key: 'totalAmountAnnual',
    customRender: ({ text }) => '$' + Number(text || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
  },
  {
    title: 'Total Cost By Person',
    dataIndex: 'totalCostByPerson',
    key: 'totalCostByPerson',
    customRender: ({ text }) => '$' + Number(text || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
  },
];

// --- Slot Table Column Definitions ---
const slotColumns = [
  { title: 'Slot No.', dataIndex: 'slot_number', key: 'slot_number', width: 100 },
  { title: 'Actions', dataIndex: 'actions', key: 'actions', width: 140 }
];


// --- Nested Table CRUD State ---
const slotEditMap = reactive({});

// --- Check if can add slot based on position number ---
function canAddSlot(position) {
  const maxSlots = Number(position.grant_position_number || 0);
  const currentSlots = position.position_slots ? position.position_slots.length : 0;
  return currentSlots < maxSlots;
}

// --- Expandable config for Nested Table ---
const expandableConfig = {
  rowExpandable: record => record.position_slots && record.position_slots.length > 0,
  expandIcon: ({ expanded, onExpand, record }) => {
    if (record.position_slots && record.position_slots.length > 0) {
      return expanded
        ? h('span', { onClick: e => onExpand(record, e), style: 'cursor: pointer; color: #1890ff;' }, '▼')
        : h('span', { onClick: e => onExpand(record, e), style: 'cursor: pointer; color: #1890ff;' }, '▶');
    }
    return null;
  }
};

// --- CRUD Methods for Position Slots ---
function handleAddSlot(position) {
  // Check if we can add more slots based on position number
  if (!canAddSlot(position)) {
    alert(`Cannot add more slots. Maximum slots allowed: ${position.grant_position_number}`);
    return;
  }

  const newId = Date.now();
  const currentSlotCount = position.position_slots ? position.position_slots.length : 0;
  const slot = {
    id: newId,
    slot_number: (currentSlotCount + 1).toString(),
    __isNew: true
  };

  if (!position.position_slots) {
    position.position_slots = [];
  }
  position.position_slots.push(slot);
  slotEditMap[newId] = { ...slot };
}

function editSlot(slot) {
  console.log('Editing slot:', slot);

  slotEditMap[slot.id] = {
    ...slot
  };

  console.log('Edit map for slot:', slotEditMap[slot.id]);
}

function cancelSlot(slot) {
  if (slot.__isNew) {
    // Remove if new
    const position = grant.value.items.find(item =>
      item.position_slots && item.position_slots.some(s => s.id === slot.id)
    );
    if (position) {
      const idx = position.position_slots.findIndex(s => s.id === slot.id);
      if (idx !== -1) position.position_slots.splice(idx, 1);
    }
  }
  delete slotEditMap[slot.id];
}

async function saveSlot(slot, position) {
  const draft = slotEditMap[slot.id];
  if (!draft) {
    message.error('No draft data found');
    return;
  }

  try {
    slotsLoading.value = true;

    if (slot.__isNew) {
      // Create new position slot
      const createData = {
        grant_item_id: position.id,
        slot_number: parseInt(draft.slot_number)
      };

      const response = await positionSlotService.createPositionSlot(createData);

      if (response.success) {
        // Update the slot with the response data
        Object.assign(slot, response.data);
        delete slot.__isNew;
        message.success('Position slot created successfully');

        // Invalidate shared data cache to ensure employment modal gets fresh data
        try {
          const { useSharedDataStore } = await import('@/stores/sharedDataStore');
          const sharedStore = useSharedDataStore();
          sharedStore.invalidateCache('grantStructure');
          console.log('🗑️ Grant structure cache invalidated after position slot creation');
        } catch (error) {
          console.warn('⚠️ Failed to invalidate cache after position slot creation:', error);
        }
      } else {
        message.error('Failed to create position slot');
        return;
      }
    } else {
      // Update existing position slot
      const updateData = {
        slot_number: parseInt(draft.slot_number)
      };

      const response = await positionSlotService.updatePositionSlot(slot.id, updateData);

      if (response.success) {
        // Update the slot with the response data
        Object.assign(slot, response.data);
        message.success('Position slot updated successfully');

        // Invalidate shared data cache to ensure employment modal gets fresh data
        try {
          const { useSharedDataStore } = await import('@/stores/sharedDataStore');
          const sharedStore = useSharedDataStore();
          sharedStore.invalidateCache('grantStructure');
          console.log('🗑️ Grant structure cache invalidated after position slot update');
        } catch (error) {
          console.warn('⚠️ Failed to invalidate cache after position slot update:', error);
        }
      } else {
        message.error('Failed to update position slot');
        return;
      }
    }

    delete slotEditMap[slot.id];
  } catch (error) {
    console.error('Error saving position slot:', error);
    message.error('An error occurred while saving the position slot');
  } finally {
    slotsLoading.value = false;
  }
}

async function deleteSlot(slot, position) {
  // Use Ant Design confirm modal
  Modal.confirm({
    title: 'Delete Position Slot',
    content: 'Are you sure you want to delete this position slot? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    centered: true,
    onOk: async () => {
      // Only attempt API call if it's not a new slot
      if (!slot.__isNew) {
        try {
          slotsLoading.value = true;
          const response = await positionSlotService.deletePositionSlot(slot.id);

          if (response.success) {
            message.success('Position slot deleted successfully');
          } else {
            message.error('Failed to delete position slot');
            return;
          }
        } catch (error) {
          console.error('Error deleting position slot:', error);
          message.error('Failed to delete position slot');
          return;
        } finally {
          slotsLoading.value = false;
        }
      }

      // Remove from local array after successful API call (or if it's a new slot)
      const idx = position.position_slots.findIndex(s => s.id === slot.id);
      if (idx !== -1) {
        position.position_slots.splice(idx, 1);
      }

      // Clean up edit state
      delete slotEditMap[slot.id];

      // Show success message for new slots
      if (slot.__isNew) {
        message.success('Position slot removed');
      }
    }
  });
}

// --- Data Processing ---
function processGrantItems(items) {
  return items.map(item => {
    const salary = parseFloat(item.grant_salary || 0);
    const benefit = parseFloat(item.grant_benefit || 0);
    const effort = parseFloat(item.grant_level_of_effort || 0);
    const costMonthly = (salary + benefit) * effort;
    const totalAmountAnnual = costMonthly * 12 * (item.grant_position_number || 1);
    const totalCostByPerson = totalAmountAnnual / (item.grant_position_number || 1);

    return {
      ...item,
      costMonthly,
      totalAmountAnnual,
      totalCostByPerson
    };
  });
}

// --- Fetch Grant Details ---
async function fetchGrantDetails() {
  loading.value = true;
  try {
    const grantData = await grantStore.fetchGrantById(Number(grantId.value));
    if (grantData) {
      grant.value = {
        id: grantData.id,
        name: grantData.name,
        code: grantData.code,
        amount: grantData.amount ?? calculateTotalAmount(grantData.grant_items),
        endDate: grantData.end_date ? new Date(grantData.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        status: grantData.status ?? 'Pending',
        department: grantData.department ?? '',
        investigator: grantData.investigator ?? '',
        description: grantData.description ?? '',
        items: processGrantItems(grantData.grant_items || [])
      };
    }
  } catch (e) {
    // Error handling, security: do not expose sensitive info
    grant.value.name = 'Grant not found or error occurred';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  nextTick(() => {
    fetchGrantDetails();
  });
});

// Utility to compute total
function calculateTotalAmount(items) {
  if (!items || !items.length) return '$0.00';
  const total = items.reduce((sum, item) => sum + Number(item.grant_total_amount ?? 0), 0);
  return `$${total.toFixed(2)}`;
}
</script>

<style scoped>
:deep(.ant-select-selector) {
  min-height: 38px !important;
  height: 38px !important;
  display: flex !important;
  align-items: center !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  box-sizing: border-box !important;
}

:deep(.ant-select) {
  width: 100% !important;
}

.budget-select {
  width: 100% !important;
  min-width: 220px !important;
}

.slots-table :deep(.ant-table-cell) {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  height: 40px !important;
  vertical-align: middle !important;
}


/* Responsive table container for enterprise overflow handling */
.table-responsive-custom {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 1rem;
  /* Prevent resize observer issues */
  contain: layout style;
}

.card-body {
  overflow-x: auto;
}

.project-info {
  margin-bottom: 1rem;
}

.project-info label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.grant-items-table {
  margin-top: 16px;
  /* Prevent resize observer issues */
  contain: layout;
}

/* Enhanced CSS for nested table CRUD */
.expanded-row-content {
  padding: 20px 32px;
  background-color: #fafafa;
  border-radius: 6px;
  margin: 8px 0;
  /* Prevent resize observer issues */
  contain: layout style;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.slot-title {
  font-weight: 600;
  margin-bottom: 0;
  color: #333;
  font-size: 14px;
}

.add-slot-btn {
  font-size: 12px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.add-slot-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.slots-table {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  /* Prevent resize observer issues */
  contain: layout;
}

.slots-table :deep(.ant-table-thead > tr > th) {
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding: 8px 12px;
  font-size: 12px;
}

.slots-table :deep(.ant-table-tbody > tr > td) {
  padding: 8px 12px;
  vertical-align: middle;
}

.slots-table :deep(.ant-table-tbody > tr:hover > td) {
  background-color: #f8f9fa;
}

.slot-input {
  width: 70px;
  font-size: 12px;
}

.budget-select {
  min-width: 250px;
  font-size: 12px;
}

.slot-number {
  font-weight: 500;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-buttons a {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.edit-btn {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

.edit-btn:hover {
  background: rgba(24, 144, 255, 0.2);
  color: #096dd9;
}

.delete-btn {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.delete-btn:hover {
  background: rgba(255, 77, 79, 0.2);
  color: #d9363e;
}

.save-btn {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.save-btn:hover {
  background: rgba(82, 196, 26, 0.2);
  color: #389e0d;
}

.cancel-btn {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.cancel-btn:hover {
  background: rgba(255, 77, 79, 0.2);
  color: #d9363e;
}

.action-buttons.editing a {
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .expanded-row-content {
    padding: 16px 20px;
  }

  .slot-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .budget-select {
    min-width: 200px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
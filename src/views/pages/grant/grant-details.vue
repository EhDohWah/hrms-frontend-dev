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

              <!-- Grant Items Table -->
              <div class="mt-4">
                <h5 class="card-title">Grant Positions</h5>
                <div class="table-responsive-custom">
                  <a-table :columns="grantItemColumns" :dataSource="grant.items" :rowKey="record => record.id" bordered
                    size="small" :pagination="false" class="grant-items-table"
                    :loading="{ spinning: loading, indicator: loadingIndicator }">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.dataIndex === 'capacity_status'">
                        <a-tag :color="getCapacityColor(record)">
                          {{ record.active_allocations_count || 0 }} / {{ record.grant_position_number || 1 }}
                        </a-tag>
                      </template>
                    </template>
                  </a-table>
                </div>
              </div>

              <!-- Activity History -->
              <div class="mt-4">
                <ActivityLogTimeline
                  v-if="grant.id"
                  subject-type="grant"
                  :subject-id="grant.id"
                  title="Grant History"
                  :show-filter="true"
                  :show-subject-type="false"
                  :per-page="10"
                />
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
import { ref, onMounted, h, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useGrantStore } from '@/stores/grantStore';
import { LoadingOutlined } from '@ant-design/icons-vue';
import ActivityLogTimeline from '@/components/activity-log/ActivityLogTimeline.vue';
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
  { title: 'Budget Line Code', dataIndex: 'budgetline_code', key: 'budgetline_code' },
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
  { title: 'Capacity', dataIndex: 'grant_position_number', key: 'grant_position_number' },
  { 
    title: 'Allocated', 
    dataIndex: 'capacity_status', 
    key: 'capacity_status',
    align: 'center'
  },
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
];

// Get capacity color based on allocation status
function getCapacityColor(record) {
  const allocated = record.active_allocations_count || 0;
  const capacity = record.grant_position_number || 1;
  
  if (allocated >= capacity) return 'red';
  if (allocated > 0) return 'orange';
  return 'green';
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 16px;
  }
}
</style>

<template>
  <div class="bulk-payroll-create">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <h4 class="mb-1 fw-bold">
            <i class="ti ti-cash-banknote me-2"></i>Bulk Payroll Creation
          </h4>
          <p class="text-muted mb-0">Create payroll records for multiple employees with real-time progress tracking</p>
        </div>
        <button type="button" class="btn btn-outline-secondary" @click="goBack">
          <i class="ti ti-arrow-left me-1"></i> Back to Payroll
        </button>
      </div>
    </div>

    <!-- Main Form Card -->
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0"><i class="ti ti-filter me-2"></i>Configuration</h5>
      </div>
      <div class="card-body">
        <!-- Pay Period Selection -->
        <div class="row mb-4">
          <div class="col-md-12">
            <label class="form-label fw-semibold">
              <i class="ti ti-calendar me-1"></i>Pay Period <span class="text-danger">*</span>
            </label>
            <a-month-picker
              v-model:value="formData.payPeriod"
              class="w-100"
              format="MMMM YYYY"
              value-format="YYYY-MM"
              placeholder="Select pay period month"
              :disabled-date="disablePayPeriod"
            />
            <small class="text-muted">Select the month for which payroll should be created</small>
            <div v-if="formErrors.payPeriod" class="text-danger mt-1 small">{{ formErrors.payPeriod }}</div>
          </div>
        </div>

        <hr class="my-4" />

        <!-- Filters Section -->
        <div class="filters-section">
          <h6 class="mb-3 fw-semibold">
            <i class="ti ti-adjustments me-1"></i>Filters
            <small class="text-muted fw-normal ms-2">(Optional - leave empty to include all active employees)</small>
          </h6>

          <div class="row g-3">
            <!-- Organization Filter -->
            <div class="col-md-6">
              <label class="form-label">Organization</label>
              <div class="d-flex flex-column gap-2">
                <div
                  v-for="sub in availableSubsidiaries"
                  :key="sub.value"
                  class="form-check"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`sub-${sub.value}`"
                    :value="sub.value"
                    v-model="filters.subsidiaries"
                  />
                  <label class="form-check-label" :for="`sub-${sub.value}`">
                    {{ sub.label }}
                  </label>
                </div>
              </div>
              <small class="text-muted">Select one or more subsidiaries</small>
            </div>

            <!-- Department Filter -->
            <div class="col-md-6">
              <label class="form-label">Department</label>
              <a-select
                v-model:value="filters.departments"
                mode="multiple"
                class="w-100"
                placeholder="Select departments"
                :options="departmentOptions"
                :max-tag-count="2"
                allow-clear
              />
              <small class="text-muted">Select one or more departments</small>
            </div>

            <!-- Grant Filter -->
            <div class="col-md-6">
              <label class="form-label">Grant/Funding Source</label>
              <a-select
                v-model:value="filters.grants"
                mode="multiple"
                class="w-100"
                placeholder="Select grants"
                :options="grantOptions"
                :max-tag-count="2"
                allow-clear
                :filter-option="filterGrantOption"
                show-search
              />
              <small class="text-muted">Select one or more grants</small>
            </div>

            <!-- Employment Type Filter -->
            <div class="col-md-6">
              <label class="form-label">Employment Type</label>
              <a-select
                v-model:value="filters.employment_types"
                mode="multiple"
                class="w-100"
                placeholder="Select employment types"
                :options="employmentTypeOptions"
                :max-tag-count="2"
                allow-clear
              />
              <small class="text-muted">Select one or more employment types</small>
            </div>
          </div>

          <!-- Active Filters Summary -->
          <div v-if="hasActiveFilters" class="mt-3 p-3 bg-light rounded">
            <small class="text-muted fw-semibold">Active Filters:</small>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <span v-if="filters.subsidiaries.length > 0" class="badge bg-primary">
                Subsidiaries: {{ filters.subsidiaries.length }}
              </span>
              <span v-if="filters.departments.length > 0" class="badge bg-info">
                Departments: {{ filters.departments.length }}
              </span>
              <span v-if="filters.grants.length > 0" class="badge bg-success">
                Grants: {{ filters.grants.length }}
              </span>
              <span v-if="filters.employment_types.length > 0" class="badge bg-warning text-dark">
                Employment Types: {{ filters.employment_types.length }}
              </span>
              <button type="button" class="btn btn-sm btn-outline-secondary" @click="clearAllFilters">
                <i class="ti ti-x me-1"></i>Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer bg-light">
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" @click="goBack">
            <i class="ti ti-x me-1"></i>Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="calculatePreview"
            :disabled="!formData.payPeriod || loadingPreview"
          >
            <span v-if="!loadingPreview">
              <i class="ti ti-calculator me-1"></i>Calculate Preview
            </span>
            <span v-else>
              <span class="spinner-border spinner-border-sm me-2"></span>Calculating...
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <a-modal
      v-model:open="showPreviewModal"
      title="Bulk Payroll Preview"
      :width="800"
      :footer="null"
      :mask-closable="false"
    >
      <div v-if="previewData">
        <!-- Summary Cards -->
        <div class="row g-3 mb-4">
          <div class="col-md-3 col-sm-6">
            <div class="preview-card text-center">
              <div class="preview-icon">
                <i class="ti ti-users text-primary"></i>
              </div>
              <div class="preview-number">{{ previewData.total_employees }}</div>
              <div class="preview-label">Employees</div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="preview-card text-center">
              <div class="preview-icon">
                <i class="ti ti-file-invoice text-info"></i>
              </div>
              <div class="preview-number">{{ previewData.total_payrolls }}</div>
              <div class="preview-label">Payroll Records</div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="preview-card text-center">
              <div class="preview-icon">
                <i class="ti ti-cash text-success"></i>
              </div>
              <div class="preview-number">฿{{ previewData.total_net_salary }}</div>
              <div class="preview-label">Total Net Salary</div>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="preview-card text-center">
              <div class="preview-icon">
                <i class="ti ti-arrows-exchange text-warning"></i>
              </div>
              <div class="preview-number">{{ previewData.advances_needed }}</div>
              <div class="preview-label">Inter-Sub Advances</div>
            </div>
          </div>
        </div>

        <!-- Pay Period Info -->
        <div class="alert alert-info mb-3">
          <strong><i class="ti ti-calendar me-1"></i>Pay Period:</strong> {{ formatPayPeriod(formData.payPeriod) }}
        </div>

        <!-- Warnings -->
        <div v-if="previewData.warnings && previewData.warnings.length > 0" class="warnings-section mb-3">
          <h6 class="text-warning mb-2">
            <i class="ti ti-alert-triangle me-1"></i>Warnings ({{ previewData.warnings.length }})
          </h6>
          <div class="warnings-list">
            <div
              v-for="(warning, index) in displayedWarnings"
              :key="index"
              class="alert alert-warning py-2 px-3 mb-2 small"
            >
              <i class="ti ti-alert-circle me-1"></i>{{ warning }}
            </div>
            <button
              v-if="previewData.warnings.length > 5 && !showAllWarnings"
              type="button"
              class="btn btn-sm btn-outline-warning"
              @click="showAllWarnings = true"
            >
              Show all {{ previewData.warnings.length }} warnings
            </button>
          </div>
        </div>

        <!-- Confirmation -->
        <div class="alert alert-primary mb-0">
          <strong><i class="ti ti-info-circle me-1"></i>Important:</strong>
          This will create <strong>{{ previewData.total_payrolls }} payroll records</strong> for
          <strong>{{ previewData.total_employees }} employees</strong>. The process will run in the background
          and you can monitor progress in real-time.
        </div>

        <!-- Modal Actions -->
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="button" class="btn btn-secondary" @click="closePreviewModal">
            <i class="ti ti-x me-1"></i>Cancel
          </button>
          <button
            type="button"
            class="btn btn-success"
            @click="confirmAndCreate"
            :disabled="submitting"
          >
            <span v-if="!submitting">
              <i class="ti ti-check me-1"></i>Confirm & Create ({{ previewData.total_payrolls }})
            </span>
            <span v-else>
              <span class="spinner-border spinner-border-sm me-2"></span>Creating Batch...
            </span>
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import moment from 'moment';
import { payrollService } from '@/services/payroll.service';
import { useLookupStore } from '@/stores/lookupStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { useGrantStore } from '@/stores/grantStore';

export default {
  name: 'BulkPayrollCreate',

  setup() {
    const router = useRouter();
    const lookupStore = useLookupStore();
    const sharedStore = useSharedDataStore();
    const grantStore = useGrantStore();

    const loadingPreview = ref(false);
    const submitting = ref(false);
    const showPreviewModal = ref(false);
    const showAllWarnings = ref(false);
    const previewData = ref(null);

    const formData = reactive({
      payPeriod: null,
    });

    const formErrors = reactive({
      payPeriod: '',
    });

    const filters = reactive({
      subsidiaries: [],
      departments: [],
      grants: [],
      employment_types: [],
    });

    const availableSubsidiaries = ref([]);
    const departments = ref([]);
    const grants = ref([]);

    // Computed properties
    const hasActiveFilters = computed(() => {
      return filters.subsidiaries.length > 0 ||
             filters.departments.length > 0 ||
             filters.grants.length > 0 ||
             filters.employment_types.length > 0;
    });

    const departmentOptions = computed(() => {
      return departments.value.map(dept => ({
        value: dept.id,
        label: dept.name,
      }));
    });

    const grantOptions = computed(() => {
      return grants.value.map(grant => ({
        value: grant.id,
        label: `${grant.code} - ${grant.name}`,
        code: grant.code,
        name: grant.name,
      }));
    });

    const employmentTypeOptions = computed(() => [
      { value: 'permanent', label: 'Permanent' },
      { value: 'probation', label: 'Probation' },
      { value: 'contract', label: 'Contract' },
      { value: 'daily', label: 'Daily Wage' },
    ]);

    const displayedWarnings = computed(() => {
      if (!previewData.value || !previewData.value.warnings) return [];
      return showAllWarnings.value
        ? previewData.value.warnings
        : previewData.value.warnings.slice(0, 5);
    });

    // Methods
    const disablePayPeriod = (current) => {
      // Allow current month and previous 6 months
      const sixMonthsAgo = moment().subtract(6, 'months').startOf('month');
      const nextMonth = moment().add(1, 'month').endOf('month');
      return current && (current < sixMonthsAgo || current > nextMonth);
    };

    const filterGrantOption = (input, option) => {
      const searchText = input.toLowerCase();
      return (
        option.code.toLowerCase().includes(searchText) ||
        option.name.toLowerCase().includes(searchText)
      );
    };

    const clearAllFilters = () => {
      filters.subsidiaries = [];
      filters.departments = [];
      filters.grants = [];
      filters.employment_types = [];
    };

    const formatPayPeriod = (payPeriod) => {
      if (!payPeriod) return '';
      return moment(payPeriod, 'YYYY-MM').format('MMMM YYYY');
    };

    const validateForm = () => {
      formErrors.payPeriod = '';

      if (!formData.payPeriod) {
        formErrors.payPeriod = 'Pay period is required';
        return false;
      }

      return true;
    };

    const calculatePreview = async () => {
      if (!validateForm()) {
        message.warning('Please fill in all required fields');
        return;
      }

      loadingPreview.value = true;
      showAllWarnings.value = false;

      try {
        const payload = {
          pay_period: formData.payPeriod,
          filters: {
            subsidiaries: filters.subsidiaries.length > 0 ? filters.subsidiaries : undefined,
            departments: filters.departments.length > 0 ? filters.departments : undefined,
            grants: filters.grants.length > 0 ? filters.grants : undefined,
            employment_types: filters.employment_types.length > 0 ? filters.employment_types : undefined,
          },
        };

        // Remove undefined filters
        Object.keys(payload.filters).forEach(key => {
          if (payload.filters[key] === undefined) {
            delete payload.filters[key];
          }
        });

        const response = await payrollService.bulkPreview(payload);

        if (response.success) {
          previewData.value = response.data;
          showPreviewModal.value = true;

          message.success({
            content: `Preview generated successfully for ${response.data.total_employees} employees`,
            duration: 2,
          });
        } else {
          throw new Error(response.message || 'Failed to generate preview');
        }
      } catch (error) {
        console.error('Preview error:', error);
        message.error(error.response?.data?.message || error.message || 'Failed to generate preview');
      } finally {
        loadingPreview.value = false;
      }
    };

    const confirmAndCreate = async () => {
      submitting.value = true;

      try {
        const payload = {
          pay_period: formData.payPeriod,
          filters: {
            subsidiaries: filters.subsidiaries.length > 0 ? filters.subsidiaries : undefined,
            departments: filters.departments.length > 0 ? filters.departments : undefined,
            grants: filters.grants.length > 0 ? filters.grants : undefined,
            employment_types: filters.employment_types.length > 0 ? filters.employment_types : undefined,
          },
        };

        // Remove undefined filters
        Object.keys(payload.filters).forEach(key => {
          if (payload.filters[key] === undefined) {
            delete payload.filters[key];
          }
        });

        const response = await payrollService.bulkCreate(payload);

        if (response.success) {
          const batchId = response.data.batch_id;

          message.success({
            content: 'Bulk payroll batch created successfully! Redirecting to progress page...',
            duration: 2,
          });

          // Redirect to progress page
          setTimeout(() => {
            router.push({
              name: 'bulk-payroll-progress',
              params: { batchId },
            });
          }, 500);
        } else {
          throw new Error(response.message || 'Failed to create bulk payroll batch');
        }
      } catch (error) {
        console.error('Create batch error:', error);
        message.error(error.response?.data?.message || error.message || 'Failed to create bulk payroll batch');
        submitting.value = false;
      }
    };

    const closePreviewModal = () => {
      showPreviewModal.value = false;
      previewData.value = null;
      showAllWarnings.value = false;
    };

    const goBack = () => {
      router.push({ name: 'payroll-list' });
    };

    const loadLookupData = async () => {
      try {
        // Load subsidiaries
        if (!lookupStore.lookups.length) {
          await lookupStore.fetchAllLookupLists();
        }
        const subsidiaries = lookupStore.getLookupsByType('organization');
        availableSubsidiaries.value = subsidiaries.map(sub => ({
          value: sub.value,
          label: sub.value,
        }));

        // Load departments
        if (!sharedStore.isDepartmentsLoaded) {
          await sharedStore.fetchDepartments(false, {});
        }
        departments.value = sharedStore.getDepartments || [];

        // Load grants
        if (!grantStore.isGrantsLoaded) {
          await grantStore.fetchGrants({ per_page: 1000 });
        }
        grants.value = grantStore.getGrants || [];
      } catch (error) {
        console.error('Error loading lookup data:', error);
        message.error('Failed to load filter options');
      }
    };

    onMounted(() => {
      loadLookupData();
    });

    return {
      formData,
      formErrors,
      filters,
      loadingPreview,
      submitting,
      showPreviewModal,
      showAllWarnings,
      previewData,
      availableSubsidiaries,
      departmentOptions,
      grantOptions,
      employmentTypeOptions,
      hasActiveFilters,
      displayedWarnings,
      disablePayPeriod,
      filterGrantOption,
      clearAllFilters,
      formatPayPeriod,
      calculatePreview,
      confirmAndCreate,
      closePreviewModal,
      goBack,
    };
  },
};
</script>

<style scoped>
.bulk-payroll-create {
  padding: 1.5rem;
}

.page-header {
  padding-bottom: 1rem;
  border-bottom: 2px solid #dee2e6;
}

.filters-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.preview-card {
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.preview-card:hover {
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.preview-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.preview-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.25rem;
}

.preview-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.warnings-list {
  max-height: 300px;
  overflow-y: auto;
}

/* Ant Design Overrides */
:deep(.ant-picker),
:deep(.ant-select-selector) {
  border-radius: 0.375rem !important;
}

:deep(.ant-modal-header) {
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

:deep(.ant-modal-title) {
  font-weight: 600;
  font-size: 1.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .bulk-payroll-create {
    padding: 1rem;
  }

  .preview-number {
    font-size: 1.5rem;
  }
}
</style>

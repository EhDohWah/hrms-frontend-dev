<script>
import { ref, watch, computed } from 'vue';
import { letterTemplateService } from '@/services/letter-template.service';
import { employeeService } from '@/services/employee.service';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import EmployeeTreeSelect from '@/components/shared/EmployeeTreeSelect.vue';
import { message } from 'ant-design-vue';
import moment from 'moment';

export default {
  name: 'GeneratePdfModal',
  components: {
    EmployeeTreeSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    template: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const sharedDataStore = useSharedDataStore();

    const loading = ref(false);
    const loadingContent = ref(false);
    const loadingEmployee = ref(false);
    const templateContent = ref('');
    const placeholderValues = ref({});

    // Employee selector state
    const employeeTreeData = ref([]);
    const selectedEmployeeId = ref(null);
    const selectedEmployeeDisplay = ref('');
    const selectedEmployeeInfo = ref(null);

    // Detect which placeholders are actually used in this template's content
    const detectedPlaceholders = computed(() => {
      if (!templateContent.value) return [];
      const allCategories = letterTemplateService.getPlaceholderCategories();
      const detected = [];

      for (const category of allCategories) {
        const matchedPlaceholders = category.placeholders.filter(
          ph => templateContent.value.includes(`{${ph.key}}`)
        );
        if (matchedPlaceholders.length > 0) {
          detected.push({
            label: category.label,
            placeholders: matchedPlaceholders
          });
        }
      }
      return detected;
    });

    const hasPlaceholders = computed(() => detectedPlaceholders.value.length > 0);

    // Load employee tree data for the selector
    const loadEmployeeTreeData = async () => {
      try {
        await sharedDataStore.loadAllDropdownData({
          includeEmployees: true,
          force: false
        });
        employeeTreeData.value = sharedDataStore.getEmployeeTreeData;
      } catch (error) {
        console.error('Error loading employee data:', error);
      }
    };

    // Map employee API response to placeholder values
    const mapEmployeeToPlaceholders = (employee) => {
      const employment = employee.employment;
      const mapped = {};

      // Employee fields
      mapped.employee_name = [employee.first_name_en, employee.last_name_en].filter(Boolean).join(' ');
      mapped.staff_id = employee.staff_id || '';
      mapped.date_of_birth = employee.date_of_birth ? moment(employee.date_of_birth).format('DD/MM/YYYY') : '';
      mapped.nationality = employee.nationality || '';

      // Employment fields (from the active employment record)
      if (employment) {
        mapped.position = employment.position?.title || '';
        mapped.department = employment.department?.name || '';
        mapped.site = employment.site?.name || '';
        mapped.start_date = employment.start_date ? moment(employment.start_date).format('DD/MM/YYYY') : '';
        mapped.probation_salary = employment.probation_salary
          ? Number(employment.probation_salary).toLocaleString('en-US', { minimumFractionDigits: 2 })
          : '';
        mapped.post_probation_salary = employment.pass_probation_salary
          ? Number(employment.pass_probation_salary).toLocaleString('en-US', { minimumFractionDigits: 2 })
          : '';
      }

      // Organization
      mapped.organization_name = employee.organization || '';

      // Date
      mapped.current_date = moment().format('DD/MM/YYYY');

      return mapped;
    };

    // Handle employee selection from tree selector
    const handleEmployeeSelect = async (employee) => {
      selectedEmployeeId.value = employee.value;
      selectedEmployeeDisplay.value = employee.title;

      // Find basic info from tree data
      for (const org of employeeTreeData.value) {
        const emp = org.children?.find(e => e.value === employee.value);
        if (emp) {
          selectedEmployeeInfo.value = {
            name: emp.title,
            staffId: emp.staff_id,
            organization: org.title
          };
          break;
        }
      }

      // Fetch full employee details for placeholder auto-fill
      loadingEmployee.value = true;
      try {
        const response = await employeeService.getEmployeeDetails(employee.value);
        const employeeData = response.data || response;

        // Map employee data to placeholder keys and auto-fill
        const mapped = mapEmployeeToPlaceholders(employeeData);

        // Only fill placeholders that are detected in the template
        const allDetectedKeys = detectedPlaceholders.value
          .flatMap(cat => cat.placeholders.map(ph => ph.key));

        for (const key of allDetectedKeys) {
          if (mapped[key] !== undefined) {
            placeholderValues.value[key] = mapped[key];
          }
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
        message.error('Failed to load employee details');
      } finally {
        loadingEmployee.value = false;
      }
    };

    // Load template content when template changes
    watch(() => props.template, async (newVal) => {
      if (newVal) {
        // Reset state
        placeholderValues.value = {};
        selectedEmployeeId.value = null;
        selectedEmployeeDisplay.value = '';
        selectedEmployeeInfo.value = null;

        // Load template content
        loadingContent.value = true;
        try {
          const response = await letterTemplateService.getTemplate(newVal.id);
          templateContent.value = response.data?.content || '';
        } catch (error) {
          console.error('Error loading template content:', error);
          message.error('Failed to load template content');
          templateContent.value = '';
        } finally {
          loadingContent.value = false;
        }

        // Load employee tree data
        loadEmployeeTreeData();
      } else {
        templateContent.value = '';
        placeholderValues.value = {};
        selectedEmployeeId.value = null;
        selectedEmployeeDisplay.value = '';
        selectedEmployeeInfo.value = null;
      }
    }, { immediate: true });

    const handleGeneratePdf = async () => {
      loading.value = true;
      try {
        const blob = await letterTemplateService.generatePdf(
          props.template.id,
          placeholderValues.value
        );

        // Open PDF in new browser tab
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

        // Clean up the object URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 30000);

        message.success('PDF generated successfully');
      } catch (error) {
        console.error('Error generating PDF:', error);
        message.error(error.message || 'Failed to generate PDF');
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      placeholderValues.value = {};
      selectedEmployeeId.value = null;
      selectedEmployeeDisplay.value = '';
      selectedEmployeeInfo.value = null;
      emit('close');
    };

    // Cleanup modal backdrops after close
    const handleAfterClose = () => {
      const openModals = document.querySelectorAll('.ant-modal-wrap:not([style*="display: none"])');
      if (openModals.length === 0) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };

    return {
      loading,
      loadingContent,
      loadingEmployee,
      placeholderValues,
      detectedPlaceholders,
      hasPlaceholders,
      employeeTreeData,
      selectedEmployeeId,
      selectedEmployeeDisplay,
      selectedEmployeeInfo,
      handleEmployeeSelect,
      handleGeneratePdf,
      handleClose,
      handleAfterClose,
    };
  }
};
</script>

<template>
  <a-modal
    :open="visible"
    title="Generate PDF"
    :confirmLoading="loading"
    @cancel="handleClose"
    @afterClose="handleAfterClose"
    :footer="null"
    :width="650"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
    class="generate-pdf-modal"
  >
    <!-- Loading state -->
    <div v-if="loadingContent" class="text-center py-4">
      <a-spin tip="Loading template..." />
    </div>

    <div v-else>
      <!-- Template Info -->
      <div class="template-info mb-3">
        <div class="d-flex align-items-center">
          <i class="ti ti-template me-2 text-primary" style="font-size: 20px;"></i>
          <strong>{{ template?.title }}</strong>
        </div>
      </div>

      <!-- Employee Selector -->
      <div v-if="hasPlaceholders" class="mb-3">
        <label class="form-label fw-semibold">
          <i class="ti ti-user-search me-1"></i> Select Employee (auto-fill placeholders)
        </label>
        <EmployeeTreeSelect
          v-model="selectedEmployeeId"
          :tree-data="employeeTreeData"
          :display-value="selectedEmployeeDisplay"
          placeholder="Search and select an employee..."
          search-placeholder="Search by name or staff ID..."
          @select="handleEmployeeSelect"
        />

        <!-- Selected Employee Info -->
        <div v-if="selectedEmployeeInfo" class="employee-info-card mt-2">
          <div class="d-flex align-items-center">
            <i class="ti ti-user-check me-2 text-success"></i>
            <div>
              <strong>{{ selectedEmployeeInfo.name }}</strong>
              <small class="text-muted ms-2">Staff ID: {{ selectedEmployeeInfo.staffId }}</small>
              <small class="text-muted ms-2">{{ selectedEmployeeInfo.organization }}</small>
            </div>
          </div>
        </div>

        <!-- Loading employee details -->
        <div v-if="loadingEmployee" class="text-center py-2">
          <a-spin size="small" />
          <span class="text-muted ms-2" style="font-size: 13px;">Loading employee data...</span>
        </div>
      </div>

      <!-- Divider -->
      <div v-if="hasPlaceholders" class="divider mb-3"></div>

      <!-- Placeholder Inputs -->
      <div v-if="hasPlaceholders">
        <p class="text-muted mb-3" style="font-size: 13px;">
          Placeholder values below. Select an employee above to auto-fill, or enter values manually.
        </p>

        <div v-for="category in detectedPlaceholders" :key="category.label" class="mb-3">
          <h6 class="category-label">{{ category.label }}</h6>
          <div
            v-for="ph in category.placeholders"
            :key="ph.key"
            class="placeholder-input-row"
          >
            <label class="placeholder-label">{{ ph.label }}:</label>
            <a-input
              v-model:value="placeholderValues[ph.key]"
              :placeholder="`Enter ${ph.label.toLowerCase()}...`"
              class="placeholder-input"
            />
          </div>
        </div>
      </div>

      <!-- No placeholders message -->
      <div v-else class="text-center py-3">
        <p class="text-muted mb-0">
          This template has no placeholders. The PDF will be generated with the template content as-is.
        </p>
      </div>

      <!-- Footer Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <a-button @click="handleClose" :disabled="loading">
          Cancel
        </a-button>
        <a-button
          type="primary"
          @click="handleGeneratePdf"
          :loading="loading"
          :disabled="loadingContent || loadingEmployee"
        >
          <template #icon><i class="ti ti-file-type-pdf me-1"></i></template>
          Generate PDF
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
/* Reset Ant Design 4 modal content padding */
:deep(.ant-modal-content) {
  padding: 0 !important;
}

:deep(.ant-modal-header) {
  padding: 16px 24px !important;
  margin: 0 !important;
  border-bottom: 1px solid #e5e5e5 !important;
  background: #fff;
}

:deep(.ant-modal-title) {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

:deep(.ant-modal-body) {
  padding: 24px !important;
  margin-top: 0 !important;
}

:deep(.ant-modal-close) {
  top: 12px;
  right: 12px;
}

.template-info {
  padding: 12px 16px;
  background: #f0f5ff;
  border-radius: 6px;
  border: 1px solid #d6e4ff;
}

.employee-info-card {
  padding: 8px 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  font-size: 13px;
}

.divider {
  height: 1px;
  background: #f0f0f0;
}

.category-label {
  font-size: 13px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.placeholder-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.placeholder-label {
  flex: 0 0 160px;
  min-width: 160px;
  font-weight: 500;
  font-size: 14px;
  color: #262626;
  text-align: right;
}

.placeholder-input {
  flex: 1;
}

@media (max-width: 768px) {
  .placeholder-input-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .placeholder-label {
    flex: 1;
    min-width: 100%;
    text-align: left;
  }
}
</style>

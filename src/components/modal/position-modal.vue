<script>
import { ref, watch, computed } from 'vue';
import { positionService } from '@/services/position.service';
import { departmentService } from '@/services/department.service';
import { message } from 'ant-design-vue';

export default {
  name: 'PositionModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingRecord: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'close'],
  setup(props, { emit }) {
    const form = ref({
      title: '',
      department_id: undefined,
      reports_to_position_id: undefined,
      level: 1,
      is_manager: false,
      is_active: true,
    });

    const loading = ref(false);
    const formErrors = ref({});

    // Dropdown options
    const departmentOptions = ref([]);
    const positionOptionsRaw = ref([]);

    const isEditing = computed(() => !!props.editingRecord);
    const modalTitle = computed(() => isEditing.value ? 'Edit Position' : 'Add New Position');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Add Position');

    // Filter positions: same department, exclude self when editing
    const availableReportsTo = computed(() => {
      let filtered = positionOptionsRaw.value;

      if (isEditing.value && props.editingRecord?.id) {
        filtered = filtered.filter(p => p.id !== props.editingRecord.id);
      }

      if (form.value.department_id) {
        filtered = filtered.filter(p => p.department_id === form.value.department_id);
      }

      return filtered.map(p => ({
        value: p.id,
        label: `${p.title} (${p.department_name || 'N/A'})`,
      }));
    });

    const resetForm = () => {
      form.value = {
        title: '',
        department_id: undefined,
        reports_to_position_id: undefined,
        level: 1,
        is_manager: false,
        is_active: true,
      };
      formErrors.value = {};
    };

    const loadOptions = async () => {
      try {
        const [deptResponse, posResponse] = await Promise.all([
          departmentService.getDepartmentOptions(),
          positionService.getPositionOptions(),
        ]);

        if (deptResponse.success && deptResponse.data) {
          departmentOptions.value = deptResponse.data.map(d => ({
            value: d.id,
            label: d.name,
          }));
        }

        if (posResponse.success && posResponse.data) {
          positionOptionsRaw.value = posResponse.data;
        }
      } catch (error) {
        console.error('Error loading options:', error);
      }
    };

    watch(() => props.editingRecord, (newVal) => {
      if (newVal) {
        form.value = {
          title: newVal.title || '',
          department_id: newVal.department_id || undefined,
          reports_to_position_id: newVal.reports_to_position_id || undefined,
          level: newVal.level || 1,
          is_manager: newVal.is_manager || false,
          is_active: newVal.is_active !== undefined ? newVal.is_active : true,
        };
      } else {
        resetForm();
      }
    }, { immediate: true });

    watch(() => props.visible, async (newVal) => {
      if (newVal) {
        await loadOptions();
        if (!props.editingRecord) {
          resetForm();
        }
      }
    });

    // Reset reports_to when department changes
    const onDepartmentChange = () => {
      form.value.reports_to_position_id = undefined;
    };

    const validateForm = () => {
      const errors = {};
      if (!form.value.title?.trim()) {
        errors.title = 'Position title is required';
      }
      if (!form.value.department_id) {
        errors.department_id = 'Department is required';
      }
      if (!form.value.level || form.value.level < 1) {
        errors.level = 'Level is required (minimum 1)';
      }
      formErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        message.warning('Please fill in all required fields');
        return;
      }

      loading.value = true;
      try {
        const data = {
          title: form.value.title?.trim(),
          department_id: form.value.department_id,
          reports_to_position_id: form.value.reports_to_position_id || null,
          level: form.value.level,
          is_manager: form.value.is_manager,
          is_active: form.value.is_active,
        };

        let response;
        if (isEditing.value) {
          response = await positionService.updatePosition(props.editingRecord.id, data);
        } else {
          response = await positionService.createPosition(data);
        }

        if (response.success) {
          message.success(isEditing.value ? 'Position updated successfully' : 'Position created successfully');
          emit('saved', response);
          handleClose();
        } else {
          message.error(response.message || 'Failed to save position');
        }
      } catch (error) {
        if (error.status === 422 && error.errors) {
          Object.keys(error.errors).forEach(field => {
            if (Array.isArray(error.errors[field]) && error.errors[field].length > 0) {
              formErrors.value[field] = error.errors[field][0];
            }
          });
          message.error('Please correct the errors and try again');
        } else {
          message.error(error.message || 'Failed to save position');
        }
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      resetForm();
      emit('close');
    };

    const handleAfterClose = () => {
      const backdrops = document.querySelectorAll('.ant-modal-mask, .ant-modal-wrap');
      const openModals = document.querySelectorAll('.ant-modal-wrap:not([style*="display: none"])');
      if (openModals.length === 0) {
        backdrops.forEach(el => {
          if (el.style.display !== 'none') {
            el.style.display = 'none';
          }
        });
      }
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    const filterOption = (input, option) => {
      return option.label.toLowerCase().includes(input.toLowerCase());
    };

    return {
      form,
      loading,
      formErrors,
      departmentOptions,
      availableReportsTo,
      isEditing,
      modalTitle,
      submitButtonText,
      handleSubmit,
      handleClose,
      handleAfterClose,
      onDepartmentChange,
      filterOption,
    };
  }
};
</script>

<template>
  <a-modal
    :open="visible"
    :title="modalTitle"
    :confirmLoading="loading"
    @cancel="handleClose"
    @afterClose="handleAfterClose"
    :footer="null"
    :width="650"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <form @submit.prevent="handleSubmit">
      <!-- Title -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="position-title">
            Title <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="position-title"
            v-model:value="form.title"
            placeholder="Enter position title"
            :status="formErrors.title ? 'error' : ''"
            class="input-long"
          />
          <div v-if="formErrors.title" class="error-feedback">
            {{ formErrors.title }}
          </div>
        </div>
      </div>

      <!-- Department -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="position-department">
            Department <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-select
            id="position-department"
            v-model:value="form.department_id"
            placeholder="Select department"
            :status="formErrors.department_id ? 'error' : ''"
            :options="departmentOptions"
            show-search
            :filter-option="filterOption"
            class="input-long"
            @change="onDepartmentChange"
          />
          <div v-if="formErrors.department_id" class="error-feedback">
            {{ formErrors.department_id }}
          </div>
        </div>
      </div>

      <!-- Reports To -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="position-reports-to">
            Reports To :
          </label>
        </div>
        <div class="form-input-col">
          <a-select
            id="position-reports-to"
            v-model:value="form.reports_to_position_id"
            placeholder="None"
            :options="availableReportsTo"
            show-search
            :filter-option="filterOption"
            allowClear
            class="input-long"
          />
          <div class="field-hint">Select the position this one reports to</div>
        </div>
      </div>

      <!-- Level -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="position-level">
            Level <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-input-number
            id="position-level"
            v-model:value="form.level"
            :min="1"
            :status="formErrors.level ? 'error' : ''"
            class="input-short"
          />
          <div v-if="formErrors.level" class="error-feedback">
            {{ formErrors.level }}
          </div>
          <div class="field-hint">1 = Department Head, 2 = Manager, 3+ = Staff</div>
        </div>
      </div>

      <!-- Is Manager -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">
            Is Manager :
          </label>
        </div>
        <div class="form-input-col">
          <a-switch v-model:checked="form.is_manager" />
        </div>
      </div>

      <!-- Active -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label">
            Active :
          </label>
        </div>
        <div class="form-input-col">
          <a-switch v-model:checked="form.is_active" />
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <a-button @click="handleClose" :disabled="loading">
          Cancel
        </a-button>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ submitButtonText }}
        </a-button>
      </div>
    </form>
  </a-modal>
</template>

<style scoped>
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

.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.form-label-col {
  flex: 0 0 120px;
  min-width: 120px;
  padding-top: 6px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.form-input-col {
  flex: 1;
  min-width: 0;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0;
  display: block;
  text-align: right;
  color: #262626;
  font-size: 14px;
  white-space: nowrap;
}

.input-short {
  width: 200px !important;
  max-width: 200px;
}

.input-long {
  width: 100% !important;
  max-width: 400px;
}

.field-hint {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.error-feedback {
  display: block;
  width: 100%;
  margin-top: 5px;
  font-size: 0.875em;
  color: #ff4d4f;
  font-weight: 500;
}

.text-danger {
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }

  .form-label-col {
    flex: 1;
    min-width: 100%;
    padding-top: 0;
    justify-content: flex-start;
  }

  .form-label {
    text-align: left;
  }

  .form-input-col {
    flex: 1;
    min-width: 100%;
  }

  .input-short,
  .input-long {
    width: 100% !important;
    max-width: 100%;
  }

  :deep(.ant-picker),
  :deep(.ant-select) {
    width: 100% !important;
  }
}

.gap-2 {
  gap: 0.5rem;
}

:deep(.input-short.ant-input-number) {
  width: 200px !important;
}

:deep(.input-long.ant-select) {
  width: 100% !important;
  max-width: 400px;
}

:deep(.input-long.ant-input) {
  width: 100% !important;
  max-width: 400px;
}

:deep(.ant-select-selector) {
  min-width: inherit;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.ant-select-selection-item) {
  line-height: 30px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.ant-select-selection-placeholder) {
  line-height: 30px !important;
  display: flex !important;
  align-items: center !important;
}
</style>

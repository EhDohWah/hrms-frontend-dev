<script>
import { ref, watch, computed } from 'vue';
import { lookupService } from '@/services/lookup.service';
import { useLookupStore } from '@/stores/lookupStore';
import { message } from 'ant-design-vue';

export default {
  name: 'LookupModal',
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
    const lookupStore = useLookupStore();

    const form = ref({
      type: null,
      value: '',
    });

    const loading = ref(false);
    const formErrors = ref({});
    const showCustomType = ref(false);
    const customType = ref('');
    const loadingTypes = ref(false);

    const isEditing = computed(() => !!props.editingRecord);
    const modalTitle = computed(() => isEditing.value ? 'Edit Lookup' : 'Add Lookup');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Add Lookup');

    const typeOptions = computed(() => {
      const types = lookupStore.getAllLookupTypes || [];
      const options = types.map(type => ({
        value: type,
        label: type,
      }));
      options.push({
        value: '__custom__',
        label: '+ Add New Type...',
      });
      return options;
    });

    const resetForm = () => {
      form.value = {
        type: null,
        value: '',
      };
      formErrors.value = {};
      showCustomType.value = false;
      customType.value = '';
    };

    const loadLookupTypes = async () => {
      if (lookupStore.lookupTypes.length === 0) {
        loadingTypes.value = true;
        try {
          await lookupStore.fetchLookupTypes();
        } catch (error) {
          console.error('Error loading lookup types:', error);
        } finally {
          loadingTypes.value = false;
        }
      }
    };

    watch(() => props.editingRecord, (newVal) => {
      if (newVal) {
        form.value = {
          type: newVal.type || null,
          value: newVal.value || '',
        };
        showCustomType.value = false;
        customType.value = '';
      } else {
        resetForm();
      }
    }, { immediate: true });

    watch(() => props.visible, async (newVal) => {
      if (newVal) {
        if (!props.editingRecord) {
          resetForm();
        }
        await loadLookupTypes();
      }
    });

    const handleTypeChange = (value) => {
      if (value === '__custom__') {
        showCustomType.value = true;
        form.value.type = null;
      } else {
        showCustomType.value = false;
        customType.value = '';
      }
    };

    const validateForm = () => {
      const errors = {};

      // Check type
      if (showCustomType.value) {
        if (!customType.value?.trim()) {
          errors.type = 'Please enter a new type name';
        }
      } else if (!form.value.type) {
        errors.type = 'Type is required';
      }

      if (!form.value.value?.trim()) {
        errors.value = 'Value is required';
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
        // Resolve type from custom input if needed
        const resolvedType = showCustomType.value
          ? customType.value.trim().toLowerCase().replace(/\s+/g, '_')
          : form.value.type;

        const data = {
          type: resolvedType,
          value: form.value.value.trim(),
        };

        let response;
        if (isEditing.value) {
          response = await lookupService.updateLookup(props.editingRecord.id, data);
        } else {
          response = await lookupService.createLookup(data);
        }

        if (response.success || response.data) {
          message.success(isEditing.value ? 'Lookup updated successfully' : 'Lookup created successfully');
          emit('saved', response);
          handleClose();
        } else {
          message.error(response.message || 'Failed to save lookup');
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
          message.error(error.message || 'Failed to save lookup');
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

    return {
      form,
      loading,
      formErrors,
      isEditing,
      modalTitle,
      submitButtonText,
      typeOptions,
      showCustomType,
      customType,
      loadingTypes,
      handleTypeChange,
      handleSubmit,
      handleClose,
      handleAfterClose,
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
    :width="550"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <form @submit.prevent="handleSubmit">
      <!-- Type -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="lookup-type">
            Type <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-select
            v-if="!showCustomType"
            id="lookup-type"
            v-model:value="form.type"
            show-search
            placeholder="Select a type"
            :options="typeOptions"
            :loading="loadingTypes"
            :status="formErrors.type ? 'error' : ''"
            :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
            class="input-long"
            @change="handleTypeChange"
          />
          <div v-else>
            <div class="d-flex align-items-center gap-2">
              <a-input
                v-model:value="customType"
                placeholder="Enter new type name"
                :status="formErrors.type ? 'error' : ''"
                class="input-long"
              />
              <a-button size="small" @click="showCustomType = false; customType = ''; form.type = null;">
                Cancel
              </a-button>
            </div>
            <div class="hint-text">e.g. department, position, employee_status</div>
          </div>
          <div v-if="formErrors.type" class="error-feedback">
            {{ formErrors.type }}
          </div>
        </div>
      </div>

      <!-- Value -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="lookup-value">
            Value <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="lookup-value"
            v-model:value="form.value"
            placeholder="Enter lookup value"
            :status="formErrors.value ? 'error' : ''"
            :maxlength="200"
            class="input-long"
          />
          <div v-if="formErrors.value" class="error-feedback">
            {{ formErrors.value }}
          </div>
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
  flex: 0 0 80px;
  min-width: 80px;
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

.input-long {
  width: 100% !important;
  max-width: 350px;
}

.error-feedback {
  display: block;
  width: 100%;
  margin-top: 5px;
  font-size: 0.875em;
  color: #ff4d4f;
  font-weight: 500;
}

.hint-text {
  margin-top: 4px;
  font-size: 0.875em;
  color: #8c8c8c;
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

  .input-long {
    width: 100% !important;
    max-width: 100%;
  }

  :deep(.ant-select) {
    width: 100% !important;
  }
}

.gap-2 {
  gap: 0.5rem;
}

:deep(.input-long.ant-select) {
  width: 100% !important;
  max-width: 350px;
}
</style>

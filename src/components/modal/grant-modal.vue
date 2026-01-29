<script>
import { ref, watch, computed } from 'vue';
import { grantService } from '@/services/grant.service';
import { useLookupStore } from '@/stores/lookupStore';
import { message } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'GrantModal',
  components: {
    InfoCircleOutlined,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingGrant: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'close'],
  setup(props, { emit }) {
    // Form state
    const form = ref({
      organization: '',
      name: '',
      code: '',
      end_date: null,
      description: ''
    });

    // Loading and error states
    const loading = ref(false);
    const formErrors = ref({});

    // Organization options from lookup store
    const organizationOptions = ref([]);

    // Computed
    const isEditing = computed(() => !!props.editingGrant);
    const modalTitle = computed(() => isEditing.value ? 'Edit Grant' : 'Add Grant');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Add Grant');

    // Methods
    const resetForm = () => {
      form.value = {
        organization: '',
        name: '',
        code: '',
        end_date: null,
        description: ''
      };
      formErrors.value = {};
    };

    const loadOrganizations = async () => {
      try {
        const lookupStore = useLookupStore();
        if (!lookupStore.lookups.length) {
          await lookupStore.fetchAllLookupLists();
        }
        const orgs = lookupStore.getLookupsByType('organization');
        organizationOptions.value = orgs.map(org => ({
          label: org.value,
          value: org.value
        }));
      } catch (error) {
        console.error('Error loading organizations:', error);
        organizationOptions.value = [];
      }
    };

    // Watch for editing grant changes
    watch(() => props.editingGrant, (newVal) => {
      if (newVal) {
        form.value = {
          organization: newVal.organization || '',
          name: newVal.name || '',
          code: newVal.code || '',
          end_date: newVal.end_date ? dayjs(newVal.end_date) : null,
          description: newVal.description || ''
        };
      } else {
        resetForm();
      }
    }, { immediate: true });

    // Watch visibility to load organizations and reset form
    watch(() => props.visible, async (newVal) => {
      if (newVal) {
        // Load organizations when modal opens
        await loadOrganizations();
        if (!props.editingGrant) {
          resetForm();
        }
      }
    });

    const validateForm = () => {
      const errors = {};

      if (!form.value.organization) {
        errors.organization = 'Organization is required';
      }

      if (!form.value.name?.trim()) {
        errors.name = 'Grant name is required';
      }

      if (!form.value.code?.trim()) {
        errors.code = 'Grant code is required';
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
        // Prepare data for API
        const data = {
          organization: form.value.organization,
          name: form.value.name.trim(),
          code: form.value.code.trim(),
          end_date: form.value.end_date ? dayjs(form.value.end_date).format('YYYY-MM-DD') : null,
          description: form.value.description?.trim() || null
        };

        let response;
        if (isEditing.value) {
          response = await grantService.updateGrant(props.editingGrant.id, data);
        } else {
          response = await grantService.createGrant(data);
        }

        if (response.success) {
          message.success(isEditing.value ? 'Grant updated successfully' : 'Grant created successfully');
          emit('saved', response);
          handleClose();
        } else {
          message.error(response.message || 'Failed to save grant');
        }
      } catch (error) {
        console.error('Error saving grant:', error);

        // Handle validation errors from server (422)
        if (error.status === 422 && error.errors) {
          Object.keys(error.errors).forEach(field => {
            if (Array.isArray(error.errors[field]) && error.errors[field].length > 0) {
              formErrors.value[field] = error.errors[field][0];
            }
          });
          message.error('Please correct the errors and try again');
        } else {
          message.error(error.message || 'Failed to save grant');
        }
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      resetForm();
      emit('close');
    };

    // Cleanup any stray modal elements after close animation completes
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
      organizationOptions,
      isEditing,
      modalTitle,
      submitButtonText,
      handleSubmit,
      handleClose,
      handleAfterClose,
      resetForm
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
    :width="600"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <form @submit.prevent="handleSubmit">
      <!-- Organization -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="grant-organization">
            Organization <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-select
              id="grant-organization"
              v-model:value="form.organization"
              placeholder="Select an organization"
              :status="formErrors.organization ? 'error' : ''"
              :options="organizationOptions"
              class="input-short"
            />
            <span class="tooltip-icon" title="Select the organization for this grant (SMRU or BHF)">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.organization" class="error-feedback">
            {{ formErrors.organization }}
          </div>
        </div>
      </div>

      <!-- Grant Name -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="grant-name">
            Grant Name <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-input
              id="grant-name"
              v-model:value="form.name"
              placeholder="e.g., UNICEF-EP"
              :status="formErrors.name ? 'error' : ''"
              class="input-medium"
            />
            <span class="tooltip-icon" title="Enter the full name of the grant project">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.name" class="error-feedback">
            {{ formErrors.name }}
          </div>
        </div>
      </div>

      <!-- Grant Code -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="grant-code">
            Grant Code <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-input
              id="grant-code"
              v-model:value="form.code"
              placeholder="e.g., B-24004"
              :status="formErrors.code ? 'error' : ''"
              class="input-medium"
            />
            <span class="tooltip-icon" title="Enter the unique grant code identifier">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
          <div v-if="formErrors.code" class="error-feedback">
            {{ formErrors.code }}
          </div>
        </div>
      </div>

      <!-- End Date -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="grant-end-date">
            End Date :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-date-picker
              id="grant-end-date"
              v-model:value="form.end_date"
              class="input-short"
              placeholder="Select date"
              format="DD MMM YYYY"
            />
            <span class="tooltip-icon" title="Select the end date when this grant project will conclude">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="grant-description">
            Description :
          </label>
        </div>
        <div class="form-input-col">
          <div class="input-with-tooltip">
            <a-textarea
              id="grant-description"
              v-model:value="form.description"
              placeholder="Enter grant description and objectives..."
              :rows="3"
              style="width: 100%;"
            />
            <span class="tooltip-icon tooltip-icon-textarea" title="Provide a detailed description of the grant project, its objectives, and scope">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
            </span>
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
/* Reset Ant Design 4 modal content padding */
:deep(.ant-modal-content) {
  padding: 0 !important;
}

/* Modal header styling - add divider line and spacing */
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

/* Horizontal form layout - labels on left, inputs on right */
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

/* Input width classes */
.input-short {
  width: 200px !important;
  max-width: 200px;
}

.input-medium {
  width: 300px !important;
  max-width: 300px;
}

/* Tooltip positioning */
.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 0;
}

.tooltip-icon {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  flex-shrink: 0;
}

.tooltip-icon-textarea {
  align-self: flex-start;
  margin-top: 8px;
}

/* Error feedback */
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

/* Responsive: stack vertically on small screens */
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
  .input-medium {
    width: 100% !important;
    max-width: 100%;
  }

  :deep(.ant-picker),
  :deep(.ant-select) {
    width: 100% !important;
  }
}

/* Button gap utility */
.gap-2 {
  gap: 0.5rem;
}

/* Ant Design component overrides for input widths */
:deep(.input-short.ant-picker),
:deep(.input-short.ant-select) {
  width: 200px !important;
}

:deep(.input-medium.ant-input) {
  width: 300px !important;
}

/* Fix for select dropdown to prevent text clipping */
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

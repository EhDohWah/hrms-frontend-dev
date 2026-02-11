<script>
import { ref, watch, computed } from 'vue';
import { siteService } from '@/services/site.service';
import { message } from 'ant-design-vue';

export default {
  name: 'SiteModal',
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
      name: '',
      code: '',
      description: '',
      address: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      is_active: true,
    });

    const loading = ref(false);
    const formErrors = ref({});

    const isEditing = computed(() => !!props.editingRecord);
    const modalTitle = computed(() => isEditing.value ? 'Edit Site' : 'Add New Site');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Add Site');

    const resetForm = () => {
      form.value = {
        name: '',
        code: '',
        description: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        is_active: true,
      };
      formErrors.value = {};
    };

    watch(() => props.editingRecord, (newVal) => {
      if (newVal) {
        form.value = {
          name: newVal.name || '',
          code: newVal.code || '',
          description: newVal.description || '',
          address: newVal.address || '',
          contact_person: newVal.contact_person || '',
          contact_phone: newVal.contact_phone || '',
          contact_email: newVal.contact_email || '',
          is_active: newVal.is_active !== undefined ? newVal.is_active : true,
        };
      } else {
        resetForm();
      }
    }, { immediate: true });

    watch(() => props.visible, (newVal) => {
      if (newVal && !props.editingRecord) {
        resetForm();
      }
    });

    const validateForm = () => {
      const errors = {};
      if (!form.value.name?.trim()) {
        errors.name = 'Site name is required';
      }
      if (!form.value.code?.trim()) {
        errors.code = 'Site code is required';
      }
      if (form.value.contact_email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.contact_email)) {
        errors.contact_email = 'Invalid email format';
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
          name: form.value.name?.trim(),
          code: form.value.code?.trim(),
          description: form.value.description?.trim() || null,
          address: form.value.address?.trim() || null,
          contact_person: form.value.contact_person?.trim() || null,
          contact_phone: form.value.contact_phone?.trim() || null,
          contact_email: form.value.contact_email?.trim() || null,
          is_active: form.value.is_active,
        };

        let response;
        if (isEditing.value) {
          response = await siteService.updateSite(props.editingRecord.id, data);
        } else {
          response = await siteService.createSite(data);
        }

        if (response.success) {
          message.success(isEditing.value ? 'Site updated successfully' : 'Site created successfully');
          emit('saved', response);
          handleClose();
        } else {
          message.error(response.message || 'Failed to save site');
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
          message.error(error.message || 'Failed to save site');
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
    :width="650"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <form @submit.prevent="handleSubmit">
      <!-- Name -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="site-name">
            Name <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="site-name"
            v-model:value="form.name"
            placeholder="Enter site name"
            :status="formErrors.name ? 'error' : ''"
            class="input-long"
          />
          <div v-if="formErrors.name" class="error-feedback">
            {{ formErrors.name }}
          </div>
        </div>
      </div>

      <!-- Code -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="site-code">
            Code <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="site-code"
            v-model:value="form.code"
            placeholder="Enter site code"
            :status="formErrors.code ? 'error' : ''"
            class="input-short"
          />
          <div v-if="formErrors.code" class="error-feedback">
            {{ formErrors.code }}
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="site-description">
            Description :
          </label>
        </div>
        <div class="form-input-col">
          <a-textarea
            id="site-description"
            v-model:value="form.description"
            placeholder="Enter description"
            :rows="2"
            style="width: 100%;"
          />
        </div>
      </div>

      <!-- Address -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="site-address">
            Address :
          </label>
        </div>
        <div class="form-input-col">
          <a-textarea
            id="site-address"
            v-model:value="form.address"
            placeholder="Enter address"
            :rows="2"
            style="width: 100%;"
          />
        </div>
      </div>

      <!-- Contact Person -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="site-contact-person">
            Contact Person :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="site-contact-person"
            v-model:value="form.contact_person"
            placeholder="Enter contact person name"
            class="input-long"
          />
        </div>
      </div>

      <!-- Contact Phone -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="site-contact-phone">
            Contact Phone :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="site-contact-phone"
            v-model:value="form.contact_phone"
            placeholder="Enter contact phone"
            class="input-short"
          />
        </div>
      </div>

      <!-- Contact Email -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="site-contact-email">
            Contact Email :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="site-contact-email"
            v-model:value="form.contact_email"
            placeholder="Enter contact email"
            :status="formErrors.contact_email ? 'error' : ''"
            class="input-long"
          />
          <div v-if="formErrors.contact_email" class="error-feedback">
            {{ formErrors.contact_email }}
          </div>
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

:deep(.input-short.ant-input) {
  width: 200px !important;
}

:deep(.input-long.ant-input) {
  width: 100% !important;
  max-width: 400px;
}
</style>

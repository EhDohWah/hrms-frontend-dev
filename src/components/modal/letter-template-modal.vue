<script>
import { ref, watch, computed } from 'vue';
import { letterTemplateService } from '@/services/letter-template.service';
import { message } from 'ant-design-vue';
import { QuillEditor } from '@vueup/vue-quill';
import { letterTemplateToolbar } from '@/config/quill.config';

export default {
  name: 'LetterTemplateModal',
  components: {
    QuillEditor,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingTemplate: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'close'],
  setup(props, { emit }) {
    // ─── Form State ───
    const form = ref({
      title: '',
      content: '',
    });
    const loading = ref(false);
    const loadingContent = ref(false);
    const formErrors = ref({});
    const selectedPlaceholder = ref(undefined);
    const quillEditorRef = ref(null);
    let cursorPosition = 0;

    // ─── Placeholder Categories from Service ───
    const placeholderCategories = letterTemplateService.getPlaceholderCategories();

    // ─── Computed ───
    const isEditing = computed(() => !!props.editingTemplate);
    const modalTitle = computed(() => isEditing.value ? 'Edit Letter Template' : 'Add Letter Template');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Create Template');

    // Detect placeholders in current content
    const detectedPlaceholders = computed(() => {
      const allKeys = letterTemplateService.getAllPlaceholderKeys();
      return allKeys.filter(key => form.value.content.includes(`{${key}}`));
    });

    // ─── Methods ───
    const resetForm = () => {
      form.value = { title: '', content: '' };
      formErrors.value = {};
      selectedPlaceholder.value = undefined;
    };

    const onEditorReady = (quillInstance) => {
      // quillInstance is passed directly by @vueup/vue-quill's ready event
      const quill = quillInstance || quillEditorRef.value?.getQuill();
      if (quill) {
        // Track cursor position for placeholder insertion
        quill.on('selection-change', (range) => {
          if (range) {
            cursorPosition = range.index;
          }
        });
      }
    };

    const insertPlaceholder = (value) => {
      const quill = quillEditorRef.value?.getQuill();
      if (!quill || !value) return;
      quill.insertText(cursorPosition, value, 'user');
      cursorPosition += value.length;
      // Reset so the same placeholder can be inserted again
      selectedPlaceholder.value = undefined;
    };

    const validateForm = () => {
      const errors = {};
      if (!form.value.title?.trim()) {
        errors.title = 'Template title is required';
      }
      // Quill produces '<p><br></p>' for empty content — strip tags to check
      const strippedContent = (form.value.content || '').replace(/<[^>]*>/g, '').trim();
      if (!strippedContent) {
        errors.content = 'Template content is required';
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
          title: form.value.title.trim(),
          content: form.value.content,
        };

        let response;
        if (isEditing.value) {
          response = await letterTemplateService.updateTemplate(props.editingTemplate.id, data);
        } else {
          response = await letterTemplateService.createTemplate(data);
        }

        if (response.success) {
          message.success(response.message || (isEditing.value ? 'Template updated successfully' : 'Template created successfully'));
          emit('saved', response);
          handleClose();
        } else {
          message.error(response.message || 'Failed to save template');
        }
      } catch (error) {
        console.error('Error saving template:', error);
        if (error.errors) {
          // Validation errors from server
          formErrors.value = {};
          Object.entries(error.errors).forEach(([key, msgs]) => {
            formErrors.value[key] = Array.isArray(msgs) ? msgs[0] : msgs;
          });
        }
        message.error(error.message || 'Failed to save template');
      } finally {
        loading.value = false;
      }
    };

    const handleClose = () => {
      resetForm();
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

    // ─── Watchers ───

    // When editingTemplate changes, load the full content from API
    watch(() => props.editingTemplate, async (newVal) => {
      if (newVal) {
        form.value.title = newVal.title || '';
        // Fetch full content (list endpoint doesn't include content)
        loadingContent.value = true;
        try {
          const response = await letterTemplateService.getTemplate(newVal.id);
          form.value.content = response.data?.content || '';
        } catch (error) {
          console.error('Error loading template content:', error);
          message.error('Failed to load template content');
          form.value.content = '';
        } finally {
          loadingContent.value = false;
        }
      } else {
        resetForm();
      }
    }, { immediate: true });

    // Reset form when modal closes for add mode
    watch(() => props.visible, (newVal) => {
      if (newVal && !props.editingTemplate) {
        resetForm();
      }
    });

    return {
      form,
      loading,
      loadingContent,
      formErrors,
      selectedPlaceholder,
      quillEditorRef,
      letterTemplateToolbar,
      placeholderCategories,
      isEditing,
      modalTitle,
      submitButtonText,
      detectedPlaceholders,
      onEditorReady,
      insertPlaceholder,
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
    :width="900"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
    class="letter-template-modal"
  >
    <form @submit.prevent="handleSubmit">
      <!-- Template Title -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="template-title">
            Template Title <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-input
            id="template-title"
            v-model:value="form.title"
            placeholder="e.g., Job Offer Letter, Employment Contract..."
            :status="formErrors.title ? 'error' : ''"
            :maxlength="200"
            show-count
            style="max-width: 500px;"
          />
          <div v-if="formErrors.title" class="error-feedback">
            {{ formErrors.title }}
          </div>
        </div>
      </div>

      <!-- Template Content -->
      <div class="mb-3">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <label class="form-label mb-0">
            Template Content <span class="text-danger">*</span>
          </label>
          <div class="placeholder-count" v-if="detectedPlaceholders.length > 0">
            <span class="badge bg-info">
              {{ detectedPlaceholders.length }} placeholder{{ detectedPlaceholders.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Placeholder Toolbar -->
        <div class="placeholder-toolbar">
          <label class="me-2 fw-semibold placeholder-toolbar-label">Insert Placeholder:</label>
          <a-select
            v-model:value="selectedPlaceholder"
            placeholder="Select a placeholder..."
            style="width: 280px;"
            @change="insertPlaceholder"
          >
            <a-select-opt-group
              v-for="category in placeholderCategories"
              :key="category.label"
              :label="category.label"
            >
              <a-select-option
                v-for="ph in category.placeholders"
                :key="ph.key"
                :value="'{' + ph.key + '}'"
              >
                {{ ph.label }}
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </div>

        <!-- Loading state while fetching content -->
        <div v-if="loadingContent" class="editor-loading">
          <a-spin tip="Loading template content..." />
        </div>

        <!-- Quill Editor -->
        <div v-else class="editor-wrapper" :class="{ 'has-error': formErrors.content }">
          <QuillEditor
            ref="quillEditorRef"
            v-model:content="form.content"
            contentType="html"
            theme="snow"
            :toolbar="letterTemplateToolbar"
            @ready="onEditorReady"
          />
        </div>
        <div v-if="formErrors.content" class="error-feedback">
          {{ formErrors.content }}
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <a-button @click="handleClose" :disabled="loading">
          Cancel
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          :disabled="loadingContent"
        >
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

/* Horizontal form layout for title */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.form-label-col {
  flex: 0 0 130px;
  min-width: 130px;
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

/* Placeholder toolbar */
.placeholder-toolbar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f0f5ff;
  border: 1px solid #e8e8e8;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
}

.placeholder-toolbar-label {
  font-size: 13px;
  white-space: nowrap;
}

/* Editor wrapper */
.editor-wrapper {
  border: 1px solid #e8e8e8;
  border-radius: 0 0 6px 6px;
}

.editor-wrapper.has-error {
  border-color: #ff4d4f;
}

/* Remove Quill's own borders — the wrapper provides the outer border */
.editor-wrapper :deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid #e8e8e8;
}

.editor-wrapper :deep(.ql-container.ql-snow) {
  border: none;
}

.editor-wrapper :deep(.ql-editor) {
  min-height: 300px;
  max-height: 450px;
  overflow-y: auto;
  font-family: Calibri, sans-serif;
  font-size: 12px;
  line-height: 1.5;
}

/* Loading state for content */
.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  border: 1px solid #e8e8e8;
  border-radius: 0 0 6px 6px;
  background: #fafafa;
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

/* Responsive */
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

  .placeholder-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>

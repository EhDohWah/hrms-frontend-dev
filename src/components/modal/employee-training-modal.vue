<script>
import { ref, watch, computed } from 'vue';
import { employeeTrainingService } from '@/services/employeeTraining.service';
import { useTrainingStore } from '@/stores/trainingStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

export default {
  name: 'EmployeeTrainingModal',
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
    const trainingStore = useTrainingStore();
    const sharedDataStore = useSharedDataStore();

    const form = ref({
      employee_id: null,
      training_id: null,
      status: 'Pending',
    });

    const loading = ref(false);
    const formErrors = ref({});
    const loadingEmployees = ref(false);
    const loadingTrainings = ref(false);

    const isEditing = computed(() => !!props.editingRecord);
    const modalTitle = computed(() => isEditing.value ? 'Edit Employee Training' : 'Assign Employee to Training');
    const submitButtonText = computed(() => isEditing.value ? 'Save Changes' : 'Assign Training');

    const statusOptions = [
      { value: 'Pending', label: 'Pending' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Completed', label: 'Completed' },
      { value: 'Cancelled', label: 'Cancelled' },
    ];

    const employeeOptions = computed(() => {
      return sharedDataStore.employees.map(emp => ({
        value: emp.id,
        label: `${emp.name || 'Unknown'} (${emp.staff_id || 'N/A'})`.trim(),
        searchText: `${emp.name || ''} ${emp.staff_id || ''}`.toLowerCase(),
      }));
    });

    const trainingOptions = computed(() => {
      return trainingStore.trainings.map(training => ({
        value: training.id,
        label: `${training.title} - ${training.organizer} (${training.start_date ? dayjs(training.start_date).format('DD/MM/YYYY') : 'N/A'})`,
        searchText: `${training.title} ${training.organizer}`.toLowerCase(),
      }));
    });

    const selectedTrainingDetails = computed(() => {
      if (!form.value.training_id) return null;
      return trainingStore.trainings.find(t => t.id === form.value.training_id) || null;
    });

    const filterOption = (input, option) => {
      return option.searchText?.includes(input.toLowerCase());
    };

    const resetForm = () => {
      form.value = {
        employee_id: null,
        training_id: null,
        status: 'Pending',
      };
      formErrors.value = {};
    };

    const loadRequiredData = async () => {
      try {
        if (!sharedDataStore.isEmployeesLoaded) {
          loadingEmployees.value = true;
          await sharedDataStore.fetchEmployees();
          loadingEmployees.value = false;
        }
        if (trainingStore.trainings.length === 0) {
          loadingTrainings.value = true;
          await trainingStore.fetchTrainings({ per_page: 100 });
          loadingTrainings.value = false;
        }
      } catch (error) {
        console.error('Error loading required data:', error);
        message.error('Failed to load required data');
        loadingEmployees.value = false;
        loadingTrainings.value = false;
      }
    };

    watch(() => props.editingRecord, (newVal) => {
      if (newVal) {
        form.value = {
          employee_id: newVal.employee_id,
          training_id: newVal.training_id,
          status: newVal.status || 'Pending',
        };
      } else {
        resetForm();
      }
    }, { immediate: true });

    watch(() => props.visible, async (newVal) => {
      if (newVal) {
        if (!props.editingRecord) {
          resetForm();
        }
        await loadRequiredData();
      }
    });

    const validateForm = () => {
      const errors = {};
      if (!form.value.employee_id) {
        errors.employee_id = 'Employee is required';
      }
      if (!form.value.training_id) {
        errors.training_id = 'Training program is required';
      }
      if (!form.value.status) {
        errors.status = 'Status is required';
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
          employee_id: form.value.employee_id,
          training_id: form.value.training_id,
          status: form.value.status,
        };

        let response;
        if (isEditing.value) {
          response = await employeeTrainingService.updateEmployeeTraining(props.editingRecord.id, data);
        } else {
          response = await employeeTrainingService.createEmployeeTraining(data);
        }

        if (response.success) {
          message.success(isEditing.value ? 'Employee training updated successfully' : 'Employee training assigned successfully');
          emit('saved', response);
          handleClose();
        } else {
          message.error(response.message || 'Failed to save employee training');
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
          message.error(error.message || 'Failed to save employee training');
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

    const formatDate = (date) => {
      if (!date) return 'N/A';
      return dayjs(date).format('DD/MM/YYYY');
    };

    return {
      form,
      loading,
      formErrors,
      isEditing,
      modalTitle,
      submitButtonText,
      statusOptions,
      employeeOptions,
      trainingOptions,
      selectedTrainingDetails,
      loadingEmployees,
      loadingTrainings,
      filterOption,
      handleSubmit,
      handleClose,
      handleAfterClose,
      formatDate,
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
      <!-- Employee -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="et-employee">
            Employee <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-select
            id="et-employee"
            v-model:value="form.employee_id"
            show-search
            placeholder="Select employee"
            :filter-option="filterOption"
            :options="employeeOptions"
            :disabled="isEditing"
            :loading="loadingEmployees"
            :status="formErrors.employee_id ? 'error' : ''"
            class="input-long"
          >
            <template #notFoundContent>
              <div class="text-center py-3">
                <i class="ti ti-users-off"></i>
                <p class="mt-2 mb-0">No employees found</p>
              </div>
            </template>
          </a-select>
          <div v-if="formErrors.employee_id" class="error-feedback">
            {{ formErrors.employee_id }}
          </div>
          <div v-if="isEditing" class="hint-text">Employee cannot be changed after creation</div>
        </div>
      </div>

      <!-- Training Program -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="et-training">
            Training <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-select
            id="et-training"
            v-model:value="form.training_id"
            show-search
            placeholder="Select training program"
            :filter-option="filterOption"
            :options="trainingOptions"
            :disabled="isEditing"
            :loading="loadingTrainings"
            :status="formErrors.training_id ? 'error' : ''"
            class="input-long"
          >
            <template #notFoundContent>
              <div class="text-center py-3">
                <i class="ti ti-notebook-off"></i>
                <p class="mt-2 mb-0">No training programs found</p>
              </div>
            </template>
          </a-select>
          <div v-if="formErrors.training_id" class="error-feedback">
            {{ formErrors.training_id }}
          </div>
          <div v-if="isEditing" class="hint-text">Training program cannot be changed after creation</div>
        </div>
      </div>

      <!-- Status -->
      <div class="form-row mb-3">
        <div class="form-label-col">
          <label class="form-label" for="et-status">
            Status <span class="text-danger">*</span> :
          </label>
        </div>
        <div class="form-input-col">
          <a-select
            id="et-status"
            v-model:value="form.status"
            :options="statusOptions"
            :status="formErrors.status ? 'error' : ''"
            style="width: 200px;"
          />
          <div v-if="formErrors.status" class="error-feedback">
            {{ formErrors.status }}
          </div>
        </div>
      </div>

      <!-- Training Details Panel -->
      <div v-if="selectedTrainingDetails" class="training-details-panel mb-3">
        <div class="panel-header">
          <i class="ti ti-info-circle me-2"></i>Training Details
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-md-6 mb-2">
              <strong>Training:</strong> {{ selectedTrainingDetails.title }}
            </div>
            <div class="col-md-6 mb-2">
              <strong>Organizer:</strong> {{ selectedTrainingDetails.organizer }}
            </div>
            <div class="col-md-6">
              <strong>Start Date:</strong> {{ formatDate(selectedTrainingDetails.start_date) }}
            </div>
            <div class="col-md-6">
              <strong>End Date:</strong> {{ formatDate(selectedTrainingDetails.end_date) }}
            </div>
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

.hint-text {
  margin-top: 4px;
  font-size: 0.875em;
  color: #8c8c8c;
}

.text-danger {
  color: #ff4d4f;
}

.training-details-panel {
  margin-left: 136px;
  border: 1px solid #b3d9ff;
  border-radius: 6px;
  overflow: hidden;
}

.training-details-panel .panel-header {
  background-color: #e7f3ff;
  color: #004085;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid #b3d9ff;
}

.training-details-panel .panel-body {
  background-color: #f0f7ff;
  padding: 12px;
  font-size: 13px;
  color: #004085;
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

  .training-details-panel {
    margin-left: 0;
  }

  :deep(.ant-picker),
  :deep(.ant-select) {
    width: 100% !important;
  }
}

.gap-2 {
  gap: 0.5rem;
}

:deep(.input-long.ant-select) {
  width: 100% !important;
  max-width: 400px;
}
</style>

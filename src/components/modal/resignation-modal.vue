<template>
  <!-- Add Resignation -->
  <div class="modal fade" id="new_resignation" tabindex="-1" aria-labelledby="newResignationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content new-modal-design">
        <div class="modal-header">
          <h2 class="modal-title" id="newResignationModalLabel">
            Add Resignation
          </h2>
          <button type="button" class="btn-close-custom" data-bs-dismiss="modal" aria-label="Close" @click="resetCreateForm">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="handleCreateSubmit">
          <div class="modal-body">
            <!-- Alert Messages -->
            <div v-if="createForm.alertMessage && createForm.alertClass === 'alert-success'" class="success-msg">
              {{ createForm.alertMessage }}
            </div>
            <div v-if="createForm.alertMessage && createForm.alertClass === 'alert-danger'" class="error-msg">
              {{ createForm.alertMessage }}
            </div>

            <!-- Employee Field -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Resigning Employee :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-medium-wrapper">
                    <EmployeeTreeSelect
                      v-model="createForm.data.employee_id"
                      :tree-data="employeeTreeData"
                      :display-value="createForm.selectedEmployeeDisplay"
                      :has-error="!!createForm.errors.employee_id"
                      :error-message="createForm.errors.employee_id"
                      placeholder="Select employee"
                      search-placeholder="Search employees..."
                      @select="handleEmployeeSelect"
                    />
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Select the employee who is resigning" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Selected Employee Info Card -->
            <div v-if="createForm.selectedEmployeeInfo" class="employee-info-card mb-3">
              <div class="card-body">
                <h6 class="card-title">Selected Employee</h6>
                <p class="card-text">
                  <strong>{{ createForm.selectedEmployeeInfo.name }}</strong><br>
                  <small class="text-muted">Staff ID: {{ createForm.selectedEmployeeInfo.staffId }}</small><br>
                  <small class="text-muted">Organization: {{ createForm.selectedEmployeeInfo.organization }}</small>
                </p>
              </div>
            </div>

            <!-- Department Field -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Department :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <select
                    class="form-control input-short"
                    v-model="createForm.data.department_id"
                    :class="{ 'is-invalid': createForm.errors.department_id }"
                    required
                    @change="onCreateDepartmentChange"
                    :disabled="isLoadingData"
                  >
                    <option disabled value="">{{ isLoadingData ? 'Loading...' : 'Select Department' }}</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }}
                    </option>
                  </select>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Select the employee's department at time of resignation" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="createForm.errors.department_id" class="invalid-feedback">
                  {{ createForm.errors.department_id }}
                </div>
              </div>
            </div>

            <!-- Position Field -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Position :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <select
                    class="form-control input-short"
                    v-model="createForm.data.position_id"
                    :class="{ 'is-invalid': createForm.errors.position_id }"
                    required
                    :disabled="!createForm.data.department_id || positionsLoading"
                  >
                    <option disabled value="">{{ positionsLoading ? 'Loading...' : 'Select Position' }}</option>
                    <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                      {{ pos.title }}
                    </option>
                  </select>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Select the employee's position at time of resignation" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="createForm.errors.position_id" class="invalid-feedback">
                  {{ createForm.errors.position_id }}
                </div>
              </div>
            </div>

            <!-- Resignation Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Resignation Date :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker
                      class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy"
                      :editable="true"
                      :clearable="false"
                      :input-format="dateFormat"
                      v-model="createForm.data.resignation_date"
                      :class="{ 'is-invalid': createForm.errors.resignation_date }"
                      required
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Date when the resignation was submitted" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="createForm.errors.resignation_date" class="invalid-feedback">
                  {{ createForm.errors.resignation_date }}
                </div>
              </div>
            </div>

            <!-- Last Working Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Last Working Date :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker
                      class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy"
                      :editable="true"
                      :clearable="false"
                      :input-format="dateFormat"
                      v-model="createForm.data.last_working_date"
                      :class="{ 'is-invalid': createForm.errors.last_working_date }"
                      required
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Employee's last day of work (must be on or after resignation date)" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="createForm.errors.last_working_date" class="invalid-feedback">
                  {{ createForm.errors.last_working_date }}
                </div>
              </div>
            </div>

            <!-- Reason -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Reason :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <select
                    class="form-control input-medium"
                    v-model="createForm.data.reason"
                    :class="{ 'is-invalid': createForm.errors.reason }"
                    required
                  >
                    <option disabled value="">Select Reason</option>
                    <option v-for="reason in resignationReasons" :key="reason" :value="reason">
                      {{ reason }}
                    </option>
                  </select>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Primary reason for resignation" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="createForm.errors.reason" class="invalid-feedback">
                  {{ createForm.errors.reason }}
                </div>
              </div>
            </div>

            <!-- Reason Details -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Reason Details :
                </label>
              </div>
              <div class="form-input-col">
                <textarea
                  class="form-control"
                  v-model="createForm.data.reason_details"
                  rows="3"
                  placeholder="Additional details about the resignation reason (optional)"
                  maxlength="1000"
                ></textarea>
                <small class="text-muted">{{ (createForm.data.reason_details || '').length }}/1000 characters</small>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-bs-dismiss="modal" @click="resetCreateForm">
              <i class="ti ti-x"></i> Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting">
                <i class="ti ti-loader spinner-icon"></i> Saving...
              </span>
              <span v-else>
                <i class="ti ti-device-floppy"></i> Add Resignation
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Resignation -->

  <!-- Edit Resignation -->
  <div class="modal fade" id="edit_resignation" tabindex="-1" aria-labelledby="editResignationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content new-modal-design">
        <div class="modal-header">
          <h2 class="modal-title" id="editResignationModalLabel">
            Edit Resignation
          </h2>
          <button type="button" class="btn-close-custom" data-bs-dismiss="modal" aria-label="Close" @click="resetEditForm">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="handleEditSubmit">
          <div class="modal-body">
            <!-- Alert Messages -->
            <div v-if="editForm.alertMessage && editForm.alertClass === 'alert-success'" class="success-msg">
              {{ editForm.alertMessage }}
            </div>
            <div v-if="editForm.alertMessage && editForm.alertClass === 'alert-danger'" class="error-msg">
              {{ editForm.alertMessage }}
            </div>

            <!-- Employee Field (Read-only in edit mode) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Resigning Employee :
                </label>
              </div>
              <div class="form-input-col">
                <input
                  type="text"
                  class="form-control input-medium disabled-input"
                  :value="editForm.selectedEmployeeDisplay"
                  disabled
                />
                <small class="text-muted">Employee cannot be changed after resignation is created</small>
              </div>
            </div>

            <!-- Department Field -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Department :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <select
                    class="form-control input-short"
                    v-model="editForm.data.department_id"
                    :class="{ 'is-invalid': editForm.errors.department_id }"
                    required
                    @change="onEditDepartmentChange"
                    :disabled="isLoadingData"
                  >
                    <option disabled value="">{{ isLoadingData ? 'Loading...' : 'Select Department' }}</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }}
                    </option>
                  </select>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Select the employee's department" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="editForm.errors.department_id" class="invalid-feedback">
                  {{ editForm.errors.department_id }}
                </div>
              </div>
            </div>

            <!-- Position Field -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Position :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <select
                    class="form-control input-short"
                    v-model="editForm.data.position_id"
                    :class="{ 'is-invalid': editForm.errors.position_id }"
                    required
                    :disabled="!editForm.data.department_id || editPositionsLoading"
                  >
                    <option disabled value="">{{ editPositionsLoading ? 'Loading...' : 'Select Position' }}</option>
                    <option v-for="pos in editPositions" :key="pos.id" :value="pos.id">
                      {{ pos.title }}
                    </option>
                  </select>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Select the employee's position" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="editForm.errors.position_id" class="invalid-feedback">
                  {{ editForm.errors.position_id }}
                </div>
              </div>
            </div>

            <!-- Resignation Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Resignation Date :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker
                      class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy"
                      :editable="true"
                      :clearable="false"
                      :input-format="dateFormat"
                      v-model="editForm.data.resignation_date"
                      :class="{ 'is-invalid': editForm.errors.resignation_date }"
                      required
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Date when the resignation was submitted" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="editForm.errors.resignation_date" class="invalid-feedback">
                  {{ editForm.errors.resignation_date }}
                </div>
              </div>
            </div>

            <!-- Last Working Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Last Working Date :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker
                      class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy"
                      :editable="true"
                      :clearable="false"
                      :input-format="dateFormat"
                      v-model="editForm.data.last_working_date"
                      :class="{ 'is-invalid': editForm.errors.last_working_date }"
                      required
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Employee's last day of work" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="editForm.errors.last_working_date" class="invalid-feedback">
                  {{ editForm.errors.last_working_date }}
                </div>
              </div>
            </div>

            <!-- Reason -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label required">
                  Reason :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <select
                    class="form-control input-medium"
                    v-model="editForm.data.reason"
                    :class="{ 'is-invalid': editForm.errors.reason }"
                    required
                  >
                    <option disabled value="">Select Reason</option>
                    <option v-for="reason in resignationReasons" :key="reason" :value="reason">
                      {{ reason }}
                    </option>
                  </select>
                  <span data-bs-toggle="tooltip" data-bs-placement="top" title="Primary reason for resignation" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
                <div v-if="editForm.errors.reason" class="invalid-feedback">
                  {{ editForm.errors.reason }}
                </div>
              </div>
            </div>

            <!-- Reason Details -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Reason Details :
                </label>
              </div>
              <div class="form-input-col">
                <textarea
                  class="form-control"
                  v-model="editForm.data.reason_details"
                  rows="3"
                  placeholder="Additional details about the resignation reason (optional)"
                  maxlength="1000"
                ></textarea>
                <small class="text-muted">{{ (editForm.data.reason_details || '').length }}/1000 characters</small>
              </div>
            </div>

            <!-- Acknowledgement Status (Edit only) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">
                  Status :
                </label>
              </div>
              <div class="form-input-col">
                <div class="acknowledgement-status">
                  <a-tag :color="getStatusColor(editForm.data.acknowledgement_status)">
                    {{ editForm.data.acknowledgement_status || 'Pending' }}
                  </a-tag>
                  <div v-if="editForm.data.acknowledgement_status === 'Pending'" class="mt-2">
                    <a-button type="primary" size="small" @click="acknowledgeResignation" :loading="isAcknowledging" class="me-2">
                      <template #icon><CheckOutlined /></template>
                      Acknowledge
                    </a-button>
                    <a-button danger size="small" @click="rejectResignation" :loading="isRejecting">
                      <template #icon><CloseOutlined /></template>
                      Reject
                    </a-button>
                  </div>
                  <div v-if="editForm.data.acknowledged_at" class="mt-2">
                    <small class="text-muted">
                      {{ editForm.data.acknowledgement_status === 'Acknowledged' ? 'Acknowledged' : 'Rejected' }}
                      on {{ formatDate(editForm.data.acknowledged_at) }}
                    </small>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" data-bs-dismiss="modal" @click="resetEditForm">
              <i class="ti ti-x"></i> Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting">
                <i class="ti ti-loader spinner-icon"></i> Saving...
              </span>
              <span v-else>
                <i class="ti ti-device-floppy"></i> Save Changes
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Resignation -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
            <i class="ti ti-trash-x fs-36"></i>
          </span>
          <h4 class="mb-1">Confirm Delete</h4>
          <p class="mb-3">
            Are you sure you want to delete this resignation record? This action cannot be undone.
          </p>
          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-light me-3" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="isDeleting">
              <span v-if="isDeleting">Deleting...</span>
              <span v-else>Yes, Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted, nextTick } from 'vue';
import { resignationService } from '@/services/resignation.service';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { reasonUtils } from '@/utils/resignation.utils';
import { message } from 'ant-design-vue';
import { Tooltip } from 'bootstrap';
import { InfoCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import EmployeeTreeSelect from '@/components/shared/EmployeeTreeSelect.vue';

// Emits
const emit = defineEmits(['resignation-created', 'resignation-updated', 'resignation-deleted']);

// Constants
const dateFormat = 'dd/MM/yyyy';
const resignationReasons = reasonUtils.getResignationReasons();

// Loading states
const isLoadingData = ref(false);
const isSubmitting = ref(false);
const isAcknowledging = ref(false);
const isRejecting = ref(false);
const isDeleting = ref(false);
const positionsLoading = ref(false);
const editPositionsLoading = ref(false);

// Data sources
const employeeTreeData = shallowRef([]);
const departments = shallowRef([]);
const positions = shallowRef([]);
const editPositions = shallowRef([]);

// Create form state
const createForm = reactive({
  data: {
    employee_id: '',
    department_id: '',
    position_id: '',
    resignation_date: null,
    last_working_date: null,
    reason: '',
    reason_details: ''
  },
  errors: {},
  alertMessage: '',
  alertClass: '',
  selectedEmployeeInfo: null,
  selectedEmployeeDisplay: ''
});

// Edit form state
const editForm = reactive({
  id: null,
  data: {
    employee_id: '',
    department_id: '',
    position_id: '',
    resignation_date: null,
    last_working_date: null,
    reason: '',
    reason_details: '',
    acknowledgement_status: 'Pending',
    acknowledged_at: null
  },
  errors: {},
  alertMessage: '',
  alertClass: '',
  selectedEmployeeDisplay: ''
});

// Delete state
const deleteId = ref(null);

// Status color mapping
const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Acknowledged': 'success',
    'Rejected': 'error'
  };
  return colors[status] || 'default';
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Format date for API
const formatDateForAPI = (date) => {
  if (!date) return null;
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date;
};

// Load initial data
const loadInitialData = async () => {
  isLoadingData.value = true;
  try {
    const sharedStore = useSharedDataStore();
    await sharedStore.loadAllDropdownData({
      includeEmployees: true,
      includeDepartments: true,
      includePositions: true,
      force: false
    });

    employeeTreeData.value = sharedStore.getEmployeeTreeData;
    departments.value = sharedStore.getDepartments;
  } catch (error) {
    console.error('Error loading data:', error);
    message.error('Failed to load form data');
  } finally {
    isLoadingData.value = false;
  }
};

// Handle employee selection
const handleEmployeeSelect = (employee) => {
  createForm.data.employee_id = employee.value;
  createForm.selectedEmployeeDisplay = employee.title;

  // Find employee info from tree data
  for (const org of employeeTreeData.value) {
    const emp = org.children?.find(e => e.value === employee.value);
    if (emp) {
      createForm.selectedEmployeeInfo = {
        name: emp.title,
        staffId: emp.staffId,
        organization: org.title
      };
      break;
    }
  }

  // Clear employee error
  createForm.errors.employee_id = '';
};

// Department change handlers
const onCreateDepartmentChange = async () => {
  createForm.data.position_id = '';
  positions.value = [];
  positionsLoading.value = true;

  if (!createForm.data.department_id) {
    positionsLoading.value = false;
    return;
  }

  try {
    const sharedStore = useSharedDataStore();
    const positionsData = await sharedStore.fetchPositions(true, {
      department_id: createForm.data.department_id
    });
    positions.value = Array.isArray(positionsData) ? positionsData : (positionsData?.data || []);
  } catch (error) {
    console.error('Error loading positions:', error);
    positions.value = [];
  } finally {
    positionsLoading.value = false;
  }
};

const onEditDepartmentChange = async () => {
  editForm.data.position_id = '';
  editPositions.value = [];
  editPositionsLoading.value = true;

  if (!editForm.data.department_id) {
    editPositionsLoading.value = false;
    return;
  }

  try {
    const sharedStore = useSharedDataStore();
    const positionsData = await sharedStore.fetchPositions(true, {
      department_id: editForm.data.department_id
    });
    editPositions.value = Array.isArray(positionsData) ? positionsData : (positionsData?.data || []);
  } catch (error) {
    console.error('Error loading positions:', error);
    editPositions.value = [];
  } finally {
    editPositionsLoading.value = false;
  }
};

// Validate form
const validateForm = (formData, isEdit = false) => {
  const errors = {};

  if (!isEdit && !formData.employee_id) {
    errors.employee_id = 'Employee is required';
  }
  if (!formData.department_id) {
    errors.department_id = 'Department is required';
  }
  if (!formData.position_id) {
    errors.position_id = 'Position is required';
  }
  if (!formData.resignation_date) {
    errors.resignation_date = 'Resignation date is required';
  }
  if (!formData.last_working_date) {
    errors.last_working_date = 'Last working date is required';
  }
  if (!formData.reason) {
    errors.reason = 'Reason is required';
  }

  // Date validation
  if (formData.resignation_date && formData.last_working_date) {
    const resignDate = new Date(formData.resignation_date);
    const lastDate = new Date(formData.last_working_date);
    if (lastDate < resignDate) {
      errors.last_working_date = 'Last working date must be on or after resignation date';
    }
  }

  return errors;
};

// Create form submission
const handleCreateSubmit = async () => {
  createForm.errors = validateForm(createForm.data);

  if (Object.keys(createForm.errors).length > 0) {
    createForm.alertMessage = 'Please fix the validation errors';
    createForm.alertClass = 'alert-danger';
    return;
  }

  isSubmitting.value = true;
  createForm.alertMessage = '';

  try {
    const payload = {
      employee_id: createForm.data.employee_id,
      department_id: createForm.data.department_id,
      position_id: createForm.data.position_id,
      resignation_date: formatDateForAPI(createForm.data.resignation_date),
      last_working_date: formatDateForAPI(createForm.data.last_working_date),
      reason: createForm.data.reason,
      reason_details: createForm.data.reason_details || null
    };

    const response = await resignationService.createResignation(payload);

    if (response.success) {
      createForm.alertMessage = 'Resignation created successfully';
      createForm.alertClass = 'alert-success';
      message.success('Resignation created successfully');
      emit('resignation-created', response.data);

      // Close modal after short delay
      setTimeout(() => {
        const modal = document.getElementById('new_resignation');
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
        resetCreateForm();
      }, 1000);
    } else {
      throw new Error(response.message || 'Failed to create resignation');
    }
  } catch (error) {
    console.error('Error creating resignation:', error);
    createForm.alertMessage = error.message || 'Failed to create resignation';
    createForm.alertClass = 'alert-danger';
    message.error(createForm.alertMessage);
  } finally {
    isSubmitting.value = false;
  }
};

// Edit form submission
const handleEditSubmit = async () => {
  editForm.errors = validateForm(editForm.data, true);

  if (Object.keys(editForm.errors).length > 0) {
    editForm.alertMessage = 'Please fix the validation errors';
    editForm.alertClass = 'alert-danger';
    return;
  }

  isSubmitting.value = true;
  editForm.alertMessage = '';

  try {
    const payload = {
      department_id: editForm.data.department_id,
      position_id: editForm.data.position_id,
      resignation_date: formatDateForAPI(editForm.data.resignation_date),
      last_working_date: formatDateForAPI(editForm.data.last_working_date),
      reason: editForm.data.reason,
      reason_details: editForm.data.reason_details || null
    };

    const response = await resignationService.updateResignation(editForm.id, payload);

    if (response.success) {
      editForm.alertMessage = 'Resignation updated successfully';
      editForm.alertClass = 'alert-success';
      message.success('Resignation updated successfully');
      emit('resignation-updated', response.data);

      // Close modal after short delay
      setTimeout(() => {
        const modal = document.getElementById('edit_resignation');
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
        resetEditForm();
      }, 1000);
    } else {
      throw new Error(response.message || 'Failed to update resignation');
    }
  } catch (error) {
    console.error('Error updating resignation:', error);
    editForm.alertMessage = error.message || 'Failed to update resignation';
    editForm.alertClass = 'alert-danger';
    message.error(editForm.alertMessage);
  } finally {
    isSubmitting.value = false;
  }
};

// Acknowledge resignation
const acknowledgeResignation = async () => {
  isAcknowledging.value = true;
  try {
    const response = await resignationService.acknowledgeResignation(editForm.id, {
      status: 'Acknowledged'
    });

    if (response.success) {
      editForm.data.acknowledgement_status = 'Acknowledged';
      editForm.data.acknowledged_at = new Date().toISOString();
      message.success('Resignation acknowledged successfully');
      emit('resignation-updated', response.data);
    }
  } catch (error) {
    console.error('Error acknowledging resignation:', error);
    message.error('Failed to acknowledge resignation');
  } finally {
    isAcknowledging.value = false;
  }
};

// Reject resignation
const rejectResignation = async () => {
  isRejecting.value = true;
  try {
    const response = await resignationService.acknowledgeResignation(editForm.id, {
      status: 'Rejected'
    });

    if (response.success) {
      editForm.data.acknowledgement_status = 'Rejected';
      editForm.data.acknowledged_at = new Date().toISOString();
      message.success('Resignation rejected');
      emit('resignation-updated', response.data);
    }
  } catch (error) {
    console.error('Error rejecting resignation:', error);
    message.error('Failed to reject resignation');
  } finally {
    isRejecting.value = false;
  }
};

// Reset forms
const resetCreateForm = () => {
  createForm.data = {
    employee_id: '',
    department_id: '',
    position_id: '',
    resignation_date: null,
    last_working_date: null,
    reason: '',
    reason_details: ''
  };
  createForm.errors = {};
  createForm.alertMessage = '';
  createForm.alertClass = '';
  createForm.selectedEmployeeInfo = null;
  createForm.selectedEmployeeDisplay = '';
  positions.value = [];
};

const resetEditForm = () => {
  editForm.id = null;
  editForm.data = {
    employee_id: '',
    department_id: '',
    position_id: '',
    resignation_date: null,
    last_working_date: null,
    reason: '',
    reason_details: '',
    acknowledgement_status: 'Pending',
    acknowledged_at: null
  };
  editForm.errors = {};
  editForm.alertMessage = '';
  editForm.alertClass = '';
  editForm.selectedEmployeeDisplay = '';
  editPositions.value = [];
};

// Load resignation for editing
const loadResignationForEdit = async (resignation) => {
  editForm.id = resignation.id;
  editForm.data = {
    employee_id: resignation.employeeId,
    department_id: resignation.departmentId,
    position_id: resignation.positionId,
    resignation_date: resignation.resignationDate ? new Date(resignation.resignationDate) : null,
    last_working_date: resignation.lastWorkingDate ? new Date(resignation.lastWorkingDate) : null,
    reason: resignation.reason,
    reason_details: resignation.reasonDetails || '',
    acknowledgement_status: resignation.acknowledgementStatus || 'Pending',
    acknowledged_at: resignation.acknowledgedAt
  };
  editForm.selectedEmployeeDisplay = resignation.employee?.name || resignation.employeeName || '-';

  // Load positions for the department
  if (resignation.departmentId) {
    editPositionsLoading.value = true;
    try {
      const sharedStore = useSharedDataStore();
      const positionsData = await sharedStore.fetchPositions(true, {
        department_id: resignation.departmentId
      });
      editPositions.value = Array.isArray(positionsData) ? positionsData : (positionsData?.data || []);
    } catch (error) {
      console.error('Error loading positions:', error);
    } finally {
      editPositionsLoading.value = false;
    }
  }
};

// Set delete target
const setDeleteTarget = (id) => {
  deleteId.value = id;
};

// Confirm delete
const confirmDelete = async () => {
  if (!deleteId.value) return;

  isDeleting.value = true;
  try {
    await resignationService.deleteResignation(deleteId.value);
    message.success('Resignation deleted successfully');
    emit('resignation-deleted', deleteId.value);

    // Close modal
    const modal = document.getElementById('delete_modal');
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) bsModal.hide();
    deleteId.value = null;
  } catch (error) {
    console.error('Error deleting resignation:', error);
    message.error('Failed to delete resignation');
  } finally {
    isDeleting.value = false;
  }
};

// Initialize tooltips
const initializeTooltips = () => {
  nextTick(() => {
    const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipElements.forEach(element => {
      if (!element._tooltip) {
        new Tooltip(element);
      }
    });
  });
};

// Lifecycle
onMounted(() => {
  loadInitialData();

  // Initialize tooltips when modals are shown
  const newModal = document.getElementById('new_resignation');
  const editModal = document.getElementById('edit_resignation');

  if (newModal) {
    newModal.addEventListener('shown.bs.modal', initializeTooltips);
  }
  if (editModal) {
    editModal.addEventListener('shown.bs.modal', initializeTooltips);
  }
});

// Expose methods for parent component
defineExpose({
  loadResignationForEdit,
  setDeleteTarget,
  resetCreateForm,
  resetEditForm
});
</script>

<style scoped>
/* New Modal Design Styles */
.new-modal-design {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 24px 32px 16px 32px;
  border-bottom: 1px solid #e9ecef;
}

.modal-title {
  margin: 0;
  font-size: 1.25em;
  font-weight: 700;
  color: #23325b;
}

.btn-close-custom {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.25rem;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s ease-in-out;
}

.btn-close-custom:hover {
  background-color: #f8f9fa;
  color: #000;
}

.modal-body {
  padding: 24px 32px;
}

.modal-footer {
  padding: 16px 32px 24px 32px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Horizontal Form Layout - Following Grant Modal Standard */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.form-label-col {
  flex: 0 0 140px;
  min-width: 140px;
  padding-top: 8px;
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
}

.form-label.required:after {
  content: " *";
  color: #e53e3e;
}

/* Input widths - Matching Grant Modal Standard */
.input-short {
  width: 200px;
  max-width: 200px;
}

.input-medium {
  width: 400px;
  max-width: 400px;
}

.input-short-wrapper {
  width: 200px;
  max-width: 200px;
}

.input-medium-wrapper {
  width: 400px;
  max-width: 400px;
}

/* Input with tooltip - Matching Grant Modal Standard */
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

/* Form controls */
.form-control {
  padding: 7px 12px;
  border-radius: 6px;
  border: 1px solid #c9d2e2;
  font-size: 1em;
  background: #f7f8fa;
  transition: border 0.2s;
}

.form-control:focus {
  border: 1.5px solid #4a7fff;
  background: #fff;
  outline: none;
}

.form-control.is-invalid {
  border-color: #e53e3e;
  background: #fff5f5;
}

.form-control.disabled-input {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 5px;
  font-size: 0.875em;
  color: #e53e3e;
  font-weight: 500;
}

/* Date picker */
.input-icon-end {
  position: relative;
}

.input-icon-addon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6B7280;
  z-index: 2;
}

.datetimepicker {
  padding-right: 35px !important;
}

:deep(.mx-datepicker) {
  width: 100%;
}

:deep(.mx-input) {
  width: 100% !important;
  padding: 7px 35px 7px 12px !important;
  border-radius: 6px !important;
  border: 1px solid #c9d2e2 !important;
  font-size: 1em !important;
  background: #f7f8fa !important;
}

:deep(.mx-input:focus) {
  border: 1.5px solid #4a7fff !important;
  background: #fff !important;
}

:deep(.mx-icon-calendar) {
  display: none;
}

/* Buttons */
.btn {
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-cancel {
  background: #fff;
  color: #2a3146;
  border: 1.2px solid #bbc4d1;
}

.btn-cancel:hover {
  background: #f4f7fa;
}

.btn-primary {
  background: linear-gradient(90deg, #3577ef 70%, #355bef 100%);
  color: #fff;
}

.btn-primary:disabled {
  background: #ccd4ea;
  color: #888;
  cursor: not-allowed;
}

/* Alert messages */
.success-msg {
  text-align: center;
  color: #169b53;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 10px 14px;
  background: #f0f9f4;
  border: 1px solid #d4edda;
  border-radius: 6px;
}

.error-msg {
  text-align: center;
  color: #e53e3e;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 10px 14px;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
}

/* Employee info card - margin = label width (140px) + gap (16px) = 156px */
.employee-info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  margin-left: 156px;
}

.employee-info-card .card-body {
  padding: 0;
}

.employee-info-card .card-title {
  margin-bottom: 8px;
  font-size: 0.9em;
  font-weight: 600;
  color: #495057;
}

.employee-info-card .card-text {
  margin-bottom: 0;
  font-size: 0.9em;
}

/* Acknowledgement status */
.acknowledgement-status {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

/* Spinner animation */
.spinner-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive - Mobile breakpoint at 768px */
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
  .input-medium,
  .input-short-wrapper,
  .input-medium-wrapper {
    width: 100%;
    max-width: 100%;
  }

  .employee-info-card {
    margin-left: 0;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-header,
  .modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>

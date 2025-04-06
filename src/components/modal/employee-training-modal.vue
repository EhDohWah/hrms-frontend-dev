<script>
import { ref, reactive, defineExpose, onMounted } from "vue";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useTrainingStore } from "@/stores/trainingStore";
import { Modal } from "bootstrap";

export default {
  name: "EmployeeTrainingModal",
  emits: ["submit"],
  setup(props, { emit }) {
    const employeeStore = useEmployeeStore();
    const trainingStore = useTrainingStore();
    
    const modalElement = ref(null);
    const modalInstance = ref(null);
    const editMode = ref(false);
    const trainingData = ref(null);
    const loading = ref(false);
    
    const employees = ref([]);
    const trainings = ref([]);
    const trainingTypes = ref(["Online", "Classroom", "Webinar", "Workshop", "On-the-job"]);
    const statusOptions = ref(["Pending", "In Progress", "Completed", "Cancelled"]);
    
    const currentDate = ref(new Date());
    const dateFormat = "dd-MM-yyyy";
    
    const formData = reactive({
      id: null,
      employee_id: "",
      training_id: "",
      training_type: "",
      training_date: currentDate.value,
      completion_date: currentDate.value,
      status: "Pending",
      description: "",
      cost: "",
      trainer: ""
    });
    
    const fetchData = async () => {
      loading.value = true;
      try {
        await Promise.all([
          employeeStore.fetchEmployees(),
          trainingStore.fetchTrainings()
        ]);
        
        employees.value = employeeStore.employees;
        trainings.value = trainingStore.trainings;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        loading.value = false;
      }
    };
    
    const resetForm = () => {
      formData.id = null;
      formData.employee_id = "";
      formData.training_id = "";
      formData.training_type = "";
      formData.training_date = currentDate.value;
      formData.completion_date = currentDate.value;
      formData.status = "Pending";
      formData.description = "";
      formData.cost = "";
      formData.trainer = "";
    };
    
    const open = () => {
      fetchData();
      
      if (editMode.value && trainingData.value) {
        Object.keys(formData).forEach(key => {
          if (trainingData.value[key] !== undefined) {
            formData[key] = trainingData.value[key];
          }
        });
      } else {
        resetForm();
      }
      
      if (!modalInstance.value && modalElement.value) {
        modalInstance.value = new Modal(modalElement.value);
      }
      
      modalInstance.value?.show();
    };
    
    const close = () => {
      modalInstance.value?.hide();
      resetForm();
    };
    
    const submitForm = async () => {
      loading.value = true;
      try {
        const submissionData = { ...formData };
        
        if (editMode.value && trainingData.value) {
          submissionData.id = trainingData.value.id;
          await trainingStore.updateEmployeeTraining(submissionData.id, submissionData);
        } else {
          await trainingStore.createEmployeeTraining(submissionData);
        }
        
        emit("submit", submissionData);
        close();
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        loading.value = false;
      }
    };
    
    onMounted(() => {
      fetchData();
    });
    
    defineExpose({
      open,
      close,
      editMode,
      trainingData
    });
    
    return {
      modalElement,
      editMode,
      formData,
      employees,
      trainings,
      trainingTypes,
      statusOptions,
      currentDate,
      dateFormat,
      loading,
      submitForm,
      close
    };
  }
};
</script>

<template>
  <!-- Employee Training Modal -->
  <div class="modal fade" id="employee-training-modal" ref="modalElement" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ editMode ? 'Edit Employee Training' : 'Add Employee Training' }}</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Employee</label>
                  <vue-select
                    v-model="formData.employee_id"
                    :options="employees"
                    :reduce="employee => employee.id"
                    :get-label="employee => `${employee.first_name} ${employee.last_name}`"
                    id="employee-select"
                    placeholder="Select Employee"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Training</label>
                  <vue-select
                    v-model="formData.training_id"
                    :options="trainings"
                    :reduce="training => training.id"
                    label="title"
                    id="training-select"
                    placeholder="Select Training"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Training Type</label>
                  <vue-select
                    v-model="formData.training_type"
                    :options="trainingTypes"
                    id="training-type-select"
                    placeholder="Select Type"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Training Cost</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="formData.cost"
                    placeholder="Enter cost"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Training Date</label>
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="formData.training_date"
                      class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy"
                      :editable="true"
                      :clearable="false"
                      :input-format="dateFormat"
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Completion Date</label>
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="formData.completion_date"
                      class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy"
                      :editable="true"
                      :clearable="false"
                      :input-format="dateFormat"
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Trainer</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.trainer"
                    placeholder="Enter trainer name"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <vue-select
                    v-model="formData.status"
                    :options="statusOptions"
                    id="status-select"
                    placeholder="Select Status"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea 
                    class="form-control" 
                    v-model="formData.description"
                    placeholder="Enter training description"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              {{ editMode ? 'Save Changes' : 'Add Training' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Employee Training Modal -->
</template>

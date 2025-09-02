<template>
  <!-- Add Travel Request -->
  <div class="modal fade" id="add_travel">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Travel Request</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="handleTravelSubmit">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Purpose of Travel</label>
                  <input type="text" v-model="formData.purposeOfTravel" class="form-control"
                    placeholder="Enter purpose" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Destination</label>
                  <input type="text" v-model="formData.destination" class="form-control"
                    placeholder="Enter destination" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">From</label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="formData.fromDate" class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">To</label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="formData.toDate" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                      :editable="true" :clearable="false" :input-format="dateFormat" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea v-model="formData.description" class="form-control" rows="3"
                    placeholder="Enter travel details"></textarea>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Attachments</label>
                  <input type="file" class="form-control" multiple @change="handleFileUpload" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Travel Request -->
</template>

<script>
import { ref } from 'vue';
const currentDate = ref(new Date());

export default {
  name: 'TravelEmployeeModal',
  data() {
    return {
      dateFormat: "dd-MM-yyyy",
      formData: {
        purposeOfTravel: '',
        destination: '',
        fromDate: currentDate,
        toDate: currentDate,
        description: '',
        attachments: []
      },
      errors: {},
      isEditMode: false,
      editId: null
    };
  },
  methods: {
    resetForm() {
      this.formData = {
        purposeOfTravel: '',
        destination: '',
        fromDate: currentDate,
        toDate: currentDate,
        description: '',
        attachments: []
      };
      this.errors = {};
      this.isEditMode = false;
      this.editId = null;
    },
    setEditData(travel) {
      this.isEditMode = true;
      this.editId = travel.id;
      this.formData = {
        purposeOfTravel: travel.purpose,
        destination: travel.destination,
        fromDate: travel.startDate,
        toDate: travel.endDate,
        description: travel.description || '',
        attachments: []
      };
    },
    handleFileUpload(event) {
      this.formData.attachments = Array.from(event.target.files);
    },
    handleTravelSubmit() {
      // Emit event with form data for parent component to handle
      this.$emit('submit', this.formData);
      this.resetForm();
    }
  }
};
</script>
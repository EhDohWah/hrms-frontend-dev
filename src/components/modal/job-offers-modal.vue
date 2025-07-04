<template>
  <div class="modal fade" id="job-offers-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="job-offers-modal-title">{{ editMode ? 'Edit' : 'Add' }} Job Offer</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              {{ alertMessage }}
            </div>

            <!-- Full Width Fields for offer date and salary details-->
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Offer Date <span class="text-danger">*</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker class="form-control datetimepicker" :editable="true" :clearable="false"
                      :input-format="displayFormat" v-model="formData.date" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>


            <div class="row">
              <!-- Left Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="candidateName" class="form-label">Candidate Name</label>
                  <input type="text" class="form-control" id="candidateName" v-model="formData.candidate_name"
                    required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Acceptance Deadline <span class="text-danger"> *</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                      :clearable="false" :input-format="displayFormat" v-model="formData.acceptance_deadline" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>

              </div>

              <!-- Right Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="positionName" class="form-label">Position Name</label>
                  <input type="text" class="form-control" id="positionName" v-model="formData.position_name" required />
                </div>


                <div class="mb-3">
                  <label for="acceptanceStatus" class="form-label">Acceptance Status</label>
                  <select class="form-select" id="acceptanceStatus" v-model="formData.acceptance_status" required>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Full Width Fields -->
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <label for="salaryDetail" class="form-label">Salary Details</label>
                  <input type="text" class="form-control" id="salaryDetail" v-model="formData.salary_detail" required />
                </div>

                <div class="mb-3">
                  <label for="note" class="form-label">Notes</label>
                  <textarea class="form-control" id="note" v-model="formData.note" rows="3"
                    placeholder="Enter notes here" style="height: 100px" required></textarea>
                </div>
              </div>
            </div>

            <div class="text-end">
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                  aria-hidden="true"></span>
                {{ editMode ? 'Update' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { useJobOfferStore } from '@/stores/jobOfferStore';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import moment from 'moment';

export default {
  name: 'JobOffersModal',
  setup() {
    const editMode = ref(false);
    const jobOfferData = ref(null);
    const alertMessage = ref('');
    const alertClass = ref('');

    return {
      editMode,
      jobOfferData,
      alertMessage,
      alertClass
    };
  },
  data() {
    return {
      formData: {
        id: null,
        candidate_name: '',
        position_name: '',
        custom_offer_id: '',
        salary_detail: '',
        date: null,
        acceptance_deadline: null,
        acceptance_status: 'pending',
        note: ''
      },
      displayFormat: 'dd/MM/yyyy',
      inputFormat: 'yyyy-MM-dd',
      isSubmitting: false,
      modalInstance: null
    }
  },
  watch: {
    jobOfferData: {
      handler(newVal) {
        if (newVal) {
          // Clone the job offer data but convert formatted dates back to YYYY-MM-DD
          const formattedData = { ...newVal };

          // Convert date strings to Date objects
          if (formattedData.date) {
            if (typeof formattedData.date === 'string' && formattedData.date.includes('/')) {
              formattedData.date = moment(formattedData.date, 'DD/MM/YYYY').toDate();
            } else {
              formattedData.date = new Date(formattedData.date);
            }
          }

          if (formattedData.acceptance_deadline) {
            if (typeof formattedData.acceptance_deadline === 'string' && formattedData.acceptance_deadline.includes('/')) {
              formattedData.acceptance_deadline = moment(formattedData.acceptance_deadline, 'DD/MM/YYYY').toDate();
            } else {
              formattedData.acceptance_deadline = new Date(formattedData.acceptance_deadline);
            }
          }

          this.formData = formattedData;
        }
      },
      deep: true
    }
  },
  mounted() {
    // Initialize the modal when component is mounted
    const modalElement = document.getElementById('job-offers-modal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }
  },
  methods: {
    openModal() {
      if (this.editMode && this.jobOfferData) {
        // Clone existing data for edit mode
        const formattedData = { ...this.jobOfferData };

        // Convert date strings to Date objects
        if (formattedData.date) {
          if (typeof formattedData.date === 'string' && formattedData.date.includes('/')) {
            formattedData.date = moment(formattedData.date, 'DD/MM/YYYY').toDate();
          } else {
            formattedData.date = new Date(formattedData.date);
          }
        }

        if (formattedData.acceptance_deadline) {
          if (typeof formattedData.acceptance_deadline === 'string' && formattedData.acceptance_deadline.includes('/')) {
            formattedData.acceptance_deadline = moment(formattedData.acceptance_deadline, 'DD/MM/YYYY').toDate();
          } else {
            formattedData.acceptance_deadline = new Date(formattedData.acceptance_deadline);
          }
        }

        this.formData = formattedData;
      } else {
        // Set defaults for new entry
        this.formData = {
          id: null,
          candidate_name: '',
          position_name: '',
          custom_offer_id: '',
          salary_detail: '',
          date: new Date(), // <-- default today as Date object
          acceptance_deadline: null, // <-- default today as Date object
          acceptance_status: 'pending',
          note: ''
        };
      }

      // Show the modal using Bootstrap Modal instance
      if (this.modalInstance) {
        this.modalInstance.show();
      } else {
        const modalElement = document.getElementById('job-offers-modal');
        if (modalElement) {
          this.modalInstance = new Modal(modalElement);
          this.modalInstance.show();
        } else {
          console.error('Modal element not found');
          message.error('Modal element not found');
        }
      }
    },

    async handleSubmit() {
      this.isSubmitting = true;
      this.alertMessage = ''; // Reset alert message
      try {
        const jobOfferStore = useJobOfferStore();

        if (this.editMode) {
          await jobOfferStore.updateJobOffer(this.formData.id, this.formData);
        } else {
          await jobOfferStore.createJobOffer(this.formData);
        }

        this.$emit(this.editMode ? 'job-offer-updated' : 'job-offer-added');
        message.success(this.editMode ? 'Job offer updated successfully' : 'Job offer added successfully');
        this.resetForm();
        if (this.modalInstance) {
          this.modalInstance.hide();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        this.alertMessage = error.message || 'An error occurred while saving the job offer.';
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        id: null,
        candidate_name: '',
        position_name: '',
        custom_offer_id: '',
        salary_detail: '',
        date: null,
        acceptance_deadline: null,
        acceptance_status: 'pending',
        note: ''
      };
      this.alertMessage = ''; // Reset alert message on form reset
      this.alertClass = '';
    }
  }
};
</script>

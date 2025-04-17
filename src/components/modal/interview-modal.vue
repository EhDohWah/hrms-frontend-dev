<template>
  <div class="modal fade" id="interviewModal" tabindex="-1" aria-labelledby="interviewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="interviewModalLabel">{{ editMode ? 'Edit' : 'Add' }} Interview</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              {{ alertMessage }}
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
                  <label for="jobPosition" class="form-label">Job Position</label>
                  <input type="text" class="form-control" id="jobPosition" v-model="formData.job_position" required />
                </div>

                <div class="mb-3">
                  <label for="endTime" class="form-label">End Time</label>
                  <input type="time" class="form-control" id="endTime" v-model="formData.end_time" />
                </div>

                <div class="mb-3">
                  <label for="interviewDate" class="form-label">Interview Date</label>
                  <input type="date" class="form-control" id="interviewDate" v-model="formData.interview_date"
                    required />
                </div>
                <div class="mb-3">
                  <label for="interviewMode" class="form-label">Interview Mode</label>
                  <select class="form-select" id="interviewMode" v-model="formData.interview_mode" required>
                    <option value="In-person">In-person</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
              </div>

              <!-- Right Column -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="phone" class="form-label">Phone</label>
                  <input type="text" class="form-control" id="phone" v-model="formData.phone" required />
                </div>
                <div class="mb-3">
                  <label for="startTime" class="form-label">Start Time</label>
                  <input type="time" class="form-control" id="startTime" v-model="formData.start_time" required />
                </div>

                <div class="mb-3">
                  <label for="interviewStatus" class="form-label">Interview Status</label>
                  <select class="form-select" id="interviewStatus" v-model="formData.interview_status" required>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="score" class="form-label">Score</label>
                  <input type="number" class="form-control" id="score" v-model="formData.score" min="0" max="100" />
                </div>
                <div class="mb-3">
                  <label for="hiredStatus" class="form-label">Hired Status</label>
                  <select class="form-select" id="hiredStatus" v-model="formData.hired_status">
                    <option value="" disabled selected>Select Hired Status</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Full Width Fields -->
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <label for="interviewerName" class="form-label">Interviewer Name / Position</label>
                  <textarea class="form-control" id="interviewerName" v-model="formData.interviewer_name" required />
                </div>
                <div class="mb-3">
                  <label for="feedback" class="form-label">Feedback</label>
                  <textarea class="form-control" id="feedback" v-model="formData.feedback" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label for="referenceInfo" class="form-label">Reference Information</label>
                  <textarea class="form-control" id="referenceInfo" v-model="formData.reference_info"
                    rows="3"></textarea>
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
import { useInterviewStore } from '@/stores/interviewStore';
import { message } from 'ant-design-vue';
import { ref } from 'vue';

export default {
  name: 'InterviewModal',
  setup() {
    const editMode = ref(false);
    const interviewData = ref(null);
    const alertMessage = ref('');
    const alertClass = ref('');

    return {
      editMode,
      interviewData,
      alertMessage,
      alertClass
    };
  },
  data() {
    return {
      formData: {
        id: null,
        candidate_name: '',
        phone: '',
        job_position: '',
        interviewer_name: '',
        interview_date: '',
        start_time: '',
        end_time: '',
        interview_mode: 'In-person',
        interview_status: 'Scheduled',
        score: '',
        feedback: '',
        reference_info: '',
        hired_status: ''
      },
      isSubmitting: false,
      modalInstance: null
    };
  },
  watch: {
    interviewData: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };

          // Format time fields when in edit mode
          if (this.editMode) {
            if (this.formData.start_time) {
              this.formData.start_time = this.formatTimeForInput(this.formData.start_time);
            }
            if (this.formData.end_time) {
              this.formData.end_time = this.formatTimeForInput(this.formData.end_time);
            }
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    // Initialize the modal when component is mounted
    const modalElement = document.getElementById('interviewModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }
  },
  methods: {
    openModal() {
      if (this.editMode && this.interviewData) {
        this.formData = { ...this.interviewData };

        // Format time fields for display in the form
        if (this.formData.start_time) {
          this.formData.start_time = this.formatTimeForInput(this.formData.start_time);
        }
        if (this.formData.end_time) {
          this.formData.end_time = this.formatTimeForInput(this.formData.end_time);
        }
      } else {
        this.resetForm();
      }
      // Show the modal using the instance created in mounted hook
      if (this.modalInstance) {
        this.modalInstance.show();
      } else {
        // If modalInstance is not available, try to create it again
        const modalElement = document.getElementById('interviewModal');
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
        // Format time fields to match H:i:s format
        const formattedData = { ...this.formData };
        if (formattedData.start_time) {
          formattedData.start_time = this.formatTimeWithSeconds(formattedData.start_time);
        }
        if (formattedData.end_time) {
          formattedData.end_time = this.formatTimeWithSeconds(formattedData.end_time);
        }

        const interviewStore = useInterviewStore();

        let response;
        if (this.editMode) {
          response = await interviewStore.updateInterview(this.formData.id, formattedData);
        } else {
          response = await interviewStore.createInterview(formattedData);
        }

        if (!response.success) {
          this.alertMessage = response.message;
          this.alertClass = 'alert-danger';
          if (response.errors) {
            this.alertMessage += ' ' + Object.values(response.errors).flat().join(' ');
          }
        } else {
          this.$emit(this.editMode ? 'interview-updated' : 'interview-added');
          message.success(this.editMode ? 'Interview updated successfully' : 'Interview added successfully');
          this.resetForm();
          if (this.modalInstance) {
            this.modalInstance.hide();
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        this.alertMessage = error.message || 'An error occurred while saving the interview.';
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },

    formatTimeWithSeconds(timeString) {
      // If time already has seconds, return as is
      if (timeString.split(':').length === 3) {
        return timeString;
      }
      // Otherwise add seconds
      return `${timeString}:00`;
    },

    formatTimeForInput(timeString) {
      // Format time for input field (HH:MM format)
      if (!timeString) return '';

      // If time has seconds or more parts, truncate to HH:MM
      const timeParts = timeString.split(':');
      if (timeParts.length >= 2) {
        return `${timeParts[0]}:${timeParts[1]}`;
      }

      return timeString;
    },

    resetForm() {
      this.formData = {
        id: null,
        candidate_name: '',
        phone: '',
        job_position: '',
        interviewer_name: '',
        interview_date: '',
        start_time: '',
        end_time: '',
        interview_mode: 'In-person',
        interview_status: 'Scheduled',
        score: '',
        feedback: '',
        reference_info: '',
        hired_status: ''
      };
      this.alertMessage = ''; // Reset alert message on form reset
      this.alertClass = '';
    }
  }
};
</script>

<style scoped>
.modal-content {
  padding: 20px;
}
</style>

<template>
  <div
    class="modal fade"
    id="referencesModal"
    tabindex="-1"
    aria-labelledby="referencesModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="referencesModalLabel">{{ editMode ? 'Edit' : 'Add' }} Reference</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              {{ alertMessage }}
            </div>
            <div class="mb-3">
              <label for="refereeName" class="form-label">Referee Name</label>
              <input type="text" class="form-control" id="refereeName" v-model="formData.referee_name" required />
            </div>
            <div class="mb-3">
              <label for="occupation" class="form-label">Occupation</label>
              <input type="text" class="form-control" id="occupation" v-model="formData.occupation" required />
            </div>
            <div class="mb-3">
              <label for="candidateName" class="form-label">Candidate Name</label>
              <input type="text" class="form-control" id="candidateName" v-model="formData.candidate_name" required />
            </div>
            <div class="mb-3">
              <label for="relation" class="form-label">Relation</label>
              <input type="text" class="form-control" id="relation" v-model="formData.relation" required />
            </div>
            <div class="mb-3">
              <label for="address" class="form-label">Address</label>
              <textarea class="form-control" id="address" v-model="formData.address" rows="2"></textarea>
            </div>
            <div class="mb-3">
              <label for="phoneNumber" class="form-label">Phone Number</label>
              <input type="text" class="form-control" id="phoneNumber" v-model="formData.phone_number" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" v-model="formData.email" required />
            </div>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              {{ editMode ? 'Update' : 'Save' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { useReferenceStore } from '@/stores/referenceStore';

export default {
  name: 'ReferencesModal',
  setup() {
    const editMode = ref(false);
    const referenceData = ref(null);
    const alertMessage = ref('');
    const alertClass = ref('');

    return {
      editMode,
      referenceData,
      alertMessage,
      alertClass
    };
  },
  data() {
    return {
      formData: {
        id: null,
        referee_name: '',
        occupation: '',
        candidate_name: '',
        relation: '',
        address: '',
        phone_number: '',
        email: ''
      },
      isSubmitting: false,
      modalInstance: null
    };
  },
  watch: {
    referenceData: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };
        }
      },
      deep: true
    }
  },
  mounted() {
    // Initialize the modal when component is mounted
    const modalElement = document.getElementById('referencesModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }
  },
  methods: {
    openModal() {
      if (this.editMode && this.referenceData) {
        this.formData = { ...this.referenceData };
      } else {
        this.resetForm();
      }
      // Show the modal using the instance created in mounted hook
      if (this.modalInstance) {
        this.modalInstance.show();
      } else {
        // If modalInstance is not available, try to create it again
        const modalElement = document.getElementById('referencesModal');
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
        const referenceStore = useReferenceStore();
        
        let response;
        if (this.editMode) {
          response = await referenceStore.updateReference(this.formData.id, this.formData);
        } else {
          response = await referenceStore.createReference(this.formData);
        }

        if (!response.success) {
          this.alertMessage = response.message || 'An error occurred while saving the reference.';
          this.alertClass = 'alert-danger';
          if (response.errors) {
            this.alertMessage += ' ' + Object.values(response.errors).flat().join(' ');
          }
        } else {
          this.$emit(this.editMode ? 'reference-updated' : 'reference-added');
          message.success(this.editMode ? 'Reference updated successfully' : 'Reference added successfully');
          this.resetForm();
          if (this.modalInstance) {
            this.modalInstance.hide();
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        this.alertMessage = error.message || 'An error occurred while saving the reference.';
        this.alertClass = 'alert-danger';
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        id: null,
        referee_name: '',
        occupation: '',
        candidate_name: '',
        relation: '',
        address: '',
        phone_number: '',
        email: ''
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

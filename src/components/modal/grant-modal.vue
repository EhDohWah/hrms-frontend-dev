<template>
  <div class="modal custom-modal fade" id="grant_modal" role="dialog" tabindex="-1" aria-labelledby="grantModalLabel">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="grantModalLabel">Add Grant</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="grant-name">Grant Name</label>
                  <input type="text" id="grant-name" v-model="formData.name" class="form-control" placeholder="e.g., UNICEF-EP" required>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="grant-code">Grant Code</label>
                  <input type="text" id="grant-code" v-model="formData.code" class="form-control" placeholder="e.g., B-24004" required>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="input-block mb-3">
                  <label class="form-label" for="grant-description">Description</label>
                  <textarea id="grant-description" v-model="formData.description" class="form-control" rows="3"></textarea>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="grant-end-date">End Date</label>
                  <input type="date" id="grant-end-date" v-model="formData.end_date" class="form-control">
                </div>
              </div>
            </div>

            <div class="submit-section">
              <button type="submit" class="btn btn-primary">
                Add Grant
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GrantModal',
  data() {
    return {
      isSubmitting: false,
      formData: {
        name: '',
        code: '',
        description: '',
        end_date: ''
      }
    };
  },
  mounted() {
    // Fix accessibility issue with modal and aria-hidden
    const modalElement = document.getElementById('grant_modal');
    if (modalElement) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
            if (modalElement.getAttribute('aria-hidden') === 'true' && 
                modalElement.contains(document.activeElement)) {
              // Remove aria-hidden when the modal contains focus
              modalElement.removeAttribute('aria-hidden');
            }
          }
        });
      });
      
      observer.observe(modalElement, { attributes: true });
    }
  },
  methods: {
    handleSubmit() {
      // Prevent duplicate submissions
      if (this.isSubmitting) return;
      this.isSubmitting = true;

      console.log(this.formData);


      // Emit the form data to parent component
      this.$emit('add-grant', { ...this.formData });
      
      // Reset form after submission
      this.resetForm();
      
      // Close modal
      document.querySelector('#grant_modal [data-bs-dismiss="modal"]').click();
    },
    resetForm() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        end_date: ''
      };
    }
  }
};
</script>

<style scoped>
.modal-dialog {
  max-width: 800px;
}
.input-block {
  position: relative;
}
.form-label {
  font-weight: 500;
}
</style> 
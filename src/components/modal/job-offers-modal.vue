<template>
  <div class="modal fade" id="job-offers-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="job-offers-modal-title">Job Offer</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>


      </div>
    </div>
  </div>

</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'JobOffersModal',

  data() {
    return {

    }
  },
  methods: {
    setData(data) {
      // Set the data for the modal
      this.jobOfferData = data;
    },
    open() {
      // Initialize Bootstrap modal and open it
      const modalElement = document.getElementById('job-offers-modal');
      const modal = new Modal(modalElement);
      modal.show();
    }

  }
};
</script>

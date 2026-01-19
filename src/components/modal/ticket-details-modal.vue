<template>
  <!-- Add Ticket -->
  <div class="modal fade" id="add_ticket">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Ticket</h4>
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
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Title</label>
                  <input type="text" class="form-control" placeholder="Enter Title" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Event Category</label>
                  <vue-select :options="IssueInt" id="issueint" placeholder="Select" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Subject</label>
                  <input type="text" class="form-control" placeholder="Enter Subject" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Assign To</label>
                  <vue-select :options="Assjame" id="assjame" placeholder="Select" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Ticket Description</label>
                  <textarea class="form-control" placeholder="Add Question"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Priority</label>
                  <vue-select :options="PrioLow" id="priolow" placeholder="Select" />
                </div>
                <div class="mb-0">
                  <label class="form-label">Status</label>
                  <vue-select :options="InProSelc" id="inproselc" placeholder="Select" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a
              href="javascript:void(0);"
              class="btn btn-light me-2"
              data-bs-dismiss="modal"
              >Cancel</a
            >
            <button type="submit" class="btn btn-primary">Add Ticket</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Ticket -->
</template>
<script>
export default {
  data() {
    return {
      InProSelc: ["Select", "Closed", "Reopened", "Inprogress"],
      PrioLow: ["Select", "High", "Low", "Medium"],
      Assjame: ["Select", "Teresa", "James", "Daniel", "Jacquelin"],
      IssueInt: ["Select", "Internet Issue", "Redistribute", "Computer", "Complaint"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/tickets/tickets-details");
    },
  },
};
</script>

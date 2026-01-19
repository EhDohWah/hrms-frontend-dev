<template>
  <!-- Add Ticket -->
  <div class="modal fade" id="add_ticket">
    <div class="modal-dialog modal-dialog-centered modal-lg">
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
                  <vue-select :options="Redist" id="redist" placeholder="Select" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Subject</label>
                  <input type="text" class="form-control" placeholder="Enter Subject" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Assign To</label>
                  <vue3-tags-input
                    class="input-tags form-control"
                    placeholder="Add new"
                    type="text"
                    data-role="tagsinput"
                    name="Label"
                    value="Tag1"
                    :tags="Onetags"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Ticket Description</label>
                  <textarea class="form-control" placeholder="Add Question"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Priority</label>
                  <vue-select :options="Medispr" id="medispr" placeholder="Select" />
                </div>
                <div class="mb-0">
                  <label class="form-label">Status</label>
                  <vue-select :options="CloseTic" id="closetic" placeholder="Select" />
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
            You want to delete all the marked items, this cant be undone once you delete.
          </p>
          <div class="d-flex justify-content-center">
            <a
              href="javascript:void(0);"
              class="btn btn-light me-3"
              data-bs-dismiss="modal"
              >Cancel</a
            >
            <router-link to="/tickets/tickets-grid" class="btn btn-danger"
              >Yes, Delete</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>
<script>
import Vue3TagsInput from "vue3-tags-input";
export default {
  components: {
    Vue3TagsInput,
  },
  data() {
    return {
      Onetags: ["Vaughan Lewis"],
      CloseTic: ["Select", "Closed", "Reopened", "Inprogress"],
      Medispr: ["Select", "High", "Low", "Medium"],
      Daneik: ["Select", "Teresa", "James", "Daniel", "Jacquelin"],
      Redist: ["Select", "Internet Issue", "Redistribute", "Computer", "Complaint"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/tickets/tickets-grid");
    },
  },
};
</script>

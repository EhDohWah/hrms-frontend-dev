<template>
  <!-- Add New IP Addres -->
  <div class="modal fade" id="add_ban">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New IP Address</h4>
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
                  <label class="form-label">IP Address</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Currency Name"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Reason</label>
                  <textarea class="form-control" rows="3"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a href="javascript:void(0);" class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</a>
            <button type="submit" class="btn btn-primary">Add IP Address</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add New Currency -->

  <!-- Edit IP Address -->
  <div class="modal fade" id="edit_ban">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit IP Address</h4>
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
                  <label class="form-label">IP Address</label>
                  <input type="text" class="form-control" value="198.120.16.01" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Reason</label>
                  <textarea class="form-control">
Temporarily block to protect user accounts from internet fraudsters</textarea
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a href="javascript:void(0);" class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</a>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit IP Address -->
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    submitForm() {
      this.$router.push("/others-settings/ban-ip-address");
    },
  },
};
</script>

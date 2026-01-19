<template>
  <!-- Add New Currency -->
  <div class="modal fade" id="add_new_currency">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Currency</h4>
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
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Currency Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Currency Name"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Currency Symbol</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Currency Symbol"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Currency Code</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Currency Code"
                  />
                </div>
                <div class="d-flex mb-3">
                  <label class="form-label me-3">Currency Position</label>
                  <div class="form-check me-3">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="required"
                      id="required1"
                      checked
                    />
                    <label class="form-check-label" for="required1">Front</label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      name="required"
                      type="radio"
                      id="required2"
                    />
                    <label class="form-check-label" for="required2">Behind</label>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <vue-select :options="CurrenSta" id="currensta" placeholder="Select" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a href="javascript:void(0);" class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</a>
            <button type="submit" class="btn btn-primary">Add Tax Rate</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add New Currency -->

  <!-- Edit New Currency -->
  <div class="modal fade" id="edit_new_currency">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit New Currency</h4>
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
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Currency Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Currency Name"
                    value="Dollar"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Currency Symbol</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Currency Symbol"
                    value="$"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Currency Code</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Currency Code"
                    value="INR"
                  />
                </div>
                <div class="d-flex mb-3">
                  <label class="form-label me-3">Currency Position</label>
                  <div class="form-check me-3">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="required"
                      id="required3"
                      checked
                    />
                    <label class="form-check-label" for="required3">Front</label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      name="required"
                      type="radio"
                      id="required4"
                    />
                    <label class="form-check-label" for="required4">Behind</label>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <vue-select
                    :options="EditCurrenSta"
                    id="editcurrensta"
                    placeholder="Active"
                  />
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
  <!-- /Edit New Currency -->

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
            <router-link to="/financial-settings/currencies" class="btn btn-danger"
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
export default {
  data() {
    return {
      CurrenSta: ["Select", "Active", "Inactive"],
      EditCurrenSta: ["Select", "Active", "Inactive"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/financial-settings/currencies");
    },
  },
};
</script>

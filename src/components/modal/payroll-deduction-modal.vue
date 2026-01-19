<template>
  <!-- Add Payroll Deduction -->
  <div class="modal fade" id="add_deduction">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Deduction</h4>
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
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="row align-items-end">
                <div class="col-md-8">
                  <div class="mb-3">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-control" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label mb-0 fs-12 fw-normal"
                      >Unit Calculation</label
                    >
                    <div class="form-check form-switch d-flex">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault5"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="mb-3">
                    <div class="d-flex">
                      <div class="form-check me-3">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault6"
                          checked
                        />
                        <label
                          class="form-check-label fs-14 fw-medium text-dark"
                          for="flexRadioDefault2"
                        >
                          No Assignee
                        </label>
                      </div>
                      <div class="form-check me-3">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault7"
                        />
                        <label
                          class="form-check-label fs-14 fw-medium text-dark"
                          for="flexRadioDefault3"
                        >
                          All Employees
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault8"
                        />
                        <label
                          class="form-check-label fs-14 fw-medium text-dark"
                          for="flexRadioDefault4"
                        >
                          Select Employee
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-white border me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Deduction</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Payroll Deduction -->

  <!-- Edit  Payroll Deduction -->
  <div class="modal fade" id="edit_deduction">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Deduction</h4>
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
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" value="Absent amount" />
                </div>
              </div>
              <div class="row align-items-end">
                <div class="col-md-8">
                  <div class="mb-3">
                    <label class="form-label">Amount</label>
                    <input type="text" class="form-control" value="$12" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label mb-0 fs-12 fw-normal"
                      >Unit Calculation</label
                    >
                    <div class="form-check form-switch d-flex">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="mb-3">
                    <div class="d-flex">
                      <div class="form-check me-3">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          checked
                        />
                        <label
                          class="form-check-label fs-14 fw-medium text-dark"
                          for="flexRadioDefault2"
                        >
                          No Assignee
                        </label>
                      </div>
                      <div class="form-check me-3">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault3"
                        />
                        <label
                          class="form-check-label fs-14 fw-medium text-dark"
                          for="flexRadioDefault3"
                        >
                          All Employees
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault4"
                        />
                        <label
                          class="form-check-label fs-14 fw-medium text-dark"
                          for="flexRadioDefault4"
                        >
                          Select Employee
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-white border me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Payroll Deduction -->

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
            <router-link to="/payroll/payroll-deduction" class="btn btn-danger"
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
    return {};
  },
  methods: {
    submitForm() {
      this.$router.push("/payroll/payroll-deduction");
    },
  },
};
</script>

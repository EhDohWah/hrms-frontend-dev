<template>
  <!-- Add Payroll Overtime -->
  <div class="modal fade" id="add_overtime">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Overtime</h4>
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
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Rate Type</label>
                  <a-select :options="Typerat" id="typerat" placeholder="Select" style="width: 100%" :show-search="true" :filter-option="filterOption" :get-popup-container="getModalPopupContainer" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Rate</label>
                  <input type="text" class="form-control" />
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
            <button type="submit" class="btn btn-primary">Add Overtime</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Payroll -->

  <!-- Edit  Payroll Overtime -->
  <div class="modal fade" id="edit_overtime">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Overtime</h4>
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
                  <input type="text" class="form-control" value="Normal day OT 1.5x" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Rate Type</label>
                  <a-select
                    :options="EditTyperat"
                    id="edittyperat"
                    placeholder="Select"
                    style="width: 100%"
                    :show-search="true"
                    :filter-option="filterOption"
                    :get-popup-container="getModalPopupContainer"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Rate</label>
                  <input type="text" class="form-control" />
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
  <!-- /Edit  Payroll Overtime -->

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
            <router-link to="/payroll/payroll-overtime" class="btn btn-danger"
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
import { useSelectMigration } from '@/composables/useSelectMigration';

export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      Typerat: ["Select", "Hourly 1.5", "Hourly 3", "Hourly 2"],
      EditTyperat: ["Select", "Hourly 1.5", "Hourly 3", "Hourly 2"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/payroll/payroll-overtime");
    },
  },
};
</script>

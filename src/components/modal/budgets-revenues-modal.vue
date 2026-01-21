<template>
  <!-- Add New Revenue -->
  <div class="modal fade" id="add_new_expense">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Budget Revenue</h4>
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
                  <label class="form-label">Revenue Name</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Category Name</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Sub Category Name</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Amount</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Expense Date </label>
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="startdate"
                      class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy"
                      :editable="true"
                      :clearable="false"
                      :input-format="dateFormat"
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <div
                    class="d-flex align-items-center justify-content-center border border-dashed rounded p-3 flex-column"
                  >
                    <span
                      class="avatar avatar-lg avatar-rounded bg-primary-transparent mb-2"
                      ><i class="ti ti-folder-open fs-24"></i
                    ></span>
                    <p class="fs-14 text-center mb-2">Drag and drop your files</p>
                    <div
                      class="file-upload position-relative btn btn-sm btn-primary px-3 mb-2"
                    >
                      <i class="ti ti-upload me-1"></i>Upload
                      <input type="file" accept="video/image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Budget Revenue</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add New Revenue -->

  <!-- Edit New Expense -->
  <div class="modal fade" id="edit_new_expense">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Budget Revenue</h4>
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
                  <label class="form-label">Expense Name</label>
                  <input type="text" class="form-control" value="Training Programs" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Category Name</label>
                  <input type="text" class="form-control" value="Training" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Sub Category Name</label>
                  <input type="text" class="form-control" value="Employee Training" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Amount</label>
                  <input type="text" class="form-control" value="20000" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Expense Date </label>
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="startdateOne"
                      class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy"
                      :editable="true"
                      :clearable="false"
                      :input-format="dateFormat"
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <div
                    class="d-flex align-items-center justify-content-center border border-dashed rounded p-3 flex-column"
                  >
                    <span
                      class="avatar avatar-lg avatar-rounded bg-primary-transparent mb-2"
                      ><i class="ti ti-folder-open fs-24"></i
                    ></span>
                    <p class="fs-14 text-center mb-2">Drag and drop your files</p>
                    <div
                      class="file-upload position-relative btn btn-sm btn-primary px-3 mb-2"
                    >
                      <i class="ti ti-upload me-1"></i>Upload
                      <input type="file" accept="video/image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit New Expense -->

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
            <router-link to="/accounting/budgets" class="btn btn-danger"
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
import { ref } from "vue";
const currentDate = ref(new Date());
const currentDateOne = ref(new Date());
export default {
  data() {
    return {
      startdate: currentDate,
      startdateOne: currentDateOne,
      dateFormat: "dd-MM-yyyy",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/accounting/budget-revenues");
    },
  },
};
</script>

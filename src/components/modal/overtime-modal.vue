<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

import { ref } from "vue";
const currentDate = ref(new Date());

export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      Employee: ["Select", "Anthony Lewis", "Brian Villalobos", "Harvey Smith"],
      Status: ["Select", "Accepted", "Rejected"],
      startdate: currentDate,
      dateFormat: "dd-MM-yyyy",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/attendance/overtime");
    },
  },
};
</script>

<template>
  <!-- Add Overtime -->
  <div class="modal fade" id="add_overtime">
    <div class="modal-dialog modal-md">
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
                  <label class="form-label"
                    >Employee<span class="text-danger"> *</span></label
                  >
                  <a-select :options="Employee" id="empid" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Overtime date <span class="text-danger"> *</span></label
                  >
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
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Overtime<span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Remaining Hours<span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" rows="3"></textarea>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Status<span class="text-danger"> *</span></label
                  >
                  <a-select :options="Status" id="statusid" placeholder="Select" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Overtime</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Overtime -->

  <!-- Edit Overtime -->
  <div class="modal fade" id="edit_overtime">
    <div class="modal-dialog modal-md">
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
                  <label class="form-label"
                    >Employee * <span class="text-danger"> *</span></label
                  >
                  <a-select
                    :options="Employee"
                    id="employeeid"
                    placeholder="Anthony Lewis"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Overtime date <span class="text-danger"> *</span></label
                  >
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="startdate"
                      class="form-control datetimepicker"
                      value="17-10-2024"
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
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Overtime<span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" value="8" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Remaining Hours<span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" value="2" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" rows="3"></textarea>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Status<span class="text-danger"> *</span></label
                  >
                  <a-select :options="Status" id="acceptedid" placeholder="Accepted" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Overtime</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Overtime -->

  <!-- Overtime Details -->
  <div class="modal fade" id="overtime_details">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Overtime Details</h4>
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
                  <div class="p-3 mb-3 br-5 bg-transparent-light">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="d-flex align-items-center file-name-icon">
                          <a
                            href="javascript:void(0);"
                            class="avatar avatar-md border avatar-rounded"
                          >
                            <img
                              src="@/assets/img/users/user-32.jpg"
                              class="img-fluid"
                              alt="img"
                            />
                          </a>
                          <div class="ms-2">
                            <h6 class="fw-medium fs-14">
                              <a href="javascript:void(0);">Anthony Lewis</a>
                            </h6>
                            <span class="fs-12 fw-normal">UI/UX Team</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div>
                          <p class="fs-14 fw-normal mb-1">Hours Worked</p>
                          <h6 class="fs-14 fw-medium">32</h6>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div>
                          <p class="fs-14 fw-normal mb-1">Date</p>
                          <h6 class="fs-14 fw-medium">15 May 2024</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <h6 class="fs-14 fw-medium">Office Management</h6>
                  <p class="fs-12 fw-normal">
                    Worked on the Management design & Development
                  </p>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Select Status <span class="text-danger"> *</span></label
                  >
                  <a-select :options="Status" id="selectid" placeholder="Select" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Overtime Details -->

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
            <router-link to="/attendance/overtime" class="btn btn-danger"
              >Yes, Delete</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

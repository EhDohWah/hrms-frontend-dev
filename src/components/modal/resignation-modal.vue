<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

import { ref } from "vue";
const currentDate = ref(new Date());
const currentDateOne = ref(new Date());

export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      Resigning: ["Select", "Anthony Lewis", "Brian Villalobos", "Doglas Martini"],
      startdate: currentDate,
      startdateOne: currentDateOne,
      dateFormat: "dd-MM-yyyy",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/hrm/resignation");
    },
  },
};
</script>

<template>
  <!-- Add Resignation -->
  <div class="modal fade" id="new_resignation">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Resignation</h4>
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
                  <label class="form-label">Resigning Employee</label>
                  <a-select
                    :options="Resigning"
                    id="resigning-emp"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Notice Date</label>
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
                  <label class="form-label">Resignation Date</label>
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
                  <label class="form-label">Reason</label>
                  <textarea class="form-control" rows="3"></textarea>
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
            <button type="submit" class="btn btn-primary">Add Resignation</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Resignation -->

  <!-- Edit Resignation -->
  <div class="modal fade" id="edit_resignation">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Resignation</h4>
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
                  <label class="form-label">Resigning Employee</label>
                  <a-select :options="Resigning" placeholder="Anthony Lewis" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Notice Date</label>
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="startdate"
                      class="form-control datetimepicker"
                      value="14/01/2024"
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
                  <label class="form-label">Resignation Date</label>
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="startdateOne"
                      class="form-control datetimepicker"
                      value="14/03/2024"
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
                  <label class="form-label">Reason</label>
                  <textarea class="form-control" rows="3">Career Change</textarea>
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
  <!-- /Edit Resignation -->

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
            <router-link to="/hrm/resignation" class="btn btn-danger"
              >Yes, Delete</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

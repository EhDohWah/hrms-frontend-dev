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
      Status: ["Select", "Active", "Inactive"],
      startdate: currentDate,
      dateFormat: "dd-MM-yyyy",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/performance/performance-appraisal");
    },
  },
};
</script>

<template>
  <!-- Add Appraisal -->
  <div class="modal fade" id="add_performance_appraisal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Appraisal</h4>
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
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Employee</label>
                  <a-select :options="Employee" id="emp-lewis" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Appraisal Date</label>
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
                <ul
                  class="nav appraisal-tab nav-pills mb-3"
                  id="pills-tab"
                  role="tablist"
                >
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link border active"
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#technical"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Technical
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link border"
                      id="pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#organization"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      Organizational
                    </button>
                  </li>
                </ul>
              </div>
              <div class="col-md-12">
                <div class="tab-content appraisal-tab-content" id="pills-tabContent">
                  <div
                    class="tab-pane fade show active"
                    id="technical"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                    tabindex="0"
                  >
                    <div class="card">
                      <div
                        class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                      >
                        <h5>Technical Competencies</h5>
                      </div>
                      <div class="card-body p-0">
                        <div class="table-responsive">
                          <technical-table></technical-table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="organization"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab"
                    tabindex="0"
                  >
                    <div class="card">
                      <div
                        class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                      >
                        <h5>Organizational Competencies</h5>
                      </div>
                      <div class="card-body p-0">
                        <div class="table-responsive">
                          <organizational-table></organizational-table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <a-select
                    :options="Status"
                    id="inactive-status"
                    placeholder="Select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Appraisal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Appraisal -->

  <!-- Edit  Appraisal -->
  <div class="modal fade" id="edit_performance_appraisal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Appraisal</h4>
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
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Employee</label>
                  <a-select :options="Employee" id="emp-smith" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Appraisal Date</label>
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
                <ul
                  class="nav appraisal-tab nav-pills mb-3"
                  id="pills-tab2"
                  role="tablist"
                >
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link border active"
                      id="pills-home-tab2"
                      data-bs-toggle="pill"
                      data-bs-target="#edit_technical"
                      type="button"
                      role="tab"
                      aria-selected="true"
                    >
                      Technical
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link border"
                      id="pills-profile-tab2"
                      data-bs-toggle="pill"
                      data-bs-target="#edit_organization"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      Organizational
                    </button>
                  </li>
                </ul>
              </div>
              <div class="col-md-12">
                <div class="tab-content appraisal-tab-content" id="pills-tabContent2">
                  <div
                    class="tab-pane fade show active"
                    id="edit_technical"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab2"
                    tabindex="0"
                  >
                    <div class="card">
                      <div
                        class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                      >
                        <h5>Technical Competencies</h5>
                      </div>
                      <div class="card-body p-0">
                        <div class="table-responsive">
                          <technical-table></technical-table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="edit_organization"
                    role="tabpanel"
                    aria-labelledby="pills-profile-tab2"
                    tabindex="0"
                  >
                    <div class="card">
                      <div
                        class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                      >
                        <h5>Organizational Competencies</h5>
                      </div>
                      <div class="card-body p-0">
                        <div class="table-responsive">
                          <organizational-table></organizational-table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <a-select
                    :options="Status"
                    id="inactive-status-one"
                    placeholder="Select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Appraisal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit  Appraisal -->

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
            <router-link to="/performance/performance-appraisal" class="btn btn-danger"
              >Yes, Delete</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

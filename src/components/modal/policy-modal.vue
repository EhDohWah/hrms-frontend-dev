<template>
  <!-- Add Policy -->
  <div class="modal fade" id="add_policy">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Policy</h4>
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
                  <label class="form-label">Policy Name</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Appraisal Date</label>
                  <textarea class="form-control"></textarea>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Department</label>
                  <a-select
                    :options="DevePolicy"
                    id="devepolicy"
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
                  <label class="form-label">Upload Policy</label>
                  <div class="policy-upload d-flex flex-column align-items-center">
                    <div
                      class="policy-upload-bg mb-2 rounded-circle d-flex align-items-center justify-content-center bg-primary-transparent"
                    >
                      <span
                        ><img
                          src="@/assets/img/folder-open.svg"
                          alt="Img"
                          class="img-fluid"
                      /></span>
                    </div>
                    <h6 class="fs-12 fw-normal mb-2">Drag and drop your files</h6>
                    <div class="drag-upload-btn bg-primary mb-0">
                      <i class="ti ti-upload me-1"></i>Upload
                      <input type="file" class="form-control image-sign" multiple />
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
            <button type="submit" class="btn btn-primary">Add Policy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Policy -->

  <!-- Edit  Policy -->
  <div class="modal fade" id="edit_policy">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Policy</h4>
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
                  <label class="form-label">Policy Name</label>
                  <input type="text" class="form-control" value="Leave Policy" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Appraisal Date</label>
                  <textarea class="form-control">
Guidelines regarding employee absences from work</textarea
                  >
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Department</label>
                  <a-select
                    :options="EditDevePolicy"
                    id="editdevepolicy"
                    placeholder="All Department"
                    style="width: 100%"
                    :show-search="true"
                    :filter-option="filterOption"
                    :get-popup-container="getModalPopupContainer"
                  />
                </div>
              </div>

              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Upload Policy</label>
                  <div class="policy-upload d-flex flex-column align-items-center">
                    <div
                      class="policy-upload-bg mb-2 rounded-circle d-flex align-items-center justify-content-center bg-primary-transparent"
                    >
                      <span
                        ><img
                          src="@/assets/img/folder-open.svg"
                          alt="Img"
                          class="img-fluid"
                      /></span>
                    </div>
                    <h6 class="fs-12 fw-normal mb-2">Drag and drop your files</h6>
                    <div class="drag-upload-btn bg-primary mb-0">
                      <i class="ti ti-upload me-1"></i>Upload
                      <input type="file" class="form-control image-sign" multiple />
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
            <button type="submit" class="btn btn-primary">Add Policy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit  Policy -->

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
            <router-link to="/employee/policy" class="btn btn-danger"
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
      DevePolicy: ["Select", "All Department", "Finance", "Marketing", "Development"],
      EditDevePolicy: ["Select", "All Department", "Finance", "Marketing", "Development"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/employee/policy");
    },
  },
};
</script>

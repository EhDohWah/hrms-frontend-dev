<template>
  <!-- Add Todo -->
  <div class="modal fade" id="add_todo">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Todo</h4>
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
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Todo Title</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Tag</label>
                  <a-select :options="Admtag" id="adtag" placeholder="Select" />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Priority</label>
                  <a-select :options="ProAdmin" id="proadmin" placeholder="Select" />
                </div>
              </div>
              <div class="col-lg-12">
                <div class="mb-3">
                  <label class="form-label">Descriptions</label>
                    <QuillEditor
                      v-model:content="editorData"
                      contentType="html"
                      theme="snow"
                      :toolbar="defaultToolbar"
                    />
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Add Assignee</label>
                  <a-select :options="RufAdmin" id="rufadmin" placeholder="Select" />
                </div>
              </div>
              <div class="col-12">
                <div class="mb-0">
                  <label class="form-label">Status</label>
                  <a-select :options="StatAdmin" id="statadmin" placeholder="Select" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add New Todo</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Todo -->

  <!-- Add Project -->
  <div class="modal fade" id="add_project" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div
          class="modal-header header-border align-items-center justify-content-between"
        >
          <div class="d-flex align-items-center">
            <h5 class="modal-title me-2">Add Project</h5>
            <p class="text-dark">Project ID : PRO-0004</p>
          </div>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="add-info-fieldset">
          <div class="add-details-wizard p-3 pb-0">
            <ul class="progress-bar-wizard d-flex align-items-center border-bottom">
              <li class="active p-2 pt-0">
                <h6 class="fw-medium">Basic Information</h6>
              </li>
              <li class="p-2 pt-0">
                <h6 class="fw-medium">Members</h6>
              </li>
            </ul>
          </div>
          <fieldset id="first-field-file">
            <form @submit.prevent="submitFormOne">
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-12">
                    <div
                      class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                    >
                      <div
                        class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames"
                      >
                        <i class="ti ti-photo text-gray-2 fs-16"></i>
                      </div>
                      <div class="profile-upload">
                        <div class="mb-2">
                          <h6 class="mb-1">Upload Project Logo</h6>
                          <p class="fs-12">Image should be below 4 mb</p>
                        </div>
                        <div class="profile-uploader d-flex align-items-center">
                          <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                            Upload
                            <input type="file" class="form-control image-sign" multiple />
                          </div>
                          <a href="javascript:void(0);" class="btn btn-light btn-sm"
                            >Cancel</a
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Project Name</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Client</label>
                      <a-select :options="BrAdmin" id="bradmin" placeholder="Select" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Start Date</label>
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
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">End Date</label>
                          <div class="input-icon-end position-relative">
                            <date-picker
                              v-model="startdateTwo"
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
                          <label class="form-label">Priority</label>
                          <a-select
                            :options="ProAdminOne"
                            id="proadminone"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Project Value</label>
                          <input type="text" class="form-control" value="$" />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Total Working Hours</label>
                          <div class="input-icon-end position-relative">
                            <input
                              type="text"
                              class="form-control timepicker"
                              placeholder="-- : -- : --"
                              value="02-05-2024"
                            />
                            <span class="input-icon-addon">
                              <i class="ti ti-clock-hour-3 text-gray-7"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Extra Time</label>
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-0">
                      <label class="form-label">Description</label>
                      <QuillEditor
                        v-model:content="editorData"
                        contentType="html"
                        theme="snow"
                        :toolbar="defaultToolbar"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <div class="d-flex align-items-center justify-content-end">
                  <button
                    type="button"
                    class="btn btn-outline-light border me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button class="btn btn-primary wizard-next-btn" type="button">
                    Add Team Member
                  </button>
                </div>
              </div>
            </form>
          </fieldset>
          <fieldset>
            <form @submit.prevent="submitFormOne">
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label me-2">Team Members</label>
                      <vue3-tags-input
                        class="input-tags form-control"
                        placeholder="Add new"
                        type="text"
                        data-role="tagsinput"
                        name="Label"
                        value="Tag1"
                        :tags="tags"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label me-2">Team Leader</label>

                      <vue3-tags-input
                        class="input-tags form-control"
                        placeholder="Add new"
                        type="text"
                        data-role="tagsinput"
                        name="Label"
                        value="Tag1"
                        :tags="tagsOne"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label me-2">Project Manager</label>
                      <vue3-tags-input
                        class="input-tags form-control"
                        placeholder="Add new"
                        type="text"
                        data-role="tagsinput"
                        name="Label"
                        value="Tag1"
                        :tags="tagsTwo"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Status</label>
                      <a-select :options="StaisTag" id="statag" placeholder="Select" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div>
                      <label class="form-label">Tags</label>
                      <a-select :options="MeduTag" id="medutag" placeholder="Select" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <div class="d-flex align-items-center justify-content-end">
                  <button
                    type="button"
                    class="btn btn-outline-light border me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn btn-primary"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#success_modal"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
  <!-- /Add Project -->

  <!-- Add Leaves -->
  <div class="modal fade" id="add_leaves">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Leave Request</h4>
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
                  <label class="form-label">Employee Name</label>
                  <a-select
                    :options="SmithAdmin"
                    id="smithadmin"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Leave Type</label>
                  <a-select
                    :options="LeaveAdmin"
                    id="leaveadmin"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">From </label>
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="startdateThree"
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
                  <label class="form-label">To </label>
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
                  <label class="form-label">No of Days</label>
                  <input type="text" class="form-control" disabled />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Remaining Days</label>
                  <input type="text" class="form-control" disabled />
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
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Leaves</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Leaves -->
</template>
<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

import { ref } from "vue";
const currentDate = ref(new Date());
const currentDateOne = ref(new Date());
const currentDateTwo = ref(new Date());
const currentDateThree = ref(new Date());
import { QuillEditor } from '@vueup/vue-quill';
import { defaultToolbar } from '@/config/quill.config';

import Vue3TagsInput from "vue3-tags-input";
export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  components: {
    Vue3TagsInput,
    QuillEditor,
  },
  data() {
    return {
      editorData: "",
      defaultToolbar,
      startdate: currentDate,
      startdateOne: currentDateOne,
      startdateTwo: currentDateTwo,
      startdateThree: currentDateThree,
      dateFormat: "dd-MM-yyyy",
      LeaveAdmin: ["Select", "Medical Leave", "Casual Leave", "Annual Leave"],
      SmithAdmin: ["Select", "Anthony Lewis", "Brian Villalobos", "Harvey Smith"],
      MeduTag: ["Select", "High", "Low", "Medium"],
      StaisTag: ["Select", "Active", "Inactive"],
      BrAdmin: ["Select", "Anthony Lewis", "Brian Villalobos"],
      StatAdmin: ["Select", "Completed", "Pending", "Onhold", "Inprogress"],
      RufAdmin: ["Select", "Sophie", "Cameron", "Doris", "Rufana"],
      ProAdmin: ["Select", "Medium", "High", "Low"],
      ProAdminOne: ["Select", "Medium", "High", "Low"],
      Admtag: ["Select", "Internal", "Projects", "Meetings", "Reminder"],
      tags: ["Jerald", "Andrew", "Philip", "Davis"],
      tagsOne: ["Hendry", "James"],
      tagsTwo: ["Dwight"],
    };
  },
  methods: {
    submitFormOne() {
      this.$router.push("/projects/projects-list");
    },
    submitForm() {
      this.$router.push("/dashboard/");
    },
  },
};
</script>

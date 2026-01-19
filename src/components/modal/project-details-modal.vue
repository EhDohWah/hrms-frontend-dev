<template>
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
            <form @submit.prevent="submitForm">
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
                      <vue-select
                        :options="AnthonLewis"
                        id="anthonlewis"
                        placeholder="Select"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Start Date</label>
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
                          <label class="form-label">End Date</label>
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
                          <label class="form-label">Priority</label>
                          <vue-select
                            :options="PriorLow"
                            id="lowpro"
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
                      <ckeditor
                        :editor="editor"
                        v-model="editorData"
                        :config="editorConfig"
                      ></ckeditor>
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
            <form @submit.prevent="submitForm">
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
                      <vue-select
                        :options="InactDet"
                        id="inactdet"
                        placeholder="Select"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div>
                      <label class="form-label">Tags</label>
                      <vue-select :options="TagsDet" id="tagsdet" placeholder="Select" />
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

  <!-- Edit Project -->
  <div class="modal fade" id="edit_project" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div
          class="modal-header header-border align-items-center justify-content-between"
        >
          <div class="d-flex align-items-center">
            <h5 class="modal-title me-2">Edit Project</h5>
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
          <fieldset id="second-field-file">
            <form @submit.prevent="submitForm">
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
                      <input
                        type="text"
                        class="form-control"
                        value="Office Management App"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Client</label>
                      <vue-select
                        :options="Lewsisa"
                        id="lewsisa"
                        placeholder="Anthony Lewis"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Start Date</label>
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
                          <label class="form-label">End Date</label>
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
                          <label class="form-label">Priority</label>
                          <vue-select
                            :options="HighProp"
                            id="highprop"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Project Value</label>
                          <input type="text" class="form-control" value="$100" />
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
                              value="02-05-1998"
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
                      <ckeditor
                        :editor="editor"
                        v-model="editorData"
                        :config="editorConfig"
                      ></ckeditor>
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
                    Edit Team Member
                  </button>
                </div>
              </div>
            </form>
          </fieldset>
          <fieldset>
            <form @submit.prevent="submitForm">
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
                      <vue-select
                        :options="StaDetail"
                        id="stadetail"
                        placeholder="Active"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div>
                      <label class="form-label">Tags</label>
                      <vue-select
                        :options="HighTagMed"
                        id="hightagmed"
                        placeholder="High"
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
                  <button class="btn btn-primary" type="button">Save</button>
                </div>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
  <!-- /Edit Project -->

  <!-- Add Project Success -->
  <div class="modal fade" id="success_modal" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-center p-3">
            <span class="avatar avatar-lg avatar-rounded bg-success mb-3"
              ><i class="ti ti-check fs-24"></i
            ></span>
            <h5 class="mb-2">Project Added Successfully</h5>
            <p class="mb-3">
              Stephan Peralt has been added with Client ID :
              <span class="text-primary">#pro - 0004</span>
            </p>
            <div>
              <div class="row g-2">
                <div class="col-6">
                  <router-link to="/projects/projects-list" class="btn btn-dark w-100"
                    >Back to List</router-link
                  >
                </div>
                <div class="col-6">
                  <router-link
                    to="/projects/projects-details"
                    class="btn btn-primary w-100"
                    >Detail Page</router-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Add Project Success -->

  <!-- Edit Todo -->
  <div class="modal fade" id="edit_todo">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Todo</h4>
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
                  <input
                    type="text"
                    class="form-control"
                    value="Update calendar and schedule"
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Tag</label>
                  <vue-select :options="InterSel" id="intersel" placeholder="Select" />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Priority</label>
                  <vue-select :options="Mediumpro" id="medipro" placeholder="Select" />
                </div>
              </div>
              <div class="col-lg-12">
                <div class="mb-3">
                  <label class="form-label">Descriptions</label>
                  <ckeditor
                    :editor="editor"
                    v-model="editorData"
                    :config="editorConfig"
                  ></ckeditor>
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Add Assignee</label>
                  <vue-select :options="Dorisel" id="dorisel" placeholder="Select" />
                </div>
              </div>
              <div class="col-12">
                <div class="mb-0">
                  <label class="form-label">Status</label>
                  <vue-select
                    :options="CompletedSel"
                    id="complesel"
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
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Todo -->

  <!-- Todo Details -->
  <div class="modal fade" id="view_todo">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-dark">
          <h4 class="modal-title text-white">Respond to any pending messages</h4>
          <span class="badge badge-danger d-inline-flex align-items-center"
            ><i class="ti ti-square me-1"></i>Urgent</span
          >
          <span><i class="ti ti-star-filled text-warning"></i></span>
          <a href="javascript:void(0);"><i class="ti ti-trash text-white"></i></a>
          <button
            type="button"
            class="btn-close custom-btn-close bg-transparent fs-16 text-white position-static"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <h5 class="mb-2">Task Details</h5>
          <div class="border rounded mb-3 p-2">
            <div class="row row-gap-3">
              <div class="col-md-4">
                <div class="text-center">
                  <span class="d-block mb-1">Created On</span>
                  <p class="text-dark">22 July 2025</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">
                  <span class="d-block mb-1">Due Date</span>
                  <p class="text-dark">22 July 2025</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">
                  <span class="d-block mb-1">Status</span>
                  <span class="badge badge-soft-success d-inline-flex align-items-center">
                    <i class="fas fa-circle fs-6 me-1"></i>Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <h5 class="mb-2">Description</h5>
            <p>
              Hiking is a long, vigorous walk, usually on trails or footpaths in the
              countryside. Walking for pleasure developed in Europe during the eighteenth
              century. Religious pilgrimages have existed much longer but they involve
              walking long distances for a spiritual purpose associated with specific
              religions and also we achieve inner peace while we hike at a local park.
            </p>
          </div>
          <div class="mb-3">
            <h5 class="mb-2">Tags</h5>
            <div class="d-flex align-items-center">
              <span class="badge badge-danger me-2">Internal</span>
              <span class="badge badge-success me-2">Projects</span>
              <span class="badge badge-secondary">Reminder</span>
            </div>
          </div>
          <div>
            <h5 class="mb-2">Assignee</h5>
            <div class="avatar-list-stacked avatar-group-sm">
              <span class="avatar avatar-rounded">
                <img
                  class="border border-white"
                  src="@/assets/img/profiles/avatar-23.jpg"
                  alt="img"
                />
              </span>
              <span class="avatar avatar-rounded">
                <img
                  class="border border-white"
                  src="@/assets/img/profiles/avatar-24.jpg"
                  alt="img"
                />
              </span>
              <span class="avatar avatar-rounded">
                <img
                  class="border border-white"
                  src="@/assets/img/profiles/avatar-25.jpg"
                  alt="img"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Todo Details -->

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
                  <vue-select :options="ProjSel" id="projsel" placeholder="Select" />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Priority</label>
                  <vue-select :options="SelecPros" id="selecpros" placeholder="Select" />
                </div>
              </div>
              <div class="col-lg-12">
                <div class="mb-3">
                  <label class="form-label">Descriptions</label>
                  <ckeditor
                    :editor="editor"
                    v-model="editorData"
                    :config="editorConfig"
                  ></ckeditor>
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Add Assignee</label>
                  <vue-select
                    :options="AssignSele"
                    id="assignsele"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-12">
                <div class="mb-0">
                  <label class="form-label">Status</label>
                  <vue-select :options="OnholdSel" id="onholdsel" placeholder="Select" />
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
            <router-link to="/projects/projects-details" class="btn btn-danger"
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
const currentDateTwo = ref(new Date());
const currentDateThree = ref(new Date());
import Vue3TagsInput from "vue3-tags-input";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  components: {
    Vue3TagsInput,
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: " ",
      editorConfig: {},
      startdate: currentDate,
      startdateOne: currentDateOne,
      startdateTwo: currentDateTwo,
      startdateThree: currentDateThree,
      dateFormat: "dd-MM-yyyy",
      tags: ["Jerald", "Andrew", "Philip", "Davis"],
      tagsOne: ["Hendry", "James"],
      tagsTwo: ["Dwight"],
      OnholdSel: ["Select", "Completed", "Pending", "Onhold", "Inprogress"],
      AssignSele: ["Select", "Sophie", "Cameron", "Doris", "Rufana"],
      SelecPros: ["Select", "Medium", "High", "Low"],
      ProjSel: ["Select", "Internal", "Projects", "Meetings", "Reminder"],
      CompletedSel: ["Select", "Complated", "Pending", "Onhold", "Inprogress"],
      Dorisel: ["Select", "SOphie", "Cameron", "Doris", "Rufana"],
      Mediumpro: ["Select", "High", "Medium", "Low"],
      InterSel: ["Select", "Internal", "Projects", "Meetings", "Reminder"],
      HighTagMed: ["Select", "High", "Low", "Medium"],
      StaDetail: ["Select", "Active", "Inactive"],
      HighProp: ["Select", "High", "Medium", "Low"],
      Lewsisa: ["Select", "Anthony Lewis", "Brian villalobos"],
      TagsDet: ["Select", "High", "Low", "Medium"],
      InactDet: ["Select", "Active", "Inactive"],
      PriorLow: ["Select", "High", "Low"],
      AnthonLewis: ["Select", "Anthony Lewis", "Brian Villalobos"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/projects/projects-list");
    },
  },
};
</script>

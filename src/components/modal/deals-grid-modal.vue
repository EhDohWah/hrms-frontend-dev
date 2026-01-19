<template>
  <!-- Add Deals -->
  <div class="modal fade" id="add_deals">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Deals</h4>
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
                    >Deal Name <span class="text-danger"> *</span></label
                  >
                  <vue-select :options="Konospk" id="konosk" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <label class="form-label"
                      >Pipeline <span class="text-danger"> *</span></label
                    >
                    <a
                      href="javascript:void(0);"
                      class="add-new text-primary"
                      data-bs-target="#add_pipeline"
                      data-bs-toggle="modal"
                      ><i class="ti ti-plus text-primary me-1"></i>Add New</a
                    >
                  </div>
                  <vue-select :options="Marketing" id="marketin" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Status <span class="text-danger"> *</span></label
                  >
                  <vue-select :options="OpenWi" id="openwi" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Deal Value <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Currency<span class="text-danger"> *</span></label
                  >
                  <vue-select :options="USDEuro" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Period <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Period Value <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Contact <span class="text-danger"> *</span></label
                  >
                  <vue3-tags-input
                    class="input-tags form-control"
                    placeholder="Add new"
                    type="text"
                    data-role="tagsinput"
                    name="Label"
                    value="Tag1"
                    :tags="Onetags"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Project <span class="text-danger"> *</span></label
                  >
                  <vue-select :options="offApp" id="offapp" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Due Date <span class="text-danger"> *</span>
                  </label>
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
                    >Expected Closing Date <span class="text-danger"> *</span>
                  </label>
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
                  <label class="form-label"
                    >Assignee <span class="text-danger"> *</span></label
                  >
                  <vue-select
                    :options="AssiInactive"
                    id="inactAss"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Tags <span class="text-danger"> *</span></label
                  >
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
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Followup Date <span class="text-danger"> *</span></label
                  >
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
                  <label class="form-label"
                    >Source <span class="text-danger"> *</span></label
                  >
                  <vue-select :options="MediaGoo" id="medigoo" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Priority <span class="text-danger"> *</span></label
                  >
                  <vue-select :options="HigloMed" id="highlomed" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Description <span class="text-danger"> *</span></label
                  >
                  <textarea class="form-control"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Deal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Deals -->

  <!-- Edit Deals -->
  <div class="modal fade" id="edit_deals">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Deals</h4>
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
                    >Deal Name <span class="text-danger"> *</span></label
                  >
                  <vue-select
                    :options="EditKonospk"
                    id="editkonosk"
                    placeholder="Collins"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <label class="form-label"
                      >Pipeline <span class="text-danger"> *</span></label
                    >
                    <a
                      href="javascript:void(0);"
                      class="add-new text-primary"
                      data-bs-target="#add_pipeline"
                      data-bs-toggle="modal"
                      ><i class="ti ti-plus text-primary me-1"></i>Add New</a
                    >
                  </div>
                  <vue-select
                    :options="EditMarketing"
                    id="editmarketin"
                    placeholder="Sales"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Status <span class="text-danger"> *</span></label
                  >
                  <vue-select :options="EditOpenWi" id="editopenwi" placeholder="Open" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Deal Value <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Currency<span class="text-danger"> *</span></label
                  >
                  <vue-select
                    :options="EditUSDEuro"
                    id="editusdeuro"
                    placeholder="Dollar"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Period <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Period Value <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Contact <span class="text-danger"> *</span></label
                  >
                  <vue-select
                    :options="EditRoyLeis"
                    id="editroyleis"
                    placeholder="Darlee Robertson"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Project * <span class="text-danger"> *</span></label
                  >
                  <vue-select
                    :options="EditoffApp"
                    id="editoffapp"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Due Date <span class="text-danger"> *</span>
                  </label>
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
                  <label class="form-label"
                    >Expected Closing Date <span class="text-danger"> *</span>
                  </label>
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="startdateFour"
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
                  <label class="form-label"
                    >Assignee <span class="text-danger"> *</span></label
                  >
                  <vue-select
                    :options="EditAssiInactive"
                    id="editinactAss"
                    placeholder="Active"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Tags <span class="text-danger"> *</span></label
                  >
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
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Followup Date <span class="text-danger"> *</span></label
                  >
                  <div class="input-icon-end position-relative">
                    <date-picker
                      v-model="startdateFive"
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
                    >Source <span class="text-danger"> *</span></label
                  >
                  <vue-select
                    :options="EditMediaGoo"
                    id="editmedigoo"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Priority <span class="text-danger"> *</span></label
                  >
                  <vue-select
                    :options="EditHigloMed"
                    id="edithighlomed"
                    placeholder="High"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Description <span class="text-danger"> *</span></label
                  >
                  <textarea class="form-control"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Deals -->

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
            <router-link to="/crm/deals-grid" class="btn btn-danger"
              >Yes, Delete</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->

  <!-- Add Pipeline -->
  <div class="modal fade" id="add_pipeline">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Pipeline</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitFormOne">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Pipeline Name <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="input-block mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <label class="form-label"
                      >Pipeline Stages <span class="text-danger"> *</span></label
                    >
                    <a
                      href="javascript:void(0);"
                      class="add-new text-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#add_stage"
                      ><i class="ti ti-plus text-primary me-1"></i>Add New</a
                    >
                  </div>
                  <div class="p-3 border border-gray br-5 mb-2">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <span class="me-2"><i class="ti ti-grip-vertical"></i></span>
                        <h6 class="fs-14 fw-normal">Inpipline</h6>
                      </div>
                      <div class="d-flex align-items-center">
                        <a href="javascript:void(0);" class="text-default"
                          ><span class="me-2"><i class="ti ti-edit"></i></span
                        ></a>
                        <a href="javascript:void(0);" class="text-default"
                          ><span><i class="ti ti-trash"></i></span
                        ></a>
                      </div>
                    </div>
                  </div>
                  <div class="p-3 border border-gray br-5 mb-2">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <span class="me-2"><i class="ti ti-grip-vertical"></i></span>
                        <h6 class="fs-14 fw-normal">Follow Up</h6>
                      </div>
                      <div class="d-flex align-items-center">
                        <a href="javascript:void(0);" class="text-default"
                          ><span class="me-2"><i class="ti ti-edit"></i></span
                        ></a>
                        <a href="javascript:void(0);" class="text-default"
                          ><span><i class="ti ti-trash"></i></span
                        ></a>
                      </div>
                    </div>
                  </div>
                  <div class="p-3 border border-gray br-5">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <span class="me-2"><i class="ti ti-grip-vertical"></i></span>
                        <h6 class="fs-14 fw-normal">Schedule Service</h6>
                      </div>
                      <div class="d-flex align-items-center">
                        <a href="javascript:void(0);" class="text-default"
                          ><span class="me-2"><i class="ti ti-edit"></i></span
                        ></a>
                        <a href="javascript:void(0);" class="text-default"
                          ><span><i class="ti ti-trash"></i></span
                        ></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Access</label>
                  <div class="d-flex access-item nav">
                    <div class="d-flex align-items-center">
                      <div
                        class="radio-btn d-flex align-items-center"
                        data-bs-toggle="tab"
                        data-bs-target="#all"
                      >
                        <input
                          type="radio"
                          class="status-radio me-2"
                          id="all"
                          name="status"
                          checked
                        />
                        <label for="all">All</label>
                      </div>
                      <div
                        class="radio-btn d-flex align-items-center"
                        data-bs-toggle="tab"
                        data-bs-target="#select-person"
                      >
                        <input
                          type="radio"
                          class="status-radio me-2"
                          id="select"
                          name="status"
                        />
                        <label for="select">Select Person</label>
                      </div>
                    </div>
                  </div>
                  <div class="tab-content">
                    <div class="tab-pane fade" id="select-person">
                      <div class="access-wrapper">
                        <div class="p-3 border border-gray br-5 mb-2">
                          <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center file-name-icon">
                              <a
                                href="javascript:void(0);"
                                class="avatar avatar-md border avatar-rounded"
                              >
                                <img
                                  src="@/assets/img/profiles/avatar-20.jpg"
                                  class="img-fluid"
                                  alt="img"
                                />
                              </a>
                              <div class="ms-2">
                                <h6 class="fw-medium">
                                  <a href="javascript:void(0);">Sharon Roy</a>
                                </h6>
                              </div>
                            </div>
                            <div class="d-flex align-items-center">
                              <a href="javascript:void(0);" class="text-danger">Remove</a>
                            </div>
                          </div>
                        </div>
                        <div class="p-3 border border-gray br-5 mb-2">
                          <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center file-name-icon">
                              <a
                                href="javascript:void(0);"
                                class="avatar avatar-md border avatar-rounded"
                              >
                                <img
                                  src="@/assets/img/profiles/avatar-21.jpg"
                                  class="img-fluid"
                                  alt="img"
                                />
                              </a>
                              <div class="ms-2">
                                <h6 class="fw-medium">
                                  <a href="javascript:void(0);">Sharon Roy</a>
                                </h6>
                              </div>
                            </div>
                            <div class="d-flex align-items-center">
                              <a href="javascript:void(0);" class="text-danger">Remove</a>
                            </div>
                          </div>
                        </div>
                      </div>
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
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#pipeline-access"
            >
              Add Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Pipeline -->

  <!-- Add New Stage -->
  <div class="modal fade" id="add_stage">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Stage</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitFormOne">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Stage Name <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Stage</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add New Stage -->
</template>
<script>
import { ref } from "vue";
const currentDate = ref(new Date());
const currentDateOne = ref(new Date());
const currentDateTwo = ref(new Date());
const currentDateThree = ref(new Date());
const currentDateFour = ref(new Date());
const currentDateFive = ref(new Date());
import Vue3TagsInput from "vue3-tags-input";
export default {
  components: {
    Vue3TagsInput,
  },
  data() {
    return {
      startdate: currentDate,
      startdateOne: currentDateOne,
      startdateTwo: currentDateTwo,
      startdateThree: currentDateThree,
      startdateFour: currentDateFour,
      startdateFive: currentDateFive,
      dateFormat: "dd-MM-yyyy",
      tagsOne: ["Collab", , "Rated"],
      tags: ["Collab", "Rated"],
      Onetags: ["Vaughan Lewis"],
      Konospk: ["Select", "Collins", "Konopelski", "Adams"],
      Marketing: ["Select", "Sales", "Marketing", "Calls"],
      OpenWi: ["Select", "Open", "Won", "Lost"],
      USDEuro: ["Select", "USD", "Euro"],
      RoyLeis: ["Select", "Darlee Robertson", "Sharon Roy", "Vaughan Lewis"],
      offApp: [
        "Select",
        "Office Management App",
        "Clinic Management",
        "Educational Plaform",
      ],
      AssiInactive: ["Select", "Active", "Inactive"],
      EditKonospk: ["Select", "Collins", "Konopelski", "Adams"],
      EditMarketing: ["Select", "Sales", "Marketing", "Calls"],
      EditOpenWi: ["Select", "Open", "Won", "Lost"],
      EditUSDEuro: ["Select", "USD", "Euro"],
      EditRoyLeis: ["Select", "Darlee Robertson", "Sharon Roy", "Vaughan Lewis"],
      EditoffApp: [
        "Select",
        "Office Management App",
        "Clinic Management",
        "Educational Plaform",
      ],
      EditAssiInactive: ["Select", "Active", "Inactive"],
      EditMediaGoo: ["Select", "Google", "Social Media"],
      MediaGoo: ["Select", "Google", "Social Media"],
      EditHigloMed: ["Select", "High", "Low", "Medium"],
      HigloMed: ["Select", "High", "Low", "Medium"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/crm/deals-grid");
    },
    submitFormOne() {
      this.$router.push("/crm/pipeline");
    },
  },
};
</script>

<template>
  <!-- Add Company -->
  <div class="modal fade" id="add_company">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Company</h4>
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
                <div
                  class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                >
                  <div
                    class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames"
                  >
                    <img
                      src="@/assets/img/profiles/avatar-30.jpg"
                      alt="img"
                      class="rounded-circle"
                    />
                  </div>
                  <div class="profile-upload">
                    <div class="mb-2">
                      <h6 class="mb-1">Upload Profile Image</h6>
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
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Name <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Account URL</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Phone Number <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Website</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Password <span class="text-danger"> *</span></label
                  >
                  <div class="pass-group">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="pass-input form-control"
                    />
                    <span
                      @click="toggleShow"
                      class="ti toggle-password"
                      :class="{
                        'ti-eye': showPassword,
                        'ti-eye-off': !showPassword,
                      }"
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Confirm Password <span class="text-danger"> *</span></label
                  >
                  <div class="pass-group">
                    <input
                      :type="showPassword1 ? 'text' : 'password'"
                      class="pass-inputs form-control"
                    />
                    <span
                      @click="toggleShow1"
                      class="ti toggle-passwords"
                      :class="{
                        'ti-eye': showPassword1,
                        'ti-eye-off': !showPassword1,
                      }"
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Address</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Plan Name <span class="text-danger"> *</span></label
                  >
                  <a-select :options="AdvanSelc" id="advanselc" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Plan Type <span class="text-danger"> *</span></label
                  >
                  <a-select :options="SelMonth" id="selmonth" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Currency <span class="text-danger"> *</span></label
                  >
                  <a-select :options="DollarSel" id="dollarsel" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Language <span class="text-danger"> *</span></label
                  >
                  <a-select
                    :options="EnglishSele"
                    id="englishsele"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <a-select
                    :options="InActiveSele"
                    id="inactivesele"
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
            <button type="submit" class="btn btn-primary">Add Company</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Company -->

  <!-- Edit Company -->
  <div class="modal fade" id="edit_company">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Company</h4>
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
                <div
                  class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                >
                  <div
                    class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames"
                  >
                    <img
                      src="@/assets/img/profiles/avatar-30.jpg"
                      alt="img"
                      class="rounded-circle"
                    />
                  </div>
                  <div class="profile-upload">
                    <div class="mb-2">
                      <h6 class="mb-1">Upload Profile Image</h6>
                      <p class="fs-12">Image should be below 4 mb</p>
                    </div>
                    <div class="profile-uploader d-flex align-items-center">
                      <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                        Upload
                        <input type="file" class="form-control image-sign" multiple="" />
                      </div>
                      <a href="javascript:void(0);" class="btn btn-light btn-sm"
                        >Cancel</a
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Name <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" value="Stellar Dynamics" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-control" value="sophie@example.com" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Account URL</label>
                  <input type="text" class="form-control" value="sd.example.com" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Phone Number <span class="text-danger"> *</span></label
                  >
                  <input type="text" class="form-control" value="+1 895455450" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Website</label>
                  <input type="text" class="form-control" value="Admin Website" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Password <span class="text-danger"> *</span></label
                  >
                  <div class="pass-group">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="pass-input form-control"
                    />
                    <span
                      @click="toggleShow"
                      class="ti toggle-password"
                      :class="{
                        'ti-eye': showPassword,
                        'ti-eye-off': !showPassword,
                      }"
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Confirm Password <span class="text-danger"> *</span></label
                  >
                  <div class="pass-group">
                    <input
                      :type="showPassword1 ? 'text' : 'password'"
                      class="pass-inputs form-control"
                    />
                    <span
                      @click="toggleShow1"
                      class="ti toggle-passwords"
                      :class="{
                        'ti-eye': showPassword1,
                        'ti-eye-off': !showPassword1,
                      }"
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Address</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Plan Name <span class="text-danger"> *</span></label
                  >
                  <a-select
                    :options="EditAdvanSelc"
                    id="editadvanselc"
                    placeholder="Advanced"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Plan Type <span class="text-danger"> *</span></label
                  >
                  <a-select
                    :options="EditSelMonth"
                    id="editselmonth"
                    placeholder="Monthly"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Currency <span class="text-danger"> *</span></label
                  >
                  <a-select
                    :options="EditDollarSel"
                    id="editdollarsel"
                    placeholder="Dollar"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Language <span class="text-danger"> *</span></label
                  >
                  <a-select
                    :options="EditEnglishSele"
                    id="editenglishsele"
                    placeholder="English"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <a-select
                    :options="EditInActiveSele"
                    id="editinactivesele"
                    placeholder="Active"
                  />
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
  <!-- /Edit Company -->

  <!-- Add Note -->
  <div class="modal fade" id="add_notes" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div
          class="modal-header header-border align-items-center justify-content-between"
        >
          <h5 class="modal-title">Add New Note</h5>
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
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Title <span class="text-danger"> *</span></label>
              <input class="form-control" type="text" />
            </div>
            <div class="mb-3">
              <label class="form-label">Note <span class="text-danger"> *</span></label>
              <textarea class="form-control" rows="4"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label"
                >Attachment <span class="text-danger"> *</span></label
              >
              <div
                class="d-flex align-items-center justify-content-center border border-dashed rounded p-3 flex-column"
              >
                <span class="avatar avatar-lg avatar-rounded bg-primary-transparent mb-2"
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
            <div class="mb-0">
              <label class="form-label">Uploaded Files</label>
              <div class="border bg-light-500 rounded mb-3 p-3">
                <h6 class="fw-medium mb-1">Projectneonals teyys.xls</h6>
                <p class="mb-2">4.25 MB</p>
                <div class="progress progress-xs mb-2">
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    style="width: 45%"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <p>45%</p>
              </div>
              <div
                class="d-flex align-items-center justify-content-between bg-light-500 rounded p-3"
              >
                <div>
                  <h6 class="fw-medium mb-1">tes.txt</h6>
                  <p>1.2 MB</p>
                </div>
                <a href="javascript:void(0);" class="btn btn-sm btn-icon text-danger"
                  ><i class="ti ti-trash fs-20"></i
                ></a>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="d-flex align-items-center justify-content-end m-0">
              <button type="button" class="btn btn-outline-light border me-2">
                Cancel
              </button>
              <button class="btn btn-primary" type="submit">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Note -->

  <!-- Add Call -->
  <div class="modal fade" id="add_call" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div
          class="modal-header header-border align-items-center justify-content-between"
        >
          <h5 class="modal-title">Create Call Log</h5>
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
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Status <span class="text-danger"> *</span></label
                  >
                  <a-select :options="WrongNumb" id="wrongnumb" placeholder="Busy" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Followup Date <span class="text-danger"> *</span></label
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
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Note <span class="text-danger"> *</span></label
                  >
                  <textarea class="form-control" rows="3"></textarea>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="check" />
                  <label class="form-check-label" for="check">
                    Create a follow up task
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="d-flex align-items-center justify-content-end m-0">
              <button type="button" class="btn btn-outline-light border me-2">
                Cancel
              </button>
              <button class="btn btn-primary" type="submit">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Call -->

  <!-- Create File -->
  <div class="modal fade" id="create_file" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div
          class="modal-header header-border align-items-center justify-content-between"
        >
          <h5 class="modal-title">Create New File</h5>
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
                <h6 class="fw-medium">Add Recipient</h6>
              </li>
            </ul>
          </div>
          <fieldset id="first-field-file">
            <form @submit.prevent="submitFormOne">
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label"
                        >Choose Deal <span class="text-danger"> *</span></label
                      >
                      <a-select :options="Wisozk" id="wiso" placeholder="Select" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Document Type <span class="text-danger"> *</span></label
                      >
                      <a-select :options="Quote" id="quote" placeholder="Select" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Owner <span class="text-danger"> *</span></label
                      >
                      <a-select :options="Jackson" id="jackson" placeholder="Select" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Title <span class="text-danger"> *</span></label
                      >
                      <input class="form-control" type="text" placeholder="Enter Name" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="input-block mb-3">
                      <label class="form-label"
                        >Locale <span class="text-danger"> *</span></label
                      >
                      <a-select :options="Enes" id="ense" placeholder="Select" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Username <span class="text-danger"> *</span></label
                      >
                      <input class="form-control" type="text" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Email <span class="text-danger"> *</span></label
                      >
                      <input class="form-control" type="text" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Password <span class="text-danger"> *</span></label
                      >
                      <div class="pass-group">
                        <input
                          :type="showPassword ? 'text' : 'password'"
                          class="pass-input form-control"
                        />
                        <span
                          @click="toggleShow"
                          class="ti toggle-password"
                          :class="{
                            'ti-eye': showPassword,
                            'ti-eye-off': !showPassword,
                          }"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Confirm Password <span class="text-danger"> *</span></label
                      >
                      <div class="pass-group">
                        <input
                          :type="showPassword1 ? 'text' : 'password'"
                          class="pass-inputs form-control"
                        />
                        <span
                          @click="toggleShow1"
                          class="ti toggle-passwords"
                          :class="{
                            'ti-eye': showPassword1,
                            'ti-eye-off': !showPassword1,
                          }"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Phone Number <span class="text-danger"> *</span></label
                      >
                      <input class="form-control" type="text" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Company</label>
                      <input class="form-control" type="text" />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="bg-light-500 rounded p-3 pb-0 mb-3">
                      <h4>Signature</h4>
                      <ul class="nav">
                        <li class="nav-item form-check form-check-md mb-2">
                          <span data-bs-toggle="tab" data-bs-target="#nosign">
                            <input
                              type="radio"
                              class="form-check-input mt-2"
                              id="sign1"
                              name="email"
                            />
                            <label for="sign1" class="form-check-label"
                              ><span class="d-block fw-medium text-dark mb-1"
                                >No Signature</span
                              >This document does not require a signature before
                              acceptance.</label
                            >
                          </span>
                        </li>
                        <li class="nav-item form-check form-check-md mb-2">
                          <span
                            class="active mb-0"
                            data-bs-toggle="tab"
                            data-bs-target="#use-esign"
                          >
                            <input
                              type="radio"
                              class="form-check-input mt-2"
                              id="sign2"
                              name="email"
                              checked
                            />
                            <label for="sign2" class="form-check-label"
                              ><span class="d-block fw-medium text-dark mb-1"
                                >Use e-signature</span
                              >This document require e-signature before acceptance.</label
                            >
                          </span>
                        </li>
                      </ul>
                      <div class="tab-content">
                        <div class="tab-pane fade" id="nosign"></div>
                        <div class="tab-pane show active" id="use-esign">
                          <div class="mb-0">
                            <label class="form-label"
                              >Document Signers <span class="text-danger"> *</span></label
                            >
                          </div>
                          <div class="sign-content">
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <input class="form-control" type="text" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="d-flex align-items-center mb-3">
                                  <div class="flex-fill me-2">
                                    <input class="form-control" type="text" />
                                  </div>
                                  <div>
                                    <a
                                      href="javascript:void(0);"
                                      class="btn btn-icon btn-sm add-sign text-primary"
                                      ><i class="ti ti-circle-plus"></i
                                    ></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div>
                      <label class="form-label"
                        >Content <span class="text-danger"> *</span></label
                      >
                      <textarea
                        class="form-control"
                        rows="3"
                        placeholder="Add Content"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <div class="d-flex align-items-center justify-content-end">
                  <button type="button" class="btn btn-outline-light border me-2">
                    Cancel
                  </button>
                  <button class="btn btn-primary wizard-next-btn" type="button">
                    Next
                  </button>
                </div>
              </div>
            </form>
          </fieldset>
          <fieldset>
            <form @submit.prevent="submitFormOne">
              <div class="modal-body">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="bg-light-500 rounded p-3 pb-0 mb-3">
                      <h4>Signature</h4>
                      <ul class="nav">
                        <li class="nav-item form-check form-check-md mb-2">
                          <span data-bs-toggle="tab" data-bs-target="#nosign2">
                            <input
                              type="radio"
                              class="form-check-input mt-2"
                              id="sign3"
                              name="email"
                            />
                            <label for="sign3" class="form-check-label"
                              ><span class="d-block fw-medium text-dark mb-1"
                                >No Signature</span
                              >This document does not require a signature before
                              acceptance.</label
                            >
                          </span>
                        </li>
                        <li class="nav-item form-check form-check-md mb-2">
                          <span
                            class="active mb-0"
                            data-bs-toggle="tab"
                            data-bs-target="#use-esign2"
                          >
                            <input
                              type="radio"
                              class="form-check-input mt-2"
                              id="sign4"
                              name="email"
                              checked
                            />
                            <label for="sign4" class="form-check-label"
                              ><span class="d-block fw-medium text-dark mb-1"
                                >Use e-signature</span
                              >This document require e-signature before acceptance.</label
                            >
                          </span>
                        </li>
                      </ul>
                      <div class="tab-content">
                        <div class="tab-pane fade" id="nosign2"></div>
                        <div class="tab-pane show active" id="use-esign2">
                          <div class="mb-0">
                            <label class="form-label"
                              >Document Signers <span class="text-danger"> *</span></label
                            >
                          </div>
                          <div class="sign-content">
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <input class="form-control" type="text" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="d-flex align-items-center mb-3">
                                  <div class="flex-fill me-2">
                                    <input class="form-control" type="text" />
                                  </div>
                                  <div>
                                    <a
                                      href="javascript:void(0);"
                                      class="btn btn-icon btn-sm add-sign text-primary"
                                      ><i class="ti ti-circle-plus"></i
                                    ></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="mb-3">
                      <label class="form-label"
                        >Message Subject <span class="text-danger"> *</span></label
                      >
                      <input class="form-control" type="text" />
                    </div>
                    <div class="mb-3">
                      <label class="form-label"
                        >Message Text <span class="text-danger"> *</span></label
                      >
                      <textarea class="form-control" rows="3"></textarea>
                    </div>
                    <button type="button" class="btn btn-dark mb-3">Send Now</button>
                    <div class="border border-success bg-success-transparent p-3 rounded">
                      <p class="d-flex align-items-center">
                        <i class="ti ti-circle-check fs-24 me-2"></i> Document Sent
                        successfully to the Selected Recipients
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <div class="d-flex align-items-center justify-content-end">
                  <button type="button" class="btn btn-outline-light border me-2">
                    Cancel
                  </button>
                  <button class="btn btn-primary" type="button" data-bs-dismiss="modal">
                    Save & Next
                  </button>
                </div>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
  <!-- /Create File -->

  <!-- Connect Account -->
  <div class="modal fade" id="connect_account" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div
          class="modal-header header-border align-items-center justify-content-between"
        >
          <h5 class="modal-title">Connect Account</h5>
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
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Account Type <span class="text-danger"> *</span></label
                  >
                  <a-select :options="Imap" id="imap" placeholder="select" />
                </div>
              </div>
              <div class="col-md-12">
                <div>
                  <p class="text-dark fw-medium mb-2">Sync emails from</p>
                  <div class="form-check form-check-md mb-2">
                    <input
                      type="radio"
                      class="form-check-input"
                      id="email_1"
                      name="email"
                    />
                    <label for="email_1" class="form-check-label text-dark">Now</label>
                  </div>
                  <div class="form-check form-check-md mb-2">
                    <input
                      type="radio"
                      class="form-check-input"
                      id="email_2"
                      name="email"
                    />
                    <label for="email_2" class="form-check-label text-dark"
                      >1 month ago</label
                    >
                  </div>
                  <div class="form-check form-check-md mb-2">
                    <input
                      type="radio"
                      class="form-check-input"
                      id="email_3"
                      name="email"
                    />
                    <label for="email_3" class="form-check-label text-dark"
                      >3 months ago</label
                    >
                  </div>
                  <div class="form-check form-check-md">
                    <input
                      type="radio"
                      class="form-check-input"
                      id="email_4"
                      name="email"
                    />
                    <label for="email_4" class="form-check-label text-dark"
                      >6 months ago</label
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="d-flex align-items-center justify-content-end m-0">
              <button
                class="btn btn-outline-light border me-2"
                type="button"
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
                Connect Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Connect Account -->

  <!-- Connect Account Success -->
  <div class="modal fade" id="success_modal" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-center p-3">
            <span class="avatar avatar-lg avatar-rounded bg-success mb-3"
              ><i class="ti ti-check fs-24"></i
            ></span>
            <h5 class="mb-2">Email Connected Successfully!!!</h5>
            <p class="mb-3">
              Email Account is configured with
              <span class="d-block text-dark">“example@example.com”. </span>
              Now you can access email.
            </p>
            <router-link to="/applications/email" class="btn btn-primary w-100"
              >Go to Email</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Connect Account Success -->

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
        <form @submit.prevent="submitFormTwo">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Deal Name <span class="text-danger"> *</span></label
                  >
                  <a-select :options="Collins" id="collins" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <label class="form-label"
                      >Pipeline <span class="text-danger"> *</span></label
                    >
                    <a href="javascript:void(0);" class="add-new text-primary"
                      ><i class="ti ti-plus text-primary me-1"></i>Add New</a
                    >
                  </div>
                  <a-select :options="Selectsal" id="selectsal" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Status <span class="text-danger"> *</span></label
                  >
                  <a-select :options="OpenSelec" id="openselec" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Deal Value <span class="text-danger"> *</span></label
                  >
                  <a-select :options="Amountsel" id="amountsel" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label"
                    >Currency<span class="text-danger"> *</span></label
                  >
                  <a-select
                    :options="SeleCurent"
                    id="selecurent"
                    placeholder="Select"
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
                  <a-select :options="Darleesh" id="darleesh" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Project * <span class="text-danger"> *</span></label
                  >
                  <a-select :options="Office" id="officeman" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Due Date <span class="text-danger"> *</span>
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
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Expected Closing Date <span class="text-danger"> *</span>
                  </label>
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
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label"
                    >Assignee <span class="text-danger"> *</span></label
                  >
                  <a-select
                    :options="CompaniesStat"
                    id="compasel"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Tags <span class="text-danger"> *</span></label
                  >
                  <a-select
                    :options="PromotionSel"
                    id="promotionsel"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Followup Date <span class="text-danger">*</span></label
                  >
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
                    >Source <span class="text-danger"> *</span></label
                  >
                  <a-select :options="BarrySel" id="barrysel" plaecholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Priority <span class="text-danger"> *</span></label
                  >
                  <a-select :options="HighSel" id="higtsel" placeholder="Select" />
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
</template>
<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

import { ref } from "vue";
const currentDate = ref(new Date());
const currentDateOne = ref(new Date());
const currentDateTwo = ref(new Date());
const currentDateThree = ref(new Date());
export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      showPassword: false,
      showPassword1: false,
      startdate: currentDate,
      startdateOne: currentDateOne,
      startdateTwo: currentDateTwo,
      startdateThree: currentDateThree,
      dateFormat: "dd-MM-yyyy",
      Collins: ["Select", "Collins", "Konopelsski", "Admas"],
      SeleCurent: ["Select", "$4,50,000", "$3,15,000", "$8,40,000"],
      Amountsel: ["$4,50,000", "$3,15,000", "$8,40,000"],
      OpenSelec: ["Select", "Open", "Won", "Lost"],
      Selectsal: ["Select", "Sales", "Marketing", "Calls"],
      Darleesh: ["Select", "Darlee Robertson", "Sharon Roy", "Vaughan Lewis"],
      Office: [
        "Select",
        "Office Management App",
        "Clinic Management",
        "Education platform",
      ],
      CompaniesStat: ["Select", "Active", "Inactive"],
      PromotionSel: ["Select", "Promotion", "Collab", "Rated"],
      BarrySel: ["Select", "Barry Cuda", "Tressa Wexler"],
      HighSel: ["Select", "High", "Low", "Medium"],
      AdvanSelc: ["Select", "Advanced", "Basic", "Enterprise"],
      SelMonth: ["Select", "Monthly", "Yearly"],
      DollarSel: ["Select", "Dollar", "Euro"],
      EnglishSele: ["Select", "English", "Chinese"],
      InActiveSele: ["Select", "Active", "Inactive"],
      EditAdvanSelc: ["Select", "Advanced", "Basic", "Enterprise"],
      EditSelMonth: ["Select", "Monthly", "Yearly"],
      EditDollarSel: ["Select", "Dollar", "Euro"],
      EditEnglishSele: ["Select", "English", "Chinese"],
      EditInActiveSele: ["Select", "Active", "Inactive"],
      WrongNumb: ["Busy", "Unavailable", "No Answer", "Wrong Number"],
      Enes: ["Select", "en", "es", "ru"],
      Jackson: ["Select", "Admin", "Jackson Daniel"],
      Quote: ["Select", "Contract", "Proposal", "Quote"],
      Wisozk: ["Select", "Collins", "Wisozk", "Walter"],
      Imap: ["Select", "Gamil", "Outlook", "Imap"],
    };
  },
  methods: {
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    toggleShow1() {
      this.showPassword1 = !this.showPassword1;
    },
    submitForm() {
      this.$router.push("/super-admin/companies");
    },
    submitFormOne() {
      this.$router.push("/crm/companies-details");
    },
    submitFormTwo() {
      this.$router.push("/crm/deals-grid");
    },
  },
  computed: {
    buttonLabel() {
      return this.showPassword ? "Hide" : "Show";
    },
    buttonLabel1() {
      return this.showPassword1 ? "Hide" : "Show";
    },
  },
};
</script>

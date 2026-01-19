<template>
  <!-- Add Client -->
  <div class="modal fade" id="add_client">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Client</h4>
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
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="info-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#basic-info"
                  type="button"
                  role="tab"
                  aria-selected="true"
                >
                  Basic Information
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="address-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#address"
                  type="button"
                  role="tab"
                  aria-selected="false"
                >
                  Permissions
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="myTabContent">
            <div
              class="tab-pane fade show active"
              id="basic-info"
              role="tabpanel"
              aria-labelledby="info-tab"
              tabindex="0"
            >
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div
                      class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                    >
                      <div
                        class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames"
                      >
                        <i class="ti ti-photo"></i>
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
                        >First Name <span class="text-danger"> *</span></label
                      >
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Last Name</label>
                      <input type="email" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Username <span class="text-danger"> *</span></label
                      >
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Password <span class="text-danger"> *</span></label
                      >
                      <div class="pass-group">
                        <input type="password" class="pass-input form-control" />
                        <span class="ti toggle-password ti-eye-off"></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Confirm Password <span class="text-danger"> *</span></label
                      >
                      <div class="pass-group">
                        <input type="password" class="pass-inputs form-control" />
                        <span class="ti toggle-passwords ti-eye-off"></span>
                      </div>
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
                      <label class="form-label">Company</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-outline-light border me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                  Save
                </button>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="address"
              role="tabpanel"
              aria-labelledby="address-tab"
              tabindex="0"
            >
              <div class="modal-body pb-0">
                <div class="card bg-light-500 shadow-none">
                  <div
                    class="card-body d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                  >
                    <h6>Enable Options</h6>
                    <div class="d-flex align-items-center justify-content-end">
                      <div class="form-check form-check-md form-switch me-2">
                        <label class="form-check-label mt-0">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                          />
                          Enable all Module
                        </label>
                      </div>
                      <div class="form-check form-check-md d-flex align-items-center">
                        <label class="form-check-label mt-0">
                          <input class="form-check-input" type="checkbox" checked="" />
                          Select All
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="table-responsive permission-table border rounded">
                  <table class="table">
                    <tbody>
                      <tr>
                        <td>
                          <div class="form-check form-check-md form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                                checked
                              />
                              Holidays
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                checked=""
                              />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-check-md form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Leaves
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-check-md form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Clients
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-check-md form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Projects
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-check-md form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Tasks
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-check-md form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Chats
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-check-md form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Assets
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-check-md form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Timing Sheets
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check form-check-md d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-outline-light border me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#success_modal"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Client -->

  <!-- Edit Client -->
  <div class="modal fade" id="edit_client">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Client</h4>
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
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab2" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="info-tab2"
                  data-bs-toggle="tab"
                  data-bs-target="#basic-info2"
                  type="button"
                  role="tab"
                  aria-selected="true"
                >
                  Basic Information
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="address-tab2"
                  data-bs-toggle="tab"
                  data-bs-target="#address2"
                  type="button"
                  role="tab"
                  aria-selected="false"
                >
                  Permissions
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="myTabContent2">
            <div
              class="tab-pane fade show active"
              id="basic-info2"
              role="tabpanel"
              aria-labelledby="info-tab2"
              tabindex="0"
            >
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div
                      class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                    >
                      <div
                        class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames"
                      >
                        <i class="ti ti-photo"></i>
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
                        >First Name <span class="text-danger"> *</span></label
                      >
                      <input type="text" class="form-control" value="Michael" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Last Name</label>
                      <input type="email" class="form-control" value="Walker" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Username <span class="text-danger"> *</span></label
                      >
                      <input type="text" class="form-control" value="Michael Walker" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input
                        type="text"
                        class="form-control"
                        value="michael@example.com"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Password <span class="text-danger"> *</span></label
                      >
                      <div class="pass-group">
                        <input
                          type="password"
                          class="pass-input form-control"
                          value="1234"
                        />
                        <span class="ti toggle-password ti-eye-off"></span>
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
                          type="password"
                          class="pass-inputs form-control"
                          value="1234"
                        />
                        <span class="ti toggle-passwords ti-eye-off"></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label"
                        >Phone Number <span class="text-danger"> *</span></label
                      >
                      <input type="text" class="form-control" value="(163) 2459 315" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Company</label>
                      <input
                        type="text"
                        class="form-control"
                        value="BrightWave Innovations"
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label"
                        >Address <span class="text-danger"> *</span></label
                      >
                      <input type="text" class="form-control" value="" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-outline-light border me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="address2"
              role="tabpanel"
              aria-labelledby="address-tab2"
              tabindex="0"
            >
              <div class="modal-body pb-0">
                <div class="card bg-light-500 shadow-none">
                  <div
                    class="card-body d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                  >
                    <h6>Enable Options</h6>
                    <div class="d-flex align-items-center justify-content-end">
                      <div class="form-check form-switch me-2">
                        <label class="form-check-label mt-0">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                          />
                          Enable all Module
                        </label>
                      </div>
                      <div class="form-check d-flex align-items-center">
                        <label class="form-check-label mt-0">
                          <input class="form-check-input" type="checkbox" checked />
                          Select All
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="table-responsive border rounded">
                  <table class="table">
                    <tbody>
                      <tr>
                        <td>
                          <div class="form-check form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                                checked
                              />
                              Holidays
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" checked />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Leaves
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Clients
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Projects
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Tasks
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Chats
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Assets
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="form-check form-switch me-2">
                            <label class="form-check-label mt-0">
                              <input
                                class="form-check-input me-2"
                                type="checkbox"
                                role="switch"
                              />
                              Timing Sheets
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Read
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Write
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Create
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Delete
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Import
                            </label>
                          </div>
                        </td>
                        <td>
                          <div class="form-check d-flex align-items-center">
                            <label class="form-check-label mt-0">
                              <input class="form-check-input" type="checkbox" />
                              Export
                            </label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-outline-light border me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Client -->

  <!-- Add Client Success -->
  <div class="modal fade" id="success_modal" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-center p-3">
            <span class="avatar avatar-lg avatar-rounded bg-success mb-3"
              ><i class="ti ti-check fs-24"></i
            ></span>
            <h5 class="mb-2">Client Added Successfully</h5>
            <p class="mb-3">
              Stephan Peralt has been added with Client ID :
              <span class="text-primary">#CLT - 0024</span>
            </p>
            <div>
              <div class="row g-2">
                <div class="col-6">
                  <router-link to="/projects/clients" class="btn btn-dark w-100"
                    >Back to List</router-link
                  >
                </div>
                <div class="col-6">
                  <router-link
                    to="/projects/clients-details"
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
  <!-- /Add Client Success -->

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
            <router-link to="/projects/clients" class="btn btn-danger"
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
export default {
  data() {
    return {};
  },
  methods: {
    submitForm() {
      this.$router.push("/projects/clients");
    },
  },
};
</script>

<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      Leavetype: ["Select", "Medical Leave", "Casual Leave", "Annual Leave"],
      Addemployee: ["Sophie", "Cameron", "Doris", "Rufana", "Michael"],
      Addemp: ["Select", "Sophie", "Cameron", "Doris"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/leave/admin/leaves-admin");
    },
  },
};
</script>

<template>
  <!-- New Custom Policy -->
  <div class="modal fade" id="new_custom_policy">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">New Custom Policy</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Leave Type</label>
                  <a-select :options="Leavetype" id="leave-setting-type" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Policy Name</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">No of Days</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Add Employee</label>
                  <select class="select-img">
                    <option data-image="assets/img/users/user-40.jpg" selected>
                      Sophie
                    </option>
                    <option data-image="assets/img/users/user-58.jpg">Cameron</option>
                    <option data-image="assets/img/users/user-42.jpg">Doris</option>
                    <option data-image="assets/img/users/user-10.jpg">Rufana</option>
                    <option data-image="assets/img/users/user-39.jpg">Michael</option>
                  </select>
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
  <!-- /New Custom Policy -->

  <!-- Annual Leave -->
  <div class="modal fade" id="annual_leave_settings">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Annual Leave Settings</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="settings-tab" data-bs-toggle="tab" data-bs-target="#settings-info"
                  type="button" role="tab" aria-selected="true">
                  Settings
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="viwe-custom-policy-tab" data-bs-toggle="tab" data-bs-target="#policy"
                  type="button" role="tab" aria-selected="false">
                  View Custom Policy
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="settings-info" role="tabpanel" aria-labelledby="settings-tab"
              tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">No of Days</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Carry Forward</label>
                      <div class="d-flex align-items-center">
                        <div class="form-check me-2">
                          <input class="form-check-input" type="radio" name="flexRadio" id="flexRadio" checked="" />
                          <label class="form-label" for="flexRadio"> Yes </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadio" id="flexRadioOne" />
                          <label class="form-label" for="flexRadioOne"> No </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Maximum No of Days</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Earned leave</label>
                      <div class="d-flex align-items-center">
                        <div class="form-check me-2">
                          <input class="form-check-input" type="radio" name="flexRadioOne" id="flexRadioTwo"
                            checked="" />
                          <label class="form-label" for="flexRadioTwo"> Yes </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioOne" id="flexRadioThree" />
                          <label class="form-label" for="flexRadioThree"> No </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
            <div class="tab-pane fade" id="policy" role="tabpanel" aria-labelledby="viwe-custom-policy-tab"
              tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                              +1
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body pb-1">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployee" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" class=""><i class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployeeone" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployeetwo" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployeethree" placeholder="Select" />
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
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Annual Leave -->

  <!-- Sick Leave -->
  <div class="modal fade" id="sick_leave_settings">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Sick Leave Settings</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab6" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="settings-one-tab" data-bs-toggle="tab"
                  data-bs-target="#settings-one-info" type="button" role="tab" aria-selected="true">
                  Settings
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="viwe-custom-policy-one-tab" data-bs-toggle="tab"
                  data-bs-target="#policy-one" type="button" role="tab" aria-selected="false">
                  View Custom Policy
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="myTabContent6">
            <div class="tab-pane fade show active" id="settings-one-info" role="tabpanel"
              aria-labelledby="settings-one-tab" tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Days</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
            <div class="tab-pane fade" id="policy-one" role="tabpanel" aria-labelledby="viwe-custom-policy-one-tab"
              tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                              +1
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployeefour" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" class=""><i class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployeefive" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployeesix" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployeseven" placeholder="Select" />
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
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Sick Leave -->

  <!-- Hospitalisation Leave -->
  <div class="modal fade" id="hospitalisation_settings">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Hospitalisation Settings</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab2" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="settings-two-tab" data-bs-toggle="tab"
                  data-bs-target="#settings-two-info" type="button" role="tab" aria-selected="true">
                  Settings
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="viwe-custom-policy-two-tab" data-bs-toggle="tab"
                  data-bs-target="#policy-two" type="button" role="tab" aria-selected="false">
                  View Custom Policy
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="myTabContent2">
            <div class="tab-pane fade show active" id="settings-two-info" role="tabpanel"
              aria-labelledby="settings-two-tab" tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Days</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
            <div class="tab-pane fade" id="policy-two" role="tabpanel" aria-labelledby="viwe-custom-policy-two-tab"
              tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                              +1
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployeeight" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" class=""><i class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="addemployeenine" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empeone" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empetwo" placeholder="Select" />
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
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Hospitalisation Leave -->

  <!-- Maternity Leave -->
  <div class="modal fade" id="maternity_settings">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Maternity Settings</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab3" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="settings-three-tab" data-bs-toggle="tab"
                  data-bs-target="#settings-three-info" type="button" role="tab" aria-selected="true">
                  Settings
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="viwe-custom-policy-three-tab" data-bs-toggle="tab"
                  data-bs-target="#policy-three" type="button" role="tab" aria-selected="false">
                  View Custom Policy
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="myTabContent3">
            <div class="tab-pane fade show active" id="settings-three-info" role="tabpanel"
              aria-labelledby="settings-three-tab" tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Days <span class="text-gray">(Assigned to Female only)</span>
                      </label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
            <div class="tab-pane fade" id="policy-three" role="tabpanel" aria-labelledby="viwe-custom-policy-three-tab"
              tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                              +1
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empethree" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" class=""><i class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empefour" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empefive" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empesix" placeholder="Select" />
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
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Maternity Leave -->

  <!-- Paternity Leave -->
  <div class="modal fade" id="paternity_settings">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Paternity Settings</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab4" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="settings-four-tab" data-bs-toggle="tab"
                  data-bs-target="#settings-four-info" type="button" role="tab" aria-selected="true">
                  Settings
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="viwe-custom-policy-four-tab" data-bs-toggle="tab"
                  data-bs-target="#policy-four" type="button" role="tab" aria-selected="false">
                  View Custom Policy
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="myTabContent4">
            <div class="tab-pane fade show active" id="settings-four-info" role="tabpanel"
              aria-labelledby="settings-four-tab" tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Days <span class="text-gray">(Assigned to Female only)</span>
                      </label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
            <div class="tab-pane fade" id="policy-four" role="tabpanel" aria-labelledby="viwe-custom-policy-four-tab"
              tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                              +1
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empeseven" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" class=""><i class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empeeight" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empeten" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empeonetwo" placeholder="Select" />
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
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Paternity Leave -->

  <!-- LOP Leave -->
  <div class="modal fade" id="lop_settings">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">LOP Settings</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab5" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="settings-five-tab" data-bs-toggle="tab"
                  data-bs-target="#settings-five-info" type="button" role="tab" aria-selected="true">
                  Settings
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="viwe-custom-policy-five-tab" data-bs-toggle="tab"
                  data-bs-target="#policy-five" type="button" role="tab" aria-selected="false">
                  View Custom Policy
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="myTabContent5">
            <div class="tab-pane fade show active" id="settings-five-info" role="tabpanel"
              aria-labelledby="settings-five-tab" tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">No of Days</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Carry Forward</label>
                      <div class="d-flex align-items-center">
                        <div class="form-check me-2">
                          <input class="form-check-input" type="radio" name="flexRadio" id="flexRadio4" checked="" />
                          <label class="form-label" for="flexRadio4"> Yes </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadio" id="flexRadio5" />
                          <label class="form-label" for="flexRadio5"> No </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Maximum No of Days</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Earned leave</label>
                      <div class="d-flex align-items-center">
                        <div class="form-check me-2">
                          <input class="form-check-input" type="radio" name="flexRadioOne" id="flexRadio6" checked="" />
                          <label class="form-label" for="flexRadio6"> Yes </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="flexRadioOne" id="flexRadio7" />
                          <label class="form-label" for="flexRadio7"> No </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
            <div class="tab-pane fade" id="policy-five" role="tabpanel" aria-labelledby="viwe-custom-policy-five-tab"
              tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar group-counts bg-primary rounded-circle border-0 fs-10">
                              +1
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="empeselect" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-32.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" class=""><i class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="sophie" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-11.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-58.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="cameron" placeholder="Select" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="card border mb-3">
                      <div class="card-body pb-1">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <div class="text-start">
                            <p class="mb-1">Policy Name</p>
                            <span class="text-dark fw-normal mb-0">2 Days Leave</span>
                          </div>
                          <div>
                            <p class="mb-1">No Of Days</p>
                            <span class="text-dark fw-normal mb-0">2</span>
                          </div>
                          <div class="avatar-list-stacked avatar-group-sm">
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-09.jpg" class="rounded-circle" alt="img" />
                            </span>
                            <span class="avatar border-0">
                              <img src="@/assets/img/users/user-13.jpg" class="rounded-circle" alt="img" />
                            </span>
                          </div>
                          <div class="action-icon d-inline-flex">
                            <a href="javascript:void(0);" class="me-2 edit-leave-btn"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i
                                class="ti ti-trash"></i></a>
                          </div>
                        </div>
                        <div class="card border edit-leave-details">
                          <div class="card-body">
                            <h6 class="border-bottom mb-3 pb-3">Edit Policy</h6>
                            <div class="row">
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">Policy Name
                                    <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="mb-3">
                                  <label class="form-label">No of Days <span class="text-danger"> *</span></label>
                                  <input type="text" class="form-control" />
                                </div>
                              </div>
                              <div class="col-me-12">
                                <label class="form-label">Add Employee</label>
                                <a-select :options="Addemp" id="doris" placeholder="Select" />
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
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" class="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /LOP Leave -->

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
            <a href="javascript:void(0);" class="btn btn-light me-3" data-bs-dismiss="modal">Cancel</a>
            <router-link to="/leave/leave-settings" class="btn btn-danger">Yes, Delete</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

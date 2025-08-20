<template>
  <!-- Add Employee -->
  <div class="modal fade" id="add_employee">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
        <div class="modal-header"
          style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; padding: 15px 20px;">
          <div class="d-flex align-items-center">
            <h4 class="modal-title me-2" style="color: #0067A5; font-weight: 600;">Add New Employee</h4>
          </div>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
          {{ alertMessage }}
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="contact-grids-tab">
            <ul class="nav nav-underline" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="info-tab" data-bs-toggle="tab" data-bs-target="#basic-info"
                  type="button" role="tab" aria-selected="true">
                  Basic Information
                </button>
              </li>
              <!-- <li class="nav-item" role="presentation">
                <button class="nav-link" id="personal-info-tab" data-bs-toggle="tab" data-bs-target="#personal-info"
                  type="button" role="tab" aria-selected="false">
                  Personal Information
                </button>
              </li> -->
              <!-- Alert Message -->

            </ul>
          </div>
          <div class="tab-content" id="myTabContent">
            <!-- Basic Information -->
            <div class="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="info-tab"
              tabindex="0">
              <div class="modal-body pb-0">
                <div class="row">
                  <!-- <div class="col-md-12">
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
                          <h6 class="mb-1">Upload Profile Image</h6>
                          <p class="fs-12">Image should be below 4 mb</p>
                        </div>
                        <div class="profile-uploader d-flex align-items-center">
                          <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                            Upload
                            <input
                              type="file"
                              class="form-control image-sign"
                              multiple=""
                            />
                          </div>
                          <a href="javascript:void(0);" class="btn btn-light btn-sm"
                            >Cancel</a
                          >
                        </div>
                      </div>
                    </div>
                  </div> -->
                  <div class="col-md-6">
                    <div class="input-block mb-3">
                      <label class="form-label" for="grant-subsidiary">Subsidiary</label>
                      <select id="grant-subsidiary" v-model="formData.subsidiary" class="form-control" required>
                        <option value="" disabled selected>Select a subsidiary</option>
                        <option v-for="subsidiary in subsidiaries" :key="subsidiary.id" :value="subsidiary.value"
                          :class="[
                            subsidiary.value === 'SMRU' ? 'text-primary' :
                              subsidiary.value === 'BHF' ? 'text-primary' :
                                'text-secondary'
                          ]">
                          {{ subsidiary.value }}
                        </option>
                      </select>

                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Staff ID <span class="text-danger"> *</span></label>
                      <input type="text" class="form-control" placeholder="Enter staff ID"
                        v-model="formData.staff_id" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="input-block mb-3">
                      <label class="form-label" for="initial-en">Initial (EN)</label>
                      <select id="initial-en" v-model="formData.initial_en" class="form-control">
                        <option value="" disabled selected>Select initial</option>
                        <option v-for="initial in employeeInitialEN" :key="initial.id" :value="initial.value" :class="[
                          'text-secondary'
                        ]">
                          {{ initial.value }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="input-block mb-3">
                      <label class="form-label" for="initial-th">Initial (TH)</label>
                      <select id="initial-th" v-model="formData.initial_th" class="form-control">
                        <option value="" disabled selected>Select initial</option>
                        <option v-for="initial in employeeInitialTH" :key="initial.id" :value="initial.value" :class="[
                          'text-secondary'
                        ]">
                          {{ initial.value }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">First Name (EN) <span class="text-danger"> *</span></label>
                      <input type="text" class="form-control" maxlength="255" placeholder="Enter English first name"
                        v-model="formData.first_name_en" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Last Name (EN)</label>
                      <input type="text" class="form-control" maxlength="255" placeholder="Enter English last name"
                        v-model="formData.last_name_en" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">First Name (TH)</label>
                      <input type="text" class="form-control" maxlength="255" placeholder="Enter Thai first name"
                        v-model="formData.first_name_th" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Last Name (TH)</label>
                      <input type="text" class="form-control" maxlength="255" placeholder="Enter Thai last name"
                        v-model="formData.last_name_th" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="input-block mb-3">
                      <label class="form-label" for="gender">Gender <span class="text-danger"> *</span></label>
                      <select id="gender" v-model="formData.gender" class="form-control" required>
                        <option value="" disabled selected>Select gender</option>
                        <option v-for="gender in genders" :key="gender.id" :value="gender.value" :class="[
                          gender.value === 'Male' ? 'text-primary' :
                            gender.value === 'Female' ? 'text-primary' :
                              'text-secondary'
                        ]">
                          {{ gender.value }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Date of Birth <span class="text-danger"> *</span></label>
                      <div class="input-icon-end position-relative">
                        <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                          :clearable="false" :input-format="dateFormat" v-model="formData.date_of_birth" />
                        <span class="input-icon-addon">
                          <i class="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                    </div>
                  </div>



                  <!-- <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Joining Date <span class="text-danger"> *</span></label>
                      <div class="input-icon-end position-relative">
                        <date-picker v-model="startdate" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                          :editable="true" :clearable="false" :input-format="dateFormat" />
                        <span class="input-icon-addon">
                          <i class="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                    </div>
                  </div> -->
                  <!-- <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Username <span class="text-danger"> *</span></label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Email <span class="text-danger"> *</span></label>
                      <input type="email" class="form-control" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Password <span class="text-danger"> *</span></label>
                      <div class="pass-group">
                        <input :type="showPassword ? 'text' : 'password'" class="pass-input form-control" />
                        <span @click="toggleShow" class="ti toggle-password" :class="{
                          'ti-eye': showPassword,
                          'ti-eye-off': !showPassword,
                        }"></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Confirm Password <span class="text-danger"> *</span></label>
                      <div class="pass-group">
                        <input :type="showPassword1 ? 'text' : 'password'" class="pass-inputs form-control" />
                        <span @click="toggleShow1" class="ti toggle-passwords" :class="{
                          'ti-eye': showPassword1,
                          'ti-eye-off': !showPassword1,
                        }"></span>
                      </div>
                    </div>
                  </div> -->
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Age <span class="text-danger"> *</span></label>
                      <input type="text" class="form-control" v-model="calculatedAge" readonly />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="input-block mb-3">
                      <label class="form-label" for="employee_status">Status <span class="text-danger"> *</span></label>
                      <select id="employee_status" v-model="formData.status" class="form-control" required>
                        <option value="" disabled selected>Select status</option>
                        <option v-for="status in statuses" :key="status.id" :value="status.value" :class="[
                          status.value === 'Active' ? 'text-primary' :
                            status.value === 'Inactive' ? 'text-danger' :
                              'text-secondary'
                        ]">
                          {{ status.value }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Nationality <span class="text-danger"> *</span></label>
                      <select class="form-select" v-model="formData.nationality">
                        <option value="" disabled selected>Select Nationality</option>
                        <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.value">
                          {{ nationality.value }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Religion <span class="text-danger"> *</span></label>
                      <select class="form-select" v-model="formData.religion">
                        <option value="" disabled selected>Select Religion</option>
                        <option v-for="religion in religions" :key="religion.id" :value="religion.value" :class="[
                          religion.value === 'Buddhism' ? 'text-primary' :
                            religion.value === 'Christianity' ? 'text-primary' :
                              'text-secondary'
                        ]">
                          {{ religion.value }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Marital Status <span class="text-danger"> *</span></label>
                      <select class="form-select" v-model="formData.marital_status">
                        <option value="" disabled selected>Select Marital Status</option>
                        <option v-for="status in maritalStatuses" :key="status.id" :value="status.value" :class="[
                          status.value === 'Single' ? 'text-primary' :
                            status.value === 'Married' ? 'text-primary' :
                              'text-secondary'
                        ]">
                          {{ status.value }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Phone <span class="text-danger"> *</span></label>
                      <input type="tel" class="form-control" v-model="formData.mobile_phone"
                        placeholder="Enter phone number" required />
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Current Address <span class="text-danger"> *</span></label>
                      <textarea class="form-control" v-model="formData.current_address"
                        placeholder="Enter current address" rows="3" required></textarea>
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Permanent Address <span class="text-danger"> *</span></label>
                      <textarea class="form-control" v-model="formData.permanent_address"
                        placeholder="Enter permanent address" rows="3" required></textarea>
                    </div>
                  </div> -->
                  <!-- <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Department</label>
                      <vue-select :options="DepartM" id="departm" placeholder="Select" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Position</label>
                      <vue-select :options="Desig" id="desigOne" placeholder="Select" />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">About <span class="text-danger"> *</span></label>
                      <textarea class="form-control" rows="3"></textarea>
                    </div>
                  </div> -->
                </div>
              </div>
              <div class="modal-footer"
                style="background-color: #f8f9fa; border-top: 1px solid #e9ecef; padding: 15px 20px;">
                <button type="button" class="btn btn-outline-light border me-2"
                  style="border-radius: 4px; padding: 8px 16px; font-weight: 500;" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary"
                  style="background-color: #0067A5; border-color: #0067A5; border-radius: 4px; padding: 8px 16px; font-weight: 500;"
                  :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true"></span>
                  Save
                </button>
              </div>
            </div>

            <!-- Personal Information
            <div class="tab-pane fade" id="personal-info" role="tabpanel" aria-labelledby="personal-info-tab"
              tabindex="0">
              <div class="modal-body">
                <div class="row">

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Address</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>

                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#success_modal">
                  Save
                </button>
              </div>
            </div> -->
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Employee -->

  <!-- Edit Employee -->
  <div class="modal fade" id="edit_employee" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
        <div class="modal-header"
          style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; padding: 15px 20px;">
          <div class="d-flex align-items-center">
            <h4 class="modal-title me-2" style="color: #0067A5; font-weight: 600;">Edit Employee</h4>
          </div>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
          {{ alertMessage }}
        </div>
        <form @submit.prevent="handleEditSubmit">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="edit-subsidiary">Subsidiary</label>
                  <select id="edit-subsidiary" v-model="editFormData.subsidiary" class="form-control" required>
                    <option value="" disabled selected>Select a subsidiary</option>
                    <option v-for="subsidiary in subsidiaries" :key="subsidiary.id" :value="subsidiary.value" :class="[
                      subsidiary.value === 'SMRU' ? 'text-primary' :
                        subsidiary.value === 'BHF' ? 'text-primary' :
                          'text-secondary'
                    ]">
                      {{ subsidiary.value }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Staff ID <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" placeholder="Enter staff ID"
                    v-model="editFormData.staff_id" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Initial (EN)</label>
                  <input type="text" class="form-control" placeholder="Enter English initial" maxlength="10"
                    v-model="editFormData.initial_en" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Initial (TH)</label>
                  <input type="text" class="form-control" placeholder="Enter Thai initial" maxlength="10"
                    v-model="editFormData.initial_th" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">First Name (EN) <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" maxlength="255" placeholder="Enter English first name"
                    v-model="editFormData.first_name_en" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Last Name (EN)</label>
                  <input type="text" class="form-control" maxlength="255" placeholder="Enter English last name"
                    v-model="editFormData.last_name_en" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">First Name (TH)</label>
                  <input type="text" class="form-control" maxlength="255" placeholder="Enter Thai first name"
                    v-model="editFormData.first_name_th" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Last Name (TH)</label>
                  <input type="text" class="form-control" maxlength="255" placeholder="Enter Thai last name"
                    v-model="editFormData.last_name_th" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="edit-gender">Gender <span class="text-danger"> *</span></label>
                  <select id="edit-gender" v-model="editFormData.gender" class="form-control" required>
                    <option value="" disabled selected>Select gender</option>
                    <option v-for="gender in genders" :key="gender.id" :value="gender.value" :class="[
                      gender.value === 'Male' ? 'text-primary' :
                        gender.value === 'Female' ? 'text-primary' :
                          'text-secondary'
                    ]">
                      {{ gender.value }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Date of Birth <span class="text-danger"> *</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                      :clearable="false" :input-format="dateFormat" v-model="editFormData.date_of_birth" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Age <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="editCalculatedAge" readonly />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="edit-employee-status">Status <span class="text-danger">
                      *</span></label>
                  <select id="edit-employee-status" v-model="editFormData.status" class="form-control" required>
                    <option value="" disabled selected>Select status</option>
                    <option v-for="status in statuses" :key="status.id" :value="status.value" :class="[
                      status.value === 'Active' ? 'text-primary' :
                        status.value === 'Inactive' ? 'text-danger' :
                          'text-secondary'
                    ]">
                      {{ status.value }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Nationality <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="editFormData.nationality">
                    <option value="" disabled selected>Select Nationality</option>
                    <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.value">
                      {{ nationality.value }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Religion <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="editFormData.religion">
                    <option value="" disabled selected>Select Religion</option>
                    <option v-for="religion in religions" :key="religion.id" :value="religion.value" :class="[
                      religion.value === 'Buddhism' ? 'text-primary' :
                        religion.value === 'Christianity' ? 'text-primary' :
                          'text-secondary'
                    ]">
                      {{ religion.value }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Marital Status <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="editFormData.marital_status">
                    <option value="" disabled selected>Select Marital Status</option>
                    <option v-for="status in maritalStatuses" :key="status.id" :value="status.value" :class="[
                      status.value === 'Single' ? 'text-primary' :
                        status.value === 'Married' ? 'text-primary' :
                          'text-secondary'
                    ]">
                      {{ status.value }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Phone <span class="text-danger"> *</span></label>
                  <input type="tel" class="form-control" v-model="editFormData.mobile_phone"
                    placeholder="Enter phone number" required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Current Address <span class="text-danger"> *</span></label>
                  <textarea class="form-control" v-model="editFormData.current_address"
                    placeholder="Enter current address" rows="3" required></textarea>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Permanent Address <span class="text-danger"> *</span></label>
                  <textarea class="form-control" v-model="editFormData.permanent_address"
                    placeholder="Enter permanent address" rows="3" required></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer"
            style="background-color: #f8f9fa; border-top: 1px solid #e9ecef; padding: 15px 20px;">
            <button type="button" class="btn btn-outline-light border me-2"
              style="border-radius: 4px; padding: 8px 16px; font-weight: 500;" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary"
              style="background-color: #0067A5; border-color: #0067A5; border-radius: 4px; padding: 8px 16px; font-weight: 500;"
              :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Add Employee Success -->
  <div class="modal fade" id="success_modal" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-center p-3">
            <span class="avatar avatar-lg avatar-rounded bg-success mb-3"><i class="ti ti-check fs-24"></i></span>
            <h5 class="mb-2">Employee Added Successfully</h5>
            <p class="mb-3" v-if="lastAddedEmployee">
              {{ lastAddedEmployee.first_name_en }} {{ lastAddedEmployee.last_name_en }} has been added with Staff ID :
              <span class="text-primary">{{ lastAddedEmployee.staff_id }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Add Employee Success -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_modal">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
        <div class="modal-body text-center" style="padding: 25px 20px;">
          <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3"
            style="background-color: rgba(239, 68, 68, 0.1);">
            <i class="ti ti-trash-x fs-36"></i>
          </span>
          <h4 class="mb-1" style="color: #0067A5; font-weight: 600;">Confirm Delete</h4>
          <p class="mb-3" style="color: #6B7280;">
            You want to delete all the marked items, this cant be undone once you delete.
          </p>
          <div class="d-flex justify-content-center">
            <a href="javascript:void(0);" class="btn btn-light me-3"
              style="border-radius: 4px; padding: 8px 16px; font-weight: 500;" data-bs-dismiss="modal">Cancel</a>
            <router-link to="/employee/employee-list" class="btn btn-danger"
              style="border-radius: 4px; padding: 8px 16px; font-weight: 500;">Yes, Delete</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>
<script>
import { ref } from "vue";
import { Modal } from 'bootstrap';
import { useEmployeeStore } from "@/stores/employeeStore";
import { useLookupStore } from "@/stores/lookupStore";
import { message } from 'ant-design-vue';

const currentDate = ref(new Date());
const currentDateOne = ref(new Date());

export default {
  data() {
    return {
      showPassword: false,
      showPassword1: false,
      subsidiaries: [],
      genders: [],
      date_of_birth: '',
      nationalities: [],
      religions: [],
      maritalStatuses: [],
      statuses: [],
      editMode: false,
      employeeLanguages: [],
      employeeEducations: [],
      employeeInitialEN: [],
      employeeInitialTH: [],
      editFormData: {
        first_name_en: '',
        last_name_en: '',
        first_name_th: '',
        last_name_th: '',
        initial_en: '',
        initial_th: '',
        staff_id: '',
        joining_date: '',
        age: '',
        status: '',
        mobile_phone: '',
        current_address: '',
        permanent_address: '',
        subsidiary: '',
        gender: '',
        nationality: '',
        religion: '',
        marital_status: '',
        employee_status: '',
        date_of_birth: '',
      },
      formData: {
        first_name_en: '',
        last_name_en: '',
        first_name_th: '',
        last_name_th: '',
        initial_en: '',
        initial_th: '',
        staff_id: '',
        joining_date: '',
        // mobile_phone: '',
        // current_address: '',
        // permanent_address: '',
        subsidiary: '',
        status: '',
        age: '',
        gender: '',
        // nationality: '',
        // religion: '',
        // marital_status: '',
        date_of_birth: '',
      },
      lastAddedEmployee: null,    // ← new
      isSubmitting: false,
      modalInstance: null,
      alertMessage: '',
      alertClass: '',
      alertTimeout: null,
      startdate: currentDate,
      startdateOne: currentDateOne,
      dateFormat: "dd-MM-yyyy",
      Desig: ["Select", "Finance", "Developer", "Executive"],
      DepartM: ["Select", "All Department", "Finance", "Executive"],
      EditDesig: ["Select", "Finance", "Developer", "Executive"],
      EditDepartM: ["Select", "All Department", "Finance", "Executive"],
    };
  },
  async created() {
    // Load subsidiaries when component is created
    await this.initSubsidiaries();
    await this.initFetchGender();
    await this.initFetchNationality();
    await this.initFetchReligion();
    await this.initFetchMaritalStatus();
    await this.initFetchEmployeeStatus();
    await this.initFetchEmployeeLanguage();
    await this.initFetchEmployeeEducation();
    await this.initFetchEmployeeInitialEN();
    await this.initFetchEmployeeInitialTH();
  },
  mounted() {
    // Initialize the modal when component is mounted
    const modalElement = document.getElementById('add_employee');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }
  },
  computed: {
    calculatedAge() {
      const dobVal = this.formData.date_of_birth;
      if (!dobVal) return '';

      // if dobVal is a string in ISO or Date object, normalize:
      const dob = dobVal instanceof Date
        ? dobVal
        : new Date(dobVal);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      // subtract 1 if we haven't hit their birthday this year yet:
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      return age;
    },

    editCalculatedAge() {
      const dobVal = this.editFormData.date_of_birth;
      if (!dobVal) return '';

      const dob = dobVal instanceof Date
        ? dobVal
        : new Date(dobVal);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      return age;
    },

    buttonLabel() {
      return this.showPassword ? "Hide" : "Show";
    },
    buttonLabel1() {
      return this.showPassword1 ? "Hide" : "Show";
    },
  },
  methods: {
    // Add this utility method for date formatting
    formatDateOnly(dateValue) {
      if (!dateValue) return null;
      return new Date(dateValue).toISOString().split('T')[0];
    },

    async handleSubmit() {
      this.isSubmitting = true;
      this.alertMessage = ''; // Reset alert message

      try {
        console.log(this.formData);

        // Format the data before sending to backend
        const formDataToSend = {
          ...this.formData,
          date_of_birth: this.formatDateOnly(this.formData.date_of_birth),
          age: this.calculatedAge
        };

        console.log('Formatted submission data:', formDataToSend);

        const employeeStore = useEmployeeStore();
        const response = await employeeStore.createEmployee(formDataToSend);

        if (response && response.success) {
          this.lastAddedEmployee = response.data;
          message.success('Employee added successfully');
          this.$emit('employee-added');
          if (this.modalInstance) {
            this.modalInstance.hide();
          }

          //Show success modal
          const successModal = new Modal(document.getElementById('success_modal'));
          successModal.show();

          // When the success modal closes, reset the form
          successModal._element.addEventListener('hidden.bs.modal', () => {
            this.resetForm();
            this.lastAddedEmployee = null;
          }, { once: true });

        } else {
          // Prioritize the 'error' field if available, then 'message', then default
          let errorMessage = response?.error || response?.message || 'Failed to add employee';

          // If there are validation errors in the 'errors' object, append them
          if (response?.errors) {
            const validationErrors = Object.values(response.errors).flat().join(', ');
            errorMessage = validationErrors || errorMessage;
          }

          this.showAlert(errorMessage, 'alert-danger');
        }
      } catch (error) {
        console.error('Error submitting form:', error);

        // Handle different types of errors
        let errorMessage = 'An error occurred while saving the employee.';

        if (error.response && error.response.data) {
          // API returned an error response
          const data = error.response.data;
          errorMessage = data.error || data.message || errorMessage;

          // Handle validation errors
          if (data.errors) {
            const validationErrors = Object.values(data.errors).flat().join(', ');
            errorMessage = validationErrors || errorMessage;
          }
        } else if (error.message) {
          // Network or other error
          errorMessage = error.message;
        }

        this.showAlert(errorMessage, 'alert-danger');
      } finally {
        this.isSubmitting = false;
      }
    },

    async handleEditSubmit() {
      this.isSubmitting = true;
      this.alertMessage = '';

      try {
        // Format the date for edit submission as well
        const editDataToSend = {
          ...this.editFormData,
          date_of_birth: this.formatDateOnly(this.editFormData.date_of_birth)
        };

        console.log('Edit formatted submission data:', editDataToSend);

        const employeeStore = useEmployeeStore();
        const response = await employeeStore.updateEmployee(editDataToSend.id, editDataToSend);

        if (response && response.success) {
          message.success('Employee updated successfully');
          this.$emit('employee-updated');

          // Close the edit modal
          const editModal = Modal.getInstance(document.getElementById('edit_employee'));
          if (editModal) {
            editModal.hide();
          }

          this.resetEditForm();
        } else {
          // Prioritize the 'error' field if available, then 'message', then default
          let errorMessage = response?.error || response?.message || 'Failed to update employee';

          // If there are validation errors in the 'errors' object, append them
          if (response?.errors) {
            const validationErrors = Object.values(response.errors).flat().join(', ');
            errorMessage = validationErrors || errorMessage;
          }

          this.showAlert(errorMessage, 'alert-danger');
        }
      } catch (error) {
        console.error('Error updating employee:', error);

        // Handle different types of errors
        let errorMessage = 'An error occurred while updating the employee.';

        if (error.response && error.response.data) {
          // API returned an error response
          const data = error.response.data;
          errorMessage = data.error || data.message || errorMessage;

          // Handle validation errors
          if (data.errors) {
            const validationErrors = Object.values(data.errors).flat().join(', ');
            errorMessage = validationErrors || errorMessage;
          }
        } else if (error.message) {
          // Network or other error
          errorMessage = error.message;
        }

        this.showAlert(errorMessage, 'alert-danger');
      } finally {
        this.isSubmitting = false;
      }
    },

    // Add resetEditForm method if it doesn't exist
    resetEditForm() {
      this.editFormData = {
        first_name_en: '',
        last_name_en: '',
        first_name_th: '',
        last_name_th: '',
        initial_en: '',
        initial_th: '',
        staff_id: '',
        joining_date: '',
        age: '',
        status: '',
        mobile_phone: '',
        current_address: '',
        permanent_address: '',
        subsidiary: '',
        gender: '',
        nationality: '',
        religion: '',
        marital_status: '',
        employee_status: '',
        date_of_birth: '',
      };
    },

    // ...existing methods...
    showAlert(message, alertClass, duration = 5000) {
      // Clear any existing timeout
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }

      this.alertMessage = message;
      this.alertClass = alertClass;

      // Set timeout to clear the alert after duration
      this.alertTimeout = setTimeout(() => {
        this.alertMessage = '';
        this.alertClass = '';
      }, duration);
    },

    resetForm() {
      this.formData = {
        first_name_en: '',
        last_name_en: '',
        first_name_th: '',
        last_name_th: '',
        initial_en: '',
        initial_th: '',
        staff_id: '',
        joining_date: '',
        phone: '',
        current_address: '',
        permanent_address: '',
        subsidiary: '',
        gender: '',
        nationality: '',
        religion: '',
        marital_status: '',
        employee_status: '',
        date_of_birth: '',
      };
      this.alertMessage = '';
      this.alertClass = '';
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
    },

    async fetchEmployeeLanguage() {
      const lookupStore = useLookupStore();
      const employeeLanguages = lookupStore.getLookupsByType('employee_language');
      return employeeLanguages || [];
    },

    async fetchEmployeeEducation() {
      const lookupStore = useLookupStore();
      const employeeEducations = lookupStore.getLookupsByType('employee_education');
      return employeeEducations || [];
    },

    async fetchEmployeeInitialEN() {
      const lookupStore = useLookupStore();
      const employeeInitialEN = lookupStore.getLookupsByType('employee_initial_en');
      return employeeInitialEN || [];
    },

    async fetchEmployeeInitialTH() {
      const lookupStore = useLookupStore();
      const employeeInitialTH = lookupStore.getLookupsByType('employee_initial_th');
      return employeeInitialTH || [];
    },


    // Get subsidiary data from lookups
    async fetchSubsidiaries() {
      try {
        // Use the lookup store to get subsidiaries
        const lookupStore = useLookupStore();
        const subsidiaries = lookupStore.getLookupsByType('subsidiary');
        return subsidiaries || [];
      } catch (error) {
        console.error('Error fetching subsidiaries:', error);
        return [];
      }
    },

    async fetchGender() {
      try {
        const lookupStore = useLookupStore();
        const genders = lookupStore.getLookupsByType('gender');
        return genders || [];
      } catch (error) {
        console.error('Error fetching genders:', error);
        return [];
      }
    },

    async fetchNationality() {
      try {
        const lookupStore = useLookupStore();
        const nationalities = lookupStore.getLookupsByType('nationality');
        return nationalities || [];
      } catch (error) {
        console.error('Error fetching nationalities:', error);
        return [];
      }
    },

    async fetchReligion() {
      try {
        const lookupStore = useLookupStore();
        const religions = lookupStore.getLookupsByType('religion');
        return religions || [];
      } catch (error) {
        console.error('Error fetching religions:', error);
        return [];
      }
    },

    async fetchMaritalStatus() {
      try {
        const lookupStore = useLookupStore();
        const maritalStatuses = lookupStore.getLookupsByType('marital_status');
        return maritalStatuses || [];
      } catch (error) {
        console.error('Error fetching marital statuses:', error);
        return [];
      }
    },

    async fetchEmployeeStatus() {
      try {
        const lookupStore = useLookupStore();
        const statuses = lookupStore.getLookupsByType('employee_status');
        return statuses || [];
      } catch (error) {
        console.error('Error fetching employee statuses:', error);
        return [];
      }
    },

    async initFetchEmployeeLanguage() {
      this.employeeLanguages = await this.fetchEmployeeLanguage();
    },

    async initFetchEmployeeEducation() {
      this.employeeEducations = await this.fetchEmployeeEducation();
    },

    async initFetchEmployeeInitialEN() {
      this.employeeInitialEN = await this.fetchEmployeeInitialEN();
    },

    async initFetchEmployeeInitialTH() {
      this.employeeInitialTH = await this.fetchEmployeeInitialTH();
    },

    async initFetchGender() {
      this.genders = await this.fetchGender();
    },

    async initFetchNationality() {
      this.nationalities = await this.fetchNationality();
    },

    async initFetchReligion() {
      this.religions = await this.fetchReligion();
    },

    async initFetchMaritalStatus() {
      this.maritalStatuses = await this.fetchMaritalStatus();
    },

    async initFetchEmployeeStatus() {
      this.statuses = await this.fetchEmployeeStatus();
    },

    // Initialize subsidiary data when component is created
    async initSubsidiaries() {
      const lookupStore = useLookupStore();
      // If lookups aren't loaded yet, fetch them first
      // Only fetch if not already loaded
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      this.subsidiaries = lookupStore.getLookupsByType('subsidiary');
    },

    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    toggleShow1() {
      this.showPassword1 = !this.showPassword1;
    },
    submitForm() {
      this.handleSubmit();
    },
  },
};
</script>

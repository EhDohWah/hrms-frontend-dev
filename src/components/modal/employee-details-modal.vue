<template>
  <!-- Edit Employee Basic Information Modal -->
  <div class="modal fade" id="edit_employee">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <div class="d-flex align-items-center">
            <h4 class="modal-title me-2">Edit Employee</h4>
            <span>Staff ID : {{ editFormData.staff_id }}</span>
          </div>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div v-if="alertMessageBasic" class="alert" :class="alertClassBasic" role="alert">
          {{ alertMessageBasic }}
        </div>
        <form @submit.prevent="updateBasicInformation">
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
                <div class="input-block mb-3">
                  <label class="form-label" for="edit-initial-en">Initial (EN)</label>
                  <select id="edit-initial-en" v-model="editFormData.initial_en" class="form-control">
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
                  <label class="form-label" for="edit-initial-th">Initial (TH)</label>
                  <select id="edit-initial-th" v-model="editFormData.initial_th" class="form-control">
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
                  <input type="text" class="form-control" v-model="calculatedAge" readonly />
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
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Employee Modal -->

  <!-- Edit Personal Information Modal -->
  <div class="modal fade" id="edit_personal">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Personal Information</h4>
          <span>Staff ID : {{ personalFormData.staff_id }}</span>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <div v-if="alertMessagePersonal" class="alert" :class="alertClassPersonal" role="alert">
          {{ alertMessagePersonal }}
        </div>
        <form @submit.prevent="submitPersonalInformationForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Phone <span class="text-danger"> *</span></label>
                  <input type="tel" class="form-control" v-model="personalFormData.mobile_phone"
                    placeholder="Enter phone number" required />
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label" for="edit-nationality">Nationality <span class="text-danger">
                      *</span></label>
                  <select id="edit-nationality" class="form-select" v-model="personalFormData.nationality">
                    <option value="" disabled>Select Nationality</option>
                    <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.value"
                      :class="['text-secondary']">
                      {{ nationality.value }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Social Security Number</label>
                  <input type="text" class="form-control" v-model="personalFormData.social_security_number"
                    placeholder="Enter SSN" />
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Tax Number</label>
                  <input type="text" class="form-control" v-model="personalFormData.tax_number"
                    placeholder="Enter tax number" />
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Religion <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="personalFormData.religion">
                    <option value="" disabled selected>Select Religion</option>
                    <option v-for="religion in religions" :key="religion.id" :value="religion.value">
                      {{ religion.value }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Marital Status <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="personalFormData.marital_status">
                    <option value="" disabled selected>Select Marital Status</option>
                    <option v-for="status in maritalStatuses" :key="status.id" :value="status.value">
                      {{ status.value }}
                    </option>
                  </select>
                </div>
              </div>

              <template v-if="personalFormData.marital_status === 'Married'">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Spouse Name</label>
                    <input type="text" class="form-control" v-model="personalFormData.spouse_name"
                      placeholder="Enter spouse name" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Spouse Mobile</label>
                    <input type="tel" class="form-control" v-model="personalFormData.spouse_mobile"
                      placeholder="Enter spouse mobile number" />
                  </div>
                </div>
              </template>

              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Languages</label>
                  <a-select v-model:value="personalFormData.languages" mode="multiple" style="width: 100%"
                    placeholder="Select languages"
                    :options="languages.map(language => ({ value: language.value, label: language.value }))"></a-select>

                </div>
              </div>

              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Current Address <span class="text-danger"> *</span></label>
                  <textarea class="form-control" v-model="personalFormData.current_address"
                    placeholder="Enter current address" rows="3" required></textarea>
                </div>
              </div>

              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Permanent Address <span class="text-danger"> *</span></label>
                  <textarea class="form-control" v-model="personalFormData.permanent_address"
                    placeholder="Enter permanent address" rows="3" required></textarea>
                </div>
              </div>
              <div class="col-md-12">
                <div class="card border rounded-3 mb-2">
                  <div class="card-header bg-light">
                    <h6 class="mb-0">Identification Information</h6>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">ID Type <span class="text-danger"> *</span></label>
                          <select class="form-select" v-model="personalFormData.employee_identification.id_type"
                            required>
                            <option value="" disabled selected>Select ID Type</option>
                            <option v-for="idType in idTypes" :key="idType.id" :value="idType.value">
                              {{ idType.value }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">ID Number</label>
                          <input type="text" class="form-control"
                            v-model="personalFormData.employee_identification.document_number"
                            placeholder="Enter ID number" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Personal Information Modal -->

  <!-- Edit Beneficiary Modal -->
  <!-- <div class="modal fade" id="edit_beneficiary">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Beneficiary Details</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitBeneficiaryForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="beneficiaryForm.beneficiary_name" required />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Relationship <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="beneficiaryForm.beneficiary_relationship" required>
                    <option value="" disabled selected>Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Phone Number <span class="text-danger"> *</span></label>
                  <input type="tel" class="form-control" v-model="beneficiaryForm.phone_number" required />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="beneficiaryForm.beneficiary_email" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div> -->
  <!-- /Edit Beneficiary Modal -->

  <!-- Edit Bank Modal -->
  <!-- <div class="modal fade" id="edit_bank">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Bank Details</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Bank Details <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Bank account No</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">IFSC Code</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Branch Address</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div> -->
  <!-- /Edit Bank Modal -->

  <!-- Add Beneficiary Modal -->
  <div class="modal fade" id="add_beneficiary">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Beneficiary</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitBeneficiaryForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Beneficiary Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="beneficiaryForm.beneficiary_name" required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Relationship <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="beneficiaryForm.beneficiary_relationship" required>
                    <option value="" disabled selected>Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Phone Number <span class="text-danger"> *</span></label>
                  <input type="tel" class="form-control" v-model="beneficiaryForm.phone_number" required />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Beneficiary Modal -->

  <!-- Add Child Modal -->
  <div class="modal fade" id="add_child">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ isEditingChild ? 'Edit Child' : 'Add Child' }}</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitChildForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Child Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="childForm.name" required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Date of Birth</label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="childForm.date_of_birth" class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              {{ isEditingChild ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Child Modal -->

  <!-- Add Family Modal -->
  <div class="modal fade" id="edit_familyinformation">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Family Information</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Relationship</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Phone</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Passport Expiry Date <span class="text-danger"> *</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="startdateTwo" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                      :editable="true" :clearable="false" :input-format="dateFormat" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Family Modal -->

  <!-- Add Education Modal -->
  <!-- <div class="modal fade" id="edit_education">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Education Information</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Institution Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Course <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Start Date <span class="text-danger"> *</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="startdateThree" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                      :editable="true" :clearable="false" :input-format="dateFormat" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">End Date <span class="text-danger"> *</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="startdateFour" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                      :editable="true" :clearable="false" :input-format="dateFormat" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div> -->
  <!-- /Add Education Modal -->

  <!-- Add Experience Modal -->
  <!-- <div class="modal fade" id="edit_experience">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Company Information</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Previous Company Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Designation <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Start Date <span class="text-danger"> *</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="startdateFive" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                      :editable="true" :clearable="false" :input-format="dateFormat" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">End Date <span class="text-danger"> *</span></label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="startdateSix" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                      :editable="true" :clearable="false" :input-format="dateFormat" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-check-label d-flex align-items-center mt-0">
                    <input class="form-check-input mt-0 me-2" type="checkbox" checked />
                    <span class="text-dark">Check if you working present</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div> -->
  <!-- /Add Experience Modal -->


  <!-- Add Statutory Modal -->
  <!-- <div class="modal fade" id="add_bank_satutory">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Bank & Statutory</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="border-bottom mb-4">
              <h5 class="mb-3">Basic Salary Information</h5>
              <div class="row mb-2">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Salary basis <span class="text-danger"> *</span></label>
                    <vue-select :options="SaralyBas" id="saralybas" placeholder="Select" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Salary basis</label>
                    <input type="text" class="form-control" value="$" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Payment type</label>
                    <vue-select :options="PayType" id="paytype" placeholder="Select" />
                  </div>
                </div>
              </div>
            </div>
            <div class="border-bottom mb-4">
              <h5 class="mb-3">PF Information</h5>
              <div class="row mb-2">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">PF contribution <span class="text-danger"> *</span></label>
                    <vue-select :options="FundInt" id="fundint" placeholder="Select" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">PF No</label>
                    <input type="text" class="form-control" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Employee PF rate</label>
                    <input type="text" class="form-control" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Additional rate</label>
                    <vue-select :options="EpsRate" id="epsrate" placeholder="Select" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Total rate</label>
                    <input type="text" class="form-control" />
                  </div>
                </div>
              </div>
            </div>
            <h5 class="mb-3">ESI Information</h5>
            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">ESI contribution<span class="text-danger"> *</span></label>
                  <vue-select :options="OneFundInt" id="onefundint" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">ESI Number</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Employee ESI rate<span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Additional rate</label>
                  <vue-select :options="OneEpsRate" id="oneepsrate" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Total rate</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div> -->
  <!-- /Add Statutory Modal -->

  <!-- Add Grant Position Modal -->
  <!-- <div class="modal fade" id="add_grant_position">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Grant Position</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitGrantPosition">
         
            <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
              {{ alertMessage }}
            </div>
            <div class="row">
        
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Grant Position</label>
                  <select class="form-select" v-model="form.grant_items_id" required>
                    <option disabled value="">Select Grant Position</option>
                    <option v-for="position in grantPositions" :key="position.id" :value="position.id">
                      {{ position.bg_line + ' | ' + position.grant_name + ' | ' + position.grant_position }}
                    </option>
                  </select>
                </div>
              </div>
            
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Level of Effort (%)</label>
                  <input type="number" v-model.number="form.level_of_effort" class="form-control"
                    placeholder="Enter level of effort" />
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Start Date</label>
                  <date-picker v-model="form.start_date" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                    :input-format="dateFormat" />
                </div>
              </div>
            
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">End Date</label>
                  <date-picker v-model="form.end_date" class="form-control datetimepicker" placeholder="dd/mm/yyyy"
                    :input-format="dateFormat" />
                </div>
              </div>
             
              <div class="col-md-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="form.active" id="activeCheck" />
                  <label class="form-check-label" for="activeCheck">
                    Active
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                  aria-hidden="true"></span>
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>Save</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div> -->
  <!-- /Add Grant Position Modal -->

  <!-- Asset Information Modal -->
  <div class="modal fade" id="asset_info">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Asset Information</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="bg-light p-3 rounded d-flex align-items-center mb-3">
            <span class="avatar avatar-lg flex-shrink-0 me-2">
              <img src="@/assets/img/laptop.jpg" alt="img" class="ig-fluid rounded-circle" />
            </span>
            <div>
              <h6>Dell Laptop - #343556656</h6>
              <p class="fs-13">
                <span class="text-primary">AST - 001 </span>
                <i class="ti ti-point-filled text-primary"></i> Assigned on 22 Nov, 2022 10:32AM
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <p class="fs-13 mb-0">Type</p>
                <p class="text-gray-9">Laptop</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <p class="fs-13 mb-0">Brand</p>
                <p class="text-gray-9">Dell</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <p class="fs-13 mb-0">Category</p>
                <p class="text-gray-9">Computer</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <p class="fs-13 mb-0">Serial No</p>
                <p class="text-gray-9">3647952145678</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <p class="fs-13 mb-0">Cost</p>
                <p class="text-gray-9">$800</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <p class="fs-13 mb-0">Vendor</p>
                <p class="text-gray-9">Compusoft Systems Ltd.,</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <p class="fs-13 mb-0">Warranty</p>
                <p class="text-gray-9">12 Jan 2022 - 12 Jan 2026</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <p class="fs-13 mb-0">Location</p>
                <p class="text-gray-9">46 Laurel Lane, TX 79701</p>
              </div>
            </div>
          </div>
          <div>
            <p class="fs-13 mb-2">Asset Images</p>
            <div class="d-flex align-items-center">
              <img src="@/assets/img/laptop-01.jpg" alt="img" class="img-fluid rounded me-2" />
              <img src="@/assets/img/laptop-2.jpg" alt="img" class="img-fluid rounded me-2" />
              <img src="@/assets/img/laptop-3.jpg" alt="img" class="img-fluid rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Asset Information Modal -->

  <!-- Refuse Modal -->
  <div class="modal fade" id="refuse_msg">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Raise Issue</h4>
          <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Description<span class="text-danger"> *</span></label>
                  <textarea class="form-control" rows="4"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-white border me-2" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Refuse Modal -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_modal">
    <div class="modal-dialog modal-dialog-centered modal-sm">
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
            <router-link to="/employee/employee-details" class="btn btn-danger">Yes, Delete</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

<script>
import { ref } from "vue";
import employmentService from "@/services/employment.service";
import { grantService } from "@/services/grant.service";
import { Modal } from 'bootstrap';
import { useLookupStore } from "@/stores/lookupStore";
import employeeService from "@/services/employee.service";
import employeeChildrenService from "@/services/employee-children.service";

const currentDate = ref(new Date());
const currentDateOne = ref(new Date());
const currentDateTwo = ref(new Date());
const currentDateThree = ref(new Date());
const currentDateFour = ref(new Date());
const currentDateFive = ref(new Date());
const currentDateSix = ref(new Date());

export default {
  emits: ['employee-updated', 'grantPositionAdded'],

  props: {
    // Employee details passed from the parent
    employee: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      showPassword: false,
      showPassword1: false,
      isSubmitting: false,
      age: '',
      loading: false,
      error: null,
      alertMessage: '',
      alertMessageBasic: '',
      alertMessagePersonal: '',
      alertClass: '',
      subsidiaries: [],
      genders: [],
      date_of_birth: '',
      nationalities: [],
      religions: [],
      maritalStatuses: [],
      statuses: [],
      employeeInitialEN: [],
      employeeInitialTH: [],
      startdate: currentDate,
      startdateOne: currentDateOne,
      startdateTwo: currentDateTwo,
      startdateThree: currentDateThree,
      startdateFour: currentDateFour,
      startdateFive: currentDateFive,
      startdateSix: currentDateSix,
      personalFormData: {
        id: '',
        staff_id: '',
        mobile_phone: '',
        nationality: '',
        social_security_number: '',
        tax_number: '',
        religion: '',
        marital_status: '',
        languages: [],
        current_address: '',
        permanent_address: '',
        employee_identification: {
          id_type: '',
          document_number: ''
        },
      },
      editFormData: {
        id: '',
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

      beneficiaryForm: {
        beneficiary_name: '',
        beneficiary_relationship: '',
        beneficiary_phone: '',
        beneficiary_email: '',
        beneficiary_address: '',
      },

      idTypes: [],

      languages: [],
      selectedLanguages: [],

      childForm: {
        id: null,
        employee_id: '',
        name: '',
        date_of_birth: '',
      },
      editingChild: null,
      isEditingChild: false,
      dateFormat: "dd-MM-yyyy",
      EpsRate: ["Select", "EPS", "ESI", "EPF"],
      OneEpsRate: ["Select", "EPS", "ESI", "EPF"],
      OneFundInt: ["Select", "Employee COntribution", "Employer Contribution", "Maternity Benefit"],
      FundInt: ["Select", "Employee Contribution", "Employer Contribution", "Provident Fund Interest"],
      PayType: ["Select", "Cash", "Debit Card", "Mobile Payment"],
      SaralyBas: ["Select", "Weekly", "Monthly", "Annualy"],
      MartSel: ["Select", "Yes", "No"],
      FinanceDeo: ["Select", "All Department", "Finance", "Developer", "Executive"],
      OneFinanceDeo: ["Select", "All Department", "Finance", "Developer", "Executive"],
      grantPositions: [],
      form: {
        grant_items_id: null,
        level_of_effort: 1,
        start_date: null,
        end_date: null,
        active: true,
      },
    };
  },
  async created() {
    await this.initFetchGender();
    await this.initFetchNationality();
    await this.initFetchReligion();
    await this.initFetchMaritalStatus();
    await this.initFetchEmployeeStatus();
    await this.initSubsidiaries();
    await this.initFetchEmployeeInitialEN();
    await this.initFetchEmployeeInitialTH();
    await this.initFetchIdTypes();
    await this.initFetchEmployeeLanguage();
  },

  computed: {



    calculatedAge() {
      const dobVal = this.editFormData.date_of_birth;
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
    buttonLabel() {
      return this.showPassword ? "Hide" : "Show";
    },
    buttonLabel1() {
      return this.showPassword1 ? "Hide" : "Show";
    },

  },
  methods: {
    // update employee personal information
    async submitPersonalInformationForm() {
      this.loading = true;
      this.error = null;
      // Prepare payload
      const payload = {
        id: this.personalFormData.id,
        staff_id: this.personalFormData.staff_id,
        current_address: this.personalFormData.current_address,
        permanent_address: this.personalFormData.permanent_address,
        marital_status: this.personalFormData.marital_status,
        mobile_phone: this.personalFormData.mobile_phone,
        nationality: this.personalFormData.nationality,
        religion: this.personalFormData.religion,
        social_security_number: this.personalFormData.social_security_number,
        tax_number: this.personalFormData.tax_number,
        // Add more fields as needed...

        // Nested related models:
        employee_identification: {
          id_type: this.personalFormData.employee_identification?.id_type,
          document_number: this.personalFormData.employee_identification?.document_number,
          // Add other fields if your backend expects them
        },

        languages: Array.isArray(this.personalFormData.languages)
          ? this.personalFormData.languages.filter(Boolean)
          : [],
      };

      // Optionally, clean up undefined/null fields
      Object.keys(payload).forEach(
        (k) => (payload[k] == null || payload[k] === '') && delete payload[k]
      );

      try {

        const response = await employeeService.updateEmployeePersonalInformation(this.employee.id, payload);

        if (response && response.success) {
          this.$emit('employee-updated', response.data);
          this.alertMessagePersonal = response.message || "Personal information updated";
          this.alertClassPersonal = "alert-success";
        } else {
          this.alertMessagePersonal = (response && response.message) || "Failed to update personal information";
          this.alertClassPersonal = "alert-danger";
        }
        return response;
      } catch (error) {
        this.error = error.message || "Failed to update personal information";
        this.alertMessagePersonal = this.error;
        this.alertClassPersonal = "alert-danger";
        throw error;
      } finally {
        this.loading = false;
      }
    },


    // update employee basic information
    async updateBasicInformation() {
      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.updateBasicInformation(this.employee.id, this.editFormData);

        // The API returns: { success: true, message: "...", data: { ...employee... } }
        if (response && response.success) {
          this.$emit('employee-updated', response.data);
          this.alertMessageBasic = response.message || "Employee basic information updated successfully";
          this.alertClassBasic = "alert-success";
        } else {
          this.alertMessageBasic = (response && response.message) || "Failed to update basic information";
          this.alertClassBasic = "alert-danger";
        }
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update basic information';
        this.alertMessageBasic = this.error;
        this.alertClassBasic = "alert-danger";
        throw error;
      } finally {
        this.loading = false;
      }
    },



    async initFetchIdTypes() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      this.idTypes = lookupStore.getLookupsByType('identification_types');

    },

    async initFetchGender() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      this.genders = lookupStore.getLookupsByType('gender');
    },

    async initFetchNationality() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      this.nationalities = lookupStore.getLookupsByType('nationality');
    },

    async initFetchReligion() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      this.religions = lookupStore.getLookupsByType('religion');
    },

    async initFetchMaritalStatus() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      this.maritalStatuses = lookupStore.getLookupsByType('marital_status');
    },

    async initFetchEmployeeStatus() {
      const lookupStore = useLookupStore();

      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      this.statuses = lookupStore.getLookupsByType('employee_status');
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

    async initFetchEmployeeInitialEN() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      // SET the options, not just return
      this.employeeInitialEN = lookupStore.getLookupsByType('employee_initial_en') || [];
    },

    async initFetchEmployeeInitialTH() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      // SET the options, not just return
      this.employeeInitialTH = lookupStore.getLookupsByType('employee_initial_th') || [];
    },


    async initFetchEmployeeLanguage() {
      const lookupStore = useLookupStore();
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookups();
      }
      this.languages = lookupStore.getLookupsByType('employee_language');
    },



    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    toggleShow1() {
      this.showPassword1 = !this.showPassword1;
    },

    submitFormOne() {
      this.$router.push("/employee/employee-grid");
    },
    async fetchGrantPositions() {
      try {
        const response = await grantService.getAllGrantItems();
        if (response.data) {
          this.grantPositions = response.data;
        }
      } catch (error) {
        console.error("Error fetching grant positions:", error);
      }
    },
    async submitGrantPosition() {
      try {
        this.isSubmitting = true;
        this.alertMessage = '';
        this.alertClass = '';

        // Validate employment ID
        if (!this.employee || !this.employee.employment || !this.employee.employment.id) {
          throw new Error("No employment record found for this employee");
        }

        // Validate grant item selection
        if (!this.form.grant_items_id) {
          throw new Error("Please select a grant position");
        }

        // Validate dates
        if (!this.form.start_date) {
          throw new Error("Start date is required");
        }

        // Prepare payload with employmentId from parent
        const payload = {
          employment_id: this.employee.employment.id,
          grant_items_id: this.form.grant_items_id,
          level_of_effort: this.form.level_of_effort,
          start_date: this.formatDate(this.form.start_date),
          end_date: this.formatDate(this.form.end_date),
          active: this.form.active,
        };

        await employmentService.addGrantAllocation(payload);

        // Show success message
        this.alertMessage = "Grant position successfully added!";
        this.alertClass = "alert-success";

        // Emit event to parent to reload employee detail
        this.$emit("grantPositionAdded");

        // Reset form after short delay to allow user to see success message
        setTimeout(() => {
          this.resetForm();

          const modalEl = document.getElementById("add_grant_position");
          if (modalEl) {
            const modal = Modal.getInstance(modalEl);
            modal.hide();
          }
        }, 1500);

      } catch (error) {
        this.alertClass = "alert-danger";

        if (error.message.includes("employment")) {
          this.alertMessage = "Error: No employment record found for this employee";
        } else if (error.message.includes("grant position")) {
          this.alertMessage = "Error: " + error.message;
        } else if (error.message.includes("date")) {
          this.alertMessage = "Error: " + error.message;
        } else if (error.response && error.response.data && error.response.data.message) {
          this.alertMessage = "Error: " + error.response.data.message;
        } else {
          this.alertMessage = "Error adding grant allocation: " + error.message;
        }

        console.error("Error adding grant allocation:", error);
      } finally {
        this.isSubmitting = false;
      }
    },

    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      return [year, month, day].join("-");
    },

    resetForm() {
      this.form = {
        grant_items_id: null,
        level_of_effort: 100,
        start_date: null,
        end_date: null,
        active: true,
      };
      this.alertMessage = '';
      this.alertClass = '';
    },

    // ===== CHILD CRUD METHODS =====

    // Create or Update Child
    async submitChildForm() {
      try {
        this.isSubmitting = true;

        // Validate required fields
        if (!this.childForm.name) {
          this.$message.error('Child name is required');
          return;
        }

        // Prepare payload
        const payload = {
          employee_id: this.employee.id,
          name: this.childForm.name,
          date_of_birth: this.formatDate(this.childForm.date_of_birth),
        };

        let response;
        if (this.isEditingChild && this.childForm.id) {
          // Update existing child
          response = await employeeChildrenService.updateEmployeeChild(this.childForm.id, payload);
        } else {
          // Create new child
          response = await employeeChildrenService.createEmployeeChild(payload);
        }

        // Check for both possible success indicators
        if (response && (response.success === true || response.status === "success")) {
          this.$message.success(response.message || `Child ${this.isEditingChild ? 'updated' : 'added'} successfully`);

          // Emit event to parent to reload employee details
          this.$emit('employee-updated');

          // Reset form and close modal
          this.resetChildForm();
          this.closeChildModal();
        } else {
          this.$message.error(response?.message || `Failed to ${this.isEditingChild ? 'update' : 'add'} child`);
        }
      } catch (error) {
        console.error('Error submitting child form:', error);
        this.$message.error(`Error ${this.isEditingChild ? 'updating' : 'adding'} child: ` + (error.message || 'Unknown error'));
      } finally {
        this.isSubmitting = false;
      }
    },

    // Open Add Child Modal
    openAddChildModal() {
      this.resetChildForm();
      this.isEditingChild = false;
      const modalEl = document.getElementById('add_child');
      const modal = Modal.getOrCreateInstance(modalEl);
      modal.show();
    },

    // Open Edit Child Modal
    openEditChildModal(child) {
      this.isEditingChild = true;
      this.editingChild = child;

      // Populate form with child data
      this.childForm = {
        id: child.id,
        employee_id: child.employee_id,
        name: child.name,
        date_of_birth: child.date_of_birth ? new Date(child.date_of_birth) : null,
      };

      const modalEl = document.getElementById('add_child');
      const modal = Modal.getOrCreateInstance(modalEl);
      modal.show();
    },

    // Delete Child
    async deleteChild(childId) {
      try {
        // Show confirmation dialog
        const confirmed = await this.$confirm({
          title: 'Confirm Delete',
          content: 'Are you sure you want to delete this child record? This action cannot be undone.',
          okText: 'Yes, Delete',
          okType: 'danger',
          cancelText: 'Cancel',
          centered: true,
        });

        if (confirmed) {
          const response = await employeeChildrenService.deleteEmployeeChild(childId);

          // Check for both possible success indicators
          if (response && (response.success === true || response.status === "success")) {
            this.$message.success(response.message || 'Child deleted successfully');

            // Emit event to parent to reload employee details
            this.$emit('employee-updated');
          } else {
            this.$message.error(response?.message || 'Failed to delete child');
          }
        }
      } catch (error) {
        if (error === 'cancel') {
          // User cancelled, do nothing
          return;
        }
        console.error('Error deleting child:', error);
        this.$message.error('Error deleting child: ' + (error.message || 'Unknown error'));
      }
    },

    // Reset Child Form
    resetChildForm() {
      this.childForm = {
        id: null,
        employee_id: '',
        name: '',
        date_of_birth: '',
      };
      this.editingChild = null;
      this.isEditingChild = false;
    },

    // Close Child Modal
    closeChildModal() {
      const modalEl = document.getElementById('add_child');
      const modal = Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    },

    // ===== END CHILD CRUD METHODS =====
  },

  mounted() {
    this.fetchGrantPositions();
  },
};
</script>

<style scoped>
.modal-content {
  padding: 20px;
}

.alert {
  margin-bottom: 15px;
}
</style>
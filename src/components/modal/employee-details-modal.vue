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
          <button type="button" class="btn-close custom-btn-close" @click="handleModalClose('edit_employee')"
            aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <!-- Restored Data Notification -->
        <div v-if="restoredDataNotification.editForm" class="alert alert-info alert-dismissible fade show mx-3 mt-2"
          role="alert">
          <i class="ti ti-info-circle me-2"></i>
          Restored your previous unsaved changes from {{ formatRestoredTime(restoredDataNotification.editFormTime) }}
          <button type="button" class="btn-close" @click="restoredDataNotification.editForm = false"></button>
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
                  <select id="edit-subsidiary" v-model="editFormData.subsidiary" class="form-control" required
                    @change="saveFormState('editFormData')">
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
                  <input type="text" class="form-control" placeholder="Enter staff ID" v-model="editFormData.staff_id"
                    @input="saveFormState('editFormData')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="edit-initial-en">Initial (EN)</label>
                  <select id="edit-initial-en" v-model="editFormData.initial_en" class="form-control"
                    @change="saveFormState('editFormData')">
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
                  <select id="edit-initial-th" v-model="editFormData.initial_th" class="form-control"
                    @change="saveFormState('editFormData')">
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
                    v-model="editFormData.first_name_en" @input="saveFormState('editFormData')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Last Name (EN)</label>
                  <input type="text" class="form-control" maxlength="255" placeholder="Enter English last name"
                    v-model="editFormData.last_name_en" @input="saveFormState('editFormData')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">First Name (TH)</label>
                  <input type="text" class="form-control" maxlength="255" placeholder="Enter Thai first name"
                    v-model="editFormData.first_name_th" @input="saveFormState('editFormData')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Last Name (TH)</label>
                  <input type="text" class="form-control" maxlength="255" placeholder="Enter Thai last name"
                    v-model="editFormData.last_name_th" @input="saveFormState('editFormData')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-block mb-3">
                  <label class="form-label" for="edit-gender">Gender <span class="text-danger"> *</span></label>
                  <select id="edit-gender" v-model="editFormData.gender" class="form-control" required
                    @change="saveFormState('editFormData')">
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
                      :clearable="false" :input-format="dateFormat" v-model="editFormData.date_of_birth"
                      @update:model-value="handleDateChange('editFormData', 'date_of_birth', $event)" />
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
                  <select id="edit-employee-status" v-model="editFormData.status" class="form-control" required
                    @change="saveFormState('editFormData')">
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
            <button type="button" class="btn btn-outline-light border me-2" @click="handleModalClose('edit_employee')">
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
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Personal Information</h4>
          <span>Staff ID : {{ personalFormData.staff_id }}</span>
          <button type="button" class="btn-close custom-btn-close" @click="handleModalClose('edit_personal')"
            aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <!-- Restored Data Notification -->
        <div v-if="restoredDataNotification.personalForm" class="alert alert-info alert-dismissible fade show mx-3 mt-2"
          role="alert">
          <i class="ti ti-info-circle me-2"></i>
          Restored your previous unsaved changes from {{ formatRestoredTime(restoredDataNotification.personalFormTime)
          }}
          <button type="button" class="btn-close" @click="restoredDataNotification.personalForm = false"></button>
        </div>

        <div v-if="alertMessagePersonal" class="alert" :class="alertClassPersonal" role="alert">
          {{ alertMessagePersonal }}
        </div>
        <form @submit.prevent="submitPersonalInformationForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Phone <span class="text-danger"> *</span></label>
                  <input type="tel" class="form-control" v-model="personalFormData.mobile_phone"
                    placeholder="Enter phone number" required @input="saveFormState('personalFormData')" />
                </div>
              </div>

              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label" for="edit-nationality">Nationality <span class="text-danger">
                      *</span></label>
                  <select id="edit-nationality" class="form-select" v-model="personalFormData.nationality"
                    @change="saveFormState('personalFormData')">
                    <option value="" disabled>Select Nationality</option>
                    <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.value"
                      :class="['text-secondary']">
                      {{ nationality.value }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Social Security Number</label>
                  <input type="text" class="form-control" v-model="personalFormData.social_security_number"
                    placeholder="Enter SSN" @input="saveFormState('personalFormData')" />
                </div>
              </div>

              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Tax Number</label>
                  <input type="text" class="form-control" v-model="personalFormData.tax_number"
                    placeholder="Enter tax number" @input="saveFormState('personalFormData')" />
                </div>
              </div>

              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Religion <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="personalFormData.religion"
                    @change="saveFormState('personalFormData')">
                    <option value="" disabled selected>Select Religion</option>
                    <option v-for="religion in religions" :key="religion.id" :value="religion.value">
                      {{ religion.value }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Marital Status <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="personalFormData.marital_status"
                    @change="saveFormState('personalFormData')">
                    <option value="" disabled selected>Select Marital Status</option>
                    <option v-for="status in maritalStatuses" :key="status.id" :value="status.value">
                      {{ status.value }}
                    </option>
                  </select>
                </div>
              </div>

              <template v-if="personalFormData.marital_status === 'Married'">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Spouse Name</label>
                    <input type="text" class="form-control" v-model="personalFormData.spouse_name"
                      placeholder="Enter spouse name" @input="saveFormState('personalFormData')" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Spouse Mobile</label>
                    <input type="tel" class="form-control" v-model="personalFormData.spouse_mobile"
                      placeholder="Enter spouse mobile number" @input="saveFormState('personalFormData')" />
                  </div>
                </div>
              </template>

              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Languages</label>
                  <a-select v-model:value="personalFormData.languages" mode="multiple" style="width: 100%"
                    placeholder="Select languages"
                    :options="languages.map(language => ({ value: language.value, label: language.value }))"
                    @change="saveFormState('personalFormData')"></a-select>

                </div>
              </div>

              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Current Address <span class="text-danger"> *</span></label>
                  <textarea class="form-control" v-model="personalFormData.current_address"
                    placeholder="Enter current address" rows="3" required
                    @input="saveFormState('personalFormData')"></textarea>
                </div>
              </div>

              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Permanent Address <span class="text-danger"> *</span></label>
                  <textarea class="form-control" v-model="personalFormData.permanent_address"
                    placeholder="Enter permanent address" rows="3" required
                    @input="saveFormState('personalFormData')"></textarea>
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
                            required @change="saveFormState('personalFormData')">
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
                            placeholder="Enter ID number" @input="saveFormState('personalFormData')" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2"
              @click="handleModalClose('edit_personal')">Cancel</button>
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

  <!-- Add/Edit Beneficiary Modal -->
  <div class="modal fade" id="add_beneficiary">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ $parent.isEditingBeneficiary ? 'Edit Beneficiary' : 'Add Beneficiary' }}</h4>
          <button type="button" class="btn-close custom-btn-close" @click="$parent.closeBeneficiaryModal()"
            aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <form @submit.prevent="$parent.submitBeneficiaryForm()">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Beneficiary Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="$parent.beneficiaryForm.beneficiary_name" required
                    placeholder="Enter beneficiary name" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Relationship <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="$parent.beneficiaryForm.beneficiary_relationship" required>
                    <option value="" disabled>Select Relationship</option>
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
                  <input type="tel" class="form-control" v-model="$parent.beneficiaryForm.phone_number" required
                    placeholder="Enter phone number" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2"
              @click="$parent.closeBeneficiaryModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="$parent.isSubmitting">
              <span v-if="$parent.isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              {{ $parent.isEditingBeneficiary ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Beneficiary Modal -->



  <!-- Add/Edit Bank Information Modal -->
  <div class="modal fade" id="edit_bank">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ isEditingBank ? 'Edit' : 'Add' }} Bank Information</h4>
          <button type="button" class="btn-close custom-btn-close" @click="handleModalClose('edit_bank')"
            aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <!-- Restored Data Notification -->
        <div v-if="restoredDataNotification.bankForm" class="alert alert-info alert-dismissible fade show mx-3 mt-2"
          role="alert">
          <i class="ti ti-info-circle me-2"></i>
          Restored your previous unsaved changes
          <button type="button" class="btn-close" @click="restoredDataNotification.bankForm = false"></button>
        </div>

        <form @submit.prevent="submitBankForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Bank Name <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="bankForm.bank_name" required @change="saveFormState('bankForm')">
                    <option value="" disabled selected>Select Bank</option>
                    <option value="Bangkok Bank">Bangkok Bank</option>
                    <option value="Kasikorn Bank">Kasikorn Bank</option>
                    <option value="Siam Commercial Bank">Siam Commercial Bank</option>
                    <option value="Krung Thai Bank">Krung Thai Bank</option>
                    <option value="Bank of Ayudhya">Bank of Ayudhya</option>
                    <option value="TMBThanachart Bank">TMBThanachart Bank</option>
                    <option value="Government Savings Bank">Government Savings Bank</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Bank Account Number <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="bankForm.bank_account_number" required
                    placeholder="Enter account number" @input="saveFormState('bankForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Account Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="bankForm.bank_account_name" required
                    placeholder="Enter account holder name" @input="saveFormState('bankForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Branch <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="bankForm.bank_branch" required
                    placeholder="Enter branch name" @input="saveFormState('bankForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">SWIFT Code</label>
                  <input type="text" class="form-control" v-model="bankForm.swift_code" placeholder="Enter SWIFT code"
                    @input="saveFormState('bankForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Account Type</label>
                  <select class="form-select" v-model="bankForm.account_type" @change="saveFormState('bankForm')">
                    <option value="" disabled selected>Select Account Type</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Current">Current Account</option>
                    <option value="Fixed">Fixed Deposit</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2"
              @click="handleModalClose('edit_bank')">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              {{ isEditingBank ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add/Edit Bank Information Modal -->

  <!-- Add/Edit Family Information Modal -->
  <div class="modal fade" id="edit_familyinformation">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ isEditingFamily ? 'Edit' : 'Add' }} Family Information</h4>
          <button type="button" class="btn-close custom-btn-close" @click="handleModalClose('edit_familyinformation')"
            aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <!-- Restored Data Notification -->
        <div v-if="restoredDataNotification.familyForm" class="alert alert-info alert-dismissible fade show mx-3 mt-2"
          role="alert">
          <i class="ti ti-info-circle me-2"></i>
          Restored your previous unsaved changes
          <button type="button" class="btn-close" @click="restoredDataNotification.familyForm = false"></button>
        </div>

        <form @submit.prevent="submitFamilyForm">
          <div class="modal-body pb-0">
            <div class="row">
              <!-- Father Information -->
              <div class="col-md-12">
                <h6 class="mb-3"><i class="ti ti-user me-2"></i>Father Information</h6>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Father's Name</label>
                  <input type="text" class="form-control" v-model="familyForm.father_name"
                    placeholder="Enter father's name" @input="saveFormState('familyForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Father's Occupation</label>
                  <input type="text" class="form-control" v-model="familyForm.father_occupation"
                    placeholder="Enter father's occupation" @input="saveFormState('familyForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Father's Phone</label>
                  <input type="tel" class="form-control" v-model="familyForm.father_phone"
                    placeholder="Enter father's phone" @input="saveFormState('familyForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Father's Date of Birth</label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="familyForm.father_date_of_birth" class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="true" :input-format="dateFormat"
                      @update:model-value="handleDateChange('familyForm', 'father_date_of_birth', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Mother Information -->
              <div class="col-md-12">
                <hr class="my-3">
                <h6 class="mb-3"><i class="ti ti-user me-2"></i>Mother Information</h6>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Mother's Name</label>
                  <input type="text" class="form-control" v-model="familyForm.mother_name"
                    placeholder="Enter mother's name" @input="saveFormState('familyForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Mother's Occupation</label>
                  <input type="text" class="form-control" v-model="familyForm.mother_occupation"
                    placeholder="Enter mother's occupation" @input="saveFormState('familyForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Mother's Phone</label>
                  <input type="tel" class="form-control" v-model="familyForm.mother_phone"
                    placeholder="Enter mother's phone" @input="saveFormState('familyForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Mother's Date of Birth</label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="familyForm.mother_date_of_birth" class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="true" :input-format="dateFormat"
                      @update:model-value="handleDateChange('familyForm', 'mother_date_of_birth', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Emergency Contact -->
              <div class="col-md-12">
                <hr class="my-3">
                <h6 class="mb-3"><i class="ti ti-phone me-2"></i>Emergency Contact</h6>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Emergency Contact Name</label>
                  <input type="text" class="form-control" v-model="familyForm.emergency_contact_name"
                    placeholder="Enter emergency contact name" @input="saveFormState('familyForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Emergency Contact Relationship</label>
                  <input type="text" class="form-control" v-model="familyForm.emergency_contact_relationship"
                    placeholder="Enter relationship" @input="saveFormState('familyForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Emergency Contact Phone</label>
                  <input type="tel" class="form-control" v-model="familyForm.emergency_contact_phone"
                    placeholder="Enter emergency contact phone" @input="saveFormState('familyForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Emergency Contact Address</label>
                  <textarea class="form-control" v-model="familyForm.emergency_contact_address" rows="2"
                    placeholder="Enter emergency contact address" @input="saveFormState('familyForm')"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2"
              @click="handleModalClose('edit_familyinformation')">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              {{ isEditingFamily ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add/Edit Family Information Modal -->

  <!-- Add/Edit Education Modal -->
  <div class="modal fade" id="edit_education">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ isEditingEducation ? 'Edit' : 'Add' }} Education Information</h4>
          <button type="button" class="btn-close custom-btn-close" @click="handleModalClose('edit_education')"
            aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <!-- Restored Data Notification -->
        <div v-if="restoredDataNotification.educationForm"
          class="alert alert-info alert-dismissible fade show mx-3 mt-2" role="alert">
          <i class="ti ti-info-circle me-2"></i>
          Restored your previous unsaved changes
          <button type="button" class="btn-close" @click="restoredDataNotification.educationForm = false"></button>
        </div>

        <form @submit.prevent="submitEducationForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Institution Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="educationForm.institution_name" required
                    placeholder="Enter institution name" @input="saveFormState('educationForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Degree/Qualification <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="educationForm.degree" required
                    placeholder="Enter degree or qualification" @input="saveFormState('educationForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Field of Study</label>
                  <input type="text" class="form-control" v-model="educationForm.field_of_study"
                    placeholder="Enter field of study" @input="saveFormState('educationForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Education Level <span class="text-danger"> *</span></label>
                  <select class="form-select" v-model="educationForm.education_level" required
                    @change="saveFormState('educationForm')">
                    <option value="" disabled selected>Select Education Level</option>
                    <option value="Primary School">Primary School</option>
                    <option value="Secondary School">Secondary School</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctoral Degree">Doctoral Degree</option>
                    <option value="Professional Certificate">Professional Certificate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Start Date</label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="educationForm.start_date" class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="true" :input-format="dateFormat"
                      @update:model-value="handleDateChange('educationForm', 'start_date', $event)" />
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
                    <date-picker v-model="educationForm.end_date" class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="true" :input-format="dateFormat"
                      @update:model-value="handleDateChange('educationForm', 'end_date', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">GPA/Grade</label>
                  <input type="text" class="form-control" v-model="educationForm.gpa" placeholder="Enter GPA or grade"
                    @input="saveFormState('educationForm')" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Location</label>
                  <input type="text" class="form-control" v-model="educationForm.location" placeholder="Enter location"
                    @input="saveFormState('educationForm')" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Description/Notes</label>
                  <textarea class="form-control" v-model="educationForm.description" rows="3"
                    placeholder="Enter additional information about this education"
                    @input="saveFormState('educationForm')"></textarea>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" v-model="educationForm.status" @change="saveFormState('educationForm')">
                    <option value="" disabled selected>Select Status</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Honors/Awards</label>
                  <input type="text" class="form-control" v-model="educationForm.honors"
                    placeholder="Enter any honors or awards" @input="saveFormState('educationForm')" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2"
              @click="handleModalClose('edit_education')">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              {{ isEditingEducation ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add/Edit Education Modal -->

  <!-- Add Child Modal -->
  <div class="modal fade" id="add_child">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ isEditingChild ? 'Edit Child' : 'Add Child' }}</h4>
          <button type="button" class="btn-close custom-btn-close" @click="handleModalClose('add_child')"
            aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <!-- Restored Data Notification -->
        <div v-if="restoredDataNotification.childForm && !isEditingChild"
          class="alert alert-info alert-dismissible fade show mx-3 mt-2" role="alert">
          <i class="ti ti-info-circle me-2"></i>
          Restored your previous unsaved changes
          <button type="button" class="btn-close" @click="restoredDataNotification.childForm = false"></button>
        </div>

        <form @submit.prevent="submitChildForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Child Name <span class="text-danger"> *</span></label>
                  <input type="text" class="form-control" v-model="childForm.name" required
                    @input="saveFormState('childForm')" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Date of Birth</label>
                  <div class="input-icon-end position-relative">
                    <date-picker v-model="childForm.date_of_birth" class="form-control datetimepicker"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                      @update:model-value="handleDateChange('childForm', 'date_of_birth', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2"
              @click="handleModalClose('add_child')">Cancel</button>
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
import { ref, nextTick, createVNode } from "vue";
import { mapState, mapActions } from 'pinia';
import { useFormPersistenceStore } from '@/stores/formPersistenceStore';
import employmentService from "@/services/employment.service";
import { grantService } from "@/services/grant.service";
import { Modal } from 'bootstrap';
import { Modal as AntModal } from 'ant-design-vue'; // Add Ant Design Modal import
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'; // Add icon import
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
      alertClassBasic: '',
      alertClassPersonal: '',
      subsidiaries: [],
      genders: [],
      date_of_birth: '',
      nationalities: [],
      religions: [],
      maritalStatuses: [],
      statuses: [],
      employeeInitialEN: [],
      employeeInitialTH: [],
      idTypes: [],
      languages: [],
      startdate: currentDate,
      startdateOne: currentDateOne,
      startdateTwo: currentDateTwo,
      startdateThree: currentDateThree,
      startdateFour: currentDateFour,
      startdateFive: currentDateFive,
      startdateSix: currentDateSix,
      isDestroyed: false, // Track component destruction
      isComponentReady: false, // Track component readiness

      // Track which modal is being closed
      closingModal: null,

      // Track if forms have been restored
      restoredDataNotification: {
        editForm: false,
        personalForm: false,
        childForm: false,
        bankForm: false,
        familyForm: false,
        educationForm: false,
        editFormTime: null,
        personalFormTime: null,
      },

      personalFormData: {
        id: '',
        staff_id: '',
        mobile_phone: '',
        nationality: '',
        social_security_number: '',
        tax_number: '',
        religion: '',
        marital_status: '',
        spouse_name: '',
        spouse_mobile: '',
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
        date_of_birth: null, // Initialize as null instead of empty string
      },



      bankForm: {
        id: null,
        bank_name: '',
        bank_account_number: '',
        bank_account_name: '',
        bank_branch: '',
        swift_code: '',
        account_type: '',
      },

      familyForm: {
        id: null,
        father_name: '',
        father_occupation: '',
        father_phone: '',
        father_date_of_birth: null,
        mother_name: '',
        mother_occupation: '',
        mother_phone: '',
        mother_date_of_birth: null,
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
        emergency_contact_address: '',
      },

      educationForm: {
        id: null,
        institution_name: '',
        degree: '',
        field_of_study: '',
        education_level: '',
        start_date: null,
        end_date: null,
        gpa: '',
        location: '',
        description: '',
        status: '',
        honors: '',
      },

      selectedLanguages: [],

      childForm: {
        id: null,
        employee_id: '',
        name: '',
        date_of_birth: null, // Initialize as null instead of empty string
      },

      editingChild: null,
      isEditingChild: false,
      isEditingBeneficiary: false,
      isEditingBank: false,
      isEditingFamily: false,
      isEditingEducation: false,
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
    try {
      // Use single store initialization with error handling
      await this.initializeLookupData();

      // Mark component as ready
      this.isComponentReady = true;

      // Check for saved form data after data is loaded
      if (this.employee?.id && !this.isDestroyed) {
        await this.checkAndRestoreFormData();
      }
    } catch (error) {
      console.error('Error during component initialization:', error);
    }
  },

  computed: {
    ...mapState(useFormPersistenceStore, ['hasEmployeeUnsavedChanges']),

    calculatedAge() {
      const dobVal = this.editFormData.date_of_birth;
      if (!dobVal) return '';

      const dob = dobVal instanceof Date
        ? dobVal
        : new Date(dobVal);

      if (isNaN(dob.getTime())) return '';

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
    ...mapActions(useFormPersistenceStore, [
      'saveFormSection',
      'clearFormSection',
      'clearFormData',
      'markAsSaved',
      'checkForSavedData',
      'getEmployeeFormData'
    ]),

    // Safe date conversion helper
    safeConvertToDate(dateValue) {
      if (!dateValue) return null;

      try {
        // If it's already a Date object, return it
        if (dateValue instanceof Date) {
          return isNaN(dateValue.getTime()) ? null : dateValue;
        }

        // If it's a string, try to parse it
        if (typeof dateValue === 'string') {
          const parsedDate = new Date(dateValue);
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        }

        return null;
      } catch (error) {
        console.error('Error converting date:', error);
        return null;
      }
    },

    // Handle date picker changes
    handleDateChange(formName, fieldName, newValue) {
      if (this.isDestroyed || !this.isComponentReady) return;

      try {
        const safeDate = this.safeConvertToDate(newValue);
        this[formName][fieldName] = safeDate;
        this.saveFormState(formName);
      } catch (error) {
        console.error('Error handling date change:', error);
      }
    },

    // Initialize all lookup data in a single call
    async initializeLookupData() {
      if (this.isDestroyed) return;

      try {
        const lookupStore = useLookupStore();

        // Fetch all lookups once
        if (!lookupStore.lookups.length) {
          await lookupStore.fetchAllLookups();
        }

        if (this.isDestroyed) return;

        // Set all lookup data synchronously
        this.genders = lookupStore.getLookupsByType('gender') || [];
        this.nationalities = lookupStore.getLookupsByType('nationality') || [];
        this.religions = lookupStore.getLookupsByType('religion') || [];
        this.maritalStatuses = lookupStore.getLookupsByType('marital_status') || [];
        this.statuses = lookupStore.getLookupsByType('employee_status') || [];
        this.subsidiaries = lookupStore.getLookupsByType('subsidiary') || [];
        this.employeeInitialEN = lookupStore.getLookupsByType('employee_initial_en') || [];
        this.employeeInitialTH = lookupStore.getLookupsByType('employee_initial_th') || [];
        this.idTypes = lookupStore.getLookupsByType('identification_types') || [];
        this.languages = lookupStore.getLookupsByType('employee_language') || [];

      } catch (error) {
        console.error('Error initializing lookup data:', error);
      }
    },

    // Save form state to Pinia store
    saveFormState(formName) {
      if (!this.employee?.id || this.isDestroyed || !this.isComponentReady) return;

      try {
        this.saveFormSection(this.employee.id, formName, this[formName]);
      } catch (error) {
        console.error('Error saving form state:', error);
      }
    },

    // Check and restore saved form data
    async checkAndRestoreFormData() {
      if (this.isDestroyed || !this.isComponentReady) return;

      try {
        const savedData = await this.checkForSavedData(this.employee.id);

        if (savedData.hasSavedData && !this.isDestroyed) {
          // Ask user if they want to restore
          const shouldRestore = await this.confirmRestoreData(savedData.timestamp);

          if (shouldRestore && !this.isDestroyed) {
            this.restoreFormData(savedData.data);
          } else if (!this.isDestroyed) {
            // Clear saved data if user doesn't want to restore
            this.clearFormData(this.employee.id);
          }
        }
      } catch (error) {
        console.error('Error checking for saved data:', error);
      }
    },

    // Confirm if user wants to restore saved data - UPDATED to use Ant Design
    async confirmRestoreData(timestamp) {
      const timeAgo = this.getTimeAgo(timestamp);

      return new Promise((resolve) => {
        AntModal.confirm({
          title: 'Restore Unsaved Changes',
          icon: createVNode(ExclamationCircleOutlined),
          content: createVNode('div', { style: 'margin-top: 16px;' }, [
            createVNode('p', { style: 'margin-bottom: 8px; color: #666;' }, `You have unsaved changes from ${timeAgo}.`),
            createVNode('p', { style: 'margin-bottom: 0; font-weight: 500;' }, 'Would you like to restore them?')
          ]),
          okText: 'Restore Changes',
          okType: 'primary',
          cancelText: 'Start Fresh',
          centered: true,
          width: 420,
          maskClosable: false,
          keyboard: false,
          onOk: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          }
        });
      });
    },

    // Restore form data from saved state
    restoreFormData(savedData) {
      if (this.isDestroyed || !this.isComponentReady) return;

      try {
        if (savedData.editFormData) {
          const editData = { ...savedData.editFormData };
          // Safely convert date field
          if (editData.date_of_birth) {
            editData.date_of_birth = this.safeConvertToDate(editData.date_of_birth);
          }
          Object.assign(this.editFormData, editData);
          this.restoredDataNotification.editForm = true;
          this.restoredDataNotification.editFormTime = savedData.editFormData.timestamp || Date.now();
        }

        if (savedData.personalFormData) {
          Object.assign(this.personalFormData, savedData.personalFormData);
          this.restoredDataNotification.personalForm = true;
          this.restoredDataNotification.personalFormTime = savedData.personalFormData.timestamp || Date.now();
        }



        if (savedData.bankForm) {
          Object.assign(this.bankForm, savedData.bankForm);
          this.restoredDataNotification.bankForm = true;
        }

        if (savedData.familyForm) {
          const familyData = { ...savedData.familyForm };
          // Safely convert date fields
          if (familyData.father_date_of_birth) {
            familyData.father_date_of_birth = this.safeConvertToDate(familyData.father_date_of_birth);
          }
          if (familyData.mother_date_of_birth) {
            familyData.mother_date_of_birth = this.safeConvertToDate(familyData.mother_date_of_birth);
          }
          Object.assign(this.familyForm, familyData);
          this.restoredDataNotification.familyForm = true;
        }

        if (savedData.educationForm) {
          const educationData = { ...savedData.educationForm };
          // Safely convert date fields
          if (educationData.start_date) {
            educationData.start_date = this.safeConvertToDate(educationData.start_date);
          }
          if (educationData.end_date) {
            educationData.end_date = this.safeConvertToDate(educationData.end_date);
          }
          Object.assign(this.educationForm, educationData);
          this.restoredDataNotification.educationForm = true;
        }

        if (savedData.childForm && !this.isEditingChild) {
          const childData = { ...savedData.childForm };
          // Safely convert date field
          if (childData.date_of_birth) {
            childData.date_of_birth = this.safeConvertToDate(childData.date_of_birth);
          }
          Object.assign(this.childForm, childData);
          this.restoredDataNotification.childForm = true;
        }
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    },

    // Format restored time for display
    formatRestoredTime(timestamp) {
      if (!timestamp) return 'earlier';
      return this.getTimeAgo(timestamp);
    },

    // Get human-readable time ago
    getTimeAgo(timestamp) {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      if (seconds < 60) return 'just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
    },

    // Safe modal show helper
    safeShowModal(modalId) {
      return new Promise((resolve) => {
        if (this.isDestroyed || !this.isComponentReady) {
          resolve(false);
          return;
        }

        nextTick(() => {
          if (this.isDestroyed) {
            resolve(false);
            return;
          }

          const modalEl = document.getElementById(modalId);
          if (!modalEl) {
            console.warn(`Modal ${modalId} not found`);
            resolve(false);
            return;
          }

          try {
            let modal = Modal.getInstance(modalEl);
            if (!modal) {
              modal = new Modal(modalEl);
            }

            modalEl.addEventListener('shown.bs.modal', () => {
              resolve(true);
            }, { once: true });

            modal.show();
          } catch (error) {
            console.error(`Error showing modal ${modalId}:`, error);
            resolve(false);
          }
        });
      });
    },

    // Safe modal hide helper
    safeHideModal(modalId) {
      return new Promise((resolve) => {
        if (this.isDestroyed) {
          resolve(true);
          return;
        }

        nextTick(() => {
          if (this.isDestroyed) {
            resolve(true);
            return;
          }

          const modalEl = document.getElementById(modalId);
          if (!modalEl) {
            resolve(true);
            return;
          }

          try {
            const modal = Modal.getInstance(modalEl);
            if (modal) {
              modalEl.addEventListener('hidden.bs.modal', () => {
                this.cleanupModalBackdrops();
                resolve(true);
              }, { once: true });

              modal.hide();
            } else {
              resolve(true);
            }
          } catch (error) {
            console.error(`Error hiding modal ${modalId}:`, error);
            resolve(false);
          }
        });
      });
    },

    // Clean up stray modal backdrops
    cleanupModalBackdrops() {
      if (this.isDestroyed) return;

      nextTick(() => {
        if (this.isDestroyed) return;

        const backdrops = document.querySelectorAll('.modal-backdrop');
        const activeModals = document.querySelectorAll('.modal.show');

        if (activeModals.length === 0 && backdrops.length > 0) {
          backdrops.forEach(backdrop => backdrop.remove());
        }
      });
    },

    // Handle modal close with unsaved changes check - UPDATED to single-tier
    async handleModalClose(modalId) {
      if (this.isDestroyed || !this.isComponentReady) return;

      if (!this.employee?.id) {
        await this.safeHideModal(modalId);
        return;
      }

      const hasUnsaved = this.hasEmployeeUnsavedChanges(this.employee.id);

      if (hasUnsaved) {
        // Use single-tier Ant Design confirm
        this.showUnsavedChangesConfirm(modalId);
      } else {
        await this.safeHideModal(modalId);
      }
    },

    // Show single-tier Ant Design confirm dialog for unsaved changes
    showUnsavedChangesConfirm(modalId) {
      AntModal.confirm({
        title: 'Unsaved Changes',
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode('div', { style: 'margin-top: 16px;' }, [
          createVNode('p', { style: 'margin-bottom: 12px; color: #666;' }, 'You have unsaved changes in the employee form.'),
          createVNode('p', { style: 'margin-bottom: 0; font-weight: 500;' }, 'What would you like to do?')
        ]),
        centered: true,
        width: 440,
        maskClosable: false,
        keyboard: false,

        okText: 'Continue Editing',
        okType: 'default',
        cancelText: 'Discard Changes',
        cancelButtonProps: {
          danger: true
        },

        onOk: () => {
          console.log('User chose to continue editing');
          return Promise.resolve();
        },

        onCancel: () => {
          console.log('User chose to discard changes');
          this.discardChangesAndClose(modalId);
          return Promise.resolve();
        }
      });
    },

    // Discard changes and close specific modal
    async discardChangesAndClose(modalId) {
      if (this.isDestroyed) return;

      try {
        // Clear saved data for this employee
        this.clearFormData(this.employee.id);

        // Reset forms
        this.resetAllForms();

        // Close the specific modal
        await this.safeHideModal(modalId);

        console.log('✅ Discarded changes and closed modal');
      } catch (error) {
        console.error('❌ Error discarding changes:', error);
      }
    },

    // Reset all forms
    resetAllForms() {
      if (this.isDestroyed) return;

      try {
        // Reset to original employee data or empty
        if (this.employee) {
          this.editFormData = {
            id: this.employee.id,
            first_name_en: this.employee.first_name_en || '',
            last_name_en: this.employee.last_name_en || '',
            first_name_th: this.employee.first_name_th || '',
            last_name_th: this.employee.last_name_th || '',
            initial_en: this.employee.initial_en || '',
            initial_th: this.employee.initial_th || '',
            staff_id: this.employee.staff_id || '',
            status: this.employee.status || '',
            subsidiary: this.employee.subsidiary || '',
            gender: this.employee.gender || '',
            date_of_birth: this.safeConvertToDate(this.employee.date_of_birth),
          };

          this.personalFormData = {
            id: this.employee.id,
            staff_id: this.employee.staff_id || '',
            mobile_phone: this.employee.mobile_phone || '',
            nationality: this.employee.nationality || '',
            social_security_number: this.employee.social_security_number || '',
            tax_number: this.employee.tax_number || '',
            religion: this.employee.religion || '',
            marital_status: this.employee.marital_status || '',
            spouse_name: this.employee.spouse_name || '',
            spouse_mobile: this.employee.spouse_mobile || '',
            languages: this.employee.languages || [],
            current_address: this.employee.current_address || '',
            permanent_address: this.employee.permanent_address || '',
            employee_identification: this.employee.employee_identification || {
              id_type: '',
              document_number: ''
            },
          };
        }

        // Reset other forms
        this.resetBankForm();
        this.resetFamilyForm();
        this.resetEducationForm();
        this.resetChildForm();
      } catch (error) {
        console.error('Error resetting forms:', error);
      }
    },

    // Update employee personal information
    async submitPersonalInformationForm() {
      if (this.isDestroyed) return;

      this.loading = true;
      this.error = null;

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
        spouse_name: this.personalFormData.spouse_name,
        spouse_mobile: this.personalFormData.spouse_mobile,
        employee_identification: {
          id_type: this.personalFormData.employee_identification?.id_type,
          document_number: this.personalFormData.employee_identification?.document_number,
        },
        languages: Array.isArray(this.personalFormData.languages)
          ? this.personalFormData.languages.filter(Boolean)
          : [],
      };

      Object.keys(payload).forEach(
        (k) => (payload[k] == null || payload[k] === '') && delete payload[k]
      );

      try {
        const response = await employeeService.updateEmployeePersonalInformation(this.employee.id, payload);

        if (this.isDestroyed) return;

        if (response && response.success) {
          this.$emit('employee-updated', response.data);
          this.alertMessagePersonal = response.message || "Personal information updated";
          this.alertClassPersonal = "alert-success";

          // Clear saved form data and mark as saved
          this.clearFormSection(this.employee.id, 'personalFormData');
          this.markAsSaved(this.employee.id);
        } else {
          this.alertMessagePersonal = (response && response.message) || "Failed to update personal information";
          this.alertClassPersonal = "alert-danger";
        }
        return response;
      } catch (error) {
        if (this.isDestroyed) return;

        this.error = error.message || "Failed to update personal information";
        this.alertMessagePersonal = this.error;
        this.alertClassPersonal = "alert-danger";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update employee basic information
    async updateBasicInformation() {
      if (this.isDestroyed) return;

      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.updateBasicInformation(this.employee.id, this.editFormData);

        if (this.isDestroyed) return;

        if (response && response.success) {
          this.$emit('employee-updated', response.data);
          this.alertMessageBasic = response.message || "Employee basic information updated successfully";
          this.alertClassBasic = "alert-success";

          // Clear saved form data and mark as saved
          this.clearFormSection(this.employee.id, 'editFormData');
          this.markAsSaved(this.employee.id);
        } else {
          this.alertMessageBasic = (response && response.message) || "Failed to update basic information";
          this.alertClassBasic = "alert-danger";
        }
        return response;
      } catch (error) {
        if (this.isDestroyed) return;

        this.error = error.message || 'Failed to update basic information';
        this.alertMessageBasic = this.error;
        this.alertClassBasic = "alert-danger";
        throw error;
      } finally {
        this.loading = false;
      }
    },



    // Submit bank form
    async submitBankForm() {
      if (this.isDestroyed) return;

      try {
        this.isSubmitting = true;

        // Validate required fields
        if (!this.bankForm.bank_name || !this.bankForm.bank_account_number || !this.bankForm.bank_account_name || !this.bankForm.bank_branch) {
          this.$message.error('Please fill in all required fields');
          return;
        }

        const payload = {
          employee_id: this.employee.id,
          bank_name: this.bankForm.bank_name,
          bank_account_number: this.bankForm.bank_account_number,
          bank_account_name: this.bankForm.bank_account_name,
          bank_branch: this.bankForm.bank_branch,
          swift_code: this.bankForm.swift_code,
          account_type: this.bankForm.account_type,
        };

        // Add API call here
        // const response = await bankService.createOrUpdateBank(payload);
        console.log('Bank payload ready for API:', payload);

        this.$message.success(`Bank information ${this.isEditingBank ? 'updated' : 'added'} successfully`);
        this.$emit('employee-updated');

        // Clear saved form data after successful submission
        this.clearFormSection(this.employee.id, 'bankForm');
        this.markAsSaved(this.employee.id);

        // Reset form
        this.resetBankForm();

        // Close modal
        await this.safeHideModal('edit_bank');
      } catch (error) {
        console.error('Error submitting bank form:', error);
        this.$message.error('Error saving bank information');
      } finally {
        this.isSubmitting = false;
      }
    },

    // Reset bank form
    resetBankForm() {
      if (this.isDestroyed) return;

      this.bankForm = {
        id: null,
        bank_name: '',
        bank_account_number: '',
        bank_account_name: '',
        bank_branch: '',
        swift_code: '',
        account_type: '',
      };
      this.isEditingBank = false;
    },

    // Open Bank Modal (for both add and edit)
    async openBankModal(bankData = null) {
      if (this.isDestroyed) return;

      if (bankData) {
        // Edit mode
        this.isEditingBank = true;
        this.bankForm = {
          id: bankData.id,
          bank_name: bankData.bank_name || '',
          bank_account_number: bankData.bank_account_number || '',
          bank_account_name: bankData.bank_account_name || '',
          bank_branch: bankData.bank_branch || '',
          swift_code: bankData.swift_code || '',
          account_type: bankData.account_type || '',
        };
      } else {
        // Add mode
        this.isEditingBank = false;
        this.resetBankForm();
      }

      await this.safeShowModal('edit_bank');
    },

    // Submit family form
    async submitFamilyForm() {
      if (this.isDestroyed) return;

      try {
        this.isSubmitting = true;

        const payload = {
          employee_id: this.employee.id,
          father_name: this.familyForm.father_name,
          father_occupation: this.familyForm.father_occupation,
          father_phone: this.familyForm.father_phone,
          father_date_of_birth: this.formatDate(this.familyForm.father_date_of_birth),
          mother_name: this.familyForm.mother_name,
          mother_occupation: this.familyForm.mother_occupation,
          mother_phone: this.familyForm.mother_phone,
          mother_date_of_birth: this.formatDate(this.familyForm.mother_date_of_birth),
          emergency_contact_name: this.familyForm.emergency_contact_name,
          emergency_contact_relationship: this.familyForm.emergency_contact_relationship,
          emergency_contact_phone: this.familyForm.emergency_contact_phone,
          emergency_contact_address: this.familyForm.emergency_contact_address,
        };

        // Add API call here
        // const response = await familyService.createOrUpdateFamily(payload);
        console.log('Family payload ready for API:', payload);

        this.$message.success(`Family information ${this.isEditingFamily ? 'updated' : 'saved'} successfully`);
        this.$emit('employee-updated');

        // Clear saved form data after successful submission
        this.clearFormSection(this.employee.id, 'familyForm');
        this.markAsSaved(this.employee.id);

        // Reset form
        this.resetFamilyForm();

        // Close modal
        await this.safeHideModal('edit_familyinformation');
      } catch (error) {
        console.error('Error submitting family form:', error);
        this.$message.error('Error saving family information');
      } finally {
        this.isSubmitting = false;
      }
    },

    // Reset family form
    resetFamilyForm() {
      if (this.isDestroyed) return;

      this.familyForm = {
        id: null,
        father_name: '',
        father_occupation: '',
        father_phone: '',
        father_date_of_birth: null,
        mother_name: '',
        mother_occupation: '',
        mother_phone: '',
        mother_date_of_birth: null,
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
        emergency_contact_address: '',
      };
      this.isEditingFamily = false;
    },

    // Open Family Modal (for both add and edit)
    async openFamilyModal(familyData = null) {
      if (this.isDestroyed) return;

      if (familyData) {
        // Edit mode
        this.isEditingFamily = true;
        this.familyForm = {
          id: familyData.id,
          father_name: familyData.father_name || '',
          father_occupation: familyData.father_occupation || '',
          father_phone: familyData.father_phone || '',
          father_date_of_birth: this.safeConvertToDate(familyData.father_date_of_birth),
          mother_name: familyData.mother_name || '',
          mother_occupation: familyData.mother_occupation || '',
          mother_phone: familyData.mother_phone || '',
          mother_date_of_birth: this.safeConvertToDate(familyData.mother_date_of_birth),
          emergency_contact_name: familyData.emergency_contact_name || '',
          emergency_contact_relationship: familyData.emergency_contact_relationship || '',
          emergency_contact_phone: familyData.emergency_contact_phone || '',
          emergency_contact_address: familyData.emergency_contact_address || '',
        };
      } else {
        // Add mode (populate with employee data if available)
        this.isEditingFamily = false;
        this.familyForm = {
          id: null,
          father_name: this.employee?.father_name || '',
          father_occupation: this.employee?.father_occupation || '',
          father_phone: '',
          father_date_of_birth: null,
          mother_name: this.employee?.mother_name || '',
          mother_occupation: this.employee?.mother_occupation || '',
          mother_phone: '',
          mother_date_of_birth: null,
          emergency_contact_name: '',
          emergency_contact_relationship: '',
          emergency_contact_phone: '',
          emergency_contact_address: '',
        };
      }

      await this.safeShowModal('edit_familyinformation');
    },

    // Submit education form
    async submitEducationForm() {
      if (this.isDestroyed) return;

      try {
        this.isSubmitting = true;

        // Validate required fields
        if (!this.educationForm.institution_name || !this.educationForm.degree || !this.educationForm.education_level) {
          this.$message.error('Please fill in all required fields');
          return;
        }

        const payload = {
          employee_id: this.employee.id,
          institution_name: this.educationForm.institution_name,
          degree: this.educationForm.degree,
          field_of_study: this.educationForm.field_of_study,
          education_level: this.educationForm.education_level,
          start_date: this.formatDate(this.educationForm.start_date),
          end_date: this.formatDate(this.educationForm.end_date),
          gpa: this.educationForm.gpa,
          location: this.educationForm.location,
          description: this.educationForm.description,
          status: this.educationForm.status,
          honors: this.educationForm.honors,
        };

        // Add API call here
        // const response = await educationService.createOrUpdateEducation(payload);
        console.log('Education payload ready for API:', payload);

        this.$message.success(`Education information ${this.isEditingEducation ? 'updated' : 'added'} successfully`);
        this.$emit('employee-updated');

        // Clear saved form data after successful submission
        this.clearFormSection(this.employee.id, 'educationForm');
        this.markAsSaved(this.employee.id);

        // Reset form
        this.resetEducationForm();

        // Close modal
        await this.safeHideModal('edit_education');
      } catch (error) {
        console.error('Error submitting education form:', error);
        this.$message.error('Error saving education information');
      } finally {
        this.isSubmitting = false;
      }
    },

    // Reset education form
    resetEducationForm() {
      if (this.isDestroyed) return;

      this.educationForm = {
        id: null,
        institution_name: '',
        degree: '',
        field_of_study: '',
        education_level: '',
        start_date: null,
        end_date: null,
        gpa: '',
        location: '',
        description: '',
        status: '',
        honors: '',
      };
      this.isEditingEducation = false;
    },

    // Open Education Modal (for both add and edit)
    async openEducationModal(educationData = null) {
      if (this.isDestroyed) return;

      if (educationData) {
        // Edit mode
        this.isEditingEducation = true;
        this.educationForm = {
          id: educationData.id,
          institution_name: educationData.institution_name || '',
          degree: educationData.degree || '',
          field_of_study: educationData.field_of_study || '',
          education_level: educationData.education_level || '',
          start_date: this.safeConvertToDate(educationData.start_date),
          end_date: this.safeConvertToDate(educationData.end_date),
          gpa: educationData.gpa || '',
          location: educationData.location || '',
          description: educationData.description || '',
          status: educationData.status || '',
          honors: educationData.honors || '',
        };
      } else {
        // Add mode
        this.isEditingEducation = false;
        this.resetEducationForm();
      }

      await this.safeShowModal('edit_education');
    },

    // Create or Update Child
    async submitChildForm() {
      if (this.isDestroyed) return;

      try {
        this.isSubmitting = true;

        if (!this.childForm.name) {
          this.$message.error('Child name is required');
          return;
        }

        const payload = {
          employee_id: this.employee.id,
          name: this.childForm.name,
          date_of_birth: this.formatDate(this.childForm.date_of_birth),
        };

        let response;
        if (this.isEditingChild && this.childForm.id) {
          response = await employeeChildrenService.updateEmployeeChild(this.childForm.id, payload);
        } else {
          response = await employeeChildrenService.createEmployeeChild(payload);
        }

        if (this.isDestroyed) return;

        if (response && (response.success === true || response.status === "success")) {
          this.$message.success(response.message || `Child ${this.isEditingChild ? 'updated' : 'added'} successfully`);

          // Clear saved form data
          this.clearFormSection(this.employee.id, 'childForm');
          this.markAsSaved(this.employee.id);

          this.$emit('employee-updated');
          this.resetChildForm();
          this.closeChildModal();
        } else {
          this.$message.error(response?.message || `Failed to ${this.isEditingChild ? 'update' : 'add'} child`);
        }
      } catch (error) {
        if (this.isDestroyed) return;

        console.error('Error submitting child form:', error);
        this.$message.error(`Error ${this.isEditingChild ? 'updating' : 'adding'} child: ` + (error.message || 'Unknown error'));
      } finally {
        this.isSubmitting = false;
      }
    },

    // Open Add Child Modal
    async openAddChildModal() {
      if (this.isDestroyed) return;

      this.resetChildForm();
      this.isEditingChild = false;

      // Check for saved data
      const savedData = this.getEmployeeFormData(this.employee.id);
      if (savedData?.childForm && !this.isEditingChild) {
        const childData = { ...savedData.childForm };
        if (childData.date_of_birth) {
          childData.date_of_birth = this.safeConvertToDate(childData.date_of_birth);
        }
        Object.assign(this.childForm, childData);
        this.restoredDataNotification.childForm = true;
      }

      await this.safeShowModal('add_child');
    },

    // Open Edit Child Modal
    async openEditChildModal(child) {
      if (this.isDestroyed) return;

      this.isEditingChild = true;
      this.editingChild = child;

      this.childForm = {
        id: child.id,
        employee_id: child.employee_id,
        name: child.name,
        date_of_birth: this.safeConvertToDate(child.date_of_birth),
      };

      await this.safeShowModal('add_child');
    },

    // Delete Child
    async deleteChild(childId) {
      if (this.isDestroyed) return;

      try {
        const confirmed = await this.$confirm({
          title: 'Confirm Delete',
          content: 'Are you sure you want to delete this child record? This action cannot be undone.',
          okText: 'Yes, Delete',
          okType: 'danger',
          cancelText: 'Cancel',
          centered: true,
        });

        if (confirmed && !this.isDestroyed) {
          const response = await employeeChildrenService.deleteEmployeeChild(childId);

          if (this.isDestroyed) return;

          if (response && (response.success === true || response.status === "success")) {
            this.$message.success(response.message || 'Child deleted successfully');
            this.$emit('employee-updated');
          } else {
            this.$message.error(response?.message || 'Failed to delete child');
          }
        }
      } catch (error) {
        if (error === 'cancel' || this.isDestroyed) {
          return;
        }
        console.error('Error deleting child:', error);
        this.$message.error('Error deleting child: ' + (error.message || 'Unknown error'));
      }
    },

    // Reset Child Form
    resetChildForm() {
      if (this.isDestroyed) return;

      this.childForm = {
        id: null,
        employee_id: '',
        name: '',
        date_of_birth: null,
      };
      this.editingChild = null;
      this.isEditingChild = false;
    },

    // Close Child Modal
    async closeChildModal() {
      if (this.isDestroyed) return;

      await this.safeHideModal('add_child');
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
      if (this.isDestroyed) return;

      try {
        const response = await grantService.getAllGrantItems();
        if (response.data && !this.isDestroyed) {
          this.grantPositions = response.data;
        }
      } catch (error) {
        console.error("Error fetching grant positions:", error);
      }
    },

    async submitGrantPosition() {
      if (this.isDestroyed) return;

      try {
        this.isSubmitting = true;
        this.alertMessage = '';
        this.alertClass = '';

        if (!this.employee || !this.employee.employment || !this.employee.employment.id) {
          throw new Error("No employment record found for this employee");
        }

        if (!this.form.grant_items_id) {
          throw new Error("Please select a grant position");
        }

        if (!this.form.start_date) {
          throw new Error("Start date is required");
        }

        const payload = {
          employment_id: this.employee.employment.id,
          grant_items_id: this.form.grant_items_id,
          level_of_effort: this.form.level_of_effort,
          start_date: this.formatDate(this.form.start_date),
          end_date: this.formatDate(this.form.end_date),
          active: this.form.active,
        };

        await employmentService.addGrantAllocation(payload);

        if (this.isDestroyed) return;

        this.alertMessage = "Grant position successfully added!";
        this.alertClass = "alert-success";

        this.$emit("grantPositionAdded");

        setTimeout(async () => {
          if (!this.isDestroyed) {
            this.resetForm();
            await this.safeHideModal("add_grant_position");
          }
        }, 1500);

      } catch (error) {
        if (this.isDestroyed) return;

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

      try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return "";

        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        return [year, month, day].join("-");
      } catch (error) {
        console.error('Error formatting date:', error);
        return "";
      }
    },

    resetForm() {
      if (this.isDestroyed) return;

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
  },

  mounted() {
    if (this.isDestroyed) return;

    this.fetchGrantPositions();

    // Clean up expired data when component mounts
    const formStore = useFormPersistenceStore();
    formStore.cleanupExpiredData();

    // Store modal instances to prevent memory leaks
    this.modalInstances = {};

    // Listen for modal show events to check for saved data
    nextTick(() => {
      if (this.isDestroyed) return;

      const modalElements = document.querySelectorAll('.modal');

      modalElements.forEach(modalEl => {
        // Create modal instance if it doesn't exist
        if (!this.modalInstances[modalEl.id]) {
          this.modalInstances[modalEl.id] = new Modal(modalEl, {
            backdrop: 'static',
            keyboard: false
          });
        }

        modalEl.addEventListener('show.bs.modal', async (event) => {
          if (!this.employee?.id || this.isDestroyed || !this.isComponentReady) return;

          const modalId = event.target.id;
          const savedData = await this.checkForSavedData(this.employee.id);

          if (savedData.hasSavedData && !this.isDestroyed) {
            // Map modal IDs to form data keys
            const modalFormMap = {
              'edit_employee': 'editFormData',
              'edit_personal': 'personalFormData',

              'edit_bank': 'bankForm',
              'edit_familyinformation': 'familyForm',
              'edit_education': 'educationForm',
              'add_child': 'childForm'
            };

            const formKey = modalFormMap[modalId];
            if (formKey && savedData.data[formKey]) {
              // Only restore data for the specific form being opened
              const formData = { ...savedData.data[formKey] };

              // Handle date fields safely
              if (formKey === 'editFormData' && formData.date_of_birth) {
                formData.date_of_birth = this.safeConvertToDate(formData.date_of_birth);
              }
              if (formKey === 'childForm' && formData.date_of_birth) {
                formData.date_of_birth = this.safeConvertToDate(formData.date_of_birth);
              }
              if (formKey === 'familyForm') {
                if (formData.father_date_of_birth) {
                  formData.father_date_of_birth = this.safeConvertToDate(formData.father_date_of_birth);
                }
                if (formData.mother_date_of_birth) {
                  formData.mother_date_of_birth = this.safeConvertToDate(formData.mother_date_of_birth);
                }
              }
              if (formKey === 'educationForm') {
                if (formData.start_date) {
                  formData.start_date = this.safeConvertToDate(formData.start_date);
                }
                if (formData.end_date) {
                  formData.end_date = this.safeConvertToDate(formData.end_date);
                }
              }

              Object.assign(this[formKey], formData);

              // Show notification
              if (formKey === 'editFormData') {
                this.restoredDataNotification.editForm = true;
                this.restoredDataNotification.editFormTime = savedData.timestamp;
              } else if (formKey === 'personalFormData') {
                this.restoredDataNotification.personalForm = true;
                this.restoredDataNotification.personalFormTime = savedData.timestamp;

              } else if (formKey === 'bankForm') {
                this.restoredDataNotification.bankForm = true;
              } else if (formKey === 'familyForm') {
                this.restoredDataNotification.familyForm = true;
              } else if (formKey === 'educationForm') {
                this.restoredDataNotification.educationForm = true;
              } else if (formKey === 'childForm' && !this.isEditingChild) {
                this.restoredDataNotification.childForm = true;
              }
            }
          }
        });

        // Clean up modal backdrop issues
        modalEl.addEventListener('hidden.bs.modal', () => {
          // Remove any lingering backdrops
          nextTick(() => {
            if (this.isDestroyed) return;

            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => {
              if (!document.querySelector('.modal.show')) {
                backdrop.remove();
              }
            });
          });
        });
      });
    });
  },

  watch: {
    // Watch for employee prop changes
    employee: {
      handler(newVal) {
        if (newVal && !this.isDestroyed && this.isComponentReady) {
          // Initialize form data with employee data
          this.editFormData = {
            id: newVal.id,
            first_name_en: newVal.first_name_en || '',
            last_name_en: newVal.last_name_en || '',
            first_name_th: newVal.first_name_th || '',
            last_name_th: newVal.last_name_th || '',
            initial_en: newVal.initial_en || '',
            initial_th: newVal.initial_th || '',
            staff_id: newVal.staff_id || '',
            status: newVal.status || '',
            subsidiary: newVal.subsidiary || '',
            gender: newVal.gender || '',
            date_of_birth: this.safeConvertToDate(newVal.date_of_birth),
          };

          this.personalFormData = {
            id: newVal.id,
            staff_id: newVal.staff_id || '',
            mobile_phone: newVal.mobile_phone || '',
            nationality: newVal.nationality || '',
            social_security_number: newVal.social_security_number || '',
            tax_number: newVal.tax_number || '',
            religion: newVal.religion || '',
            marital_status: newVal.marital_status || '',
            spouse_name: newVal.spouse_name || '',
            spouse_mobile: newVal.spouse_mobile || '',
            languages: newVal.languages || [],
            current_address: newVal.current_address || '',
            permanent_address: newVal.permanent_address || '',
            employee_identification: newVal.employee_identification || {
              id_type: '',
              document_number: ''
            },
          };
        }
      },
      immediate: true,
      deep: true
    }
  },

  beforeUnmount() {
    // Mark component as destroyed
    this.isDestroyed = true;
    this.isComponentReady = false;

    // Clean up modal instances
    if (this.modalInstances) {
      Object.values(this.modalInstances).forEach(modal => {
        if (modal && typeof modal.dispose === 'function') {
          try {
            modal.dispose();
          } catch (error) {
            console.error('Error disposing modal:', error);
          }
        }
      });
    }

    // Remove any lingering backdrops
    try {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
    } catch (error) {
      console.error('Error cleaning up backdrops:', error);
    }

    // Save current state if there are unsaved changes
    if (this.employee?.id && this.hasEmployeeUnsavedChanges(this.employee.id)) {
      // The data is already being saved in real-time, so we don't need to do anything here
      // But you could show a warning or perform other cleanup if needed
    }
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

.alert-dismissible .btn-close {
  padding: 0.5rem;
}

/* Highlight restored data notification */
.alert-info {
  background-color: #e7f3ff;
  border-color: #b3d9ff;
  color: #004085;
}

/* Add transition for notifications */
.fade {
  transition: opacity 0.15s linear;
}

.fade.show {
  opacity: 1;
}

/* Add visual indicator for forms with unsaved changes */
.has-unsaved-changes {
  border-left: 3px solid #ffc107;
  padding-left: 10px;
}

/* Custom styles for Ant Design confirm dialogs */
:deep(.ant-modal-confirm .ant-modal-body) {
  padding: 24px 24px 16px 24px;
}

:deep(.ant-modal-confirm .ant-modal-confirm-title) {
  font-weight: 600;
  font-size: 16px;
  color: #262626;
}

:deep(.ant-modal-confirm .ant-modal-confirm-content) {
  margin-top: 8px;
  font-size: 14px;
  color: #595959;
}

:deep(.ant-modal-confirm .ant-btn) {
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 6px;
}

:deep(.ant-modal-confirm .ant-btn-primary) {
  background: #1890ff;
  border-color: #1890ff;
}

:deep(.ant-modal-confirm .ant-btn-danger) {
  background: #ff4d4f;
  border-color: #ff4d4f;
}
</style>

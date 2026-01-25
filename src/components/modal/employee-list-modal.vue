<template>
  <!-- Add Employee -->
  <div class="modal fade" id="add_employee">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
        <div class="modal-header"
          style="background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; padding: 15px 20px;">
          <div class="d-flex align-items-center">
            <h4 class="modal-title me-2">Add New Employee</h4>
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
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="personal-tab" data-bs-toggle="tab" data-bs-target="#personal-info"
                  type="button" role="tab" aria-selected="false">
                  Personal & Finance
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="dependents-tab" data-bs-toggle="tab"
                  data-bs-target="#dependents-info" type="button" role="tab" aria-selected="false">
                  Family & Dependents
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
                <!-- Row 1: Organization -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="grant-organization">
                      Organization :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select id="grant-organization" v-model="formData.organization" class="form-control input-short" required>
                      <option value="" disabled selected>Select a organization</option>
                      <option v-for="organization in subsidiaries" :key="organization.id" :value="organization.value"
                        :class="[
                          organization.value === 'SMRU' ? 'text-primary' :
                            organization.value === 'BHF' ? 'text-primary' :
                              'text-secondary'
                        ]">
                        {{ organization.value }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Row 2: Staff ID -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="staff-id">
                      Staff ID <span class="text-danger">*</span> :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="staff-id" placeholder="Enter staff ID"
                      v-model="formData.staff_id" />
                  </div>
                </div>

                <!-- Row 3: Initial (EN) -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="initial-en">
                      Initial (EN) :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select id="initial-en" v-model="formData.initial_en" class="form-control input-short">
                      <option value="" disabled selected>Select initial</option>
                      <option v-for="initial in employeeInitialEN" :key="initial.id" :value="initial.value" :class="[
                        'text-secondary'
                      ]">
                        {{ initial.value }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Row 4: Initial (TH) -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="initial-th">
                      Initial (TH) :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select id="initial-th" v-model="formData.initial_th" class="form-control input-short">
                      <option value="" disabled selected>Select initial</option>
                      <option v-for="initial in employeeInitialTH" :key="initial.id" :value="initial.value" :class="[
                        'text-secondary'
                      ]">
                        {{ initial.value }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Row 5: First Name (EN) -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="first-name-en">
                      First Name (EN) <span class="text-danger">*</span> :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="first-name-en" maxlength="255" placeholder="Enter English first name"
                      v-model="formData.first_name_en" />
                  </div>
                </div>

                <!-- Row 6: Last Name (EN) -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="last-name-en">
                      Last Name (EN) :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="last-name-en" maxlength="255" placeholder="Enter English last name"
                      v-model="formData.last_name_en" />
                  </div>
                </div>

                <!-- Row 7: First Name (TH) -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="first-name-th">
                      First Name (TH) :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="first-name-th" maxlength="255" placeholder="Enter Thai first name"
                      v-model="formData.first_name_th" />
                  </div>
                </div>

                <!-- Row 8: Last Name (TH) -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="last-name-th">
                      Last Name (TH) :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="last-name-th" maxlength="255" placeholder="Enter Thai last name"
                      v-model="formData.last_name_th" />
                  </div>
                </div>

                <!-- Row 9: Gender -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="gender">
                      Gender <span class="text-danger">*</span> :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select id="gender" v-model="formData.gender" class="form-control input-short" required>
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

                <!-- Row 10: Date of Birth -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="date-of-birth">
                      Date of Birth <span class="text-danger">*</span> :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <div class="input-with-tooltip">
                      <div class="input-icon-end position-relative input-short-wrapper">
                        <date-picker class="form-control datetimepicker input-short" placeholder="dd/mm/yyyy" :editable="true"
                          :clearable="false" :input-format="dateFormat" v-model="formData.date_of_birth" />
                        <span class="input-icon-addon">
                          <i class="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                      <span data-bs-toggle="tooltip" data-bs-placement="top"
                        title="Select the employee's date of birth" class="tooltip-icon">
                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Row 11: Age -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="age">
                      Age <span class="text-danger">*</span> :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-short" id="age" v-model="calculatedAge" readonly />
                  </div>
                </div>

                <!-- Row 12: Status -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="employee_status">
                      Status <span class="text-danger">*</span> :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select id="employee_status" v-model="formData.status" class="form-control input-short" required>
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
              <div class="modal-footer"
                style="background-color: #f8f9fa; border-top: 1px solid #e9ecef; padding: 15px 20px;">
                <button type="button" class="btn btn-outline-light border me-2"
                  style="border-radius: 4px; padding: 8px 16px; font-weight: 500;" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" class="btn btn-primary"
                  style="background-color: #0067A5; border-color: #0067A5; border-radius: 4px; padding: 8px 16px; font-weight: 500;"
                  :disabled="isSubmitting" @click="onNextFromBasic">
                  Next
                </button>
              </div>
            </div>

            <!-- Personal & Finance -->
            <div class="tab-pane fade" id="personal-info" role="tabpanel" aria-labelledby="personal-tab" tabindex="0">
              <div class="modal-body pb-0">
                <!-- Row 1: Phone -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="phone">
                      Phone <span class="text-danger">*</span> :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="tel" class="form-control input-medium" id="phone" v-model="personalForm.mobile_phone"
                      placeholder="Enter phone number" />
                  </div>
                </div>

                <!-- Row 2: Nationality -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="nationality">
                      Nationality :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select class="form-select input-medium" id="nationality" v-model="personalForm.nationality">
                      <option value="" disabled selected>Select Nationality</option>
                      <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.value">
                        {{ nationality.value }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Row 3: Religion -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="religion">
                      Religion :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select class="form-select input-medium" id="religion" v-model="personalForm.religion">
                      <option value="" disabled selected>Select Religion</option>
                      <option v-for="religion in religions" :key="religion.id" :value="religion.value">
                        {{ religion.value }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Row 4: Marital Status -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="marital-status">
                      Marital Status :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select class="form-select input-medium" id="marital-status" v-model="personalForm.marital_status">
                      <option value="" disabled selected>Select Marital Status</option>
                      <option v-for="status in maritalStatuses" :key="status.id" :value="status.value">
                        {{ status.value }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Row 5: Spouse Name (conditional) -->
                <div class="form-row mb-3" v-if="personalForm.marital_status === 'Married'">
                  <div class="form-label-col">
                    <label class="form-label" for="spouse-name">
                      Spouse Name :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="spouse-name" v-model="personalForm.spouse_name"
                      placeholder="Enter spouse name" />
                  </div>
                </div>

                <!-- Row 6: Spouse Mobile (conditional) -->
                <div class="form-row mb-3" v-if="personalForm.marital_status === 'Married'">
                  <div class="form-label-col">
                    <label class="form-label" for="spouse-mobile">
                      Spouse Mobile :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="tel" class="form-control input-medium" id="spouse-mobile" v-model="personalForm.spouse_mobile"
                      placeholder="Enter spouse mobile" />
                  </div>
                </div>

                <!-- Row 7: Social Security Number -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="ssn">
                      Social Security Number :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="ssn" v-model="personalForm.social_security_number"
                      placeholder="Enter SSN" />
                  </div>
                </div>

                <!-- Row 8: Tax Number -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="tax-number">
                      Tax Number :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="tax-number" v-model="personalForm.tax_number"
                      placeholder="Enter tax number" />
                  </div>
                </div>

                <!-- Row 9: Current Address -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="current-address">
                      Current Address :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <textarea class="form-control" id="current-address" v-model="personalForm.current_address"
                      placeholder="Enter current address" rows="3"></textarea>
                  </div>
                </div>

                <!-- Row 10: Permanent Address -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="permanent-address">
                      Permanent Address :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <textarea class="form-control" id="permanent-address" v-model="personalForm.permanent_address"
                      placeholder="Enter permanent address" rows="3"></textarea>
                  </div>
                </div>

                <!-- Section Header: Identification Information -->
                <div class="form-row mb-3">
                  <div class="form-label-col"></div>
                  <div class="form-input-col">
                    <hr class="my-3">
                    <h6 class="mb-3"><i class="ti ti-id"></i> Identification Information</h6>
                  </div>
                </div>

                <!-- Row 11: ID Type -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="id-type">
                      ID Type :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select class="form-select input-medium" id="id-type" v-model="personalForm.identification_type">
                      <option value="">Select ID Type</option>
                      <option v-for="idType in identificationTypeOptions" :key="idType.value" :value="idType.value">
                        {{ idType.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Row 12: ID Number -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="id-number">
                      ID Number :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="id-number" v-model="personalForm.identification_number"
                      placeholder="Enter ID number" />
                  </div>
                </div>

                <!-- Section Header: Bank Information -->
                <div class="form-row mb-3">
                  <div class="form-label-col"></div>
                  <div class="form-input-col">
                    <hr class="my-3">
                    <h6 class="mb-3"><i class="ti ti-credit-card"></i> Bank Information</h6>
                  </div>
                </div>

                <!-- Row 13: Bank Name -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="bank-name">
                      Bank Name :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select class="form-select input-medium" id="bank-name" v-model="bankForm.bank_name">
                      <option value="" disabled selected>Select Bank</option>
                      <option v-for="bank in bankNames" :key="bank.id" :value="bank.value">
                        {{ bank.value }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Row 14: Bank Branch -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="bank-branch">
                      Bank Branch :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="bank-branch" v-model="bankForm.bank_branch"
                      placeholder="Enter bank branch" />
                  </div>
                </div>

                <!-- Row 15: Account Name -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="account-name">
                      Account Name :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="account-name" v-model="bankForm.bank_account_name"
                      placeholder="Enter account holder name" />
                  </div>
                </div>

                <!-- Row 16: Account Number -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="account-number">
                      Account Number :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="account-number" v-model="bankForm.bank_account_number"
                      placeholder="Enter account number" />
                  </div>
                </div>

                <!-- Section Header: Education Background -->
                <div class="form-row mb-3">
                  <div class="form-label-col"></div>
                  <div class="form-input-col">
                    <hr class="my-3">
                    <h6 class="mb-3"><i class="ti ti-school"></i> Education Background</h6>
                  </div>
                </div>

                <!-- Row 17: School/Institution Name -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="school-name">
                      School/Institution Name :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control" id="school-name" v-model="educationForm.school_name"
                      placeholder="Enter school name" />
                  </div>
                </div>

                <!-- Row 18: Degree/Qualification -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="degree">
                      Degree/Qualification :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control" id="degree" v-model="educationForm.degree"
                      placeholder="Enter degree" />
                  </div>
                </div>

                <!-- Row 19: Start Date -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="education-start-date">
                      Start Date :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <div class="input-with-tooltip">
                      <div class="input-icon-end position-relative input-short-wrapper">
                        <date-picker v-model="educationForm.start_date" class="form-control datetimepicker input-short"
                          placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat" />
                        <span class="input-icon-addon">
                          <i class="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                      <span data-bs-toggle="tooltip" data-bs-placement="top"
                        title="Select the start date of education" class="tooltip-icon">
                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Row 20: End Date -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="education-end-date">
                      End Date :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <div class="input-with-tooltip">
                      <div class="input-icon-end position-relative input-short-wrapper">
                        <date-picker v-model="educationForm.end_date" class="form-control datetimepicker input-short"
                          placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat" />
                        <span class="input-icon-addon">
                          <i class="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                      <span data-bs-toggle="tooltip" data-bs-placement="top"
                        title="Select the end date of education" class="tooltip-icon">
                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer"
                style="background-color: #f8f9fa; border-top: 1px solid #e9ecef; padding: 15px 20px;">
                <button type="button" class="btn btn-outline-light border me-2"
                  style="border-radius: 4px; padding: 8px 16px; font-weight: 500;" @click="activateTab('basic-info')">
                  Previous
                </button>
                <button type="button" class="btn btn-primary"
                  style="background-color: #0067A5; border-color: #0067A5; border-radius: 4px; padding: 8px 16px; font-weight: 500;"
                  :disabled="isSubmitting" @click="activateTab('dependents-info')">
                  Next
                </button>
              </div>
            </div>

            <!-- Family & Dependents -->
            <div class="tab-pane fade" id="dependents-info" role="tabpanel" aria-labelledby="dependents-tab"
              tabindex="0">
              <div class="modal-body pb-0">
                <!-- Section Header: Family Information -->
                <div class="form-row mb-3">
                  <div class="form-label-col"></div>
                  <div class="form-input-col">
                    <h6 class="mb-3"><i class="ti ti-user"></i> Family Information</h6>
                  </div>
                </div>

                <!-- Row 1: Father's Name -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="father-name">
                      Father's Name :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="father-name" v-model="familyForm.father_name"
                      placeholder="Enter father's name" />
                  </div>
                </div>

                <!-- Row 2: Father's Phone -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="father-phone">
                      Father's Phone :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="tel" class="form-control input-medium" id="father-phone" v-model="familyForm.father_phone"
                      placeholder="Enter father's phone" />
                  </div>
                </div>

                <!-- Row 3: Mother's Name -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="mother-name">
                      Mother's Name :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="mother-name" v-model="familyForm.mother_name"
                      placeholder="Enter mother's name" />
                  </div>
                </div>

                <!-- Row 4: Mother's Phone -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="mother-phone">
                      Mother's Phone :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="tel" class="form-control input-medium" id="mother-phone" v-model="familyForm.mother_phone"
                      placeholder="Enter mother's phone" />
                  </div>
                </div>

                <!-- Section Header: Emergency Contact -->
                <div class="form-row mb-3">
                  <div class="form-label-col"></div>
                  <div class="form-input-col">
                    <hr class="my-3">
                    <h6 class="mb-3"><i class="ti ti-phone"></i> Emergency Contact</h6>
                  </div>
                </div>

                <!-- Row 5: Emergency Contact Name -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="emergency-name">
                      Name :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="emergency-name" v-model="familyForm.emergency_contact_name"
                      placeholder="Enter contact name" />
                  </div>
                </div>

                <!-- Row 6: Emergency Contact Relationship -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="emergency-relationship">
                      Relationship :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="emergency-relationship" v-model="familyForm.emergency_contact_relationship"
                      placeholder="Enter relationship" />
                  </div>
                </div>

                <!-- Row 7: Emergency Contact Phone -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="emergency-phone">
                      Phone :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="tel" class="form-control input-medium" id="emergency-phone" v-model="familyForm.emergency_contact_phone"
                      placeholder="Enter contact phone" />
                  </div>
                </div>

                <!-- Section Header: Beneficiary Information -->
                <div class="form-row mb-3">
                  <div class="form-label-col"></div>
                  <div class="form-input-col">
                    <hr class="my-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <h6 class="mb-0"><i class="ti ti-heart"></i> Beneficiary Information</h6>
                      <button type="button" class="btn btn-outline-primary btn-sm" @click="addBeneficiary">
                        <i class="ti ti-plus"></i> Add Beneficiary
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Row 8: Beneficiary Name -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="beneficiary-name">
                      Beneficiary Name :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="beneficiary-name" v-model="beneficiaryForm.beneficiary_name"
                      placeholder="Enter beneficiary name" />
                  </div>
                </div>

                <!-- Row 9: Beneficiary Relationship -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="beneficiary-relationship">
                      Relationship :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="beneficiary-relationship" v-model="beneficiaryForm.beneficiary_relationship"
                      placeholder="Enter relationship" />
                  </div>
                </div>

                <!-- Row 10: Beneficiary Phone -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="beneficiary-phone">
                      Phone :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="tel" class="form-control input-medium" id="beneficiary-phone" v-model="beneficiaryForm.phone_number"
                      placeholder="Enter phone number" />
                  </div>
                </div>

                <!-- Row 11: Beneficiary Email -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="beneficiary-email">
                      Email :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="email" class="form-control input-medium" id="beneficiary-email" v-model="beneficiaryForm.beneficiary_email"
                      placeholder="Enter email (optional)" />
                  </div>
                </div>

                <!-- Row 12: Beneficiary Address -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="beneficiary-address">
                      Address :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control" id="beneficiary-address" v-model="beneficiaryForm.beneficiary_address"
                      placeholder="Enter address (optional)" />
                  </div>
                </div>

                <!-- Beneficiaries Table -->
                <div class="form-row mb-3" v-if="beneficiariesEntries.length">
                  <div class="form-label-col"></div>
                  <div class="form-input-col">
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Relationship</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th class="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(beneficiary, index) in beneficiariesEntries" :key="index">
                            <td>{{ beneficiary.beneficiary_name }}</td>
                            <td>{{ beneficiary.beneficiary_relationship }}</td>
                            <td>{{ beneficiary.phone_number }}</td>
                            <td>{{ beneficiary.beneficiary_email || '-' }}</td>
                            <td class="text-end">
                              <button type="button" class="btn btn-sm btn-light text-danger"
                                @click="removeBeneficiary(index)">
                                <i class="ti ti-trash"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- Section Header: Children Information -->
                <div class="form-row mb-3">
                  <div class="form-label-col"></div>
                  <div class="form-input-col">
                    <hr class="my-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <h6 class="mb-0"><i class="ti ti-users"></i> Children Information</h6>
                      <button type="button" class="btn btn-outline-primary btn-sm" @click="addChild">
                        <i class="ti ti-plus"></i> Add Child
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Row 13: Child Name -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="child-name">
                      Child Name :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="child-name" v-model="childForm.name" placeholder="Enter child name" />
                  </div>
                </div>

                <!-- Row 14: Child Date of Birth -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="child-dob">
                      Date of Birth :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <div class="input-with-tooltip">
                      <div class="input-icon-end position-relative input-short-wrapper">
                        <date-picker v-model="childForm.date_of_birth" class="form-control datetimepicker input-short"
                          placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat" />
                        <span class="input-icon-addon">
                          <i class="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                      <span data-bs-toggle="tooltip" data-bs-placement="top"
                        title="Select the child's date of birth" class="tooltip-icon">
                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Children Table -->
                <div class="form-row mb-3" v-if="childrenEntries.length">
                  <div class="form-label-col"></div>
                  <div class="form-input-col">
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th class="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(child, index) in childrenEntries" :key="index">
                            <td>{{ child.name }}</td>
                            <td>{{ formatDateOnly(child.date_of_birth) }}</td>
                            <td class="text-end">
                              <button type="button" class="btn btn-sm btn-light text-danger" @click="removeChild(index)">
                                <i class="ti ti-trash"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer"
                style="background-color: #f8f9fa; border-top: 1px solid #e9ecef; padding: 15px 20px;">
                <button type="button" class="btn btn-outline-light border me-2"
                  style="border-radius: 4px; padding: 8px 16px; font-weight: 500;" @click="activateTab('personal-info')">
                  Previous
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
    <div class="modal-dialog modal-dialog-centered modal-xl">
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
            <!-- Row 1: Organization -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-organization">
                  Organization :
                </label>
              </div>
              <div class="form-input-col">
                <select id="edit-organization" v-model="editFormData.organization" class="form-control input-short" required>
                  <option value="" disabled selected>Select a organization</option>
                  <option v-for="organization in subsidiaries" :key="organization.id" :value="organization.value"
                    :class="[
                      organization.value === 'SMRU' ? 'text-primary' :
                        organization.value === 'BHF' ? 'text-primary' :
                          'text-secondary'
                    ]">
                    {{ organization.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 2: Staff ID -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-staff-id">
                  Staff ID <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="edit-staff-id" placeholder="Enter staff ID"
                  v-model="editFormData.staff_id" />
              </div>
            </div>

            <!-- Row 3: Initial (EN) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-initial-en">
                  Initial (EN) :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-short" id="edit-initial-en" placeholder="Enter English initial" maxlength="10"
                  v-model="editFormData.initial_en" />
              </div>
            </div>

            <!-- Row 4: Initial (TH) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-initial-th">
                  Initial (TH) :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-short" id="edit-initial-th" placeholder="Enter Thai initial" maxlength="10"
                  v-model="editFormData.initial_th" />
              </div>
            </div>

            <!-- Row 5: First Name (EN) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-first-name-en">
                  First Name (EN) <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="edit-first-name-en" maxlength="255" placeholder="Enter English first name"
                  v-model="editFormData.first_name_en" />
              </div>
            </div>

            <!-- Row 6: Last Name (EN) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-last-name-en">
                  Last Name (EN) :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="edit-last-name-en" maxlength="255" placeholder="Enter English last name"
                  v-model="editFormData.last_name_en" />
              </div>
            </div>

            <!-- Row 7: First Name (TH) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-first-name-th">
                  First Name (TH) :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="edit-first-name-th" maxlength="255" placeholder="Enter Thai first name"
                  v-model="editFormData.first_name_th" />
              </div>
            </div>

            <!-- Row 8: Last Name (TH) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-last-name-th">
                  Last Name (TH) :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="edit-last-name-th" maxlength="255" placeholder="Enter Thai last name"
                  v-model="editFormData.last_name_th" />
              </div>
            </div>

            <!-- Row 9: Gender -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-gender">
                  Gender <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select id="edit-gender" v-model="editFormData.gender" class="form-control input-short" required>
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

            <!-- Row 10: Date of Birth -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-date-of-birth">
                  Date of Birth <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker class="form-control datetimepicker input-short" placeholder="dd/mm/yyyy" :editable="true"
                      :clearable="false" :input-format="dateFormat" v-model="editFormData.date_of_birth" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the employee's date of birth" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 11: Age -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-age">
                  Age <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-short" id="edit-age" v-model="editCalculatedAge" readonly />
              </div>
            </div>

            <!-- Row 12: Status -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-employee-status">
                  Status <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select id="edit-employee-status" v-model="editFormData.status" class="form-control input-short" required>
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

            <!-- Row 13: Nationality -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-nationality">
                  Nationality <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-medium" id="edit-nationality" v-model="editFormData.nationality">
                  <option value="" disabled selected>Select Nationality</option>
                  <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.value">
                    {{ nationality.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 14: Religion -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-religion">
                  Religion <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-medium" id="edit-religion" v-model="editFormData.religion">
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

            <!-- Row 15: Marital Status -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-marital-status">
                  Marital Status <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-medium" id="edit-marital-status" v-model="editFormData.marital_status">
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

            <!-- Row 16: Phone -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-phone">
                  Phone <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="tel" class="form-control input-medium" id="edit-phone" v-model="editFormData.mobile_phone"
                  placeholder="Enter phone number" required />
              </div>
            </div>

            <!-- Row 17: Current Address -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-current-address">
                  Current Address <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <textarea class="form-control" id="edit-current-address" v-model="editFormData.current_address"
                  placeholder="Enter current address" rows="3" required></textarea>
              </div>
            </div>

            <!-- Row 18: Permanent Address -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-permanent-address">
                  Permanent Address <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <textarea class="form-control" id="edit-permanent-address" v-model="editFormData.permanent_address"
                  placeholder="Enter permanent address" rows="3" required></textarea>
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
import { Modal, Tab, Tooltip } from 'bootstrap';
import { useEmployeeStore } from "@/stores/employeeStore";
import { useLookupStore } from "@/stores/lookupStore";
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { employeeService } from "@/services/employee.service";
import { employeeEducationService } from "@/services/employeeEducation.service";
import { employeeChildrenService } from "@/services/employee-children.service";
import employeeBeneficiaryService from "@/services/employeeBeneficiary.service";
import { InfoCircleOutlined } from '@ant-design/icons-vue';

const currentDate = ref(new Date());
const currentDateOne = ref(new Date());

export default {
  emits: ['employeeAdded'],
  components: {
    InfoCircleOutlined,
  },
  setup() {
    // Initialize stores
    const lookupStore = useLookupStore();

    // Use storeToRefs to maintain reactivity
    const { lookupsByType, loading: lookupLoading } = storeToRefs(lookupStore);

    return {
      lookupStore,
      lookupsByType,
      lookupLoading
    };
  },
  data() {
    return {
      showPassword: false,
      showPassword1: false,
      date_of_birth: null,
      editMode: false,
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
        organization: '',
        gender: '',
        nationality: '',
        religion: '',
        marital_status: '',
        employee_status: '',
        date_of_birth: null,
      },
      personalForm: {
        mobile_phone: '',
        nationality: '',
        social_security_number: '',
        tax_number: '',
        religion: '',
        marital_status: '',
        spouse_name: '',
        spouse_phone_number: '',
        languages: [],
        current_address: '',
        permanent_address: '',
        // Direct columns instead of nested relationship
        identification_type: '',
        identification_number: '',
      },
      // Identification type options matching database schema
      identificationTypeOptions: [
        { value: '10YearsID', label: '10 Years ID' },
        { value: 'BurmeseID', label: 'Burmese ID' },
        { value: 'CI', label: 'CI' },
        { value: 'Borderpass', label: 'Borderpass' },
        { value: 'ThaiID', label: 'Thai ID' },
        { value: 'Passport', label: 'Passport' },
        { value: 'Other', label: 'Other' },
      ],
      bankForm: {
        bank_name: '',
        bank_branch: '',
        bank_account_name: '',
        bank_account_number: '',
      },
      educationForm: {
        school_name: '',
        degree: '',
        start_date: null,
        end_date: null,
      },
      familyForm: {
        father_name: '',
        father_phone: '',
        mother_name: '',
        mother_phone: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
      },
      beneficiaryForm: {
        beneficiary_name: '',
        beneficiary_relationship: '',
        phone_number: '',
        beneficiary_email: '',
        beneficiary_address: '',
      },
      childForm: {
        name: '',
        date_of_birth: null,
      },
      childrenEntries: [],
      beneficiariesEntries: [],
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
        organization: '',
        status: '',
        age: '',
        gender: '',
        // nationality: '',
        // religion: '',
        // marital_status: '',
        date_of_birth: null,
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
    // Load lookups only if not already loaded (store handles caching)
    // After logout, the store is reset, so this will refetch for the new user
    if (!this.lookupStore.lookups.length) {
      await this.lookupStore.fetchAllLookupLists();
    }
  },
  mounted() {
    // Initialize the modal when component is mounted
    const modalElement = document.getElementById('add_employee');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
    }
    // Initialize tooltips
    this.initializeTooltips();
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

    // Use store getters for dropdown options (store handles caching and reactivity)
    subsidiaries() {
      return this.lookupStore.getLookupsByType('organization') || [];
    },
    genders() {
      return this.lookupStore.getLookupsByType('gender') || [];
    },
    statuses() {
      return this.lookupStore.getLookupsByType('employee_status') || [];
    },
    nationalities() {
      return this.lookupStore.getLookupsByType('nationality') || [];
    },
    religions() {
      return this.lookupStore.getLookupsByType('religion') || [];
    },
    maritalStatuses() {
      return this.lookupStore.getLookupsByType('marital_status') || [];
    },
    employeeInitialEN() {
      return this.lookupStore.getLookupsByType('employee_initial_en') || [];
    },
    employeeInitialTH() {
      return this.lookupStore.getLookupsByType('employee_initial_th') || [];
    },
    employeeLanguages() {
      return this.lookupStore.getLookupsByType('employee_language') || [];
    },
    employeeEducations() {
      return this.lookupStore.getLookupsByType('employee_education') || [];
    },
    idTypes() {
      return this.lookupStore.getLookupsByType('identification_types') || [];
    },
    bankNames() {
      return this.lookupStore.getLookupsByType('bank_name') || [];
    },
    basicInfoValid() {
      return !!(
        this.formData.organization &&
        this.formData.staff_id &&
        this.formData.first_name_en &&
        this.formData.gender &&
        this.formData.date_of_birth &&
        this.formData.status
      );
    },
  },
  methods: {
    // Add this utility method for date formatting
    formatDateOnly(dateValue) {
      if (!dateValue) return null;
      return new Date(dateValue).toISOString().split('T')[0];
    },

    initializeTooltips() {
      this.$nextTick(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          new Tooltip(tooltipTriggerEl);
        });
      });
    },

    activateTab(tabId) {
      const trigger = document.querySelector(`button[data-bs-target="#${tabId}"]`);
      if (trigger) {
        const tab = Tab.getOrCreateInstance(trigger);
        tab.show();
      }
    },

    onNextFromBasic() {
      if (!this.basicInfoValid) {
        message.warning('Please fill all required basic fields before continuing.');
        return;
      }
      this.activateTab('personal-info');
    },

    async handleSubmit() {
      this.isSubmitting = true;
      this.alertMessage = ''; // Reset alert message

      try {
        const formDataToSend = {
          ...this.formData,
          date_of_birth: this.formatDateOnly(this.formData.date_of_birth),
          age: this.calculatedAge,
          // allow personal/finance data that API accepts directly
          nationality: this.personalForm.nationality,
          religion: this.personalForm.religion,
          marital_status: this.personalForm.marital_status,
          mobile_phone: this.personalForm.mobile_phone,
          current_address: this.personalForm.current_address,
          permanent_address: this.personalForm.permanent_address,
          social_security_number: this.personalForm.social_security_number,
          tax_number: this.personalForm.tax_number,
          bank_name: this.bankForm.bank_name,
          bank_branch: this.bankForm.bank_branch,
          bank_account_name: this.bankForm.bank_account_name,
          bank_account_number: this.bankForm.bank_account_number,
        };

        const employeeStore = useEmployeeStore();
        const response = await employeeStore.createEmployee(formDataToSend);

        if (response && response.success) {
          this.lastAddedEmployee = response.data;
          const newEmployeeId = response?.data?.id || response?.data?.employee?.id || response?.data?.data?.id;

          if (newEmployeeId) {
            await this.runPostCreateUpdates(newEmployeeId);
          }

          // Invalidate employee cache so employment modal will fetch fresh data
          const { useSharedDataStore } = await import('@/stores/sharedDataStore');
          const sharedStore = useSharedDataStore();
          sharedStore.invalidateCache('employees');

          // Optionally preload fresh employee data for better UX
          await sharedStore.fetchEmployees(true);

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

    async runPostCreateUpdates(employeeId) {
      const tasks = [];

      const personalPayload = this.buildPersonalPayload();
      if (this.hasPersonalData(personalPayload)) {
        tasks.push(employeeService.updateEmployeePersonalInformation(employeeId, personalPayload));
      }

      const bankPayload = this.buildBankPayload();
      if (this.hasBankData(bankPayload)) {
        tasks.push(employeeService.updateBankInformation(employeeId, bankPayload));
      }

      const familyPayload = this.buildFamilyPayload();
      if (this.hasFamilyData(familyPayload)) {
        tasks.push(employeeService.updateEmployeeFamilyInformation(employeeId, familyPayload));
      }

      const educationPayload = this.buildEducationPayload(employeeId);
      if (educationPayload) {
        tasks.push(employeeEducationService.createEmployeeEducation(educationPayload));
      }

      const beneficiaryPayloads = this.buildBeneficiaryPayload(employeeId);
      if (beneficiaryPayloads && beneficiaryPayloads.length) {
        tasks.push(Promise.all(beneficiaryPayloads.map(payload => employeeBeneficiaryService.createBeneficiary(payload))));
      }

      const childrenPayloads = this.buildChildrenPayloads(employeeId);
      if (childrenPayloads.length) {
        tasks.push(Promise.all(childrenPayloads.map(payload => employeeChildrenService.createEmployeeChild(payload))));
      }

      if (tasks.length) {
        await Promise.allSettled(tasks);
      }
    },

    buildPersonalPayload() {
      return {
        mobile_phone: this.personalForm.mobile_phone,
        nationality: this.personalForm.nationality,
        social_security_number: this.personalForm.social_security_number,
        tax_number: this.personalForm.tax_number,
        religion: this.personalForm.religion,
        marital_status: this.personalForm.marital_status,
        spouse_name: this.personalForm.spouse_name,
        spouse_phone_number: this.personalForm.spouse_phone_number,
        languages: this.personalForm.languages?.filter(Boolean) || [],
        current_address: this.personalForm.current_address,
        permanent_address: this.personalForm.permanent_address,
        // Direct columns instead of nested relationship
        identification_type: this.personalForm.identification_type || null,
        identification_number: this.personalForm.identification_number || null,
      };
    },

    buildBankPayload() {
      return {
        bank_name: this.bankForm.bank_name,
        bank_branch: this.bankForm.bank_branch,
        bank_account_name: this.bankForm.bank_account_name,
        bank_account_number: this.bankForm.bank_account_number,
      };
    },

    buildFamilyPayload() {
      return {
        father_name: this.familyForm.father_name,
        father_phone: this.familyForm.father_phone,
        mother_name: this.familyForm.mother_name,
        mother_phone: this.familyForm.mother_phone,
        emergency_contact_name: this.familyForm.emergency_contact_name,
        emergency_contact_relationship: this.familyForm.emergency_contact_relationship,
        emergency_contact_phone: this.familyForm.emergency_contact_phone,
      };
    },

    buildEducationPayload(employeeId) {
      if (!this.educationForm.school_name && !this.educationForm.degree && !this.educationForm.start_date) {
        return null;
      }
      return {
        employee_id: employeeId,
        school_name: this.educationForm.school_name,
        degree: this.educationForm.degree,
        start_date: employeeEducationService.formatDateForAPI(this.educationForm.start_date),
        end_date: employeeEducationService.formatDateForAPI(this.educationForm.end_date),
        created_by: 'system',
        updated_by: 'system',
      };
    },

    buildBeneficiaryPayload(employeeId) {
      const payloads = [];
      const entries = [...this.beneficiariesEntries];
      if (this.beneficiaryForm.beneficiary_name && this.beneficiaryForm.beneficiary_relationship && this.beneficiaryForm.phone_number) {
        entries.push({ ...this.beneficiaryForm });
      }
      entries.forEach(item => {
        if (item.beneficiary_name && item.beneficiary_relationship && item.phone_number) {
          payloads.push({
            employee_id: employeeId,
            beneficiary_name: item.beneficiary_name,
            beneficiary_relationship: item.beneficiary_relationship,
            phone_number: item.phone_number,
            beneficiary_email: item.beneficiary_email,
            beneficiary_address: item.beneficiary_address,
          });
        }
      });
      return payloads;
    },

    buildChildrenPayloads(employeeId) {
      const payloads = [];
      const children = [...this.childrenEntries];
      // if user filled current child form but didn't click add, include it
      if (this.childForm.name) {
        children.push({ ...this.childForm });
      }
      children.forEach(child => {
        if (child.name) {
          payloads.push({
            employee_id: employeeId,
            name: child.name,
            date_of_birth: this.formatDateOnly(child.date_of_birth),
          });
        }
      });
      return payloads;
    },

    hasPersonalData(payload) {
      return Object.values(payload).some(val => {
        if (Array.isArray(val)) {
          return val.length > 0;
        }
        if (val && typeof val === 'object') {
          return Object.values(val).some(v => v);
        }
        return !!val;
      });
    },

    hasBankData(payload) {
      return Object.values(payload).some(v => !!v);
    },

    hasFamilyData(payload) {
      return Object.values(payload).some(v => !!v);
    },

    addChild() {
      if (!this.childForm.name) {
        message.warning('Please enter child name before adding');
        return;
      }
      this.childrenEntries.push({ ...this.childForm });
      this.childForm = { name: '', date_of_birth: null };
    },

    removeChild(index) {
      this.childrenEntries.splice(index, 1);
    },

    addBeneficiary() {
      if (!this.beneficiaryForm.beneficiary_name || !this.beneficiaryForm.beneficiary_relationship || !this.beneficiaryForm.phone_number) {
        message.warning('Name, relationship, and phone are required to add a beneficiary');
        return;
      }
      this.beneficiariesEntries.push({ ...this.beneficiaryForm });
      this.beneficiaryForm = {
        beneficiary_name: '',
        beneficiary_relationship: '',
        phone_number: '',
        beneficiary_email: '',
        beneficiary_address: '',
      };
    },

    removeBeneficiary(index) {
      this.beneficiariesEntries.splice(index, 1);
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
        organization: '',
        gender: '',
        nationality: '',
        religion: '',
        marital_status: '',
        employee_status: '',
        date_of_birth: null,
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
        organization: '',
        gender: '',
        nationality: '',
        religion: '',
        marital_status: '',
        employee_status: '',
        date_of_birth: null,
      };
      this.personalForm = {
        mobile_phone: '',
        nationality: '',
        social_security_number: '',
        tax_number: '',
        religion: '',
        marital_status: '',
        spouse_name: '',
        spouse_phone_number: '',
        languages: [],
        current_address: '',
        permanent_address: '',
        // Direct columns instead of nested relationship
        identification_type: '',
        identification_number: '',
      };
      this.bankForm = {
        bank_name: '',
        bank_branch: '',
        bank_account_name: '',
        bank_account_number: '',
      };
      this.educationForm = {
        school_name: '',
        degree: '',
        start_date: null,
        end_date: null,
      };
      this.familyForm = {
        father_name: '',
        father_phone: '',
        mother_name: '',
        mother_phone: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
      };
      this.beneficiaryForm = {
        beneficiary_name: '',
        beneficiary_relationship: '',
        phone_number: '',
        beneficiary_email: '',
        beneficiary_address: '',
      };
      this.childForm = {
        name: '',
        date_of_birth: null,
      };
      this.childrenEntries = [];
      this.beneficiariesEntries = [];
      this.alertMessage = '';
      this.alertClass = '';
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
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
<style scoped>
.modal-dialog {
  max-width: 1200px;
}

.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.form-label-col {
  flex: 0 0 180px;
  min-width: 180px;
  padding-top: 8px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.form-input-col {
  flex: 1;
  min-width: 0;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0;
  text-align: right;
  color: #262626;
  font-size: 14px;
}

.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.input-short {
  width: 200px;
  max-width: 200px;
}

.input-medium {
  width: 400px;
  max-width: 400px;
}

.input-short-wrapper {
  width: 200px;
  max-width: 200px;
  flex: 1;
}

.tooltip-icon {
  pointer-events: auto;
  z-index: 1;
  margin-left: 0;
  margin-top: 0;
}

.form-control,
.form-select {
  width: 100%;
}

.form-select.input-short,
.form-select.input-medium {
  width: 200px;
  max-width: 200px;
}

.form-select.input-medium {
  width: 400px;
  max-width: 400px;
}

/* Date picker styling */
:deep(.datetimepicker) {
  width: 100%;
}

:deep(.datetimepicker.input-short) {
  width: 200px;
  max-width: 200px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }

  .form-label-col {
    flex: 1;
    min-width: 100%;
    padding-top: 0;
    justify-content: flex-start;
  }

  .form-label {
    text-align: left;
  }

  .input-short,
  .input-medium,
  .input-short-wrapper,
  .input-with-tooltip,
  .form-select.input-short,
  .form-select.input-medium {
    width: 100%;
    max-width: 100%;
  }
}
</style>

<template>
  <!-- Edit Employee Basic Information Modal -->
  <div class="modal fade" id="edit_employee">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h4 class="modal-title">Edit Employee</h4>
          <div class="d-flex align-items-center gap-3">
            <span class="text-muted">Staff ID : <strong>{{ editFormData.staff_id }}</strong></span>
            <button type="button" class="btn-close custom-btn-close" @click="handleModalClose('edit_employee')"
              aria-label="Close">
              <i class="ti ti-x"></i>
            </button>
          </div>
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
            <!-- Row 1: Organization -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-organization">
                  Organization :
                </label>
              </div>
              <div class="form-input-col">
                <select id="edit-organization" v-model="editFormData.organization" class="form-control input-short" required
                  @change="saveFormState('editFormData')">
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
                <input type="text" class="form-control input-medium" id="edit-staff-id" placeholder="Enter staff ID" v-model="editFormData.staff_id"
                  @input="saveFormState('editFormData')" />
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
                <select id="edit-initial-en" v-model="editFormData.initial_en" class="form-control input-short"
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

            <!-- Row 4: Initial (TH) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-initial-th">
                  Initial (TH) :
                </label>
              </div>
              <div class="form-input-col">
                <select id="edit-initial-th" v-model="editFormData.initial_th" class="form-control input-short"
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

            <!-- Row 5: First Name (EN) -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-first-name-en">
                  First Name (EN) <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="edit-first-name-en" maxlength="255" placeholder="Enter English first name"
                  v-model="editFormData.first_name_en" @input="saveFormState('editFormData')" />
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
                  v-model="editFormData.last_name_en" @input="saveFormState('editFormData')" />
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
                  v-model="editFormData.first_name_th" @input="saveFormState('editFormData')" />
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
                  v-model="editFormData.last_name_th" @input="saveFormState('editFormData')" />
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
                <select id="edit-gender" v-model="editFormData.gender" class="form-control input-short" required
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
                      :clearable="false" :input-format="dateFormat" v-model="editFormData.date_of_birth"
                      @update:model-value="handleDateChange('editFormData', 'date_of_birth', $event)" />
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
                <input type="text" class="form-control input-short" id="edit-age" v-model="calculatedAge" readonly />
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
                <select id="edit-employee-status" v-model="editFormData.status" class="form-control input-short" required
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
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h4 class="modal-title">Personal Information</h4>
          <div class="d-flex align-items-center gap-3">
            <span class="text-muted">Staff ID : <strong>{{ personalFormData.staff_id }}</strong></span>
            <button type="button" class="btn-close custom-btn-close" @click="handleModalClose('edit_personal')"
              aria-label="Close">
              <i class="ti ti-x"></i>
            </button>
          </div>
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
            <!-- Row 1: Phone -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-phone">
                  Phone <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="tel" class="form-control input-medium" id="edit-phone" v-model="personalFormData.mobile_phone"
                  placeholder="Enter phone number" required @input="saveFormState('personalFormData')" />
              </div>
            </div>

            <!-- Row 2: Nationality -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-nationality">
                  Nationality <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select id="edit-nationality" class="form-select input-medium" v-model="personalFormData.nationality"
                  @change="saveFormState('personalFormData')">
                  <option value="" disabled>Select Nationality</option>
                  <option v-for="nationality in nationalities" :key="nationality.id" :value="nationality.value"
                    :class="['text-secondary']">
                    {{ nationality.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 3: Social Security Number -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-ssn">
                  Social Security Number :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="edit-ssn" v-model="personalFormData.social_security_number"
                  placeholder="Enter SSN" @input="saveFormState('personalFormData')" />
              </div>
            </div>

            <!-- Row 4: Tax Number -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-tax-number">
                  Tax Number :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="edit-tax-number" v-model="personalFormData.tax_number"
                  placeholder="Enter tax number" @input="saveFormState('personalFormData')" />
              </div>
            </div>

            <!-- Row 5: Religion -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-religion">
                  Religion <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-medium" id="edit-religion" v-model="personalFormData.religion"
                  @change="saveFormState('personalFormData')">
                  <option value="" disabled selected>Select Religion</option>
                  <option v-for="religion in religions" :key="religion.id" :value="religion.value">
                    {{ religion.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 6: Marital Status -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-marital-status">
                  Marital Status <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-medium" id="edit-marital-status" v-model="personalFormData.marital_status"
                  @change="saveFormState('personalFormData')">
                  <option value="" disabled selected>Select Marital Status</option>
                  <option v-for="status in maritalStatuses" :key="status.id" :value="status.value">
                    {{ status.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 7: Spouse Name (conditional) -->
            <div class="form-row mb-3" v-if="personalFormData.marital_status === 'Married'">
              <div class="form-label-col">
                <label class="form-label" for="edit-spouse-name">
                  Spouse Name :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="edit-spouse-name" v-model="personalFormData.spouse_name"
                  placeholder="Enter spouse name" @input="saveFormState('personalFormData')" />
              </div>
            </div>

            <!-- Row 8: Spouse Mobile (conditional) -->
            <div class="form-row mb-3" v-if="personalFormData.marital_status === 'Married'">
              <div class="form-label-col">
                <label class="form-label" for="edit-spouse-mobile">
                  Spouse Mobile :
                </label>
              </div>
              <div class="form-input-col">
                <input type="tel" class="form-control input-medium" id="edit-spouse-mobile" v-model="personalFormData.spouse_mobile"
                  placeholder="Enter spouse mobile number" @input="saveFormState('personalFormData')" />
              </div>
            </div>

            <!-- Row 9: Languages -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-languages">
                  Languages :
                </label>
              </div>
              <div class="form-input-col">
                <div class="mb-3">

                  <!-- Custom Bootstrap Multi-Select (Ant Design Style) -->
                  <div class="custom-multi-select" style="width: 100%; position: relative;">
                    <!-- Selected Items Display -->
                    <div class="selected-items-container form-control"
                      style="min-height: 38px; padding: 4px 8px; cursor: pointer; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;"
                      @click="openDropdown" :class="{ 'focused': dropdownOpen }" @focus="openDropdown" tabindex="0">

                      <!-- Selected Language Tags -->
                      <span v-for="selectedLang in selectedLanguageItems" :key="selectedLang.value"
                        class="badge bg-primary me-1 mb-1 d-flex align-items-center"
                        style="font-size: 12px; padding: 4px 8px;">
                        {{ selectedLang.label }}
                        <i class="ti ti-x ms-1" style="cursor: pointer; font-size: 10px;"
                          @click.stop="removeLanguage(selectedLang.value)"></i>
                      </span>

                      <!-- Placeholder or Input -->
                      <input v-if="dropdownOpen" ref="searchInput" v-model="searchQuery" type="text"
                        placeholder="Search languages..."
                        style="border: none; outline: none; flex: 1; min-width: 100px; background: transparent;"
                        @keydown.escape="closeDropdown" @keydown.enter.prevent="selectFirstFiltered">

                      <span v-else-if="!personalFormData.languages || personalFormData.languages.length === 0"
                        class="text-muted" style="flex: 1;">
                        Select languages
                      </span>

                      <!-- Dropdown Arrow -->
                      <i class="ti ti-chevron-down ms-auto" style="transition: transform 0.2s; color: #999;"
                        :style="{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"></i>
                    </div>

                    <!-- Dropdown Menu -->
                    <div v-if="dropdownOpen" class="dropdown-menu show position-absolute w-100"
                      style="z-index: 1050; max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); top: 100%; left: 0;">

                      <!-- Clear All Option -->
                      <div v-if="personalFormData.languages && personalFormData.languages.length > 0"
                        class="dropdown-item text-danger d-flex align-items-center"
                        style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;"
                        @click="clearAllLanguages">
                        <i class="ti ti-trash me-2"></i>
                        Clear All
                      </div>

                      <!-- Language Options -->
                      <div v-for="option in filteredLanguageOptions" :key="option.value"
                        class="dropdown-item d-flex align-items-center" style="padding: 8px 12px; cursor: pointer;"
                        :class="{ 'active': isLanguageSelected(option.value) }" @click="toggleLanguage(option.value)">

                        <!-- Label -->
                        <span style="flex: 1;">{{ option.label }}</span>

                        <!-- Check Icon for Selected -->
                        <i v-if="isLanguageSelected(option.value)" class="ti ti-check text-primary"></i>
                      </div>

                      <!-- No Results -->
                      <div v-if="filteredLanguageOptions.length === 0" class="dropdown-item text-muted text-center"
                        style="padding: 12px;">
                        No languages found
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- Row 10: Current Address -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-current-address">
                  Current Address <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <textarea class="form-control" id="edit-current-address" v-model="personalFormData.current_address"
                  placeholder="Enter current address" rows="3" required
                  @input="saveFormState('personalFormData')"></textarea>
              </div>
            </div>

            <!-- Row 11: Permanent Address -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="edit-permanent-address">
                  Permanent Address <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <textarea class="form-control" id="edit-permanent-address" v-model="personalFormData.permanent_address"
                  placeholder="Enter permanent address" rows="3" required
                  @input="saveFormState('personalFormData')"></textarea>
              </div>
            </div>

            <!-- Identification Information Section -->
            <div class="card border rounded-3 mb-2">
              <div class="card-header bg-light">
                <h6 class="mb-0">Identification Information</h6>
              </div>
              <div class="card-body">
                <!-- Row 12: ID Type -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="edit-id-type">
                      ID Type <span class="text-danger">*</span> :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <select class="form-select input-medium" id="edit-id-type" v-model="personalFormData.identification_type"
                      @change="saveFormState('personalFormData')">
                      <option value="">Select ID Type</option>
                      <option v-for="idType in identificationTypeOptions" :key="idType.value" :value="idType.value">
                        {{ idType.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Row 13: ID Number -->
                <div class="form-row mb-3">
                  <div class="form-label-col">
                    <label class="form-label" for="edit-id-number">
                      ID Number :
                    </label>
                  </div>
                  <div class="form-input-col">
                    <input type="text" class="form-control input-medium" id="edit-id-number"
                      v-model="personalFormData.identification_number"
                      placeholder="Enter ID number" @input="saveFormState('personalFormData')" />
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
          <h4 class="modal-title">{{ isEditingBeneficiary ? 'Edit Beneficiary' : 'Add Beneficiary' }}</h4>
          <button type="button" class="btn-close custom-btn-close" @click="closeBeneficiaryModal()"
            aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <form @submit.prevent="submitBeneficiaryForm()">
          <div class="modal-body pb-0">
            <!-- Row 1: Beneficiary Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="beneficiary-name">
                  Beneficiary Name <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="beneficiary-name" v-model="beneficiaryForm.beneficiary_name" required
                  placeholder="Enter beneficiary name" />
              </div>
            </div>

            <!-- Row 2: Relationship -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="beneficiary-relationship">
                  Relationship <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-medium" id="beneficiary-relationship" v-model="beneficiaryForm.beneficiary_relationship" required>
                  <option value="" disabled>Select Relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <!-- Row 3: Phone Number -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="beneficiary-phone">
                  Phone Number <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="tel" class="form-control input-medium" id="beneficiary-phone" v-model="beneficiaryForm.phone_number" required
                  placeholder="Enter phone number" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2"
              @click="closeBeneficiaryModal()">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              {{ isEditingBeneficiary ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Beneficiary Modal -->



  <!-- Add/Edit Bank Information Modal -->
  <div class="modal fade" id="edit_bank">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ isEditingBank ? 'Edit Bank Information' : 'Add Bank Information' }}</h4>
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
            <!-- Row 1: Bank Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="bank-name">
                  Bank Name <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <select class="form-select input-medium" id="bank-name" v-model="bankForm.bank_name" required @change="saveFormState('bankForm')">
                  <option value="" disabled selected>Select Bank</option>
                  <option v-for="bank in bankNames" :key="bank.id" :value="bank.value">
                    {{ bank.value }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Row 2: Bank Account Number -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="bank-account-number">
                  Bank Account Number <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="bank-account-number" v-model="bankForm.bank_account_number" required
                  placeholder="Enter account number" @input="saveFormState('bankForm')" />
              </div>
            </div>

            <!-- Row 3: Account Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="bank-account-name">
                  Account Name <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="bank-account-name" v-model="bankForm.bank_account_name" required
                  placeholder="Enter account holder name" @input="saveFormState('bankForm')" />
              </div>
            </div>

            <!-- Row 4: Branch -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="bank-branch">
                  Branch <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="bank-branch" v-model="bankForm.bank_branch" required
                  placeholder="Enter branch name" @input="saveFormState('bankForm')" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-light border me-2"
              @click="handleModalClose('edit_bank')">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              {{ isEditingBank ? 'Update Bank Information' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add/Edit Bank Information Modal -->

  <!-- Add/Edit Parents & Emergency Contact Information Modal -->
  <div class="modal fade" id="edit_familyinformation">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h4 class="modal-title">Parents & Emergency Contact Information</h4>
          <div class="d-flex align-items-center gap-3">
            <span class="text-muted">Staff ID : <strong>{{ employee?.staff_id || 'N/A' }}</strong></span>
            <button type="button" class="btn-close custom-btn-close" @click="handleModalClose('edit_familyinformation')"
              aria-label="Close">
              <i class="ti ti-x"></i>
            </button>
          </div>
        </div>

        <!-- Restored Data Notification -->
        <div v-if="restoredDataNotification.familyForm" class="alert alert-info alert-dismissible fade show mx-3 mt-2"
          role="alert">
          <i class="ti ti-info-circle me-2"></i>
          Restored your previous unsaved changes from {{ formatRestoredTime(restoredDataNotification.familyFormTime) }}
          <button type="button" class="btn-close" @click="restoredDataNotification.familyForm = false"></button>
        </div>

        <div v-if="alertMessageFamily" class="alert" :class="alertClassFamily" role="alert">
          {{ alertMessageFamily }}
        </div>

        <form @submit.prevent="submitFamilyForm">
          <div class="modal-body pb-0">
            <!-- Father Information Section -->
            <div class="mb-4">
              <h6 class="mb-3"><i class="ti ti-user me-2"></i>Father Information</h6>
              
              <!-- Row 1: Father's Name -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="father-name">
                    Father's Name :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="text" class="form-control input-medium" id="father-name" v-model="familyForm.father_name" maxlength="100"
                    placeholder="Enter father's name" @input="saveFormState('familyForm')" />
                </div>
              </div>

              <!-- Row 2: Father's Occupation -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="father-occupation">
                    Father's Occupation :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="text" class="form-control input-medium" id="father-occupation" v-model="familyForm.father_occupation" maxlength="100"
                    placeholder="Enter father's occupation" @input="saveFormState('familyForm')" />
                </div>
              </div>

              <!-- Row 3: Father's Phone -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="father-phone">
                    Father's Phone :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="tel" class="form-control input-medium" id="father-phone" v-model="familyForm.father_phone" maxlength="20"
                    placeholder="Enter father's phone" @input="saveFormState('familyForm')" />
                </div>
              </div>
            </div>

            <!-- Mother Information Section -->
            <hr class="my-3">
            <div class="mb-4">
              <h6 class="mb-3"><i class="ti ti-user me-2"></i>Mother Information</h6>
              
              <!-- Row 4: Mother's Name -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="mother-name">
                    Mother's Name :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="text" class="form-control input-medium" id="mother-name" v-model="familyForm.mother_name" maxlength="100"
                    placeholder="Enter mother's name" @input="saveFormState('familyForm')" />
                </div>
              </div>

              <!-- Row 5: Mother's Occupation -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="mother-occupation">
                    Mother's Occupation :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="text" class="form-control input-medium" id="mother-occupation" v-model="familyForm.mother_occupation" maxlength="100"
                    placeholder="Enter mother's occupation" @input="saveFormState('familyForm')" />
                </div>
              </div>

              <!-- Row 6: Mother's Phone -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="mother-phone">
                    Mother's Phone :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="tel" class="form-control input-medium" id="mother-phone" v-model="familyForm.mother_phone" maxlength="20"
                    placeholder="Enter mother's phone" @input="saveFormState('familyForm')" />
                </div>
              </div>
            </div>

            <!-- Spouse Information Section -->
            <hr class="my-3">
            <div class="mb-4">
              <h6 class="mb-3"><i class="ti ti-heart me-2"></i>Spouse Information</h6>
              
              <!-- Row 7: Spouse Name -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="spouse-name-family">
                    Spouse Name :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="text" class="form-control input-medium" id="spouse-name-family" v-model="familyForm.spouse_name" maxlength="100"
                    placeholder="Enter spouse name" @input="saveFormState('familyForm')" />
                </div>
              </div>

              <!-- Row 8: Spouse Phone -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="spouse-phone-family">
                    Spouse Phone :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="tel" class="form-control input-medium" id="spouse-phone-family" v-model="familyForm.spouse_phone_number" maxlength="20"
                    placeholder="Enter spouse phone" @input="saveFormState('familyForm')" />
                </div>
              </div>
            </div>

            <!-- Emergency Contact Section -->
            <hr class="my-3">
            <div class="mb-4">
              <h6 class="mb-3"><i class="ti ti-phone me-2"></i>Emergency Contact</h6>
              
              <!-- Row 9: Emergency Contact Name -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="emergency-contact-name">
                    Emergency Contact Name :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="text" class="form-control input-medium" id="emergency-contact-name" v-model="familyForm.emergency_contact_name" maxlength="100"
                    placeholder="Enter emergency contact name" @input="saveFormState('familyForm')" />
                </div>
              </div>

              <!-- Row 10: Emergency Contact Relationship -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="emergency-contact-relationship">
                    Emergency Contact Relationship :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="text" class="form-control input-medium" id="emergency-contact-relationship" v-model="familyForm.emergency_contact_relationship"
                    maxlength="50" placeholder="Enter relationship" @input="saveFormState('familyForm')" />
                </div>
              </div>

              <!-- Row 11: Emergency Contact Phone -->
              <div class="form-row mb-3">
                <div class="form-label-col">
                  <label class="form-label" for="emergency-contact-phone">
                    Emergency Contact Phone :
                  </label>
                </div>
                <div class="form-input-col">
                  <input type="tel" class="form-control input-medium" id="emergency-contact-phone" v-model="familyForm.emergency_contact_phone" maxlength="20"
                    placeholder="Enter emergency contact phone" @input="saveFormState('familyForm')" />
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add/Edit Parents & Emergency Contact Information Modal -->

  <!-- Add/Edit Education Modal -->
  <div class="modal fade" id="edit_education">
    <div class="modal-dialog modal-dialog-centered modal-xl">
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
            <!-- Education Information Header -->
            <h6 class="mb-3"><i class="ti ti-school me-2"></i>Educational Background Information</h6>

            <!-- Row 1: School/Institution Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="education-school-name">
                  School/Institution Name <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control" id="education-school-name" v-model="educationForm.school_name" required
                  placeholder="Enter school or institution name" @input="saveFormState('educationForm')"
                  maxlength="100" />
              </div>
            </div>

            <!-- Row 2: Degree/Qualification -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="education-degree">
                  Degree/Qualification <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control" id="education-degree" v-model="educationForm.degree" required
                  placeholder="Enter degree or qualification obtained" @input="saveFormState('educationForm')"
                  maxlength="100" />
              </div>
            </div>

            <!-- Study Period Section -->
            <hr class="my-3">
            <h6 class="mb-3"><i class="ti ti-calendar me-2"></i>Study Period</h6>

            <!-- Row 3: Start Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="education-start-date">
                  Start Date <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker v-model="educationForm.start_date" class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                      @update:model-value="handleDateChange('educationForm', 'start_date', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the start date of your education" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 4: End Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="education-end-date">
                  End Date <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker v-model="educationForm.end_date" class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                      @update:model-value="handleDateChange('educationForm', 'end_date', $event)" />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar text-gray-7"></i>
                    </span>
                  </div>
                  <span data-bs-toggle="tooltip" data-bs-placement="top"
                    title="Select the end date of your education" class="tooltip-icon">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
                  </span>
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
            <!-- Row 1: Child Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="child-name">
                  Child Name <span class="text-danger">*</span> :
                </label>
              </div>
              <div class="form-input-col">
                <input type="text" class="form-control input-medium" id="child-name" v-model="childForm.name" required
                  @input="saveFormState('childForm')" />
              </div>
            </div>

            <!-- Row 2: Date of Birth -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label" for="child-date-of-birth">
                  Date of Birth :
                </label>
              </div>
              <div class="form-input-col">
                <div class="input-with-tooltip">
                  <div class="input-icon-end position-relative input-short-wrapper">
                    <date-picker v-model="childForm.date_of_birth" class="form-control datetimepicker input-short"
                      placeholder="dd/mm/yyyy" :editable="true" :clearable="false" :input-format="dateFormat"
                      @update:model-value="handleDateChange('childForm', 'date_of_birth', $event)" />
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
import { Modal, Tooltip } from 'bootstrap';
import { Modal as AntModal } from 'ant-design-vue'; // Add Ant Design Modal import
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'; // Add icon imports
import { useLookupStore } from "@/stores/lookupStore";
import employeeService from "@/services/employee.service";
import employeeChildrenService from "@/services/employee-children.service";
import employeeEducationService from "@/services/employeeEducation.service";
import employeeBeneficiaryService from "@/services/employeeBeneficiary.service";
// Ant Design is globally imported in main.js

const currentDate = ref(new Date());
const currentDateOne = ref(new Date());
const currentDateTwo = ref(new Date());
const currentDateThree = ref(new Date());
const currentDateFour = ref(new Date());
const currentDateFive = ref(new Date());
const currentDateSix = ref(new Date());

export default {
  emits: ['employee-updated', 'grantPositionAdded'],
  components: {
    // Ant Design components are globally available
    InfoCircleOutlined,
  },
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
      alertMessageFamily: '',
      alertClass: '',
      alertClassBasic: '',
      alertClassPersonal: '',
      alertClassFamily: '',
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
      languages: [],
      bankNames: [],
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
        familyFormTime: null,
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
        spouse_phone_number: '',
        languages: [],
        current_address: '',
        permanent_address: '',
        // Direct columns instead of nested relationship
        identification_type: '',
        identification_number: '',
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
        organization: '',
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
      },

      familyForm: {
        id: null,
        father_name: '',
        father_occupation: '',
        father_phone: '',
        mother_name: '',
        mother_occupation: '',
        mother_phone: '',
        spouse_name: '',
        spouse_phone_number: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
      },

      educationForm: {
        id: null,
        employee_id: '',
        school_name: '',
        degree: '',
        start_date: null,
        end_date: null,
      },

      selectedLanguages: [],

      // Custom multi-select data
      dropdownOpen: false,
      searchQuery: '',

      childForm: {
        id: null,
        employee_id: '',
        name: '',
        date_of_birth: null, // Initialize as null instead of empty string
      },

      beneficiaryForm: {
        id: null,
        employee_id: '',
        beneficiary_name: '',
        beneficiary_relationship: '',
        phone_number: '',
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


    languageOptions() {
      if (!this.languages || !Array.isArray(this.languages)) {
        return [];
      }

      if (this.languages.length === 0) {
        return [];
      }

      return this.languages.map(language => ({
        value: language.value,
        label: language.value
      }));
    },

    // Get selected language items for display
    selectedLanguageItems() {
      if (!this.personalFormData.languages || !Array.isArray(this.personalFormData.languages)) {
        return [];
      }
      return this.languageOptions.filter(option =>
        this.personalFormData.languages.includes(option.value)
      );
    },

    // Filter language options based on search
    filteredLanguageOptions() {
      if (!this.searchQuery) {
        return this.languageOptions;
      }
      return this.languageOptions.filter(option =>
        option.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

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
          await lookupStore.fetchAllLookupLists();
        }

        if (this.isDestroyed) return;

        // Set all lookup data synchronously
        this.genders = lookupStore.getLookupsByType('gender') || [];
        this.nationalities = lookupStore.getLookupsByType('nationality') || [];
        this.religions = lookupStore.getLookupsByType('religion') || [];
        this.maritalStatuses = lookupStore.getLookupsByType('marital_status') || [];
        this.statuses = lookupStore.getLookupsByType('employee_status') || [];
        this.subsidiaries = lookupStore.getLookupsByType('organization') || [];
        this.employeeInitialEN = lookupStore.getLookupsByType('employee_initial_en') || [];
        this.employeeInitialTH = lookupStore.getLookupsByType('employee_initial_th') || [];
        this.idTypes = lookupStore.getLookupsByType('identification_types') || [];
        this.languages = lookupStore.getLookupsByType('employee_language') || [];
        this.bankNames = lookupStore.getLookupsByType('bank_name') || [];

        console.log(`📊 Loaded ${this.bankNames.length} bank names from lookup store:`, this.bankNames);

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
          Object.assign(this.familyForm, familyData);
          this.restoredDataNotification.familyForm = true;
          this.restoredDataNotification.familyFormTime = savedData.familyForm.timestamp || Date.now();
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
            organization: this.employee.organization || '',
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
            spouse_phone_number: this.employee.spouse_phone_number || '',
            languages: this.employee.languages || [],
            current_address: this.employee.current_address || '',
            permanent_address: this.employee.permanent_address || '',
            // Direct columns instead of nested relationship
            identification_type: this.employee.identification_type || '',
            identification_number: this.employee.identification_number || '',
          };
        }

        // Reset other forms
        this.resetBankForm();
        this.resetFamilyForm();
        this.resetEducationForm();
        this.resetChildForm();

        // Reset alert messages
        this.alertMessageFamily = '';
        this.alertClassFamily = '';
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
        spouse_phone_number: this.personalFormData.spouse_phone_number,
        // Direct columns instead of nested relationship
        identification_type: this.personalFormData.identification_type || null,
        identification_number: this.personalFormData.identification_number || null,
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



    async submitBankForm() {
      if (this.isDestroyed) return;

      try {
        this.isSubmitting = true;

        // Validate required fields
        if (!this.bankForm.bank_name || !this.bankForm.bank_account_number || !this.bankForm.bank_account_name || !this.bankForm.bank_branch) {
          this.$message.error('Please fill in all required fields');
          return;
        }

        // Prepare payload for the new dedicated bank endpoint
        const payload = {
          bank_name: this.bankForm.bank_name,
          bank_account_number: this.bankForm.bank_account_number,
          bank_account_name: this.bankForm.bank_account_name,
          bank_branch: this.bankForm.bank_branch,
        };

        console.log('Updating bank information for employee:', this.employee.id, 'with payload:', payload);

        // Call the dedicated bank information update API
        const response = await employeeService.updateBankInformation(this.employee.id, payload);

        if (response.success) {
          this.$message.success('Bank information updated successfully');
          this.$emit('employee-updated');

          // Clear saved form data after successful submission
          this.clearFormSection(this.employee.id, 'bankForm');
          this.markAsSaved(this.employee.id);

          // Reset form
          this.resetBankForm();

          // Close modal
          await this.safeHideModal('edit_bank');
        } else {
          throw new Error(response.message || 'Failed to update bank information');
        }
      } catch (error) {
        console.error('Error submitting bank form:', error);

        // Handle validation errors from backend
        if (error.response?.status === 422 && error.response?.data?.errors) {
          const errors = error.response.data.errors;
          const errorMessage = Object.values(errors).flat().join(', ');
          this.$message.error(`Validation Error: ${errorMessage}`);
        } else if (error.response?.status === 404) {
          this.$message.error('Employee not found');
        } else {
          this.$message.error(error.response?.data?.message || 'Failed to save bank information');
        }
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
      };
      this.isEditingBank = false;
    },

    // Open Bank Modal (for both add and edit)
    async openBankModal(bankData = null) {
      if (this.isDestroyed) return;

      if (bankData && (bankData.bank_name || bankData.bank_account_number || bankData.bank_account_name || bankData.bank_branch)) {
        // Edit mode - has existing bank data
        this.isEditingBank = true;
        this.bankForm = {
          id: bankData.id || null,
          bank_name: bankData.bank_name || '',
          bank_account_number: bankData.bank_account_number || '',
          bank_account_name: bankData.bank_account_name || '',
          bank_branch: bankData.bank_branch || '',
        };
        console.log('Opening bank modal in edit mode with data:', this.bankForm);
      } else {
        // Add mode
        this.isEditingBank = false;
        this.resetBankForm();
        console.log('Opening bank modal in add mode');
      }

      await this.safeShowModal('edit_bank');
    },

    // Submit beneficiary form
    async submitBeneficiaryForm() {
      if (this.isDestroyed) return;

      try {
        this.isSubmitting = true;

        // Validate required fields
        if (!this.beneficiaryForm.beneficiary_name || !this.beneficiaryForm.beneficiary_relationship || !this.beneficiaryForm.phone_number) {
          this.$message.error('Please fill in all required fields');
          return;
        }

        // Prepare payload
        const payload = {
          employee_id: this.employee.id,
          beneficiary_name: this.beneficiaryForm.beneficiary_name,
          beneficiary_relationship: this.beneficiaryForm.beneficiary_relationship,
          phone_number: this.beneficiaryForm.phone_number,
        };

        console.log('Submitting beneficiary form:', payload);

        let response;
        if (this.isEditingBeneficiary && this.beneficiaryForm.id) {
          // Update existing beneficiary
          response = await employeeBeneficiaryService.updateBeneficiary(this.beneficiaryForm.id, payload);
        } else {
          // Create new beneficiary
          response = await employeeBeneficiaryService.createBeneficiary(payload);
        }

        if (response.success) {
          this.$message.success(this.isEditingBeneficiary ? 'Beneficiary updated successfully' : 'Beneficiary added successfully');
          this.$emit('employee-updated');

          // Clear saved form data after successful submission
          this.clearFormSection(this.employee.id, 'beneficiaryForm');
          this.markAsSaved(this.employee.id);

          // Reset form
          this.resetBeneficiaryForm();

          // Close modal
          await this.safeHideModal('add_beneficiary');
        } else {
          throw new Error(response.message || 'Failed to save beneficiary information');
        }
      } catch (error) {
        console.error('Error submitting beneficiary form:', error);

        // Handle validation errors from backend
        if (error.response?.status === 422 && error.response?.data?.errors) {
          const errors = error.response.data.errors;
          const errorMessage = Object.values(errors).flat().join(', ');
          this.$message.error(`Validation Error: ${errorMessage}`);
        } else if (error.response?.status === 404) {
          this.$message.error('Employee not found');
        } else {
          this.$message.error(error.response?.data?.message || 'Failed to save beneficiary information');
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    // Reset beneficiary form
    resetBeneficiaryForm() {
      if (this.isDestroyed) return;

      this.beneficiaryForm = {
        id: null,
        employee_id: '',
        beneficiary_name: '',
        beneficiary_relationship: '',
        phone_number: '',
      };
      this.isEditingBeneficiary = false;
    },

    // Open Beneficiary Modal (for both add and edit)
    async openBeneficiaryModal(beneficiaryData = null) {
      if (this.isDestroyed) return;

      if (beneficiaryData && beneficiaryData.beneficiary_name) {
        // Edit mode - has existing beneficiary data
        this.isEditingBeneficiary = true;
        this.beneficiaryForm = {
          id: beneficiaryData.id || null,
          employee_id: beneficiaryData.employee_id || this.employee.id,
          beneficiary_name: beneficiaryData.beneficiary_name || '',
          beneficiary_relationship: beneficiaryData.beneficiary_relationship || '',
          phone_number: beneficiaryData.phone_number || '',
        };
        console.log('Opening beneficiary modal in edit mode with data:', this.beneficiaryForm);
      } else {
        // Add mode
        this.isEditingBeneficiary = false;
        this.resetBeneficiaryForm();
        this.beneficiaryForm.employee_id = this.employee.id;
        console.log('Opening beneficiary modal in add mode');
      }

      await this.safeShowModal('add_beneficiary');
    },

    // Close Beneficiary Modal
    async closeBeneficiaryModal() {
      if (this.isDestroyed) return;

      // Save form state before closing
      this.saveFormState('beneficiaryForm');

      // Close modal
      await this.safeHideModal('add_beneficiary');
    },

    // Submit family form
    async submitFamilyForm() {
      if (this.isDestroyed) return;

      this.loading = true;
      this.error = null;
      this.alertMessageFamily = '';
      this.alertClassFamily = '';

      try {
        this.isSubmitting = true;

        // Prepare payload according to backend API specification
        const payload = {
          father_name: this.familyForm.father_name,
          father_occupation: this.familyForm.father_occupation,
          father_phone: this.familyForm.father_phone,
          mother_name: this.familyForm.mother_name,
          mother_occupation: this.familyForm.mother_occupation,
          mother_phone: this.familyForm.mother_phone,
          spouse_name: this.familyForm.spouse_name,
          spouse_phone_number: this.familyForm.spouse_phone_number,
          emergency_contact_name: this.familyForm.emergency_contact_name,
          emergency_contact_relationship: this.familyForm.emergency_contact_relationship,
          emergency_contact_phone: this.familyForm.emergency_contact_phone,
        };

        // Remove empty fields to avoid unnecessary API payload
        Object.keys(payload).forEach(key => {
          if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
            delete payload[key];
          }
        });

        console.log('Family payload for API:', payload);

        // Call the family information update API
        const response = await employeeService.updateEmployeeFamilyInformation(this.employee.id, payload);

        if (this.isDestroyed) return;

        if (response && response.success) {
          this.$emit('employee-updated', response.data);
          this.alertMessageFamily = response.message || 'Family information updated successfully';
          this.alertClassFamily = 'alert-success';

          // Clear saved form data after successful submission
          this.clearFormSection(this.employee.id, 'familyForm');
          this.markAsSaved(this.employee.id);
        } else {
          this.alertMessageFamily = response?.message || 'Failed to update family information';
          this.alertClassFamily = 'alert-danger';
        }
        return response;
      } catch (error) {
        if (this.isDestroyed) return;

        console.error('Error submitting family form:', error);

        this.error = error.message || 'Failed to update family information';
        this.alertMessageFamily = this.error;
        this.alertClassFamily = 'alert-danger';
        throw error;
      } finally {
        this.loading = false;
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
        mother_name: '',
        mother_occupation: '',
        mother_phone: '',
        spouse_name: '',
        spouse_phone_number: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
      };
      this.isEditingFamily = false;
    },

    // Open Family Modal (for both add and edit)
    async openFamilyModal(familyData = null) {
      if (this.isDestroyed) return;

      if (familyData) {
        // Edit mode - populate with existing family data
        this.isEditingFamily = true;
        this.familyForm = {
          id: familyData.id,
          father_name: familyData.father_name || '',
          father_occupation: familyData.father_occupation || '',
          father_phone: familyData.father_phone_number || familyData.father_phone || '', // Handle both field names
          mother_name: familyData.mother_name || '',
          mother_occupation: familyData.mother_occupation || '',
          mother_phone: familyData.mother_phone_number || familyData.mother_phone || '', // Handle both field names
          spouse_name: familyData.spouse_name || '',
          spouse_phone_number: familyData.spouse_phone_number || '',
          emergency_contact_name: familyData.emergency_contact_person_name || familyData.emergency_contact_name || '', // Handle backend field name
          emergency_contact_relationship: familyData.emergency_contact_person_relationship || familyData.emergency_contact_relationship || '', // Handle backend field name
          emergency_contact_phone: familyData.emergency_contact_person_phone || familyData.emergency_contact_phone || '', // Handle backend field name
        };
      } else {
        // Add mode - populate with employee data if available
        this.isEditingFamily = false;
        this.familyForm = {
          id: null,
          father_name: this.employee?.father_name || '',
          father_occupation: this.employee?.father_occupation || '',
          father_phone: this.employee?.father_phone_number || '',
          mother_name: this.employee?.mother_name || '',
          mother_occupation: this.employee?.mother_occupation || '',
          mother_phone: this.employee?.mother_phone_number || '',
          spouse_name: this.employee?.spouse_name || '',
          spouse_phone_number: this.employee?.spouse_phone_number || '',
          emergency_contact_name: this.employee?.emergency_contact_person_name || '',
          emergency_contact_relationship: this.employee?.emergency_contact_person_relationship || '',
          emergency_contact_phone: this.employee?.emergency_contact_person_phone || '',
        };
      }

      await this.safeShowModal('edit_familyinformation');
    },

    // Submit education form
    async submitEducationForm() {
      if (this.isDestroyed) return;

      try {
        this.isSubmitting = true;

        // Validate using service validation
        const validation = employeeEducationService.validateEducationData({
          employee_id: this.employee.id,
          school_name: this.educationForm.school_name,
          degree: this.educationForm.degree,
          start_date: this.educationForm.start_date,
          end_date: this.educationForm.end_date,
        });

        if (!validation.isValid) {
          this.$message.error(validation.errors[0]);
          return;
        }

        // Prepare payload
        const payload = {
          employee_id: this.employee.id,
          school_name: this.educationForm.school_name,
          degree: this.educationForm.degree,
          start_date: employeeEducationService.formatDateForAPI(this.educationForm.start_date),
          end_date: employeeEducationService.formatDateForAPI(this.educationForm.end_date),
          created_by: this.$store?.state?.auth?.user?.username || 'system',
          updated_by: this.$store?.state?.auth?.user?.username || 'system'
        };

        let response;
        if (this.isEditingEducation && this.educationForm.id) {
          // Update existing education
          response = await employeeEducationService.updateEmployeeEducation(this.educationForm.id, payload);
        } else {
          // Create new education
          response = await employeeEducationService.createEmployeeEducation(payload);
        }

        if (response && response.data) {
          this.$message.success(`Education information ${this.isEditingEducation ? 'updated' : 'added'} successfully`);
          this.$emit('employee-updated');

          // Clear saved form data after successful submission
          this.clearFormSection(this.employee.id, 'educationForm');
          this.markAsSaved(this.employee.id);

          // Reset form
          this.resetEducationForm();

          // Close modal
          await this.safeHideModal('edit_education');
        } else {
          this.$message.error(`Failed to ${this.isEditingEducation ? 'update' : 'add'} education information`);
        }
      } catch (error) {
        console.error('Error submitting education form:', error);

        // Handle validation errors from backend
        if (error.response && error.response.status === 422 && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          this.$message.error(errorMessages[0] || 'Validation error occurred');
        } else if (error.response && error.response.data && error.response.data.message) {
          this.$message.error(error.response.data.message);
        } else {
          this.$message.error(`Error ${this.isEditingEducation ? 'updating' : 'adding'} education information: ` + (error.message || 'Unknown error'));
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    // Reset education form
    resetEducationForm() {
      if (this.isDestroyed) return;

      this.educationForm = {
        id: null,
        employee_id: '',
        school_name: '',
        degree: '',
        start_date: null,
        end_date: null,
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
          employee_id: educationData.employee_id || this.employee.id,
          school_name: educationData.school_name || '',
          degree: educationData.degree || '',
          start_date: this.safeConvertToDate(educationData.start_date),
          end_date: this.safeConvertToDate(educationData.end_date),
        };
      } else {
        // Add mode - restore saved form data if available  
        this.isEditingEducation = false;
        const savedData = await this.checkForSavedData(this.employee.id);

        if (savedData?.data?.educationForm && !this.isEditingEducation) {
          const educationData = { ...savedData.data.educationForm };
          if (educationData.start_date) {
            educationData.start_date = this.safeConvertToDate(educationData.start_date);
          }
          if (educationData.end_date) {
            educationData.end_date = this.safeConvertToDate(educationData.end_date);
          }
          Object.assign(this.educationForm, educationData);
          this.restoredDataNotification.educationForm = true;
        } else {
          this.resetEducationForm();
        }
      }

      await this.safeShowModal('edit_education');
    },

    // Open Add Education Modal
    async openAddEducationModal() {
      await this.openEducationModal();
    },

    // Open Edit Education Modal
    async openEditEducationModal(education) {
      await this.openEducationModal(education);
    },

    // Delete Education
    async deleteEducation(educationId) {
      this.$confirm({
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this education record? This action cannot be undone.',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
        onOk: async () => {
          try {
            const response = await employeeEducationService.deleteEmployeeEducation(educationId);

            if (response) {
              this.$message.success('Education record deleted successfully');
              this.$emit('employee-updated');
            } else {
              this.$message.error('Failed to delete education record');
            }
          } catch (error) {
            console.error('Error deleting education:', error);
            if (error.response && error.response.status === 404) {
              this.$message.error('Education record not found or already deleted');
            } else if (error.response && error.response.data && error.response.data.message) {
              this.$message.error(error.response.data.message);
            } else {
              this.$message.error('Error deleting education record: ' + (error.message || 'Unknown error'));
            }
          }
        }
      });
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



    // Custom multi-select methods
    openDropdown() {
      if (!this.dropdownOpen) {
        this.dropdownOpen = true;
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus();
          }
        });
      }
    },

    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
      if (this.dropdownOpen) {
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus();
          }
        });
      } else {
        this.searchQuery = '';
      }
    },

    closeDropdown() {
      this.dropdownOpen = false;
      this.searchQuery = '';
    },

    isLanguageSelected(value) {
      return this.personalFormData.languages && this.personalFormData.languages.includes(value);
    },

    toggleLanguage(value) {
      if (!this.personalFormData.languages) {
        this.personalFormData.languages = [];
      }

      const index = this.personalFormData.languages.indexOf(value);
      if (index > -1) {
        // Remove language
        this.personalFormData.languages.splice(index, 1);
      } else {
        // Add language
        this.personalFormData.languages.push(value);
      }

      this.saveFormState('personalFormData');
    },

    removeLanguage(value) {
      if (this.personalFormData.languages) {
        const index = this.personalFormData.languages.indexOf(value);
        if (index > -1) {
          this.personalFormData.languages.splice(index, 1);
          this.saveFormState('personalFormData');
        }
      }
    },

    clearAllLanguages() {
      this.personalFormData.languages = [];
      this.saveFormState('personalFormData');
      this.closeDropdown();
    },

    selectFirstFiltered() {
      if (this.filteredLanguageOptions.length > 0) {
        const firstOption = this.filteredLanguageOptions[0];
        if (!this.isLanguageSelected(firstOption.value)) {
          this.toggleLanguage(firstOption.value);
        }
        this.searchQuery = '';
      }
    },

    // Handle click outside to close dropdown
    handleClickOutside(event) {
      const multiSelect = event.target.closest('.custom-multi-select');
      if (!multiSelect && this.dropdownOpen) {
        this.closeDropdown();
      }
    },

    // Initialize Bootstrap tooltips
    initializeTooltips() {
      if (this.isDestroyed) return;
      
      nextTick(() => {
        if (this.isDestroyed) return;
        
        const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipElements.forEach(element => {
          // Check if tooltip is already initialized
          if (!element._tooltip) {
            new Tooltip(element);
          }
        });
      });
    },
  },

  mounted() {
    if (this.isDestroyed) return;

    this.fetchGrantPositions();

    // Add click outside handler for custom multi-select
    document.addEventListener('click', this.handleClickOutside);

    // Clean up expired data when component mounts
    const formStore = useFormPersistenceStore();
    formStore.cleanupExpiredData();

    // Initialize tooltips
    this.initializeTooltips();

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

        modalEl.addEventListener('shown.bs.modal', async (event) => {
          // Initialize tooltips when modal is shown
          this.initializeTooltips();
        });

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
              // No date fields to convert for familyForm
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
                this.restoredDataNotification.familyFormTime = savedData.timestamp;
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
            organization: newVal.organization || '',
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
            spouse_phone_number: newVal.spouse_phone_number || '',
            languages: newVal.languages || [],
            current_address: newVal.current_address || '',
            permanent_address: newVal.permanent_address || '',
            // Direct columns instead of nested relationship
            identification_type: newVal.identification_type || '',
            identification_number: newVal.identification_number || '',
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

    // Remove click outside handler
    document.removeEventListener('click', this.handleClickOutside);

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

/* Custom Multi-Select Styling */
.custom-multi-select .focused {
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

.custom-multi-select .dropdown-item:hover {
  background-color: #f5f5f5;
}

.custom-multi-select .dropdown-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
}

.custom-multi-select .badge {
  font-weight: normal;
  border-radius: 4px;
}

.custom-multi-select .badge .ti-x:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

/* Horizontal Form Layout Styles */
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
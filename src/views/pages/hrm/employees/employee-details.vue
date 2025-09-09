<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <div class="my-auto mb-2">
          <h6 class="fw-medium d-inline-flex align-items-center mb-3 mb-sm-0">
            <router-link to="/employee/employee-list">
              <i class="ti ti-arrow-left me-2"></i>Employee Details</router-link>
          </h6>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <!-- <div class="mb-2">
            <a
              href="javascript:void(0);"
              data-bs-toggle="modal"
              data-bs-target="#add_bank_satutory"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Add Bank & Statutory</a
            >
          </div> -->
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" class="" data-bs-toggle="tooltip" data-bs-placement="top"
              data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div v-if="loading" class="text-center my-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading employee details...</p>
      </div>

      <div v-else class="row">
        <!-- Employee Details -->
        <div class="col-xl-5 theiaStickySidebar">
          <div class="card card-bg-1">
            <div class="card-body p-0">
              <span class="avatar avatar-xl avatar-rounded border border-2 border-white m-auto d-flex mb-2">
                <img :src="require('@/assets/img/users/user-13.jpg')" class="w-auto h-auto" alt="Employee Image" />
              </span>
              <div class="text-center px-3 pb-3 border-bottom">
                <div class="mb-3">
                  <h5 class="d-flex align-items-center justify-content-center mb-1">
                    {{ employee.initial_en }}. {{ employee.first_name_en }} {{ employee.last_name_en }}
                  </h5>
                  <span :class="[
                    'badge badge-sm fw-bold',
                    employee.subsidiary === 'SMRU' ? 'badge-primary' :
                      employee.subsidiary === 'BHF' ? 'badge-soft-primary fw-bold' :
                        'badge-secondary'
                  ]" class="me-2">
                    {{ employee.subsidiary }}
                  </span>
                  <span class="badge badge-soft-dark fw-medium me-2">
                    <i class="ti ti-point-filled text-dark me-1"></i>{{ employee.status || 'Status N/A' }}
                  </span>
                  <span class="badge badge-soft-dark fw-medium me-2">
                    <i class="ti ti-point-filled text-dark me-1"></i>{{ employee.employment?.position?.title ||
                      'Position N/A' }}
                  </span>


                </div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <h6>Basic information</h6>
                  <button class="btn btn-icon btn-sm" @click="openEditModal">
                    <i class="ti ti-edit"></i>
                  </button>
                </div>
                <div>
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-id text-primary me-2"></i>
                      Staff ID
                    </span>
                    <p class="text-dark">{{ employee.staff_id || 'N/A' }}</p>
                  </div>

                  <!-- First Name -->
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <!-- “signature” suggests a personal name -->
                      <i class="ti ti-signature text-info me-2"></i>
                      First Name
                    </span>
                    <p class="text-dark">{{ employee.first_name_en || 'N/A' }}</p>
                  </div>

                  <!-- Last Name -->
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <!-- “id-badge” evokes an ID card with your name on it -->
                      <i class="ti ti-id-badge text-info me-2"></i>
                      Last Name
                    </span>
                    <p class="text-dark">{{ employee.last_name_en || 'N/A' }}</p>
                  </div>

                  <!-- Initial TH-->
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-id-badge text-info me-2"></i>
                      Initial TH
                    </span>
                    <p class="text-dark">{{ employee.initial_th || 'N/A' }}</p>
                  </div>
                  <!-- First Name – Thai -->
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <!-- a simple flag icon to denote the Thai version -->
                      <i class="ti ti-flag text-warning me-2"></i>
                      First Name – Thai
                    </span>
                    <p class="text-dark">{{ employee.first_name_th || 'N/A' }}</p>
                  </div>

                  <!-- Last Name – Thai -->
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <!-- same flag here to keep it consistent -->
                      <i class="ti ti-flag text-warning me-2"></i>
                      Last Name – Thai
                    </span>
                    <p class="text-dark">{{ employee.last_name_th || 'N/A' }}</p>
                  </div>

                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-gender-male me-2"></i>
                      Gender
                    </span>
                    <p class="text-dark text-end">{{ employee.gender || 'N/A' }}</p>
                  </div>

                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-cake me-2"></i>
                      Birthday
                    </span>
                    <p class="text-dark text-end">{{ formatDate(employee.date_of_birth) }}</p>
                  </div>

                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-calendar me-2"></i>
                      Birthday (Thai)
                    </span>
                    <p class="text-dark text-end">{{ employee.date_of_birth ? formatThaiDate(employee.date_of_birth) :
                      'N/A' }}</p>
                  </div>

                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-hourglass me-2"></i>
                      Age
                    </span>
                    <p class="text-dark text-end">
                      {{
                        employee.date_of_birth
                          ? (() => {
                            const dob = new Date(employee.date_of_birth);
                            const today = new Date();
                            let age = today.getFullYear() - dob.getFullYear();
                            const m = today.getMonth() - dob.getMonth();
                            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) { age--; } return age;
                          })() : 'N/A'}}
                        </p>
                  </div>


                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-status-change me-2"></i>
                      Status
                    </span>
                    <p class="text-dark text-end">{{ employee.status || 'N/A' }}</p>
                  </div>


                </div>
              </div>

              <div class="p-3 border-bottom">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <h6>Personal Information</h6>
                  <button class="btn btn-icon btn-sm" @click="openPersonalEditModal">
                    <i class="ti ti-edit"></i>
                  </button>
                </div>

                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-phone me-2"></i>
                    Phone
                  </span>
                  <p class="text-dark">{{ employee.mobile_phone || 'N/A' }}</p>
                </div>

                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-flag me-2"></i>
                    Nationality
                  </span>
                  <p class="text-dark text-end">{{ employee.nationality || 'N/A' }}</p>
                </div>

                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-id-badge me-2"></i>
                    Social Security Number
                  </span>
                  <p class="text-dark mb-0">{{ employee.social_security_number || 'N/A' }}</p>
                </div>

                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-calendar-x me-2"></i>
                    Tax Number
                  </span>
                  <p class="text-dark text-end mb-0">{{ employee.tax_number || 'N/A' }}</p>
                </div>

                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-pray me-2"></i>
                    Religion
                  </span>
                  <p class="text-dark text-end">{{ employee.religion || 'N/A' }}</p>
                </div>

                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-heart me-2"></i>
                    Marital Status
                  </span>
                  <p class="text-dark text-end">{{ employee.marital_status || 'N/A' }}</p>
                </div>

                <template v-if="employee.marital_status === 'Married'">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-user me-2"></i>
                      Spouse Name
                    </span>
                    <p class="text-dark text-end">{{ employee.spouse_name || 'N/A' }}</p>
                  </div>

                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-phone me-2"></i>
                      Spouse Mobile
                    </span>
                    <p class="text-dark text-end">{{ employee.spouse_mobile || 'N/A' }}</p>
                  </div>
                </template>

                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-language me-2"></i>
                    Languages
                  </span>
                  <p class="text-dark text-end">
                    {{employee.employee_languages && employee.employee_languages.length > 0 ?
                      employee.employee_languages.map(lang =>
                        lang.language).join(', ') : 'N/A'}}
                  </p>
                </div>

                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-map-pin-check me-2"></i>
                    Current Address
                  </span>
                  <p class="text-dark text-end">
                    {{ employee.current_address }}
                  </p>
                </div>

                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-map-pin-check me-2"></i>
                    Permanent Address
                  </span>
                  <p class="text-dark text-end">{{ employee.permanent_address || 'N/A' }}</p>
                </div>

                <hr class="my-3">

                <div class="card border rounded-3 mb-2">
                  <div class="card-header bg-light">
                    <h6 class="mb-0">Identification Information</h6>
                  </div>
                  <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="d-inline-flex align-items-center">
                        <i class="ti ti-e-passport me-2"></i>
                        ID type
                      </span>
                      <p class="text-dark mb-0">{{ employee.employee_identification ?
                        employee.employee_identification.id_type :
                        'N/A' }}</p>
                    </div>

                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="d-inline-flex align-items-center">
                        <i class="ti ti-id-badge me-2"></i>
                        ID Number
                      </span>
                      <p class="text-dark mb-0">{{ employee.employee_identification ?
                        employee.employee_identification.document_number : 'N/A' }}</p>
                    </div>

                    <!-- <template
                      v-if="employee.employee_identification && employee.employee_identification.id_type === 'Passport'">
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-passport me-2"></i>
                          Passport Number
                      </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.document_number || 'N/A' }}</p>
                    </div>

                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-calendar-event me-2"></i>
                          Passport expiry date
                      </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.expiry_date || 'N/A' }}</p>
                    </div>

                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-calendar-stats me-2"></i>
                          Date to renew passport
                        </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.renewal_date || 'N/A' }}</p>
                  </div>

                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-plane-arrival me-2"></i>
                          Arrival date
                        </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.arrival_date || 'N/A' }}</p>
                </div>

                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-id me-2"></i>
                          TM Card
                        </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.tm_card || 'N/A' }}</p>
                  </div>

                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-calendar-time me-2"></i>
                          90 Days
                      </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.ninety_days || 'N/A' }}</p>
                      </div>

                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-building-bank me-2"></i>
                          Date to report to immigration
                      </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.immigration_report_date || 'N/A'
                        }}</p>
                    </div>

                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-calendar-off me-2"></i>
                          Visa expiry date
                      </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.visa_expiry_date || 'N/A' }}</p>
                      </div>

                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-file-certificate me-2"></i>
                          Work Permit
                      </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.work_permit || 'N/A' }}</p>
                    </div>

                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="d-inline-flex align-items-center">
                          <i class="ti ti-calendar-x me-2"></i>
                          Work permit expiry date
                      </span>
                        <p class="text-dark mb-0">{{ employee.employee_identification.work_permit_expiry_date || 'N/A'
                        }}</p>
                    </div>
                    </template> -->
                  </div>
                </div>

                <!-- <div class="d-flex align-items-center justify-content-between">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-baby-bottle me-2"></i>
                    Parents
                      </span>
                  <p class="text-dark text-end">
                    {{ employee.father_name ? 'Father: ' + employee.father_name : '' }}
                    {{ employee.mother_name ? ', Mother: ' + employee.mother_name : '' }}
                  </p>
                </div> -->
              </div>
            </div>
          </div>

          <!-- Beneficiary Information -->
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h6>Beneficiary Information</h6>
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="bt btn-sm d-flex align-items-center me-2"
                @click="openAddBeneficiaryModal">
                <i class="ti ti-circle-plus me-1"></i>
                <span>Add</span>
              </a>
            </div>
          </div>
          <div class="card">
            <div class="card-body p-0">
              <div v-if="employee.employee_beneficiaries && employee.employee_beneficiaries.length > 0">
                <div v-for="(beneficiary, index) in employee.employee_beneficiaries" :key="beneficiary.id || index"
                  class="p-3 border-bottom">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="flex-grow-1">
                      <span class="d-inline-flex align-items-center text-muted">
                        <i class="ti ti-user me-1"></i>
                        Beneficiary {{ index + 1 }}
                      </span>
                      <h6 class="d-flex align-items-center fw-medium mt-1 mb-1">
                        {{ beneficiary.beneficiary_name }}
                        <span class="d-inline-flex mx-1"><i class="ti ti-point-filled text-danger"></i></span>
                        {{ beneficiary.beneficiary_relationship }}
                      </h6>
                      <div class="d-flex flex-column text-sm text-muted">
                        <span v-if="beneficiary.phone_number"><i class="ti ti-phone me-1"></i>{{
                          beneficiary.phone_number
                        }}</span>
                        <span v-if="beneficiary.beneficiary_email"><i class="ti ti-mail me-1"></i>{{
                          beneficiary.beneficiary_email
                        }}</span>
                      </div>
                    </div>
                    <div class="dropdown">
                      <a href="javascript:void(0);" class="btn btn-icon btn-sm" data-bs-toggle="dropdown">
                        <i class="ti ti-dots-vertical"></i>
                      </a>
                      <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                          <a href="javascript:void(0);" class="dropdown-item"
                            @click="openEditBeneficiaryModal(beneficiary)">
                            <i class="ti ti-edit me-2"></i>Edit
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" class="dropdown-item text-danger"
                            @click="deleteBeneficiary(beneficiary.id, beneficiary.beneficiary_name)">
                            <i class="ti ti-trash me-2"></i>Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="p-3">
                <div class="text-center py-3">
                  <i class="ti ti-users text-muted mb-2" style="font-size: 2rem;"></i>
                  <p class="text-muted mb-2">No beneficiary information available</p>
                  <a href="javascript:void(0);" class="btn btn-sm btn-outline-primary" @click="openAddBeneficiaryModal">
                    <i class="ti ti-plus me-1"></i>Add First Beneficiary
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- End of Beneficiary Information -->

          <!-- End of Beneficiary Information -->

          <!--Employee Children Information -->
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h6>Employee Children Information</h6>
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="bt btn-sm d-flex align-items-center me-2"
                @click="$refs.employeeDetailsModal.openAddChildModal()">
                <i class="ti ti-circle-plus me-1"></i>
                <span>Add</span>
              </a>
            </div>
          </div>
          <div class="card">
            <div class="card-body p-0">
              <div v-if="employee.employee_children && employee.employee_children.length > 0">
                <div v-for="(child, index) in employee.employee_children" :key="index" class="p-3 border-bottom">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <span class="d-inline-flex align-items-center">Child {{ index + 1 }}</span>
                      <h6 class="d-flex align-items-center fw-medium mt-1">
                        {{ child.name }}
                        <span class="d-inline-flex mx-1"><i class="ti ti-point-filled text-danger"></i></span>
                        <span class="text-muted">{{ calculateAge(child.date_of_birth) }} years old</span>
                      </h6>
                    </div>
                    <div class="d-flex align-items-center">
                      <p class="text-dark me-3">{{ formatDate(child.date_of_birth) }}</p>
                      <div class="dropdown">
                        <a href="javascript:void(0);" class="btn btn-icon btn-sm" data-bs-toggle="dropdown">
                          <i class="ti ti-dots-vertical"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li>
                            <a href="javascript:void(0);" class="dropdown-item"
                              @click="$refs.employeeDetailsModal.openEditChildModal(child)">
                              <i class="ti ti-edit me-2"></i>Edit
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0);" class="dropdown-item text-danger"
                              @click="$refs.employeeDetailsModal.deleteChild(child.id)">
                              <i class="ti ti-trash me-2"></i>Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="p-3">
                <div class="text-center py-3">
                  <i class="ti ti-users text-muted mb-2" style="font-size: 2rem;"></i>
                  <p class="text-muted mb-2">No employee children information available</p>
                  <a href="javascript:void(0);" class="btn btn-sm btn-outline-primary"
                    @click="$refs.employeeDetailsModal.openAddChildModal()">
                    <i class="ti ti-plus me-1"></i>Add First Child
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- End of Employee Children Information -->

          <!-- Leave Balance Information -->
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h6>Leave Balance Information ({{ new Date().getFullYear() }})</h6>
          </div>
          <div class="card">
            <div class="card-body p-0">
              <div v-if="leaveBalances && leaveBalances.length > 0">
                <div v-for="(balance, index) in leaveBalances" :key="balance.id || index" class="p-3"
                  :class="{ 'border-bottom': index < leaveBalances.length - 1 }">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="flex-grow-1">
                      <div class="d-flex align-items-center mb-2">
                        <i class="ti ti-calendar-time me-2 text-primary"></i>
                        <span class="fw-medium text-dark">{{ balance.leave_type?.name || 'Unknown Leave Type' }}</span>
                        <span v-if="balance.leave_type?.requires_attachment" class="badge badge-soft-warning ms-2"
                          title="Requires attachment">
                          <i class="ti ti-paperclip me-1"></i>Attachment Required
                        </span>
                      </div>

                      <div class="d-flex align-items-center mb-2">
                        <span class="badge me-2"
                          :class="getRemainingDaysClass(balance.remaining_days, balance.total_days)">
                          <i class="ti ti-calendar-check me-1"></i>
                          {{ Number(balance.remaining_days || 0).toFixed(1) }} days remaining
                        </span>
                      </div>

                      <div class="row text-sm">
                        <div class="col-4">
                          <span class="text-muted">Total Allocated:</span><br>
                          <span class="fw-medium text-dark">{{ Number(balance.total_days || 0).toFixed(1) }} days</span>
                        </div>
                        <div class="col-4">
                          <span class="text-muted">Days Used:</span><br>
                          <span class="fw-medium text-warning">{{ Number(balance.used_days || 0).toFixed(1) }}
                            days</span>
                        </div>
                        <div class="col-4">
                          <span class="text-muted">Year:</span><br>
                          <span class="fw-medium text-info">{{ balance.year || new Date().getFullYear() }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="ms-3">
                      <!-- Progress bar showing usage -->
                      <div class="d-flex flex-column align-items-end">
                        <small class="text-muted mb-1">Usage</small>
                        <div class="progress" style="width: 120px; height: 10px;">
                          <div class="progress-bar"
                            :class="getUsageProgressClass(balance.used_days, balance.total_days)"
                            :style="`width: ${getUsagePercentage(balance.used_days, balance.total_days)}%`">
                          </div>
                        </div>
                        <small class="text-muted mt-1">{{ getUsagePercentage(balance.used_days, balance.total_days)
                        }}%</small>
                      </div>
                    </div>
                  </div>

                  <!-- Leave type description (if available) -->
                  <div v-if="balance.leave_type?.description" class="mt-2 pt-2 border-top">
                    <small class="text-muted">
                      <i class="ti ti-info-circle me-1"></i>
                      {{ balance.leave_type.description }}
                    </small>
                  </div>
                </div>
              </div>
              <div v-else class="p-3">
                <div class="text-center py-3">
                  <i class="ti ti-calendar-off text-muted mb-2" style="font-size: 2rem;"></i>
                  <p class="text-muted mb-0">No leave balance information available</p>
                  <small class="text-muted">Leave balances will appear here once allocated</small>
                </div>
              </div>
            </div>
          </div>
          <!-- End of Leave Balance Information -->


        </div>

        <div class="col-xl-7">
          <div>
            <div class="card">
              <div class="card-body">
                <div class="contact-grids-tab p-0 mb-3">
                  <ul class="nav nav-underline" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button class="nav-link active" id="info-tab2" data-bs-toggle="tab" data-bs-target="#basic-info2"
                        type="button" role="tab" aria-selected="true">
                        Grants
                      </button>
                    </li>
                    <!-- <li class="nav-item ms-auto" role="presentation">
                      <button class="btn btn-default btn-sm rounded d-flex align-items-center" data-bs-toggle="modal"
                        data-bs-target="#add_grant_position">
                        <i class="ti ti-circle-plus me-1"></i>Add Grant Position
                      </button>
                    </li> -->
                    <!-- Assets tab commented out
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
                              Assets
                            </button>
                          </li>
                          -->
                  </ul>
                </div>

                <!-- Grants Tab -->
                <div class="tab-content" id="myTabContent3">
                  <div class="tab-pane fade show active" id="basic-info2" role="tabpanel" aria-labelledby="info-tab2"
                    tabindex="0">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <p class="mb-0">Funding Allocations Details</p>
                        </div>

                        <div
                          v-if="employee.employee_funding_allocations && employee.employee_funding_allocations.length > 0">

                          <div v-for="(allocation, index) in employee.employee_funding_allocations" :key="index"
                            class="card mb-3">

                            <div class="card mb-3 position-relative"
                              :class="{ 'border-danger': isGrantExpired(allocation.end_date) }">

                              <!-- EXPIRED badge (only shown if the date is expired) -->
                              <div v-if="isGrantExpired(allocation.end_date)"
                                class="position-absolute top-0 start-50 translate-middle badge bg-danger"
                                style="z-index: 1;">
                                EXPIRED
                              </div>

                              <!-- Funding allocation details start -->
                              <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                  <h6 class="mb-0">
                                    <span class="badge me-2"
                                      :class="allocation.allocation_type === 'grant' ? 'badge-primary' : 'badge-secondary'">
                                      {{ allocation.allocation_type === 'grant' ? 'Grant' : 'Org Funded' }}
                                    </span>
                                    Allocation #{{ index + 1 }} ({{ (parseFloat(allocation.level_of_effort) *
                                      100).toFixed(0)
                                    }}% LOE)
                                  </h6>
                                </div>

                                <!-- Common allocation details -->
                                <div class="row">
                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Allocation Type
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.allocation_type || 'N/A' }}
                                    </h6>
                                  </div>

                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Level of Effort
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.level_of_effort ? `${(parseFloat(allocation.level_of_effort) *
                                        100).toFixed(0)}%` : 'N/A' }}
                                    </h6>
                                  </div>

                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Start Date
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ formatDate(allocation.start_date) || 'N/A' }}
                                    </h6>
                                  </div>

                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      End Date
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1"
                                      :class="{ 'text-danger': isGrantExpired(allocation.end_date) }">
                                      {{ formatDate(allocation.end_date) || 'N/A' }}
                                    </h6>
                                  </div>


                                  <!-- <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Allocated Amount
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.allocated_amount ?
                                        `${Number(allocation.allocated_amount).toLocaleString()} ฿` : 'N/A' }}
                                    </h6>
                                  </div> -->
                                </div>

                                <!-- Grant specific details -->
                                <div v-if="allocation.allocation_type === 'grant' && allocation.position_slot"
                                  class="row mt-3">
                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Grant Code
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.position_slot?.grant_item?.grant?.code || 'N/A' }}
                                    </h6>
                                  </div>

                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Grant Name
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.position_slot?.grant_item?.grant?.name || 'N/A' }}
                                    </h6>
                                  </div>

                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Subsidiary
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.position_slot?.grant_item?.grant?.subsidiary || 'N/A' }}
                                    </h6>
                                  </div>

                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Allocated Amount
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.allocated_amount ?
                                        `${Number(allocation.allocated_amount).toLocaleString()} ฿` : 'N/A' }}
                                    </h6>
                                  </div>


                                </div>

                                <!-- Grant position and salary details -->
                                <div v-if="allocation.allocation_type === 'grant' && allocation.position_slot"
                                  class="row mt-3">
                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Grant Position
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.position_slot?.grant_item?.grant_position || 'N/A' }}
                                    </h6>
                                  </div>
                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Grant Salary
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.position_slot?.grant_item?.grant_salary ?
                                        `${Number(allocation.position_slot?.grant_item?.grant_salary).toLocaleString()}
                                      THB` :
                                        'N/A' }}
                                    </h6>
                                  </div>
                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Grant Benefit
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.position_slot?.grant_item?.grant_benefit ?
                                        `${Number(allocation.position_slot?.grant_item?.grant_benefit).toLocaleString()}
                                      THB` :
                                        'N/A' }}
                                    </h6>
                                  </div>
                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Slot Number
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.position_slot?.slot_number || 'N/A' }}
                                    </h6>
                                  </div>
                                </div>

                                <!-- Org funded specific details -->
                                <div v-if="allocation.allocation_type === 'org_funded'" class="row mt-3">
                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Org Funded ID
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.org_funded_id || 'N/A' }}
                                    </h6>
                                  </div>

                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Org Funded Salary
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.org_funded.org_funded_salary ?
                                        `${Number(allocation.org_funded.org_funded_salary).toLocaleString()} THB` :
                                        'N/A' }}
                                    </h6>
                                  </div>

                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Department Position
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.org_funded.department_position.position || 'N/A' }}
                                    </h6>
                                  </div>

                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Subsidiary
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.org_funded.grant.subsidiary || 'N/A' }}
                                    </h6>
                                  </div>
                                </div>
                                <div v-if="allocation.allocation_type === 'org_funded'" class="row mt-3">
                                  <div class="col-md-3">
                                    <span class="d-inline-flex align-items-center">
                                      Allocated Amount
                                    </span>
                                    <h6 class="d-flex align-items-center fw-medium mt-1">
                                      {{ allocation.allocated_amount ?
                                        `${Number(allocation.allocated_amount).toLocaleString()} ฿` : 'N/A' }}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                              <!-- Funding allocation details end -->
                            </div>

                          </div>
                        </div>
                        <div v-else class="card">
                          <div class="card-body text-center py-3">
                            <p>No funding allocations available for this employee</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <!-- <div
                          class="tab-pane fade"
                          id="address2"
                          role="tabpanel"
                          aria-labelledby="address-tab2"
                          tabindex="0"
                        >
                          <div class="row">
                            <div class="col-md-12 d-flex">
                              <div class="card flex-fill">
                                <div class="card-body">
                                  <div class="row align-items-center">
                                    <div class="col-md-8">
                                      <div class="d-flex align-items-center">
                                        <router-link
                                          to="/projects/projects-details"
                                          class="flex-shrink-0 me-2"
                                        >
                                          <img
                                            src="@/assets/img/products/product-05.jpg"
                                            class="img-fluid rounded-circle"
                                            alt="img"
                                          />
                                        </router-link>
                                        <div>
                                          <h6 class="mb-1">
                                            <router-link to="/projects/projects-details"
                                              >Dell Laptop - #343556656</router-link
                                            >
                                          </h6>
                                          <div class="d-flex align-items-center">
                                            <p>
                                              <span class="text-primary"
                                                >AST - 001<i
                                                  class="ti ti-point-filled text-primary mx-1"
                                                ></i></span
                                              >Assigned on 22 Nov, 2022 10:32AM
                                            </p>
                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-3">
                                      <div>
                                        <span class="mb-1 d-block">Assigned by</span>
                                        <a
                                          href="javascript:void(0);"
                                          class="fw-normal d-flex align-items-center"
                                        >
                                          <img
                                            class="avatar avatar-sm rounded-circle me-2"
                                            src="@/assets/img/profiles/avatar-01.jpg"
                                            alt="Img"
                                          />
                                          Andrew Symon
                                        </a>
                                      </div>
                                    </div>
                                    <div class="col-md-1">
                                      <div class="dropdown ms-2">
                                        <a
                                          href="javascript:void(0);"
                                          class="d-inline-flex align-items-center"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i class="ti ti-dots-vertical"></i>
                                        </a>
                                        <ul class="dropdown-menu dropdown-menu-end p-3">
                                          <li>
                                            <a
                                              href="javascript:void(0);"
                                              class="dropdown-item rounded-1"
                                              data-bs-toggle="modal"
                                              data-bs-target="#asset_info"
                                              >View Info</a
                                            >
                                          </li>
                                          <li>
                                            <a
                                              href="javascript:void(0);"
                                              class="dropdown-item rounded-1"
                                              data-bs-toggle="modal"
                                              data-bs-target="#refuse_msg"
                                              >Raise Issue
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-md-12 d-flex">
                              <div class="card flex-fill mb-0">
                                <div class="card-body">
                                  <div class="row align-items-center">
                                    <div class="col-md-8">
                                      <div class="d-flex align-items-center">
                                        <router-link
                                          to="/projects/projects-details"
                                          class="flex-shrink-0 me-2"
                                        >
                                          <img
                                            src="@/assets/img/products/product-06.jpg"
                                            class="img-fluid rounded-circle"
                                            alt="img"
                                          />
                                        </router-link>
                                        <div>
                                          <h6 class="mb-1">
                                            <router-link to="/projects/projects-details"
                                              >Bluetooth Mouse - #478878</router-link
                                            >
                                          </h6>
                                          <div class="d-flex align-items-center">
                                            <p>
                                              <span class="text-primary"
                                                >AST - 001<i
                                                  class="ti ti-point-filled text-primary mx-1"
                                                ></i></span
                                              >Assigned on 22 Nov, 2022 10:32AM
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-3">
                                      <div>
                                        <span class="mb-1 d-block">Assigned by</span>
                                        <a
                                          href="javascript:void(0);"
                                          class="fw-normal d-flex align-items-center"
                                        >
                                          <img
                                            class="avatar avatar-sm rounded-circle me-2"
                                            src="@/assets/img/profiles/avatar-01.jpg"
                                            alt="Img"
                                          />
                                          Andrew Symon
                                        </a>
                                      </div>
                                    </div>
                                    <div class="col-md-1">
                                      <div class="dropdown ms-2">
                                        <a
                                          href="javascript:void(0);"
                                          class="d-inline-flex align-items-center"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i class="ti ti-dots-vertical"></i>
                                        </a>
                                        <ul class="dropdown-menu dropdown-menu-end p-3">
                                          <li>
                                            <a
                                              href="javascript:void(0);"
                                              class="dropdown-item rounded-1"
                                              data-bs-toggle="modal"
                                              data-bs-target="#asset_info"
                                              >View Info</a
                                            >
                                          </li>
                                          <li>
                                            <a
                                              href="javascript:void(0);"
                                              class="dropdown-item rounded-1"
                                              data-bs-toggle="modal"
                                              data-bs-target="#refuse_msg"
                                              >Raise Issue
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> -->

                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="contact-grids-tab p-0 mb-3">
                  <ul class="nav nav-underline" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button class="nav-link active" id="employment-tab" data-bs-toggle="tab"
                        data-bs-target="#employment-info" type="button" role="tab" aria-selected="true">
                        Employment
                      </button>
                    </li>
                  </ul>
                </div>

                <!-- Employment Tab -->
                <div class="tab-content" id="myTabContent3">
                  <div class="tab-pane fade show active" id="employment-info" role="tabpanel"
                    aria-labelledby="employment-tab" tabindex="0">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <p class="mb-0"><i class="ti ti-briefcase me-2"></i>Current Employment Details</p>
                        </div>

                        <div class="card mb-4">
                          <div class="card-body">
                            <!-- Employment Details Header -->
                            <div class="d-flex justify-content-between align-items-center mb-3">
                              <h6 class="mb-0 fw-medium d-flex align-items-center">
                                <i class="ti ti-building-community me-2"></i>
                                <span>Subsidiary:</span>
                                <span :class="[
                                  'badge badge-sm fw-bold ms-2',
                                  employee.subsidiary === 'SMRU' ? 'badge-primary' :
                                    employee.subsidiary === 'BHF' ? 'badge-soft-primary fw-bold' :
                                      employee.subsidiary ? 'badge-secondary' : 'badge-soft-dark'
                                ]">
                                  {{ employee.subsidiary || 'N/A' }}
                                </span>
                              </h6>
                            </div>

                            <!-- Employment Details in 2 columns for better readability -->
                            <div class="row">
                              <!-- Left Column -->
                              <div class="col-md-6">
                                <ul class="list-group list-group-flush">
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-id me-2"></i>Employee ID</span>
                                      <span class="fw-medium">{{ employee.employment?.employee_id || 'N/A' }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-id me-2"></i>Employment Type</span>
                                      <span class="fw-medium">{{ employee.employment?.employment_type || 'N/A' }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-cash-banknote me-2"></i>Pay Method</span>
                                      <span class="fw-medium">{{ employee.employment?.pay_method || 'N/A' }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-calendar-plus me-2"></i>Start Date</span>
                                      <span class="fw-medium">{{ formatDate(employee.employment?.start_date) || 'N/A'
                                      }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-calendar-event me-2"></i>End Date</span>
                                      <span class="fw-medium">{{ formatDate(employee.employment?.end_date) || 'N/A'
                                      }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-calendar-check me-2"></i>Probation Pass
                                        Date</span>
                                      <span class="fw-medium">{{ formatDate(employee.employment?.probation_pass_date) ||
                                        'N/A'
                                      }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-toggle-left me-2"></i>Active
                                        Status</span>
                                      <span>
                                        <span v-if="employee.employment?.active === '1'"
                                          class="badge badge-soft-success">
                                          <i class="ti ti-check me-1"></i>Active
                                        </span>
                                        <span v-else-if="employee.employment?.active === '0'"
                                          class="badge badge-soft-danger">
                                          <i class="ti ti-x me-1"></i>Inactive
                                        </span>
                                        <span v-else class="fw-medium">N/A</span>
                                      </span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-building me-2"></i>Department Position
                                        ID</span>
                                      <span class="fw-medium">{{ employee.employment?.department_position_id || 'N/A'
                                      }}</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>

                              <!-- Right Column -->
                              <div class="col-md-6">
                                <ul class="list-group list-group-flush">
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-location me-2"></i>Work Location</span>
                                      <span class="fw-medium">{{ employee.employment?.work_location?.name || 'N/A'
                                      }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-map-pin me-2"></i>Location Type</span>
                                      <span class="fw-medium">{{ employee.employment?.work_location?.type || 'N/A'
                                      }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-cash-banknote me-2"></i>Position
                                        Salary</span>
                                      <span class="fw-medium">{{ employee.employment?.position_salary ?
                                        `${Number(employee.employment.position_salary).toLocaleString()} THB` : 'N/A'
                                      }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-cash me-2"></i>Probation Salary</span>
                                      <span class="fw-medium">{{ employee.employment?.probation_salary ?
                                        `${Number(employee.employment.probation_salary).toLocaleString()} THB` : 'N/A'
                                      }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-percentage me-2"></i>Employee Tax</span>
                                      <span class="fw-medium">{{ employee.employment?.employee_tax ?
                                        `${employee.employment.employee_tax}%` : 'N/A' }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-user-check me-2"></i>FTE</span>
                                      <span class="fw-medium">{{ employee.employment?.fte || 'N/A' }}</span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i
                                          class="ti ti-heart-handshake me-2"></i>Health-Welfare</span>
                                      <span>
                                        <span v-if="employee.employment?.health_welfare === '1'"
                                          class="badge badge-soft-success">
                                          <i class="ti ti-check me-1"></i>Yes
                                        </span>
                                        <span v-else-if="employee.employment?.health_welfare === '0'"
                                          class="badge badge-soft-danger">
                                          <i class="ti ti-x me-1"></i>No
                                        </span>
                                        <span v-else>N/A</span>
                                      </span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-piggy-bank me-2"></i>PVD</span>
                                      <span>
                                        <span v-if="employee.employment?.pvd === '1'" class="badge badge-soft-success">
                                          <i class="ti ti-check me-1"></i>Yes
                                        </span>
                                        <span v-else-if="employee.employment?.pvd === '0'"
                                          class="badge badge-soft-danger">
                                          <i class="ti ti-x me-1"></i>No
                                        </span>
                                        <span v-else>N/A</span>
                                      </span>
                                    </div>
                                  </li>
                                  <li class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between">
                                      <span class="text-muted"><i class="ti ti-coin me-2"></i>Saving Fund</span>
                                      <span>
                                        <span v-if="employee.employment?.saving_fund === '1'"
                                          class="badge badge-soft-success">
                                          <i class="ti ti-check me-1"></i>Yes
                                        </span>
                                        <span v-else-if="employee.employment?.saving_fund === '0'"
                                          class="badge badge-soft-danger">
                                          <i class="ti ti-x me-1"></i>No
                                        </span>
                                        <span v-else>N/A</span>
                                      </span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <!-- Additional Employment Details -->
                            <div class="row mt-3">
                              <div class="col-md-6">
                                <div class="card border-0 bg-light">
                                  <div class="card-body p-3">
                                    <h6 class="mb-2"><i class="ti ti-user me-2"></i>Created By</h6>
                                    <p class="mb-0">{{ employee.employment?.created_by || 'N/A' }}</p>
                                    <small class="text-muted">{{ formatDate(employee.employment?.created_at) || 'N/A'
                                    }}</small>
                                  </div>
                                </div>
                              </div>
                              <div class="col-md-6">
                                <div class="card border-0 bg-light">
                                  <div class="card-body p-3">
                                    <h6 class="mb-2"><i class="ti ti-user-edit me-2"></i>Updated By</h6>
                                    <p class="mb-0">{{ employee.employment?.updated_by || 'N/A' }}</p>
                                    <small class="text-muted">{{ formatDate(employee.employment?.updated_at) || 'N/A'
                                    }}</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <p class="mb-0"><i class="ti ti-history me-2"></i>Employment History</p>
                        </div>

                        <div v-if="employee.employment_history && employee.employment_history.length > 0">
                          <div v-for="(history, index) in employee.employment_history" :key="index" class="card mb-3">
                            <div class="card-body">
                              <div class="d-flex justify-content-between align-items-center mb-3">
                                <h6 class="mb-0"><i class="ti ti-user-star me-1"></i>Position: {{
                                  history.position?.title || 'N/A' }}</h6>
                                <span class="badge bg-info"><i class="ti ti-calendar me-1"></i>{{
                                  formatDate(history.start_date) }} - {{
                                    formatDate(history.end_date) }}</span>
                              </div>
                              <div class="row">
                                <div class="col-md-4">
                                  <span class="d-inline-flex align-items-center">
                                    <i class="ti ti-building me-1"></i> Department
                                  </span>
                                  <h6 class="d-flex align-items-center fw-medium mt-1">
                                    {{ history.department?.name || 'N/A' }}
                                  </h6>
                                </div>
                                <div class="col-md-4">
                                  <span class="d-inline-flex align-items-center">
                                    <i class="ti ti-id me-1"></i> Employment Type
                                  </span>
                                  <h6 class="d-flex align-items-center fw-medium mt-1">
                                    {{ history.employment_type || 'N/A' }}
                                  </h6>
                                </div>
                                <div class="col-md-4">
                                  <span class="d-inline-flex align-items-center">
                                    <i class="ti ti-exchange me-1"></i> Reason for Change
                                  </span>
                                  <h6 class="d-flex align-items-center fw-medium mt-1">
                                    {{ history.reason_for_change || 'N/A' }}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="card">
                          <div class="card-body text-center py-3">
                            <p><i class="ti ti-info-circle me-1"></i>No employment history available for this employee
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-content custom-accordion-items">
              <div class="tab-pane active show" id="bottom-justified-tab1" role="tabpanel">
                <div class="accordion accordions-items-seperate" id="accordionExample">
                  <!-- Bank Information -->
                  <div class="accordion-item">
                    <div class="accordion-header" id="headingTwo">
                      <div class="accordion-button">
                        <div class="d-flex align-items-center flex-fill">
                          <h5>Bank Information</h5>
                          <a href="javascript:void(0);" class="btn btn-sm btn-icon ms-auto" data-bs-toggle="modal"
                            data-bs-target="#edit_bank"><i class="ti ti-edit"></i></a>
                          <a href="javascript:void(0);" class="d-flex align-items-center collapsed collapse-arrow"
                            data-bs-toggle="collapse" data-bs-target="#primaryBorderTwo" aria-expanded="false"
                            aria-controls="primaryBorderTwo">
                            <i class="ti ti-chevron-down fs-18"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div id="primaryBorderTwo" class="accordion-collapse collapse border-top"
                      aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                      <div class="accordion-body">
                        <div class="row">
                          <div class="col-md-3">
                            <span class="d-inline-flex align-items-center">
                              Bank Name
                            </span>
                            <h6 class="d-flex align-items-center fw-medium mt-1">
                              {{ employee.bank_name || 'N/A' }}
                            </h6>
                          </div>
                          <div class="col-md-3">
                            <span class="d-inline-flex align-items-center">
                              Bank account no
                            </span>
                            <h6 class="d-flex align-items-center fw-medium mt-1">
                              {{ employee.bank_account_number || 'N/A' }}
                            </h6>
                          </div>
                          <div class="col-md-3">
                            <span class="d-inline-flex align-items-center">
                              Account Name
                            </span>
                            <h6 class="d-flex align-items-center fw-medium mt-1">
                              {{ employee.bank_account_name || 'N/A' }}
                            </h6>
                          </div>
                          <div class="col-md-3">
                            <span class="d-inline-flex align-items-center"> Branch </span>
                            <h6 class="d-flex align-items-center fw-medium mt-1">
                              {{ employee.bank_branch || 'N/A' }}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Family Information -->
                  <div class="accordion-item">
                    <div class="accordion-header" id="headingThree">
                      <div class="accordion-button">
                        <div class="d-flex align-items-center justify-content-between flex-fill">
                          <h5>Family Information</h5>
                          <div class="d-flex">
                            <a href="javascript:void(0);" class="btn btn-icon btn-sm" data-bs-toggle="modal"
                              data-bs-target="#edit_familyinformation"><i class="ti ti-edit"></i></a>
                            <a href="javascript:void(0);" class="d-flex align-items-center collapsed collapse-arrow"
                              data-bs-toggle="collapse" data-bs-target="#primaryBorderThree" aria-expanded="false"
                              aria-controls="primaryBorderThree">
                              <i class="ti ti-chevron-down fs-18"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="primaryBorderThree" class="accordion-collapse collapse border-top"
                      aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                      <div class="accordion-body">
                        <div class="row">
                          <div class="col-md-3">
                            <span class="d-inline-flex align-items-center"> Father </span>
                            <h6 class="d-flex align-items-center fw-medium mt-1">
                              {{ employee.father_name || 'N/A' }}
                            </h6>
                          </div>
                          <div class="col-md-3">
                            <span class="d-inline-flex align-items-center">
                              Father Occupation
                            </span>
                            <h6 class="d-flex align-items-center fw-medium mt-1">
                              {{ employee.father_occupation || 'N/A' }}
                            </h6>
                          </div>
                          <div class="col-md-3">
                            <span class="d-inline-flex align-items-center">
                              Mother
                            </span>
                            <h6 class="d-flex align-items-center fw-medium mt-1">
                              {{ employee.mother_name || 'N/A' }}
                            </h6>
                          </div>
                          <div class="col-md-3">
                            <span class="d-inline-flex align-items-center">
                              Mother Occupation
                            </span>
                            <h6 class="d-flex align-items-center fw-medium mt-1">
                              {{ employee.mother_occupation || 'N/A' }}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Education Details -->
                  <div class="row">
                    <div class="col-md-12">
                      <div class="accordion-item">
                        <div class="row">
                          <div class="accordion-header" id="headingFour">
                            <div class="accordion-button">
                              <div class="d-flex align-items-center justify-content-between flex-fill">
                                <h5>Background Education</h5>
                                <div class="d-flex">
                                  <a href="javascript:void(0);" class="btn btn-icon btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#edit_education"><i class="ti ti-edit"></i></a>
                                  <a href="javascript:void(0);"
                                    class="d-flex align-items-center collapsed collapse-arrow" data-bs-toggle="collapse"
                                    data-bs-target="#primaryBorderFour" aria-expanded="false"
                                    aria-controls="primaryBorderFour">
                                    <i class="ti ti-chevron-down fs-18"></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div id="primaryBorderFour" class="accordion-collapse collapse border-top"
                            aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                              <div>
                                <div class="mb-3">
                                  <div class="d-flex align-items-center justify-content-between">
                                    <div>
                                      <span class="d-inline-flex align-items-center fw-normal">
                                        Oxford University
                                      </span>
                                      <h6 class="d-flex align-items-center mt-1">
                                        Computer Science
                                      </h6>
                                    </div>
                                    <p class="text-dark">2020 - 2022</p>
                                  </div>
                                </div>
                                <div class="mb-3">
                                  <div class="d-flex align-items-center justify-content-between">
                                    <div>
                                      <span class="d-inline-flex align-items-center fw-normal">
                                        Cambridge University
                                      </span>
                                      <h6 class="d-flex align-items-center mt-1">
                                        Computer Network & Systems
                                      </h6>
                                    </div>
                                    <p class="text-dark">2016- 2019</p>
                                  </div>
                                </div>
                                <div>
                                  <div class="d-flex align-items-center justify-content-between">
                                    <div>
                                      <span class="d-inline-flex align-items-center fw-normal">
                                        Oxford School
                                      </span>
                                      <h6 class="d-flex align-items-center mt-1">
                                        Grade X
                                      </h6>
                                    </div>
                                    <p class="text-dark">2012 - 2016</p>
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
              </div>
            </div>
          </div>
        </div>
        <!-- /Grants Tab -->
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>
  <!-- /Page Wrapper -->
  <employee-details-modal ref="employeeDetailsModal" :employee="employee" @employee-updated="fetchEmployeeDetails"
    @grantPositionAdded="fetchEmployeeDetails" />
</template>
<script>
import { useEmployeeStore } from '@/stores/employeeStore';
import { employmentService } from '@/services/employment.service';
import { Modal } from 'bootstrap';
import employeeChildrenService from "@/services/employee-children.service";
import employeeBeneficiaryService from "@/services/employeeBeneficiary.service";


export default {
  name: 'EmployeeDetails',
  data() {
    return {
      employee: null,
      loading: true,
      leaveBalances: [],

      showEditModal: false,
      selectedEmployee: null,
      childForm: {
        id: null,
        employee_id: '',
        name: '',
        date_of_birth: '',
      },
      editingChild: null,
      isEditingChild: false,

      // Beneficiary form data
      beneficiaryForm: {
        id: null,
        employee_id: '',
        beneficiary_name: '',
        beneficiary_relationship: '',
        phone_number: '',
      },
      editingBeneficiary: null,
      isEditingBeneficiary: false,
      isSubmitting: false,
    };
  },
  created() {
    this.fetchEmployeeDetails();
  },
  methods: {

    // open personal information edit modal
    openPersonalEditModal() {
      this.$refs.employeeDetailsModal.personalFormData = this.getPersonalFormData(this.employee);

      const modalEL = document.getElementById('edit_personal');
      const bsModal = Modal.getOrCreateInstance(modalEL);
      bsModal.show();
    },

    // open basic information edit modal
    openEditModal() {
      this.$refs.employeeDetailsModal.editFormData = this.getBasicFormData(this.employee);

      // If you need to adjust date_of_birth for the date picker, do it here:
      if (this.$refs.employeeDetailsModal.editFormData.date_of_birth) {
        this.$refs.employeeDetailsModal.editFormData.date_of_birth =
          new Date(this.$refs.employeeDetailsModal.editFormData.date_of_birth);
      }

      const modalEL = document.getElementById('edit_employee');
      const bsModal = Modal.getOrCreateInstance(modalEL);
      bsModal.show();
    },


    getBasicFormData(employee) {
      return {
        id: employee.id,
        first_name_en: employee.first_name_en,
        last_name_en: employee.last_name_en,
        first_name_th: employee.first_name_th,
        last_name_th: employee.last_name_th,
        initial_en: employee.initial_en,
        initial_th: employee.initial_th,
        staff_id: employee.staff_id,
        joining_date: employee.joining_date,
        age: employee.age,
        status: employee.status,
        mobile_phone: employee.mobile_phone,
        current_address: employee.current_address,
        permanent_address: employee.permanent_address,
        subsidiary: employee.subsidiary,
        gender: employee.gender,
        nationality: employee.nationality,
        religion: employee.religion,
        marital_status: employee.marital_status,
        employee_status: employee.employee_status,
        date_of_birth: employee.date_of_birth,
      };
    },

    getPersonalFormData(employee) {
      return {
        id: employee.id,
        staff_id: employee.staff_id,
        mobile_phone: employee.mobile_phone,
        nationality: employee.nationality,
        social_security_number: employee.social_security_number,
        tax_number: employee.tax_number,
        religion: employee.religion,
        marital_status: employee.marital_status,
        languages: employee.employee_languages ? employee.employee_languages.map(lang => lang.language) : [],
        current_address: employee.current_address,
        permanent_address: employee.permanent_address,
        employee_identification: employee.employee_identification
          ? {
            id_type: employee.employee_identification.id_type,
            document_number: employee.employee_identification.document_number,
          }
          : { id_type: '', document_number: '' },
      };
    },


    handleEmployeeUpdated() {
      this.fetchEmployeeDetails();
      this.closeEditModal();
    },

    closeEditModal() {
      this.showEditModal = false;
    },

    isGrantExpired(endDate) {
      if (!endDate) return false;
      // Convert endDate to a Date object & compare with now
      const today = new Date();
      return new Date(endDate) < today;
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    calculateExperience(joiningDate) {
      // Assuming joiningDate is in a valid date format
      const start = new Date(joiningDate);
      const now = new Date();
      const diffYears = now.getFullYear() - start.getFullYear();
      return diffYears;
    },

    formatDate(date) {
      if (!date) return '';
      const userLocale = navigator.language || 'en-GB';
      // force DMY for any US‐style locale
      const localeToUse = userLocale === 'en-US' ? 'en-GB' : userLocale;
      return new Intl.DateTimeFormat(localeToUse, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date(date));
    },

    formatThaiDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('th-TH', options);
    },

    calculateAge(dateOfBirth) {
      if (!dateOfBirth) return 0;
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    },

    async fetchEmployeeDetails() {
      const employeeStore = useEmployeeStore();
      // Grab the employee ID from the route parameters
      const id = this.$route.params.id;
      try {
        // Call the store action to get employee details
        this.employee = await employeeStore.getEmployeeDetails(id);
        console.log("this.employee", this.employee);

        // Extract leave balances from employee data (if available)
        this.loadLeaveBalancesFromEmployee();

        // Show success message using ant-design message
        this.$message.success('Employee details loaded successfully');
      } catch (error) {
        console.error("Error fetching employee details:", error);
        // Show error message using ant-design message
        this.$message.error('Failed to load employee details: ' + (error.message || 'Unknown error'));
      } finally {
        this.loading = false;
      }
    },

    async deleteGrantAllocation(grantAllocationId) {
      try {
        const response = await employmentService.deleteGrantAllocation(grantAllocationId);
        if (response.success === true) {
          this.fetchEmployeeDetails();
          this.$message.success(response.message || 'Grant allocation deleted successfully');
        } else {
          this.$message.error('Failed to delete grant allocation: ' + (response.message || 'Unknown error'));
        }
      } catch (error) {
        console.error("Error deleting grant allocation:", error);
        this.$message.error('Failed to delete grant allocation: ' + (error.message || 'Unknown error'));
      }
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

        if (response && response.success) {
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
    deleteChild(childId) {
      this.$confirm({
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this child record? This action cannot be undone.',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
        onOk: async () => {
          try {
            const response = await employeeChildrenService.deleteEmployeeChild(childId);

            if (response && response.success) {
              this.$message.success(response.message || 'Child deleted successfully');

              // Reload employee details to get updated children
              await this.fetchEmployeeDetails();
            } else {
              this.$message.error(response?.message || 'Failed to delete child');
            }
          } catch (error) {
            console.error('Error deleting child:', error);
            this.$message.error('Error deleting child: ' + (error.message || 'Unknown error'));
          }
        }
      });
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

    // ===== BENEFICIARY CRUD METHODS =====

    // Create or Update Beneficiary
    async submitBeneficiaryForm() {
      try {
        this.isSubmitting = true;

        // Validate using service validation
        const validation = employeeBeneficiaryService.validateBeneficiaryData({
          employee_id: this.employee.id,
          beneficiary_name: this.beneficiaryForm.beneficiary_name,
          beneficiary_relationship: this.beneficiaryForm.beneficiary_relationship,
          phone_number: this.beneficiaryForm.phone_number,
        });

        if (!validation.isValid) {
          this.$message.error(validation.errors[0]);
          return;
        }

        // Prepare payload
        const payload = {
          employee_id: this.employee.id,
          beneficiary_name: this.beneficiaryForm.beneficiary_name,
          beneficiary_relationship: this.beneficiaryForm.beneficiary_relationship,
          phone_number: this.beneficiaryForm.phone_number,
          created_by: this.$store?.state?.auth?.user?.username || 'system',
          updated_by: this.$store?.state?.auth?.user?.username || 'system'
        };

        let response;
        if (this.isEditingBeneficiary && this.beneficiaryForm.id) {
          // Update existing beneficiary
          response = await employeeBeneficiaryService.updateBeneficiary(this.beneficiaryForm.id, payload);
        } else {
          // Create new beneficiary
          response = await employeeBeneficiaryService.createBeneficiary(payload);
        }

        if (response && response.status === 'success') {
          this.$message.success(response.message || `Beneficiary ${this.isEditingBeneficiary ? 'updated' : 'added'} successfully`);

          // Reload employee details to get updated beneficiaries
          await this.fetchEmployeeDetails();

          // Reset form and close modal
          this.resetBeneficiaryForm();
          this.closeBeneficiaryModal();
        } else {
          this.$message.error(response?.message || `Failed to ${this.isEditingBeneficiary ? 'update' : 'add'} beneficiary`);
        }
      } catch (error) {
        console.error('Error submitting beneficiary form:', error);

        // Handle validation errors from backend
        if (error.response && error.response.status === 422 && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          this.$message.error(errorMessages[0] || 'Validation error occurred');
        } else if (error.response && error.response.data && error.response.data.message) {
          this.$message.error(error.response.data.message);
        } else {
          this.$message.error(`Error ${this.isEditingBeneficiary ? 'updating' : 'adding'} beneficiary: ` + (error.message || 'Unknown error'));
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    // Open Add Beneficiary Modal
    openAddBeneficiaryModal() {
      this.resetBeneficiaryForm();
      this.isEditingBeneficiary = false;
      const modalEl = document.getElementById('add_beneficiary');
      const modal = Modal.getOrCreateInstance(modalEl);
      modal.show();
    },

    // Open Edit Beneficiary Modal
    openEditBeneficiaryModal(beneficiary) {
      this.isEditingBeneficiary = true;
      this.editingBeneficiary = beneficiary;

      // Populate form with beneficiary data
      this.beneficiaryForm = {
        id: beneficiary.id,
        employee_id: beneficiary.employee_id,
        beneficiary_name: beneficiary.beneficiary_name || '',
        beneficiary_relationship: beneficiary.beneficiary_relationship || '',
        phone_number: beneficiary.phone_number || '',
      };

      const modalEl = document.getElementById('add_beneficiary');
      const modal = Modal.getOrCreateInstance(modalEl);
      modal.show();
    },

    // Delete Beneficiary
    deleteBeneficiary(beneficiaryId, beneficiaryName = '') {
      this.$confirm({
        title: 'Confirm Delete',
        content: `Are you sure you want to delete beneficiary "${beneficiaryName}"? This action cannot be undone.`,
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
        onOk: async () => {
          try {
            const response = await employeeBeneficiaryService.deleteBeneficiary(beneficiaryId);

            if (response && response.status === 'success') {
              this.$message.success(response.message || 'Beneficiary deleted successfully');

              // Reload employee details to get updated beneficiaries
              await this.fetchEmployeeDetails();
            } else {
              this.$message.error(response?.message || 'Failed to delete beneficiary');
            }
          } catch (error) {
            console.error('Error deleting beneficiary:', error);

            // Handle specific error responses
            if (error.response && error.response.status === 404) {
              this.$message.error('Beneficiary not found or already deleted');
            } else if (error.response && error.response.data && error.response.data.message) {
              this.$message.error(error.response.data.message);
            } else {
              this.$message.error('Error deleting beneficiary: ' + (error.message || 'Unknown error'));
            }
          }
        }
      });
    },

    // Reset Beneficiary Form
    resetBeneficiaryForm() {
      this.beneficiaryForm = {
        id: null,
        employee_id: '',
        beneficiary_name: '',
        beneficiary_relationship: '',
        phone_number: '',
      };
      this.editingBeneficiary = null;
      this.isEditingBeneficiary = false;
    },

    // Close Beneficiary Modal
    closeBeneficiaryModal() {
      const modalEl = document.getElementById('add_beneficiary');
      const modal = Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    },

    // ===== END BENEFICIARY CRUD METHODS =====

    // ===== LEAVE BALANCE METHODS =====

    // Load leave balances from employee data (already included in employee API response)
    loadLeaveBalancesFromEmployee() {
      try {
        if (this.employee && this.employee.leave_balances && Array.isArray(this.employee.leave_balances)) {
          // Filter out leave types with 0 total days to show only relevant leave balances
          this.leaveBalances = this.employee.leave_balances.filter(balance =>
            parseFloat(balance.total_days || 0) > 0
          );
          console.log("Leave balances loaded from employee data:", this.leaveBalances);
        } else {
          this.leaveBalances = [];
          console.warn("No leave balance data found in employee response");
        }
      } catch (error) {
        console.error("Error processing leave balances from employee data:", error);
        this.leaveBalances = [];
      }
    },

    // Calculate usage percentage for progress bar
    getUsagePercentage(usedDays, totalDays) {
      if (!totalDays || totalDays === 0) return 0;
      const percentage = (Number(usedDays || 0) / Number(totalDays)) * 100;
      return Math.min(Math.round(percentage), 100); // Cap at 100%
    },

    // Get progress bar class based on usage percentage
    getUsageProgressClass(usedDays, totalDays) {
      const percentage = this.getUsagePercentage(usedDays, totalDays);

      if (percentage >= 90) return 'bg-danger';
      if (percentage >= 75) return 'bg-warning';
      if (percentage >= 50) return 'bg-info';
      return 'bg-success';
    },

    // Get badge class for remaining days display
    getRemainingDaysClass(remainingDays, totalDays) {
      const remaining = Number(remainingDays || 0);
      const total = Number(totalDays || 0);

      if (total === 0) return 'badge-soft-secondary';

      const percentage = (remaining / total) * 100;

      if (percentage <= 10) return 'badge-soft-danger';
      if (percentage <= 25) return 'badge-soft-warning';
      if (percentage <= 50) return 'badge-soft-info';
      return 'badge-soft-success';
    },

    // ===== END LEAVE BALANCE METHODS =====
  },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
</style>
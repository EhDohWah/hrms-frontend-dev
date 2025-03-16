<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div
        class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3"
      >
        <div class="my-auto mb-2">
          <h6 class="fw-medium d-inline-flex align-items-center mb-3 mb-sm-0">
            <router-link to="/employee/employee-list">
              <i class="ti ti-arrow-left me-2"></i>Employee Details</router-link
            >
          </h6>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="mb-2">
            <a
              href="javascript:void(0);"
              data-bs-toggle="modal"
              data-bs-target="#add_bank_satutory"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Bank & Statutory</a
            >
          </div>
          <div class="head-icons ms-2">
            <a
              href="javascript:void(0);"
              class=""
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-original-title="Collapse"
              id="collapse-header"
              @click="toggleHeader"
            >
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
        <div class="col-xl-4 theiaStickySidebar">
          <div class="card card-bg-1">
            <div class="card-body p-0">
              <span
                class="avatar avatar-xl avatar-rounded border border-2 border-white m-auto d-flex mb-2"
              >
                <img
                  :src="employee.profile_picture || require('@/assets/img/users/user-13.jpg')"
                  class="w-auto h-auto"
                  alt="Employee Image"
                />
              </span>
              <div class="text-center px-3 pb-3 border-bottom">
                <div class="mb-3">
                  <h5 class="d-flex align-items-center justify-content-center mb-1">
                    {{ employee.first_name }} {{ employee.last_name }}<i
                      class="ti ti-discount-check-filled text-success ms-1"
                    ></i>
                  </h5>
                  <span class="badge badge-soft-dark fw-medium me-2">
                    <i class="ti ti-point-filled me-1"></i>{{ employee.employment?.position?.title || 'Position N/A' }}
                  </span>
                  <span class="badge badge-soft-secondary fw-medium"
                    >{{ calculateExperience(employee.employment?.start_date) }}</span
                  >
                </div>
                <div>
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-id me-2"></i>
                      Staff ID
                    </span>
                    <p class="text-dark">{{ employee.staff_id || 'N/A' }}</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-star me-2"></i>
                      Department
                    </span>
                    <p class="text-dark">{{ employee.employment?.department?.name || 'N/A' }}</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-calendar-check me-2"></i>
                      Date Of Join
                    </span>
                    <p class="text-dark">{{ formatDate(employee.employment?.start_date) }}</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <span class="d-inline-flex align-items-center">
                      <i class="ti ti-calendar-check me-2"></i>
                      Report To
                    </span>
                    <div class="d-flex align-items-center">
                      <span class="avatar avatar-sm avatar-rounded me-2">
                        <img src="@/assets/img/profiles/avatar-12.jpg" alt="Img" />
                      </span>
                      <p class="text-gray-9 mb-0">{{ employee.employment?.supervisor?.first_name || 'N/A' }}</p>
                    </div>
                  </div>
                  <div class="row gx-2 mt-3">
                    <div class="col-12">
                      <div>
                        <a
                          href="javascript:void(0);"
                          class="btn btn-dark w-100"
                          data-bs-toggle="modal"
                          data-bs-target="#edit_employee"
                          ><i class="ti ti-edit me-1"></i>Edit Info</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-3 border-bottom">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <h6>Basic information</h6>
                  <a
                    href="javascript:void(0);"
                    class="btn btn-icon btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_employee"
                    ><i class="ti ti-edit"></i
                  ></a>
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
                    <i class="ti ti-mail-check me-2"></i>
                    Email
                  </span>
                  <a
                    href="javascript:void(0);"
                    class="text-info d-inline-flex align-items-center"
                    >{{ employee.email || 'N/A' }}<i class="ti ti-copy text-dark ms-2"></i
                  ></a>
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
                <div class="d-flex align-items-center justify-content-between">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-map-pin-check me-2"></i>
                    Address
                  </span>
                  <p class="text-dark text-end">
                    {{ employee.current_address || employee.permanent_address || 'N/A' }}
                  </p>
                </div>
              </div>
              <div class="p-3 border-bottom">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <h6>Personal Information</h6>
                  <a
                    href="javascript:void(0);"
                    class="btn btn-icon btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#edit_personal"
                    ><i class="ti ti-edit"></i
                  ></a>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-e-passport me-2"></i>
                    Passport No
                  </span>
                  <p class="text-dark">{{ employee.passport_number || 'N/A' }}</p>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-calendar-x me-2"></i>
                    Tax Number
                  </span>
                  <p class="text-dark text-end">{{ employee.tax_number || 'N/A' }}</p>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-gender-male me-2"></i>
                    Nationality
                  </span>
                  <p class="text-dark text-end">{{ employee.nationality || 'N/A' }}</p>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-bookmark-plus me-2"></i>
                    Religion
                  </span>
                  <p class="text-dark text-end">{{ employee.religion || 'N/A' }}</p>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-hotel-service me-2"></i>
                    Marital status
                  </span>
                  <p class="text-dark text-end">{{ employee.marital_status || 'N/A' }}</p>
                </div>
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-briefcase-2 me-2"></i>
                    Employment of spouse
                  </span>
                  <p class="text-dark text-end">{{ employee.spouse_occupation ? 'Yes' : 'No' }}</p>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                  <span class="d-inline-flex align-items-center">
                    <i class="ti ti-baby-bottle me-2"></i>
                    Parents
                  </span>
                  <p class="text-dark text-end">
                    {{ employee.father_name ? 'Father: ' + employee.father_name : '' }}
                    {{ employee.mother_name ? ', Mother: ' + employee.mother_name : '' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h6>Emergency Contact Number</h6>
            <a
              href="javascript:void(0);"
              class="btn btn-icon btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#edit_emergency"
              ><i class="ti ti-edit"></i
            ></a>
          </div>
          <div class="card">
            <div class="card-body p-0">
              <div v-if="employee.employee_beneficiaries && employee.employee_beneficiaries.length > 0">
                <div v-for="(beneficiary, index) in employee.employee_beneficiaries" :key="index" class="p-3 border-bottom">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <span class="d-inline-flex align-items-center">{{ index === 0 ? 'Primary' : 'Secondary' }}</span>
                      <h6 class="d-flex align-items-center fw-medium mt-1">
                        {{ beneficiary.name }}
                        <span class="d-inline-flex mx-1"><i class="ti ti-point-filled text-danger"></i></span>
                        {{ beneficiary.relationship }}
                      </h6>
                    </div>
                    <p class="text-dark">{{ beneficiary.phone }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="p-3">
                <p class="text-center">No emergency contacts available</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-8">
          <div>
            <div class="tab-content custom-accordion-items">
              <div
                class="tab-pane active show"
                id="bottom-justified-tab1"
                role="tabpanel"
              >
                <div class="accordion accordions-items-seperate" id="accordionExample">
                  <div class="accordion-item">
                    <div class="accordion-header" id="headingOne">
                      <div class="accordion-button">
                        <div class="d-flex align-items-center flex-fill">
                          <h5>About Employee</h5>
                          <a
                            href="javascript:void(0);"
                            class="btn btn-sm btn-icon ms-auto"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_employee"
                            ><i class="ti ti-edit"></i
                          ></a>
                          <a
                            href="javascript:void(0);"
                            class="d-flex align-items-center collapsed collapse-arrow"
                            data-bs-toggle="collapse"
                            data-bs-target="#primaryBorderOne"
                            aria-expanded="false"
                            aria-controls="primaryBorderOne"
                          >
                            <i class="ti ti-chevron-down fs-18"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      id="primaryBorderOne"
                      class="accordion-collapse collapse show border-top"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body mt-2">
                        {{ employee.remark || 'No additional information available about this employee.' }}
                      </div>
                    </div>
                  </div>

                  <div class="accordion-item">
                    <div class="accordion-header" id="headingTwo">
                      <div class="accordion-button">
                        <div class="d-flex align-items-center flex-fill">
                          <h5>Bank Information</h5>
                          <a
                            href="javascript:void(0);"
                            class="btn btn-sm btn-icon ms-auto"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_bank"
                            ><i class="ti ti-edit"></i
                          ></a>
                          <a
                            href="javascript:void(0);"
                            class="d-flex align-items-center collapsed collapse-arrow"
                            data-bs-toggle="collapse"
                            data-bs-target="#primaryBorderTwo"
                            aria-expanded="false"
                            aria-controls="primaryBorderTwo"
                          >
                            <i class="ti ti-chevron-down fs-18"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      id="primaryBorderTwo"
                      class="accordion-collapse collapse border-top"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExample"
                    >
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

                  <div class="accordion-item">
                    <div class="accordion-header" id="headingThree">
                      <div class="accordion-button">
                        <div
                          class="d-flex align-items-center justify-content-between flex-fill"
                        >
                          <h5>Family Information</h5>
                          <div class="d-flex">
                            <a
                              href="javascript:void(0);"
                              class="btn btn-icon btn-sm"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_familyinformation"
                              ><i class="ti ti-edit"></i
                            ></a>
                            <a
                              href="javascript:void(0);"
                              class="d-flex align-items-center collapsed collapse-arrow"
                              data-bs-toggle="collapse"
                              data-bs-target="#primaryBorderThree"
                              aria-expanded="false"
                              aria-controls="primaryBorderThree"
                            >
                              <i class="ti ti-chevron-down fs-18"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      id="primaryBorderThree"
                      class="accordion-collapse collapse border-top"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExample"
                    >
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
                  <div class="row">
                    <div class="col-md-6">
                      <div class="accordion-item">
                        <div class="row">
                          <div class="accordion-header" id="headingFour">
                            <div class="accordion-button">
                              <div
                                class="d-flex align-items-center justify-content-between flex-fill"
                              >
                                <h5>Education Details</h5>
                                <div class="d-flex">
                                  <a
                                    href="javascript:void(0);"
                                    class="btn btn-icon btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_education"
                                    ><i class="ti ti-edit"></i
                                  ></a>
                                  <a
                                    href="javascript:void(0);"
                                    class="d-flex align-items-center collapsed collapse-arrow"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#primaryBorderFour"
                                    aria-expanded="false"
                                    aria-controls="primaryBorderFour"
                                  >
                                    <i class="ti ti-chevron-down fs-18"></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            id="primaryBorderFour"
                            class="accordion-collapse collapse border-top"
                            aria-labelledby="headingFour"
                            data-bs-parent="#accordionExample"
                          >
                            <div class="accordion-body">
                              <div>
                                <div class="mb-3">
                                  <div
                                    class="d-flex align-items-center justify-content-between"
                                  >
                                    <div>
                                      <span
                                        class="d-inline-flex align-items-center fw-normal"
                                      >
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
                                  <div
                                    class="d-flex align-items-center justify-content-between"
                                  >
                                    <div>
                                      <span
                                        class="d-inline-flex align-items-center fw-normal"
                                      >
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
                                  <div
                                    class="d-flex align-items-center justify-content-between"
                                  >
                                    <div>
                                      <span
                                        class="d-inline-flex align-items-center fw-normal"
                                      >
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
                    <div class="col-md-6">
                      <div class="accordion-item">
                        <div class="row">
                          <div class="accordion-header" id="headingFive">
                            <div class="accordion-button collapsed">
                              <div
                                class="d-flex align-items-center justify-content-between flex-fill"
                              >
                                <h5>Experience</h5>
                                <div class="d-flex">
                                  <a
                                    href="javascript:void(0);"
                                    class="btn btn-icon btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_experience"
                                    ><i class="ti ti-edit"></i
                                  ></a>
                                  <a
                                    href="javascript:void(0);"
                                    class="d-flex align-items-center collapsed collapse-arrow"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#primaryBorderFive"
                                    aria-expanded="false"
                                    aria-controls="primaryBorderFive"
                                  >
                                    <i class="ti ti-chevron-down fs-18"></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            id="primaryBorderFive"
                            class="accordion-collapse collapse border-top"
                            aria-labelledby="headingFive"
                            data-bs-parent="#accordionExample"
                          >
                            <div class="accordion-body">
                              <div>
                                <div class="mb-3">
                                  <div
                                    class="d-flex align-items-center justify-content-between"
                                  >
                                    <div>
                                      <h6
                                        class="d-inline-flex align-items-center fw-medium"
                                      >
                                        Google
                                      </h6>
                                      <span
                                        class="d-flex align-items-center badge bg-secondary-transparent mt-1"
                                        ><i class="ti ti-point-filled me-1"></i>UI/UX
                                        Developer</span
                                      >
                                    </div>
                                    <p class="text-dark">Jan 2013 - Present</p>
                                  </div>
                                </div>
                                <div class="mb-3">
                                  <div
                                    class="d-flex align-items-center justify-content-between"
                                  >
                                    <div>
                                      <h6
                                        class="d-inline-flex align-items-center fw-medium"
                                      >
                                        Salesforce
                                      </h6>
                                      <span
                                        class="d-flex align-items-center badge bg-secondary-transparent mt-1"
                                        ><i class="ti ti-point-filled me-1"></i>Web
                                        Developer</span
                                      >
                                    </div>
                                    <p class="text-dark">Dec 2012- Jan 2015</p>
                                  </div>
                                </div>
                                <div>
                                  <div
                                    class="d-flex align-items-center justify-content-between"
                                  >
                                    <div>
                                      <h6
                                        class="d-inline-flex align-items-center fw-medium"
                                      >
                                        HubSpot
                                      </h6>
                                      <span
                                        class="d-flex align-items-center badge bg-secondary-transparent mt-1"
                                        ><i class="ti ti-point-filled me-1"></i>Software
                                        Developer</span
                                      >
                                    </div>
                                    <p class="text-dark">Dec 2011- Jan 2012</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="card">
                    <div class="card-body">
                      <div class="contact-grids-tab p-0 mb-3">
                        <ul class="nav nav-underline" id="myTab" role="tablist">
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
                              Grants
                            </button>
                          </li>
                          <li class="nav-item ms-auto" role="presentation">
                            <button
                              class="btn btn-default btn-sm rounded d-flex align-items-center"
                              data-bs-toggle="modal"
                              data-bs-target="#add_grant_position"  
                            >
                              <i class="ti ti-circle-plus me-1"></i>Add Grant Position
                            </button>
                          </li>
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
                      <div class="tab-content" id="myTabContent3">
                        <div
                          class="tab-pane fade show active"
                          id="basic-info2"
                          role="tabpanel"
                          aria-labelledby="info-tab2"
                          tabindex="0"
                        >
                          <div class="row">
                            <div class="col-md-12">
                              <div class="card">
                                <div class="card-body">
                                  <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="card-title mb-0">Grant Details</h5>
                                    <button 
                                      v-if="employee.employment?.grant_item"
                                      class="btn btn-danger btn-sm rounded d-inline-flex align-items-center"
                                      @click="deleteGrantPosition"
                                    >
                                      <i class="ti ti-trash me-1"></i>Delete Grant Position
                                    </button>
                                  </div>
                                  <div class="row">
                                    <div class="col-md-4">
                                      <span class="d-inline-flex align-items-center">
                                        Grant Code
                                      </span>
                                      <h6 class="d-flex align-items-center fw-medium mt-1">
                                        {{ employee.employment?.grant_item?.grant?.code || 'N/A' }}
                                      </h6>
                                    </div>
                                    <div class="col-md-4">
                                      <span class="d-inline-flex align-items-center">
                                        Grant Name
                                      </span>
                                      <h6 class="d-flex align-items-center fw-medium mt-1">
                                        {{ employee.employment?.grant_item?.grant?.name || 'N/A' }}
                                      </h6>
                                    </div>
                                    <div class="col-md-4">
                                      <span class="d-inline-flex align-items-center">
                                        Grant End Date
                                      </span>
                                      <h6 class="d-flex align-items-center fw-medium mt-1">
                                        {{ employee.employment?.grant_item?.grant?.end_date || 'N/A' }}
                                      </h6>
                                    </div>
                                  </div>
                                  <div class="row mt-3">
                                    <div class="col-md-4">
                                      <span class="d-inline-flex align-items-center">
                                        Grant Position
                                      </span>
                                      <h6 class="d-flex align-items-center fw-medium mt-1">
                                        {{ employee.employment?.grant_item?.grant_position || 'N/A' }}
                                      </h6>
                                    </div>
                                    <div class="col-md-4">
                                      <span class="d-inline-flex align-items-center">
                                        BG Line
                                      </span>
                                      <h6 class="d-flex align-items-center fw-medium mt-1">
                                        {{ employee.employment?.grant_item?.bg_line || 'N/A' }}
                                      </h6>
                                    </div>
                                    <div class="col-md-4">
                                      <span class="d-inline-flex align-items-center">
                                        Grant Salary
                                      </span>
                                      <h6 class="d-flex align-items-center fw-medium mt-1">
                                        {{ employee.employment?.grant_item?.grant_salary || 'N/A' }}
                                      </h6>
                                    </div>
                                  </div>
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


                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>Designed &amp; Developed By <a href="javascript:void(0);" class="text-primary">Dreams</a></p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <employee-details-modal></employee-details-modal>
</template>
<script>
import { useEmployeeStore } from '@/stores/employeeStore';

export default {
  name: 'EmployeeDetails',
  data() {
    return {
      employee: null,
      loading: true,
    };
  },
  created() {
    this.fetchEmployeeDetails();
  },
  methods: {
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
      return new Date(date).toLocaleDateString();
    },

    async fetchEmployeeDetails() {
      const employeeStore = useEmployeeStore();
      // Grab the employee ID from the route parameters
      const id = this.$route.params.id;
      try {
        // Call the store action to get employee details
        this.employee = await employeeStore.getEmployeeDetails(id);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here if needed */
</style>
<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

import { ref } from "vue";
const currentDate = ref(new Date());

export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      Jobcategory: ["Select", "IOS", "Web & Application", "Networking"],
      Jobtype: ["Select", "Full Time", "Part Time"],
      Joblevel: ["Select", "Team Lead", "Manager", "Senior", "junior"],
      Experience: ["Select", "Entry Level", "Mid Level", "Expert"],
      Qualification: ["Select", "Bachelore Degree", "Master Degree", "Others"],
      Gender: ["Select", "Male", "Female"],
      Minsalary: ["Select", "10k - 15k", "15k -20k"],
      Maxsalary: ["Select", "40k - 50k", "50k - 60k"],
      City: ["Select", "Los Angeles", "San Diego", "Fresno", "San Francisco"],
      State: ["Select", "California", "New York", "Texas", "Florida"],
      Country: ["Select", "USA", "Canada", "Germany", "France"],
      startdate: currentDate,
      dateFormat: "dd-MM-yyyy",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/recuritment/job-list");
    },
  },
};
</script>

<template>
  <!-- Add Post -->
  <div class="modal fade" id="add_post">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Post Job</h4>
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
              <div class="contact-grids-tab pt-0">
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
                      Location
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
                    </div>
                    <div class="col-md-12">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Title <span class="text-danger"> *</span></label
                        >
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Description <span class="text-danger"> *</span></label
                        >
                        <textarea rows="3" class="form-control"></textarea>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Category <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Jobcategory"
                          id="ios-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Type <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Jobtype"
                          id="ios-lists"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Level <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Joblevel"
                          id="junior-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Experience <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Experience"
                          id="mid-level-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Qualification <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Qualification"
                          id="master-degree-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Gender <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Gender"
                          id="female-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Min. Sallary <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Minsalary"
                          id="female-min-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Max. Sallary <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Maxsalary"
                          id="female-salary-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Expired Date <span class="text-danger"> *</span></label
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
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">Required Skills</label>
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-light me-2"
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
                      Save & Next
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
                  <div class="row">
                    <div class="col-md-12">
                      <div class="mb-3">
                        <label class="form-label"
                          >Address <span class="text-danger"> *</span></label
                        >
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >City <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="City"
                          id="female-city-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >State <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="State"
                          id="female-state-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Country <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Country"
                          id="female-country-list"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Zip Code <span class="text-danger"> *</span></label
                        >
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="map-grid mb-3">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6509170.989457427!2d-123.80081967108484!3d37.192957227641294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sin!4v1669181581381!5m2!1sen!2sin"
                          style="border: 0"
                          allowfullscreen=""
                          loading="lazy"
                          referrerpolicy="no-referrer-when-downgrade"
                          class="w-100"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-light me-2"
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
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Post Job -->

  <!-- Add Job Success -->
  <div class="modal fade" id="success_modal" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-xm">
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-center p-3">
            <span class="avatar avatar-lg avatar-rounded bg-success mb-3"
              ><i class="ti ti-check fs-24"></i
            ></span>
            <h5 class="mb-2">Job Posted Successfully</h5>
            <div>
              <div class="row g-2">
                <div class="col-12">
                  <router-link to="/recuritment/job-grid" class="btn btn-dark w-100"
                    >Back to List</router-link
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

  <!-- Edit Post -->
  <div class="modal fade" id="edit_post">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Job</h4>
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
              <div class="contact-grids-tab pt-0">
                <ul class="nav nav-underline" id="myTabs" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link active"
                      id="info-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#basic-infos"
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
                      id="address-tabs"
                      data-bs-toggle="tab"
                      data-bs-target="#addresss"
                      type="button"
                      role="tab"
                      aria-selected="false"
                    >
                      Location
                    </button>
                  </li>
                </ul>
              </div>
              <div class="tab-content" id="myTabContents">
                <div
                  class="tab-pane fade show active"
                  id="basic-infos"
                  role="tabpanel"
                  aria-labelledby="info-tab"
                  tabindex="0"
                >
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
                    </div>
                    <div class="col-md-12">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Title <span class="text-danger"> *</span></label
                        >
                        <input
                          type="text"
                          class="form-control"
                          value="Senior IOS Developer"
                        />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Description <span class="text-danger"> *</span></label
                        >
                        <textarea rows="3" class="form-control"></textarea>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Category <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Jobcategory"
                          id="ios-list-one"
                          placeholder="IOS"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Type <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Jobtype"
                          id="ios-lists-one"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Level <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Joblevel"
                          id="junior-list-one"
                          placeholder="Team Lead"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Experience <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Experience"
                          id="mid-level-list-one"
                          placeholder="Entry Level"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Qualification <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Qualification"
                          id="master-degree-list-one"
                          placeholder="Bachelore Degree"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Gender <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Gender"
                          id="female-list-one"
                          placeholder="Female"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Min. Sallary <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Minsalary"
                          id="female-min-list-one"
                          placeholder="10k - 15k"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Max. Sallary <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Maxsalary"
                          id="female-salary-list-one"
                          placeholder="40k - 50k"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Job Expired Date <span class="text-danger"> *</span></label
                        >
                        <div class="input-icon-end position-relative">
                          <date-picker
                            v-model="startdate"
                            class="form-control datetimepicker"
                            value="29/08/2024"
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
                        <label class="form-label">Required Skills</label>
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-light me-2"
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
                      Save & Next
                    </button>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="addresss"
                  role="tabpanel"
                  aria-labelledby="address-tab"
                  tabindex="0"
                >
                  <div class="row">
                    <div class="col-md-12">
                      <div class="mb-3">
                        <label class="form-label"
                          >Address <span class="text-danger"> *</span></label
                        >
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >City <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="City"
                          id="female-city-list-one"
                          placeholder="Bristol"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >State <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="State"
                          id="female-state-list-one"
                          placeholder="Lancaster"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Country <span class="text-danger"> *</span></label
                        >
                        <a-select
                          :options="Country"
                          id="female-country-list-one"
                          placeholder="UK"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label"
                          >Zip Code <span class="text-danger"> *</span></label
                        >
                        <input type="text" class="form-control" />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="map-grid mb-3">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6509170.989457427!2d-123.80081967108484!3d37.192957227641294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sin!4v1669181581381!5m2!1sen!2sin"
                          style="border: 0"
                          allowfullscreen=""
                          loading="lazy"
                          referrerpolicy="no-referrer-when-downgrade"
                          class="w-100"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-light me-2"
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
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Post Job -->

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
            <router-link to="/recuritment/job-list" class="btn btn-danger"
              >Yes, Delete</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

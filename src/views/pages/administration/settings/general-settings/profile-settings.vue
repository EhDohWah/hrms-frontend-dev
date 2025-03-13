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
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
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
      <!-- /Breadcrumb -->

      <settings-tab></settings-tab>
      <div class="row">
        <general-sidebar></general-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-3">
                <h4>Profile Settings</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-12">
                      <div>
                        <h6 class="mb-3">Basic Information</h6>
                        <div
                          class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                        >
                          <div
                            class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames"
                          >
                            <i class="ti ti-photo text-gray-3 fs-16"></i>
                          </div>
                          <div class="profile-upload">
                            <div class="mb-2">
                              <h6 class="mb-1">Profile Photo</h6>
                              <p class="fs-12">Recommended image size is 40px x 40px</p>
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
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">First Name</label>
                        </div>
                        <div class="col-md-8">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">Last Name</label>
                        </div>
                        <div class="col-md-8">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">Email</label>
                        </div>
                        <div class="col-md-8">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">Phone</label>
                        </div>
                        <div class="col-md-8">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-bottom mb-3">
                  <h6 class="mb-3">Address Information</h6>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-2">
                          <label class="form-label mb-md-0">Address</label>
                        </div>
                        <div class="col-md-10">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">Country</label>
                        </div>
                        <div class="col-md-8">
                          <div>
                            <vue-select
                              :options="IndUk"
                              id="induk"
                              placeholder="Select"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">State</label>
                        </div>
                        <div class="col-md-8">
                          <div>
                            <vue-select
                              :options="UkSek"
                              id="ujsek"
                              placeholder="Select"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">City</label>
                        </div>
                        <div class="col-md-8">
                          <vue-select
                            :options="Cityselc"
                            id="cityselc"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">Postal Code</label>
                        </div>
                        <div class="col-md-8">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex align-items-center justify-content-end">
                  <button type="button" class="btn btn-outline-light border me-3">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
</template>
<script>
export default {
  data() {
    return {
      UkSek: ["Select", "California", "New York", "Texas", "Florida"],
      IndUk: ["Select", "France", "Germany", "Canada", "USA"],
      Cityselc: ["Select", "Los Angeles", "San Diego", "Fresno", "San Francisco"],
      title: "Settings",
      text: "Administration",
      text1: "Settings",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/general-settings/profile-settings");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

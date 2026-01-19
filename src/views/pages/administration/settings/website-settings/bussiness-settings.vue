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
        <website-sidebar></website-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-3">
                <h4>Business Settings</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-12">
                      <div>
                        <h6 class="mb-3">Basic Information</h6>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">Company Name</label>
                        </div>
                        <div class="col-md-8">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">Email Address</label>
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
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-4">
                          <label class="form-label mb-md-0">Fax</label>
                        </div>
                        <div class="col-md-8">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-2">
                          <label class="form-label mb-md-0">Web</label>
                        </div>
                        <div class="col-md-10">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-bottom mb-3">
                  <h6 class="mb-3">Company Images</h6>
                  <div class="row">
                    <div class="col-md-6">
                      <div
                        class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                      >
                        <div
                          class="d-flex align-items-center justify-content-center avatar avatar-xxl bg-white rounded border border-dashed me-2 flex-shrink-0 text-dark frames px-2"
                        >
                          <img src="@/assets/img/logo.svg" class="img-fluid" alt="logo" />
                        </div>
                        <div class="profile-upload">
                          <div class="mb-2">
                            <h6 class="mb-1">White Logo</h6>
                            <p class="fs-12">Recommended image size is 160px x 50px</p>
                          </div>
                          <div class="profile-uploader d-flex align-items-center">
                            <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                              Change
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
                    <div class="col-md-6">
                      <div
                        class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                      >
                        <div
                          class="d-flex align-items-center justify-content-center avatar bg-dark avatar-xxl rounded border border-dashed me-2 px-2 flex-shrink-0 text-dark frames"
                        >
                          <img
                            src="@/assets/img/logo-white.svg"
                            class="img-fluid text-white"
                            alt="logo"
                          />
                        </div>
                        <div class="profile-upload">
                          <div class="mb-2">
                            <h6 class="mb-1">Dark Logo</h6>
                            <p class="fs-12">Recommended image size is 160px x 50px</p>
                          </div>
                          <div class="profile-uploader d-flex align-items-center">
                            <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                              Change
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
                    <div class="col-md-6">
                      <div
                        class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                      >
                        <div
                          class="d-flex align-items-center justify-content-center avatar avatar-xxl bg-white rounded border border-dashed me-2 p-3 flex-shrink-0 text-dark frames"
                        >
                          <img
                            src="@/assets/img/logo-small.svg"
                            class="img-fluid"
                            alt="logo"
                          />
                        </div>
                        <div class="profile-upload">
                          <div class="mb-2">
                            <h6 class="mb-1">White Mini Logo</h6>
                            <p class="fs-12">Recommended image size is 80px x 80px</p>
                          </div>
                          <div class="profile-uploader d-flex align-items-center">
                            <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                              Change
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
                    <div class="col-md-6">
                      <div
                        class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                      >
                        <div
                          class="d-flex align-items-center justify-content-center avatar avatar-xxl bg-dark rounded border border-dashed me-2 flex-shrink-0 text-dark frames"
                        >
                          <i class="ti ti-photo text-gray-3 fs-16"></i>
                        </div>
                        <div class="profile-upload">
                          <div class="mb-2">
                            <h6 class="mb-1">Dark Mini Logo</h6>
                            <p class="fs-12">Recommended image size is 80px x 80px</p>
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
                    <div class="col-md-6">
                      <div
                        class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                      >
                        <div
                          class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded bg-white p-3 border border-dashed me-2 flex-shrink-0 text-dark frames"
                        >
                          <img
                            src="@/assets/img/logo-small.svg"
                            class="img-fluid"
                            alt="logo"
                          />
                        </div>
                        <div class="profile-upload">
                          <div class="mb-2">
                            <h6 class="mb-1">Favicon</h6>
                            <p class="fs-12">Recommended image size is 128px x 128px</p>
                          </div>
                          <div class="profile-uploader d-flex align-items-center">
                            <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                              Change
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
                    <div class="col-md-6">
                      <div
                        class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                      >
                        <div
                          class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded bg-white p-3 border border-dashed me-2 flex-shrink-0 text-dark frames"
                        >
                          <img
                            src="@/assets/img/logo-small.svg"
                            class="img-fluid"
                            alt="logo"
                          />
                        </div>
                        <div class="profile-upload">
                          <div class="mb-2">
                            <h6 class="mb-1">Apple Icon</h6>
                            <p class="fs-12">Recommended image size is 180px x 180px</p>
                          </div>
                          <div class="profile-uploader d-flex align-items-center">
                            <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                              Change
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
                            <select class="select">
                              <option>Select</option>
                              <option>USA</option>
                              <option>Canada</option>
                              <option>Germany</option>
                              <option>France</option>
                            </select>
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
                            <select class="select">
                              <option>Select</option>
                              <option>California</option>
                              <option>New York</option>
                              <option>Texas</option>
                              <option>Florida</option>
                            </select>
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
                          <select class="select">
                            <option>Select</option>
                            <option>Los Angeles</option>
                            <option>San Diego</option>
                            <option>Fresno</option>
                            <option>San Francisco</option>
                          </select>
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
      TurBus: ["Select", "Belgium", "Turkey", "Ukraine"],
      SelBus: ["Select", "France", "India", "UK"],
      title: "Settings",
      text: "Administration",
      text1: "Settings",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/website-settings/bussiness-settings");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

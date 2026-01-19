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
        <breadcrumb :title="title" :text="text" :text1="text1" />
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
                <h4>SEO Settings</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="row align-items-center mb-3">
                        <div class="col-xxl-2 col-md-3">
                          <label class="form-label mb-md-0">Meta Title</label>
                        </div>
                        <div class="col-xxl-10 col-md-9">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row align-items-center mb-3">
                        <div class="col-xxl-2 col-md-3">
                          <label class="form-label mb-md-0">Meta Keywords</label>
                        </div>
                        <div class="col-xxl-10 col-md-9">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row align-items-start mb-3">
                        <div class="col-xxl-2 col-md-3">
                          <label class="form-label mb-md-0">Meta Description</label>
                        </div>
                        <div class="col-xxl-10 col-md-9">
                          <textarea class="form-control" rows="3"></textarea>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row align-items-center mb-3">
                        <div class="col-xxl-2 col-md-3">
                          <label class="form-label mb-md-0">Canonical Url</label>
                        </div>
                        <div class="col-xxl-10 col-md-9">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row align-items-center mb-3">
                        <div class="col-xxl-2 col-md-3">
                          <label class="form-label mb-md-0">Og Title</label>
                        </div>
                        <div class="col-xxl-10 col-md-9">
                          <input type="text" class="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row align-items-start mb-3">
                        <div class="col-xxl-2 col-md-3">
                          <label class="form-label mb-md-0">Og Description</label>
                        </div>
                        <div class="col-xxl-10 col-md-9">
                          <textarea class="form-control" rows="3"></textarea>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12 d-flex align-items-start">
                      <div class="col-xxl-2 col-md-3">
                        <label class="form-label mb-md-0">Og Image</label>
                      </div>
                      <div class="col-xxl-10 col-md-9">
                        <div
                          class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                        >
                          <div
                            class="d-flex align-items-center justify-content-center og-upload bg-white rounded border border-dashed me-2 flex-shrink-0 text-dark frames"
                          >
                            <i class="ti ti-photo text-gray-3 fs-16"></i>
                          </div>
                          <div class="profile-upload">
                            <div class="mb-2">
                              <h6 class="mb-1">OG Image</h6>
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
      title: "Settings",
      text: "Administration",
      text1: "Settings",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/website-settings/seo-settings");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

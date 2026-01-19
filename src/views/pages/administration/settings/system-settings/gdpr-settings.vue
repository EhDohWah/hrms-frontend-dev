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
        <system-sidebar></system-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-3">
                <h4>GDPR Cookies</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="row align-items-center">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <h6 class="fw-medium">Cookies Consent Text</h6>
                          </div>
                        </div>
                        <div class="col-lg-8">
                          <div class="mb-3">
                            <ckeditor
                              :editor="editor"
                              v-model="editorData"
                              :config="editorConfig"
                            ></ckeditor>
                          </div>
                        </div>
                      </div>
                      <div class="row align-items-center">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <h6 class="fw-medium">Cookies Position</h6>
                          </div>
                        </div>
                        <div class="col-lg-3">
                          <div class="mb-3">
                            <vue-select
                              :options="LeftSele"
                              id="leftsel"
                              placeholder="Select"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row align-items-center">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <h6 class="fw-medium">Agree Button Text</h6>
                          </div>
                        </div>
                        <div class="col-lg-3">
                          <div class="mb-3">
                            <input class="form-control" type="text" />
                          </div>
                        </div>
                      </div>
                      <div class="row align-items-center">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <h6 class="fw-medium">Decline Button Text</h6>
                          </div>
                        </div>
                        <div class="col-lg-3">
                          <div class="mb-3">
                            <input class="form-control" type="text" />
                          </div>
                        </div>
                      </div>
                      <div class="row align-items-center">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <h6 class="fw-medium">Show Decline Button</h6>
                          </div>
                        </div>
                        <div class="col-lg-3">
                          <div class="form-check form-switch mb-0">
                            <input
                              class="form-check-input mb-3"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row align-items-center">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <h6 class="fw-medium">Link for Cookies Page</h6>
                          </div>
                        </div>
                        <div class="col-lg-8">
                          <div class="mb-3">
                            <input type="text" class="form-control" />
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
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  data() {
    return {
      editor: ClassicEditor,
      editorData: " ",
      editorConfig: {},
      LeftSele: ["Select", "Right", "Left"],
      title: "Settings",
      text: "Administration",
      text1: "Settings",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/system-settings/gdpr");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

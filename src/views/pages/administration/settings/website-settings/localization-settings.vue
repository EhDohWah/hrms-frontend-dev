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
                <h4>Localization</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Language</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="SpaSel"
                            id="spasel"
                            placeholder="Select"
                          />

                          <p
                            class="fs-13 fw-normal mt-2 form-check form-check-md form-switch me-2"
                          >
                            <input
                              class="form-check-input me-2"
                              type="checkbox"
                              role="switch"
                            />Language Switcher
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Timezone</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="TimeSel"
                            id="timesel"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Date Format</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="DateSel"
                            id="datesel"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Time Format</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="FormSel"
                            id="formsel"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Financial Year</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="FinaSel"
                            id="finasel"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Starting Month</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="StarSel"
                            id="starsel"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-bottom mb-3">
                  <h6 class="mb-3">Currency Information</h6>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Currency</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="AmerSel"
                            id="amersel"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Currency Symbol</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="CurrSe"
                            id="currse"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Currency Position</label>
                        </div>
                        <div class="col-md-7"></div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Decimal Seperator</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="DecSel"
                            id="decsel"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Thousand Seperator</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="ThouSel"
                            id="thousel"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-bottom mb-3">
                  <h6 class="mb-3">Country Settings</h6>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Countries Restriction</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="CountSele"
                            id="countsele"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-bottom mb-3">
                  <h6 class="mb-3">File Settings</h6>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Allowed Files</label>
                        </div>
                        <div class="col-md-7">
                          <vue-select
                            :options="FilSel"
                            id="filesel"
                            placeholder="Select"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-5">
                          <label class="form-label mb-md-0">Max File Size</label>
                        </div>
                        <div class="col-md-7">
                          <input type="text" class="form-control" placeholder="5000 MB" />
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
      TimeSel: ["Select", "(UTC +5:30)", "(UTC+11:00) INR"],
      SpaSel: ["Select", "English", "French", "Spanish"],
      DateSel: ["Select", "15 Nov 2024", "Nov 15 2024"],
      FormSel: ["Select", "12 Hours", "24 Hours"],
      FinaSel: ["Select", "2024", "2023"],
      StarSel: ["Select", "January", "February", "March"],
      AmerSel: ["Select", "United State of America", "India"],
      CurrSe: ["Select", "$", "€"],
      PosSel: ["Select", "100$", "$100"],
      DecSel: ["Select", ".", "."],
      ThouSel: ["Select", ",", ","],
      CountSele: ["Select", "Allow All Countries", "Deny All Countries"],
      FilSel: ["Select", "jpg", "gif", "png"],
      title: "Settings",
      text: "Administration",
      text1: "Settings",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/website-settings/localization-settings");
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

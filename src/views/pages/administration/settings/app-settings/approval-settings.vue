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
        <app-sidebar></app-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-3">
                <h4>Approval Settings</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-12 d-flex">
                      <div class="flex-fill">
                        <h6 class="mb-3">Expense Approval</h6>
                        <div
                          class="d-flex justify align-items-start flex-wrap row-gap-3 pb-2 mb-2"
                        >
                          <h5>Default Expense Approval</h5>

                          <div class="form-check ms-3">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios1"
                              value="option1"
                              checked
                            />
                            <label class="form-check-label" for="exampleRadios1">
                              Sequence Approval (Chain)
                            </label>
                          </div>
                          <div class="form-check ms-3">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="exampleRadios"
                              id="exampleRadios2"
                              value="option1"
                            />
                            <label class="form-check-label" for="exampleRadios2">
                              Simultaneous Approval
                            </label>
                          </div>
                        </div>
                        <div class="col-md-8">
                          <div class="d-flex align-items-center flex-wrap roe-gap-3 mb-3">
                            <div class="me-3">
                              <label class="form-label mb-0">Expense Approvers</label>
                            </div>
                            <div class="flex-fill">
                              <vue-select
                                :options="LeadSele"
                                id="leadsele"
                                placeholder="Select"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-12 d-flex">
                      <div class="flex-fill">
                        <h6 class="mb-3">Leave Approval</h6>
                        <div
                          class="d-flex justify align-items-start flex-wrap row-gap-3 pb-2 mb-2"
                        >
                          <h5>Default Expense Approval</h5>
                          <div class="form-check ms-3">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="exampleRadioss"
                              id="sequence"
                              value="option1"
                              checked
                            />
                            <label class="form-check-label" for="sequence">
                              Sequence Approval (Chain)
                            </label>
                          </div>
                          <div class="form-check ms-3">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="exampleRadioss"
                              id="sequence1"
                              value="option1"
                            />
                            <label class="form-check-label" for="sequence1">
                              Simultaneous Approval
                            </label>
                          </div>
                        </div>
                        <div class="col-md-8">
                          <div class="d-flex align-items-center flex-wrap roe-gap-3 mb-3">
                            <div class="me-3">
                              <label class="form-label mb-0">Leave Approvers</label>
                            </div>
                            <div class="flex-fill">
                              <vue-select
                                :options="ManageLea"
                                id="managle"
                                placeholder="Select"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-12 d-flex">
                      <div class="flex-fill">
                        <h6 class="mb-3">Offer Approval</h6>
                        <div
                          class="d-flex justify align-items-start flex-wrap row-gap-3 pb-2 mb-2"
                        >
                          <h5>Default Expense Approval</h5>
                          <div class="form-check ms-3">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="exampleRadioss"
                              id="sequence3"
                              value="option1"
                              checked
                            />
                            <label class="form-check-label" for="sequence3">
                              Sequence Approval (Chain)
                            </label>
                          </div>
                          <div class="form-check ms-3">
                            <input
                              class="form-check-input"
                              type="radio"
                              name="exampleRadioss"
                              id="sequence4"
                              value="option1"
                            />
                            <label class="form-check-label" for="sequence4">
                              Simultaneous Approval
                            </label>
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
      LeadSele: ["Select", "CEO", "Manager", "Team Lead"],
      ManageLea: ["Select", "CEO", "Manager", "Team Lead"],
      title: "Settings",
      text: "Administration",
      text1: "Settings",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/app-settings/approval-settingss");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

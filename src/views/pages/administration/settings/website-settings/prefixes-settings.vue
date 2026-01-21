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
                <h4>Prefixes</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-6">
                          <label class="form-label mb-md-0">Employee</label>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" value="EMP-" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-6">
                          <label class="form-label mb-md-0">Clients</label>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" value="CLI-" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-6">
                          <label class="form-label mb-md-0">Invoice</label>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" value="INV-" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-6">
                          <label class="form-label mb-md-0">Tickets</label>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" value="TIC-" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-6">
                          <label class="form-label mb-md-0">Candidate</label>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" value="CAND-" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-6">
                          <label class="form-label mb-md-0">Job</label>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" value="JOB-" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-6">
                          <label class="form-label mb-md-0">Referral</label>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" value="REF-" />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="row align-items-center mb-3">
                        <div class="col-md-6">
                          <label class="form-label mb-md-0">Assets</label>
                        </div>
                        <div class="col-md-6">
                          <input type="text" class="form-control" value="AST-" />
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
      this.$router.push("/website-settings/prefixes");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

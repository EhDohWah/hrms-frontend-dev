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
            <div class="card-header px-0 mx-3">
              <h4>Language</h4>
            </div>
            <div class="card-body pb-0">
              <div class="card mb-3">
                <div class="card-header">
                  <div class="row align-items-center g-3">
                    <div class="col-sm-5">
                      <h6>Language</h6>
                    </div>
                    <div class="col-sm-7">
                      <div
                        class="d-flex align-items-center justify-content-sm-end flex-wrap row-gap-2"
                      >
                        <router-link
                          to="/website-settings/language"
                          class="btn btn-sm btn-primary d-inline-flex align-items-center me-3"
                        >
                          <i class="ti ti-arrow-left me-2"></i>
                          Back to Translations
                        </router-link>
                        <a
                          href="javascript:void(0);"
                          class="btn btn-sm btn-outline-dark d-inline-flex align-items-center me-3"
                        >
                          <img
                            src="@/assets/img/flags/ae.png"
                            class="me-2 avatar avatar-sm avatar-rounded"
                            alt="Img"
                          />
                          Arabic
                        </a>
                        <div class="flex-shrink-0 flex-fill">
                          <span class="d-block">Progress</span>
                          <div class="d-flex align-items-center">
                            <div class="progress progress-xs w-100">
                              <div
                                class="progress-bar bg-warning rounded"
                                role="progressbar"
                                style="width: 80%"
                                aria-valuenow="80"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <span class="d-inline-flex fs-12 ms-2">80%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table">
                      <thead class="thead-light">
                        <tr>
                          <th class="w-50">English</th>
                          <th class="w-50">Arabic</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Name</td>
                          <td>
                            <input
                              type="text"
                              class="form-control text-end"
                              value="اسم"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Email Address</td>
                          <td>
                            <input
                              type="text"
                              class="form-control text-end"
                              value="عنوان البريد الإلكتروني"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Phone Number</td>
                          <td>
                            <input
                              type="text"
                              class="form-control text-end"
                              value="رقم التليفون"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Reg Date</td>
                          <td>
                            <input
                              type="text"
                              class="form-control text-end"
                              value="تاريخ التسجيل"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Country</td>
                          <td>
                            <input
                              type="text"
                              class="form-control text-end"
                              value="دولة"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Last Seen</td>
                          <td>
                            <input
                              type="text"
                              class="form-control text-end"
                              value="شوهد آخر مرة"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

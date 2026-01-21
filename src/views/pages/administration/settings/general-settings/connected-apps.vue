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
        <general-sidebar></general-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body pb-0">
              <div class="border-bottom mb-3 pb-3">
                <h4>Connectd Apps</h4>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center">
                          <span class="avatar avatar-lg bg-gray-100 me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/settings/connected-app-01.svg"
                              class="w-auto h-auto"
                              alt="Img"
                            />
                          </span>
                          <h5>Slack</h5>
                        </div>
                        <div class="form-check form-check-md form-switch">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                          />
                        </div>
                      </div>
                      <div>
                        <p class="text-truncate line-clamb-2">
                          Team communication platform with channels for group discussions
                          and direct messaging.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center">
                          <span class="avatar avatar-lg bg-gray-100 me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/settings/connected-app-02.svg"
                              class="w-auto h-auto"
                              alt="Img"
                            />
                          </span>
                          <h5>Google Calendar</h5>
                        </div>
                        <div class="form-check form-check-md form-switch">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                          />
                        </div>
                      </div>
                      <div>
                        <p class="text-truncate line-clamb-2">
                          Google Calendar is a web-based scheduling tool that allows users
                          to create, manage, and share events.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center">
                          <span class="avatar avatar-lg bg-gray-100 me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/settings/connected-app-03.svg"
                              class="w-auto h-auto"
                              alt="Img"
                            />
                          </span>
                          <h5>Gmail</h5>
                        </div>
                        <div class="form-check form-check-md form-switch">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                          />
                        </div>
                      </div>
                      <div>
                        <p class="text-truncate line-clamb-2">
                          Gmail is a free email service by Google that offers robust spam
                          protection & 15GB of storage.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center">
                          <span class="avatar avatar-lg bg-gray-100 me-2 flex-shrink-0">
                            <img
                              src="@/assets/img/settings/connected-app-04.svg"
                              class="w-auto h-auto"
                              alt="Img"
                            />
                          </span>
                          <h5>Github</h5>
                        </div>
                        <div class="form-check form-check-md form-switch">
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            role="switch"
                          />
                        </div>
                      </div>
                      <div>
                        <p class="text-truncate line-clamb-2">
                          Github is a web-based platform for version control and
                          collaboration, allowing developers to host & review code
                        </p>
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

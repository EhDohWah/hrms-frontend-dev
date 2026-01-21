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
                <h4>Appearance</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="border-bottom mb-3">
                  <div class="row align-items-center">
                    <div class="col-xl-3 col-lg-12 col-md-3">
                      <div class="setting-info mb-4">
                        <h6 class="fs-14 fw-medium">Select Theme</h6>
                      </div>
                    </div>
                    <div class="col-xl-9 col-lg-12 col-md-9">
                      <div class="d-flex align-items-center">
                        <div class="me-3">
                          <div class="card shadow-none border-primary">
                            <div class="card-body">
                              <a href="javascript:void(0);">
                                <div class="border rounded border-gray mb-2">
                                  <img
                                    src="@/assets/img/theme/light.svg"
                                    class="img-fluid rounded"
                                    alt="theme"
                                  />
                                </div>
                                <p class="text-dark text-center">Light</p>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div class="me-3">
                          <div class="card shadow-none">
                            <div class="card-body">
                              <a href="javascript:void(0);">
                                <div class="border rounded border-gray mb-2">
                                  <img
                                    src="@/assets/img/theme/dark.svg"
                                    class="img-fluid rounded"
                                    alt="theme"
                                  />
                                </div>
                                <p class="text-dark text-center">Dark</p>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="card shadow-none">
                            <div class="card-body">
                              <a href="javascript:void(0);">
                                <div class="border rounded border-gray mb-2">
                                  <img
                                    src="@/assets/img/theme/automatic.svg"
                                    class="img-fluid rounded"
                                    alt="theme"
                                  />
                                </div>
                                <p class="text-dark text-center">Automatic</p>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row align-items-center">
                    <div class="col-xl-3 col-lg-12 col-md-3">
                      <div class="setting-info mb-4">
                        <h6 class="fs-14 fw-medium">Accent Color</h6>
                      </div>
                    </div>
                    <div class="col-xl-4 col-lg-12 col-md-4">
                      <div class="theme-colors mb-4">
                        <ul class="d-flex align-items-center">
                          <li v-for="(color, index) in colors" :key="index">
                            <span
                              class="themecolorset"
                              :class="{ active: selectedColor === color }"
                              @click="selectColor(color)"
                            >
                              <span class="primecolor" :class="color">
                                <span class="colorcheck text-white">
                                  <i
                                    v-if="selectedColor === color"
                                    class="ti ti-check text-primary fs-10"
                                  ></i>
                                </span>
                              </span>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="row align-items-center mb-4">
                    <div class="col-xl-3 col-lg-12 col-md-3">
                      <div class="">
                        <h6 class="fs-14 fw-medium">Sidebar Size</h6>
                      </div>
                    </div>
                    <div class="col-xl-3 col-lg-12 col-md-3">
                      <a-select
                        :options="SmallSel"
                        id="smallsel"
                        placeholder="Select"
                        style="width: 100%"
                        :show-search="true"
                        :filter-option="filterOption"
                      />
                    </div>
                  </div>
                  <div class="row align-items-center mb-3">
                    <div class="col-xl-3 col-lg-12 col-md-3">
                      <div class="">
                        <h6 class="fs-14 fw-medium">Font Family</h6>
                      </div>
                    </div>
                    <div class="col-xl-3 col-lg-12 col-md-3">
                      <a-select :options="NunSel" id="nunsel" placeholder="Select" style="width: 100%" :show-search="true" :filter-option="filterOption" />
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
import { useSelectMigration } from '@/composables/useSelectMigration';

export default {
  setup() {
    const { filterOption } = useSelectMigration();
    return { filterOption };
  },
  data() {
    return {
      title: "Settings",
      text: "Administration",
      text1: "Settings",
      SmallSel: ["Select", "Small - 85px", "Large - 250px"],
      NunSel: ["Select", "Nunito", "Poppins"],
      // Define a list of color classes
      colors: [
        "bg-primary",
        "bg-secondary",
        "bg-info",
        "bg-purple",
        "bg-pink",
        "bg-warning",
        "bg-danger",
      ],
      // Store the currently selected color
      selectedColor: "bg-danger", // Default selected color
    };
  },
  methods: {
    selectColor(color) {
      this.selectedColor = color; // Set selected color on click
    },
    submitForm() {
      this.$router.push("/website-settings/appearance");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

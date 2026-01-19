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

      <div class="card">
        <div class="card-body">
          <!-- Gallery Grid -->
          <div class="row row-gap-4 justify-content-center">
            <div
              v-for="(image, index) in images"
              :key="index"
              class="col-lg-4 col-md-6 col-sm-12"
            >
              <img
                :src="require(`@/assets/img/social/${image.thumb}`)"
                class="img-fluid rounded w-100"
                alt="image"
                @click="openLightbox(index)"
              />
            </div>
          </div>

          <!-- Lightbox Component -->
          <vue-easy-lightbox
            v-show="showLightbox"
            :visible="showLightbox"
            :imgs="fullImages"
            :index="currentIndex"
            @close="closeLightbox"
            :close-icon="true"
            @click.self="closeLightbox"
          />
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
  </div>
  <!-- /Page Wrapper -->
</template>

<script>
import { ref } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";

export default {
  components: {
    VueEasyLightbox,
  },
  data() {
    return {
      title: "Gallery",
      text: "Pages",
      text1: "Gallery",
      // Array of images with thumb and full path
      images: [
        { thumb: "gallery.jpg", full: "gallery.jpg" },
        { thumb: "gallery-06.jpg", full: "gallery-06.jpg" },
        { thumb: "gallery-07.jpg", full: "gallery-07.jpg" },
        { thumb: "gallery-08.jpg", full: "gallery-08.jpg" },
        { thumb: "gallery-09.jpg", full: "gallery-09.jpg" },
        { thumb: "gallery-05.jpg", full: "gallery-05.jpg" },
        { thumb: "gallery-10.jpg", full: "gallery-10.jpg" },
        { thumb: "gallery-11.jpg", full: "gallery-11.jpg" },
        { thumb: "gallery-12.jpg", full: "gallery-12.jpg" },
      ],
      // Variables for lightbox state
      showLightbox: false,
      currentIndex: 0,
    };
  },
  computed: {
    // Generate the full image URLs dynamically
    fullImages() {
      return this.images.map((image) => require(`@/assets/img/social/${image.full}`));
    },
  },
  methods: {
    // Open the lightbox at the specified index
    openLightbox(index) {
      this.currentIndex = index;
      this.showLightbox = true;
    },
    // Close the lightbox
    closeLightbox() {
      this.showLightbox = false;
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

<style scoped>
/* Add styles to make the background of the lightbox clickable */
.vue-easy-lightbox__overlay {
  cursor: pointer; /* Make the overlay clickable */
}
</style>

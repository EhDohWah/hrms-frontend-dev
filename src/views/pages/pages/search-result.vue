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
          <form action="#">
            <div class="d-flex align-items-center">
              <input type="text" class="form-control flex-fill me-3" value="SmartHR" />
              <button type="submit" class="btn btn-primary">Search</button>
            </div>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h5 class="mb-3">Search result for "SmartHR"</h5>
          <div class="row">
            <div class="col-md-6" v-for="(result, index) in searchResults" :key="index">
              <div class="card shadow-none">
                <div class="card-body">
                  <a :href="result.url" class="text-info text-truncate mb-2">{{
                    result.url
                  }}</a>
                  <p class="text-truncate line-clamb-2 mb-2">{{ result.description }}</p>
                  <div class="d-flex align-items-center flex-wrap row-gap-2">
                    <span class="text-gray-9 me-3 pe-3 border-end"
                      >{{ result.sales }} Sales</span
                    >
                    <div
                      class="text-gray-9 d-flex align-items-center me-3 pe-3 border-end"
                    >
                      <i
                        v-for="n in result.stars"
                        :key="n"
                        class="ti ti-star-filled text-warning me-1"
                      ></i>
                      <i
                        v-for="n in 5 - result.stars"
                        :key="n"
                        class="ti ti-star-filled text-gray-2 me-1"
                      ></i>
                      ({{ result.reviews }})
                    </div>
                    <span class="text-gray-9">{{ result.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h5 class="mb-3">Images</h5>
          <div class="row g-3">
            <div
              v-for="(image, index) in images"
              :key="index"
              class="col-xl-2 col-md-4 col-6"
            >
              <a @click.prevent="openLightbox(index)" class="gallery-item">
                <img
                  :src="getMediaImageUrl(image)"
                  class="rounded"
                  alt="img"
                />
              </a>
            </div>

            <!-- Vue Easy Lightbox -->
            <vue-easy-lightbox
              v-model:visible="visible"
              :imgs="imageUrls"
              :index="lightboxIndex"
              @click.self="closeLightbox"
            />
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
import { ref, computed } from "vue";
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getMediaImageUrl } = useAssetUrl();
import VueEasyLightbox from "vue-easy-lightbox"; // Ensure you import the lightbox component

export default {
  components: {
    VueEasyLightbox,
  },
  setup() {
    const images = [
      "media-15.jpg",
      "media-16.jpg",
      "media-17.jpg",
      "media-18.jpg",
      "media-19.jpg",
      "media-20.jpg",
      "media-21.jpg",
      "media-22.jpg",
      "media-23.jpg",
      "media-24.jpg",
      "media-25.jpg",
      "media-26.jpg",
    ];

    const searchResults = [
      {
        url: "https://themeforest.net/search/smarthr",
        description:
          "SmartHR - Html, Vue 3, Angular 17+ & Node HR Project Management & CRM Admin Dashboard Template",
        sales: "1.7K",
        stars: 4,
        reviews: 45,
        price: "$35",
      },
      {
        url: "https://themeforest.net/item/smarthr-react-admin-template/28253842",
        description:
          "SmartHR - React 18+ & Html HRMS, Payroll, CRM and HR Project Management Admin Dashboard Template",
        sales: 513,
        stars: 4,
        reviews: 18,
        price: "$35",
      },
      {
        url: "https://themeforest.net/item/smarthr-laravel-admin-template/27532539",
        description:
          "SmartHR - Laravel 10 + Html HRMS, Payroll, CRM and HR Project Management Admin Dashboard Template",
        sales: 339,
        stars: 4,
        reviews: 8,
        price: "$35",
      },
      {
        url: "https://themeforest.net/item/dhr-html-mobile-template/22227174",
        description:
          "SmartHR - HRMS, Payroll, and HR Project Management Mobile Template (Framework7 + Bootstrap + PWA)",
        sales: 293,
        stars: 4,
        reviews: 5,
        price: "$24",
      },
    ];

    const visible = ref(false);
    const lightboxIndex = ref(0);

    const openLightbox = (index) => {
      lightboxIndex.value = index;
      visible.value = true;
    };

    const closeLightbox = () => {
      visible.value = false;
    };

    const imageUrls = computed(() => {
      return images.map((image) => getMediaImageUrl(image));
    });

    return {
      images,
      searchResults,
      visible,
      lightboxIndex,
      openLightbox,
      closeLightbox,
      imageUrls,
    };
  },
  data() {
    return {
      title: "Search Result",
      text: "Pages",
      text1: "Search Result",
    };
  },
  methods: {
    toggleHeader() {
      const headerCollapse = document.getElementById("collapse-header");
      headerCollapse.classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

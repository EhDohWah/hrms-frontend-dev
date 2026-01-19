<template>
  <div class="col-xl-3 theiaStickySidebar">
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-column list-group settings-list">
          <router-link
            to="/website-settings/bussiness-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/website-settings/bussiness-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Business Settings
          </router-link>

          <router-link
            to="/website-settings/seo-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/website-settings/seo-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            SEO Settings
          </router-link>

          <router-link
            to="/website-settings/localization-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/website-settings/localization-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Localization
          </router-link>

          <router-link
            to="/website-settings/prefixes"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/website-settings/prefixes')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Prefixes
          </router-link>

          <router-link
            to="/website-settings/preferences"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/website-settings/preferences')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Preferences
          </router-link>

          <router-link
            to="/website-settings/appearance"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/website-settings/appearance')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Appearance
          </router-link>

          <router-link
            to="/website-settings/language"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/website-settings/language')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Language
          </router-link>

          <router-link
            to="/website-settings/authentication-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/website-settings/authentication-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Authentication Settings
          </router-link>

          <router-link
            to="/website-settings/ai-settings"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <!-- Render the <i> tag only when the "AI Settings" route is active -->
            <i
              v-if="isActive('/website-settings/ai-settings')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            AI Settings
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    isActive(path) {
      return this.$route.path === path;
    },
  },
};
</script>

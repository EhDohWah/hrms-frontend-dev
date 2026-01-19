<template>
  <div class="col-xl-3 theiaStickySidebar">
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-column list-group settings-list">
          <router-link
            to="/financial-settings/payment-gateways"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/financial-settings/payment-gateways')"
              class="ti ti-arrow-badge-right me-2"
            ></i
            >Payment Gateways</router-link
          >
          <router-link
            to="/financial-settings/tax-rates"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/financial-settings/tax-rates')"
              class="ti ti-arrow-badge-right me-2"
            ></i>
            Tax Rates</router-link
          >
          <router-link
            to="/financial-settings/currencies"
            class="d-inline-flex align-items-center rounded py-2 px-3"
            active-class="active"
            exact-active-class="active"
          >
            <i
              v-if="isActive('/financial-settings/currencies')"
              class="ti ti-arrow-badge-right me-2"
            ></i
            >Currencies</router-link
          >
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

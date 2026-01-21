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
        <financial-sidebar></financial-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-body pb-1">
              <div class="border-bottom mb-3 pb-3">
                <h4>Payment Gateways</h4>
              </div>
              <form @submit.prevent="submitForm">
                <div class="row">
                  <div class="col-xxl-6 col-xl-6 d-flex">
                    <div class="card mb-3 flex-fill">
                      <div
                        class="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0"
                      >
                        <span
                          class="d-inline-flex align-items-center justify-content-center border rounded p-2"
                          ><img
                            src="@/assets/img/payment-gateway/payment-gateway-01.svg"
                            alt="Img"
                        /></span>
                        <div class="d-flex align-items-center">
                          <div class="status-toggle modal-status">
                            <input type="checkbox" id="user1" class="check" checked />
                            <label for="user1" class="checktoggle"> </label>
                          </div>
                        </div>
                      </div>
                      <div class="card-body pt-0">
                        <p>
                          PayPal is the faster, safer way to send and receive money or
                          make an online payment.
                        </p>
                      </div>
                      <div
                        class="card-footer d-flex align-items-center justify-content-between"
                      >
                        <a
                          href="javascript:void(0);"
                          class="btn btn-sm btn-outline-dark rounded"
                        >
                          <i class="ti ti-checks me-2"></i>Connected</a
                        >
                        <a
                          href="javascript:void(0);"
                          data-bs-toggle="modal"
                          data-bs-target="#connect_payment"
                          ><i class="ti ti-settings fs-24 fw-normal"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                  <div class="col-xxl-6 col-xl-6 d-flex">
                    <div class="card mb-3 flex-fill">
                      <div
                        class="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0"
                      >
                        <span
                          class="d-inline-flex align-items-center justify-content-center border rounded p-2"
                          ><img
                            src="@/assets/img/payment-gateway/payment-gateway-02.svg"
                            alt="Img"
                        /></span>
                        <div class="d-flex align-items-center">
                          <div class="status-toggle modal-status">
                            <input type="checkbox" id="user2" class="check" />
                            <label for="user2" class="checktoggle"> </label>
                          </div>
                        </div>
                      </div>
                      <div class="card-body pt-0">
                        <p>
                          APIs to accept credit cards, manage subscriptions, send money.
                        </p>
                      </div>
                      <div
                        class="card-footer d-flex align-items-center justify-content-between"
                      >
                        <a
                          href="javascript:void(0);"
                          class="btn btn-sm btn-outline-dark rounded"
                        >
                          <i class="ti ti-checks me-2"></i>Connected</a
                        >
                        <a
                          href="javascript:void(0);"
                          data-bs-toggle="modal"
                          data-bs-target="#connect_payment"
                          ><i class="ti ti-settings fs-24 fw-normal"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                  <div class="col-xxl-6 col-xl-6 d-flex">
                    <div class="card mb-3 flex-fill">
                      <div
                        class="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0"
                      >
                        <span
                          class="d-inline-flex align-items-center justify-content-center border rounded p-2"
                          ><img
                            src="@/assets/img/payment-gateway/payment-gateway-03.svg"
                            alt="Img"
                        /></span>
                        <div class="d-flex align-items-center">
                          <div class="status-toggle modal-status">
                            <input type="checkbox" id="user6" class="check" />
                            <label for="user6" class="checktoggle"> </label>
                          </div>
                        </div>
                      </div>
                      <div class="card-body pt-0">
                        <p>
                          Allows send international money transfers and payments quickly
                          with low fees.
                        </p>
                      </div>
                      <div
                        class="card-footer d-flex align-items-center justify-content-between"
                      >
                        <a
                          href="javascript:void(0);"
                          class="btn btn-sm btn-outline-dark rounded"
                        >
                          <i class="ti ti-checks me-2"></i>Connected</a
                        >
                        <a
                          href="javascript:void(0);"
                          data-bs-toggle="modal"
                          data-bs-target="#connect_payment"
                          ><i class="ti ti-settings fs-24 fw-normal"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                  <div class="col-xxl-6 col-xl-6 d-flex">
                    <div class="card mb-3 flex-fill">
                      <div
                        class="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0"
                      >
                        <span
                          class="d-inline-flex align-items-center justify-content-center border rounded p-2"
                          ><img
                            src="@/assets/img/payment-gateway/payment-gateway-04.svg"
                            alt="Img"
                        /></span>
                        <div class="d-flex align-items-center">
                          <div class="status-toggle modal-status">
                            <input type="checkbox" id="user10" class="check" />
                            <label for="user10" class="checktoggle"> </label>
                          </div>
                        </div>
                      </div>
                      <div class="card-body pt-0">
                        <p>
                          Paytm stands for Pay through mobile and it is India's largest
                          mobile payments.
                        </p>
                      </div>
                      <div
                        class="card-footer d-flex align-items-center justify-content-between"
                      >
                        <a
                          href="javascript:void(0);"
                          class="btn btn-sm btn-outline-dark rounded"
                        >
                          <i class="ti ti-checks me-2"></i>Connected</a
                        >
                        <a
                          href="javascript:void(0);"
                          data-bs-toggle="modal"
                          data-bs-target="#connect_payment"
                          ><i class="ti ti-settings fs-24 fw-normal"></i
                        ></a>
                      </div>
                    </div>
                  </div>
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
  <!-- Add Payment Gateway -->
  <div class="modal fade" id="connect_payment">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Paypal</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Api Client ID</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Email Address"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Api Client Secret</label>
                  <input type="text" class="form-control" placeholder="Enter API Key" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a
              href="javascript:void(0);"
              class="btn btn-light me-2"
              data-bs-dismiss="modal"
              >Cancel</a
            >
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Payment Gateway -->
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
      this.$router.push("/financial-setting/payment-gateways");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

<script>
export default {
  data() {
    return {
      showPassword: false,
    };
  },
  computed: {
    buttonLabel() {
      return this.showPassword ? "Hide" : "Show";
    },
  },
  mounted() {
    this.updateBodyClass();
  },
  watch: {
    // Watch for route changes
    $route() {
      this.updateBodyClass();
    },
  },
  methods: {
    updateBodyClass() {
      if (this.$route.path.includes("/lock-screen")) {
        document.body.classList.add("bg-linear-gradiant");
      } else {
        document.body.classList.remove("bg-linear-gradiant");
      }
    },
    submitForm() {
      this.$router.push("/dashboard/");
    },
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <form @submit.prevent="submitForm">
          <div class="d-flex flex-column justify-content-between vh-100">
            <div class="mx-auto p-4 text-center">
              <img src="@/assets/img/logo.svg" class="img-fluid" alt="Logo" />
            </div>
            <div class="card border-primary">
              <div class="card-body bg-primary bg-opacity-10 rounded p-4">
                <div class="mb-4 text-center">
                  <h2 class="mb-2">Welcome back!</h2>
                  <img
                    src="@/assets/img/profiles/avatar-12.jpg"
                    alt="img"
                    class="img-fluid avatar avatar-xxl rounded-pill my-3"
                  />
                  <h6 class="text-dark">Adrian Davies</h6>
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <div class="pass-group">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="pass-input form-control"
                    />
                    <span
                      @click="toggleShow"
                      class="ti toggle-password"
                      :class="{
                        'ti-eye': showPassword,
                        'ti-eye-off': !showPassword,
                      }"
                    ></span>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100">Sign In</button>
              </div>
            </div>
            <div class="p-4 text-center">
              <div class="d-flex justify-content-center">
                <a href="javascript:void(0);" class="me-3 text-gray-9"
                  >Terms & Condition</a
                >
                <a href="javascript:void(0);" class="me-3 text-gray-9">Privacy</a>
                <a href="javascript:void(0);" class="me-3 text-gray-9">Help</a>
              </div>
              <div class="p-2 text-center">
                <p class="mb-0 text-gray-9">
                  Copyright &copy; {{ new Date().getFullYear() }} - SmartHR
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

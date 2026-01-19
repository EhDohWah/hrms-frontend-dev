<script>
export default {
  data() {
    return {
      showPassword: false,
      showPassword1: false,
    };
  },
  mounted() {
    this.updateBodyClass();
  },
  computed: {
    buttonLabel() {
      return this.showPassword ? "Hide" : "Show";
    },
    buttonLabel1() {
      return this.showPassword1 ? "Hide" : "Show";
    },
  },
  watch: {
    // Watch for route changes
    $route() {
      this.updateBodyClass();
    },
  },
  methods: {
    updateBodyClass() {
      if (this.$route.path.includes("/reset-password-3")) {
        document.body.classList.add("bg-linear-gradiant");
      } else {
        document.body.classList.remove("bg-linear-gradiant");
      }
    },
    submitForm() {
      this.$router.push("/success-3");
    },
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    toggleShow1() {
      this.showPassword1 = !this.showPassword1;
    },
  },
};
</script>

<template>
  <div class="container-fuild">
    <div class="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
      <div
        class="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap"
      >
        <div class="col-md-4 mx-auto p-4">
          <form @submit.prevent="submitForm">
            <div class="mx-auto mb-5 text-center">
              <img src="@/assets/img/logo.svg" class="img-fluid" alt="Logo" />
            </div>
            <div class="">
              <div class="text-center mb-3">
                <h2 class="mb-2">Reset Password</h2>
                <p class="mb-0">
                  Your new password must be different from previous used passwords.
                </p>
              </div>
              <div>
                <div class="input-block mb-3">
                  <div class="mb-3">
                    <label class="form-label">Password</label>
                    <div class="pass-group" id="passwordInput">
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
                  <div class="password-strength d-flex" id="passwordStrength">
                    <span id="poor"></span>
                    <span id="weak"></span>
                    <span id="strong"></span>
                    <span id="heavy"></span>
                  </div>
                  <div id="passwordInfo" class="mb-2"></div>
                  <p class="fs-12">
                    Use 8 or more characters with a mix of letters, numbers & symbols.
                  </p>
                </div>
                <div class="mb-3">
                  <label class="form-label">Confirm Password</label>
                  <div class="pass-group">
                    <input
                      :type="showPassword1 ? 'text' : 'password'"
                      class="pass-inputs form-control"
                    />
                    <span
                      @click="toggleShow1"
                      class="ti toggle-passwords"
                      :class="{
                        'ti-eye': showPassword1,
                        'ti-eye-off': !showPassword1,
                      }"
                    ></span>
                  </div>
                </div>
                <div class="mb-3">
                  <button type="submit" class="btn btn-primary w-100">Submit</button>
                </div>
              </div>
              <div class="mt-5 text-center">
                <p class="mb-0 text-gray-9">
                  Copyright &copy; {{ new Date().getFullYear() }} - Smarthr
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

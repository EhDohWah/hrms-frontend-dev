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
      if (this.$route.path.includes("/register-2")) {
        document.body.classList.add("bg-white");
      } else {
        document.body.classList.remove("bg-white");
      }
    },
    submitForm() {
      this.$router.push("/login-2");
    },
  },
};
</script>

<template>
  <div class="container-fuild">
    <div class="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
      <div class="row">
        <div class="col-lg-5">
          <div
            class="d-lg-flex align-items-center justify-content-center d-none flex-wrap vh-100 bg-primary-transparent"
          >
            <div>
              <img src="@/assets/img/bg/authentication-bg-02.svg" alt="Img" />
            </div>
          </div>
        </div>
        <div class="col-lg-7 col-md-12 col-sm-12">
          <div
            class="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap"
          >
            <div class="col-md-7 mx-auto p-4">
              <form @submit.prevent="submitForm">
                <div>
                  <div class="mx-auto mb-5 text-center">
                    <img src="@/assets/img/logo.svg" class="img-fluid" alt="Logo" />
                  </div>
                  <div class="">
                    <div class="text-center mb-3">
                      <h2 class="mb-2">Sign Up</h2>
                      <p class="mb-0">Please enter your details to sign up</p>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Name</label>
                      <div class="input-group">
                        <input type="text" value="" class="form-control border-end-0" />
                        <span class="input-group-text border-start-0">
                          <i class="ti ti-user"></i>
                        </span>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Email Address</label>
                      <div class="input-group">
                        <input type="text" value="" class="form-control border-end-0" />
                        <span class="input-group-text border-start-0">
                          <i class="ti ti-mail"></i>
                        </span>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Password</label>
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
                    <div class="d-flex align-items-center justify-content-between mb-3">
                      <div class="d-flex align-items-center">
                        <div class="form-check form-check-md mb-0">
                          <input
                            class="form-check-input"
                            id="remember_me"
                            type="checkbox"
                          />
                          <label for="remember_me" class="form-check-label text-dark mt-0"
                            >Agree to
                            <span class="text-primary">Terms & Privacy</span></label
                          >
                        </div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <button type="submit" class="btn btn-primary w-100">Sign Up</button>
                    </div>
                    <div class="text-center">
                      <h6 class="fw-normal text-dark mb-0">
                        Already have an account?
                        <router-link to="login-2" class="hover-a">Sign In</router-link>
                      </h6>
                    </div>
                    <div class="login-or">
                      <span class="span-or">Or</span>
                    </div>
                    <div class="mt-2">
                      <div
                        class="d-flex align-items-center justify-content-center flex-wrap"
                      >
                        <div class="text-center me-2 flex-fill">
                          <a
                            href="javascript:void(0);"
                            class="br-10 p-2 btn btn-info d-flex align-items-center justify-content-center"
                          >
                            <img
                              class="img-fluid m-1"
                              src="@/assets/img/icons/facebook-logo.svg"
                              alt="Facebook"
                            />
                          </a>
                        </div>
                        <div class="text-center me-2 flex-fill">
                          <a
                            href="javascript:void(0);"
                            class="br-10 p-2 btn btn-outline-light border d-flex align-items-center justify-content-center"
                          >
                            <img
                              class="img-fluid m-1"
                              src="@/assets/img/icons/google-logo.svg"
                              alt="Facebook"
                            />
                          </a>
                        </div>
                        <div class="text-center flex-fill">
                          <a
                            href="javascript:void(0);"
                            class="bg-dark br-10 p-2 btn btn-dark d-flex align-items-center justify-content-center"
                          >
                            <img
                              class="img-fluid m-1"
                              src="@/assets/img/icons/apple-logo.svg"
                              alt="Apple"
                            />
                          </a>
                        </div>
                      </div>
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
    </div>
  </div>
</template>

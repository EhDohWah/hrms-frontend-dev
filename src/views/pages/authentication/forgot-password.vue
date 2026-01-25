<script>
import { ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { authService } from '@/services/auth.service';

export default {
  setup() {
    const loading = ref(false);
    const message = ref('');
    const error = ref('');
    const secondsRemaining = ref(0);

    const formData = reactive({
      email: ''
    });

    const rules = {
      email: { required, email }
    };

    const v$ = useVuelidate(rules, formData);

    return {
      formData,
      loading,
      message,
      error,
      secondsRemaining,
      v$
    };
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
      if (this.$route.path.includes("/forgot-password")) {
        document.body.classList.add("bg-white");
      } else {
        document.body.classList.remove("bg-white");
      }
    },
    async submitForm() {
      try {
        const result = await this.v$.$validate();
        if (!result) return;

        this.loading = true;
        this.message = '';
        this.error = '';
        this.secondsRemaining = 0;

        const response = await authService.forgotPassword(this.formData.email);
        
        this.message = response.message || 'We have emailed your password reset link!';
        
        // Reset form
        this.formData.email = '';
        this.v$.$reset();
        
        setTimeout(() => {
          this.$router.push('/login');
        }, 5000);
      } catch (err) {
        console.error('Forgot password error:', err);
        
        // Rate limit error (429)
        if (err.response?.status === 429) {
          this.error = err.response.data.message || 'Too many requests. Please wait before trying again.';
          
          // Extract seconds from error message if available
          const match = err.response.data.message?.match(/(\d+) seconds/);
          if (match) {
            this.secondsRemaining = parseInt(match[1]);
            const countdown = setInterval(() => {
              this.secondsRemaining--;
              if (this.secondsRemaining <= 0) {
                clearInterval(countdown);
              }
            }, 1000);
          }
        }
        // Bad request error (400) - inactive account
        else if (err.response?.status === 400) {
          this.error = err.response.data.message || 'Unable to send reset link. Please contact the administrator.';
        }
        // Validation error (422)
        else if (err.response?.status === 422) {
          const errors = err.response.data.errors || {};
          this.error = errors.email?.[0] 
            || err.response.data.message 
            || 'Please enter a valid email address.';
        }
        // Network or connection error
        else if (!err.response) {
          this.error = 'Unable to connect to the server. Please check your internet connection and try again.';
        }
        // Other errors
        else {
          this.error = err.response?.data?.message || 'Failed to send reset link. Please try again later.';
        }
      } finally {
        this.loading = false;
      }
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
            class="login-background position-relative d-lg-flex align-items-center justify-content-center d-none flex-wrap vh-100">
            <!-- Add picture for background -->

            <!-- Overlay -->
          </div>
        </div>

        <div class="col-lg-7 col-md-12 col-sm-12">
          <div class="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
            <div class="col-md-7 mx-auto p-4 d-flex flex-column">
              <!-- Form with @submit.prevent -->
              <div class="flex-grow-1 d-flex flex-column">
                <div class="mx-auto mb-5 text-center">
                  <!-- Custom Logo Box -->
                  <div class="login-logo-box">
                    <h1 class="login-logo-title">HRMS</h1>
                    <span class="login-logo-tagline">SMRU / BHF</span>
                  </div>
                </div>

                <form @submit.prevent="submitForm" class="flex-grow-1 d-flex flex-column">
                  <div class="flex-grow-1">
                    <div class="text-center mb-3">
                      <h2 class="mb-2">Forgot Password?</h2>
                      <p class="mb-0">Enter your email and we'll send you instructions to reset your password.</p>
                    </div>

                    <!-- Success Message -->
                    <div v-if="message" class="alert alert-success alert-dismissible fade show" role="alert">
                      {{ message }}
                      <button type="button" class="btn-close" @click="message = ''"></button>
                    </div>

                    <!-- Error Message -->
                    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                      {{ error }}
                      <div v-if="secondsRemaining > 0" class="mt-2">
                        Please try again in {{ secondsRemaining }} seconds
                      </div>
                      <button type="button" class="btn-close" @click="error = ''"></button>
                    </div>

                    <!-- Email Input -->
                    <div class="mb-3">
                      <label class="form-label">Email Address</label>
                      <div class="input-group" :class="{ 'is-invalid': v$.email.$error }">
                        <input 
                          type="email" 
                          v-model="formData.email"
                          class="form-control" 
                          :class="{ 'is-invalid': v$.email.$error }"
                          :disabled="loading"
                        />
                        <span class="input-group-text">
                          <i class="ti ti-mail"></i>
                        </span>
                      </div>
                      <div class="invalid-feedback" v-if="v$.email.$error">
                        {{ v$.email.$errors[0].$message }}
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <button 
                      type="submit" 
                      class="btn btn-primary w-100 mb-3"
                      :disabled="loading || secondsRemaining > 0"
                    >
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ loading ? 'Sending...' : 'Send Reset Link' }}
                    </button>

                    <!-- Back to Login Link -->
                    <div class="text-center">
                      <h6 class="fw-normal text-dark mb-0">
                        Return to
                        <router-link to="/login" class="text-primary">Sign In</router-link>
                      </h6>
                    </div>
                  </div>
                </form>
              </div>

              <!-- Footer with logos -->
              <div class="footer mt-4">
                <div class="d-flex justify-content-center align-items-center">
                  <img src="@/assets/img/smru-logo.png" alt="SMRU Logo" class="me-4" style="max-height: 50px;" />
                  <img src="@/assets/img/bhf-logo.png" alt="BHF Logo" style="max-height: 50px;" />
                </div>
                <div class="text-center mt-2">
                  <small class="text-muted">&copy; {{ new Date().getFullYear() }} SMRU/BHF HR Management System</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-group-text {
  cursor: pointer;
}

.invalid-feedback {
  display: block;
}

/* Auth links - underline on hover for better UX */
.text-primary {
  text-decoration: none;
  transition: text-decoration 0.2s ease;
}

.text-primary:hover {
  text-decoration: underline;
}
</style>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { authService } from '@/services/auth.service';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const message = ref('');
    const error = ref('');
    const showPassword = ref(false);
    const showPasswordConfirm = ref(false);

    const formData = reactive({
      token: '',
      email: '',
      password: '',
      password_confirmation: ''
    });

    // Password strength validator matching backend requirements
    const passwordStrengthValidator = (value) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      if (!regex.test(value)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
      }
      return true;
    };

    const rules = {
      password: { 
        required, 
        minLength: minLength(8),
        passwordStrength: passwordStrengthValidator
      },
      password_confirmation: { 
        required,
        sameAs: (value) => value === formData.password || 'Passwords must match'
      }
    };

    const v$ = useVuelidate(rules, formData);

    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const email = urlParams.get('email');

      if (!token || !email) {
        error.value = 'Invalid or expired password reset link. Please request a new one.';
        setTimeout(() => {
          router.push('/forgot-password');
        }, 3000);
        return;
      }

      // Decode and validate email
      try {
        const decodedEmail = decodeURIComponent(email);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(decodedEmail)) {
          throw new Error('Invalid email format');
        }
        formData.email = decodedEmail;
      } catch (e) {
        error.value = 'Invalid email in reset link. Please request a new password reset.';
        setTimeout(() => {
          router.push('/forgot-password');
        }, 3000);
        return;
      }

      // Validate token - must be 64 alphanumeric characters (Laravel Str::random format)
      if (!/^[A-Za-z0-9]{64}$/.test(token)) {
        error.value = 'Invalid reset token format. Please request a new password reset.';
        setTimeout(() => {
          router.push('/forgot-password');
        }, 3000);
        return;
      }

      formData.token = token;
    });

    const submitForm = async () => {
      try {
        const result = await v$.value.$validate();
        if (!result) {
          // Show validation errors
          error.value = 'Please fix the validation errors before submitting.';
          return;
        }

        loading.value = true;
        message.value = '';
        error.value = '';

        const response = await authService.resetPassword({
          token: formData.token,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        });
        
        message.value = response.message || 'Your password has been reset successfully! Redirecting to login...';
        
        // Clear form fields for security
        formData.password = '';
        formData.password_confirmation = '';
        
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        console.error('Reset password error:', err);
        
        // Validation error (422)
        if (err.response?.status === 422) {
          const errors = err.response.data.errors || {};
          const errorMessages = Object.values(errors)
            .flat()
            .filter(msg => msg)
            .join('. ');
          error.value = errorMessages || err.response.data.message || 'Please check your input and try again.';
        } 
        // Invalid/expired token error (400)
        else if (err.response?.status === 400) {
          const errorMessage = err.response.data.message || 'Invalid or expired reset token.';
          error.value = errorMessage;
          
          // Redirect to forgot password after 5 seconds for expired/invalid tokens
          if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('invalid')) {
            setTimeout(() => {
              router.push('/forgot-password');
            }, 5000);
          }
        } 
        // Network or connection error
        else if (!err.response) {
          error.value = 'Unable to connect to the server. Please check your internet connection and try again.';
        } 
        // Other errors
        else {
          error.value = err.response?.data?.message || 'Failed to reset password. Please try again later.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      message,
      error,
      showPassword,
      showPasswordConfirm,
      v$,
      submitForm
    };
  },
  mounted() {
    this.updateBodyClass();
  },
  watch: {
    $route() {
      this.updateBodyClass();
    }
  },
  methods: {
    updateBodyClass() {
      if (this.$route.path.includes("/reset-password")) {
        document.body.classList.add("bg-white");
      } else {
        document.body.classList.remove("bg-white");
      }
    },
    togglePasswordVisibility(field) {
      if (field === 'password') {
        this.showPassword = !this.showPassword;
      } else {
        this.showPasswordConfirm = !this.showPasswordConfirm;
      }
    }
  }
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
                      <h2 class="mb-2">Reset Password</h2>
                      <p class="mb-0">Your new password must be different from previously used passwords.</p>
                    </div>

                    <!-- Success Message -->
                    <div v-if="message" class="alert alert-success alert-dismissible fade show" role="alert">
                      {{ message }}
                      <button type="button" class="btn-close" @click="message = ''"></button>
                    </div>

                    <!-- Error Message -->
                    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                      {{ error }}
                      <button type="button" class="btn-close" @click="error = ''"></button>
                    </div>

                    <!-- New Password Input -->
                    <div class="mb-3">
                      <label class="form-label">New Password</label>
                      <div class="input-group" :class="{ 'is-invalid': v$.password.$error }">
                        <input
                          :type="showPassword ? 'text' : 'password'"
                          v-model="formData.password"
                          class="form-control"
                          :class="{ 'is-invalid': v$.password.$error }"
                          :disabled="loading"
                        />
                        <span class="input-group-text">
                          <i 
                            @click="togglePasswordVisibility('password')"
                            class="ti"
                            :class="{
                              'ti-eye': showPassword,
                              'ti-eye-off': !showPassword,
                            }"
                            style="cursor: pointer;"
                          ></i>
                        </span>
                      </div>
                      <div class="invalid-feedback" v-if="v$.password.$error">
                        Password must be at least 8 characters with uppercase, lowercase, number and special character.
                      </div>
                    </div>

                    <!-- Confirm Password Input -->
                    <div class="mb-3">
                      <label class="form-label">Confirm Password</label>
                      <div class="input-group" :class="{ 'is-invalid': v$.password_confirmation.$error }">
                        <input
                          :type="showPasswordConfirm ? 'text' : 'password'"
                          v-model="formData.password_confirmation"
                          class="form-control"
                          :class="{ 'is-invalid': v$.password_confirmation.$error }"
                          :disabled="loading"
                        />
                        <span class="input-group-text">
                          <i 
                            @click="togglePasswordVisibility('confirm')"
                            class="ti"
                            :class="{
                              'ti-eye': showPasswordConfirm,
                              'ti-eye-off': !showPasswordConfirm,
                            }"
                            style="cursor: pointer;"
                          ></i>
                        </span>
                      </div>
                      <div class="invalid-feedback" v-if="v$.password_confirmation.$error">
                        Passwords must match
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ loading ? 'Resetting Password...' : 'Reset Password' }}
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
</style>

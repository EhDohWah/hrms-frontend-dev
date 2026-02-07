<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const showPassword = ref(false);
const isLoading = ref(false);
const loginError = ref(null);

const formData = reactive({
  email: '',
  password: '',
  remember_me: false
});

const rules = {
  email: {
    required,
    email,
    $autoDirty: true
  },
  password: {
    required,
    minLength: minLength(6),
    $autoDirty: true,
  }
};

const v$ = useVuelidate(rules, formData);

// Check for existing authentication on mount
// NOTE: Token is in HttpOnly cookie, we check user data presence for auth state
onMounted(() => {
  const user = localStorage.getItem('user');
  if (user) {
    verifySession();
  }
});

// Verify if the current session is valid with the backend
// Token is in HttpOnly cookie, sent automatically
const verifySession = async () => {
  try {
    // Call verify endpoint - cookie is sent automatically
    const response = await authService.verifyToken();
    if (response.valid) {
      // Session is valid, redirect to dashboard
      const authStore = useAuthStore();
      const redirectPath = authStore.getRedirectPath();
      await router.replace(redirectPath);
    } else {
      // Session invalid, clear user data (cookie will be cleared by backend)
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('permissions');
      localStorage.removeItem('tokenExpiration');
    }
  } catch {
    // Error verifying, clear local data
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('permissions');
    localStorage.removeItem('tokenExpiration');
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  try {
    loginError.value = null;
    const result = await v$.value.$validate();
    if (!result) return;

    isLoading.value = true;
    const authStore = useAuthStore();
    const response = await authStore.login(formData);

    if (response.success) {
      // Echo initialization is handled by the router guard (guards.js) on first authenticated navigation.
      // The guard checks isEchoInitialized() and calls initEcho() + sets up channel listeners once.
      // Doing it here would cause duplicate broadcasting/auth calls and prevent the guard from
      // setting up permission/profile listeners.

      // Check for intended route (saved by authGuard when user tried to access protected route)
      const intendedRoute = localStorage.getItem('intendedRoute');
      if (intendedRoute) {
        await router.replace(intendedRoute);
        localStorage.removeItem('intendedRoute');
      } else {
        const redirectPath = authStore.getRedirectPath();
        await router.replace(redirectPath);
      }

    } else if (response.error && response.error.includes('Unauthenticated.')) {
      loginError.value = 'Invalid email or password';
    } else {
      loginError.value = response.error;
    }
  } catch (error) {
    // Handle error based on type from backend or error object
    if (error.response?.data?.error_type) {
      loginError.value = error.response.data.message;
    } else if (error.type === 'AUTH_ERROR') {
      loginError.value = 'Invalid email or password';
    } else if (error.type === 'VALIDATION_ERROR' && error.errors) {
      loginError.value = Object.values(error.errors).flat().join(', ');
    } else if (error.type === 'NETWORK_ERROR' || error.message === 'Network Error: Server is not responding') {
      loginError.value = 'Unable to connect to the server. Please check your connection.';
    } else if (error.type === 'RATE_LIMIT_ERROR') {
      loginError.value = 'Too many login attempts. Please try again later.';
    } else if (error.response?.data?.message) {
      loginError.value = error.response.data.message;
    } else if (error.message) {
      loginError.value = error.message;
    } else {
      loginError.value = 'An unexpected error occurred';
    }
  } finally {
    isLoading.value = false;
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
            
            <!-- Brand Title Section -->
            <div class="login-brand-section">
              <h1 class="login-brand-title">HR Management System</h1>
              <div class="login-brand-divider"></div>
              <p class="login-brand-subtitle">SMRU / BHF</p>
            </div>

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


                <form @submit.prevent="handleLogin" class="flex-grow-1 d-flex flex-column">
                  <div class="flex-grow-1">
                    <div class="text-center mb-3">
                      <h2 class="mb-2">Sign In</h2>
                      <p class="mb-0">Please enter your details to sign in</p>
                    </div>

                    <!-- Error Alert -->
                    <div v-if="loginError" class="alert alert-danger alert-dismissible fade show" role="alert">
                      {{ loginError }}
                      <button type="button" class="btn-close" @click="loginError = null"></button>
                    </div>

                    <!-- Email Input -->
                    <div class="mb-3">
                      <label class="form-label">Email Address</label>
                      <div class="input-group" :class="{ 'is-invalid': v$.email.$error }">
                        <input type="email" v-model="formData.email" class="form-control form-control-login"
                          :class="{ 'is-invalid': v$.email.$error }" />
                        <span class="input-group-text">
                          <i class="ti ti-mail"></i>
                        </span>
                      </div>
                      <div class="invalid-feedback" v-if="v$.email.$error">
                        {{ v$.email.$errors[0].$message }}
                      </div>
                    </div>

                    <!-- Password Input -->
                    <div class="mb-3">
                      <label class="form-label">Password</label>
                      <div class="input-group" :class="{ 'is-invalid': v$.password.$error }">
                        <input :type="showPassword ? 'text' : 'password'" v-model="formData.password"
                          class="form-control form-control-login" :class="{ 'is-invalid': v$.password.$error }" />
                        <span class="input-group-text">
                          <i @click="togglePassword" class="ti" :class="{
                            'ti-eye': showPassword,
                            'ti-eye-off': !showPassword,
                          }" style="cursor: pointer;"></i>
                        </span>
                      </div>
                      <div class="invalid-feedback" v-if="v$.password.$error">
                        {{ v$.password.$errors[0].$message }}
                      </div>
                    </div>

                    <!-- Remember Me & Forgot Password -->
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="remember" v-model="formData.remember_me">
                        <label class="form-check-label" for="remember">Remember me</label>
                      </div>
                      <router-link to="/forgot-password" class="text-primary">Forgot Password?</router-link>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-primary btn-login w-100 mb-3" :disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ isLoading ? 'Signing in...' : 'Sign In' }}
                    </button>
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
                  <small class="text-muted">&copy; 2026 SMRU/BHF HR Management System</small>
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
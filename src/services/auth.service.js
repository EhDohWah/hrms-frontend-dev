import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { getEcho } from '@/plugins/echo';

// Storage keys
// NOTE: Token is stored in HttpOnly cookie (not in localStorage) for XSS protection
const STORAGE_KEYS = {
  TOKEN: 'token', // DEPRECATED: Kept for clearing legacy storage only
  USER: 'user',
  USER_ROLE: 'userRole',
  PERMISSIONS: 'permissions',
  TOKEN_EXPIRATION: 'tokenExpiration', // Tracks expiration for proactive refresh
};

class AuthService {
  constructor() {
    // NOTE: Token is now stored in HttpOnly cookie by the backend
    // We no longer store or manage tokens in JavaScript for XSS protection
    this.user = this.getStorageItem(STORAGE_KEYS.USER, true);
    this.tokenTimer = null;
    this.initTokenCheck();
  }

  // ----------------------
  // Storage Helper Methods
  // ----------------------
  getStorageItem(key, parse = false) {
    const value = localStorage.getItem(key);
    return parse && value ? JSON.parse(value) : value;
  }

  setStorageItem(key, value) {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  }

  removeStorageItem(key) {
    localStorage.removeItem(key);
  }

  // -------------------------
  // Token Expiration Handling
  // -------------------------
  initTokenCheck() {
    const expiration = this.getStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION);
    if (expiration) {
      const timeLeft = Number(expiration) - Date.now();
      if (timeLeft > 0) {
        this.setTokenTimer(timeLeft);
      } else {
        this.logout();
      }
    }
  }

  setTokenTimer(duration) {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }
    this.tokenTimer = setTimeout(() => this.logout(), duration);
  }

  // -------------------------
  // Authentication Utilities
  // -------------------------
  // Returns the primary role (assumes first role is primary)
  getPrimaryRole(roles) {
    if (!roles?.length) return null;
    return roles[0].name.toLowerCase();
  }

  // Sets authentication data from API response
  setAuthData(response) {
    if (!response || !response.user) return false;

    // Clear any existing authentication data
    this.clearAuthData();

    // NOTE: Token is now stored in HttpOnly cookie by the backend
    // We no longer store tokens in localStorage for XSS protection

    // Save user data and role information if available
    if (response.user) {
      if (response.user.roles && response.user.roles.length > 0) {
        const userRole = this.getPrimaryRole(response.user.roles);
        this.setStorageItem(STORAGE_KEYS.USER_ROLE, userRole);
      }
      this.setStorageItem(STORAGE_KEYS.USER, response.user);
      this.user = response.user;

      // Save permissions if available
      if (response.user.permissions) {
        this.setStorageItem(STORAGE_KEYS.PERMISSIONS, response.user.permissions);
      }
    }

    // Set token expiration using response.expires_in (if provided) or default to 6 hours
    const expiresIn = response.expires_in ? response.expires_in * 1000 : 6 * 60 * 60 * 1000;
    const expirationTime = Date.now() + expiresIn;
    this.setStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationTime.toString());
    this.setTokenTimer(expiresIn);

    return true;
  }

  // Clears all authentication-related data
  clearAuthData() {
    // Clear localStorage items (token is in HttpOnly cookie, cleared by backend)
    const keysToRemove = [STORAGE_KEYS.USER, STORAGE_KEYS.USER_ROLE, STORAGE_KEYS.PERMISSIONS, STORAGE_KEYS.TOKEN_EXPIRATION];
    keysToRemove.forEach((key) => this.removeStorageItem(key));
    // Also remove legacy token key if it exists
    this.removeStorageItem(STORAGE_KEYS.TOKEN);

    // NOTE: DO NOT clear 'intendedRoute' here!
    // It needs to persist through the login process for post-login redirect
    // It will be cleared in login-index.vue after successful redirect
    this.user = null;
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = null;
    }
  }

  /**
   * Initialize CSRF protection with retry logic and exponential backoff.
   *
   * @param {number} maxAttempts - Maximum number of retry attempts (default: 3)
   * @returns {Promise<boolean>} - True if CSRF was initialized successfully, false otherwise
   */
  async initializeCSRF(maxAttempts = 3) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://hrms-backend-api-v1-main-wrhlmg.laravel.cloud/api/v1';
    // Extract the domain part from the API URL
    const urlObj = new URL(baseUrl);
    const domain = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}`;

    let lastError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(`${domain}/sanctum/csrf-cookie`, {
          credentials: 'include'
        });

        if (response.ok) {
          console.log(`[AuthService] CSRF initialized successfully (attempt ${attempt})`);
          return true;
        }

        // Non-OK response, log and retry
        console.warn(`[AuthService] CSRF initialization returned ${response.status} (attempt ${attempt}/${maxAttempts})`);
        lastError = new Error(`CSRF initialization failed with status ${response.status}`);
      } catch (error) {
        console.warn(`[AuthService] CSRF initialization failed (attempt ${attempt}/${maxAttempts}):`, error.message);
        lastError = error;
      }

      // Wait with exponential backoff before retrying (100ms, 200ms, 400ms...)
      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt - 1) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // All attempts failed
    console.error('[AuthService] CSRF initialization failed after all attempts:', lastError);
    return false;
  }

  // -------------------------
  // API Methods
  // -------------------------
  // Log in the user using provided credentials
  async login(credentials) {
    // Initialize CSRF protection with retry logic
    const csrfInitialized = await this.initializeCSRF();

    if (!csrfInitialized) {
      // CSRF initialization failed after all retries
      // In production, this might indicate server issues
      console.warn('[AuthService] Proceeding with login despite CSRF initialization failure');
      // Continue with login attempt - some API configurations may not require CSRF
      // The server will reject the request if CSRF is actually required
    }

    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      // Check for successful login - user data indicates success
      // Token is now in HttpOnly cookie, not required in response body
      if (response.user || response.success) {
        if (!this.setAuthData(response)) {
          throw new Error('Invalid user data in response');
        }
        return response;
      }
      throw new Error('Login failed: Invalid response from server');
    } catch (error) {
      // Check for CSRF-related errors (419 status)
      if (error.status === 419) {
        console.error('[AuthService] CSRF token mismatch. Retrying CSRF initialization...');
        // Attempt to reinitialize CSRF and retry login once
        const csrfRetried = await this.initializeCSRF(2);
        if (csrfRetried) {
          try {
            const retryResponse = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            if (retryResponse.user || retryResponse.success) {
              if (!this.setAuthData(retryResponse)) {
                throw new Error('Invalid user data in response');
              }
              return retryResponse;
            }
          } catch (retryError) {
            console.error('[AuthService] Login retry after CSRF refresh failed:', retryError);
            this.clearAuthData();
            throw retryError;
          }
        }
      }

      console.error('[AuthService] Login error:', error);
      this.clearAuthData();
      throw error;
    }
  }

  // Register a new user
  async register(userData) {
    return await apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  // Logout the current user
  async logout() {
    try {
      // NOTE: Token is in HttpOnly cookie, sent automatically with credentials: 'include'
      // No need to check or set token manually
      if (this.user) {
        try {
          // Call the logout endpoint - backend will clear the HttpOnly cookie
          await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
          console.warn('Logout API call failed:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Clear auth data regardless of API response
    this.clearAuthData();
    return { success: true };
  }

  // Verify token validity (e.g., before refreshing)
  async verifyToken(token) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH, { token });
      return response;
    } catch (error) {
      console.error('Token verification failed:', error);
      this.clearAuthData();
      return { valid: false };
    }
  }

  // Refresh the token. Backend sets new HttpOnly cookie, we just update expiration tracking.
  async refreshToken() {
    try {
      // NOTE: Token is in HttpOnly cookie, sent automatically with credentials: 'include'
      // Backend will set a new HttpOnly cookie with the refreshed token
      const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH);

      if (response.success || response.user) {
        // Update expiration tracking (token itself is in HttpOnly cookie)
        const expiresIn = response.expires_in ? response.expires_in * 1000 : 6 * 60 * 60 * 1000; // default 6 hours
        const expirationTime = Date.now() + expiresIn;
        this.setStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationTime.toString());
        this.setTokenTimer(expiresIn);

        // Update user data if provided
        if (response.user) {
          this.user = response.user;
          this.setStorageItem(STORAGE_KEYS.USER, response.user);
        }
      }
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
      throw error;
    }
  }

  // Initiate forgot password process
  async forgotPassword(email) {
    return await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  // Reset password using provided data
  async resetPassword(resetData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Verify email with a token
  async verifyEmail(token) {
    return await apiService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }

  // -------------------------
  // Utility Methods
  // -------------------------
  // Check if user is authenticated based on stored user data and expiration
  // NOTE: Actual token is in HttpOnly cookie (browser handles it automatically)
  isAuthenticated() {
    const user = this.getStorageItem(STORAGE_KEYS.USER, true);
    const expiration = this.getStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION);
    if (!user || !expiration) return false;
    return Date.now() < Number(expiration);
  }

  // DEPRECATED: Token is now stored in HttpOnly cookie, not accessible via JavaScript
  // This method is kept for backward compatibility but will always return null
  getToken() {
    console.debug('[AuthService] getToken() called but token is now in HttpOnly cookie');
    return null;
  }

  getCurrentUser() {
    return this.getStorageItem(STORAGE_KEYS.USER, true);
  }

  getCurrentRole() {
    return this.getStorageItem(STORAGE_KEYS.USER_ROLE);
  }

  // All users go to the unified dynamic dashboard
  getRedirectPath(role) {
    return '/dashboard';
  }
}

export const authService = new AuthService();
import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  USER_ROLE: 'userRole',
  PERMISSIONS: 'permissions',
  TOKEN_EXPIRATION: 'tokenExpiration',
};

class AuthService {
  constructor() {
    this.token = this.getStorageItem(STORAGE_KEYS.TOKEN);
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

    // Set token and update API headers
    if (response.access_token) {
      this.token = response.access_token;
      this.setStorageItem(STORAGE_KEYS.TOKEN, response.access_token);
      apiService.setAuthToken(`${response.token_type || 'Bearer'} ${response.access_token}`);
    }

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

    // Set token expiration using response.expires_in (if provided) or default to 24 hours
    const expiresIn = response.expires_in ? response.expires_in * 1000 : 24 * 60 * 60 * 1000;
    const expirationTime = Date.now() + expiresIn;
    this.setStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationTime.toString());
    this.setTokenTimer(expiresIn);

    return true;
  }

  // Clears all authentication-related data
  clearAuthData() {
    Object.values(STORAGE_KEYS).forEach((key) => this.removeStorageItem(key));
    this.token = null;
    this.user = null;
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = null;
    }
    apiService.setAuthToken(null);
  }

  async initializeCSRF() {
    const baseUrl = process.env.VUE_APP_API_BASE_URL || 'https://hrms-backend-api-v1-main-wrhlmg.laravel.cloud/api/v1';
    // Extract the domain part from the API URL
    const urlObj = new URL(baseUrl);
    const domain = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}`;
    
    return fetch(`${domain}/sanctum/csrf-cookie`, {
      credentials: 'include'
    });
  }

  // -------------------------
  // API Methods
  // -------------------------
  // Log in the user using provided credentials
  async login(credentials) {
    await this.initializeCSRF();
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      if (response.access_token) {
        if (!this.setAuthData(response)) {
          throw new Error('Invalid user data in response');
        }
        return response;
      }
      throw new Error('Login failed: No access token received');
    } catch (error) {
      console.error('Login error:', error);
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
      const token = this.getToken();
      if (token) {
        // Set token for the API call to ensure authorization
        apiService.setAuthToken(`Bearer ${token}`);
        try {
          // Call the logout endpoint if available
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

  // Refresh the token. Uses response.access_token and a default expiration if none provided.
  async refreshToken() {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH);
      if (response.access_token) {
        this.token = response.access_token;
        this.setStorageItem(STORAGE_KEYS.TOKEN, response.access_token);
        apiService.setAuthToken(`${response.token_type || 'Bearer'} ${response.access_token}`);

        const expiresIn = response.expires_in ? response.expires_in * 1000 : 24 * 60 * 60 * 1000; // default 24 hours
        const expirationTime = Date.now() + expiresIn;
        this.setStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationTime.toString());
        this.setTokenTimer(expiresIn);
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
  isAuthenticated() {
    const token = this.getToken();
    const expiration = this.getStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION);
    if (!token || !expiration) return false;
    return Date.now() < Number(expiration);
  }

  getToken() {
    return this.getStorageItem(STORAGE_KEYS.TOKEN);
  }

  getCurrentUser() {
    return this.getStorageItem(STORAGE_KEYS.USER, true);
  }

  getCurrentRole() {
    return this.getStorageItem(STORAGE_KEYS.USER_ROLE);
  }

  // Determine redirect path based on the role
  getRedirectPath(role) {
    if (!role) return '/dashboard';
    switch (role.toLowerCase()) {
      case 'admin':
        return '/dashboard/admin-dashboard';
      case 'hr-manager':
        return '/dashboard/hr-manager-dashboard';
      case 'hr-assistant':
        return '/dashboard/hr-assistant-dashboard';
      case 'employee':
        return '/dashboard/employee-dashboard';
      default:
        return '/dashboard';
    }
  }
}

export const authService = new AuthService();
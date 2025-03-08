// stores/authStore.js
import { defineStore } from 'pinia';
import { authService } from '@/services/auth.service';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
    user: localStorage.getItem(STORAGE_KEYS.USER)
      ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))
      : null,
    userRole: localStorage.getItem(STORAGE_KEYS.USER_ROLE) || null,
    permissions: localStorage.getItem(STORAGE_KEYS.PERMISSIONS)
      ? JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISSIONS))
      : [],
    tokenExpiration: localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRATION) || null,
    loading: false,
    error: null,
    tokenTimer: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user,
    userPermissions: (state) => state.permissions,
    isAdmin: (state) => state.userRole === 'admin',
    isHRManager: (state) => state.userRole === 'hr-manager',
    isHRAssistant: (state) => state.userRole === 'hr-assistant',
    isEmployee: (state) => state.userRole === 'employee',
  },
  actions: {
    // we need to update the user data in the storage after the profile picture, username, email, password is updated
    async updateUserData() {
      try {
        const response = await apiService.get(API_ENDPOINTS.AUTH.USER);
        
        // The backend directly returns the user object with roles and permissions
        if (response) {
          // Update user data in store
          this.user = response;
          
          // Update roles if available
          if (response.roles && response.roles.length) {
            this.userRole = response.roles[0].name.toLowerCase();
            this.setStorageItem(STORAGE_KEYS.USER_ROLE, this.userRole);
          }
          
          // Update permissions if available
          if (response.permissions) {
            this.permissions = response.permissions;
            this.setStorageItem(STORAGE_KEYS.PERMISSIONS, this.permissions);
          }
          
          // Save user data to storage
          this.setStorageItem(STORAGE_KEYS.USER, this.user);
          return this.user;
        }
        
        console.log('User data response:', response);
        throw new Error('Failed to fetch user data: Invalid response structure');
      } catch (error) {
        console.error('Error updating user data:', error);
        return null;
      }
    },
    
    // --- Local Storage Helpers ---
    setStorageItem(key, value) {
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    },
    getStorageItem(key, parse = false) {
      const value = localStorage.getItem(key);
      return parse && value ? JSON.parse(value) : value;
    },
    removeStorageItem(key) {
      localStorage.removeItem(key);
    },

    // --- Auth State Management ---
    clearAuthData() {
      Object.values(STORAGE_KEYS).forEach((key) => this.removeStorageItem(key));
      this.token = null;
      this.user = null;
      this.userRole = null;
      this.permissions = [];
      this.tokenExpiration = null;
      if (this.tokenTimer) {
        clearTimeout(this.tokenTimer);
        this.tokenTimer = null;
      }
    },

    setTokenTimer(duration) {
      if (this.tokenTimer) clearTimeout(this.tokenTimer);
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration);
    },

    setAuthData(response) {
      if (!response || !response.user) return;
      
      // Set token and user details
      this.token = response.access_token;
      this.user = response.user;
      
      // Get role from the roles array
      this.userRole = 
        response.roles && response.roles.length
          ? response.roles[0].name.toLowerCase()
          : null;
      
      // Set permissions directly from the response
      this.permissions = response.permissions || [];
      
      // Calculate token expiration (default to 24 hours if not provided)
      const expiresIn = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const expirationTime = Date.now() + expiresIn;
      this.tokenExpiration = expirationTime;

      // Persist data in localStorage
      this.setStorageItem(STORAGE_KEYS.TOKEN, this.token);
      this.setStorageItem(STORAGE_KEYS.USER, this.user);
      this.setStorageItem(STORAGE_KEYS.USER_ROLE, this.userRole);
      this.setStorageItem(STORAGE_KEYS.PERMISSIONS, this.permissions);
      this.setStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationTime.toString());

      this.setTokenTimer(expiresIn);
    },

    checkAuth() {
      const token = this.getStorageItem(STORAGE_KEYS.TOKEN);
      const expiration = this.getStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION);
      if (token && expiration && Date.now() < Number(expiration)) {
        this.token = token;
        this.user = this.getStorageItem(STORAGE_KEYS.USER, true);
        this.userRole = this.getStorageItem(STORAGE_KEYS.USER_ROLE);
        this.permissions = this.getStorageItem(STORAGE_KEYS.PERMISSIONS, true) || [];
        return true;
      }
      this.clearAuthData();
      return false;
    },

    // --- API Action Methods ---
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.login(credentials);
        if (response.access_token) {
          this.setAuthData(response);
          return { success: true, user: this.user };
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        this.error = error.message || 'Authentication failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      let result = { success: true };
      
      try {
        if (this.token) {
          // Optionally, set token in headers for the logout API call
          await authService.logout();
        }
      } catch (error) {
        console.warn('Logout API call failed:', error);
      } finally {
        this.clearAuthData();
        this.loading = false;
      }
      
      return result;
    },

    async refreshToken() {
      try {
        const response = await authService.refreshToken();
        if (response.access_token) {
          this.token = response.access_token;
          const expiresIn = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          const expirationTime = Date.now() + expiresIn;
          this.tokenExpiration = expirationTime;
          this.setStorageItem(STORAGE_KEYS.TOKEN, this.token);
          this.setStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationTime.toString());
          this.setTokenTimer(expiresIn);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.clearAuthData();
        return false;
      }
    },

    getRedirectPath() {
      if (!this.userRole) return '/dashboard';
      switch (this.userRole.toLowerCase()) {
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
    },

    // Additional actions (e.g., updateUserProfile, updateUserPassword) can be added here,
    // following the pattern of calling the authService for API requests and updating state accordingly.
  }
});

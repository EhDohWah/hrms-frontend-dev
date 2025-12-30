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
    justLoggedIn: null, // persist flag
    // Real-time permission sync state
    permissionRefreshTimer: null, // Debounce timer for permission refresh
    permissionRefreshPromise: null, // Prevent concurrent refresh calls
    permissionVersion: Date.now(), // Track permission version for freshness
    crossTabChannel: null, // BroadcastChannel for cross-tab sync
    isRefreshingPermissions: false, // Flag to prevent loops
    permissionEventQueue: [], // Queue for pending permission update events
  }),
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user,
    userPermissions: (state) => state.permissions,
    isAdmin: (state) => state.userRole === 'admin',
    isHRManager: (state) => state.userRole === 'hr-manager',
    isHRAssistantSenior: (state) => state.userRole === 'hr-assistant-senior',
    isHRAssistantJunior: (state) => state.userRole === 'hr-assistant-junior',
    isSiteAdmin: (state) => state.userRole === 'site-admin',
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

            // Emit permission change event for real-time menu updates
            this.emitPermissionsUpdated();
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

      // NOTE: DO NOT clear 'intendedRoute' here during login!
      // It needs to persist through the login process for post-login redirect
      // It will be cleared in:
      // 1. login-index.vue after successful redirect
      // 2. logout() method below (for clean logout)

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

    // -------------------------
    // Authentication Utilities
    // -------------------------
    // Returns the primary role (assumes first role is primary)
    getPrimaryRole(roles) {
      if (!roles?.length) return null;
      return roles[0].name.toLowerCase();
    },

    async setAuthData(response) {
      if (!response || !response.user) return false;

      // Clear any existing authentication data
      this.clearAuthData();

      // Set token and update API headers
      if (response.access_token) {
        this.token = response.access_token;
        this.setStorageItem(STORAGE_KEYS.TOKEN, response.access_token);
        // Note: apiService.setAuthToken call is omitted as it's not in the selection scope
      }

      // Save user data and role information if available
      if (response.user) {
        if (response.user.roles && response.user.roles.length > 0) {
          this.userRole = this.getPrimaryRole(response.user.roles);
          this.setStorageItem(STORAGE_KEYS.USER_ROLE, this.userRole);
        }
        this.setStorageItem(STORAGE_KEYS.USER, response.user);
        this.user = response.user;

        // Save permissions if available
        if (response.user.permissions) {
          this.permissions = response.user.permissions;
          this.setStorageItem(STORAGE_KEYS.PERMISSIONS, this.permissions);

          // Emit permission change event for real-time menu updates
          this.emitPermissionsUpdated();
        }
      }

      // Set token expiration using response.expires_in (if provided) or default to 24 hours
      const expiresIn = response.expires_in ? response.expires_in * 1000 : 24 * 60 * 60 * 1000;
      const expirationTime = Date.now() + expiresIn;
      this.tokenExpiration = expirationTime;
      this.setStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationTime.toString());
      this.setTokenTimer(expiresIn);

      // Fetch user permissions in simplified read/edit format
      await this.fetchMyPermissions();

      // Initialize menu service after authentication
      this.initializeMenuService();

      // Initialize cross-tab synchronization for real-time permission updates
      this.initCrossTabSync();

      return true;
    },

    async checkAuth() {
      const token = this.getStorageItem(STORAGE_KEYS.TOKEN);
      const expiration = this.getStorageItem(STORAGE_KEYS.TOKEN_EXPIRATION);
      if (token && expiration && Date.now() < Number(expiration)) {
        this.token = token;
        this.user = this.getStorageItem(STORAGE_KEYS.USER, true);
        this.userRole = this.getStorageItem(STORAGE_KEYS.USER_ROLE);
        this.permissions = this.getStorageItem(STORAGE_KEYS.PERMISSIONS, true) || [];

        // Load permission version from storage
        const storedVersion = this.getStorageItem('permissionVersion');
        if (storedVersion) {
          this.permissionVersion = Number(storedVersion);
        }

        // Refresh permissions from API to ensure they're up-to-date
        await this.fetchMyPermissions();

        // Initialize menu service if user is authenticated
        this.initializeMenuService();

        // Initialize cross-tab synchronization for real-time permission updates
        this.initCrossTabSync();

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
          await this.setAuthData(response);
          // Set the justLoggedIn flag in localStorage
          this.justLoggedIn = true;
          return { success: true, user: this.user };
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        // Preserve the full error object with response data for better error handling
        this.error = error.response?.data?.message || error.message || 'Authentication failed';
        
        // Re-throw the error to allow the component to handle it with full context
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      let result = { success: true };

      try {
        if (this.token) {
          await authService.logout();
        }
      } catch (error) {
        console.warn('Logout API call failed:', error);
      } finally {
        // Broadcast logout to other tabs BEFORE clearing data
        this.broadcastLogout();

        // Cleanup cross-tab sync
        this.cleanupCrossTabSync();

        // Clear auth data
        this.clearAuthData();

        // Clear intended route (important for clean logout)
        this.removeStorageItem('intendedRoute');

        // Clear permission version
        this.removeStorageItem('permissionVersion');

        // Reset menu service to clear cached modules
        this.resetMenuService();

        // Reset all Pinia stores to clear cached data from previous user
        this.resetAllStores();

        this.loading = false;
      }

      return result;
    },

    /**
     * Reset menu service to clear cached modules
     * This ensures fresh menu data on next login
     */
    resetMenuService() {
      try {
        import('@/services/menu.service').then(({ menuService }) => {
          menuService.reset();
          console.log('✅ Menu service reset');
        });
      } catch (error) {
        console.error('Error resetting menu service:', error);
      }
    },

    // Reset all Pinia stores on logout
    // CRITICAL: Comprehensive store reset to prevent data persistence across sessions
    resetAllStores() {
      try {
        // Define all stores with their reset methods
        const storesToReset = [
          // Core data stores
          { path: '@/stores/lookupStore', name: 'useLookupStore', method: 'resetState' },
          { path: '@/stores/sharedDataStore', name: 'useSharedDataStore', method: 'resetState' },
          { path: '@/stores/employeeStore', name: 'useEmployeeStore', method: '$reset' },
          { path: '@/stores/departmentPositionStore', name: 'useDepartmentPositionStore', method: '$reset' },
          { path: '@/stores/grantStore', name: 'useGrantStore', method: '$reset' },

          // CRITICAL ADDITIONS - Previously missing stores that caused memory leaks
          { path: '@/stores/notificationStore', name: 'useNotificationStore', method: 'resetState' },
          { path: '@/stores/activityLogStore', name: 'useActivityLogStore', method: 'resetState' },
          { path: '@/stores/formDraftStore', name: 'useFormDraftStore', method: 'clearAllDrafts' },
          { path: '@/stores/formPersistenceStore', name: 'useFormPersistenceStore', method: '$reset' },

          // Module-specific stores
          { path: '@/stores/payrollStore', name: 'usePayrollStore', method: '$reset' },
          { path: '@/stores/leaveStore', name: 'useLeaveStore', method: '$reset' },
          { path: '@/stores/trainingStore', name: 'useTrainingStore', method: '$reset' },
          { path: '@/stores/employeeTrainingStore', name: 'useEmployeeTrainingStore', method: '$reset' },
          { path: '@/stores/travelRequestStore', name: 'useTravelRequestStore', method: '$reset' },
          { path: '@/stores/interviewStore', name: 'useInterviewStore', method: '$reset' },
          { path: '@/stores/jobOfferStore', name: 'useJobOfferStore', method: '$reset' },

          // Organization structure stores
          { path: '@/stores/siteStore', name: 'useSiteStore', method: '$reset' },
          { path: '@/stores/departmentStore', name: 'useDepartmentStore', method: '$reset' },
          { path: '@/stores/positionStore', name: 'usePositionStore', method: '$reset' },
          { path: '@/stores/sectionDepartmentStore', name: 'useSectionDepartmentStore', method: '$reset' },

          // Admin stores
          { path: '@/stores/userStore', name: 'useUserStore', method: '$reset' },
          { path: '@/stores/adminStore', name: 'useAdminStore', method: '$reset' },
          { path: '@/stores/referenceStore', name: 'useReferenceStore', method: '$reset' },
        ];

        // Reset each store dynamically
        storesToReset.forEach(({ path, name, method }) => {
          import(path).then((module) => {
            const store = module[name]();
            if (store[method]) {
              store[method]();
              console.log(`✅ ${name} reset`);
            }
          }).catch((err) => {
            // Store might not exist in all projects - silently continue
            console.debug(`Store ${name} not found or failed to reset:`, err.message);
          });
        });

        console.log('🔄 All available stores reset successfully');
      } catch (error) {
        console.error('Error resetting stores:', error);
      }
    },

    /**
     * Initialize menu service after authentication
     * This loads modules from the API for dynamic menu generation
     */
    async initializeMenuService() {
      try {
        const { menuService } = await import('@/services/menu.service');
        await menuService.initialize();
        console.log('[AuthStore] Menu service initialized after authentication');
      } catch (error) {
        console.error('[AuthStore] Error initializing menu service:', error);
      }
    },

    /**
     * Fetch user permissions from /api/v1/me/permissions endpoint
     * Returns permissions in simplified read/edit format
     */
    async fetchMyPermissions() {
      try {
        const response = await apiService.get(API_ENDPOINTS.AUTH.MY_PERMISSIONS);

        if (response && response.success && response.data) {
          // Convert module permissions to flat array for backward compatibility
          const flatPermissions = [];

          Object.entries(response.data).forEach(([moduleName, access]) => {
            if (access.read) {
              flatPermissions.push(`${moduleName}.read`);
            }
            if (access.edit) {
              flatPermissions.push(`${moduleName}.edit`);
            }
          });

          this.permissions = flatPermissions;
          this.setStorageItem(STORAGE_KEYS.PERMISSIONS, this.permissions);
          this.emitPermissionsUpdated();

          console.log('[AuthStore] Permissions fetched successfully:', flatPermissions);
          return response.data;
        }

        console.warn('[AuthStore] Failed to fetch permissions: Invalid response');
        return null;
      } catch (error) {
        console.error('[AuthStore] Error fetching permissions:', error);
        return null;
      }
    },

    /**
     * Emit permission update event for real-time menu refresh
     * This allows sidebar and other components to react to permission changes
     */
    emitPermissionsUpdated() {
      try {
        const event = new CustomEvent('permissions-updated', {
          detail: {
            permissions: this.permissions,
            timestamp: Date.now()
          }
        });
        window.dispatchEvent(event);
        console.log('[AuthStore] Permissions updated event emitted:', this.permissions);
      } catch (error) {
        console.error('[AuthStore] Error emitting permissions-updated event:', error);
      }
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
      // All users go to the unified dynamic dashboard with customizable widgets
      return '/dashboard';
    },

    // =========================================
    // REAL-TIME PERMISSION SYNCHRONIZATION
    // =========================================

    /**
     * Refresh permissions from API with debouncing.
     * Called when WebSocket notifies of permission changes.
     *
     * @param {Object} eventData - Optional data from the WebSocket event
     * @param {number} debounceMs - Debounce delay in milliseconds (default: 500ms)
     * @returns {Promise<boolean>} - Whether the refresh was successful
     */
    async refreshPermissions(eventData = null, debounceMs = 500) {
      // Prevent refresh if not authenticated
      if (!this.token || !this.user) {
        console.warn('[AuthStore] Cannot refresh permissions - not authenticated');
        return false;
      }

      // Prevent concurrent refreshes
      if (this.isRefreshingPermissions) {
        console.log('[AuthStore] Permission refresh already in progress, skipping');
        return this.permissionRefreshPromise;
      }

      // Clear any pending debounce timer
      if (this.permissionRefreshTimer) {
        clearTimeout(this.permissionRefreshTimer);
        this.permissionRefreshTimer = null;
      }

      // Return a promise that resolves after the debounce period
      return new Promise((resolve) => {
        this.permissionRefreshTimer = setTimeout(async () => {
          this.isRefreshingPermissions = true;

          try {
            console.log('[AuthStore] Refreshing permissions...', eventData);

            // Store old permissions for comparison
            const oldPermissions = [...this.permissions];

            // Fetch fresh permissions from API
            const result = await this.fetchMyPermissions();

            if (result) {
              // Update permission version
              this.permissionVersion = Date.now();
              this.setStorageItem('permissionVersion', this.permissionVersion.toString());

              // Check if permissions actually changed
              const permissionsChanged =
                JSON.stringify(oldPermissions.sort()) !== JSON.stringify(this.permissions.sort());

              if (permissionsChanged) {
                console.log('[AuthStore] Permissions changed, refreshing menu...');

                // Reinitialize menu service to update sidebar
                await this.initializeMenuService();

                // Notify other tabs about the permission update
                this.broadcastPermissionUpdate();

                // Show notification to user if event data provided
                if (eventData?.message) {
                  this.showPermissionUpdateNotification(eventData);
                }
              } else {
                console.log('[AuthStore] Permissions unchanged after refresh');
              }

              resolve(true);
            } else {
              console.warn('[AuthStore] Failed to refresh permissions');
              resolve(false);
            }
          } catch (error) {
            console.error('[AuthStore] Error refreshing permissions:', error);
            resolve(false);
          } finally {
            this.isRefreshingPermissions = false;
            this.permissionRefreshTimer = null;
            
            // Process next queued event if any
            if (this.permissionEventQueue.length > 0) {
              setTimeout(() => this.processNextPermissionEvent(), 500);
            }
          }
        }, debounceMs);
      });
    },

    /**
     * Process the next queued permission event (if any)
     */
    async processNextPermissionEvent() {
      if (this.isRefreshingPermissions || this.permissionEventQueue.length === 0) {
        return;
      }

      const nextEvent = this.permissionEventQueue.shift();
      console.log(`[AuthStore] Processing queued event (${this.permissionEventQueue.length} remaining)`, nextEvent);
      
      await this.refreshPermissions(nextEvent, 300);
      
      // After processing, check if there are more events in queue
      if (this.permissionEventQueue.length > 0) {
        // Process next event after a short delay
        setTimeout(() => this.processNextPermissionEvent(), 500);
      }
    },

    /**
     * Handle WebSocket permission update event.
     * Called from echo.js when 'user.permissions-updated' event is received.
     *
     * @param {Object} data - Event payload from WebSocket
     */
    async handlePermissionUpdateEvent(data) {
      console.log('[AuthStore] 🔐 Permission update event received:', data);

      // Verify this event is for the current user
      const currentUserId = this.user?.id;
      if (data.user_id && data.user_id !== currentUserId) {
        console.warn('[AuthStore] Permission update event for different user, ignoring');
        return;
      }

      // If already refreshing, queue this event
      if (this.isRefreshingPermissions) {
        console.log('[AuthStore] 📥 Queueing event (refresh in progress)', data);
        this.permissionEventQueue.push(data);
        return;
      }

      // If queue has events, add this one and process queue
      if (this.permissionEventQueue.length > 0) {
        console.log('[AuthStore] 📥 Adding to existing queue', data);
        this.permissionEventQueue.push(data);
        return; // Queue will be processed automatically
      }

      // No queue, process immediately
      await this.refreshPermissions(data, 300);
      
      // After processing, check if events were queued while we were processing
      if (this.permissionEventQueue.length > 0) {
        setTimeout(() => this.processNextPermissionEvent(), 500);
      }
    },

    /**
     * Show notification to user about permission update.
     * Uses ant-design-vue notification component if available.
     *
     * @param {Object} eventData - Event data containing message
     */
    showPermissionUpdateNotification(eventData) {
      try {
        // Try to use ant-design-vue notification
        import('ant-design-vue').then(({ notification }) => {
          notification.info({
            message: 'Permissions Updated',
            description: eventData.message || 'Your access permissions have been updated.',
            placement: 'topRight',
            duration: 5,
          });
        }).catch(() => {
          // Fallback to console log if notification not available
          console.log('[AuthStore] Permission update notification:', eventData.message);
        });
      } catch (error) {
        console.log('[AuthStore] Could not show notification:', error);
      }
    },

    /**
     * Initialize cross-tab synchronization using BroadcastChannel API.
     * Allows permission updates to sync across browser tabs.
     */
    initCrossTabSync() {
      // Check if BroadcastChannel is supported
      if (typeof BroadcastChannel === 'undefined') {
        console.warn('[AuthStore] BroadcastChannel not supported, cross-tab sync disabled');
        return;
      }

      // Close existing channel if any
      if (this.crossTabChannel) {
        this.crossTabChannel.close();
      }

      try {
        this.crossTabChannel = new BroadcastChannel('hrms-permission-sync');

        // Listen for messages from other tabs
        this.crossTabChannel.onmessage = (event) => {
          const { type, permissions, version, userId } = event.data;

          // Verify message is for current user
          if (userId && userId !== this.user?.id) {
            return;
          }

          if (type === 'PERMISSION_UPDATE') {
            // Only update if the version is newer
            if (version > this.permissionVersion) {
              console.log('[AuthStore] Received cross-tab permission update');
              this.permissions = permissions;
              this.permissionVersion = version;
              this.setStorageItem(STORAGE_KEYS.PERMISSIONS, this.permissions);
              this.setStorageItem('permissionVersion', this.permissionVersion.toString());
              this.emitPermissionsUpdated();

              // Reinitialize menu service
              this.initializeMenuService();
            }
          } else if (type === 'LOGOUT') {
            // Another tab logged out, sync logout across tabs
            console.log('[AuthStore] Received cross-tab logout signal');
            this.clearAuthData();
            window.location.href = '/login';
          }
        };

        console.log('[AuthStore] Cross-tab sync initialized');
      } catch (error) {
        console.error('[AuthStore] Error initializing cross-tab sync:', error);
      }
    },

    /**
     * Broadcast permission update to other tabs.
     */
    broadcastPermissionUpdate() {
      if (this.crossTabChannel) {
        try {
          this.crossTabChannel.postMessage({
            type: 'PERMISSION_UPDATE',
            permissions: this.permissions,
            version: this.permissionVersion,
            userId: this.user?.id,
          });
          console.log('[AuthStore] Permission update broadcast to other tabs');
        } catch (error) {
          console.error('[AuthStore] Error broadcasting permission update:', error);
        }
      }
    },

    /**
     * Broadcast logout to other tabs.
     */
    broadcastLogout() {
      if (this.crossTabChannel) {
        try {
          this.crossTabChannel.postMessage({
            type: 'LOGOUT',
            userId: this.user?.id,
          });
        } catch (error) {
          console.error('[AuthStore] Error broadcasting logout:', error);
        }
      }
    },

    /**
     * Cleanup cross-tab sync resources.
     * Call this when the user logs out or the app is destroyed.
     */
    cleanupCrossTabSync() {
      if (this.crossTabChannel) {
        this.crossTabChannel.close();
        this.crossTabChannel = null;
        console.log('[AuthStore] Cross-tab sync cleaned up');
      }

      // Clear permission refresh timer
      if (this.permissionRefreshTimer) {
        clearTimeout(this.permissionRefreshTimer);
        this.permissionRefreshTimer = null;
      }
    },

    // Additional actions (e.g., updateUserProfile, updateUserPassword) can be added here,
    // following the pattern of calling the authService for API requests and updating state accordingly.
  }
});
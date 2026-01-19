// stores/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    tokenType: null,
    user: null,
    roles: [],
    permissions: [],
    isAuthenticated: false,
  }),   
  getters: {
    // Check if the user is an admin (you can customize this logic)
    isAdmin(state) {
      return state.roles.some(role => role.name === 'admin')
    },
    isManager(state) {
      return state.roles.some(role => role.name === 'hr-manager')
    },
    // Example: check if the user is an HR Assistant
    isHRAssistant(state) {
      return state.roles.some(role => role.name === 'hr-assistant')
    },
    isEmployee(state) {
      return state.roles.some(role => role.name === 'employee')
    },
  },
  actions: {
    // Set the authentication data based on the API response
    setAuthData(authData) {
      this.token = authData.access_token
      this.tokenType = authData.token_type
      this.user = authData.user
      this.roles = authData.user.roles || []
      this.permissions = authData.user.permissions || []
      this.isAuthenticated = true
    },
    // Clear the stored authentication data
    clearAuthData() {
      this.token = null
      this.tokenType = null
      this.user = null
      this.roles = []
      this.permissions = []
      this.isAuthenticated = false
    },  
  },
})

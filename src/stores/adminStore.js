// src/stores/adminStore.js
import { defineStore } from 'pinia';
import { adminService } from '@/services/admin.service';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],
    currentUser: null,
    roles: [],
    permissions: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1,
      from: null,
      to: null
    },
    statistics: {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0
    }
  }),

  getters: {
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id);
    },
    getActiveUsers: (state) => {
      return state.users.filter(user => user.status === 'active');
    },
    getInactiveUsers: (state) => {
      return state.users.filter(user => user.status !== 'active');
    },
    getUsersByRole: (state) => (roleId) => {
      return state.users.filter(user => 
        user.roles && user.roles.some(role => role.id === roleId)
      );
    },
    getUsersWithRoleName: (state) => {
      return state.users.map(user => ({
        ...user,
        role: user.roles && user.roles.length > 0 ? user.roles[0].name : 'User'
      }));
    }
  },

  actions: {
    async fetchUsers() {
      try {
        this.loading = true;
        this.error = null;
        const response = await adminService.getAllUsers();
        
        // Check if response has the expected structure with success and data properties
        const usersData = response && response.success && Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
          
        this.users = usersData;
        
        // Update statistics
        this.updateStatistics();
        
        return this.users;
      } catch (error) {
        this.error = error.message || 'Failed to fetch users';
        console.error('Error fetching users:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUsersPaginated(params = {}) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await adminService.getUsersPaginated(params);
        
        // Extract users data
        const usersData = response && response.success && Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data)
          ? response.data
          : [];
          
        this.users = usersData;
        
        // Update pagination metadata
        if (response.meta) {
          this.pagination = {
            current_page: response.meta.current_page || 1,
            per_page: response.meta.per_page || 15,
            total: response.meta.total || 0,
            last_page: response.meta.last_page || 1,
            from: response.meta.from || null,
            to: response.meta.to || null
          };
        }
        
        // Update statistics
        this.updateStatistics();
        
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch users';
        console.error('Error fetching users:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getUserDetails(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await adminService.getUserDetails(id);
        this.currentUser = response.data || response;
        return this.currentUser;
      } catch (error) {
        this.error = error.message || 'Failed to fetch user details';
        console.error('Error fetching user details:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createUser(data) {
      try {
        this.loading = true;
        this.error = null;
        const response = await adminService.createUser(data);
        // Refresh user list after creation
        await this.fetchUsers();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create user';
        console.error('Error creating user:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateUser(id, data) {
      try {
        this.loading = true;
        this.error = null;
        const response = await adminService.updateUser(id, data);
        // Refresh user list after update
        await this.fetchUsers();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update user';
        console.error('Error updating user:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteUser(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await adminService.deleteUser(id);
        // Refresh user list after deletion
        await this.fetchUsers();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete user';
        console.error('Error deleting user:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchRoles() {
      try {
        this.loading = true;
        this.error = null;
        const response = await adminService.getAllRoles();
        this.roles = response.data || response;
        return this.roles;
      } catch (error) {
        this.error = error.message || 'Failed to fetch roles';
        console.error('Error fetching roles:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchPermissions() {
      try {
        this.loading = true;
        this.error = null;
        const response = await adminService.getAllPermissions();
        this.permissions = response.data || response;
        return this.permissions;
      } catch (error) {
        this.error = error.message || 'Failed to fetch permissions';
        console.error('Error fetching permissions:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    setCurrentUser(user) {
      this.currentUser = user;
    },
    
    updateStatistics() {
      this.statistics.totalUsers = this.users.length;
      this.statistics.activeUsers = this.users.filter(user => user.status === 'active').length;
      this.statistics.inactiveUsers = this.users.filter(user => user.status !== 'active').length;
    },
    
    getRoleName(user) {
      return user.roles && user.roles.length > 0 
        ? user.roles[0].name 
        : 'User';
    }
  }
});

// src/stores/employeeStore.js
import { defineStore } from 'pinia';
import { employeeService } from '@/services/employee.service';
import { toRaw } from 'vue';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [],
    employments: [],
    currentEmployee: null,
    loading: false,
    error: null,
    statistics: {
      totalEmployees: 0,
      activeCount: 0,
      inactiveCount: 0,
      newJoinerCount: 0
    }
  }),

  getters: {
    getEmployeeById: (state) => (id) => {
      return state.employees.find(employee => employee.id === id);
    },
    getActiveEmployees: (state) => {
      return state.employees.filter(employee => 
        employee.employment && employee.employment.active === 1
      );
    },
    getEmployeesByDepartment: (state) => (departmentId) => {
      return state.employees.filter(employee => 
        employee.employment && employee.employment.department_id === departmentId
      );
    },
    getEmployeesByLocation: (state) => (locationId) => {
      return state.employees.filter(employee => 
        employee.employment && employee.employment.work_location_id === locationId
      );
    },
    getEmployeesByStatus: (state) => (status) => {
      return state.employees.filter(employee => employee.status === status);
    },
    getEmploymentById: (state) => (id) => {
      return state.employments.find(employment => employment.id === id);
    },
    getEmploymentsByDepartment: (state) => (department) => {
      return state.employments.filter(employment => 
        employment.department_position && employment.department_position.department === department
      );
    },
    getEmploymentsByLocation: (state) => (locationId) => {
      return state.employments.filter(employment => 
        employment.work_location_id === locationId
      );
    },
    getActiveEmployments: (state) => {
      return state.employments.filter(employment => employment.active === "1");
    }
  },

  actions: {
    async fetchEmployees() {
      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.getEmployees();
        
        // Check if response.data exists and is an array; if not, assume response is the array
        const employeesData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
          
        this.employees = employeesData;
        
        // Update statistics
        this.updateStatistics();
        
        return this.employees;
      } catch (error) {
        this.error = error.message || 'Failed to fetch employees';
        console.error('Error fetching employees:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchEmployments() {
      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.getEmployments();
        
        // Check if response.data exists and is an array; if not, assume response is the array
        const employmentsData = response.data || [];
        this.employments = employmentsData;
        
        return this.employments;
      } catch (error) {
        this.error = error.message || 'Failed to fetch employments';
        console.error('Error fetching employments:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getEmployeeDetails(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.getEmployeeDetails(id);
        this.currentEmployee = response.data || response;
        return this.currentEmployee;
      } catch (error) {
        this.error = error.message || 'Failed to fetch employee details';
        console.error('Error fetching employee details:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createEmployee(data) {
      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.createEmployee(data);
        // Refresh employee list after creation
        await this.fetchEmployees();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create employee';
        console.error('Error creating employee:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateEmployee(id, data) {
      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.updateEmployee(id, data);
        // Refresh employee list after update
        await this.fetchEmployees();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update employee';
        console.error('Error updating employee:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteEmployee(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.deleteEmployee(id);
        // Refresh employee list after deletion
        await this.fetchEmployees();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete employee';
        console.error('Error deleting employee:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async filterEmployees(filters) {
      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.filterEmployees(filters);
        const filteredData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        
        return filteredData;
      } catch (error) {
        this.error = error.message || 'Failed to filter employees';
        console.error('Error filtering employees:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async uploadProfilePicture(id, imageFile) {
      try {
        this.loading = true;
        this.error = null;
        // Unwrap the reactive proxy to get the native File instance if needed
        const rawImageFile = toRaw(imageFile);
        const response = await employeeService.uploadProfilePicture(id, rawImageFile);
        // Refresh employee details after upload
        if (this.currentEmployee && this.currentEmployee.id === id) {
          await this.getEmployeeDetails(id);
        }
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to upload profile picture';
        console.error('Error uploading profile picture:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getSiteRecords() {
      try {
        this.loading = true;
        this.error = null;
        const response = await employeeService.getSiteRecords();
        return response.data || response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch site records';
        console.error('Error fetching site records:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    setCurrentEmployee(employee) {
      this.currentEmployee = employee;
    },
    
    updateStatistics() {
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      
      this.statistics.totalEmployees = this.employees.length;
      
      this.statistics.activeCount = this.employees.filter(employee => 
        employee.employment && employee.employment.active === 1
      ).length;
      
      this.statistics.inactiveCount = this.employees.filter(employee => 
        employee.employment && employee.employment.active === 0
      ).length;
      
      this.statistics.newJoinerCount = this.employees.filter(employee => {
        if (!employee.employment || !employee.employment.start_date) return false;
        const startDate = new Date(employee.employment.start_date);
        return startDate >= threeMonthsAgo && startDate <= now;
      }).length;
    }
  }
});

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
    pagination: {
      currentPage: 1,
      perPage:     10,
      lastPage:    1,
      total:       0,
    },
    statistics: {
      totalEmployees: 0,
      activeCount:    0,
      inactiveCount:  0,
      newJoinerCount: 0,
      subsidiaryCount:{ SMRU_count: 0, BHF_count: 0 },
    },
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
    async fetchEmployees(params = {}) {
      this.loading = true;
      this.error   = null;
      try {
        const res = await employeeService.getEmployees(params);

        // Normalize "body":
        // - if res.data exists (Axios), use res.data
        // - else use res itself
        const body = res && res.data !== undefined ? res.data : res;
        // console.log('🔍 API returned body:', body);

        // Now branch on whether body is an array vs. object
        let items = [];
        let meta  = {};
        let stats = {};

        if (Array.isArray(body)) {
          // body is already the array of employees
          items = body;
        } else {
          // body is { data: [...], meta: {...}, statistics: {...} }
          items = Array.isArray(body.data) ? body.data : [];
          meta  = body.meta       || {};
          stats = body.statistics || {};
        }

        // 1) set employees array
        this.employees = items;
        console.log('✅ store.employees has rows:', this.employees.length, 'total:', this.employees);

        // 2) pagination
        this.pagination = {
          currentPage: meta.current_page ?? this.pagination.currentPage,
          perPage:     meta.per_page    ?? this.pagination.perPage,
          lastPage:    meta.last_page   ?? this.pagination.lastPage,
          total:       meta.total       ?? this.pagination.total,
        };

        // 3) statistics
        if (stats.totalEmployees != null) {
          // Update statistics from API response
          this.statistics = {
            ...this.statistics,
            totalEmployees: stats.totalEmployees || 0,
            activeCount: stats.activeCount || 0,
            inactiveCount: stats.inactiveCount || 0,
            newJoinerCount: stats.newJoinerCount || 0,
            subsidiaryCount: {
              SMRU_count: stats.subsidiaryCount?.SMRU_count || 0,
              BHF_count: stats.subsidiaryCount?.BHF_count || 0
            }
          };
        } else {
          this.updateStatistics();
        }

        return this.employees;
      } catch (err) {
        this.error = err.message || 'Failed to fetch employees';
        // console.error('❌ fetchEmployees error:', err);
        throw err;
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
        // console.error('Error fetching employments:', error);
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
        //console.error('Error fetching employee details:', error);
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
        // console.error('Error creating employee:', error);
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
        // console.error('Error updating employee:', error);
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
        // console.error('Error deleting employee:', error);
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
        // console.error('Error filtering employees:', error);
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
        // console.error('Error uploading profile picture:', error);
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
        //console.error('Error fetching site records:', error);
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

      // 1) total from pagination.total
      this.statistics.totalEmployees = this.pagination.total;

      // 2) active / inactive from the current page
      this.statistics.activeCount = this.employees.filter(e =>
        e.employment?.active === 1
      ).length;

      this.statistics.inactiveCount = this.employees.filter(e =>
        e.employment?.active === 0
      ).length;

      this.statistics.newJoinerCount = this.employees.filter(e => {
        const d = e.employment?.start_date && new Date(e.employment.start_date);
        return d && d >= threeMonthsAgo && d <= now;
      }).length;

      // 3) subsidiary breakdown from the current page
      this.statistics.subsidiaryCount = { SMRU_count: 0, BHF_count: 0 };
      this.employees.forEach(e => {
        if (e.subsidiary === 'SMRU') this.statistics.subsidiaryCount.SMRU_count++;
        if (e.subsidiary === 'BHF')  this.statistics.subsidiaryCount.BHF_count++;
      });
    }
  }
});

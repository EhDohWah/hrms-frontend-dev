import { defineStore } from 'pinia';
import { departmentPositionService } from '@/services/department-position.service';

export const useDepartmentPositionStore = defineStore('departmentPosition', {
  state: () => ({
    departmentPositions: [],
    currentDepartmentPosition: null,
    loading: false,
    error: null
  }),

  getters: {
    getDepartmentPositions: (state) => state.departmentPositions,
    getCurrentDepartmentPosition: (state) => state.currentDepartmentPosition,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getError: (state) => state.error,
    
    // Get positions by department
    getPositionsByDepartment: (state) => (department) => {
      return state.departmentPositions.filter(position => position.department === department);
    },
    
    // Get all unique departments
    getAllDepartments: (state) => {
      const departments = new Set(state.departmentPositions.map(position => position.department));
      return [...departments];
    }
  },

  actions: {
    // Fetch all department positions
    async fetchDepartmentPositions() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await departmentPositionService.getAllDepartmentPositions();
        this.departmentPositions = response.data;
      } catch (error) {
        this.error = error.message || 'Failed to fetch department positions';
        console.error('Error fetching department positions:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // Get a specific department position by ID
    async fetchDepartmentPositionById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await departmentPositionService.getDepartmentPositionDetails(id);
        this.currentDepartmentPosition = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message || `Failed to fetch department position with ID: ${id}`;
        console.error(`Error fetching department position ${id}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // Create a new department position
    async createDepartmentPosition(positionData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await departmentPositionService.createDepartmentPosition(positionData);
        // Add the new position to the list
        this.departmentPositions.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to create department position';
        console.error('Error creating department position:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // Update an existing department position
    async updateDepartmentPosition(id, positionData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await departmentPositionService.updateDepartmentPosition(id, positionData);
        // Update the position in the list
        const index = this.departmentPositions.findIndex(position => position.id === id);
        if (index !== -1) {
          this.departmentPositions[index] = response.data;
        }
        
        // Update current position if it's the one being edited
        if (this.currentDepartmentPosition && this.currentDepartmentPosition.id === id) {
          this.currentDepartmentPosition = response.data;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.message || `Failed to update department position with ID: ${id}`;
        console.error(`Error updating department position ${id}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // Delete a department position
    async deleteDepartmentPosition(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await departmentPositionService.deleteDepartmentPosition(id);
        // Remove the position from the list
        this.departmentPositions = this.departmentPositions.filter(position => position.id !== id);
        
        // Clear current position if it's the one being deleted
        if (this.currentDepartmentPosition && this.currentDepartmentPosition.id === id) {
          this.currentDepartmentPosition = null;
        }
        
        return true;
      } catch (error) {
        this.error = error.message || `Failed to delete department position with ID: ${id}`;
        console.error(`Error deleting department position ${id}:`, error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Reset store state
    resetState() {
      this.departmentPositions = [];
      this.currentDepartmentPosition = null;
      this.loading = false;
      this.error = null;
    }
  }
});

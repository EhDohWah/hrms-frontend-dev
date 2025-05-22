// create a store for the payroll
import { defineStore } from 'pinia';
import { payrollService } from '@/services/payroll.service';

export const usePayrollStore = defineStore('payroll', {
  state: () => ({
    payrolls: [],
    currentPayroll: null,
    loading: false,
    error: null
  }),

  getters: {
    getPayrollById: (state) => (id) => {
      return state.payrolls.find(payroll => payroll.id === id);
    }
  },

  actions: {
    
    async fetchPayrolls() {
      try {
        this.loading = true;
        this.error = null;
        const response = await payrollService.getAllPayrolls();
        
        // Check if response.data exists and is an array; if not, assume response is the array
        const payrollsData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
          
        this.payrolls = payrollsData;
        return this.payrolls;
      } catch (error) {
        this.error = error.message || 'Failed to fetch payrolls';
        console.error('Error fetching payrolls:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createPayroll(payrollData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await payrollService.createPayroll(payrollData);
        // Refresh payrolls list after creating
        await this.fetchPayrolls();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to create payroll';
        console.error('Error creating payroll:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updatePayroll(id, payrollData) {
      try {
        this.loading = true;
        this.error = null;
        const response = await payrollService.updatePayroll(id, payrollData);
        // Refresh payrolls list after updating
        await this.fetchPayrolls();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to update payroll';
        console.error('Error updating payroll:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deletePayroll(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await payrollService.deletePayroll(id);
        // Refresh payrolls list after deleting
        await this.fetchPayrolls();
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to delete payroll';
        console.error('Error deleting payroll:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getPayrollDetails(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await payrollService.getPayrollById(id);
        this.currentPayroll = response.data || response;
        return this.currentPayroll;
      } catch (error) {
        this.error = error.message || 'Failed to fetch payroll details';
        console.error('Error fetching payroll details:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    setCurrentPayroll(payroll) {
      this.currentPayroll = payroll;
    }
  }
});

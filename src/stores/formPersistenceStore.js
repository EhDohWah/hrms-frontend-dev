// stores/formPersistenceStore.js
import { defineStore } from 'pinia';

export const useFormPersistenceStore = defineStore('formPersistence', {
    state: () => ({
        // Store form data for different employees
        employeeForms: {},

        // Track unsaved changes
        hasUnsavedChanges: {},

        // Store timestamps for data expiration
        timestamps: {},
    }),

    getters: {
        // Get form data for a specific employee
        getEmployeeFormData: (state) => (employeeId) => {
            return state.employeeForms[employeeId] || null;
        },

        // Check if employee has unsaved changes
        hasEmployeeUnsavedChanges: (state) => (employeeId) => {
            return state.hasUnsavedChanges[employeeId] || false;
        },

        // Check if form data is expired (older than 24 hours)
        isFormDataExpired: (state) => (employeeId) => {
            const timestamp = state.timestamps[employeeId];
            if (!timestamp) return true;

            const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - timestamp > expirationTime;
        },
    },

    actions: {
        // Save form data for an employee
        saveFormData(employeeId, formData) {
            this.employeeForms[employeeId] = {
                ...this.employeeForms[employeeId],
                ...formData,
            };
            this.timestamps[employeeId] = Date.now();
            this.hasUnsavedChanges[employeeId] = true;

            // Also persist to localStorage for recovery after page reload
            this.persistToLocalStorage(employeeId);
        },

        // Save specific form section
        saveFormSection(employeeId, section, data) {
            if (!this.employeeForms[employeeId]) {
                this.employeeForms[employeeId] = {};
            }

            this.employeeForms[employeeId][section] = data;
            this.timestamps[employeeId] = Date.now();
            this.hasUnsavedChanges[employeeId] = true;

            this.persistToLocalStorage(employeeId);
        },

        // Clear form data for an employee
        clearFormData(employeeId) {
            delete this.employeeForms[employeeId];
            delete this.hasUnsavedChanges[employeeId];
            delete this.timestamps[employeeId];

            // Remove from localStorage
            localStorage.removeItem(`employeeForm_${employeeId}`);
        },

        // Clear specific form section
        clearFormSection(employeeId, section) {
            if (this.employeeForms[employeeId]) {
                delete this.employeeForms[employeeId][section];

                // If no sections left, clear entire employee data
                if (Object.keys(this.employeeForms[employeeId]).length === 0) {
                    this.clearFormData(employeeId);
                } else {
                    this.persistToLocalStorage(employeeId);
                }
            }
        },

        // Mark form as saved (no unsaved changes)
        markAsSaved(employeeId) {
            this.hasUnsavedChanges[employeeId] = false;
        },

        // Load form data from localStorage
        loadFromLocalStorage(employeeId) {
            const stored = localStorage.getItem(`employeeForm_${employeeId}`);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);

                    // Check if data is not expired
                    if (parsed.timestamp && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
                        this.employeeForms[employeeId] = parsed.data;
                        this.timestamps[employeeId] = parsed.timestamp;
                        this.hasUnsavedChanges[employeeId] = true;
                        return true;
                    }
                } catch (error) {
                    console.error('Error loading form data from localStorage:', error);
                }
            }
            return false;
        },

        // Persist current state to localStorage
        persistToLocalStorage(employeeId) {
            const dataToStore = {
                data: this.employeeForms[employeeId],
                timestamp: this.timestamps[employeeId],
            };

            localStorage.setItem(`employeeForm_${employeeId}`, JSON.stringify(dataToStore));
        },

        // Clean up expired form data
        cleanupExpiredData() {
            Object.keys(this.timestamps).forEach(employeeId => {
                if (this.isFormDataExpired(employeeId)) {
                    this.clearFormData(employeeId);
                }
            });
        },

        // Check if user wants to restore saved data
        async checkForSavedData(employeeId) {
            if (this.loadFromLocalStorage(employeeId)) {
                return {
                    hasSavedData: true,
                    timestamp: this.timestamps[employeeId],
                    data: this.employeeForms[employeeId]
                };
            }
            return { hasSavedData: false };
        },
    },
});
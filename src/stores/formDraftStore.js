import { defineStore } from 'pinia'

export const useFormDraftStore = defineStore('formDraft', {
    state: () => ({
        employeeEditDraft: null,
        personalFormDraft: null,
        beneficiaryFormDraft: null,
        childFormDraft: null,
        draftTimestamps: {},
        saveTimeouts: {}
    }),

    actions: {
        // Debounced save methods
        debouncedSaveEmployeeEdit(formData) {
            clearTimeout(this.saveTimeouts.employeeEdit)
            this.saveTimeouts.employeeEdit = setTimeout(() => {
                this.saveEmployeeEditDraft(formData)
            }, 500)
        },

        debouncedSavePersonalForm(formData) {
            clearTimeout(this.saveTimeouts.personalForm)
            this.saveTimeouts.personalForm = setTimeout(() => {
                this.savePersonalFormDraft(formData)
            }, 500)
        },

        debouncedSaveBeneficiaryForm(formData) {
            clearTimeout(this.saveTimeouts.beneficiaryForm)
            this.saveTimeouts.beneficiaryForm = setTimeout(() => {
                this.saveBeneficiaryFormDraft(formData)
            }, 500)
        },

        debouncedSaveChildForm(formData) {
            clearTimeout(this.saveTimeouts.childForm)
            this.saveTimeouts.childForm = setTimeout(() => {
                this.saveChildFormDraft(formData)
            }, 500)
        },

        // Direct save methods
        saveEmployeeEditDraft(formData) {
            this.employeeEditDraft = JSON.parse(JSON.stringify(formData))
            this.draftTimestamps.employeeEdit = Date.now()
            console.log('Employee edit draft saved to store')
        },

        savePersonalFormDraft(formData) {
            this.personalFormDraft = JSON.parse(JSON.stringify(formData))
            this.draftTimestamps.personalForm = Date.now()
            console.log('Personal form draft saved to store')
        },

        saveBeneficiaryFormDraft(formData) {
            this.beneficiaryFormDraft = JSON.parse(JSON.stringify(formData))
            this.draftTimestamps.beneficiaryForm = Date.now()
            console.log('Beneficiary form draft saved to store')
        },

        saveChildFormDraft(formData) {
            this.childFormDraft = JSON.parse(JSON.stringify(formData))
            this.draftTimestamps.childForm = Date.now()
            console.log('Child form draft saved to store')
        },

        // Load methods
        loadEmployeeEditDraft() {
            return this.employeeEditDraft
        },

        loadPersonalFormDraft() {
            return this.personalFormDraft
        },

        loadBeneficiaryFormDraft() {
            return this.beneficiaryFormDraft
        },

        loadChildFormDraft() {
            return this.childFormDraft
        },

        // Clear individual drafts
        clearEmployeeEditDraft() {
            this.employeeEditDraft = null
            delete this.draftTimestamps.employeeEdit
            clearTimeout(this.saveTimeouts.employeeEdit)
            console.log('Employee edit draft cleared from store')
        },

        clearPersonalFormDraft() {
            this.personalFormDraft = null
            delete this.draftTimestamps.personalForm
            clearTimeout(this.saveTimeouts.personalForm)
            console.log('Personal form draft cleared from store')
        },

        clearBeneficiaryFormDraft() {
            this.beneficiaryFormDraft = null
            delete this.draftTimestamps.beneficiaryForm
            clearTimeout(this.saveTimeouts.beneficiaryForm)
            console.log('Beneficiary form draft cleared from store')
        },

        clearChildFormDraft() {
            this.childFormDraft = null
            delete this.draftTimestamps.childForm
            clearTimeout(this.saveTimeouts.childForm)
            console.log('Child form draft cleared from store')
        },

        // Clear all drafts
        clearAllDrafts() {
            this.employeeEditDraft = null
            this.personalFormDraft = null
            this.beneficiaryFormDraft = null
            this.childFormDraft = null
            this.draftTimestamps = {}

            // Clear all timeouts
            Object.values(this.saveTimeouts).forEach(timeout => clearTimeout(timeout))
            this.saveTimeouts = {}

            console.log('All form drafts cleared from store')
        },

        // Check if drafts are stale and clean them up
        cleanupStaleDrafts() {
            const maxAge = 24 * 60 * 60 * 1000 // 24 hours
            const now = Date.now()

            Object.keys(this.draftTimestamps).forEach(draftType => {
                if (now - this.draftTimestamps[draftType] > maxAge) {
                    switch (draftType) {
                        case 'employeeEdit':
                            this.clearEmployeeEditDraft()
                            break
                        case 'personalForm':
                            this.clearPersonalFormDraft()
                            break
                        case 'beneficiaryForm':
                            this.clearBeneficiaryFormDraft()
                            break
                        case 'childForm':
                            this.clearChildFormDraft()
                            break
                    }
                }
            })
        }
    },

    getters: {
        hasEmployeeEditDraft: (state) => !!state.employeeEditDraft,
        hasPersonalFormDraft: (state) => !!state.personalFormDraft,
        hasBeneficiaryFormDraft: (state) => !!state.beneficiaryFormDraft,
        hasChildFormDraft: (state) => !!state.childFormDraft,
        hasAnyDraft: (state) => !!(
            state.employeeEditDraft ||
            state.personalFormDraft ||
            state.beneficiaryFormDraft ||
            state.childFormDraft
        ),

        getDraftAge: (state) => (draftType) => {
            const timestamp = state.draftTimestamps[draftType]
            return timestamp ? Date.now() - timestamp : null
        }
    }
}) 
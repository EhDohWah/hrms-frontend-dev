<script>
import { ref, computed, onMounted } from "vue";
import { leaveService } from '@/services/leave.service';
import { employeeService } from '@/services/employee.service';
import { Modal } from 'bootstrap';
import { useToast } from '@/composables/useToast';

const currentDate = ref(new Date());
const currentDateOne = ref(new Date());

export default {
  props: {
    selectedLeaveRequest: {
      type: Object,
      default: null
    },
    isEditMode: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { showSuccess, showError } = useToast();
    return {
      showSuccess,
      showError
    };
  },
  data() {
    return {
      // Form data matching backend requirements
      formData: {
        employee_id: null,
        leave_type_id: null,
        start_date: null,
        end_date: null,
        total_days: 0,
        reason: '',
        documents: []
      },
      editFormData: {
        employee_id: null,
        leave_type_id: null,
        start_date: null,
        end_date: null,
        total_days: 0,
        reason: '',
        documents: []
      },

      // Options loaded from backend
      employees: [],
      employeeTreeData: [],
      leaveTypes: [],

      // Employee search functionality
      employeeSearchQuery: '',
      showEmployeeDropdown: false,
      selectedEmployeeIndex: -1,

      // Static data for demo (replace with API calls)
      Employeename: ["Select", "Anthony Lewis", "Brian Villalobos", "Harvey Smith"],
      Leavetype: ["Select", "Medical Leave", "Casual Leave", "Annual Leave"],

      startdate: currentDate,
      startdateOne: currentDateOne,
      dateFormat: "dd-MM-yyyy",

      // Form state
      isLoading: false,
      errors: {},
      availableBalance: 0,
      selectedLeaveType: null,

      // Notification state
      showNotification: false,
      notificationMessage: '',
      notificationClass: 'alert-success',

      // Document management
      newDocument: {
        document_name: '',
        document_url: '',
        description: ''
      }
    };
  },

  computed: {
    // Calculate total days based on date range
    calculatedDays() {
      if (this.formData.start_date && this.formData.end_date) {
        const start = new Date(this.formData.start_date);
        const end = new Date(this.formData.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
        return diffDays;
      }
      return 0;
    },

    // Check if leave type requires attachments
    requiresAttachment() {
      return this.selectedLeaveType?.requires_attachment || false;
    },

    // Filtered employees based on search query
    filteredEmployees() {
      if (!this.employeeSearchQuery.trim()) {
        return this.employees;
      }

      const query = this.employeeSearchQuery.toLowerCase().trim();
      return this.employees.filter(employee => {
        return (
          employee.staff_id.toLowerCase().includes(query) ||
          employee.name.toLowerCase().includes(query) ||
          employee.subsidiary.toLowerCase().includes(query)
        );
      });
    },

    // Get display text for selected employee
    selectedEmployeeDisplay() {
      const employeeId = this.isEditMode ? this.editFormData.employee_id : this.formData.employee_id;
      if (!employeeId) return this.employeeSearchQuery || '';

      const employee = this.employees.find(emp => emp.id === employeeId);
      return employee ? `${employee.staff_id} - ${employee.name} [${employee.subsidiary}]` : this.employeeSearchQuery || '';
    },

    // Check if we're in edit mode
    isCurrentlyEditing() {
      return this.selectedLeaveRequest && this.selectedLeaveRequest.id;
    }
  },

  watch: {
    // Auto-calculate total days when dates change
    'formData.start_date'() {
      this.updateTotalDays();
    },
    'formData.end_date'() {
      this.updateTotalDays();
    },

    // Load leave balance when employee or leave type changes
    'formData.employee_id'(newVal, oldVal) {
      console.log('👤 Employee ID changed:', oldVal, '→', newVal);
      this.loadLeaveBalance();
    },
    'formData.leave_type_id'(newVal, oldVal) {
      console.log('📋 Leave Type ID changed:', oldVal, '→', newVal);
      this.loadLeaveBalance();
      this.loadLeaveTypeDetails();
    },

    // Watch for selected leave request changes to populate edit form
    selectedLeaveRequest: {
      handler(newVal, oldVal) {
        console.log('👀 selectedLeaveRequest watcher triggered:', { newVal, oldVal });
        if (newVal && newVal.id) {
          // Only populate if this is a different leave request or if we're switching to edit mode
          if (!oldVal || oldVal.id !== newVal.id) {
            console.log('📝 Populating form for different leave request');
            this.populateEditForm(newVal);
          }
        } else {
          console.log('🔄 Resetting form - no leave request selected');
          this.resetForm();
        }
      },
      immediate: false,
      deep: true
    },

    // Auto-calculate total days for edit form
    'editFormData.start_date'() {
      this.updateEditTotalDays();
    },
    'editFormData.end_date'() {
      this.updateEditTotalDays();
    },

    // Load leave balance when employee or leave type changes in edit form
    'editFormData.employee_id'(newVal, oldVal) {
      console.log('👤 Edit Employee ID changed:', oldVal, '→', newVal);
      this.loadEditLeaveBalance();
    },
    'editFormData.leave_type_id'(newVal, oldVal) {
      console.log('📋 Edit Leave Type ID changed:', oldVal, '→', newVal);
      this.loadEditLeaveBalance();
    }
  },

  mounted() {
    this.loadEmployees();
    this.loadLeaveTypes();

    // Initialize modal event listeners for proper cleanup
    this.initializeModalEventListeners();

    // Listen for custom populate edit form event (fallback)
    document.addEventListener('populate-edit-form', (event) => {
      if (event.detail) {
        this.populateEditForm(event.detail);
      }
    });
  },

  beforeUnmount() {
    // Clean up any remaining backdrops when component is destroyed
    this.cleanupModalBackdrops();
  },

  methods: {
    // Initialize modal event listeners for proper backdrop cleanup
    initializeModalEventListeners() {
      const modalElement = document.getElementById('add_leaves');
      if (modalElement) {
        // Clean up when modal is hidden
        modalElement.addEventListener('hidden.bs.modal', () => {
          this.cleanupModalBackdrops();
        });
      }
    },

    // Load employees from backend using tree search
    async loadEmployees() {
      try {
        console.log('🔄 Loading employees using treeSearch...');
        const response = await employeeService.treeSearch();

        if (response.success && response.data) {
          // Store the tree data for tree components if needed
          this.employeeTreeData = response.data;

          // Flatten the tree data for regular select dropdown
          this.employees = this.flattenEmployeeTree(response.data);

          console.log(`✅ Loaded ${this.employees.length} employees from both SMRU and BHF`);
          console.log('Employee data sample:', this.employees.slice(0, 3));
        } else {
          this.employeeTreeData = [];
          this.employees = [];
          console.warn('⚠️ No employee data received from API');
        }
      } catch (error) {
        console.error('❌ Error loading employees:', error);
        // Fallback to static data
        this.employeeTreeData = [];
        this.employees = [
          { id: 1, name: 'Anthony Lewis', staff_id: 'EMP001', subsidiary: 'DEMO' },
          { id: 2, name: 'Brian Villalobos', staff_id: 'EMP002', subsidiary: 'DEMO' },
          { id: 3, name: 'Harvey Smith', staff_id: 'EMP003', subsidiary: 'DEMO' }
        ];
      }
    },

    // Helper method to flatten employee tree for dropdown
    flattenEmployeeTree(treeData) {
      const flattened = [];

      const flatten = (nodes, parentSubsidiary = null) => {
        for (const node of nodes) {
          // Skip subsidiary nodes (they don't have numeric values)
          if (node.value && node.title && !isNaN(node.value)) {
            // Extract staff ID from title (format: "0001 - Name")
            const staffIdMatch = node.title.match(/^(\d+)\s*-\s*(.+)$/);
            const staffId = staffIdMatch ? staffIdMatch[1] : '';
            const employeeName = staffIdMatch ? staffIdMatch[2] : node.title;

            flattened.push({
              id: parseInt(node.value),
              name: employeeName,
              staff_id: staffId,
              subsidiary: parentSubsidiary,
              status: node.status || '',
              fullTitle: node.title // Keep original title for display
            });
          }

          // Process children and pass down subsidiary info
          if (node.children && node.children.length > 0) {
            const subsidiary = node.title === 'SMRU' || node.title === 'BHF' ? node.title : parentSubsidiary;
            flatten(node.children, subsidiary);
          }
        }
      };

      flatten(treeData);
      return flattened;
    },

    // Load leave types from backend
    async loadLeaveTypes() {
      try {
        const response = await leaveService.getLeaveTypes();
        if (response.success && response.data) {
          // Sort leave types to put "Other" at the bottom
          this.leaveTypes = this.sortLeaveTypes(response.data);
        } else {
          this.leaveTypes = [];
        }
      } catch (error) {
        console.error('Error loading leave types:', error);
        // Fallback to static data
        this.leaveTypes = [
          { id: 1, name: 'Medical Leave', requires_attachment: true, default_duration: 1 },
          { id: 2, name: 'Casual Leave', requires_attachment: false, default_duration: 1 },
          { id: 3, name: 'Annual Leave', requires_attachment: false, default_duration: 5 }
        ];
      }
    },

    // Sort leave types to put "Other" at the bottom
    sortLeaveTypes(leaveTypes) {
      if (!leaveTypes || !Array.isArray(leaveTypes)) return [];

      return leaveTypes.sort((a, b) => {
        const aName = (a.name || '').toLowerCase().trim();
        const bName = (b.name || '').toLowerCase().trim();

        // If 'a' is "Other", put it at the end (return positive value)
        if (aName === 'other') return 1;

        // If 'b' is "Other", put 'a' before it (return negative value)
        if (bName === 'other') return -1;

        // For all other items, maintain their original order
        return 0;
      });
    },

    // Load leave type details
    loadLeaveTypeDetails() {
      this.selectedLeaveType = this.leaveTypes.find(type => type.id === this.formData.leave_type_id);
    },

    // Load employee leave balance
    async loadLeaveBalance() {
      if (!this.formData.employee_id || !this.formData.leave_type_id) {
        this.availableBalance = 0;
        return;
      }

      try {
        console.log(`🔄 Loading leave balance for employee ${this.formData.employee_id}, leave type ${this.formData.leave_type_id}`);

        // Call the specific API endpoint: /leaves/balance/{employeeId}/{leaveTypeId}
        const year = new Date().getFullYear();
        const endpoint = `leaves/balance/${this.formData.employee_id}/${this.formData.leave_type_id}?year=${year}`;

        const response = await leaveService.getEmployeeLeaveBalance(this.formData.employee_id, this.formData.leave_type_id, year);

        if (response.success && response.data) {
          this.availableBalance = parseFloat(response.data.remaining_days) || 0;

          console.log(`✅ Leave balance loaded: ${this.availableBalance} days remaining`);
          console.log('Balance details:', {
            employee: response.data.employee_name,
            leaveType: response.data.leave_type_name,
            total: response.data.total_days,
            used: response.data.used_days,
            remaining: response.data.remaining_days
          });
        } else {
          this.availableBalance = 0;
          console.warn('⚠️ No leave balance data found');
        }
      } catch (error) {
        console.error('❌ Error loading leave balance:', error);
        this.availableBalance = 0;

        // Show user-friendly message if balance not found
        if (error.response && error.response.status === 404) {
          console.warn('Leave balance not found for this employee and leave type combination');
        }
      }
    },

    // Update total days calculation
    updateTotalDays() {
      this.formData.total_days = this.calculatedDays;
    },

    // Update total days calculation for edit form
    updateEditTotalDays() {
      if (this.editFormData.start_date && this.editFormData.end_date) {
        const start = new Date(this.editFormData.start_date);
        const end = new Date(this.editFormData.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        this.editFormData.total_days = diffDays;
      } else {
        this.editFormData.total_days = 0;
      }
    },

    // Load leave balance for edit form
    async loadEditLeaveBalance() {
      if (!this.editFormData.employee_id || !this.editFormData.leave_type_id) {
        this.availableBalance = 0;
        return;
      }

      try {
        console.log(`🔄 Loading edit leave balance for employee ${this.editFormData.employee_id}, leave type ${this.editFormData.leave_type_id}`);

        const year = new Date().getFullYear();
        const response = await leaveService.getEmployeeLeaveBalance(this.editFormData.employee_id, this.editFormData.leave_type_id, year);

        if (response.success && response.data) {
          this.availableBalance = parseFloat(response.data.remaining_days) || 0;
          console.log(`✅ Edit leave balance loaded: ${this.availableBalance} days remaining`);
        } else {
          this.availableBalance = 0;
          console.warn('⚠️ No leave balance data found for edit form');
        }
      } catch (error) {
        console.error('❌ Error loading edit leave balance:', error);
        this.availableBalance = 0;
      }
    },

    // Add document to the list
    addDocument() {
      if (this.newDocument.document_name && this.newDocument.document_url) {
        this.formData.documents.push({ ...this.newDocument });
        this.newDocument = {
          document_name: '',
          document_url: '',
          description: ''
        };
      }
    },

    // Remove document from the list
    removeDocument(index) {
      this.formData.documents.splice(index, 1);
    },

    // Format date for backend (YYYY-MM-DD)
    formatDateForBackend(date) {
      if (!date) return null;
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    },

    // Validate form before submission
    validateForm(formData = null) {
      const dataToValidate = formData || this.formData;
      console.log('🔍 Starting form validation...');
      console.log('📋 Current formData:', JSON.stringify(dataToValidate, null, 2));

      this.errors = {};

      if (!dataToValidate.employee_id) {
        this.errors.employee_id = 'Employee is required';
        console.log('❌ Validation error: Missing employee_id');
      }

      if (!dataToValidate.leave_type_id) {
        this.errors.leave_type_id = 'Leave type is required';
        console.log('❌ Validation error: Missing leave_type_id');
      }

      if (!dataToValidate.start_date) {
        this.errors.start_date = 'Start date is required';
        console.log('❌ Validation error: Missing start_date');
      }

      if (!dataToValidate.end_date) {
        this.errors.end_date = 'End date is required';
        console.log('❌ Validation error: Missing end_date');
      }

      if (dataToValidate.total_days <= 0) {
        this.errors.total_days = 'Total days must be greater than 0';
        console.log('❌ Validation error: Invalid total_days:', dataToValidate.total_days);
      }

      if (this.availableBalance > 0 && dataToValidate.total_days > this.availableBalance) {
        this.errors.total_days = `Insufficient leave balance. Available: ${this.availableBalance} days, Requested: ${dataToValidate.total_days} days`;
        console.log('❌ Validation error: Insufficient balance');
      }

      if (this.requiresAttachment && dataToValidate.documents.length === 0) {
        this.errors.documents = 'This leave type requires document attachments';
        console.log('❌ Validation error: Missing required attachments');
      }

      const isValid = Object.keys(this.errors).length === 0;
      console.log(isValid ? '✅ Form validation passed' : '❌ Form validation failed', this.errors);

      return isValid;
    },

    // Submit form to backend
    async submitForm() {
      // Determine if we're editing or creating
      const isEditing = this.isCurrentlyEditing;
      const formDataToUse = isEditing ? this.editFormData : this.formData;

      if (!this.validateForm(formDataToUse)) {
        return;
      }

      this.isLoading = true;

      try {
        // Debug form data before creating payload
        console.log('🔍 Form data before creating payload:', {
          employee_id: formDataToUse.employee_id,
          leave_type_id: formDataToUse.leave_type_id,
          start_date: formDataToUse.start_date,
          end_date: formDataToUse.end_date,
          total_days: formDataToUse.total_days,
          reason: formDataToUse.reason,
          documents: formDataToUse.documents,
          isEditing
        });

        // Validate required fields have values
        if (!formDataToUse.employee_id) {
          console.error('❌ Missing employee_id');
          this.showError('Please select an employee');
          return;
        }

        if (!formDataToUse.leave_type_id) {
          console.error('❌ Missing leave_type_id');
          this.showError('Please select a leave type');
          return;
        }

        const payload = {
          employeeId: parseInt(formDataToUse.employee_id),
          leaveTypeId: parseInt(formDataToUse.leave_type_id),
          startDate: formDataToUse.start_date,
          endDate: formDataToUse.end_date,
          totalDays: parseFloat(formDataToUse.total_days) || 0,
          reason: formDataToUse.reason || null,
          attachments: formDataToUse.documents.length > 0 ? formDataToUse.documents.map(doc => ({
            documentName: doc.document_name,
            documentUrl: doc.document_url,
            description: doc.description
          })) : []
        };

        console.log('📤 Payload being sent:', JSON.stringify(payload, null, 2));

        let response;
        if (isEditing) {
          // Update existing leave request using the ID from editFormData
          const leaveRequestId = formDataToUse.id || this.selectedLeaveRequest.id;
          console.log('🔄 Updating leave request with ID:', leaveRequestId);
          response = await leaveService.updateLeaveRequest(leaveRequestId, payload);
        } else {
          // Create new leave request
          console.log('➕ Creating new leave request');
          response = await leaveService.createLeaveRequest(payload);
        }

        if (response.success) {
          // Success - emit event to parent, show notification, and close modal
          console.log(`✅ Leave request ${isEditing ? 'updated' : 'created'} successfully:`, response.data);

          // Show success notification
          this.showSuccess(response.message || `Leave request ${isEditing ? 'updated' : 'created'} successfully`);

          // Emit event to parent component to refresh the table
          this.$emit('leave-request-created', response.data);

          // Close modal after a brief delay to show the notification
          setTimeout(() => {
            this.safeCloseModal();
          }, 1500);

        } else {
          this.showError(response.message || `Error ${isEditing ? 'updating' : 'creating'} leave request`);
        }

      } catch (error) {
        console.error(`Error ${isEditing ? 'updating' : 'creating'} leave request:`, error);

        if (error.response && error.response.status === 422) {
          // Validation errors
          this.errors = error.response.data.errors || {};
          this.showError('Please check the form for errors');
        } else if (error.response && error.response.status === 400) {
          // Insufficient balance
          this.showError(error.response.data.message);
        } else {
          this.showError(`An error occurred while ${isEditing ? 'updating' : 'creating'} the leave request`);
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Reset form data
    resetForm() {
      this.formData = {
        employee_id: null,
        leave_type_id: null,
        start_date: null,
        end_date: null,
        total_days: 0,
        reason: '',
        documents: []
      };
      this.editFormData = {
        employee_id: null,
        leave_type_id: null,
        start_date: null,
        end_date: null,
        total_days: 0,
        reason: '',
        documents: []
      };
      this.errors = {};
      this.availableBalance = 0;
      this.selectedLeaveType = null;
      this.employeeSearchQuery = '';
      this.showEmployeeDropdown = false;
      this.selectedEmployeeIndex = -1;

      // Reset notification
      this.showNotification = false;
      this.notificationMessage = '';
      this.notificationClass = 'alert-success';
    },

    // Populate edit form with selected leave request data
    populateEditForm(leaveRequest) {
      console.log('📝 Populating edit form with:', leaveRequest);

      // Format dates properly for form inputs
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        try {
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        } catch (error) {
          console.error('Error formatting date:', error);
          return '';
        }
      };

      this.editFormData = {
        id: leaveRequest.id,
        employee_id: leaveRequest.employeeId || leaveRequest.employee_id,
        leave_type_id: leaveRequest.leaveTypeId || leaveRequest.leave_type_id,
        start_date: formatDateForInput(leaveRequest.startDate || leaveRequest.start_date),
        end_date: formatDateForInput(leaveRequest.endDate || leaveRequest.end_date),
        total_days: leaveRequest.totalDays || leaveRequest.total_days || 0,
        reason: leaveRequest.reason || '',
        documents: leaveRequest.attachments || leaveRequest.documents || []
      };

      // Set employee search query for display in edit form
      if (leaveRequest.employee) {
        this.employeeSearchQuery = `${leaveRequest.employee.staffId || leaveRequest.employee.staff_id || ''} - ${leaveRequest.employee.name || leaveRequest.employee.first_name_en + ' ' + leaveRequest.employee.last_name_en || ''} [${leaveRequest.employee.subsidiary || ''}]`;
      }

      // Update form data for create mode (backup)
      if (!this.isEditMode) {
        this.formData = { ...this.editFormData };
      }

      console.log('✅ Edit form populated:', this.editFormData);
      console.log('Employee search query set to:', this.employeeSearchQuery);

      // Load leave balance for this combination
      this.loadEditLeaveBalance();
    },

    // Method to open edit modal (called from parent)
    openEditModal(leaveRequest) {
      console.log('🔓 Opening edit modal with leave request:', leaveRequest);
      this.populateEditForm(leaveRequest);

      // Open the edit modal
      const editModal = new Modal(document.getElementById('edit_leaves'));
      editModal.show();
    },

    // Employee search methods
    onEmployeeSearchInput() {
      this.showEmployeeDropdown = true;
      this.selectedEmployeeIndex = -1;

      // Clear selected employee if search doesn't match
      if (this.formData.employee_id && this.selectedEmployeeDisplay.toLowerCase().indexOf(this.employeeSearchQuery.toLowerCase()) === -1) {
        this.formData.employee_id = null;
      }
    },

    onEmployeeSearchFocus() {
      this.showEmployeeDropdown = true;
      this.selectedEmployeeIndex = -1;
    },

    onEmployeeSearchBlur() {
      // Delay hiding dropdown to allow for clicks
      setTimeout(() => {
        this.showEmployeeDropdown = false;
        this.selectedEmployeeIndex = -1;
      }, 200);
    },

    selectEmployee(employee) {
      console.log('👤 Selecting employee:', employee);
      this.formData.employee_id = employee.id;
      this.employeeSearchQuery = `${employee.staff_id} - ${employee.name} [${employee.subsidiary}]`;
      this.showEmployeeDropdown = false;
      this.selectedEmployeeIndex = -1;

      console.log('✅ Employee selected - formData.employee_id set to:', this.formData.employee_id);

      // Trigger leave balance loading
      this.loadLeaveBalance();
    },

    onEmployeeKeyDown(event) {
      if (!this.showEmployeeDropdown) return;

      const filteredList = this.filteredEmployees;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.selectedEmployeeIndex = Math.min(this.selectedEmployeeIndex + 1, filteredList.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.selectedEmployeeIndex = Math.max(this.selectedEmployeeIndex - 1, -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (this.selectedEmployeeIndex >= 0 && filteredList[this.selectedEmployeeIndex]) {
            this.selectEmployee(filteredList[this.selectedEmployeeIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          this.showEmployeeDropdown = false;
          this.selectedEmployeeIndex = -1;
          break;
      }
    },

    clearEmployeeSelection() {
      this.formData.employee_id = null;
      this.employeeSearchQuery = '';
      this.showEmployeeDropdown = false;
      this.selectedEmployeeIndex = -1;
    },

    // Debug method to check current form state
    debugFormState() {
      console.log('🐛 DEBUG: Current form state');
      console.log('📋 formData:', JSON.stringify(this.formData, null, 2));
      console.log('🔍 employeeSearchQuery:', this.employeeSearchQuery);
      console.log('⚖️ availableBalance:', this.availableBalance);
      console.log('❌ errors:', this.errors);
    },

    // Show success notification with leave request details
    showSuccessNotification(response) {
      const leaveData = response.data;
      const employeeName = `${leaveData.employee.first_name_en} ${leaveData.employee.last_name_en}`;
      const leaveType = leaveData.leave_type.name;
      const totalDays = leaveData.total_days;

      // Show inline notification in the modal
      this.notificationMessage = `Leave request created successfully! Employee: ${employeeName} (${leaveData.employee.staff_id}), Leave Type: ${leaveType}, Duration: ${totalDays} days, Request ID: #${leaveData.id}`;
      this.notificationClass = 'alert-success';
      this.showNotification = true;

      // Create a detailed success message for external notifications
      const message = `Leave request created successfully!\n\nEmployee: ${employeeName} (${leaveData.employee.staff_id})\nLeave Type: ${leaveType}\nDuration: ${totalDays} days\nStatus: ${leaveData.status}\nRequest ID: #${leaveData.id}`;

      // Show external notification if available
      if (this.$swal) {
        this.$swal.fire({
          icon: 'success',
          title: 'Leave Request Created!',
          html: message.replace(/\n/g, '<br>'),
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true
        });
      } else {
        this.showSuccess(message);
      }
    },

    // Close modal properly
    closeModal() {
      // Reset form data
      this.resetForm();

      // Close the Bootstrap modal with proper cleanup
      const modalElement = document.getElementById('add_leaves');
      if (modalElement) {
        const modal = Modal.getInstance(modalElement);
        if (modal) {
          modalElement.addEventListener('hidden.bs.modal', () => {
            this.cleanupModalBackdrops();
          }, { once: true });

          modal.hide();
        }
      }
    },

    // Safe modal close with promise-based cleanup
    safeCloseModal() {
      return new Promise((resolve) => {
        // Reset form data first
        this.resetForm();

        this.$nextTick(() => {
          const modalElement = document.getElementById('add_leaves');
          if (modalElement) {
            const modal = Modal.getInstance(modalElement);
            if (modal) {
              // Add event listener for when modal is fully hidden
              modalElement.addEventListener('hidden.bs.modal', () => {
                this.cleanupModalBackdrops();
                resolve(true);
              }, { once: true });

              modal.hide();
            } else {
              this.cleanupModalBackdrops();
              resolve(true);
            }
          } else {
            this.cleanupModalBackdrops();
            resolve(true);
          }
        });
      });
    },

    // Clean up stray modal backdrops
    cleanupModalBackdrops() {
      // Use nextTick to ensure DOM updates are complete
      this.$nextTick(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        const activeModals = document.querySelectorAll('.modal.show');

        // Only remove backdrops if no active modals are present
        if (activeModals.length === 0 && backdrops.length > 0) {
          backdrops.forEach(backdrop => {
            backdrop.remove();
          });

          // Also ensure body classes are cleaned up
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('padding-right');
        }
      });
    },

    // Close edit modal and reset form data
    closeEditModal() {
      console.log('🚪 Closing edit modal and resetting form data');

      // Reset all form data
      this.resetEditForm();
      this.resetForm();

      // Clear selected leave request in parent component
      this.$emit('clear-selection');

      // Close the modal
      const editModal = Modal.getInstance(document.getElementById('edit_leaves'));
      if (editModal) {
        editModal.hide();
      }

      // Clean up any modal backdrops
      this.cleanupModalBackdrops();
    },

    // Test method to verify edit functionality
    testEditMode(sampleData = null) {
      const testData = sampleData || {
        id: 1,
        employee_id: 1,
        leave_type_id: 1,
        start_date: '2024-01-15',
        end_date: '2024-01-17',
        total_days: 3,
        reason: 'Test leave request for editing',
        employee: {
          staff_id: 'EMP001',
          name: 'John Doe',
          subsidiary: 'SMRU'
        }
      };

      console.log('🧪 Testing edit mode with data:', testData);
      this.populateEditForm(testData);
      return testData;
    },

    // Reset edit form specifically 
    resetEditForm() {
      this.editFormData = {
        id: null,
        employee_id: null,
        leave_type_id: null,
        start_date: null,
        end_date: null,
        total_days: 0,
        reason: '',
        documents: []
      };
      this.employeeSearchQuery = '';
      this.availableBalance = 0;
      this.errors = {};
      this.showNotification = false;
      this.notificationMessage = '';
      this.notificationClass = 'alert-success';
      console.log('🔄 Edit form reset');
    }
  }
};
</script>

<template>
  <!-- Add Leaves -->
  <div class="modal fade" id="add_leaves">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Leave</h4>
          <button type="button" class="btn-close custom-btn-close" @click="safeCloseModal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <!-- Success Notification -->
            <div v-if="showNotification" class="alert" :class="notificationClass" role="alert">
              <i class="ti ti-check-circle me-2"></i>
              {{ notificationMessage }}
            </div>

            <div class="row">
              <!-- Employee Selection -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Employee Name <span class="text-danger">*</span></label>
                  <div class="position-relative">
                    <input type="text" v-model="employeeSearchQuery" @input="onEmployeeSearchInput"
                      @focus="onEmployeeSearchFocus" @blur="onEmployeeSearchBlur" @keydown="onEmployeeKeyDown"
                      class="form-control" :class="{ 'is-invalid': errors.employee_id }"
                      placeholder="Type to search by Staff ID, Name, or Subsidiary..." autocomplete="off" />

                    <!-- Clear button -->
                    <button v-if="formData.employee_id" type="button" @click="clearEmployeeSelection"
                      class="btn btn-sm position-absolute"
                      style="right: 8px; top: 50%; transform: translateY(-50%); border: none; background: none; color: #6c757d;">
                      <i class="ti ti-x"></i>
                    </button>

                    <!-- Dropdown list -->
                    <div v-if="showEmployeeDropdown && filteredEmployees.length > 0"
                      class="dropdown-menu show position-absolute w-100"
                      style="max-height: 300px; overflow-y: auto; z-index: 1050;">
                      <div v-for="(employee, index) in filteredEmployees" :key="employee.id"
                        @mousedown="selectEmployee(employee)" class="dropdown-item"
                        :class="{ 'active': index === selectedEmployeeIndex }" style="cursor: pointer;">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{{ employee.staff_id }}</strong> - {{ employee.name }}
                          </div>
                          <small class="text-muted">[{{ employee.subsidiary }}]</small>
                        </div>
                        <small class="text-muted">{{ employee.status }}</small>
                      </div>
                    </div>

                    <!-- No results message -->
                    <div v-if="showEmployeeDropdown && filteredEmployees.length === 0 && employeeSearchQuery.trim()"
                      class="dropdown-menu show position-absolute w-100" style="z-index: 1050;">
                      <div class="dropdown-item-text text-muted">
                        No employees found for "{{ employeeSearchQuery }}"
                      </div>
                    </div>
                  </div>
                  <div v-if="errors.employee_id" class="invalid-feedback">{{ errors.employee_id }}</div>
                </div>
              </div>

              <!-- Leave Type Selection -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Leave Type <span class="text-danger">*</span></label>
                  <select v-model="formData.leave_type_id" class="form-select"
                    :class="{ 'is-invalid': errors.leave_type_id }">
                    <option value="">Select Leave Type</option>
                    <option v-for="leaveType in leaveTypes" :key="leaveType.id" :value="leaveType.id">
                      {{ leaveType.name }}
                    </option>
                  </select>
                  <div v-if="errors.leave_type_id" class="invalid-feedback">{{ errors.leave_type_id }}</div>
                </div>
              </div>

              <!-- Available Leave Balance -->
              <div v-if="formData.employee_id && formData.leave_type_id" class="col-md-12">
                <div class="mb-3">
                  <div class="alert alert-info d-flex justify-content-between align-items-center">
                    <div>
                      <i class="ti ti-info-circle me-2"></i>
                      <strong>Available Leave Balance:</strong>
                    </div>
                    <div class="badge bg-primary fs-6 px-3 py-2">
                      {{ availableBalance }} days
                    </div>
                  </div>
                </div>
              </div>

              <!-- Date Range -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">From <span class="text-danger">*</span></label>
                  <input type="date" v-model="formData.start_date" class="form-control"
                    :class="{ 'is-invalid': errors.start_date }" :min="new Date().toISOString().split('T')[0]" />
                  <div v-if="errors.start_date" class="invalid-feedback">{{ errors.start_date }}</div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">To <span class="text-danger">*</span></label>
                  <input type="date" v-model="formData.end_date" class="form-control"
                    :class="{ 'is-invalid': errors.end_date }"
                    :min="formData.start_date || new Date().toISOString().split('T')[0]" />
                  <div v-if="errors.end_date" class="invalid-feedback">{{ errors.end_date }}</div>
                </div>
              </div>

              <!-- Days Information -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Total Days <span class="text-danger">*</span></label>
                  <input type="number" v-model="formData.total_days" class="form-control"
                    :class="{ 'is-invalid': errors.total_days }" step="0.5" min="0.5" readonly />
                  <div v-if="errors.total_days" class="invalid-feedback">{{ errors.total_days }}</div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Available Balance</label>
                  <input type="text" :value="availableBalance + ' days'" class="form-control" readonly />
                  <small class="text-muted">Your current leave balance</small>
                </div>
              </div>

              <!-- Reason -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Reason</label>
                  <textarea v-model="formData.reason" class="form-control" rows="3" maxlength="1000"
                    placeholder="Enter reason for leave request"></textarea>
                  <small class="text-muted">{{ formData.reason.length }}/1000 characters</small>
                </div>
              </div>

              <!-- Document Attachments -->
              <div class="col-md-12" v-if="requiresAttachment || formData.documents.length > 0">
                <div class="mb-3">
                  <label class="form-label">
                    Document Attachments
                    <span v-if="requiresAttachment" class="text-danger">*</span>
                  </label>

                  <!-- Existing Documents -->
                  <div v-if="formData.documents.length > 0" class="mb-2">
                    <div v-for="(doc, index) in formData.documents" :key="index"
                      class="d-flex align-items-center justify-content-between p-2 border rounded mb-2">
                      <div>
                        <strong>{{ doc.document_name }}</strong>
                        <br>
                        <small class="text-muted">{{ doc.description || 'No description' }}</small>
                      </div>
                      <button type="button" @click="removeDocument(index)" class="btn btn-sm btn-outline-danger">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Add New Document -->
                  <div class="border rounded p-3">
                    <div class="row">
                      <div class="col-md-6">
                        <input type="text" v-model="newDocument.document_name" class="form-control mb-2"
                          placeholder="Document Name" />
                      </div>
                      <div class="col-md-6">
                        <input type="url" v-model="newDocument.document_url" class="form-control mb-2"
                          placeholder="Document URL" />
                      </div>
                      <div class="col-md-8">
                        <input type="text" v-model="newDocument.description" class="form-control"
                          placeholder="Description (optional)" />
                      </div>
                      <div class="col-md-4">
                        <button type="button" @click="addDocument" class="btn btn-outline-primary w-100">
                          Add Document
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="errors.documents" class="text-danger mt-1">{{ errors.documents }}</div>
                </div>
              </div>

              <!-- Attachment Requirement Notice -->
              <div class="col-md-12" v-if="requiresAttachment && formData.documents.length === 0">
                <div class="alert alert-warning">
                  <i class="ti ti-alert-triangle"></i>
                  This leave type requires document attachments. Please add at least one document.
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" @click="safeCloseModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Creating...' : 'Add Leave Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Leaves -->

  <!-- Edit Leaves -->
  <div class="modal fade" id="edit_leaves">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ isCurrentlyEditing ? 'Edit Leave Request' : 'Edit Leave' }}</h4>
          <button type="button" class="btn-close custom-btn-close" @click="closeEditModal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <!-- Employee Selection (Read-only in edit mode) -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Employee Name</label>
                  <input type="text" class="form-control" :value="selectedEmployeeDisplay" readonly />
                </div>
              </div>

              <!-- Leave Type Selection -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Leave Type <span class="text-danger">*</span></label>
                  <select v-model="editFormData.leave_type_id" class="form-select"
                    :class="{ 'is-invalid': errors.leave_type_id }">
                    <option value="">Select Leave Type</option>
                    <option v-for="leaveType in leaveTypes" :key="leaveType.id" :value="leaveType.id">
                      {{ leaveType.name }}
                    </option>
                  </select>
                  <div v-if="errors.leave_type_id" class="invalid-feedback">{{ errors.leave_type_id }}</div>
                </div>
              </div>

              <!-- Available Leave Balance -->
              <div v-if="editFormData.employee_id && editFormData.leave_type_id" class="col-md-12">
                <div class="mb-3">
                  <div class="alert alert-info d-flex justify-content-between align-items-center">
                    <div>
                      <i class="ti ti-info-circle me-2"></i>
                      <strong>Available Leave Balance:</strong>
                    </div>
                    <div class="badge bg-primary fs-6 px-3 py-2">
                      {{ availableBalance }} days
                    </div>
                  </div>
                </div>
              </div>

              <!-- Date Range -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">From <span class="text-danger">*</span></label>
                  <input type="date" v-model="editFormData.start_date" class="form-control"
                    :class="{ 'is-invalid': errors.start_date }" />
                  <div v-if="errors.start_date" class="invalid-feedback">{{ errors.start_date }}</div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">To <span class="text-danger">*</span></label>
                  <input type="date" v-model="editFormData.end_date" class="form-control"
                    :class="{ 'is-invalid': errors.end_date }" :min="editFormData.start_date" />
                  <div v-if="errors.end_date" class="invalid-feedback">{{ errors.end_date }}</div>
                </div>
              </div>

              <!-- Days Information -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Total Days <span class="text-danger">*</span></label>
                  <input type="number" v-model="editFormData.total_days" class="form-control"
                    :class="{ 'is-invalid': errors.total_days }" step="0.5" min="0.5" readonly />
                  <div v-if="errors.total_days" class="invalid-feedback">{{ errors.total_days }}</div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Available Balance</label>
                  <input type="text" :value="availableBalance + ' days'" class="form-control" readonly />
                  <small class="text-muted">Current leave balance</small>
                </div>
              </div>

              <!-- Reason -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Reason</label>
                  <textarea v-model="editFormData.reason" class="form-control" rows="3" maxlength="1000"
                    placeholder="Enter reason for leave request"></textarea>
                  <small class="text-muted">{{ editFormData.reason.length }}/1000 characters</small>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" @click="closeEditModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Leaves -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
            <i class="ti ti-trash-x fs-36"></i>
          </span>
          <h4 class="mb-1">Confirm Delete</h4>
          <p class="mb-3">
            You want to delete all the marked items, this cant be undone once you delete.
          </p>
          <div class="d-flex justify-content-center">
            <a href="javascript:void(0);" class="btn btn-light me-3" @click="safeCloseModal">Cancel</a>
            <router-link to="/leave/leaves-admin" class="btn btn-danger">Yes, Delete</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

<style scoped>
/* Searchable dropdown styles */
.dropdown-menu {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  margin-top: 2px;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.15s ease-in-out;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover,
.dropdown-item.active {
  background-color: #e9ecef;
  color: #495057;
}

.dropdown-item strong {
  color: #007bff;
}

.dropdown-item-text {
  padding: 0.75rem 1rem;
  font-style: italic;
}

/* Clear button hover effect */
.btn:hover i {
  color: #dc3545 !important;
}

/* Input focus enhancement */
.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Loading state */
.dropdown-menu .text-center {
  padding: 1rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .dropdown-menu {
    font-size: 0.9rem;
  }

  .dropdown-item {
    padding: 0.5rem 0.75rem;
  }
}

/* Leave balance display */
.alert-info {
  border: 1px solid #bee5eb;
  background-color: #d1ecf1;
  color: #0c5460;
}

.badge.bg-primary {
  background-color: #0d6efd !important;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Form validation styles */
.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>

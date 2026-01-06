<script>
import { ref, computed, onMounted } from "vue";
import { leaveService } from '@/services/leave.service';
import { employeeService } from '@/services/employee.service';
import { Modal } from 'bootstrap';
import { useToast } from '@/composables/useToast';
import { useLeaveStore } from '@/stores/leaveStore';

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
    const leaveStore = useLeaveStore();

    return {
      showSuccess,
      showError,
      leaveStore
    };
  },
  data() {
    return {
      // Form data matching backend requirements (v2.0 - Multi-leave-type support)
      formData: {
        employee_id: null,
        start_date: null,
        end_date: null,
        total_days: 0,
        reason: '',
        status: 'pending',
        // Multi-leave-type support (v2.0 - Combined dates per item)
        items: [
          {
            leave_type_id: null,
            start_date: null,
            end_date: null,
            days: 0
          }
        ],
        // Approval fields - boolean flags with dates (v4.1 - combined HR/Site Admin)
        supervisor_approved: false,
        supervisor_approved_date: null,
        hr_site_admin_approved: false,
        hr_site_admin_approved_date: null,
        attachment_notes: ''
      },
      editFormData: {
        employee_id: null,
        start_date: null,
        end_date: null,
        total_days: 0,
        reason: '',
        status: 'pending',
        // Multi-leave-type support (v2.0 - Combined dates per item)
        items: [
          {
            leave_type_id: null,
            start_date: null,
            end_date: null,
            days: 0
          }
        ],
        // Approval fields - boolean flags with dates (v4.1 - combined HR/Site Admin)
        supervisor_approved: false,
        supervisor_approved_date: null,
        hr_site_admin_approved: false,
        hr_site_admin_approved_date: null,
        attachment_notes: ''
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
      displayFormat: "dd/MM/yyyy",
      inputFormat: "yyyy-MM-dd",

      // Form state
      isLoading: false,
      errors: {},
      // Multi-type balance tracking (v2.0)
      itemBalances: {}, // Store balance for each leave type { leaveTypeId: balance }
      isLoadingBalances: {}, // Track loading state per leave type
      selectedLeaveType: null,
      isLoadingBalance: false, // Prevent duplicate balance API calls
      balanceLoadTimeout: null, // Debounce balance loading

      // Notification state
      showNotification: false,
      notificationMessage: '',
      notificationClass: 'alert-success',

      // Removed document management - using attachment_notes only
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
          employee.organization.toLowerCase().includes(query)
        );
      });
    },

    // Get display text for selected employee
    selectedEmployeeDisplay() {
      const employeeId = this.isCurrentlyEditing ? this.editFormData.employee_id : this.formData.employee_id;
      if (!employeeId) return this.employeeSearchQuery || '';

      const employee = this.employees.find(emp => emp.id === employeeId);
      return employee ? `${employee.staff_id} - ${employee.name} [${employee.organization}]` : this.employeeSearchQuery || '';
    },

    // Check if we're in edit mode (either via prop or editFormData.id)
    isCurrentlyEditing() {
      return (this.selectedLeaveRequest && this.selectedLeaveRequest.id) || (this.editFormData && this.editFormData.id);
    },

    // Get total allocated days from items (v2.0)
    getAllocatedDays() {
      const formDataToUse = this.isCurrentlyEditing ? this.editFormData : this.formData;
      if (!formDataToUse.items || !Array.isArray(formDataToUse.items)) return 0;
      return formDataToUse.items.reduce((sum, item) => sum + (parseFloat(item.days) || 0), 0);
    },

    // Get remaining days to allocate (v2.0)
    getRemainingDays() {
      const formDataToUse = this.isCurrentlyEditing ? this.editFormData : this.formData;
      const total = parseFloat(formDataToUse.total_days) || 0;
      return total - this.getAllocatedDays;
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
      if (newVal && this.formData.leave_type_id) {
        this.loadLeaveBalance();
      } else if (!newVal) {
        this.availableBalance = 0;
      }
    },
    'formData.leave_type_id'(newVal, oldVal) {
      console.log('📋 Leave Type ID changed:', oldVal, '→', newVal);
      this.loadLeaveTypeDetails();
      if (newVal && this.formData.employee_id) {
        this.loadLeaveBalance();
      } else if (!newVal) {
        this.availableBalance = 0;
      }
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
      if (newVal && this.editFormData.leave_type_id) {
        this.debouncedLoadEditBalance();
      } else if (!newVal) {
        this.availableBalance = 0;
      }
    },
    'editFormData.leave_type_id'(newVal, oldVal) {
      console.log('📋 Edit Leave Type ID changed:', oldVal, '→', newVal);
      if (newVal && this.editFormData.employee_id) {
        this.debouncedLoadEditBalance();
      } else if (!newVal) {
        this.availableBalance = 0;
      }
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
          { id: 1, name: 'Anthony Lewis', staff_id: 'EMP001', organization: 'DEMO' },
          { id: 2, name: 'Brian Villalobos', staff_id: 'EMP002', organization: 'DEMO' },
          { id: 3, name: 'Harvey Smith', staff_id: 'EMP003', organization: 'DEMO' }
        ];
      }
    },

    // Helper method to flatten employee tree for dropdown
    flattenEmployeeTree(treeData) {
      const flattened = [];

      const flatten = (nodes, parentOrganization = null) => {
        for (const node of nodes) {
          // Skip organization nodes (they don't have numeric values)
          if (node.value && node.title && !isNaN(node.value)) {
            // Extract staff ID from title (format: "0001 - Name")
            const staffIdMatch = node.title.match(/^(\d+)\s*-\s*(.+)$/);
            const staffId = staffIdMatch ? staffIdMatch[1] : '';
            const employeeName = staffIdMatch ? staffIdMatch[2] : node.title;

            flattened.push({
              id: parseInt(node.value),
              name: employeeName,
              staff_id: staffId,
              organization: parentOrganization,
              status: node.status || '',
              fullTitle: node.title // Keep original title for display
            });
          }

          // Process children and pass down organization info
          if (node.children && node.children.length > 0) {
            const organization = node.title === 'SMRU' || node.title === 'BHF' ? node.title : parentOrganization;
            flatten(node.children, organization);
          }
        }
      };

      flatten(treeData);
      return flattened;
    },

    // Load leave types from backend (using non-paginated dropdown endpoint)
    async loadLeaveTypes() {
      try {
        const response = await leaveService.getLeaveTypesForDropdown();
        if (response.success && response.data) {
          // Sort leave types to put "Other" at the bottom
          this.leaveTypes = this.sortLeaveTypes(response.data);
          console.log(`✅ Modal loaded ${this.leaveTypes.length} leave types for dropdown`);
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

    // ==================== MULTI-LEAVE-TYPE MANAGEMENT (v2.0) ====================

    // Add new leave type item to the form
    addLeaveTypeItem(isEditMode = false) {
      const formDataToUse = isEditMode ? this.editFormData : this.formData;

      formDataToUse.items.push({
        leave_type_id: null,
        start_date: null,
        end_date: null,
        days: 0
      });

      console.log('➕ Added new leave type item. Total items:', formDataToUse.items.length);
    },

    // Remove leave type item from the form
    removeLeaveTypeItem(index, isEditMode = false) {
      const formDataToUse = isEditMode ? this.editFormData : this.formData;

      if (formDataToUse.items.length > 1) {
        const removedItem = formDataToUse.items.splice(index, 1)[0];
        console.log('➖ Removed leave type item at index:', index);

        // Remove balance for this leave type
        if (removedItem.leave_type_id) {
          delete this.itemBalances[removedItem.leave_type_id];
        }

        // Recalculate total days
        this.updateTotalDaysFromItems(isEditMode);
      } else {
        this.showError('At least one leave type is required');
      }
    },

    // Update total days from all items
    // Trigger reactivity update for allocation display (v2.0)
    // Note: Total days now come from date range, not sum of items
    // This method just triggers UI updates for allocation tracking
    updateTotalDaysFromItems(isEditMode = false) {
      // Force computed properties to recalculate
      this.$forceUpdate();
      console.log('🔄 Allocation updated - Allocated:', this.getAllocatedDays, 'Remaining:', this.getRemainingDays);
    },

    // Check if leave type is already selected in items
    isLeaveTypeSelected(leaveTypeId, currentIndex, isEditMode = false) {
      const formDataToUse = isEditMode ? this.editFormData : this.formData;

      return formDataToUse.items.some((item, index) => {
        return index !== currentIndex && item.leave_type_id === leaveTypeId;
      });
    },

    // Get available leave types for dropdown (excluding already selected)
    getAvailableLeaveTypes(currentIndex, isEditMode = false) {
      return this.leaveTypes.filter(type => {
        return !this.isLeaveTypeSelected(type.id, currentIndex, isEditMode);
      });
    },

    // Handle leave type change for an item
    async onLeaveTypeChange(index, isEditMode = false) {
      const formDataToUse = isEditMode ? this.editFormData : this.formData;
      const item = formDataToUse.items[index];

      console.log(`📋 Leave type changed for item ${index}:`, item.leave_type_id);

      // Load balance for this leave type
      if (item.leave_type_id && formDataToUse.employee_id) {
        await this.loadBalanceForItem(item.leave_type_id);
      }
    },

    // Load balance for a specific leave type item
    async loadBalanceForItem(leaveTypeId) {
      const employeeId = this.isCurrentlyEditing ? this.editFormData.employee_id : this.formData.employee_id;

      if (!employeeId || !leaveTypeId) {
        return;
      }

      // Prevent duplicate API calls for same leave type
      if (this.isLoadingBalances[leaveTypeId]) {
        console.log(`⏳ Balance loading already in progress for leave type ${leaveTypeId}`);
        return;
      }

      this.isLoadingBalances[leaveTypeId] = true;

      try {
        console.log(`📊 Loading balance for leave type ${leaveTypeId}`);

        const year = new Date().getFullYear();
        const result = await this.leaveStore.getOrFetchLeaveBalance(
          employeeId,
          leaveTypeId,
          year
        );

        if (result.success && result.data) {
          let remainingDays = 0;

          if (result.data.remainingDays !== undefined) {
            remainingDays = parseFloat(result.data.remainingDays);
          } else if (result.data.remaining_days !== undefined) {
            remainingDays = parseFloat(result.data.remaining_days);
          }

          this.itemBalances[leaveTypeId] = remainingDays || 0;
          this.$forceUpdate();

          console.log(`✅ Balance loaded for type ${leaveTypeId}: ${remainingDays} days`);
        }
      } catch (error) {
        console.error(`❌ Error loading balance for leave type ${leaveTypeId}:`, error);
        this.itemBalances[leaveTypeId] = 0;
      } finally {
        this.isLoadingBalances[leaveTypeId] = false;
      }
    },

    // Load balances for all items
    async loadBalancesForAllItems(isEditMode = false) {
      const formDataToUse = isEditMode ? this.editFormData : this.formData;

      if (!formDataToUse.employee_id) {
        return;
      }

      for (const item of formDataToUse.items) {
        if (item.leave_type_id) {
          await this.loadBalanceForItem(item.leave_type_id);
        }
      }
    },

    // Get balance for a specific leave type
    getBalanceForType(leaveTypeId) {
      return this.itemBalances[leaveTypeId] || 0;
    },

    // Validate balances for all items
    validateItemBalances(isEditMode = false) {
      const formDataToUse = isEditMode ? this.editFormData : this.formData;

      for (const item of formDataToUse.items) {
        if (!item.leave_type_id) continue;

        const balance = this.getBalanceForType(item.leave_type_id);
        const requestedDays = parseFloat(item.days) || 0;

        if (requestedDays > balance) {
          const leaveType = this.leaveTypes.find(t => t.id === item.leave_type_id);
          this.showError(`Insufficient balance for ${leaveType?.name}. Available: ${balance} days, Requested: ${requestedDays} days`);
          return false;
        }
      }

      return true;
    },

    // ==================== END MULTI-LEAVE-TYPE MANAGEMENT ====================

    // Load leave type details (Deprecated - kept for compatibility)
    loadLeaveTypeDetails() {
      // For backward compatibility - check if formData has leave_type_id
      if (this.formData.leave_type_id) {
        this.selectedLeaveType = this.leaveTypes.find(type => type.id === this.formData.leave_type_id);
      }
    },

    // Debounced balance loading to prevent multiple simultaneous calls
    debouncedLoadEditBalance() {
      if (this.balanceLoadTimeout) {
        clearTimeout(this.balanceLoadTimeout);
      }

      this.balanceLoadTimeout = setTimeout(() => {
        this.loadEditLeaveBalance();
      }, 100); // 100ms debounce
    },

    // Load employee leave balance using store
    async loadLeaveBalance() {
      if (!this.formData.employee_id || !this.formData.leave_type_id) {
        this.availableBalance = 0;
        return;
      }

      // Prevent duplicate API calls
      if (this.isLoadingBalance) {
        console.log('⏳ Balance loading already in progress, skipping duplicate call');
        return;
      }

      this.isLoadingBalance = true;

      try {
        console.log(`📊 Loading leave balance from store for employee ${this.formData.employee_id}, leave type ${this.formData.leave_type_id}`);

        const year = new Date().getFullYear();
        const result = await this.leaveStore.getOrFetchLeaveBalance(
          this.formData.employee_id,
          this.formData.leave_type_id,
          year
        );

        console.log('🔍 Balance Result:', result);

        if (result.success && result.data) {
          // Handle both mapped and unmapped response data
          let remainingDays = 0;

          if (result.data.remainingDays !== undefined) {
            remainingDays = parseFloat(result.data.remainingDays);
          } else if (result.data.remaining_days !== undefined) {
            remainingDays = parseFloat(result.data.remaining_days);
          } else if (result.data.balance !== undefined) {
            remainingDays = parseFloat(result.data.balance);
          }

          console.log(`🔍 Extracted remainingDays: ${remainingDays} (${result.fromCache ? 'from cache' : 'from API'})`);
          this.availableBalance = remainingDays || 0;
          this.$forceUpdate();

          console.log(`✅ Leave balance loaded: ${this.availableBalance} days remaining`);
        } else {
          this.availableBalance = 0;
          this.$forceUpdate();
          console.warn('⚠️ No leave balance data found:', result);
        }
      } catch (error) {
        console.error('❌ Error loading leave balance:', error);
        this.availableBalance = 0;
        this.$forceUpdate();
      } finally {
        this.isLoadingBalance = false;
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

    // Load leave balance for edit form using store (v2.0 - Multi-leave-type support)
    async loadEditLeaveBalance() {
      if (!this.editFormData.employee_id) {
        console.log('⚠️ No employee selected in edit form');
        return;
      }

      if (!this.editFormData.items || this.editFormData.items.length === 0) {
        console.log('⚠️ No leave type items in edit form');
        return;
      }

      console.log(`📊 Loading balances for ${this.editFormData.items.length} leave type(s) in edit form`);

      // Load balances for all items
      for (const item of this.editFormData.items) {
        if (item.leave_type_id) {
          // Mark as loading
          this.isLoadingBalances[item.leave_type_id] = true;

          try {
            const year = new Date().getFullYear();
            const result = await this.leaveStore.getOrFetchLeaveBalance(
              this.editFormData.employee_id,
              item.leave_type_id,
              year
            );

            if (result.success && result.data) {
              // Handle both mapped and unmapped response data
              let remainingDays = 0;

              if (result.data.remainingDays !== undefined) {
                remainingDays = parseFloat(result.data.remainingDays);
              } else if (result.data.remaining_days !== undefined) {
                remainingDays = parseFloat(result.data.remaining_days);
              } else if (result.data.balance !== undefined) {
                remainingDays = parseFloat(result.data.balance);
              }

              this.itemBalances[item.leave_type_id] = remainingDays || 0;
              console.log(`✅ Balance loaded for leave type ${item.leave_type_id}: ${this.itemBalances[item.leave_type_id]} days`);
            } else {
              this.itemBalances[item.leave_type_id] = 0;
              console.warn(`⚠️ No balance data for leave type ${item.leave_type_id}`);
            }
          } catch (error) {
            console.error(`❌ Error loading balance for leave type ${item.leave_type_id}:`, error);
            this.itemBalances[item.leave_type_id] = 0;
          } finally {
            this.isLoadingBalances[item.leave_type_id] = false;
          }
        }
      }

      this.$forceUpdate();
      console.log('✅ All edit form balances loaded:', this.itemBalances);
    },

    // Document management removed - using attachment_notes only

    // Handle date picker changes for add form
    handleDateChange(fieldName, newValue) {
      try {
        const safeDate = this.safeConvertToDate(newValue);
        this.formData[fieldName] = safeDate;
      } catch (error) {
        console.error('Error handling date change:', error);
      }
    },

    // Handle date picker changes for edit form
    handleEditDateChange(fieldName, newValue) {
      try {
        const safeDate = this.safeConvertToDate(newValue);
        this.editFormData[fieldName] = safeDate;
      } catch (error) {
        console.error('Error handling edit date change:', error);
      }
    },

    // Handle date changes for individual items (v2.0 - Combined dates per item)
    handleItemDateChange(index, fieldName, newValue, isEditMode = false) {
      try {
        const safeDate = this.safeConvertToDate(newValue);
        const formDataToUse = isEditMode ? this.editFormData : this.formData;

        if (!formDataToUse.items[index]) return;

        formDataToUse.items[index][fieldName] = safeDate;

        // Auto-calculate days when both dates are set
        if (formDataToUse.items[index].start_date && formDataToUse.items[index].end_date) {
          const start = new Date(formDataToUse.items[index].start_date);
          const end = new Date(formDataToUse.items[index].end_date);
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          formDataToUse.items[index].days = diffDays;

          console.log(`📅 Item ${index + 1} days calculated:`, diffDays);
        }

        // Update total days and validate
        this.updateTotalDaysFromAllItems(isEditMode);
      } catch (error) {
        console.error('Error handling item date change:', error);
      }
    },

    // Update total days by summing all item days (v2.0 - Combined)
    updateTotalDaysFromAllItems(isEditMode = false) {
      const formDataToUse = isEditMode ? this.editFormData : this.formData;

      const total = formDataToUse.items.reduce((sum, item) => {
        return sum + (parseFloat(item.days) || 0);
      }, 0);

      formDataToUse.total_days = total;

      // Also update global start/end dates to reflect overall period
      const validItems = formDataToUse.items.filter(item => item.start_date && item.end_date);
      if (validItems.length > 0) {
        const allDates = validItems.flatMap(item => [new Date(item.start_date), new Date(item.end_date)]);
        formDataToUse.start_date = new Date(Math.min(...allDates));
        formDataToUse.end_date = new Date(Math.max(...allDates));
      }

      console.log('🔄 Total days updated from all items:', total);
      this.$forceUpdate();
    },

    // Safe date conversion helper
    safeConvertToDate(dateValue) {
      if (!dateValue) return null;

      try {
        if (dateValue instanceof Date) {
          return isNaN(dateValue.getTime()) ? null : dateValue;
        }

        if (typeof dateValue === 'string') {
          const parsedDate = new Date(dateValue);
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        }

        return null;
      } catch (error) {
        console.error('Error converting date:', error);
        return null;
      }
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

      if (!dataToValidate.start_date) {
        this.errors.start_date = 'Start date is required';
        console.log('❌ Validation error: Missing start_date');
      }

      if (!dataToValidate.end_date) {
        this.errors.end_date = 'End date is required';
        console.log('❌ Validation error: Missing end_date');
      }

      // Multi-leave-type validation (v2.0)
      if (!dataToValidate.items || !Array.isArray(dataToValidate.items) || dataToValidate.items.length === 0) {
        this.errors.items = 'At least one leave type is required';
        console.log('❌ Validation error: Missing items array');
      } else {
        // Validate each item
        let itemErrors = [];
        const selectedTypes = [];

        dataToValidate.items.forEach((item, index) => {
          if (!item.leave_type_id) {
            itemErrors.push(`Item ${index + 1}: Leave type is required`);
          } else {
            // Check for duplicates
            if (selectedTypes.includes(item.leave_type_id)) {
              itemErrors.push(`Item ${index + 1}: Duplicate leave type not allowed`);
            }
            selectedTypes.push(item.leave_type_id);
          }

          if (!item.days || item.days <= 0) {
            itemErrors.push(`Item ${index + 1}: Days must be greater than 0`);
          }
        });

        if (itemErrors.length > 0) {
          this.errors.items = itemErrors.join('; ');
          console.log('❌ Validation error: Item validation failed:', itemErrors);
        }
      }

      // Total days validation (auto-calculated from items)
      if (dataToValidate.total_days <= 0) {
        this.errors.total_days = 'Total days must be greater than 0';
        console.log('❌ Validation error: Invalid total_days:', dataToValidate.total_days);
      }

      // Validate balances for each item
      const isEditMode = dataToValidate === this.editFormData;
      if (!this.validateItemBalances(isEditMode)) {
        console.log('❌ Validation error: Balance validation failed');
      }

      // Check for attachment notes if any selected leave type requires it
      if (dataToValidate.items && Array.isArray(dataToValidate.items)) {
        const requiresAttachment = dataToValidate.items.some(item => {
          const leaveType = this.leaveTypes.find(lt => lt.id === parseInt(item.leave_type_id));
          return leaveType?.requires_attachment || leaveType?.requiresAttachment;
        });

        if (requiresAttachment && !dataToValidate.attachment_notes?.trim()) {
          this.errors.attachment_notes = 'One or more selected leave types require attachment notes';
          console.log('❌ Validation error: Missing required attachment notes');
        }
      }

      const isValid = Object.keys(this.errors).length === 0;
      console.log(isValid ? '✅ Form validation passed' : '❌ Form validation failed', this.errors);

      return isValid;
    },

    // Submit form to backend using store
    async submitForm() {
      // Determine if we're editing or creating
      const isEditing = this.isCurrentlyEditing;
      const formDataToUse = isEditing ? this.editFormData : this.formData;

      // Validate form
      if (!this.validateForm(formDataToUse)) {
        this.showError('Please fix the form errors before submitting');
        return;
      }

      this.isLoading = true;

      try {
        console.log('🔍 Submitting form data:', {
          employee_id: formDataToUse.employee_id,
          items: formDataToUse.items,
          isEditing
        });

        // Validate required fields
        if (!formDataToUse.employee_id) {
          this.showError('Please select an employee');
          return;
        }

        // Validate items array (v2.0 - multi-leave-type support)
        if (!formDataToUse.items || !Array.isArray(formDataToUse.items) || formDataToUse.items.length === 0) {
          this.showError('Please add at least one leave type');
          return;
        }

        // Check for duplicate leave types
        const leaveTypeIds = formDataToUse.items.map(item => parseInt(item.leave_type_id));
        const uniqueIds = [...new Set(leaveTypeIds)];
        if (leaveTypeIds.length !== uniqueIds.length) {
          this.showError('Duplicate leave types are not allowed');
          return;
        }

        // Prepare payload matching new API structure (v2.0 - multi-leave-type)
        const payload = {
          employee_id: parseInt(formDataToUse.employee_id),
          start_date: formDataToUse.start_date,
          end_date: formDataToUse.end_date,
          // items array replaces leave_type_id and total_days is auto-calculated
          items: formDataToUse.items.map(item => ({
            leave_type_id: parseInt(item.leave_type_id),
            days: parseFloat(item.days)
          })),
          reason: formDataToUse.reason || null,
          status: formDataToUse.status || 'pending',
          // Boolean approval flags with dates
          supervisor_approved: formDataToUse.supervisor_approved || false,
          supervisor_approved_date: formDataToUse.supervisor_approved_date || null,
          hr_site_admin_approved: formDataToUse.hr_site_admin_approved || false,
          hr_site_admin_approved_date: formDataToUse.hr_site_admin_approved_date || null,
          attachment_notes: formDataToUse.attachment_notes || null
        };

        console.log('📤 Payload being sent (v2.0 - multi-leave-type):', payload);

        let result;
        if (isEditing) {
          // Update using store
          const leaveRequestId = formDataToUse.id || this.selectedLeaveRequest.id;
          console.log('🔄 Updating leave request with ID:', leaveRequestId);
          result = await this.leaveStore.updateLeaveRequest(leaveRequestId, payload);
        } else {
          // Create using store
          console.log('➕ Creating new leave request');
          result = await this.leaveStore.createLeaveRequest(payload);
        }

        if (result.success) {
          // Success
          console.log(`✅ Leave request ${isEditing ? 'updated' : 'created'} successfully:`, result.data);

          const employee = result.data.employee;
          const leaveType = result.data.leaveType;
          const successMessage = `Leave request ${isEditing ? 'updated' : 'created'} successfully!\n\nEmployee: ${employee?.name || 'Unknown'}\nLeave Type: ${leaveType?.name || 'Unknown'}\nDuration: ${result.data.totalDays || 0} days`;

          this.showSuccess(successMessage);

          // Show inline notification
          this.showNotification = true;
          this.notificationMessage = `Leave request ${isEditing ? 'updated' : 'created'} successfully!`;
          this.notificationClass = 'alert-success';

          // Emit event to parent
          this.$emit('leave-request-created', result.data);

          // Force refresh balance to show updated available balance
          setTimeout(async () => {
            await this.forceRefreshBalance();
          }, 500);

          // Close modal after delay
          setTimeout(() => {
            this.safeCloseModal();
          }, 1500);

        } else {
          // Handle error
          const errorMessage = result.error || `Error ${isEditing ? 'updating' : 'creating'} leave request`;
          this.showError(errorMessage);

          this.showNotification = true;
          this.notificationMessage = errorMessage;
          this.notificationClass = 'alert-danger';
        }

      } catch (error) {
        console.error(`Error ${isEditing ? 'updating' : 'creating'} leave request:`, error);

        let errorMessage = `An error occurred while ${isEditing ? 'updating' : 'creating'} the leave request`;

        if (error.status === 422) {
          this.errors = error.errors || {};
          errorMessage = error.message || 'Please check the form for errors';
        } else if (error.status === 400) {
          errorMessage = error.message || 'Invalid request data';
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.showError(errorMessage);

        this.showNotification = true;
        this.notificationMessage = errorMessage;
        this.notificationClass = 'alert-danger';
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
        status: 'pending',
        // Approval fields - boolean flags with dates (v4.1 - combined HR/Site Admin)
        supervisor_approved: false,
        supervisor_approved_date: null,
        hr_site_admin_approved: false,
        hr_site_admin_approved_date: null,
        attachment_notes: ''
      };
      this.editFormData = {
        employee_id: null,
        leave_type_id: null,
        start_date: null,
        end_date: null,
        total_days: 0,
        reason: '',
        status: 'pending',
        // Approval fields - boolean flags with dates (v4.1 - combined HR/Site Admin)
        supervisor_approved: false,
        supervisor_approved_date: null,
        hr_site_admin_approved: false,
        hr_site_admin_approved_date: null,
        attachment_notes: ''
      };
      this.errors = {};
      this.availableBalance = 0;
      this.selectedLeaveType = null;
      this.employeeSearchQuery = '';
      this.showEmployeeDropdown = false;
      this.selectedEmployeeIndex = -1;

      // Reset notifications
      this.showNotification = false;
      this.notificationMessage = '';
      this.notificationClass = 'alert-success';

      // Clear any pending balance load timeouts
      if (this.balanceLoadTimeout) {
        clearTimeout(this.balanceLoadTimeout);
        this.balanceLoadTimeout = null;
      }
      this.isLoadingBalance = false;
    },

    // Populate edit form with selected leave request data (v2.0 - Multi-leave-type support)
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

      // Format dates for date-picker (Date object)
      const formatDateForPicker = (dateStr) => {
        if (!dateStr) return null;
        try {
          // Create a proper Date object from the date string
          const date = new Date(dateStr);
          // Validate the date is valid
          if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateStr);
            return null;
          }
          return date;
        } catch (error) {
          console.error('Error formatting date for picker:', error);
          return null;
        }
      };

      // Build items array from leave request items (v2.0 - multi-leave-type)
      let items = [];
      if (leaveRequest.items && Array.isArray(leaveRequest.items) && leaveRequest.items.length > 0) {
        // Use items array from backend response
        items = leaveRequest.items.map(item => ({
          leave_type_id: item.leaveTypeId || item.leave_type_id,
          start_date: formatDateForPicker(item.startDate || item.start_date),
          end_date: formatDateForPicker(item.endDate || item.end_date),
          days: parseFloat(item.days || 0)
        }));
        console.log('✅ Populated items from backend:', items);
      } else {
        // Fallback: create single item from old structure (backward compatibility)
        items = [{
          leave_type_id: leaveRequest.leaveTypeId || leaveRequest.leave_type_id || null,
          start_date: formatDateForPicker(leaveRequest.startDate || leaveRequest.start_date),
          end_date: formatDateForPicker(leaveRequest.endDate || leaveRequest.end_date),
          days: parseFloat(leaveRequest.totalDays || leaveRequest.total_days || 0)
        }];
        console.log('⚠️ No items array found, using fallback single item:', items);
      }

      this.editFormData = {
        id: leaveRequest.id,
        employee_id: leaveRequest.employeeId || leaveRequest.employee_id,
        start_date: formatDateForInput(leaveRequest.startDate || leaveRequest.start_date),
        end_date: formatDateForInput(leaveRequest.endDate || leaveRequest.end_date),
        total_days: leaveRequest.totalDays || leaveRequest.total_days || 0,
        reason: leaveRequest.reason || '',
        status: leaveRequest.status || 'pending',
        // Multi-leave-type support (v2.0)
        items: items,
        // Approval fields - boolean flags with dates (v4.1 - combined HR/Site Admin)
        // IMPORTANT: Date pickers need Date objects, not strings!
        supervisor_approved: leaveRequest.supervisorApproved || leaveRequest.supervisor_approved || false,
        supervisor_approved_date: formatDateForPicker(leaveRequest.supervisorApprovedDate || leaveRequest.supervisor_approved_date),
        hr_site_admin_approved: leaveRequest.hrSiteAdminApproved || leaveRequest.hr_site_admin_approved || false,
        hr_site_admin_approved_date: formatDateForPicker(leaveRequest.hrSiteAdminApprovedDate || leaveRequest.hr_site_admin_approved_date),
        attachment_notes: leaveRequest.attachmentNotes || leaveRequest.attachment_notes || ''
      };

      // Set employee search query for display in edit form
      if (leaveRequest.employee) {
        const staffId = leaveRequest.employee.staffId || leaveRequest.employee.staff_id || '';
        const employeeName = leaveRequest.employee.name ||
          (leaveRequest.employee.first_name_en && leaveRequest.employee.last_name_en
            ? `${leaveRequest.employee.first_name_en} ${leaveRequest.employee.last_name_en}`
            : 'Unknown Employee');
        const organization = leaveRequest.employee.organization || '';

        this.employeeSearchQuery = `${staffId} - ${employeeName} [${organization}]`;
      }

      // Form data is now populated for edit mode
      console.log('✅ Edit form populated with items:', this.editFormData);
      console.log(`   - Items count: ${this.editFormData.items.length}`);
      console.log(`   - Employee search query: ${this.employeeSearchQuery}`);

      // Load balances for all leave types in items
      this.loadEditLeaveBalance();
    },

    // Method to open edit modal (called from parent)
    async openEditModal(leaveRequest) {
      console.log('🔓 Opening edit modal with leave request:', leaveRequest);

      // Ensure leave types are loaded before populating form
      if (!this.leaveTypes || this.leaveTypes.length === 0) {
        console.log('⏳ Leave types not loaded yet, loading now...');
        await this.loadLeaveTypes();
      }

      this.populateEditForm(leaveRequest);

      // Open the edit modal
      const editModal = new Modal(document.getElementById('edit_leaves'));
      editModal.show();
    },

    // Employee search methods
    onEmployeeSearchInput() {
      this.showEmployeeDropdown = true;
      this.selectedEmployeeIndex = -1;

      // Clear selected employee if search doesn't match (for both create and edit mode)
      const currentEmployeeId = this.isCurrentlyEditing ? this.editFormData.employee_id : this.formData.employee_id;
      if (currentEmployeeId && this.selectedEmployeeDisplay.toLowerCase().indexOf(this.employeeSearchQuery.toLowerCase()) === -1) {
        if (this.isCurrentlyEditing) {
          this.editFormData.employee_id = null;
        } else {
          this.formData.employee_id = null;
        }
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

      // Update the appropriate form data based on mode
      if (this.isCurrentlyEditing) {
        this.editFormData.employee_id = employee.id;
        console.log('✅ Employee selected - editFormData.employee_id set to:', this.editFormData.employee_id);
      } else {
        this.formData.employee_id = employee.id;
        console.log('✅ Employee selected - formData.employee_id set to:', this.formData.employee_id);
      }

      this.employeeSearchQuery = `${employee.staff_id} - ${employee.name} [${employee.organization}]`;
      this.showEmployeeDropdown = false;
      this.selectedEmployeeIndex = -1;

      // Trigger leave balance loading for the appropriate mode
      if (this.isCurrentlyEditing) {
        this.loadEditLeaveBalance();
      } else {
        this.loadLeaveBalance();
      }
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
      // Clear the appropriate form data based on mode
      if (this.isCurrentlyEditing) {
        this.editFormData.employee_id = null;
      } else {
        this.formData.employee_id = null;
      }

      this.employeeSearchQuery = '';
      this.showEmployeeDropdown = false;
      this.selectedEmployeeIndex = -1;
      this.availableBalance = 0;
    },

    // Debug method to check current form state
    debugFormState() {
      console.log('🐛 DEBUG: Current form state');
      console.log('📋 formData:', JSON.stringify(this.formData, null, 2));
      console.log('📝 editFormData:', JSON.stringify(this.editFormData, null, 2));
      console.log('🔍 employeeSearchQuery:', this.employeeSearchQuery);
      console.log('⚖️ availableBalance:', this.availableBalance);
      console.log('👥 employees count:', this.employees.length);
      console.log('📄 leaveTypes count:', this.leaveTypes.length);
      console.log('❌ errors:', this.errors);
      console.log('🎯 selectedLeaveType:', this.selectedLeaveType);
      console.log('📊 isCurrentlyEditing:', this.isCurrentlyEditing);
    },

    // Test method to manually set balance
    testSetBalance(amount = 26) {
      console.log('🧪 Setting test balance to:', amount);
      this.availableBalance = amount;
      this.$forceUpdate();
      console.log('✅ Test balance set. Current availableBalance:', this.availableBalance);
    },

    // Test method to call API directly
    async testDirectApiCall() {
      if (!this.formData.employee_id || !this.formData.leave_type_id) {
        console.log('❌ No employee or leave type selected');
        return;
      }

      try {
        console.log('🧪 Testing direct API call...');
        const year = new Date().getFullYear();
        const url = `/leaves/balance/${this.formData.employee_id}/${this.formData.leave_type_id}?year=${year}`;

        console.log('🔗 Direct API URL:', url);

        // Import apiService to make direct call
        const { apiService } = await import('@/services/api.service');
        const directResponse = await apiService.get(url);

        console.log('🔍 Direct API Response:', directResponse);
        console.log('🔍 Direct response.data:', JSON.stringify(directResponse.data, null, 2));

        if (directResponse.success && directResponse.data && directResponse.data.remaining_days !== undefined) {
          const balance = parseFloat(directResponse.data.remaining_days);
          console.log('✅ Direct API remaining_days:', balance);
          this.availableBalance = balance;
          this.$forceUpdate();
        }
      } catch (error) {
        console.error('❌ Direct API call failed:', error);
      }
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
          organization: 'SMRU'
        }
      };

      console.log('🧪 Testing edit mode with data:', testData);
      this.populateEditForm(testData);
      return testData;
    },

    // Force refresh leave balance using store
    async forceRefreshBalance() {
      const employeeId = this.isCurrentlyEditing ? this.editFormData.employee_id : this.formData.employee_id;
      const leaveTypeId = this.isCurrentlyEditing ? this.editFormData.leave_type_id : this.formData.leave_type_id;

      console.log(`🔄 Force refreshing balance for employee ${employeeId}, leave type ${leaveTypeId}`);

      if (employeeId && leaveTypeId) {
        // Prevent duplicate API calls
        if (this.isLoadingBalance) {
          console.log('⏳ Balance refresh already in progress, skipping duplicate call');
          return;
        }

        this.isLoadingBalance = true;

        try {
          const year = new Date().getFullYear();

          // First invalidate the cache to ensure fresh data
          this.leaveStore.invalidateEmployeeLeaveCache(employeeId, leaveTypeId, year);

          // Then fetch fresh data
          const result = await this.leaveStore.getOrFetchLeaveBalance(employeeId, leaveTypeId, year);

          if (result.success && result.data) {
            let remainingDays = 0;
            if (result.data.remainingDays !== undefined) {
              remainingDays = parseFloat(result.data.remainingDays);
            } else if (result.data.remaining_days !== undefined) {
              remainingDays = parseFloat(result.data.remaining_days);
            } else if (result.data.balance !== undefined) {
              remainingDays = parseFloat(result.data.balance);
            }

            this.availableBalance = remainingDays || 0;
            this.$forceUpdate();
            console.log(`✅ Balance force refreshed: ${this.availableBalance} days (was cached: ${result.fromCache})`);
          } else {
            console.warn('⚠️ No balance data received during force refresh:', result);
          }
        } catch (error) {
          console.error('❌ Error force refreshing balance:', error);
        } finally {
          this.isLoadingBalance = false;
        }
      } else {
        console.log('⚠️ Cannot refresh balance: missing employee ID or leave type ID');
      }
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
        status: 'pending',
        // Approval fields - boolean flags with dates (v4.1 - combined HR/Site Admin)
        supervisor_approved: false,
        supervisor_approved_date: null,
        hr_site_admin_approved: false,
        hr_site_admin_approved_date: null,
        attachment_notes: ''
      };
      this.employeeSearchQuery = '';
      this.availableBalance = 0;
      this.errors = {};

      // Reset notifications
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
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Leave</h4>
          <button type="button" class="btn-close custom-btn-close" @click="safeCloseModal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <!-- Success/Error Notification -->
            <div v-if="showNotification" class="alert" :class="notificationClass" role="alert">
              <i class="ti" :class="{
                'ti-check-circle': notificationClass.includes('success'),
                'ti-alert-circle': notificationClass.includes('danger'),
                'ti-info-circle': notificationClass.includes('info'),
                'ti-alert-triangle': notificationClass.includes('warning')
              }" style="margin-right: 8px;"></i>
              {{ notificationMessage }}
              <button type="button" class="btn-close" @click="showNotification = false" aria-label="Close"></button>
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
                      placeholder="Type to search by Staff ID, Name, or Organization..." autocomplete="off" />

                    <!-- Clear button -->
                    <button v-if="(isCurrentlyEditing ? editFormData.employee_id : formData.employee_id)" type="button"
                      @click="clearEmployeeSelection" class="btn btn-sm position-absolute"
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
                          <small class="text-muted">[{{ employee.organization }}]</small>
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

              <!-- Leave Type Allocation (Combined - v2.0) -->
              <div class="col-md-12">
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label mb-0">Leave Request Details <span class="text-danger">*</span></label>
                    <button type="button" class="btn btn-sm btn-primary" @click="addLeaveTypeItem(false)">
                      <i class="ti ti-plus me-1"></i>Add Leave Type
                    </button>
                  </div>

                  <!-- Leave Type Items -->
                  <div v-for="(item, index) in formData.items" :key="index" class="card mb-2">
                    <div class="card-body p-3">
                      <div class="row g-2">
                        <!-- Leave Type Selection -->
                        <div class="col-md-3">
                          <label class="form-label">Leave Type <span class="text-danger">*</span></label>
                          <a-select
                            v-model:value="item.leave_type_id"
                            @change="onLeaveTypeChange(index, false)"
                            placeholder="Select Type"
                            size="small"
                            style="width: 100%"
                            :class="{ 'is-invalid': errors[`items_${index}_leave_type_id`] }">
                            <a-select-option value="">Select Type</a-select-option>
                            <a-select-option
                              v-for="leaveType in getAvailableLeaveTypes(index, false)"
                              :key="leaveType.id"
                              :value="leaveType.id">
                              {{ leaveType.name }}
                            </a-select-option>
                          </a-select>
                        </div>

                        <!-- From Date -->
                        <div class="col-md-2">
                          <label class="form-label">From <span class="text-danger">*</span></label>
                          <div class="input-icon-end position-relative">
                            <date-picker class="form-control form-control-sm datetimepicker"
                              placeholder="dd/mm/yyyy"
                              :editable="true"
                              :clearable="false"
                              :input-format="displayFormat"
                              v-model="item.start_date"
                              @update:model-value="handleItemDateChange(index, 'start_date', $event, false)" />
                            <span class="input-icon-addon">
                              <i class="ti ti-calendar text-gray-7"></i>
                            </span>
                          </div>
                        </div>

                        <!-- To Date -->
                        <div class="col-md-2">
                          <label class="form-label">To <span class="text-danger">*</span></label>
                          <div class="input-icon-end position-relative">
                            <date-picker class="form-control form-control-sm datetimepicker"
                              placeholder="dd/mm/yyyy"
                              :editable="true"
                              :clearable="false"
                              :input-format="displayFormat"
                              v-model="item.end_date"
                              @update:model-value="handleItemDateChange(index, 'end_date', $event, false)" />
                            <span class="input-icon-addon">
                              <i class="ti ti-calendar text-gray-7"></i>
                            </span>
                          </div>
                        </div>

                        <!-- Total Days (Auto-calculated) -->
                        <div class="col-md-2">
                          <label class="form-label">Days</label>
                          <input type="number"
                            :value="item.days || 0"
                            class="form-control form-control-sm text-center"
                            readonly
                            title="Auto-calculated from dates" />
                        </div>

                        <!-- Available Balance Display -->
                        <div class="col-md-2">
                          <label class="form-label">Balance</label>
                          <div class="input-group input-group-sm">
                            <input type="text"
                              :value="item.leave_type_id ? (getBalanceForType(item.leave_type_id) + ' d') : '-'"
                              class="form-control form-control-sm text-center"
                              readonly
                              title="Available balance" />
                            <span v-if="isLoadingBalances[item.leave_type_id]" class="input-group-text">
                              <i class="ti ti-loader ti-spin"></i>
                            </span>
                          </div>
                        </div>

                        <!-- Remove Button -->
                        <div class="col-md-1">
                          <label class="form-label d-block">&nbsp;</label>
                          <button type="button"
                            class="btn btn-sm btn-outline-danger"
                            @click="removeLeaveTypeItem(index, false)"
                            :disabled="formData.items.length === 1"
                            title="Remove this leave type">
                            <i class="ti ti-trash"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Balance Warning -->
                      <div v-if="item.leave_type_id && item.days > 0 && getBalanceForType(item.leave_type_id) < item.days"
                        class="alert alert-warning mt-2 mb-0 py-2">
                        <i class="ti ti-alert-triangle me-1"></i>
                        <small>Insufficient balance! Available: {{ getBalanceForType(item.leave_type_id) }} days, Requested: {{ item.days }} days</small>
                      </div>
                    </div>
                  </div>

                  <!-- Items Validation Error -->
                  <div v-if="errors.items" class="invalid-feedback d-block">{{ errors.items }}</div>
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

              <!-- Status -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <select v-model="formData.status" class="form-select">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <!-- Approval Information Section -->
              <div class="col-md-12">
                <div class="card mb-3">
                  <div class="card-header">
                    <h6 class="mb-0">Approval Information (from Paper Forms)</h6>
                    <small class="text-muted">Record approval status and dates as shown on physical forms</small>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <!-- Supervisor Approval -->
                      <div class="col-md-6">
                        <div class="mb-3">
                          <div class="form-check">
                            <input type="checkbox" v-model="formData.supervisor_approved" class="form-check-input"
                              id="supervisorApproved">
                            <label class="form-check-label" for="supervisorApproved">
                              Supervisor Approved
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Supervisor Approval Date</label>
                          <div class="input-icon-end position-relative">
                            <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                              :clearable="false" :input-format="displayFormat"
                              v-model="formData.supervisor_approved_date" :disabled="!formData.supervisor_approved"
                              @update:model-value="handleDateChange('supervisor_approved_date', $event)" />
                            <span class="input-icon-addon">
                              <i class="ti ti-calendar text-gray-7"></i>
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- HR/Site Admin Approval (Combined) -->
                      <div class="col-md-6">
                        <div class="mb-3">
                          <div class="form-check">
                            <input type="checkbox" v-model="formData.hr_site_admin_approved" class="form-check-input"
                              id="hrSiteAdminApproved">
                            <label class="form-check-label" for="hrSiteAdminApproved">
                              HR/Site Admin Approved
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">HR/Site Admin Approval Date</label>
                          <div class="input-icon-end position-relative">
                            <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                              :clearable="false" :input-format="displayFormat"
                              v-model="formData.hr_site_admin_approved_date"
                              :disabled="!formData.hr_site_admin_approved"
                              @update:model-value="handleDateChange('hr_site_admin_approved_date', $event)" />
                            <span class="input-icon-addon">
                              <i class="ti ti-calendar text-gray-7"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Attachment Notes -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Attachment Notes</label>
                  <textarea v-model="formData.attachment_notes" class="form-control" rows="2"
                    placeholder="Simple text notes about attachments (e.g., 'Medical certificate submitted', 'Travel documents provided')"></textarea>
                  <small class="text-muted">Text-based reference to any attachments received</small>
                </div>
              </div>

              <!-- Attachment Requirement Notice -->
              <div class="col-md-12" v-if="requiresAttachment && !formData.attachment_notes?.trim()">
                <div class="alert alert-warning">
                  <i class="ti ti-alert-triangle"></i>
                  This leave type requires attachment notes. Please describe any documents attached to the paper form.
                </div>
              </div>
              <div v-if="errors.attachment_notes" class="col-md-12">
                <div class="text-danger mt-1">{{ errors.attachment_notes }}</div>
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
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ isCurrentlyEditing ? 'Edit Leave Request' : 'Edit Leave' }}</h4>
          <button type="button" class="btn-close custom-btn-close" @click="closeEditModal" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <!-- Success/Error Notification for Edit Modal -->
            <div v-if="showNotification" class="alert" :class="notificationClass" role="alert">
              <i class="ti" :class="{
                'ti-check-circle': notificationClass.includes('success'),
                'ti-alert-circle': notificationClass.includes('danger'),
                'ti-info-circle': notificationClass.includes('info'),
                'ti-alert-triangle': notificationClass.includes('warning')
              }" style="margin-right: 8px;"></i>
              {{ notificationMessage }}
              <button type="button" class="btn-close" @click="showNotification = false" aria-label="Close"></button>
            </div>

            <div class="row">
              <!-- Employee Selection (Read-only in edit mode) -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Employee Name</label>
                  <input type="text" class="form-control" :value="selectedEmployeeDisplay" readonly />
                  <small class="text-muted">Employee cannot be changed in edit mode</small>
                </div>
              </div>

              <!-- Leave Type Allocation (Combined - v2.0) -->
              <div class="col-md-12">
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="form-label mb-0">Leave Request Details <span class="text-danger">*</span></label>
                    <button type="button" class="btn btn-sm btn-primary" @click="addLeaveTypeItem(true)">
                      <i class="ti ti-plus me-1"></i>Add Leave Type
                    </button>
                  </div>

                  <!-- Leave Type Items -->
                  <div v-for="(item, index) in editFormData.items" :key="index" class="card mb-2">
                    <div class="card-body p-3">
                      <div class="row g-2">
                        <!-- Leave Type Selection -->
                        <div class="col-md-3">
                          <label class="form-label">Leave Type <span class="text-danger">*</span></label>
                          <a-select
                            v-model:value="item.leave_type_id"
                            @change="onLeaveTypeChange(index, true)"
                            placeholder="Select Type"
                            size="small"
                            style="width: 100%"
                            :class="{ 'is-invalid': errors[`items_${index}_leave_type_id`] }">
                            <a-select-option value="">Select Type</a-select-option>
                            <a-select-option
                              v-for="leaveType in getAvailableLeaveTypes(index, true)"
                              :key="leaveType.id"
                              :value="leaveType.id">
                              {{ leaveType.name }}
                            </a-select-option>
                          </a-select>
                        </div>

                        <!-- From Date -->
                        <div class="col-md-2">
                          <label class="form-label">From <span class="text-danger">*</span></label>
                          <div class="input-icon-end position-relative">
                            <date-picker class="form-control form-control-sm datetimepicker"
                              placeholder="dd/mm/yyyy"
                              :editable="true"
                              :clearable="false"
                              :input-format="displayFormat"
                              v-model="item.start_date"
                              @update:model-value="handleItemDateChange(index, 'start_date', $event, true)" />
                            <span class="input-icon-addon">
                              <i class="ti ti-calendar text-gray-7"></i>
                            </span>
                          </div>
                        </div>

                        <!-- To Date -->
                        <div class="col-md-2">
                          <label class="form-label">To <span class="text-danger">*</span></label>
                          <div class="input-icon-end position-relative">
                            <date-picker class="form-control form-control-sm datetimepicker"
                              placeholder="dd/mm/yyyy"
                              :editable="true"
                              :clearable="false"
                              :input-format="displayFormat"
                              v-model="item.end_date"
                              @update:model-value="handleItemDateChange(index, 'end_date', $event, true)" />
                            <span class="input-icon-addon">
                              <i class="ti ti-calendar text-gray-7"></i>
                            </span>
                          </div>
                        </div>

                        <!-- Total Days (Auto-calculated) -->
                        <div class="col-md-2">
                          <label class="form-label">Days</label>
                          <input type="number"
                            :value="item.days || 0"
                            class="form-control form-control-sm text-center"
                            readonly
                            title="Auto-calculated from dates" />
                        </div>

                        <!-- Available Balance Display -->
                        <div class="col-md-2">
                          <label class="form-label">Balance</label>
                          <div class="input-group input-group-sm">
                            <input type="text"
                              :value="item.leave_type_id ? (getBalanceForType(item.leave_type_id) + ' d') : '-'"
                              class="form-control form-control-sm text-center"
                              readonly
                              title="Available balance" />
                            <span v-if="isLoadingBalances[item.leave_type_id]" class="input-group-text">
                              <i class="ti ti-loader ti-spin"></i>
                            </span>
                          </div>
                        </div>

                        <!-- Remove Button -->
                        <div class="col-md-1">
                          <label class="form-label d-block">&nbsp;</label>
                          <button type="button"
                            class="btn btn-sm btn-outline-danger"
                            @click="removeLeaveTypeItem(index, true)"
                            :disabled="editFormData.items.length === 1"
                            title="Remove this leave type">
                            <i class="ti ti-trash"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Balance Warning -->
                      <div v-if="item.leave_type_id && item.days > 0 && getBalanceForType(item.leave_type_id) < item.days"
                        class="alert alert-warning mt-2 mb-0 py-2">
                        <i class="ti ti-alert-triangle me-1"></i>
                        <small>Insufficient balance! Available: {{ getBalanceForType(item.leave_type_id) }} days, Requested: {{ item.days }} days</small>
                      </div>
                    </div>
                  </div>

                  <!-- Items Validation Error -->
                  <div v-if="errors.items" class="invalid-feedback d-block">{{ errors.items }}</div>
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

              <!-- Status -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <select v-model="editFormData.status" class="form-select">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <!-- Approval Information Section -->
              <div class="col-md-12">
                <div class="card mb-3">
                  <div class="card-header">
                    <h6 class="mb-0">Approval Information (from Paper Forms)</h6>
                    <small class="text-muted">Record approval status and dates as shown on physical forms</small>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <!-- Supervisor Approval -->
                      <div class="col-md-6">
                        <div class="mb-3">
                          <div class="form-check">
                            <input type="checkbox" v-model="editFormData.supervisor_approved" class="form-check-input"
                              id="editSupervisorApproved">
                            <label class="form-check-label" for="editSupervisorApproved">
                              Supervisor Approved
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Supervisor Approval Date</label>
                          <div class="input-icon-end position-relative">
                            <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                              :clearable="false" :input-format="displayFormat"
                              v-model="editFormData.supervisor_approved_date"
                              :disabled="!editFormData.supervisor_approved"
                              @update:model-value="handleEditDateChange('supervisor_approved_date', $event)" />
                            <span class="input-icon-addon">
                              <i class="ti ti-calendar text-gray-7"></i>
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- HR/Site Admin Approval (Combined) -->
                      <div class="col-md-6">
                        <div class="mb-3">
                          <div class="form-check">
                            <input type="checkbox" v-model="editFormData.hr_site_admin_approved"
                              class="form-check-input" id="editHrSiteAdminApproved">
                            <label class="form-check-label" for="editHrSiteAdminApproved">
                              HR/Site Admin Approved
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">HR/Site Admin Approval Date</label>
                          <div class="input-icon-end position-relative">
                            <date-picker class="form-control datetimepicker" placeholder="dd/mm/yyyy" :editable="true"
                              :clearable="false" :input-format="displayFormat"
                              v-model="editFormData.hr_site_admin_approved_date"
                              :disabled="!editFormData.hr_site_admin_approved"
                              @update:model-value="handleEditDateChange('hr_site_admin_approved_date', $event)" />
                            <span class="input-icon-addon">
                              <i class="ti ti-calendar text-gray-7"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Attachment Notes -->
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Attachment Notes</label>
                  <textarea v-model="editFormData.attachment_notes" class="form-control" rows="2"
                    placeholder="Simple text notes about attachments (e.g., 'Medical certificate submitted', 'Travel documents provided')"></textarea>
                  <small class="text-muted">Text-based reference to any attachments received</small>
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
            <router-link to="/leave/admin/leaves-admin" class="btn btn-danger">Yes, Delete</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

<style scoped>
/* Date picker styling */
.input-icon-end {
  position: relative;
}

.input-icon-addon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6B7280;
  z-index: 2;
}

.datetimepicker {
  padding-right: 35px !important;
}

:deep(.mx-datepicker) {
  width: 100%;
}

:deep(.mx-input) {
  width: 100% !important;
  padding: 7px 35px 7px 12px !important;
  border-radius: 6px !important;
  border: 1px solid #c9d2e2 !important;
  font-size: 1em !important;
  box-sizing: border-box !important;
  background: #f7f8fa !important;
  outline: none !important;
  transition: border 0.2s !important;
}

:deep(.mx-input:focus) {
  border: 1.5px solid #4a7fff !important;
  background: #fff !important;
}

:deep(.mx-icon-calendar) {
  display: none;
}

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

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { message, Modal as AntModal } from 'ant-design-vue';
import {
  InfoCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  IdcardOutlined,
  BankOutlined,
  BookOutlined,
  TeamOutlined,
  PhoneOutlined,
  HeartOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { h } from 'vue';

// Stores
import { useEmployeeStore } from '@/stores/employeeStore';
import { useLookupStore } from '@/stores/lookupStore';
import { useSharedDataStore } from '@/stores/sharedDataStore';

// Services
import { employeeService } from '@/services/employee.service';
import { employeeEducationService } from '@/services/employeeEducation.service';
import { employeeChildrenService } from '@/services/employee-children.service';
import employeeBeneficiaryService from '@/services/employeeBeneficiary.service';

export default {
  name: 'EmployeeModal',
  components: {
    InfoCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    UserOutlined,
    IdcardOutlined,
    BankOutlined,
    BookOutlined,
    TeamOutlined,
    PhoneOutlined,
    HeartOutlined
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editingEmployee: {
      type: Object,
      default: null
    }
  },
  emits: ['saved', 'close'],
  setup(props, { emit }) {
    // Stores
    const employeeStore = useEmployeeStore();
    const lookupStore = useLookupStore();

    // UI State
    const currentStep = ref(0);
    const loading = ref(false);
    const formErrors = ref({});
    const activeCollapseKeys = ref(['personal', 'identification', 'address', 'bank', 'education', 'parents', 'emergency', 'beneficiaries', 'children']);

    // Step 1: Basic Information
    const basicInfo = ref({
      organization: '',
      staff_id: '',
      initial_en: '',
      initial_th: '',
      first_name_en: '',
      last_name_en: '',
      first_name_th: '',
      last_name_th: '',
      gender: '',
      date_of_birth: null,
      status: '',
      nationality: ''
    });

    // Step 2: Personal & Finance
    const personalFinance = ref({
      mobile_phone: '',
      religion: '',
      marital_status: '',
      spouse_name: '',
      spouse_phone_number: '',
      current_address: '',
      permanent_address: '',
      social_security_number: '',
      tax_number: '',
      identification_type: '',
      identification_number: '',
      identification_issue_date: null,
      identification_expiry_date: null,
      bank_name: '',
      bank_branch: '',
      bank_account_name: '',
      bank_account_number: '',
      school_name: '',
      degree: '',
      education_start_date: null,
      education_end_date: null
    });

    // Step 3: Family & Dependents
    const familyDependents = ref({
      father_name: '',
      father_phone: '',
      mother_name: '',
      mother_phone: '',
      emergency_contact_name: '',
      emergency_contact_relationship: '',
      emergency_contact_phone: '',
      beneficiaries: [],
      children: []
    });

    // Temporary forms for adding beneficiaries/children
    const newBeneficiary = ref({
      beneficiary_name: '',
      beneficiary_relationship: '',
      phone_number: '',
      beneficiary_email: '',
      beneficiary_address: ''
    });

    const newChild = ref({
      name: '',
      date_of_birth: null
    });

    // Computed
    const isEditing = computed(() => !!props.editingEmployee);
    const modalTitle = computed(() => isEditing.value ? 'Edit Employee' : 'Add New Employee');

    const calculatedAge = computed(() => {
      const dob = basicInfo.value.date_of_birth;
      if (!dob) return '';
      const birthDate = dayjs(dob);
      const today = dayjs();
      let age = today.year() - birthDate.year();
      if (today.month() < birthDate.month() ||
          (today.month() === birthDate.month() && today.date() < birthDate.date())) {
        age--;
      }
      return age;
    });

    // Lookup Options
    const organizationOptions = computed(() =>
      lookupStore.getLookupsByType('organization').map(o => ({ label: o.value, value: o.value }))
    );

    const genderOptions = computed(() =>
      lookupStore.getLookupsByType('gender').map(g => ({ label: g.value, value: g.value }))
    );

    const statusOptions = computed(() =>
      lookupStore.getLookupsByType('employee_status').map(s => ({ label: s.value, value: s.value }))
    );

    const nationalityOptions = computed(() =>
      lookupStore.getLookupsByType('nationality').map(n => ({ label: n.value, value: n.value }))
    );

    const religionOptions = computed(() =>
      lookupStore.getLookupsByType('religion').map(r => ({ label: r.value, value: r.value }))
    );

    const maritalStatusOptions = computed(() =>
      lookupStore.getLookupsByType('marital_status').map(m => ({ label: m.value, value: m.value }))
    );

    const initialEnOptions = computed(() =>
      lookupStore.getLookupsByType('employee_initial_en').map(i => ({ label: i.value, value: i.value }))
    );

    const initialThOptions = computed(() =>
      lookupStore.getLookupsByType('employee_initial_th').map(i => ({ label: i.value, value: i.value }))
    );

    const bankNameOptions = computed(() =>
      lookupStore.getLookupsByType('bank_name').map(b => ({ label: b.value, value: b.value }))
    );

    const identificationTypeOptions = [
      { value: '10YearsID', label: '10 Years ID' },
      { value: 'BurmeseID', label: 'Burmese ID' },
      { value: 'CI', label: 'CI' },
      { value: 'Borderpass', label: 'Borderpass' },
      { value: 'ThaiID', label: 'Thai ID' },
      { value: 'Passport', label: 'Passport' },
      { value: 'Other', label: 'Other' }
    ];

    // Table columns for beneficiaries
    const beneficiaryColumns = [
      { title: 'Name', dataIndex: 'beneficiary_name', key: 'name' },
      { title: 'Relationship', dataIndex: 'beneficiary_relationship', key: 'relationship' },
      { title: 'Phone', dataIndex: 'phone_number', key: 'phone' },
      { title: 'Email', dataIndex: 'beneficiary_email', key: 'email' },
      { title: 'Action', key: 'action', width: 80, align: 'center' }
    ];

    // Table columns for children
    const childrenColumns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Date of Birth', dataIndex: 'date_of_birth', key: 'dob' },
      { title: 'Action', key: 'action', width: 80, align: 'center' }
    ];

    // Methods
    const resetForm = () => {
      currentStep.value = 0;
      formErrors.value = {};

      basicInfo.value = {
        organization: '',
        staff_id: '',
        initial_en: '',
        initial_th: '',
        first_name_en: '',
        last_name_en: '',
        first_name_th: '',
        last_name_th: '',
        gender: '',
        date_of_birth: null,
        status: '',
        nationality: ''
      };

      personalFinance.value = {
        mobile_phone: '',
        religion: '',
        marital_status: '',
        spouse_name: '',
        spouse_phone_number: '',
        current_address: '',
        permanent_address: '',
        social_security_number: '',
        tax_number: '',
        identification_type: '',
        identification_number: '',
        identification_issue_date: null,
        identification_expiry_date: null,
        bank_name: '',
        bank_branch: '',
        bank_account_name: '',
        bank_account_number: '',
        school_name: '',
        degree: '',
        education_start_date: null,
        education_end_date: null
      };

      familyDependents.value = {
        father_name: '',
        father_phone: '',
        mother_name: '',
        mother_phone: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
        beneficiaries: [],
        children: []
      };

      newBeneficiary.value = {
        beneficiary_name: '',
        beneficiary_relationship: '',
        phone_number: '',
        beneficiary_email: '',
        beneficiary_address: ''
      };

      newChild.value = {
        name: '',
        date_of_birth: null
      };
    };

    const loadLookups = async () => {
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookupLists();
      }
    };

    const formatDateForAPI = (date) => {
      if (!date) return null;
      return dayjs(date).format('YYYY-MM-DD');
    };

    const formatDateForDisplay = (date) => {
      if (!date) return '-';
      return dayjs(date).format('DD/MM/YYYY');
    };

    // Validation
    const validateStep1 = () => {
      const errors = {};

      if (!basicInfo.value.organization) errors.organization = 'Organization is required';
      if (!basicInfo.value.staff_id?.trim()) errors.staff_id = 'Staff ID is required';
      if (!basicInfo.value.first_name_en?.trim()) errors.first_name_en = 'First name (EN) is required';
      if (!basicInfo.value.gender) errors.gender = 'Gender is required';
      if (!basicInfo.value.date_of_birth) errors.date_of_birth = 'Date of birth is required';
      if (!basicInfo.value.status) errors.status = 'Status is required';

      formErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    const validateStep2 = () => {
      const errors = {};

      // Phone number format validation (if provided)
      if (personalFinance.value.mobile_phone && !/^[\d\-\+\s]+$/.test(personalFinance.value.mobile_phone)) {
        errors.mobile_phone = 'Invalid phone number format';
      }

      // Bank account number validation (if provided)
      if (personalFinance.value.bank_account_number && !/^\d+$/.test(personalFinance.value.bank_account_number)) {
        errors.bank_account_number = 'Bank account must contain only digits';
      }

      formErrors.value = errors;
      return Object.keys(errors).length === 0;
    };

    const validateStep3 = () => {
      const errors = {};
      // No required fields in step 3, just clear errors
      formErrors.value = errors;
      return true;
    };

    // Navigation
    const nextStep = () => {
      let isValid = false;

      if (currentStep.value === 0) {
        isValid = validateStep1();
      } else if (currentStep.value === 1) {
        isValid = validateStep2();
      }

      if (isValid) {
        currentStep.value++;
      } else {
        message.warning('Please fill in all required fields');
      }
    };

    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
      }
    };

    // Dynamic list management
    const addBeneficiary = () => {
      if (!newBeneficiary.value.beneficiary_name?.trim()) {
        message.warning('Beneficiary name is required');
        return;
      }
      if (!newBeneficiary.value.phone_number?.trim()) {
        message.warning('Phone number is required');
        return;
      }

      familyDependents.value.beneficiaries.push({ ...newBeneficiary.value });
      newBeneficiary.value = {
        beneficiary_name: '',
        beneficiary_relationship: '',
        phone_number: '',
        beneficiary_email: '',
        beneficiary_address: ''
      };
    };

    const removeBeneficiary = (index) => {
      familyDependents.value.beneficiaries.splice(index, 1);
    };

    const addChild = () => {
      if (!newChild.value.name?.trim()) {
        message.warning('Child name is required');
        return;
      }

      familyDependents.value.children.push({
        name: newChild.value.name,
        date_of_birth: newChild.value.date_of_birth ? formatDateForAPI(newChild.value.date_of_birth) : null
      });
      newChild.value = {
        name: '',
        date_of_birth: null
      };
    };

    const removeChild = (index) => {
      familyDependents.value.children.splice(index, 1);
    };

    // Form submission
    const handleSubmit = async () => {
      if (!validateStep3()) {
        message.warning('Please correct the errors before submitting');
        return;
      }

      loading.value = true;

      try {
        // Build employee data payload
        const employeeData = {
          organization: basicInfo.value.organization,
          staff_id: basicInfo.value.staff_id?.trim(),
          initial_en: basicInfo.value.initial_en || null,
          initial_th: basicInfo.value.initial_th || null,
          first_name_en: basicInfo.value.first_name_en?.trim(),
          last_name_en: basicInfo.value.last_name_en?.trim() || null,
          first_name_th: basicInfo.value.first_name_th?.trim() || null,
          last_name_th: basicInfo.value.last_name_th?.trim() || null,
          gender: basicInfo.value.gender,
          date_of_birth: formatDateForAPI(basicInfo.value.date_of_birth),
          age: calculatedAge.value,
          status: basicInfo.value.status,
          nationality: basicInfo.value.nationality || null,
          // Include personal info that API accepts directly
          mobile_phone: personalFinance.value.mobile_phone?.trim() || null,
          religion: personalFinance.value.religion || null,
          marital_status: personalFinance.value.marital_status || null,
          current_address: personalFinance.value.current_address?.trim() || null,
          permanent_address: personalFinance.value.permanent_address?.trim() || null,
          social_security_number: personalFinance.value.social_security_number?.trim() || null,
          tax_number: personalFinance.value.tax_number?.trim() || null,
          // Bank info
          bank_name: personalFinance.value.bank_name || null,
          bank_branch: personalFinance.value.bank_branch?.trim() || null,
          bank_account_name: personalFinance.value.bank_account_name?.trim() || null,
          bank_account_number: personalFinance.value.bank_account_number?.trim() || null
        };

        let response;
        let employeeId;

        if (isEditing.value) {
          response = await employeeStore.updateEmployee(props.editingEmployee.id, employeeData);
          employeeId = props.editingEmployee.id;
        } else {
          response = await employeeStore.createEmployee(employeeData);
          employeeId = response?.data?.id || response?.data?.employee?.id;
        }

        if (!response?.success) {
          throw new Error(response?.message || 'Failed to save employee');
        }

        // Run post-save updates for related data
        if (employeeId) {
          await runPostSaveUpdates(employeeId);
        }

        // Invalidate cache
        const sharedStore = useSharedDataStore();
        sharedStore.invalidateCache('employees');
        await sharedStore.fetchEmployees(true);

        message.success(isEditing.value ? 'Employee updated successfully' : 'Employee added successfully');
        emit('saved', response);
        handleClose();

      } catch (error) {
        console.error('Error saving employee:', error);
        handleSubmitError(error);
      } finally {
        loading.value = false;
      }
    };

    const runPostSaveUpdates = async (employeeId) => {
      const tasks = [];

      // Personal information update
      const personalPayload = {
        mobile_phone: personalFinance.value.mobile_phone?.trim() || null,
        nationality: basicInfo.value.nationality || null,
        social_security_number: personalFinance.value.social_security_number?.trim() || null,
        tax_number: personalFinance.value.tax_number?.trim() || null,
        religion: personalFinance.value.religion || null,
        marital_status: personalFinance.value.marital_status || null,
        spouse_name: personalFinance.value.spouse_name?.trim() || null,
        spouse_phone_number: personalFinance.value.spouse_phone_number?.trim() || null,
        current_address: personalFinance.value.current_address?.trim() || null,
        permanent_address: personalFinance.value.permanent_address?.trim() || null,
        identification_type: personalFinance.value.identification_type || null,
        identification_number: personalFinance.value.identification_number?.trim() || null,
        identification_issue_date: formatDateForAPI(personalFinance.value.identification_issue_date),
        identification_expiry_date: formatDateForAPI(personalFinance.value.identification_expiry_date)
      };

      if (hasNonEmptyValues(personalPayload)) {
        tasks.push(
          employeeService.updateEmployeePersonalInformation(employeeId, personalPayload)
            .catch(err => console.warn('Personal info update failed:', err))
        );
      }

      // Bank information update
      const bankPayload = {
        bank_name: personalFinance.value.bank_name || null,
        bank_branch: personalFinance.value.bank_branch?.trim() || null,
        bank_account_name: personalFinance.value.bank_account_name?.trim() || null,
        bank_account_number: personalFinance.value.bank_account_number?.trim() || null
      };

      if (hasNonEmptyValues(bankPayload)) {
        tasks.push(
          employeeService.updateBankInformation(employeeId, bankPayload)
            .catch(err => console.warn('Bank info update failed:', err))
        );
      }

      // Family information update
      const familyPayload = {
        father_name: familyDependents.value.father_name?.trim() || null,
        father_phone: familyDependents.value.father_phone?.trim() || null,
        mother_name: familyDependents.value.mother_name?.trim() || null,
        mother_phone: familyDependents.value.mother_phone?.trim() || null,
        emergency_contact_name: familyDependents.value.emergency_contact_name?.trim() || null,
        emergency_contact_relationship: familyDependents.value.emergency_contact_relationship?.trim() || null,
        emergency_contact_phone: familyDependents.value.emergency_contact_phone?.trim() || null
      };

      if (hasNonEmptyValues(familyPayload)) {
        tasks.push(
          employeeService.updateEmployeeFamilyInformation(employeeId, familyPayload)
            .catch(err => console.warn('Family info update failed:', err))
        );
      }

      // Education (only on create)
      if (!isEditing.value && personalFinance.value.school_name) {
        tasks.push(
          employeeEducationService.createEmployeeEducation({
            employee_id: employeeId,
            school_name: personalFinance.value.school_name?.trim(),
            degree: personalFinance.value.degree?.trim() || null,
            start_date: formatDateForAPI(personalFinance.value.education_start_date),
            end_date: formatDateForAPI(personalFinance.value.education_end_date),
            created_by: 'system',
            updated_by: 'system'
          }).catch(err => console.warn('Education create failed:', err))
        );
      }

      // Beneficiaries
      if (familyDependents.value.beneficiaries.length > 0) {
        const beneficiaryPromises = familyDependents.value.beneficiaries.map(b =>
          employeeBeneficiaryService.createBeneficiary({
            employee_id: employeeId,
            beneficiary_name: b.beneficiary_name,
            beneficiary_relationship: b.beneficiary_relationship || null,
            phone_number: b.phone_number,
            beneficiary_email: b.beneficiary_email || null,
            beneficiary_address: b.beneficiary_address || null
          }).catch(err => console.warn('Beneficiary create failed:', err))
        );
        tasks.push(Promise.all(beneficiaryPromises));
      }

      // Children
      if (familyDependents.value.children.length > 0) {
        const childrenPromises = familyDependents.value.children.map(c =>
          employeeChildrenService.createEmployeeChild({
            employee_id: employeeId,
            name: c.name,
            date_of_birth: c.date_of_birth || null
          }).catch(err => console.warn('Child create failed:', err))
        );
        tasks.push(Promise.all(childrenPromises));
      }

      // Execute all tasks in parallel
      if (tasks.length > 0) {
        await Promise.allSettled(tasks);
      }
    };

    const hasNonEmptyValues = (obj) => {
      return Object.values(obj).some(val => {
        if (Array.isArray(val)) return val.length > 0;
        return val !== null && val !== undefined && val !== '';
      });
    };

    const handleSubmitError = (error) => {
      let errorMessage = 'An error occurred while saving the employee.';

      if (error.response?.data) {
        const data = error.response.data;
        errorMessage = data.error || data.message || errorMessage;

        // Handle validation errors (422)
        if (data.errors) {
          const fieldErrors = {};
          Object.entries(data.errors).forEach(([field, messages]) => {
            fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
          });
          formErrors.value = { ...formErrors.value, ...fieldErrors };

          // Navigate to step with first error
          const step1Fields = ['organization', 'staff_id', 'first_name_en', 'gender', 'date_of_birth', 'status', 'nationality'];
          const step2Fields = ['mobile_phone', 'bank_account_number', 'religion', 'marital_status'];

          const errorFields = Object.keys(fieldErrors);
          if (errorFields.some(f => step1Fields.includes(f))) {
            currentStep.value = 0;
          } else if (errorFields.some(f => step2Fields.includes(f))) {
            currentStep.value = 1;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    };

    const handleClose = () => {
      resetForm();
      emit('close');
    };

    const handleAfterClose = () => {
      const backdrops = document.querySelectorAll('.ant-modal-mask, .ant-modal-wrap');
      const openModals = document.querySelectorAll('.ant-modal-wrap:not([style*="display: none"])');

      if (openModals.length === 0) {
        backdrops.forEach(el => {
          if (el.style.display !== 'none') {
            el.style.display = 'none';
          }
        });
      }

      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    // Watch for editingEmployee changes
    watch(() => props.editingEmployee, (newVal) => {
      if (newVal) {
        // Populate basicInfo
        basicInfo.value = {
          organization: newVal.organization || '',
          staff_id: newVal.staff_id || '',
          initial_en: newVal.initial_en || '',
          initial_th: newVal.initial_th || '',
          first_name_en: newVal.first_name_en || '',
          last_name_en: newVal.last_name_en || '',
          first_name_th: newVal.first_name_th || '',
          last_name_th: newVal.last_name_th || '',
          gender: newVal.gender || '',
          date_of_birth: newVal.date_of_birth ? dayjs(newVal.date_of_birth) : null,
          status: newVal.status || '',
          nationality: newVal.nationality || ''
        };

        // Populate personalFinance
        personalFinance.value = {
          mobile_phone: newVal.mobile_phone || '',
          religion: newVal.religion || '',
          marital_status: newVal.marital_status || '',
          spouse_name: newVal.spouse_name || '',
          spouse_phone_number: newVal.spouse_phone_number || '',
          current_address: newVal.current_address || '',
          permanent_address: newVal.permanent_address || '',
          social_security_number: newVal.social_security_number || '',
          tax_number: newVal.tax_number || '',
          identification_type: newVal.identification_type || '',
          identification_number: newVal.identification_number || '',
          identification_issue_date: newVal.identification_issue_date ? dayjs(newVal.identification_issue_date) : null,
          identification_expiry_date: newVal.identification_expiry_date ? dayjs(newVal.identification_expiry_date) : null,
          bank_name: newVal.bank_name || '',
          bank_branch: newVal.bank_branch || '',
          bank_account_name: newVal.bank_account_name || '',
          bank_account_number: newVal.bank_account_number || '',
          school_name: '',
          degree: '',
          education_start_date: null,
          education_end_date: null
        };

        // Populate familyDependents
        familyDependents.value = {
          father_name: newVal.father_name || '',
          father_phone: newVal.father_phone || '',
          mother_name: newVal.mother_name || '',
          mother_phone: newVal.mother_phone || '',
          emergency_contact_name: newVal.emergency_contact_name || '',
          emergency_contact_relationship: newVal.emergency_contact_relationship || '',
          emergency_contact_phone: newVal.emergency_contact_phone || '',
          beneficiaries: newVal.beneficiaries || [],
          children: newVal.children || []
        };

        currentStep.value = 0;
      } else {
        resetForm();
      }
    }, { immediate: true });

    // Watch visibility to load lookups
    watch(() => props.visible, async (newVal) => {
      if (newVal) {
        await loadLookups();
        if (!props.editingEmployee) {
          resetForm();
        }
      }
    });

    return {
      // State
      currentStep,
      loading,
      formErrors,
      activeCollapseKeys,
      basicInfo,
      personalFinance,
      familyDependents,
      newBeneficiary,
      newChild,

      // Computed
      isEditing,
      modalTitle,
      calculatedAge,

      // Lookup options
      organizationOptions,
      genderOptions,
      statusOptions,
      nationalityOptions,
      religionOptions,
      maritalStatusOptions,
      initialEnOptions,
      initialThOptions,
      bankNameOptions,
      identificationTypeOptions,

      // Table columns
      beneficiaryColumns,
      childrenColumns,

      // Methods
      nextStep,
      prevStep,
      addBeneficiary,
      removeBeneficiary,
      addChild,
      removeChild,
      handleSubmit,
      handleClose,
      handleAfterClose,
      formatDateForDisplay
    };
  }
};
</script>

<template>
  <a-modal
    :open="visible"
    :title="modalTitle"
    :confirmLoading="loading"
    @cancel="handleClose"
    @afterClose="handleAfterClose"
    :footer="null"
    :width="900"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
  >
    <!-- Steps Progress Indicator -->
    <a-steps :current="currentStep" class="mb-4" size="small">
      <a-step title="Basic Information" />
      <a-step title="Personal & Finance" />
      <a-step title="Family & Dependents" />
    </a-steps>

    <!-- Step Content -->
    <div class="step-content">
      <!-- Step 1: Basic Information -->
      <div v-show="currentStep === 0">
        <!-- Organization -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Organization <span class="text-danger">*</span> :</label>
          </div>
          <div class="form-input-col">
            <a-select
              v-model:value="basicInfo.organization"
              placeholder="Select an organization"
              :options="organizationOptions"
              :status="formErrors.organization ? 'error' : ''"
              class="input-short"
            />
            <div v-if="formErrors.organization" class="error-feedback">{{ formErrors.organization }}</div>
          </div>
        </div>

        <!-- Staff ID -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Staff ID <span class="text-danger">*</span> :</label>
          </div>
          <div class="form-input-col">
            <a-input
              v-model:value="basicInfo.staff_id"
              placeholder="Enter staff ID"
              :status="formErrors.staff_id ? 'error' : ''"
              class="input-medium"
            />
            <div v-if="formErrors.staff_id" class="error-feedback">{{ formErrors.staff_id }}</div>
          </div>
        </div>

        <!-- Initial (EN) -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Initial (EN) :</label>
          </div>
          <div class="form-input-col">
            <a-select
              v-model:value="basicInfo.initial_en"
              placeholder="Select initial"
              :options="initialEnOptions"
              allow-clear
              class="input-short"
            />
          </div>
        </div>

        <!-- Initial (TH) -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Initial (TH) :</label>
          </div>
          <div class="form-input-col">
            <a-select
              v-model:value="basicInfo.initial_th"
              placeholder="Select initial"
              :options="initialThOptions"
              allow-clear
              class="input-short"
            />
          </div>
        </div>

        <!-- First Name (EN) -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">First Name (EN) <span class="text-danger">*</span> :</label>
          </div>
          <div class="form-input-col">
            <a-input
              v-model:value="basicInfo.first_name_en"
              placeholder="Enter English first name"
              :status="formErrors.first_name_en ? 'error' : ''"
              :maxlength="255"
              class="input-medium"
            />
            <div v-if="formErrors.first_name_en" class="error-feedback">{{ formErrors.first_name_en }}</div>
          </div>
        </div>

        <!-- Last Name (EN) -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Last Name (EN) :</label>
          </div>
          <div class="form-input-col">
            <a-input
              v-model:value="basicInfo.last_name_en"
              placeholder="Enter English last name"
              :maxlength="255"
              class="input-medium"
            />
          </div>
        </div>

        <!-- First Name (TH) -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">First Name (TH) :</label>
          </div>
          <div class="form-input-col">
            <a-input
              v-model:value="basicInfo.first_name_th"
              placeholder="Enter Thai first name"
              :maxlength="255"
              class="input-medium"
            />
          </div>
        </div>

        <!-- Last Name (TH) -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Last Name (TH) :</label>
          </div>
          <div class="form-input-col">
            <a-input
              v-model:value="basicInfo.last_name_th"
              placeholder="Enter Thai last name"
              :maxlength="255"
              class="input-medium"
            />
          </div>
        </div>

        <!-- Gender -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Gender <span class="text-danger">*</span> :</label>
          </div>
          <div class="form-input-col">
            <a-select
              v-model:value="basicInfo.gender"
              placeholder="Select gender"
              :options="genderOptions"
              :status="formErrors.gender ? 'error' : ''"
              class="input-short"
            />
            <div v-if="formErrors.gender" class="error-feedback">{{ formErrors.gender }}</div>
          </div>
        </div>

        <!-- Date of Birth -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Date of Birth <span class="text-danger">*</span> :</label>
          </div>
          <div class="form-input-col">
            <div class="input-with-tooltip">
              <a-date-picker
                v-model:value="basicInfo.date_of_birth"
                placeholder="Select date"
                format="DD/MM/YYYY"
                :status="formErrors.date_of_birth ? 'error' : ''"
                class="input-short"
              />
              <span class="tooltip-icon" title="Select the employee's date of birth">
                <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); cursor: help;" />
              </span>
            </div>
            <div v-if="formErrors.date_of_birth" class="error-feedback">{{ formErrors.date_of_birth }}</div>
          </div>
        </div>

        <!-- Age (Computed) -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Age :</label>
          </div>
          <div class="form-input-col">
            <a-input
              :value="calculatedAge"
              placeholder="Auto-calculated"
              disabled
              class="input-short"
            />
          </div>
        </div>

        <!-- Status -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Status <span class="text-danger">*</span> :</label>
          </div>
          <div class="form-input-col">
            <a-select
              v-model:value="basicInfo.status"
              placeholder="Select status"
              :options="statusOptions"
              :status="formErrors.status ? 'error' : ''"
              class="input-short"
            />
            <div v-if="formErrors.status" class="error-feedback">{{ formErrors.status }}</div>
          </div>
        </div>

        <!-- Nationality -->
        <div class="form-row mb-3">
          <div class="form-label-col">
            <label class="form-label">Nationality :</label>
          </div>
          <div class="form-input-col">
            <a-select
              v-model:value="basicInfo.nationality"
              placeholder="Select nationality"
              :options="nationalityOptions"
              allow-clear
              show-search
              :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
              class="input-medium"
            />
          </div>
        </div>
      </div>

      <!-- Step 2: Personal & Finance -->
      <div v-show="currentStep === 1">
        <a-collapse v-model:activeKey="activeCollapseKeys" :bordered="false" class="step-collapse">
          <!-- Personal Information -->
          <a-collapse-panel key="personal" header="Personal Information">
            <template #extra><user-outlined /></template>

            <!-- Mobile Phone -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Mobile Phone :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.mobile_phone"
                  placeholder="Enter phone number"
                  :status="formErrors.mobile_phone ? 'error' : ''"
                  class="input-medium"
                />
                <div v-if="formErrors.mobile_phone" class="error-feedback">{{ formErrors.mobile_phone }}</div>
              </div>
            </div>

            <!-- Religion -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Religion :</label>
              </div>
              <div class="form-input-col">
                <a-select
                  v-model:value="personalFinance.religion"
                  placeholder="Select religion"
                  :options="religionOptions"
                  allow-clear
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Marital Status -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Marital Status :</label>
              </div>
              <div class="form-input-col">
                <a-select
                  v-model:value="personalFinance.marital_status"
                  placeholder="Select marital status"
                  :options="maritalStatusOptions"
                  allow-clear
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Spouse Name (conditional) -->
            <div v-if="personalFinance.marital_status === 'Married'" class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Spouse Name :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.spouse_name"
                  placeholder="Enter spouse name"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Spouse Phone (conditional) -->
            <div v-if="personalFinance.marital_status === 'Married'" class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Spouse Phone :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.spouse_phone_number"
                  placeholder="Enter spouse phone"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Social Security Number -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Social Security Number :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.social_security_number"
                  placeholder="Enter SSN"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Tax Number -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Tax Number :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.tax_number"
                  placeholder="Enter tax number"
                  class="input-medium"
                />
              </div>
            </div>
          </a-collapse-panel>

          <!-- Identification -->
          <a-collapse-panel key="identification" header="Identification">
            <template #extra><idcard-outlined /></template>

            <!-- ID Type -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">ID Type :</label>
              </div>
              <div class="form-input-col">
                <a-select
                  v-model:value="personalFinance.identification_type"
                  placeholder="Select ID type"
                  :options="identificationTypeOptions"
                  allow-clear
                  class="input-medium"
                />
              </div>
            </div>

            <!-- ID Number -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">ID Number :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.identification_number"
                  placeholder="Enter ID number"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- ID Issue Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">ID Issue Date :</label>
              </div>
              <div class="form-input-col">
                <a-date-picker
                  v-model:value="personalFinance.identification_issue_date"
                  placeholder="Select date"
                  format="DD/MM/YYYY"
                  class="input-short"
                />
              </div>
            </div>

            <!-- ID Expiry Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">ID Expiry Date :</label>
              </div>
              <div class="form-input-col">
                <a-date-picker
                  v-model:value="personalFinance.identification_expiry_date"
                  placeholder="Select date"
                  format="DD/MM/YYYY"
                  class="input-short"
                />
              </div>
            </div>
          </a-collapse-panel>

          <!-- Address Information -->
          <a-collapse-panel key="address" header="Address Information">
            <!-- Current Address -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Current Address :</label>
              </div>
              <div class="form-input-col">
                <a-textarea
                  v-model:value="personalFinance.current_address"
                  placeholder="Enter current address"
                  :rows="3"
                  style="width: 100%;"
                />
              </div>
            </div>

            <!-- Permanent Address -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Permanent Address :</label>
              </div>
              <div class="form-input-col">
                <a-textarea
                  v-model:value="personalFinance.permanent_address"
                  placeholder="Enter permanent address"
                  :rows="3"
                  style="width: 100%;"
                />
              </div>
            </div>
          </a-collapse-panel>

          <!-- Bank Information -->
          <a-collapse-panel key="bank" header="Bank Information">
            <template #extra><bank-outlined /></template>

            <!-- Bank Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Bank Name :</label>
              </div>
              <div class="form-input-col">
                <a-select
                  v-model:value="personalFinance.bank_name"
                  placeholder="Select bank"
                  :options="bankNameOptions"
                  allow-clear
                  show-search
                  :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Bank Branch -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Bank Branch :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.bank_branch"
                  placeholder="Enter bank branch"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Account Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Account Name :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.bank_account_name"
                  placeholder="Enter account holder name"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Account Number -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Account Number :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.bank_account_number"
                  placeholder="Enter account number"
                  :status="formErrors.bank_account_number ? 'error' : ''"
                  class="input-medium"
                />
                <div v-if="formErrors.bank_account_number" class="error-feedback">{{ formErrors.bank_account_number }}</div>
              </div>
            </div>
          </a-collapse-panel>

          <!-- Education -->
          <a-collapse-panel key="education" header="Education">
            <template #extra><book-outlined /></template>

            <!-- School Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">School/Institution :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.school_name"
                  placeholder="Enter school name"
                  style="width: 100%;"
                />
              </div>
            </div>

            <!-- Degree -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Degree/Qualification :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="personalFinance.degree"
                  placeholder="Enter degree"
                  style="width: 100%;"
                />
              </div>
            </div>

            <!-- Start Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Start Date :</label>
              </div>
              <div class="form-input-col">
                <a-date-picker
                  v-model:value="personalFinance.education_start_date"
                  placeholder="Select date"
                  format="DD/MM/YYYY"
                  class="input-short"
                />
              </div>
            </div>

            <!-- End Date -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">End Date :</label>
              </div>
              <div class="form-input-col">
                <a-date-picker
                  v-model:value="personalFinance.education_end_date"
                  placeholder="Select date"
                  format="DD/MM/YYYY"
                  class="input-short"
                />
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>

      <!-- Step 3: Family & Dependents -->
      <div v-show="currentStep === 2">
        <a-collapse v-model:activeKey="activeCollapseKeys" :bordered="false" class="step-collapse">
          <!-- Parents Information -->
          <a-collapse-panel key="parents" header="Parents Information">
            <template #extra><team-outlined /></template>

            <!-- Father's Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Father's Name :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="familyDependents.father_name"
                  placeholder="Enter father's name"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Father's Phone -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Father's Phone :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="familyDependents.father_phone"
                  placeholder="Enter father's phone"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Mother's Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Mother's Name :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="familyDependents.mother_name"
                  placeholder="Enter mother's name"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Mother's Phone -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Mother's Phone :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="familyDependents.mother_phone"
                  placeholder="Enter mother's phone"
                  class="input-medium"
                />
              </div>
            </div>
          </a-collapse-panel>

          <!-- Emergency Contact -->
          <a-collapse-panel key="emergency" header="Emergency Contact">
            <template #extra><phone-outlined /></template>

            <!-- Contact Name -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Contact Name :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="familyDependents.emergency_contact_name"
                  placeholder="Enter contact name"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Relationship -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Relationship :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="familyDependents.emergency_contact_relationship"
                  placeholder="Enter relationship"
                  class="input-medium"
                />
              </div>
            </div>

            <!-- Contact Phone -->
            <div class="form-row mb-3">
              <div class="form-label-col">
                <label class="form-label">Contact Phone :</label>
              </div>
              <div class="form-input-col">
                <a-input
                  v-model:value="familyDependents.emergency_contact_phone"
                  placeholder="Enter contact phone"
                  class="input-medium"
                />
              </div>
            </div>
          </a-collapse-panel>

          <!-- Beneficiaries -->
          <a-collapse-panel key="beneficiaries" header="Beneficiaries">
            <template #extra><heart-outlined /></template>

            <!-- Add Beneficiary Form -->
            <div class="add-entry-form mb-3">
              <a-row :gutter="[8, 8]">
                <a-col :span="6">
                  <a-input v-model:value="newBeneficiary.beneficiary_name" placeholder="Name *" size="small" />
                </a-col>
                <a-col :span="5">
                  <a-input v-model:value="newBeneficiary.beneficiary_relationship" placeholder="Relationship" size="small" />
                </a-col>
                <a-col :span="5">
                  <a-input v-model:value="newBeneficiary.phone_number" placeholder="Phone *" size="small" />
                </a-col>
                <a-col :span="5">
                  <a-input v-model:value="newBeneficiary.beneficiary_email" placeholder="Email" size="small" />
                </a-col>
                <a-col :span="3">
                  <a-button type="primary" size="small" @click="addBeneficiary" block>
                    <plus-outlined /> Add
                  </a-button>
                </a-col>
              </a-row>
            </div>

            <!-- Beneficiaries Table -->
            <a-table
              v-if="familyDependents.beneficiaries.length > 0"
              :dataSource="familyDependents.beneficiaries"
              :columns="beneficiaryColumns"
              :pagination="false"
              size="small"
              row-key="beneficiary_name"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'email'">
                  {{ record.beneficiary_email || '-' }}
                </template>
                <template v-if="column.key === 'action'">
                  <a-button type="text" danger size="small" @click="removeBeneficiary(index)">
                    <delete-outlined />
                  </a-button>
                </template>
              </template>
            </a-table>
            <a-empty v-else description="No beneficiaries added" :image-style="{ height: '60px' }" />
          </a-collapse-panel>

          <!-- Children -->
          <a-collapse-panel key="children" header="Children">
            <template #extra><team-outlined /></template>

            <!-- Add Child Form -->
            <div class="add-entry-form mb-3">
              <a-row :gutter="[8, 8]">
                <a-col :span="10">
                  <a-input v-model:value="newChild.name" placeholder="Child name *" size="small" />
                </a-col>
                <a-col :span="10">
                  <a-date-picker
                    v-model:value="newChild.date_of_birth"
                    placeholder="Date of birth"
                    format="DD/MM/YYYY"
                    size="small"
                    style="width: 100%;"
                  />
                </a-col>
                <a-col :span="4">
                  <a-button type="primary" size="small" @click="addChild" block>
                    <plus-outlined /> Add
                  </a-button>
                </a-col>
              </a-row>
            </div>

            <!-- Children Table -->
            <a-table
              v-if="familyDependents.children.length > 0"
              :dataSource="familyDependents.children"
              :columns="childrenColumns"
              :pagination="false"
              size="small"
              row-key="name"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'dob'">
                  {{ formatDateForDisplay(record.date_of_birth) }}
                </template>
                <template v-if="column.key === 'action'">
                  <a-button type="text" danger size="small" @click="removeChild(index)">
                    <delete-outlined />
                  </a-button>
                </template>
              </template>
            </a-table>
            <a-empty v-else description="No children added" :image-style="{ height: '60px' }" />
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>

    <!-- Footer Navigation -->
    <div class="modal-footer-actions">
      <a-button @click="handleClose" :disabled="loading">Cancel</a-button>
      <a-button v-if="currentStep > 0" @click="prevStep" :disabled="loading">Previous</a-button>
      <a-button v-if="currentStep < 2" type="primary" @click="nextStep" :disabled="loading">Next</a-button>
      <a-button v-if="currentStep === 2" type="primary" @click="handleSubmit" :loading="loading">
        {{ isEditing ? 'Update Employee' : 'Add Employee' }}
      </a-button>
    </div>
  </a-modal>
</template>

<style scoped>
/* Form layout */
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.form-label-col {
  flex: 0 0 160px;
  min-width: 160px;
  padding-top: 6px;
  display: flex;
  justify-content: flex-end;
}

.form-input-col {
  flex: 1;
  min-width: 0;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0;
  text-align: right;
  color: #262626;
  font-size: 14px;
  white-space: nowrap;
}

/* Input widths */
.input-short {
  width: 200px !important;
  max-width: 200px;
}

.input-medium {
  width: 300px !important;
  max-width: 300px;
}

/* Tooltip */
.input-with-tooltip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tooltip-icon {
  flex-shrink: 0;
}

/* Error feedback */
.error-feedback {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.text-danger {
  color: #ff4d4f;
}

/* Step content */
.step-content {
  min-height: 400px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

/* Collapse styling */
.step-collapse {
  background: transparent;
}

.step-collapse :deep(.ant-collapse-header) {
  font-weight: 500;
  padding: 12px 16px !important;
  background: #fafafa;
  border-radius: 4px !important;
}

.step-collapse :deep(.ant-collapse-content-box) {
  padding: 16px !important;
}

.step-collapse :deep(.ant-collapse-item) {
  margin-bottom: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px !important;
}

/* Add entry form */
.add-entry-form {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
}

/* Footer actions */
.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
  margin-top: 16px;
}

/* Steps styling */
:deep(.ant-steps) {
  padding: 0 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }

  .form-label-col {
    flex: 1;
    min-width: 100%;
    padding-top: 0;
    justify-content: flex-start;
  }

  .form-label {
    text-align: left;
  }

  .input-short,
  .input-medium {
    width: 100% !important;
    max-width: 100%;
  }

  :deep(.ant-picker),
  :deep(.ant-select) {
    width: 100% !important;
  }
}

/* Ant Design component overrides */
:deep(.input-short.ant-picker),
:deep(.input-short.ant-select) {
  width: 200px !important;
}

:deep(.input-medium.ant-input),
:deep(.input-medium.ant-select) {
  width: 300px !important;
}

:deep(.ant-select-selector) {
  min-width: inherit;
}
</style>

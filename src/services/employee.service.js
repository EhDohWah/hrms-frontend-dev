import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

class EmployeeService {

    /**
    * Update personal information of an employee.
    * 
    */
    async updateEmployeePersonalInformation(id, data) {
        const endpoint = API_ENDPOINTS.EMPLOYEE.UPDATE_PERSONAL_INFORMATION.replace(':id', id);
        return await apiService.put(endpoint, data);
    }

    // Update basic information
    async updateBasicInformation(id, data) {
        const endpoint = API_ENDPOINTS.EMPLOYEE.UPDATE_BASIC_INFORMATION.replace(':id', id);
        return await apiService.put(endpoint, data);
    }

    // Tree search
    async treeSearch(params = {}) {
        return await apiService.get(API_ENDPOINTS.EMPLOYEE.TREE_SEARCH, { params });
    }

    // employee.service.js
    /**
     * @param {number[]} ids
     */
    async deleteSelectedEmployees(ids) {
        return apiService.delete(
            API_ENDPOINTS.EMPLOYEE.DELETE_SELECTED,
            { ids }      // ← this will now become the JSON body
        );
    }


    // Get all employees with pagination and filtering support
    async getEmployees(params = {}) {
        // Extract all possible parameters with defaults
        const {
            per_page = '',
            staff_id = '',
            status = '',
            id_type = '',
            subsidiary = '',
            gender = '',
            date_of_birth = '',
            sort_by = '',
            sort_order = ''
        } = params;

        // Build query parameters object
        const queryParams = new URLSearchParams();
        queryParams.append('per_page', per_page);

        // Only add non-empty filter parameters
        if (staff_id) queryParams.append('staff_id', staff_id);
        if (status) queryParams.append('status', status);
        if (id_type) queryParams.append('id_type', id_type);
        if (subsidiary) queryParams.append('subsidiary', subsidiary);
        if (gender) queryParams.append('gender', gender);
        if (date_of_birth) queryParams.append('date_of_birth', date_of_birth);
        if (sort_by) queryParams.append('sort_by', sort_by);
        if (sort_order) queryParams.append('sort_order', sort_order);

        // Use the base endpoint without the query parameters that are already in the URL
        const endpoint = API_ENDPOINTS.EMPLOYEE.LIST.split('?')[0];

        return await apiService.get(`${endpoint}?${queryParams.toString()}`);
    }

    // Get single employee
    async getSingleEmployee(staffId) {
        const endpoint = API_ENDPOINTS.EMPLOYEE.SINGLE.replace(':staffId', staffId);
        return await apiService.get(endpoint);
    }

    // Get employee details
    async getEmployeeDetails(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE.DETAILS.replace(':id', id);
        return await apiService.get(endpoint);
    }

    // Create employee
    async createEmployee(data) {
        const formattedData = this.formatEmployeeData(data);
        return await apiService.post(API_ENDPOINTS.EMPLOYEE.CREATE, formattedData);
    }

    // Update employee
    async updateEmployee(id, data) {
        const endpoint = API_ENDPOINTS.EMPLOYEE.UPDATE.replace(':id', id);
        const formattedData = this.formatEmployeeData(data);
        return await apiService.put(endpoint, formattedData);
    }

    // Delete employee
    async deleteEmployee(id) {
        const endpoint = API_ENDPOINTS.EMPLOYEE.DELETE.replace(':id', id);
        return await apiService.delete(endpoint);
    }

    // Filter employees
    async filterEmployees(filters) {
        return await apiService.get(API_ENDPOINTS.EMPLOYEE.FILTER, { params: filters });
    }

    // Get site records
    async getSiteRecords() {
        return await apiService.get(API_ENDPOINTS.EMPLOYEE.SITE_RECORDS);
    }

    // Upload employee profile picture
    async uploadProfilePicture(id, imageFile) {
        try {
            // Check if a file was actually provided
            if (!imageFile) {
                throw new Error('No file selected');
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('profile_picture', imageFile);

            // Make the API request with FormData
            const endpoint = API_ENDPOINTS.EMPLOYEE.UPLOAD_PROFILE_PICTURE.replace(':id', id);
            return await apiService.postFormData(endpoint, formData);
        } catch (error) {
            console.error('Error uploading employee profile picture:', error);
            throw error;
        }
    }

    // Helper method to format employee data according to API schema
    formatEmployeeData(data) {
        return {
            staff_id: data.staff_id,
            subsidiary: data.subsidiary,
            first_name_en: data.first_name_en,
            last_name_en: data.last_name_en,
            first_name_th: data.first_name_th,
            last_name_th: data.last_name_th,
            initial_en: data.initial_en,
            initial_th: data.initial_th,
            joining_date: data.joining_date,
            phone: data.phone,
            gender: data.gender,
            age: data.age,
            status: data.status,
            nationality: data.nationality,
            date_of_birth: data.date_of_birth,
            employee_status: data.employee_status,
            religion: data.religion,
            identification_number: data.identification_number,
            social_security_number: data.social_security_number,
            tax_number: data.tax_number,
            passport_number: data.passport_number,
            bank_name: data.bank_name,
            bank_branch: data.bank_branch,
            bank_account_name: data.bank_account_name,
            bank_account_number: data.bank_account_number,
            office_phone: data.office_phone,
            mobile_phone: data.mobile_phone,
            permanent_address: data.permanent_address,
            current_address: data.current_address,
            marital_status: data.marital_status,
        };
    }

    // Upload employee file
    async uploadEmployeeFile(formData) {
        try {
            return await apiService.postFormData(API_ENDPOINTS.EMPLOYEE.UPLOAD_FILE, formData);
        } catch (error) {
            console.error('Error uploading employee file:', error);
            throw error;
        }
    }
}

export const employeeService = new EmployeeService();
export default employeeService;
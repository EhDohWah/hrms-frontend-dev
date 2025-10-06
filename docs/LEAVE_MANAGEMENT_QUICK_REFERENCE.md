# Leave Management System - Quick Reference Guide

**Version:** 2.0  
**Last Updated:** October 4, 2025  

## 🚀 Quick Start

### **API Payload Structure**
```javascript
// Complete payload for creating/updating leave requests
{
  employee_id: 123,                    // Required: Employee ID
  leave_type_id: 1,                   // Required: Leave type ID
  start_date: "2024-12-01",           // Required: YYYY-MM-DD format
  end_date: "2024-12-05",             // Required: YYYY-MM-DD format
  total_days: 5,                      // Required: Calculated days
  reason: "Family vacation",          // Optional: Leave reason
  status: "pending",                  // Required: pending/approved/declined/cancelled
  supervisor_approved: false,         // Boolean: Supervisor approval status
  supervisor_approved_date: null,     // Date: When supervisor approved (if applicable)
  hr_approved: false,                 // Boolean: HR approval status
  hr_approved_date: null,             // Date: When HR approved (if applicable)
  site_admin_approved: false,         // Boolean: Site admin approval status
  site_admin_approved_date: null,     // Date: When site admin approved (if applicable)
  attachment_notes: "Medical cert"    // Optional: Text notes about attachments
}
```

## 📋 Form Fields Reference

### **Required Fields**
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `employee_id` | Integer | Required | Selected employee ID |
| `leave_type_id` | Integer | Required | Selected leave type ID |
| `start_date` | Date | Required | Leave start date |
| `end_date` | Date | Required | Leave end date |
| `total_days` | Number | > 0 | Calculated working days |

### **Optional Fields**
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `reason` | String | null | Purpose of leave |
| `status` | String | "pending" | Request status |
| `attachment_notes` | String | null | Notes about physical documents |

### **Approval Fields**
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `supervisor_approved` | Boolean | false | Supervisor approval flag |
| `supervisor_approved_date` | Date | null | Date of supervisor approval |
| `hr_approved` | Boolean | false | HR approval flag |
| `hr_approved_date` | Date | null | Date of HR approval |
| `site_admin_approved` | Boolean | false | Site admin approval flag |
| `site_admin_approved_date` | Date | null | Date of site admin approval |

## 🔧 Component Usage

### **Modal Component**
```vue
<template>
  <LeavesAdminModal 
    ref="leavesAdminModal" 
    :selectedLeaveRequest="selectedLeaveRequest"
    @leave-request-created="handleLeaveRequestCreated" 
    @clear-selection="clearSelectedLeaveRequest">
  </LeavesAdminModal>
</template>

<script>
import LeavesAdminModal from '@/components/modal/leaves-admin-modal.vue';

export default {
  components: { LeavesAdminModal },
  methods: {
    openCreateModal() {
      this.selectedLeaveRequest = null;
      // Modal opens via Bootstrap data attributes
    },
    
    editLeaveRequest(record) {
      this.selectedLeaveRequest = record;
      this.$refs.leavesAdminModal.openEditModal(record);
    },
    
    handleLeaveRequestCreated(data) {
      // Handle successful creation/update
      this.refreshLeaveRequests();
    }
  }
}
</script>
```

### **Store Usage**
```javascript
import { useLeaveStore } from '@/stores/leaveStore';

const leaveStore = useLeaveStore();

// Create leave request
const result = await leaveStore.createLeaveRequest(payload);

// Update leave request
const result = await leaveStore.updateLeaveRequest(id, payload);

// Delete leave request
const result = await leaveStore.deleteLeaveRequest(id);

// Fetch leave requests with filters
const params = {
  page: 1,
  per_page: 10,
  search: 'employee name',
  status: 'pending'
};
await leaveStore.fetchLeaveRequests(params);
```

## 🎨 Template Examples

### **Approval Checkboxes**
```vue
<template>
  <!-- Supervisor Approval -->
  <div class="form-check">
    <input type="checkbox" v-model="formData.supervisor_approved" 
           class="form-check-input" id="supervisorApproved">
    <label class="form-check-label" for="supervisorApproved">
      Supervisor Approved
    </label>
  </div>
  <input type="date" v-model="formData.supervisor_approved_date" 
         class="form-control" :disabled="!formData.supervisor_approved" />
</template>
```

### **Approval Display**
```vue
<template>
  <div v-if="record.supervisorApproved" class="d-flex align-items-center">
    <i class="ti ti-user-check text-success me-1"></i>
    <small class="text-muted">
      Supervisor Approved
      <span v-if="record.supervisorApprovedDate" class="text-info">
        ({{ formatDate(record.supervisorApprovedDate) }})
      </span>
    </small>
  </div>
</template>
```

### **Attachment Notes**
```vue
<template>
  <div class="mb-3">
    <label class="form-label">Attachment Notes</label>
    <textarea v-model="formData.attachment_notes" class="form-control" rows="2"
              placeholder="e.g., 'Medical certificate submitted', 'Travel documents provided'">
    </textarea>
    <small class="text-muted">Text-based reference to any attachments received</small>
  </div>
</template>
```

## 🔍 Debugging

### **Console Logging**
Key debug points in the system:
```javascript
// Modal payload
console.log('📤 Payload being sent:', payload);

// Form validation
console.log('📋 Current formData:', JSON.stringify(dataToValidate, null, 2));

// Balance loading
console.log(`📊 Loading leave balance for employee ${employeeId}, leave type ${leaveTypeId}`);

// API responses
console.log('✅ Leave request created successfully:', result.data);
```

### **Common Issues**

#### **Empty Payload**
```javascript
// Problem: Missing required fields
{
  "start_date": "",
  "end_date": "",
  "reason": null
}

// Solution: Check form data binding
// Ensure v-model bindings are correct in template
```

#### **Validation Errors**
```javascript
// Problem: API validation failures
{
  "success": false,
  "error": "The employee id field is required."
}

// Solution: Check data mapping
// Verify dataMapper.mapLeaveRequestForAPI() function
```

#### **Approval Display Issues**
```javascript
// Problem: Approvals not showing
// Check field names in template:
record.supervisorApproved  // ✅ Correct
record.supervisorName      // ❌ Old format
```

## 📊 Data Flow

### **Create Flow**
```
1. User fills form → formData (snake_case)
2. submitForm() → validates and creates payload
3. leaveStore.createLeaveRequest(payload)
4. leaveService.createLeaveRequest(payload)
5. dataMapper.mapLeaveRequestForAPI(payload)
6. apiService.post(endpoint, mappedPayload)
7. Backend processes request
8. Response mapped back to frontend format
9. UI updated with new data
```

### **Edit Flow**
```
1. User clicks edit → populateEditForm(record)
2. Modal opens with editFormData populated
3. User modifies form → editFormData updated
4. submitForm() → uses editFormData
5. leaveStore.updateLeaveRequest(id, payload)
6. Same mapping and API flow as create
7. UI updated with modified data
```

## 🛠️ Customization

### **Adding New Approval Level**
```javascript
// 1. Add to form data
formData: {
  // ... existing fields ...
  manager_approved: false,
  manager_approved_date: null
}

// 2. Add to payload mapping
mapLeaveRequestForAPI(frontendData) {
  return {
    // ... existing fields ...
    manager_approved: frontendData.manager_approved || false,
    manager_approved_date: frontendData.manager_approved_date || null
  };
}

// 3. Add to template
<div class="form-check">
  <input type="checkbox" v-model="formData.manager_approved" />
  <label>Manager Approved</label>
</div>
```

### **Custom Validation**
```javascript
validateForm(formData) {
  // ... existing validation ...
  
  // Custom validation example
  if (formData.total_days > 30 && !formData.attachment_notes?.trim()) {
    this.errors.attachment_notes = 'Long leave requests require attachment notes';
  }
  
  return Object.keys(this.errors).length === 0;
}
```

## 📚 API Endpoints

### **Leave Requests**
- `GET /api/v1/leaves/requests` - List with pagination/filtering
- `POST /api/v1/leaves/requests` - Create new request
- `GET /api/v1/leaves/requests/{id}` - Get specific request
- `PUT /api/v1/leaves/requests/{id}` - Update request
- `DELETE /api/v1/leaves/requests/{id}` - Delete request

### **Leave Types**
- `GET /api/v1/leaves/types` - List leave types
- `POST /api/v1/leaves/types` - Create leave type
- `PUT /api/v1/leaves/types/{id}` - Update leave type

### **Leave Balances**
- `GET /api/v1/leaves/balances` - List balances
- `GET /api/v1/leaves/balance/{employeeId}/{leaveTypeId}` - Get specific balance

## 🔐 Permissions

Required permissions for leave management:
- `leave_request.create` - Create leave requests
- `leave_request.read` - View leave data
- `leave_request.update` - Edit leave records
- `leave_request.delete` - Delete leave records

---

**Need Help?** Check the full documentation:
- [Frontend API Alignment](./LEAVE_MANAGEMENT_FRONTEND_API_ALIGNMENT.md)
- [Implementation Summary](./LEAVE_MANAGEMENT_IMPLEMENTATION_SUMMARY.md)

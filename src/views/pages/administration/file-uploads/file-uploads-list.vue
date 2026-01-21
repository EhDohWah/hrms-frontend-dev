<template>
  <layout-header />
  <layout-sidebar />
  <div class="page-wrapper">
    <div class="content">
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <div class="d-flex align-items-center">
          <index-breadcrumb :title="title" :text="text" :text1="text1" />
          <!-- Read-Only Badge -->
          <span 
            v-if="isReadOnly" 
            class="badge bg-warning text-dark ms-3 d-flex align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h5>File Upload Manager</h5>
          <p class="text-muted">Upload Excel files for bulk data imports</p>
        </div>
        <div class="card-body p-0">
          
          <!-- Grant Uploads Section -->
          <div class="upload-category">
            <div class="category-header">
              <h6 class="mb-0"><i class="ti ti-award"></i> Grant Data</h6>
            </div>
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Upload Type</th>
                    <th>Select File</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <GrantUpload :can-edit="canEdit" @upload-complete="onUploadComplete" />
                </tbody>
              </table>
            </div>
          </div>

          <!-- Employee Uploads Section -->
          <div class="upload-category">
            <div class="category-header">
              <h6 class="mb-0"><i class="ti ti-users"></i> Employee Data</h6>
            </div>
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Upload Type</th>
                    <th>Select File</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <EmployeeUpload :can-edit="canEdit" @upload-complete="onUploadComplete" />
                </tbody>
              </table>
            </div>
          </div>

          <!-- Employment Uploads Section -->
          <div class="upload-category">
            <div class="category-header">
              <h6 class="mb-0"><i class="ti ti-briefcase"></i> Employment Records</h6>
            </div>
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Upload Type</th>
                    <th>Select File</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <EmploymentUpload :can-edit="canEdit" @upload-complete="onUploadComplete" />
                </tbody>
              </table>
            </div>
          </div>

          <!-- Employee Funding Allocations Upload Section -->
          <div class="upload-category">
            <div class="category-header">
              <h6 class="mb-0"><i class="ti ti-chart-pie"></i> Employee Funding Allocations</h6>
            </div>
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Upload Type</th>
                    <th>Select File</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <FundingAllocationUpload :can-edit="canEdit" @upload-complete="onUploadComplete" />
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payroll Uploads Section -->
          <div class="upload-category">
            <div class="category-header">
              <h6 class="mb-0"><i class="ti ti-calculator"></i> Payroll Data</h6>
            </div>
            <div class="table-responsive">
              <table class="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Upload Type</th>
                    <th>Select File</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <PayrollUpload :can-edit="canEdit" @upload-complete="onUploadComplete" />
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
    <layout-footer />
  </div>
</template>

<script>
import GrantUpload from '@/components/uploads/grant-upload.vue';
import EmployeeUpload from '@/components/uploads/employee-upload.vue';
import EmploymentUpload from '@/components/uploads/employment-upload.vue';
import FundingAllocationUpload from '@/components/uploads/funding-allocation-upload.vue';
import PayrollUpload from '@/components/uploads/payroll-upload.vue';
import LayoutHeader from '@/views/layouts/layout-header.vue';
import LayoutSidebar from '@/views/layouts/layout-sidebar.vue';
import LayoutFooter from '@/views/layouts/layout-footer.vue';
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { usePermissions } from '@/composables/usePermissions';

export default {
  name: 'FileUploadsList',
  components: { 
    GrantUpload,
    EmployeeUpload, 
    EmploymentUpload,
    FundingAllocationUpload,
    PayrollUpload,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
    indexBreadcrumb
  },
  setup() {
    // Initialize permission checks for file_uploads module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('file_uploads');
    
    return {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    };
  },
  data() {
    return {
      title: "File Uploads",
      text: "Administration",
      text1: "File Uploads"
    };
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
    onUploadComplete(data) {
      console.log('Upload completed:', data);
    }
  }
};
</script>

<style scoped>
.upload-category {
  margin-bottom: 2rem;
}

.upload-category:last-child {
  margin-bottom: 0;
}

.category-header {
  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem 1.5rem;
  border-left: 4px solid #007bff;
  margin-bottom: 0;
  border-top: 1px solid #dee2e6;
}

.category-header h6 {
  color: #495057;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-header i {
  color: #007bff;
  font-size: 1.1rem;
}

.upload-category .table {
  margin-bottom: 0;
}

.upload-category .table thead th {
  background-color: #f8f9fa;
  border-top: none;
  font-weight: 600;
  color: #6c757d;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
}

/* Consistent column widths */
.upload-category .table thead th:nth-child(1) {
  width: 35%;
}

.upload-category .table thead th:nth-child(2) {
  width: 40%;
}

.upload-category .table thead th:nth-child(3) {
  width: 25%;
}

.upload-category .table tbody tr {
  border-bottom: 1px solid #f1f3f4;
}

.upload-category .table tbody tr:hover {
  background-color: #f8f9fa;
}

/* Custom styling for each category */
.upload-category:nth-child(1) .category-header {
  border-left-color: #007bff;
}

.upload-category:nth-child(1) .category-header i {
  color: #007bff;
}

.upload-category:nth-child(2) .category-header {
  border-left-color: #28a745;
}

.upload-category:nth-child(2) .category-header i {
  color: #28a745;
}

.upload-category:nth-child(3) .category-header {
  border-left-color: #ffc107;
}

.upload-category:nth-child(3) .category-header i {
  color: #ffc107;
}

.upload-category:nth-child(4) .category-header {
  border-left-color: #17a2b8;
}

.upload-category:nth-child(4) .category-header i {
  color: #17a2b8;
}

.upload-category:nth-child(5) .category-header {
  border-left-color: #6f42c1;
}

.upload-category:nth-child(5) .category-header i {
  color: #6f42c1;
}
</style>
























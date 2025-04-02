<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">
                    <i class="ti ti-file-type-pdf me-1"></i>Export as PDF
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">
                    <i class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="me-2 mb-2">
            <div class="input-group">
              <span class="input-group-text" id="basic-addon1">
                <i class="ti ti-calendar"></i>
              </span>
              <date-picker v-model="dateRange" range class="form-control" placeholder="Select Date Range" />
            </div>
          </div>
          <div class="me-2 mb-2">
            <select class="form-select">
              <option value="">All Departments</option>
              <option value="IT">IT Department</option>
              <option value="HR">HR Department</option>
              <option value="Finance">Finance Department</option>
            </select>
          </div>
          <div class="me-2 mb-2">
            <select class="form-select" v-model="statusFilter">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Travel Request Stats -->
      <div class="row">
        <div class="col-xl-3 col-sm-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="avatar avatar-lg bg-primary-transparent">
                  <i class="ti ti-file-description fs-20"></i>
                </div>
                <div class="ms-3">
                  <h6 class="mb-1">Total Requests</h6>
                  <h4 class="mb-0">{{ stats.total }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="avatar avatar-lg bg-warning-transparent">
                  <i class="ti ti-clock fs-20"></i>
                </div>
                <div class="ms-3">
                  <h6 class="mb-1">Pending</h6>
                  <h4 class="mb-0">{{ stats.pending }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="avatar avatar-lg bg-success-transparent">
                  <i class="ti ti-check fs-20"></i>
                </div>
                <div class="ms-3">
                  <h6 class="mb-1">Approved</h6>
                  <h4 class="mb-0">{{ stats.approved }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="avatar avatar-lg bg-danger-transparent">
                  <i class="ti ti-x fs-20"></i>
                </div>
                <div class="ms-3">
                  <h6 class="mb-1">Rejected</h6>
                  <h4 class="mb-0">{{ stats.rejected }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Travel Requests Table -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped custom-table mb-0">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Request ID</th>
                  <th>Purpose</th>
                  <th>Destination</th>
                  <th>Duration</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in filteredRequests" :key="request.id">
                  <td>
                    <div class="d-flex align-items-center">
                      <img :src="request.employeeImage" class="avatar avatar-sm rounded-circle me-2" />
                      <div>
                        <h6 class="mb-0">{{ request.employeeName }}</h6>
                        <small>{{ request.department }}</small>
                      </div>
                    </div>
                  </td>
                  <td>{{ request.requestId }}</td>
                  <td>{{ request.purpose }}</td>
                  <td>{{ request.destination }}</td>
                  <td>{{ request.duration }}</td>
                  <td>{{ request.submittedDate }}</td>
                  <td>
                    <span :class="'badge ' + getStatusClass(request.status)">
                      {{ request.status }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="dropdown dropdown-action">
                      <a href="javascript:void(0);" class="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="ti ti-dots-vertical"></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="javascript:void(0);" @click="viewDetails(request)">
                          <i class="ti ti-eye me-2"></i>View Details
                        </a>
                        <a class="dropdown-item" href="javascript:void(0);" @click="approveRequest(request)" v-if="request.status === 'Pending'">
                          <i class="ti ti-check me-2"></i>Approve
                        </a>
                        <a class="dropdown-item" href="javascript:void(0);" @click="rejectRequest(request)" v-if="request.status === 'Pending'">
                          <i class="ti ti-x me-2"></i>Reject
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>

  <!-- View Details Modal -->
  <div class="modal fade" id="view_details" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Travel Request Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" v-if="selectedRequest">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Employee Name</label>
                <p class="form-control-static">{{ selectedRequest.employeeName }}</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Department</label>
                <p class="form-control-static">{{ selectedRequest.department }}</p>
              </div>
            </div>
          </div>
          <!-- Add more details as needed -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: 'TravelAdmin',
  data() {
    return {
      title: "Travel Requests Admin",
      text: "Requests",
      text1: "Travel Admin",
      dateRange: null,
      statusFilter: '',
      selectedRequest: null,
      stats: {
        total: 45,
        pending: 15,
        approved: 25,
        rejected: 5
      },
      requests: [
        {
          id: 1,
          employeeName: "John Doe",
          employeeImage: require("@/assets/img/profiles/avatar-02.jpg"),
          department: "IT Department",
          requestId: "TR-001",
          purpose: "Client Meeting",
          destination: "New York",
          duration: "5 days",
          submittedDate: "2024-01-15",
          status: "Pending"
        },
        {
          id: 2,
          employeeName: "Jane Smith",
          employeeImage: require("@/assets/img/profiles/avatar-03.jpg"),
          department: "HR Department",
          requestId: "TR-002",
          purpose: "Conference",
          destination: "London",
          duration: "7 days",
          submittedDate: "2024-01-16",
          status: "Approved"
        }
        // Add more sample data as needed
      ]
    };
  },
  computed: {
    filteredRequests() {
      return this.requests.filter(request => {
        if (this.statusFilter && request.status.toLowerCase() !== this.statusFilter.toLowerCase()) {
          return false;
        }
        // Add more filters as needed
        return true;
      });
    }
  },
  methods: {
    getStatusClass(status) {
      switch (status.toLowerCase()) {
        case 'approved':
          return 'bg-success';
        case 'pending':
          return 'bg-warning';
        case 'rejected':
          return 'bg-danger';
        default:
          return 'bg-secondary';
      }
    },
    viewDetails(request) {
      this.selectedRequest = request;
      new Modal(document.getElementById('view_details')).show();
    },
    approveRequest(request) {
      // Implement approval logic
      request.status = 'Approved';
      this.updateStats();
    },
    rejectRequest(request) {
      // Implement rejection logic
      request.status = 'Rejected';
      this.updateStats();
    },
    updateStats() {
      this.stats.pending = this.requests.filter(r => r.status === 'Pending').length;
      this.stats.approved = this.requests.filter(r => r.status === 'Approved').length;
      this.stats.rejected = this.requests.filter(r => r.status === 'Rejected').length;
    }
  }
};
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
}
.badge {
  font-size: 12px;
  padding: 5px 10px;
}
</style> 
<template>
  <div class="leave-summary-widget">
    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border spinner-border-sm" role="status"></div>
    </div>
    <div v-else>
      <div class="row g-3 mb-3">
        <div class="col-6">
          <div class="d-flex align-items-center">
            <div class="stat-icon bg-warning-light text-warning me-3">
              <i class="ti ti-clock"></i>
            </div>
            <div>
              <h4 class="mb-0">{{ stats.pending }}</h4>
              <small class="text-muted">Pending Requests</small>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="d-flex align-items-center">
            <div class="stat-icon bg-success-light text-success me-3">
              <i class="ti ti-check"></i>
            </div>
            <div>
              <h4 class="mb-0">{{ stats.approved }}</h4>
              <small class="text-muted">Approved</small>
            </div>
          </div>
        </div>
      </div>
      
      <div class="recent-leaves">
        <h6 class="mb-2">Recent Leave Requests</h6>
        <div v-if="recentLeaves.length === 0" class="text-muted text-center py-2">
          No recent leave requests
        </div>
        <div v-else class="list-group list-group-flush">
          <div 
            v-for="leave in recentLeaves" 
            :key="leave.id"
            class="list-group-item px-0 py-2 d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{{ leave.employee_name }}</strong>
              <br>
              <small class="text-muted">{{ leave.leave_type }} - {{ leave.dates }}</small>
            </div>
            <span 
              class="badge"
              :class="getStatusBadgeClass(leave.status)"
            >
              {{ leave.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { leaveService } from '@/services/leave.service';

export default {
  name: 'LeaveSummaryWidget',
  props: {
    widget: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: true,
      stats: {
        pending: 0,
        approved: 0,
      },
      recentLeaves: [],
    };
  },
  async mounted() {
    await this.loadLeaveData();
  },
  methods: {
    async loadLeaveData() {
      this.loading = true;
      try {
        const response = await leaveService.getLeaveRequests({ 
          per_page: 5,
          sort_by: 'created_at',
          sort_order: 'desc'
        });
        
        const data = response.data || response;
        const leaves = data.data || data || [];
        
        this.stats.pending = leaves.filter(l => l.status === 'pending').length;
        this.stats.approved = leaves.filter(l => l.status === 'approved').length;
        
        this.recentLeaves = leaves.slice(0, 5).map(leave => ({
          id: leave.id,
          employee_name: leave.employee?.full_name || leave.staff_id || 'Unknown',
          leave_type: leave.leave_type?.name || leave.leave_type || 'Leave',
          dates: this.formatDates(leave.start_date, leave.end_date),
          status: leave.status,
        }));
      } catch (error) {
        console.error('Error loading leave data:', error);
        this.recentLeaves = [];
      } finally {
        this.loading = false;
      }
    },
    
    formatDates(start, end) {
      if (!start) return '';
      const startDate = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!end || start === end) return startDate;
      const endDate = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${startDate} - ${endDate}`;
    },
    
    getStatusBadgeClass(status) {
      const classes = {
        pending: 'bg-warning',
        approved: 'bg-success',
        rejected: 'bg-danger',
        cancelled: 'bg-secondary',
      };
      return classes[status?.toLowerCase()] || 'bg-secondary';
    },
  },
};
</script>

<style scoped>
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.bg-warning-light {
  background-color: rgba(255, 193, 7, 0.1) !important;
}

.bg-success-light {
  background-color: rgba(25, 135, 84, 0.1) !important;
}

.list-group-item {
  border-left: 0;
  border-right: 0;
}

.list-group-item:first-child {
  border-top: 0;
}
</style>

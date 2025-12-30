<template>
  <div class="employee-stats-widget">
    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border spinner-border-sm" role="status"></div>
    </div>
    <div v-else class="row g-3">
      <div class="col-6 col-md-3">
        <div class="stat-card text-center p-3 rounded bg-primary-light">
          <i class="ti ti-users text-primary mb-2" style="font-size: 2rem;"></i>
          <h3 class="mb-0">{{ stats.totalEmployees }}</h3>
          <small class="text-muted">Total Employees</small>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card text-center p-3 rounded bg-success-light">
          <i class="ti ti-user-check text-success mb-2" style="font-size: 2rem;"></i>
          <h3 class="mb-0">{{ stats.activeEmployees }}</h3>
          <small class="text-muted">Active</small>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card text-center p-3 rounded bg-warning-light">
          <i class="ti ti-building text-warning mb-2" style="font-size: 2rem;"></i>
          <h3 class="mb-0">{{ stats.departments }}</h3>
          <small class="text-muted">Departments</small>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card text-center p-3 rounded bg-info-light">
          <i class="ti ti-user-plus text-info mb-2" style="font-size: 2rem;"></i>
          <h3 class="mb-0">{{ stats.newHiresThisMonth }}</h3>
          <small class="text-muted">New This Month</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { employeeService } from '@/services/employee.service';

export default {
  name: 'EmployeeStatsWidget',
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
        totalEmployees: 0,
        activeEmployees: 0,
        departments: 0,
        newHiresThisMonth: 0,
      },
    };
  },
  async mounted() {
    await this.loadStats();
  },
  methods: {
    async loadStats() {
      this.loading = true;
      try {
        // Fetch employee stats from API
        const response = await employeeService.getEmployees({ per_page: 1 });
        const data = response.data || response;
        
        this.stats.totalEmployees = data.total || data.length || 0;
        this.stats.activeEmployees = data.active_count || this.stats.totalEmployees;
        this.stats.departments = data.department_count || 0;
        this.stats.newHiresThisMonth = data.new_hires_count || 0;
      } catch (error) {
        console.error('Error loading employee stats:', error);
        // Use placeholder data on error
        this.stats = {
          totalEmployees: '-',
          activeEmployees: '-',
          departments: '-',
          newHiresThisMonth: '-',
        };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.stat-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card h3 {
  font-size: 1.75rem;
  font-weight: 600;
}

.bg-primary-light {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.bg-success-light {
  background-color: rgba(25, 135, 84, 0.1) !important;
}

.bg-warning-light {
  background-color: rgba(255, 193, 7, 0.1) !important;
}

.bg-info-light {
  background-color: rgba(13, 202, 240, 0.1) !important;
}
</style>

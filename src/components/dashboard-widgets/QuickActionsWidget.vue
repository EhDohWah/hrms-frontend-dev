<template>
  <div class="quick-actions-widget">
    <div class="row g-2">
      <div 
        v-for="action in visibleActions" 
        :key="action.key"
        class="col-6 col-md-4 col-lg-3"
      >
        <router-link 
          :to="action.route"
          class="quick-action-card d-flex flex-column align-items-center p-3 rounded text-decoration-none"
          :class="action.colorClass"
        >
          <i :class="action.icon" class="mb-2" style="font-size: 1.5rem;"></i>
          <span class="text-center small">{{ action.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickActionsWidget',
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
      actions: [
        {
          key: 'employees',
          label: 'View Employees',
          icon: 'ti ti-users',
          route: '/employee/employees-list',
          permission: 'employee.read',
          colorClass: 'bg-primary-light text-primary',
        },
        {
          key: 'add-employee',
          label: 'Add Employee',
          icon: 'ti ti-user-plus',
          route: '/employee/add-employee',
          permission: 'employee.edit',
          colorClass: 'bg-success-light text-success',
        },
        {
          key: 'leave-requests',
          label: 'Leave Requests',
          icon: 'ti ti-calendar-off',
          route: '/leave/leave-requests',
          permission: 'leave.read',
          colorClass: 'bg-warning-light text-warning',
        },
        {
          key: 'payroll',
          label: 'Payroll',
          icon: 'ti ti-cash',
          route: '/payroll',
          permission: 'employee_salary.read',
          colorClass: 'bg-info-light text-info',
        },
        {
          key: 'reports',
          label: 'Reports',
          icon: 'ti ti-chart-bar',
          route: '/reports',
          permission: 'report.read',
          colorClass: 'bg-danger-light text-danger',
        },
        {
          key: 'departments',
          label: 'Departments',
          icon: 'ti ti-building',
          route: '/organization-structure/departments',
          permission: 'department.read',
          colorClass: 'bg-secondary-light text-secondary',
        },
      ],
    };
  },
  computed: {
    userPermissions() {
      return JSON.parse(localStorage.getItem('permissions') || '[]');
    },
    visibleActions() {
      return this.actions.filter(action => {
        if (!action.permission) return true;
        return this.userPermissions.includes(action.permission);
      }).slice(0, 6); // Show max 6 actions
    },
  },
};
</script>

<style scoped>
.quick-action-card {
  background-color: #f8f9fa;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.quick-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.bg-danger-light {
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.bg-secondary-light {
  background-color: rgba(108, 117, 125, 0.1) !important;
}
</style>

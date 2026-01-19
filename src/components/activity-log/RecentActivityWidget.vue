<template>
  <div class="recent-activity-widget card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h6 class="card-title mb-0">
        <i class="ti ti-activity me-2"></i>
        Recent Activity
      </h6>
      <router-link v-if="showViewAll" to="/activity-logs" class="btn btn-sm btn-link p-0">
        View All
      </router-link>
    </div>
    <div class="card-body p-0">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!recentLogs.length" class="text-center py-4 text-muted">
        <i class="ti ti-clipboard-list" style="font-size: 2rem;"></i>
        <p class="mb-0 mt-2">No recent activity</p>
      </div>

      <!-- Activity List -->
      <ul v-else class="list-group list-group-flush">
        <li 
          v-for="log in recentLogs" 
          :key="log.id" 
          class="list-group-item px-3 py-2"
        >
          <div class="d-flex align-items-start gap-2">
            <!-- Action Icon -->
            <span 
              class="badge rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              :class="getActionBadgeClass(log.action)"
              style="width: 24px; height: 24px; font-size: 0.7rem;"
            >
              <i :class="getActionIcon(log.action)"></i>
            </span>

            <!-- Content -->
            <div class="flex-grow-1 min-width-0">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-truncate">
                  <strong>{{ log.user?.name || 'System' }}</strong>
                  <span class="text-muted">{{ formatAction(log.action) }}</span>
                  <span class="text-primary">{{ getShortSubjectType(log.subject_type) }}</span>
                </span>
                <small class="text-muted flex-shrink-0 ms-2">
                  {{ formatRelativeTime(log.created_at) }}
                </small>
              </div>
              <small class="text-muted text-truncate d-block">
                {{ log.subject_name || `#${log.subject_id}` }}
              </small>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useActivityLogStore } from '@/stores/activityLogStore';
import { activityLogService } from '@/services/activityLog.service';

// Props
const props = defineProps({
  limit: {
    type: Number,
    default: 10
  },
  showViewAll: {
    type: Boolean,
    default: true
  }
});

// Store
const activityLogStore = useActivityLogStore();

// State
const recentLogs = ref([]);
const loading = ref(false);

// Methods
const fetchRecentActivity = async () => {
  loading.value = true;
  
  try {
    const response = await activityLogStore.fetchRecentActivity(props.limit);
    
    if (response.data && response.data.success) {
      recentLogs.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch recent activity:', error);
  } finally {
    loading.value = false;
  }
};

// Formatting helpers
const formatAction = (action) => {
  return activityLogService.formatAction(action);
};

const formatRelativeTime = (dateString) => {
  return activityLogService.formatRelativeTime(dateString);
};

const getShortSubjectType = (subjectType) => {
  return activityLogService.getShortSubjectType(subjectType);
};

const getActionBadgeClass = (action) => {
  const variant = activityLogService.getActionBadgeVariant(action);
  return `bg-${variant}`;
};

const getActionIcon = (action) => {
  const iconMap = {
    'created': 'ti ti-plus',
    'updated': 'ti ti-pencil',
    'deleted': 'ti ti-trash',
    'processed': 'ti ti-check',
    'imported': 'ti ti-upload'
  };
  return iconMap[action?.toLowerCase()] || 'ti ti-activity';
};

// Lifecycle
onMounted(() => {
  fetchRecentActivity();
});

// Expose refresh method
defineExpose({
  refresh: fetchRecentActivity
});
</script>

<style scoped>
.recent-activity-widget .list-group-item {
  border-left: 0;
  border-right: 0;
}

.recent-activity-widget .list-group-item:first-child {
  border-top: 0;
}

.min-width-0 {
  min-width: 0;
}

/* Badge colors */
.bg-success {
  background-color: #28a745 !important;
}

.bg-primary {
  background-color: #0d6efd !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

.bg-info {
  background-color: #6f42c1 !important;
}

.bg-warning {
  background-color: #fd7e14 !important;
  color: #fff !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}
</style>



















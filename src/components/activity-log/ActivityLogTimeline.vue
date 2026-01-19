<template>
  <div class="activity-log-timeline">
    <!-- Header with title and filter -->
    <div class="timeline-header d-flex justify-content-between align-items-center mb-3">
      <h6 class="mb-0">
        <i class="ti ti-history me-2"></i>
        {{ title || 'Activity History' }}
      </h6>
      <div class="d-flex gap-2">
        <!-- Action Filter -->
        <select 
          v-if="showFilter"
          v-model="selectedAction" 
          class="form-select form-select-sm"
          style="width: auto;"
        >
          <option value="">All Actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
          <option value="processed">Processed</option>
          <option value="imported">Imported</option>
        </select>
        <!-- Refresh button -->
        <button 
          class="btn btn-sm btn-outline-secondary" 
          @click="refreshLogs"
          :disabled="loading"
        >
          <i class="ti ti-refresh" :class="{ 'spin': loading }"></i>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !logs.length" class="text-center py-4">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted mt-2 mb-0">Loading activity...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && !filteredLogs.length" class="text-center py-4">
      <i class="ti ti-clipboard-list text-muted" style="font-size: 3rem;"></i>
      <p class="text-muted mt-2 mb-0">{{ emptyMessage }}</p>
    </div>

    <!-- Timeline -->
    <div v-else class="timeline-container">
      <div 
        v-for="(log, index) in filteredLogs" 
        :key="log.id"
        class="timeline-item"
        :class="{ 'pb-3': index < filteredLogs.length - 1 }"
      >
        <div class="d-flex gap-3">
          <!-- Action Badge Icon -->
          <div class="timeline-badge">
            <span 
              class="badge rounded-circle d-flex align-items-center justify-content-center"
              :class="getActionBadgeClass(log.action)"
              style="width: 32px; height: 32px;"
            >
              <i :class="getActionIcon(log.action)"></i>
            </span>
          </div>

          <!-- Content -->
          <div class="timeline-content flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <!-- User and Action -->
                <div class="d-flex align-items-center gap-2 mb-1">
                  <strong class="text-dark">{{ log.user?.name || 'System' }}</strong>
                  <span 
                    class="badge"
                    :class="getActionBadgeClass(log.action)"
                  >
                    {{ formatAction(log.action) }}
                  </span>
                  <span v-if="showSubjectType" class="text-muted small">
                    {{ getShortSubjectType(log.subject_type) }}
                  </span>
                </div>

                <!-- Subject Name (with link if handler provided) -->
                <div class="mb-1">
                  <span 
                    v-if="onSubjectClick" 
                    class="text-primary cursor-pointer"
                    @click="handleSubjectClick(log)"
                  >
                    {{ log.subject_name || `#${log.subject_id}` }}
                  </span>
                  <span v-else class="text-dark">
                    {{ log.subject_name || `#${log.subject_id}` }}
                  </span>
                </div>

                <!-- Description -->
                <p v-if="log.description" class="text-muted small mb-1">
                  {{ log.description }}
                </p>

                <!-- Changes (for updates) -->
                <div v-if="log.properties?.changes && showChanges" class="mt-2">
                  <small class="text-muted">
                    Changed: {{ log.properties.changes.join(', ') }}
                  </small>
                </div>
              </div>

              <!-- Timestamp -->
              <div class="text-muted small text-end">
                <span :title="formatFullDate(log.created_at)">
                  {{ formatRelativeTime(log.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Line -->
        <div 
          v-if="index < filteredLogs.length - 1" 
          class="timeline-line"
        ></div>
      </div>

      <!-- Load More -->
      <div v-if="hasMorePages && !loading" class="text-center mt-3">
        <button class="btn btn-sm btn-outline-primary" @click="loadMore">
          <i class="ti ti-chevron-down me-1"></i>
          Load More
        </button>
      </div>

      <!-- Loading More Indicator -->
      <div v-if="loading && logs.length" class="text-center mt-3">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading more...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useActivityLogStore } from '@/stores/activityLogStore';
import { activityLogService } from '@/services/activityLog.service';

// Props
const props = defineProps({
  // Filter to a specific subject
  subjectType: {
    type: String,
    default: null
  },
  subjectId: {
    type: [Number, String],
    default: null
  },
  // UI Options
  title: {
    type: String,
    default: 'Activity History'
  },
  emptyMessage: {
    type: String,
    default: 'No activity recorded yet'
  },
  showFilter: {
    type: Boolean,
    default: true
  },
  showSubjectType: {
    type: Boolean,
    default: false
  },
  showChanges: {
    type: Boolean,
    default: true
  },
  perPage: {
    type: Number,
    default: 20
  },
  // Event handler for clicking on subject
  onSubjectClick: {
    type: Function,
    default: null
  }
});

// Emits
const emit = defineEmits(['load', 'error']);

// Store
const activityLogStore = useActivityLogStore();

// State
const logs = ref([]);
const loading = ref(false);
const selectedAction = ref('');
const currentPage = ref(1);
const hasMorePages = ref(false);

// Computed
const filteredLogs = computed(() => {
  if (!selectedAction.value) return logs.value;
  return logs.value.filter(log => log.action === selectedAction.value);
});

// Methods
const fetchLogs = async (page = 1, append = false) => {
  loading.value = true;
  
  try {
    let response;
    
    if (props.subjectType && props.subjectId) {
      // Fetch logs for specific subject
      response = await activityLogStore.fetchSubjectLogs(
        props.subjectType, 
        props.subjectId,
        { page, per_page: props.perPage },
        page === 1 // Force refresh on first page
      );
    } else {
      // Fetch general logs
      response = await activityLogStore.fetchLogs({
        page,
        per_page: props.perPage,
        action: selectedAction.value || undefined
      });
    }

    if (response.data && response.data.success) {
      if (append) {
        logs.value = [...logs.value, ...response.data.data];
      } else {
        logs.value = response.data.data;
      }
      hasMorePages.value = response.data.pagination?.has_more_pages || false;
      currentPage.value = page;
      emit('load', logs.value);
    }
  } catch (error) {
    console.error('Failed to fetch activity logs:', error);
    emit('error', error);
  } finally {
    loading.value = false;
  }
};

const refreshLogs = () => {
  currentPage.value = 1;
  fetchLogs(1, false);
};

const loadMore = () => {
  fetchLogs(currentPage.value + 1, true);
};

const handleSubjectClick = (log) => {
  if (props.onSubjectClick) {
    props.onSubjectClick(log);
  }
};

// Formatting helpers
const formatAction = (action) => {
  return activityLogService.formatAction(action);
};

const formatRelativeTime = (dateString) => {
  return activityLogService.formatRelativeTime(dateString);
};

const formatFullDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString();
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

// Watchers
watch(() => props.subjectId, () => {
  if (props.subjectType && props.subjectId) {
    fetchLogs(1, false);
  }
});

watch(selectedAction, () => {
  if (!props.subjectType) {
    fetchLogs(1, false);
  }
});

// Lifecycle
onMounted(() => {
  fetchLogs();
});

// Expose methods for parent components
defineExpose({
  refresh: refreshLogs
});
</script>

<style scoped>
.activity-log-timeline {
  position: relative;
}

.timeline-container {
  position: relative;
}

.timeline-item {
  position: relative;
}

.timeline-badge {
  flex-shrink: 0;
  z-index: 1;
}

.timeline-content {
  min-width: 0;
}

.timeline-line {
  position: absolute;
  left: 15px;
  top: 40px;
  bottom: 0;
  width: 2px;
  background-color: #e9ecef;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  text-decoration: underline;
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

/* Spin animation for refresh */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>



















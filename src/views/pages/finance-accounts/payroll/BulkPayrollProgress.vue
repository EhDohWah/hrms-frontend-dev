<template>
  <div class="bulk-payroll-progress">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <h4 class="mb-1 fw-bold">
            <i class="ti ti-progress me-2"></i>Bulk Payroll Progress
          </h4>
          <p class="text-muted mb-0">Real-time progress tracking for batch #{{ batchId }}</p>
        </div>
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="goBack"
          :disabled="!isCompleted && !isFailed"
        >
          <i class="ti ti-arrow-left me-1"></i> Back to Payroll
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status"></div>
      <p class="text-muted">Loading batch information...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="batchData">
      <!-- Status Card -->
      <div class="card shadow-sm mb-4" :class="statusCardClass">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h5 class="mb-1 fw-bold">
                <i :class="statusIcon" class="me-2"></i>{{ statusText }}
              </h5>
              <p class="mb-0 text-muted">
                Pay Period: <strong>{{ formatPayPeriod(batchData.pay_period) }}</strong>
              </p>
            </div>
            <div class="col-md-4 text-md-end">
              <div class="progress-percentage">
                {{ batchData.progress_percentage }}%
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-3">
            <div class="progress" style="height: 30px;">
              <div
                class="progress-bar progress-bar-striped"
                :class="progressBarClass"
                :style="{ width: batchData.progress_percentage + '%' }"
                role="progressbar"
                :aria-valuenow="batchData.progress_percentage"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <strong>{{ batchData.processed }} / {{ batchData.total }}</strong>
              </div>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <small class="text-muted">Processed: {{ batchData.processed }}</small>
              <small class="text-muted">Total: {{ batchData.total }}</small>
            </div>
          </div>

          <!-- Currently Processing -->
          <div v-if="isProcessing && batchData.current_employee" class="currently-processing mt-3">
            <div class="alert alert-primary mb-0 d-flex align-items-center">
              <div class="spinner-border spinner-border-sm me-3" role="status"></div>
              <div>
                <strong>Currently Processing:</strong><br />
                <span class="text-muted">{{ batchData.current_employee }}</span>
                <span v-if="batchData.current_allocation" class="text-muted"> - {{ batchData.current_allocation }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-sm-6">
          <div class="stat-card bg-success">
            <div class="stat-icon">
              <i class="ti ti-check"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ batchData.stats?.successful || 0 }}</div>
              <div class="stat-label">Successful</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card bg-danger">
            <div class="stat-icon">
              <i class="ti ti-x"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ batchData.stats?.failed || 0 }}</div>
              <div class="stat-label">Failed</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card bg-info">
            <div class="stat-icon">
              <i class="ti ti-arrows-exchange"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ batchData.stats?.advances_created || 0 }}</div>
              <div class="stat-label">Advances Created</div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card bg-primary">
            <div class="stat-icon">
              <i class="ti ti-file-invoice"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ batchData.total || 0 }}</div>
              <div class="stat-label">Total Payrolls</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div class="connection-status mb-3">
        <small class="text-muted">
          <i :class="connectionIcon" class="me-1"></i>{{ connectionStatus }}
        </small>
      </div>

      <!-- Errors Section -->
      <div v-if="batchData.has_errors" class="card shadow-sm mb-4">
        <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            <i class="ti ti-alert-triangle me-2"></i>Errors ({{ batchData.error_count }})
          </h5>
          <button
            type="button"
            class="btn btn-sm btn-light"
            @click="downloadErrors"
            :disabled="downloadingErrors"
          >
            <span v-if="!downloadingErrors">
              <i class="ti ti-download me-1"></i>Download CSV
            </span>
            <span v-else>
              <span class="spinner-border spinner-border-sm me-1"></span>Downloading...
            </span>
          </button>
        </div>
        <div class="card-body">
          <p class="text-muted mb-3">
            <i class="ti ti-info-circle me-1"></i>The following payroll records failed to process. Download the CSV report for detailed analysis.
          </p>
          <div class="alert alert-warning">
            <strong>Note:</strong> Failed payroll records were skipped to allow the batch to complete. You can retry these individually.
          </div>
        </div>
      </div>

      <!-- Completion Message -->
      <div v-if="isCompleted" class="card shadow-sm border-success">
        <div class="card-body">
          <div class="text-center py-4">
            <i class="ti ti-circle-check text-success" style="font-size: 4rem;"></i>
            <h4 class="mt-3 mb-2 text-success fw-bold">Bulk Payroll Creation Completed!</h4>
            <p class="text-muted mb-3">
              Successfully processed {{ batchData.stats?.successful || 0 }} out of {{ batchData.total }} payroll records
            </p>
            <div class="d-flex justify-content-center gap-2">
              <button type="button" class="btn btn-primary" @click="goToPayrollList">
                <i class="ti ti-list me-1"></i>View Payroll List
              </button>
              <button type="button" class="btn btn-outline-secondary" @click="createAnother">
                <i class="ti ti-plus me-1"></i>Create Another Batch
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Failed Message -->
      <div v-if="isFailed" class="card shadow-sm border-danger">
        <div class="card-body">
          <div class="text-center py-4">
            <i class="ti ti-circle-x text-danger" style="font-size: 4rem;"></i>
            <h4 class="mt-3 mb-2 text-danger fw-bold">Bulk Payroll Creation Failed</h4>
            <p class="text-muted mb-3">
              The batch processing encountered a critical error. Please check the logs or contact support.
            </p>
            <div class="d-flex justify-content-center gap-2">
              <button type="button" class="btn btn-outline-secondary" @click="goBack">
                <i class="ti ti-arrow-left me-1"></i>Go Back
              </button>
              <button type="button" class="btn btn-outline-primary" @click="retryBatch">
                <i class="ti ti-refresh me-1"></i>Create New Batch
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Timestamps -->
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="row text-center">
            <div class="col-md-6">
              <small class="text-muted d-block">Started At</small>
              <strong>{{ formatTimestamp(batchData.created_at) }}</strong>
            </div>
            <div class="col-md-6">
              <small class="text-muted d-block">Last Updated</small>
              <strong>{{ formatTimestamp(batchData.updated_at) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-5">
      <i class="ti ti-alert-circle text-danger" style="font-size: 3rem;"></i>
      <p class="text-danger mt-3">Failed to load batch information</p>
      <button type="button" class="btn btn-outline-secondary" @click="goBack">
        <i class="ti ti-arrow-left me-1"></i>Go Back
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import moment from 'moment';
import { payrollService } from '@/services/payroll.service';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default {
  name: 'BulkPayrollProgress',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const batchId = ref(route.params.batchId);

    const loading = ref(true);
    const downloadingErrors = ref(false);
    const batchData = ref(null);

    // WebSocket and HTTP polling
    const wsConnected = ref(false);
    const wsConnectionAttempted = ref(false);
    const httpPollingInterval = ref(null);
    const echo = ref(null);

    // CRITICAL: Timeout tracking to prevent memory leaks
    const wsTimeout = ref(null);
    const disconnectTimeout = ref(null);

    // Computed properties
    const isProcessing = computed(() => batchData.value?.status === 'processing');
    const isCompleted = computed(() => batchData.value?.status === 'completed');
    const isFailed = computed(() => batchData.value?.status === 'failed');
    const isPending = computed(() => batchData.value?.status === 'pending');

    const statusText = computed(() => {
      if (!batchData.value) return 'Loading...';
      switch (batchData.value.status) {
        case 'pending':
          return 'Batch Pending';
        case 'processing':
          return 'Processing Payroll Records';
        case 'completed':
          return 'Batch Completed';
        case 'failed':
          return 'Batch Failed';
        default:
          return 'Unknown Status';
      }
    });

    const statusIcon = computed(() => {
      if (!batchData.value) return 'ti ti-loader';
      switch (batchData.value.status) {
        case 'pending':
          return 'ti ti-clock';
        case 'processing':
          return 'ti ti-loader ti-spin';
        case 'completed':
          return 'ti ti-circle-check';
        case 'failed':
          return 'ti ti-circle-x';
        default:
          return 'ti ti-question-mark';
      }
    });

    const statusCardClass = computed(() => {
      if (!batchData.value) return '';
      switch (batchData.value.status) {
        case 'pending':
          return 'border-warning';
        case 'processing':
          return 'border-primary';
        case 'completed':
          return 'border-success';
        case 'failed':
          return 'border-danger';
        default:
          return '';
      }
    });

    const progressBarClass = computed(() => {
      if (!batchData.value) return 'bg-primary';

      const percentage = batchData.value.progress_percentage || 0;

      if (batchData.value.status === 'completed') {
        return 'bg-success progress-bar-animated';
      }
      if (batchData.value.status === 'failed') {
        return 'bg-danger';
      }

      // Progressive color gradient based on percentage
      if (percentage < 25) {
        return 'bg-primary progress-bar-animated';
      } else if (percentage < 50) {
        return 'bg-info progress-bar-animated';
      } else if (percentage < 75) {
        return 'bg-warning progress-bar-animated';
      } else {
        return 'bg-success progress-bar-animated';
      }
    });

    const connectionStatus = computed(() => {
      if (wsConnected.value) {
        return 'Connected via WebSocket (Real-time)';
      } else if (httpPollingInterval.value) {
        return 'Connected via HTTP Polling (Fallback)';
      } else {
        return 'Connecting...';
      }
    });

    const connectionIcon = computed(() => {
      if (wsConnected.value) {
        return 'ti ti-bolt text-success';
      } else if (httpPollingInterval.value) {
        return 'ti ti-refresh text-warning';
      } else {
        return 'ti ti-loader ti-spin text-muted';
      }
    });

    // Methods
    const formatPayPeriod = (payPeriod) => {
      if (!payPeriod) return '';
      return moment(payPeriod, 'YYYY-MM').format('MMMM YYYY');
    };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return 'N/A';
      return moment(timestamp).format('DD MMM YYYY, HH:mm:ss');
    };

    const fetchBatchStatus = async () => {
      try {
        const response = await payrollService.getBatchStatus(batchId.value);

        if (response.success) {
          batchData.value = response.data;

          // Auto-stop polling when batch completes
          if (isCompleted.value || isFailed.value) {
            stopHttpPolling();
            disconnectWebSocket();
          }
        } else {
          throw new Error(response.message || 'Failed to fetch batch status');
        }
      } catch (error) {
        console.error('Fetch batch status error:', error);
        message.error('Failed to fetch batch status');
      } finally {
        loading.value = false;
      }
    };

    const startHttpPolling = () => {
      if (httpPollingInterval.value) return;

      console.log('[HTTP Polling] Starting...');
      httpPollingInterval.value = setInterval(() => {
        if (!wsConnected.value) {
          console.log('[HTTP Polling] Fetching status...');
          fetchBatchStatus();
        }
      }, 3000); // Poll every 3 seconds
    };

    const stopHttpPolling = () => {
      if (httpPollingInterval.value) {
        console.log('[HTTP Polling] Stopping...');
        clearInterval(httpPollingInterval.value);
        httpPollingInterval.value = null;
      }
    };

    const connectWebSocket = () => {
      if (wsConnectionAttempted.value) return;
      wsConnectionAttempted.value = true;

      try {
        console.log('[WebSocket] Attempting connection...');

        // Initialize Laravel Echo with Reverb (or Pusher)
        echo.value = new Echo({
          broadcaster: 'reverb',
          key: process.env.VUE_APP_REVERB_APP_KEY || 'local',
          wsHost: process.env.VUE_APP_REVERB_HOST || window.location.hostname,
          wsPort: process.env.VUE_APP_REVERB_PORT || 8080,
          wssPort: process.env.VUE_APP_REVERB_PORT || 8080,
          forceTLS: (process.env.VUE_APP_REVERB_SCHEME || 'https') === 'https',
          enabledTransports: ['ws', 'wss'],
          disableStats: true,
        });

        // CRITICAL FIX: Track WebSocket connection timeout for cleanup
        wsTimeout.value = setTimeout(() => {
          if (!wsConnected.value) {
            console.log('[WebSocket] Connection timeout - falling back to HTTP polling');
            disconnectWebSocket();
            startHttpPolling();
          }
          wsTimeout.value = null; // Clear after execution
        }, 3000); // 3-second timeout

        // Listen to the channel
        echo.value
          .channel(`payroll-bulk.${batchId.value}`)
          .listen('.payroll.progress', (event) => {
            console.log('[WebSocket] Progress update received:', event);

            // Update batch data
            batchData.value = {
              ...batchData.value,
              processed: event.processed,
              total: event.total,
              status: event.status,
              progress_percentage: Math.round((event.processed / event.total) * 100),
              current_employee: event.currentEmployee,
              current_allocation: event.currentAllocation,
              stats: event.stats,
              updated_at: new Date().toISOString(),
            };

            // Mark as connected
            if (!wsConnected.value) {
              wsConnected.value = true;
              // CRITICAL FIX: Clear wsTimeout using ref
              if (wsTimeout.value) {
                clearTimeout(wsTimeout.value);
                wsTimeout.value = null;
              }
              stopHttpPolling(); // Auto-stop HTTP polling when WebSocket connects
              console.log('[WebSocket] Connected successfully - HTTP polling stopped');
            }

            // Auto-stop when completed
            if (event.status === 'completed' || event.status === 'failed') {
              console.log('[WebSocket] Batch finished, disconnecting...');
              // CRITICAL FIX: Track disconnectTimeout for cleanup
              disconnectTimeout.value = setTimeout(() => {
                disconnectWebSocket();
                disconnectTimeout.value = null; // Clear after execution
              }, 2000);
            }
          });

        console.log('[WebSocket] Listening on channel: payroll-bulk.' + batchId.value);
      } catch (error) {
        console.error('[WebSocket] Connection error:', error);
        startHttpPolling(); // Fallback to HTTP polling
      }
    };

    const disconnectWebSocket = () => {
      if (echo.value) {
        console.log('[WebSocket] Disconnecting...');
        echo.value.leaveChannel(`payroll-bulk.${batchId.value}`);
        echo.value.disconnect();
        echo.value = null;
        wsConnected.value = false;
      }
    };

    const downloadErrors = async () => {
      if (!batchData.value?.has_errors) {
        message.warning('No errors to download');
        return;
      }

      downloadingErrors.value = true;

      try {
        const response = await payrollService.downloadBatchErrors(batchId.value);

        // Create blob and download
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bulk_payroll_errors_${batchId.value}_${batchData.value.pay_period}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        message.success('Error report downloaded successfully');
      } catch (error) {
        console.error('Download errors error:', error);
        message.error('Failed to download error report');
      } finally {
        downloadingErrors.value = false;
      }
    };

    const goBack = () => {
      router.push({ name: 'payroll-list' });
    };

    const goToPayrollList = () => {
      router.push({ name: 'payroll-list' });
    };

    const createAnother = () => {
      router.push({ name: 'bulk-payroll-create' });
    };

    const retryBatch = () => {
      router.push({ name: 'bulk-payroll-create' });
    };

    // Lifecycle hooks
    onMounted(async () => {
      await fetchBatchStatus();

      // Start dual-source pattern: try WebSocket first, HTTP polling as fallback
      connectWebSocket();
      startHttpPolling(); // Start immediately, will auto-stop when WebSocket connects
    });

    onUnmounted(() => {
      stopHttpPolling();
      disconnectWebSocket();

      // CRITICAL FIX: Clear all tracked timeouts to prevent memory leaks
      if (wsTimeout.value) {
        clearTimeout(wsTimeout.value);
        wsTimeout.value = null;
      }
      if (disconnectTimeout.value) {
        clearTimeout(disconnectTimeout.value);
        disconnectTimeout.value = null;
      }
    });

    return {
      batchId,
      loading,
      downloadingErrors,
      batchData,
      wsConnected,
      isProcessing,
      isCompleted,
      isFailed,
      isPending,
      statusText,
      statusIcon,
      statusCardClass,
      progressBarClass,
      connectionStatus,
      connectionIcon,
      formatPayPeriod,
      formatTimestamp,
      downloadErrors,
      goBack,
      goToPayrollList,
      createAnother,
      retryBatch,
    };
  },
};
</script>

<style scoped>
.bulk-payroll-progress {
  padding: 1.5rem;
}

.page-header {
  padding-bottom: 1rem;
  border-bottom: 2px solid #dee2e6;
}

.progress-percentage {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0d6efd;
}

.currently-processing {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.stat-card {
  padding: 1.5rem;
  border-radius: 0.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.connection-status {
  text-align: right;
}

.ti-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .bulk-payroll-progress {
    padding: 1rem;
  }

  .progress-percentage {
    font-size: 2rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-icon {
    font-size: 2rem;
  }
}
</style>

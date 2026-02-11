<template>
  <div class="modal fade" id="probationHistoryModal" tabindex="-1"
       aria-labelledby="probationHistoryModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content new-modal-design">

        <!-- Custom Header -->
        <div class="modal-header-new">
          <h2 class="modal-title-new" id="probationHistoryModalLabel">
            <i class="ti ti-history me-2"></i>
            Probation History
          </h2>
          <button type="button" class="btn-close-custom"
                  @click="handleModalClose" aria-label="Close">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <!-- Custom Body -->
        <div class="modal-body-new">
          <!-- Loading State -->
          <div v-if="isLoadingData" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading probation history...</span>
            </div>
            <p class="mt-3 text-muted">Loading probation history...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
            <i class="ti ti-alert-circle me-2"></i>
            {{ errorMessage }}
          </div>

          <!-- Content -->
          <div v-else-if="historyData">
            <!-- Summary Cards -->
            <div class="row g-3 mb-4">
              <div class="col-md-3">
                <div class="stat-card stat-card-blue">
                  <div class="stat-icon">
                    <i class="ti ti-calendar-event"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ formatDate(historyData.probation_start_date) }}</div>
                    <div class="stat-label">Start Date</div>
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="stat-card stat-card-green">
                  <div class="stat-icon">
                    <i class="ti ti-calendar-check"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ formatDate(historyData.current_end_date) }}</div>
                    <div class="stat-label">Current End Date</div>
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="stat-card stat-card-yellow">
                  <div class="stat-icon">
                    <i class="ti ti-repeat"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ historyData.total_extensions }}</div>
                    <div class="stat-label">Total Extensions</div>
                  </div>
                </div>
              </div>

              <div class="col-md-3">
                <div class="stat-card" :class="statusCardClass">
                  <div class="stat-icon">
                    <i class="ti" :class="statusIcon"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ statusLabel }}</div>
                    <div class="stat-label">Current Status</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="timeline-container">
              <h5 class="timeline-title">
                <i class="ti ti-timeline me-2"></i>
                Probation Timeline
              </h5>

              <div class="timeline">
                <div v-for="(record, index) in historyData.records"
                     :key="record.id"
                     class="timeline-item"
                     :class="{ 'timeline-item-active': record.is_active }">

                  <!-- Timeline Marker -->
                  <div class="timeline-marker" :class="getEventTypeClass(record.event_type)">
                    <i class="ti" :class="getEventIcon(record.event_type)"></i>
                  </div>

                  <!-- Timeline Content -->
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <h6 class="timeline-event-title">
                        {{ getEventTypeLabel(record.event_type) }}
                        <span v-if="record.extension_number > 0" class="badge bg-warning ms-2">
                          Extension #{{ record.extension_number }}
                        </span>
                        <span v-if="record.is_active" class="badge bg-success ms-2">
                          <i class="ti ti-check"></i> Active
                        </span>
                      </h6>
                      <div class="timeline-date">
                        <i class="ti ti-calendar me-1"></i>
                        {{ formatDate(record.event_date) }}
                      </div>
                    </div>

                    <div class="timeline-body">
                      <div class="row g-2">
                        <div class="col-md-6">
                          <div class="timeline-detail">
                            <i class="ti ti-calendar-time me-1 text-primary"></i>
                            <strong>Probation Period:</strong>
                            <span class="ms-1">
                              {{ formatDate(record.probation_start_date) }} → {{ formatDate(record.probation_end_date) }}
                            </span>
                          </div>
                        </div>

                        <div class="col-md-6" v-if="record.previous_end_date">
                          <div class="timeline-detail">
                            <i class="ti ti-arrow-forward me-1 text-warning"></i>
                            <strong>Extended From:</strong>
                            <span class="ms-1">{{ formatDate(record.previous_end_date) }}</span>
                          </div>
                        </div>

                        <div class="col-md-6" v-if="record.decision_date">
                          <div class="timeline-detail">
                            <i class="ti ti-calendar-check me-1 text-success"></i>
                            <strong>Decision Date:</strong>
                            <span class="ms-1">{{ formatDate(record.decision_date) }}</span>
                          </div>
                        </div>

                        <div class="col-md-6" v-if="record.approved_by">
                          <div class="timeline-detail">
                            <i class="ti ti-user-check me-1 text-info"></i>
                            <strong>Approved By:</strong>
                            <span class="ms-1">{{ record.approved_by }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Decision Reason -->
                      <div v-if="record.decision_reason" class="timeline-reason mt-2">
                        <strong><i class="ti ti-message-circle me-1"></i> Reason:</strong>
                        <p class="mb-0">{{ record.decision_reason }}</p>
                      </div>

                      <!-- Evaluation Notes -->
                      <div v-if="record.evaluation_notes" class="timeline-notes mt-2">
                        <strong><i class="ti ti-notes me-1"></i> Evaluation Notes:</strong>
                        <p class="mb-0">{{ record.evaluation_notes }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-5">
            <i class="ti ti-file-off" style="font-size: 3rem; color: #ccc;"></i>
            <p class="mt-3 text-muted">No probation history available</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="handleModalClose">
            <i class="ti ti-x me-1"></i> Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { Modal } from 'bootstrap';
import { employmentService } from '@/services/employment.service';
import { useToast } from '@/composables/useToast';

export default {
  name: 'ProbationHistoryModal',

  setup() {
    const { showError } = useToast();
    return { showError };
  },

  data() {
    return {
      modalInstance: null,
      isModalVisible: false,
      isLoadingData: false,
      employmentId: null,
      historyData: null,
      errorMessage: ''
    };
  },

  computed: {
    statusLabel() {
      if (!this.historyData) return 'N/A';

      const status = this.historyData.current_status;
      const labels = {
        'ongoing': 'Ongoing',
        'extended': 'Extended',
        'passed': 'Passed',
        'failed': 'Failed'
      };

      return labels[status] || status;
    },

    statusCardClass() {
      if (!this.historyData) return 'stat-card-gray';

      const status = this.historyData.current_status;
      const classes = {
        'ongoing': 'stat-card-blue',
        'extended': 'stat-card-yellow',
        'passed': 'stat-card-green',
        'failed': 'stat-card-red'
      };

      return classes[status] || 'stat-card-gray';
    },

    statusIcon() {
      if (!this.historyData) return 'ti-help';

      const status = this.historyData.current_status;
      const icons = {
        'ongoing': 'ti-clock',
        'extended': 'ti-arrow-forward',
        'passed': 'ti-check',
        'failed': 'ti-x'
      };

      return icons[status] || 'ti-help';
    }
  },

  mounted() {
    const modalElement = document.getElementById('probationHistoryModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);

      // Setup event listeners
      modalElement.addEventListener('hidden.bs.modal', this.onModalHidden);
    }
  },

  beforeUnmount() {
    const modalElement = document.getElementById('probationHistoryModal');
    if (modalElement) {
      modalElement.removeEventListener('hidden.bs.modal', this.onModalHidden);
    }

    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  },

  methods: {
    async openModal(employmentId) {
      this.employmentId = employmentId;
      this.isModalVisible = true;
      this.errorMessage = '';
      this.historyData = null;

      this.modalInstance.show();

      // Load probation history
      await this.loadProbationHistory();
    },

    async loadProbationHistory() {
      if (!this.employmentId) return;

      this.isLoadingData = true;

      try {
        const response = await employmentService.getProbationHistory(this.employmentId);

        if (response && response.success && response.data) {
          this.historyData = response.data;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error loading probation history:', error);
        this.errorMessage = error.message || 'Failed to load probation history';
        this.showError(this.errorMessage);
      } finally {
        this.isLoadingData = false;
      }
    },

    handleModalClose() {
      this.modalInstance.hide();
    },

    onModalHidden() {
      this.isModalVisible = false;
      this.historyData = null;
      this.errorMessage = '';
      this.employmentId = null;
    },

    formatDate(date) {
      if (!date) return '';
      return moment(date).format('DD/MM/YYYY');
    },

    getEventTypeLabel(eventType) {
      const labels = {
        'initial': 'Initial Probation Period',
        'extension': 'Probation Extension',
        'passed': 'Probation Passed',
        'failed': 'Probation Failed'
      };

      return labels[eventType] || eventType;
    },

    getEventTypeClass(eventType) {
      const classes = {
        'initial': 'timeline-marker-blue',
        'extension': 'timeline-marker-yellow',
        'passed': 'timeline-marker-green',
        'failed': 'timeline-marker-red'
      };

      return classes[eventType] || 'timeline-marker-gray';
    },

    getEventIcon(eventType) {
      const icons = {
        'initial': 'ti-flag',
        'extension': 'ti-arrow-forward',
        'passed': 'ti-check-circle',
        'failed': 'ti-x-circle'
      };

      return icons[eventType] || 'ti-circle';
    }
  }
};
</script>

<style scoped>
/* Modal Design */
.new-modal-design {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.modal-header-new {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 20px 24px;
  border: none;
}

.modal-title-new {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.btn-close-custom {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close-custom:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body-new {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

/* Stat Cards */
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-card-blue .stat-icon {
  background: #e3f2fd;
  color: #1976d2;
}

.stat-card-green .stat-icon {
  background: #e8f5e9;
  color: #388e3c;
}

.stat-card-yellow .stat-icon {
  background: #fff3e0;
  color: #f57c00;
}

.stat-card-red .stat-icon {
  background: #ffebee;
  color: #d32f2f;
}

.stat-card-gray .stat-icon {
  background: #f5f5f5;
  color: #757575;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #7f8c8d;
  font-weight: 500;
}

/* Timeline */
.timeline-container {
  margin-top: 24px;
}

.timeline-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  padding-bottom: 20px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-item-active .timeline-content {
  border-left: 3px solid #4caf50;
}

.timeline-marker {
  position: absolute;
  left: -40px;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  z-index: 1;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-marker-blue {
  background: #2196f3;
}

.timeline-marker-yellow {
  background: #ff9800;
}

.timeline-marker-green {
  background: #4caf50;
}

.timeline-marker-red {
  background: #f44336;
}

.timeline-marker-gray {
  background: #9e9e9e;
}

.timeline-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.timeline-event-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.timeline-date {
  font-size: 0.9rem;
  color: #7f8c8d;
  display: flex;
  align-items: center;
}

.timeline-body {
  color: #495057;
}

.timeline-detail {
  font-size: 0.9rem;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.timeline-reason,
.timeline-notes {
  background: #f8f9fa;
  border-left: 3px solid #6c757d;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.timeline-reason p,
.timeline-notes p {
  margin-top: 6px;
  line-height: 1.6;
}

/* Badges */
.badge {
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
}

/* Modal Footer */
.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 16px 24px;
}
</style>

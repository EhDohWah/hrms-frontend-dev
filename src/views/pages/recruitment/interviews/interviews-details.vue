<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-4">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="mb-2">
            <button class="btn btn-outline-secondary d-flex align-items-center"
              @click="$router.push('/recruitment/interviews-list')">
              <i class="ti ti-arrow-left me-2"></i>Back to List
            </button>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Interview Header Card -->
      <div class="card shadow-sm mb-4">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h3 class="mb-1 text-dark fw-semibold">{{ interview.job_position || 'Position Not Specified' }}</h3>
              <p class="text-muted mb-0">
                <i class="ti ti-calendar me-1"></i>
                {{ formatDate(interview.interview_date) }}
                <span class="mx-2">•</span>
                <i class="ti ti-clock me-1"></i>
                {{ formatTime(interview.start_time) }} - {{ formatTime(interview.end_time) }}
              </p>
            </div>
            <div class="text-end">
              <span :class="['badge', 'px-3', 'py-2', 'fs-6', getStatusBadgeClass(interview.interview_status)]">
                {{ interview.interview_status || 'Pending' }}
              </span>
              <div v-if="interview.score" class="mt-2">
                <small class="text-muted">Score</small>
                <h5 class="mb-0 text-dark">{{ interview.score }}/100</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="row g-4">
        <!-- Left Column - Interview & Candidate Details -->
        <div class="col-lg-8">
          <!-- Interview Details Card -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-light border-bottom">
              <h5 class="mb-0 text-dark">
                <i class="ti ti-clipboard-list me-2"></i>Interview Details
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="detail-item">
                    <label class="text-muted small mb-1">Interview Mode</label>
                    <p class="mb-0 fw-medium text-dark">
                      <i :class="getModeIcon(interview.interview_mode)" class="me-2"></i>
                      {{ interview.interview_mode || 'Not Specified' }}
                    </p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="detail-item">
                    <label class="text-muted small mb-1">Interviewer</label>
                    <p class="mb-0 fw-medium text-dark">
                      <i class="ti ti-user-check me-2"></i>
                      {{ interview.interviewer_name || 'Not Assigned' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Candidate Information Card -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-light border-bottom">
              <h5 class="mb-0 text-dark">
                <i class="ti ti-user me-2"></i>Candidate Information
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="detail-item">
                    <label class="text-muted small mb-1">Full Name</label>
                    <p class="mb-0 fw-medium text-dark">{{ interview.candidate_name || 'Not Available' }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="detail-item">
                    <label class="text-muted small mb-1">Contact Number</label>
                    <p class="mb-0 fw-medium text-dark">
                      <i class="ti ti-phone me-1"></i>
                      {{ interview.phone || 'Not Provided' }}
                    </p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="detail-item">
                    <label class="text-muted small mb-1">Email Address</label>
                    <p class="mb-0 fw-medium text-dark">
                      <i class="ti ti-mail me-1"></i>
                      {{ interview.candidate_email || 'Not Provided' }}
                    </p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="detail-item">
                    <label class="text-muted small mb-1">Hiring Status</label>
                    <span :class="['badge', 'px-3', 'py-2', getHiredStatusBadgeClass(interview.hired_status)]">
                      {{ interview.hired_status || 'Under Review' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feedback Section -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-light border-bottom">
              <h5 class="mb-0 text-dark">
                <i class="ti ti-message-circle me-2"></i>Interview Feedback
              </h5>
            </div>
            <div class="card-body p-4">
              <div v-if="interview.feedback" class="feedback-content">
                <p class="mb-0 text-dark lh-lg">{{ interview.feedback }}</p>
              </div>
              <div v-else class="text-center py-4">
                <i class="ti ti-message-off fs-1 text-muted mb-2"></i>
                <p class="text-muted mb-0">No feedback has been provided yet</p>
              </div>
            </div>
          </div>

          <!-- Reference Information -->
          <div class="card shadow-sm">
            <div class="card-header bg-light border-bottom">
              <h5 class="mb-0 text-dark">
                <i class="ti ti-users me-2"></i>Reference Information
              </h5>
            </div>
            <div class="card-body p-4">
              <div v-if="interview.reference_info" class="reference-content">
                <p class="mb-0 text-dark lh-lg">{{ interview.reference_info }}</p>
              </div>
              <div v-else class="text-center py-4">
                <i class="ti ti-user-x fs-1 text-muted mb-2"></i>
                <p class="text-muted mb-0">No reference information available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Stats & Actions -->
        <div class="col-lg-4">
          <!-- Quick Stats Card -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-light border-bottom">
              <h5 class="mb-0 text-dark">
                <i class="ti ti-chart-bar me-2"></i>Quick Overview
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="stat-item mb-3 pb-3 border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted">Interview Status</span>
                  <span class="fw-medium text-dark">{{ interview.interview_status || 'Pending' }}</span>
                </div>
              </div>
              <div class="stat-item mb-3 pb-3 border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted">Interview Score</span>
                  <span class="fw-medium text-dark">{{ interview.score || 'Not Scored' }}</span>
                </div>
              </div>
              <div class="stat-item mb-3 pb-3 border-bottom">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted">Hiring Decision</span>
                  <span class="fw-medium text-dark">{{ interview.hired_status || 'Pending' }}</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted">Interview Mode</span>
                  <span class="fw-medium text-dark">{{ interview.interview_mode || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline Card -->
          <div class="card shadow-sm">
            <div class="card-header bg-light border-bottom">
              <h5 class="mb-0 text-dark">
                <i class="ti ti-timeline me-2"></i>Interview Timeline
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="timeline-item">
                <div class="d-flex align-items-start">
                  <div class="timeline-icon bg-light rounded-circle p-2 me-3">
                    <i class="ti ti-calendar-event text-muted"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 text-dark">Scheduled Date</h6>
                    <p class="text-muted small mb-0">{{ formatDate(interview.interview_date) }}</p>
                  </div>
                </div>
              </div>
              <div class="timeline-item mt-3">
                <div class="d-flex align-items-start">
                  <div class="timeline-icon bg-light rounded-circle p-2 me-3">
                    <i class="ti ti-clock text-muted"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 text-dark">Time Slot</h6>
                    <p class="text-muted small mb-0">
                      {{ formatTime(interview.start_time) }} - {{ formatTime(interview.end_time) }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="timeline-item mt-3">
                <div class="d-flex align-items-start">
                  <div class="timeline-icon bg-light rounded-circle p-2 me-3">
                    <i class="ti ti-user text-muted"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 text-dark">Interviewer</h6>
                    <p class="text-muted small mb-0">{{ interview.interviewer_name || 'Not Assigned' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <layout-footer></layout-footer>
  </div>
</template>

<script>
import { useInterviewStore } from '@/stores/interviewStore';

export default {
  name: 'InterviewsDetails',

  data() {
    return {
      title: 'Interview Details',
      text: 'Recruitment',
      text1: 'Interview Details',
      interview: {
        id: '',
        job_position: '',
        interview_date: '',
        start_time: '',
        end_time: '',
        interviewer_name: '',
        interview_mode: '',
        interview_status: '',
        score: '',
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        feedback: '',
        reference_info: ''
      },
      loading: false,
      error: null
    };
  },
  methods: {
    getStatusClass(status) {
      const statusClasses = {
        'Scheduled': 'bg-warning text-dark',
        'Completed': 'bg-success text-dark',
        'Cancelled': 'bg-danger text-dark',
        'In Progress': 'bg-info text-dark'
      };
      return statusClasses[status] || 'bg-secondary text-dark';
    },
    getStatusBadgeClass(status) {
      const statusClasses = {
        'Scheduled': 'bg-light text-dark border',
        'Completed': 'bg-light text-success border border-success',
        'Cancelled': 'bg-light text-danger border border-danger',
        'In Progress': 'bg-light text-info border border-info'
      };
      return statusClasses[status] || 'bg-light text-secondary border';
    },
    getHiredStatusBadgeClass(status) {
      const statusClasses = {
        'Hired': 'bg-light text-success border border-success',
        'Rejected': 'bg-light text-danger border border-danger',
        'Under Review': 'bg-light text-warning border border-warning',
        'Pending': 'bg-light text-secondary border'
      };
      return statusClasses[status] || 'bg-light text-secondary border';
    },
    getModeIcon(mode) {
      const modeIcons = {
        'In-Person': 'ti ti-users',
        'Video Call': 'ti ti-video',
        'Phone': 'ti ti-phone',
        'Online': 'ti ti-world'
      };
      return modeIcons[mode] || 'ti ti-device-desktop';
    },
    formatDate(date) {
      if (!date) return 'N/A';
      const userLocale = navigator.language || 'en-GB';
      // force DMY for any US‐style locale
      const localeToUse = userLocale === 'en-US' ? 'en-GB' : userLocale;
      return new Intl.DateTimeFormat(localeToUse, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(new Date(date));
    },
    formatTime(time) {
      return time ? time.substring(0, 5) : 'N/A'; // Format HH:mm
    },
    async fetchInterviewDetails() {
      try {
        this.loading = true;
        const interviewId = this.$route.params.id;
        console.log(interviewId);

        const interviewStore = useInterviewStore();
        const interviewData = await interviewStore.fetchInterviewById(interviewId);

        if (interviewData) {
          this.interview = interviewStore.currentInterview;
        }
      } catch (error) {
        this.error = error.message || 'Failed to fetch interview details';
        console.error('Error fetching interview details:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchInterviewDetails();
  }
};
</script>

<style scoped>
/* Card Enhancements */
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.card-header {
  background-color: #f8f9fa !important;
  border-bottom: 1px solid #e5e7eb !important;
  padding: 1rem 1.5rem;
}

.card-body {
  background-color: #ffffff;
}

/* Shadow Effects */
.shadow-sm {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03) !important;
}

/* Detail Items */
.detail-item {
  padding: 0.5rem 0;
}

.detail-item label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: #6b7280;
}

.detail-item p {
  font-size: 0.95rem;
  color: #1f2937;
}

/* Badge Styles */
.badge {
  font-weight: 500;
  font-size: 0.875rem !important;
  letter-spacing: 0.025em;
}

.badge.border {
  border-width: 1px !important;
}

/* Timeline Styles */
.timeline-item {
  position: relative;
}

.timeline-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 18px;
  top: 44px;
  bottom: -16px;
  width: 1px;
  background-color: #e5e7eb;
}

/* Stat Items */
.stat-item {
  font-size: 0.9rem;
}

.stat-item .text-muted {
  font-size: 0.875rem;
}

/* Feedback & Reference Content */
.feedback-content,
.reference-content {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid #e5e7eb;
}

.feedback-content p,
.reference-content p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #374151;
}

/* Button Styles */
.btn-outline-secondary {
  border-color: #d1d5db;
  color: #4b5563;
  background-color: transparent;
  font-weight: 500;
}

.btn-outline-secondary:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

/* Header Card */
.card-body h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

/* Text Colors */
.text-dark {
  color: #1f2937 !important;
}

.fw-semibold {
  font-weight: 600 !important;
}

.fw-medium {
  font-weight: 500 !important;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .card-header {
    padding: 0.875rem 1rem;
  }

  .card-body {
    padding: 1rem !important;
  }

  .detail-item {
    margin-bottom: 1rem;
  }
}

/* Empty State Icons */
.ti-message-off,
.ti-user-x {
  opacity: 0.5;
}

/* Hover Effects */
.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
}

/* Professional Color Scheme */
.bg-light {
  background-color: #f8f9fa !important;
}

.border-bottom {
  border-bottom-color: #e5e7eb !important;
}

.text-muted {
  color: #6b7280 !important;
}

/* Score Display */
.text-end h5 {
  font-size: 1.25rem;
  font-weight: 600;
}

/* Grid Spacing */
.g-4 {
  --bs-gutter-y: 1.5rem;
  --bs-gutter-x: 1.5rem;
}

.g-3 {
  --bs-gutter-y: 1rem;
  --bs-gutter-x: 1rem;
}

/* Line Height */
.lh-lg {
  line-height: 1.8 !important;
}
</style>

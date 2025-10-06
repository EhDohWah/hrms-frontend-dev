<template>
    <div class="row">
        <div class="col-12">
            <div class="card bg-dark text-white">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                            <h3 class="text-white mb-1">Welcome Back, {{ userName }}!</h3>
                            <p class="text-white-75 mb-0">Site Admin Dashboard - Manage all employee requests, training
                                records, and system administration</p>
                        </div>
                        <div class="flex-shrink-0">
                            <i class="ti ti-shield-check text-white" style="font-size: 3rem; opacity: 0.7;"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- System Overview Stats Row -->
    <div class="row">
        <div class="col-lg-3 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <div class="avatar avatar-lg bg-primary-transparent rounded">
                                <i class="ti ti-users text-primary"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.totalEmployees }}</h5>
                            <p class="text-muted mb-0">Total Employees</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <div class="avatar avatar-lg bg-success-transparent rounded">
                                <i class="ti ti-calendar-check text-success"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.totalLeaveRequests }}</h5>
                            <p class="text-muted mb-0">All Leave Requests</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <div class="avatar avatar-lg bg-info-transparent rounded">
                                <i class="ti ti-plane text-info"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.totalTravelRequests }}</h5>
                            <p class="text-muted mb-0">All Travel Requests</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <div class="avatar avatar-lg bg-warning-transparent rounded">
                                <i class="ti ti-school text-warning"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.totalTrainingSessions }}</h5>
                            <p class="text-muted mb-0">All Training Records</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Pending Requests Stats Row -->
    <div class="row">
        <div class="col-lg-3 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <div class="avatar avatar-lg bg-warning-transparent rounded">
                                <i class="ti ti-clock text-warning"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.pendingLeaveRequests }}</h5>
                            <p class="text-muted mb-0">Pending Leave Requests</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <div class="avatar avatar-lg bg-info-transparent rounded">
                                <i class="ti ti-plane-departure text-info"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.pendingTravelRequests }}</h5>
                            <p class="text-muted mb-0">Pending Travel Requests</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <div class="avatar avatar-lg bg-success-transparent rounded">
                                <i class="ti ti-user-check text-success"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.activeEmployees }}</h5>
                            <p class="text-muted mb-0">Active Employees</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-3 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <div class="avatar avatar-lg bg-primary-transparent rounded">
                                <i class="ti ti-certificate text-primary"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.ongoingTraining }}</h5>
                            <p class="text-muted mb-0">Ongoing Training</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- System Activities and Recent Requests -->
    <div class="row">
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Recent System Activities</h5>
                </div>
                <div class="card-body">
                    <div class="activity-list">
                        <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                            <div class="d-flex align-items-start">
                                <div class="activity-icon me-3">
                                    <i :class="activity.icon" :style="{ color: activity.color }"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">{{ activity.title }}</h6>
                                    <p class="text-muted mb-1 small">{{ activity.description }}</p>
                                    <small class="text-muted">{{ activity.time }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Recent Employee Requests</h5>
                </div>
                <div class="card-body">
                    <div class="request-list">
                        <div class="request-item" v-for="request in recentRequests" :key="request.id">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="mb-1">{{ request.title }}</h6>
                                    <p class="text-muted mb-1 small">{{ request.employee }} - {{ request.description }}
                                    </p>
                                    <small class="text-muted">{{ request.date }}</small>
                                </div>
                                <span class="badge" :class="getStatusClass(request.status)">
                                    {{ request.status }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Quick Actions</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-3 col-md-6 mb-3">
                            <button class="btn btn-success btn-block" @click="navigateToLeaveAdmin">
                                <i class="ti ti-calendar-check me-2"></i>Manage Leave Requests
                            </button>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-3">
                            <button class="btn btn-info btn-block" @click="navigateToTravelAdmin">
                                <i class="ti ti-plane me-2"></i>Manage Travel Requests
                            </button>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-3">
                            <button class="btn btn-warning btn-block" @click="navigateToTraining">
                                <i class="ti ti-school me-2"></i>Manage Training
                            </button>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-3">
                            <button class="btn btn-primary btn-block" @click="navigateToEmployeeTraining">
                                <i class="ti ti-certificate me-2"></i>Employee Training
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export default {
    name: 'WelcomeSiteAdmin',
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        const userName = ref('Site Admin');

        const stats = ref({
            totalEmployees: 0,
            totalLeaveRequests: 0,
            totalTravelRequests: 0,
            totalTrainingSessions: 0,
            pendingLeaveRequests: 0,
            pendingTravelRequests: 0,
            activeEmployees: 0,
            ongoingTraining: 0
        });

        const recentActivities = ref([
            {
                id: 1,
                icon: 'ti ti-user-plus',
                color: '#28a745',
                title: 'New Employee Onboarded',
                description: 'John Doe has been successfully added to the system',
                time: '2 hours ago'
            },
            {
                id: 2,
                icon: 'ti ti-calendar-check',
                color: '#ffc107',
                title: 'Leave Request Approved',
                description: 'Jane Smith\'s vacation request has been approved',
                time: '4 hours ago'
            },
            {
                id: 3,
                icon: 'ti ti-plane',
                color: '#17a2b8',
                title: 'Travel Request Submitted',
                description: 'Mike Johnson submitted a travel request for conference',
                time: '6 hours ago'
            },
            {
                id: 4,
                icon: 'ti ti-school',
                color: '#dc3545',
                title: 'Training Session Completed',
                description: 'Leadership training completed by 15 employees',
                time: '1 day ago'
            },
            {
                id: 5,
                icon: 'ti ti-user-check',
                color: '#6f42c1',
                title: 'Employee Status Updated',
                description: 'Sarah Wilson\'s employment status updated to active',
                time: '2 days ago'
            }
        ]);

        const recentRequests = ref([
            {
                id: 1,
                title: 'Annual Leave Request',
                employee: 'John Smith',
                description: 'Vacation leave for 5 days',
                date: 'Dec 20-24, 2024',
                status: 'pending'
            },
            {
                id: 2,
                title: 'Travel Request - Conference',
                employee: 'Jane Doe',
                description: 'Attending HR Conference in Manila',
                date: 'Jan 15-17, 2025',
                status: 'approved'
            },
            {
                id: 3,
                title: 'Sick Leave',
                employee: 'Mike Johnson',
                description: 'Medical appointment',
                date: 'Nov 28, 2024',
                status: 'approved'
            },
            {
                id: 4,
                title: 'Training Request',
                employee: 'Sarah Wilson',
                description: 'Digital Marketing Course',
                date: 'Dec 1, 2024',
                status: 'pending'
            },
            {
                id: 5,
                title: 'Emergency Leave',
                employee: 'David Brown',
                description: 'Family emergency',
                date: 'Nov 30, 2024',
                status: 'approved'
            }
        ]);

        onMounted(() => {
            // Get user name from auth store
            if (authStore.currentUser) {
                userName.value = authStore.currentUser.name || 'Site Admin';
            }

            // Load dashboard stats
            loadDashboardStats();
        });

        const loadDashboardStats = () => {
            // Set realistic default values for site admin dashboard
            stats.value = {
                totalEmployees: 245,
                totalLeaveRequests: 156,
                totalTravelRequests: 89,
                totalTrainingSessions: 67,
                pendingLeaveRequests: 12,
                pendingTravelRequests: 8,
                activeEmployees: 238,
                ongoingTraining: 15
            };
        };

        const getStatusClass = (status) => {
            switch (status) {
                case 'approved': return 'bg-success';
                case 'pending': return 'bg-warning';
                case 'rejected': return 'bg-danger';
                default: return 'bg-secondary';
            }
        };

        // Navigation methods
        const navigateToLeaveAdmin = () => {
            router.push('/leave/admin/leaves-admin');
        };

        const navigateToTravelAdmin = () => {
            router.push('/requests/travel/admin');
        };

        const navigateToTraining = () => {
            router.push('/training/training-list');
        };

        const navigateToEmployeeTraining = () => {
            router.push('/training/employee-training-list');
        };

        return {
            userName,
            stats,
            recentActivities,
            recentRequests,
            getStatusClass,
            navigateToLeaveAdmin,
            navigateToTravelAdmin,
            navigateToTraining,
            navigateToEmployeeTraining
        };
    }
};
</script>

<style scoped>
.request-list,
.activity-list {
    padding: 0;
}

.request-item,
.activity-item {
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
}

.request-item:last-child,
.activity-item:last-child {
    border-bottom: none;
}

.activity-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border-radius: 50%;
}

.activity-icon i {
    font-size: 18px;
}

.text-white-75 {
    opacity: 0.75;
}

.btn-block {
    width: 100%;
}

/* Responsive adjustments for statistics cards */
@media (max-width: 768px) {
    .col-lg-3 {
        margin-bottom: 1rem;
    }
}

/* Enhanced card hover effects */
.card:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease-in-out;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Activity icon background colors */
.activity-icon {
    background-color: rgba(0, 123, 255, 0.1);
}
</style>

<template>
    <div class="row">
        <div class="col-12">
            <div class="card bg-primary text-white">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                            <h3 class="text-white mb-1">Welcome Back, {{ userName }}!</h3>
                            <p class="text-white-75 mb-0">HR Assistant Senior Dashboard - You have access to most HR
                                functions except grants management</p>
                        </div>
                        <div class="flex-shrink-0">
                            <i class="ti ti-user-shield text-white" style="font-size: 3rem; opacity: 0.7;"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Stats Row -->
    <div class="row">
        <div class="col-lg-3 col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                            <div class="avatar avatar-lg bg-success-transparent rounded">
                                <i class="ti ti-users text-success"></i>
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
                            <div class="avatar avatar-lg bg-warning-transparent rounded">
                                <i class="ti ti-calendar-time text-warning"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.pendingLeaves }}</h5>
                            <p class="text-muted mb-0">Pending Leaves</p>
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
                                <i class="ti ti-briefcase text-info"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.activeInterviews }}</h5>
                            <p class="text-muted mb-0">Active Interviews</p>
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
                            <div class="avatar avatar-lg bg-danger-transparent rounded">
                                <i class="ti ti-school text-danger"></i>
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

    <!-- Recent Activities -->
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Recent Activities</h5>
                </div>
                <div class="card-body">
                    <div class="activity-feed">
                        <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                            <div class="activity-icon">
                                <i :class="activity.icon" :style="{ color: activity.color }"></i>
                            </div>
                            <div class="activity-content">
                                <h6 class="mb-1">{{ activity.title }}</h6>
                                <p class="text-muted mb-1">{{ activity.description }}</p>
                                <small class="text-muted">{{ activity.time }}</small>
                            </div>
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

export default {
    name: 'WelcomeHrAssistantSenior',
    setup() {
        const authStore = useAuthStore();
        const userName = ref('HR Assistant Senior');

        const stats = ref({
            totalEmployees: 0,
            pendingLeaves: 0,
            activeInterviews: 0,
            ongoingTraining: 0
        });

        const recentActivities = ref([
            {
                id: 1,
                icon: 'ti ti-user-plus',
                color: '#28a745',
                title: 'New Employee Onboarded',
                description: 'John Doe has been successfully onboarded',
                time: '2 hours ago'
            },
            {
                id: 2,
                icon: 'ti ti-calendar-check',
                color: '#ffc107',
                title: 'Leave Request Approved',
                description: 'Jane Smith\'s vacation request approved',
                time: '4 hours ago'
            },
            {
                id: 3,
                icon: 'ti ti-briefcase',
                color: '#17a2b8',
                title: 'Interview Scheduled',
                description: 'Technical interview scheduled for tomorrow',
                time: '6 hours ago'
            },
            {
                id: 4,
                icon: 'ti ti-school',
                color: '#dc3545',
                title: 'Training Session Completed',
                description: 'Leadership training session completed by 15 employees',
                time: '1 day ago'
            }
        ]);

        onMounted(() => {
            // Get user name from auth store
            if (authStore.currentUser) {
                userName.value = authStore.currentUser.name || 'HR Assistant Senior';
            }

            // Load dashboard stats - these would normally come from API calls
            loadDashboardStats();
        });

        const loadDashboardStats = () => {
            // Simulate API calls - replace with actual service calls
            stats.value = {
                totalEmployees: 245,
                pendingLeaves: 12,
                activeInterviews: 8,
                ongoingTraining: 3
            };
        };

        return {
            userName,
            stats,
            recentActivities
        };
    }
};
</script>

<style scoped>
.activity-feed {
    padding: 0;
}

.activity-item {
    display: flex;
    align-items: start;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
}

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
    margin-right: 15px;
}

.activity-icon i {
    font-size: 18px;
}

.activity-content {
    flex-grow: 1;
}

.text-white-75 {
    opacity: 0.75;
}
</style>

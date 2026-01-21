<template>
    <div class="row">
        <div class="col-12">
            <div class="card bg-info text-white">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                            <h3 class="text-white mb-1">Welcome Back, {{ userName }}!</h3>
                            <p class="text-white-75 mb-0">HR Assistant Junior Dashboard - Basic HR operations and
                                employee management</p>
                        </div>
                        <div class="flex-shrink-0">
                            <i class="ti ti-user-check text-white" style="font-size: 3rem; opacity: 0.7;"></i>
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
                                <i class="ti ti-clock text-info"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.attendanceToday }}</h5>
                            <p class="text-muted mb-0">Present Today</p>
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
                                <i class="ti ti-school text-primary"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <h5 class="mb-1">{{ stats.upcomingTraining }}</h5>
                            <p class="text-muted mb-0">Upcoming Training</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- My Tasks -->
    <div class="row">
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">My Tasks Today</h5>
                </div>
                <div class="card-body">
                    <div class="task-list">
                        <div class="task-item" v-for="task in myTasks" :key="task.id">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" :id="`task-${task.id}`"
                                    v-model="task.completed">
                                <label class="form-check-label" :for="`task-${task.id}`"
                                    :class="{ 'text-decoration-line-through': task.completed }">
                                    {{ task.title }}
                                </label>
                            </div>
                            <span class="badge"
                                :class="task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning' : 'bg-success'">
                                {{ task.priority }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Quick Actions</h5>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-sm">
                            <i class="ti ti-user-plus me-2"></i>Add Employee
                        </button>
                        <button class="btn btn-success btn-sm">
                            <i class="ti ti-calendar-check me-2"></i>Review Attendance
                        </button>
                        <button class="btn btn-info btn-sm">
                            <i class="ti ti-file-text me-2"></i>Generate Report
                        </button>
                        <button class="btn btn-warning btn-sm">
                            <i class="ti ti-school me-2"></i>Schedule Training
                        </button>
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
    name: 'WelcomeHrAssistantJunior',
    setup() {
        const authStore = useAuthStore();
        const userName = ref('HR Assistant Junior');

        const stats = ref({
            totalEmployees: 0,
            pendingLeaves: 0,
            attendanceToday: 0,
            upcomingTraining: 0
        });

        const myTasks = ref([
            {
                id: 1,
                title: 'Review new employee applications',
                priority: 'high',
                completed: false
            },
            {
                id: 2,
                title: 'Update employee database',
                priority: 'medium',
                completed: false
            },
            {
                id: 3,
                title: 'Prepare attendance reports',
                priority: 'medium',
                completed: true
            },
            {
                id: 4,
                title: 'Schedule team meeting',
                priority: 'low',
                completed: false
            },
            {
                id: 5,
                title: 'Update training records',
                priority: 'low',
                completed: false
            }
        ]);

        onMounted(() => {
            // Get user name from auth store
            if (authStore.currentUser) {
                userName.value = authStore.currentUser.name || 'HR Assistant Junior';
            }

            // Load dashboard stats - these would normally come from API calls
            loadDashboardStats();
        });

        const loadDashboardStats = () => {
            // Simulate API calls - replace with actual service calls
            stats.value = {
                totalEmployees: 245,
                pendingLeaves: 8,
                attendanceToday: 198,
                upcomingTraining: 2
            };
        };

        return {
            userName,
            stats,
            myTasks
        };
    }
};
</script>

<style scoped>
.task-list {
    padding: 0;
}

.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.task-item:last-child {
    border-bottom: none;
}

.form-check {
    flex-grow: 1;
}

.text-white-75 {
    opacity: 0.75;
}
</style>

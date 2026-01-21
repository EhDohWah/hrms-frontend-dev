<template>
    <!-- HR Assistant Junior Dashboard Modal -->
    <div class="modal fade" id="hr-assistant-junior-modal" tabindex="-1" aria-labelledby="hrAssistantJuniorModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="hrAssistantJuniorModalLabel">HR Assistant Junior Actions</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card border-primary h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-primary-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-users text-primary"></i>
                                    </div>
                                    <h6 class="card-title">Employee Records</h6>
                                    <p class="card-text small text-muted">View and update basic employee information and
                                        records</p>
                                    <button class="btn btn-primary btn-sm">View Employees</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-success h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-success-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-calendar-check text-success"></i>
                                    </div>
                                    <h6 class="card-title">Attendance</h6>
                                    <p class="card-text small text-muted">Monitor daily attendance and manage timesheets
                                    </p>
                                    <button class="btn btn-success btn-sm">View Attendance</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-info h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-info-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-briefcase text-info"></i>
                                    </div>
                                    <h6 class="card-title">Basic Recruitment</h6>
                                    <p class="card-text small text-muted">Assist with interview scheduling and basic
                                        recruitment tasks</p>
                                    <button class="btn btn-info btn-sm">Support Recruitment</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-warning h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-warning-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-school text-warning"></i>
                                    </div>
                                    <h6 class="card-title">Training Support</h6>
                                    <p class="card-text small text-muted">Assist with training coordination and record
                                        keeping</p>
                                    <button class="btn btn-warning btn-sm">Support Training</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-primary h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-primary-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-plane text-primary"></i>
                                    </div>
                                    <h6 class="card-title">Travel Requests</h6>
                                    <p class="card-text small text-muted">Process and manage employee travel requests
                                    </p>
                                    <button class="btn btn-primary btn-sm">Manage Travel</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-success h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-success-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-calendar-time text-success"></i>
                                    </div>
                                    <h6 class="card-title">Leave Requests</h6>
                                    <p class="card-text small text-muted">Review and process basic leave applications
                                    </p>
                                    <button class="btn btn-success btn-sm">Process Leaves</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HrAssistantJuniorDashboardModal'
};
</script>

<style scoped>
.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-2px);
}
</style>

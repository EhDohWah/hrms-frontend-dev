<template>
    <!-- Site Admin Dashboard Modal -->
    <div class="modal fade" id="site-admin-modal" tabindex="-1" aria-labelledby="siteAdminModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="siteAdminModalLabel">Site Admin - My Actions</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card border-success h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-success-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-calendar-plus text-success"></i>
                                    </div>
                                    <h6 class="card-title">Leave Requests</h6>
                                    <p class="card-text small text-muted">Submit and manage your personal leave requests
                                    </p>
                                    <button class="btn btn-success btn-sm">My Leave Requests</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-info h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-info-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-plane text-info"></i>
                                    </div>
                                    <h6 class="card-title">Travel Requests</h6>
                                    <p class="card-text small text-muted">Submit and track your business travel requests
                                    </p>
                                    <button class="btn btn-info btn-sm">My Travel Requests</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-warning h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-warning-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-school text-warning"></i>
                                    </div>
                                    <h6 class="card-title">Training Sessions</h6>
                                    <p class="card-text small text-muted">View available training and track your
                                        progress</p>
                                    <button class="btn btn-warning btn-sm">My Training</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-primary h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-primary-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-user text-primary"></i>
                                    </div>
                                    <h6 class="card-title">My Profile</h6>
                                    <p class="card-text small text-muted">Update your personal information and
                                        preferences</p>
                                    <button class="btn btn-primary btn-sm">Edit Profile</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-secondary h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-secondary-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-clock text-secondary"></i>
                                    </div>
                                    <h6 class="card-title">My Schedule</h6>
                                    <p class="card-text small text-muted">View your work schedule and upcoming
                                        activities</p>
                                    <button class="btn btn-secondary btn-sm">View Schedule</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-dark h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-dark-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-settings text-dark"></i>
                                    </div>
                                    <h6 class="card-title">Account Settings</h6>
                                    <p class="card-text small text-muted">Manage your account security and notification
                                        preferences</p>
                                    <button class="btn btn-dark btn-sm">Account Settings</button>
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
    name: 'SiteAdminDashboardModal'
};
</script>

<style scoped>
.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-2px);
}

.bg-dark-transparent {
    background-color: rgba(33, 37, 41, 0.1) !important;
}
</style>

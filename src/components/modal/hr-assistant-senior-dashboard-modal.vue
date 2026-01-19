<template>
    <!-- HR Assistant Senior Dashboard Modal -->
    <div class="modal fade" id="hr-assistant-senior-modal" tabindex="-1" aria-labelledby="hrAssistantSeniorModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="hrAssistantSeniorModalLabel">HR Assistant Senior Actions</h5>
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
                                    <h6 class="card-title">Employee Management</h6>
                                    <p class="card-text small text-muted">Manage employee records, employment details,
                                        and personal information</p>
                                    <button class="btn btn-primary btn-sm">Manage Employees</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-success h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-success-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-calendar-check text-success"></i>
                                    </div>
                                    <h6 class="card-title">Leave Management</h6>
                                    <p class="card-text small text-muted">Process leave requests, manage leave balances
                                        and types</p>
                                    <button class="btn btn-success btn-sm">Manage Leaves</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-info h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-info-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-briefcase text-info"></i>
                                    </div>
                                    <h6 class="card-title">Recruitment</h6>
                                    <p class="card-text small text-muted">Handle interviews, job offers, and candidate
                                        management</p>
                                    <button class="btn btn-info btn-sm">Manage Recruitment</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-warning h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-warning-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-coin text-warning"></i>
                                    </div>
                                    <h6 class="card-title">Payroll</h6>
                                    <p class="card-text small text-muted">Process payroll, manage tax settings and
                                        employee salaries</p>
                                    <button class="btn btn-warning btn-sm">Manage Payroll</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-danger h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-danger-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-school text-danger"></i>
                                    </div>
                                    <h6 class="card-title">Training</h6>
                                    <p class="card-text small text-muted">Organize training sessions, manage trainers
                                        and track progress</p>
                                    <button class="btn btn-danger btn-sm">Manage Training</button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <div class="card border-secondary h-100">
                                <div class="card-body text-center">
                                    <div class="avatar avatar-lg bg-secondary-transparent rounded mb-3 mx-auto">
                                        <i class="ti ti-file-report text-secondary"></i>
                                    </div>
                                    <h6 class="card-title">Reports</h6>
                                    <p class="card-text small text-muted">Generate and view various HR reports and
                                        analytics</p>
                                    <button class="btn btn-secondary btn-sm">View Reports</button>
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
    name: 'HrAssistantSeniorDashboardModal'
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

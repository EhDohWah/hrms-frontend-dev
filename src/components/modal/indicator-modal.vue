<script>
export default {
  data() {
    return {
      Designation: ["Select", "Web Designer", "Web Developer", "IOS Developer"],
      Experience: ["Select", "Advanced", "Intermediate", "Average"],
      Marketing: ["Select", "Expert/Leader", "Intermediate", "Average"],
      Management: ["Select", "Intermediate", "Medium", "Average"],
      Administration: ["Select", "Advanced", "Intermediate", "Average"],
      Presentation: ["Select", "None", "Intermediate", "Average"],
      Quality: ["Select", "None", "Intermediate", "Average"],
      Efficiency: ["Select", "None", "Intermediate", "Average"],
      Integrity: ["Select", "None", "Intermediate", "Average"],
      Professionalism: ["Select", "Advanced", "Intermediate", "Average"],
      Teamwork: ["Select", "None", "Intermediate", "Average"],
      Critical: ["Select", "Advanced", "Intermediate", "Average"],
      Conflict: ["Select", "Advanced", "Intermediate", "Average"],
      Attendance: ["Select", "Advanced", "Intermediate", "Average"],
      Ability: ["Select", "Advanced", "Intermediate", "Average"],
      AbilityOne: ["Select", "Advanced", "Intermediate", "Average"],
      Status: ["Select", "Active", "Inactive"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/performance/performance-indicator");
    },
  },
};
</script>

<template>
  <!-- Add Indicator -->
  <div class="modal fade" id="add_performance_indicator">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Indicator</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Designation</label>
                  <vue-select
                    :options="Designation"
                    id="web-designer"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <h6 class="fw-medium">Technical</h6>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Customer Experience</label>
                  <vue-select
                    :options="Experience"
                    id="experience"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Marketing</label>
                  <vue-select
                    :options="Marketing"
                    id="web-marketing"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Management</label>
                  <vue-select
                    :options="Management"
                    id="web-management"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Administration</label>
                  <vue-select
                    :options="Administration"
                    id="web-administration"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Presentation Skills</label>
                  <vue-select
                    :options="Presentation"
                    id="web-presentation"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Quality of Work</label>
                  <vue-select :options="Quality" id="web-work" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Efficiency</label>
                  <vue-select
                    :options="Efficiency"
                    id="web-efficiency"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <h6 class="fw-medium">Organizational</h6>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Integrity</label>
                  <vue-select
                    :options="Integrity"
                    id="web-integrity"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Professionalism</label>
                  <vue-select
                    :options="Professionalism"
                    id="web-professionalism"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Team Work</label>
                  <vue-select
                    :options="Teamwork"
                    id="web-teamwork"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Critical Thinking</label>
                  <vue-select
                    :options="Critical"
                    id="web-critical"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Conflict Management</label>
                  <vue-select
                    :options="Conflict"
                    id="web-conflict"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Attendance</label>
                  <vue-select
                    :options="Attendance"
                    id="web-attendance"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Ability To Meet Deadline</label>
                  <vue-select :options="Ability" id="webability" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <vue-select :options="Status" id="web-status" placeholder="Select" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Indicator</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Indicator -->

  <!-- Edit Indicator -->
  <div class="modal fade" id="edit_performance-indicator">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit New Indicator</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Designation</label>
                  <vue-select
                    :options="Designation"
                    id="web-designer-one"
                    placeholder="Web Designer"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <h6 class="fw-medium">Technical</h6>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Customer Experience</label>
                  <vue-select
                    :options="Experience"
                    id="experience-one"
                    placeholder="Advanced"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Marketing</label>
                  <vue-select
                    :options="Marketing"
                    id="web-marketing-one"
                    placeholder="Expert/Leader"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Management</label>
                  <vue-select
                    :options="Management"
                    id="web-management-one"
                    placeholder="Intermediate"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Administration</label>
                  <vue-select
                    :options="Administration"
                    id="web-administration-one"
                    placeholder="Advanced"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Presentation Skills</label>
                  <vue-select
                    :options="Presentation"
                    id="web-presentation-one"
                    placeholder="None"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Quality of Work</label>
                  <vue-select :options="Quality" id="web-work-one" placeholder="None" />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Efficiency</label>
                  <vue-select
                    :options="Efficiency"
                    id="web-efficiency-one"
                    placeholder="None"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <h6 class="fw-medium">Organizational</h6>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Integrity</label>
                  <vue-select
                    :options="Integrity"
                    id="web-integrity-one"
                    placeholder="None"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Professionalism</label>
                  <vue-select
                    :options="Professionalism"
                    id="web-professionalism-one"
                    placeholder="Advanced"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Team Work</label>
                  <vue-select
                    :options="Teamwork"
                    id="web-teamwork-one"
                    placeholder="None"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Critical Thinking</label>
                  <vue-select
                    :options="Critical"
                    id="web-critical-one"
                    placeholder="Advanced"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Conflict Management</label>
                  <vue-select
                    :options="Conflict"
                    id="web-conflict-one"
                    placeholder="Advanced"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Attendance</label>
                  <vue-select
                    :options="Attendance"
                    id="web-attendance-one"
                    placeholder="Advanced"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label">Ability To Meet Deadline</label>
                  <vue-select
                    :options="AbilityOne"
                    id="webabilityOne"
                    placeholder="Advanced"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <vue-select
                    :options="Status"
                    id="web-status-one"
                    placeholder="Active"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Indicator -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
            <i class="ti ti-trash-x fs-36"></i>
          </span>
          <h4 class="mb-1">Confirm Delete</h4>
          <p class="mb-3">
            You want to delete all the marked items, this cant be undone once you delete.
          </p>
          <div class="d-flex justify-content-center">
            <a
              href="javascript:void(0);"
              class="btn btn-light me-3"
              data-bs-dismiss="modal"
              >Cancel</a
            >
            <router-link to="/performance/performance-indicator" class="btn btn-danger"
              >Yes, Delete</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>

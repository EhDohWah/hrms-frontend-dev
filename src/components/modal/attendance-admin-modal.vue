<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

import { ref } from "vue";
const currentDate = ref(new Date());

export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      startdate: currentDate,
      dateFormat: "dd-MM-yyyy",
      Status: [
        { label: "Select", value: "" },
        { label: "Present", value: "Present" },
        { label: "Absent", value: "Absent" },
      ],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/attendance/attendance-admin");
    },
  },
};
</script>

<template>
  <!-- Edit Attendance -->
  <div class="modal fade" id="edit_attendance">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Attendance</h4>
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
                  <label class="form-label">Date</label>
                  <div class="input-icon position-relative w-100 me-2">
                    <date-picker
                      v-model="startdate"
                      class="form-control datetimepicker ps-3"
                      value="15/05/2025"
                      :editable="true"
                      :clearable="false"
                      :input-format="dateFormat"
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-calendar"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Check In</label>
                  <div class="input-icon position-relative w-100">
                    <input
                      type="text"
                      class="form-control timepicker ps-3"
                      value="09:00 AM"
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-clock-hour-3"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Check Out</label>
                  <div class="input-icon position-relative w-100">
                    <input
                      type="text"
                      class="form-control timepicker ps-3"
                      value="06:45 PM"
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-clock-hour-3"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Break</label>
                  <input type="text" class="form-control" value="30 Min	" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Late</label>
                  <input type="text" class="form-control" value="32 Min" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Production Hours</label>
                  <div class="input-icon position-relative w-100">
                    <input
                      type="text"
                      class="form-control timepicker ps-3"
                      value="8.55 Hrs"
                    />
                    <span class="input-icon-addon">
                      <i class="ti ti-clock-hour-3"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <a-select :options="Status" id="emp-present" placeholder="Select" />
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
  <!-- /Edit Attendance -->

  <!-- Attendance Report -->
  <div class="modal fade" id="attendance_report">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Attendance</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="card shadow-none bg-transparent-light">
            <div class="card-body pb-1">
              <div class="row align-items-center">
                <div class="col-lg-4">
                  <div class="d-flex align-items-center mb-3">
                    <span class="avatar avatar-sm avatar-rounded flex-shrink-0 me-2">
                      <img src="@/assets/img/profiles/avatar-02.jpg" alt="Img" />
                    </span>
                    <div>
                      <h6 class="fw-medium">Anthony Lewis</h6>
                      <span>UI/UX Team</span>
                    </div>
                  </div>
                </div>
                <div class="col-lg-8">
                  <div class="row">
                    <div class="col-sm-3">
                      <div class="mb-3 text-sm-end">
                        <span>Date</span>
                        <p class="text-gray-9 fw-medium">15/05/2025</p>
                      </div>
                    </div>
                    <div class="col-sm-3">
                      <div class="mb-3 text-sm-end">
                        <span>Punch in at</span>
                        <p class="text-gray-9 fw-medium">09:00 AM</p>
                      </div>
                    </div>
                    <div class="col-sm-3">
                      <div class="mb-3 text-sm-end">
                        <span>Punch out at</span>
                        <p class="text-gray-9 fw-medium">06:45 PM</p>
                      </div>
                    </div>
                    <div class="col-sm-3">
                      <div class="mb-3 text-sm-end">
                        <span>Status</span>
                        <p class="text-gray-9 fw-medium">Present</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card shadow-none border mb-0">
            <div class="card-body">
              <div class="row">
                <div class="col-xl-3">
                  <div class="mb-4">
                    <p class="d-flex align-items-center mb-1">
                      <i class="ti ti-point-filled text-dark-transparent me-1"></i>Total
                      Working hours
                    </p>
                    <h3>12h 36m</h3>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="mb-4">
                    <p class="d-flex align-items-center mb-1">
                      <i class="ti ti-point-filled text-success me-1"></i>Productive Hours
                    </p>
                    <h3>08h 36m</h3>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="mb-4">
                    <p class="d-flex align-items-center mb-1">
                      <i class="ti ti-point-filled text-warning me-1"></i>Break hours
                    </p>
                    <h3>22m 15s</h3>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="mb-4">
                    <p class="d-flex align-items-center mb-1">
                      <i class="ti ti-point-filled text-info me-1"></i>Overtime
                    </p>
                    <h3>02h 15m</h3>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-8 mx-auto">
                  <div class="progress bg-transparent-dark mb-3" style="height: 24px">
                    <div
                      class="progress-bar bg-success rounded me-2"
                      role="progressbar"
                      style="width: 18%"
                    ></div>
                    <div
                      class="progress-bar bg-warning rounded me-2"
                      role="progressbar"
                      style="width: 5%"
                    ></div>
                    <div
                      class="progress-bar bg-success rounded me-2"
                      role="progressbar"
                      style="width: 28%"
                    ></div>
                    <div
                      class="progress-bar bg-warning rounded me-2"
                      role="progressbar"
                      style="width: 17%"
                    ></div>
                    <div
                      class="progress-bar bg-success rounded me-2"
                      role="progressbar"
                      style="width: 22%"
                    ></div>
                    <div
                      class="progress-bar bg-warning rounded me-2"
                      role="progressbar"
                      style="width: 5%"
                    ></div>
                    <div
                      class="progress-bar bg-info rounded me-2"
                      role="progressbar"
                      style="width: 3%"
                    ></div>
                    <div
                      class="progress-bar bg-info rounded"
                      role="progressbar"
                      style="width: 2%"
                    ></div>
                  </div>
                </div>
                <div class="co-md-12">
                  <div class="d-flex align-items-center justify-content-between">
                    <span class="fs-10">06:00</span>
                    <span class="fs-10">07:00</span>
                    <span class="fs-10">08:00</span>
                    <span class="fs-10">09:00</span>
                    <span class="fs-10">10:00</span>
                    <span class="fs-10">11:00</span>
                    <span class="fs-10">12:00</span>
                    <span class="fs-10">01:00</span>
                    <span class="fs-10">02:00</span>
                    <span class="fs-10">03:00</span>
                    <span class="fs-10">04:00</span>
                    <span class="fs-10">05:00</span>
                    <span class="fs-10">06:00</span>
                    <span class="fs-10">07:00</span>
                    <span class="fs-10">08:00</span>
                    <span class="fs-10">09:00</span>
                    <span class="fs-10">10:00</span>
                    <span class="fs-10">11:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Attendance Report -->
</template>

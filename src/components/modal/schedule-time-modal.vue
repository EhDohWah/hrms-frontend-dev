<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

import { ref } from "vue";
const currentDate = ref(new Date());
const currentDateOne = ref(new Date());
const currentDateTwo = ref(new Date());

export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      ClockSch: ["Select", "10'o clock Shift", "10:30 shift", "Daily Shift", "New Shift"],
      ITechSel: [
        "Select",
        "Development",
        "Finance",
        "Finance and Management",
        "Hr & Finance",
        "ITech",
      ],
      EmploSch: [
        "Select",
        "Richard Miles",
        "John Smith",
        "Mike Litorus",
        "Wilmer Deluna",
      ],
      startdate: currentDate,
      startdateOne: currentDateOne,
      startdateTwo: currentDateTwo,
      dateFormat: "dd-MM-yyyy",
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/attendance/schedule-timing");
    },
  },
};
</script>

<template>
  <!-- Add Schedule Modal -->
  <div id="schedule_timing" class="modal custom-modal fade" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Schedule</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="row">
              <div class="col-sm-6">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >Department <span class="text-danger">*</span></label
                  >
                  <a-select :options="ITechSel" id="itechsel" placeholder="Select" />
                </div>
              </div>
              <div class="col-sm-6">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >Employee Name <span class="text-danger">*</span></label
                  >
                  <a-select :options="EmploSch" id="emplosch" placeholder="Select" />
                </div>
              </div>
              <div class="col-sm-6">
                <div class="input-block mb-3">
                  <label class="col-form-label">Date</label>
                  <div class="cal-icon">
                    <input class="form-control datetimepicker" type="text" />
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >Shifts <span class="text-danger">*</span></label
                  >
                  <a-select :options="ClockSch" id="clockch" placeholder="Select" />
                </div>
              </div>
              <div class="col-sm-4">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >Min Start Time <span class="text-danger">*</span></label
                  >
                  <div class="input-group time">
                    <input class="form-control timepicker" /><span
                      class="input-group-text"
                      ><i class="fa-regular fa-clock"></i
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >Start Time <span class="text-danger">*</span></label
                  >
                  <div class="input-group time">
                    <input class="form-control timepicker" /><span
                      class="input-group-text"
                      ><i class="fa-regular fa-clock"></i
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >Max Start Time <span class="text-danger">*</span></label
                  >
                  <div class="input-group time">
                    <input class="form-control timepicker" /><span
                      class="input-group-text"
                      ><i class="fa-regular fa-clock"></i
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >Min End Time <span class="text-danger">*</span></label
                  >
                  <div class="input-group time">
                    <input class="form-control timepicker" /><span
                      class="input-group-text"
                      ><i class="fa-regular fa-clock"></i
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >End Time <span class="text-danger">*</span></label
                  >
                  <div class="input-group time">
                    <input class="form-control timepicker" /><span
                      class="input-group-text"
                      ><i class="fa-regular fa-clock"></i
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >Max End Time <span class="text-danger">*</span></label
                  >
                  <div class="input-group time">
                    <input class="form-control timepicker" /><span
                      class="input-group-text"
                      ><i class="fa-regular fa-clock"></i
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="input-block mb-3">
                  <label class="col-form-label"
                    >Break Time <span class="text-danger">*</span></label
                  >
                  <input class="form-control timepicker" type="text" />
                </div>
              </div>
              <div class="col-sm-12">
                <div class="input-block mb-3">
                  <label class="col-form-label">Accept Extra Hours </label>
                  <div class="form-check form-switch">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="customSwitch1"
                      checked=""
                    />
                    <label class="form-check-label" for="customSwitch1"></label>
                  </div>
                </div>
              </div>
              <div class="col-sm-12">
                <div class="input-block mb-3">
                  <label class="col-form-label">Publish </label>
                  <div class="form-check form-switch">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="customSwitch2"
                      checked=""
                    />
                    <label class="form-check-label" for="customSwitch2"></label>
                  </div>
                </div>
              </div>
            </div>

            <div class="submit-section">
              <button class="btn btn-primary submit-btn">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- /Add Schedule Modal -->
</template>

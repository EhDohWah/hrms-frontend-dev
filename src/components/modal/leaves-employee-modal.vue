<template>
  <div>
    <!-- Modal -->
    <div class="modal fade" id="add_leaves" tabindex="-1" aria-labelledby="leaveRequestModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title" id="leaveRequestModalLabel">
              Leave Request Form / ใบขอลางาน
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container my-4">
              <!-- Logo / Header -->
              <div class="row mb-4">
                <div class="col-12 text-center">
                  <img src="@/assets/img/smru-logo.png" alt="LOGO" style="max-height: 70px" />
                </div>
              </div>

              <!-- Date -->
              <div class="row mb-3">
                <div class="col-12 text-end">
                  <strong>Date/วันที่:</strong>
                  <input type="date" class="form-control d-inline-block w-auto ms-2" v-model="form.date" />
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-12 text-center">
                  <h4 class="mb-0">Leave request form / ใบขอลางาน</h4>
                </div>
              </div>

              <!-- Form Start -->
              <form @submit.prevent="submitForm">
                <!-- Personal Information Row 1 -->
                <div class="row mb-3">
                  <div class="col-md-3">
                    <label for="name" class="form-label">Name/ชื่อ</label>
                    <input type="text" class="form-control" id="name" placeholder="Enter name" v-model="form.name" />
                  </div>
                  <div class="col-md-3">
                    <label for="position" class="form-label">Position/ตำแหน่ง</label>
                    <input type="text" class="form-control" id="position" placeholder="Enter position"
                      v-model="form.position" />
                  </div>
                  <div class="col-md-3">
                    <label for="staffId" class="form-label">Staff ID/รหัสพนักงาน</label>
                    <input type="text" class="form-control" id="staffId" placeholder="Enter Staff ID"
                      v-model="form.staffId" />
                  </div>
                  <div class="col-md-3">
                    <label for="department" class="form-label">Department/แผนก</label>
                    <input type="text" class="form-control" id="department" placeholder="Enter department"
                      v-model="form.department" />
                  </div>
                </div>

                <!-- Personal Information Row 2 -->
                <div class="row mb-3">
                  <div class="col-md-3">
                    <label for="site" class="form-label">Site ที่ปฏิบัติงาน</label>
                    <input type="text" class="form-control" id="site" placeholder="Site" v-model="form.site" />
                  </div>
                  <div class="col-md-3">
                    <label for="hiringDate" class="form-label">Date of hiring/วันที่บรรจุ</label>
                    <input type="date" class="form-control" id="hiringDate" v-model="form.hiringDate" />
                  </div>
                </div>

                <!-- Leave Dates -->
                <div class="row mb-3">
                  <div class="col-md-4">
                    <label for="firstDayLeave" class="form-label">From/วันที่</label>
                    <input type="date" class="form-control" id="firstDayLeave" v-model="form.firstDayLeave" />
                  </div>
                  <div class="col-md-4">
                    <label for="returnToWork" class="form-label">To/ถึง</label>
                    <input type="date" class="form-control" id="returnToWork" v-model="form.returnToWork" />
                  </div>
                  <div class="col-md-4">
                    <label for="totalDays" class="form-label">Total Days / รวมวัน</label>
                    <div class="d-flex align-items-center">
                      <input type="number" class="form-control w-auto" placeholder="days"
                        v-model.number="form.totalDays" />
                      <span class="ms-2">days / วัน</span>
                    </div>
                  </div>
                </div>

                <!-- Reason Section -->
                <div class="mb-3">
                  <label class="font-weight-bold d-block mb-2">
                    For the following reason / ด้วยเหตุผลดังต่อไปนี้
                  </label>
                  <!-- Annual Vacation -->
                  <div class="form-check reason-input mb-2">
                    <input class="form-check-input me-2" type="checkbox" id="annualVacation"
                      v-model="form.annualVacation" />
                    <label class="form-check-label me-2" for="annualVacation">
                      Annual vacation (remain vacation
                    </label>
                    <input type="number" class="form-control form-control-inline" placeholder="days"
                      v-model.number="form.annualVacationDays" />
                    <span class="mx-2">days) / ลาพักผ่อนประจำปี (คงเหลือ</span>
                    <input type="number" class="form-control form-control-inline" placeholder="วัน"
                      v-model.number="form.annualVacationRemain" />
                    <span class="ms-2">วัน)</span>
                  </div>
                  <!-- Traditional Day-off -->
                  <div class="form-check reason-input mb-2">
                    <input class="form-check-input me-2" type="checkbox" id="traditionalDayOff"
                      v-model="form.traditionalDayOff" />
                    <label class="form-check-label me-2" for="traditionalDayOff">
                      Traditional day-off (Remaining
                    </label>
                    <input type="number" class="form-control form-control-inline" placeholder="days"
                      v-model.number="form.traditionalDayOffDays" />
                    <span class="mx-2">days) / ลาวันหยุดตามประเพณี (คงเหลือ</span>
                    <input type="number" class="form-control form-control-inline" placeholder="วัน"
                      v-model.number="form.traditionalDayOffRemain" />
                    <span class="ms-2">วัน)</span>
                  </div>
                  <!-- Sick Leave -->
                  <div class="form-check reason-input mb-2">
                    <input class="form-check-input me-2" type="checkbox" id="sickLeave" v-model="form.sickLeave" />
                    <label class="form-check-label me-2" for="sickLeave">
                      Sick leave (Remaining
                    </label>
                    <input type="number" class="form-control form-control-inline" placeholder="days"
                      v-model.number="form.sickLeaveDays" />
                    <span class="mx-2">days) / ลาป่วย (คงเหลือ</span>
                    <input type="number" class="form-control form-control-inline" placeholder="วัน"
                      v-model.number="form.sickLeaveRemain" />
                    <span class="ms-2">วัน)</span>
                  </div>
                  <!-- Maternity/Paternity Leave -->
                  <div class="form-check mb-2">
                    <input class="form-check-input me-2" type="checkbox" id="maternityLeave"
                      v-model="form.maternityLeave" />
                    <label class="form-check-label" for="maternityLeave">
                      Maternity or Paternity leave 90 days / ลาคลอดบุตร (90 วัน)
                      หรือ ลาเป็นบิดา
                    </label>
                  </div>
                  <!-- Personal Business Leave -->
                  <div class="form-check mb-2">
                    <input class="form-check-input me-2" type="checkbox" id="personalBusinessLeave"
                      v-model="form.personalBusinessLeave" />
                    <label class="form-check-label" for="personalBusinessLeave">
                      Personal business leave 6 days / ลากิจส่วนตัว (6 วัน)
                    </label>
                  </div>
                  <!-- Compassionate Leave -->
                  <div class="form-check mb-2">
                    <input class="form-check-input me-2" type="checkbox" id="compassionateLeave"
                      v-model="form.compassionateLeave" />
                    <label class="form-check-label" for="compassionateLeave">
                      Compassionate leave (for father, mother/father in law,
                      siblings, etc.) 5 days / ลากิจเนื่องจากญาติเสียชีวิต
                      (บิดา, มารดา, พี่น้อง ฯลฯ 5 วัน)
                    </label>
                  </div>
                  <!-- Others -->
                  <div class="form-check reason-input">
                    <input class="form-check-input me-2" type="checkbox" id="others" v-model="form.others" />
                    <label class="form-check-label me-2" for="others">
                      Others/อื่นๆ
                    </label>
                    <textarea class="form-control form-control-inline w-50" placeholder="Specify" rows="1"
                      v-model="form.othersReason"></textarea>
                  </div>
                </div>

                <!-- Signatures -->
                <div class="row mt-4">
                  <div class="col-md-6">
                    <p class="mb-1"><strong>Requested by / ยื่นคำร้องโดย:</strong></p>
                    <div class="signature-line mb-2">
                      <span>Signature (Requester)</span>
                      <input type="text" class="form-control d-inline-block w-100 mt-2" placeholder="Signature"
                        v-model="form.requesterSignature" />
                    </div>

                    <div class="row mb-2">
                      <div class="col-6">
                        <p class="mb-0">Date:</p>
                        <input type="date" class="form-control" v-model="form.requestedByDate" />
                      </div>
                    </div>

                    <p class="mb-1">
                      <strong>Full Name / ชื่อ-นามสกุล:</strong>
                      <input type="text" class="form-control d-inline-block w-100 mt-2" placeholder="Full Name"
                        v-model="form.requesterFullName" />
                    </p>
                  </div>

                  <div class="col-md-6">
                    <p class="mb-1"><strong>Supervisor Approval / อนุมัติโดยหัวหน้างาน:</strong></p>

                    <div class="signature-line mb-2">
                      <span>Signature (Supervisor/Manager)</span>
                      <input type="text" class="form-control d-inline-block w-100 mt-2" placeholder="Signature"
                        v-model="form.supervisorSignature" />
                    </div>

                    <div class="row mb-2">
                      <div class="col-6">
                        <p class="mb-0">Date:</p>
                        <input type="date" class="form-control" v-model="form.approvedByDate" />
                      </div>
                    </div>

                    <p class="mb-1">
                      <strong>Full Name / ชื่อ-นามสกุล:</strong>
                      <input type="text" class="form-control d-inline-block w-100 mt-2" placeholder="Full Name"
                        v-model="form.supervisorFullName" />
                    </p>
                  </div>
                </div>

                <div class="row mt-4">
                  <div class="col-md-6">
                    <p class="mb-1"><strong>Site Administrator/HR Approval / อนุมัติโดยผู้บริหารระดับพื้นที่ /
                        ฝ่ายบุคคล:</strong></p>
                    <div class="signature-line mb-2">
                      <span>Signature (HR)</span>
                      <input type="text" class="form-control d-inline-block w-100 mt-2" placeholder="Signature"
                        v-model="form.hrSignature" />
                    </div>
                    <div class="row mb-2">
                      <div class="col-6">
                        <p class="mb-0">Date:</p>
                        <input type="date" class="form-control" v-model="form.approvedHRDate" />
                      </div>
                    </div>
                    <p class="mb-1">
                      <strong>Full Name / ชื่อ-นามสกุล:</strong>
                      <input type="text" class="form-control d-inline-block w-100 mt-2" placeholder="Full Name"
                        v-model="form.hrFullName" />
                    </p>
                  </div>
                </div>

                <!-- Footer Note -->
                <div class="alert alert-secondary mt-4" role="alert">
                  <h5 class="text-danger">Remark</h5>
                  <p class="mb-1 text-danger">
                    * If staff cannot return according to the leave request form, he/she needs to inform
                    his/her supervisor at least 1 day in advance. Otherwise, it will be considered as absence without
                    leave.
                  </p>
                  <p class="mb-0 text-danger">
                    * หากไม่สามารถกลับเข้าทำงานได้ตามวันที่ระบุในใบลา จะต้องแจ้งหัวหน้างานล่วงหน้าอย่างน้อย 1 วัน
                    มิฉะนั้นจะถือว่าขาดงาน
                  </p>
                </div>

                <!-- Submit Button -->
                <div class="text-center">
                  <button type="submit" class="btn btn-primary px-4">
                    Submit
                  </button>
                </div>
              </form>

              <!-- Organization Info (Optional) -->
              <hr class="mt-4" />
              <footer class="text-muted text-center">
                <small>
                  Shoklo Malaria Research Unit | PO Box 46 | Mae Sot, Tak 63110 |
                  Thailand Tel: +66 55 531 XXX, +66 55 545 XXX | Fax: +66 55 531 XXX
                </small>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
  name: "LeaveRequestForm",
  data() {
    return {
      form: {
        date: "",
        name: "",
        position: "",
        staffId: "",
        department: "",
        site: "",
        hiringDate: "",
        firstDayLeave: "",
        returnToWork: "",
        totalDays: null,
        // Reason checkboxes and their numeric inputs
        annualVacation: false,
        annualVacationDays: null,
        annualVacationRemain: null,
        traditionalDayOff: false,
        traditionalDayOffDays: null,
        traditionalDayOffRemain: null,
        sickLeave: false,
        sickLeaveDays: null,
        sickLeaveRemain: null,
        maternityLeave: false,
        personalBusinessLeave: false,
        compassionateLeave: false,
        others: false,
        othersReason: "",
        // Signatures dates
        requestedByDate: "",
        approvedByDate: "",
        notedByDate: "",
        approvedHRDate: ""
      }
    };
  },
  methods: {
    submitForm() {
      // Process form data (e.g., API call)
      const modalEl = document.getElementById("add_leaves");
      const modalInstance = Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
      // Redirect or further process after submission
      this.$router.push("/leave/admin/leaves-admin");
    }
  }
};
</script>

<style scoped>
/* Adjust inline input spacing */
.form-control-inline {
  display: inline-block;
  width: auto;
}

/* Flex container for checkboxes and inputs */
.reason-input {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* Set a fixed width for numeric inputs within reasons */
.reason-input input[type="number"] {
  width: 60px;
  margin: 0 0.5rem;
}

/* Signature line styling */
.signature-line {
  border-top: 1px solid #000;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;
}

/* Adjust modal dialog width if needed */
.modal-dialog.modal-lg {
  max-width: 60%;
}
</style>

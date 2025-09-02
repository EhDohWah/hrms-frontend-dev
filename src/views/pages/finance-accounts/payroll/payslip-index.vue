<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="mb-2">
            <a href="javascript:void(0);" class="btn btn-dark d-flex align-items-center" @click="generatePDF">
              <i class="ti ti-download me-2"></i>Download
            </a>
          </div>
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" class="" data-bs-toggle="tooltip" data-bs-placement="top"
              data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Payslip Document -->
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body" ref="payslipRef">
              <!-- Payslip Content -->
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                  <img src="@/assets/img/smru-logo.png" class="img-fluid" alt="logo" />
                  <div class="institution ps-3">
                    <div>Shoklo Malaria Research Unit<br>
                      Faculty of Tropical Medicine, Mahidol University<br>
                      78/1 Moo 5, Mae Ramat, Mae Ramat, Tak 63140</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="text-end mb-3">
                    <h5 class="text-gray mb-1">
                      Payslip No <span class="text-primary"> #PS4283</span>
                    </h5>
                    <p class="fw-medium">
                      Salary Month : <span class="text-dark">October 2024</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Staff Info Table -->
              <table class="table mt-4">
                <tr>
                  <td class="text-end border-0" colspan="7">Date: DD/MM/YYYY</td>
                </tr>
                <tr>
                  <td class="border-0" colspan="2">Staff ID: 1234</td>
                  <td class="border-0" colspan="2">Name: Mr. AAAAAAAA</td>
                  <td class="border-0" colspan="2">Position: xxxxxxx</td>
                </tr>
                <tr>
                  <td class="border-0" colspan="2">Grant code:</td>
                  <td class="border-0" colspan="2">Grant name: XXXXXX</td>
                  <td class="border-0">BL: xxxxxxx</td>
                  <td class="border-0">Basic Salary: 11,111.00</td>
                  <td class="border-0">FTE: xx%</td>
                </tr>
              </table>

              <!-- Income / Deductions Table -->
              <table class="table">
                <tr class="table-secondary fw-bold text-center">
                  <td colspan="4">INCOME</td>
                  <td colspan="2">DEDUCTIONS</td>
                </tr>
                <tr>
                  <td colspan="6">&nbsp;</td>
                </tr>
                <tr class="fw-bold">
                  <td>Detail</td>
                  <td class="text-end">THB</td>
                  <td>Detail</td>
                  <td class="text-end">THB</td>
                  <td>Detail</td>
                  <td class="text-end">THB</td>
                </tr>
                <tr>
                  <td class="text-start border-bottom-0 border-top-0">Salary</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                  <td class="fw-bold border-bottom-0 border-top-0">Other:</td>
                  <td class="text-end border-bottom-0 border-top-0"></td>
                  <td class="text-start border-bottom-0 border-top-0">Provident fund staff 7.5%</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                </tr>
                <tr>
                  <td class="text-start border-bottom-0 border-top-0">13-month salary</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                  <td class="text-start border-bottom-0 border-top-0">Provident fund: SMRU 7.5%</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                  <td class="text-start border-bottom-0 border-top-0">Social security staff 5%</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                </tr>
                <tr>
                  <td class="text-start border-bottom-0 border-top-0">Retroactive Salary</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                  <td class="text-start border-bottom-0 border-top-0">Social security: SMRU 5%</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                  <td class="text-start border-bottom-0 border-top-0">Health Welfare staff</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                </tr>
                <tr>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0">Health Welfare: SMRU</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                  <td class="border-bottom-0 border-top-0">Tax</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                </tr>
                <tr>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0">Provident fund SMRU 7.5%</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                </tr>
                <tr>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0">Social security SMRU 5%</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                </tr>
                <tr>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0"></td>
                  <td class="border-bottom-0 border-top-0">Health Welfare SMRU</td>
                  <td class="text-end border-bottom-0 border-top-0">0.00</td>
                </tr>
                <tr class="fw-bold">
                  <td>Total</td>
                  <td class="text-end">0.00</td>
                  <td>Total</td>
                  <td class="text-end">0.00</td>
                  <td>Total</td>
                  <td class="text-end">0.00</td>
                </tr>
                <tr class="table-secondary fw-bold">
                  <td colspan="3" class="text-center">Grand total: Salary & Benefit</td>
                  <td class="text-end">0.00</td>
                  <td colspan="2" rowspan="2">Staff Signature:</td>
                </tr>
                <tr>
                  <td colspan="3" class="text-center">Net Paid</td>
                  <td class="text-end">0.00</td>
                </tr>
                <tr>
                  <td colspan="3">Pay method: xxxxxx</td>
                  <td></td>
                  <td colspan="2"></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- /Payslip Document -->
    </div>

    <!-- Footer -->
    <div class="footer d-sm-flex align-items-center justify-content-between bg-white border-top p-3">
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>Designed & Developed By <a href="javascript:void(0);" class="text-primary">Dreams</a></p>
    </div>
    <!-- /Footer -->
  </div>
</template>

<script>
// import html2pdf from 'html2pdf.js';

export default {
  data() {
    return {
      title: "Payslip",
      text: "HR",
      text1: "Payslip",
    };
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
    // generatePDF() {
    //   const element = this.$refs.payslipRef;
    //   const opt = {
    //     margin: 0.2,
    //     filename: 'payslip.pdf',
    //     image: { type: 'jpeg', quality: 0.98 },
    //     html2canvas: { scale: 2 },
    //     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    //   };
    //   html2pdf().set(opt).from(element).save();
    // },
  },
};
</script>

<style scoped>
.logo {
  background: black;
  color: yellow;
  font-size: 32px;
  font-weight: bold;
  width: 120px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  text-align: right;
  font-weight: bold;
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #000;
  padding: 6px;
  vertical-align: top;
}

.table td.border-0 {
  border: none !important;
}
</style>

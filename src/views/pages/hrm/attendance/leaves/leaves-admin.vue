<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div
        class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3"
      >
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-pdf me-1"></i>Export as PDF</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-2">
            <a
              href="javascript:void(0);"
              data-bs-toggle="modal"
              data-bs-target="#add_leaves"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Add Leave</a
            >
          </div>
          <div class="head-icons ms-2">
            <a
              href="javascript:void(0);"
              class=""
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-original-title="Collapse"
              id="collapse-header"
              @click="toggleHeader"
            >
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Leaves Info -->
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <div class="card bg-green-img">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                    <span
                      class="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center"
                    >
                      <i class="ti ti-user-check text-success fs-18"></i>
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <p class="mb-1">Total Present</p>
                  <h4>180/200</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="card bg-pink-img">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                    <span
                      class="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center"
                    >
                      <i class="ti ti-user-edit text-pink fs-18"></i>
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <p class="mb-1">Planned Leaves</p>
                  <h4>10</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="card bg-yellow-img">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                    <span
                      class="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center"
                    >
                      <i class="ti ti-user-exclamation text-warning fs-18"></i>
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <p class="mb-1">Unplanned Leaves</p>
                  <h4>10</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="card bg-blue-img">
            <div class="card-body">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0 me-2">
                    <span
                      class="avatar avatar-md rounded-circle bg-white d-flex align-items-center justify-content-center"
                    >
                      <i class="ti ti-user-question text-info fs-18"></i>
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <p class="mb-1">Pending Requests</p>
                  <h4>15</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Leaves Info -->

      <!-- Leaves list -->
      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>Leave List</h5>
          <div
            class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3"
          >
            <div class="me-3">
              <div class="input-icon-end position-relative">
                <input
                  type="text"
                  class="form-control date-range bookingrange"
                  ref="dateRangeInput"
                  placeholder="dd/mm/yyyy - dd/mm/yyyy"
                />
                <span class="input-icon-addon">
                  <i class="ti ti-chevron-down"></i>
                </span>
              </div>
            </div>
            <div class="dropdown me-3">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                Leave Type
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Medical Leave</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Casual Leave</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Annual Leave</a
                  >
                </li>
              </ul>
            </div>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                Sort By : Last 7 Days
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Recently Added</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Ascending</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Desending</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Last Month</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Last 7 Days</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <a-table
              class="table datatable thead-light"
              :columns="columns"
              :data-source="data"
              :row-selection="rowSelection"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'Employee'">
                  <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md border avatar-rounded">
                      <img
                        :src="require(`@/assets/img/users/${record.Image}`)"
                        class="img-fluid"
                        alt="img"
                      />
                    </a>
                    <div class="ms-2">
                      <h6 class="fw-medium">
                        <a href="javascript:void(0);">{{ record.Employee }}</a>
                      </h6>
                      <span class="fs-12 fw-normal">{{ record.Roll }}</span>
                    </div>
                  </div>
                </template>
                <template v-if="column.key === 'Leave_Type'">
                  <div class="d-flex align-items-center">
                    <p class="fs-14 fw-medium d-flex align-items-center mb-0">
                      {{ record.Leave_Type }}
                    </p>
                    <a
                      href="javascript:void(0);"
                      class="ms-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      data-bs-title="I am currently experiencing a fever and design & Development"
                    >
                      <i class="ti ti-info-circle text-info"></i>
                    </a>
                  </div>
                </template>
                <template v-if="column.key === 'Status'">
                  <span :class="getStatusClass(record.Status)">{{ record.Status }}</span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_leaves"
                      ><i class="ti ti-edit"></i
                    ></a>
                    <a
                      href="javascript:void(0);"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                      ><i class="ti ti-trash"></i
                    ></a>
                  </div>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <!-- /Leaves list -->
    </div>
    <layout-footer></layout-footer>
  </div>
  <!-- /Page Wrapper -->

  <leaves-admin-modal></leaves-admin-modal>
</template>



<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";


const data = [
  {
    Image: "user-32.jpg",
    Employee: "Anthony Lewis",
    Roll: "Finance",
    Leave_Type: "Medical Leave",
    From: "14 Jan 2024",
    To: "15 Jan 2024",
    No_of_Days: "2 Days",
    Status: "Pending"
  },
  {
    Image: "user-09.jpg",
    Employee: "Brian Villalobos",
    Roll: "Developer",
    Leave_Type: "Casual Leave",
    From: "21 Jan 2024",
    To: "25 Jan 2024",
    No_of_Days: "5 Days",
    Status: "Approved"
  },
  {
    Image: "user-01.jpg",
    Employee: "Harvey Smith",
    Roll: "Developer",
    Leave_Type: "Medical Leave",
    From: "20 Feb 2024",
    To: "22 Feb 2024",
    No_of_Days: "3 Days",
    Status: "Declined"
  },
  {
    Image: "user-33.jpg",
    Employee: "Stephan Peralt",
    Roll: "Executive Officer",
    Leave_Type: "Annual Leave",
    From: "15 Mar 2024",
    To: "17 Mar 2024",
    No_of_Days: "3 Days",
    Status: "Approved"
  },
  {
    Image: "user-34.jpg",
    Employee: "Doglas Martini",
    Roll: "Manager",
    Leave_Type: "Casual Leave",
    From: "12 Apr 2024",
    To: "16 Apr 2024",
    No_of_Days: "5 Days",
    Status: "Pending"
  },
  {
    Image: "user-02.jpg",
    Employee: "Linda Ray",
    Roll: "Finance",
    Leave_Type: "Medical Leave",
    From: "20 May 2024",
    To: "21 May 2024",
    No_of_Days: "2 Days",
    Status: "Approved"
  },
  {
    Image: "user-35.jpg",
    Employee: "Elliot Murray",
    Roll: "Developer",
    Leave_Type: "Casual Leave",
    From: "06 Jul 2024",
    To: "06 Jul 2024",
    No_of_Days: "1 Day",
    Status: "Pending"
  },
  {
    Image: "user-36.jpg",
    Employee: "Rebecca Smtih",
    Roll: "Executive",
    Leave_Type: "Medical Leave",
    From: "02 Sep 2024",
    To: "04 Sep 2024",
    No_of_Days: "3 Days",
    Status: "Approved"
  },
  {
    Image: "user-37.jpg",
    Employee: "Connie Waters",
    Roll: "Developer",
    Leave_Type: "Annual Leave",
    From: "15 Nov 2024",
    To: "15 Nov 2024",
    No_of_Days: "1 Day",
    Status: "Declined"
  },
  {
    Image: "user-38.jpg",
    Employee: "Lori Broaddus",
    Roll: "Finance",
    Leave_Type: "Casual Leave",
    From: "10 Dec 2024",
    To: "11 Dec 2024",
    No_of_Days: "2 Days",
    Status: "Pending"
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Employee",
    dataIndex: "Employee",
    key: "Employee",
    sorter: {
      compare: (a, b) => {
        a = a.Employee.toLowerCase();
        b = b.Employee.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Leave Type",
    dataIndex: "Leave_Type",
    key: "Leave_Type",
    sorter: {
      compare: (a, b) => {
        a = a.Leave_Type.toLowerCase();
        b = b.Leave_Type.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "From",
    dataIndex: "From",
    sorter: {
      compare: (a, b) => {
        a = a.From.toLowerCase();
        b = b.From.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "To",
    dataIndex: "To",
    sorter: {
      compare: (a, b) => {
        a = a.To.toLowerCase();
        b = b.To.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "No of Days",
    dataIndex: "No_of_Days",
    sorter: {
      compare: (a, b) => {
        a = a.No_of_Days.toLowerCase();
        b = b.No_of_Days.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Status",
    dataIndex: "Status",
    key: "Status",
    sorter: {
      compare: (a, b) => {
        a = a.Status.toLowerCase();
        b = b.Status.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "",
    key: "action",
    sorter: true,
  },
];

export default {
  data() {
    return {
      title: "Leaves",
      text: "Employee",
      text1: "Leaves",
      leaveStatus: ["Pending", "Approved", "Declined"],
      data,
      columns,
    };
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
    getStatusClass(status) {
      switch(status) {
        case 'Approved':
          return 'badge bg-success-light text-success';
        case 'Pending':
          return 'badge bg-warning-light text-warning';
        case 'Declined':
          return 'badge bg-danger-light text-danger';
        default:
          return 'badge bg-secondary-light text-secondary';
      }
    }
  },
  setup() {
    const dateRangeInput = ref(null);

    function booking_range(start, end) {
      return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
    }

    onMounted(() => {
      if (dateRangeInput.value) {
        const start = moment().subtract(6, "days");
        const end = moment();

        new DateRangePicker(
          dateRangeInput.value,
          {
            startDate: start,
            endDate: end,
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              "Last 7 Days": [moment().subtract(6, "days"), moment()],
              "Last 30 Days": [moment().subtract(29, "days"), moment()],
              "This Month": [moment().startOf("month"), moment().endOf("month")],
              "Last Month": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
              ],
            },
          },
          booking_range
        );

        booking_range(start, end);
      }
    });

    return {
      dateRangeInput,
    };
  },
};
</script>



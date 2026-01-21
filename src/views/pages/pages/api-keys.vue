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
        <breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="mb-2">
            <a
              href="javascript:void(0);"
              data-bs-toggle="modal"
              data-bs-target="#add_key"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Add Key</a
            >
          </div>
          <div class="ms-2 head-icons">
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

      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>API Keys List</h5>
          <div
            class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3"
          >
            <div class="dropdown me-3">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                Select Status
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Success</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Rejected</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Warning</a
                  >
                </li>
              </ul>
            </div>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
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
                <template v-if="column.key === 'CreatedBy'">
                  <div class="d-flex align-items-center file-name-icon">
                    <a
                      href="javascript:void(0);"
                      class="avatar avatar-md border avatar-rounded"
                    >
                      <img
                        :src="getUserAvatar(record.Image)"
                        class="img-fluid"
                        alt="img"
                      />
                    </a>
                    <div class="ms-2">
                      <h6 class="fw-medium">
                        <a href="javascript:void(0);">{{ record.CreatedBy }}</a>
                      </h6>
                    </div>
                  </div>
                </template>
                <template v-if="column.key === 'APIKey'">
                  <div class="d-flex align-items-center">
                    <p class="me-2 mb-0">{{ record.APIKey }}</p>
                    <span><i class="ti ti-clipboard"></i></span>
                  </div>
                </template>
                <template v-if="column.key === 'Status'">
                  <span
                    :class="[
                      'badge',
                      record.Status === 'Success'
                        ? 'badge-success'
                        : record.Status === 'Rejected'
                        ? 'badge-danger'
                        : record.Status === 'Warning'
                        ? 'badge-warning'
                        : 'd-inline-flex',
                      'align-items-center',
                      'badge-xs',
                    ]"
                  >
                    <i class="ti ti-point-filled me-1"></i>
                    {{ record.Status }}
                  </span>
                </template>
                <template v-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <a
                      href="javascript:void(0);"
                      class="me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_key"
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
    </div>

    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <api-keys-modal></api-keys-modal>
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const columns = [
  {
    sorter: false,
  },
  {
    title: "Service Name",
    dataIndex: "ServiceName",
    sorter: {
      compare: (a, b) => {
        a = a.ServiceName.toLowerCase();
        b = b.ServiceName.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Created By",
    dataIndex: "CreatedBy",
    key: "CreatedBy",
    sorter: {
      compare: (a, b) => {
        a = a.CreatedBy.toLowerCase();
        b = b.CreatedBy.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "API key",
    dataIndex: "APIKey",
    key: "APIKey",
    sorter: {
      compare: (a, b) => {
        a = a.APIKey.toLowerCase();
        b = b.APIKey.toLowerCase();
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
    title: "Created Date",
    dataIndex: "CreatedDate",
    key: "CreatedDate",
    sorter: {
      compare: (a, b) => {
        a = a.CreatedDate.toLowerCase();
        b = b.CreatedDate.toLowerCase();
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
const data = [
  {
    ServiceName: "Paytm",
    CreatedBy: "Anthony Lewis",
    APIKey: "paytm1234567890abcdef",
    Status: "Success",
    CreatedDate: "14 Jan 2024",
    Image: "user-32.jpg",
  },
  {
    ServiceName: "Paytm",
    CreatedBy: "Brian Villalobos",
    APIKey: "paytm1234567890abcdef",
    Status: "Rejected",
    CreatedDate: "21 Jan 2024",
    Image: "user-09.jpg",
  },
  {
    ServiceName: "Paytm",
    CreatedBy: "Harvey Smith",
    APIKey: "paytm1234567890abcdef",
    Status: "Success",
    CreatedDate: "20 Feb 2024",
    Image: "user-01.jpg",
  },
  {
    ServiceName: "Paytm",
    CreatedBy: "Stephan Peralt",
    APIKey: "paytm1234567890abcdef",
    Status: "Success",
    CreatedDate: "15 Mar 2024",
    Image: "user-33.jpg",
  },
  {
    ServiceName: "Paytm",
    CreatedBy: "Doglas Martini",
    APIKey: "paytm1234567890abcdef",
    Status: "Warning",
    CreatedDate: "12 Apr 2024",
    Image: "user-34.jpg",
  },
  {
    ServiceName: "Paytm",
    CreatedBy: "Linda Ray",
    APIKey: "paytm1234567890abcdef",
    Status: "Success",
    CreatedDate: "20 Apr 2024",
    Image: "user-02.jpg",
  },
  {
    ServiceName: "Paytm",
    CreatedBy: "Elliot Murray",
    APIKey: "paytm1234567890abcdef",
    Status: "Warning",
    CreatedDate: "06 Jul 2024",
    Image: "user-35.jpg",
  },
  {
    ServiceName: "Paytm",
    CreatedBy: "Rebecca Smtih",
    APIKey: "paytm1234567890abcdef",
    Status: "Rejected",
    CreatedDate: "02 Sep 2024",
    Image: "user-36.jpg",
  },
  {
    ServiceName: "Paytm",
    CreatedBy: "Connie Waters",
    APIKey: "paytm1234567890abcdef",
    Status: "Success",
    CreatedDate: "15 Nov 2024",
    Image: "user-37.jpg",
  },
  {
    ServiceName: "Paytm",
    CreatedBy: "Lori Broaddus",
    APIKey: "paytm1234567890abcdef",
    Status: "Success",
    CreatedDate: "10 Dec 2024",
    Image: "user-38.jpg",
  },
];
const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};
export default {
  data() {
    return {
      data,
      columns,
      rowSelection,
      title: "API Keys",
      text: "Pages",
      text1: "API Keys",
    };
  },
  setup() {
    const dateRangeInput = ref(null);

    // Move the function declaration outside of the onMounted callback
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
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>

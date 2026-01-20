<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Leave_Type: "Medical Leave",
    Image: "user-34.jpg",
    From: "14 Jan 2024",
    Approved_By: "Doglas Martini",
    Roll: "Manager",
    To: "15 Jan 2024",
    No_of_Days: "2 Days",
    Status: "Approved",
  },
  {
    Leave_Type: "Annual Leave",
    Image: "user-34.jpg",
    From: "21 Jan 2024",
    Approved_By: "Doglas Martini",
    Roll: "Manager",
    To: "25 Jan 2024",
    No_of_Days: "5 Days",
    Status: "Approved",
  },
  {
    Leave_Type: "Medical Leave",
    Image: "user-58.jpg",
    From: "20 Feb 2024",
    Approved_By: "Warren Morales",
    Roll: "Admin",
    To: "22 Feb 2024",
    No_of_Days: "3 Days",
    Status: "Approved",
  },
  {
    Leave_Type: "Annual Leave",
    Image: "user-34.jpg",
    From: "15 Mar 2024",
    Approved_By: "Doglas Martini",
    Roll: "Manager",
    To: "17 Mar 2024",
    No_of_Days: "3 Days",
    Status: "Approved",
  },
  {
    Leave_Type: "Casual Leave",
    Image: "user-34.jpg",
    From: "12 Apr 2024",
    Approved_By: "Doglas Martini",
    Roll: "Manager",
    To: "16 Apr 2024",
    No_of_Days: "5 Days",
    Status: "Declined",
  },
  {
    Leave_Type: "Medical Leave",
    Image: "user-58.jpg",
    From: "20 May 2024",
    Approved_By: "Warren Morales",
    Roll: "Admin",
    To: "21 May 2024",
    No_of_Days: "2 Days",
    Status: "Declined",
  },
  {
    Leave_Type: "Casual Leave",
    Image: "user-34.jpg",
    From: "06 Jun 2024",
    Approved_By: "Doglas Martini",
    Roll: "Manager",
    To: "06 Jun 2024",
    No_of_Days: "1 Days",
    Status: "Approved",
  },
  {
    Leave_Type: "Medical Leave",
    Image: "user-34.jpg",
    From: "02 Sep 2024",
    Approved_By: "Doglas Martini",
    Roll: "Manager",
    To: "04 Sep 2024",
    No_of_Days: "3 Days",
    Status: "New",
  },
  {
    Leave_Type: "Annual Leave",
    Image: "user-58.jpg",
    From: "15 Nov 2024",
    Approved_By: "Warren Morales",
    Roll: "Admin",
    To: "15 Nov 2024",
    No_of_Days: "1 Days",
    Status: "New",
  },
  {
    Leave_Type: "Casual Leave",
    Image: "user-34.jpg",
    From: "10 Dec 2024",
    Approved_By: "Doglas Martini",
    Roll: "Manager",
    To: "11 Dec 2024",
    No_of_Days: "2 Days",
    Status: "New",
  },
];

const columns = [
  {
    sorter: false,
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
    title: "Approved By",
    dataIndex: "Approved_By",
    key: "Approved_By",
    sorter: {
      compare: (a, b) => {
        a = a.Approved_By.toLowerCase();
        b = b.Approved_By.toLowerCase();
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
    };
  },
};
</script>

<template>
  <a-table
    class="table datatable thead-light"
    :columns="columns"
    :data-source="data"
    :row-selection="rowSelection"
  >
    <template #bodyCell="{ column, record }">
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
            data-bs-title="I am currently experiencing a fever and
                    feeling unwell."
          >
            <i class="ti ti-info-circle text-info"></i>
          </a>
        </div>
      </template>
      <template v-if="column.key === 'Approved_By'">
        <div class="d-flex align-items-center file-name-icon">
          <a href="javascript:void(0);" class="avatar avatar-md border avatar-rounded">
            <img
              :src="getUserAvatar(record.Image)"
              class="img-fluid"
              alt="img"
            />
          </a>
          <div class="ms-2">
            <h6 class="fw-medium">
              <a href="javascript:void(0);">{{ record.Approved_By }}</a>
            </h6>
            <span class="fs-12 fw-normal">{{ record.Roll }}</span>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'Status'">
        <div class="dropdown">
          <a
            href="javascript:void(0);"
            class="dropdown-toggle btn btn-sm btn-white d-inline-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            <span
              class="rounded-circle d-flex justify-content-center align-items-center me-2"
              :class="[
                record.Status === 'Approved'
                  ? 'bg-transparent-success'
                  : record.Status === 'Declined'
                  ? 'bg-transparent-danger'
                  : 'bg-transparent-purple',
              ]"
            >
              <i
                class="ti ti-point-filled"
                :class="[
                  record.Status === 'Approved'
                    ? 'text-success'
                    : record.Status === 'Declined'
                    ? 'text-danger'
                    : 'text-purple',
                ]"
              >
              </i
            ></span>
            {{ record.Status }}
          </a>
          <ul class="dropdown-menu dropdown-menu-end p-3">
            <li>
              <a
                href="javascript:void(0);"
                class="dropdown-item rounded-1 d-flex justify-content-start align-items-center"
                ><span
                  class="rounded-circle bg-transparent-success d-flex justify-content-center align-items-center me-2"
                  ><i class="ti ti-point-filled text-success"></i></span
                >Approved</a
              >
            </li>
            <li>
              <a
                href="javascript:void(0);"
                class="dropdown-item rounded-1 d-flex justify-content-start align-items-center"
                ><span
                  class="rounded-circle bg-transparent-danger d-flex justify-content-center align-items-center me-2"
                  ><i class="ti ti-point-filled text-danger"></i></span
                >Declined</a
              >
            </li>
            <li>
              <a
                href="javascript:void(0);"
                class="dropdown-item rounded-1 d-flex justify-content-start align-items-center"
                ><span
                  class="rounded-circle bg-transparent-purple d-flex justify-content-center align-items-center me-2"
                  ><i class="ti ti-point-filled text-purple"></i></span
                >New</a
              >
            </li>
          </ul>
        </div>
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
</template>

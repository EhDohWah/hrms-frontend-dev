<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Image: "user-32.jpg",
    Employee: "Anthony Lewis",
    Roll: "Finance",
    Leave_Type: "Medical Leave",
    From: "14 Jan 2024",
    To: "15 Jan 2024",
    No_of_Days: "2 Days",
  },
  {
    Image: "user-09.jpg",
    Employee: "Brian Villalobos",
    Roll: "Developer",
    Leave_Type: "Casual Leave",
    From: "21 Jan 2024",
    To: "25 Jan 2024",
    No_of_Days: "5 Days",
  },
  {
    Image: "user-01.jpg",
    Employee: "Harvey Smith",
    Roll: "Developer",
    Leave_Type: "Medical Leave",
    From: "20 Feb 2024",
    To: "22 Feb 2024",
    No_of_Days: "3 Days",
  },
  {
    Image: "user-33.jpg",
    Employee: "Stephan Peralt",
    Roll: "Executive Officer",
    Leave_Type: "Annual Leave",
    From: "15 Mar 2024",
    To: "17 Mar 2024",
    No_of_Days: "3 Days",
  },
  {
    Image: "user-34.jpg",
    Employee: "Doglas Martini",
    Roll: "Manager",
    Leave_Type: "Casual Leave",
    From: "12 Apr 2024",
    To: "16 Apr 2024",
    No_of_Days: "5 Days",
  },
  {
    Image: "user-02.jpg",
    Employee: "Linda Ray",
    Roll: "Finance",
    Leave_Type: "Medical Leave",
    From: "20 May 2024",
    To: "21 May 2024",
    No_of_Days: "2 Days",
  },
  {
    Image: "user-35.jpg",
    Employee: "Elliot Murray",
    Roll: "Developer",
    Leave_Type: "Casual Leave",
    From: "06 Jul 2024",
    To: "06 Jul 2024",
    No_of_Days: "1 Day",
  },
  {
    Image: "user-36.jpg",
    Employee: "Rebecca Smtih",
    Roll: "Executive",
    Leave_Type: "Medical Leave",
    From: "02 Sep 2024",
    To: "04 Sep 2024",
    No_of_Days: "3 Days",
  },
  {
    Image: "user-37.jpg",
    Employee: "Connie Waters",
    Roll: "Developer",
    Leave_Type: "Annual Leave",
    From: "15 Nov 2024",
    To: "15 Nov 2024",
    No_of_Days: "1 Day",
  },
  {
    Image: "user-38.jpg",
    Employee: "Lori Broaddus",
    Roll: "Finance",
    Leave_Type: "Casual Leave",
    From: "10 Dec 2024",
    To: "11 Dec 2024",
    No_of_Days: "2 Days",
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
      <template v-if="column.key === 'Employee'">
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
